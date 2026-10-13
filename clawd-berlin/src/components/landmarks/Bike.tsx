import React from "react";
import { lightOf, shadeOf, ShadedCircle } from "../../shading";
import { BIKE, COLORS, SHADE, SHAPES } from "../../tokens";

const b = BIKE;

// Saddle top, where Clawd sits.
export const bikeSaddleY = () => b.groundY - b.wheelR - b.seatH;
export const bikeSaddleX = (x: number) =>
  x - b.wheelBase * SHAPES.bike.seatBack;

type P = { x: number; y: number };

// A frame tube with flat shading: the tube color, a thinner shaded strip
// offset to the lower right.
const Tube: React.FC<{ a: P; b: P; color: string; w: number }> = ({
  a,
  b: e,
  color,
  w,
}) => {
  const o = w * SHADE.crescent;
  return (
    <g>
      <line
        x1={a.x}
        y1={a.y}
        x2={e.x}
        y2={e.y}
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
      />
      <line
        x1={a.x + o}
        y1={a.y + o}
        x2={e.x + o}
        y2={e.y + o}
        stroke={shadeOf(color)}
        strokeWidth={w * SHADE.side}
        strokeLinecap="round"
      />
    </g>
  );
};

// Arc path around (cx, cy) between two angles in degrees (SVG: clockwise from +x).
const arc = (cx: number, cy: number, r: number, from: number, to: number) => {
  const p = (deg: number) => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy + r * Math.sin((deg * Math.PI) / 180),
  });
  const s = p(from);
  const e = p(to);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`;
};

const Wheel: React.FC<{ cx: number; cy: number; angleDeg: number }> = ({
  cx,
  cy,
  angleDeg,
}) => (
  <g>
    <path
      d={arc(cx, cy, b.wheelR + b.fender.gap, b.fender.from, b.fender.to)}
      fill="none"
      stroke={b.fender.color}
      strokeWidth={b.fender.w}
      strokeLinecap="round"
    />
    <circle
      cx={cx}
      cy={cy}
      r={b.wheelR}
      fill="none"
      stroke={COLORS.ink}
      strokeWidth={b.tyreW}
    />
    <circle
      cx={cx}
      cy={cy}
      r={b.wheelR - b.rim.inset}
      fill="none"
      stroke={COLORS.stone}
      strokeWidth={b.rim.w}
    />
    {Array.from({ length: b.spokes / 2 }, (_, i) => {
      const a = ((angleDeg + (i * 360) / b.spokes) * Math.PI) / 180;
      const r = b.wheelR - b.rim.inset;
      return (
        <line
          key={i}
          x1={cx - Math.cos(a) * r}
          y1={cy - Math.sin(a) * r}
          x2={cx + Math.cos(a) * r}
          y2={cy + Math.sin(a) * r}
          stroke={COLORS.ink}
          strokeWidth={b.spokeW}
        />
      );
    })}
    <ShadedCircle cx={cx} cy={cy} r={b.hubR} fill={COLORS.stone} />
  </g>
);

// Berlin city bike: spoked wheels with cream fenders, teal triangle frame,
// chain and turning crank, sprung saddle, curved handlebar with grip,
// headlamp, wicker basket on a front rack. `x` is the bottom bracket;
// `angleDeg` turns the wheels.
export const Bike: React.FC<{ x: number; angleDeg: number }> = ({
  x,
  angleDeg,
}) => {
  const g = SHAPES.bike;
  const cy = b.groundY - b.wheelR;
  const rear = { x: x - b.wheelBase / 2, y: cy };
  const front = { x: x + b.wheelBase / 2, y: cy };
  const bb = { x, y: cy + b.bracketDrop };
  const seat = { x: bikeSaddleX(x), y: cy - b.seatH };
  const head = {
    x: front.x - b.wheelBase * g.headBack,
    y: cy - b.seatH * g.headDrop,
  };
  const stemTop = { x: head.x, y: head.y - b.seatH * g.stemRise };
  const h = b.handlebar;
  const crankA = (angleDeg * b.crank.ratio * Math.PI) / 180;
  const pedal = {
    x: bb.x + Math.cos(crankA) * b.crank.len,
    y: bb.y + Math.sin(crankA) * b.crank.len,
  };
  const frame = b.frameColor;
  const rackY = head.y - b.rack.rise;
  const basketLeft = head.x + (b.rack.w - b.basket.w) / 2; // centred on the rack
  return (
    <g>
      <Wheel cx={rear.x} cy={rear.y} angleDeg={angleDeg} />
      <Wheel cx={front.x} cy={front.y} angleDeg={angleDeg} />
      <line
        x1={bb.x}
        y1={bb.y - b.chainring.r}
        x2={rear.x}
        y2={rear.y - b.cog.r}
        stroke={COLORS.ink}
        strokeWidth={b.chainW}
      />
      <line
        x1={bb.x}
        y1={bb.y + b.chainring.r}
        x2={rear.x}
        y2={rear.y + b.cog.r}
        stroke={COLORS.ink}
        strokeWidth={b.chainW}
      />
      <circle
        cx={rear.x}
        cy={rear.y}
        r={b.cog.r}
        fill="none"
        stroke={COLORS.ink}
        strokeWidth={b.chainW}
      />
      <Tube a={rear} b={seat} color={frame} w={b.tubeW} />
      <Tube a={rear} b={bb} color={frame} w={b.tubeW} />
      <Tube a={bb} b={seat} color={frame} w={b.tubeW} />
      <Tube a={seat} b={head} color={frame} w={b.tubeW} />
      <Tube a={bb} b={head} color={frame} w={b.tubeW} />
      <Tube a={head} b={front} color={frame} w={b.tubeW} />
      <Tube a={head} b={stemTop} color={COLORS.ink} w={b.tubeW / 2} />
      <path
        d={`M ${stemTop.x} ${stemTop.y} Q ${stemTop.x} ${stemTop.y - h.rise / 2} ${stemTop.x - h.back} ${stemTop.y - h.rise / 3}`}
        fill="none"
        stroke={COLORS.ink}
        strokeWidth={b.tubeW / 2}
        strokeLinecap="round"
      />
      <rect
        x={stemTop.x - h.back - h.gripW}
        y={stemTop.y - h.rise / 3 - h.gripH / 2}
        width={h.gripW}
        height={h.gripH}
        rx={h.gripH / 2}
        fill={COLORS.ink}
      />
      <ShadedCircle
        cx={head.x + b.headlamp.r}
        cy={head.y + b.headlamp.drop}
        r={b.headlamp.r}
        fill={COLORS.paper}
      />
      <rect
        x={head.x}
        y={rackY}
        width={b.rack.w}
        height={b.rack.h}
        fill={COLORS.ink}
      />
      <rect
        x={basketLeft}
        y={rackY - b.basket.h}
        width={b.basket.w}
        height={b.basket.h}
        fill={b.basket.color}
      />
      {Array.from({ length: b.basket.weave }, (_, i) => (
        <rect
          key={i}
          x={basketLeft}
          y={rackY - b.basket.h + ((i + 1) * b.basket.h) / (b.basket.weave + 1)}
          width={b.basket.w}
          height={b.basket.weaveW}
          fill={shadeOf(b.basket.color)}
        />
      ))}
      <rect
        x={basketLeft}
        y={rackY - b.basket.h}
        width={b.basket.w}
        height={b.basket.weaveW}
        fill={lightOf(b.basket.color)}
      />
      <rect
        x={basketLeft + b.basket.w * (1 - SHADE.side)}
        y={rackY - b.basket.h}
        width={b.basket.w * SHADE.side}
        height={b.basket.h}
        fill={shadeOf(b.basket.color)}
      />
      <polygon
        points={b.saddle
          .map(([dx, dy]) => `${seat.x + dx},${seat.y + dy}`)
          .join(" ")}
        fill={COLORS.ink}
      />
      <ShadedCircle cx={bb.x} cy={bb.y} r={b.chainring.r} fill={COLORS.stone} />
      <Tube a={bb} b={pedal} color={COLORS.ink} w={b.crank.w} />
      <rect
        x={pedal.x - b.pedal.w / 2}
        y={pedal.y - b.pedal.h / 2}
        width={b.pedal.w}
        height={b.pedal.h}
        fill={COLORS.ink}
      />
    </g>
  );
};
