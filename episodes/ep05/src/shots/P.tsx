import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Figure, FigSpec } from '../art/library_people';
import { DOORS, FACADE } from '../sets/library';

const { fontFamily: TITLE_FONT } = loadCinzel('normal', { weights: ['600', '700'], subsets: ['latin'] });

/** Live layers are in world space; Fr shifts to FRAME coords (frame = world - (108,192)). */
const Fr: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const bump = (t: number, a: number, d: number) => { const u = clamp01((t - a) / d); return Math.sin(Math.PI * u); };

const CAST: Record<string, FigSpec> = {
  librarian: { skin: '#b07a5e', hair: 'scarf', hairC: '#4a5a6a', top: '#7a6a5a', topD: '#5a4c3e', legs: '#3a3438', coat: true },
  kidA: { skin: '#c48d6e', hair: 'short', hairC: '#151110', top: '#e8e4da', topD: '#b8b2a6', legs: '#3a4a6e' },
  kidB: { skin: '#9c6b52', hair: 'long', hairC: '#1a1412', top: '#c4504a', topD: '#943a34', legs: '#5a4a3a' },
  kidC: { skin: '#8a5a44', hair: 'short', hairC: '#1a1512', top: '#5a8a4a', topD: '#3c6230', legs: '#2e2e34' },
};
const MOTES = Array.from({ length: 30 }, (_, i) => ({ x: (i * 211) % 1080, y: (i * 467) % 1600, r: 2 + (i % 3), sp: 10 + (i % 5) * 6, ph: i * 1.1 }));
const Dust: React.FC<{ t: number }> = ({ t }) => (
  <g>{MOTES.map((m, i) => <circle key={i} cx={m.x + 30 * Math.sin(t * 0.5 + m.ph)} cy={((m.y - t * m.sp) % 1600 + 1600) % 1600} r={m.r} fill="#fff6dc" opacity={0.3 + 0.25 * Math.sin(t * 1.2 + m.ph)} />)}</g>
);

/* ============ shot 1 HOOK (day): the librarian hauls a chain through the door handles; the lock clicks on "Monday" ============ */
export const S01: React.FC = () => {
  const { t, t2, p } = useShot();
  const tm = wordAt(1, /^Monday/i, 0.67);
  const click = ramp(t2, tm, tm + 0.06, EOUT);
  const pulling = 1 - ramp(t2, tm - 0.45, tm - 0.25); // hauling until just before the word, then the lock
  const tug = Math.sin(t2 * 9) * pulling;              // hand-over-hand tug, ON TWOS
  const h = handheld(t, 0.3);
  const cam: Cam = { zoom: 1.04 + 0.04 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy + 6 * bump(t, tm, 0.12), ox: 640, oy: DOORS.hy };
  const hx = DOORS.x + DOORS.w / 2, hy = DOORS.hy;
  const off = -t2 * 260 * pulling - (1 - pulling) * 0; // the chain slides through the handles
  // librarian stands left of the doors, facing them
  const F0 = { x: 250, y: 1980 }, S = 1.25;
  const armF: [number, number] = [78 + 8 * tug + 10 * (1 - pulling), -6 - 20 * (1 - pulling)];
  const armB: [number, number] = [38 - 20 * tug * 0.6, 50 + 20 * tug];
  return (
    <AbsoluteFill style={{ backgroundColor: '#cdb89a' }}>
      <BandImg id="library/door" k={0.8} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <defs><linearGradient id="p1sun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff6dc" stopOpacity={0.35} /><stop offset="1" stopColor="#fff6dc" stopOpacity={0} /></linearGradient></defs>
          <g transform={`translate(${F0.x} ${F0.y}) scale(${S})`}>
            <Figure f={CAST.librarian} armF={armF} armB={armB} hold={(fh, bh) => {
              // chain: back hand -> front hand -> through both handles and back (in figure-local units)
              const toL = (x: number, y: number) => ({ x: (x - F0.x) / S, y: (y - F0.y) / S });
              const a = toL(hx - 40, hy), b = toL(hx + 40, hy), c = toL(hx + 40, hy + 60), d = toL(hx - 40, hy + 70);
              const path = `M${bh.x} ${bh.y} Q${(bh.x + fh.x) / 2} ${Math.max(bh.y, fh.y) + 60} ${fh.x} ${fh.y} L${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y} L${d.x} ${d.y} Q${d.x - 60} ${d.y + 160} ${d.x - 120} ${d.y + 300}`;
              return (
                <g>
                  <path d={path} stroke="#5a6068" strokeWidth={22} fill="none" strokeDasharray="34 10" strokeDashoffset={off} strokeLinecap="round" />
                  <path d={path} stroke="#c9d0d6" strokeWidth={6} fill="none" strokeDasharray="20 24" strokeDashoffset={off - 6} opacity={0.8} />
                  {/* padlock: raised into place, snaps shut on "Monday" */}
                  {pulling < 0.95 && (
                    <g transform={`translate(${(a.x + d.x) / 2 - 10} ${(a.y + d.y) / 2 + 40 + 30 * pulling})`}>
                      <path d={`M-30 ${-20 - 34 * (1 - click)} L-30 ${-66 - 34 * (1 - click)} A30 30 0 0 1 30 ${-66 - 34 * (1 - click)} L30 -20`} stroke="#b8b8bc" strokeWidth={14} fill="none" />
                      <rect x={-52} y={-28} width={104} height={96} rx={14} fill="#a8843a" />
                      <rect x={-52} y={-28} width={104} height={16} rx={8} fill="#d4b06a" />
                    </g>
                  )}
                </g>
              );
            }} />
          </g>
          <rect x={-200} y={-200} width={1500} height={2400} fill="url(#p1sun)" />
          <Dust t={t} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 2 (day): children play ball on the library steps; the ball bounces off the chained door on "open" ============ */
export const S02: React.FC = () => {
  const { t, t2, p } = useShot();
  const to = wordAt(2, /^open/i, 0.81);
  const D = FACADE.door;
  const hit = { x: D.x + 100, y: D.y + 230 };
  const kick = { x: 300, y: 1500 };
  // ball (environment physics, on ones): kicked toward the door, hits exactly on "open", bounces back down the steps
  const k0 = to - 0.55;
  let bx: number, by: number, bs: number;
  if (t < k0) { const u = (t % 0.5) / 0.5; bx = 520 + 140 * Math.sin(t * 2.4); by = 1520 - 160 * Math.sin(Math.PI * u); bs = 1; }
  else if (t < to) { const u = (t - k0) / (to - k0); bx = kick.x + (hit.x - kick.x) * u; by = kick.y + (hit.y - kick.y) * u - 380 * Math.sin(Math.PI * u); bs = 1 - 0.45 * u; }
  else { const u = clamp01((t - to) / 0.8); bx = hit.x + 260 * u; by = hit.y + 800 * u * u - 300 * Math.sin(Math.PI * Math.min(1, u * 1.6)); bs = 0.55 + 0.45 * u; }
  const cam: Cam = { zoom: 1.14 - 0.12 * EIO(p), dx: 0, dy: 0, tx: 0, ty: 4 * bump(t, to, 0.1), ox: 540, oy: 900 };
  const run = (ph: number) => t2 * 11 + ph;
  return (
    <AbsoluteFill style={{ backgroundColor: '#dfe6ea' }}>
      <BandImg id="library/steps" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          {/* the chain across the closed door */}
          <path d={`M${D.x + 30} ${D.y + 200} Q${D.x + 100} ${D.y + 250} ${D.x + 170} ${D.y + 200}`} stroke="#7d8590" strokeWidth={10} fill="none" strokeDasharray="12 4" />
          <rect x={D.x + 88} y={D.y + 230} width={24} height={22} rx={4} fill="#a8843a" />
          {/* three kids (ON TWOS): one dribbling, one running to the kick, one jumping */}
          <g transform={`translate(${470 + 60 * Math.sin(t2 * 2.4)} 1560) scale(0.42)`}><Figure f={CAST.kidA} walk={run(0)} armF={[30 + 20 * Math.sin(run(0)), -30]} armB={[-30, -20]} /></g>
          <g transform={`translate(${260 + 40 * ramp(t2, 0, k0)} 1600) scale(0.42)`}><Figure f={CAST.kidB} walk={run(1.5)} armF={[50, -40]} armB={[-40, -30]} /></g>
          <g transform={`translate(780 ${1640 - 60 * Math.abs(Math.sin(t2 * 5))}) scale(-0.4 0.4)`}><Figure f={CAST.kidC} walk={0.6} armF={[160, 10]} armB={[150, -10]} /></g>
          {/* ball + its shadow */}
          <ellipse cx={bx} cy={Math.max(by, 1500) + 30} rx={34 * bs} ry={8 * bs} fill="#2a2018" opacity={0.25} />
          <circle cx={bx} cy={by} r={30 * bs} fill="#e8e4da" />
          <path d={`M${bx - 30 * bs} ${by} Q${bx} ${by - 18 * bs} ${bx + 30 * bs} ${by}`} stroke="#c4322b" strokeWidth={6 * bs} fill="none" />
          {/* pigeons on the steps (environment) */}
          {[[700, 1010], [760, 1060]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y - 6 * Math.abs(Math.sin(t * 3 + i))})`}><ellipse cx={0} cy={0} rx={22} ry={14} fill="#6d7378" /><circle cx={18} cy={-12} r={9} fill="#5a6066" /></g>)}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

const TMOTES = Array.from({ length: 22 }, (_, i) => ({ x: (i * 397) % 1080, y: (i * 683) % 1920, r: 1.5 + (i % 4) * 0.9, sp: 8 + (i % 5) * 5, ph: i * 1.7 }));

export const S18: React.FC = () => {
  const { t, p } = useShot();
  const words: [string, number, number][] = [['OLD', 0, 0.25], ['GODS', 0, 0.5]];
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
          <div style={{ fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 110, letterSpacing: '0.08em', color: '#f1ead8', lineHeight: 1.18, textAlign: 'center', whiteSpace: 'nowrap', paddingLeft: '0.32em' }}>
            <div>{line(0)}</div>
          </div>
          <div style={{ width: 320, height: 2, marginTop: 44, transform: `scaleX(${rule})`, background: `linear-gradient(90deg, rgba(217,164,65,0), ${GREEN}, rgba(217,164,65,0))` }} />
          <div style={{ marginTop: 34, fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 30, letterSpacing: '0.32em', paddingLeft: '0.32em', color: GREEN, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`, whiteSpace: 'nowrap' }}>CHAPTER 5 · THE LAST DAYS</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
