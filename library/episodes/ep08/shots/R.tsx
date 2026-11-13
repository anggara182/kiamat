import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, handheld, ramp, EIO, type Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { RV } from '../sets/river';
import { Llorona, Boy, RC } from '../art/river_figs';
import { W, H, rng } from '../art/world';

const BG: React.FC<{ cam: Cam; dim?: number }> = ({ cam, dim = 0 }) => (
  <>
    <AbsoluteFill style={{ backgroundColor: RC.skyTop }} />
    <BandImg id="river/sky" k={0.25} cam={cam} />
    <BandImg id="river/far" k={0.45} cam={cam} />
    <BandImg id="river/water" k={1} cam={cam} />
    {dim > 0 && <Live k={0} cam={cam}><rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#03081a" opacity={dim} /></Live>}
  </>
);

/** live moon glints on the water: short dashes that shimmer along the reflection column */
const Glints: React.FC<{ t: number; n?: number; o?: number }> = ({ t, n = 46, o = 1 }) => {
  const r = rng(77);
  const items = Array.from({ length: n }, (_, i) => {
    const d = r();
    const y = RV.horizon + 8 + d * d * (RV.edge - RV.horizon - 20);
    const spread = 30 + (y - RV.horizon) * 0.32;
    const x = RV.moon.x + (r() - 0.5) * 2 * spread + Math.sin(t * 0.9 + i) * 6;
    const w = 6 + (y - RV.horizon) * 0.07 * (0.5 + r());
    const a = 0.5 + 0.5 * Math.sin(t * (1.5 + r() * 2.5) + r() * 6.28);
    return <rect key={i} x={x - w / 2} y={y} width={w} height={1.6 + (y - RV.horizon) * 0.006} rx={1} fill={RC.glint} opacity={a * a * 0.9 * o} />;
  });
  return <g>{items}</g>;
};

/** soft drifting mist bank (live, cheap: two gradient ellipses) */
const Mist: React.FC<{ t: number; y: number; o?: number }> = ({ t, y, o = 1 }) => (
  <g>
    <defs>
      <radialGradient id="rm-m"><stop offset="0" stopColor={RC.mist} stopOpacity={0.22 * o} /><stop offset="1" stopColor={RC.mist} stopOpacity={0} /></radialGradient>
    </defs>
    <ellipse cx={300 + t * 14} cy={y} rx={520} ry={46} fill="url(#rm-m)" />
    <ellipse cx={1000 - t * 10} cy={y + 30} rx={460} ry={40} fill="url(#rm-m)" />
  </g>
);

/** shot 1 — wide riverbank, tiny white figure against the moon's reflection. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.12 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 760, oy: 1200 };
  return (
    <AbsoluteFill>
      <BG cam={cam} />
      <Live cam={cam}>
        <Glints t={t} />
        <Llorona id="l1" x={868} y={RV.edge + 2} s={0.5} />
        <Mist t={t} y={RV.edge - 30} />
      </Live>
      <BandImg id="river/fg" k={1.35} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 4 — boy with rod + flashlight walking through the reeds, tracked from behind. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.28, dx: -60 + 120 * p, dy: -40, ox: 540, oy: 1100 };
  const fgCam: Cam = { zoom: 1.5, dx: 260 - 520 * p, dy: 60, ox: 540, oy: 1500 };
  return (
    <AbsoluteFill>
      <BG cam={cam} />
      <Live cam={cam}><Glints t={t} /><Mist t={t} y={RV.edge - 40} /></Live>
      <Live k={0} cam={cam}>
        <Boy id="b4" x={108 + 520} y={192 + 1360} s={3.2} phase={t * 6.5} aim={8 + Math.sin(t * 1.3) * 6} beamLen={260} />
      </Live>
      <BandImg id="river/fg" k={1} cam={fgCam} />
    </AbsoluteFill>
  );
};

/** shot 5 — wide: the woman kneeling at the edge, boy small in the foreground reeds. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.2 + 0.12 * ramp(p, 0, 1, EIO), dx: -60, dy: -20, ox: 760, oy: 1200 };
  return (
    <AbsoluteFill>
      <BG cam={cam} />
      <Live cam={cam}>
        <Glints t={t} />
        <Llorona id="l5" x={880} y={RV.edge + 2} s={1.25} />
        <Mist t={t} y={RV.edge - 20} />
      </Live>
      <BandImg id="river/fg" k={1.25} cam={cam} />
      <Live k={0} cam={cam}>
        <Boy id="b5" x={108 + 260} y={192 + 1360} s={1.7} phase={0.3} aim={40} beamLen={0} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 8 — flashlight beam lands on her; on "stopped" her head starts to turn. Silence beat. */
export const S08: React.FC = () => {
  const { p, t, dur, fps } = useShot();
  const tt = wordAt(8, /stopped/i, 0.7) / (dur / fps);
  const turn = ramp(p, tt, Math.min(1, tt + 0.25), EIO);
  const cam: Cam = { zoom: 1.85 + 0.15 * p, dx: 0, dy: 0, ox: 620, oy: 1150 };
  // her frame position (feet) and body centre, for the beam target
  const z = cam.zoom, fx = 620 + (880 - 108 - 620) * z, fy = 1150 + (RV.edge - 192 - 1150) * z;
  const tx = fx + Math.sin(t * 2.2) * 6, ty = fy - 55 * 1.9 * z + Math.sin(t * 1.7) * 5;
  // boy: small, fg left, feet above the caption zone (frame y 1360)
  const bs = 2.7, bx = 190, by = 1360;
  const sx = bx + 20.5 * bs, sy = by - 88 * bs; // flashlight lens (frame px)
  const dx = tx - sx, dy = ty - sy, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const wEnd = 175, ex = sx + dx * 1.15, ey = sy + dy * 1.15;
  const O = (x: number, y: number) => `${x + 108},${y + 192}`;
  return (
    <AbsoluteFill>
      <BG cam={cam} />
      <Live cam={cam}>
        <Glints t={t} o={0.7} />
        <Llorona id="l8" x={880} y={RV.edge + 2} s={1.9} turn={turn} />
      </Live>
      <Live k={0} cam={{ zoom: 1, dx: 0, dy: 0 }}>
        <defs>
          <linearGradient id="r8-beam" gradientUnits="userSpaceOnUse" x1={sx + 108} y1={sy + 192} x2={ex + 108} y2={ey + 192}>
            <stop offset="0" stopColor="#fff3d2" stopOpacity={0.5} /><stop offset="0.75" stopColor="#ffe6b0" stopOpacity={0.2} /><stop offset="1" stopColor="#ffe6b0" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="r8-pool"><stop offset="0" stopColor="#fff0cc" stopOpacity={0.42} /><stop offset="0.6" stopColor="#ffe3a8" stopOpacity={0.14} /><stop offset="1" stopColor="#ffe3a8" stopOpacity={0} /></radialGradient>
        </defs>
        <path d={`M${O(sx + nx * 4, sy + ny * 4)} L${O(ex + nx * wEnd, ey + ny * wEnd)} L${O(ex - nx * wEnd, ey - ny * wEnd)} L${O(sx - nx * 4, sy - ny * 4)}Z`} fill="url(#r8-beam)" />
        <ellipse cx={tx + 108} cy={ty + 192 + 110} rx={170} ry={120} fill="url(#r8-pool)" />
        <circle cx={sx + 108} cy={sy + 192} r={22} fill="url(#r8-pool)" />
        <Boy id="b8" x={bx + 108} y={by + 192} s={bs} phase={0.2} aim={0} beamLen={0} rod />
      </Live>
      <Live k={0} cam={{ zoom: 1, dx: 0, dy: 0 }}>
        {[[40, 1560, 330, -20], [80, 1580, 260, 18], [120, 1600, 380, -8], [980, 1560, 360, 14], [1040, 1600, 300, -16], [1110, 1580, 420, 6], [1160, 1620, 340, -10]].map(([x, b, h, l], i) => (
          <path key={i} d={`M${x + 108 - 6},${b + 192} Q${x + 108 + l * 0.4},${b + 192 - h * 0.6} ${x + 108 + l},${b + 192 - h} Q${x + 108 + l * 0.4 + 2},${b + 192 - h * 0.6} ${x + 108 + 6},${b + 192}Z`} fill={RC.near} />
        ))}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — handheld: the boy runs up the bank, beam swinging; behind him she stands up. */
export const S09: React.FC = () => {
  const { p, t, dur, fps } = useShot();
  const h = handheld(t * 1.6, 2.6);
  const ts = wordAt(9, /ran/i, 0.45) / (dur / fps);
  const st = ramp(p, ts - 0.12, ts + 0.12, EIO);
  const cam: Cam = { zoom: 1.12 + 0.06 * p, dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr, ox: 600, oy: 1150 };
  const by = 192 + 1300 + 60 * ramp(p, 0, 1);
  return (
    <AbsoluteFill>
      <BG cam={cam} />
      <Live cam={cam}>
        <Glints t={t} />
        {st > 0 ? (
          <g transform={`translate(0,${RV.edge}) scale(1,${0.62 + 0.38 * st}) translate(0,${-RV.edge})`}><Llorona id="l9" x={880} y={RV.edge + 2} s={1.15} stand={1} /></g>
        ) : (
          <Llorona id="l9k" x={880} y={RV.edge + 2} s={1.15} />
        )}
        <Mist t={t} y={RV.edge - 20} />
      </Live>
      <BandImg id="river/fg" k={1.3} cam={cam} />
      <Live k={0} cam={{ zoom: 1, dx: 0, dy: 0, tx: h.hx * 1.5, ty: h.hy * 1.5 }}>
        <Boy id="b9" x={108 + 430 + 80 * p} y={by} s={2.5 + 0.4 * p} phase={t * 13} run={1} rod={false} aim={170 + Math.sin(t * 9) * 55} beamLen={220} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 12 — the kneeling figure again, closer, darker and colder. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.45 + 0.15 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 700, oy: 1180 };
  return (
    <AbsoluteFill>
      <BG cam={cam} dim={0.38} />
      <Live cam={cam}>
        <Glints t={t} n={30} o={0.6} />
        <Llorona id="l12" x={860} y={RV.edge + 2} s={1.9} cold />
        <Mist t={t} y={RV.edge - 30} o={1.3} />
      </Live>
      <BandImg id="river/fg" k={1.2} cam={cam} />
    </AbsoluteFill>
  );
};
