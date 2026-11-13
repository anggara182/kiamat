import React from 'react';
import { loadFont } from '@remotion/google-fonts/Inter';
import { Glow, cl01 } from './home_kit';

const { fontFamily: HOOK_FONT } = loadFont('normal', { weights: ['600', '800'], subsets: ['latin'] });

/**
 * Shot 1 (hook): top-down extreme close-up of a phone lying on the batik blanket beside the pillow, pre-dawn dark.
 * Lock screen floods with stacked news notifications (newest on top). Frame coords.
 */
export const HK = { cx: 584, cy: 790, rot: -4, PW: 544, PH: 1060, BZ: 16 };
const SW = HK.PW - 2 * HK.BZ, SH = HK.PH - 2 * HK.BZ;

export type HookNote = { lines: string[]; tag?: string; arr: number };
/** exact hook headlines (STYLE.md "Headlines"), oldest first; arrival times are filled in by the shot */
export const HOOK_LINES: { lines: string[]; tag?: string }[] = [
  { lines: ['Floods sweep away', 'entire villages'] },
  { lines: ['Rights group warns', 'of genocide'] },
  { lines: ['Airstrikes hit refugee', 'camp overnight'] },
  { lines: ['Death toll passes 12,000'] },
  { tag: 'BREAKING', lines: ['7.4 earthquake strikes', 'coastal region'] },
];

const noteH = (n: { lines: string[]; tag?: string }) => 74 + n.lines.length * 38 + 18;

/** blanket (top-down) + pillow; breath lifts the blanket a hair (twos) */
export const HookBed: React.FC<{ breath: number; glow: number }> = ({ breath, glow }) => {
  const rows: React.ReactNode[] = [];
  for (let r = 0; r < 14; r++) {
    const y = 300 + r * 140;
    rows.push(
      <path key={r} d={Array.from({ length: 12 }, (_, i) => `M${-160 + i * 120 + (r % 2) * 60} ${y} q30 -36 60 0 q30 36 60 0`).join(' ')} stroke="#5a4466" strokeWidth={10} fill="none" opacity={0.55} strokeLinecap="round" />,
    );
    rows.push(<path key={`d${r}`} d={Array.from({ length: 12 }, (_, i) => `M${-130 + i * 120 + (r % 2) * 60} ${y + 70} l14 -14 l14 14 l-14 14 Z`).join(' ')} fill="#4a3858" opacity={0.6} />);
  }
  return (
    <g transform={`translate(0 ${-breath * 3})`}>
      <defs>
        <linearGradient id="hhBl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2e2342" /><stop offset="1" stopColor="#1a1428" />
        </linearGradient>
        <radialGradient id="hhFold" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#0c0914" stopOpacity={0.6} /><stop offset="1" stopColor="#0c0914" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="hhPil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3c3a56" /><stop offset="1" stopColor="#5b5980" />
        </linearGradient>
      </defs>
      <rect x={-200} y={-300} width={1500} height={2600} fill="url(#hhBl)" />
      {rows}
      {/* soft folds */}
      <ellipse cx={980} cy={1250} rx={200} ry={700} fill="url(#hhFold)" transform="rotate(-18 980 1250)" />
      <ellipse cx={120} cy={1500} rx={160} ry={600} fill="url(#hhFold)" transform="rotate(14 120 1500)" />
      {/* pillow, top-left */}
      <path d="M-200 -300 L620 -300 Q660 -60 600 160 Q560 330 380 380 Q120 420 -200 400 Z" fill="url(#hhPil)" />
      <path d="M-200 330 Q120 360 380 330 Q540 290 596 170 Q560 330 380 380 Q120 420 -200 400 Z" fill="#2a283e" opacity={0.8} />
      <path d="M380 380 Q560 330 600 160" stroke="#bfe3ff" strokeWidth={4} fill="none" opacity={0.35 * glow} />
    </g>
  );
};

/** the sleeper's hair at the frame edge (top-left), stirring on twos */
export const HookHair: React.FC<{ t2: number; stir: number }> = ({ t2, stir }) => {
  const sw = (i: number) => Math.sin(t2 * 2.2 + i * 1.3) * 4 + stir * 10;
  // the back of the sleeper's head on the pillow (top-left corner): a lumpy mass of messy hair, sheen, a few clumps lying flat
  return (
    <g transform={`translate(${stir * 8} ${stir * 5}) rotate(${stir * 1.5} -60 -80)`}>
      <path d="M-260 -260 L170 -260 Q240 -200 226 -120 Q262 -60 222 10 Q238 80 170 120 Q150 190 70 196 Q0 236 -80 206 Q-160 228 -260 180 Z" fill="#0b0a10" />
      {/* loose wisps lying along the edge (tangent, not radial) */}
      {[[170, 120, 60, 150], [222, 10, 236, 80], [70, 196, 130, 186], [-80, 206, -10, 226]].map(([x0, y0, x1, y1], i) => (
        <path key={i} d={`M${x0} ${y0} Q${(x0 + x1) / 2 + 30 + sw(i)} ${(y0 + y1) / 2 + 24} ${x1 + sw(i)} ${y1 + 14}`} stroke="#0b0a10" strokeWidth={4} fill="none" strokeLinecap="round" />
      ))}
      <path d="M-140 40 Q-20 -20 120 -40" stroke="#262b40" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.9} />
      <path d="M-100 110 Q20 70 150 40" stroke="#262b40" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d="M-200 186 Q-60 230 70 196 Q150 190 170 120 Q238 80 222 10" stroke="#9fc4e8" strokeWidth={3.5} fill="none" opacity={0.4} />
    </g>
  );
};

/** phone + lock screen with the stacked notifications. notes: arrival times; buzz: {x, r}; t = shot time (ones) */
export const HookPhone: React.FC<{ notes: HookNote[]; t: number; bx: number; br: number; lit: number }> = ({ notes, t, bx, br, lit }) => {
  const r = 56;
  // newest first; slide-in progress per card (UI motion, on ones)
  // older cards make room fast (0.1 s); the new one drops in a touch slower and fades up (no messy overlap)
  const vis = notes.filter((n) => n.arr <= t).map((n) => ({ ...n, s: Math.sin((Math.PI / 2) * cl01((t - n.arr) / 0.1)), a: Math.pow(cl01((t - n.arr) / 0.18), 0.6), h: noteH(n) })).reverse();
  let y = 300;
  const placed = vis.map((n) => {
    const top = y - (1 - n.a) * 46;
    y += (n.h + 14) * n.s;
    return { ...n, top };
  });
  return (
    <g transform={`translate(${HK.cx + bx} ${HK.cy}) rotate(${HK.rot + br})`}>
      <defs>
        <clipPath id="hhScr"><rect x={-SW / 2} y={-SH / 2} width={SW} height={SH} rx={r - 10} /></clipPath>
        <linearGradient id="hhWall" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#25305a" /><stop offset="0.6" stopColor="#151a33" /><stop offset="1" stopColor="#0c0e1c" />
        </linearGradient>
      </defs>
      {/* shadow on the blanket + body */}
      <rect x={-HK.PW / 2 + 10} y={-HK.PH / 2 + 18} width={HK.PW} height={HK.PH} rx={r} fill="#05040a" opacity={0.6} />
      <rect x={-HK.PW / 2} y={-HK.PH / 2} width={HK.PW} height={HK.PH} rx={r} fill="#16181e" />
      <rect x={-HK.PW / 2} y={-HK.PH / 2} width={HK.PW} height={HK.PH} rx={r} fill="none" stroke="#4d525c" strokeWidth={4} />
      <g clipPath="url(#hhScr)">
        <rect x={-SW / 2} y={-SH / 2} width={SW} height={SH} fill="url(#hhWall)" />
        <rect x={-SW / 2} y={-SH / 2} width={SW} height={SH} fill="#ffffff" opacity={0.05 * lit} />
        <g transform={`translate(${-SW / 2} ${-SH / 2})`}>
          {/* clock */}
          <text x={SW / 2} y={70} textAnchor="middle" fontFamily={HOOK_FONT} fontWeight={600} fontSize={22} fill="#c9d3ea" opacity={0.85}>Friday</text>
          <text x={SW / 2} y={196} textAnchor="middle" fontFamily={HOOK_FONT} fontWeight={600} fontSize={126} fill="#eef2fb">4:12</text>
          {placed.map((n, i) => (
            <g key={n.lines[0]} transform={`translate(16 ${n.top})`} opacity={n.a}>
              <rect x={0} y={0} width={SW - 32} height={n.h} rx={28} fill="#2a2f3c" opacity={0.94} />
              <rect x={0} y={0} width={SW - 32} height={n.h} rx={28} fill="none" stroke={i === 0 && t - n.arr < 0.5 ? '#6f7f9f' : '#3a4050'} strokeWidth={2} />
              {/* generic news icon: red tile with a white globe outline (no logo) */}
              <rect x={20} y={18} width={40} height={40} rx={10} fill="#b8352b" />
              <circle cx={40} cy={38} r={12} fill="none" stroke="#fff" strokeWidth={3} />
              <path d="M28 38 L52 38 M40 26 Q32 38 40 50 Q48 38 40 26" stroke="#fff" strokeWidth={2.5} fill="none" />
              <text x={74} y={46} fontFamily={HOOK_FONT} fontWeight={600} fontSize={20} fill="#9aa2b4" letterSpacing={1.5}>NEWS</text>
              <text x={SW - 56} y={46} textAnchor="end" fontFamily={HOOK_FONT} fontWeight={600} fontSize={20} fill="#9aa2b4">now</text>
              {n.tag && (
                <g>
                  <rect x={144} y={24} width={128} height={30} rx={8} fill="#d23a2e" />
                  <text x={208} y={46} textAnchor="middle" fontFamily={HOOK_FONT} fontWeight={800} fontSize={18} fill="#fff" letterSpacing={1.5}>{n.tag}</text>
                </g>
              )}
              {n.lines.map((ln, k) => (
                <text key={k} x={22} y={104 + k * 38} fontFamily={HOOK_FONT} fontWeight={800} fontSize={29} fill="#f4f6fa">{ln}</text>
              ))}
            </g>
          ))}
        </g>
      </g>
      {/* glass glare */}
      <path d={`M${-SW / 2} ${-SH / 2 + 60} L${SW / 2 - 120} ${-SH / 2} L${SW / 2} ${-SH / 2} L${-SW / 2} ${-SH / 2 + 260} Z`} fill="#ffffff" opacity={0.04} />
    </g>
  );
};

/** screen light on the blanket (environment, ones) */
export const HookGlow: React.FC<{ lit: number }> = ({ lit }) => (
  <g>
    <Glow id="hhG1" x={HK.cx} y={HK.cy} rx={700} ry={860} c="#9fc4f0" o={0.32 + 0.18 * lit} mid={0.3} />
    <Glow id="hhG2" x={HK.cx} y={HK.cy} rx={420} ry={640} c="#cfe6ff" o={0.22 + 0.2 * lit} mid={0.4} />
  </g>
);

export { HOOK_FONT, noteH };
