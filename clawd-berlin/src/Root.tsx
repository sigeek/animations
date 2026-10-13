import React from "react";
import { Composition, Folder } from "remotion";
import { ClawdBerlin } from "./ClawdBerlin";
import { ClawdPoses } from "./ClawdPoses";
import { POSE_SHEET, VIDEO } from "./tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClawdBerlin"
        component={ClawdBerlin}
        durationInFrames={VIDEO.durationInFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ debug: true }}
      />
      <Folder name="Review">
        <Composition
          id={POSE_SHEET.id}
          component={ClawdPoses}
          durationInFrames={POSE_SHEET.durationInFrames}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
        />
      </Folder>
    </>
  );
};
