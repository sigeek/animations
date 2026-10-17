// Starter tokens from the animations kit (copied from clawd-berlin).
// Every number the animation uses lives here: video, palette, easings,
// springs, frame ranges and layout. Frame numbers are global and match
// PROMPT.md.
import { Easing } from "remotion";

export const VIDEO = {
  id: "PomeloCocina",
  width: 1080,
  height: 1920, // vertical
  fps: 30,
  durationInFrames: 3600, // 2 minutes
} as const;

export const CENTER = { x: VIDEO.width / 2, y: VIDEO.height / 2 } as const;

export const COLORS = {
  paper: "#F4EFE6",
  ink: "#1F1E1D",
  clawd: "#D97757",
  stone: "#C9C1B4",
  shadow: "#8F877B",
  sky: "#DCE6EA",
  badgeText: "#FFFFFF",
} as const;

export const FONT = { weight: 700 } as const;

// Flat cel shading: light from the upper left. Shade = the object's color
// mixed toward ink, light = mixed toward white. Hard edges, no gradients.
export const SHADE = {
  ink: "#1F1E1D",
  white: "#FFFFFF",
  shadeMix: 0.2,
  vehicleTop: 8, // light band under a vehicle roof
  vehicleBottom: 34, // shade band along a vehicle's lower body
  doorSide: 0.3, // shaded right share of a door leaf
  lightMix: 0.22,
  side: 0.28, // share of a block's width shaded on its right
  column: 0.42, // columns: shaded right share
  facade: 0.1, // Altbau facades: a narrow shaded right edge
  cornice: 6, // shadow band under a cornice
  crescent: 0.3, // offset of the lit circle, as a share of the radius
} as const;

export const EASE = {
  linear: Easing.linear,
  out: Easing.out(Easing.quad),
  outCubic: Easing.out(Easing.cubic),
  inCubic: Easing.in(Easing.cubic),
  inOutQuad: Easing.inOut(Easing.quad),
  outQuint: Easing.out(Easing.poly(5)),
  inOutQuart: Easing.inOut(Easing.poly(4)),
} as const;

// Springs are specified by damping ratio. With mass 1 and stiffness 100,
// damping = 2 * ratio * sqrt(stiffness * mass).
export const SPRING = {
  mass: 1,
  stiffness: 100,
  clawdRatio: 0.5, // Clawd's hops and landings
  defaultRatio: 0.8, // everything else
} as const;

export const DEBUG = {
  fontSize: 28,
  padding: 24,
  background: "rgba(31, 30, 29, 0.75)",
} as const;

// Changing places (shots 5, 6, 7, 9 and the cut at 411): the old frame slides
// out left as the new one pushes in from the right.
export const PUSH = { frames: 14 } as const;

export type ShotKey =
  | "before"
  | "discovery"
  | "scheduling"
  | "instagram"
  | "result"
  | "close";

// Frame ranges are inclusive. Scenes 4–6 are Phase 2.
export const SHOTS: Record<
  ShotKey,
  { name: string; from: number; to: number }
> = {
  before: { name: "1 Before", from: 0, to: 599 },
  discovery: { name: "2 Discovery", from: 600, to: 1049 },
  scheduling: { name: "3 Scheduling", from: 1050, to: 1649 },
  instagram: { name: "4 Instagram (phase 2)", from: 1650, to: 2399 },
  result: { name: "5 Result (phase 2)", from: 2400, to: 3149 },
  close: { name: "6 Close (phase 2)", from: 3150, to: 3599 },
};

export const SHOT_ORDER: ShotKey[] = [
  "before",
  "discovery",
  "scheduling",
  "instagram",
  "result",
  "close",
];

export const shotLength = (key: ShotKey) => SHOTS[key].to - SHOTS[key].from + 1;

// A move at `speed` px/frame from `start`, with an optional ease-in start and
// an ease-out stop. Ease powers: 2 = quad, 3 = cubic, 5 = quint.
export type TravelSpec = {
  start: number;
  accelFrames: number;
  accelPower: number;
  decelFrom: number;
  stopAt: number;
  decelPower: number;
  speed: number;
};

// ---------------------------------------------------------------- Kiez Café

// The Paper design's palette and line (sampled from the captured screens).
export const DESIGN = {
  stripeA: "#F6DFA2",
  stripeB: "#EFD18A",
  stripeW: 56,
  cream: "#FFF9EE",
  panel: "#F9F0EA",
  line: "#5C2D2B",
  lineW: 5,
  shadeBand: 0.28, // right share of a rounded body in shade (clipped to it)
  sage: "#B9C98B",
  red: "#E0555A",
  green: "#6BC46A",
  sky: "#CFE7EE",
  wood: "#BC8559",
  teal: "#5FD3B5",
  purple: "#B9A3E3",
  pink: "#F7C9C0",
  dawn: { color: "#2B3150", opacity: 0.5, lit: 0.06 },
} as const;

// Voiceover switch. Off for now: captions carry the lines with the same
// timing, Marcello's mouth stays closed. The files stay in public/voiceover.
export const VOICEOVER_ON = false;

// Voiceover. o = Marcello ("Luca", rate 150), n = narrator ("Samantha", 155).
export const VOICE_LINES = [
  {
    id: "o1",
    who: "owner",
    from: 48,
    frames: 134,
    text: "Every week I did the rota on paper, then rewrote it when someone cancelled.",
  },
  {
    id: "o2",
    who: "owner",
    from: 220,
    frames: 161,
    text: "Then I'd sit down to post on Instagram, and spend most of an evening on one caption.",
  },
  {
    id: "o3",
    who: "owner",
    from: 450,
    frames: 90,
    text: "I was doing the admin, and the café was waiting.",
  },
  {
    id: "n1",
    who: "narrator",
    from: 640,
    frames: 118,
    text: "Pomelo is a gamified introduction to AI for small café owners.",
  },
  {
    id: "n2",
    who: "narrator",
    from: 790,
    frames: 107,
    text: "Instead of reading about AI, you try it on your own tasks.",
  },
  {
    id: "n3",
    who: "narrator",
    from: 1060,
    frames: 200,
    text: "The first order is staff scheduling. Pip, Marcello's AI apprentice, drafts next week's rota in seconds.",
  },
  {
    id: "n4",
    who: "narrator",
    from: 1280,
    frames: 192,
    text: "But the draft breaks the café's rules. No baker opens all week, and Jonas has uni on Wednesday and Thursday.",
  },
  {
    id: "n5",
    who: "narrator",
    from: 1500,
    frames: 103,
    text: "Marcello spots the problems, and Pip re-plans the week.",
  },
  {
    id: "n6",
    who: "narrator",
    from: 1660,
    frames: 120,
    text: "The second order is Instagram. Pip's first try only knew the cake's name.",
  },
  {
    id: "n7",
    who: "narrator",
    from: 1790,
    frames: 150,
    text: "Too generic. Marcello rates it, then gives Pip hints: dry Berlin humour, and the local fruit.",
  },
  {
    id: "n8",
    who: "narrator",
    from: 1960,
    frames: 170,
    text: "Now it sounds like Kiez Café. Marcello checks the name, dates and claims, then saves it to Drive.",
  },
  {
    id: "n9",
    who: "narrator",
    from: 2150,
    frames: 130,
    text: "Order served. Real work done, and Pip learns the café as it goes.",
  },
  {
    id: "n10",
    who: "narrator",
    from: 2290,
    frames: 100,
    text: "The AI drafts. The owner decides.",
  },
  {
    id: "n11",
    who: "narrator",
    from: 2420,
    frames: 150,
    text: "Before: paper rotas, and evenings spent on one caption.",
  },
  {
    id: "n12",
    who: "narrator",
    from: 2580,
    frames: 120,
    text: "With Pomelo: the orders get done, and the café gets its owner back.",
  },
  {
    id: "o4",
    who: "owner",
    from: 2740,
    frames: 120,
    text: "I still make every decision.",
  },
  {
    id: "o5",
    who: "owner",
    from: 2880,
    frames: 150,
    text: "I just don't have to start from a blank page.",
  },
  {
    id: "n13",
    who: "narrator",
    from: 3170,
    frames: 120,
    text: "You don't need to be a tech expert to start.",
  },
  {
    id: "n14",
    who: "narrator",
    from: 3300,
    frames: 140,
    text: "Pomelo takes you through AI one real task at a time.",
  },
  {
    id: "n15",
    who: "narrator",
    from: 3460,
    frames: 130,
    text: "Try it for your café.",
  },
] as const;

// The user's voice track (public/voiceover/voice.mp3, 81 s), cut at its
// pauses into scene chunks: [start s, end s] of the file → film frame.
export const VOICE_TRACK = {
  file: "voiceover/voice.mp3",
  chunks: [
    { from: 48, start: 0, end: 13.5 },
    { from: 640, start: 13.6, end: 22.4 },
    { from: 1060, start: 22.5, end: 44.0 },
    { from: 1700, start: 44.1, end: 61.8 },
    { from: 2580, start: 61.9, end: 72.7 },
    { from: 3170, start: 72.8, end: 81.48 },
  ],
} as const;

// Synthesized ambient sounds (scripts/make-sfx.py → public/sfx).
export const SFX = [
  { file: "sfx/switch.wav", from: 30, frames: 6, volume: 0.6 },
  { file: "sfx/steam.wav", from: 40, frames: 78, volume: 0.22 },
  { file: "sfx/chime.wav", from: 430, frames: 48, volume: 0.45 },
  { file: "sfx/whoosh.wav", from: 598, frames: 14, volume: 0.3 },
  { file: "sfx/tap.wav", from: 900, frames: 2, volume: 0.5 },
  { file: "sfx/tap.wav", from: 990, frames: 2, volume: 0.5 },
  { file: "sfx/whoosh.wav", from: 1048, frames: 14, volume: 0.3 },
  { file: "sfx/tap.wav", from: 1120, frames: 2, volume: 0.5 },
  { file: "sfx/tap.wav", from: 1590, frames: 2, volume: 0.5 },
  { file: "sfx/whoosh.wav", from: 1648, frames: 14, volume: 0.3 },
  { file: "sfx/tap.wav", from: 1800, frames: 2, volume: 0.5 },
  { file: "sfx/tap.wav", from: 1840, frames: 2, volume: 0.5 },
  { file: "sfx/tap.wav", from: 1900, frames: 2, volume: 0.5 },
  { file: "sfx/tap.wav", from: 1925, frames: 2, volume: 0.5 },
  { file: "sfx/tap.wav", from: 1960, frames: 2, volume: 0.5 },
  { file: "sfx/tap.wav", from: 2110, frames: 2, volume: 0.5 },
  { file: "sfx/tap.wav", from: 2150, frames: 2, volume: 0.5 },
  { file: "sfx/reward.wav", from: 2158, frames: 36, volume: 0.45 },
  { file: "sfx/tap.wav", from: 2300, frames: 2, volume: 0.5 },
  { file: "sfx/whoosh.wav", from: 2398, frames: 14, volume: 0.3 },
  { file: "sfx/chime.wav", from: 2700, frames: 48, volume: 0.4 },
  { file: "sfx/whoosh.wav", from: 3148, frames: 14, volume: 0.3 },
] as const;

// Captions: the spoken line, a brown pill near the bottom.
export const CAPTION = {
  y: 1748,
  maxW: 960,
  padX: 34,
  padY: 18,
  fontSize: 40,
  lineHeight: 52,
  radius: 26,
} as const;

// Scene 1: Kiez Café at 6:30 am.
export const CAFE = {
  lightsOn: { at: 30, frames: 10 },
  window: {
    x: 70,
    y: 200,
    w: 430,
    h: 520,
    frame: 22,
    mullion: 12,
    dawnSky: "#E9B9A8",
    daySky: "#CFE7EE",
  },
  lamps: [
    { x: 330, cord: 150 },
    { x: 760, cord: 210 },
  ],
  lamp: { shadeW: 150, shadeH: 70, bulbR: 18, off: "#8F877B", on: "#FFF3C4" },
  clock: { x: 850, y: 470, r: 92, from: 18, to: 23, runFrom: 230, runTo: 360 },
  shelf: {
    x: 560,
    y: 700,
    w: 420,
    h: 18,
    cups: [600, 680, 760, 860],
    cupW: 58,
    cupH: 54,
  },
  counter: { top: 1250, topH: 46, panels: 4, inset: 30 },
  machine: {
    x: 640,
    w: 330,
    h: 270,
    radius: 22,
    gauges: 2,
    gaugeR: 30,
    groupW: 70,
    groupH: 46,
    wandX: 960,
    wandTop: 1060,
  },
  steam: {
    from: 40,
    to: 150,
    puffs: 4,
    period: 36,
    rise: 220,
    r: 26,
    x: 975,
    y: 1050,
  },
  door: {
    x: 905,
    y: 820,
    w: 175,
    h: 430,
    bell: { x: 905, y: 812, r: 16 },
    swing: { at: 430, frames: 20 },
  },
  plant: { x: 120, y: 1250, potW: 110, potH: 90, leaves: 5 },
} as const;

// Marcello in the design's outlined style, drawn around his neck base.
export const MARCELLO = {
  skin: "#F0C29E",
  hair: "#3A2A22",
  shirt: "#FFFDF8",
  apron: "#A0603F",
  head: { r: 104, cy: -128 },
  hairCap: {
    top: -246,
    bottom: -178,
    sideburnW: 16,
    sideburnH: 46,
    sideburnDx: 88,
  },
  ear: { r: 19, dx: 102, dy: -122 },
  eyes: { dx: 38, dy: -132, r: 10, lookPhone: { dx: 7, dy: 9 } },
  brows: { dx: 38, dy: -158, w: 36, h: 9 },
  moustache: { w: 96, h: 24, dy: -92 },
  mouth: { w: 34, dy: -60, maxH: 26, minH: 3 },
  smile: { w: 66, dy: -58, depth: 26, stroke: 8 },
  neck: { w: 62, h: 42 },
  torso: { w: 310, h: 440, radius: 72 },
  apronBib: { w: 180, top: 74, strap: 15 },
  arm: {
    w: 70,
    shoulderDx: 132,
    shoulderDy: 42,
    handR: 27,
    rest: { dx: -156, dy: 300 },
    phone: { dx: 100, dy: 205 },
  },
  phone: { dx: 70, dy: 182, w: 80, h: 146, radius: 15, inset: 7 },
  level: { gain: 1.3 }, // mouth opening from the voice's per-frame loudness (0..1)
} as const;

// Paper rota on the counter.
export const ROTA = {
  x: 120,
  y: 1130,
  w: 400,
  h: 210,
  rotate: -4,
  title: "Rota",
  days: ["Mon", "Tue", "Wed", "Thu"],
  names: ["Lena", "Jonas", "Sofia"],
  strike: {
    at: 150,
    frames: 8,
    row: 1,
    col: 2,
    rewrite: "Mateo",
    writeFrames: 12,
  },
  fontSize: 26,
  titleSize: 34,
  focus: {
    from: 60,
    to: 84,
    back: 196,
    backFrames: 18,
    scale: 1.9,
    x: 320,
    y: 1235,
  },
} as const;

// Marcello's phone during "one caption": a half-written post with a cursor.
export const CAPTION_DRAFT = {
  from: 232,
  to: 400,
  texts: [
    "New cake today",
    "New cake today! It's",
    "New cake today! It's so",
    "New cake today!",
    "Come try our",
  ],
  every: 34, // the draft is rewritten every 34 frames
  cursorPeriod: 16,
  focus: {
    from: 224,
    to: 248,
    back: 400,
    backFrames: 18,
    scale: 1.5,
    x: 640,
    y: 880,
  },
  bubble: { x: 600, y: 620, w: 400, h: 150, fontSize: 30 },
} as const;

// Customers waiting from 430.
export const CUSTOMERS = [
  {
    x: 260,
    y: 1500,
    enterFrom: { x: -200, at: 420, frames: 30 },
    coat: "#7C9CC9",
    hair: "#C98B4E",
    skin: "#F0C29E",
  },
  {
    x: 700,
    y: 1520,
    enterFrom: { x: 1000, at: 434, frames: 30 },
    coat: "#C96F6F",
    hair: "#2E2220",
    skin: "#C98E6A",
  },
] as const;
export const CUSTOMER = {
  headR: 70,
  bodyW: 230,
  bodyH: 420,
  radius: 70,
} as const;

// Scene 2: Marcello at a table, then his phone's home screen.
export const DISCOVERY = {
  table: {
    y: 1400,
    h: 46,
    w: 980,
    legW: 34,
    legH: 520,
    cloth: "#F9F0EA",
    clothInset: 24,
  },
  cup: { x: 250, w: 120, h: 104, saucerW: 190 },
  marcello: { x: 600, y: 1010, scale: 1.55 },
  closeUpAt: 700,
  home: {
    cols: 4,
    icon: 150,
    gapX: 52,
    gapY: 74,
    top: 160,
    label: 26,
    rows: 9,
    pomeloRow: 6,
    pomeloCol: 1,
    scroll: { from: 700, to: 800, px: 760 },
    highlight: { at: 806, frames: 14, scale: 1.12 },
    open: { at: 900, frames: 14 },
    colors: [
      "#E0555A",
      "#6BC46A",
      "#B9A3E3",
      "#7C9CC9",
      "#F2B24E",
      "#5FD3B5",
      "#C98B4E",
      "#B9C98B",
    ],
    pomeloBg: "#F6DFA2",
    bg: "#EAD9F2",
  },
} as const;

// The big phone used for the app (scenes 2–4). Screens are 1170 px wide
// (3x of 390 css px); tap boxes are in css px.
export const APP_PHONE = {
  x: 540,
  top: 40,
  cssW: 390,
  cssH: 844,
  screenW: 760,
  bezel: 22,
  radius: 96,
  screenRadius: 76,
  body: "#2B1A19",
  island: { w: 210, h: 58, top: 22 },
  closeUpScale: 0.86, // during Discovery; pushes in to 1 in Scheduling
  pushIn: { from: 1050, to: 1080 },
  innerPush: 0.3,
} as const;

export const APP_SCREENS = [
  { src: "screens/01-welcome.png", at: 900 },
  { src: "screens/02-counter.png", at: 1000 },
  { src: "screens/08-shift.png", at: 1125 },
  { src: "screens/03-first-try.png", at: 1650 },
  { src: "screens/04-coach.png", at: 1846 },
  { src: "screens/05-taste-test.png", at: 1966 },
  { src: "screens/06-served.png", at: 2156 },
  { src: "screens/02-counter.png", at: 2306 },
] as const;

export const APP_TAPS = [
  { at: 990, screen: "01-welcome", target: "Open my café" },
  { at: 1120, screen: "02-counter", target: "Who's on shift?" },
  { at: 1590, screen: "08-shift", target: "Re-plan the week" },
  { at: 1800, screen: "03-first-try", target: "Too generic" },
  { at: 1840, screen: "03-first-try", target: "Give me a hint" },
  { at: 1900, screen: "04-coach", target: "Dry Berlin humour" },
  { at: 1925, screen: "04-coach", target: "Local fruit" },
  { at: 1960, screen: "04-coach", target: "Try again" },
  { at: 2110, screen: "05-taste-test", target: "I've checked it" },
  { at: 2150, screen: "05-taste-test", target: "Serve it: save to Drive" },
  { at: 2300, screen: "06-served", target: "Back to the counter" },
] as const;
export const TAP = {
  lead: 4,
  ripple: 10,
  dotR: 34,
  rippleR: 90,
  color: "#5C2D2B",
  dotOpacity: 0.3,
} as const;

// Camera zooms inside the phone screen (css px), in time order.
export const SCREEN_ZOOMS = [
  { from: 1290, to: 1320, x: 190, y: 290, scale: 1.8 }, // Jonas struck out Wed/Thu
  { from: 1385, to: 1410, x: 200, y: 625, scale: 1.15 }, // Pip's note and the rules
  { from: 1460, to: 1490, x: 195, y: 422, scale: 1 }, // back out
  { from: 1690, to: 1715, x: 195, y: 330, scale: 1.12 }, // Pip's first-try caption
  { from: 1760, to: 1780, x: 195, y: 422, scale: 1 },
  { from: 1990, to: 2015, x: 195, y: 210, scale: 1.12 }, // the new caption
  { from: 2075, to: 2095, x: 195, y: 422, scale: 1 },
  { from: 2190, to: 2215, x: 195, y: 420, scale: 1.2 }, // the +230 XP receipt
  { from: 2265, to: 2285, x: 195, y: 422, scale: 1 },
] as const;

// Scene 5: Result. Before / With Pomelo stacked (vertical video), then
// Marcello serving. Numbers only from the user's measured, sourced data:
// leave NUMBERS empty and the rows stay hidden.
export const RESULT = {
  split: { from: 2414, to: 2709 },
  before: {
    y: 120,
    h: 760,
    label: "Before",
    rota: { x: 40, y: 400 },
    clock: { x: 680, y: 150 },
    bubble: { x: 340, y: 270 },
  },
  after: { y: 960, h: 760, label: "With Pomelo" },
  labelSize: 54,
  panelR: 40,
  night: "#3B3F66",
  miniPhone: { w: 262, radius: 32, bezel: 12, gap: 70 },
  afterEnter: 60, // frames after the split starts that "With Pomelo" slides in
  beforeScale: 1.2, // the late-night props, scaled up in their panel
  numbers: [] as { label: string; before: string; after: string }[], // e.g. { label: "Time on the rota", before: "…", after: "…" }
  numbersSource: "", // where the numbers come from (shown small under them)
  serving: { from: 2710, cupX: 560, cupY: 1236, customerX: 760 },
} as const;

// Scene 6: Close. The storefront in the design's style, then the end card.
export const CLOSE = {
  clouds: [
    { x: 200, y: 180, w: 220 },
    { x: 760, y: 300, w: 180 },
  ],
  storefront: {
    from: 3150,
    to: 3369,
    x: 110,
    w: 860,
    y: 520,
    h: 1080,
    awningH: 150,
    stripes: 8,
    windowH: 420,
    doorW: 230,
  },
  endCard: {
    from: 3370,
    title: "Pomelo",
    tagline: "Your café's AI apprentice",
    cta: "Try it for your café",
    url: "pomelo-weld.vercel.app",
    pipSize: 300,
  },
} as const;
