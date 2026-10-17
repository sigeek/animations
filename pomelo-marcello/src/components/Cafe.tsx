import React from "react";
import { FONT_FAMILY } from "../fonts";
import { ShadedRect, lightOf, shadeOf } from "../shading";
import { CAFE, FONT, SHADE, VIDEO } from "../tokens";

const W = CAFE.window;
const D = CAFE.duomo;

// The Duomo di Milano through the window: marble front with a gable, a row
// of spires, the tall central spire with the golden Madonnina.
const Duomo: React.FC = () => {
  const b = D.body;
  const top = D.baseY - b.h;
  const cx = b.x + b.w / 2;
  const spireXs = Array.from(
    { length: D.spires.count },
    (_, i) =>
      D.spires.from +
      (i * (D.spires.to - D.spires.from)) / (D.spires.count - 1),
  );
  const t = D.tallSpire;
  return (
    <g>
      {spireXs.map((x) => (
        <polygon
          key={x}
          points={`${x - D.spires.w / 2},${top} ${x},${top - D.spires.h} ${x + D.spires.w / 2},${top}`}
          fill={D.color}
        />
      ))}
      <polygon
        points={`${t.x - t.w / 2},${top - D.gable.h} ${t.x},${top - D.gable.h - t.h} ${t.x + t.w / 2},${top - D.gable.h}`}
        fill={D.color}
      />
      <circle cx={t.x} cy={top - D.gable.h - t.h} r={t.goldR} fill={t.gold} />
      <polygon
        points={`${b.x + b.w * D.gable.inset},${top} ${cx},${top - D.gable.h} ${b.x + b.w * (1 - D.gable.inset)},${top}`}
        fill={D.color}
      />
      <ShadedRect
        x={b.x}
        y={top}
        w={b.w}
        h={b.h}
        fill={D.color}
        side={SHADE.facade}
      />
      {Array.from({ length: D.windows.count }, (_, i) => {
        const x =
          b.x + ((i + 1) * b.w) / (D.windows.count + 1) - D.windows.w / 2;
        return (
          <rect
            key={i}
            x={x}
            y={D.windows.y}
            width={D.windows.w}
            height={D.windows.h}
            rx={D.windows.w / 2}
            fill={D.windows.color}
          />
        );
      })}
      <rect
        x={cx - D.door.w / 2}
        y={D.baseY - D.door.h}
        width={D.door.w}
        height={D.door.h}
        rx={D.door.w / 2}
        fill={D.door.color}
      />
    </g>
  );
};

// Wall, window with the Duomo, chalkboard. Drawn behind Marcello.
export const CafeBack: React.FC = () => (
  <g>
    <rect
      x={0}
      y={0}
      width={VIDEO.width}
      height={VIDEO.height}
      fill={CAFE.wall}
    />
    <rect
      x={0}
      y={CAFE.wainscot.top}
      width={VIDEO.width}
      height={VIDEO.height - CAFE.wainscot.top}
      fill={CAFE.wainscot.color}
    />
    <rect x={W.x} y={W.y} width={W.w} height={W.h} fill={W.wood} />
    <rect
      x={W.x + W.frame}
      y={W.y + W.frame}
      width={W.w - 2 * W.frame}
      height={W.h - 2 * W.frame}
      fill={W.sky}
    />
    <Duomo />
    <rect
      x={W.x}
      y={W.y + W.transomY}
      width={W.w}
      height={W.mullion}
      fill={W.wood}
    />
    <rect
      x={W.x + W.frame}
      y={W.y + W.frame}
      width={W.w - 2 * W.frame}
      height={W.frame / 2}
      fill={lightOf(W.wood)}
    />
    <rect
      x={CAFE.board.x}
      y={CAFE.board.y}
      width={CAFE.board.w}
      height={CAFE.board.h}
      fill={CAFE.board.color}
    />
    <text
      x={CAFE.board.x + CAFE.board.w / 2}
      y={CAFE.board.y + CAFE.board.h / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fill={CAFE.board.chalk}
      fontFamily={FONT_FAMILY}
      fontWeight={FONT.weight}
      fontSize={CAFE.board.fontSize}
    >
      {CAFE.board.text}
    </text>
  </g>
);

// Glass pastry case on the counter, with a shelf of cornetti.
const Vitrine: React.FC<{ top: number }> = ({ top }) => {
  const v = CAFE.vitrine;
  const y = top - v.h;
  const shelf = y + v.h * v.shelfY;
  const cw = v.cornetti;
  return (
    <g>
      <rect x={v.x} y={y} width={v.w} height={v.h} fill={v.wood} />
      <rect
        x={v.x + v.frame}
        y={y + v.frame}
        width={v.w - 2 * v.frame}
        height={v.h - 2 * v.frame}
        fill={v.glass}
      />
      <rect
        x={v.x + v.frame}
        y={shelf}
        width={v.w - 2 * v.frame}
        height={v.frame / 2}
        fill={v.wood}
      />
      {Array.from({ length: cw.count }, (_, i) => {
        const cx = v.x + ((i + 1) * v.w) / (cw.count + 1);
        return (
          <g key={i}>
            <ellipse
              cx={cx}
              cy={shelf - cw.h / 2}
              rx={cw.w / 2}
              ry={cw.h / 2}
              fill={cw.color}
            />
            <ellipse
              cx={cx + cw.w * cw.shadeDx}
              cy={shelf - cw.h * cw.shadeDy}
              rx={cw.w * cw.shadeRx}
              ry={cw.h * cw.shadeRy}
              fill={shadeOf(cw.color)}
            />
          </g>
        );
      })}
    </g>
  );
};

// Counter with marble top, espresso machine and cups. Drawn in front of
// Marcello, so it hides him below the waist.
export const CafeCounter: React.FC = () => {
  const c = CAFE.counter;
  const m = CAFE.machine;
  const mTop = c.top - m.h;
  const panelW = (VIDEO.width - (c.panels + 1) * c.panelInset) / c.panels;
  return (
    <g>
      <ShadedRect x={m.x} y={mTop} w={m.w} h={m.h} fill={m.chrome} />
      <rect
        x={m.x}
        y={mTop}
        width={m.w}
        height={m.groupH / 2}
        fill={m.accent}
      />
      {Array.from({ length: m.groups }, (_, i) => {
        const gx = m.x + ((i + 1) * m.w) / (m.groups + 1) - m.groupW / 2;
        return (
          <rect
            key={i}
            x={gx}
            y={mTop + m.h / 2}
            width={m.groupW}
            height={m.groupH}
            fill={shadeOf(m.chrome)}
          />
        );
      })}
      <rect
        x={m.x + m.w / 3 - m.cupW / 2}
        y={c.top - m.cupH}
        width={m.cupW}
        height={m.cupH}
        fill={CAFE.cups.color}
      />
      <Vitrine top={c.top} />
      {CAFE.cups.xs.map((x) => (
        <rect
          key={x}
          x={x}
          y={c.top - CAFE.cups.h}
          width={CAFE.cups.w}
          height={CAFE.cups.h}
          fill={CAFE.cups.color}
        />
      ))}
      <rect
        x={0}
        y={c.top}
        width={VIDEO.width}
        height={c.slabH}
        fill={c.marble}
      />
      <rect
        x={0}
        y={c.top + c.slabH}
        width={VIDEO.width}
        height={VIDEO.height - c.top - c.slabH}
        fill={c.wood}
      />
      {Array.from({ length: c.panels }, (_, i) => (
        <rect
          key={i}
          x={c.panelInset + i * (panelW + c.panelInset)}
          y={c.top + c.slabH + c.panelInset}
          width={panelW}
          height={VIDEO.height - c.top - c.slabH - 2 * c.panelInset}
          fill={shadeOf(c.wood)}
        />
      ))}
    </g>
  );
};
