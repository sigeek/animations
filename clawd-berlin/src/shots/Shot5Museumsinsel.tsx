import React from "react";
import { AbsoluteFill } from "remotion";
import { Clawd } from "../components/Clawd";
import { DistantFernsehturm } from "../components/Fernsehturm";
import { PoleSign } from "../components/PoleSign";
import { Push } from "../components/Push";
import {
  AlteNationalgalerie,
  AltesMuseum,
  BerlinerDom,
  NeuesMuseum,
} from "../components/landmarks/Museumsinsel";
import { DistantTrees } from "../components/street/DistantTrees";
import { Lamps, Sidewalk } from "../components/street/Street";
import { walkCycle } from "../components/walkCycle";
import { ACCENTS, MUSEUM, SHOTS, STREET, VIDEO } from "../tokens";
import { skyAt } from "../daylight";
import { placed, travel, useGlobalFrame } from "../motion";
import { AlexanderplatzWorld } from "./Shot4Alexanderplatz";

const P = STREET.parallax;

// Along the Spree past the Dom, Altes Museum and Neues Museum to the Alte
// Nationalgalerie, where Clawd stops at 320.
export const MuseumsinselWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const m = MUSEUM;
  const scroll = travel(frame, m.travel);
  const isle = (screenX: number) =>
    placed(screenX, P.island, travel(m.atFrame, m.travel), scroll, -1);
  const walking = frame < m.travel.stopAt;
  const walk = walkCycle(frame, m.travel.start);
  return (
    <AbsoluteFill style={{ background: skyAt(frame) }}>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <DistantTrees offset={-scroll * P.skyline} />
        <DistantFernsehturm
          x={placed(
            m.tower.screenX,
            P.skyline,
            travel(m.tower.atFrame, m.travel),
            scroll,
            -1,
          )}
          baseY={STREET.horizonY}
          scale={m.tower.scale}
        />
        {[
          { x: isle(m.dom.centerScreenX), el: BerlinerDom },
          { x: isle(m.altes.centerScreenX), el: AltesMuseum },
          { x: isle(m.neues.centerScreenX), el: NeuesMuseum },
          { x: isle(m.natgal.centerScreenX), el: AlteNationalgalerie },
        ].map(({ x, el: Building }, i) => (
          <g
            key={i}
            transform={`translate(${x} ${STREET.horizonY}) scale(${m.scale}) translate(${-x} ${-STREET.horizonY})`}
          >
            <Building cx={x} />
          </g>
        ))}
        <rect
          x={0}
          y={STREET.road.top}
          width={VIDEO.width}
          height={STREET.road.bottom - STREET.road.top}
          fill={ACCENTS.spree}
        />
        <Sidewalk />
        <Lamps offset={-scroll * P.street} />
        <PoleSign
          poleX={placed(
            m.signpost.screenX,
            P.street,
            travel(m.signpost.atFrame, m.travel),
            scroll,
            -1,
          )}
          panelY={m.signpost.panelY}
          panelW={m.signpost.panelW}
          text={m.signpost.text}
          arrow
          anchor="left"
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

// Shot 5, 185–335, pushed in from Alexanderplatz.
export const Shot5Museumsinsel: React.FC = () => {
  const frame = useGlobalFrame("museumsinsel");
  return (
    <Push
      frame={frame}
      at={SHOTS.museumsinsel.from}
      outgoing={<AlexanderplatzWorld frame={frame} />}
    >
      <MuseumsinselWorld frame={frame} />
    </Push>
  );
};
