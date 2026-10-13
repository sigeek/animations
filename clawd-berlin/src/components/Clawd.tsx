import React from "react";
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

// Clawd as an SVG group. Proportions are fixed by CLAWD; scale only ever
// squashes around the feet.
export const Clawd: React.FC<Props> = ({ x, y, pose = "stand", scaleX = 1, scaleY = 1, liftUnits = 0 }) => {
  const u = CLAWD.unit;
  const eyeShift = pose === "lookUp" ? CLAWD.lookUpEyeShift : 0;
  const legs =
    pose === "sit"
      ? []
      : CLAWD.legs.map((leg, i) => {
          const lifted = (pose === "stepA" && i % 2 === 0) || (pose === "stepB" && i % 2 === 1);
          return lifted ? { ...leg, h: leg.h - CLAWD.stepLift } : leg;
        });

  const rect = (r: { x: number; y: number; w: number; h: number }, fill: string, key: string) => (
    <rect key={key} x={r.x * u} y={r.y * u} width={r.w * u} height={r.h * u} fill={fill} />
  );

  return (
    <g
      transform={`translate(${x} ${y - liftUnits * u}) scale(${scaleX} ${scaleY}) translate(${-CLAWD.anchor.x * u} ${-CLAWD.anchor.y * u})`}
      shapeRendering="crispEdges"
    >
      {rect(CLAWD.body, COLORS.clawd, "body")}
      {CLAWD.arms.map((arm, i) => rect(arm, COLORS.clawd, `arm${i}`))}
      {legs.map((leg, i) => rect(leg, COLORS.clawd, `leg${i}`))}
      {CLAWD.eyes.map((eye, i) => rect({ ...eye, y: eye.y + eyeShift }, COLORS.ink, `eye${i}`))}
    </g>
  );
};
