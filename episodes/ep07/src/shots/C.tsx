import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { rng } from '../art/world';
import { GM, LampFlicker, Digger, DiggerFace, Truck, Tiny } from '../art/goldfield_art';

/** soft drifting smoke banks (environment, on ones) */
const Smoke: React.FC<{ t: number; y0: number; y1: number; col: string; n: number; v?: number; seed?: number; op?: number }> = ({ t, y0, y1, col, n, v = 30, seed = 3, op = 0.6 }) => {
  const r = rng(seed); const id = `gsm${seed}`;
  const ps = Array.from({ length: n }).map(() => ({ x: r() * 1800 - 250, y: y0 + r() * (y1 - y0), rx: 220 + r() * 380, ry: 60 + r() * 110, v: v * (0.6 + r() * 0.8) }));
  return (
    <g>
      <defs><radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={col} stopOpacity={op} /><stop offset="1" stopColor={col} stopOpacity={0} /></radialGradient></defs>
      {ps.map((q, i) => <ellipse key={i} cx={((q.x + t * q.v + 250) % 1800) - 250} cy={q.y} rx={q.rx} ry={q.ry} fill={`url(#${id})`} />)}
    </g>
  );
};
/** wind-blown dust sheet sweeping across (environment) */
const DustSweep: React.FC<{ k: number; y: number; col: string }> = ({ k, y, col }) => (
  <g opacity={Math.sin(Math.min(1, k) * Math.PI)}>
    <defs><radialGradient id="gdSw" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={col} stopOpacity={0.7} /><stop offset="1" stopColor={col} stopOpacity={0} /></radialGradient></defs>
    {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={-500 + k * 2200 - i * 260} cy={y - i * 30 + Math.sin(k * 6 + i) * 20} rx={420} ry={110 + i * 20} fill="url(#gdSw)" />)}
  </g>
);

/** shot 1 — HOOK, night: thousands of lamps on the gold mountain; in the foreground a sweating man grips a shovel, chest heaving; his grip tightens on "die". Push-in past him. */
export const S01: React.FC = () => {
  const { p, t, t2 } = useShot();
  const td = wordAt(1, /^die/i, 0.69);
  const cam: Cam = { zoom: 1.05 + 0.2 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 700, oy: 940 };
  const grip = ramp(t2, td - 0.08, td + 0.12);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060c' }}>
      <BandImg id="goldfield/night" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        <LampFlicker t={t} />
        <Smoke t={t} y0={1250} y1={1700} col="#2a2228" n={8} seed={4} op={0.55} />
      </Live>
      <Live k={1.2} cam={cam}>
        <Digger x={440} y={2230} h={1120} br={t2 * 3.4} grip={grip} t2={t2} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 2 — night, close: his face in the gold light, gold in his eyes; he swallows, then a small determined smile on "survives". Slow push-in. */
export const S02: React.FC = () => {
  const { p, t, t2 } = useShot();
  const ts = wordAt(2, /^survives/i, 0.68);
  const cam: Cam = { zoom: 1.03 + 0.07 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 800 };
  const sw = Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (t2 - (ts - 1.0)) / 0.5))));
  const smile = ramp(t2, ts - 0.05, ts + 0.3);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0806' }}>
      <BandImg id="goldfield/bokeh" k={0.6} cam={cam} />
      <Live k={1} cam={cam}>
        <DiggerFace x={640} y={1020} s={1.55} swallow={sw} smile={smile} br={t2 * 3} t={t} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 8 — day, extreme wide: plain-uniform soldiers in trucks fence the gold (arriving on "soldiers"); far off, two lines clash in dust, a flash on "other". Silhouettes only. */
export const S08: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tsol = wordAt(8, /^soldiers/i, 0.11), to = wordAt(8, /^other/i, 0.87);
  const cam: Cam = { zoom: 1.06 + 0.07 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: -200, ox: 540, oy: 1300 };
  const arrive = ramp(t, tsol, tsol + 0.9);
  const flashes = [to - 0.9, to - 0.5, to, to + 0.2];
  const fl = (tt: number) => (t >= tt ? Math.exp(-(t - tt) * 7) : 0);
  const r = rng(31);
  const fence = Array.from({ length: 22 }).map((_, i) => ({ x: 120 + i * 50 + r() * 14, ph: r() * 6 }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e2d6' }}>
      <BandImg id="goldfield/day" k={0.95} cam={cam} />
      <Live k={0.95} cam={cam}>
        {/* far side: two lines clash in dust (silhouettes only) */}
        <Smoke t={t} y0={1400} y1={1500} col="#d8c4a0" n={8} v={18} seed={9} op={0.85} />
        {Array.from({ length: 8 }).map((_, i) => <Tiny key={`a${i}`} x={250 + i * 34 + Math.sin(t2 * 6 + i) * 5 + 12 * Math.sin(t2 * 3)} y={1500 + (i % 2) * 8} s={2.6} col="#4a3a2c" ph={t2 * 8 + i} />)}
        {Array.from({ length: 8 }).map((_, i) => <Tiny key={`b${i}`} x={860 - i * 34 + Math.sin(t2 * 6 + i) * 5 - 12 * Math.sin(t2 * 3)} y={1502 + (i % 2) * 8} s={2.6} col="#3a3430" ph={t2 * 8 + i + 1} />)}
        <ellipse cx={555} cy={1470} rx={150 + 20 * Math.sin(t * 3)} ry={70} fill="#e8d4ac" opacity={0.75} />
        {flashes.map((tt, i) => { const a = fl(tt) * (i === 2 ? 1.6 : 1); return a > 0.02 ? <g key={i}><circle cx={500 + i * 40} cy={1450 - (i % 2) * 20} r={70 * a} fill="#fff6d8" opacity={Math.min(1, a)} /><circle cx={500 + i * 40} cy={1450} r={180 * a} fill="#ffe0a0" opacity={0.35 * Math.min(1, a)} /></g> : null; })}
        {/* the fence line of soldiers and trucks in front of the gold */}
        {[0, 1, 2, 3].map((i) => <Truck key={i} x={220 + i * 260 + (1 - arrive) * (700 + i * 120)} y={1650 + (i % 2) * 18} s={0.7} col="#5a5a50" dir={-1} />)}
        {fence.map((q, i) => (i / fence.length < arrive ? <Tiny key={i} x={q.x} y={1695} s={1.8} col="#3e3e38" ph={t2 * 2 + q.ph} /> : null))}
        <rect x={60} y={1682} width={1180} height={4} fill="#5a5a50" opacity={0.6 * arrive} />
        {Array.from({ length: 12 }).map((_, i) => <rect key={`f${i}`} x={60 + i * 107} y={1652} width={5} height={36} fill="#5a5a50" opacity={arrive} />)}
        <Smoke t={t} y0={1640} y1={1720} col="#e2c28a" n={5} v={40} seed={12} op={0.5} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 11 — dawn, extreme wide: the gold mountain glowing in drifting smoke, tiny figures and lamps on its slopes; most lamps go out on "killed". Upper frame calm for the quote. Very slow push-in. */
export const S11: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tk = wordAt(11, /^killed/i, 0.89);
  const cam: Cam = { zoom: 1.0 + 0.06 * ramp(p, 0, 1, (n) => n), dx: 0, dy: 0, ox: 600, oy: 1200 };
  const r = rng(41);
  const figs = Array.from({ length: 60 }).map(() => { const y = GM.top + 120 + r() * 520; const span = (y - GM.top) / (GM.base - GM.top); return { x: GM.cx + (r() * 2 - 1) * GM.w * 0.42 * Math.sqrt(span), y, o: r(), ph: r() * 6 }; });
  return (
    <AbsoluteFill style={{ backgroundColor: '#2e2238' }}>
      <BandImg id="goldfield/dawn" k={0.95} cam={cam} />
      <Live k={0.95} cam={cam}>
        {figs.map((q, i) => {
          const lit = q.o < 0.03 ? 1 : 1 - ramp(t, tk + q.o * 0.4, tk + q.o * 0.4 + 0.08);
          return <g key={i}><Tiny x={q.x} y={q.y} s={0.8} col="#3a2418" ph={t2 * 4 + q.ph} />{lit > 0.02 && <circle cx={q.x + 5} cy={q.y - 12} r={3.5} fill="#ffcf86" opacity={lit} />}</g>;
        })}
        <Smoke t={t} y0={1100} y1={1650} col="#5a4458" n={9} v={22} seed={5} op={0.6} />
        <Smoke t={t} y0={1500} y1={1900} col="#2a2228" n={6} v={35} seed={6} op={0.5} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 13 — dawn, wide: the gold silent and untouched, abandoned shovels standing in the sand like markers, no people; wind lifts dust on "owned". Slow pull-back. */
export const S13: React.FC = () => {
  const { p, t } = useShot();
  const tw = wordAt(13, /^owned/i, 0.86);
  const cam: Cam = { zoom: 1.22 - 0.14 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: -220, ox: 560, oy: 1250 };
  const r = rng(51);
  const shovels = Array.from({ length: 26 }).map(() => { const y = 1620 + Math.pow(r(), 1.3) * 520; const s = 0.5 + (y - 1620) / 520 * 1.4; return { x: r() * 1296, y, s, lean: r() * 16 - 8 }; }).sort((a, b) => a.y - b.y);
  return (
    <AbsoluteFill style={{ backgroundColor: '#2e2238' }}>
      <BandImg id="goldfield/dawn" k={0.9} cam={cam} />
      <Live k={1.1} cam={cam}>
        {shovels.map((q, i) => (
          <g key={i} transform={`translate(${q.x} ${q.y}) rotate(${q.lean}) scale(${q.s})`}>
            <path d="M0 0 L300 -60" stroke="#1a1214" strokeWidth={10} opacity={0.35} />
            <rect x={-4} y={-260} width={8} height={230} fill="#3a2418" />
            <rect x={-22} y={-270} width={44} height={10} rx={4} fill="#3a2418" />
            <path d="M-26 -40 L26 -40 L22 20 L0 34 L-22 20 Z" fill="#4a4248" />
            <path d="M-4 -258 L-4 -40" stroke="#ffd0a0" strokeOpacity={0.5} strokeWidth={2} />
          </g>
        ))}
        <DustSweep k={(t - (tw - 0.25)) / 1.3} y={1900} col="#c9a08a" />
      </Live>
    </AbsoluteFill>
  );
};
