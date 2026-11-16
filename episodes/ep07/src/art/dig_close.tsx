import React from 'react';
import { Gold } from './dig_art';

/* S12 close: a man clutching a lump of gold to his chest, eyes darting. Simple face (series rule:
 * no detailed features), readable fear. Drive with the ON-TWOS clock. */
const SK = '#9a6a4e', SH = '#74503c', KN = '#5a3a2a';

export const Clutcher: React.FC<{ dart: number; grip: number; trem: number; breath: number }> = ({ dart, grip, trem, breath }) => {
  const cx = 648, fy = 600;
  const hx = cx + trem, hy = 1180 + breath * 0.5;
  const sq = 1 - 0.08 * grip; // hands press closer together as the grip tightens
  return (
    <g>
      {/* shoulders + dusty shirt, hunched a little more as he grips */}
      <path d={`M -60 2400 L -40 ${1060 + 30 * grip} Q 120 ${900 + 20 * grip} 420 ${880 + breath} L 876 ${880 + breath} Q 1176 ${900 + 20 * grip} 1336 ${1060 + 30 * grip} L 1356 2400 Z`} fill="#5a4a3a" />
      <path d={`M 520 ${880 + breath} L 648 1040 L 776 ${880 + breath}`} fill="none" stroke="#3a2e24" strokeWidth={10} />
      <rect x={560} y={760} width={176} height={150} fill={SH} />
      {/* head */}
      <ellipse cx={cx} cy={fy} rx={220} ry={268} fill={SK} />
      <path d={`M ${cx + 90} ${fy - 240} Q ${cx + 240} ${fy - 80} ${cx + 200} ${fy + 120} Q ${cx + 150} ${fy + 240} ${cx + 40} ${fy + 266} Q ${cx + 170} ${fy + 120} ${cx + 160} ${fy - 60} Z`} fill={SH} opacity={0.6} />
      <path d={`M ${cx - 222} ${fy - 40} Q ${cx - 230} ${fy - 300} ${cx} ${fy - 290} Q ${cx + 232} ${fy - 300} ${cx + 222} ${fy - 40} Q ${cx + 170} ${fy - 200} ${cx} ${fy - 190} Q ${cx - 170} ${fy - 200} ${cx - 222} ${fy - 40} Z`} fill="#1e1612" />
      {/* brows pulled together */}
      <path d={`M ${cx - 150} ${fy - 82} L ${cx - 40} ${fy - 58}`} stroke="#1e1612" strokeWidth={18} strokeLinecap="round" />
      <path d={`M ${cx + 150} ${fy - 82} L ${cx + 40} ${fy - 58}`} stroke="#1e1612" strokeWidth={18} strokeLinecap="round" />
      {/* eyes: whites + darting pupils */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={cx + s * 92} cy={fy - 10} rx={52} ry={24} fill="#efe6d8" />
          <circle cx={cx + s * 92 + dart * 26} cy={fy - 10} r={17} fill="#1a120e" />
          <circle cx={cx + s * 92 + dart * 26 - 5} cy={fy - 16} r={4} fill="#ffffff" />
          <path d={`M ${cx + s * 92 - 54} ${fy - 14} Q ${cx + s * 92} ${fy - 40} ${cx + s * 92 + 54} ${fy - 14}`} stroke={SH} strokeWidth={6} fill="none" />
        </g>
      ))}
      {/* nose + tight mouth + a bead of sweat */}
      <path d={`M ${cx + 6} ${fy + 10} Q ${cx + 30} ${fy + 100} ${cx + 10} ${fy + 120} Q ${cx - 16} ${fy + 126} ${cx - 30} ${fy + 112}`} stroke={SH} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d={`M ${cx - 70} ${fy + 180} Q ${cx} ${fy + 170 + 6 * grip} ${cx + 70} ${fy + 180}`} stroke="#4a2a20" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M ${cx + 176} ${fy - 120} q -10 24 0 34 q 12 -6 0 -34 Z`} fill="#e9f2f6" opacity={0.85} />
      {/* forearms coming up to the chest */}
      <path d={`M 160 2400 L ${hx - 200 * sq} ${hy + 60} L ${hx - 110 * sq} ${hy + 120} L 360 2400 Z`} fill={SH} />
      <path d={`M 1136 2400 L ${hx + 200 * sq} ${hy + 60} L ${hx + 110 * sq} ${hy + 120} L 936 2400 Z`} fill={SH} />
      <Gold x={hx} y={hy} s={2.3} />
      {/* two hands wrapped round the gold: fingers over the top, knuckles paling as the grip tightens */}
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${hx + s * 118 * sq} ${hy + 10}) scale(${s} 1)`}>
          <path d="M -10 -64 Q 70 -92 92 -40 Q 104 0 92 50 Q 70 92 -10 72 Z" fill={SK} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={-96 - 10 * grip} y={-70 + k * 34} width={100 + 10 * grip} height={30} rx={15} fill={SK} transform={`rotate(${6 - k * 4} 0 ${-55 + k * 34})`} />)}
          {[0, 1, 2, 3].map((k) => <circle key={`n${k}`} cx={-4} cy={-55 + k * 34} r={8} fill={grip > 0.5 ? '#c49a80' : KN} opacity={0.75} />)}
          <path d="M -10 -64 Q 70 -92 92 -40" stroke={KN} strokeWidth={5} fill="none" opacity={0.6} />
        </g>
      ))}
    </g>
  );
};
