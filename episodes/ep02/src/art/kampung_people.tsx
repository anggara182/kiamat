import React from 'react';

/**
 * EP02 kampung people (new characters). All poses take values computed from the ON-TWOS clock.
 *  - SideMan: side-view adult man (peci, baju koko, sarong), facing dir ±1. Arm poses for arguing, a walking stick,
 *    reading glasses and a paper for the marbot.
 *  - Onlooker: simple front/three-quarter standing figure (low detail).
 *  - DoorHead: head + shoulders silhouette of the crowd seen through the mosque door; `up` tilts the face up.
 */

export type ManLook = { skin: string; skinD: string; shirt: string; shirtD: string; sarong: string; sarongD: string; peci: string; beard?: string; glasses?: boolean };
type Pt = [number, number];

/**
 * Side-view man. Feet at (x, y), height h, facing dir. stoop 0..1 (old age), front arm target `hand` (absolute) or default,
 * `finger` = index finger extended from the front hand, `stick` = walking stick held by the back arm, `paper` = paper in both hands.
 * mouth 0..1 opens a small mouth notch (talking), headTilt in degrees (+ = chin up).
 */
export const SideMan: React.FC<{
  x: number; y: number; h: number; dir: 1 | -1; look: ManLook; stoop?: number; hand?: Pt; backHand?: Pt; finger?: boolean; stick?: boolean;
  paper?: { lift: number }; mouth?: number; headTilt?: number; lean?: number; br?: number;
}> = ({ x, y, h, dir, look, stoop = 0, hand, backHand, finger, stick, paper, mouth = 0, headTilt = 0, lean = 0, br = 0 }) => {
  const u = h / 7;
  const d = dir;
  const breathe = Math.sin(br) * u * 0.025;
  const sk = stoop * u * 0.35 + lean * u; // forward shift of the upper body
  const shY = y - h * 0.8 + stoop * u * 0.15 - breathe, waistY = y - h * 0.47;
  const shX = x + d * sk;
  const depth = u * 0.62; // chest depth (side view)
  const head: Pt = [shX + d * (u * 0.12 + stoop * u * 0.15), shY - u * 0.62];
  const frontSh: Pt = [shX + d * u * 0.05, shY + u * 0.18];
  const backSh: Pt = [shX - d * u * 0.08, shY + u * 0.2];
  const fHand: Pt = hand ?? [shX + d * u * 0.25, waistY + u * 0.45];
  const bHand: Pt = backHand ?? (stick ? [x + d * u * 0.95, waistY + u * 0.35] : [shX - d * u * 0.3, waistY + u * 0.45]);
  const elbow = (a: Pt, b: Pt, bend: number): Pt => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; const dx = b[0] - a[0], dy = b[1] - a[1]; const L = Math.hypot(dx, dy) || 1; return [mx - (dy / L) * bend * d, my + (dx / L) * bend * d]; };
  const fEl = elbow(frontSh, fHand, -u * 0.35), bEl = elbow(backSh, bHand, -u * 0.3);
  const arm = (s: Pt, e: Pt, hnd: Pt, col: string) => (
    <g>
      <path d={`M${s[0]} ${s[1]} L${e[0]} ${e[1]} L${hnd[0]} ${hnd[1]}`} stroke={col} strokeWidth={u * 0.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
  const handShape = (hp: Pt, col: string, pointer: boolean) => {
    const ang = Math.atan2(hp[1] - fEl[1], hp[0] - fEl[0]);
    const fx = Math.cos(ang), fy = Math.sin(ang);
    return (
      <g>
        <ellipse cx={hp[0]} cy={hp[1]} rx={u * 0.15} ry={u * 0.12} fill={col} transform={`rotate(${(ang * 180) / Math.PI} ${hp[0]} ${hp[1]})`} />
        {pointer && <path d={`M${hp[0]} ${hp[1] - u * 0.03} L${hp[0] + fx * u * 0.38} ${hp[1] + fy * u * 0.38 - u * 0.02}`} stroke={col} strokeWidth={u * 0.075} strokeLinecap="round" />}
        {!pointer && <path d={`M${hp[0] + fx * u * 0.05} ${hp[1] + u * 0.02} L${hp[0] + fx * u * 0.16} ${hp[1] + fy * u * 0.16 + u * 0.04}`} stroke={look.skinD} strokeWidth={u * 0.03} />}
      </g>
    );
  };
  const tilt = -headTilt * d;
  const paperY = paper ? shY + u * (1.3 - 1.0 * paper.lift) : 0;
  const paperX = paper ? shX + d * u * (0.75 + 0.15 * paper.lift) : 0;
  return (
    <g>
      {/* walking stick (behind the body) */}
      {stick && <path d={`M${bHand[0]} ${bHand[1] - u * 0.1} L${bHand[0] + d * u * 0.12} ${y}`} stroke="#4a3626" strokeWidth={u * 0.09} strokeLinecap="round" />}
      {/* back arm (far side, darker) */}
      {!paper && arm(backSh, bEl, bHand, look.shirtD)}
      {!paper && <ellipse cx={bHand[0]} cy={bHand[1]} rx={u * 0.14} ry={u * 0.12} fill={look.skinD} />}
      {/* sandals + feet */}
      <path d={`M${x - d * u * 0.25} ${y} l${d * u * 0.62} 0 l${-d * u * 0.05} ${-u * 0.12} l${-d * u * 0.5} ${-u * 0.02} Z`} fill="#2a2420" />
      <path d={`M${x - d * u * 0.15} ${y - u * 0.12} l${d * u * 0.4} -${u * 0.02} l0 -${u * 0.14} l-${d * u * 0.36} 0 Z`} fill={look.skinD} />
      {/* sarong (side view, slight forward fold) */}
      <path d={`M${shX - d * depth * 0.42} ${waistY} L${shX + d * depth * 0.55} ${waistY} L${x + d * u * 0.5} ${y - u * 0.2} L${x - d * u * 0.45} ${y - u * 0.2} Z`} fill={look.sarong} />
      <path d={`M${shX - d * depth * 0.42} ${waistY} L${x - d * u * 0.45} ${y - u * 0.2} L${x - d * u * 0.1} ${y - u * 0.2} L${shX} ${waistY} Z`} fill={look.sarongD} />
      {[0.33, 0.66].map((f) => <path key={f} d={`M${shX - d * depth * 0.42 + (x - d * u * 0.45 - shX + d * depth * 0.42) * f} ${waistY + (y - u * 0.2 - waistY) * f} L${shX + d * depth * 0.55 + (x + d * u * 0.5 - shX - d * depth * 0.55) * f} ${waistY + (y - u * 0.2 - waistY) * f}`} stroke={look.sarongD} strokeWidth={u * 0.05} />)}
      <rect x={Math.min(shX - d * depth * 0.45, shX + d * depth * 0.58)} y={waistY - u * 0.02} width={depth * 1.03} height={u * 0.12} fill={look.sarongD} />
      {/* torso (baju koko) */}
      <path d={`M${shX - d * depth * 0.5} ${shY + u * 0.1} Q${shX} ${shY - u * 0.12} ${shX + d * depth * 0.45} ${shY + u * 0.12} L${shX + d * depth * 0.6} ${waistY + u * 0.15} L${shX - d * depth * 0.45} ${waistY + u * 0.15} Z`} fill={look.shirt} />
      <path d={`M${shX - d * depth * 0.5} ${shY + u * 0.1} L${shX - d * depth * 0.45} ${waistY + u * 0.15} L${shX - d * depth * 0.1} ${waistY + u * 0.15} L${shX - d * depth * 0.15} ${shY + u * 0.02} Z`} fill={look.shirtD} />
      <path d={`M${shX + d * depth * 0.42} ${shY + u * 0.25} L${shX + d * depth * 0.5} ${shY + u * 0.95}`} stroke={look.shirtD} strokeWidth={u * 0.04} />
      {/* neck + head */}
      <rect x={head[0] - u * 0.14 - d * u * 0.04} y={shY - u * 0.24} width={u * 0.3} height={u * 0.3} fill={look.skinD} />
      <g transform={`rotate(${tilt} ${head[0]} ${head[1] + u * 0.35})`}>
        <ellipse cx={head[0]} cy={head[1]} rx={u * 0.4} ry={u * 0.48} fill={look.skin} />
        {/* back of the head shade + ear */}
        <path d={`M${head[0] - d * u * 0.05} ${head[1] - u * 0.46} A${u * 0.4} ${u * 0.48} 0 0 ${d > 0 ? 0 : 1} ${head[0] - d * u * 0.05} ${head[1] + u * 0.47} Q${head[0] - d * u * 0.42} ${head[1]} ${head[0] - d * u * 0.05} ${head[1] - u * 0.46} Z`} fill={look.skinD} opacity={0.55} />
        <ellipse cx={head[0] - d * u * 0.06} cy={head[1] + u * 0.02} rx={u * 0.07} ry={u * 0.12} fill={look.skinD} />
        {/* profile: nose + brow + mouth notch */}
        <path d={`M${head[0] + d * u * 0.37} ${head[1] - u * 0.08} L${head[0] + d * u * 0.5} ${head[1] + u * 0.1} L${head[0] + d * u * 0.37} ${head[1] + u * 0.13} Z`} fill={look.skin} />
        <path d={`M${head[0] + d * u * 0.16} ${head[1] - u * 0.07} L${head[0] + d * u * 0.33} ${head[1] - u * 0.09}`} stroke={look.skinD} strokeWidth={u * 0.05} strokeLinecap="round" />
        {look.glasses && <g fill="none" stroke="#2a2420" strokeWidth={u * 0.035}><ellipse cx={head[0] + d * u * 0.27} cy={head[1] - u * 0.01} rx={u * 0.1} ry={u * 0.08} /><path d={`M${head[0] + d * u * 0.17} ${head[1] - u * 0.02} L${head[0] - d * u * 0.06} ${head[1] - u * 0.03}`} /></g>}
        {look.beard && <path d={`M${head[0] + d * u * 0.38} ${head[1] + u * 0.2} Q${head[0] + d * u * 0.3} ${head[1] + u * 0.62} ${head[0] + d * u * 0.02} ${head[1] + u * 0.42} L${head[0] - d * u * 0.12} ${head[1] + u * 0.22} Q${head[0] + d * u * 0.15} ${head[1] + u * 0.32} ${head[0] + d * u * 0.38} ${head[1] + u * 0.2} Z`} fill={look.beard} />}
        <path d={`M${head[0] + d * u * 0.4} ${head[1] + u * 0.24} l${-d * u * (0.1 + 0.06 * mouth)} ${u * 0.02 * mouth}`} stroke="#3a2420" strokeWidth={u * (0.03 + 0.05 * mouth)} strokeLinecap="round" />
        {/* peci */}
        <path d={`M${head[0] - u * 0.4} ${head[1] - u * 0.18} L${head[0] - u * 0.37} ${head[1] - u * 0.56} L${head[0] + u * 0.37} ${head[1] - u * 0.56} L${head[0] + u * 0.4} ${head[1] - u * 0.18} Z`} fill={look.peci} />
        <rect x={head[0] - u * 0.4} y={head[1] - u * 0.24} width={u * 0.8} height={u * 0.05} fill="#000" opacity={0.15} />
      </g>
      {/* paper held in both hands (marbot) */}
      {paper && (
        <g>
          {arm(backSh, [shX + d * u * 0.25, paperY + u * 0.6], [paperX - d * u * 0.05, paperY + u * 0.35], look.shirtD)}
          <path d={`M${paperX - d * u * 0.15} ${paperY - u * 0.55} L${paperX + d * u * 0.12} ${paperY - u * 0.62} L${paperX + d * u * 0.14} ${paperY + u * 0.55} L${paperX - d * u * 0.13} ${paperY + u * 0.6} Z`} fill="#f2efe6" />
          <path d={`M${paperX - d * u * 0.15} ${paperY - u * 0.55} L${paperX - d * u * 0.13} ${paperY + u * 0.6}`} stroke="#c9c4b4" strokeWidth={u * 0.03} />
          <circle cx={paperX} cy={paperY + u * 0.32} r={u * 0.07} fill="none" stroke="#5a7ab8" strokeWidth={u * 0.025} />
          {arm(frontSh, [shX + d * u * 0.42, paperY + u * 0.75], [paperX + d * u * 0.02, paperY + u * 0.45], look.shirt)}
          <ellipse cx={paperX + d * u * 0.02} cy={paperY + u * 0.45} rx={u * 0.13} ry={u * 0.11} fill={look.skin} />
        </g>
      )}
      {/* front arm + hand */}
      {!paper && arm(frontSh, fEl, fHand, look.shirt)}
      {!paper && handShape(fHand, look.skin, !!finger)}
    </g>
  );
};

/** simple standing onlooker (front/three-quarter), low detail; sway on twos via `sh` */
export const Onlooker: React.FC<{ x: number; y: number; h: number; body: string; head: string; scarf?: string; peci?: boolean; sh: number; armsCrossed?: boolean; turn?: number }> = ({ x, y, h, body, head, scarf, peci, sh, armsCrossed, turn = 0 }) => {
  const u = h / 7; const ox = Math.sin(sh) * u * 0.06;
  return (
    <g transform={`translate(${ox} 0)`}>
      <path d={`M${x - u * 0.62} ${y - h * 0.46} L${x + u * 0.62} ${y - h * 0.46} L${x + u * 0.45} ${y} L${x - u * 0.45} ${y} Z`} fill={body} opacity={0.85} />
      <path d={`M${x - u * 0.95} ${y - h * 0.79} Q${x} ${y - h * 0.84} ${x + u * 0.95} ${y - h * 0.79} L${x + u * 0.7} ${y - h * 0.44} L${x - u * 0.7} ${y - h * 0.44} Z`} fill={body} />
      {armsCrossed ? <rect x={x - u * 0.8} y={y - h * 0.66} width={u * 1.6} height={u * 0.38} rx={u * 0.18} fill={body} /> : <><path d={`M${x - u * 0.92} ${y - h * 0.77} L${x - u * 1.0} ${y - h * 0.48}`} stroke={body} strokeWidth={u * 0.28} strokeLinecap="round" /><path d={`M${x + u * 0.92} ${y - h * 0.77} L${x + u * 1.0} ${y - h * 0.48}`} stroke={body} strokeWidth={u * 0.28} strokeLinecap="round" /></>}
      {scarf ? (
        <g fill={scarf}><path d={`M${x - u * 0.5} ${y - h * 0.84} Q${x - u * 0.55} ${y - h * 0.74} ${x - u * 0.9} ${y - h * 0.72} L${x + u * 0.9} ${y - h * 0.72} Q${x + u * 0.55} ${y - h * 0.74} ${x + u * 0.5} ${y - h * 0.84} Z`} /><ellipse cx={x} cy={y - h * 0.9} rx={u * 0.48} ry={u * 0.55} /><ellipse cx={x + turn * u * 0.12} cy={y - h * 0.885} rx={u * 0.3} ry={u * 0.37} fill={head} /></g>
      ) : (
        <g><rect x={x - u * 0.13} y={y - h * 0.84} width={u * 0.26} height={u * 0.25} fill={head} /><ellipse cx={x + turn * u * 0.05} cy={y - h * 0.9} rx={u * 0.38} ry={u * 0.47} fill={head} />{peci ? <rect x={x - u * 0.36 + turn * u * 0.05} y={y - h * 0.9 - u * 0.52} width={u * 0.72} height={u * 0.3} fill="#141214" /> : <path d={`M${x - u * 0.4} ${y - h * 0.9} Q${x} ${y - h * 0.9 - u * 0.7} ${x + u * 0.4} ${y - h * 0.9} Z`} fill="#1d1a1a" />}</g>
      )}
    </g>
  );
};

/** crowd head + shoulders seen through a bright doorway (silhouette with a little skin). up 0..1 = face turns up */
export const DoorHead: React.FC<{ x: number; y: number; s: number; kind: 'hijab' | 'peci' | 'hair'; col: string; up: number }> = ({ x, y, s, kind, col, up }) => {
  const hy = y - 60 * s - up * 6 * s;
  return (
    <g>
      <path d={`M${x - 52 * s} ${y + 40 * s} Q${x - 50 * s} ${y - 14 * s} ${x} ${y - 18 * s} Q${x + 50 * s} ${y - 14 * s} ${x + 52 * s} ${y + 40 * s} Z`} fill={col} />
      {kind === 'hijab' ? (
        <g><path d={`M${x - 30 * s} ${hy} Q${x - 34 * s} ${y - 6 * s} ${x - 44 * s} ${y + 10 * s} L${x + 44 * s} ${y + 10 * s} Q${x + 34 * s} ${y - 6 * s} ${x + 30 * s} ${hy} Z`} fill={col} /><ellipse cx={x} cy={hy} rx={28 * s} ry={32 * s} fill={col} /><ellipse cx={x} cy={hy + 4 * s - up * 8 * s} rx={16 * s} ry={(19 - up * 4) * s} fill="#8a6450" opacity={0.85} /></g>
      ) : (
        <g><rect x={x - 9 * s} y={hy + 18 * s} width={18 * s} height={20 * s} fill={col} /><ellipse cx={x} cy={hy} rx={22 * s} ry={28 * s} fill={col} /><ellipse cx={x} cy={hy + 8 * s - up * 10 * s} rx={15 * s} ry={(16 - up * 4) * s} fill="#8a6450" opacity={0.8} />{kind === 'peci' && <rect x={x - 21 * s} y={hy - 30 * s - up * 3 * s} width={42 * s} height={16 * s} fill="#141214" />}</g>
      )}
    </g>
  );
};
