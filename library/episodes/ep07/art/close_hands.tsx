import React from 'react';

/** A small hand gripping a vertical strap. Local origin = strap centre; strap half-width ~60.
 *  Near side (knuckles, wrist) at -x, fingers cross OVER the strap and curl back behind it at +x.
 *  Render <GripBack> before the strap, <GripFront> after it. dir mirrors the hand. */
const SK = '#e6d3c6', SKS = '#b39a8d', SKD = '#6b5a55', SKP = '#fbf3ee', RIM = '#a9c4e8';
const FING = [
  { y: -88, h: 50, len: 1 },
  { y: -32, h: 52, len: 1.02 },
  { y: 25, h: 50, len: 0.98 },
  { y: 78, h: 42, len: 0.88 },
];

export const GripBack: React.FC<{ cx: number; cy: number; dir: 1 | -1; rot?: number }> = ({ cx, cy, dir, rot = 0 }) => (
  <g transform={`translate(${cx},${cy}) rotate(${rot}) scale(${dir},1)`}>
    {/* fingertips tucked behind the strap on the far side */}
    {FING.map((f, i) => (
      <path key={i} d={`M40,${f.y - f.h / 2 + 4} C${78 * f.len},${f.y - f.h / 2} ${92 * f.len},${f.y + f.h / 2 - 6} 60,${f.y + f.h / 2 - 2} Z`} fill={SKS} />
    ))}
    {/* thumb pressing from the far side, behind the strap's edge */}
    <path d="M30,160 C84,130 114,60 108,-10 C104,-56 80,-76 56,-66 C44,-20 44,60 10,124 Z" fill={SK} />
    <path d="M108,-10 C104,-56 80,-76 56,-66" stroke={RIM} strokeWidth={4} fill="none" opacity={0.7} />
    <path d="M64,-62 C84,-66 98,-50 96,-30 C82,-34 68,-44 64,-62 Z" fill="#f4e4dc" stroke={SKD} strokeWidth={2} />
    <path d="M30,150 C70,120 90,70 92,20" stroke={SKS} strokeWidth={6} fill="none" opacity={0.6} />
  </g>
);

export const GripFront: React.FC<{ cx: number; cy: number; dir: 1 | -1; sq: number; rot?: number; cuff?: string }> = ({ cx, cy, dir, sq, rot = 0 }) => (
  <g transform={`translate(${cx},${cy}) rotate(${rot}) scale(${dir},1)`}>
    {/* forearm in sailor sleeve entering from below-side */}
    <path d="M-520,520 C-420,360 -330,200 -250,90 L-170,150 C-240,280 -320,430 -390,600 Z" fill="#141a2b" />
    <path d="M-250,90 L-170,150 L-196,186 L-280,124 Z" fill="#e8ecf2" opacity={0.9} />
    <path d="M-296,150 L-212,212" stroke="#e8ecf2" strokeWidth={7} opacity={0.6} />
    <path d="M-520,520 C-420,360 -330,200 -250,90" stroke={RIM} strokeWidth={4} fill="none" opacity={0.35} />
    {/* wrist + back of hand on the near side */}
    <path d="M-250,96 C-250,40 -230,-60 -190,-110 C-160,-130 -100,-120 -70,-108 L-60,110 C-100,140 -150,160 -190,170 Z" fill={SK} />
    <path d="M-250,96 C-240,130 -220,160 -190,170 C-150,160 -100,140 -60,110 L-62,60 C-120,90 -190,110 -250,96 Z" fill={SKS} opacity={0.8} />
    {/* tendons */}
    {[-70, -15, 38].map((y, i) => <path key={i} d={`M-215,${70 + i * 18} C-170,${y + 40} -120,${y + 6} -85,${y}`} stroke={SKS} strokeWidth={4} fill="none" opacity={0.5} />)}
    {/* fingers crossing in front of the strap; strap shows in the gaps */}
    {FING.map((f, i) => {
      const t = f.y - f.h / 2, b = f.y + f.h / 2, x1 = 46 * f.len;
      return (
        <g key={i}>
          <path d={`M-95,${t + 2} C-40,${t - 4} 10,${t - 2} ${x1},${t + 6} C${x1 + 16},${f.y} ${x1 + 10},${b - 4} ${x1 - 6},${b} C10,${b + 2} -40,${b + 2} -95,${b - 2} Z`} fill={SK} />
          <path d={`M-95,${b - 14} C-40,${b - 10} 10,${b - 10} ${x1 - 2},${b - 8} L${x1 - 6},${b} C10,${b + 2} -40,${b + 2} -95,${b - 2} Z`} fill={SKS} opacity={0.85} />
          {/* middle joint crease over the strap */}
          <path d={`M0,${t + 8} C6,${f.y} 6,${f.y + 6} 2,${b - 6}`} stroke={SKD} strokeWidth={3} fill="none" opacity={0.6} />
          {/* pale knuckle at the near side, brighter as she squeezes */}
          <ellipse cx={-82} cy={f.y - 4} rx={22} ry={f.h * 0.32} fill={SKP} opacity={0.6 + 0.35 * sq} />
          <ellipse cx={-22} cy={f.y - 6} rx={14} ry={f.h * 0.18} fill={SKP} opacity={0.35 + 0.3 * sq} />
          {/* top rim */}
          <path d={`M-95,${t + 2} C-40,${t - 4} 10,${t - 2} ${x1},${t + 6}`} stroke={RIM} strokeWidth={i === 0 ? 4 : 2} fill="none" opacity={i === 0 ? 0.8 : 0.35} />
        </g>
      );
    })}
    {/* knuckle row edge where fingers meet the back of the hand */}
    <path d="M-70,-112 C-110,-60 -112,30 -66,108" stroke={SKS} strokeWidth={5} fill="none" opacity={0.7} />
    <path d="M-190,-110 C-160,-130 -100,-120 -70,-108" stroke={RIM} strokeWidth={4} fill="none" opacity={0.8} />
  </g>
);
