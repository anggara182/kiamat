import React from 'react';
import { W, H, rng } from './world';

/* ------------------------------------------------------------------------------------------
 * EP09 set "peace": a city square in celebration (S04), a port market by day (S05) and by night
 * with warships (S09), an army camp at dusk (S07). No flags, insignia, symbols or weapons.
 * ---------------------------------------------------------------------------------------- */
const hx = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = hx(a), B = hx(b), k = Math.min(1, Math.max(0, t));
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('');
};
export const SQ = { ground: 1560 };
export const PORT = { ground: 1560, sea: 1180 };
export const CAMP = { ground: 1560 };

/* -------------------------------- S04: the square -------------------------------- */
export const SquareBand: React.FC = () => {
  const r = rng(1001);
  const fac = ['#e8c8a0', '#d8b090', '#f0dcc0', '#c8a888', '#e0bc98'];
  return (
    <g>
      <defs><linearGradient id="psSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bcd8e6" /><stop offset="1" stopColor="#f6efe0" /></linearGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#psSky)" />
      {/* old town facades around the square, balconies, awnings */}
      {Array.from({ length: 7 }, (_, i) => {
        const x = -40 + i * 200, h = 520 + r() * 300, c = fac[i % 5];
        return (
          <g key={i}>
            <rect x={x} y={1200 - h} width={200} height={h + 10} fill={c} />
            {Array.from({ length: 3 }, (_, k) => Array.from({ length: Math.floor(h / 150) }, (_, j) => <rect key={`${k}${j}`} x={x + 24 + k * 58} y={1200 - h + 40 + j * 150} width={34} height={70} rx={14} fill="#6a5040" opacity={0.75} />))}
            <rect x={x + 10} y={1080} width={180} height={14} fill="#8a6a50" />
            <polygon points={`${x + 10},1094 ${x + 190},1094 ${x + 200},1140 ${x},1140`} fill={['#c94f3d', '#4f8a7a', '#e8b84a', '#5a7aa8'][i % 4]} />
          </g>
        );
      })}
      {/* string lights and bunting in plain colours (no flags) */}
      {[620, 760].map((y, k) => <path key={k} d={`M -40 ${y} Q 648 ${y + 140} ${W + 40} ${y}`} stroke="#5a4a40" strokeWidth={3} fill="none" />)}
      <rect x={0} y={1190} width={W} height={H} fill="#d8c8b0" />
      {Array.from({ length: 12 }, (_, i) => <path key={`p${i}`} d={`M ${i * 120 - 40} 1190 L ${i * 160 - 400} ${H}`} stroke="#c4b49a" strokeWidth={3} />)}
      {/* a fountain in the middle distance */}
      <ellipse cx={648} cy={1240} rx={170} ry={30} fill="#b8a890" />
      <rect x={630} y={1150} width={36} height={90} fill="#b8a890" />
    </g>
  );
};

/** cheerful bunting along the string-light lines (cloth: ON ONES) */
export const Bunting: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[620, 760].map((y0, k) => Array.from({ length: 16 }, (_, i) => {
      const u = i / 15, x = -40 + u * (W + 80), y = y0 + Math.sin(u * Math.PI) * 140 * (1 - Math.abs(0.5 - u) * 0) * 0.5 + 4 * u * (1 - u) * 70;
      return <polygon key={`${k}${i}`} points={`${x - 14},${y} ${x + 14},${y} ${x + Math.sin(t * 5 + i + k) * 5},${y + 34}`} fill={['#c94f3d', '#e8b84a', '#4f8a7a', '#f2efe6', '#5a7aa8'][(i + k) % 5]} />;
    }))}
  </g>
);

/** a celebrating crowd as rows of heads/shoulders in many colours, jittered, bouncing on twos */
export const PartyCrowd: React.FC<{ t2: number; y0: number; y1: number; s0: number; s1: number; arms?: number; seed?: number }> = ({ t2, y0, y1, s0, s1, arms = 0.4, seed = 1011 }) => {
  const rows: React.ReactNode[] = [];
  const cols = ['#c94f3d', '#4f6f8a', '#e8b84a', '#3a4a3a', '#d8d0c0', '#8a4a6a', '#5a7aa8', '#7a5a3a', '#f2efe6'];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1), y = y0 + (y1 - y0) * k * k, sc = s0 + (s1 - s0) * k * k;
    const r = rng(seed + i);
    const parts: string[] = Array(cols.length).fill(''), heads: string[] = ['', ''];
    let armD = '';
    for (let x = -40 + r() * 30 * sc; x < W + 40; x += (26 + r() * 14) * sc) {
      const bounce = Math.abs(Math.sin(t2 * 6 + x * 0.05 + i)) * 6 * sc;
      const yy = y - bounce + (r() - 0.5) * 6 * sc, w = 13 * sc, hh = 26 * sc, hr = 6.5 * sc;
      const c = Math.floor(r() * cols.length);
      parts[c] += `M ${(x - w).toFixed(1)} ${(yy + hh).toFixed(1)} Q ${(x - w).toFixed(1)} ${(yy + 4 * sc).toFixed(1)} ${x.toFixed(1)} ${(yy + 3 * sc).toFixed(1)} Q ${(x + w).toFixed(1)} ${(yy + 4 * sc).toFixed(1)} ${(x + w).toFixed(1)} ${(yy + hh).toFixed(1)} Z `;
      heads[r() < 0.8 ? 0 : 1] += `M ${(x - hr).toFixed(1)} ${(yy - 4 * sc).toFixed(1)} a ${hr.toFixed(1)} ${(hr * 1.1).toFixed(1)} 0 1 0 ${(2 * hr).toFixed(1)} 0 a ${hr.toFixed(1)} ${(hr * 1.1).toFixed(1)} 0 1 0 ${(-2 * hr).toFixed(1)} 0 Z `;
      if (r() < arms) armD += `M ${(x + w * 0.7).toFixed(1)} ${(yy + 6 * sc).toFixed(1)} l ${(4 * sc).toFixed(1)} ${(-(24 + 6 * Math.sin(t2 * 8 + x)) * sc).toFixed(1)} `;
    }
    rows.push(<g key={i}>{parts.map((d, c) => d && <path key={c} d={d} fill={cols[c]} />)}{heads[0] && <path d={heads[0]} fill="#3a2a20" />}{heads[1] && <path d={heads[1]} fill="#d8d0c0" />}{armD && <path d={armD} stroke="#a8765a" strokeWidth={Math.max(1.5, 4 * sc)} strokeLinecap="round" />}</g>);
  }
  return <g>{rows}</g>;
};

/** paper confetti burst from (x,y) since u seconds (ON ONES) */
export const Confetti: React.FC<{ t: number; u: number; x: number; y: number }> = ({ t, u, x, y }) => {
  if (u <= 0) return null;
  const r = rng(1021);
  return <g>{Array.from({ length: 90 }, (_, i) => { const a = -Math.PI * (0.05 + 0.9 * r()), sp = 400 + r() * 900, drag = (1 - Math.exp(-u * 2)) / 2; const px = x + Math.cos(a) * sp * drag + Math.sin(t * 3 + i) * 30 * u, py = y + Math.sin(a) * sp * drag + 120 * u * u; return <rect key={i} x={px} y={py} width={14} height={8} fill={['#c94f3d', '#e8b84a', '#4f8a7a', '#f2efe6', '#5a7aa8', '#e08ab0'][i % 6]} transform={`rotate(${t * 400 + i * 40} ${px} ${py})`} opacity={Math.max(0, 1 - u / 4)} />; })}</g>;
};

/* -------------------------------- S05 / S09: the port -------------------------------- */
const PP = {
  day: { sky: ['#a8d0e6', '#f6efe0'], sea: '#7fb3c8', sea2: '#5f93a8', crane: '#c94f3d', ship: '#4f6f8a', ship2: '#e8e2d4', far: '#c8d8de', ground: '#d8c8a8', wall: '#e8d8b8' },
  night: { sky: ['#05080f', '#0a1020'], sea: '#0c1420', sea2: '#080c14', crane: '#1a1e28', ship: '#141820', ship2: '#1e222c', far: '#0e1420', ground: '#1e1c22', wall: '#24222a' },
};
export const PortBand: React.FC<{ mood: 'day' | 'night' }> = ({ mood }) => {
  const C = PP[mood];
  return (
    <g>
      <defs>
        <linearGradient id={`ppSky${mood}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.sky[0]} /><stop offset="1" stopColor={C.sky[1]} /></linearGradient>
        <linearGradient id={`ppSea${mood}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.sea} /><stop offset="1" stopColor={C.sea2} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#ppSky${mood})`} />
      {mood === 'night' && Array.from({ length: 30 }, (_, i) => { const r = rng(1030 + i); return <circle key={i} cx={r() * W} cy={r() * 600} r={1.2} fill="#cfd8e8" opacity={0.6} />; })}
      {/* far headland */}
      <path d={`M -40 ${PORT.sea} Q 300 ${PORT.sea - 120} 640 ${PORT.sea - 60} Q 1000 ${PORT.sea - 140} ${W + 40} ${PORT.sea - 40} L ${W + 40} ${PORT.sea} Z`} fill={C.far} />
      <rect x={0} y={PORT.sea} width={W} height={260} fill={`url(#ppSea${mood})`} />
      {/* harbour cranes */}
      {[[160, 520], [1000, 460]].map(([x, top], i) => (
        <g key={i} fill="none" stroke={C.crane} strokeWidth={14}>
          <path d={`M ${x - 40} ${PORT.sea + 40} L ${x - 20} ${top} M ${x + 40} ${PORT.sea + 40} L ${x + 20} ${top} M ${x - 30} ${(PORT.sea + top) / 2} L ${x + 30} ${(PORT.sea + top) / 2}`} />
          <path d={`M ${x - 140} ${top} L ${x + 260} ${top} M ${x} ${top} L ${x} ${top - 80} L ${x + 260} ${top}`} strokeWidth={10} />
        </g>
      ))}
      {/* the quay wall and market ground */}
      <rect x={0} y={PORT.sea + 240} width={W} height={40} fill={C.wall} />
      <rect x={0} y={PORT.sea + 280} width={W} height={H} fill={C.ground} />
    </g>
  );
};

/** a moored merchant ship (day) or a dark warship silhouette (night, no flags or markings) */
export const Ship: React.FC<{ x: number; y: number; s: number; war?: boolean; col: string; col2: string }> = ({ x, y, s, war, col, col2 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {war ? (
      <g fill={col}>
        <path d="M -420 0 L 440 0 L 480 -60 L -460 -60 Z" />
        <path d="M -200 -60 L -180 -130 L 60 -130 L 80 -60 Z" />
        <path d="M -120 -130 L -100 -200 L 0 -200 L 20 -130 Z" />
        <path d="M -60 -200 L -55 -300 L -45 -300 L -40 -200 Z" />
        <path d="M 140 -60 L 150 -96 L 260 -96 L 270 -60 Z" />
        <path d="M -340 -60 L -330 -90 L -260 -90 L -250 -60 Z" />
      </g>
    ) : (
      <g>
        <path d="M -360 0 L 380 0 L 420 -70 L -400 -70 Z" fill={col} />
        {[-300, -200, -100, 0, 100].map((cx, i) => <rect key={cx} x={cx} y={-150} width={90} height={80} fill={['#c94f3d', '#e8b84a', '#4f8a7a', '#5a7aa8', '#e8e2d4'][i]} />)}
        <rect x={220} y={-190} width={120} height={120} fill={col2} />
        <rect x={240} y={-170} width={80} height={20} fill="#3a4a5a" />
      </g>
    )}
  </g>
);

/** a market stall with an awning and fruit (day) or shuttered (night) */
export const Stall: React.FC<{ x: number; y: number; w: number; col: string; night?: boolean; shutter?: number }> = ({ x, y, w, col, night, shutter = 1 }) => {
  const fruit = ['#e8742a', '#c9322b', '#e8c24a', '#6a9a3a'];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-420} width={w} height={420} fill={night ? '#2a2830' : '#c8b08a'} />
      <polygon points={`${-w / 2 - 20},-420 ${w / 2 + 20},-420 ${w / 2 + 40},-340 ${-w / 2 - 40},-340`} fill={night ? mix(col, '#0a1020', 0.7) : col} />
      {!night && <g>
        <rect x={-w / 2 + 10} y={-200} width={w - 20} height={60} fill="#8a6a44" />
        {Array.from({ length: Math.floor((w - 40) / 30) }, (_, i) => <circle key={i} cx={-w / 2 + 30 + i * 30} cy={-214} r={15} fill={fruit[i % 4]} />)}
        {Array.from({ length: Math.floor((w - 60) / 34) }, (_, i) => <circle key={`b${i}`} cx={-w / 2 + 44 + i * 34} cy={-238} r={14} fill={fruit[(i + 2) % 4]} />)}
        <rect x={-w / 2 + 10} y={-140} width={w - 20} height={140} fill="#a8865c" />
      </g>}
      {night && <g>
        <rect x={-w / 2 + 10} y={-330} width={w - 20} height={330 * shutter} fill="#5a5c64" />
        {Array.from({ length: Math.floor(330 * shutter / 22) }, (_, i) => <rect key={i} x={-w / 2 + 10} y={-330 + i * 22} width={w - 20} height={4} fill="#3a3c44" />)}
      </g>}
    </g>
  );
};

/** a kite on a string from (hx,hy) rising to (kx,ky) (ON ONES once released) */
export const Kite: React.FC<{ hx: number; hy: number; kx: number; ky: number; t: number }> = ({ hx, hy, kx, ky, t }) => (
  <g>
    <path d={`M ${hx} ${hy} Q ${(hx + kx) / 2 + 40} ${(hy + ky) / 2 + 60} ${kx} ${ky}`} stroke="#f2efe6" strokeWidth={2} fill="none" />
    <g transform={`translate(${kx} ${ky}) rotate(${Math.sin(t * 3) * 8})`}>
      <polygon points="0,-60 40,0 0,70 -40,0" fill="#c94f3d" />
      <polygon points="0,-60 40,0 0,0" fill="#e8b84a" />
      <path d={`M 0 70 q ${Math.sin(t * 6) * 20} 40 0 80 q ${Math.sin(t * 6 + 1) * 20} 40 0 80`} stroke="#4f8a7a" strokeWidth={3} fill="none" />
    </g>
  </g>
);

/* -------------------------------- S07: the camp at dusk -------------------------------- */
export const CampBand: React.FC = () => {
  const r = rng(1041);
  return (
    <g>
      <defs><linearGradient id="pcSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2c40" /><stop offset="0.6" stopColor="#b8705a" /><stop offset="1" stopColor="#e09060" /></linearGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#pcSky)" />
      <circle cx={980} cy={1060} r={60} fill="#ffcf96" opacity={0.9} />
      {/* rows of plain tents, trucks, a light mast */}
      {Array.from({ length: 9 }, (_, i) => { const x = -40 + i * 160 + r() * 40, s = 0.8 + r() * 0.4; return <polygon key={i} points={`${x - 90 * s},1180 ${x},${1180 - 110 * s} ${x + 90 * s},1180`} fill={i % 2 ? '#4a4038' : '#3a3630'} />; })}
      {[[200, 1260], [880, 1240]].map(([x, y], i) => <g key={i} fill="#2e2c2a"><rect x={x - 130} y={y - 120} width={200} height={100} rx={10} /><rect x={x + 70} y={y - 90} width={80} height={70} rx={8} /><circle cx={x - 80} cy={y - 14} r={24} /><circle cx={x + 100} cy={y - 14} r={24} /></g>)}
      <rect x={640} y={700} width={10} height={480} fill="#2a2628" />
      <rect x={600} y={690} width={90} height={24} fill="#2a2628" />
      <rect x={0} y={1180} width={W} height={H} fill="#5a4a40" />
      <rect x={0} y={1180} width={W} height={40} fill="#e09060" opacity={0.25} />
    </g>
  );
};

/** drifting dust / smoke (ON ONES) */
export const Haze: React.FC<{ t: number; y: number; col: string; o?: number }> = ({ t, y, col, o = 0.3 }) => {
  const r = rng(1051);
  return <g opacity={o}>{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={((r() * 1600 + t * 25) % 1700) - 200} cy={y + r() * 300} rx={220 + r() * 200} ry={40 + r() * 40} fill={col} opacity={0.5} />)}</g>;
};
