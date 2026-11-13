import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';
import { TC, Passenger } from '../art/train_art';

/** Interior geometry (shot 4): one-point perspective toward VP. */
export const VP = { x: 648, y: 1130 };
const ZS = [1, 1.35, 1.8, 2.4, 3.2, 4.3, 5.8, 7.8];
export const EMPTY_I = 2; // right-side seat index left empty (lit)

const Station = () => (
  <g>
    <defs>
      <linearGradient id="tsSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#040509" /><stop offset="0.6" stopColor={TC.sky} /><stop offset="1" stopColor="#0d111b" />
      </linearGradient>
      <radialGradient id="tsPool" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor={TC.fluo} stopOpacity={0.16} /><stop offset="1" stopColor={TC.fluoFall} stopOpacity={0} />
      </radialGradient>
      <radialGradient id="tsTun" cx="0.5" cy="0.6" r="0.6">
        <stop offset="0" stopColor="#000000" /><stop offset="1" stopColor="#0a0c12" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#tsSky)" />
    {/* back wall */}
    <rect x={0} y={700} width={W} height={820} fill="#0e1118" />
    <rect x={0} y={1180} width={W} height={18} fill="#161a23" />
    {/* canopy + fluorescent tubes */}
    <path d={`M 0 560 L ${W} 560 L ${W} 640 L 0 660 Z`} fill="#0a0c12" />
    {[160, 520, 880].map((x) => (
      <g key={x}>
        <ellipse cx={x + 90} cy={700} rx={260} ry={320} fill="url(#tsPool)" />
        <rect x={x} y={648} width={180} height={12} rx={6} fill={TC.fluo} />
      </g>
    ))}
    {/* tunnel mouth at the right */}
    <path d={`M 1010 1520 L 1010 960 Q 1150 820 1296 860 L 1296 1520 Z`} fill="url(#tsTun)" />
    <path d={`M 1010 1520 L 1010 960 Q 1150 820 1296 860`} stroke="#1d2230" strokeWidth={16} fill="none" />
    {/* signal */}
    <rect x={960} y={1000} width={26} height={60} rx={6} fill="#0a0b10" />
    <circle cx={973} cy={1016} r={8} fill={TC.red} />
    <circle cx={973} cy={1016} r={26} fill={TC.red} opacity={0.18} />
    {/* pillars */}
    {[90, 740].map((x) => <rect key={x} x={x} y={560} width={56} height={960} fill="#0b0d13" />)}
    {/* track bed */}
    <rect x={0} y={1500} width={W} height={60} fill="#07080c" />
    <rect x={0} y={1520} width={W} height={6} fill="#3a4250" opacity={0.6} />
  </g>
);

const Plat = () => (
  <g>
    <defs>
      <linearGradient id="tpC" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={TC.conc2} /><stop offset="1" stopColor="#0c0e13" />
      </linearGradient>
    </defs>
    <rect x={0} y={1548} width={W} height={H - 1548} fill="url(#tpC)" />
    <rect x={0} y={1540} width={W} height={14} fill="#3b404c" />
    <rect x={0} y={1590} width={W} height={16} fill={TC.safety} opacity={0.85} />
    {Array.from({ length: 30 }, (_, i) => <rect key={i} x={i * 46} y={1593} width={22} height={10} fill="#a88d2c" opacity={0.6} />)}
  </g>
);

const Interior = () => {
  const L = 600; // half width at z=1
  const top = 820, bot = 1180; // ceiling/floor distance from VP at z=1
  const px = (side: number, d: number, z: number) => VP.x + (side * d) / z;
  const py = (d: number, z: number) => VP.y + d / z;
  const seats: React.ReactNode[] = [];
  for (let i = ZS.length - 1; i >= 0; i--) {
    const z = ZS[i], s = 1.7 / z;
    for (const side of [-1, 1]) {
      const sx = px(side, 450, z), sy = py(380, z);
      const empty = side === 1 && i === EMPTY_I;
      seats.push(
        <g key={`${i}${side}`}>
          {/* seat back + cushion */}
          <path d={`M ${px(side, L, z)} ${py(-60, z)} L ${px(side, 360, z)} ${py(-20, z)} L ${px(side, 360, z)} ${py(380, z)} L ${px(side, L, z)} ${py(400, z)} Z`} fill={empty ? '#a8402f' : '#3c1f22'} />
          <path d={`M ${px(side, L, z)} ${py(330, z)} L ${px(side, 340, z)} ${py(330, z)} L ${px(side, 340, z)} ${py(400, z)} L ${px(side, L, z)} ${py(420, z)} Z`} fill={empty ? '#c45a40' : '#4a2629'} />
          {!empty && <Passenger x={sx} y={sy} s={s} tilt={-side * 4} />}
        </g>,
      );
    }
  }
  return (
    <g>
      <defs>
        <linearGradient id="tiCeil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6cf9f" /><stop offset="1" stopColor={TC.warm} /></linearGradient>
        <linearGradient id="tiFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a08a68" /><stop offset="1" stopColor="#4c3f30" /></linearGradient>
        <linearGradient id="tiWallL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b79c6e" /><stop offset="1" stopColor={TC.warm2} /></linearGradient>
        <linearGradient id="tiWallR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#b79c6e" /><stop offset="1" stopColor={TC.warm2} /></linearGradient>
        <radialGradient id="tiEnd"><stop offset="0" stopColor="#fffdf6" /><stop offset="1" stopColor={TC.warm} /></radialGradient>
        <radialGradient id="tiSpot"><stop offset="0" stopColor="#fffbe8" stopOpacity={0.95} /><stop offset="1" stopColor="#fff3d6" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={W} height={H} fill={TC.warm} />
      {/* ceiling, floor, walls as perspective quads */}
      <polygon points={`0,0 ${W},0 ${px(1, L, 8)},${py(-top, 8)} ${px(-1, L, 8)},${py(-top, 8)}`} fill="url(#tiCeil)" />
      <polygon points={`0,${H} ${W},${H} ${px(1, L, 8)},${py(bot, 8)} ${px(-1, L, 8)},${py(bot, 8)}`} fill="url(#tiFloor)" />
      <polygon points={`0,0 ${px(-1, L, 8)},${py(-top, 8)} ${px(-1, L, 8)},${py(bot, 8)} 0,${H}`} fill="url(#tiWallL)" />
      <polygon points={`${W},0 ${px(1, L, 8)},${py(-top, 8)} ${px(1, L, 8)},${py(bot, 8)} ${W},${H}`} fill="url(#tiWallR)" />
      {/* end door (glow) */}
      <rect x={px(-1, L, 8)} y={py(-top, 8)} width={(2 * L) / 8} height={(top + bot) / 8} fill="url(#tiEnd)" />
      <rect x={VP.x - 30} y={py(-500, 8)} width={60} height={(500 + bot) / 8} fill="#d8c29a" />
      {/* light strips + dark windows (night outside) */}
      {ZS.map((z, i) => (
        <g key={i}>
          <polygon points={`${px(-1, 160, z)},${py(-top, z)} ${px(1, 160, z)},${py(-top, z)} ${px(1, 160, z * 1.12)},${py(-top, z * 1.12)} ${px(-1, 160, z * 1.12)},${py(-top, z * 1.12)}`} fill="#ffffff" />
          {[-1, 1].map((sd) => (
            <polygon key={sd} points={`${px(sd, L, z)},${py(-560, z)} ${px(sd, L, z * 1.22)},${py(-560, z * 1.22)} ${px(sd, L, z * 1.22)},${py(-120, z * 1.22)} ${px(sd, L, z)},${py(-120, z)}`} fill="#1b1d28" />
          ))}
          {/* hand straps */}
          {[-1, 1].map((sd) => (
            <g key={`h${sd}`} stroke="#8b7656" strokeWidth={6 / z} fill="none">
              <line x1={px(sd, 250, z)} y1={py(-top, z)} x2={px(sd, 250, z)} y2={py(-560, z)} />
              <circle cx={px(sd, 250, z)} cy={py(-530, z)} r={30 / z} />
            </g>
          ))}
        </g>
      ))}
      {/* grab poles */}
      {[1.2, 2.1, 3.6].map((z) => [-1, 1].map((sd) => (
        <rect key={`${z}${sd}`} x={px(sd, 330, z) - 9 / z} y={py(-top, z)} width={18 / z} height={(top + bot) / z} fill="#cdbb95" />
      )))}
      {seats}
      {/* the empty seat, lit from above */}
      <ellipse cx={px(1, 470, ZS[EMPTY_I])} cy={py(180, ZS[EMPTY_I])} rx={260 / ZS[EMPTY_I]} ry={420 / ZS[EMPTY_I]} fill="url(#tiSpot)" />
      {/* floor aisle sheen */}
      <polygon points={`${VP.x - 60},${H} ${VP.x + 60},${H} ${VP.x + 8},${py(bot, 8)} ${VP.x - 8},${py(bot, 8)}`} fill="#d3bd93" opacity={0.35} />
    </g>
  );
};

/** Shot 8 background: the bright carriage wall behind the rows. */
const Wall = () => (
  <g>
    <defs>
      <linearGradient id="twG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fffaf0" /><stop offset="0.5" stopColor={TC.warm} /><stop offset="1" stopColor="#c9ac7c" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#twG)" />
    {[300, 980].map((y) => <rect key={y} x={0} y={y} width={W} height={180} fill="#e9d6ac" />)}
    {[0, 1, 2, 3].map((i) => <rect key={i} x={60 + i * 330} y={330} width={250} height={120} rx={14} fill="#2a2a34" opacity={0.85} />)}
  </g>
);

/** Set "train" (the ghost train: arriving, doors, interior with passengers). Static bands baked ONCE to public/baked/train/<band>.png. Ids "train/<band>". */
export const TRAIN: Record<string, BandSpec> = {
  'train/station': { node: () => <Station /> },
  'train/plat': { node: () => <Plat /> },
  'train/interior': { node: () => <Interior /> },
  'train/wall': { blur: 3, node: () => <Wall /> },
};
