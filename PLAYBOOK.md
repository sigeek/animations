# Playbook: making a code-rendered animation

How we make animations in this repo with Claude Code and Remotion. It's distilled from building [clawd-berlin](clawd-berlin/) (its [PROMPT.md](clawd-berlin/PROMPT.md) is the worked example). Background on the approach: [docs/article-notes.md](docs/article-notes.md). House rules Claude follows: [CLAUDE.md](CLAUDE.md).

## 1. Setup (once per machine)

- **Node.js 18+:** `brew install node`.
- **If `brew install` stops with "Cannot link ca-certificates" or "unknown install step":** Homebrew itself is out of date. Run `brew update` and leave that terminal alone until it finishes, then `brew postinstall node`. If an update is "already running", find it with `pgrep -fl "brew.*update"` and stop it.
- **If npm fails with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`:** Node's OpenSSL has no certificate file. Run `brew postinstall openssl@4`.
- **Python Pillow,** for the review script: `python3 -m pip install --user pillow`.

## 2. Start a new animation

```bash
scripts/new-animation.sh clawd-paris ClawdParis
```

It creates `clawd-paris/` with:
- a blank Remotion project (no nested `.git`), the Remotion agent skills and Google Fonts
- the shared kit copied from `clawd-berlin/src`:
  - `motion.ts`: `ramp`, `springAt` (by damping ratio), `travel`, `placed`, `useGlobalFrame`
  - `shading.tsx`: cel shading helpers
  - Push transition, debug overlay, line badge, fonts
  - Clawd with walk cycle and hop, plus the `ClawdPoses` review composition and `reference/clawd.png`
- a starter `tokens.ts`, a `Main.tsx` with one placeholder World, and `PROMPT.md` / `CLAUDE.md` from [templates/](templates/)

Add `--no-clawd` for an animation without Clawd. Then add a row to [README.md](README.md).

The first render in a project needs Remotion's headless Chrome (171 MB). The script copies it from an existing project. If there is none, the first render downloads it; if that stalls ("server sent no data"), retry on a better connection or copy `node_modules/.remotion/chrome-headless-shell` over from another project.

**Reusing more from Berlin:** copy the file and adapt its tokens. Useful candidates: `daylight.tsx` (sky and tint over time, sunset bands), the street kit (`components/street/`), `PaperSheet` and its mesh (crumple and unfold), `PoleSign`.

## 3. Write the spec

Fill in `<name>/PROMPT.md` from the template. What made the Berlin spec work:
- **Numbers, not adjectives:** frame ranges, easings, spring ratios, sizes in px or units.
- **One hero move per shot,** with the frame of every beat.
- **Style decisions up front.** We learned each of these the hard way:
  - Fill the frame. Decide each shot's framing first (ground low, landmark tops near the top third). Large empty bands got rejected every time.
  - Give every place its own palette that matches how it really looks. Generic grey filler buildings got rejected.
  - Landmarks need recognizable detail (windows, columns, inscriptions, clocks), not 3–5 shapes.
  - Use flat cel shading on everything, light from the upper left. Use stepped bands instead of gradients (e.g. sunsets).
  - Push transitions between places; keep a continuous framing within a place.
  - If time passes, key the sky colors so neighbouring colors mix cleanly. Blue to gold in a straight line goes through muddy grey, so change color during a scene change.
- **References:** screenshots go in `reference/`. Videos: send the file, and Claude pulls frames from it. Pinterest only shows the preview image without a login.

## 4. Phases and review rounds

Start Claude Code in the repo and send:

> Read clawd-paris/PROMPT.md. Do Phase 1 only, then stop for review.

Each round, Claude renders and checks the images before showing you anything:

```bash
python3 scripts/review.py clawd-paris ClawdParis --frames 0-245 \
    --stills 0,44,125 --shots 81-184,185-335 --contact 12
```

This writes stills, start/middle/end strips per shot and a contact sheet to `clawd-paris/out/review/`. You get a short list of what changed, which image to open for each, and one question per image. To watch it moving, run `npm run dev` in the project and scrub the timeline; Studio updates live while it runs.

**Giving notes:** one or two per round, naming frames. If you only have a feeling, say it anyway: Claude turns ambiguous notes into a multiple-choice question with concrete frame-level options before building. Translations that worked:

| Feeling | Note |
|---|---|
| "It's stiff" | 3-frame anticipation before the move, spring overshoot at damping ratio 0.5 |
| "It drags" / "too slow" | Shorten the hold, or move the next beat earlier (e.g. look-up at the top of the hop instead of after landing) |
| "It's busy" | One hero move at a time; delay everything else 3–6 frames at 50–70% of its travel |
| "Empty" | Reframe: lower the ground, scale the landmark up, bring the skyline in |
| "Looks generic / AI" | Name the default (glow, gradient, grey blocks) and add it to BANNED |
| "Not smooth" (between places) | Push transition, or show the next place inside the current one (as in the Berlin unfold) |

Approved changes go back into `PROMPT.md`, and Claude commits after each approved round, citing frames.

## 5. Final render

Render with the debug overlay switched off by a prop, no code change needed:

```bash
cd clawd-paris && npx remotion render ClawdParis out/clawd-paris.mp4 --props='{"debug":false}'
```

Check it with `npx remotion ffprobe out/clawd-paris.mp4` (duration, size, fps) and look at a few frames before posting.

Post it on X as a video, not a GIF: GIFs cap out at about 14.5 s.

## 6. Engineering notes

- **Worlds:** each scene is `XWorld({ frame })`, a pure function of the global frame. Shot wrappers only convert Series-local frames (`useGlobalFrame`). That makes push transitions, printing a frame onto paper and reusing a scene in the next shot trivial.
- **Placement:** say where a thing is at a reference frame (`at frame 690 the church is at x 860`) and compute the rest with `placed(screenX, layerSpeed, travel(ref), travel(now), dir)`.
- **Movement:** `travel()` sizes ease-in and ease-out phases so speed is continuous (a power-n ease over T frames covers speed·T/n).
- **Springs:** given as damping ratios in tokens; `springAt` converts them with mass 1, stiffness 100.
- **Shading:** `shadeOf` / `lightOf` mix an object's own color toward ink or white; `ShadedRect` and `ShadedCircle` cover most cases.
- **Common failures:**

| Symptom | Fix |
|---|---|
| Shapes jitter between renders | Replace `Math.random` with `random(seed)` |
| A frame differs each render | Drive every value from the frame; remove timers |
| Font pops in | Load it with `@remotion/google-fonts` (blocks rendering until ready) |
| Character drifts between shots | Use the single Clawd component; proportions live in tokens |
| A sign flashes by unread | Hold it ≥ 1.1 s, place it so it stops when the camera stops |
| A fix doesn't stick | Render frames just before and after; describe the difference before changing code |

## 7. Time and cost

clawd-berlin took about a day of iteration across two phases and many review rounds (the article's 2–4 rounds per phase was optimistic once detail and style requests came in). Use Opus 5.5 at medium effort; raise it only if a piece fails twice. Remotion is free for individuals and companies of up to 3 people.
