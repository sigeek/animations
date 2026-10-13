# House rules for every animation in this repo

Each animation lives in its own folder (`<name>/`) with a `PROMPT.md` spec, a `reference/` folder and a Remotion project. The workflow is in [PLAYBOOK.md](PLAYBOOK.md).

## Spec
- Read `<name>/PROMPT.md` before any work; it is the spec.
- It is a living spec: write every approved change back into it, in the same commit as the code.
- Notes that are a feeling or ambiguous ("too slow", "smoother"): ask one multiple-choice question with concrete frame-level options before building.

## Code
- Every number lives in `src/tokens.ts`: colors, easings, springs, frame ranges, layout, shape data. No inline magic numbers in components.
- Every value is a pure function of the global frame. No Date, timers, requestAnimationFrame or Math.random (use `random(seed)`).
- Each scene is a World component taking `frame` as a prop. Shot wrappers convert the Series-local frame to the global one. This makes push transitions and frozen frames trivial.
- Place things by "at frame F they are at screen x X" and let parallax move them (`placed()`); move with `travel()` so speeds stay continuous through eases.
- `npm run lint` (eslint + tsc) must pass before showing a round.

## Review rounds
- Render stills and per-shot strips with `scripts/review.py`, look at them yourself, fix obvious problems first.
- Then send the user a short list: what changed, which image to open for each, and one question per image.
- Stop after each phase and wait for review. Commit only after "approved", citing frame numbers in the message.
- Keep `out/` (renders) out of git.
