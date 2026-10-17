import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_FAMILY } from "../fonts";
import { CAPTION, COLORS, FONT, VIDEO, VOICEOVER } from "../tokens";

// The voiceover line that is playing, as an ink pill near the bottom.
export const Caption: React.FC<{ frame: number }> = ({ frame }) => {
  const line = VOICEOVER.slice(0, CAPTION.upTo).find(
    (v) => frame >= v.from && frame < v.from + v.frames,
  );
  if (!line) return null;
  const c = CAPTION;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (VIDEO.width - c.maxW) / 2,
          top: c.y,
          width: c.maxW,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: COLORS.ink,
            color: COLORS.paper,
            borderRadius: c.radius,
            padding: `${c.padY}px ${c.padX}px`,
            fontFamily: FONT_FAMILY,
            fontWeight: FONT.weight,
            fontSize: c.fontSize,
            lineHeight: `${c.lineHeight}px`,
            textAlign: "center",
          }}
        >
          {line.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
