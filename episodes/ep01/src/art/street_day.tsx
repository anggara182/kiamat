import React from 'react';
import { W, H, rng } from './world';

/* ------------------------------------------------------------------------------------------
 * Shot 2: hazy morning, a concrete commuter-rail viaduct across a wide road, a river of
 * motorbikes flowing under it, a commuter train sliding across on top.
 * One perspective camera (metres -> world px): camera 5 m up, looking level down the road.
 * Low sun behind the bridge (upper left): the viaduct and the train read DARK against the
 * pale sky; the near road lies in the bridge's long shadow (darker, cooler foreground).
 * ---------------------------------------------------------------------------------------- */
export const D = { f: 1150, hc: 5, YH: 900, VX: 648 };
export const pj = (X: number, Y: number, Z: number): [number, number] => [D.VX + (D.f * X) / Z, D.YH + (D.f * (D.hc - Y)) / Z];
export const sc = (Z: number) => D.f / Z;
const pt = (X: number, Y: number, Z: number) => pj(X, Y, Z).map((v) => v.toFixed(1)).join(',');

/** sun: azimuth -15 deg (left), elevation 22 deg. Shadows move toward camera (dZ) and right (dX) per metre of height. */
export const SUN = { x: 340, y: 419, dZ: 2.39, dX: 0.64 };
/** near edge of the lit road: the deck shadow covers everything closer than this */
export const SHADE_Z = 11.2;
/** viaduct geometry (metres) */
export const BR = { z0: 16, z1: 26, under: 6.6, top: 8.5, rail: 8.0, track: 18, pierX: 7, pierW: 1.6 };

const hx = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = hx(a), B = hx(b), k = Math.min(1, Math.max(0, t));
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('');
};
export const HAZE = '#e4e1d6';
const haze = (c: string, Z: number, k = 75) => mix(c, HAZE, 1 - Math.exp(-Z / k));

/* ------------------------------- band: sky + far towers -------------------------------- */
export const DaySky: React.FC = () => {
  const r = rng(7);
  const towers: React.ReactNode[] = [];
  // two rows of hazy towers on the far horizon, a couple with cranes (they keep rising)
  const row = (n: number, y0: number, hMin: number, hMax: number, col: string, lit: string, seed: number) => {
    const rr = rng(seed);
    let x = -40;
    for (let i = 0; i < n && x < W + 40; i++) {
      const w = 60 + rr() * 90, h = hMin + rr() * (hMax - hMin);
      const top = y0 - h;
      towers.push(
        <g key={`${seed}-${i}`}>
          <rect x={x} y={top} width={w} height={h + 40} fill={col} />
          <rect x={x} y={top} width={w * 0.28} height={h + 40} fill={lit} />
          {rr() < 0.35 && <rect x={x + w * 0.2} y={top - 16} width={w * 0.55} height={16} fill={col} />}
        </g>,
      );
      x += w + 6 + rr() * 50;
    }
  };
  row(14, 905, 260, 520, '#c2ccd0', '#cfd6d6', 3);
  row(12, 905, 160, 420, '#adbac1', '#bcc6c9', 5);
  void r;
  return (
    <g>
      <defs>
        <linearGradient id="stdSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb8c9" /><stop offset="0.26" stopColor="#b8cad3" /><stop offset="0.4" stopColor="#d6dddb" /><stop offset="1" stopColor="#efe8d6" />
        </linearGradient>
        <radialGradient id="stdSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffdf2" /><stop offset="0.12" stopColor="#fff8e2" stopOpacity={0.8} /><stop offset="0.5" stopColor="#fbf1d8" stopOpacity={0.32} /><stop offset="1" stopColor="#f6ecd4" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#stdSky)" />
      <circle cx={SUN.x} cy={SUN.y} r={720} fill="url(#stdSun)" />
      {towers}
      {/* a construction crane on one far tower */}
      <g stroke="#a9b6bc" fill="none">
        <path d="M 905 330 L 905 205" strokeWidth={7} />
        <path d="M 820 212 L 1060 212" strokeWidth={6} />
        <path d="M 905 206 L 990 213 M 905 206 L 840 213" strokeWidth={3} />
        <path d="M 1030 212 L 1030 262" strokeWidth={2} />
      </g>
      <circle cx={SUN.x} cy={SUN.y} r={330} fill="url(#stdSun)" opacity={0.55} />
      <circle cx={SUN.x} cy={SUN.y} r={74} fill="#fff9e8" opacity={0.7} />
      <circle cx={SUN.x} cy={SUN.y} r={44} fill="#ffffff" />
      {/* horizon haze band */}
      <rect x={0} y={760} width={W} height={200} fill={HAZE} opacity={0.55} />
    </g>
  );
};

/* ------------------------------ band: road, far street, piers ------------------------------ */
export const DayRoad: React.FC = () => {
  const YH = D.YH;
  const roadEdge = 6;
  const far: React.ReactNode[] = [];
  // far street: low shophouses and trees flanking the road beyond the bridge (hazy)
  const rr = rng(11);
  for (let side = -1; side <= 1; side += 2) {
    let z = 30;
    let i = 0;
    while (z < 420) {
      const len = 9 + rr() * 14, h = 7 + rr() * 9, x0 = side * 8.5, x1 = side * (8.5 + 10);
      const z1 = z + len;
      const c = haze('#9c968b', z, 70), cs = haze('#7d786f', z, 70);
      far.push(
        <g key={`${side}-${i}`}>
          {/* street-facing facade (trapezoid), front gable face */}
          <polygon points={`${pt(x0, 0, z)} ${pt(x0, h, z)} ${pt(x0, h, z1)} ${pt(x0, 0, z1)}`} fill={side < 0 ? cs : c} />
          <polygon points={`${pt(x0, 0, z)} ${pt(x0, h, z)} ${pt(x1, h, z)} ${pt(x1, 0, z)}`} fill={side < 0 ? c : cs} />
          <polygon points={`${pt(x0, h * 0.42, z)} ${pt(x0, h * 0.48, z)} ${pt(x0, h * 0.48, z1)} ${pt(x0, h * 0.42, z1)}`} fill={haze('#5d5850', z, 70)} />
        </g>,
      );
      // street tree in front of every other block
      if (i % 2 === 0) {
        const [tx, ty] = pj(side * 7.4, 0, z + 3), s = sc(z + 3);
        far.push(
          <g key={`t${side}-${i}`} fill={haze('#4d5a49', z, 60)}>
            <rect x={tx - 0.15 * s} y={ty - 3 * s} width={0.3 * s} height={3 * s} />
            <ellipse cx={tx} cy={ty - 4.4 * s} rx={2.2 * s} ry={1.8 * s} />
            <ellipse cx={tx + side * 1.1 * s} cy={ty - 3.7 * s} rx={1.6 * s} ry={1.3 * s} />
          </g>,
        );
      }
      z = z1 + 1 + rr() * 4;
      i++;
    }
  }
  const dash = (X: number, key: string, col: string, z0: number, z1: number) => {
    const out: React.ReactNode[] = [];
    for (let z = z0; z < z1; z += 9) {
      const a = Math.max(z, z0), b = Math.min(z + 3.2, z1);
      out.push(<polygon key={`${key}${z}`} points={`${pt(X - 0.08, 0, a)} ${pt(X + 0.08, 0, a)} ${pt(X + 0.08, 0, b)} ${pt(X - 0.08, 0, b)}`} fill={col} />);
    }
    return out;
  };
  const [, ySh] = pj(0, 0, SHADE_Z);
  // pier diagonal shadows (long, toward camera and right), from the pier base under the deck
  const pierShadow = (X: number) => {
    const hw = BR.pierW / 2, hgt = BR.under;
    const a = [X - hw, BR.z0], b = [X + hw, BR.z0];
    const ta = [X - hw + SUN.dX * hgt, BR.z0 - SUN.dZ * hgt], tb = [X + hw + SUN.dX * hgt, BR.z0 - SUN.dZ * hgt];
    return `${pt(a[0], 0, a[1])} ${pt(b[0], 0, b[1] + 1.6)} ${pt(tb[0], 0, Math.max(3, tb[1]))} ${pt(ta[0], 0, Math.max(3, ta[1]))}`;
  };
  const pier = (X: number) => {
    const hw = BR.pierW / 2, inner = X > 0 ? X - hw : X + hw, outer = X > 0 ? X + hw : X - hw;
    return (
      <g key={`p${X}`}>
        {/* inner side face (faces the road) */}
        <polygon points={`${pt(inner, 0, BR.z0)} ${pt(inner, BR.under, BR.z0)} ${pt(inner, BR.under, BR.z0 + BR.pierW)} ${pt(inner, 0, BR.z0 + BR.pierW)}`} fill="#57544f" />
        {/* front face */}
        <polygon points={`${pt(inner, 0, BR.z0)} ${pt(inner, BR.under, BR.z0)} ${pt(outer, BR.under, BR.z0)} ${pt(outer, 0, BR.z0)}`} fill="#66635d" />
        {/* pier cap widening under the deck */}
        <polygon points={`${pt(inner - Math.sign(X) * 0.5, BR.under, BR.z0)} ${pt(inner, BR.under - 1.1, BR.z0)} ${pt(outer, BR.under - 1.1, BR.z0)} ${pt(outer + Math.sign(X) * 0.5, BR.under, BR.z0)}`} fill="#5f5c56" />
        {/* thin sun rim on the left edge */}
        <polygon points={`${pt(X - hw, 0, BR.z0)} ${pt(X - hw, BR.under - 1.1, BR.z0)} ${pt(X - hw + 0.1, BR.under - 1.1, BR.z0)} ${pt(X - hw + 0.1, 0, BR.z0)}`} fill="#efe4c8" opacity={0.7} />
      </g>
    );
  };
  return (
    <g>
      <defs>
        <linearGradient id="stdRoad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={HAZE} /><stop offset={(60 / (H - YH)).toFixed(3)} stopColor="#c8c3b8" /><stop offset={((ySh - YH) / (H - YH)).toFixed(3)} stopColor="#8f8a81" /><stop offset="1" stopColor="#77736c" />
        </linearGradient>
        <linearGradient id="stdShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c4a48" /><stop offset="0.5" stopColor="#43454a" /><stop offset="1" stopColor="#363a41" />
        </linearGradient>
      </defs>
      {/* ground: road + sidewalks to the horizon */}
      <rect x={0} y={YH} width={W} height={H - YH} fill="url(#stdRoad)" />
      {/* sidewalks beyond the road edges (slightly lighter concrete), curbs */}
      <polygon points={`${pt(roadEdge, 0, 3.5)} ${pt(roadEdge, 0, 500)} ${pt(60, 0, 500)} ${pt(60, 0, 3.5)}`} fill={mix('#b8b2a6', HAZE, 0.25)} />
      <polygon points={`${pt(-roadEdge, 0, 3.5)} ${pt(-roadEdge, 0, 500)} ${pt(-60, 0, 500)} ${pt(-60, 0, 3.5)}`} fill={mix('#a39d92', HAZE, 0.25)} />
      <polygon points={`${pt(roadEdge, 0, 3.5)} ${pt(roadEdge, 0, 500)} ${pt(roadEdge + 0.2, 0, 500)} ${pt(roadEdge + 0.2, 0, 3.5)}`} fill="#dcd6c8" />
      <polygon points={`${pt(-roadEdge, 0, 3.5)} ${pt(-roadEdge, 0, 500)} ${pt(-roadEdge - 0.2, 0, 500)} ${pt(-roadEdge - 0.2, 0, 3.5)}`} fill="#dcd6c8" />
      {far}
      {/* lane markings: centre line solid, lane dividers dashed */}
      <polygon points={`${pt(-0.1, 0, 3.5)} ${pt(0.1, 0, 3.5)} ${pt(0.1, 0, 400)} ${pt(-0.1, 0, 400)}`} fill="#e9e3d2" opacity={0.85} />
      {dash(-3, 'l', '#e9e3d2', 4, 300)}
      {dash(3, 'r', '#e9e3d2', 8, 300)}
      {/* long shadow of the viaduct over the near road (low sun behind the bridge) */}
      <rect x={0} y={ySh} width={W} height={H - ySh} fill="url(#stdShade)" opacity={0.86} />
      <polygon points={pierShadow(-BR.pierX)} fill="#3b3936" opacity={0.6} />
      <polygon points={pierShadow(BR.pierX)} fill="#3b3936" opacity={0.6} />
      {pier(-BR.pierX)}
      {pier(BR.pierX)}
    </g>
  );
};

/* ------------------------------------- live: viaduct deck ------------------------------------- */
/** Deck front face, parapet and underside (drawn over the train so the parapet hides its wheels). */
export const Deck: React.FC = () => {
  const [, yTop] = pj(0, BR.top, BR.z0), [, yRail] = pj(0, BR.rail - 0.1, BR.z0), [, yU] = pj(0, BR.under, BR.z0), [, yU2] = pj(0, BR.under, BR.z1);
  return (
    <g>
      <defs>
        <linearGradient id="stdDeck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#77736c" /><stop offset="1" stopColor="#625f59" /></linearGradient>
      </defs>
      {/* underside seen from below, darker */}
      <rect x={-200} y={yU} width={W + 400} height={yU2 - yU} fill="#4d4a46" />
      {/* box girder face */}
      <rect x={-200} y={yRail} width={W + 400} height={yU - yRail} fill="url(#stdDeck)" />
      {/* parapet (slightly set back, lighter band) */}
      <rect x={-200} y={yTop} width={W + 400} height={yRail - yTop} fill="#6c6963" />
      <rect x={-200} y={yRail - 3} width={W + 400} height={6} fill="#56534e" />
      {/* sun rim on the top edge */}
      <rect x={-200} y={yTop - 2} width={W + 400} height={4} fill="#f3e8cc" opacity={0.85} />
      {/* expansion joints + a drain pipe */}
      {[-14, 14].map((X) => { const [x] = pj(X, 0, BR.z0); return <rect key={X} x={x - 2} y={yTop} width={4} height={yU - yTop} fill="#55524d" />; })}
      <rect x={pj(-4.2, 0, BR.z0)[0]} y={yRail + 8} width={8} height={yU - yRail} fill="#56534e" />
    </g>
  );
};

/* -------------------------------- live: catenary + commuter train -------------------------------- */
export const Catenary: React.FC = () => {
  const zM = 21.5, [, yWire] = pj(0, 13.3, BR.track), [, yMess] = pj(0, 14.2, BR.track);
  const mast = (X: number) => {
    const [x, yb] = pj(X, BR.rail, zM), [, yt] = pj(X, 14.8, zM), [xa] = pj(X - 4.5, 0, BR.track);
    return (
      <g key={X} fill="#4a4c50" stroke="#4a4c50">
        <rect x={x - 5} y={yt} width={10} height={yb - yt} stroke="none" />
        <path d={`M ${x} ${yt + 14} L ${xa} ${yMess + 2} M ${x} ${yt + 44} L ${xa} ${yWire + 4}`} strokeWidth={4} fill="none" />
      </g>
    );
  };
  return (
    <g>
      {mast(-5)}
      {mast(17)}
      <path d={`M -200 ${yMess} L ${W + 200} ${yMess}`} stroke="#43464b" strokeWidth={2.4} />
      <path d={`M -200 ${yWire} L ${W + 200} ${yWire}`} stroke="#43464b" strokeWidth={2.4} />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M ${-120 + i * 100} ${yMess} L ${-120 + i * 100} ${yWire}`} stroke="#4f5257" strokeWidth={1.4} />)}
    </g>
  );
};

/** commuter train sliding left on the near track. head = X (metres) of the leading nose. */
export const Train: React.FC<{ head: number }> = ({ head }) => {
  const Z = BR.track, s = sc(Z);
  const L = 20, gap = 1.1, N = 7;
  const yb = pj(0, 9.0, Z)[1], yr = pj(0, 12.0, Z)[1], ywT = pj(0, 11.45, Z)[1], ywB = pj(0, 10.15, Z)[1];
  const cars: React.ReactNode[] = [];
  const r = rng(31);
  const heads = Array.from({ length: N * 26 }, () => r());
  for (let c = 0; c < N; c++) {
    const x0 = pj(head + c * (L + gap), 0, Z)[0], x1 = x0 + L * s;
    if (x1 < -100 || x0 > W + 100) continue;
    const nose = c === 0, tail = c === N - 1;
    const body = nose
      ? `M ${x0 + 1.6 * s} ${yr} L ${x1} ${yr} L ${x1} ${yb} L ${x0 + 0.1 * s} ${yb} L ${x0} ${yb - 0.6 * s} L ${x0 + 0.5 * s} ${ywT + 0.1 * s} Q ${x0 + 0.9 * s} ${yr + 0.1 * s} ${x0 + 1.6 * s} ${yr} Z`
      : tail
        ? `M ${x0} ${yr} L ${x1 - 1.6 * s} ${yr} Q ${x1 - 0.9 * s} ${yr + 0.1 * s} ${x1 - 0.5 * s} ${ywT + 0.1 * s} L ${x1} ${yb - 0.6 * s} L ${x1 - 0.1 * s} ${yb} L ${x0} ${yb} Z`
        : `M ${x0} ${yr + 0.12 * s} Q ${x0} ${yr} ${x0 + 0.3 * s} ${yr} L ${x1 - 0.3 * s} ${yr} Q ${x1} ${yr} ${x1} ${yr + 0.12 * s} L ${x1} ${yb} L ${x0} ${yb} Z`;
    const wins: React.ReactNode[] = [];
    // 4 doors per car, window panes between them; panes show the bright sky through the car
    for (let d = 0; d < 4; d++) {
      const dx = x0 + (2.2 + d * 5.2) * s;
      wins.push(<rect key={`d${d}`} x={dx} y={ywT - 0.1 * s} width={1.3 * s} height={yb - ywT - 0.1 * s} fill="#3a3e45" />);
      wins.push(<rect key={`dw${d}`} x={dx + 0.18 * s} y={ywT} width={0.38 * s} height={(ywB - ywT) * 0.9} fill="#d9dbd4" />);
      wins.push(<rect key={`dw2${d}`} x={dx + 0.74 * s} y={ywT} width={0.38 * s} height={(ywB - ywT) * 0.9} fill="#d9dbd4" />);
      if (d < 3) wins.push(<rect key={`w${d}`} x={dx + 1.65 * s} y={ywT} width={3.2 * s} height={ywB - ywT} rx={0.12 * s} fill="#e3e3db" />);
    }
    // packed standing passengers: heads + shoulders against the window light
    const pax: React.ReactNode[] = [];
    for (let k = 0; k < 26; k++) {
      const u = heads[c * 26 + k];
      const px = x0 + (2.3 + k * 0.62 + u * 0.3) * s;
      if (nose && px < x0 + 1.4 * s) continue;
      if (px > x1 - 1 * s) continue;
      const hy = ywT + (0.32 + u * 0.18) * s;
      pax.push(<g key={k}><ellipse cx={px} cy={hy} rx={0.12 * s} ry={0.15 * s} /><path d={`M ${px - 0.26 * s} ${ywB} Q ${px - 0.24 * s} ${hy + 0.2 * s} ${px} ${hy + 0.18 * s} Q ${px + 0.24 * s} ${hy + 0.2 * s} ${px + 0.26 * s} ${ywB} Z`} /></g>);
    }
    const panto = c % 2 === 1 ? (() => {
      const px = x0 + 7 * s, [, yW] = pj(0, 13.3, Z);
      return <g stroke="#2f3237" strokeWidth={3.2} fill="none"><path d={`M ${px - 0.9 * s} ${yr} L ${px + 0.2 * s} ${(yr + yW) / 2} L ${px - 0.6 * s} ${yW} M ${px + 0.9 * s} ${yr} L ${px + 0.2 * s} ${(yr + yW) / 2}`} /><path d={`M ${px - 1.2 * s} ${yW} L ${px + 0.2 * s} ${yW}`} strokeWidth={4} /></g>;
    })() : null;
    cars.push(
      <g key={c}>
        {panto}
        {/* roof equipment boxes */}
        <rect x={x0 + 3.4 * s} y={yr - 0.28 * s} width={3 * s} height={0.3 * s} rx={0.08 * s} fill="#3f4349" />
        <rect x={x0 + 12.6 * s} y={yr - 0.28 * s} width={3 * s} height={0.3 * s} rx={0.08 * s} fill="#3f4349" />
        <path d={body} fill="#474c54" />
        {/* lower body slightly darker (skirt) */}
        <rect x={x0 + (nose ? 0.2 * s : 0)} y={ywB + 0.55 * s} width={L * s - (nose || tail ? 0.2 * s : 0)} height={yb - ywB - 0.55 * s} fill="#3e434a" />
        {/* livery stripe, muted (no branding) */}
        <rect x={x0 + (nose ? 0.15 * s : 0)} y={ywB + 0.2 * s} width={L * s - (nose || tail ? 0.15 * s : 0)} height={0.16 * s} fill="#8a5a4a" opacity={0.85} />
        {wins}
        <g fill="#3d4148">{pax}</g>
        {nose && <path d={`M ${x0 + 0.62 * s} ${ywT + 0.05 * s} Q ${x0 + 0.95 * s} ${yr + 0.3 * s} ${x0 + 1.6 * s} ${yr + 0.28 * s} L ${x0 + 1.7 * s} ${ywB - 0.1 * s} L ${x0 + 0.35 * s} ${ywB - 0.1 * s} Z`} fill="#d0d3cd" />}
        {nose && <circle cx={x0 + 0.35 * s} cy={yb - 0.75 * s} r={0.14 * s} fill="#fff6dc" />}
        {/* roof rim from the low sun behind */}
        <path d={nose ? `M ${x0 + 0.9 * s} ${yr + 0.12 * s} Q ${x0 + 1.1 * s} ${yr} ${x0 + 1.6 * s} ${yr} L ${x1} ${yr}` : `M ${x0 + 0.1 * s} ${yr + 0.05 * s} L ${x1 - 0.1 * s} ${yr + 0.05 * s}`} stroke="#fff3d6" strokeWidth={3} fill="none" />
      </g>,
    );
  }
  return <g>{cars}</g>;
};

/* ---------------------------------------- live: motorbikes ---------------------------------------- */
type Bike = { X: number; z0: number; v: number; away: boolean; pax: boolean; tone: number };
const rb = rng(21);
export const BIKES: Bike[] = [];
for (let row = 0; row < 72; row++) {
  for (let k = 0; k < 6; k++) {
    const away = k < 3;
    const lane = away ? -5.0 + (k % 3) * 1.85 : 1.25 + (k % 3) * 1.85;
    BIKES.push({ X: lane + (rb() - 0.5) * 0.9, z0: 3 + row * 2.2 + rb() * 1.4, v: (away ? 5.4 : 4.8) * (0.96 + rb() * 0.08), away, pax: rb() < 0.22, tone: rb() });
  }
}
const ZMIN = 2.8, ZSPAN = 160;
const BODY = 'M -0.07,0 L 0.07,0 L 0.08,-0.42 L 0.2,-0.46 L 0.28,-0.58 L 0.29,-0.8 L 0.21,-0.85 L 0.25,-1.26 Q 0.21,-1.34 0.1,-1.35 L -0.1,-1.35 Q -0.21,-1.34 -0.25,-1.26 L -0.21,-0.85 L -0.29,-0.8 L -0.28,-0.58 L -0.2,-0.46 L -0.08,-0.42 Z';
const ARMS = 'M 0.2,-1.24 L 0.37,-1.0 M -0.2,-1.24 L -0.37,-1.0';
const MIRR = 'M 0.33,-1.02 L 0.37,-1.26 M -0.33,-1.02 L -0.37,-1.26';

export const Bikes: React.FC<{ t: number }> = ({ t }) => {
  const list = BIKES.map((b) => {
    const span = b.away ? b.v * t : -b.v * t;
    const z = ZMIN + ((((b.z0 - ZMIN + span) % ZSPAN) + ZSPAN) % ZSPAN);
    return { b, z };
  }).filter((o) => o.z < 150).sort((a, c) => c.z - a.z);
  const shadows: React.ReactNode[] = [];
  const bikes: React.ReactNode[] = [];
  for (const { b, z } of list) {
    const s = sc(z);
    if (s < 7) continue;
    const [x, y] = pj(b.X, 0, z);
    const lit = z > SHADE_Z;
    const shadeK = lit ? 0 : 1;
    const base = mix(mix('#3b4047', '#2b3036', b.tone), '#23272d', shadeK * 0.6);
    const col = haze(base, z, 60);
    const helm = haze(mix(base, b.tone > 0.82 ? '#9a9c9a' : b.tone > 0.7 ? '#6e3f38' : base, lit ? 0.9 : 0.45), z, 60);
    const fade = z > 120 ? 1 - (z - 120) / 30 : 1;
    if (lit && s > 9) {
      const tip = 1.45;
      shadows.push(<polygon key={`s${b.X}${b.z0}`} points={`${pt(b.X - 0.25, 0, z)} ${pt(b.X + 0.25, 0, z)} ${pt(b.X + SUN.dX * tip + 0.15, 0, Math.max(SHADE_Z, z - SUN.dZ * tip))} ${pt(b.X + SUN.dX * tip - 0.15, 0, Math.max(SHADE_Z, z - SUN.dZ * tip))}`} />);
    }
    const detail = s > 22;
    bikes.push(
      <g key={`${b.X}${b.z0}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})`} opacity={fade}>
        {b.pax && <g fill={col}><ellipse cx={0.08} cy={-1.52} rx={0.14} ry={0.15} /><path d="M -0.14,-1.0 L -0.18,-1.3 Q 0.08,-1.42 0.3,-1.3 L 0.26,-1.0 Z" /></g>}
        <path d={BODY} fill={col} />
        {detail && <path d={ARMS} stroke={col} strokeWidth={0.1} strokeLinecap="round" fill="none" />}
        {detail && <path d={MIRR} stroke={col} strokeWidth={0.035} fill="none" />}
        <ellipse cx={0} cy={-1.47} rx={0.155} ry={0.165} fill={helm} />
        {b.away
          ? <rect x={-0.07} y={-0.66} width={0.14} height={0.05} fill={haze('#d6473b', z, 90)} />
          : <g><circle cx={0} cy={-0.74} r={0.05} fill="#fff6dc" />{detail && <circle cx={0} cy={-0.74} r={0.16} fill="#fff6dc" opacity={0.22} />}</g>}
        {lit && detail && <path d="M -0.15,-1.45 Q -0.14,-1.62 0.02,-1.635 M -0.25,-1.24 L -0.21,-0.86" stroke="#fff1cf" strokeWidth={0.035} fill="none" opacity={0.85 * (1 - z / 150)} />}
      </g>,
    );
  }
  return (
    <g>
      <g fill="#2a2018" opacity={0.3}>{shadows}</g>
      {bikes}
    </g>
  );
};

/* -------------------------------------- live: foreground wires -------------------------------------- */
export const DayWires: React.FC = () => (
  <g stroke="#3a4048" fill="none" strokeLinecap="round">
    <path d="M -60 96 Q 560 250 1360 330" strokeWidth={5} />
    <path d="M -60 128 Q 600 292 1360 372" strokeWidth={3.5} />
  </g>
);
