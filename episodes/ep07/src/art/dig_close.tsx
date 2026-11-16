import React from 'react';
import { Gold } from './dig_art';

/* S12 close: a man clutching a lump of gold to his chest, eyes darting, head turning a little.
 * Anatomy: upper arms hang from the shoulders down the sides of the torso; elbows bend; the
 * forearms rise to the hands at the chest. Simple face. Drive with the ON-TWOS clock. */
const SK = '#9a6a4e', SH = '#74503c', KN = '#5a3a2a', SHIRT = '#5a4a3a', SHIRT_D = '#463a2e';

export const Clutcher: React.FC<{ dart: number; grip: number; trem: number; breath: number; turn: number }> = ({ dart, grip, trem, breath, turn }) => {
  const cx = 648, fy = 600;
  const hx = cx + trem, hy = 1250 + breath * 0.5;
  const sq = 1 - 0.08 * grip;
  const hunch = 30 * grip;
  const shL: [number, number] = [380, 960 + breath + hunch], shR: [number, number] = [916, 960 + breath + hunch];
  const elL: [number, number] = [300 + 20 * grip, 1560], elR: [number, number] = [996 - 20 * grip, 1560];
  const wrL: [number, number] = [hx - 180 * sq, hy + 70], wrR: [number, number] = [hx + 180 * sq, hy + 70];
  const fx = turn * 34; // facial features slide with the head turn
  return (
    <g>
      {/* torso */}
      <path d={`M 150 2400 L 200 ${1100 + hunch} Q 260 ${930 + hunch} 420 ${900 + breath + hunch} L 876 ${900 + breath + hunch} Q 1036 ${930 + hunch} 1096 ${1100 + hunch} L 1146 2400 Z`} fill={SHIRT} />
      <path d={`M 520 ${900 + breath + hunch} L 648 ${1060 + hunch} L 776 ${900 + breath + hunch}`} fill="none" stroke="#3a2e24" strokeWidth={10} />
      {/* upper arms down the sides (sleeves), elbows bent, forearms rising to the chest */}
      {[[shL, elL, wrL], [shR, elR, wrR]].map(([sh, el, wr], i) => (
        <g key={i}>
          <path d={`M ${sh[0]} ${sh[1]} L ${el[0]} ${el[1]}`} stroke={SHIRT_D} strokeWidth={150} strokeLinecap="round" />
          <path d={`M ${sh[0]} ${sh[1]} L ${el[0]} ${el[1]}`} stroke={SHIRT} strokeWidth={130} strokeLinecap="round" />
          <path d={`M ${el[0]} ${el[1]} L ${wr[0]} ${wr[1]}`} stroke={SH} strokeWidth={100} strokeLinecap="round" />
          <path d={`M ${el[0]} ${el[1]} L ${wr[0]} ${wr[1]}`} stroke={SK} strokeWidth={70} strokeLinecap="round" />
          <path d={`M ${el[0] - 40 * (i ? -1 : 1)} ${el[1] + 30} q ${30 * (i ? -1 : 1)} 30 ${70 * (i ? -1 : 1)} 10`} stroke={SHIRT_D} strokeWidth={10} fill="none" />
        </g>
      ))}
      {/* neck + head, turned slightly */}
      <rect x={560 + fx * 0.3} y={760} width={176} height={170} fill={SH} />
      <g transform={`rotate(${turn * 4} ${cx} ${fy + 200})`}>
        <ellipse cx={cx} cy={fy} rx={220} ry={268} fill={SK} />
        <path d={`M ${cx + 90 + fx} ${fy - 240} Q ${cx + 240} ${fy - 80} ${cx + 200} ${fy + 120} Q ${cx + 150} ${fy + 240} ${cx + 40} ${fy + 266} Q ${cx + 170 + fx} ${fy + 120} ${cx + 160 + fx} ${fy - 60} Z`} fill={SH} opacity={0.6} />
        <path d={`M ${cx - 222} ${fy - 40} Q ${cx - 230} ${fy - 300} ${cx} ${fy - 290} Q ${cx + 232} ${fy - 300} ${cx + 222} ${fy - 40} Q ${cx + 170} ${fy - 200} ${cx + fx} ${fy - 190} Q ${cx - 170} ${fy - 200} ${cx - 222} ${fy - 40} Z`} fill="#1e1612" />
        {/* ear on the side away from the turn */}
        <ellipse cx={cx - turn * 214} cy={fy + 10} rx={26} ry={44} fill={SH} />
        <path d={`M ${cx - 150 + fx} ${fy - 82} L ${cx - 40 + fx} ${fy - 58}`} stroke="#1e1612" strokeWidth={18} strokeLinecap="round" />
        <path d={`M ${cx + 150 + fx} ${fy - 82} L ${cx + 40 + fx} ${fy - 58}`} stroke="#1e1612" strokeWidth={18} strokeLinecap="round" />
        {[-1, 1].map((s) => (
          <g key={s}>
            <ellipse cx={cx + s * 92 + fx} cy={fy - 10} rx={54} ry={25} fill="#efe6d8" />
            <circle cx={cx + s * 92 + fx + dart * 32} cy={fy - 8} r={17} fill="#1a120e" />
            <circle cx={cx + s * 92 + fx + dart * 32 - 5} cy={fy - 14} r={4} fill="#ffffff" />
            <path d={`M ${cx + s * 92 + fx - 56} ${fy - 14} Q ${cx + s * 92 + fx} ${fy - 42} ${cx + s * 92 + fx + 56} ${fy - 14}`} stroke={SH} strokeWidth={7} fill="none" />
          </g>
        ))}
        <path d={`M ${cx + 6 + fx * 1.3} ${fy + 10} Q ${cx + 30 + fx * 1.3} ${fy + 100} ${cx + 10 + fx * 1.3} ${fy + 120} Q ${cx - 16 + fx} ${fy + 126} ${cx - 30 + fx} ${fy + 112}`} stroke={SH} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d={`M ${cx - 70 + fx} ${fy + 180} Q ${cx + fx} ${fy + 170 + 6 * grip} ${cx + 70 + fx} ${fy + 180}`} stroke="#4a2a20" strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d={`M ${cx + 176} ${fy - 120} q -10 24 0 34 q 12 -6 0 -34 Z`} fill="#e9f2f6" opacity={0.85} />
      </g>
      <Gold x={hx} y={hy} s={2.3} />
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
