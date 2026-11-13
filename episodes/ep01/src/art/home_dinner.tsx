import React from 'react';
import { limb, ik, Mitt, Glow, lerp, DEG } from './home_kit';

/**
 * Shot 15: night, the family eats on a floor mat under one hanging bulb. The lamp swings, the glasses tremble,
 * the mother pulls the child close. Father = simple dark silhouette from behind (foreground left). Frame coords.
 */
export const DN = { pivot: { x: 540, y: -200 }, cord: 880 };

export const bulbAt = (ang: number) => ({ x: DN.pivot.x + Math.sin(ang / DEG) * DN.cord, y: DN.pivot.y + Math.cos(ang / DEG) * DN.cord });

export const DinnerBand: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="hdWall" cx="0.5" cy="0.22" r="0.75">
        <stop offset="0" stopColor="#8a7458" /><stop offset="0.45" stopColor="#4d3f38" /><stop offset="1" stopColor="#1b1620" />
      </radialGradient>
      <radialGradient id="hdFloor" cx="0.5" cy="0.1" r="0.8">
        <stop offset="0" stopColor="#4a3a32" /><stop offset="1" stopColor="#120e14" />
      </radialGradient>
      <linearGradient id="hdNight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#05070f" /><stop offset="1" stopColor="#18203a" />
      </linearGradient>
      <linearGradient id="hdMat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a8854f" /><stop offset="1" stopColor="#5e4630" />
      </linearGradient>
    </defs>
    {/* wall */}
    <rect x={-108} y={-192} width={1296} height={1330} fill="url(#hdWall)" />
    <rect x={-108} y={1020} width={1296} height={40} fill="#2a2124" />
    {/* window with curtains (night outside, one neighbour window) */}
    <rect x={840} y={360} width={230} height={330} fill="url(#hdNight)" />
    <rect x={930} y={560} width={30} height={26} fill="#ffcf86" opacity={0.8} />
    <rect x={840} y={360} width={230} height={330} fill="none" stroke="#2a2124" strokeWidth={16} />
    <rect x={951} y={360} width={8} height={330} fill="#2a2124" />
    <path d="M820 340 L900 340 Q880 520 900 720 L820 720 Z" fill="#5a3c3a" />
    <path d="M1010 340 L1100 340 L1100 720 L1020 720 Q1036 520 1010 340 Z" fill="#5a3c3a" />
    {/* framed picture + calendar */}
    <rect x={120} y={420} width={150} height={120} fill="#2a2124" />
    <rect x={132} y={432} width={126} height={96} fill="#6a5a50" />
    <path d="M132 528 L180 476 L210 500 L240 470 L258 490 L258 528 Z" fill="#4a3e38" />
    <rect x={330} y={470} width={90} height={130} fill="#cdbfa6" opacity={0.75} />
    <rect x={330} y={470} width={90} height={30} fill="#8e3a33" opacity={0.75} />
    {/* floor */}
    <rect x={-108} y={1060} width={1296} height={1100} fill="url(#hdFloor)" />
    {/* the woven mat (tikar), in perspective */}
    <path d="M140 1130 L940 1130 L1188 1700 L-108 1700 Z" fill="url(#hdMat)" />
    {Array.from({ length: 9 }, (_, i) => {
      const y0 = 1130 + i * 64, y1 = y0 + 32;
      const xl = (y: number) => 140 - ((y - 1130) / 570) * 248, xr = (y: number) => 940 + ((y - 1130) / 570) * 248;
      return <path key={i} d={`M${xl(y0)} ${y0} L${xr(y0)} ${y0} L${xr(y1)} ${y1} L${xl(y1)} ${y1} Z`} fill="#6b5034" opacity={0.35} />;
    })}
    <path d="M140 1130 L940 1130 L1188 1700 M140 1130 L-108 1700" stroke="#8e3a33" strokeWidth={12} fill="none" opacity={0.8} />
    {/* rice basket, plates (food pieces stay low detail) */}
    <g>
      <ellipse cx={540} cy={1238} rx={92} ry={30} fill="#2b2018" opacity={0.6} />
      <path d="M460 1190 L620 1190 L604 1236 Q540 1252 476 1236 Z" fill="#9a7444" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${466 + i * 4} ${1204 + i * 12} L${614 - i * 4} ${1204 + i * 12}`} stroke="#6b5034" strokeWidth={3} />)}
      <ellipse cx={540} cy={1188} rx={82} ry={22} fill="#efe8da" />
      <ellipse cx={540} cy={1180} rx={58} ry={14} fill="#fbf6ec" />
      <ellipse cx={360} cy={1298} rx={86} ry={26} fill="#d9d4c8" />
      <ellipse cx={360} cy={1294} rx={60} ry={16} fill="#b98a4a" />
      <ellipse cx={720} cy={1300} rx={84} ry={25} fill="#d9d4c8" />
      <ellipse cx={714} cy={1296} rx={40} ry={12} fill="#efe8da" />
      <ellipse cx={738} cy={1294} rx={22} ry={8} fill="#6b8a44" />
      <ellipse cx={540} cy={1356} rx={96} ry={30} fill="#c9c2b4" />
      <ellipse cx={540} cy={1350} rx={66} ry={18} fill="#a8452c" />
    </g>
  </g>
);

/** the hanging lamp (ON ONES): cord from the pivot, enamel shade, bulb, glow */
export const HangLamp: React.FC<{ ang: number }> = ({ ang }) => {
  const b = bulbAt(ang);
  return (
    <g>
      <path d={`M${DN.pivot.x} ${DN.pivot.y} L${b.x} ${b.y}`} stroke="#14100f" strokeWidth={4} />
      <Glow id="hdBulbBig" x={b.x} y={b.y + 30} rx={520} ry={460} c="#ffcf86" o={0.35} mid={0.25} />
      <g transform={`rotate(${-ang} ${b.x} ${b.y})`}>
        <path d={`M${b.x - 16} ${b.y - 22} L${b.x + 16} ${b.y - 22} L${b.x + 84} ${b.y + 20} L${b.x - 84} ${b.y + 20} Z`} fill="#2f4a44" />
        <path d={`M${b.x - 84} ${b.y + 20} L${b.x + 84} ${b.y + 20}`} stroke="#ffe2a8" strokeWidth={4} opacity={0.6} />
        <ellipse cx={b.x} cy={b.y + 26} rx={24} ry={20} fill="#fff4d6" />
      </g>
      <Glow id="hdBulbCore" x={b.x} y={b.y + 28} rx={110} c="#fff0c8" o={0.9} mid={0.2} />
    </g>
  );
};

/** light pool on the mat + swaying wall shadows (ON ONES), driven by the lamp angle */
export const SwingLight: React.FC<{ ang: number }> = ({ ang }) => {
  const b = bulbAt(ang);
  const dx = b.x - DN.pivot.x;
  return (
    <g>
      <defs>
        <radialGradient id="hdPool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity={0.4} /><stop offset="1" stopColor="#ffd9a0" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="hdShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#120c10" stopOpacity={0.55} /><stop offset="1" stopColor="#120c10" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={540 + dx * 1.6} cy={1290} rx={520} ry={200} fill="url(#hdPool)" />
      {/* the mother+child shadow on the wall, swinging opposite the bulb */}
      <ellipse cx={880 - dx * 1.8} cy={980} rx={190} ry={120} fill="url(#hdShadow)" />
      <ellipse cx={260 - dx * 1.4} cy={990} rx={220} ry={110} fill="url(#hdShadow)" />
    </g>
  );
};

/** tea glasses on the mat (ON ONES): tremble px */
export const Glasses: React.FC<{ tr: number; t: number }> = ({ tr, t }) => (
  <g>
    {[[430, 1240], [652, 1236], [826, 1300]].map(([x, y], i) => {
      const jx = tr * Math.sin(t * 70 + i * 2), jy = tr * 0.4 * Math.cos(t * 83 + i);
      const lev = 2 * tr * Math.sin(t * 50 + i);
      return (
        <g key={i} transform={`translate(${x + jx} ${y + jy})`}>
          <ellipse cx={0} cy={4} rx={30} ry={8} fill="#1a120e" opacity={0.5} />
          <path d="M-24 -78 L24 -78 L19 0 L-19 0 Z" fill="#e9dcc8" opacity={0.25} />
          <path d={`M-22 ${-50 + lev} L22 ${-50 - lev} L19 0 L-19 0 Z`} fill="#b5652a" opacity={0.85} />
          <path d={`M-22 ${-50 + lev} L22 ${-50 - lev}`} stroke="#ffd29a" strokeWidth={3} />
          <path d="M-24 -78 L24 -78" stroke="#fff4dc" strokeWidth={3} opacity={0.6} />
          <path d="M-16 -72 L-13 -8" stroke="#fff4dc" strokeWidth={4} opacity={0.5} />
        </g>
      );
    })}
  </g>
);

const MO = { scarf: '#2f5a56', scarfD: '#1d3b39', blouse: '#8a4a4c', blouseD: '#5e3034', sarong: '#4a3a5c', skin: '#a8714f', skinD: '#6e4632', rim: '#ffd29a' };
const CH = { shirt: '#c9a24a', shirtD: '#8e6e2c', shorts: '#3a4a6a', skin: '#a8714f', skinD: '#6e4632', hair: '#140f12', rim: '#ffd29a' };

/**
 * Mother (sitting on her heels, side view facing left) + child (cross-legged, in front of her).
 * hug 0..1: she reaches round and pulls the child in; look 0..1: both glance up at the lamp. breath on twos.
 */
export const MotherChild: React.FC<{ hug: number; look: number; breath: number }> = ({ hug, look, breath }) => {
  const by = breath * 3;
  // --- mother ---
  const mHip = { x: 840, y: 1300 };
  const lean = hug * 26; // leans forward over the child
  const mSh = { x: 812 - lean, y: 1010 - by + hug * 10 };
  const mHead = { x: 790 - lean * 1.3, y: 930 - by + hug * 14 - look * 6 };
  // --- child ---
  const cBase = { x: lerp(630, 676, hug), y: 1310 };
  const cTilt = hug * 10; // leans into her
  const cSh = { x: cBase.x + 6 + cTilt * 2.2, y: 1150 };
  const cHead = { x: cBase.x + 2 + cTilt * 3.6, y: 1082 - look * 4 };
  // mother's near arm wraps round the child's back to his far shoulder
  const handT = { x: lerp(mSh.x - 40, cSh.x - 34, hug), y: lerp(1220, cSh.y + 8, hug) };
  const arm = ik(mSh.x - 6, mSh.y + 30, handT.x, handT.y, 128, 118, -1);
  return (
    <g>
      {/* mother's folded legs + sarong (sitting on her heels) */}
      <path d={`M${mHip.x - 120} ${mHip.y + 10} Q${mHip.x - 140} ${mHip.y - 60} ${mHip.x - 60} ${mHip.y - 80} L${mHip.x + 60} ${mHip.y - 100} Q${mHip.x + 110} ${mHip.y - 40} ${mHip.x + 96} ${mHip.y + 10} Z`} fill={MO.sarong} />
      <path d={`M${mHip.x - 120} ${mHip.y + 10} Q${mHip.x - 130} ${mHip.y - 40} ${mHip.x - 80} ${mHip.y - 70}`} stroke={MO.rim} strokeWidth={4} fill="none" opacity={0.6} />
      <path d={`M${mHip.x + 70} ${mHip.y + 10} q16 -10 34 -4 l0 10 Z`} fill={MO.skinD} />
      {/* mother's far arm resting on her lap */}
      <path d={limb(mSh.x + 20, mSh.y + 30, mSh.x - 10, 1200, 44, 36)} fill={MO.blouseD} />
      <path d={limb(mSh.x - 10, 1200, mSh.x - 70, 1240, 36, 28)} fill={MO.blouseD} />
      {/* mother's torso (long blouse), leaning forward */}
      <path d={`M${mHip.x - 70} ${mHip.y - 70} Q${mSh.x - 70} ${(mSh.y + mHip.y) / 2} ${mSh.x - 50} ${mSh.y + 10} Q${mSh.x} ${mSh.y - 26} ${mSh.x + 54} ${mSh.y + 4} Q${mHip.x + 70} ${(mSh.y + mHip.y) / 2} ${mHip.x + 70} ${mHip.y - 90} Z`} fill={MO.blouse} />
      <path d={`M${mSh.x + 20} ${mSh.y} Q${mHip.x + 70} ${(mSh.y + mHip.y) / 2} ${mHip.x + 70} ${mHip.y - 90} L${mHip.x + 20} ${mHip.y - 80} Q${mSh.x + 30} ${mSh.y + 120} ${mSh.x + 20} ${mSh.y} Z`} fill={MO.blouseD} opacity={0.7} />
      {/* mother's head: headscarf in profile, face opening toward the left */}
      <g>
        <path d={`M${mHead.x - 50} ${mHead.y + 30} Q${mHead.x - 70} ${mHead.y - 70} ${mHead.x + 6} ${mHead.y - 78} Q${mHead.x + 66} ${mHead.y - 74} ${mHead.x + 62} ${mHead.y + 4} Q${mHead.x + 70} ${mHead.y + 50} ${mSh.x + 70} ${mSh.y + 40} Q${mSh.x + 40} ${mSh.y + 130} ${mSh.x - 20} ${mSh.y + 120} Q${mSh.x - 60} ${mSh.y + 100} ${mSh.x - 64} ${mSh.y + 50} Q${mHead.x - 60} ${mHead.y + 60} ${mHead.x - 50} ${mHead.y + 30} Z`} fill={MO.scarf} />
        <path d={`M${mHead.x + 20} ${mHead.y - 74} Q${mHead.x + 66} ${mHead.y - 70} ${mHead.x + 62} ${mHead.y + 4} Q${mHead.x + 70} ${mHead.y + 50} ${mSh.x + 70} ${mSh.y + 40} Q${mSh.x + 40} ${mSh.y + 130} ${mSh.x + 10} ${mSh.y + 120} Q${mHead.x + 40} ${mHead.y + 20} ${mHead.x + 20} ${mHead.y - 74} Z`} fill={MO.scarfD} opacity={0.7} />
        {/* face: the oval framed by the scarf, simple nose */}
        <path d={`M${mHead.x - 40} ${mHead.y - 40} Q${mHead.x - 60} ${mHead.y - 6} ${mHead.x - 50} ${mHead.y + 24} Q${mHead.x - 30} ${mHead.y + 34} ${mHead.x - 22} ${mHead.y + 20} Q${mHead.x - 18} ${mHead.y - 20} ${mHead.x - 40} ${mHead.y - 40} Z`} fill={MO.skin} />
        <path d={`M${mHead.x - 54} ${mHead.y - 8} L${mHead.x - 64} ${mHead.y + 4} L${mHead.x - 54} ${mHead.y + 8} Z`} fill={MO.skin} />
        <path d={`M${mHead.x - 50} ${mHead.y + 30} Q${mHead.x - 70} ${mHead.y - 70} ${mHead.x + 6} ${mHead.y - 78}`} stroke={MO.rim} strokeWidth={5} fill="none" opacity={0.9} strokeLinecap="round" />
      </g>
      {/* child: crossed legs, body, head (in front of her, under her near arm) */}
      <g transform={`rotate(${cTilt} ${cBase.x} ${cBase.y})`}>
        <path d={`M${cBase.x - 90} ${cBase.y} Q${cBase.x - 96} ${cBase.y - 46} ${cBase.x - 40} ${cBase.y - 52} L${cBase.x + 50} ${cBase.y - 56} Q${cBase.x + 74} ${cBase.y - 20} ${cBase.x + 60} ${cBase.y + 4} Z`} fill={CH.shorts} />
        <path d={`M${cBase.x - 96} ${cBase.y - 4} q-8 -16 10 -22 l26 4 l-4 18 Z`} fill={CH.skin} />
        <path d={`M${cBase.x - 48} ${cBase.y - 50} Q${cBase.x - 58} ${cBase.y - 120} ${cBase.x - 30} ${cBase.y - 160} Q${cBase.x + 6} ${cBase.y - 176} ${cBase.x + 40} ${cBase.y - 156} Q${cBase.x + 56} ${cBase.y - 110} ${cBase.x + 48} ${cBase.y - 52} Z`} fill={CH.shirt} />
        <path d={`M${cBase.x + 14} ${cBase.y - 170} Q${cBase.x + 56} ${cBase.y - 110} ${cBase.x + 48} ${cBase.y - 52} L${cBase.x + 20} ${cBase.y - 52} Q${cBase.x + 30} ${cBase.y - 120} ${cBase.x + 14} ${cBase.y - 170} Z`} fill={CH.shirtD} opacity={0.6} />
        {/* his arm: holding a spoon at the plate -> grabbing her blouse */}
        <path d={limb(cBase.x - 24, cBase.y - 150, lerp(cBase.x - 70, cBase.x - 30, hug), lerp(cBase.y - 96, cBase.y - 100, hug), 26, 22)} fill={CH.shirt} />
        <path d={limb(lerp(cBase.x - 70, cBase.x - 30, hug), lerp(cBase.y - 96, cBase.y - 100, hug), lerp(cBase.x - 120, cBase.x + 56, hug), lerp(cBase.y - 80, cBase.y - 120, hug), 20, 16)} fill={CH.skin} />
        <circle cx={lerp(cBase.x - 120, cBase.x + 56, hug)} cy={lerp(cBase.y - 80, cBase.y - 120, hug)} r={11} fill={CH.skin} />
        <path d={`M${cBase.x - 48} ${cBase.y - 52} Q${cBase.x - 58} ${cBase.y - 120} ${cBase.x - 30} ${cBase.y - 160}`} stroke={CH.rim} strokeWidth={4} fill="none" opacity={0.8} />
      </g>
      <g transform={hug > 0.5 ? `translate(${2 * cHead.x} 0) scale(-1 1)` : undefined}>
      <rect x={cHead.x - 10} y={cHead.y + 30} width={20} height={26} fill={CH.skinD} />
      <ellipse cx={cHead.x} cy={cHead.y} rx={46} ry={50} fill={CH.skin} />
      <path d={`M${cHead.x - 44} ${cHead.y + 2} L${cHead.x - 54} ${cHead.y + 16} L${cHead.x - 42} ${cHead.y + 20} Z`} fill={CH.skin} />
      <path d={`M${cHead.x - 46} ${cHead.y - 6} Q${cHead.x - 50} ${cHead.y - 56} ${cHead.x} ${cHead.y - 56} Q${cHead.x + 50} ${cHead.y - 54} ${cHead.x + 48} ${cHead.y + 10} Q${cHead.x + 30} ${cHead.y + 30} ${cHead.x + 14} ${cHead.y + 20} Q${cHead.x + 10} ${cHead.y - 20} ${cHead.x - 28} ${cHead.y - 20} Q${cHead.x - 38} ${cHead.y - 10} ${cHead.x - 46} ${cHead.y - 6} Z`} fill={CH.hair} />
      <path d={`M${cHead.x - 44} ${cHead.y - 20} Q${cHead.x - 40} ${cHead.y - 54} ${cHead.x + 4} ${cHead.y - 56}`} stroke={CH.rim} strokeWidth={4} fill="none" opacity={0.9} />
      </g>
      {/* mother's near arm round the child */}
      <path d={limb(mSh.x - 6, mSh.y + 30, arm.ex, arm.ey, 46, 38)} fill={MO.blouse} />
      <path d={limb(arm.ex, arm.ey, arm.hx, arm.hy, 38, 30)} fill={MO.blouse} />
      <Mitt x={arm.hx} y={arm.hy} ang={Math.atan2(arm.hy - arm.ey, arm.hx - arm.ex) * DEG} len={48} w={34} skin={MO.skin} shade={MO.skinD} thumb={-1} curl={0.4 * hug} rim={MO.rim} />
    </g>
  );
};

/** father from behind, sitting cross-legged in the foreground (simple dark silhouette with a warm rim). look 0..1: head up toward the lamp */
export const FatherBack: React.FC<{ look: number; breath: number; flinch: number }> = ({ look, breath, flinch }) => {
  const by = breath * 3 + flinch * 6;
  const hx = 190 + look * 10, hy = 1020 - look * 10 + by;
  const ink = '#0d0b12';
  return (
    <g transform="translate(110 260) scale(0.8)">
      <path d={`M-80 1720 Q-90 1440 -40 1250 Q0 1150 90 ${1130 + by} Q190 ${1110 + by} 300 ${1140 + by} Q380 1190 410 1320 Q440 1520 420 1720 Z`} fill={ink} />
      <path d={`M${hx - 30} ${hy + 50} L${hx - 34} ${hy + 110} L${hx + 34} ${hy + 110} L${hx + 30} ${hy + 50} Z`} fill={ink} />
      <ellipse cx={hx} cy={hy} rx={64} ry={74} fill={ink} />
      {/* peci (black cap), hard edges */}
      <path d={`M${hx - 60} ${hy - 30} L${hx - 54} ${hy - 82} Q${hx} ${hy - 96} ${hx + 54} ${hy - 82} L${hx + 60} ${hy - 30} Q${hx} ${hy - 40} ${hx - 60} ${hy - 30} Z`} fill="#050408" />
      <path d={`M${hx - 54} ${hy - 82} Q${hx} ${hy - 96} ${hx + 54} ${hy - 82}`} stroke="#ffd29a" strokeWidth={4} fill="none" opacity={0.8} />
      <path d={`M${hx + 60} ${hy - 20} Q${hx + 66} ${hy + 30} ${hx + 40} ${hy + 64}`} stroke="#ffd29a" strokeWidth={4} fill="none" opacity={0.6} />
      <path d={`M90 ${1130 + by} Q190 ${1110 + by} 300 ${1140 + by} Q380 1190 410 1320`} stroke="#ffd29a" strokeWidth={5} fill="none" opacity={0.7} />
      <path d={`M300 ${1140 + by} Q380 1190 410 1320 Q430 1420 426 1500`} stroke="#ffcf86" strokeWidth={3} fill="none" opacity={0.5} />
    </g>
  );
};
