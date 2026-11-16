import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { rng } from '../art/world';
import { HZ, TruckFront, Headlights, LightDefs, TinyTruck, Soldier } from '../art/desert_art';

/** deterministic shake (camera, on ones) */
const shake = (t: number, a: number) => ({ tx: a * (Math.sin(t * 53) * 0.6 + Math.sin(t * 31 + 1) * 0.4), ty: a * (Math.sin(t * 47 + 2) * 0.6 + Math.sin(t * 29) * 0.4) });
/** soft dust puff */
const Puff: React.FC<{ x: number; y: number; rx: number; ry: number; lit?: boolean; o?: number }> = ({ x, y, rx, ry, lit, o = 1 }) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${lit ? 'dustL' : 'dustG'})`} opacity={o} />;

/** shot 1 — HOOK, night: an endless column of armoured trucks rolls toward camera, headlight beams cutting through glowing dust; on the nearest truck (left third) a young soldier holds the side rail; the first crack glows through the sand on "man". Slow push-in. */
export const S01: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tm = wordAt(1, /^man/i, 0.75);
  const cam: Cam = { zoom: 1.12 + 0.06 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: -200, ox: 600, oy: 1100 };
  const A: [number, number] = [700, HZ.night + 4], B: [number, number] = [1180, 1920];
  const trucks = Array.from({ length: 14 }).map((_, i) => { const u = ((i / 14) + t * 0.035) % 1; return { u, i }; }).filter((q) => q.u < 0.88).sort((a, b) => a.u - b.u);
  const crack = ramp(t, tm, tm + 0.45, (n) => n);
  const crackD = "M360 1700 L450 1685 L520 1720 L600 1690 L680 1725 L760 1700 L840 1740 L930 1712 L1010 1748 L1100 1724 L1200 1760";
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="desert/night" k={0.9} cam={cam} />
      <Live k={0.95} cam={cam}>
        <LightDefs />
        {trucks.map(({ u, i }) => {
          const x = A[0] + (B[0] - A[0]) * u * u, y = A[1] + (B[1] - A[1]) * u * u; const s = 0.04 + 0.85 * u * u;
          const bounce = Math.sin(t * 9 + i * 1.7) * 3 * s;
          return <g key={i}>
            <Puff x={x - 40 * s} y={y - 120 * s} rx={420 * s} ry={170 * s} lit o={0.55} />
            {s > 0.1 && <TruckFront x={x} y={y} s={s} bounce={bounce} col="#2e2a22" rim={0.35 + 0.5 * (1 - u)} />}
            <Headlights x={x} y={y - 95 * s + bounce} s={s} beam={s > 0.08 ? [x - 260 * s, y + 520 * s] : undefined} />
          </g>;
        })}
        {crack > 0 && <g>
          <path d={crackD} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - crack} stroke="#fff3d0" strokeOpacity={0.25} strokeWidth={18} fill="none" />
          <path d={crackD} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - crack} stroke="#0a0806" strokeWidth={6} fill="none" />
          <path d={crackD} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - crack} stroke="#fff3d0" strokeOpacity={0.6} strokeWidth={1.5} fill="none" transform="translate(0 4)" />
        </g>}
      </Live>
      <Live k={1.2} cam={cam}>
        {/* the nearest truck's armoured flank fills the left third; the soldier on its side step */}
        <g transform={`translate(0 ${Math.sin(t * 9) * 4})`}>
          <path d="M-220 900 L420 990 L440 1840 L-220 1900 Z" fill="#1e1b16" />
          <path d="M-220 960 L420 1040 L425 1100 L-220 1030 Z" fill="#2c2820" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-150 + i * 140} ${1080 + i * 14} L${-150 + i * 140} ${1780 - i * 6}`} stroke="#120f0c" strokeWidth={6} />)}
          <path d="M420 990 L440 1840" stroke="#fff3d0" strokeOpacity={0.7} strokeWidth={5} />
          <path d="M-220 900 L420 990" stroke="#fff3d0" strokeOpacity={0.5} strokeWidth={4} />
          <rect x={300} y={1220} width={150} height={10} fill="#4a443a" />
          <rect x={442} y={1215} width={8} height={40} fill="#4a443a" />
          <circle cx={110} cy={1850} r={150} fill="#0a0908" /><circle cx={110} cy={1850} r={60} fill="#1e1c18" /><path d="M-40 1850 A150 150 0 0 1 260 1850" stroke="#fff3d0" strokeOpacity={0.35} strokeWidth={4} fill="none" />
          <rect x={150} y={1800} width={300} height={18} fill="#2a2620" />
          <defs><radialGradient id="dsDash" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc880" stopOpacity={0.35} /><stop offset="1" stopColor="#ffc880" stopOpacity={0} /></radialGradient></defs><ellipse cx={280} cy={1200} rx={170} ry={140} fill="url(#dsDash)" />
          <Soldier x={330} y={1800} h={700} br={t2 * 2.4} bob={Math.sin(t2 * 9) * 3} />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 2 — night, extreme wide: the plain caves in under the column; headlights tilt and sink into a vast pit as a wall of dust rises and swallows them (starts on "swallowed"). Small shake. */
export const S02: React.FC = () => {
  const { t } = useShot();
  const ts = wordAt(2, /^swallowed/i, 0.42);
  const c = ramp(t, ts - 0.05, ts + 0.55, (n) => 1 - (1 - n) * (1 - n)); // collapse progress (fast start)
  const sh = shake(t, 3 + 14 * c);
  const cam: Cam = { zoom: 1.08, dx: 0, dy: 0, tx: sh.tx, ty: sh.ty, ox: 540, oy: 1100 };
  const cx = 640, cy = 1330;
  const lights = Array.from({ length: 22 }).map((_, i) => { const k = i / 21; return { x: 120 + k * 1060, y: 1240 + Math.sin(k * 3) * 30 + k * 160, s: 0.18 + k * 0.25, i }; });
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="desert/night" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <LightDefs />
        {/* the pit opening */}
        <ellipse cx={cx} cy={cy + 20} rx={40 + 760 * c} ry={14 + 250 * c} fill="#0a0806" opacity={Math.min(1, c * 2)} />
        <ellipse cx={cx} cy={cy + 20 + 40 * c} rx={20 + 600 * c} ry={8 + 180 * c} fill="#000" opacity={c} />
        <path d={`M${cx - 40 - 760 * c} ${cy + 20} A${40 + 760 * c} ${14 + 250 * c} 0 0 0 ${cx + 40 + 760 * c} ${cy + 20}`} stroke="#5a4a38" strokeWidth={6} fill="none" opacity={c} />
        {lights.map((q) => {
          const inPit = Math.abs(q.x - cx) / (40 + 760 * c) < 1;
          const sink = inPit ? c : 0;
          return <Headlights key={q.i} x={q.x + (cx - q.x) * 0.15 * sink} y={q.y + 160 * sink * sink} s={q.s} a={1 - 0.9 * sink} tilt={(q.x < cx ? -1 : 1) * 35 * sink} />;
        })}
        {/* the wall of dust rising from the rim, lit from within */}
        {Array.from({ length: 14 }).map((_, i) => { const a = (i / 14) * Math.PI * 2; const rx = 40 + 760 * c, ry = 14 + 250 * c; const x = cx + Math.cos(a) * rx * 0.9, y = cy + Math.sin(a) * ry * 0.9; return <Puff key={i} x={x} y={y - 260 * c} rx={170 + 220 * c} ry={160 + 420 * c} lit={i % 2 === 0} o={c * 0.9} />; })}
        <Puff x={cx} y={cy - 300 * c} rx={500 * c + 10} ry={420 * c + 10} lit o={c * 0.7} />
        {t < ts && [0, 1, 2].map((i) => <Puff key={`w${i}`} x={300 + i * 330} y={1300} rx={120} ry={40} o={0.4} />)}
      </Live>
    </AbsoluteFill>
  );
};

/** S-curve of the column across the desert (world), s 0 = foreground, 1 = horizon */
const colPt = (s: number): [number, number] => {
  const p0 = [220, 2350], p1 = [1200, 1900], p2 = [-200, 1350], p3 = [780, HZ.day + 6];
  const a = (1 - s) ** 3, b = 3 * s * (1 - s) ** 2, c = 3 * s * s * (1 - s), d = s ** 3;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};

/** shot 9 — day, extreme wide: the plain column snakes across the desert to the horizon, separate vehicles with gaps, a long dust plume drifting sideways, heat shimmer; full length revealed on "horizon". High slow drift. */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const tt = wordAt(9, /^trucks/i, 0.21), th = wordAt(9, /^horizon/i, 0.8);
  const out = ramp(t, tt, th, EIO);
  const cam: Cam = { zoom: 1.5 - 0.5 * out, dx: 0, dy: 0, ty: -120 * (1 - out) + 30 * p, ox: 400, oy: 1700 };
  const N = 24;
  return (
    <AbsoluteFill style={{ backgroundColor: '#f1e6cc' }}>
      <BandImg id="desert/day" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <LightDefs />
        <path d={Array.from({ length: 61 }).map((_, i) => { const [x, y] = colPt(i / 60); return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ')} stroke="#c9b08a" strokeWidth={14} fill="none" opacity={0.45} />
        <defs><radialGradient id="dsPlume" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#b89a6a" stopOpacity={0.45} /><stop offset="1" stopColor="#b89a6a" stopOpacity={0} /></radialGradient></defs>
        {/* the dust plume drifting sideways off the column */}
        {Array.from({ length: 30 }).map((_, i) => { const s = i / 29; const [x, y] = colPt(s); const k = 1 - s; return <ellipse key={`d${i}`} cx={x + 90 + 160 * k + t * 12} cy={y - 40 - 70 * k} rx={160 + 260 * k} ry={40 + 70 * k} fill="url(#dsPlume)" />; })}
        {Array.from({ length: N }).map((_, i) => {
          const s = ((i / N) + t * 0.006) % 1; const [x, y] = colPt(s); const [x2, y2] = colPt(Math.max(0, s - 0.004));
          const ang = (Math.atan2(y - y2, x - x2) * 180) / Math.PI; const k = 1 - s; const sc = 0.22 + 2.6 * Math.pow(k, 2.2);
          return <g key={i}><ellipse cx={x + 6 * sc} cy={y + 10 * sc} rx={26 * sc} ry={9 * sc} fill="#6a5438" opacity={0.3} /><TinyTruck x={x} y={y} s={sc} ang={ang} col={i % 3 ? '#8a7a5a' : '#6a6450'} /><ellipse cx={x2 - (x - x2) * 4} cy={y2 - (y - y2) * 4 - 8 * sc} rx={34 * sc} ry={12 * sc} fill="url(#dustL)" opacity={0.85} /></g>;
        })}
        {/* heat shimmer near the horizon */}
        {Array.from({ length: 6 }).map((_, i) => { const k = ((t * 0.15 + i / 6) % 1); const y = HZ.day + 120 - k * 110; return <path key={`h${i}`} d={`M-100 ${y} Q300 ${y - 6 + Math.sin(t * 3 + i) * 5} 650 ${y} T1400 ${y}`} stroke="#fff8e8" strokeWidth={8} strokeOpacity={0.18 * Math.sin(k * Math.PI)} fill="none" />; })}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — dusk, extreme wide: the tiny column crawls into a perfectly flat pale plain ringed by low hills; glowing dust, long shadows, a bird; the ground shivers on "swallow". Upper frame calm for the quote. Very slow push-in. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const tw = wordAt(10, /^swallow/i, 0.91);
  const cam: Cam = { zoom: 1.02 + 0.08 * ramp(p, 0, 1, (n) => n), dx: 0, dy: 0, ox: 540, oy: 1300 };
  const shiver = t >= tw ? Math.exp(-(t - tw) * 3) : 0;
  const r = rng(9);
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a2238' }}>
      <BandImg id="desert/dusk" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <LightDefs />
        {Array.from({ length: 34 }).map((_, i) => {
          const x = 120 + i * 17 + t * 9, y = 1330 + i * 1.5 + Math.sin(i * 0.4) * 6;
          return <g key={i}>
            <path d={`M${x} ${y} L${x - 60} ${y + 8}`} stroke="#4a3a42" strokeWidth={4} opacity={0.45} />
            <TinyTruck x={x} y={y} s={0.35} ang={4} col="#4a3e38" />
            {i % 3 === 0 && <ellipse cx={x - 20} cy={y - 8} rx={30} ry={10} fill="url(#dustL)" opacity={0.7 + 0.2 * Math.sin(t + i)} />}
          </g>;
        })}
        <ellipse cx={420} cy={1310} rx={520} ry={70} fill="url(#dustL)" opacity={0.45} />
        {shiver > 0.01 && <ellipse cx={420} cy={1340} rx={420 + 200 * (1 - shiver)} ry={40 + 30 * (1 - shiver)} fill="none" stroke="#f0dcb0" strokeOpacity={0.5 * shiver} strokeWidth={6} />}
        {Array.from({ length: 3 }).map((_, i) => { const x = 900 - t * (40 + i * 8) + (shiver > 0 ? -(t - tw) * 120 : 0), y = 1050 + i * 30 + Math.sin(t * 0.8 + i) * 10 - (shiver > 0 ? (t - tw) * 60 : 0); const w = Math.sin(t * 9 + i) * 6; return <path key={i} d={`M${x - 14} ${y + w} Q${x - 6} ${y - 4} ${x} ${y} Q${x + 6} ${y - 4} ${x + 14} ${y + w}`} stroke="#1e1628" strokeWidth={2.5} fill="none" />; })}
        {Array.from({ length: 20 }).map((_, i) => <circle key={`m${i}`} cx={r() * 1296 + t * 6} cy={1250 + r() * 400} r={1.5 + r() * 2} fill="#ffd8a0" opacity={0.3 + 0.2 * Math.sin(t + i)} />)}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 12 — day, extreme wide: the plain splits open in a huge ring around the column on "opened"; trucks tilt and slide into the sinking ground amid towering dust. Heavy shake. No people. */
export const S12: React.FC = () => {
  const { t } = useShot();
  const to = wordAt(12, /^opened/i, 0.48);
  const c = ramp(t, to, to + 0.55, (n) => 1 - (1 - n) * (1 - n));
  const sh = shake(t, 4 + 22 * c);
  const cam: Cam = { zoom: 1.1, dx: 0, dy: 0, tx: sh.tx, ty: sh.ty, ox: 540, oy: 1300 };
  const cx = 648, cy = 1420, RX = 640, RY = 210;
  const N = 26;
  return (
    <AbsoluteFill style={{ backgroundColor: '#f1e6cc' }}>
      <BandImg id="desert/day" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <LightDefs />
        {/* the inner disc sinks: darker, shaded wall appears along the far rim */}
        {c > 0 && <g>
          <ellipse cx={cx} cy={cy} rx={RX} ry={RY} fill="#3a2a1c" opacity={Math.min(1, c * 1.5)} />
          <ellipse cx={cx} cy={cy + 90 * c} rx={RX * (1 - 0.06 * c)} ry={RY * (1 - 0.06 * c)} fill="#b8986a" />
          <ellipse cx={cx} cy={cy + 90 * c} rx={RX * (1 - 0.06 * c)} ry={RY * (1 - 0.06 * c)} fill="#5a4430" opacity={0.35 * c} />
          <path d={`M${cx - RX} ${cy} A${RX} ${RY} 0 0 1 ${cx + RX} ${cy}`} stroke="#2a1c10" strokeWidth={10} fill="none" />
        </g>}
        {/* ring crack before the drop */}
        {t > to - 0.1 && <ellipse cx={cx} cy={cy} rx={RX} ry={RY} fill="none" stroke="#2a1c10" strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01((t - to + 0.1) / 0.25)} />}
        {Array.from({ length: N }).map((_, i) => {
          const k = i / (N - 1); const x0 = cx - RX * 0.85 + k * RX * 1.7, y0 = cy + Math.sin(k * 3.1) * 20;
          const slide = c * (x0 < cx ? 1 : -1) * 60 * (1 - Math.abs(k - 0.5));
          return <TinyTruck key={i} x={x0 + slide} y={y0 + 90 * c + 40 * c * Math.sin(k * 9)} s={0.6} ang={2} tilt={c * (x0 < cx ? 28 : -28) * (0.6 + 0.4 * Math.sin(k * 7))} col={i % 3 ? '#8a7a5a' : '#6a6450'} />;
        })}
        {/* towering dust from the rim */}
        {Array.from({ length: 16 }).map((_, i) => { const a = (i / 16) * Math.PI * 2; const x = cx + Math.cos(a) * RX, y = cy + Math.sin(a) * RY; return <Puff key={i} x={x} y={y - 300 * c} rx={160 + 160 * c} ry={120 + 480 * c} lit={i % 2 === 0} o={c} />; })}
        {t < to && [0, 1, 2, 3].map((i) => <Puff key={`p${i}`} x={250 + i * 260} y={1400 - 20 * Math.sin(t * 20 + i)} rx={120} ry={40} lit o={0.5} />)}
      </Live>
    </AbsoluteFill>
  );
};
