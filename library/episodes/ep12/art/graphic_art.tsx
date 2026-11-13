import React from 'react';

/** Glow helper: radial gradient ellipse (id must be unique per shot). */
export const Glow: React.FC<{ id: string; cx: number; cy: number; rx: number; ry?: number; color: string; o?: number }> = ({ id, cx, cy, rx, ry, color, o = 1 }) => (
  <>
    <defs>
      <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={color} stopOpacity={0.85 * o} />
        <stop offset="0.35" stopColor={color} stopOpacity={0.35 * o} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry ?? rx} fill={`url(#${id})`} />
  </>
);

/** Small clay oil lamp (pa-teep) with flame. Origin = base centre. */
export const OilLamp: React.FC<{ x: number; y: number; s?: number; flick?: number; id: string }> = ({ x, y, s = 1, flick = 0, id }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2a1810" />
        <stop offset="0.55" stopColor="#7a4a2a" />
        <stop offset="1" stopColor="#c98a4a" />
      </linearGradient>
      <radialGradient id={`${id}-fl`} cx="0.5" cy="0.7" r="0.6">
        <stop offset="0" stopColor="#fff6dc" />
        <stop offset="0.45" stopColor="#ffc46b" />
        <stop offset="1" stopColor="#ff8a2a" stopOpacity={0.9} />
      </radialGradient>
    </defs>
    {/* foot */}
    <path d="M -46 0 Q -50 -18 -30 -24 L 30 -24 Q 50 -18 46 0 Z" fill={`url(#${id}-clay)`} />
    {/* bowl */}
    <path d="M -96 -40 Q -90 -10 -30 -22 L 30 -22 Q 92 -10 112 -46 Q 60 -56 -96 -40 Z" fill={`url(#${id}-clay)`} />
    {/* spout lip + oil rim highlight */}
    <path d="M -94 -42 Q 10 -58 112 -46" fill="none" stroke="#ffcf8a" strokeWidth={4} opacity={0.85} />
    <path d="M 96 -48 L 128 -56" stroke="#7a4a2a" strokeWidth={10} strokeLinecap="round" />
    {/* wick */}
    <path d="M 122 -56 L 128 -70" stroke="#1a0f08" strokeWidth={4} />
    {/* flame */}
    <g transform={`translate(128 -70) rotate(${flick * 6}) scale(${1 + flick * 0.06} ${1 - flick * 0.05})`}>
      <path d="M 0 0 Q -20 -22 -6 -52 Q 0 -70 4 -86 Q 10 -64 16 -48 Q 22 -18 0 0 Z" fill={`url(#${id}-fl)`} />
      <path d="M 2 -4 Q -6 -16 1 -30 Q 7 -16 2 -4 Z" fill="#9fd0ff" opacity={0.7} />
    </g>
  </g>
);

/** Wilted jasmine garland (phuang malai) lying on a sill. Origin = left end. */
export const Garland: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const buds: React.ReactNode[] = [];
  for (let i = 0; i < 52; i++) {
    const u = (i % 26) / 25;
    const bx = u * 420;
    const by = -10 * Math.sin(u * Math.PI) + (i % 2 ? 5 : -4) - (i >= 26 ? 14 : 0);
    const droop = 0.4 + 0.6 * ((i * 37) % 11) / 11;
    buds.push(
      <g key={i} transform={`translate(${bx} ${by}) rotate(${(i * 53) % 40 - 20})`}>
        <ellipse cx={0} cy={0} rx={17} ry={11} fill={i % 3 === 0 ? '#9c8a5e' : '#e6dab8'} stroke="#6a5a3a" strokeWidth={1.5} />
        <ellipse cx={-3} cy={-3} rx={6} ry={3} fill="#f2e6c4" opacity={0.6 * droop} />
      </g>,
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={210} cy={14} rx={240} ry={16} fill="#000" opacity={0.45} />
      {buds}
      {/* red rose tassel knot + fallen petals, faded */}
      <circle cx={430} cy={2} r={16} fill="#6e2626" />
      <path d="M 430 14 Q 440 40 470 46 M 432 16 Q 434 44 452 58" stroke="#8a2e2e" strokeWidth={5} fill="none" strokeLinecap="round" />
      <ellipse cx={500} cy={12} rx={8} ry={4} fill="#b8a77e" opacity={0.8} />
      <ellipse cx={-30} cy={14} rx={7} ry={3.5} fill="#b8a77e" opacity={0.7} />
    </g>
  );
};

/** Lime (manao) half + leaf, used as motif. Origin = centre. */
export const Lime: React.FC<{ x: number; y: number; s?: number; id: string }> = ({ x, y, s = 1, id }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <radialGradient id={`${id}-l`} cx="0.65" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#d6f07a" />
        <stop offset="0.6" stopColor="#6f9a2a" />
        <stop offset="1" stopColor="#24360c" />
      </radialGradient>
    </defs>
    <path d="M -10 -58 Q 30 -110 86 -96 Q 50 -60 -10 -58 Z" fill="#2f4a14" />
    <path d="M -6 -60 Q 36 -84 80 -94" stroke="#5f7a2a" strokeWidth={3} fill="none" />
    <ellipse cx={0} cy={0} rx={72} ry={62} fill={`url(#${id}-l)`} />
    <ellipse cx={22} cy={-26} rx={18} ry={9} fill="#f6ffd0" opacity={0.45} transform="rotate(-25 22 -26)" />
    <path d="M -60 18 Q -20 70 50 44" stroke="#ffc46b" strokeWidth={4} fill="none" opacity={0.7} />
  </g>
);

/** Woman seen from behind/three-quarter, very long hair, Thai dress. Origin = feet centre. Height ~ 1000*s. */
export const Woman: React.FC<{ x: number; y: number; s?: number; sway?: number; rim?: string }> = ({ x, y, s = 1, sway = 0, rim = '#ffc46b' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* body: pha sin skirt + sabai top, back view */}
    <path d="M -40 -610 Q -110 -600 -126 -560 Q -132 -500 -110 -440 Q -88 -330 -70 -260 Q -96 -120 -110 0 L 110 0 Q 96 -120 70 -260 Q 88 -330 110 -440 Q 132 -500 126 -560 Q 110 -600 40 -610 Z" fill="#0b0705" />
    <path d="M -70 -560 Q -100 -500 -96 -420 Q -88 -330 -70 -260 Q -96 -120 -110 0 L 110 0 Q 96 -120 70 -260 Q 88 -330 96 -420 Q 100 -500 70 -560 Q 40 -600 0 -604 Q -40 -600 -70 -560 Z" fill="#0b0705" />
    {/* skirt band (gold, very dark) */}
    <path d="M -84 -300 Q 0 -286 84 -300 L 86 -280 Q 0 -266 -86 -280 Z" fill="#4a3a18" />
    {/* neck + head */}
    <path d="M -20 -600 L -18 -650 L 18 -650 L 20 -600 Z" fill="#0b0705" />
    <ellipse cx={0} cy={-712} rx={58} ry={72} fill="#0b0705" />
    {/* hair: one big long shape down past the waist */}
    <path d={`M -60 -740 Q -70 -790 0 -790 Q 70 -790 62 -730 Q 92 -600 96 -470 Q 104 -330 ${80 + sway * 10} -190 Q 40 -200 0 -180 Q -40 -200 ${-84 + sway * 10} -200 Q -106 -340 -96 -480 Q -92 -620 -60 -740 Z`} fill="#050302" />
    {/* hair strands */}
    {[-70, -40, -10, 20, 50, 74].map((hx, i) => (
      <path key={i} d={`M ${hx * 0.5} -760 Q ${hx} -500 ${hx * 1.1 + sway * (6 + i * 2)} ${-200 + (i % 2) * 18}`} stroke="#1a110b" strokeWidth={3} fill="none" opacity={0.8} />
    ))}
    <path d="M 4 -790 Q 52 -786 62 -740" stroke={rim} strokeWidth={4} fill="none" opacity={0.75} />
    <path d="M -8 -786 Q -4 -700 -12 -620" stroke="#2a1a10" strokeWidth={3} fill="none" />
    {/* arms down at sides */}
    <path d="M -118 -560 Q -148 -420 -134 -290 L -114 -290 Q -118 -420 -100 -520 Z" fill="#0b0705" />
    <path d="M 118 -560 Q 148 -420 134 -290 L 114 -290 Q 118 -420 100 -520 Z" fill="#0b0705" />
    <path d="M 60 -606 Q 118 -598 126 -560 Q 148 -420 134 -296" stroke={rim} strokeWidth={3} fill="none" opacity={0.7} />
    {/* rim light from lamp (right side) */}
    <path d="M 58 -770 Q 82 -700 66 -730 Q 92 -600 96 -470 Q 104 -330 82 -194" stroke={rim} strokeWidth={4} fill="none" opacity={0.85} />
    <path d="M 118 -440 Q 126 -380 118 -300" stroke={rim} strokeWidth={3} fill="none" opacity={0.6} />
    <path d="M 74 -250 Q 96 -120 108 -4" stroke={rim} strokeWidth={3} fill="none" opacity={0.55} />
  </g>
);
