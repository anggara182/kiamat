import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BandImg, Live, useShot, ramp, Cam, handheld, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { TC, Passenger, Narrator, Car } from '../art/train_art';
import { VP } from '../sets/train';

/* =============== Set "train" (owner T) =============== */

/** Light spill on the platform below a train whose left end is at x (world). */
const Spill: React.FC<{ x: number; len: number; o: number }> = ({ x, len, o }) => (
  <g opacity={o}>
    {Array.from({ length: Math.floor(len / 230) }, (_, i) => {
      const wx = x + 40 + i * 230;
      return <polygon key={i} points={`${wx},1552 ${wx + 200},1552 ${wx + 330},2304 ${wx - 90},2304`} fill="url(#tSpill)" />;
    })}
  </g>
);
const SpillDefs = () => (
  <defs>
    <linearGradient id="tSpill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={TC.warm} stopOpacity={0.55} /><stop offset="1" stopColor={TC.warm} stopOpacity={0} />
    </linearGradient>
    <linearGradient id="tHead" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stopColor="#fffaf0" stopOpacity={0.22} /><stop offset="1" stopColor="#fffaf0" stopOpacity={0} />
    </linearGradient>
  </defs>
);

/** 4 — interior wide down the carriage, too-bright light, identical passengers, one empty lit seat. Slow dolly. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const one = wordAt(4, /^one/i, 0.85);
  const push = EIO(p) * 0.1 + 0.04 * ramp(t, one - 0.3, one + 1.2, EIO);
  const h = handheld(t, 0.25);
  const cam: Cam = { zoom: 1.04 + push, dx: -40 * EIO(p), dy: 0, tx: h.hx, ty: h.hy, rot: h.hr * 0.5, ox: 600, oy: VP.y - 192 };
  return (
    <AbsoluteFill style={{ backgroundColor: TC.warm, overflow: 'hidden' }}>
      <BandImg id="train/interior" cam={cam} />
      <Live k={1.5} cam={cam}>
        <rect x={120} y={0} width={46} height={2304} fill="#2a2118" />
        <rect x={158} y={0} width={8} height={2304} fill={TC.warm} opacity={0.6} />
      </Live>
    </AbsoluteFill>
  );
};

const TrainFront: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <polygon points={`${x},${y + 160} ${x + 1500},${y + 40} ${x + 1500},${y + 470} ${x},${y + 470}`} fill="url(#tHead)" />
    <path d={`M ${x - 10} ${y} L ${x - 10} ${y + 530} L ${x + 60} ${y + 530} L ${x + 120} ${y + 470} L ${x + 150} ${y + 120} Q ${x + 120} ${y} ${x + 40} ${y} Z`} fill="#c7cfd8" />
    <path d={`M ${x + 60} ${y + 40} L ${x + 132} ${y + 60} L ${x + 126} ${y + 230} L ${x + 50} ${y + 230} Z`} fill="#20232c" />
    <circle cx={x + 108} cy={y + 360} r={16} fill="#fffaf0" />
    <circle cx={x + 108} cy={y + 360} r={60} fill="#fffaf0" opacity={0.2} />
  </g>
);

/** 6 — the bright train glides into the dark station, light spills onto the platform. Lateral track. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const e = EOUT(ramp(p, 0, 0.95, (x) => x));
  const front = -400 + 1900 * e; // world x of the train's nose
  const LEN = 1150, TY = 1040;
  const cam: Cam = { zoom: 1.02, dx: -60 * e, dy: 0, tx: handheld(t, 0.15).hx };
  const cars = [0, 1, 2, 3].map((i) => front - (i + 1) * (LEN + 30));
  return (
    <AbsoluteFill style={{ backgroundColor: TC.sky, overflow: 'hidden' }}>
      <BandImg id="train/station" k={0.5} cam={cam} />
      <Live cam={cam}>
        <SpillDefs />
        {cars.map((x, i) => <Car key={i} idp={`c6${i}`} x={x} y={TY} len={LEN} />)}
        <TrainFront x={front - 30} y={TY} />
      </Live>
      <BandImg id="train/plat" cam={cam} />
      <Live cam={cam}>
        {cars.map((x, i) => <Spill key={i} x={x} len={LEN} o={0.9} />)}
        {/* fg pillar silhouette */}
        <rect x={180} y={0} width={110} height={2304} fill={TC.near} />
      </Live>
    </AbsoluteFill>
  );
};

/** 7 — doors slide open right in front of the narrator's silhouette, light pours out. Locked. */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const o0 = wordAt(7, /opened/i, 0.15);
  const op = ramp(t, o0 - 0.2, o0 + 1.1, EIO);
  const DX = 388, DY = 560, DW = 520, DH = 1000; // door opening (world)
  const breathe = Math.sin(t * 1.6) * 3;
  const cam: Cam = { zoom: 1, dx: 0, dy: 0, tx: 0, ty: 0 };
  return (
    <AbsoluteFill style={{ backgroundColor: TC.sky, overflow: 'hidden' }}>
      <Live cam={cam}>
        <defs>
          <linearGradient id="t7body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a939e" /><stop offset="0.6" stopColor="#6c7581" /><stop offset="1" stopColor="#3a404a" /></linearGradient>
          <linearGradient id="t7in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffdf6" /><stop offset="1" stopColor={TC.warm2} /></linearGradient>
          <linearGradient id="t7pour" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={TC.warm} stopOpacity={0.75} /><stop offset="1" stopColor={TC.warm} stopOpacity={0} /></linearGradient>
          <radialGradient id="t7glow"><stop offset="0" stopColor={TC.warm} stopOpacity={0.5} /><stop offset="1" stopColor={TC.warm} stopOpacity={0} /></radialGradient>
        </defs>
        {/* carriage wall */}
        <rect x={0} y={200} width={1296} height={1440} fill="url(#t7body)" />
        <rect x={0} y={1330} width={1296} height={70} fill={TC.band} />
        <rect x={0} y={1408} width={1296} height={14} fill={TC.red} opacity={0.7} />
        <rect x={0} y={330} width={DX - 90} height={330} rx={18} fill="url(#t7in)" />
        <rect x={DX + DW + 90} y={330} width={500} height={330} rx={18} fill="url(#t7in)" />
        {/* passengers through the side windows: staring at the door */}
        {[110, 240].map((x) => <Passenger key={x} x={x} y={720} s={0.95} tilt={8} />)}
        <Passenger x={1080} y={720} s={0.95} tilt={-8} /><Passenger x={1210} y={720} s={0.95} tilt={-8} />
        <rect x={0} y={660} width={DX - 90} height={60} fill="#7c8590" />
        <rect x={DX + DW + 90} y={660} width={500} height={60} fill="#7c8590" />
        {/* interior seen through the door: empty seats */}
        <rect x={DX} y={DY} width={DW} height={DH} fill="url(#t7in)" />
        <rect x={DX + 40} y={DY + 520} width={DW - 80} height={70} fill="#b4523a" />
        <rect x={DX + 40} y={DY + 380} width={DW - 80} height={150} fill="#9a3f2e" />
        <rect x={DX + 60} y={DY + 120} width={DW - 120} height={200} rx={14} fill="#1b1d28" />
        <rect x={DX + DW / 2 - 8} y={DY} width={16} height={DH} fill="#cdbb95" />
        {/* doors */}
        {[-1, 1].map((sd) => {
          const w = DW / 2, x0 = sd < 0 ? DX - w * op : DX + w + w * op;
          return (
            <g key={sd}>
              <rect x={x0} y={DY} width={w} height={DH} fill="#9aa4ae" stroke="#4a5260" strokeWidth={6} />
              <rect x={x0 + 50} y={DY + 90} width={w - 100} height={360} rx={12} fill="url(#t7in)" />
              <rect x={sd < 0 ? x0 + w - 8 : x0} y={DY} width={8} height={DH} fill="#2a2e38" />
            </g>
          );
        })}
        {/* door frame */}
        <rect x={DX - 30} y={DY - 30} width={DW + 60} height={30} fill="#3a404a" />
        <rect x={DX - DW / 2 - 30} y={DY} width={DW / 2 + 30} height={DH} fill="url(#t7body)" />
        <rect x={DX + DW} y={DY} width={DW / 2 + 30} height={DH} fill="url(#t7body)" />
        <rect x={DX - 30} y={DY} width={30} height={DH} fill="#3a404a" />
        <rect x={DX + DW} y={DY} width={30} height={DH} fill="#3a404a" />
        <rect x={0} y={1640} width={1296} height={60} fill="#07080c" />
        {/* platform */}
        <rect x={0} y={1640} width={1296} height={664} fill={TC.conc} />
        <rect x={0} y={1700} width={1296} height={20} fill={TC.safety} opacity={0.8} />
        {/* light pouring out */}
        <g opacity={op}>
          <ellipse cx={DX + DW / 2} cy={DY + DH / 2} rx={DW * 1.1} ry={DH * 0.75} fill="url(#t7glow)" />
          <polygon points={`${DX},${DY + DH} ${DX + DW},${DY + DH} ${DX + DW + 420},2304 ${DX - 420},2304`} fill="url(#t7pour)" />
        </g>
        {/* narrator silhouette, back to camera */}
        <g transform={`translate(0 ${breathe})`}>
          <Narrator x={600} y={2380} s={1.12} rimO={0.25 + 0.75 * op} />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** 8 — HERO: a wall of identical pale faces in rows, all eyes on camera, a barely-there shared breath. Slow push-in. */
export const S08: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.12 * EIO(p), dx: 0, dy: 0, oy: 820 };
  const br = Math.sin(t * 1.25); // everyone breathes in sync
  const rows = [
    { y: 1000, s: 0.95, n: 6, off: 0 },
    { y: 1350, s: 1.22, n: 5, off: 0.5 },
    { y: 1760, s: 1.55, n: 4, off: 0 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: TC.warm, overflow: 'hidden' }}>
      <BandImg id="train/wall" k={0.6} cam={cam} />
      <Live cam={cam}>
        <defs>
          <linearGradient id="t8shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a4630" stopOpacity={0} /><stop offset="1" stopColor="#2a2016" stopOpacity={0.45} /></linearGradient>
        </defs>
        {rows.map((r, ri) => {
          const sp = 1296 / (r.n - 0.4);
          return (
            <g key={ri}>
              {Array.from({ length: r.n + 1 }, (_, i) => {
                const x = (i + r.off - 0.3) * sp + 40;
                return <Passenger key={i} x={x} y={r.y + br * 3 * r.s} s={r.s * (1 + 0.004 * br)} tilt={0} />;
              })}
              <rect x={0} y={r.y - 10} width={1296} height={30 * r.s} fill="#3c1f22" />
              {ri < 2 && <rect x={0} y={r.y - 120 * r.s} width={1296} height={130 * r.s + 20} fill="url(#t8shade)" />}
            </g>
          );
        })}
      </Live>
      <Live k={1.4} cam={cam}>
        {/* fg door edges */}
        <rect x={-40} y={0} width={210} height={2304} fill={TC.near} />
        <rect x={1150} y={0} width={200} height={2304} fill={TC.near} />
        <rect x={170} y={0} width={8} height={2304} fill={TC.warm} opacity={0.5} />
        <rect x={1142} y={0} width={8} height={2304} fill={TC.warm} opacity={0.5} />
      </Live>
    </AbsoluteFill>
  );
};

/** 11 — the tail of the train slides into the tunnel, the platform dims. Slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const go = wordAt(11, /slid/i, 0.35);
  const m = ramp(t, go - 1.2, go + 4, (x) => x * x);
  const tail = 150 + 1000 * m; // world x of the last car's rear end
  const LEN = 1150, TY = 1040;
  const dim = ramp(p, 0.4, 1, EIO);
  const cam: Cam = { zoom: 1.1 - 0.1 * EIO(p), dx: 0, dy: 0, ox: 760, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: TC.sky, overflow: 'hidden' }}>
      <BandImg id="train/station" cam={cam} />
      <Live cam={cam}>
        <SpillDefs />
        <defs>
          <clipPath id="t11clip"><rect x={0} y={0} width={1010} height={2304} /></clipPath>
        </defs>
        <g clipPath="url(#t11clip)">
          {[0, 1].map((i) => <Car key={i} idp={`c11${i}`} x={tail + i * (LEN + 30)} y={TY} len={LEN} />)}
          {/* rear cab with red tail lights */}
          <path d={`M ${tail + 10} ${TY} L ${tail - 40} ${TY + 120} L ${tail - 30} ${TY + 530} L ${tail + 20} ${TY + 530} Z`} fill="#9aa3ad" />
          <circle cx={tail - 18} cy={TY + 380} r={14} fill={TC.red} />
          <circle cx={tail - 18} cy={TY + 380} r={55} fill={TC.red} opacity={0.22} />
        </g>
      </Live>
      <BandImg id="train/plat" cam={cam} />
      <Live cam={cam}>
        <g clipPath="url(#t11clip)">
          {[0, 1].map((i) => <Spill key={i} x={tail + i * (LEN + 30)} len={LEN} o={0.9 * (1 - m)} />)}
        </g>
        <rect x={0} y={0} width={1296} height={2304} fill="#020308" opacity={0.55 * dim} />
      </Live>
    </AbsoluteFill>
  );
};
