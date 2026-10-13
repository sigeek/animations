import React from "react";
import { FONT_FAMILY } from "../fonts";
import { ALEX, COLORS, FONT } from "../tokens";

// Station sign hanging from the canopy. `unfold` 0 → 1 folds it down from its rods.
export const StationSign: React.FC<{ unfold: number }> = ({ unfold }) => {
  const { x, y, w, h, fontSize, text, rodInsetX, rodWidth } = ALEX.sign;
  const rods = [x + rodInsetX, x + w - rodInsetX];
  const canopyBottom = ALEX.canopy.y + ALEX.canopy.thickness;
  return (
    <g>
      {rods.map((rx) => (
        <rect
          key={rx}
          x={rx - rodWidth / 2}
          y={canopyBottom}
          width={rodWidth}
          height={y - canopyBottom}
          fill={COLORS.ink}
        />
      ))}
      <g transform={`translate(0 ${y}) scale(1 ${unfold}) translate(0 ${-y})`}>
        <rect x={x} y={y} width={w} height={h} fill={COLORS.paper} />
        <text
          x={x + w / 2}
          y={y + h / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={COLORS.ink}
          fontFamily={FONT_FAMILY}
          fontWeight={FONT.weight}
          fontSize={fontSize}
        >
          {text}
        </text>
      </g>
    </g>
  );
};
