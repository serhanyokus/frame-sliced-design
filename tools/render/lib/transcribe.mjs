// Phrase-level transcription with timings (Turkish by default), for the paper edit.
// Uses sherpa-onnx-node with a Whisper model (e.g. sherpa-onnx-whisper-turbo from the
// sherpa-onnx GitHub releases). Audio is split at silences; each phrase is transcribed
// separately so every phrase has its own start/end.
import { createRequire } from 'node:module';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { run, decodeAudio } from './util.mjs';

const SR = 16000;

export async function transcribe(media, { model, language = 'tr', words = false }) {
  const require = createRequire(import.meta.url);
  let sherpa;
  try { sherpa = require('sherpa-onnx-node'); } catch { throw new Error('Install the optional dependency first: npm install sherpa-onnx-node'); }
  const files = readdirSync(model);
  const pick = re => path.join(model, files.filter(f => re.test(f)).sort()[0]);
  const rec = new sherpa.OfflineRecognizer({
    modelConfig: { whisper: { encoder: pick(/encoder.*\.onnx$/), decoder: pick(/decoder.*\.onnx$/), language, task: 'transcribe' }, tokens: pick(/tokens\.txt$/), numThreads: 4 },
  });

  const audio = (await decodeAudio(media, { sr: SR, channels: 1 }))[0];
  const dur = audio.length / SR;
  const { stderr } = await run('ffmpeg', ['-i', media, '-af', 'silencedetect=noise=-35dB:d=0.25', '-f', 'null', '-']);
  const st = [...stderr.matchAll(/silence_start: ([\d.]+)/g)].map(m => +m[1]);
  const en = [...stderr.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
  const regions = []; let cur = 0;
  st.forEach((s, i) => { if (s - cur > 0.15) regions.push([cur, s]); cur = en[i] ?? dur; });
  if (dur - cur > 0.15) regions.push([cur, dur]);

  const segs = [];
  for (const [s, e] of regions) {
    const stream = rec.createStream();
    stream.acceptWaveform({ sampleRate: SR, samples: audio.subarray(Math.floor(Math.max(0, s - 0.1) * SR), Math.floor(Math.min(dur, e + 0.1) * SR)) });
    rec.decode(stream);
    const text = rec.getResult(stream).text.trim();
    const seg = { s: +s.toFixed(2), e: +e.toFixed(2), text };
    if (words && text) {
      // approximate word timings spread by character length (good enough for captions)
      const ws = text.split(/\s+/), L = ws.map(w => w.length + 1), T = L.reduce((a, b) => a + b, 0); let c = 0;
      seg.words = ws.map((w, i) => { const r = { w, s: +(s + (e - s) * c / T).toFixed(3), e: +(s + (e - s) * (c + L[i]) / T).toFixed(3) }; c += L[i]; return r; });
    }
    segs.push(seg);
    console.log(`${s.toFixed(2).padStart(7)}-${e.toFixed(2).padStart(7)} ${text}`);
  }
  return segs;
}
