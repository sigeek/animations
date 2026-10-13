import React from "react";
import { ACCENTS, GRID, VIDEO } from "../tokens";
import { gridLines, type Mesh } from "./paperGeometry";

// Squared-paper lines following the sheet's mesh, in screen coordinates.
export const PaperGrid: React.FC<{ screen: Mesh; strokeWidth: number }> = ({
  screen,
  strokeWidth,
}) => (
  <svg
    width={VIDEO.width}
    height={VIDEO.height}
    style={{ position: "absolute", inset: 0 }}
  >
    {gridLines(screen, GRID.cells, GRID.samplesPerLine).map((line, i) => (
      <polyline
        key={i}
        points={line
          .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
          .join(" ")}
        fill="none"
        stroke={ACCENTS.gridBlue}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    ))}
  </svg>
);
