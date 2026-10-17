import React from "react";
import { AbsoluteFill } from "remotion";
import { DISPLAY_FONT } from "../fonts";
import { CAPTION, DESIGN, VIDEO, VOICE_LINES } from "../tokens";

// The line being spoken, as a brown pill near the bottom.
export const Caption: React.FC<{ frame: number }> = ({ frame }) => {
  const line = VOICE_LINES.find(
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
            background: DESIGN.line,
            color: DESIGN.cream,
            borderRadius: c.radius,
            padding: `${c.padY}px ${c.padX}px`,
            fontFamily: DISPLAY_FONT,
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
