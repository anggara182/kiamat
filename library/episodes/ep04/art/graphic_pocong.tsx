import React from 'react';

/**
 * Pocong figure, local coords: feet centre at (0,0), top of the knot tuft at y≈-770, height ≈ 770.
 * mode: 'lit' (cold light from above), 'dark' (black bg, single rim from the right).
 */
export const PocongFigure: React.FC<{ id: string; x: number; y: number; s: number; mode?: 'lit' | 'dark'; tuft?: number; rot?: number }> = ({ id, x, y, s, mode = 'lit', tuft = 0, rot = 0 }) => {
  const dark = mode === 'dark';
  const body = 'M -60 -650 C -72 -600 -72 -576 -48 -560 C -112 -540 -126 -500 -121 -440 C -118 -350 -108 -250 -100 -150 C -93 -92 -82 -72 -70 -60 C -92 -30 -98 -8 -82 0 L 82 0 C 98 -8 92 -30 70 -60 C 82 -72 93 -92 100 -150 C 108 -250 118 -350 121 -440 C 126 -500 112 -540 48 -560 C 72 -576 72 -600 60 -650 C 50 -692 -50 -692 -60 -650 Z';
  const tw = tuft * 4;
  const tuftC = `M -14 -684 C -20 -698 -34 -708 ${-52 + tw} -712 C ${-50 + tw} -728 -34 -738 -18 -730 C ${-20 + tw * 0.6} -752 ${-6 + tw} -764 ${6 + tw} -760 C 12 -748 12 -738 12 -730 C 24 -744 ${42 + tw} -744 ${54 + tw} -730 C 40 -720 22 -704 14 -684 Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="1" y2="0">
          {dark ? (<>
            <stop offset="0" stopColor="#07080d" /><stop offset="0.55" stopColor="#151821" /><stop offset="0.86" stopColor="#4a5060" /><stop offset="1" stopColor="#c9d4ea" />
          </>) : (<>
            <stop offset="0" stopColor="#6c7284" /><stop offset="0.35" stopColor="#c4c3bb" /><stop offset="0.55" stopColor="#e9e4d6" /><stop offset="1" stopColor="#7c8294" />
          </>)}
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dark ? '#000' : '#ffffff'} stopOpacity={dark ? 0 : 0.35} />
          <stop offset="0.35" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#05060c" stopOpacity={dark ? 0.2 : 0.35} />
        </linearGradient>
      </defs>
      {/* tuft above the head (hero detail) */}
      <path d={tuftC} fill={`url(#${id}-cloth)`} />
      <g fill="none" stroke={dark ? '#000' : '#8a8f9e'} strokeWidth={2} strokeLinecap="round" opacity={0.8}>
        <path d={`M -6 -688 C -10 -704 -20 -716 ${-40 + tw} -714`} />
        <path d={`M 0 -690 C -2 -712 0 -734 ${4 + tw} -752`} />
        <path d={`M 6 -688 C 14 -704 26 -722 ${44 + tw} -732`} />
      </g>
      <path d={body} fill={`url(#${id}-cloth)`} />
      <path d={body} fill={`url(#${id}-top)`} />
      {/* face opening */}
      <ellipse cx={0} cy={-614} rx={24} ry={32} fill="#06070c" />
      <ellipse cx={0} cy={-610} rx={17} ry={23} fill="#000" />
      {/* folds */}
      <g fill="none" stroke={dark ? '#000' : '#7f8597'} strokeOpacity={dark ? 0.6 : 0.55} strokeLinecap="round" strokeWidth={3}>
        <path d="M -60 -520 C -50 -460 -64 -380 -54 -320" />
        <path d="M 30 -520 C 42 -450 30 -380 44 -320" />
        <path d="M -40 -280 C -30 -200 -46 -130 -36 -72" />
        <path d="M 50 -280 C 58 -200 46 -140 52 -74" />
        <path d="M -36 -664 C -40 -640 -46 -600 -44 -572" />
        <path d="M 34 -664 C 40 -640 44 -600 42 -572" />
        <path d="M -20 -682 C -10 -676 10 -676 20 -682" strokeWidth={4} />
      </g>
      {/* ties: head knot, neck, waist, ankles */}
      {[[-686, 20, 7], [-561, 54, 10], [-300, 112, 12], [-62, 74, 10]].map(([cy, rx, ry], i) => (
        <g key={i}>
          <path d={`M ${-rx} ${cy - ry * 0.4} Q 0 ${cy + ry * 1.2} ${rx} ${cy - ry * 0.4} L ${rx} ${cy + ry * 0.6} Q 0 ${cy + ry * 2.2} ${-rx} ${cy + ry * 0.6} Z`} fill={dark ? '#1b1d25' : '#bdb6a4'} />
          <path d={`M ${-rx} ${cy + ry * 0.6} Q 0 ${cy + ry * 2.2} ${rx} ${cy + ry * 0.6}`} fill="none" stroke={dark ? '#000' : '#6d6a60'} strokeWidth={2.5} />
          {i > 0 ? <path d={`M ${rx * 0.15} ${cy + ry} l ${8} ${ry * 2.4} l ${7} ${-ry * 0.6} Z M ${rx * 0.15} ${cy + ry} l ${-6} ${ry * 2.2} l ${-8} ${-ry * 0.8} Z`} fill={dark ? '#20232c' : '#aba591'} /> : null}
        </g>
      ))}
      {/* rim light */}
      {dark ? (
        <g fill="none" stroke="#dfe8ff" strokeLinecap="round">
          <path d="M 60 -650 C 72 -600 72 -576 48 -560 C 112 -540 126 -500 121 -440 C 118 -350 108 -250 100 -150" strokeWidth={3.5} strokeOpacity={0.9} />
          <path d={`M 12 -730 C 24 -744 ${42 + tw} -744 ${54 + tw} -730 C 40 -720 22 -704 14 -684`} strokeWidth={2.5} strokeOpacity={0.9} />
          <path d={`M ${-6 + tw} -764 C ${6 + tw} -760 12 -748 12 -730`} strokeWidth={2} strokeOpacity={0.75} />
          <path d="M 22 -688 C 40 -690 58 -676 60 -650" strokeWidth={2.5} strokeOpacity={0.7} />
        </g>
      ) : (
        <g fill="none" stroke="#f4f7ff" strokeLinecap="round" strokeOpacity={0.8} strokeWidth={3}>
          <path d="M -50 -676 C -20 -692 20 -692 50 -676" />
          <path d="M -108 -528 C -80 -548 -60 -552 -48 -556" />
          <path d="M 108 -528 C 80 -548 60 -552 48 -556" />
          <path d={`M ${-52 + tw} -712 C ${-50 + tw} -728 -34 -738 -18 -730 C ${-20 + tw * 0.6} -752 ${-6 + tw} -764 ${6 + tw} -760`} strokeWidth={2} />
        </g>
      )}
    </g>
  );
};

/** Knotted cloth band motif (horizontal strip with a knot in the middle). Centre (0,0), width ≈ w. */
export const KnotBand: React.FC<{ w: number; reveal: number; tight?: number }> = ({ w, reveal, tight = 0 }) => {
  const h = w / 2;
  const L = h * reveal;
  return (
    <g>
      <defs>
        <linearGradient id="kb-cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4efe2" /><stop offset="0.5" stopColor="#d9d3c3" /><stop offset="1" stopColor="#8f95a6" />
        </linearGradient>
        <linearGradient id="kb-fadeL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9e4d6" stopOpacity={0} /><stop offset="1" stopColor="#e9e4d6" stopOpacity={1} />
        </linearGradient>
        <radialGradient id="kb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffcc4d" stopOpacity={0.28} /><stop offset="1" stopColor="#ffcc4d" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={200} ry={110} fill="url(#kb-glow)" />
      {/* two cloth ends running into the knot */}
      <path d={`M ${-L} -10 C ${-L * 0.6} -18 -80 -4 -40 -14 L -40 16 C -80 22 ${-L * 0.6} 10 ${-L} 16 Z`} fill="url(#kb-cloth)" opacity={0.95} />
      <path d={`M ${L} -12 C ${L * 0.6} -4 80 -20 40 -14 L 40 16 C 80 10 ${L * 0.6} 22 ${L} 14 Z`} fill="url(#kb-cloth)" opacity={0.95} />
      {/* knot */}
      <g transform={`scale(${1 - 0.06 * tight})`}>
        <path d="M -46 -26 C -20 -44 22 -44 46 -24 C 56 -4 52 18 40 30 C 14 44 -18 44 -42 30 C -56 14 -58 -8 -46 -26 Z" fill="url(#kb-cloth)" />
        <path d="M -30 -30 C -10 -6 8 10 34 30" fill="none" stroke="#8f8a7a" strokeWidth={4} strokeLinecap="round" />
        <path d="M -40 10 C -20 4 0 -10 20 -34" fill="none" stroke="#a7a190" strokeWidth={3} strokeLinecap="round" />
        {/* loose tails */}
        <path d="M 8 32 C 18 70 10 96 30 124 C 40 104 34 72 26 32 Z" fill="url(#kb-cloth)" />
        <path d="M -12 32 C -26 64 -36 84 -56 104 C -36 104 -18 76 -2 34 Z" fill="url(#kb-cloth)" />
        <path d="M -40 -24 C -22 -40 20 -40 40 -22" fill="none" stroke="#fffaf0" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
      </g>
    </g>
  );
};
