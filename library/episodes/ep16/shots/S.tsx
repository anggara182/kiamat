import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { VP, END, LIT } from '../sets/school';
import { WalkGirl } from '../art/school_girls';

const Shadow: React.FC<{ x: number; y: number; h: number; len?: number; o?: number }> = ({ x, y, h, len = 1.4, o = 0.5 }) => (
  <path d={`M ${x - h * 0.06} ${y} L ${x + h * len} ${y + h * 0.28} L ${x + h * len + h * 0.12} ${y + h * 0.18} L ${x + h * 0.06} ${y - 4} Z`} fill="#0b0810" opacity={o} />
);

/** shot 1 — wide empty corridor at dusk, slow push-in to the girls' room sign. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const k = EIO(p);
  const cam: Cam = { zoom: 1 + 0.22 * k, dx: 0, dy: 0, ox: VP.x - 108, oy: VP.y - 192 };
  const dusk = 0.05 + 0.4 * ramp(p, 0.1, 1);
  const sign = ramp(t, wordAt(1, /third/, 0.8), wordAt(1, /stall/, 0.92));
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b090d' }}>
      <BandImg id="school/corridor" cam={cam} />
      <Live cam={cam}>
        <rect x={0} y={0} width={1296} height={2304} fill="#1a2233" opacity={dusk} />
        <defs><radialGradient id="s01g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff4f6d" stopOpacity="0.55" /><stop offset="1" stopColor="#ff4f6d" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={VP.x} cy={VP.y - 92} rx={70} ry={70} fill="url(#s01g)" opacity={0.25 + 0.75 * sign} />
      </Live>
      <BandImg id="school/fg" k={1.4} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 4 — two schoolgirls with bags walking down the corridor, tracked from behind. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.04 + 0.08 * p, dx: 0, dy: 0, ox: VP.x - 108, oy: VP.y - 192 };
  const dusk = 0.1 + 0.35 * ramp(p, 0, 1);
  const ph = t * 6.5;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b090d' }}>
      <BandImg id="school/corridor" cam={cam} />
      <Live cam={cam}>
        <rect x={0} y={0} width={1296} height={2304} fill="#1a2233" opacity={dusk} />
        <Shadow x={560} y={1500} h={560} />
        <Shadow x={770} y={1488} h={540} />
        <WalkGirl x={560} y={1500} h={560} phase={ph} hair="bob" bag side={-1} rimCol="#ffb070" />
        <WalkGirl x={770} y={1488} h={540} phase={ph + 2.4} hair="pony" bag side={-1} rimCol="#ffb070" />
      </Live>
      <BandImg id="school/fg" k={1.4} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 10 — the girls running down the dark corridor toward the stairs (green exit sign). */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const { hx, hy, hr } = handheld(t * 1.6, 2.2);
  const cam: Cam = { zoom: 1.08 + 0.1 * p, dx: 0, dy: 0, tx: hx, ty: hy, rot: hr, ox: VP.x - 108, oy: VP.y - 192 };
  const run = EOUT(p);
  const g = (d: number) => ({ y: 1560 - 200 * ramp(p, d, 1, (x) => x), h: 640 - 230 * ramp(p, d, 1, (x) => x) });
  const a = g(0), b = g(0.08);
  const ph = t * 13;
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080c' }}>
      <BandImg id="school/corridor" cam={cam} />
      <Live cam={cam}>
        <rect x={0} y={0} width={1296} height={2304} fill="#1a2233" opacity={0.72} />
        <defs><radialGradient id="s10g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#2fae6a" stopOpacity="0.5" /><stop offset="1" stopColor="#2fae6a" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={VP.x + 144} cy={VP.y - 154} rx={130} ry={110} fill="url(#s10g)" />
        <defs><radialGradient id="s10f" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#6f8fa8" stopOpacity="0.35" /><stop offset="1" stopColor="#6f8fa8" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={VP.x} cy={VP.y + 260} rx={360} ry={300} fill="url(#s10f)" />
        <g transform={`rotate(-4 ${560 + 30 * run} ${a.y})`}>
          <WalkGirl x={560 + 30 * run} y={a.y} h={a.h} phase={ph} stride={1.9} hair="bob" bag side={1} rimCol="#7fd8a6" rim={0.8} />
        </g>
        <g transform={`rotate(4 ${790 - 40 * run} ${b.y})`}>
          <WalkGirl x={790 - 40 * run} y={b.y} h={b.h} phase={ph + 1.7} stride={1.9} hair="pony" bag side={1} rimCol="#7fd8a6" rim={0.8} />
        </g>
      </Live>
      <BandImg id="school/fg" k={1.4} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 11 — the school at night, one bathroom window faintly lit; slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const k = EIO(p);
  const lx = 180 + 32 + 8 * 82, ly = 820 + 60 + 1 * 160;
  const cam: Cam = { zoom: 1.45 - 0.45 * k, dx: 0, dy: 0, ox: lx + LIT.w / 2 - 108, oy: ly + LIT.h / 2 - 192 };
  const twist = ramp(t, wordAt(11, /two/, 0.85), wordAt(11, /stalls/, 0.95));
  const flick = 0.75 + 0.25 * Math.sin(t * 23) * Math.sin(t * 3.1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070b' }}>
      <BandImg id="school/night" cam={cam} />
      <Live cam={cam}>
        <defs>
          <radialGradient id="s11g" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#bfe7dc" stopOpacity="0.5" /><stop offset="1" stopColor="#bfe7dc" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={lx + LIT.w / 2} cy={ly + LIT.h / 2} rx={150} ry={150} fill="url(#s11g)" opacity={flick} />
        <rect x={lx} y={ly} width={LIT.w} height={LIT.h} fill="#cfeee6" opacity={0.55 + 0.35 * flick} />
        <rect x={lx + LIT.w / 2 - 3} y={ly} width={6} height={LIT.h} fill="#5d7a72" />
        {/* tiny red smudge behind the frosted glass on the twist */}
        <rect x={lx + 14} y={ly + LIT.h - 26} width={18} height={22} fill="#c3283b" opacity={0.7 * twist} />
      </Live>
      <BandImg id="school/nightfg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};
