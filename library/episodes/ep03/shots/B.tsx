import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BandImg, Live, useShot, ramp, Cam, handheld, EIO } from '../comp/Camera';
import { WeweStand, WeweTall, Eyes } from '../art/bamboo_wewe';

/* =============== Set "bamboo" (owner B) =============== */

/** 3 — medium, slow lateral track through the stalks; Wewe Gombel crouched over a small child, rim-lit only. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const h = handheld(t, 0.4);
  const cam: Cam = { zoom: 1.05, dx: 70 - 140 * e, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr };
  return (
    <AbsoluteFill style={{ backgroundColor: '#141233', overflow: 'hidden' }}>
      <BandImg id="bamboo/far" k={0.3} cam={cam} />
      <BandImg id="bamboo/mid" k={0.6} cam={cam} />
      <Live k={0.8} cam={cam}>
        <g opacity={0.5}><polygon points="520,0 640,0 880,1500 700,1500" fill="#9fc0d8" opacity={0.10} /><polygon points="760,0 820,0 1000,1400 900,1400" fill="#9fc0d8" opacity={0.08} /></g>
        <WeweStand x={740} y={1440} s={0.66} t={t} rim={0.95} />
      </Live>
      <BandImg id="bamboo/fog" k={0.9} cam={{ ...cam, dx: cam.dx - 30 * p }} />
      <BandImg id="bamboo/near" k={1.6} cam={cam} />
    </AbsoluteFill>
  );
};

/** 8 — near-black between two moonlit stalks; a small hand waves low, two pale eyes far higher. Locked, then tiny push. */
export const S08: React.FC = () => {
  const { p, t } = useShot();
  const push = ramp(p, 0.45, 1, EIO);
  const cam: Cam = { zoom: 1 + 0.05 * push, dx: 0, dy: 0, oy: 900 };
  const wave = Math.sin(t * 7) * 14 * ramp(p, 0.1, 0.25);
  const eyesOn = ramp(p, 0.3, 0.55);
  const blink = Math.abs(p - 0.62) < 0.015 || Math.abs(p - 0.86) < 0.015 ? 0.15 : 1;
  const stalk = (x: number, w: number, lean: number) => (
    <g>
      <path d={`M ${x - w / 2} 2400 L ${x - w / 2 + lean} -100 L ${x + w / 2 + lean} -100 L ${x + w / 2} 2400 Z`} fill="#0f130e" />
      <path d={`M ${x - w / 2} 2400 L ${x - w / 2 + lean} -100`} stroke="#9fc0d8" strokeWidth={4} opacity={0.55} />
      {[420, 760, 1120, 1480, 1840].map((y) => {
        const xx = x + (lean * (2400 - y)) / 2500;
        return <line key={y} x1={xx - w / 2} y1={y} x2={xx + w / 2} y2={y - 3} stroke="#070806" strokeWidth={5} />;
      })}
    </g>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#050408', overflow: 'hidden' }}>
      <Live k={1} cam={cam}>
        <defs>
          <radialGradient id="b8gap" cx="0.5" cy="0.35" r="0.6">
            <stop offset="0" stopColor="#14182a" />
            <stop offset="1" stopColor="#050408" />
          </radialGradient>
          <radialGradient id="b8pool">
            <stop offset="0" stopColor="#3a4a66" stopOpacity={0.7} />
            <stop offset="1" stopColor="#3a4a66" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1296} height={2304} fill="url(#b8gap)" />
        {/* barely-there body: a darker column between the stalks */}
        <WeweTall x={650} y={1700} s={0.9} t={t} rim={0.08} fill="#040306" />
        <Eyes x={652} y={1700 - 1330 * 0.9} s={0.9} o={eyesOn} id="b8eyes" blink={blink} />
        <ellipse cx={645} cy={1430} rx={150} ry={190} fill="url(#b8pool)" />
        {/* HERO: small child's hand waving low from the dark */}
        <g transform={`translate(640 1440) rotate(${wave})`}>
          <path d="M -9 70 L -7 0 C -14 -6 -16 -20 -12 -30 L -10 -48 L -4 -48 L -3 -30 L 0 -54 L 6 -54 L 6 -30 L 11 -50 L 17 -48 L 13 -26 L 20 -38 L 25 -34 L 16 -10 C 14 0 10 4 8 6 L 10 70 Z" fill="#4a4566" />
          <path d="M -12 -30 L -10 -48 M 0 -54 L 6 -54 M 11 -50 L 17 -48 M 20 -38 L 25 -34" stroke="#9fc0d8" strokeWidth={3} opacity={0.85} strokeLinecap="round" />
        </g>
        <polygon points="560,0 700,0 760,1700 600,1700" fill="#9fc0d8" opacity={0.05} />
        <radialGradient id="b8f1"><stop offset="0" stopColor="#5d6a8a" stopOpacity={0.35} /><stop offset="1" stopColor="#5d6a8a" stopOpacity={0} /></radialGradient>
        <radialGradient id="b8f2"><stop offset="0" stopColor="#9fc0d8" stopOpacity={0.22} /><stop offset="1" stopColor="#9fc0d8" stopOpacity={0} /></radialGradient>
        <ellipse cx={650} cy={1570} rx={380} ry={110} fill="url(#b8f1)" />
        <ellipse cx={630} cy={1545} rx={220} ry={60} fill="url(#b8f2)" />
        <ellipse cx={670} cy={1600} rx={300} ry={70} fill="url(#b8f1)" />
        {stalk(430, 90, 20)}
        {stalk(880, 100, -16)}
      </Live>
    </AbsoluteFill>
  );
};

/** 12 — POV slow push into darker bamboo; a very faint tall figure deep inside, eyes catch light at the end. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const h = handheld(t, 0.25);
  const cam: Cam = { zoom: 1 + 0.3 * e, dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr, oy: 800 };
  const eyes = ramp(p, 0.72, 0.84);
  const ignite = 0.75 + 0.5 * ramp(p, 0.84, 0.97, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e1430', overflow: 'hidden' }}>
      <BandImg id="bamboo/far" k={0.4} cam={cam} />
      {/* darker grade (static overlay, not a filter) */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(5,6,16,0.45)' }} />
      <BandImg id="bamboo/mid" k={0.75} cam={cam} style={{ opacity: 0.85 }} />
      <Live k={0.5} cam={cam}>
        <defs>
          <radialGradient id="b12fog">
            <stop offset="0" stopColor="#5d6a8a" stopOpacity={0.6} />
            <stop offset="1" stopColor="#5d6a8a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={650} cy={1100} rx={240} ry={560} fill="url(#b12fog)" />
        <ellipse cx={640} cy={1560} rx={260} ry={34} fill="#5d6a8a" opacity={0.22} />
        <WeweStand x={680} y={1560} s={0.6} t={t} rim={0.35} child={false} glow={0.2} />
        <Eyes x={680 - 105 * 0.6} y={1560 - 1415 * 0.6} s={ignite * 0.8} o={eyes} id="b12eyes" />
      </Live>
      <BandImg id="bamboo/fog" k={0.9} cam={cam} style={{ opacity: 0.6 }} />
      <BandImg id="bamboo/near" k={1.5} cam={cam} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 40%, rgba(0,0,0,0) 30%, rgba(3,2,6,0.6) 100%)' }} />
    </AbsoluteFill>
  );
};
