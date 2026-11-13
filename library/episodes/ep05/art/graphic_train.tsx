import React from 'react';

/** HERO: front of the ghost train, centred at (x, y) = middle of the windshield. Frame-space units. */
export const TrainFront: React.FC<{ x: number; y: number; s: number; glow: number }> = ({ x, y, s, glow }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <linearGradient id="gt-body" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5d6672" />
        <stop offset="0.22" stopColor="#b9c2cc" />
        <stop offset="0.6" stopColor="#9aa4b0" />
        <stop offset="1" stopColor="#3c434e" />
      </linearGradient>
      <linearGradient id="gt-glass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff8e6" />
        <stop offset="0.7" stopColor="#fff3d6" />
        <stop offset="1" stopColor="#f2d9a8" />
      </linearGradient>
      <radialGradient id="gt-lamp" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffffff" stopOpacity={1} />
        <stop offset="0.25" stopColor="#d9f0ff" stopOpacity={0.85} />
        <stop offset="1" stopColor="#5a7a96" stopOpacity={0} />
      </radialGradient>
    </defs>
    {/* body */}
    <path d="M -270 -250 Q -270 -330 -180 -340 L 180 -340 Q 270 -330 270 -250 L 285 300 L -285 300 Z" fill="url(#gt-body)" />
    {/* rim light on the roof edge + left side */}
    <path d="M -262 -250 Q -262 -322 -180 -332 L 180 -332 Q 262 -322 262 -250" fill="none" stroke="#e8f6ff" strokeWidth={6} opacity={0.85} />
    <path d="M -266 -240 L -280 296" stroke="#d9f0ff" strokeWidth={4} opacity={0.6} />
    {/* destination sign */}
    <rect x={-150} y={-305} width={300} height={56} rx={6} fill="#0b0d12" />
    <rect x={-138} y={-293} width={276} height={32} rx={3} fill="#fff3d6" opacity={0.18 + 0.1 * glow} />
    <rect x={-60} y={-282} width={120} height={10} rx={2} fill="#fff3d6" opacity={0.75} />
    {/* windshield with interior glow + two faint passenger heads */}
    <path d="M -225 -225 L 225 -225 Q 235 -225 233 -212 L 220 40 L -220 40 L -233 -212 Q -235 -225 -225 -225 Z" fill="#1b1e25" />
    <path d="M -210 -210 L -10 -210 L -10 28 L -206 28 Z" fill="url(#gt-glass)" />
    <path d="M 10 -210 L 210 -210 L 206 28 L 10 28 Z" fill="url(#gt-glass)" />
    {[[-120, -60], [110, -64]].map(([hx, hy], i) => (
      <g key={i} opacity={0.42}>
        <ellipse cx={hx} cy={hy} rx={30} ry={38} fill="#c9c2b4" />
        <path d={`M ${hx - 62} 28 Q ${hx - 56} ${hy + 40} ${hx} ${hy + 44} Q ${hx + 56} ${hy + 40} ${hx + 62} 28 Z`} fill="#8e8778" />
        <ellipse cx={hx - 11} cy={hy - 4} rx={4} ry={5} fill="#2a2620" />
        <ellipse cx={hx + 11} cy={hy - 4} rx={4} ry={5} fill="#2a2620" />
      </g>
    ))}
    {/* glare streaks */}
    <path d="M -190 -205 L -150 -205 L -200 -40 L -206 -60 Z" fill="#ffffff" opacity={0.35} />
    <path d="M 40 -205 L 70 -205 L 22 -80 L 14 -100 Z" fill="#ffffff" opacity={0.25} />
    {/* dark livery band */}
    <path d="M -279 80 L 279 80 L 282 165 L -282 165 Z" fill="#4a5260" />
    <path d="M -279 80 L 279 80" stroke="#cfd8e2" strokeWidth={3} opacity={0.7} />
    {/* headlights */}
    {[-185, 185].map((hx) => (
      <g key={hx}>
        <rect x={hx - 48} y={98} width={96} height={48} rx={14} fill="#1b1e25" />
        <ellipse cx={hx} cy={122} rx={34} ry={18} fill="#f4fbff" />
      </g>
    ))}
    {/* lower skirt + coupler */}
    <path d="M -285 300 L 285 300 L 260 360 L -260 360 Z" fill="#2a2f38" />
    <rect x={-60} y={300} width={120} height={60} rx={8} fill="#15171d" />
    <rect x={-22} y={330} width={44} height={40} rx={4} fill="#0b0c10" />
    {/* wiper + number */}
    <path d="M -40 26 L -150 -40" stroke="#15171d" strokeWidth={7} strokeLinecap="round" />
    <text x={0} y={240} textAnchor="middle" fontSize={44} fontFamily="monospace" fill="#2a2f38" fontWeight={700}>K 0013</text>
    {/* headlight glows (no filters: radial gradients) */}
    {[-185, 185].map((hx) => <ellipse key={hx} cx={hx} cy={122} rx={170 + 40 * glow} ry={120 + 30 * glow} fill="url(#gt-lamp)" opacity={0.75} />)}
  </g>
);
