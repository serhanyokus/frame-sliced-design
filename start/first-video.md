# Your first video: step by step (talking-head)

This tutorial takes a talking-head video from raw footage to publication. Each step follows the same structure:

- **Purpose:** why this step exists
- **Input → Output:** what you start with and what you finish with
- **Do:** concrete actions and commands
- **Check:** what to verify before moving on

There are three approval checkpoints: ✅ step 5 (plan), ✅ step 8 (full draft), and ✅ step 9 (final).

```text
0 Setup → 1 Record → 2 Transcribe → 3 Paper edit → 4 Cut
→ 5 Visual plan ✅ → 6 Timeline → 7 Stills → 8 Render ✅ → 9 Review ✅ → 10 Publish and log
```

---

## 0. Setup

**Purpose:** Install the tool and read the brand and series rules. See [what you need](what-you-need.md). If you do not have a brand pack, [set one up](brand-pack.md).
**Input → Output:** a clean computer → a working tool and a reviewed brand pack

**Do**
```sh
git clone https://github.com/violettance/frame-sliced-design
cd frame-sliced-design/tools/render
npm install
npx playwright install chromium
```

FFmpeg must be installed (`ffmpeg -version`). For transcription, also install `sherpa-onnx-node` and a Whisper model (see the [render tool guide](../tools/render/README.md)).

Read these files in the brand pack:
- `brand.md`: voice, naming, and restrictions
- The series `bible.md`: fixed and variable elements
- The series `log.md`: hook and emphasis types used in the previous episode **cannot be used in this episode** (skip this step if the video is not part of a series)

**Check**
- [ ] `node fsd.mjs` prints usage information
- [ ] You know which hook and emphasis types are unavailable for this episode

---

## 1. Record

**Purpose:** Capture footage that is easy to edit.
**Input → Output:** a short script → one or more vertical takes

**Do**
- Write the one-sentence message and a concise script. Speak naturally; do not abbreviate.
- Pause for about one second between sentences. If you stumble, repeat the sentence from the beginning.
- Plan a gesture where you will show an app screen (for example, point to the upper right); the screen will appear there.
- Keep the lighting steady and record all takes in the same session.

**Check**
- [ ] There is at least one clean take of every sentence
- [ ] The audio is clear (use a lavalier microphone)

---

## 2. Transcribe

**Purpose:** Get sentence timings for the paper edit.
**Input → Output:** takes → text with sentence timings (`phrases.json`)

**Do**
```sh
node fsd.mjs transcribe IMG_1123.MOV --model whisper-turbo/ --out take-b.json
```

The output includes a start and end time for each sentence:
```text
   3.10-   6.40 I’m going to show you one thing in this video.
   7.20-  10.85 Most people skip this step and then have to start over.
  11.60-  13.05 Now look at the screen.
```

**Check**
- [ ] Every take has been transcribed
- [ ] Nonsensical lines (such as between-take chatter) are marked to remove in the paper edit

---

## 3. Paper edit

**Purpose:** Build the video with text before rendering it. Rendering is the most expensive step.
**Input → Output:** transcripts → [paper edit template](../workflow/templates/paper-edit.md) + `edit.json`

**Do**
1. Choose the cleanest take for each sentence.
2. Remove repeated ideas, stumbles, and rambling lines. Note what you removed and why in the template.
3. Make sure the story makes sense when you listen to it without watching.
4. End on the final spoken sentence; do not add a spoken “follow us.”
5. Convert the selection into `edit.json`:
```json
{
  "sources": { "A": "IMG_1122.MOV", "B": "IMG_1123.MOV" },
  "pieces": [
    { "src": "A", "in": 0.00, "out": 6.08 },
    { "src": "B", "in": 46.31, "out": 51.26, "hardOut": true }
  ]
}
```
`in` and `out` mark where the spoken line starts and ends. Use `hardOut: true` if an unwanted word follows.

**Check**
- [ ] There are no repeated ideas
- [ ] The reason for keeping or removing each piece is written down

---

## 4. Cut

**Purpose:** Create clean audio and cut footage from the paper edit.
**Input → Output:** `edit.json` + takes → `voice.m4a`, `base.mp4`, `pieces.json`

**Do**
```sh
node fsd.mjs cut edit.json --out-dir cut/
```

The tool leaves a little breath before each piece, avoids clipping word endings, cleans the audio (−16 LUFS), and cuts the footage frame accurately. `pieces.json` records where each piece starts in the edit; those values become the timeline's `segments`.

**Check**
- [ ] Listen to `voice.m4a` from start to finish: no clipped words or sentences jammed together
- [ ] No pause is longer than 0.6 seconds

---

## 5. Visual plan and intensity curve ✅

**Purpose:** Decide what appears on each line before rendering.
**Input → Output:** edited audio + text → [visual plan](../workflow/templates/visual-plan.md) + [intensity curve](../workflow/templates/intensity-curve.md)

**Do**
1. Assign a visual to each sentence: **you** · **screen** · **emphasis** · **block** · **transition**.
2. Show a screen only when it directly matches what is being said. Enlarge it if it needs to be read ([screen moment](../blocks/screen-moment/README.md)).
3. Draw the intensity curve. Place emphasis at the peaks and use a different type at each peak ([emphasis](../techniques/emphasis/README.md)).
4. Choose a hook type; it cannot match the previous episode ([hook](../blocks/hook/README.md)).
5. Propose at least one new element.

**Check**
- [ ] Captions, large text, and a dense screen are not shown all at once
- [ ] Text does not cover the face
- [ ] ✅ Send the edited script, visual plan, and curve for approval together

---

## 6. Timeline

**Purpose:** Convert the approved visual plan into one file the tool can read.
**Input → Output:** visual plan + word timings → `timeline.json`

**Do:** Each row in the visual plan maps to a field in the timeline:

| In the visual plan | In `timeline.json` |
|---|---|
| Hook lines | `hook.lines[]` (`text`, `at`, `style`) |
| “DAY X” stamp | `emphasis[]` → `stamp` |
| Screen moment | `screenMoments[]` (`from`, `to`, `anchor`, `grow`, `screens`, `tap`) |
| Large text, cards, sticker, page | `emphasis[]` → `big-kinetic`, `stacked-chips`, `sticker`, `page-flip` |
| Transition | `transitions[]` (`at` = cut time) |
| Zoom | `zoom.segments[]` |
| Sound effect or music gap | `audio.sfx[]`, `audio.music.dips` |
| Outro | `outro` |

Example screen moment:
```json
{ "from": 7.45, "to": 13.2, "anchor": "top-right", "grow": 9.45,
  "screens": [["home", 7.45], ["detail", 9.3]],
  "tap": { "at": 9.12, "x": 128, "y": 369 } }
```
See the [render tool guide](../tools/render/README.md#timelinejson) for all fields.

**Check**
- [ ] Every row in the visual plan has a corresponding timeline field
- [ ] Timings match the word timings (a screen appears on the line that refers to it)

---

## 7. Stills

**Purpose:** Preview a few frames in seconds before rendering the whole video.
**Input → Output:** `timeline.json` → visual layers at selected times

**Do**
```sh
node fsd.mjs stills timeline.json --assets screens/ --brand brand.json --times 5.8 20 34 --out stills/
```

**Check**
- [ ] Layout, colors, and text sizes look right
- [ ] Screens are readable

---

## 8. Render ✅

**Purpose:** Produce the video.
**Input → Output:** `base.mp4` + `voice.m4a` + `timeline.json` + brand pack → `final.mp4`

**Do**
```sh
node fsd.mjs render timeline.json --base cut/base.mp4 --voice cut/voice.m4a \
    --assets screens/ --sfx-dir sfx/ --brand brand.json --out final.mp4
```

The tool mixes the audio (music ducks under speech, rises in gaps, and pauses at marked moments), draws every frame (zoom, segment-by-segment color matching, and visual layers), then encodes the video. A 43-second video takes about 4–5 minutes.

**Check**
- [ ] ✅ Send the full draft for approval

---

## 9. Review ✅

**Purpose:** Make sure the video works where it will actually be watched: on a phone.
**Input → Output:** `final.mp4` → final approval or a list of changes

**Do**
1. Watch it on a phone **with sound**: check the rhythm, music level, and whether effects overpower the voice.
2. Watch it on a phone **without sound**: can you follow the story from the text alone?
3. Check safe zones: nothing sits under platform controls or the description ([safe zones](../rules/safe-zones.md)).
4. Review it like a director: does the hook land in the first second? Is the face covered for too long? Does the pace sag?

**Check**
- [ ] ✅ Final approval

---

## 10. Publish and log

**Purpose:** Publish the video and learn from its performance.
**Input → Output:** final video → published post + updated log

**Do**
1. Export the shareable copy at 1080×1920, 30 fps, H.264, under 30 MB.
2. Write titles and descriptions using the series patterns in `bible.md` (no links on TikTok; links on YouTube).
3. Save the final file in the episode folder in the brand pack; delete drafts.
4. Record the hook, emphasis, transitions, and music used in this episode's `log.md`.
5. After about 48 hours, add the metrics: 3-second retention, average view duration, completion, comments, and saves ([learning](../learning/README.md)).
6. If the episode introduced a technique or emphasis type, add it to the relevant README.

**Check**
- [ ] `log.md` is up to date
- [ ] New elements have been added to the library
