import { random } from "remotion";
import { CENTER, CRUMPLE, TITLE, VIDEO } from "../tokens";
import { lerp } from "../motion";

import type { Pt } from "../motion";

export type { Pt };

// The sheet is a mesh of CRUMPLE.meshPoints x CRUMPLE.meshPoints points. The
// edge points, clockwise from the top-left corner, form the outline polygon;
// the inner points carry the wrinkles.
export type Mesh = { edge: Pt[]; inner: Pt[] };

const M = CRUMPLE.meshPoints;
const LAST = M - 1;
const N = CRUMPLE.vertices; // 4 * LAST edge points
const INNER = (M - 2) * (M - 2);

// Grid cell (row, col) → its point index: edge points first, then inner ones.
const pointIndex = (r: number, c: number): number => {
  if (r === 0) return c;
  if (c === LAST) return LAST + r;
  if (r === LAST) return 2 * LAST + (LAST - c);
  if (c === 0) return 3 * LAST + (LAST - r);
  return N + (r - 1) * (M - 2) + (c - 1);
};

// Grid cell (row, col) → position on a square of half-size `half`.
const gridPoint = (r: number, c: number, half: number): Pt => ({
  x: -half + (2 * half * c) / LAST,
  y: -half + (2 * half * r) / LAST,
});

const innerCells: [number, number][] = Array.from({ length: INNER }, (_, k) => [
  1 + Math.floor(k / (M - 2)),
  1 + (k % (M - 2)),
]);

const edgeCells: [number, number][] = Array.from({ length: N }, (_, i) => {
  for (let r = 0; r < M; r++) {
    for (let c = 0; c < M; c++) {
      if (
        (r === 0 || r === LAST || c === 0 || c === LAST) &&
        pointIndex(r, c) === i
      )
        return [r, c];
    }
  }
  throw new Error(`no edge cell for ${i}`);
});

const seededVector = (key: string): Pt => {
  const angle = random(`${CRUMPLE.seed}-${key}-a`) * Math.PI * 2;
  const m = random(`${CRUMPLE.seed}-${key}-m`);
  return { x: Math.cos(angle) * m, y: Math.sin(angle) * m };
};

const flatMesh = (half: number): Mesh => {
  const jitter = ((2 * half) / LAST) * CRUMPLE.flatInnerJitter;
  return {
    edge: edgeCells.map(([r, c]) => gridPoint(r, c, half)),
    inner: innerCells.map(([r, c], k) => {
      const p = gridPoint(r, c, half);
      const j = seededVector(`flat-${k}`);
      return { x: p.x + j.x * jitter, y: p.y + j.y * jitter };
    }),
  };
};

// The crumpled ball: edge points keep their angle at a seeded radius; inner
// points shrink inside it with seeded noise.
const BALL: Mesh = (() => {
  const radius = CRUMPLE.ballDiameter / 2;
  const unit = {
    edge: edgeCells.map(([r, c]) => gridPoint(r, c, 1)),
    inner: innerCells.map(([r, c]) => gridPoint(r, c, 1)),
  };
  return {
    edge: unit.edge.map((p, i) => {
      const angle = Math.atan2(p.y, p.x);
      const r =
        radius *
        (1 +
          (random(`${CRUMPLE.seed}-r-${i}`) - 0.5) * CRUMPLE.ballRadiusJitter);
      return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
    }),
    inner: unit.inner.map((p, k) => {
      const j = seededVector(`in-${k}`);
      return {
        x:
          p.x * radius * CRUMPLE.ballInteriorScale +
          j.x * CRUMPLE.ballInteriorJitterPx,
        y:
          p.y * radius * CRUMPLE.ballInteriorScale +
          j.y * CRUMPLE.ballInteriorJitterPx,
      };
    }),
  };
})();

const lerpMesh = (a: Mesh, b: Mesh, t: number, noisePx: number): Mesh => {
  const move = (p: Pt, q: Pt, key: string) => {
    const j = seededVector(key);
    return {
      x: lerp(p.x, q.x, t) + j.x * noisePx,
      y: lerp(p.y, q.y, t) + j.y * noisePx,
    };
  };
  return {
    edge: a.edge.map((p, i) => move(p, b.edge[i], `je-${i}`)),
    inner: a.inner.map((p, k) => move(p, b.inner[k], `ji-${k}`)),
  };
};

// t = 0: the flat sheet. t = 1: the ball. Noise peaks halfway for sharp folds.
export const crumpleMesh = (t: number): Mesh =>
  lerpMesh(
    flatMesh(TITLE.paper.size / 2),
    BALL,
    t,
    Math.sin(Math.PI * t) * CRUMPLE.midJitterPx,
  );

// t = 0: the ball. t = 1: a full-bleed sheet.
export const unfoldMesh = (t: number): Mesh =>
  lerpMesh(BALL, flatMesh(VIDEO.width / 2), t, 0);

// Each grid cell splits into two triangles along a seeded diagonal; each
// triangle gets a seeded shade (0..1, scaled by the wrinkle amount).
export const FACETS: { points: [number, number, number]; shade: number }[] =
  (() => {
    const out: { points: [number, number, number]; shade: number }[] = [];
    for (let r = 0; r < LAST; r++) {
      for (let c = 0; c < LAST; c++) {
        const a = pointIndex(r, c);
        const b = pointIndex(r, c + 1);
        const d = pointIndex(r + 1, c + 1);
        const e = pointIndex(r + 1, c);
        const tris: [number, number, number][] =
          random(`${CRUMPLE.seed}-diag-${r}-${c}`) < 0.5
            ? [
                [a, b, d],
                [a, d, e],
              ]
            : [
                [a, b, e],
                [b, d, e],
              ];
        tris.forEach((points, k) =>
          out.push({
            points,
            shade: random(`${CRUMPLE.seed}-shade-${r}-${c}-${k}`),
          }),
        );
      }
    }
    return out;
  })();

export const meshPoint = (mesh: Mesh, index: number): Pt =>
  index < N ? mesh.edge[index] : mesh.inner[index - N];

export const rotateMesh = (mesh: Mesh, rotateDeg: number): Mesh => {
  const a = (rotateDeg * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const toScreen = (p: Pt) => ({
    x: CENTER.x + p.x * cos - p.y * sin,
    y: CENTER.y + p.x * sin + p.y * cos,
  });
  return { edge: mesh.edge.map(toScreen), inner: mesh.inner.map(toScreen) };
};

export const toPath = (pts: Pt[]) =>
  `M ${pts.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" L ")} Z`;

// The flat sheet at half-size 1: the reference the grid lines are drawn on.
const UNIT_FLAT = flatMesh(1);

// Maps a point on the unit flat sheet into `mesh` through the facet that
// contains it (piecewise affine), so lines kink along the wrinkles.
const mapToMesh = (p: Pt, mesh: Mesh): Pt => {
  for (const { points } of FACETS) {
    const [a, b, c] = points.map((i) => meshPoint(UNIT_FLAT, i));
    const det = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
    const wa = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / det;
    const wb = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / det;
    const wc = 1 - wa - wb;
    if (wa >= -1e-9 && wb >= -1e-9 && wc >= -1e-9) {
      const [ma, mb, mc] = points.map((i) => meshPoint(mesh, i));
      return {
        x: wa * ma.x + wb * mb.x + wc * mc.x,
        y: wa * ma.y + wb * mb.y + wc * mc.y,
      };
    }
  }
  throw new Error(`point outside the sheet: ${p.x}, ${p.y}`);
};

// Inner grid lines of the squared paper, as polylines in `mesh` coordinates.
export const gridLines = (
  mesh: Mesh,
  cells: number,
  samples: number,
): Pt[][] => {
  const lines: Pt[][] = [];
  for (let k = 1; k < cells; k++) {
    const fixed = -1 + (2 * k) / cells;
    const along = Array.from(
      { length: samples + 1 },
      (_, s) => -1 + (2 * s) / samples,
    );
    lines.push(along.map((v) => mapToMesh({ x: fixed, y: v }, mesh)));
    lines.push(along.map((v) => mapToMesh({ x: v, y: fixed }, mesh)));
  }
  return lines;
};
