import React from 'react';
import { W, H, rng } from './world';

/* ------------------------------------------------------------------------------------------
 * EP08 set "refuge". The Sacred House is NOT drawn: only the white-clad crowd from behind,
 * tall generic minarets and a great soft white glow (gold rim) where the House would be.
 * mecca-night / mecca-dawn: the same view in two palettes (S07, S14); sand: flat dawn sand with
 * tire tracks that end (S13); hood: macro on a truck hood in the desert sun (S11).
 * ---------------------------------------------------------------------------------------- */
const hx = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = hx(a), B = hx(b), k = Math.min(1, Math.max(0, t));
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('');
};
export type Mood = 'night' | 'dawn';
export const M = { f: 1000, hc: 14, YH: 900, VX: 648, glowX: 648, glowY: 820 };
export const mp = (X: number, Y: number, Z: number): [number, number] => [M.VX + (M.f * X) / Z, M.YH + (M.f * (M.hc - Y)) / Z];
const PAL = {
  night: { sky: ['#050a18', '#0a1426', '#1c2a46'], min: '#0c1528', minLit: '#3a4a68', ground: '#18233a', haze: '#2a3a5a' },
  dawn: { sky: ['#2a3654', '#7a8aa8', '#cfd8e6'], min: '#3a4660', minLit: '#9aa8c0', ground: '#8a94a8', haze: '#b8c2d4' },
};

const minaret = (x: number, base: number, h: number, w: number, c: string, lit: string, key: string) => (
  <g key={key}>
    <rect x={x - w / 2} y={base - h} width={w} height={h} fill={c} />
    <rect x={x - w / 2} y={base - h} width={w * 0.25} height={h} fill={lit} opacity={0.6} />
    {[0.55, 0.78].map((k) => <g key={k}><rect x={x - w * 0.85} y={base - h * k - 8} width={w * 1.7} height={10} fill={c} /><rect x={x - w * 0.75} y={base - h * k - 22} width={w * 1.5} height={14} fill={c} opacity={0.9} /></g>)}
    <rect x={x - w * 0.38} y={base - h - 60} width={w * 0.76} height={60} fill={c} />
    <path d={`M ${x - w * 0.4} ${base - h - 60} L ${x} ${base - h - 150} L ${x + w * 0.4} ${base - h - 60} Z`} fill={c} />
  </g>
);

export const MeccaBand: React.FC<{ mood: Mood }> = ({ mood }) => {
  const C = PAL[mood];
  return (
    <g>
      <defs>
        <linearGradient id={`rfSky${mood}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.sky[0]} /><stop offset="0.5" stopColor={C.sky[1]} /><stop offset="1" stopColor={C.sky[2]} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#rfSky${mood})`} />
      {mood === 'night' && Array.from({ length: 40 }, (_, i) => { const r = rng(900 + i); return <circle key={i} cx={r() * W} cy={r() * 500} r={1 + r() * 1.5} fill="#e9eef8" opacity={0.6} />; })}
      {/* colonnade / arcades low around the open court (generic, no detail) */}
      <rect x={0} y={M.YH - 120} width={W} height={130} fill={C.min} />
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M ${i * 62} ${M.YH - 10} L ${i * 62} ${M.YH - 70} Q ${i * 62 + 31} ${M.YH - 104} ${i * 62 + 62} ${M.YH - 70} L ${i * 62 + 62} ${M.YH - 10}`} fill={C.minLit} opacity={0.35} />)}
      {/* tall generic minarets around the glow */}
      {minaret(170, M.YH - 100, 560, 70, C.min, C.minLit, 'm1')}
      {minaret(330, M.YH - 100, 660, 80, C.min, C.minLit, 'm2')}
      {minaret(966, M.YH - 100, 680, 80, C.min, C.minLit, 'm3')}
      {minaret(1126, M.YH - 100, 570, 70, C.min, C.minLit, 'm4')}
      {/* the court floor, pale, receding */}
      <rect x={0} y={M.YH} width={W} height={H - M.YH} fill={C.ground} />
      <rect x={0} y={M.YH} width={W} height={40} fill={C.haze} opacity={0.6} />
    </g>
  );
};

/** the great soft white glow with a gold rim, where the House would be (environment, ON ONES). k = swell */
export const Glow: React.FC<{ k: number; mood: Mood }> = ({ k, mood }) => {
  const r = 360 + 120 * k;
  return (
    <g>
      <defs>
        <radialGradient id={`rfGlow${mood}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity={1} /><stop offset="0.18" stopColor="#ffffff" stopOpacity={0.9} /><stop offset="0.4" stopColor="#fdf8ec" stopOpacity={0.65} />
          <stop offset="0.62" stopColor="#f3dca0" stopOpacity={0.45} /><stop offset="0.8" stopColor="#f3dca0" stopOpacity={0.12} /><stop offset="1" stopColor="#f3dca0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={M.glowX} cy={M.glowY} rx={r * 1.5} ry={r} fill={`url(#rfGlow${mood})`} opacity={mood === 'night' ? 0.95 : 0.8} />
      {/* soft light thrown across the court floor */}
      <ellipse cx={M.glowX} cy={M.YH + 260} rx={r * 1.8} ry={r * 0.6} fill="#f6efe0" opacity={(mood === 'night' ? 0.18 : 0.12) * (1 + 0.5 * k)} />
    </g>
  );
};

/** the white-clad crowd from behind as perspective rows of dotted strokes; flows toward the glow (people: ON TWOS).
 *  arms 0..1 = hands raised toward the glow (S14) */
export const WhiteCrowd: React.FC<{ t2: number; mood: Mood; arms?: number; z0?: number; z1?: number }> = ({ t2, mood, arms = 0, z0 = 9, z1 = 220 }) => {
  const rows: React.ReactNode[] = [];
  const r = rng(911);
  const white = mood === 'night' ? '#dfe4ee' : '#f4f1ea', shade = mood === 'night' ? '#9aa6bc' : '#c9cfd8';
  const flow = (t2 * 0.9) % 1;
  for (let i = 0; ; i++) {
    const z = z1 / Math.pow(1.045, i) * (1 + 0.045 * flow);
    if (z < z0) break;
    const s = M.f / z;
    const [xl, y] = mp(-60, 1.5, z), [xr] = mp(60, 1.5, z);
    const gap = 0.6 * s, ph = (r() * gap) % gap;
    const lit = Math.max(0, 1 - Math.abs(y - M.YH) / 900);
    const fade = (c: string) => mix(c, mood === 'night' ? '#2a3a5a' : '#cfd8e6', Math.min(0.75, z / 260));
    rows.push(
      <g key={i}>
        <path d={`M ${xl} ${y + 0.3 * s} L ${xr} ${y + 0.3 * s}`} stroke={fade(mix(shade, white, lit))} strokeWidth={0.42 * s} strokeDasharray={`${0.46 * s} ${gap - 0.46 * s}`} strokeDashoffset={-ph} strokeLinecap="round" />
        <path d={`M ${xl} ${y} L ${xr} ${y}`} stroke={fade('#1e1a18')} strokeWidth={0.24 * s} strokeDasharray={`0.01 ${gap * 2}`} strokeDashoffset={-ph} strokeLinecap="round" />
        <path d={`M ${xl} ${y - 0.02 * s} L ${xr} ${y - 0.02 * s}`} stroke={fade(white)} strokeWidth={0.26 * s} strokeDasharray={`0.01 ${gap * 2}`} strokeDashoffset={-ph - gap} strokeLinecap="round" />
      </g>,
    );
    if (arms > 0.02 && z < 90) {
      let d = '';
      const n = Math.floor((xr - xl) / (gap * 1.6));
      for (let k = 0; k < n; k++) {
        if ((k * 7 + i * 3) % 5 > 3 * arms + 1) continue;
        const ax = xl + ((k * 1.618 * gap + i * 41) % (xr - xl)), up = (0.35 + 0.5 * arms + 0.08 * Math.sin(t2 * 4 + k + i)) * s;
        const lean = (M.glowX - ax) * 0.0008 * s;
        d += `M ${ax.toFixed(1)} ${(y + 0.15 * s).toFixed(1)} l ${lean.toFixed(1)} ${(-up).toFixed(1)} `;
      }
      if (d) {
        rows.push(<path key={`a${i}`} d={d} stroke={fade(white)} strokeWidth={Math.max(1, 0.1 * s)} strokeLinecap="round" />);
        rows.push(<path key={`h${i}`} d={d.replace(/l ([-\d.]+) ([-\d.]+) /g, (_m, a, b) => `m ${a} ${b} l 0.01 0 `)} stroke={fade('#a8765a')} strokeWidth={Math.max(1.6, 0.15 * s)} strokeLinecap="round" />);
      }
    }
  }
  return <g>{rows}</g>;
};

/* ------------------------------------------ S13: sand ------------------------------------------ */
export const S = { f: 1000, hc: 1.25, YH: 1000, VX: 648, endZ: 42 };
export const sp = (X: number, Z: number): [number, number] => [S.VX + (S.f * X) / Z, S.YH + (S.f * S.hc) / Z];
export const SandBand: React.FC = () => {
  const P = (X: number, Z: number) => sp(X, Z).map((v) => v.toFixed(1)).join(',');
  const track = (X: number, key: string) => {
    const out: React.ReactNode[] = [];
    out.push(<polygon key={`${key}b`} points={`${P(X - 0.22, 2)} ${P(X + 0.22, 2)} ${P(X + 0.22, S.endZ)} ${P(X - 0.22, S.endZ)}`} fill="#a8907a" />);
    for (let z = 2.2; z < S.endZ; z *= 1.06) out.push(<polygon key={`${key}${z.toFixed(2)}`} points={`${P(X - 0.22, z)} ${P(X + 0.22, z)} ${P(X + 0.22, z * 1.015)} ${P(X - 0.22, z * 1.015)}`} fill="#8a7462" />);
    out.push(<polygon key={`${key}e`} points={`${P(X - 0.26, S.endZ)} ${P(X + 0.26, S.endZ)} ${P(X + 0.18, S.endZ * 1.04)} ${P(X - 0.18, S.endZ * 1.04)}`} fill="#c9b49a" />);
    return out;
  };
  return (
    <g>
      <defs>
        <linearGradient id="rsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3452" /><stop offset="0.7" stopColor="#c99a84" /><stop offset="1" stopColor="#f2c49a" /></linearGradient>
        <radialGradient id="rsSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff0d8" /><stop offset="0.3" stopColor="#f6c8a0" stopOpacity={0.6} /><stop offset="1" stopColor="#f6c8a0" stopOpacity={0} /></radialGradient>
        <linearGradient id="rsSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2c8a8" /><stop offset="0.3" stopColor="#cdb48a" /><stop offset="1" stopColor="#a8906c" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#rsSky)" />
      <circle cx={980} cy={S.YH - 20} r={460} fill="url(#rsSun)" />
      <circle cx={980} cy={S.YH - 20} r={40} fill="#fff4e0" />
      <rect x={0} y={S.YH} width={W} height={H - S.YH} fill="url(#rsSand)" />
      {/* faint ripples */}
      {Array.from({ length: 30 }, (_, i) => { const z = 2 + i * i * 0.12, [, y] = sp(0, z); return <path key={i} d={`M -40 ${y} Q 648 ${y - 4} ${W + 40} ${y + 2}`} stroke="#b89a78" strokeWidth={Math.max(1, 30 / z)} fill="none" opacity={0.35} />; })}
      {track(-1.3, 'a')}{track(-0.4, 'b')}{track(0.6, 'c')}{track(1.5, 'd')}
    </g>
  );
};

/** wind-lifted dust trails low over the sand (ON ONES) */
export const Drift: React.FC<{ t: number; y0: number; h: number; col?: string }> = ({ t, y0, h, col = '#f2dcc0' }) => {
  const r = rng(921);
  return <g>{Array.from({ length: 14 }, (_, i) => { const y = y0 + r() * h, w = 120 + r() * 260, x = ((r() * 1600 + t * (160 + r() * 120)) % 1700) - 200; return <ellipse key={i} cx={x} cy={y} rx={w} ry={4 + r() * 6} fill={col} opacity={0.25 + 0.15 * Math.sin(t * 2 + i)} />; })}</g>;
};

/** helmet half-buried in the sand (plain, no insignia) */
export const Helmet: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={20} cy={6} rx={70} ry={10} fill="#5a4630" opacity={0.35} />
    <path d="M -50 0 Q -48 -52 0 -56 Q 46 -54 52 -4 Z" fill="#6a6a4a" />
    <path d="M -40 -26 Q -20 -50 10 -50" stroke="#a8a880" strokeWidth={5} fill="none" opacity={0.7} />
    <path d="M -60 2 Q 0 -14 64 0 L 64 10 L -60 10 Z" fill="#cdb48a" />
  </g>
);

/* ------------------------------------------ S11: hood macro ------------------------------------------ */
export const HOOD = { top: 1060 };
export const HoodBand: React.FC = () => {
  const r = rng(931);
  return (
    <g>
      <defs>
        <linearGradient id="rhSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6d8b8" /><stop offset="1" stopColor="#f6eedc" /></linearGradient>
        <linearGradient id="rhMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8c49c" /><stop offset="0.3" stopColor="#c4ac80" /><stop offset="1" stopColor="#9a8460" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#rhSky)" />
      {/* soft desert + other trucks far behind (blurred by the band) */}
      <rect x={0} y={760} width={W} height={300} fill="#e2cca4" />
      {[160, 520, 900].map((x, i) => <rect key={x} x={x} y={820 - i * 6} width={220} height={120} rx={20} fill="#b8a07a" opacity={0.6} />)}
      {/* the hood: a broad curved metal surface filling the lower frame */}
      <path d={`M -40 ${HOOD.top} Q 648 ${HOOD.top - 60} ${W + 40} ${HOOD.top} L ${W + 40} ${H} L -40 ${H} Z`} fill="url(#rhMetal)" />
      <path d={`M -40 ${HOOD.top} Q 648 ${HOOD.top - 60} ${W + 40} ${HOOD.top}`} stroke="#fff2d0" strokeWidth={6} fill="none" opacity={0.8} />
      {/* panel seam, rivets, scuffs */}
      {Array.from({ length: 14 }, (_, i) => <path key={`s${i}`} d={`M ${r() * W} ${HOOD.top + 120 + r() * 1000} l ${40 + r() * 60} ${-4 + r() * 8}`} stroke="#e8d8b4" strokeWidth={3} opacity={0.5} />)}
    </g>
  );
};

/** grains of sand on the hood: dance increases with k, jump on the sync (environment: ON ONES) */
export const Grains: React.FC<{ t: number; k: number; jump: number }> = ({ t, k, jump }) => {
  const r = rng(941);
  const g = Array.from({ length: 120 }, () => ({ x: r() * W, y: HOOD.top + 60 + r() * 1100, s: 2 + r() * 4, ph: r() * 6 }));
  return (
    <g>
      {g.map((q, i) => {
        const hop = Math.abs(Math.sin(t * (30 + (i % 7) * 4) + q.ph)) * (4 * k + 60 * jump * (0.5 + 0.5 * Math.sin(q.ph * 3)));
        return <g key={i}><ellipse cx={q.x + 2} cy={q.y + 2} rx={q.s} ry={q.s * 0.6} fill="#6a5438" opacity={0.4} /><circle cx={q.x + Math.sin(t * 40 + i) * k * 2} cy={q.y - hop} r={q.s} fill="#e8d4a8" /></g>;
      })}
    </g>
  );
};

/** olive canteen with cap and strap, rattling (rot) */
export const Canteen: React.FC<{ x: number; y: number; s: number; rot: number; hop: number }> = ({ x, y, s, rot, hop }) => (
  <g transform={`translate(${x} ${y - hop}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={10} cy={hop / s + 92} rx={90} ry={14} fill="#5a4630" opacity={0.4} />
    <path d="M -70 -60 Q -76 40 -40 84 L 50 84 Q 86 40 80 -60 Q 70 -100 5 -104 Q -60 -100 -70 -60 Z" fill="#5f6a48" />
    <path d="M -60 -50 Q -64 30 -36 70" stroke="#8a9670" strokeWidth={10} fill="none" opacity={0.7} />
    <rect x={-18} y={-136} width={40} height={34} rx={6} fill="#3a3e30" />
    <path d="M 22 -120 Q 90 -150 120 -60" stroke="#3a3e30" strokeWidth={8} fill="none" />
  </g>
);

/** the soldier's hand resting on the hood, plain olive sleeve from the right; lift 0..1 raises the fingers/heel */
export const HoodHand: React.FC<{ x: number; y: number; lift: number; trem: number }> = ({ x, y, lift, trem }) => {
  const sk = '#a8765a', sh = '#7a5040', kn = '#5e3a2c';
  return (
    <g transform={`translate(${x + trem} ${y - 30 * lift})`}>
      <ellipse cx={-60} cy={60 + 30 * lift} rx={260} ry={40} fill="#5a4630" opacity={0.35 - 0.15 * lift} />
      {/* sleeve + wrist */}
      <path d="M 120 -70 L 760 -170 L 820 190 L 150 110 Z" fill="#5f6a48" />
      <path d="M 120 -70 L 160 110" stroke="#3a3e30" strokeWidth={14} />
      <path d="M 40 -50 L 140 -66 L 150 100 L 50 80 Z" fill={sh} />
      {/* back of the hand, fingers spread flat on the metal (they curl up a little as it lifts) */}
      <path d="M -180 -40 Q -60 -90 60 -60 Q 90 0 60 70 Q -60 96 -180 60 Z" fill={sk} />
      {[-70, -30, 10, 46].map((dy, i) => <g key={i} transform={`rotate(${(i - 1.5) * 8 - 6 * lift} -180 ${dy * 0.6})`}><rect x={-370 + 30 * lift} y={dy * 0.9 - 14} width={210 - 30 * lift - (i === 3 ? 50 : i === 0 ? 20 : 0)} height={30} rx={15} fill={sk} /><path d={`M ${-300 + 30 * lift} ${dy * 0.9 - 10} q 6 10 0 20`} stroke={kn} strokeWidth={3} fill="none" opacity={0.6} /></g>)}
      <path d="M 30 70 Q -40 120 -120 110 Q -150 100 -120 88 Q -50 90 10 50 Z" fill={sk} />
      <path d="M -180 -40 Q -60 -90 60 -60" stroke="#e8c0a0" strokeWidth={5} fill="none" opacity={0.6} />
      {[-120, -70, -20].map((xx) => <path key={xx} d={`M ${xx} -40 L ${xx - 40} 40`} stroke={sh} strokeWidth={5} opacity={0.35} />)}
    </g>
  );
};
