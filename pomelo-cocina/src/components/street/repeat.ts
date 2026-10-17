import { VIDEO } from "../../tokens";

// Start positions for repeating a pattern of width `w` shifted by `offset`
// so that it covers the frame.
export const repeatStarts = (offset: number, w: number): number[] => {
  const first = (((offset % w) + w) % w) - w;
  const starts: number[] = [];
  for (let x = first; x < VIDEO.width; x += w) starts.push(x);
  return starts;
};
