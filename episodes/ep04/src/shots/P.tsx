import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Figure, FigSpec } from '../art/exodus_people';
import { OFFICE, GATE } from '../sets/exodus';

const { fontFamily: TITLE_FONT } = loadCinzel('normal', { weights: ['600', '700'], subsets: ['latin'] });

/** Live layers are in world space; Fr shifts to FRAME coords (frame = world - (108,192)). */
const Fr: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const bump = (t: number, a: number, d: number) => { const u = clamp01((t - a) / d); return Math.sin(Math.PI * u); };
const SKIN = { skin: '#b07a5e', shade: '#7a4f3e', deep: '#4f3026' };

/* ---------------- cast (new characters) ---------------- */
const CAST: Record<string, FigSpec> = {
  doctor: { skin: '#9c6b52', hair: 'short', hairC: '#151110', top: '#5f7f8a', topD: '#3e5a64', legs: '#2e3440' },
  teacher: { skin: '#c48d6e', hair: 'scarf', hairC: '#6a4a7a', top: '#d9c9a8', topD: '#b0a080', legs: '#3a3a44', coat: true },
  engineer: { skin: '#8a5a44', hair: 'short', hairC: '#1a1512', top: '#c9a24a', topD: '#94742c', legs: '#3a4a5e' },
  child: { skin: '#c48d6e', hair: 'long', hairC: '#1a1412', top: '#c4504a', topD: '#943a34', legs: '#2e3a5e' },
  loud: { skin: '#9c6b52', hair: 'bald', hairC: '#2a2420', top: '#8a2e2a', topD: '#5e1e1a', legs: '#2a2a30' },
};

/* ============ shot 14 (day, quote): an abandoned council office, dust in one beam, the empty chair ============ */
const MOTES = Array.from({ length: 34 }, (_, i) => ({ u: ((i * 0.618) % 1), v: ((i * 0.377) % 1), r: 2 + (i % 3), sp: 0.02 + (i % 5) * 0.008, ph: i * 1.3 }));
export const S14: React.FC = () => {
  const { t, p } = useShot();
  const cam: Cam = { zoom: 1 + 0.09 * EIO(p), dx: 0, dy: 0, tx: -20 * p, ty: 0, ox: 620, oy: 1120 };
  const W0 = OFFICE.win, C = OFFICE.chair;
  // beam polygon: from the window to the floor beyond the desk
  const beam = `M${W0.x + W0.w} ${W0.y} L${W0.x + W0.w} ${W0.y + W0.h} L1000 1560 L760 1300 Z`;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0a08' }}>
      <BandImg id="exodus/office" k={0.8} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <defs>
            <linearGradient id="p14b" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stopColor="#d9b27a" stopOpacity={0.42} /><stop offset="1" stopColor="#d9b27a" stopOpacity={0.04} /></linearGradient>
            <clipPath id="p14bc"><path d={beam} /></clipPath>
          </defs>
          {/* the empty high-backed chair behind the desk, its shadow thrown by the beam */}
          <path d={`M${C.x - 40} 1200 L${C.x + 260} 1250 L${C.x + 300} 1290 L${C.x - 10} 1250 Z`} fill="#000" opacity={0.35} />
          <rect x={C.x - 130} y={C.y - 330} width={260} height={360} rx={60} fill="#3a2618" />
          <rect x={C.x - 110} y={C.y - 310} width={220} height={90} rx={40} fill="#2a1c16" />
          <path d={`M${C.x - 130} ${C.y - 260} Q${C.x - 140} ${C.y - 330} ${C.x - 60} ${C.y - 330}`} stroke="#e8c48a" strokeWidth={7} fill="none" opacity={0.9} />
          <path d={`M${C.x - 130} ${C.y - 200} L${C.x - 130} ${C.y + 20}`} stroke="#e8c48a" strokeWidth={5} opacity={0.6} />
          <path d={beam} fill="url(#p14b)" />
          <g clipPath="url(#p14bc)">
            {MOTES.map((m, i) => {
              const u = (m.u + t * m.sp) % 1, x = W0.x + W0.w + u * 900, y = W0.y + m.v * W0.h + u * 500 + 18 * Math.sin(t * 0.7 + m.ph);
              return <circle key={i} cx={x} cy={y} r={m.r} fill="#f6e2b8" opacity={0.35 + 0.3 * Math.sin(t * 1.1 + m.ph)} />;
            })}
          </g>
          {/* a loose curtain edge at the window, breathing in the draught */}
          <path d={`M${W0.x + W0.w - 20} ${W0.y - 20} L${W0.x + W0.w + 30} ${W0.y - 20} C${W0.x + W0.w + 40 + 10 * Math.sin(t * 0.9)} ${W0.y + 200} ${W0.x + W0.w + 20 + 14 * Math.sin(t * 0.9 + 1)} ${W0.y + 360} ${W0.x + W0.w + 36} ${W0.y + W0.h + 30} L${W0.x + W0.w - 20} ${W0.y + W0.h + 30} Z`} fill="#3a2a1e" />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 15 (day): experts with suitcases board a bus; a child waves; the door closes on "bags" ============ */
const Suitcase: React.FC<{ c: string }> = ({ c }) => (
  <g><rect x={-20} y={-6} width={40} height={14} rx={6} fill="none" stroke="#1d1a18" strokeWidth={8} /><rect x={-80} y={8} width={160} height={220} rx={18} fill={c} /><rect x={-80} y={60} width={160} height={10} fill="#000" opacity={0.2} /></g>
);
const DOOR = { x: 470, w: 180, y: 640, h: 700 };
export const S15: React.FC = () => {
  const { t, t2, p } = useShot();
  const tb = wordAt(15, /^bags/i, 0.8);
  const close = ramp(t, tb, tb + 0.16, EOUT); // door panels slide shut exactly on "bags"
  const idle = Math.sin(t * 38) * 1.6;
  const h = handheld(t, 0.18);
  const cam: Cam = { zoom: 1.02 + 0.04 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy + 3 * bump(t, tb + 0.12, 0.12), ox: 560, oy: 1000 };
  // walkers ON TWOS: x along the platform, they step up into the door and disappear behind the bus body
  const walker = (x0: number, x1: number, a: number, b: number) => { const u = ramp(t2, a, b, Easing.linear); return { x: x0 + (x1 - x0) * u, walk: t2 * 9, up: ramp(t2, b - 0.25, b, EOUT) * 40 }; };
  const doc = walker(380, 700, 0, Math.min(tb - 0.3, 1.1)), eng = walker(80, 700, 0, tb - 0.1);
  const ppl: [FigSpec, ReturnType<typeof walker>, 'coat' | 'tube'][] = [[CAST.engineer, eng, 'tube'], [CAST.doctor, doc, 'coat']];
  const busBody = `M380 560 L1300 560 L1300 1360 L380 1360 Z M${DOOR.x} ${DOOR.y} L${DOOR.x + DOOR.w} ${DOOR.y} L${DOOR.x + DOOR.w} ${DOOR.y + DOOR.h} L${DOOR.x} ${DOOR.y + DOOR.h} Z`;
  const pw = (DOOR.w / 2) * close;
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="exodus/terminal" k={0.7} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <g transform={`translate(0 ${idle})`}>
            {/* inside the door: dark interior and a step */}
            <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill="#1c2228" />
            <rect x={DOOR.x} y={DOOR.y + DOOR.h - 60} width={DOOR.w} height={60} fill="#3a4048" />
          </g>
          {ppl.map(([f, w, k], i) => (
            <g key={i} transform={`translate(${w.x} ${1360 - w.up}) scale(0.72)`}>
              <Figure f={f} walk={w.walk} armF={k === 'coat' ? [30, -70] : [10, -10]} armB={[-6, -4]}
                holdBack={(b) => <g transform={`translate(${b.x} ${b.y})`}><Suitcase c={i ? '#5a3e2e' : '#2e4a5e'} /></g>}
                hold={(fh) => k === 'coat'
                  ? <path d={`M${fh.x - 30} ${fh.y - 20} C${fh.x + 40} ${fh.y - 30} ${fh.x + 60} ${fh.y + 60} ${fh.x + 40} ${fh.y + 260} L${fh.x - 20} ${fh.y + 250} C${fh.x - 10} ${fh.y + 100} ${fh.x - 30} ${fh.y + 40} ${fh.x - 30} ${fh.y - 20} Z`} fill="#f4f4f0" />
                  : <rect x={fh.x - 10} y={fh.y - 220} width={40} height={300} rx={18} fill="#3a4a5e" transform={`rotate(-20 ${fh.x} ${fh.y})`} />} />
            </g>
          ))}
          <g transform={`translate(0 ${idle})`}>
            {/* the bus (generic, no logos) with the door opening cut out */}
            <path d={busBody} fillRule="evenodd" fill="#eef0ee" />
            <rect x={380} y={1000} width={920} height={60} fill="#3f7a7a" />
            {[700, 900, 1100].map((x) => <rect key={x} x={x} y={640} width={170} height={260} rx={14} fill="#2a343c" />)}
            <rect x={380} y={560} width={920} height={30} fill="#c9ccc8" />
            {[560, 1120].map((x) => <g key={x}><circle cx={x} cy={1360} r={90} fill="#141414" /><circle cx={x} cy={1360} r={40} fill="#8a8a8a" /></g>)}
            <rect x={DOOR.x - 10} y={DOOR.y - 10} width={DOOR.w + 20} height={DOOR.h + 10} fill="none" stroke="#9aa0a6" strokeWidth={10} />
            {/* door panels sliding in from both sides */}
            <rect x={DOOR.x} y={DOOR.y} width={pw} height={DOOR.h} fill="#c9d4d6" stroke="#8a9496" strokeWidth={6} opacity={close > 0 ? 1 : 0} />
            <rect x={DOOR.x + DOOR.w - pw} y={DOOR.y} width={pw} height={DOOR.h} fill="#c9d4d6" stroke="#8a9496" strokeWidth={6} opacity={close > 0 ? 1 : 0} />
            {/* exhaust puffs (environment, on ones) */}
            {[0, 1, 2].map((k) => { const u = (t * 0.8 + k / 3) % 1; return <circle key={k} cx={1220 + u * 80} cy={1330 - u * 140} r={30 + u * 70} fill="#b8b2a6" opacity={0.35 * (1 - u)} />; })}
          </g>
          {/* a child waving goodbye in the foreground (ON TWOS) */}
          <g transform={`translate(170 1720) scale(0.55)`}>
            <Figure f={CAST.child} armF={[150 + 18 * Math.sin(t2 * 10), 20 * Math.sin(t2 * 10)]} armB={[-6, -4]} />
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 16 (day): low angle, the megaphone man on a car roof; he waves big on "stayed" ============ */
export const S16: React.FC = () => {
  const { t, t2, p } = useShot();
  const ts = wordAt(16, /^stayed/i, 0.52);
  const big = ramp(t2, ts, ts + 0.12, EOUT);
  const wave = Math.sin(t2 * 11);
  const h = handheld(t, 0.35);
  const cam: Cam = { zoom: 1.03 + 0.05 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy - 6 * bump(t, ts, 0.12), ox: 560, oy: 700 };
  const crowd = Array.from({ length: 12 }, (_, i) => ({ x: -100 + i * 120, y: 1560 + (i % 3) * 60, up: i % 3 !== 1, ph: i * 1.7 }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="exodus/street" k={0.6} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          {/* car roof + windshield, from below */}
          <path d="M180 1300 L940 1300 L1040 1620 L80 1620 Z" fill="#26282e" />
          <path d="M240 1340 L880 1340 L960 1580 L160 1580 Z" fill="#4a5664" opacity={0.6} />
          <rect x={160} y={1280} width={800} height={30} rx={14} fill="#3a3c44" />
          <g transform={`translate(560 1290) scale(0.86)`}>
            <Figure f={CAST.loud} armF={[122, 150]} armB={[160 + (12 + 14 * big) * wave, -30 + 30 * wave]} walk={0}
              hold={(fh) => (
                <g transform={`translate(${fh.x + 10} ${fh.y + 6}) rotate(${-8 + 3 * Math.sin(t2 * 13)})`}>
                  <path d="M0 -26 L150 -70 L150 70 L0 26 Z" fill="#e8e4da" />
                  <ellipse cx={150} cy={0} rx={18} ry={70} fill="#b8b2a6" />
                  <rect x={-30} y={-20} width={40} height={40} rx={8} fill="#2a2a30" />
                </g>
              )} />
          </g>
          {/* crowd heads and raised arms around the car (ON TWOS) */}
          {crowd.map((c, i) => {
            const bob = 10 * Math.sin(t2 * 7 + c.ph);
            return (
              <g key={i} fill="#2a2724">
                {c.up && <path d={`M${c.x + 30} ${c.y - 60 + bob} L${c.x + 50 + 20 * Math.sin(t2 * 8 + c.ph)} ${c.y - 300 + bob} L${c.x + 80 + 20 * Math.sin(t2 * 8 + c.ph)} ${c.y - 296 + bob} L${c.x + 62} ${c.y - 50 + bob} Z`} />}
                <ellipse cx={c.x} cy={c.y - 120 + bob} rx={56} ry={66} />
                <path d={`M${c.x - 110} ${c.y + 300} C${c.x - 100} ${c.y - 30 + bob} ${c.x + 100} ${c.y - 30 + bob} ${c.x + 110} ${c.y + 300} Z`} />
              </g>
            );
          })}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 17 (night): a chain round the library gates; the padlock snaps shut on "libraries" ============ */
export const S17: React.FC = () => {
  const { t, t2, p } = useShot();
  const tl = wordAt(17, /^libraries/i, 0.8);
  const shut = ramp(t2, tl, tl + 0.06, EOUT); // the shackle snaps home on the word
  const h = handheld(t, 0.15);
  const cam: Cam = { zoom: 1.02 + 0.07 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy + 5 * bump(t, tl, 0.1), ox: 540, oy: 1020 };
  const swing = 4 * Math.sin(t * 1.3) * (1 - shut * 0.7);
  const { x0, x1, y0, y1 } = GATE;
  const bars = Array.from({ length: 13 }, (_, i) => x0 + (i * (x1 - x0)) / 12);
  const links = Array.from({ length: 14 }, (_, i) => ({ x: 400 + i * 22 + (i % 2) * 6, y: 830 + i * 16 + Math.sin(i) * 10, r: i % 2 ? 0 : 90 }));
  const shadows = [[-60, 0.9], [240, 1.05], [780, 1.0], [1000, 0.85]] as const;
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f' }}>
      <BandImg id="exodus/library" k={0.6} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          {/* long shadows of the followers standing behind the camera, thrown onto the steps and the gate (ON TWOS) */}
          {shadows.map(([x, s], i) => (
            <path key={i} d={`M${x} 1700 L${x + 120 * s} 1700 L${x + 90 * s + 10 * Math.sin(t2 * 1.4 + i)} ${700} Q${x + 60 * s} ${620} ${x + 30 * s + 10 * Math.sin(t2 * 1.4 + i)} ${700} Z`} fill="#000" opacity={0.42} />
          ))}
          {/* the gate */}
          <rect x={x0 - 20} y={y0 - 40} width={x1 - x0 + 40} height={30} fill="#0c0c10" />
          {bars.map((x, i) => (
            <g key={i}>
              <rect x={x - 9} y={y0} width={18} height={y1 - y0} fill="#0f0f14" />
              <path d={`M${x} ${y0 - 10} l-16 -40 l16 -26 l16 26 Z`} fill="#0f0f14" />
              <rect x={x + 5} y={y0} width={4} height={y1 - y0} fill="#ffb347" opacity={0.35} />
            </g>
          ))}
          {/* chain wrapped round the two middle bars */}
          <g transform={`rotate(${swing * 0.3} 540 820)`}>
            {links.map((l, i) => <ellipse key={i} cx={l.x} cy={l.y} rx={l.r ? 10 : 22} ry={l.r ? 22 : 12} fill="none" stroke="#8a8a90" strokeWidth={9} />)}
            {links.map((l, i) => <ellipse key={`h${i}`} cx={l.x - 3} cy={l.y - 3} rx={l.r ? 7 : 18} ry={l.r ? 18 : 9} fill="none" stroke="#ffcf86" strokeWidth={2.5} opacity={0.6} />)}
          </g>
          {/* padlock + the hand closing it (ON TWOS) */}
          <g transform={`translate(560 1080) rotate(${swing})`}>
            <path d={`M-40 ${-30 - 50 * (1 - shut)} L-40 ${-90 - 50 * (1 - shut)} A40 40 0 0 1 40 ${-90 - 50 * (1 - shut)} L40 -30`} stroke="#b8b8bc" strokeWidth={18} fill="none" />
            <rect x={-70} y={-40} width={140} height={130} rx={18} fill="#a8843a" />
            <rect x={-70} y={-40} width={140} height={20} rx={10} fill="#d4b06a" />
            <circle cx={0} cy={30} r={12} fill="#3a2a14" /><rect x={-4} y={30} width={8} height={30} fill="#3a2a14" />
            <g transform={`translate(${30} ${110 - 16 * shut})`}>
              <path d="M40 30 C120 120 200 300 260 700 L520 700 C420 400 280 160 140 20 Z" fill="#1c1e24" />
              <path d="M-60 -20 C-20 -40 60 -30 90 0 C120 30 110 80 70 100 L-30 110 C-70 100 -80 40 -60 -20 Z" fill={SKIN.skin} />
              <path d="M-50 20 C0 18 40 24 80 30 M-46 60 C0 60 40 64 76 70" stroke={SKIN.deep} strokeWidth={4} fill="none" opacity={0.5} />
              <path d="M-40 -18 C-30 -60 -10 -90 10 -96 C30 -96 34 -76 24 -60 C14 -44 4 -30 0 -10 Z" fill={SKIN.skin} />
              <path d="M-60 -20 C-20 -40 60 -30 90 0" stroke="#ffb347" strokeWidth={3} fill="none" opacity={0.6} />
            </g>
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

const TMOTES = Array.from({ length: 22 }, (_, i) => ({ x: (i * 397) % 1080, y: (i * 683) % 1920, r: 1.5 + (i % 4) * 0.9, sp: 8 + (i % 5) * 5, ph: i * 1.7 }));

export const S18: React.FC = () => {
  const { t, p } = useShot();
  const words: [string, number, number][] = [['THE', 0, 0.25], ['LOUDEST', 0, 0.45], ['VOICE', 1, 0.7]];
  const sub = ramp(t, 1.1, 1.7, EOUT), rule = ramp(t, 0.95, 1.5, EOUT);
  const glow = ramp(t, 0.1, 1.4, EOUT);
  const z = 1 + 0.045 * EIO(p);
  const line = (k: number) => words.filter((w) => w[1] === k).map(([w, , a0], j) => {
    const v = ramp(t, a0, a0 + 0.6, EOUT);
    return <span key={j} style={{ display: 'inline-block', opacity: v, transform: `translateY(${(1 - v) * 26}px)`, marginRight: '0.32em' }}>{w}</span>;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="p25g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#d9a441" stopOpacity={0.22} /><stop offset="0.5" stopColor="#d9a441" stopOpacity={0.07} /><stop offset="1" stopColor="#d9a441" stopOpacity={0} /></radialGradient>
        </defs>
        <ellipse cx={540} cy={880} rx={620} ry={330} fill="url(#p25g)" opacity={glow} />
        {TMOTES.map((m, k) => {
          const y = (((m.y - t * m.sp) % 1920) + 1920) % 1920, x = m.x + Math.sin(t * 0.6 + m.ph) * 14;
          return <circle key={k} cx={x} cy={y} r={m.r} fill="#f1ead8" opacity={(0.12 + 0.12 * Math.sin(t * 1.3 + m.ph)) * glow} />;
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${z})`, transformOrigin: '540px 880px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -160, width: 920 }}>
          <div style={{ fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 84, letterSpacing: '0.08em', color: '#f1ead8', lineHeight: 1.18, textAlign: 'center', whiteSpace: 'nowrap', paddingLeft: '0.32em' }}>
            <div>{line(0)}</div>
            <div>{line(1)}</div>
          </div>
          <div style={{ width: 320, height: 2, marginTop: 44, transform: `scaleX(${rule})`, background: `linear-gradient(90deg, rgba(217,164,65,0), ${GREEN}, rgba(217,164,65,0))` }} />
          <div style={{ marginTop: 34, fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 30, letterSpacing: '0.32em', paddingLeft: '0.32em', color: GREEN, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`, whiteSpace: 'nowrap' }}>CHAPTER 4 · THE LAST DAYS</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
