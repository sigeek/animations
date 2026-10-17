import { interpolate, spring, useCurrentFrame } from "remotion";
import { SHOTS, SPRING, VIDEO, type ShotKey, type TravelSpec } from "./tokens";

export type Pt = { x: number; y: number };

type EasingFn = (t: number) => number;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// 0 → 1 between two global frames, clamped.
export const ramp = (
  frame: number,
  from: number,
  to: number,
  easing: EasingFn,
) =>
  interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 0 → 1 spring starting at `from`, set by damping ratio and settled by
// `durationInFrames`. Overshoots when ratio < 1; only use it for position
// and scale.
export const springAt = (
  frame: number,
  from: number,
  ratio: number,
  durationInFrames: number,
) =>
  spring({
    frame: frame - from,
    fps: VIDEO.fps,
    durationInFrames,
    config: {
      mass: SPRING.mass,
      stiffness: SPRING.stiffness,
      damping: 2 * ratio * Math.sqrt(SPRING.stiffness * SPRING.mass),
    },
  });

// Shots live inside a <Series>, so useCurrentFrame() is shot-local. Converting
// back to the global frame lets every shot use PROMPT.md's frame numbers.
export const useGlobalFrame = (shot: ShotKey) =>
  useCurrentFrame() + SHOTS[shot].from;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// Distance covered by a TravelSpec move at `frame`, in street-layer px.
// Ease-in/out phases are sized so speed stays continuous: a power-n ease over
// T frames covers speed * T / n.
export const travel = (frame: number, s: TravelSpec) => {
  const v = s.speed;
  const accelEnd = s.start + s.accelFrames;
  const accel =
    s.accelFrames > 0
      ? ((v * s.accelFrames) / s.accelPower) *
        clamp01((frame - s.start) / s.accelFrames) ** s.accelPower
      : 0;
  const cruise = v * Math.max(0, Math.min(frame, s.decelFrom) - accelEnd);
  const decelT = s.stopAt - s.decelFrom;
  const q = clamp01((frame - s.decelFrom) / decelT);
  const decel = ((v * decelT) / s.decelPower) * (1 - (1 - q) ** s.decelPower);
  return accel + cruise + decel;
};

// Screen x of something on a parallax layer, given where it should be at a
// reference frame. `dir` -1: the camera moves right (walk, bike), so the world
// slides left; +1: the camera moves left (bus).
export const placed = (
  screenXAtRef: number,
  speed: number,
  scrollAtRef: number,
  scrollNow: number,
  dir: -1 | 1,
) => screenXAtRef + dir * speed * (scrollNow - scrollAtRef);
