import React from "react";
import { FONT_FAMILY } from "../../fonts";
import {
  ACCENTS,
  BUNDESTAG,
  COLORS,
  FONT,
  PALETTE,
  SHAPES,
  STREET,
  SHADE,
} from "../../tokens";
import { ShadedRect } from "../../shading";

const S = PALETTE.sandstone;

// Sandstone block with rows of windows and a rusticated ground floor, corner
// towers, columned portico with "DEM DEUTSCHEN VOLKE", glass dome.
export const Reichstag: React.FC<{ cx: number }> = ({ cx }) => {
  const r = BUNDESTAG.reichstag;
  const B = STREET.horizonY;
  const top = B - r.h;
  const left = cx - r.w / 2;
  const p = r.portico;
  const pLeft = cx - p.w / 2;
  const colStep = (p.w - p.columnW) / (p.columns - 1);
  const towerXs = [left, left + r.w - r.towers.w];
  const winXs: number[] = [];
  for (
    let x = left + r.towers.w + r.windows.pitch / 2;
    x + r.windows.w < left + r.w - r.towers.w;
    x += r.windows.pitch
  ) {
    if (x + r.windows.w < pLeft || x > pLeft + p.w) winXs.push(x);
  }
  const bandTop = p.top - p.band;
  return (
    <g>
      <path
        d={`M ${cx - r.dome.r} ${top} A ${r.dome.r} ${r.dome.r} 0 0 1 ${cx + r.dome.r} ${top} Z`}
        fill={ACCENTS.glass}
      />
      {Array.from({ length: r.dome.ribs }, (_, i) => {
        const x = cx - r.dome.r + ((i + 1) * 2 * r.dome.r) / (r.dome.ribs + 1);
        const h = Math.sqrt(r.dome.r * r.dome.r - (x - cx) * (x - cx));
        return (
          <rect
            key={i}
            x={x - SHAPES.reichstagRibW / 2}
            y={top - h}
            width={SHAPES.reichstagRibW}
            height={h}
            fill={COLORS.ink}
          />
        );
      })}
      <rect
        x={cx - r.dome.r}
        y={top - r.dome.ringH}
        width={2 * r.dome.r}
        height={r.dome.ringH}
        fill={S.dark}
      />
      <ShadedRect
        x={left}
        y={top}
        w={r.w}
        h={r.h}
        fill={S.base}
        side={SHADE.facade}
      />
      <rect
        x={left}
        y={B - r.rustica}
        width={r.w}
        height={r.rustica}
        fill={S.dark}
      />
      {r.windows.rows.map((y) =>
        winXs.map((x) => (
          <rect
            key={`${y}-${x}`}
            x={x}
            y={y}
            width={r.windows.w}
            height={r.windows.h}
            fill={S.deep}
          />
        )),
      )}
      {winXs.map((x) => (
        <rect
          key={`g${x}`}
          x={x}
          y={r.windows.groundY}
          width={r.windows.w}
          height={r.windows.groundH}
          fill={S.deep}
        />
      ))}
      {towerXs.map((x) => (
        <g key={x}>
          <ShadedRect
            x={x}
            y={B - r.towers.h}
            w={r.towers.w}
            h={r.towers.h}
            fill={S.light}
          />
          <rect
            x={x}
            y={B - r.towers.h}
            width={r.towers.w}
            height={r.towers.cornice}
            fill={S.dark}
          />
          {r.towers.rows.map((y) =>
            r.towers.cols.map((f) => (
              <rect
                key={`${y}-${f}`}
                x={x + r.towers.w * f - r.towers.windowW / 2}
                y={y}
                width={r.towers.windowW}
                height={r.towers.windowH}
                fill={S.deep}
              />
            )),
          )}
        </g>
      ))}
      <polygon
        points={`${pLeft},${bandTop} ${cx},${bandTop - p.pedimentH} ${pLeft + p.w},${bandTop}`}
        fill={S.light}
      />
      <rect x={pLeft} y={bandTop} width={p.w} height={p.band} fill={S.light} />
      <text
        x={cx}
        y={bandTop + p.band / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={S.deep}
        fontFamily={FONT_FAMILY}
        fontWeight={FONT.weight}
        fontSize={r.inscription.fontSize}
      >
        {r.inscription.text}
      </text>
      <rect x={pLeft} y={p.top} width={p.w} height={B - p.top} fill={S.deep} />
      {Array.from({ length: p.columns }, (_, i) => (
        <ShadedRect
          key={i}
          x={pLeft + i * colStep}
          y={p.top}
          w={p.columnW}
          h={B - p.top}
          fill={S.light}
          side={SHADE.column}
        />
      ))}
    </g>
  );
};
