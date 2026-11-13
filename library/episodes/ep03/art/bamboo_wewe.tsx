import React from 'react';

/** Wewe Gombel (HERO). Local coords: feet on y=0, x=0 centre. Rim light = same shape drawn in moon colour
 * slightly offset BEHIND the body fill, so only the up-left edges catch light. */
const MOON = '#9fc0d8';
const BODY = '#0d0a14';
const HAIR = '#07050b';
const SKIN = '#3a3444';

const Rim: React.FC<{ d: string; o: number; dx?: number; dy?: number; fill?: string }> = ({ d, o, dx = -4, dy = -3, fill = BODY }) => (
  <g>
    <path d={d} fill={MOON} opacity={o} transform={`translate(${dx} ${dy})`} />
    <path d={d} fill={fill} />
  </g>
);

const strands = (x0: number, y0: number, n: number, len: number, spread: number, sway: number) =>
  Array.from({ length: n }, (_, i) => {
    const u = i / (n - 1) - 0.5, x = x0 + u * spread * 0.4, xe = x0 + u * spread + sway * (0.6 + Math.abs(u));
    return `M ${x} ${y0} C ${x + u * 30} ${y0 + len * 0.4} ${xe - sway * 0.5} ${y0 + len * 0.75} ${xe} ${y0 + len}`;
  });

/** Crouched, facing left: high sharp knee, long bowed back, head bowed low, hair curtain to the ground,
 * one very long arm wrapped round a small seated child in front of her. ~620px tall. Pale fog patch behind. */
const RimS: React.FC<{ d: string; o: number; fill?: string; w?: number }> = ({ d, o, fill = BODY, w = 9 }) => (
  <g>
    <path d={d} fill="none" stroke={MOON} strokeWidth={w} strokeLinejoin="round" opacity={o} transform="translate(-2 -4)" />
    <path d={d} fill={fill} />
  </g>
);
export const WeweCrouch: React.FC<{ x: number; y: number; s?: number; t: number; rim?: number }> = ({ x, y, s = 1, t, rim = 0.85 }) => {
  const sway = Math.sin(t * 0.9) * 6;
  const b = Math.sin(t * 1.6) * 4;
  // far leg: hip back-right, knee high and sharp front-left, shin straight down to the foot
  const leg = 'M 150 -40 L 170 -110 L -70 -330 L -88 -322 L -40 -8 L 30 0 L 40 -20 L -30 -40 L -58 -262 Z';
  // long bowed back: haunch low right, spine arching up and over, shoulders forward, neck dropping
  const back = `M 60 0 C 190 0 235 -120 225 -270 C 210 -${430 + b} 120 -${560 + b} 10 -${578 + b} C -60 -${584 + b} -112 -545 -132 -492 L -96 -470 C -80 -440 -70 -380 -66 -322 L 120 -96 L 80 -40 Z`;
  const head = 'M -150 -520 C -110 -530 -90 -490 -100 -450 C -110 -410 -150 -400 -170 -430 C -186 -460 -180 -510 -150 -520 Z';
  // hair: crown over the bowed head, straight curtain to the ground in front of the face
  const hair = `M -160 -535 C -120 -560 -70 -545 -60 -500 C -70 -380 ${-80 + sway} -200 ${-70 + sway} 0 L ${-215 + sway * 0.6} 0 C -210 -170 -205 -330 -195 -460 C -192 -505 -180 -525 -160 -535 Z`;
  // very long arm: shoulder -> elbow far out-left above the child -> forearm wraps down round the child's front
  const arm = 'M -20 -540 C -150 -510 -300 -440 -380 -340 C -420 -290 -410 -220 -380 -170 C -355 -128 -320 -100 -268 -96 L -262 -82 C -330 -78 -385 -110 -410 -160 C -446 -230 -444 -310 -400 -365 C -310 -480 -150 -555 -10 -575 Z';
  const fingers = 'M -270 -98 C -250 -104 -232 -112 -222 -122 M -266 -90 C -246 -92 -226 -94 -214 -100 M -264 -84 C -246 -80 -230 -76 -220 -70';
  // child: big round head, small seated body, little raised hand
  const kidBody = 'M -380 0 C -392 -60 -390 -130 -350 -150 C -310 -158 -282 -130 -286 -70 C -288 -40 -284 -15 -278 0 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id="weweGlow">
          <stop offset="0" stopColor="#d3e0ea" stopOpacity={0.9} />
          <stop offset="0.45" stopColor="#9fb6cc" stopOpacity={0.55} />
          <stop offset="1" stopColor="#7d93b0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={-110} cy={-300} rx={480} ry={420} fill="url(#weweGlow)" />
      <ellipse cx={-100} cy={-2} rx={380} ry={26} fill="#05040a" opacity={0.65} />
      <RimS d={leg} o={rim * 0.7} />
      <RimS d={back} o={rim} />
      <path d={head} fill={SKIN} />
      {/* child sits in front of her knee */}
      <RimS d={kidBody} o={rim * 0.8} fill="#120e1c" w={7} />
      <circle cx={-342} cy={-196} r={44} fill="none" stroke={MOON} strokeWidth={7} opacity={rim * 0.85} transform="translate(-2 -4)" />
      <circle cx={-342} cy={-196} r={44} fill="#120e1c" />
      <path d="M -306 -128 C -286 -150 -280 -172 -284 -196" stroke="#120e1c" strokeWidth={13} strokeLinecap="round" fill="none" />
      <path d="M -290 -196 l -4 -14 M -284 -198 l 2 -15 M -279 -194 l 7 -10" stroke="#120e1c" strokeWidth={6} strokeLinecap="round" />
      <path d="M -386 -210 C -380 -238 -350 -244 -330 -238" stroke={MOON} strokeWidth={3} opacity={rim * 0.6} fill="none" />
      <RimS d={arm} o={rim * 0.95} />
      <path d={fingers} stroke={BODY} strokeWidth={7} strokeLinecap="round" fill="none" />
      <RimS d={hair} o={rim} fill={HAIR} />
      {strands(-130, -520, 7, 520, 120, sway).map((d, i) => <path key={i} d={d} stroke={i % 2 === 0 ? MOON : '#1a1428'} strokeOpacity={i % 2 === 0 ? rim * 0.35 : 1} strokeWidth={i % 2 === 0 ? 1.5 : 3} fill="none" />)}
    </g>
  );
};

/** Two pale eyes with a radial glow (no filters). */
export const Eyes: React.FC<{ x: number; y: number; s?: number; o: number; id: string; blink?: number }> = ({ x, y, s = 1, o, id, blink = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor="#ff8a3d" stopOpacity={0.55} />
        <stop offset="1" stopColor="#ff8a3d" stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={0} cy={0} rx={90} ry={40} fill={`url(#${id})`} />
    {[-22, 22].map((dx) => <ellipse key={dx} cx={dx} cy={dx > 0 ? 2 : 0} rx={9} ry={4.5 * blink} fill="#f4f1e0" />)}
  </g>
);

/** Standing, extremely tall and thin, hair to the knees, arms below the knees. ~1500px tall. `tone` = how much it separates from black. */
export const WeweTall: React.FC<{ x: number; y: number; s?: number; t: number; rim?: number; fill?: string }> = ({ x, y, s = 1, t, rim = 0.3, fill = BODY }) => {
  const sway = Math.sin(t * 0.7) * 8;
  const body = 'M -40 0 L -28 0 L -18 -640 L -6 -640 L 2 0 L 14 0 L 18 -700 C 30 -900 50 -1100 44 -1250 L 40 -1330 C 40 -1380 20 -1420 -2 -1420 C -26 -1420 -44 -1380 -42 -1330 L -46 -1250 C -54 -1100 -40 -900 -36 -700 Z';
  const arms = 'M -44 -1250 C -80 -1100 -84 -800 -96 -460 L -104 -380 L -90 -380 L -82 -460 C -66 -800 -56 -1080 -30 -1230 Z M 42 -1250 C 78 -1100 82 -800 92 -460 L 100 -380 L 86 -380 L 78 -460 C 64 -800 54 -1080 28 -1230 Z';
  const hair = `M -40 -1360 C -40 -1440 40 -1440 40 -1360 C 50 -1100 ${60 + sway} -800 ${54 + sway} -560 L ${-58 + sway} -560 C ${-62 + sway} -800 -52 -1100 -40 -1360 Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Rim d={body} o={rim} dx={-3} dy={-2} fill={fill} />
      <Rim d={arms} o={rim * 0.8} dx={-3} dy={-2} fill={fill} />
      <Rim d={hair} o={rim * 0.7} dx={-3} dy={-2} fill={HAIR} />
    </g>
  );
};

/** Standing in profile (facing left), extremely tall/thin (~1500px, head ~1/10), hunched at the top, hair down her back,
 * one very long arm reaching down to hold the hand of a small child beside her. Pale fog patch behind. */
export const WeweStand: React.FC<{ x: number; y: number; s?: number; t: number; rim?: number; child?: boolean; glow?: number }> = ({ x, y, s = 1, t, rim = 0.9, child = true, glow = 1 }) => {
  const sw = Math.sin(t * 0.8) * 10;
  const br = Math.sin(t * 1.3) * 3;
  // legs: thin, long, slight knee bend
  const legs = 'M -10 0 L 40 0 L 30 -20 L 22 -380 L 30 -760 L 4 -760 L -6 -380 L 6 -20 Z M 60 0 L 96 0 L 84 -18 L 70 -400 L 56 -760 L 30 -760 L 46 -400 L 58 -20 Z';
  // torso + neck + hunch: hips at -760, shoulders forward at -1240, neck curving forward and down
  const torso = `M 0 -740 L 66 -740 C 80 -900 ${84 + br} -1100 ${60 + br} -1240 C 40 -1320 0 -1350 -40 -1360 L -70 -1380 L -86 -1352 L -54 -1330 C -40 -1280 -20 -1230 -10 -1160 C -6 -1020 -4 -880 0 -740 Z`;
  const head = 'M -150 -1430 C -140 -1480 -80 -1490 -56 -1450 C -40 -1420 -50 -1370 -84 -1352 C -110 -1340 -150 -1360 -162 -1390 L -170 -1396 Z';
  const hair = `M -120 -1478 C -60 -1500 -20 -1460 -10 -1400 C 30 -1300 ${70 + sw * 0.3} -1100 ${90 + sw * 0.7} -900 C ${100 + sw} -760 ${110 + sw} -640 ${120 + sw} -540 L ${70 + sw} -560 C 60 -700 40 -900 20 -1100 C 0 -1260 -40 -1360 -80 -1420 Z`;
  // long arm: shoulder at (-10,-1250) -> elbow (-90,-820) -> hand (-150,-360)
  const arm = 'M -26 -1250 C -60 -1080 -96 -920 -104 -820 L -150 -380 L -128 -372 L -82 -820 C -72 -930 -30 -1080 6 -1230 Z';
  const hand = 'M -154 -392 C -170 -370 -172 -344 -160 -330 L -150 -312 L -142 -330 L -134 -310 L -126 -334 C -122 -356 -124 -378 -130 -388 Z';
  // child (~1/5 head): stands left-front, arm raised up to her hand
  const kid = 'M -232 0 L -214 0 L -212 -90 L -200 -90 L -198 0 L -180 0 L -176 -100 C -170 -160 -168 -200 -180 -230 C -200 -246 -230 -244 -240 -226 C -250 -190 -246 -150 -236 -100 Z';
  const kidArm = 'M -186 -222 C -170 -260 -158 -300 -146 -330 L -134 -324 C -144 -290 -160 -250 -176 -212 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id="wsGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c8d8e6" stopOpacity={0.85} />
          <stop offset="0.5" stopColor="#8fa6c0" stopOpacity={0.45} />
          <stop offset="1" stopColor="#6c7fa0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={-40} cy={-760} rx={420} ry={900} fill="url(#wsGlow)" opacity={glow} />
      <ellipse cx={-60} cy={-4} rx={260} ry={22} fill="#05040a" opacity={0.6} />
      <RimS d={legs} o={rim * 0.7} w={7} />
      <RimS d={torso} o={rim} w={8} />
      <RimS d={head} o={rim} w={8} fill={SKIN} />
      <RimS d={hair} o={rim * 0.8} w={7} fill={HAIR} />
      {strands(20, -1300, 6, 760, 90, sw).map((d, i) => <path key={i} d={d} stroke={i % 2 ? '#1a1428' : MOON} strokeOpacity={i % 2 ? 1 : rim * 0.4} strokeWidth={i % 2 ? 3 : 1.6} fill="none" />)}
      <RimS d={arm} o={rim} w={7} />
      <path d={hand} fill={SKIN} />
      {child && <g>
      <RimS d={kid} o={rim * 0.9} w={6} fill="#14101e" />
      <circle cx={-208} cy={-272} r={42} fill="none" stroke={MOON} strokeWidth={7} opacity={rim * 0.9} transform="translate(-3 -3)" />
      <circle cx={-208} cy={-272} r={42} fill="#14101e" />
      <path d={kidArm} fill="#14101e" />
      <path d="M -242 -296 C -236 -312 -220 -318 -204 -314" stroke={MOON} strokeWidth={3} opacity={rim * 0.7} fill="none" />
      </g>}
    </g>
  );
};
