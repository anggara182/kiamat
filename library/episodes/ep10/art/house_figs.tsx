import React from 'react';

/** Hallway perspective: vanishing point + bathroom door at the end. */
export const VP = { x: 648, y: 1020 };
export const DOOR = { x0: 566, x1: 730, y0: 760, y1: 1150 };

/** A girl (~13) seen from behind walking, silhouette with warm rim light. (x,y)=feet centre, h=height. */
export const WalkGirl: React.FC<{ x: number; y: number; h: number; phase?: number; hair?: 'long' | 'pony' | 'bob'; rim?: number; side?: number }> = ({ x, y, h, phase = 0, hair = 'long', rim = 1, side = 0 }) => {
  const s = h / 600;
  const sw = Math.sin(phase) * 18;
  const bob = Math.abs(Math.sin(phase)) * 4;
  const R = '#ffc46b';
  return (
    <g transform={`translate(${x},${y - bob * s}) scale(${s})`}>
      {/* legs (pyjama trousers) */}
      <path d={`M -38 -270 L ${-52 + sw} -10 L ${-22 + sw} -6 L -6 -250 Z`} fill="#07090d" />
      <path d={`M 6 -250 L ${22 - sw} -6 L ${52 - sw} -10 L 38 -270 Z`} fill="#07090d" />
      {/* torso: pyjama top, shoulders wider than waist */}
      <path d="M -70 -440 Q -82 -360 -58 -262 L 58 -262 Q 82 -360 70 -440 Q 40 -470 0 -472 Q -40 -470 -70 -440 Z" fill="#0b0d12" />
      {/* arms */}
      <path d={`M -70 -436 Q -92 -360 ${-84 - sw * 0.4} -280 L ${-66 - sw * 0.4} -276 Q -66 -360 -54 -420 Z`} fill="#07090d" />
      <path d={`M 70 -436 Q 92 -360 ${84 + sw * 0.4} -280 L ${66 + sw * 0.4} -276 Q 66 -360 54 -420 Z`} fill="#07090d" />
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

/** A girl (~13) sitting cross-legged on a sleeping bag, facing camera, warm lit. Face simple. */
export const SitGirl: React.FC<{ x: number; y: number; h: number; pj: string; pjD: string; hair: 'long' | 'pony' | 'bob'; tilt?: number; laugh?: number; skin?: string; arm?: 'up' | 'lap' }> = ({ x, y, h, pj, pjD, hair, tilt = 0, laugh = 0, skin = '#c99a7c', arm = 'lap' }) => {
  const s = h / 520;
  const HL = '#ffd9a0';
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* crossed legs: lap shape */}
      <path d="M -170 -20 Q -180 -90 -90 -110 L 90 -110 Q 180 -90 170 -20 Q 0 10 -170 -20 Z" fill={pjD} />
      <path d="M -160 -40 Q -60 -90 30 -60 M 160 -40 Q 60 -90 -30 -60" stroke={pj} strokeWidth={14} fill="none" opacity={0.7} />
      {/* feet */}
      <ellipse cx={-120} cy={-34} rx={30} ry={16} fill={skin} opacity={0.85} />
      <ellipse cx={120} cy={-34} rx={30} ry={16} fill={skin} opacity={0.85} />
      <g transform={`rotate(${tilt} 0 -110)`}>
        {/* torso */}
        <path d="M -92 -330 Q -110 -220 -84 -104 L 84 -104 Q 110 -220 92 -330 Q 50 -360 0 -362 Q -50 -360 -92 -330 Z" fill={pj} />
        <path d="M 40 -340 Q 96 -240 84 -104 L 50 -104 Q 60 -240 20 -340 Z" fill={pjD} opacity={0.6} />
        {/* collar / buttons */}
        <path d="M -30 -350 L 0 -312 L 30 -350" stroke={pjD} strokeWidth={8} fill="none" />
        {[-290, -250, -210].map((yy) => <circle key={yy} cx={0} cy={yy} r={5} fill={HL} opacity={0.6} />)}
        {/* arms */}
        {arm === 'lap' ? (
          <>
            <path d="M -92 -326 Q -128 -230 -70 -150 L -44 -164 Q -90 -232 -64 -310 Z" fill={pjD} />
            <path d="M 92 -326 Q 128 -230 70 -150 L 44 -164 Q 90 -232 64 -310 Z" fill={pjD} />
            <ellipse cx={-52} cy={-150} rx={24} ry={18} fill={skin} />
            <ellipse cx={52} cy={-150} rx={24} ry={18} fill={skin} />
          </>
        ) : (
          <>
            <path d="M -92 -326 Q -128 -230 -70 -150 L -44 -164 Q -90 -232 -64 -310 Z" fill={pjD} />
            <ellipse cx={-52} cy={-150} rx={24} ry={18} fill={skin} />
            {/* raised arm to mouth (giggle) */}
            <path d="M 92 -326 Q 130 -260 60 -400 L 36 -390 Q 96 -270 64 -310 Z" fill={pjD} />
            <ellipse cx={44} cy={-408} rx={24} ry={20} fill={skin} />
          </>
        )}
        {/* neck + head */}
        <rect x={-18} y={-394} width={36} height={40} fill={skin} />
        <g transform={`rotate(${laugh * 6} 0 -420)`}>
          {hair === 'long' && <path d="M -78 -470 Q -76 -560 0 -562 Q 76 -560 78 -470 Q 86 -380 76 -300 L 46 -320 L 52 -440 L -52 -440 L -46 -320 L -76 -300 Q -86 -380 -78 -470 Z" fill="#2a1a12" />}
          <ellipse cx={0} cy={-448} rx={58} ry={66} fill={skin} />
          <path d="M 58 -448 Q 54 -400 30 -386 Q 50 -420 46 -470 Z" fill="#000" opacity={0.15} />
          {/* simple face: closed happy eyes, smile */}
          <path d="M -32 -452 Q -22 -462 -12 -452 M 12 -452 Q 22 -462 32 -452" stroke="#3a2418" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d={`M -16 -414 Q 0 ${-402 + laugh * 6} 16 -414`} stroke="#5a2a20" strokeWidth={5} fill="none" strokeLinecap="round" />
          <ellipse cx={-34} cy={-428} rx={10} ry={6} fill="#e07a6a" opacity={0.35} />
          <ellipse cx={34} cy={-428} rx={10} ry={6} fill="#e07a6a" opacity={0.35} />
          {/* hair top */}
          {hair === 'long' && <path d="M -62 -470 Q -60 -530 0 -528 Q 60 -530 62 -470 Q 30 -500 0 -498 Q -40 -500 -62 -470 Z" fill="#2a1a12" />}
          {hair === 'pony' && <><path d="M -62 -466 Q -62 -534 0 -532 Q 62 -534 62 -466 Q 30 -500 -10 -494 Q -44 -490 -62 -466 Z" fill="#14100c" /><path d="M 50 -500 Q 110 -480 104 -390 Q 84 -420 60 -470 Z" fill="#14100c" /></>}
          {hair === 'bob' && <path d="M -70 -440 Q -76 -540 0 -536 Q 76 -540 70 -440 L 66 -400 L 54 -404 Q 58 -470 30 -488 Q 0 -470 -40 -482 Q -58 -460 -54 -404 L -66 -400 Z" fill="#4a2c18" />}
          {/* rim from string lights (top) */}
          <path d="M -50 -520 Q 0 -548 50 -520" stroke={HL} strokeWidth={4} fill="none" opacity={0.7} />
        </g>
        <path d="M -88 -320 Q -104 -230 -84 -120" stroke={HL} strokeWidth={4} fill="none" opacity={0.45} />
      </g>
    </g>
  );
};
