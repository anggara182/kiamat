import React from 'react';
import { W, H, rng } from './world';

/**
 * EP03 set "cityhall": one civic building (wide steps, colonnade, pediment, clock tower) drawn in three states:
 * burning at night, ruined at an ash dawn, dark at night. Fire, smoke, embers, ash and people are live.
 * World 1296x2304 (frame window 108..1188 x 192..2112).
 */
export const CH = { cx: 648, plaza: 1500, stylo: 1380, colTop: 1020, entTop: 960, apex: 840, cols: 8, colX0: 330, colX1: 966, colW: 46, tower: { x0: 600, x1: 696, top: 520, clockY: 640 } };
export const colXs = Array.from({ length: CH.cols }).map((_, i) => CH.colX0 + (i * (CH.colX1 - CH.colX0 - CH.colW)) / (CH.cols - 1));

export type HallState = 'fire' | 'ruin' | 'dark';
type HP = { sky: string[]; body: string; face: string; col: string; colLit: string; win: string; step: string; ground: string; rim: string; rimO: number };
const PAL: Record<HallState, HP> = {
  fire: { sky: ['#06080f', '#120c16', '#3a1a14'], body: '#140c10', face: '#24141a', col: '#2e1a1a', colLit: '#7a3a22', win: '#ff9a3a', step: '#2a1814', ground: '#1a100e', rim: '#ffb060', rimO: 0.8 },
  ruin: { sky: ['#4a4652', '#857a82', '#b9a59a'], body: '#2a2428', face: '#3a3236', col: '#4e4648', colLit: '#9a8a80', win: '#a8988e', step: '#5a5254', ground: '#8a8080', rim: '#ffd8a8', rimO: 0.6 },
  dark: { sky: ['#05070f', '#0b0f1c', '#1a1424'], body: '#0a0b12', face: '#11121c', col: '#161824', colLit: '#232838', win: '#0c0d14', step: '#141620', ground: '#0d0e16', rim: '#5a6a90', rimO: 0.35 },
};

/** broken column heights for the ruin (fraction of full); index 6 = the last column standing whole */
const BROKEN = [0.35, 0.62, 0.18, 0.5, 0.0, 0.42, 1.0, 0.27];

export const CityHall: React.FC<{ st: HallState }> = ({ st }) => {
  const p = PAL[st]; const c = CH; const ruin = st === 'ruin';
  const r = rng(5);
  return (
    <g>
      <defs>
        <linearGradient id={`chSky-${st}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={c.plaza}>
          <stop offset="0" stopColor={p.sky[0]} /><stop offset="0.6" stopColor={p.sky[1]} /><stop offset="1" stopColor={p.sky[2]} />
        </linearGradient>
        <linearGradient id={`chGr-${st}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.step} /><stop offset="1" stopColor={p.ground} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#chSky-${st})`} />
      {ruin && <circle cx={980} cy={1180} r={200} fill="#ffd8a8" opacity={0.35} />}
      {ruin && <circle cx={980} cy={1180} r={70} fill="#ffe6c4" opacity={0.75} />}
      {/* city beyond: low towers silhouettes */}
      <path d={`M-20 ${c.plaza} V1180 ${Array.from({ length: 16 }).map((_, i) => { const x = i * 84; const y = 1060 + ((i * 53) % 170); return `H${x} V${y} H${x + 62} V${y + 40}`; }).join(' ')} H${W + 20} V${c.plaza} Z`} fill={st === 'ruin' ? '#6a6068' : st === 'fire' ? '#0c0a10' : '#0c0e18'} opacity={0.9} />
      {/* side wings */}
      <rect x={40} y={1100} width={240} height={c.stylo - 1100} fill={p.body} />
      <rect x={1016} y={1100} width={240} height={c.stylo - 1100} fill={p.body} />
      {[80, 150, 220, 1056, 1126, 1196].map((x) => <rect key={x} x={x} y={1170} width={36} height={ruin ? 70 : 90} fill={p.win} opacity={st === 'dark' ? 1 : 0.85} />)}
      {/* main block behind the colonnade */}
      <rect x={270} y={ruin ? 1080 : c.entTop} width={756} height={c.stylo - (ruin ? 1080 : c.entTop)} fill={p.face} />
      {ruin && <path d="M270 1080 L330 1030 L420 1090 L520 1040 L640 1100 L760 1020 L880 1080 L960 1050 L1026 1080 Z" fill={p.face} />}
      {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={318 + i * 96} y={1100} width={46} height={200} fill={p.win} opacity={st === 'dark' ? 1 : 0.9} />)}
      {/* clock tower */}
      {!ruin && (
        <g>
          <rect x={c.tower.x0} y={c.tower.top} width={c.tower.x1 - c.tower.x0} height={c.apex - c.tower.top + 40} fill={p.body} />
          <polygon points={`${c.tower.x0 - 12},${c.tower.top} ${c.cx},${c.tower.top - 100} ${c.tower.x1 + 12},${c.tower.top}`} fill={p.body} />
          <rect x={c.cx - 2} y={c.tower.top - 140} width={4} height={44} fill={p.body} />
          <circle cx={c.cx} cy={c.tower.clockY} r={36} fill={st === 'fire' ? '#ffcf6a' : '#3a3c48'} opacity={st === 'fire' ? 0.85 : 1} />
          <path d={`M${c.cx} ${c.tower.clockY} V${c.tower.clockY - 26} M${c.cx} ${c.tower.clockY} L${c.cx + 18} ${c.tower.clockY + 6}`} stroke={p.body} strokeWidth={4} />
          <rect x={c.cx - 18} y={720} width={36} height={60} fill={p.win} opacity={0.8} />
        </g>
      )}
      {/* pediment + entablature */}
      {!ruin && <polygon points={`${c.colX0 - 40},${c.entTop} ${c.cx},${c.apex} ${c.colX1 + 40},${c.entTop}`} fill={p.body} />}
      {!ruin && <rect x={c.colX0 - 46} y={c.entTop} width={c.colX1 - c.colX0 + 92} height={c.colTop - c.entTop} fill={p.body} />}
      {ruin && <rect x={colXs[5] - 10} y={c.colTop - 10} width={colXs[7] - colXs[5] + c.colW + 20} height={40} fill={p.body} transform={`rotate(-4 ${colXs[6]} ${c.colTop})`} opacity={0} />}
      {/* columns */}
      {colXs.map((x, i) => {
        const full = c.stylo - c.colTop;
        const hgt = ruin ? full * BROKEN[i] : full;
        if (hgt <= 0) return null;
        const top = c.stylo - hgt;
        return (
          <g key={i}>
            <rect x={x} y={top} width={c.colW} height={hgt} fill={p.col} />
            <rect x={x} y={top} width={c.colW * 0.35} height={hgt} fill={p.colLit} opacity={0.7} />
            {[0.33, 0.66].map((f) => <rect key={f} x={x + c.colW * f} y={top} width={2} height={hgt} fill={p.body} opacity={0.5} />)}
            {(!ruin || BROKEN[i] === 1) && <rect x={x - 8} y={top - 2} width={c.colW + 16} height={14} fill={p.col} />}
            {ruin && BROKEN[i] < 1 && <path d={`M${x} ${top} L${x + c.colW * 0.3} ${top - 14} L${x + c.colW * 0.6} ${top + 6} L${x + c.colW} ${top - 10} L${x + c.colW} ${top + 4} L${x} ${top + 4} Z`} fill={p.col} />}
            <rect x={x - 6} y={c.stylo - 16} width={c.colW + 12} height={16} fill={p.col} />
          </g>
        );
      })}
      {/* stylobate + wide steps */}
      <rect x={c.colX0 - 70} y={c.stylo} width={c.colX1 - c.colX0 + 140} height={18} fill={p.step} />
      {Array.from({ length: 6 }).map((_, i) => { const w = 780 + i * 44; return <rect key={i} x={c.cx - w / 2} y={c.stylo + 18 + i * 17} width={w} height={17} fill={p.step} opacity={0.95 - i * 0.04} />; })}
      {Array.from({ length: 6 }).map((_, i) => { const w = 780 + i * 44; return <rect key={`l${i}`} x={c.cx - w / 2} y={c.stylo + 18 + i * 17} width={w} height={2} fill={p.rim} opacity={p.rimO * 0.25} />; })}
      <rect x={0} y={c.plaza} width={W} height={H - c.plaza} fill={`url(#chGr-${st})`} />
      {/* ruin: collapsed clock tower as a rubble slope with the fallen clock face, scattered blocks, ash */}
      {ruin && (
        <g>
          <path d={`M${c.cx - 330} ${c.stylo + 30} Q${c.cx - 150} 1160 ${c.cx + 40} 1180 Q${c.cx + 210} 1220 ${c.cx + 290} ${c.stylo + 40} Z`} fill="#3a3236" />
          <rect x={c.cx - 50} y={1120} width={96} height={180} fill={p.body} transform={`rotate(-14 ${c.cx} 1300)`} />
          <ellipse cx={c.cx + 120} cy={1270} rx={40} ry={26} fill="#5a5458" transform={`rotate(-20 ${c.cx + 120} 1270)`} />
          <path d={`M${c.cx + 120} 1270 l0 -22 M${c.cx + 120} 1270 l16 6`} stroke={p.body} strokeWidth={4} />
          {Array.from({ length: 24 }).map((_, i) => { const x = 200 + r() * 900, y = c.stylo + 30 + r() * 220, s = 10 + r() * 26; return <rect key={i} x={x} y={y} width={s * 1.6} height={s} fill={r() < 0.5 ? '#4a4246' : '#3a3438'} transform={`rotate(${r() * 40 - 20} ${x} ${y})`} />; })}
          <rect x={colXs[6] - 6} y={c.colTop - 22} width={c.colW + 30} height={22} fill={p.col} />
          <path d={`M${colXs[6] - c.colW * 0.1} ${c.stylo} V${c.colTop}`} stroke={p.rim} strokeOpacity={0.8} strokeWidth={3} />
        </g>
      )}
      {/* fire: scorched light on the steps */}
      {st === 'fire' && <rect x={c.colX0 - 70} y={c.stylo} width={c.colX1 - c.colX0 + 140} height={120} fill="#ff8a2a" opacity={0.12} />}
    </g>
  );
};

/* ------------------------------------------------------------------ live: fire, smoke, embers, ash */
/** fire base points along the building (world): [x, y, size] */
export const FIRE_PTS: [number, number, number][] = [
  ...colXs.map((x, i): [number, number, number] => [x + 23, CH.colTop + 40 + (i % 2) * 30, 0.9]),
  [CH.cx, CH.apex + 30, 1.6], [CH.cx - 160, CH.entTop - 10, 1.2], [CH.cx + 160, CH.entTop - 10, 1.2], [CH.cx, CH.tower.top + 40, 1.3],
  [110, 1110, 1.1], [200, 1110, 0.9], [1100, 1110, 1.0], [1190, 1110, 1.2], [420, 1250, 0.8], [880, 1250, 0.8],
];
/** flickering flame tongue; f = flare multiplier */
const tongue = (x: number, y: number, s: number, t: number, ph: number, f: number) => {
  const h = (110 + 50 * Math.sin(t * 9 + ph) + 30 * Math.sin(t * 23 + ph * 2)) * s * f;
  const w = 46 * s * (0.85 + 0.15 * Math.sin(t * 13 + ph));
  const lean = Math.sin(t * 5 + ph) * 18 * s;
  return `M${x - w} ${y} Q${x - w * 0.9} ${y - h * 0.45} ${x + lean * 0.5 - w * 0.2} ${y - h * 0.7} Q${x + lean} ${y - h * 0.85} ${x + lean * 1.3} ${y - h} Q${x + w * 0.4} ${y - h * 0.55} ${x + w} ${y} Z`;
};
export const Fire: React.FC<{ t: number; flare: number; pts?: [number, number, number][] }> = ({ t, flare, pts = FIRE_PTS }) => (
  <g>
    <defs>
      <radialGradient id="fiGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb050" stopOpacity={0.55} /><stop offset="1" stopColor="#ff6a1a" stopOpacity={0} /></radialGradient>
    </defs>
    {pts.map(([x, y, s], i) => <ellipse key={`g${i}`} cx={x} cy={y - 60 * s} rx={200 * s * flare} ry={170 * s * flare} fill="url(#fiGlow)" opacity={0.7 + 0.3 * Math.sin(t * 7 + i)} />)}
    {pts.map(([x, y, s], i) => (
      <g key={i}>
        <path d={tongue(x - 28 * s, y, s * 0.8, t, i * 1.7, flare)} fill="#e0521a" />
        <path d={tongue(x + 26 * s, y, s * 0.85, t, i * 2.3 + 1, flare)} fill="#ff8a2a" />
        <path d={tongue(x, y, s, t, i * 1.1 + 2, flare)} fill="#ff9a32" />
        <path d={tongue(x, y, s * 0.55, t, i * 3.1 + 0.5, flare)} fill="#ffcf6a" />
      </g>
    ))}
  </g>
);
/** rising smoke plumes; lit = orange underside strength */
export const Smoke: React.FC<{ t: number; srcs: [number, number][]; col: string; lit: string; litO: number; scale?: number; rise?: number; drift?: number }> = ({ t, srcs, col, lit, litO, scale = 1, rise = 120, drift = 30 }) => (
  <g>
    {srcs.map(([sx, sy], j) => Array.from({ length: 6 }).map((_, i) => {
      const k = ((t * 0.18 + i / 6 + j * 0.13) % 1);
      const x = sx + k * drift * 6 + Math.sin(k * 5 + j) * 30;
      const y = sy - k * rise * 7;
      const rr = (90 + k * 260) * scale;
      return (
        <g key={`${j}-${i}`} opacity={Math.min(1, k * 4) * (1 - k) * 0.9}>
          <ellipse cx={x} cy={y} rx={rr} ry={rr * 0.7} fill={col} />
          <ellipse cx={x} cy={y + rr * 0.3} rx={rr * 0.8} ry={rr * 0.35} fill={lit} opacity={litO * (1 - k)} />
        </g>
      );
    }))}
  </g>
);
/** embers rising (or ash falling when dir = 1) */
export const Particles: React.FC<{ t: number; n: number; seed: number; x0: number; x1: number; y0: number; y1: number; dir: -1 | 1; col: string; size: number; speed: number }> = ({ t, n, seed, x0, x1, y0, y1, dir, col, size, speed }) => {
  const r = rng(seed);
  const ps = Array.from({ length: n }).map(() => ({ x: x0 + r() * (x1 - x0), ph: r(), v: 0.6 + r() * 0.8, s: 0.5 + r(), w: r() * 6 }));
  return (
    <g fill={col}>
      {ps.map((q, i) => {
        const k = (q.ph + t * speed * q.v) % 1;
        const y = dir < 0 ? y1 - k * (y1 - y0) : y0 + k * (y1 - y0);
        const x = q.x + Math.sin(t * 2 + q.w) * 30 + (dir < 0 ? k * 60 : 0);
        return <circle key={i} cx={x} cy={y} r={size * q.s} opacity={Math.sin(k * Math.PI)} />;
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ people */
/** a row of protest silhouettes from behind, arms raised/pumping (on twos). y = feet line */
export const CrowdBacks: React.FC<{ y: number; n: number; s: number; t2: number; seed: number; fill: string; rim: string; rimO: number; x0?: number; x1?: number }> = ({ y, n, s, t2, seed, fill, rim, rimO, x0 = -60, x1 = W + 60 }) => {
  const r = rng(seed);
  const ppl = Array.from({ length: n }).map((_, i) => ({ x: x0 + ((i + r() * 0.6) / n) * (x1 - x0), h: (0.9 + r() * 0.25) * s, arm: r(), ph: r() * 6, hijab: r() < 0.3, sign: r() < 0.12 }));
  return (
    <g>
      {ppl.map((q, i) => {
        const hh = 520 * q.h, u = hh / 7, x = q.x;
        const pump = Math.max(0, Math.sin(t2 * 4 + q.ph));
        const shY = y - hh * 0.8, headY = shY - u * 0.6;
        const raise = q.arm < 0.55;
        const hand = (sd: -1 | 1) => raise && (sd === 1 || q.arm < 0.25) ? [x + sd * u * 0.9, shY - u * (1.6 + 0.6 * pump)] : [x + sd * u * 1.05, shY + u * 1.6];
        return (
          <g key={i}>
            <path d={`M${x - u * 0.95} ${shY + u * 0.1} Q${x} ${shY - u * 0.2} ${x + u * 0.95} ${shY + u * 0.1} L${x + u * 0.75} ${y + 400} L${x - u * 0.75} ${y + 400} Z`} fill={fill} />
            {([-1, 1] as const).map((sd) => { const h = hand(sd); return <path key={sd} d={`M${x + sd * u * 0.8} ${shY + u * 0.15} L${(x + sd * u * 0.8 + h[0]) / 2 + sd * u * 0.25} ${(shY + h[1]) / 2} L${h[0]} ${h[1]}`} stroke={fill} strokeWidth={u * 0.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />; })}
            {raise && <circle cx={hand(1)[0]} cy={hand(1)[1]} r={u * 0.18} fill={fill} />}
            {q.sign && <g><rect x={hand(1)[0] - 2} y={hand(1)[1] - u * 1.6} width={4} height={u * 1.6} fill={fill} /><rect x={hand(1)[0] - u * 0.9} y={hand(1)[1] - u * 2.6} width={u * 1.8} height={u * 1.1} fill={fill} /></g>}
            {q.hijab ? <path d={`M${x - u * 0.5} ${headY} Q${x - u * 0.55} ${headY - u * 0.7} ${x} ${headY - u * 0.62} Q${x + u * 0.55} ${headY - u * 0.7} ${x + u * 0.5} ${headY} Q${x + u * 0.8} ${shY + u * 0.2} ${x} ${shY + u * 0.3} Q${x - u * 0.8} ${shY + u * 0.2} ${x - u * 0.5} ${headY} Z`} fill={fill} /> : <ellipse cx={x} cy={headY} rx={u * 0.42} ry={u * 0.5} fill={fill} />}
            <path d={`M${x - u * 0.38} ${headY - u * 0.3} Q${x} ${headY - u * 0.62} ${x + u * 0.38} ${headY - u * 0.3}`} stroke={rim} strokeOpacity={rimO} strokeWidth={u * 0.06} fill="none" />
          </g>
        );
      })}
    </g>
  );
};

/** street sweeper (side view, conical hat, broom), pushing ash; ph = stroke phase (on twos) */
export const Sweeper: React.FC<{ x: number; y: number; h: number; ph: number; fill: string; rim: string }> = ({ x, y, h, ph, fill, rim }) => {
  const u = h / 7; const k = (Math.sin(ph) + 1) / 2; // 0 back, 1 forward
  const shX = x + u * (0.5 + 0.2 * k), shY = y - h * 0.72;
  const hand1: [number, number] = [shX + u * (0.6 + 0.6 * k), shY + u * 1.4];
  const hand2: [number, number] = [shX + u * (0.2 + 0.5 * k), shY + u * 0.6];
  const brushX = x + u * (2.3 + 1.0 * k), brushY = y;
  return (
    <g>
      <g fill={fill}>
        <path d={`M${x - u * 0.3} ${y} L${x - u * 0.1} ${y - h * 0.45} L${x + u * 0.35} ${y - h * 0.45} L${x + u * (0.9 + 0.3 * k)} ${y} L${x + u * (0.6 + 0.3 * k)} ${y} L${x + u * 0.15} ${y - h * 0.3} L${x} ${y} Z`} />
        <path d={`M${x - u * 0.2} ${y - h * 0.44} L${shX - u * 0.4} ${shY} Q${shX + u * 0.1} ${shY - u * 0.3} ${shX + u * 0.5} ${shY + u * 0.2} L${x + u * 0.5} ${y - h * 0.42} Z`} />
        <ellipse cx={shX + u * 0.35} cy={shY - u * 0.5} rx={u * 0.35} ry={u * 0.4} />
        <polygon points={`${shX - u * 0.55},${shY - u * 0.62} ${shX + u * 0.4},${shY - u * 1.25} ${shX + u * 1.3},${shY - u * 0.55}`} />
      </g>
      <path d={`M${shX} ${shY + u * 0.2} L${hand2[0]} ${hand2[1]} M${shX + u * 0.1} ${shY + u * 0.3} L${(shX + hand1[0]) / 2} ${shY + u * 1.0} L${hand1[0]} ${hand1[1]}`} stroke={fill} strokeWidth={u * 0.26} strokeLinecap="round" fill="none" />
      <path d={`M${hand2[0] - u * 0.4} ${hand2[1] - u * 0.45} L${brushX} ${brushY - u * 0.15}`} stroke="#3a2e26" strokeWidth={u * 0.09} />
      <path d={`M${brushX - u * 0.15} ${brushY - u * 0.3} L${brushX + u * 0.5} ${brushY} L${brushX - u * 0.35} ${brushY} Z`} fill={fill} />
      <path d={`M${shX - u * 0.55} ${shY - u * 0.62} L${shX + u * 0.4} ${shY - u * 1.25}`} stroke={rim} strokeOpacity={0.7} strokeWidth={u * 0.05} />
      {/* ash puff at the broom */}
      {[0, 1, 2].map((i) => <ellipse key={i} cx={brushX + u * (0.4 + i * 0.35) * k} cy={brushY - u * (0.15 + i * 0.12) * k} rx={u * (0.3 + i * 0.15)} ry={u * 0.16} fill="#bdb2aa" opacity={0.35 * k * (1 - i * 0.25)} />)}
    </g>
  );
};

/** foreground silhouette arm (hooded sleeve) holding a lit bottle; wind 0..1 back, rel = seconds since release (<0 held). Stylised. */
export const ThrowArm: React.FC<{ wind: number; rel: number; t: number; fill: string; rim: string }> = ({ wind, rel, t, fill, rim }) => {
  const sh: [number, number] = [-60, 2200];
  const follow = rel > 0 ? Math.min(1, rel / 0.18) : 0;
  const ang = (-60 - 50 * wind + 150 * follow) * Math.PI / 180; // forearm angle
  const el: [number, number] = [sh[0] + 360 - 120 * wind + 160 * follow, sh[1] - 330 + 80 * wind - 120 * follow];
  const hd: [number, number] = [el[0] + Math.cos(ang) * 300, el[1] + Math.sin(ang) * 300];
  const held = rel <= 0;
  return (
    <g>
      <path d={`M${sh[0] - 150} ${sh[1] + 300} L${sh[0]} ${sh[1]} L${el[0]} ${el[1]}`} stroke={fill} strokeWidth={190} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${el[0]} ${el[1]} L${hd[0]} ${hd[1]}`} stroke={fill} strokeWidth={130} strokeLinecap="round" fill="none" />
      <circle cx={hd[0]} cy={hd[1]} r={70} fill={fill} />
      <path d={`M${sh[0] + 40} ${sh[1] - 70} L${el[0] - 20} ${el[1] - 80}`} stroke={rim} strokeOpacity={0.5} strokeWidth={6} strokeLinecap="round" />
      {held && (
        <g transform={`translate(${hd[0]} ${hd[1]}) rotate(${(ang * 180) / Math.PI + 90})`}>
          <rect x={-22} y={-150} width={44} height={110} rx={14} fill="#1a1a14" />
          <rect x={-9} y={-190} width={18} height={44} fill="#1a1a14" />
          <path d={`M0 -190 Q${-18 + Math.sin(t * 20) * 6} -230 ${Math.sin(t * 14) * 10} ${-270 - Math.sin(t * 17) * 16} Q18 -228 0 -190 Z`} fill="#ff9a32" />
          <path d={`M0 -192 Q-8 -215 ${Math.sin(t * 19) * 5} -238 Q8 -214 0 -192 Z`} fill="#ffcf6a" />
        </g>
      )}
    </g>
  );
};
/** the arc of the thrown flame toward the hall: trail of fire along a curve, head at progress k */
export const FlameArc: React.FC<{ k: number; t: number; from: [number, number]; to: [number, number]; peak: number }> = ({ k, t, from, to, peak }) => {
  if (k <= 0) return null;
  const at = (q: number): [number, number] => [from[0] + (to[0] - from[0]) * q, from[1] + (to[1] - from[1]) * q - peak * 4 * q * (1 - q)];
  const pts = Array.from({ length: 14 }).map((_, i) => at(Math.max(0, k - i * 0.025)));
  const [hx, hy] = pts[0];
  return (
    <g>
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={(22 - i * 1.4) * (1 - k * 0.5)} fill={i < 3 ? '#ffcf6a' : '#ff8a2a'} opacity={(1 - i / 14) * 0.8} />)}
      <ellipse cx={hx} cy={hy} rx={60} ry={60} fill="url(#fiGlow)" />
      <circle cx={hx} cy={hy} r={9 + Math.sin(t * 30) * 2} fill="#fff1c0" />
    </g>
  );
};
