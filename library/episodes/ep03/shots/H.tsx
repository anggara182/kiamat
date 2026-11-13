import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BandImg, Live, useShot, ramp, Cam, EIO, handheld } from '../comp/Camera';
import { BANANA, YARD_DY } from '../sets/home';
import { GrandmaWok, SleepingBoy, Sandals } from '../art/home_hero';

/* =============== Set "home" (owner H) =============== */

/** drifting mist wisps (live, flat ellipses, no filters) */
const Wisps: React.FC<{ t: number; y: number; n?: number; op?: number }> = ({ t, y, n = 4, op = 0.35 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <ellipse key={i} cx={((i * 380 + t * (14 + i * 6)) % 1700) - 200} cy={y + (i % 2) * 120 - i * 30} rx={340 + i * 40} ry={46 + i * 8} fill="#e8e0d4" opacity={op} />
    ))}
  </g>
);

/** 4 — insert, grandma's hands with wok + ladle under oil-lamp key from the left. Locked, slight push. */
export const S04: React.FC = () => {
  const { t, p } = useShot();
  const h = handheld(t, 0.25);
  const cam: Cam = { zoom: 1.18 + 0.07 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 560, oy: 760 };
  const lamp = 0.8 + 0.12 * Math.sin(t * 7.3) + 0.08 * Math.sin(t * 13.1 + 1);
  // ladle taps the rim on "bang" (~0.95 s) and on "pan" (~1.65 s), one softer echo after
  const hit = (a: number) => Math.sin(ramp(t, a, a + 0.22) * Math.PI);
  const tap = Math.max(hit(0.9), hit(1.6), 0.6 * hit(2.3));
  const ring = (a: number) => (t > a + 0.11 && t < a + 0.7 ? (t - a - 0.11) / 0.59 : -1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#140d0b', overflow: 'hidden' }}>
      <BandImg id="home/porch" cam={cam} />
      <Live cam={cam}>
        <defs>
          <radialGradient id="h4-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd08a" stopOpacity="0.65" /><stop offset="0.5" stopColor="#ffb35c" stopOpacity="0.25" /><stop offset="1" stopColor="#ffb35c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="h4-shade" x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0" stopColor="#0d0a14" stopOpacity="0" /><stop offset="0.55" stopColor="#0d0a14" stopOpacity="0.35" /><stop offset="1" stopColor="#0d0a14" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="h4-flame" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff2cc" /><stop offset="0.4" stopColor="#ffd08a" stopOpacity="0.8" /><stop offset="1" stopColor="#ffb35c" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* deep shadow away from the lamp, warm pool towards it */}
        <rect x={0} y={0} width={1296} height={2304} fill="url(#h4-shade)" />
        <ellipse cx={200} cy={520} rx={640} ry={620} fill="url(#h4-glow)" opacity={lamp} />
        {/* the lamp itself, just peeking in at the top-left edge */}
        <ellipse cx={130} cy={300} rx={90} ry={130} fill="url(#h4-flame)" opacity={0.55 + 0.4 * lamp} />
        {/* cast shadow of the wok, thrown to the lower right */}
        <ellipse cx={760} cy={1150} rx={360} ry={130} fill="#07050a" opacity={0.6} />
        <g transform="translate(640 960)">
          <GrandmaWok lamp={lamp} tap={tap} />
          {/* tap: small ring of sound/vibration on the rim where the ladle strikes */}
          {[0.9, 1.6, 2.3].map((a, i) => {
            const r = ring(a);
            return r < 0 ? null : (
              <g key={i} opacity={(1 - r) * (i === 2 ? 0.4 : 0.8)}>
                <path d={`M ${180 - 30 * r} ${-150 - 26 * r} q ${50 + 70 * r} ${-26 - 30 * r} ${110 + 120 * r} 8`} stroke="#ffd08a" strokeWidth={4 - 2 * r} fill="none" strokeLinecap="round" />
                <path d={`M ${150 - 50 * r} ${-120 + 10 * r} q ${-30 - 50 * r} ${-20 - 30 * r} ${-70 - 60 * r} ${-10}`} stroke="#ffd08a" strokeWidth={3 - 1.5 * r} fill="none" strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** soft morning light shafts from the upper right (flat gradient polygons) */
const Shafts: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs>
      <linearGradient id="h10-shaft" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff1cf" stopOpacity="0.55" /><stop offset="0.6" stopColor="#ffe2a8" stopOpacity="0.18" /><stop offset="1" stopColor="#ffe2a8" stopOpacity="0" />
      </linearGradient>
    </defs>
    {[[1150, 120, 0], [1010, 70, 1], [880, 150, 2], [700, 60, 3]].map(([x, w, i]) => (
      <path key={i} d={`M ${x} -100 L ${x + w} -100 L ${x - 520 + w * 1.6} 1500 L ${x - 520} 1500 Z`} fill="url(#h10-shaft)" opacity={0.55 + 0.25 * Math.sin(t * 0.7 + i * 1.9)} />
    ))}
  </g>
);

/** 10 — wide misty morning, boy asleep at the banana tree roots. Slow pull-back. */
export const S10: React.FC = () => {
  const { t, p } = useShot();
  const e = EIO(p);
  // roots of the tree in world space; the boy lives on the yard's depth (k 0.8) so he never drifts off the tree
  const root = { x: BANANA.x, y: BANANA.y + YARD_DY };
  const boy = { x: root.x - 150, y: root.y - 64 };
  const cam: Cam = { zoom: 1.35 - 0.33 * e, dx: 0, dy: 0, ox: boy.x - 108 - 50, oy: boy.y - 192 };
  const breath = 0.5 + 0.5 * Math.sin(t * 2.2);
  return (
    <AbsoluteFill style={{ backgroundColor: '#e8e0d4', overflow: 'hidden' }}>
      <BandImg id="home/sky" k={0.4} cam={cam} />
      <Live k={0.6} cam={cam}><Shafts t={t} /></Live>
      <BandImg id="home/yard" k={0.8} cam={cam} />
      <Live k={0.8} cam={cam}>
        <defs>
          <radialGradient id="h10-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffe2a8" stopOpacity="0.7" /><stop offset="0.55" stopColor="#ffd08a" stopOpacity="0.25" /><stop offset="1" stopColor="#ffc070" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={boy.x + 40} cy={boy.y + 20} rx={420} ry={200} fill="url(#h10-sun)" />
        <g transform={`translate(${boy.x} ${boy.y}) scale(1.4)`}><SleepingBoy breath={breath} /></g>
        <Wisps t={t} y={root.y + 180} n={3} op={0.2} />
      </Live>
      <BandImg id="home/mist" k={1.1} cam={cam} style={{ opacity: 0.45 }} />
    </AbsoluteFill>
  );
};

/** 11 — low angle, a woman's sandals at the edge of the bamboo, one tipped over, footprints leading in. Locked. */
export const S11: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1, dx: 0, dy: 0 };
  // sandals on the lower-left third (frame ~360, ~1150)
  const S = { x: 600, y: 1300 };
  const prints = Array.from({ length: 7 }, (_, i) => {
    const k = i / 6;
    return { x: S.x + 120 + k * 300 + (i % 2 ? 18 : -18) * (1 - k * 0.6), y: S.y - 70 - k * 150, s: 1.8 - k * 1.15, o: 0.7 - k * 0.45 };
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#c9ccd6', overflow: 'hidden' }}>
      <BandImg id="home/sky" k={0.3} cam={cam} />
      <BandImg id="home/bamboo" cam={cam} />
      <Live cam={cam}>
        <defs>
          <radialGradient id="h11-mist" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#eeeae2" stopOpacity="0.95" /><stop offset="0.6" stopColor="#e8e0d4" stopOpacity="0.5" /><stop offset="1" stopColor="#e8e0d4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="h11-stalk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0d120b" /><stop offset="0.7" stopColor="#1c2418" /><stop offset="1" stopColor="#2a3524" />
          </linearGradient>
        </defs>
        {/* bright mist bank behind the sandals = lightest value behind the hero */}
        <ellipse cx={S.x + 120} cy={S.y - 160} rx={620} ry={260} fill="url(#h11-mist)" />
        <Wisps t={t} y={1180} n={4} op={0.28} />
        {/* faint footprint trail leading into the bamboo */}
        {prints.map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y}) scale(${f.s} ${f.s * 0.45})`} opacity={f.o}>
            {[-34, 34].map((dx, j) => (
              <g key={j} transform={`translate(${dx + (j ? 0 : -6)} ${j ? -40 : 0}) rotate(${j ? 8 : -8})`} fill="#3e4a3e">
                <ellipse cx={0} cy={0} rx={24} ry={52} />
                <ellipse cx={0} cy={64} rx={18} ry={22} />
                {[-16, -6, 4, 13, 20].map((tx, k) => <circle key={k} cx={tx * (j ? -1 : 1)} cy={-60 + Math.abs(tx) * 0.4} r={k === 0 ? 7 : 4.5} />)}
              </g>
            ))}
          </g>
        ))}
        {/* hero: low angle squashes the sandals */}
        <ellipse cx={S.x + 10} cy={S.y + 46} rx={360} ry={48} fill="#2a3326" opacity={0.45} />
        <g transform={`translate(${S.x} ${S.y}) scale(1.2 0.78)`}><Sandals /></g>
      </Live>
      <BandImg id="home/mist" k={1} cam={cam} style={{ opacity: 0.35 }} />
      {/* foreground framing: dark bamboo bases at both edges + ground blades */}
      <Live cam={cam}>
        <rect x={0} y={0} width={180} height={2304} fill="url(#h11-stalk)" />
        <rect x={0} y={760} width={180} height={9} fill="#05080a" />
        <rect x={0} y={1420} width={180} height={9} fill="#05080a" />
        <rect x={1150} y={0} width={146} height={2304} fill="#0d120b" />
        <rect x={1150} y={1060} width={146} height={8} fill="#05080a" />
        <path d="M 1150 0 L 1156 0 L 1156 2304 L 1150 2304 Z" fill="#9fc0d8" opacity={0.35} />
        <path d="M 174 0 L 180 0 L 180 2304 L 174 2304 Z" fill="#9fc0d8" opacity={0.3} />
        <path d="M 0 0 C 14 -10, 40 -8, 56 0 C 40 8, 14 10, 0 0 Z" fill="#5a6b5a" transform={`translate(${760 - 90 * Math.sin(t * 1.3)} ${300 + t * 120}) rotate(${30 * Math.sin(t * 1.7)})`} />
        {[[180, 1700, -30], [320, 1760, -55], [1100, 1680, 30], [980, 1780, 50]].map(([x, y, r], i) => (
          <path key={i} d="M 0 0 C 20 -120, 60 -260, 140 -360 C 90 -240, 50 -120, 30 0 Z" transform={`translate(${x} ${y}) rotate(${r})`} fill="#0d120b" />
        ))}
      </Live>
    </AbsoluteFill>
  );
};
