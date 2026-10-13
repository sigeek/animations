import React from "react";
import { AbsoluteFill } from "remotion";
import { Clawd } from "../components/Clawd";
import { PoleSign } from "../components/PoleSign";
import { Push } from "../components/Push";
import { Reichstag } from "../components/landmarks/Reichstag";
import { DistantTrees } from "../components/street/DistantTrees";
import { Lamps, Road, Sidewalk } from "../components/street/Street";
import { TreeBand } from "../components/street/TreeBand";
import { walkCycle } from "../components/walkCycle";
import { BUNDESTAG, SHOTS, STREET, VIDEO } from "../tokens";
import { skyAt } from "../daylight";
import { placed, travel, useGlobalFrame } from "../motion";
import { GateWorld } from "./Shot6U5";

const P = STREET.parallax;

// Scene state shared with shot 8, which opens on the same framing. `walked`
// is the street-layer distance of shot 7's walk.
export const bundestagScene = (walked: number) => {
  const b = BUNDESTAG;
  const reichstagX = placed(
    b.reichstag.centerScreenX,
    P.buildings,
    travel(b.reichstag.atFrame, b.travel),
    walked,
    -1,
  );
  return {
    reichstagX,
    treesRight: reichstagX - b.reichstag.w / 2 - b.treeGap,
    busStopX: placed(
      b.busStop.screenX,
      P.street,
      travel(b.busStop.atFrame, b.travel),
      walked,
      -1,
    ),
  };
};

// Walk past the trees of the Platz der Republik; the Reichstag slides in and
// Clawd stops at 555 by the "Bundestag" bus stop.
export const BundestagWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const b = BUNDESTAG;
  const walked = travel(frame, b.travel);
  const scene = bundestagScene(walked);
  const walking = frame < b.travel.stopAt;
  const walk = walkCycle(frame, b.travel.start);
  return (
    <AbsoluteFill style={{ background: skyAt(frame) }}>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <DistantTrees offset={-walked * P.skyline} />
        <TreeBand offset={-walked * P.buildings} right={scene.treesRight} />
        <Reichstag cx={scene.reichstagX} />
        <Road />
        <Sidewalk />
        <Lamps offset={-walked * P.street} />
        <PoleSign
          poleX={scene.busStopX}
          panelY={b.busStop.panelY}
          panelW={b.busStop.panelW}
          text={b.busStop.text}
          badge={b.busStop.badge}
        />
        <Clawd
          x={STREET.clawdX}
          y={STREET.feetY}
          pose={walking ? walk.pose : "stand"}
          liftUnits={walking ? walk.liftUnits : 0}
        />
      </svg>
    </AbsoluteFill>
  );
};

// Shot 7, 486–575, pushed in from the Brandenburger Tor.
export const Shot7Bundestag: React.FC = () => {
  const frame = useGlobalFrame("bundestag");
  return (
    <Push
      frame={frame}
      at={SHOTS.bundestag.from}
      outgoing={<GateWorld frame={frame} />}
    >
      <BundestagWorld frame={frame} />
    </Push>
  );
};
