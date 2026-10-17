import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
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
import { OutlinedBox } from "../components/OutlinedBox";
import { Push } from "../components/Push";
import { CaptionBubble, Customers, PipFace, Rota } from "../components/Props";
import { BODY_FONT, DISPLAY_FONT } from "../fonts";
import { lerp, ramp, springAt } from "../motion";
import {
  APP_PHONE,
  CAFE,
  CAPTION_DRAFT,
  CLOSE,
  DESIGN,
  EASE,
  RESULT,
  ROTA,
  SPRING,
  VIDEO,
} from "../tokens";

const PANEL_X = 60;
const PANEL_W = VIDEO.width - 2 * PANEL_X;
const L = {
  stroke: DESIGN.line,
  strokeWidth: DESIGN.lineW,
  strokeLinejoin: "round" as const,
};

// A screen from the design in a small phone frame (HTML).
const MiniPhone: React.FC<{ src: string; left: number; top: number }> = ({
  src,
  left,
  top,
}) => {
  const m = RESULT.miniPhone;
  const h = (m.w * APP_PHONE.cssH) / APP_PHONE.cssW;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: m.w + 2 * m.bezel,
        height: h + 2 * m.bezel,
        borderRadius: m.radius + m.bezel,
        background: APP_PHONE.body,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: m.bezel,
          top: m.bezel,
          width: m.w,
          height: h,
          borderRadius: m.radius,
        }}
      />
    </div>
  );
};

const Label: React.FC<{
  text: string;
  x: number;
  y: number;
  color: string;
}> = ({ text, x, y, color }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontFamily: DISPLAY_FONT,
      fontSize: RESULT.labelSize,
      color,
    }}
  >
    {text}
  </div>
);

// Before (top): the late-night rota and caption. With Pomelo (bottom): the
// counter with its orders, and the saved post.
const SplitWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const b = RESULT.before;
  const a = RESULT.after;
  const enter = ramp(
    frame,
    RESULT.split.from + RESULT.afterEnter,
    RESULT.split.from + RESULT.afterEnter + 18,
    EASE.outCubic,
  );
  const mp = RESULT.miniPhone;
  const phoneH = (mp.w * APP_PHONE.cssH) / APP_PHONE.cssW + 2 * mp.bezel;
  const phonesW = 2 * (mp.w + 2 * mp.bezel) + mp.gap;
  const phonesLeft = (VIDEO.width - phonesW) / 2;
  return (
    <AbsoluteFill style={{ background: DESIGN.stripeA }}>
      <svg
        width={VIDEO.width}
        height={VIDEO.height}
        style={{ position: "absolute" }}
      >
        <StripedWall />
        <rect
          x={PANEL_X}
          y={b.y}
          width={PANEL_W}
          height={b.h}
          rx={RESULT.panelR}
          fill={RESULT.night}
          {...L}
        />
        <clipPath id="before-panel">
          <rect
            x={PANEL_X}
            y={b.y}
            width={PANEL_W}
            height={b.h}
            rx={RESULT.panelR}
          />
        </clipPath>
        <g
          clipPath="url(#before-panel)"
          transform={`translate(${PANEL_X} ${b.y}) scale(${RESULT.beforeScale}) translate(${-PANEL_X} ${-b.y})`}
        >
          <g
            transform={`translate(${PANEL_X + b.rota.x - ROTA.x} ${b.y + b.rota.y - ROTA.y}) scale(1)`}
          >
            <Rota frame={ROTA.strike.at + 40} />
          </g>
          <g
            transform={`translate(${PANEL_X + b.clock.x - CAFE.clock.x} ${b.y + b.clock.y - CAFE.clock.y})`}
          >
            <WallClock frame={CAFE.clock.runTo} />
          </g>
          <g
            transform={`translate(${PANEL_X + b.bubble.x - CAPTION_DRAFT.bubble.x} ${b.y + b.bubble.y - CAPTION_DRAFT.bubble.y})`}
          >
            <CaptionBubble
              frame={CAPTION_DRAFT.from + 4 * CAPTION_DRAFT.every}
            />
          </g>
        </g>
        <g transform={`translate(${lerp(VIDEO.width, 0, enter)} 0)`}>
          <rect
            x={PANEL_X}
            y={a.y}
            width={PANEL_W}
            height={a.h}
            rx={RESULT.panelR}
            fill={DESIGN.cream}
            {...L}
          />
        </g>
      </svg>
      <Label
        text={b.label}
        x={PANEL_X + 40}
        y={b.y + 36}
        color={DESIGN.cream}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${lerp(VIDEO.width, 0, enter)}px 0px`,
        }}
      >
        <Label
          text={a.label}
          x={PANEL_X + 40}
          y={a.y + 36}
          color={DESIGN.line}
        />
        <MiniPhone
          src="screens/02-counter.png"
          left={phonesLeft}
          top={a.y + a.h - phoneH - 40}
        />
        <MiniPhone
          src="screens/05-taste-test.png"
          left={phonesLeft + mp.w + 2 * mp.bezel + mp.gap}
          top={a.y + a.h - phoneH - 40}
        />
      </div>
      {RESULT.numbers.length > 0 ? (
        <div
          style={{
            position: "absolute",
            left: PANEL_X,
            top: b.y + b.h + 8,
            width: PANEL_W,
            fontFamily: BODY_FONT,
            fontWeight: 700,
            color: DESIGN.line,
          }}
        >
          {RESULT.numbers.map((n) => (
            <div key={n.label}>
              {n.label}: {n.before} → {n.after}
            </div>
          ))}
          {RESULT.numbersSource ? (
            <div style={{ fontWeight: 500 }}>{RESULT.numbersSource}</div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Marcello, relaxed, hands a coffee over the counter to a guest.
const ServingWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const sv = RESULT.serving;
  const reach = ramp(frame, sv.from + 30, sv.from + 50, EASE.outCubic);
  return (
    <AbsoluteFill style={{ background: DESIGN.stripeA }}>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <StripedWall />
        <CafeSign />
        <CafeWindow frame={VIDEO.durationInFrames} />
        <Lamps frame={VIDEO.durationInFrames} />
        <WallClock frame={0} />
        <Shelf />
        <Door frame={0} />
        <Marcello x={430} y={985} scale={1.1} smile hidePhone />
        <Machine frame={0} />
        <Counter />
        <g
          transform={`translate(${lerp(0, 40, reach)} ${lerp(0, -10, reach)})`}
        >
          <ellipse
            cx={sv.cupX}
            cy={sv.cupY + 12}
            rx={80}
            ry={16}
            fill={DESIGN.cream}
            {...L}
          />
          <rect
            x={sv.cupX - 50}
            y={sv.cupY - 70}
            width={100}
            height={84}
            rx={18}
            fill={DESIGN.pink}
            {...L}
          />
        </g>
        <g transform={`translate(${sv.customerX - 260} 0)`}>
          <Customers frame={CAFE.door.swing.at + 200} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const ResultWorld: React.FC<{ frame: number }> = ({ frame }) => (
  <Push
    frame={frame}
    at={RESULT.serving.from}
    outgoing={<SplitWorld frame={frame} />}
  >
    {frame < RESULT.serving.from ? (
      <SplitWorld frame={frame} />
    ) : (
      <ServingWorld frame={frame} />
    )}
  </Push>
);

// Kiez Café from the street, in the style of the app's welcome screen.
const Storefront: React.FC = () => {
  const s = CLOSE.storefront;
  const awningW = s.w / s.stripes;
  return (
    <svg width={VIDEO.width} height={VIDEO.height}>
      <rect width={VIDEO.width} height={VIDEO.height} fill={DESIGN.sky} />
      {CLOSE.clouds.map((c) => (
        <g key={c.x}>
          <ellipse
            cx={c.x - c.w / 6}
            cy={c.y - c.w / 8}
            rx={c.w / 4}
            ry={c.w / 5}
            fill={DESIGN.cream}
            {...L}
          />
          <ellipse
            cx={c.x}
            cy={c.y}
            rx={c.w / 2}
            ry={c.w / 5}
            fill={DESIGN.cream}
            {...L}
          />
          <ellipse
            cx={c.x - c.w / 6}
            cy={c.y - c.w / 8}
            rx={c.w / 4 - DESIGN.lineW}
            ry={c.w / 5 - DESIGN.lineW}
            fill={DESIGN.cream}
          />
        </g>
      ))}
      <rect
        x={0}
        y={s.y + s.h}
        width={VIDEO.width}
        height={VIDEO.height - s.y - s.h}
        fill={DESIGN.panel}
        {...L}
      />
      <OutlinedBox
        x={s.x}
        y={s.y}
        w={s.w}
        h={s.h}
        r={20}
        fill={DESIGN.stripeA}
      />
      {Array.from({ length: s.stripes }, (_, i) => (
        <rect
          key={i}
          x={s.x + i * awningW}
          y={s.y + 140}
          width={awningW}
          height={s.awningH}
          fill={i % 2 ? DESIGN.cream : DESIGN.sage}
          {...L}
        />
      ))}
      <rect
        x={s.x + 170}
        y={s.y + 30}
        width={s.w - 340}
        height={90}
        rx={22}
        fill={DESIGN.cream}
        {...L}
      />
      <text
        x={VIDEO.width / 2}
        y={s.y + 76}
        textAnchor="middle"
        dominantBaseline="central"
        fill={DESIGN.line}
        fontFamily={DISPLAY_FONT}
        fontSize={58}
      >
        Kiez Café
      </text>
      <rect
        x={s.x + 60}
        y={s.y + 360}
        width={s.w - s.doorW - 180}
        height={s.windowH}
        rx={16}
        fill={DESIGN.sky}
        {...L}
      />
      <rect
        x={s.x + s.w - s.doorW - 60}
        y={s.y + 360}
        width={s.doorW}
        height={s.h - 360}
        rx={14}
        fill={DESIGN.wood}
        {...L}
      />
      <rect
        x={s.x + s.w - s.doorW - 30}
        y={s.y + 400}
        width={s.doorW - 60}
        height={180}
        rx={14}
        fill={DESIGN.sky}
        {...L}
      />
      <PipFace x={s.x + s.w - s.doorW - 20} y={s.y + 405} size={s.doorW - 80} />
      <g transform={`rotate(-8 ${s.x + s.w - 120} ${s.y + 640})`}>
        <rect
          x={s.x + s.w - 210}
          y={s.y + 610}
          width={170}
          height={64}
          rx={14}
          fill={DESIGN.cream}
          {...L}
        />
        <text
          x={s.x + s.w - 125}
          y={s.y + 642}
          textAnchor="middle"
          dominantBaseline="central"
          fill={DESIGN.green}
          fontFamily={DISPLAY_FONT}
          fontSize={40}
        >
          OPEN
        </text>
      </g>
    </svg>
  );
};

// End card: Pip, the name, the call to action.
const EndCard: React.FC<{ frame: number }> = ({ frame }) => {
  const e = CLOSE.endCard;
  const pop = springAt(frame, e.from + 6, SPRING.clawdRatio, 16);
  return (
    <AbsoluteFill style={{ background: DESIGN.stripeA }}>
      <svg
        width={VIDEO.width}
        height={VIDEO.height}
        style={{ position: "absolute" }}
      >
        <StripedWall />
        <g
          transform={`translate(${VIDEO.width / 2} 560) scale(${pop}) translate(${-e.pipSize / 2} ${-e.pipSize / 2})`}
        >
          <PipFace x={0} y={0} size={e.pipSize} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 760,
          width: VIDEO.width,
          textAlign: "center",
          fontFamily: DISPLAY_FONT,
          fontSize: 150,
          color: DESIGN.line,
        }}
      >
        {e.title}
      </div>
      <div
        style={{
          position: "absolute",
          top: 960,
          width: VIDEO.width,
          textAlign: "center",
          fontFamily: BODY_FONT,
          fontWeight: 700,
          fontSize: 46,
          color: DESIGN.line,
        }}
      >
        {e.tagline}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1100,
          left: (VIDEO.width - 640) / 2,
          width: 640,
          padding: "26px 0",
          borderRadius: 30,
          background: DESIGN.green,
          border: `${DESIGN.lineW}px solid ${DESIGN.line}`,
          textAlign: "center",
          fontFamily: DISPLAY_FONT,
          fontSize: 52,
          color: DESIGN.cream,
        }}
      >
        {e.cta}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1290,
          width: VIDEO.width,
          textAlign: "center",
          fontFamily: BODY_FONT,
          fontWeight: 700,
          fontSize: 40,
          color: DESIGN.line,
          opacity: interpolate(frame, [e.from + 20, e.from + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {e.url}
      </div>
    </AbsoluteFill>
  );
};

export const CloseWorld: React.FC<{ frame: number }> = ({ frame }) => (
  <Push frame={frame} at={CLOSE.endCard.from} outgoing={<Storefront />}>
    {frame < CLOSE.endCard.from ? <Storefront /> : <EndCard frame={frame} />}
  </Push>
);
