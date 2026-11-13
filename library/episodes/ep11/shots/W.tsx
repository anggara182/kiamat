import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { W as WW, H as HH } from '../art/world';
import { WG } from '../sets/warung';
import { Uncle, Tuyul, Bowl } from '../art/warung_art';

const bg = (c: string) => ({ backgroundColor: c });

/** Bulb + its glow (radial gradients only). */
const Bulb: React.FC<{ on?: number; id: string }> = ({ on = 1, id }) => (
  <g>
    <defs>
      <radialGradient id={`${id}-g`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffd27a" stopOpacity={0.55 * on} />
        <stop offset="0.35" stopColor="#ffb85a" stopOpacity={0.22 * on} />
        <stop offset="1" stopColor="#ff9a40" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={WG.bulb.x} cy={WG.bulb.y + 120} rx={720} ry={820} fill={`url(#${id}-g)`} />
    <rect x={WG.bulb.x - 12} y={WG.bulb.y - 40} width={24} height={18} fill="#2a2620" />
    <ellipse cx={WG.bulb.x} cy={WG.bulb.y} rx={26} ry={32} fill={on > 0.5 ? '#fff4d6' : '#3a3a40'} />
  </g>
);

/** Darkens the room away from the bulb (night vignette). */
const NightShade: React.FC<{ id: string; a?: number; cx?: number; cy?: number }> = ({ id, a = 0.75, cx = WG.bulb.x, cy = WG.bulb.y + 400 }) => (
  <g>
    <defs>
      <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={1000}>
        <stop offset="0" stopColor="#05060a" stopOpacity="0" />
        <stop offset="0.55" stopColor="#05060a" stopOpacity={a * 0.6} />
        <stop offset="1" stopColor="#05060a" stopOpacity={a} />
      </radialGradient>
    </defs>
    <rect width={WW} height={HH} fill={`url(#${id})`} />
  </g>
);

/** shot 1 — exterior at night, tuyul slips under the shutter. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.12 + 0.14 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 560, oy: 1300 };
  const h = handheld(t, 0.3);
  const camF: Cam = { ...cam, tx: h.hx, ty: h.hy };
  const tb = wordAt(1, /disappearing/i, 0.35) / (useShot().sec);
  const m = ramp(p, Math.max(0.05, tb - 0.15), Math.min(0.6, tb + 0.2), EIO);
  const d = ramp(p, 0.68, 0.92, EIO);
  const tx = 980 - 250 * m - 30 * d, ty = WG.ground + 20 - 40 * d, ts = 1.2 - 0.15 * d;
  return (
    <AbsoluteFill style={bg('#05070d')}>
      <BandImg id="warung/ext" k={1} cam={camF} />
      <Live cam={camF}>
        <defs>
          <clipPath id="w1-clip">
            <path clipRule="evenodd" d={`M0 0 H${WW} V${HH} H0 Z M${WG.shutL} 0 H${WG.shutR} V${WG.shutBot} H${WG.shutL} Z`} />
          </clipPath>
          <radialGradient id="w1-bulb"><stop offset="0" stopColor="#ffd27a" stopOpacity="0.6" /><stop offset="1" stopColor="#ffd27a" stopOpacity="0" /></radialGradient>
        </defs>
        {/* bare bulb under the eave */}
        <ellipse cx={1010} cy={930} rx={160} ry={160} fill="url(#w1-bulb)" />
        <line x1={1010} y1={888} x2={1010} y2={912} stroke="#111" strokeWidth={4} />
        <ellipse cx={1010} cy={928} rx={14} ry={18} fill="#fff4d6" />
        <g opacity={1 - ramp(p, 0.86, 0.97)}>
          <Tuyul x={tx} y={ty} s={ts} sq={1 - 0.6 * d} />
        </g>
        {/* wet footprints left behind */}
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={1120 - i * 90} cy={WG.ground + 50 + (i % 2) * 18} rx={13} ry={6} fill="#9fb8d4" opacity={0.45 * ramp(m, i * 0.2, i * 0.2 + 0.2)} />
        ))}
      </Live>
    </AbsoluteFill>
  );
};

/** coins dropping into the tin (live). */
const Tin: React.FC<{ p: number }> = ({ p }) => {
  const x = 1010, y = WG.ctrTop;
  const k = (p * 6) % 1;
  return (
    <g>
      <rect x={x - 70} y={y - 90} width={140} height={90} rx={10} fill="#8a8f96" />
      <rect x={x - 70} y={y - 90} width={140} height={14} rx={6} fill="#b8bcc2" />
      <path d={`M${x + 40} ${y - 88} V${y - 4}`} stroke="#e8eaee" strokeWidth={5} opacity={0.5} />
      {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={x - 150 + i * 26} cy={y - 6 - (i % 2) * 10} rx={16} ry={6} fill="#d9b25a" />)}
      <ellipse cx={x - 30} cy={y - 140 + 50 * k} rx={14} ry={14 - 9 * k} fill="#ffe08a" opacity={k < 0.95 ? 1 : 0} />
    </g>
  );
};

/** shot 4 — uncle counting coins into the tin under the bulb. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.28 + 0.1 * ramp(p, 0, 1, EIO), dx: -80, dy: 120, ox: 640, oy: 760 };
  return (
    <AbsoluteFill style={bg('#0a0806')}>
      <BandImg id="warung/int" cam={cam} />
      <Live cam={cam}>
        <Bulb id="w4b" />
        <Uncle x={880} y={1520} s={1} turn={0.4 + 0.15 * Math.sin(t * 2)} />
        {/* counter edge redrawn in front of uncle */}
        <rect x={WG.ctrL - 30} y={WG.ctrTop} width={WW - WG.ctrL + 30} height={34} fill="#6a4a32" />
        <rect x={WG.ctrL - 30} y={WG.ctrTop} width={WW - WG.ctrL + 30} height={6} fill="#ffd27a" opacity={0.7} />
        <rect x={WG.ctrL} y={WG.ctrTop + 34} width={WW - WG.ctrL} height={400} fill="#2c1e14" />
        <Tin p={p} />
        <NightShade id="w4n" a={0.7} />
      </Live>
      <BandImg id="warung/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 7 — dark shop, moonlit bowl by the door, uncle's eyes over the counter. */
export const S07: React.FC = () => {
  const { p, sec } = useShot();
  const cam: Cam = { zoom: 1.06, dx: 30, dy: -40 };
  const te = wordAt(7, /hid/i, 0.35) / sec;
  const eye = ramp(p, te, te + 0.15);
  const blink = p > 0.7 && p < 0.73 ? 0.15 : 1;
  return (
    <AbsoluteFill style={bg('#030408')}>
      <BandImg id="warung/int" cam={cam} />
      <Live cam={cam}>
        <defs>
          <radialGradient id="w7-moon" gradientUnits="userSpaceOnUse" cx={WG.bowl.x} cy={WG.bowl.y - 40} r={420}>
            <stop offset="0" stopColor="#9fb8d4" stopOpacity="0.55" /><stop offset="1" stopColor="#9fb8d4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w7-spark"><stop offset="0" stopColor="#eaf4ff" stopOpacity="0.9" /><stop offset="1" stopColor="#9fb8d4" stopOpacity="0" /></radialGradient>
          <linearGradient id="w7-ctr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1c1612" /><stop offset="1" stopColor="#0a0806" /></linearGradient>
        </defs>
        <rect width={WW} height={HH} fill="#04060c" opacity={0.8} />
        {/* moonlight through slats */}
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={WG.doorL} y={WG.doorT + 54 + i * 58} width={WG.doorR - WG.doorL} height={6} fill="#9fb8d4" opacity={0.45} />)}
        <path d={`M${WG.doorL} ${WG.floor} L${WG.doorR} ${WG.floor} L${WG.doorR + 260} ${WG.floor + 260} L${WG.doorL + 80} ${WG.floor + 260} Z`} fill="#9fb8d4" opacity={0.1} />
        <ellipse cx={WG.bowl.x} cy={WG.bowl.y - 40} rx={420} ry={300} fill="url(#w7-moon)" />
        <Bowl x={WG.bowl.x + 40} y={WG.bowl.y} s={1.9} crab glint={0.55 + 0.4 * Math.sin(p * 14) ** 2} />
        {/* glint on the crab / water: radial star */}
        <ellipse cx={WG.bowl.x + 10} cy={WG.bowl.y - 80} rx={60} ry={60} fill="url(#w7-spark)" opacity={0.6 + 0.4 * Math.sin(p * 14) ** 2} />
        <path d={`M${WG.bowl.x + 10} ${WG.bowl.y - 104} L${WG.bowl.x + 14} ${WG.bowl.y - 84} L${WG.bowl.x + 34} ${WG.bowl.y - 80} L${WG.bowl.x + 14} ${WG.bowl.y - 76} L${WG.bowl.x + 10} ${WG.bowl.y - 56} L${WG.bowl.x + 6} ${WG.bowl.y - 76} L${WG.bowl.x - 14} ${WG.bowl.y - 80} L${WG.bowl.x + 6} ${WG.bowl.y - 84} Z`} fill="#eaf4ff" opacity={0.5 + 0.5 * Math.sin(p * 14) ** 2} />
        {/* uncle's head peeking above counter */}
        <g transform={`translate(0 ${70 - 70 * eye})`}>
          <ellipse cx={980} cy={WG.ctrTop - 10} rx={70} ry={64} fill="#0b0908" />
          <path d="M915 1105 C925 1050 1035 1050 1045 1100" stroke="#9fb8d4" strokeWidth={4} fill="none" opacity={0.5} />
          <ellipse cx={955} cy={WG.ctrTop - 22} rx={14} ry={9 * blink} fill="#e8e2d0" opacity={eye} />
          <ellipse cx={995} cy={WG.ctrTop - 22} rx={14} ry={9 * blink} fill="#e8e2d0" opacity={eye} />
          <circle cx={950} cy={WG.ctrTop - 22} r={6 * blink} fill="#100c08" opacity={eye} />
          <circle cx={990} cy={WG.ctrTop - 22} r={6 * blink} fill="#100c08" opacity={eye} />
        </g>
        <rect x={WG.ctrL - 30} y={WG.ctrTop} width={WW - WG.ctrL + 30} height={500} fill="url(#w7-ctr)" />
        {[720, 880, 1040, 1200].map((x) => <line key={x} x1={x} y1={WG.ctrTop + 34} x2={x} y2={WG.ctrTop + 500} stroke="#9fb8d4" strokeWidth={2} opacity={0.12} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${WG.ctrL - 30} ${WG.ctrTop + 80 + i * 62} q200 ${(i % 2 ? 10 : -10)} 400 0 t400 0`} stroke="#2a2018" strokeWidth={3} fill="none" opacity={0.8} />)}
        <rect x={WG.ctrL - 30} y={WG.ctrTop} width={WW - WG.ctrL + 30} height={30} fill="#16110d" />
        <rect x={WG.ctrL - 30} y={WG.ctrTop} width={WW - WG.ctrL + 30} height={4} fill="#9fb8d4" opacity={0.55} />
        <rect x={WG.ctrL - 30} y={WG.ctrTop} width={4} height={500} fill="#9fb8d4" opacity={0.4} />
        <Bulb id="w7b" on={0} />
      </Live>
      <BandImg id="warung/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 10 — dawn through the shutters, bowl and puddles, slow pull-back. */
export const S10: React.FC = () => {
  const { p, sec } = useShot();
  const z = 1.35 - 0.3 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 420, oy: 1300 };
  const tw = wordAt(10, /wet/i, 0.75) / sec;
  const wet = ramp(p, Math.max(0.05, tw - 0.25), tw + 0.05);
  const puddles = [[520, 1560, 70], [640, 1600, 50], [740, 1540, 60], [450, 1640, 40], [860, 1590, 46]];
  return (
    <AbsoluteFill style={bg('#1a1418')}>
      <BandImg id="warung/int" cam={cam} />
      <Live cam={cam}>
        <defs>
          <linearGradient id="w10-shaft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd9a8" stopOpacity="0.5" /><stop offset="1" stopColor="#ffd9a8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={WW} height={HH} fill="#3a3048" opacity={0.35} />
        {/* dawn slats */}
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={WG.doorL} y={WG.doorT + 54 + i * 58} width={WG.doorR - WG.doorL} height={10} fill="#ffc890" opacity={0.85} />)}
        {Array.from({ length: 6 }, (_, i) => {
          const y = WG.doorT + 400 + i * 100;
          return <path key={i} d={`M${WG.doorR} ${y} L${WG.doorR} ${y + 14} L${WG.doorR + 700} ${y + 360} L${WG.doorR + 700} ${y + 300} Z`} fill="url(#w10-shaft)" opacity={0.5} />;
        })}
        {puddles.map(([x, y, r], i) => (
          <g key={i} opacity={0.3 + 0.7 * wet}>
            <ellipse cx={x} cy={y} rx={r} ry={r * 0.28} fill="#2e3a48" />
            <ellipse cx={x - r * 0.2} cy={y - 2} rx={r * 0.55} ry={r * 0.08} fill="#ffd9a8" opacity={0.6} />
          </g>
        ))}
        {/* tiny footprints toward the counter */}
        {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={450 + i * 70} cy={1520 + (i % 2) * 22} rx={11} ry={5} fill="#3a4a5a" opacity={0.8 * wet} />)}
        <Bowl x={WG.bowl.x} y={WG.bowl.y} s={1.05} crab glint={0.7} light="#ffd9a8" />
        <Bulb id="w10b" on={0} />
      </Live>
      <BandImg id="warung/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 12 — night again, uncle at the counter staring at the EMPTY bowl. */
export const S12: React.FC = () => {
  const { p, sec } = useShot();
  const cam: Cam = { zoom: 1.02 + 0.14 * ramp(p, 0, 1, EIO), dx: 60, dy: -40, ox: 360, oy: 1250 };
  const tg = wordAt(12, /gone/i, 0.85) / sec;
  const look = ramp(p, 0.1, Math.max(0.3, tg - 0.2));
  return (
    <AbsoluteFill style={bg('#0a0806')}>
      <BandImg id="warung/int" cam={cam} />
      <Live cam={cam}>
        <Bulb id="w12b" />
        <Uncle x={900} y={1520} s={0.95} turn={-0.8 * look} />
        <rect x={WG.ctrL - 30} y={WG.ctrTop} width={WW - WG.ctrL + 30} height={34} fill="#6a4a32" />
        <rect x={WG.ctrL - 30} y={WG.ctrTop} width={WW - WG.ctrL + 30} height={6} fill="#ffd27a" opacity={0.7} />
        <rect x={WG.ctrL} y={WG.ctrTop + 34} width={WW - WG.ctrL} height={400} fill="#2c1e14" />
        <NightShade id="w12n" a={0.72} cx={640} cy={1100} />
        <ellipse cx={WG.bowl.x} cy={WG.bowl.y} rx={260} ry={70} fill="#ffd27a" opacity={0.12} />
        <Bowl x={WG.bowl.x} y={WG.bowl.y} s={1.3} crab={false} glint={0.85} light="#ffd27a" />
      </Live>
      <BandImg id="warung/fg" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};
