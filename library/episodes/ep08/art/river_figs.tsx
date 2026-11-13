import React from 'react';

export const RC = {
  skyTop: '#090c1a', skyLow: '#1b2140', moon: '#e9ecf2', river: '#0d1626', glint: '#cfd8e6',
  near: '#060810', mid: '#121828', mist: '#8b96ad', mari: '#ff9f5a', candle: '#ffd08a',
  dress: '#e7e4dc', dressMoon: '#a7b0c0', dressDeep: '#5d6678', hair: '#0b0c10',
};

/** La Llorona seen from behind / three-quarter back, origin = ground under her knees. s=1 → ~110 units tall kneeling, ~185 standing. */
export const Llorona: React.FC<{ x: number; y: number; s: number; turn?: number; stand?: number; cold?: boolean; id: string }> = ({ x, y, s, turn = 0, stand = 0, cold, id }) => {
  const lite = cold ? '#b9c3d4' : RC.dress;
  const mid = cold ? '#7d889c' : RC.dressMoon;
  const deep = cold ? '#3e4658' : RC.dressDeep;
  const st = stand > 0.5;
  const g = `${id}-dr`;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id={g} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={lite} /><stop offset="0.45" stopColor={mid} /><stop offset="1" stopColor={deep} />
        </linearGradient>
      </defs>
      {/* reflection / wet pool */}
      <ellipse cx={0} cy={2} rx={st ? 30 : 46} ry={5} fill={mid} opacity={0.25} />
      {st ? (
        <g>
          <path d="M-26,0 C-22,-50 -19,-100 -15,-128 L15,-128 C19,-100 22,-50 26,0 C14,4 -14,4 -26,0Z" fill={`url(#${g})`} />
          <path d="M-15,-128 C-17,-140 -15,-152 -11,-158 L11,-158 C15,-152 17,-140 15,-128Z" fill={`url(#${g})`} />
          {/* arms hanging */}
          <path d="M-12,-154 C-20,-130 -22,-104 -20,-84 L-15,-84 C-15,-104 -13,-128 -8,-148Z" fill={mid} />
          <path d="M12,-154 C20,-130 22,-104 20,-84 L15,-84 C15,-104 13,-128 8,-148Z" fill={deep} />
          {[[-12, -2], [-4, -1], [6, -2], [14, -3]].map(([a, b], i) => <path key={i} d={`M${a * 0.7},-110 Q${a},-55 ${a * 1.1},${b}`} stroke={deep} strokeWidth={1.4} fill="none" opacity={0.6} />)}
          <g transform={`rotate(${turn * 8},0,-170)`}>
            <ellipse cx={0} cy={-170} rx={9} ry={11} fill={RC.hair} />
            <path d="M-10,-176 C-14,-150 -15,-122 -12,-96 L-3,-90 L5,-94 L12,-98 C15,-126 13,-156 10,-176 C6,-184 -6,-184 -10,-176Z" fill={RC.hair} />
          </g>
          <path d="M-26,0 C-22,-50 -19,-100 -15,-128 C-17,-140 -15,-152 -11,-158" stroke="#f4f2ec" strokeWidth={1.6} fill="none" opacity={0.8} />
        </g>
      ) : (
        <g>
          {/* skirt pooled on ground */}
          <path d="M-44,0 C-40,-18 -30,-36 -19,-50 L19,-50 C30,-36 40,-18 44,0 C24,5 -24,5 -44,0Z" fill={`url(#${g})`} />
          <path d="M-12,-46 Q-18,-22 -26,0 M2,-48 Q2,-24 4,1 M14,-46 Q22,-22 30,0" stroke={deep} strokeWidth={1.6} fill="none" opacity={0.55} />
          {/* torso leaning forward toward water */}
          <path d="M-18,-50 C-20,-66 -17,-80 -13,-88 L13,-88 C17,-80 20,-66 18,-50Z" fill={`url(#${g})`} />
          {/* arms reaching down/forward */}
          <path d="M-14,-84 C-24,-70 -28,-54 -26,-40 L-20,-40 C-20,-54 -16,-68 -9,-78Z" fill={mid} />
          <path d="M14,-84 C24,-70 28,-54 26,-40 L20,-40 C20,-54 16,-68 9,-78Z" fill={deep} />
          <g transform={`rotate(${turn * 18},0,-92)`}>
            <ellipse cx={turn * 3} cy={-96} rx={8.5} ry={10} fill={RC.hair} />
            <path d="M-10,-102 C-14,-86 -15,-68 -12,-50 L-4,-44 L4,-47 L12,-50 C15,-68 13,-88 10,-102 C6,-110 -6,-110 -10,-102Z" fill={RC.hair} />
            {[-7, -3, 2, 6].map((a, i) => <path key={i} d={`M${a},-100 Q${a * 1.3},-75 ${a * 1.5},${-48 + (i % 2) * 3}`} stroke="#1c2130" strokeWidth={1} fill="none" />)}
            <path d="M-10,-102 C-14,-86 -15,-68 -12,-50" stroke="#6f7a90" strokeWidth={1} fill="none" />
          </g>
          {/* moon rim (left) */}
          <path d="M-44,0 C-40,-18 -30,-36 -19,-50 C-20,-66 -17,-80 -13,-88" stroke="#f6f4ee" strokeWidth={1.8} fill="none" opacity={0.85} />
        </g>
      )}
    </g>
  );
};

/** Boy (~10) from behind. origin = ground between feet. s=1 → ~150 units tall. phase = walk/run cycle radians. aim = flashlight direction degrees (0 = up/into depth). */
export const Boy: React.FC<{ x: number; y: number; s: number; phase: number; run?: number; aim?: number; rod?: boolean; beamLen?: number; id: string }> = ({ x, y, s, phase, run = 0, aim = 0, rod = true, beamLen = 700, id }) => {
  const sw = Math.sin(phase) * (10 + run * 10);
  const bob = Math.abs(Math.cos(phase)) * (2 + run * 4);
  const lean = run * 8;
  const ink = '#05070d', shade = '#1a2132', rim = '#9fb0cc';
  const bg = `${id}-beam`;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <radialGradient id={bg} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(22,-80) rotate(${aim - 90}) scale(${beamLen},${beamLen})`}>
          <stop offset="0" stopColor="#fff2cf" stopOpacity={0.55} /><stop offset="0.5" stopColor="#ffe3a8" stopOpacity={0.16} /><stop offset="1" stopColor="#ffe3a8" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* beam cone */}
      <g transform={`translate(22,-80) rotate(${aim})`}>
        <path d={`M0,0 L${-beamLen * 0.22},${-beamLen} L${beamLen * 0.22},${-beamLen}Z`} fill={`url(#${bg})`} transform="translate(-22,80)" />
      </g>
      <ellipse cx={0} cy={2} rx={26} ry={5} fill="#000" opacity={0.5} />
      <g transform={`translate(0,${-bob}) rotate(${lean},0,-60)`}>
        {/* legs */}
        <path d={`M-8,-62 L${-10 + sw * 0.5},-30 L${-9 + sw},0 L${-1 + sw},0 L${-3 + sw * 0.5},-30 L0,-62Z`} fill={ink} />
        <path d={`M8,-62 L${10 - sw * 0.5},-30 L${9 - sw},${-2 - run * 6} L${1 - sw},${-2 - run * 6} L${3 - sw * 0.5},-30 L0,-62Z`} fill={shade} />
        {/* torso (t-shirt) */}
        <path d="M-17,-108 C-19,-90 -15,-74 -12,-60 L12,-60 C15,-74 19,-90 17,-108 C8,-113 -8,-113 -17,-108Z" fill={shade} />
        {/* left arm (rod) */}
        <path d={`M-16,-104 C-22,-92 -24,-82 -22,${-72 + sw * 0.3} L-17,${-72 + sw * 0.3} C-18,-84 -15,-94 -11,-100Z`} fill={ink} />
        {rod && <path d={`M-20,${-74 + sw * 0.3} L-62,-210`} stroke="#2a2f3c" strokeWidth={2.2} />}
        {rod && <path d="M-62,-210 Q-70,-150 -64,-96" stroke="#7d8798" strokeWidth={0.7} fill="none" opacity={0.6} />}
        {/* right arm forward with flashlight */}
        <path d="M16,-104 C22,-94 24,-86 22,-80 L18,-78 C17,-86 15,-94 11,-100Z" fill={ink} />
        <rect x={17} y={-88} width={7} height={11} rx={2} fill="#3a404c" />
        <circle cx={20.5} cy={-88} r={3} fill="#fff4d6" />
        {/* head, child proportion */}
        <ellipse cx={0} cy={-124} rx={13} ry={15} fill={ink} />
        <path d="M-12,-130 C-10,-142 10,-142 12,-130 C8,-136 -6,-138 -12,-130Z" fill="#141a28" />
        {/* rim light from moon, left */}
        <path d="M-12,-132 C-14,-122 -12,-114 -8,-110 M-17,-106 C-19,-90 -15,-74 -12,-60" stroke={rim} strokeWidth={1.4} fill="none" opacity={0.8} />
      </g>
    </g>
  );
};
