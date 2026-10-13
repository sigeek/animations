// Starter tokens from the animations kit (copied from clawd-berlin).
// Every number the animation uses lives here: video, palette, easings,
// springs, frame ranges and layout. Frame numbers are global and match
// PROMPT.md.
import { Easing } from "remotion";

export const VIDEO = {
  id: "__COMP__",
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 90, // set from your SHOTS
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
  // Cel shading as in the Opus 5.5 Motion Lab reference: a 1-unit light band
  // on top of the body, a 1-unit shade band at its bottom, the top unit of
  // each leg and the bottom unit of each arm in shade.
  shading: { topUnits: 1, bottomUnits: 1, legUnits: 1, armUnits: 1 },
  stepLift: 1, // a lifted leg is 1 unit shorter
  anchor: { x: 7, y: 13 }, // feet centre: Clawd is positioned by this point
} as const;

export const WALK = {
  stepFrames: 6, // step A/B swap every 6 frames
  liftFrames: 3, // body is 1 unit higher for the first 3 frames after a swap
  liftUnits: 1,
} as const;

export const DEBUG = {
  fontSize: 28,
  padding: 24,
  background: "rgba(31, 30, 29, 0.75)",
} as const;

// Review-only composition showing every pose plus the walk cycle.
export const POSE_SHEET = {
  id: "ClawdPoses",
  durationInFrames: 24,
  columns: [200, 540, 880],
  rowFeetY: [420, 860],
  labelOffsetY: 70,
  labelFontSize: 32,
} as const;

// Changing places (shots 5, 6, 7, 9 and the cut at 411): the old frame slides
// out left as the new one pushes in from the right.
export const PUSH = { frames: 14 } as const;

export type ShotKey = "intro";

// Frame ranges are inclusive.
export const SHOTS: Record<ShotKey, { name: string; from: number; to: number }> = {
  intro: { name: "1 Intro", from: 0, to: 89 },
};

export const SHOT_ORDER: ShotKey[] = ["intro"];

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

// Placeholder scene layout; replace with your own.
export const INTRO = {
  groundY: 860,
  clawdX: 432,
  feetY: 1000,
  sun: { r: 60, y: 260, fromX: 160, toX: 920, from: 0, to: 89, color: "#F2C230" },
} as const;
