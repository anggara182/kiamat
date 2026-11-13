import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { W, H, rng } from '../art/world';
import { LL_HOR, MOON } from '../sets/llanos';
import { Silbon, Footprint, SwayGrass } from '../art/llanos_figs';

/** shot 1 — the plains under a huge moon; a far tall figure on the horizon. Slow push-in. */
export const S01: React.FC = () => {
  const { p, t, sec } = useShot();
  const tFar = wordAt(1, /^far/i, 0.6) / sec;
  const tBes = wordAt(1, /^beside/i, 0.85) / sec;
  const hh = handheld(t, 0.4);
  const cam: Cam = { zoom: 1 + 0.12 * EIO(p), dx: 0, dy: -30 * p, tx: hh.hx, ty: hh.hy, ox: 690, oy: 900 };
  const fig = ramp(p, tFar - 0.06, tFar + 0.06);
  const near = ramp(p, tBes - 0.05, tBes + 0.05);
  return (
    <AbsoluteFill style={{ backgroundColor: '#070a12' }}>
      <BandImg id="llanos/sky" k={0.2} cam={cam} />
      <BandImg id="llanos/far" k={0.5} cam={cam} />
      <Live k={0.5} cam={cam}>
        <g opacity={fig * (1 - near)}><Silbon x={MOON.x - 60} y={LL_HOR + 4} h={300} /></g>
      </Live>
      <Live k={0.8} cam={cam}>
        <SwayGrass seed={21} n={260} x0={-40} x1={W + 40} y0={LL_HOR + 160} y1={H} hmin={180} hmax={420} t={t} wind={0.6} fill="#1e271b" fill2="#4a5a48" />
      </Live>
      <Live k={1.1} cam={cam}>
        {/* "right beside you": a very long shadow falls across the near grass */}
        <g opacity={near}><Silbon x={1010 + 40 * (1 - near)} y={2500} h={2500} fill="#030404" /></g>
      </Live>
      <BandImg id="llanos/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 5 — the dark grass moving in the wind under the moon, nobody in sight. Very slow push. */
export const S05: React.FC = () => {
  const { p, t, sec } = useShot();
  const tW = wordAt(5, /^Whistling/i, 0.3) / sec;
  const gust = 0.5 + 0.7 * ramp(p, tW, tW + 0.15);
  const cam: Cam = { zoom: 1.18 + 0.06 * p, dx: 0, dy: 40, ox: 540, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#070a12' }}>
      <BandImg id="llanos/sky" k={0.2} cam={cam} />
      <BandImg id="llanos/far" k={0.5} cam={cam} />
      <Live k={0.7} cam={cam}>
        <SwayGrass seed={31} n={240} x0={-60} x1={W + 60} y0={LL_HOR + 140} y1={LL_HOR + 560} hmin={140} hmax={300} t={t * 1.2} wind={gust} fill="#25301f" fill2="#5d6e57" />
      </Live>
      <Live k={0.9} cam={cam}>
        <SwayGrass seed={32} n={220} x0={-60} x1={W + 60} y0={LL_HOR + 400} y1={H} hmin={300} hmax={620} t={t * 1.2 + 0.6} wind={gust} fill="#141b11" fill2="#3d4c38" />
      </Live>
      <BandImg id="llanos/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** irregular dusty cattle track: wobbly edges from the horizon to the bottom. */
const trackPath = (seed: number, widen: number) => {
  const r = rng(seed);
  const n = 16, y0 = LL_HOR + 26, y1 = H + 40;
  const L: string[] = [], R: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, y = y0 + (y1 - y0) * Math.pow(u, 1.6);
    const cx = 590 + 70 * Math.sin(u * 3.2) * u;
    const w = (14 + 330 * Math.pow(u, 1.3)) * widen;
    L.push(`${cx - w * (0.88 + r() * 0.24)} ${y}`);
    R.push(`${cx + w * (0.88 + r() * 0.24)} ${y}`);
  }
  return `M${L.join(' L')} L${R.reverse().join(' L')} Z`;
};

/** shot 11 — dawn mist, long thin barefoot giant footprints along a dusty cattle track. Slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.16 - 0.14 * EIO(p), dx: 0, dy: 0, ox: 560, oy: 1000 };
  const prints: React.ReactNode[] = [];
  const N = 5;
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    const z = 1 + i * 1.15, d = u;
    const y = LL_HOR + 290 / z;
    const s = 2.4 / z;
    const cx = 590 + 70 * Math.sin(Math.pow((y - LL_HOR - 26) / (H + 14 - LL_HOR), 1 / 1.6) * 3.2) * 0.3;
    const x = cx + (i % 2 ? 1 : -1) * 28 * s;
    prints.push(<Footprint key={i} x={x} y={y} s={s} rot={(i % 2 ? 5 : -5)} fill="#4a3a24" o={0.85 - 0.25 * d} />);
  }
  const tuft = (x: number, y: number, sc: number, k: number) => (
    <SwayGrass key={k} seed={60 + k} n={9} x0={x - 26 * sc} x1={x + 26 * sc} y0={y - 4} y1={y + 4} hmin={40 * sc} hmax={95 * sc} t={t} wind={0.25} fill="#3c4430" fill2="#56603f" />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#141a2a' }}>
      <BandImg id="llanos/dawn" k={0.2} cam={cam} />
      <BandImg id="llanos/far" k={0.5} cam={cam} style={{ opacity: 0.92 }} />
      <Live k={0.7} cam={cam}>
        <defs>
          <linearGradient id="dust" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a08a62" />
            <stop offset="0.45" stopColor="#7c6844" />
            <stop offset="1" stopColor="#3e3524" />
          </linearGradient>
          <radialGradient id="mist">
            <stop offset="0" stopColor="#e9dcc2" stopOpacity="0.55" />
            <stop offset="1" stopColor="#e9dcc2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={trackPath(5, 1.45)} fill="url(#dust)" opacity={0.35} />
        <path d={trackPath(6, 1.18)} fill="url(#dust)" opacity={0.5} />
        <path d={trackPath(7, 0.92)} fill="url(#dust)" opacity={0.85} />
        {tuft(470, 1620, 1.5, 1)}{tuft(760, 1540, 1.2, 2)}{tuft(520, 1330, 0.9, 3)}{tuft(690, 1260, 0.6, 4)}{tuft(640, 1900, 2, 5)}{tuft(380, 1820, 1.8, 6)}
        {prints}
        <SwayGrass seed={41} n={170} x0={-60} x1={400} y0={LL_HOR + 150} y1={H} hmin={180} hmax={420} t={t} wind={0.3} fill="#2a3324" fill2="#3a4434" />
        <SwayGrass seed={42} n={170} x0={840} x1={W + 60} y0={LL_HOR + 150} y1={H} hmin={180} hmax={420} t={t} wind={0.3} fill="#2a3324" fill2="#3a4434" />
        <ellipse cx={560 + 40 * Math.sin(t * 0.3)} cy={LL_HOR + 40} rx={760} ry={110} fill="url(#mist)" />
        <ellipse cx={640 - 30 * Math.sin(t * 0.25)} cy={LL_HOR + 170} rx={560} ry={80} fill="url(#mist)" opacity={0.75} />
        <ellipse cx={520 + 25 * Math.sin(t * 0.2)} cy={LL_HOR + 330} rx={500} ry={70} fill="url(#mist)" opacity={0.45} />
      </Live>
      <BandImg id="llanos/fg" k={1.3} cam={cam} style={{ opacity: 0.85 }} />
    </AbsoluteFill>
  );
};
