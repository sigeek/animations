import React from "react";
import { FONT_FAMILY } from "../../fonts";
import { ShadedCircle, lightOf, shadeOf } from "../../shading";
import { ACCENTS, BUS100, COLORS, FONT, SHADE } from "../../tokens";

// Route number on an ink display.
const Display: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  text: string;
}> = ({ x, y, w, h, fontSize, text }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={COLORS.ink} />
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

// Yellow double-decker, side view, facing left: roof band, upper-deck
// windows (Clawd's seat at the front), front windscreen, headlight, mirror,
// route displays, door pair behind the front axle, wheel arches, skirt.
export const Bus100: React.FC<{
  frontX: number;
  passenger?: React.ReactNode;
}> = ({ frontX, passenger }) => {
  const b = BUS100;
  const upper: number[] = [];
  for (
    let x = b.frontWindow.offsetX + b.frontWindow.w + b.windowGap;
    x < b.length;
    x += b.windowW + b.windowGap
  )
    upper.push(x);
  const lower: number[] = [];
  for (let x = b.lowerWindowsFrom; x < b.length; x += b.windowW + b.windowGap)
    lower.push(x);
  const leafW = (b.door.w - b.door.seam) / 2;
  return (
    <g>
      <rect
        x={frontX}
        y={b.top}
        width={b.length}
        height={b.bottom - b.top}
        rx={b.noseRadius}
        fill={ACCENTS.yellow}
      />
      <rect
        x={frontX + b.noseRadius}
        y={b.top}
        width={b.length - b.noseRadius}
        height={b.roofH}
        fill={ACCENTS.yellowDark}
      />
      <rect
        x={frontX + b.noseRadius}
        y={b.top + b.roofH}
        width={b.length - b.noseRadius}
        height={SHADE.vehicleTop}
        fill={lightOf(ACCENTS.yellow)}
      />
      <rect
        x={frontX}
        y={b.bottom - b.skirtH - SHADE.vehicleBottom}
        width={b.length}
        height={SHADE.vehicleBottom}
        fill={shadeOf(ACCENTS.yellow)}
      />
      <rect
        x={frontX}
        y={b.bottom - b.skirtH}
        width={b.length}
        height={b.skirtH}
        fill={COLORS.shadow}
      />
      {b.wheels.offsets.map((o) => (
        <circle
          key={`a${o}`}
          cx={frontX + o}
          cy={b.wheels.cy}
          r={b.archR}
          fill={ACCENTS.yellowDark}
        />
      ))}
      <rect
        x={frontX + b.frontWindow.offsetX}
        y={b.upperWindows.top}
        width={b.frontWindow.w}
        height={b.upperWindows.bottom - b.upperWindows.top}
        fill={COLORS.ink}
      />
      {upper.map((x) => (
        <rect
          key={`u${x}`}
          x={frontX + x}
          y={b.upperWindows.top}
          width={b.windowW}
          height={b.upperWindows.bottom - b.upperWindows.top}
          fill={COLORS.ink}
        />
      ))}
      {lower.map((x) => (
        <rect
          key={`l${x}`}
          x={frontX + x}
          y={b.lowerWindows.top}
          width={b.windowW}
          height={b.lowerWindows.bottom - b.lowerWindows.top}
          fill={COLORS.ink}
        />
      ))}
      <rect
        x={frontX + b.lowerWindscreen.offsetX}
        y={b.lowerWindscreen.top}
        width={b.lowerWindscreen.w}
        height={b.lowerWindscreen.bottom - b.lowerWindscreen.top}
        fill={COLORS.ink}
      />
      {[0, 1].map((i) => {
        const x = frontX + b.door.offsetX + i * (leafW + b.door.seam);
        return (
          <g key={i}>
            <rect
              x={x}
              y={b.door.top}
              width={leafW}
              height={b.bottom - b.skirtH - b.door.top}
              fill={COLORS.ink}
            />
            <rect
              x={x + b.door.inset / 2}
              y={b.door.top + b.door.inset}
              width={leafW - b.door.inset}
              height={b.lowerWindows.bottom - b.door.top - b.door.inset}
              fill={COLORS.shadow}
            />
          </g>
        );
      })}
      <Display
        x={frontX + b.destination.offsetX}
        y={b.destination.y}
        w={b.destination.w}
        h={b.destination.h}
        fontSize={b.destination.fontSize}
        text={b.destination.text}
      />
      <Display
        x={frontX + b.sideDisplay.offsetX}
        y={b.sideDisplay.y}
        w={b.sideDisplay.w}
        h={b.sideDisplay.h}
        fontSize={b.sideDisplay.fontSize}
        text={b.sideDisplay.text}
      />
      <circle
        cx={frontX + b.headlight.offsetX}
        cy={b.headlight.y}
        r={b.headlight.r}
        fill={COLORS.paper}
      />
      <rect
        x={frontX - b.mirror.armW}
        y={b.mirror.y}
        width={b.mirror.armW}
        height={b.mirror.armH}
        fill={COLORS.ink}
      />
      <rect
        x={frontX - b.mirror.armW - b.mirror.w}
        y={b.mirror.y}
        width={b.mirror.w}
        height={b.mirror.h}
        fill={COLORS.ink}
      />
      {b.wheels.offsets.map((o) => (
        <g key={o}>
          <circle
            cx={frontX + o}
            cy={b.wheels.cy}
            r={b.wheels.r}
            fill={COLORS.ink}
          />
          <ShadedCircle
            cx={frontX + o}
            cy={b.wheels.cy}
            r={b.wheels.hubR}
            fill={COLORS.stone}
          />
        </g>
      ))}
      {passenger}
    </g>
  );
};
