import React from 'react';

export const COIN = '#d9b25a';
export const BULB = '#ffd27a';
export const SKIN = '#a9b8a6';

/** A coin seen face-on (rx=ry) or tilted (ry<rx). Simple 3-tone with rim. */
export const Coin: React.FC<{ x: number; y: number; r: number; tilt?: number; rot?: number; id: string }> = ({ x, y, r, tilt = 1, rot = 0, id }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <defs>
      <radialGradient id={`coin-${id}`} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#fff1c2" />
        <stop offset="0.45" stopColor={COIN} />
        <stop offset="1" stopColor="#7a5a1e" />
      </radialGradient>
    </defs>
    <ellipse cx={0} cy={r * 0.12 * (1 - tilt) + 4} rx={r} ry={r * tilt} fill="#5a3f14" />
    <ellipse cx={0} cy={0} rx={r} ry={r * tilt} fill={`url(#coin-${id})`} />
    <ellipse cx={0} cy={0} rx={r * 0.74} ry={r * 0.74 * tilt} fill="none" stroke="#8a6624" strokeWidth={Math.max(2, r * 0.06)} opacity={0.7} />
    <path d={`M ${-r * 0.8} ${-r * 0.35 * tilt} A ${r} ${r * tilt} 0 0 1 ${r * 0.3} ${-r * 0.95 * tilt}`} fill="none" stroke="#fff6d8" strokeWidth={Math.max(2, r * 0.07)} opacity={0.8} strokeLinecap="round" />
  </g>
);

/** Tiny bald child-like silhouette, standing, both hands holding a coin at the chest. Feet at (x,y), height ~ 5.2*s*100. */
export const TuyulSil: React.FC<{ x: number; y: number; s: number; lean?: number }> = ({ x, y, s, lean = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${lean})`}>
    {/* body silhouette (feet at 0,0; head top at ~ -520) */}
    <g fill="#0a0c0e">
      {/* legs: short, slightly bowed */}
      <path d="M -62 -200 Q -78 -110 -70 -20 L -96 -4 Q -100 6 -86 8 L -30 8 Q -22 0 -28 -18 Q -26 -110 -10 -190 Z" />
      <path d="M 62 -200 Q 78 -110 70 -20 L 96 -4 Q 100 6 86 8 L 30 8 Q 22 0 28 -18 Q 26 -110 10 -190 Z" />
      {/* torso: round child belly */}
      <path d="M -70 -330 Q -112 -260 -92 -200 Q -60 -170 0 -172 Q 60 -170 92 -200 Q 112 -260 70 -330 Q 40 -350 0 -350 Q -40 -350 -70 -330 Z" />
      {/* neck */}
      <rect x={-22} y={-372} width={44} height={36} />
      {/* big bald head (~1/4 of height) with pointed ears */}
      <ellipse cx={0} cy={-445} rx={86} ry={92} />
      <path d="M -80 -455 Q -118 -478 -112 -430 Q -100 -414 -78 -420 Z" />
      <path d="M 80 -455 Q 118 -478 112 -430 Q 100 -414 78 -420 Z" />
      {/* arms bent forward, hands meeting at chest */}
      <path d="M -72 -322 Q -112 -280 -96 -238 Q -70 -226 -30 -250 L -26 -270 Q -60 -262 -74 -268 Q -78 -296 -56 -318 Z" />
      <path d="M 72 -322 Q 112 -280 96 -238 Q 70 -226 30 -250 L 26 -270 Q 60 -262 74 -268 Q 78 -296 56 -318 Z" />
    </g>
    {/* warm rim light (bulb from upper right) */}
    <g fill="none" stroke={BULB} strokeLinecap="round">
      <path d="M 28 -532 Q 78 -520 86 -460" strokeWidth={7} opacity={0.9} />
      <path d="M 84 -458 Q 112 -476 112 -432" strokeWidth={4} opacity={0.7} />
      <path d="M 74 -326 Q 108 -284 98 -240" strokeWidth={5} opacity={0.65} />
      <path d="M 94 -204 Q 102 -230 104 -250" strokeWidth={4} opacity={0.5} />
      <path d="M 66 -190 Q 78 -110 72 -24" strokeWidth={4} opacity={0.5} />
    </g>
    {/* big dark eyes catching a pin of light */}
    <ellipse cx={-30} cy={-446} rx={15} ry={20} fill="#1a201c" />
    <ellipse cx={30} cy={-446} rx={15} ry={20} fill="#1a201c" />
    <circle cx={-24} cy={-454} r={3} fill={BULB} opacity={0.75} />
    <circle cx={36} cy={-454} r={3} fill={BULB} opacity={0.75} />
    {/* the coin held at chest */}
    <Coin x={0} y={-268} r={44} id="held" />
    {/* small mitten hands gripping the coin's sides */}
    <ellipse cx={-42} cy={-262} rx={18} ry={24} fill="#0a0c0e" />
    <ellipse cx={42} cy={-262} rx={18} ry={24} fill="#0a0c0e" />
  </g>
);

/** Glass marble with swirl, highlights. */
export const Marble: React.FC<{ x: number; y: number; r: number; spin: number }> = ({ x, y, r, spin }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <radialGradient id="marble-g" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#e6fbff" stopOpacity={0.95} />
        <stop offset="0.4" stopColor="#7fc4c9" stopOpacity={0.75} />
        <stop offset="1" stopColor="#1d4a52" stopOpacity={0.95} />
      </radialGradient>
      <clipPath id="marble-c"><circle r={r} /></clipPath>
    </defs>
    <circle r={r} fill="url(#marble-g)" />
    <g clipPath="url(#marble-c)" transform={`rotate(${spin})`}>
      <path d={`M ${-r} ${r * 0.2} Q ${-r * 0.3} ${-r * 0.6} ${r * 0.2} ${r * 0.1} Q ${r * 0.6} ${r * 0.6} ${r} ${-r * 0.1}`} stroke="#4fd28a" strokeWidth={r * 0.28} fill="none" opacity={0.85} />
      <path d={`M ${-r} ${-r * 0.4} Q ${0} ${r * 0.2} ${r} ${-r * 0.6}`} stroke="#ffb347" strokeWidth={r * 0.14} fill="none" opacity={0.7} />
    </g>
    <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.28} ry={r * 0.16} fill="#ffffff" opacity={0.85} transform={`rotate(-30 ${-r * 0.35} ${-r * 0.4})`} />
    <circle r={r} fill="none" stroke={BULB} strokeWidth={3} opacity={0.5} />
  </g>
);

/** Simple crab silhouette, top view, claws up. */
export const Crab: React.FC<{ x: number; y: number; s: number; claw?: number }> = ({ x, y, s, claw = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g stroke="#7a2e1e" strokeWidth={10} strokeLinecap="round" fill="none">
      {[-1, 1].map((d) => [0, 1, 2].map((i) => (
        <path key={`${d}${i}`} d={`M ${d * 60} ${10 + i * 16} Q ${d * (120 + i * 10)} ${-4 + i * 24} ${d * (140 + i * 6)} ${50 + i * 22}`} />
      )))}
    </g>
    {[-1, 1].map((d) => (
      <g key={d} transform={`rotate(${d * -claw * 12} ${d * 50} -20)`}>
        <path d={`M ${d * 50} -20 Q ${d * 90} -70 ${d * 80} -110`} stroke="#9a3a26" strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d={`M ${d * 80} -110 Q ${d * 120} -140 ${d * 100} -180 Q ${d * 84} -150 ${d * 74} -148 Q ${d * 54} -170 ${d * 44} -150 Q ${d * 52} -116 ${d * 80} -110 Z`} fill="#c4553a" />
      </g>
    ))}
    <ellipse cx={0} cy={10} rx={82} ry={56} fill="#c4553a" />
    <ellipse cx={-14} cy={-6} rx={46} ry={22} fill="#e2876a" opacity={0.6} />
    <circle cx={-22} cy={-44} r={8} fill="#1a0e0a" />
    <circle cx={22} cy={-44} r={8} fill="#1a0e0a" />
  </g>
);
