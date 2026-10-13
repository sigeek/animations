import React from "react";
import { FONT_FAMILY } from "../fonts";
import { COLORS, FONT } from "../tokens";

type Props = {
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  fontSize: number;
  text: string;
};

// Plain rounded rectangle with the line name in white bold sans.
export const LineBadge: React.FC<Props> = ({
  x,
  y,
  w,
  h,
  radius,
  fontSize,
  text,
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={radius} fill={COLORS.ink} />
    <text
      x={x + w / 2}
      y={y + h / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fill={COLORS.badgeText}
      fontFamily={FONT_FAMILY}
      fontWeight={FONT.weight}
      fontSize={fontSize}
    >
      {text}
    </text>
  </g>
);
