import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../fonts";
import { COLORS, DEBUG, FONT, SHOT_ORDER, SHOTS } from "../tokens";

// Frame number top-left, shot name top-right. Off for the final render.
export const DebugOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const shot = SHOT_ORDER.find((key) => frame >= SHOTS[key].from && frame <= SHOTS[key].to);
  const label: React.CSSProperties = {
    position: "absolute",
    top: DEBUG.padding,
    padding: `${DEBUG.padding / 3}px ${DEBUG.padding / 2}px`,
    background: DEBUG.background,
    color: COLORS.paper,
    fontFamily: FONT_FAMILY,
    fontWeight: FONT.weight,
    fontSize: DEBUG.fontSize,
  };
  return (
    <AbsoluteFill>
      <div style={{ ...label, left: DEBUG.padding }}>{frame}</div>
      <div style={{ ...label, right: DEBUG.padding }}>{shot ? SHOTS[shot].name : ""}</div>
    </AbsoluteFill>
  );
};
