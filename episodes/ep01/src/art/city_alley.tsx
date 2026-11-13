import React from 'react';
import { CITY_PAL, SkyArt, Minaret, MosqueLamp, MIN } from './city_skyline';

/**
 * EP01 city set, shot 6 + birds.
 * Scene coords: 1080 wide, ~2900 tall; the shot tilts down by moving the viewBox (camera, on ones).
 * A kampung alley in one-point perspective ends at the mosque gate; the minaret (with horn loudspeakers) rises behind it.
 */
export const AV = { x: 600, y: 1760 };         // alley vanishing point (eye level)
const LW = 700, RW = 560, GR = 1340, TOP = 760; // per unit depth: left wall dx, right wall dx, ground dy, wall top dy
export const ax = (side: -1 | 1, d: number) => AV.x + (side < 0 ? -LW : RW) * d;
export const gy = (d: number) => AV.y + GR * d;
/** y of height h (m) on a wall/person at depth d (700 px per metre at d = 1) */
export const hy = (d: number, h: number) => gy(d) - h * 700 * d;
/** minaret placement: band minaret (world coords) scaled into the scene */
export const MS = { s: 1.5, tx: 640 - MIN.x * 1.5, ty: 250 - MIN.top * 1.5 };
export const minPt = (x: number, y: number): [number, number] => [MS.tx + x * MS.s, MS.ty + y * MS.s];

const quad = (pts: [number, number][]) => 'M' + pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L') + 'Z';
const wallQuad = (side: -1 | 1, d0: number, d1: number, h0: number, h1: number) => quad([[ax(side, d0), hy(d0, h1)], [ax(side, d1), hy(d1, h1)], [ax(side, d1), hy(d1, h0)], [ax(side, d0), hy(d0, h0)]]);

/** window slots on both walls: [side, d0, d1, warm-lit?] */
export const ALLEY_WINS: [-1 | 1, number, number, boolean][] = [
  [-1, 0.95, 0.75, false], [-1, 0.5, 0.4, true], [-1, 0.3, 0.25, false], [-1, 0.19, 0.16, false],
  [1, 1.0, 0.82, false], [1, 0.62, 0.52, false], [1, 0.38, 0.31, true], [1, 0.24, 0.2, false], [1, 0.15, 0.13, false],
];
const DOORS: [-1 | 1, number, number][] = [[-1, 0.68, 0.56], [-1, 0.36, 0.32], [1, 0.76, 0.66], [1, 0.46, 0.41]];

/** horn loudspeakers on the minaret galleries (minaret/world coords, drawn inside the minaret transform) */
const Speakers: React.FC<{ fill: string; rim: string }> = ({ fill, rim }) => {
  const c = MIN.x;
  const horn = (x: number, y: number, dir: -1 | 1, k: string) => (
    <g key={k}>
      <rect x={dir > 0 ? x : x - 7} y={y - 1.5} width={7} height={3} fill={fill} />
      <path d={`M${x + dir * 6} ${y - 2.5} L${x + dir * 22} ${y - 8} L${x + dir * 22} ${y + 8} L${x + dir * 6} ${y + 2.5} Z`} fill={fill} />
      <path d={`M${x + dir * 22} ${y - 8} L${x + dir * 22} ${y + 8}`} stroke={rim} strokeOpacity={0.6} strokeWidth={1.2} />
    </g>
  );
  return (
    <g>
      <rect x={c - 1.5} y={1008} width={3} height={22} fill={fill} />
      {horn(c + 10, 1016, 1, 'a')}{horn(c - 10, 1016, -1, 'b')}{horn(c + 12, 1030, 1, 'c')}{horn(c - 12, 1030, -1, 'd')}
      {horn(c + 16, 1172, 1, 'e')}{horn(c - 16, 1172, -1, 'f')}
    </g>
  );
};

/** perched / flying bird. fly 0 = perched; flap = phase (rad, on ones) */
export const Bird: React.FC<{ x: number; y: number; s: number; fly: number; flap: number; fill: string; dir?: number }> = ({ x, y, s, fly, flap, fill, dir = 1 }) => {
  if (fly < 0.05) {
    return (
      <g fill={fill}>
        <ellipse cx={x} cy={y - 4 * s} rx={6 * s} ry={4 * s} />
        <circle cx={x + 5 * s * dir} cy={y - 8 * s} r={2.8 * s} />
        <path d={`M${x - 5 * s * dir} ${y - 4 * s} L${x - 12 * s * dir} ${y - 1 * s} L${x - 5 * s * dir} ${y - 2 * s} Z`} />
      </g>
    );
  }
  const w = Math.sin(flap) * 7 * s;
  return (
    <g>
      <path d={`M${x - 15 * s} ${y + w} Q${x - 7 * s} ${y - 5 * s + w * 0.3} ${x} ${y} Q${x + 7 * s} ${y - 5 * s + w * 0.3} ${x + 15 * s} ${y + w}`} stroke={fill} strokeWidth={2.6 * s} fill="none" strokeLinecap="round" />
      <ellipse cx={x} cy={y + 1 * s} rx={3.2 * s} ry={2.2 * s} fill={fill} />
    </g>
  );
};

/** a loose flock crossing the frame (environment, on ones). (x0, y0) start, vx px/s, spread */
export const Flock: React.FC<{ t: number; x0: number; y0: number; vx: number; vy?: number; n?: number; s?: number; fill: string; seed?: number }> = ({ t, x0, y0, vx, vy = -6, n = 5, s = 1, fill, seed = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const r = Math.sin((i + 1) * 12.9898 * seed) * 43758.5453; const fr = r - Math.floor(r);
      const x = x0 + vx * t - i * 46 * s * Math.sign(vx) + fr * 30 * s;
      const y = y0 + vy * t + (i % 2 ? 18 : -10) * s * (1 + fr) + Math.sin(t * 1.3 + i) * 6 * s;
      return <Bird key={i} x={x} y={y} s={s * (0.8 + fr * 0.4)} fly={1} flap={t * (11 + fr * 4) + i * 1.7} fill={fill} />;
    })}
  </g>
);

/** old man from behind: baju koko, sarong, peci, prayer mat folded over the left shoulder. ph = walk phase (on twos). */
export const OldMan: React.FC<{ x: number; y: number; h: number; ph: number; rim: string }> = ({ x, y, h, ph, rim }) => {
  const u = h / 7;
  const bob = -Math.abs(Math.cos(ph)) * u * 0.05;
  const stoop = u * 0.12;
  const shY = y - h * 0.8 + bob, waistY = y - h * 0.48 + bob;
  const shW = u * 0.95, waistW = u * 0.62;
  const sw = Math.sin(ph);
  const cx = x + stoop * 0.3;
  const head: [number, number] = [cx + stoop * 0.1, shY - u * 0.58];
  // feet: alternate heel lift (sole shows, foot rises)
  const foot = (side: -1 | 1) => { const lift = Math.max(0, side * sw) * u * 0.32; return <path key={side} d={`M${x + side * u * 0.28 - u * 0.17} ${y - lift - u * 0.12} h${u * 0.34} l${-u * 0.02} ${u * 0.14} h${-u * 0.3} Z`} fill="#1a1414" />; };
  const handR: [number, number] = [cx + shW * 1.05 + sw * u * 0.25, waistY + u * 0.55];
  return (
    <g>
      {foot(-1)}{foot(1)}
      {/* sarong with checks, hem swaying with the stride */}
      <path d={`M${cx - waistW} ${waistY} L${cx + waistW} ${waistY} L${x + u * 0.62 + sw * u * 0.08} ${y - u * 0.12} L${x - u * 0.62 + sw * u * 0.08} ${y - u * 0.12} Z`} fill="#43344a" />
      {[0.25, 0.5, 0.75].map((f) => <path key={f} d={`M${cx - waistW - u * 0.05 * f} ${waistY + (y - waistY) * f} L${cx + waistW + u * 0.05 * f} ${waistY + (y - waistY) * f}`} stroke="#5a4860" strokeWidth={u * 0.05} />)}
      {[-0.3, 0.05, 0.4].map((f) => <path key={f} d={`M${cx + waistW * f} ${waistY} L${x + u * 0.62 * f * 1.3 + sw * u * 0.08} ${y - u * 0.12}`} stroke="#2f2434" strokeWidth={u * 0.04} />)}
      {/* baju koko */}
      <path d={`M${cx - shW} ${shY + u * 0.12} Q${cx} ${shY - u * 0.12} ${cx + shW} ${shY + u * 0.12} L${cx + waistW * 1.12} ${waistY + u * 0.2} L${cx - waistW * 1.12} ${waistY + u * 0.2} Z`} fill="#8f8a96" />
      {/* right arm swinging */}
      <path d={`M${cx + shW * 0.9} ${shY + u * 0.15} L${cx + shW * 1.12 + sw * u * 0.12} ${shY + u * 1.25} L${handR[0]} ${handR[1]}`} stroke="#8f8a96" strokeWidth={u * 0.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={handR[0]} cy={handR[1] + u * 0.12} r={u * 0.13} fill="#5e4034" />
      {/* left arm bent up holding the mat in front (only the elbow shows) */}
      <path d={`M${cx - shW * 0.9} ${shY + u * 0.15} L${cx - shW * 1.15} ${shY + u * 1.0} L${cx - shW * 0.6} ${shY + u * 0.55}`} stroke="#8f8a96" strokeWidth={u * 0.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* prayer mat folded over the left shoulder, hanging down the back */}
      <path d={`M${cx - shW * 0.85} ${shY - u * 0.02} L${cx - shW * 0.15} ${shY - u * 0.06} L${cx - shW * 0.2 + sw * u * 0.03} ${shY + u * 1.55} L${cx - shW * 0.82 + sw * u * 0.03} ${shY + u * 1.58} Z`} fill="#6a2a34" />
      <path d={`M${cx - shW * 0.78 + sw * u * 0.03} ${shY + u * 1.45} L${cx - shW * 0.24 + sw * u * 0.03} ${shY + u * 1.43}`} stroke="#c9a24e" strokeWidth={u * 0.05} />
      <path d={`M${cx - shW * 0.8} ${shY + u * 0.05} L${cx - shW * 0.8 + sw * u * 0.03} ${shY + u * 1.5}`} stroke="#c9a24e" strokeOpacity={0.6} strokeWidth={u * 0.03} />
      {/* neck, head, peci */}
      <rect x={head[0] - u * 0.17} y={shY - u * 0.25} width={u * 0.34} height={u * 0.3} fill="#5e4034" />
      <ellipse cx={head[0]} cy={head[1]} rx={u * 0.4} ry={u * 0.48} fill="#5e4034" />
      <path d={`M${head[0] - u * 0.38} ${head[1] + u * 0.12} Q${head[0]} ${head[1] + u * 0.3} ${head[0] + u * 0.38} ${head[1] + u * 0.12}`} stroke="#c9c2b4" strokeWidth={u * 0.07} fill="none" />
      <path d={`M${head[0] - u * 0.39} ${head[1] - u * 0.05} L${head[0] - u * 0.36} ${head[1] - u * 0.44} L${head[0] + u * 0.36} ${head[1] - u * 0.44} L${head[0] + u * 0.39} ${head[1] - u * 0.05} Z`} fill="#121014" />
      {/* warm rim from the lit gate ahead */}
      <g stroke={rim} strokeOpacity={0.75} fill="none" strokeLinecap="round" strokeWidth={u * 0.05}>
        <path d={`M${head[0] - u * 0.36} ${head[1] - u * 0.44} L${head[0] + u * 0.36} ${head[1] - u * 0.44}`} />
        <path d={`M${cx - shW * 0.15} ${shY - u * 0.06} L${cx - shW * 0.85} ${shY - u * 0.02}`} />
        <path d={`M${cx + shW * 0.2} ${shY - u * 0.03} Q${cx + shW * 0.8} ${shY} ${cx + shW} ${shY + u * 0.2}`} />
        <path d={`M${head[0] + u * 0.4} ${head[1] - u * 0.05} Q${head[0] + u * 0.42} ${head[1] + u * 0.3} ${head[0] + u * 0.2} ${head[1] + u * 0.46}`} />
      </g>
    </g>
  );
};

/**
 * The alley scene (everything but the man): sky, minaret + speakers + lamp, perched/lifting birds, rooftops,
 * walls with doors and windows, mosque gate, cables, wall lamp. `lamp` 0..1, `lift` = seconds since "rises" (<0 = perched),
 * `phones(i)` = 0..1 cool phone glow in window slot i. `skyDy` = sky parallax offset.
 */
export const Alley: React.FC<{ t: number; lamp: number; lift: number; phones: (i: number) => number; skyDy: number }> = ({ t, lamp, lift, phones, skyDy }) => {
  const P = CITY_PAL.dawn;
  const wall = '#2c2d4c', wallR = '#34355a', eave = '#14152a', winD = '#151629', ground = '#3b3955';
  const perched: [number, number, number][] = [[MIN.x - 22, 978, 1], [MIN.x - 4, 978, -1], [MIN.x + 18, 978, 1], [MIN.x - 30, 1136, 1], [MIN.x + 26, 1136, -1]];
  return (
    <g>
      <defs>
        <linearGradient id="alGround" gradientUnits="userSpaceOnUse" x1="0" y1={gy(0.1)} x2="0" y2={gy(1.2)}><stop offset="0" stopColor="#8a6a72" /><stop offset="0.35" stopColor={ground} /><stop offset="1" stopColor="#1d1d33" /></linearGradient>
        <radialGradient id="alGate" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd9a0" stopOpacity={0.75} /><stop offset="1" stopColor="#ffd9a0" stopOpacity={0} /></radialGradient>
        <radialGradient id="alPhone" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#bfe3ff" stopOpacity={0.7} /><stop offset="1" stopColor="#bfe3ff" stopOpacity={0} /></radialGradient>
        <radialGradient id="alWarm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffcf86" stopOpacity={0.55} /><stop offset="1" stopColor="#ffcf86" stopOpacity={0} /></radialGradient>
      </defs>
      <g transform={`translate(-108 ${430 + skyDy})`}><SkyArt m="dawn" /></g>
      {/* minaret (hero of the first half) */}
      <g transform={`translate(${MS.tx} ${MS.ty}) scale(${MS.s})`}>
        <Minaret p={P} />
        <Speakers fill={P.mid} rim={P.rim} />
        <MosqueLamp on={lamp} p={P} arches={0} />
        {perched.map(([bx, by, dir], i) => {
          const dt = lift - i * 0.07;
          const fly = dt > 0 ? 1 : 0;
          const x = bx + (dt > 0 ? (dir > 0 ? 1 : -1) * (40 * dt + 30 * dt * dt) : 0);
          const y = by - (dt > 0 ? 60 * dt + 50 * dt * dt : 0);
          return <Bird key={i} x={x} y={y} s={0.9} fly={fly} flap={t * 14 + i} fill={P.near} dir={dir} />;
        })}
      </g>
      {/* rooftops beyond the alley walls */}
      <path d={`M-20 ${hy(0.55, 3.6)} L180 ${hy(0.4, 4.2)} L330 ${hy(0.3, 3.9)} L420 ${hy(0.22, 4.6)} L500 ${hy(0.15, 4.0)} L540 ${hy(0.12, 3.4)} L540 ${gy(0.1)} L-20 ${gy(0.5)} Z`} fill="#1d1e38" />
      <path d={`M1100 ${hy(0.6, 3.8)} L950 ${hy(0.42, 4.4)} L840 ${hy(0.3, 3.8)} L760 ${hy(0.2, 4.5)} L690 ${hy(0.14, 3.6)} L660 ${hy(0.12, 3.3)} L660 ${gy(0.1)} L1100 ${gy(0.5)} Z`} fill="#1d1e38" />
      <rect x={870} y={hy(0.32, 5.4)} width={4} height={hy(0.32, 3.8) - hy(0.32, 5.4)} fill="#1d1e38" />
      {[0, 1, 2].map((i) => <rect key={i} x={856 + i * 3} y={hy(0.32, 5.3) + i * 9} width={32 - i * 6} height={3} fill="#1d1e38" />)}
      {/* mosque gate at the end of the alley, warm light spilling */}
      <ellipse cx={AV.x} cy={gy(0.1) - 60} rx={260} ry={190} fill="url(#alGate)" />
      <rect x={AV.x - 105} y={hy(0.1, 3.1)} width={210} height={gy(0.1) - hy(0.1, 3.1)} fill="#3a3352" />
      <path d={`M${AV.x - 34} ${gy(0.1)} V${hy(0.1, 1.9)} A34 34 0 0 1 ${AV.x + 34} ${hy(0.1, 1.9)} V${gy(0.1)} Z`} fill="#ffd28e" />
      <rect x={AV.x - 115} y={hy(0.1, 3.2)} width={230} height={9} fill="#2a2440" />
      {/* ground with gutters */}
      <path d={quad([[ax(-1, 0.1), gy(0.1)], [ax(1, 0.1), gy(0.1)], [ax(1, 1.4), gy(1.4)], [ax(-1, 1.4), gy(1.4)]])} fill="url(#alGround)" />
      {[-1, 1].map((sd) => <path key={sd} d={quad([[ax(sd as -1 | 1, 0.1), gy(0.1)], [ax(sd as -1 | 1, 0.1) - sd * 8, gy(0.1)], [ax(sd as -1 | 1, 1.4) - sd * 100, gy(1.4)], [ax(sd as -1 | 1, 1.4), gy(1.4)]])} fill="#121226" />)}
      {/* walls */}
      <path d={wallQuad(-1, 1.6, 0.1, 0, 2.6)} fill={wall} />
      <path d={wallQuad(1, 1.6, 0.1, 0, 2.6)} fill={wallR} />
      {/* house seams (pillars) */}
      {[0.84, 0.54, 0.34, 0.22].map((d, i) => [-1, 1].map((sd) => <path key={`${i}${sd}`} d={wallQuad(sd as -1 | 1, d + 0.006, d, 0, 2.6)} fill={eave} opacity={0.6} />))}
      {DOORS.map(([sd, d0, d1], i) => <path key={i} d={wallQuad(sd, d0, d1, 0, 2.05)} fill="#1a1a30" />)}
      {ALLEY_WINS.map(([sd, d0, d1, warm], i) => {
        const ph = phones(i);
        const [x0, x1] = [ax(sd, d0), ax(sd, d1)]; const ymid = (hy(d0, 1.45) + hy(d1, 1.45)) / 2; const r = Math.abs(x1 - x0);
        return (
          <g key={i}>
            <path d={wallQuad(sd, d0, d1, 0.95, 1.85)} fill={warm ? '#e9b874' : winD} />
            {warm && <ellipse cx={(x0 + x1) / 2} cy={ymid} rx={r * 1.4} ry={r * 1.3} fill="url(#alWarm)" />}
            {ph > 0.01 && <g opacity={ph}><ellipse cx={(x0 + x1) / 2} cy={ymid} rx={r * 0.9} ry={r * 0.8} fill="url(#alPhone)" /><rect x={(x0 + x1) / 2 - r * 0.07} y={ymid - r * 0.1} width={r * 0.14} height={r * 0.22} fill="#dff1ff" /></g>}
            <path d={wallQuad(sd, (d0 + d1) / 2 + 0.004, (d0 + d1) / 2, 0.95, 1.85)} fill={eave} />
            <path d={wallQuad(sd, d0, d1, 1.85, 1.92)} fill={eave} />
          </g>
        );
      })}
      {/* eaves overhanging the alley */}
      {[-1, 1].map((sd) => <path key={sd} d={quad([[ax(sd as -1 | 1, 1.6), hy(1.6, 2.6)], [ax(sd as -1 | 1, 0.1), hy(0.1, 2.6)], [ax(sd as -1 | 1, 0.1) - sd * 6, hy(0.1, 2.68)], [ax(sd as -1 | 1, 1.6) - sd * 90, hy(1.6, 2.68)]])} fill={eave} />)}
      {/* potted plants and a parked scooter (low detail) */}
      {[[-1, 0.62], [1, 0.5], [-1, 0.27]].map(([sd, d], i) => { const x = ax(sd as -1 | 1, d) - sd * 30 * d; return <g key={i} fill="#15162a"><path d={`M${x - 22 * d} ${gy(d)} l${44 * d} 0 l${-6 * d} ${-48 * d} l${-32 * d} 0 Z`} /><ellipse cx={x} cy={gy(d) - 70 * d} rx={46 * d} ry={34 * d} /></g>; })}
      <g fill="#14152a">
        <ellipse cx={ax(1, 0.7) - 150} cy={gy(0.7) - 30} rx={36} ry={36} /><ellipse cx={ax(1, 0.7) - 330} cy={gy(0.7) - 30} rx={36} ry={36} />
        <path d={`M${ax(1, 0.7) - 360} ${gy(0.7) - 60} L${ax(1, 0.7) - 140} ${gy(0.7) - 70} L${ax(1, 0.7) - 170} ${gy(0.7) - 170} L${ax(1, 0.7) - 290} ${gy(0.7) - 130} Z`} />
      </g>
      {/* wall lamp + overhead cables against the sky strip */}
      <rect x={ax(1, 0.35) - 30} y={hy(0.35, 2.6)} width={30} height={5} fill={eave} />
      <circle cx={ax(1, 0.35) - 30} cy={hy(0.35, 2.55)} r={6} fill="#ffe0a8" />
      <circle cx={ax(1, 0.35) - 30} cy={hy(0.35, 2.55)} r={40} fill="url(#alWarm)" />
      {[[0.9, 0.5, 40], [0.7, 0.3, 30], [0.55, 0.22, 24]].map(([da, db, sg], i) => <path key={i} d={`M${ax(-1, da)} ${hy(da, 2.62)} Q${(ax(-1, da) + ax(1, db)) / 2} ${(hy(da, 2.62) + hy(db, 2.62)) / 2 + sg + Math.sin(t * 1.2 + i) * 2} ${ax(1, db)} ${hy(db, 2.62)}`} stroke="#14152a" strokeWidth={2.5} fill="none" />)}
    </g>
  );
};
