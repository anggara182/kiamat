import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Figure, FigSpec, BackFigure } from '../art/farcity_people';
import { Person, PersonSpec, EAR, MOUTH, facePt } from '../art/farcity_profile';
import { ROADS_W, DOOR } from '../sets/farcity';
import { H } from '../art/world';

const { fontFamily: TITLE_FONT } = loadCinzel('normal', { weights: ['600', '700'], subsets: ['latin'] });

/** Live layers are in world space; Fr shifts to FRAME coords (frame = world - (108,192)). */
const Fr: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const bump = (t: number, a: number, d: number) => { const u = clamp01((t - a) / d); return Math.sin(Math.PI * u); };
const flutter = (t2: number, on = 1) => on * (0.5 + 0.5 * Math.sin(t2 * 26)) * (0.6 + 0.4 * Math.sin(t2 * 7.3));

/**
 * A whisper pair: the listener's EAR sits at frame point (ex, ey); the whisperer leans in from behind with the mouth just short of it.
 * dir = 1: both face right (whisperer on the left); dir = -1: mirrored.
 */
const Pair: React.FC<{
  id: string; ex: number; ey: number; s: number; dir?: 1 | -1;
  wh: PersonSpec; li: PersonSpec; talk: number; lean: number; wide: number; cup: number;
  liLean?: number; bob?: number; rim?: string; rimOp?: number; ws?: number;
}> = ({ id, ex, ey, s, dir = 1, wh, li, talk, lean, wide, cup, liLean = 0, bob = 0, rim, rimOp, ws }) => {
  const sw = ws ?? s;
  const ear = facePt(0, 0, s, EAR, liLean, dir);
  const L = { x: ex - ear.x, y: ey - ear.y + bob };
  const target = { x: ex - dir * 46 * s, y: ey + 10 * s };
  const m = facePt(0, 0, sw, MOUTH, lean, dir);
  const Wp = { x: target.x - m.x, y: target.y - m.y };
  return (
    <g>
      <g transform={`translate(${L.x} ${L.y}) scale(${dir * s} ${s})`}><Person id={`${id}l`} p={li} wide={wide} lean={liLean} rim={rim} rimOp={rimOp} /></g>
      <g transform={`translate(${Wp.x} ${Wp.y}) scale(${dir * sw} ${sw})`}><Person id={`${id}w`} p={wh} talk={talk} lean={lean} cup={cup} rim={rim} rimOp={rimOp} /></g>
    </g>
  );
};

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

/* ============ shot 3 (day): the roads to the river; a family lifts their shovels onto their shoulders on "shovels" ============ */
const Shovel: React.FC<{ a: number }> = ({ a }) => (
  <g transform={`rotate(${a})`}><rect x={-7} y={-40} width={14} height={420} rx={6} fill="#7a5a34" /><path d="M-40 380 L40 380 L34 470 Q0 500 -34 470 Z" fill="#8a8e94" /></g>
);
export const S03: React.FC = () => {
  const { t, t2, p } = useShot();
  const ts = wordAt(3, /^shovels/i, 0.86);
  const lift = ramp(t2, ts, ts + 0.2, EOUT); // shovels swing up onto the shoulders exactly on the word
  const cam: Cam = { zoom: 1.04, dx: 0, dy: 0, tx: 120 - 300 * EIO(p), ty: 0, ox: 540, oy: 1000 };
  const walk = t2 * 8;
  const g = 0.36; // figure scale in the wide
  // everyone drifts toward the river on the right (the band is ROADS_W wide; draw in band coords)
  const adv = 380 + 160 * p; // the walkers keep pace with the track
  const fam = [{ f: F.father, x: 760 }, { f: F.mother, x: 640 }, { f: F.son, x: 900, s: 0.7 }];
  return (
    <AbsoluteFill style={{ backgroundColor: '#e2c28a' }}>
      <BandImg id="farcity/roads" k={1} cam={cam} />
      <Live k={1} cam={cam} w={ROADS_W} h={H}>
        <g transform="translate(0 192)">
          {/* a truck overloaded with people, kicking dust (environment on ones, riders on twos) */}
          <g transform={`translate(${1060 + 160 * p} 980) scale(0.5)`}>
            {[0, 1, 2].map((k) => { const u = (t * 0.7 + k / 3) % 1; return <circle key={k} cx={-260 - u * 300} cy={-40 - u * 80} r={60 + u * 120} fill="#e8cf9e" opacity={0.5 * (1 - u)} />; })}
            <rect x={-200} y={-180} width={340} height={150} fill="#7a6a4a" />
            <path d="M140 -150 L240 -150 L280 -80 L280 -30 L140 -30 Z" fill="#8a3a2e" />
            <path d="M160 -140 L230 -140 L258 -90 L160 -90 Z" fill="#2a343c" />
            {[-160, 180].map((x) => <circle key={x} cx={x} cy={-20} r={42} fill="#1a1a1a" />)}
            {Array.from({ length: 9 }, (_, k) => <ellipse key={k} cx={-180 + k * 38} cy={-210 + 6 * Math.sin(t2 * 6 + k)} rx={20} ry={24} fill={['#3a2a22', '#5a3a2e', '#2a2a30'][k % 3]} />)}
            {Array.from({ length: 9 }, (_, k) => <rect key={`b${k}`} x={-196 + k * 38} y={-196 + 6 * Math.sin(t2 * 6 + k)} width={34} height={30} fill={['#c4504a', '#4a6a8a', '#c9a24a', '#e6e0d4'][k % 4]} />)}
          </g>
          {/* a donkey cart further back */}
          <g transform={`translate(${520 + 100 * p} 900) scale(0.42)`}>
            <rect x={-60} y={-140} width={260} height={90} fill="#8a6a44" /><circle cx={60} cy={-40} r={50} fill="none" stroke="#3a2a1a" strokeWidth={12} />
            <g transform={`translate(${-170} ${-40 + 4 * Math.sin(t2 * 8)})`}><ellipse cx={0} cy={-80} rx={90} ry={44} fill="#7a7068" /><path d="M60 -100 L120 -150 L140 -130 L80 -80 Z" fill="#7a7068" /><path d="M120 -150 L118 -190 L132 -150 Z" fill="#5a5048" />{[-50, -20, 30, 60].map((x, k) => <rect key={x} x={x} y={-50} width={12} height={70} fill="#5a5048" transform={`rotate(${10 * Math.sin(walk + k * 1.6)} ${x} -50)`} />)}</g>
            <ellipse cx={80} cy={-200} rx={26} ry={30} fill="#2a2018" /><path d="M40 -170 L120 -170 L110 -100 L50 -100 Z" fill="#6a4a3a" />
          </g>
          {/* a grandmother carried on a chair by two men */}
          <g transform={`translate(${300 + adv} 1290)`}>
            {[[-110, F.carrier, 0], [110, F.carrier, 2]].map(([dx, f, ph], k) => (
              <g key={k} transform={`translate(${dx as number} 0) scale(${g})`}><Figure f={f as FigSpec} walk={walk + (ph as number)} armF={[30, -40]} armB={[-10, 10]} /></g>
            ))}
            <g transform={`translate(0 ${-250 + 4 * Math.sin(walk * 2)})`}>
              <rect x={-150} y={-10} width={300} height={16} fill="#5a3a22" />
              <rect x={-40} y={-120} width={90} height={120} fill="#6a4a2e" />
              <g transform="translate(0 0) scale(0.3)"><Figure f={F.grandma} armF={[60, -60]} armB={[40, -40]} /></g>
            </g>
          </g>
          {/* the family walking with shovels (ON TWOS) */}
          {fam.map((m, k) => {
            const s = g * (m.s ?? 1);
            return (
              <g key={k} transform={`translate(${m.x + adv} ${1350}) scale(${s})`}>
                <Figure f={m.f} walk={walk + k * 1.3} armF={[12 + 110 * lift, -20 - 120 * lift]} armB={[-10, -6]}
                  hold={(h) => <g transform={`translate(${h.x} ${h.y})`}><Shovel a={-20 + 95 * lift} /></g>} />
              </g>
            );
          })}
          {/* heat shimmer dust low over the road (ones) */}
          {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={((t * 60 + k * 500) % 2000)} cy={1520 + k * 20} rx={260} ry={30} fill="#f2e4c4" opacity={0.25} />)}
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 14 (night): a faceless man, seen only from behind, hands out handfuls to a long line; a big scoop on "counting" ============ */
export const S14: React.FC = () => {
  const { t, t2, p } = useShot();
  const tc = wordAt(14, /^counting/i, 0.87);
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
      <BandImg id="farcity/street" k={0.7} cam={cam} />
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
          <ellipse cx={G.x + 230} cy={G.y - 60} rx={170} ry={60} fill="#000" opacity={0.4} />
          <path d={`M${G.x + 150} ${G.y - 20} C${G.x + 140} ${G.y - 240} ${G.x + 330} ${G.y - 250} ${G.x + 320} ${G.y - 20} Z`} fill="#c9b48a" />
          <path d={`M${G.x + 170} ${G.y - 220} Q${G.x + 235} ${G.y - 270} ${G.x + 300} ${G.y - 220}`} stroke="#8a7450" strokeWidth={10} fill="none" />
          {(() => {
            // seen FROM BEHIND: his left hand reaches forward to the first cupped hands, his right hand dips into the sack
            const toL = (x: number, y: number) => ({ x: (x - G.x) / G.s, y: (y - G.y) / G.s });
            const hl = toL(600 + 30 * reach, 1100 + 20 * (1 - reach)), hr = toL(G.x + 200 - 30 * reach, G.y - 230 + 60 * (1 - reach));
            return (
              <g>
                {[[-5, -3], [5, -3], [0, -6]].map(([dx, dy], k) => (
                  <g key={k} transform={`translate(${G.x + dx} ${G.y + dy}) scale(${G.s})`}><BackFigure f={F.giver} handL={hl} handR={hr} fill="#ffd79a" /></g>
                ))}
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

/* ============ shot 15 (night): an old woman whispers to a young man in the line; his eyes widen on "name" ============ */
export const S15: React.FC = () => {
  const { t, t2, p } = useShot();
  const tw = wordAt(15, /^whisper/i, 0.4), tn = wordAt(15, /^name/i, 0.57);
  const wide = ramp(t2, tn, tn + 0.1, EOUT);
  const look = bump(t2, 0.2, 0.8); // both glance back toward the doorway first
  const beat = (x: number) => Math.max(bump(x % 0.9, 0, 0.09), 0.6 * bump(x % 0.9, 0.16, 0.08)); // heartbeat pulse (camera, on ones)
  const cam: Cam = { zoom: 1.05 + 0.06 * EIO(p) + 0.012 * beat(t), dx: 0, dy: 0, tx: 0, ty: 0, ox: 600, oy: 820 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1c1828' }}>
      <BandImg id="farcity/line" k={0.6} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <Pair id="p15" ex={600} ey={820} s={1.55} wh={P.oldWoman} li={P.youngMan} talk={flutter(t2, t2 > tw - 0.2 ? 1 : 0)}
            lean={-6 * look + 10 * ramp(t2, tw - 0.3, tw, EOUT)} wide={wide} cup={ramp(t2, tw - 0.3, tw, EOUT)} liLean={-8 * look - 3 * wide}
            bob={2 * Math.sin(t2 * 2)} rim="#ffd79a" rimOp={0.75} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 16: title card over drifting smoke ============ */
const SMOKE = Array.from({ length: 9 }, (_, i) => ({ x: (i * 377) % 1600, y: 300 + (i * 211) % 1300, r: 220 + (i % 3) * 90, v: 18 + (i % 4) * 9 }));
const TMOTES = Array.from({ length: 22 }, (_, i) => ({ x: (i * 397) % 1080, y: (i * 683) % 1920, r: 1.5 + (i % 4) * 0.9, sp: 8 + (i % 5) * 5, ph: i * 1.7 }));

export const S16: React.FC = () => {
  const { t, p } = useShot();
  const words: [string, number, number][] = [['NINETY-NINE', 0, 0.3]];
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
        <defs><radialGradient id="p16s" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#2a2228" stopOpacity={0.85} /><stop offset="1" stopColor="#2a2228" stopOpacity={0} /></radialGradient></defs>
        {SMOKE.map((s, k) => <ellipse key={k} cx={((s.x + t * s.v) % 1600) - 260} cy={s.y + 30 * Math.sin(t * 0.4 + k)} rx={s.r * 1.6} ry={s.r} fill="url(#p16s)" opacity={0.55} />)}
        <ellipse cx={540} cy={880} rx={620} ry={330} fill="url(#p25g)" opacity={glow} />
        {TMOTES.map((m, k) => {
          const y = (((m.y - t * m.sp) % 1920) + 1920) % 1920, x = m.x + Math.sin(t * 0.6 + m.ph) * 14;
          return <circle key={k} cx={x} cy={y} r={m.r} fill="#f1ead8" opacity={(0.12 + 0.12 * Math.sin(t * 1.3 + m.ph)) * glow} />;
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${z})`, transformOrigin: '540px 880px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -160, width: 920 }}>
          <div style={{ fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 100, letterSpacing: '0.08em', color: '#f1ead8', lineHeight: 1.18, textAlign: 'center', whiteSpace: 'nowrap', paddingLeft: '0.32em' }}>
            <div>{line(0)}</div>
          </div>
          <div style={{ width: 320, height: 2, marginTop: 44, transform: `scaleX(${rule})`, background: `linear-gradient(90deg, rgba(217,164,65,0), ${GREEN}, rgba(217,164,65,0))` }} />
          <div style={{ marginTop: 34, fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 30, letterSpacing: '0.32em', paddingLeft: '0.32em', color: GREEN, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`, whiteSpace: 'nowrap' }}>CHAPTER 7 · THE LAST DAYS</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
