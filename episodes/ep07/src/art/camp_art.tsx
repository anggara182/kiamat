import React from 'react';
import { Glow, Puff, limb } from './camp_kit';

/** EP07 set "camp": inside a tent by day (7), the tent camp at night (9), empty tents at dawn (10). Frame coords. */

/* ---------------- inside a tent (7) ---------------- */
export const TN = { floor: 1300, block: { x: 540, y: 1250 } };
export const TentInside: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="ctCanvas" cx="0.5" cy="0.35" r="0.8"><stop offset="0" stopColor="#f2e2c0" /><stop offset="0.6" stopColor="#cbbfa6" /><stop offset="1" stopColor="#8a7a62" /></radialGradient>
    </defs>
    <rect x={-108} y={-192} width={1296} height={1600} fill="url(#ctCanvas)" />
    {/* canvas seams + sagging roof folds */}
    {[120, 360, 720, 960].map((x, i) => <path key={i} d={`M540 -192 Q${(x + 540) / 2} 400 ${x} ${TN.floor}`} stroke="#a89a80" strokeWidth={5} fill="none" opacity={0.6} />)}
    <path d="M-108 300 Q540 380 1188 300" stroke="#a89a80" strokeWidth={4} fill="none" opacity={0.5} />
    {/* entrance slit with harsh sun outside (right) */}
    <path d="M1000 300 L1100 300 L1188 1300 L960 1300 Z" fill="#fff4d8" />
    <path d="M1000 300 L960 1300 L900 1300 L980 300 Z" fill="#b8a888" />
    {/* tent pole + a hanging (unlit) lantern + ropes */}
    <rect x={530} y={-192} width={20} height={1500} fill="#6a5238" />
    <path d="M550 420 L600 470" stroke="#3a3020" strokeWidth={3} />
    <rect x={584} y={470} width={36} height={56} rx={6} fill="#4a3e30" /><rect x={590} y={478} width={24} height={38} fill="#c9b080" opacity={0.5} />
    {/* bundles, a water jug, bedrolls along the walls */}
    <ellipse cx={90} cy={1240} rx={150} ry={60} fill="#7a5e44" />
    <ellipse cx={100} cy={1190} rx={120} ry={50} fill="#8a6e50" />
    <path d="M840 1270 L880 1150 Q900 1130 920 1150 L960 1270 Z" fill="#6a7a8a" />
    {/* floor: sand + the patterned blanket */}
    <rect x={-108} y={TN.floor - 40} width={1296} height={900} fill="#c9ac7a" />
    <path d="M60 1220 L1020 1220 L1120 1520 L-40 1520 Z" fill="#8a3a34" />
    <path d="M100 1240 L980 1240 L1060 1500 L20 1500 Z" fill="none" stroke="#d9a441" strokeWidth={8} />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${160 + i * 130} 1300 l40 40 l-40 40 l-40 -40 Z`} fill="#d9a441" opacity={0.5} />)}
    {/* sunlight beam across the blanket */}
    <path d="M1000 300 L1100 300 L720 1500 L420 1500 Z" fill="#fff4d8" opacity={0.18} />
  </g>
);

/** the small gold block (prop on the blanket) */
export const GoldBlock: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <Glow id="ctGold" x={0} y={-10} rx={160} ry={60} c="#ffe08a" o={0.5} />
    <path d="M-70 0 L70 0 L56 -40 L-56 -40 Z" fill="#e8b84a" />
    <path d="M-56 -40 L56 -40 L44 -58 L-44 -58 Z" fill="#f6d27a" />
    <path d="M70 0 L56 -40 L44 -58 L56 -20 Z" fill="#b8862a" />
    <path d="M-50 -48 L30 -50" stroke="#fff4c0" strokeWidth={4} opacity={0.8} />
  </g>
);

/** kneeling lower legs behind a kneeling figure: from the knee (kx) back to the heel, on the floor y */
export const Shins: React.FC<{ kx: number; hx: number; y: number; w: number; c: string; foot: string }> = ({ kx, hx, y, w, c, foot }) => (
  <g>
    <path d={limb(kx, y - w / 2, hx, y - w / 2, w, w * 0.7)} fill={c} />
    <ellipse cx={hx + (hx < kx ? -10 : 10)} cy={y - w * 0.3} rx={w * 0.7} ry={w * 0.3} fill={foot} />
  </g>
);

/* ---------------- tent camp at night (9) ---------------- */
type Tent = { x: number; y: number; s: number };
const ROWS: Tent[] = (() => {
  const out: Tent[] = [];
  const rows = [{ y: 860, s: 0.32, n: 12 }, { y: 940, s: 0.45, n: 9 }, { y: 1060, s: 0.66, n: 6 }, { y: 1260, s: 1.0, n: 4 }];
  rows.forEach((r) => { for (let i = 0; i < r.n; i++) out.push({ x: -60 + (i + 0.5) * (1300 / r.n) + (r.n % 2 ? 30 : 0), y: r.y, s: r.s }); });
  return out;
})();
export const NIGHT_TENTS = ROWS;
/** lantern position for tent i */
export const lanternAt = (i: number) => { const t = ROWS[i]; return { x: t.x + 120 * t.s, y: t.y - 40 * t.s, s: t.s }; };

const TentShape: React.FC<{ t: Tent; c: string; d: string; door: string }> = ({ t, c, d, door }) => (
  <g transform={`translate(${t.x} ${t.y}) scale(${t.s})`}>
    <path d="M-160 0 L0 -220 L160 0 Z" fill={c} />
    <path d="M0 -220 L160 0 L60 0 Z" fill={d} />
    <path d="M-40 0 L0 -120 L40 0 Z" fill={door} />
    <path d="M0 -220 L0 -250" stroke={d} strokeWidth={8} />
  </g>
);

export const CampNight: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="cnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05060c" /><stop offset="0.8" stopColor="#0a0d18" /><stop offset="1" stopColor="#1a1622" /></linearGradient>
      <radialGradient id="cnGold" cx="0.5" cy="1" r="0.6"><stop offset="0" stopColor="#e8b84a" stopOpacity={0.45} /><stop offset="1" stopColor="#e8b84a" stopOpacity={0} /></radialGradient>
    </defs>
    <rect x={-108} y={-192} width={1296} height={1200} fill="url(#cnSky)" />
    {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={(i * 277) % 1300 - 100} cy={((i * 131) % 600) - 150} r={i % 5 ? 1.6 : 2.6} fill="#fff6dc" opacity={0.6} />)}
    {/* the glow of the gold mountain beyond the river, far right */}
    <ellipse cx={900} cy={820} rx={500} ry={220} fill="url(#cnGold)" />
    <path d="M700 820 Q900 700 1100 820 Z" fill="#3a2a1a" />
    <rect x={-108} y={820} width={1296} height={1400} fill="#14121c" />
    {ROWS.map((t, i) => <TentShape key={i} t={t} c="#3a3440" d="#26222e" door="#0c0a10" />)}
    <rect x={-108} y={1260} width={1296} height={900} fill="#1a1620" />
  </g>
);

/** an open tent flap moving in the wind (front tent, ones) */
export const Flap: React.FC<{ t: number }> = ({ t }) => {
  const f = lanternAt(ROWS.length - 2);
  const tent = ROWS[ROWS.length - 2];
  const sw = Math.sin(t * 2.3) * 18 + Math.sin(t * 5.1) * 6;
  return (
    <g transform={`translate(${tent.x} ${tent.y}) scale(${tent.s})`}>
      <path d={`M0 -120 L40 0 L${70 + sw} -10 Q${40 + sw * 0.6} -60 0 -120 Z`} fill="#4a4250" />
      <path d={`M0 -120 Q${40 + sw * 0.6} -60 ${70 + sw} -10`} stroke="#ffc46a" strokeWidth={2} fill="none" opacity={0.2} />
      <rect x={f.x * 0} y={0} width={0} height={0} />
    </g>
  );
};

/** a lantern; on 0..1 */
export const Lantern: React.FC<{ x: number; y: number; s: number; on: number; id: string; t: number }> = ({ x, y, s, on, id, t }) => (
  <g>
    {on > 0 && <Glow id={id} x={x} y={y} rx={200 * s} ry={150 * s} c="#ffc46a" o={(0.55 + 0.05 * Math.sin(t * 11 + x)) * on} mid={0.25} />}
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-12} y={-20} width={24} height={34} rx={4} fill={on > 0.05 ? '#ffe2a0' : '#3a3440'} opacity={on > 0.05 ? 0.5 + 0.5 * on : 1} />
      <path d="M-12 -20 L12 -20 L0 -32 Z" fill="#2a2430" />
    </g>
  </g>
);

/* ---------------- empty tents at dawn (10) ---------------- */
export const DW = { ground: 1180, n: 7, spacing: 330 };
export const CampDawn: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="cdSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a4458" /><stop offset="0.7" stopColor="#c9a08a" /><stop offset="1" stopColor="#e8c4a8" /></linearGradient>
      <linearGradient id="cdSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9a888" /><stop offset="1" stopColor="#7a6050" /></linearGradient>
    </defs>
    <rect x={-400} y={-192} width={2800} height={1100} fill="url(#cdSky)" />
    <ellipse cx={300} cy={860} rx={90} ry={90} fill="#f6e0c0" opacity={0.85} />
    {/* far tents + smoke haze */}
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${-400 + i * 180} 900 l60 -70 l60 70 Z`} fill="#8a7078" opacity={0.7} />)}
    <rect x={-400} y={890} width={2800} height={1400} fill="url(#cdSand)" />
    {/* the near row of empty tents (doors open, dark inside) */}
    {Array.from({ length: DW.n }, (_, i) => {
      const x = -260 + i * DW.spacing;
      return (
        <g key={i}>
          <path d={`M${x - 150} ${DW.ground} L${x} ${DW.ground - 300} L${x + 150} ${DW.ground} Z`} fill="#b8a48c" />
          <path d={`M${x} ${DW.ground - 300} L${x + 150} ${DW.ground} L${x + 60} ${DW.ground} Z`} fill="#8a7464" />
          <path d={`M${x - 50} ${DW.ground} L${x} ${DW.ground - 170} L${x + 50} ${DW.ground} Z`} fill="#2a2228" />
          <path d={`M${x + 150} ${DW.ground} L${x + 330} ${DW.ground + 20} L${x + 60} ${DW.ground + 20} Z`} fill="#5a4458" opacity={0.3} />
        </g>
      );
    })}
  </g>
);

/** a pair of sandals on the sand (prop) */
export const Sandals: React.FC<{ x: number; y: number; c?: string; rot?: number }> = ({ x, y, c = '#6a4a34', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse cx={-30} cy={0} rx={44} ry={12} fill={c} /><ellipse cx={30} cy={6} rx={44} ry={12} fill={c} />
    <path d="M-50 -4 Q-30 -18 -10 -4 M10 2 Q30 -12 50 2" stroke="#3a2a1e" strokeWidth={5} fill="none" />
  </g>
);

/** a shovel stuck in the sand, blade down */
export const Shovel: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-6} y={-300} width={12} height={290} fill="#8a6a44" />
    <rect x={-22} y={-310} width={44} height={14} rx={6} fill="#6a4e32" />
    <path d="M-34 -10 L34 -10 L26 30 L-26 30 Z" fill="#7a7a80" />
  </g>
);

/** thin dog, side view facing right, origin = between the feet; sniff 0..1 (head down), walk phase */
export const Dog: React.FC<{ x: number; y: number; s?: number; sniff: number; ph: number; tail: number }> = ({ x, y, s = 1, sniff, ph, tail }) => {
  const leg = (lx: number, a: number) => <path d={limb(lx, -90, lx + Math.sin(a) * 18, 0, 12, 8)} fill="#7a5e44" />;
  const hy = -120 + 70 * sniff, hx = 120 + 10 * sniff;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {leg(-70, ph + Math.PI)}{leg(60, ph)}
      <path d={`M-90 -110 Q${-130} ${-150 - 20 * tail} ${-150} ${-170 + 30 * tail}`} stroke="#8a6a4e" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M-100 -120 Q-100 -150 -60 -146 L60 -146 Q100 -150 100 -116 Q96 -90 60 -92 L-70 -92 Q-100 -92 -100 -120 Z" fill="#9a7a5a" />
      <path d="M-60 -100 Q0 -88 60 -100" stroke="#6a4e36" strokeWidth={4} fill="none" />
      {[-40, -20, 0, 20].map((r) => <path key={r} d={`M${r} -142 L${r + 4} -110`} stroke="#7a5e44" strokeWidth={3} opacity={0.6} />)}
      <path d={limb(80, -130, hx, hy + 10, 30, 22)} fill="#9a7a5a" />
      <g transform={`translate(${hx} ${hy}) rotate(${40 * sniff})`}>
        <ellipse cx={0} cy={0} rx={30} ry={24} fill="#9a7a5a" />
        <path d="M20 -6 L62 4 L58 16 L18 14 Z" fill="#8a6a4e" />
        <circle cx={60} cy={8} r={6} fill="#2a1e16" />
        <path d="M-14 -16 L-4 -44 L8 -18 Z" fill="#7a5e44" />
        <circle cx={10} cy={-4} r={3.5} fill="#1a1410" />
      </g>
      {leg(-50, ph)}{leg(80, ph + Math.PI)}
    </g>
  );
};

export { Puff };
