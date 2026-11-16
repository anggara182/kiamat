import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { M, mp, Glow, WhiteCrowd, S as SAND, sp, Drift, Helmet, Grains, Canteen, HoodHand } from '../art/refuge_art';
import { BackWalker, DepthWalker } from '../art/refuge_people';

/* EP08 refuge. The Sacred House is never drawn; the awaited man is always a tiny faceless figure.
 * Clocks: camera + environment (glow, dust, grains, canteen) ON ONES (p/t); people ON TWOS (p2/t2). */

/** shot 7 — night: a vast sea of white-clad pilgrims from behind flows toward the great glow beyond tall minarets; a tiny figure merges in; the glow swells on "Mecca". Slow crane down. */
export const S07: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tM = wordAt(7, /^mecca/i, 0.84);
  const cam: Cam = { zoom: 1.0 + 0.12 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: 240 - 300 * ramp(p, 0, 1, EIO), ox: 540, oy: 1100 };
  const k = ramp(t, tM - 0.3, tM + 0.9, EIO);
  // the man: tiny, from behind, plain clothes, walking forward into the crowd (merges by the end)
  const z = 26 + 10 * clamp01(t2 / 4.5);
  const [mx, my] = mp(0.6, 0, z);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1426' }}>
      <BandImg id="refuge/mecca-night" cam={cam} />
      <Live cam={cam}>
        <Glow k={k} mood="night" />
        <WhiteCrowd t2={t2} mood="night" z0={8} z1={240} />
        {[[180, 1950, 760, 0], [470, 2050, 840, 1.3], [820, 1990, 800, 2.6], [1110, 2080, 880, 3.4]].map(([x, y, h, ph], i) => <BackWalker key={i} x={x} y={y - 30 * t2} h={h} ph={t2 * 6 + ph} col="#e9edf4" shirt={i % 2 ? '#dfe4ee' : '#f4f1ea'} hat={i === 2 ? 'hijab' : null} opacity={0.97} />)}
        <BackWalker x={mx} y={my} h={(1.75 * M.f) / z} ph={t2 * 6} col="#5a5048" shirt="#b8a88a" opacity={1 - 0.5 * clamp01((t2 - 3) / 1.5)} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 11 — macro: a soldier's hand on the hot truck hood; sand grains dance, the canteen rattles; sand jumps on "tremble"; the hand lifts. */
export const S11: React.FC = () => {
  const { t, t2 } = useShot();
  const tT = wordAt(11, /^tremble/i, 0.62);
  const k = ramp(t, 0.15, tT, (n) => n * n);
  const jump = t >= tT ? Math.exp(-(t - tT) * 3) : 0;
  const shake = (t >= tT ? 6 * Math.exp(-(t - tT) * 2) : 1.5 * k) * Math.sin(t * 61);
  const cam: Cam = { zoom: 1.04, dx: 0, dy: 0, tx: shake, ty: shake * 0.6, ox: 540, oy: 1100 };
  const lift = ramp(t2, tT + 0.05, tT + 0.45, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6d8b8' }}>
      <BandImg id="refuge/hood" cam={cam} />
      <Live cam={cam}>
        <Grains t={t} k={k} jump={jump} />
        <Canteen x={1000} y={1150} s={1.3} rot={Math.sin(t * 47) * (2 + 6 * k) + 10 * jump * Math.sin(t * 30)} hop={Math.abs(Math.sin(t * 38)) * (3 * k + 30 * jump)} />
        <HoodHand x={500} y={1440} lift={lift} trem={Math.sin(t2 * 40) * (1 + 3 * k)} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 13 — dawn, low: flat sand; tire tracks run toward the horizon and simply END; wind lifts dust; a half-buried helmet; push-in reaching the end on "nowhere". */
export const S13: React.FC = () => {
  const { t } = useShot();
  const tN = wordAt(13, /^nowhere/i, 0.81);
  const [ex, ey] = sp(0, SAND.endZ);
  const u = ramp(t, 0, tN, EIO);
  const cam: Cam = { zoom: 1 + 0.9 * u, dx: 0, dy: 0, ox: ex - 108, oy: ey - 192 };
  const [hx, hy] = sp(2.6, 34);
  return (
    <AbsoluteFill style={{ backgroundColor: '#c99a84' }}>
      <BandImg id="refuge/sand" cam={cam} />
      <Live cam={cam}>
        <Helmet x={hx} y={hy} s={0.32} />
        <Drift t={t} y0={SAND.YH + 10} h={500} />
        <Drift t={t * 1.3 + 4} y0={SAND.YH + 200} h={900} col="#e8cfb0" />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 14 — dawn: the white-clad crowd from behind, thousands of hands reaching toward a tiny faceless figure on a low step before the glow; hands rise on "run". Slow push-in. */
export const S14: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tH = wordAt(14, /^hands/i, 0.47), tR = wordAt(14, /^run/i, 0.85);
  const cam: Cam = { zoom: 1.02 + 0.12 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: 60, ox: 540, oy: 900 };
  const arms = 0.25 + 0.35 * ramp(t2, tH - 0.1, tH + 0.4, EOUT) + 0.4 * ramp(t2, tR - 0.06, tR + 0.25, EOUT);
  const [fx, fy] = mp(0, 0.6, 60);
  return (
    <AbsoluteFill style={{ backgroundColor: '#7a8aa8' }}>
      <BandImg id="refuge/mecca-dawn" cam={cam} />
      <Live cam={cam}>
        <Glow k={0.6 + 0.3 * Math.sin(t * 0.8)} mood="dawn" />
        {/* the low step and the tiny faceless figure, a dark silhouette against the glow */}
        <rect x={fx - 70} y={fy} width={140} height={14} fill="#e9eef4" />
        <DepthWalker x={fx} y={fy} h={46} ph={0} col="#2a2a30" />
        <WhiteCrowd t2={t2 * 0.4} mood="dawn" arms={arms} z0={6} z1={58} />
        {[[200, 2140, 820], [520, 2200, 900], [860, 2150, 860], [1150, 2220, 920]].map(([x, y, h], i) => (
          <g key={i}>
            <BackWalker x={x} y={y} h={h} ph={0} col="#e9edf4" shirt="#f4f1ea" point={clamp01(arms * 1.1 - 0.1 + 0.05 * Math.sin(t2 * 3 + i))} hat={i === 1 ? 'hijab' : null} />
            <g transform={`translate(${x} 0) scale(-1 1) translate(${-x} 0)`}><BackWalker x={x} y={y} h={h} ph={0} col="#e9edf4" shirt="#f4f1ea" point={clamp01(arms * 1.1 - 0.25)} hat={i === 1 ? 'hijab' : null} /></g>
          </g>
        ))}
      </Live>
    </AbsoluteFill>
  );
};
