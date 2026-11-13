import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "inside": one living-room band (front door left, TV glow centre, hallway + bedroom door right). */
const Room: React.FC = () => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
    <defs>
      <linearGradient id="iw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14171f" /><stop offset="0.5" stopColor="#4a5060" /><stop offset="1" stopColor="#1a1d26" /></linearGradient>
      <radialGradient id="itv" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#8fb7ff" stopOpacity="0.85" /><stop offset="1" stopColor="#8fb7ff" stopOpacity="0" /></radialGradient>
      <linearGradient id="ifl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#262a33" /><stop offset="1" stopColor="#08090c" /></linearGradient>
      <linearGradient id="ihall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050608" /><stop offset="1" stopColor="#101218" /></linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#iw)" />
    <ellipse cx={640} cy={1150} rx={620} ry={520} fill="url(#itv)" />
    <rect y={1500} width={W} height={H - 1500} fill="url(#ifl)" />
    {/* front door frame (left) */}
    <rect x={150} y={640} width={330} height={870} fill="#1b130d" />
    <rect x={170} y={660} width={290} height={850} fill="#4b3423" />
    <rect x={200} y={700} width={230} height={330} fill="#3d2a1c" /><rect x={200} y={1070} width={230} height={380} fill="#3d2a1c" />
    <circle cx={425} cy={1080} r={9} fill="#b08a55" />
    {/* hallway opening (right) with bedroom door at its end */}
    <rect x={850} y={600} width={300} height={910} fill="url(#ihall)" />
    <rect x={930} y={760} width={150} height={560} fill="#0c0d10" />
    <rect x={930} y={760} width={150} height={560} fill="none" stroke="#2a2d36" strokeWidth={6} />
    {/* wall calendar + picture frame, low detail */}
    <rect x={560} y={640} width={150} height={110} fill="#262a33" stroke="#4a5060" strokeWidth={6} />
    {/* TV cabinet */}
    <rect x={520} y={1180} width={260} height={170} rx={8} fill="#0b0c10" />
    <rect x={540} y={1196} width={220} height={136} fill="#8fb7ff" opacity={0.85} />
    <rect x={480} y={1350} width={340} height={150} fill="#0f0f12" />
  </svg>
);

export const INSIDE: Record<string, BandSpec> = { 'inside/room': { node: () => <Room /> } };
