# Article notes: "Opus 5.5 Motion Lab"

**Source:** Florence (@flxrnc), "Opus 5.5 Motion Lab: Make Claude Animate Like a Studio", X Article, Sep 30, 2026.

Claude doesn't generate video pixels. It writes code (HTML, React or three.js) that draws each frame as a function of time; a headless browser captures every frame and Remotion or ffmpeg stitches them into a video. So:
- Every frame is reproducible.
- An edit means changing a number, not re-rolling a generation.
- Claude can inspect its own rendered stills and fix them.

The article's point: viral "one prompt" animations hide the real work, which is the follow-ups. Its three showcase pieces took 2–15 follow-ups and about 2 hours of picture work each, and every follow-up named exact frames.

Its key experiment gave the same subject to a vague 3-adjective prompt and a detailed 448-word prompt. The vague one produced every default "AI look" (dark space, glow, particles, spinning objects). The directed one worked because it replaced adjectives with numbers (materials, lights, camera angles, beats, spring values) and banned the defaults by name.

## Takeaways

- **Engine:** Remotion for multi-scene videos, three.js for 3D, plain HTML for short single loops.
- **Prompt structure:** GOAL, TIME, SHOTS (each with a frame range, one hero move and a handoff), OUTPUT, an explicit ban list, a QA line. See [templates/PROMPT.md](../templates/PROMPT.md).
- **Character lock:** fixed proportions keep a mascot recognizable. The article's voxel Claude mascot: 14×10 body, 3×2 arms, 2×3 legs, 2×3 eyes.
- **Motion numbers:**
  - Ease-out for entrances; ease-in for exits, 40–50% shorter.
  - Ease-in-out for moves across the screen; linear only for rotation and constant scrolling.
  - Springs: damping ratio 0.4–0.6 reads playful, 0.7–0.85 premium.
  - Parallax: 1.0 foreground, 0.5 midground, 0.2 background.
  - Text holds at least 0.3 s per word plus 0.5 s.
- **Workflow:** render stills → notes with frame numbers → fix → re-render only what changed. Two to four rounds is normal.
- **Model:** Opus 5.5 at medium effort; raise it only if a piece fails twice.
