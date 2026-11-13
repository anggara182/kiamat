import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { W, H, rng } from '../art/world';
import { Comb } from '../art/country_comb';

const BG = '#070a10';
const DOTS = (() => { const r = rng(5); return Array.from({ length: 120 }, () => ({ x: r() * W, y: r() * H, r: 2 + r() * 5 })); })();
const DROPS = (() => { const r = rng(99); return Array.from({ length: 70 }, () => ({ x: r() * W, y: r() * H, l: 40 + r() * 60, v: 0.6 + r() * 0.6 })); })();

const Rain: React.FC<{ f: number; o?: number }> = ({ f, o = 0.35 }) => (
  <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: -108, top: -192, width: W, height: H }}>
    {DROPS.map((d, i) => { const y = (d.y + f * 60 * d.v) % H; return <line key={i} x1={d.x} y1={y} x2={d.x - d.l * 0.15} y2={y + d.l} stroke="#8d99a6" strokeWidth={2} opacity={o} />; })}
  </svg>
);

/** distant banshee by the wall: grey cloak, very long white hair, arm raised combing (t = time) */
const Banshee: React.FC<{ x: number; y: number; s: number; o: number; t?: number }> = ({ x, y, s, o, t = 0 }) => {
  const c = Math.sin(t * 2.2) * 0.5 + 0.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <defs><radialGradient id="bsHalo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#e3e9f0" stopOpacity="0.35" /><stop offset="1" stopColor="#e3e9f0" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={0} cy={-120} rx={150} ry={200} fill="url(#bsHalo)" />
      {/* grey cloak, long slender, hem trailing in the wind */}
      <path d="M -16 -200 Q 0 -212 16 -200 L 30 -90 Q 40 -20 56 0 Q 10 8 -60 4 Q -42 -30 -32 -100 Z" fill="#7a8490" />
      <path d="M -60 4 Q -90 -2 -110 -14 Q -76 -16 -46 -40 Z" fill="#7a8490" opacity={0.7} />
      {/* raised arm combing */}
      <path d={`M 14 -186 Q 40 -${200 - 40 * c} 30 -${236 - 70 * c}`} fill="none" stroke="#8a94a0" strokeWidth={11} strokeLinecap="round" />
      {/* head + very long white hair down the back to the knees */}
      <circle cx={0} cy={-224} r={17} fill="#d4d9de" />
      <path d={`M -18 -230 Q 0 -256 18 -232 Q 22 -160 ${16 + 8 * c} -60 Q 4 -44 -14 -58 Q -30 -150 -18 -230 Z`} fill="#f4f6f8" />
      <path d={`M -14 -150 Q -40 -100 -${34 + 10 * c} -40`} fill="none" stroke="#e8ecf0" strokeWidth={4} />
      <rect x={20} y={-(236 - 70 * c)} width={20} height={7} rx={2} fill="#ffffff" />
    </g>
  );
};

/** girl from behind: raincoat silhouette with hood */
const Girl: React.FC<{ x: number; y: number; s: number; step: number }> = ({ x, y, s, step }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={70} ry={12} fill="#05060a" opacity={0.5} />
    <rect x={-26 + step * 6} y={-150} width={20} height={150} rx={8} fill="#0b0d12" />
    <rect x={6 - step * 6} y={-150} width={20} height={150} rx={8} fill="#0b0d12" />
    <path d="M -60 -150 L -48 -330 Q 0 -360 48 -330 L 60 -150 Z" fill="#2c3646" stroke="#8d99a6" strokeWidth={3} />
    <circle cx={0} cy={-370} r={42} fill="#11151c" />
    <path d="M -46 -372 Q 0 -440 46 -372 L 50 -330 L -50 -330 Z" fill="#36425a" />
  </g>
);

const DawnSky: React.FC<{ cam: Cam; o: number }> = ({ cam, o }) => (
  <Live k={0.4} cam={cam}>
    <defs>
      <linearGradient id="dwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2c3442" /><stop offset="0.3" stopColor="#5d6474" /><stop offset="0.4" stopColor="#9b8f94" /><stop offset="0.46" stopColor="#d3ae96" /></linearGradient>
      <radialGradient id="dwSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#f3d2b0" stopOpacity="0.8" /><stop offset="1" stopColor="#f3d2b0" stopOpacity="0" /></radialGradient>
    </defs>
    <g opacity={o}>
      <rect x={-200} y={0} width={W + 400} height={1070} fill="url(#dwSky)" />
      <ellipse cx={380} cy={1000} rx={520} ry={220} fill="url(#dwSun)" />
      <path d={`M -200 950 Q 260 840 520 930 Q 760 880 1000 910 Q 1150 860 ${W + 200} 890 L ${W + 200} 1080 L -200 1080 Z`} fill="#4a5260" />
    </g>
  </Live>
);

/** dawn grade over the ground: pale mist at the horizon, cool grey-blue lift lower down */
const DawnGround: React.FC<{ cam: Cam; o: number }> = ({ cam, o }) => (
  <Live cam={cam}>
    <defs><linearGradient id="dwMist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8c3c0" stopOpacity="0" /><stop offset="0.12" stopColor="#c8c3c0" stopOpacity="0.55" /><stop offset="0.35" stopColor="#8d99a6" stopOpacity="0.28" /><stop offset="1" stopColor="#5b6674" stopOpacity="0.18" /></linearGradient></defs>
    <rect x={-300} y={880} width={W + 600} height={H} fill="url(#dwMist)" opacity={o} />
  </Live>
);

const Lane: React.FC<{ cam: Cam; f: number; children?: React.ReactNode; dawn?: number; over?: React.ReactNode }> = ({ cam, f, children, dawn = 0, over }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <BandImg id="country/sky" k={0.4} cam={cam} />
    {dawn > 0 && <DawnSky cam={cam} o={dawn} />}
    <BandImg id="country/lane" k={1} cam={cam} />
    {children}
    {dawn > 0 && <DawnGround cam={cam} o={dawn} />}
    {over}
    <Rain f={f} o={dawn > 0 ? 0.15 : 0.35} />
  </AbsoluteFill>
);

/** shot 1 — wide wet lane, push-in to a glint on the road */
export const S01: React.FC = () => {
  const { f, p, sec } = useShot();
  const cam: Cam = { zoom: 1 + 0.25 * EIO(p), dx: 0, dy: -60 * EIO(p), oy: 1300 };
  const g = ramp(p, (wordAt(1, /comb/i, 0.45) / sec), (wordAt(1, /comb/i, 0.45) / sec) + 0.12);
  return (
    <Lane cam={cam} f={f}>
      <Live cam={cam}>
        <g transform="translate(700 1530) scale(0.28)"><Comb glint={0.3 + 0.7 * g} /></g>
        <ellipse cx={700} cy={1545} rx={110} ry={14} fill="#8d99a6" opacity={0.2 + 0.2 * g} />
      </Live>
    </Lane>
  );
};

/** shot 4 — girl walking home in rain, tracking from behind */
export const S04: React.FC = () => {
  const { f, p, sec } = useShot();
  const cam: Cam = { zoom: 1.15 + 0.2 * p, dx: 0, dy: 0, oy: 1000 };
  return (
    <Lane cam={cam} f={f}>
      <Live cam={cam}><Girl x={648} y={1400} s={0.95} step={Math.sin(f * 0.25)} /></Live>
    </Lane>
  );
};

/** shot 7 — cottage at night, push-in; distant pale woman appears by the wall */
export const S07: React.FC = () => {
  const { f, p, sec } = useShot();
  const cam: Cam = { zoom: 1.8 + 0.4 * EIO(p), dx: -380, dy: 260, ox: 540, oy: 960 };
  const w = 0.4 * ramp(p, wordAt(7, /heard/i, 0.3) / sec, wordAt(7, /heard/i, 0.3) / sec + 0.15) + 0.6 * ramp(p, wordAt(7, /wailing/i, 0.6) / sec, wordAt(7, /wailing/i, 0.6) / sec + 0.15);
  return (
    <Lane cam={cam} f={f}>
      <Live cam={cam}><Banshee x={760} y={1022} s={0.5 + 0.06 * p} o={0.9 * w} t={f / 30} /></Live>
    </Lane>
  );
};

/** shot 11 — the lane at dawn, slow pull-back; she stands far down the lane */
export const S11: React.FC = () => {
  const { f, p, sec } = useShot();
  const cam: Cam = { zoom: 1.3 - 0.25 * EIO(p), dx: 0, dy: 0, oy: 1000 };
  const w = ramp(p, Math.min(0.9, wordAt(11, /wail/i, 0.85) / sec), 1);
  return (
    <Lane cam={cam} f={f} dawn={0.9} over={<Live cam={cam}><Banshee x={560} y={1040} s={0.85} o={0.45 + 0.5 * w} t={f / 30} /></Live>} />
  );
};

/** shot 12 — close: another silver comb in a puddle */
export const S12: React.FC = () => {
  const { f, p, sec } = useShot();
  const cam: Cam = { zoom: 1 + 0.15 * EIO(p), dx: 0, dy: 0, oy: 1000 };
    return (
    <AbsoluteFill style={{ backgroundColor: '#14171c' }}>
      <Live cam={cam}>
        <defs>
          <linearGradient id="pdl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0f16" /><stop offset="0.5" stopColor="#25303d" /><stop offset="1" stopColor="#3d4a59" /></linearGradient>
          <radialGradient id="pdM" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#e3e9f0" stopOpacity="0.7" /><stop offset="1" stopColor="#e3e9f0" stopOpacity="0" /></radialGradient>
        </defs>
        {/* asphalt, grass verge and white edge line */}
        <rect x={-200} y={0} width={W + 400} height={H} fill="#1a1d23" />
        {DOTS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#2c3038" opacity={0.8} />)}
        <path d="M -200 0 L 300 0 Q 260 600 160 2304 L -200 2304 Z" fill="#0f1a14" />
        <path d="M 300 0 Q 260 600 160 2304 L 200 2304 Q 300 600 340 0 Z" fill="#8d939a" opacity={0.6} />
        {/* puddle: irregular, reflects night sky + moon */}
        <path d="M 260 760 Q 420 640 760 690 Q 1120 720 1180 960 Q 1220 1260 900 1380 Q 560 1470 360 1330 Q 160 1180 260 760 Z" fill="url(#pdl)" />
        <ellipse cx={900} cy={860} rx={120} ry={60} fill="url(#pdM)" />
        <ellipse cx={900} cy={860} rx={26} ry={14} fill="#e3e9f0" opacity={0.75} />
        <path d="M 260 760 Q 420 640 760 690 Q 1120 720 1180 960 Q 1220 1260 900 1380 Q 560 1470 360 1330 Q 160 1180 260 760 Z" fill="none" stroke="#2c333d" strokeWidth={40} opacity={0.7} />
        <path d="M 300 780 Q 440 690 760 720 Q 1080 750 1140 960" fill="none" stroke="#6b7888" strokeWidth={4} opacity={0.5} />
        {[0, 13, 27].map((o, i) => { const r = ((f + o) % 40) / 40; const c = [[420, 980], [1000, 1180], [700, 1300]][i]; return <ellipse key={i} cx={c[0]} cy={c[1]} rx={20 + 140 * r} ry={(20 + 140 * r) * 0.45} fill="none" stroke="#a9b4c0" strokeWidth={3} opacity={0.55 * (1 - r)} />; })}
        <g transform="translate(700 1200) rotate(12) scale(1.1 -0.8)" opacity={0.22}><Comb glint={0} /></g>
        <g transform="translate(700 1000) rotate(-12) scale(1.1)"><Comb glint={0.4 + 0.3 * Math.sin(f * 0.08)} /></g>
      </Live>
      <Rain f={f} o={0.25} />
    </AbsoluteFill>
  );
};
