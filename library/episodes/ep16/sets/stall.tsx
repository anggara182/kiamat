import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "stall" (girls' bathroom: row of stalls, the third door, close-ups). Static bands baked ONCE to public/baked/stall/<band>.png. Ids "stall/<band>". */
export const SC = {
  tile: '#8fa39a', tileDark: '#2b3532', grout: '#1d2422', door: '#b9b2a3', doorShade: '#7d7769', doorDeep: '#4a4740',
  floor: '#3a4542', floorDark: '#151b1a', light: '#e8f6ff', red: '#c3283b', ink: '#080a0a',
};
export const FLOOR = 1540; // world y of floor line (frame y ~1348)
export const DOOR_TOP = 600;
export const STALLS = [{ x: 170 }, { x: 495 }, { x: 820 }]; // left edge of each stall front, width 310
export const SW = 310;

export const Defs: React.FC = () => (
  <defs>
    <pattern id="stTile" width="64" height="64" patternUnits="userSpaceOnUse">
      <rect width="64" height="64" fill="none" stroke={SC.grout} strokeWidth="3" />
    </pattern>
    <linearGradient id="stWall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#121816" /><stop offset="0.3" stopColor="#4f625b" /><stop offset="0.7" stopColor="#3b4a45" /><stop offset="1" stopColor="#1e2624" />
    </linearGradient>
    <radialGradient id="stWallLight" cx="0.55" cy="0.2" r="0.6">
      <stop offset="0" stopColor={SC.light} stopOpacity="0.32" /><stop offset="1" stopColor={SC.light} stopOpacity="0" />
    </radialGradient>
    <linearGradient id="stFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3f4b47" /><stop offset="1" stopColor="#0b0f0e" />
    </linearGradient>
    <linearGradient id="stDoor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#d4cebf" /><stop offset="0.5" stopColor={SC.door} /><stop offset="1" stopColor={SC.doorShade} />
    </linearGradient>
    <linearGradient id="stGrime" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3a3426" stopOpacity="0" /><stop offset="1" stopColor="#3a3426" stopOpacity="0.45" />
    </linearGradient>
  </defs>
);

const Wall: React.FC = () => (
  <g>
    <rect width={W} height={FLOOR} fill="url(#stWall)" />
    <rect width={W} height={FLOOR} fill="url(#stTile)" opacity={0.55} />
    <rect width={W} height={FLOOR} fill="url(#stWallLight)" />
    <rect y={FLOOR} width={W} height={H - FLOOR} fill="url(#stFloor)" />
    {Array.from({ length: 14 }).map((_, i) => (
      <line key={i} x1={W / 2 + (i - 7) * 70} y1={FLOOR} x2={W / 2 + (i - 7) * 260} y2={H} stroke={SC.ink} strokeOpacity={0.35} strokeWidth={3} />
    ))}
    {[0, 1, 2, 3, 4].map((i) => {
      const y = FLOOR + 40 * Math.pow(1.7, i);
      return <line key={'h' + i} x1={0} y1={y} x2={W} y2={y} stroke={SC.ink} strokeOpacity={0.3} strokeWidth={3} />;
    })}
    <rect y={FLOOR - 8} width={W} height={10} fill={SC.ink} opacity={0.6} />
    {/* fluorescent fixture */}
    <rect x={520} y={330} width={340} height={22} rx={6} fill="#20262a" />
  </g>
);

/** One stall front; `open` 0..1 leaves the door ajar (dark gap). */
export const StallFront: React.FC<{ x: number; open?: number; num?: string; door?: boolean }> = ({ x, open = 0, num, door = true }) => {
  const r = rng(x);
  return (
    <g>
      {/* partition top shadow & pilasters */}
      <rect x={x - 14} y={DOOR_TOP - 40} width={SW + 28} height={30} fill={SC.doorDeep} />
      <rect x={x - 14} y={DOOR_TOP - 10} width={20} height={FLOOR - DOOR_TOP + 10} fill={SC.doorShade} />
      <rect x={x + SW - 6} y={DOOR_TOP - 10} width={20} height={FLOOR - DOOR_TOP + 10} fill={SC.doorShade} />
      <rect x={x + 6} y={DOOR_TOP} width={SW - 12} height={FLOOR - 70 - DOOR_TOP} fill={SC.ink} />
      {door && (
        <g transform={`translate(${x + 6} 0) scale(${1 - open * 0.75} 1)`}>
          <rect x={0} y={DOOR_TOP} width={SW - 12} height={FLOOR - 70 - DOOR_TOP} fill="url(#stDoor)" />
          <rect x={0} y={DOOR_TOP} width={SW - 12} height={FLOOR - 70 - DOOR_TOP} fill="url(#stGrime)" />
          {Array.from({ length: 5 }).map((_, i) => (
            <path key={i} d={`M ${20 + r() * 240} ${FLOOR - 140 - r() * 300} q ${r() * 10 - 5} 60 ${r() * 6 - 3} ${80 + r() * 120}`} stroke="#5a5240" strokeOpacity={0.25} strokeWidth={4 + r() * 6} fill="none" strokeLinecap="round" />
          ))}
          <rect x={SW - 50} y={1010} width={18} height={60} rx={6} fill="#5e5a52" />
          {num && <g><rect x={(SW - 12) / 2 - 34} y={DOOR_TOP + 60} width={68} height={68} rx={8} fill="#e9e4d6" stroke={SC.doorDeep} strokeWidth={4} />
            <text x={(SW - 12) / 2} y={DOOR_TOP + 112} textAnchor="middle" fontFamily="serif" fontWeight="700" fontSize="54" fill="#2a2620">{num}</text></g>}
        </g>
      )}
      {/* gap under door */}
      <rect x={x + 6} y={FLOOR - 70} width={SW - 12} height={62} fill={SC.ink} opacity={0.92} />
    </g>
  );
};

const Sink: React.FC = () => (
  <g>
    <rect x={-20} y={1150} width={150} height={40} rx={10} fill="#a9b4ae" />
    <path d={`M -20 1190 h 150 l -30 90 h -100 z`} fill="#6f7c76" />
    <rect x={-20} y={700} width={130} height={360} fill="#1c2422" stroke="#56645e" strokeWidth={8} />
    <rect x={0} y={720} width={90} height={320} fill="url(#stWallLight)" opacity={0.6} />
  </g>
);

const Room: React.FC<{ third: boolean }> = ({ third }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
    <Defs />
    <Wall />
    <Sink />
    <StallFront x={STALLS[0].x} open={0.3} num="1" />
    <StallFront x={STALLS[1].x} open={0.18} num="2" />
    {third ? <StallFront x={STALLS[2].x} num="3" /> : (
      <g>
        {/* bare wall where the third stall should be: a faint cleaner rectangle of tiles */}
        <rect x={STALLS[2].x + 10} y={DOOR_TOP - 30} width={SW - 20} height={FLOOR - DOOR_TOP + 22} fill="#6d8079" opacity={0.18} />
      </g>
    )}
    <rect x={STALLS[2].x + SW + 14} y={DOOR_TOP - 40} width={W} height={FLOOR - DOOR_TOP + 40} fill="#1a211f" opacity={0.55} />
  </svg>
);

/** close-up of the third door's surface (shots 6, 8, 9). Door spans the whole frame. */
const DoorClose: React.FC = () => {
  const r = rng(33);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Defs />
      <rect width={W} height={H} fill="#262e2c" />
      <rect width={W} height={H} fill="url(#stTile)" opacity={0.5} transform="scale(2.4)" />
      <rect x={180} y={0} width={940} height={H} fill="url(#stDoor)" />
      <rect x={180} y={0} width={940} height={H} fill="url(#stGrime)" />
      <rect x={140} y={0} width={44} height={H} fill={SC.doorDeep} />
      <rect x={1116} y={0} width={44} height={H} fill={SC.doorDeep} />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M ${220 + r() * 860} ${r() * H} q ${r() * 30 - 15} 120 ${r() * 10 - 5} ${150 + r() * 260}`} stroke="#5a5240" strokeOpacity={0.18} strokeWidth={6 + r() * 14} fill="none" strokeLinecap="round" />
      ))}
      <rect x={560} y={460} width={180} height={180} rx={16} fill="#e9e4d6" stroke={SC.doorDeep} strokeWidth={8} />
      <text x={650} y={600} textAnchor="middle" fontFamily="serif" fontWeight="700" fontSize="140" fill="#2a2620">3</text>
      <circle cx={600} cy={480} r={6} fill="#6a655a" /><circle cx={700} cy={620} r={6} fill="#6a655a" />
    </svg>
  );
};

export const STALL: Record<string, BandSpec> = {
  'stall/room': { node: () => <Room third /> },
  'stall/room2': { node: () => <Room third={false} /> },
  'stall/door': { node: () => <DoorClose /> },
};
