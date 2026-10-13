import React from "react";
import { AbsoluteFill } from "remotion";
import { CENTER, COLORS, GRID, TITLE } from "../tokens";
import { PaperGrid } from "./PaperGrid";
import { rotateMesh, toPath, type Mesh } from "./paperGeometry";
import { Wrinkles } from "./Wrinkles";

type Props = {
  mesh: Mesh; // sheet-local coordinates, centred on 0,0
  rotateDeg: number;
  contentSize: number; // content is a square of this size, centred
  contentScale: number;
  wrinkles: number; // 0 smooth → 1 fully crumpled
  paperOpacity?: number; // fades the paper off to show `beneath`
  squash?: { scaleX: number; scaleY: number; originY: number };
  beneath?: React.ReactNode; // content under the paper, revealed as it fades
  children?: React.ReactNode; // content printed on the paper
};

// The sheet of squared paper in shots 1–3, clipped by its (possibly crumpled)
// outline. Layers: what lies beneath, then the paper itself (fill, grid lines
// bent through the mesh, printed content, wrinkle facets).
export const PaperSheet: React.FC<Props> = ({
  mesh,
  rotateDeg,
  contentSize,
  contentScale,
  wrinkles,
  paperOpacity = 1,
  squash,
  beneath,
  children,
}) => {
  const screen = rotateMesh(mesh, rotateDeg);
  const contentBox = (content: React.ReactNode) => (
    <div
      style={{
        position: "absolute",
        left: CENTER.x - contentSize / 2,
        top: CENTER.y - contentSize / 2,
        width: contentSize,
        height: contentSize,
        rotate: `${rotateDeg}deg`,
        scale: contentScale,
      }}
    >
      {content}
    </div>
  );
  return (
    <AbsoluteFill
      style={
        squash
          ? { transformOrigin: `${CENTER.x}px ${squash.originY}px`, scale: `${squash.scaleX} ${squash.scaleY}` }
          : undefined
      }
    >
      <AbsoluteFill style={{ clipPath: `path('${toPath(screen.edge)}')` }}>
        {beneath ? contentBox(beneath) : null}
        {paperOpacity > 0 ? (
          <AbsoluteFill style={{ opacity: paperOpacity }}>
            <AbsoluteFill style={{ background: COLORS.paper }} />
            <PaperGrid
              screen={screen}
              strokeWidth={(GRID.strokeWidth * contentScale * contentSize) / TITLE.paper.size}
            />
            {children ? contentBox(children) : null}
            <Wrinkles screen={screen} amount={wrinkles} />
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
