import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { rng } from '../art/world';
import { HL, Statue, STONE_DAY, STONE_SIL, TOP } from '../art/hill_art';
import { Worker, Visitor, FatherChild, FlowerHand, LaidFlower, TopWalker, WomanProfile } from '../art/hill_people';

/** drifting dust motes (environment, on ones) */
const Dust: React.FC<{ t: number; n: number; col: string; seed?: number }> = ({ t, n, col, seed = 2 }) => {
  const r = rng(seed);
  const ps = Array.from({ length: n }).map(() => ({ x: r() * 1296, y: 400 + r() * 1800, v: 8 + r() * 26, s: 1.5 + r() * 3.5, ph: r() * 6 }));
  return <g fill={col}>{ps.map((q, i) => <circle key={i} cx={q.x + t * q.v} cy={q.y - t * q.v * 0.3 + Math.sin(t * 0.8 + q.ph) * 10} r={q.s} opacity={0.3 + 0.25 * Math.sin(t * 1.5 + q.ph)} />)}</g>;
};
/** rope on posts in front of the statue */
const Rope: React.FC<{ x0: number; x1: number; y: number; n: number; post: string; rope: string; h?: number }> = ({ x0, x1, y, n, post, rope, h = 120 }) => {
  const xs = Array.from({ length: n }).map((_, i) => x0 + ((x1 - x0) * i) / (n - 1));
  return (
    <g>
      {xs.slice(0, -1).map((x, i) => <path key={i} d={`M${x} ${y - h} Q${(x + xs[i + 1]) / 2} ${y - h + 34} ${xs[i + 1]} ${y - h}`} stroke={rope} strokeWidth={5} fill="none" />)}
      {xs.map((x, i) => <rect key={`p${i}`} x={x - 6} y={y - h - 10} width={12} height={h + 10} fill={post} />)}
    </g>
  );
};
const FLOWER_COLS = ['#e9b8c0', '#f2e2a0', '#f0f0ea', '#e88a6a', '#c9a0d0'];

/** shot 8 — day: the excavation; two workers dig around a weathered stone head; the last shovel of soil clears it on "uncovered". Slow push-in. */
export const S08: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tu = wordAt(8, /^uncovered/i, 0.73);
  const cam: Cam = { zoom: 1.22 + 0.1 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: -260, ox: 540, oy: 1200 };
  const base = 2350, h = 900, u = h / 10, hy = base - u * 8.4;
  const cap = 1 - ramp(t2, tu - 0.1, tu + 0.15); // last clump on the head
  const digL = t2 < tu - 0.4 ? (Math.sin(t2 * 5) + 1) / 2 : 1 - ramp(t2, tu - 0.4, tu + 0.05) + ramp(t2, tu + 0.05, tu + 0.3) * 0.6;
  const digR = (Math.sin(t2 * 4.4 + 1.5) + 1) / 2;
  return (
    <AbsoluteFill style={{ backgroundColor: '#dfe6ea' }}>
      <BandImg id="hill/day" k={0.95} cam={cam} />
      <Live k={1} cam={cam}>
        <Statue x={HL.cx} base={base} h={h} p={STONE_DAY} />
        {/* the soil still burying the body */}
        <path d={`M${HL.cx - 420} ${HL.crest + 40} Q${HL.cx - 300} ${hy + u * 0.4} ${HL.cx - u * 0.95} ${hy + u * 0.55} Q${HL.cx} ${hy + u * 1.2} ${HL.cx + u * 0.95} ${hy + u * 0.55} Q${HL.cx + 300} ${hy + u * 0.4} ${HL.cx + 420} ${HL.crest + 40} L${HL.cx + 500} 2400 L${HL.cx - 500} 2400 Z`} fill="#8e6c46" />
        <path d={`M${HL.cx - u * 0.95} ${hy + u * 0.55} Q${HL.cx} ${hy + u * 1.2} ${HL.cx + u * 0.95} ${hy + u * 0.55}`} stroke="#6e5236" strokeWidth={8} fill="none" />
        {cap > 0.01 && <path d={`M${HL.cx - u * 0.9} ${hy - u * 0.35} Q${HL.cx - u * 0.6} ${hy - u * 1.35} ${HL.cx + u * 0.1} ${hy - u * 1.3} Q${HL.cx + u * 0.55} ${hy - u * 0.8} ${HL.cx + u * 0.1} ${hy - u * 0.2} Z`} fill="#8e6c46" opacity={cap} transform={`translate(${-(1 - cap) * 60} ${-(1 - cap) * 40})`} />}
        {/* soil flicked off the shovel */}
        {t2 > tu && t2 < tu + 0.6 && [0, 1, 2, 3].map((i) => <circle key={i} cx={HL.cx - 200 - (t2 - tu) * 300 - i * 18} cy={hy - 140 - (t2 - tu) * 260 + (t2 - tu) ** 2 * 900 + i * 10} r={9 - i} fill="#7a5c3c" />)}
        <Worker x={HL.cx - 300} y={HL.crest + 70} h={430} dir={1} dig={clamp01(digL)} shirt="#5a6a7a" pants="#3a3a3e" skin="#9a6a52" hat="#c9b07a" rim="#fff6e0" />
        <Worker x={HL.cx + 330} y={HL.crest + 90} h={450} dir={-1} dig={digR} shirt="#a8784a" pants="#4a4038" skin="#8a5a44" hat="#e2d8c0" rim="#fff6e0" />
        <Dust t={t} n={40} col="#e8d8b8" />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — day: the whole stone figure revealed in the pit, roped off, looming over the workers; slow tilt up, dust drifting. */
export const S09: React.FC = () => {
  const { p, t, t2 } = useShot();
  const cam: Cam = { zoom: 1.16, dx: 0, dy: 0, ty: -300 + 560 * ramp(p, 0, 1, EIO), ox: 540, oy: 960 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#dfe6ea' }}>
      <BandImg id="hill/day" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <ellipse cx={HL.cx} cy={HL.crest + 150} rx={330} ry={50} fill="#5a4230" opacity={0.6} />
        <Statue x={HL.cx} base={HL.crest + 150} h={1150} p={STONE_DAY} />
        <Worker x={HL.cx - 360} y={HL.crest + 200} h={330} dir={1} dig={0.2 + 0.1 * Math.sin(t2 * 2)} shirt="#5a6a7a" pants="#3a3a3e" skin="#9a6a52" hat="#c9b07a" rim="#fff6e0" />
        <Visitor x={HL.cx + 390} y={HL.crest + 210} h={340} body="#a8784a" head="#8a5a44" point={0.6 + 0.2 * Math.sin(t2 * 1.5)} sw={t2 * 1.8} />
        <Rope x0={HL.cx - 520} x1={HL.cx + 520} y={HL.crest + 290} n={6} post="#5a4430" rope="#d8b88a" />
        <Dust t={t} n={70} col="#efe2c4" seed={5} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — day: visitors with sun umbrellas behind the rope, pointing; a father lifts his child onto his shoulders on "look". Lateral track. */
export const S10: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tl = wordAt(10, /^look/i, 0.8);
  const cam: Cam = { zoom: 1.1, dx: 60 - 120 * ramp(p, 0, 1, (n) => n), dy: 0, ox: 540, oy: 1000 };
  const lift = ramp(t2, tl - 0.35, tl + 0.05);
  const fy = 2150;
  return (
    <AbsoluteFill style={{ backgroundColor: '#dfe6ea' }}>
      <BandImg id="hill/day" k={0.6} cam={cam} />
      <Live k={0.6} cam={cam}>
        <Statue x={HL.cx + 60} base={HL.crest + 120} h={820} p={STONE_DAY} />
        <Rope x0={HL.cx - 600} x1={HL.cx + 700} y={HL.crest + 260} n={7} post="#5a4430" rope="#d8b88a" h={100} />
        <Dust t={t} n={30} col="#efe2c4" seed={8} />
      </Live>
      <Live k={1.1} cam={cam}>
        <Visitor x={190} y={fy} h={620} body="#7a6a8a" head="#9a6a52" scarf="#c98a8a" umbrella="#d8c06a" sw={t2 * 1.6} />
        <Visitor x={420} y={fy + 30} h={640} body="#4a5a6a" head="#8a5a44" point={0.7 + 0.25 * Math.sin(t2 * 2.2)} sw={t2 * 1.4 + 1} />
        <FatherChild x={680} y={fy + 10} h={650} lift={lift} sw={t2 * 1.3 + 2} />
        <Visitor x={930} y={fy + 20} h={610} body="#8a6a4a" head="#a8765c" scarf="#5a6a8a" umbrella="#8ab0c8" sw={t2 * 1.7 + 3} />
        <Visitor x={1130} y={fy + 40} h={630} body="#5a4a3a" head="#9a6a52" point={0.4} sw={t2 * 1.5 + 4} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 11 — dusk, close: flowers piling at the statue's base; a hand lays a flower on "flowers". Locked with a slight drift. */
export const S11: React.FC = () => {
  const { p, t2 } = useShot();
  const tf = wordAt(11, /^flowers/i, 0.55);
  const cam: Cam = { zoom: 1.12 + 0.03 * p, dx: -10 * p, dy: 0, ox: 540, oy: 1000 };
  const r = rng(13);
  const pile = Array.from({ length: 22 }).map(() => ({ x: 120 + r() * 700, y: 1260 + r() * 150, s: 1.6 + r() * 0.8, rot: r() * 360, c: FLOWER_COLS[Math.floor(r() * 5)] }));
  const k1 = ramp(t2, 0, Math.max(0.3, tf - 0.45));
  const k2 = ramp(t2, tf - 0.4, tf);
  return (
    <AbsoluteFill style={{ backgroundColor: '#8a4e5a' }}>
      <BandImg id="hill/base" k={0.8} cam={cam} />
      <Live k={1} cam={cam}>
        <rect x={-100} y={1180} width={1500} height={1300} fill="#3a2830" /><rect x={-100} y={1180} width={1500} height={6} fill="#ffb07a" opacity={0.35} />
        {pile.map((f, i) => <LaidFlower key={i} x={f.x} y={f.y} s={f.s} rot={f.rot} col={f.c} />)}
        {k1 >= 1 && <LaidFlower x={360} y={1240} s={2} rot={-20} col="#f0f0ea" />}
        {k1 < 1 && <FlowerHand from={[-200, 760]} to={[300, 1200]} k={k1} skin="#a8765c" sleeve="#4a5a6a" flower="#f0f0ea" />}
        {k2 >= 1 && <LaidFlower x={620} y={1280} s={2.2} rot={200} col="#e88a6a" />}
        {k2 < 1 && <FlowerHand from={[1400, 700]} to={[760, 1240]} k={k2} skin="#9a6a52" sleeve="#7a4a5a" flower="#e88a6a" />}
        {k2 >= 1 && <FlowerHand from={[1400, 700]} to={[760, 1240]} k={1 - ramp(t2, tf + 0.05, tf + 0.5)} skin="#9a6a52" sleeve="#7a4a5a" flower="#00000000" />}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 12 — dusk, top-down: a ring of people slowly circling the statue; the gap closes on "circles". Very slow rotation. */
export const S12: React.FC = () => {
  const { p, t2 } = useShot();
  const tc = wordAt(12, /^circles/i, 0.81);
  const cam: Cam = { zoom: 1.1 + 0.05 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, rot: -8 * ramp(p, 0, 1, (n) => n), ox: TOP.cx - 108, oy: TOP.cy - 192 };
  const N = 30, fill = 0.55 + 0.45 * ramp(t2, 0.2, tc, (n) => n);
  const R = TOP.ring;
  const cols = ['#6a5060', '#4a3a5a', '#7a4a4a', '#3a3e50', '#8a6a52', '#4e5a4e'];
  return (
    <AbsoluteFill style={{ backgroundColor: '#5a4048' }}>
      <BandImg id="hill/top" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        {Array.from({ length: N }).map((_, i) => {
          const a = -0.4 * t2 + (i / N) * Math.PI * 2 * fill + 1.2;
          const rr = R + ((i * 13) % 5 - 2) * 6;
          return <TopWalker key={i} x={TOP.cx + Math.cos(a) * rr} y={TOP.cy + Math.sin(a) * rr} a={a - Math.PI} s={1} body={cols[i % 6]} head={i % 3 === 0 ? '#2e2232' : '#1a1416'} ph={t2 * 7 + i} />;
        })}
        {/* newcomers walking in toward the gap */}
        {[0, 1, 2].map((i) => { const k = clamp01((t2 - i * 0.5) / (tc - i * 0.5)); const a = 1.2 + Math.PI * 2 * fill - 0.4 * t2 + 0.15; const x0 = TOP.cx + Math.cos(a) * (R + 600 - i * 80), y0 = TOP.cy + Math.sin(a) * (R + 600 - i * 80); const x = x0 + (TOP.cx + Math.cos(a) * R - x0) * k, y = y0 + (TOP.cy + Math.sin(a) * R - y0) * k; return k < 1 ? <TopWalker key={`n${i}`} x={x} y={y} a={a + Math.PI / 2} s={1} body={cols[(i + 2) % 6]} head="#1d1a1a" ph={t2 * 8 + i} /> : null; })}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 13 — dusk, close: a calm woman, eyes half closed, steps into the ring on "right"; walkers pass out of focus behind her. Slow push-in. */
export const S13: React.FC = () => {
  const { p, t2 } = useShot();
  const tr = wordAt(13, /^right/i, 0.76);
  const cam: Cam = { zoom: 1.04 + 0.06 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 960 };
  const step = ramp(t2, tr - 0.45, tr + 0.15);
  return (
    <AbsoluteFill style={{ backgroundColor: '#8a4e5a' }}>
      <BandImg id="hill/base" k={0.7} cam={cam} />
      <Live k={0.8} cam={cam}>
        {[0, 1, 2, 3].map((i) => { const x = 1500 - ((t2 * 160 + i * 420) % 1900); return <g key={i} opacity={0.55}><ellipse cx={x} cy={1080} rx={70} ry={86} fill="#2a1e28" /><path d={`M${x - 150} 2400 L${x - 130} 1220 Q${x} 1160 ${x + 130} 1220 L${x + 150} 2400 Z`} fill="#2a1e28" /></g>; })}
      </Live>
      <Live k={1} cam={cam}>
        <WomanProfile x={900 - 280 * step} y={980 + 20 * Math.sin(step * Math.PI)} s={1.5} eyes={0.35} br={t2 * 1.8} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 14 — dusk, wide: the statue silhouetted on the hill against the sky, a tiny ring circling it, the city small below. Upper frame calm for the quote. Very slow push-in. */
export const S14: React.FC = () => {
  const { p, t, t2 } = useShot();
  const cam: Cam = { zoom: 1.03 + 0.06 * ramp(p, 0, 1, (n) => n), dx: 0, dy: 0, ox: 540, oy: 1500 };
  const sx = HL.cx, sb = 1705, N = 24;
  const ring = Array.from({ length: N }).map((_, i) => { const a = 0.3 * t2 + (i / N) * Math.PI * 2; return { a, x: sx + Math.cos(a) * 170, y: sb + Math.sin(a) * 26, i }; });
  const walker = (q: { x: number; y: number; i: number }) => <g key={q.i}><rect x={q.x - 6} y={q.y - 34 - Math.abs(Math.sin(t2 * 6 + q.i)) * 2} width={12} height={30} rx={5} fill="#120d16" /><circle cx={q.x} cy={q.y - 40 - Math.abs(Math.sin(t2 * 6 + q.i)) * 2} r={6} fill="#120d16" /></g>;
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a1e34' }}>
      <BandImg id="hill/dusk" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        {[[300, 1640], [780, 1660], [1040, 1630], [520, 1690]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#ffcf86" opacity={0.4 + 0.4 * Math.sin(t * 3 + i * 2)} />)}
      </Live>
      <Live k={1} cam={cam}>
        {ring.filter((q) => Math.sin(q.a) < 0).map(walker)}
        <Statue x={sx} base={sb} h={520} p={STONE_SIL} />
        {ring.filter((q) => Math.sin(q.a) >= 0).map(walker)}
        {[0, 1, 2].map((i) => { const a = t * 0.4 + i * 2.1; const x = sx + Math.cos(a) * 320, y = 1180 + Math.sin(a) * 60; const w = Math.sin(t * 10 + i) * 5; return <path key={`b${i}`} d={`M${x - 12} ${y + w} Q${x - 5} ${y - 4} ${x} ${y} Q${x + 5} ${y - 4} ${x + 12} ${y + w}`} stroke="#120d16" strokeWidth={2.5} fill="none" />; })}
      </Live>
    </AbsoluteFill>
  );
};
