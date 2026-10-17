import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import taps from "../../public/screens/taps.json";
import { BODY_FONT } from "../fonts";
import { lerp, ramp } from "../motion";
import {
  APP_PHONE,
  APP_SCREENS,
  APP_TAPS,
  DESIGN,
  DISCOVERY,
  EASE,
  PUSH,
  SCREEN_ZOOMS,
  TAP,
} from "../tokens";
import { PipFace } from "./Props";

const P = APP_PHONE;
const k = P.screenW / P.cssW; // css px → canvas px
const screenH = P.cssH * k;
const bodyW = P.screenW + 2 * P.bezel;
const bodyH = screenH + 2 * P.bezel;
const H = DISCOVERY.home;

type Box = { x: number; y: number; w: number; h: number };
const boxOf = (screen: string, target: string): Box =>
  (taps.taps as Record<string, Record<string, Box>>)[screen][target];

// Where the Pomelo icon sits on the home screen (canvas px in the screen).
const iconPos = (scroll: number) => {
  const pitchX = H.icon + H.gapX;
  const left = (P.screenW - (H.cols * H.icon + (H.cols - 1) * H.gapX)) / 2;
  return {
    x: left + H.pomeloCol * pitchX,
    y: H.top + H.pomeloRow * (H.icon + H.gapY) - scroll,
  };
};

// The phone's home screen: a grid of app icons scrolling to Pomelo.
const HomeScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const scroll =
    H.scroll.px * ramp(frame, H.scroll.from, H.scroll.to, EASE.outCubic);
  const pitchX = H.icon + H.gapX;
  const left = (P.screenW - (H.cols * H.icon + (H.cols - 1) * H.gapX)) / 2;
  const bump = interpolate(
    frame,
    [
      H.highlight.at,
      H.highlight.at + H.highlight.frames / 2,
      H.highlight.at + H.highlight.frames,
    ],
    [1, H.highlight.scale, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return (
    <svg
      width={P.screenW}
      height={screenH}
      style={{ position: "absolute", inset: 0 }}
    >
      <rect width={P.screenW} height={screenH} fill={H.bg} />
      {Array.from({ length: H.rows * H.cols }, (_, i) => {
        const row = Math.floor(i / H.cols);
        const col = i % H.cols;
        const x = left + col * pitchX;
        const y = H.top + row * (H.icon + H.gapY) - scroll;
        const pomelo = row === H.pomeloRow && col === H.pomeloCol;
        const s = pomelo ? bump : 1;
        return (
          <g
            key={i}
            transform={`translate(${x + H.icon / 2} ${y + H.icon / 2}) scale(${s}) translate(${-H.icon / 2} ${-H.icon / 2})`}
          >
            <rect
              width={H.icon}
              height={H.icon}
              rx={H.icon * 0.24}
              fill={pomelo ? H.pomeloBg : H.colors[i % H.colors.length]}
              stroke={DESIGN.line}
              strokeWidth={DESIGN.lineW}
            />
            {pomelo ? (
              <PipFace
                x={H.icon * 0.08}
                y={H.icon * 0.06}
                size={H.icon * 0.84}
              />
            ) : (
              <circle
                cx={H.icon / 2}
                cy={H.icon / 2}
                r={H.icon * 0.18}
                fill={DESIGN.cream}
                opacity={0.8}
              />
            )}
            <text
              x={H.icon / 2}
              y={H.icon + H.label}
              textAnchor="middle"
              fill={DESIGN.line}
              fontFamily={BODY_FONT}
              fontWeight={700}
              fontSize={H.label}
            >
              {pomelo ? "Pomelo" : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// The camera inside the screen (zooms on the rota's problems).
const zoomAt = (frame: number) => {
  let state = { scale: 1, x: P.cssW / 2, y: P.cssH / 2 };
  for (const z of SCREEN_ZOOMS) {
    const p = ramp(frame, z.from, z.to, EASE.inOutQuart);
    if (p <= 0) break;
    state = {
      scale: lerp(state.scale, z.scale, p),
      x: lerp(state.x, z.x, p),
      y: lerp(state.y, z.y, p),
    };
  }
  return state;
};

const ScreenStack: React.FC<{ frame: number }> = ({ frame }) => {
  const current = APP_SCREENS.reduce(
    (idx, s, i) => (frame >= s.at ? i : idx),
    -1,
  );
  const img = (i: number, style: React.CSSProperties) => (
    <Img
      key={APP_SCREENS[i].src}
      src={staticFile(APP_SCREENS[i].src)}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: P.screenW,
        height: screenH,
        ...style,
      }}
    />
  );
  if (current < 0) return <HomeScreen frame={frame} />;
  const s = APP_SCREENS[current];
  const p = ramp(frame, s.at, s.at + PUSH.frames, EASE.inOutQuart);
  if (current === 0) {
    // The app opens out of its icon.
    const scroll = H.scroll.px;
    const icon = iconPos(scroll);
    const sc = lerp(H.icon / P.screenW, 1, p);
    return (
      <>
        {p < 1 ? <HomeScreen frame={frame} /> : null}
        {img(0, {
          transformOrigin: "0 0",
          translate: `${lerp(icon.x, 0, p)}px ${lerp(icon.y, 0, p)}px`,
          scale: sc,
          borderRadius: lerp(H.icon * 0.24, 0, p) / sc,
        })}
      </>
    );
  }
  // Bring zoom point z to the screen centre at scale s: translate = c - s·z.
  const z = zoomAt(frame);
  // Clamped so the zoomed screen always covers the phone (no empty band
  // at the top or bottom when zooming near an edge).
  const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
  const tx = clamp(P.cssW / 2 - z.scale * z.x, P.cssW - z.scale * P.cssW);
  const ty = clamp(P.cssH / 2 - z.scale * z.y, P.cssH - z.scale * P.cssH);
  const camera: React.CSSProperties = {
    transformOrigin: "0 0",
    translate: `${tx * k}px ${ty * k}px`,
    scale: z.scale,
  };
  return (
    <div style={{ position: "absolute", inset: 0, ...camera }}>
      {p < 1
        ? img(current - 1, {
            translate: `${-P.innerPush * P.screenW * p}px 0px`,
          })
        : null}
      {img(current, { translate: `${(1 - p) * P.screenW}px 0px` })}
    </div>
  );
};

// Finger taps: on recorded element boxes, plus the Pomelo icon on the home screen.
const tapAt = (frame: number) => {
  const inWindow = (at: number) =>
    frame >= at - TAP.lead && frame <= at + TAP.ripple;
  if (inWindow(H.open.at)) {
    const icon = iconPos(H.scroll.px);
    return { at: H.open.at, cx: icon.x + H.icon / 2, cy: icon.y + H.icon / 2 };
  }
  const t = APP_TAPS.find((a) => inWindow(a.at));
  if (!t) return null;
  const b = boxOf(t.screen, t.target);
  return { at: t.at, cx: (b.x + b.w / 2) * k, cy: (b.y + b.h / 2) * k };
};

const Taps: React.FC<{ frame: number }> = ({ frame }) => {
  const t = tapAt(frame);
  if (!t) return null;
  const { cx, cy } = t;
  const r =
    frame >= t.at
      ? interpolate(frame, [t.at, t.at + TAP.ripple], [TAP.dotR, TAP.rippleR])
      : TAP.dotR;
  const fade =
    frame >= t.at
      ? interpolate(frame, [t.at, t.at + TAP.ripple], [TAP.dotOpacity, 0])
      : 0;
  const dot = (radius: number, opacity: number) => (
    <div
      style={{
        position: "absolute",
        left: cx - radius,
        top: cy - radius,
        width: 2 * radius,
        height: 2 * radius,
        borderRadius: radius,
        background: TAP.color,
        opacity,
      }}
    />
  );
  return (
    <>
      {dot(TAP.dotR, TAP.dotOpacity)}
      {fade > 0 ? dot(r, fade) : null}
    </>
  );
};

// The big phone: dark body, dynamic island, the design's screens.
export const AppPhone: React.FC<{ frame: number; scale: number }> = ({
  frame,
  scale,
}) => (
  <AbsoluteFill
    style={{ transformOrigin: `${P.x}px ${P.top + bodyH / 2}px`, scale }}
  >
    <div
      style={{
        position: "absolute",
        left: P.x - bodyW / 2,
        top: P.top,
        width: bodyW,
        height: bodyH,
        borderRadius: P.radius,
        background: P.body,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: P.x - P.screenW / 2,
        top: P.top + P.bezel,
        width: P.screenW,
        height: screenH,
        borderRadius: P.screenRadius,
        overflow: "hidden",
        background: DESIGN.cream,
      }}
    >
      <ScreenStack frame={frame} />
      <Taps frame={frame} />
      <div
        style={{
          position: "absolute",
          left: (P.screenW - P.island.w) / 2,
          top: P.island.top,
          width: P.island.w,
          height: P.island.h,
          borderRadius: P.island.h / 2,
          background: P.body,
        }}
      />
    </div>
  </AbsoluteFill>
);
