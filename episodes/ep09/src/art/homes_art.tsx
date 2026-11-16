import React from 'react';
import { Glow, Puff, limb, Mitt } from './homes_kit';

/** EP09 set "homes": treaty hall (3), fireplace macro (8), doorway at dawn (11), empty classroom with a window on the street (12). Frame coords. */

/* ---------------- treaty hall (3) ---------------- */
export const HL = { table: 1180 };
export const TreatyHall: React.FC = () => (
  <g>
    <rect x={-108} y={-192} width={1296} height={2400} fill="#f6efe0" />
    {/* tall windows with soft light, plain pilasters, no emblems */}
    {[60, 340, 620, 900].map((x) => (
      <g key={x}>
        <rect x={x} y={180} width={180} height={640} fill="#fffaf0" />
        <rect x={x} y={180} width={180} height={640} fill="none" stroke="#d8ccb4" strokeWidth={14} />
        <rect x={x + 84} y={180} width={12} height={640} fill="#d8ccb4" />
        <rect x={x - 50} y={140} width={30} height={760} fill="#e6dcc6" />
      </g>
    ))}
    <rect x={-108} y={900} width={1296} height={20} fill="#d8ccb4" />
    <rect x={-108} y={920} width={1296} height={1300} fill="#c9b898" />
  </g>
);

/** long table (live, in front of the delegations) with papers and two pens */
export const LongTable: React.FC = () => (
  <g>
    <path d={`M-60 ${HL.table} L1140 ${HL.table} L1200 ${HL.table + 60} L-120 ${HL.table + 60} Z`} fill="#6a4e32" />
    <rect x={-120} y={HL.table + 60} width={1320} height={500} fill="#4a3624" />
    <rect x={-120} y={HL.table + 60} width={1320} height={14} fill="#8a6a44" />
    <path d={`M420 ${HL.table + 10} L660 ${HL.table + 10} L670 ${HL.table + 40} L410 ${HL.table + 40} Z`} fill="#f6f2e8" />
    <path d={`M480 ${HL.table + 28} q20 -8 40 0 t40 0`} stroke="#3a3a6a" strokeWidth={3} fill="none" />
    <rect x={700} y={HL.table + 20} width={70} height={8} rx={3} fill="#2a2a2a" />
    <rect x={300} y={HL.table + 22} width={70} height={8} rx={3} fill="#2a2a2a" />
  </g>
);

/** camera flash (diegetic, ones): a small star flare at the frame edge + a soft lift on the scene */
export const Flash: React.FC<{ x: number; y: number; a: number; id: string }> = ({ x, y, a, id }) => (
  a > 0 ? (
    <g opacity={a}>
      <Glow id={id} x={x} y={y} rx={260} c="#ffffff" o={0.9} mid={0.15} />
      <path d={`M${x - 90} ${y} L${x + 90} ${y} M${x} ${y - 90} L${x} ${y + 90}`} stroke="#ffffff" strokeWidth={4} />
    </g>
  ) : null
);

/* ---------------- fireplace macro (8) ---------------- */
export const Hearth: React.FC = () => (
  <g>
    <rect x={-108} y={-192} width={1296} height={2400} fill="#120a08" />
    {/* brick back of the fireplace */}
    {Array.from({ length: 14 }, (_, r) => Array.from({ length: 8 }, (_, c) => (
      <rect key={`${r}-${c}`} x={-140 + c * 180 + (r % 2) * 90} y={-180 + r * 90} width={170} height={80} fill="#2a1612" />
    )))}
    {/* logs */}
    <path d="M-60 1360 L1140 1260 L1150 1360 L-50 1460 Z" fill="#3a2418" />
    <path d="M60 1300 L1020 1420 L1010 1500 L50 1380 Z" fill="#2a1a12" />
    <rect x={-108} y={1460} width={1296} height={800} fill="#0a0606" />
  </g>
);

/** flames + glow (ones) */
export const Fire: React.FC<{ t: number; boost: number }> = ({ t, boost }) => (
  <g>
    <Glow id="hfG" x={540} y={1260} rx={760} ry={560} c="#ff9a3a" o={0.5 + 0.1 * Math.sin(t * 9) + 0.2 * boost} mid={0.3} />
    {Array.from({ length: 9 }, (_, i) => {
      const x = 80 + i * 115, hgt = 180 + 80 * Math.sin(t * 7 + i * 1.9) + 60 * boost;
      return (
        <g key={i}>
          <path d={`M${x - 60} 1340 Q${x - 30} ${1340 - hgt * 0.6} ${x + Math.sin(t * 5 + i) * 20} ${1340 - hgt} Q${x + 40} ${1340 - hgt * 0.5} ${x + 60} 1340 Z`} fill="#ff8a2a" opacity={0.85} />
          <path d={`M${x - 30} 1340 Q${x - 10} ${1340 - hgt * 0.4} ${x + Math.sin(t * 6 + i) * 12} ${1340 - hgt * 0.65} Q${x + 20} ${1340 - hgt * 0.3} ${x + 30} 1340 Z`} fill="#ffd27a" />
        </g>
      );
    })}
  </g>
);

/**
 * The treaty sheet burning. pos/rot: where it lies; burn 0..1 = burnt fraction (front from the lower-left corner),
 * curl 0..1 lifts the edges; ash 0..1 = collapse into flakes. The signature (upper-right) burns last.
 */
export const BurningTreaty: React.FC<{ x: number; y: number; rot: number; burn: number; curl: number; ash: number; t: number }> = ({ x, y, rot, burn, curl, ash, t }) => {
  const W = 520, Hh = 680;
  const R = burn * 1100;
  if (ash >= 1) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={1 - ash}>
      <defs>
        <clipPath id="hbPaper"><path d={`M${-W / 2} ${-Hh / 2} L${W / 2} ${-Hh / 2 - 30 * curl} Q${W / 2 + 40 * curl} 0 ${W / 2} ${Hh / 2} L${-W / 2} ${Hh / 2 + 20 * curl} Q${-W / 2 - 30 * curl} 0 ${-W / 2} ${-Hh / 2} Z`} /></clipPath>
        <mask id="hbBurn">
          <rect x={-400} y={-500} width={1400} height={1400} fill="#fff" />
          <circle cx={-W / 2 - 40} cy={Hh / 2 + 40} r={R} fill="#000" />
        </mask>
      </defs>
      <g mask="url(#hbBurn)" clipPath="url(#hbPaper)">
        <path d={`M${-W / 2} ${-Hh / 2} L${W / 2} ${-Hh / 2 - 30 * curl} Q${W / 2 + 40 * curl} 0 ${W / 2} ${Hh / 2} L${-W / 2} ${Hh / 2 + 20 * curl} Q${-W / 2 - 30 * curl} 0 ${-W / 2} ${-Hh / 2} Z`} fill="#f2ead6" />
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-W / 2 + 50} y={-Hh / 2 + 200 + i * 48} width={i % 3 === 2 ? 260 : 400} height={10} fill="#8a8070" />)}
        {/* signature, upper right */}
        <path d={`M${50} ${-Hh / 2 + 110} q30 -40 50 0 t50 -10 q20 -30 40 10 t50 -6`} stroke="#1a1a4a" strokeWidth={6} fill="none" />
        <rect x={40} y={-Hh / 2 + 140} width={200} height={4} fill="#8a8070" />
        {/* browning near the front */}
        <circle cx={-W / 2 - 40} cy={Hh / 2 + 40} r={R + 60} fill="#8a5a2a" opacity={0.35} />
      </g>
      {/* glowing burn front */}
      <g clipPath="url(#hbPaper)">
        {burn > 0 && burn < 1 && <circle cx={-W / 2 - 40} cy={Hh / 2 + 40} r={R + 8} fill="none" stroke="#1a0e0a" strokeWidth={22} opacity={0.85} />}
        {burn > 0 && burn < 1 && <circle cx={-W / 2 - 40} cy={Hh / 2 + 40} r={R} fill="none" stroke="#ffb04a" strokeWidth={10} opacity={0.95} strokeDasharray="30 14" />}
      </g>
    </g>
  );
};

/** ash flakes + embers rising (ones) */
export const AshFlakes: React.FC<{ x: number; y: number; a: number; t: number }> = ({ x, y, a, t }) => (
  <g opacity={a}>
    {Array.from({ length: 18 }, (_, i) => {
      const u = (t * 0.5 + i / 18) % 1;
      const fx = x - 260 + ((i * 61) % 520) + Math.sin(t * 2 + i) * 30;
      const fy = y + 200 - u * 600;
      return i % 3 ? <path key={i} d={`M${fx} ${fy} l${14} ${-4} l${-4} ${12} Z`} fill="#4a4442" opacity={1 - u} /> : <circle key={i} cx={fx} cy={fy} r={4} fill="#ffb04a" opacity={1 - u} />;
    })}
  </g>
);

/** the hand that drops the sheet (from the upper right): open 0..1 releases */
export const DropHand: React.FC<{ x: number; y: number; open: number }> = ({ x, y, open }) => (
  <g>
    <path d={limb(1300, -100, x + 80, y - 120, 220, 170)} fill="#2a2a34" />
    <path d={limb(x + 120, y - 160, x + 20, y - 40, 130, 110)} fill="#9a6a52" />
    <Mitt x={x + 20} y={y - 40} ang={120 + 20 * open} len={150} w={110} skin="#9a6a52" shade="#6a4636" thumb={1} curl={0.6 - 0.6 * open} rim="#ff9a3a" rimO={0.6} />
  </g>
);

/* ---------------- doorway at dawn (11) ---------------- */
export const DOOR = { x1: 120, x2: 470, y1: 380, y2: 1330, step: 1330 };
export const Doorway: React.FC = () => (
  <g>
    <defs><linearGradient id="hdSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9b0a8" /><stop offset="1" stopColor="#f2d2a8" /></linearGradient></defs>
    <rect x={-108} y={-192} width={1296} height={1200} fill="url(#hdSky)" />
    {/* the street behind: houses across, soft dawn */}
    <rect x={480} y={560} width={720} height={700} fill="#b8a090" />
    <rect x={560} y={700} width={110} height={140} fill="#8a6e64" /><rect x={760} y={700} width={110} height={140} fill="#8a6e64" /><rect x={960} y={720} width={110} height={140} fill="#ffd9a0" opacity={0.7} />
    <path d="M470 560 L1200 500 L1200 560 Z" fill="#9a7a6a" />
    <rect x={-108} y={1260} width={1296} height={900} fill="#a8907a" />
    {/* our house front + the lit doorway */}
    <rect x={-108} y={200} width={640} height={1140} fill="#d8c4a8" />
    <rect x={DOOR.x1 - 24} y={DOOR.y1 - 24} width={DOOR.x2 - DOOR.x1 + 48} height={DOOR.y2 - DOOR.y1 + 24} fill="#7a5a44" />
    <rect x={DOOR.x1} y={DOOR.y1} width={DOOR.x2 - DOOR.x1} height={DOOR.y2 - DOOR.y1} fill="#ffd9a0" />
    <path d={`M${DOOR.x1} ${DOOR.y1} L${DOOR.x1 + 90} ${DOOR.y1 + 40} L${DOOR.x1 + 90} ${DOOR.y2 - 20} L${DOOR.x1} ${DOOR.y2} Z`} fill="#8a6a4e" />
    <rect x={-60} y={DOOR.step} width={620} height={40} fill="#b8a48c" />
    <rect x={-60} y={DOOR.step + 40} width={660} height={30} fill="#9a8670" />
  </g>
);

/** small walking silhouette in the street behind (ON TWOS); kind: 'man' | 'farmer' */
export const Walker: React.FC<{ x: number; y: number; s: number; ph: number; dir: 1 | -1; kind?: 'man' | 'farmer' }> = ({ x, y, s, ph, dir, kind = 'man' }) => {
  const a = Math.sin(ph) * 22;
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`} fill="#5a4a50">
      <path d={`M-8 -150 L${-10 + a} 0 L${0 + a} 0 L4 -150 Z`} /><path d={`M0 -150 L${6 - a} 0 L${16 - a} 0 L12 -150 Z`} />
      <path d="M-20 -150 Q-24 -240 -12 -260 L20 -260 Q28 -240 24 -150 Z" />
      <circle cx={2} cy={-280} r={20} />
      <rect x={-22} y={-250} width={20} height={70} rx={8} />
      {kind === 'farmer' && <path d="M20 -230 L70 -330 M60 -340 L90 -320" stroke="#5a4a50" strokeWidth={6} />}
    </g>
  );
};

/** wrapped loaf (prop) */
export const Loaf: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse cx={0} cy={0} rx={80} ry={44} fill="#e8dcc0" />
    <path d="M-80 0 Q0 -40 80 0 Q0 30 -80 0 Z" fill="#c9433a" opacity={0.7} />
    <path d="M-20 -40 L0 -60 L20 -40" stroke="#a8986e" strokeWidth={5} fill="none" />
  </g>
);

/* ---------------- empty classroom with a street window (12) ---------------- */
export const CW = { x1: 600, x2: 1040, y1: 360, y2: 1000, mw: { x1: 760, x2: 920, y1: 520, y2: 760 } };
export const Classroom: React.FC = () => (
  <g>
    <rect x={-108} y={-192} width={1296} height={2400} fill="#e6e0d4" />
    <rect x={-108} y={1260} width={1296} height={900} fill="#9a8a6a" />
    <rect x={20} y={420} width={440} height={320} fill="#2f4a3c" />
    <rect x={20} y={420} width={440} height={320} fill="none" stroke="#7a5a3a" strokeWidth={16} />
    {/* the window onto a narrow street: the house opposite with an upstairs window */}
    <rect x={CW.x1} y={CW.y1} width={CW.x2 - CW.x1} height={CW.y2 - CW.y1} fill="#c9bca8" />
    <rect x={CW.x1} y={CW.y1} width={CW.x2 - CW.x1} height={90} fill="#e8ecef" />
    <rect x={CW.mw.x1 - 14} y={CW.mw.y1 - 14} width={CW.mw.x2 - CW.mw.x1 + 28} height={CW.mw.y2 - CW.mw.y1 + 28} fill="#7a6a5a" />
    <rect x={CW.mw.x1} y={CW.mw.y1} width={CW.mw.x2 - CW.mw.x1} height={CW.mw.y2 - CW.mw.y1} fill="#3a3238" />
    <rect x={CW.x1} y={880} width={CW.x2 - CW.x1} height={120} fill="#8a8274" />
    <rect x={CW.x1} y={CW.y1} width={CW.x2 - CW.x1} height={CW.y2 - CW.y1} fill="none" stroke="#8a7a60" strokeWidth={18} />
    <rect x={(CW.x1 + CW.x2) / 2 - 7} y={CW.y1} width={14} height={CW.y2 - CW.y1} fill="#8a7a60" />
    <rect x={CW.x1 - 30} y={CW.y2} width={CW.x2 - CW.x1 + 60} height={24} fill="#7a6a50" />
    {/* desks with chairs up on them */}
    {[[-60, 1200], [320, 1240], [700, 1200], [140, 1420], [560, 1440], [960, 1420]].map(([x, y], i) => (
      <g key={i}>
        <rect x={x} y={y} width={300} height={26} fill="#8a6a44" />
        <rect x={x + 20} y={y + 26} width={16} height={200} fill="#5a3e28" /><rect x={x + 264} y={y + 26} width={16} height={200} fill="#5a3e28" />
        <rect x={x + 60} y={y - 70} width={180} height={20} fill="#6a4e32" />
        <rect x={x + 70} y={y - 190} width={14} height={120} fill="#5a3e28" /><rect x={x + 216} y={y - 190} width={14} height={120} fill="#5a3e28" />
        <rect x={x + 70} y={y - 50} width={160} height={50} fill="#6a4e32" opacity={0.8} />
      </g>
    ))}
  </g>
);

/** ceiling fan (ones): spin angle */
export const CeilingFan: React.FC<{ ang: number }> = ({ ang }) => (
  <g transform="translate(330 220)">
    <rect x={-4} y={-420} width={8} height={420} fill="#5a5048" />
    <g transform={`scale(1 0.28) rotate(${ang})`}>
      {[0, 120, 240].map((a) => <rect key={a} x={10} y={-22} width={260} height={44} rx={18} fill="#6a5e50" transform={`rotate(${a})`} />)}
    </g>
    <ellipse cx={0} cy={0} rx={30} ry={14} fill="#4a4038" />
  </g>
);

export { Puff };
