import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, Live, Cam, handheld, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Lime, Planks, LongArm, MOON } from '../art/close_arm';
import { PerspFloor, fx, FLOOR_BOTTOM } from '../art/close_floor';

const FW = 1080, FH = 1920;
const LAMP = '#ffc46b';
const L: React.FC<{ cam: Cam; k?: number; h?: number; children: React.ReactNode }> = ({ cam, k = 1, h = FH, children }) => (
  <Live cam={cam} k={k} w={FW} h={h}>{children}</Live>
);
const wp = (id: number, re: RegExp, fb: number, sec: number) => Math.min(1, Math.max(0, wordAt(id, re, fb) / sec));

/** shot 6 — the lime rolling across teak floorboards toward the gap, camera tracks with it. */
export const S06: React.FC = () => {
  const { p, t, sec } = useShot();
  const go = ramp(p, wp(6, /^lime/, 0.55, sec) - 0.45, 1, (x) => x);
  const lx = 380 + 1300 * go;
  const ly = 860;
  const r = 88;
  const rot = ((lx - 380) / r) * 57.3;
  const h = handheld(t, 0.25);
  const tx = -(lx - 470) + h.hx;
  const cam: Cam = { zoom: 1, dx: 0, dy: 0, tx, ty: h.hy };
  const camFix: Cam = { zoom: 1, dx: 0, dy: 0 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#140d08' }}>
      <L cam={cam}>
        <Planks x0={-400} n={22} pw={150} y0={-300} h={2600} wideAt={13} wideW={120} />
      </L>
      <L cam={cam}>
        <rect x={1797} y={-300} width={120} height={2600} fill="#030202" />
      </L>
      <L cam={cam}>
        <Lime id="c6" x={lx} y={ly} r={r} rot={rot} />
      </L>
      {/* lamp light from top-left, falling off to dark */}
      <L cam={camFix}>
        <defs>
          <radialGradient id="c6lamp" cx="0.15" cy="0.25" r="0.85">
            <stop offset="0" stopColor={LAMP} stopOpacity={0.35} />
            <stop offset="0.35" stopColor={LAMP} stopOpacity={0.08} />
            <stop offset="0.7" stopColor="#000" stopOpacity={0.35} />
            <stop offset="1" stopColor="#000" stopOpacity={0.8} />
          </radialGradient>
          <linearGradient id="c6fg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#000" stopOpacity={0.75} />
          </linearGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2320} fill="url(#c6lamp)" />
        <rect x={-200} y={1200} width={1480} height={920} fill="url(#c6fg)" />
      </L>
      {/* foreground: edge of a mortar bowl / table leg, dark silhouette */}
      <L cam={{ zoom: 1, dx: 0, dy: 0, tx: tx * 0.15 }}>
        <path d="M-120,-100 L180,-100 C200,200 170,380 120,470 C60,560 -60,560 -120,520 Z" fill="#090605" />
        <path d="M180,-100 C200,200 170,380 120,470" stroke={LAMP} strokeWidth={4} fill="none" opacity={0.45} />
      </L>
    </AbsoluteFill>
  );
};

/** shot 7 — locked high angle on the floorboards: the lime rolls to the dark gap and drops through into darkness on "fell". */
export const S07: React.FC = () => {
  const { p, sec } = useShot();
  const fell = wp(7, /fell/, 0.16, sec);
  const thru = Math.max(fell + 0.1, wp(7, /through/, 0.27, sec));
  const roll = ramp(p, 0, fell, EOUT);
  const drop = ramp(p, fell, Math.max(thru + 0.25, 0.55), (x) => x * x);
  const ly = 820;
  const gL = 560, gR = 820; // gap edges at the floor bottom
  const gx = (fx(gL, ly) + fx(gR, ly)) / 2;
  const r = 76;
  const lx = 230 + (gx - 230) * roll;
  const sc = 1 - 0.8 * drop;
  const gapPoly = `${fx(gL, -200)},-200 ${fx(gR, -200)},-200 ${gR},${FLOOR_BOTTOM} ${gL},${FLOOR_BOTTOM}`;
  const cam: Cam = { zoom: 1 + 0.03 * p, dx: 0, dy: 0, oy: ly };
  return (
    <AbsoluteFill style={{ backgroundColor: '#020203' }}>
      <L cam={cam}>
        <defs>
          <linearGradient id="c7deep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#010102" />
            <stop offset="0.5" stopColor="#0b1018" />
            <stop offset="1" stopColor="#010102" />
          </linearGradient>
          <clipPath id="c7gap"><polygon points={gapPoly} /></clipPath>
        </defs>
        {/* the gap: darkness under the house, inner side face of the right board */}
        <polygon points={gapPoly} fill="url(#c7deep)" />
        <polygon points={`${fx(gR, -200) - 22},-200 ${fx(gR, -200)},-200 ${gR},${FLOOR_BOTTOM} ${gR - 34},${FLOOR_BOTTOM}`} fill="#24180f" />
        {drop > 0 && drop < 1 && (
          <g clipPath="url(#c7gap)">
            <g transform={`translate(${gx},${ly - 30 * drop}) scale(${sc}) translate(${-gx},${-ly})`}>
              <Lime id="c7b" x={gx} y={ly} r={r} rot={200 + 260 * drop} dark={Math.min(0.92, 0.15 + drop * 1.2)} />
            </g>
          </g>
        )}
        <PerspFloor edges={[-900, -560, -548, -200, -190, 170, 180, gL, gR, 1200, 1210, 1560, 1570, 1950]} />
        {/* lamp-lit edge of the left board at the gap */}
        <polygon points={`${fx(gL, -200) - 4},-200 ${fx(gL, -200)},-200 ${gL},${FLOOR_BOTTOM} ${gL - 8},${FLOOR_BOTTOM}`} fill="#e0a868" opacity={0.7} />
        {drop <= 0 && <Lime id="c7a" x={lx} y={ly} r={r} rot={((lx - 300) / r) * 57.3} />}
      </L>
      <L cam={{ zoom: 1, dx: 0, dy: 0 }}>
        <defs>
          <radialGradient id="c7lamp" cx="0.5" cy="0.4" r="0.62">
            <stop offset="0" stopColor={LAMP} stopOpacity={0.3} />
            <stop offset="0.35" stopColor={LAMP} stopOpacity={0.08} />
            <stop offset="0.7" stopColor="#000" stopOpacity={0.45} />
            <stop offset="1" stopColor="#000" stopOpacity={0.88} />
          </radialGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2320} fill="url(#c7lamp)" />
        {/* foreground: dark edge of the low table, top-left */}
        <path d="M-200,-200 L420,-200 C400,40 330,160 200,200 L-200,260 Z" fill="#080504" />
        <path d="M420,-200 C400,40 330,160 200,200" stroke={LAMP} strokeWidth={4} fill="none" opacity={0.4} />
      </L>
    </AbsoluteFill>
  );
};

/** shot 9 — HERO: from under the house, the impossibly long arm reaches down through the floorboards to the lime. Slow tilt down. */
export const S09: React.FC = () => {
  const { p, t, sec } = useShot();
  const WH = 3600;
  const tilt = ramp(p, 0.04, 0.92, EIO);
  const reach = ramp(p, 0, Math.max(0.5, wp(9, /^lime/, 0.85, sec)), EIO);
  const grab = ramp(p, Math.max(0.55, wp(9, /^lime/, 0.85, sec)), 1, EIO);
  const ty = 840 - 1680 * tilt;
  const cam: Cam = { zoom: 1, dx: 0, dy: 0, ty };
  const ax = 560;
  const y1 = 700 + (2770 - 700) * reach;
  const groundY = 3010;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070c' }}>
      <L cam={cam} h={WH} k={1}>
        <defs>
          <linearGradient id="c9bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05070c" />
            <stop offset="0.25" stopColor="#141c2c" />
            <stop offset="0.7" stopColor="#24324a" />
            <stop offset="0.86" stopColor="#1a2436" />
            <stop offset="1" stopColor="#06080c" />
          </linearGradient>
          <radialGradient id="c9haze" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#8fa4c4" stopOpacity={0.5} />
            <stop offset="0.5" stopColor="#4a5c7c" stopOpacity={0.2} />
            <stop offset="1" stopColor="#24324a" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="c9gr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2e30" />
            <stop offset="1" stopColor="#07080a" />
          </linearGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={WH + 400} fill="url(#c9bg)" />
        {/* moonlit canal glimpsed far behind the stilts */}
        <rect x={-200} y={2700} width={1480} height={80} fill="#0c1622" />
        {[120, 380, 760, 980].map((x, i) => <rect key={i} x={x} y={2720 + i * 9} width={70 + i * 10} height={4} fill={MOON} opacity={0.35} />)}
        {/* pale haze column behind the arm */}
        <ellipse cx={ax + 40} cy={1800} rx={420} ry={1500} fill="url(#c9haze)" />
        {/* distant stilts */}
        {[90, 300, 840, 1010].map((x, i) => <rect key={i} x={x} y={150} width={36} height={2880} fill="#0a0d14" opacity={0.85} />)}
        {/* ground */}
        <path d={`M-200,${groundY} C200,${groundY - 30} 700,${groundY + 20} 1300,${groundY - 20} L1300,${WH + 200} L-200,${WH + 200} Z`} fill="url(#c9gr)" />
        <ellipse cx={ax + 60} cy={groundY + 10} rx={260} ry={40} fill={MOON} opacity={0.1} />
      </L>
      <L cam={cam} h={WH}>
        <LongArm x={ax} y0={120} y1={y1} lean={50} curl={grab} t={t} />
        <Lime id="c9" x={ax + 70} y={groundY - 40} r={46} rot={20} light={MOON} />
      </L>
      {/* floorboards (underside) with the sleeve edge pushing through the gap */}
      <L cam={cam} h={WH}>
        <rect x={-200} y={-200} width={1480} height={340} fill="#120d0a" />
        {[-120, 160, 440, 690, 960].map((x, i) => <rect key={i} x={x} y={-200} width={i === 2 ? 220 : 250} height={330} fill={i % 2 ? '#1c1410' : '#17110d'} />)}
        <rect x={-200} y={120} width={1480} height={46} fill="#0b0807" />
        {/* sleeve edge: dark fabric with a gold hem, pushed down through the gap */}
        <path d={`M${ax - 70},40 C${ax - 60},110 ${ax - 50},160 ${ax - 34},200 L${ax + 36},200 C${ax + 50},160 ${ax + 60},110 ${ax + 70},40 Z`} fill="#3a1414" />
        <path d={`M${ax - 34},200 C${ax - 10},212 ${ax + 14},212 ${ax + 36},200`} stroke="#c9a24a" strokeWidth={6} fill="none" />
        <path d={`M${ax + 70},40 C${ax + 60},110 ${ax + 50},160 ${ax + 36},200`} stroke={MOON} strokeWidth={3} fill="none" opacity={0.6} />
        {/* near stilt posts, foreground framing */}
        <rect x={-160} y={-200} width={170} height={WH + 400} fill="#030407" />
        <rect x={1010} y={-200} width={200} height={WH + 400} fill="#030407" />
        <rect x={1006} y={-200} width={4} height={WH + 400} fill={MOON} opacity={0.25} />
        {/* cross beam */}
        <path d="M-200,1500 L1300,1260 L1300,1320 L-200,1560 Z" fill="#06080c" opacity={0.9} />
      </L>
    </AbsoluteFill>
  );
};

/** shot 12 — the oil lamp in the window; a long shadow of hair sways on the shutter behind it. Very slow push. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const push = ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: 1 + 0.1 * push, dx: 0, dy: 0, ox: 540, oy: 880 };
  const sway = Math.sin(t * 0.7) * 22;
  const drift = -40 + 120 * push;
  const flick = 1 + Math.sin(t * 9) * 0.03 + Math.sin(t * 13.7) * 0.02;
  const lx = 540, ly = 980;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0c0806' }}>
      <L cam={cam} k={0.6}>
        <defs>
          <linearGradient id="c12night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a1220" />
            <stop offset="1" stopColor="#16233a" />
          </linearGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2320} fill="#24170f" />
        {/* window opening: night outside */}
        <rect x={220} y={300} width={640} height={720} fill="url(#c12night)" />
        <circle cx={720} cy={430} r={34} fill={MOON} opacity={0.85} />
        <path d="M220,820 C320,760 360,700 420,780 C470,700 540,740 560,820 L560,1020 L220,1020 Z" fill="#070a0f" />
        <path d="M640,1020 C660,860 720,820 760,700 C800,820 840,880 860,1020 Z" fill="#070a0f" />
      </L>
      {/* hair shadow on the open shutter / wall, swaying */}
      <L cam={cam} k={0.75}>
        <g opacity={0.85} transform={`translate(${drift},0)`}>
          {/* head + long hair cast as one shadow, falling far below */}
          <path d={`M800,120 C720,140 690,240 700,330 C690,520 660,820 ${650 + sway},1100 C${640 + sway * 1.3},1300 ${660 + sway * 1.6},1480 ${690 + sway * 1.8},1640 L${1000 + sway * 1.8},1640 C${990 + sway * 1.4},1400 ${1000 + sway},1100 990,820 C990,560 980,380 960,300 C950,190 880,110 800,120 Z`} fill="#060302" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${700 + i * 60},400 C${680 + i * 62},800 ${660 + i * 64 + sway},1200 ${650 + i * 70 + sway * 1.9},${1700 + (i % 2) * 60}`} stroke="#060302" strokeWidth={14 - i * 2} fill="none" />
          ))}
        </g>
      </L>
      <L cam={cam}>
        <defs>
          <radialGradient id="c12glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff1c8" stopOpacity={0.9} />
            <stop offset="0.15" stopColor={LAMP} stopOpacity={0.55} />
            <stop offset="0.5" stopColor="#c27a32" stopOpacity={0.18} />
            <stop offset="1" stopColor="#3b2a1f" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="c12vig" cx="0.5" cy="0.45" r="0.7">
            <stop offset="0.45" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#000" stopOpacity={0.75} />
          </radialGradient>
        </defs>
        {/* window frame posts + sill */}
        <rect x={180} y={260} width={50} height={800} fill="#3b2a1f" />
        <rect x={850} y={260} width={50} height={800} fill="#2c1f16" />
        <rect x={180} y={250} width={720} height={50} fill="#2c1f16" />
        <rect x={120} y={1060} width={840} height={60} fill="#5a3f2b" />
        <rect x={120} y={1060} width={840} height={6} fill="#c9925a" opacity={0.7} />
        <rect x={120} y={1120} width={840} height={900} fill="#160f0a" />
        {/* glow */}
        <ellipse cx={lx + 140} cy={ly - 50} rx={520 * flick} ry={520 * flick} fill="url(#c12glow)" />
        {/* clay oil lamp */}
        <path d={`M${lx - 110},${ly + 40} C${lx - 100},${ly + 80} ${lx + 100},${ly + 80} ${lx + 110},${ly + 40} C${lx + 90},${ly + 10} ${lx - 90},${ly + 10} ${lx - 110},${ly + 40} Z`} fill="#6b3f22" />
        <path d={`M${lx + 100},${ly + 32} L${lx + 150},${ly + 18} L${lx + 108},${ly + 50} Z`} fill="#6b3f22" />
        <path d={`M${lx - 110},${ly + 40} C${lx - 60},${ly + 22} ${lx + 60},${ly + 22} ${lx + 110},${ly + 40}`} stroke="#ffcf86" strokeWidth={4} fill="none" opacity={0.8} />
        <rect x={lx - 50} y={ly + 76} width={100} height={12} fill="#3b2a1f" />
        <path d={`M${lx - 70},${ly + 88} L${lx + 70},${ly + 88} L${lx + 50},${ly + 82} L${lx - 50},${ly + 82} Z`} fill="#4a2c18" />
        {/* flame */}
        <g transform={`translate(${lx + 140},${ly + 14}) scale(1,${flick})`}>
          <path d="M0,0 C-22,-20 -14,-60 2,-100 C14,-60 22,-24 0,0 Z" fill="#ffb347" />
          <path d="M0,-4 C-10,-20 -6,-44 2,-66 C8,-44 10,-20 0,-4 Z" fill="#fff3d1" />
        </g>
        <rect x={-200} y={-200} width={1480} height={2320} fill="url(#c12vig)" />
      </L>
    </AbsoluteFill>
  );
};
