import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

export const SR = 48000;

export const loadJson = p => JSON.parse(readFileSync(p, 'utf8'));
export const clamp = x => Math.max(0, Math.min(1, x));
export const ease = x => { x = clamp(x); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };

/** Run a command; resolve with { stdout: Buffer, stderr: string }. */
export function run(cmd, args, { input, quiet = true } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    const out = []; let err = '';
    p.stdout.on('data', d => out.push(d));
    p.stderr.on('data', d => { err += d; if (!quiet) process.stderr.write(d); });
    p.on('error', reject);
    p.on('close', code => code === 0
      ? resolve({ stdout: Buffer.concat(out), stderr: err })
      : reject(new Error(`${cmd} exited ${code}: ${err.slice(-500)}`)));
    if (input) p.stdin.end(input); else p.stdin.end();
  });
}

export async function probeDuration(file) {
  const { stdout } = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]);
  return parseFloat(stdout.toString());
}

/** Decode audio to Float32 channels: returns array of Float32Array (one per channel). */
export async function decodeAudio(file, { sr = SR, channels = 2, af } = {}) {
  const args = ['-v', 'error', '-i', file];
  if (af) args.push('-af', af);
  args.push('-ac', String(channels), '-ar', String(sr), '-f', 'f32le', '-');
  const { stdout } = await run('ffmpeg', args);
  const all = new Float32Array(stdout.buffer, stdout.byteOffset, stdout.byteLength / 4);
  const n = all.length / channels;
  const ch = Array.from({ length: channels }, () => new Float32Array(n));
  for (let i = 0; i < n; i++) for (let c = 0; c < channels; c++) ch[c][i] = all[i * channels + c];
  return ch;
}

/** Write 16-bit PCM wav from channel arrays. */
export function writeWav(file, ch, sr = SR) {
  const n = ch[0].length, nc = ch.length;
  const buf = Buffer.alloc(44 + n * nc * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * nc * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(nc, 22);
  buf.writeUInt32LE(sr, 24); buf.writeUInt32LE(sr * nc * 2, 28); buf.writeUInt16LE(nc * 2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * nc * 2, 40);
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < nc; c++) { buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, ch[c][i])) * 32767), o); o += 2; }
  writeFileSync(file, buf);
}

/** Zoom factor for the base footage at time t (timeline.zoom.segments). */
export function zoomAt(tl, t) {
  for (const seg of (tl.zoom && tl.zoom.segments) || []) {
    if (t >= seg.from && t < seg.to) {
      const k = seg.keys;
      if (t <= k[0][0]) return k[0][1];
      for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * ease((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
      return k[k.length - 1][1];
    }
  }
  return 1;
}

export function resolveAssets(tl, dir) {
  const out = {};
  for (const [k, v] of Object.entries(tl.assets || {})) out[k] = pathToFileURL(path.resolve(dir, v)).href;
  return out;
}

/** Seeded RNG with normal distribution (for reproducible synthesized sounds). */
export function rng(seed) {
  let s = seed >>> 0;
  const uni = () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  return { uni, normal: () => Math.sqrt(-2 * Math.log(uni() + 1e-12)) * Math.cos(2 * Math.PI * uni()) };
}
