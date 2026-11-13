import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { MirrorBg, FogPatch, CandleReflection, FogText, FOG } from '../art/graphic_fog';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: corm } = loadCormorant('italic', { weights: ['500'], subsets: ['latin'] });

const RED = GREEN; // episode accent (#ff3b4e)
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** shot 2 — title fogged on a dark mirror, one candle reflection, slow push. Art stays above 72%. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const r1 = ramp(p, 0.02, 0.42, EOUT);
  const r2 = ramp(p, 0.36, 0.62, EOUT);
  const red = ramp(t, wordAt(2, /^Bloody/, 0.55) - 0.1, wordAt(2, /^Bloody/, 0.55) + 0.4);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e1116' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.06 * z})`, transformOrigin: '540px 700px' }}>
        <MirrorBg id="g2" lx={540} ly={1050} />
        <FogPatch id="g2a" cx={540} cy={520} rx={560} ry={300} o={0.9} />
        <CandleReflection id="g2c" x={540} y={1180} s={1.05} t={t} />
        <FogText id="g2t1" x={540} y={500} size={128} font={cinzel} text="BLOODY" rev={ramp(r1, 0, 0.55)} spacing={10} drips={[352, 742]} />
        <FogText id="g2t2" x={540} y={650} size={128} font={cinzel} text="MARY" rev={ramp(r1, 0.45, 1)} spacing={14} drips={[690]} />
        {/* accent red wash under the name when it is spoken */}
        <rect x={250} y={700} width={580 * red} height={5} fill={RED} opacity={0.85} />
        <FogText id="g2t3" x={540} y={790} size={56} font={corm} weight={500} text="An American legend" rev={r2} spacing={3} o={0.9} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- shot 3: fingertip trace in fog drawing itself ---------------- */
/** handprint made of fog-cleared shapes; `k` 0..1 reveals palm then fingers. */
const Handprint: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => {
  const fingers: [number, number, number, number][] = [ // dx, dy(tip), len, angle
    [-74, -120, 120, -16], [-28, -165, 150, -5], [20, -170, 155, 4], [64, -140, 125, 14], [100, 10, 100, 52],
  ];
  const palm = ramp(k, 0, 0.3);
  return (
    <g transform={`translate(${x} ${y}) rotate(-8) scale(0.9)`}>
      <path d="M -95 -40 Q -100 80 -40 120 Q 30 140 80 100 Q 110 40 95 -50 Q 0 -80 -95 -40 Z" fill={FOG} opacity={0.18 * palm} transform="scale(1.12)" />
      <path d="M -95 -40 Q -100 80 -40 120 Q 30 140 80 100 Q 110 40 95 -50 Q 0 -80 -95 -40 Z" fill="#1b222b" opacity={0.85 * palm} />
      {fingers.map(([dx, dy, len, a], i) => {
        const fk = ramp(k, 0.25 + i * 0.12, 0.45 + i * 0.12);
        const r = (a * Math.PI) / 180;
        const bx = i === 4 ? 85 : dx * 0.95, by = i === 4 ? 10 : -50;
        const tx = bx + Math.sin(r) * len, ty = by - Math.cos(r) * len;
        const d = `M ${bx} ${by} L ${tx} ${ty}`;
        return (
          <g key={i} opacity={fk > 0.01 ? 0.85 : 0}>
            <path d={d} pathLength={1} strokeDasharray={`${fk} 1`} stroke={FOG} strokeOpacity={0.2} strokeWidth={50} strokeLinecap="round" />
            <path d={d} pathLength={1} strokeDasharray={`${fk} 1`} stroke="#1b222b" strokeWidth={36} strokeLinecap="round" />
          </g>
        );
      })}
      {/* drips under palm */}
      {[-50, 10, 60].map((dx, i) => (
        <path key={i} d={`M ${dx} 128 q 3 40 0 ${60 + i * 30}`} pathLength={1} strokeDasharray={`${ramp(k, 0.75, 1)} 1`} opacity={k > 0.76 ? 1 : 0} stroke={FOG} strokeOpacity={0.35} strokeWidth={7} strokeLinecap="round" fill="none" />
      ))}
    </g>
  );
};

/** "MARY" as finger strokes (letter-local coords, 170 wide x 300 tall), in drawing order. */
const LETTERS: { x: number; strokes: string[]; drips: [number, number][] }[] = [
  { x: 115, strokes: ['M 4 300 L 14 6 L 86 196 L 158 4 L 168 300'], drips: [[4, 300], [168, 300]] },
  { x: 325, strokes: ['M 0 300 L 86 4 L 172 300', 'M 34 190 L 140 186'], drips: [[0, 300], [172, 300]] },
  { x: 540, strokes: ['M 10 300 L 8 8 C 150 -6 172 150 12 152 L 70 154 L 166 300'], drips: [[10, 300], [166, 300]] },
  { x: 752, strokes: ['M 0 4 L 86 150 L 172 2', 'M 86 150 L 88 300'], drips: [[88, 300]] },
];
const LY = 520; // letter top (frame y); bottom 820 + drips, well above caption zone

const Stroke: React.FC<{ d: string; k: number }> = ({ d, k }) => (
  <g opacity={k > 0.003 ? 1 : 0}>
    {/* fog pushed aside at the edges */}
    <path d={d} pathLength={1} strokeDasharray={`${k} 1`} fill="none" stroke={FOG} strokeOpacity={0.2} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" />
    {/* clear glass streak */}
    <path d={d} pathLength={1} strokeDasharray={`${k} 1`} fill="none" stroke="#18202a" strokeOpacity={0.9} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
    {/* cold reflection inside the streak */}
    <path d={d} pathLength={1} strokeDasharray={`${k} 1`} fill="none" stroke="#9fb3c8" strokeOpacity={0.3} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" transform="translate(-5 -4)" />
  </g>
);

export const S03: React.FC = () => {
  const { p, t, sec } = useShot();
  const z = EIO(p);
  const ta = wordAt(3, /^answers/, 0.75);
  // whole word traced by itself over the shot; done shortly after "answers", always before the end
  const end = Math.min(Math.max(1, sec) - 0.6, ta + 0.8);
  const k = ramp(t, 0.25, Math.max(0.8, end), (x) => x);
  const strokes = LETTERS.flatMap((L) => L.strokes.map((d) => ({ d, x: L.x })));
  const n = strokes.length;
  const sk = (i: number) => Math.min(1, Math.max(0, k * n - i));
  let si = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e1116' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.03 + 0.06 * z})`, transformOrigin: '540px 700px' }}>
        <MirrorBg id="g3" lx={900} ly={1600} warm={0.3} />
        {/* overall breath haze on the glass */}
        <rect x={52} y={72} width={976} height={1776} rx={10} fill="#a9bacb" opacity={0.1} />
        <FogPatch id="g3f" cx={540} cy={720} rx={640} ry={720} o={1} />
        <FogPatch id="g3g" cx={540} cy={680} rx={460} ry={420} o={0.9} />
        <g transform="translate(540 680) scale(0.86) translate(-540 -680)">
        {LETTERS.map((L, li) => {
          const first = si;
          si += L.strokes.length;
          const done = sk(si - 1);
          return (
            <g key={li} transform={`translate(${L.x} ${LY})`}>
              {L.strokes.map((d, j) => <Stroke key={j} d={d} k={sk(first + j)} />)}
              {L.drips.map(([dx, dy], j) => {
                const dk = done >= 1 ? ramp(k * n - (si - 1), 1, 2.2 + j * 0.4) : 0;
                const len = 70 + ((li * 3 + j * 5) % 4) * 22;
                return (
                  <g key={j} opacity={dk > 0.01 ? 1 : 0}>
                    <path d={`M ${dx} ${dy + 6} q 3 ${len * 0.5} 0 ${len}`} pathLength={1} strokeDasharray={`${dk} 1`} fill="none" stroke="#18202a" strokeOpacity={0.85} strokeWidth={9} strokeLinecap="round" />
                    <circle cx={dx + 1} cy={dy + 6 + len * dk} r={7 * dk} fill="#9fb3c8" opacity={0.35} />
                  </g>
                );
              })}
            </g>
          );
        })}
        </g>
        {/* cold condensation beads */}
        {[[180, 300], [900, 300], [220, 1180], [880, 1120], [430, 240], [700, 1260]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5 + (i % 3) * 2} fill={FOG} opacity={0.3} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- shot 13: CTA ---------------- */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const cap = Math.max(0.5, sec - 0.6);
  const at = (re: RegExp, fb: number) => Math.min(wordAt(13, re, fb), cap - 0.35);
  const w1 = ramp(t, at(/^Would/, 0.05), at(/^Would/, 0.05) + 0.6, EOUT);
  const w2 = ramp(t, at(/^three/, 0.35), at(/^three/, 0.35) + 0.4, EOUT);
  const w3 = ramp(t, at(/^Comment/, 0.55), at(/^Comment/, 0.55) + 0.5, EOUT);
  const yes = ramp(t, at(/^YES/, 0.68), at(/^YES/, 0.68) + 0.3, EOUT);
  const no = ramp(t, at(/^NO/, 0.85), at(/^NO/, 0.85) + 0.3, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e1116' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <MirrorBg id="g13" lx={540} ly={1500} />
        <FogPatch id="g13f" cx={540} cy={760} rx={560} ry={460} o={0.95} />
        <g opacity={0.3}><Handprint x={870} y={330} k={1} /></g>
        <FogText id="g13a" x={540} y={600} size={84} font={cinzel} text="Would you say it" rev={w1} spacing={2} drips={[300, 760]} />
        <g opacity={w2}>
          <text x={540} y={760} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={112} letterSpacing={4} fill={RED}>three</text>
        </g>
        <FogText id="g13b" x={540} y={880} size={84} font={cinzel} text="times?" rev={w2} spacing={2} />
        <FogText id="g13c" x={540} y={1060} size={64} font={corm} weight={500} text="Comment" rev={w3} spacing={2} />
        <g opacity={yes} transform={`translate(${360} 1210) scale(${0.9 + 0.1 * yes})`}>
          <rect x={-130} y={-80} width={260} height={110} rx={20} fill="none" stroke={RED} strokeWidth={4} />
          <text x={0} y={8} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={80} fill={RED}>YES</text>
        </g>
        <text x={540} y={1218} textAnchor="middle" fontFamily={corm} fontSize={56} fill={FOG} opacity={0.7 * Math.max(yes, no)}>or</text>
        <g opacity={no} transform={`translate(${720} 1210) scale(${0.9 + 0.1 * no})`}>
          <rect x={-130} y={-80} width={260} height={110} rx={20} fill="none" stroke={RED} strokeWidth={4} />
          <text x={0} y={8} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={80} fill={RED}>NO</text>
        </g>
        <CandleReflection id="g13c" x={540} y={1560} s={0.95} t={t} />
      </svg>
    </AbsoluteFill>
  );
};
