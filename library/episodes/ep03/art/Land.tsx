import React from 'react';
import { W, H, HORIZON, SHORE, SUN, C, rng } from './world';

/** Headland on the right: cliff with strata, rocks and surf at its foot, palms, and the hotel (room 308 glows green). */
export const Headland: React.FC = () => {
  const r = rng(4);
  const baseY = HORIZON + 70;
  const top = (x: number) => HORIZON - 120 - (x - 780) * 0.16 - Math.sin(x * 0.02) * 6;
  const palms = Array.from({ length: 16 }, (_, i) => {
    const x = 800 + i * 30 + r() * 12;
    return { x, y: top(x) + 4, h: 40 + r() * 34, lean: (r() - 0.5) * 16 };
  });
  return (
    <g>
      <defs>
        <linearGradient id="cliffG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c203a" />
          <stop offset="1" stopColor="#140f20" />
        </linearGradient>
        <linearGradient id="hotelG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e2cfc4" />
          <stop offset="0.6" stopColor={C.hotel} />
          <stop offset="1" stopColor={C.hotelShade} />
        </linearGradient>
      </defs>
      {/* distant ridge on the left, atmospheric */}
      <path d={`M 0 ${HORIZON + 1} L 0 ${HORIZON - 34} Q 120 ${HORIZON - 52} 250 ${HORIZON - 36} Q 360 ${HORIZON - 22} 470 ${HORIZON - 6} L 480 ${HORIZON + 1} Z`} fill="#8a4f6a" opacity={0.6} />
      {/* cliff mass with an irregular foot in the water */}
      <path d={`M 700 ${baseY} C 735 ${HORIZON + 10}, 760 ${HORIZON - 60}, 790 ${top(790)} C 860 ${top(860) - 8}, 1000 ${top(1000)}, ${W} ${top(W)} L ${W} ${baseY + 14}
        C 1200 ${baseY + 4}, 1120 ${baseY + 18}, 1040 ${baseY + 8} C 960 ${baseY}, 880 ${baseY + 16}, 800 ${baseY + 6} C 760 ${baseY + 2}, 730 ${baseY + 8}, 700 ${baseY} Z`} fill="url(#cliffG)" />
      {/* rim light on the cliff edge facing the sun */}
      <path d={`M 702 ${baseY - 4} C 735 ${HORIZON + 10}, 760 ${HORIZON - 60}, 790 ${top(790)} C 860 ${top(860) - 8}, 940 ${top(940)}, 990 ${top(990)}`} stroke={C.landRim} strokeWidth={3} fill="none" opacity={0.75} />
      {/* strata */}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M ${745 + i * 18} ${HORIZON - 30 + i * 13} Q ${950} ${HORIZON - 70 + i * 16} ${W} ${HORIZON - 90 + i * 20}`} stroke="#3a2a4a" strokeWidth={1.6} opacity={0.55} fill="none" />
      ))}
      {/* surf foaming at the foot */}
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d={`M ${700 + i * 8} ${baseY + 2 + i * 3} C 800 ${baseY - 6 + i * 4}, 950 ${baseY + 14 + i * 3}, ${W} ${baseY + 10 + i * 4}`} stroke={C.foam} strokeWidth={3 - i * 0.4} opacity={0.5 - i * 0.08} fill="none" strokeDasharray={`${40 + i * 10} ${18 + i * 6}`} />
      ))}
      {/* rocks */}
      {[[690, 8, 22], [664, 14, 12], [722, 18, 14], [640, 20, 8]].map(([x, dy, s], i) => (
        <path key={i} d={`M ${x - s} ${baseY + dy} Q ${x - s * 0.6} ${baseY + dy - s * 0.9} ${x} ${baseY + dy - s} Q ${x + s * 0.7} ${baseY + dy - s * 0.8} ${x + s} ${baseY + dy} Z`} fill="#120c1c" />
      ))}
      {/* palms on the ridge */}
      {palms.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`} fill="none" stroke="#120c1c" strokeLinecap="round">
          <path d={`M 0 0 Q ${p.lean * 0.3} ${-p.h * 0.5} ${p.lean} ${-p.h}`} strokeWidth={3} />
          {[-150, -115, -70, -30, 10].map((a, k) => {
            const ar = (a * Math.PI) / 180, L = 26 + (k % 2) * 6;
            return <path key={k} d={`M ${p.lean} ${-p.h} q ${Math.cos(ar) * L * 0.6} ${Math.sin(ar) * L * 0.6 - 6} ${Math.cos(ar) * L} ${Math.sin(ar) * L + 8}`} strokeWidth={3} />;
          })}
        </g>
      ))}
      {/* hotel: two stepped blocks, balconies, roof line, warm windows; room 308 glows green */}
      <g transform={`translate(930 ${top(930) - 118})`}>
        <rect x={-6} y={44} width={262} height={86} fill="url(#hotelG)" />
        <rect x={18} y={2} width={214} height={44} fill="url(#hotelG)" />
        <path d="M -16 44 L 266 44 L 256 36 L -6 36 Z M 8 2 L 242 2 L 232 -6 L 18 -6 Z" fill="#efe1d8" />
        <path d="M 256 36 L 266 44 L 256 130" stroke="#3e3248" strokeWidth={2} fill="none" />
        {Array.from({ length: 3 }).map((_, row) =>
          Array.from({ length: 9 }).map((__, col) => {
            const lit = (row * 7 + col * 3) % 4 !== 0;
            const is308 = row === 0 && col === 7;
            const x = (row === 0 ? 30 : 6) + col * (row === 0 ? 22 : 27);
            const y = row === 0 ? 12 : 54 + (row - 1) * 36;
            return (
              <g key={`${row}-${col}`}>
                <rect x={x} y={y} width={13} height={18} rx={1} fill={is308 ? '#8dffbc' : lit ? C.window : '#3a2e44'} />
                <rect x={x - 2} y={y + 18} width={17} height={3} fill="#8b7a86" />
              </g>
            );
          }),
        )}
        <circle cx={30 + 7 * 22 + 6} cy={21} r={34} fill="#5dffa0" opacity={0.2} />
      </g>
    </g>
  );
};

/** Sea from horizon to shore: warm horizon band, soft (masked) sun glitter, broken swell strokes. */
export const Sea: React.FC = () => {
  const r = rng(11);
  const depth = SHORE - HORIZON;
  const glints = Array.from({ length: 340 }, () => {
    const t = Math.pow(r(), 1.5);
    const y = HORIZON + 4 + t * (depth - 30);
    const spread = 30 + t * 380;
    const dx = (r() - 0.5) * 2;
    return { x: SUN.x + dx * spread * Math.abs(dx) ** 0.3, y, w: 3 + r() * (6 + t * 26), h: 1.2 + t * 3, o: (0.3 + r() * 0.7) * (1 - Math.abs(dx) * 0.6) };
  });
  const strokes = Array.from({ length: 520 }, () => {
    const t = Math.pow(r(), 1.3);
    return { x: r() * W, y: HORIZON + 6 + t * (depth - 10), w: 10 + t * 90 * r(), h: 1 + t * 3, c: r() < 0.5 ? '#4a3d6a' : r() < 0.6 ? '#1c2040' : '#7a5272', o: 0.25 + r() * 0.4 };
  });
  return (
    <g>
      <defs>
        <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e19069" />
          <stop offset="0.05" stopColor={C.seaFar} />
          <stop offset="0.45" stopColor={C.seaMid} />
          <stop offset="1" stopColor={C.seaNear} />
        </linearGradient>
        <radialGradient id="glowPath" cx="0.5" cy="0" r="1" gradientTransform="translate(0.5 0) scale(0.32 1) translate(-0.5 0)">
          <stop offset="0" stopColor={C.glitter} stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#f08a68" stopOpacity="0.12" />
          <stop offset="1" stopColor="#f08a68" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={0} y={HORIZON} width={W} height={depth + 40} fill="url(#seaG)" />
      <rect x={0} y={HORIZON} width={W} height={depth} fill="url(#glowPath)" />
      {strokes.map((s, i) => <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.h / 2} fill={s.c} opacity={s.o} />)}
      {glints.map((g, i) => <rect key={`g${i}`} x={g.x - g.w / 2} y={g.y} width={g.w} height={g.h} rx={g.h / 2} fill={C.glitter} opacity={Math.max(0, g.o)} />)}
    </g>
  );
};

/** Wet sand: mirror-like near the waterline, soft sun reflection, ripples, shells. */
export const Shore: React.FC = () => {
  const r = rng(19);
  const ripples = Array.from({ length: 60 }, () => {
    const t = r();
    return { y: SHORE + 30 + t * t * (H - SHORE - 30), x: r() * W, w: 60 + r() * (200 + t * 300), o: 0.06 + r() * 0.12 };
  });
  return (
    <g>
      <defs>
        <linearGradient id="sandG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a4a5c" />
          <stop offset="0.12" stopColor="#3e3047" />
          <stop offset="0.5" stopColor={C.sandWet} />
          <stop offset="1" stopColor="#15111d" />
        </linearGradient>
        <radialGradient id="sandRefl" cx="0.5" cy="0" r="1" gradientTransform="translate(0.5 0) scale(0.28 1) translate(-0.5 0)">
          <stop offset="0" stopColor={C.skyHorizon} stopOpacity="0.5" />
          <stop offset="0.5" stopColor={C.skyLow} stopOpacity="0.15" />
          <stop offset="1" stopColor={C.skyLow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={0} y={SHORE} width={W} height={H - SHORE} fill="url(#sandG)" />
      <rect x={0} y={SHORE} width={W} height={H - SHORE} fill="url(#sandRefl)" transform={`translate(${SUN.x - W / 2} 0)`} />
      {ripples.map((p, i) => <ellipse key={i} cx={p.x} cy={p.y} rx={p.w / 2} ry={2 + (p.y - SHORE) * 0.004} fill="#ffd0a8" opacity={p.o} />)}
      {[[230, 1960], [1010, 1880], [1130, 2120], [420, 2180], [820, 2240]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M -10 0 Q 0 -14 10 0 Q 0 6 -10 0" fill="#e9d6c4" opacity={0.75} />
          <path d="M -6 -2 L 0 -9 M 0 -2 L 0 -10 M 6 -2 L 0 -9" stroke="#b49a8a" strokeWidth={1} />
        </g>
      ))}
    </g>
  );
};

/** Foreground pandan leaves, bottom corners (baked with heavy blur). */
export const Pandan: React.FC = () => {
  const r = rng(27);
  const leaf = (x: number, y: number, ang: number, len: number, wid: number, key: string) => {
    const a = (ang * Math.PI) / 180;
    const tx = x + Math.cos(a) * len, ty = y + Math.sin(a) * len + len * 0.22;
    const mx = x + Math.cos(a) * len * 0.5, my = y + Math.sin(a) * len * 0.5 - len * 0.04;
    const nx = -Math.sin(a) * wid, ny = Math.cos(a) * wid;
    return (
      <g key={key}>
        <path d={`M ${x - nx} ${y - ny} Q ${mx - nx} ${my - ny} ${tx} ${ty} Q ${mx + nx} ${my + ny} ${x + nx} ${y + ny} Z`} fill="#0b0810" />
        <path d={`M ${x} ${y} Q ${mx} ${my} ${tx} ${ty}`} stroke={C.rimWarm} strokeWidth={2.5} opacity={0.3} fill="none" />
      </g>
    );
  };
  const left = Array.from({ length: 8 }, (_, i) => leaf(-60, H + 20, -78 + i * 8 + r() * 6, 380 + r() * 160, 20 + r() * 8, `l${i}`));
  const right = Array.from({ length: 8 }, (_, i) => leaf(W + 60, H + 20, -102 - i * 8 - r() * 6, 380 + r() * 160, 20 + r() * 8, `r${i}`));
  return <g>{left}{right}</g>;
};
