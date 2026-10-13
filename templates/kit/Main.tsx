import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Clawd } from "./components/Clawd"; // clawd-only
import { DebugOverlay } from "./components/DebugOverlay";
import { walkCycle } from "./components/walkCycle"; // clawd-only
import { lerp, ramp, useGlobalFrame } from "./motion";
import { ShadedCircle } from "./shading";
import { COLORS, EASE, INTRO, SHOTS, VIDEO, shotLength } from "./tokens";

export type MainProps = {
  debug: boolean;
};

// Placeholder World: a pure function of the global frame. Replace it with
// the first shot from PROMPT.md.
export const IntroWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const s = INTRO.sun;
  const sunX = lerp(s.fromX, s.toX, ramp(frame, s.from, s.to, EASE.inOutQuart));
  return (
    <AbsoluteFill style={{ background: COLORS.sky }}>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <ShadedCircle cx={sunX} cy={s.y} r={s.r} fill={s.color} />
        <rect x={0} y={INTRO.groundY} width={VIDEO.width} height={VIDEO.height - INTRO.groundY} fill={COLORS.stone} />
        <Clawd x={INTRO.clawdX} y={INTRO.feetY} pose={walkCycle(frame, 0).pose} /> {/* clawd-only */}
      </svg>
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => <IntroWorld frame={useGlobalFrame("intro")} />;

export const Main: React.FC<MainProps> = ({ debug }) => {
  return (
    <AbsoluteFill style={{ background: COLORS.sky }}>
      <Series>
        <Series.Sequence name={SHOTS.intro.name} durationInFrames={shotLength("intro")}>
          <Intro />
        </Series.Sequence>
      </Series>
      {debug ? <DebugOverlay /> : null}
    </AbsoluteFill>
  );
};
