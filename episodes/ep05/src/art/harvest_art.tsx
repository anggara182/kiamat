import React from 'react';
import { W, H, rng } from './world';

/* ------------------------------------------------------------------------------------------
 * EP05 set "harvest": early rain over green paddies (S15), golden harvest (S16),
 * a warehouse filling with sacks of money (S17). Closer framings: people large enough to read.
 * ---------------------------------------------------------------------------------------- */
export const RF = { water: 1420 }; // paddy water line (S15)
export const GF = { ground: 1500 }; // field edge / track (S16)
export const WH = { floor: 1620 }; // warehouse floor (S17)

/* --------------------------------------- S15: rain --------------------------------------- */
export const RainBand: React.FC = () => {
  const r = rng(501);
  return (
    <g>
      <defs>
        <linearGradient id="hvRSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a6a66" /><stop offset="0.55" stopColor="#8fa79a" /><stop offset="1" stopColor="#c9d6cc" /></linearGradient>
        <linearGradient id="hvRWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9c9c0" /><stop offset="1" stopColor="#6f8a7e" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#hvRSky)" />
      {/* heavy cloud banks */}
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={i * 150 + r() * 60} cy={220 + r() * 160} rx={220} ry={90} fill={i % 2 ? '#4f5e5a' : '#5f6f6a'} opacity={0.8} />)}
      {/* far hills + tree line */}
      <path d={`M -40 1060 Q 200 900 420 1000 Q 640 880 880 980 Q 1100 900 1340 1000 L 1340 1120 L -40 1120 Z`} fill="#6f8a78" />
      {Array.from({ length: 20 }, (_, i) => <ellipse key={`t${i}`} cx={i * 70 + r() * 30} cy={1110} rx={42} ry={30} fill="#56705e" />)}
      {/* terraced paddies stepping toward camera */}
      {[1130, 1200, 1290].map((y, i) => <g key={y}><rect x={0} y={y} width={W} height={90} fill={['#7fa070', '#8fb07a', '#a0bf88'][i]} /><rect x={0} y={y} width={W} height={6} fill="#5a7a50" /></g>)}
      {/* near paddy: water with rows of young rice */}
      <rect x={0} y={RF.water} width={W} height={H - RF.water} fill="url(#hvRWater)" />
      {Array.from({ length: 9 }, (_, row) => {
        const y = RF.water + 30 + row * row * 14 + row * 40, s = 0.6 + row * 0.35;
        return <g key={row}>{Array.from({ length: Math.ceil(W / (60 * s)) + 1 }, (_, k) => { const x = k * 60 * s + (row % 2) * 30 * s; return <path key={k} d={`M ${x} ${y} l ${-8 * s} ${-28 * s} M ${x} ${y} l 0 ${-34 * s} M ${x} ${y} l ${8 * s} ${-28 * s}`} stroke={row % 2 ? '#4f8a4a' : '#5a9a50'} strokeWidth={3 * s} strokeLinecap="round" />; })}</g>;
      })}
      {/* a dyke path on the left with a hut */}
      <polygon points={`-40,${RF.water - 20} 260,${RF.water - 20} 120,${H} -40,${H}`} fill="#8a7a5a" />
      <polygon points={`20,1180 180,1180 200,1250 0,1250`} fill="#6a5a40" />
      <rect x={30} y={1250} width={140} height={110} fill="#8a7a5a" />
    </g>
  );
};

/** the rain curtain: front edge at xFront (moves toward/over the field); hit 0..1 = splashes on the near paddy (ON ONES) */
export const Rain: React.FC<{ t: number; xFront: number; hit: number }> = ({ t, xFront, hit }) => {
  const r = rng(511);
  const drops = Array.from({ length: 160 }, () => ({ x: r() * 1700 - 200, y: r() * H, l: 40 + r() * 60, v: 1500 + r() * 600 }));
  return (
    <g>
      {/* grey sheet of rain beyond the front */}
      <polygon points={`${xFront},0 ${W + 60},0 ${W + 60},${RF.water} ${xFront - 220},${RF.water}`} fill="#7f948a" opacity={0.45} />
      <g stroke="#e9f0ec" strokeWidth={2.4} strokeLinecap="round" opacity={0.65}>
        {drops.map((d, i) => {
          const y = ((d.y + d.v * t) % (H + 100)) - 100, x = d.x - (y / H) * 220;
          if (x < xFront - (y / RF.water) * 220 && !(hit > 0 && y > RF.water - 300)) return null;
          if (hit <= 0 && y > RF.water) return null;
          return <path key={i} d={`M ${x} ${y} l ${-0.22 * d.l} ${d.l}`} />;
        })}
      </g>
      {/* splash rings on the paddy water */}
      {hit > 0 && Array.from({ length: 26 }, (_, i) => { const u = ((t * 2 + i * 0.37) % 1), x = (i * 211) % W, y = RF.water + 60 + ((i * 97) % 700); return <ellipse key={i} cx={x} cy={y} rx={6 + 30 * u} ry={2 + 8 * u} fill="none" stroke="#e9f0ec" strokeWidth={2} opacity={hit * (1 - u)} />; })}
    </g>
  );
};

/* --------------------------------------- S16: gold --------------------------------------- */
export const GoldBand: React.FC = () => {
  const r = rng(521);
  return (
    <g>
      <defs>
        <linearGradient id="hvGSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9c98a" /><stop offset="0.6" stopColor="#f2dca8" /><stop offset="1" stopColor="#f6e6c0" /></linearGradient>
        <radialGradient id="hvSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff6dc" /><stop offset="0.3" stopColor="#ffe2a0" stopOpacity={0.6} /><stop offset="1" stopColor="#ffe2a0" stopOpacity={0} /></radialGradient>
        <linearGradient id="hvField" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8c060" /><stop offset="1" stopColor="#c9962e" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#hvGSky)" />
      <circle cx={260} cy={760} r={520} fill="url(#hvSun)" />
      <path d="M -40 980 Q 300 900 620 960 Q 900 900 1340 960 L 1340 1060 L -40 1060 Z" fill="#c9a86a" />
      {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={i * 90 + r() * 30} cy={1050} rx={50} ry={34} fill="#9a8a50" />)}
      <rect x={0} y={1050} width={W} height={GF.ground - 1050} fill="url(#hvField)" />
      {/* rows of ripe rice: drooping heads, darker toward the camera */}
      {Array.from({ length: 10 }, (_, row) => {
        const y = 1080 + row * 44, s = 0.5 + row * 0.12;
        return <g key={row}>{Array.from({ length: Math.ceil(W / (34 * s)) + 1 }, (_, k) => { const x = k * 34 * s + (row % 2) * 17 * s; return <path key={k} d={`M ${x} ${y} q ${-4 * s} ${-30 * s} ${8 * s} ${-44 * s} q ${8 * s} ${6 * s} ${12 * s} ${18 * s}`} stroke={row % 2 ? '#b8862a' : '#d8a840'} strokeWidth={3 * s} fill="none" strokeLinecap="round" />; })}</g>;
      })}
      {/* the dirt track in front where the carts stand */}
      <rect x={0} y={GF.ground} width={W} height={H - GF.ground} fill="#a8865e" />
      <rect x={0} y={GF.ground} width={W} height={30} fill="#7a5a38" opacity={0.4} />
      {Array.from({ length: 18 }, (_, i) => <ellipse key={`s${i}`} cx={r() * W} cy={GF.ground + 80 + r() * 600} rx={12} ry={5} fill="#7a5a38" opacity={0.5} />)}
    </g>
  );
};

/** a wooden two-wheel cart piled with rice sheaves; spill 0..1 = sheaves tumbling off the top */
export const Cart: React.FC<{ x: number; y: number; s: number; spill: number; t: number }> = ({ x, y, s, spill, t }) => {
  const sheaf = (sx: number, sy: number, rot: number, key: string) => (
    <g key={key} transform={`translate(${sx} ${sy}) rotate(${rot})`}>
      <path d="M -40 10 L 40 10 L 30 -8 L -30 -8 Z" fill="#c9962e" />
      <path d="M -36 -6 Q -50 -40 -20 -50 Q 0 -60 20 -50 Q 50 -40 36 -6 Z" fill="#e2b84a" />
      <path d="M -20 -40 q 10 -10 20 0 M 0 -46 q 10 -8 18 2" stroke="#b8862a" strokeWidth={3} fill="none" />
      <rect x={-8} y={-10} width={16} height={8} fill="#8a6a3a" />
    </g>
  );
  const pile = Array.from({ length: 11 }, (_, i) => sheaf(-140 + (i % 5) * 70 + (i > 4 ? 30 : 0), -70 - Math.floor(i / 5) * 50, (i * 37) % 20 - 10, `p${i}`));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={220} ry={18} fill="#2a2018" opacity={0.3} />
      <path d="M 170 -40 L 360 -20" stroke="#6a4a30" strokeWidth={10} />
      <rect x={-190} y={-70} width={380} height={50} fill="#8a6a44" />
      <rect x={-190} y={-74} width={380} height={10} fill="#a8865c" />
      {pile}
      {/* the overflowing sheaves sliding off the top on the sync word */}
      {sheaf(-30 + 60 * spill, -190 + 230 * spill * spill, 70 * spill, 'f1')}
      {sheaf(60 + 120 * spill, -175 + 250 * spill * spill, 110 * spill, 'f2')}
      {spill > 0 && Array.from({ length: 20 }, (_, i) => <circle key={i} cx={40 + i * 9 + spill * 80} cy={-150 + spill * (100 + (i % 5) * 40) + Math.sin(t * 9 + i) * 3} r={3} fill="#e8c060" opacity={1 - spill * 0.5} />)}
      <g transform="translate(0 -20)"><circle cx={0} cy={0} r={78} fill="none" stroke="#5a3e28" strokeWidth={14} />{[0, 45, 90, 135].map((a) => <rect key={a} x={-4} y={-74} width={8} height={148} fill="#5a3e28" transform={`rotate(${a})`} />)}<circle cx={0} cy={0} r={12} fill="#3a2a1c" /></g>
    </g>
  );
};

/** chaff and dust floating in the golden light (ON ONES) */
export const Chaff: React.FC<{ t: number; col?: string }> = ({ t, col = '#fff2c8' }) => {
  const r = rng(531);
  return <g fill={col}>{Array.from({ length: 50 }, (_, i) => { const x0 = r() * W, y0 = r() * H, s = 1.5 + r() * 3; const x = (x0 + t * (20 + r() * 30)) % W, y = (y0 - t * (6 + r() * 10) + H) % H; return <circle key={i} cx={x} cy={y} r={s} opacity={0.5 + 0.4 * Math.sin(t * 2 + i)} />; })}</g>;
};

/* --------------------------------------- S17: warehouse --------------------------------------- */
export const BarnBand: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hvBWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2c1e" /><stop offset="1" stopColor="#5a4430" /></linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill="url(#hvBWall)" />
    {/* plank wall + high windows */}
    {Array.from({ length: 26 }, (_, i) => <rect key={i} x={i * 50} y={0} width={3} height={WH.floor} fill="#2a2016" opacity={0.6} />)}
    {[180, 560, 940].map((x) => <rect key={x} x={x} y={260} width={180} height={140} fill="#f6dca0" />)}
    {[180, 560, 940].map((x) => <path key={`b${x}`} d={`M ${x + 90} 260 L ${x + 90} 400 M ${x} 330 L ${x + 180} 330`} stroke="#2a2016" strokeWidth={8} />)}
    {/* roof truss */}
    <path d="M -40 200 L 648 40 L 1340 200" stroke="#2a2016" strokeWidth={22} fill="none" />
    <rect x={-40} y={196} width={1380} height={18} fill="#2a2016" />
    <rect x={0} y={WH.floor} width={W} height={H - WH.floor} fill="#4a3826" />
    <rect x={0} y={WH.floor} width={W} height={18} fill="#2a2016" />
  </g>
);

/** hard light shafts from the high windows with dust (ON ONES) */
export const Shafts: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[180, 560, 940].map((x, i) => <polygon key={x} points={`${x},400 ${x + 180},400 ${x + 520},${WH.floor + 200} ${x + 300},${WH.floor + 200}`} fill="#f6dca0" opacity={0.16 + 0.03 * Math.sin(t * 1.5 + i)} />)}
    {[180, 560, 940].map((x, i) => <polygon key={`f${x}`} points={`${x + 300},${WH.floor} ${x + 520},${WH.floor} ${x + 560},${WH.floor + 120} ${x + 330},${WH.floor + 120}`} fill="#f6dca0" opacity={0.3 + 0.02 * i} />)}
  </g>
);

/** a burlap sack; money 0..1 = banknotes peeking from the top */
export const Sack: React.FC<{ x: number; y: number; s: number; rot?: number; money?: boolean; tone?: number }> = ({ x, y, s, rot = 0, money = true, tone = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -60 0 Q -70 -60 -50 -110 L 50 -110 Q 70 -60 60 0 Z" fill={tone ? '#9a7a4a' : '#a8865a'} />
    <path d="M -50 -110 L 50 -110 L 36 -130 L -36 -130 Z" fill="#8a6a3e" />
    <path d="M -36 -122 Q 0 -112 36 -122" stroke="#5a4428" strokeWidth={6} fill="none" />
    <path d="M -40 -60 Q 0 -50 40 -60 M -30 -30 Q 0 -24 34 -30" stroke="#7a5a34" strokeWidth={3} fill="none" opacity={0.6} />
    {money && <g>{[-20, 0, 18].map((d, i) => <g key={i} transform={`translate(${d} -134) rotate(${(i - 1) * 18})`}><Note w={44} /></g>)}</g>}
    <path d="M 60 0 Q 70 -60 50 -110" stroke="#5a4428" strokeWidth={8} fill="none" opacity={0.5} />
  </g>
);

/** a generic, unreadable banknote: inner border + a plain circle, no text, no faces */
export const Note: React.FC<{ w: number; tint?: number }> = ({ w, tint = 0 }) => {
  const h = w * 0.48;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.04} fill={tint ? '#b8b07a' : '#8fae7a'} />
      <rect x={-w / 2 + w * 0.07} y={-h / 2 + h * 0.12} width={w * 0.86} height={h * 0.76} fill="none" stroke="#5a7a4a" strokeWidth={w * 0.025} />
      <circle cx={w * 0.18} cy={0} r={h * 0.24} fill="none" stroke="#5a7a4a" strokeWidth={w * 0.025} />
      <rect x={-w * 0.32} y={-h * 0.1} width={w * 0.3} height={h * 0.2} fill="#5a7a4a" opacity={0.5} />
    </g>
  );
};

/** banknotes fluttering through the air (ON ONES); burst 0..: seconds since the sack tipped */
export const Notes: React.FC<{ t: number; burst: number; ox: number; oy: number }> = ({ t, burst, ox, oy }) => {
  const r = rng(541);
  const ambient = Array.from({ length: 14 }, () => ({ x: r() * W, y0: r() * H, v: 40 + r() * 50, ph: r() * 6, w: 40 + r() * 20 }));
  const blast = Array.from({ length: 46 }, () => ({ a: -Math.PI * (0.05 + 0.9 * r()), sp: 500 + r() * 700, ph: r() * 6, w: 36 + r() * 24 }));
  return (
    <g>
      {ambient.map((n, i) => { const y = (n.y0 + n.v * t) % H, x = n.x + Math.sin(t * 1.5 + n.ph) * 60; return <g key={`a${i}`} transform={`translate(${x} ${y}) rotate(${Math.sin(t * 2 + n.ph) * 40}) scale(1 ${0.4 + 0.6 * Math.abs(Math.cos(t * 3 + n.ph))})`}><Note w={n.w} tint={i % 2} /></g>; })}
      {burst > 0 && blast.map((n, i) => {
        const b = burst, drag = (1 - Math.exp(-b * 2.2)) / 2.2;
        const x = ox + Math.cos(n.a) * n.sp * drag + Math.sin(t * 2 + n.ph) * 30 * b, y = oy + Math.sin(n.a) * n.sp * drag + 160 * b * b;
        return <g key={`b${i}`} transform={`translate(${x} ${y}) rotate(${t * 200 + n.ph * 60}) scale(1 ${0.3 + 0.7 * Math.abs(Math.cos(t * 4 + n.ph))})`}><Note w={n.w} tint={i % 2} /></g>;
      })}
    </g>
  );
};
