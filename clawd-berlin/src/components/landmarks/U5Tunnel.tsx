import React from "react";
import { lightOf, shadeOf } from "../../shading";
import { ACCENTS, COLORS, SHADE, U5, VIDEO } from "../../tokens";
import { LineBadge } from "../LineBadge";
import { repeatStarts } from "../street/repeat";

// Dark tunnel wall with ribs and lights passing at constant speed.
export const Tunnel: React.FC<{ offset: number }> = ({ offset }) => (
  <g>
    <rect
      x={0}
      y={0}
      width={VIDEO.width}
      height={VIDEO.height}
      fill={COLORS.ink}
    />
    {repeatStarts(offset, U5.ribs.spacing).map((x) => (
      <rect
        key={`r${x}`}
        x={x}
        y={0}
        width={U5.ribs.w}
        height={VIDEO.height}
        fill={ACCENTS.desk}
      />
    ))}
    {repeatStarts(offset, U5.lights.spacing).map((x) => (
      <rect
        key={`l${x}`}
        x={x}
        y={U5.lights.y}
        width={U5.lights.w}
        height={U5.lights.h}
        fill={COLORS.paper}
      />
    ))}
  </g>
);

// The all-yellow U5 car filling the frame: roof, framed lit windows (seat
// backs and a grab pole in the empty one), sliding door pairs, dark
// underframe with bogies.
export const U5Car: React.FC = () => {
  const c = U5.car;
  const winH = c.windowBottom - c.windowTop;
  return (
    <g>
      <rect
        x={0}
        y={c.top}
        width={VIDEO.width}
        height={c.underframe.top - c.top}
        fill={ACCENTS.yellow}
      />
      <rect
        x={0}
        y={c.top}
        width={VIDEO.width}
        height={c.roofH}
        fill={COLORS.shadow}
      />
      <rect
        x={0}
        y={c.top + c.roofH}
        width={VIDEO.width}
        height={SHADE.vehicleTop}
        fill={lightOf(ACCENTS.yellow)}
      />
      <rect
        x={0}
        y={c.underframe.top - SHADE.vehicleBottom}
        width={VIDEO.width}
        height={SHADE.vehicleBottom}
        fill={shadeOf(ACCENTS.yellow)}
      />
      <rect
        x={0}
        y={c.underframe.top}
        width={VIDEO.width}
        height={c.bottom - c.underframe.top}
        fill={COLORS.ink}
      />
      {c.bogies.xs.map((x) => (
        <circle
          key={x}
          cx={x}
          cy={c.bottom}
          r={c.bogies.r}
          fill={ACCENTS.desk}
        />
      ))}
      {c.windows.map((w, i) => (
        <g key={w.x}>
          <rect
            x={w.x - c.frame}
            y={c.windowTop - c.frame}
            width={w.w + 2 * c.frame}
            height={winH + 2 * c.frame}
            fill={ACCENTS.yellowDark}
          />
          <rect
            x={w.x}
            y={c.windowTop}
            width={w.w}
            height={winH}
            fill={COLORS.paper}
          />
          {i > 0 ? (
            <g>
              <rect
                x={w.x}
                y={c.windowBottom - c.seatH}
                width={w.w}
                height={c.seatH}
                fill={COLORS.stone}
              />
              <rect
                x={w.x + w.w * c.pole.at}
                y={c.windowTop}
                width={c.pole.w}
                height={winH}
                fill={COLORS.ink}
              />
            </g>
          ) : null}
        </g>
      ))}
      {c.doors.map((d) => {
        const leafW = (d.w - c.seam) / 2;
        return (
          <g key={d.x}>
            <rect
              x={d.x - c.frame}
              y={c.windowTop - c.frame}
              width={d.w + 2 * c.frame}
              height={c.underframe.top - c.windowTop + c.frame}
              fill={COLORS.ink}
            />
            {[d.x, d.x + leafW + c.seam].map((lx) => (
              <g key={lx}>
                <rect
                  x={lx}
                  y={c.windowTop - c.frame}
                  width={leafW}
                  height={c.underframe.top - c.windowTop + c.frame}
                  fill={ACCENTS.yellowDark}
                />
                <rect
                  x={lx + leafW * (1 - SHADE.doorSide)}
                  y={c.windowTop - c.frame}
                  width={leafW * SHADE.doorSide}
                  height={c.underframe.top - c.windowTop + c.frame}
                  fill={shadeOf(ACCENTS.yellowDark)}
                />
                <rect
                  x={lx + c.doorInset}
                  y={c.windowTop}
                  width={leafW - 2 * c.doorInset}
                  height={winH}
                  fill={COLORS.paper}
                />
              </g>
            ))}
          </g>
        );
      })}
      <LineBadge
        x={c.badge.x}
        y={c.badge.y}
        w={c.badge.w}
        h={c.badge.h}
        radius={c.badge.radius}
        fontSize={c.badge.fontSize}
        text={c.badge.text}
      />
    </g>
  );
};
