import React from 'react';
import { Glow, Puff } from './village_kit';

/** EP05 set "village": teacher's room with a window (3), cemetery (4), empty classroom (5), dusty yard (6); the night home (7) is live. Frame coords. */

/* ---------------- teacher's room (3) ---------------- */
export const TW = { x1: 600, x2: 1010, y1: 420, y2: 1120 };
export const TeacherRoom: React.FC = () => (
  <g>
    <rect x={-108} y={-192} width={1296} height={2400} fill="#d8cdb8" />
    <rect x={-108} y={1500} width={1296} height={700} fill="#8a7458" />
    {/* window: village outside in soft daylight */}
    <rect x={TW.x1 - 24} y={TW.y1 - 24} width={TW.x2 - TW.x1 + 48} height={TW.y2 - TW.y1 + 48} fill="#7a5e44" />
    <rect x={TW.x1} y={TW.y1} width={TW.x2 - TW.x1} height={TW.y2 - TW.y1} fill="#e9e2d4" />
    <rect x={TW.x1} y={TW.y1 + 420} width={TW.x2 - TW.x1} height={280} fill="#a8b89a" />
    <path d={`M${TW.x1} ${TW.y1 + 440} L${TW.x1 + 120} ${TW.y1 + 360} L${TW.x1 + 200} ${TW.y1 + 440} L${TW.x1 + 280} ${TW.y1 + 380} L${TW.x2} ${TW.y1 + 450} L${TW.x2} ${TW.y1 + 500} L${TW.x1} ${TW.y1 + 500} Z`} fill="#9a5a40" />
    <ellipse cx={TW.x1 + 330} cy={TW.y1 + 300} rx={90} ry={130} fill="#6a8a5a" />
    <rect x={(TW.x1 + TW.x2) / 2 - 6} y={TW.y1} width={12} height={TW.y2 - TW.y1} fill="#7a5e44" />
    <rect x={TW.x1} y={(TW.y1 + TW.y2) / 2 - 6} width={TW.x2 - TW.x1} height={12} fill="#7a5e44" />
    <rect x={TW.x1 - 40} y={TW.y2 + 24} width={TW.x2 - TW.x1 + 80} height={24} fill="#6a4e36" />
    {/* bookshelf, left */}
    <rect x={-108} y={300} width={360} height={1200} fill="#6a4e36" />
    {[420, 640, 860, 1080, 1300].map((y) => (
      <g key={y}>
        <rect x={-100} y={y} width={344} height={14} fill="#4a3424" />
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-90 + i * 36} y={y - 120 + (i % 3) * 14} width={30} height={120 - (i % 3) * 14} fill={['#8a3a34', '#3a5a6a', '#8a7a4a', '#5a4a6a'][i % 4]} />)}
      </g>
    ))}
    <path d={`M${TW.x1} ${TW.y2} L${TW.x2} ${TW.y2} L${TW.x2 - 200} 1500 L${TW.x1 - 400} 1500 Z`} fill="#fff4dc" opacity={0.18} />
  </g>
);

/** a book held open (open 1) or closed (0), centre at its spine (x,y), facing right */
export const HeldBook: React.FC<{ x: number; y: number; open: number; s?: number; c?: string }> = ({ x, y, open, s = 1, c = '#5a3a2a' }) => {
  const a = 70 * open;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`rotate(${-a})`}><rect x={0} y={-10} width={110} height={16} fill="#f4efe2" /><rect x={0} y={-14} width={112} height={6} fill={c} /></g>
      <g transform={`rotate(${a * 0.15})`}><rect x={0} y={-6} width={110} height={16} fill="#efe8d8" /><rect x={0} y={8} width={112} height={6} fill={c} /></g>
    </g>
  );
};

/* ---------------- cemetery (4) ---------------- */
export const CM = { mound: { x: 560, y: 1230 } };
export const Cemetery: React.FC = () => (
  <g>
    <defs><linearGradient id="vcSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d6dee2" /><stop offset="1" stopColor="#ece6da" /></linearGradient></defs>
    <rect x={-108} y={-192} width={1296} height={1000} fill="url(#vcSky)" />
    <rect x={-108} y={700} width={1296} height={120} fill="#b8b0a0" />
    {[[-60, 520], [180, 560], [900, 500], [1100, 560]].map(([x, y], i) => (
      <g key={i}><rect x={x + 30} y={y + 80} width={20} height={240} fill="#5a4a3a" /><ellipse cx={x + 40} cy={y + 60} rx={130} ry={90} fill="#7a8a62" />{[0, 1, 2].map((k) => <circle key={k} cx={x + k * 50} cy={y + 40 + (k % 2) * 30} r={10} fill="#f4efe0" />)}</g>
    ))}
    <rect x={-108} y={800} width={1296} height={1400} fill="#a8a07a" />
    {/* old graves (plain stones, no symbols) */}
    {[[80, 980], [300, 940], [820, 960], [1000, 1000], [180, 1120], [900, 1140]].map(([x, y], i) => (
      <g key={i}>
        <path d={`M${x - 70} ${y + 40} Q${x} ${y + 10} ${x + 70} ${y + 40} L${x + 60} ${y + 60} L${x - 60} ${y + 60} Z`} fill="#8a8466" />
        <path d={`M${x - 16} ${y + 34} L${x - 16} ${y - 40} Q${x} ${y - 56} ${x + 16} ${y - 40} L${x + 16} ${y + 34} Z`} fill="#d8d2c4" />
      </g>
    ))}
    {/* the fresh mound */}
    <path d={`M${CM.mound.x - 220} ${CM.mound.y + 40} Q${CM.mound.x} ${CM.mound.y - 80} ${CM.mound.x + 220} ${CM.mound.y + 40} Z`} fill="#7a5a3e" />
    <path d={`M${CM.mound.x - 180} ${CM.mound.y + 20} Q${CM.mound.x} ${CM.mound.y - 50} ${CM.mound.x + 180} ${CM.mound.y + 20}`} stroke="#9a7a58" strokeWidth={6} fill="none" />
    {[[-120, 0], [-40, -30], [60, -28], [140, 0]].map(([dx, dy], i) => <circle key={i} cx={CM.mound.x + dx} cy={CM.mound.y + dy} r={8} fill="#e8a0b0" />)}
    <path d={`M${CM.mound.x + 4} ${CM.mound.y - 40} L${CM.mound.x + 4} ${CM.mound.y - 140} Q${CM.mound.x + 20} ${CM.mound.y - 160} ${CM.mound.x + 36} ${CM.mound.y - 140} L${CM.mound.x + 36} ${CM.mound.y - 40} Z`} fill="#e8e2d4" />
  </g>
);

/** the stack of books beside the grave: n books (last one placed live) */
export const BookStack: React.FC<{ x: number; y: number; n: number }> = ({ x, y, n }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(${x + ((i * 7) % 11) - 5} ${y - i * 22}) rotate(${((i * 13) % 9) - 4})`}>
        <rect x={-60} y={-20} width={120} height={22} fill={['#8a3a34', '#3a5a6a', '#8a7a4a', '#5a4a6a', '#4a6a4a'][i % 5]} />
        <rect x={-56} y={-17} width={112} height={4} fill="#f4efe2" opacity={0.7} />
      </g>
    ))}
  </g>
);

/* ---------------- empty classroom (5) ---------------- */
export const EC = { ledge: 980, floor: 1360, chalkX: 640 };
export const EmptyClass: React.FC = () => (
  <g>
    <rect x={-108} y={-192} width={1296} height={2400} fill="#e2d8c2" />
    <rect x={-108} y={EC.floor} width={1296} height={800} fill="#9a8a6a" />
    <rect x={150} y={420} width={760} height={530} fill="#7a5a3a" />
    <rect x={176} y={446} width={708} height={480} fill="#2f4a3c" />
    <path d="M220 520 Q400 500 560 530 M240 640 Q420 630 600 650" stroke="#e8ece6" strokeWidth={14} opacity={0.08} fill="none" />
    <rect x={150} y={950} width={760} height={30} fill="#6a4a2e" />
    {/* windows right with light */}
    <rect x={1000} y={360} width={240} height={620} fill="#f6efd8" />
    <rect x={1000} y={360} width={240} height={620} fill="none" stroke="#8a7a60" strokeWidth={14} />
    <rect x={1114} y={360} width={12} height={620} fill="#8a7a60" />
    {/* teacher's desk + the empty chair */}
    <rect x={560} y={1120} width={380} height={26} fill="#8a6a44" /><rect x={580} y={1146} width={340} height={200} fill="#6a4e32" />
    <rect x={380} y={1000} width={110} height={200} rx={8} fill="#7a5a3a" />
    <rect x={360} y={1190} width={160} height={24} fill="#8a6a44" />
    <rect x={370} y={1214} width={14} height={140} fill="#5a3e28" /><rect x={496} y={1214} width={14} height={140} fill="#5a3e28" />
    {/* empty pupil desks */}
    {[[-60, 1600], [300, 1640], [680, 1600], [1020, 1640]].map(([x, y], i) => (
      <g key={i}><rect x={x} y={y} width={260} height={30} fill="#8a6a44" /><rect x={x + 20} y={y + 30} width={16} height={260} fill="#5a3e28" /><rect x={x + 224} y={y + 30} width={16} height={260} fill="#5a3e28" /></g>
    ))}
  </g>
);

/** dust beams from the window (ones) */
export const DustBeams: React.FC<{ t: number; x0?: number }> = ({ t, x0 = 1000 }) => (
  <g>
    <path d={`M${x0} 380 L${x0 + 240} 380 L560 ${EC.floor} L120 ${EC.floor} Z`} fill="#f0d9a8" opacity={0.22} />
    {Array.from({ length: 24 }, (_, i) => {
      const u = (t * (0.05 + (i % 4) * 0.01) + i * 0.137) % 1;
      const y = 420 + ((i * 113) % 900) - u * 120;
      const x = x0 - (y - 380) * 0.55 + ((i * 61) % 300) + Math.sin(t * 0.8 + i) * 12;
      return <circle key={i} cx={x} cy={y} r={i % 3 ? 2.5 : 4} fill="#fff6e0" opacity={0.55 * Math.sin(Math.PI * ((u + i * 0.05) % 1))} />;
    })}
  </g>
);

/* ---------------- dusty yard (6) ---------------- */
export const VillageYard: React.FC = () => (
  <g>
    <defs><linearGradient id="vySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfe6ea" /><stop offset="1" stopColor="#efe8d8" /></linearGradient></defs>
    <rect x={-108} y={-192} width={1296} height={1000} fill="url(#vySky)" />
    <path d="M-108 640 L120 560 L300 620 L300 900 L-108 900 Z" fill="#c9b89a" />
    <path d="M100 580 L220 520 L320 600 Z" fill="#9a5a40" />
    <rect x={720} y={560} width={420} height={340} fill="#d8cdb8" />
    <path d="M690 570 L930 440 L1170 570 Z" fill="#9a5a40" />
    <rect x={860} y={700} width={110} height={200} fill="#5a4a3a" />
    <ellipse cx={520} cy={560} rx={140} ry={160} fill="#6a8a5a" /><rect x={510} y={680} width={20} height={220} fill="#5a4a3a" />
    <rect x={-108} y={880} width={1296} height={1300} fill="#cdb48a" />
    {[[100, 1000], [700, 1050], [300, 1200], [950, 1260], [500, 1500]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={90} ry={14} fill="#b89c70" />)}
  </g>
);

/** closed book lying in the dust (prop) */
export const DustBook: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y}) rotate(-12)`}>
    <ellipse cx={10} cy={36} rx={170} ry={26} fill="#8a7050" opacity={0.5} />
    <path d="M-150 -10 L130 -40 L160 20 L-120 50 Z" fill="#6a3a2e" />
    <path d="M-120 50 L160 20 L160 34 L-120 64 Z" fill="#efe6d0" />
    <path d="M-150 -10 L-120 50 L-120 64 L-150 4 Z" fill="#4a2820" />
    <path d="M-80 0 L90 -20" stroke="#d9a441" strokeWidth={4} opacity={0.5} />
    <path d="M-150 -10 L130 -40 L160 20 L-120 50 Z" fill="#cdb48a" opacity={0.35} />
  </g>
);

/** drum (prop) */
export const Drum: React.FC<{ x: number; y: number; hit: number }> = ({ x, y, hit }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-60} y={-40} width={120} height={110} fill="#a85a3a" />
    <ellipse cx={0} cy={-40} rx={60} ry={18} fill="#efe2c4" />
    <ellipse cx={0} cy={-40} rx={60 + 10 * hit} ry={18 + 4 * hit} fill="none" stroke="#fff" strokeWidth={3} opacity={hit} />
    <path d="M-60 -20 L60 50 M60 -20 L-60 50" stroke="#e8d0a0" strokeWidth={3} />
  </g>
);

/* ---------------- night home (7), live ---------------- */
export const NightRoom: React.FC = () => (
  <g>
    <rect x={-200} y={-300} width={1500} height={2600} fill="#5a4a40" />
    <rect x={-200} y={1400} width={1500} height={900} fill="#3a2e28" />
    <rect x={160} y={460} width={300} height={360} fill="#141a30" />
    <rect x={160} y={460} width={300} height={360} fill="none" stroke="#2a201a" strokeWidth={12} />
    <circle cx={380} cy={540} r={26} fill="#e8e6d8" opacity={0.8} />
    <path d="M120 440 L210 440 Q190 640 210 860 L120 860 Z" fill="#6a4a5a" />
    <rect x={-200} y={1200} width={1500} height={20} fill="#2a201a" opacity={0.4} />
    {/* low sofa (father sits on it) */}
    <rect x={540} y={1200} width={560} height={200} rx={20} fill="#6a5a4a" />
    <rect x={540} y={1040} width={560} height={180} rx={20} fill="#5a4a3a" />
    {/* side table */}
    <rect x={880} y={1180} width={180} height={20} fill="#3a2a1e" /><rect x={900} y={1200} width={16} height={200} fill="#2a1e14" /><rect x={1024} y={1200} width={16} height={200} fill="#2a1e14" />
  </g>
);

export const TableLamp: React.FC<{ on: number }> = ({ on }) => (
  <g>
    {on > 0 && <Glow id="vnLamp" x={970} y={1080} rx={700} ry={600} c="#ffcf86" o={0.55 * on} mid={0.25} />}
    <rect x={960} y={1060} width={20} height={120} fill="#3a2e24" />
    <ellipse cx={970} cy={1180} rx={50} ry={10} fill="#3a2e24" />
    <path d="M910 1060 L1030 1060 L1000 980 L940 980 Z" fill={on > 0.5 ? '#ffe2a8' : '#8a7a62'} />
    <path d="M985 1110 L1000 1110" stroke="#1a1410" strokeWidth={6} />
  </g>
);

export { Puff };
