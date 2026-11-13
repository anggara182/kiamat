import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set B: shore close-ups. 4 = shallow surf seen from above, 12 = feet at sand level, 14 = dress hem. */

/* ---------- shot 4: shallow water bed + caustics ---------- */
const Bed: React.FC = () => {
  const r = rng(301);
  const lines = Array.from({ length: 46 }, (_, i) => {
    const y = -40 + i * 52 + r() * 10;
    let d = `M -40 ${y}`;
    const ph = r() * 6, a = 10 + r() * 10;
    for (let x = 0; x <= W + 60; x += 48) d += ` L ${x} ${(y + Math.sin(x * 0.009 + ph + i * 0.3) * a).toFixed(1)}`;
    return d;
  });
  const pebbles = Array.from({ length: 140 }, () => ({ x: r() * W, y: r() * H, rx: 4 + r() ** 2 * 26, ry: 3 + r() ** 2 * 18, a: r() * 180, c: ['#4a3446', '#6b4c52', '#2e2236', '#7d5d5a', '#5a4a5e'][Math.floor(r() * 5)] }));
  const shells = Array.from({ length: 12 }, () => ({ x: r() * W, y: r() * H, s: 0.7 + r() * 1.2, a: r() * 360 }));
  return (
    <g>
      <defs>
        <radialGradient id="bedLight" cx="0.62" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#e4a274" />
          <stop offset="0.4" stopColor="#a8685e" />
          <stop offset="0.8" stopColor="#4a3050" />
          <stop offset="1" stopColor="#241a34" />
        </radialGradient>
        <linearGradient id="waterTint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3a5c" stopOpacity="0.15" />
          <stop offset="1" stopColor="#152036" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#bedLight)" />
      {lines.map((d, i) => (
        <g key={i}>
          <path d={d} stroke="#3a2232" strokeWidth={14} fill="none" opacity={0.22} />
          <path d={d} stroke="#ffc49a" strokeWidth={5} fill="none" opacity={0.18} transform="translate(0 -9)" />
        </g>
      ))}
      {pebbles.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a})`}>
          <ellipse cx={3} cy={4} rx={p.rx} ry={p.ry} fill="#170f20" opacity={0.45} />
          <ellipse rx={p.rx} ry={p.ry} fill={p.c} />
          <ellipse cx={-p.rx * 0.25} cy={-p.ry * 0.3} rx={p.rx * 0.5} ry={p.ry * 0.35} fill="#f2c4a0" opacity={0.25} />
        </g>
      ))}
      {shells.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.a}) scale(${s.s})`}>
          <path d="M -18 6 Q -20 -16 0 -20 Q 20 -16 18 6 Q 0 12 -18 6 Z" fill="#e8d2c0" opacity={0.85} />
          {[-12, -6, 0, 6, 12].map((x) => <path key={x} d={`M ${x} 7 L ${x * 0.3} -18`} stroke="#a88878" strokeWidth={1.2} />)}
        </g>
      ))}
      <rect x={0} y={0} width={W} height={H} fill="url(#waterTint)" />
    </g>
  );
};

/** Caustic net: wavy bright filaments in three directions; where they cross they knot into the familiar web. */
const Caustics: React.FC<{ seed: number }> = ({ seed }) => {
  const r = rng(seed);
  const lines: { d: string; w: number; o: number }[] = [];
  const diag = Math.hypot(W, H);
  for (const ang of [0, 60, 120]) {
    const a = (ang * Math.PI) / 180 + (r() - 0.5) * 0.2;
    const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
    for (let off = -diag / 2; off < diag / 2; off += 70 + r() * 50) {
      const ph = r() * 6.28, amp = 14 + r() * 26, fr = 0.008 + r() * 0.01;
      let d = '';
      for (let u = -diag / 2; u <= diag / 2; u += 30) {
        const o = off + Math.sin(u * fr + ph) * amp + Math.sin(u * fr * 2.7 + ph * 2) * amp * 0.4;
        const x = W / 2 + ux * u + nx * o, y = H / 2 + uy * u + ny * o;
        d += `${d ? ' L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      lines.push({ d, w: 2 + r() * 5, o: 0.25 + r() * 0.35 });
    }
  }
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {lines.map((l, i) => <path key={i} d={l.d} stroke="#ffd9a6" strokeWidth={l.w * 2.2} opacity={l.o * 0.45} />)}
      {lines.map((l, i) => <path key={`h${i}`} d={l.d} stroke="#fff4dc" strokeWidth={l.w * 0.6} opacity={l.o} />)}
    </g>
  );
};

/* ---------- shot 12: feet at sand level, looking back at the land (blue hour behind, sun behind camera) ---------- */
export const LOW_HZ = 1192; // world y of the horizon (frame ~1000)
const LowSky: React.FC = () => {
  const r = rng(404);
  const palms = Array.from({ length: 11 }, (_, i) => ({ x: 40 + i * 120 + r() * 50, h: 120 + r() * 140, lean: (r() - 0.5) * 40 }));
  return (
    <g>
      <defs>
        <linearGradient id="lowSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141a3e" />
          <stop offset="0.45" stopColor="#2e3266" />
          <stop offset="0.7" stopColor="#6a4f86" />
          <stop offset="0.86" stopColor="#d08f9e" />
          <stop offset="1" stopColor="#f2b7a0" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={LOW_HZ + 10} fill="url(#lowSky)" />
      {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={r() * W} cy={r() * 700} r={0.8 + r() * 1.6} fill="#fff" opacity={0.2 + r() * 0.5} />)}
      {/* full moon rising over the land */}
      <circle cx={1010} cy={760} r={46} fill="#ffe9d6" opacity={0.9} />
      <circle cx={1010} cy={760} r={120} fill="#ffd9c8" opacity={0.12} />
      {/* dunes, casuarina + palm line, warung lights */}
      <path d={`M 0 ${LOW_HZ - 40} C 200 ${LOW_HZ - 90}, 420 ${LOW_HZ - 60}, 620 ${LOW_HZ - 80} C 860 ${LOW_HZ - 100}, 1060 ${LOW_HZ - 60}, ${W} ${LOW_HZ - 84} L ${W} ${LOW_HZ + 10} L 0 ${LOW_HZ + 10} Z`} fill="#2a2140" />
      {palms.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${LOW_HZ - 60})`} stroke="#1a1430" fill="none" strokeLinecap="round">
          <path d={`M 0 0 Q ${p.lean * 0.4} ${-p.h * 0.5} ${p.lean} ${-p.h}`} strokeWidth={6} />
          {[-160, -125, -90, -50, -15, 20].map((a, k) => {
            const ar = (a * Math.PI) / 180, L = 60 + (k % 2) * 16;
            return <path key={k} d={`M ${p.lean} ${-p.h} q ${Math.cos(ar) * L * 0.6} ${Math.sin(ar) * L * 0.6 - 14} ${Math.cos(ar) * L} ${Math.sin(ar) * L + 18}`} strokeWidth={6} />;
          })}
        </g>
      ))}
      <path d={`M 0 ${LOW_HZ - 20} C 300 ${LOW_HZ - 34}, 700 ${LOW_HZ - 10}, ${W} ${LOW_HZ - 26} L ${W} ${LOW_HZ + 10} L 0 ${LOW_HZ + 10} Z`} fill="#181228" />
      {[[180, -36], [240, -30], [520, -22], [900, -30], [960, -34], [1140, -26]].map(([x, dy], i) => (
        <g key={i}>
          <circle cx={x} cy={LOW_HZ + dy} r={16} fill="#ffc27a" opacity={0.22} />
          <circle cx={x} cy={LOW_HZ + dy} r={4} fill="#ffe1ad" />
        </g>
      ))}
    </g>
  );
};
const LowSand: React.FC = () => {
  const r = rng(405);
  const streaks = Array.from({ length: 90 }, (_, i) => {
    const k = Math.pow((i + 0.5) / 90, 1.9);
    return { y: LOW_HZ + 4 + k * (H - LOW_HZ), x: r() * W, w: 80 + k * 900 * r(), h: 1 + k * 10, o: 0.08 + r() * 0.18, c: r() < 0.5 ? '#ffd7b0' : '#1d1630' };
  });
  return (
    <g>
      <defs>
        <linearGradient id="lowSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8ae9e" />
          <stop offset="0.12" stopColor="#a87896" />
          <stop offset="0.4" stopColor="#57466e" />
          <stop offset="1" stopColor="#2a1f30" />
        </linearGradient>
        {/* warm sun from behind the camera grazing the sand in the foreground */}
        <radialGradient id="lowWarm" cx="0.5" cy="1" r="0.7">
          <stop offset="0" stopColor="#e39a6e" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e39a6e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={0} y={LOW_HZ} width={W} height={H - LOW_HZ} fill="url(#lowSand)" />
      {/* moon reflection column */}
      <rect x={990} y={LOW_HZ + 4} width={40} height={600} fill="#ffe9d6" opacity={0.12} rx={20} />
      {streaks.map((s, i) => <rect key={i} x={s.x - s.w / 2} y={s.y} width={s.w} height={s.h} rx={s.h / 2} fill={s.c} opacity={s.o} />)}
      <rect x={0} y={LOW_HZ} width={W} height={H - LOW_HZ} fill="url(#lowWarm)" />
    </g>
  );
};
/** Grains and bubbles right at the lens (heavy defocus). */
const LowFg: React.FC = () => {
  const r = rng(406);
  return (
    <g>
      <path d={`M -20 ${H - 120} C 300 ${H - 190}, 700 ${H - 150}, ${W + 20} ${H - 210} L ${W + 20} ${H} L -20 ${H} Z`} fill="#3a2a34" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={r() * W} cy={H - 220 + r() * 220} r={4 + r() * 14} fill={r() < 0.5 ? '#ffd6b0' : '#14101c'} opacity={0.35} />)}
    </g>
  );
};

/* ---------- shot 14: dress hem extreme close-up (band taller than frame for the tilt) ---------- */
export const HEM_H = 3000;
export const HEM_Y = 2360; // band y of the hem line
/** Scalloped hem outline, used as the skirt silhouette and the green dye clip. */
export const hemPath = () => {
  let d = `M -60 -20 L ${W + 60} -20 L ${W + 60} ${HEM_Y}`;
  const n = 14, step = (W + 120) / n;
  for (let i = n; i > 0; i--) {
    const x1 = -60 + i * step, x0 = x1 - step, y = HEM_Y + Math.sin(i * 1.7) * 14;
    d += ` Q ${x1 - step * 0.05} ${y + 46} ${x1 - step * 0.5} ${y + 44} Q ${x0 + step * 0.05} ${y + 46} ${x0} ${y}`;
  }
  return d + ' Z';
};
/** fold centres (x) of the skirt: tall vertical folds, flaring slightly toward the hem */
export const FOLDS = [70, 230, 360, 520, 650, 800, 930, 1090, 1230];
export const foldX = (x: number, y: number) => 648 + (x - 648) * (0.82 + 0.18 * (y / HEM_Y));

const HemWater: React.FC = () => {
  const r = rng(501);
  return (
    <g>
      <defs>
        <linearGradient id="hemWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a3d63" />
          <stop offset="0.6" stopColor="#2a2448" />
          <stop offset="1" stopColor="#151229" />
        </linearGradient>
        <linearGradient id="shin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5e3c3a" />
          <stop offset="0.55" stopColor="#a8705a" />
          <stop offset="0.85" stopColor="#d9946e" />
          <stop offset="1" stopColor="#7a4c44" />
        </linearGradient>
      </defs>
      <rect x={0} y={HEM_Y - 300} width={W} height={HEM_H - HEM_Y + 300} fill="url(#hemWater)" />
      {Array.from({ length: 60 }, (_, i) => {
        const y = HEM_Y + 40 + r() * (HEM_H - HEM_Y);
        return <rect key={i} x={r() * W} y={y} width={40 + r() * 260} height={2 + r() * 4} rx={2} fill={r() < 0.6 ? '#f2a982' : '#8a6aa8'} opacity={0.15 + r() * 0.3} />;
      })}
      {/* shins into the water */}
      {[470, 800].map((x, i) => (
        <g key={i}>
          <path d={`M ${x - 70} ${HEM_Y - 200} C ${x - 78} ${HEM_Y + 100}, ${x - 60} ${HEM_Y + 300}, ${x - 46} ${HEM_Y + 470} L ${x + 46} ${HEM_Y + 470} C ${x + 60} ${HEM_Y + 300}, ${x + 78} ${HEM_Y + 100}, ${x + 70} ${HEM_Y - 200} Z`} fill="url(#shin)" />
          <path d={`M ${x + 66} ${HEM_Y - 100} C ${x + 74} ${HEM_Y + 100}, ${x + 58} ${HEM_Y + 300}, ${x + 46} ${HEM_Y + 460}`} stroke="#ffc59a" strokeWidth={4} fill="none" opacity={0.6} />
          {/* refraction: the leg under water shifts and darkens */}
          <rect x={x - 64} y={HEM_Y + 470} width={128} height={200} fill="#4a3448" opacity={0.75} />
        </g>
      ))}
      {/* waterline across the shins */}
      <rect x={0} y={HEM_Y + 462} width={W} height={HEM_H - HEM_Y - 462} fill="#1d1934" opacity={0.55} />
    </g>
  );
};
const HemFabric: React.FC = () => {
  const r = rng(502);
  // eyelet embroidery band above the hem (broderie anglaise)
  const eyelets: { x: number; y: number; s: number }[] = [];
  for (let row = 0; row < 3; row++) for (let i = 0; i < 16; i++) eyelets.push({ x: 20 + i * 84 + (row % 2) * 42, y: HEM_Y - 90 - row * 70, s: row === 1 ? 1.2 : 0.85 });
  const weave = Array.from({ length: 220 }, () => ({ x: r() * W, y: r() * HEM_Y, l: 40 + r() * 200 }));
  return (
    <g>
      <defs>
        <linearGradient id="fabBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bdb2cc" />
          <stop offset="0.5" stopColor="#ece4ee" />
          <stop offset="0.85" stopColor="#ffe6d2" />
          <stop offset="1" stopColor="#f7cdb4" />
        </linearGradient>
        <linearGradient id="fabV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6c6488" stopOpacity="0.45" />
          <stop offset="0.25" stopColor="#6c6488" stopOpacity="0" />
          <stop offset="0.9" stopColor="#ffd9b4" stopOpacity="0" />
          <stop offset="1" stopColor="#ffd9b4" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path d={hemPath()} fill="url(#fabBase)" />
      <path d={hemPath()} fill="url(#fabV)" />
      {weave.map((w, i) => <line key={i} x1={w.x} y1={w.y} x2={w.x + 2} y2={w.y + w.l} stroke="#8e86a6" strokeWidth={0.8} opacity={0.18} />)}
      {/* waist: gathered sash with a soft bow, and her hand resting at the side */}
      <path d="M -60 120 C 300 160, 900 150, 1360 110 L 1360 250 C 900 290, 300 300, -60 260 Z" fill="#d9cfe0" />
      <path d="M -60 260 C 300 300, 900 290, 1360 250" stroke="#8a80a4" strokeWidth={4} fill="none" opacity={0.6} />
      <path d="M -60 120 C 300 160, 900 150, 1360 110" stroke="#fff3e6" strokeWidth={3} fill="none" opacity={0.7} />
      <g transform="translate(330 200)">
        <path d="M 0 0 C -80 -70, -160 -40, -150 20 C -140 70, -60 50, 0 0 Z" fill="#e6dcea" stroke="#9188ac" strokeWidth={3} />
        <path d="M 0 0 C 80 -70, 160 -40, 150 20 C 140 70, 60 50, 0 0 Z" fill="#ece4ee" stroke="#9188ac" strokeWidth={3} />
        <path d="M -10 10 C -30 120, -50 260, -30 420 L 0 410 C -10 260, 0 120, 10 10 Z" fill="#ddd2e2" />
        <path d="M 10 10 C 40 140, 60 300, 70 380 L 40 390 C 30 300, 10 140, -6 10 Z" fill="#e8e0ec" />
        <ellipse cx={0} cy={4} rx={22} ry={18} fill="#d4c8dc" stroke="#9188ac" strokeWidth={3} />
      </g>
      {eyelets.map((e, i) => (
        <g key={i} transform={`translate(${e.x} ${e.y}) scale(${e.s})`}>
          <ellipse rx={16} ry={10} fill="#3a2e48" opacity={0.85} />
          <ellipse rx={16} ry={10} fill="none" stroke="#fffaf2" strokeWidth={4} />
          {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={Math.cos(k * 1.57 + 0.78) * 30} cy={Math.sin(k * 1.57 + 0.78) * 20} rx={7} ry={4} transform={`rotate(${k * 90 + 45} ${Math.cos(k * 1.57 + 0.78) * 30} ${Math.sin(k * 1.57 + 0.78) * 20})`} fill="none" stroke="#fffaf2" strokeWidth={2.5} />)}
        </g>
      ))}
      {/* stitched hem band */}
      <path d={`M -60 ${HEM_Y - 20} L ${W + 60} ${HEM_Y - 20}`} stroke="#b5abc6" strokeWidth={2} strokeDasharray="10 8" />
    </g>
  );
};
/** Fold shading that sits ABOVE the live dye so the green follows the cloth. */
const HemShade: React.FC = () => (
  <g>
    <defs>
      <clipPath id="hemClip"><path d={hemPath()} /></clipPath>
      <linearGradient id="foldDark" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2a2040" stopOpacity="0" />
        <stop offset="0.5" stopColor="#2a2040" stopOpacity="0.42" />
        <stop offset="1" stopColor="#2a2040" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="foldLight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff6ec" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff6ec" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff6ec" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g clipPath="url(#hemClip)">
      {FOLDS.map((x, i) => {
        const xt = foldX(x, 300), xb = foldX(x, HEM_Y);
        const wd = 46 + (i % 3) * 14;
        return (
          <g key={i}>
            <path d={`M ${xt - wd} 260 C ${xt - wd} 900, ${xb - wd * 1.4} 1600, ${xb - wd * 1.6} ${HEM_Y + 60} L ${xb + wd * 0.2} ${HEM_Y + 60} C ${xb} 1600, ${xt + wd * 0.3} 900, ${xt + wd * 0.3} 260 Z`} fill="url(#foldDark)" />
            <path d={`M ${xt + 30} 260 C ${xt + 30} 900, ${xb + 40} 1600, ${xb + 50} ${HEM_Y + 60} L ${xb + 50 + wd * 1.4} ${HEM_Y + 60} C ${xb + 40 + wd * 1.2} 1600, ${xt + 30 + wd} 900, ${xt + 30 + wd} 260 Z`} fill="url(#foldLight)" />
          </g>
        );
      })}
      {/* translucent glow along the hem from the low sun */}
      <rect x={-60} y={HEM_Y - 160} width={W + 120} height={220} fill="#ffcf9c" opacity={0.16} />
    </g>
    {/* rim on the scalloped edge */}
    <path d={hemPath()} fill="none" stroke="#fff1de" strokeWidth={3} opacity={0.75} />
    {/* her hand, relaxed at her side (right), over the fabric */}
    <g transform="translate(1110 380) rotate(-6)">
      <path d="M -60 -420 C -66 -300, -64 -180, -52 -40 C -48 10, -30 70, -10 130 C 0 170, 30 180, 44 150 C 50 120, 60 60, 66 0 C 72 -120, 70 -300, 66 -420 Z" fill="#a8705a" />
      {[-34, -12, 10, 32].map((x, i) => <path key={i} d={`M ${x} 60 C ${x - 4} 120, ${x - 2} 180, ${x + 2} ${210 - Math.abs(i - 1.5) * 18}`} stroke="#8a5846" strokeWidth={22} strokeLinecap="round" fill="none" />)}
      {[-34, -12, 10, 32].map((x, i) => <path key={`n${i}`} d={`M ${x - 4} ${196 - Math.abs(i - 1.5) * 18} l 6 0`} stroke="#e6b7a0" strokeWidth={8} strokeLinecap="round" />)}
      <path d="M 60 -420 C 66 -300, 68 -120, 62 0 C 56 60, 52 110, 44 150" stroke="#ffc59a" strokeWidth={5} fill="none" opacity={0.7} />
      <path d="M -60 -300 C -70 -200, -66 -100, -56 -30" stroke="#5e3c3a" strokeWidth={10} fill="none" opacity={0.5} />
    </g>
  </g>
);

export const SHORE_BANDS: Record<string, BandSpec> = {
  'shore/bed': { blur: 2, node: () => <Bed /> },
  'shore/caustA': { blur: 2.5, node: () => <Caustics seed={11} /> },
  'shore/caustB': { blur: 5, node: () => <Caustics seed={23} /> },
  'shore/low-bg': { blur: 7, node: () => <LowSky /> },
  'shore/low-sand': { blur: 1, node: () => <LowSand /> },
  'shore/low-fg': { blur: 16, node: () => <LowFg /> },
  'shore/hem-water': { blur: 3, h: HEM_H, node: () => <HemWater /> },
  'shore/hem-fabric': { blur: 0.6, h: HEM_H, node: () => <HemFabric /> },
  'shore/hem-shade': { blur: 2.5, h: HEM_H, node: () => <HemShade /> },
};
