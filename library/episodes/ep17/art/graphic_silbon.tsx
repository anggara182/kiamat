import React from 'react';

/** El Silbón: impossibly tall thin silhouette, wide-brim hat, sack over the right shoulder.
 *  Feet at (x, y), total height ≈ 1000*s. `rim` = moon rim-light opacity. `sack` = sack highlight 0..1. */
export const Silbon: React.FC<{ x: number; y: number; s: number; rim?: number; sack?: number; fill?: string; step?: number }> = ({ x, y, s, rim = 0.6, sack = 0, fill = '#050607', step = 0 }) => {
  const sw = Math.sin(step) * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* legs: long, thin, slight stride */}
      <path d={`M -14 -470 L ${-30 + sw} -10 L ${-8 + sw} -10 L 2 -440 L 10 -440 L ${26 - sw} -10 L ${48 - sw} -10 L 22 -470 Z`} fill={fill} />
      {/* bare long feet */}
      <path d={`M ${-30 + sw} -14 L ${-62 + sw} 0 L ${-6 + sw} 0 Z M ${26 - sw} -14 L ${74 - sw} 0 L ${50 - sw} -12 Z`} fill={fill} />
      {/* torso: narrow, shoulders slightly wider, hunched */}
      <path d="M -20 -470 L -34 -760 Q -40 -800 -10 -812 L 34 -810 Q 52 -800 46 -760 L 26 -470 Z" fill={fill} />
      {/* left arm hanging very long */}
      <path d="M -30 -790 Q -52 -640 -50 -470 Q -48 -400 -54 -360 L -40 -356 Q -34 -420 -34 -480 Q -30 -640 -14 -760 Z" fill={fill} />
      <path d="M -54 -362 Q -60 -330 -52 -318 L -40 -330 L -36 -352 Z" fill={fill} />
      {/* right arm up to the sack */}
      <path d="M 38 -792 Q 70 -760 78 -700 L 64 -694 Q 56 -746 30 -770 Z" fill={fill} />
      {/* sack on back/shoulder */}
      <path d="M 36 -806 Q 70 -840 96 -812 Q 104 -800 92 -786 Q 150 -760 156 -690 Q 160 -616 108 -604 Q 62 -598 52 -650 Q 46 -720 76 -780 Q 54 -790 36 -806 Z" fill={fill} />
      <path d="M 70 -818 L 92 -844 L 104 -836 L 86 -810 Z" fill={fill} />
      {/* neck + head */}
      <rect x={-2} y={-846} width={20} height={40} fill={fill} />
      <ellipse cx={8} cy={-866} rx={22} ry={28} fill={fill} />
      {/* wide-brim hat */}
      <path d="M -78 -878 Q 8 -900 96 -876 Q 100 -868 90 -866 Q 8 -884 -72 -868 Q -84 -870 -78 -878 Z" fill={fill} />
      <path d="M -26 -880 Q -24 -930 8 -936 Q 42 -930 42 -882 Z" fill={fill} />
      {/* moon rim light on the left edges */}
      <g fill="none" stroke="#f3ecd2" strokeLinecap="round" opacity={rim}>
        <path d="M -34 -760 Q -40 -800 -10 -812" strokeWidth={3} />
        <path d="M -76 -878 Q 8 -900 96 -876" strokeWidth={3} />
        <path d="M -24 -884 Q -22 -928 8 -934" strokeWidth={2.5} />
        <path d="M -30 -790 Q -52 -640 -50 -470" strokeWidth={2.5} />
        <path d={`M -14 -470 L ${-30 + sw} -10`} strokeWidth={2} />
        <path d="M 96 -790 Q 150 -760 156 -690" strokeWidth={3} />
      </g>
      {sack > 0 && (
        <g opacity={sack}>
          <path d="M 96 -790 Q 150 -760 156 -690 Q 160 -616 108 -604" fill="none" stroke="#f2c14e" strokeWidth={5} strokeLinecap="round" />
          {/* bone shapes poking from sack mouth */}
          <path d="M 92 -830 L 104 -896 M 100 -826 L 134 -884" stroke="#d8cfbd" strokeWidth={8} strokeLinecap="round" />
          <circle cx={100} cy={-900} r={8} fill="#d8cfbd" /><circle cx={110} cy={-898} r={8} fill="#d8cfbd" /><circle cx={132} cy={-892} r={8} fill="#d8cfbd" /><circle cx={140} cy={-882} r={8} fill="#d8cfbd" />
        </g>
      )}
    </g>
  );
};

/** Simple eighth note glyph centered at (x,y), height ≈ 80*s. */
export const Note: React.FC<{ x: number; y: number; s?: number; fill?: string; o?: number }> = ({ x, y, s = 1, fill = '#f2c14e', o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={-10} cy={28} rx={16} ry={11} transform="rotate(-22 -10 28)" fill={fill} />
    <rect x={3} y={-44} width={5} height={72} fill={fill} />
    <path d="M 8 -44 Q 34 -30 30 -4 Q 26 -20 8 -24 Z" fill={fill} />
  </g>
);
