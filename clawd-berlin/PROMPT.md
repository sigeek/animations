# Clawd exploring Berlin — directed motion prompt

GOAL
A 30-second, side-view 2D story: Clawd (the pixel Claude mascot) tours Berlin by public transport. The viewer should feel a cheerful, compact tourist day — from morning at Alexanderplatz to sunset on Tempelhofer Feld — and recognize every landmark at phone size.

OUTPUT
One Remotion project, 2D only (React + SVG), composition "ClawdBerlin", 1080 x 1080, 30 fps, 900 frames (0–899). Each shot is its own component inside a <Series>, so any shot can be re-rendered alone. No sound. Every graphic is drawn in code: no image files, no external assets.

CHARACTER (fixed, never change proportions)
Clawd is pixel art on a grid where 1 unit = 12 px.
- Body 14 x 10 units, color #D97757.
- One arm on each side, 3 x 2 units, at mid-height.
- Four legs under the body, each 2 x 3 units.
- Two eyes, 2 x 3 units each, color #1F1E1D.
- No mouth, no outline, no accessories.
- Flat cel shading as in the Opus 5.5 Motion Lab reference: a 1-unit lighter band across the top of the body, a 1-unit darker band along its bottom, the bottom unit of each arm and the top unit of each leg in shade.
I attached a reference image: match it exactly.
Poses (the only ones allowed):
- stand
- step A / step B (alternating legs)
- sit (in a vehicle or on the bike: legs hidden)
- look-up (eyes shifted up 1 unit)

STYLE
- Flat 2D shapes, no outlines, hard edges.
- Flat cel shading on every object, light from the upper left: one hard-edged darker band on the side away from the light (right side of blocks and columns, lower-right crescent on trees, domes and spheres, lower body of vehicles), optionally a lighter band on top. Shades are the object's own color mixed toward ink (20%) or white (22%). No gradients, no drop shadows.
- Global palette (max 2 accent colors added per scene):
  - paper #F4EFE6
  - ink #1F1E1D
  - Clawd #D97757
  - stone #C9C1B4
  - shadow #8F877B
  - sky #DCE6EA
- Landmarks are flat but detailed enough to recognize at phone size: windows, columns, ribs, inscriptions, clock faces (e.g. the Gedächtniskirche's belfry arches, clock and blue glass new church). Readable in 0.5 s.
- Each neighborhood has its own building palette (in the tokens file), never grey blocks:
  - Museumsinsel, Brandenburger Tor, Reichstag, Siegessäule: warm sandstone with copper domes.
  - Platz der Republik / Tiergarten: big round park trees; a soft distant tree line on the horizon.
  - Ku'damm: cream Gründerzeit facades with shop windows.
  - Schöneberg / Kreuzberg (bike ride): pastel Altbau (butter yellow, salmon, mint, sky blue, lilac) with white stucco window frames, balconies, shops and street trees.
- A day passes: the sky color moves through the shots (morning 81, late morning 185, midday 411, afternoon 576, golden hour 726, dusk 846) and a flat light tint over each scene warms in the afternoon and turns blue at dusk (max 18%). The paper shots are indoors and untinted.
- Transit liveries, with detail:
  - S-Bahn train (S3): dark red lower body, ochre upper band, grey roof, windscreen, destination display "S3", headlight, split windows, two sliding doors.
  - U-Bahn train (U5): all yellow, grey roof, framed lit windows (seat backs and a grab pole visible), sliding door pairs, dark underframe with bogies.
  - Bus 100: yellow double-decker, roof band, front windscreen, headlight, mirror, front and side "100" displays, door pair behind the front axle, wheel arches, grey skirt.
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

5. Walk along the Museumsinsel, 185–335 (5 s)
   - Clawd stays at x = 40% of the frame in a walk cycle: step A/B swap every 6 frames, with the body 1 unit higher on each swap. Walk speed 12 px/frame.
   - He walks along the Spree quay, one continuous walk: the Berliner Dom, the Altes Museum (18-column colonnade), the Neues Museum, and he stops at frame 320 (ease-out) in front of the Alte Nationalgalerie (temple front on a high podium, grand staircase, equestrian statue, "DER DEUTSCHEN KUNST").
   - Parallax: 1.0 (quay, lamps, signpost), 0.85 (the museums across the river, drawn 1.3x), 0.2 (distant tree line and the Fernsehturm).
   - A signpost "→ Museumsinsel" passes early in the walk.

6. U5 to Brandenburger Tor, 336–485 (5 s)
   - 336–410: side view inside a dark tunnel. Clawd sits in a lit yellow U5 window, and tunnel lights pass at constant speed.
   - Push transition at 411: Clawd rises out of an U-Bahn stair entrance (sign "Brandenburger Tor") in front of the gate, against open sky.
   - The gate: sandstone, 6 columns with capitals and bases, triglyph frieze, attic with relief panel, side wings. On top, the Quadriga in green patina: four rearing horses (back pair darker), the chariot with its wheel, winged Victoria raising the staff with wreath, iron cross and eagle.
   - Clawd is fully up by frame 430 (ease-out-cubic), then stands and looks up.

7. Walk to the Bundestag, 486–575 (3 s)
   - Same walk cycle as shot 5, parallax 1.0 / 0.5 / 0.2, past the park trees of the Platz der Republik.
   - The Reichstag (sandstone, window rows, corner towers, portico with "DEM DEUTSCHEN VOLKE", glass dome) slides in, and Clawd stops at frame 555.
   - Bus stop sign "Bundestag" is visible from 555.

8. Bus 100 to Ku'damm, 576–725 (5 s)
   - The double-decker stops at 590. Clawd hops on with a 2-frame anticipation and is seated at the upper-deck front window by 605.
   - The camera rides with the bus (cruise 72 px/frame) left through the Tiergarten; the Siegessäule (columned hall, gilded rings, golden Victoria) passes the window at 630–660.
   - The bus decelerates to stop at frame 690 in front of the Kaiser-Wilhelm-Gedächtniskirche (broken tower with belfry arches and clock, blue glass new tower and hall) next to cream Ku'damm facades.
   - Sign "Kurfürstendamm" holds from 690 to 725.

9. Bike to Tempelhof, 726–845 (4 s)
   - Clawd is seated rigid on a Berlin city bike: teal triangle frame with shaded tubes, spoked wheels with rims and cream fenders, chain and a crank that turns with the wheels, saddle, curved handlebar with grip, headlamp, wicker basket on a front rack. No pedaling legs.
   - The wheels rotate linearly at constant speed.
   - Clawd bobs 1 unit on two bumps, at 760 and 800.
   - Street layers scroll at the same parallax speeds past pastel Schöneberg/Kreuzberg Altbau with street trees; the Fernsehturm stands far off above the roofs.
   - From 790 the city drops away and the open Tempelhofer Feld slides in: flat grass, a runway line, the long curved airport building small in the distance.
   - The light turns golden over the ride; from 790 the sky breaks into flat sunset bands (orange at the horizon, peach, lilac, grey-blue on top — no gradient).

10. Final hold at sunset, 846–899 (1.8 s)
   - Tempelhofer Feld at dusk, after the reference video: the long low terminal with a row of warm arcade lamps (switching on 815–840) and red obstruction lights, the red-and-white striped radar tower with its ball and red light, a radar dish on a mast, the Fernsehturm small on the horizon.
    - Clawd brakes to a stop at 850 (ease-out-quint), hops off, and stands on the field in stand pose.
    - The Luftbrückendenkmal ("Hungerharke", three concrete prongs bending west for the Berlin Airlift's air corridors) stands on the left horizon.
    - Nothing else moves except a 2% slow push-in.

MOTION RULES
- Entrances use ease-out; exits use ease-in and are 40–50% shorter. Vehicles arrive on ease-out-cubic and leave on ease-in-cubic.
- Camera moves use ease-in-out-quart only. Linear is only for wheel rotation, tunnel lights, constant scrolling.
- Springs use damping ratio 0.5 for Clawd's hops and landings, 0.8 for everything else. Position and scale may overshoot; opacity and color never do.
- One hero move per shot. Secondary elements move 50–70% as far and start 100–200 ms (3–6 frames) after the hero.
- Text never moves while it is readable. Every sign holds at least 1.1 s.
- Changing places uses a push: the old frame slides out to the left while the new one pushes in from the right, 14 frames, ease-in-out-quart. Push points: 185, 336, 411, 486, 726. Shots 2→3 use the paper transition; 7→8 and 9→10 continue the same framing.
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
