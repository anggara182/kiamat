import React from 'react';
import { W, H, rng } from './world';

/* ------------------------------------------------------------------------------------------
 * EP02 set "alley": one narrow kampung alley (gang) at harsh noon. White sky, plaster walls,
 * short hard shadows. The left wall is in shade, the right wall in sun; the hero reads dark
 * against the light walls / sky.
 * ---------------------------------------------------------------------------------------- */
export const PAL = {
  sky: '#e9eef0', sky2: '#f5f2ea', lit: '#d8cdb8', lit2: '#cfc2aa', lit3: '#e2d8c4', shade: '#8f846f', shade2: '#857a66', shade3: '#998d77',
  floor: '#c9bda6', floor2: '#b9ac93', dark: '#2a2018', wood: '#5a4232', wood2: '#4a3628', teal: '#5f7a78', bars: '#2e2a26', glass: '#3a332c',
  leaf: '#4d5a49', leaf2: '#3e4a3c', pot: '#9a5f48', pipe: '#9aa0a4', pipeD: '#6c7277', pipeH: '#d4d8da', roof: '#5a5450', roof2: '#46413d',
};
const hx = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = hx(a), B = hx(b), k = Math.min(1, Math.max(0, t));
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('');
};

/* ------------------------------- deep view: down the alley ------------------------------- */
export const D = { f: 1000, hc: 1.6, YH: 1060, VX: 648, half: 1.25 };
export const pj = (X: number, Y: number, Z: number): [number, number] => [D.VX + (D.f * X) / Z, D.YH + (D.f * (D.hc - Y)) / Z];
const P = (X: number, Y: number, Z: number) => pj(X, Y, Z).map((v) => v.toFixed(1)).join(',');
const quad = (a: number[], b: number[], c: number[], d: number[]) => `${P(a[0], a[1], a[2])} ${P(b[0], b[1], b[2])} ${P(c[0], c[1], c[2])} ${P(d[0], d[1], d[2])}`;
const FAR = 46;
const hz = (c: string, z: number) => mix(c, '#efe9dc', Math.min(0.75, z / 70));

export const DeepBand: React.FC = () => {
  const r = rng(201);
  const X0 = -D.half, X1 = D.half;
  const walls: React.ReactNode[] = [];
  for (const side of [-1, 1]) {
    const X = side < 0 ? X0 : X1;
    let z = 0.9, i = 0;
    while (z < FAR) {
      const len = 3.5 + r() * 4, h = 3 + r() * 2.4, z1 = Math.min(FAR, z + len);
      const base = side < 0 ? [PAL.shade, PAL.shade2, PAL.shade3][i % 3] : [PAL.lit, PAL.lit2, PAL.lit3][i % 3];
      const c = hz(base, z), cd = hz(mix(base, PAL.dark, 0.35), z);
      walls.push(<polygon key={`w${side}${i}`} points={quad([X, 0, z], [X, h, z], [X, h, z1], [X, 0, z1])} fill={c} />);
      // plinth band at the base, a little darker
      walls.push(<polygon key={`p${side}${i}`} points={quad([X, 0, z], [X, 0.35, z], [X, 0.35, z1], [X, 0, z1])} fill={cd} opacity={0.6} />);
      // roof eave overhanging the alley (dark underside)
      const ev = 0.45;
      walls.push(<polygon key={`e${side}${i}`} points={quad([X, h, z - 0.1], [X - side * ev, h - 0.12, z - 0.1], [X - side * ev, h - 0.12, z1 + 0.1], [X, h, z1 + 0.1])} fill={hz(PAL.roof2, z)} />);
      walls.push(<polygon key={`er${side}${i}`} points={quad([X - side * ev, h - 0.12, z - 0.1], [X - side * ev, h - 0.02, z - 0.1], [X - side * ev, h - 0.02, z1 + 0.1], [X - side * ev, h - 0.12, z1 + 0.1])} fill={hz(PAL.roof, z)} />);
      // a door or a barred window per house
      const dz = z + 0.6 + r() * Math.max(0.2, len - 2.2);
      if (r() < 0.55) {
        walls.push(<polygon key={`d${side}${i}`} points={quad([X, 0, dz], [X, 2.05, dz], [X, 2.05, dz + 0.85], [X, 0, dz + 0.85])} fill={hz(r() < 0.3 ? PAL.teal : PAL.wood, z)} />);
        walls.push(<polygon key={`ds${side}${i}`} points={quad([X, 2.05, dz - 0.1], [X, 2.25, dz - 0.1], [X, 2.25, dz + 0.95], [X, 2.05, dz + 0.95])} fill={cd} />);
      } else {
        walls.push(<polygon key={`v${side}${i}`} points={quad([X, 1.0, dz], [X, 2.0, dz], [X, 2.0, dz + 1.1], [X, 1.0, dz + 1.1])} fill={hz(PAL.glass, z)} />);
        for (let k = 1; k < 5; k++) { const zz = dz + (k * 1.1) / 5; walls.push(<polygon key={`vb${side}${i}${k}`} points={quad([X, 1.0, zz], [X, 2.0, zz], [X, 2.0, zz + 0.04], [X, 1.0, zz + 0.04])} fill={hz(PAL.bars, z)} />); }
      }
      // potted plant at the base
      if (r() < 0.45 && z > 2) {
        const pz = z + r() * len, [px, py] = pj(X - side * 0.25, 0, pz), s = D.f / pz;
        walls.push(<g key={`pl${side}${i}`}><path d={`M ${px - 0.16 * s} ${py} L ${px - 0.2 * s} ${py - 0.32 * s} L ${px + 0.2 * s} ${py - 0.32 * s} L ${px + 0.16 * s} ${py} Z`} fill={hz(PAL.pot, pz)} /><ellipse cx={px} cy={py - 0.5 * s} rx={0.3 * s} ry={0.25 * s} fill={hz(PAL.leaf, pz)} /><ellipse cx={px + 0.12 * s} cy={py - 0.62 * s} rx={0.18 * s} ry={0.16 * s} fill={hz(PAL.leaf2, pz)} /></g>);
      }
      z = z1;
      i++;
    }
  }
  walls.reverse();
  // the leaking pipe along the left wall base, a riser with an elbow at Z ~5.4 (where the young man works)
  const pipe = (
    <g>
      <polygon points={quad([X0 + 0.06, 0.28, 2], [X0 + 0.06, 0.34, 2], [X0 + 0.06, 0.34, 30], [X0 + 0.06, 0.28, 30])} fill={PAL.pipeD} />
      <polygon points={quad([X0 + 0.06, 0.28, 5.3], [X0 + 0.06, 0.62, 5.3], [X0 + 0.06, 0.62, 5.42], [X0 + 0.06, 0.28, 5.42])} fill={PAL.pipe} />
    </g>
  );
  const cables: React.ReactNode[] = [];
  [5, 9, 15, 24, 33].forEach((z, i) => {
    const [ax, ay] = pj(X0 - 0.1, 3.9 - (i % 2) * 0.4, z), [bx, by] = pj(X1 + 0.1, 3.6 + (i % 2) * 0.3, z + 1.5);
    cables.push(<path key={i} d={`M ${ax} ${ay} Q ${(ax + bx) / 2} ${Math.max(ay, by) + 1400 / z} ${bx} ${by}`} stroke={hz('#2e2a26', z)} strokeWidth={Math.max(1.2, 14 / z)} fill="none" />);
  });
  const [fx0, fy0] = pj(X0, 0, FAR), [fx1] = pj(X1, 0, FAR), [, fyt] = pj(0, 5, FAR);
  const [, ySh0] = pj(0, 0, 1.2);
  return (
    <g>
      <defs>
        <linearGradient id="alSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PAL.sky} /><stop offset="1" stopColor={PAL.sky2} /></linearGradient>
        <linearGradient id="alFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ece5d6" /><stop offset="0.12" stopColor={PAL.floor} /><stop offset="1" stopColor={PAL.floor2} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#alSky)" />
      {/* far end: the bright street, a wall across it and a tree */}
      <rect x={fx0 - 4} y={fyt} width={fx1 - fx0 + 8} height={fy0 - fyt} fill="#efe9da" />
      <rect x={fx0 - 4} y={fyt + (fy0 - fyt) * 0.35} width={fx1 - fx0 + 8} height={(fy0 - fyt) * 0.65} fill="#ddd3c0" />
      <ellipse cx={fx0 + (fx1 - fx0) * 0.7} cy={fyt + 6} rx={(fx1 - fx0) * 0.35} ry={(fy0 - fyt) * 0.3} fill={mix(PAL.leaf, '#efe9dc', 0.6)} />
      {/* floor: concrete paving, short hard shadow strip along the left wall, gutter on the right */}
      <polygon points={`${D.VX},${D.YH} ${-1400},${H + 400} ${W + 1400},${H + 400}`} fill="url(#alFloor)" />
      <polygon points={quad([X0, 0, 0.6], [X0, 0, FAR], [X0 + 0.42, 0, FAR], [X0 + 0.42, 0, 0.6])} fill={PAL.dark} opacity={0.3} />
      <polygon points={quad([X1 - 0.28, 0, 0.6], [X1 - 0.28, 0, FAR], [X1 - 0.08, 0, FAR], [X1 - 0.08, 0, 0.6])} fill="#6f6656" />
      <polygon points={quad([X1 - 0.22, 0, 0.6], [X1 - 0.22, 0, FAR], [X1 - 0.16, 0, FAR], [X1 - 0.16, 0, 0.6])} fill="#e9eef0" opacity={0.45} />
      {[3, 6, 10, 15, 22, 32].map((z) => <polygon key={z} points={quad([X0, 0, z], [X1 - 0.28, 0, z], [X1 - 0.28, 0, z + 0.03], [X0, 0, z + 0.03])} fill="#a99c84" opacity={0.6} />)}
      {walls}
      {pipe}
      {cables}
      <rect x={0} y={ySh0 + 20} width={0} height={0} />
    </g>
  );
};

/** laundry on lines across the alley (environment, ON ONES): shirts, a sarong, a towel swaying */
export const Laundry: React.FC<{ t: number; zs?: number[] }> = ({ t, zs = [7, 12, 19] }) => {
  const r = rng(211);
  const cols = ['#c94f3d', '#e8e2d2', '#4f6f8a', '#d9a441', '#7a8a5a', '#f0ece0', '#8a4a6a'];
  return (
    <g>
      {zs.map((z, li) => {
        const yl = 2.75 + (li % 2) * 0.2;
        const [ax, ay] = pj(-D.half, yl, z), [bx, by] = pj(D.half, yl, z);
        const s = D.f / z, sag = 0.18 * s;
        const items: React.ReactNode[] = [];
        for (let k = 0; k < 4; k++) {
          const u = 0.14 + k * 0.23 + r() * 0.05, x = ax + (bx - ax) * u, y = ay + (by - ay) * u + sag * 4 * u * (1 - u);
          const w = (0.38 + r() * 0.2) * s, h = (0.5 + r() * 0.35) * s, sw = Math.sin(t * 2.2 + li + k * 1.3) * 5;
          const c = mix(cols[(li * 4 + k) % cols.length], '#efe9dc', Math.min(0.5, z / 60));
          const shirt = k % 2 === 0;
          items.push(
            <g key={k} transform={`rotate(${sw} ${x} ${y})`}>
              {shirt
                ? <path d={`M ${x - w / 2} ${y} L ${x - w * 0.8} ${y + h * 0.25} L ${x - w * 0.55} ${y + h * 0.35} L ${x - w * 0.45} ${y + h} L ${x + w * 0.45} ${y + h} L ${x + w * 0.55} ${y + h * 0.35} L ${x + w * 0.8} ${y + h * 0.25} L ${x + w / 2} ${y} Z`} fill={c} />
                : <path d={`M ${x - w / 2} ${y} L ${x + w / 2} ${y} L ${x + w / 2 + Math.sin(t * 3 + k) * 0.03 * s} ${y + h * 1.3} L ${x - w / 2 + Math.sin(t * 3 + k + 1) * 0.03 * s} ${y + h * 1.3} Z`} fill={c} />}
              <path d={`M ${x - w / 2} ${y + h * 0.1} L ${x + w / 2} ${y + h * 0.1}`} stroke={PAL.dark} strokeWidth={Math.max(1, 0.02 * s)} opacity={0.15} />
            </g>,
          );
        }
        return (
          <g key={z}>
            <path d={`M ${ax} ${ay} Q ${(ax + bx) / 2} ${(ay + by) / 2 + sag * 2} ${bx} ${by}`} stroke="#4a4440" strokeWidth={Math.max(1, 0.02 * s)} fill="none" />
            {items}
          </g>
        );
      })}
    </g>
  );
};

/** dust motes drifting in the sun (environment, ON ONES) */
export const Dust: React.FC<{ t: number; x0?: number; y0?: number; w?: number; h?: number; n?: number; seed?: number; col?: string; o?: number }> = ({ t, x0 = 0, y0 = 0, w = W, h = H, n = 40, seed = 3, col = '#fffaf0', o = 0.7 }) => {
  const r = rng(seed);
  const m = Array.from({ length: n }, () => ({ x: r(), y: r(), s: 1.5 + r() * 3, vx: (r() - 0.5) * 14, vy: -4 - r() * 10, ph: r() * 6 }));
  return (
    <g fill={col}>
      {m.map((q, i) => {
        const x = x0 + ((((q.x * w + q.vx * t + Math.sin(t * 0.9 + q.ph) * 10) % w) + w) % w);
        const y = y0 + ((((q.y * h + q.vy * t) % h) + h) % h);
        return <circle key={i} cx={x} cy={y} r={q.s} opacity={o * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + q.ph)))} />;
      })}
    </g>
  );
};

/** a kampung cat. pose: 'sit' (tail swishes, head turns) or 'run' (bounding). Animal = character: drive with t2. */
export const Cat: React.FC<{ x: number; y: number; s: number; t2: number; pose?: 'sit' | 'run'; dir?: number; col?: string }> = ({ x, y, s, t2, pose = 'sit', dir = 1, col = '#3a3028' }) => {
  const tail = Math.sin(t2 * 3.1);
  if (pose === 'run') {
    const ph = Math.sin(t2 * 16);
    return (
      <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`} fill={col}>
        <path d={`M -34 -18 Q -10 ${-30 - ph * 4} 22 -22 Q 34 -20 34 -10 Q 20 -8 4 -10 Q -18 -6 -34 -12 Z`} />
        <circle cx={36} cy={-22} r={8} />
        <path d="M 33 -29 L 36 -37 L 40 -29 Z M 39 -28 L 44 -35 L 45 -26 Z" />
        <path d={`M 18 -12 L ${28 + ph * 8} 0 M 12 -12 L ${20 - ph * 6} 0 M -26 -14 L ${-34 - ph * 8} 0 M -20 -14 L ${-14 + ph * 6} 0`} stroke={col} strokeWidth={4} strokeLinecap="round" />
        <path d={`M -34 -16 Q -50 ${-30 + ph * 4} -58 ${-20 + ph * 6}`} stroke={col} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`} fill={col}>
      <path d={`M -2 -2 Q ${-30 - tail * 6} -4 ${-36 - tail * 10} ${-16 + tail * 4}`} stroke={col} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M -14 0 Q -18 -26 -6 -38 Q 4 -44 10 -34 Q 16 -20 14 0 Z" />
      <circle cx={6 + Math.sin(t2 * 0.9) * 1.5} cy={-44} r={9} />
      <path d={`M ${1 + Math.sin(t2 * 0.9) * 1.5} -50 L ${3 + Math.sin(t2 * 0.9) * 1.5} -60 L ${8 + Math.sin(t2 * 0.9) * 1.5} -51 Z M ${7 + Math.sin(t2 * 0.9) * 1.5} -51 L ${13 + Math.sin(t2 * 0.9) * 1.5} -59 L ${14 + Math.sin(t2 * 0.9) * 1.5} -48 Z`} />
      <ellipse cx={2} cy={1} rx={18} ry={3} fill={PAL.dark} opacity={0.3} />
    </g>
  );
};

/* -------------------------------- wall elevation (S14, S15, S20) -------------------------------- */
export const WALL = { ground: 1560, m: 300, jointX: 540, jointY: 1350 };
export const WallBand: React.FC = () => {
  const r = rng(221);
  const G = WALL.ground;
  return (
    <g>
      <rect x={0} y={0} width={W} height={340} fill={PAL.sky} />
      {/* plastered wall in sun, a few damp patches */}
      <rect x={0} y={320} width={W} height={G - 320} fill={PAL.lit} />
      {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={r() * W} cy={700 + r() * 760} rx={60 + r() * 140} ry={30 + r() * 70} fill={i % 2 ? '#cbbfa8' : '#c6b9a0'} opacity={0.7} />)}
      <rect x={0} y={G - 150} width={W} height={150} fill="#bfb199" />
      <rect x={0} y={G - 150} width={W} height={6} fill="#a99b82" />
      {/* door at the far left (teal), barred window on the right */}
      <rect x={-40} y={900} width={250} height={G - 900} fill={PAL.teal} />
      <rect x={-40} y={880} width={280} height={24} fill="#a99b82" />
      <rect x={10} y={960} width={150} height={260} fill="#4f6866" />
      <circle cx={180} cy={1250} r={9} fill="#2e2a26" />
      <rect x={880} y={700} width={320} height={380} fill={PAL.glass} />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={890 + i * 46} y={700} width={9} height={380} fill={PAL.bars} />)}
      <rect x={860} y={1080} width={360} height={22} fill="#a99b82" />
      {/* water meter box + the vertical supply pipe coming down the wall */}
      <rect x={360} y={1080} width={120} height={90} rx={6} fill="#7c8a8e" />
      <rect x={378} y={1096} width={50} height={36} fill="#c9d4d8" />
      {/* roof eave + its hard short shadow across the top of the wall */}
      <rect x={-20} y={300} width={W + 40} height={46} fill={PAL.roof2} />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={i * 46 - 10} y={340} width={24} height={14} rx={6} fill={PAL.roof} />)}
      <polygon points={`0,346 ${W},346 ${W},470 0,560`} fill={PAL.dark} opacity={0.28} />
      {/* electric cable along the wall */}
      <path d={`M -20 640 Q 400 690 800 650 Q 1100 620 ${W + 20} 660`} stroke="#2e2a26" strokeWidth={5} fill="none" />
      {/* ground: gutter channel at the base, then packed dirt / old concrete */}
      <rect x={0} y={G} width={W} height={40} fill="#6f6656" />
      <rect x={0} y={G + 14} width={W} height={8} fill="#e9eef0" opacity={0.35} />
      <rect x={0} y={G + 40} width={W} height={H - G - 40} fill={PAL.floor} />
      <rect x={0} y={G + 40} width={W} height={60} fill={PAL.dark} opacity={0.12} />
      {Array.from({ length: 26 }, (_, i) => { const px = r() * W, py = G + 110 + r() * 600, s = 6 + r() * 14; return <g key={i}><ellipse cx={px + 3} cy={py + 3} rx={s} ry={s * 0.6} fill={PAL.dark} opacity={0.25} /><ellipse cx={px} cy={py} rx={s} ry={s * 0.6} fill={r() < 0.5 ? '#a89a80' : '#d6cab2'} /></g>; })}
    </g>
  );
};

/** the supply pipe with the leaking elbow joint (live: drawn over the wall band). drip 0..1 = water on the joint */
export const PipeRun: React.FC = () => {
  const { jointX: jx, jointY: jy, ground: G } = WALL;
  return (
    <g>
      {/* from the meter down to the elbow, then along the wall to the left */}
      <rect x={410} y={1170} width={22} height={jy - 1170} fill={PAL.pipe} />
      <rect x={410} y={1170} width={6} height={jy - 1170} fill={PAL.pipeH} opacity={0.7} />
      <rect x={-20} y={jy - 11} width={jx - 10} height={22} fill={PAL.pipe} />
      <rect x={-20} y={jy - 11} width={jx - 10} height={6} fill={PAL.pipeH} opacity={0.7} />
      <rect x={-20} y={jy + 8} width={jx - 10} height={3} fill={PAL.pipeD} />
      {/* riser from the ground into the elbow */}
      <rect x={jx - 11} y={jy} width={22} height={G - jy} fill={PAL.pipe} />
      <rect x={jx - 11} y={jy} width={6} height={G - jy} fill={PAL.pipeH} opacity={0.7} />
      {/* elbow coupling (hex) */}
      <rect x={jx - 22} y={jy - 18} width={40} height={36} rx={5} fill={PAL.pipeD} />
      <rect x={jx - 22} y={jy - 18} width={40} height={8} rx={3} fill={PAL.pipeH} opacity={0.6} />
      {/* wet streak down the riser + dark wet patch on the ground */}
      <rect x={jx + 2} y={jy + 18} width={7} height={G - jy - 18} fill="#5f666a" opacity={0.7} />
      <ellipse cx={jx + 10} cy={G + 60} rx={120} ry={22} fill="#7f7564" opacity={0.7} />
      {/* a pair of shadows: pipe on wall */}
      <rect x={-20} y={jy + 11} width={jx - 10} height={9} fill={PAL.dark} opacity={0.22} />
    </g>
  );
};

/** drops falling from the joint: times (s) of each drop leaving; lands in the wet patch. Water = environment (ONES). */
export const Drips: React.FC<{ t: number; times: number[]; x: number; y0: number; y1: number; s?: number }> = ({ t, times, x, y0, y1, s = 1 }) => {
  const out: React.ReactNode[] = [];
  const fall = 0.32;
  times.forEach((tk, i) => {
    const prev = i === 0 ? -1 : times[i - 1];
    if (t >= prev && t < tk) { // forming at the joint
      const g = Math.min(1, (t - Math.max(prev, tk - 0.8)) / 0.8);
      out.push(<ellipse key={`f${i}`} cx={x} cy={y0 + 4 * s * g} rx={4 * s * (0.4 + 0.6 * g)} ry={5 * s * (0.4 + 0.7 * g)} fill="#d8e8f0" opacity={0.9} />);
    }
    const u = (t - tk) / fall;
    if (u >= 0 && u < 1) out.push(<ellipse key={`d${i}`} cx={x} cy={y0 + (y1 - y0) * u * u} rx={3.6 * s} ry={6 * s} fill="#d8e8f0" />);
    const v = (t - tk - fall) / 0.6;
    if (v >= 0 && v < 1) out.push(<ellipse key={`r${i}`} cx={x} cy={y1} rx={(8 + 60 * v) * s} ry={(2 + 12 * v) * s} fill="none" stroke="#e9f2f6" strokeWidth={2 * s} opacity={0.8 * (1 - v)} />);
  });
  return <g>{out}</g>;
};

/** the young man's tools (static props). spread 0..1 = neat beside the bag -> scattered */
export const Tools: React.FC<{ x: number; y: number; s: number; spread?: number; taken?: number }> = ({ x, y, s, spread = 0, taken = 0 }) => {
  const k = spread;
  const item = (i: number, node: React.ReactNode, nx: number, sx: number, rot: number) => (i < taken ? null : <g key={i} transform={`translate(${x + (nx + (sx - nx) * k) * s} ${y}) rotate(${rot * k}) scale(${s})`}>{node}</g>);
  return (
    <g>
      {/* canvas tool bag */}
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={2} rx={40} ry={5} fill={PAL.dark} opacity={0.3} />
        <path d="M -36 0 L -32 -34 L 32 -34 L 36 0 Z" fill="#6e6248" />
        <path d="M -32 -34 L 32 -34 L 28 -40 L -28 -40 Z" fill="#857858" />
        <path d="M -20 -40 Q 0 -66 20 -40" stroke="#4a4232" strokeWidth={4} fill="none" />
        <rect x={-32} y={-24} width={64} height={4} fill="#4a4232" opacity={0.5} />
      </g>
      {item(0, <g><ellipse cx={0} cy={1} rx={26} ry={3} fill={PAL.dark} opacity={0.25} /><rect x={-24} y={-5} width={40} height={6} rx={2} fill="#8a8f96" /><circle cx={20} cy={-2} r={7} fill="#8a8f96" /><circle cx={20} cy={-2} r={3} fill={PAL.floor} /></g>, -60, -160, -30)}
      {item(1, <g><ellipse cx={0} cy={1} rx={20} ry={3} fill={PAL.dark} opacity={0.25} /><rect x={-18} y={-4} width={22} height={5} rx={2} fill="#c94f3d" /><rect x={4} y={-3} width={16} height={3} fill="#9aa0a4" /></g>, 52, 170, 40)}
      {item(2, <g><ellipse cx={0} cy={1} rx={13} ry={3} fill={PAL.dark} opacity={0.25} /><circle cx={0} cy={-8} r={9} fill="#2e2e32" /><circle cx={0} cy={-8} r={4} fill={PAL.floor} /></g>, 70, 260, 0)}
      {item(3, <g><ellipse cx={0} cy={1} rx={22} ry={3} fill={PAL.dark} opacity={0.25} /><path d="M -20 -2 L 4 -6 M 4 -6 L 18 -14 M 4 -6 L 18 2" stroke="#3d4a5a" strokeWidth={5} strokeLinecap="round" /></g>, -80, -260, 70)}
    </g>
  );
};

/* -------------------------------- low angle up (S16) -------------------------------- */
export const SkyBand: React.FC = () => {
  // walls rise from the bottom corners and converge up toward the zenith; white noon sky between
  const lw = (y: number) => -60 + (2304 - y) * 0.2, rw = (y: number) => W + 60 - (2304 - y) * 0.2;
  const yt = 360;
  return (
    <g>
      <defs>
        <radialGradient id="alGlare" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff" /><stop offset="0.4" stopColor="#f8f8f4" stopOpacity={0.8} /><stop offset="1" stopColor={PAL.sky} stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={PAL.sky} />
      <circle cx={700} cy={560} r={620} fill="url(#alGlare)" />
      {/* left wall (shade) and right wall (sun), in steep perspective */}
      <polygon points={`-60,${H} ${lw(H) + 420},${H} ${lw(yt) + 130},${yt} -60,${yt - 40}`} fill={PAL.shade} />
      <polygon points={`${W + 60},${H} ${rw(H) - 420},${H} ${rw(yt) - 130},${yt} ${W + 60},${yt - 40}`} fill={PAL.lit} />
      {/* eaves: dark undersides seen from below */}
      <polygon points={`-60,${yt - 40} ${lw(yt) + 130},${yt} ${lw(yt) + 210},${yt + 40} -60,${yt + 30}`} fill={PAL.roof2} />
      <polygon points={`${W + 60},${yt - 40} ${rw(yt) - 130},${yt} ${rw(yt) - 210},${yt + 40} ${W + 60},${yt + 30}`} fill={PAL.roof2} />
      {/* windows in perspective */}
      <polygon points={`120,900 300,940 290,1260 110,1230`} fill={PAL.glass} />
      {[0, 1, 2, 3].map((i) => <polygon key={i} points={`${150 + i * 40},${907 + i * 9} ${158 + i * 40},${909 + i * 9} ${150 + i * 40},${1240 + i * 6} ${142 + i * 40},${1238 + i * 6}`} fill={PAL.bars} />)}
      <polygon points={`${W - 120},880 ${W - 320},925 ${W - 310},1280 ${W - 110},1250`} fill={PAL.glass} />
      {/* cables crossing the sky */}
      <path d={`M -40 520 Q 640 760 ${W + 40} 480`} stroke="#2e2a26" strokeWidth={6} fill="none" />
      <path d={`M -40 600 Q 600 830 ${W + 40} 620`} stroke="#2e2a26" strokeWidth={4} fill="none" />
    </g>
  );
};

/* -------------------------------- the dirt (S17) -------------------------------- */
export const DirtBand: React.FC = () => {
  const r = rng(231);
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#bfb197" />
      {Array.from({ length: 14 }, (_, i) => <ellipse key={`p${i}`} cx={r() * W} cy={r() * H} rx={120 + r() * 220} ry={60 + r() * 120} fill={i % 2 ? '#b3a58a' : '#cabda3'} opacity={0.8} />)}
      {Array.from({ length: 6 }, (_, i) => { const x = r() * W, y = r() * H; return <path key={`c${i}`} d={`M ${x} ${y} l ${40 + r() * 60} ${10 + r() * 30} l ${30 + r() * 50} ${-20 + r() * 40} l ${30 + r() * 40} ${r() * 30}`} stroke="#8f8268" strokeWidth={3} fill="none" opacity={0.7} />; })}
      {Array.from({ length: 70 }, (_, i) => {
        const x = r() * W, y = r() * H, s = 6 + r() * 26, rot = r() * 180;
        return <g key={`s${i}`} transform={`rotate(${rot} ${x} ${y})`}><ellipse cx={x + s * 0.3} cy={y + s * 0.3} rx={s} ry={s * 0.7} fill={PAL.dark} opacity={0.28} /><ellipse cx={x} cy={y} rx={s} ry={s * 0.7} fill={r() < 0.5 ? '#9e927a' : '#d3c7ae'} /><ellipse cx={x - s * 0.25} cy={y - s * 0.2} rx={s * 0.45} ry={s * 0.3} fill="#e6dcc6" opacity={0.6} /></g>;
      })}
      {/* a dry leaf and a bit of rope */}
      <path d="M 260 520 q 60 -40 120 -10 q -50 40 -120 10 Z" fill="#8a6a3a" />
      <path d="M 900 1900 q 60 30 120 0 q 50 -20 90 20" stroke="#8a7a5a" strokeWidth={6} fill="none" />
    </g>
  );
};

/** the stone (hero prop): rough 2-tone rock with a hard noon shadow */
export const Stone: React.FC<{ x: number; y: number; s: number; rot?: number; shadow?: number }> = ({ x, y, s, rot = 0, shadow = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {shadow > 0 && <path d="M -30 8 Q -26 30 6 32 Q 40 30 42 12 Q 30 -4 0 -2 Z" fill={PAL.dark} opacity={0.35 * shadow} transform="translate(10 10)" />}
    <path d="M -34 6 Q -38 -18 -16 -30 Q 6 -40 28 -28 Q 42 -16 38 4 Q 30 24 2 26 Q -26 26 -34 6 Z" fill="#7d7468" />
    <path d="M -16 -30 Q 6 -40 28 -28 Q 36 -20 34 -8 Q 10 -14 -10 -6 Q -26 0 -34 2 Q -36 -18 -16 -30 Z" fill="#a39888" />
    <path d="M -8 -26 Q 6 -32 18 -26" stroke="#c9bfae" strokeWidth={3} fill="none" />
    <path d="M 4 -4 L 14 10 M -18 4 L -10 14" stroke="#5e564c" strokeWidth={2} />
  </g>
);
