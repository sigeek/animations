import React from "react";
import { COLORS, STREET, VIDEO } from "../../tokens";
import { repeatStarts } from "./repeat";

// Road band behind the sidewalk.
export const Road: React.FC = () => (
  <rect
    x={0}
    y={STREET.road.top}
    width={VIDEO.width}
    height={STREET.road.bottom - STREET.road.top}
    fill={COLORS.shadow}
  />
);

// Curb and sidewalk.
export const Sidewalk: React.FC = () => (
  <g>
    <rect
      x={0}
      y={STREET.curb.top}
      width={VIDEO.width}
      height={STREET.curb.bottom - STREET.curb.top}
      fill={COLORS.ink}
    />
    <rect
      x={0}
      y={STREET.sidewalkTop}
      width={VIDEO.width}
      height={VIDEO.height - STREET.sidewalkTop}
      fill={COLORS.stone}
    />
  </g>
);

// Lamp posts along the curb, parallax 1.0. `offset` is the layer's screen shift.
export const Lamps: React.FC<{ offset: number }> = ({ offset }) => {
  const l = STREET.lamps;
  return (
    <g>
      {repeatStarts(offset, l.spacing).map((x) => (
        <g key={x}>
          <rect
            x={x - l.width / 2}
            y={l.top}
            width={l.width}
            height={STREET.sidewalkTop - l.top}
            fill={COLORS.ink}
          />
          <rect
            x={x - l.headW / 2}
            y={l.top - l.headH}
            width={l.headW}
            height={l.headH}
            fill={COLORS.ink}
          />
        </g>
      ))}
    </g>
  );
};
