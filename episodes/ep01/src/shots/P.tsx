import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt, spanOf, FPS } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Phone, Feed, UI_DAY, UI_NIGHT, CardSpec, SW, SH, CH, NOTIF_H, Notif } from '../art/screen_phone';
import { HoldBack, HoldFront, ThumbECU, SuitHand, Sleeper } from '../art/screen_hand';
import { DESK } from '../sets/screen';

const { fontFamily: TITLE_FONT } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });

/** Live layers are in world space; Fr shifts to FRAME coords (frame = world - (108,192)). */
const Fr: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const DEG = 180 / Math.PI;
/** sin bump 0 -> 1 -> 0 over [a, a + d] */
const bump = (t: number, a: number, d: number) => { const u = clamp01((t - a) / d); return Math.sin(Math.PI * u); };

const FEED4: CardSpec[] = [
  { photo: 'city', b1: 0.92, b2: 0.6, meta: 0.32 },
  { photo: 'quake', tag: 'BREAKING', b1: 0.95, b2: 0.7, meta: 0.3 },
  { photo: 'night', tag: 'BREAKING', b1: 0.88, b2: 0.66, meta: 0.36 },
  { photo: 'podium', tag: 'UPDATE', tagC: '#59606c', b1: 0.94, b2: 0.58, meta: 0.28 },
  { photo: 'field', b1: 0.85, b2: 0.5, meta: 0.3 },
  { photo: 'crowd', b1: 0.9, b2: 0.62, meta: 0.34 },
];

/* ============ shot 9 (was 4): over-the-shoulder, a hand holding a phone, the feed jumps on each headline ============ */
export const S09: React.FC = () => {
  const { p, t, t2, sec } = useShot();
  const beats = [wordAt(9, /earthquake/i, 0.21), wordAt(9, /^life/i, 0.35), wordAt(9, /^trusted/i, 0.65)];
  const LEAD = 0.14, DUR = 0.42;
  const sAt = (x: number) => {
    let s = 0.2 * ramp(x, 0.2, beats[0] - LEAD, Easing.inOut(Easing.quad));
    beats.forEach((b, i) => { s += (i === 0 ? 0.8 : 1) * ramp(x, b - LEAD, b - LEAD + DUR, EOUT); });
    return s + 0.08 * ramp(x, beats[2] + 0.6, sec, Easing.inOut(Easing.quad));
  };
  const s = sAt(t);
  const v = (sAt(t + 1 / 120) - sAt(t - 1 / 120)) * 60; // cards per second
  const L = Math.min(90, (Math.abs(v) * CH) / 60); // 180-degree shutter smear
  // the hand (and the phone it holds) moves ON TWOS; the feed scroll, camera and the window stay on ones
  const flick = Math.max(...beats.map((b) => bump(t2, b - LEAD - 0.1, 0.55)));
  const h = handheld(t, 0.45), hh = handheld(t2 * 1.3 + 4, 0.3);
  const cam: Cam = { zoom: 1 + 0.03 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr * 0.5, ox: 585, oy: 840 };
  const pan = 380 - 760 * p; // the train moves: the city slides left behind the glass
  return (
    <AbsoluteFill style={{ backgroundColor: '#d6dfe2' }}>
      <BandImg id="screen/train-out" k={0.3} cam={{ ...cam, tx: (cam.tx ?? 0) * 0.3 + pan }} />
      <BandImg id="screen/train-in" k={0.5} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <defs>
            <radialGradient id="p4bloom" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fffdf2" stopOpacity={0.35} /><stop offset="1" stopColor="#fffdf2" stopOpacity={0} /></radialGradient>
          </defs>
          {/* window light wrapping the phone edges */}
          <ellipse cx={560} cy={560} rx={520} ry={560} fill="url(#p4bloom)" />
          <g transform={`translate(${585 + hh.hx} ${840 + hh.hy}) rotate(${4 + hh.hr * 2})`}>
            <HoldBack />
            <Phone id="p4">
              <Feed id="f4" ui={UI_DAY} cards={FEED4} s={s} L={L} />
            </Phone>
            <HoldFront id="h4" flick={flick} />
          </g>
        </Fr>
      </Live>
      {/* over-the-shoulder: soft dark hair + shoulder, foreground left (closest layer, out of focus) */}
      <Live k={1.3} cam={cam}>
        <Fr>
          <defs>
            <radialGradient id="p4hair" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#15181e" stopOpacity={1} /><stop offset="0.72" stopColor="#15181e" stopOpacity={0.96} /><stop offset="1" stopColor="#15181e" stopOpacity={0} /></radialGradient>
            <radialGradient id="p4sh" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#3a4554" stopOpacity={1} /><stop offset="0.78" stopColor="#3a4554" stopOpacity={0.97} /><stop offset="1" stopColor="#3a4554" stopOpacity={0} /></radialGradient>
          </defs>
          <ellipse cx={-110} cy={360} rx={250} ry={470} fill="url(#p4hair)" />
          <ellipse cx={-80} cy={1640} rx={380} ry={560} fill="url(#p4sh)" />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 10 (was 5): extreme close-up, the thumb swipes cards away until the feed is a blur ============ */
const FEED5: CardSpec[] = [
  { photo: 'road', tag: 'BREAKING', b1: 0.93, b2: 0.64, meta: 0.3 },
  { photo: 'sea', b1: 0.88, b2: 0.56, meta: 0.34 },
  { photo: 'crowd', tag: 'UPDATE', tagC: '#59606c', b1: 0.95, b2: 0.7, meta: 0.28 },
  { photo: 'quake', b1: 0.9, b2: 0.6, meta: 0.32 },
  { photo: 'podium', tag: 'BREAKING', b1: 0.86, b2: 0.66, meta: 0.3 },
  { photo: 'city', b1: 0.92, b2: 0.5, meta: 0.36 },
  { photo: 'night', b1: 0.9, b2: 0.62, meta: 0.3 },
  { photo: 'field', tag: 'UPDATE', tagC: '#59606c', b1: 0.84, b2: 0.58, meta: 0.33 },
];
const SC5 = 1.9; // phone scale in the extreme close-up

export const S10: React.FC = () => {
  const { t, p, t2 } = useShot();
  const beats = [wordAt(10, /^Read/i, 0.55), wordAt(10, /^Swipe/i, 0.63), wordAt(10, /^Forgotten/i, 0.73)];
  const FL = 0.24; // a fling lasts 0.24 s
  const t0 = beats[2] + 0.18; // the feed starts to stream
  const fu = (i: number, x: number) => clamp01((x - (beats[i] - 0.06)) / FL);
  const flingX = (i: number, x: number) => (i >= 0 && i < 3 ? -SW * 1.3 * Easing.in(Easing.quad)(fu(i, x)) : 0);
  const sAt = (x: number) => {
    let s = -0.42 + 0.42 * ramp(x, 0, beats[0] - 0.12, EOUT);
    beats.forEach((b) => { s += ramp(x, b - 0.06 + FL * 0.55, b - 0.06 + FL * 0.55 + 0.2, EOUT); });
    if (x > t0) s += 30 * Math.pow(x - t0, 2.2);
    return s;
  };
  const s = sAt(t);
  const v = (sAt(t + 1 / 120) - sAt(t - 1 / 120)) * 60;
  const L = Math.min(700, (Math.abs(v) * CH) / (t > t0 ? 30 : 60));
  const fling = (i: number) => {
    const dx = flingX(i, t);
    const vx = (flingX(i, t + 1 / 120) - flingX(i, t - 1 / 120)) * 60;
    return { dx, rot: (dx / SW) * 9, Lx: Math.min(120, Math.abs(vx) / 60) };
  };
  // thumb ON TWOS: tip path (frame px); the whole hand follows most of the motion so the thumb keeps its short length
  const T0 = { x: 600, y: 1130 }, B0 = { x: 870, y: 1500 };
  let tx = 0, ty = 70 - 150 * ramp(t2, 0.1, 1.5, EIO);
  beats.forEach((b) => {
    const w = clamp01((t2 - (b - 0.09)) / 0.34);
    const o = w < 0.55 ? EIO(w / 0.55) : 1 - EIO((w - 0.55) / 0.45);
    tx -= 400 * o; ty -= 30 * o;
  });
  ty -= 260 * bump(t2, t0 - 0.14, 0.5);
  tx += 60 * bump(t2, t0 - 0.14, 0.5);
  const T = { x: T0.x + tx, y: T0.y + ty }, B = { x: B0.x + tx * 0.78, y: B0.y + ty * 0.7 };
  const ang = Math.atan2(T.y - B.y, T.x - B.x) * DEG;
  const len = Math.hypot(T.x - B.x, T.y - B.y);
  const TS = 2.45; // thumb scale
  const h = handheld(t, 0.18);
  const cam: Cam = { zoom: 1, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 960 };
  const camBg: Cam = { zoom: 1.7, dx: 0, dy: 0, tx: h.hx * 0.5, ty: h.hy * 0.5, ox: 160, oy: 700 };
  const pan = 300 - 500 * p;
  return (
    <AbsoluteFill style={{ backgroundColor: '#d6dfe2' }}>
      <BandImg id="screen/train-out" k={1} cam={{ ...camBg, tx: (camBg.tx ?? 0) + pan }} />
      <BandImg id="screen/train-in" k={1} cam={camBg} />
      <Live k={1} cam={cam}>
        <Fr>
          <g transform={`translate(${589} ${1160}) rotate(-4) scale(${SC5})`}>
            <Phone id="p5" rimOp={0.8}>
              <Feed id="f5" ui={UI_DAY} cards={FEED5} s={s} L={L} fling={fling} />
            </Phone>
          </g>
          {/* soft shadow of the thumb on the glass */}
          <g transform={`translate(${B.x + 30} ${B.y + 34}) rotate(${ang}) scale(${TS})`} opacity={0.16}>
            <path d={`M-30 -60 L${len / TS - 30} -54 Q${len / TS + 18} 0 ${len / TS - 34} 58 L-30 66 Z`} fill="#3a3028" />
          </g>
          <g transform={`translate(${B.x} ${B.y}) rotate(${ang}) scale(${TS})`}>
            <ThumbECU id="t10" Lt={Math.min(200, Math.max(150, len / TS))} />
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 14: under the meeting table, a thick envelope passes between two suit sleeves ============ */
const Envelope: React.FC = () => (
  <g>
    {/* thickness (front face) then the top face, bulging with what is inside */}
    <path d="M-180 26 L180 26 L176 96 Q0 110 -176 96 Z" fill="#6f4d26" />
    <path d="M-176 90 Q0 104 176 90" stroke="#4e3519" strokeWidth={5} fill="none" opacity={0.7} />
    <path d="M-180 -86 Q0 -102 180 -86 L180 26 Q0 42 -180 26 Z" fill="#a8793f" />
    <path d="M-180 -86 Q0 -102 180 -86" stroke="#d4a868" strokeWidth={4} fill="none" opacity={0.8} />
    <path d="M-180 -86 L-20 -18 Q0 -12 20 -18 L180 -86" stroke="#80592c" strokeWidth={4} fill="none" opacity={0.7} />
    <path d="M-140 14 Q0 26 140 14" stroke="#8a6232" strokeWidth={6} fill="none" opacity={0.5} />
    <rect x={-12} y={-22} width={24} height={14} rx={4} fill="#5e4122" />
  </g>
);

export const S14: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tw = wordAt(14, /^wrong/i, 0.58), th = wordAt(14, /^hands/i, 0.75);
  // all hand/envelope motion ON TWOS: the giver slides it over, the taker grips on "wrong", the giver lets go on "hands"
  const slide = ramp(t2, 0, tw, EIO);
  const reach = ramp(t2, 0.1, tw - 0.05, EOUT);
  const grip = ramp(t2, tw - 0.12, tw + 0.1, EOUT);
  const away = ramp(t2, th, Math.min(sec, th + 0.5), EIO);
  const ex = 470 + 70 * slide + 80 * away, ey = 960 + 8 * Math.sin(t2 * 2.2);
  const gx = -170 - 90 * away, gy = 4 + 24 * away; // giver (left) grip point, envelope-local
  const rx = 170 + (1 - reach) * 360, ry = 2;      // taker (right) grip point, envelope-local
  const h = handheld(t, 0.25);
  const cam: Cam = { zoom: 1.02, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 960 };
  const giverSkin = { skin: '#9c6b52', shade: '#68412f' };
  return (
    <AbsoluteFill style={{ backgroundColor: '#bdb6a8' }}>
      <BandImg id="screen/meeting" k={0.7} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <defs>
            <radialGradient id="p14sh" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#000" stopOpacity={0.35} /><stop offset="1" stopColor="#000" stopOpacity={0} /></radialGradient>
          </defs>
          {/* shadow under the hands, on the dim space below the table */}
          <ellipse cx={ex} cy={ey + 300} rx={620} ry={90} fill="url(#p14sh)" />
          <g transform={`translate(${ex} ${ey}) scale(1.45)`}>
            {/* fingers under the envelope edges first, then the envelope, then sleeves, backs of hands and thumbs */}
            <g transform={`translate(${rx} ${ry}) scale(-1 1) rotate(-20)`}><SuitHand part="under" suit="#2c2e33" suitD="#1b1c20" /></g>
            <g transform={`translate(${gx} ${gy}) rotate(${-18 + 8 * away})`}><SuitHand part="under" {...giverSkin} /></g>
            <g transform={`rotate(${-3 + 3 * slide})`}><Envelope /></g>
            <g transform={`translate(${gx} ${gy}) rotate(${-18 + 8 * away})`}><SuitHand part="over" grip={1 - away} {...giverSkin} /></g>
            <g transform={`translate(${rx} ${ry}) scale(-1 1) rotate(-20)`}><SuitHand part="over" grip={grip} suit="#2c2e33" suitD="#1b1c20" /></g>
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 21 (was 10): dark bedroom, a man asleep behind the desk; the phone wakes with "Forwarded many times"; then EPISODE 01 ============ */
const TitleCard: React.FC<{ t: number }> = ({ t }) => {
  const a = ramp(t, 0.04, 0.38, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
      <AbsoluteFill style={{ opacity: a, background: 'radial-gradient(ellipse 46% 10% at 50% 50%, rgba(217,164,65,0.16) 0%, rgba(217,164,65,0) 100%)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: a, transform: `scale(${0.97 + 0.03 * a})` }}>
        <div style={{ fontFamily: TITLE_FONT, fontWeight: 700, fontSize: 92, letterSpacing: '0.16em', paddingLeft: '0.16em', color: GREEN, lineHeight: 1, whiteSpace: 'nowrap', maxWidth: 920 }}>EPISODE 01</div>
        <div style={{ width: 260, height: 2, marginTop: 34, background: `linear-gradient(90deg, rgba(217,164,65,0), ${GREEN}, rgba(217,164,65,0))`, opacity: 0.8 }} />
      </div>
    </AbsoluteFill>
  );
};

const PH_S = 0.8, PH_SQ = 0.84, PH_ROT = -8; // phone lying on the desk: scale, foreshortening, in-plane turn

export const S21: React.FC = () => {
  const { t, t2, sec } = useShot();
  const sp = spanOf(21);
  const ws = sp.shot.words;
  const lastEnd = ws.length ? ws[ws.length - 1].end - sp.from / FPS : sec * 0.8;
  const cut = Math.min(Math.max(lastEnd + 0.1, sec - 1.5), sec - 1.0); // title fully visible >= 0.6 s before the end
  if (t >= cut) return <TitleCard t={t - cut} />;
  const arr = [wordAt(21, /^message/i, 0.17), wordAt(21, /^spread/i, 0.27), wordAt(21, /^city/i, 0.47)];
  const br = 0.5 + 0.5 * Math.sin((t2 / 3.6) * Math.PI * 2 - 1.2); // slow breathing, on twos
  const on = ramp(t, arr[0] - 0.06, arr[0] + 0.08, EOUT);
  const push = ramp(t, 0, cut, Easing.inOut(Easing.sin));
  const { x: px, y: py } = DESK.phone;
  const cam: Cam = { zoom: 1 + 0.28 * push, dx: 0, dy: 0, ox: px, oy: py - 80 };
  const ar = arr.map((a) => ramp(t, a, a + 0.3, EOUT));
  const glow = on * (0.8 + 0.07 * ar[1] + 0.07 * ar[2] + 0.04 * Math.sin(t * 3));
  return (
    <AbsoluteFill style={{ backgroundColor: '#030409' }}>
      <BandImg id="screen/room" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <defs>
            <radialGradient id="p10g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#bfe3ff" stopOpacity={0.3} /><stop offset="1" stopColor="#bfe3ff" stopOpacity={0} /></radialGradient>
            <clipPath id="p21bed"><rect x={-300} y={-300} width={1700} height={DESK.y + 300} /></clipPath>
          </defs>
          {/* the sleeper in the bed behind the desk, hidden below the desk edge */}
          <g clipPath="url(#p21bed)">
            <ellipse cx={600} cy={470} rx={620} ry={170} fill="url(#p10g)" opacity={0.7 * on} />
            <Sleeper br={br} light={on} />
          </g>
          {/* the room before the screen wakes: almost black */}
          <rect x={-400} y={-400} width={1880} height={2720} fill="#010205" opacity={0.88 * (1 - on)} />
          {/* screen light bloom on the desk */}
          <ellipse cx={px} cy={py} rx={420} ry={330} fill="url(#p10g)" opacity={glow} />
          <g transform={`translate(${px} ${py}) scale(1 ${PH_SQ}) rotate(${PH_ROT}) scale(${PH_S})`}>
            {/* contact shadow + body thickness */}
            <rect x={-270 + 26} y={-560 + 34} width={540} height={1120} rx={78} fill="#000" opacity={0.55} />
            <rect x={-270} y={-560 + 16} width={540} height={1120} rx={78} fill="#0b0c10" />
            <path d="M-262 470 Q-262 576 -190 576 L190 576 Q262 576 262 470" stroke="#3a4560" strokeWidth={4} fill="none" opacity={0.5 * on} />
            <Phone id="p10" rim="#bfe3ff" rimOp={0.2 + 0.45 * on} on={on} glare={0.5} edge={on > 0.5 ? '#46506a' : '#2a2f39'}>
              <rect x={0} y={0} width={SW} height={SH} fill={UI_NIGHT.bg} />
              <rect x={0} y={0} width={SW} height={SH} fill="url(#p10s)" />
              <defs>
                <radialGradient id="p10s" cx="0.5" cy="0.25" r="0.8"><stop offset="0" stopColor="#2a3550" stopOpacity={0.55} /><stop offset="1" stopColor="#2a3550" stopOpacity={0} /></radialGradient>
              </defs>
              {/* minimal status bar */}
              <rect x={44} y={22} width={58} height={14} rx={7} fill="#c9ccd4" opacity={0.6} />
              {[0, 1, 2, 3].map((i) => <rect key={i} x={SW - 132 + i * 11} y={34 - i * 4} width={7} height={6 + i * 4} rx={2} fill="#c9ccd4" opacity={0.65} />)}
              <rect x={SW - 76} y={20} width={36} height={18} rx={5} fill="none" stroke="#c9ccd4" strokeWidth={2.5} opacity={0.55} />
              {/* notifications: the newest arrives on top and pushes the older ones down */}
              {arr.map((_, j) => {
                const below = ar.slice(j + 1).reduce((a2, b2) => a2 + b2, 0);
                const y = 120 + below * (NOTIF_H + 16) - (1 - ar[j]) * 46;
                return ar[j] > 0 ? <Notif key={j} y={y} a={ar[j]} w1={[0.82, 0.7, 0.88][j]} w2={[0.55, 0.62, 0.4][j]} /> : null;
              })}
            </Phone>
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};
