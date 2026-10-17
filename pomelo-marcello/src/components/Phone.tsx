import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { FONT_FAMILY } from "../fonts";
import { ramp } from "../motion";
import { APP, COLORS, EASE, FONT, PHONE, PUSH, SCREENS, TAP } from "../tokens";

const screenW = PHONE.imageW * PHONE.scale;
const viewH = PHONE.viewportH * PHONE.scale;
const bodyW = screenW + 2 * PHONE.bezel;
const bodyH = PHONE.statusH + viewH + 2 * PHONE.bezel;
const bodyLeft = PHONE.x - bodyW / 2;
export const VIEWPORT = {
  left: bodyLeft + PHONE.bezel,
  top: PHONE.top + PHONE.bezel + PHONE.statusH,
  w: screenW,
  h: viewH,
};

// Which captured screen is showing, iOS-style pushes between them, and the
// compare screen's scroll.
const ScreenStack: React.FC<{ frame: number }> = ({ frame }) => {
  const current = SCREENS.reduce((idx, s, i) => (frame >= s.at ? i : idx), 0);
  const layer = (i: number, x: number) => {
    const s = SCREENS[i];
    const scroll =
      "scroll" in s
        ? s.scroll.px *
          PHONE.scale *
          ramp(frame, s.scroll.from, s.scroll.to, EASE.inOutQuart)
        : 0;
    return (
      <Img
        key={s.src}
        src={staticFile(s.src)}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: screenW,
          translate: `${x}px ${-scroll}px`,
        }}
      />
    );
  };
  const s = SCREENS[current];
  const p =
    current > 0 ? ramp(frame, s.at, s.at + PUSH.frames, EASE.inOutQuart) : 1;
  return (
    <>
      {p < 1 ? layer(current - 1, -PHONE.innerPush * screenW * p) : null}
      {layer(current, (1 - p) * screenW)}
    </>
  );
};

// Finger dot and ripple for the tap on "Send to AI intern".
const Tap: React.FC<{ frame: number }> = ({ frame }) => {
  const t = TAP;
  if (frame < t.at - t.lead || frame > t.at + t.ripple) return null;
  const x = t.x * PHONE.scale;
  const y = t.y * PHONE.scale;
  const r =
    frame >= t.at
      ? interpolate(frame, [t.at, t.at + t.ripple], [t.dotR, t.rippleR])
      : t.dotR;
  const ripple =
    frame >= t.at
      ? interpolate(frame, [t.at, t.at + t.ripple], [t.dotOpacity, 0])
      : 0;
  const circle = (radius: number, opacity: number) => (
    <div
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: 2 * radius,
        height: 2 * radius,
        borderRadius: radius,
        background: t.color,
        opacity,
      }}
    />
  );
  return (
    <>
      {circle(t.dotR, t.dotOpacity)}
      {ripple > 0 ? circle(r, ripple) : null}
    </>
  );
};

// The phone: dark body, status bar with 9:41, dynamic island, the captured
// screens underneath.
export const Phone: React.FC<{ frame: number }> = ({ frame }) => {
  const st = PHONE.status;
  return (
    <AbsoluteFill style={{ background: PHONE.bg }}>
      <div
        style={{
          position: "absolute",
          left: bodyLeft,
          top: PHONE.top,
          width: bodyW,
          height: bodyH,
          borderRadius: PHONE.radius,
          background: PHONE.body,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: VIEWPORT.left,
          top: PHONE.top + PHONE.bezel,
          width: screenW,
          height: PHONE.statusH + viewH,
          borderRadius: PHONE.screenRadius,
          overflow: "hidden",
          background: APP.bg,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: PHONE.statusH,
            width: screenW,
            height: viewH,
            overflow: "hidden",
          }}
        >
          <ScreenStack frame={frame} />
          <Tap frame={frame} />
        </div>
        <div
          style={{
            position: "absolute",
            left: st.padX,
            top: 0,
            height: PHONE.statusH,
            display: "flex",
            alignItems: "center",
            fontFamily: FONT_FAMILY,
            fontWeight: FONT.weight,
            fontSize: st.fontSize,
            color: COLORS.ink,
          }}
        >
          {st.time}
        </div>
        <div
          style={{
            position: "absolute",
            right: st.padX,
            top: (PHONE.statusH - st.battery.h) / 2,
            width: st.battery.w,
            height: st.battery.h,
            borderRadius: st.battery.radius,
            background: COLORS.ink,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: (screenW - PHONE.island.w) / 2,
            top: PHONE.island.top,
            width: PHONE.island.w,
            height: PHONE.island.h,
            borderRadius: PHONE.island.h / 2,
            background: PHONE.body,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
