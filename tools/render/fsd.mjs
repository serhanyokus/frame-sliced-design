#!/usr/bin/env node
// Frame-Sliced Design render tool
//
//   node fsd.mjs transcribe <media> --model <dir> [--words] --out phrases.json
//   node fsd.mjs cut <edit.json> --out-dir cut/
//   node fsd.mjs stills <timeline.json> --assets <dir> [--brand brand.json] --times 1 13.8 --out stills/
//   node fsd.mjs mix <timeline.json> --voice voice.m4a [--sfx-dir sfx/] [--music file] --out mix.wav
//   node fsd.mjs render <timeline.json> --base base.mp4 --voice voice.m4a --assets <dir>
//                [--sfx-dir sfx/] [--brand brand.json] [--music file] [--work work/] --out final.mp4
import path from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { loadJson } from './lib/util.mjs';

function parse(argv) {
  const pos = [], opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2), vals = [];
      while (argv[i + 1] && !argv[i + 1].startsWith('--')) vals.push(argv[++i]);
      opt[k] = vals.length === 0 ? true : vals.length === 1 ? vals[0] : vals;
    } else pos.push(a);
  }
  return { pos, opt };
}

const [cmd, ...rest] = process.argv.slice(2);
const { pos, opt } = parse(rest);
const need = k => { if (!opt[k]) { console.error(`missing --${k}`); process.exit(1); } return opt[k]; };

if (cmd === 'transcribe') {
  const { transcribe } = await import('./lib/transcribe.mjs');
  const segs = await transcribe(pos[0], { model: need('model'), language: opt.language || 'tr', words: !!opt.words });
  writeFileSync(need('out'), JSON.stringify(segs, null, 1));
} else if (cmd === 'cut') {
  const { cut } = await import('./lib/cut.mjs');
  const r = await cut(loadJson(pos[0]), { editDir: path.dirname(path.resolve(pos[0])), outDir: need('out-dir') });
  console.log(`cut: ${r.duration.toFixed(2)}s, segments: ${JSON.stringify(r.segments)}`);
} else if (cmd === 'stills') {
  const { stills } = await import('./lib/render.mjs');
  const times = [].concat(need('times')).map(Number);
  await stills(loadJson(pos[0]), { assets: need('assets'), brand: opt.brand && loadJson(opt.brand), times, out: need('out') });
  console.log(`stills: ${times.length} -> ${opt.out}`);
} else if (cmd === 'mix') {
  const { mix } = await import('./lib/mix.mjs');
  await mix(loadJson(pos[0]), { voice: need('voice'), sfxDir: opt['sfx-dir'], music: opt.music, out: need('out') });
  console.log(`mix -> ${opt.out}`);
} else if (cmd === 'render') {
  const { mix } = await import('./lib/mix.mjs');
  const { compose } = await import('./lib/render.mjs');
  const tl = loadJson(pos[0]);
  const out = need('out'), work = opt.work || path.join(path.dirname(path.resolve(out)), 'work');
  mkdirSync(work, { recursive: true });
  console.log('1/2 mix');
  const audio = await mix(tl, { voice: need('voice'), sfxDir: opt['sfx-dir'], music: opt.music, out: path.join(work, 'mix.wav') });
  console.log('2/2 frames + encode');
  await compose(tl, { base: need('base'), assets: need('assets'), brand: opt.brand && loadJson(opt.brand), audio, out, work });
  console.log(`render -> ${out}`);
} else {
  console.log('usage: node fsd.mjs <transcribe|cut|stills|mix|render> ... (see README.md)');
  process.exit(cmd ? 1 : 0);
}
