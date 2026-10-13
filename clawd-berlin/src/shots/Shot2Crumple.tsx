import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperSheet } from "../components/PaperSheet";
import { crumpleMesh } from "../components/paperGeometry";
import { ACCENTS, CENTER, CRUMPLE, EASE, SPRING, TITLE } from "../tokens";
import { lerp, ramp, springAt, useGlobalFrame } from "../motion";
import { TitleContent } from "./Shot1Title";

// Shot 2, 45–60: the title fades off by 50 and the plain sheet contracts into
// a ball by 58 while rotating +25°, then squashes and springs back.
export const Shot2Crumple: React.FC = () => {
  const frame = useGlobalFrame("crumple");
  const t = ramp(frame, CRUMPLE.contract.from, CRUMPLE.contract.to, EASE.inCubic);
  const { squash } = CRUMPLE;
  const back = springAt(frame, squash.from, SPRING.clawdRatio, squash.to - squash.from + 1);
  const squashed = frame >= squash.from;
  return (
    <AbsoluteFill style={{ background: ACCENTS.desk }}>
      <PaperSheet
        mesh={crumpleMesh(t)}
        rotateDeg={TITLE.paper.rotateDeg + CRUMPLE.rotateByDeg * t}
        contentSize={TITLE.paper.size}
        contentScale={lerp(1, CRUMPLE.ballDiameter / TITLE.paper.size, t)}
        wrinkles={t}
        squash={{
          scaleX: squashed ? lerp(squash.scaleX, 1, back) : 1,
          scaleY: squashed ? lerp(squash.scaleY, 1, back) : 1,
          originY: CENTER.y + CRUMPLE.ballDiameter / 2,
        }}
      >
        <div style={{ opacity: 1 - ramp(frame, CRUMPLE.printFade.from, CRUMPLE.printFade.to, EASE.inCubic) }}>
          <TitleContent frame={frame} />
        </div>
      </PaperSheet>
    </AbsoluteFill>
  );
};
