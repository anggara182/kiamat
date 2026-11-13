import React from 'react';

/** House set geometry (world space 1296x2304). */
export const HS = {
  floor: 1300, // underside of the house floor
  wallTop: 960,
  left: 360,
  right: 1010,
  water: 1470,
  win: { x: 470, y: 1040, w: 130, h: 130 },
  door: { x: 760, y: 1070, w: 130, h: 230 },
  stepTop: { x: 890, y: 1300 },
  stepBot: { x: 1040, y: 1490 },
  bankY: 1415,
};

export const SKY = '#0a1220';
const INK = '#070a0f';
const TEAK = '#3b2a1f';
const TEAK2 = '#5a3f2b';
const LAMP = '#ffc46b';

const Palm: React.FC<{ x: number; y: number; h: number; s?: number }> = ({ x, y, h, s = 1 }) => {
  const tx = x + 40 * s, ty = y - h;
  const fronds = [-150, -110, -70, -30, 10, 40];
  return (
    <g fill={INK}>
      <path d={`M ${x - 9} ${y} Q ${x + 20 * s} ${y - h / 2} ${tx - 4} ${ty} L ${tx + 5} ${ty} Q ${x + 30 * s} ${y - h / 2} ${x + 9} ${y} Z`} />
      {fronds.map((a, i) => {
        const r = (a * Math.PI) / 180, L = 170;
        const ex = tx + Math.cos(r) * L * (i % 2 ? 1 : -1), ey = ty + Math.sin(r) * 60 + 70;
        const mx = (tx + ex) / 2, my = ty - 30;
        return <path key={i} d={`M ${tx} ${ty} Q ${mx} ${my - 20} ${ex} ${ey} Q ${mx} ${my + 14} ${tx} ${ty + 8} Z`} />;
      })}
    </g>
  );
};

const Banana: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g fill={INK} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -8 0 L -6 -220 L 6 -220 L 8 0 Z" />
    <path d="M 0 -210 Q -160 -320 -260 -240 Q -150 -250 0 -190 Z" />
    <path d="M 0 -215 Q 120 -380 240 -330 Q 120 -300 4 -195 Z" />
    <path d="M 0 -220 Q -60 -420 -10 -470 Q 10 -380 6 -215 Z" />
    <path d="M 0 -160 Q 150 -200 230 -110 Q 120 -150 0 -140 Z" />
  </g>
);

/** Exterior: sky, moon, far bank, the stilt house, water. */
export const ExteriorBand: React.FC = () => {
  const { floor, wallTop, left, right, water, win, door } = HS;
  return (
    <g>
      <defs>
        <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05070d" /><stop offset="0.45" stopColor="#0f1a2c" /><stop offset="0.62" stopColor="#1d2c42" /><stop offset="1" stopColor="#0c1622" />
        </linearGradient>
        <radialGradient id="hMoonGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#cfd8e6" stopOpacity="0.45" /><stop offset="1" stopColor="#cfd8e6" stopOpacity="0" /></radialGradient>
        <linearGradient id="hWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16253a" /><stop offset="0.3" stopColor="#0c1622" /><stop offset="1" stopColor="#05090f" /></linearGradient>
        <linearGradient id="hWall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2a1d15" /><stop offset="0.6" stopColor={TEAK} /><stop offset="1" stopColor="#24180f" /></linearGradient>
        <linearGradient id="hUnder" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#020304" /><stop offset="1" stopColor="#0a121c" /></linearGradient>
      </defs>
      <rect width={1296} height={2304} fill="url(#hSky)" />
      <circle cx={980} cy={560} r={260} fill="url(#hMoonGlow)" />
      <circle cx={980} cy={560} r={58} fill="#e4e9f1" />
      <circle cx={962} cy={548} r={12} fill="#cfd8e6" />
      {/* far bank treeline */}
      <path d={`M 0 1240 Q 120 1150 220 1200 Q 300 1120 420 1190 L 1296 1210 Q 1180 1140 1100 1200 L 1296 1200 L 1296 1300 L 0 1300 Z`} fill="#0b1119" />
      <Palm x={150} y={1300} h={430} s={1} />
      <Palm x={1180} y={1300} h={360} s={-1} />
      <Palm x={1090} y={1300} h={250} s={1} />
      {/* bank strip left of the house */}
      <path d={`M 0 ${HS.bankY - 20} L 380 ${HS.bankY - 10} L 420 ${HS.bankY + 30} L 0 ${HS.bankY + 40} Z`} fill="#0b0f15" />
      {/* water */}
      <rect x={0} y={water - 10} width={1296} height={2304 - water} fill="url(#hWater)" />
      <rect x={0} y={HS.bankY + 30} width={1296} height={water - HS.bankY} fill="url(#hWater)" />
      {/* stilts + dark under-house */}
      <rect x={left + 10} y={floor} width={right - left - 20} height={water - floor + 10} fill="url(#hUnder)" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = left + 20 + i * ((right - left - 60) / 5);
        return <rect key={i} x={x} y={floor - 10} width={22} height={water - floor + 60} fill={i % 2 ? '#1c140e' : '#251a12'} />;
      })}
      <path d={`M ${left + 30} ${floor + 30} L ${right - 40} ${floor + 140}`} stroke="#1a120c" strokeWidth={10} />
      {/* floor beam */}
      <rect x={left - 20} y={floor - 24} width={right - left + 40} height={28} fill={TEAK2} />
      <rect x={left - 20} y={floor - 24} width={right - left + 40} height={5} fill="#7a5a3e" opacity={0.6} />
      {/* walls with plank lines */}
      <rect x={left} y={wallTop} width={right - left} height={floor - wallTop - 24} fill="url(#hWall)" />
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={i} x={left + 25 + i * 50} y={wallTop} width={3} height={floor - wallTop - 24} fill="#1a120c" opacity={0.55} />
      ))}
      {/* Thai roof: steep gable with flared eaves */}
      <path d={`M ${left - 70} ${wallTop + 20} Q ${left - 20} ${wallTop - 10} ${(left + right) / 2} ${wallTop - 330} Q ${right + 20} ${wallTop - 10} ${right + 70} ${wallTop + 20} L ${right + 50} ${wallTop + 30} L ${left - 50} ${wallTop + 30} Z`} fill="#1a1410" />
      <path d={`M ${left + 10} ${wallTop + 10} L ${(left + right) / 2} ${wallTop - 290} L ${right - 10} ${wallTop + 10} Z`} fill="#2b1f16" />
      <path d={`M ${(left + right) / 2} ${wallTop - 330} q -10 -50 20 -70`} stroke="#1a1410" strokeWidth={10} fill="none" />
      <path d={`M ${left - 70} ${wallTop + 20} q -20 -10 -24 -50`} stroke="#1a1410" strokeWidth={9} fill="none" />
      <path d={`M ${right + 70} ${wallTop + 20} q 20 -10 24 -50`} stroke="#1a1410" strokeWidth={9} fill="none" />
      <path d={`M ${left - 20} ${wallTop + 10} Q ${(left + right) / 2 - 150} ${wallTop - 180} ${(left + right) / 2} ${wallTop - 320}`} stroke="#8fa3bd" strokeWidth={3} fill="none" opacity={0.35} />
      {/* window (lit) */}
      <rect x={win.x - 8} y={win.y - 8} width={win.w + 16} height={win.h + 16} fill="#1a120c" />
      <rect x={win.x} y={win.y} width={win.w} height={win.h} fill={LAMP} />
      <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="#ff9a3a" opacity={0.35} />
      <rect x={win.x + win.w / 2 - 3} y={win.y} width={6} height={win.h} fill="#2a1d15" />
      {/* door (dim warm) */}
      <rect x={door.x - 8} y={door.y - 8} width={door.w + 16} height={door.h + 8} fill="#1a120c" />
      <rect x={door.x} y={door.y} width={door.w} height={door.h} fill="#c9873f" />
      <rect x={door.x} y={door.y + door.h * 0.5} width={door.w} height={door.h * 0.5} fill="#a8682e" />
      {/* porch + steps to water */}
      <rect x={door.x + door.w} y={floor - 30} width={110} height={12} fill={TEAK2} />
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 6;
        const x = HS.stepTop.x + (HS.stepBot.x - HS.stepTop.x) * t, y = HS.stepTop.y + (HS.stepBot.y - HS.stepTop.y) * t;
        return <rect key={i} x={x - 6} y={y - 6} width={70} height={10} fill={TEAK2} />;
      })}
      <path d={`M ${HS.stepTop.x + 4} ${HS.stepTop.y - 4} L ${HS.stepBot.x} ${HS.stepBot.y + 20}`} stroke="#24180f" strokeWidth={10} />
      <path d={`M ${HS.stepTop.x + 66} ${HS.stepTop.y - 4} L ${HS.stepBot.x + 64} ${HS.stepBot.y + 20}`} stroke="#24180f" strokeWidth={10} />
      {/* reflections of house */}
      <rect x={win.x} y={2 * water - win.y - win.h - 260} width={win.w} height={60} fill={LAMP} opacity={0.12} />
    </g>
  );
};

/** Foreground framing leaves (exterior). */
export const ExtFgBand: React.FC = () => (
  <g>
    <Banana x={120} y={2300} s={2.3} />
    <path d="M 1296 1700 Q 1100 1800 1060 2000 Q 1150 1900 1296 1880 Z" fill={INK} />
    <path d="M 1296 1900 Q 1120 2050 1120 2304 L 1296 2304 Z" fill={INK} />
  </g>
);

/** Interior: teak wall, lamp shelf, floor, low table. */
export const InteriorBand: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="hInGlow" cx="0.45" cy="0.42" r="0.6"><stop offset="0" stopColor="#7a5232" /><stop offset="0.5" stopColor="#3b2a1f" /><stop offset="1" stopColor="#0d0906" /></radialGradient>
      <linearGradient id="hInFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a3424" /><stop offset="1" stopColor="#120c08" /></linearGradient>
    </defs>
    <rect width={1296} height={2304} fill="url(#hInGlow)" />
    {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={i * 96} y={0} width={4} height={1460} fill="#160f0a" opacity={0.6} />)}
    <rect x={0} y={680} width={1296} height={26} fill="#24180f" />
    {/* shuttered window, dark night outside */}
    <rect x={860} y={760} width={250} height={330} fill="#0c1622" />
    <rect x={860} y={760} width={250} height={330} fill="none" stroke="#1a120c" strokeWidth={18} />
    <rect x={982} y={760} width={8} height={330} fill="#1a120c" />
    <circle cx={1040} cy={830} r={18} fill="#cfd8e6" opacity={0.6} />
    {/* floor with board gaps */}
    <rect x={0} y={1460} width={1296} height={844} fill="url(#hInFloor)" />
    {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${648 + (i - 4) * 70} 1460 L ${648 + (i - 4) * 260} 2304`} stroke="#0a0604" strokeWidth={4} />)}
    {/* low table */}
    <ellipse cx={620} cy={1600} rx={300} ry={40} fill="#0a0604" opacity={0.6} />
    <rect x={340} y={1520} width={560} height={34} rx={6} fill="#6b4a30" />
    <rect x={340} y={1520} width={560} height={8} rx={4} fill="#a87a4e" />
    <rect x={380} y={1554} width={24} height={60} fill="#3b2a1f" />
    <rect x={836} y={1554} width={24} height={60} fill="#3b2a1f" />
    {/* bowls */}
    <ellipse cx={560} cy={1512} rx={50} ry={16} fill="#c9a24a" />
    <ellipse cx={560} cy={1506} rx={44} ry={9} fill="#3a2a18" />
    <ellipse cx={700} cy={1514} rx={36} ry={12} fill="#8a2e2e" />
  </g>
);

/** Oil lamp glow (live, flicker by opacity). */
export const LampGlow: React.FC<{ x: number; y: number; r: number; o?: number; id: string }> = ({ x, y, r, o = 1, id }) => (
  <g opacity={o}>
    <defs><radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd890" stopOpacity="0.75" /><stop offset="0.3" stopColor="#ffc46b" stopOpacity="0.3" /><stop offset="1" stopColor="#ffc46b" stopOpacity="0" /></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

export const OilLamp: React.FC<{ x: number; y: number; s?: number; flick?: number }> = ({ x, y, s = 1, flick = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -30 0 Q -34 -26 0 -30 Q 34 -26 30 0 Z" fill="#6b4a30" />
    <rect x={-4} y={-40} width={8} height={12} fill="#2a1d15" />
    <path d={`M 0 ${-40 - 34 * flick} Q 10 -52 0 -40 Q -10 -52 0 ${-40 - 34 * flick} Z`} fill="#fff1c9" />
  </g>
);

const SKIN = '#9a6a4c';

/** Mak, simple shirt. dir 1 = facing right. pose: 'stand' | 'step' | 'climb' | 'run' | 'sit' | 'look' */
export const Man: React.FC<{ x: number; y: number; h: number; dir?: number; pose?: string; ph?: number; rim?: string }> = ({ x, y, h, dir = 1, pose = 'stand', ph = 0, rim = '#ffc46b' }) => {
  const u = h / 7;
  const sw = Math.sin(ph);
  const legA = pose === 'run' ? sw * 0.9 : pose === 'step' ? 0.5 : pose === 'climb' ? 0.4 : 0.08;
  const legB = pose === 'run' ? -sw * 0.9 : pose === 'step' ? -0.35 : pose === 'climb' ? -0.1 : -0.08;
  const hip = { x: 0, y: -3.4 * u };
  const leg = (a: number, bend: number, k: string) => {
    const kx = Math.sin(a) * 1.6 * u, ky = hip.y + Math.cos(a) * 1.6 * u;
    const fx = kx + Math.sin(a - bend) * 1.7 * u, fy = ky + Math.cos(a - bend) * 1.7 * u;
    return <path key={k} d={`M ${hip.x - 0.3 * u} ${hip.y} L ${kx - 0.25 * u} ${ky} L ${fx - 0.2 * u} ${fy} L ${fx + 0.55 * u} ${fy} L ${kx + 0.25 * u} ${ky} L ${hip.x + 0.35 * u} ${hip.y} Z`} fill="#141418" />;
  };
  const lean = pose === 'run' ? 0.5 * u : pose === 'climb' ? 0.35 * u : 0;
  const headY = pose === 'look' ? -6.5 * u : -6.5 * u;
  if (pose === 'sit') {
    return (
      <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
        <path d={`M ${-0.9 * u} ${-0.2 * u} Q ${0.5 * u} ${-0.9 * u} ${1.9 * u} ${-0.3 * u} L ${1.9 * u} 0 L ${-1.0 * u} 0 Z`} fill="#141418" />
        <path d={`M ${-1.0 * u} ${-0.3 * u} L ${-0.85 * u} ${-2.8 * u} Q 0 ${-3.2 * u} ${0.8 * u} ${-2.8 * u} L ${0.7 * u} ${-0.4 * u} Z`} fill="#2b2a2e" />
        <path d={`M ${0.7 * u} ${-2.7 * u} L ${0.75 * u} ${-0.5 * u}`} stroke={rim} strokeWidth={0.12 * u} opacity={0.7} />
        <path d={`M ${0.6 * u} ${-2.4 * u} L ${1.4 * u} ${-1.1 * u} L ${1.7 * u} ${-1.2 * u}`} stroke={SKIN} strokeWidth={0.32 * u} fill="none" strokeLinecap="round" />
        <rect x={-0.15 * u} y={-3.25 * u} width={0.3 * u} height={0.4 * u} fill={SKIN} />
        <ellipse cx={0.05 * u} cy={-3.75 * u} rx={0.42 * u} ry={0.52 * u} fill={SKIN} />
        <path d={`M ${-0.45 * u} ${-3.8 * u} Q ${-0.3 * u} ${-4.4 * u} ${0.2 * u} ${-4.3 * u} Q ${0.5 * u} ${-4.1 * u} ${0.45 * u} ${-3.85 * u} Q 0 ${-4 * u} ${-0.45 * u} ${-3.5 * u} Z`} fill="#0b0a0c" />
        <path d={`M ${0.45 * u} ${-3.9 * u} Q ${0.5 * u} ${-3.5 * u} ${0.35 * u} ${-3.3 * u}`} stroke={rim} strokeWidth={0.08 * u} fill="none" />
      </g>
    );
  }
  const lookUp = pose === 'look';
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
      {leg(legB, pose === 'run' ? -0.6 : 0, 'b')}
      {leg(legA, pose === 'run' ? 0.7 : pose === 'climb' ? 0.9 : 0, 'a')}
      {pose === 'run' && <path d={`M ${-0.4 * u + lean} ${-5.4 * u} L ${-0.6 * u + lean - sw * 0.9 * u} ${-4.4 * u} L ${-0.2 * u + lean - sw * 1.3 * u} ${-3.7 * u}`} stroke="#6e4a38" strokeWidth={0.3 * u} fill="none" strokeLinecap="round" />}
      {pose === 'run' && <path d={`M ${-0.95 * u + lean} ${-5.6 * u} L ${-0.75 * u} ${-3.4 * u}`} stroke={rim} strokeWidth={0.1 * u} opacity={0.6} />}
      <path d={`M ${-0.75 * u} ${-3.3 * u} L ${-0.95 * u + lean} ${-5.6 * u} Q ${lean} ${-6.0 * u} ${0.95 * u + lean} ${-5.6 * u} L ${0.75 * u} ${-3.3 * u} Z`} fill="#2b2a2e" />
      <path d={`M ${0.95 * u + lean} ${-5.6 * u} L ${0.75 * u} ${-3.4 * u}`} stroke={rim} strokeWidth={0.12 * u} opacity={0.75} />
      <path d={`M ${0.6 * u + lean} ${-5.4 * u} L ${0.8 * u + lean + (pose === 'run' ? sw * 0.8 * u : 0)} ${-4.3 * u} L ${0.7 * u + lean + (pose === 'run' ? sw * 1.2 * u : 0.1 * u)} ${-3.4 * u}`} stroke={SKIN} strokeWidth={0.3 * u} fill="none" strokeLinecap="round" />
      <rect x={-0.15 * u + lean} y={-6.05 * u} width={0.3 * u} height={0.4 * u} fill={SKIN} />
      <g transform={lookUp ? `rotate(-28 ${lean} ${-6.2 * u})` : undefined}>
        <ellipse cx={0.05 * u + lean} cy={headY} rx={0.42 * u} ry={0.52 * u} fill={SKIN} />
        <path d={`M ${-0.47 * u + lean} ${headY} Q ${-0.3 * u + lean} ${headY - 0.65 * u} ${0.2 * u + lean} ${headY - 0.55 * u} Q ${0.5 * u + lean} ${headY - 0.35 * u} ${0.47 * u + lean} ${headY - 0.1 * u} Q ${lean} ${headY - 0.25 * u} ${-0.47 * u + lean} ${headY + 0.3 * u} Z`} fill="#0b0a0c" />
        <path d={`M ${0.47 * u + lean} ${headY - 0.1 * u} Q ${0.52 * u + lean} ${headY + 0.3 * u} ${0.35 * u + lean} ${headY + 0.48 * u}`} stroke={rim} strokeWidth={0.08 * u} fill="none" />
      </g>
    </g>
  );
};

/** Mae Nak: long black hair, pha sin skirt; silhouette mode for doorway. */
export const Wife: React.FC<{ x: number; y: number; h: number; dir?: number; baby?: boolean; sil?: boolean; kneel?: boolean; sway?: number; topC?: string; skirtC?: string }> = ({ x, y, h, dir = 1, baby, sil, kneel, sway = 0, topC = '#5a2a2a', skirtC = '#8a2e2e' }) => {
  const u = h / 7;
  const top = sil ? '#0b0709' : topC;
  const skirt = sil ? '#0b0709' : skirtC;
  const hair = '#050406';
  const skin = sil ? '#0b0709' : '#b98a68';
  const gold = sil ? '#0b0709' : '#c9a24a';
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1) rotate(${sway} 0 0)`}>
      {kneel ? (
        <path d={`M ${-1.4 * u} 0 Q ${-1.2 * u} ${-1.4 * u} ${-0.6 * u} ${-2.8 * u} L ${0.6 * u} ${-2.8 * u} Q ${1.4 * u} ${-1.2 * u} ${1.6 * u} 0 Z`} fill={skirt} />
      ) : (
        <path d={`M ${-0.6 * u} ${-3.6 * u} Q ${-0.75 * u} ${-1.5 * u} ${-0.65 * u} 0 L ${0.7 * u} 0 Q ${0.8 * u} ${-1.5 * u} ${0.6 * u} ${-3.6 * u} Z`} fill={skirt} />
      )}
      {!kneel && <rect x={-0.66 * u} y={-0.55 * u} width={1.36 * u} height={0.12 * u} fill={gold} />}
      <g transform={kneel ? `translate(0 ${2.4 * u})` : undefined}>
        <path d={`M ${-0.62 * u} ${-3.5 * u} L ${-0.8 * u} ${-5.5 * u} Q 0 ${-5.85 * u} ${0.8 * u} ${-5.5 * u} L ${0.62 * u} ${-3.5 * u} Z`} fill={top} />
        <rect x={-0.62 * u} y={-3.7 * u} width={1.24 * u} height={0.16 * u} fill={gold} />
        <rect x={-0.13 * u} y={-5.95 * u} width={0.26 * u} height={0.4 * u} fill={skin} />
        {/* long hair behind */}
        <path d={`M ${-0.42 * u} ${-6.4 * u} Q ${-0.75 * u} ${-4.6 * u} ${-0.7 * u} ${-2.9 * u} L ${-0.1 * u} ${-3.2 * u} Q ${-0.1 * u} ${-5.2 * u} ${0.2 * u} ${-6.4 * u} Z`} fill={hair} />
        <ellipse cx={0.05 * u} cy={-6.4 * u} rx={0.4 * u} ry={0.5 * u} fill={skin} />
        <path d={`M ${-0.47 * u} ${-6.25 * u} Q ${-0.35 * u} ${-7.0 * u} ${0.25 * u} ${-6.92 * u} Q ${0.5 * u} ${-6.7 * u} ${0.44 * u} ${-6.4 * u} Q ${0.1 * u} ${-6.7 * u} ${0.0 * u} ${-6.1 * u} L ${-0.2 * u} ${-5.6 * u} Z`} fill={hair} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${(-0.35 + i * 0.08) * u} ${-6.2 * u} Q ${(-0.7 + i * 0.05) * u} ${-4.8 * u} ${(-0.6 + i * 0.12) * u} ${(-3.0 - i * 0.1) * u}`} stroke={sil ? '#1a1214' : '#2a2026'} strokeWidth={0.04 * u} fill="none" />)}
        {baby ? (
          <g>
            <ellipse cx={0.55 * u} cy={-4.6 * u} rx={0.7 * u} ry={0.38 * u} fill={sil ? '#0b0709' : '#e8dccb'} transform={`rotate(-20 ${0.55 * u} ${-4.6 * u})`} />
            <circle cx={1.05 * u} cy={-4.95 * u} r={0.22 * u} fill={sil ? '#0b0709' : '#c99c78'} />
            <path d={`M ${0.5 * u} ${-5.3 * u} Q ${0.9 * u} ${-4.3 * u} ${1.2 * u} ${-4.6 * u}`} stroke={skin} strokeWidth={0.2 * u} fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <path d={`M ${0.55 * u} ${-5.3 * u} Q ${0.9 * u} ${-4.4 * u} ${1.3 * u} ${-4.0 * u}`} stroke={skin} strokeWidth={0.22 * u} fill="none" strokeLinecap="round" />
        )}
        {!sil && <path d={`M ${0.42 * u} ${-6.6 * u} Q ${0.52 * u} ${-6.2 * u} ${0.4 * u} ${-5.95 * u}`} stroke="#ffc46b" strokeWidth={0.07 * u} fill="none" />}
      </g>
    </g>
  );
};

/** Small wooden boat (sampan). */
export const Boat: React.FC<{ x: number; y: number; w: number; rock?: number }> = ({ x, y, w, rock = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rock})`}>
    <path d={`M ${-w / 2} ${-w * 0.08} Q 0 ${w * 0.08} ${w / 2} ${-w * 0.1} L ${w * 0.42} ${w * 0.02} Q 0 ${w * 0.12} ${-w * 0.42} ${w * 0.02} Z`} fill="#2a1d15" />
    <path d={`M ${-w / 2} ${-w * 0.08} Q 0 ${w * 0.03} ${w / 2} ${-w * 0.1}`} stroke="#7a5a3e" strokeWidth={w * 0.012} fill="none" />
  </g>
);

/** The pale, impossibly long hand reaching down between floorboards. ext 0..1 */
export const PaleHand: React.FC<{ x: number; y: number; ext: number; s?: number }> = ({ x, y, ext, s = 1 }) => {
  const L = 40 + 360 * ext;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><radialGradient id="hHandGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#cfd8e6" stopOpacity="0.4" /><stop offset="1" stopColor="#cfd8e6" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={8} cy={L * 0.6} rx={90} ry={L * 0.6 + 60} fill="url(#hHandGlow)" />
      <path d={`M -9 0 Q -4 ${L * 0.5} -12 ${L} L 14 ${L} Q 8 ${L * 0.5} 9 0 Z`} fill="#d8cbbb" />
      <path d={`M 9 0 Q 8 ${L * 0.5} 14 ${L}`} stroke="#f2ece4" strokeWidth={2.5} fill="none" />
      <g transform={`translate(1 ${L})`}>
        <path d="M -14 -4 Q -18 22 -10 40 L 14 40 Q 20 20 14 -4 Z" fill="#d8cbbb" />
        {[-10, -3, 4, 11].map((fx, i) => <path key={i} d={`M ${fx} 36 Q ${fx + 1} ${62 + (i === 1 || i === 2 ? 10 : 0)} ${fx - 2} ${80 + (i === 1 || i === 2 ? 10 : 0)}`} stroke="#d8cbbb" strokeWidth={6} strokeLinecap="round" fill="none" />)}
        <path d="M -12 6 Q -26 22 -24 36" stroke="#d8cbbb" strokeWidth={6} strokeLinecap="round" fill="none" />
        <path d="M 14 0 Q 20 20 13 40" stroke="#f2ece4" strokeWidth={2} fill="none" />
      </g>
    </g>
  );
};
