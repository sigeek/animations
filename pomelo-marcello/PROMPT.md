# Marcello and his AI intern — directed motion prompt

GOAL
A 10-second vertical teaser for Pomelo (https://pomelo-weld.vercel.app), the "AI intern" for small shop owners. Marcello, who runs a small café in Milan, gets a 1-star review; his AI intern turns a generic reply into one that sounds like him once he tells it three things. The viewer should feel "that's my shop too" and recognize the app's real screens.

OUTPUT
One Remotion project, composition "PomeloMarcello", 1080 x 1920 (vertical), 30 fps, 300 frames (0–299). Each shot is a World component inside a <Series>. Voiceover in English. The app screens are real captures from the live app (reference/, public/screens/); everything else is drawn in code.

VOICEOVER (draft voice: macOS "Samantha", rate 190; final: ElevenLabs or own recording, same lines)
1. 3–116: "Marcello runs a café in Milan. A one-star review just came in." (3.76 s)
2. 118–242: "His AI intern drafts a reply. Three answers later, it sounds like him." (4.14 s)
3. 248–298: "An AI intern that learns your shop." (1.67 s)
Captions show each line while it plays (sound-off viewing), held still while readable.

CHARACTER
Marcello: flat, cel-shaded, friendly. Dark hair and moustache, white shirt, dark apron. Seen behind his counter from the waist up. Poses: neutral, looking at phone, smiling.

STYLE
- Flat 2D shapes, no outlines, hard edges; flat cel shading, light from the upper left (house style).
- Café palette: warm cream wall, terracotta accents, dark wood counter with a marble top, chrome espresso machine. Through the window: the Duomo di Milano's spires against a morning sky.
- App shots use the app's own look: background #F3F4F8, Pomelo blue #2D4FCB, font Plus Jakarta Sans (also used for captions and the end card).
- The phone: dark rounded body, a status bar (9:41) above the captured screen.

SHOTS (frame ranges inclusive)
1. Café, 0–116 (3.9 s)
   - Marcello behind the counter, Duomo in the window. Hero move: at 58 his phone buzzes (3-frame shake) and a 1-star review card pops up beside it (spring, damping ratio 0.5): "★☆☆☆☆ Waited 20 minutes for one coffee. Never again."
   - From 60 he looks at the phone.
2. The app, 117–246 (4.3 s). Push in from the right (14 frames).
   - Task screen (the prefilled review). Tap on "Send to AI intern" at 136 (finger dot + ripple).
   - 142–156: screen pushes to "Your AI intern's first try" (the generic reply). Caption beat: "drafts a reply".
   - 184–198: screen pushes to "Same AI intern. Three answers later." (compare), on the words "Three answers later".
   - 204–236: the compare screen scrolls (camera ease) to the colour-highlighted "After onboarding" reply and holds.
3. End card, 247–299 (1.7 s). Push in from the right.
   - Pomelo blue background, Marcello smiling with his phone, "An AI intern that learns your shop." and pomelo-weld.vercel.app. Holds still.

MOTION RULES
- House rules apply (see ../templates/PROMPT.md): ease-out entrances, ease-in exits 40–50% shorter, springs by damping ratio (0.5 playful pops, 0.8 the rest), push transitions between places, linear only for constant motion.
- Screen pushes inside the phone use the iOS feel: new screen slides in from the right over 14 frames (ease-in-out-quart), the old one moves 30% left.
- Taps: finger dot appears 4 frames before, ripple 10 frames.

BANNED
Gradients, glow, drop shadows, fake app UI where a real capture exists, real customer names or personal data, brand logos other than the app's own name, fade-and-slide-up entrances.

RENDER CONTRACT
Every value a pure function of the frame; seeded randomness only; fonts and images loaded before rendering; debug overlay behind a prop.

QA
Render stills at 30, 70, 125, 150, 200, 236, 270 and a contact sheet of 0–299, check them, then render the MP4: `npx remotion render PomeloMarcello out/pomelo-marcello.mp4 --props='{"debug":false}'`.
