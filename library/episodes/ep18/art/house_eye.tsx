import React from 'react';

/** Extreme close eye, centred at (0,0), width ~900. refl 0..1 = upside-down girl reflection visibility. cold = cooler palette. */
export const BigEye: React.FC<{ id: string; refl: number; look?: number; blink?: number; cold?: boolean; bare?: boolean }> = ({ id, refl, look = 0, blink = 0, cold, bare }) => {
  const skinA = cold ? '#8f8a93' : '#c08e68';
  const skinB = cold ? '#2c2a33' : '#4a2e1e';
  const light = cold ? '#cdd6ee' : '#ffbf6b';
  const lid = 1 - blink * 0.9;
  const eyePath = `M -420 0 Q -200 ${-230 * lid} 40 ${-220 * lid} Q 300 ${-200 * lid} 430 10 Q 230 ${170 * lid} 0 ${175 * lid} Q -240 ${170 * lid} -420 0 Z`;
  return (
    <g>
      <defs>
        <radialGradient id={`${id}sk`} cx="0.35" cy="0.4" r="0.7"><stop offset="0" stopColor={skinA} /><stop offset="1" stopColor={skinB} /></radialGradient>
        <radialGradient id={`${id}wh`} cx="0.45" cy="0.4" r="0.6"><stop offset="0" stopColor={cold ? '#d7dbe4' : '#efe2cc'} /><stop offset="1" stopColor={cold ? '#5d6070' : '#7a604a'} /></radialGradient>
        <radialGradient id={`${id}ir`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#1a0f08" /><stop offset="0.55" stopColor={cold ? '#3a3a40' : '#5a3418'} /><stop offset="0.85" stopColor={cold ? '#25252b' : '#3a2010'} /><stop offset="1" stopColor="#0c0705" /></radialGradient>
        <clipPath id={`${id}clip`}><path d={eyePath} /></clipPath>
      </defs>
      {!bare && <rect x={-900} y={-1200} width={1800} height={2400} fill={`url(#${id}sk)`} />}
      {/* brow + crease */}
      {!bare && <path d="M -470 -330 Q -60 -470 470 -330 Q 80 -400 -470 -300 Z" fill="#120a07" opacity={0.85} />}
      <path d={`M -400 ${-60 - 160 * lid} Q 20 ${-330 * lid - 40} 420 ${-70 - 120 * lid}`} stroke={skinB} strokeWidth={14} fill="none" opacity={0.7} />
      <path d={eyePath} fill={`url(#${id}wh)`} />
      <g clipPath={`url(#${id}clip)`}>
        <g transform={`translate(${30 + look * 60} -10)`}>
          <circle r={165} fill={`url(#${id}ir)`} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <path key={i} d={`M ${Math.cos(i * 0.52) * 70} ${Math.sin(i * 0.52) * 70} L ${Math.cos(i * 0.52) * 155} ${Math.sin(i * 0.52) * 155}`} stroke={cold ? '#5a5a66' : '#7a4a22'} strokeWidth={5} opacity={0.4} />)}
          <circle r={72} fill="#050303" />
          {/* upside-down girl reflection: head at bottom, dress at top */}
          <g opacity={refl} transform="translate(-34 4) scale(0.9)">
            <path d="M -12 -58 L 12 -58 L 9 -36 L -9 -36 Z" fill={light} opacity={0.8} />
            <path d="M -20 -36 L 20 -36 L 12 6 L -12 6 Z" fill={light} opacity={0.85} />
            <rect x={-3} y={6} width={6} height={6} fill={light} opacity={0.85} />
            <circle cx={0} cy={22} r={11} fill={light} opacity={0.9} />
            <path d="M -11 24 Q -13 38 -6 42 M 11 24 Q 13 38 6 42" stroke={light} strokeWidth={4} fill="none" opacity={0.8} />
          </g>
          {/* lamp catchlight */}
          <ellipse cx={58} cy={-62} rx={30} ry={20} fill="#fff6e4" opacity={0.95} />
          <circle cx={-60} cy={60} r={8} fill="#fff6e4" opacity={0.5} />
        </g>
        <path d={eyePath} fill="none" stroke="#000" strokeWidth={60} opacity={0.35} />
      </g>
      {/* lashes + lid line */}
      <path d={`M -420 0 Q -200 ${-230 * lid} 40 ${-220 * lid} Q 300 ${-200 * lid} 430 10`} stroke="#0a0605" strokeWidth={22} fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = -330 + i * 95; const y = -Math.sin(((i + 0.8) / 9) * Math.PI) * 215 * lid;
        return <path key={i} d={`M ${x} ${y} q ${10 + i * 6} -40 ${30 + i * 8} -60`} stroke="#0a0605" strokeWidth={8} fill="none" strokeLinecap="round" />;
      })}
      <path d={`M -400 12 Q -200 ${175 * lid} 0 ${178 * lid} Q 230 ${172 * lid} 420 18`} stroke={light} strokeWidth={5} fill="none" opacity={0.45} />
    </g>
  );
};
