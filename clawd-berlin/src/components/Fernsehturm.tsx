import React from "react";
import { ACCENTS, ALEX, COLORS } from "../tokens";

// Thin tapered shaft, sphere, red-and-white antenna.
export const Fernsehturm: React.FC = () => {
  const { x, shaftBottomW, shaftTopW, sphereCy, sphereR, antennaW, antennaTopY, antennaBands } = ALEX.tower;
  const baseY = ALEX.platform.topY;
  const antennaBottomY = sphereCy - sphereR;
  const bandH = (antennaBottomY - antennaTopY) / antennaBands;
  return (
    <g>
      <polygon
        points={`${x - shaftBottomW / 2},${baseY} ${x + shaftBottomW / 2},${baseY} ${x + shaftTopW / 2},${sphereCy} ${x - shaftTopW / 2},${sphereCy}`}
        fill={COLORS.shadow}
      />
      <circle cx={x} cy={sphereCy} r={sphereR} fill={COLORS.shadow} />
      {Array.from({ length: antennaBands }, (_, i) => (
        <rect
          key={i}
          x={x - antennaW / 2}
          y={antennaTopY + i * bandH}
          width={antennaW}
          height={bandH}
          fill={i % 2 === 0 ? ACCENTS.s3Red : COLORS.paper}
        />
      ))}
    </g>
  );
};
