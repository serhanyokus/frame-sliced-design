# What you need for your first video

This page lists what to prepare before making your first video: a computer, footage, and brand assets. Once you have everything, follow the [step-by-step tutorial](first-video.md).

---

## 1. Computer (Mac)

| What | How |
|---|---|
| Homebrew | Run the one-line command on [brew.sh](https://brew.sh) |
| Node.js 20+, FFmpeg, Git | `brew install node ffmpeg git` |
| Repository access | A GitHub account; if the repository is private, you need an invitation |
| Free disk space | About 5 GB for raw footage and intermediate files |
| Recommended: AI assistant | Claude Code or Codex. The repository's `CLAUDE.md` teaches the assistant the method; it is especially useful when writing `timeline.json` |

Install the renderer:
```sh
git clone https://github.com/violettance/frame-sliced-design
cd frame-sliced-design/tools/render
npm install
npx playwright install chromium
```

---

## 2. Footage

| Topic | Requirement |
|---|---|
| Format | Vertical (9:16). An iPhone camera is enough; record at 1080×1920 or 4K vertical |
| Frame rate | 30 or 60 fps |
| File | MOV or MP4 (iPhone HEVC recordings are supported) |
| Target video length | 30–60 seconds |
| Raw footage | 1–3 minutes, 1–2 takes. Same session and lighting |
| Audio | Lavalier microphone in a quiet, non-echoing room. Use the phone's built-in mic only as a last resort |
| Lighting | Window or light source in front of you; keep it steady throughout the recording |
| Framing | From the chest up. Place the face in the upper third, with some space above the head for text |
| Eye line | Look directly at the camera |

**Script**
- First write the one-sentence message: “If this video tells the viewer just one thing, what is it?”
- Then write 6–10 short spoken sentences. Speak naturally; do not abbreviate.
- Make the first sentence the hook; it should create curiosity in the first 2–3 seconds.

**While recording**
- Pause for about one second between sentences.
- If you stumble, repeat the sentence from the beginning; fix it in the edit.
- Plan a gesture where you mention an app screen (for example, point to the upper right); the screen will appear there.

---

## 3. Brand assets

Prepare these once and reuse them for future videos. See [set up a brand pack](brand-pack.md) for how to organize them.

| What | Format | Notes |
|---|---|---|
| Primary color | HEX (e.g. `#FF5A1F`) | Emphasis, caption highlight, stamp, transitions |
| Dark neutral | HEX | Text and dark labels |
| Light neutral | HEX | Light labels and backgrounds |
| Negative color (optional) | HEX | “Wrong” indicators |
| Typeface | Name of a font installed on the Mac | Default: Inter (`brew install --cask font-inter`) |
| Logo / app icon | PNG, square, at least 512×512 | For the outro and store card |
| Product screens | PNG or JPG at the phone's native resolution (e.g. 1206×2622), including the status bar | Use **real** screenshots; do not present a redrawn screen as a real one |
| Brand rules | Short text | Voice, form of address, restrictions (e.g. “no yellow”) |

**Optional**

| What | Format | Notes |
|---|---|---|
| Sound effects | WAV or MP3 with known licensing | If none are provided, the tool uses its built-in sparkle and paper sounds, and skips the rest |
| Music | Licensed WAV or MP3 | If none is provided, the tool creates an original background track |

---

## 4. Series or one-off video?

A series is **optional**.

- **One-off video:** no series tag or “next episode” outro. End with the brand or a call to action. Folder: `brands/<brand>/videos/<video-name>/`
- **Series:** each episode has a series tag (such as “DAY 1”), the outro points to the next episode, and the no-repeat rule is tracked in the usage log. Folder: `brands/<brand>/series/<series>/<episode>/`

For a series, also prepare its name, episode-label pattern, and outro line pattern.

---

## 5. Readiness checklist

- [ ] The tool is installed (`node fsd.mjs` prints usage information)
- [ ] One or two vertical raw takes are ready
- [ ] A short script and one-sentence message are ready
- [ ] Colors (HEX), typeface, and a PNG logo are ready
- [ ] Product screens mentioned in the video are available
- [ ] Brand rules are written down
- [ ] You know whether this is a one-off video or a series; for a series, the tag and outro pattern are ready
- [ ] Publishing platforms are chosen
