// Every number the animation uses lives here: video, palette, easings,
// springs, frame ranges and layout. Frame numbers are global (0–899) and
// match PROMPT.md.
import { Easing } from "remotion";

export const VIDEO = {
  id: "ClawdBerlin",
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 900,
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

// Max 2 accent colors per scene.
export const ACCENTS = {
  desk: "#2B2A28", // shots 1–3
  gridBlue: "#9CBDE6", // shots 1–3: squared-paper lines
  s3Red: "#8E2B26", // shot 4: S-Bahn lower body, Fernsehturm antenna
  s3Ochre: "#D9A441", // shot 4: S-Bahn upper band
} as const;

export const FONT = { weight: 700 } as const;

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

export type ShotKey =
  | "title"
  | "crumple"
  | "unfold"
  | "alexanderplatz"
  | "museumsinsel"
  | "u5"
  | "bundestag"
  | "bus100"
  | "bike"
  | "final";

// Frame ranges are inclusive.
export const SHOTS: Record<ShotKey, { name: string; from: number; to: number }> = {
  title: { name: "1 Title card", from: 0, to: 44 },
  crumple: { name: "2 Crumple", from: 45, to: 60 },
  unfold: { name: "3 Unfold", from: 61, to: 80 },
  alexanderplatz: { name: "4 S3 to Alexanderplatz", from: 81, to: 184 },
  museumsinsel: { name: "5 Walk to Museumsinsel", from: 185, to: 335 },
  u5: { name: "6 U5 to Brandenburger Tor", from: 336, to: 485 },
  bundestag: { name: "7 Walk to the Bundestag", from: 486, to: 575 },
  bus100: { name: "8 Bus 100 to Ku'damm", from: 576, to: 725 },
  bike: { name: "9 Bike to Tempelhof", from: 726, to: 845 },
  final: { name: "10 Final hold", from: 846, to: 899 },
};

export const SHOT_ORDER: ShotKey[] = [
  "title",
  "crumple",
  "unfold",
  "alexanderplatz",
  "museumsinsel",
  "u5",
  "bundestag",
  "bus100",
  "bike",
  "final",
];

export const shotLength = (key: ShotKey) => SHOTS[key].to - SHOTS[key].from + 1;

// Clawd, in grid units (1 unit = 12 px). Sizes from PROMPT.md, positions
// from reference/clawd.png: eyes in columns 3–4 and 9–10, arms level with
// the eyes, legs in two pairs.
export const CLAWD = {
  unit: 12,
  body: { x: 0, y: 0, w: 14, h: 10 },
  arms: [
    { x: -3, y: 3, w: 3, h: 2 },
    { x: 14, y: 3, w: 3, h: 2 },
  ],
  eyes: [
    { x: 3, y: 3, w: 2, h: 3 },
    { x: 9, y: 3, w: 2, h: 3 },
  ],
  legs: [
    { x: 1, y: 10, w: 2, h: 3 },
    { x: 4, y: 10, w: 2, h: 3 },
    { x: 8, y: 10, w: 2, h: 3 },
    { x: 11, y: 10, w: 2, h: 3 },
  ],
  lookUpEyeShift: -1, // units
  stepLift: 1, // a lifted leg is 1 unit shorter
  anchor: { x: 7, y: 13 }, // feet centre: Clawd is positioned by this point
} as const;

export const WALK = {
  stepFrames: 6, // step A/B swap every 6 frames
  liftFrames: 3, // body is 1 unit higher for the first 3 frames after a swap
  liftUnits: 1,
} as const;

// Shot 1. Paper-local coordinates run 0..860.
export const TITLE = {
  paper: { size: 860, rotateDeg: -2 },
  text: {
    lines: ["Clawd", "exploring", "Berlin"],
    left: 96,
    top: 112,
    fontSize: 120,
    lineHeight: 128,
    letterSpacing: -2,
  },
  clawd: { x: 640, feetY: 760 },
  reveal: { from: 0, to: 6 }, // hero: the title wipes in, readable by frame 6
  clawdPop: { from: 4, frames: 12 }, // secondary: starts 4 frames after the hero
} as const;

// Shots 2–3: the sheet as a 5 x 5 point mesh. Its 16 edge points form the
// outline polygon; its 32 triangles are the wrinkle facets.
export const CRUMPLE = {
  seed: "crumple",
  vertices: 16,
  meshPoints: 5, // per side
  flatInnerJitter: 0.35, // inner points of a flat sheet move up to this share of a cell, so creases run at irregular angles
  contract: { from: 45, to: 58 },
  ballDiameter: 180,
  ballRadiusJitter: 0.35, // ± share of the radius, per vertex
  ballInteriorScale: 0.75, // inner mesh points sit inside the ball outline
  ballInteriorJitterPx: 22,
  midJitterPx: 70, // extra seeded vertex noise, peaking mid-crumple
  rotateByDeg: 25,
  squash: { from: 58, to: 60, scaleX: 1.1, scaleY: 0.88 },
  printFade: { from: 45, to: 50 }, // the title fades off so the ball is plain paper
} as const;

// Wrinkles are flat facets tinted with ink at a seeded opacity; no lines,
// no gradients.
export const WRINKLE = {
  maxShade: 0.14, // facet ink opacity at full crumple
} as const;

// Squared notebook paper: light-blue lines, bent through the wrinkle mesh.
export const GRID = {
  cells: 22, // per side of the sheet
  strokeWidth: 2, // at the title card's sheet size
  samplesPerLine: 44,
} as const;

export const UNFOLD = {
  expand: { from: 61, to: 80 },
  paperFade: { from: 61, to: 74 }, // the station shows through as the sheet opens
  wrinkleResidual: 0.35, // share of the ball's wrinkle shading left when fully open
} as const;

// Shot 4. World coordinates; the static camera shifts the whole world down
// so the Fernsehturm is in frame from the first frame.
export const ALEX = {
  camera: { offsetY: 380 },
  skyTop: -600,
  canopy: { y: 240, thickness: 28, columnXs: [140, 460], columnWidth: 16 },
  platform: { topY: 640, edgeHeight: 14, bottomY: 1100 },
  train: {
    arrive: { from: 81, to: 125 },
    enterFrontX: 1100,
    stopFrontX: 40,
    length: 1560,
    top: 400,
    bandBottom: 510,
    bottom: 660,
    noseRadius: 28,
    cabWindow: { offsetX: 20, w: 44 }, // clear of the open left door leaf
    windows: { firstOffsetX: 760, w: 160, gap: 40, count: 5, top: 420, bottom: 490 },
    badge: { offsetX: 640, y: 428, w: 96, h: 56, radius: 12, fontSize: 36, text: "S3" },
    door: {
      offsetX: 210,
      w: 270,
      top: 450,
      seam: 6,
      windowInset: 24,
      windowTop: 470,
      windowBottom: 560,
      open: { from: 126, to: 131 }, // right as the train stops
    },
  },
  sign: {
    x: 520,
    y: 290,
    w: 480,
    h: 84,
    fontSize: 52,
    text: "Alexanderplatz",
    rodInsetX: 40,
    rodWidth: 4,
    drop: { from: 117, to: 125 }, // folds down from its rods; readable from 125
  },
  tower: {
    x: 790,
    shaftBottomW: 44,
    shaftTopW: 26,
    sphereCy: -120,
    sphereR: 84,
    antennaW: 16,
    antennaTopY: -330,
    antennaBands: 5,
  },
  clawd: {
    landX: 432, // 40% of the frame, where shot 5's walk holds him
    landFeetY: 690,
    // Out of the train onto the platform.
    exitHop: {
      crouch: { from: 131, to: 133, scaleX: 1.08, scaleY: 0.9 },
      air: { from: 133, to: 143 }, // airborne 134–142, touches down at 143
      arcPeakPx: 110,
      land: { from: 143, to: 145, scaleX: 1.12, scaleY: 0.85 },
      settleFrames: 8, // spring back to 1 from frame 146
    },
    lookUp: { from: 138, to: 184 }, // at the top of the exit hop
    // Small excited hop in place while looking up at the tower.
    cheerHop: {
      crouch: { from: 151, to: 152, scaleX: 1.05, scaleY: 0.93 }, // right after the exit landing settles
      air: { from: 152, to: 162 },
      arcPeakPx: 48,
      land: { from: 162, to: 164, scaleX: 1.07, scaleY: 0.91 },
      settleFrames: 8,
    },
  },
} as const;

export const DEBUG = { fontSize: 28, padding: 24, background: "rgba(31, 30, 29, 0.75)" } as const;

// Review-only composition showing every pose plus the walk cycle.
export const POSE_SHEET = {
  id: "ClawdPoses",
  durationInFrames: 24,
  columns: [200, 540, 880],
  rowFeetY: [420, 860],
  labelOffsetY: 70,
  labelFontSize: 32,
} as const;
