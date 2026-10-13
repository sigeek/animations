import React from "react";
import { COLORS, PALETTE, QUADRIGA, U5, SHADE } from "../../tokens";
import { ShadedRect } from "../../shading";

const S = PALETTE.sandstone;

type Pts = readonly (readonly [number, number])[];

const pts = (list: Pts, cx: number, baseY: number, flip = false, dy = 0) =>
  list.map(([x, y]) => `${cx + (flip ? -x : x)},${baseY + y + dy}`).join(" ");

// Four rearing horses (back pair darker), the chariot with its wheel,
// winged Victoria raising the staff with wreath, iron cross and eagle.
const Quadriga: React.FC<{ cx: number; baseY: number }> = ({ cx, baseY }) => {
  const Q = QUADRIGA;
  const patina = PALETTE.copper.base;
  const c = Q.chariot;
  const v = Q.victoria;
  const horse = (h: (typeof Q.horses)[number]) => {
    const fill = h.back ? Q.backShade : patina;
    const hx = cx + h.x;
    const sx = (x: number) => hx + (h.flip ? -x : x);
    return (
      <g key={h.x}>
        <line
          x1={sx(Q.tail.x1)}
          y1={baseY + Q.tail.y1 + h.lift}
          x2={sx(Q.tail.x2)}
          y2={baseY + Q.tail.y2 + h.lift}
          stroke={fill}
          strokeWidth={Q.tail.w}
        />
        {Q.legs.map((l) => (
          <rect
            key={l.x}
            x={h.flip ? hx - l.x - l.w : hx + l.x}
            y={baseY + l.top + h.lift}
            width={l.w}
            height={l.bottom - l.top}
            fill={fill}
          />
        ))}
        <polygon points={pts(Q.horse, hx, baseY, h.flip, h.lift)} fill={fill} />
      </g>
    );
  };
  return (
    <g>
      <rect
        x={cx - Q.pedestal.w / 2}
        y={baseY - Q.pedestal.h}
        width={Q.pedestal.w}
        height={Q.pedestal.h}
        fill={PALETTE.sandstone.light}
      />
      {Q.horses.filter((h) => h.back).map(horse)}
      <rect
        x={cx + c.x}
        y={baseY + c.y}
        width={c.w}
        height={c.h}
        fill={patina}
      />
      <polygon points={pts(v.wing, cx, baseY)} fill={patina} />
      <polygon points={pts(v.wing, cx, baseY, true)} fill={patina} />
      <polygon points={pts(v.robe, cx, baseY)} fill={patina} />
      <circle cx={cx} cy={baseY + v.headY} r={v.headR} fill={patina} />
      <line
        x1={cx + Q.staff.x1}
        y1={baseY + Q.staff.y1}
        x2={cx + Q.staff.x2}
        y2={baseY + Q.staff.y2}
        stroke={patina}
        strokeWidth={Q.staff.w}
      />
      <circle
        cx={cx + Q.staff.x2}
        cy={baseY + Q.wreath.y}
        r={Q.wreath.r}
        fill="none"
        stroke={patina}
        strokeWidth={Q.wreath.stroke}
      />
      <rect
        x={cx + Q.staff.x2 - Q.cross.short / 2}
        y={baseY + Q.wreath.y - Q.cross.long / 2}
        width={Q.cross.short}
        height={Q.cross.long}
        fill={COLORS.ink}
      />
      <rect
        x={cx + Q.staff.x2 - Q.cross.long / 2}
        y={baseY + Q.wreath.y - Q.cross.short / 2}
        width={Q.cross.long}
        height={Q.cross.short}
        fill={COLORS.ink}
      />
      <polygon points={pts(Q.eagle, cx, baseY)} fill={patina} />
      {Q.horses.filter((h) => !h.back).map(horse)}
      <circle
        cx={cx}
        cy={baseY + c.wheelY}
        r={c.wheelR}
        fill="none"
        stroke={COLORS.ink}
        strokeWidth={c.wheelStroke}
      />
      {Array.from({ length: c.spokes }, (_, i) => {
        const a = (i * Math.PI) / c.spokes;
        return (
          <line
            key={i}
            x1={cx - Math.cos(a) * c.wheelR}
            y1={baseY + c.wheelY - Math.sin(a) * c.wheelR}
            x2={cx + Math.cos(a) * c.wheelR}
            y2={baseY + c.wheelY + Math.sin(a) * c.wheelR}
            stroke={COLORS.ink}
            strokeWidth={c.wheelStroke}
          />
        );
      })}
    </g>
  );
};

// Sandstone gate: step, six columns with capitals and bases, triglyph
// frieze, attic with relief panel, side wings, the Quadriga.
export const BrandenburgerTor: React.FC = () => {
  const t = U5.gate.tor;
  const width = t.right - t.left;
  const outerL = t.left - t.attic.overhang;
  const outerW = width + 2 * t.attic.overhang;
  const colStep = (width - t.columnW) / (t.columns - 1);
  const colBottom = t.baseY - t.stepH;
  const q = t.quadriga;
  const w = t.wings;
  const wingXs = [outerL - w.w, outerL + outerW];
  const triglyphs = Math.floor(outerW / t.frieze.pitch);
  return (
    <g>
      {wingXs.map((x) => (
        <g key={x}>
          <polygon
            points={`${x},${t.baseY - w.h} ${x + w.w / 2},${t.baseY - w.h - w.roofH} ${x + w.w},${t.baseY - w.h}`}
            fill={S.light}
          />
          <rect
            x={x}
            y={t.baseY - w.h}
            width={w.w}
            height={w.h}
            fill={S.deep}
          />
          {[x, x + w.w - w.columnW].map((cx) => (
            <ShadedRect
              key={cx}
              x={cx}
              y={t.baseY - w.h}
              w={w.columnW}
              h={w.h}
              fill={S.base}
              side={SHADE.column}
            />
          ))}
        </g>
      ))}
      <rect
        x={outerL}
        y={colBottom}
        width={outerW}
        height={t.stepH}
        fill={S.dark}
      />
      {Array.from({ length: t.columns }, (_, i) => {
        const x = t.left + i * colStep;
        return (
          <g key={i}>
            <ShadedRect
              x={x}
              y={t.columnTop}
              w={t.columnW}
              h={colBottom - t.columnTop}
              fill={S.base}
              side={SHADE.column}
            />
            <rect
              x={x - (t.capital.w - t.columnW) / 2}
              y={t.columnTop}
              width={t.capital.w}
              height={t.capital.h}
              fill={S.light}
            />
            <rect
              x={x - (t.columnBase.w - t.columnW) / 2}
              y={colBottom - t.columnBase.h}
              width={t.columnBase.w}
              height={t.columnBase.h}
              fill={S.light}
            />
          </g>
        );
      })}
      <rect
        x={outerL}
        y={t.frieze.top}
        width={outerW}
        height={t.columnTop - t.frieze.top}
        fill={S.base}
      />
      {Array.from({ length: triglyphs }, (_, i) => (
        <rect
          key={i}
          x={outerL + t.frieze.pitch / 2 + i * t.frieze.pitch}
          y={
            t.frieze.top + (t.columnTop - t.frieze.top - t.frieze.triglyphH) / 2
          }
          width={t.frieze.triglyphW}
          height={t.frieze.triglyphH}
          fill={S.dark}
        />
      ))}
      <rect
        x={outerL}
        y={t.attic.top}
        width={outerW}
        height={t.frieze.top - t.attic.top}
        fill={S.light}
      />
      <rect
        x={outerL + t.attic.reliefInset}
        y={t.attic.top + (t.frieze.top - t.attic.top - t.attic.reliefH) / 2}
        width={outerW - 2 * t.attic.reliefInset}
        height={t.attic.reliefH}
        fill={S.dark}
      />
      <Quadriga cx={q.centerX} baseY={t.attic.top} />
    </g>
  );
};
