import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Mask, Eyes, FaceSkin, Fringe } from '../art/close_face';
import { GripBack, GripFront } from '../art/close_hands';

const FW = 1080, FH = 1920;
const RIM = '#a9c4e8';
const L: React.FC<{ cam: Cam; k?: number; children: React.ReactNode }> = ({ cam, k = 1, children }) => (
  <Live cam={cam} k={k} w={FW} h={FH}>{children}</Live>
);
const wp = (id: number, re: RegExp, fb: number, sec: number) => Math.min(1, Math.max(0, wordAt(id, re, fb) / sec));
const bump = (p: number, at: number, w = 0.06) => Math.max(0, 1 - Math.abs(p - at - w * 0.5) / w);

/** shot 6 — low angle, the woman leaning down into frame, halo behind her head. */
export const S06: React.FC = () => {
  const { p, t, sec } = useShot();
  const lean = ramp(p, 0, wp(6, /down/, 0.35, sec) + 0.08, EIO);
  const push = ramp(p, 0, 1, EIO);
  const h = handheld(t, 0.15);
  const cam: Cam = { zoom: 1 + 0.07 * push, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 760 };
  const fy = 700 + 80 * lean, fs = 0.68 + 0.05 * lean;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0d18' }}>
      <L cam={cam} k={0.4}>
        <defs>
          <linearGradient id="c6sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a1f33" /><stop offset="1" stopColor="#0b0d18" /></linearGradient>
          <radialGradient id="c6halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#e8f1ff" stopOpacity={0.95} /><stop offset="0.18" stopColor="#c9dcf5" stopOpacity={0.6} /><stop offset="0.5" stopColor="#6f86ad" stopOpacity={0.22} /><stop offset="1" stopColor="#1a1f33" stopOpacity={0} /></radialGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2320} fill="url(#c6sky)" />
        <circle cx={560} cy={330} r={760} fill="url(#c6halo)" />
        <circle cx={700} cy={250} r={40} fill="#f6f9ff" />
        {/* wires + pole, mid silhouettes */}
        <path d="M-200,300 C300,380 700,360 1300,250" stroke="#12141d" strokeWidth={5} fill="none" />
        <path d="M-200,420 C300,520 700,500 1300,380" stroke="#12141d" strokeWidth={4} fill="none" />
        <path d="M880,-200 L960,2200 L1060,2200 L940,-200 Z" fill="#12141d" />
      </L>
      <L cam={cam} k={0.8}>
        {/* trench coat shoulders above, looming */}
        <path d="M-160,-200 L1240,-200 L1240,120 C1050,260 860,300 760,330 L320,330 C220,300 30,260 -160,120 Z" fill="#3b352d" />
        <path d="M-160,-200 L1240,-200 L1240,120 C1050,260 860,300 760,330 L320,330 C220,300 30,260 -160,120 Z" fill="#07080d" opacity={0.75} />
        <path d="M760,330 C860,300 1050,260 1240,120" stroke="#b9a98f" strokeWidth={5} fill="none" opacity={0.5} />
        <path d="M320,330 L440,170 L540,330 L640,170 L760,330" fill="#2a251f" opacity={0.6} />
        <ellipse cx={560} cy={fy - 300} rx={560} ry={460} fill="url(#c6halo)" opacity={0.75} />
        {/* hair back curtain, hanging toward camera */}
        <g transform={`translate(${540 - 500 * fs},${fy - 500 * fs}) scale(${fs})`}>
          <path d="M60,40 C120,-220 880,-220 940,40 C1000,500 1060,1100 1020,1640 C900,1560 860,1700 760,1600 C700,1700 620,1580 560,1680 L440,1680 C380,1580 300,1700 240,1600 C140,1700 100,1560 -20,1640 C-60,1100 0,500 60,40 Z" fill="#0b0b0e" />
          <FaceSkin />
          <Eyes id="c6" glint={0.6} />
          <Mask id="c6" loopSide={1} />
          <Fringe y={420} sway={Math.sin(t * 0.9) * 6} />
          {/* curtains framing the face */}
          <path d="M60,0 C40,400 120,800 160,1100 C190,1300 140,1500 110,1640 C60,1500 -10,1200 -20,900 C-30,500 0,200 60,0 Z" fill="#0b0b0e" />
          <path d="M940,0 C960,400 880,800 840,1100 C810,1300 860,1500 890,1640 C940,1500 1010,1200 1020,900 C1030,500 1000,200 940,0 Z" fill="#0b0b0e" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${910 + i * 22},${60 + i * 30} C${960 + i * 14},500 ${940 + i * 18 + Math.sin(t + i) * 6},1100 ${930 + i * 20 + Math.sin(t * 0.8 + i) * 10},${1500 + i * 30}`} stroke={RIM} strokeWidth={4 - i * 0.5} fill="none" opacity={0.6 - i * 0.09} />
          ))}
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${80 - i * 24},${80 + i * 40} C${30 - i * 10},500 ${50 - i * 14},1100 ${70 - i * 18 + Math.sin(t * 0.7 + i) * 8},${1480 + i * 40}`} stroke="#6f86ad" strokeWidth={3} fill="none" opacity={0.35 - i * 0.08} />
          ))}
          {/* halo rim on the crown */}
          <path d="M120,-120 C300,-230 700,-230 880,-120" stroke="#e8f1ff" strokeWidth={8} fill="none" opacity={0.7} />
        </g>
      </L>
      {/* foreground: dark low-angle wall edge */}
      <L cam={cam} k={1.1}>
        <path d="M-120,2050 L-120,1250 C80,1300 180,1500 260,2050 Z" fill="#07080d" />
        <path d="M1200,2050 L1200,1400 C1050,1460 980,1700 940,2050 Z" fill="#07080d" />
      </L>
    </AbsoluteFill>
  );
};

/** shot 7 — extreme close on mask edge and eyes, mask tugs on each whispered word. */
export const S07: React.FC = () => {
  const { p, t, sec } = useShot();
  const w1 = wp(7, /^Am/, 0.15, sec), w2 = wp(7, /^I$/, 0.4, sec), w3 = wp(7, /pretty/, 0.62, sec);
  const tug = Math.min(1, bump(p, w1, 0.12) + bump(p, w2, 0.12) + 1.2 * bump(p, w3, 0.2));
  const push = ramp(p, 0, 1, EIO);
  const h = handheld(t, 0.08);
  const s = 1.56, tx = 540 - 500 * s + 40, ty = 650 - 455 * s;
  const cam: Cam = { zoom: 1 + 0.05 * push, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 700 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#040508' }}>
      <L cam={cam}>
        <defs>
          <linearGradient id="c7dark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#040508" stopOpacity={0.92} /><stop offset="0.45" stopColor="#040508" stopOpacity={0.45} /><stop offset="0.8" stopColor="#040508" stopOpacity={0.12} /><stop offset="1" stopColor="#040508" stopOpacity={0.3} /></linearGradient>
          <linearGradient id="c7v" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stopColor="#040508" stopOpacity={0} /><stop offset="1" stopColor="#040508" stopOpacity={0.95} /></linearGradient>
        </defs>
        <g transform={`translate(${tx},${ty}) scale(${s})`}>
          <path d="M-40,0 C-60,600 -40,1100 0,1300 L1000,1300 C1040,1100 1060,600 1040,0 Z" fill="#0b0b0e" />
          <FaceSkin />
          <Eyes id="c7" glint={0.9} />
          <Mask id="c7" tug={tug} loopSide={1} />
          <Fringe y={418} sway={Math.sin(t * 0.7) * 3} />
          <path d="M920,0 C960,400 900,800 880,1300 L1100,1300 L1100,0 Z" fill="#0b0b0e" />
          <path d="M925,40 C965,420 910,800 890,1240" stroke={RIM} strokeWidth={4} fill="none" opacity={0.7} />
        </g>
        <rect x={-100} y={-100} width={1280} height={2120} fill="url(#c7dark)" />
        <rect x={-100} y={-100} width={1280} height={2120} fill="url(#c7v)" />
      </L>
    </AbsoluteFill>
  );
};

/** shot 8 — two small hands gripping the school bag strap, trembling. */
export const S08: React.FC = () => {
  const { p, t, sec } = useShot();
  const never = wp(8, /^Never/, 0.6, sec);
  const sq = ramp(p, never - 0.04, never + 0.04, EIO);
  const tr = 0.6 + 1.4 * sq;
  const jx = tr * (Math.sin(t * 23) * 1.3 + Math.sin(t * 37 + 1) * 0.8), jy = tr * Math.sin(t * 29 + 2) * 1.1;
  const push = ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: 1.22 + 0.04 * push, dx: 0, dy: 0, ox: 560, oy: 700 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c14' }}>
      <L cam={cam} k={0.5}>
        <defs>
          <radialGradient id="c8l" cx="0.62" cy="0.18" r="0.8"><stop offset="0" stopColor="#3a4766" /><stop offset="0.5" stopColor="#161b2b" /><stop offset="1" stopColor="#07080d" /></radialGradient>
        </defs>
        <rect x={-100} y={-100} width={1280} height={2120} fill="url(#c8l)" />
        {/* uniform folds */}
        <path d="M120,-100 C200,500 160,1100 240,2000" stroke="#07080d" strokeWidth={60} fill="none" opacity={0.5} />
        <path d="M900,-100 C860,600 940,1200 880,2000" stroke="#07080d" strokeWidth={80} fill="none" opacity={0.45} />
        {/* sailor collar edge, top left */}
        <path d="M-100,-100 L380,-100 L-100,420 Z" fill="#1b2340" />
        <path d="M300,-100 L-100,330" stroke="#dfe6f2" strokeWidth={10} opacity={0.55} />
        <path d="M340,-100 L-100,370" stroke="#dfe6f2" strokeWidth={6} opacity={0.4} />
      </L>
      <L cam={cam}>
        <g transform={`translate(${jx},${jy})`}>
          <GripBack cx={548} cy={540} dir={1} rot={-2} />
          <GripBack cx={576} cy={900} dir={-1} rot={-2} />
          {/* strap */}
          <path d="M470,-120 L590,-120 L650,1700 L530,1700 Z" fill="#20180f" />
          <path d="M478,-120 L486,-120 L546,1700 L538,1700 Z" fill="#c9b79e" opacity={0.25} />
          <path d="M500,-120 L560,1700" stroke="#7d6a52" strokeWidth={3} strokeDasharray="14 12" opacity={0.6} />
          <path d="M562,-120 L622,1700" stroke="#7d6a52" strokeWidth={3} strokeDasharray="14 12" opacity={0.6} />
          {/* buckle */}
          <rect x={548} y={1180} width={150} height={64} rx={10} fill="none" stroke="#8e98a8" strokeWidth={12} transform="rotate(2 620 1212)" />
          <GripFront cx={548} cy={540} dir={1} sq={sq} rot={-2} />
          <g transform={`translate(${-jx * 0.4},${jy * 0.5})`}><GripFront cx={576} cy={900} dir={-1} sq={sq} rot={-2} /></g>
        </g>
      </L>
    </AbsoluteFill>
  );
};

/** shot 9 — the schoolgirl's profile silhouette looking up, breath vapor, cold light from above. */
export const S09: React.FC = () => {
  const { p, t, sec } = useShot();
  const b1 = wp(9, /said/, 0.2, sec), b2 = wp(9, /average/, 0.7, sec);
  const push = ramp(p, 0, 1, EIO);
  const h = handheld(t, 0.1);
  const cam: Cam = { zoom: 1 + 0.04 * push, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 600, oy: 800 };
  const puff = (at: number, i: number) => {
    const q = Math.max(0, Math.min(1, (p - at) / 0.35));
    if (q <= 0) return null;
    const o = Math.sin(Math.PI * Math.min(1, q * 1.2)) * 0.32;
    return (
      <g key={i} opacity={o}>
        <ellipse cx={700 + 160 * q} cy={830 - 150 * q} rx={40 + 130 * q} ry={24 + 70 * q} fill="url(#c9vap)" />
        <ellipse cx={660 + 230 * q} cy={800 - 250 * q} rx={30 + 90 * q} ry={20 + 50 * q} fill="url(#c9vap)" />
      </g>
    );
  };
  const breathe = 0.5 + 0.5 * Math.sin(t * 1.6);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080d' }}>
      <L cam={cam} k={0.4}>
        <defs>
          <linearGradient id="c9bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b3654" /><stop offset="0.45" stopColor="#121624" /><stop offset="1" stopColor="#07080d" /></linearGradient>
          <radialGradient id="c9cone" cx="0.7" cy="0" r="0.75"><stop offset="0" stopColor="#e8f1ff" stopOpacity={0.55} /><stop offset="0.4" stopColor="#9fb5d8" stopOpacity={0.18} /><stop offset="1" stopColor="#9fb5d8" stopOpacity={0} /></radialGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2320} fill="url(#c9bg)" />
        <ellipse cx={780} cy={-60} rx={760} ry={1100} fill="url(#c9cone)" />
        {/* looming coat edge far right, out of focus */}
        <path d="M1280,-200 L1280,2100 L1080,2100 C1040,1400 1000,600 1060,-200 Z" fill="#12141d" />
        <path d="M1060,-200 C1000,600 1040,1400 1080,2100" stroke="#b9a98f" strokeWidth={4} fill="none" opacity={0.25} />
      </L>
      <L cam={cam}>
        <defs>
          <radialGradient id="c9vap" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#e8f1ff" stopOpacity={0.9} /><stop offset="1" stopColor="#e8f1ff" stopOpacity={0} /></radialGradient>
        </defs>
        <g transform={`translate(0,${breathe * 3})`}>
          {/* shoulders + sailor collar */}
          <path d="M60,1960 C80,1500 200,1300 380,1210 L560,1150 C640,1230 760,1330 860,1520 C930,1700 960,1850 980,1960 Z" fill="#0d1120" />
          <path d="M380,1210 L560,1150 C620,1220 700,1310 760,1400 L420,1500 C380,1400 360,1300 380,1210 Z" fill="#1a2240" />
          <path d="M560,1160 C630,1240 700,1320 750,1400" stroke="#dfe6f2" strokeWidth={8} fill="none" opacity={0.8} />
          <path d="M540,1180 C605,1255 670,1335 720,1415" stroke="#dfe6f2" strokeWidth={5} fill="none" opacity={0.55} />
          {/* neck + head profile looking up-right */}
          <path d="M360,1260 C330,1120 270,1000 280,860 C290,720 360,610 480,580 C570,560 640,600 680,660 C700,690 712,720 712,748 C716,770 730,790 760,806 C772,816 764,832 742,836 C734,848 744,860 738,872 C732,884 720,884 722,898 C724,914 714,926 696,934 C690,960 670,990 630,1010 C600,1030 580,1060 580,1150 L560,1180 Z" fill="#07080d" />
          {/* cold rim along the profile */}
          <path d="M680,660 C700,690 712,720 712,748 C716,770 730,790 760,806 C772,816 764,832 742,836 C734,848 744,860 738,872 C732,884 720,884 722,898 C724,914 714,926 696,934 C690,960 670,990 630,1010" stroke="#e8f1ff" strokeWidth={5} fill="none" opacity={0.9} strokeLinejoin="round" />
          <path d="M630,1010 C600,1030 580,1060 580,1150" stroke={RIM} strokeWidth={3} fill="none" opacity={0.5} />
          {/* eyelash flick */}
          <path d="M690,742 L712,728" stroke="#07080d" strokeWidth={6} strokeLinecap="round" />
          {/* hair: crown + back fall + bangs */}
          <path d="M470,560 C580,540 670,600 700,690 C680,700 670,720 690,744 C660,740 640,720 630,700 C610,720 600,710 590,690 C560,650 500,640 440,660 C380,700 340,800 330,920 C320,1050 360,1150 300,1300 C260,1260 220,1150 220,1000 C210,800 280,600 470,560 Z" fill="#0b0b0e" />
          <path d="M470,566 C580,546 664,600 696,686" stroke={RIM} strokeWidth={5} fill="none" opacity={0.85} />
          <path d="M440,600 C330,640 280,760 260,900" stroke={RIM} strokeWidth={3} fill="none" opacity={0.45} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${560 + i * 30},${580 + i * 6} C${600 + i * 20},${620} ${640 + i * 10},${660 + i * 8} ${650 + i * 14},${700 + i * 10}`} stroke="#c9dcf5" strokeWidth={2} fill="none" opacity={0.35} />)}
        </g>
        {puff(b1, 0)}
        {puff(b2, 1)}
        {puff(Math.max(0, b1 - 0.2), 2)}
      </L>
    </AbsoluteFill>
  );
};
