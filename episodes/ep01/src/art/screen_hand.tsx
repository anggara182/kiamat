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

/**
 * Extreme close-up thumb: SHORT and WIDE, base (MCP crease) at (0,0), pointing +x, with the thenar mound behind it.
 * Lt ~ 175 local, width ~ 124 local (thumb reads ~1.4x longer than wide). +y edge is lit.
 */
export const ThumbECU: React.FC<{ id: string; Lt?: number; rim?: string }> = ({ id, Lt = 175, rim = '#fff1d6' }) => {
  const { skin, shade, lit, deep, nail, nailHi } = SKIN;
  const th = `M-6 -60 C40 -66 ${Lt - 70} -62 ${Lt - 30} -54 Q${Lt + 16} -44 ${Lt + 18} 0 Q${Lt + 16} 48 ${Lt - 34} 58 C${Lt - 80} 66 40 70 -6 66 Z`;
  return (
    <g>
      <defs><clipPath id={`${id}c`}><path d={th} /></clipPath><clipPath id={`${id}h`}><path d="M24 -62 C-40 -84 -200 -96 -460 -70 L-460 360 C-300 350 -160 280 -60 170 C-10 120 20 90 30 66 Z" /></clipPath></defs>
      {/* thenar mound + palm edge going off-frame */}
      <path d="M24 -62 C-40 -84 -200 -96 -460 -70 L-460 360 C-300 350 -160 280 -60 170 C-10 120 20 90 30 66 Z" fill={skin} />
      <g clipPath={`url(#${id}h)`}>
        <path d="M-460 -70 C-260 -100 -80 -86 24 -62 L24 -26 C-90 -40 -260 -44 -460 -20 Z" fill={shade} opacity={0.7} />
        <ellipse cx={-150} cy={70} rx={150} ry={90} fill={lit} opacity={0.35} />
        <path d="M-40 -40 Q-70 30 -40 110" stroke={deep} strokeWidth={4} fill="none" opacity={0.45} />
        <path d="M-260 150 Q-170 120 -90 150" stroke={shade} strokeWidth={5} fill="none" opacity={0.5} />
      </g>
      <path d="M-60 170 C-160 280 -300 350 -460 360" stroke={rim} strokeWidth={4} fill="none" opacity={0.5} />
      {/* the thumb itself */}
      <path d={th} fill={skin} />
      <g clipPath={`url(#${id}c)`}>
        <path d={`M-20 -80 L${Lt + 30} -80 L${Lt + 30} -26 C${Lt - 60} -30 60 -32 -20 -30 Z`} fill={shade} opacity={0.75} />
        <path d={`M14 10 C60 6 ${Lt - 90} 8 ${Lt - 60} 12`} stroke={lit} strokeWidth={20} strokeLinecap="round" fill="none" opacity={0.35} />
        <path d={`M${Lt - 96} -54 Q${Lt - 110} 4 ${Lt - 94} 60 M${Lt - 84} -50 Q${Lt - 96} 4 ${Lt - 82} 54`} stroke={deep} strokeWidth={3.5} fill="none" opacity={0.5} />
        <rect x={Lt - 62} y={-34} width={72} height={64} rx={30} fill={nail} />
        <path d={`M${Lt - 56} -22 Q${Lt - 20} -30 ${Lt + 4} -18`} stroke={nailHi} strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.8} />
        <path d={`M${Lt - 62} -26 Q${Lt - 74} -2 ${Lt - 62} 24`} stroke={shade} strokeWidth={5} fill="none" opacity={0.7} />
      </g>
      <path d={`M10 66 C40 70 ${Lt - 80} 66 ${Lt - 34} 58 Q${Lt + 16} 48 ${Lt + 18} 0`} stroke={rim} strokeWidth={4} fill="none" opacity={0.65} strokeLinecap="round" />
    </g>
  );
};

/**
 * Hand in a suit sleeve gripping an object edge, side/top view. Grip point at (0,0), the arm comes from -x.
 * Draw `part="under"` (fingers below the object) before the object and `part="over"` (sleeve, back of hand, thumb) after it.
 * grip 0..1 closes the thumb onto the object.
 */
export const SuitHand: React.FC<{ part: 'under' | 'over'; grip?: number; skin?: string; shade?: string; suit?: string; suitD?: string; rim?: string }> = ({ part, grip = 1, skin = SKIN.skin, shade = SKIN.shade, suit = '#1f2633', suitD = '#141923', rim = '#f6efe0' }) => {
  if (part === 'under') {
    return (
      <g>
        {/* curled fingers under the edge, mitten with one separation */}
        <path d="M-70 18 C-40 30 20 34 64 40 C92 46 96 82 66 90 C20 98 -40 92 -86 70 Z" fill={skin} />
        <path d="M-80 66 C-30 88 30 92 70 88" stroke={shade} strokeWidth={8} fill="none" opacity={0.7} />
        <path d="M60 46 C36 60 34 74 52 88" stroke={SKIN.deep} strokeWidth={3.5} fill="none" opacity={0.6} />
      </g>
    );
  }
  const ty = -26 + (1 - grip) * -34;
  return (
    <g>
      {/* suit sleeve + shirt cuff */}
      <path d="M-760 -96 L-196 -78 L-186 84 L-760 110 Z" fill={suit} />
      <path d="M-760 60 L-186 50 L-186 84 L-760 110 Z" fill={suitD} />
      <path d="M-760 -96 L-196 -78" stroke={rim} strokeWidth={3} opacity={0.35} />
      <path d="M-200 -74 L-150 -70 L-142 76 L-196 80 Z" fill="#e9e6df" />
      <path d="M-196 54 L-142 52 L-142 76 L-196 80 Z" fill="#b9b5ad" />
      {/* back of the hand */}
      <path d="M-156 -66 C-90 -84 -20 -70 20 -36 C44 -14 44 18 22 34 C-20 52 -100 56 -150 66 Z" fill={skin} />
      <path d="M-150 40 C-100 36 -30 34 22 30 C0 50 -80 58 -150 66 Z" fill={shade} opacity={0.7} />
      <path d="M-140 -60 C-80 -76 -20 -64 16 -36" stroke={rim} strokeWidth={3.5} fill="none" opacity={0.55} />
      {[-90, -54, -20].map((x) => <ellipse key={x} cx={x} cy={-46 + (x + 90) * 0.12} rx={11} ry={6} fill={shade} opacity={0.35} />)}
      {/* thumb pressing on the top of the object */}
      <path d={`M-70 -40 C-30 ${ty - 30} 30 ${ty - 30} 74 ${ty - 18} C94 ${ty - 12} 94 ${ty + 14} 72 ${ty + 18} C30 ${ty + 22} -20 ${ty + 18} -60 4 Z`} fill={skin} />
      <path d={`M-40 ${ty - 22} C0 ${ty - 30} 40 ${ty - 26} 74 ${ty - 18}`} stroke={rim} strokeWidth={3} fill="none" opacity={0.6} />
      <rect x={46} y={ty - 16} width={34} height={22} rx={10} fill={SKIN.nail} opacity={0.9} />
    </g>
  );
};

/** Sleeping man under a blanket, lying on his side with his back to the camera (frame coords, very dark). br = breath 0..1 (on twos). */
export const Sleeper: React.FC<{ br: number; light: number }> = ({ br, light }) => {
  const lift = br * 7;
  const rimC = '#9fc3ea';
  return (
    <g>
      {/* blanket over legs, hip and shoulder; the torso part rises with the breath */}
      <path d={`M-160 500 C40 470 220 ${430 - lift * 0.4} 380 ${400 - lift * 0.8} C470 ${386 - lift} 560 ${396 - lift} 640 ${404 - lift * 0.8} C700 410 740 420 770 440 L800 640 L-160 640 Z`} fill="#121828" />
      <path d={`M-160 500 C40 470 220 ${430 - lift * 0.4} 380 ${400 - lift * 0.8} C470 ${386 - lift} 560 ${396 - lift} 640 ${404 - lift * 0.8} C700 410 740 420 770 440`} stroke={rimC} strokeWidth={3} fill="none" opacity={0.28 * light} />
      <path d={`M120 520 C260 ${480 - lift * 0.3} 420 ${470 - lift * 0.5} 560 ${490 - lift * 0.4}`} stroke="#0a0e18" strokeWidth={10} fill="none" opacity={0.8} />
      <path d={`M300 560 C420 ${530 - lift * 0.3} 520 ${540 - lift * 0.3} 640 560`} stroke="#0a0e18" strokeWidth={8} fill="none" opacity={0.7} />
      {/* shoulder in a dark t-shirt above the blanket edge */}
      <path d={`M620 ${430 - lift * 0.6} C660 ${392 - lift * 0.6} 730 ${384 - lift * 0.5} 772 ${404 - lift * 0.4} L790 470 L640 470 Z`} fill="#1a1f2b" />
      {/* head on the pillow, back of the head toward us (short hair, no face) */}
      <ellipse cx={812} cy={392 - lift * 0.3} rx={58} ry={50} fill="#07080d" />
      <path d={`M760 ${384 - lift * 0.3} C770 ${350 - lift * 0.3} 820 ${336 - lift * 0.3} 858 ${360 - lift * 0.3}`} stroke={rimC} strokeWidth={3} fill="none" opacity={0.3 * light} />
      <path d={`M792 ${438 - lift * 0.3} C800 ${452 - lift * 0.3} 820 ${456 - lift * 0.3} 836 ${444 - lift * 0.3}`} stroke="#1a1f2b" strokeWidth={14} fill="none" />
      {/* forearm lying on top of the blanket, hand hanging toward the desk */}
      <path d={`M700 ${440 - lift * 0.6} C640 ${470 - lift * 0.5} 580 ${492 - lift * 0.4} 520 ${506 - lift * 0.3} L516 ${532 - lift * 0.3} C590 ${520 - lift * 0.4} 660 ${500 - lift * 0.5} 716 ${470 - lift * 0.6} Z`} fill="#1a1f2b" />
      <path d={`M522 ${502 - lift * 0.3} C496 ${504 - lift * 0.3} 470 ${514 - lift * 0.3} 462 ${532 - lift * 0.3} C470 ${546 - lift * 0.3} 500 ${544 - lift * 0.3} 520 ${536 - lift * 0.3} Z`} fill="#3a2c27" />
      <path d={`M462 ${532 - lift * 0.3} C470 ${546 - lift * 0.3} 500 ${544 - lift * 0.3} 520 ${536 - lift * 0.3}`} stroke={rimC} strokeWidth={2.5} fill="none" opacity={0.35 * light} />
      <path d={`M700 ${470 - lift * 0.6} C640 ${498 - lift * 0.5} 580 ${520 - lift * 0.4} 516 ${532 - lift * 0.3}`} stroke={rimC} strokeWidth={2.5} fill="none" opacity={0.3 * light} />
    </g>
  );
};
