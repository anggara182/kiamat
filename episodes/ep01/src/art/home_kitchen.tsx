import React from 'react';
import { limb, ik, Mitt, Glow, lerp, Puff } from './home_kit';

/**
 * Shot 2: tiny kampung kitchen at dawn. Frame coords (1080x1920; overscan -108..1188, -192..2112).
 * The band is drawn fully lit by the tube; a live darkness layer (with a hole for the window) dims it until the tube catches.
 */
export const K = {
  win: { x: 560, y: 330, w: 340, h: 360 },
  tube: { x1: 310, x2: 750, y: 182 },
  sw: { x: 128, y: 820, w: 34, h: 52 },
  pot: { cx: 655, top: 905, bot: 1030 },
  counterY: 1080,
};

const TILE = 72;

export const KitchenBand: React.FC = () => {
  const { win } = K;
  const tiles: React.ReactNode[] = [];
  for (let x = 88; x < 1200; x += TILE) tiles.push(<line key={`v${x}`} x1={x} y1={790} x2={x} y2={1080} stroke="#b9c1c1" strokeWidth={3} />);
  for (let y = 790; y < 1080; y += TILE) tiles.push(<line key={`h${y}`} x1={88} y1={y} x2={1200} y2={y} stroke="#b9c1c1" strokeWidth={3} />);
  return (
    <g>
      <defs>
        <linearGradient id="hkWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ebe7dc" /><stop offset="1" stopColor="#cdc8bb" />
        </linearGradient>
        <radialGradient id="hkTubeWash" cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.55} /><stop offset="1" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="hkSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b3466" /><stop offset="0.55" stopColor="#c7768a" /><stop offset="1" stopColor="#f4b98a" />
        </linearGradient>
        <linearGradient id="hkTile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef1ef" /><stop offset="1" stopColor="#d9dedc" />
        </linearGradient>
        <linearGradient id="hkFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bdb7aa" /><stop offset="1" stopColor="#8f897d" />
        </linearGradient>
        <linearGradient id="hkPot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9ced2" /><stop offset="0.35" stopColor="#eef1f3" /><stop offset="0.7" stopColor="#9aa0a6" /><stop offset="1" stopColor="#6f757b" />
        </linearGradient>
      </defs>
      {/* ceiling + upper wall */}
      <rect x={-108} y={-192} width={1296} height={342} fill="#a7a49c" />
      <rect x={-108} y={140} width={1296} height={12} fill="#8d8a83" />
      <rect x={-108} y={150} width={1296} height={640} fill="url(#hkWall)" />
      <ellipse cx={530} cy={190} rx={700} ry={520} fill="url(#hkTubeWash)" />
      {/* tiles (splashback) */}
      <rect x={88} y={790} width={1100} height={290} fill="url(#hkTile)" />
      <rect x={88} y={790} width={1100} height={22} fill="#7f9cab" />
      {tiles}
      {/* window above the stove: dawn outside, nako glass louvers */}
      <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="url(#hkSky)" />
      <path d={`M${win.x} ${win.y + win.h} L${win.x} ${win.y + 250} L${win.x + 70} ${win.y + 230} L${win.x + 120} ${win.y + 262} L${win.x + 200} ${win.y + 214} L${win.x + 340} ${win.y + 244} L${win.x + 340} ${win.y + win.h} Z`} fill="#3a3a63" />
      <path d={`M${win.x} ${win.y + win.h} L${win.x} ${win.y + 300} L${win.x + 150} ${win.y + 290} L${win.x + 150} ${win.y + 270} L${win.x + 260} ${win.y + 270} L${win.x + 340} ${win.y + 300} L${win.x + 340} ${win.y + win.h} Z`} fill="#1c2142" />
      <rect x={win.x + 182} y={win.y + 296} width={22} height={18} fill="#ffd58a" />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <line x1={win.x} y1={win.y + 30 + i * 50} x2={win.x + win.w} y2={win.y + 30 + i * 50} stroke="#ffffff" strokeWidth={3} opacity={0.35} />
          <line x1={win.x} y1={win.y + 34 + i * 50} x2={win.x + win.w} y2={win.y + 34 + i * 50} stroke="#5a4a5e" strokeWidth={2} opacity={0.35} />
        </g>
      ))}
      <rect x={win.x + win.w / 2 - 6} y={win.y} width={12} height={win.h} fill="#6e5a46" />
      <rect x={win.x - 16} y={win.y - 16} width={win.w + 32} height={win.h + 32} fill="none" stroke="#6e5a46" strokeWidth={18} />
      <rect x={win.x - 26} y={win.y + win.h + 8} width={win.w + 52} height={14} fill="#5c4a3a" />
      {/* calendar */}
      <rect x={160} y={330} width={112} height={176} fill="#f4f1e8" />
      <rect x={160} y={330} width={112} height={44} fill="#b4453c" />
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1={170} y1={392 + i * 22} x2={262} y2={392 + i * 22} stroke="#b8b2a6" strokeWidth={3} />)}
      <line x1={216} y1={316} x2={216} y2={330} stroke="#6d6a66" strokeWidth={3} />
      {/* doorway into the dark house (left) */}
      <rect x={-108} y={240} width={164} height={1900} fill="#141724" />
      <path d="M-108 240 L56 240 L56 2112 L-108 2112 Z" fill="#1d2132" opacity={0.6} />
      <rect x={56} y={226} width={34} height={1900} fill="#7a6650" />
      <rect x={-108} y={226} width={198} height={22} fill="#7a6650" />
      {/* light switch */}
      <rect x={K.sw.x} y={K.sw.y} width={K.sw.w} height={K.sw.h} rx={4} fill="#f2f0ea" stroke="#a9a49a" strokeWidth={2} />
      <rect x={K.sw.x + 11} y={K.sw.y + 12} width={12} height={22} rx={3} fill="#d6d2c8" />
      <path d={`M${K.sw.x + K.sw.w / 2} ${K.sw.y} L${K.sw.x + K.sw.w / 2} 150`} stroke="#d8d4ca" strokeWidth={6} />
      {/* lower wall + floor left of the counter */}
      <rect x={88} y={1080} width={400} height={640} fill="#b2ab9e" />
      <rect x={88} y={1700} width={1100} height={420} fill="#6d6a66" />
      {/* tube fixture (body; the tube itself is live) */}
      <rect x={K.tube.x1 - 20} y={K.tube.y - 18} width={K.tube.x2 - K.tube.x1 + 40} height={14} rx={4} fill="#d9d6ce" />
      <rect x={K.tube.x1 - 22} y={K.tube.y - 14} width={14} height={30} fill="#bdb9b0" />
      <rect x={K.tube.x2 + 8} y={K.tube.y - 14} width={14} height={30} fill="#bdb9b0" />
      {/* hanging utensils */}
      <rect x={950} y={822} width={150} height={8} fill="#7a6650" />
      <path d="M990 830 L990 912" stroke="#55595e" strokeWidth={6} /><ellipse cx={990} cy={922} rx={18} ry={13} fill="#55595e" />
      <path d="M1040 830 L1040 900" stroke="#7a6650" strokeWidth={7} /><rect x={1026} y={898} width={28} height={36} rx={4} fill="#7a6650" />
      {/* counter */}
      <rect x={470} y={1058} width={720} height={26} fill="#b9bfc0" />
      <rect x={470} y={1082} width={720} height={14} fill="#7f8587" />
      <rect x={470} y={1096} width={720} height={1020} fill="url(#hkFront)" />
      <rect x={470} y={1058} width={14} height={1060} fill="#8a8478" />
      {/* under-counter curtain, half open: LPG tank */}
      <rect x={530} y={1140} width={600} height={560} fill="#2b2a2e" />
      <g>
        <rect x={570} y={1330} width={120} height={200} rx={50} fill="#46663a" />
        <rect x={570} y={1330} width={34} height={200} rx={17} fill="#5f8050" opacity={0.6} />
        <rect x={612} y={1300} width={36} height={40} rx={6} fill="#8c8f92" />
      </g>
      <path d="M720 1140 L1130 1140 L1130 1700 L700 1700 Q740 1420 720 1140 Z" fill="#6f8d88" />
      {[800, 880, 960, 1040].map((x) => <path key={x} d={`M${x} 1146 Q${x - 12} 1420 ${x + 4} 1694`} stroke="#4f6a66" strokeWidth={8} fill="none" opacity={0.7} />)}
      <rect x={520} y={1130} width={620} height={14} rx={7} fill="#6d6a66" />
      {/* rice cooker */}
      <g>
        <path d="M934 1080 L934 990 Q934 962 962 960 L1050 960 Q1076 962 1076 990 L1076 1080 Z" fill="#ebe8e0" />
        <path d="M1040 960 Q1076 962 1076 990 L1076 1080 L1050 1080 Z" fill="#b9b6ae" />
        <path d="M930 970 Q1005 922 1080 970 Z" fill="#dedad2" />
        <rect x={985} y={930} width={40} height={10} rx={5} fill="#8a8680" />
        <rect x={950} y={1032} width={60} height={22} rx={6} fill="#7f9cab" />
        <circle cx={1028} cy={1043} r={6} fill="#ff9a3c" />
      </g>
      {/* gas stove */}
      <g>
        <rect x={556} y={1030} width={348} height={30} rx={6} fill="#2d3035" />
        <rect x={556} y={1048} width={348} height={12} fill="#a3a9ae" />
        <circle cx={640} cy={1054} r={9} fill="#1c1e22" /><circle cx={820} cy={1054} r={9} fill="#1c1e22" />
        <rect x={610} y={1022} width={90} height={10} fill="#1c1e22" /><rect x={760} y={1022} width={90} height={10} fill="#1c1e22" />
      </g>
      {/* kettle on the right burner */}
      <g>
        <path d="M762 1022 Q760 958 806 950 Q852 958 850 1022 Z" fill="#b84a3c" />
        <path d="M830 958 Q852 966 850 1022 L826 1022 Z" fill="#8a3329" />
        <path d="M762 1000 L726 968 L732 962 L770 984 Z" fill="#b84a3c" />
        <path d="M776 954 Q806 914 836 954" stroke="#2d3035" strokeWidth={8} fill="none" />
        <path d="M772 1000 Q776 966 800 958" stroke="#ffffff" strokeWidth={5} fill="none" opacity={0.35} />
      </g>
      {/* pot on the left burner (lid is live) */}
      <g>
        <path d={`M582 ${K.pot.top} L728 ${K.pot.top} L722 ${K.pot.bot - 8} Q655 ${K.pot.bot + 4} 588 ${K.pot.bot - 8} Z`} fill="url(#hkPot)" />
        <rect x={562} y={K.pot.top + 22} width={24} height={12} rx={6} fill="#2d3035" />
        <rect x={724} y={K.pot.top + 22} width={24} height={12} rx={6} fill="#2d3035" />
        <path d={`M582 ${K.pot.top + 4} L728 ${K.pot.top + 4}`} stroke="#6f757b" strokeWidth={4} />
      </g>
    </g>
  );
};

/** Pot lid; lift 0..1 (handled by the mother, on twos). */
export const PotLid: React.FC<{ lift: number; tilt: number }> = ({ lift, tilt }) => (
  <g transform={`translate(${K.pot.cx - 10 * lift} ${K.pot.top - 34 * lift}) rotate(${tilt})`}>
    <path d="M-80 2 Q-78 -26 0 -32 Q78 -26 80 2 Z" fill="#c4c9cd" />
    <path d="M20 -30 Q78 -24 80 2 L30 2 Z" fill="#8e949a" />
    <path d="M-60 -10 Q-30 -26 10 -28" stroke="#f4f6f7" strokeWidth={5} fill="none" opacity={0.7} />
    <rect x={-16} y={-46} width={32} height={14} rx={6} fill="#2d3035" />
  </g>
);

/** The fluorescent tube itself + its glow; L = light level 0..1 (on ones). */
export const Tube: React.FC<{ L: number }> = ({ L }) => {
  const { x1, x2, y } = K.tube;
  return (
    <g>
      <Glow id="hkTubeG" x={(x1 + x2) / 2} y={y + 10} rx={560} ry={300} c="#f4f9ff" o={0.9 * L} mid={0.2} />
      <Glow id="hkTubeG2" x={(x1 + x2) / 2} y={y + 4} rx={300} ry={40} c="#ffffff" o={L} mid={0.5} />
      <rect x={x1} y={y - 6} width={x2 - x1} height={18} rx={9} fill="#4a4f60" />
      <rect x={x1} y={y - 6} width={x2 - x1} height={18} rx={9} fill="#ffffff" opacity={L} />
    </g>
  );
};

/** Gas flame (blue) under the pot + its glow when the room is dark. */
export const Flame: React.FC<{ t: number; dark: number }> = ({ t, dark }) => (
  <g>
    <Glow id="hkFlameG" x={655} y={1026} rx={170} ry={70} c="#6aa6ff" o={0.75 * dark + 0.15} mid={0.2} />
    {Array.from({ length: 7 }, (_, i) => {
      const x = 604 + i * 17, h = 14 + 5 * Math.sin(t * 22 + i * 1.7);
      return <path key={i} d={`M${x - 6} 1030 Q${x} ${1030 - h * 1.6} ${x + 6} 1030 Z`} fill="#6fb2ff" opacity={0.9} />;
    })}
  </g>
);

/** Darkness before the tube catches; hole over the window. */
export const KitchenDark: React.FC<{ o: number }> = ({ o }) => {
  const { win } = K;
  return (
    <g>
      <defs>
        <mask id="hkDarkM">
          <rect x={-200} y={-300} width={1500} height={2500} fill="#fff" />
          <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="#000" />
        </mask>
        <radialGradient id="hkWinSpill" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c7768a" stopOpacity={0.35} /><stop offset="1" stopColor="#c7768a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-200} y={-300} width={1500} height={2500} fill="#0c1029" opacity={o} mask="url(#hkDarkM)" />
      <ellipse cx={win.x + win.w / 2} cy={win.y + win.h / 2 + 120} rx={420} ry={420} fill="url(#hkWinSpill)" opacity={o} />
    </g>
  );
};

/** Steam rising from the pot (environment, on ones). amt 0..1, burst 0..1 when the lid lifts. */
export const Steam: React.FC<{ t: number; amt: number; burst: number }> = ({ t, amt, burst }) => (
  <g>
    {Array.from({ length: 6 }, (_, i) => {
      const life = ((t * 0.9 + i / 6) % 1);
      const x = K.pot.cx - 50 + ((i * 37) % 100) + Math.sin(t * 2 + i) * 18 * life;
      const y = K.pot.top - 30 - life * 260;
      return <Puff key={i} id={`hkSt${i}`} x={x} y={y} r={22 + life * 40} c="#f6f8fa" o={amt * 0.55 * Math.sin(Math.PI * life)} seed={i} />;
    })}
    {burst > 0 && <Puff id="hkBurst" x={K.pot.cx - 20} y={K.pot.top - 50 - burst * 80} r={50 + burst * 60} c="#ffffff" o={0.6 * Math.sin(Math.PI * Math.min(1, burst * 1.2))} seed={9} />}
  </g>
);

/* ---------------- the mother (ON TWOS) ---------------- */
const MOM = {
  scarf: '#4c5d78', scarfD: '#34425a', scarfL: '#7d93b5',
  dress: '#6e3b47', dressD: '#4b2630', dot: '#b0706f',
  skin: '#b07a5e', skinD: '#7a4f3e', rim: '#eef6ff',
};

/**
 * Mother seen from behind (3/4), in a headscarf and a long house dress.
 * reachL: left hand on the switch (1) -> dropped to her side (0). press: tiny push.
 * reachR: right hand from her side (0) to the pot lid (1). look: head tilt up (1). turn: head turns right (1).
 * lean: body shift toward the stove. rimO: rim light strength (tube).
 */
export const MotherKitchen: React.FC<{ reachL: number; press: number; reachR: number; lift: number; look: number; turn: number; lean: number; breath: number; rimO: number }> = ({
  reachL, press, reachR, lift, look, turn, lean, breath, rimO,
}) => {
  const cx = 404 + lean * 26;
  const shY = 836 - breath * 3;
  const shL = { x: cx - 84, y: shY + 30 }, shR = { x: cx + 88, y: shY + 32 };
  const L1 = 168, L2 = 150;
  // left hand: switch <-> side
  const hL = { x: lerp(cx - 120, K.sw.x + 26 - press * 5, reachL), y: lerp(1150, K.sw.y + 30, reachL) };
  const aL = ik(shL.x, shL.y, hL.x, hL.y, L1, L2, reachL > 0.5 ? -1 : 1);
  // right hand: side <-> pot lid knob
  const hR = { x: lerp(cx + 118, K.pot.cx - 10 * lift - 64, reachR), y: lerp(1160, K.pot.top - 34 * lift - 36, reachR) };
  const aR = ik(shR.x, shR.y, hR.x, hR.y, L1, L2, 1);
  const angL = Math.atan2(aL.hy - aL.ey, aL.hx - aL.ex) * (180 / Math.PI);
  const angR = lerp(Math.atan2(aR.hy - aR.ey, aR.hx - aR.ex) * (180 / Math.PI), -8, reachR);
  const headRot = -9 * look + 7 * turn;
  const hx = cx + 4 + turn * 8, hy = 694 - look * 6 - breath * 3;
  const arm = (s: { x: number; y: number }, a: { ex: number; ey: number; hx: number; hy: number }, ang: number, lit: boolean, thumb: 1 | -1) => (
    <g>
      <path d={limb(s.x, s.y, a.ex, a.ey, 58, 46)} fill={lit ? MOM.dress : MOM.dressD} />
      <path d={limb(a.ex, a.ey, a.hx, a.hy, 46, 34)} fill={lit ? MOM.dress : MOM.dressD} />
      {/* skin of the wrist where the sleeve rides up */}
      <path d={limb(lerp(a.ex, a.hx, 0.78), lerp(a.ey, a.hy, 0.78), a.hx, a.hy, 30, 28)} fill={MOM.skin} />
      <path d={limb(lerp(a.ex, a.hx, 0.74), lerp(a.ey, a.hy, 0.74), lerp(a.ex, a.hx, 0.8), lerp(a.ey, a.hy, 0.8), 48, 46)} fill={MOM.dressD} />
      <Mitt x={a.hx} y={a.hy} ang={ang} len={64} w={40} skin={MOM.skin} shade={MOM.skinD} thumb={thumb} curl={0.25} rim={MOM.rim} rimO={0.5 * rimO} />
      <path d={`M${s.x} ${s.y - 26} Q${(s.x + a.ex) / 2} ${(s.y + a.ey) / 2 - 30} ${a.ex} ${a.ey - 22}`} stroke={MOM.rim} strokeWidth={3} fill="none" opacity={0.0} />
    </g>
  );
  return (
    <g>
      {/* dress (long, A-line) */}
      <path d={`M${cx - 112} ${shY + 40} Q${cx - 130} 1300 ${cx - 168} 1900 L${cx + 172} 1900 Q${cx + 134} 1300 ${cx + 116} ${shY + 40} Z`} fill={MOM.dress} />
      <path d={`M${cx + 40} ${shY + 60} Q${cx + 70} 1300 ${cx + 90} 1900 L${cx + 172} 1900 Q${cx + 134} 1300 ${cx + 116} ${shY + 40} Z`} fill={MOM.dressD} opacity={0.75} />
      <path d={`M${cx - 30} ${shY + 200} Q${cx - 44} 1500 ${cx - 50} 1900`} stroke={MOM.dressD} strokeWidth={6} fill="none" opacity={0.6} />
      {[[-70, 1120], [10, 1180], [-40, 1300], [60, 1260], [-90, 1420], [20, 1460], [-20, 1600], [-100, 1640], [80, 1560]].map(([dx, y], i) => (
        <g key={i} fill={MOM.dot} opacity={0.75}>
          <circle cx={cx + dx} cy={y} r={7} /><circle cx={cx + dx + 10} cy={y + 6} r={5} /><circle cx={cx + dx - 9} cy={y + 7} r={5} />
        </g>
      ))}
      {/* arms (under the scarf cape) */}
      {arm(shR, aR, angR, false, -1)}
      {arm(shL, aL, angL, true, 1)}
      {/* head (back of the scarf) */}
      <g transform={`rotate(${headRot} ${cx} ${shY - 40})`}>
        {/* cheek sliver when she turns toward the stove */}
        <path d={`M${hx + 58} ${hy - 30} Q${hx + 86} ${hy + 4} ${hx + 70} ${hy + 50} Q${hx + 58} ${hy + 64} ${hx + 50} ${hy + 40} Z`} fill={MOM.skin} opacity={turn} />
        <ellipse cx={hx} cy={hy} rx={68} ry={82} fill={MOM.scarf} />
        <ellipse cx={hx - 6} cy={hy + 48} rx={46} ry={34} fill={MOM.scarf} />
        <path d={`M${hx - 44} ${hy + 40} Q${hx - 6} ${hy + 30} ${hx + 36} ${hy + 42}`} stroke={MOM.scarfD} strokeWidth={4} fill="none" opacity={0.6} />
        <path d={`M${hx + 30} ${hy - 78} Q${hx + 76} ${hy - 40} ${hx + 72} ${hy + 20} L${hx + 40} ${hy + 30} Z`} fill={MOM.scarfD} opacity={0.6} />
        <path d={`M${hx - 60} ${hy - 44} Q${hx - 20} ${hy - 92} ${hx + 36} ${hy - 80}`} stroke={MOM.rim} strokeWidth={5} fill="none" opacity={0.75 * rimO} strokeLinecap="round" />
      </g>
      {/* scarf cape over the shoulders: the bergo silhouette (narrow neck, clear shoulders, rounded hem) */}
      <path d={`M${hx - 52} ${hy + 50} Q${hx - 50} ${shY - 26} ${cx - 104} ${shY - 6} Q${cx - 142} ${shY + 12} ${cx - 142} ${shY + 60} L${cx - 132} ${shY + 118} Q${cx - 70} ${shY + 150} ${cx} ${shY + 156} Q${cx + 70} ${shY + 150} ${cx + 134} ${shY + 118} L${cx + 144} ${shY + 60} Q${cx + 144} ${shY + 12} ${cx + 106} ${shY - 6} Q${hx + 52} ${shY - 26} ${hx + 52} ${hy + 50} Z`} fill={MOM.scarf} />
      <path d={`M${cx + 34} ${shY - 16} Q${cx + 80} ${shY - 12} ${cx + 106} ${shY - 6} Q${cx + 144} ${shY + 12} ${cx + 144} ${shY + 60} L${cx + 134} ${shY + 118} Q${cx + 90} ${shY + 140} ${cx + 52} ${shY + 150} Q${cx + 50} ${shY + 60} ${cx + 34} ${shY - 16} Z`} fill={MOM.scarfD} opacity={0.75} />
      <path d={`M${cx - 18} ${shY + 6} Q${cx - 10} ${shY + 80} ${cx - 4} ${shY + 152}`} stroke={MOM.scarfD} strokeWidth={5} fill="none" opacity={0.7} />
      <path d={`M${cx - 76} ${shY + 20} Q${cx - 84} ${shY + 90} ${cx - 70} ${shY + 140}`} stroke={MOM.scarfD} strokeWidth={4} fill="none" opacity={0.5} />
      <path d={`M${hx - 52} ${hy + 50} Q${hx - 50} ${shY - 26} ${cx - 104} ${shY - 6} Q${cx - 142} ${shY + 12} ${cx - 142} ${shY + 60}`} stroke={MOM.rim} strokeWidth={4} fill="none" opacity={0.75 * rimO} strokeLinecap="round" />
      <path d={`M${cx - 142} ${shY + 60} L${cx - 132} ${shY + 118} Q${cx - 70} ${shY + 150} ${cx} ${shY + 156}`} stroke={MOM.scarfL} strokeWidth={3} fill="none" opacity={0.45 * rimO} />
    </g>
  );
};
