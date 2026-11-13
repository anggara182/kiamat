import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set D: hotel corridor, one-point perspective built from a tiny 3D projection. */
export const VP = { x: 648, y: 930 }; // world coords (frame 540, 738)
const F = 800;
const HW = 1.4, FLOOR = 1.55, CEIL = -1.05; // metres; eye at 0
export const ZEND = 5.4;
export const proj = (x: number, y: number, z: number): [number, number] => [VP.x + (F * x) / z, VP.y + (F * y) / z];
const poly = (pts: [number, number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'} ${proj(...p).map((v) => v.toFixed(1)).join(' ')}`).join(' ') + ' Z';
const ZN = 0.35;
/** End-wall rectangle and the door of 308, in world px */
export const END = { l: proj(-HW, 0, ZEND)[0], r: proj(HW, 0, ZEND)[0], t: proj(0, CEIL, ZEND)[1], b: proj(0, FLOOR, ZEND)[1] };
export const DOOR = { l: proj(-0.48, 0, ZEND)[0], r: proj(0.48, 0, ZEND)[0], t: proj(0, FLOOR - 2.1, ZEND)[1], b: END.b };

const SideDoor: React.FC<{ side: -1 | 1; z0: number; num: string }> = ({ side, z0, num }) => {
  const x = side * HW, z1 = z0 + 0.95;
  const top = FLOOR - 2.1;
  const plate = proj(x, top + 0.35, z0 + 0.45);
  const ps = F / (z0 + 0.45);
  return (
    <g>
      <path d={poly([[x, top - 0.08, z0 - 0.08], [x, top - 0.08, z1 + 0.08], [x, FLOOR, z1 + 0.08], [x, FLOOR, z0 - 0.08]])} fill="#2a1712" />
      <path d={poly([[x, top, z0], [x, top, z1], [x, FLOOR, z1], [x, FLOOR, z0]])} fill="#4a2a1c" />
      <path d={poly([[x, top + 0.15, z0 + 0.12], [x, top + 0.15, z1 - 0.12], [x, top + 0.95, z1 - 0.12], [x, top + 0.95, z0 + 0.12]])} fill="none" stroke="#2a160f" strokeWidth={3} />
      <path d={poly([[x, top + 1.1, z0 + 0.12], [x, top + 1.1, z1 - 0.12], [x, FLOOR - 0.15, z1 - 0.12], [x, FLOOR - 0.15, z0 + 0.12]])} fill="none" stroke="#2a160f" strokeWidth={3} />
      {/* brass handle + plate */}
      <circle cx={proj(x, top + 1.05, z1 - 0.1)[0]} cy={proj(x, top + 1.05, z1 - 0.1)[1]} r={F / (z1 * 28)} fill="#d6a45a" />
      <rect x={plate[0] - ps * 0.07} y={plate[1] - ps * 0.05} width={ps * 0.14} height={ps * 0.1} fill="#c99a52" transform={`skewY(${side * -12})`} style={{ transformOrigin: `${plate[0]}px ${plate[1]}px` }} />
      <text x={plate[0]} y={plate[1] + ps * 0.03} fontSize={ps * 0.07} fontFamily="Georgia, serif" textAnchor="middle" fill="#3a2410" transform={`skewY(${side * -12})`} style={{ transformOrigin: `${plate[0]}px ${plate[1]}px` }}>{num}</text>
    </g>
  );
};

/** Walls, ceiling, carpet, side doors. The end-wall rectangle is left OPEN (end wall is its own band). */
const Corridor: React.FC = () => {
  const r = rng(801);
  const carpetLines: string[] = [];
  for (let c = -12; c < 12; c += 0.45) {
    for (const sgn of [1, -1]) {
      const za = Math.max(ZN, c), zb = za + 2 * HW;
      const xa = -HW * sgn, xb = HW * sgn;
      if (zb < ZN) continue;
      carpetLines.push(`M ${proj(xa, FLOOR, za).join(' ')} L ${proj(xb, FLOOR, zb).join(' ')}`);
    }
  }
  const lights = [1.2, 2.5, 3.9, 5.1];
  return (
    <g>
      <defs>
        <clipPath id="floorClip"><path d={poly([[-HW, FLOOR, ZN], [HW, FLOOR, ZN], [HW, FLOOR, ZEND], [-HW, FLOOR, ZEND]])} /></clipPath>
        <linearGradient id="wallFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* ceiling */}
      <path d={poly([[-HW, CEIL, ZN], [HW, CEIL, ZN], [HW, CEIL, ZEND], [-HW, CEIL, ZEND]])} fill="#2b2128" />
      {/* walls: wallpaper above, wainscot below */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <path d={poly([[sd * HW, CEIL, ZN], [sd * HW, CEIL, ZEND], [sd * HW, FLOOR, ZEND], [sd * HW, FLOOR, ZN]])} fill="#7a5848" />
          {Array.from({ length: 60 }, (_, k) => {
            const z = ZN + 0.05 + k * 0.09;
            return z < ZEND ? <path key={k} d={`M ${proj(sd * HW, CEIL, z).join(' ')} L ${proj(sd * HW, 0.65, z).join(' ')}`} stroke={k % 2 ? '#8a6656' : '#6a4a3e'} strokeWidth={Math.max(1, 30 / z)} opacity={0.45} /> : null;
          })}
          <path d={poly([[sd * HW, 0.65, ZN], [sd * HW, 0.65, ZEND], [sd * HW, FLOOR, ZEND], [sd * HW, FLOOR, ZN]])} fill="#3a2119" />
          <path d={`M ${proj(sd * HW, 0.65, ZN).join(' ')} L ${proj(sd * HW, 0.65, ZEND).join(' ')}`} stroke="#c99060" strokeWidth={6} opacity={0.6} />
          <path d={`M ${proj(sd * HW, CEIL + 0.05, ZN).join(' ')} L ${proj(sd * HW, CEIL + 0.05, ZEND).join(' ')}`} stroke="#d8b08a" strokeWidth={10} opacity={0.35} />
          {/* sconces with warm wash */}
          {[1.6, 3.6].map((z, i) => {
            const [sx, sy] = proj(sd * (HW - 0.02), -0.25, z);
            const rr = F / z;
            return (
              <g key={i}>
                <ellipse cx={sx} cy={sy} rx={rr * 0.35} ry={rr * 0.6} fill="#ffc787" opacity={0.18} />
                <ellipse cx={sx} cy={sy} rx={rr * 0.16} ry={rr * 0.28} fill="#ffc787" opacity={0.25} />
                <rect x={sx - rr * 0.03} y={sy - rr * 0.08} width={rr * 0.06} height={rr * 0.12} rx={rr * 0.02} fill="#ffe7bd" />
              </g>
            );
          })}
        </g>
      ))}
      <SideDoor side={-1} z0={2.2} num="306" />
      <SideDoor side={1} z0={2.9} num="307" />
      <SideDoor side={-1} z0={4.2} num="304" />
      <SideDoor side={1} z0={0.6} num="309" />
      {/* carpet: maroon with a gold lattice, border stripes */}
      <path d={poly([[-HW, FLOOR, ZN], [HW, FLOOR, ZN], [HW, FLOOR, ZEND], [-HW, FLOOR, ZEND]])} fill="#4a1a1e" />
      <g clipPath="url(#floorClip)">
        {carpetLines.map((d, i) => <path key={i} d={d} stroke="#b88a4a" strokeWidth={3} opacity={0.32} />)}
        {[-1, 1].map((sd) => <path key={sd} d={poly([[sd * (HW - 0.12), FLOOR, ZN], [sd * (HW - 0.2), FLOOR, ZN], [sd * (HW - 0.2), FLOOR, ZEND], [sd * (HW - 0.12), FLOOR, ZEND]])} fill="#c99a52" opacity={0.45} />)}
      </g>
      {/* ceiling light panels + their pools on the carpet */}
      {lights.map((z, i) => (
        <g key={i}>
          <path d={poly([[-0.32, CEIL, z - 0.22], [0.32, CEIL, z - 0.22], [0.32, CEIL, z + 0.22], [-0.32, CEIL, z + 0.22]])} fill={i === 2 ? '#8a7a68' : '#ffe9c4'} />
          <path d={poly([[-0.9, FLOOR, z - 0.6], [0.9, FLOOR, z - 0.6], [0.9, FLOOR, z + 0.6], [-0.9, FLOOR, z + 0.6]])} fill="#ffc98a" opacity={i === 2 ? 0.03 : 0.1} />
        </g>
      ))}
      {/* dimming toward the far end and the camera edges */}
      {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={r() * W} cy={r() * H} r={1} fill="#fff" opacity={0} />)}
    </g>
  );
};

/** End wall (bigger than its opening so a faster-zooming corridor band never uncovers its edge) with door 308. */
const EndWall: React.FC = () => {
  const dw = DOOR.r - DOOR.l, dh = DOOR.b - DOOR.t;
  const pad = 260;
  return (
    <g>
      <rect x={END.l - pad} y={END.t - pad} width={END.r - END.l + 2 * pad} height={END.b - END.t + 2 * pad} fill="#5e4236" />
      {Array.from({ length: 30 }, (_, k) => <rect key={k} x={END.l - pad + k * 16} y={END.t - pad} width={8} height={END.b - END.t + pad} fill="#6a4c3e" opacity={0.5} />)}
      <rect x={END.l - pad} y={END.b - (END.b - END.t) * 0.33} width={END.r - END.l + 2 * pad} height={(END.b - END.t) * 0.33 + pad} fill="#2e1a14" />
      <rect x={END.l - pad} y={END.b} width={END.r - END.l + 2 * pad} height={pad} fill="#3a1418" />
      {/* door frame + door */}
      <rect x={DOOR.l - 10} y={DOOR.t - 10} width={dw + 20} height={dh + 10} fill="#24130d" />
      <rect x={DOOR.l} y={DOOR.t} width={dw} height={dh - 3} fill="#4e2b1c" />
      <rect x={DOOR.l + dw * 0.12} y={DOOR.t + dh * 0.07} width={dw * 0.76} height={dh * 0.38} fill="none" stroke="#2e180f" strokeWidth={3} />
      <rect x={DOOR.l + dw * 0.12} y={DOOR.t + dh * 0.52} width={dw * 0.76} height={dh * 0.4} fill="none" stroke="#2e180f" strokeWidth={3} />
      <path d={`M ${DOOR.l + dw * 0.12 + 2} ${DOOR.t + dh * 0.07 + 2} h ${dw * 0.76 - 4}`} stroke="#b07a52" strokeWidth={1.5} opacity={0.6} />
      {/* brass 308 plate */}
      <rect x={DOOR.l + dw * 0.32} y={DOOR.t + dh * 0.2} width={dw * 0.36} height={dh * 0.08} rx={3} fill="#c99a52" />
      <text x={DOOR.l + dw / 2} y={DOOR.t + dh * 0.265} fontSize={dh * 0.06} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fill="#3a2410">308</text>
      <circle cx={DOOR.l + dw * 0.5} cy={DOOR.t + dh * 0.36} r={2.5} fill="#1a0e08" />
      {/* lever handle */}
      <rect x={DOOR.l + dw * 0.78} y={DOOR.t + dh * 0.53} width={dw * 0.12} height={dh * 0.012} rx={2} fill="#e0b46a" />
      <circle cx={DOOR.l + dw * 0.86} cy={DOOR.t + dh * 0.535} r={4} fill="#e0b46a" />
      {/* offering by the door: a little canang sari tray of flowers (someone still honours her) */}
      <g transform={`translate(${DOOR.l - 30} ${DOOR.b - 6})`}>
        <rect x={-18} y={-6} width={36} height={8} fill="#7a8a3a" />
        <circle cx={-8} cy={-8} r={4} fill="#fff4e0" /><circle cx={2} cy={-9} r={4} fill="#ffd060" /><circle cx={11} cy={-8} r={4} fill="#e8505a" />
      </g>
    </g>
  );
};

/** Near light fixture edge at the top of the frame, very defocused. */
const CorFg: React.FC = () => {
  const [x0, y0] = proj(-0.6, CEIL, 0.42), [x1] = proj(0.6, CEIL, 0.42);
  return (
    <g>
      <rect x={x0} y={y0 - 400} width={x1 - x0} height={400 + 140} fill="#1a1216" />
      <rect x={x0 + 40} y={y0 + 60} width={x1 - x0 - 80} height={60} fill="#ffe2b8" opacity={0.7} />
    </g>
  );
};

export const CORRIDOR: Record<string, BandSpec> = {
  'corridor/end': { blur: 1.5, node: () => <EndWall /> },
  'corridor/main': { blur: 0.8, node: () => <Corridor /> },
  'corridor/fg': { blur: 18, node: () => <CorFg /> },
};
