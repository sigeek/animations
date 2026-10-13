import React from "react";
import { AbsoluteFill } from "remotion";
import { Clawd, type ClawdPose } from "../components/Clawd";
import { Fernsehturm } from "../components/Fernsehturm";
import { SBahnTrain } from "../components/SBahnTrain";
import { StationCanopy } from "../components/StationCanopy";
import { StationSign } from "../components/StationSign";
import { hopAt } from "../components/hop";
import { ALEX, COLORS, EASE, VIDEO } from "../tokens";
import { lerp, ramp, useGlobalFrame } from "../motion";

type ClawdState = { x: number; y: number; scaleX: number; scaleY: number; pose: ClawdPose; inTrain: boolean };

// Exit hop 131–145 out of the doorway onto the platform; look-up from 138
// (top of the arc); a small excited hop in place 151–164.
const clawdState = (frame: number, doorCenterX: number): ClawdState => {
  const c = ALEX.clawd;
  const pose: ClawdPose = frame >= c.lookUp.from && frame <= c.lookUp.to ? "lookUp" : "stand";
  const door = { x: doorCenterX, y: ALEX.platform.topY };
  const landed = { x: c.landX, y: c.landFeetY };
  if (frame < c.cheerHop.crouch.from) {
    return { ...hopAt(frame, c.exitHop, door, landed), pose, inTrain: frame <= c.exitHop.crouch.to };
  }
  return { ...hopAt(frame, c.cheerHop, landed, landed), pose, inTrain: false };
};

// The station world as a pure function of the global frame.
export const AlexanderplatzWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const t = ALEX.train;
  const frontX = lerp(t.enterFrontX, t.stopFrontX, ramp(frame, t.arrive.from, t.arrive.to, EASE.outCubic));
  const doorOpen = ramp(frame, t.door.open.from, t.door.open.to, EASE.outCubic);
  const signUnfold = ramp(frame, ALEX.sign.drop.from, ALEX.sign.drop.to, EASE.outCubic);
  const clawd = clawdState(frame, frontX + t.door.offsetX + t.door.w / 2);
  const clawdSprite = (
    <Clawd x={clawd.x} y={clawd.y} pose={clawd.pose} scaleX={clawd.scaleX} scaleY={clawd.scaleY} />
  );
  const { platform } = ALEX;

  return (
    <svg width={VIDEO.width} height={VIDEO.height} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(0 ${ALEX.camera.offsetY})`}>
        <rect x={0} y={ALEX.skyTop} width={VIDEO.width} height={platform.bottomY - ALEX.skyTop} fill={COLORS.sky} />
        <Fernsehturm />
        <StationCanopy />
        <SBahnTrain frontX={frontX} doorOpen={doorOpen} passenger={clawd.inTrain && doorOpen > 0 ? clawdSprite : null} />
        <rect x={0} y={platform.topY} width={VIDEO.width} height={platform.bottomY - platform.topY} fill={COLORS.stone} />
        <rect x={0} y={platform.topY} width={VIDEO.width} height={platform.edgeHeight} fill={COLORS.shadow} />
        <StationSign unfold={signUnfold} />
        {clawd.inTrain ? null : clawdSprite}
      </g>
    </svg>
  );
};

// Shot 4, 81–184.
export const Shot4Alexanderplatz: React.FC = () => {
  const frame = useGlobalFrame("alexanderplatz");
  return (
    <AbsoluteFill>
      <AlexanderplatzWorld frame={frame} />
    </AbsoluteFill>
  );
};
