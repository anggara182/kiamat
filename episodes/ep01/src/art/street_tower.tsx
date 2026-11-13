import React from 'react';
import { W } from './world';

/* ------------------------------------------------------------------------------------------
 * Shot 3a: low angle up an unfinished tower with a crane, harsh pale sky.
 * Tall band (TW.w x TW.h); a pitched-up telephoto camera gives gentle three-point convergence.
 * The camera tilts by moving dy over the band (see S03).
 * ---------------------------------------------------------------------------------------- */
export const TW = { w: W, h: 3200, cx: 648, cy: 1300, f: 1900, pitch: (42 * Math.PI) / 180, eye: 1.7 };
const cth = Math.cos(TW.pitch), sth = Math.sin(TW.pitch);
export const tp = (x: number, y: number, z: number): [number, number] => {
  const yy = y - TW.eye, y2 = yy * cth - z * sth, z2 = yy * sth + z * cth;
  return [TW.cx + (TW.f * x) / z2, TW.cy - (TW.f * y2) / z2];
};
const P = (x: number, y: number, z: number) => tp(x, y, z).map((v) => v.toFixed(1)).join(',');

/** tower footprint: square 32 m, near corner toward the camera (rotated 42 deg), corner at (C.x, C.z) */
const C = { x: 4, z: 100, s: 32, a: (40 * Math.PI) / 180 };
const ux = Math.cos(C.a), uz = Math.sin(C.a); // right face direction
const vx = -Math.sin(C.a), vz = Math.cos(C.a); // left face direction (going back-left)
// corners on the ground plane
const N = [C.x, C.z];
const R = [C.x + ux * C.s, C.z + uz * C.s]; // right corner
const L = [C.x - Math.cos(Math.PI / 2 - C.a) * C.s, C.z + Math.sin(Math.PI / 2 - C.a) * C.s]; // left corner
void vx; void vz;
export const T = { done: 128, top: 160, floor: 3.6 };
/** crane mast base sits inside the slab near the near corner */
export const CR = { x: C.x + 6, z: C.z + 14, top: 204, jib: 64, cjib: 21, ang: (203 * Math.PI) / 180, w: 3.2 };

const SKY = ['#8fb0c6', '#a9c3d2', '#d2dcdc', '#eee9d9'];

export const TowerBand: React.FC = () => {
  const faces: React.ReactNode[] = [];
  const lf = (a: number[], b: number[], y0: number, y1: number) => `${P(a[0], y0, a[1])} ${P(a[0], y1, a[1])} ${P(b[0], y1, b[1])} ${P(b[0], y0, b[1])}`;
  // finished part: two faces (left = sunlit concrete in haze, right = shade), window bands per floor
  faces.push(<polygon key="lf" points={lf(L, N, 0, T.done)} fill="#8b877f" />);
  faces.push(<polygon key="rf" points={lf(N, R, 0, T.done)} fill="#5f5c58" />);
  for (let y = 4; y < T.done - 1; y += T.floor) {
    faces.push(<polygon key={`lw${y}`} points={lf(L, N, y + 1.2, y + 3.0)} fill="#55575a" />);
    faces.push(<polygon key={`rw${y}`} points={lf(N, R, y + 1.2, y + 3.0)} fill="#3f4246" />);
  }
  // vertical mullion lines (a few, low detail)
  for (let k = 1; k < 6; k++) {
    const a = [L[0] + (N[0] - L[0]) * (k / 6), L[1] + (N[1] - L[1]) * (k / 6)], b = [N[0] + (R[0] - N[0]) * (k / 6), N[1] + (R[1] - N[1]) * (k / 6)];
    faces.push(<polygon key={`ml${k}`} points={`${P(a[0] - 0.15, 0, a[1])} ${P(a[0] - 0.15, T.done, a[1])} ${P(a[0] + 0.15, T.done, a[1])} ${P(a[0] + 0.15, 0, a[1])}`} fill="#7c7870" />);
    faces.push(<polygon key={`mr${k}`} points={`${P(b[0] - 0.15, 0, b[1])} ${P(b[0] - 0.15, T.done, b[1])} ${P(b[0] + 0.15, T.done, b[1])} ${P(b[0] + 0.15, 0, b[1])}`} fill="#56534f" />);
  }
  // unfinished top: open floors (dark interiors seen from below), raw concrete slab edges and columns,
  // the top two floors see-through to the sky, rebar sticking up from the last slab, green safety net.
  const skel: React.ReactNode[] = [];
  const back: React.ReactNode[] = [];
  const nCol = 6;
  const nF = Math.round((T.top - T.done) / T.floor); // open floors
  const at = (a: number[], b: number[], k: number) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  for (let f = 0; f < nF; f++) {
    const y0 = T.done + f * T.floor, y1 = y0 + T.floor;
    const see = f >= nF - 2; // sky shows through the top floors
    if (!see) {
      back.push(<polygon key={`il${f}`} points={lf(L, N, y0, y1)} fill="#4a4843" />);
      back.push(<polygon key={`ir${f}`} points={lf(N, R, y0, y1)} fill="#393835" />);
      // underside of the slab above, a slightly lighter band at the top of each opening
      back.push(<polygon key={`ul${f}`} points={lf(L, N, y1 - 0.7, y1)} fill="#5b5852" />);
    } else {
      // far columns and the slab edge on the far side (seen through), pale and thin
      const B = [L[0] + (R[0] - N[0]), L[1] + (R[1] - N[1])];
      back.push(<polygon key={`fl${f}`} points={lf(L, B, y0, y0 + 0.5)} fill="#8a877f" opacity={0.7} />);
      back.push(<polygon key={`fr${f}`} points={lf(B, R, y0, y0 + 0.5)} fill="#8a877f" opacity={0.7} />);
      for (let k = 1; k < 4; k++) {
        const q = at(L, B, k / 4), q2 = at(B, R, k / 4);
        back.push(<polygon key={`fc${f}${k}`} points={`${P(q[0] - 0.3, y0, q[1])} ${P(q[0] - 0.3, y1, q[1])} ${P(q[0] + 0.3, y1, q[1])} ${P(q[0] + 0.3, y0, q[1])}`} fill="#8a877f" opacity={0.6} />);
        back.push(<polygon key={`fd${f}${k}`} points={`${P(q2[0] - 0.3, y0, q2[1])} ${P(q2[0] - 0.3, y1, q2[1])} ${P(q2[0] + 0.3, y1, q2[1])} ${P(q2[0] + 0.3, y0, q2[1])}`} fill="#8a877f" opacity={0.6} />);
      }
    }
  }
  // near columns on both faces (the last floor only partly built: columns stop short on the right)
  for (let k = 0; k <= nCol; k++) {
    const a = at(L, N, k / nCol), b = at(N, R, k / nCol);
    const topR = T.top - (k >= nCol - 1 ? T.floor : 0);
    skel.push(<polygon key={`cl${k}`} points={`${P(a[0] - 0.5, T.done, a[1])} ${P(a[0] - 0.5, T.top, a[1])} ${P(a[0] + 0.5, T.top, a[1])} ${P(a[0] + 0.5, T.done, a[1])}`} fill="#938e85" />);
    skel.push(<polygon key={`cr${k}`} points={`${P(b[0] - 0.5, T.done, b[1])} ${P(b[0] - 0.5, topR, b[1])} ${P(b[0] + 0.5, topR, b[1])} ${P(b[0] + 0.5, T.done, b[1])}`} fill="#5e5b56" />);
  }
  // slab edges (thick raw concrete bands); the top slab only covers the left part
  for (let f = 0; f <= nF; f++) {
    const y = T.done + f * T.floor;
    if (f === nF) {
      skel.push(<polygon key="slt" points={lf(L, at(L, N, 0.85), y - 0.8, y)} fill="#a39e94" />);
      continue;
    }
    skel.push(<polygon key={`sl${f}`} points={lf(L, N, y - 0.8, y)} fill="#a39e94" />);
    skel.push(<polygon key={`sr${f}`} points={lf(N, R, y - 0.8, y)} fill="#696660" />);
  }
  // rebar starter bars sticking up from the unfinished columns
  for (let k = nCol - 1; k <= nCol; k++) {
    const b = at(N, R, k / nCol), [x0, y0] = tp(b[0], T.top - T.floor, b[1]), [, y1] = tp(b[0], T.top - T.floor + 2.2, b[1]);
    skel.push(<path key={`rb${k}`} d={`M ${x0 - 4} ${y0} L ${x0 - 5} ${y1} M ${x0} ${y0} L ${x0} ${y1 - 3} M ${x0 + 4} ${y0} L ${x0 + 5} ${y1}`} stroke="#4a4844" strokeWidth={1.6} />);
  }
  // green safety net hanging over two floors of the right face (half way across)
  skel.push(<polygon key="net" points={`${P(at(N, R, 0.35)[0], T.done + 0.2, at(N, R, 0.35)[1])} ${P(at(N, R, 0.35)[0], T.done + 2 * T.floor, at(N, R, 0.35)[1])} ${P(R[0], T.done + 2 * T.floor, R[1])} ${P(R[0], T.done + 0.2, R[1])}`} fill="#4f5e4b" opacity={0.9} />);

  // crane: lattice mast from the core up past the roof, jib + counter-jib, cab, A-frame, hook
  const m0 = tp(CR.x, T.done, CR.z), m1 = tp(CR.x, CR.top, CR.z), m0b = tp(CR.x + CR.w, T.done, CR.z), m1b = tp(CR.x + CR.w, CR.top, CR.z);
  const jx = Math.cos(CR.ang), jz = Math.sin(CR.ang);
  const jibEnd = tp(CR.x + jx * CR.jib, CR.top + 0.9, CR.z + jz * CR.jib);
  const jibEndLo = tp(CR.x + jx * CR.jib, CR.top - 0.6, CR.z + jz * CR.jib);
  const cEnd = tp(CR.x - jx * CR.cjib, CR.top + 0.6, CR.z - jz * CR.cjib);
  const cEndLo = tp(CR.x - jx * CR.cjib, CR.top - 1.4, CR.z - jz * CR.cjib);
  const apex = tp(CR.x + CR.w / 2, CR.top + 10, CR.z);
  const jTop = tp(CR.x + CR.w / 2, CR.top + 1.4, CR.z), jLo = tp(CR.x + CR.w / 2, CR.top - 0.8, CR.z);
  const lattice: React.ReactNode[] = [];
  const segs = 14;
  for (let i = 0; i < segs; i++) {
    const a = i / segs, b = (i + 1) / segs;
    const la = [m0[0] + (m1[0] - m0[0]) * a, m0[1] + (m1[1] - m0[1]) * a], lb = [m0[0] + (m1[0] - m0[0]) * b, m0[1] + (m1[1] - m0[1]) * b];
    const ra = [m0b[0] + (m1b[0] - m0b[0]) * a, m0b[1] + (m1b[1] - m0b[1]) * a], rbb = [m0b[0] + (m1b[0] - m0b[0]) * b, m0b[1] + (m1b[1] - m0b[1]) * b];
    lattice.push(<path key={`m${i}`} d={`M ${la[0]} ${la[1]} L ${rbb[0]} ${rbb[1]} M ${la[0]} ${la[1]} L ${ra[0]} ${ra[1]}`} />);
  }
  const jsegs = 22;
  for (let i = 0; i < jsegs; i++) {
    const a = i / jsegs, b = (i + 1) / jsegs;
    const ta = [jTop[0] + (jibEnd[0] - jTop[0]) * a, jTop[1] + (jibEnd[1] - jTop[1]) * a], lb = [jLo[0] + (jibEndLo[0] - jLo[0]) * b, jLo[1] + (jibEndLo[1] - jLo[1]) * b];
    const la = [jLo[0] + (jibEndLo[0] - jLo[0]) * a, jLo[1] + (jibEndLo[1] - jLo[1]) * a];
    lattice.push(<path key={`j${i}`} d={`M ${la[0]} ${la[1]} L ${ta[0]} ${ta[1]} L ${lb[0]} ${lb[1]}`} />);
  }
  const trolley = 0.62;
  const tr = [jLo[0] + (jibEndLo[0] - jLo[0]) * trolley, jLo[1] + (jibEndLo[1] - jLo[1]) * trolley];
  const CRANE = '#3c4249';

  return (
    <g>
      <defs>
        <linearGradient id="sttSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SKY[0]} /><stop offset="0.35" stopColor={SKY[1]} /><stop offset="0.7" stopColor={SKY[2]} /><stop offset="1" stopColor={SKY[3]} />
        </linearGradient>
        <radialGradient id="sttSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffdf2" /><stop offset="0.2" stopColor="#fff9e6" stopOpacity={0.95} /><stop offset="0.55" stopColor="#f8f1df" stopOpacity={0.4} /><stop offset="1" stopColor="#f2ecdc" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={TW.w} height={TW.h} fill="url(#sttSky)" />
      {/* harsh sun peeking past the right edge of the tower top */}
      <circle cx={1010} cy={1180} r={760} fill="url(#sttSun)" />
      {/* far hazy towers (background layer), pale and low contrast */}
      <polygon points={`${P(-120, 0, 330)} ${P(-120, 210, 330)} ${P(-86, 210, 360)} ${P(-86, 0, 360)}`} fill="#bccbd2" />
      <polygon points={`${P(-86, 0, 360)} ${P(-86, 210, 360)} ${P(-60, 210, 380)} ${P(-60, 0, 380)}`} fill="#aebec7" />
      <polygon points={`${P(70, 0, 260)} ${P(70, 150, 260)} ${P(98, 150, 250)} ${P(98, 0, 250)}`} fill="#c5d1d5" />
      <polygon points={`${P(98, 0, 250)} ${P(98, 150, 250)} ${P(118, 150, 275)} ${P(118, 0, 275)}`} fill="#b3c1c8" />
      {faces}
      {back}
      <g stroke={CRANE} strokeWidth={3.2} fill="none" strokeLinecap="round">
        <path d={`M ${m0[0]} ${m0[1]} L ${m1[0]} ${m1[1]} M ${m0b[0]} ${m0b[1]} L ${m1b[0]} ${m1b[1]}`} strokeWidth={6.5} />
        {lattice.slice(0, 14)}
      </g>
      {skel}
      {/* parapet line at the last finished floor, sun rim on the right edge */}
      <polygon points={lf(L, N, T.done - 0.6, T.done)} fill="#a29d93" />
      <polygon points={`${P(R[0] - 0.25, 0, R[1])} ${P(R[0] - 0.25, T.top, R[1])} ${P(R[0], T.top, R[1])} ${P(R[0], 0, R[1])}`} fill="#fff4d8" opacity={0.75} />
      <polygon points={`${P(N[0] - 0.2, 0, N[1])} ${P(N[0] - 0.2, T.done, N[1])} ${P(N[0] + 0.2, T.done, N[1])} ${P(N[0] + 0.2, 0, N[1])}`} fill="#a59f94" />
      {/* crane */}
      <g stroke={CRANE} strokeWidth={3.2} fill="none" strokeLinecap="round">
        {lattice.slice(14)}
        <path d={`M ${jTop[0]} ${jTop[1]} L ${jibEnd[0]} ${jibEnd[1]} M ${jLo[0]} ${jLo[1]} L ${jibEndLo[0]} ${jibEndLo[1]}`} strokeWidth={5.5} />
        <path d={`M ${jTop[0]} ${jTop[1]} L ${cEnd[0]} ${cEnd[1]} M ${jLo[0]} ${jLo[1]} L ${cEndLo[0]} ${cEndLo[1]}`} strokeWidth={6} />
        {/* A-frame + tie bars */}
        <path d={`M ${jTop[0] - 6} ${jTop[1]} L ${apex[0]} ${apex[1]} L ${jTop[0] + 8} ${jTop[1]}`} strokeWidth={4} />
        <path d={`M ${apex[0]} ${apex[1]} L ${jTop[0] + (jibEnd[0] - jTop[0]) * 0.55} ${jTop[1] + (jibEnd[1] - jTop[1]) * 0.55} M ${apex[0]} ${apex[1]} L ${cEnd[0]} ${cEnd[1]}`} strokeWidth={1.8} />
        {/* hoist cable */}
        <path d={`M ${tr[0]} ${tr[1]} L ${tr[0] - 2} ${tr[1] + 300}`} strokeWidth={1.4} />
      </g>
      {/* counterweight blocks, cab, trolley, hook block */}
      {(() => {
        const q = (k: number, y: number) => tp(CR.x - jx * CR.cjib * k, y, CR.z - jz * CR.cjib * k).join(',');
        return <polygon points={`${q(0.62, CR.top - 0.8)} ${q(0.97, CR.top - 0.8)} ${q(0.97, CR.top - 5)} ${q(0.62, CR.top - 5)}`} fill={CRANE} />;
      })()}
      <rect x={jLo[0] - 30} y={jLo[1] - 4} width={60} height={8} fill={CRANE} />
      <rect x={jLo[0] - 34} y={jLo[1] + 2} width={34} height={30} rx={3} fill={CRANE} />
      <rect x={jLo[0] - 30} y={jLo[1] + 6} width={22} height={13} fill="#b3c4cc" />
      <rect x={tr[0] - 8} y={tr[1] - 1} width={16} height={7} fill={CRANE} />
      <rect x={tr[0] - 9} y={tr[1] + 296} width={14} height={18} rx={2} fill={CRANE} />
      <path d={`M ${tr[0] - 2} ${tr[1] + 314} q -6 8 0 12 q 6 2 6 -5`} stroke={CRANE} strokeWidth={2.4} fill="none" />
    </g>
  );
};

/** foreground (Live, faster parallax): a near building corner on the left edge in cool shade + low wires. */
export const TowerFg: React.FC = () => {
  const pts = (x0: number, x1: number) => `${x0},${TW.h} ${x1},${TW.h} ${x1 + 70},0 ${x0 + 40},0`;
  return (
    <g>
      <polygon points={pts(-80, 230)} fill="#3a4048" />
      <polygon points={pts(196, 230)} fill="#49505a" />
      {/* balcony slabs on the near building (cool, dark) */}
      {Array.from({ length: 16 }, (_, i) => {
        const y = 300 + i * 190, x1 = 230 + 70 * (1 - y / TW.h);
        return <polygon key={i} points={`${-80},${y} ${x1 + 26},${y - 6} ${x1 + 26},${y + 14} ${-80},${y + 20}`} fill="#2f343b" />;
      })}
      <polygon points={`${W + 40},${TW.h} 1120,${TW.h} 1090,1230 1150,1196 ${W + 40},1180`} fill="#3a4048" />
      <polygon points={`1120,${TW.h} 1090,1230 1104,1226 1134,${TW.h}`} fill="#4a525c" />
      <rect x={1084} y={1196} width={260} height={18} fill="#2f343b" transform="rotate(-2 1084 1196)" />
      <path d={`M 230 ${TW.h - 260} Q 700 ${TW.h - 120} ${W + 80} ${TW.h - 330}`} stroke="#2f343b" strokeWidth={6} fill="none" />
      <path d={`M 230 ${TW.h - 210} Q 760 ${TW.h - 40} ${W + 80} ${TW.h - 250}`} stroke="#2f343b" strokeWidth={4} fill="none" />
    </g>
  );
};
