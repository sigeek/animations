// Starter tokens from the animations kit (copied from clawd-berlin).
// Every number the animation uses lives here: video, palette, easings,
// springs, frame ranges and layout. Frame numbers are global and match
// PROMPT.md.
import { Easing } from "remotion";

export const VIDEO = {
  id: "PomeloMarcello",
  width: 1080,
  height: 1920, // vertical
  fps: 30,
  durationInFrames: 300, // 10 s
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

export type ShotKey = "cafe" | "app" | "end";

// Frame ranges are inclusive.
export const SHOTS: Record<
  ShotKey,
  { name: string; from: number; to: number }
> = {
  cafe: { name: "1 Café", from: 0, to: 116 },
  app: { name: "2 The app", from: 117, to: 246 },
  end: { name: "3 End card", from: 247, to: 299 },
};

export const SHOT_ORDER: ShotKey[] = ["cafe", "app", "end"];

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

// ---------------------------------------------------------------- Pomelo

// The app's own look (from the captures).
export const APP = {
  bg: "#F3F4F8",
  blue: "#2D4FCB",
  blueSoft: "#DCE3FF",
  white: "#FFFFFF",
  url: "pomelo-weld.vercel.app",
} as const;

// Voiceover: draft macOS voice "Samantha", rate 190 (public/voiceover/).
export const VOICEOVER = [
  {
    file: "voiceover/vo1.wav",
    from: 3,
    frames: 113,
    text: "Marcello runs a café in Milan. A one-star review just came in.",
  },
  {
    file: "voiceover/vo2.wav",
    from: 118,
    frames: 125,
    text: "His AI intern drafts a reply. Three answers later, it sounds like him.",
  },
  {
    file: "voiceover/vo3.wav",
    from: 248,
    frames: 51,
    text: "An AI intern that learns your shop.",
  },
] as const;

// Captions for sound-off viewing: an ink pill near the bottom.
export const CAPTION = {
  y: 1700,
  maxW: 920,
  padX: 36,
  padY: 22,
  fontSize: 44,
  lineHeight: 58,
  radius: 28,
  upTo: 2,
} as const; // upTo: lines 1–2 (the end card has its own text)

// Shot 1: the café in Milan.
export const CAFE = {
  wall: "#F2E4CC",
  wainscot: { top: 1180, color: "#D9A47E" },
  window: {
    x: 110,
    y: 170,
    w: 860,
    h: 760,
    frame: 26,
    wood: "#5A3D2B",
    sky: "#B9D9EF",
    mullion: 14,
    transomY: 150, // a horizontal bar near the top, clear of the Duomo spire
  },
  duomo: {
    color: "#E9DCCB",
    baseY: 930,
    body: { x: 250, w: 580, h: 230 },
    gable: { h: 120, inset: 0.2 }, // gable spans the middle 60% of the front
    spires: { count: 13, w: 18, h: 96, from: 268, to: 812 },
    tallSpire: { x: 540, w: 24, h: 230, gold: "#E2B23A", goldR: 13 },
    door: { w: 70, h: 110, color: "#C9B9A7" },
    windows: { count: 4, w: 30, h: 70, y: 760, color: "#C9B9A7" },
  },
  board: {
    x: 760,
    y: 980,
    w: 230,
    h: 150,
    color: "#2F3A33",
    text: "Caffè 1,20",
    fontSize: 30,
    chalk: "#F4EFE6",
  },
  counter: {
    top: 1330,
    slabH: 40,
    marble: "#EEE8E0",
    wood: "#6B4A35",
    panels: 3,
    panelInset: 36,
  },
  machine: {
    x: 690,
    w: 260,
    h: 210,
    chrome: "#C9C1B4",
    accent: "#B8462E",
    groups: 2,
    groupW: 46,
    groupH: 40,
    cupW: 44,
    cupH: 40,
  },
  cups: { xs: [600, 650], w: 44, h: 42, color: "#FBF7EE" },
  // Glass pastry case with cornetti, on the counter at the left.
  vitrine: {
    x: 50,
    w: 300,
    h: 170,
    frame: 12,
    wood: "#5A3D2B",
    glass: "#DDEEF3",
    shelfY: 0.55,
    cornetti: {
      count: 3,
      w: 74,
      h: 34,
      color: "#D9A35A",
      shadeDx: 0.12,
      shadeDy: 0.33,
      shadeRx: 0.33,
      shadeRy: 0.25,
    },
  },
} as const;

// Marcello, drawn around his neck base (x, y), scale 1 = café size.
export const MARCELLO = {
  x: 470,
  y: 1080,
  cafeScale: 1.15,
  skin: "#E3B48F",
  hair: "#3A2A22",
  shirt: "#F7F5F0",
  apron: "#2E2B29",
  head: { r: 100, cy: -125 },
  hairCap: { top: -240, bottom: -172, sideburn: { w: 16, h: 44, dx: 86 } },
  ear: { r: 18, dx: 98, dy: -120 },
  eyes: { dx: 36, dy: -128, r: 9, lookAt: { dx: 7, dy: 7 } },
  brows: { dx: 36, dy: -154, w: 34, h: 8 },
  moustache: { w: 90, h: 22, dy: -88 },
  smile: { w: 64, dy: -60, depth: 26, stroke: 9 },
  neck: { w: 60, h: 40 },
  torso: { w: 300, h: 420, radius: 70 },
  apronBib: { w: 170, top: 70, strap: 14 },
  arm: {
    w: 66,
    shoulderDx: 128,
    shoulderDy: 40,
    restHand: { dx: -150, dy: 290 },
    phoneHand: { dx: 96, dy: 196 },
    handR: 26,
  },
  phone: {
    dx: 64,
    dy: 176,
    w: 74,
    h: 136,
    radius: 14,
    inset: 7,
    screen: "#DCE3FF",
  },
} as const;

// The review notification popping up from his phone.
export const REVIEW_POP = {
  at: 58,
  shake: { frames: 3, px: 6 },
  lookFrom: 60,
  springFrames: 14,
  card: { x: 560, y: 1080, w: 470, h: 210, radius: 26, pad: 26 },
  stars: {
    size: 34,
    gap: 6,
    on: "#E2B23A",
    off: "#D8D3CB",
    count: 5,
    lit: 1,
    points: 5,
    inner: 0.22,
  },
  text: {
    lines: ["Waited 20 minutes for one", "coffee. Never again."],
    fontSize: 30,
    lineHeight: 40,
  },
} as const;

// Shot 2: the phone. Screen images are 750 px wide (2x of 375 pt).
export const PHONE = {
  bg: "#E9ECF4",
  x: 540, // centre
  top: 70,
  bezel: 18,
  radius: 92,
  screenRadius: 74,
  body: "#15161A",
  scale: 0.92, // image px → canvas px
  imageW: 750,
  viewportH: 1624,
  statusH: 88,
  status: {
    time: "9:41",
    fontSize: 30,
    padX: 64,
    battery: { w: 46, h: 22, radius: 6 },
  },
  island: { w: 200, h: 56, top: 20 },
  innerPush: 0.3, // the outgoing screen moves 30% left
} as const;

export const SCREENS = [
  { src: "screens/01-task.jpg", at: 117 },
  { src: "screens/02-first-try.jpg", at: 142 },
  {
    src: "screens/03-compare-long.jpg",
    at: 184,
    scroll: { from: 204, to: 236, px: 950 },
  },
] as const;

// Finger tap on "Send to AI intern" (image px on the task screen).
export const TAP = {
  at: 136,
  lead: 4, // dot appears this many frames before the tap
  ripple: 10,
  x: 375,
  y: 1231,
  dotR: 34,
  rippleR: 90,
  color: "#1F1E1D",
  dotOpacity: 0.32,
} as const;

// Shot 3: end card.
export const END = {
  text: "An AI intern that learns your shop.",
  textY: 420,
  fontSize: 76,
  lineHeight: 92,
  maxW: 860,
  urlY: 760,
  urlSize: 40,
  marcello: { x: 600, y: 1290, scale: 1.6 },
} as const;
