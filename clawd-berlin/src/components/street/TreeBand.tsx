import React from "react";
import { ShadedCircle } from "../../shading";
import { random } from "remotion";
import { COLORS, PALETTE, STREET, TREE_BAND, VIDEO } from "../../tokens";
import { repeatStarts } from "./repeat";

const t = TREE_BAND;
const PATTERN_W = t.count * t.spacing;
const RADII = Array.from(
  { length: t.count },
  (_, i) => t.r * (1 + (random(`${t.seed}-r-${i}`) - 0.5) * 2 * t.rJitter),
);

// Big round park trees on the buildings layer, only between `left` and
// `right` (screen x of the trunks).
export const TreeBand: React.FC<{
  offset: number;
  left?: number;
  right?: number;
}> = ({ offset, left = -t.r, right = VIDEO.width + t.r }) => {
  const trunkTop = STREET.horizonY - t.trunkH;
  return (
    <g>
      {repeatStarts(offset, PATTERN_W).map((start) =>
        RADII.map((r, i) => {
          const x = start + i * t.spacing;
          if (x < left || x > right) return null;
          return (
            <g key={`${start}-${i}`}>
              <rect
                x={x - t.trunkW / 2}
                y={trunkTop}
                width={t.trunkW}
                height={t.trunkH}
                fill={COLORS.ink}
              />
              <ShadedCircle cx={x} cy={trunkTop} r={r} fill={PALETTE.tree} />
            </g>
          );
        }),
      )}
    </g>
  );
};
