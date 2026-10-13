import React from "react";
import { ACCENTS, ALEX, COLORS } from "../tokens";
import { LineBadge } from "./LineBadge";

type Props = {
  frontX: number;
  doorOpen: number; // 0 closed → 1 open
  // Drawn inside the doorway, behind the door leaves.
  passenger?: React.ReactNode;
};

// S3 train, side view: dark red lower body, ochre upper band. Its wheels sit
// below the platform edge, which covers them.
export const SBahnTrain: React.FC<Props> = ({ frontX, doorOpen, passenger }) => {
  const t = ALEX.train;
  const d = t.door;
  const doorX = frontX + d.offsetX;
  const leafW = (d.w - d.seam) / 2;
  const slide = leafW * doorOpen;
  const leaf = (x: number, key: string) => (
    <g key={key}>
      <rect x={x} y={d.top} width={leafW} height={t.bandBottom - d.top} fill={ACCENTS.s3Ochre} />
      <rect x={x} y={t.bandBottom} width={leafW} height={t.bottom - t.bandBottom} fill={ACCENTS.s3Red} />
      <rect
        x={x + d.windowInset}
        y={d.windowTop}
        width={leafW - 2 * d.windowInset}
        height={d.windowBottom - d.windowTop}
        fill={COLORS.ink}
      />
    </g>
  );
  return (
    <g>
      <rect x={frontX} y={t.top} width={t.length} height={t.bottom - t.top} rx={t.noseRadius} fill={ACCENTS.s3Red} />
      <rect x={frontX + t.noseRadius} y={t.top} width={t.length - t.noseRadius} height={t.bandBottom - t.top} fill={ACCENTS.s3Ochre} />
      <path
        d={`M ${frontX} ${t.bandBottom} V ${t.top + t.noseRadius} Q ${frontX} ${t.top} ${frontX + t.noseRadius} ${t.top} V ${t.bandBottom} Z`}
        fill={ACCENTS.s3Ochre}
      />
      <rect
        x={frontX + t.cabWindow.offsetX}
        y={t.windows.top}
        width={t.cabWindow.w}
        height={t.windows.bottom - t.windows.top}
        fill={COLORS.ink}
      />
      {Array.from({ length: t.windows.count }, (_, i) => (
        <rect
          key={i}
          x={frontX + t.windows.firstOffsetX + i * (t.windows.w + t.windows.gap)}
          y={t.windows.top}
          width={t.windows.w}
          height={t.windows.bottom - t.windows.top}
          fill={COLORS.ink}
        />
      ))}
      <LineBadge
        x={frontX + t.badge.offsetX}
        y={t.badge.y}
        w={t.badge.w}
        h={t.badge.h}
        radius={t.badge.radius}
        fontSize={t.badge.fontSize}
        text={t.badge.text}
      />
      <rect x={doorX} y={d.top} width={d.w} height={t.bottom - d.top} fill={COLORS.ink} />
      {passenger}
      {leaf(doorX - slide, "left")}
      {leaf(doorX + leafW + d.seam + slide, "right")}
    </g>
  );
};
