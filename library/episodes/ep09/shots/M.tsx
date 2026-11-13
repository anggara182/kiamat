import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BandImg, Live, useShot, ramp, Cam, handheld, EIO, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { PaleShape, Snow } from '../art/mountain_tiger';

/* =============== Set "mountain" (owner M) =============== */
const VX = 660, VY = 860;
const win = (fl: number, c: number) => ({ x: 330 + c * 92, y: 1130 + fl * 72 });
const LIT: [number, number][] = [[2, 1], [3, 5], [5, 3], [6, 0], [8, 4], [9, 2], [4, 6]];

const Glow: React.FC<{ x: number; y: number; o: number; id: string }> = ({ x, y, o, id }) => (
  <g opacity={o}>
    <defs><radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffcf8f" stopOpacity="0.45" /><stop offset="1" stopColor="#ffcf8f" stopOpacity="0" /></radialGradient></defs>
    <ellipse cx={x + 26} cy={y + 20} rx={70} ry={55} fill={`url(#${id})`} />
    <rect x={x} y={y} width={52} height={40} fill="#ffcf8f" />
    <rect x={x + 24} y={y} width={4} height={40} fill="#c98f52" />
  </g>
);

/** Trail scene shared by 1 and 12. */
const Trail: React.FC<{ dusk?: boolean; shapeO: number; eyes: number; cam: Cam; t: number }> = ({ dusk, shapeO, eyes, cam, t }) => (
  <>
    <BandImg id="mountain/sky" k={0.4} cam={cam} />
    <BandImg id="mountain/trail" k={0.7} cam={cam} />
    <Live k={0.7} cam={cam}><PaleShape id="t" x={VX - 70} y={VY + 34} s={0.62} o={shapeO} eyes={eyes} /></Live>
    <Live k={0.8} cam={cam}><Snow t={t} n={70} seed={3} size={3} /></Live>
    <BandImg id="mountain/near" k={1.3} cam={cam} />
    {dusk && <Live k={0} cam={cam}><rect x={-200} y={-200} width={1700} height={2700} fill="#0a1328" opacity={0.42} /></Live>}
    <Live k={1.4} cam={cam}><Snow t={t} n={24} seed={7} size={7} speed={220} /></Live>
  </>
);

/** 1 — wide pine trail, slow push-in toward the pale shape far up. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const h = handheld(t, 0.25);
  const cam: Cam = { zoom: 1 + 0.22 * e, dx: 0, dy: 30 * e, tx: h.hx, ty: h.hy, ox: VX - 108, oy: VY - 192 };
  const eyesAt = wordAt(1, /mother/i, 0.5);
  const { sec } = useShot();
  const eyes = ramp(t, eyesAt, eyesAt + 0.8) * 0.9;
  return <AbsoluteFill style={{ backgroundColor: '#070b14', overflow: 'hidden' }}><Trail cam={cam} t={t} shapeO={0.85} eyes={eyes * (sec > 0 ? 1 : 1)} /></AbsoluteFill>;
};

/** 4 — apartment block at the foot of the dark mountain, slow tilt down. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const cam: Cam = { zoom: 1.12, dx: 0, dy: 0, ty: 260 - 300 * e, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#070b14', overflow: 'hidden' }}>
      <BandImg id="mountain/sky" k={0.6} cam={cam} />
      <BandImg id="mountain/apt" k={1} cam={cam} />
      <Live k={1} cam={cam}>{LIT.slice(0, 5).map(([fl, c], i) => { const w = win(fl, c); return <Glow key={i} id={`g4${i}`} x={w.x} y={w.y} o={1} />; })}</Live>
      <Live k={1.1} cam={cam}><Snow t={t} n={80} seed={5} size={3} /></Live>
    </AbsoluteFill>
  );
};

/** 10 — the block from outside, windows go dark one by one; pale shape at the tree line. Locked. */
export const S10: React.FC = () => {
  const { p, t, sec } = useShot();
  const a = wordAt(10, /shut/i, 0.1) / sec, b = wordAt(10, /dawn/i, 0.85) / sec;
  const cam: Cam = { zoom: 1.05, dx: 0, dy: 0, ty: 60 };
  const shape = ramp(p, 0.05, 0.4);
  return (
    <AbsoluteFill style={{ backgroundColor: '#070b14', overflow: 'hidden' }}>
      <BandImg id="mountain/sky" k={0.6} cam={cam} />
      <BandImg id="mountain/apt" k={1} cam={cam} />
      <Live k={1} cam={cam}><PaleShape id="a" x={1010} y={1045} s={0.32} trunk="#060a10" o={0.8 * shape} eyes={ramp(p, b - 0.1, b)} /></Live>
      <Live k={1} cam={cam}>{LIT.map(([fl, c], i) => { const w = win(fl, c); const off = a + ((b - a) * i) / LIT.length; return <Glow key={i} id={`g10${i}`} x={w.x} y={w.y} o={p < off ? 1 : 0} />; })}</Live>
      <Live k={1.1} cam={cam}><Snow t={t} n={70} seed={9} size={3} /></Live>
    </AbsoluteFill>
  );
};

/** paw print in perspective */
const Paw: React.FC<{ x: number; y: number; s: number; rot: number }> = ({ x, y, s, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${s * 0.45})`}>
    <ellipse cx={0} cy={18} rx={40} ry={34} fill="#7f93b0" />
    <ellipse cx={0} cy={10} rx={30} ry={22} fill="#647896" />
    {[[-44, -26], [-16, -48], [16, -48], [44, -26]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={15} ry={19} fill="#7f93b0" />)}
    <path d="M -40 44 Q 0 60 40 44" stroke="#f4f8fc" strokeWidth={5} fill="none" />
  </g>
);

/** 11 — pale dawn, low angle: huge tracks to a wire fence with white fur caught on it. Slow push along the tracks. */
export const S11: React.FC = () => {
  const { p, t, sec } = useShot();
  const e = EIO(p);
  const furAt = clamp01(wordAt(11, /fur/i, 0.8) / sec);
  const FX = 820, FY = 1150;
  const cam: Cam = { zoom: 1 + 0.3 * e, dx: -40 * e, dy: 0, ox: FX - 108, oy: FY - 192 };
    const prints = Array.from({ length: 9 }, (_, i) => { const d = i / 8; return { x: 520 + (FX - 60 - 520) * (1 - d) + (i % 2 ? 40 : -40) * (0.3 + d), y: FY + 40 + Math.pow(d, 1.6) * 270, s: 0.35 + d * 1.0 }; });
  return (
    <AbsoluteFill style={{ backgroundColor: '#9fb3cc', overflow: 'hidden' }}>
      <Live k={0.3} cam={cam}>
        <defs><linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fb3cc" /><stop offset="0.45" stopColor="#e6eef7" /></linearGradient></defs>
        <rect x={-200} y={-200} width={1700} height={2700} fill="url(#dsky)" />
        <path d="M -100 1060 L 200 900 L 420 990 L 700 820 L 980 960 L 1400 880 L 1400 1200 L -100 1200 Z" fill="#8b9cb6" />
      </Live>
      <Live k={0.5} cam={cam}>
        {Array.from({ length: 22 }, (_, i) => { const x = -60 + i * 66, hh = 140 + ((i * 37) % 60); return <path key={i} d={`M ${x - 34} 1110 L ${x} ${1110 - hh} L ${x + 34} 1110 Z`} fill="#56667f" />; })}
      </Live>
      <Live k={1} cam={cam}>
        <defs><linearGradient id="dsnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9d6e6" /><stop offset="1" stopColor="#eef3f8" /></linearGradient></defs>
        <rect x={-200} y={1100} width={1700} height={1400} fill="url(#dsnow)" />
        {/* fence */}
        {[560, 700, 840, 980, 1120, 1260].map((x, i) => <rect key={i} x={x} y={FY - 230} width={10} height={250} fill="#3a4558" />)}
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M 480 ${FY - 210 + k * 50} L 1320 ${FY - 220 + k * 50}`} stroke="#4b5568" strokeWidth={2.5} fill="none" />)}
        {prints.map((q, i) => <Paw key={i} x={q.x} y={q.y} s={q.s} rot={-12} />)}
        {/* barbs */}
        {[0, 1, 2, 3, 4].map((k) => [560, 630, 770, 910, 1050, 1190].map((x, j) => <path key={`${k}-${j}`} d={`M ${x + 30} ${FY - 216 + k * 50} l 8 8 M ${x + 38} ${FY - 216 + k * 50} l -8 8`} stroke="#4b5568" strokeWidth={2} />))}
        {/* long white fur snagged on the barbed wire (hero) */}
        <g transform={`translate(${FX} ${FY - 112})`} opacity={0.45 + 0.55 * ramp(p, furAt - 0.25, furAt)}>
          <path d="M -26 -8 Q -6 -20 18 -8 Q 30 6 12 18 Q -8 24 -24 10 Z" fill="#eef3f8" />
          {Array.from({ length: 16 }, (_, i) => {
            const x0 = -16 + (i * 7) % 30, L = 70 + ((i * 53) % 110), w = Math.sin(t * 2.1 + i * 0.9) * 10;
            const ex = x0 + L * 0.45 + w, ey = 20 + L * 0.8 + w * 0.3;
            return <path key={i} d={`M ${x0} 2 C ${x0 + L * 0.3} ${8 + (i % 3) * 6} ${x0 + L * 0.55 + w * 0.5} ${ey - 20} ${ex} ${ey}`} stroke={i % 4 === 0 ? '#c9d6e6' : '#f4f8fc'} strokeWidth={2.5 + (i % 3) * 1.5} fill="none" strokeLinecap="round" />;
          })}
          <path d="M -18 -4 Q -6 -12 10 -6" stroke="#ffffff" strokeWidth={2.5} fill="none" />
        </g>
      </Live>
      <Live k={1.2} cam={cam}><Snow t={t * 0.4} n={30} seed={13} size={3} color="#ffffff" /></Live>
    </AbsoluteFill>
  );
};

/** 12 — the trail at dusk, a faint pale shape waiting far up. Slow push-in. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const h = handheld(t, 0.2);
  const cam: Cam = { zoom: 1.08 + 0.18 * e, dx: 0, dy: 20 * e, tx: h.hx, ty: h.hy, ox: VX - 108, oy: VY - 192 };
  const eyesAt = wordAt(12, /dark/i, 0.6);
  return <AbsoluteFill style={{ backgroundColor: '#070b14', overflow: 'hidden' }}><Trail dusk cam={cam} t={t} shapeO={0.5} eyes={ramp(t, eyesAt, eyesAt + 1) * 0.8} /></AbsoluteFill>;
};
