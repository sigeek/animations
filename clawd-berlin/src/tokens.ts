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
  spree: "#6F9CC0", // shot 5: river
  yellow: "#F2C230", // shot 6: U5 car; shot 8: bus 100, Victoria, Siegessäule rings
  yellowDark: "#D9A21B", // U5 doors and frames, bus wheel arches
  glass: "#A9C6D9", // shot 7: Reichstag dome
  grass: "#A3C27A", // shots 9–10: Tempelhofer Feld
  kite: "#C8463B", // shot 10
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
export const SHOTS: Record<
  ShotKey,
  { name: string; from: number; to: number }
> = {
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
    roofH: 12,
    windscreen: { offsetX: 10, w: 60, top: 432, bottom: 496 }, // clear of the open left door leaf
    destination: {
      offsetX: 10,
      w: 60,
      top: 414,
      h: 14,
      fontSize: 11,
      text: "S3",
    },
    headlight: { offsetX: 22, y: 584, r: 8 },
    windows: {
      offsets: [760, 1270, 1470], // either side of the second door
      w: 160,
      mullion: 6,
      top: 420,
      bottom: 490,
    },
    secondDoorOffsetX: 960,
    badge: {
      offsetX: 640,
      y: 428,
      w: 96,
      h: 56,
      radius: 12,
      fontSize: 36,
      text: "S3",
    },
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

// ---------------------------------------------------------------- Phase 2

// Building colors per neighborhood. Flat colors only.
export const PALETTE = {
  sandstone: {
    light: "#F3E6C9",
    base: "#E8D3A8",
    dark: "#C3A777",
    deep: "#6E5B3E",
  }, // Museumsinsel, Tor, Reichstag, Siegessäule
  copper: { base: "#5F8F7B", rib: "#86B19D" },
  treeline: "#A9C49A", // distant trees
  tree: "#6E9A5B",
  kreuzberg: ["#F2D98D", "#F0B9A6", "#BFDCC6", "#BCD3E6", "#E9C7DE", "#F4E2C2"], // pastel Altbau
  kudamm: ["#F4E9D4", "#EADBC0", "#F1E0CB"], // cream Gründerzeit
  stucco: "#FBF7EE",
  window: "#3C3A36",
  ruin: "#5E554D", // Gedächtniskirche old tower
  newChurch: { body: "#22355E", glass: "#3F6FB5" },
} as const;

// Changing places (shots 5, 6, 7, 9 and the cut at 411): the old frame slides
// out left as the new one pushes in from the right.
export const PUSH = { frames: 14 } as const;

// Shared street layout for shots 5, 7, 8 and 9 (screen coordinates).
export const STREET = {
  horizonY: 860, // base of buildings and trees
  road: { top: 860, bottom: 930 },
  curb: { top: 930, bottom: 940 },
  sidewalkTop: 940,
  feetY: 1000, // Clawd walks here
  clawdX: 432, // 40% of the frame
  parallax: { street: 1, island: 0.85, buildings: 0.5, skyline: 0.2 },
  lamps: { spacing: 360, top: 620, width: 12, headW: 48, headH: 14 },
} as const;

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

export const WALK_SPEED = 8; // px/frame on the street layer

export type SignAnchor = "center" | "left";

export const POLE_SIGN = {
  poleWidth: 10,
  panelH: 72,
  padX: 24,
  fontSize: 44,
  badge: { w: 84, h: 52, radius: 12, fontSize: 32, gap: 16 },
  arrow: { w: 44, h: 36, gap: 14 },
} as const;

// Distant tree line on the skyline layer, instead of grey blocks.
export const DISTANT_TREES = {
  seed: "treeline",
  count: 16,
  spacing: 74,
  minR: 34,
  maxR: 62,
  sink: 0.35,
} as const;

// Trees in a band on the buildings layer (Platz der Republik, Tiergarten).
export const TREE_BAND = {
  seed: "tiergarten",
  count: 8,
  spacing: 190,
  r: 100,
  rJitter: 0.25,
  trunkW: 18,
  trunkH: 380,
} as const;

// Gründerzeit facades. Floors are counted from the height.
export const ALTBAU = {
  floorH: 84,
  groundH: 100,
  cornice: 16,
  window: { w: 30, h: 50, frame: 6, pitch: 58, top: 18 },
  shop: { inset: 18, h: 64, doorW: 34 },
  balcony: { slab: 6, railH: 24, bars: 6, barW: 3, every: 2 }, // every 2nd facade, middle windows
  kreuzberg: {
    seed: "kreuzberg",
    count: 10,
    minW: 220,
    maxW: 300,
    minH: 380,
    maxH: 460,
  },
  kudamm: {
    seed: "kudamm",
    count: 6,
    minW: 260,
    maxW: 320,
    minH: 440,
    maxH: 500,
  },
  streetTrees: { spacing: 330, r: 74, trunkW: 14, trunkH: 230 }, // Schöneberg lindens
} as const;

// Shot 5, 185–335: along the Spree past the Dom, Altes Museum, Neues Museum
// to the Alte Nationalgalerie. The island sits on its own parallax layer.
export const MUSEUM = {
  travel: {
    start: 185,
    accelFrames: 0,
    accelPower: 1,
    decelFrom: 300,
    stopAt: 320,
    decelPower: 2,
    speed: 12,
  },
  atFrame: 320, // island layout below is where things are when Clawd stops
  scale: 1.3, // every museum is drawn 1.3x around its base centre
  tower: { atFrame: 185, screenX: 980, scale: 0.42 }, // distant Fernsehturm
  signpost: {
    atFrame: 185,
    screenX: 640,
    panelY: 640,
    panelW: 450,
    text: "Museumsinsel",
  },
  dom: {
    centerScreenX: -819,
    base: { w: 380, h: 170 },
    windows: { count: 6, w: 26, h: 56, top: 40 },
    portico: {
      w: 150,
      columns: 6,
      columnW: 14,
      h: 110,
      band: 16,
      pedimentH: 32,
    },
    towers: {
      w: 56,
      h: 240,
      domeR: 30,
      lantern: { w: 10, h: 26 },
      windowW: 16,
      windowH: 44,
      windowYs: [36, 108],
    },
    drum: { w: 150, h: 60, windows: 4, windowW: 18, windowH: 34 },
    dome: { r: 92, ribs: 7, ribW: 4 },
    lantern: { w: 26, h: 60 },
    cross: { w: 14, h: 24, bar: 4, barY: 7 },
  },
  altes: {
    centerScreenX: -241,
    w: 480,
    podiumH: 30,
    stairs: { w: 160, steps: 3 },
    columns: 18,
    columnW: 12,
    columnH: 130,
    entablature: 26,
    attic: { w: 200, h: 70 },
  },
  neues: {
    centerScreenX: 324,
    w: 320,
    h: 250,
    plinth: 30,
    windows: { rows: 3, cols: 6, w: 22, h: 40, top: 40, pitchY: 62 },
    risalit: { w: 100, rise: 30, pedimentH: 30 },
  },
  natgal: {
    centerScreenX: 780,
    w: 300,
    podium: { h: 150, windows: 5, windowW: 26, windowH: 50, windowTop: 52 },
    columns: 8,
    columnW: 14,
    columnH: 130,
    entablature: 22,
    pedimentH: 50,
    inscription: { text: "DER DEUTSCHEN KUNST", fontSize: 13 },
    stairs: { bottomW: 210, topW: 120, stepH: 15, lineH: 2 },
    rider: { w: 56, h: 62 },
  },
} as const;

// Shot 6, 336–485.
export const U5 = {
  tunnel: { from: 336, to: 410 },
  speed: 40, // px/frame, tunnel lights and ribs, linear
  lights: { spacing: 300, y: 210, w: 70, h: 16 },
  ribs: { spacing: 600, w: 36 },
  car: {
    top: 360,
    bottom: 900,
    windowTop: 450,
    windowBottom: 640,
    roofH: 20,
    frame: 8, // darker yellow frame around windows and doors
    windows: [
      { x: 312, w: 240 }, // Clawd's window
      { x: 880, w: 200 },
    ],
    doors: [
      { x: 60, w: 180 },
      { x: 640, w: 180 },
    ],
    doorInset: 16,
    seam: 4,
    seatH: 46, // seat backs seen through the empty window
    pole: { w: 6, at: 0.72 },
    underframe: { top: 860 },
    bogies: { xs: [150, 330, 750, 930], r: 26 },
    badge: {
      x: 380,
      y: 700,
      w: 96,
      h: 56,
      radius: 12,
      fontSize: 36,
      text: "U5",
    },
  },
  clawdX: 432,
  gate: {
    cutAt: 411,
    rise: { from: 411, to: 430 },
    lookUp: { from: 440, to: 485 },
    stairs: { left: 300, right: 566, steps: 4 },
    riseDepthPx: 240, // Clawd starts this far below the sidewalk
    railing: { top: 880, postW: 10, railH: 10 },
    sign: {
      poleX: 60,
      panelY: 700,
      panelW: 620,
      text: "Brandenburger Tor",
      badge: "U5",
    },
    tor: {
      left: 600,
      right: 1060,
      baseY: STREET.horizonY,
      stepH: 24,
      columns: 6,
      columnW: 34,
      columnTop: 570,
      capital: { w: 46, h: 10 },
      columnBase: { w: 44, h: 8 },
      frieze: { top: 540, triglyphW: 6, triglyphH: 14, pitch: 24 },
      attic: { top: 480, overhang: 16, reliefInset: 34, reliefH: 28 },
      wings: { w: 84, h: 200, columns: 2, columnW: 14, roofH: 26 },
      quadriga: { centerX: 830, w: 150, h: 90 },
    },
  },
} as const;

// Shot 7, 486–575.
export const BUNDESTAG = {
  travel: {
    start: 486,
    accelFrames: 0,
    accelPower: 1,
    decelFrom: 535,
    stopAt: 555,
    decelPower: 2,
    speed: WALK_SPEED,
  },
  treeGap: 30, // between the tree band and the Reichstag
  reichstag: {
    atFrame: 555,
    centerScreenX: 760,
    w: 600,
    h: 300,
    rustica: 70,
    windows: {
      w: 22,
      h: 44,
      pitch: 44,
      rows: [630, 710],
      groundY: 806,
      groundH: 30,
    },
    towers: {
      w: 84,
      h: 360,
      cornice: 14,
      windowW: 16,
      windowH: 36,
      rows: [560, 640, 720],
      cols: [0.3, 0.7],
    },
    portico: {
      w: 230,
      columns: 6,
      columnW: 18,
      pedimentH: 60,
      band: 20,
      top: 660,
    },
    inscription: { text: "DEM DEUTSCHEN VOLKE", fontSize: 15 },
    dome: { r: 104, ribs: 5, ringH: 10 },
  },
  busStop: {
    atFrame: 555,
    screenX: 250,
    panelY: 660,
    panelW: 400,
    text: "Bundestag",
    badge: "100",
  },
} as const;

// Shot 8, 576–725.
export const BUS100 = {
  arrive: { from: 576, to: 590 },
  enterFrontX: 520,
  frontX: 140, // the camera rides with the bus after it stops
  length: 1100,
  top: 470,
  bottom: 900, // body; the wheels reach the road at 930
  noseRadius: 36,
  upperWindows: { top: 530, bottom: 650 },
  lowerWindows: { top: 720, bottom: 850 },
  frontWindow: { offsetX: 10, w: 260 }, // upper deck, Clawd's seat
  door: { offsetX: 262, w: 96, top: 700, seam: 4, inset: 12 }, // behind the front axle
  lowerWindowsFrom: 380,
  lowerWindscreen: { offsetX: 8, w: 74, top: 712, bottom: 836 },
  headlight: { offsetX: 20, y: 870, r: 9 },
  mirror: { armW: 22, armH: 6, y: 548, w: 10, h: 44 },
  roofH: 10,
  skirtH: 24,
  archR: 56,
  sideDisplay: {
    offsetX: 420,
    y: 662,
    w: 130,
    h: 32,
    fontSize: 22,
    text: "100",
  },
  windowGap: 24,
  windowW: 200,
  wheels: { r: 44, cy: 886, offsets: [200, 860], hubR: 14 },
  destination: {
    offsetX: 24,
    y: 482,
    w: 120,
    h: 40,
    fontSize: 28,
    text: "100",
  },
  hop: {
    crouch: { from: 591, to: 592, scaleX: 1.06, scaleY: 0.92 }, // 2-frame anticipation
    air: { from: 592, to: 602 },
    arcPeakPx: 120,
    land: { from: 602, to: 604, scaleX: 1.08, scaleY: 0.9 },
    settleFrames: 6,
  },
  travel: {
    start: 606,
    accelFrames: 14,
    accelPower: 3,
    decelFrom: 670,
    stopAt: 690,
    decelPower: 3,
    speed: 72, // fast enough that the Tiergarten fills the frame at 645 and the Ku'damm only arrives near the stop
  },
  treesEnd: { atFrame: 690, screenX: 1180 }, // the Tiergarten ends just off-frame at the Ku'damm stop
  siegessaeule: {
    atFrame: 645,
    screenX: 280,
    base: { w: 140, h: 90 },
    hall: { w: 120, h: 60, columns: 6, columnW: 8 },
    shaftW: 40,
    rings: { h: 16, ys: [600, 480, 360] },
    capital: { w: 56, h: 18 },
    top: 230,
  },
  kirche: {
    atFrame: 690,
    screenX: 860,
    w: 150,
    h: 640, // tall enough that clock and belfry clear the bus roof
    brokenTopDrop: 90,
    belfry: { y: 400, w: 22, h: 60, gap: 18 },
    clock: { y: 352, r: 26, hand: 4, minute: 0.7, hour: 0.5 },
    lower: { y: 610, w: 22, h: 70, gap: 18 },
    door: { w: 50, h: 90 },
    hall: { w: 200, h: 150 },
    tower: { w: 100, h: 500, gap: 30 },
    glass: { cell: 14, gap: 4 },
  },
  kudammEnd: 20, // gap between the Ku'damm facades and the church hall
  sign: {
    atFrame: 690,
    screenX: 520,
    panelY: 380,
    panelW: 440,
    text: "Kurfürstendamm",
  },
} as const;

// Shots 9–10, 726–899.
export const BIKE = {
  travel: {
    start: 726,
    accelFrames: 0,
    accelPower: 1,
    decelFrom: 846,
    stopAt: 850,
    decelPower: 5,
    speed: 12,
  },
  x: 432,
  groundY: 1000,
  wheelR: 56,
  wheelBase: 230,
  // A Berlin city bike: teal frame, cream fenders, wicker basket.
  frameColor: "#2F7F74",
  tubeW: 9,
  spokes: 12,
  spokeW: 2,
  tyreW: 10,
  rim: { inset: 9, w: 3 },
  hubR: 6,
  bracketDrop: 6, // bottom bracket sits a little below the hubs
  chainring: { r: 18, w: 4 },
  crank: { len: 28, w: 6, ratio: 0.5 }, // turns at half the wheel speed
  pedal: { w: 20, h: 7 },
  cog: { r: 9 },
  chainW: 2,
  fender: { gap: 9, w: 6, color: "#F4EFE6", from: 200, to: 340 }, // arc degrees over the wheel
  saddle: [
    [-28, 0],
    [16, 0],
    [24, -8],
    [-20, -11],
  ],
  handlebar: { rise: 30, back: 34, gripW: 20, gripH: 9 },
  headlamp: { r: 7, drop: 18 },
  rack: { w: 74, h: 6, rise: 14 },
  basket: { w: 80, h: 56, color: "#C9A36A", weave: 4, weaveW: 3 },
  seatH: 112, // saddle top above the wheel centres
  seatSinkUnits: 1, // Clawd sits 1 unit into the saddle so he doesn't float
  bumps: [760, 800],
  bump: { up: 2, down: 4 }, // frames
  tower: { atFrame: 726, screenX: 880, scale: 0.6 }, // distant Fernsehturm, sphere above the Kreuzberg roofs
  cityDrop: { from: 790, to: 808, px: 700 },
  field: {
    slide: { from: 795, to: 825 },
    top: 880,
    runway: { y: 930, h: 8, dash: 80, gap: 60 },
    // From the reference video: the long low terminal with a row of warm
    // arcade lamps and red obstruction lights, the red-and-white radar
    // tower, a radar dish on a mast, the Fernsehturm far off.
    airport: {
      left: 360,
      right: 1120,
      h: 80,
      roofArc: 18,
      lamps: { y: 836, w: 16, h: 10, pitch: 54 },
      hall: { x: 640, w: 140, h: 120, windows: 4, windowW: 16, windowH: 26 },
      redLights: [420, 700, 1000],
      redLightR: 4,
    },
    radarTower: {
      x: 230,
      h: 320,
      bottomW: 64,
      topW: 26,
      leg: 5,
      brace: 3,
      braceStep: 44,
      stripes: 6,
      stripeH: 14,
      ballR: 16,
      lightR: 5,
    },
    radarDish: { x: 1010, h: 150, mastW: 6, dishW: 48, dishH: 16 },
    farTower: { x: 830, scale: 0.3 },
    kites: [
      { x: 300, y: 320, size: 72, color: "kite" },
      { x: 780, y: 230, size: 56, color: "paper" },
    ],
    kiteTail: 90,
  },
  hopOff: {
    crouch: { from: 853, to: 855, scaleX: 1.08, scaleY: 0.9 },
    air: { from: 855, to: 863 },
    arcPeakPx: 70,
    land: { from: 863, to: 865, scaleX: 1.12, scaleY: 0.85 },
    settleFrames: 8,
  },
  landX: 760, // clear of the front wheel
  pushIn: { from: 846, to: 899, scale: 1.02, originX: 540, originY: 900 },
} as const;

// A day passing: sky color and a flat light tint over each scene, keyed by
// global frame (morning at Alexanderplatz → dusk at Tempelhof). The paper
// shots (before 81) are indoors and untinted.
export const DAY = {
  keys: [
    { frame: 81, sky: "#DCE6EA", tint: "#FFE7B0", tintOpacity: 0 }, // morning
    { frame: 185, sky: "#D2E5F0", tint: "#FFE7B0", tintOpacity: 0 }, // late morning
    { frame: 411, sky: "#BFDDF2", tint: "#FFFFFF", tintOpacity: 0 }, // midday
    { frame: 576, sky: "#CDDDE4", tint: "#F2C27A", tintOpacity: 0.06 }, // afternoon
    { frame: 726, sky: "#EBD8B6", tint: "#F0A050", tintOpacity: 0.12 }, // golden hour
    { frame: 800, sky: "#E3BC98", tint: "#E07A40", tintOpacity: 0.14 },
    { frame: 846, sky: "#8E9DC0", tint: "#2E3150", tintOpacity: 0.18 }, // dusk
  ],
  // Flat sunset bands from the horizon up, no gradient.
  sunset: {
    from: 790,
    to: 846,
    horizonY: 880,
    bands: [
      { top: 760, color: "#F07A3C" },
      { top: 690, color: "#F59A5C" },
      { top: 590, color: "#EDB49A" },
      { top: 440, color: "#B4B2CC" },
    ],
  },
  lamps: { from: 815, to: 840, off: "#8F877B", on: "#FFD27A" },
  redLight: "#E8413A",
} as const;

// The Quadriga on the Brandenburger Tor, in copper patina. Coordinates are
// relative to the centre of the attic top (y up is negative).
export const QUADRIGA = {
  pedestal: { w: 180, h: 12 },
  // One horse facing right, origin at its hooves; mirrored for the left pair.
  horse: [
    [-30, -24],
    [-30, -44],
    [-20, -50],
    [14, -50],
    [22, -64],
    [30, -76],
    [40, -72],
    [34, -60],
    [28, -46],
    [26, -30],
    [18, -24],
  ],
  legs: [
    { x: -28, w: 6, top: -24, bottom: 0 },
    { x: -18, w: 6, top: -24, bottom: 0 },
    { x: 14, w: 6, top: -26, bottom: -6 }, // front legs raised
    { x: 22, w: 6, top: -28, bottom: -12 },
  ],
  tail: { x1: -30, y1: -42, x2: -42, y2: -18, w: 5 },
  horses: [
    { x: -36, flip: true, back: true, lift: -6 },
    { x: 36, flip: false, back: true, lift: -6 },
    { x: -66, flip: true, back: false, lift: 0 },
    { x: 66, flip: false, back: false, lift: 0 },
  ],
  backShade: "#47705F",
  chariot: {
    x: -20,
    y: -40,
    w: 40,
    h: 28,
    wheelR: 14,
    wheelY: -14,
    wheelStroke: 3,
    spokes: 4,
  },
  victoria: {
    robe: [
      [-9, -38],
      [9, -38],
      [6, -86],
      [-6, -86],
    ],
    headR: 6,
    headY: -93,
    wing: [
      [-4, -80],
      [-36, -122],
      [-22, -84],
    ], // left wing; mirrored for the right
  },
  staff: { x1: 10, y1: -84, x2: 16, y2: -152, w: 4 },
  wreath: { y: -160, r: 11, stroke: 3 },
  cross: { long: 14, short: 4 },
  eagle: [
    [4, -174],
    [16, -184],
    [28, -174],
    [16, -178],
  ],
} as const;

// Fernsehturm sphere detail (shot 4 and the distant towers).
export const TOWER_DETAIL = { bandY: 6, bandH: 20 } as const; // window band below the sphere centre

// Landmark outlines and proportions, as relative point lists and ratios.
export const SHAPES = {
  // Victoria with spread wings, relative to the column top centre (y up is negative).
  victoria: [
    [-10, 0],
    [10, 0],
    [6, -52],
    [30, -70],
    [8, -36],
    [0, -70],
    [-8, -36],
    [-30, -70],
    [-6, -52],
  ],
  // Broken tower top: [x share of width, y share of the drop].
  kircheTop: [
    [0, 0.2],
    [0.18, 0],
    [0.32, 0.35],
    [0.5, 0.1],
    [0.64, 0.6],
    [0.8, 0.45],
    [1, 1],
  ],
  // Equestrian statue, relative to its bottom-centre, scaled to MUSEUM.natgal.rider.
  rider: [
    [-28, 0],
    [-24, -30],
    [-28, -40],
    [-16, -44],
    [-6, -36],
    [-2, -60],
    [6, -62],
    [8, -38],
    [20, -40],
    [28, -50],
    [26, -30],
    [20, 0],
    [14, 0],
    [12, -22],
    [-14, -22],
    [-18, 0],
  ],
  reichstagRibW: 4,
  bike: { seatBack: 0.18, headBack: 0.1, headDrop: 0.9, stemRise: 0.25 }, // shares of wheelBase / seatH
  kiteTail: { stroke: 3, wiggle: [-14, 10, -6] },
  kiteAspect: 0.7, // half-width / half-height of the kite diamond
} as const;
