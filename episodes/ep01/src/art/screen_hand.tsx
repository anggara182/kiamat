import React from 'react';

/** Adult hand palette (STYLE.md): warm skin, work-shirt sleeve. */
export const SKIN = { skin: '#b07a5e', shade: '#7a4f3e', lit: '#cf9779', deep: '#4f3026', nail: '#c99682', nailHi: '#efcdb9' };
export const SLEEVE = { c: '#3c4a5c', d: '#2a3544' };

/**
 * Thumb seen from the nail side, base (MCP joint) at (0,0), pointing toward +x, length Lt.
 * Local +y edge faces the light (rim), -y edge is the shadow side.
 */
export const Thumb: React.FC<{ id: string; Lt?: number; rim?: string; rimOp?: number; detail?: number }> = ({ id, Lt = 262, rim = '#fff1d6', rimOp = 0.6, detail = 1 }) => {
  const d = `M-14 -50 C60 -54 150 -48 ${Lt - 46} -40 Q${Lt + 6} -38 ${Lt + 8} 0 Q${Lt + 6} 38 ${Lt - 46} 42 C150 50 60 58 -14 56 Z`;
  const { skin, shade, lit, deep, nail, nailHi } = SKIN;
  return (
    <g>
      <defs><clipPath id={`${id}c`}><path d={d} /></clipPath></defs>
      <path d={d} fill={skin} />
      <g clipPath={`url(#${id}c)`}>
        {/* shadow side (-y) and a soft core highlight */}
        <path d={`M-20 -60 L${Lt + 20} -60 L${Lt + 20} -16 C${Lt - 60} -22 150 -24 -20 -22 Z`} fill={shade} opacity={0.75} />
        <path d={`M20 6 C120 2 ${Lt - 120} 4 ${Lt - 70} 8`} stroke={lit} strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.35} />
        {/* interphalangeal crease */}
        <path d={`M${Lt - 128} -40 Q${Lt - 140} 2 ${Lt - 126} 46 M${Lt - 116} -36 Q${Lt - 126} 2 ${Lt - 114} 40`} stroke={deep} strokeWidth={3} fill="none" opacity={0.45 * detail} />
        {/* nail */}
        <rect x={Lt - 86} y={-27} width={84} height={52} rx={24} fill={nail} />
        <path d={`M${Lt - 80} -18 Q${Lt - 40} -24 ${Lt - 10} -14`} stroke={nailHi} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.8} />
        <path d={`M${Lt - 86} -20 Q${Lt - 96} -1 ${Lt - 86} 20`} stroke={shade} strokeWidth={4} fill="none" opacity={0.7} />
        <path d={`M${Lt - 6} -18 Q${Lt + 4} 0 ${Lt - 6} 18`} stroke={nailHi} strokeWidth={3} fill="none" opacity={0.6 * detail} />
      </g>
      {/* rim on the lit edge */}
      <path d={`M10 56 C80 58 150 50 ${Lt - 46} 42 Q${Lt + 6} 38 ${Lt + 8} 0`} stroke={rim} strokeWidth={4} fill="none" opacity={rimOp} strokeLinecap="round" />
    </g>
  );
};

/** Parts of a right hand holding the phone that sit BEHIND the phone (phone-local coords, phone 540x1120 centred). */
export const HoldBack: React.FC<{ rim?: string }> = ({ rim = '#fff1d6' }) => {
  const { skin, shade } = SKIN;
  return (
    <g>
      {/* wrist, then the work-shirt sleeve foreshortened toward the camera (down-right) */}
      <path d="M-40 700 L200 640 L262 830 L0 890 Z" fill={skin} />
      <path d="M-40 700 L0 890 L44 880 L12 710 Z" fill={shade} opacity={0.55} />
      <path d="M-24 850 L256 786 L720 1400 L40 1640 Z" fill={SLEEVE.c} />
      <path d="M-24 850 L256 786 L272 838 L-8 904 Z" fill={SLEEVE.d} />
      <path d="M110 910 Q170 1170 190 1580 M330 890 Q430 1090 540 1440" stroke={SLEEVE.d} strokeWidth={10} fill="none" opacity={0.6} />
      <path d="M256 786 L720 1400" stroke={rim} strokeWidth={4} opacity={0.45} />
      {/* heel of the palm under the phone */}
      <path d="M-236 470 C-238 560 -196 660 -100 720 C-30 756 84 770 180 730 C240 700 300 620 300 470 Z" fill={skin} />
      <path d="M-200 650 C-140 720 -40 760 60 762 C-40 778 -150 740 -210 668 Z" fill={shade} opacity={0.7} />
      <path d="M-20 740 L-6 790 M176 676 L196 730" stroke={shade} strokeWidth={6} opacity={0.5} />
      {/* little finger tucked under the bottom edge */}
      <path d="M-282 548 C-286 586 -250 606 -200 604 L-110 596 L-110 548 Z" fill={skin} />
      <path d="M-282 560 C-284 590 -250 606 -200 604" stroke={shade} strokeWidth={6} fill="none" opacity={0.8} />
      <path d="M-226 600 C-224 590 -226 576 -232 566" stroke={SKIN.deep} strokeWidth={3} fill="none" opacity={0.5} />
    </g>
  );
};

/** Parts IN FRONT of the phone: three fingertips wrapping the left edge (mitten, 2 separations), thenar + thumb on the right. */
export const HoldFront: React.FC<{ id: string; flick?: number; rim?: string }> = ({ id, flick = 0, rim = '#fff1d6' }) => {
  const { skin, shade, lit, deep } = SKIN;
  const fingers = 'M-322 74 C-310 60 -282 58 -266 76 C-234 92 -234 176 -264 192 C-236 206 -236 290 -264 304 C-238 318 -240 392 -270 408 C-288 428 -312 428 -326 414 C-338 300 -338 180 -322 74 Z';
  const thenar = 'M332 664 C354 544 352 404 320 300 C302 252 262 238 228 256 C214 300 222 420 236 520 C246 600 272 652 332 664 Z';
  return (
    <g>
      <defs><clipPath id={`${id}fc`}><path d={fingers} /></clipPath></defs>
      {/* fingers */}
      <path d={fingers} fill={skin} />
      <g clipPath={`url(#${id}fc)`}>
        <rect x={-350} y={40} width={74} height={420} fill={shade} opacity={0.62} />
        <path d="M-252 102 Q-244 134 -252 166 M-252 218 Q-244 248 -252 280 M-258 330 Q-250 360 -260 390" stroke={lit} strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.6} />
      </g>
      <path d="M-264 192 Q-290 196 -318 186 M-264 304 Q-292 308 -320 298" stroke={deep} strokeWidth={4} fill="none" opacity={0.8} strokeLinecap="round" />
      <path d="M-322 74 C-338 180 -338 300 -326 414" stroke={rim} strokeWidth={4} fill="none" opacity={0.5} />
      {/* thenar pad over the right edge */}
      <path d={thenar} fill={skin} />
      <path d="M236 520 C246 600 272 652 332 664 C290 640 262 600 250 520 Z" fill={shade} opacity={0.6} />
      <path d="M332 664 C354 544 352 404 320 300" stroke={rim} strokeWidth={4} fill="none" opacity={0.55} />
      {/* thumb over the screen; flick rotates it up around its base joint */}
      <g transform={`translate(256 300) rotate(${-152 + 18 * flick})`}>
        <Thumb id={`${id}t`} Lt={262 - 12 * flick} rim={rim} />
      </g>
    </g>
  );
};

/** Extreme close-up hand mass behind the thumb base, in Thumb-local coords (draw before <Thumb>). */
export const ThumbHand: React.FC<{ rim?: string }> = ({ rim = '#fff1d6' }) => {
  const { skin, shade } = SKIN;
  return (
    <g>
      <path d="M30 -50 C-60 -62 -220 -72 -440 -44 L-440 300 C-300 300 -150 240 -40 132 C0 100 28 74 40 56 Z" fill={skin} />
      <path d="M30 -50 C-60 -62 -220 -72 -440 -44 L-440 -4 C-260 -30 -100 -30 10 -24 Z" fill={shade} opacity={0.7} />
      <path d="M-40 132 C-150 240 -300 300 -440 300" stroke={rim} strokeWidth={4} fill="none" opacity={0.5} />
      <path d="M-120 60 C-200 80 -280 90 -360 86" stroke={shade} strokeWidth={5} fill="none" opacity={0.35} strokeLinecap="round" />
    </g>
  );
};
