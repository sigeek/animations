import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { DebugOverlay } from "./components/DebugOverlay";
import { DayTint } from "./daylight";
import { Shot1Title } from "./shots/Shot1Title";
import { Shot2Crumple } from "./shots/Shot2Crumple";
import { Shot3Unfold } from "./shots/Shot3Unfold";
import { Shot4Alexanderplatz } from "./shots/Shot4Alexanderplatz";
import { Shot5Museumsinsel } from "./shots/Shot5Museumsinsel";
import { Shot6U5 } from "./shots/Shot6U5";
import { Shot7Bundestag } from "./shots/Shot7Bundestag";
import { Shot8Bus100 } from "./shots/Shot8Bus100";
import { Shot10Final, Shot9Bike } from "./shots/Shot9Bike";
import { COLORS, SHOTS, shotLength } from "./tokens";

export type ClawdBerlinProps = {
  debug: boolean;
};

export const ClawdBerlin: React.FC<ClawdBerlinProps> = ({ debug }) => {
  return (
    <AbsoluteFill style={{ background: COLORS.sky }}>
      <Series>
        <Series.Sequence
          name={SHOTS.title.name}
          durationInFrames={shotLength("title")}
        >
          <Shot1Title />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.crumple.name}
          durationInFrames={shotLength("crumple")}
        >
          <Shot2Crumple />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.unfold.name}
          durationInFrames={shotLength("unfold")}
        >
          <Shot3Unfold />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.alexanderplatz.name}
          durationInFrames={shotLength("alexanderplatz")}
        >
          <Shot4Alexanderplatz />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.museumsinsel.name}
          durationInFrames={shotLength("museumsinsel")}
        >
          <Shot5Museumsinsel />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.u5.name}
          durationInFrames={shotLength("u5")}
        >
          <Shot6U5 />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.bundestag.name}
          durationInFrames={shotLength("bundestag")}
        >
          <Shot7Bundestag />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.bus100.name}
          durationInFrames={shotLength("bus100")}
        >
          <Shot8Bus100 />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.bike.name}
          durationInFrames={shotLength("bike")}
        >
          <Shot9Bike />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.final.name}
          durationInFrames={shotLength("final")}
        >
          <Shot10Final />
        </Series.Sequence>
      </Series>
      <DayTint />
      {debug ? <DebugOverlay /> : null}
    </AbsoluteFill>
  );
};
