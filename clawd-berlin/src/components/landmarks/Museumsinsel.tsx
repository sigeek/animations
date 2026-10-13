import React from "react";
import { ShadedCircle, ShadedRect, shadeOf } from "../../shading";
import { FONT_FAMILY } from "../../fonts";
import {
  COLORS,
  FONT,
  MUSEUM,
  PALETTE,
  SHAPES,
  STREET,
  SHADE,
} from "../../tokens";

const S = PALETTE.sandstone;
const B = STREET.horizonY;

// Evenly spaced x positions for `n` items of width `w` across [from, to].
const spread = (n: number, w: number, from: number, to: number) =>
  Array.from({ length: n }, (_, i) =>
    n === 1 ? (from + to - w) / 2 : from + (i * (to - from - w)) / (n - 1),
  );

// Vertical ribs inside the upper half of a dome.
const DomeRibs: React.FC<{
  cx: number;
  cy: number;
  r: number;
  ribs: number;
  ribW: number;
  fill: string;
}> = ({ cx, cy, r, ribs, ribW, fill }) => (
  <g>
    {Array.from({ length: ribs }, (_, i) => {
      const x = cx - r + ((i + 1) * 2 * r) / (ribs + 1);
      const h = Math.sqrt(r * r - (x - cx) * (x - cx));
      return (
        <rect
          key={i}
          x={x - ribW / 2}
          y={cy - h}
          width={ribW}
          height={h}
          fill={fill}
        />
      );
    })}
  </g>
);

// Berliner Dom: base with arched windows and a columned portico, corner
// towers with small domes, drum with windows, ribbed copper dome, lantern
// and cross.
export const BerlinerDom: React.FC<{ cx: number }> = ({ cx }) => {
  const d = MUSEUM.dom;
  const left = cx - d.base.w / 2;
  const baseTop = B - d.base.h;
  const drumTop = baseTop - d.drum.h;
  const towerTop = B - d.towers.h;
  const lanternTop = drumTop - d.dome.r - d.lantern.h;
  const towerXs = [left, left + d.base.w - d.towers.w];
  const zoneL = [left + d.towers.w, cx - d.portico.w / 2];
  const zoneR = [cx + d.portico.w / 2, left + d.base.w - d.towers.w];
  const half = d.windows.count / 2;
  return (
    <g>
      <ShadedCircle
        cx={cx}
        cy={drumTop}
        r={d.dome.r}
        fill={PALETTE.copper.base}
      />
      <DomeRibs
        cx={cx}
        cy={drumTop}
        r={d.dome.r}
        ribs={d.dome.ribs}
        ribW={d.dome.ribW}
        fill={PALETTE.copper.rib}
      />
      <rect
        x={cx - d.lantern.w / 2}
        y={lanternTop}
        width={d.lantern.w}
        height={d.lantern.h}
        fill={PALETTE.copper.base}
      />
      <rect
        x={cx - d.cross.bar / 2}
        y={lanternTop - d.cross.h}
        width={d.cross.bar}
        height={d.cross.h}
        fill={COLORS.ink}
      />
      <rect
        x={cx - d.cross.w / 2}
        y={lanternTop - d.cross.h + d.cross.barY}
        width={d.cross.w}
        height={d.cross.bar}
        fill={COLORS.ink}
      />
      {towerXs.map((x) => (
        <g key={x}>
          <ShadedCircle
            cx={x + d.towers.w / 2}
            cy={towerTop}
            r={d.towers.domeR}
            fill={PALETTE.copper.base}
          />
          <rect
            x={x + d.towers.w / 2 - d.towers.lantern.w / 2}
            y={towerTop - d.towers.domeR - d.towers.lantern.h}
            width={d.towers.lantern.w}
            height={d.towers.lantern.h}
            fill={PALETTE.copper.base}
          />
          <ShadedRect
            x={x}
            y={towerTop}
            w={d.towers.w}
            h={d.towers.h}
            fill={S.base}
          />
          {d.towers.windowYs.map((wy) => (
            <rect
              key={wy}
              x={x + (d.towers.w - d.towers.windowW) / 2}
              y={towerTop + wy}
              width={d.towers.windowW}
              height={d.towers.windowH}
              fill={S.deep}
            />
          ))}
        </g>
      ))}
      <rect
        x={cx - d.drum.w / 2}
        y={drumTop}
        width={d.drum.w}
        height={d.drum.h}
        fill={S.light}
      />
      {spread(
        d.drum.windows,
        d.drum.windowW,
        cx - d.drum.w / 2 + d.drum.windowW,
        cx + d.drum.w / 2 - d.drum.windowW,
      ).map((x) => (
        <rect
          key={x}
          x={x}
          y={drumTop + (d.drum.h - d.drum.windowH) / 2}
          width={d.drum.windowW}
          height={d.drum.windowH}
          fill={S.deep}
        />
      ))}
      <rect
        x={left + d.towers.w}
        y={baseTop}
        width={d.base.w - 2 * d.towers.w}
        height={d.base.h}
        fill={S.base}
      />
      {[zoneL, zoneR].map(([from, to]) =>
        spread(
          half,
          d.windows.w,
          from + d.windows.w / 2,
          to - d.windows.w / 2,
        ).map((x) => (
          <rect
            key={x}
            x={x}
            y={baseTop + d.windows.top}
            width={d.windows.w}
            height={d.windows.h}
            fill={S.deep}
          />
        )),
      )}
      <polygon
        points={`${cx - d.portico.w / 2},${B - d.portico.h - d.portico.band} ${cx},${B - d.portico.h - d.portico.band - d.portico.pedimentH} ${cx + d.portico.w / 2},${B - d.portico.h - d.portico.band}`}
        fill={S.light}
      />
      <rect
        x={cx - d.portico.w / 2}
        y={B - d.portico.h - d.portico.band}
        width={d.portico.w}
        height={d.portico.band}
        fill={S.light}
      />
      <rect
        x={cx - d.portico.w / 2}
        y={B - d.portico.h}
        width={d.portico.w}
        height={d.portico.h}
        fill={S.deep}
      />
      {spread(
        d.portico.columns,
        d.portico.columnW,
        cx - d.portico.w / 2,
        cx + d.portico.w / 2,
      ).map((x) => (
        <ShadedRect
          key={x}
          x={x}
          y={B - d.portico.h}
          w={d.portico.columnW}
          h={d.portico.h}
          fill={S.light}
          side={SHADE.column}
        />
      ))}
    </g>
  );
};

// Altes Museum: podium with stairs, 18-column colonnade, entablature, attic.
export const AltesMuseum: React.FC<{ cx: number }> = ({ cx }) => {
  const a = MUSEUM.altes;
  const left = cx - a.w / 2;
  const colTop = B - a.podiumH - a.columnH;
  const inset = a.columnW;
  const stepH = a.podiumH / a.stairs.steps;
  return (
    <g>
      <rect
        x={cx - a.attic.w / 2}
        y={colTop - a.entablature - a.attic.h}
        width={a.attic.w}
        height={a.attic.h}
        fill={S.base}
      />
      <rect
        x={left}
        y={colTop - a.entablature}
        width={a.w}
        height={a.entablature}
        fill={S.light}
      />
      <rect
        x={left}
        y={colTop}
        width={a.w}
        height={SHADE.cornice}
        fill={shadeOf(S.deep)}
      />
      <rect
        x={left + inset}
        y={colTop}
        width={a.w - 2 * inset}
        height={a.columnH}
        fill={S.deep}
      />
      {spread(a.columns, a.columnW, left + inset, left + a.w - inset).map(
        (x) => (
          <ShadedRect
            key={x}
            x={x}
            y={colTop}
            w={a.columnW}
            h={a.columnH}
            fill={S.light}
            side={SHADE.column}
          />
        ),
      )}
      <rect
        x={left}
        y={B - a.podiumH}
        width={a.w}
        height={a.podiumH}
        fill={S.base}
      />
      {Array.from({ length: a.stairs.steps }, (_, i) => {
        const w = a.stairs.w - (i * a.stairs.w) / (2 * a.stairs.steps);
        return (
          <rect
            key={i}
            x={cx - w / 2}
            y={B - (i + 1) * stepH}
            width={w}
            height={stepH}
            fill={i % 2 === 0 ? S.light : S.dark}
          />
        );
      })}
    </g>
  );
};

// Neues Museum: plain block, plinth, rows of windows, central risalit with
// pediment.
export const NeuesMuseum: React.FC<{ cx: number }> = ({ cx }) => {
  const n = MUSEUM.neues;
  const left = cx - n.w / 2;
  const top = B - n.h;
  const r = n.risalit;
  const w = n.windows;
  return (
    <g>
      <ShadedRect x={left} y={top} w={n.w} h={n.h} fill={S.base} />
      <rect
        x={cx - r.w / 2}
        y={top - r.rise}
        width={r.w}
        height={n.h + r.rise}
        fill={S.light}
      />
      <polygon
        points={`${cx - r.w / 2},${top - r.rise} ${cx},${top - r.rise - r.pedimentH} ${cx + r.w / 2},${top - r.rise}`}
        fill={S.light}
      />
      {Array.from({ length: w.rows * w.cols }, (_, k) => (
        <rect
          key={k}
          x={left + (((k % w.cols) + 1) * n.w) / (w.cols + 1) - w.w / 2}
          y={top + w.top + Math.floor(k / w.cols) * w.pitchY}
          width={w.w}
          height={w.h}
          fill={S.deep}
        />
      ))}
      <rect
        x={left}
        y={B - n.plinth}
        width={n.w}
        height={n.plinth}
        fill={S.dark}
      />
    </g>
  );
};

// Alte Nationalgalerie: temple front on a high podium, inscription, grand
// staircase with the equestrian statue on top.
export const AlteNationalgalerie: React.FC<{ cx: number }> = ({ cx }) => {
  const g = MUSEUM.natgal;
  const left = cx - g.w / 2;
  const podiumTop = B - g.podium.h;
  const colTop = podiumTop - g.columnH;
  const entTop = colTop - g.entablature;
  const st = g.stairs;
  const stepCount = Math.floor(g.podium.h / st.stepH);
  return (
    <g>
      <polygon
        points={`${left},${entTop} ${cx},${entTop - g.pedimentH} ${left + g.w},${entTop}`}
        fill={S.base}
      />
      <rect
        x={left}
        y={entTop}
        width={g.w}
        height={g.entablature}
        fill={S.light}
      />
      <text
        x={cx}
        y={entTop + g.entablature / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={S.deep}
        fontFamily={FONT_FAMILY}
        fontWeight={FONT.weight}
        fontSize={g.inscription.fontSize}
      >
        {g.inscription.text}
      </text>
      <rect
        x={left + g.columnW}
        y={colTop}
        width={g.w - 2 * g.columnW}
        height={g.columnH}
        fill={S.deep}
      />
      {spread(
        g.columns,
        g.columnW,
        left + g.columnW,
        left + g.w - g.columnW,
      ).map((x) => (
        <ShadedRect
          key={x}
          x={x}
          y={colTop}
          w={g.columnW}
          h={g.columnH}
          fill={S.light}
          side={SHADE.column}
        />
      ))}
      <ShadedRect x={left} y={podiumTop} w={g.w} h={g.podium.h} fill={S.base} />
      {spread(
        g.podium.windows,
        g.podium.windowW,
        left + g.podium.windowW,
        left + g.w - g.podium.windowW,
      ).map((x) => (
        <rect
          key={x}
          x={x}
          y={podiumTop + g.podium.windowTop}
          width={g.podium.windowW}
          height={g.podium.windowH}
          fill={S.deep}
        />
      ))}
      <polygon
        points={`${cx - st.bottomW / 2},${B} ${cx - st.topW / 2},${podiumTop} ${cx + st.topW / 2},${podiumTop} ${cx + st.bottomW / 2},${B}`}
        fill={S.light}
      />
      {Array.from({ length: stepCount }, (_, i) => {
        const y = podiumTop + (i + 1) * st.stepH;
        const w =
          st.topW + ((st.bottomW - st.topW) * (y - podiumTop)) / g.podium.h;
        return (
          <rect
            key={i}
            x={cx - w / 2}
            y={y - st.lineH / 2}
            width={w}
            height={st.lineH}
            fill={S.dark}
          />
        );
      })}
      <polygon
        points={SHAPES.rider
          .map(([x, y]) => `${cx + x},${podiumTop + y}`)
          .join(" ")}
        fill={COLORS.ink}
      />
    </g>
  );
};
