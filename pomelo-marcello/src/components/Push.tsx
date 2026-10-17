import React from "react";
import { AbsoluteFill } from "remotion";
import { EASE, PUSH, VIDEO } from "../tokens";
import { ramp } from "../motion";

// Push transition at global frame `at`: the outgoing scene slides out to the
// left while the incoming one slides in from the right.
export const Push: React.FC<{
  frame: number;
  at: number;
  outgoing: React.ReactNode;
  children: React.ReactNode;
}> = ({ frame, at, outgoing, children }) => {
  const p = ramp(frame, at, at + PUSH.frames, EASE.inOutQuart);
  if (p >= 1) return <>{children}</>;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${-p * VIDEO.width}px 0px` }}>
        {outgoing}
      </AbsoluteFill>
      <AbsoluteFill style={{ translate: `${(1 - p) * VIDEO.width}px 0px` }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
