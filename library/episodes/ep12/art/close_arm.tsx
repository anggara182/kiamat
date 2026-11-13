import React from 'react';

export const ARM = '#d8cbbb';
export const ARM_SH = '#9c8f84';
export const MOON = '#cfd8e6';

/** Green lime, top-lit by warm lamp. r = radius, rot = roll angle (deg). */
export const Lime: React.FC<{ id: string; x: number; y: number; r: number; rot?: number; light?: string; dark?: number }> = ({ id, x, y, r, rot = 0, light = '#ffe2a0', dark = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <defs>
      <radialGradient id={`${id}lm`} cx="0.36" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#c8e86a" />
        <stop offset="0.45" stopColor="#5f9a2a" />
        <stop offset="1" stopColor="#1f3a10" />
      </radialGradient>
    </defs>
    <ellipse cx={r * 0.15} cy={r * 0.92} rx={r * 1.05} ry={r * 0.28} fill="#000" opacity={0.45} />
    <g transform={`rotate(${rot})`}>
      <ellipse cx={0} cy={0} rx={r * 1.06} ry={r} fill={`url(#${id}lm)`} />
      {/* nubs at the poles show the roll */}
      <ellipse cx={r * 1.02} cy={0} rx={r * 0.1} ry={r * 0.14} fill="#3f6a1c" />
      <ellipse cx={-r * 1.02} cy={0} rx={r * 0.07} ry={r * 0.1} fill="#2c4d14" />
      {[0.3, -0.25, 0.6].map((k, i) => (
        <circle key={i} cx={r * k} cy={r * (0.3 - i * 0.25)} r={r * 0.04} fill="#2d5414" opacity={0.6} />
      ))}
    </g>
    <ellipse cx={-r * 0.35} cy={-r * 0.42} rx={r * 0.32} ry={r * 0.18} fill={light} opacity={0.75} transform={`rotate(-25 ${-r * 0.35} ${-r * 0.42})`} />
    {dark > 0 && <ellipse cx={0} cy={0} rx={r * 1.08} ry={r * 1.02} fill="#05070a" opacity={dark} />}
  </g>
);

/** Teak planks running vertically (top view). x0..x1, gaps at boundaries; `wideGap` index widened. */
export const Planks: React.FC<{ x0: number; n: number; pw: number; y0: number; h: number; wideAt?: number; wideW?: number; seed?: number }> = ({ x0, n, pw, y0, h, wideAt = -1, wideW = 46 }) => {
  const out: React.ReactNode[] = [];
  let x = x0;
  for (let i = 0; i < n; i++) {
    const tone = i % 3 === 0 ? '#5a3f2b' : i % 3 === 1 ? '#4c3524' : '#553b28';
    out.push(
      <g key={i}>
        <rect x={x} y={y0} width={pw} height={h} fill={tone} />
        {/* grain: a few long wavy strokes */}
        {[0.22, 0.47, 0.71].map((k, j) => (
          <path key={j} d={`M${x + pw * k},${y0} C${x + pw * k + 14},${y0 + h * 0.3} ${x + pw * k - 12},${y0 + h * 0.6} ${x + pw * k + 6},${y0 + h}`} stroke="#3b2a1f" strokeWidth={3 + j} fill="none" opacity={0.55} />
        ))}
        <ellipse cx={x + pw * 0.6} cy={y0 + h * (0.25 + (i % 4) * 0.17)} rx={pw * 0.09} ry={34} fill="none" stroke="#3b2a1f" strokeWidth={4} opacity={0.6} />
        <rect x={x} y={y0} width={5} height={h} fill="#8a6446" opacity={0.5} />
      </g>,
    );
    x += pw;
    const gw = i === wideAt ? wideW : 9;
    if (i !== wideAt) out.push(<rect key={`g${i}`} x={x} y={y0} width={gw} height={h} fill="#080504" />);
    else out.push(<rect key={`g${i}`} x={x - 4} y={y0} width={4} height={h} fill="#2a1c13" />);
    x += gw;
  }
  return <>{out}</>;
};

/**
 * The impossibly long arm hanging straight down from (x, y0) to the hand at (x+lean, y1).
 * Sleeve edge at top, pale thin forearm, slender hand with long fingers reaching down.
 */
export const LongArm: React.FC<{ x: number; y0: number; y1: number; lean?: number; curl?: number; t?: number }> = ({ x, y0, y1, lean = 0, curl = 0, t = 0 }) => {
  const L = y1 - y0;
  const sway = Math.sin(t * 0.8) * 10;
  const mx = x + lean * 0.5 + sway;
  const hx = x + lean;
  const w0 = 26, w1 = 15;
  const arm = `M${x - w0},${y0} C${x - w0},${y0 + L * 0.35} ${mx - w1 - 6},${y0 + L * 0.65} ${hx - w1},${y1}
    L${hx + w1},${y1} C${mx + w1 + 4},${y0 + L * 0.65} ${x + w0},${y0 + L * 0.35} ${x + w0},${y0} Z`;
  const rim = `M${x + w0 - 4},${y0 + 40} C${x + w0 - 4},${y0 + L * 0.35} ${mx + w1},${y0 + L * 0.65} ${hx + w1 - 3},${y1}`;
  const f = (dx: number, len: number, bend: number, w: number) => {
    const bx = hx + dx, by = y1 + 60;
    const tx = bx + dx * 0.6 + bend * curl, ty = by + len;
    return <path d={`M${bx},${by - 10} Q${bx + dx * 0.3},${by + len * 0.55} ${tx},${ty}`} stroke={ARM} strokeWidth={w} strokeLinecap="round" fill="none" />;
  };
  return (
    <g>
      <defs>
        <linearGradient id="armg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6f655e" />
          <stop offset="0.45" stopColor={ARM_SH} />
          <stop offset="0.8" stopColor={ARM} />
          <stop offset="1" stopColor="#efe8dc" />
        </linearGradient>
      </defs>
      <path d={arm} fill="url(#armg)" />
      <path d={rim} stroke={MOON} strokeWidth={4} fill="none" opacity={0.85} />
      {/* faint tendon lines along the impossible length */}
      <path d={`M${x - 6},${y0 + 120} C${x - 6},${y0 + L * 0.4} ${mx - 4},${y0 + L * 0.7} ${hx - 3},${y1 - 30}`} stroke="#7d726a" strokeWidth={2} fill="none" opacity={0.5} />
      {/* wrist bone */}
      <ellipse cx={hx + 8} cy={y1 - 6} rx={7} ry={9} fill="#efe6d8" opacity={0.7} />
      {/* palm */}
      <path d={`M${hx - w1 - 2},${y1 - 6} C${hx - 30},${y1 + 30} ${hx - 28},${y1 + 66} ${hx - 14},${y1 + 78} L${hx + 20},${y1 + 78} C${hx + 30},${y1 + 60} ${hx + 28},${y1 + 26} ${hx + w1 + 2},${y1 - 6} Z`} fill={ARM} />
      <path d={`M${hx - w1 - 2},${y1 - 6} C${hx - 30},${y1 + 30} ${hx - 28},${y1 + 66} ${hx - 14},${y1 + 78}`} stroke={ARM_SH} strokeWidth={6} fill="none" />
      {/* long fingers */}
      {f(-20, 118, -10, 14)}
      {f(-7, 138, -4, 15)}
      {f(6, 134, 4, 15)}
      {f(19, 112, 10, 13)}
      {/* thumb */}
      <path d={`M${hx - 22},${y1 + 24} Q${hx - 46},${y1 + 60} ${hx - 40 + curl * 6},${y1 + 98}`} stroke={ARM_SH} strokeWidth={14} strokeLinecap="round" fill="none" />
      {/* knuckle rim */}
      <path d={`M${hx + 26},${y1 + 10} C${hx + 30},${y1 + 50} ${hx + 26},${y1 + 120} ${hx + 32 + curl * 10},${y1 + 180}`} stroke={MOON} strokeWidth={3} fill="none" opacity={0.7} />
    </g>
  );
};
