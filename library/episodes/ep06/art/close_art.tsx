import React from 'react';

/** Perspective floor tiles (frame coords). vp = vanishing point, y0 = horizon line, rows/cols lines. */
export const Tiles: React.FC<{ vx: number; y0: number; y1: number; stroke: string; op?: number; cols?: number }> = ({ vx, y0, y1, stroke, op = 0.5, cols = 14 }) => {
  const lines: React.ReactNode[] = [];
  for (let i = -cols; i <= cols; i++) {
    const xb = vx + i * 260;
    lines.push(<line key={'c' + i} x1={vx + i * 18} y1={y0} x2={xb} y2={y1 + 200} />);
  }
  for (let j = 1; j < 14; j++) {
    const y = y0 + (y1 - y0) * Math.pow(j / 13, 2.2);
    lines.push(<line key={'r' + j} x1={-200} y1={y} x2={1280} y2={y} />);
  }
  return <g stroke={stroke} strokeWidth={2} opacity={op}>{lines}</g>;
};

/** Pale fingertips (4) resting on the floor, pointing toward +x, drawn around 0,0. */
export const Fingertips: React.FC<{ curl?: number }> = ({ curl = 0 }) => (
  <g>
    {[0, 1, 2, 3].map((i) => {
      const y = i * 26 - 34, len = [70, 86, 80, 60][i] - curl * 8, w = [20, 22, 21, 17][i];
      return (
        <g key={i} transform={`translate(${-10 - i * 6},${y}) rotate(${(i - 1.5) * 4})`}>
          <path d={`M-60,${-w / 2} L${len - w / 2},${-w / 2 + 2} Q${len + 2},${-w / 2 + 3} ${len + 1},0 Q${len + 2},${w / 2 - 3} ${len - w / 2},${w / 2 - 1} L-60,${w / 2} Z`} fill="#b9c4bf" />
          <path d={`M-60,${w / 2 - 6} L${len - w / 2},${w / 2 - 5} Q${len},${w / 2 - 2} ${len - w / 2},${w / 2 - 1} L-60,${w / 2} Z`} fill="#6f7d79" />
          <path d={`M${len - 22},${-w / 2 + 5} q12,-1 16,${w / 2 - 4} q-8,3 -16,1 Z`} fill="#d9e3df" opacity={0.85} />
          <path d={`M${len - w / 2 - 4},${-w / 2 + 2} Q${len + 4},0 ${len - w / 2 - 2},${w / 2 - 1}`} stroke="#eef6f3" strokeWidth={2.4} fill="none" />
          <path d={`M${len - 44},${-w / 2 + 4} q3,${w / 2 - 4} 0,${w - 8}`} stroke="#7f8c88" strokeWidth={1.6} fill="none" />
        </g>
      );
    })}
  </g>
);

/** Old wrinkled hand seen from above, fingers curling down over (+y). Origin at wrist center, extends toward -x. */
export const OldHand: React.FC<{ grip: number }> = ({ grip }) => {
  const g = grip;
  const skin = '#a9755f', shade = '#6e4537', deep = '#3a2420', lit = '#d39a7f';
  const fingers = [
    { x: -330, y: 30, l: 120 + g * 6, w: 46, r: 84 },
    { x: -305, y: 78, l: 130 + g * 6, w: 48, r: 90 },
    { x: -270, y: 122, l: 118 + g * 6, w: 44, r: 96 },
    { x: -228, y: 158, l: 92 + g * 4, w: 38, r: 104 },
  ];
  return (
    <g>
      {/* forearm + sleeve */}
      <path d="M-40,-80 C80,-90 260,-120 420,-160 L460,40 C300,80 120,120 -10,120 Z" fill={skin} />
      <path d="M-10,90 C120,96 300,60 460,20 L460,40 C300,80 120,120 -10,120 Z" fill={shade} />
      <path d="M120,-120 C200,-140 330,-170 470,-200 L520,90 C400,100 260,130 170,150 C190,60 170,-40 120,-120 Z" fill="#8fa6a8" />
      <path d="M150,-110 C190,-40 205,60 175,148" stroke="#6c8486" strokeWidth={10} fill="none" />
      <path d="M128,-122 C200,-140 330,-170 470,-200" stroke="#cfe8e4" strokeWidth={4} fill="none" opacity={0.8} />
      {/* back of hand */}
      <path d="M-40,-80 C-140,-90 -260,-70 -340,-20 C-360,40 -330,130 -250,175 C-170,200 -80,170 -10,120 C20,60 10,-30 -40,-80 Z" fill={skin} />
      <path d="M-250,175 C-170,200 -80,170 -10,120 C-60,150 -150,170 -240,150 Z" fill={shade} />
      {/* thumb wrapping underneath, tip visible on top */}
      <path d="M-60,110 C-110,170 -150,215 -210,232 C-232,236 -240,214 -222,204 C-170,180 -130,140 -110,96 Z" fill={skin} />
      <path d="M-222,204 C-240,214 -232,236 -210,232 C-200,228 -196,220 -200,214 Z" fill={lit} />
      {/* veins + wrinkles */}
      <g stroke={shade} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9}>
        <path d="M-20,-30 C-90,-40 -170,-30 -250,0" />
        <path d="M-60,30 C-120,40 -200,60 -260,90" />
        <path d="M-90,-36 C-130,10 -180,30 -220,70" />
      </g>
      <g stroke={lit} strokeWidth={3} fill="none" opacity={0.6}>
        <path d="M-20,-38 C-90,-48 -170,-38 -250,-8" />
        <path d="M-60,22 C-120,32 -200,52 -260,82" />
      </g>
      <g stroke={deep} strokeWidth={2} fill="none" opacity={0.55}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${-40 - i * 34},${-60 + i * 6} q-10,20 -4,40`} />)}
        {[0, 1, 2, 3, 4].map((i) => <path key={'w' + i} d={`M${20 + i * 26},${-60 + i * 3} q8,60 -2,140`} />)}
      </g>
      {/* fingers curling over */}
      {fingers.map((f, i) => (
        <g key={i} transform={`translate(${f.x},${f.y}) rotate(${f.r + i * 2})`}>
          <path d={`M0,${-f.w / 2} L${f.l * 0.55},${-f.w / 2 + 3} Q${f.l * 0.62},${-f.w / 2 + 1} ${f.l * 0.66},0 L${f.l},${-f.w / 2 + 6} Q${f.l + 16},0 ${f.l},${f.w / 2 - 4} L${f.l * 0.6},${f.w / 2} L0,${f.w / 2} Z`} fill={skin} />
          <path d={`M0,${f.w / 2 - 12} L${f.l * 0.6},${f.w / 2 - 10} L${f.l},${f.w / 2 - 8} Q${f.l + 10},${f.w / 2 - 6} ${f.l},${f.w / 2 - 4} L${f.l * 0.6},${f.w / 2} L0,${f.w / 2} Z`} fill={shade} />
          <path d={`M0,${-f.w / 2} L${f.l * 0.55},${-f.w / 2 + 3}`} stroke={lit} strokeWidth={4} fill="none" />
          {/* knuckle + joint creases */}
          <ellipse cx={8} cy={-4} rx={16} ry={12} fill={lit} opacity={0.55} />
          <g stroke={deep} strokeWidth={2} fill="none" opacity={0.7}>
            <path d={`M${f.l * 0.5},${-f.w / 2 + 6} q-6,${f.w / 2} 0,${f.w - 12}`} />
            <path d={`M${f.l * 0.56},${-f.w / 2 + 6} q-6,${f.w / 2} 0,${f.w - 12}`} />
            <path d={`M${f.l * 0.85},${-f.w / 2 + 8} q-4,${f.w / 2 - 4} 0,${f.w - 16}`} />
          </g>
          <path d={`M${f.l - 22},${-f.w / 2 + 9} q18,2 20,${f.w / 2 - 6} q-12,4 -20,2 Z`} fill="#c8a08e" opacity={0.85} />
          {i < 3 && <path d={`M0,${f.w / 2} L${f.l * 0.6},${f.w / 2}`} stroke={deep} strokeWidth={4} />}
        </g>
      ))}
      {/* IV cannula + tape on back of hand */}
      <rect x={-130} y={-70} width={110} height={60} rx={8} fill="#e8eeea" opacity={0.92} transform="rotate(-8 -75 -40)" />
      <path d="M-120,-46 L-30,-58" stroke="#c9d3cf" strokeWidth={3} />
      <rect x={-50} y={-62} width={44} height={22} rx={5} fill="#f2d65a" transform="rotate(-8 -28 -51)" />
      <rect x={-12} y={-66} width={24} height={14} rx={3} fill="#ffffff" transform="rotate(-8 0 -59)" />
    </g>
  );
};

/** Young hand, palm partly up, coming from the left. Origin at wrist. */
export const YoungHand: React.FC = () => {
  const skin = '#b88068', shade = '#7a4c3c', lit = '#e0aa8c', deep = '#4a2c24';
  return (
    <g>
      <path d="M-520,-90 C-380,-110 -200,-100 -20,-80 L0,90 C-180,110 -380,120 -520,120 Z" fill={skin} />
      <path d="M-520,80 C-380,90 -200,88 0,70 L0,90 C-180,110 -380,120 -520,120 Z" fill={shade} />
      <path d="M-520,-90 C-380,-110 -200,-100 -20,-80" stroke={lit} strokeWidth={4} fill="none" />
      <path d="M-640,-130 L-520,-120 L-510,140 L-640,150 Z" fill="#26303a" />
      <path d="M-20,-80 C40,-90 120,-80 170,-40 C200,10 190,80 150,110 C90,130 30,110 0,90 Z" fill={skin} />
      <path d="M150,110 C90,130 30,110 0,90 C40,100 100,104 160,80 Z" fill={shade} />
      {/* palm crease + fingers extended under the old hand */}
      <path d="M30,-30 C80,-20 120,10 140,60" stroke={deep} strokeWidth={2.5} fill="none" opacity={0.6} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${160 + i * 4},${-20 + i * 40}) rotate(${-8 + i * 10})`}>
          <path d="M0,-17 L120,-14 Q136,0 120,15 L0,17 Z" fill={skin} />
          <path d="M0,8 L120,9 Q130,12 120,15 L0,17 Z" fill={shade} />
          <path d="M58,-15 q-5,15 0,30" stroke={deep} strokeWidth={2} fill="none" opacity={0.6} />
          <path d="M104,-12 q14,4 14,12 q-6,6 -14,4 Z" fill="#d7b0a0" opacity={0.7} />
          <path d="M0,-17 L120,-14" stroke={lit} strokeWidth={3} fill="none" />
        </g>
      ))}
      {/* thumb up */}
      <path d="M-30,-80 C0,-150 50,-190 100,-200 C120,-202 126,-180 110,-170 C70,-150 40,-110 30,-60 Z" fill={skin} />
      <path d="M100,-200 C120,-202 126,-180 110,-170 C104,-176 100,-188 100,-200 Z" fill="#d7b0a0" />
      <path d="M-30,-80 C0,-150 50,-190 100,-200" stroke={lit} strokeWidth={4} fill="none" />
    </g>
  );
};
