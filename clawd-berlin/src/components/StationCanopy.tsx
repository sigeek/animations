import React from "react";
import { ALEX, COLORS, VIDEO } from "../tokens";

// Flat platform canopy: one dark slab across the frame on slim columns.
// The columns stand on the far side of the train, so the train covers
// their lower part.
export const StationCanopy: React.FC = () => {
  const { y, thickness, columnXs, columnWidth } = ALEX.canopy;
  return (
    <g>
      {columnXs.map((x) => (
        <rect
          key={x}
          x={x - columnWidth / 2}
          y={y}
          width={columnWidth}
          height={ALEX.platform.topY - y}
          fill={COLORS.ink}
        />
      ))}
      <rect
        x={0}
        y={y}
        width={VIDEO.width}
        height={thickness}
        fill={COLORS.ink}
      />
    </g>
  );
};
