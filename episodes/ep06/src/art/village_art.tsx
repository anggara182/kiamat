import React from 'react';
import { Glow, Puff, limb } from './village_kit';

/** EP06 set "village": scorched street (5, 6), courtyard by day (9) and lamplit night (10), roadside tea stall (12). Frame coords. */

/* ---------------- scorched village street (5, 6) ---------------- */
export const VS = { ground: 1250 };
export const Street: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="vsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe6d2" /><stop offset="1" stopColor="#d8c39a" /></linearGradient>
      <linearGradient id="vsDust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9a87a" /><stop offset="1" stopColor="#a07c55" /></linearGradient>
    </defs>
    <rect x={-108} y={-192} width={1296} height={1100} fill="url(#vsSky)" />
    <circle cx={880} cy={160} r={70} fill="#fffbe8" />
    {/* palms */}
    {[[120, 760], [980, 700]].map(([x, y], i) => (
      <g key={i}>
        <path d={`M${x} ${y + 300} Q${x + 20} ${y + 150} ${x + 10} ${y}`} stroke="#6a5a3e" strokeWidth={22} fill="none" />
        {[-70, -30, 10, 50, 90, 140].map((a) => <path key={a} d={`M${x + 10} ${y} q${Math.cos((a * Math.PI) / 180) * 80} ${Math.sin((a * Math.PI) / 180) * 30 - 40} ${Math.cos((a * Math.PI) / 180) * 170} ${Math.sin((a * Math.PI) / 180) * 80 + 20}`} stroke="#7a7a4a" strokeWidth={16} fill="none" strokeLinecap="round" />)}
      </g>
    ))}
    {/* mud-brick + concrete houses */}
    <rect x={-108} y={720} width={420} height={540} fill="#c9a87a" />
    <rect x={-108} y={700} width={430} height={30} fill="#a8865a" />
    <rect x={40} y={900} width={110} height={360} fill="#3a2a1e" />
    <rect x={200} y={820} width={80} height={80} fill="#4a3a2a" />
    <rect x={312} y={780} width={360} height={480} fill="#d8cdb8" />
    <rect x={312} y={760} width={370} height={26} fill="#b8ad98" />
    <rect x={420} y={860} width={140} height={110} fill="#5a4a3a" />
    <rect x={672} y={740} width={520} height={520} fill="#b89870" />
    <rect x={760} y={940} width={120} height={320} fill="#3a2a1e" />
    <rect x={940} y={840} width={90} height={90} fill="#4a3a2a" />
    {[[-80, 820], [700, 800], [1100, 900]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l60 10 l-10 40 Z`} fill="#8a6a44" opacity={0.4} />)}
    {/* dusty road */}
    <rect x={-108} y={VS.ground} width={1296} height={1000} fill="url(#vsDust)" />
    {[[200, 1400], [700, 1460], [400, 1600], [950, 1700]].map(([x, y], i) => <path key={i} d={`M${x - 80} ${y} l60 6 l40 -10 l60 8`} stroke="#4a3524" strokeWidth={4} fill="none" opacity={0.5} />)}
  </g>
);

/** pickup truck, side view facing left, ground y; load drawn on the bed */
export const Pickup: React.FC<{ x: number; y: number; bounce: number }> = ({ x, y, bounce }) => (
  <g transform={`translate(${x} ${y - bounce})`}>
    <ellipse cx={330} cy={bounce + 10} rx={380} ry={18} fill="#4a3524" opacity={0.35} />
    {/* cab */}
    <path d="M0 -90 L0 -200 Q4 -230 40 -236 L120 -320 L240 -320 L250 -90 Z" fill="#e8e2d0" />
    <path d="M60 -230 L130 -300 L230 -300 L232 -230 Z" fill="#6a8a9a" />
    <rect x={-10} y={-120} width={40} height={20} fill="#fff3d0" opacity={0.7} />
    {/* bed */}
    <rect x={250} y={-200} width={420} height={110} fill="#d8d0bc" />
    <rect x={250} y={-210} width={420} height={14} fill="#b8b0a0" />
    <rect x={-10} y={-100} width={690} height={30} fill="#8a8478" />
    {[110, 540].map((cx) => <g key={cx}><circle cx={cx} cy={-40} r={60} fill="#2a2420" /><circle cx={cx} cy={-40} r={26} fill="#8a8478" /></g>)}
  </g>
);

/** the family's load on the truck bed (pots, a bicycle, bundles) */
export const Load: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={330} cy={-230} rx={80} ry={50} fill="#8a6a8a" />
    <ellipse cx={460} cy={-240} rx={90} ry={60} fill="#c96b4a" />
    <path d="M300 -280 Q340 -320 380 -280 L370 -230 L310 -230 Z" fill="#b8bec4" />
    <path d="M540 -300 Q580 -340 620 -300 L612 -240 L548 -240 Z" fill="#a8865a" />
    <g stroke="#3a3a44" strokeWidth={6} fill="none"><circle cx={400} cy={-340} r={44} /><circle cx={540} cy={-340} r={44} /><path d="M400 -340 L460 -390 L540 -340 L470 -340 Z M460 -390 L470 -410" /></g>
  </g>
);

/** dry hand pump; handle 0..1 (down) */
export const HandPump: React.FC<{ x: number; y: number; handle: number }> = ({ x, y, handle }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-60} y={-20} width={120} height={30} fill="#8a8478" />
    <rect x={-22} y={-300} width={44} height={290} fill="#4a6a6a" />
    <rect x={-30} y={-320} width={60} height={30} rx={8} fill="#3a5656" />
    <path d="M22 -200 L90 -220 L96 -200 L28 -180 Z" fill="#3a5656" />
    <g transform={`rotate(${-18 + 34 * handle} -10 -306)`}><rect x={-230} y={-316} width={230} height={18} rx={8} fill="#3a5656" /></g>
    <path d="M-22 -280 L-22 -40" stroke="#7a9a9a" strokeWidth={6} opacity={0.6} />
  </g>
);

/** water tanker truck, side view facing left; cab window at (x+150, y-330) */
export const Tanker: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={380} cy={10} rx={460} ry={20} fill="#4a3524" opacity={0.35} />
    <path d="M0 -90 L0 -240 Q4 -270 40 -276 L110 -400 L260 -400 L270 -90 Z" fill="#c9433a" />
    <path d="M70 -280 L120 -380 L250 -380 L252 -280 Z" fill="#2a2a30" />
    <rect x={280} y={-380} width={520} height={260} rx={130} fill="#c8ccc8" />
    <rect x={280} y={-380} width={520} height={60} rx={30} fill="#e8ece8" opacity={0.6} />
    <rect x={270} y={-120} width={540} height={30} fill="#5a5a5a" />
    {[120, 480, 680].map((cx) => <g key={cx}><circle cx={cx} cy={-40} r={64} fill="#2a2420" /><circle cx={cx} cy={-40} r={26} fill="#8a8478" /></g>)}
    <rect x={540} y={-120} width={30} height={60} fill="#5a5a5a" />
  </g>
);

/* ---------------- courtyard (9 day, 10 night) ---------------- */
export type CPal = { wall: string; wallD: string; floor: string; sky: string; arch: string };
export const COURT_DAY: CPal = { wall: '#d8c39a', wallD: '#a8865a', floor: '#b89870', sky: '#efe6d2', arch: '#fff4dc' };
export const COURT_NIGHT: CPal = { wall: '#2a2a3a', wallD: '#1a1a28', floor: '#22202a', sky: '#070b16', arch: '#a9b8d6' };
export const Courtyard: React.FC<{ pal: CPal; night?: boolean }> = ({ pal, night }) => (
  <g>
    <rect x={-108} y={-192} width={1296} height={2400} fill={pal.wall} />
    <rect x={-108} y={-192} width={1296} height={300} fill={pal.sky} />
    {/* an arch opening to the right: bright distance toward the river */}
    <path d="M760 1280 L760 640 Q900 480 1040 640 L1040 1280 Z" fill={pal.arch} />
    {!night && <path d="M760 1060 L1040 1040 L1040 1280 L760 1280 Z" fill="#c9a87a" />}
    {!night && <path d="M800 1040 Q900 1020 1000 1040" stroke="#e8d8b0" strokeWidth={6} fill="none" />}
    {night && <circle cx={960} cy={720} r={30} fill="#e8eef8" opacity={0.9} />}
    <path d="M740 1280 L740 640 Q900 460 1060 640 L1060 1280" stroke={pal.wallD} strokeWidth={30} fill="none" />
    {/* a niche, a hanging cloth, a water jar */}
    <rect x={120} y={600} width={160} height={220} rx={70} fill={pal.wallD} />
    <path d="M420 300 L560 300 L540 760 L440 760 Z" fill={night ? '#3a2a3a' : '#a85a4a'} opacity={0.8} />
    <path d="M560 1220 Q560 1110 620 1100 Q680 1110 680 1220 Q680 1280 620 1290 Q560 1280 560 1220 Z" fill={night ? '#3a2a24' : '#9a5a3a'} />
    <rect x={-108} y={1280} width={1296} height={900} fill={pal.floor} />
    {/* palm-leaf shadow on the wall (day) */}
    {!night && [[200, 400], [300, 460], [380, 380]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q120 40 240 10`} stroke="#8a6a44" strokeWidth={16} opacity={0.25} fill="none" />)}
    {/* low bench along the wall */}
    <rect x={-60} y={1140} width={760} height={30} fill={night ? '#3a2e28' : '#8a6a44'} />
    <rect x={-60} y={1170} width={760} height={110} fill={night ? '#2a2018' : '#6a4e32'} />
  </g>
);

/** prayer beads loop held at (x,y); shift 0..1 rotates the beads */
export const Beads: React.FC<{ x: number; y: number; shift: number }> = ({ x, y, shift }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: 16 }, (_, i) => {
      const a = ((i + shift * 2) / 16) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * 26} cy={34 + Math.sin(a) * 40} r={6} fill="#6a3a22" />;
    })}
    <path d="M0 74 L0 100" stroke="#6a3a22" strokeWidth={4} /><circle cx={0} cy={104} r={8} fill="#6a3a22" />
  </g>
);

/** oil lamp on the floor with flicker (ones) */
export const OilLamp: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const fl = 0.85 + 0.1 * Math.sin(t * 23) + 0.05 * Math.sin(t * 57);
  return (
    <g>
      <Glow id="vcLamp" x={x} y={y - 60} rx={700 * fl} ry={560 * fl} c="#ffcf86" o={0.55 * fl} mid={0.25} />
      <path d={`M${x - 50} ${y} Q${x} ${y - 50} ${x + 50} ${y} Z`} fill="#8a5a2a" />
      <path d={`M${x} ${y - 30} Q${x - 10 * fl} ${y - 70} ${x} ${y - 90 * fl} Q${x + 12} ${y - 60} ${x} ${y - 30} Z`} fill="#ffd88a" />
    </g>
  );
};

/* ---------------- roadside tea stall (12) ---------------- */
export const TeaStall: React.FC = () => (
  <g>
    <defs><linearGradient id="vtSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe6d2" /><stop offset="1" stopColor="#d8c39a" /></linearGradient></defs>
    <rect x={-108} y={-192} width={1296} height={1200} fill="url(#vtSky)" />
    <rect x={-108} y={900} width={1296} height={1300} fill="#c9a87a" />
    <path d="M-108 960 L1188 920" stroke="#8a6a44" strokeWidth={30} opacity={0.4} />
    {/* stall: awning on poles, shelf with glasses, kettle */}
    <path d="M-60 420 L1140 420 L1180 520 L-100 520 Z" fill="#4a7a8a" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-100 + i * 128} 520 q64 30 128 0`} fill="#4a7a8a" />)}
    <rect x={-40} y={420} width={24} height={760} fill="#5a4a3a" /><rect x={1080} y={420} width={24} height={760} fill="#5a4a3a" />
    <rect x={60} y={560} width={960} height={520} fill="#b8a07a" opacity={0.5} />
    <rect x={120} y={700} width={420} height={16} fill="#6a4e32" />
    {[150, 210, 270, 330, 390, 450].map((x) => <rect key={x} x={x} y={650} width={34} height={50} fill="#e8d8b0" opacity={0.7} />)}
    <path d="M760 640 L860 640 L880 760 L740 760 Z" fill="#b8bec4" />
    <path d="M860 660 Q920 640 920 700" stroke="#b8bec4" strokeWidth={10} fill="none" />
  </g>
);

/** stall table in front of the seated men; jump: glasses hop */
export const StallTable: React.FC<{ jump: number }> = ({ jump }) => (
  <g>
    <rect x={260} y={1120} width={760} height={30} fill="#8a6a44" />
    <rect x={290} y={1150} width={24} height={300} fill="#5a3e28" /><rect x={966} y={1150} width={24} height={300} fill="#5a3e28" />
    {[420, 620, 820].map((x, i) => (
      <g key={x} transform={`translate(0 ${-jump * (1 + i * 0.3)})`}>
        <path d={`M${x - 20} 1060 L${x + 20} 1060 L${x + 14} 1120 L${x - 14} 1120 Z`} fill="#e8d8b0" opacity={0.85} />
        <rect x={x - 16} y={1080} width={32} height={34} fill="#b8622a" opacity={0.8} />
      </g>
    ))}
  </g>
);

export { Puff, limb };
