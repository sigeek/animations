import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperSheet } from "../components/PaperSheet";
import { unfoldMesh } from "../components/paperGeometry";
import { ACCENTS, CRUMPLE, EASE, SHOTS, TITLE, UNFOLD, VIDEO } from "../tokens";
import { lerp, ramp, useGlobalFrame } from "../motion";
import { AlexanderplatzWorld } from "./Shot4Alexanderplatz";

// Shot 3, 61–80: the ball unfolds to full bleed with shot 4's first frame
// inside; the paper fades off 61–74 so the station shows through. At 80 the
// frame matches 81, so the cut is seamless.
export const Shot3Unfold: React.FC = () => {
  const frame = useGlobalFrame("unfold");
  const t = ramp(frame, UNFOLD.expand.from, UNFOLD.expand.to, EASE.outQuint);
  const startRotate = TITLE.paper.rotateDeg + CRUMPLE.rotateByDeg;
  return (
    <AbsoluteFill style={{ background: ACCENTS.desk }}>
      <PaperSheet
        mesh={unfoldMesh(t)}
        rotateDeg={lerp(startRotate, 0, t)}
        contentSize={VIDEO.width}
        contentScale={lerp(CRUMPLE.ballDiameter / VIDEO.width, 1, t)}
        wrinkles={lerp(1, UNFOLD.wrinkleResidual, t)}
        paperOpacity={1 - ramp(frame, UNFOLD.paperFade.from, UNFOLD.paperFade.to, EASE.inOutQuad)}
        beneath={<AlexanderplatzWorld frame={SHOTS.alexanderplatz.from} />}
      />
    </AbsoluteFill>
  );
};
