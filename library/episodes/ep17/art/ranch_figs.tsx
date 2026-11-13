import React from 'react';

/** Ranch figures, drawn in unit space: feet at y=0, top at y=-100, x centred. Scale with transform. */
type Fig = { x: number; y: number; s: number; flip?: boolean; fill?: string; shirt?: string; rim?: string; children?: React.ReactNode };

export const Grandpa: React.FC<Fig & { arm?: number }> = ({ x, y, s, flip, fill = '#0d0b0a', shirt, rim, arm = 0 }) => {
  const sh = shirt ?? fill;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s / 100} ${s / 100})`}>
      {/* legs */}
      <path d="M-8.5,-47 L-7.5,-1 L-2,-1 L0,-38 L2,-1 L7.5,-1 L8.5,-47 Z" fill={fill} />
      <path d="M-9,-1 L-1.5,-1 L-1.5,0.6 L-10,0.6 Z M1.5,-1 L9,-1 L10,0.6 L1.5,0.6 Z" fill={fill} />
      {/* torso shirt */}
      <path d="M-11,-76 Q0,-80 11,-76 L10,-46 Q0,-44 -10,-46 Z" fill={sh} />
      <path d="M-10.5,-49 L10.5,-49 L10.5,-45 L-10.5,-45 Z" fill={fill} />
      {/* back arm hanging */}
      <path d="M-10,-75 Q-14,-62 -13,-48 L-10,-48 Q-10,-60 -7,-70 Z" fill={sh} />
      <ellipse cx={-11.5} cy={-46} rx={2.2} ry={3} fill={fill} />
      {/* front arm: rotates out (lantern arm) */}
      <g transform={`rotate(${-arm} 9 -74)`}>
        <path d="M8,-75 Q13,-62 12.5,-50 L9.5,-50 Q9.5,-60 6,-70 Z" fill={sh} />
        <ellipse cx={11} cy={-48} rx={2.2} ry={3} fill={fill} />
      </g>
      {/* neck + head + moustache */}
      <rect x={-2.2} y={-81} width={4.4} height={5} fill={fill} />
      <ellipse cx={0.5} cy={-85} rx={4.4} ry={5.4} fill={fill} />
      <path d="M2,-82.5 Q5.5,-82 6,-79.5 Q4,-80.6 2,-80.8 Z" fill={fill} />
      {/* straw hat */}
      <ellipse cx={0} cy={-89} rx={13} ry={2.4} fill={fill} />
      <path d="M-6,-89.5 Q-6.5,-97.5 0,-97.5 Q6.5,-97.5 6,-89.5 Z" fill={fill} />
      {rim && <path d="M-12.6,-89.4 Q0,-87 12.6,-89.4" stroke={rim} strokeWidth={0.9} fill="none" />}
      {rim && <path d="M4.8,-84 Q5.4,-79 3,-78" stroke={rim} strokeWidth={0.8} fill="none" />}
    </g>
  );
};

/** Girl ~12, back/side view, long hair. */
export const Girl: React.FC<Fig> = ({ x, y, s, flip, fill = '#0d0b0a', shirt, rim }) => {
  const d = shirt ?? fill;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s / 100} ${s / 100})`}>
      <path d="M-6,-40 L-5.5,-1 L-1.5,-1 L0,-36 L1.5,-1 L5.5,-1 L6,-40 Z" fill={fill} />
      {/* dress */}
      <path d="M-9,-72 Q0,-75 9,-72 L13,-36 Q0,-33 -13,-36 Z" fill={d} />
      <path d="M-9,-71 Q-13,-58 -12,-46 L-9.5,-46 Q-9,-57 -6,-66 Z M9,-71 Q13,-58 12,-46 L9.5,-46 Q9,-57 6,-66 Z" fill={d} />
      <rect x={-2} y={-78} width={4} height={5} fill={fill} />
      <ellipse cx={0} cy={-84} rx={6.2} ry={7} fill={fill} />
      {/* hair big shape */}
      <path d="M-6.8,-86 Q-7,-92 0,-92 Q7,-92 6.8,-86 Q8.5,-74 6,-60 Q0,-58 -6,-60 Q-8.5,-74 -6.8,-86 Z" fill={fill} />
      {rim && <path d="M6.4,-88 Q8.2,-76 5.8,-61" stroke={rim} strokeWidth={0.9} fill="none" />}
      {rim && <path d="M9.5,-70 Q12.5,-58 11.6,-47" stroke={rim} strokeWidth={0.7} fill="none" />}
    </g>
  );
};

/** Cowering dog, side view lying low: ears back, snout forward, tail tucked. Unit: ~100 long, ground at 0. */
export const Dog: React.FC<Fig & { lift?: number }> = ({ x, y, s, flip, fill = '#0d0b0a', rim, lift = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s / 100} ${s / 100})`} fill={fill}>
    <path d="M-36,-6 Q-42,-30 -18,-33 Q6,-36 22,-30 Q30,-24 28,-8 L-30,-6 Z" />
    <ellipse cx={-24} cy={-12} rx={15} ry={13} />
    <path d="M-36,-3 L-12,-3 L-12,0 L-38,0 Z" />
    <path d="M12,-9 L56,-6 L57,0 L12,0 Z" />
    {/* tucked tail hooking under the haunch */}
    <path d="M-37,-24 Q-52,-14 -42,-3 Q-34,2 -24,-3 L-26,-6 Q-35,-4 -40,-9 Q-45,-16 -34,-20 Z" />
    <g transform={`rotate(${-lift} 26 -26)`}>
      <path d="M18,-32 Q30,-36 38,-28 L36,-14 Q26,-12 20,-18 Z" />
      <ellipse cx={40} cy={-21} rx={11} ry={9} />
      <path d="M46,-26 L64,-15 Q66,-11 62,-10 L46,-13 Z" />
      <circle cx={64} cy={-12} r={2.2} />
      <path d="M34,-27 L24,-40 L41,-29 Z" />
    </g>
    {rim && <path d="M-18,-33 Q6,-36 22,-30" stroke={rim} strokeWidth={1.4} fill="none" />}
    {rim && <path d="M28,-30 L24,-40" stroke={rim} strokeWidth={1} fill="none" />}
  </g>
);

/** Oil lantern with radial glow (glow drawn separately by caller if wanted). */
export const Lantern: React.FC<{ x: number; y: number; s: number; on?: number }> = ({ x, y, s, on = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 100})`}>
    <path d="M-10,-58 Q0,-72 10,-58" stroke="#1a1410" strokeWidth={3} fill="none" />
    <rect x={-16} y={-56} width={32} height={8} fill="#2a1f16" />
    <path d="M-14,-48 L14,-48 L18,-14 L-18,-14 Z" fill="#ffcc7a" opacity={0.35 + 0.65 * on} />
    <ellipse cx={0} cy={-28} rx={6} ry={10} fill="#fff1c9" opacity={on} />
    <path d="M-14,-48 L-18,-14 M14,-48 L18,-14 M0,-48 L0,-14" stroke="#2a1f16" strokeWidth={2.5} />
    <rect x={-20} y={-14} width={40} height={10} fill="#2a1f16" />
  </g>
);

export const Glow: React.FC<{ id: string; x: number; y: number; r: number; color?: string; a?: number }> = ({ id, x, y, r, color = '#ffcc7a', a = 0.6 }) => (
  <>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity={a} />
        <stop offset="0.35" stopColor={color} stopOpacity={a * 0.35} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </>
);
