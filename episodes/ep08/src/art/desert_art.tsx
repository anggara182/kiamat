import React from 'react';
import { W, H, rng } from './world';

/**
 * EP08 set "desert": the flat plain at night, by day (dunes) and at dusk (pale plain ringed by low hills).
 * Vehicles are plain (no flags, insignia or colours of any nation). The swallowing shows ground, dust and vehicles only.
 */
export const HZ = { night: 1080, day: 1000, dusk: 1180 };

export const NightBand: React.FC = () => {
  const r = rng(3);
  return (
    <g>
      <defs>
        <linearGradient id="dnSky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={HZ.night}><stop offset="0" stopColor="#03050b" /><stop offset="0.7" stopColor="#070b18" /><stop offset="1" stopColor="#141826" /></linearGradient>
        <linearGradient id="dnSand" gradientUnits="userSpaceOnUse" x1="0" y1={HZ.night} x2="0" y2={H}><stop offset="0" stopColor="#1a1712" /><stop offset="0.5" stopColor="#2a241a" /><stop offset="1" stopColor="#3a3226" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#dnSky)" />
      {Array.from({ length: 140 }).map((_, i) => <circle key={i} cx={r() * W} cy={r() * (HZ.night - 200)} r={0.8 + r() * 1.6} fill="#dfe6f2" opacity={0.2 + r() * 0.5} />)}
      <path d={`M-20 ${HZ.night} Q300 ${HZ.night - 30} 640 ${HZ.night - 10} Q1000 ${HZ.night - 35} ${W + 20} ${HZ.night} Z`} fill="#0c0d14" />
      <rect x={0} y={HZ.night} width={W} height={H - HZ.night} fill="url(#dnSand)" />
      {Array.from({ length: 90 }).map((_, i) => { const y = HZ.night + Math.pow(r(), 1.5) * (H - HZ.night); const k = (y - HZ.night) / (H - HZ.night); return <path key={`s${i}`} d={`M${r() * W} ${y} q${40 + 120 * k} -${3 + 6 * k} ${80 + 240 * k} 0`} stroke="#4a3f30" strokeWidth={1 + 3 * k} fill="none" opacity={0.5} />; })}
      {/* tire tracks converging to the horizon */}
      {[-1, 1].map((sd) => <path key={sd} d={`M${640 + sd * 10} ${HZ.night} L${1040 + sd * 260} ${H}`} stroke="#4a3f30" strokeWidth={30} opacity={0.35} />)}
    </g>
  );
};

export const DayBand: React.FC = () => {
  const r = rng(5);
  return (
    <g>
      <defs>
        <linearGradient id="ddSky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={HZ.day}><stop offset="0" stopColor="#e2d6b8" /><stop offset="1" stopColor="#f6eedc" /></linearGradient>
        <linearGradient id="ddSand" gradientUnits="userSpaceOnUse" x1="0" y1={HZ.day} x2="0" y2={H}><stop offset="0" stopColor="#e8d8b4" /><stop offset="1" stopColor="#cdb48a" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#ddSky)" />
      <circle cx={260} cy={360} r={330} fill="#ffffff" opacity={0.6} /><circle cx={260} cy={360} r={70} fill="#fffef6" />
      <rect x={0} y={HZ.day} width={W} height={H - HZ.day} fill="url(#ddSand)" />
      {Array.from({ length: 26 }).map((_, i) => { const y = HZ.day + 30 + Math.pow(r(), 1.3) * (H - HZ.day); const k = (y - HZ.day) / (H - HZ.day); const x = r() * W; const w = 200 + k * 700; return <g key={i}><path d={`M${x - w / 2} ${y} Q${x - w * 0.1} ${y - 40 - 90 * k} ${x + w / 2} ${y} Z`} fill="#dcc79c" /><path d={`M${x - w * 0.1} ${y - 38 - 88 * k} Q${x + w * 0.2} ${y - 20 - 40 * k} ${x + w / 2} ${y}`} stroke="#b89a6a" strokeWidth={2 + 4 * k} fill="none" opacity={0.6} /></g>; })}
      {Array.from({ length: 70 }).map((_, i) => { const y = HZ.day + Math.pow(r(), 1.4) * (H - HZ.day); const k = (y - HZ.day) / (H - HZ.day); return <path key={`p${i}`} d={`M${r() * W} ${y} q${30 + 90 * k} -${3 + 5 * k} ${60 + 180 * k} 0`} stroke="#c4aa7c" strokeWidth={1 + 2 * k} fill="none" opacity={0.6} />; })}
    </g>
  );
};

export const DuskBand: React.FC = () => {
  const r = rng(8);
  return (
    <g>
      <defs>
        <linearGradient id="dkSky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={HZ.dusk}><stop offset="0" stopColor="#1e1830" /><stop offset="0.55" stopColor="#2a2238" /><stop offset="0.85" stopColor="#8a5a5a" /><stop offset="1" stopColor="#e89a5a" /></linearGradient>
        <radialGradient id="dkSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd090" stopOpacity={0.9} /><stop offset="0.3" stopColor="#e89a5a" stopOpacity={0.5} /><stop offset="1" stopColor="#e89a5a" stopOpacity={0} /></radialGradient>
        <linearGradient id="dkPlain" gradientUnits="userSpaceOnUse" x1="0" y1={HZ.dusk} x2="0" y2={H}><stop offset="0" stopColor="#d8c4a4" /><stop offset="0.4" stopColor="#bfae94" /><stop offset="1" stopColor="#8a7a68" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#dkSky)" />
      <ellipse cx={1000} cy={HZ.dusk} rx={620} ry={300} fill="url(#dkSun)" />
      {/* the ring of low dark hills */}
      <path d={`M-40 ${HZ.dusk + 10} L-40 ${HZ.dusk - 70} Q120 ${HZ.dusk - 130} 260 ${HZ.dusk - 60} Q420 ${HZ.dusk - 110} 560 ${HZ.dusk - 40} L740 ${HZ.dusk - 30} Q880 ${HZ.dusk - 100} 1040 ${HZ.dusk - 50} Q1200 ${HZ.dusk - 120} ${W + 40} ${HZ.dusk - 60} L${W + 40} ${HZ.dusk + 10} Z`} fill="#2a2030" />
      <rect x={0} y={HZ.dusk} width={W} height={H - HZ.dusk} fill="url(#dkPlain)" />
      {/* side hills closing the ring in the foreground */}
      <path d={`M-40 ${H} L-40 ${HZ.dusk + 200} Q160 ${HZ.dusk + 160} 300 ${HZ.dusk + 320} Q200 ${HZ.dusk + 700} -40 ${H}`} fill="#3a2c38" />
      <path d={`M${W + 40} ${H} L${W + 40} ${HZ.dusk + 180} Q1100 ${HZ.dusk + 150} 1000 ${HZ.dusk + 340} Q1080 ${HZ.dusk + 760} ${W + 40} ${H}`} fill="#32263a" />
      {Array.from({ length: 50 }).map((_, i) => { const y = HZ.dusk + 20 + Math.pow(r(), 1.5) * 800; const k = (y - HZ.dusk) / 800; return <path key={i} d={`M${300 + r() * 700} ${y} h${40 + 140 * k}`} stroke="#a89880" strokeWidth={1 + 2 * k} opacity={0.4} />; })}
    </g>
  );
};

/* ------------------------------------------------------------------ vehicles + people */
/** armoured truck, front three-quarter (night, approaching); s scale; lights 0..1; bounce px */
export const TruckFront: React.FC<{ x: number; y: number; s: number; bounce: number; col: string }> = ({ x, y, s, bounce, col }) => (
  <g transform={`translate(${x} ${y + bounce}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={150} ry={22} fill="#000" opacity={0.4} />
    <path d="M-120 0 L-120 -150 L-90 -200 L90 -200 L120 -150 L120 0 Z" fill={col} />
    <path d="M-95 -195 L95 -195 L80 -150 L-80 -150 Z" fill="#141210" />
    <rect x={-125} y={-60} width={250} height={30} fill="#1a1814" />
    <rect x={-110} y={-260} width={220} height={60} fill={col} opacity={0.85} />
    {[-1, 1].map((sd) => <g key={sd}><rect x={sd * 115 - 18} y={-10} width={36} height={40} rx={8} fill="#141210" /><circle cx={sd * 80} cy={-95} r={16} fill="#fff3d0" /></g>)}
  </g>
);
/** headlight glow pair + beam on the ground */
export const Headlights: React.FC<{ x: number; y: number; s: number; a?: number; tilt?: number }> = ({ x, y, s, a = 1, tilt = 0 }) => (
  <g opacity={a} transform={`rotate(${tilt} ${x} ${y})`}>
    <ellipse cx={x} cy={y + 60 * s} rx={160 * s} ry={50 * s} fill="url(#hlBeam)" />
    {[-1, 1].map((sd) => <g key={sd}><circle cx={x + sd * 80 * s} cy={y} r={70 * s} fill="url(#hlGlow)" /><circle cx={x + sd * 80 * s} cy={y} r={12 * s} fill="#fffaf0" /></g>)}
  </g>
);
export const LightDefs: React.FC = () => (
  <defs>
    <radialGradient id="hlGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff3d0" stopOpacity={0.9} /><stop offset="0.3" stopColor="#fff3d0" stopOpacity={0.35} /><stop offset="1" stopColor="#fff3d0" stopOpacity={0} /></radialGradient>
    <radialGradient id="hlBeam" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff3d0" stopOpacity={0.35} /><stop offset="1" stopColor="#fff3d0" stopOpacity={0} /></radialGradient>
    <radialGradient id="dustG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#8a7a60" stopOpacity={0.8} /><stop offset="1" stopColor="#8a7a60" stopOpacity={0} /></radialGradient>
    <radialGradient id="dustL" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#f0dcb0" stopOpacity={0.75} /><stop offset="1" stopColor="#f0dcb0" stopOpacity={0} /></radialGradient>
  </defs>
);
/** tiny truck seen from high (top/side), heading angle deg */
export const TinyTruck: React.FC<{ x: number; y: number; s: number; ang: number; col: string; tilt?: number }> = ({ x, y, s, ang, col, tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang + tilt}) scale(${s})`}>
    <rect x={-22} y={-9} width={44} height={18} rx={3} fill={col} />
    <rect x={10} y={-8} width={12} height={16} rx={2} fill="#2a2620" opacity={0.8} />
    <rect x={-24} y={9} width={48} height={5} fill="#000" opacity={0.25} />
  </g>
);

/** young soldier standing on a truck's side step, holding a rail, staring ahead (side view facing left). br breathing, bob */
export const Soldier: React.FC<{ x: number; y: number; h: number; br: number; bob: number }> = ({ x, y, h, br, bob }) => {
  const u = h / 7; const b = Math.sin(br) * u * 0.025 + bob;
  const shY = y - h * 0.8 + b; const uni = '#5a5a46', uniD = '#3e3e30', skin = '#9a6a52', skinD = '#6e4a3a';
  return (
    <g>
      <path d={`M${x - u * 0.35} ${y + b} L${x - u * 0.45} ${y - h * 0.47 + b} L${x + u * 0.45} ${y - h * 0.47 + b} L${x + u * 0.35} ${y + b} Z`} fill={uniD} />
      <rect x={x - u * 0.55} y={y - u * 0.05 + b} width={u * 0.6} height={u * 0.18} fill="#1a1814" />
      <path d={`M${x - u * 0.55} ${shY + u * 0.1} Q${x} ${shY - u * 0.15} ${x + u * 0.55} ${shY + u * 0.1} L${x + u * 0.5} ${y - h * 0.44 + b} L${x - u * 0.5} ${y - h * 0.44 + b} Z`} fill={uni} />
      {/* arm up to the rail behind him */}
      <path d={`M${x + u * 0.2} ${shY + u * 0.2} L${x + u * 0.75} ${shY - u * 0.3} L${x + u * 0.85} ${shY - u * 1.0}`} stroke={uni} strokeWidth={u * 0.28} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={x + u * 0.85} cy={shY - u * 1.05} r={u * 0.14} fill={skin} />
      <path d={`M${x - u * 0.2} ${shY + u * 0.2} L${x - u * 0.3} ${shY + u * 1.2} L${x - u * 0.15} ${shY + u * 1.9}`} stroke={uniD} strokeWidth={u * 0.28} strokeLinecap="round" fill="none" />
      <rect x={x - u * 0.15} y={shY - u * 0.28} width={u * 0.3} height={u * 0.32} fill={skinD} />
      <ellipse cx={x - u * 0.05} cy={shY - u * 0.62} rx={u * 0.38} ry={u * 0.46} fill={skin} />
      <path d={`M${x - u * 0.43} ${shY - u * 0.66} L${x - u * 0.5} ${shY - u * 0.55} L${x - u * 0.38} ${shY - u * 0.5} Z`} fill={skin} />
      <path d={`M${x - u * 0.3} ${shY - u * 0.66} l${u * 0.12} 0`} stroke="#1a1210" strokeWidth={u * 0.05} />
      <path d={`M${x - u * 0.38} ${shY - u * 0.42} l${u * 0.12} 0`} stroke={skinD} strokeWidth={u * 0.03} />
      {/* helmet (plain) */}
      <path d={`M${x - u * 0.52} ${shY - u * 0.72} Q${x - u * 0.45} ${shY - u * 1.25} ${x + u * 0.05} ${shY - u * 1.22} Q${x + u * 0.5} ${shY - u * 1.15} ${x + u * 0.48} ${shY - u * 0.62} Z`} fill="#4a4a3a" />
      <path d={`M${x - u * 0.55} ${shY - u * 0.72} L${x + u * 0.5} ${shY - u * 0.62}`} stroke="#2e2e24" strokeWidth={u * 0.06} />
      <path d={`M${x - u * 0.52} ${shY - u * 0.72} Q${x - u * 0.45} ${shY - u * 1.25} ${x + u * 0.05} ${shY - u * 1.22}`} stroke="#fff3d0" strokeOpacity={0.6} strokeWidth={u * 0.05} fill="none" />
    </g>
  );
};
