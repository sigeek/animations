import React from "react";
import { AbsoluteFill } from "remotion";
import { Clawd, sitAnchorY } from "../components/Clawd";
import { PoleSign } from "../components/PoleSign";
import { Push } from "../components/Push";
import { BrandenburgerTor } from "../components/landmarks/BrandenburgerTor";
import {
  UBahnStairsBack,
  UBahnStairwell,
} from "../components/landmarks/UBahnStairs";
import { Tunnel, U5Car } from "../components/landmarks/U5Tunnel";
import { Road, Sidewalk } from "../components/street/Street";
import { EASE, SHOTS, STREET, U5, VIDEO } from "../tokens";
import { skyAt } from "../daylight";
import { lerp, ramp, useGlobalFrame } from "../motion";
import { MuseumsinselWorld } from "./Shot5Museumsinsel";

// Riding the U5: tunnel lights pass at constant speed.
export const TunnelWorld: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill>
    <svg width={VIDEO.width} height={VIDEO.height}>
      <Tunnel offset={-(frame - U5.tunnel.from) * U5.speed} />
      <U5Car />
      <Clawd x={U5.clawdX} y={sitAnchorY(U5.car.windowBottom)} pose="sit" />
    </svg>
  </AbsoluteFill>
);

// Clawd rises out of the station in front of the Brandenburger Tor against
// open sky, then looks up from 440.
export const GateWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const g = U5.gate;
  const rise = ramp(frame, g.rise.from, g.rise.to, EASE.outCubic);
  const lookingUp = frame >= g.lookUp.from && frame <= g.lookUp.to;
  return (
    <AbsoluteFill style={{ background: skyAt(frame) }}>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <BrandenburgerTor />
        <Road />
        <Sidewalk />
        <UBahnStairwell />
        <UBahnStairsBack />
        <PoleSign
          poleX={g.sign.poleX}
          panelY={g.sign.panelY}
          panelW={g.sign.panelW}
          text={g.sign.text}
          badge={g.sign.badge}
          anchor="left"
        />
        <Clawd
          x={U5.clawdX}
          y={lerp(STREET.feetY + g.riseDepthPx, STREET.feetY, rise)}
          pose={lookingUp ? "lookUp" : "stand"}
        />
      </svg>
    </AbsoluteFill>
  );
};

// Shot 6, 336–485: pushed in from the Museumsinsel; the tunnel pushes on to
// the station at 411.
export const Shot6U5: React.FC = () => {
  const frame = useGlobalFrame("u5");
  if (frame < U5.gate.cutAt) {
    return (
      <Push
        frame={frame}
        at={SHOTS.u5.from}
        outgoing={<MuseumsinselWorld frame={frame} />}
      >
        <TunnelWorld frame={frame} />
      </Push>
    );
  }
  return (
    <Push
      frame={frame}
      at={U5.gate.cutAt}
      outgoing={<TunnelWorld frame={frame} />}
    >
      <GateWorld frame={frame} />
    </Push>
  );
};
