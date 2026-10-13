import React from "react";
import { Composition } from "remotion";
import { Folder } from "remotion"; // clawd-only
import { ClawdPoses } from "./ClawdPoses"; // clawd-only
import { Main } from "./Main";
import { VIDEO } from "./tokens";
import { POSE_SHEET } from "./tokens"; // clawd-only

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
      <Folder name="Review"> {/* clawd-only */}
        <Composition id={POSE_SHEET.id} component={ClawdPoses} durationInFrames={POSE_SHEET.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} /> {/* clawd-only */}
      </Folder> {/* clawd-only */}
    </>
  );
};
