import React from 'react';

/** Ornate silver comb (centred at 0,0, ~440 wide) with a long grey hair strand. */
export const Comb: React.FC<{ glint?: number }> = ({ glint = 0.5 }) => (
  <g>
    <defs>
      <linearGradient id="cbSil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2f5f8" /><stop offset="0.5" stopColor="#d8dde3" /><stop offset="1" stopColor="#8f98a3" /></linearGradient>
      <radialGradient id="cbGl" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff" stopOpacity="0.9" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></radialGradient>
    </defs>
    {/* spine with arch */}
    <path d="M -220 -10 Q 0 -110 220 -10 L 220 20 L -220 20 Z" fill="url(#cbSil)" />
    <path d="M -170 -12 Q 0 -80 170 -12" fill="none" stroke="#7d8692" strokeWidth={6} />
    <circle cx={0} cy={-40} r={16} fill="#eef2f6" stroke="#7d8692" strokeWidth={4} />
    <circle cx={-80} cy={-26} r={8} fill="#7d8692" /><circle cx={80} cy={-26} r={8} fill="#7d8692" />
    {Array.from({ length: 22 }, (_, i) => <rect key={i} x={-212 + i * 19.6} y={18} width={10} height={120} rx={4} fill="url(#cbSil)" />)}
    {/* hair strand */}
    <path d="M -150 60 C -60 140, 60 40, 160 150 S 320 260, 420 200" fill="none" stroke="#b9bec4" strokeWidth={4} opacity={0.85} />
    <path d="M -120 70 C -20 170, 90 70, 200 190 S 340 300, 460 260" fill="none" stroke="#9aa1a8" strokeWidth={3} opacity={0.7} />
    <ellipse cx={-120} cy={-44} rx={70} ry={70} fill="url(#cbGl)" opacity={glint} />
  </g>
);
