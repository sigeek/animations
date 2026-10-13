import React from "react";
import { ShadedCircle, shadeOf } from "../../shading";
import { ACCENTS, BIKE, COLORS, DAY, SHAPES, VIDEO } from "../../tokens";
import { lampColorAt } from "../../daylight";
import { DistantFernsehturm } from "../Fernsehturm";
import { repeatStarts } from "../street/repeat";

const f = BIKE.field;

// The terminal: long low silhouette with a gently curved roof, the taller
// main hall, a row of arcade lamps that switch on at dusk, red obstruction
// lights.
const Terminal: React.FC<{ frame: number }> = ({ frame }) => {
  const a = f.airport;
  const top = f.top - a.h;
  const lamp = lampColorAt(frame);
  const lampXs: number[] = [];
  for (let x = a.left + a.lamps.pitch / 2; x < a.right; x += a.lamps.pitch)
    lampXs.push(x);
  const h = a.hall;
  return (
    <g>
      <path
        d={`M ${a.left} ${f.top} L ${a.left} ${top} Q ${(a.left + a.right) / 2} ${top - a.roofArc} ${a.right} ${top} L ${a.right} ${f.top} Z`}
        fill={COLORS.shadow}
      />
      <rect
        x={h.x - h.w / 2}
        y={f.top - h.h}
        width={h.w}
        height={h.h}
        fill={COLORS.shadow}
      />
      {Array.from({ length: h.windows }, (_, i) => (
        <rect
          key={i}
          x={h.x - h.w / 2 + ((i + 1) * h.w) / (h.windows + 1) - h.windowW / 2}
          y={f.top - h.h + h.windowH}
          width={h.windowW}
          height={h.windowH}
          fill={lamp}
        />
      ))}
      {lampXs.map((x) => (
        <rect
          key={x}
          x={x - a.lamps.w / 2}
          y={a.lamps.y}
          width={a.lamps.w}
          height={a.lamps.h}
          fill={lamp}
        />
      ))}
      {a.redLights.map((x) => (
        <circle
          key={x}
          cx={x}
          cy={top - a.roofArc / 2}
          r={a.redLightR}
          fill={DAY.redLight}
        />
      ))}
    </g>
  );
};

// The old radar tower: tapered lattice, red-and-white striped top, ball,
// red light.
const RadarTower: React.FC = () => {
  const r = f.radarTower;
  const base = f.top;
  const top = base - r.h;
  const halfAt = (y: number) =>
    (r.bottomW + ((r.topW - r.bottomW) * (base - y)) / r.h) / 2;
  const braces: React.ReactNode[] = [];
  for (
    let y = base;
    y - r.braceStep > top + r.stripes * r.stripeH;
    y -= r.braceStep
  ) {
    const y2 = y - r.braceStep;
    braces.push(
      <g key={y}>
        <line
          x1={r.x - halfAt(y)}
          y1={y}
          x2={r.x + halfAt(y2)}
          y2={y2}
          stroke={COLORS.ink}
          strokeWidth={r.brace}
        />
        <line
          x1={r.x + halfAt(y)}
          y1={y}
          x2={r.x - halfAt(y2)}
          y2={y2}
          stroke={COLORS.ink}
          strokeWidth={r.brace}
        />
      </g>,
    );
  }
  const stripeTop = top;
  return (
    <g>
      {[-1, 1].map((side) => (
        <line
          key={side}
          x1={r.x + side * halfAt(base)}
          y1={base}
          x2={r.x + side * halfAt(top)}
          y2={top}
          stroke={COLORS.ink}
          strokeWidth={r.leg}
        />
      ))}
      {braces}
      {Array.from({ length: r.stripes }, (_, i) => (
        <rect
          key={i}
          x={r.x - halfAt(stripeTop) - r.leg}
          y={stripeTop + i * r.stripeH}
          width={2 * halfAt(stripeTop) + 2 * r.leg}
          height={r.stripeH}
          fill={i % 2 === 0 ? ACCENTS.kite : COLORS.paper}
        />
      ))}
      <ShadedCircle
        cx={r.x}
        cy={top - r.ballR}
        r={r.ballR}
        fill={COLORS.paper}
      />
      <circle
        cx={r.x}
        cy={top - 2 * r.ballR - r.lightR}
        r={r.lightR}
        fill={DAY.redLight}
      />
    </g>
  );
};

// A small radar dish on a mast.
const RadarDish: React.FC = () => {
  const d = f.radarDish;
  const top = f.top - d.h;
  return (
    <g>
      <rect
        x={d.x - d.mastW / 2}
        y={top}
        width={d.mastW}
        height={d.h}
        fill={COLORS.ink}
      />
      <rect
        x={d.x - d.dishW / 2}
        y={top - d.dishH}
        width={d.dishW}
        height={d.dishH}
        fill={COLORS.ink}
      />
    </g>
  );
};

// Tempelhofer Feld at sunset: tree line, the Fernsehturm far off, terminal,
// radar tower and dish, grass with a dashed runway, two kites holding still.
export const TempelhofField: React.FC<{
  frame: number;
  runwayOffset: number;
}> = ({ frame, runwayOffset }) => (
  <g>
    <DistantFernsehturm
      x={f.farTower.x}
      baseY={f.top}
      scale={f.farTower.scale}
    />
    <Terminal frame={frame} />
    <RadarDish />
    <RadarTower />
    <rect
      x={0}
      y={f.top}
      width={VIDEO.width}
      height={VIDEO.height - f.top}
      fill={ACCENTS.grass}
    />
    {repeatStarts(runwayOffset, f.runway.dash + f.runway.gap).map((x) => (
      <rect
        key={x}
        x={x}
        y={f.runway.y}
        width={f.runway.dash}
        height={f.runway.h}
        fill={COLORS.paper}
      />
    ))}
    {f.kites.map((k) => (
      <g key={k.x}>
        <polyline
          points={[0, ...SHAPES.kiteTail.wiggle]
            .map(
              (dx, i) =>
                `${k.x + dx},${k.y + k.size + (i * f.kiteTail) / SHAPES.kiteTail.wiggle.length}`,
            )
            .join(" ")}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={SHAPES.kiteTail.stroke}
        />
        <polygon
          points={`${k.x},${k.y - k.size} ${k.x + k.size * SHAPES.kiteAspect},${k.y} ${k.x},${k.y + k.size} ${k.x - k.size * SHAPES.kiteAspect},${k.y}`}
          fill={k.color === "kite" ? ACCENTS.kite : COLORS.paper}
        />
        <polygon
          points={`${k.x},${k.y - k.size} ${k.x + k.size * SHAPES.kiteAspect},${k.y} ${k.x},${k.y + k.size}`}
          fill={shadeOf(k.color === "kite" ? ACCENTS.kite : COLORS.paper)}
        />
      </g>
    ))}
  </g>
);
