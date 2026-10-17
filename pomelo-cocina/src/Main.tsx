import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  Series,
  staticFile,
} from "remotion";
import { DebugOverlay } from "./components/DebugOverlay";
import { Push } from "./components/Push";
import { useGlobalFrame } from "./motion";
import { CloseWorld, ResultWorld } from "./scenes/Phase2";
import { BeforeWorld, DiscoveryWorld, SchedulingWorld } from "./scenes/Scenes";
import {
  DESIGN,
  SFX,
  SHOTS,
  VOICEOVER_ON,
  VOICE_TRACK,
  VIDEO,
  VOICE_LINES,
  shotLength,
} from "./tokens";

export type MainProps = {
  debug: boolean;
};

const Before: React.FC = () => <BeforeWorld frame={useGlobalFrame("before")} />;
const Discovery: React.FC = () => {
  const frame = useGlobalFrame("discovery");
  return (
    <Push
      frame={frame}
      at={SHOTS.discovery.from}
      outgoing={<BeforeWorld frame={frame} />}
    >
      <DiscoveryWorld frame={frame} />
    </Push>
  );
};
const Scheduling: React.FC = () => (
  <SchedulingWorld frame={useGlobalFrame("scheduling")} />
);

// Instagram continues in the same phone; the screens push inside it.
const Instagram: React.FC = () => (
  <SchedulingWorld frame={useGlobalFrame("instagram")} />
);
const Result: React.FC = () => {
  const frame = useGlobalFrame("result");
  return (
    <Push
      frame={frame}
      at={SHOTS.result.from}
      outgoing={<SchedulingWorld frame={frame} />}
    >
      <ResultWorld frame={frame} />
    </Push>
  );
};
const Close: React.FC = () => {
  const frame = useGlobalFrame("close");
  return (
    <Push
      frame={frame}
      at={SHOTS.close.from}
      outgoing={<ResultWorld frame={frame} />}
    >
      <CloseWorld frame={frame} />
    </Push>
  );
};

export const Main: React.FC<MainProps> = ({ debug }) => {
  return (
    <AbsoluteFill style={{ background: DESIGN.stripeA }}>
      <Series>
        <Series.Sequence
          name={SHOTS.before.name}
          durationInFrames={shotLength("before")}
        >
          <Before />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.discovery.name}
          durationInFrames={shotLength("discovery")}
        >
          <Discovery />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.scheduling.name}
          durationInFrames={shotLength("scheduling")}
        >
          <Scheduling />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.instagram.name}
          durationInFrames={shotLength("instagram")}
        >
          <Instagram />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.result.name}
          durationInFrames={shotLength("result")}
        >
          <Result />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.close.name}
          durationInFrames={shotLength("close")}
        >
          <Close />
        </Series.Sequence>
      </Series>
      {VOICEOVER_ON
        ? VOICE_LINES.map((v) => (
            <Sequence
              key={v.id}
              name={`VO ${v.id}`}
              from={v.from}
              durationInFrames={v.frames}
            >
              <Audio src={staticFile(`voiceover/${v.id}.wav`)} />
            </Sequence>
          ))
        : null}
      {VOICE_TRACK.chunks.map((c) => (
        <Sequence
          key={c.from}
          name={`Voice ${c.start}s`}
          from={c.from}
          durationInFrames={Math.ceil((c.end - c.start) * VIDEO.fps)}
        >
          <Audio
            src={staticFile(VOICE_TRACK.file)}
            trimBefore={Math.round(c.start * VIDEO.fps)}
          />
        </Sequence>
      ))}
      {SFX.map((s, i) => (
        <Sequence
          key={`${s.file}${i}`}
          name={`SFX ${s.file}`}
          from={s.from}
          durationInFrames={s.frames}
        >
          <Audio src={staticFile(s.file)} volume={s.volume} />
        </Sequence>
      ))}
      {debug ? <DebugOverlay /> : null}
    </AbsoluteFill>
  );
};
