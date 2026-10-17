import React, { useId } from "react";
import { shadeOf } from "../shading";
import { DESIGN, MARCELLO } from "../tokens";
import { OutlinedBox } from "./OutlinedBox";

const L = {
  stroke: DESIGN.line,
  strokeWidth: DESIGN.lineW,
  strokeLinejoin: "round" as const,
};

// Marcello in the Paper design's outlined style, drawn around his neck base.
// He holds his phone at his chest; `looking` turns his eyes to it, `mouth`
// (0..1) opens his mouth with his voice.
export const Marcello: React.FC<{
  x: number;
  y: number;
  scale?: number;
  looking?: boolean;
  mouth?: number;
  phone?: React.ReactNode; // what his phone shows (drawn in phone-local space)
  hidePhone?: boolean;
  smile?: boolean; // a smile instead of the talking mouth
}> = ({
  x,
  y,
  scale = 1,
  looking = false,
  mouth = 0,
  phone,
  hidePhone = false,
  smile = false,
}) => {
  const m = MARCELLO;
  const clip = useId().replace(/:/g, "");
  const look = looking ? m.eyes.lookPhone : { dx: 0, dy: 0 };
  const arm = (hx: number, hy: number, side: number) => (
    <g>
      <line
        x1={side * m.arm.shoulderDx}
        y1={m.arm.shoulderDy}
        x2={hx}
        y2={hy}
        stroke={DESIGN.line}
        strokeWidth={m.arm.w + 2 * DESIGN.lineW}
        strokeLinecap="round"
      />
      <line
        x1={side * m.arm.shoulderDx}
        y1={m.arm.shoulderDy}
        x2={hx}
        y2={hy}
        stroke={m.shirt}
        strokeWidth={m.arm.w}
        strokeLinecap="round"
      />
      <circle cx={hx} cy={hy} r={m.arm.handR} fill={m.skin} {...L} />
    </g>
  );
  const ph = m.phone;
  const mouthH = m.mouth.minH + (m.mouth.maxH - m.mouth.minH) * mouth;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {arm(m.arm.rest.dx, m.arm.rest.dy, -1)}
      <OutlinedBox
        x={-m.torso.w / 2}
        y={0}
        w={m.torso.w}
        h={m.torso.h}
        r={m.torso.radius}
        fill={m.shirt}
      />
      <rect
        x={-m.apronBib.w / 2}
        y={m.apronBib.top}
        width={m.apronBib.w}
        height={m.torso.h - m.apronBib.top}
        fill={m.apron}
        {...L}
      />
      {[-1, 1].map((s) => (
        <line
          key={s}
          x1={(s * m.apronBib.w) / 2}
          y1={m.apronBib.top}
          x2={(s * m.neck.w) / 2}
          y2={0}
          stroke={m.apron}
          strokeWidth={m.apronBib.strap}
        />
      ))}
      <rect
        x={-m.neck.w / 2}
        y={-m.neck.h}
        width={m.neck.w}
        height={m.neck.h + DESIGN.lineW}
        fill={shadeOf(m.skin)}
        {...L}
      />
      {[-1, 1].map((s) => (
        <circle
          key={s}
          cx={s * m.ear.dx}
          cy={m.ear.dy}
          r={m.ear.r}
          fill={m.skin}
          {...L}
        />
      ))}
      <circle cx={0} cy={m.head.cy} r={m.head.r} fill={m.skin} {...L} />
      <clipPath id={clip}>
        <circle cx={0} cy={m.head.cy} r={m.head.r - DESIGN.lineW / 2} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <circle
          cx={m.head.r * 0.35}
          cy={m.head.cy + m.head.r * 0.35}
          r={m.head.r}
          fill={shadeOf(m.skin)}
        />
        <circle
          cx={-m.head.r * 0.06}
          cy={m.head.cy - m.head.r * 0.06}
          r={m.head.r * 0.98}
          fill={m.skin}
        />
        <rect
          x={-m.head.r}
          y={m.hairCap.top}
          width={2 * m.head.r}
          height={m.hairCap.bottom - m.hairCap.top}
          fill={m.hair}
        />
        {[-1, 1].map((s) => (
          <rect
            key={s}
            x={s * m.hairCap.sideburnDx - m.hairCap.sideburnW / 2}
            y={m.hairCap.bottom}
            width={m.hairCap.sideburnW}
            height={m.hairCap.sideburnH}
            fill={m.hair}
          />
        ))}
      </g>
      <circle cx={0} cy={m.head.cy} r={m.head.r} fill="none" {...L} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect
            x={s * m.brows.dx - m.brows.w / 2}
            y={m.brows.dy}
            width={m.brows.w}
            height={m.brows.h}
            rx={m.brows.h / 2}
            fill={m.hair}
          />
          <circle
            cx={s * m.eyes.dx + look.dx}
            cy={m.eyes.dy + look.dy}
            r={m.eyes.r}
            fill={DESIGN.line}
          />
        </g>
      ))}
      {smile ? (
        <path
          d={`M ${-m.smile.w / 2} ${m.smile.dy} Q 0 ${m.smile.dy + m.smile.depth} ${m.smile.w / 2} ${m.smile.dy}`}
          fill="none"
          stroke={DESIGN.line}
          strokeWidth={m.smile.stroke}
          strokeLinecap="round"
        />
      ) : (
        <rect
          x={-m.mouth.w / 2}
          y={m.mouth.dy}
          width={m.mouth.w}
          height={mouthH}
          rx={Math.min(mouthH, m.mouth.w) / 2}
          fill={DESIGN.line}
        />
      )}
      <rect
        x={-m.moustache.w / 2}
        y={m.moustache.dy}
        width={m.moustache.w}
        height={m.moustache.h}
        rx={m.moustache.h / 2}
        fill={m.hair}
      />
      {hidePhone ? null : (
        <g transform={`translate(${ph.dx - ph.w / 2} ${ph.dy - ph.h / 2})`}>
          <rect width={ph.w} height={ph.h} rx={ph.radius} fill={DESIGN.line} />
          <rect
            x={ph.inset}
            y={ph.inset}
            width={ph.w - 2 * ph.inset}
            height={ph.h - 2 * ph.inset}
            rx={ph.radius / 2}
            fill={DESIGN.cream}
          />
          {phone}
        </g>
      )}
      {arm(m.arm.phone.dx, m.arm.phone.dy, 1)}
    </g>
  );
};
