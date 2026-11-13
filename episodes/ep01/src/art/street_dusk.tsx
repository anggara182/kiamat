import React from 'react';
import { W, H, rng } from './world';
import { mix } from './street_day';

/* ------------------------------------------------------------------------------------------
 * Shot 6: time-lapse from a pedestrian overpass (camera 4.5 m up, level) down a boulevard.
 * A double-arm lamp post on the median; the sun drops from above the frame into the gap
 * between two towers and its long shadow sweeps across the asphalt. Lamp switches on at "night".
 * Band "street/dusk" = ground, buildings, towers, lamp posts (sky left transparent: the sky
 * and the sun are live behind it, the shadow and the light live in front).
 * ---------------------------------------------------------------------------------------- */
export const K = { f: 1000, hc: 4.5, YH: 900, VX: 648 };
export const kp = (X: number, Y: number, Z: number): [number, number] => [K.VX + (K.f * X) / Z, K.YH + (K.f * (K.hc - Y)) / Z];
const P = (X: number, Y: number, Z: number) => kp(X, Y, Z).map((v) => v.toFixed(1)).join(',');
export const LAMP = { X: -1.8, Z: 14, h: 7.0, armH: 7.6, arm: 1.9, r0: 0.15, r1: 0.08 };
const SKYLINE_Y = 858; // top of the far low skyline in the gap: the sun sets behind it

/** sun direction from shot progress u (0..1 = until it sets) */
export const sunAt = (u: number) => {
  const e = 1 - Math.pow(1 - u, 2.2); // azimuth swings early
  const az = ((24 - 34 * e) * Math.PI) / 180;
  const el = ((48 * Math.pow(1 - u, 1.35) + 1.2) * Math.PI) / 180;
  const d = { x: Math.cos(el) * Math.sin(az), y: Math.sin(el), z: Math.cos(el) * Math.cos(az) };
  return { az, el, d, sx: K.VX + K.f * Math.tan(az), sy: K.YH - (K.f * Math.tan(el)) / Math.cos(az) };
};

const PAL = {
  far: '#6e4a66', far2: '#57405e', tower: '#2b2344', tower2: '#3a2d50', near: '#1a1530', facadeL: '#4a3150', facadeR: '#2a2140',
  road: '#5b4a5c', road2: '#3a3046', walk: '#6a5463', curb: '#8a6d6e', median: '#2e2a38', tree: '#1f1a33', rim: '#ffc28a',
};

const lampPost = (X: number, Z: number, key: string, rim = true) => {
  const L = LAMP;
  const [bx, by] = kp(X, 0, Z), s = K.f / Z;
  const [, yj] = kp(X, L.h, Z), [, ya] = kp(X, L.armH, Z);
  const [lx] = kp(X - L.arm, 0, Z), [rx] = kp(X + L.arm, 0, Z);
  const w0 = L.r0 * s, w1 = L.r1 * s;
  return (
    <g key={key}>
      {/* plinth + pole tapering up */}
      <rect x={bx - 0.32 * s} y={by - 0.9 * s} width={0.64 * s} height={0.9 * s} fill={PAL.near} />
      <polygon points={`${bx - w0},${by - 0.9 * s} ${bx + w0},${by - 0.9 * s} ${bx + w1},${yj} ${bx - w1},${yj}`} fill={PAL.near} />
      <rect x={bx - w0 * 1.25} y={by - 2.6 * s} width={w0 * 2.5} height={0.12 * s} fill={PAL.near} />
      {/* double arm sweeping up and out over both carriageways */}
      <path d={`M ${bx} ${yj} Q ${bx - 0.2 * s} ${ya - 0.1 * s} ${lx + 0.2 * s} ${ya} M ${bx} ${yj} Q ${bx + 0.2 * s} ${ya - 0.1 * s} ${rx - 0.2 * s} ${ya}`} stroke={PAL.near} strokeWidth={0.1 * s} fill="none" strokeLinecap="round" />
      <path d={`M ${bx} ${yj + 0.4 * s} Q ${bx - 0.3 * s} ${ya + 0.25 * s} ${bx - 0.9 * s} ${ya + 0.05 * s} M ${bx} ${yj + 0.4 * s} Q ${bx + 0.3 * s} ${ya + 0.25 * s} ${bx + 0.9 * s} ${ya + 0.05 * s}`} stroke={PAL.near} strokeWidth={0.05 * s} fill="none" />
      {/* cobra-head lanterns */}
      <path d={`M ${lx - 0.45 * s} ${ya + 0.02 * s} Q ${lx - 0.1 * s} ${ya - 0.2 * s} ${lx + 0.35 * s} ${ya - 0.02 * s} L ${lx + 0.3 * s} ${ya + 0.1 * s} Q ${lx - 0.1 * s} ${ya + 0.2 * s} ${lx - 0.45 * s} ${ya + 0.02 * s} Z`} fill={PAL.near} />
      <path d={`M ${rx + 0.45 * s} ${ya + 0.02 * s} Q ${rx + 0.1 * s} ${ya - 0.2 * s} ${rx - 0.35 * s} ${ya - 0.02 * s} L ${rx - 0.3 * s} ${ya + 0.1 * s} Q ${rx + 0.1 * s} ${ya + 0.2 * s} ${rx + 0.45 * s} ${ya + 0.02 * s} Z`} fill={PAL.near} />
      {rim && <polygon points={`${bx + w0 - 1.5},${by - 0.9 * s} ${bx + w0},${by - 0.9 * s} ${bx + w1},${yj} ${bx + w1 - 1.2},${yj}`} fill={PAL.rim} opacity={0.6} />}
    </g>
  );
};

export const DuskBand: React.FC = () => {
  const r = rng(61);
  const far: React.ReactNode[] = [];
  // far low skyline at the end of the boulevard (lighter with distance)
  let x = -20;
  while (x < W + 20) {
    const w = 30 + r() * 70, h = 14 + r() * 40;
    far.push(<rect key={`f${x}`} x={x} y={SKYLINE_Y + 20 - h} width={w} height={h + 60} fill={PAL.far} />);
    x += w - 4;
  }
  far.push(<rect key="fgap" x={380} y={SKYLINE_Y} width={240} height={80} fill={PAL.far} />);
  // towers: two flank the sunset gap (x ~395..605), others around
  const tower = (x0: number, w: number, top: number, col: string, lit: string, key: string, crown = 0) => (
    <g key={key}>
      <rect x={x0} y={top} width={w} height={SKYLINE_Y + 40 - top} fill={col} />
      <rect x={x0 + w * 0.72} y={top} width={w * 0.28} height={SKYLINE_Y + 40 - top} fill={lit} />
      {crown > 0 && <rect x={x0 + w * 0.3} y={top - crown} width={w * 0.4} height={crown} fill={col} />}
      {crown > 0 && <rect x={x0 + w * 0.48} y={top - crown - 50} width={3} height={50} fill={col} />}
    </g>
  );
  const towers = [
    tower(40, 92, 610, PAL.far2, '#5e4562', 't1'),
    tower(250, 140, 440, PAL.tower2, '#4c3858', 't2', 26),
    tower(610, 118, 500, PAL.tower2, '#4c3858', 't3'),
    tower(760, 80, 640, PAL.far2, '#5e4562', 't4'),
    tower(880, 150, 390, PAL.tower, '#3e2f52', 't5', 18),
    tower(1100, 120, 560, PAL.tower2, '#4c3858', 't6'),
  ];
  // flanking buildings: shophouse rows in perspective
  const rows: React.ReactNode[] = [];
  const row = (side: number, seed: number) => {
    const rr = rng(seed);
    let z = 9;
    let i = 0;
    while (z < 260) {
      const len = 8 + rr() * 10, hgt = 9 + rr() * 8, x0 = side < 0 ? -10 : 8, xb = side < 0 ? -22 : 20;
      const z1 = z + len;
      const face = side < 0 ? PAL.facadeL : PAL.facadeR;
      rows.push(
        <g key={`${side}${i}`}>
          <polygon points={`${P(x0, 0, z)} ${P(x0, hgt, z)} ${P(x0, hgt, z1)} ${P(x0, 0, z1)}`} fill={mix(face, PAL.far, Math.min(1, z / 260))} />
          <polygon points={`${P(x0, 0, z)} ${P(x0, hgt, z)} ${P(xb, hgt, z)} ${P(xb, 0, z)}`} fill={mix(PAL.near, PAL.far, Math.min(1, z / 300))} />
          {/* blank signboard band + dark shop opening */}
          <polygon points={`${P(x0, 3.4, z + 0.5)} ${P(x0, 4.4, z + 0.5)} ${P(x0, 4.4, z1 - 0.5)} ${P(x0, 3.4, z1 - 0.5)}`} fill={mix('#6d4a5c', PAL.far, Math.min(1, z / 260))} />
          <polygon points={`${P(x0, 0, z + 0.8)} ${P(x0, 3.0, z + 0.8)} ${P(x0, 3.0, z1 - 0.8)} ${P(x0, 0, z1 - 0.8)}`} fill={mix('#1c1626', PAL.far, Math.min(1, z / 260))} />
        </g>,
      );
      if (i % 2 === 0) {
        const tx = side < 0 ? -8.4 : 6.6, [cx, cy] = kp(tx, 0, z + 2), s = K.f / (z + 2);
        rows.push(
          <g key={`tr${side}${i}`} fill={mix(PAL.tree, PAL.far, Math.min(1, z / 260))}>
            <rect x={cx - 0.13 * s} y={cy - 3.2 * s} width={0.26 * s} height={3.2 * s} />
            <ellipse cx={cx} cy={cy - 4.6 * s} rx={2.1 * s} ry={1.7 * s} />
            <ellipse cx={cx - side * 1.2 * s} cy={cy - 3.9 * s} rx={1.4 * s} ry={1.1 * s} />
          </g>,
        );
      }
      z = z1 + 0.6;
      i++;
    }
  };
  row(-1, 63);
  row(1, 67);
  rows.reverse();
  const MX0 = LAMP.X - 0.45, MX1 = LAMP.X + 0.45;
  const dash = (X: number, key: string) => {
    const out: React.ReactNode[] = [];
    for (let z = 4; z < 220; z += 9) out.push(<polygon key={`${key}${z}`} points={`${P(X - 0.07, 0, z)} ${P(X + 0.07, 0, z)} ${P(X + 0.07, 0, z + 3)} ${P(X - 0.07, 0, z + 3)}`} fill="#b48f84" opacity={0.75} />);
    return out;
  };
  return (
    <g>
      <defs>
        <linearGradient id="stkRoad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8706e" /><stop offset="0.06" stopColor={PAL.road} /><stop offset="1" stopColor={PAL.road2} />
        </linearGradient>
      </defs>
      {far}
      {towers}
      {/* ground */}
      <rect x={0} y={K.YH - 2} width={W} height={H - K.YH + 2} fill="url(#stkRoad)" />
      {/* sidewalks */}
      <polygon points={`${P(-8.6, 0, 2)} ${P(-8.6, 0, 400)} ${P(-40, 0, 400)} ${P(-40, 0, 2)}`} fill={PAL.walk} />
      <polygon points={`${P(6.4, 0, 2)} ${P(6.4, 0, 400)} ${P(40, 0, 400)} ${P(40, 0, 2)}`} fill={mix(PAL.walk, PAL.near, 0.35)} />
      <polygon points={`${P(-8.6, 0, 2)} ${P(-8.6, 0, 400)} ${P(-8.4, 0, 400)} ${P(-8.4, 0, 2)}`} fill={PAL.curb} />
      <polygon points={`${P(6.4, 0, 2)} ${P(6.4, 0, 400)} ${P(6.2, 0, 400)} ${P(6.2, 0, 2)}`} fill={PAL.curb} />
      {/* median strip with curb */}
      <polygon points={`${P(MX0, 0, 2)} ${P(MX0, 0, 400)} ${P(MX1, 0, 400)} ${P(MX1, 0, 2)}`} fill={PAL.median} />
      <polygon points={`${P(MX0, 0, 2)} ${P(MX0, 0.25, 2)} ${P(MX0, 0.25, 400)} ${P(MX0, 0, 400)}`} fill={PAL.curb} />
      <polygon points={`${P(MX1, 0.25, 2)} ${P(MX1, 0.25, 400)} ${P(MX0, 0.25, 400)} ${P(MX0, 0.25, 2)}`} fill="#3a3344" />
      {dash(-5.3, 'l')}{dash(2.3, 'r')}
      {rows}
      {/* receding median lamp posts, then the hero lamp post */}
      {[119, 84, 49].map((z) => lampPost(LAMP.X, z, `lp${z}`, false))}
      {lampPost(LAMP.X, LAMP.Z, 'hero')}
    </g>
  );
};

/* -------------------------------------- live layers -------------------------------------- */
const lerpC = (a: string[], b: string[], t: number) => a.map((c, i) => mix(c, b[i], t));
const SKY_A = ['#7e5a78', '#d98f6e', '#f2b47c', '#f8d9a0'];
const SKY_B = ['#2a2348', '#6a3f63', '#d9785f', '#f0b27a'];
const SKY_C = ['#0e1024', '#1f1d3d', '#5a3558', '#a85a5a'];

/** sky (behind the band): gradient keyed to time, sun disc + glow */
export const DuskSky: React.FC<{ u: number; night: number }> = ({ u, night }) => {
  const s = sunAt(Math.min(1, u));
  const cols = night > 0 ? lerpC(SKY_B, SKY_C, night) : lerpC(SKY_A, SKY_B, Math.pow(u, 1.3));
  const set = Math.min(1, Math.max(0, (s.sy - (SKYLINE_Y - 40)) / 60)); // sun sinking behind the skyline
  const sunCol = mix('#fff6dc', '#ffb36b', Math.pow(u, 1.5));
  return (
    <g>
      <defs>
        <linearGradient id="stkSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cols[0]} /><stop offset="0.25" stopColor={cols[1]} /><stop offset="0.36" stopColor={cols[2]} /><stop offset="0.39" stopColor={cols[3]} />
        </linearGradient>
        <radialGradient id="stkSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={sunCol} stopOpacity={1} /><stop offset="0.15" stopColor={sunCol} stopOpacity={0.7} /><stop offset="0.5" stopColor="#ffb878" stopOpacity={0.25} /><stop offset="1" stopColor="#ff9a6a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#stkSky)" />
      <g opacity={1 - night * 0.9}>
        <circle cx={s.sx} cy={s.sy} r={520} fill="url(#stkSun)" opacity={0.85} />
        <circle cx={s.sx} cy={s.sy} r={40} fill="#fff7e2" opacity={1 - set * 0.2} />
      </g>
      {/* afterglow on the horizon once the sun is gone */}
      <ellipse cx={470} cy={SKYLINE_Y + 10} rx={520} ry={120} fill="#ffb070" opacity={0.35 * (1 - night) * Math.min(1, u * 1.2)} />
    </g>
  );
};

/** the lamp post's (and the receding posts') shadow on the asphalt for sun progress u. o = opacity. */
export const LampShadows: React.FC<{ u: number; o: number }> = ({ u, o }) => {
  if (o <= 0.001) return null;
  const { d } = sunAt(u);
  const kx = d.x / d.y, kz = d.z / d.y;
  const ZC = 2.2; // clip near plane on the ground (well below the frame)
  const gnd = (X: number, Y: number, Z: number): [number, number] => [X - kx * Y, Z - kz * Y];
  /** shadow of a vertical-ish segment from ground point (X,Z) up to height h, width w0->w1 metres */
  const seg = (ax: number, az: number, bx: number, bz: number, w0: number, w1: number) => {
    // clip b toward a if behind the near plane
    if (bz < ZC) { const t = (az - ZC) / (az - bz); bx = ax + (bx - ax) * t; w1 = w0 + (w1 - w0) * t; bz = ZC; }
    const dx = bx - ax, dz = bz - az, n = Math.hypot(dx, dz) || 1, nx = -dz / n, nz = dx / n;
    return `${P(ax + nx * w0, 0, az + nz * w0)} ${P(bx + nx * w1, 0, bz + nz * w1)} ${P(bx - nx * w1, 0, bz - nz * w1)} ${P(ax - nx * w0, 0, az - nz * w0)}`;
  };
  const posts = [LAMP.Z, 49, 84, 119];
  const L = LAMP;
  return (
    <g fill="#140f26" opacity={o}>
      {posts.map((Z) => {
        const top = gnd(L.X, L.h, Z), la = gnd(L.X - L.arm, L.armH, Z), ra = gnd(L.X + L.arm, L.armH, Z);
        const tipFar = top[1] < ZC;
        return (
          <g key={Z}>
            <polygon points={seg(L.X, Z, top[0], top[1], L.r0 + 0.06, L.r1 + 0.22)} />
            {!tipFar && la[1] > ZC && <polygon points={seg(top[0], top[1], la[0], la[1], 0.1, 0.14)} />}
            {!tipFar && ra[1] > ZC && <polygon points={seg(top[0], top[1], ra[0], ra[1], 0.1, 0.14)} />}
          </g>
        );
      })}
    </g>
  );
};

/** warm low-sun sheen on the asphalt under the sun, darkening of the ground as dusk falls */
export const DuskGround: React.FC<{ u: number; dark: number }> = ({ u, dark }) => {
  const s = sunAt(Math.min(1, u));
  const sheen = Math.max(0, 1 - Math.abs(s.sx - 520) / 700) * Math.min(1, u * 1.6) * (1 - dark);
  return (
    <g>
      <defs>
        <radialGradient id="stkSheen" cx="0.5" cy="0" r="1"><stop offset="0" stopColor="#ffc28a" stopOpacity={0.7} /><stop offset="0.5" stopColor="#ffa070" stopOpacity={0.2} /><stop offset="1" stopColor="#ff9a6a" stopOpacity={0} /></radialGradient>
      </defs>
      <ellipse cx={s.sx} cy={K.YH + 10} rx={210} ry={760} fill="url(#stkSheen)" opacity={0.55 * sheen} />
      <rect x={0} y={K.YH - 46} width={W} height={H - K.YH + 46} fill="#120d24" opacity={0.55 * dark} />
    </g>
  );
};

/** lamp light: bulbs, cones, pools. on = 0..1 */
export const LampLight: React.FC<{ on: number }> = ({ on }) => {
  if (on <= 0.001) return null;
  const L = LAMP, heads = [L.X - L.arm + 0.05, L.X + L.arm - 0.05];
  return (
    <g opacity={on}>
      <defs>
        <radialGradient id="stkBulb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff3c8" stopOpacity={1} /><stop offset="0.2" stopColor="#ffd27a" stopOpacity={0.55} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient>
        <radialGradient id="stkPool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.55} /><stop offset="0.55" stopColor="#ffb347" stopOpacity={0.18} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient>
        <linearGradient id="stkCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.3} /><stop offset="1" stopColor="#ffb347" stopOpacity={0.03} /></linearGradient>
      </defs>
      {[119, 84, 49, L.Z].map((Z) => heads.map((X, i) => {
        const [hx, hy] = kp(X, L.armH - 0.12, Z), s = K.f / Z;
        const [gx, gy] = kp(X, 0, Z);
        return (
          <g key={`${Z}${i}`}>
            <polygon points={`${hx - 0.3 * s},${hy} ${hx + 0.3 * s},${hy} ${gx + 3.4 * s},${gy} ${gx - 3.4 * s},${gy}`} fill="url(#stkCone)" />
            <ellipse cx={gx} cy={gy} rx={4.6 * s} ry={1.5 * s * (K.hc / Z) * 6} fill="url(#stkPool)" />
            <ellipse cx={hx} cy={hy} rx={1.5 * s} ry={1.5 * s} fill="url(#stkBulb)" />
            <ellipse cx={hx} cy={hy + 0.02 * s} rx={0.3 * s} ry={0.07 * s} fill="#fff3c8" />
          </g>
        );
      }))}
    </g>
  );
};

/** time-lapse traffic trails once the light goes (red tail-lights away on the left, white heads toward on the right) */
export const Trails: React.FC<{ o: number; t: number }> = ({ o, t }) => {
  if (o <= 0.001) return null;
  const lanes = [{ X: -6.6, c: '#ff4a3a' }, { X: -4.0, c: '#ff6a4a' }, { X: 0.4, c: '#fff1d0' }, { X: 3.6, c: '#ffe2b0' }];
  const strip = (X: number, z0: number, z1: number, w: number) => `${P(X - w, 0.7, z0)} ${P(X + w, 0.7, z0)} ${P(X + w, 0.7, z1)} ${P(X - w, 0.7, z1)}`;
  return (
    <g opacity={o}>
      {lanes.map((l, i) => {
        const segs: React.ReactNode[] = [];
        for (let k = 0; k < 6; k++) {
          const ph = (((t * 0.9 + k / 6 + i * 0.13) % 1) + 1) % 1;
          const z0 = 3 + ph * 40, z1 = z0 + 18 + ph * 60;
          segs.push(<polygon key={k} points={strip(l.X, z0, z1, 0.07)} fill={l.c} opacity={0.75} />);
        }
        return <g key={i}>{segs}</g>;
      })}
    </g>
  );
};

/** foreground: the overpass handrail, dark and cool */
export const Railing: React.FC = () => (
  <g fill="#120e22">
    <rect x={0} y={1868} width={W} height={20} />
    <rect x={0} y={1990} width={W} height={12} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={20 + i * 118} y={1868} width={14} height={H - 1868} />)}
    <rect x={0} y={1866} width={W} height={3} fill="#ffc28a" opacity={0.18} />
  </g>
);
