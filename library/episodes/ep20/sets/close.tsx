import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

export const K = {
  sky: '#26333c', mist: '#9aa7ad', water: '#0f1d22', sheen: '#b9c9cf', heather: '#3a2f3d',
  hide: '#0a0b0c', hideSheen: '#6f8a90', weed: '#3f6b4a', window: '#ffcc80', accent: '#4fd1c5',
};

/** misty loch backdrop (light area behind heroes) */
const Bg = () => (
  <g>
    <defs>
      <linearGradient id="cbSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141c22" /><stop offset="0.35" stopColor={K.sky} /><stop offset="0.55" stopColor="#6f7f87" /><stop offset="0.62" stopColor={K.mist} />
        <stop offset="0.66" stopColor="#4c5c63" /><stop offset="1" stopColor={K.water} />
      </linearGradient>
      <radialGradient id="cbGlow" cx="0.38" cy="0.6" r="0.45"><stop offset="0" stopColor="#cfd9dc" stopOpacity="0.55" /><stop offset="1" stopColor="#cfd9dc" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#cbSky)" />
    <path d={`M0 1330 Q220 1180 420 1270 Q640 1150 900 1250 Q1100 1190 ${W} 1290 L${W} 1420 L0 1420Z`} fill={K.heather} opacity="0.85" />
    <rect y="1400" width={W} height="40" fill={K.sheen} opacity="0.35" />
    <rect width={W} height={H} fill="url(#cbGlow)" />
  </g>
);

/** horse neck + head-side silhouette entering from the right */
const Neck = () => (
  <g transform="translate(-170 0)">
    <defs>
      <linearGradient id="cnHide" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0" stopColor="#2c3a3e" /><stop offset="0.25" stopColor={K.hide} /><stop offset="1" stopColor="#050606" />
      </linearGradient>
    </defs>
    <path d={`M${W + 300} 300 C1080 380 900 620 840 900 C790 1150 820 1450 900 1700 C960 1900 1080 2100 ${W + 300} 2200Z`} fill="url(#cnHide)" />
    <path d="M1110 370 C960 520 880 700 852 900 C830 1060 836 1200 856 1330" stroke={K.hideSheen} strokeWidth="7" fill="none" opacity="0.8" strokeLinecap="round" />
    <path d="M1180 760 C1080 900 1060 1100 1090 1300" stroke={K.hideSheen} strokeWidth="60" fill="none" opacity="0.07" strokeLinecap="round" />
  </g>
);

/** full-frame wet black hide (for hand/key inserts) */
const Hide = () => {
  const r = rng(7);
  const beads = Array.from({ length: 12 }, () => ({ x: 150 + r() * 1000, y: 260 + r() * 1700, s: 4 + r() * 6 }));
  return (
    <g>
      <defs>
        <linearGradient id="chBase" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1a2326" /><stop offset="0.5" stopColor={K.hide} /><stop offset="1" stopColor="#040505" /></linearGradient>
        <radialGradient id="chSheen" cx="0.45" cy="0.45" r="0.5"><stop offset="0" stopColor={K.hideSheen} stopOpacity="0.55" /><stop offset="0.6" stopColor={K.hideSheen} stopOpacity="0.12" /><stop offset="1" stopColor={K.hideSheen} stopOpacity="0" /></radialGradient>
        <linearGradient id="chBand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={K.sheen} stopOpacity="0" /><stop offset="0.5" stopColor={K.sheen} stopOpacity="0.32" /><stop offset="1" stopColor={K.sheen} stopOpacity="0" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#chBase)" />
      <ellipse cx="620" cy="1050" rx="760" ry="900" fill="url(#chSheen)" />
      <path d="M-50 700 C300 560 800 640 1350 420 L1350 520 C800 760 300 680 -50 830Z" fill="url(#chBand)" />
      <path d="M-50 1500 C400 1380 900 1460 1350 1300 L1350 1350 C900 1520 400 1440 -50 1560Z" fill="url(#chBand)" opacity="0.6" />
      <path d="M-50 1180 C300 1000 700 1120 1350 900" stroke="#000" strokeWidth="60" fill="none" opacity="0.25" />
      <path d="M200 1900 C500 1700 900 1760 1350 1600" stroke="#000" strokeWidth="90" fill="none" opacity="0.3" />
      {beads.map((b, i) => <g key={i}><circle cx={b.x} cy={b.y} r={b.s} fill="#0c1416" /><circle cx={b.x - b.s * 0.3} cy={b.y - b.s * 0.35} r={b.s * 0.35} fill={K.sheen} opacity="0.8" /></g>)}
    </g>
  );
};

/** wool coat front with a pocket */
const Coat = () => (
  <g>
    <defs>
      <linearGradient id="ccCoat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4a3d4d" /><stop offset="0.6" stopColor={K.heather} /><stop offset="1" stopColor="#1a141c" /></linearGradient>
      <radialGradient id="ccLight" cx="0.4" cy="0.35" r="0.6"><stop offset="0" stopColor={K.mist} stopOpacity="0.28" /><stop offset="1" stopColor={K.mist} stopOpacity="0" /></radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#ccCoat)" />
    <rect width={W} height={H} fill="url(#ccLight)" />
    <path d="M980 0 C940 700 960 1500 1010 2304" stroke="#1a141c" strokeWidth="10" fill="none" />
    {[300, 820, 1340].map((y) => <g key={y}><circle cx="1060" cy={y} r="34" fill="#2a2024" /><circle cx="1052" cy={y - 8} r="10" fill="#6b5b5f" /></g>)}
    {/* pocket */}
    <path d="M260 1180 L860 1140 L880 1700 L280 1740Z" fill="#2b222d" />
    <path d="M250 1170 L870 1128 L874 1200 L254 1244Z" fill="#4e4152" />
    <path d="M262 1240 Q560 1290 868 1196" stroke="#0d0a0f" strokeWidth="26" fill="none" />
    <path d="M254 1168 L870 1128" stroke="#8a7d8c" strokeWidth="4" opacity="0.6" />
  </g>
);

export const CLOSE: Record<string, BandSpec> = {
  'close/bg': { blur: 6, node: () => <Bg /> },
  'close/neck': { node: () => <Neck /> },
  'close/hide': { node: () => <Hide /> },
  'close/coat': { node: () => <Coat /> },
};
