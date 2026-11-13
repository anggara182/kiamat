import React from 'react';


/** A girl (~13) seen from behind walking, silhouette with warm rim light. (x,y)=feet centre, h=height. */
export const WalkGirl: React.FC<{ x: number; y: number; h: number; phase?: number; hair?: 'long' | 'pony' | 'bob'; rim?: number; side?: number; stride?: number; rimCol?: string; collar?: number; bag?: boolean }> = ({ x, y, h, phase = 0, hair = 'long', rim = 1, side = 0, stride = 1, rimCol = '#ffc46b', collar = 0.3, bag = false }) => {
  const s = h / 600;
  const sw = Math.sin(phase) * 18 * stride;
  const bob = Math.abs(Math.sin(phase)) * 4;
  const R = rimCol;
  return (
    <g transform={`translate(${x},${y - bob * s}) scale(${s})`}>
      {/* legs (pyjama trousers) */}
      <path d={`M -38 -270 L ${-52 + sw} -10 L ${-22 + sw} -6 L -6 -250 Z`} fill="#07090d" />
      <path d={`M 6 -250 L ${22 - sw} -6 L ${52 - sw} -10 L 38 -270 Z`} fill="#07090d" />
      {/* torso: pyjama top, shoulders wider than waist */}
      <path d="M -70 -440 Q -82 -360 -58 -262 L 58 -262 Q 82 -360 70 -440 Q 40 -470 0 -472 Q -40 -470 -70 -440 Z" fill="#0b0d12" />
      {/* pleated uniform skirt */}
      <path d={`M -60 -290 L ${-88 + sw * 0.3} -150 L ${88 - sw * 0.3} -150 L 60 -290 Z`} fill="#0d1019" />
      <path d="M -30 -280 L -40 -156 M 0 -282 L 0 -154 M 30 -280 L 40 -156" stroke="#1d2740" strokeWidth={3} opacity={0.6} />
      {/* arms */}
      <path d={`M -70 -436 Q -92 -360 ${-84 - sw * 0.4} -280 L ${-66 - sw * 0.4} -276 Q -66 -360 -54 -420 Z`} fill="#07090d" />
      <path d={`M 70 -436 Q 92 -360 ${84 + sw * 0.4} -280 L ${66 + sw * 0.4} -276 Q 66 -360 54 -420 Z`} fill="#07090d" />
      {/* sailor collar flap (back view) */}
      <path d="M -46 -468 L 46 -468 L 42 -396 L -42 -396 Z" fill="#c9cfdb" opacity={collar} />
      <path d="M -40 -408 L 40 -408" stroke="#1d2740" strokeWidth={5} opacity={collar} />
      {bag && <><path d="M -60 -450 L 70 -300" stroke="#050608" strokeWidth={9} /><rect x={50} y={-330} width={70} height={90} rx={10} fill="#0a0c12" /></>}
      {/* neck + head */}
      <rect x={-14} y={-500} width={28} height={36} fill="#07090d" />
      <ellipse cx={0} cy={-548} rx={48} ry={56} fill="#090b10" />
      {/* hair */}
      {hair === 'long' && <path d="M -52 -560 Q -50 -612 0 -608 Q 50 -612 52 -560 Q 60 -470 48 -400 Q 0 -388 -48 -400 Q -60 -470 -52 -560 Z" fill="#07090d" />}
      {hair === 'pony' && <><path d="M -50 -556 Q -48 -610 0 -607 Q 48 -610 50 -556 Q 40 -520 0 -514 Q -40 -520 -50 -556 Z" fill="#07090d" /><path d="M -8 -530 Q 18 -480 4 -420 Q -10 -430 -14 -470 Z" fill="#07090d" /></>}
      {hair === 'bob' && <path d="M -56 -560 Q -54 -614 0 -610 Q 54 -614 56 -560 L 54 -500 Q 0 -488 -54 -500 Z" fill="#07090d" />}
      {/* rim light (candle is in front, light wraps the outer edges) */}
      <g stroke={R} fill="none" strokeLinecap="round" opacity={rim}>
        <path d={side <= 0 ? 'M -50 -580 Q -58 -520 -52 -470' : 'M 50 -580 Q 58 -520 52 -470'} strokeWidth={6} opacity={0.85} />
        <path d={side <= 0 ? 'M -72 -430 Q -86 -360 -82 -290' : 'M 72 -430 Q 86 -360 82 -290'} strokeWidth={5} opacity={0.75} />
        <path d={side <= 0 ? 'M -40 -604 Q -10 -614 20 -608' : 'M 40 -604 Q 10 -614 -20 -608'} strokeWidth={3} opacity={0.45} />
        <path d={side <= 0 ? 'M -56 -250 L -60 -40' : 'M 56 -250 L 60 -40'} strokeWidth={3} opacity={0.3} />
      </g>
      {/* hair strands */}
      {hair === 'long' && <g stroke="#1a1610" strokeWidth={2} fill="none" opacity={0.8}><path d="M -30 -590 Q -36 -500 -30 -410" /><path d="M 0 -600 Q 4 -500 0 -400" /><path d="M 28 -590 Q 34 -500 30 -410" /></g>}
    </g>
  );
};
