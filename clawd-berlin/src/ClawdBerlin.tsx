import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { DebugOverlay } from "./components/DebugOverlay";
import { Shot1Title } from "./shots/Shot1Title";
import { Shot2Crumple } from "./shots/Shot2Crumple";
import { Shot3Unfold } from "./shots/Shot3Unfold";
import { Shot4Alexanderplatz } from "./shots/Shot4Alexanderplatz";
import { COLORS, SHOTS, shotLength, type ShotKey } from "./tokens";

export type ClawdBerlinProps = {
  debug: boolean;
};

// Shots 5–10 arrive in Phase 2.
const PHASE_2: ShotKey[] = ["museumsinsel", "u5", "bundestag", "bus100", "bike", "final"];

export const ClawdBerlin: React.FC<ClawdBerlinProps> = ({ debug }) => {
  return (
    <AbsoluteFill style={{ background: COLORS.sky }}>
      <Series>
        <Series.Sequence name={SHOTS.title.name} durationInFrames={shotLength("title")}>
          <Shot1Title />
        </Series.Sequence>
        <Series.Sequence name={SHOTS.crumple.name} durationInFrames={shotLength("crumple")}>
          <Shot2Crumple />
        </Series.Sequence>
        <Series.Sequence name={SHOTS.unfold.name} durationInFrames={shotLength("unfold")}>
          <Shot3Unfold />
        </Series.Sequence>
        <Series.Sequence name={SHOTS.alexanderplatz.name} durationInFrames={shotLength("alexanderplatz")}>
          <Shot4Alexanderplatz />
        </Series.Sequence>
        {PHASE_2.map((key) => (
          <Series.Sequence key={key} name={SHOTS[key].name} durationInFrames={shotLength(key)}>
            <AbsoluteFill style={{ background: COLORS.sky }} />
          </Series.Sequence>
        ))}
      </Series>
      {debug ? <DebugOverlay /> : null}
    </AbsoluteFill>
  );
};
