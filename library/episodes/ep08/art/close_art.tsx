import React from 'react';

/** Pale hand seen from above under water, fingers pointing down-ish (origin at wrist). */
export const PaleHand: React.FC<{ flip: boolean; spread: number }> = ({ flip, spread }) => {
  const s = spread * 6;
  return (
    <g transform={flip ? 'scale(-1,1)' : undefined}>
      {/* forearm fading up */}
      <path d="M-46,-260 C-50,-160 -48,-60 -40,0 L42,0 C48,-70 50,-170 46,-260 Z" fill="#a7b0c0" opacity={0.3} />
      {/* palm */}
      <path d="M-44,-10 C-62,40 -60,100 -40,140 L44,140 C62,100 64,40 46,-10 Z" fill="#c9d0dc" />
      {/* fingers */}
      {[-30, -10, 11, 31].map((x, i) => (
        <path key={i} transform={`rotate(${(i - 1.5) * s})`} d={`M${x - 10},130 C${x - 12},180 ${x - 9},${220 + (i === 1 || i === 2 ? 20 : 0)} ${x},${232 + (i === 1 || i === 2 ? 20 : 0)} C${x + 9},${220 + (i === 1 || i === 2 ? 20 : 0)} ${x + 12},180 ${x + 10},130 Z`} fill="#c9d0dc" />
      ))}
      {/* thumb */}
      <path transform={`rotate(${-10 - s})`} d="M-44,30 C-90,60 -110,110 -100,150 C-90,154 -82,150 -78,120 C-70,90 -54,74 -38,70 Z" fill="#c2c9d6" />
      {/* shading + moon rim */}
      <path d="M20,-10 C40,40 44,100 30,140 L44,140 C62,100 64,40 46,-10 Z" fill="#8790a3" opacity={0.7} />
      <path d="M-44,-10 C-62,40 -60,100 -40,140" stroke="#eef2f8" strokeWidth={4} fill="none" opacity={0.9} />
      <path d="M-24,40 C-10,60 10,60 24,44" stroke="#8790a3" strokeWidth={3} fill="none" opacity={0.6} />
    </g>
  );
};

/** Head bowed, long wet hair hanging over the face, shoulders; origin = crown. Face never visible. */
export const BowedHead: React.FC<{ t: number }> = ({ t }) => {
  const strands = [-150, -110, -70, -30, 10, 50, 90, 130, 170];
  return (
    <g>
      <defs>
        <radialGradient id="c7rim" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#cfd8e6" stopOpacity={0.35} /><stop offset="1" stopColor="#cfd8e6" stopOpacity={0} /></radialGradient>
      </defs>
      <ellipse cx={180} cy={-20} rx={260} ry={260} fill="url(#c7rim)" />
      {/* shoulders and dress */}
      <path d="M-420,560 C-380,380 -260,300 -150,280 L150,280 C260,300 380,380 420,560 L460,900 L-460,900 Z" fill="#3d4456" />
      <path d="M150,280 C260,300 380,380 420,560 L460,900 L330,900 C320,640 260,420 140,330 Z" fill="#a7b0c0" opacity={0.55} />
      <path d="M150,280 C260,300 380,380 420,560" stroke="#e7e4dc" strokeWidth={6} fill="none" opacity={0.75} />
      {/* head mass, bowed forward (crown towards camera) */}
      <ellipse cx={0} cy={60} rx={170} ry={190} fill="#0b0c10" />
      {/* hair curtain hanging down past the chin */}
      <path d="M-170,40 C-240,260 -250,520 -200,760 L-130,820 L-100,700 L-70,860 L-40,720 L-10,900 L20,730 L55,850 L85,710 L120,800 L150,680 C215,540 230,320 180,40 C120,-90 -110,-90 -170,40 Z" fill="#0b0c10" />
      {/* strand strokes */}
      {strands.map((x, i) => {
        const w = 6 * Math.sin(t * 0.9 + i);
        return <path key={i} d={`M${x * 0.6},-40 C${x * 0.9},200 ${x + w},450 ${x * 0.85 + w},${680 + (i % 3) * 40}`} stroke="#1c2030" strokeWidth={5} fill="none" opacity={0.8} />;
      })}
      {/* moon rim on crown and right side */}
      <path d="M-60,-110 C40,-140 150,-60 180,60 C192,240 190,480 150,690" stroke="#cfd8e6" strokeWidth={6} fill="none" opacity={0.85} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${60 + i * 25},${-80 + i * 20} C${120 + i * 15},100 ${130 + i * 10},350 ${110 + i * 8},${560 + i * 30}`} stroke="#a7b0c0" strokeWidth={2.5} fill="none" opacity={0.45 - i * 0.07} />
      ))}
      <path d="M-120,-60 C-60,-110 20,-120 80,-100" stroke="#e9ecf2" strokeWidth={4} fill="none" opacity={0.6} />
      {/* drips from strand tips */}
      {[-130, -10, 120, 55].map((x, i) => {
        const ph = (t * 0.7 + i * 0.27) % 1;
        const y0 = [800, 880, 780, 840][i];
        return (
          <g key={i}>
            <ellipse cx={x} cy={y0 + 10} rx={5} ry={9} fill="#cfd8e6" opacity={ph < 0.5 ? 0.6 * ph * 2 : 0} />
            {ph >= 0.5 && <ellipse cx={x} cy={y0 + 10 + (ph - 0.5) * 2 * 500} rx={4} ry={10} fill="#cfd8e6" opacity={0.75 * (1 - (ph - 0.5) * 2)} />}
          </g>
        );
      })}
    </g>
  );
};

/** One wet bare footprint (origin centre, toes up). */
export const Footprint: React.FC<{ wet: number }> = ({ wet }) => (
  <g opacity={wet}>
    <path d="M-30,-60 C-44,-20 -40,40 -24,80 C-10,104 18,104 26,78 C34,40 30,10 34,-30 C38,-60 20,-80 0,-80 C-14,-80 -26,-74 -30,-60 Z" fill="#1b2026" opacity={0.75} />
    {[[-26, -104, 13], [-4, -112, 10], [14, -108, 9], [28, -98, 8], [38, -84, 7]].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 1.15} fill="#1b2026" opacity={0.75} />
    ))}
    <path d="M-28,-50 C-38,0 -32,50 -20,80" stroke="#fff4dc" strokeWidth={4} fill="none" opacity={0.5} />
  </g>
);

/** Ribbon helper: tapered filled shape along a sampled centreline. */
const ribbon = (pts: [number, number][], w0: number, w1: number) => {
  const n = pts.length, L: string[] = [], R: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const m = Math.hypot(nx, ny) || 1; nx /= m; ny /= m;
    const s = i / (n - 1); const w = (w0 + (w1 - w0) * Math.pow(s, 0.8)) / 2;
    L.push(`${(pts[i][0] + nx * w).toFixed(1)},${(pts[i][1] + ny * w).toFixed(1)}`);
    R.unshift(`${(pts[i][0] - nx * w).toFixed(1)},${(pts[i][1] - ny * w).toFixed(1)}`);
  }
  return `M${L.join(' L')} L${R.join(' L')} Z`;
};
const line = (pts: [number, number][]) => 'M' + pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' L');

/** Several long wet black hairs clumped together, lying in soft S-curves on the sill. */
export const HairStrand: React.FC<{ t: number }> = ({ t }) => {
  const sway = Math.sin(t * 0.6);
  // centreline of the clump, from off-frame left to the tip near the puddle
  const C = (s: number, k: number): [number, number] => {
    const x = -160 + s * 1040;
    const sep = k * (5 + 9 * Math.pow(Math.sin(Math.PI * s * 0.85), 2)) + Math.sin(s * 11 + k * 1.7) * 6 * Math.abs(k) * s;
    const y = 1030 - 105 * Math.sin(s * 5.2 + 0.4) * (0.6 + 0.4 * s) - 60 * s + sep + (s > 0.85 ? sway * 3 * (s - 0.85) * 6 : 0);
    return [x, y];
  };
  const N = 60;
  const hairs = [-2, -1, 0, 1, 2, 3].map((k, j) => {
    const end = 1 - [0.04, 0, 0.08, 0.02, 0.14, 0.24][j];
    const pts = Array.from({ length: N }, (_, i) => C((i / (N - 1)) * end, k));
    return { k, pts, w: [4.5, 6.5, 9, 6.5, 4.5, 4][j] };
  });
  // glints: short segments where the curve bends (crests)
  const glint = (a: number, b: number, k: number) => line(Array.from({ length: 10 }, (_, i) => C(a + ((b - a) * i) / 9, k)));
  return (
    <g>
      {/* soft contact shadow */}
      {hairs.slice(1, 4).map((h, i) => <path key={'s' + i} d={line(h.pts.map(([x, y]) => [x + 3, y + 7]))} stroke="#1a1009" strokeWidth={7} fill="none" opacity={0.18} />)}
      {hairs.map((h, i) => <path key={i} d={ribbon(h.pts, h.w, 0.6)} fill="#0b0c10" />)}
      {/* wet sheen: blue-white glints on the bends */}
      <path d={glint(0.12, 0.2, 0)} stroke="#d8e6f4" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d={glint(0.13, 0.18, -1)} stroke="#9fb6cf" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d={glint(0.48, 0.57, 0)} stroke="#e6eff8" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d={glint(0.5, 0.55, 1)} stroke="#9fb6cf" strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.65} />
      <path d={glint(0.79, 0.86, 0)} stroke="#d8e6f4" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.75 + 0.2 * Math.sin(t * 1.7)} />
    </g>
  );
};

/** Small irregular puddle of water on wood, catching light. */
export const Puddle: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-120,4 C-130,-18 -80,-30 -30,-26 C10,-40 70,-34 104,-16 C136,-2 120,24 80,26 C30,36 -20,30 -60,28 C-100,26 -114,18 -120,4 Z" fill="#2a1a0c" opacity={0.45} />
    <path d="M-110,2 C-116,-14 -76,-22 -30,-20 C12,-32 66,-26 98,-12 C124,0 110,18 76,20 C30,28 -22,24 -60,22 C-96,20 -106,14 -110,2 Z" fill="#9fb2c2" opacity={0.28} />
    <path d="M-96,-8 C-60,-20 -10,-18 30,-24 C60,-26 84,-18 96,-10" stroke="#ffffff" strokeWidth={2.5} fill="none" opacity={0.55 + 0.2 * Math.sin(t * 1.3)} />
    <ellipse cx={20} cy={-8} rx={40} ry={5} fill="#fff2d6" opacity={0.35} />
  </g>
);

/** A single water bead on wood. */
export const Drop: React.FC<{ x: number; y: number; r: number; t: number; i: number }> = ({ x, y, r, t, i }) => (
  <g>
    <ellipse cx={x + 3} cy={y + r * 0.55} rx={r * 1.15} ry={r * 0.4} fill="#1a1009" opacity={0.4} />
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.68} fill="#8fa3b5" opacity={0.5} />
    <ellipse cx={x + r * 0.1} cy={y + r * 0.28} rx={r * 0.65} ry={r * 0.3} fill="#f0d9ac" opacity={0.55} />
    <circle cx={x - r * 0.38} cy={y - r * 0.25} r={r * 0.24} fill="#ffffff" opacity={0.65 + 0.3 * Math.sin(t * 2 + i)} />
  </g>
);
