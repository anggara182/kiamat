import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { rng } from '../art/world';
import { Banner, BANNER_COLS, ridgeAt, VALLEY, COAST, shoreAt, MIST, slopeArmy, Figure, Shepherd, Goat, Ship } from '../art/banners_art';

/** shot 1 — HOOK, day: banners rise over the long ridge one after another until it is full on "soldiers"; in front, a shepherd boy and his goats freeze and stare. */
export const S01: React.FC = () => {
  const { p, t, t2 } = useShot();
  const ts = wordAt(1, /^soldiers/i, 0.8), tb = wordAt(1, /^banners/i, 0.12);
  const cam: Cam = { zoom: 1.04 + 0.06 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 1100 };
  const r = rng(11);
  const ban = Array.from({ length: 80 }).map((_, i) => ({ x: -10 + i * 16.7 + r() * 8, ord: r(), col: BANNER_COLS[Math.floor(r() * 5)], stripe: r() < 0.3, ph: r() * 6, h: 190 + r() * 60 }));
  const rise = (o: number) => ramp(t, -0.2 + o * (ts - 0.25), 0.25 + o * (ts - 0.25), (n) => 1 - (1 - n) ** 3);
  const fill = ramp(t, 0, ts);
  const sky = `M-100 -300 L1400 -300 L1400 ${ridgeAt(1400)} ${Array.from({ length: 40 }).map((_, i) => { const x = 1400 - i * 38; return `L${x} ${ridgeAt(x).toFixed(1)}`; }).join(' ')} L-100 ${ridgeAt(-100)} Z`;
  const still = ramp(t2, tb, tb + 0.4);
  return (
    <AbsoluteFill style={{ backgroundColor: '#e8e4da' }}>
      <BandImg id="banners/ridge" k={0.95} cam={cam} />
      <Live k={0.95} cam={cam}>
        <defs><clipPath id="bnSky"><path d={sky} /></clipPath></defs>
        <g clipPath="url(#bnSky)">
          <path d={`M-100 ${ridgeAt(-100) + 10} ${Array.from({ length: 40 }).map((_, i) => { const x = -100 + i * 38; return `L${x} ${(ridgeAt(x) - 22 * fill - 4 * Math.sin(i * 1.7 + t2 * 2) * fill).toFixed(1)}`; }).join(' ')} L1400 ${ridgeAt(1400) + 10} Z`} fill="#2a2622" />
          {ban.map((b, i) => { const k = rise(b.ord); return k > 0 ? <Banner key={i} x={b.x} y={ridgeAt(b.x) + 30 + (1 - k) * (b.h + 20)} h={b.h} col={b.col} stripe={b.stripe} t={t} ph={b.ph} /> : null; })}
        </g>
      </Live>
      <Live k={1.1} cam={cam}>
        <Goat x={150} y={1840} s={1.1} up={ramp(t2, tb + 0.2, tb + 0.6)} t2={t2} />
        <Goat x={520} y={1880} s={1.0} up={ramp(t2, tb + 0.3, tb + 0.7)} dir={-1} col="#d8d0c0" t2={t2} />
        <Goat x={760} y={1820} s={0.9} up={ramp(t2, tb + 0.25, tb + 0.65)} col="#4a3e36" t2={t2} />
        <Shepherd x={360} y={1800} h={460} still={still} t2={t2} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 2 — day, extreme wide from above the ridge: the army pours down the far slope into the valley like a dark flood, banners swaying above; revealed by a high crane on "promise". */
export const S02: React.FC = () => {
  const { t, t2 } = useShot();
  const tm = wordAt(2, /^million/i, 0.14), tp = wordAt(2, /^promise/i, 0.76);
  const up = ramp(t, tm, tp, EIO);
  const cam: Cam = { zoom: 1.45 - 0.45 * up, dx: 0, dy: 0, ty: 160 * (1 - up), ox: 540, oy: 1500 };
  const front = 2000 - 820 * ramp(t, 0, tp + 0.6, (n) => n); // flood front y
  const r = rng(21);
  const marks = Array.from({ length: 140 }).map(() => ({ x: r() * 1400 - 50, d: r(), col: BANNER_COLS[Math.floor(r() * 5)], ph: r() * 6 }));
  const edge = (x: number) => front + Math.sin(x / 90 + t * 0.6) * 30 + Math.sin(x / 37) * 14;
  return (
    <AbsoluteFill style={{ backgroundColor: '#e8e4da' }}>
      <BandImg id="banners/valley" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <path d={`M-60 2400 L-60 ${edge(-60)} ${Array.from({ length: 36 }).map((_, i) => { const x = -60 + i * 40; return `L${x} ${edge(x).toFixed(1)}`; }).join(' ')} L1400 ${edge(1400)} L1400 2400 Z`} fill="#2a2622" />
        <path d={`M-60 ${edge(-60)} ${Array.from({ length: 36 }).map((_, i) => { const x = -60 + i * 40; return `L${x} ${edge(x).toFixed(1)}`; }).join(' ')}`} stroke="#5a4e40" strokeWidth={6} fill="none" />
        {Array.from({ length: 260 }).map((_, i) => { const x = r() * 1400 - 50; const y = edge(x) + 10 + r() * 700; return <circle key={i} cx={x + Math.sin(t2 * 3 + i) * 1.5} cy={y} r={2 + (y - 1300) / 400} fill="#3e3830" />; })}
        {marks.map((m, i) => { const y = edge(m.x) + 20 + m.d * 650; const h = 40 + (y - 1200) / 10; return <Banner key={`m${i}`} x={m.x} y={y} h={h} col={m.col} t={t} ph={m.ph} />; })}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 6 — day, extreme wide: two allied columns (grey and olive) march side by side toward a dust storm; the dust clears and they raise their arms on "won". Silhouettes only. */
export const S06: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tw = wordAt(6, /^won/i, 0.83);
  const cam: Cam = { zoom: 1.08 + 0.05 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: -260, ox: 540, oy: 1100 };
  const VPt: [number, number] = [650, VALLEY.hz + 10];
  const col = (lane: -1 | 1, i: number) => { const k = ((i / 140) + t2 * 0.012) % 1; const d = 1 - k; const x = VPt[0] + lane * (60 + 300 * d * d) + ((i % 4) - 1.5) * 70 * d * d + Math.sin(i * 7.1) * 10 * d * d; const y = VPt[1] + (2300 - VPt[1]) * d * d; return { x, y, s: 0.2 + 2.6 * d * d, i }; };
  const arm = ramp(t2, tw - 0.05, tw + 0.2);
  const dust = 1 - 0.85 * ramp(t, tw - 1.2, tw);
  const ppl = [...Array.from({ length: 140 }).map((_, i) => ({ ...col(-1, i), c: '#4e5258' })), ...Array.from({ length: 140 }).map((_, i) => ({ ...col(1, i), c: '#5a5a3e' }))].sort((a, b) => a.y - b.y);
  return (
    <AbsoluteFill style={{ backgroundColor: '#e8e4da' }}>
      <BandImg id="banners/valley" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs><radialGradient id="bnDust" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#b8a07a" stopOpacity={0.95} /><stop offset="1" stopColor="#b8a07a" stopOpacity={0} /></radialGradient></defs>
        {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={350 + i * 160 + Math.sin(t + i) * 30} cy={VALLEY.hz - 80 + (i % 2) * 60} rx={520} ry={460} fill="url(#bnDust)" opacity={dust} />)}
        <rect x={-200} y={-300} width={1700} height={VALLEY.hz + 200} fill="#c4ac84" opacity={0.5 * dust} />
        {ppl.map((q) => <Figure key={`${q.c}${q.i}`} x={q.x} y={q.y} s={q.s * 1.3} col={q.c} arm={arm} />)}
        {[-1, 1].map((lane) => [0.25, 0.5, 0.75].map((k) => { const d = 1 - ((k + t2 * 0.012) % 1); const x = VPt[0] + lane * (60 + 300 * d * d), y = VPt[1] + (2300 - VPt[1]) * d * d; return <Banner key={`${lane}${k}`} x={x} y={y - 18 * (0.2 + 2.6 * d * d)} h={70 * (0.2 + 2.6 * d * d)} col={lane < 0 ? '#3a4250' : '#4a4a2e'} stripe t={t} ph={k * 9} />; }))}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — dusk, extreme wide: a dark coast crowded with ships and endless camps, banners along the shore; campfires come on until all glow on "thousand". Upper frame calm for the quote. Very slow push-in. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const tt = wordAt(10, /^thousand/i, 0.89);
  const cam: Cam = { zoom: 1.02 + 0.07 * ramp(p, 0, 1, (n) => n), dx: 0, dy: 0, ox: 600, oy: 1300 };
  const r = rng(31);
  const ships = Array.from({ length: 34 }).map(() => { const y = COAST.hz + 10 + Math.pow(r(), 1.6) * 700; const k = (y - COAST.hz) / 700; return { x: 40 + r() * (shoreAt(Math.min(1, k * 1.2))[0] - 140), y, s: 0.12 + 0.8 * k, o: r() }; }).sort((a, b) => a.y - b.y);
  const tents = Array.from({ length: 160 }).map(() => { const s = Math.pow(r(), 0.8); const [sx, sy] = shoreAt(s); return { x: sx + 20 + r() * (300 + s * 500), y: sy - 10 + r() * 40 * s, k: 0.2 + s * 1.4, o: r() }; }).sort((a, b) => a.y - b.y);
  const lit = (o: number) => ramp(t, 0.3 + o * (tt - 0.5), 0.6 + o * (tt - 0.5));
  return (
    <AbsoluteFill style={{ backgroundColor: '#120e1c' }}>
      <BandImg id="banners/coast" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs><radialGradient id="bnFire" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb860" stopOpacity={0.9} /><stop offset="1" stopColor="#ff8a3a" stopOpacity={0} /></radialGradient></defs>
        {ships.map((q, i) => <Ship key={i} x={q.x + Math.sin(t * 0.6 + i) * 3} y={q.y + Math.sin(t * 1.2 + i) * 2} s={q.s} col="#141820" lights={lit(q.o)} />)}
        {tents.map((q, i) => <g key={`t${i}`}><path d={`M${q.x - 14 * q.k} ${q.y} L${q.x} ${q.y - 16 * q.k} L${q.x + 14 * q.k} ${q.y} Z`} fill="#2a2430" />{q.o < 0.5 && <circle cx={q.x + 18 * q.k} cy={q.y - 3 * q.k} r={14 * q.k * (1 + 0.15 * Math.sin(t * 8 + i))} fill="url(#bnFire)" opacity={lit(q.o)} />}</g>)}
        {Array.from({ length: 9 }).map((_, i) => { const s = 0.05 + i / 9; const [sx, sy] = shoreAt(s); const h = 50 + 150 * s; return <Banner key={`b${i}`} x={sx + 10} y={sy} h={h} col={BANNER_COLS[i % 5]} stripe={i % 3 === 0} t={t} ph={i} pole="#141218" />; })}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 14 — CLIFFHANGER, dawn: two vast armies face each other from opposite slopes over a misty gap, banners above both; a single bird crosses the gap on "before". Slow push-in into the gap. */
export const S14: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tb = wordAt(14, /^before/i, 0.8);
  const cam: Cam = { zoom: 1.0 + 0.14 * ramp(p, 0, 1, (n) => n), dx: 0, dy: 0, ox: 540, oy: 1230 };
  const leftTop = (x: number) => 1080 + (x / 560) * 340 - 20;
  const rightTop = (x: number) => 1060 + ((1316 - x) / 576) * 360 - 20;
  const L = slopeArmy(41, -10, 540, (x) => leftTop(x) - 10, 160, 520), R = slopeArmy(42, 760, 1310, (x) => rightTop(x) - 10, 160, 520);
  const bx = 648 + (t - tb) * 520, by = 1180 + Math.sin(t * 2) * 12;
  const fl = Math.sin(t * 13) * 7;
  const r = rng(43);
  const banL = Array.from({ length: 26 }).map(() => { const x = r() * 520; return { x, y: leftTop(x) + 10 + r() * 60, col: BANNER_COLS[Math.floor(r() * 5)], ph: r() * 6 }; });
  const banR = Array.from({ length: 26 }).map(() => { const x = 780 + r() * 520; return { x, y: rightTop(x) + 10 + r() * 60, col: BANNER_COLS[Math.floor(r() * 5)], ph: r() * 6 }; });
  return (
    <AbsoluteFill style={{ backgroundColor: '#3a3448' }}>
      <BandImg id="banners/mist" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        {L.map((q, i) => <Figure key={`l${i}`} x={q.x + Math.sin(t2 * 1.5 + q.ph) * 0.8} y={q.y} s={q.s * 1.4} col="#1c1a22" />)}
        {R.map((q, i) => <Figure key={`r${i}`} x={q.x + Math.sin(t2 * 1.5 + q.ph) * 0.8} y={q.y} s={q.s * 1.4} col="#201c24" />)}
        {banL.map((b, i) => <Banner key={`bl${i}`} x={b.x} y={b.y} h={130} col={b.col} t={t} ph={b.ph} pole="#141218" />)}
        {banR.map((b, i) => <Banner key={`br${i}`} x={b.x} y={b.y} h={130} col={b.col} t={t} ph={b.ph} pole="#141218" />)}
        <rect x={-200} y={MIST.floor - 160} width={1700} height={240} fill="#d8d0d8" opacity={0.25 + 0.05 * Math.sin(t * 0.7)} />
        {bx > -60 && bx < 1360 && <path d={`M${bx - 18} ${by + fl} Q${bx - 8} ${by - 6} ${bx} ${by} Q${bx + 8} ${by - 6} ${bx + 18} ${by + fl}`} stroke="#141218" strokeWidth={3.5} fill="none" strokeLinecap="round" />}
      </Live>
    </AbsoluteFill>
  );
};
