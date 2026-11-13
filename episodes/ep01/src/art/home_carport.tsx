import React from 'react';
import { limb, ik, Mitt, Glow, lerp, Puff, DEG } from './home_kit';

/**
 * Shot 3: narrow carport at dawn, looking out through the open gate into the alley. Frame coords.
 * Father astride a scooter (seated kick-start), a kid in a too-big helmet waits in the house door (right).
 */
export const CP = {
  G: 1340, // ground line under the scooter
  open: { x1: 120, x2: 900, y1: 330, y2: 1330 },
  door: { x: 868, y: 850, w: 156, h: 520 },
};

/** alley windows that wake up during the shot (on ones): x, y, w, h, wake fraction */
export const ALLEY_WIN: [number, number, number, number, number][] = [
  [226, 820, 56, 70, -1], [330, 820, 56, 70, 0.32], [560, 760, 48, 64, 0.12], [640, 760, 48, 64, -1],
  [770, 800, 60, 74, 0.55], [470, 980, 44, 58, 0.72],
];

export const CarportBand: React.FC = () => {
  const { open, door, G } = CP;
  return (
    <g>
      <defs>
        <linearGradient id="hcSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141a3a" /><stop offset="0.35" stopColor="#3b3466" /><stop offset="0.75" stopColor="#c7768a" /><stop offset="1" stopColor="#f4b98a" />
        </linearGradient>
        <linearGradient id="hcWallA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a7f92" /><stop offset="1" stopColor="#6e5c74" />
        </linearGradient>
        <linearGradient id="hcFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a5266" /><stop offset="0.25" stopColor="#3a3548" /><stop offset="1" stopColor="#1b1a26" />
        </linearGradient>
        <linearGradient id="hcDoor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9a0" /><stop offset="1" stopColor="#e7a866" />
        </linearGradient>
        <radialGradient id="hcAlleyGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f4b98a" stopOpacity={0.55} /><stop offset="1" stopColor="#f4b98a" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* sky through the opening */}
      <rect x={-108} y={-192} width={1296} height={1300} fill="url(#hcSky)" />
      {/* far roofs + a mosque dome far away */}
      <path d="M-108 660 L60 600 L160 640 L300 560 L420 620 L520 600 L620 540 L760 600 L900 570 L1188 640 L1188 900 L-108 900 Z" fill="#3a3a63" />
      <ellipse cx={690} cy={548} rx={38} ry={34} fill="#3a3a63" /><rect x={686} y={500} width={8} height={20} fill="#3a3a63" />
      {/* utility pole + wires */}
      <rect x={640} y={380} width={14} height={600} fill="#2a2a4a" />
      <path d="M-108 470 Q300 540 646 430 Q900 520 1188 470 M-108 500 Q320 560 646 452" stroke="#2a2a4a" strokeWidth={3} fill="none" />
      {/* houses across the alley, lit by the dawn */}
      <path d="M100 760 L210 700 L420 700 L420 1330 L100 1330 Z" fill="url(#hcWallA)" />
      <path d="M80 770 L210 690 L440 690 L440 712 L210 712 L96 782 Z" fill="#2f2f52" />
      <path d="M420 720 L540 690 L720 690 L720 1330 L420 1330 Z" fill="#83707f" />
      <path d="M410 728 L540 676 L740 676 L740 700 L540 700 L414 748 Z" fill="#2f2f52" />
      <path d="M720 740 L960 740 L960 1330 L720 1330 Z" fill="#927b8a" />
      <rect x={706} y={724} width={270} height={22} fill="#2f2f52" />
      {/* their (dark) windows + doors; live windows light up over these */}
      {ALLEY_WIN.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#2b2840" />)}
      <rect x={250} y={1080} width={90} height={250} fill="#2b2840" />
      <rect x={560} y={1060} width={86} height={270} fill="#2b2840" />
      {/* fence/low walls along the alley */}
      <rect x={100} y={1240} width={820} height={90} fill="#5e4f66" />
      {[150, 260, 370, 480, 590, 700, 810].map((x) => <rect key={x} x={x} y={1240} width={8} height={90} fill="#4a3f56" />)}
      <ellipse cx={510} cy={1150} rx={420} ry={220} fill="url(#hcAlleyGlow)" />
      {/* alley ground */}
      <rect x={-108} y={1320} width={1296} height={30} fill="#7a6a7a" />
      {/* the carport: neighbour wall left, house wall right, roof on top */}
      <path d="M-108 -192 L120 -192 L120 1336 L-108 1460 Z" fill="#2e2f45" />
      <path d="M120 300 L120 1336" stroke="#3e3f58" strokeWidth={6} />
      {/* folded iron gate pushed to the left */}
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={124 + i * 13} y={420} width={6} height={912} fill="#1b1c2c" />)}
      <rect x={120} y={420} width={110} height={10} fill="#1b1c2c" /><rect x={120} y={1300} width={110} height={10} fill="#1b1c2c" />
      {/* house wall (right) with its door */}
      <path d="M836 266 L1188 230 L1188 1520 L836 1336 Z" fill="#3a3550" />
      <path d="M836 266 L860 264 L860 1350 L836 1336 Z" fill="#4b4562" />
      <rect x={door.x} y={door.y} width={door.w} height={door.h} fill="url(#hcDoor)" />
      <path d={`M${door.x} ${door.y} L${door.x + door.w} ${door.y} L${door.x + door.w} ${door.y + door.h} L${door.x} ${door.y + door.h} Z`} fill="none" stroke="#5a4636" strokeWidth={14} />
      {/* inside the door: a doorway curtain pushed aside */}
      <path d={`M${door.x + door.w - 50} ${door.y + 8} Q${door.x + door.w - 30} ${door.y + 260} ${door.x + door.w - 8} ${door.y + 300} L${door.x + door.w - 8} ${door.y + 8} Z`} fill="#b06a4e" />
      <rect x={door.x - 20} y={door.y + door.h} width={door.w + 60} height={18} fill="#4b4562" />
      {/* light spill from the door on the floor */}
      <path d={`M${door.x} ${door.y + door.h + 18} L${door.x + door.w} ${door.y + door.h + 18} L${door.x + door.w - 120} 1900 L${door.x - 360} 1900 Z`} fill="#ffcf86" opacity={0.12} />
      {/* floor */}
      <path d="M-108 1460 L120 1336 L836 1336 L1188 1520 L1188 2112 L-108 2112 Z" fill="url(#hcFloor)" />
      <path d="M120 1336 L-108 1700 M836 1336 L1188 1800" stroke="#24222f" strokeWidth={4} opacity={0.6} />
      {/* roof: corrugated underside */}
      <path d="M-108 -192 L1188 -192 L1188 230 L900 262 L120 300 L-108 300 Z" fill="#1d1e2e" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-108 + i * 160} -192 L${80 + i * 104} 296`} stroke="#2a2b3e" strokeWidth={10} />)}
      <path d="M-108 300 L120 300 L900 262 L1188 230" stroke="#353650" strokeWidth={12} fill="none" />
      {/* scooter's ground shadow */}
      <ellipse cx={446} cy={G + 4} rx={360} ry={22} fill="#100e18" opacity={0.6} />
    </g>
  );
};

/** foreground carport pillar + hanging bulb (live, larger parallax) */
export const CarportFg: React.FC = () => (
  <g>
    <rect x={-108} y={-192} width={150} height={2400} fill="#0e0f19" />
    <rect x={30} y={-192} width={10} height={2400} fill="#3a3550" opacity={0.6} />
    <path d="M330 -192 L330 210" stroke="#0e0f19" strokeWidth={3} />
    <Glow id="hcBulb" x={330} y={224} rx={90} c="#ffcf86" o={0.55} />
    <circle cx={330} cy={224} r={13} fill="#ffe2a8" />
  </g>
);

/** alley windows waking (environment, on ones): u 0..1 shot progress */
export const AlleyWindows: React.FC<{ u: number }> = ({ u }) => (
  <g>
    {ALLEY_WIN.map(([x, y, w, h, wake], i) => {
      const on = wake < 0 ? 1 : u > wake + 0.05 ? 1 : u > wake ? 0.4 : 0;
      return on > 0 ? <rect key={i} x={x} y={y} width={w} height={h} fill={i % 3 === 2 ? '#bfe3ff' : '#ffd58a'} opacity={0.9 * on} /> : null;
    })}
  </g>
);

const DK = '#17151f', MD = '#2c2a3a', HI = '#5a5070', RIM = '#ffc6a0';

/** Scooter (matic) facing right. lamp 0..1 headlight, shake = engine idle (px). kick = lever angle 0 (rest) .. 1 (down). */
export const Scooter: React.FC<{ lamp: number; shake: number; kick: number }> = ({ lamp, shake, kick }) => {
  const G = CP.G;
  const wheel = (cx: number, r: number) => (
    <g>
      <circle cx={cx} cy={G - r} r={r} fill={DK} />
      <circle cx={cx} cy={G - r} r={r * 0.56} fill={MD} />
      <circle cx={cx} cy={G - r} r={r * 0.18} fill={HI} />
      <path d={`M${cx - r * 0.86} ${G - r * 1.5} A${r} ${r} 0 0 1 ${cx + r * 0.6} ${G - r * 1.8}`} stroke={RIM} strokeWidth={3} fill="none" opacity={0.6} />
    </g>
  );
  const la = lerp(200, 116, kick) / DEG;
  const px = 420 + Math.cos(la) * 62, py = 1258 + Math.sin(la) * 62;
  return (
    <g>
      {lamp > 0 && (
        <g opacity={lamp}>
          <path d={`M812 ${916 + shake} L1240 830 L1240 1080 Z`} fill="#fff1c8" opacity={0.22} />
          <Glow id="hcLamp" x={812} y={916 + shake} rx={70} c="#fff1c8" o={0.9} />
        </g>
      )}
      {wheel(300, 90)}
      {wheel(772, 86)}
      <g transform={`translate(0 ${shake})`}>
        {/* engine + swing arm, muffler */}
        <path d="M296 1228 L476 1226 L470 1268 L300 1282 Z" fill={DK} />
        <path d="M186 1232 L304 1224 L304 1262 L192 1270 Q176 1252 186 1232 Z" fill={HI} />
        <path d="M188 1236 L300 1228" stroke={RIM} strokeWidth={3} opacity={0.6} />
        {/* rear body shell */}
        <path d="M180 1172 C174 1112 212 1082 270 1078 L566 1082 C590 1112 592 1176 576 1216 L524 1236 L304 1236 C240 1236 186 1216 180 1172 Z" fill={MD} />
        <path d="M184 1150 C190 1104 222 1084 270 1080 L566 1084" stroke={RIM} strokeWidth={4} fill="none" opacity={0.75} />
        <path d="M240 1160 L520 1166" stroke={DK} strokeWidth={4} opacity={0.6} />
        <circle cx={186} cy={1150} r={8} fill="#c4433a" />
        {/* floorboard + leg shield + front fender */}
        <rect x={520} y={1212} width={186} height={30} rx={6} fill={MD} />
        <path d="M684 1242 C704 1150 714 1022 732 930 L784 920 C774 1010 764 1122 738 1242 Z" fill={MD} />
        <path d="M732 930 L784 920 C774 1010 764 1122 738 1242" stroke={RIM} strokeWidth={3} fill="none" opacity={0.55} />
        <path d="M688 1252 C700 1176 846 1176 864 1260 L842 1262 C822 1206 716 1206 708 1254 Z" fill={MD} />
        {/* seat */}
        <path d="M246 1082 C246 1054 300 1046 364 1048 L562 1056 C580 1062 582 1082 566 1086 Z" fill={DK} />
        <path d="M262 1060 C300 1050 400 1050 556 1060" stroke={HI} strokeWidth={3} fill="none" />
        {/* handlebar cover, headlight, mirror, grip */}
        <path d="M704 920 L716 890 L806 882 L826 912 L786 934 Z" fill={MD} />
        <path d="M716 890 L806 882" stroke={RIM} strokeWidth={3} opacity={0.7} />
        <ellipse cx={814} cy={914} rx={12} ry={14} fill={lamp > 0.5 ? '#fff6d8' : HI} />
        <path d="M740 888 L724 836" stroke={DK} strokeWidth={4} /><ellipse cx={722} cy={830} rx={14} ry={9} fill={MD} />
        <path d="M720 900 L676 892" stroke={DK} strokeWidth={14} strokeLinecap="round" />
      </g>
      {/* kick-start lever (moved by the father's foot) */}
      <path d={`M420 1258 L${px} ${py}`} stroke={HI} strokeWidth={9} strokeLinecap="round" />
      <rect x={px - 16} y={py - 6} width={32} height={12} rx={4} fill={DK} transform={`rotate(${la * DEG - 180} ${px} ${py})`} />
      <circle cx={420} cy={1258} r={8} fill={DK} />
    </g>
  );
};

/** kick lever pedal position (for the foot) */
export const kickPedal = (kick: number) => {
  const la = lerp(200, 116, kick) / DEG;
  return { x: 420 + Math.cos(la) * 62, y: 1258 + Math.sin(la) * 62 };
};

const FA = { jacket: '#2f3a52', jacketD: '#1f2738', stripe: '#c9cdd2', pants: '#25262f', skin: '#8a5a44', skinD: '#5e3b2e', hair: '#111017' };

/**
 * Father astride the scooter (side view, facing right), kick-starting it.
 * foot: where his near foot is (frame px), rise: body lift during the stomp, look: head turn toward the kid (0..1), shake: engine idle.
 */
export const Father: React.FC<{ foot: { x: number; y: number }; rise: number; look: number; breath: number }> = ({ foot, rise, look, breath }) => {
  const hip = { x: 452, y: 1046 - rise * 18 };
  const sh = { x: 506 + rise * 4, y: 834 - rise * 22 - breath * 2 };
  const head = { x: 526 + rise * 4 + look * 4, y: 766 - rise * 22 - breath * 2 };
  const leg = ik(hip.x, hip.y, foot.x, foot.y, 158, 156, -1);
  const grip = { x: 688, y: 896 };
  const armN = ik(sh.x + 4, sh.y + 12, grip.x, grip.y, 120, 112, 1);
  const armF = ik(sh.x - 8, sh.y + 6, grip.x + 30, grip.y - 8, 120, 112, 1);
  return (
    <g>
      {/* far arm (darker) */}
      <path d={limb(sh.x - 8, sh.y + 6, armF.ex, armF.ey, 40, 32)} fill={FA.jacketD} />
      <path d={limb(armF.ex, armF.ey, armF.hx, armF.hy, 32, 24)} fill={FA.jacketD} />
      {/* far leg: down to the ground behind the floorboard */}
      <path d={limb(hip.x + 30, hip.y, 560, 1196, 58, 44)} fill="#1a1b22" />
      {/* torso: work jacket, slight forward lean */}
      <path d={`M${hip.x - 50} ${hip.y + 10} Q${hip.x - 66} ${(hip.y + sh.y) / 2} ${sh.x - 56} ${sh.y + 6} Q${sh.x - 20} ${sh.y - 22} ${sh.x + 30} ${sh.y - 6} Q${sh.x + 50} ${sh.y + 60} ${hip.x + 56} ${hip.y - 30} L${hip.x + 50} ${hip.y + 12} Z`} fill={FA.jacket} />
      <path d={`M${sh.x + 30} ${sh.y - 6} Q${sh.x + 50} ${sh.y + 60} ${hip.x + 56} ${hip.y - 30} L${hip.x + 50} ${hip.y + 12} L${hip.x + 20} ${hip.y + 12} Q${sh.x + 20} ${sh.y + 80} ${sh.x + 10} ${sh.y} Z`} fill={FA.jacketD} opacity={0.6} />
      {/* reflective stripe across the back */}
      <path d={`M${hip.x - 60} ${hip.y - 90} Q${hip.x} ${hip.y - 96} ${hip.x + 56} ${hip.y - 104}`} stroke={FA.stripe} strokeWidth={14} fill="none" opacity={0.85} />
      <path d={`M${sh.x - 56} ${sh.y + 6} Q${sh.x - 20} ${sh.y - 22} ${sh.x + 30} ${sh.y - 6}`} stroke={RIM} strokeWidth={4} fill="none" opacity={0.8} />
      <path d={`M${hip.x - 50} ${hip.y + 10} Q${hip.x - 66} ${(hip.y + sh.y) / 2} ${sh.x - 56} ${sh.y + 6}`} stroke={RIM} strokeWidth={3} fill="none" opacity={0.55} />
      {/* near leg (the kick): thigh, shin, shoe */}
      <path d={limb(hip.x, hip.y, leg.ex, leg.ey, 66, 50)} fill={FA.pants} />
      <path d={limb(leg.ex, leg.ey, leg.hx, leg.hy, 50, 36)} fill={FA.pants} />
      <path d={`M${hip.x - 10} ${hip.y - 30} L${leg.ex} ${leg.ey - 24}`} stroke={RIM} strokeWidth={3} opacity={0.5} />
      <path d={`M${leg.hx - 16} ${leg.hy - 14} L${leg.hx + 46} ${leg.hy - 8} Q${leg.hx + 56} ${leg.hy + 10} ${leg.hx + 40} ${leg.hy + 12} L${leg.hx - 22} ${leg.hy + 12} Z`} fill="#0f0e14" />
      {/* near arm to the grip */}
      <path d={limb(sh.x + 4, sh.y + 12, armN.ex, armN.ey, 44, 36)} fill={FA.jacket} />
      <path d={limb(armN.ex, armN.ey, armN.hx, armN.hy, 36, 28)} fill={FA.jacket} />
      <path d={limb(lerp(armN.ex, armN.hx, 0.82), lerp(armN.ey, armN.hy, 0.82), armN.hx, armN.hy, 30, 28)} fill={FA.stripe} opacity={0.0} />
      <path d={`M${sh.x} ${sh.y} Q${(sh.x + armN.ex) / 2} ${(sh.y + armN.ey) / 2 - 20} ${armN.ex} ${armN.ey - 18}`} stroke={RIM} strokeWidth={3} fill="none" opacity={0.6} />
      <Mitt x={armN.hx - 10} y={armN.hy + 2} ang={Math.atan2(armN.hy - armN.ey, armN.hx - armN.ex) * DEG} len={40} w={30} skin={FA.skin} shade={FA.skinD} thumb={-1} curl={0.6} />
      {/* neck + head in profile, short hair */}
      <path d={limb(sh.x + 4, sh.y - 6, head.x - 4, head.y + 30, 30, 28)} fill={FA.skinD} />
      <ellipse cx={head.x} cy={head.y} rx={36} ry={44} fill={FA.skin} />
      <path d={`M${head.x + 33} ${head.y - 6} L${head.x + 44} ${head.y + 8} L${head.x + 33} ${head.y + 12} Z`} fill={FA.skin} />
      <path d={`M${head.x - 36} ${head.y + 4} Q${head.x - 40} ${head.y - 46} ${head.x + 2} ${head.y - 48} Q${head.x + 34} ${head.y - 46} ${head.x + 36} ${head.y - 18} Q${head.x + 10} ${head.y - 28} ${head.x - 8} ${head.y - 10} Q${head.x - 14} ${head.y + 16} ${head.x - 30} ${head.y + 24} Z`} fill={FA.hair} />
      <path d={`M${head.x - 34} ${head.y - 20} Q${head.x - 28} ${head.y - 50} ${head.x + 10} ${head.y - 48}`} stroke={RIM} strokeWidth={4} fill="none" opacity={0.85} />
      <ellipse cx={head.x - 6} cy={head.y + 2} rx={8} ry={11} fill={FA.skinD} opacity={0.8} />
    </g>
  );
};

const KD = { shirt: '#c9c6d2', shirtD: '#8f8c9e', shorts: '#8e3236', skin: '#9a6650', skinD: '#6b4535', helmet: '#4f79a8', helmetD: '#2f4d73', visor: '#1a1d2a', bag: '#d9a441' };

/**
 * Kid (~7) in the doorway, facing left toward the scooter, a helmet far too big for him.
 * push 0..1: his hand pushes the helmet up off his eyes; bounce: little impatient bounce; wave 0..1 raises the free hand.
 */
export const Kid: React.FC<{ push: number; bounce: number; tilt: number }> = ({ push, bounce, tilt }) => {
  const fx = CP.door.x + 84, fy = CP.door.y + CP.door.h - 4; // feet
  const s = 1;
  const by = -bounce * 10;
  const hip = { x: fx, y: fy - 190 + by };
  const sh = { x: fx - 4, y: fy - 330 + by };
  const hd = { x: fx - 10, y: fy - 400 + by };
  const hand = { x: lerp(fx - 40, hd.x - 54, push), y: lerp(fy - 200, hd.y + 20, push) + by };
  const arm = ik(sh.x - 10, sh.y + 10, hand.x, hand.y, 72, 66, push > 0.4 ? 1 : -1);
  return (
    <g transform={`scale(${s})`}>
      {/* legs + sandals */}
      <path d={limb(hip.x - 12, hip.y, fx - 20, fy - 10, 30, 22)} fill={KD.skin} />
      <path d={limb(hip.x + 12, hip.y, fx + 16, fy - 10, 30, 22)} fill={KD.skinD} />
      <path d={`M${fx - 44} ${fy - 14} L${fx - 6} ${fy - 14} L${fx - 6} ${fy} L${fx - 48} ${fy} Z`} fill="#20202a" />
      <path d={`M${fx - 6} ${fy - 14} L${fx + 30} ${fy - 14} L${fx + 30} ${fy} L${fx - 10} ${fy} Z`} fill="#20202a" />
      {/* red school shorts */}
      <path d={`M${hip.x - 44} ${hip.y - 40} L${hip.x + 40} ${hip.y - 40} L${hip.x + 44} ${hip.y + 36} L${hip.x + 2} ${hip.y + 36} L${hip.x} ${hip.y + 10} L${hip.x - 4} ${hip.y + 36} L${hip.x - 48} ${hip.y + 36} Z`} fill={KD.shorts} />
      {/* backpack (behind, on his back = right side since he faces left) */}
      <rect x={sh.x + 22} y={sh.y + 6} width={50} height={110} rx={16} fill={KD.bag} />
      <rect x={sh.x + 22} y={sh.y + 6} width={14} height={110} rx={7} fill="#a87a2c" />
      {/* white shirt */}
      <path d={`M${sh.x - 38} ${sh.y} Q${sh.x} ${sh.y - 14} ${sh.x + 38} ${sh.y} L${hip.x + 42} ${hip.y - 36} L${hip.x - 44} ${hip.y - 36} Z`} fill={KD.shirt} />
      <path d={`M${sh.x + 10} ${sh.y - 4} L${sh.x + 38} ${sh.y} L${hip.x + 42} ${hip.y - 36} L${hip.x + 14} ${hip.y - 36} Z`} fill={KD.shirtD} opacity={0.7} />
      <path d={`M${sh.x - 38} ${sh.y} Q${sh.x - 46} ${(sh.y + hip.y) / 2} ${hip.x - 44} ${hip.y - 36}`} stroke="#ffe0c0" strokeWidth={3} fill="none" opacity={0.6} />
      {/* arm: hand on the door frame or pushing the helmet up */}
      <path d={limb(sh.x - 10, sh.y + 10, arm.ex, arm.ey, 26, 22)} fill={KD.shirt} />
      <path d={limb(arm.ex, arm.ey, arm.hx, arm.hy, 20, 16)} fill={KD.skin} />
      <circle cx={arm.hx} cy={arm.hy} r={13} fill={KD.skin} />
      {/* neck + face (profile, simple) */}
      <rect x={hd.x - 8} y={hd.y + 30} width={18} height={30} fill={KD.skinD} />
      <ellipse cx={hd.x - 6} cy={hd.y + 20} rx={34} ry={36} fill={KD.skin} />
      {/* the too-big helmet, tipped forward over his eyes */}
      <g transform={`rotate(${tilt * (1 - push * 0.8)} ${hd.x} ${hd.y + 10})`}>
        <path d={`M${hd.x - 86} ${hd.y + 26} Q${hd.x - 92} ${hd.y - 92} ${hd.x} ${hd.y - 96} Q${hd.x + 88} ${hd.y - 90} ${hd.x + 82} ${hd.y + 30} Q${hd.x + 40} ${hd.y + 44} ${hd.x - 10} ${hd.y + 36} Q${hd.x - 60} ${hd.y + 30} ${hd.x - 86} ${hd.y + 26} Z`} fill={KD.helmet} />
        <path d={`M${hd.x + 20} ${hd.y - 92} Q${hd.x + 88} ${hd.y - 86} ${hd.x + 82} ${hd.y + 30} Q${hd.x + 50} ${hd.y + 40} ${hd.x + 30} ${hd.y + 36} Q${hd.x + 52} ${hd.y - 20} ${hd.x + 20} ${hd.y - 92} Z`} fill={KD.helmetD} opacity={0.7} />
        <path d={`M${hd.x - 92} ${hd.y - 6} Q${hd.x - 70} ${hd.y - 30} ${hd.x - 30} ${hd.y - 26} L${hd.x - 34} ${hd.y + 14} Q${hd.x - 66} ${hd.y + 10} ${hd.x - 94} ${hd.y + 22} Z`} fill={KD.visor} />
        <path d={`M${hd.x - 78} ${hd.y - 40} Q${hd.x - 60} ${hd.y - 88} ${hd.x} ${hd.y - 92}`} stroke="#ffe0c0" strokeWidth={5} fill="none" opacity={0.7} strokeLinecap="round" />
        <path d={`M${hd.x + 30} ${hd.y + 36} L${hd.x + 10} ${hd.y + 70}`} stroke="#1a1d2a" strokeWidth={4} />
      </g>
    </g>
  );
};

/** exhaust puffs (environment, on ones): list of [birth time] */
export const Exhaust: React.FC<{ t: number; births: number[] }> = ({ t, births }) => (
  <g>
    {births.map((b, i) => {
      const a = t - b;
      if (a < 0 || a > 1.2) return null;
      const k = a / 1.2;
      return <Puff key={i} id={`hcEx${i}`} x={180 - 60 * k - 30 * i} y={1246 - 70 * k} r={34 + 90 * k} c="#d8d0e0" o={0.85 * (1 - k)} seed={i * 3} />;
    })}
  </g>
);
