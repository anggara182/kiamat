import React from 'react';
import { loadFont } from '@remotion/google-fonts/Caveat';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set C: top-down on the bedroom floor. A suitcase on a pandan mat under a warm lamp. */
export const { fontFamily: handFont } = loadFont('normal', { weights: ['600'], subsets: ['latin'] });

// layout in WORLD coords (frame + 108, 192)
export const LID = { x: 178, y: 662, w: 440, h: 700 };
export const BASE = { x: 638, y: 662, w: 480, h: 700 };
export const PAPER = { x: 210, y: 300, w: 360, h: 300, rot: -4 };
/** where the ticks go on the paper (paper-local coords) */
export const TICK_ROW = { x: 296, y: 236 };
export const INSERT_VB = { x: 261, y: 78, w: 894, h: 1589 };

const Floor: React.FC = () => {
  const r = rng(701);
  const planks = Array.from({ length: 9 }, (_, i) => ({ x: i * 150 - 20, tone: ['#4a2c1e', '#553321', '#4f2f1f', '#5a3624'][i % 4] }));
  return (
    <g>
      {planks.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={0} width={150} height={H} fill={p.tone} />
          {Array.from({ length: 14 }, (_, k) => {
            const x = p.x + 10 + r() * 130;
            return <path key={k} d={`M ${x} 0 C ${x + 8} ${H * 0.3}, ${x - 10} ${H * 0.6}, ${x + 4} ${H}`} stroke="#2a170f" strokeWidth={1 + r() * 2} opacity={0.25} fill="none" />;
          })}
          <rect x={p.x} y={0} width={3} height={H} fill="#1c0f09" opacity={0.8} />
          <rect x={p.x} y={(i * 677) % H} width={150} height={3} fill="#1c0f09" opacity={0.7} />
        </g>
      ))}
    </g>
  );
};

/** Woven pandan mat (tikar) with dyed border stripes. */
const Mat: React.FC = () => {
  const x0 = 120, y0 = 250, w = 1060, h = 1520;
  const strips = [];
  const s = 16;
  for (let gy = 0; gy < h / s; gy++) {
    for (let gx = 0; gx < w / s; gx++) {
      const over = (gx + gy) % 2 === 0;
      strips.push(<rect key={`${gx}-${gy}`} x={x0 + gx * s} y={y0 + gy * s} width={s} height={s} fill={over ? '#c4a06a' : '#b8935e'} />);
      strips.push(<line key={`l${gx}-${gy}`} x1={x0 + gx * s + (over ? 0 : 4)} y1={y0 + gy * s + (over ? 4 : 0)} x2={x0 + gx * s + (over ? s : 4)} y2={y0 + gy * s + (over ? 4 : s)} stroke="#e8cf9a" strokeWidth={1.2} opacity={0.35} />);
    }
  }
  return (
    <g>
      <rect x={x0 + 10} y={y0 + 14} width={w} height={h} fill="#1a0e08" opacity={0.5} />
      {strips}
      {[0, 1].map((k) => (
        <g key={k}>
          <rect x={x0} y={k ? y0 + h - 70 : y0 + 30} width={w} height={14} fill="#8c2f2a" />
          <rect x={x0} y={k ? y0 + h - 50 : y0 + 50} width={w} height={8} fill="#1f1418" />
        </g>
      ))}
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke="#7a5a36" strokeWidth={6} />
    </g>
  );
};

const Folded: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; collar?: boolean; lace?: boolean; tone?: string }> = ({ x, y, w, h, rot = 0, collar, lace, tone = '#f4efe9' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2 + 6} y={-h / 2 + 10} width={w} height={h} rx={10} fill="#2a1a12" opacity={0.35} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={tone} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h * 0.3} rx={10} fill="#ffffff" opacity={0.5} />
    <path d={`M ${-w / 2 + 14} ${h * 0.12} L ${w / 2 - 14} ${h * 0.12}`} stroke="#c9bfc4" strokeWidth={2} />
    <path d={`M ${-w * 0.18} ${-h / 2} L ${-w * 0.18} ${h / 2} M ${w * 0.18} ${-h / 2} L ${w * 0.18} ${h / 2}`} stroke="#d9d0d2" strokeWidth={1.5} opacity={0.7} />
    {collar && (
      <>
        <path d={`M ${-w * 0.2} ${-h / 2 + 4} Q 0 ${-h / 2 + 50} ${w * 0.2} ${-h / 2 + 4}`} fill="#fbf8f4" stroke="#c8bdc0" strokeWidth={2} />
        {[0, 1, 2].map((k) => <circle key={k} cx={0} cy={-h / 2 + 64 + k * 40} r={4} fill="#e2dad6" stroke="#b9aeae" />)}
      </>
    )}
    {lace && Array.from({ length: Math.floor(w / 26) }, (_, k) => <circle key={k} cx={-w / 2 + 13 + k * 26} cy={h / 2 - 2} r={11} fill="none" stroke="#e9e2dc" strokeWidth={3} />)}
  </g>
);

const Suitcase: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="leather" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#a8683e" />
        <stop offset="1" stopColor="#6a3a20" />
      </linearGradient>
      <linearGradient id="lining" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e6d6c0" />
        <stop offset="1" stopColor="#bda88e" />
      </linearGradient>
    </defs>
    {/* shadows */}
    <rect x={LID.x + 14} y={LID.y + 22} width={LID.w + BASE.w + 30} height={LID.h} rx={30} fill="#140a05" opacity={0.55} />
    {[LID, BASE].map((b, i) => (
      <g key={i}>
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={28} fill="url(#leather)" />
        <rect x={b.x + 4} y={b.y + 4} width={b.w - 8} height={b.h - 8} rx={24} fill="none" stroke="#e0a571" strokeWidth={2} opacity={0.45} strokeDasharray="7 6" />
        <rect x={b.x + 26} y={b.y + 26} width={b.w - 52} height={b.h - 52} rx={14} fill="url(#lining)" />
        {/* pinstripe lining */}
        {Array.from({ length: Math.floor((b.w - 52) / 22) }, (_, k) => <line key={k} x1={b.x + 36 + k * 22} y1={b.y + 28} x2={b.x + 36 + k * 22} y2={b.y + b.h - 28} stroke="#a89176" strokeWidth={1} opacity={0.4} />)}
        <rect x={b.x + 26} y={b.y + 26} width={b.w - 52} height={b.h - 52} rx={14} fill="none" stroke="#5a3220" strokeWidth={6} opacity={0.6} />
        {/* brass corners */}
        {[[b.x, b.y], [b.x + b.w, b.y], [b.x, b.y + b.h], [b.x + b.w, b.y + b.h]].map(([cx, cy], k) => (
          <path key={k} d={`M ${cx} ${cy} m ${cx === b.x ? 0 : -40} ${cy === b.y ? 0 : -40} h 40 v 40 h -40 Z`} fill="#c79a4a" opacity={0.85} transform={`translate(${cx === b.x ? 2 : -2} ${cy === b.y ? 2 : -2})`} />
        ))}
      </g>
    ))}
    {/* hinge */}
    <rect x={LID.x + LID.w - 6} y={LID.y + 80} width={32} height={LID.h - 160} fill="#4a2814" />
    {/* lid: elastic straps + zip mesh pocket */}
    <rect x={LID.x + 50} y={LID.y + 360} width={LID.w - 100} height={280} rx={12} fill="#9f8a70" opacity={0.55} />
    {Array.from({ length: 22 }, (_, k) => <line key={k} x1={LID.x + 50 + k * 16} y1={LID.y + 360} x2={LID.x + 50 + k * 16} y2={LID.y + 640} stroke="#6d5a46" strokeWidth={1} opacity={0.5} />)}
    <rect x={LID.x + 50} y={LID.y + 352} width={LID.w - 100} height={12} fill="#3a2a20" />
    <path d={`M ${LID.x + 60} ${LID.y + 80} L ${LID.x + LID.w - 60} ${LID.y + 300} M ${LID.x + LID.w - 60} ${LID.y + 80} L ${LID.x + 60} ${LID.y + 300}`} stroke="#3d2c22" strokeWidth={18} />
    {/* base: clothes, all white */}
    <Folded x={BASE.x + 140} y={BASE.y + 180} w={190} h={240} collar />
    <Folded x={BASE.x + 345} y={BASE.y + 190} w={180} h={250} rot={3} lace />
    <Folded x={BASE.x + 240} y={BASE.y + 450} w={340} h={200} rot={-2} lace tone="#f7f3ee" />
    {/* rolled sarong + socks */}
    <g transform={`translate(${BASE.x + 120} ${BASE.y + 610})`}>
      <rect x={-80} y={-34} width={300} height={68} rx={34} fill="#efe9e2" />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M ${-60 + k * 70} -34 Q ${-40 + k * 70} 0 ${-60 + k * 70} 34`} stroke="#cfc3bc" strokeWidth={3} fill="none" />)}
    </g>
    <circle cx={BASE.x + 400} cy={BASE.y + 620} r={30} fill="#f2ede6" stroke="#cfc3bc" strokeWidth={3} />
  </g>
);

const Paper: React.FC = () => {
  const items = ['white dress', 'white shirts', 'sandals', 'sunscreen'];
  return (
    <g transform={`translate(${PAPER.x} ${PAPER.y}) rotate(${PAPER.rot})`}>
      <rect x={8} y={10} width={PAPER.w} height={PAPER.h} fill="#1a0e08" opacity={0.4} />
      <rect x={0} y={0} width={PAPER.w} height={PAPER.h} fill="#f4ecdc" />
      {Array.from({ length: 7 }, (_, k) => <line key={k} x1={10} y1={52 + k * 36} x2={PAPER.w - 10} y2={52 + k * 36} stroke="#9ab4cc" strokeWidth={1} opacity={0.6} />)}
      <line x1={44} y1={0} x2={44} y2={PAPER.h} stroke="#e08a8a" strokeWidth={1.2} opacity={0.7} />
      <g fontFamily={handFont} fontWeight={600} fill="#2b3a6a">
        <text x={56} y={40} fontSize={32}>Pantai — packing</text>
        {items.map((t, k) => (
          <g key={k}>
            <text x={56} y={84 + k * 36} fontSize={28}>{t}</text>
            <path d={`M ${250} ${76 + k * 36} l 8 9 l 16 -20`} stroke="#2b3a6a" strokeWidth={3} fill="none" strokeLinecap="round" />
          </g>
        ))}
        <text x={56} y={84 + 4 * 36 + 6} fontSize={34} fill="#9a1f1f">NO GREEN!</text>
        <path d={`M 52 ${84 + 4 * 36 + 16} q 90 6 190 -2`} stroke="#9a1f1f" strokeWidth={3} fill="none" />
      </g>
      {/* ballpoint */}
      <g transform="translate(330 250) rotate(-35)">
        <rect x={-6} y={-150} width={12} height={150} rx={5} fill="#1d3a8a" />
        <path d="M -6 0 L 0 18 L 6 0 Z" fill="#cfc6b8" />
        <rect x={-7} y={-160} width={14} height={14} rx={3} fill="#0f1f4a" />
      </g>
    </g>
  );
};

/** Jasmine buds, a phone face-down, sandals, a sun hat (the bottom ones fall under the caption zone, decor only). */
const Props: React.FC = () => (
  <g>
    {[[1000, 330], [1030, 360], [985, 370], [1060, 330]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${i * 50})`}>
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-9} rx={5} ry={9} fill="#fbf6ea" transform={`rotate(${a})`} />)}
        <circle r={3} fill="#e9d9a0" />
      </g>
    ))}
    <g transform="translate(330 1560) rotate(12)">
      <ellipse cx={8} cy={10} rx={150} ry={140} fill="#1a0e08" opacity={0.4} />
      <ellipse rx={150} ry={140} fill="#efe6d6" />
      <ellipse rx={78} ry={72} fill="#e2d6c2" />
      <path d="M -78 0 A 78 72 0 0 1 78 0" stroke="#3a2a20" strokeWidth={10} fill="none" />
      {Array.from({ length: 12 }, (_, k) => <circle key={k} r={110 - (k % 2) * 4} fill="none" stroke="#d6c8b0" strokeWidth={1} opacity={0.6} />)}
    </g>
    {[[870, 1560, 8], [990, 1590, -6]].map(([x, y, a], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
        <rect x={-44} y={-110} width={88} height={220} rx={44} fill="#7a5034" />
        <path d="M -40 -40 Q 0 -10 40 -40" stroke="#3a2418" strokeWidth={12} fill="none" />
      </g>
    ))}
  </g>
);

const Lamp: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="lampPool" cx="0.42" cy="0.36" r="0.75">
        <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.3" />
        <stop offset="0.5" stopColor="#ffb070" stopOpacity="0.06" />
        <stop offset="1" stopColor="#0a0505" stopOpacity="0.7" />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill="url(#lampPool)" />
  </g>
);

export const BEDROOM: Record<string, BandSpec> = {
  'bedroom/room': { blur: 0.4, node: () => (<><Floor /><Mat /><Paper /><Suitcase /><Props /><Lamp /></>) },
  'bedroom/insert': { blur: 0.3, viewBox: `${INSERT_VB.x} ${INSERT_VB.y} ${INSERT_VB.w} ${INSERT_VB.h}`, node: () => (<><Floor /><Mat /><Paper /><Suitcase /><Props /><Lamp /></>) },
};

/* ---------- live: the mother's hands (top-down, back of the hand) ---------- */
/**
 * Wrist at (0,0), fingers point down (+y). side=1 right hand, -1 left. curl 0..1 bends the fingers (grip).
 * The kebaya sleeve runs from the wrist up to `armLen`.
 */
export const Hand: React.FC<{ x: number; y: number; rot: number; side: 1 | -1; curl?: number; armLen?: number; s?: number }> = ({ x, y, rot, side, curl = 0, armLen = 900, s = 1 }) => {
  const fingers = [
    { x: -34, len: 64, w: 19, a: -7 },
    { x: -12, len: 80, w: 21, a: -2 },
    { x: 11, len: 76, w: 21, a: 3 },
    { x: 32, len: 62, w: 18, a: 9 },
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${side * s} ${s})`}>
      {/* soft contact shadow */}
      <g transform="translate(14 22)" opacity={0.35}>
        <path d={`M -46 -${armLen} L -46 0 C -54 50, -56 110, -40 190 L 50 190 C 60 110, 56 50, 46 0 L 46 -${armLen} Z`} fill="#140a06" />
      </g>
      {/* forearm in the kebaya sleeve */}
      <path d={`M -44 -${armLen} L -46 -40 C -46 -20, -40 -6, -36 0 L 38 0 C 42 -6, 48 -20, 48 -40 L 46 -${armLen} Z`} fill="#6b2632" />
      {Array.from({ length: Math.floor(armLen / 46) }, (_, k) => (
        <g key={k} transform={`translate(0 ${-60 - k * 46})`} opacity={0.55}>
          <circle cx={-20} cy={0} r={6} fill="none" stroke="#d9a35a" strokeWidth={2} />
          <circle cx={18} cy={-22} r={4} fill="#d9a35a" />
          <path d="M -40 -12 q 10 -8 20 0 t 20 0" stroke="#d9a35a" strokeWidth={1.5} fill="none" />
        </g>
      ))}
      <path d={`M 40 -${armLen} L 42 -40`} stroke="#ffcf9c" strokeWidth={4} opacity={0.35} />
      {/* lace cuff */}
      <path d="M -50 -46 L 52 -46 L 52 -18 L -50 -18 Z" fill="#efe4d4" />
      {Array.from({ length: 9 }, (_, k) => <circle key={k} cx={-44 + k * 11.5} cy={-14} r={6} fill="#efe4d4" />)}
      {Array.from({ length: 9 }, (_, k) => <circle key={`h${k}`} cx={-44 + k * 11.5} cy={-30} r={2.5} fill="#b8a690" />)}
      {/* back of the hand */}
      <path d="M -36 -16 C -48 20, -52 70, -48 104 L 46 106 C 52 70, 50 20, 38 -16 Z" fill="#a26a50" />
      <path d="M 30 -10 C 44 30, 48 70, 44 100" stroke="#d49a7a" strokeWidth={6} opacity={0.5} fill="none" />
      {/* tendons / veins */}
      {[-24, -6, 12, 28].map((tx, i) => <path key={i} d={`M ${tx * 0.4} 10 C ${tx * 0.7} 40, ${tx * 0.9} 70, ${tx} 98`} stroke="#7c4a38" strokeWidth={2} opacity={0.45} fill="none" />)}
      {/* thumb */}
      <path d={`M -44 14 C -70 40, -88 ${70 + curl * 10}, -${92 - curl * 20} ${112 - curl * 10} C -94 126, -76 132, -70 120 C -62 98, -50 72, -38 58 Z`} fill="#98624a" />
      <ellipse cx={-80 + curl * 18} cy={118 - curl * 10} rx={8} ry={10} fill="#e2b49c" transform={`rotate(30 ${-80 + curl * 18} ${118 - curl * 10})`} />
      {/* fingers */}
      {fingers.map((f, i) => {
        const L = f.len * (1 - curl * 0.5);
        return (
          <g key={i} transform={`translate(${f.x} 100) rotate(${f.a})`}>
            <rect x={-f.w / 2} y={-8} width={f.w} height={L + 8} rx={f.w / 2} fill="#a26a50" />
            <rect x={-f.w / 2 + 3} y={-8} width={f.w * 0.35} height={L} rx={f.w / 4} fill="#c88a6a" opacity={0.5} />
            <path d={`M ${-f.w / 2 + 3} ${L * 0.45} q ${f.w / 2 - 3} 4 ${f.w - 6} 0`} stroke="#7c4a38" strokeWidth={1.5} fill="none" opacity={0.6} />
            <ellipse cx={0} cy={L - f.w * 0.35} rx={f.w * 0.32} ry={f.w * 0.42} fill="#e8bca4" />
            {curl > 0.3 && <rect x={-f.w / 2} y={L - 6} width={f.w} height={10} rx={5} fill="#7c4a38" opacity={0.5} />}
          </g>
        );
      })}
      {/* knuckles */}
      {fingers.map((f, i) => <ellipse key={`k${i}`} cx={f.x} cy={98} rx={9} ry={6} fill="#c38668" opacity={0.6} />)}
    </g>
  );
};
