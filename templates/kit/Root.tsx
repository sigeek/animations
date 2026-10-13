import React from "react";
import { Composition, Folder } from "remotion";
import { ClawdPoses } from "./ClawdPoses"; // clawd-only
import { Main } from "./Main";
import { POSE_SHEET, VIDEO } from "./tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="__COMP__"
        component={Main}
        durationInFrames={VIDEO.durationInFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ debug: true }}
      />
      <Folder name="Review">
        <Composition id={POSE_SHEET.id} component={ClawdPoses} durationInFrames={POSE_SHEET.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} /> {/* clawd-only */}
      </Folder>
    </>
  );
};
