import React from 'react';
import { Glow, Puff } from './streets_day_kit';

/** EP08 streets, H part: day market (4), grey street behind the barricade (5), the dark room (8). Frame coords. */

/* ---------------- day market (4) ---------------- */
export const MK = { ground: 1330 };
export const DayMarket: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="sdSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8e2d2" /><stop offset="1" stopColor="#d8cdb8" /></linearGradient>
    </defs>
    <rect x={-300} y={-192} width={1900} height={1000} fill="url(#sdSky)" />
    {/* old stone buildings, arched doorways */}
    {Array.from({ length: 8 }, (_, i) => {
      const x = -300 + i * 240, h = 520 + ((i * 97) % 160);
      return (
        <g key={i}>
          <rect x={x} y={MK.ground - 260 - h} width={240} height={h + 260} fill={i % 2 ? '#c9bca2' : '#bfb196'} />
          <path d={`M${x + 70} ${MK.ground - 260} L${x + 70} ${MK.ground - 400} Q${x + 120} ${MK.ground - 460} ${x + 170} ${MK.ground - 400} L${x + 170} ${MK.ground - 260} Z`} fill="#6a5a46" />
          <rect x={x + 90} y={MK.ground - 260 - h + 80} width={60} height={80} fill="#7a6a54" />
        </g>
      );
    })}
    {/* receding stall awnings */}
    {Array.from({ length: 7 }, (_, i) => {
      const x = -260 + i * 260;
      const c = ['#c9433a', '#4a7a8a', '#d9a441', '#6a8a5a'][i % 4];
      return (
        <g key={i}>
          <path d={`M${x} ${MK.ground - 470} L${x + 230} ${MK.ground - 470} L${x + 250} ${MK.ground - 400} L${x - 20} ${MK.ground - 400} Z`} fill={c} />
          {[0, 1, 2, 3].map((k) => <path key={k} d={`M${x - 20 + k * 67} ${MK.ground - 400} q34 18 67 0`} fill={c} />)}
          <rect x={x} y={MK.ground - 400} width={10} height={400} fill="#5a4a3a" /><rect x={x + 220} y={MK.ground - 400} width={10} height={400} fill="#5a4a3a" />
          <rect x={x - 10} y={MK.ground - 160} width={250} height={160} fill="#8a6a44" />
          {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={x + 20 + k * 38} cy={MK.ground - 176} r={18} fill={['#e8a03a', '#c9433a', '#8ab04a'][(i + k) % 3]} />)}
        </g>
      );
    })}
    <rect x={-300} y={MK.ground} width={1900} height={900} fill="#c9b898" />
    {[[0, 1500], [500, 1560], [900, 1480]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={160} ry={16} fill="#b8a684" />)}
  </g>
);

/** the foreground fruit stall (live, in front of the seller) */
export const FruitStall: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 220} y={y - 220} width={440} height={240} fill="#7a5a3a" />
    <rect x={x - 230} y={y - 230} width={460} height={20} fill="#9a7a54" />
    {[[-150, '#e8a03a'], [-50, '#e8a03a'], [50, '#8ab04a'], [150, '#c9433a']].map(([dx, c], i) => (
      <g key={i}>
        <rect x={x + (dx as number) - 48} y={y - 300} width={96} height={80} fill="#a8865a" />
        {[0, 1, 2].map((k) => <circle key={k} cx={x + (dx as number) - 28 + k * 28} cy={y - 306} r={22} fill={c as string} />)}
        <circle cx={x + (dx as number) - 14} cy={y - 330} r={22} fill={c as string} />
      </g>
    ))}
    <ellipse cx={x + 260} cy={y - 250} rx={70} ry={50} fill="#4a7a3a" />
    <path d={`M${x + 200} ${y - 260} Q${x + 260} ${y - 290} ${x + 320} ${y - 250}`} stroke="#2a5a2a" strokeWidth={6} fill="none" />
  </g>
);

/* ---------------- grey street behind the barricade (5) ---------------- */
export const BR = { ground: 1280, wire: 1050 };
export const Barricade: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="sbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a8a8e" /><stop offset="1" stopColor="#c8c2b6" /></linearGradient>
    </defs>
    <rect x={-108} y={-192} width={1296} height={1200} fill="url(#sbSky)" />
    {[[100, 120], [600, 60], [900, 160]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={300} ry={70} fill="#6e6e74" opacity={0.6} />)}
    {/* grey buildings: left wall with a bakery window (right) */}
    <rect x={-108} y={300} width={460} height={1000} fill="#8e8a84" />
    {[420, 620, 820].map((y) => [0, 160].map((dx) => <rect key={`${y}${dx}`} x={-60 + dx} y={y} width={90} height={110} fill="#4a4a50" />))}
    <rect x={720} y={340} width={480} height={960} fill="#9a958c" />
    <rect x={760} y={900} width={260} height={220} fill="#e8d0a0" />
    <rect x={760} y={900} width={260} height={220} fill="none" stroke="#5a5048" strokeWidth={12} />
    <rect x={740} y={860} width={300} height={40} fill="#6a5a4a" />
    {/* far street with distant guards behind the wire */}
    <rect x={352} y={600} width={370} height={700} fill="#b8b2a6" />
    <rect x={-108} y={BR.ground} width={1296} height={900} fill="#a8a296" />
    {/* barbed-wire barricade: X frames + coils */}
    {[380, 520, 660].map((x) => <path key={x} d={`M${x - 50} ${BR.wire + 90} L${x + 50} ${BR.wire - 30} M${x + 50} ${BR.wire + 90} L${x - 50} ${BR.wire - 30}`} stroke="#5a5650" strokeWidth={10} />)}
    {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={340 + i * 24} cy={BR.wire + 20} rx={30} ry={46} fill="none" stroke="#6a6660" strokeWidth={3} />)}
    {Array.from({ length: 30 }, (_, i) => <path key={`b${i}`} d={`M${340 + i * 13} ${BR.wire - 20 + (i % 3) * 30} l6 -6 l6 6`} stroke="#4a4640" strokeWidth={2} fill="none" />)}
  </g>
);

/** distant guard silhouettes behind the wire (no weapons pointed): breathe on twos */
export const Guards: React.FC<{ t2: number }> = ({ t2 }) => (
  <g fill="#3a3a40">
    {[430, 560, 640].map((x, i) => (
      <g key={i} transform={`translate(${x} ${980 + Math.sin(t2 * 1.4 + i) * 1.5})`}>
        <rect x={-14} y={-150} width={28} height={110} rx={10} />
        <rect x={-12} y={-40} width={10} height={60} /><rect x={2} y={-40} width={10} height={60} />
        <circle cx={0} cy={-168} r={16} />
        <rect x={-18} y={-186} width={36} height={10} rx={3} />
      </g>
    ))}
  </g>
);

/** a sun shaft breaking through the grey (environment, ones); a = 0..1 */
export const SunShaft: React.FC<{ a: number }> = ({ a }) => (
  <g opacity={a}>
    <path d="M500 -200 L760 -200 L620 1500 L60 1500 Z" fill="#fff4d8" opacity={0.22} />
    <Glow id="sbSun" x={630} y={-100} rx={360} ry={240} c="#fff4d8" o={0.6} />
  </g>
);

/* ---------------- the dark room (8) ---------------- */
export const RM = { table: 1180 };
export const DarkRoom: React.FC = () => (
  <g>
    <rect x={-108} y={-192} width={1296} height={2400} fill="#0a0b10" />
    <rect x={-108} y={-192} width={1296} height={2400} fill="#12131c" opacity={0.6} />
    <rect x={720} y={300} width={260} height={420} fill="#141824" />
    <rect x={740} y={320} width={220} height={380} fill="#1c2234" />
    <path d="M740 320 L960 700" stroke="#0a0b10" strokeWidth={8} />
  </g>
);

/** table with the unnamed map (no borders, no text) + the lamp; jump = map hop px */
export const MapTable: React.FC<{ jump: number; wob: number }> = ({ jump, wob }) => (
  <g>
    <path d="M80 1180 L1000 1180 L1100 1420 L-20 1420 Z" fill="#2a2018" />
    <g transform={`translate(0 ${-jump})`}>
      <path d="M220 1200 L860 1196 L920 1380 L160 1384 Z" fill="#d8c8a0" />
      <path d="M260 1230 Q340 1210 400 1250 Q470 1300 520 1260 Q600 1200 660 1250 Q720 1300 800 1270 L860 1370 L210 1370 Q240 1300 260 1230 Z" fill="#b8a478" />
      <path d="M300 1300 Q380 1280 440 1320 M560 1300 Q620 1330 700 1310" stroke="#8a7650" strokeWidth={4} fill="none" />
    </g>
    <rect x={-20} y={1420} width={1120} height={800} fill="#08090c" />
    {/* desk lamp (low-left) */}
    <g transform={`rotate(${wob} 180 1200)`}>
      <ellipse cx={180} cy={1200} rx={60} ry={14} fill="#1a1a1e" />
      <path d="M180 1200 L210 1080 L280 1040" stroke="#2a2a30" strokeWidth={10} fill="none" />
      <path d="M250 1020 L330 1060 L300 1100 L230 1060 Z" fill="#3a3a40" />
    </g>
  </g>
);

/** the lamp's light: pool on the map + underlight (ones) */
export const UnderLight: React.FC<{ wob: number; t: number }> = ({ wob, t }) => (
  <g>
    <Glow id="srPool" x={520 + wob * 6} y={1290} rx={460} ry={180} c="#ffd9a0" o={0.55 + 0.02 * Math.sin(t * 17)} mid={0.3} />
    <Glow id="srUp" x={540} y={1000} rx={520} ry={340} c="#ffd9a0" o={0.14} mid={0.3} />
  </g>
);

export { Puff };
