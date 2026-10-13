import { interpolate, spring, useCurrentFrame } from "remotion";
import { SHOTS, SPRING, VIDEO, type ShotKey } from "./tokens";

type EasingFn = (t: number) => number;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// 0 → 1 between two global frames, clamped.
export const ramp = (frame: number, from: number, to: number, easing: EasingFn) =>
  interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 0 → 1 spring starting at `from`, set by damping ratio and settled by
// `durationInFrames`. Overshoots when ratio < 1; only use it for position
// and scale.
export const springAt = (frame: number, from: number, ratio: number, durationInFrames: number) =>
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
export const useGlobalFrame = (shot: ShotKey) => useCurrentFrame() + SHOTS[shot].from;
