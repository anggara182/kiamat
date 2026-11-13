import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BandImg, Live, useShot, ramp, Cam, handheld, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { VP, BENCH, Bench, Cap } from '../art/platform_geo';

/* =============== Set "platform" (owner P) =============== */
const frac = (sec: number, total: number) => Math.min(1, Math.max(0, sec / total));

const Glow: React.FC<{ id: string; c: string; o: number }> = ({ id, c, o }) => (
  <radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="0.35" stopColor={c} stopOpacity={o * 0.35} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>
);

/** Narrator seated, seen from behind, backpack on. Origin = seat point. */
const NarratorSeated: React.FC<{ x: number; y: number; s: number; breath: number }> = ({ x, y, s, breath }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -46 0 L -54 -112 C -54 -142 -30 -154 0 -156 C 30 -154 54 -142 54 -112 L 46 0 Z" fill="#11131a" />
    <path d="M -54 -112 C -54 -142 -30 -154 0 -156 C 30 -154 54 -142 54 -112" stroke="#d9f0ff" strokeWidth={3} fill="none" opacity={0.7} />
    <g transform={`translate(0 ${breath})`}>
      <rect x={-40} y={-140} width={80} height={110} rx={20} fill="#1b1f29" />
      <rect x={-30} y={-92} width={60} height={34} rx={10} fill="#141720" />
      <path d="M -40 -128 C -40 -140 -30 -146 -18 -146 L 18 -146 C 30 -146 40 -140 40 -128" stroke="#9fc4e0" strokeWidth={3} fill="none" opacity={0.75} />
      <line x1={-28} y1={-146} x2={-36} y2={-156} stroke="#0a0b10" strokeWidth={8} />
      <line x1={28} y1={-146} x2={36} y2={-156} stroke="#0a0b10" strokeWidth={8} />
    </g>
    <rect x={-9} y={-176} width={18} height={24} fill="#0a0b10" />
    <ellipse cx={0} cy={-194} rx={23} ry={27} fill="#05060a" />
    <path d="M -22 -204 C -20 -222 20 -224 23 -202" stroke="#d9f0ff" strokeWidth={3} fill="none" opacity={0.8} />
    {[-12, -4, 6, 14].map((h) => <path key={h} d={`M ${h} -220 q ${h * 0.3} 14 ${h * 0.2} 26`} stroke="#1c2230" strokeWidth={2} fill="none" />)}
  </g>
);

/** Platform clock (hanging), shows 00:40. */
const Clock: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={0} y1={-160} x2={0} y2={-60} stroke="#11131a" strokeWidth={8} />
    <rect x={-110} y={-62} width={220} height={96} rx={10} fill="#0b0d12" stroke="#2a3140" strokeWidth={4} />
    <text x={0} y={14} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={70} fill="#ff4d4d">00:40</text>
  </g>
);

/** Background station: bands + lamp flicker. */
const Station: React.FC<{ cam: Cam; flick?: number; children?: React.ReactNode; mid?: React.ReactNode }> = ({ cam, flick = 1, children, mid }) => (
  <>
    <BandImg id="platform/bg" k={0.9} cam={cam} />
    {mid}
    <BandImg id="platform/mid" k={1} cam={cam} style={{ opacity: flick }} />
    {children}
    <BandImg id="platform/near" k={1.3} cam={cam} />
  </>
);

/** 1 — wide one-point platform, slow push to the tunnel; a headlight grows in the dark mouth. */
export const S01: React.FC = () => {
  const { p, t, sec } = useShot();
  const h = handheld(t, 0.25);
  const cam: Cam = { zoom: 1 + 0.12 * EIO(p), dx: 0, dy: 0, ox: VP.x - 108, oy: VP.y - 192, tx: h.hx, ty: h.hy };
  const lit = ramp(p, 0.05, frac(wordAt(1, /^light/i, 0.55), sec));
  const flick = Math.abs(p - frac(wordAt(1, /^sound/i, 0.75), sec)) < 0.02 ? 0.82 : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f', overflow: 'hidden' }}>
      <Station cam={cam} flick={flick} mid={
        <Live k={0.9} cam={cam}>
          <defs><Glow id="p1h" c="#fff3d6" o={0.95} /><Glow id="p1w" c="#d9f0ff" o={0.4} /></defs>
          <ellipse cx={VP.x} cy={1050} rx={60 + 200 * lit} ry={40 + 140 * lit} fill="url(#p1w)" opacity={0.3 + 0.7 * lit} />
          <ellipse cx={VP.x} cy={1060} rx={14 + 30 * lit} ry={10 + 20 * lit} fill="url(#p1h)" />
          <circle cx={VP.x} cy={1060} r={3 + 5 * lit} fill="#ffffff" />
          {/* rail gleam toward the light */}
          {[560, 900].map((bx) => <line key={bx} x1={VP.x + 0.11 * (bx - VP.x)} y1={VP.y + 0.11 * 1304 - 2} x2={VP.x + 0.6 * (bx - VP.x)} y2={VP.y + 0.6 * 1304 - 4} stroke="#fff3d6" strokeWidth={3} opacity={0.5 * lit} />)}
        </Live>
      } />
    </AbsoluteFill>
  );
};

/** 5 — narrator alone on the bench under one lamp, clock 00:40. Locked, slow push. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 2.3 + 0.15 * EIO(p), dx: 0, dy: 0, ox: BENCH.x - 108, oy: BENCH.y - 192 - 40, tx: 140, ty: -60 };
  const breath = Math.sin(t * 1.6) * 1.5;
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f', overflow: 'hidden' }}>
      <Station cam={cam}>
        <Live k={1} cam={cam}>
          <defs><Glow id="p5pool" c="#d9f0ff" o={0.5} /></defs>
          <ellipse cx={BENCH.x} cy={BENCH.y - 200} rx={200} ry={240} fill="url(#p5pool)" />
          <rect x={BENCH.x - 70} y={BENCH.y - 330} width={140} height={10} rx={3} fill="#1a1e28" /><rect x={BENCH.x - 64} y={BENCH.y - 322} width={128} height={6} rx={3} fill="#eef8ff" /><line x1={BENCH.x - 50} y1={BENCH.y - 330} x2={BENCH.x - 50} y2={BENCH.y - 420} stroke="#11131a" strokeWidth={3} /><line x1={BENCH.x + 50} y1={BENCH.y - 330} x2={BENCH.x + 50} y2={BENCH.y - 420} stroke="#11131a" strokeWidth={3} />
          <Clock x={BENCH.x + 170} y={BENCH.y - 250} s={0.3} />
          <Bench x={BENCH.x} y={BENCH.y} s={BENCH.s} />
          <NarratorSeated x={BENCH.x - 18} y={BENCH.y - 46} s={0.52} breath={breath} />
        </Live>
      </Station>
    </AbsoluteFill>
  );
};

/** 9 — medium: the guard grabs the narrator's shoulder and pulls them back; hard train light from the right. */
export const S09: React.FC = () => {
  const { p, sec, t } = useShot();
  const g = frac(wordAt(9, /^grabbed/i, 0.2), sec), pl = frac(wordAt(9, /^pulled/i, 0.62), sec);
  const grab = ramp(p, g - 0.06, g + 0.04);
  const pull = ramp(p, pl - 0.03, pl + 0.1);
  const jolt = ramp(p, g, g + 0.05) * (1 - ramp(p, g + 0.05, g + 0.16));
  const h = handheld(t, 0.3);
  const cam: Cam = { zoom: 1, dx: 0, dy: 0, tx: h.hx - 14 * jolt, ty: h.hy + 6 * jolt };
  const nx = -36 * pull, lean = 5 - 8 * pull;
  const hand = { x: 712 + nx, y: 1030 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f', overflow: 'hidden' }}>
      <BandImg id="platform/bg" k={0.9} cam={{ ...cam, zoom: 1.9, ox: 760, oy: 800 }} />
      <BandImg id="platform/mid" k={1} cam={{ ...cam, zoom: 1.9, ox: 760, oy: 800 }} style={{ opacity: 0.7 }} />
      <Live k={1} cam={cam}>
        <defs>
          <Glow id="p9train" c="#fff3d6" o={1} />
          <linearGradient id="p9side" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#fff3d6" stopOpacity={0.85} /><stop offset="0.35" stopColor="#fff3d6" stopOpacity={0.15} /><stop offset="1" stopColor="#fff3d6" stopOpacity={0} /></linearGradient>
        </defs>
        <rect x={500} y={0} width={800} height={2304} fill="url(#p9side)" opacity={0.75 + 0.25 * p} />
        <ellipse cx={1300} cy={1000} rx={520} ry={900} fill="url(#p9train)" />
        {/* guard (behind, left) */}
        <g>
          <path d="M 300 2200 L 320 1180 C 322 1060 380 1010 470 1000 C 560 1008 610 1050 615 1180 L 640 2200 Z" fill="#0b0c11" />
          <path d="M 470 1000 C 560 1008 610 1050 615 1180 L 640 2200" stroke="#fff3d6" strokeWidth={6} fill="none" opacity={0.85} />
          {/* reflective vest stripes */}
          <path d="M 322 1290 L 618 1280 L 620 1320 L 323 1330 Z" fill="#6b7480" />
          <path d="M 480 1286 L 618 1280 L 620 1320 L 482 1326 Z" fill="#e6f2ff" />
          <path d="M 330 1500 L 626 1490 L 628 1528 L 331 1538 Z" fill="#5a626e" />
          <path d="M 500 1495 L 626 1490 L 628 1528 L 502 1533 Z" fill="#dbe8f5" />
          <rect x={448} y={940} width={44} height={70} fill="#07080c" />
          <ellipse cx={478} cy={880} rx={56} ry={70} fill="#07080c" />
          <path d="M 528 850 C 540 880 540 920 520 945" stroke="#fff3d6" strokeWidth={5} fill="none" opacity={0.9} />
          <Cap x={472} y={838} s={0.82} rim="#fff3d6" rimO={1} />
          {/* arm reaching to the narrator's shoulder */}
          <path d={`M 560 1060 C 610 1080 ${hand.x - 70} ${hand.y + 40} ${hand.x - 20} ${hand.y + 6} L ${hand.x - 10} ${hand.y + 46} C ${hand.x - 80} ${hand.y + 90} 620 1150 560 1140 Z`} fill="#0d0e14" opacity={grab} />
          <path d={`M 560 1060 C 610 1080 ${hand.x - 70} ${hand.y + 40} ${hand.x - 20} ${hand.y + 6}`} stroke="#fff3d6" strokeWidth={4} fill="none" opacity={0.8 * grab} />
        </g>
        {/* narrator (front, facing the train) */}
        <g transform={`translate(${nx} 0) rotate(${lean} 780 1900)`}>
          <path d="M 640 2200 L 660 1150 C 662 1060 720 1010 790 1004 C 870 1010 912 1060 916 1150 L 930 2200 Z" fill="#11131a" />
          <path d="M 790 1004 C 870 1010 912 1060 916 1150 L 930 2200" stroke="#fff3d6" strokeWidth={7} fill="none" />
          <rect x={612} y={1040} width={120} height={360} rx={34} fill="#1d212b" /><rect x={622} y={1220} width={90} height={110} rx={20} fill="#14171f" /><path d="M 732 1060 C 760 1100 770 1200 760 1300" stroke="#05060a" strokeWidth={14} fill="none" />
          <path d="M 732 1060 L 732 1380" stroke="#fff3d6" strokeWidth={3} opacity={0.5} />
          <rect x={772} y={950} width={40} height={66} fill="#0a0b10" />
          <ellipse cx={800} cy={900} rx={54} ry={64} fill="#08090d" />
          <path d="M 748 870 C 750 820 800 806 840 830 C 856 850 858 880 852 910 C 830 880 790 868 748 870 Z" fill="#05060a" />
          <path d="M 840 840 C 856 860 860 900 848 940" stroke="#fff3d6" strokeWidth={5} fill="none" /><ellipse cx={818} cy={906} rx={11} ry={17} fill="#141720" stroke="#fff3d6" strokeWidth={2} strokeOpacity={0.6} /><path d="M 700 1010 C 720 990 760 984 790 1000" stroke="#2a303c" strokeWidth={10} fill="none" />
        </g>
        {/* gloved hand on the shoulder */}
        <g transform={`translate(${hand.x} ${hand.y})`} opacity={grab}>
          <path d="M -30 0 C -20 -26 30 -30 50 -12 C 64 0 62 22 50 40 L 36 44 L 40 14 L 26 46 L 12 46 L 18 14 L 2 44 L -14 42 Z" fill="#0e0f14" />
          <path d="M -20 -18 C 0 -32 36 -28 52 -10 C 64 4 62 22 52 38" stroke="#fff3d6" strokeWidth={4} fill="none" />
        </g>
      </Live>
      <BandImg id="platform/near" k={1.3} cam={cam} />
    </AbsoluteFill>
  );
};

/** 10 — close on the guard's cap and jaw in profile, face in shadow, stripe catching the train light. Locked. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.02 * p, dx: 0, dy: 0, tx: Math.sin(t * 0.9) * 2, ty: 0 };
  const sweep = 0.85 + 0.15 * Math.sin(t * 2.4);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060a', overflow: 'hidden' }}>
      <Live k={1} cam={cam}>
        <defs>
          <Glow id="p10l" c="#fff3d6" o={1} />
          <linearGradient id="p10bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#06080f" /><stop offset="0.6" stopColor="#1a1f2a" /><stop offset="1" stopColor="#8a8678" /></linearGradient>
        </defs>
        <rect x={0} y={0} width={1296} height={2304} fill="url(#p10bg)" />
        <ellipse cx={1300} cy={900} rx={560} ry={1000} fill="url(#p10l)" opacity={sweep} />
        {/* lamp tubes far behind, soft */}
        <rect x={200} y={420} width={260} height={10} rx={5} fill="#d9f0ff" opacity={0.35} />
        <rect x={140} y={560} width={160} height={7} rx={4} fill="#d9f0ff" opacity={0.2} />
        {/* shoulders + collar */}
        <path d="M 120 2400 L 160 1640 C 200 1520 360 1460 540 1450 C 700 1450 820 1500 880 1620 L 960 2400 Z" fill="#0b0c11" />
        <path d="M 540 1450 C 700 1450 820 1500 880 1620 L 960 2400" stroke="#fff3d6" strokeWidth={7} fill="none" />
        {/* vest stripe catching hard light */}
        <path d="M 168 1690 C 400 1660 700 1650 900 1690 L 912 1760 C 700 1722 400 1730 172 1760 Z" fill="#59616c" />
        <path d="M 600 1660 C 730 1662 830 1672 900 1690 L 912 1760 C 830 1740 720 1728 604 1726 Z" fill="#f2f8ff" />
        {/* neck */}
        <path d="M 430 1480 L 450 1260 L 640 1240 L 660 1470 Z" fill="#08090d" />
        <path d="M 640 1240 L 660 1470" stroke="#fff3d6" strokeWidth={5} opacity={0.6} />
        {/* head in profile facing right: skull, jaw, nose, lips, chin */}
        <path d="M 360 1050 C 350 900 440 820 560 820 C 650 820 720 870 735 950 L 760 1030 L 790 1088 L 760 1100 L 768 1150 L 752 1166 L 760 1196 C 750 1240 712 1262 660 1262 L 600 1270 C 560 1290 500 1300 450 1290 C 380 1240 364 1150 360 1050 Z" fill="#07080b" />
        {/* hard rim on profile: nose, lips, chin, jaw */}
        <path d="M 735 950 L 760 1030 L 790 1088 L 760 1100 L 768 1150 L 752 1166 L 760 1196 C 750 1240 712 1262 660 1262 L 600 1270" stroke="#fff3d6" strokeWidth={5} fill="none" strokeLinejoin="round" />
        <path d="M 600 1270 C 640 1230 650 1180 640 1130" stroke="#3a3a3a" strokeWidth={3} fill="none" opacity={0.6} />
        <ellipse cx={470} cy={1040} rx={40} ry={56} fill="#0c0d12" />
        <Cap x={540} y={900} s={2.6} rim="#fff3d6" rimO={1} />
      </Live>
    </AbsoluteFill>
  );
};

/** 12 — the empty platform; the guard's cap left on the bench. Cold, quiet, slow push to the bench. */
export const S12: React.FC = () => {
  const { p, sec } = useShot();
  const e = EIO(p);
  const cam: Cam = { zoom: 1.5 + 0.8 * e, dx: 0, dy: 0, ox: BENCH.x - 108, oy: BENCH.y - 192 - 60, tx: 60 + 100 * e, ty: -40 - 30 * e };
  const off = frac(wordAt(12, /^guard/i, 0.8), sec);
  const flick = Math.abs(p - off) < 0.015 ? 0.85 : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f', overflow: 'hidden' }}>
      <Station cam={cam} flick={flick}>
        <Live k={1} cam={cam}>
          <defs><Glow id="p12pool" c="#d9f0ff" o={0.45} /></defs>
          <ellipse cx={BENCH.x} cy={BENCH.y - 200} rx={200} ry={240} fill="url(#p12pool)" />
          <rect x={BENCH.x - 70} y={BENCH.y - 330} width={140} height={10} rx={3} fill="#1a1e28" /><rect x={BENCH.x - 64} y={BENCH.y - 322} width={128} height={6} rx={3} fill="#eef8ff" /><line x1={BENCH.x - 50} y1={BENCH.y - 330} x2={BENCH.x - 50} y2={BENCH.y - 420} stroke="#11131a" strokeWidth={3} /><line x1={BENCH.x + 50} y1={BENCH.y - 330} x2={BENCH.x + 50} y2={BENCH.y - 420} stroke="#11131a" strokeWidth={3} />
          <Clock x={BENCH.x + 170} y={BENCH.y - 250} s={0.3} />
          <Bench x={BENCH.x} y={BENCH.y} s={BENCH.s} />
          <ellipse cx={BENCH.x + 20} cy={BENCH.y - 50} rx={40} ry={6} fill="#05060a" opacity={0.7} /><Cap x={BENCH.x + 10} y={BENCH.y - 52} s={0.3} />
        </Live>
      </Station>
    </AbsoluteFill>
  );
};
