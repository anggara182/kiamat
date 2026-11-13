import React from 'react';
import { limb, Glow, lerp, DEG } from './home_kit';

/**
 * Shot 4: bedroom close at dawn. A young man asleep on his side under a batik blanket, face buried in the pillow;
 * his hand creeps out to slap the ringing phone. Behind, through a barred window: the minaret against the violet dawn. Frame coords.
 */
export const BR = {
  win: { x: 330, y: 250, w: 480, h: 590 },
  minaret: { x: 652, lampY: 514 },
  phone: [[716, 1262], [902, 1236], [930, 1300], [742, 1330]] as [number, number][],
};

/** distant lit windows / screens that appear on "hundred" (inside the window view) */
export const FAR_DOTS: [number, number][] = [[372, 742], [402, 760], [470, 734], [540, 772], [578, 748], [720, 780], [760, 744], [610, 790], [440, 790], [690, 760]];

export const BedroomBand: React.FC = () => {
  const { win, minaret: m } = BR;
  const bars: React.ReactNode[] = [];
  for (let i = 1; i < 6; i++) bars.push(<rect key={i} x={win.x + (i * win.w) / 6 - 4} y={win.y} width={8} height={win.h} fill="#141225" />);
  return (
    <g>
      <defs>
        <linearGradient id="hbSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141a3a" /><stop offset="0.35" stopColor="#3b3466" /><stop offset="0.75" stopColor="#c7768a" /><stop offset="1" stopColor="#f4b98a" />
        </linearGradient>
        <radialGradient id="hbWallLit" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#4a4270" /><stop offset="1" stopColor="#1d1a33" />
        </radialGradient>
        <linearGradient id="hbSheet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d5a86" /><stop offset="1" stopColor="#3c3a5e" />
        </linearGradient>
        <linearGradient id="hbFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1830" /><stop offset="1" stopColor="#0c0b18" />
        </linearGradient>
      </defs>
      {/* wall */}
      <rect x={-108} y={-192} width={1296} height={1300} fill="url(#hbWallLit)" />
      {/* window: sky, roofs, dome + minaret (generic, no text) */}
      <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="url(#hbSky)" />
      <ellipse cx={500} cy={760} rx={92} ry={80} fill="#1c2142" />
      <rect x={496} y={660} width={8} height={30} fill="#1c2142" />
      <path d={`M${m.x - 20} ${win.y + win.h} L${m.x - 20} 560 L${m.x - 34} 540 L${m.x - 34} 524 L${m.x + 34} 524 L${m.x + 34} 540 L${m.x + 20} 560 L${m.x + 20} ${win.y + win.h} Z`} fill="#1c2142" />
      <path d={`M${m.x - 16} 524 L${m.x - 16} 470 L${m.x - 26} 458 L${m.x + 26} 458 L${m.x + 16} 470 L${m.x + 16} 524 Z`} fill="#1c2142" />
      <path d={`M${m.x - 20} 458 Q${m.x - 18} 400 ${m.x} 360 Q${m.x + 18} 400 ${m.x + 20} 458 Z`} fill="#1c2142" />
      <rect x={m.x - 2} y={330} width={4} height={32} fill="#1c2142" />
      <path d={`M${win.x} ${win.y + win.h} L${win.x} 760 L${win.x + 60} 730 L${win.x + 130} 770 L${win.x + 130} 800 L${win.x + 300} 800 L${win.x + 300} 770 L${win.x + 380} 740 L${win.x + 480} 780 L${win.x + 480} ${win.y + win.h} Z`} fill="#141834" />
      {/* teralis bars + frame */}
      {bars}
      <rect x={win.x} y={win.y + win.h / 2 - 4} width={win.w} height={8} fill="#141225" />
      <path d={`M${win.x + 40} ${win.y + win.h / 2} Q${win.x + 80} ${win.y + win.h / 2 - 60} ${win.x + 120} ${win.y + win.h / 2} M${win.x + 360} ${win.y + win.h / 2} Q${win.x + 400} ${win.y + win.h / 2 - 60} ${win.x + 440} ${win.y + win.h / 2}`} stroke="#141225" strokeWidth={6} fill="none" />
      <rect x={win.x - 22} y={win.y - 22} width={win.w + 44} height={win.h + 44} fill="none" stroke="#2c2440" strokeWidth={26} />
      <rect x={win.x - 40} y={win.y + win.h + 12} width={win.w + 80} height={18} fill="#2c2440" />
      {/* curtains pushed aside */}
      <path d={`M${win.x - 60} ${win.y - 40} L${win.x + 70} ${win.y - 40} Q${win.x + 40} ${win.y + 300} ${win.x + 60} ${win.y + win.h + 60} L${win.x - 60} ${win.y + win.h + 60} Z`} fill="#3b2f52" />
      {[0, 30, 64].map((d) => <path key={d} d={`M${win.x - 40 + d} ${win.y - 30} Q${win.x - 50 + d} ${win.y + 300} ${win.x - 36 + d} ${win.y + win.h + 50}`} stroke="#2a2140" strokeWidth={8} fill="none" />)}
      <path d={`M${win.x + 70} ${win.y - 40} Q${win.x + 40} ${win.y + 300} ${win.x + 60} ${win.y + win.h + 60}`} stroke="#c7768a" strokeWidth={3} fill="none" opacity={0.5} />
      <path d={`M${win.x + win.w + 60} ${win.y - 40} L${win.x + win.w - 30} ${win.y - 40} Q${win.x + win.w - 10} ${win.y + 300} ${win.x + win.w - 20} ${win.y + win.h + 60} L${win.x + win.w + 60} ${win.y + win.h + 60} Z`} fill="#3b2f52" />
      <rect x={win.x - 100} y={win.y - 52} width={win.w + 200} height={12} fill="#141225" />
      {/* a shirt on a nail, a small shelf with a speaker: low detail */}
      <path d="M980 420 L1060 420 L1080 520 L1050 520 L1050 640 L990 640 L990 520 L960 520 Z" fill="#2b2a44" />
      <path d="M140 560 L250 560 L250 574 L140 574 Z" fill="#141225" />
      <rect x={160} y={500} width={36} height={60} rx={6} fill="#232038" />
      {/* window light spilling on the wall + headboard */}
      <path d={`M${win.x} ${win.y + win.h + 30} L${win.x + win.w} ${win.y + win.h + 30} L${win.x + win.w + 80} 1010 L${win.x - 60} 1010 Z`} fill="#c7768a" opacity={0.08} />
      {/* bed: mattress top + front face */}
      <rect x={-108} y={980} width={1296} height={40} fill="#2a2742" />
      <path d="M-108 1010 L1188 1010 L1188 1350 L-108 1350 Z" fill="url(#hbSheet)" />
      {[1080, 1150, 1240].map((y, i) => <path key={i} d={`M${-108 + i * 60} ${y} Q500 ${y + 18} 1188 ${y - 10}`} stroke="#4a4870" strokeWidth={6} fill="none" opacity={0.6} />)}
      <path d="M-108 1350 L1188 1350 L1188 1480 L-108 1480 Z" fill="#2c2a48" />
      <path d="M-108 1350 L1188 1350" stroke="#7a76a6" strokeWidth={4} opacity={0.5} />
      <rect x={-108} y={1480} width={1296} height={700} fill="url(#hbFloor)" />
      {/* pillow (head buried under it, left) */}
      <path d="M-120 1000 Q-40 940 160 948 Q340 952 420 1000 Q450 1060 410 1130 Q300 1160 120 1150 Q-60 1150 -120 1120 Z" fill="#8d8bb2" />
      <path d="M-120 1080 Q100 1120 410 1100 Q380 1140 300 1150 Q100 1160 -120 1130 Z" fill="#5f5d88" opacity={0.7} />
      <path d="M-60 968 Q120 940 340 960" stroke="#c9c2e0" strokeWidth={4} fill="none" opacity={0.6} />
    </g>
  );
};

/** live: minaret lamp + window glow (ON ONES). lamp 0..1, dots 0..1 (far screens waking) */
export const WindowLife: React.FC<{ lamp: number; dots: number; t: number }> = ({ lamp, dots, t }) => {
  const { minaret: m, win } = BR;
  return (
    <g>
      <defs>
        <clipPath id="hbWinClip"><rect x={win.x} y={win.y} width={win.w} height={win.h} /></clipPath>
      </defs>
      <g clipPath="url(#hbWinClip)">
        {FAR_DOTS.map(([x, y], i) => {
          const on = dots * 10 > i ? 1 : 0;
          return on ? <rect key={i} x={x} y={y} width={i % 2 ? 7 : 9} height={i % 2 ? 9 : 6} fill={i % 3 ? '#bfe3ff' : '#ffd58a'} opacity={0.85} /> : null;
        })}
        <Glow id="hbLampG" x={m.x} y={m.lampY + 10} rx={130} c="#ffe3a0" o={0.8 * lamp} mid={0.2} />
        {[-24, -8, 8, 24].map((d) => <rect key={d} x={m.x + d - 3} y={m.lampY + 12} width={6} height={10} fill="#ffe7b0" opacity={lamp} />)}
      </g>
      {/* the dawn brightens a little on "prayer" */}
      <rect x={win.x} y={win.y} width={win.w} height={win.h * 0.6} fill="#f4b98a" opacity={0.08 * lamp + 0.01 * Math.sin(t)} />
    </g>
  );
};

/** phone flat on the mattress (prop; buzz on ones). ring 0..1 screen on, buzz px */
export const Phone: React.FC<{ ring: number; buzz: number; t: number }> = ({ ring, buzz, t }) => {
  const q = BR.phone.map(([x, y]) => [x + buzz, y]);
  const path = `M${q.map((p) => p.join(' ')).join(' L')} Z`;
  // screen inset
  const c = q.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4], [0, 0]);
  const ins = q.map(([x, y]) => [lerp(x, c[0], 0.12), lerp(y, c[1], 0.2)]);
  const scr = `M${ins.map((p) => p.join(' ')).join(' L')} Z`;
  const pulse = 0.5 + 0.5 * Math.sin(t * 14);
  return (
    <g>
      <Glow id="hbPhG" x={c[0]} y={c[1] + 6} rx={360} ry={170} c="#bfe3ff" o={0.75 * ring} mid={0.25} />
      <path d={path} fill="#0e0f16" transform="translate(4 6)" opacity={0.6} />
      <path d={path} fill="#1b1d26" />
      <path d={scr} fill={ring > 0.02 ? '#cfeaff' : '#10121a'} opacity={ring > 0.02 ? 0.35 + 0.65 * ring : 1} />
      {ring > 0.05 && (
        <g opacity={ring}>
          {/* big clock digits + a pulsing alarm ring, foreshortened with the phone */}
          <g transform={`translate(${c[0]} ${c[1]}) skewX(-30) scale(1 0.42) rotate(-7)`}>
            <rect x={-50} y={-38} width={22} height={52} rx={4} fill="#2c4a66" />
            <rect x={-22} y={-38} width={22} height={52} rx={4} fill="#2c4a66" />
            <circle cx={6} cy={-18} r={4} fill="#2c4a66" /><circle cx={6} cy={-2} r={4} fill="#2c4a66" />
            <rect x={14} y={-38} width={22} height={52} rx={4} fill="#2c4a66" />
            <rect x={42} y={-38} width={22} height={52} rx={4} fill="#2c4a66" />
            <circle cx={0} cy={56} r={14 + 8 * pulse} fill="none" stroke="#2c4a66" strokeWidth={5} opacity={1 - 0.6 * pulse} />
            <circle cx={0} cy={56} r={10} fill="#2c4a66" />
          </g>
        </g>
      )}
      <path d={`M${q[0][0]} ${q[0][1]} L${q[1][0]} ${q[1][1]}`} stroke="#9fb6cc" strokeWidth={3} opacity={0.6} />
    </g>
  );
};

const SL = { blanket: '#5a3f6e', blanketD: '#3e2a50', motif: '#a7795a', skin: '#a06c52', skinD: '#6e4636', rimC: '#cfeaff', hair: '#0d0c14' };

/** sleeper's body under the batik blanket (ON TWOS breathing). stir 0..1 = shifts as the arm comes out */
export const Sleeper: React.FC<{ breath: number; stir: number }> = ({ breath, stir }) => {
  const b = breath * 8, s = stir * 10;
  const top = `M150 1060 Q210 ${990 - b} 320 ${972 - b - s} Q440 ${948 - b - s} 520 ${990 - b} Q640 ${1050 - b} 760 ${1036 - b} Q900 ${984 - b} 1010 ${1000 - b} Q1120 1020 1200 1040 L1200 1250 Q700 1236 420 1230 Q240 1226 120 1200 Z`;
  return (
    <g>
      {/* messy hair peeking out between pillow and blanket */}
      <path d="M120 1100 Q150 1060 200 1068 Q236 1080 230 1120 Q190 1140 140 1132 Z" fill={SL.hair} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${136 + i * 18} ${1074 + (i % 2) * 6} q${-10 + i * 3} -24 ${-4 + i * 6} -40`} stroke={SL.hair} strokeWidth={5} fill="none" strokeLinecap="round" />)}
      <path d="M130 1080 Q170 1060 210 1070" stroke="#8d8bb2" strokeWidth={3} fill="none" opacity={0.5} />
      {/* blanket mound */}
      <path d={top} fill={SL.blanket} />
      <path d={`M120 1200 Q240 1226 420 1230 Q700 1236 1200 1250 L1200 1170 Q700 1160 420 1160 Q260 1160 150 1140 Z`} fill={SL.blanketD} opacity={0.75} />
      {/* batik motif: a few rows of simple parang-like strokes */}
      {[0, 1, 2].map((r) => (
        <path key={r} d={Array.from({ length: 10 }, (_, i) => `M${230 + i * 96} ${1050 + r * 56 - (i === 2 || i === 3 ? 30 : 0)} q24 -22 48 0`).join(' ')} stroke={SL.motif} strokeWidth={6} fill="none" opacity={0.55} strokeLinecap="round" />
      ))}
      <path d={`M150 1060 Q210 ${990 - b} 320 ${972 - b - s} Q440 ${948 - b - s} 520 ${990 - b}`} stroke="#c7768a" strokeWidth={4} fill="none" opacity={0.6} />
    </g>
  );
};

/** blanket front fold drawn OVER the arm root */
export const BlanketFold: React.FC<{ stir: number }> = ({ stir }) => (
  <g>
    <path d={`M330 1140 Q440 ${1150 - stir * 6} 560 1170 Q600 1214 560 1246 Q440 1250 320 1236 Q300 1190 330 1140 Z`} fill={SL.blanket} />
    <path d="M330 1200 Q440 1214 566 1222 Q560 1246 520 1248 Q420 1250 320 1236 Z" fill={SL.blanketD} />
    <path d={`M330 1140 Q440 ${1150 - stir * 6} 560 1170`} stroke={SL.motif} strokeWidth={6} fill="none" opacity={0.5} />
  </g>
);

/**
 * The arm out of the blanket: root under the fold at (500,1200). wrist (wx,wy), hand angle ang (deg), lift 0..1 (hand raised for the slap,
 * foreshortened), spread 0..1 (fingers spread flat on the phone).
 */
export const SleepArm: React.FC<{ wx: number; wy: number; ang: number; lift: number; spread: number; rim: number }> = ({ wx, wy, ang, lift, spread, rim }) => {
  const rx = 500, ry = 1196;
  const len = 150 * (1 - 0.35 * lift);
  const w = 96;
  const d = `M0 ${-w * 0.42} C${len * 0.3} ${-w * 0.56} ${len * 0.62} ${-w * 0.6} ${len * 0.8} ${-w * 0.52} L${len * 1.02} ${-w * 0.42} Q${len * 1.1} ${-w * 0.3} ${len * 1.02} ${-w * 0.18} L${len * 1.06} ${-w * 0.1} Q${len * 1.14} ${w * 0.02} ${len * 1.06} ${w * 0.14} L${len * 1.0} ${w * 0.2} Q${len * 1.06} ${w * 0.34} ${len * 0.96} ${w * 0.42} C${len * 0.7} ${w * 0.5} ${len * 0.4} ${w * 0.52} 0 ${w * 0.42} Z`;
  const thumb = `M${len * 0.2} ${-w * 0.4} C${len * 0.36} ${-w * (0.75 + 0.15 * spread)} ${len * 0.6} ${-w * (0.8 + 0.2 * spread)} ${len * 0.7} ${-w * (0.66 + 0.2 * spread)} C${len * 0.62} ${-w * 0.56} ${len * 0.46} ${-w * 0.5} ${len * 0.36} ${-w * 0.44} Z`;
  return (
    <g>
      {/* forearm */}
      <path d={limb(rx, ry, wx, wy, 96, 70)} fill={SL.skin} />
      <path d={limb(rx, ry + 18, wx, wy + 14, 50, 36)} fill={SL.skinD} opacity={0.5} />
      <path d={`M${rx} ${ry - 44} L${wx} ${wy - 32}`} stroke="#c7768a" strokeWidth={3} opacity={0.35} />
      <path d={`M${rx} ${ry + 46} L${wx} ${wy + 34}`} stroke={SL.rimC} strokeWidth={4} opacity={0.7 * rim} />
      {/* hand (back of the hand toward camera) */}
      <g transform={`translate(${wx} ${wy - lift * 34}) rotate(${ang})`}>
        <path d={thumb} fill={SL.skin} />
        <path d={thumb} fill="none" stroke={SL.skinD} strokeWidth={3} opacity={0.6} />
        <path d={d} fill={SL.skin} />
        <path d={`M${len * 0.1} ${w * 0.2} C${len * 0.5} ${w * 0.34} ${len * 0.8} ${w * 0.36} ${len * 1.0} ${w * 0.3} L${len * 0.96} ${w * 0.42} C${len * 0.7} ${w * 0.5} ${len * 0.4} ${w * 0.52} 0 ${w * 0.42} Z`} fill={SL.skinD} opacity={0.55} />
        {/* finger separations + knuckles */}
        <path d={`M${len * 1.02} ${-w * 0.18} L${len * 0.74} ${-w * 0.2} M${len * 1.0} ${w * 0.2} L${len * 0.74} ${w * 0.14}`} stroke={SL.skinD} strokeWidth={4} strokeLinecap="round" />
        <path d={`M${len * 0.6} ${-w * 0.36} Q${len * 0.66} 0 ${len * 0.62} ${w * 0.34}`} stroke={SL.skinD} strokeWidth={3} fill="none" opacity={0.45} />
        <path d={`M${len * 0.1} ${w * 0.44} C${len * 0.5} ${w * 0.52} ${len * 0.8} ${w * 0.5} ${len * 0.96} ${w * 0.42}`} stroke={SL.rimC} strokeWidth={4} fill="none" opacity={0.85 * rim} />
      </g>
    </g>
  );
};

export { DEG };
