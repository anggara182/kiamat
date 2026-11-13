import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "village" (owner V). Static depth bands, baked ONCE to public/baked/village/<band>.png. Ids must be "village/<band>". */
export const GROUND = 1500; // world y of the yard (frame ~1308)
export const GAP = { x: 1030, w: 70, top: 1080 }; // dark gap in the bamboo wall
export const HOUSE = { x: 250, w: 380, lampX: 470, lampY: 1330 };
export const WINDOWS: [number, number][] = [[316, 1372], [420, 1372], [176, 1236], [860, 1255]];

const Sky: React.FC<{ stops: string[]; id: string }> = ({ stops, id }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {stops.map((c, i) => <stop key={i} offset={(i / (stops.length - 1)) * 0.62} stopColor={c} />)}
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill={`url(#${id})`} />
  </g>
);

/** Far: hazy rooftops, mosque dome + minaret, palms. */
const Far: React.FC = () => {
  const r = rng(303);
  const roofs = Array.from({ length: 9 }, (_, i) => ({ x: i * 150 - 30 + r() * 40, w: 120 + r() * 60, h: 40 + r() * 40 }));
  return (
    <g fill="#2c2340">
      <rect x={0} y={1300} width={W} height={H - 1300} />
      {roofs.map((o, i) => <path key={i} d={`M ${o.x} 1310 L ${o.x + o.w / 2} ${1300 - o.h} L ${o.x + o.w} 1310 Z`} />)}
      {/* mosque */}
      <rect x={640} y={1180} width={170} height={130} />
      <path d="M 650 1182 Q 725 1060 800 1182 Z" />
      <rect x={722} y={1040} width={6} height={30} />
      <rect x={850} y={980} width={26} height={330} />
      <path d="M 846 984 L 863 930 L 880 984 Z" />
      {/* palms */}
      {[[120, 1080], [560, 1120], [1130, 1060]].map(([px, py], i) => (
        <g key={i}>
          <path d={`M ${px - 4} 1310 Q ${px + 10} ${(py + 1310) / 2} ${px + 18} ${py} L ${px + 24} ${py} Q ${px + 16} ${(py + 1310) / 2} ${px + 6} 1310 Z`} />
          {[-70, -30, 10, 50, 90, 140].map((a, k) => (
            <path key={k} transform={`rotate(${a} ${px + 21} ${py})`} d={`M ${px + 21} ${py} q 40 -14 90 18 q -50 -4 -90 -12 Z`} />
          ))}
        </g>
      ))}
    </g>
  );
};

/** Mid: house with porch (left), banana plants, yard, bamboo wall with its dark gap (right). */
const Mid: React.FC = () => {
  const { x, w } = HOUSE;
  return (
    <g>
      {/* yard */}
      <rect x={0} y={GROUND - 10} width={W} height={H - GROUND + 10} fill="#0d0a14" />
      <path d={`M 0 ${GROUND - 6} Q 600 ${GROUND - 24} ${W} ${GROUND - 4}`} stroke="#3a2a40" strokeWidth={3} fill="none" />
      {/* house: joglo-ish roof, walls, porch posts */}
      <rect x={x} y={1300} width={w} height={GROUND - 1300} fill="#1a1428" />
      <path d={`M ${x - 60} 1310 L ${x + 70} 1200 L ${x + w - 70} 1200 L ${x + w + 60} 1310 Z`} fill="#141020" />
      <path d={`M ${x + 70} 1200 L ${x + 120} 1140 L ${x + w - 120} 1140 L ${x + w - 70} 1200 Z`} fill="#141020" />
      {[x + 10, x + w / 2, x + w - 22].map((px, i) => <rect key={i} x={px} y={1310} width={12} height={GROUND - 1310} fill="#0d0a14" />)}
      {WINDOWS.slice(0, 2).map(([wx, wy], i) => <rect key={i} x={wx - 22} y={wy - 30} width={44} height={60} fill="#ffb35c" />)}
      <rect x={WINDOWS[0][0] - 2} y={WINDOWS[0][1] - 30} width={4} height={60} fill="#1a1428" />
      {/* banana plants */}
      {[[90, GROUND], [690, GROUND]].map(([bx, by], i) => (
        <g key={i} fill="#0d0a14">
          <rect x={bx - 8} y={by - 170} width={16} height={170} />
          {[-60, -20, 25, 70].map((a, k) => <path key={k} transform={`rotate(${a} ${bx} ${by - 170})`} d={`M ${bx} ${by - 170} q 50 -40 120 -10 q -70 20 -120 10 Z`} />)}
        </g>
      ))}
      {/* bamboo clump: two depth layers of separate stalks, sky visible between them */}
      {[0, 1].map((layer) => {
        const rr = rng(layer ? 91 : 55);
        const n = layer ? 9 : 11;
        const col = layer ? '#141c12' : '#33402f';
        const node = layer ? '#070a06' : '#232c20';
        const leaf = layer ? '#10170e' : '#2c3828';
        return (
          <g key={layer}>
            {layer === 1 && (
              <g>
                <defs>
                  <linearGradient id="vgapG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#05060a" stopOpacity={0} />
                    <stop offset="0.35" stopColor="#05060a" stopOpacity={0.85} />
                    <stop offset="1" stopColor="#020203" stopOpacity={1} />
                  </linearGradient>
                  <radialGradient id="vgapGlow"><stop offset="0" stopColor="#9fc0d8" stopOpacity={0.45} /><stop offset="1" stopColor="#9fc0d8" stopOpacity={0} /></radialGradient>
                </defs>
                <path d={`M ${GAP.x - 44} ${GROUND} Q ${GAP.x - 52} ${GAP.top + 240} ${GAP.x - 40} ${GAP.top - 40} Q ${GAP.x - 10} ${GAP.top - 90} ${GAP.x + 14} ${GAP.top - 60} Q ${GAP.x + 30} ${GAP.top - 120} ${GAP.x + 46} ${GAP.top - 30} Q ${GAP.x + 56} ${GAP.top + 260} ${GAP.x + 44} ${GROUND} Z`} fill="url(#vgapG)" />
                <ellipse cx={GAP.x} cy={GROUND - 14} rx={70} ry={30} fill="url(#vgapGlow)" />
              </g>
            )}
            {Array.from({ length: n }, (_, i) => {
              let sx = 735 + (i + (layer ? 0.5 : 0)) * ((W - 720) / n) + rr() * 18;
              if (layer && Math.abs(sx - GAP.x) < GAP.w * 0.6) sx += sx < GAP.x ? -40 : 40;
              const w = (layer ? 10 : 6) + rr() * (layer ? 8 : 5);
              const top = (layer ? 520 : 640) + rr() * 160;
              const bend = (rr() - 0.3) * (layer ? 120 : 80);
              const tx = sx + bend, ty = top;
              return (
                <g key={i}>
                  <path d={`M ${sx - w / 2} ${GROUND} L ${sx - w / 2} ${top + 260} Q ${sx - w / 2} ${top + 60} ${tx} ${ty} Q ${sx + w / 2} ${top + 60} ${sx + w / 2} ${top + 260} L ${sx + w / 2} ${GROUND} Z`} fill={col} />
                  {Array.from({ length: 5 }, (_, k) => (
                    <rect key={k} x={sx - w / 2 - 1} y={top + 300 + k * 140 + (i % 3) * 25} width={w + 2} height={2} fill={node} />
                  ))}
                  {[0, 1, 2].map((k) => {
                    const lx = tx + (sx - tx) * k * 0.25, ly = ty + k * 60;
                    const a = (bend > 0 ? 20 : 160) + (k - 1) * 30 + rr() * 20;
                    return (
                      <g key={k} transform={`rotate(${a} ${lx} ${ly})`} fill={leaf}>
                        <path d={`M ${lx} ${ly} q 26 -8 58 2 q -30 6 -58 -2 Z`} />
                        <path d={`M ${lx} ${ly} q 22 6 48 18 q -28 -2 -48 -18 Z`} />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

export const VILLAGE: Record<string, BandSpec> = {
  'village/sky': { node: () => <Sky id="vsky" stops={['#141233', '#3b2a5c', '#a2475a', '#f0874a']} /> },
  'village/skyblue': { node: () => <Sky id="vskyb" stops={['#0e1430', '#26375e', '#5d6a8a']} /> },
  'village/far': { blur: 2, node: () => <Far /> },
  'village/mid': { node: () => <Mid /> },
};
