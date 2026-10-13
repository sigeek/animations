import React from "react";
import { FONT_FAMILY } from "../fonts";
import { COLORS, FONT, POLE_SIGN, STREET, type SignAnchor } from "../tokens";
import { LineBadge } from "./LineBadge";

type Props = {
  poleX: number;
  panelY: number;
  panelW: number;
  text: string;
  badge?: string; // line badge after the text
  arrow?: boolean; // arrow pointing right, before the text
  anchor?: SignAnchor; // "left": the panel hangs right of the pole
};

// A sign panel on a pole standing on the sidewalk. Paper panel, ink text.
export const PoleSign: React.FC<Props> = ({
  poleX,
  panelY,
  panelW,
  text,
  badge,
  arrow,
  anchor = "center",
}) => {
  const p = POLE_SIGN;
  const left = anchor === "left" ? poleX - p.poleWidth / 2 : poleX - panelW / 2;
  const midY = panelY + p.panelH / 2;
  const arrowSpace = arrow ? p.arrow.w + p.arrow.gap : 0;
  const badgeSpace = badge ? p.badge.w + p.badge.gap : 0;
  const textX =
    left +
    p.padX +
    arrowSpace +
    (panelW - 2 * p.padX - arrowSpace - badgeSpace) / 2;
  const ax = left + p.padX;
  return (
    <g>
      <rect
        x={poleX - p.poleWidth / 2}
        y={panelY}
        width={p.poleWidth}
        height={STREET.feetY - panelY}
        fill={COLORS.ink}
      />
      <rect
        x={left}
        y={panelY}
        width={panelW}
        height={p.panelH}
        fill={COLORS.paper}
      />
      {arrow ? (
        <polygon
          points={`${ax},${midY - p.arrow.h / 6} ${ax + p.arrow.w / 2},${midY - p.arrow.h / 6} ${ax + p.arrow.w / 2},${midY - p.arrow.h / 2} ${ax + p.arrow.w},${midY} ${ax + p.arrow.w / 2},${midY + p.arrow.h / 2} ${ax + p.arrow.w / 2},${midY + p.arrow.h / 6} ${ax},${midY + p.arrow.h / 6}`}
          fill={COLORS.ink}
        />
      ) : null}
      <text
        x={textX}
        y={midY}
        textAnchor="middle"
        dominantBaseline="central"
        fill={COLORS.ink}
        fontFamily={FONT_FAMILY}
        fontWeight={FONT.weight}
        fontSize={p.fontSize}
      >
        {text}
      </text>
      {badge ? (
        <LineBadge
          x={left + panelW - p.padX - p.badge.w}
          y={midY - p.badge.h / 2}
          w={p.badge.w}
          h={p.badge.h}
          radius={p.badge.radius}
          fontSize={p.badge.fontSize}
          text={badge}
        />
      ) : null}
    </g>
  );
};
