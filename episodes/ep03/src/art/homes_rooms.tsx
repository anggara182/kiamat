import React from 'react';
import { Glow, Puff } from './homes_kit';

/** EP03 homes set: dining room at night (two angles), shortage beats (live), highway at dawn. Frame coords. */
export const DR = { table: 1180, floor: 1720, tv: { x: 140, y: 700, w: 300, h: 190 } };

/** angle A (shot 8): back wall with the TV (left), a cabinet, a calendar */
export const DiningA: React.FC = () => {
  const { tv } = DR;
  return (
    <g>
      <defs>
        <radialGradient id="hdA" cx="0.55" cy="0.3" r="0.8"><stop offset="0" stopColor="#7a6450" /><stop offset="0.6" stopColor="#3e322c" /><stop offset="1" stopColor="#16121a" /></radialGradient>
      </defs>
      <rect x={-108} y={-192} width={1296} height={1500} fill="url(#hdA)" />
      <rect x={-108} y={1300} width={1296} height={900} fill="#1e1816" />
      {/* TV cabinet + TV (screen = glow only, nothing readable) */}
      <rect x={tv.x - 40} y={tv.y + tv.h + 20} width={tv.w + 80} height={240} fill="#2a201a" />
      <rect x={tv.x - 14} y={tv.y - 14} width={tv.w + 28} height={tv.h + 28} rx={8} fill="#111" />
      <rect x={tv.x} y={tv.y} width={tv.w} height={tv.h} fill="#9fd7ff" />
      <rect x={tv.x} y={tv.y + tv.h * 0.55} width={tv.w} height={tv.h * 0.45} fill="#5f8fb8" opacity={0.6} />
      {/* framed photo, wall clock, curtain doorway right */}
      <rect x={560} y={420} width={170} height={130} fill="#2a201a" /><rect x={572} y={432} width={146} height={106} fill="#8a7a66" />
      <circle cx={860} cy={420} r={50} fill="#e8dcc4" /><circle cx={860} cy={420} r={50} fill="none" stroke="#2a201a" strokeWidth={8} />
      <path d="M860 420 L860 386 M860 420 L884 430" stroke="#2a201a" strokeWidth={5} />
      <path d="M960 300 L1188 300 L1188 1300 L980 1300 Q1000 800 960 300 Z" fill="#6a3a34" />
    </g>
  );
};

/** angle B (shot 9): the opposite wall: window with night curtains, a shelf with a vase */
export const DiningB: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="hdB" cx="0.45" cy="0.3" r="0.8"><stop offset="0" stopColor="#6e5a48" /><stop offset="0.6" stopColor="#382d28" /><stop offset="1" stopColor="#141016" /></radialGradient>
    </defs>
    <rect x={-108} y={-192} width={1296} height={1500} fill="url(#hdB)" />
    <rect x={-108} y={1300} width={1296} height={900} fill="#1e1816" />
    <rect x={380} y={380} width={320} height={420} fill="#0a0e1c" />
    <rect x={384} y={384} width={312} height={412} fill="none" stroke="#2a201a" strokeWidth={10} />
    <rect x={536} y={384} width={8} height={412} fill="#2a201a" />
    {[[440, 520], [610, 600], [480, 690]].map(([x, y], i) => <rect key={i} x={x} y={y} width={16} height={12} fill="#ffcf86" opacity={0.6} />)}
    <path d="M330 350 L430 350 Q400 600 430 830 L330 830 Z" fill="#5a3a3a" />
    <path d="M650 350 L750 350 L750 830 L650 830 Q680 600 650 350 Z" fill="#5a3a3a" />
    <rect x={800} y={700} width={240} height={14} fill="#2a201a" />
    <path d="M880 700 L870 620 Q900 600 930 620 L920 700 Z" fill="#7a8a6a" />
  </g>
);

/** hanging lamp over the table (ones): sway px */
export const TableLamp: React.FC<{ x: number; sway: number }> = ({ x, sway }) => (
  <g>
    <path d={`M${x} -200 L${x + sway} 560`} stroke="#120e0c" strokeWidth={4} />
    <Glow id={`hdL${x}`} x={x + sway} y={600} rx={560} ry={480} c="#ffcf86" o={0.4} mid={0.25} />
    <path d={`M${x + sway - 90} 600 L${x + sway + 90} 600 L${x + sway + 30} 556 L${x + sway - 30} 556 Z`} fill="#3a4a3a" />
    <ellipse cx={x + sway} cy={604} rx={26} ry={16} fill="#fff2d0" />
  </g>
);

/** the table (live, in front of seated people). jump: plates hop (px) */
export const Table: React.FC<{ jump?: number; x1?: number; x2?: number }> = ({ jump = 0, x1 = 60, x2 = 1020 }) => (
  <g>
    <path d={`M${x1} ${DR.table} L${x2} ${DR.table} L${x2 + 40} ${DR.table + 60} L${x1 - 40} ${DR.table + 60} Z`} fill="#c9b89a" />
    <rect x={x1 - 40} y={DR.table + 60} width={x2 - x1 + 80} height={260} fill="#b8a688" />
    <path d={Array.from({ length: 12 }, (_, i) => `M${x1 - 40 + i * ((x2 - x1 + 80) / 12)} ${DR.table + 60} l0 260`).join(' ')} stroke="#a08e70" strokeWidth={4} />
    <rect x={x1 - 40} y={DR.table + 320} width={x2 - x1 + 80} height={500} fill="#1a1412" />
    {[[260, 1196], [540, 1204], [800, 1196]].map(([x, y], i) => (
      <g key={i} transform={`translate(0 ${-jump * (i === 1 ? 1.2 : 0.8)})`}>
        <ellipse cx={x} cy={y} rx={78} ry={18} fill="#eee8dc" />
        <ellipse cx={x} cy={y - 2} rx={48} ry={10} fill={i === 1 ? '#c98a3a' : '#e8e2cc'} />
      </g>
    ))}
    <g transform={`translate(0 ${-jump * 1.5})`}>
      <rect x={660} y={1130} width={30} height={60} fill="#cfe6f0" opacity={0.6} />
      <rect x={400} y={1126} width={30} height={64} fill="#cfe6f0" opacity={0.6} />
    </g>
  </g>
);

/* ---------------- shot 14: three shortage beats (all live) ---------------- */
export const TapBeat: React.FC<{ turn: number; drop: number; t: number }> = ({ turn, drop, t }) => (
  <g>
    <rect x={-200} y={-300} width={1500} height={2600} fill="#cfd3d2" />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={-200} y1={i * 160} x2={1300} y2={i * 160} stroke="#b4baba" strokeWidth={4} />)}
    {Array.from({ length: 10 }, (_, i) => <line key={`v${i}`} x1={i * 160 - 100} y1={-300} x2={i * 160 - 100} y2={1250} stroke="#b4baba" strokeWidth={4} />)}
    {/* sink */}
    <path d="M60 1250 L1020 1250 L960 1560 L120 1560 Z" fill="#9aa3a8" />
    <path d="M120 1270 L960 1270 L910 1520 L170 1520 Z" fill="#c4cbd0" />
    <ellipse cx={560} cy={1470} rx={40} ry={12} fill="#5a6066" />
    <rect x={-200} y={1560} width={1500} height={700} fill="#6a5e52" />
    {/* tap */}
    <rect x={500} y={700} width={90} height={220} rx={20} fill="#b8bec4" />
    <path d="M590 760 L760 760 Q800 760 800 800 L800 900 L760 900 L760 810 L590 810 Z" fill="#c8ced4" />
    <path d="M590 764 L760 764 Q796 764 796 800" stroke="#f4f8fa" strokeWidth={8} fill="none" opacity={0.7} />
    <g transform={`rotate(${-50 * turn} 545 690)`}>
      <rect x={470} y={672} width={150} height={36} rx={14} fill="#9aa0a6" />
    </g>
    {/* the one drop */}
    {drop < 1 ? <ellipse cx={780} cy={906 + drop * drop * 560} rx={14} ry={22} fill="#bfe2f0" opacity={drop > 0 ? 1 : 0.9 * Math.min(1, t * 2)} /> : null}
    {drop >= 1 && drop < 1.6 && <ellipse cx={780} cy={1470} rx={20 + (drop - 1) * 80} ry={6 + (drop - 1) * 12} fill="none" stroke="#bfe2f0" strokeWidth={4} opacity={1.6 - drop} />}
  </g>
);

export const BakeryBeat: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-200} y={-300} width={1500} height={2600} fill="#d8c8a8" />
    {[520, 860, 1200].map((y) => (
      <g key={y}>
        <rect x={40} y={y} width={1000} height={26} fill="#8a6a44" />
        <rect x={40} y={y + 26} width={1000} height={14} fill="#5e4628" />
        <path d={`M70 ${y} L1010 ${y} L990 ${y - 20} L90 ${y - 20} Z`} fill="#efe6d0" />
        {[180, 420, 700, 900].map((x, i) => <circle key={x} cx={x + (i * 13) % 40} cy={y - 24} r={4} fill="#b88a4a" />)}
        <rect x={120} y={y + 6} width={70} height={16} fill="#f6f1e4" />
      </g>
    ))}
    <rect x={20} y={300} width={30} height={1300} fill="#5e4628" /><rect x={1030} y={300} width={30} height={1300} fill="#5e4628" />
    <rect x={-200} y={1560} width={1500} height={700} fill="#6a5a44" />
    <path d="M1060 0 L1188 0 L1188 2112 L1060 2112 Z" fill="#3a3028" opacity={0.6} />
    {Array.from({ length: 10 }, (_, i) => {
      const u = (t * 0.06 + i * 0.13) % 1;
      return <circle key={i} cx={200 + ((i * 97) % 700) + Math.sin(t + i) * 10} cy={300 + u * 1100} r={3} fill="#fff8e8" opacity={0.5 * Math.sin(Math.PI * u)} />;
    })}
  </g>
);

export const QueueBg: React.FC = () => (
  <g>
    <rect x={-200} y={-300} width={1500} height={2600} fill="#e6e8ea" />
    <rect x={-200} y={500} width={1500} height={900} fill="#b8b2a6" />
    <rect x={-200} y={500} width={1500} height={40} fill="#8f897d" />
    <rect x={-200} y={1400} width={1500} height={800} fill="#9a948a" />
    <rect x={700} y={760} width={220} height={640} fill="#5a544a" />
  </g>
);

/* ---------------- shot 23: highway at dawn ---------------- */
export const HW = { hz: 900, vx: 470 };
export const HighwayBand: React.FC = () => {
  const { hz, vx } = HW;
  return (
    <g>
      <defs>
        <linearGradient id="hhwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a4652" /><stop offset="0.75" stopColor="#8f7f84" /><stop offset="1" stopColor="#b9a59a" /></linearGradient>
        <radialGradient id="hhwSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd8a8" stopOpacity={0.95} /><stop offset="0.3" stopColor="#ffd8a8" stopOpacity={0.4} /><stop offset="1" stopColor="#ffd8a8" stopOpacity={0} /></radialGradient>
        <linearGradient id="hhwRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a807e" /><stop offset="1" stopColor="#4a4446" /></linearGradient>
      </defs>
      <rect x={-108} y={-192} width={1296} height={1200} fill="url(#hhwSky)" />
      <ellipse cx={600} cy={hz - 60} rx={420} ry={420} fill="url(#hhwSun)" />
      <circle cx={600} cy={hz - 60} r={44} fill="#ffe8c8" />
      {/* the other city's skyline on the horizon */}
      {[[280, 120], [320, 190], [360, 140], [410, 240], [455, 170], [500, 300], [545, 200], [590, 150], [640, 260], [690, 130], [740, 180]].map(([x, h], i) => (
        <rect key={i} x={x} y={hz - h} width={40 + (i % 3) * 8} height={h} fill="#7a6e78" opacity={0.85} />
      ))}
      <path d={`M-108 ${hz} L1188 ${hz} L1188 ${hz + 30} L-108 ${hz + 30} Z`} fill="#8a7a78" />
      {/* fields either side, the road converging to the horizon */}
      <path d={`M-108 ${hz} L1188 ${hz} L1188 2112 L-108 2112 Z`} fill="#6a6058" />
      <path d={`M${vx - 6} ${hz} L${vx + 6} ${hz} L1100 2112 L-200 2112 Z`} fill="url(#hhwRoad)" />
      <path d={`M${vx} ${hz} L460 2112`} stroke="#d8cfc0" strokeWidth={6} strokeDasharray="40 60" opacity={0.6} />
      <path d={`M${vx + 8} ${hz} L1188 1760`} stroke="#9a9088" strokeWidth={10} />
      {Array.from({ length: 7 }, (_, i) => {
        const u = Math.pow((i + 1) / 8, 1.8);
        const x = vx + 10 + (1300 - vx) * u, y = hz + (1100) * u;
        return <rect key={i} x={x} y={y - 420 * u - 20} width={4 + 10 * u} height={420 * u + 20} fill="#4a4446" />;
      })}
      {/* roadside stall (right foreground) */}
      <path d="M760 1160 L1188 1110 L1188 1180 L760 1220 Z" fill="#3a4a5a" />
      <rect x={790} y={1220} width={398} height={300} fill="#5a4636" />
      <rect x={780} y={1210} width={408} height={22} fill="#7a5e44" />
      <rect x={800} y={1200} width={16} height={340} fill="#3e3026" />
    </g>
  );
};

/** the column of walkers (ON TWOS): many simple silhouettes along the road from near to the horizon */
export const Column: React.FC<{ t2: number }> = ({ t2 }) => {
  const people: React.ReactNode[] = [];
  for (let i = 0; i < 70; i++) {
    const u = ((i / 70) + t2 * 0.012) % 1; // advance toward the horizon
    const d = Math.pow(1 - u, 2.2); // 1 near, 0 far
    const y = HW.hz + 1150 * d;
    const lane = ((i * 37) % 7) / 6 - 0.5;
    const x = HW.vx + lane * (40 + 560 * d) - 80 * d;
    const s = 0.04 + 0.9 * d;
    const ph = t2 * 7 + i * 1.7;
    const sw = Math.sin(ph) * 14;
    const c = d > 0.5 ? '#2a2630' : d > 0.2 ? '#3e3844' : '#5e5662';
    people.push(
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill={c}>
        <path d={`M-10 -150 L${-12 + sw} 0 L${-2 + sw} 0 L0 -150 Z`} />
        <path d={`M0 -150 L${4 - sw} 0 L${14 - sw} 0 L10 -150 Z`} />
        <path d="M-20 -150 Q-24 -230 -14 -250 L18 -250 Q26 -230 22 -150 Z" />
        <circle cx={1} cy={-270} r={20} />
        {i % 4 === 0 && <rect x={-30} y={-250} width={24} height={60} rx={6} />}
      </g>,
    );
  }
  // far-to-near order
  return <g>{people.reverse()}</g>;
};

/** old radio on the stall counter: crackle 0..1 (ones) */
export const Radio: React.FC<{ x: number; y: number; crackle: number; t: number }> = ({ x, y, crackle, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-90} y={-110} width={180} height={110} rx={14} fill="#7a4a2a" />
    <rect x={-74} y={-92} width={90} height={74} rx={8} fill="#c9b48a" />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-70} y1={-84 + i * 12} x2={12} y2={-84 + i * 12} stroke="#8a7458" strokeWidth={3} />)}
    <circle cx={50} cy={-70} r={16} fill="#3a2a1a" /><circle cx={50} cy={-30} r={10} fill="#3a2a1a" />
    <rect x={20} y={-104} width={60} height={14} rx={4} fill={crackle > 0.1 ? '#ffd88a' : '#5a4a3a'} />
    <path d="M60 -110 L120 -220" stroke="#9a9a9a" strokeWidth={4} />
    {crackle > 0 && [0, 1, 2].map((i) => {
      const r = 40 + ((t * 120 + i * 40) % 120);
      return <path key={i} d={`M${-100 - r * 0.3} ${-110 - r * 0.5} q${-20} ${r * 0.5} 0 ${r}`} stroke="#ffe8c0" strokeWidth={4} fill="none" opacity={crackle * (1 - ((t * 120 + i * 40) % 120) / 120)} />;
    })}
    {crackle > 0 && <Glow id="hhwRad" x={50} y={-97} rx={80} c="#ffd88a" o={0.6 * crackle} />}
  </g>
);

export { Puff };
