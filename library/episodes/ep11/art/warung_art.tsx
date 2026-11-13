import React from 'react';

/** Uncle (sarong + singlet), seen from behind/side, standing. Origin = feet centre-ish; drawn ~1 unit = 1 px. bulb rim from the right. */
export const Uncle: React.FC<{ x: number; y: number; s?: number; turn?: number; rim?: string }> = ({ x, y, s = 1, turn = 0, rim = '#ffd27a' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* sarong (mostly hidden by counter) */}
    <path d="M-120 0 C-125 -150 -118 -260 -105 -330 L105 -330 C118 -260 125 -150 120 0 Z" fill="#3b2f4a" />
    <path d="M-60 -320 L-40 -10 M20 -325 L40 -5" stroke="#2a2236" strokeWidth={10} />
    {/* sarong knot */}
    <path d="M-110 -330 Q0 -350 110 -330 L108 -300 Q0 -318 -108 -300 Z" fill="#4a3b5c" />
    {/* torso: singlet */}
    <path d="M-110 -330 C-118 -420 -125 -500 -118 -560 C-110 -600 -60 -615 0 -615 C60 -615 110 -600 118 -560 C125 -500 118 -420 110 -330 Z" fill="#cfc6b4" />
    <path d="M40 -610 C90 -600 112 -560 118 -520 C122 -460 116 -400 110 -330 L80 -330 C90 -420 92 -520 40 -610 Z" fill="#9c927f" opacity={0.5} />
    {/* arms (skin) bent forward toward counter */}
    <path d="M-118 -560 C-150 -540 -165 -470 -150 -400 C-140 -360 -100 -350 -60 -360 L-70 -395 C-100 -395 -115 -420 -112 -470 Z" fill="#7a5340" />
    <path d="M118 -560 C150 -540 168 -470 160 -410 C150 -365 110 -350 70 -358 L78 -392 C108 -392 122 -425 116 -480 Z" fill="#6c4836" />
    {/* shoulders skin above singlet straps */}
    <path d="M-118 -560 C-110 -600 -70 -615 -40 -615 L-55 -585 C-80 -585 -100 -575 -118 -560 Z" fill="#7a5340" />
    <path d="M118 -560 C110 -600 70 -615 40 -615 L55 -585 C80 -585 100 -575 118 -560 Z" fill="#6c4836" />
    {/* neck + head (back/side), bit of grey hair */}
    <rect x={-28} y={-660} width={56} height={60} rx={20} fill="#6c4836" />
    <g transform={`rotate(${turn * 14} 0 -700)`}>
      <ellipse cx={turn * 10} cy={-715} rx={62} ry={72} fill="#5e3e2e" />
      <path d={`M${-60 + turn * 10} -730 C${-55 + turn * 10} -800 ${65 + turn * 10} -800 ${62 + turn * 10} -735 C${40 + turn * 10} -770 ${-30 + turn * 10} -770 ${-60 + turn * 10} -730 Z`} fill="#2a2420" />
      <ellipse cx={-62 + turn * 70} cy={-712} rx={10} ry={16} fill="#5a3a2a" />
      {/* rim */}
      <path d={`M${50 + turn * 10} -775 C${70 + turn * 10} -740 ${70 + turn * 10} -690 ${48 + turn * 10} -655`} stroke={rim} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
    <path d="M118 -560 C150 -540 168 -470 160 -410" stroke={rim} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
    <path d="M60 -612 C100 -604 116 -580 118 -540" stroke={rim} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
  </g>
);

/** Tuyul: small bald child, upright crouch facing left. Origin = ground under feet; ~195 units tall at s=1. sq = vertical squash (ducking). */
export const Tuyul: React.FC<{ x: number; y: number; s?: number; sq?: number; fill?: string; rim?: string }> = ({ x, y, s = 1, sq = 1, fill = '#07090e', rim = '#9fb8d4' }) => (
  <g transform={`translate(${x} ${y}) scale(${s} ${s * sq})`}>
    {/* back leg (squat) */}
    <path d="M22 -58 L34 -30 L30 0" stroke={fill} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 0 h22" stroke={fill} strokeWidth={10} strokeLinecap="round" />
    {/* torso: narrow shoulders, round child belly, upright */}
    <path d="M-14 -118 C-4 -126 22 -126 30 -116 C38 -98 40 -76 34 -56 C28 -42 6 -38 -8 -44 C-26 -52 -30 -74 -24 -92 C-22 -104 -20 -112 -14 -118 Z" fill={fill} />
    {/* front leg: knee forward, shin down */}
    <path d="M0 -50 L-30 -46 L-24 0" stroke={fill} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M-34 0 h22" stroke={fill} strokeWidth={10} strokeLinecap="round" />
    {/* thin arm reaching forward to the gap, small mitten hand with fingers */}
    <path d="M-8 -108 L-36 -84 L-62 -66" stroke={fill} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx={-68} cy={-62} rx={9} ry={7} fill={fill} />
    <path d="M-72 -60 l-9 5 M-73 -64 l-10 1" stroke={fill} strokeWidth={4} strokeLinecap="round" />
    {/* back arm hanging */}
    <path d="M22 -110 L30 -86 L22 -66" stroke={fill} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* thin neck + BIG round bald head (~1/4 of height) */}
    <rect x={-4} y={-136} width={14} height={20} fill={fill} />
    <circle cx={2} cy={-160} r={36} fill={fill} />
    <ellipse cx={-30} cy={-150} rx={8} ry={6} fill={fill} />
    <ellipse cx={30} cy={-158} rx={7} ry={12} fill={fill} />
    {/* moon rim: bald crown, ear, back, belly, knee */}
    <path d="M-28 -182 C-14 -200 22 -202 36 -176" stroke={rim} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M37 -166 C40 -158 38 -150 34 -146" stroke={rim} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M30 -116 C38 -98 40 -76 34 -56" stroke={rim} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.85} />
    <path d="M-30 -46 L-24 -2" stroke={rim} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.6} />
    <path d="M-36 -84 L-62 -66" stroke={rim} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
    {/* big dark eye with pale glint */}
    <ellipse cx={-20} cy={-162} rx={9} ry={11} fill="#020305" />
    <circle cx={-23} cy={-165} r={3} fill="#a9b8a6" />
  </g>
);

/** Clay bowl of water; optional crab. glint = 0..1 */
export const Bowl: React.FC<{ x: number; y: number; s?: number; crab?: boolean; glint?: number; light?: string }> = ({ x, y, s = 1, crab = true, glint = 0.6, light = '#9fb8d4' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={92} ry={16} fill="#000" opacity={0.45} />
    <path d="M-80 -40 C-78 -5 -40 8 0 8 C40 8 78 -5 80 -40 Z" fill="#6e3e26" />
    <path d="M20 6 C50 0 76 -12 80 -40 L60 -40 C58 -18 42 -4 20 6 Z" fill="#4a2818" />
    <ellipse cx={0} cy={-40} rx={80} ry={16} fill="#8a5034" />
    <ellipse cx={0} cy={-38} rx={68} ry={11} fill="#9fc6d6" opacity={0.85} />
    <ellipse cx={0} cy={-36} rx={68} ry={9} fill="#2f4c5a" opacity={0.6} />
    {crab && (
      <g transform="translate(0 -40)" fill="#c4553a">
        <ellipse cx={0} cy={0} rx={20} ry={8} />
        <path d="M-18 -2 L-32 -10 L-38 -4 M18 -2 L32 -10 L38 -4" stroke="#c4553a" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    )}
    <ellipse cx={-22} cy={-41} rx={26} ry={3} fill={light} opacity={glint} />
    <path d="M-70 -46 C-40 -56 30 -56 60 -48" stroke={light} strokeWidth={3} fill="none" opacity={glint * 0.8} />
  </g>
);
