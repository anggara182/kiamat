import React from 'react';
import { W, H, rng } from './world';
import { Figure, walkPose, seatPose, Look } from './street_people';

/* ------------------------------------------------------------------------------------------
 * Shot 16: evening sidewalk in front of a shophouse row, seen straight on. Between two shops an
 * alley mouth (pitch black, the one wrong thing) is closed with yellow police tape under a
 * sodium wall lamp. People walk past on their phones; nobody turns. 1 m ~ 182 px.
 * Shot 17: a bus stop at dusk, an old man in a peci sits still; crowd and a bus blur past.
 * ---------------------------------------------------------------------------------------- */
export const WK = { base: 1452, curb: 1640, alley: [420, 640] as [number, number], lampX: 530, lampY: 760 };
const C = { sky: ['#1f1d3d', '#3a2a4f'], wall: '#2b2344', wall2: '#241d3a', trim: '#3a2f52', sign: ['#4a3550', '#3d3a55', '#523a44'], dark: '#07050c', warm: '#ffcf86', warm2: '#e9a860', cool: '#dfe9f2', walk: '#3a3046', walk2: '#2c2438', road: '#17131f' };

export const WalkBand: React.FC = () => {
  const r = rng(81);
  const [a0, a1] = WK.alley;
  const ruko = (x0: number, x1: number, key: string, shop: 'warm' | 'shut' | 'cool') => (
    <g key={key}>
      <rect x={x0} y={260} width={x1 - x0} height={WK.base - 260} fill={C.wall} />
      {/* first floor: two windows (one lit), AC unit, balcony rail */}
      <rect x={x0 + 40} y={380} width={(x1 - x0) / 2 - 70} height={190} fill={r() < 0.5 ? '#3a2c3c' : '#5a4044'} />
      <rect x={x0 + (x1 - x0) / 2 + 30} y={380} width={(x1 - x0) / 2 - 70} height={190} fill={shop === 'warm' ? '#8a6448' : '#30283f'} />
      <rect x={x0 + 30} y={580} width={x1 - x0 - 60} height={10} fill={C.trim} />
      {Array.from({ length: Math.floor((x1 - x0 - 60) / 26) }, (_, i) => <rect key={i} x={x0 + 34 + i * 26} y={590} width={4} height={60} fill={C.trim} />)}
      <rect x={x0 + 30} y={646} width={x1 - x0 - 60} height={8} fill={C.trim} />
      <rect x={x1 - 110} y={600} width={70} height={44} fill="#3d3550" />
      {/* signboard band (blank coloured panel, no text) */}
      <rect x={x0 + 14} y={690} width={x1 - x0 - 28} height={104} fill={C.sign[Math.floor(r() * 3)]} />
      <rect x={x0 + 14} y={788} width={x1 - x0 - 28} height={6} fill="#1a1530" />
      {/* ground floor shop */}
      {shop === 'shut' && <g><rect x={x0 + 24} y={830} width={x1 - x0 - 48} height={WK.base - 830} fill="#3a3248" />{Array.from({ length: 22 }, (_, i) => <rect key={i} x={x0 + 24} y={840 + i * 27} width={x1 - x0 - 48} height={3} fill="#2a2338" />)}</g>}
      {shop !== 'shut' && <g>
        <rect x={x0 + 24} y={830} width={x1 - x0 - 48} height={WK.base - 830} fill={shop === 'warm' ? C.warm : C.cool} />
        <rect x={x0 + 24} y={830} width={x1 - x0 - 48} height={WK.base - 830} fill={shop === 'warm' ? C.warm2 : '#9fb3c4'} opacity={0.45} />
        {/* shelves + stock silhouettes, rolling door half up */}
        {[1010, 1150, 1290].map((y) => <rect key={y} x={x0 + 50} y={y} width={x1 - x0 - 100} height={10} fill={shop === 'warm' ? '#7a5038' : '#6f7c88'} />)}
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={x0 + 56 + (i % 6) * ((x1 - x0 - 110) / 6)} y={(i < 6 ? 960 : 1100) + (i % 3) * 6} width={(x1 - x0 - 140) / 7} height={44 - (i % 3) * 6} fill={shop === 'warm' ? '#a8714a' : '#8394a3'} />)}
        <rect x={x0 + 24} y={830} width={x1 - x0 - 48} height={130} fill="#3a3248" />
        {Array.from({ length: 5 }, (_, i) => <rect key={i} x={x0 + 24} y={838 + i * 26} width={x1 - x0 - 48} height={3} fill="#2a2338" />)}
      </g>}
      <rect x={x0} y={WK.base - 10} width={x1 - x0} height={10} fill={C.trim} />
    </g>
  );
  return (
    <g>
      <defs>
        <linearGradient id="swSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.sky[0]} /><stop offset="1" stopColor={C.sky[1]} /></linearGradient>
        <linearGradient id="swWalk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.walk} /><stop offset="1" stopColor={C.walk2} /></linearGradient>
        <linearGradient id="swAlley" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#151027" /><stop offset="0.25" stopColor={C.dark} /><stop offset="1" stopColor="#030206" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={300} fill="url(#swSky)" />
      {/* rooflines */}
      <polygon points={`-40,300 ${a0},300 ${a0},250 -40,240`} fill="#1a1530" />
      <polygon points={`${a1},300 ${W + 40},300 ${W + 40},230 ${a1},250`} fill="#1a1530" />
      {ruko(-40, a0, 'A', 'warm')}
      {ruko(a1, 990, 'B', 'shut')}
      {ruko(990, W + 40, 'C', 'cool')}
      {/* alley mouth: deep black passage, a strip of sky at the top, a faint bulb far inside */}
      <rect x={a0} y={250} width={a1 - a0} height={WK.base - 250} fill="url(#swAlley)" />
      <rect x={a0 + 92} y={1060} width={18} height={10} fill="#8a7a60" opacity={0.55} />
      <ellipse cx={a0 + 101} cy={1068} rx={30} ry={22} fill="#8a7a60" opacity={0.12} />
      <rect x={a0} y={250} width={10} height={WK.base - 250} fill="#1a1530" />
      <rect x={a1 - 10} y={250} width={10} height={WK.base - 250} fill="#1a1530" />
      {/* drainpipe on the left of the alley (tape is tied to it) */}
      <rect x={a0 - 26} y={300} width={16} height={WK.base - 300} fill="#3d3550" />
      {/* wall lamp over the alley */}
      <path d={`M ${WK.lampX - 70} ${WK.lampY - 50} L ${WK.lampX} ${WK.lampY - 50} L ${WK.lampX} ${WK.lampY - 20}`} stroke="#1a1530" strokeWidth={8} fill="none" />
      <path d={`M ${WK.lampX - 34} ${WK.lampY - 20} L ${WK.lampX + 34} ${WK.lampY - 20} L ${WK.lampX + 22} ${WK.lampY} L ${WK.lampX - 22} ${WK.lampY} Z`} fill="#1a1530" />
      {/* sidewalk, curb, road */}
      <rect x={0} y={WK.base} width={W} height={WK.curb - WK.base} fill="url(#swWalk)" />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 100 - 20} y={WK.base} width={3} height={WK.curb - WK.base} fill="#2a2236" />)}
      <rect x={0} y={WK.curb} width={W} height={20} fill="#5a4a62" />
      <rect x={0} y={WK.curb + 20} width={W} height={H - WK.curb - 20} fill={C.road} />
      {/* shop light spilling onto the sidewalk */}
      <polygon points={`-40,${WK.base} ${a0 - 30},${WK.base} ${a0 + 30},${WK.curb} -40,${WK.curb}`} fill={C.warm} opacity={0.16} />
      <polygon points={`1014,${WK.base} ${W + 40},${WK.base} ${W + 40},${WK.curb} 1060,${WK.curb}`} fill={C.cool} opacity={0.12} />
    </g>
  );
};

/** sodium lamp light + police tape (tape flutters on ONES: it's environment) */
export const AlleyLight: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="swPool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.5} /><stop offset="0.6" stopColor="#ffb347" stopOpacity={0.14} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient>
      <linearGradient id="swCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.26} /><stop offset="1" stopColor="#ffb347" stopOpacity={0.02} /></linearGradient>
      <radialGradient id="swBulb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff3c8" stopOpacity={1} /><stop offset="0.25" stopColor="#ffd27a" stopOpacity={0.45} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient>
    </defs>
    <polygon points={`${WK.lampX - 22},${WK.lampY} ${WK.lampX + 22},${WK.lampY} ${WK.lampX + 330},${WK.curb} ${WK.lampX - 330},${WK.curb}`} fill="url(#swCone)" />
    <ellipse cx={WK.lampX} cy={WK.base + 90} rx={420} ry={120} fill="url(#swPool)" />
    <ellipse cx={WK.lampX} cy={WK.lampY + 2} rx={130} ry={110} fill="url(#swBulb)" />
    <rect x={WK.lampX - 20} y={WK.lampY - 3} width={40} height={6} rx={2} fill="#fff3c8" />
  </g>
);

export const PoliceTape: React.FC<{ t: number }> = ({ t }) => {
  const [a0, a1] = WK.alley;
  const pX = a1 + 60, pY = WK.base + 40; // a portable post on the sidewalk
  const w = (k: number, sp: number, ph: number) => Math.sin(t * sp + ph) * k;
  const tape = (x0: number, y0: number, x1: number, y1: number, sag: number, key: string, ph: number) => {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + sag + w(6, 3.1, ph);
    const d = `M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`;
    return (
      <g key={key}>
        <path d={d} stroke="#e8c547" strokeWidth={15} fill="none" />
        <path d={d} stroke="#1a1530" strokeWidth={6} strokeDasharray="10 26" strokeDashoffset={ph * 9} fill="none" opacity={0.85} />
        <path d={d} stroke="#fff1a8" strokeWidth={2} fill="none" opacity={0.6} transform="translate(0 -6)" />
      </g>
    );
  };
  return (
    <g>
      {/* post with a weighted base */}
      <rect x={pX - 6} y={pY - 220} width={12} height={220} fill="#3d3550" />
      <ellipse cx={pX} cy={pY} rx={34} ry={8} fill="#1a1530" />
      {tape(a0 - 18, WK.base - 200, pX, pY - 200, 16, 'a', 0)}
      {tape(a0 - 18, WK.base - 330, pX, pY - 120, 22, 'b', 1.7)}
      {/* loose end fluttering from the knot on the pipe */}
      <path d={`M ${a0 - 18} ${WK.base - 330} q ${-30 + w(8, 7, 0)} ${30 + w(10, 5.5, 1)} ${-26 + w(14, 6.3, 2)} ${78 + w(8, 4.7, 0.5)}`} stroke="#e8c547" strokeWidth={13} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** walkers on the sidewalk (S16), all heads down at their phones; t2 = on-twos clock */
const WALKERS: { x0: number; y: number; h: number; dir: number; v: number; ph: number; look: Look }[] = [
  { x0: 980, y: WK.base + 60, h: 286, dir: -1, v: 210, ph: 0.4, look: { body: '#2a2236', far: '#1a1426', skin: '#3a2c34', hat: 'hijab', hatCol: '#5a4a6a', skirt: true, phone: true, rim: '#ffd27a', rimO: 0.5 } },
  { x0: 120, y: WK.base + 105, h: 304, dir: 1, v: 240, ph: 2.1, look: { body: '#1f1b2c', far: '#14111e', skin: '#3a2c34', phone: true, bag: 'shoulder', bagCol: '#2c2438', rim: '#ffd27a', rimO: 0.55 } },
  { x0: 1290, y: WK.base + 118, h: 296, dir: -1, v: 250, ph: 4.0, look: { body: '#262034', far: '#17131f', skin: '#3a2c34', hat: 'cap', hatCol: '#1a1530', phone: true, bag: 'back', bagCol: '#3a2f52', rim: '#dfe9f2', rimO: 0.4 } },
  { x0: -260, y: WK.base + 70, h: 280, dir: 1, v: 200, ph: 5.2, look: { body: '#2c2438', far: '#1a1426', skin: '#3a2c34', phone: true, rim: '#ffd27a', rimO: 0.5 } },
];
export const Walkers: React.FC<{ t2: number }> = ({ t2 }) => (
  <g>
    {[...WALKERS].sort((a, b) => a.y - b.y).map((w, i) => {
      const x = w.x0 + w.dir * w.v * t2;
      const pose = walkPose(w.ph + (t2 * w.v) / (w.h * 0.21), true, 0.85);
      return (
        <g key={i}>
          <ellipse cx={x} cy={w.y + 2} rx={w.h * 0.17} ry={w.h * 0.025} fill="#0b0814" opacity={0.6} />
          <Figure x={x} y={w.y} h={w.h} dir={w.dir} pose={pose} look={w.look} />
        </g>
      );
    })}
  </g>
);

/* ------------------------------------------- S17 ------------------------------------------- */
export const BUS = { seat: 1330, man: 700 };
const BC = { sky: ['#1f1d3d', '#5a3558', '#c96a5e', '#f0b27a'], far: '#2b2344', far2: '#3a2d50', road: '#2a2236', shelter: '#140f22' };

/** background: dusk sky, far rooftops across the road, the road (static, drawn live: cheap shapes) */
export const BusBg: React.FC = () => {
  const r = rng(91);
  const roofs: React.ReactNode[] = [];
  let x = -40;
  while (x < W + 40) { const w = 80 + r() * 150, h = 160 + r() * 380; roofs.push(<rect key={x} x={x} y={1240 - h} width={w} height={h + 20} fill={r() < 0.5 ? BC.far : BC.far2} />); if (r() < 0.6) roofs.push(<rect key={`w${x}`} x={x + w * 0.3} y={1240 - h * 0.6} width={18} height={14} fill="#ffcf86" opacity={0.75} />); x += w + 4; }
  return (
    <g>
      <defs>
        <linearGradient id="sbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={BC.sky[0]} /><stop offset="0.3" stopColor={BC.sky[1]} /><stop offset="0.48" stopColor={BC.sky[2]} /><stop offset="0.56" stopColor={BC.sky[3]} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#sbSky)" />
      <rect x={180} y={420} width={120} height={830} fill="#3a2d50" />
      <rect x={880} y={300} width={150} height={950} fill="#2b2344" />
      {roofs}
      <rect x={0} y={1240} width={W} height={260} fill={BC.road} />
      <rect x={0} y={1236} width={W} height={6} fill="#5a4a62" />
      <rect x={0} y={1500} width={W} height={H - 1500} fill="#2c2438" />
      <rect x={0} y={1496} width={W} height={10} fill="#6a5468" />
    </g>
  );
};

/** time-lapse bus and traffic smear on the road behind the shelter (environment: ON ONES) */
export const BusBlur: React.FC<{ t: number }> = ({ t }) => {
  const L = 1500, ph = (t * 2600) % 3400 - 1700;
  const bus = (x: number, o: number, key: string) => (
    <g key={key} opacity={o}>
      <rect x={x} y={760} width={L} height={560} rx={40} fill="#3f4a5c" />
      <rect x={x + 30} y={820} width={L - 60} height={200} rx={10} fill="#ffe2b0" />
      <rect x={x} y={1080} width={L} height={20} fill="#8a5a4a" />
      <rect x={x} y={1290} width={L} height={30} fill="#141018" />
    </g>
  );
  return (
    <g>
      {[0, 1, 2, 3, 4].map((k) => bus(ph - k * 160, k === 0 ? 0.5 : 0.22, `b${k}`))}
      {/* head/tail light streaks of the traffic */}
      {[1350, 1380, 1440].map((y, i) => <rect key={y} x={-100} y={y} width={W + 200} height={i === 1 ? 6 : 4} fill={i === 0 ? '#ff5a4a' : '#fff1d0'} opacity={0.35 + 0.15 * Math.sin(t * 9 + i)} />)}
    </g>
  );
};

export const Shelter: React.FC<{ back?: boolean }> = ({ back }) => back ? (
  <g fill={BC.shelter}>
    <rect x={260} y={560} width={16} height={1000} />
    <rect x={1120} y={560} width={16} height={1000} />
    <rect x={1150} y={760} width={110} height={300} rx={6} fill="#2b2344" />
    <rect x={1162} y={772} width={86} height={170} fill="#c9c2d6" opacity={0.6} />
  </g>
) : (
  <g>
    <defs>
      <radialGradient id="sbTube" cx="0.5" cy="0" r="0.8"><stop offset="0" stopColor="#e8f1ff" stopOpacity={0.35} /><stop offset="1" stopColor="#e8f1ff" stopOpacity={0} /></radialGradient>
    </defs>
    {/* roof slab with a fluorescent tube */}
    <polygon points="200,520 1260,520 1240,580 220,580" fill={BC.shelter} />
    <rect x={560} y={580} width={300} height={10} rx={4} fill="#eef5ff" />
    <polygon points="560,590 860,590 1120,1500 300,1500" fill="url(#sbTube)" />
    {/* bench: seat + two legs */}
    <rect x={420} y={BUS.seat} width={640} height={26} rx={6} fill={BC.shelter} />
    <rect x={420} y={BUS.seat} width={640} height={4} fill="#e8f1ff" opacity={0.4} />
    <rect x={460} y={BUS.seat + 26} width={18} height={170} fill={BC.shelter} />
    <rect x={1000} y={BUS.seat + 26} width={18} height={170} fill={BC.shelter} />
  </g>
);

/** crowd blurring past on the sidewalk in time-lapse, ghosted (people: ON TWOS) */
const CROWD = Array.from({ length: 9 }, (_, i) => ({ x0: (i * 397) % 2600 - 600, dir: i % 2 ? -1 : 1, v: 2600 + (i % 3) * 400, h: 560 + (i % 4) * 30, front: i % 3 === 0, look: { body: ['#2a2236', '#1f1b2c', '#33293f'][i % 3], far: '#17131f', hat: i % 4 === 1 ? 'hijab' as const : null, skirt: i % 4 === 1, phone: i % 2 === 0, bag: i % 5 === 2 ? 'back' as const : null } }));
export const Crowd: React.FC<{ t2: number; front: boolean }> = ({ t2, front }) => (
  <g>
    {CROWD.filter((c) => c.front === front).map((c, i) => {
      const span = 2600;
      const x = -600 + ((((c.x0 + 600 + c.dir * c.v * t2) % span) + span) % span);
      const pose = walkPose(t2 * 13 + i, c.look.phone);
      const y = front ? 1700 : 1520;
      return (
        <g key={i}>
          {[3, 2, 1, 0].map((g) => <Figure key={g} x={x - c.dir * g * 90} y={y} h={front ? c.h * 1.25 : c.h * 0.95} dir={c.dir} pose={pose} look={c.look} opacity={front ? (g === 0 ? 0.3 : 0.1) : g === 0 ? 0.55 : 0.18 / g} />)}
        </g>
      );
    })}
  </g>
);

/** the old man: peci, hunched a little, both hands on a cane, only breathes (t2) */
export const OldMan: React.FC<{ t2: number }> = ({ t2 }) => {
  const br = Math.sin((t2 * Math.PI * 2) / 3.4);
  const pose = { ...seatPose(0.9 * br, 14), lean: 14 + br * 0.8, uaA: 30, faA: 96, uaB: 26, faB: 90, thA: 84, shA: 6, thB: 80, shB: -2 };
  const x = 760, y = BUS.seat + 27 * (BUS.man / 100);
  const s = BUS.man / 100;
  return (
    <g>
      {/* plastic bag beside him on the bench */}
      <path d={`M 600 ${BUS.seat} l 6 -58 l 62 0 l 6 58 Z`} fill="#4a3a44" />
      <path d={`M 618 ${BUS.seat - 58} q 19 -30 38 0`} stroke="#4a3a44" strokeWidth={5} fill="none" />
      {/* cane: from the floor to under his hands */}
      <path d={`M ${x + 40 * s} ${y} L ${x + 34 * s} ${y - 40 * s} q 0 -6 -5 -6`} stroke="#1a1426" strokeWidth={3 * s} fill="none" strokeLinecap="round" />
      <Figure x={x} y={y} h={BUS.man} dir={1} pose={pose} look={{ body: '#2e2632', far: '#1c1722', skin: '#4a3a3e', hat: 'peci', hatCol: '#0b0a10', rim: '#e8f1ff', rimO: 0.4 }} />
    </g>
  );
};
