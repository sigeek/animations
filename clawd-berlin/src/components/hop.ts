import { EASE, SPRING } from "../tokens";
import { lerp, ramp, springAt } from "../motion";
import type { Pt } from "../motion";

type Squash = { from: number; to: number; scaleX: number; scaleY: number };

export type HopSpec = {
  crouch: Squash; // anticipation, eased in
  air: { from: number; to: number }; // takes off after `from`, touches down at `to`
  arcPeakPx: number;
  land: Squash; // held squash after touchdown
  settleFrames: number; // spring back to 1 (damping ratio SPRING.clawdRatio)
};

// Clawd's hop from `start` to `end` (feet positions): crouch, parabolic arc,
// held landing squash, spring back.
export const hopAt = (frame: number, hop: HopSpec, start: Pt, end: Pt) => {
  if (frame <= hop.crouch.to) {
    const p = ramp(frame, hop.crouch.from, hop.crouch.to, EASE.outCubic);
    return {
      ...start,
      scaleX: lerp(1, hop.crouch.scaleX, p),
      scaleY: lerp(1, hop.crouch.scaleY, p),
      airborne: false,
    };
  }
  if (frame < hop.land.from) {
    const time = ramp(frame, hop.air.from, hop.air.to, EASE.linear);
    const across = ramp(frame, hop.air.from, hop.air.to, EASE.inOutQuad);
    return {
      x: lerp(start.x, end.x, across),
      y: lerp(start.y, end.y, time) - hop.arcPeakPx * 4 * time * (1 - time),
      scaleX: 1,
      scaleY: 1,
      airborne: true,
    };
  }
  const back =
    frame > hop.land.to
      ? springAt(frame, hop.land.to + 1, SPRING.clawdRatio, hop.settleFrames)
      : 0;
  return {
    ...end,
    scaleX: lerp(hop.land.scaleX, 1, back),
    scaleY: lerp(hop.land.scaleY, 1, back),
    airborne: false,
  };
};
