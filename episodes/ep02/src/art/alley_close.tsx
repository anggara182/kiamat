import React from 'react';
import { W, H, rng } from './world';
import { PAL } from './alley_art';

/* ------------------------------------------------------------------------------------------
 * Close-ups for the alley set. Hands: mitten construction with 1–2 finger separations,
 * warm skin with a cooler shade, simple knuckle lines. World coords (frame = world - (108,192)).
 * ---------------------------------------------------------------------------------------- */
const SKIN = { young: ['#a8765a', '#7a5040', '#5e3a2c'], crowd: ['#8a5a40', '#6a4430', '#4e2e22'] };

/* ------------------------------------ S15: the pipe joint ------------------------------------ */
export const J = { cx: 690, cy: 1000, r: 62, ground: 1500 };

/** galvanised pipe: horizontal run from the left into an elbow coupling, riser down to the ground */
export const JointPipe: React.FC = () => (
  <g>
    {/* shadow of the pipe on the wall (sun upper left) */}
    <rect x={-20} y={J.cy + J.r - 10} width={J.cx} height={40} fill={PAL.dark} opacity={0.22} />
    <rect x={J.cx + J.r - 6} y={J.cy} width={40} height={J.ground - J.cy} fill={PAL.dark} opacity={0.2} />
    {/* horizontal run */}
    <rect x={-20} y={J.cy - J.r} width={J.cx} height={J.r * 2} fill={PAL.pipe} />
    <rect x={-20} y={J.cy - J.r + 10} width={J.cx} height={22} fill={PAL.pipeH} opacity={0.75} />
    <rect x={-20} y={J.cy + J.r - 26} width={J.cx} height={26} fill={PAL.pipeD} />
    {/* riser */}
    <rect x={J.cx - J.r} y={J.cy} width={J.r * 2} height={J.ground - J.cy} fill={PAL.pipe} />
    <rect x={J.cx - J.r + 10} y={J.cy} width={22} height={J.ground - J.cy} fill={PAL.pipeH} opacity={0.75} />
    <rect x={J.cx + J.r - 26} y={J.cy} width={26} height={J.ground - J.cy} fill={PAL.pipeD} />
    {/* thread rings where the pipes enter the coupling */}
    {[0, 1, 2].map((i) => <rect key={`h${i}`} x={J.cx - J.r - 70 + i * 14} y={J.cy - J.r} width={5} height={J.r * 2} fill={PAL.pipeD} opacity={0.6} />)}
    {[0, 1, 2].map((i) => <rect key={`v${i}`} x={J.cx - J.r} y={J.cy + J.r + 40 + i * 14} width={J.r * 2} height={5} fill={PAL.pipeD} opacity={0.6} />)}
    {/* elbow coupling: hex body, 3 tones */}
    <path d={`M ${J.cx - 100} ${J.cy - 84} L ${J.cx + 80} ${J.cy - 84} L ${J.cx + 96} ${J.cy - 60} L ${J.cx + 96} ${J.cy + 92} L ${J.cx + 74} ${J.cy + 118} L ${J.cx - 78} ${J.cy + 118} L ${J.cx - 100} ${J.cy + 92} Z`} fill="#868c91" />
    <path d={`M ${J.cx - 100} ${J.cy - 84} L ${J.cx + 80} ${J.cy - 84} L ${J.cx + 96} ${J.cy - 60} L ${J.cx - 100} ${J.cy - 50} Z`} fill="#c3c8cb" />
    <path d={`M ${J.cx + 96} ${J.cy - 60} L ${J.cx + 96} ${J.cy + 92} L ${J.cx + 74} ${J.cy + 118} L ${J.cx + 60} ${J.cy - 50} Z`} fill="#5f6569" />
    <rect x={J.cx - 98} y={J.cy + 20} width={170} height={6} fill="#6c7277" opacity={0.6} />
    {/* wet seam + rust streak at the bottom of the coupling */}
    <rect x={J.cx - 78} y={J.cy + 112} width={150} height={7} fill="#4a5054" />
    <path d={`M ${J.cx - 40} ${J.cy + 118} q 6 60 -2 140`} stroke="#8a5a3a" strokeWidth={8} opacity={0.35} fill="none" />
    {/* puddle at the foot of the riser */}
    <ellipse cx={J.cx - 30} cy={J.ground + 30} rx={260} ry={40} fill="#7f7564" />
    <ellipse cx={J.cx - 60} cy={J.ground + 24} rx={150} ry={16} fill="#e9eef0" opacity={0.35} />
  </g>
);

/** adjustable wrench on the coupling, rotated by ang (deg) about the coupling centre; the right fist holds the handle */
export const WrenchHand: React.FC<{ ang: number; squeeze?: number }> = ({ ang, squeeze = 0 }) => {
  const [sk, sh, kn] = SKIN.young;
  return (
    <g transform={`rotate(${ang} ${J.cx} ${J.cy})`}>
      {/* jaws around the hex, handle out to the right */}
      <path d={`M ${J.cx - 40} ${J.cy - 130} L ${J.cx + 70} ${J.cy - 130} L ${J.cx + 110} ${J.cy - 96} L ${J.cx + 120} ${J.cy - 70} L ${J.cx + 110} ${J.cy - 40} L ${J.cx + 560} ${J.cy - 52} L ${J.cx + 580} ${J.cy - 20} L ${J.cx + 560} ${J.cy + 10} L ${J.cx + 110} ${J.cy + 0} L ${J.cx + 70} ${J.cy - 92} L ${J.cx - 30} ${J.cy - 92} Z`} fill="#7d838a" />
      <path d={`M ${J.cx + 110} ${J.cy - 40} L ${J.cx + 560} ${J.cy - 52} L ${J.cx + 566} ${J.cy - 40} L ${J.cx + 112} ${J.cy - 28} Z`} fill="#d1d5d8" />
      <ellipse cx={J.cx + 150} cy={J.cy - 30} rx={20} ry={13} fill="#5a6066" />
      <rect x={J.cx + 128} y={J.cy - 36} width={44} height={4} fill="#3a3e42" opacity={0.6} />
      {/* fist around the handle: knuckles on top, 2 finger separations, thumb over */}
      <g transform={`translate(${J.cx + 430} ${J.cy - 22})`}>
        <path d="M 120 40 L 260 120 L 260 260 L 60 140 Z" fill={sh} />
        <path d="M 100 30 L 260 110 L 260 150 L 90 70 Z" fill={sk} />
        <path d={`M -70 -48 Q -84 -10 -66 ${40 - squeeze * 4} Q -20 ${70 - squeeze * 4} 40 66 Q 104 60 120 20 Q 128 -30 96 -58 Q 40 -78 -20 -72 Q -60 -66 -70 -48 Z`} fill={sk} />
        <path d="M -66 -10 Q -10 0 60 -6 M -60 22 Q -6 34 70 26" stroke={kn} strokeWidth={4} fill="none" opacity={0.75} />
        <path d="M -70 -48 Q -20 -60 30 -52" stroke={kn} strokeWidth={3} fill="none" opacity={0.5} />
        {/* thumb lying along the top of the handle */}
        <path d={`M 30 -62 Q -20 ${-86 - squeeze * 3} -70 -74 Q -82 -66 -72 -58 Q -24 -64 36 -44 Z`} fill={sk} />
        <path d="M 96 -58 Q 128 -30 120 20" stroke={sh} strokeWidth={10} fill="none" opacity={0.6} />
      </g>
    </g>
  );
};

/** the left hand steadying the horizontal pipe: fingers draped over the top, thumb below */
export const SteadyHand: React.FC<{ grip?: number }> = ({ grip = 0 }) => {
  const [sk, sh, kn] = SKIN.young;
  const x = 300, y = J.cy;
  return (
    <g>
      <path d={`M ${x - 200} ${y + 420} L ${x - 40} ${y + 70} L ${x + 80} ${y + 90} L ${x - 60} ${y + 460} Z`} fill={sh} />
      <path d={`M ${x - 190} ${y + 420} L ${x - 36} ${y + 72} L ${x + 4} ${y + 78} L ${x - 140} ${y + 440} Z`} fill={sk} />
      <path d={`M ${x - 70} ${y + 90} Q ${x - 100} ${y + 20} ${x - 80} ${y - 50} Q ${x - 40} ${y - 92 - grip * 3} ${x + 40} ${y - 88} Q ${x + 110} ${y - 80} ${x + 120} ${y - 30} Q ${x + 124} ${y + 4} ${x + 104} ${y + 10} Q ${x + 70} ${y - 26} ${x + 40} ${y - 20} Q ${x + 60} ${y + 40} ${x + 70} ${y + 100} Z`} fill={sk} />
      <path d={`M ${x - 20} ${y - 86} Q ${x + 40} ${y - 70} ${x + 104} ${y + 10} M ${x - 50} ${y - 74} Q ${x + 10} ${y - 56} ${x + 70} ${y + 4}`} stroke={kn} strokeWidth={4} fill="none" opacity={0.6} />
      <path d={`M ${x - 80} ${y - 50} Q ${x - 40} ${y - 92} ${x + 40} ${y - 88}`} stroke="#f2d8c0" strokeWidth={3} fill="none" opacity={0.45} />
    </g>
  );
};

/** two flies circling over the puddle (environment, ON ONES) */
export const Flies: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <g fill="#1a1612">
    {[0, 1].map((i) => {
      const fx = x + Math.sin(t * (6 + i * 2.3) + i) * (60 + i * 30), fy = y + Math.cos(t * (4.4 + i) + i * 2) * (34 + i * 12) - 80;
      return <g key={i}><ellipse cx={fx} cy={fy} rx={5} ry={3.5} /><ellipse cx={fx - 3} cy={fy - 4} rx={4} ry={2} fill="#e9eef0" opacity={0.6} /></g>;
    })}
  </g>
);

/* ------------------------------------ S17: hand + stone ------------------------------------ */
/** back of a right hand seen from above, fingers toward +y in local space. grip 0 = open/spread, 1 = closed around the stone */
export const TopHand: React.FC<{ x: number; y: number; rot: number; s: number; grip: number }> = ({ x, y, rot, s, grip }) => {
  const [sk, sh, kn] = SKIN.crowd;
  const fingers = [-36, -12, 12, 34];
  const lens = [64, 74, 70, 56];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* sleeve + forearm */}
      <path d="M -48 -300 L 48 -300 L 44 -60 L -44 -60 Z" fill={sh} />
      <path d="M -40 -300 L 10 -300 L 6 -60 L -36 -60 Z" fill={sk} opacity={0.8} />
      <path d="M -60 -420 L 60 -420 L 56 -250 L -56 -250 Z" fill="#4a3f36" />
      <path d="M -56 -262 L 56 -262" stroke="#2e2620" strokeWidth={6} />
      {/* thumb (right side), tucks in as the grip closes */}
      <g transform={`rotate(${-38 + 30 * grip} 46 -20)`}><path d="M 40 -30 Q 76 -6 80 34 Q 80 50 66 52 Q 54 50 50 30 Q 44 8 32 0 Z" fill={sk} /><path d="M 60 30 q 8 6 12 18" stroke={kn} strokeWidth={3} fill="none" /></g>
      {/* fingers: spread and long when open, short knuckled curls when closed */}
      {fingers.map((fx, i) => {
        const L = lens[i] * (1 - 0.62 * grip), a = (i - 1.5) * 9 * (1 - grip);
        return (
          <g key={i} transform={`rotate(${a} ${fx} 40)`}>
            <rect x={fx - 11} y={36} width={22} height={L + 8} rx={11} fill={sk} />
            <path d={`M ${fx - 8} ${36 + L * 0.45} q 8 4 16 0`} stroke={kn} strokeWidth={2.5} fill="none" opacity={0.7} />
            {grip > 0.5 && <rect x={fx - 11} y={36 + L - 4} width={22} height={12} rx={6} fill={sh} />}
          </g>
        );
      })}
      {/* back of the hand */}
      <path d="M -54 -66 Q -60 0 -48 44 L 50 44 Q 62 0 52 -66 Z" fill={sk} />
      <path d="M -50 40 Q 0 52 50 40" stroke={kn} strokeWidth={4} fill="none" opacity={0.7} />
      {[-36, -12, 12, 34].map((fx) => <path key={fx} d={`M ${fx * 0.6} -40 L ${fx} 30`} stroke={sh} strokeWidth={4} opacity={0.35} />)}
      <path d="M -54 -66 Q -60 0 -48 44" stroke="#c9946e" strokeWidth={4} fill="none" opacity={0.5} />
    </g>
  );
};

/* ------------------------------------ S20: the stone drops ------------------------------------ */
export const G20 = 1500;
/** simple live backdrop for the low close shot: wall base in sun, gutter, ground */
export const BaseBg: React.FC = () => {
  const r = rng(241);
  return (
    <g>
      <rect x={0} y={0} width={W} height={G20 - 160} fill={PAL.lit} />
      <ellipse cx={300} cy={700} rx={260} ry={120} fill="#cbbfa8" opacity={0.7} />
      <ellipse cx={1050} cy={1000} rx={220} ry={90} fill="#c6b9a0" opacity={0.7} />
      <rect x={0} y={G20 - 380} width={W} height={220} fill="#bfb199" />
      <rect x={0} y={G20 - 382} width={W} height={10} fill="#a99b82" />
      <rect x={0} y={G20 - 160} width={W} height={60} fill="#6f6656" />
      <rect x={0} y={G20 - 140} width={W} height={12} fill="#e9eef0" opacity={0.35} />
      <rect x={0} y={G20 - 100} width={W} height={H} fill={PAL.floor} />
      <rect x={0} y={G20 - 100} width={W} height={80} fill={PAL.dark} opacity={0.14} />
      {Array.from({ length: 22 }, (_, i) => { const px = r() * W, py = G20 + r() * 700, s = 10 + r() * 20; return <g key={i}><ellipse cx={px + 4} cy={py + 4} rx={s} ry={s * 0.55} fill={PAL.dark} opacity={0.25} /><ellipse cx={px} cy={py} rx={s} ry={s * 0.55} fill={r() < 0.5 ? '#a89a80' : '#d6cab2'} /></g>; })}
    </g>
  );
};

/** side-view right hand hanging at the side: closed around the stone (open 0) -> fingers spread open (1) */
export const HangHand: React.FC<{ x: number; y: number; s: number; open: number }> = ({ x, y, s, open }) => {
  const [sk, sh, kn] = SKIN.crowd;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* forearm from above + batik sleeve edge */}
      <path d="M -40 -420 L 40 -420 L 36 -40 L -36 -40 Z" fill={sh} />
      <path d="M -36 -420 L 0 -420 L -2 -40 L -32 -40 Z" fill={sk} />
      {/* palm */}
      <path d="M -40 -50 Q -46 10 -30 40 L 34 40 Q 46 4 38 -50 Z" fill={sk} />
      {/* fingers: curled under (closed) -> hanging straight and spread (open) */}
      {[-26, -8, 10, 26].map((fx, i) => {
        const a = (i - 1.5) * 7 * open;
        const L = 34 + 46 * open;
        return (
          <g key={i} transform={`rotate(${a} ${fx} 34)`}>
            <rect x={fx - 9} y={30} width={18} height={L} rx={9} fill={i % 2 ? sk : mixS(sk, sh)} />
            {open < 0.5 && <path d={`M ${fx - 8} ${30 + L - 6} q 8 6 16 0`} stroke={kn} strokeWidth={2.5} fill="none" />}
          </g>
        );
      })}
      {/* thumb on the near side */}
      <g transform={`rotate(${-20 * open} 34 -20)`}><path d="M 30 -30 Q 58 -6 54 30 Q 50 44 40 40 Q 36 14 24 0 Z" fill={sk} /></g>
      <path d="M -40 -50 Q -46 10 -30 40" stroke={kn} strokeWidth={3} fill="none" opacity={0.6} />
    </g>
  );
};
const mixS = (a: string, b: string) => {
  const A = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), B = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + A.map((v, i) => Math.round((v + B[i]) / 2).toString(16).padStart(2, '0')).join('');
};

/** a small dust puff where the stone lands (environment, ON ONES); u = 0..1 since impact */
export const Puff: React.FC<{ x: number; y: number; u: number; s?: number }> = ({ x, y, u, s = 1 }) => {
  if (u <= 0 || u >= 1) return null;
  return (
    <g opacity={0.75 * (1 - u)} fill="#d8cdb6">
      {[-1, -0.4, 0.3, 1].map((d, i) => <ellipse key={i} cx={x + d * (40 + 140 * u) * s} cy={y - (10 + 50 * u) * s * (1 - Math.abs(d) * 0.4)} rx={(26 + 50 * u) * s} ry={(16 + 30 * u) * s} />)}
    </g>
  );
};
