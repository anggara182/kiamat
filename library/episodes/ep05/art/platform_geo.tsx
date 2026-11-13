import React from 'react';

/** One-point perspective helpers for the platform set. VP = tunnel mouth. */
export const VP = { x: 720, y: 1000 };
export const at = (s: number, bx: number, by: number) => ({ x: VP.x + s * (bx - VP.x), y: VP.y + s * (by - VP.y) });
export const EDGE = { x: 380, y: 2304 }; // platform edge line goes VP -> EDGE
export const BENCH = { x: 430, y: 1430, s: 0.42 };

/** Platform bench (side-on, slightly foreshortened), low detail. */
export const Bench: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={260} ry={22} fill="#05060a" opacity={0.6} />
    <rect x={-220} y={-120} width={440} height={22} rx={4} fill="#3a4250" />
    <rect x={-220} y={-102} width={440} height={8} fill="#1a1e26" />
    <rect x={-212} y={-250} width={424} height={18} rx={4} fill="#2e3542" />
    <rect x={-212} y={-212} width={424} height={16} rx={4} fill="#2a303c" />
    {[-180, 180].map((lx) => <g key={lx}><rect x={lx - 10} y={-250} width={20} height={250} fill="#11131a" /><rect x={lx - 30} y={-4} width={60} height={8} fill="#11131a" /></g>)}
    <rect x={-220} y={-120} width={440} height={4} fill="#9fc4e0" opacity={0.7} />
    <rect x={-212} y={-250} width={424} height={3} fill="#9fc4e0" opacity={0.5} />
  </g>
);

/** Peaked guard cap, profile facing right. Origin = band bottom centre. */
export const Cap: React.FC<{ x: number; y: number; s: number; rim?: string; rimO?: number }> = ({ x, y, s, rim = '#d9f0ff', rimO = 0.8 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -70 0 C -78 -40 -60 -78 -10 -86 C 40 -92 86 -74 92 -40 L 84 -6 Z" fill="#141720" />
    <path d="M -70 0 L 84 -6 L 80 10 L -66 14 Z" fill="#0a0b10" />
    <path d="M 70 -4 C 110 -2 140 6 150 16 C 120 20 90 16 66 12 Z" fill="#06070a" />
    <rect x={-60} y={-18} width={136} height={8} fill="#c9a43a" opacity={0.9} />
    <circle cx={44} cy={-48} r={9} fill="#c9a43a" />
    <path d="M -10 -86 C 40 -92 86 -74 92 -40" stroke={rim} strokeWidth={4} fill="none" opacity={rimO} />
    <path d="M 70 -4 C 110 -2 140 6 150 16" stroke={rim} strokeWidth={3} fill="none" opacity={rimO * 0.8} />
  </g>
);
