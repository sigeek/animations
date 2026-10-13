# Clawd exploring Berlin — directed motion prompt

GOAL
A 30-second, side-view 2D story: Clawd (the pixel Claude mascot) tours Berlin by public transport. The viewer should feel a cheerful, compact tourist day and recognize every landmark at phone size.

OUTPUT
One Remotion project, 2D only (React + SVG), composition "ClawdBerlin", 1080 x 1080, 30 fps, 900 frames (0–899). Each shot is its own component inside a <Series>, so any shot can be re-rendered alone. No sound. Every graphic is drawn in code: no image files, no external assets.

CHARACTER (fixed, never change proportions)
Clawd is pixel art on a grid where 1 unit = 12 px.
- Body 14 x 10 units, color #D97757.
- One arm on each side, 3 x 2 units, at mid-height.
- Four legs under the body, each 2 x 3 units.
- Two eyes, 2 x 3 units each, color #1F1E1D.
- No mouth, no outline, no shading, no accessories.
I attached a reference image: match it exactly.
Poses (the only ones allowed):
- stand
- step A / step B (alternating legs)
- sit (in a vehicle or on the bike: legs hidden)
- look-up (eyes shifted up 1 unit)

STYLE
- Flat 2D shapes, no outlines, hard edges.
- Global palette (max 2 accent colors added per scene):
  - paper #F4EFE6
  - ink #1F1E1D
  - Clawd #D97757
  - stone #C9C1B4
  - shadow #8F877B
  - sky #DCE6EA
- Landmarks are simplified silhouettes with 3–5 shapes each, readable in 0.5 s.
- Transit liveries:
  - S-Bahn train (S3): dark red lower body, ochre upper band.
  - U-Bahn train (U5): all yellow.
  - Bus 100: yellow double-decker.
- Line badges are plain rounded rectangles with "S3", "U5", "100" in white bold sans.
- No BVG or DB logos, wordmarks or symbols anywhere.
- Font: one bold geometric sans for all text, loaded before the first frame renders.

SHOTS (frame ranges inclusive)

1. Title card, 0–44 (1.5 s)
   - A sheet of squared notebook paper (#F4EFE6, 860 x 860, slightly rotated -2°) on a dark desk (#2B2A28): 22 x 22 light-blue grid (#9CBDE6, 2 px), edge to edge. The grid lines bend with the wrinkles through the crumple and unfold.
   - On it, in ink: "Clawd exploring Berlin" plus a small Clawd in stand pose.
   - Hero move: the title is fully readable by frame 6 and holds still.

2. Crumple, 45–60 (0.5 s)
   - The sheet is a 5 x 5 point mesh: its 16 edge points form a seeded-noise outline that contracts to a ~180 px ball by frame 58 (ease-in-cubic).
   - The printed title fades off by frame 50, so the ball is plain paper.
   - It rotates +25° while contracting.
   - Wrinkles appear as it shrinks: the mesh's 32 triangles are flat facets tinted with ink at seeded opacities up to 14%. No lines, no gradients. Reference look: white crumpled-paper footage (soft facets, near-straight edges with small dents).
   - Frames 58–60: the ball squashes to scaleY 0.88 / scaleX 1.1 and springs back (damping ratio 0.5).

3. Unfold, 61–80 (0.7 s)
   - The ball expands to full-bleed 1080 x 1080 (ease-out-quint).
   - Its polygon vertices relax into a square.
   - Shot 4's first frame lies under the paper, inside the outline. The paper (fill, grid, wrinkles) fades off 61–74 (ease-in-out) so the station shows through as the sheet opens; nothing of the paper is left over the landscape by 74.
   - At 80 the frame matches shot 4's first frame, so the cut at 81 is seamless.

4. S3 arrives at Alexanderplatz, 81–184 (3.5 s)
   - The S3 train enters from the right and decelerates to a stop at frame 125 (ease-out-cubic), under a flat platform canopy: one dark slab on slim columns, with the station sign hanging from it.
   - Station sign "Alexanderplatz" holds from 125 to 184.
   - Doors open at 126, right as the train stops (126–131).
   - Clawd hops out, 131–145: 3-frame anticipation crouch, an arc to the platform, then landing squash scaleY 0.85 / scaleX 1.12 for 3 frames.
   - Static camera, framed from the start so the Fernsehturm (thin shaft, sphere, red-and-white antenna) stands above the station and Clawd lands at the bottom edge.
   - Clawd switches to look-up pose at 138, at the top of the hop, and holds it to 184.
   - Small excited hop in place right after landing, 151–164: 1-frame crouch, 48 px arc, light landing squash scaleY 0.91 / scaleX 1.07, spring back.

5. Walk to Museumsinsel, 185–335 (5 s)
   - Clawd stays at x = 40% of the frame in a walk cycle: step A/B swap every 6 frames, with the body 1 unit higher on each swap.
   - Background layers scroll left at parallax speeds 1.0 (street), 0.5 (buildings), 0.2 (skyline).
   - Frame 290: a hard cut to the same walk with a signpost "→ Museumsinsel" passing by.
   - The Spree water strip and Berlin Cathedral dome slide in, and Clawd stops at frame 320 (ease-out).

6. U5 to Brandenburger Tor, 336–485 (5 s)
   - 336–410: side view inside a dark tunnel. Clawd sits in a lit yellow U5 window, and tunnel lights pass at constant speed.
   - Hard cut at 411: Clawd rises out of an U-Bahn stair entrance (sign "Brandenburger Tor") in front of the gate.
   - The gate is 6 columns with the Quadriga silhouette on top.
   - Clawd is fully up by frame 430 (ease-out-cubic), then stands and looks up.

7. Walk to the Bundestag, 486–575 (3 s)
   - Same walk cycle and parallax as shot 5.
   - The Reichstag building with its glass dome slides in, and Clawd stops at frame 555.
   - Bus stop sign "Bundestag" is visible from 555.

8. Bus 100 to Ku'damm, 576–725 (5 s)
   - The double-decker stops at 590. Clawd hops on with a 2-frame anticipation and is seated at the upper-deck front window by 605.
   - The bus drives left past Tiergarten trees and the Siegessäule, which passes the window at 630–660.
   - The bus decelerates to stop at frame 690 in front of the Kaiser-Wilhelm-Gedächtniskirche: broken tower silhouette plus shop facades.
   - Sign "Kurfürstendamm" holds from 690 to 725.

9. Bike to Tempelhof, 726–845 (4 s)
   - Clawd is seated rigid on a simple bike: two wheel circles with spokes, a triangle frame, no pedaling legs.
   - The wheels rotate linearly at constant speed.
   - Clawd bobs 1 unit on two bumps, at 760 and 800.
   - Street layers scroll at the same parallax speeds.
   - From 790 the city drops away and the open Tempelhofer Feld slides in: flat grass, a runway line, the long curved airport building small in the distance.

10. Final hold, 846–899 (1.8 s)
    - Clawd brakes to a stop at 850 (ease-out-quint), hops off, and stands on the field in stand pose.
    - Two kites hold still in the sky.
    - Nothing else moves except a 2% slow push-in.

MOTION RULES
- Entrances use ease-out; exits use ease-in and are 40–50% shorter. Vehicles arrive on ease-out-cubic and leave on ease-in-cubic.
- Camera moves use ease-in-out-quart only. Linear is only for wheel rotation, tunnel lights and constant scrolling.
- Springs use damping ratio 0.5 for Clawd's hops and landings, 0.8 for everything else. Position and scale may overshoot; opacity and color never do.
- One hero move per shot. Secondary elements move 50–70% as far and start 100–200 ms (3–6 frames) after the hero.
- Text never moves while it is readable. Every sign holds at least 1.1 s.
- Cuts between shots are hard cuts, except shots 2→3 (the paper transition).
- Keep all numbers in one tokens file (easings, springs, colors, frame ranges); no inline magic numbers in components.

BANNED
Gradients of any kind, glow, bloom, lens flares, decorative particles, drop shadows, fade-and-slide-up entrances, everything fading in at once, centered-everything layouts, 3D or perspective effects, photo textures, rain/snow/weather effects, any BVG or DB logo or wordmark, any pose not listed above.

RENDER CONTRACT
- Every value is a pure function of the frame (useCurrentFrame). No Date, performance.now, setTimeout, setInterval or requestAnimationFrame.
- No Math.random: use Remotion's random(seed) with fixed seeds.
- Fonts and any data are loaded before rendering (delayRender / continueRender).
- A debug overlay (frame number top-left, shot name top-right) is behind a prop, on while iterating, off for the final render.

PHASES
- Phase 1: build the tokens file, Clawd (all poses), the walk cycle, and shots 1–4. Render stills at frames 0, 44, 54, 61, 68, 81, 125, 143, 170, 184 plus a 12-frame contact sheet of 0–184. Describe what you see, then stop and wait for my notes.
- Phase 2: after my approval, build shots 5–10 reusing the same components.

QA
Before any full render, render stills and a contact sheet and tell me what you see before changing anything. When fixing, name the frame numbers you changed. Final render: `npx remotion render ClawdBerlin out/clawd-berlin.mp4` with the debug overlay off.
