// Mix voice + music bed + sound effects from timeline.audio.
// Music is ducked under speech (audio.music.underVoiceDb vs gapsDb, relative to a
// -14 LUFS normalized bed) and drops out during 'dips' (short silences before key lines).
import path from 'node:path';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { SR, decodeAudio, writeWav } from './util.mjs';
import { BUILTIN, musicBed } from './sounds.mjs';

const db = x => Math.pow(10, x / 20);

function movingMean(x, win) {
  const out = new Float32Array(x.length); let acc = 0; const h = Math.floor(win / 2);
  const pre = new Float64Array(x.length + 1);
  for (let i = 0; i < x.length; i++) pre[i + 1] = pre[i] + x[i];
  for (let i = 0; i < x.length; i++) { const a = Math.max(0, i - h), b = Math.min(x.length, i + h); out[i] = (pre[b] - pre[a]) / win; }
  return out;
}

export async function mix(tl, { voice, sfxDir, music, out }) {
  const au = tl.audio || {}, T = tl.duration, N = Math.round(T * SR);
  const L = new Float32Array(N), R = new Float32Array(N);

  // voice: trim at voiceEnd with an 80 ms fade
  const v = await decodeAudio(voice);
  const end = Math.min(v[0].length, Math.round((tl.voiceEnd ?? T) * SR)), f = Math.min(end, Math.round(0.08 * SR));
  for (let i = 0; i < end && i < N; i++) { const g = i >= end - f ? (end - i) / f : 1; L[i] += v[0][i] * g; R[i] += v[1][i] * g; }

  const m = au.music;
  if (m) {
    const src = music || m.source || 'synth';
    let bed;
    if (src === 'synth') {
      const dir = mkdtempSync(path.join(tmpdir(), 'fsd-')); const raw = path.join(dir, 'bed.wav');
      writeWav(raw, musicBed(T + 1));
      bed = await decodeAudio(raw, { af: 'loudnorm=I=-14:TP=-1.5' });
      rmSync(dir, { recursive: true, force: true });
    } else {
      bed = await decodeAudio(src, { af: 'highpass=f=90,lowpass=f=6500,loudnorm=I=-14:TP=-1.5' });
    }
    // ducking envelope from the voice
    const sq = new Float32Array(N); for (let i = 0; i < N; i++) { const x = (L[i] + R[i]) / 2; sq[i] = x * x; }
    const env = movingMean(sq, Math.round(0.05 * SR));
    const speech = new Float32Array(N); for (let i = 0; i < N; i++) speech[i] = 10 * Math.log10(env[i] + 1e-18) > -38 ? 1 : 0;
    const duck = movingMean(speech, Math.round(0.25 * SR));
    const gG = db(m.gapsDb ?? -12), gV = db(m.underVoiceDb ?? -21), fi = m.fadeIn ?? 0.3, fo = m.fadeOut ?? 0.8, dips = m.dips || [];
    for (let i = 0; i < N; i++) {
      const t = i / SR; let g = gG * (1 - duck[i]) + gV * duck[i];
      for (const [d0, d1] of dips) if (t >= d0 - 0.08 && t <= d1) g *= 1 - 0.95 * Math.min(1, (t - (d0 - 0.08)) / 0.08);
      g *= Math.min(1, t / fi) * Math.min(1, Math.max(0, (T - t) / fo));
      const j = i % bed[0].length;
      L[i] += bed[0][j] * g; R[i] += bed[1][j] * g;
    }
  }

  // sound effects
  const files = au.sfxFiles || {}, cache = {};
  for (const ev of au.sfx || []) {
    if (!cache[ev.sound]) {
      if (BUILTIN[ev.sound]) cache[ev.sound] = BUILTIN[ev.sound]();
      else {
        const x = await decodeAudio(path.join(sfxDir || '.', files[ev.sound] || ev.sound));
        let pk = 0; for (const c of x) for (const s of c) pk = Math.max(pk, Math.abs(s));
        cache[ev.sound] = x.map(c => c.map(s => s / (pk || 1)));
      }
    }
    const x = cache[ev.sound], g = db(ev.db ?? -18), i0 = Math.round(ev.at * SR);
    for (let i = 0; i < x[0].length && i0 + i < N; i++) { L[i0 + i] += x[0][i] * g; R[i0 + i] += x[1][i] * g; }
  }

  let pk = 0; for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
  if (pk > 0.97) for (let i = 0; i < N; i++) { L[i] *= 0.97 / pk; R[i] *= 0.97 / pk; }
  writeWav(out, [L, R]);
  return out;
}
