import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Figure, FigSpec, BackFigure } from '../art/streets_people';
import { Person, PersonSpec } from '../art/north_profile';
import { ALLEY } from '../sets/streets';
import { WINS, TABLE_Y } from '../sets/north';

const { fontFamily: TITLE_FONT } = loadCinzel('normal', { weights: ['600', '700'], subsets: ['latin'] });

/** Live layers are in world space; Fr shifts to FRAME coords (frame = world - (108,192)). */
const Fr: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const bump = (t: number, a: number, d: number) => { const u = clamp01((t - a) / d); return Math.sin(Math.PI * u); };
const flutter = (t2: number, on = 1) => on * (0.5 + 0.5 * Math.sin(t2 * 26)) * (0.6 + 0.4 * Math.sin(t2 * 7.3));

/* ---------------- cast (new characters) ---------------- */
const F: Record<string, FigSpec> = {
  father: { skin: '#9c6b52', hair: 'short', hairC: '#151110', top: '#8a6a4a', topD: '#5e4630', legs: '#4a4038' },
  mother: { skin: '#b07a5e', hair: 'scarf', hairC: '#6a3a3a', top: '#7a7060', topD: '#564e42', legs: '#3a3438', coat: true },
  son: { skin: '#c48d6e', hair: 'short', hairC: '#1a1512', top: '#c9a24a', topD: '#94742c', legs: '#3a4a5e' },
  carrier: { skin: '#8a5a44', hair: 'short', hairC: '#121010', top: '#5a6a7a', topD: '#3c4a58', legs: '#3a3a40' },
  grandma: { skin: '#b07a5e', hair: 'scarf', hairC: '#e6e0d4', top: '#4a5a6a', topD: '#30404e', legs: '#30404e', coat: true },
  giver: { skin: '#0c0a10', hair: 'short', hairC: '#0c0a10', top: '#0c0a10', topD: '#0c0a10', legs: '#0c0a10' },
  poor: { skin: '#5a4034', hair: 'scarf', hairC: '#3a3040', top: '#3a3448', topD: '#2a2436', legs: '#2a2436', coat: true },
  poor2: { skin: '#5a4034', hair: 'short', hairC: '#151215', top: '#43384a', topD: '#2e2636', legs: '#2a2436' },
};
const P: Record<string, PersonSpec> = {
  oldWoman: { skin: '#9c6b52', shade: '#68412f', hair: 'scarf', hairC: '#3a3046', hairC2: '#ffd79a', shirt: '#3a3448', shirtD: '#2a2436' },
  youngMan: { skin: '#a8745a', shade: '#6e4636', hair: 'short', hairC: '#121010', shirt: '#4a4038', shirtD: '#2e2620' },
};

/* ============ shot 3 (night): a faceless man, seen only from behind, hands out handfuls to a long line; a big scoop on "counting" ============ */
export const S03: React.FC = () => {
  const { t, t2, p } = useShot();
  const tc = wordAt(3, /^counting/i, 0.84);
  // the giver ON TWOS: dip into the sack, then hold the handful out; the big scoop lands on "counting"
  const cyc = (t2 % 1.1) / 1.1;
  const reach = tc - 0.3 < t2 && t2 < tc + 0.5 ? ramp(t2, tc - 0.3, tc, EOUT) : 0.5 - 0.5 * Math.cos(cyc * Math.PI * 2);
  const scoop = ramp(t2, tc - 0.3, tc, EOUT) * (1 - ramp(t2, tc + 0.6, tc + 0.9));
  const h = handheld(t, 0.2);
  const cam: Cam = { zoom: 1 + 0.12 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 720, oy: 1000 };
  const G = { x: 760, y: 1900, s: 1.12 };
  const line = Array.from({ length: 7 }, (_, i) => ({ x: 560 - i * 70, y: 1250 - i * 30, s: 0.5 - i * 0.045, f: i % 2 ? F.poor2 : F.poor }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060c' }}>
      <BandImg id="streets/night-street" k={0.7} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          {/* the line of poor people, facing him (ON TWOS: weight shifts, the first one holds out cupped hands) */}
          {line.slice().reverse().map((m, k) => {
            const i = line.length - 1 - k;
            return (
              <g key={i} transform={`translate(${m.x} ${m.y + 3 * Math.sin(t2 * 1.6 + i)}) scale(${m.s})`}>
                <Figure f={m.f} walk={0.3 * Math.sin(t2 * 0.9 + i)} armF={i === 0 ? [70 + 20 * reach, -50] : [20, -60]} armB={[10, -50]} />
              </g>
            );
          })}
          {/* the giver: backlit silhouette with a warm rim, from behind; a cloth sack at his feet */}
          {(() => {
            // seen FROM BEHIND: his left hand reaches forward to the first cupped hands, his right hand dips into the sack
            const toL = (x: number, y: number) => ({ x: (x - G.x) / G.s, y: (y - G.y) / G.s });
            const hl = toL(600 + 30 * reach, 1100 + 20 * (1 - reach)), hr = toL(G.x + 150, G.y - 560 + 20 * Math.sin(t2 * 2));
            return (
              <g>
                {[[-5, -3], [5, -3], [0, -6]].map(([dx, dy], k) => (
                  <g key={k} transform={`translate(${G.x + dx} ${G.y + dy}) scale(${G.s})`}><BackFigure f={F.giver} handL={hl} handR={hr} fill="#ffd79a" /></g>
                ))}
                {/* a cloth sack of grain hanging from his right hand */}
                <g transform={`translate(${G.x + hr.x * G.s} ${G.y + hr.y * G.s})`}>
                  <path d="M-40 0 C-110 60 -120 230 -60 270 L70 270 C130 230 120 60 50 0 Z" fill="#c9b48a" />
                  <path d="M-40 0 C-110 60 -120 230 -60 270" stroke="#ffd79a" strokeWidth={4} fill="none" opacity={0.7} />
                  <path d="M-30 10 Q6 -16 40 10" stroke="#8a7450" strokeWidth={10} fill="none" />
                </g>
                <g transform={`translate(${G.x} ${G.y}) scale(${G.s})`}><BackFigure f={F.giver} handL={hl} handR={hr} /></g>
                {/* the handful in his left hand: grain/coins spilling, a bigger scoop on "counting" */}
                <g transform={`translate(${G.x + hl.x * G.s} ${G.y + hl.y * G.s})`}>
                  <ellipse cx={0} cy={-10} rx={30 + 14 * scoop} ry={14 + 6 * scoop} fill="#e8b84a" opacity={0.3 + 0.7 * reach} />
                  {Array.from({ length: 4 + Math.round(6 * scoop) }, (_, k) => <circle key={k} cx={-14 + (k % 4) * 10} cy={20 + ((t2 * 300 + k * 40) % 120)} r={5} fill="#ffcf86" opacity={reach > 0.5 ? 0.9 : 0} />)}
                </g>
              </g>
            );
          })()}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 6 (night): the giver, from behind, steps out of a side door with a bag and walks away; turns the corner on "ran" ============ */
export const S06: React.FC = () => {
  const { t, t2 } = useShot();
  const tr = wordAt(6, /^ran/i, 0.71);
  // ON TWOS: out of the door, down the alley, round the corner exactly on "ran" (long lens: he barely shrinks)
  const u = ramp(t2, 0, tr, EIO);
  const turn = ramp(t2, tr, tr + 0.3, EOUT);
  const x = 230 + (ALLEY.corner - 80 - 230) * u + 260 * turn, y = 1500 - 520 * u;
  const s = 0.62 - 0.26 * u;
  const h = handheld(t, 0.06);
  const cam: Cam = { zoom: 1.04, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 560, oy: 1000 };
  const walk = t2 * 9;
  const bag = { x: 110, y: -900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060c' }}>
      <BandImg id="streets/night-alley" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <defs><clipPath id="p6c"><path d={`M-200 -200 L${ALLEY.corner} -200 L${ALLEY.corner} 1100 L-200 2200 Z`} /></clipPath></defs>
          {/* he slips round the corner: clipped by the right-hand wall */}
          <g clipPath="url(#p6c)">
            <g transform={`translate(${x} ${y}) scale(${s})`}>
              {[[-5, -3], [5, -3], [0, -6]].map(([dx, dy], k) => (
                <g key={k} transform={`translate(${dx} ${dy})`}><BackFigure f={F.giver} walk={walk} handL={{ x: -150, y: -460 + 20 * Math.sin(walk) }} handR={{ x: 90, y: -880 }} fill="#ffd79a" /></g>
              ))}
              <BackFigure f={F.giver} walk={walk} handL={{ x: -150, y: -460 + 20 * Math.sin(walk) }} handR={{ x: 90, y: -880 }} />
              {/* small cloth bag over the right shoulder */}
              <path d={`M${bag.x} ${bag.y} C${bag.x + 120} ${bag.y - 40} ${bag.x + 160} ${bag.y + 120} ${bag.x + 100} ${bag.y + 240} C${bag.x + 40} ${bag.y + 280} ${bag.x} ${bag.y + 200} ${bag.x + 10} ${bag.y + 120} Z`} fill="#c9b48a" />
              <path d={`M${bag.x + 100} ${bag.y + 240} C${bag.x + 40} ${bag.y + 280} ${bag.x} ${bag.y + 200} ${bag.x + 10} ${bag.y + 120}`} stroke="#8a7450" strokeWidth={6} fill="none" />
            </g>
          </g>
          {/* the door light flickers once as he leaves (environment) */}
          <rect x={ALLEY.door.x} y={ALLEY.door.y} width={ALLEY.door.w} height={ALLEY.door.h} fill="#05060c" opacity={0.25 * bump(t, 0.3, 0.2)} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 15 (night, cliffhanger): two officials sign a treaty in a cold hall; one smiles as he caps his pen on "keep" ============ */
const OFF: Record<string, PersonSpec> = {
  a: { skin: '#c49a7e', shade: '#8a6450', hair: 'short', hairC: '#8a8580', shirt: '#1e222c', shirtD: '#14171e' },
  b: { skin: '#d0a88c', shade: '#94705a', hair: 'bald', hairC: '#5a524c', shirt: '#22262e', shirtD: '#16191f', mustache: true },
};
export const S15: React.FC = () => {
  const { t, t2, p } = useShot();
  const tsg = wordAt(15, /^signed/i, 0.37), tk = wordAt(15, /^keep/i, 0.74);
  const sign = clamp01((t2 - tsg) / 0.9); // the pen moves across the line, ON TWOS
  const cap = ramp(t2, tk - 0.15, tk, EOUT), smile = ramp(t2, tk, tk + 0.2, EOUT);
  const beat = (x: number) => Math.max(bump(x % 0.85, 0, 0.09), 0.6 * bump(x % 0.85, 0.15, 0.08));
  const cam: Cam = { zoom: 1 + 0.1 * EIO(p) + 0.01 * beat(t), dx: 0, dy: 0, tx: 0, ty: 0, ox: 560, oy: 1000 };
  const flakes = Array.from({ length: 60 }, (_, i) => ({ w: i % 3, x: ((i * 53) % 230) + 5, sp: 50 + (i % 5) * 18, ph: i * 1.3 }));
  const penX = 470 + 140 * sign;
  return (
    <AbsoluteFill style={{ backgroundColor: '#1c2230' }}>
      <BandImg id="north/hall" k={0.8} cam={cam} />
      <Live k={0.8} cam={cam}>
        <Fr>
          {/* snow falling past the tall windows (environment, on ones) */}
          {flakes.map((f, i) => {
            const [wx, wy] = WINS[f.w];
            const y = wy + (((i * 97) % 660) + t * f.sp) % 660, x = wx + f.x + 8 * Math.sin(t * 1.3 + f.ph);
            return <circle key={i} cx={x} cy={y} r={2.5 + (i % 3)} fill="#cfd8e3" opacity={0.8} />;
          })}
        </Fr>
      </Live>
      <Live k={1} cam={cam}>
        <Fr>
          {/* two officials facing each other across the document (ON TWOS: breathing, the signing hand) */}
          <g transform={`translate(230 ${1010 + 2 * Math.sin(t2 * 1.6)}) scale(1.05)`}><Person id="p15a" p={OFF.a} lean={14} rim="#ffd9a0" rimOp={0.6} /></g>
          <g transform={`translate(860 ${1000 + 2 * Math.sin(t2 * 1.4 + 1)}) scale(-1.05 1.05)`}><Person id="p15b" p={OFF.b} lean={6 - 4 * smile} smile={smile} rim="#ffd9a0" rimOp={0.6} /></g>
          {/* the treaty on the table */}
          <path d={`M380 ${TABLE_Y - 60} L700 ${TABLE_Y - 72} L720 ${TABLE_Y - 14} L370 ${TABLE_Y - 2} Z`} fill="#efe9dc" />
          {[0, 1, 2].map((k) => <path key={k} d={`M410 ${TABLE_Y - 50 + k * 12} L660 ${TABLE_Y - 59 + k * 12}`} stroke="#a89f8c" strokeWidth={3} />)}
          <path d={`M470 ${TABLE_Y - 18} Q${470 + 70 * sign} ${TABLE_Y - 30} ${penX} ${TABLE_Y - 20}`} stroke="#1c2a4a" strokeWidth={4} fill="none" opacity={sign > 0 ? 1 : 0} />
          {/* official A's hand with the pen */}
          <g transform={`translate(${penX} ${TABLE_Y - 22 - 6 * Math.abs(Math.sin(t2 * 14)) * (sign > 0 && sign < 1 ? 1 : 0)})`}>
            <path d="M-260 30 C-180 0 -80 -10 -20 -20 L-10 20 C-80 40 -180 60 -260 70 Z" fill="#1e222c" />
            <path d="M-40 -30 C0 -40 30 -20 30 6 C30 26 0 34 -30 30 Z" fill="#c49a7e" />
            <rect x={-6} y={-60} width={8} height={70} rx={3} fill="#1a1a1a" transform="rotate(25)" />
          </g>
          {/* official B caps his pen on "keep" */}
          <g transform={`translate(${760} ${TABLE_Y - 110})`}>
            <path d="M200 120 C120 100 60 80 20 60 L30 30 C80 40 140 60 210 80 Z" fill="#22262e" />
            <path d="M0 20 C-30 10 -40 40 -20 60 C0 72 30 60 30 40 Z" fill="#d0a88c" />
            <rect x={-24} y={-40} width={8} height={70} rx={3} fill="#2a2a30" transform="rotate(-20)" />
            <rect x={-26 - 30 * (1 - cap)} y={-60 - 20 * (1 - cap)} width={10} height={26} rx={3} fill="#c9a24a" transform="rotate(-20)" />
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 16: title card over dark drifting sand ============ */
const SMOKE = Array.from({ length: 9 }, (_, i) => ({ x: (i * 377) % 1600, y: 300 + (i * 211) % 1300, r: 220 + (i % 3) * 90, v: 18 + (i % 4) * 9 }));
const TMOTES = Array.from({ length: 22 }, (_, i) => ({ x: (i * 397) % 1080, y: (i * 683) % 1920, r: 1.5 + (i % 4) * 0.9, sp: 8 + (i % 5) * 5, ph: i * 1.7 }));

export const S16: React.FC = () => {
  const { t, p } = useShot();
  const words: [string, number, number][] = [['THE', 0, 0.25], ['REFUGE', 0, 0.45]];
  const sub = ramp(t, 1.1, 1.7, EOUT), rule = ramp(t, 0.95, 1.5, EOUT);
  const glow = ramp(t, 0.1, 1.4, EOUT);
  const z = 1 + 0.045 * EIO(p);
  const line = (k: number) => words.filter((w) => w[1] === k).map(([w, , a0], j) => {
    const v = ramp(t, a0, a0 + 0.6, EOUT);
    return <span key={j} style={{ display: 'inline-block', opacity: v, transform: `translateY(${(1 - v) * 26}px)`, marginRight: '0.32em' }}>{w}</span>;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <BandImg id="north/sand" k={1} cam={{ zoom: 1 + 0.03 * p, dx: 0, dy: 0 }} />
      <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="p25g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff" stopOpacity={0.14} /><stop offset="0.5" stopColor="#ffffff" stopOpacity={0.05} /><stop offset="1" stopColor="#ffffff" stopOpacity={0} /></radialGradient>
        </defs>
        <defs><radialGradient id="p16s" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#3a3226" stopOpacity={0.8} /><stop offset="1" stopColor="#2a2228" stopOpacity={0} /></radialGradient></defs>
        {SMOKE.map((s, k) => <ellipse key={k} cx={((s.x + t * s.v) % 1600) - 260} cy={s.y + 30 * Math.sin(t * 0.4 + k)} rx={s.r * 1.6} ry={s.r} fill="url(#p16s)" opacity={0.55} />)}
        <ellipse cx={540} cy={880} rx={620} ry={330} fill="url(#p25g)" opacity={glow} />
        {TMOTES.map((m, k) => {
          const y = (((m.y - t * m.sp) % 1920) + 1920) % 1920, x = m.x + Math.sin(t * 0.6 + m.ph) * 14;
          return <circle key={k} cx={x} cy={y} r={m.r} fill="#f1ead8" opacity={(0.12 + 0.12 * Math.sin(t * 1.3 + m.ph)) * glow} />;
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${z})`, transformOrigin: '540px 880px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -160, width: 920 }}>
          <div style={{ fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 104, letterSpacing: '0.08em', color: '#f1ead8', lineHeight: 1.18, textAlign: 'center', whiteSpace: 'nowrap', paddingLeft: '0.32em' }}>
            <div>{line(0)}</div>
          </div>
          <div style={{ width: 320, height: 2, marginTop: 44, transform: `scaleX(${rule})`, background: `linear-gradient(90deg, rgba(217,164,65,0), ${GREEN}, rgba(217,164,65,0))` }} />
          <div style={{ marginTop: 34, fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 30, letterSpacing: '0.32em', paddingLeft: '0.32em', color: GREEN, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`, whiteSpace: 'nowrap' }}>CHAPTER 8 · THE LAST DAYS</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
