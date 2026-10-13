import { WALK } from "../tokens";
import type { ClawdPose } from "./Clawd";

// Step A/B swap every WALK.stepFrames; the body rises WALK.liftUnits for the
// first WALK.liftFrames after each swap.
export const walkCycle = (
  frame: number,
  startFrame: number,
): { pose: ClawdPose; liftUnits: number } => {
  const t = Math.max(0, frame - startFrame);
  const step = Math.floor(t / WALK.stepFrames);
  const sinceSwap = t % WALK.stepFrames;
  return {
    pose: step % 2 === 0 ? "stepA" : "stepB",
    liftUnits: sinceSwap < WALK.liftFrames ? WALK.liftUnits : 0,
  };
};
