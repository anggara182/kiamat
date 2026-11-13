import React from 'react';

/** Old-style folded nurse's cap, centred at 0,0, ~420 wide. lit = 0..1 rim strength. */
export const NurseCap: React.FC<{ x: number; y: number; s?: number; rot?: number; lit?: number; dirty?: boolean }> = ({ x, y, s = 1, rot = 0, lit = 1, dirty }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <defs>
      <linearGradient id="capBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={dirty ? '#cfd3c8' : '#eef1ea'} />
        <stop offset="0.6" stopColor={dirty ? '#9ea79f' : '#b9c4bf'} />
        <stop offset="1" stopColor="#5c6a68" />
      </linearGradient>
      <linearGradient id="capWing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d9e0db" />
        <stop offset="1" stopColor="#6d7c79" />
      </linearGradient>
    </defs>
    {/* contact shadow */}
    <ellipse cx="0" cy="92" rx="210" ry="24" fill="#050909" opacity="0.65" />
    {/* back fold wings behind the top corners */}
    <path d="M-150 -118 L-232 -92 L-206 -40 L-158 -60 Z" fill="url(#capWing)" />
    <path d="M150 -118 L232 -92 L206 -40 L158 -60 Z" fill="url(#capWing)" opacity="0.8" />
    {/* flared crown: wider at top, like an old starched cap */}
    <path d="M-160 30 L-200 -116 C-110 -134 110 -134 200 -116 L160 30 Z" fill="url(#capBody)" />
    <path d="M-200 -116 C-110 -134 110 -134 200 -116 L190 -96 C100 -110 -100 -110 -190 -96 Z" fill="#d6ddd8" />
    {[-110, -55, 0, 55, 110].map((px, i) => (
      <path key={i} d={`M${px * 0.85} 28 L${px} -100`} stroke="#8c9894" strokeWidth="3" fill="none" opacity="0.5" />
    ))}
    {/* front band */}
    <path d="M-175 28 L175 28 L160 88 L-160 88 Z" fill="#f4f6f1" />
    <path d="M-160 74 L160 74 L160 88 L-160 88 Z" fill="#9aa6a2" />
    {/* faded band stripe */}
    <path d="M-170 44 L170 44 L167 54 L-167 54 Z" fill="#3a4d4b" opacity={dirty ? 0.6 : 0.85} />
    {/* small cross */}
    <g opacity={dirty ? 0.45 : 0.8}>
      <rect x="-7" y="-58" width="14" height="40" fill="#7a2a2a" />
      <rect x="-20" y="-45" width="40" height="14" fill="#7a2a2a" />
    </g>
    {/* rim light from above */}
    <path d="M-200 -116 C-110 -134 110 -134 200 -116" stroke="#ffffff" strokeWidth="5" fill="none" opacity={0.9 * lit} strokeLinecap="round" />
    <path d="M-200 -114 L-161 26" stroke="#ffffff" strokeWidth="3" fill="none" opacity={0.5 * lit} />
    <path d="M-172 29 L172 29" stroke="#ffffff" strokeWidth="3" opacity={0.8 * lit} />
    {dirty && <path d="M60 60 q30 -8 60 6" stroke="#4b4a3e" strokeWidth="6" opacity="0.35" fill="none" />}
  </g>
);

/** Single fluorescent tube fixture, centred, ~520 wide. on = 0..1 */
export const Tube: React.FC<{ x: number; y: number; w?: number; on?: number }> = ({ x, y, w = 520, on = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 - 20} y={-26} width={w + 40} height={30} rx={6} fill="#141c1d" />
    <rect x={-w / 2} y={4} width={w} height={16} rx={8} fill="#dff7f2" opacity={0.35 + 0.65 * on} />
    <rect x={-w / 2 + 6} y={8} width={w - 12} height={5} rx={3} fill="#ffffff" opacity={0.5 + 0.5 * on} />
    <rect x={-w / 2 - 14} y={2} width={14} height={20} fill="#2a3436" />
    <rect x={w / 2} y={2} width={14} height={20} fill="#2a3436" />
  </g>
);

/** Clipboard lying flat-ish, local origin centre. */
export const Clipboard: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-150" y="-200" width="300" height="400" rx="16" fill="#3a2a1f" transform="translate(10 14)" opacity="0.5" />
    <rect x="-150" y="-200" width="300" height="400" rx="16" fill="#5b4330" />
    <rect x="-128" y="-170" width="256" height="350" fill="#b8c2bc" />
    <path d="M-128 180 L128 180 L128 120 Q40 160 -128 150 Z" fill="#8d9893" />
    {[...Array(9)].map((_, i) => (
      <rect key={i} x="-104" y={-120 + i * 30} width={i % 3 === 2 ? 120 : 200} height="6" fill="#5d6b67" opacity="0.7" />
    ))}
    <rect x="-104" y="-150" width="110" height="12" fill="#3c4a47" />
    <rect x="-60" y="-218" width="120" height="44" rx="10" fill="#6f7b78" />
    <rect x="-60" y="-218" width="120" height="8" rx="4" fill="#cfe2dd" />
    <path d="M-150 -196 L150 -196" stroke="#dff7f2" strokeWidth="3" opacity="0.6" />
  </g>
);

/** A loose lock of long dark hair: several thin strands around one path, with one cold rim strand. */
export const HairLock: React.FC<{ d: string; n?: number; spread?: number; rim?: number }> = ({ d, n = 7, spread = 7, rim = 0.6 }) => (
  <g fill="none" strokeLinecap="round">
    {[...Array(n)].map((_, i) => {
      const o = (i - (n - 1) / 2) * spread * (0.6 + 0.4 * Math.sin(i * 2.3));
      return <path key={i} d={d} transform={`translate(${o * 0.5} ${o}) rotate(${(i - (n - 1) / 2) * 0.6})`} stroke="#0b0b0d" strokeWidth={i % 4 === 0 ? 2.6 : 1.3} opacity={0.7 + 0.3 * Math.cos(i * 1.7)} />;
    })}
    <path d={d} transform={`translate(0 ${-spread * n * 0.3})`} stroke="#7fa8a1" strokeWidth={1.6} opacity={rim} />
  </g>
);
