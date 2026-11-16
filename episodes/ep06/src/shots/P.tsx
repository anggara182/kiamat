import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { BackFigure, FigSpec } from '../art/roads_people';
import { NIGHT, DAWN } from '../sets/roads';

const { fontFamily: TITLE_FONT } = loadCinzel('normal', { weights: ['600', '700'], subsets: ['latin'] });

/** Live layers are in world space; Fr shifts to FRAME coords (frame = world - (108,192)). */
const Fr: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const bump = (t: number, a: number, d: number) => { const u = clamp01((t - a) / d); return Math.sin(Math.PI * u); };
const hash = (i: number) => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };

/* ============ shot 18 (night): headlights converge on the river; a roadside radio glows; a trucker swings the wheel ============ */
export const S18: React.FC = () => {
  const { t, t2, p } = useShot();
  const tb = wordAt(18, /^border/i, 0.79);
  const more = ramp(t, tb, tb + 0.25, EOUT); // headlights multiply on "border"
  const cam: Cam = { zoom: 1.03 + 0.03 * p, dx: 0, dy: 0, tx: 30 - 60 * EIO(p), ty: 0, ox: 560, oy: 900 };
  const { vp, roads } = NIGHT;
  // vehicles on the roads heading for the river (environment, on ones): u = 0 near .. 1 at the river
  const cars = Array.from({ length: 60 }, (_, i) => ({ road: i % roads.length, u0: hash(i), sp: 0.05 + hash(i + 7) * 0.05, extra: i >= 18 }));
  const wheel = 18 * Math.sin(t2 * 2.4) + 40 * ramp(t2, 1.2, 1.8, EIO); // the trucker swings the wheel, on twos
  return (
    <AbsoluteFill style={{ backgroundColor: '#070b16' }}>
      <BandImg id="roads/night" k={0.9} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <defs>
            <radialGradient id="p18h" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff3d0" stopOpacity={0.9} /><stop offset="1" stopColor="#fff3d0" stopOpacity={0} /></radialGradient>
            <radialGradient id="p18l" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffcf86" stopOpacity={0.6} /><stop offset="1" stopColor="#ffcf86" stopOpacity={0} /></radialGradient>
          </defs>
          {cars.map((c, i) => {
            if (c.extra && more <= 0) return null;
            const u = (c.u0 + t * c.sp) % 1, k = Math.pow(1 - u, 1.6);
            const x = vp.x + roads[c.road] * k, y = vp.y + 1430 * k, s = 2 + 26 * k;
            return (
              <g key={i} opacity={c.extra ? more : 1}>
                <path d={`M${x - s} ${y} L${x + s} ${y} L${vp.x + (x - vp.x) * 0.7 + s * 0.3} ${vp.y + (y - vp.y) * 0.7} L${vp.x + (x - vp.x) * 0.7 - s * 0.3} ${vp.y + (y - vp.y) * 0.7} Z`} fill="#fff3d0" opacity={0.08} />
                <ellipse cx={x} cy={y} rx={s * 2.2} ry={s * 1.2} fill="url(#p18h)" />
                {[-1, 1].map((d) => <circle key={d} cx={x + d * s * 0.6} cy={y} r={Math.max(1.2, s * 0.22)} fill="#fff3d0" />)}
              </g>
            );
          })}
          {/* far headlights crawling along the horizon from both sides */}
          {Array.from({ length: 24 }, (_, i) => {
            if (i >= 8 && more <= 0) return null;
            const side = i % 2 ? 1 : -1, u = (hash(i + 3) + t * 0.06) % 1;
            return <circle key={`h${i}`} cx={vp.x + side * (700 - 640 * u)} cy={vp.y - 6 + 3 * hash(i)} r={2.5} fill="#fff3d0" opacity={(i >= 8 ? more : 1) * 0.9} />;
          })}
          {/* roadside tea stall, left: awning, table, a glowing radio, lamp */}
          <g transform="translate(-40 1060)">
            <ellipse cx={200} cy={110} rx={340} ry={240} fill="url(#p18l)" />
            <path d="M-100 -60 L420 -40 L400 0 L-100 -10 Z" fill="#3a2a22" />
            <rect x={380} y={-40} width={14} height={420} fill="#1a1410" />
            <rect x={-100} y={210} width={470} height={24} fill="#5a3e2a" />
            <rect x={-100} y={234} width={470} height={200} fill="#2a1e16" />
            <rect x={150} y={120} width={130} height={90} rx={12} fill="#4a3a2e" />
            <circle cx={185} cy={165} r={24} fill="#1a1410" />
            <rect x={222} y={138} width={44} height={24} rx={4} fill="#ffcf86" opacity={0.75 + 0.2 * Math.sin(t * 9)} />
            <path d="M266 120 L300 40" stroke="#8a8a8a" strokeWidth={3} />
            {[40, 90].map((x, k) => <g key={x}><rect x={x} y={160} width={30} height={50} rx={6} fill="#c98a5a" opacity={0.7} /><path d={`M${x + 15} 156 C${x + 5 + 8 * Math.sin(t * 2 + k)} 120 ${x + 26} 100 ${x + 14 + 6 * Math.sin(t * 2.5 + k)} 70`} stroke="#e6dccc" strokeWidth={6} fill="none" opacity={0.25} strokeLinecap="round" /></g>)}
            <circle cx={60} cy={10} r={14} fill="#fff1c9" />
          </g>
          {/* truck cab, right: the trucker swings the wheel (ON TWOS) */}
          <g transform="translate(640 1000)">
            <path d="M0 80 Q0 30 60 30 L470 0 L470 620 L0 640 Z" fill="#4a1e1a" />
            <path d="M340 40 L340 600" stroke="#2a100e" strokeWidth={6} />
            <rect x={360} y={330} width={60} height={14} rx={6} fill="#8a8a8a" />
            <path d="M0 520 Q120 400 260 520 Z" fill="#1a0c0a" />
            <circle cx={130} cy={600} r={90} fill="#0c0c0e" /><circle cx={130} cy={600} r={36} fill="#3a3a3a" />
            <path d="M40 80 L320 60 L320 300 L40 320 Z" fill="#141820" />
            <rect x={40} y={260} width={280} height={60} fill="#ffcf86" opacity={0.15} />
            {/* driver: shoulders + head in silhouette with a dash-light rim */}
            <g transform={`translate(${190 + 4 * Math.sin(t2 * 2.4)} 0)`}>
              <path d="M-90 320 C-80 250 -40 230 0 228 C40 230 80 250 90 320 Z" fill="#0c0d12" />
              <ellipse cx={0} cy={180} rx={42} ry={50} fill="#0c0d12" />
              <path d="M-30 140 Q0 118 34 136" stroke="#ffcf86" strokeWidth={3} fill="none" opacity={0.7} />
              <path d={`M-70 290 L${-10 + wheel * 0.6} 250 M70 290 L${40 + wheel * 0.6} 252`} stroke="#0c0d12" strokeWidth={22} strokeLinecap="round" />
            </g>
            <g transform={`translate(220 262) rotate(${wheel}) scale(1 0.42)`}>
              <circle r={70} fill="none" stroke="#1c1c22" strokeWidth={14} />
              {[0, 120, 240].map((a) => <line key={a} x1={0} y1={0} x2={70 * Math.cos((a * Math.PI) / 180)} y2={70 * Math.sin((a * Math.PI) / 180)} stroke="#1c1c22" strokeWidth={8} />)}
            </g>
            <path d="M0 40 L470 0" stroke="#a9b8d6" strokeWidth={3} opacity={0.5} />
            <rect x={-60} y={120} width={44} height={110} rx={8} fill="#1c1c22" /><path d="M-16 160 L0 150" stroke="#1c1c22" strokeWidth={6} /><rect x={-56} y={126} width={36} height={98} rx={6} fill="#a9b8d6" opacity={0.25} />
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 19 (dawn, cliffhanger): endless lines walking to the river; the camera rises on "million" ============ */
const WALK: FigSpec = { skin: '#1c1416', hair: 'short', hairC: '#1c1416', top: '#1c1416', topD: '#1c1416', legs: '#1c1416' };
export const S19: React.FC = () => {
  const { t, t2, p } = useShot();
  const tm = wordAt(19, /^million/i, 0.29);
  const rise = ramp(t, tm - 0.1, tm + 1.3, EIO); // the camera rises off the nearest walkers to reveal the scale
  const beat = (x: number) => Math.max(bump(x % 0.85, 0, 0.09), 0.6 * bump(x % 0.85, 0.15, 0.08));
  const cam: Cam = { zoom: 1.65 - 0.65 * rise + 0.01 * beat(t), dx: 0, dy: 0, tx: 0, ty: -260 * (1 - rise), ox: 560, oy: 1500 };
  const { vp } = DAWN;
  const lanes = [-1700, -1100, -620, -200, 220, 680, 1150, 1700];
  const walkers = [] as React.ReactNode[];
  lanes.forEach((x0, li) => {
    for (let j = 0; j < 46; j++) {
      const u = (j / 46 + t2 * 0.012 + hash(li * 7) * 0.02) % 1;
      const k = Math.pow(1 - u, 1.8);
      const x = vp.x + x0 * k + 18 * Math.sin(j * 1.7 + li), y = vp.y + 1700 * k + 4, s = 3 + 70 * k;
      const bob = Math.abs(Math.sin(t2 * 6 + j)) * s * 0.06;
      walkers.push(
        <g key={`${li}-${j}`} transform={`translate(${x} ${y - bob})`}>
          <ellipse cx={0} cy={-s * 1.75} rx={s * 0.22} ry={s * 0.26} fill="#1c1416" />
          <path d={`M${-s * 0.3} ${-s * 1.5} L${s * 0.3} ${-s * 1.5} L${s * 0.22} ${-s * 0.7} L${s * 0.18} 0 L${-s * 0.18} 0 L${-s * 0.22} ${-s * 0.7} Z`} fill="#1c1416" />
          {j % 3 === 0 && <path d={`M${s * 0.25} ${-s * 1.45} L${s * 0.6} ${-s * 2.3}`} stroke="#1c1416" strokeWidth={Math.max(1, s * 0.08)} />}
          {s > 12 && <path d={`M${-s * 0.3} ${-s * 1.5} L${s * 0.3} ${-s * 1.5}`} stroke="#ffcf86" strokeWidth={Math.max(1, s * 0.05)} opacity={0.6} />}
        </g>,
      );
    }
  });
  // the nearest walkers, seen from behind: a father with a child on his shoulders, a man with a shovel, a woman with a sack
  const near = [
    { x: 380, y: 1960, s: 0.62, kind: 'child' }, { x: 640, y: 1900, s: 0.56, kind: 'shovel' }, { x: 880, y: 1990, s: 0.6, kind: 'sack' },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: '#2b2440' }}>
      <BandImg id="roads/dawn" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <defs><radialGradient id="p19d" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd79a" stopOpacity={0.35} /><stop offset="1" stopColor="#ffd79a" stopOpacity={0} /></radialGradient></defs>
          {walkers}
          {/* dust lit gold, drifting (on ones) */}
          {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={((hash(i) * 1400 + t * 40) % 1500) - 200} cy={DAWN.hy + 200 + hash(i + 2) * 1400} rx={260} ry={60} fill="url(#p19d)" />)}
          {near.map((n, i) => {
            const sway = 10 * Math.sin(t2 * 6 + i * 2);
            const hl = { x: -150, y: -560 + sway }, hr = { x: 150, y: -560 - sway };
            return (
              <g key={i} transform={`translate(${n.x} ${n.y - Math.abs(Math.sin(t2 * 6 + i)) * 8}) scale(${n.s})`}>
                {n.kind === 'shovel' && <g transform={`translate(${130} ${-880}) rotate(-30)`}><rect x={-8} y={-300} width={16} height={460} fill="#1c1416" /><path d="M-40 -300 L40 -300 L34 -390 Q0 -420 -34 -390 Z" fill="#1c1416" /></g>}
                <BackFigure f={WALK} handL={n.kind === 'child' ? { x: -120, y: -1000 } : hl} handR={n.kind === 'child' ? { x: 120, y: -1000 } : n.kind === 'shovel' ? { x: 120, y: -900 } : hr} />
                {n.kind === 'child' && <g transform="translate(0 -880) scale(0.45)"><BackFigure f={WALK} handL={{ x: -130, y: -1000 }} handR={{ x: 160, y: -1080 + 30 * Math.sin(t2 * 5) }} /></g>}
                {n.kind === 'sack' && <path d={`M120 -900 C240 -980 300 -820 240 -700 C200 -640 120 -660 100 -720 Z`} fill="#1c1416" />}
                <path d="M-100 -846 C-60 -872 60 -872 100 -846" stroke="#ffcf86" strokeWidth={6} fill="none" opacity={0.6} />
              </g>
            );
          })}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 20: title card over the dark riverbed ============ */
const SMOKE = Array.from({ length: 9 }, (_, i) => ({ x: (i * 377) % 1600, y: 300 + (i * 211) % 1300, r: 220 + (i % 3) * 90, v: 18 + (i % 4) * 9 }));
const TMOTES = Array.from({ length: 22 }, (_, i) => ({ x: (i * 397) % 1080, y: (i * 683) % 1920, r: 1.5 + (i % 4) * 0.9, sp: 8 + (i % 5) * 5, ph: i * 1.7 }));

export const S20: React.FC = () => {
  const { t, p } = useShot();
  const words: [string, number, number][] = [['THE', 0, 0.25], ['RIVER', 0, 0.42], ['RUNS', 1, 0.62], ['DRY', 1, 0.8]];
  const sub = ramp(t, 1.1, 1.7, EOUT), rule = ramp(t, 0.95, 1.5, EOUT);
  const glow = ramp(t, 0.1, 1.4, EOUT);
  const z = 1 + 0.045 * EIO(p);
  const line = (k: number) => words.filter((w) => w[1] === k).map(([w, , a0], j) => {
    const v = ramp(t, a0, a0 + 0.6, EOUT);
    return <span key={j} style={{ display: 'inline-block', opacity: v, transform: `translateY(${(1 - v) * 26}px)`, marginRight: '0.32em' }}>{w}</span>;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <BandImg id="roads/riverbed" k={1} cam={{ zoom: 1 + 0.03 * p, dx: 0, dy: 0 }} />
      <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="p25g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#d9a441" stopOpacity={0.22} /><stop offset="0.5" stopColor="#d9a441" stopOpacity={0.07} /><stop offset="1" stopColor="#d9a441" stopOpacity={0} /></radialGradient>
        </defs>
        <defs><radialGradient id="p16s" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#2a2228" stopOpacity={0.85} /><stop offset="1" stopColor="#2a2228" stopOpacity={0} /></radialGradient></defs>
        {SMOKE.map((s, k) => <ellipse key={k} cx={((s.x + t * s.v) % 1600) - 260} cy={s.y + 30 * Math.sin(t * 0.4 + k)} rx={s.r * 1.6} ry={s.r} fill="url(#p16s)" opacity={0.55} />)}
        <ellipse cx={540} cy={880} rx={620} ry={330} fill="url(#p25g)" opacity={glow} />
        {/* a faint gold glint in the riverbed below the title */}
        <g transform={`translate(560 1500) scale(${0.8 + 0.3 * Math.sin(t * 2.2) ** 2})`} opacity={0.5 + 0.3 * Math.sin(t * 2.2)}>
          <ellipse cx={0} cy={0} rx={90} ry={30} fill="url(#p25g)" />
          <path d="M-60 0 L0 -5 L60 0 L0 5 Z M0 -40 L4 0 L0 40 L-4 0 Z" fill="#fff0b0" />
        </g>
        {TMOTES.map((m, k) => {
          const y = (((m.y - t * m.sp) % 1920) + 1920) % 1920, x = m.x + Math.sin(t * 0.6 + m.ph) * 14;
          return <circle key={k} cx={x} cy={y} r={m.r} fill="#f1ead8" opacity={(0.12 + 0.12 * Math.sin(t * 1.3 + m.ph)) * glow} />;
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${z})`, transformOrigin: '540px 880px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -160, width: 920 }}>
          <div style={{ fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 90, letterSpacing: '0.08em', color: '#f1ead8', lineHeight: 1.18, textAlign: 'center', whiteSpace: 'nowrap', paddingLeft: '0.32em' }}>
            <div>{line(0)}</div>
            <div>{line(1)}</div>
          </div>
          <div style={{ width: 320, height: 2, marginTop: 44, transform: `scaleX(${rule})`, background: `linear-gradient(90deg, rgba(217,164,65,0), ${GREEN}, rgba(217,164,65,0))` }} />
          <div style={{ marginTop: 34, fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 30, letterSpacing: '0.32em', paddingLeft: '0.32em', color: GREEN, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`, whiteSpace: 'nowrap' }}>CHAPTER 6 · THE LAST DAYS</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
