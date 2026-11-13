import React from 'react';

/** Drawing kit for the EP03 "homes" set (copied from EP02 market_kit): tapered limbs, two-bone IK, mitten hands, glows. Frame coords. */

export const DEG = 180 / Math.PI;
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const cl01 = (x: number) => Math.min(1, Math.max(0, x));

/** Tapered limb from (x1,y1) width w1 to (x2,y2) width w2, round ends. */
export const limb = (x1: number, y1: number, x2: number, y2: number, w1: number, w2: number) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L, r1 = w1 / 2, r2 = w2 / 2;
  const f = (n: number) => n.toFixed(1);
  return `M${f(x1 + nx * r1)} ${f(y1 + ny * r1)} L${f(x2 + nx * r2)} ${f(y2 + ny * r2)} A${f(r2)} ${f(r2)} 0 0 0 ${f(x2 - nx * r2)} ${f(y2 - ny * r2)} L${f(x1 - nx * r1)} ${f(y1 - ny * r1)} A${f(r1)} ${f(r1)} 0 0 0 ${f(x1 + nx * r1)} ${f(y1 + ny * r1)} Z`;
};

/** Two-bone IK: shoulder (sx,sy) -> hand target; bend = +1/-1 picks the elbow side. */
export const ik = (sx: number, sy: number, hx: number, hy: number, L1: number, L2: number, bend: 1 | -1) => {
  let dx = hx - sx, dy = hy - sy, d = Math.hypot(dx, dy) || 1;
  const dmax = L1 + L2 - 0.5;
  if (d > dmax) { hx = sx + (dx / d) * dmax; hy = sy + (dy / d) * dmax; dx = hx - sx; dy = hy - sy; d = dmax; }
  const a = Math.atan2(dy, dx);
  const A = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const ang = a + bend * A;
  return { ex: sx + Math.cos(ang) * L1, ey: sy + Math.sin(ang) * L1, hx, hy };
};

/**
 * Mitten hand, wrist at (0,0), fingers toward +x, length len, width w.
 * thumb side = +y when thumb=1, -y when thumb=-1. curl 0..1 shortens/rounds the fingers.
 */
export const Mitt: React.FC<{ x: number; y: number; ang: number; len: number; w: number; skin: string; shade: string; line?: string; thumb?: 1 | -1; curl?: number; rim?: string; rimO?: number; thumbOut?: number }> = ({
  x, y, ang, len, w, skin, shade, line, thumb = 1, curl = 0, rim, rimO = 0.6, thumbOut = 0.5,
}) => {
  const L = len * (1 - 0.28 * curl), hw = w / 2;
  const body = `M0 ${-hw * 0.78} C${L * 0.35} ${-hw * 1.02} ${L * 0.82} ${-hw * 0.98} ${L * 0.98} ${-hw * 0.42} Q${L * 1.06} 0 ${L * 0.98} ${hw * 0.42} C${L * 0.82} ${hw * 0.98} ${L * 0.35} ${hw * 1.02} 0 ${hw * 0.78} Z`;
  const ts = thumb;
  const to = thumbOut;
  const th = `M${L * 0.12} ${ts * hw * 0.6} C${L * 0.3} ${ts * hw * (1.1 + to)} ${L * 0.62} ${ts * hw * (1.15 + to * 0.8)} ${L * 0.7} ${ts * hw * (0.95 + to * 0.4)} C${L * 0.6} ${ts * hw * 0.7} ${L * 0.42} ${ts * hw * 0.62} ${L * 0.3} ${ts * hw * 0.5} Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <path d={body} fill={skin} />
      <path d={`M0 ${-ts * hw * 0.78} C${L * 0.35} ${-ts * hw * 1.02} ${L * 0.82} ${-ts * hw * 0.98} ${L * 0.98} ${-ts * hw * 0.42} L${L * 0.6} ${-ts * hw * 0.3} Z`} fill={shade} opacity={0.55} />
      <path d={th} fill={skin} />
      <path d={th} fill="none" stroke={shade} strokeWidth={Math.max(1.2, w * 0.035)} opacity={0.7} />
      <path d={`M${L * 0.98} ${-hw * 0.1} L${L * 0.68} ${-hw * 0.12} M${L * 0.96} ${hw * 0.36} L${L * 0.7} ${hw * 0.3}`.replace(/NaN/g, '0')} stroke={line ?? shade} strokeWidth={Math.max(1.2, w * 0.04)} strokeLinecap="round" opacity={0.75} />
      {rim && <path d={`M${L * 0.1} ${-hw * 0.84} C${L * 0.4} ${-hw * 1.02} ${L * 0.82} ${-hw * 0.98} ${L * 0.98} ${-hw * 0.42}`} stroke={rim} strokeWidth={Math.max(1.5, w * 0.06)} fill="none" opacity={rimO} strokeLinecap="round" />}
    </g>
  );
};

/** Radial glow disc (gradient defined inline, unique id). */
export const Glow: React.FC<{ id: string; x: number; y: number; rx: number; ry?: number; c: string; o?: number; mid?: number }> = ({ id, x, y, rx, ry, c, o = 1, mid = 0.35 }) => (
  <g>
    <defs>
      <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={c} stopOpacity={1} />
        <stop offset={mid} stopColor={c} stopOpacity={0.4} />
        <stop offset="1" stopColor={c} stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={x} cy={y} rx={rx} ry={ry ?? rx} fill={`url(#${id})`} opacity={o} />
  </g>
);

/** Live layers are world-space; art is drawn in frame coords (frame = world - (108,192)). */
export const Fr: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;

/** sin bump 0 -> 1 -> 0 over [a, a + d] */
export const bump = (t: number, a: number, d: number) => { const u = cl01((t - a) / d); return Math.sin(Math.PI * u); };

/** soft puff (smoke / steam): a few overlapping circles with a gradient, k 0..1 life */
export const Puff: React.FC<{ id: string; x: number; y: number; r: number; c: string; o: number; seed?: number }> = ({ id, x, y, r, c, o, seed = 1 }) => {
  const offs = [[0, 0, 1], [0.55, -0.25, 0.7], [-0.5, -0.2, 0.75], [0.15, -0.6, 0.6]];
  return (
    <g opacity={o}>
      <defs>
        <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={c} stopOpacity={0.9} />
          <stop offset="0.6" stopColor={c} stopOpacity={0.45} />
          <stop offset="1" stopColor={c} stopOpacity={0} />
        </radialGradient>
      </defs>
      {offs.map(([dx, dy, s], i) => (
        <circle key={i} cx={x + dx * r * (1 + 0.1 * Math.sin(seed + i))} cy={y + dy * r} r={r * s} fill={`url(#${id})`} />
      ))}
    </g>
  );
};
