import React from 'react';

const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b), k = Math.min(1, Math.max(0, t));
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`;
};

export type Pt = [number, number];
export const SILK_GREEN = { deep: '#063a25', dark: '#0d5a37', mid: '#1f9a5f', light: '#62e9a3', spec: '#e4fff0', trim: '#e2b866' };

/**
 * A silk ribbon along a centreline. Each segment has a twist angle; the visible width is
 * width*|cos(twist)| and the shade follows the facing, so the cloth reads as turning in space.
 * Cheap: one quad per segment, flat colour (no filters).
 */
export const Ribbon: React.FC<{
  pts: Pt[]; width: number | ((s: number) => number); twist: (s: number) => number; light?: number;
  pal?: typeof SILK_GREEN; trim?: boolean; fringe?: boolean; opacity?: number;
}> = ({ pts, width, twist, light = 0, pal = SILK_GREEN, trim = false, fringe = false, opacity = 1 }) => {
  const n = pts.length;
  if (n < 2) return null;
  const edges = pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L;
    const s = i / (n - 1);
    const th = twist(s);
    const c = Math.cos(th);
    const w = (typeof width === 'function' ? width(s) : width) * Math.max(0.07, Math.abs(c)) / 2;
    return { l: [p[0] + nx * w, p[1] + ny * w] as Pt, r: [p[0] - nx * w, p[1] - ny * w] as Pt, c, sn: Math.sin(th), nx, ny };
  });
  const quads = [];
  for (let i = 0; i < n - 1; i++) {
    const e0 = edges[i], e1 = edges[i + 1];
    const facing = (e0.c + e1.c) / 2; // + = front face up, - = back face
    const f = Math.abs(facing);
    const col = facing >= 0 ? mix(pal.dark, pal.mid, f) : mix(pal.deep, pal.dark, f);
    const sp = Math.max(0, 1 - Math.abs(((e0.sn + e1.sn) / 2) - 0.45 - light * 0.2) * 3.2) * f;
    const base = facing >= 0 ? (f > 0.75 ? mix(pal.mid, pal.light, (f - 0.75) * 2.4 + light * 0.3) : col) : col;
    const fill = sp > 0.05 ? blend(base, pal.spec, sp * 0.8) : base;
    const d = `M ${e0.l[0].toFixed(1)} ${e0.l[1].toFixed(1)} L ${e1.l[0].toFixed(1)} ${e1.l[1].toFixed(1)} L ${e1.r[0].toFixed(1)} ${e1.r[1].toFixed(1)} L ${e0.r[0].toFixed(1)} ${e0.r[1].toFixed(1)} Z`;
    quads.push(<path key={i} d={d} fill={fill} stroke={fill} strokeWidth={0.8} strokeLinejoin="round" />);
  }
  const edgeLine = (side: 'l' | 'r') => edges.map((e, i) => `${i ? 'L' : 'M'} ${e[side][0].toFixed(1)} ${e[side][1].toFixed(1)}`).join(' ');
  const last = edges[n - 1], first = edges[0];
  return (
    <g opacity={opacity}>
      {quads}
      {trim && (
        <>
          <path d={edgeLine('l')} fill="none" stroke={pal.trim} strokeWidth={3} opacity={0.85} />
          <path d={edgeLine('r')} fill="none" stroke={pal.trim} strokeWidth={3} opacity={0.6} />
        </>
      )}
      {fringe && [first, last].map((e, k) =>
        Array.from({ length: 9 }, (_, j) => {
          const u = j / 8;
          const x = e.l[0] + (e.r[0] - e.l[0]) * u, y = e.l[1] + (e.r[1] - e.l[1]) * u;
          const dir = k === 0 ? -1 : 1;
          const tx = (k === 0 ? pts[0][0] - pts[1][0] : pts[n - 1][0] - pts[n - 2][0]), ty = (k === 0 ? pts[0][1] - pts[1][1] : pts[n - 1][1] - pts[n - 2][1]);
          const L = Math.hypot(tx, ty) || 1;
          return <line key={`${k}-${j}`} x1={x} y1={y} x2={x + (tx / L) * 22 + dir * (j % 2) * 2} y2={y + (ty / L) * 22} stroke={pal.trim} strokeWidth={2} opacity={0.8} />;
        }),
      )}
    </g>
  );
};

const blend = (a: string, b: string, t: number) => {
  const pa = a.startsWith('rgb') ? a.slice(4, -1).split(',').map(Number) : hex(a);
  const pb = hex(b), k = Math.min(1, Math.max(0, t));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(',')})`;
};
