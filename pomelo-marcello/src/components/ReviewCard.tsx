import React from "react";
import { FONT_FAMILY } from "../fonts";
import { APP, COLORS, FONT, REVIEW_POP } from "../tokens";

// The 1-star review notification, as on the app's task screen.
export const ReviewCard: React.FC = () => {
  const r = REVIEW_POP;
  const c = r.card;
  const s = r.stars;
  const star = (x: number, y: number, size: number) => {
    const pts = Array.from({ length: 2 * s.points }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / s.points;
      const rad = i % 2 === 0 ? size / 2 : size * s.inner;
      return `${x + Math.cos(a) * rad},${y + Math.sin(a) * rad}`;
    });
    return pts.join(" ");
  };
  return (
    <g>
      <rect
        x={c.x}
        y={c.y}
        width={c.w}
        height={c.h}
        rx={c.radius}
        fill={APP.white}
      />
      {Array.from({ length: s.count }, (_, i) => (
        <polygon
          key={i}
          points={star(
            c.x + c.pad + s.size / 2 + i * (s.size + s.gap),
            c.y + c.pad + s.size / 2,
            s.size,
          )}
          fill={i < s.lit ? s.on : s.off}
        />
      ))}
      {r.text.lines.map((line, i) => (
        <text
          key={line}
          x={c.x + c.pad}
          y={c.y + c.pad + s.size + r.text.lineHeight * (i + 1)}
          fill={COLORS.ink}
          fontFamily={FONT_FAMILY}
          fontWeight={FONT.weight}
          fontSize={r.text.fontSize}
        >
          {line}
        </text>
      ))}
    </g>
  );
};
