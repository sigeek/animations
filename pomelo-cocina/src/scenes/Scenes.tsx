import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { AppPhone } from "../components/AppPhone";
import {
  CafeSign,
  CafeWindow,
  Counter,
  Door,
  Lamps,
  Machine,
  Shelf,
  StripedWall,
  WallClock,
} from "../components/Cafe";
import { Marcello } from "../components/Marcello";
import { CaptionBubble, Customers, Rota } from "../components/Props";
import { cameraAt, lerp, ramp } from "../motion";
import {
  APP_PHONE,
  CAFE,
  CAPTION_DRAFT,
  CENTER,
  DESIGN,
  DISCOVERY,
  EASE,
  ROTA,
  VIDEO,
} from "../tokens";
import { ownerMouth } from "../voiceLevel";

const focusInOut = (f: {
  from: number;
  to: number;
  back: number;
  backFrames: number;
  x: number;
  y: number;
  scale: number;
}) => [
  { from: f.from, to: f.to, x: f.x, y: f.y, scale: f.scale },
  {
    from: f.back,
    to: f.back + f.backFrames,
    x: CENTER.x,
    y: CENTER.y,
    scale: 1,
  },
];
const BEFORE_FOCI = [
  ...focusInOut(ROTA.focus),
  ...focusInOut(CAPTION_DRAFT.focus),
];

// Scene 1: Kiez Café at 6:30 am. Lights on at 30, the machine steams,
// Marcello talks through the rota and the late-night caption; customers wait.
export const BeforeWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const mouth = ownerMouth(frame);
  const lit = ramp(
    frame,
    CAFE.lightsOn.at,
    CAFE.lightsOn.at + CAFE.lightsOn.frames,
    EASE.outCubic,
  );
  const looking = frame >= CAPTION_DRAFT.from;
  return (
    <AbsoluteFill style={{ background: DESIGN.stripeA }}>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <g transform={cameraAt(frame, BEFORE_FOCI, CENTER.x, CENTER.y)}>
          <StripedWall />
          <CafeSign />
          <CafeWindow frame={frame} />
          <Lamps frame={frame} />
          <WallClock frame={frame} />
          <Shelf />
          <Door frame={frame} />
          <Marcello
            x={430}
            y={985}
            scale={1.1}
            looking={looking}
            mouth={mouth}
          />
          <Machine frame={frame} />
          <Counter />
          <Rota frame={frame} />
          <Customers frame={frame} />
          <CaptionBubble frame={frame} />
        </g>
        <rect
          width={VIDEO.width}
          height={VIDEO.height}
          fill={DESIGN.dawn.color}
          opacity={lerp(DESIGN.dawn.opacity, DESIGN.dawn.lit, lit)}
        />
      </svg>
    </AbsoluteFill>
  );
};

// Scene 2: Marcello sits with a coffee and scrolls; the camera dives into his
// phone, which becomes the big phone: home screen → Pomelo → Welcome → Counter.
export const DiscoveryWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const d = DISCOVERY;
  if (frame >= d.closeUpAt) {
    return (
      <AbsoluteFill style={{ background: DESIGN.stripeA }}>
        <svg
          width={VIDEO.width}
          height={VIDEO.height}
          style={{ position: "absolute" }}
        >
          <StripedWall />
        </svg>
        <AppPhone frame={frame} scale={APP_PHONE.closeUpScale} />
      </AbsoluteFill>
    );
  }
  const m = d.marcello;
  const phoneX = m.x + 70 * m.scale;
  const phoneY = m.y + 182 * m.scale;
  const dive = interpolate(frame, [d.closeUpAt - 20, d.closeUpAt], [1, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOutQuart,
  });
  return (
    <AbsoluteFill style={{ background: DESIGN.stripeA }}>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <g
          transform={`translate(${phoneX} ${phoneY}) scale(${dive}) translate(${-phoneX} ${-phoneY})`}
        >
          <StripedWall />
          <CafeWindow frame={VIDEO.durationInFrames} />
          <Lamps frame={VIDEO.durationInFrames} />
          <Marcello x={m.x} y={m.y} scale={m.scale} looking />
          <rect
            x={(VIDEO.width - d.table.w) / 2}
            y={d.table.y}
            width={d.table.w}
            height={d.table.h}
            rx={14}
            fill={DESIGN.cream}
            stroke={DESIGN.line}
            strokeWidth={DESIGN.lineW}
          />
          <rect
            x={(VIDEO.width - d.table.w) / 2 + d.table.clothInset}
            y={d.table.y}
            width={d.table.w - 2 * d.table.clothInset}
            height={VIDEO.height - d.table.y}
            fill={d.table.cloth}
            stroke={DESIGN.line}
            strokeWidth={DESIGN.lineW}
          />
          <ellipse
            cx={d.cup.x}
            cy={d.table.y}
            rx={d.cup.saucerW / 2}
            ry={16}
            fill={DESIGN.cream}
            stroke={DESIGN.line}
            strokeWidth={DESIGN.lineW}
          />
          <rect
            x={d.cup.x - d.cup.w / 2}
            y={d.table.y - d.cup.h}
            width={d.cup.w}
            height={d.cup.h}
            rx={18}
            fill={DESIGN.pink}
            stroke={DESIGN.line}
            strokeWidth={DESIGN.lineW}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// Scene 3: the phone fills the frame; staff scheduling.
export const SchedulingWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const p = APP_PHONE;
  const scale = lerp(
    p.closeUpScale,
    1,
    ramp(frame, p.pushIn.from, p.pushIn.to, EASE.inOutQuart),
  );
  return (
    <AbsoluteFill style={{ background: DESIGN.stripeA }}>
      <svg
        width={VIDEO.width}
        height={VIDEO.height}
        style={{ position: "absolute" }}
      >
        <StripedWall />
      </svg>
      <AppPhone frame={frame} scale={scale} />
    </AbsoluteFill>
  );
};
