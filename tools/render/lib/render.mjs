// Frame rendering with Playwright: overlay stills, and final frames
// (footage + zoom + color match + overlay) piped into FFmpeg.
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdirSync, readdirSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { run, zoomAt, resolveAssets } from './util.mjs';

const ENGINE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'overlay', 'engine.html');

async function openEngine(tl, { assets, brand, base = false }) {
  const t = { ...tl, assets: resolveAssets(tl, assets) };
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: tl.canvas.width, height: tl.canvas.height } });
  await page.addInitScript(`window.TIMELINE=${JSON.stringify(t)};window.BRAND=${JSON.stringify(brand || {})};window.BASE=${base};`);
  await page.goto(pathToFileURL(ENGINE).href);
  await page.waitForTimeout(800);
  return { browser, page };
}

/** Transparent overlay stills at given times (for quick review). */
export async function stills(tl, { assets, brand, times, out }) {
  mkdirSync(out, { recursive: true });
  const { browser, page } = await openEngine(tl, { assets, brand });
  for (const t of times) {
    await page.evaluate(`setTime(${t})`);
    await page.screenshot({ path: path.join(out, `still_${t.toFixed(2).padStart(6, '0')}.png`), omitBackground: true });
  }
  await browser.close();
}

/** Per-segment color statistics -> SVG transfer parameters (slope/intercept per channel). */
async function gradeTable(tl, base) {
  const g = tl.grade || {}, cuts = tl.segments;
  if (!g.enabled || !cuts) return null;
  const stats = [];
  for (let s = 0; s < cuts.length - 1; s++) {
    const a = cuts[s], b = cuts[s + 1], px = [];
    for (const k of [0.2, 0.5, 0.8]) {
      const { stdout } = await run('ffmpeg', ['-v', 'error', '-ss', String(a + (b - a) * k), '-i', base, '-frames:v', '1',
        '-vf', 'scale=270:480', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']);
      if (stdout.length) px.push(stdout);
    }
    const sum = [0, 0, 0], sq = [0, 0, 0]; let n = 0;
    for (const buf of px) for (let i = 0; i < buf.length; i += 3) { for (let c = 0; c < 3; c++) { sum[c] += buf[i + c]; sq[c] += buf[i + c] ** 2; } n++; }
    const mean = sum.map(v => v / n), std = sq.map((v, c) => Math.sqrt(v / n - mean[c] ** 2));
    stats.push({ a, b, mean, std });
  }
  const median = arr => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  const M = [0, 1, 2].map(c => median(stats.map(s => s.mean[c]))), D = [0, 1, 2].map(c => median(stats.map(s => s.std[c])));
  const kc = g.strengthContrast ?? 0.6, kb = g.strengthBrightness ?? 0.8;
  return stats.map(({ a, b, mean, std }) => {
    const slope = [0, 1, 2].map(c => 1 + kc * (D[c] / std[c] - 1));
    const intercept = [0, 1, 2].map(c => (mean[c] * (1 - slope[c]) + kb * (M[c] - mean[c])) / 255);
    return { a, b, slope, intercept };
  });
}

/** Final video: footage frames + overlay rendered together in the browser, encoded with FFmpeg. */
export async function compose(tl, { base, assets, brand, audio, out, work, bitrate = '4500k' }) {
  const { width: W, height: H, fps } = tl.canvas, N = Math.round(tl.duration * fps);
  const framesDir = path.join(work, 'base');
  mkdirSync(framesDir, { recursive: true });
  if (!existsSync(path.join(framesDir, '00001.jpg')))
    await run('ffmpeg', ['-v', 'error', '-i', base, '-vf', `scale=${W}:${H},fps=${fps}`, '-q:v', '2', path.join(framesDir, '%05d.jpg')]);
  const count = readdirSync(framesDir).filter(f => f.endsWith('.jpg')).length;
  const grades = await gradeTable(tl, base);

  const enc = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-b:v', bitrate, '-maxrate', '5500k',
    '-bufsize', '9000k', '-pix_fmt', 'yuv420p', '-r', String(fps), '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out],
  { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => enc.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg encode failed'))));

  const { browser, page } = await openEngine(tl, { assets, brand, base: true });
  for (let i = 0; i < N; i++) {
    const t = i / fps;
    const src = pathToFileURL(path.join(framesDir, String(Math.min(i + 1, count)).padStart(5, '0') + '.jpg')).href;
    const g = grades && grades.find(x => t >= x.a && t < x.b);
    await page.evaluate(([s, z, gr]) => window.setBase(s, z, gr), [src, zoomAt(tl, t), g || null]);
    await page.evaluate(`setTime(${t})`);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
    if (i % 150 === 0) process.stdout.write(`  frame ${i}/${N}\n`);
  }
  enc.stdin.end();
  await browser.close();
  await done;
  return out;
}
