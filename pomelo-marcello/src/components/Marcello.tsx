import React, { useId } from "react";
import { ShadedCircle, ShadedRect, shadeOf } from "../shading";
import { COLORS, MARCELLO } from "../tokens";

export type MarcelloPose = "neutral" | "phone" | "smile";

// Marcello, flat and cel-shaded, drawn around his neck base (x, y).
// He always holds his phone at his chest; "phone" turns his eyes to it,
// "smile" adds a smile under the moustache.
export const Marcello: React.FC<{
  x: number;
  y: number;
  pose: MarcelloPose;
  scale?: number;
  phoneShake?: number;
}> = ({ x, y, pose, scale = 1, phoneShake = 0 }) => {
  const m = MARCELLO;
  const clip = useId().replace(/:/g, "");
  const look = pose === "phone" ? m.eyes.lookAt : { dx: 0, dy: 0 };
  const hc = m.head.cy;
  const arm = (hx: number, hy: number, side: number, key: string) => (
    <g key={key}>
      <line
        x1={side * m.arm.shoulderDx}
        y1={m.arm.shoulderDy}
        x2={hx}
        y2={hy}
        stroke={m.shirt}
        strokeWidth={m.arm.w}
        strokeLinecap="round"
      />
      <circle cx={hx} cy={hy} r={m.arm.handR} fill={m.skin} />
    </g>
  );
  const ph = m.phone;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {arm(m.arm.restHand.dx, m.arm.restHand.dy, -1, "rest")}
      <ShadedRect
        x={-m.torso.w / 2}
        y={0}
        w={m.torso.w}
        h={m.torso.h}
        fill={m.shirt}
      />
      <rect
        x={-m.apronBib.w / 2}
        y={m.apronBib.top}
        width={m.apronBib.w}
        height={m.torso.h - m.apronBib.top}
        fill={m.apron}
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
        height={m.neck.h + m.apronBib.strap}
        fill={shadeOf(m.skin)}
      />
      {[-1, 1].map((s) => (
        <circle
          key={s}
          cx={s * m.ear.dx}
          cy={m.ear.dy}
          r={m.ear.r}
          fill={m.skin}
        />
      ))}
      <ShadedCircle cx={0} cy={hc} r={m.head.r} fill={m.skin} />
      <clipPath id={clip}>
        <circle cx={0} cy={hc} r={m.head.r} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
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
            x={s * m.hairCap.sideburn.dx - m.hairCap.sideburn.w / 2}
            y={m.hairCap.bottom}
            width={m.hairCap.sideburn.w}
            height={m.hairCap.sideburn.h}
            fill={m.hair}
          />
        ))}
      </g>
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
            fill={COLORS.ink}
          />
        </g>
      ))}
      <rect
        x={-m.moustache.w / 2}
        y={m.moustache.dy}
        width={m.moustache.w}
        height={m.moustache.h}
        rx={m.moustache.h / 2}
        fill={m.hair}
      />
      {pose === "smile" ? (
        <path
          d={`M ${-m.smile.w / 2} ${m.smile.dy} Q 0 ${m.smile.dy + m.smile.depth} ${m.smile.w / 2} ${m.smile.dy}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={m.smile.stroke}
          strokeLinecap="round"
        />
      ) : null}
      <g transform={`translate(${phoneShake} 0)`}>
        <rect
          x={ph.dx - ph.w / 2}
          y={ph.dy - ph.h / 2}
          width={ph.w}
          height={ph.h}
          rx={ph.radius}
          fill={COLORS.ink}
        />
        <rect
          x={ph.dx - ph.w / 2 + ph.inset}
          y={ph.dy - ph.h / 2 + ph.inset}
          width={ph.w - 2 * ph.inset}
          height={ph.h - 2 * ph.inset}
          rx={ph.radius / 2}
          fill={ph.screen}
        />
      </g>
      {arm(m.arm.phoneHand.dx, m.arm.phoneHand.dy, 1, "phone")}
    </g>
  );
};
