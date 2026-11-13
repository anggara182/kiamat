import React from 'react';
import { W, H } from './world';
import { WaterTower, roofRows, RUMOUR } from './kampung_tower';

/** EP02 set "kampung" scenes (world 1296x2304; frame window (108,192)..(1188,2112)). */

/* ------------------------------------------------------------------ shared geometry */
export const GATE = { gy: 1565, l: 300, r: 996, pw: 80, top: 980, archTop: 1060 };
export const INSIDE = { floor: 1600, door: { x: 770, y: 640, w: 330, h: 940 }, mic: { x: 640, y: 1600 } };
export const DUSK_TOWER = { cx: 820, gy: 1760, s: 0.75 };
export const RUMOUR_TOWER = { cx: 648, gy: 1560, s: 1 };
export const DUSK_ROWS = roofRows(17, [
  { eave: 1640, w0: 60, w1: 110, h0: 26, h1: 46, s: 0.75 },
  { eave: 1760, w0: 90, w1: 160, h0: 34, h1: 60, s: 0.95 },
  { eave: 1920, w0: 140, w1: 250, h0: 50, h1: 86, s: 1.2 },
], (x) => Math.abs(x - DUSK_TOWER.cx) < 160);

/* ------------------------------------------------------------------ rumour image (shots 5, 12) */
export const RumourBand: React.FC = () => {
  const R = RUMOUR, { cx, gy } = RUMOUR_TOWER;
  const house = (x: number, k: string) => (
    <g key={k} fill={R.ground}>
      <rect x={x - 130} y={gy - 230} width={260} height={230} />
      <polygon points={`${x - 160},${gy - 225} ${x},${gy - 360} ${x + 160},${gy - 225}`} />
      <rect x={x - 30} y={gy - 160} width={60} height={60} fill={R.mid} />
    </g>
  );
  const post = (x: number, k: string) => <g key={k} fill={R.sil}><rect x={x - 5} y={gy - 520} width={10} height={520} /><rect x={x - 40} y={gy - 520} width={80} height={8} /></g>;
  return (
    <g>
      <defs>
        <pattern id="rmDots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.6" fill="#0d1018" /></pattern>
      </defs>
      {/* flat stepped sky, no gradient: reads as a drawing */}
      <rect x={0} y={0} width={W} height={H} fill={R.sky} />
      <rect x={0} y={0} width={W} height={700} fill="#434c60" />
      <rect x={0} y={0} width={W} height={380} fill="#3c4458" />
      <circle cx={cx} cy={470} r={125} fill={R.pale} />
      {house(cx - 420, 'hl')}{house(cx + 420, 'hr')}
      {post(cx - 250, 'pl')}{post(cx + 250, 'pr')}
      <rect x={0} y={gy} width={W} height={H - gy} fill={R.ground} />
      <ellipse cx={cx} cy={gy + 10} rx={330} ry={46} fill={R.mid} />
      <WaterTower cx={cx} gy={gy} s={RUMOUR_TOWER.s} p={{ steel: R.sil, tank: R.sil, tankHi: R.sil, rim: R.pale, rimO: 0, detail: false }} />
      <rect x={0} y={0} width={W} height={H} fill="url(#rmDots)" opacity={0.16} />
    </g>
  );
};

/* ------------------------------------------------------------------ real water tower at dusk (shot 22) */
export const DUSK = { top: '#2a2140', mid: '#3b2c52', low: '#c96b5c', hz: '#f0b27a', roofA: '#2a1f3a', roofB: '#221a32', roofC: '#18122a', win: '#ffcf86' };
export const DuskBand: React.FC = () => {
  const D = DUSK; const T = DUSK_TOWER;
  return (
    <g>
      <defs>
        <linearGradient id="dkSky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1700"><stop offset="0" stopColor={D.top} /><stop offset="0.55" stopColor={D.mid} /><stop offset="0.82" stopColor={D.low} /><stop offset="1" stopColor={D.hz} /></linearGradient>
        <radialGradient id="dkSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffe0a8" stopOpacity={0.9} /><stop offset="0.3" stopColor="#f6b07a" stopOpacity={0.5} /><stop offset="1" stopColor="#f0b27a" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#dkSky)" />
      <ellipse cx={330} cy={1640} rx={620} ry={380} fill="url(#dkSun)" />
      {/* thin calm cloud streaks low (keeps the quote area clean) */}
      {[[260, 1260, 420], [980, 1340, 360]].map(([x, y, w], i) => <ellipse key={i} cx={x} cy={y} rx={w / 2} ry={7} fill="#e8987a" opacity={0.35} />)}
      {/* distant minaret + far roofline */}
      <g fill="#4a3456">
        <path d={`M-20 1700 V1600 ${Array.from({ length: 30 }).map((_, i) => `H${i * 45} V${1580 + ((i * 29) % 40)} H${i * 45 + 34}`).join(' ')} H${W + 20} V1700 Z`} />
        <rect x={232} y={1330} width={16} height={290} /><rect x={224} y={1400} width={32} height={6} /><path d="M232 1332 Q240 1300 248 1332 Z" /><rect x={239} y={1290} width={2} height={20} />
      </g>
      <WaterTower cx={T.cx} gy={T.gy} s={T.s} p={{ steel: '#251b33', tank: '#2e2238', tankHi: '#5a3a4a', rim: '#ffc28a', rimO: 0.8, detail: true }} />
      {DUSK_ROWS.map((r, i) => <path key={i} d={r.d} fill={[D.roofA, D.roofB, D.roofC][i]} />)}
    </g>
  );
};

/* ------------------------------------------------------------------ mosque gate, day (shot 10) */
export const DAY = { sky: '#e9eef0', skyTop: '#cfdce3', wall: '#d8cdb8', shade: '#8f846f', trim: '#5f7a62', ground: '#cdbf9f', groundD: '#b3a585', foliage: '#4d5a49', shadow: '#2a2018' };
export const GateBand: React.FC = () => {
  const D = DAY, G = GATE;
  const pillar = (x: number, k: string) => (
    <g key={k}>
      <rect x={x} y={G.top} width={G.pw} height={G.gy - G.top} fill={D.wall} />
      <rect x={x + G.pw * 0.62} y={G.top} width={G.pw * 0.38} height={G.gy - G.top} fill={D.shade} opacity={0.55} />
      <rect x={x - 10} y={G.top - 20} width={G.pw + 20} height={24} fill={D.trim} />
      <path d={`M${x + 4} ${G.top - 20} Q${x + G.pw / 2} ${G.top - 110} ${x + G.pw - 4} ${G.top - 20} Z`} fill={D.trim} />
      <rect x={x + G.pw / 2 - 2} y={G.top - 140} width={4} height={34} fill="#6a6a5a" />
      <rect x={x - 6} y={G.gy - 40} width={G.pw + 12} height={40} fill={D.groundD} />
    </g>
  );
  const ax0 = G.l + G.pw, ax1 = G.r, acx = (ax0 + ax1) / 2;
  return (
    <g>
      <defs>
        <linearGradient id="gtSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={D.skyTop} /><stop offset="0.6" stopColor={D.sky} /><stop offset="1" stopColor="#f6f3ea" /></linearGradient>
        <radialGradient id="gtSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#ffffff" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#gtSky)" />
      <circle cx={240} cy={420} r={380} fill="url(#gtSun)" opacity={0.8} />
      {/* mosque behind: dome, minaret, facade */}
      <circle cx={acx} cy={820} r={175} fill="#9fb0a2" />
      <path d={`M${acx - 175} 820 A175 175 0 0 1 ${acx - 40} 650 Q${acx - 120} 720 ${acx - 110} 820 Z`} fill="#c3cfc4" />
      <rect x={acx - 2} y={600} width={4} height={50} fill="#6a6a5a" />
      <rect x={1110} y={420} width={60} height={1100} fill={D.wall} /><rect x={1146} y={420} width={24} height={1100} fill={D.shade} opacity={0.5} />
      <rect x={1096} y={640} width={88} height={16} fill={D.trim} /><rect x={1096} y={880} width={88} height={16} fill={D.trim} />
      <path d="M1106 422 Q1140 320 1174 422 Z" fill={D.trim} />
      <rect x={80} y={980} width={1140} height={600} fill="#cfc2a8" />
      {[200, 420, 870, 1050].map((x) => <path key={x} d={`M${x} 1300 V1120 A40 40 0 0 1 ${x + 80} 1120 V1300 Z`} fill="#6e6656" />)}
      <rect x={60} y={970} width={1180} height={22} fill={D.trim} />
      {/* trees at the sides */}
      <g fill={D.foliage}>
        <circle cx={60} cy={1050} r={170} /><circle cx={180} cy={1180} r={130} /><circle cx={-20} cy={1260} r={150} />
        <circle cx={1240} cy={1150} r={140} /><circle cx={1300} cy={1020} r={150} />
      </g>
      <g fill="#3f4a3c"><circle cx={110} cy={1110} r={90} /><circle cx={1260} cy={1220} r={80} /></g>
      {/* front fence wall left/right of the gate */}
      <rect x={-20} y={1300} width={G.l + 20} height={G.gy - 1300} fill={D.wall} />
      <rect x={G.r + G.pw} y={1300} width={W - G.r} height={G.gy - 1300} fill={D.wall} />
      <rect x={-20} y={1290} width={G.l + 20} height={16} fill={D.trim} /><rect x={G.r + G.pw} y={1290} width={W - G.r} height={16} fill={D.trim} />
      {/* arch: shaded courtyard seen through it */}
      <path d={`M${ax0} ${G.gy} V${G.archTop + 120} Q${ax0} ${G.archTop - 30} ${acx} ${G.archTop - 90} Q${ax1} ${G.archTop - 30} ${ax1} ${G.archTop + 120} V${G.gy} Z`} fill={D.shade} />
      <rect x={ax0} y={G.gy - 260} width={ax1 - ax0} height={260} fill="#7d735f" />
      <path d={`M${acx - 70} ${G.gy - 100} V${G.gy - 300} A70 70 0 0 1 ${acx + 70} ${G.gy - 300} V${G.gy - 100} Z`} fill="#4a4436" />
      {/* arch frame above the opening */}
      <path d={`M${G.l} ${G.top} H${G.r + G.pw} V${G.archTop + 120} Q${ax1} ${G.archTop - 30} ${acx} ${G.archTop - 90} Q${ax0} ${G.archTop - 30} ${ax0} ${G.archTop + 120} H${G.l} Z`} fill={D.wall} />
      <rect x={G.l - 10} y={G.top - 8} width={G.r + G.pw - G.l + 20} height={20} fill={D.trim} />
      <rect x={acx - 90} y={G.top + 30} width={180} height={34} fill={D.trim} opacity={0.6} />
      {pillar(G.l, 'l')}{pillar(G.r, 'r')}
      {/* open iron gate leaves folded against the pillars */}
      <g stroke="#3a3a36" strokeWidth={5}>{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${ax0 + 8 + i * 16} ${G.gy - 6} V${G.gy - 300}`} />)}{[0, 1, 2, 3, 4].map((i) => <path key={`r${i}`} d={`M${ax1 - 8 - i * 16} ${G.gy - 6} V${G.gy - 300}`} />)}</g>
      <rect x={ax0 + 4} y={G.gy - 304} width={70} height={6} fill="#3a3a36" /><rect x={ax1 - 74} y={G.gy - 304} width={70} height={6} fill="#3a3a36" />
      {/* yard + hard shadows of the gate (sun high, left) */}
      <rect x={0} y={G.gy} width={W} height={H - G.gy} fill={D.ground} />
      <path d={`M${G.l} ${G.gy} H${G.r + G.pw + 140} L${G.r + G.pw + 200} ${G.gy + 90} H${G.l + 60} Z`} fill={D.shadow} opacity={0.22} />
      <rect x={0} y={G.gy + 260} width={W} height={H} fill={D.groundD} opacity={0.5} />
    </g>
  );
};

/* ------------------------------------------------------------------ mosque interior, day (shot 19) */
export const InsideBand: React.FC = () => {
  const D = INSIDE.door, F = INSIDE.floor;
  return (
    <g>
      <defs>
        <linearGradient id="inWall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b8b09c" /><stop offset="1" stopColor="#d6cfbd" /></linearGradient>
        <linearGradient id="inOut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7f6f0" /><stop offset="0.55" stopColor="#f1ede2" /><stop offset="1" stopColor="#d9cdb1" /></linearGradient>
        <linearGradient id="inShaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6e2" stopOpacity={0.5} /><stop offset="1" stopColor="#fff6e2" stopOpacity={0.05} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#inWall)" />
      {/* tiled wainscot + calligraphy-free decorative band (plain geometry) */}
      <rect x={0} y={1180} width={W} height={F - 1180} fill="#7f978b" />
      {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={i * 62} y={1180} width={2} height={F - 1180} fill="#6c8478" />)}
      <rect x={0} y={1168} width={W} height={14} fill="#5f7a62" />
      <rect x={0} y={420} width={W} height={26} fill="#a8a08c" />
      {/* arched window (back wall, left) */}
      <path d="M150 1100 V700 A110 110 0 0 1 370 700 V1100 Z" fill="#eef0ea" />
      <g stroke="#6e6656" strokeWidth={8} fill="none"><path d="M150 1100 V700 A110 110 0 0 1 370 700 V1100 Z" /><path d="M260 590 V1100 M150 860 H370" /></g>
      {/* pillar */}
      <rect x={560} y={0} width={110} height={F} fill="#cfc7b3" /><rect x={620} y={0} width={50} height={F} fill="#a89f8a" />
      <rect x={545} y={F - 70} width={140} height={70} fill="#b8af99" />
      {/* doorway to the bright yard */}
      <rect x={D.x} y={D.y} width={D.w} height={D.h} fill="url(#inOut)" />
      <rect x={D.x} y={D.y + D.h * 0.62} width={D.w} height={D.h * 0.38} fill="#d6c9ab" />
      <rect x={D.x + 210} y={D.y + 120} width={90} height={D.h * 0.5} fill="#cfd6c8" />
      <g fill="#5a4630"><rect x={D.x - 26} y={D.y - 26} width={26} height={D.h + 26} /><rect x={D.x + D.w} y={D.y - 26} width={26} height={D.h + 26} /><rect x={D.x - 26} y={D.y - 26} width={D.w + 52} height={26} /></g>
      <path d={`M${D.x + D.w + 26} ${D.y} L${D.x + D.w + 150} ${D.y - 40} L${D.x + D.w + 150} ${D.y + D.h + 30} L${D.x + D.w + 26} ${D.y + D.h} Z`} fill="#6e5538" />
      {/* carpet with prayer-row stripes */}
      <rect x={0} y={F} width={W} height={H - F} fill="#7f3434" />
      {[0, 1, 2, 3, 4, 5].map((i) => { const y = F + 30 + i * i * 22 + i * 60; return <rect key={i} x={0} y={y} width={W} height={6 + i * 2} fill="#a9554a" opacity={0.6} />; })}
      {/* light from the door across the carpet */}
      <path d={`M${D.x} ${F} H${D.x + D.w} L${D.x + D.w - 220} ${H} H${D.x - 520} Z`} fill="url(#inShaft)" />
      {/* low table with the amplifier */}
      <g><rect x={170} y={1440} width={250} height={16} fill="#5a4630" /><rect x={190} y={1456} width={14} height={F - 1456} fill="#5a4630" /><rect x={386} y={1456} width={14} height={F - 1456} fill="#5a4630" />
        <rect x={210} y={1350} width={170} height={90} fill="#2f3234" /><rect x={226} y={1368} width={60} height={10} fill="#5a6064" />{[0, 1, 2].map((i) => <circle key={i} cx={310 + i * 22} cy={1395} r={7} fill="#5a6064" />)}<circle cx={240} cy={1415} r={3} fill="#7fdc8a" /></g>
    </g>
  );
};

/* ------------------------------------------------------------------ loudspeaker horns on a pole, low angle (shot 18, live) */
export const HORNS = { x: 640, y: 760 };
export const HornPole: React.FC<{ shake: number }> = ({ shake }) => {
  const { x, y } = HORNS;
  const horn = (ang: number, k: string) => (
    <g key={k} transform={`translate(${x} ${y}) rotate(${ang})`}>
      <rect x={0} y={-10} width={70} height={20} fill="#6f757a" />
      <rect x={70} y={-26} width={44} height={52} rx={8} fill="#8a9095" />
      <path d="M114 -22 L300 -88 L300 88 L114 22 Z" fill="#a9afb3" />
      <path d="M114 4 L300 30 L300 88 L114 22 Z" fill="#7d8388" />
      <ellipse cx={300} cy={0} rx={22} ry={88} fill="#3a3e42" />
      <ellipse cx={302} cy={0} rx={12} ry={56} fill="#1f2225" />
      <path d="M118 -20 L298 -84" stroke="#e8ecee" strokeWidth={4} strokeOpacity={0.8} />
    </g>
  );
  return (
    <g transform={`translate(${shake * 4} ${-shake * 3}) rotate(${shake * 0.6} ${x} ${y})`}>
      {/* pole rising from below (low angle, converging) */}
      <path d={`M${x - 20} ${y + 40} L${x + 20} ${y + 40} L${x + 52} ${H + 200} L${x - 52} ${H + 200} Z`} fill="#5d6368" />
      <path d={`M${x - 20} ${y + 40} L${x - 6} ${y + 40} L${x - 18} ${H + 200} L${x - 52} ${H + 200} Z`} fill="#c9cfd2" opacity={0.6} />
      {/* bracket ring + cables */}
      <rect x={x - 28} y={y - 20} width={56} height={70} rx={8} fill="#4a5054" />
      <path d={`M${x + 10} ${y + 40} Q${x + 30} ${y + 600} ${x + 22} ${H + 200}`} stroke="#2a2d30" strokeWidth={6} fill="none" />
      <path d={`M${x - 8} ${y + 40} Q${x - 26} ${y + 700} ${x - 30} ${H + 200}`} stroke="#2a2d30" strokeWidth={5} fill="none" />
      {horn(-160, 'a')}{horn(-20, 'b')}{horn(-128, 'c')}{horn(-52, 'd')}
    </g>
  );
};
