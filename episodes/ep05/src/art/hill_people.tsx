import React from 'react';

/** EP05 hill people (new characters). Poses take values from the ON-TWOS clock. */
type Pt = [number, number];
const limb = (a: Pt, b: Pt, c: Pt, w: number, col: string) => <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}`} stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />;

/** digging worker, side view facing dir; dig 0..1 (0 = shovel raised, 1 = blade in the soil); hat */
export const Worker: React.FC<{ x: number; y: number; h: number; dir: 1 | -1; dig: number; shirt: string; pants: string; skin: string; hat: string; rim: string }> = ({ x, y, h, dir, dig, shirt, pants, skin, hat, rim }) => {
  const u = h / 7, d = dir;
  const bend = 0.4 + 0.5 * dig;
  const hip: Pt = [x, y - h * 0.48];
  const sh: Pt = [x + d * u * 0.9 * bend, y - h * 0.8 + u * 0.7 * bend];
  const head: Pt = [sh[0] + d * u * 0.45, sh[1] - u * 0.55];
  const blade: Pt = [x + d * u * (2.6 - 0.2 * dig), y - u * (1.6 - 1.55 * dig)];
  const top: Pt = [blade[0] - d * u * 2.2, blade[1] - u * (2.4 - 0.9 * dig)];
  const h1: Pt = [top[0] + (blade[0] - top[0]) * 0.12, top[1] + (blade[1] - top[1]) * 0.12];
  const h2: Pt = [top[0] + (blade[0] - top[0]) * 0.55, top[1] + (blade[1] - top[1]) * 0.55];
  return (
    <g>
      {limb([hip[0] - d * u * 0.1, hip[1]], [x - d * u * 0.5, y - h * 0.24], [x - d * u * 0.6, y], u * 0.36, pants)}
      {limb([hip[0] + d * u * 0.1, hip[1]], [x + d * u * 0.6, y - h * 0.26], [x + d * u * 0.5, y], u * 0.36, pants)}
      <path d={`M${x - d * u * 0.9} ${y} h${d * u * 0.6} M${x + d * u * 0.3} ${y} h${d * u * 0.6}`} stroke="#2a221c" strokeWidth={u * 0.2} />
      <path d={`M${hip[0] - u * 0.5} ${hip[1] + u * 0.1} L${sh[0] - d * u * 0.55} ${sh[1]} Q${sh[0]} ${sh[1] - u * 0.25} ${sh[0] + d * u * 0.5} ${sh[1] + u * 0.1} L${hip[0] + u * 0.5} ${hip[1] + u * 0.1} Z`} fill={shirt} />
      {/* shovel */}
      <path d={`M${top[0]} ${top[1]} L${blade[0]} ${blade[1]}`} stroke="#6a4a2e" strokeWidth={u * 0.09} strokeLinecap="round" />
      <path d={`M${blade[0] - u * 0.2} ${blade[1] - u * 0.05} L${blade[0] + d * u * 0.25} ${blade[1] + u * 0.3} L${blade[0] + d * u * 0.05} ${blade[1] + u * 0.5} L${blade[0] - d * u * 0.4} ${blade[1] + u * 0.2} Z`} fill="#5a5a5e" />
      {dig < 0.4 && <ellipse cx={blade[0] + d * u * 0.05} cy={blade[1] + u * 0.05} rx={u * 0.3} ry={u * 0.14} fill="#7a5c3c" />}
      {limb(sh, [sh[0] + d * u * 0.2, sh[1] + u * 0.9], h2, u * 0.28, shirt)}
      {limb([sh[0] - d * u * 0.2, sh[1]], [sh[0] - d * u * 0.4, sh[1] + u * 0.6], h1, u * 0.26, shirt)}
      <circle cx={h1[0]} cy={h1[1]} r={u * 0.14} fill={skin} /><circle cx={h2[0]} cy={h2[1]} r={u * 0.14} fill={skin} />
      <ellipse cx={head[0]} cy={head[1]} rx={u * 0.4} ry={u * 0.46} fill={skin} />
      <path d={`M${head[0] - u * 0.75} ${head[1] - u * 0.18} Q${head[0]} ${head[1] - u * 0.45} ${head[0] + u * 0.75} ${head[1] - u * 0.18} L${head[0] + u * 0.4} ${head[1] - u * 0.3} Q${head[0]} ${head[1] - u * 0.85} ${head[0] - u * 0.4} ${head[1] - u * 0.3} Z`} fill={hat} />
      <path d={`M${head[0] - u * 0.75} ${head[1] - u * 0.18} Q${head[0]} ${head[1] - u * 0.45} ${head[0] + u * 0.75} ${head[1] - u * 0.18}`} stroke={rim} strokeOpacity={0.6} strokeWidth={u * 0.05} fill="none" />
    </g>
  );
};

/** visitor seen from behind; umbrella (sun) or pointing arm; sway on twos */
export const Visitor: React.FC<{ x: number; y: number; h: number; body: string; head: string; scarf?: string; umbrella?: string; point?: number; sw: number }> = ({ x, y, h, body, head, scarf, umbrella, point = 0, sw }) => {
  const u = h / 7, ox = Math.sin(sw) * u * 0.05;
  const shY = y - h * 0.8;
  const cx = x + ox;
  return (
    <g>
      <path d={`M${cx - u * 0.6} ${y - h * 0.47} L${cx + u * 0.6} ${y - h * 0.47} L${cx + u * 0.5} ${y} L${cx - u * 0.5} ${y} Z`} fill={body} opacity={0.85} />
      <path d={`M${cx - u * 0.95} ${shY + u * 0.1} Q${cx} ${shY - u * 0.15} ${cx + u * 0.95} ${shY + u * 0.1} L${cx + u * 0.7} ${y - h * 0.44} L${cx - u * 0.7} ${y - h * 0.44} Z`} fill={body} />
      {limb([cx - u * 0.85, shY + u * 0.15], [cx - u * 1.0, shY + u * 1.3], [cx - u * 0.9, shY + u * 2.3], u * 0.28, body)}
      {point > 0
        ? <g>{limb([cx + u * 0.85, shY + u * 0.15], [cx + u * (1.2 + 0.4 * point), shY - u * (0.1 + 0.4 * point)], [cx + u * (1.6 + 0.9 * point), shY - u * (0.4 + 1.0 * point)], u * 0.26, body)}<circle cx={cx + u * (1.6 + 0.9 * point)} cy={shY - u * (0.4 + 1.0 * point)} r={u * 0.13} fill={head} /></g>
        : limb([cx + u * 0.85, shY + u * 0.15], [cx + u * 0.9, shY + u * 1.1], [cx + u * 0.35, shY + u * 0.9], u * 0.28, body)}
      {umbrella && <g><path d={`M${cx + u * 0.35} ${shY + u * 0.9} L${cx + u * 0.2} ${shY - u * 1.8}`} stroke="#3a3028" strokeWidth={u * 0.07} /><path d={`M${cx - u * 1.6} ${shY - u * 1.5} Q${cx + u * 0.2} ${shY - u * 3.2} ${cx + u * 2.0} ${shY - u * 1.5} Q${cx + u * 1.55} ${shY - u * 1.75} ${cx + u * 1.1} ${shY - u * 1.55} Q${cx + u * 0.65} ${shY - u * 1.8} ${cx + u * 0.2} ${shY - u * 1.55} Q${cx - u * 0.25} ${shY - u * 1.8} ${cx - u * 0.7} ${shY - u * 1.55} Q${cx - u * 1.15} ${shY - u * 1.78} ${cx - u * 1.6} ${shY - u * 1.5} Z`} fill={umbrella} /></g>}
      {scarf
        ? <g fill={scarf}><path d={`M${cx - u * 0.5} ${shY - u * 0.55} Q${cx - u * 0.6} ${shY + u * 0.1} ${cx - u * 0.9} ${shY + u * 0.3} L${cx + u * 0.9} ${shY + u * 0.3} Q${cx + u * 0.6} ${shY + u * 0.1} ${cx + u * 0.5} ${shY - u * 0.55} Z`} /><ellipse cx={cx} cy={shY - u * 0.6} rx={u * 0.48} ry={u * 0.55} /></g>
        : <g><rect x={cx - u * 0.15} y={shY - u * 0.3} width={u * 0.3} height={u * 0.35} fill={head} /><ellipse cx={cx} cy={shY - u * 0.6} rx={u * 0.42} ry={u * 0.5} fill="#1d1a1a" /></g>}
    </g>
  );
};

/** father from behind with a child lifted onto his shoulders; lift 0..1 */
export const FatherChild: React.FC<{ x: number; y: number; h: number; lift: number; sw: number }> = ({ x, y, h, lift, sw }) => {
  const u = h / 7; const shY = y - h * 0.8; const ox = Math.sin(sw) * u * 0.04;
  const cy = shY - u * (0.2 + 1.6 * lift) + (1 - lift) * u * 2.6; // child's seat height
  const cx = x + ox + (1 - lift) * u * 1.3;
  const cu = u * 0.75;
  return (
    <g>
      {/* child (behind his head when on shoulders) */}
      <g>
        <path d={`M${cx - cu * 0.7} ${cy} L${cx - cu * 0.6} ${cy - cu * 1.6} Q${cx} ${cy - cu * 1.8} ${cx + cu * 0.6} ${cy - cu * 1.6} L${cx + cu * 0.7} ${cy} Z`} fill="#c9584a" />
        {limb([cx - cu * 0.5, cy], [cx - cu * 1.0, cy + cu * 0.8 * lift + cu * 0.4], [cx - cu * 0.9, cy + cu * 1.6], cu * 0.3, '#3e4a62')}
        {limb([cx + cu * 0.5, cy], [cx + cu * 1.0, cy + cu * 0.8 * lift + cu * 0.4], [cx + cu * 0.9, cy + cu * 1.6], cu * 0.3, '#3e4a62')}
        {limb([cx + cu * 0.55, cy - cu * 1.5], [cx + cu * 1.0, cy - cu * (2.0 + lift)], [cx + cu * 1.2, cy - cu * (2.8 + 1.2 * lift)], cu * 0.24, '#c9584a')}
        <ellipse cx={cx} cy={cy - cu * 2.15} rx={cu * 0.55} ry={cu * 0.6} fill="#1d1a1a" />
      </g>
      {/* father */}
      <path d={`M${x + ox - u * 0.6} ${y - h * 0.47} L${x + ox + u * 0.6} ${y - h * 0.47} L${x + ox + u * 0.5} ${y} L${x + ox - u * 0.5} ${y} Z`} fill="#3a3a44" />
      <path d={`M${x + ox - u} ${shY + u * 0.1} Q${x + ox} ${shY - u * 0.15} ${x + ox + u} ${shY + u * 0.1} L${x + ox + u * 0.75} ${y - h * 0.44} L${x + ox - u * 0.75} ${y - h * 0.44} Z`} fill="#6a8a7a" />
      {limb([x + ox - u * 0.9, shY + u * 0.15], [x + ox - u * 1.2, shY - u * 0.4 * lift + u * 0.6], [cx - cu * 0.8, cy + cu * 0.9], u * 0.28, '#6a8a7a')}
      {limb([x + ox + u * 0.9, shY + u * 0.15], [x + ox + u * 1.2, shY - u * 0.4 * lift + u * 0.6], [cx + cu * 0.8, cy + cu * 0.9], u * 0.28, '#6a8a7a')}
      <rect x={x + ox - u * 0.15} y={shY - u * 0.3} width={u * 0.3} height={u * 0.35} fill="#7a4f3e" />
      <ellipse cx={x + ox} cy={shY - u * 0.6} rx={u * 0.42} ry={u * 0.5} fill="#1d1a1a" />
    </g>
  );
};

/** a hand reaching in from the side to lay a flower; k 0..1 = reach (flower released at 1) */
export const FlowerHand: React.FC<{ from: Pt; to: Pt; k: number; skin: string; sleeve: string; flower: string }> = ({ from, to, k, skin, sleeve, flower }) => {
  const hx = from[0] + (to[0] - from[0]) * k, hy = from[1] + (to[1] - from[1]) * k - Math.sin(k * Math.PI) * 60;
  const ang = Math.atan2(to[1] - from[1], to[0] - from[0]) * 180 / Math.PI;
  return (
    <g>
      <path d={`M${from[0]} ${from[1]} L${hx} ${hy}`} stroke={sleeve} strokeWidth={110} strokeLinecap="round" />
      <g transform={`translate(${hx} ${hy}) rotate(${ang})`}>
        <rect x={-10} y={-44} width={110} height={88} rx={40} fill={skin} />
        <rect x={60} y={-30} width={80} height={24} rx={12} fill={skin} />
        <rect x={60} y={-4} width={74} height={22} rx={11} fill={skin} />
        <path d="M130 -6 L230 -40" stroke="#4d6a49" strokeWidth={8} />
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={236 + Math.cos((a * Math.PI) / 180) * 20} cy={-44 + Math.sin((a * Math.PI) / 180) * 20} rx={18} ry={13} fill={flower} />)}
        <circle cx={236} cy={-44} r={10} fill="#e8b84a" />
      </g>
    </g>
  );
};
/** a flower lying on the ground (top/side view) */
export const LaidFlower: React.FC<{ x: number; y: number; s: number; rot: number; col: string }> = ({ x, y, s, rot, col }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-60 6 L20 0" stroke="#4d6a49" strokeWidth={7} />
    <path d="M-20 3 q-10 -18 -26 -16 q10 10 26 16" fill="#5e7a52" />
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={34 + Math.cos((a * Math.PI) / 180) * 16} cy={Math.sin((a * Math.PI) / 180) * 12} rx={15} ry={10} fill={col} />)}
    <circle cx={34} cy={0} r={8} fill="#e8b84a" />
  </g>
);

/** walker seen from directly above (shoulders + head), walking along a circle; facing angle a (rad); ph walk (twos) */
export const TopWalker: React.FC<{ x: number; y: number; a: number; s: number; body: string; head: string; ph: number }> = ({ x, y, a, s, body, head, ph }) => {
  const sw = Math.sin(ph) * 8 * s;
  return (
    <g transform={`translate(${x} ${y}) rotate(${(a * 180) / Math.PI})`}>
      <ellipse cx={sw * 0.3} cy={-14 * s} rx={9 * s} ry={6 * s} fill="#2a2024" opacity={0.7} />
      <ellipse cx={-sw * 0.3} cy={14 * s} rx={9 * s} ry={6 * s} fill="#2a2024" opacity={0.7} />
      <ellipse cx={0} cy={0} rx={18 * s} ry={34 * s} fill={body} />
      <circle cx={2 * s} cy={0} r={14 * s} fill={head} />
    </g>
  );
};

/** calm woman in profile (facing left), headscarf, eyes half closed; dusk rim from the right */
export const WomanProfile: React.FC<{ x: number; y: number; s: number; eyes: number; br: number }> = ({ x, y, s, eyes, br }) => {
  const b = Math.sin(br) * 4 * s;
  return (
    <g transform={`translate(${x} ${y + b}) scale(${s})`}>
      {/* shoulders + scarf drape */}
      <path d="M-260 520 Q-240 260 -60 210 L120 200 Q300 240 330 520 Z" fill="#5a3e52" />
      <path d="M-150 -120 Q-180 120 -120 230 L180 240 Q240 120 190 -60 Q160 -260 0 -270 Q-140 -260 -150 -120 Z" fill="#7a4a5a" />
      {/* face (profile left) */}
      <path d="M-120 -150 Q-150 -100 -142 -60 L-176 -20 L-140 0 Q-150 30 -132 50 Q-136 80 -110 100 Q-60 140 0 130 L40 -150 Z" fill="#b07a5e" />
      <path d="M-30 -160 Q60 -170 90 -100 L60 120 L0 130 Z" fill="#8a5a44" opacity={0.6} />
      {/* scarf front edge over the forehead and cheek */}
      <path d="M-150 -120 Q-130 -200 -60 -200 Q-110 -150 -112 -120 Q-100 -40 -30 120 L-60 160 Q-140 60 -150 -120 Z" fill="#6a3e4e" />
      {/* half-closed eye + brow */}
      <path d={`M-118 ${-62} Q-100 ${-62 + 10 * eyes} -82 ${-60}`} stroke="#2a1d18" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M-122 -66 Q-100 -76 -78 -66" fill="#8a5a44" opacity={0.6} />
      <path d="M-128 -92 Q-104 -100 -80 -92" stroke="#3a2420" strokeWidth={5} fill="none" />
      <path d="M-140 58 Q-128 62 -118 58" stroke="#7a4a3a" strokeWidth={4} fill="none" />
      {/* warm dusk rim */}
      <path d="M190 -60 Q160 -260 0 -270 Q-140 -260 -150 -120" stroke="#ffb07a" strokeOpacity={0.75} strokeWidth={8} fill="none" />
      <path d="M-176 -20 L-140 0 Q-150 30 -132 50" stroke="#ffd0a0" strokeOpacity={0.5} strokeWidth={4} fill="none" />
    </g>
  );
};
