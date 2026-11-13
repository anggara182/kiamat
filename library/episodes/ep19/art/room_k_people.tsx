import React from 'react';

/** Seated teen on the floor. (x,y) = hips. back=true: seen from behind (front row, dark silhouette). hand = world target for both hands. */
export const Teen: React.FC<{ x: number; y: number; s?: number; back?: boolean; hand: [number, number]; lean?: number; laugh?: number; light?: number; hair?: 'long' | 'short'; tone?: string; dark?: number }> = ({ x, y, s = 1, back = false, hand, lean = 0, laugh = 0, light = 1, hair = 'short', tone = '#4a3426', dark = 0 }) => {
  const lx = (hand[0] - x) / s, ly = (hand[1] - y) / s;
  const shY = -200 + laugh * 6, hx = lean * 20 - laugh * 0;
  const headY = -262 + laugh * 4;
  const headRot = -laugh * 14;
  const body = back ? '#0c0b0a' : tone;
  const skin = back ? '#120e0b' : '#7a5236';
  const rim = '#ffc46b';
  const hairC = '#0b0908';
  const shoulderL: [number, number] = [-78 + hx, shY + 14];
  const shoulderR: [number, number] = [78 + hx, shY + 14];
  const arm = (sh: [number, number], side: number) => {
    const hxp = lx + side * 14, hyp = ly;
    const ex = (sh[0] + hxp) / 2 + side * 30, ey = Math.max(sh[1], hyp) + 30;
    return (
      <g>
        <path d={`M${sh[0]} ${sh[1]} Q${ex} ${ey} ${hxp} ${hyp}`} stroke={body} strokeWidth={24} strokeLinecap="round" fill="none" />
        <path d={`M${sh[0]} ${sh[1] - 11} Q${ex} ${ey - 12} ${hxp - side * 6} ${hyp - 11}`} stroke={rim} strokeWidth={3} fill="none" opacity={0.55 * light} />
        <ellipse cx={hxp} cy={hyp} rx={18} ry={14} fill={back ? '#6a4630' : skin} />
        <ellipse cx={hxp} cy={hyp - 4} rx={10} ry={6} fill="#ffb060" opacity={0.35 * light} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={1 - dark * 0}>
      {/* crossed legs */}
      <ellipse cx={0} cy={-14} rx={112} ry={38} fill={back ? '#0a0908' : '#2a1e16'} />
      {!back && <ellipse cx={0} cy={-26} rx={92} ry={18} fill="#3a2a1e" opacity={0.6 * light} />}
      {/* torso */}
      <path d={`M-66 -20 Q-74 -110 ${shoulderL[0]} ${shoulderL[1]} Q${hx} ${shY - 14} ${shoulderR[0]} ${shoulderR[1]} Q74 -110 66 -20 Z`} fill={body} />
      {!back && <path d={`M-40 -30 Q-46 -120 ${-30 + hx} ${shY + 10} L${30 + hx} ${shY + 10} Q46 -120 40 -30 Z`} fill="#ffb060" opacity={0.18 * light} />}
      {/* neck + head */}
      <g transform={`rotate(${headRot} ${hx} ${shY})`}>
        <rect x={hx - 15} y={shY - 34} width={30} height={40} fill={skin} />
        <ellipse cx={hx} cy={headY} rx={44} ry={52} fill={skin} />
        {!back && <ellipse cx={hx} cy={headY + 22} rx={30} ry={24} fill="#ffb060" opacity={0.28 * light} />}
        {/* hair */}
        {back ? (
          <path d={hair === 'long'
            ? `M${hx - 48} ${headY + 10} Q${hx - 52} ${headY - 60} ${hx} ${headY - 58} Q${hx + 52} ${headY - 60} ${hx + 48} ${headY + 10} Q${hx + 56} ${headY + 90} ${hx + 40} ${shY + 50} L${hx - 40} ${shY + 50} Q${hx - 56} ${headY + 90} ${hx - 48} ${headY + 10} Z`
            : `M${hx - 47} ${headY + 16} Q${hx - 52} ${headY - 60} ${hx} ${headY - 58} Q${hx + 52} ${headY - 60} ${hx + 47} ${headY + 16} Q${hx} ${headY + 40} ${hx - 47} ${headY + 16} Z`}
            fill={hairC} />
        ) : (
          <path d={hair === 'long'
            ? `M${hx - 50} ${headY + 70} Q${hx - 58} ${headY - 62} ${hx} ${headY - 60} Q${hx + 58} ${headY - 62} ${hx + 50} ${headY + 70} L${hx + 34} ${headY + 70} Q${hx + 38} ${headY - 20} ${hx} ${headY - 26} Q${hx - 38} ${headY - 20} ${hx - 34} ${headY + 70} Z`
            : `M${hx - 46} ${headY - 4} Q${hx - 50} ${headY - 64} ${hx} ${headY - 60} Q${hx + 50} ${headY - 64} ${hx + 46} ${headY - 4} Q${hx + 20} ${headY - 34} ${hx - 46} ${headY - 4} Z`}
            fill={hairC} />
        )}
        {/* rim from the candles (below/centre) */}
        <path d={`M${hx - 44} ${headY + 6} Q${hx - 36} ${headY + 48} ${hx} ${headY + 52} Q${hx + 36} ${headY + 48} ${hx + 44} ${headY + 6}`} stroke={rim} strokeWidth={back ? 4 : 3} fill="none" opacity={(back ? 0.75 : 0.5) * light} />
      </g>
      {arm(shoulderL, -1)}
      {arm(shoulderR, 1)}
      {/* shoulder rim */}
      <path d={`M${shoulderL[0]} ${shoulderL[1] + 6} Q${hx} ${shY - 8} ${shoulderR[0]} ${shoulderR[1] + 6}`} stroke={rim} strokeWidth={4} fill="none" opacity={(back ? 0.6 : 0.3) * light} />
    </g>
  );
};

/** Candle on the floor. (x,y)=base. h = wax height, lit 0..1, t seconds. */
export const Candle: React.FC<{ x: number; y: number; h?: number; lit?: number; t: number; seed?: number; id: string; glow?: number }> = ({ x, y, h = 70, lit = 1, t, seed = 0, id, glow = 1 }) => {
  const fl = Math.sin(t * 9 + seed) * 0.12 + Math.sin(t * 23 + seed * 2) * 0.06;
  const fh = 30 * (1 + fl);
  const sway = Math.sin(t * 5 + seed) * 3;
  return (
    <g>
      <defs>
        <radialGradient id={`cg${id}`}>
          <stop offset="0" stopColor="#ffc46b" stopOpacity={0.45} />
          <stop offset="0.4" stopColor="#ff9a3c" stopOpacity={0.14} />
          <stop offset="1" stopColor="#ff9a3c" stopOpacity={0} />
        </radialGradient>
      </defs>
      {lit > 0 && <ellipse cx={x} cy={y - h - 10} rx={170 * glow * (1 + fl * 0.4)} ry={150 * glow * (1 + fl * 0.4)} fill={`url(#cg${id})`} opacity={lit} />}
      <ellipse cx={x} cy={y} rx={16} ry={6} fill="#0d0907" opacity={0.7} />
      <rect x={x - 11} y={y - h} width={22} height={h} rx={3} fill="#d9cdb3" />
      <rect x={x - 11} y={y - h} width={7} height={h} fill="#fff1d6" opacity={0.5} />
      <ellipse cx={x} cy={y - h} rx={11} ry={4} fill="#efe2c6" />
      <path d={`M${x} ${y - h} l0 -8`} stroke="#1a1410" strokeWidth={2.5} />
      {lit > 0 && (
        <g opacity={lit}>
          <path d={`M${x - 7} ${y - h - 8} Q${x - 8} ${y - h - 8 - fh * 0.5} ${x + sway} ${y - h - 8 - fh} Q${x + 8} ${y - h - 8 - fh * 0.5} ${x + 7} ${y - h - 8} Q${x} ${y - h - 2} ${x - 7} ${y - h - 8} Z`} fill="#ffc46b" />
          <ellipse cx={x} cy={y - h - 13} rx={3.5} ry={7} fill="#fff6dc" />
        </g>
      )}
    </g>
  );
};

/** Smoke curl rising from a point; a = 0..1 amount, k = progress for drift. */
export const Smoke: React.FC<{ x: number; y: number; a: number; k: number; seed?: number }> = ({ x, y, a, k, seed = 0 }) => {
  const d = Array.from({ length: 9 }, (_, i) => {
    const yy = y - i * 34 - k * 40;
    const xx = x + Math.sin(i * 0.8 + k * 3 + seed) * (6 + i * 5);
    return `${i === 0 ? 'M' : 'L'}${xx.toFixed(1)} ${yy.toFixed(1)}`;
  }).join(' ');
  return <path d={d} stroke="#9fb2cc" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.35 * a} />;
};

/** Jelangkung doll. (x,y) = pencil tip; s scale; rot degrees. */
export const Doll: React.FC<{ x: number; y: number; s?: number; rot?: number; light?: number }> = ({ x, y, s = 1, rot = 0, light = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {/* pencil */}
    <path d="M-4 0 L4 0 L5 -40 L-5 -40 Z" fill="#c9a24a" />
    <path d="M-1.5 0 L1.5 0 L0 6 Z" fill="#222" />
    <path d="M-7 -44 L7 -44" stroke="#b9a98a" strokeWidth={4} />
    {/* stick body */}
    <rect x={-6} y={-200} width={12} height={160} fill="#3e2c1b" />
    {/* cloth */}
    <path d="M-34 -160 L34 -160 L44 -70 Q0 -60 -44 -70 Z" fill="#8a7a63" />
    <path d="M-34 -160 L-10 -160 L-18 -66 L-44 -70 Z" fill="#a8977a" opacity={0.6 * light} />
    {/* arms stick */}
    <rect x={-70} y={-170} width={140} height={10} rx={4} fill="#3e2c1b" />
    {/* coconut-shell head */}
    <ellipse cx={0} cy={-205} rx={34} ry={32} fill="#5a4128" />
    <path d="M-30 -196 Q0 -186 30 -196" stroke="#3a2a19" strokeWidth={3} fill="none" />
    <path d="M-26 -222 Q-8 -238 14 -232" stroke="#ffc46b" strokeWidth={3} fill="none" opacity={0.6 * light} />
    <circle cx={-10} cy={-208} r={3.5} fill="#1a120b" />
    <circle cx={10} cy={-208} r={3.5} fill="#1a120b" />
  </g>
);

/** Paper sheet lying on the floor (perspective quad) with scrawl. */
export const Paper: React.FC<{ x: number; y: number; light?: number; marks?: number }> = ({ x, y, light = 1, marks = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-130 -50 L120 -60 L150 50 L-150 60 Z" fill="#e9e1cf" opacity={0.55 + 0.45 * light} />
    <g stroke="#2a2018" strokeWidth={3} fill="none" opacity={0.7 * marks} strokeLinecap="round">
      <path d="M-90 -20 q20 -18 40 0 t40 0 t30 -6" />
      <path d="M-100 12 q24 -14 46 4 t50 -4 t40 6" />
      <path d="M-60 36 q14 -10 30 0 t30 0" />
    </g>
  </g>
);

/** The shadow on the wall that matches no one: tall, thin, too-long arms. */
export const WallShadow: React.FC<{ x: number; y: number; s?: number; o?: number; arm?: number }> = ({ x, y, s = 1, o = 0.8, arm = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill="#07080a">
    <ellipse cx={0} cy={-560} rx={46} ry={60} />
    <path d="M-20 -505 Q-70 -480 -78 -400 L-64 -40 Q-30 0 0 0 Q30 0 64 -40 L78 -400 Q70 -480 20 -505 Z" />
    <path d={`M-70 -440 Q-140 ${-300 + arm * 40} ${-150 - arm * 60} ${-120 + arm * 60} L${-136 - arm * 60} ${-110 + arm * 60} Q-110 -300 -58 -410 Z`} />
    <path d="M70 -440 Q130 -300 136 -120 L120 -116 Q104 -300 58 -410 Z" />
    {/* long fingers */}
    <path d={`M${-150 - arm * 60} ${-120 + arm * 60} l-8 70 M${-145 - arm * 60} ${-118 + arm * 60} l6 72 M${-142 - arm * 60} ${-116 + arm * 60} l-24 60`} stroke="#07080a" strokeWidth={6} strokeLinecap="round" />
  </g>
);
