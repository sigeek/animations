import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { DAY, SHOTS, VIDEO } from "./tokens";

const frames = DAY.keys.map((k) => k.frame);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Sky color at a global frame.
export const skyAt = (frame: number) =>
  interpolateColors(
    frame,
    frames,
    DAY.keys.map((k) => k.sky),
  );

// Flat sunset bands, drawn over the plain sky from DAY.sunset.from.
export const SunsetBands: React.FC<{ frame: number }> = ({ frame }) => {
  const s = DAY.sunset;
  if (frame < s.from) return null;
  const base = skyAt(s.from);
  return (
    <g>
      {s.bands.map((b, i) => {
        const bottom = i === 0 ? s.horizonY : s.bands[i - 1].top;
        return (
          <rect
            key={b.top}
            x={0}
            y={b.top}
            width={VIDEO.width}
            height={bottom - b.top}
            fill={interpolateColors(frame, [s.from, s.to], [base, b.color])}
          />
        );
      })}
    </g>
  );
};

// The light of the hour over everything (indoor paper shots excluded).
export const DayTint: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < SHOTS.alexanderplatz.from) return null;
  const opacity = interpolate(
    frame,
    frames,
    DAY.keys.map((k) => k.tintOpacity),
    clamp,
  );
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        background: interpolateColors(
          frame,
          frames,
          DAY.keys.map((k) => k.tint),
        ),
        opacity,
      }}
    />
  );
};

// Lamp color as they switch on at dusk.
export const lampColorAt = (frame: number) =>
  interpolateColors(
    frame,
    [DAY.lamps.from, DAY.lamps.to],
    [DAY.lamps.off, DAY.lamps.on],
  );
