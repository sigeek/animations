import React from "react";
import { BODY_FONT, DISPLAY_FONT } from "../fonts";
import { lerp, ramp } from "../motion";
import {
  CAPTION_DRAFT,
  CUSTOMER,
  CUSTOMERS,
  DESIGN,
  EASE,
  ROTA,
} from "../tokens";
import { OutlinedBox } from "./OutlinedBox";

const L = {
  stroke: DESIGN.line,
  strokeWidth: DESIGN.lineW,
  strokeLinejoin: "round" as const,
};

// The paper rota on the counter: a grid of names; at ROTA.strike.at one is
// struck out and another written in.
export const Rota: React.FC<{ frame: number }> = ({ frame }) => {
  const r = ROTA;
  const cols = r.days.length;
  const rows = r.names.length;
  const cellW = r.w / (cols + 1);
  const headH = r.titleSize * 1.6;
  const cellH = (r.h - headH) / (rows + 1);
  const s = r.strike;
  const strike = ramp(frame, s.at, s.at + s.frames, EASE.outCubic);
  const write = ramp(
    frame,
    s.at + s.frames,
    s.at + s.frames + s.writeFrames,
    EASE.linear,
  );
  const cx = r.x + cellW * (s.col + 1);
  const cy = r.y + headH + cellH * (s.row + 1);
  return (
    <g transform={`rotate(${r.rotate} ${r.x + r.w / 2} ${r.y + r.h / 2})`}>
      <rect
        x={r.x}
        y={r.y}
        width={r.w}
        height={r.h}
        rx={8}
        fill={DESIGN.cream}
        {...L}
      />
      <text
        x={r.x + 20}
        y={r.y + headH / 2 + 4}
        dominantBaseline="central"
        fill={DESIGN.line}
        fontFamily={DISPLAY_FONT}
        fontSize={r.titleSize}
      >
        {r.title}
      </text>
      {r.days.map((d, c) => (
        <text
          key={d}
          x={r.x + cellW * (c + 1) + cellW / 2}
          y={r.y + headH + cellH / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={DESIGN.line}
          fontFamily={BODY_FONT}
          fontWeight={700}
          fontSize={r.fontSize}
        >
          {d}
        </text>
      ))}
      {r.names.map((n, row) =>
        r.days.map((_, c) => (
          <text
            key={`${n}${c}`}
            x={r.x + cellW * (c + 1) + cellW / 2}
            y={r.y + headH + cellH * (row + 1) + cellH / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill={DESIGN.line}
            fontFamily={BODY_FONT}
            fontSize={r.fontSize * 0.8}
          >
            {n}
          </text>
        )),
      )}
      {strike > 0 ? (
        <line
          x1={cx + 6}
          y1={cy + cellH / 2}
          x2={cx + 6 + (cellW - 12) * strike}
          y2={cy + cellH / 2}
          stroke={DESIGN.red}
          strokeWidth={6}
          strokeLinecap="round"
        />
      ) : null}
      {write > 0 ? (
        <text
          x={cx + cellW / 2}
          y={cy + cellH * 0.05}
          textAnchor="middle"
          dominantBaseline="central"
          fill={DESIGN.red}
          fontFamily={DISPLAY_FONT}
          fontSize={r.fontSize}
          opacity={write}
        >
          {s.rewrite}
        </text>
      ) : null}
    </g>
  );
};

// Two customers seen from behind, waiting at the counter.
export const Customers: React.FC<{ frame: number }> = ({ frame }) => {
  const c = CUSTOMER;
  return (
    <g>
      {CUSTOMERS.map((k, i) => {
        if (k.enterFrom && frame < k.enterFrom.at) return null;
        const x = k.enterFrom
          ? lerp(
              k.enterFrom.x,
              k.x,
              ramp(
                frame,
                k.enterFrom.at,
                k.enterFrom.at + k.enterFrom.frames,
                EASE.outCubic,
              ),
            )
          : k.x;
        return (
          <g key={i}>
            <OutlinedBox
              x={x - c.bodyW / 2}
              y={k.y}
              w={c.bodyW}
              h={c.bodyH}
              r={c.radius}
              fill={k.coat}
            />
            <circle
              cx={x}
              cy={k.y - c.headR * 0.6}
              r={c.headR}
              fill={k.hair}
              {...L}
            />
          </g>
        );
      })}
    </g>
  );
};

// What Marcello's phone shows during "one caption": a tiny draft, plus an
// enlarged bubble of the draft with a blinking cursor.
export const CaptionBubble: React.FC<{ frame: number }> = ({ frame }) => {
  const d = CAPTION_DRAFT;
  if (frame < d.from || frame > d.to) return null;
  const i = Math.floor((frame - d.from) / d.every) % d.texts.length;
  const cursor = Math.floor(frame / (d.cursorPeriod / 2)) % 2 === 0;
  const b = d.bubble;
  return (
    <g>
      <rect
        x={b.x}
        y={b.y}
        width={b.w}
        height={b.h}
        rx={26}
        fill={DESIGN.cream}
        {...L}
      />
      <text
        x={b.x + 26}
        y={b.y + 42}
        dominantBaseline="central"
        fill={DESIGN.purple}
        fontFamily={DISPLAY_FONT}
        fontSize={b.fontSize * 0.8}
      >
        Instagram · draft
      </text>
      <text
        x={b.x + 26}
        y={b.y + 98}
        dominantBaseline="central"
        fill={DESIGN.line}
        fontFamily={BODY_FONT}
        fontWeight={700}
        fontSize={b.fontSize}
      >
        {d.texts[i]}
        {cursor ? "|" : " "}
      </text>
    </g>
  );
};

// Pip's face, as on the app's counter screen: red head, cream face plate,
// dark visor with teal eyes and smile. Drawn in a size x size box.
export const PipFace: React.FC<{ x: number; y: number; size: number }> = ({
  x,
  y,
  size,
}) => {
  const s = size;
  return (
    <g transform={`translate(${x} ${y})`}>
      <line
        x1={s / 2}
        y1={s * 0.12}
        x2={s / 2}
        y2={s * 0.24}
        stroke={DESIGN.line}
        strokeWidth={s * 0.04}
      />
      <circle
        cx={s / 2}
        cy={s * 0.1}
        r={s * 0.05}
        fill={DESIGN.cream}
        stroke={DESIGN.line}
        strokeWidth={s * 0.03}
      />
      <rect
        x={s * 0.12}
        y={s * 0.42}
        width={s * 0.1}
        height={s * 0.22}
        rx={s * 0.04}
        fill={DESIGN.red}
        stroke={DESIGN.line}
        strokeWidth={s * 0.03}
      />
      <rect
        x={s * 0.78}
        y={s * 0.42}
        width={s * 0.1}
        height={s * 0.22}
        rx={s * 0.04}
        fill={DESIGN.red}
        stroke={DESIGN.line}
        strokeWidth={s * 0.03}
      />
      <rect
        x={s * 0.2}
        y={s * 0.24}
        width={s * 0.6}
        height={s * 0.6}
        rx={s * 0.2}
        fill={DESIGN.cream}
        stroke={DESIGN.line}
        strokeWidth={s * 0.035}
      />
      <rect
        x={s * 0.28}
        y={s * 0.36}
        width={s * 0.44}
        height={s * 0.32}
        rx={s * 0.12}
        fill={DESIGN.line}
      />
      <circle cx={s * 0.41} cy={s * 0.49} r={s * 0.04} fill={DESIGN.teal} />
      <circle cx={s * 0.59} cy={s * 0.49} r={s * 0.04} fill={DESIGN.teal} />
      <path
        d={`M ${s * 0.42} ${s * 0.57} Q ${s / 2} ${s * 0.63} ${s * 0.58} ${s * 0.57}`}
        fill="none"
        stroke={DESIGN.teal}
        strokeWidth={s * 0.03}
        strokeLinecap="round"
      />
    </g>
  );
};
