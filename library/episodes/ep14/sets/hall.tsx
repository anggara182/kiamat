import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Elevator opening in the lobby band (world coords). */
export const LDOOR = { x0: 470, x1: 826, y0: 700, y1: 1420 };
/** Hallway vanishing point (shot 6). */
export const HVP = { x: 648, y: 1020 };

/** Set "hall" (apartment lobby and hallways at night, the doors opening onto floors). Static bands baked ONCE to public/baked/hall/<band>.png. Ids "hall/<band>". */
export const HALL: Record<string, BandSpec> = {
  /** lobby: walls, floor, elevator frame + indicator, exit sign, mailboxes */
  'hall/lobby': {
    node: () => {
      const d = LDOOR;
      return (
        <g>
          <defs>
            <linearGradient id="hlWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141820" /><stop offset="0.5" stopColor="#2c3340" /><stop offset="1" stopColor="#1a1f28" /></linearGradient>
            <linearGradient id="hlFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#262b34" /><stop offset="1" stopColor="#0b0d12" /></linearGradient>
            <radialGradient id="hlPool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#e9f3ff" stopOpacity="0.28" /><stop offset="1" stopColor="#e9f3ff" stopOpacity="0" /></radialGradient>
            <radialGradient id="hlExit" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#3dff8a" stopOpacity="0.45" /><stop offset="1" stopColor="#3dff8a" stopOpacity="0" /></radialGradient>
            <radialGradient id="hlAmb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb000" stopOpacity="0.35" /><stop offset="1" stopColor="#ffb000" stopOpacity="0" /></radialGradient>
          </defs>
          <rect x={0} y={0} width={W} height={H} fill="url(#hlWall)" />
          <rect x={0} y={d.y1} width={W} height={H - d.y1} fill="url(#hlFloor)" />
          {/* ceiling light pool on wall + floor */}
          <ellipse cx={648} cy={760} rx={560} ry={520} fill="url(#hlPool)" />
          <ellipse cx={648} cy={d.y1 + 120} rx={520} ry={140} fill="url(#hlPool)" />
          <rect x={430} y={330} width={436} height={18} rx={6} fill="#e9f3ff" opacity={0.9} />
          {/* steel surround */}
          <rect x={d.x0 - 46} y={d.y0 - 46} width={d.x1 - d.x0 + 92} height={d.y1 - d.y0 + 46} fill="#4a535e" />
          <rect x={d.x0 - 22} y={d.y0 - 22} width={d.x1 - d.x0 + 44} height={d.y1 - d.y0 + 22} fill="#2a3038" />
          <rect x={d.x0} y={d.y0} width={d.x1 - d.x0} height={d.y1 - d.y0} fill="#0a0c10" />
          {/* floor indicator housing */}
          <rect x={578} y={560} width={140} height={74} rx={8} fill="#0b0d12" stroke="#4a535e" strokeWidth={6} />
          <ellipse cx={648} cy={597} rx={150} ry={70} fill="url(#hlAmb)" />
          {/* call button */}
          <rect x={d.x1 + 70} y={1010} width={40} height={90} rx={8} fill="#4a535e" />
          <circle cx={d.x1 + 90} cy={1055} r={11} fill="#ffb000" opacity={0.85} />
          {/* exit sign left of the lift, fully in frame */}
          <ellipse cx={330} cy={440} rx={170} ry={100} fill="url(#hlExit)" />
          <rect x={270} y={416} width={120} height={48} rx={4} fill="#3dff8a" />
          <rect x={284} y={430} width={30} height={20} fill="#0b3a1e" />
          <rect x={324} y={430} width={52} height={8} fill="#0b3a1e" /><rect x={324} y={442} width={40} height={8} fill="#0b3a1e" />
          {/* mailbox block right */}
          <rect x={1010} y={940} width={240} height={360} fill="#161a22" />
          {[0, 1, 2, 3].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={1024 + c * 114} y={956 + r * 84} width={100} height={70} fill="#202631" />))}
          {/* reflection of door on floor */}
          <rect x={d.x0 - 46} y={d.y1} width={d.x1 - d.x0 + 92} height={180} fill="#4a535e" opacity={0.12} />
          {/* fg pillars (dark framing) */}
          <rect x={-40} y={0} width={150} height={H} fill="#07090d" />
          <rect x={W - 110} y={0} width={150} height={H} fill="#07090d" />
          <rect x={0} y={0} width={W} height={120} fill="#07090d" />
        </g>
      );
    },
  },
  /** dim 5th-floor hallway seen through the opening doors */
  'hall/corridor': {
    node: () => {
      const v = HVP, L = 150, R = 1146, T = 380, B = 1700;
      const iL = v.x - 120, iR = v.x + 120, iT = v.y - 230, iB = v.y + 130;
      return (
        <g>
          <defs>
            <linearGradient id="hcWall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1a1f28" /><stop offset="1" stopColor="#3a4250" /></linearGradient>
            <linearGradient id="hcWallR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#1a1f28" /><stop offset="1" stopColor="#3a4250" /></linearGradient>
            <radialGradient id="hcEnd" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#c9c0b0" stopOpacity="0.55" /><stop offset="1" stopColor="#c9c0b0" stopOpacity="0" /></radialGradient>
            <radialGradient id="hcExit" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#3dff8a" stopOpacity="0.5" /><stop offset="1" stopColor="#3dff8a" stopOpacity="0" /></radialGradient>
          </defs>
          <rect x={0} y={0} width={W} height={H} fill="#0d1016" />
          <polygon points={`${L},${T} ${iL},${iT} ${iL},${iB} ${L},${B}`} fill="url(#hcWall)" />
          <polygon points={`${R},${T} ${iR},${iT} ${iR},${iB} ${R},${B}`} fill="url(#hcWallR)" />
          <polygon points={`${L},${T} ${R},${T} ${iR},${iT} ${iL},${iT}`} fill="#151922" />
          <polygon points={`${L},${B} ${R},${B} ${iR},${iB} ${iL},${iB}`} fill="#1c2029" />
          <rect x={iL} y={iT} width={iR - iL} height={iB - iT} fill="#4a4f58" />
          <ellipse cx={v.x} cy={v.y - 40} rx={360} ry={420} fill="url(#hcEnd)" />
          {/* doors on the side walls */}
          <polygon points={`${L + 120},${T + 260} ${L + 260},${T + 330} ${L + 260},${B - 330} ${L + 120},${B - 180}`} fill="#12151c" />
          <polygon points={`${R - 120},${T + 260} ${R - 260},${T + 330} ${R - 260},${B - 330} ${R - 120},${B - 180}`} fill="#12151c" />
          {/* ceiling lamp (one weak) */}
          <polygon points={`${v.x - 60},${T + 120} ${v.x + 60},${T + 120} ${v.x + 40},${T + 140} ${v.x - 40},${T + 140}`} fill="#c9c0b0" opacity={0.6} />
          {/* exit sign at the far end */}
          <ellipse cx={v.x} cy={iT + 40} rx={110} ry={60} fill="url(#hcExit)" />
          <rect x={v.x - 34} y={iT + 28} width={68} height={24} fill="#3dff8a" />
        </g>
      );
    },
  },
  /** concrete stairwell, flights zig-zagging down, exit sign glow */
  'hall/stairs': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="hsWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b323d" /><stop offset="1" stopColor="#0c0e13" /></linearGradient>
          <radialGradient id="hsExit" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#3dff8a" stopOpacity="0.55" /><stop offset="1" stopColor="#3dff8a" stopOpacity="0" /></radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#hsWall)" />
        <ellipse cx={980} cy={420} rx={420} ry={360} fill="url(#hsExit)" />
        <rect x={920} y={396} width={120} height={46} rx={4} fill="#3dff8a" />
        {/* flights: descending to the left, then right */}
        {[0, 1, 2].map((i) => {
          const y = 700 + i * 560, dir = i % 2 === 0 ? -1 : 1, x0 = dir < 0 ? 1100 : 200;
          const steps = Array.from({ length: 9 }, (_, s) => `L ${x0 + dir * (s + 1) * 90} ${y + s * 50} L ${x0 + dir * (s + 1) * 90} ${y + (s + 1) * 50}`).join(' ');
          return (
            <g key={i}>
              <path d={`M ${x0} ${y} ${steps} L ${x0 + dir * 810} ${y + 520} L ${x0} ${y + 520} Z`} fill={i === 0 ? '#3a4250' : '#262c36'} opacity={1 - i * 0.15} />
              <line x1={x0} y1={y - 120} x2={x0 + dir * 810} y2={y + 330} stroke="#7b8794" strokeWidth={8} opacity={0.6} />
            </g>
          );
        })}
        <rect x={0} y={0} width={110} height={H} fill="#07090d" />
        <rect x={W - 80} y={0} width={80} height={H} fill="#07090d" />
      </g>
    ),
  },
};
