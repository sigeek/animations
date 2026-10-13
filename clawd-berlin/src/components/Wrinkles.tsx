import React from "react";
import { COLORS, VIDEO, WRINKLE } from "../tokens";
import { FACETS, meshPoint, type Mesh } from "./paperGeometry";

// Flat ink-tinted triangles over the sheet, in screen coordinates.
// `amount` 0 = smooth paper, 1 = fully crumpled.
export const Wrinkles: React.FC<{ screen: Mesh; amount: number }> = ({
  screen,
  amount,
}) => {
  if (amount <= 0) return null;
  return (
    <svg
      width={VIDEO.width}
      height={VIDEO.height}
      style={{ position: "absolute", inset: 0 }}
    >
      {FACETS.map((facet, i) => (
        <polygon
          key={i}
          points={facet.points
            .map((index) => {
              const p = meshPoint(screen, index);
              return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
            })
            .join(" ")}
          fill={COLORS.ink}
          fillOpacity={facet.shade * WRINKLE.maxShade * amount}
        />
      ))}
    </svg>
  );
};
