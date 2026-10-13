import React, { useId } from "react";
import { ShadedCircle, shadeOf } from "../shading";
import { ACCENTS, ALEX, COLORS, TOWER_DETAIL } from "../tokens";

// Thin tapered shaft, sphere with its window band, red-and-white antenna.
export const Fernsehturm: React.FC = () => {
  const clipId = useId().replace(/:/g, "");
  const {
    x,
    shaftBottomW,
    shaftTopW,
    sphereCy,
    sphereR,
    antennaW,
    antennaTopY,
    antennaBands,
  } = ALEX.tower;
  const baseY = ALEX.platform.topY;
  const antennaBottomY = sphereCy - sphereR;
  const bandH = (antennaBottomY - antennaTopY) / antennaBands;
  return (
    <g>
      <polygon
        points={`${x - shaftBottomW / 2},${baseY} ${x + shaftBottomW / 2},${baseY} ${x + shaftTopW / 2},${sphereCy} ${x - shaftTopW / 2},${sphereCy}`}
        fill={COLORS.shadow}
      />
      <polygon
        points={`${x},${baseY} ${x + shaftBottomW / 2},${baseY} ${x + shaftTopW / 2},${sphereCy} ${x},${sphereCy}`}
        fill={shadeOf(COLORS.shadow)}
      />
      <ShadedCircle cx={x} cy={sphereCy} r={sphereR} fill={COLORS.shadow} />
      <clipPath id={clipId}>
        <circle cx={x} cy={sphereCy} r={sphereR} />
      </clipPath>
      <rect
        x={x - sphereR}
        y={sphereCy + TOWER_DETAIL.bandY}
        width={2 * sphereR}
        height={TOWER_DETAIL.bandH}
        fill={COLORS.ink}
        clipPath={`url(#${clipId})`}
      />
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

// The same tower far away: base on the horizon at screen x `x`, scaled down.
export const DistantFernsehturm: React.FC<{
  x: number;
  baseY: number;
  scale: number;
}> = ({ x, baseY, scale }) => (
  <g
    transform={`translate(${x - ALEX.tower.x * scale} ${baseY - ALEX.platform.topY * scale}) scale(${scale})`}
  >
    <Fernsehturm />
  </g>
);
