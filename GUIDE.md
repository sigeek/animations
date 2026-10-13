# Claw exploring Berlin — article summary & how-to guide

## 1. Article summary

**Source:** Florence (@flxrnc), "Opus 5.5 Motion Lab: Make Claude Animate Like a Studio", X Article, Sep 30, 2026.

Claude Opus 5.5 doesn't generate video pixels. It writes code, usually HTML, React or three.js, that draws each frame as a function of time. A headless browser then captures every frame and ffmpeg (or Remotion) stitches them into a video. This has three consequences:
- Every frame is reproducible.
- An edit means changing a number, not re-rolling a generation.
- Claude can inspect its own rendered stills and fix them.

The author argues that viral "one prompt" animations hide the real work, which is the follow-ups. The article's three showcase pieces each took 2 to 15 follow-ups and about 2 hours of picture work. Every follow-up named exact frames.

The key experiment gave the same subject to a vague 3-adjective prompt and a detailed 448-word prompt. The vague prompt produced every default "AI look": dark space, glow, particles, spinning objects. The directed prompt worked because it replaced adjectives with numbers: materials, lights, camera angles, beats and spring values. It also banned the defaults by name.

**Takeaways for the Claw project**
- **Engine:** Remotion for multi-scene videos, three.js for 3D, plain HTML for short single loops.
- **Prompt template:** GOAL, TIME, SHOTS (each with a frame range, one hero move and a handoff), OUTPUT, an explicit ban list and a QA line.
- **Character lock:** state fixed proportions so the mascot stays recognizable. The article's voxel Claude mascot uses a 14×10 body, 3×2 arms, 2×3 legs and 2×3 eyes.
- **Motion numbers:**
  - Ease-out for entrances; ease-in for exits, made 40–50% shorter.
  - Ease-in-out for moves across the screen; linear only for rotation and constant scrolling.
  - Springs: damping ratio 0.4–0.6 reads as playful, 0.7–0.85 as premium.
  - Parallax: 1.0 foreground, 0.5 midground, 0.2 background.
  - Text holds for at least 0.3 s per word plus 0.5 s.
- **Workflow:** render stills, then write notes with frame numbers, then fix, then re-render only what changed. Two to four rounds is normal.
- **Model setting:** Opus 5.5 at medium effort. Raise it only if a piece fails twice.

---

## 2. How-to guide

### What you need
- Claude Code with Opus 5.5 selected, at medium effort.
- Node.js, which Remotion requires.
- `PROMPT.md`, the directed prompt from this chat.
- A screenshot of Claw to use as the visual reference.

### Step 1: Set up the project
```bash
npx create-video@latest claw-berlin   # choose a blank/empty template
cd claw-berlin
npm install
```
Then install Remotion's official Agent Skills for Claude Code (see the Remotion docs). Copy `PROMPT.md` and your Claw screenshot into the project folder.

### Step 2: Phase 1 (style, character, opening)
Start Claude Code in the project folder and send:

> Read PROMPT.md and use claw-reference.png as the Claw reference. Do Phase 1 only. Render the listed stills and a contact sheet, describe what you see, then stop.

To watch it live, run `npm run dev` to open Remotion Studio and scrub the timeline.

### Step 3: Review loop
Look at the stills and contact sheet, then send **one or two notes per round**. Each note should name frames and give numbers. Examples:
- "Claw's landing at frame 143 lands 2 frames late; move the touchdown to 141."
- "The crumple polygon at frame 54 looks too round; use sharper vertices with more noise."
- "Alexanderplatz sign is unreadable at phone size; make it 20% larger."
- "Frame 190: the Fernsehturm sphere is cut off; end the tilt 40 px higher."

When a note comes to you as a feeling, translate it into numbers before sending:

| Feeling | Note to send |
|---|---|
| "It's stiff" | Add a 3-frame anticipation before the move and overshoot with a spring at damping 0.5 |
| "It drags" | Shorten the hold by 15 frames (0.5 s) |
| "It's busy" | One hero move at a time; delay everything else by 5 frames at 60% of its travel |
| "Looks generic / AI" | Name the defaults it used (glow, gradient, etc.) and add them to BANNED |

To check a single frame yourself:
```bash
npx remotion still ClawBerlin out/f143.png --frame=143
```

### Step 4: Phase 2 (remaining shots)
Once Phase 1 looks right, send:

> Phase 1 approved. Build Phase 2 (shots 5–10) reusing the same components, then render stills at the start, middle and end of each shot plus a contact sheet of the full video.

Repeat the review loop for each shot.

### Step 5: Final render and export
Ask Claude to switch the debug overlay off, then run:
```bash
npx remotion render ClawBerlin out/claw-berlin.mp4
```
The result is a 1080×1080 MP4, 30 s, 30 fps. Post it on X as a video, not a GIF: GIFs cap out at about 14.5 s.

### Common failures and fixes

| Symptom | Cause | Prompt to send |
|---|---|---|
| Shapes jitter between renders | Unseeded randomness | "Replace all Math.random with random(seed) using fixed seeds." |
| A frame looks different each render | Timing from the clock | "Drive every value from useCurrentFrame only; remove all timers." |
| Font pops in on the first frames | Font not loaded | "Load the font with delayRender before frame 0." |
| Claw changes shape between shots | Proportions drift | "Use the single Claw component everywhere; proportions are fixed per CHARACTER." |
| A sign flashes by unread | Hold too short | "Hold every sign at least 1.1 s with no movement." |
| A fix doesn't stick | Unclear diagnosis | "Render the frames just before and after the problem and describe the difference before changing code." |

### Time, model and cost expectations
- **Model:** Opus 5.5 at medium effort. Use `/fast` in Claude Code for quicker review rounds; it bills at a higher rate.
- **Phase 1:** about 1 to 1.5 hours, including 2–3 review rounds.
- **Phase 2:** about 1.5 to 2.5 hours.
- **Total:** about 3 to 4 hours, mostly Claude working while you review stills. These are estimates extrapolated from the article's timings.
- **Licensing:** Remotion is free for individuals and companies of up to 3 employees; larger companies need a license.

### Tips
- Keep the frame counter on while iterating so every note can cite an exact frame.
- Change one number at a time when experimenting, so you can see what each one does.
- When a fix works, add it to the RENDER CONTRACT in `PROMPT.md` so it never comes back.
- Post the prompt and your follow-ups alongside the video. The article's point is that showing the real process builds trust.
