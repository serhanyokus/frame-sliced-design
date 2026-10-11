// Built-in synthesized sounds (no licensing needed):
//   sparkle   rising bell arpeggio ("la la la") for series stamps and outros
//   paper     short paper flip for page-flip emphasis
//   musicBed  cheerful original background bed
import { SR, rng } from './util.mjs';

const stereo = n => [new Float32Array(n), new Float32Array(n)];
function normalize(ch, peak = 1) {
  let m = 0; for (const c of ch) for (const v of c) m = Math.max(m, Math.abs(v));
  if (m > 0) for (const c of ch) for (let i = 0; i < c.length; i++) c[i] *= peak / m;
  return ch;
}

export function sparkle() {
  const n = Math.round(1.6 * SR), out = stereo(n);
  [1318.5, 1568.0, 1975.5, 2637.0, 3136.0].forEach((f, j) => {
    const off = Math.round(j * 0.075 * SR), len = Math.round(0.9 * SR);
    const pl = 0.8 + 0.1 * (j % 2), pr = 1 - 0.1 * (j % 2);
    for (let i = 0; i < len && off + i < n; i++) {
      const t = i / SR;
      let s = (Math.sin(2 * Math.PI * f * t) + 0.45 * Math.sin(2 * Math.PI * 2.756 * f * t) * Math.exp(-t * 9)
        + 0.25 * Math.sin(2 * Math.PI * 5.4 * f * t) * Math.exp(-t * 16)) * Math.exp(-t * 5.5) * Math.min(1, t / 0.004);
      out[0][off + i] += s * pl * 0.5; out[1][off + i] += s * pr * 0.5;
    }
  });
  const r = rng(1); let p0 = 0, p1 = 0;
  for (let i = 0; i < Math.round(1.2 * SR); i++) {
    const t = i / SR, a = r.normal(), b = r.normal();
    out[0][i] += (a - p0) * Math.exp(-t * 4) * 0.05; out[1][i] += (b - p1) * Math.exp(-t * 4) * 0.05; p0 = a; p1 = b;
  }
  return normalize(out);
}

export function paper(d = 0.38) {
  const n = Math.round(d * SR), r = rng(7), s = new Float32Array(n);
  let x1 = 0, x2 = 0, d1 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, x = r.normal();
    const dx = x - x1, ddx = dx - d1; x1 = x; d1 = dx; x2 = ddx;
    const flutter = 0.5 + 0.5 * Math.abs(Math.sin(2 * Math.PI * 23 * t + 3 * t));
    s[i] = x2 * Math.min(1, t / 0.03) * Math.exp(-t * 7) * flutter;
  }
  const out = [s.map(v => v * 0.9), s];
  return normalize(out);
}

export const BUILTIN = { sparkle, paper };

/** Original background bed: C-G-Am-F, marimba arpeggios, bass, soft kick/snap, shaker, pad. */
export function musicBed(seconds, bpm = 108, seed = 3) {
  const r = rng(seed), beat = 60 / bpm, bar = 4 * beat, n = Math.round(seconds * SR), out = stereo(n);
  const put = (len, gen, at, pan = 0, g = 1) => {
    const i0 = Math.round(at * SR), l = Math.cos((pan + 1) * Math.PI / 4) * 1.414 * g, rr = Math.sin((pan + 1) * Math.PI / 4) * 1.414 * g;
    for (let i = 0; i < len && i0 + i < n; i++) { const v = gen(i / SR); out[0][i0 + i] += v * l; out[1][i0 + i] += v * rr; }
  };
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const marimba = f => t => (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 7) + 0.35 * Math.sin(8 * Math.PI * f * t) * Math.exp(-t * 22)
    + 0.12 * Math.sin(20 * Math.PI * f * t) * Math.exp(-t * 40)) * Math.min(1, t / 0.002);
  const bass = f => t => (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t) + 0.08 * Math.sin(6 * Math.PI * f * t)) * Math.min(1, t / 0.005) * Math.exp(-t * 4);
  const kick = () => { let ph = 0; return t => { ph += 2 * Math.PI * (50 + 70 * Math.exp(-t * 30)) / SR; return Math.sin(ph) * Math.exp(-t * 9); }; };
  const snap = () => { let p = 0; return t => { const x = r.normal(), v = (x - p) * Math.exp(-t * 30) * 0.6; p = x; return v; }; };
  const shaker = () => { let p = 0, pd = 0; return t => { const x = r.normal(), d = x - p, dd = d - pd; p = x; pd = d; return dd * Math.exp(-t * 60) * 0.25; }; };
  const pad = (fs, d) => t => fs.reduce((s, f) => s + Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(4 * Math.PI * f * t + 0.5), 0) * Math.min(1, t / 0.4) * Math.min(1, Math.max(0, (d - t) / 0.4));
  const chords = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], roots = [36, 43, 45, 41], arp = [0, 1, 2, 1, 12, 2, 1, 2];
  for (let b = 0; b <= Math.floor(seconds / bar); b++) {
    const t0 = b * bar, c = chords[b % 4], rt = roots[b % 4];
    put(Math.round((bar + 0.1) * SR), pad(c.map(mtof), bar + 0.1), t0, 0, 0.05);
    for (let k = 0; k < 8; k++) {
      const note = arp[k] === 12 ? c[0] + 12 : c[arp[k]];
      put(Math.round(0.7 * SR), marimba(mtof(note + 12)), t0 + k * beat / 2, k % 2 ? -0.35 : 0.35, 0.22 * (k % 4 === 0 ? 1 : 0.75));
    }
    [[0, 0.45], [1.5 * beat, 0.3], [2 * beat, 0.45], [3.5 * beat, 0.25]].forEach(([off, dur], k) =>
      put(Math.round((dur + 0.2) * SR), bass(mtof(k !== 3 ? rt : rt + 7)), t0 + off, 0, 0.33));
    if (b >= 1) {
      put(Math.round(0.35 * SR), kick(), t0, 0, 0.55); put(Math.round(0.35 * SR), kick(), t0 + 2 * beat, 0, 0.5);
      put(Math.round(0.18 * SR), snap(), t0 + beat, 0.1, 0.22); put(Math.round(0.18 * SR), snap(), t0 + 3 * beat, -0.1, 0.22);
    }
    for (let k = 0; k < 16; k++) put(Math.round(0.07 * SR), shaker(), t0 + k * beat / 4, 0.5, k % 2 ? 0.9 : 0.45);
  }
  return normalize(out, 1 / 1.1);
}
