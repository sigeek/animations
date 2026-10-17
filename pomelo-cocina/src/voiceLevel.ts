import levels from "../public/voiceover/levels.json";
import { MARCELLO, VOICEOVER_ON, VOICE_LINES } from "./tokens";

const OWNER = VOICE_LINES.filter((l) => l.who === "owner");

// How open Marcello's mouth is (0..1) at a global frame: the precomputed
// loudness of whichever of his lines is playing (scripts/voice-levels.py).
export const ownerMouth = (frame: number) => {
  if (!VOICEOVER_ON) return 0;
  const line = OWNER.find((l) => frame >= l.from && frame < l.from + l.frames);
  if (!line) return 0;
  const series = (levels as Record<string, number[]>)[line.id] ?? [];
  const v = series[frame - line.from] ?? 0;
  return Math.min(1, v * MARCELLO.level.gain);
};
