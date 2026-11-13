import React from 'react';

/**
 * Stylised PROFILE person for mouth-to-ear close-ups (EP02 "whisper" set).
 * Local coords: facing RIGHT, origin = centre of the skull, head ~300 tall (crown -165 .. chin +150).
 * No detailed lips or teeth: the mouth is one soft bump + a line. Identity comes from headscarf / hair / clothes.
 */
export type Hair = 'scarf' | 'short' | 'long' | 'bald';
export type PersonSpec = {
  skin: string; shade: string;
  hair: Hair; hairC: string; hairC2?: string; pattern?: string; // scarf / hair colours, optional dot pattern colour
  shirt: string; shirtD: string; shirtPat?: string; towel?: string; cape?: boolean;
  mustache?: boolean;
};

/** Face points (facing right). */
export const EAR = { x: -14, y: 2 };
export const MOUTH = { x: 118, y: 60 };

const FACE = 'M60 -150 C100 -122 110 -72 112 -46 C108 -36 106 -28 112 -14 L142 18 C146 28 134 36 116 38 C120 44 122 50 118 56 L112 61 C118 66 118 74 110 80 C104 88 110 100 108 112 C100 136 70 148 30 150 C-20 152 -70 122 -110 72 C-142 22 -140 -70 -100 -122 C-60 -162 20 -166 60 -150 Z';

export const Person: React.FC<{
  id: string; p: PersonSpec;
  wide?: number;     // eye/brow surprise 0..1
  talk?: number;     // mouth open 0..1 (whisper)
  lean?: number;     // head tilt in degrees (positive = forward/down toward the right)
  blink?: number;    // 0 open .. 1 closed
  cup?: number;      // 0 = no hand, >0 = cupping hand at the mouth (1 = fully raised)
  rim?: string; rimOp?: number; light?: number;
}> = ({ id, p, wide = 0, talk = 0, lean = 0, blink = 0, cup = 0, rim = '#fff1d6', rimOp = 0.6 }) => {
  const eh = (5 + 9 * wide) * (1 - blink); // eye opening
  const lo = talk * 5;
  return (
    <g>
      <defs>
        <clipPath id={`${id}t`}><path d="M-64 128 L54 128 L74 248 C166 268 226 320 246 470 L-266 470 C-246 320 -176 268 -84 248 Z" /></clipPath>
        <clipPath id={`${id}f`}><path d={FACE} /></clipPath>
      </defs>
      {/* torso + neck */}
      <path d="M-64 128 L54 128 L74 248 C166 268 226 320 246 470 L-266 470 C-246 320 -176 268 -84 248 Z" fill={p.shirt} />
      <g clipPath={`url(#${id}t)`}>
        {p.shirtPat && Array.from({ length: 24 }, (_, i) => <circle key={i} cx={-240 + (i % 6) * 90 + (Math.floor(i / 6) % 2) * 45} cy={280 + Math.floor(i / 6) * 50} r={10} fill="none" stroke={p.shirtPat} strokeWidth={4} opacity={0.7} />)}
        <path d="M-266 470 C-246 330 -180 280 -90 262 L-70 470 Z" fill={p.shirtD} opacity={0.6} />
        {p.cape && <path d="M-300 300 C-100 250 120 250 300 300 L300 480 L-300 480 Z" fill="#e8e6de" />}
      </g>
      <path d="M-46 120 L40 120 L52 250 C20 262 -40 262 -70 250 Z" fill={p.skin} />
      <path d="M-46 120 L-10 120 L-20 252 C-40 256 -58 254 -70 250 Z" fill={p.shade} opacity={0.6} />
      {p.towel && <path d="M-90 236 C-40 214 40 214 90 238 C80 262 30 270 -10 268 C-50 270 -84 262 -90 236 Z" fill={p.towel} />}
      {!p.cape && !p.towel && <path d="M-60 250 L-8 300 L52 248" stroke={p.shirtD} strokeWidth={8} fill="none" opacity={0.8} />}
      {/* head, leaning around the neck */}
      <g transform={`rotate(${lean} 0 140)`}>
        {p.hair === 'long' && <path d="M-118 -60 C-150 40 -150 170 -120 280 L-30 280 C-40 200 -60 120 -50 60 Z" fill={p.hairC} />}
        <path d={FACE} fill={p.skin} />
        <g clipPath={`url(#${id}f)`}>
          <ellipse cx={40} cy={60} rx={60} ry={50} fill={p.shade} opacity={0.35} />
          <path d="M-150 -170 L-20 -170 C-30 -60 -10 60 30 160 L-150 160 Z" fill={p.shade} opacity={0.45} />
          <ellipse cx={86} cy={20} rx={22} ry={14} fill="#e0906e" opacity={0.25} />
        </g>
        {/* mouth: lip bump + line, the lower lip drops a little when whispering */}
        <path d={`M110 44 C120 46 122 52 117 58 L112 61 C${118} ${66 + lo} ${117} ${72 + lo} ${108} ${78 + lo * 0.6}`} fill="none" stroke={p.shade} strokeWidth={4} strokeLinecap="round" />
        <path d={`M96 ${61 + lo * 0.5} L114 ${61 + lo * 0.4}`} stroke="#4a2a22" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
        {p.mustache && <path d="M100 44 C110 42 118 46 120 52 C112 52 104 50 98 50 Z" fill={p.hairC} />}
        {/* eye (profile almond) + brow */}
        <path d={`M66 -22 Q82 ${-22 - eh} 96 -20 Q84 ${-22 + eh * 0.55} 66 -22 Z`} fill="#efe8dc" />
        {eh > 2 && <circle cx={87} cy={-21 + eh * 0.05} r={Math.min(5.5, eh * 0.45)} fill="#1a120e" />}
        <path d={`M64 -22 Q82 ${-23 - eh} 98 -20`} stroke="#2a1a14" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d={`M62 ${-44 - 10 * wide} Q82 ${-52 - 14 * wide} 100 ${-44 - 8 * wide}`} stroke={p.hair === 'bald' ? '#3a2a20' : p.hair === 'scarf' ? '#2a1a14' : p.hairC} strokeWidth={6} fill="none" strokeLinecap="round" />
        {/* hair / headscarf */}
        {p.hair === 'short' && <path d="M72 -136 C40 -178 -90 -170 -126 -84 C-142 -24 -130 36 -104 70 L-74 56 C-82 20 -74 -8 -40 -24 C-6 -64 36 -94 84 -110 Z" fill={p.hairC} />}
        {p.hair === 'long' && <path d="M78 -132 C40 -182 -100 -176 -132 -76 C-146 -20 -136 40 -112 80 L-70 60 C-84 10 -70 -20 -40 -34 C0 -80 40 -100 86 -112 Z" fill={p.hairC} />}
        {p.hair === 'bald' && <path d="M-118 -10 C-120 30 -110 60 -96 76 L-74 60 C-84 30 -86 0 -80 -20 Z" fill={p.hairC} opacity={0.8} />}
        {p.hair !== 'scarf' && (
          <g>
            <path d="M-38 -26 C-6 -34 6 4 -6 32 C-14 46 -34 42 -36 26" fill={p.skin} />
            <path d="M-38 -26 C-6 -34 6 4 -6 32 C-14 46 -34 42 -36 26" stroke={p.shade} strokeWidth={4} fill="none" />
            <path d="M-26 -10 C-10 -10 -8 14 -20 20" stroke={p.shade} strokeWidth={3} fill="none" opacity={0.7} />
          </g>
        )}
        {p.hair === 'scarf' && (
          <g>
            <defs><clipPath id={`${id}s`}><path d="M84 -126 C44 -196 -130 -196 -168 -60 C-190 40 -180 170 -128 262 L-250 470 L250 470 L160 300 C116 252 86 212 74 170 C58 128 46 80 48 20 C50 -40 62 -92 84 -126 Z" /></clipPath></defs>
            <path d="M84 -126 C44 -196 -130 -196 -168 -60 C-190 40 -180 170 -128 262 L-250 470 L250 470 L160 300 C116 252 86 212 74 170 C58 128 46 80 48 20 C50 -40 62 -92 84 -126 Z" fill={p.hairC} />
            <g clipPath={`url(#${id}s)`}>
              {p.pattern && Array.from({ length: 70 }, (_, i) => <circle key={i} cx={-200 + (i % 10) * 44 + (Math.floor(i / 10) % 2) * 22} cy={-180 + Math.floor(i / 10) * 70} r={7} fill={p.pattern} opacity={0.75} />)}
              <path d="M-200 -200 L-60 -200 C-110 -60 -100 120 -40 300 L-200 480 Z" fill="#000" opacity={0.18} />
              <path d="M84 -126 C62 -92 50 -40 48 20 C46 80 58 128 74 170 C86 212 116 252 160 300" stroke={p.hairC2 ?? '#ffffff'} strokeWidth={14} fill="none" opacity={0.35} />
              <path d="M-80 -60 C-60 40 -40 140 10 240 M-140 0 C-120 120 -100 200 -60 300" stroke="#000" strokeWidth={6} fill="none" opacity={0.15} />
            </g>
          </g>
        )}
        {/* rim light along the front of the face */}
        <path d="M60 -150 C100 -122 110 -72 112 -46 C108 -36 106 -28 112 -14 L142 18" stroke={rim} strokeWidth={4} fill="none" opacity={rimOp} strokeLinecap="round" />
        {/* cupping hand at the mouth (mitten, two finger separations) */}
        {cup > 0 && (
          <g transform={`translate(0 ${(1 - cup) * 160})`} opacity={Math.min(1, cup * 3)}>
            <path d="M118 140 C116 200 100 300 84 420 L-10 420 C20 300 60 200 92 132 Z" fill={p.shirt} />
            <path d="M136 4 C176 -8 204 20 206 60 C208 100 186 128 152 134 L120 146 C112 120 126 110 150 106 C172 100 182 82 182 60 C182 32 164 20 144 26 Z" fill={p.skin} />
            <path d="M150 106 C172 100 182 82 182 60 M206 60 C204 80 196 96 184 108" stroke={p.shade} strokeWidth={4} fill="none" opacity={0.7} />
            <path d="M190 22 C176 30 172 40 174 50 M200 44 C186 50 182 58 182 68" stroke="#4a2c24" strokeWidth={3} fill="none" opacity={0.6} />
            <path d="M136 4 C176 -8 204 20 206 60" stroke={rim} strokeWidth={3.5} fill="none" opacity={rimOp} />
          </g>
        )}
      </g>
    </g>
  );
};

/** World position of a local face point after scale s, lean (deg) and mirror (dir=-1 faces left). */
export const facePt = (x: number, y: number, s: number, pt: { x: number; y: number }, lean = 0, dir: 1 | -1 = 1) => {
  const a = (lean * Math.PI) / 180, px = pt.x, py = pt.y - 140;
  const rx = px * Math.cos(a) - py * Math.sin(a), ry = px * Math.sin(a) + py * Math.cos(a) + 140;
  return { x: x + dir * rx * s, y: y + ry * s };
};
