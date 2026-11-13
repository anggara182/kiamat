import React from 'react';

/** Child hand, palm-down/back view, wrist at (0,0), fingers toward -y. curl 0..1 lifts fingertips (shortens). */
export const Hand: React.FC<{ curl?: number; sleeve?: string; skin?: string; shade?: string; rim?: string; spread?: number; mitt?: boolean }> = ({ curl = 0, sleeve = '#5b4a5f', skin = '#d7b3a0', shade = '#9a7466', rim = '#e9f2f3', spread = 1 }) => {
  const f = (x: number, len: number, w: number, ang: number) => {
    const L = len * (1 - curl * 0.35);
    return (
      <g transform={`translate(${x} -150) rotate(${ang * spread})`}>
        <path d={`M${-w / 2} 10 L${-w / 2 + 2} ${-L + w / 2} Q0 ${-L - w * 0.4} ${w / 2 - 2} ${-L + w / 2} L${w / 2} 10Z`} fill={skin} />
        <path d={`M${-w / 2 + 3} ${-L * 0.45} Q0 ${-L * 0.42} ${w / 2 - 3} ${-L * 0.45}`} stroke={shade} strokeWidth="3" fill="none" opacity="0.6" />
        <path d={`M${-w / 2 + 2} ${-L + w / 2} Q0 ${-L - w * 0.4} ${w / 2 - 2} ${-L + w / 2}`} stroke={rim} strokeWidth="3" fill="none" opacity="0.7" />
      </g>
    );
  };
  return (
    <g>
      {f(-52, 92, 34, -9)}
      {f(-17, 108, 35, -3)}
      {f(18, 104, 34, 3)}
      {f(50, 82, 30, 10)}
      {/* palm */}
      <path d="M-74 -150 Q-80 -60 -60 0 L60 0 Q78 -70 70 -150 Q0 -170 -74 -150Z" fill={skin} />
      <path d="M40 -10 Q70 -80 70 -150" stroke={shade} strokeWidth="14" fill="none" opacity="0.45" />
      {/* thumb */}
      <path d="M-62 -40 Q-110 -70 -128 -120 Q-136 -142 -116 -146 Q-96 -140 -84 -110 Q-72 -90 -58 -88Z" fill={skin} />
      <path d="M-128 -120 Q-136 -142 -116 -146" stroke={rim} strokeWidth="3" fill="none" opacity="0.7" />
      <path d="M-74 -150 Q-80 -60 -60 0" stroke={rim} strokeWidth="4" fill="none" opacity="0.6" />
      {/* knuckle hints */}
      {[-50, -17, 18, 48].map((x) => <ellipse key={x} cx={x} cy={-146} rx="10" ry="5" fill={shade} opacity="0.35" />)}
      {/* sleeve (wool jumper cuff) */}
      <path d="M-82 -10 L82 -10 L96 420 L-96 420Z" fill={sleeve} />
      <path d="M-84 -14 L84 -14 L88 50 L-88 50Z" fill={sleeve} />
      {[-60, -30, 0, 30, 60].map((x) => <line key={x} x1={x} y1={-10} x2={x * 1.04} y2={48} stroke="#000" strokeWidth="4" opacity="0.25" />)}
      <path d="M-84 -14 L84 -14" stroke={rim} strokeWidth="3" opacity="0.35" />
    </g>
  );
};

/** Old iron key; bow at (0,0), shaft toward +x, length ~ 330. */
export const Key: React.FC<{ rim?: string; glow?: number }> = ({ rim = '#c3d0d4', glow = 0 }) => (
  <g>
    {glow > 0 && <ellipse cx="160" cy="0" rx="260" ry="120" fill="url(#keyGlow)" opacity={glow} />}
    <defs>
      <radialGradient id="keyGlow"><stop offset="0" stopColor="#4fd1c5" stopOpacity="0.5" /><stop offset="1" stopColor="#4fd1c5" stopOpacity="0" /></radialGradient>
    </defs>
    <circle cx="0" cy="0" r="56" fill="none" stroke="#3a3f43" strokeWidth="26" />
    <circle cx="0" cy="0" r="56" fill="none" stroke="#5c6367" strokeWidth="10" />
    <path d="M-40 -46 A60 60 0 0 1 46 -40" stroke={rim} strokeWidth="5" fill="none" opacity="0.85" />
    <rect x="58" y="-15" width="40" height="30" rx="6" fill="#3a3f43" />
    <rect x="90" y="-11" width="230" height="22" fill="#40464a" />
    <rect x="90" y="-11" width="230" height="6" fill={rim} opacity="0.55" />
    <path d="M250 11 L250 70 L276 70 L276 50 L296 50 L296 82 L320 82 L320 11Z" fill="#3a3f43" />
    <path d="M250 11 L250 70" stroke={rim} strokeWidth="3" opacity="0.5" />
    {[[130, 2], [200, -4], [-30, 30], [30, -40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#6b4a36" opacity="0.7" />)}
  </g>
);

/** one mane lock with weed; root at (0,0) hanging toward +y. */
export const Lock: React.FC<{ len: number; sway: number; w?: number; weed?: boolean; rim?: string }> = ({ len, sway, w = 40, weed, rim = '#9fb7bc' }) => {
  const c1 = sway * 0.4, c2 = sway;
  const d = `M${-w / 2} 0 C${-w / 2 + c1} ${len * 0.4} ${-w / 4 + c2} ${len * 0.75} ${c2 * 1.2} ${len} C${w / 4 + c2} ${len * 0.75} ${w / 2 + c1} ${len * 0.4} ${w / 2} 0Z`;
  return (
    <g>
      <path d={d} fill="#060708" />
      {[-0.3, 0, 0.3].map((k, j) => (
        <path key={j} d={`M${k * w} ${len * 0.3} C${k * w + c1 + 10} ${len * 0.6} ${k * w * 0.5 + c2 - 12} ${len * 0.85} ${c2 * 1.2 + k * w * 0.8 + Math.sin(sway * 0.1 + j) * 8} ${len * (1.12 + j * 0.05)}`}
          stroke="#060708" strokeWidth={6 - j} fill="none" strokeLinecap="round" />
      ))}
      <path d={`M${-w / 2 + 4} 4 C${-w / 2 + c1 + 4} ${len * 0.4} ${-w / 4 + c2 + 2} ${len * 0.75} ${c2 * 1.2} ${len}`} stroke={rim} strokeWidth="3" fill="none" opacity="0.6" />
      {weed && <path d={`M${w / 4} ${len * 0.2} C${w + c1} ${len * 0.4} ${-w / 2 + c2} ${len * 0.6} ${c2 * 1.1 + 18} ${len * 0.92}`} stroke="#3f6b4a" strokeWidth="10" fill="none" strokeLinecap="round" />}
      {weed && <ellipse cx={c2 * 0.8 + 16} cy={len * 0.55} rx="10" ry="22" fill="#4f7d5a" transform={`rotate(20 ${c2 * 0.8 + 16} ${len * 0.55})`} />}
    </g>
  );
};
