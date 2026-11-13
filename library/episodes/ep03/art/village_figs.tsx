import React from 'react';

/** Low-detail running kid silhouette (local origin = feet). */
export const Kid: React.FC<{ x: number; y: number; s: number; ph: number; dir?: 1 | -1; rim?: string }> = ({ x, y, s, ph, dir = -1, rim = '#ffb35c' }) => {
  const a = Math.sin(ph) * 28, b = -a;
  const bob = Math.abs(Math.sin(ph)) * 4;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${s * dir} ${s})`}>
      <g fill="#0d0a14">
        <path d={`M 0 -46 L ${Math.sin((a * Math.PI) / 180) * 30} 0 L ${Math.sin((a * Math.PI) / 180) * 30 + 7} 0 L 5 -46 Z`} />
        <path d={`M 0 -46 L ${Math.sin((b * Math.PI) / 180) * 30} 0 L ${Math.sin((b * Math.PI) / 180) * 30 + 7} 0 L 5 -46 Z`} />
        <path d="M -9 -48 Q -10 -80 2 -84 Q 12 -80 11 -48 Z" />
        <circle cx={3} cy={-94} r={11} />
        <path d={`M 0 -78 L ${-Math.sin((a * Math.PI) / 180) * 22} -58 L ${-Math.sin((a * Math.PI) / 180) * 22 + 4} -55 L 6 -76 Z`} />
      </g>
      <path d="M 11 -50 Q 13 -78 4 -84" stroke={rim} strokeWidth={1.6} fill="none" opacity={0.7} />
    </g>
  );
};

/** Dad silhouette walking, wok in one hand, ladle in the other (origin = feet). */
export const Dad: React.FC<{ x: number; y: number; s: number; ph: number; strike: number; walk?: number; lowered?: boolean; rim?: string }> = ({ x, y, s, ph, strike, walk = 1, lowered = false, rim = '#ffb35c' }) => {
  const sw = Math.sin(ph) * 16 * walk;
  const ink = '#0d0a14';
  const leg = (ang: number) => `rotate(${ang} 0 -92)`;
  // ladle arm angle: strike 0..1 (1 = hitting)
  const la = lowered ? -14 : -120 + strike * 55;
  const wa = lowered ? 22 : -70;
  return (
    <g transform={`translate(${x} ${y - Math.abs(Math.sin(ph)) * 3 * walk}) scale(${s})`}>
      <g fill={ink}>
        <path transform={leg(sw)} d="M -9 -92 L -11 0 L 4 0 L 3 -92 Z" />
        <path transform={leg(-sw)} d="M -3 -92 L -3 0 L 12 0 L 10 -92 Z" />
        <path d="M -16 -96 Q -22 -140 -26 -160 Q -22 -173 -6 -174 L 10 -174 Q 28 -173 30 -160 Q 24 -140 18 -96 Z" />
        <rect x={-6} y={-178} width={10} height={10} />
        <ellipse cx={0} cy={-190} rx={12} ry={14} />
        <path d="M -14 -196 Q 0 -212 14 -196 Z" />
        {/* wok arm (left) */}
        <g transform={`rotate(${wa} -12 -164)`}>
          <path d="M -24 -168 Q -30 -140 -22 -128 Q -16 -118 -12 -110 L -4 -112 Q -8 -126 -12 -136 Q -10 -150 -8 -168 Z" />
          <path d="M -40 -112 Q -8 -84 24 -112 Z" />
        </g>
        {/* ladle arm (right) */}
        <g transform={`rotate(${la} 14 -164)`}>
          <path d="M 12 -168 Q 10 -150 14 -136 Q 12 -124 12 -112 L 21 -112 Q 22 -126 24 -136 Q 30 -150 28 -168 Z" />
          <path d="M 15 -112 L 16 -78 L 18 -78 L 17 -112 Z" />
          <ellipse cx={17} cy={-74} rx={6} ry={4} />
        </g>
      </g>
      <g transform={`rotate(${la} 14 -164)`}><path d="M 28 -166 Q 30 -150 24 -136 Q 22 -126 21 -112" stroke={rim} strokeWidth={1.2} fill="none" opacity={0.7} /></g>
      <path d="M 18 -98 Q 24 -140 30 -160 Q 26 -172 10 -174 M 12 -200 Q 14 -190 11 -178" stroke={rim} strokeWidth={1.6} fill="none" opacity={0.8} />
    </g>
  );
};

/** Low-detail running mom (origin = feet), facing away, shrinking into depth. */
export const MomRun: React.FC<{ x: number; y: number; s: number; ph: number; rim?: string }> = ({ x, y, s, ph, rim = '#9fc0d8' }) => {
  const a = Math.sin(ph) * 9;
  return (
    <g transform={`translate(${x} ${y - Math.abs(Math.sin(ph)) * 5}) scale(${s})`} fill="#0d0a14">
      <path d={`M -16 -80 L ${-20 + a} 0 L ${18 - a} 0 L 16 -80 Z`} />
      <path d="M -18 -82 Q -22 -128 -14 -140 L 14 -140 Q 22 -128 18 -82 Z" />
      <circle cx={0} cy={-154} r={12} />
      <circle cx={2} cy={-164} r={8} />
      <path d={`M -14 -134 L ${-30 - a} -100 L ${-25 - a} -98 L -8 -128 Z`} />
      <path d={`M 14 -134 L ${30 + a} -102 L ${25 + a} -100 L 8 -128 Z`} />
      <path d="M 18 -84 Q 22 -126 14 -140" stroke={rim} strokeWidth={1.5} fill="none" opacity={0.8} />
    </g>
  );
};

/**
 * HERO: mom from behind, hands cupped to her mouth. Origin at her waist; ~1 unit = 1 world px at s=1.
 * Kebaya + sarong, hair bun with loose strands, warm rim from the house behind-left, cool rim right.
 */
/** HERO mom from behind, FULL figure, local origin = feet, ~960 units tall at s=1 (head ≈ 1/7). */
export const MomHero: React.FC<{ x: number; y: number; s: number; t: number; call: number }> = ({ x, y, s, t, call }) => {
  const lean = call * 2;
  const sway = Math.sin(t * 1.3) * 0.6;
  const str = (i: number) => Math.sin(t * 1.8 + i * 1.3) * 5;
  const lift = call * 10; // elbows rise a little while shouting
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sway})`}>
      <defs>
        <linearGradient id="vmKeb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a3a54" /><stop offset="0.4" stopColor="#241c2e" /><stop offset="1" stopColor="#120e18" />
        </linearGradient>
        <linearGradient id="vmSar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a3024" /><stop offset="0.45" stopColor="#24170f" /><stop offset="1" stopColor="#120c08" />
        </linearGradient>
      </defs>
      {/* feet / sandals */}
      <path d="M -62 -6 q -6 -12 10 -14 l 34 0 q 8 6 4 20 Z" fill="#0d0a14" />
      <path d="M 20 -6 q -2 -12 12 -14 l 32 0 q 10 6 4 20 Z" fill="#0d0a14" />
      <path d="M -56 -16 l 28 -4" stroke="#6e4a44" strokeWidth={4} />
      <path d="M 26 -16 l 28 -4" stroke="#6e4a44" strokeWidth={4} />
      {/* sarong: hips -> narrow ankles */}
      <path d="M -102 -560 Q -114 -300 -74 -16 L 76 -16 Q 116 -300 102 -560 Z" fill="url(#vmSar)" />
      {[-480, -400, -320, -240, -160].map((yy, i) => (
        <path key={i} d={`M ${-104 + i * 8} ${yy} q 26 -8 52 0 t 52 0 t 52 0 t 46 0`} stroke="#a06a3a" strokeWidth={5} fill="none" opacity={0.85} />
      ))}
      <path d="M 34 -540 Q 40 -280 30 -20" stroke="#0a0705" strokeWidth={5} fill="none" opacity={0.6} />
      <path d="M -102 -556 Q -114 -300 -74 -20" stroke="#ffb35c" strokeWidth={4} fill="none" opacity={0.6} />
      <path d="M 102 -556 Q 114 -300 76 -20" stroke="#9fc0d8" strokeWidth={2.5} fill="none" opacity={0.5} />
      <g transform={`rotate(${-lean} 0 -560)`}>
        {/* kebaya torso: shoulders wider than waist, flares to a hem over the hips */}
        <path d="M -108 -790 Q -96 -680 -84 -620 Q -118 -560 -124 -500 L 124 -500 Q 118 -560 84 -620 Q 96 -680 108 -790 Q 0 -812 -108 -790 Z" fill="url(#vmKeb)" />
        {/* lighter hem (lace edge) */}
        <path d="M -124 -500 L 124 -500 L 122 -518 Q 0 -526 -122 -518 Z" fill="#a898b4" />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-112 + i * 28} cy={-498} r={8} fill="#a898b4" />)}
        <path d="M 2 -800 Q -4 -680 4 -520" stroke="#0e0a12" strokeWidth={5} fill="none" opacity={0.6} />
        {/* arms: upper arm out to the elbow, forearm up to the hands cupped at the sides of the head */}
        {[-1, 1].map((sd) => {
          const ex = sd * 178, ey = -858 - lift;
          const lit = sd < 0;
          return (
            <g key={sd}>
              <path d={`M ${sd * 96} -792 Q ${sd * 150} -800 ${ex} ${ey} L ${ex - sd * 14} ${ey - 52} Q ${sd * 128} -812 ${sd * 82} -740 Z`} fill={lit ? '#3a2c46' : '#16111c'} />
              <path d={`M ${ex} ${ey} Q ${sd * 150} -900 ${sd * 66} -918 L ${sd * 58} -872 Q ${sd * 120} -870 ${ex - sd * 14} ${ey - 52} Z`} fill={lit ? '#34283e' : '#130f18'} />
              {/* cupped hand (mitten) beside the face, two finger separations */}
              <path d={`M ${sd * 70} -930 q ${-sd * 22} -6 ${-sd * 30} 8 q ${-sd * 2} 26 ${sd * 4} 36 q ${sd * 16} 2 ${sd * 26} -12 Z`} fill="#7a5048" />
              <path d={`M ${sd * 52} -926 l ${-sd * 8} 10 M ${sd * 56} -912 l ${-sd * 9} 9`} stroke="#3e2826" strokeWidth={2} />
              {lit && <path d={`M ${ex} ${ey} Q ${sd * 150} -800 ${sd * 96} -792`} stroke="#ffb35c" strokeWidth={4} fill="none" opacity={0.85} />}
              {lit && <path d={`M ${ex - sd * 2} ${ey - 4} Q ${sd * 150} -904 ${sd * 70} -926`} stroke="#ffd08a" strokeWidth={3} fill="none" opacity={0.8} />}
              {!lit && <path d={`M ${ex} ${ey} Q ${sd * 150} -800 ${sd * 96} -792`} stroke="#9fc0d8" strokeWidth={2.5} fill="none" opacity={0.6} />}
            </g>
          );
        })}
        {/* neck */}
        <path d="M -20 -800 L -18 -836 L 18 -836 L 20 -800 Z" fill="#5a3c38" />
        {/* head from behind + bun */}
        <ellipse cx={0} cy={-890} rx={52} ry={64} fill="#16111c" />
        <ellipse cx={0} cy={-850} rx={34} ry={24} fill="#2a2034" />
        <path d="M -32 -846 Q -30 -872 0 -874" stroke="#ffb35c" strokeWidth={2.5} fill="none" opacity={0.8} />
        <path d="M -26 -852 q 26 -14 52 0" stroke="#4a3e56" strokeWidth={2.5} fill="none" />
        <path d="M -22 -918 Q 0 -930 22 -918" stroke="#2a2232" strokeWidth={2} fill="none" />
        {[-34, -14, 18, 36].map((hx, i) => (
          <path key={i} d={`M ${hx} -840 q ${str(i)} 18 ${hx > 0 ? 5 : -5} 36`} stroke="#241c2c" strokeWidth={1.5} fill="none" />
        ))}
        {/* rims: warm left (porch), cool right (sky) */}
        <path d="M -50 -900 Q -50 -944 -16 -954" stroke="#ffb35c" strokeWidth={3.5} fill="none" opacity={0.9} />
        <path d="M -108 -786 Q -96 -680 -84 -620 Q -118 -560 -124 -504" stroke="#ffb35c" strokeWidth={4} fill="none" opacity={0.8} />
        <path d="M 50 -900 Q 50 -940 18 -952" stroke="#9fc0d8" strokeWidth={2.5} fill="none" opacity={0.7} />
        <path d="M 108 -786 Q 96 -680 84 -620 Q 118 -560 124 -504" stroke="#9fc0d8" strokeWidth={2.5} fill="none" opacity={0.55} />
      </g>
    </g>
  );
};

/** Cheap foreground framing: dark leaf blades from the top corners + an out-of-focus stalk edge. side: which edges. */
export const FgFrame: React.FC<{ w?: number; h?: number; left?: boolean; right?: boolean; c?: string; stalk?: 'l' | 'r' }> = ({ w = 1080, h = 1920, left = true, right = true, c = '#07060b', stalk }) => {
  const blades = (sx: number, dir: number) => [0, 1, 2, 3, 4].map((i) => {
    const y0 = -20 + i * 70, len = 260 + (i % 3) * 90, droop = 120 + i * 40;
    return <path key={i} d={`M ${sx} ${y0} q ${dir * len * 0.5} ${droop * 0.2} ${dir * len} ${droop} q ${-dir * len * 0.55} ${-droop * 0.45} ${-dir * len} ${-droop + 34} Z`} fill={c} />;
  });
  return (
    <g>
      {left && blades(-30, 1)}
      {right && blades(w + 30, -1)}
      {stalk === 'l' && <path d={`M -20 0 L 60 0 Q 54 ${h / 2} 70 ${h} L -20 ${h} Z`} fill={c} />}
      {stalk === 'r' && <path d={`M ${w + 20} 0 L ${w - 64} 0 Q ${w - 56} ${h / 2} ${w - 74} ${h} L ${w + 20} ${h} Z`} fill={c} />}
      <path d={`M -10 ${h - 140} Q ${w * 0.3} ${h - 190} ${w * 0.55} ${h - 120} Q ${w * 0.8} ${h - 170} ${w + 10} ${h - 130} L ${w + 10} ${h + 10} L -10 ${h + 10} Z`} fill={c} />
    </g>
  );
};
