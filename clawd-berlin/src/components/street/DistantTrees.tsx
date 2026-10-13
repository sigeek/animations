import React from "react";
import { ShadedCircle } from "../../shading";
import { random } from "remotion";
import { DISTANT_TREES, PALETTE, STREET } from "../../tokens";
import { repeatStarts } from "./repeat";

const d = DISTANT_TREES;
const CROWNS = Array.from(
  { length: d.count },
  (_, i) => d.minR + random(`${d.seed}-${i}`) * (d.maxR - d.minR),
);
const PATTERN_W = d.count * d.spacing;

// A soft tree line on the horizon, parallax 0.2.
export const DistantTrees: React.FC<{ offset: number }> = ({ offset }) => (
  <g>
    {repeatStarts(offset, PATTERN_W).map((start) =>
      CROWNS.map((r, i) => (
        <ShadedCircle
          key={`${start}-${i}`}
          cx={start + i * d.spacing}
          cy={STREET.horizonY - r * d.sink}
          r={r}
          fill={PALETTE.treeline}
        />
      )),
    )}
  </g>
);
