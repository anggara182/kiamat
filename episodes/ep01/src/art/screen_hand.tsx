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
export const HoldFront: React.FC<{ id: string; flick?: number; rim?: string; fidget?: number }> = ({ id, flick = 0, rim = '#fff1d6', fidget = 0 }) => {
  const { skin, shade, lit, deep } = SKIN;
  // fingertips are not identical and never frozen: each lobe has its own size and a small independent shift (pass a twos clock)
  const a = 4 * Math.sin(fidget * 2.3), b = 5 * Math.sin(fidget * 1.7 + 2), c = 4 * Math.sin(fidget * 2.9 + 4);
  const fingers = `M-322 74 C-310 60 -282 56 -266 74 C${-228 + a} 88 ${-228 + a} 178 -264 194 C${-238 + b} 210 ${-238 + b} 288 -266 302 C${-244 + c} 318 ${-246 + c} 386 -272 404 C-290 426 -314 426 -328 410 C-340 300 -338 180 -322 74 Z`;
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
 * Hand in a suit sleeve gripping an object edge, seen from the side/slightly below. Grip point at (0,0), the arm comes from -x.
 * Draw `part="under"` (curled fingers below the object) before the object and `part="over"` (sleeve, back of hand, thumb) after it.
 * grip 0..1 closes the thumb onto the object; open 0..1 spreads the fingers away from it (reaching, letting go).
 */
export const SuitHand: React.FC<{ part: 'under' | 'over'; grip?: number; open?: number; skin?: string; shade?: string; suit?: string; suitD?: string; rim?: string }> = ({ part, grip = 1, open = 0, skin = SKIN.skin, shade = SKIN.shade, suit = '#1f2633', suitD = '#141923', rim = '#f6efe0' }) => {
  const deep = SKIN.deep;
  if (part === 'under') {
    // three curled fingertips under the edge (index, middle, ring), two separations; they drop away when open
    const tips = [
      { x: 70, y: 52, r: 22 }, { x: 44, y: 70, r: 22 }, { x: 12, y: 80, r: 20 },
    ];
    return (
      <g transform={`rotate(${open * 18} -90 30)`}>
        <path d="M-96 26 C-60 20 0 22 40 26 C78 30 98 46 92 66 C86 90 50 102 0 100 C-40 98 -80 88 -104 70 Z" fill={skin} />
        {tips.map((f, i) => <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={skin} />)}
        <path d="M-100 74 C-50 96 10 104 60 92" stroke={shade} strokeWidth={9} fill="none" opacity={0.65} />
        <path d="M58 40 C46 52 40 64 46 84 M26 50 C16 64 14 80 24 98" stroke={deep} strokeWidth={3.5} fill="none" opacity={0.65} strokeLinecap="round" />
        {tips.map((f, i) => <path key={i} d={`M${f.x + f.r * 0.2} ${f.y - f.r * 0.9} q${f.r * 0.7} ${f.r * 0.2} ${f.r * 0.8} ${f.r * 0.8}`} stroke={SKIN.lit} strokeWidth={4} fill="none" opacity={0.6} />)}
      </g>
    );
  }
  const ty = -24 - (1 - grip) * 30;
  return (
    <g>
      {/* suit sleeve with a fold, shirt cuff */}
      <path d="M-760 -96 L-196 -80 L-186 84 L-760 110 Z" fill={suit} />
      <path d="M-760 60 L-186 50 L-186 84 L-760 110 Z" fill={suitD} />
      <path d="M-520 -88 Q-470 -10 -500 100 M-330 -84 Q-300 0 -320 94" stroke={suitD} strokeWidth={8} fill="none" opacity={0.7} />
      <path d="M-760 -96 L-196 -80" stroke={rim} strokeWidth={3} opacity={0.35} />
      <path d="M-200 -76 L-150 -72 L-142 76 L-196 80 Z" fill="#e9e6df" />
      <path d="M-196 54 L-142 52 L-142 76 L-196 80 Z" fill="#b9b5ad" />
      {/* wrist + back of the hand, knuckle bumps along the front, index finger curling down toward the edge */}
      <path d="M-150 -64 C-118 -78 -70 -82 -40 -76 C-28 -86 -10 -86 0 -74 C10 -82 26 -78 32 -64 C44 -56 52 -40 48 -22 C58 -6 56 16 44 30 C30 46 0 50 -30 48 C-80 50 -120 58 -150 64 Z" fill={skin} />
      <path d="M-150 40 C-100 34 -40 34 20 36 C0 50 -80 56 -150 64 Z" fill={shade} opacity={0.65} />
      <path d="M-150 -64 C-118 -78 -70 -82 -40 -76 C-28 -86 -10 -86 0 -74 C10 -82 26 -78 32 -64" stroke={rim} strokeWidth={3.5} fill="none" opacity={0.55} />
      <path d="M-40 -74 C-46 -50 -44 -30 -36 -14 M0 -72 C-4 -50 -2 -32 6 -18" stroke={shade} strokeWidth={3} fill="none" opacity={0.55} />
      <path d="M48 -22 C64 -4 66 18 54 36" stroke={deep} strokeWidth={3} fill="none" opacity={0.5} />
      <path d="M-146 -40 C-138 -10 -138 20 -146 44" stroke={shade} strokeWidth={4} fill="none" opacity={0.5} />
      {/* thumb pressing on top of the object: two segments, a joint crease, a nail */}
      <path d={`M-74 -36 C-40 ${ty - 30} 20 ${ty - 34} 56 ${ty - 24} C80 ${ty - 18} 94 ${ty - 6} 92 ${ty + 8} C90 ${ty + 20} 74 ${ty + 24} 56 ${ty + 22} C20 ${ty + 22} -26 ${ty + 20} -64 4 Z`} fill={skin} />
      <path d={`M-48 ${ty - 22} C-10 ${ty - 32} 30 ${ty - 30} 56 ${ty - 24}`} stroke={rim} strokeWidth={3} fill="none" opacity={0.6} />
      <path d={`M24 ${ty - 26} Q18 ${ty - 2} 24 ${ty + 22}`} stroke={deep} strokeWidth={3} fill="none" opacity={0.5} />
      <path d={`M52 ${ty - 18} Q76 ${ty - 18} 84 ${ty - 4} Q84 ${ty + 8} 70 ${ty + 8} Q52 ${ty + 8} 50 ${ty - 4} Z`} fill={SKIN.nail} />
      <path d={`M56 ${ty - 14} Q72 ${ty - 16} 80 ${ty - 6}`} stroke={SKIN.nailHi} strokeWidth={3} fill="none" opacity={0.8} />
    </g>
  );
};

/** Sleeping man under a blanket, lying on his side with his back to the camera (frame coords, very dark). br = breath 0..1 (on twos). */
export const Sleeper: React.FC<{ br: number; light: number }> = ({ br, light }) => {
  const lift = br * 7;
  const rimC = '#9fc3ea';
  return (
    <g>
      {/* blanket over legs, hip and shoulder; the chest part rises with the breath */}
      <path d={`M-160 520 C-20 500 120 440 260 384 C340 360 420 ${388 - lift * 0.5} 500 ${400 - lift} C580 ${398 - lift} 640 ${374 - lift} 700 ${380 - lift * 0.8} C740 388 770 410 780 440 L800 640 L-160 640 Z`} fill="#1a2234" />
      <path d={`M-160 520 C-20 500 120 440 260 384 C340 360 420 ${388 - lift * 0.5} 500 ${400 - lift} C580 ${398 - lift} 640 ${374 - lift} 700 ${380 - lift * 0.8}`} stroke={rimC} strokeWidth={4} fill="none" opacity={0.6 * light} />
      <path d={`M150 470 C240 ${430 - lift * 0.2} 380 ${430 - lift * 0.4} 520 ${470 - lift * 0.5}`} stroke="#0a0e18" strokeWidth={10} fill="none" opacity={0.8} />
      <path d={`M280 540 C400 ${510 - lift * 0.3} 520 ${520 - lift * 0.3} 660 540`} stroke="#0a0e18" strokeWidth={8} fill="none" opacity={0.7} />
      {/* shoulder in a dark t-shirt above the blanket edge */}
      <path d={`M660 ${396 - lift * 0.7} C690 ${366 - lift * 0.6} 740 ${364 - lift * 0.5} 780 ${384 - lift * 0.4} L796 460 L670 460 Z`} fill="#232a3a" />
      {/* head on the pillow, back of the head toward us (short hair, no face) */}
      <path d={`M770 ${414 - lift * 0.3} C762 ${366 - lift * 0.3} 804 ${346 - lift * 0.3} 846 ${352 - lift * 0.3} C888 ${362 - lift * 0.3} 892 ${420 - lift * 0.3} 866 ${446 - lift * 0.3} C838 ${462 - lift * 0.3} 786 ${456 - lift * 0.3} 770 ${414 - lift * 0.3} Z`} fill="#0b0c12" />
      <path d={`M772 ${398 - lift * 0.3} C780 ${362 - lift * 0.3} 824 ${346 - lift * 0.3} 866 ${370 - lift * 0.3}`} stroke={rimC} strokeWidth={4} fill="none" opacity={0.6 * light} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${790 + i * 18} ${368 - lift * 0.3 + i * 2} q10 ${-6} 22 ${-2}`} stroke="#2a3348" strokeWidth={3} fill="none" opacity={0.8 * light} />)}
      {/* forearm lying on top of the blanket, hand hanging toward the desk */}
      <path d={`M700 ${440 - lift * 0.6} C640 ${470 - lift * 0.5} 580 ${492 - lift * 0.4} 520 ${506 - lift * 0.3} L516 ${532 - lift * 0.3} C590 ${520 - lift * 0.4} 660 ${500 - lift * 0.5} 716 ${470 - lift * 0.6} Z`} fill="#1a1f2b" />
      <path d={`M522 ${502 - lift * 0.3} C496 ${504 - lift * 0.3} 470 ${514 - lift * 0.3} 462 ${532 - lift * 0.3} C470 ${546 - lift * 0.3} 500 ${544 - lift * 0.3} 520 ${536 - lift * 0.3} Z`} fill="#3a2c27" />
      <path d={`M462 ${532 - lift * 0.3} C470 ${546 - lift * 0.3} 500 ${544 - lift * 0.3} 520 ${536 - lift * 0.3}`} stroke={rimC} strokeWidth={2.5} fill="none" opacity={0.35 * light} />
      <path d={`M700 ${470 - lift * 0.6} C640 ${498 - lift * 0.5} 580 ${520 - lift * 0.4} 516 ${532 - lift * 0.3}`} stroke={rimC} strokeWidth={2.5} fill="none" opacity={0.3 * light} />
    </g>
  );
};
