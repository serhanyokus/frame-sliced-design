# Set up a brand pack (15 minutes)

A brand pack is the part of the `brands/` layer that belongs to your brand: colors, type, screens, rules, and videos. Set it up once and reuse it for every video.

Keep the brand pack in the brand's own project, usually private. This repository defines its structure only.

## 1. Copy the template (1 minute)

If the pack must remain private, copy it into your own project instead of adding it to this repository:
```sh
cp -R frame-sliced-design/brands/_template ~/Projects/my-brand/brand-pack
```

The resulting structure:
```text
brand-pack/
  brand.md          brand rules
  brand.json        colors and type
  screens/          product screens
  videos/           individual videos
  series/           series (optional)
```

## 2. Create `brand.json` (3 minutes)

```json
{
  "color": {
    "primary": "#FF5A1F",
    "ink": "#111111",
    "paper": "#FAFAFA",
    "error": "#E63946",
    "muted": "#6B7280"
  },
  "font": { "family": "Inter" }
}
```

| Field | Where it appears |
|---|---|
| `primary` | Highlighted caption word, stamp, emphasis line, stickers, transitions, and outro background |
| `ink` | Dark text and dark labels |
| `paper` | Light labels |
| `error` | Cards marked “wrong” |
| `muted` | Secondary text |
| `font.family` | All text; the font must be installed on the Mac |

## 3. Write `brand.md` (5 minutes)

Keep it short. Include only the rules that affect video production:
```markdown
# <Brand>
## Naming
- Public name:
## Voice
- (e.g. friendly, address the viewer as “you,” no emoji)
## Visuals
- Use primary as the only emphasis color. Colors to avoid:
- Images to avoid:
## Audio
- Voice-over, if any:
- Music rule:
## Channels
- Platforms and publishing copy rules (e.g. no links on TikTok):
```

## 4. Add screens (3 minutes)

Put product screens under `screens/` and give them meaningful names (`home.png`, `question.png`). The timeline refers to them by these names:
```json
"assets": { "home": "screens/home.png", "question": "screens/question.png", "icon": "screens/icon.png" }
```

If the screens already live in another folder, do not copy them. Use paths relative to that folder in the timeline and point render to it with `--assets`.

## 5. Create the first video folder (2 minutes)

For a one-off video:
```text
videos/launch/
  raw/            raw footage
  edit.json       paper edit
  timeline.json   visual plan
  exports/        final video
```

For a series episode, use the same structure under `series/<series>/day-01/`. Add a `bible.md` and `log.md` to the series folder.

## 6. Check it (1 minute)

Render a few stills from any timeline and check that the colors and type look right:
```sh
node fsd.mjs stills <timeline.json> --assets brand-pack --brand brand-pack/brand.json --times 1 5 --out stills/
```

Next: [make your first video](first-video.md).
