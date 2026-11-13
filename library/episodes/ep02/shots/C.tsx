import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { Ribbon, Pt } from '../art/Silk';
import { BandImg, Live, useShot, ramp, Cam, EIO, EOUT } from '../comp/Camera';
import { Hand, LID, BASE, PAPER, INSERT_VB } from '../sets/bedroom';
import { wordAt } from '../data/ep';

/* =============== Set C: bedroom, top-down =============== */

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const path = (t: number, keys: [number, number, number, number][]) => {
  // keys: [time, x, y, rot] → eased piecewise interpolation
  const ts = keys.map((k) => k[0]);
  const o = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: EIO };
  const ip = (i: number) => {
    let v = keys[0][i];
    for (let k = 1; k < keys.length; k++) v = t <= ts[k - 1] ? v : lerp(v, keys[k][i], interpolate(t, [ts[k - 1], ts[k]], [0, 1], o));
    return v;
  };
  return { x: ip(1), y: ip(2), r: ip(3) };
};

/** the scarf corner peeking from under the white clothes (foreshadow in 7, grabbed in 8) */
export const SCARF_TUCK = { x: BASE.x + 300, y: BASE.y + 330 };
const ScarfTuck: React.FC = () => (
  <g transform={`translate(${SCARF_TUCK.x} ${SCARF_TUCK.y}) rotate(-8)`}>
    <path d="M -60 -6 C -30 -24, 20 -20, 70 -10 C 76 4, 60 22, 40 26 C 0 30, -40 22, -64 12 Z" fill="#167a4a" />
    <path d="M -50 -4 C -20 -16, 20 -14, 60 -6" stroke="#5fe7a0" strokeWidth={5} fill="none" opacity={0.7} />
    <path d="M -64 12 C -40 22, 0 30, 40 26" stroke="#e2b866" strokeWidth={3} fill="none" opacity={0.8} />
  </g>
);

/** folded white blouse carried by the hand */
const Blouse: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-104} y={-124} width={220} height={260} rx={12} fill="#1a0e08" opacity={0.3} />
    <rect x={-110} y={-130} width={220} height={260} rx={12} fill="#f7f3ee" />
    <rect x={-110} y={-130} width={220} height={70} rx={12} fill="#fff" opacity={0.6} />
    <path d="M -44 -126 Q 0 -80 44 -126" fill="#fbf8f4" stroke="#c8bdc0" strokeWidth={2} />
    <path d="M -96 30 L 96 30" stroke="#d6ccce" strokeWidth={2} />
    {[0, 1, 2].map((k) => <circle key={k} cx={0} cy={-60 + k * 44} r={4} fill="#e6ded8" stroke="#b9aeae" />)}
  </g>
);

/** 7 — locked top-down: the blouse goes in (+0.2 s fabric), the lid pocket is zipped (+1.5 s). */
export const S07: React.FC = () => {
  const { t, p } = useShot();
  const cam: Cam = { zoom: 1 + 0.02 * p, dx: 0, dy: 0 };
  const rh = path(t, [[0, 1000, -380, 14], [0.2, 960, -60, 10], [0.8, BASE.x + 250, BASE.y + 160, 2], [1.05, BASE.x + 250, BASE.y + 170, 0], [1.6, BASE.x + 330, BASE.y + 120, -6], [2.6, 1040, -420, 12]]);
  const holding = t < 0.95;
  const blouse = holding ? { x: rh.x, y: rh.y + 150, r: rh.r } : { x: BASE.x + 250, y: BASE.y + 320, r: 0 };
  const zipX0 = LID.x + 62, zipX1 = LID.x + LID.w - 70, zipY = LID.y + 358;
  const zip = ramp(t, 1.5, 2.0, EOUT);
  const zx = lerp(zipX0, zipX1, zip);
  const lh = path(t, [[0, 120, -420, -20], [0.9, 120, -420, -20], [1.4, zx - 30, zipY - 170, -12], [1.5, zx - 30, zipY - 170, -12], [2.0, zx - 30, zipY - 170, -8], [2.8, -60, -420, -22]]);
  const pinch = t > 1.35 && t < 2.1 ? 1 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a160c', overflow: 'hidden' }}>
      <BandImg id="bedroom/room" cam={cam} />
      <Live cam={cam}>
        <ScarfTuck />
        {/* zip: open gap on the right of the pull, closed teeth behind it */}
        <rect x={zx} y={zipY - 7} width={zipX1 - zx} height={14} fill="#1a120c" />
        <line x1={zipX0} y1={zipY} x2={zx} y2={zipY} stroke="#b89a6a" strokeWidth={4} strokeDasharray="3 3" />
        <rect x={zx - 10} y={zipY - 10} width={22} height={34} rx={4} fill="#d6b06a" />
        <rect x={zx - 4} y={zipY + 12} width={10} height={8} rx={2} fill="#8a6a3a" />
        <Blouse {...blouse} />
        <Hand x={rh.x} y={rh.y} rot={rh.r} side={1} curl={holding ? 0.55 : 0.1} armLen={1400} />
        <Hand x={lh.x} y={lh.y} rot={lh.r} side={-1} curl={pinch ? 0.7 : 0.15} armLen={1400} />
      </Live>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 60% at 40% 38%, rgba(255,200,140,0.08), rgba(0,0,0,0) 60%)' }} />
    </AbsoluteFill>
  );
};

/** scarf as a ribbon hanging between the hand and a trailing end */
const scarfPts = (hx: number, hy: number, tx: number, ty: number, t: number, slack: number): Pt[] =>
  Array.from({ length: 30 }, (_, i) => {
    const s = i / 29;
    const x = lerp(hx, tx, s), y = lerp(hy, ty, s);
    const sag = Math.sin(s * Math.PI) * slack;
    return [x + Math.sin(s * 9 + t * 6) * 10 + sag * 0.3, y + sag];
  });

/** 8 — insert: the hand pulls out the green scarf (+0.2 s) and sets it aside; two ticks on the list. */
export const S08: React.FC = () => {
  const { t, p, sec } = useShot();
  const cam: Cam = { zoom: 1 + 0.04 * EIO(p), dx: 0, dy: 0 };
  const vb = `${INSERT_VB.x} ${INSERT_VB.y} ${INSERT_VB.w} ${INSERT_VB.h}`;
  const DEST = { x: 990, y: 470 };
  const h = path(t, [[0, 1000, -200, 10], [0.2, SCARF_TUCK.x + 10, SCARF_TUCK.y - 130, 4], [0.32, SCARF_TUCK.x + 10, SCARF_TUCK.y - 130, 4], [0.95, 900, 240, -10], [1.3, DEST.x, DEST.y - 150, -14], [1.45, DEST.x, DEST.y - 140, -14], [2.1, 1150, -400, 6]]);
  const grab = t > 0.28 && t < 1.38;
  const out = ramp(t, 0.35, 1.0, EIO); // how much of the scarf has left the case
  const dropped = t >= 1.38;
  const tail = { x: lerp(SCARF_TUCK.x - 60, h.x + 40, out * 0.6), y: lerp(SCARF_TUCK.y, h.y + 420, out * 0.9) };
  const settle = ramp(t, 1.38, 1.7, EOUT);
  const tick1 = wordAt(8, /checked/, 0.55), tick2 = wordAt(8, /twice/, 0.75);
  const tk = (t0: number) => ramp(t, t0, t0 + 0.22, EOUT);
  const tickPath = 'M 0 0 l 9 11 l 20 -26';
  const tLen = 45;
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a160c', overflow: 'hidden' }}>
      <BandImg id="bedroom/insert" cam={cam} />
      <Live cam={cam} viewBox={vb}>
        {!grab && !dropped && <ScarfTuck />}
        {grab && (
          <Ribbon pts={scarfPts(h.x, h.y + 150, tail.x, tail.y, t, 120 * (1 - out) + 40)} width={(s) => 100 + 30 * s} twist={(s) => Math.sin(s * 6 + t * 5) * 1.1 + 0.3} trim fringe />
        )}
        {dropped && (
          <g opacity={1}>
            <Ribbon pts={Array.from({ length: 30 }, (_, i) => {
              const s = i / 29;
              const fall = 1 - settle;
              return [DEST.x - 230 + s * 420 + Math.sin(s * 6) * 50 * settle, DEST.y - 40 + Math.sin(s * 4.5 + 1) * 90 - fall * (1 - s) * 160 + s * 80] as Pt;
            })} width={(s) => 120 + 30 * Math.sin(s * 4)} twist={(s) => Math.sin(s * 6) * 1.0 + 0.5} trim fringe />
          </g>
        )}
        <Hand x={h.x} y={h.y} rot={h.r} side={1} curl={grab ? 0.75 : 0.15} armLen={1400} />
        {/* ticks on "NO GREEN!" — checked twice */}
        <g transform={`translate(${PAPER.x} ${PAPER.y}) rotate(${PAPER.rot})`}>
          {[tick1, tick2].map((t0, i) => (
            <path key={i} d={tickPath} transform={`translate(${222 + i * 36} ${222})`} stroke="#9a1f1f" strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={tLen} strokeDashoffset={tLen * (1 - tk(t0))} />
          ))}
        </g>
      </Live>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 60% at 40% 38%, rgba(255,200,140,0.08), rgba(0,0,0,0) 60%)' }} />
      {void sec}
    </AbsoluteFill>
  );
};
