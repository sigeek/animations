import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { VIDEO } from "./tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PomeloCocina"
        component={Main}
        durationInFrames={VIDEO.durationInFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ debug: true }}
      />
    </>
  );
};
