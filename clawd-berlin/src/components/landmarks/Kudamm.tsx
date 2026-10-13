import React from "react";
import { BUS100, COLORS, PALETTE, SHADE, SHAPES, STREET } from "../../tokens";
import { shadeOf } from "../../shading";

const k = BUS100.kirche;

// Arched opening: a rect with a half-circle top.
const Arch: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}> = ({ x, y, w, h, fill }) => (
  <g>
    <circle cx={x + w / 2} cy={y + w / 2} r={w / 2} fill={fill} />
    <rect x={x} y={y + w / 2} width={w} height={h - w / 2} fill={fill} />
  </g>
);

// A navy block covered in a grid of blue glass cells (Eiermann's new church).
const GlassBlock: React.FC<{ x: number; y: number; w: number; h: number }> = ({
  x,
  y,
  w,
  h,
}) => {
  const g = k.glass;
  const pitch = g.cell + g.gap;
  const cols = Math.floor((w - g.gap) / pitch);
  const rows = Math.floor((h - g.gap) / pitch);
  const ox = x + (w - cols * pitch + g.gap) / 2;
  const oy = y + (h - rows * pitch + g.gap) / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={PALETTE.newChurch.body} />
      {Array.from({ length: rows * cols }, (_, i) => (
        <rect
          key={i}
          x={ox + (i % cols) * pitch}
          y={oy + Math.floor(i / cols) * pitch}
          width={g.cell}
          height={g.cell}
          fill={PALETTE.newChurch.glass}
        />
      ))}
    </g>
  );
};

// Left edge of the whole church group, for clipping the Ku'damm facades.
export const kircheLeft = (x: number) => x - k.w / 2 - k.hall.w;

// Kaiser-Wilhelm-Gedächtniskirche: the broken old tower with belfry arches,
// clock and door, the glass octagon hall and the new glass tower.
export const Gedaechtniskirche: React.FC<{ x: number }> = ({ x }) => {
  const B = STREET.horizonY;
  const top = B - k.h;
  const l = x - k.w / 2;
  const r = x + k.w / 2;
  const jagged = SHAPES.kircheTop
    .map(([fx, fy]) => `${l + fx * k.w},${top + fy * k.brokenTopDrop}`)
    .join(" ");
  const pair = (y: number, w: number, h: number, gap: number) =>
    [x - gap / 2 - w, x + gap / 2].map((wx) => (
      <Arch key={`${y}-${wx}`} x={wx} y={y} w={w} h={h} fill={COLORS.ink} />
    ));
  return (
    <g>
      <GlassBlock x={l - k.hall.w} y={B - k.hall.h} w={k.hall.w} h={k.hall.h} />
      <GlassBlock
        x={r + k.tower.gap}
        y={B - k.tower.h}
        w={k.tower.w}
        h={k.tower.h}
      />
      <polygon points={`${l},${B} ${jagged} ${r},${B}`} fill={PALETTE.ruin} />
      <rect
        x={r - k.w * SHADE.side}
        y={top + k.brokenTopDrop}
        width={k.w * SHADE.side}
        height={B - top - k.brokenTopDrop}
        fill={shadeOf(PALETTE.ruin)}
      />
      {pair(k.belfry.y, k.belfry.w, k.belfry.h, k.belfry.gap)}
      <circle cx={x} cy={k.clock.y} r={k.clock.r} fill={COLORS.paper} />
      <rect
        x={x - k.clock.hand / 2}
        y={k.clock.y - k.clock.r * k.clock.minute}
        width={k.clock.hand}
        height={k.clock.r * k.clock.minute}
        fill={COLORS.ink}
      />
      <rect
        x={x}
        y={k.clock.y - k.clock.hand / 2}
        width={k.clock.r * k.clock.hour}
        height={k.clock.hand}
        fill={COLORS.ink}
      />
      {pair(k.lower.y, k.lower.w, k.lower.h, k.lower.gap)}
      <Arch
        x={x - k.door.w / 2}
        y={B - k.door.h}
        w={k.door.w}
        h={k.door.h}
        fill={COLORS.ink}
      />
    </g>
  );
};
