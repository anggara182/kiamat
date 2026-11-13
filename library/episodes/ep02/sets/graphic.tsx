import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';
import { MegaMendung } from '../art/Sky';

/** Set E: graphic shots. 16 = POV into dark water; 17 = end card. (2 uses beach/soft.) */
export const DEEP_C = { x: W / 2, y: H * 0.56 };

const Deep: React.FC = () => {
  const r = rng(901);
  const rays = Array.from({ length: 16 }, () => ({ a: (r() - 0.5) * 1.6, w: 0.02 + r() * 0.06, o: 0.05 + r() * 0.1 }));
  return (
    <g>
      <defs>
        <radialGradient id="deepG" cx="0.5" cy="0.56" r="0.75">
          <stop offset="0" stopColor="#03100f" />
          <stop offset="0.35" stopColor="#0a2228" />
          <stop offset="0.75" stopColor="#173040" />
          <stop offset="1" stopColor="#2a3550" />
        </radialGradient>
        <linearGradient id="rayG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9a87a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#c9a87a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#deepG)" />
      {/* last of the sunset filtering down from the surface behind the camera, converging into the deep */}
      {rays.map((k, i) => {
        const x0 = DEEP_C.x + Math.sin(k.a) * 1400, y0 = -200;
        const spread = k.w * 1400;
        return <path key={i} d={`M ${x0 - spread} ${y0} L ${x0 + spread} ${y0} L ${DEEP_C.x + k.a * 30} ${DEEP_C.y} Z`} fill="url(#rayG)" opacity={k.o} />;
      })}
      {/* surface ripples ring at the frame edges */}
      <ellipse cx={DEEP_C.x} cy={DEEP_C.y} rx={W * 0.9} ry={H * 0.62} fill="none" stroke="#5a5a7a" strokeWidth={120} opacity={0.18} />
    </g>
  );
};
/** Seaweed silhouettes at the edges, close to the lens, so the push-in has parallax. */
const Weeds: React.FC = () => {
  const r = rng(902);
  const blade = (x: number, y: number, h: number, bend: number, key: string) => (
    <path key={key} d={`M ${x - 16} ${y} C ${x - 10 + bend * 0.3} ${y - h * 0.4}, ${x + bend * 0.8} ${y - h * 0.7}, ${x + bend} ${y - h} C ${x + bend * 0.7 + 14} ${y - h * 0.7}, ${x + 18 + bend * 0.2} ${y - h * 0.4}, ${x + 16} ${y} Z`} fill="#06100f" />
  );
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => blade(-20 + i * 30 + r() * 20, H + 20, 500 + r() * 700, 80 + r() * 160, `l${i}`))}
      {Array.from({ length: 9 }, (_, i) => blade(W + 20 - i * 30 - r() * 20, H + 20, 500 + r() * 700, -80 - r() * 160, `r${i}`))}
    </g>
  );
};

const EndBg: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="endG" cx="0.5" cy="0.45" r="0.8">
        <stop offset="0" stopColor="#0f2a22" />
        <stop offset="0.6" stopColor="#081812" />
        <stop offset="1" stopColor="#030806" />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill="url(#endG)" />
    <MegaMendung cx={300} cy={430} w={600} h={150} lobes={6} seed={3} band={11} tones={['#06150f', '#0a2018', '#0e2a1f', '#123526', '#16402e', '#1b4c37']} opacity={0.8} />
    <MegaMendung cx={1030} cy={620} w={480} h={120} lobes={5} seed={9} band={10} tones={['#06150f', '#0b2219', '#103022', '#143d2b', '#1a4a35']} opacity={0.7} />
    <MegaMendung cx={980} cy={1950} w={620} h={150} lobes={6} seed={12} band={11} tones={['#06150f', '#0a2018', '#0e2a1f', '#123526', '#16402e', '#1b4c37']} opacity={0.6} />
    <MegaMendung cx={240} cy={2130} w={480} h={120} lobes={5} seed={21} band={10} tones={['#06150f', '#0b2219', '#103022', '#143d2b']} opacity={0.6} />
    {/* thin gold frame */}
    <rect x={160} y={260} width={W - 320} height={H - 520} fill="none" stroke="#c9a45c" strokeWidth={2} opacity={0.35} />
    <rect x={176} y={276} width={W - 352} height={H - 552} fill="none" stroke="#c9a45c" strokeWidth={1} opacity={0.2} />
  </g>
);

export const GRAPHIC: Record<string, BandSpec> = {
  'graphic/deep': { blur: 10, node: () => <Deep /> },
  'graphic/weeds': { blur: 7, node: () => <Weeds /> },
  'graphic/end': { blur: 0.5, node: () => <EndBg /> },
};
