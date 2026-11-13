import React from 'react';

/** Grandma's bed (closer, hero for shot 5/10): blanket shape with body lump, head on pillow, hand with IV line. */
export const GrandmaBed: React.FC<{ x: number; y: number; s?: number; t?: number; light?: string; dark?: string; rim?: string }> = ({ x, y, s = 1, t = 0, light = '#c9d6d2', dark = '#5d726e', rim = '#dff7f2' }) => {
  const br = Math.sin(t * 1.6) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-330} y={-300} width={26} height={300} fill="#0b1213" />
      <rect x={300} y={-200} width={22} height={200} fill="#0b1213" />
      <path d="M -320 -150 L 320 -150 L 330 -100 L -320 -100 Z" fill="#0e1718" />
      <ellipse cx={-230} cy={-188} rx={90} ry={34} fill={dark} />
      {/* head: small grey hair shape */}
      <ellipse cx={-215} cy={-212} rx={44} ry={36} fill="#8a958f" />
      <path d="M -255 -215 Q -215 -258 -175 -220" stroke={rim} strokeWidth={3} fill="none" opacity={0.7} />
      {/* blanket body */}
      <path d={`M -190 -150 Q -170 ${-210 - br} -60 ${-212 - br} Q 80 -214 140 -190 Q 230 -200 270 -170 L 300 -150 Z`} fill={light} />
      <path d={`M -100 -150 Q -40 ${-180 - br} 60 -165 Q 120 -150 170 -150`} stroke={dark} strokeWidth={6} fill="none" opacity={0.5} />
      <path d={`M 150 -190 Q 200 -170 230 -150`} stroke={dark} strokeWidth={5} fill="none" opacity={0.5} />
      <path d={`M -190 -150 Q -170 ${-210 - br} -60 ${-212 - br} Q 80 -214 140 -190 Q 230 -200 270 -170`} stroke={rim} strokeWidth={4} fill="none" opacity={0.8} />
      <path d="M -300 -150 L 320 -150 L 316 -120 L -300 -120 Z" fill={dark} />
      {/* wrinkled hand outside blanket with IV line */}
      <path d="M -40 -160 Q -10 -168 20 -162 L 26 -152 Q -6 -150 -40 -152 Z" fill="#b07a62" />
      <path d="M -10 -164 Q -60 -260 -110 -560" stroke="#9fc0b8" strokeWidth={2} fill="none" opacity={0.6} />
    </g>
  );
};

/** Narrator on a plastic chair, from behind: hoodie silhouette, head tilted (asleep when sleep=1). */
export const Narrator: React.FC<{ x: number; y: number; s?: number; t?: number; sleep?: number; rim?: string; fill?: string }> = ({ x, y, s = 1, t = 0, sleep = 0, rim = '#4dffb0', fill = '#070c0d' }) => {
  const br = Math.sin(t * 1.4) * 3;
  const tilt = -6 + sleep * 22;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* chair */}
      <path d="M -120 -40 L 120 -40 L 112 -10 L -112 -10 Z" fill="#1d3b4a" />
      <path d="M -110 -10 L -126 140 M 110 -10 L 126 140 M -80 -10 L -90 140 M 80 -10 L 90 140" stroke="#122733" strokeWidth={10} />
      <path d="M -110 -40 L -120 -260 Q 0 -290 120 -260 L 110 -40 Z" fill="#1a3442" />
      {/* torso */}
      <path d={`M -105 -30 Q -125 ${-200 + br} -85 ${-300 + br} Q 0 ${-340 + br} 85 ${-300 + br} Q 125 ${-200 + br} 105 -30 Z`} fill={fill} />
      <path d={`M 85 ${-300 + br} Q 125 ${-200 + br} 105 -30`} stroke={rim} strokeWidth={4} fill="none" opacity={0.75} />
      {/* head */}
      <g transform={`translate(0 ${-330 + br}) rotate(${tilt})`}>
        <rect x={-20} y={-20} width={40} height={30} fill={fill} />
        <ellipse cx={0} cy={-70} rx={56} ry={64} fill={fill} />
        <path d="M -50 -100 Q -10 -150 40 -120 Q 60 -100 58 -70" fill={fill} />
        {[-30, -10, 10, 30].map((d) => <path key={d} d={`M ${d} -128 q 8 -14 18 -6`} stroke={fill} strokeWidth={6} fill="none" />)}
        <path d="M 30 -126 Q 60 -100 56 -60" stroke={rim} strokeWidth={4} fill="none" opacity={0.8} />
      </g>
    </g>
  );
};

/** Monitor on a stand with glowing screen + heartbeat line. */
export const Monitor: React.FC<{ x: number; y: number; s?: number; t?: number; glow?: string }> = ({ x, y, s = 1, t = 0, glow = '#4dffb0' }) => {
  const ph = (t * 90) % 160;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-6} y={0} width={12} height={360} fill="#0b1213" />
      <rect x={-90} y={-120} width={180} height={130} rx={8} fill="#0b1213" />
      <rect x={-76} y={-108} width={152} height={100} fill="#08251a" />
      <path d={`M -76 -58 L ${-76 + ph - 30} -58 L ${-76 + ph - 22} -86 L ${-76 + ph - 14} -36 L ${-76 + ph - 6} -58 L ${-76 + ph} -58`} stroke={glow} strokeWidth={3} fill="none" />
      <text x={30} y={-20} fill={glow} fontSize={22} fontFamily="monospace">72</text>
    </g>
  );
};

/** Wall clock showing hh:mm. */
export const Clock: React.FC<{ x: number; y: number; r?: number; h?: number; m?: number; face?: string }> = ({ x, y, r = 60, h = 2, m = 0, face = '#b9c7c3' }) => {
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 6} fill="#0b1213" />
      <circle r={r} fill={face} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-2} y={-r + 6} width={4} height={10} fill="#1b2a2e" transform={`rotate(${i * 30})`} />)}
      <rect x={-4} y={-r * 0.5} width={8} height={r * 0.5} fill="#0b1213" transform={`rotate(${ha})`} />
      <rect x={-2.5} y={-r * 0.8} width={5} height={r * 0.8} fill="#0b1213" transform={`rotate(${ma})`} />
      <circle r={6} fill="#0b1213" />
    </g>
  );
};

/** A tube light: fixture + lit tube + radial glow (o drives brightness). */
export const Tube: React.FC<{ x: number; y: number; w?: number; o: number; id: string; c?: string }> = ({ x, y, w = 260, o, id, c = '#dff7f2' }) => (
  <g>
    <defs><radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={0.5} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient></defs>
    <ellipse cx={x} cy={y + 60} rx={w * 1.3} ry={w * 0.9} fill={`url(#${id})`} opacity={o} />
    <rect x={x - w / 2} y={y} width={w} height={14} rx={6} fill={c} opacity={0.15 + 0.85 * o} />
  </g>
);
