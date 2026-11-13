import React from 'react';

/** Kuchisake-onna face pieces in a local 1000x1000 box (face centre ~500,500). Mouth never drawn. */
const SKIN = '#d9cfc6', SKIN_SH = '#9b938f', HAIR = '#0b0b0e', MASK = '#eef0f2', RIM = '#a9c4e8';

/** Surgical mask: tug 0..1 pulls the lower edge slightly (whisper). */
export const Mask: React.FC<{ tug?: number; id: string; loopSide?: 1 | -1 }> = ({ tug = 0, id, loopSide = 1 }) => {
  const b = 860 + tug * 14, s = tug * 10;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#8f97a3" /><stop offset="0.35" stopColor={MASK} /><stop offset="0.6" stopColor="#dde1e6" /><stop offset="1" stopColor="#5b6270" />
        </linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.35} /><stop offset="0.25" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.3} />
        </linearGradient>
      </defs>
      {/* ear loops */}
      <path d={`M${loopSide > 0 ? 865 : 135},560 C${loopSide > 0 ? 960 : 40},540 ${loopSide > 0 ? 985 : 15},${640 + s} ${loopSide > 0 ? 900 : 100},${720 + s}`} stroke="#d6dae0" strokeWidth={7} fill="none" />
      <path d={`M${loopSide > 0 ? 135 : 865},560 C${loopSide > 0 ? 70 : 930},560 ${loopSide > 0 ? 60 : 940},${660 + s} ${loopSide > 0 ? 110 : 890},${730 + s}`} stroke="#7d8591" strokeWidth={6} fill="none" opacity={0.7} />
      {/* body */}
      <path d={`M140,560 C300,520 700,520 860,560 L${880 - s * 0.3},${760 + s} C820,${b} 640,${b + 60} 500,${b + 64} C360,${b + 60} 180,${b} ${120 + s * 0.3},${760 + s} Z`} fill={`url(#${id}m)`} />
      <path d={`M140,560 C300,520 700,520 860,560 L${880 - s * 0.3},${760 + s} C820,${b} 640,${b + 60} 500,${b + 64} C360,${b + 60} 180,${b} ${120 + s * 0.3},${760 + s} Z`} fill={`url(#${id}t)`} />
      {/* nose wire ridge */}
      <path d="M150,566 C310,532 690,532 850,566" stroke="#ffffff" strokeWidth={6} fill="none" opacity={0.85} />
      <path d="M150,578 C310,546 690,546 850,578" stroke="#6f7784" strokeWidth={3} fill="none" opacity={0.5} />
      {/* nose bump shading */}
      <path d="M430,560 C470,610 530,610 570,560 C560,640 440,640 430,560 Z" fill="#aab1bb" opacity={0.35} />
      {/* pleats: shadow under, highlight over */}
      {[640, 715, 790].map((y, i) => {
        const yy = y + s * (i + 1) * 0.45;
        return (
          <g key={i}>
            <path d={`M${150 + i * 6},${yy + 8} C320,${yy - 22 + i * 4} 680,${yy - 22 + i * 4} ${850 - i * 6},${yy + 8}`} stroke="#5d6573" strokeWidth={9} fill="none" opacity={0.42} />
            <path d={`M${152 + i * 6},${yy - 2} C320,${yy - 32 + i * 4} 680,${yy - 32 + i * 4} ${848 - i * 6},${yy - 2}`} stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.7} />
          </g>
        );
      })}
      {/* edge stitching */}
      <path d={`M145,572 L${125 + s * 0.3},${752 + s}`} stroke="#c3c8cf" strokeWidth={5} strokeDasharray="10 9" fill="none" />
      <path d={`M855,572 L${875 - s * 0.3},${752 + s}`} stroke="#6b7380" strokeWidth={5} strokeDasharray="10 9" fill="none" />
      {/* cold rim on the lit side */}
      <path d={`M860,560 L${880 - s * 0.3},${760 + s} C820,${b} 640,${b + 60} 500,${b + 64}`} stroke={RIM} strokeWidth={6} fill="none" opacity={0.8} />
    </g>
  );
};

/** Eyes shadowed under fringe. open 0..1 */
export const Eyes: React.FC<{ id: string; glint?: number }> = ({ id, glint = 1 }) => (
  <g>
    <defs>
      <radialGradient id={`${id}e`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#1a1416" /><stop offset="1" stopColor="#2a2326" /></radialGradient>
      <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05050a" stopOpacity={0.92} /><stop offset="1" stopColor="#05050a" stopOpacity={0} /></linearGradient>
    </defs>
    {[340, 660].map((x, i) => (
      <g key={i}>
        {/* socket shade */}
        <ellipse cx={x} cy={455} rx={120} ry={62} fill={SKIN_SH} opacity={0.65} />
        {/* lid almond */}
        <path d={`M${x - 92},${458} C${x - 50},${420} ${x + 50},${418} ${x + 92},${452} C${x + 50},${482} ${x - 50},${486} ${x - 92},${458} Z`} fill="#b3aba6" />
        <circle cx={x + (i ? -6 : 6)} cy={455} r={30} fill={`url(#${id}e)`} />
        <circle cx={x + (i ? -6 : 6)} cy={455} r={15} fill="#030304" />
        <circle cx={x + (i ? -14 : -2)} cy={445} r={5} fill="#dfe9ff" opacity={glint} />
        {/* upper lid line + lashes */}
        <path d={`M${x - 96},${460} C${x - 50},${414} ${x + 50},${412} ${x + 96},${450}`} stroke="#120e10" strokeWidth={9} fill="none" strokeLinecap="round" />
        {/* lower lid */}
        <path d={`M${x - 80},${468} C${x - 40},${488} ${x + 40},${488} ${x + 80},${464}`} stroke="#7a6f6b" strokeWidth={3} fill="none" opacity={0.7} />
      </g>
    ))}
    {/* shadow from the fringe over the eyes */}
    <rect x={150} y={380} width={700} height={110} fill={`url(#${id}s)`} />
  </g>
);

export const FaceSkin: React.FC = () => (
  <g>
    <ellipse cx={500} cy={540} rx={360} ry={390} fill={SKIN} />
    <path d="M500,140 C720,150 860,330 860,560 C860,700 820,820 760,900 C800,700 780,420 500,300 Z" fill={SKIN_SH} opacity={0.4} />
    <path d="M140,500 C150,330 290,170 500,140 C330,230 230,380 220,560 Z" fill="#000" opacity={0.25} />
  </g>
);

/** Black fringe: heavy straight bangs + strand strokes, rim strokes on the right side. */
export const Fringe: React.FC<{ y?: number; sway?: number }> = ({ y = 400, sway = 0 }) => (
  <g>
    <path d={`M80,${y - 420} C200,${y - 520} 800,${y - 520} 920,${y - 420} L940,${y - 40} C860,${y + 6} 820,${y - 20} 760,${y + 10} C700,${y - 22} 650,${y + 14} 590,${y - 6} C540,${y + 20} 470,${y - 12} 420,${y + 16} C360,${y - 16} 300,${y + 12} 240,${y - 4} C180,${y + 18} 120,${y - 14} 60,${y - 30} Z`} fill={HAIR} />
    {[150, 230, 320, 410, 500, 590, 680, 770, 850].map((x, i) => (
      <path key={i} d={`M${x + sway * 0.3},${y - 380} C${x + 10},${y - 220} ${x - 8 + sway},${y - 100} ${x + 4 + sway},${y - 2 + (i % 3) * 6}`} stroke="#22232b" strokeWidth={4} fill="none" opacity={0.8} />
    ))}
    {[800, 845, 880].map((x, i) => (
      <path key={i} d={`M${x},${y - 400} C${x + 20},${y - 250} ${x + 18 + sway},${y - 120} ${x + 10 + sway},${y - 20}`} stroke={RIM} strokeWidth={3 - i * 0.6} fill="none" opacity={0.55 - i * 0.12} />
    ))}
  </g>
);
