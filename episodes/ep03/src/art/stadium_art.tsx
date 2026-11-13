import React from 'react';
import { W, H, rng } from './world';

/**
 * EP03 set "stadium": aerial bowl (19), low view of the stage with giant screens (20), the stands (21),
 * and a dark near-crowd backdrop (22). Floodlights, beams, screens and every person are live.
 */
const CROWD_COLS = ['#c9b8a8', '#8a9ab0', '#d8d0c0', '#6a7a8a', '#b88a7a', '#9a8a6e', '#e3dfd4', '#5a6a7a', '#a87a6a', '#7a6a7a'];

/* ------------------------------------------------------------------ aerial bowl (19) */
export const BOWL = { cx: 648, cy: 1260, pitch: [250, 140], inner: [285, 165], outer: [560, 320], roof: [610, 352] };
const ellP = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy} A${rx} ${ry} 0 1 1 ${cx + rx} ${cy} A${rx} ${ry} 0 1 1 ${cx - rx} ${cy} Z`;
/** floodlight bank positions on the roof ring (angle, rad) */
export const BANKS = [-2.45, -0.7, 0.7, 2.45].map((a) => ({ a, x: BOWL.cx + Math.cos(a) * BOWL.roof[0], y: BOWL.cy + Math.sin(a) * BOWL.roof[1] }));

export const BowlBand: React.FC = () => {
  const B = BOWL; const r = rng(9);
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < 4200; i++) {
    const a = r() * Math.PI * 2, f = Math.sqrt(r());
    const rx = B.inner[0] + (B.outer[0] - B.inner[0]) * f, ry = B.inner[1] + (B.outer[1] - B.inner[1]) * f;
    const x = B.cx + Math.cos(a) * rx, y = B.cy + Math.sin(a) * ry;
    const s = 2.2 + 1.8 * ((y - (B.cy - B.outer[1])) / (2 * B.outer[1]));
    dots.push(<circle key={i} cx={x} cy={y} r={s} fill={CROWD_COLS[Math.floor(r() * CROWD_COLS.length)]} />);
  }
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#05070f" />
      {/* city at night around the stadium: street grid lights */}
      {Array.from({ length: 900 }).map((_, i) => { const x = r() * W, y = 300 + r() * 2000; const d = Math.hypot((x - B.cx) / 1.0, (y - B.cy) / 0.6); if (d < 680) return null; return <circle key={`c${i}`} cx={x} cy={y} r={1.2 + r() * 1.6} fill={r() < 0.7 ? '#ffcf86' : '#bfe3ff'} opacity={0.35 + r() * 0.4} />; })}
      {[[-0.3, 380], [0.25, 1700], [1.2, 0]].map(([a, y0], i) => <path key={i} d={`M-100 ${y0 + 600} L${W + 100} ${y0 + 600 - Math.tan(a) * 1400}`} stroke="#ffb860" strokeOpacity={0.18} strokeWidth={5} />)}
      {/* outer wall + roof ring */}
      <path d={ellP(B.cx, B.cy + 40, B.roof[0] + 20, B.roof[1] + 40)} fill="#141826" />
      <path d={ellP(B.cx, B.cy, B.roof[0], B.roof[1])} fill="#1e2333" />
      <path d={ellP(B.cx, B.cy, B.outer[0], B.outer[1])} fill="#2a2f3e" />
      {dots}
      {[0.25, 0.5, 0.75].map((f) => <path key={f} d={ellP(B.cx, B.cy, B.inner[0] + (B.outer[0] - B.inner[0]) * f, B.inner[1] + (B.outer[1] - B.inner[1]) * f)} fill="none" stroke="#1a1e2a" strokeWidth={3} opacity={0.6} />)}
      {Array.from({ length: 16 }).map((_, i) => { const a = (i / 16) * Math.PI * 2; return <path key={`v${i}`} d={`M${B.cx + Math.cos(a) * B.inner[0]} ${B.cy + Math.sin(a) * B.inner[1]} L${B.cx + Math.cos(a) * B.outer[0]} ${B.cy + Math.sin(a) * B.outer[1]}`} stroke="#1a1e2a" strokeWidth={5} opacity={0.7} />; })}
      {/* pitch + stage */}
      <path d={ellP(B.cx, B.cy, B.pitch[0], B.pitch[1])} fill="#2e5a3a" />
      {[0.33, 0.66].map((f) => <path key={f} d={ellP(B.cx, B.cy, B.pitch[0] * f, B.pitch[1] * f)} fill="none" stroke="#4a7a56" strokeWidth={2} />)}
      {/* pitch crowd near the stage */}
      {Array.from({ length: 700 }).map((_, i) => { const a = r() * Math.PI * 2, f = 0.35 + 0.6 * Math.sqrt(r()); return <circle key={`p${i}`} cx={B.cx + Math.cos(a) * B.pitch[0] * 0.9 * f} cy={B.cy + 40 + Math.sin(a) * B.pitch[1] * 0.8 * f} r={2.2} fill={CROWD_COLS[Math.floor(r() * 10)]} />; })}
      <rect x={B.cx - 46} y={B.cy - 30} width={92} height={46} fill="#d8d8de" />
      <rect x={B.cx - 46} y={B.cy + 16} width={92} height={10} fill="#8a8a94" />
      <rect x={B.cx - 70} y={B.cy - 90} width={40} height={30} fill="#f4f8ff" /><rect x={B.cx + 30} y={B.cy - 90} width={40} height={30} fill="#f4f8ff" />
      {/* floodlight masts (dark, panels lit live) */}
      {BANKS.map((b, i) => <g key={i} fill="#10131c"><rect x={b.x - 6} y={b.y - 120} width={12} height={130} /><rect x={b.x - 44} y={b.y - 160} width={88} height={44} /></g>)}
    </g>
  );
};
/** dark wedge over the bowl sector a bank lights (lifts when the bank snaps on) */
export const sectorPath = (a0: number, a1: number) => {
  const B = BOWL; const pts: string[] = [`M${B.cx} ${B.cy}`];
  for (let i = 0; i <= 16; i++) { const a = a0 + ((a1 - a0) * i) / 16; pts.push(`L${B.cx + Math.cos(a) * (B.roof[0] + 30)} ${B.cy + Math.sin(a) * (B.roof[1] + 50)}`); }
  return pts.join(' ') + 'Z';
};
export const FloodBank: React.FC<{ x: number; y: number; on: number; s?: number; tx?: number; ty?: number }> = ({ x, y, on, s = 1, tx, ty }) => (
  <g>
    {on > 0 && tx !== undefined && ty !== undefined && (
      <path d={`M${x - 40 * s} ${y} L${x + 40 * s} ${y} L${tx + 180 * s} ${ty} L${tx - 180 * s} ${ty} Z`} fill="url(#flBeam)" opacity={0.5 * on} />
    )}
    <rect x={x - 44 * s} y={y - 22 * s} width={88 * s} height={44 * s} fill={on > 0 ? '#f4f8ff' : '#1c2030'} />
    {on > 0 && Array.from({ length: 8 }).map((_, i) => <rect key={i} x={x - 40 * s + (i % 4) * 21 * s} y={y - 19 * s + Math.floor(i / 4) * 20 * s} width={17 * s} height={16 * s} fill="#ffffff" />)}
    {on > 0 && <ellipse cx={x} cy={y} rx={160 * s} ry={120 * s} fill="url(#flGlow)" opacity={on} />}
  </g>
);
export const FloodDefs: React.FC = () => (
  <defs>
    <radialGradient id="flGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#f4f8ff" stopOpacity={0.9} /><stop offset="0.3" stopColor="#dfe9ff" stopOpacity={0.35} /><stop offset="1" stopColor="#dfe9ff" stopOpacity={0} /></radialGradient>
    <linearGradient id="flBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f8ff" stopOpacity={0.55} /><stop offset="1" stopColor="#f4f8ff" stopOpacity={0} /></linearGradient>
  </defs>
);

/* ------------------------------------------------------------------ low view of the stage (20) */
export const STAGE = { cx: 648, floor: 1330, w: 520, scrL: { x: 150, y: 640, w: 330, h: 420 }, scrR: { x: 816, y: 640, w: 330, h: 420 }, man: { x: 648, y: 1290, h: 150 } };
export const LowBand: React.FC = () => {
  const r = rng(21); const S = STAGE;
  const rows: React.ReactNode[] = [];
  // the stands behind the stage, tier by tier up into the dark
  for (let row = 0; row < 26; row++) {
    const y = 1180 - row * 30; const s = 1.6 - row * 0.03;
    for (let x = -20; x < W + 20; x += 9 * s + r() * 3) rows.push(<ellipse key={`${row}-${x}`} cx={x} cy={y + r() * 6} rx={3.2 * s} ry={3.6 * s} fill={CROWD_COLS[Math.floor(r() * 10)]} opacity={0.25 + 0.5 * (1 - row / 26)} />);
  }
  return (
    <g>
      <defs>
        <linearGradient id="lwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05070f" /><stop offset="0.5" stopColor="#0d1222" /><stop offset="1" stopColor="#1a2036" /></linearGradient>
        <radialGradient id="lwBack" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#f4f8ff" stopOpacity={0.85} /><stop offset="0.3" stopColor="#c9d8ff" stopOpacity={0.35} /><stop offset="1" stopColor="#c9d8ff" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#lwSky)" />
      <rect x={0} y={380} width={W} height={820} fill="#0c1020" />
      {rows}
      <rect x={0} y={360} width={W} height={26} fill="#05070f" />
      {/* screen frames + truss */}
      {[S.scrL, S.scrR].map((s, i) => <g key={i}><rect x={s.x - 14} y={s.y - 14} width={s.w + 28} height={s.h + 28} fill="#05060b" /><rect x={s.x + s.w / 2 - 8} y={s.y + s.h + 14} width={16} height={S.floor - s.y - s.h} fill="#05060b" /></g>)}
      <rect x={S.cx - S.w / 2 - 60} y={980} width={S.w + 120} height={18} fill="#05060b" />
      {[S.cx - S.w / 2 - 50, S.cx + S.w / 2 + 34].map((x) => <rect key={x} x={x} y={980} width={16} height={S.floor - 980} fill="#05060b" />)}
      {/* backlight behind the stage */}
      <ellipse cx={S.cx} cy={S.floor - 120} rx={380} ry={260} fill="url(#lwBack)" />
      {/* stage */}
      <rect x={S.cx - S.w / 2} y={S.floor} width={S.w} height={60} fill="#11131c" />
      <rect x={S.cx - S.w / 2} y={S.floor} width={S.w} height={4} fill="#c9d8ff" opacity={0.6} />
      {/* pitch floor */}
      <rect x={0} y={S.floor + 60} width={W} height={H} fill="#070910" />
    </g>
  );
};
/** the man: tiny backlit silhouette, plain clothes, no face. open 0..1 = arms opening (on twos) */
export const ManSil: React.FC<{ x: number; y: number; h: number; open: number; fill: string }> = ({ x, y, h, open, fill }) => {
  const u = h / 7; const shY = y - h * 0.8;
  const arm = (sd: -1 | 1) => { const a = (0.15 + 0.95 * open) * Math.PI / 2; const L = u * 2.9; const ex = x + sd * (u * 0.9 + Math.sin(a) * L * 0.5), ey = shY + u * 0.15 + Math.cos(a) * L * 0.5; const hx = x + sd * (u * 0.9 + Math.sin(a) * L), hy = shY + u * 0.15 + Math.cos(a) * L - open * u * 0.3; return `M${x + sd * u * 0.85} ${shY + u * 0.15} L${ex} ${ey} L${hx} ${hy}`; };
  return (
    <g>
      <path d={`M${x - u * 0.95} ${shY + u * 0.1} Q${x} ${shY - u * 0.15} ${x + u * 0.95} ${shY + u * 0.1} L${x + u * 0.65} ${y - h * 0.45} L${x + u * 0.5} ${y} L${x + u * 0.12} ${y} L${x} ${y - h * 0.4} L${x - u * 0.12} ${y} L${x - u * 0.5} ${y} L${x - u * 0.65} ${y - h * 0.45} Z`} fill={fill} />
      <path d={arm(-1)} stroke={fill} strokeWidth={u * 0.32} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={arm(1)} stroke={fill} strokeWidth={u * 0.32} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x={x - u * 0.15} y={shY - u * 0.25} width={u * 0.3} height={u * 0.3} fill={fill} />
      <ellipse cx={x} cy={shY - u * 0.6} rx={u * 0.42} ry={u * 0.5} fill={fill} />
    </g>
  );
};

/* ------------------------------------------------------------------ stands, frontal (21) */
export const STANDS = { rows: 10, y0: 640, dy: 118, s0: 0.7, ds: 0.075 };
export const StandsBand: React.FC = () => {
  const S = STANDS;
  return (
    <g>
      <defs>
        <linearGradient id="stHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05070f" /><stop offset="0.25" stopColor="#141a2c" /><stop offset="1" stopColor="#0a0d18" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#stHaze)" />
      <rect x={0} y={330} width={W} height={60} fill="#05060b" />
      {Array.from({ length: S.rows + 2 }).map((_, i) => { const y = S.y0 + i * S.dy + 6; return <g key={i}><rect x={0} y={y} width={W} height={S.dy} fill={i % 2 ? '#141a2a' : '#171d2e'} /><rect x={0} y={y} width={W} height={5} fill="#2a3248" /></g>; })}
      {/* stairway aisles */}
      {[300, 980].map((x) => <path key={x} d={`M${x - 20} 400 L${x + 20} 400 L${x + (x - 648) * 0.25 + 50} ${H} L${x + (x - 648) * 0.25 - 50} ${H} Z`} fill="#0d111d" />)}
    </g>
  );
};
/** one spectator facing the stage/camera; k 0..1 = kneel (head bows, body lowers). */
export const Spectator: React.FC<{ x: number; y: number; s: number; k: number; col: string; head: string; hijab: boolean }> = ({ x, y, s, k, col, head, hijab }) => {
  const hh = 96 * s * (1 - 0.42 * k); const bw = 24 * s;
  const headY = y - hh - 2 * s + 8 * s * k;
  return (
    <g>
      <path d={`M${x - bw} ${y} L${x - bw * 0.9} ${y - hh + 14 * s} Q${x} ${y - hh + 4 * s} ${x + bw * 0.9} ${y - hh + 14 * s} L${x + bw} ${y} Z`} fill={col} />
      {hijab ? <ellipse cx={x} cy={headY} rx={10.5 * s} ry={12 * s} fill="#2a2a34" /> : null}
      <ellipse cx={x} cy={headY + (hijab ? 1.5 * s : 0)} rx={(hijab ? 6.5 : 8.5) * s} ry={(hijab ? 8 : 10) * s * (1 - 0.25 * k)} fill={k > 0.5 ? '#2a2420' : head} />
    </g>
  );
};
export const STAND_PPL = (() => {
  const r = rng(33); const S = STANDS; const out: { x: number; y: number; s: number; col: string; head: string; hijab: boolean; stay: boolean; d: number }[] = [];
  for (let row = 0; row < S.rows; row++) {
    const s = S.s0 + row * S.ds; const y = S.y0 + (row + 1) * S.dy;
    for (let x = -30 + r() * 20; x < W + 30; x += 46 * s + r() * 10) out.push({ x, y, s, col: CROWD_COLS[Math.floor(r() * 10)], head: r() < 0.5 ? '#9a6a52' : '#b07a5e', hijab: r() < 0.35, stay: r() < 0.09, d: r() * 0.12 });
  }
  return out;
})();

/* ------------------------------------------------------------------ near dark backdrop (22) */
export const NearBand: React.FC = () => {
  const r = rng(44);
  return (
    <g>
      <defs>
        <linearGradient id="nbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#03040a" /><stop offset="0.45" stopColor="#070a14" /><stop offset="0.75" stopColor="#121a30" /><stop offset="1" stopColor="#0a0d18" /></linearGradient>
        <radialGradient id="nbStage" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#f4f8ff" stopOpacity={0.7} /><stop offset="0.35" stopColor="#9fb4e6" stopOpacity={0.25} /><stop offset="1" stopColor="#9fb4e6" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#nbSky)" />
      {/* far stands: dim dotted rows below the quote area */}
      {Array.from({ length: 1400 }).map((_, i) => { const y = 1020 + r() * 380; return <circle key={i} cx={r() * W} cy={y} r={1.6 + (y - 1020) / 200} fill={CROWD_COLS[Math.floor(r() * 10)]} opacity={0.18 + (y - 1020) / 1400} />; })}
      {/* the stage glow far behind, low */}
      <ellipse cx={420} cy={1450} rx={520} ry={300} fill="url(#nbStage)" />
      <rect x={300} y={1420} width={240} height={30} fill="#d8e2ff" opacity={0.5} />
    </g>
  );
};
/** kneeling back seen from behind (bowed head), lit rim from the stage; br = breathing (on twos) */
export const KneelBack: React.FC<{ x: number; y: number; s: number; col: string; rim: string; br: number; hijab?: boolean }> = ({ x, y, s, col, rim, br, hijab }) => {
  const b = Math.sin(br) * 3 * s;
  return (
    <g>
      <path d={`M${x - 70 * s} ${y} Q${x - 80 * s} ${y - 70 * s} ${x - 40 * s} ${y - 110 * s - b} Q${x} ${y - 128 * s - b} ${x + 46 * s} ${y - 108 * s - b} Q${x + 82 * s} ${y - 66 * s} ${x + 72 * s} ${y} Z`} fill={col} />
      {hijab ? <path d={`M${x - 34 * s} ${y - 100 * s - b} Q${x - 30 * s} ${y - 150 * s - b} ${x + 4 * s} ${y - 148 * s - b} Q${x + 36 * s} ${y - 146 * s - b} ${x + 34 * s} ${y - 104 * s - b} Z`} fill={col} /> : <ellipse cx={x + 2 * s} cy={y - 126 * s - b} rx={22 * s} ry={20 * s} fill={col} />}
      <path d={`M${x - 40 * s} ${y - 112 * s - b} Q${x} ${y - 130 * s - b} ${x + 46 * s} ${y - 110 * s - b}`} stroke={rim} strokeOpacity={0.55} strokeWidth={3 * s} fill="none" />
    </g>
  );
};

/** the old man who does not kneel: front, three-quarter turn away from the stage; peci, plain shirt. turn -1..1, br breathing (on twos) */
export const StandingOldMan: React.FC<{ x: number; y: number; h: number; turn: number; br: number; rim: string }> = ({ x, y, h, turn, br, rim }) => {
  const u = h / 7; const b = Math.sin(br) * u * 0.03;
  const shY = y - h * 0.8 - b; const hx = x + turn * u * 0.12, hy = shY - u * 0.62;
  const skin = '#9a6a52', skinD = '#6e4a3a', shirt = '#c8c2b2', shirtD = '#8e8878';
  return (
    <g>
      <path d={`M${x - u * 1.0} ${shY + u * 0.15} Q${x} ${shY - u * 0.15} ${x + u * 1.0} ${shY + u * 0.15} L${x + u * 0.78} ${y} L${x - u * 0.78} ${y} Z`} fill={shirt} />
      <path d={`M${x + u * 0.2} ${shY + u * 0.05} Q${x + u * 0.8} ${shY} ${x + u * 1.0} ${shY + u * 0.15} L${x + u * 0.78} ${y} L${x + u * 0.25} ${y} Z`} fill={shirtD} opacity={0.6} />
      <path d={`M${x - u * 0.12} ${shY - u * 0.02} L${x} ${shY + u * 0.4} L${x + u * 0.12} ${shY - u * 0.02}`} stroke={shirtD} strokeWidth={u * 0.05} fill="none" />
      {[0.9, 1.4, 1.9].map((f) => <circle key={f} cx={x} cy={shY + u * f} r={u * 0.035} fill={shirtD} />)}
      {/* arms hanging still, a slight tremor in the right hand */}
      <path d={`M${x - u * 0.95} ${shY + u * 0.2} L${x - u * 1.12} ${shY + u * 1.5} L${x - u * 1.0} ${shY + u * 2.7}`} stroke={shirt} strokeWidth={u * 0.32} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${x + u * 0.95} ${shY + u * 0.2} L${x + u * 1.12} ${shY + u * 1.5} L${x + u * 1.02 + Math.sin(br * 4) * u * 0.02} ${shY + u * 2.7}`} stroke={shirtD} strokeWidth={u * 0.32} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={x - u * 1.0} cy={shY + u * 2.85} r={u * 0.16} fill={skin} /><circle cx={x + u * 1.02} cy={shY + u * 2.85} r={u * 0.16} fill={skinD} />
      <rect x={hx - u * 0.17} y={shY - u * 0.28} width={u * 0.34} height={u * 0.34} fill={skinD} />
      <ellipse cx={hx} cy={hy} rx={u * 0.42} ry={u * 0.5} fill={skin} />
      <path d={`M${hx + turn * u * 0.05} ${hy - u * 0.5} A${u * 0.42} ${u * 0.5} 0 0 1 ${hx + u * 0.42} ${hy} A${u * 0.42} ${u * 0.5} 0 0 1 ${hx + turn * u * 0.05} ${hy + u * 0.5} Q${hx + u * 0.15} ${hy} ${hx + turn * u * 0.05} ${hy - u * 0.5} Z`} fill={skinD} opacity={0.5} />
      {/* eyes looking off, down; a grey moustache */}
      {[-1, 1].map((sd) => <path key={sd} d={`M${hx + turn * u * 0.14 + sd * u * 0.16 - u * 0.07} ${hy - u * 0.02} Q${hx + turn * u * 0.14 + sd * u * 0.16} ${hy + u * 0.03} ${hx + turn * u * 0.14 + sd * u * 0.16 + u * 0.07} ${hy - u * 0.02}`} stroke="#2a1d18" strokeWidth={u * 0.035} fill="none" />)}
      <path d={`M${hx + turn * u * 0.14 - u * 0.12} ${hy + u * 0.22} Q${hx + turn * u * 0.14} ${hy + u * 0.17} ${hx + turn * u * 0.14 + u * 0.12} ${hy + u * 0.22}`} stroke="#bdb6aa" strokeWidth={u * 0.06} fill="none" />
      <path d={`M${hx - u * 0.4} ${hy - u * 0.2} L${hx - u * 0.37} ${hy - u * 0.58} L${hx + u * 0.37} ${hy - u * 0.58} L${hx + u * 0.4} ${hy - u * 0.2} Z`} fill="#141214" />
      {/* cool rim from the stage behind */}
      <g stroke={rim} strokeOpacity={0.7} fill="none" strokeWidth={u * 0.05} strokeLinecap="round">
        <path d={`M${hx - u * 0.37} ${hy - u * 0.58} L${hx + u * 0.37} ${hy - u * 0.58}`} />
        <path d={`M${hx - u * 0.42} ${hy - u * 0.1} Q${hx - u * 0.44} ${hy + u * 0.3} ${hx - u * 0.2} ${hy + u * 0.48}`} />
        <path d={`M${x - u * 0.2} ${shY - u * 0.08} Q${x - u * 0.8} ${shY - u * 0.02} ${x - u * 1.02} ${shY + u * 0.25} L${x - u * 1.17} ${shY + u * 1.5}`} />
      </g>
    </g>
  );
};
