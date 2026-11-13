import React from 'react';
import { Glow, Puff } from './market_kit';

/** Set "homes": a small house front at noon with a gutter (shot 9) and a dark terrace facing the lit mosque window (shot 24). Frame coords. */
export const HS = { ground: 1316, gutter: [1326, 1396] as [number, number], door: { x1: 70, x2: 410, y1: 380, y2: 1260 } };

export const HouseBand: React.FC = () => {
  const { door } = HS;
  return (
    <g>
      <defs>
        <linearGradient id="hhSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8e2e6" /><stop offset="1" stopColor="#f2f1ea" /></linearGradient>
        <linearGradient id="hhStreet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a9286" /><stop offset="1" stopColor="#6e675d" /></linearGradient>
      </defs>
      <rect x={-108} y={-192} width={1296} height={600} fill="url(#hhSky)" />
      {/* roof eave (tiles) + its hard shadow on the wall */}
      <rect x={-108} y={240} width={1296} height={1080} fill="#d8cdb8" />
      <path d="M-108 120 L1188 120 L1188 250 L-108 250 Z" fill="#9a4a32" />
      {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M${-108 + i * 76} 250 q38 22 76 0`} fill="#7e3a26" />)}
      <rect x={-108} y={262} width={1296} height={120} fill="#2a2018" opacity={0.28} />
      {/* door (open, dark inside) */}
      <rect x={door.x1 - 18} y={door.y1 - 18} width={door.x2 - door.x1 + 36} height={door.y2 - door.y1 + 18} fill="#7a6048" />
      <rect x={door.x1} y={door.y1} width={door.x2 - door.x1} height={door.y2 - door.y1} fill="#2a2420" />
      <path d={`M${door.x2} ${door.y1} L${door.x2 + 90} ${door.y1 + 30} L${door.x2 + 90} ${door.y2 - 10} L${door.x2} ${door.y2} Z`} fill="#8a6a4e" />
      <rect x={door.x1 + 40} y={door.y1 + 120} width={120} height={180} fill="#3a322a" opacity={0.8} />
      {/* window with teralis */}
      <rect x={600} y={520} width={330} height={340} fill="#7a6048" />
      <rect x={620} y={540} width={290} height={300} fill="#4a5258" />
      <rect x={620} y={540} width={290} height={150} fill="#8fa0a8" opacity={0.5} />
      {[680, 740, 800, 860].map((x) => <rect key={x} x={x} y={540} width={8} height={300} fill="#2a2a2a" />)}
      <path d="M620 690 Q765 610 910 690" stroke="#2a2a2a" strokeWidth={8} fill="none" />
      <rect x={590} y={860} width={350} height={20} fill="#b9ad98" />
      {/* potted plants */}
      {[[500, 1250], [1040, 1250]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 50} ${y - 90} L${x + 50} ${y - 90} L${x + 38} ${y} L${x - 38} ${y} Z`} fill="#a8583a" />
          {[-40, -15, 10, 35].map((d, k) => <ellipse key={k} cx={x + d} cy={y - 150 - (k % 2) * 40} rx={30} ry={70} fill="#4d5a49" transform={`rotate(${d * 0.8} ${x + d} ${y - 110})`} />)}
        </g>
      ))}
      {/* doorstep + terrace edge */}
      <rect x={20} y={door.y2} width={460} height={HS.ground - door.y2} fill="#b8b0a2" />
      <rect x={-108} y={HS.ground - 20} width={1296} height={24} fill="#a89e8e" />
      {/* gutter (selokan): concrete channel with dark water */}
      <rect x={-108} y={HS.gutter[0]} width={1296} height={HS.gutter[1] - HS.gutter[0]} fill="#5a544a" />
      <rect x={-108} y={HS.gutter[0] + 18} width={1296} height={HS.gutter[1] - HS.gutter[0] - 18} fill="#3e4a48" />
      <rect x={-108} y={HS.gutter[1]} width={1296} height={14} fill="#8a8274" />
      {/* street */}
      <rect x={-108} y={HS.gutter[1] + 14} width={1296} height={800} fill="url(#hhStreet)" />
    </g>
  );
};

/** water in the gutter flowing (ones) */
export const GutterFlow: React.FC<{ t: number; amt: number }> = ({ t, amt }) => (
  <g>
    {Array.from({ length: 10 }, (_, i) => {
      const x = ((i * 140 + t * 260) % 1500) - 200;
      return <path key={i} d={`M${x} ${HS.gutter[0] + 36 + (i % 3) * 10} q40 -6 80 0`} stroke="#a8c4c4" strokeWidth={3} fill="none" opacity={0.25 + 0.4 * amt} />;
    })}
  </g>
);

/** water pouring from the bucket lip (lx,ly) into the gutter + splash (ones). flow 0..1, splash 0..1 */
export const Pour: React.FC<{ lx: number; ly: number; flow: number; splash: number; t: number }> = ({ lx, ly, flow, splash, t }) => {
  const gy = HS.gutter[0] + 30;
  const tx = lx + 60;
  const w = 10 + 40 * flow;
  return (
    <g>
      {flow > 0.02 && (
        <g>
          <path d={`M${lx - w / 2} ${ly} Q${lx + 30} ${ly + 40} ${tx - w * 0.4} ${gy} L${tx + w * 0.6} ${gy} Q${lx + 50 + w / 2} ${ly + 30} ${lx + w / 2} ${ly} Z`} fill="#bcd8e4" opacity={0.8} />
          <path d={`M${lx} ${ly + 6} Q${lx + 34} ${ly + 50} ${tx} ${gy - 10}`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.6} />
          {Array.from({ length: 5 }, (_, i) => {
            const u = (t * 3 + i / 5) % 1;
            return <circle key={i} cx={tx + Math.sin(i * 2.3) * 40 * u} cy={gy - 30 * Math.sin(Math.PI * u)} r={5} fill="#d8ecf2" opacity={flow * (1 - u)} />;
          })}
        </g>
      )}
      {splash > 0 && (
        <g opacity={Math.sin(Math.PI * Math.min(1, splash))}>
          {Array.from({ length: 12 }, (_, i) => {
            const a = Math.PI * (0.1 + 0.8 * (i / 11));
            const r = 40 + 160 * splash;
            return <ellipse key={i} cx={tx - Math.cos(a) * r} cy={gy - Math.sin(a) * r * 0.9 + 60 * splash * splash} rx={7} ry={11} fill="#dcf0f6" />;
          })}
          <ellipse cx={tx} cy={gy + 4} rx={60 + 160 * splash} ry={12 + 10 * splash} fill="none" stroke="#dcf0f6" strokeWidth={5} />
          <Puff id="hhSpl" x={tx} y={gy - 20} r={40 + 50 * splash} c="#eef8fb" o={0.5} />
        </g>
      )}
    </g>
  );
};

/** plastic bucket, pivot at the rim near the hands; tilt deg */
export const Bucket: React.FC<{ x: number; y: number; tilt: number }> = ({ x, y, tilt }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
    <path d="M-80 0 L80 0 L64 170 L-64 170 Z" fill="#3f8a5a" />
    <path d="M40 0 L80 0 L64 170 L32 170 Z" fill="#2c6640" />
    <ellipse cx={0} cy={0} rx={80} ry={14} fill="#2c6640" />
    <ellipse cx={0} cy={2} rx={72} ry={10} fill="#a8c8d0" opacity={Math.max(0, 1 - tilt / 110)} />
    <path d="M-80 0 Q0 -110 80 0" stroke="#2a2a2a" strokeWidth={5} fill="none" />
  </g>
);

/** doll held by the daughter (prop) */
export const Doll: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M-26 0 L26 0 L34 90 L-34 90 Z" fill="#d86a8a" />
    <circle cx={0} cy={-26} r={26} fill="#e8c4a0" />
    <path d="M-28 -30 Q0 -66 28 -30 L30 10 L22 -20 Q0 -40 -22 -20 L-30 10 Z" fill="#6a3a2a" />
    <path d="M-34 20 L-56 60 M34 20 L56 60" stroke="#e8c4a0" strokeWidth={12} strokeLinecap="round" />
  </g>
);

/* ---------------- night terrace ---------------- */
export const TR = { win: { x: 760, y: 560, w: 150, h: 220 }, bench: 1230 };

export const TerraceBand: React.FC = () => {
  const { win } = TR;
  return (
    <g>
      <defs>
        <linearGradient id="htSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05070f" /><stop offset="1" stopColor="#141a30" /></linearGradient>
      </defs>
      <rect x={-108} y={-192} width={1296} height={1100} fill="url(#htSky)" />
      {/* across the alley: houses + the mosque wall with one lit arched window and a small dome */}
      <path d="M-108 700 L120 640 L300 680 L300 1100 L-108 1100 Z" fill="#0c1020" />
      <rect x={560} y={420} width={628} height={700} fill="#10152a" />
      <ellipse cx={870} cy={420} rx={140} ry={110} fill="#10152a" />
      <rect x={866} y={280} width={8} height={40} fill="#10152a" />
      <path d={`M${win.x} ${win.y + win.h} L${win.x} ${win.y + 60} Q${win.x + win.w / 2} ${win.y - 30} ${win.x + win.w} ${win.y + 60} L${win.x + win.w} ${win.y + win.h} Z`} fill="#ffcf86" />
      <path d={`M${win.x + win.w / 2} ${win.y + 10} L${win.x + win.w / 2} ${win.y + win.h}`} stroke="#8a5a2a" strokeWidth={6} />
      <rect x={300} y={760} width={260} height={340} fill="#0a0d1a" />
      {/* the alley floor + a faint light patch below the window */}
      <rect x={-108} y={1100} width={1296} height={60} fill="#181c2c" />
      <ellipse cx={835} cy={1130} rx={220} ry={30} fill="#ffcf86" opacity={0.12} />
      {/* our terrace: pillar, eave, low wall, floor */}
      <rect x={-108} y={-192} width={1296} height={250} fill="#05060c" />
      <rect x={-108} y={40} width={1296} height={24} fill="#0b0d18" />
      <rect x={20} y={40} width={70} height={1400} fill="#07080f" />
      <rect x={-108} y={1160} width={1296} height={80} fill="#0c0e1a" />
      <rect x={-108} y={1236} width={1296} height={900} fill="#090a14" />
      {/* bench */}
      <rect x={180} y={TR.bench} width={620} height={26} fill="#1a1622" />
      <rect x={210} y={TR.bench + 26} width={22} height={130} fill="#12101a" /><rect x={750} y={TR.bench + 26} width={22} height={130} fill="#12101a" />
      <path d={`M180 ${TR.bench} L800 ${TR.bench}`} stroke="#ffcf86" strokeWidth={3} opacity={0.25} />
    </g>
  );
};

/** live: window glow flicker (ones) */
export const MosqueGlow: React.FC<{ t: number; o?: number }> = ({ t, o = 1 }) => (
  <g>
    <Glow id="htWin" x={TR.win.x + TR.win.w / 2} y={TR.win.y + TR.win.h / 2} rx={300} ry={300} c="#ffcf86" o={(0.5 + 0.03 * Math.sin(t * 9)) * o} mid={0.25} />
  </g>
);
