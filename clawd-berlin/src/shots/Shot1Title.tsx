import React from "react";
import { AbsoluteFill } from "remotion";
import { Clawd } from "../components/Clawd";
import { PaperSheet } from "../components/PaperSheet";
import { crumpleMesh } from "../components/paperGeometry";
import { FONT_FAMILY } from "../fonts";
import { EASE, ACCENTS, COLORS, FONT, SPRING, TITLE } from "../tokens";
import { ramp, springAt, useGlobalFrame } from "../motion";

// What is printed on the sheet. Pure function of the global frame, so the
// crumple can reuse it.
export const TitleContent: React.FC<{ frame: number }> = ({ frame }) => {
  const reveal = ramp(frame, TITLE.reveal.from, TITLE.reveal.to, EASE.outCubic);
  const pop = springAt(frame, TITLE.clawdPop.from, SPRING.defaultRatio, TITLE.clawdPop.frames);
  const { text } = TITLE;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: text.left,
          top: text.top,
          fontFamily: FONT_FAMILY,
          fontWeight: FONT.weight,
          fontSize: text.fontSize,
          lineHeight: `${text.lineHeight}px`,
          letterSpacing: text.letterSpacing,
          color: COLORS.ink,
          clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
        }}
      >
        {text.lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <svg width={TITLE.paper.size} height={TITLE.paper.size} style={{ position: "absolute", inset: 0 }}>
        <Clawd x={TITLE.clawd.x} y={TITLE.clawd.feetY} scaleX={pop} scaleY={pop} />
      </svg>
    </>
  );
};

// Shot 1, 0–44: the sheet on the desk; the title wipes in by frame 6 and holds.
export const Shot1Title: React.FC = () => {
  const frame = useGlobalFrame("title");
  return (
    <AbsoluteFill style={{ background: ACCENTS.desk }}>
      <PaperSheet
        mesh={crumpleMesh(0)}
        rotateDeg={TITLE.paper.rotateDeg}
        contentSize={TITLE.paper.size}
        contentScale={1}
        wrinkles={0}
      >
        <TitleContent frame={frame} />
      </PaperSheet>
    </AbsoluteFill>
  );
};
