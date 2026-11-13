import React from 'react';

/** Money tin with padlock (hero of shot 5). Centered at (cx, cy) = front-bottom center. */
export const Tin: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const w = 520, h = 300, top = 120;
  const x0 = cx - w / 2, y0 = cy - h;
  return (
    <g>
      <defs>
        <linearGradient id="tinFront" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#3c4046" /><stop offset="0.35" stopColor="#8a8f96" /><stop offset="0.55" stopColor="#b9bec4" /><stop offset="1" stopColor="#4a4e55" />
        </linearGradient>
        <linearGradient id="tinTop" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6d7279" /><stop offset="1" stopColor="#a9aeb4" />
        </linearGradient>
        <linearGradient id="lockG" x1="0" x2="1">
          <stop offset="0" stopColor="#7a5a24" /><stop offset="0.5" stopColor="#e6c46e" /><stop offset="1" stopColor="#6a4c1c" />
        </linearGradient>
      </defs>
      <ellipse cx={cx} cy={cy + 10} rx={w * 0.62} ry={40} fill="#000" opacity={0.55} />
      {/* top face */}
      <path d={`M${x0} ${y0} L${x0 + 70} ${y0 - top} L${x0 + w + 70} ${y0 - top} L${x0 + w} ${y0} Z`} fill="url(#tinTop)" />
      {/* lid rim */}
      <rect x={x0 - 6} y={y0 - 4} width={w + 12} height={46} rx={6} fill="#5d6268" />
      <rect x={x0 - 6} y={y0 - 4} width={w + 12} height={8} fill="#d5d9de" opacity={0.7} />
      {/* side face */}
      <path d={`M${x0 + w} ${y0} L${x0 + w + 70} ${y0 - top} L${x0 + w + 70} ${y0 - top + h} L${x0 + w} ${cy} Z`} fill="#2e3136" />
      {/* front */}
      <rect x={x0} y={y0 + 42} width={w} height={h - 42} fill="url(#tinFront)" />
      <path d={`M${x0} ${cy - 30} H${x0 + w}`} stroke="#2b2e33" strokeWidth={4} />
      <path d={`M${x0 + 40} ${y0 + 70} V${cy - 40}`} stroke="#d7dbe0" strokeWidth={5} opacity={0.35} />
      {/* rust spots */}
      <ellipse cx={x0 + 90} cy={cy - 60} rx={26} ry={12} fill="#6b4a32" opacity={0.5} />
      <ellipse cx={x0 + w - 70} cy={y0 + 90} rx={18} ry={9} fill="#6b4a32" opacity={0.45} />
      {/* hasp */}
      <rect x={cx - 28} y={y0 + 10} width={56} height={90} rx={8} fill="#4a4e55" stroke="#c9ced3" strokeWidth={3} />
      {/* padlock */}
      <path d={`M${cx - 44} ${y0 + 110} V${y0 + 62} a44 44 0 0 1 88 0 V${y0 + 110}`} fill="none" stroke="#c9ced3" strokeWidth={16} />
      <path d={`M${cx - 44} ${y0 + 110} V${y0 + 62} a44 44 0 0 1 88 0`} fill="none" stroke="#ffffff" strokeWidth={4} opacity={0.5} />
      <rect x={cx - 70} y={y0 + 100} width={140} height={120} rx={16} fill="url(#lockG)" />
      <rect x={cx - 70} y={y0 + 100} width={140} height={10} rx={5} fill="#ffe7a0" opacity={0.8} />
      <circle cx={cx} cy={y0 + 150} r={13} fill="#2a1d0c" />
      <path d={`M${cx - 5} ${y0 + 152} L${cx + 5} ${y0 + 152} L${cx + 3} ${y0 + 190} L${cx - 3} ${y0 + 190} Z`} fill="#2a1d0c" />
    </g>
  );
};

/** One coin lying flat (ellipse) or on edge. */
export const Coin: React.FC<{ x: number; y: number; r?: number; tilt?: number }> = ({ x, y, r = 46, tilt = 0.38 }) => (
  <g>
    <ellipse cx={x} cy={y + 8} rx={r} ry={r * tilt} fill="#7a5a24" />
    <ellipse cx={x} cy={y} rx={r} ry={r * tilt} fill="#d9b25a" />
    <ellipse cx={x} cy={y} rx={r * 0.72} ry={r * tilt * 0.72} fill="none" stroke="#a8843c" strokeWidth={3} />
    <path d={`M${x - r * 0.8} ${y - r * tilt * 0.4} A${r} ${r * tilt} 0 0 1 ${x + r * 0.3} ${y - r * tilt * 0.95}`} stroke="#fff0b8" strokeWidth={4} fill="none" opacity={0.8} />
  </g>
);

/** Small red crab, top-down-ish. Facing angle a (deg), leg phase ph. */
export const Crab: React.FC<{ x: number; y: number; s?: number; a?: number; ph?: number; claw?: number }> = ({ x, y, s = 1, a = 0, ph = 0, claw = 0 }) => {
  const legs = [-1, 1].flatMap((side) => [0, 1, 2].map((i) => {
    const sw = Math.sin(ph + i * 1.3 + (side > 0 ? 1.5 : 0)) * 6;
    const bx = side * 30, by = -8 + i * 14;
    return <path key={`${side}${i}`} d={`M${bx} ${by} L${side * 62} ${by - 14 + sw} L${side * 80} ${by + 14 + sw}`} stroke="#8a3424" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  }));
  const cl = (side: number) => (
    <g transform={`translate(${side * 30} -26) rotate(${side * (-20 - claw * 18)})`}>
      <path d={`M0 0 L${side * 14} -34`} stroke="#a03e2a" strokeWidth={9} strokeLinecap="round" />
      <path d={`M${side * 14} -34 q${side * 22} -6 ${side * 16} -36 q${-side * 4} 16 ${-side * 14} 18 q${-side * 14} -8 ${-side * 18} 4 Z`} fill="#c4553a" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      {legs}
      {cl(-1)}{cl(1)}
      <ellipse cx={0} cy={0} rx={46} ry={34} fill="#c4553a" />
      <ellipse cx={-6} cy={-8} rx={30} ry={18} fill="#e07a58" opacity={0.7} />
      <path d="M-40 -8 Q0 -40 40 -8" stroke="#ffd3b8" strokeWidth={4} fill="none" opacity={0.7} />
      <circle cx={-12} cy={-34} r={5} fill="#1a0c08" /><circle cx={12} cy={-34} r={5} fill="#1a0c08" />
    </g>
  );
};

/** Clay bowl of water seen from above at an angle. ripple 0..1 time, amp strength. */
export const Bowl: React.FC<{ cx: number; cy: number; rx: number; ry: number; t: number; amp?: number; moon?: number; children?: React.ReactNode; rings?: { x: number; y: number; t: number }[] }> = ({ cx, cy, rx, ry, t, amp = 0, moon = 1, children, rings = [] }) => {
  const wrx = rx * 0.86, wry = ry * 0.78, wcy = cy + ry * 0.04;
  return (
    <g>
      <defs>
        <radialGradient id="water" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#9fc6d6" stopOpacity={0.55 * moon + 0.15} /><stop offset="0.6" stopColor="#3f6878" /><stop offset="1" stopColor="#1a2a34" />
        </radialGradient>
        <linearGradient id="clay" x1="0" x2="1">
          <stop offset="0" stopColor="#3a1e14" /><stop offset="0.4" stopColor="#8a4a2c" /><stop offset="0.65" stopColor="#a65d38" /><stop offset="1" stopColor="#40221a" />
        </linearGradient>
        <clipPath id="waterClip"><ellipse cx={cx} cy={wcy} rx={wrx} ry={wry} /></clipPath>
      </defs>
      <ellipse cx={cx + 20} cy={cy + ry * 1.25} rx={rx * 1.1} ry={ry * 0.55} fill="#000" opacity={0.5} />
      {/* outer body */}
      <path d={`M${cx - rx} ${cy} Q${cx - rx * 0.9} ${cy + ry * 1.5} ${cx} ${cy + ry * 1.55} Q${cx + rx * 0.9} ${cy + ry * 1.5} ${cx + rx} ${cy} Z`} fill="url(#clay)" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#5a2e1c" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#c98a5e" strokeWidth={6} opacity={0.6} />
      <path d={`M${cx - rx * 0.95} ${cy - ry * 0.25} A${rx} ${ry} 0 0 1 ${cx + rx * 0.2} ${cy - ry}`} stroke="#9fb8d4" strokeWidth={6} fill="none" opacity={0.6 * moon} />
      <ellipse cx={cx} cy={wcy} rx={wrx} ry={wry} fill="url(#water)" />
      <g clipPath="url(#waterClip)">
        {children}
        {/* water surface over the submerged crab */}
        <ellipse cx={cx} cy={wcy} rx={wrx} ry={wry} fill="#9fc6d6" opacity={0.12} />
        {[0, 1, 2, 3].map((i) => {
          const ph = (t * 0.6 + i / 4) % 1;
          const a = amp * (1 - ph);
          return <ellipse key={i} cx={cx + Math.sin(i * 2.1) * 20} cy={wcy} rx={wrx * (0.15 + ph * 0.9)} ry={wry * (0.15 + ph * 0.9)} fill="none" stroke="#d8eef6" strokeWidth={3 + 4 * a} opacity={0.12 + 0.55 * a} />;
        })}
        {rings.map((r, i) => {
          const ph = Math.max(0, r.t);
          if (ph <= 0 || ph > 1) return null;
          return <ellipse key={`r${i}`} cx={r.x} cy={r.y} rx={20 + ph * 220} ry={(20 + ph * 220) * (wry / wrx)} fill="none" stroke="#eaf8ff" strokeWidth={5} opacity={0.8 * (1 - ph)} />;
        })}
        {/* moon reflection */}
        <ellipse cx={cx - wrx * 0.3 + Math.sin(t * 3) * 8 * amp} cy={wcy - wry * 0.35} rx={wrx * 0.28} ry={wry * 0.12} fill="#e8f4ff" opacity={0.35 * moon} />
      </g>
    </g>
  );
};

/** Small grey child-like hand + forearm entering from (ex, ey) toward fingertip (fx, fy). poke 0..1 extends index finger. */
export const SmallHand: React.FC<{ ex: number; ey: number; fx: number; fy: number; poke?: number; wet?: number }> = ({ ex, ey, fx, fy, poke = 0, wet = 0 }) => {
  const ang = (Math.atan2(fy - ey, fx - ex) * 180) / Math.PI;
  const len = Math.hypot(fx - ex, fy - ey);
  // hand drawn along +x, wrist at x=len-150
  const wx = len - 150;
  return (
    <g transform={`translate(${ex} ${ey}) rotate(${ang})`}>
      <defs>
        <linearGradient id="skinT" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#cfdccb" /><stop offset="0.45" stopColor="#a9b8a6" /><stop offset="1" stopColor="#5f6e5e" />
        </linearGradient>
      </defs>
      {/* forearm (thin, childlike) */}
      <path d={`M0 -46 Q${wx * 0.5} -40 ${wx} -30 L${wx} 30 Q${wx * 0.5} 44 0 52 Z`} fill="url(#skinT)" />
      <path d={`M0 -46 Q${wx * 0.5} -40 ${wx} -30`} stroke="#e4eee0" strokeWidth={4} fill="none" opacity={0.7} />
      {/* palm */}
      <path d={`M${wx - 10} -36 Q${wx + 60} -46 ${wx + 90} -24 L${wx + 96} 28 Q${wx + 50} 50 ${wx - 10} 34 Z`} fill="url(#skinT)" />
      {/* curled fingers */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${wx + 88} ${-6 + i * 16} q30 ${2} 32 ${18} q-4 10 -20 6`} fill="#a9b8a6" stroke="#5f6e5e" strokeWidth={3} />
      ))}
      {/* index finger, extends with poke */}
      <path d={`M${wx + 86} -26 Q${wx + 120 + poke * 30} -32 ${len - 4 + poke * 10} -18 Q${len + 8 + poke * 10} -10 ${len - 4 + poke * 10} -4 Q${wx + 120} -6 ${wx + 86} -8 Z`} fill="url(#skinT)" stroke="#5f6e5e" strokeWidth={2} />
      {/* thumb */}
      <path d={`M${wx + 30} -38 q40 -30 70 -24 q6 8 -4 12 q-30 2 -50 22 Z`} fill="#b8c6b4" stroke="#5f6e5e" strokeWidth={2} />
      {/* knuckle lines + rim */}
      <path d={`M${wx + 60} -30 v8 M${wx + 72} -28 v8`} stroke="#6f7e6e" strokeWidth={2} />
      <path d={`M${wx - 10} -36 Q${wx + 60} -46 ${wx + 90} -24`} stroke="#eef6ea" strokeWidth={3} fill="none" opacity={0.8} />
      {/* wet sheen */}
      {wet > 0 && <path d={`M${wx + 20} 10 q40 8 70 0`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.5 * wet} />}
    </g>
  );
};

/** Droplet. */
export const Drop: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 8, o = 1 }) => (
  <g opacity={o}>
    <path d={`M${x} ${y - r * 1.8} Q${x + r} ${y - r * 0.3} ${x + r} ${y} A${r} ${r} 0 0 1 ${x - r} ${y} Q${x - r} ${y - r * 0.3} ${x} ${y - r * 1.8} Z`} fill="#cfe9f4" />
    <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.3} fill="#fff" />
  </g>
);

/** Tiny child footprint (bare foot) at (x,y), rotation a (deg), side ±1, scale s (perspective). */
export const Foot: React.FC<{ x: number; y: number; a: number; side: number; s?: number; sy?: number; o?: number }> = ({ x, y, a, side, s = 1, sy = 0.55, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s} ${s * sy}) rotate(${a}) scale(${side} 1)`} opacity={o}>
    <path d="M-14 26 Q-20 0 -12 -18 Q-2 -32 10 -22 Q18 -8 14 10 Q12 28 0 32 Q-10 32 -14 26 Z" fill="#2b3a40" opacity={0.75} />
    <path d="M-10 22 Q-14 2 -8 -12" stroke="#cfe6f0" strokeWidth={3} fill="none" opacity={0.6} />
    {[[-12, -32, 6], [-1, -38, 5], [8, -36, 4.5], [15, -30, 4], [19, -22, 3.5]].map(([tx, ty, r], i) => (
      <circle key={i} cx={tx} cy={ty} r={r} fill="#2b3a40" opacity={0.75} />
    ))}
  </g>
);
