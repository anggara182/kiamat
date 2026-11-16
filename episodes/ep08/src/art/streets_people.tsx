import React from 'react';

/**
 * Simple full-body figure for the "streets" night (copied from EP07 farcity), 3/4-side view facing RIGHT, feet at (0,0), ~1000 tall (head ~1/7).
 * Mitten hands, tapered limbs with a knee/elbow bend, no facial detail. Animate `walk` and `wave` with ON-TWOS clocks.
 */
export type FigSpec = { skin: string; hair: 'short' | 'scarf' | 'long' | 'bald'; hairC: string; top: string; topD: string; legs: string; shoe?: string; coat?: boolean };

/** tapered capsule limb with rounded ends (soft joints at knee/elbow) */
const limb = (x1: number, y1: number, x2: number, y2: number, w1: number, w2: number) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return `M${x1 + nx * w1} ${y1 + ny * w1} L${x2 + nx * w2} ${y2 + ny * w2} A${w2} ${w2} 0 0 0 ${x2 - nx * w2} ${y2 - ny * w2} L${x1 - nx * w1} ${y1 - ny * w1} A${w1} ${w1} 0 0 0 ${x1 + nx * w1} ${y1 + ny * w1} Z`;
};
/** two-segment arm from shoulder S: upper angle a (deg, 0 = straight down, positive = forward), elbow bend b */
export const armPts = (sx: number, sy: number, a: number, b: number) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const e = { x: sx + Math.sin(r(a)) * 190, y: sy + Math.cos(r(a)) * 190 };
  const h = { x: e.x + Math.sin(r(a + b)) * 180, y: e.y + Math.cos(r(a + b)) * 180 };
  return { e, h };
};

export const Figure: React.FC<{
  f: FigSpec; walk?: number; armF?: [number, number]; armB?: [number, number]; headTurn?: number; sil?: string;
  /** props held in the hands: receives the front and back hand points (figure-local) */
  hold?: (front: { x: number; y: number }, back: { x: number; y: number }) => React.ReactNode;
  holdBack?: (back: { x: number; y: number }) => React.ReactNode;
}> = ({ f, walk = 0, armF = [8, -10], armB = [-8, -6], sil, hold, holdBack }) => {
  const c = (x: string) => sil ?? x;
  const sw = Math.sin(walk) * 20;
  const knee = (ang: number) => ({ x: Math.sin((ang * Math.PI) / 180) * 250, y: -480 + Math.cos((ang * Math.PI) / 180) * 250 });
  const leg = (ang: number, k: number) => {
    const kn = knee(ang), ft = { x: kn.x + Math.sin(((ang - k) * Math.PI) / 180) * 240, y: kn.y + Math.cos(((ang - k) * Math.PI) / 180) * 240 };
    return (
      <g>
        <path d={limb(0, -480, kn.x, kn.y, 40, 32)} fill={c(f.legs)} />
        <path d={limb(kn.x, kn.y, ft.x, ft.y, 32, 24)} fill={c(f.legs)} />
        <ellipse cx={ft.x + 22} cy={ft.y - 4} rx={44} ry={18} fill={c(f.shoe ?? '#1d1a18')} />
      </g>
    );
  };
  const S = { x: 0, y: -820 };
  const B = armPts(S.x - 10, S.y, armB[0] - sw * 0.8, armB[1]), F = armPts(S.x + 10, S.y, armF[0] + sw * 0.8, armF[1]);
  return (
    <g>
      {/* back arm + back leg */}
      <path d={limb(S.x - 10, S.y, B.e.x, B.e.y, 30, 26)} fill={c(f.topD)} />
      <path d={limb(B.e.x, B.e.y, B.h.x, B.h.y, 24, 20)} fill={c(f.coat ? f.topD : f.skin)} />
      <circle cx={B.h.x} cy={B.h.y} r={24} fill={c(f.skin)} />
      {holdBack && holdBack(B.h)}
      {leg(-sw, sw > 0 ? 20 : 4)}
      {leg(sw, sw < 0 ? 20 : 4)}
      {/* torso (shoulders wider than waist), optional long coat */}
      <path d={`M-82 -846 C-40 -876 44 -876 86 -846 C96 -760 80 -640 70 ${f.coat ? -190 : -470} L-66 ${f.coat ? -190 : -470} C-80 -640 -96 -760 -82 -846 Z`} fill={c(f.top)} />
      <path d={`M-78 -850 L-64 ${f.coat ? -190 : -470} L-30 ${f.coat ? -190 : -470} L-46 -850 Z`} fill={c(f.topD)} opacity={0.7} />
      <path d={limb(0, -880, 6, -840, 26, 28)} fill={c(f.skin)} />
      {/* head */}
      {f.hair === 'long' && <path d="M-70 -960 C-90 -880 -84 -820 -70 -790 L10 -800 C-10 -860 -20 -920 -10 -960 Z" fill={c(f.hairC)} />}
      <ellipse cx={8} cy={-930} rx={58} ry={68} fill={c(f.skin)} />
      <path d="M58 -930 L74 -910 L58 -900 Z" fill={c(f.skin)} />
      {f.hair === 'short' && <path d="M60 -960 C40 -1010 -40 -1010 -60 -950 C-66 -920 -56 -890 -46 -880 L-30 -910 C-20 -940 20 -960 64 -950 Z" fill={c(f.hairC)} />}
      {f.hair === 'long' && <path d="M66 -950 C40 -1012 -50 -1010 -66 -940 L-60 -880 L-36 -920 C-20 -950 30 -960 68 -946 Z" fill={c(f.hairC)} />}
      {f.hair === 'scarf' && <path d="M64 -960 C40 -1016 -50 -1016 -70 -940 C-80 -880 -70 -820 -40 -790 L60 -800 C40 -840 34 -880 40 -930 Z" fill={c(f.hairC)} />}
      {f.hair === 'bald' && <path d="M-56 -930 C-60 -900 -54 -880 -44 -870 L-36 -900 Z" fill={c(f.hairC)} />}
      {/* front arm with mitten hand */}
      <path d={limb(S.x + 10, S.y, F.e.x, F.e.y, 30, 26)} fill={c(f.top)} />
      <path d={limb(F.e.x, F.e.y, F.h.x, F.h.y, 24, 20)} fill={c(f.coat ? f.top : f.skin)} />
      <circle cx={F.h.x} cy={F.h.y} r={26} fill={c(f.skin)} />
      {hold && hold(F.h, B.h)}
    </g>
  );
};

/**
 * BACK VIEW figure (seen from behind): back of the head (hair only, no face, no ear), both shoulders square to camera.
 * Feet at (0,0), ~1000 tall. handL / handR are hand targets in local coords (arms reach toward them).
 */
export const BackFigure: React.FC<{ f: FigSpec; handL: { x: number; y: number }; handR: { x: number; y: number }; fill?: string; shift?: number; walk?: number }> = ({ f, handL, handR, fill, shift = 0, walk }) => {
  const lift = (k: number) => (walk === undefined ? 0 : Math.max(0, Math.sin(walk + k * Math.PI)) * 60);
  const c = (x: string) => fill ?? x;
  const arm = (sx: number, h: { x: number; y: number }, side: number) => {
    const e = { x: (sx + h.x) / 2 + side * 46, y: (-830 + h.y) / 2 + 30 };
    return (
      <g>
        <path d={limb(sx, -830, e.x, e.y, 34, 28)} fill={c(f.top)} />
        <path d={limb(e.x, e.y, h.x, h.y, 28, 22)} fill={c(f.top)} />
        <circle cx={h.x} cy={h.y} r={27} fill={c(f.skin)} />
      </g>
    );
  };
  return (
    <g transform={`translate(${shift} 0)`}>
      {/* legs (back view), heels toward us */}
      <path d={limb(-42, -480, -50, -30 - lift(0), 44, 30)} fill={c(f.legs)} />
      <path d={limb(42, -480, 50, -30 - lift(1), 44, 30)} fill={c(f.legs)} />
      <ellipse cx={-52} cy={-12 - lift(0)} rx={36} ry={18} fill={c(f.shoe ?? '#1d1a18')} />
      <ellipse cx={52} cy={-12 - lift(1)} rx={36} ry={18} fill={c(f.shoe ?? '#1d1a18')} />
      {arm(-96, handL, -1)}
      {arm(96, handR, 1)}
      {/* torso: square shoulders, tapering to the waist; a shirt crease down the back */}
      <path d="M-104 -846 C-60 -872 60 -872 104 -846 L90 -700 C84 -600 78 -520 72 -460 L-72 -460 C-78 -520 -84 -600 -90 -700 Z" fill={c(f.top)} />
      <path d="M0 -860 C4 -700 -2 -560 4 -470" stroke={c(f.topD)} strokeWidth={6} fill="none" opacity={0.6} />
      {/* neck + the back of the head (hair covers it all) */}
      <path d={limb(0, -900, 0, -846, 30, 34)} fill={c(f.skin)} />
      <ellipse cx={0} cy={-940} rx={62} ry={72} fill={c(f.hairC)} />
      <path d="M-58 -900 C-30 -872 30 -872 58 -900 C40 -884 -40 -884 -58 -900 Z" fill={c(f.hairC)} />
    </g>
  );
};
