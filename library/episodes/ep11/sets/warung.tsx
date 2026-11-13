import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Shared geometry (world px). */
export const WG = {
  // exterior
  shutL: 330, shutR: 980, shutBot: 1430, ground: 1560,
  // interior
  floor: 1460, doorL: 130, doorR: 500, doorT: 560,
  ctrL: 600, ctrTop: 1130, ctrBot: 1520,
  bulb: { x: 860, y: 540 },
  bowl: { x: 330, y: 1530 },
};

const snacks = ['#7a4a3a', '#5a6a4a', '#8a7440', '#4a5a6e', '#7a3e4e', '#6a5a3a'];

const Exterior = () => {
  const r = rng(11);
  return (
    <g>
      <defs>
        <linearGradient id="wx-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05070d" /><stop offset="0.6" stopColor="#0b0f18" /><stop offset="1" stopColor="#141b2a" />
        </linearGradient>
        <linearGradient id="wx-gap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd27a" /><stop offset="1" stopColor="#b07034" />
        </linearGradient>
        <radialGradient id="wx-spill" cx="0.5" cy="0" r="0.6">
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.55" /><stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wx-shut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4250" /><stop offset="1" stopColor="#5a6070" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#wx-sky)" />
      {/* distant kampung roofs + palm */}
      <path d={`M0 980 L120 900 L240 980 L300 940 L420 1000 L0 1000 Z`} fill="#0e131e" />
      <path d={`M1100 1000 L1180 930 L1296 990 L1296 1000 Z`} fill="#0e131e" />
      <path d="M1180 1000 C1170 860 1160 760 1150 680" stroke="#0d121c" strokeWidth={16} fill="none" />
      {[-60, -20, 25, 70, 120].map((a, i) => <path key={i} d={`M1150 680 q${Math.cos((a - 90) * Math.PI / 180) * 90} ${Math.sin((a - 90) * Math.PI / 180) * 60 + 30} ${Math.cos((a - 90) * Math.PI / 180) * 170} ${Math.sin((a - 90) * Math.PI / 180) * 110 + 90}`} stroke="#0d121c" strokeWidth={14} fill="none" strokeLinecap="round" />)}
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={r() * W} cy={r() * 650} r={1 + r() * 1.6} fill="#9fb8d4" opacity={0.25 + r() * 0.4} />)}
      {/* facade wall */}
      <rect x={170} y={860} width={960} height={WG.ground - 860} fill="#23201f" />
      <rect x={170} y={860} width={60} height={WG.ground - 860} fill="#1a1716" />
      <rect x={1070} y={860} width={60} height={WG.ground - 860} fill="#1a1716" />
      {/* tin roof */}
      <path d="M110 880 L1190 880 L1130 720 L170 720 Z" fill="#2c323c" />
      {Array.from({ length: 16 }, (_, i) => <line key={i} x1={150 + i * 64} y1={878} x2={190 + i * 60} y2={722} stroke="#1c2028" strokeWidth={4} />)}
      <path d="M170 722 L1130 722" stroke="#9fb8d4" strokeWidth={4} opacity={0.6} />
      <rect x={110} y={876} width={1080} height={12} fill="#14171d" />
      {/* sign board */}
      <rect x={380} y={920} width={540} height={110} rx={6} fill="#2e3a2c" />
      <text x={650} y={998} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={66} fill="#c9b98a" opacity={0.75} letterSpacing={10}>WARUNG</text>
      {/* warm gap under shutter */}
      <rect x={WG.shutL} y={WG.shutBot - 20} width={WG.shutR - WG.shutL} height={WG.ground - WG.shutBot + 20} fill="url(#wx-gap)" />
      {/* counter silhouette visible in gap */}
      <rect x={WG.shutL} y={WG.shutBot + 40} width={WG.shutR - WG.shutL} height={90} fill="#5a3a22" opacity={0.55} />
      {/* shutters */}
      <rect x={WG.shutL} y={1060} width={WG.shutR - WG.shutL} height={WG.shutBot - 1060} fill="url(#wx-shut)" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={WG.shutL} x2={WG.shutR} y1={1080 + i * 30} y2={1080 + i * 30} stroke="#262b35" strokeWidth={5} />)}
      <rect x={WG.shutL - 10} y={1050} width={WG.shutR - WG.shutL + 20} height={22} fill="#1a1d24" />
      <line x1={WG.shutL} x2={WG.shutR} y1={WG.shutBot} y2={WG.shutBot} stroke="#ffd27a" strokeWidth={5} opacity={0.8} />
      {/* ground + light spill */}
      <rect x={0} y={WG.ground} width={W} height={H - WG.ground} fill="#0d0f14" />
      <ellipse cx={(WG.shutL + WG.shutR) / 2} cy={WG.ground} rx={520} ry={260} fill="url(#wx-spill)" />
      <rect x={0} y={WG.ground} width={W} height={6} fill="#0a0b0f" />
    </g>
  );
};

const Interior = () => {
  const r = rng(7);
  const shelves = [520, 760, 990];
  return (
    <g>
      <defs>
        <linearGradient id="wi-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#140f0c" /><stop offset="0.5" stopColor="#3a2a1e" /><stop offset="1" stopColor="#2a1e16" />
        </linearGradient>
        <linearGradient id="wi-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2018" /><stop offset="1" stopColor="#120d0a" />
        </linearGradient>
        <linearGradient id="wi-ctr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3424" /><stop offset="1" stopColor="#24180f" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#wi-wall)" />
      {/* tin ceiling */}
      <rect x={0} y={0} width={W} height={300} fill="#141619" />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 140} y1={0} x2={i * 140 + 40} y2={300} stroke="#0c0d10" strokeWidth={6} />)}
      <rect x={0} y={296} width={W} height={20} fill="#1e1610" />
      {/* doorway with shutter slats (outside = night) */}
      <rect x={WG.doorL} y={WG.doorT} width={WG.doorR - WG.doorL} height={WG.floor - WG.doorT} fill="#0b0f18" />
      {Array.from({ length: 13 }, (_, i) => <rect key={i} x={WG.doorL} y={WG.doorT + 10 + i * 58} width={WG.doorR - WG.doorL} height={44} fill="#1c2129" />)}
      <rect x={WG.doorL - 24} y={WG.doorT - 30} width={WG.doorR - WG.doorL + 48} height={30} fill="#1a120c" />
      <rect x={WG.doorL - 24} y={WG.doorT} width={24} height={WG.floor - WG.doorT} fill="#1a120c" />
      <rect x={WG.doorR} y={WG.doorT} width={24} height={WG.floor - WG.doorT} fill="#1a120c" />
      {/* shelves of snacks */}
      {shelves.map((sy, si) => (
        <g key={si}>
          {Array.from({ length: 9 }, (_, i) => {
            const w = 50 + r() * 22, h = 70 + r() * 70, x = 640 + i * 72 + r() * 6;
            return <rect key={i} x={x} y={sy - h} width={w} height={h} rx={6} fill={snacks[Math.floor(r() * snacks.length)]} opacity={0.75} />;
          })}
          <rect x={610} y={sy} width={700} height={18} fill="#2a1c12" />
        </g>
      ))}
      {/* hanging sachet strips */}
      {[680, 760, 1110].map((x, i) => (
        <g key={i}>{Array.from({ length: 5 }, (_, j) => <rect key={j} x={x} y={330 + j * 56} width={44} height={50} rx={4} fill={snacks[(i * 2 + j) % snacks.length]} opacity={0.7} />)}</g>
      ))}
      {/* bulb wire */}
      <line x1={WG.bulb.x} y1={300} x2={WG.bulb.x} y2={WG.bulb.y - 30} stroke="#0c0a08" strokeWidth={5} />
      {/* floor */}
      <rect x={0} y={WG.floor} width={W} height={H - WG.floor} fill="url(#wi-floor)" />
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1={0} y1={WG.floor + 40 + i * i * 40} x2={W} y2={WG.floor + 40 + i * i * 40} stroke="#0f0b08" strokeWidth={3} opacity={0.6} />)}
      {/* counter */}
      <rect x={WG.ctrL} y={WG.ctrTop + 30} width={W - WG.ctrL} height={WG.ctrBot - WG.ctrTop} fill="url(#wi-ctr)" />
      {[720, 880, 1040, 1200].map((x) => <line key={x} x1={x} y1={WG.ctrTop + 40} x2={x} y2={WG.ctrBot + 30} stroke="#1e140c" strokeWidth={5} />)}
      <rect x={WG.ctrL - 30} y={WG.ctrTop} width={W - WG.ctrL + 30} height={34} fill="#5a4030" />
      <rect x={WG.ctrL - 30} y={WG.ctrTop} width={W - WG.ctrL + 30} height={6} fill="#8a6440" />
      {/* jar of crackers on counter */}
      <rect x={1100} y={WG.ctrTop - 120} width={90} height={120} rx={14} fill="#6e7a7e" opacity={0.45} />
      <rect x={1096} y={WG.ctrTop - 136} width={98} height={22} rx={6} fill="#c4553a" opacity={0.6} />
    </g>
  );
};

const Foreground = () => (
  <g>
    {/* dark door post left and ceiling beam; sachets hanging close to lens */}
    <rect x={0} y={0} width={W} height={250} fill="#060504" />
    <rect x={0} y={0} width={150} height={H} fill="#060504" />
    {[230, 300, 1180].map((x, i) => (
      <g key={i}>{Array.from({ length: 3 }, (_, j) => <rect key={j} x={x} y={250 + j * 80} width={64} height={72} rx={6} fill="#0b0806" />)}</g>
    ))}
  </g>
);

/** Set "warung" (small kampung shop interior and doorstep at night). Static bands baked ONCE to public/baked/warung/<band>.png. Ids "warung/<band>". */
export const WARUNG: Record<string, BandSpec> = {
  'warung/ext': { node: () => <Exterior /> },
  'warung/int': { node: () => <Interior /> },
  'warung/fg': { blur: 5, node: () => <Foreground /> },
};
