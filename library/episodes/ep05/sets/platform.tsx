import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';
import { VP, at, EDGE } from '../art/platform_geo';

/** Set "platform" (empty commuter station platform at night). Static bands baked ONCE to public/baked/platform/<band>.png. Ids "platform/<band>". */
const pt = (p: { x: number; y: number }) => `${p.x},${p.y}`;
const S0 = 0.11; // depth where the tunnel mouth sits
const rail = (bx: number) => { const a = at(S0, bx, H), b = at(1.05, bx, H); return { a, b }; };

export const PLATFORM: Record<string, BandSpec> = {
  /** back wall, tunnel mouth, track bed, rails, platform floor + yellow line */
  'platform/bg': {
    blur: 1,
    node: () => {
      const e0 = at(S0, EDGE.x, EDGE.y), e1 = at(1.1, EDGE.x, EDGE.y);
      const y0 = at(S0, 0, H), y1 = at(1.1, 270, H);
      return (
        <g>
          <defs>
            <linearGradient id="plFloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1c1f26" /><stop offset="0.5" stopColor="#262a33" /><stop offset="1" stopColor="#2a2e38" />
            </linearGradient>
            <linearGradient id="plBed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#07080c" /><stop offset="1" stopColor="#101218" />
            </linearGradient>
            <radialGradient id="plTun" cx="0.5" cy="0.55" r="0.6">
              <stop offset="0" stopColor="#0a0d14" /><stop offset="1" stopColor="#020306" />
            </radialGradient>
          </defs>
          <rect x={0} y={0} width={W} height={H} fill="#06080f" />
          {/* back wall */}
          <rect x={0} y={700} width={W} height={420} fill="#0e1119" />
          {/* tunnel mouth */}
          <path d={`M ${VP.x - 170} 1125 L ${VP.x - 170} 960 Q ${VP.x} 800 ${VP.x + 170} 960 L ${VP.x + 170} 1125 Z`} fill="#161a24" />
          <path d={`M ${VP.x - 140} 1125 L ${VP.x - 140} 970 Q ${VP.x} 840 ${VP.x + 140} 970 L ${VP.x + 140} 1125 Z`} fill="url(#plTun)" />
          {/* track bed */}
          <polygon points={`${pt(e0)} ${VP.x + 150},1125 ${W + 200},${H} ${pt(e1)}`} fill="url(#plBed)" />
          {Array.from({ length: 16 }, (_, i) => { const s = S0 + Math.pow(i / 15, 1.8) * 0.95; const a = at(s, 470, H), b = at(s, 1250, H); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#181b22" strokeWidth={2 + s * 18} />; })}
          {[560, 900].map((bx) => { const { a, b } = rail(bx); return <g key={bx}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2a313d" strokeWidth={14} /><line x1={a.x} y1={a.y - 2} x2={b.x} y2={b.y - 6} stroke="#8fb0cc" strokeWidth={4} opacity={0.75} /></g>; })}
          {/* platform floor (left) */}
          <polygon points={`0,${y0.y} ${pt(e0)} ${pt(e1)} -200,${H}`} fill="url(#plFloor)" />
          {/* edge face */}
          <polygon points={`${pt(e0)} ${e0.x + 2},${e0.y + 10} ${e1.x + 30},${e1.y + 120} ${pt(e1)}`} fill="#0b0d12" />
          <line x1={e0.x} y1={e0.y} x2={e1.x} y2={e1.y} stroke="#4a5262" strokeWidth={5} />
          {/* yellow safety line */}
          <polygon points={`${pt(at(S0, 330, H))} ${pt(at(S0, 290, H))} ${pt(y1)} ${pt(at(1.1, 330, H))}`} fill="#e8c547" opacity={0.85} />
        </g>
      );
    },
  },
  /** canopy underside, lamp housings, light pools on the floor, pillars */
  'platform/mid': {
    node: () => {
      const lamps = [0.16, 0.24, 0.36, 0.55, 0.85];
      const pillars = [0.2, 0.33, 0.52];
      return (
        <g>
          <defs>
            <radialGradient id="plPool"><stop offset="0" stopColor="#d9f0ff" stopOpacity={0.32} /><stop offset="0.5" stopColor="#5a7a96" stopOpacity={0.14} /><stop offset="1" stopColor="#5a7a96" stopOpacity={0} /></radialGradient>
            <radialGradient id="plHalo"><stop offset="0" stopColor="#d9f0ff" stopOpacity={0.55} /><stop offset="1" stopColor="#d9f0ff" stopOpacity={0} /></radialGradient>
            <linearGradient id="plRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05060a" /><stop offset="1" stopColor="#141822" /></linearGradient>
          </defs>
          {/* canopy underside */}
          <polygon points={`-100,-100 ${W + 100},-100 ${W + 100},120 ${VP.x + 180},860 ${VP.x - 200},860 -100,560`} fill="url(#plRoof)" />
          <line x1={VP.x - 200} y1={860} x2={-100} y2={560} stroke="#2a3140" strokeWidth={6} />
          <line x1={VP.x + 180} y1={860} x2={W + 100} y2={120} stroke="#1c222e" strokeWidth={6} />
          {[0.25, 0.4, 0.6, 0.85].map((s) => { const a = at(s, -300, 300), b = at(s, W + 300, -400); return <line key={s} x1={a.x} y1={a.y - 140 * s} x2={b.x} y2={b.y} stroke="#0b0d13" strokeWidth={10 + s * 30} />; })}
          {/* floor pools */}
          {lamps.map((s) => { const f = at(s, 60, H); return <ellipse key={`p${s}`} cx={f.x + 40 * s} cy={f.y} rx={520 * s} ry={110 * s} fill="url(#plPool)" />; })}
          {/* pillars */}
          {pillars.map((s) => { const x = VP.x - s * 1000, w = 16 + s * 90; const top = 860 - s * 900, bot = VP.y + s * 1220; return <g key={s}><rect x={x - w / 2} y={top} width={w} height={bot - top} fill="#11131a" /><rect x={x + w / 2 - w * 0.18} y={top} width={w * 0.18} height={bot - top} fill="#2c3646" /></g>; })}
          {/* lamp tubes */}
          {lamps.map((s) => { const c = at(s, 120, -120); const L = 40 + s * 330; return <g key={`l${s}`}><ellipse cx={c.x} cy={c.y + 8 * s} rx={L * 0.9} ry={30 + 120 * s} fill="url(#plHalo)" /><rect x={c.x - L / 2} y={c.y - 5 * s} width={L} height={4 + 18 * s} rx={4} fill="#1a1e28" /><rect x={c.x - L / 2 + 4} y={c.y + 6 * s} width={L - 8} height={3 + 10 * s} rx={3} fill="#eef8ff" /></g>; })}
        </g>
      );
    },
  },
  /** foreground pillar (left frame edge) + roof beam: near-black framing */
  'platform/near': {
    node: () => (
      <g>
        <rect x={20} y={-100} width={170} height={H + 200} fill="#05060a" />
        <rect x={180} y={-100} width={8} height={H + 200} fill="#5a7a96" opacity={0.5} />
        <polygon points={`-100,-100 ${W + 100},-100 ${W + 100},230 -100,330`} fill="#05060a" />
        <line x1={-100} y1={330} x2={W + 100} y2={230} stroke="#3a4a5e" strokeWidth={4} opacity={0.6} />
      </g>
    ),
  },
};
