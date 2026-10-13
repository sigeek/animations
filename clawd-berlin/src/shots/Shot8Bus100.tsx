import React from "react";
import { AbsoluteFill } from "remotion";
import { Clawd, sitAnchorY } from "../components/Clawd";
import { hopAt } from "../components/hop";
import { PoleSign } from "../components/PoleSign";
import { Bus100 } from "../components/landmarks/Bus100";
import { Gedaechtniskirche, kircheLeft } from "../components/landmarks/Kudamm";
import { Reichstag } from "../components/landmarks/Reichstag";
import { Siegessaeule } from "../components/landmarks/Siegessaeule";
import { AltbauRow } from "../components/street/Altbau";
import { DistantTrees } from "../components/street/DistantTrees";
import { Lamps, Road, Sidewalk } from "../components/street/Street";
import { TreeBand } from "../components/street/TreeBand";
import { BUNDESTAG, BUS100, EASE, STREET, VIDEO } from "../tokens";
import { skyAt } from "../daylight";
import { lerp, placed, ramp, travel, useGlobalFrame } from "../motion";
import { bundestagScene } from "./Shot7Bundestag";

const P = STREET.parallax;

// The bus stops at 590, Clawd hops onto the upper deck (591–604), then the
// camera rides with the bus through the Tiergarten past the Siegessäule
// (630–660) to the Gedächtniskirche on the Ku'damm, stopping at 690.
export const BusWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const b = BUS100;
  const ride = travel(frame, b.travel);
  // Shot 7's walk distance, wound back as the bus drives left.
  const walked = travel(BUNDESTAG.travel.stopAt, BUNDESTAG.travel) - ride;
  const scene = bundestagScene(walked);
  const at = (ref: { atFrame: number }, screenX: number, speed: number) =>
    placed(screenX, speed, travel(ref.atFrame, b.travel), ride, 1);

  const frontX = lerp(
    b.enterFrontX,
    b.frontX,
    ramp(frame, b.arrive.from, b.arrive.to, EASE.outCubic),
  );
  const seat = {
    x: b.frontX + b.frontWindow.offsetX + b.frontWindow.w / 2,
    y: sitAnchorY(b.upperWindows.bottom),
  };
  const hop = hopAt(frame, b.hop, { x: STREET.clawdX, y: STREET.feetY }, seat);
  const seated = frame >= b.hop.land.from;
  const clawd = (
    <Clawd
      x={hop.x}
      y={hop.y}
      scaleX={hop.scaleX}
      scaleY={hop.scaleY}
      pose={seated ? "sit" : "stand"}
    />
  );
  const kircheX = at(b.kirche, b.kirche.screenX, P.buildings);

  return (
    <AbsoluteFill style={{ background: skyAt(frame) }}>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <DistantTrees offset={-walked * P.skyline} />
        <AltbauRow
          style="kudamm"
          offset={-walked * P.buildings}
          right={kircheLeft(kircheX) - b.kudammEnd}
        />
        <Gedaechtniskirche x={kircheX} />
        <TreeBand
          offset={-walked * P.buildings}
          left={at(b.treesEnd, b.treesEnd.screenX, P.buildings)}
          right={scene.treesRight}
        />
        <Siegessaeule
          x={at(b.siegessaeule, b.siegessaeule.screenX, P.buildings)}
        />
        <Reichstag cx={scene.reichstagX} />
        <Road />
        <Bus100 frontX={frontX} passenger={seated ? clawd : null} />
        <Sidewalk />
        <Lamps offset={-walked * P.street} />
        <PoleSign
          poleX={scene.busStopX}
          panelY={BUNDESTAG.busStop.panelY}
          panelW={BUNDESTAG.busStop.panelW}
          text={BUNDESTAG.busStop.text}
          badge={BUNDESTAG.busStop.badge}
        />
        <PoleSign
          poleX={at(b.sign, b.sign.screenX, P.street)}
          panelY={b.sign.panelY}
          panelW={b.sign.panelW}
          text={b.sign.text}
        />
        {seated ? null : clawd}
      </svg>
    </AbsoluteFill>
  );
};

// Shot 8, 576–725: continues shot 7's framing, no transition.
export const Shot8Bus100: React.FC = () => (
  <BusWorld frame={useGlobalFrame("bus100")} />
);
