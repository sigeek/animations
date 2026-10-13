import React from "react";
import { FONT_FAMILY } from "../fonts";
import { lightOf, shadeOf } from "../shading";
import { ACCENTS, ALEX, COLORS, FONT, SHADE } from "../tokens";
import { LineBadge } from "./LineBadge";

type Props = {
  frontX: number;
  doorOpen: number; // 0 closed → 1 open (first door only)
  // Drawn inside the first doorway, behind the door leaves.
  passenger?: React.ReactNode;
};

// S3 train, side view: dark red lower body, ochre upper band, grey roof,
// rounded cab with windscreen, destination display and headlight, split
// windows, two sliding doors. The wheels sit below the platform edge.
export const SBahnTrain: React.FC<Props> = ({
  frontX,
  doorOpen,
  passenger,
}) => {
  const t = ALEX.train;
  const d = t.door;
  const leafW = (d.w - d.seam) / 2;
  const leaf = (x: number, key: string) => (
    <g key={key}>
      <rect
        x={x}
        y={d.top}
        width={leafW}
        height={t.bandBottom - d.top}
        fill={ACCENTS.s3Ochre}
      />
      <rect
        x={x}
        y={t.bandBottom}
        width={leafW}
        height={t.bottom - t.bandBottom}
        fill={ACCENTS.s3Red}
      />
      <rect
        x={x}
        y={t.bottom - SHADE.vehicleBottom}
        width={leafW}
        height={SHADE.vehicleBottom}
        fill={shadeOf(ACCENTS.s3Red)}
      />
      <rect
        x={x + leafW * (1 - SHADE.doorSide)}
        y={d.top}
        width={leafW * SHADE.doorSide}
        height={t.bandBottom - d.top}
        fill={shadeOf(ACCENTS.s3Ochre)}
      />
      <rect
        x={x + leafW * (1 - SHADE.doorSide)}
        y={t.bandBottom}
        width={leafW * SHADE.doorSide}
        height={t.bottom - t.bandBottom}
        fill={shadeOf(ACCENTS.s3Red)}
      />
      <rect
        x={x + d.windowInset}
        y={d.windowTop}
        width={leafW - 2 * d.windowInset}
        height={d.windowBottom - d.windowTop}
        fill={COLORS.ink}
      />
    </g>
  );
  const doorway = (
    offsetX: number,
    open: number,
    inside: React.ReactNode,
    key: string,
  ) => {
    const x = frontX + offsetX;
    const slide = leafW * open;
    return (
      <g key={key}>
        <rect
          x={x}
          y={d.top}
          width={d.w}
          height={t.bottom - d.top}
          fill={COLORS.ink}
        />
        {inside}
        {leaf(x - slide, `${key}l`)}
        {leaf(x + leafW + d.seam + slide, `${key}r`)}
      </g>
    );
  };
  const w = t.windows;
  return (
    <g>
      <rect
        x={frontX}
        y={t.top}
        width={t.length}
        height={t.bottom - t.top}
        rx={t.noseRadius}
        fill={ACCENTS.s3Red}
      />
      <rect
        x={frontX + t.noseRadius}
        y={t.top}
        width={t.length - t.noseRadius}
        height={t.bandBottom - t.top}
        fill={ACCENTS.s3Ochre}
      />
      <path
        d={`M ${frontX} ${t.bandBottom} V ${t.top + t.noseRadius} Q ${frontX} ${t.top} ${frontX + t.noseRadius} ${t.top} V ${t.bandBottom} Z`}
        fill={ACCENTS.s3Ochre}
      />
      <rect
        x={frontX + t.noseRadius}
        y={t.top}
        width={t.length - t.noseRadius}
        height={t.roofH}
        fill={COLORS.shadow}
      />
      <rect
        x={frontX + t.noseRadius}
        y={t.top + t.roofH}
        width={t.length - t.noseRadius}
        height={SHADE.vehicleTop}
        fill={lightOf(ACCENTS.s3Ochre)}
      />
      <rect
        x={frontX}
        y={t.bottom - SHADE.vehicleBottom}
        width={t.length}
        height={SHADE.vehicleBottom}
        fill={shadeOf(ACCENTS.s3Red)}
      />
      <rect
        x={frontX + t.windscreen.offsetX}
        y={t.windscreen.top}
        width={t.windscreen.w}
        height={t.windscreen.bottom - t.windscreen.top}
        fill={COLORS.ink}
      />
      <rect
        x={frontX + t.destination.offsetX}
        y={t.destination.top}
        width={t.destination.w}
        height={t.destination.h}
        fill={COLORS.ink}
      />
      <text
        x={frontX + t.destination.offsetX + t.destination.w / 2}
        y={t.destination.top + t.destination.h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={ACCENTS.s3Ochre}
        fontFamily={FONT_FAMILY}
        fontWeight={FONT.weight}
        fontSize={t.destination.fontSize}
      >
        {t.destination.text}
      </text>
      <circle
        cx={frontX + t.headlight.offsetX}
        cy={t.headlight.y}
        r={t.headlight.r}
        fill={COLORS.paper}
      />
      {w.offsets.map((o) => (
        <g key={o}>
          <rect
            x={frontX + o}
            y={w.top}
            width={w.w}
            height={w.bottom - w.top}
            fill={COLORS.ink}
          />
          <rect
            x={frontX + o + (w.w - w.mullion) / 2}
            y={w.top}
            width={w.mullion}
            height={w.bottom - w.top}
            fill={ACCENTS.s3Ochre}
          />
        </g>
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
      {doorway(d.offsetX, doorOpen, passenger, "door1")}
      {doorway(t.secondDoorOffsetX, 0, null, "door2")}
    </g>
  );
};
