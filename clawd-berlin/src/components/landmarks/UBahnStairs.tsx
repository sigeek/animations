import React from "react";
import { COLORS, STREET, U5, VIDEO } from "../../tokens";

// Cutaway of the stair entrance: dark stairwell in the sidewalk with steps,
// a railing behind it.
export const UBahnStairsBack: React.FC = () => {
  const { stairs, railing } = U5.gate;
  return (
    <g>
      {[stairs.left, stairs.right - railing.postW].map((x) => (
        <rect
          key={x}
          x={x}
          y={railing.top}
          width={railing.postW}
          height={STREET.sidewalkTop - railing.top}
          fill={COLORS.ink}
        />
      ))}
      <rect
        x={stairs.left}
        y={railing.top}
        width={stairs.right - stairs.left}
        height={railing.railH}
        fill={COLORS.ink}
      />
    </g>
  );
};

export const UBahnStairwell: React.FC = () => {
  const { stairs } = U5.gate;
  const w = stairs.right - stairs.left;
  const depth = VIDEO.height - STREET.feetY;
  const stepW = w / stairs.steps;
  const stepH = depth / stairs.steps;
  return (
    <g>
      <rect
        x={stairs.left}
        y={STREET.feetY}
        width={w}
        height={depth}
        fill={COLORS.ink}
      />
      {Array.from({ length: stairs.steps }, (_, i) => (
        <rect
          key={i}
          x={stairs.left + i * stepW}
          y={STREET.feetY + (stairs.steps - i) * stepH}
          width={stepW}
          height={i * stepH}
          fill={COLORS.shadow}
        />
      ))}
    </g>
  );
};
