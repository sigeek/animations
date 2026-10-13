import React from "react";
import { ShadedCircle, ShadedRect, shadeOf } from "../../shading";
import { random } from "remotion";
import { ALTBAU, COLORS, PALETTE, SHADE, STREET, VIDEO } from "../../tokens";
import { repeatStarts } from "./repeat";

type Style = "kreuzberg" | "kudamm";

const facadesFor = (style: Style) => {
  const s = ALTBAU[style];
  const colors = PALETTE[style];
  return Array.from({ length: s.count }, (_, i) => ({
    w: Math.round(s.minW + random(`${s.seed}-w-${i}`) * (s.maxW - s.minW)),
    h: Math.round(s.minH + random(`${s.seed}-h-${i}`) * (s.maxH - s.minH)),
    fill: colors[Math.floor(random(`${s.seed}-c-${i}`) * colors.length)],
    balconies: style === "kreuzberg" && i % ALTBAU.balcony.every === 0,
  }));
};

const FACADES = {
  kreuzberg: facadesFor("kreuzberg"),
  kudamm: facadesFor("kudamm"),
};
const PATTERN_W = {
  kreuzberg: FACADES.kreuzberg.reduce((sum, f) => sum + f.w, 0),
  kudamm: FACADES.kudamm.reduce((sum, f) => sum + f.w, 0),
};

// One Gründerzeit facade: stucco cornice, framed windows per floor, optional
// balconies on the middle windows, shop and door on the ground floor.
const Facade: React.FC<{
  x: number;
  w: number;
  h: number;
  fill: string;
  balconies: boolean;
}> = ({ x, w, h, fill, balconies }) => {
  const a = ALTBAU;
  const win = a.window;
  const top = STREET.horizonY - h;
  const floors = Math.floor((h - a.groundH - a.cornice) / a.floorH);
  const cols = Math.max(1, Math.floor(w / win.pitch));
  const left = x + (w - cols * win.pitch) / 2 + (win.pitch - win.w) / 2;
  const mid = Math.floor(cols / 2);
  const groundTop = STREET.horizonY - a.groundH;
  return (
    <g>
      <ShadedRect
        x={x}
        y={top}
        w={w + 1}
        h={h}
        fill={fill}
        side={SHADE.facade}
      />
      <rect
        x={x}
        y={top}
        width={w + 1}
        height={a.cornice}
        fill={PALETTE.stucco}
      />
      <rect
        x={x}
        y={top + a.cornice}
        width={w + 1}
        height={SHADE.cornice}
        fill={shadeOf(fill)}
      />
      {Array.from({ length: floors }, (_, fl) => {
        const wy = top + a.cornice + fl * a.floorH + win.top;
        return Array.from({ length: cols }, (_, c) => {
          const wx = left + c * win.pitch;
          const balcony = balconies && fl > 0 && (c === mid || c === mid - 1);
          return (
            <g key={`${fl}-${c}`}>
              <rect
                x={wx - win.frame}
                y={wy - win.frame}
                width={win.w + 2 * win.frame}
                height={win.h + 2 * win.frame}
                fill={PALETTE.stucco}
              />
              <rect
                x={wx}
                y={wy}
                width={win.w}
                height={win.h}
                fill={PALETTE.window}
              />
              {balcony ? (
                <g>
                  <rect
                    x={wx - win.frame * 2}
                    y={wy + win.h + win.frame}
                    width={win.w + win.frame * 4}
                    height={a.balcony.slab}
                    fill={PALETTE.stucco}
                  />
                  {Array.from({ length: a.balcony.bars }, (_, b) => (
                    <rect
                      key={b}
                      x={
                        wx -
                        win.frame * 2 +
                        (b * (win.w + win.frame * 4 - a.balcony.barW)) /
                          (a.balcony.bars - 1)
                      }
                      y={wy + win.h + win.frame - a.balcony.railH}
                      width={a.balcony.barW}
                      height={a.balcony.railH}
                      fill={COLORS.ink}
                    />
                  ))}
                  <rect
                    x={wx - win.frame * 2}
                    y={wy + win.h + win.frame - a.balcony.railH}
                    width={win.w + win.frame * 4}
                    height={a.balcony.barW}
                    fill={COLORS.ink}
                  />
                </g>
              ) : null}
            </g>
          );
        });
      })}
      <rect
        x={x}
        y={groundTop}
        width={w + 1}
        height={a.cornice / 2}
        fill={PALETTE.stucco}
      />
      <rect
        x={x + a.shop.inset}
        y={STREET.horizonY - a.shop.h}
        width={w - 3 * a.shop.inset - a.shop.doorW}
        height={a.shop.h}
        fill={PALETTE.window}
      />
      <rect
        x={x + w - a.shop.inset - a.shop.doorW}
        y={STREET.horizonY - a.shop.h}
        width={a.shop.doorW}
        height={a.shop.h}
        fill={COLORS.ink}
      />
    </g>
  );
};

// A repeating row of facades on the buildings layer, drawn only between
// `left` and `right` (screen x).
export const AltbauRow: React.FC<{
  style: Style;
  offset: number;
  left?: number;
  right?: number;
}> = ({ style, offset, left = 0, right = VIDEO.width }) => (
  <g>
    {repeatStarts(offset, PATTERN_W[style]).map((start) => {
      let x = start;
      return FACADES[style].map((f, i) => {
        const fx = x;
        x += f.w;
        if (fx + f.w < left || fx > right) return null;
        return (
          <Facade
            key={`${start}-${i}`}
            x={fx}
            w={f.w}
            h={f.h}
            fill={f.fill}
            balconies={f.balconies}
          />
        );
      });
    })}
  </g>
);

// Street trees in front of the facades, on the buildings layer.
export const StreetTrees: React.FC<{ offset: number }> = ({ offset }) => {
  const t = ALTBAU.streetTrees;
  const trunkTop = STREET.horizonY - t.trunkH;
  return (
    <g>
      {repeatStarts(offset, t.spacing).map((x) => (
        <g key={x}>
          <rect
            x={x - t.trunkW / 2}
            y={trunkTop}
            width={t.trunkW}
            height={t.trunkH}
            fill={COLORS.ink}
          />
          <ShadedCircle cx={x} cy={trunkTop} r={t.r} fill={PALETTE.tree} />
        </g>
      ))}
    </g>
  );
};
