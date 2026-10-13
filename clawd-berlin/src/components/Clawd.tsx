import React from "react";
import { lightOf, shadeOf } from "../shading";
import { CLAWD, COLORS } from "../tokens";

export type ClawdPose = "stand" | "stepA" | "stepB" | "sit" | "lookUp";

type Props = {
  // Feet centre, in px.
  x: number;
  y: number;
  pose?: ClawdPose;
  scaleX?: number;
  scaleY?: number;
  // Raises the whole sprite, in grid units (walk-cycle bob).
  liftUnits?: number;
};

// Clawd as an SVG group, with flat cel shading. Proportions are fixed by
// CLAWD; scale only ever squashes around the feet.
export const Clawd: React.FC<Props> = ({
  x,
  y,
  pose = "stand",
  scaleX = 1,
  scaleY = 1,
  liftUnits = 0,
}) => {
  const u = CLAWD.unit;
  const sh = CLAWD.shading;
  const light = lightOf(COLORS.clawd);
  const shade = shadeOf(COLORS.clawd);
  const eyeShift = pose === "lookUp" ? CLAWD.lookUpEyeShift : 0;
  const legs =
    pose === "sit"
      ? []
      : CLAWD.legs.map((leg, i) => {
          const lifted =
            (pose === "stepA" && i % 2 === 0) ||
            (pose === "stepB" && i % 2 === 1);
          return lifted ? { ...leg, h: leg.h - CLAWD.stepLift } : leg;
        });

  const rect = (
    r: { x: number; y: number; w: number; h: number },
    fill: string,
    key: string,
  ) => (
    <rect
      key={key}
      x={r.x * u}
      y={r.y * u}
      width={r.w * u}
      height={r.h * u}
      fill={fill}
    />
  );

  return (
    <g
      transform={`translate(${x} ${y - liftUnits * u}) scale(${scaleX} ${scaleY}) translate(${-CLAWD.anchor.x * u} ${-CLAWD.anchor.y * u})`}
      shapeRendering="crispEdges"
    >
      {rect(CLAWD.body, COLORS.clawd, "body")}
      {rect({ ...CLAWD.body, h: sh.topUnits }, light, "bodyLight")}
      {rect(
        {
          ...CLAWD.body,
          y: CLAWD.body.y + CLAWD.body.h - sh.bottomUnits,
          h: sh.bottomUnits,
        },
        shade,
        "bodyShade",
      )}
      {CLAWD.arms.map((arm, i) => (
        <g key={`arm${i}`}>
          {rect(arm, COLORS.clawd, "a")}
          {rect(
            { ...arm, y: arm.y + arm.h - sh.armUnits, h: sh.armUnits },
            shade,
            "s",
          )}
        </g>
      ))}
      {legs.map((leg, i) => (
        <g key={`leg${i}`}>
          {rect(leg, COLORS.clawd, "l")}
          {rect({ ...leg, h: Math.min(sh.legUnits, leg.h) }, shade, "s")}
        </g>
      ))}
      {CLAWD.eyes.map((eye, i) =>
        rect({ ...eye, y: eye.y + eyeShift }, COLORS.ink, `eye${i}`),
      )}
    </g>
  );
};

// Sit pose hides the legs, so the body bottom is above the anchor. Returns the
// anchor y that puts the body bottom on `seatY`.
export const sitAnchorY = (seatY: number) =>
  seatY + (CLAWD.anchor.y - CLAWD.body.h) * CLAWD.unit;
