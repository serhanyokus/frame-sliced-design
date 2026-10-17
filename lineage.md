# Frame-Sliced Design: lineage

This document explains where Frame-Sliced Design comes from: what it borrows, what it deliberately leaves behind, and how it adapts earlier ideas for a vertical, often-muted, seconds-measured digital medium.

The other folders teach the rules and techniques. This document explains **why they are structured this way**.

---

## 1. Why a method is needed

Film editing has a century of literature behind it. Software and design have mature methods for organizing components. Social video often has scattered advice instead: “the first three seconds matter,” “add captions,” “use a hook.” That is a list of tips, not a system.

Vertical video differs from traditional film in four important ways:

1. **The screen is vertical and small.** Framing, type size, and readability cannot be considered the same way as in cinema.
2. **Sound is often off.** The story must also make sense through picture and text alone.
3. **The viewer can swipe away at any time.** The first second carries more weight than the opening of a film scene.
4. **The video plays inside an interface.** Buttons, descriptions, and tabs cover parts of the frame.

Production adds two more constraints: series may be published every day, and one person (or one person with an AI assistant) often makes them. At that pace, making every decision from scratch is impractical—but making every video look the same is not acceptable either.

Frame-Sliced Design addresses this tension: **a stable system, with a distinct video each time.**

---

## 2. Sources and influences

| Source | Field | What FSD borrows | Where it appears |
|---|---|---|---|
| Feature-Sliced Design | Front-end architecture | Layers, one-way dependencies, independent slices, a public interface for each slice | The overall structure |
| Atomic Design | Design systems | A vocabulary for combining small pieces into larger compositions | foundation → techniques → blocks → formats |
| Design tokens | Design systems | Keeping shared values in one place | `foundation/tokens.json`, brand tokens |
| Walter Murch | Film editing | A priority order for decisions | `rules/decision-priority.md` |
| Bruce Block | Visual storytelling | Contrast and affinity, intensity curves | Pre-production and emphasis placement |
| Thompson & Bowen | Editing and shot grammar | Shared terminology | `glossary.md` |
| Sergei Eisenstein | Montage theory | The idea that a cut should have a purpose | Transition and cut rules |
| Steven Katz | Directing | Planning before shooting | Visual plan |
| Bordwell & Thompson | Film analysis | Mise-en-scène: intentional placement of everything in frame | Text, face, and screen placement |
| TV show / format bibles | Television | Written definitions of what stays fixed and what can vary | `formats/`, series `bible.md` |
| Dogme 95 | Film movement | Writing constraints as a manifesto | `rules/manifesto.md` |
| Christopher Alexander | Architecture | Pattern language: recurring problems and reusable solutions | Hook, emphasis, and transition libraries |
| Diátaxis | Technical documentation | Separating tutorials, how-to guides, reference, and explanation | `start/`, READMEs, this document |
| COPE (NPR) | Content modeling | Create once and adapt for each channel | Delivery and publishing copy |
| Social media production notes | Platform practice | Retention, opening seconds, and measurement | `learning/`, hook block |

---

## 3. Ideas from software and design

### Feature-Sliced Design (the backbone)

**Borrowed:** FSD divides a front-end project into layers (app, pages, widgets, features, entities, shared) and slices. Its three rules are: a layer can use only the layers below it; slices at the same level do not know about one another; each slice exposes only its public interface.

**Adapted:**
- The layers map to production rules and workflow, formats, blocks, techniques, brands, and foundations.
- A slice's README is its public interface. You should be able to use a technique without knowing its internals; reading the README is enough.
- Dependency boundaries protect creative flexibility. Changing caption styling does not break a format; adding an emphasis type does not require rewriting a block.

**Not adopted:** Software-specific machinery such as segments, import rules, and lint tools was not transferred directly. It may be useful for techniques implemented as code later.

### Atomic Design (a vocabulary for the pieces)

**Borrowed:** Brad Frost's atom → molecule → organism → template → page sequence, a vocabulary familiar to designers.

**Adapted:** Color and sound are atoms; captions and emphasis are molecules; a hook and end card are organisms; talking-head is a template; each published video is a page. FSD provides the structure, while Atomic Design provides a way to describe what goes into it.

### Design tokens (one source of truth)

**Borrowed:** Define values such as color, type, and spacing in one place so they remain consistent even when tools change.

**Adapted:** Video tokens include more than color. Timing (how long a card takes to enter), loudness (the LUFS level under speech), motion values (zoom ratios), and safe zones are tokens too. Brand tokens override foundation defaults.

### Diátaxis (teaching)

**Borrowed:** Separate documentation into four kinds: tutorial (for a first-time task), how-to guide (for a specific task), reference (values and rules), and explanation (why).

**Adapted:** `start/first-video.md` is a tutorial. Technique READMEs are how-to guides. Tokens and safe zones are reference. This document is explanation. These forms stay distinct when the method is taught to someone else.

---

## 4. Ideas from editing and directing

### Walter Murch — Rule of Six

**Borrowed:** Murch evaluates a cut against six weighted criteria: emotion, story, rhythm, eye trace, the two-dimensional plane, and three-dimensional space. When criteria conflict, the higher priority wins.

**Adapted:** FSD reorders the priorities for vertical video: message, emotion, rhythm, **readability**, brand, decoration. Readability is not one of Murch's criteria because his cinema audience is not watching muted, on a phone, beneath an interface. His eye-trace and two-dimensional-plane criteria become readability and safe-zone rules here.

### Bruce Block — contrast and affinity

**Borrowed:** Block identifies seven visual components (space, line, shape, tone, color, movement, rhythm) and argues that contrast increases intensity while affinity lowers it. A film's intensity can follow a deliberate curve.

**Adapted:** A 45-second video has an intensity curve too. Draw it in pre-production and place emphasis at its peaks. The rule to vary emphasis types comes from this idea: repeating the same type creates affinity and lowers intensity. Series add one more constraint: do not use the same hook type in two consecutive videos.

### Thompson & Bowen — shot and editing grammar

**Borrowed:** Common names for shot types, cuts, and transitions.

**Adapted:** The glossary includes social video terms such as hook, safe zone, pattern interrupt, and ducking. Industry terms remain in English and are explained in the glossary.

### Eisenstein — montage

**Borrowed:** A cut has a function: it creates rhythm and meaning, and two images can create a third idea.

**Adapted:** Do not add an effect to every cut. Use a transition only when it carries meaning, such as at a section change or where different takes join. Hide jump cuts with a framing change instead of an effect.

### Steven Katz — plan before shooting

**Borrowed:** Build a scene on paper before filming it.

**Adapted:** Instead of a storyboard, FSD uses two lightweight tools: a paper edit (selecting lines from recorded speech as text) and a visual-plan table (deciding what appears for each sentence). Approve both before rendering, the most expensive step.

### Bordwell & Thompson — mise-en-scène

**Borrowed:** Everything inside the frame should be placed intentionally.

**Adapted:** In a vertical frame, mise-en-scène includes where the text, face, and app screen sit. Text does not cover the face. A screen appears where the speaker's gesture points. Areas covered by the platform interface count as part of the scene.

---

## 5. Television's format bible

### Show and format bibles

**Borrowed:** A show bible defines a series' characters, voice, and rules. A format bible defines the fixed and variable elements that let a TV format be produced consistently in different places.

**Adapted:**
- Each format in `formats/` has a format bible: its segments, fixed and variable elements, and the blocks it uses.
- Each series has its own `bible.md`.
- In television, a bible transfers knowledge between teams. Here, it also transfers knowledge from one day to the next: today's video follows the written bible, not only what yesterday's creator remembers.
- FSD adds a **usage log** (`log.md`). In television, production teams may remember what each episode used; here the record is written because the no-repeat rule depends on it.

---

## 6. Constraints as a manifesto

### Dogme 95

**Borrowed:** Lars von Trier and Thomas Vinterberg's ten-rule manifesto, with its short written constraints and idea that limits can encourage creativity.

**Adapted:** `rules/manifesto.md` is an “always / never” list. Dogme's rules expressed an aesthetic position; FSD's rules come from production experience. Each one turns a real problem into a rule, such as captions overlapping a dense screen, a spoken “follow us” sounding awkward, or the risk of unlicensed music.

**Not adopted:** Dogme's ban on effects and music. Sound design and music are part of holding attention in social video.

---

## 7. Patterns from architecture

### Christopher Alexander — A Pattern Language

**Borrowed:** Connected patterns that describe a recurring problem and a reusable solution.

**Adapted:** Hook, emphasis, and transition types form pattern libraries. Record what problem each type solves and where it was first used. The library grows with each video; the rule to propose at least one new element per video encourages that growth.

---

## 8. Additions for the digital medium

These elements come from platform constraints and are not found in the classical sources:

- **Readability is a decision criterion.** Videos are watched muted, on small screens, with interface overlays.
- **Safe zones are part of the scene.** The right rail, bottom description area, and top tabs all affect composition.
- **The first second has a visual hook.** The first spoken line is also established visually.
- **Learning is measured.** Record three-second retention, average view duration, and completion after each release. Update rules based on data rather than opinion. A film is released once; social video can be tested every day.
- **Create once, adapt for each channel (COPE).** The same video can go to TikTok, Reels, and Shorts; platform descriptions can be adapted from the same source text.
- **People and AI can produce together.** The method is written so an AI assistant can handle part of the edit: decisions follow explicit rules, values live in tokens, and approval points are clear. That is why two rules exist: propose and approve new elements before adding them, and do not save anything permanently before final approval.

---

## 9. Core principles

Six principles distilled from these sources:

1. **Stable system, distinct videos.** Brand and series remain recognizable while each video is rebuilt around its own content.
2. **Every decision has a priority.** Message, emotion, rhythm, readability, brand, decoration.
3. **Plan on paper, then render.** Leave the expensive step until last.
4. **Contrast creates intensity.** Vary emphasis types and place them at peaks in the curve.
5. **Pieces stay independent and have a public interface.** Each technique can change on its own and be learned from its README.
6. **Every release is an experiment.** Measure, record, and update the rules.

---

## 10. Further reading

Suggested order: Murch → Block → a few real show bibles → Atomic Design → Diátaxis.

**Editing and directing**
- Walter Murch, *In the Blink of an Eye*
- Bruce Block, *The Visual Story*
- Roy Thompson & Christopher Bowen, *Grammar of the Shot* and *Grammar of the Edit*
- Steven Katz, *Film Directing Shot by Shot*
- David Bordwell & Kristin Thompson, *Film Art*
- Sergei Eisenstein, *Film Form* (or start with the *Every Frame a Painting* video essays)

**Television**
- Pamela Douglas, *Writing the TV Drama Series*
- Published show-bible examples (for example, the *Star Trek: The Next Generation* writers' bible)
- FRAPA (Format Recognition and Protection Association) publications

**Constraints**
- The Dogme 95 manifesto and “Vow of Chastity”; a sample film: Thomas Vinterberg, *Festen* (1998)

**Design and software**
- Brad Frost, *Atomic Design* (atomicdesign.bradfrost.com)
- Feature-Sliced Design documentation (feature-sliced.design)
- Diátaxis (diataxis.fr)
- Christopher Alexander, *A Pattern Language*

**Platform practice**
- The MrBeast team's 2024 leaked production document
