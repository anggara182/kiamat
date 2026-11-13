import React from 'react';
import { rng } from './world';

/* ------------------------------------------------------------------------------------------
 * People close-ups for the boulevard set. The man from nowhere is NEVER shown with a face:
 * from behind, or a backlit silhouette.
 * ---------------------------------------------------------------------------------------- */

/** the man from behind, standing, leaning a little forward; the right arm reaches to (tx,ty) (world). h = height px. */
export const ManBack: React.FC<{ x: number; y: number; h: number; tx: number; ty: number; lean?: number; breath?: number; shirt?: string; legs?: string; hair?: string }> = ({ x, y, h, tx, ty, lean = 0, breath = 0, shirt = '#5f6366', legs = '#3a3a40', hair = '#1e1814' }) => {
  const s = h / 100;
  const sx = x + 11.5 * s + lean * 0.3 * s, sy = y - (80 + breath) * s; // right shoulder
  const dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy), L = 30 * s;
  const k = Math.min(1, d / L);
  // elbow: bend down/outwards when the target is close
  const mx = sx + dx * 0.5 + 6 * s * (1 - k), my = sy + dy * 0.5 + 8 * s * (1 - k);
  const hx2 = sx + dx * Math.min(1, L / Math.max(d, 1)), hy2 = sy + dy * Math.min(1, L / Math.max(d, 1));
  return (
    <g>
      <ellipse cx={x} cy={y + 3} rx={18 * s} ry={2.6 * s} fill="#2a2018" opacity={0.3} />
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M -8 -50 L -1.5 -50 L -2.4 -1 L -7.8 -1 Z M 1.5 -50 L 8 -50 L 7.8 -1 L 2.4 -1 Z" fill={legs} />
        <ellipse cx={-5} cy={-1} rx={3.8} ry={1.6} fill="#2a2420" /><ellipse cx={5} cy={-1} rx={3.8} ry={1.6} fill="#2a2420" />
        <g transform={`rotate(${lean} 0 -48)`}>
          <path d={`M -12 ${-80 - breath} Q 0 ${-84 - breath} 12 ${-80 - breath} L 12.5 -62 L 8.5 -47 L -8.5 -47 L -12.5 -62 Z`} fill={shirt} />
          <path d={`M -2 ${-79 - breath} L -1 -50`} stroke="#000" strokeWidth={1} opacity={0.15} />
          <path d={`M -11.5 ${-78 - breath} Q -14 -66 -13 -52`} stroke={shirt} strokeWidth={4.8} strokeLinecap="round" fill="none" />
          <ellipse cx={-13} cy={-50} rx={2.6} ry={2.9} fill="#6e4a36" />
          <rect x={-2.3} y={-87 - breath} width={4.6} height={6} fill="#6e4a36" />
          {/* back of the head only: hair mass, no face */}
          <ellipse cx={0} cy={-92 - breath} rx={6} ry={7} fill={hair} />
        </g>
      </g>
      <path d={`M ${sx} ${sy} L ${mx} ${my} L ${hx2} ${hy2}`} stroke={shirt} strokeWidth={4.8 * s} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M ${mx} ${my} L ${hx2} ${hy2}`} stroke="#7a5440" strokeWidth={3.6 * s} strokeLinecap="round" />
      <ellipse cx={hx2} cy={hy2} rx={2.8 * s} ry={2.6 * s} fill="#6e4a36" />
    </g>
  );
};

/** a round flat loaf */
export const Bread: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={16} ry={9} fill="#b97a3e" />
    <ellipse cx={-2} cy={-3} rx={12} ry={5} fill="#d89c5a" />
    <path d="M -8 -2 q 4 -3 8 0 M 2 -1 q 4 -3 8 0" stroke="#8a5a2a" strokeWidth={1.4} fill="none" />
  </g>
);

/** listener bust in profile (simple face, no detail), facing dir; nod = head tilt (deg); warm light rim on the facing side */
export const Bust: React.FC<{ x: number; y: number; s: number; dir: number; nod: number; skin: string; shade: string; top: string; hat?: 'hijab' | 'peci' | 'hair' | 'cap'; hatCol?: string; light?: string }> = ({ x, y, s, dir, nod, skin, shade, top, hat = 'hair', hatCol = '#1e1814', light = '#ffcf86' }) => (
  <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`}>
    {/* shoulders + chest */}
    <path d="M -70 0 Q -66 -60 -30 -74 L 26 -76 Q 62 -64 70 0 Z" fill={top} />
    <path d="M 26 -76 Q 62 -64 70 0 L 50 0 Q 46 -50 22 -66 Z" fill={light} opacity={0.22} />
    <path d="M -10 -96 L 14 -96 L 16 -70 L -8 -70 Z" fill={shade} />
    <g transform={`rotate(${nod} 2 -98)`}>
      {/* head in profile facing +x: skull, brow, nose, lips, chin */}
      <path d="M -26 -128 Q -30 -170 4 -176 Q 34 -178 38 -146 L 42 -136 L 48 -128 L 42 -124 L 42 -116 Q 44 -110 40 -106 Q 36 -98 24 -96 L -2 -96 Q -22 -104 -26 -128 Z" fill={skin} />
      <path d="M 38 -146 L 42 -136 L 48 -128 L 42 -124 L 42 -116 Q 44 -110 40 -106 Q 36 -98 24 -96 L 26 -110 Q 34 -126 32 -146 Z" fill={light} opacity={0.35} />
      <path d="M -26 -128 Q -22 -104 -2 -96 L 6 -110 Q -14 -116 -16 -134 Z" fill={shade} opacity={0.6} />
      <ellipse cx={22} cy={-138} rx={2.6} ry={1.8} fill="#1a1410" />
      <path d="M 18 -146 q 6 -3 12 0" stroke="#1a1410" strokeWidth={1.6} fill="none" opacity={0.6} />
      <ellipse cx={-6} cy={-134} rx={6} ry={8} fill={shade} opacity={0.7} />
      {hat === 'hair' && <path d="M -28 -126 Q -34 -178 6 -180 Q 40 -180 40 -150 Q 24 -162 8 -158 Q -10 -152 -12 -132 Z" fill={hatCol} />}
      {hat === 'peci' && <path d="M -22 -158 L -18 -184 Q 10 -190 36 -182 L 34 -156 Z" fill={hatCol} />}
      {hat === 'cap' && <g fill={hatCol}><path d="M -26 -150 Q -22 -184 8 -184 Q 36 -182 38 -152 Z" /><path d="M 30 -156 L 62 -150 L 58 -144 L 30 -148 Z" /></g>}
      {hat === 'hijab' && <path d="M -36 -120 Q -40 -186 8 -186 Q 44 -184 44 -146 L 40 -140 Q 34 -132 34 -150 Q 30 -168 6 -168 Q -18 -164 -18 -132 Q -14 -104 4 -94 L 30 -86 Q 40 -80 46 -70 L -60 -66 Q -40 -88 -36 -120 Z" fill={hatCol} />}
    </g>
  </g>
);

/** rubble chunks (static) for the close dawn shot */
export const Rubble: React.FC<{ y: number; n?: number; seed?: number }> = ({ y, n = 18, seed = 401 }) => {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = -60 + r() * 1420, w = 40 + r() * 140, h = 20 + r() * 70, yy = y + r() * 120;
        return <g key={i}><polygon points={`${x - w},${yy} ${x - w * 0.5},${yy - h} ${x + w * 0.2},${yy - h * 0.8} ${x + w},${yy}`} fill={i % 2 ? '#2a2630' : '#353039'} /><path d={`M ${x - w * 0.5} ${yy - h} L ${x + w * 0.2} ${yy - h * 0.8}`} stroke="#ffd8a8" strokeWidth={3} opacity={0.6} /></g>;
      })}
    </g>
  );
};
