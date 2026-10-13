import React from "react";
import { ACCENTS, BUS100, PALETTE, SHAPES, STREET, SHADE } from "../../tokens";
import { ShadedRect } from "../../shading";

const S = PALETTE.sandstone;

// Granite base, columned hall, column with three gilded rings, capital,
// golden Victoria.
export const Siegessaeule: React.FC<{ x: number }> = ({ x }) => {
  const s = BUS100.siegessaeule;
  const baseTop = STREET.horizonY - s.base.h;
  const hallTop = baseTop - s.hall.h;
  const colStep = (s.hall.w - s.hall.columnW) / (s.hall.columns - 1);
  const capTop = s.top - s.capital.h;
  return (
    <g>
      <rect
        x={x - s.base.w / 2}
        y={baseTop}
        width={s.base.w}
        height={s.base.h}
        fill={S.dark}
      />
      <rect
        x={x - s.hall.w / 2}
        y={hallTop}
        width={s.hall.w}
        height={s.hall.h}
        fill={S.deep}
      />
      {Array.from({ length: s.hall.columns }, (_, i) => (
        <ShadedRect
          key={i}
          x={x - s.hall.w / 2 + i * colStep}
          y={hallTop}
          w={s.hall.columnW}
          h={s.hall.h}
          fill={S.light}
          side={SHADE.column}
        />
      ))}
      <rect
        x={x - s.shaftW / 2}
        y={s.top}
        width={s.shaftW}
        height={hallTop - s.top}
        fill={S.base}
      />
      {s.rings.ys.map((y) => (
        <rect
          key={y}
          x={x - s.shaftW / 2}
          y={y}
          width={s.shaftW}
          height={s.rings.h}
          fill={ACCENTS.yellow}
        />
      ))}
      <rect
        x={x - s.capital.w / 2}
        y={capTop}
        width={s.capital.w}
        height={s.capital.h}
        fill={S.light}
      />
      <polygon
        points={SHAPES.victoria
          .map(([dx, dy]) => `${x + dx},${capTop + dy}`)
          .join(" ")}
        fill={ACCENTS.yellow}
      />
    </g>
  );
};
