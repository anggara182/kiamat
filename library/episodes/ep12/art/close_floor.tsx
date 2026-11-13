import React from 'react';

/** High-angle floor in perspective (frame space 1080x1920). Boards converge to a vanishing point above the frame. */
export const VP = { x: 540, y: -1500 };
export const FLOOR_BOTTOM = 2120;
/** x on the floor line that starts at bottom x `xb`, at height y. */
export const fx = (xb: number, y: number) => VP.x + (xb - VP.x) * ((y - VP.y) / (FLOOR_BOTTOM - VP.y));

const TONES = ['#5a3f2b', '#4e3625', '#573c29', '#4a3323'];

/** Boards between bottom x positions `edges` (pairs). gapIdx = index of the board boundary that is a wide gap. */
export const PerspFloor: React.FC<{ edges: number[]; top?: number }> = ({ edges, top = -200 }) => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < edges.length - 1; i += 2) {
    const a = edges[i], b = edges[i + 1];
    const poly = `${fx(a, top)},${top} ${fx(b, top)},${top} ${b},${FLOOR_BOTTOM} ${a},${FLOOR_BOTTOM}`;
    const tone = TONES[(i / 2) % TONES.length];
    out.push(
      <g key={i}>
        <polygon points={poly} fill={tone} />
        {[0.25, 0.5, 0.74].map((k, j) => {
          const xb = a + (b - a) * k;
          return <path key={j} d={`M${fx(xb, top)},${top} C${fx(xb, 500) + 10},500 ${fx(xb, 1200) - 10},1200 ${xb + 6},${FLOOR_BOTTOM}`} stroke="#3b2a1f" strokeWidth={2 + j * 1.5} fill="none" opacity={0.6} />;
        })}
        {/* butt joint seams, staggered per board */}
        {[180 + ((i * 97) % 300), 1050 + ((i * 131) % 380)].map((y, j) => (
          <line key={`s${j}`} x1={fx(a, y)} y1={y} x2={fx(b, y)} y2={y + 4} stroke="#1a110b" strokeWidth={4 + y / 400} />
        ))}
        {/* lamp-lit left bevel */}
        <polygon points={`${fx(a, top)},${top} ${fx(a, top) + 3},${top} ${a + 6},${FLOOR_BOTTOM} ${a},${FLOOR_BOTTOM}`} fill="#a87a50" opacity={0.45} />
      </g>,
    );
  }
  return <>{out}</>;
};
