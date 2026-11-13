import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Grandpa, Girl, Dog, Lantern, Glow } from '../art/ranch_figs';
import { WIN, DOOR, FLOOR, CWIN } from '../sets/ranch';

const frac = (id: number, re: RegExp, fb: number, sec: number) => Math.min(0.95, wordAt(id, re, fb) / sec);

/** Tall thin Silbón silhouette with hat and sack, unit: feet 0, top -100. */
const Silbon: React.FC<{ fill?: string }> = ({ fill = '#050607' }) => (
  <g fill={fill}>
    <path d="M-2.5,0 L-1.6,-48 L1.6,-48 L2.5,0 L1,0 L0,-40 L-1,0 Z" />
    <path d="M-3,-49 L-2.6,-82 Q0,-84 2.6,-82 L3,-49 Z" />
    <path d="M2.4,-80 Q7,-74 6,-58 Q4,-50 3,-60 Z" />
    <ellipse cx={5} cy={-62} rx={4.5} ry={7} />
    <ellipse cx={0} cy={-87} rx={2} ry={3} />
    <ellipse cx={0} cy={-90} rx={6} ry={1.1} />
    <path d="M-2.4,-90 Q-2.4,-96 0,-96 Q2.4,-96 2.4,-90 Z" />
  </g>
);

/** Shutter leaf with slats; light through gaps. */
const Shutter: React.FC<{ x: number; y: number; w: number; h: number; open: number; hinge: 'l' | 'r'; light?: string }> = ({ x, y, w, h, open, hinge, light = '#b9c8db' }) => {
  const ww = w * (1 - 0.82 * open);
  const sx = hinge === 'l' ? x : x + w - ww;
  const n = 12;
  return (
    <g>
      <rect x={sx} y={y} width={ww} height={h} fill="#4a3424" />
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} x={sx + ww * 0.08} y={y + 30 + i * ((h - 60) / n)} width={ww * 0.84} height={7} fill={light} opacity={0.75 * (1 - open)} />
      ))}
      <rect x={sx} y={y} width={ww} height={h} fill="none" stroke="#24180f" strokeWidth={10} />
    </g>
  );
};

/** 4 — porch at night, grandfather with lantern, dogs cowering. */
export const S04: React.FC = () => {
  const { p, t, sec } = useShot();
  const dogs = frac(4, /dogs/i, 0.65, sec);
  const z = 1.22 + 0.1 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: -170, ox: 600, oy: 1150 };
  const fear = ramp(p, dogs, dogs + 0.08);
  const tr = fear * Math.sin(t * 40) * 1.5;
  const flick = 0.92 + 0.08 * Math.sin(t * 7) * Math.sin(t * 3.1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#070b1a' }}>
      <BandImg id="ranch/porch" cam={cam} />
      <Live cam={cam}>
        <Glow id="r4g" x={790} y={1270} r={620 * flick} a={0.55} />
        <Glow id="r4g2" x={790} y={1270} r={200} color="#fff1c9" a={0.4} />
        <Grandpa x={620} y={1590} s={640} shirt="#b9ad94" fill="#120e0b" rim="#ffcc7a" arm={35} />
        <Lantern x={785} y={1302} s={95} on={flick} />
        <Dog x={470 + tr} y={1600} s={260} fill="#141010" rim="#d9a35a" lift={-6 * fear} />
        <Dog x={830 - tr} y={1612} s={230} flip fill="#120e0d" rim="#d9a35a" lift={-8 * fear} />
      </Live>
    </AbsoluteFill>
  );
};

/** 6 — girl at the open shutters, looking at the moonlit plain. */
export const S06: React.FC = () => {
  const { p } = useShot();
  const cam: Cam = { zoom: 1.12, dx: 0, dy: -60, ox: 560, oy: 820 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#14161c' }}>
      <BandImg id="ranch/room" cam={cam} />
      <Live cam={cam}>
        <Shutter x={WIN.x - 200} y={WIN.y} w={220} h={WIN.h} open={0} hinge="r" light="#55627a" />
        <Shutter x={WIN.x + WIN.w - 20} y={WIN.y} w={220} h={WIN.h} open={0} hinge="l" light="#55627a" />
        <Glow id="r6m" x={WIN.x + WIN.w / 2} y={WIN.y + WIN.h} r={520} color="#b9c8db" a={0.28} />
        <path d={`M${WIN.x},${FLOOR + 10} L${WIN.x + WIN.w},${FLOOR + 10} L${WIN.x + WIN.w + 260},${FLOOR + 380} L${WIN.x + 120},${FLOOR + 380} Z`} fill="#9fb2c8" opacity={0.18} />
        <Girl x={600} y={1980 + 4 * Math.sin(p * 6)} s={940} fill="#0c0e13" shirt="#20242e" rim="#cfd9e8" />
      </Live>
    </AbsoluteFill>
  );
};

/** 7 — both crouched under the window, his hand on her shoulder, lantern low. */
export const S07: React.FC = () => {
  const { p, t, sec } = useShot();
  const pull = ramp(p, frac(7, /pulled/i, 0.1, sec), frac(7, /down/i, 0.2, sec, ) + 0.06);
  const h = handheld(t, 1.4);
  const cam: Cam = { zoom: 1.45, dx: 0, dy: -260, tx: h.hx, ty: h.hy, rot: h.hr, ox: 540, oy: 1050 };
  const dy = (1 - pull) * -160;
  return (
    <AbsoluteFill style={{ backgroundColor: '#14161c' }}>
      <BandImg id="ranch/room" cam={cam} />
      <Live cam={cam}>
        <Shutter x={WIN.x} y={WIN.y} w={WIN.w / 2} h={WIN.h} open={0} hinge="l" light="#8a9ab2" />
        <Shutter x={WIN.x + WIN.w / 2} y={WIN.y} w={WIN.w / 2} h={WIN.h} open={0} hinge="r" light="#8a9ab2" />
        <Glow id="r7l" x={260} y={1640} r={700} a={0.42} />
        <Lantern x={260} y={1700} s={110} on={0.45} />
        <g transform={`translate(0 ${dy})`}>
          <Girl x={520} y={2240} s={900} fill="#120e0c" shirt="#3c3029" rim="#ffcc7a" />
        </g>
        <g transform={`translate(0 ${dy * 0.6})`}>
          <Grandpa x={790} y={2270} s={1000} flip fill="#120e0b" shirt="#7d705c" rim="#ffcc7a" />
          <path d={`M700,1530 Q640,${1560 - dy * 0.4} 605,${1585 + dy * 0.4}`} stroke="#7d705c" strokeWidth={46} fill="none" strokeLinecap="round" />
          <ellipse cx={592} cy={1592 + dy * 0.4} rx={34} ry={26} fill="#5a4636" />
          <path d={`M565,${1600 + dy * 0.4} Q560,${1625 + dy * 0.4} 578,${1630 + dy * 0.4}`} stroke="#5a4636" strokeWidth={14} fill="none" strokeLinecap="round" />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** Bone shape (shadow), horizontal, centred. */
const Bone: React.FC<{ x: number; y: number; l?: number; r?: number; fill: string }> = ({ x, y, l = 76, r = 0, fill }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`} fill={fill}>
    <rect x={-l / 2} y={-6} width={l} height={12} rx={5} />
    <circle cx={-l / 2} cy={-8} r={10} /><circle cx={-l / 2} cy={8} r={10} />
    <circle cx={l / 2} cy={-8} r={10} /><circle cx={l / 2} cy={8} r={10} />
  </g>
);

/** Plain wall + floor cover (hides the band's window/door for tight wall shots). */
const Wall: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1d2029" /><stop offset="0.5" stopColor="#363c49" /><stop offset="1" stopColor="#1d2029" />
      </linearGradient>
    </defs>
    <rect x={-200} y={-200} width={1700} height={FLOOR + 200} fill={`url(#${id})`} />
    <rect x={-200} y={FLOOR} width={1700} height={900} fill="#16110d" />
    <rect x={-200} y={FLOOR - 6} width={1700} height={14} fill="#0e0a08" />
  </>
);

/** 8 — slatted moonlight across floor and wall; a very tall thin hatted shadow stretches up it, the sack drops. */
export const S08: React.FC = () => {
  const { p, sec } = useShot();
  const cam: Cam = { zoom: 1, dx: 0, dy: -570, ox: 540, oy: 960 };
  const tDrop = frac(8, /dropped/i, 0.85, sec);
  const appear = ramp(p, 0.02, frac(8, /stopped/i, 0.25, sec), EIO);
  const drop = ramp(p, tDrop - 0.02, tDrop + 0.06, (n) => n * n);
  const sh = '#050608';
  const sx = 744 + 20 * drop, sy = 1076 + (1690 - 1076) * drop;
  const patch = 'M380,2200 L940,2200 L820,1640 L812,800 L508,800 L500,1640 Z';
  return (
    <AbsoluteFill style={{ backgroundColor: '#14161c' }}>
      <BandImg id="ranch/room" cam={cam} />
      <Live cam={cam}>
        <Wall id="r8w" />
        <defs><clipPath id="r8c"><path d={patch} /></clipPath></defs>
        <g clipPath="url(#r8c)">
          <rect x={300} y={780} width={700} height={1500} fill="#a9bad0" opacity={0.55} />
          {Array.from({ length: 11 }).map((_, i) => <rect key={`w${i}`} x={300} y={820 + i * 76} width={700} height={30} fill="#262a33" opacity={0.85} />)}
          {Array.from({ length: 6 }).map((_, i) => <rect key={`f${i}`} x={300} y={1660 + i * (40 + i * 14)} width={700} height={16 + i * 6} fill="#1b1612" opacity={0.85} />)}
        </g>
        <Glow id="r8g" x={660} y={1300} r={620} color="#b9c8db" a={0.12} />
        <g fill={sh} opacity={0.93 * appear} transform={`translate(640 1640) skewX(${-6 * (1 - drop) - 4}) scale(1 ${0.9 + 0.1 * appear}) translate(-640 -1640)`}>
          <path d="M560,2020 L606,2020 L640,1740 L674,2020 L720,2020 L664,1640 L616,1640 Z" />
          <path d="M612,1646 L668,1646 L676,1200 Q640,1182 604,1200 Z" />
          <path d="M600,1520 L680,1520 L668,1646 L612,1646 Z" />
          <path d="M578,1206 Q640,1168 702,1206 L694,1262 L586,1262 Z" />
          <path d="M582,1210 L560,1590 Q566,1610 578,1592 L600,1230 Z" />
          <path d="M564,1585 L548,1640 M568,1588 L560,1646 M574,1588 L574,1644" stroke={sh} strokeWidth={5} />
          <path d={drop < 0.5 ? 'M694,1206 Q738,1150 728,1100 L712,1102 Q720,1150 682,1196 Z' : 'M696,1210 L718,1590 Q712,1610 700,1592 L680,1230 Z'} />
          <rect x={630} y={1116} width={20} height={70} />
          <ellipse cx={640} cy={1090} rx={24} ry={34} />
          <ellipse cx={640} cy={1062} rx={100} ry={11} />
          <path d="M610,1062 Q612,1004 640,1000 Q668,1004 670,1062 Z" />
        </g>
        <g opacity={0.93 * appear} fill={sh}>
          <ellipse cx={sx} cy={sy} rx={58 + 26 * drop} ry={82 - 40 * drop} />
          <path d={`M${sx - 14},${sy - 66 + 34 * drop} Q${sx},${sy - 92 + 40 * drop} ${sx + 16},${sy - 66 + 34 * drop} Z`} />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** 9 — on a moonlit wall patch: long thin finger shadows lift bones from a sack and lay them in a row. */
export const S09: React.FC = () => {
  const { p } = useShot();
  const cam: Cam = { zoom: 1.12 + 0.08 * ramp(p, 0, 1, EIO), dx: 0, dy: -420, ox: 540, oy: 720 };
  const n = 3;
  const cyc = (p * n) % 1, k = Math.min(n - 1, Math.floor(p * n));
  const s = ramp(cyc, 0.22, 0.72, EIO);
  const slot = (i: number) => ({ x: 740 + i * 104, y: 1520 });
  const sk = { x: 520, y: 1300 }, sl = slot(k);
  const hx = sk.x + (sl.x - sk.x) * s, hy = sk.y + (sl.y - 150 - sk.y) * s - 170 * Math.sin(Math.PI * s);
  const holding = cyc > 0.18 && cyc < 0.78;
  const placed = k + (cyc >= 0.78 ? 1 : 0);
  const sh = '#07080c';
  return (
    <AbsoluteFill style={{ backgroundColor: '#14161c' }}>
      <BandImg id="ranch/room" cam={cam} />
      <Live cam={cam}>
        <Wall id="r9w" />
        <defs><clipPath id="r9c"><path d="M300,880 L1010,850 L1030,1630 L280,1630 Z" /></clipPath></defs>
        <g clipPath="url(#r9c)">
          <rect x={250} y={840} width={800} height={800} fill="#a9bad0" opacity={0.5} />
          {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M260,${930 + i * 80} L1040,${900 + i * 80} L1040,${926 + i * 80} L260,${956 + i * 80} Z`} fill="#232730" opacity={0.75} />)}
        </g>
        <Glow id="r9g" x={660} y={1240} r={600} color="#b9c8db" a={0.14} />
        {/* sack */}
        <path d="M400,1630 Q380,1440 470,1380 Q520,1360 570,1380 Q660,1440 640,1630 Z" fill={sh} />
        <path d="M478,1384 Q520,1330 562,1384 Q520,1370 478,1384 Z" fill={sh} />
        {/* row of laid bones */}
        {Array.from({ length: placed }).map((_, i) => <Bone key={i} x={slot(i).x} y={1606} fill={sh} />)}
        {/* arm from the right edge + hand with long fingers pointing down */}
        <g fill={sh}>
          <path d={`M${hx + 10},${hy - 40} L1400,${hy - 420} L1400,${hy - 330} L${hx + 30},${hy + 10} Z`} />
          <ellipse cx={hx} cy={hy} rx={46} ry={56} transform={`rotate(-30 ${hx} ${hy})`} />
          {[-26, -9, 8, 24].map((fx, i) => {
            const L = 210 + (i === 1 || i === 2 ? 40 : 0);
            return <path key={i} d={`M${hx + fx - 6},${hy + 20} Q${hx + fx * 1.3 - 10},${hy + L * 0.55} ${hx + fx * 0.9 - 4},${hy + L} L${hx + fx * 0.9 + 2},${hy + L} Q${hx + fx * 1.3 + 2},${hy + L * 0.55} ${hx + fx + 6},${hy + 20} Z`} />;
          })}
          <path d={`M${hx - 30},${hy} Q${hx - 70},${hy + 40} ${hx - 64},${hy + 90} L${hx - 58},${hy + 90} Q${hx - 60},${hy + 44} ${hx - 22},${hy + 14} Z`} />
          {holding && <Bone x={hx - 2} y={hy + 250} r={-12} fill={sh} />}
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** 10 — dawn: grandfather opens the door, grey light spills in. */
export const S10: React.FC = () => {
  const { p, sec } = useShot();
  const cam: Cam = { zoom: 1.2, dx: 0, dy: -220, ox: 860, oy: 1050 };
  const o = ramp(p, frac(10, /opened/i, 0.8, sec) - 0.03, frac(10, /door/i, 0.9, sec) + 0.06, EIO);
  const reach = ramp(p, frac(10, /Then/i, 0.7, sec) - 0.05, frac(10, /Then/i, 0.7, sec) + 0.05);
  const leafW = DOOR.w * (1 - 0.85 * o);
  return (
    <AbsoluteFill style={{ backgroundColor: '#14161c' }}>
      <BandImg id="ranch/room" cam={cam} />
      <Live cam={cam}>
        <defs>
          <linearGradient id="r10d" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9aa3ad" />
            <stop offset="0.6" stopColor="#d9cbb5" />
            <stop offset="1" stopColor="#e8d6b8" />
          </linearGradient>
        </defs>
        <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill="#8d97a6" opacity={0.75} />
        <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill="url(#r10d)" />
        <path d={`M${DOOR.x + 30},${DOOR.y + DOOR.h * 0.62} Q${DOOR.x + DOOR.w / 2},${DOOR.y + DOOR.h * 0.6} ${DOOR.x + DOOR.w},${DOOR.y + DOOR.h * 0.63} L${DOOR.x + DOOR.w},${DOOR.y + DOOR.h} L${DOOR.x},${DOOR.y + DOOR.h} Z`} fill="#6d6a5c" />
        <rect x={DOOR.x + DOOR.w - leafW} y={DOOR.y} width={leafW} height={DOOR.h} fill="#3a2a1d" />
        <path d={`M${DOOR.x},${FLOOR} L${DOOR.x + DOOR.w},${FLOOR} L${DOOR.x + 120},${FLOOR + 500} L${DOOR.x - 520},${FLOOR + 500} Z`} fill="#d9cbb5" opacity={0.38 * o} />
        <Glow id="r10g" x={DOOR.x + DOOR.w / 2} y={DOOR.y + DOOR.h * 0.6} r={700} color="#d9cbb5" a={0.35 * o} />
        <Grandpa x={DOOR.x + DOOR.w * 0.45} y={FLOOR + 20} s={700} fill="#0e0c0b" rim="#e8dcc4" arm={-25 * reach - 10 * o} />
      </Live>
    </AbsoluteFill>
  );
};

/** 12 — city apartment window at night, the curtain stirring. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.0 + 0.14 * ramp(p, 0, 1, EIO), dx: 0, dy: -60, ox: 560, oy: 900 };
  const w = Math.sin(t * 1.3) * 0.6 + Math.sin(t * 2.7 + 1) * 0.4;
  const x0 = CWIN.x - 40, y0 = CWIN.y - 40, y1 = CWIN.y + CWIN.h + 10;
  const b = 220 + 70 * w;
  return (
    <AbsoluteFill style={{ backgroundColor: '#080a10' }}>
      <BandImg id="ranch/city" cam={cam} />
      <Live cam={cam}>
        <Glow id="r12g" x={CWIN.x + CWIN.w / 2} y={CWIN.y + CWIN.h * 0.6} r={700} color="#9fb4e0" a={0.12} />
        <path d={`M${x0},${y0} L${x0 + 260},${y0} Q${x0 + b},${(y0 + y1) / 2} ${x0 + 200 + 90 * w},${y1} L${x0},${y1} Z`} fill="#c9d3e6" opacity={0.28} />
        <path d={`M${x0 - 120},${y0} L${x0 + 90},${y0} Q${x0 + 70 + 30 * w},${(y0 + y1) / 2} ${x0 + 60 + 40 * w},${y1} L${x0 - 120},${y1} Z`} fill="#1e2536" />
        <path d={`M${x0 + 90},${y0} Q${x0 + 70 + 30 * w},${(y0 + y1) / 2} ${x0 + 60 + 40 * w},${y1}`} stroke="#6f80a6" strokeWidth={5} fill="none" />
        <path d={`M${CWIN.x + CWIN.w + 40},${y0} L${CWIN.x + CWIN.w - 40},${y0} Q${CWIN.x + CWIN.w - 20},${(y0 + y1) / 2} ${CWIN.x + CWIN.w - 30},${y1} L${CWIN.x + CWIN.w + 200},${y1} L${CWIN.x + CWIN.w + 200},${y0} Z`} fill="#161c2a" />
        <rect x={x0 - 140} y={y0 - 30} width={CWIN.w + 400} height={22} fill="#0c0f16" />
      </Live>
    </AbsoluteFill>
  );
};
