import React, { useId } from "react";
import { shadeOf } from "../shading";
import { DESIGN } from "../tokens";

// A rounded box in the design's style: flat fill, a shade band on the right
// (away from the light) clipped to the box so it can never cross the
// outline, and the outline drawn last, on top.
export const OutlinedBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  fill: string;
  shade?: number; // share of the width in shade, from the right edge
}> = ({ x, y, w, h, r, fill, shade = DESIGN.shadeBand }) => {
  const clip = useId().replace(/:/g, "");
  return (
    <g>
      <clipPath id={clip}>
        <rect x={x} y={y} width={w} height={h} rx={r} />
      </clipPath>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
      <rect
        x={x + w * (1 - shade)}
        y={y}
        width={w * shade}
        height={h}
        fill={shadeOf(fill)}
        clipPath={`url(#${clip})`}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        fill="none"
        stroke={DESIGN.line}
        strokeWidth={DESIGN.lineW}
        strokeLinejoin="round"
      />
    </g>
  );
};
