import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, HORIZON, SUN, C, rng } from '../art/world';
import { Sky, MegaMendung } from '../art/Sky';
import { Headland, Sea, Shore, Pandan } from '../art/Land';

/** Set A: the beach at sunset. One world, many crops / tide states. */

export const cliffTop = (x: number) => HORIZON - 120 - (x - 780) * 0.16 - Math.sin(x * 0.02) * 6;
export const HOTEL = { x: 930, y: cliffTop(930) - 118 };
/** Room 308 window centre, world coords. */
export const R308 = { x: HOTEL.x + 30 + 7 * 22 + 6.5, y: HOTEL.y + 21 };

/** Extra hotel detail that only reads at telephoto (drawn over Headland's hotel, same coords). */
const HotelDetail: React.FC = () => {
  const win = (x: number, y: number, key: string, lit: boolean, is308: boolean) => (
    <g key={key}>
      {lit && !is308 && (
        <>
          <rect x={x} y={y} width={13} height={18} fill="url(#winWarm)" />
          <path d={`M ${x} ${y} L ${x + 4} ${y} Q ${x + 3} ${y + 9} ${x + 4.5} ${y + 18} L ${x} ${y + 18} Z`} fill="#b86a3c" opacity={0.75} />
          <path d={`M ${x + 13} ${y} L ${x + 9.5} ${y} Q ${x + 10.5} ${y + 9} ${x + 9} ${y + 18} L ${x + 13} ${y + 18} Z`} fill="#b86a3c" opacity={0.75} />
          <rect x={x + 5} y={y + 11} width={3} height={7} fill="#6b3a2a" opacity={0.5} />
        </>
      )}
      {is308 && (
        <>
          <rect x={x} y={y} width={13} height={18} fill="url(#win308)" />
          <path d={`M ${x} ${y} L ${x + 3.5} ${y} Q ${x + 2.5} ${y + 9} ${x + 4} ${y + 18} L ${x} ${y + 18} Z`} fill="#1f7a4e" opacity={0.85} />
          <path d={`M ${x + 13} ${y} L ${x + 10} ${y} Q ${x + 11} ${y + 9} ${x + 9.5} ${y + 18} L ${x + 13} ${y + 18} Z`} fill="#1f7a4e" opacity={0.85} />
        </>
      )}
      <rect x={x - 0.5} y={y - 0.5} width={14} height={19} fill="none" stroke="#6d5a66" strokeWidth={1} />
      <line x1={x + 6.5} y1={y} x2={x + 6.5} y2={y + 18} stroke="#6d5a66" strokeWidth={0.6} opacity={0.7} />
      {/* balcony railing */}
      <path d={`M ${x - 2} ${y + 14} L ${x + 15} ${y + 14}`} stroke="#efe3da" strokeWidth={0.8} />
      {[0, 3, 6, 9, 12, 15].map((dx) => <line key={dx} x1={x - 2 + dx} y1={y + 14} x2={x - 2 + dx} y2={y + 18} stroke="#efe3da" strokeWidth={0.4} opacity={0.8} />)}
    </g>
  );
  return (
    <g transform={`translate(${HOTEL.x} ${HOTEL.y})`}>
      <defs>
        <linearGradient id="winWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe2a6" />
          <stop offset="1" stopColor="#f2a35e" />
        </linearGradient>
        <radialGradient id="win308" cx="0.5" cy="0.6" r="0.7">
          <stop offset="0" stopColor="#d8ffe8" />
          <stop offset="0.5" stopColor="#7dffb0" />
          <stop offset="1" stopColor="#2fae6e" />
        </radialGradient>
        <linearGradient id="facadeShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#2a1f36" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {/* slab lines and shading */}
      <rect x={-6} y={44} width={262} height={86} fill="url(#facadeShade)" />
      <rect x={18} y={2} width={214} height={44} fill="url(#facadeShade)" />
      {[48, 84, 120].map((y) => <rect key={y} x={-6} y={y} width={262} height={2} fill="#f7ece4" opacity={0.6} />)}
      {/* sun-side warm wash on the left faces */}
      <rect x={-6} y={44} width={40} height={86} fill="#ffb27a" opacity={0.18} />
      {Array.from({ length: 3 }).map((_, row) =>
        Array.from({ length: 9 }).map((__, col) => {
          const lit = (row * 7 + col * 3) % 4 !== 0;
          const is308 = row === 0 && col === 7;
          const x = (row === 0 ? 30 : 6) + col * (row === 0 ? 22 : 27);
          const y = row === 0 ? 12 : 54 + (row - 1) * 36;
          return win(x, y, `${row}-${col}`, lit, is308);
        }),
      )}
      {/* rooftop: water tank, antenna, a little mushola dome */}
      <rect x={40} y={-22} width={22} height={16} fill="#8d7b84" />
      <rect x={38} y={-24} width={26} height={3} fill="#b3a2a6" />
      <path d="M 200 -6 L 200 -46 M 194 -38 L 206 -38 M 196 -30 L 204 -30" stroke="#2a1f30" strokeWidth={1.4} />
      <circle cx={200} cy={-47} r={1.6} fill="#ff6a5a" />
      <path d="M 110 -6 L 110 -16 Q 120 -30 130 -16 L 130 -6 Z" fill="#c9b8b0" />
      <path d="M 120 -30 L 120 -36" stroke="#c9b8b0" strokeWidth={1.2} />
      {/* path lamps down the cliff */}
      {[[-40, 150], [-62, 176], [-88, 200], [-118, 220]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={7} fill="#ffc77a" opacity={0.18} />
          <circle cx={x} cy={y} r={1.6} fill="#ffe0a8" />
        </g>
      ))}
    </g>
  );
};

/** Cliff face detail for telephoto: ledges catching the sun, cracks, scrub on the crest, path lamps. */
const CliffDetail: React.FC = () => {
  const r = rng(61);
  const ledges = Array.from({ length: 22 }, () => {
    const x0 = 790 + r() * 460, y0 = cliffTop(x0) + 30 + r() * 150, len = 30 + r() * 90;
    const k = r();
    return { d: `M ${x0} ${y0} l ${len * 0.3} ${-3 - k * 4} l ${len * 0.4} ${2 + k * 3} l ${len * 0.3} ${-2}`, o: 0.12 + r() * 0.22 };
  });
  const bushes = Array.from({ length: 26 }, (_, i) => { const x = 790 + i * 20 + r() * 10; return { x, y: cliffTop(x) + 4 + r() * 4, s: 8 + r() * 10 }; }).filter((b) => b.x < HOTEL.x - 14 || b.x > HOTEL.x + 266);
  return (
    <g>
      {ledges.map((l, i) => (
        <g key={i}>
          <path d={l.d} stroke="#0e0a16" strokeWidth={3} fill="none" opacity={0.6} transform="translate(0 2)" />
          <path d={l.d} stroke="#c9786a" strokeWidth={1} fill="none" opacity={l.o} strokeLinejoin="round" />
        </g>
      ))}
      {Array.from({ length: 10 }, (_, i) => {
        const x = 800 + r() * 480, y = HORIZON - 40 + r() * 90;
        return <path key={`c${i}`} d={`M ${x} ${y} l ${(r() - 0.5) * 10} ${10 + r() * 14} l ${(r() - 0.5) * 8} ${8 + r() * 10}`} stroke="#0c0812" strokeWidth={1.4} fill="none" opacity={0.7} />;
      })}
      {bushes.map((b, i) => (
        <g key={`b${i}`}>
          <ellipse cx={b.x} cy={b.y} rx={b.s} ry={b.s * 0.6} fill="#120c1c" />
          <path d={`M ${b.x - b.s * 0.8} ${b.y - b.s * 0.3} Q ${b.x} ${b.y - b.s * 0.9} ${b.x + b.s * 0.6} ${b.y - b.s * 0.4}`} stroke="#f2a272" strokeWidth={1} fill="none" opacity={0.5} />
        </g>
      ))}
    </g>
  );
};

/** Low tide: the sea pulled far back. Wet flats mirror the sky. */
export const WL = 1136;
const Flats: React.FC = () => {
  const r = rng(91);
  const ripples = Array.from({ length: 70 }, (_, i) => {
    const y = WL + 6 + (H - WL) * Math.pow((i + 0.5) / 70, 1.7);
    const amp = 2 + (y - WL) * 0.012, freq = 0.012 + r() * 0.01, ph = r() * 6;
    let d = `M -20 ${y.toFixed(1)}`;
    for (let x = 0; x <= W + 40; x += 40) d += ` L ${x} ${(y + Math.sin(x * freq + ph) * amp + Math.sin(x * 0.05 + ph) * amp * 0.4).toFixed(1)}`;
    return { d, w: 0.8 + (y - WL) * 0.004, o: 0.18 + r() * 0.2 };
  });
  const pools = Array.from({ length: 16 }, () => {
    const k = Math.pow(r(), 1.3);
    const y = WL + 30 + k * (H - WL - 120);
    return { x: r() * W, y, rx: 30 + k * 220 * (0.5 + r()), ry: 3 + k * 26 * (0.5 + r() * 0.5) };
  });
  const rocks = Array.from({ length: 22 }, () => {
    const k = Math.pow(r(), 1.6);
    return { x: r() * W, y: WL + 14 + k * 600, s: 6 + k * 46 * (0.5 + r()) };
  });
  return (
    <g>
      <defs>
        <linearGradient id="flatG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffbe82" />
          <stop offset="0.06" stopColor="#e7866a" />
          <stop offset="0.2" stopColor="#a65468" />
          <stop offset="0.45" stopColor="#5a3562" />
          <stop offset="0.75" stopColor="#2d2240" />
          <stop offset="1" stopColor="#150f1f" />
        </linearGradient>
        <linearGradient id="flatSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2c3e" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#3b2c3e" stopOpacity="0.45" />
          <stop offset="1" stopColor="#1b1422" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="flatSun" cx="0.5" cy="0" r="1" gradientTransform="translate(0.5 0) scale(0.09 1) translate(-0.5 0)">
          <stop offset="0" stopColor="#fff2cf" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffbf78" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff9a68" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="poolG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd39a" />
          <stop offset="1" stopColor="#c86d6c" />
        </linearGradient>
      </defs>
      <rect x={0} y={WL} width={W} height={H - WL} fill="url(#flatG)" />
      {/* sky clouds mirrored across the horizon, broken up by the wet sand */}
      <g opacity={0.32} transform={`translate(0 ${2 * HORIZON}) scale(1 -1)`}>
        <MegaMendung cx={1080} cy={780} w={420} h={96} lobes={4} seed={21} band={8} tones={['#8a4566', '#ad5662', '#cc6c5e', '#e5875f', '#f6a56c', '#ffc286']} />
        <MegaMendung cx={850} cy={900} w={300} h={64} lobes={4} seed={30} band={6} tones={['#b7605f', '#d4775e', '#ec9364', '#fcb176', '#ffd29a']} />
        <MegaMendung cx={200} cy={660} w={500} h={120} lobes={5} seed={12} band={9} tones={['#5c3364', '#7d4066', '#a14f64', '#c46560', '#e07f62', '#f59d6c']} />
      </g>
      <rect x={0} y={WL} width={W} height={H - WL} fill="url(#flatSand)" />
      <rect x={0} y={WL} width={W} height={H - WL} fill="url(#flatSun)" transform={`translate(${SUN.x - W / 2} 0)`} />
      {/* sand ripple marks: dark trough + warm crest */}
      {ripples.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="none" stroke="#1a1222" strokeWidth={p.w * 1.4} opacity={p.o} />
          <path d={p.d} fill="none" stroke="#ffcf9c" strokeWidth={p.w * 0.6} opacity={p.o * 0.45} transform="translate(0 -2)" />
        </g>
      ))}
      {/* tide pools hold the brightest sky */}
      {pools.map((p, i) => (
        <g key={i}>
          <ellipse cx={p.x} cy={p.y + 1.5} rx={p.rx + 3} ry={p.ry + 1.5} fill="#160f1e" opacity={0.6} />
          <ellipse cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill="url(#poolG)" opacity={0.55} />
          <ellipse cx={p.x - p.rx * 0.2} cy={p.y - p.ry * 0.2} rx={p.rx * 0.5} ry={Math.max(1, p.ry * 0.25)} fill="#fff0d0" opacity={0.25} />
        </g>
      ))}
      {/* exposed rocks with wet tops and reflections */}
      {rocks.map((k, i) => (
        <g key={i} transform={`translate(${k.x} ${k.y})`}>
          <path d={`M ${-k.s} 0 Q ${-k.s * 0.8} ${-k.s * 0.7} ${-k.s * 0.1} ${-k.s * 0.75} Q ${k.s * 0.7} ${-k.s * 0.6} ${k.s} 0 Z`} fill="#120c1a" />
          <path d={`M ${-k.s * 0.75} ${-k.s * 0.42} Q ${-k.s * 0.4} ${-k.s * 0.74} ${k.s * 0.1} ${-k.s * 0.72}`} stroke="#ffb98a" strokeWidth={1 + k.s * 0.04} fill="none" opacity={0.55} />
          <path d={`M ${-k.s} 1 Q ${-k.s * 0.6} ${k.s * 0.35} 0 ${k.s * 0.38} Q ${k.s * 0.6} ${k.s * 0.3} ${k.s} 1 Z`} fill="#120c1a" opacity={0.35} />
        </g>
      ))}
      {/* stranded jukung (outrigger canoe) on the left */}
      <g transform="translate(270 1330)">
        <ellipse cx={0} cy={10} rx={170} ry={10} fill="#0e0a14" opacity={0.45} />
        <path d="M -150 0 Q -60 16 150 -2 L 160 -16 Q 40 -4 -150 -14 Q -168 -10 -150 0 Z" fill="#2a1a2a" />
        <path d="M -150 -14 Q 40 -4 160 -16" stroke="#ffb486" strokeWidth={2} fill="none" opacity={0.75} />
        <path d="M -120 -6 Q 0 4 130 -6" stroke="#b44a48" strokeWidth={3} fill="none" opacity={0.8} />
        <path d="M -100 -2 Q 0 7 110 -2" stroke="#e9dccf" strokeWidth={1.5} fill="none" opacity={0.6} />
        {/* outrigger arms + float */}
        <path d="M -60 -12 Q -40 -40 -30 -46 M 60 -12 Q 70 -40 76 -46" stroke="#1a1018" strokeWidth={3} fill="none" />
        <path d="M -110 -44 Q 20 -52 140 -46" stroke="#1a1018" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M -110 -46 Q 20 -54 140 -48" stroke="#ffb486" strokeWidth={1.2} fill="none" opacity={0.6} />
        {/* mast lying across */}
        <path d="M -40 -12 L 120 -30" stroke="#1a1018" strokeWidth={2.5} />
        <g transform="scale(1 -0.5) translate(0 -24)" opacity={0.18}>
          <path d="M -150 0 Q -60 16 150 -2 L 160 -16 Q 40 -4 -150 -14 Z" fill="#2a1a2a" />
        </g>
      </g>
      {/* the far waterline: thin bright foam and the sea's dark lip */}
      <rect x={0} y={WL - 3} width={W} height={4} fill="#ffe3bd" opacity={0.6} />
      <path d={`M 0 ${WL + 3} Q 300 ${WL + 9} 640 ${WL + 4} T ${W} ${WL + 6}`} stroke="#f6efe6" strokeWidth={1.4} fill="none" opacity={0.5} />
    </g>
  );
};

/** Big foreground objects for the flats (no ground: the ground lives in the mid band, so bands never seam). */
const FlatsNear: React.FC = () => {
  const weed = (x: number, y: number, s: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round">
      {[-30, -12, 6, 22, 40].map((a, i) => (
        <path key={i} d={`M 0 0 q ${a} -20 ${a * 1.8} ${-6 - i * 3}`} stroke={i % 2 ? '#3a2a30' : '#4d3a2c'} strokeWidth={5} />
      ))}
      <path d="M -40 2 Q 0 -6 60 2" stroke="#ffc596" strokeWidth={1.5} opacity={0.4} />
    </g>
  );
  const rock = (x: number, y: number, s: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      <path d={`M ${-s} 0 C ${-s} ${-s * 0.6}, ${-s * 0.4} ${-s * 0.9}, 0 ${-s * 0.85} C ${s * 0.5} ${-s * 0.8}, ${s} ${-s * 0.5}, ${s} 0 Z`} fill="#0f0a16" />
      <path d={`M ${-s * 0.85} ${-s * 0.4} C ${-s * 0.6} ${-s * 0.8}, ${-s * 0.2} ${-s * 0.88}, ${s * 0.2} ${-s * 0.84}`} stroke="#ffb486" strokeWidth={2.5} fill="none" opacity={0.6} />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-s * 0.6 + i * s * 0.2} cy={-s * 0.25 - (i % 3) * 6} r={2 + (i % 2)} fill="#d9c7b6" opacity={0.5} />)}
      <path d={`M ${-s} 2 C ${-s * 0.5} ${s * 0.3}, ${s * 0.5} ${s * 0.3}, ${s} 2 Z`} fill="#0f0a16" opacity={0.3} />
    </g>
  );
  return (
    <g>
      {rock(80, 2020, 120, 'r1')}
      {rock(1230, 2110, 160, 'r2')}
      {rock(1010, 1760, 46, 'r3')}
      {weed(320, 1900, 1.4, 'w1')}
      {weed(860, 2180, 2, 'w2')}
      {weed(560, 1640, 0.8, 'w3')}
      {/* starfish */}
      <g transform="translate(700 1980) rotate(20)">
        <path d="M 0 -26 L 7 -8 L 26 -8 L 11 4 L 17 23 L 0 12 L -17 23 L -11 4 L -26 -8 L -7 -8 Z" fill="#c4683e" />
        <path d="M 0 -26 L 7 -8 L 26 -8" stroke="#ffcf9c" strokeWidth={1.5} fill="none" opacity={0.6} />
      </g>
    </g>
  );
};

/** Crowd silhouettes seen from behind, facing the sunset; phones are live (see crowdPeople). */
export type Person = { x: number; y: number; h: number; kind: number; phone: number; px: number; flip: number };
export const CROWD_W = 2000;
export const crowdPeople = (layer: 'near' | 'far'): Person[] => {
  const r = rng(layer === 'near' ? 55 : 77);
  if (layer === 'near') {
    return [170, 520, 860, 1190, 1520, 1850].map((x, i) => ({ x: x + r() * 50, y: 2200 + r() * 70, h: 860 + r() * 140, kind: [0, 1, 2, 3, 4, 1][i], phone: i === 3 ? 0 : 1, px: (r() - 0.5) * 0.12, flip: r() < 0.5 ? -1 : 1 }));
  }
  return Array.from({ length: 16 }, (_, i) => {
    const d = r();
    return { x: 60 + i * 120 + r() * 60, y: 1330 + d * 120, h: 190 + d * 150, kind: Math.floor(r() * 5), phone: r() < 0.75 ? 1 : 0, px: (r() - 0.5) * 0.12, flip: r() < 0.5 ? -1 : 1 };
  });
};
/** Phone position (screen centre) in band coords for a person. */
export const phonePos = (p: Person) => ({ x: p.x + (p.kind % 2 === 1 ? p.px : 0.1 * p.flip) * p.h, y: p.y - p.h * 1.08, w: p.h * 0.07, h: p.h * 0.125 });

const PersonShape: React.FC<{ p: Person; fill: string }> = ({ p, fill }) => {
  const h = p.h;
  const s = h / 1000; // design in a 1000-tall unit, feet at 0
  const k = p.kind;
  const ph = phonePos(p);
  const hx = ((ph.x - p.x) / s) * p.flip, hy = (ph.y - p.y) / s;
  const torso = `M -122 -790 C -140 -780, -146 -750, -138 -700 C -128 -640, -112 -580, -98 -520 C -104 -490, -110 -470, -108 -450 L 108 -450 C 110 -470, 104 -490, 98 -520 C 112 -580, 128 -640, 138 -700 C 146 -750, 140 -780, 122 -790 C 70 -812, -70 -812, -122 -790 Z`;
  const legs = `M -104 -460 C -100 -320, -92 -170, -86 -20 L -88 0 L -34 0 L -30 -20 C -22 -170, -12 -320, -4 -420 L 4 -420 C 12 -320, 22 -170, 30 -20 L 34 0 L 88 0 L 86 -20 C 92 -170, 100 -320, 104 -460 Z`;
  const skirt = `M -104 -500 C -130 -330, -150 -160, -158 -10 L 158 -10 C 150 -160, 130 -330, 104 -500 Z`;
  const arm = (sd: number) => p.phone && (sd === 1 || k % 2 === 1)
    ? `M ${sd * 118} -770 Q ${sd * 190} -880 ${sd * 150} -960 T ${hx + sd * 26} ${hy + 80}`
    : `M ${sd * 124} -770 Q ${sd * 160} -640 ${sd * 150} -470`;
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${s * p.flip} ${s})`} fill={fill} stroke={fill}>
      <path d={legs} strokeWidth={0} />
      {(k === 1 || k === 4) && <path d={skirt} strokeWidth={0} />}
      <path d={torso} strokeWidth={0} />
      {k === 0 && <rect x={-96} y={-770} width={192} height={250} rx={46} strokeWidth={0} />}
      <path d={arm(-1)} fill="none" strokeWidth={52} strokeLinecap="round" strokeLinejoin="round" />
      <path d={arm(1)} fill="none" strokeWidth={52} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={-26} y={-860} width={52} height={70} strokeWidth={0} />
      {k === 1 ? (
        // hijab: rounded head drape falling over the shoulders
        <path d="M -70 -900 C -76 -1000, 76 -1000, 70 -900 C 74 -850, 110 -820, 140 -780 C 60 -760, -60 -760, -140 -780 C -110 -820, -74 -850, -70 -900 Z" strokeWidth={0} />
      ) : (
        <ellipse cx={0} cy={-915} rx={58} ry={70} strokeWidth={0} />
      )}
      {k === 2 && <path d="M -118 -952 C -100 -968, 100 -968, 118 -952 L 118 -944 L -118 -944 Z M -64 -950 C -64 -1016, 64 -1016, 64 -950 Z" strokeWidth={0} />}
      {k === 3 && <ellipse cx={4} cy={-990} rx={30} ry={26} strokeWidth={0} />}
      {k === 4 && <path d="M -56 -900 C -74 -820, -66 -720, -40 -650 L 40 -650 C 66 -720, 74 -820, 56 -900 Z" strokeWidth={0} />}
    </g>
  );
};

const Crowd: React.FC<{ layer: 'near' | 'far' }> = ({ layer }) => {
  const people = crowdPeople(layer);
  return (
    <g>
      {people.map((p, i) => (
        <g key={i}>
          {/* warm rim: the same silhouette offset toward the sun, under the dark fill */}
          <g transform="translate(0 -3)"><PersonShape p={p} fill={layer === 'near' ? '#ff9f6a' : '#ffb07a'} /></g>
          <g transform="translate(2 -1)" opacity={0.6}><PersonShape p={p} fill="#ffd2a0" /></g>
          <PersonShape p={p} fill={layer === 'near' ? '#0c0812' : '#1a1222'} />
          {/* feet reflection on the wet flats (far layer only) */}
          {layer === 'far' && <ellipse cx={p.x} cy={p.y + 4} rx={p.h * 0.14} ry={p.h * 0.025} fill="#0c0812" opacity={0.4} />}
        </g>
      ))}
    </g>
  );
};

/** Defocused beach (medium shots, graphic backgrounds). */
const Soft: React.FC = () => (<><Sky /><Sea /><Headland /><Shore /></>);

export const TELE_VB = { x: 736, y: 428, w: 560, h: 996 };

export const BEACH: Record<string, BandSpec> = {
  'beach/far': { blur: 1.2, node: () => <Sky /> },
  'beach/mid': { blur: 0.6, node: () => (<><Sea /><Headland /></>) },
  'beach/near': { blur: 0, node: () => <Shore /> },
  'beach/fg': { blur: 14, node: () => <Pandan /> },
  'beach/soft': { blur: 9, node: () => <Soft /> },
  // telephoto crop of the same art, baked at full resolution (compressed perspective, sky softer)
  'beach/tele-far': { blur: 3, viewBox: `${TELE_VB.x} ${TELE_VB.y} ${TELE_VB.w} ${TELE_VB.h}`, node: () => <Sky /> },
  'beach/tele-mid': { blur: 0.4, viewBox: `${TELE_VB.x} ${TELE_VB.y} ${TELE_VB.w} ${TELE_VB.h}`, node: () => (<><Sea /><Headland /><CliffDetail /><HotelDetail /></>) },
  // low tide
  'beach/flats-mid': { blur: 0.5, node: () => (<><Sea /><Headland /><Flats /></>) },
  'beach/flats-near': { blur: 1.5, node: () => <FlatsNear /> },
  'beach/crowd-far': { blur: 0.4, w: CROWD_W, node: () => <Crowd layer="far" /> },
  'beach/crowd-near': { blur: 3, w: CROWD_W, node: () => <Crowd layer="near" /> },
};
