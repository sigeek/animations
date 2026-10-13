import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Clawd, type ClawdPose } from "./components/Clawd";
import { walkCycle } from "./components/walkCycle";
import { FONT_FAMILY } from "./fonts";
import { COLORS, FONT, POSE_SHEET, VIDEO } from "./tokens";

// Review sheet: every allowed pose, plus the walk cycle running live.
export const ClawdPoses: React.FC = () => {
  const frame = useCurrentFrame();
  const walk = walkCycle(frame, 0);
  const cells: { label: string; pose: ClawdPose; liftUnits?: number }[] = [
    { label: "stand", pose: "stand" },
    { label: "step A", pose: "stepA" },
    { label: "step B", pose: "stepB" },
    { label: "sit", pose: "sit" },
    { label: "look-up", pose: "lookUp" },
    {
      label: `walk (${walk.pose})`,
      pose: walk.pose,
      liftUnits: walk.liftUnits,
    },
  ];
  const { columns, rowFeetY, labelOffsetY, labelFontSize } = POSE_SHEET;
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <svg width={VIDEO.width} height={VIDEO.height}>
        {cells.map((cell, i) => {
          const x = columns[i % columns.length];
          const y = rowFeetY[Math.floor(i / columns.length)];
          return (
            <g key={cell.label}>
              <Clawd x={x} y={y} pose={cell.pose} liftUnits={cell.liftUnits} />
              <text
                x={x}
                y={y + labelOffsetY}
                textAnchor="middle"
                fill={COLORS.ink}
                fontFamily={FONT_FAMILY}
                fontWeight={FONT.weight}
                fontSize={labelFontSize}
              >
                {cell.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
