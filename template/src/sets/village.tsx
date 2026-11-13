import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** shared geometry (world px). Ground line at GY; frame y = world y - 192. */
export const VG = { GY: 1500, DOOR: { x: 610, y: 1250, w: 90, h: 230 }, GATE: 300, MAN: { x: 300, y: 1560 } };

const banana = (x: number, y: number, s: number, fill: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <rect x={-10} y={-420} width={20} height={420} />
    <path d="M 0 -420 Q -160 -470 -260 -360 Q -150 -400 0 -400 Z" />
    <path d="M 0 -420 Q 150 -500 270 -400 Q 140 -420 0 -400 Z" />
    <path d="M 0 -415 Q -60 -600 -10 -680 Q -20 -560 6 -420 Z" />
    <path d="M 0 -415 Q 110 -580 220 -600 Q 100 -540 6 -410 Z" />
    <path d="M 0 -410 Q -140 -560 -230 -560 Q -110 -520 -4 -404 Z" />
  </g>
);

const scene = (dawn: boolean) => {
  const sky = dawn ? ['#3a4152', '#6d7180', '#a59a94'] : ['#06070c', '#0c1018', '#141a24'];
  const sil = dawn ? '#262a33' : '#07080c';
  const wall = dawn ? '#5b5650' : '#1a1b1f';
  const wallD = dawn ? '#45423e' : '#121317';
  const roof = dawn ? '#2e2c2c' : '#0b0b0e';
  const ground = dawn ? ['#5a5956', '#3a3b40'] : ['#101216', '#07080b'];
  const D = VG.DOOR;
  return (
    <g>
      <defs>
        <linearGradient id={`vSky${dawn}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="0.5" stopColor={sky[1]} /><stop offset="1" stopColor={sky[2]} /></linearGradient>
        <linearGradient id={`vGr${dawn}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={ground[0]} /><stop offset="1" stopColor={ground[1]} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#vSky${dawn})`} />
      {/* far tree line */}
      <path d={`M 0 1380 Q 120 1250 240 1320 Q 360 1220 470 1300 L 470 1500 L 0 1500 Z`} fill={sil} opacity={0.8} />
      <path d={`M 860 1500 L 860 1290 Q 990 1200 1110 1300 Q 1210 1240 ${W} 1330 L ${W} 1500 Z`} fill={sil} opacity={0.8} />
      {banana(150, 1500, 1.25, sil, 'b1')}
      {banana(1150, 1510, 1.4, sil, 'b2')}
      {banana(1010, 1500, 0.9, sil, 'b3')}
      {/* ground */}
      <rect x={0} y={1480} width={W} height={H - 1480} fill={`url(#vGr${dawn})`} />
      {/* house: joglo roof */}
      <rect x={400} y={1150} width={520} height={350} fill={wall} />
      <rect x={400} y={1150} width={520} height={40} fill={wallD} />
      <polygon points="330,1160 990,1160 860,1010 460,1010" fill={roof} />
      <polygon points="460,1012 860,1012 740,830 580,830" fill={roof} />
      <rect x={570} y={822} width={180} height={12} fill={roof} />
      {/* porch posts + step */}
      {[420, 530, 790, 900].map((x) => <rect key={x} x={x - 7} y={1160} width={14} height={340} fill={wallD} />)}
      <rect x={390} y={1488} width={540} height={18} fill={wallD} />
      {/* windows (shutters) */}
      <rect x={455} y={1260} width={95} height={120} fill={dawn ? '#3a3835' : '#0b0c0f'} />
      <rect x={770} y={1260} width={95} height={120} fill={dawn ? '#3a3835' : '#0b0c0f'} />
      {/* door frame */}
      <rect x={D.x - 8} y={D.y - 8} width={D.w + 16} height={D.h + 8} fill={wallD} />
      {/* path from gate to porch */}
      <polygon points={`${D.x},1505 ${D.x + D.w},1505 ${D.x + 300},2304 ${D.x - 260},2304`} fill={dawn ? '#4a4844' : '#15171b'} opacity={0.8} />
      {/* bamboo fence + gate posts */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = i * 34 - 10; if (x > 250 && x < 360) return null;
        return <rect key={i} x={x} y={1450 + (i % 3) * 6} width={20} height={150} fill={sil} />;
      })}
      <rect x={0} y={1480} width={W} height={10} fill={sil} />
      <rect x={0} y={1540} width={W} height={10} fill={sil} />
      <rect x={240} y={1400} width={18} height={210} fill={sil} />
      <rect x={364} y={1400} width={18} height={210} fill={sil} />
      {/* puddles */}
      <ellipse cx={850} cy={1820} rx={180} ry={22} fill={dawn ? '#7a7c84' : '#1d2230'} opacity={0.6} />
      <ellipse cx={330} cy={1950} rx={220} ry={26} fill={dawn ? '#7a7c84' : '#1d2230'} opacity={0.5} />
    </g>
  );
};

/** Set "village" (village house exterior at night in rain, porch, road). Static bands baked ONCE to public/baked/village/<band>.png. Ids "village/<band>". */
export const VILLAGE: Record<string, BandSpec> = {
  'village/bg': { node: () => scene(false) },
  'village/dawn': { node: () => scene(true) },
};

/** pre-computed rain streaks (live layer moves them) */
const r = rng(15);
export const RAIN = Array.from({ length: 140 }).map(() => ({ x: r() * W, y: r() * H, l: 40 + r() * 70, v: 0.7 + r() * 0.6, o: 0.15 + r() * 0.3 }));
