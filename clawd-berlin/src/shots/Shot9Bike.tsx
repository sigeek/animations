import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Clawd, sitAnchorY } from "../components/Clawd";
import { DistantFernsehturm } from "../components/Fernsehturm";
import { hopAt } from "../components/hop";
import { Push } from "../components/Push";
import { Bike, bikeSaddleX, bikeSaddleY } from "../components/landmarks/Bike";
import { TempelhofField } from "../components/landmarks/Tempelhof";
import { AltbauRow, StreetTrees } from "../components/street/Altbau";
import { Lamps, Road, Sidewalk } from "../components/street/Street";
import { BIKE, CLAWD, EASE, SHOTS, STREET, VIDEO } from "../tokens";
import { SunsetBands, skyAt } from "../daylight";
import { lerp, placed, ramp, travel, useGlobalFrame } from "../motion";
import { BusWorld } from "./Shot8Bus100";

const P = STREET.parallax;

// Clawd's bob on a bump: up 1 unit, back down.
const bumpLift = (frame: number) =>
  BIKE.bumps.reduce(
    (sum, b) =>
      sum +
      interpolate(
        frame,
        [b, b + BIKE.bump.up, b + BIKE.bump.up + BIKE.bump.down],
        [0, CLAWD.unit, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      ),
    0,
  );

// Shots 9–10 as one world, a pure function of the global frame: pastel
// Schöneberg/Kreuzberg Altbau with street trees, then Tempelhofer Feld.
export const BikeWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const b = BIKE;
  const ride = travel(frame, b.travel);
  const drop =
    b.cityDrop.px * ramp(frame, b.cityDrop.from, b.cityDrop.to, EASE.inCubic);
  const fieldX = lerp(
    VIDEO.width,
    0,
    ramp(frame, b.field.slide.from, b.field.slide.to, EASE.outCubic),
  );
  const wheelDeg = ((ride / b.wheelR) * 180) / Math.PI;
  const seat = {
    x: bikeSaddleX(b.x),
    y:
      sitAnchorY(bikeSaddleY()) +
      b.seatSinkUnits * CLAWD.unit -
      bumpLift(frame),
  };
  const hop = hopAt(frame, b.hopOff, seat, { x: b.landX, y: b.groundY });
  const onBike = frame < b.hopOff.air.from;
  return (
    <AbsoluteFill style={{ background: skyAt(frame) }}>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <SunsetBands frame={frame} />
        <g transform={`translate(0 ${drop})`}>
          <DistantFernsehturm
            x={placed(
              b.tower.screenX,
              P.skyline,
              travel(b.tower.atFrame, b.travel),
              ride,
              -1,
            )}
            baseY={STREET.horizonY}
            scale={b.tower.scale}
          />
          <AltbauRow style="kreuzberg" offset={-ride * P.buildings} />
          <StreetTrees offset={-ride * P.buildings} />
        </g>
        <Road />
        <Sidewalk />
        <g transform={`translate(0 ${drop})`}>
          <Lamps offset={-ride * P.street} />
        </g>
        <g transform={`translate(${fieldX} 0)`}>
          <TempelhofField frame={frame} runwayOffset={-ride * P.street} />
        </g>
        <Bike x={b.x} angleDeg={wheelDeg} />
        <Clawd
          x={hop.x}
          y={hop.y}
          scaleX={hop.scaleX}
          scaleY={hop.scaleY}
          pose={onBike ? "sit" : "stand"}
        />
      </svg>
    </AbsoluteFill>
  );
};

// Shot 9, 726–845, pushed in from the Ku'damm: riding at constant speed,
// bumps at 760 and 800, the city drops away from 790 and Tempelhofer Feld
// slides in.
export const Shot9Bike: React.FC = () => {
  const frame = useGlobalFrame("bike");
  return (
    <Push
      frame={frame}
      at={SHOTS.bike.from}
      outgoing={<BusWorld frame={frame} />}
    >
      <BikeWorld frame={frame} />
    </Push>
  );
};

// Shot 10, 846–899: brake to a stop at 850, hop off, stand. Only a 2%
// push-in moves after that.
export const Shot10Final: React.FC = () => {
  const frame = useGlobalFrame("final");
  const p = BIKE.pushIn;
  return (
    <AbsoluteFill style={{ background: skyAt(frame) }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${p.originX}px ${p.originY}px`,
          scale: interpolate(frame, [p.from, p.to], [1, p.scale], {
            easing: EASE.inOutQuart,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <BikeWorld frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
