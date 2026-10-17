import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Caption } from "./components/Caption";
import { CafeBack, CafeCounter } from "./components/Cafe";
import { DebugOverlay } from "./components/DebugOverlay";
import { Marcello } from "./components/Marcello";
import { Phone } from "./components/Phone";
import { Push } from "./components/Push";
import { ReviewCard } from "./components/ReviewCard";
import { FONT_FAMILY } from "./fonts";
import { springAt, useGlobalFrame } from "./motion";
import {
  APP,
  END,
  FONT,
  MARCELLO,
  REVIEW_POP,
  SHOTS,
  SPRING,
  VIDEO,
  VOICEOVER,
  shotLength,
} from "./tokens";

export type MainProps = {
  debug: boolean;
};

// Shot 1: Marcello behind his counter; at 58 his phone buzzes and the
// 1-star review pops up; from 60 he looks at it.
export const CafeWorld: React.FC<{ frame: number }> = ({ frame }) => {
  const r = REVIEW_POP;
  const pop = springAt(frame, r.at, SPRING.clawdRatio, r.springFrames);
  const shaking = frame >= r.at && frame < r.at + r.shake.frames;
  const shake = shaking ? (frame % 2 === 0 ? r.shake.px : -r.shake.px) : 0;
  const ox = MARCELLO.x + MARCELLO.phone.dx * MARCELLO.cafeScale;
  const oy = MARCELLO.y + MARCELLO.phone.dy * MARCELLO.cafeScale;
  return (
    <AbsoluteFill>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <CafeBack />
        <Marcello
          x={MARCELLO.x}
          y={MARCELLO.y}
          scale={MARCELLO.cafeScale}
          pose={frame >= r.lookFrom ? "phone" : "neutral"}
          phoneShake={shake}
        />
        <CafeCounter />
        {frame >= r.at ? (
          <g
            transform={`translate(${ox} ${oy}) scale(${pop}) translate(${-ox} ${-oy})`}
          >
            <ReviewCard />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

// Shot 2: the real app in a phone.
export const AppWorld: React.FC<{ frame: number }> = ({ frame }) => (
  <Phone frame={frame} />
);

// Shot 3: Pomelo blue, the line, the URL, Marcello smiling.
export const EndWorld: React.FC = () => (
  <AbsoluteFill style={{ background: APP.blue }}>
    <div
      style={{
        position: "absolute",
        left: (VIDEO.width - END.maxW) / 2,
        top: END.textY,
        width: END.maxW,
        fontFamily: FONT_FAMILY,
        fontWeight: FONT.weight,
        fontSize: END.fontSize,
        lineHeight: `${END.lineHeight}px`,
        color: APP.white,
      }}
    >
      {END.text}
    </div>
    <div
      style={{
        position: "absolute",
        left: (VIDEO.width - END.maxW) / 2,
        top: END.urlY,
        fontFamily: FONT_FAMILY,
        fontWeight: FONT.weight,
        fontSize: END.urlSize,
        color: APP.blueSoft,
      }}
    >
      {APP.url}
    </div>
    <svg
      width={VIDEO.width}
      height={VIDEO.height}
      style={{ position: "absolute", inset: 0 }}
    >
      <Marcello
        x={END.marcello.x}
        y={END.marcello.y}
        pose="smile"
        scale={END.marcello.scale}
      />
    </svg>
  </AbsoluteFill>
);

const Cafe: React.FC = () => <CafeWorld frame={useGlobalFrame("cafe")} />;
const App: React.FC = () => {
  const frame = useGlobalFrame("app");
  return (
    <Push
      frame={frame}
      at={SHOTS.app.from}
      outgoing={<CafeWorld frame={frame} />}
    >
      <AppWorld frame={frame} />
    </Push>
  );
};
const End: React.FC = () => {
  const frame = useGlobalFrame("end");
  return (
    <Push
      frame={frame}
      at={SHOTS.end.from}
      outgoing={<AppWorld frame={frame} />}
    >
      <EndWorld />
    </Push>
  );
};

// Outside the Series, the composition frame is the global frame.
const CaptionLayer: React.FC = () => <Caption frame={useCurrentFrame()} />;

export const Main: React.FC<MainProps> = ({ debug }) => {
  return (
    <AbsoluteFill style={{ background: APP.bg }}>
      <Series>
        <Series.Sequence
          name={SHOTS.cafe.name}
          durationInFrames={shotLength("cafe")}
        >
          <Cafe />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.app.name}
          durationInFrames={shotLength("app")}
        >
          <App />
        </Series.Sequence>
        <Series.Sequence
          name={SHOTS.end.name}
          durationInFrames={shotLength("end")}
        >
          <End />
        </Series.Sequence>
      </Series>
      {VOICEOVER.map((v) => (
        <Sequence
          key={v.file}
          name={`VO ${v.file}`}
          from={v.from}
          durationInFrames={v.frames}
        >
          <Audio src={staticFile(v.file)} />
        </Sequence>
      ))}
      <CaptionLayer />
      {debug ? <DebugOverlay /> : null}
    </AbsoluteFill>
  );
};
