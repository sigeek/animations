# Pomelo at Kiez Café — directed motion prompt (2 minutes)

GOAL
A 2-minute vertical film for Pomelo, a gamified introduction to AI for small café owners. Marcello, an Italian who runs Kiez Café in a Berlin Kiez, goes from evenings of admin to training Pip, his AI apprentice, on real café jobs. The viewer should feel "this is my café too" and see the real app screens.

OUTPUT
One Remotion project, composition "PomeloCocina", 1080 x 1920 (vertical), 30 fps, 3600 frames (0–3599). Each scene is a World component inside a <Series>. English voiceover, captions for sound-off viewing, synthesized ambient sound (no downloaded audio).

APP SCREENS
From the Paper design https://app.paper.design/file/01M54ZAJ8956HCGTXW656RRFF8/p-1-0/1-0, captured read-only with `scripts/capture-paper.mjs` at 1170 x 2532 (3x of 390 x 844) into public/screens/, with tap boxes in public/screens/taps.json:
01-welcome, 02-counter, 03-first-try, 04-coach, 05-taste-test, 06-served, 07-graduation, 08-shift.
The design has no re-planned rota screen; the scheduling beat ends on "Re-plan the week".

VOICE
The user's recording, public/voiceover/voice.mp3 (81 s, one voice), cut at its pauses into six chunks placed at frames 48, 640, 1060, 1700, 2580, 3170 (`VOICE_TRACK` in tokens). Captions are off while the recording differs from VOICE_LINES. The macOS draft voices (VOICEOVER_ON = false) are kept in public/voiceover.

STYLE
- Match the Paper design so film and app are one world: warm yellow vertical stripes (#F6DFA2 / #EFD18A), cream #FFF9EE, dark-brown outlines #5C2D2B (5 px), sage #B9C98B, Pip red #E0555A, button green #6BC46A, sky #CFE7EE, wood #BC8559. Fonts Itim (display) and Mali (body). Rounded shapes, flat fills, a darker shade band on the side away from the light. No gradients, no drop shadows.
- Marcello in the same outlined style: dark hair and moustache, white shirt, brown apron; his mouth moves with his voice (audio level).
- Fill the frame; no large empty areas.

SCENES (frame ranges inclusive)
1. Before, 0–599 (20 s). Kiez Café at 6:30 am.
   - 0–29: dim café (dawn tint). 30: the lights switch on (pendant lamps, switch click); the espresso machine warms up with steam puffs and a hiss, 40–150.
   - Marcello at the counter with a paper rota and his phone.
   - o1 48–182: "Every week I did the rota on paper, then rewrote it when someone cancelled." Close on the rota; at 150 a name is struck out and rewritten.
   - o2 220–380: "Then I'd sit down to post on Instagram, and spend most of an evening on one caption." The phone shows a half-written caption with a blinking cursor; the wall clock runs from 18:00 to 23:00 (230–360).
   - o3 450–540: "I was doing the admin, and the café was waiting." Two customers wait at the counter; the door chime rings at 430.
2. Discovery, 600–1049 (15 s). Push transition in.
   - Marcello sits with a coffee, scrolling his phone; the home screen scrolls and stops on the Pomelo icon (Pip's face on yellow) at 800; tap at 900.
   - n1 640–758: "Pomelo is a gamified introduction to AI for small café owners."
   - n2 790–897: "Instead of reading about AI, you try it on your own tasks."
   - 905–989: 01 Welcome; tap "Open my café" at 990; 02 Counter from 1000.
3. Challenge 1: scheduling, 1050–1649 (20 s). The camera pushes in until the phone fills the frame (1050–1080); Marcello's face stays out of this section.
   - n3 1060–1259: "The first order is staff scheduling. Pip, Marcello's AI apprentice, drafts next week's rota in seconds." Tap "Who's on shift?" at 1120; 08 Staff board pushes in 1125–1139.
   - n4 1280–1472: "But the draft breaks the café's rules. No baker opens all week, and Jonas has uni on Wednesday and Thursday." The camera zooms (1.6x) to the struck-out Jonas shifts and Pip's note, then to the rules, and back.
   - n5 1500–1603: "Marcello spots the problems, and Pip re-plans the week." Tap "Re-plan the week" at 1590.
4. Challenge 2: Instagram, 1650–2399 (25 s). PHASE 2.
   - 03 Pip's first try ("Too generic") → 04 Coach Pip (hints: your voice, dry Berlin humour, local fruit) → 05 Taste test (the new caption, "I've checked it", "Serve it: save to Drive") → 06 Order served (+230 XP).
   - Narration: Pip's first try only knew the cake's name; Marcello adds three hints; the caption now sounds like Kiez Café; he checks it and saves it. "The AI drafts. The owner decides."
5. Result, 2400–3149 (25 s). PHASE 2. Split screen: paper rota and late-night caption vs. the app's counter and the saved post; then Marcello relaxed, serving a customer. On-screen numbers only from the user's measured, sourced data (pending): time on the rota, time per post, posts per week, before → after.
6. Close, 3150–3599 (15 s). PHASE 2. Kiez Café from the street, then the Pomelo name and call to action: "You don't need to be a tech expert to start. Pomelo takes you through AI one real task at a time. Try it for your café."

MOTION RULES
- Entrances ease-out, exits ease-in 40–50% shorter; camera moves ease-in-out-quart; push transitions between scenes (14 frames); springs by damping ratio (0.5 for pops and taps, 0.8 otherwise); linear only for constant motion (steam rising, clock hands, scrolling).
- Screen changes inside the phone: iOS-style push, 14 frames, old screen moves 30% left.
- Taps: finger dot 4 frames before, ripple 10 frames, on the exact element box from taps.json.
- Captions show the line being spoken; text never moves while readable.

BANNED
Gradients, glow, drop shadows, fake app UI where a design screen exists, invented features, numbers that aren't measured and sourced, real customer data, logos other than Pomelo's name, fade-and-slide-up entrances.

PHASES
- Phase 1: tokens, design-style café, Marcello (talking), SFX, scenes 1–3 (0–1649). Stills at 20, 100, 160, 300, 480, 700, 850, 950, 1100, 1300, 1400, 1595 plus a contact sheet of 0–1649. Stop for review.
- Phase 2: scenes 4–6, after approval and the user's numbers.

QA
Render stills and a contact sheet, check them, then the MP4: `npx remotion render PomeloCocina out/pomelo-cocina.mp4 --props='{"debug":false}'`.
