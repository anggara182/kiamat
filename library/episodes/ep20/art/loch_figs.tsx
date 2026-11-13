import React from 'react';

export const K = { hide: '#0a0b0c', sheen: '#6f8a90', silver: '#b9c9cf', weed: '#3f6b4a', water: '#0f1d22', mist: '#9aa7ad' };

/** The kelpie, side profile facing left. (x,y) = hooves on ground, s = scale (withers ~ 300*s). walk = gait phase, head = 0 (up) .. 1 (lowered/turned). */
export const Horse: React.FC<{ x: number; y: number; s: number; walk?: number; head?: number; flip?: boolean; rim?: number; drip?: number }> = ({ x, y, s, walk = 0, head = 0, flip = false, rim = 1, drip = 0 }) => {
  const a = Math.sin(walk) * 10, b = -a;
  const leg = (lx: number, sw: number, w = 13) => `M ${lx - w} -175 L ${lx - 9 + sw * 0.4} -95 L ${lx - 8 + sw} -14 L ${lx - 13 + sw} 0 L ${lx + 9 + sw} 0 L ${lx + 7 + sw} -14 L ${lx + 7 + sw * 0.4} -95 L ${lx + w + 2} -175 Z`;
  const hr = head * 18;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {/* tail */}
      <path d="M 165 -245 Q 205 -200 196 -120 Q 192 -70 200 -40 Q 176 -70 172 -130 Q 168 -190 150 -235 Z" fill={K.hide} />
      {/* far legs (slightly lighter) */}
      <path d={leg(-48, b)} fill="#141719" />
      <path d={leg(132, a)} fill="#141719" />
      {/* body */}
      <ellipse cx={40} cy={-205} rx={128} ry={58} fill={K.hide} />
      <ellipse cx={128} cy={-212} rx={56} ry={62} fill={K.hide} />
      <ellipse cx={-58} cy={-212} rx={54} ry={58} fill={K.hide} />
      {/* near legs */}
      <path d={leg(-74, a, 15)} fill={K.hide} />
      <path d={leg(150, b, 16)} fill={K.hide} />
      {/* neck + head */}
      <g transform={`rotate(${-hr}, -80, -230)`}>
        <path d="M -40 -255 Q -80 -300 -118 -372 L -168 -352 Q -150 -300 -112 -168 Q -70 -170 -40 -200 Z" fill={K.hide} />
        <path d="M -122 -384 Q -146 -398 -166 -378 L -226 -300 Q -236 -278 -214 -270 L -192 -272 Q -170 -306 -138 -332 Z" fill={K.hide} />
        <path d="M -128 -380 L -124 -414 L -112 -384 Z" fill={K.hide} />
        <path d="M -142 -382 L -144 -410 L -130 -386 Z" fill={K.hide} />
        {/* wet eye glint */}
        <ellipse cx={-160} cy={-352} rx={5} ry={3.5} fill={K.silver} opacity={0.75} />
        {/* mane: heavy, dripping, weed tangled */}
        <path d="M -116 -386 Q -86 -330 -46 -262 Q -30 -236 -40 -200 Q -56 -232 -70 -238 Q -78 -212 -86 -196 Q -92 -236 -104 -262 Q -112 -240 -120 -228 Q -118 -276 -126 -312 Q -132 -294 -140 -286 Q -132 -340 -116 -386 Z" fill="#050606" />
        <g stroke={K.weed} fill="none" strokeLinecap="round">
          <path d="M -98 -330 Q -104 -290 -96 -250" strokeWidth={5} />
          <path d="M -70 -278 Q -78 -246 -72 -212" strokeWidth={4} />
          <path d="M -120 -300 Q -126 -276 -122 -250" strokeWidth={3} opacity={0.8} />
        </g>
        {/* rim on neck/head */}
        <g stroke={K.silver} fill="none" strokeLinecap="round" opacity={0.7 * rim}>
          <path d="M -124 -388 Q -96 -340 -58 -276" strokeWidth={3} />
          <path d="M -166 -378 L -222 -304" strokeWidth={2.5} opacity={0.7} />
        </g>
      </g>
      {/* wet sheen along back and rump */}
      <g stroke={K.sheen} fill="none" strokeLinecap="round" opacity={rim}>
        <path d="M -30 -262 Q 40 -268 110 -270 Q 160 -268 182 -228" strokeWidth={5} />
        <path d="M 120 -250 Q 160 -230 166 -190" strokeWidth={3} opacity={0.6} />
        <path d="M -100 -230 Q -110 -200 -104 -170" strokeWidth={3} opacity={0.5} />
      </g>
      <g stroke={K.silver} fill="none" strokeLinecap="round" opacity={0.55 * rim}>
        <path d="M 10 -264 Q 70 -270 130 -270" strokeWidth={2.5} />
      </g>
      {/* drips */}
      {[[-60, -150], [20, -148], [100, -150], [170, -60]].map(([dx, dy], i) => {
        const t = (drip + i * 0.27) % 1;
        return <ellipse key={i} cx={dx} cy={dy + t * 120} rx={3} ry={5} fill={K.silver} opacity={0.6 * (1 - t)} />;
      })}
    </g>
  );
};

/** Child from behind in wool jumper + wellies. (x,y) = feet, h = height. */
export const Kid: React.FC<{ x: number; y: number; h: number; phase?: number; jumper: string; hair?: 'long' | 'short'; rim?: number; reach?: number }> = ({ x, y, h, phase = 0, jumper, hair = 'long', rim = 1, reach = 0 }) => {
  const s = h / 500;
  const sw = Math.sin(phase) * 14;
  const bob = Math.abs(Math.sin(phase)) * 4;
  const R = '#d7e2e6';
  return (
    <g transform={`translate(${x},${y - bob * s}) scale(${s})`}>
      {/* legs + wellies */}
      <path d={`M -34 -230 L ${-40 + sw} -70 L ${-14 + sw} -70 L -4 -220 Z`} fill="#15181c" />
      <path d={`M 4 -220 L ${14 - sw} -70 L ${40 - sw} -70 L 34 -230 Z`} fill="#15181c" />
      <path d={`M ${-44 + sw} -86 L ${-46 + sw} -2 L ${-10 + sw} 0 L ${-12 + sw} -86 Z`} fill="#0c1a14" />
      <path d={`M ${12 - sw} -86 L ${10 - sw} 0 L ${46 - sw} -2 L ${44 - sw} -86 Z`} fill="#0c1a14" />
      {/* jumper torso */}
      <path d="M -62 -368 Q -74 -300 -54 -214 L 54 -214 Q 74 -300 62 -368 Q 34 -392 0 -394 Q -34 -392 -62 -368 Z" fill={jumper} />
      <path d="M -54 -230 L 54 -230 L 54 -214 L -54 -214 Z" fill="#000" opacity={0.25} />
      {/* arms */}
      <path d={`M -62 -364 Q -82 -300 ${-74 - sw * 0.4} -236 L ${-56 - sw * 0.4} -232 Q -58 -300 -48 -350 Z`} fill={jumper} />
      <g transform={`rotate(${-reach * 60}, 62, -360)`}>
        <path d={`M 62 -364 Q 82 -300 ${74 + sw * 0.4} -236 L ${56 + sw * 0.4} -232 Q 58 -300 48 -350 Z`} fill={jumper} />
      </g>
      {/* head + hair */}
      <rect x={-12} y={-414} width={24} height={26} fill="#1a1416" />
      <ellipse cx={0} cy={-452} rx={42} ry={48} fill="#1a1416" />
      {hair === 'long'
        ? <path d="M -46 -462 Q -44 -510 0 -506 Q 44 -510 46 -462 Q 52 -390 42 -330 Q 0 -320 -42 -330 Q -52 -390 -46 -462 Z" fill="#120d0c" />
        : <path d="M -46 -456 Q -44 -506 0 -503 Q 44 -506 46 -456 L 44 -430 Q 0 -420 -44 -430 Z" fill="#120d0c" />}
      {/* cool rim from the loch */}
      <g stroke={R} fill="none" strokeLinecap="round" opacity={0.7 * rim}>
        <path d="M -40 -496 Q 0 -512 40 -496" strokeWidth={4} />
        <path d="M 64 -360 Q 76 -300 70 -240" strokeWidth={4} opacity={0.7} />
        <path d="M 46 -470 Q 52 -420 46 -380" strokeWidth={3} opacity={0.6} />
      </g>
    </g>
  );
};
