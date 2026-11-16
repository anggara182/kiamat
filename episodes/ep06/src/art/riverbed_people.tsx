import React from 'react';

/** EP06 riverbed people (new characters). Poses take values from the ON-TWOS clock. */
type Pt = [number, number];
const limb = (a: Pt, b: Pt, c: Pt, w: number, col: string) => <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}`} stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />;

/** father seen from behind lifting a boy onto his shoulders; lift 0..1 */
export const FatherBoy: React.FC<{ x: number; y: number; h: number; lift: number; sw: number }> = ({ x, y, h, lift, sw }) => {
  const u = h / 7; const shY = y - h * 0.8; const ox = Math.sin(sw) * u * 0.04;
  const cy = shY - u * (0.2 + 1.6 * lift) + (1 - lift) * u * 2.6;
  const cx = x + ox + (1 - lift) * u * 1.3;
  const cu = u * 0.72;
  return (
    <g>
      <g>
        <path d={`M${cx - cu * 0.7} ${cy} L${cx - cu * 0.6} ${cy - cu * 1.6} Q${cx} ${cy - cu * 1.8} ${cx + cu * 0.6} ${cy - cu * 1.6} L${cx + cu * 0.7} ${cy} Z`} fill="#3e6a8a" />
        {limb([cx - cu * 0.5, cy], [cx - cu * 1.0, cy + cu * 0.8 * lift + cu * 0.4], [cx - cu * 0.9, cy + cu * 1.6], cu * 0.3, '#5a4a3a')}
        {limb([cx + cu * 0.5, cy], [cx + cu * 1.0, cy + cu * 0.8 * lift + cu * 0.4], [cx + cu * 0.9, cy + cu * 1.6], cu * 0.3, '#5a4a3a')}
        <ellipse cx={cx} cy={cy - cu * 2.15} rx={cu * 0.55} ry={cu * 0.6} fill="#1d1a1a" />
      </g>
      <path d={`M${x + ox - u * 0.6} ${y - h * 0.47} L${x + ox + u * 0.6} ${y - h * 0.47} L${x + ox + u * 0.5} ${y} L${x + ox - u * 0.5} ${y} Z`} fill="#4a4038" />
      <path d={`M${x + ox - u} ${shY + u * 0.1} Q${x + ox} ${shY - u * 0.15} ${x + ox + u} ${shY + u * 0.1} L${x + ox + u * 0.75} ${y - h * 0.44} L${x + ox - u * 0.75} ${y - h * 0.44} Z`} fill="#d8ccb4" />
      <path d={`M${x + ox + u * 0.1} ${shY} Q${x + ox + u * 0.8} ${shY} ${x + ox + u} ${shY + u * 0.1} L${x + ox + u * 0.75} ${y - h * 0.44} L${x + ox + u * 0.2} ${y - h * 0.44} Z`} fill="#a89c84" opacity={0.6} />
      {limb([x + ox - u * 0.9, shY + u * 0.15], [x + ox - u * 1.2, shY - u * 0.4 * lift + u * 0.6], [cx - cu * 0.8, cy + cu * 0.9], u * 0.28, '#d8ccb4')}
      {limb([x + ox + u * 0.9, shY + u * 0.15], [x + ox + u * 1.2, shY - u * 0.4 * lift + u * 0.6], [cx + cu * 0.8, cy + cu * 0.9], u * 0.28, '#a89c84')}
      <rect x={x + ox - u * 0.15} y={shY - u * 0.3} width={u * 0.3} height={u * 0.35} fill="#7a4f3e" />
      <ellipse cx={x + ox} cy={shY - u * 0.6} rx={u * 0.42} ry={u * 0.5} fill="#1d1a1a" />
      <path d={`M${x + ox - u * 0.45} ${shY - u * 0.85} Q${x + ox} ${shY - u * 1.25} ${x + ox + u * 0.45} ${shY - u * 0.85} L${x + ox + u * 0.42} ${shY - u * 0.7} L${x + ox - u * 0.42} ${shY - u * 0.7} Z`} fill="#e8e2d2" />
    </g>
  );
};

/** young boatman, side view facing right; ph: 0 crouched on the deck .. 1 landed (knees bent); fully on twos via caller */
export const Boatman: React.FC<{ x: number; y: number; h: number; crouch: number }> = ({ x, y, h, crouch }) => {
  const u = h / 7; const c = crouch;
  const hipY = y - h * (0.48 - 0.12 * c);
  const shY = hipY - h * 0.33 + u * 0.3 * c;
  const shX = x + u * 0.35 * c;
  const shirt = '#c9584a', pants = '#3e4a5a', skin = '#8a5a44';
  return (
    <g>
      {limb([x - u * 0.15, hipY], [x - u * (0.2 - 0.6 * c), y - h * (0.24 - 0.04 * c)], [x - u * 0.4, y], u * 0.34, pants)}
      {limb([x + u * 0.15, hipY], [x + u * (0.3 + 0.5 * c), y - h * (0.26 - 0.06 * c)], [x + u * 0.45, y], u * 0.34, pants)}
      <path d={`M${x - u * 0.7} ${y} h${u * 0.5} M${x + u * 0.3} ${y} h${u * 0.5}`} stroke={skin} strokeWidth={u * 0.18} />
      <path d={`M${x - u * 0.4} ${hipY + u * 0.1} L${shX - u * 0.4} ${shY} Q${shX + u * 0.1} ${shY - u * 0.2} ${shX + u * 0.5} ${shY + u * 0.1} L${x + u * 0.45} ${hipY + u * 0.1} Z`} fill={shirt} />
      {limb([shX + u * 0.2, shY + u * 0.2], [shX + u * (0.7 + 0.2 * c), shY + u * (0.6 - 0.9 * (1 - c))], [shX + u * (1.1 + 0.3 * c), shY + u * (0.2 - 1.0 * (1 - c))], u * 0.26, shirt)}
      {limb([shX - u * 0.3, shY + u * 0.2], [shX - u * (0.8 - 0.1 * c), shY + u * (0.5 - 0.7 * (1 - c))], [shX - u * (1.0 + 0.2 * c), shY + u * (0.1 - 0.9 * (1 - c))], u * 0.26, '#a8483c')}
      <rect x={shX - u * 0.05} y={shY - u * 0.28} width={u * 0.3} height={u * 0.32} fill={skin} />
      <ellipse cx={shX + u * 0.2} cy={shY - u * 0.62} rx={u * 0.4} ry={u * 0.48} fill={skin} />
      <path d={`M${shX - u * 0.2} ${shY - u * 0.7} Q${shX - u * 0.15} ${shY - u * 1.2} ${shX + u * 0.3} ${shY - u * 1.12} Q${shX + u * 0.6} ${shY - u * 1.05} ${shX + u * 0.58} ${shY - u * 0.85} Q${shX + u * 0.2} ${shY - u * 0.9} ${shX - u * 0.2} ${shY - u * 0.7} Z`} fill="#1a1210" />
      <path d={`M${shX + u * 0.58} ${shY - u * 0.7} l${u * 0.12} ${u * 0.14} l${-u * 0.12} ${u * 0.04}`} fill={skin} />
    </g>
  );
};

/** old man in a white cap and beard, small; turn 0 = side view looking down at the bed, 1 = back turned walking away */
export const CapOldMan: React.FC<{ x: number; y: number; h: number; turn: number; step: number; rim: string }> = ({ x, y, h, turn, step, rim }) => {
  const u = h / 7; const back = turn > 0.5;
  const shY = y - h * 0.78; const lean = back ? 0 : u * 0.15;
  const robe = '#7a8498', robeD = '#3e4456';
  return (
    <g transform={`translate(${-step * u * 0.6} 0)`}>
      <path d={`M${x - u * 0.75} ${shY + u * 0.15} Q${x + lean} ${shY - u * 0.15} ${x + u * 0.75} ${shY + u * 0.15} L${x + u * 0.65} ${y} L${x - u * 0.6} ${y} Z`} fill={robe} />
      <path d={`M${x + u * 0.1} ${shY} Q${x + u * 0.6} ${shY} ${x + u * 0.7} ${shY + u * 0.15} L${x + u * 0.85} ${y} L${x + u * 0.2} ${y} Z`} fill={robeD} opacity={0.7} />
      <path d={`M${x + u * 0.6} ${shY + u * 0.25} L${x + u * (back ? 0.75 : 0.9)} ${shY + u * 1.5}`} stroke={robeD} strokeWidth={u * 0.24} strokeLinecap="round" />
      <path d={`M${x - u * 0.6} ${shY + u * 0.25} L${x - u * 0.75} ${shY + u * 1.5}`} stroke={robe} strokeWidth={u * 0.24} strokeLinecap="round" />
      <ellipse cx={x + lean + (back ? 0 : u * 0.1)} cy={shY - u * 0.55} rx={u * 0.38} ry={u * 0.46} fill={back ? '#2a2e3a' : '#5a4a44'} />
      {!back && <path d={`M${x + lean + u * 0.38} ${shY - u * 0.45} Q${x + lean + u * 0.5} ${shY - u * 0.05} ${x + lean + u * 0.1} ${shY + u * 0.05} L${x + lean} ${shY - u * 0.3} Z`} fill="#e8ecf2" />}
      <path d={`M${x + lean - u * 0.38} ${shY - u * 0.62} Q${x + lean} ${shY - u * 1.1} ${x + lean + u * 0.38} ${shY - u * 0.62} Z`} fill="#f2f4f8" />
      <path d={`M${x - u * 0.7} ${shY + u * 0.15} Q${x + lean} ${shY - u * 0.15} ${x + u * 0.7} ${shY + u * 0.15}`} stroke={rim} strokeOpacity={0.7} strokeWidth={u * 0.06} fill="none" />
      {[0, 1, 2, 3, 4].map((i) => !back && <circle key={i} cx={x + u * (0.5 + 0.04 * i)} cy={shY + u * (1.4 + 0.12 * i)} r={u * 0.04} fill="#6a5a4a" />)}
    </g>
  );
};

/** small villager (standing / sitting) with optional lowered shovel; low detail, readable silhouette */
export const Villager: React.FC<{ x: number; y: number; h: number; body: string; head: string; scarf?: boolean; shovel?: boolean; sit?: boolean; sw: number; shadow?: number }> = ({ x, y, h, body, head, scarf, shovel, sit, sw, shadow = 0 }) => {
  const u = h / 7; const ox = Math.sin(sw) * u * 0.05; const shY = y - h * (sit ? 0.55 : 0.8);
  return (
    <g>
      {shadow > 0 && <path d={`M${x - u * 0.5} ${y} L${x + u * 0.5} ${y} L${x + u * 0.5 + shadow} ${y + u * 0.6} L${x - u * 0.5 + shadow} ${y + u * 0.6} Z`} fill="#2a1a10" opacity={0.3} />}
      {sit ? <path d={`M${x + ox - u * 0.7} ${y} L${x + ox - u * 0.6} ${y - h * 0.25} L${x + ox + u * 1.6} ${y - h * 0.22} L${x + ox + u * 1.7} ${y} Z`} fill={body} opacity={0.85} />
        : <path d={`M${x + ox - u * 0.55} ${y - h * 0.47} L${x + ox + u * 0.55} ${y - h * 0.47} L${x + ox + u * 0.45} ${y} L${x + ox - u * 0.45} ${y} Z`} fill={body} opacity={0.85} />}
      <path d={`M${x + ox - u * 0.85} ${shY + u * 0.1} Q${x + ox} ${shY - u * 0.15} ${x + ox + u * 0.85} ${shY + u * 0.1} L${x + ox + u * 0.65} ${shY + h * 0.35} L${x + ox - u * 0.65} ${shY + h * 0.35} Z`} fill={body} />
      {shovel && <g><path d={`M${x + ox + u * 0.9} ${shY + u * 1.4} L${x + ox + u * 1.3} ${y}`} stroke="#4a3220" strokeWidth={u * 0.12} /><path d={`M${x + ox + u * 1.15} ${y - u * 0.4} l${u * 0.35} ${u * 0.05} l-${u * 0.05} ${u * 0.4} l-${u * 0.3} 0 Z`} fill="#4a4448" /></g>}
      <path d={`M${x + ox + u * 0.8} ${shY + u * 0.15} L${x + ox + u * 0.95} ${shY + u * 1.4}`} stroke={body} strokeWidth={u * 0.26} strokeLinecap="round" />
      <path d={`M${x + ox - u * 0.8} ${shY + u * 0.15} L${x + ox - u * 0.95} ${shY + u * 1.4}`} stroke={body} strokeWidth={u * 0.26} strokeLinecap="round" />
      {scarf ? <g><path d={`M${x + ox - u * 0.5} ${shY - u * 0.55} Q${x + ox - u * 0.6} ${shY + u * 0.1} ${x + ox - u * 0.85} ${shY + u * 0.3} L${x + ox + u * 0.85} ${shY + u * 0.3} Q${x + ox + u * 0.6} ${shY + u * 0.1} ${x + ox + u * 0.5} ${shY - u * 0.55} Z`} fill="#5a3a3a" /><ellipse cx={x + ox} cy={shY - u * 0.6} rx={u * 0.48} ry={u * 0.55} fill="#5a3a3a" /><ellipse cx={x + ox} cy={shY - u * 0.56} rx={u * 0.28} ry={u * 0.35} fill={head} /></g>
        : <g><ellipse cx={x + ox} cy={shY - u * 0.6} rx={u * 0.4} ry={u * 0.48} fill={head} /><path d={`M${x + ox - u * 0.42} ${shY - u * 0.65} Q${x + ox} ${shY - u * 1.25} ${x + ox + u * 0.42} ${shY - u * 0.65} Z`} fill="#1d1a1a" /></g>}
    </g>
  );
};

/** old woman kneeling, palm on the gold (side view facing right); press 0..1 */
export const KneelWoman: React.FC<{ x: number; y: number; h: number; press: number; br: number }> = ({ x, y, h, press, br }) => {
  const u = h / 7; const b = Math.sin(br) * u * 0.03;
  const hip: Pt = [x, y - u * 1.4]; const sh: Pt = [x + u * 0.8, y - u * 3.6 - b + u * 0.2 * press];
  const hand: Pt = [x + u * (2.0 + 0.2 * press), y - u * 0.05];
  return (
    <g>
      <path d={`M${x - u * 1.0} ${y} Q${x - u * 1.1} ${y - u * 1.4} ${hip[0]} ${hip[1]} L${x + u * 1.0} ${y - u * 0.4} L${x + u * 0.9} ${y} Z`} fill="#3a4a5a" />
      <path d={`M${hip[0] - u * 0.6} ${hip[1] + u * 0.2} L${sh[0] - u * 0.6} ${sh[1]} Q${sh[0]} ${sh[1] - u * 0.3} ${sh[0] + u * 0.6} ${sh[1] + u * 0.2} L${hip[0] + u * 0.7} ${hip[1] + u * 0.2} Z`} fill="#3a4a5a" />
      {limb([sh[0] + u * 0.3, sh[1] + u * 0.3], [sh[0] + u * 0.9, sh[1] + u * 1.6], hand, u * 0.26, '#3a4a5a')}
      <path d={`M${hand[0] - u * 0.2} ${hand[1]} l${u * 0.55} ${-u * 0.04} l0 ${u * 0.08} l${-u * 0.55} ${u * 0.04} Z`} fill="#8a5a44" />
      <path d={`M${sh[0] - u * 0.55} ${sh[1] - u * 0.5} Q${sh[0] - u * 0.6} ${sh[1] + u * 0.3} ${sh[0] - u * 0.9} ${sh[1] + u * 0.5} L${sh[0] + u * 0.8} ${sh[1] + u * 0.4} Q${sh[0] + u * 0.6} ${sh[1]} ${sh[0] + u * 0.5} ${sh[1] - u * 0.5} Z`} fill="#2a2228" />
      <ellipse cx={sh[0] + u * 0.05} cy={sh[1] - u * 0.6} rx={u * 0.48} ry={u * 0.55} fill="#2a2228" />
      <ellipse cx={sh[0] + u * 0.3} cy={sh[1] - u * 0.5} rx={u * 0.18} ry={u * 0.3} fill="#8a5a44" />
      {press > 0.5 && <ellipse cx={hand[0] + u * 0.1} cy={hand[1] + u * 0.05} rx={u * 0.6} ry={u * 0.12} fill="#fff6d0" opacity={0.5} />}
    </g>
  );
};

/** kid sliding down on the seat (side view), heading dir; arms up */
export const SlideKid: React.FC<{ x: number; y: number; h: number; ang: number; col: string; ph: number }> = ({ x, y, h, ang, col, ph }) => {
  const u = h / 5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <path d={`M${-u * 0.6} 0 L${u * 1.2} 0 L${u * 1.2} ${-u * 0.4} L${-u * 0.2} ${-u * 0.5} Z`} fill="#3a3a44" />
      <path d={`M${-u * 0.6} ${-u * 0.3} L${-u * 0.4} ${-u * 1.8} L${u * 0.3} ${-u * 1.8} L${u * 0.2} ${-u * 0.3} Z`} fill={col} />
      {limb([-u * 0.2, -u * 1.6], [-u * 0.5, -u * (2.3 + 0.1 * Math.sin(ph))], [-u * 0.2, -u * (2.9 + 0.15 * Math.sin(ph))], u * 0.22, col)}
      {limb([u * 0.1, -u * 1.6], [u * 0.5, -u * (2.3 + 0.1 * Math.cos(ph))], [u * 0.8, -u * (2.8 + 0.15 * Math.cos(ph))], u * 0.22, col)}
      <circle cx={-u * 0.05} cy={-u * 2.25} r={u * 0.42} fill="#8a5a44" />
      <path d={`M${-u * 0.45} ${-u * 2.35} Q${-u * 0.05} ${-u * 2.9} ${u * 0.38} ${-u * 2.35} Z`} fill="#1d1a1a" />
    </g>
  );
};

/** the girl (9, two braids) with her small goat, front-ish; sw breathing, goat nods */
export const GirlGoat: React.FC<{ x: number; y: number; h: number; sw: number; rim: string }> = ({ x, y, h, sw, rim }) => {
  const u = h / 5.5; const ox = Math.sin(sw) * u * 0.05; const shY = y - h * 0.74;
  const goatX = x + u * 2.0, gy = y;
  return (
    <g>
      {/* goat */}
      <g transform={`translate(${goatX} ${gy})`}>
        <path d={`M${-u * 1.0} ${-u * 0.6} Q${-u * 0.2} ${-u * 1.3} ${u * 0.8} ${-u * 0.9} L${u * 0.8} ${-u * 0.4} Q0 ${-u * 0.2} ${-u * 1.0} ${-u * 0.4} Z`} fill="#e8e2d2" />
        {[-0.8, -0.4, 0.4, 0.7].map((k) => <rect key={k} x={u * k - u * 0.06} y={-u * 0.55} width={u * 0.12} height={u * 0.55} fill="#bdb6a6" />)}
        <g transform={`rotate(${Math.sin(sw * 1.7) * 8} ${-u * 0.9} ${-u * 0.9})`}>
          <ellipse cx={-u * 1.2} cy={-u * 1.15} rx={u * 0.35} ry={u * 0.28} fill="#e8e2d2" />
          <path d={`M${-u * 1.05} ${-u * 1.38} q${u * 0.1} -${u * 0.25} ${u * 0.3} -${u * 0.3}`} stroke="#8a7a62" strokeWidth={u * 0.06} fill="none" />
          <path d={`M${-u * 1.0} ${-u * 1.2} l${u * 0.3} ${u * 0.1}`} stroke="#bdb6a6" strokeWidth={u * 0.12} strokeLinecap="round" />
        </g>
        <path d={`M${-u * 1.0} ${-u * 0.6} Q${-u * 0.2} ${-u * 1.3} ${u * 0.8} ${-u * 0.9}`} stroke={rim} strokeOpacity={0.7} strokeWidth={u * 0.05} fill="none" />
      </g>
      {/* girl */}
      <path d={`M${x + ox - u * 0.75} ${y} L${x + ox - u * 0.55} ${shY + u * 0.3} Q${x + ox} ${shY - u * 0.05} ${x + ox + u * 0.55} ${shY + u * 0.3} L${x + ox + u * 0.75} ${y} Z`} fill="#b84a5a" />
      {limb([x + ox + u * 0.5, shY + u * 0.35], [x + ox + u * 0.9, shY + u * 1.1], [goatX - u * 0.4, gy - u * 1.0], u * 0.22, '#8a5a44')}
      {limb([x + ox - u * 0.5, shY + u * 0.35], [x + ox - u * 0.75, shY + u * 1.2], [x + ox - u * 0.65, shY + u * 1.9], u * 0.22, '#8a5a44')}
      <rect x={x + ox - u * 0.12} y={shY - u * 0.25} width={u * 0.24} height={u * 0.3} fill="#7a4f3e" />
      <ellipse cx={x + ox} cy={shY - u * 0.62} rx={u * 0.45} ry={u * 0.52} fill="#8a5a44" />
      <path d={`M${x + ox - u * 0.47} ${shY - u * 0.6} Q${x + ox} ${shY - u * 1.4} ${x + ox + u * 0.47} ${shY - u * 0.6} Q${x + ox} ${shY - u * 0.95} ${x + ox - u * 0.47} ${shY - u * 0.6} Z`} fill="#1d1a1a" />
      {[-1, 1].map((sd) => <path key={sd} d={`M${x + ox + sd * u * 0.42} ${shY - u * 0.55} q${sd * u * 0.18} ${u * 0.4} ${sd * u * 0.08} ${u * 0.95}`} stroke="#1d1a1a" strokeWidth={u * 0.14} strokeLinecap="round" fill="none" />)}
      {[-1, 1].map((sd) => <circle key={`r${sd}`} cx={x + ox + sd * u * 0.5} cy={shY + u * 0.42} r={u * 0.07} fill="#d9a441" />)}
      {[-0.17, 0.17].map((dx) => <circle key={dx} cx={x + ox + u * dx} cy={shY - u * 0.62} r={u * 0.05} fill="#2a1a10" />)}
      <path d={`M${x + ox - u * 0.47} ${shY - u * 0.6} Q${x + ox} ${shY - u * 1.4} ${x + ox + u * 0.47} ${shY - u * 0.6}`} stroke={rim} strokeOpacity={0.75} strokeWidth={u * 0.06} fill="none" />
    </g>
  );
};

/** small bank-top spectator facing the bed centre (dir: +1 faces right). point 0..1 raises an arm toward the glint. */
export const BankPerson: React.FC<{ x: number; y: number; h: number; dir: 1 | -1; body: string; head: string; scarf: boolean; point: number; sw: number }> = ({ x, y, h, dir, body, head, scarf, point, sw }) => {
  const u = h / 7; const ox = Math.sin(sw) * u * 0.08; const shY = y - h * 0.78; const cx = x + ox;
  return (
    <g>
      <path d={`M${cx - u * 0.55} ${y} L${cx - u * 0.75} ${shY + u * 0.2} Q${cx} ${shY - u * 0.15} ${cx + u * 0.75} ${shY + u * 0.2} L${cx + u * 0.55} ${y} Z`} fill={body} />
      {point > 0.01 && <path d={`M${cx + dir * u * 0.6} ${shY + u * 0.25} L${cx + dir * u * (1.0 + 0.8 * point)} ${shY + u * (0.6 - 0.9 * point)} L${cx + dir * u * (1.3 + 1.3 * point)} ${shY + u * (0.9 - 1.6 * point)}`} stroke={body} strokeWidth={u * 0.28} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
      {scarf ? <g><path d={`M${cx - u * 0.48} ${shY - u * 0.5} Q${cx - u * 0.6} ${shY + u * 0.1} ${cx - u * 0.8} ${shY + u * 0.3} L${cx + u * 0.8} ${shY + u * 0.3} Q${cx + u * 0.6} ${shY + u * 0.1} ${cx + u * 0.48} ${shY - u * 0.5} Z`} fill="#4a3434" /><ellipse cx={cx} cy={shY - u * 0.58} rx={u * 0.48} ry={u * 0.54} fill="#4a3434" /><ellipse cx={cx + dir * u * 0.15} cy={shY - u * 0.55} rx={u * 0.24} ry={u * 0.33} fill={head} /></g>
        : <g><rect x={cx - u * 0.13} y={shY - u * 0.25} width={u * 0.26} height={u * 0.3} fill={head} /><ellipse cx={cx} cy={shY - u * 0.6} rx={u * 0.42} ry={u * 0.5} fill={head} /><path d={`M${cx - u * 0.44} ${shY - u * 0.62} Q${cx - dir * u * 0.1} ${shY - u * 1.2} ${cx + u * 0.44} ${shY - u * 0.72} Q${cx - dir * u * 0.2} ${shY - u * 0.85} ${cx - u * 0.44} ${shY - u * 0.62} Z`} fill="#1d1a1a" /></g>}
    </g>
  );
};

/** man from behind (three-quarter, turned left toward the glint) with a boy sitting on his shoulders.
 *  lift 0..1: the boy is raised from his side onto his shoulders; point 0..1: the boy's arm points ahead-left. */
export const ShoulderRide: React.FC<{ x: number; y: number; h: number; lift: number; point: number; sw: number }> = ({ x, y, h, lift, point, sw }) => {
  const u = h / 7; const ox = Math.sin(sw) * u * 0.04; const k = lift;
  const mx = x + ox; const shY = y - h * 0.8;
  const headX = mx - u * 0.38, headY = shY - u * 0.58;
  const cu = u * 0.78; // boy unit
  // boy hips: seated on the shoulders behind the head (k = 1), or held at the man's right side (k = 0)
  const hipX = mx + u * 0.3 + u * 1.2 * (1 - k), hipY = shY - u * 0.5 + u * 2.2 * (1 - k);
  const bShY = hipY - cu * 1.5;
  const shinL: [number, number] = [mx - u * 0.72, shY + u * 0.95], shinR: [number, number] = [mx + u * 0.62, shY + u * 0.95];
  const kneeL: [number, number] = [mx - u * 0.75, shY - u * 0.05], kneeR: [number, number] = [mx + u * 0.75, shY - u * 0.05];
  const handL: [number, number] = k > 0.5 ? [shinL[0] + u * 0.05, shinL[1] - u * 0.2] : [hipX - cu * 0.7, hipY - cu * 0.3];
  const handR: [number, number] = k > 0.5 ? [shinR[0] - u * 0.05, shinR[1] - u * 0.2] : [hipX + cu * 0.7, hipY - cu * 0.3];
  const shirt = '#d8ccb4', shirtD = '#a89c84', pants = '#4a4038', skin = '#7a4f3e';
  return (
    <g>
      {/* boy's shins hanging down the man's chest (seated) */}
      {k > 0.5 && <g>
        {limb([hipX - cu * 0.4, hipY], kneeL, shinL, cu * 0.3, '#5a4a3a')}
        {limb([hipX + cu * 0.4, hipY], kneeR, shinR, cu * 0.3, '#5a4a3a')}
        <ellipse cx={shinL[0]} cy={shinL[1] + cu * 0.15} rx={cu * 0.2} ry={cu * 0.13} fill="#2a2420" />
        <ellipse cx={shinR[0]} cy={shinR[1] + cu * 0.15} rx={cu * 0.2} ry={cu * 0.13} fill="#2a2420" />
      </g>}
      {/* man */}
      <path d={`M${mx - u * 0.6} ${y - h * 0.47} L${mx + u * 0.6} ${y - h * 0.47} L${mx + u * 0.5} ${y} L${mx - u * 0.5} ${y} Z`} fill={pants} />
      <path d={`M${mx - u} ${shY + u * 0.1} Q${mx} ${shY - u * 0.15} ${mx + u} ${shY + u * 0.1} L${mx + u * 0.75} ${y - h * 0.44} L${mx - u * 0.75} ${y - h * 0.44} Z`} fill={shirt} />
      <path d={`M${mx + u * 0.1} ${shY} Q${mx + u * 0.8} ${shY} ${mx + u} ${shY + u * 0.1} L${mx + u * 0.75} ${y - h * 0.44} L${mx + u * 0.2} ${y - h * 0.44} Z`} fill={shirtD} opacity={0.6} />
      {limb([mx - u * 0.9, shY + u * 0.15], [mx - u * 1.25, shY + u * 0.95], handL, u * 0.28, shirt)}
      {limb([mx + u * 0.9, shY + u * 0.15], [mx + u * 1.25, shY + u * 0.95], handR, u * 0.28, shirtD)}
      <ellipse cx={handL[0]} cy={handL[1]} rx={u * 0.17} ry={u * 0.15} fill={skin} />
      <ellipse cx={handR[0]} cy={handR[1]} rx={u * 0.17} ry={u * 0.15} fill={skin} />
      {/* boy (back view): thighs over the shoulders, torso, head, pointing arm */}
      {k <= 0.5 && <g>{limb([hipX - cu * 0.3, hipY], [hipX - cu * 0.4, hipY + cu * 0.9], [hipX - cu * 0.3, hipY + cu * 1.7], cu * 0.3, '#5a4a3a')}{limb([hipX + cu * 0.3, hipY], [hipX + cu * 0.5, hipY + cu * 0.8], [hipX + cu * 0.4, hipY + cu * 1.6], cu * 0.3, '#5a4a3a')}</g>}
      {k > 0.5 && <g>{limb([hipX - cu * 0.45, hipY + cu * 0.1], [kneeL[0], kneeL[1]], kneeL, cu * 0.34, '#5a4a3a')}{limb([hipX + cu * 0.45, hipY + cu * 0.1], [kneeR[0], kneeR[1]], kneeR, cu * 0.34, '#5a4a3a')}</g>}
      <path d={`M${hipX - cu * 0.62} ${hipY + cu * 0.15} L${hipX - cu * 0.62} ${bShY + cu * 0.2} Q${hipX} ${bShY - cu * 0.15} ${hipX + cu * 0.62} ${bShY + cu * 0.2} L${hipX + cu * 0.62} ${hipY + cu * 0.15} Z`} fill="#3e6a8a" />
      {limb([hipX + cu * 0.55, bShY + cu * 0.25], [hipX + cu * 0.9, bShY + cu * 0.9], [hipX + cu * 0.7, bShY + cu * 1.3], cu * 0.24, '#3e6a8a')}
      {limb([hipX - cu * 0.55, bShY + cu * 0.25], [hipX - cu * (0.9 + 0.6 * point), bShY + cu * (0.8 - 1.3 * point)], [hipX - cu * (1.0 + 1.5 * point), bShY + cu * (1.3 - 2.0 * point)], cu * 0.24, '#3e6a8a')}
      <ellipse cx={hipX - cu * (1.0 + 1.5 * point)} cy={bShY + cu * (1.3 - 2.0 * point)} rx={cu * 0.14} ry={cu * 0.12} fill={skin} />
      <rect x={hipX - cu * 0.13} y={bShY - cu * 0.3} width={cu * 0.26} height={cu * 0.35} fill={skin} />
      <ellipse cx={hipX - cu * 0.05} cy={bShY - cu * 0.62} rx={cu * 0.5} ry={cu * 0.56} fill="#1d1a1a" />
      <rect x={headX - u * 0.15} y={shY - u * 0.3} width={u * 0.3} height={u * 0.35} fill={skin} />
      <ellipse cx={headX} cy={headY} rx={u * 0.42} ry={u * 0.5} fill="#1d1a1a" />
      <ellipse cx={headX - u * 0.36} cy={headY + u * 0.05} rx={u * 0.08} ry={u * 0.14} fill={skin} />
      <path d={`M${headX - u * 0.45} ${headY - u * 0.25} Q${headX} ${headY - u * 0.65} ${headX + u * 0.45} ${headY - u * 0.25} L${headX + u * 0.42} ${headY - u * 0.1} L${headX - u * 0.42} ${headY - u * 0.1} Z`} fill="#e8e2d2" />
    </g>
  );
};
