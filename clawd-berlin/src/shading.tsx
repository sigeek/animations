import React, { useId } from "react";
import { interpolateColors } from "remotion";
import { SHADE } from "./tokens";

const mix = (color: string, toward: string, amount: number) =>
  interpolateColors(amount, [0, 1], [color, toward]);

// The object's own color in shadow / in light.
export const shadeOf = (color: string) => mix(color, SHADE.ink, SHADE.shadeMix);
export const lightOf = (color: string) =>
  mix(color, SHADE.white, SHADE.lightMix);

// A block with its right side in shade.
export const ShadedRect: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  side?: number;
}> = ({ x, y, w, h, fill, side = SHADE.side }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={fill} />
    <rect
      x={x + w * (1 - side)}
      y={y}
      width={w * side}
      height={h}
      fill={shadeOf(fill)}
    />
  </g>
);

// A circle with a shaded crescent on its lower right.
export const ShadedCircle: React.FC<{
  cx: number;
  cy: number;
  r: number;
  fill: string;
}> = ({ cx, cy, r, fill }) => {
  const id = useId().replace(/:/g, "");
  const o = r * SHADE.crescent;
  return (
    <g>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill={shadeOf(fill)} />
      <circle
        cx={cx - o}
        cy={cy - o}
        r={r}
        fill={fill}
        clipPath={`url(#${id})`}
      />
    </g>
  );
};
