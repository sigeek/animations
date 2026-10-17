import React from "react";
import { interpolate, interpolateColors } from "remotion";
import { DISPLAY_FONT } from "../fonts";
import { ramp } from "../motion";
import { shadeOf } from "../shading";
import { CAFE, DESIGN, EASE, VIDEO } from "../tokens";
import { OutlinedBox } from "./OutlinedBox";

const L = {
  stroke: DESIGN.line,
  strokeWidth: DESIGN.lineW,
  strokeLinejoin: "round" as const,
};
const lit = (frame: number) =>
  ramp(
    frame,
    CAFE.lightsOn.at,
    CAFE.lightsOn.at + CAFE.lightsOn.frames,
    EASE.outCubic,
  );

// Vertical stripes like the app's backgrounds.
export const StripedWall: React.FC<{ from?: number; to?: number }> = ({
  from = 0,
  to = VIDEO.height,
}) => (
  <g>
    <rect
      x={0}
      y={from}
      width={VIDEO.width}
      height={to - from}
      fill={DESIGN.stripeA}
    />
    {Array.from(
      { length: Math.ceil(VIDEO.width / (2 * DESIGN.stripeW)) },
      (_, i) => (
        <rect
          key={i}
          x={(2 * i + 1) * DESIGN.stripeW}
          y={from}
          width={DESIGN.stripeW}
          height={to - from}
          fill={DESIGN.stripeB}
        />
      ),
    )}
  </g>
);

export const CafeWindow: React.FC<{ frame: number }> = ({ frame }) => {
  const w = CAFE.window;
  const sky = interpolateColors(lit(frame), [0, 1], [w.dawnSky, w.daySky]);
  return (
    <g>
      <rect
        x={w.x}
        y={w.y}
        width={w.w}
        height={w.h}
        rx={18}
        fill={DESIGN.wood}
        {...L}
      />
      <rect
        x={w.x + w.frame}
        y={w.y + w.frame}
        width={w.w - 2 * w.frame}
        height={w.h - 2 * w.frame}
        fill={sky}
        {...L}
      />
      <rect
        x={w.x + w.w / 2 - w.mullion / 2}
        y={w.y + w.frame}
        width={w.mullion}
        height={w.h - 2 * w.frame}
        fill={DESIGN.wood}
        {...L}
      />
      <rect
        x={w.x + w.frame}
        y={w.y + w.h / 2 - w.mullion / 2}
        width={w.w - 2 * w.frame}
        height={w.mullion}
        fill={DESIGN.wood}
        {...L}
      />
    </g>
  );
};

export const Lamps: React.FC<{ frame: number }> = ({ frame }) => {
  const p = CAFE.lamp;
  const bulb = interpolateColors(lit(frame), [0, 1], [p.off, p.on]);
  return (
    <g>
      {CAFE.lamps.map((l) => (
        <g key={l.x}>
          <line
            x1={l.x}
            y1={0}
            x2={l.x}
            y2={l.cord}
            stroke={DESIGN.line}
            strokeWidth={DESIGN.lineW}
          />
          <circle
            cx={l.x}
            cy={l.cord + p.shadeH}
            r={p.bulbR}
            fill={bulb}
            {...L}
          />
          <path
            d={`M ${l.x - p.shadeW / 2} ${l.cord + p.shadeH} A ${p.shadeW / 2} ${p.shadeH} 0 0 1 ${l.x + p.shadeW / 2} ${l.cord + p.shadeH} Z`}
            fill={DESIGN.red}
            {...L}
          />
        </g>
      ))}
    </g>
  );
};

// Wall clock; from runFrom to runTo the hands run through the evening.
export const WallClock: React.FC<{ frame: number }> = ({ frame }) => {
  const c = CAFE.clock;
  const hours = interpolate(frame, [c.runFrom, c.runTo], [c.from, c.to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hourA = ((hours % 12) / 12) * 2 * Math.PI;
  const minA = (hours % 1) * 2 * Math.PI;
  const hand = (a: number, len: number, w: number) => (
    <line
      x1={c.x}
      y1={c.y}
      x2={c.x + Math.sin(a) * len}
      y2={c.y - Math.cos(a) * len}
      stroke={DESIGN.line}
      strokeWidth={w}
      strokeLinecap="round"
    />
  );
  return (
    <g>
      <circle cx={c.x} cy={c.y} r={c.r} fill={DESIGN.cream} {...L} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * 2 * Math.PI;
        return (
          <circle
            key={i}
            cx={c.x + Math.sin(a) * c.r * 0.8}
            cy={c.y - Math.cos(a) * c.r * 0.8}
            r={4}
            fill={DESIGN.line}
          />
        );
      })}
      {hand(hourA, c.r * 0.5, 9)}
      {hand(minA, c.r * 0.72, 6)}
    </g>
  );
};

export const Shelf: React.FC = () => {
  const s = CAFE.shelf;
  return (
    <g>
      {s.cups.map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={s.y - s.cupH}
            width={s.cupW}
            height={s.cupH}
            rx={10}
            fill={i % 2 ? DESIGN.cream : DESIGN.pink}
            {...L}
          />
        </g>
      ))}
      <rect
        x={s.x}
        y={s.y}
        width={s.w}
        height={s.h}
        rx={6}
        fill={DESIGN.wood}
        {...L}
      />
    </g>
  );
};

// The sage espresso machine, as on the app's counter screen, with steam
// puffs rising from the wand while it warms up.
export const Machine: React.FC<{ frame: number }> = ({ frame }) => {
  const m = CAFE.machine;
  const top = CAFE.counter.top - m.h;
  const st = CAFE.steam;
  return (
    <g>
      <OutlinedBox
        x={m.x}
        y={top}
        w={m.w}
        h={m.h}
        r={m.radius}
        fill={DESIGN.sage}
      />
      {Array.from({ length: m.gauges }, (_, i) => {
        const gx = m.x + ((i + 1) * m.w) / (m.gauges + 1);
        return (
          <g key={i}>
            <circle
              cx={gx}
              cy={top + m.gaugeR + 24}
              r={m.gaugeR}
              fill={DESIGN.cream}
              {...L}
            />
            <line
              x1={gx}
              y1={top + m.gaugeR + 24}
              x2={gx + m.gaugeR * 0.6}
              y2={top + m.gaugeR + 10}
              stroke={DESIGN.line}
              strokeWidth={DESIGN.lineW}
              strokeLinecap="round"
            />
          </g>
        );
      })}
      {[0.3, 0.62].map((f) => (
        <rect
          key={f}
          x={m.x + m.w * f - m.groupW / 2}
          y={top + m.h * 0.55}
          width={m.groupW}
          height={m.groupH}
          rx={8}
          fill={DESIGN.line}
        />
      ))}
      <line
        x1={m.wandX - 30}
        y1={top + 60}
        x2={m.wandX}
        y2={m.wandTop + 40}
        stroke={DESIGN.line}
        strokeWidth={10}
        strokeLinecap="round"
      />
      {frame >= st.from && frame <= st.to + st.period
        ? Array.from({ length: st.puffs }, (_, i) => {
            const t =
              (frame - st.from - (i * st.period) / st.puffs) / st.period;
            if (t < 0 || frame - (i * st.period) / st.puffs > st.to)
              return null;
            const p = t % 1;
            return (
              <circle
                key={i}
                cx={st.x + Math.sin(p * Math.PI * 2 + i) * 14}
                cy={st.y - p * st.rise}
                r={st.r * (0.6 + p)}
                fill={DESIGN.cream}
                fillOpacity={1 - p}
              />
            );
          })
        : null}
    </g>
  );
};

export const Counter: React.FC = () => {
  const c = CAFE.counter;
  const panelW = (VIDEO.width - (c.panels + 1) * c.inset) / c.panels;
  return (
    <g>
      <rect
        x={-DESIGN.lineW}
        y={c.top}
        width={VIDEO.width + 2 * DESIGN.lineW}
        height={VIDEO.height - c.top}
        fill={DESIGN.wood}
        {...L}
      />
      {Array.from({ length: c.panels }, (_, i) => (
        <rect
          key={i}
          x={c.inset + i * (panelW + c.inset)}
          y={c.top + c.topH + c.inset}
          width={panelW}
          height={VIDEO.height}
          rx={14}
          fill={shadeOf(DESIGN.wood)}
          {...L}
        />
      ))}
      <rect
        x={-DESIGN.lineW}
        y={c.top}
        width={VIDEO.width + 2 * DESIGN.lineW}
        height={c.topH}
        fill={DESIGN.cream}
        {...L}
      />
    </g>
  );
};

// The door with its chime bell; it swings open when the second customer
// comes in.
export const Door: React.FC<{ frame: number }> = ({ frame }) => {
  const d = CAFE.door;
  const open =
    ramp(frame, d.swing.at, d.swing.at + d.swing.frames, EASE.outCubic) -
    ramp(
      frame,
      d.swing.at + d.swing.frames,
      d.swing.at + 2 * d.swing.frames,
      EASE.inCubic,
    );
  const ring =
    frame >= d.swing.at && frame < d.swing.at + d.swing.frames
      ? Math.sin((frame - d.swing.at) * 1.6) * 10
      : 0;
  return (
    <g>
      <rect x={d.x} y={d.y} width={d.w} height={d.h} fill={DESIGN.line} />
      <rect
        x={d.x}
        y={d.y}
        width={d.w * (1 - 0.7 * open)}
        height={d.h}
        fill={DESIGN.red}
        {...L}
      />
      <rect
        x={d.x + 28}
        y={d.y + 40}
        width={Math.max(0, d.w * (1 - 0.7 * open) - 56)}
        height={d.h * 0.4}
        rx={10}
        fill={DESIGN.sky}
        {...L}
      />
      <g transform={`rotate(${ring} ${d.bell.x} ${d.bell.y - 30})`}>
        <line
          x1={d.bell.x}
          y1={d.bell.y - 30}
          x2={d.bell.x}
          y2={d.bell.y - d.bell.r}
          stroke={DESIGN.line}
          strokeWidth={4}
        />
        <circle
          cx={d.bell.x}
          cy={d.bell.y}
          r={d.bell.r}
          fill={"#E7B84C"}
          {...L}
        />
      </g>
    </g>
  );
};

export const Plant: React.FC = () => {
  const p = CAFE.plant;
  return (
    <g>
      {Array.from({ length: p.leaves }, (_, i) => {
        const a = -Math.PI / 2 + (i - (p.leaves - 1) / 2) * 0.45;
        const lx = p.x + Math.cos(a) * 110;
        const ly = p.y - p.potH - 20 + Math.sin(a) * 110;
        return (
          <ellipse
            key={i}
            cx={lx}
            cy={ly}
            rx={26}
            ry={58}
            transform={`rotate(${(a * 180) / Math.PI + 90} ${lx} ${ly})`}
            fill={DESIGN.green}
            {...L}
          />
        );
      })}
      <rect
        x={p.x - p.potW / 2}
        y={p.y - p.potH}
        width={p.potW}
        height={p.potH}
        rx={12}
        fill={DESIGN.pink}
        {...L}
      />
    </g>
  );
};

// "Kiez Café" sign above the window.
export const CafeSign: React.FC = () => (
  <g>
    <rect
      x={CAFE.window.x}
      y={CAFE.window.y - 110}
      width={CAFE.window.w}
      height={80}
      rx={18}
      fill={DESIGN.cream}
      {...L}
    />
    <text
      x={CAFE.window.x + CAFE.window.w / 2}
      y={CAFE.window.y - 70}
      textAnchor="middle"
      dominantBaseline="central"
      fill={DESIGN.line}
      fontFamily={DISPLAY_FONT}
      fontSize={48}
    >
      Kiez Café
    </text>
  </g>
);
