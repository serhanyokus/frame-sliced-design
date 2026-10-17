# `tools/render`

The Frame-Sliced Design renderer turns a `timeline.json` file into a vertical video. It is written in JavaScript: Playwright and Chromium draw the visual layers, Node.js mixes audio, and FFmpeg encodes the result.

## Verification status

An approved video was reproduced with this tool and compared frame by frame with the final version. No visual difference was found, and the measured loudness was the same (−16.1 LUFS).

## Install

Requirements: Node.js 20+, FFmpeg, and Chromium (installed by Playwright).

```sh
cd tools/render
npm install
npx playwright install chromium
```

For transcription (optional), install `sherpa-onnx-node` and download a Whisper model from [sherpa-onnx releases](https://github.com/k2-fsa/sherpa-onnx/releases), such as `sherpa-onnx-whisper-turbo`.

## Workflow

```text
1. transcribe   transcribe footage with sentence timings      → for the paper edit
2. cut          create clean audio and cut footage             → voice.m4a, base.mp4
3. timeline     write timeline.json from the visual plan
4. stills        preview a few frames                          → approval
5. render        mix audio, draw frames, and encode             → final.mp4
```

## Commands

```sh
node fsd.mjs transcribe IMG_1123.MOV --model whisper-turbo/ --words --out phrases.json
node fsd.mjs cut edit.json --out-dir cut/
node fsd.mjs stills timeline.json --assets screens/ --brand brand.json --times 1 13.8 25 --out stills/
node fsd.mjs mix timeline.json --voice cut/voice.m4a --sfx-dir sfx/ --out mix.wav
node fsd.mjs render timeline.json --base cut/base.mp4 --voice cut/voice.m4a \
    --assets screens/ --sfx-dir sfx/ --brand brand.json --out final.mp4
```

- `--assets`: directory that contains files referenced by relative paths in the timeline's `assets` field (the brand pack's screens).
- `--brand`: brand tokens (`color.primary`, `color.ink`, `color.paper`, `color.error`, `color.muted`, `font.family`).
- `--sfx-dir`: directory of sound effects; filenames are matched through `audio.sfxFiles`. The `sparkle` and `paper` sounds are built in.
- `--music`: music file; if omitted, original background music is generated when `audio.music.source: "synth"`.

## `edit.json` (for `cut`)

```json
{
  "sources": { "A": "IMG_1122.MOV", "B": "IMG_1123.MOV" },
  "pieces": [
    { "src": "A", "in": 0.00, "out": 6.08 },
    { "src": "B", "in": 46.31, "out": 51.26, "hardOut": true }
  ]
}
```

`in` and `out` mark where the speech starts and ends. The tool leaves a short lead-in for breath and extends the end until the sound decays. `hardOut: true` cuts exactly at `out`, for example to stop before an unwanted word. The generated `pieces.json` provides cut points for the timeline's `segments` field.

## `timeline.json`

All times are in seconds.

| Field | Meaning | Layer |
|---|---|---|
| `canvas`, `duration`, `voiceEnd` | Dimensions, total duration, and when speech ends | — |
| `assets` | Names mapped to files (screens, icons) | brands |
| `segments` | Cut points; color matching is applied per segment | techniques/color-match |
| `zoom` | Per-segment zoom keyframes; `anchorY` sets face position | techniques/motion |
| `grade` | Strength of color matching | techniques/color-match |
| `words` | Word timings | techniques/captions |
| `captions` | Word/character limit per group, `y`, and additional `hide` ranges | techniques/captions |
| `hook` | `kinetic-labels`: lines, `at`, `style` (ink/paper/primary), `until` | blocks/hook |
| `screenMoments` | Phone moments: `from`, `to`, `anchor` (left/top-right/top-left/right), `grow`, `screens`, `tap` | blocks/screen-moment |
| `emphasis` | `stamp`, `big-kinetic`, `stacked-chips`, `sticker`, `page-flip` | techniques/emphasis |
| `badge` | App or store card | blocks |
| `seriesTag` | Series label in a corner | brands/series |
| `transitions` | `stripe-wipe`, `iris` (`at` is the cut time) | techniques/transitions |
| `outro` | End card: `lines`, `pill`, `footer`, `icon` | blocks/outro |
| `audio.music` | `source`, `gapsDb`, `underVoiceDb`, `dips`, `fadeIn`, `fadeOut` | techniques/sound-design |
| `audio.sfx` | List of `{ at, sound, db }` | techniques/sound-design |

Captions are automatically hidden during large emphasis moments (`big-kinetic`, `stacked-chips`, `page-flip`) and the hook. When the phone grows, captions move below it.

## Add a new element

Add a new emphasis or transition type to `overlay/engine.js` and its style to `overlay/engine.html`. Add it to the type table in the relevant technique README as well. Propose the element first and add it after approval.

## Files

| File | Purpose |
|---|---|
| `fsd.mjs` | Command-line interface |
| `overlay/engine.html`, `overlay/engine.js` | Visual layer engine: reads the timeline and draws a frame at `setTime(t)` |
| `lib/render.mjs` | Draws frames and pipes them to FFmpeg; color matching |
| `lib/mix.mjs` | Mixes voice, music (ducking and gaps), and effects |
| `lib/sounds.mjs` | Built-in sounds: sparkle, paper, and original background music |
| `lib/cut.mjs` | Cuts audio and footage from a paper edit |
| `lib/transcribe.mjs` | Transcription using sherpa-onnx |

The `cut` and `transcribe` commands were ported from previously used Python steps to JavaScript. The render path has been verified; these two commands have not yet been used in a real production.
