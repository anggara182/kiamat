import React from 'react';

/* ------------------------------------------------------------------------------------------
 * People for the street set (VISUAL-STYLE §5): head ~1/7 of the body, neck, torso with
 * shoulders wider than the waist, tapered limbs with elbow/knee bends, mitten hands.
 * Local units: a standing adult is 100 tall, feet at y=0, facing +x. Scale with h (px).
 * Joint angles in degrees from straight down, positive = forward (toward the facing side).
 * Drive the pose from the ON-TWOS clock (t2 / p2) in the shots.
 * ---------------------------------------------------------------------------------------- */
export type Pose = {
  hip?: [number, number]; // hip position (standing default 0,-49)
  lean?: number; // spine lean (deg, + forward)
  head?: number; // extra head tilt (deg, + = looking down/forward)
  thA: number; shA: number; thB: number; shB: number; // thigh/shin near (A) and far (B) leg
  uaA: number; faA: number; uaB: number; faB: number; // upper/fore arm near (A) and far (B)
  bob?: number; // vertical body bob (units)
  breath?: number; // shoulder rise (units)
};
export type Look = {
  body: string; // main silhouette colour (near limbs, torso)
  far?: string; // far limbs (darker)
  skin?: string; // head/hands (defaults to body)
  rim?: string; rimO?: number; // optional rim along the back/top
  hat?: 'peci' | 'hardhat' | 'hijab' | 'cap' | 'helmet' | null;
  hatCol?: string;
  skirt?: boolean; // long skirt (replaces the leg silhouette, legs show below the hem)
  phone?: boolean; // phone in the near hand, screen glow
  bag?: 'back' | 'shoulder' | null;
  bagCol?: string;
  vest?: string; // hi-vis vest colour (worker)
};

const rad = (d: number) => (d * Math.PI) / 180;
const seg = (x: number, y: number, ang: number, len: number): [number, number] => [x + Math.sin(rad(ang)) * len, y + Math.cos(rad(ang)) * len];

/** walking gait for phase ph (radians), optionally with the near forearm raised to a phone */
export const walkPose = (ph: number, phone = false, stride = 1): Pose => {
  const s = Math.sin(ph), c = Math.cos(ph);
  const thA = 24 * s * stride, thB = -24 * s * stride;
  const shA = thA - 42 * Math.max(0, -c) ** 1.4 * stride - 4, shB = thB - 42 * Math.max(0, c) ** 1.4 * stride - 4;
  return {
    lean: 4 + (phone ? 4 : 0), head: phone ? 24 : 2, bob: -Math.abs(c) * 1.4,
    thA, shA, thB, shB,
    uaA: phone ? 14 : -18 * s, faA: phone ? 118 : -18 * s + 22,
    uaB: phone ? 22 + 8 * s : 18 * s, faB: phone ? 112 : 18 * s + 22,
  };
};

export const Figure: React.FC<{ x: number; y: number; h: number; dir?: number; pose: Pose; look: Look; opacity?: number }> = ({ x, y, h, dir = 1, pose, look, opacity = 1 }) => {
  const s = h / 100;
  const P = pose;
  const bob = P.bob ?? 0, br = P.breath ?? 0;
  const hip: [number, number] = [P.hip?.[0] ?? 0, (P.hip?.[1] ?? -49) + bob];
  const lean = P.lean ?? 0;
  const sh = seg(hip[0], hip[1], 180 - lean, 33 + br);
  const neck = seg(sh[0], sh[1], 180 - lean, 3.5);
  const hd = seg(neck[0], neck[1], 180 - lean - (P.head ?? 0) * 0.6, 7.5);
  const far = look.far ?? look.body, skin = look.skin ?? look.body;
  // legs
  const leg = (th: number, shn: number, col: string, key: string) => {
    const k = seg(hip[0], hip[1], th, 24);
    const f = seg(k[0], k[1], shn, 24);
    return (
      <g key={key}>
        <path d={`M ${hip[0]} ${hip[1]} L ${k[0]} ${k[1]}`} stroke={col} strokeWidth={8.4} strokeLinecap="round" />
        <path d={`M ${k[0]} ${k[1]} L ${f[0]} ${f[1]}`} stroke={col} strokeWidth={6} strokeLinecap="round" />
        <path d={`M ${f[0] - 2.4} ${f[1] - 2.2} Q ${f[0] + 1} ${f[1] - 3.8} ${f[0] + 6.4} ${f[1] - 0.4} L ${f[0] + 6.4} ${f[1] + 1.2} L ${f[0] - 2.6} ${f[1] + 1.2} Z`} fill={col} />
      </g>
    );
  };
  // arms (from the shoulder), mitten hand with a thumb bump
  const arm = (ua: number, fa: number, col: string, hand: string, key: string, phone = false) => {
    const so: [number, number] = [sh[0] + 0.5, sh[1] + 2.2];
    const e = seg(so[0], so[1], ua - lean * 0.5, 15);
    const w = seg(e[0], e[1], fa - lean * 0.5, 13.5);
    const hx = seg(w[0], w[1], fa - lean * 0.5, 2.2);
    return (
      <g key={key}>
        <path d={`M ${so[0]} ${so[1]} L ${e[0]} ${e[1]}`} stroke={col} strokeWidth={5.4} strokeLinecap="round" />
        <path d={`M ${e[0]} ${e[1]} L ${w[0]} ${w[1]}`} stroke={col} strokeWidth={4.2} strokeLinecap="round" />
        <ellipse cx={hx[0]} cy={hx[1]} rx={2.7} ry={2.3} fill={hand} transform={`rotate(${-(fa - lean * 0.5)} ${hx[0]} ${hx[1]})`} />
        <circle cx={hx[0] + 1.2} cy={hx[1] - 1.8} r={1.1} fill={hand} />
        {phone && (
          <g>
            <rect x={hx[0] - 1} y={hx[1] - 5.2} width={3.2} height={6} rx={0.6} fill="#15171c" transform={`rotate(-18 ${hx[0]} ${hx[1]})`} />
            <ellipse cx={hx[0] - 1.5} cy={hx[1] - 5} rx={7} ry={6} fill="#bfe3ff" opacity={0.28} />
            <rect x={hx[0] - 0.5} y={hx[1] - 4.7} width={2.2} height={4.8} rx={0.4} fill="#cfeaff" transform={`rotate(-18 ${hx[0]} ${hx[1]})`} />
          </g>
        )}
      </g>
    );
  };
  // torso: shoulders wider than waist; side view = chest depth
  const px = Math.cos(rad(lean)), py = Math.sin(rad(lean)); // front normal of the spine
  const torso = `M ${sh[0] + px * 7} ${sh[1] + py * 7} Q ${sh[0] + px * 8.5 + 1} ${(sh[1] + hip[1]) / 2} ${hip[0] + px * 6} ${hip[1] + py * 6} L ${hip[0] - px * 6.2} ${hip[1] - py * 6.2} Q ${sh[0] - px * 7.5} ${(sh[1] + hip[1]) / 2} ${sh[0] - px * 6.5} ${sh[1] - py * 6.5} Q ${sh[0]} ${sh[1] - 3.4} ${sh[0] + px * 7} ${sh[1] + py * 7} Z`;
  const headRot = -(lean + (P.head ?? 0));
  const hat = (() => {
    const c = look.hatCol ?? look.body;
    switch (look.hat) {
      case 'peci': return <rect x={hd[0] - 5.2} y={hd[1] - 9.4} width={10} height={4.2} rx={0.6} fill={c} transform={`rotate(${headRot} ${hd[0]} ${hd[1]})`} />;
      case 'hardhat': return <g transform={`rotate(${headRot} ${hd[0]} ${hd[1]})`}><path d={`M ${hd[0] - 6.4} ${hd[1] - 3} Q ${hd[0] - 6} ${hd[1] - 11.5} ${hd[0] + 0.5} ${hd[1] - 11.2} Q ${hd[0] + 6.6} ${hd[1] - 10.6} ${hd[0] + 6.4} ${hd[1] - 3} Z`} fill={c} /><rect x={hd[0] - 7.6} y={hd[1] - 3.6} width={16.4} height={1.8} rx={0.8} fill={c} /></g>;
      case 'cap': return <g transform={`rotate(${headRot} ${hd[0]} ${hd[1]})`}><path d={`M ${hd[0] - 5.6} ${hd[1] - 3} Q ${hd[0] - 5} ${hd[1] - 9.4} ${hd[0] + 1} ${hd[1] - 8.8} Q ${hd[0] + 5.6} ${hd[1] - 8} ${hd[0] + 5.4} ${hd[1] - 3} Z`} fill={c} /><path d={`M ${hd[0] + 3} ${hd[1] - 3.6} L ${hd[0] + 10} ${hd[1] - 2.6}`} stroke={c} strokeWidth={1.6} strokeLinecap="round" /></g>;
      case 'hijab': return <path d={`M ${hd[0] - 6.4} ${hd[1] + 1} Q ${hd[0] - 7} ${hd[1] - 9.5} ${hd[0] + 0.5} ${hd[1] - 9.4} Q ${hd[0] + 7} ${hd[1] - 9} ${hd[0] + 6.6} ${hd[1] + 0.5} Q ${hd[0] + 6} ${hd[1] + 6} ${sh[0] + px * 8} ${sh[1] + py * 8 + 4} L ${sh[0] - px * 8} ${sh[1] - py * 8 + 5} Q ${hd[0] - 7.4} ${hd[1] + 6} ${hd[0] - 6.4} ${hd[1] + 1} Z`} fill={c} />;
      default: return null;
    }
  })();
  const skirt = look.skirt ? (() => {
    const ka = seg(hip[0], hip[1], P.thA, 24), kb = seg(hip[0], hip[1], P.thB, 24);
    const hemF = Math.max(ka[0], kb[0]) + 7, hemB = Math.min(ka[0], kb[0]) - 7, hemY = hip[1] + 40;
    return <path d={`M ${hip[0] - 6.5} ${hip[1] - 3} L ${hip[0] + 6.5} ${hip[1] - 3} Q ${hemF - 2} ${hip[1] + 22} ${hemF} ${hemY} L ${hemB} ${hemY} Q ${hemB + 2} ${hip[1] + 22} ${hip[0] - 6.5} ${hip[1] - 3} Z`} fill={look.body} />;
  })() : null;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(dir * s).toFixed(4)} ${s.toFixed(4)})`} opacity={opacity}>
      {arm(P.uaB, P.faB, far, far, 'ab', look.phone)}
      {leg(P.thB, P.shB, far, 'lb')}
      {look.bag === 'back' && <path d={`M ${sh[0] - px * 6} ${sh[1] - py * 6 + 2} Q ${sh[0] - px * 14} ${sh[1] + 6} ${sh[0] - px * 12} ${sh[1] + 18} L ${sh[0] - px * 5} ${sh[1] + 20} Z`} fill={look.bagCol ?? far} />}
      {leg(P.thA, P.shA, look.body, 'la')}
      {skirt}
      <path d={torso} fill={look.body} />
      {look.vest && <path d={`M ${sh[0] + px * 6} ${sh[1] + py * 6 + 3} L ${hip[0] + px * 5.4} ${hip[1] + py * 5.4 - 4} L ${hip[0] - px * 5.6} ${hip[1] - py * 5.6 - 4} L ${sh[0] - px * 5.8} ${sh[1] - py * 5.8 + 3} Z`} fill={look.vest} />}
      {look.bag === 'shoulder' && <g><path d={`M ${sh[0] + px * 5} ${sh[1] + py * 5} L ${hip[0] - px * 6} ${hip[1] - py * 6 + 2}`} stroke={look.bagCol ?? far} strokeWidth={1.2} /><rect x={hip[0] - px * 10 - 5} y={hip[1] - 4} width={10} height={9} rx={1.5} fill={look.bagCol ?? far} /></g>}
      <rect x={neck[0] - 2} y={neck[1] - 3} width={4} height={5} fill={skin} transform={`rotate(${-lean} ${neck[0]} ${neck[1]})`} />
      <ellipse cx={hd[0]} cy={hd[1]} rx={5.4} ry={6.8} fill={skin} transform={`rotate(${headRot} ${hd[0]} ${hd[1]})`} />
      {/* hair / back of the head mass (dark) unless covered */}
      {look.hat !== 'hijab' && <path d={`M ${hd[0] - 5.4} ${hd[1] + 1} Q ${hd[0] - 6} ${hd[1] - 7.4} ${hd[0] + 0.5} ${hd[1] - 6.9} Q ${hd[0] + 4.8} ${hd[1] - 6.6} ${hd[0] + 5.2} ${hd[1] - 3} Q ${hd[0]} ${hd[1] - 4.8} ${hd[0] - 3} ${hd[1] + 3} Z`} fill={far} transform={`rotate(${headRot} ${hd[0]} ${hd[1]})`} />}
      {hat}
      {arm(P.uaA, P.faA, look.body, skin, 'aa', false)}
      {look.rim && <path d={`M ${hd[0] - 4.6} ${hd[1] - 3.5} Q ${hd[0] - 1} ${hd[1] - 7.6} ${hd[0] + 3.6} ${hd[1] - 5.4} M ${sh[0] - px * 6.5} ${sh[1] - py * 6.5} Q ${sh[0] - px * 7.6} ${(sh[1] + hip[1]) / 2} ${hip[0] - px * 6.2} ${hip[1] - py * 6.2}`} stroke={look.rim} strokeWidth={1.1} fill="none" opacity={look.rimO ?? 0.8} />}
    </g>
  );
};

/** seated pose (on a bench / beam): thighs forward, shins down; hands resting on the knees */
export const seatPose = (breath = 0, headDown = 6, dangle = 0): Pose => ({
  hip: [0, -27], lean: 6, head: headDown, breath,
  thA: 86, shA: 8 + dangle, thB: 80, shB: -6 + dangle * 0.6,
  uaA: 38, faA: 74, uaB: 34, faB: 70,
});

/** back/front view walker for people moving in depth (S11 time-lapse): head, shoulders, alternating legs */
export const DepthWalker: React.FC<{ x: number; y: number; h: number; ph: number; col: string; hat?: 'hijab' | 'cap' | null; bag?: boolean; opacity?: number }> = ({ x, y, h, ph, col, hat, bag, opacity = 1 }) => {
  const s = h / 100, c = Math.sin(ph);
  const lA = Math.max(0, c) * 5, lB = Math.max(0, -c) * 5, bob = -Math.abs(Math.cos(ph)) * 1.2;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(4)})`} opacity={opacity} fill={col}>
      <path d={`M -7 ${-49 + bob} L -2 ${-49 + bob} L -2.6 ${-lA} L -7.4 ${-lA} Z`} />
      <path d={`M 2 ${-49 + bob} L 7 ${-49 + bob} L 7.4 ${-lB} L 2.6 ${-lB} Z`} />
      <path d={`M -11 ${-80 + bob} Q 0 ${-84 + bob} 11 ${-80 + bob} L 12.5 ${-58 + bob} L 7 ${-46 + bob} L -7 ${-46 + bob} L -12.5 ${-58 + bob} Z`} />
      <path d={`M -11.5 ${-78 + bob} L ${-14 - c * 1.2} ${-52 + bob} M 11.5 ${-78 + bob} L ${14 + c * 1.2} ${-52 + bob}`} stroke={col} strokeWidth={4.4} strokeLinecap="round" />
      <rect x={-2} y={-87 + bob} width={4} height={6} />
      <ellipse cx={0} cy={-92 + bob} rx={5.6} ry={6.8} />
      {hat === 'hijab' && <path d={`M -6.6 ${-90 + bob} Q -6.8 ${-101 + bob} 0 ${-100 + bob} Q 6.8 ${-101 + bob} 6.6 ${-90 + bob} Q 9 ${-80 + bob} 11 ${-76 + bob} L -11 ${-76 + bob} Q -9 ${-80 + bob} -6.6 ${-90 + bob} Z`} />}
      {hat === 'cap' && <path d={`M -6 ${-95 + bob} Q 0 ${-102 + bob} 6 ${-95 + bob} Z`} />}
      {bag && <rect x={-8} y={-78 + bob} width={16} height={20} rx={3} opacity={0.85} />}
    </g>
  );
};
