import React from 'react';

/** Grandma's head lying on the pillow, 3/4 turned toward camera, local origin = face centre. bl = blink 0..1. */
export const GrandmaHead: React.FC<{ bl: number; t: number }> = ({ bl, t }) => {
  const lid = 0.45 + 0.55 * bl; // half-open lids, closing on blink
  const eye = (x: number, y: number, w: number, k: string) => (
    <g key={k} transform={`translate(${x},${y})`}>
      {/* soft socket shadow */}
      <ellipse cx={0} cy={2} rx={w * 0.75} ry={w * 0.42} fill="#3a2620" opacity={0.55} />
      {/* eye opening (almond), partly covered by the lid */}
      <path d={`M${-w / 2},0 Q0,${-w * 0.34} ${w / 2},0 Q0,${w * 0.22} ${-w / 2},0 Z`} fill="#1a1012" />
      <circle cx={w * 0.08} cy={-1} r={w * 0.07} fill="#e9fff6" opacity={1 - bl} />
      {/* upper lid: heavy, lowered */}
      <path d={`M${-w / 2 - 4},1 Q0,${-w * 0.42} ${w / 2 + 4},1 Q0,${-w * 0.34 + w * 0.5 * lid} ${-w / 2 - 4},1 Z`} fill="#7c5444" />
      <path d={`M${-w / 2},1 Q0,${-w * 0.34 + w * 0.5 * lid - 2} ${w / 2},1`} stroke="#24161450" strokeWidth={3} fill="none" />
      <path d={`M${-w / 2 - 2},-6 Q0,${-w * 0.55} ${w / 2 + 4},-6`} stroke="#5a3a30" strokeWidth={2} fill="none" opacity={0.7} />
      {/* lower lid + crease */}
      <path d={`M${-w / 2 + 4},6 Q0,${w * 0.32} ${w / 2 - 2},6`} stroke="#5a3a30" strokeWidth={2} fill="none" opacity={0.6} />
    </g>
  );
  const sway = Math.sin(t * 0.6) * 2;
  return (
    <g>
      <defs>
        <linearGradient id="gmSkin" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#3e2a24" /><stop offset="0.45" stopColor="#7a5444" /><stop offset="0.8" stopColor="#966a56" /><stop offset="1" stopColor="#8a8a6a" />
        </linearGradient>
        <radialGradient id="gmCheek" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#c08a70" stopOpacity={0.55} /><stop offset="1" stopColor="#c08a70" stopOpacity={0} /></radialGradient>
        <radialGradient id="gmHairBack" cx="0.4" cy="0.5" r="0.55"><stop offset="0" stopColor="#7d8886" /><stop offset="0.75" stopColor="#5f6a69" /><stop offset="1" stopColor="#5f6a69" stopOpacity={0} /></radialGradient>
      </defs>
      {/* thin grey hair spread on the pillow behind the head (soft edge, not a cap) */}
      {/* thin grey hair lying flat on the pillow, hugging the back of the skull */}
      <path d="M-150,-170 C-100,-236 60,-250 150,-170 C176,-190 180,-230 150,-250 C80,-290 -60,-290 -150,-250 C-220,-210 -236,-120 -216,-30 C-204,30 -186,60 -175,40 C-180,-40 -175,-120 -150,-170 Z" fill="#5d6866" />
      <g fill="none" strokeLinecap="round">
        {Array.from({ length: 9 }).map((_, i) => {
          const k = i / 8;
          return <path key={i} d={`M${-160 + k * 300},${-200 - Math.sin(k * 3.14) * 60} C${-200 + k * 320},${-260 - Math.sin(k * 3.14) * 50} ${-240 + k * 380 + sway},${-250 - Math.sin(k * 3.14) * 70} ${-260 + k * 420 + sway},${-230 - Math.sin(k * 3.14) * 60}`} stroke={i % 2 ? '#c4cfcc' : '#a3aeab'} strokeWidth={2} opacity={0.65} />;
        })}
        {/* loose strands drifting on the pillow */}
        <path d={`M-260,-60 C-320,-20 -340,60 -${300 + sway},140`} stroke="#c4cfcc" strokeWidth={2} opacity={0.3} />
        <path d="M60,-260 C140,-300 220,-290 280,-250" stroke="#c4cfcc" strokeWidth={2} opacity={0.3} />
      </g>
      {/* neck */}
      <path d="M-90,170 C-60,230 40,250 90,210 L110,320 L-110,320 Z" fill="#3a2722" />
      {/* face */}
      <path d="M-150,-170 C-60,-232 90,-222 140,-150 C165,-112 170,-64 162,-30 C170,-6 186,30 184,52 C176,62 162,60 156,70 C162,94 158,114 148,130 C138,172 108,200 66,212 C18,224 -42,214 -92,184 C-150,140 -176,60 -172,-30 C-170,-100 -166,-140 -150,-170 Z" fill="url(#gmSkin)" />
      <ellipse cx={70} cy={50} rx={70} ry={60} fill="url(#gmCheek)" />
      <ellipse cx={-70} cy={60} rx={60} ry={55} fill="url(#gmCheek)" opacity={0.6} />
      {/* soft green monitor rim on the near contour */}
      <path d="M140,-150 C165,-112 170,-64 162,-30 C170,-6 186,30 184,52 M156,70 C162,94 158,114 148,130 C138,172 108,200 66,212" stroke="#7dffc4" strokeWidth={4} fill="none" opacity={0.55} strokeLinecap="round" />
      {/* thin front hairline, swept back */}
      <path d="M-170,-40 C-176,-140 -100,-226 20,-228 C90,-226 140,-196 150,-150 C120,-178 60,-196 -10,-196 C-80,-188 -130,-140 -150,-60 Z" fill="#7e8987" />
      <g stroke="#dbe5e2" strokeWidth={2} fill="none" opacity={0.8} strokeLinecap="round">
        <path d="M-140,-80 C-130,-150 -70,-200 10,-212" /><path d="M-100,-170 C-40,-205 60,-210 130,-170" /><path d="M-160,-30 C-168,-100 -140,-160 -90,-196" />
      </g>
      {/* brows: sparse grey */}
      <path d="M-100,-80 Q-55,-98 -10,-84" stroke="#b6bfbc" strokeWidth={4} fill="none" opacity={0.7} strokeLinecap="round" />
      <path d="M60,-90 Q100,-100 136,-82" stroke="#c7d0cd" strokeWidth={4} fill="none" opacity={0.75} strokeLinecap="round" />
      {eye(-52, -40, 66, 'l')}
      {eye(98, -46, 58, 'r')}
      {/* forehead lines + crow's feet */}
      <g stroke="#3a2620" strokeWidth={2} fill="none" opacity={0.45} strokeLinecap="round">
        <path d="M-70,-130 Q0,-142 80,-128" /><path d="M-50,-112 Q10,-120 70,-110" />
        <path d="M136,-42 l18,-8 M136,-34 l20,2 M134,-26 l16,10" />
      </g>
      {/* nose: bridge shade + nostril */}
      <path d="M128,-30 C134,0 150,32 160,50" stroke="#5a3a30" strokeWidth={3} fill="none" opacity={0.6} />
      <path d="M118,66 Q138,74 156,66" stroke="#2c1c18" strokeWidth={4} fill="none" opacity={0.7} strokeLinecap="round" />
      <path d="M150,-10 C160,14 172,34 176,48" stroke="#d9a88e" strokeWidth={3} fill="none" opacity={0.6} />
      {/* nasolabial folds */}
      <path d="M108,80 C90,104 82,128 86,150" stroke="#3a2620" strokeWidth={2.5} fill="none" opacity={0.45} />
      <path d="M-30,70 C-40,100 -36,130 -24,150" stroke="#3a2620" strokeWidth={2} fill="none" opacity={0.3} />
      {/* thin lips, faint calm smile */}
      <path d="M8,132 Q60,144 132,124" stroke="#4a2a26" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M30,142 Q70,152 116,136" stroke="#8e5c4c" strokeWidth={3} fill="none" opacity={0.6} strokeLinecap="round" />
      {/* chin crease */}
      <path d="M40,180 Q70,188 100,178" stroke="#3a2620" strokeWidth={2} fill="none" opacity={0.35} />
    </g>
  );
};

/** A faint five-finger palm smudge on the floor, fingers toward -y, with a drag tail toward +y. */
export const Handprint: React.FC<{ op?: number }> = ({ op = 0.35 }) => (
  <g opacity={op} fill="#3a2f29">
    <path d="M-40,0 C-46,-34 -30,-58 0,-60 C30,-58 46,-34 40,0 C34,30 20,60 0,140 C-20,60 -34,30 -40,0 Z" opacity={0.7} />
    {[[-44, -40, -22], [-24, -78, -8], [0, -88, 0], [24, -80, 8], [42, -56, 22]].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
        <path d="M-7,-16 Q0,-26 7,-16 L8,22 Q0,60 -8,22 Z" />
      </g>
    ))}
  </g>
);
