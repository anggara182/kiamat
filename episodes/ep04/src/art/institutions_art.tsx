import React from 'react';
import { loadFont as loadMarker } from '@remotion/google-fonts/PermanentMarker';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { Glow } from './institutions_kit';

const { fontFamily: MARKER } = loadMarker();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400'], subsets: ['latin'] });

/** EP04 set "institutions": hospital front + steps, hospital corridor, classroom. Frame coords. */

/* ---------------- hospital front (5, 6) ---------------- */
export const HF = { landing: 1200, door: { x1: 330, x2: 750, y1: 640, y2: 1200 } };

export const HospitalFront: React.FC = () => {
  const { door } = HF;
  return (
    <g>
      <defs>
        <linearGradient id="ihSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9d6de" /><stop offset="1" stopColor="#e6e8ea" /></linearGradient>
      </defs>
      <rect x={-108} y={-192} width={1296} height={700} fill="url(#ihSky)" />
      <rect x={-108} y={240} width={1296} height={980} fill="#e9ece8" />
      <rect x={-108} y={240} width={1296} height={40} fill="#c9cfcc" />
      {/* windows rows */}
      {[340, 470].map((y) => Array.from({ length: 9 }, (_, i) => <rect key={`${y}${i}`} x={-80 + i * 150} y={y} width={100} height={80} fill="#9fb8c4" opacity={0.85} />))}
      {/* entrance canopy + mint sign panel with a simple heartbeat line (no emblem, no text) */}
      <rect x={250} y={560} width={580} height={46} fill="#cfe3dc" />
      <rect x={250} y={606} width={580} height={14} fill="#9ab8ad" />
      <path d="M380 584 L480 584 L500 566 L522 602 L544 576 L560 584 L700 584" stroke="#4a8a78" strokeWidth={6} fill="none" />
      {/* glass doors */}
      <rect x={door.x1} y={door.y1} width={door.x2 - door.x1} height={door.y2 - door.y1} fill="#6f8f9a" />
      <rect x={door.x1} y={door.y1} width={door.x2 - door.x1} height={door.y2 - door.y1} fill="none" stroke="#b9c4c4" strokeWidth={14} />
      <rect x={(door.x1 + door.x2) / 2 - 6} y={door.y1} width={12} height={door.y2 - door.y1} fill="#b9c4c4" />
      <path d={`M${door.x1 + 30} ${door.y1 + 40} L${door.x1 + 120} ${door.y1 + 40} L${door.x1 + 30} ${door.y1 + 300} Z`} fill="#ffffff" opacity={0.25} />
      {[[400, 980], [600, 1000]].map(([x, y], i) => <rect key={i} x={x} y={y} width={40} height={140} rx={16} fill="#4e6870" opacity={0.6} />)}
      {/* pillars */}
      {[200, 860].map((x) => <rect key={x} x={x} y={560} width={56} height={640} fill="#d6dbd7" />)}
      {/* landing + steps */}
      <rect x={-108} y={HF.landing} width={1296} height={40} fill="#c4c0b6" />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={-108} y={HF.landing + 40 + i * 64} width={1296} height={64} fill={i % 2 ? '#b8b2a6' : '#c0bab0'} />
          <rect x={-108} y={HF.landing + 40 + i * 64} width={1296} height={8} fill="#e2ddd2" />
        </g>
      ))}
      <rect x={-108} y={HF.landing + 488} width={1296} height={500} fill="#a8a296" />
    </g>
  );
};

/** cheering crowd heads + arms along the bottom (low angle, ON TWOS) */
export const CheerCrowd: React.FC<{ t2: number; hype: number }> = ({ t2, hype }) => {
  const cols = ['#3a3a48', '#4a3a3a', '#2e3a44', '#443a30', '#38343e'];
  return (
    <g>
      {Array.from({ length: 11 }, (_, i) => {
        const x = -60 + i * 118 + (i % 2) * 30;
        const y = 1640 + (i % 3) * 70;
        const up = (0.5 + 0.5 * Math.sin(t2 * 6 + i * 1.9)) * (0.6 + 0.4 * hype);
        const c = cols[i % cols.length];
        return (
          <g key={i}>
            <path d={`M${x - 20} ${y - 40} L${x - 50 + 10 * up} ${y - 200 - 120 * up}`} stroke={c} strokeWidth={34} strokeLinecap="round" />
            {i % 3 !== 1 && <path d={`M${x + 30} ${y - 40} L${x + 70 - 10 * up} ${y - 180 - 100 * up}`} stroke={c} strokeWidth={34} strokeLinecap="round" />}
            <circle cx={x - 50 + 10 * up} cy={y - 220 - 120 * up} r={26} fill="#8a5a44" />
            <ellipse cx={x} cy={y + 180} rx={130} ry={240} fill={c} />
            <circle cx={x} cy={y - 70} r={70} fill="#1a1416" />
          </g>
        );
      })}
    </g>
  );
};

/** megaphone (prop) pointing toward screen-left-up from its grip (x,y); ang deg */
export const Megaphone: React.FC<{ x: number; y: number; ang: number; s?: number }> = ({ x, y, ang, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`}>
    <path d="M-20 -24 L-20 24 L150 80 L150 -80 Z" fill="#e8e2d0" />
    <path d="M-20 10 L-20 24 L150 80 L150 40 Z" fill="#b8b2a0" />
    <ellipse cx={150} cy={0} rx={18} ry={80} fill="#c9433a" />
    <rect x={-60} y={-20} width={44} height={40} rx={8} fill="#c9433a" />
    <rect x={-30} y={18} width={20} height={50} rx={6} fill="#3a3a3a" />
  </g>
);

/* ---------------- corridor (7) ---------------- */
export const Corridor: React.FC = () => (
  <g>
    <rect x={-108} y={-192} width={1296} height={2400} fill="#cfe3dc" />
    {/* perspective: back wall, ceiling, floor */}
    <path d="M-108 -192 L1188 -192 L700 640 L380 640 Z" fill="#eef2ee" />
    {[0, 1, 2, 3].map((i) => {
      const u = i / 4;
      const x1 = 380 - (488 * (1 - u)), x2 = 700 + (488 * (1 - u));
      return <rect key={i} x={(x1 + 540) / 2 - 60 * (1 - u) - 20} y={-192 + 832 * u * 0.9} width={120 * (1 - u) + 40} height={20 * (1 - u) + 6} fill="#ffffff" />;
    })}
    <path d="M-108 2112 L1188 2112 L700 1180 L380 1180 Z" fill="#b9c8c2" />
    <path d="M540 1180 L540 2112" stroke="#ffffff" strokeWidth={30} opacity={0.25} />
    <rect x={380} y={640} width={320} height={540} fill="#dfece6" />
    <rect x={480} y={760} width={120} height={420} fill="#9ab8ad" />
    {/* side doors */}
    <path d="M-108 380 L180 560 L180 1260 L-108 1500 Z" fill="#a8c8bc" />
    <path d="M-20 520 L120 600 L120 1260 L-20 1340 Z" fill="#7aa090" />
    <path d="M1188 380 L900 560 L900 1260 L1188 1500 Z" fill="#a8c8bc" />
    <path d="M1100 520 L960 600 L960 1260 L1100 1340 Z" fill="#7aa090" />
    <path d="M-108 1100 L380 900 M1188 1100 L700 900" stroke="#9ab8ad" strokeWidth={14} />
    {/* a gurney parked by the wall */}
    <rect x={720} y={1130} width={200} height={20} fill="#c8ced0" /><rect x={730} y={1150} width={8} height={70} fill="#8a9090" /><rect x={900} y={1150} width={8} height={70} fill="#8a9090" />
  </g>
);

/** clipboard chart; flip=true draws it upside down */
export const Chart: React.FC<{ x: number; y: number; rot: number; s?: number }> = ({ x, y, rot, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-80} y={-110} width={160} height={220} rx={10} fill="#8a6a4a" />
    <rect x={-68} y={-90} width={136} height={190} fill="#f6f4ee" />
    <rect x={-30} y={-118} width={60} height={24} rx={6} fill="#b8bec4" />
    <rect x={-56} y={-76} width={112} height={18} fill="#4a8a78" />
    {[-40, -24, -8].map((yy) => <rect key={yy} x={-56} y={yy} width={yy === -8 ? 60 : 100} height={6} fill="#8a8a8a" />)}
    <path d="M-56 70 L-30 40 L-10 56 L20 10 L50 24" stroke="#c9433a" strokeWidth={5} fill="none" />
    <path d="M-56 80 L56 80 M-56 80 L-56 10" stroke="#555" strokeWidth={3} />
  </g>
);

/* ---------------- classroom (8) ---------------- */
export const CB = { x1: 180, x2: 980, y1: 420, y2: 960 };
export const Classroom: React.FC = () => (
  <g>
    <rect x={-108} y={-192} width={1296} height={2400} fill="#e2dccb" />
    <rect x={-108} y={1150} width={1296} height={1000} fill="#9a8a70" />
    <rect x={CB.x1 - 30} y={CB.y1 - 30} width={CB.x2 - CB.x1 + 60} height={CB.y2 - CB.y1 + 60} fill="#7a5a3a" />
    <rect x={CB.x1} y={CB.y1} width={CB.x2 - CB.x1} height={CB.y2 - CB.y1} fill="#2f4a3c" />
    <rect x={CB.x1 - 30} y={CB.y2 + 30} width={CB.x2 - CB.x1 + 60} height={20} fill="#6a4a2e" />
    <rect x={260} y={CB.y2 + 22} width={60} height={14} fill="#f4f0e4" />
    {/* clock, window right */}
    <circle cx={1080} cy={300} r={46} fill="#f4f0e4" stroke="#5a4a3a" strokeWidth={6} />
    <rect x={1020} y={480} width={200} height={360} fill="#cfe0ea" />
    <rect x={1020} y={480} width={200} height={360} fill="none" stroke="#8a7a60" strokeWidth={12} />
    <rect x={-80} y={480} width={180} height={300} fill="#c8c0a8" />
    {/* teacher's desk */}
    <rect x={720} y={1080} width={300} height={24} fill="#8a6a44" /><rect x={740} y={1104} width={260} height={150} fill="#6a4e32" />
  </g>
);

/** chalk maths that gets erased: erase 0..1 sweeps left to right */
export const BoardMath: React.FC<{ erase: number }> = ({ erase }) => {
  const ex = CB.x1 + (CB.x2 - CB.x1 + 80) * erase - 40;
  return (
    <g>
      <defs>
        <clipPath id="ibErase"><rect x={ex} y={CB.y1} width={CB.x2 - ex + 10} height={CB.y2 - CB.y1} /></clipPath>
      </defs>
      <g clipPath="url(#ibErase)" fill="#e8ece6" fontFamily={KALAM} fontSize={50}>
        <text x={220} y={500}>3x + 5 = 20</text>
        <text x={220} y={580}>3x = 15</text>
        <text x={220} y={660}>x = 5</text>
        <text x={600} y={500}>a² + b² = c²</text>
        <text x={600} y={580}>3² + 4² = 25</text>
        <path d="M640 900 L900 900 L640 690 Z" stroke="#e8ece6" strokeWidth={4} fill="none" />
        <text x={220} y={760}>½ + ¼ = ¾</text>
        <text x={220} y={860}>12 ÷ 4 = 3</text>
      </g>
      {/* smudge left behind */}
      <rect x={CB.x1} y={CB.y1} width={Math.max(0, ex - CB.x1)} height={CB.y2 - CB.y1} fill="#e8ece6" opacity={0.08} />
    </g>
  );
};

const LETTERS: { ch: string; x: number; y: number; r: number; s: number }[] = [
  { ch: 'H', x: 260, y: 530, r: -8, s: 1.05 }, { ch: 'E', x: 360, y: 550, r: 6, s: 0.9 },
  { ch: 'K', x: 500, y: 590, r: -4, s: 1.1 }, { ch: 'N', x: 610, y: 580, r: 9, s: 0.95 }, { ch: 'O', x: 710, y: 610, r: -6, s: 1.0 },
  { ch: 'W', x: 820, y: 590, r: 5, s: 1.15 }, { ch: 'S', x: 930, y: 640, r: -12, s: 0.9 },
];
export const letterPos = (i: number) => LETTERS[Math.min(LETTERS.length - 1, Math.max(0, i))];

/** "HE KNOWS" in crooked chalk letters; n = letters shown (fraction = the one being written) */
export const HeKnows: React.FC<{ n: number }> = ({ n }) => (
  <g fontFamily={MARKER} fontSize={130} fill="#f4f6f0">
    {LETTERS.map((l, i) => {
      const a = Math.max(0, Math.min(1, n - i));
      if (a <= 0) return null;
      return (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
          <defs><clipPath id={`ibL${i}`}><rect x={-10} y={-130} width={120} height={130 * a + 20} /></clipPath></defs>
          <text x={0} y={0} clipPath={`url(#ibL${i})`} opacity={0.92}>{l.ch}</text>
        </g>
      );
    })}
  </g>
);

/** chalk dust motes in the window light (ones) */
export const ChalkDust: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Glow id="ibWin" x={1100} y={700} rx={500} ry={600} c="#fffaf0" o={0.35} />
    {Array.from({ length: 16 }, (_, i) => {
      const u = (t * 0.07 + i * 0.11) % 1;
      return <circle key={i} cx={600 + ((i * 83) % 500) + Math.sin(t + i) * 12} cy={500 + u * 700} r={3} fill="#ffffff" opacity={0.4 * Math.sin(Math.PI * u)} />;
    })}
  </g>
);
