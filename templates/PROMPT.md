# <Title> — directed motion prompt

<!--
Template. Replace every <placeholder>. Keep numbers, not adjectives.
Worked example: ../clawd-berlin/PROMPT.md. Defaults below come from what
worked there; change them deliberately, not by accident.
-->

GOAL
A <length>-second, <side-view 2D | …> story: <who> <does what> <where>. The viewer should feel <one feeling> and recognize <what> at phone size.

OUTPUT
One Remotion project, 2D only (React + SVG), composition "<CompositionId>", 1080 x 1080, 30 fps, <frames> frames (0–<last>). Each shot is its own World component inside a <Series>, so any shot can be re-rendered alone. No sound. Every graphic is drawn in code: no image files, no external assets.

CHARACTER (fixed, never change proportions)
<!-- Clawd default, from reference/clawd.png. Delete if there's no character. -->
Clawd is pixel art on a grid where 1 unit = 12 px.
- Body 14 x 10 units, color #D97757.
- One arm on each side, 3 x 2 units, level with the eyes.
- Four legs under the body in two pairs, each 2 x 3 units.
- Two eyes, 2 x 3 units each, color #1F1E1D, in columns 3–4 and 9–10.
- No mouth, no outline, no accessories.
- Flat cel shading: a 1-unit lighter band across the top of the body, a 1-unit darker band along its bottom, the bottom unit of each arm and the top unit of each leg in shade.
Poses (the only ones allowed): stand, step A / step B, sit (legs hidden), look-up (eyes 1 unit up).

STYLE
- Flat 2D shapes, no outlines, hard edges.
- Flat cel shading on every object, light from the upper left: one hard-edged darker band on the side away from the light (right side of blocks and columns, lower-right crescent on round things, lower body of vehicles), optionally a lighter band on top. Shades are the object's own color mixed toward ink (20%) or white (22%).
- Base palette: paper #F4EFE6, ink #1F1E1D, stone #C9C1B4, shadow #8F877B, sky #DCE6EA, plus <accents>.
- Each place gets its own palette that reflects how it really looks (materials, typical colors). Never generic grey filler buildings.
- Landmarks are flat but detailed enough to recognize at phone size: windows, columns, ribs, inscriptions, clock faces. Readable in 0.5 s.
- Fill the frame: no large empty bands. Choose each shot's framing before animating (e.g. ground line low, landmark tops near the top third).
- <Optional> Time of day: sky color and a flat light tint (max 18%) keyed by frame, <start> → <end>. Sunsets are stepped flat bands, never gradients.
- Font: one bold geometric sans for all text, loaded before the first frame renders.

SHOTS (frame ranges inclusive)
<!-- One hero move per shot. Name the frame of every beat. -->
1. <Shot name>, <a>–<b> (<s> s)
   - <hero move, with frames, easing and numbers>
   - <secondary elements, 3–6 frames after the hero, 50–70% of its travel>
   - <signs: text and the frames they hold>

MOTION RULES
- Entrances ease-out; exits ease-in, 40–50% shorter. Vehicles arrive ease-out-cubic, leave ease-in-cubic.
- Camera moves ease-in-out-quart only. Linear only for wheel rotation, lights passing and constant scrolling.
- Springs by damping ratio: 0.5 for the character's hops and landings, 0.8 for everything else. Position and scale may overshoot; opacity and color never do.
- Parallax: 1.0 street, 0.5 buildings, 0.2 skyline (add a layer only with a reason).
- Changing places: push transition, the old frame slides out left as the new one pushes in from the right, 14 frames, ease-in-out-quart. Continuous framing between shots in the same place.
- Text never moves while it is readable unless it is a sign the camera passes. Every sign holds at least 1.1 s.
- All numbers in one tokens file; no inline magic numbers in components.

BANNED
Gradients of any kind, glow, bloom, lens flares, decorative particles, drop shadows, fade-and-slide-up entrances, everything fading in at once, centered-everything layouts, 3D or perspective effects, photo textures, rain/snow/weather effects, brand logos or wordmarks, any pose not listed above, <add the defaults you saw and disliked>.

RENDER CONTRACT
- Every value is a pure function of the frame. No Date, performance.now, setTimeout, setInterval or requestAnimationFrame.
- No Math.random: use Remotion's random(seed) with fixed seeds.
- Fonts are loaded before rendering.
- A debug overlay (frame number top-left, shot name top-right) is behind a prop, on while iterating, off for the final render.

PHASES
- Phase 1: tokens file, character (all poses), shared components, shots 1–<n>. Render stills at <frames> plus a contact sheet of 0–<b>. Describe what you see, then stop.
- Phase 2: after approval, the remaining shots reusing the same components. Stills at the start, middle and end of each shot plus a contact sheet of the whole video.

QA
Before any full render, render stills and a contact sheet and look at them before changing anything. When fixing, name the frame numbers you changed. Final render: `npx remotion render <CompositionId> out/<name>.mp4` with the debug overlay off.
