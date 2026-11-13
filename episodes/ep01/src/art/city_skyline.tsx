import React from 'react';
import { W, H, rng } from './world';

/**
 * EP01 city skyline: ONE drawing, three moods (dawn / dusk / night) via a palette argument.
 *  - far + mid (towers, crane, mosque, mid-rise) are baked per mood (src/sets/city.tsx), sky left transparent;
 *  - sky, near kampung rooftops, utility pole and every light are live (they need palette crossfades,
 *    parallax and window animation).
 * World 1296x2304, frame window (108,192)..(1188,2112).
 */

export type Mood = 'dawn' | 'dusk' | 'night';
export type Pal = {
  sky: string[]; skyO: number[];
  glow: [string, string]; glowAt: [number, number, number, number];
  cloud: string; cloudLit: string; cloudO: number;
  strip: string; far2: string; far: string; farS: string; mid: string;
  nearA: string; nearB: string; near: string; nearD: string;
  haze: string; hazeO: number; mist: string; mistO: number;
  rim: string; rimO: number; hi: string;
  win: string; winCool: string;
};

export const CITY_PAL: Record<Mood, Pal> = {
  dawn: {
    sky: ['#141a3a', '#3b3466', '#c7768a', '#f4b98a'], skyO: [0, 0.5, 0.83, 1],
    glow: ['#ffe2b4', '#f4b98a'], glowAt: [470, 1340, 640, 430],
    cloud: '#3a3264', cloudLit: '#e9a08e', cloudO: 0.6,
    strip: '#7d5a7c', far2: '#5e4b75', far: '#3a3a63', farS: '#2d2d54', mid: '#1c2142',
    nearA: '#121531', nearB: '#0f1229', near: '#0c0f22', nearD: '#070915',
    haze: '#d88c8c', hazeO: 0.5, mist: '#a07890', mistO: 0.22,
    rim: '#ffcf9e', rimO: 0.85, hi: '#2c2f5a',
    win: '#ffd58a', winCool: '#bfe3ff',
  },
  dusk: {
    sky: ['#1f1d3d', '#6a3f63', '#d9785f', '#f0b27a'], skyO: [0, 0.45, 0.8, 1],
    glow: ['#ffd89a', '#f0a870'], glowAt: [1010, 1190, 740, 580],
    cloud: '#4a3050', cloudLit: '#f2a27a', cloudO: 0.6,
    strip: '#8a5268', far2: '#6a4462', far: '#3d2c4e', farS: '#31243f', mid: '#2b2344',
    nearA: '#1f1835', nearB: '#1c1632', near: '#1a1530', nearD: '#100d20',
    haze: '#e08a6a', hazeO: 0.45, mist: '#8a5468', mistO: 0.2,
    rim: '#ffc28a', rimO: 0.7, hi: '#3d3159',
    win: '#ffd27a', winCool: '#bfe3ff',
  },
  night: {
    sky: ['#05070f', '#0d1222', '#18203a', '#29294a'], skyO: [0, 0.5, 0.86, 1],
    glow: ['#3a3456', '#232845'], glowAt: [700, 1300, 1000, 700],
    cloud: '#0c1122', cloudLit: '#252a46', cloudO: 0.45,
    strip: '#1f2340', far2: '#171c33', far: '#0f1426', farS: '#0b0f1e', mid: '#0b0e1a',
    nearA: '#080a14', nearB: '#06070f', near: '#04050a', nearD: '#020306',
    haze: '#292a4a', hazeO: 0.5, mist: '#1b1e36', mistO: 0.35,
    rim: '#4a5a84', rimO: 0.4, hi: '#131729',
    win: '#ffcf86', winCool: '#bfe3ff',
  },
};

/* ------------------------------------------------------------------ geometry */
export const HZ = 1330;                       // horizon (far haze line)
export const MIN = { x: 470, top: 806 };      // minaret axis + finial tip
export const DOME = { x: 650, y: 1372 };      // dome base centre
const BOT = 1780;                             // far/mid bottoms (always hidden by the near rows)

type TK = 'flat' | 'step' | 'spire' | 'crown' | 'slant' | 'round' | 'crane';
type Tower = { x: number; w: number; top: number; k: TK; strip?: boolean };
/** front row of towers (CBD). Gap 330..610 keeps the minaret alone against the sky. */
export const TOWERS: Tower[] = [
  { x: -30, w: 100, top: 1080, k: 'step' },
  { x: 82, w: 72, top: 985, k: 'crown', strip: true },
  { x: 168, w: 96, top: 1110, k: 'flat' },
  { x: 268, w: 60, top: 1035, k: 'spire' },
  { x: 612, w: 82, top: 965, k: 'slant', strip: true },
  { x: 702, w: 98, top: 1035, k: 'flat' },
  { x: 806, w: 72, top: 800, k: 'spire' },
  { x: 886, w: 92, top: 905, k: 'crown', strip: true },
  { x: 986, w: 88, top: 870, k: 'crane' },
  { x: 1082, w: 78, top: 975, k: 'round' },
  { x: 1166, w: 96, top: 1045, k: 'step', strip: true },
  { x: 1268, w: 80, top: 1110, k: 'flat' },
];
const CR = (() => { const t = TOWERS[8]; const x0 = t.x + t.w * 0.55; return { x0, top: t.top - 250, jib: t.top - 232 }; })();
/** points for the red aviation lights (band space) */
export const RED_LIGHTS: { x: number; y: number; ph: number }[] = [
  { x: TOWERS[6].x + 36, y: 688, ph: 0 },
  { x: CR.x0 + 4.5, y: CR.top - 42, ph: 0.35 },
  { x: CR.x0 - 228, y: CR.jib + 2, ph: 0.7 },
  { x: TOWERS[7].x + 46, y: TOWERS[7].top - 44, ph: 0.2 },
  { x: TOWERS[1].x + 36, y: TOWERS[1].top - 40, ph: 0.55 },
  { x: TOWERS[9].x + 39, y: TOWERS[9].top - 2, ph: 0.85 },
];

/** distant back row (hazy), procedural */
const BACK: Tower[] = (() => {
  const r = rng(7); const out: Tower[] = [];
  let x = -40;
  while (x < W + 40) {
    const w = 34 + r() * 52;
    const inGap = x + w > 330 && x < 610;
    const top = inGap ? 1190 + r() * 60 : 1085 + r() * 150;
    out.push({ x, w, top, k: r() < 0.3 ? 'step' : 'flat' });
    x += w + r() * 16 - 5;
  }
  return out;
})();

type Mid = { x: number; w: number; top: number; tank?: number; bill?: boolean; box?: boolean };
export const MIDS: Mid[] = [
  { x: -40, w: 160, top: 1335, tank: 0.7 },
  { x: 112, w: 118, top: 1390, box: true },
  { x: 222, w: 112, top: 1302, bill: true },
  { x: 326, w: 92, top: 1420, tank: 0.35 },
  { x: 776, w: 128, top: 1352, tank: 0.6 },
  { x: 896, w: 104, top: 1400, box: true },
  { x: 992, w: 150, top: 1288 },
  { x: 1134, w: 118, top: 1368, tank: 0.4 },
  { x: 1244, w: 100, top: 1406, bill: true },
];
const TREES = [{ x: 60, y: 1446, r: 30 }, { x: 412, y: 1462, r: 32 }, { x: 796, y: 1450, r: 28 }, { x: 1186, y: 1446, r: 34 }];
const HALL = { x: 532, w: 240, top: 1402 };

/** top of the mid layer at x (for hiding far windows behind it) */
const midTopAt = (x: number) => {
  let y = 1e9;
  for (const m of MIDS) if (x >= m.x && x <= m.x + m.w) y = Math.min(y, m.top - (m.bill ? 90 : 26));
  if (x >= HALL.x - 10 && x <= HALL.x + HALL.w + 10) y = Math.min(y, HALL.top - 34);
  if (Math.abs(x - DOME.x) < 82) y = Math.min(y, DOME.y - 116 * Math.sqrt(Math.max(0, 1 - ((x - DOME.x) / 82) ** 2)) - 8);
  if (Math.abs(x - MIN.x) < 36) y = Math.min(y, MIN.top);
  for (const t of TREES) if (Math.abs(x - t.x) < t.r * 1.8) y = Math.min(y, t.y - t.r * 1.3);
  return y;
};
const frontTopAt = (x: number) => {
  let y = midTopAt(x);
  for (const t of TOWERS) if (x >= t.x - 2 && x <= t.x + t.w + 2) y = Math.min(y, t.top - 4);
  return y;
};

/* ------------------------------------------------------------------ windows */
/** L: 0 = band (towers + mid-rise), 1..3 = near rows A..C. o = switch-on order, o2 = switch-off order. */
export type Win = { x: number; y: number; w: number; h: number; o: number; o2: number; c: 0 | 1; L: number; fl: boolean };

export const BAND_WINS: Win[] = (() => {
  const r = rng(101); const out: Win[] = [];
  const push = (x: number, y: number, w: number, h: number, L = 0) => out.push({ x, y, w, h, o: r(), o2: r(), c: r() < 0.22 ? 1 : 0, L, fl: false });
  // front towers
  for (const t of TOWERS) {
    const y0 = t.top + (t.k === 'step' ? 92 : t.k === 'round' ? t.w / 2 + 8 : t.k === 'slant' ? 66 : t.k === 'crane' ? 10 : 16);
    for (let y = y0; y < 1500; y += 17) {
      if (t.strip) {
        if (r() < 0.16) { const x = t.x + 7, w = t.w - 14; if (y + 4 < Math.min(midTopAt(x), midTopAt(x + w))) push(x, y, w, 4); }
        continue;
      }
      for (let x = t.x + 7; x < t.x + t.w - 12; x += 12) {
        if (r() > 0.15) continue;
        if (y + 9 < Math.min(midTopAt(x), midTopAt(x + 6)) - 2) push(x, y, 6, 8);
      }
    }
  }
  // back row: a few tiny dots
  for (const t of BACK) for (let y = t.top + 14; y < 1360; y += 15) for (let x = t.x + 6; x < t.x + t.w - 8; x += 10) {
    if (r() > 0.06) continue;
    if (y + 6 < Math.min(frontTopAt(x), frontTopAt(x + 4)) - 2) push(x, y, 4, 5);
  }
  // mid-rise blocks
  for (const m of MIDS) for (let y = m.top + 16; y < 1520; y += 21) for (let x = m.x + 9; x < m.x + m.w - 14; x += 17) {
    if (r() > 0.34) continue;
    push(x, y, 9, 11);
  }
  return out;
})();

/* ------------------------------------------------------------------ path helpers (all clockwise, nonzero fill) */
const n1 = (v: number) => Math.round(v * 10) / 10;
const R = (x: number, y: number, w: number, h: number) => `M${n1(x)} ${n1(y)}h${n1(w)}v${n1(h)}h${n1(-w)}Z`;
const P = (...p: number[]) => { let s = ''; for (let i = 0; i < p.length; i += 2) s += `${i ? 'L' : 'M'}${n1(p[i])} ${n1(p[i + 1])}`; return s + 'Z'; };
const E = (cx: number, cy: number, rx: number, ry: number) => `M${n1(cx - rx)} ${n1(cy)}a${n1(rx)} ${n1(ry)} 0 1 1 ${n1(2 * rx)} 0a${n1(rx)} ${n1(ry)} 0 1 1 ${n1(-2 * rx)} 0Z`;

/** water tank (tandon) on a steel stand, base at (cx, y) */
const tank = (cx: number, y: number, s: number, legs = 26) => {
  const tw = 30 * s, th = 34 * s, lg = legs * s, ty = y - lg - th;
  return R(cx - tw * 0.42, y - lg, 3 * s, lg) + R(cx + tw * 0.42 - 3 * s, y - lg, 3 * s, lg) + R(cx - tw * 0.48, y - lg - 2 * s, tw * 0.96, 3 * s)
    + R(cx - tw / 2, ty + 5 * s, tw, th - 5 * s) + E(cx, ty + 5 * s, tw / 2, 6 * s) + R(cx - 4 * s, ty - 4 * s, 8 * s, 5 * s);
};
/** TV antenna: pole + fishbone bars */
const antenna = (x: number, y: number, len: number, s: number) =>
  R(x - 1.6 * s, y - len, 3.2 * s, len) + R(x - 22 * s, y - len + 6 * s, 44 * s, 2.6 * s) + R(x - 16 * s, y - len + 18 * s, 32 * s, 2.6 * s) + R(x - 11 * s, y - len + 30 * s, 22 * s, 2.6 * s)
  + P(x + 1.6 * s, y - len + 40 * s, x + 18 * s, y - len + 58 * s, x + 18 * s, y - len + 61 * s, x + 1.6 * s, y - len + 44 * s);
/** satellite dish on a short post */
const dish = (x: number, y: number, s: number) => R(x - 1.5 * s, y - 16 * s, 3 * s, 16 * s) + P(x - 15 * s, y - 34 * s, x - 6 * s, y - 40 * s, x + 12 * s, y - 22 * s, x + 6 * s, y - 14 * s);

/* ------------------------------------------------------------------ near kampung rooftops (live) */
type Tone = 'nearA' | 'nearB' | 'near' | 'nearD';
type NRow = { d: string; tone: Tone; eave: number; wins: Win[] };
const NROWS_SPEC: { eave: number; jit: number; w0: number; w1: number; h0: number; h1: number; s: number; tone: Tone }[] = [
  { eave: 1550, jit: 12, w0: 52, w1: 100, h0: 24, h1: 44, s: 0.7, tone: 'nearA' },
  { eave: 1670, jit: 14, w0: 78, w1: 146, h0: 32, h1: 58, s: 0.9, tone: 'nearB' },
  { eave: 1812, jit: 18, w0: 128, w1: 236, h0: 46, h1: 82, s: 1.15, tone: 'near' },
  { eave: 2016, jit: 22, w0: 220, w1: 360, h0: 70, h1: 118, s: 1.5, tone: 'nearD' },
];
const MOSQUE_ZONE = (x: number) => x > 400 && x < 790;

export const NEAR_ROWS: NRow[] = (() => {
  const r = rng(31);
  return NROWS_SPEC.map((S, ri) => {
    let d = ''; const wins: Win[] = [];
    let x = -90 - r() * 40;
    while (x < W + 70) {
      const w = S.w0 + r() * (S.w1 - S.w0);
      const two = r() < (ri < 2 ? 0.26 : 0.16) && !(ri === 0 && MOSQUE_ZONE(x + w / 2));
      const eave = S.eave + (r() * 2 - 1) * S.jit - (two ? 40 * S.s : 0);
      const h = S.h0 + r() * (S.h1 - S.h0);
      const kr = r();
      const kind = kr < 0.42 ? 'gable' : kr < 0.66 ? 'hip' : kr < 0.8 ? 'shed' : 'flat';
      const o = 5 * S.s;
      d += R(x, eave, w, H - eave + 40);
      let roofTop = eave - h;
      if (kind === 'gable') d += P(x - o, eave, x + w / 2, eave - h, x + w + o, eave);
      else if (kind === 'hip') d += P(x - o, eave, x + w * 0.24, eave - h * 0.8, x + w * 0.76, eave - h * 0.8, x + w + o, eave), roofTop = eave - h * 0.8;
      else if (kind === 'shed') d += P(x - o, eave, x - o, eave - h * 0.75, x + w + o, eave - h * 0.3, x + w + o, eave), roofTop = eave - h * 0.75;
      else {
        roofTop = eave - 12 * S.s;
        d += R(x - 2, roofTop, w + 4, 12 * S.s);
        if (r() < 0.45) d += R(x + w * 0.62, roofTop - 30 * S.s, w * 0.26, 30 * S.s);
        if (r() < 0.8 && !(ri < 2 && MOSQUE_ZONE(x + w * 0.3))) d += tank(x + w * 0.3, roofTop, S.s);
      }
      const ax = x + w * (0.3 + 0.4 * r());
      if (r() < 0.24 && !(ri < 2 && MOSQUE_ZONE(ax)) && ri < 3) d += antenna(ax, roofTop + (kind === 'flat' ? 0 : h * 0.25), (95 + r() * 85) * S.s, S.s);
      if (r() < 0.08 && ri > 0) d += dish(x + w * 0.8, eave - 2, S.s);
      // windows under the eave (kitchen / living room)
      if (ri < 3) {
        const nw = r() < 0.25 ? 0 : w > 115 * S.s ? 2 : 1;
        for (let k = 0; k < nw; k++) {
          const ww = 13 * S.s, wh = 15 * S.s;
          const wx = x + w * (nw === 1 ? 0.3 + r() * 0.3 : 0.18 + k * 0.46 + r() * 0.08);
          wins.push({ x: wx, y: eave + 9 * S.s, w: ww, h: wh, o: r(), o2: r(), c: r() < 0.2 ? 1 : 0, L: ri + 1, fl: r() < 0.4 });
          if (two) wins.push({ x: wx + 4 * S.s, y: eave + 52 * S.s, w: ww, h: wh, o: r(), o2: r(), c: r() < 0.2 ? 1 : 0, L: ri + 1, fl: r() < 0.4 });
        }
      }
      x += w + (r() < 0.3 ? -w * 0.12 : r() * 6);
    }
    // two tall water towers (menara toren) in row B
    if (ri === 1) d += R(1004, S.eave - 150, 4, 150) + R(1040, S.eave - 150, 4, 150) + P(1004, S.eave - 60, 1044, S.eave - 110, 1044, S.eave - 105, 1004, S.eave - 55) + tank(1024, S.eave - 148, 1.25, 4)
      + R(186, S.eave - 120, 4, 120) + R(218, S.eave - 120, 4, 120) + tank(204, S.eave - 118, 1.1, 4);
    return { d, tone: S.tone, eave: S.eave, wins };
  });
})();
export const NEAR_WINS: Win[] = NEAR_ROWS.flatMap((r) => r.wins);

/* ------------------------------------------------------------------ live: sky */
const CLOUDS = [
  { x: 260, y: 430, w: 760, h: 9, lit: false }, { x: 980, y: 540, w: 820, h: 11, lit: false }, { x: 360, y: 690, w: 640, h: 8, lit: true },
  { x: 1060, y: 800, w: 560, h: 7, lit: true }, { x: 180, y: 905, w: 420, h: 6, lit: true }, { x: 820, y: 985, w: 700, h: 7, lit: true },
];
export const SkyArt: React.FC<{ m: Mood }> = ({ m }) => {
  const p = CITY_PAL[m]; const [gx, gy, grx, gry] = p.glowAt;
  return (
    <g>
      <defs>
        <linearGradient id={`csk-${m}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={HZ + 40}>
          {p.sky.map((c, i) => <stop key={i} offset={p.skyO[i]} stopColor={c} />)}
        </linearGradient>
        <radialGradient id={`cgl-${m}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={p.glow[0]} stopOpacity={0.95} />
          <stop offset="0.35" stopColor={p.glow[1]} stopOpacity={0.55} />
          <stop offset="1" stopColor={p.glow[1]} stopOpacity={0} />
        </radialGradient>
        {[['d', p.cloud], ['l', p.cloudLit]].map(([k, c]) => (
          <linearGradient key={k} id={`ccl${k}-${m}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c} stopOpacity={0} /><stop offset="0.35" stopColor={c} stopOpacity={1} />
            <stop offset="0.7" stopColor={c} stopOpacity={0.85} /><stop offset="1" stopColor={c} stopOpacity={0} />
          </linearGradient>
        ))}
      </defs>
      <rect x={-400} y={-2600} width={W + 800} height={H + 2600} fill={`url(#csk-${m})`} />
      <ellipse cx={gx} cy={gy} rx={grx} ry={gry} fill={`url(#cgl-${m})`} />
      <g opacity={p.cloudO}>
        {CLOUDS.map((c, i) => {
          const f = `url(#ccl${c.lit ? 'l' : 'd'}-${m})`;
          return (
            <g key={i}>
              <ellipse cx={c.x} cy={c.y} rx={c.w / 2} ry={c.h} fill={f} />
              <ellipse cx={c.x + c.w * 0.18} cy={c.y + c.h * 2.2} rx={c.w * 0.3} ry={c.h * 0.55} fill={f} opacity={0.8} />
              <ellipse cx={c.x - c.w * 0.2} cy={c.y - c.h * 1.8} rx={c.w * 0.22} ry={c.h * 0.45} fill={f} opacity={0.6} />
            </g>
          );
        })}
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ baked: far + mid */
/** tower silhouette as one clockwise path (usable as a clip for its shade face) */
const towerPath = (t: Tower) => {
  const { x, w, top } = t; const h = BOT - top;
  switch (t.k) {
    case 'step': return R(x, top + 80, w, h - 80) + R(x + w * 0.16, top, w * 0.68, 84) + R(x + w * 0.4, top - 16, w * 0.2, 18);
    case 'spire': return R(x, top, w, h) + R(x + w * 0.12, top - 26, w * 0.76, 28) + P(x + w / 2 - 5, top - 24, x + w / 2, top - 114, x + w / 2 + 5, top - 24);
    case 'crown': return R(x, top, w, h) + P(x - 3, top + 2, x + w * 0.5, top - 42, x + w + 3, top + 2);
    case 'slant': return P(x, top + 52, x + w, top, x + w, BOT, x, BOT);
    case 'round': return `M${x} ${BOT} V${top + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${top + w / 2} V${BOT} Z`;
    case 'crane': {
      const { x0, top: ct, jib } = CR;
      let d = R(x, top, w, h);
      for (let i = 0; i < 3; i++) d += R(x + 2, top - 22 - i * 22, w - 4, 4);
      for (const f of [0.04, 0.36, 0.68, 0.92]) d += R(x + w * f, top - 66, 5, 66);
      d += R(x0, ct, 9, top - ct) + P(x0, ct, x0 + 4.5, ct - 40, x0 + 9, ct) + R(x0 - 232, jib, 232 + 9 + 84, 7);
      d += R(x0 + 62, jib + 7, 26, 16) + R(x0 - 15, jib + 7, 15, 13) + R(x0 - 156, jib + 7, 1.6, 128) + R(x0 - 160, jib + 134, 9, 10);
      return d;
    }
    default: return R(x, top, w, h) + R(x + w * 0.2, top - 14, w * 0.34, 15);
  }
};
/** crane hairlines (lattice + ties), drawn as strokes */
const craneLines = (fill: string) => {
  const { x0, top: ct, jib } = CR;
  return (
    <g stroke={fill} fill="none">
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${x0} ${ct + 30 + i * 24} L${x0 + 9} ${ct + 42 + i * 24}`} strokeWidth={1.4} />)}
      <path d={`M${x0 - 232} ${jib} L${x0 + 4.5} ${ct - 38} L${x0 + 92} ${jib}`} strokeWidth={2} />
      <path d={`M${x0 - 120} ${jib} L${x0 + 4.5} ${ct - 38}`} strokeWidth={1.5} />
    </g>
  );
};
const towerShape = (t: Tower, fill: string, key: string) => <path key={key} d={towerPath(t)} fill={fill} />;
/** front tower with a shade face on the side away from the mood's glow (one extra shape) */
const towerLit = (t: Tower, p: Pal, m: Mood, i: number) => {
  const d = towerPath(t); const id = `ctc-${m}-${i}`;
  const shadeRight = t.x + t.w / 2 > p.glowAt[0];
  const sw = t.w * 0.34;
  return (
    <g key={i}>
      <clipPath id={id}><path d={d} /></clipPath>
      <path d={d} fill={p.far} />
      <rect x={shadeRight ? t.x + t.w - sw : t.x - 4} y={t.top - 130} width={sw + 4} height={BOT - t.top + 130} fill={p.farS} clipPath={`url(#${id})`} />
      {t.k === 'crane' && craneLines(p.far)}
    </g>
  );
};

/** minaret = hero of shot 1: 2-3 tones + rim from the glow behind */
const Minaret: React.FC<{ p: Pal }> = ({ p }) => {
  const c = MIN.x;
  const shaft = (yb: number, yt: number, wb: number, wt: number) => `${c - wb / 2},${yb} ${c - wt / 2},${yt} ${c + wt / 2},${yt} ${c + wb / 2},${yb}`;
  const gallery = (y: number, ws: number, wg: number) => (
    <g>
      <polygon points={`${c - ws / 2},${y + 26} ${c - wg / 2},${y} ${c + wg / 2},${y} ${c + ws / 2},${y + 26}`} />
      <rect x={c - wg / 2 - 2} y={y - 6} width={wg + 4} height={7} />
      <rect x={c - wg / 2 + 3} y={y - 22} width={wg - 6} height={17} />
    </g>
  );
  return (
    <g>
      <g fill={p.mid}>
        <polygon points={shaft(BOT, 1162, 46, 33)} />
        {gallery(1158, 33, 64)}
        <polygon points={shaft(1138, 1002, 30, 26)} />
        {gallery(1000, 26, 52)}
        <rect x={c - 13} y={926} width={26} height={54} />
        <rect x={c - 18} y={922} width={36} height={7} />
        <path d={`M${c - 16} 923 Q${c - 15} 884 ${c} 860 Q${c + 15} 884 ${c + 16} 923 Z`} />
        <rect x={c - 1.6} y={826} width={3.2} height={36} />
        <circle cx={c} cy={846} r={4.5} />
        <path d={`M${c - 7} ${MIN.top + 10} A9 9 0 1 0 ${c + 7} ${MIN.top + 10} A7 7 0 1 1 ${c - 7} ${MIN.top + 10} Z`} />
      </g>
      {/* lit (glow-side) tone on the left half + lantern arches */}
      <g fill={p.hi}>
        <polygon points={`${c - 23},${BOT} ${c - 16.5},1162 ${c - 4},1162 ${c - 6},${BOT}`} />
        <polygon points={`${c - 15},1138 ${c - 13},1002 ${c - 3},1002 ${c - 4},1138`} />
        <rect x={c - 31} y={1136} width={16} height={17} />
        <rect x={c - 23} y={978} width={12} height={17} />
      </g>
      <g fill="#05060c" opacity={0.55}>
        <path d={`M${c - 9} 972 V946 A4 4 0 0 1 ${c - 1} 946 V972 Z`} />
        <path d={`M${c + 1} 972 V946 A4 4 0 0 1 ${c + 9} 946 V972 Z`} />
        <rect x={c - 22} y={1144} width={44} height={2} />
        <rect x={c - 17} y={986} width={34} height={2} />
      </g>
      {/* rim light from the glow behind */}
      <g stroke={p.rim} strokeOpacity={p.rimO} fill="none" strokeLinecap="round">
        <path d={`M${c - 23} 1560 L${c - 16.5} 1162`} strokeWidth={2.4} />
        <path d={`M${c - 15} 1138 L${c - 13} 1002`} strokeWidth={2.2} />
        <path d={`M${c - 34} 1152 L${c + 34} 1152`} strokeWidth={1.6} strokeOpacity={p.rimO * 0.7} />
        <path d={`M${c - 28} 994 L${c + 28} 994`} strokeWidth={1.4} strokeOpacity={p.rimO * 0.7} />
        <path d={`M${c - 16} 922 Q${c - 15} 884 ${c} 860`} strokeWidth={1.8} />
        <path d={`M${c + 16.5} 1162 L${c + 23} 1560`} strokeWidth={1.2} strokeOpacity={p.rimO * 0.45} />
        <path d={`M${c + 13} 1002 L${c + 15} 1138`} strokeWidth={1.1} strokeOpacity={p.rimO * 0.45} />
      </g>
    </g>
  );
};

const Mosque: React.FC<{ p: Pal }> = ({ p }) => {
  const { x: dx, y: dy } = DOME; const hx = HALL.x, hw = HALL.w;
  return (
    <g>
      <g fill={p.mid}>
        <rect x={hx} y={HALL.top} width={hw} height={BOT - HALL.top} />
        <rect x={hx - 10} y={HALL.top - 8} width={hw + 20} height={10} />
        {[hx - 2, hx + hw - 12].map((x) => <g key={x}><rect x={x} y={HALL.top - 40} width={14} height={34} /><path d={`M${x - 2} ${HALL.top - 40} Q${x + 7} ${HALL.top - 62} ${x + 16} ${HALL.top - 40} Z`} /></g>)}
        <rect x={dx - 66} y={dy - 4} width={132} height={HALL.top - dy + 4} />
        <path d={`M${dx - 70} ${dy} C${dx - 92} ${dy - 52} ${dx - 50} ${dy - 92} ${dx} ${dy - 112} C${dx + 50} ${dy - 92} ${dx + 92} ${dy - 52} ${dx + 70} ${dy} Z`} />
        <rect x={dx - 1.8} y={dy - 150} width={3.6} height={40} />
        <circle cx={dx} cy={dy - 126} r={5} />
        <path d={`M${dx - 7} ${dy - 150} A9 9 0 1 0 ${dx + 7} ${dy - 150} A7 7 0 1 1 ${dx - 7} ${dy - 150} Z`} />
      </g>
      {/* dome: lit side tone + rim */}
      <path d={`M${dx - 70} ${dy} C${dx - 92} ${dy - 52} ${dx - 50} ${dy - 92} ${dx} ${dy - 112} C${dx - 30} ${dy - 84} ${dx - 44} ${dy - 40} ${dx - 30} ${dy} Z`} fill={p.hi} />
      <path d={`M${dx - 70} ${dy} C${dx - 92} ${dy - 52} ${dx - 50} ${dy - 92} ${dx} ${dy - 112}`} stroke={p.rim} strokeOpacity={p.rimO * 0.8} strokeWidth={2} fill="none" />
      {/* hall arches (dark when unlit; lit live) */}
      <g fill="#05060c" opacity={0.5}>
        {HALL_ARCHES.map((a, i) => <path key={i} d={`M${a.x} ${a.y + a.h} V${a.y + a.w / 2} A${a.w / 2} ${a.w / 2} 0 0 1 ${a.x + a.w} ${a.y + a.w / 2} V${a.y + a.h} Z`} />)}
      </g>
    </g>
  );
};
export const HALL_ARCHES = [0, 1, 2, 3, 4].map((i) => ({ x: HALL.x + 26 + i * 42, y: 1422, w: 20, h: 44 }));
export const LANTERN = { x: MIN.x, y: 959 };

export const CityBand: React.FC<{ m: Mood }> = ({ m }) => {
  const p = CITY_PAL[m];
  return (
    <g>
      <defs>
        <linearGradient id={`chz-${m}`} gradientUnits="userSpaceOnUse" x1="0" y1="1050" x2="0" y2="1500">
          <stop offset="0" stopColor={p.haze} stopOpacity={0} />
          <stop offset="0.62" stopColor={p.haze} stopOpacity={p.hazeO} />
          <stop offset="1" stopColor={p.haze} stopOpacity={p.hazeO * 0.6} />
        </linearGradient>
        <linearGradient id={`chz2-${m}`} gradientUnits="userSpaceOnUse" x1="0" y1="1180" x2="0" y2="1520">
          <stop offset="0" stopColor={p.haze} stopOpacity={0} />
          <stop offset="1" stopColor={p.haze} stopOpacity={p.hazeO * 0.7} />
        </linearGradient>
      </defs>
      {/* distant city fabric */}
      <path d={`M-20 ${BOT} V1300 ${Array.from({ length: 34 }).map((_, i) => { const x = i * 40; const y = 1262 + ((i * 37) % 50); return `H${x} V${y} H${x + 30} V${y + 14}`; }).join(' ')} H${W + 20} V${BOT} Z`} fill={p.strip} />
      {BACK.map((t, i) => towerShape(t, p.far2, `b${i}`))}
      <rect x={-20} y={1050} width={W + 40} height={BOT - 1050} fill={`url(#chz-${m})`} />
      {TOWERS.map((t, i) => towerLit(t, p, m, i))}
      <rect x={-20} y={1180} width={W + 40} height={BOT - 1180} fill={`url(#chz2-${m})`} />
      {/* mid-rise: ruko, rusun, billboards, trees */}
      <g fill={p.mid}>
        {MIDS.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.top} width={b.w} height={BOT - b.top} />
            <rect x={b.x - 3} y={b.top - 6} width={b.w + 6} height={7} />
            {b.box && <rect x={b.x + b.w * 0.55} y={b.top - 26} width={b.w * 0.28} height={22} />}
            {b.tank !== undefined && <path d={tank(b.x + b.w * b.tank, b.top - 4, 1)} />}
            {b.bill && <g><rect x={b.x + b.w * 0.18} y={b.top - 92} width={b.w * 0.66} height={48} /><rect x={b.x + b.w * 0.28} y={b.top - 46} width={4} height={42} /><rect x={b.x + b.w * 0.7} y={b.top - 46} width={4} height={42} /></g>}
          </g>
        ))}
        {TREES.map((t, i) => <g key={i}><circle cx={t.x} cy={t.y} r={t.r} /><circle cx={t.x - t.r * 0.8} cy={t.y + t.r * 0.35} r={t.r * 0.75} /><circle cx={t.x + t.r * 0.85} cy={t.y + t.r * 0.3} r={t.r * 0.8} /><rect x={t.x - t.r * 1.6} y={t.y + t.r * 0.3} width={t.r * 3.2} height={BOT} /></g>)}
      </g>
      <Mosque p={p} />
      <Minaret p={p} />
    </g>
  );
};

/* ------------------------------------------------------------------ live: lights */
type OnFn = (w: Win) => number;

export const WinDefs: React.FC<{ id: string; p: Pal }> = ({ id, p }) => (
  <defs>
    <radialGradient id={`${id}w`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={p.win} stopOpacity={0.55} /><stop offset="1" stopColor={p.win} stopOpacity={0} /></radialGradient>
    <radialGradient id={`${id}c`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={p.winCool} stopOpacity={0.45} /><stop offset="1" stopColor={p.winCool} stopOpacity={0} /></radialGradient>
  </defs>
);

/** tower + mid-rise windows (band space) */
export const BandWindows: React.FC<{ p: Pal; on: OnFn }> = ({ p, on }) => (
  <g>
    {BAND_WINS.map((w, i) => {
      const a = on(w); if (a < 0.01) return null;
      return <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} fill={w.c ? p.winCool : p.win} opacity={a * 0.92} />;
    })}
  </g>
);

/** minaret lantern + hall arches lit (band space) */
export const MosqueLamp: React.FC<{ on: number; p: Pal; arches?: number }> = ({ on, p, arches = 1 }) => {
  if (on < 0.01) return null;
  const c = LANTERN.x;
  return (
    <g opacity={on}>
      <defs><radialGradient id="cmLamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff3d6" stopOpacity={0.7} /><stop offset="0.4" stopColor={p.win} stopOpacity={0.25} /><stop offset="1" stopColor={p.win} stopOpacity={0} /></radialGradient></defs>
      <ellipse cx={c} cy={LANTERN.y} rx={60} ry={70} fill="url(#cmLamp)" />
      <path d={`M${c - 9} 972 V946 A4 4 0 0 1 ${c - 1} 946 V972 Z`} fill="#fff1cf" />
      <path d={`M${c + 1} 972 V946 A4 4 0 0 1 ${c + 9} 946 V972 Z`} fill="#fff1cf" />
      {HALL_ARCHES.map((a, i) => <path key={i} d={`M${a.x} ${a.y + a.h} V${a.y + a.w / 2} A${a.w / 2} ${a.w / 2} 0 0 1 ${a.x + a.w} ${a.y + a.w / 2} V${a.y + a.h} Z`} fill={p.win} opacity={0.85 * arches} />)}
    </g>
  );
};

/** red aviation lights, slow blink (band space) */
export const RedLights: React.FC<{ t: number; on: number }> = ({ t, on }) => {
  if (on < 0.01) return null;
  return (
    <g>
      <defs><radialGradient id="cRed" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff5a48" stopOpacity={0.6} /><stop offset="1" stopColor="#ff5a48" stopOpacity={0} /></radialGradient></defs>
      {RED_LIGHTS.map((l, i) => {
        const ph = (t / 1.7 + l.ph) % 1;
        const a = on * (ph < 0.45 ? Math.min(1, ph / 0.06, (0.45 - ph) / 0.08) : 0) ;
        return <g key={i} opacity={0.15 + 0.85 * a}><circle cx={l.x} cy={l.y} r={14} fill="url(#cRed)" /><circle cx={l.x} cy={l.y} r={3} fill="#ff6a55" /></g>;
      })}
    </g>
  );
};

/** near kampung rows with their windows, mist between rows (near space) */
export const NearArt: React.FC<{ p: Pal; on: OnFn }> = ({ p, on }) => (
  <g>
    <WinDefs id="cnw" p={p} />
    <defs>
      {NEAR_ROWS.map((r, i) => (
        <linearGradient key={i} id={`cmist${i}`} gradientUnits="userSpaceOnUse" x1="0" y1={r.eave - 30} x2="0" y2={r.eave + 120}>
          <stop offset="0" stopColor={p.mist} stopOpacity={0} />
          <stop offset="0.6" stopColor={p.mist} stopOpacity={p.mistO} />
          <stop offset="1" stopColor={p.mist} stopOpacity={p.mistO * 0.5} />
        </linearGradient>
      ))}
    </defs>
    {NEAR_ROWS.map((r, ri) => (
      <g key={ri}>
        <path d={r.d} fill={p[r.tone]} />
        {ri < 3 && <rect x={-200} y={r.eave - 30} width={W + 400} height={150} fill={`url(#cmist${ri})`} />}
        {r.wins.map((w, i) => {
          const a = on(w); if (a < 0.01) return null;
          return (
            <g key={i} opacity={a}>
              <ellipse cx={w.x + w.w / 2} cy={w.y + w.h / 2} rx={w.w * 2.6} ry={w.h * 2} fill={`url(#cnw${w.c ? 'c' : 'w'})`} />
              <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={w.c ? p.winCool : p.win} />
              <rect x={w.x + w.w * 0.46} y={w.y} width={Math.max(1, w.w * 0.08)} height={w.h} fill="#000" opacity={0.35} />
            </g>
          );
        })}
      </g>
    ))}
  </g>
);

/** foreground utility pole + cables (closest framing element) */
export const POLE = { x: 1128, top: 1236 };
export const PoleArt: React.FC<{ fill: string }> = ({ fill }) => {
  const { x, top } = POLE;
  return (
    <g>
      <g fill={fill}>
        <polygon points={`${x - 9},${H + 60} ${x - 6},${top} ${x + 6},${top} ${x + 9},${H + 60}`} />
        <rect x={x - 52} y={top + 26} width={104} height={7} />
        <rect x={x - 40} y={top + 70} width={80} height={6} />
        {[-46, -22, 18, 42].map((o) => <rect key={o} x={x + o - 2} y={top + 14} width={5} height={13} />)}
        <rect x={x + 8} y={top + 100} width={30} height={52} rx={4} />
        <rect x={x + 6} y={top + 96} width={34} height={6} />
      </g>
      <g stroke={fill} fill="none" strokeWidth={2.4}>
        <path d={`M${x + 20} ${top + 20} Q${x + 120} ${top + 70} ${x + 260} ${top - 60}`} />
        <path d={`M${x + 44} ${top + 20} Q${x + 140} ${top + 90} ${x + 280} ${top - 20}`} />
        <path d={`M${x - 44} ${top + 20} Q${x - 120} ${top + 150} ${x - 170} ${top + 300}`} />
        <path d={`M${x - 20} ${top + 20} Q${x - 90} ${top + 170} ${x - 120} ${top + 318}`} />
        <path d={`M${x - 36} ${top + 74} Q${x - 80} ${top + 190} ${x - 70} ${top + 330}`} strokeWidth={3} />
      </g>
    </g>
  );
};

/** the single star of shot 8 (sky space) */
export const Star: React.FC<{ x: number; y: number; a: number; s?: number }> = ({ x, y, a, s = 1 }) => (
  <g opacity={a}>
    <defs><radialGradient id="cStar" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff6dc" stopOpacity={0.75} /><stop offset="0.2" stopColor="#fff6dc" stopOpacity={0.22} /><stop offset="1" stopColor="#fff6dc" stopOpacity={0} /></radialGradient></defs>
    <circle cx={x} cy={y} r={70 * s} fill="url(#cStar)" />
    <path d={`M${x - 30 * s} ${y} L${x + 30 * s} ${y} M${x} ${y - 36 * s} L${x} ${y + 36 * s}`} stroke="#fff6dc" strokeWidth={1.1} strokeOpacity={0.45} />
    <circle cx={x} cy={y} r={4.2 * s} fill="#fff6dc" />
  </g>
);
