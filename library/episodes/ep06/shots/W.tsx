import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BandImg, Live, useShot, ramp, Cam, handheld, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { VP } from '../sets/ward';
import { GrandmaBed, Narrator, Monitor, Clock, Tube } from '../art/ward_people';

/* =============== Set "ward" (owner W) =============== */

const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
/** deterministic fluorescent stutter: 1 = on, dips in bursts. */
const stutter = (t: number, seed: number, amount = 1) => {
  const k = Math.floor(t * 14), h = hash(k + seed * 97), burst = hash(Math.floor(t * 1.5) + seed);
  if (burst > 1 - 0.45 * amount && h > 0.35) return 0.12 + 0.3 * hash(k * 3 + seed);
  return 1;
};

/** Hidden nurse fragments: low pale shape (cap + uniform edge + dragging hair). */
const LowShape: React.FC<{ x: number; y: number; s: number; t: number; dark?: boolean }> = ({ x, y, s, t, dark }) => {
  const sway = Math.sin(t * 3) * 3;
  const body = dark ? '#05090a' : '#e6e8e2';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -120 0 Q -110 -38 -40 -46 Q 20 -52 70 -40 Q 110 -30 120 0 Z`} fill={body} opacity={dark ? 0.92 : 0.9} />
      <path d={`M 60 -44 Q 120 -${70 + sway} 160 -36 Q 170 -10 150 2 L 70 2 Z`} fill="#0b0b0d" />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${150 + i * 4} -10 q ${30 + i * 8} ${6 + sway} ${60 + i * 14} 10`} stroke="#0b0b0d" strokeWidth={3} fill="none" />)}
      {!dark && <path d="M 92 -62 L 128 -70 L 132 -56 L 96 -50 Z" fill="#f4f6f0" />}
      <path d={`M -120 0 Q -110 -38 -40 -46 Q 20 -52 70 -40`} stroke={dark ? "#7fb8ae" : "#ffffff"} strokeWidth={dark ? 3 : 2} fill="none" opacity={0.7} />
    </g>
  );
};

/** 1 — long dark corridor, slow push-in; far tube flickers; a low white shape lies far down the floor. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const h = handheld(t, 0.25);
  const cam: Cam = { zoom: 1 + 0.22 * e, dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr * 0.5, ox: VP.x - 108, oy: VP.y - 192 };
  const fl = stutter(t, 1, 1);
  const tDrag = wordAt(1, /dragg/i, 0.45);
  const move = ramp(t, tDrag, tDrag + 2.2, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: '#070c0d', overflow: 'hidden' }}>
      <BandImg id="ward/corridor" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Tube x={VP.x} y={905} w={70} o={fl} id="w1t" />
        {/* exit sign */}
        <defs><radialGradient id="w1ex"><stop offset="0" stopColor="#3dff8a" stopOpacity={0.45} /><stop offset="1" stopColor="#3dff8a" stopOpacity={0} /></radialGradient></defs>
        <ellipse cx={VP.x + 2} cy={952} rx={60} ry={34} fill="url(#w1ex)" />
        <rect x={VP.x - 22} y={944} width={48} height={18} fill="#3dff8a" />
        <rect x={VP.x - 16} y={950} width={22} height={5} fill="#0b3a20" />
        {/* reflection of the far light on the floor */}
        <polygon points={`${VP.x - 14},1082 ${VP.x + 14},1082 ${VP.x + 60},1400 ${VP.x - 60},1400`} fill="#dff7f2" opacity={0.08 * fl} />
        <rect x={VP.x - 10} y={1090} width={26} height={110} fill="#3dff8a" opacity={0.08} />
        {/* the low white shape */}
        <LowShape x={VP.x - 30 + 26 * move} y={1076} s={0.3} t={t} />
        <ellipse cx={VP.x - 30 + 26 * move} cy={1084} rx={44} ry={5} fill="#dff7f2" opacity={0.22} />
      </Live>
    </AbsoluteFill>
  );
};

/** 4 — the ward, lateral track; a low dark shadow slides along the floor between the beds. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const h = handheld(t, 0.2);
  const cam: Cam = { zoom: 1.12, dx: 90 - 180 * e, dy: 0, tx: h.hx, ty: h.hy };
  const tBed = wordAt(4, /checks/i, 0.3);
  const sx = 120 + 900 * ramp(t, tBed - 0.6, tBed + 3, (x) => x);
  return (
    <AbsoluteFill style={{ backgroundColor: '#070c0d', overflow: 'hidden' }}>
      <BandImg id="ward/room" k={0.8} cam={cam} />
      <Live k={0.8} cam={cam}>
        {[250, 650, 1050].map((x, i) => <Tube key={x} x={x} y={182} o={i === 1 ? stutter(t, 4, 0.5) : 0.75} id={`w4t${i}`} />)}
        <rect x={0} y={0} width={1296} height={2304} fill="#0a1112" opacity={0.25} />
        <defs><radialGradient id="w4pool"><stop offset="0" stopColor="#dff7f2" stopOpacity={0.5} /><stop offset="1" stopColor="#dff7f2" stopOpacity={0} /></radialGradient></defs>
        <ellipse cx={650} cy={1460} rx={420} ry={70} fill="url(#w4pool)" opacity={stutter(t, 4, 0.5)} />
        <ellipse cx={sx + 20} cy={1452} rx={210} ry={24} fill="#05090a" opacity={0.6} />
        <LowShape x={sx} y={1460} s={1.5} t={t} dark />
      </Live>
      <BandImg id="ward/near" k={1.25} cam={cam} />
    </AbsoluteFill>
  );
};

const Bedside: React.FC<{ t: number; light: number; sleep: number; morning?: boolean }> = ({ t, light, sleep, morning }) => (
  <g>
    <Clock x={330} y={420} r={58} h={morning ? 6 : 2} m={morning ? 10 : 0} face={morning ? '#e8eee8' : '#9fb0ab'} />
    <defs><radialGradient id={`wbMon${morning ? 'm' : 'n'}`}><stop offset="0" stopColor="#4dffb0" stopOpacity={0.32} /><stop offset="1" stopColor="#4dffb0" stopOpacity={0} /></radialGradient></defs>
    {!morning && <ellipse cx={1000} cy={1160} rx={330} ry={260} fill={`url(#wbMonn)`} opacity={light} />}
    <rect x={1084} y={760} width={6} height={760} fill="#0b1213" />
    <rect x={1040} y={760} width={90} height={5} fill="#0b1213" />
    <path d="M 1050 770 L 1078 770 L 1080 850 Q 1064 862 1048 850 Z" fill={morning ? '#cfe0dc' : '#6f8f88'} opacity={0.85} />
    <Monitor x={1000} y={1160} s={1} t={t} glow={morning ? '#3fb78a' : '#4dffb0'} />
    <GrandmaBed x={700} y={1500} s={1.05} t={t} rim={morning ? '#fff4dc' : '#dff7f2'} light={morning ? '#dfe7e2' : '#c9d6d2'} />
    <Narrator x={330} y={1470} s={1.08} t={t} sleep={sleep} rim={morning ? '#ffe2b0' : '#4dffb0'} fill={morning ? '#26302f' : '#070c0d'} />
  </g>
);

/** 5 — narrator from behind on a plastic chair beside grandma's bed; monitor glow; clock at 2:00. Locked slow push. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.0 + 0.08 * EIO(p), dx: 0, dy: 0, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#070c0d', overflow: 'hidden' }}>
      <BandImg id="ward/room" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <rect x={0} y={0} width={1296} height={2304} fill="#070c0d" opacity={0.45} />
        <Tube x={650} y={182} o={0.55} id="w5t" />
        <Bedside t={t} light={1} sleep={0} />
      </Live>
    </AbsoluteFill>
  );
};

/** 6 — same ward, lights stutter; a faint dark trail creeps along the floor toward the bed. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 0.94, dx: 0, dy: 0, oy: 900 };
  const tF = wordAt(6, /flicker/i, 0.12);
  const tD = wordAt(6, /dragg/i, 0.6);
  const fOn = t >= tF - 0.2 ? 1 : 0;
  const fl = fOn ? stutter(t, 6, 1) : 0.75;
  const fl2 = fOn ? stutter(t + 0.37, 9, 0.8) : 0.75;
  const trail = ramp(t, tD - 1.2, tD + 1.6, EIO);
  const L = 1500;
  const trailD = 'M -40 1600 C 160 1590 260 1560 360 1590 C 470 1620 560 1570 640 1560 C 720 1550 780 1560 820 1548';
  return (
    <AbsoluteFill style={{ backgroundColor: '#050909', overflow: 'hidden' }}>
      <BandImg id="ward/room" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <rect x={0} y={0} width={1296} height={2304} fill="#050909" opacity={0.6 - 0.35 * fl} />
        <Tube x={250} y={182} o={fl2} id="w6a" />
        <Tube x={650} y={182} o={fl} id="w6b" />
        <Bedside t={t} light={0.5 + 0.5 * fl} sleep={0} />
        <path d={trailD} stroke="#020404" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.75} strokeDasharray={L} strokeDashoffset={L * (1 - trail)} />
        <path d={trailD} transform="translate(0 -14)" stroke="#6f9a92" strokeWidth={3} fill="none" opacity={0.35 * fl} strokeDasharray={L} strokeDashoffset={L * (1 - trail)} />
        <path d={trailD} stroke="#020404" strokeWidth={46} fill="none" strokeLinecap="round" opacity={0.3} strokeDasharray={L} strokeDashoffset={L * (1 - trail)} />
      </Live>
    </AbsoluteFill>
  );
};

/** 10 — the ward in pale morning light; narrator asleep in the chair. Slow pull-back. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.14 - 0.14 * EIO(p), dx: 0, dy: 0, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#8fa3a0', overflow: 'hidden' }}>
      <BandImg id="ward/room" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs>
          <linearGradient id="w10wash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfe9e6" stopOpacity={0.55} /><stop offset="1" stopColor="#c8b9a0" stopOpacity={0.35} /></linearGradient>
          <linearGradient id="w10beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff2d6" stopOpacity={0.35} /><stop offset="1" stopColor="#fff2d6" stopOpacity={0} /></linearGradient>
        </defs>
        <rect x={0} y={0} width={1296} height={2304} fill="url(#w10wash)" />
        <rect x={510} y={440} width={280} height={360} fill="#f6efdc" />
        <rect x={645} y={440} width={10} height={360} fill="#9aa8a4" /><rect x={510} y={615} width={280} height={10} fill="#9aa8a4" />
        <polygon points="510,800 790,800 1150,1560 340,1560" fill="url(#w10beam)" />
        <Bedside t={t} light={0} sleep={1} morning />
      </Live>
    </AbsoluteFill>
  );
};
