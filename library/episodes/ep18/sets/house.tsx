import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "house" (inside the nipa hut). World 1296x2304. Floor line y=1560, window upper-left, lamp area right-centre. */
export const HFLOOR = 1560;

const Room: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hwall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#120e0a" /><stop offset="0.45" stopColor="#2a2318" /><stop offset="1" stopColor="#1a140d" />
      </linearGradient>
      <radialGradient id="hlampwash" cx="0.62" cy="0.55" r="0.5">
        <stop offset="0" stopColor="#8a6634" stopOpacity="0.85" /><stop offset="0.5" stopColor="#5a4426" stopOpacity="0.4" /><stop offset="1" stopColor="#2a2318" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hfloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a2c1a" /><stop offset="1" stopColor="#0d0a07" />
      </linearGradient>
      <radialGradient id="hmoonwin" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#cdd6ee" stopOpacity="0.35" /><stop offset="1" stopColor="#cdd6ee" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill="url(#hwall)" />
    <rect x={0} y={0} width={W} height={H} fill="url(#hlampwash)" />
    {/* woven bamboo: a few faint diagonal bands only */}
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${-200 + i * 260} ${HFLOOR} L ${200 + i * 260} 500`} stroke="#6b5638" strokeWidth={60} opacity={0.06} />)}
    {/* capiz window, upper left, moonlit */}
    <circle cx={300} cy={820} r={420} fill="url(#hmoonwin)" />
    <rect x={150} y={640} width={300} height={360} fill="#0e0f14" />
    {[0, 1, 2].map((r) => [0, 1].map((c) => (
      <rect key={`${r}${c}`} x={168 + c * 142} y={658 + r * 112} width={124} height={98} fill="#e9e2cf" opacity={0.28 + 0.06 * (r + c)} />
    )))}
    <rect x={140} y={630} width={320} height={380} fill="none" stroke="#1c160e" strokeWidth={20} />
    {/* posts */}
    <rect x={40} y={300} width={50} height={1300} fill="#140f0a" />
    <rect x={1150} y={300} width={56} height={1300} fill="#140f0a" />
    {/* ceiling beam + thatch slope */}
    <path d={`M 0 0 L ${W} 0 L ${W} 330 Q 648 470 0 330 Z`} fill="#0b0906" />
    <path d={`M 0 330 Q 648 470 ${W} 330`} stroke="#3d3322" strokeWidth={14} fill="none" />
    <rect x={0} y={420} width={W} height={34} fill="#100c08" />
    {/* floor (split bamboo slats) */}
    <rect x={0} y={HFLOOR} width={W} height={H - HFLOOR} fill="url(#hfloor)" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M 0 ${HFLOOR + 40 + i * i * 50} L ${W} ${HFLOOR + 40 + i * i * 50}`} stroke="#0b0806" strokeWidth={4} opacity={0.6} />)}
    <path d={`M 0 ${HFLOOR} L ${W} ${HFLOOR}`} stroke="#6b5638" strokeWidth={4} opacity={0.4} />
  </g>
);

/** Rattan crib on the floor, right of centre (bg-mid detail baked). */
const Crib: React.FC = () => (
  <g transform={`translate(760 ${HFLOOR})`}>
    <path d="M -230 -40 L -250 -300 L 250 -300 L 230 -40 Z" fill="#2c2115" />
    {[-180, -110, -40, 30, 100, 170].map((x) => <rect key={x} x={x} y={-290} width={14} height={240} fill="#140f0a" />)}
    <path d="M -255 -305 L 255 -305" stroke="#8a6a40" strokeWidth={14} strokeLinecap="round" />
    <path d="M -240 -40 L 240 -40" stroke="#1a130b" strokeWidth={18} />
    <rect x={-230} y={-40} width={22} height={40} fill="#100c08" /><rect x={208} y={-40} width={22} height={40} fill="#100c08" />
  </g>
);

const Fg: React.FC = () => (
  <g>
    {/* hanging cloth edge left + low beam bottom = dark framing */}
    <path d="M 0 0 L 170 0 Q 150 600 120 1100 Q 90 1500 0 1700 Z" fill="#060504" />
    <path d={`M ${W} 0 L ${W - 120} 0 Q ${W - 90} 500 ${W - 70} 1000 L ${W} 1100 Z`} fill="#060504" />
    <path d={`M 0 ${H} L 0 2000 Q 648 1960 ${W} 2010 L ${W} ${H} Z`} fill="#050403" />
  </g>
);

export const HOUSE: Record<string, BandSpec> = {
  'house/room': { node: () => <Room /> },
  'house/crib': { node: () => <Crib /> },
  'house/fg': { blur: 6, node: () => <Fg /> },
};
