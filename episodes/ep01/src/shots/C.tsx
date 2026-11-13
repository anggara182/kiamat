import React from 'react';
import { AbsoluteFill, interpolateColors } from 'remotion';
import { loadFont } from '@remotion/google-fonts/IBMPlexMono';
import { useShot, BandImg, Live, Cam, ramp, EIO, clamp01 } from '../comp/Camera';
import { FRAME } from '../art/world';
import { wordAt, spanOf, FPS } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { CITY_PAL, Mood, Pal, Win, SkyArt, BandWindows, NearArt, PoleArt, MosqueLamp, RedLights, Star } from '../art/city_skyline';
import { RoofMan, RoofDeck, Tank, Laundry, WindowHouse, RoofPal } from '../art/city_people';
import { Alley, OldMan, Flock, ALLEY_WINS, AV, gy } from '../art/city_alley';

const { fontFamily: MONO } = loadFont('normal', { weights: ['500'], subsets: ['latin'] });

/** parallax per layer: sky far, band (towers + mosque) mid, kampung rooftops near, utility pole nearest */
const K = { sky: 0.35, band: 0.8, near: 1, pole: 1.18 };

const mixPal = (a: Pal, b: Pal, x: number): Pal => {
  if (x <= 0.001) return a;
  const out: Pal = { ...a };
  for (const key of ['nearA', 'nearB', 'near', 'nearD', 'mist', 'win'] as const) out[key] = interpolateColors(Math.min(1, x), [0, 1], [a[key], b[key]]);
  out.mistO = a.mistO + (b.mistO - a.mistO) * Math.min(1, x);
  return out;
};

type StarP = { x: number; y: number; a: number; s?: number; k: number };
type SceneP = { cam: Cam; m: Mood; night?: number; on: (w: Win) => number; lamp?: number; arches?: number; red?: number; t: number; star?: StarP; pole?: boolean; mirror?: boolean; children?: React.ReactNode };

/** The whole city: live sky -> baked skyline band (crossfade to night) -> band lights -> live near rooftops -> pole. */
const CityScene: React.FC<SceneP> = ({ cam, m, night = 0, on, lamp = 0, arches = 1, red = 0, t, star, pole = true, mirror = false, children }) => {
  const P = CITY_PAL[m];
  const NP = mixPal(P, CITY_PAL.night, night);
  const bg = interpolateColors(Math.min(1, night), [0, 1], [P.sky[0], CITY_PAL.night.sky[0]]);
  const fade = night > 0.005 && m !== 'night';
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <AbsoluteFill style={{ transform: mirror ? 'scaleX(-1)' : undefined }}>
      <Live k={K.sky} cam={cam}>
        <SkyArt m={m} />
        {fade && <g opacity={night}><SkyArt m="night" /></g>}
      </Live>
      {star && <Live k={star.k} cam={cam}><Star x={star.x} y={star.y} a={star.a} s={star.s} /></Live>}
      <BandImg id={`city/${m}`} k={K.band} cam={cam} />
      {fade && <BandImg id="city/night" k={K.band} cam={cam} style={{ opacity: night }} />}
      <Live k={K.band} cam={cam}>
        <BandWindows p={NP} on={on} />
        <MosqueLamp on={lamp} p={NP} arches={arches} />
        <RedLights t={t} on={red} />
      </Live>
      <Live k={K.near} cam={cam}><NearArt p={NP} on={on} /></Live>
      {pole && <Live k={K.pole} cam={cam}><PoleArt fill={NP.nearD} /></Live>}
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};

/** switch-on curve: plain ramp, or a fluorescent kitchen tube (on, off, on) */
const flick = (dt: number, fl: boolean) => {
  if (dt < 0) return 0;
  if (!fl) return clamp01(dt / 0.1);
  if (dt < 0.07) return 0.9;
  if (dt < 0.14) return 0.08;
  if (dt < 0.2) return 0.75;
  if (dt < 0.27) return 0.2;
  return 1;
};

/** local time (s) of the LAST word matching re in shot id */
const lastWordAt = (id: number, re: RegExp, fallback: number) => {
  const sp = spanOf(id); const ws = sp.shot.words.filter((w) => re.test(w.text));
  return ws.length ? ws[ws.length - 1].start - sp.from / FPS : (fallback * sp.dur) / FPS;
};

/** shot 3 — dawn establishing ("This city wakes before the sun."): the minaret against the first glow, birds crossing, a few windows waking. Slow push-in. */
export const S03: React.FC = () => {
  const { p, t, sec } = useShot();
  const z = 1.06 + 0.07 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ty: -20, ox: 362, oy: 900 };
  const on = (w: Win) => {
    if (w.L === 0) return w.o < 0.2 ? 1 : w.o > 0.34 ? 0 : clamp01((t - (0.15 + ((w.o - 0.2) / 0.14) * (sec - 0.4))) / 0.1);
    if (w.o < 0.08) return 1;
    if (w.o > 0.22) return 0;
    return flick(t - (0.1 + ((w.o - 0.08) / 0.14) * (sec - 0.4)), w.fl);
  };
  return (
    <CityScene cam={cam} m="dawn" on={on} t={t}>
      <Live k={0.6} cam={cam}><Flock t={t} x0={250} y0={640} vx={150} vy={-14} n={6} s={1.1} fill="#1b1a3a" seed={2} /></Live>
    </CityScene>
  );
};

/** shot 6 — dawn: the minaret with horn loudspeakers; birds lift off on "rises", its lamp lights on "prayer"; tilt down the kampung alley
 *  where an old man (sarong, peci, prayer mat on the shoulder) walks toward the mosque gate (on twos); phone screens glow in windows on "hundred". */
export const S06: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tp = wordAt(6, /^prayer/i, 0.2), tr = wordAt(6, /^rises/i, 0.3), th = wordAt(6, /^hundred/i, 0.55);
  const shift = 70 * (t / sec) + 980 * ramp(t, tr - 0.2, sec - 0.12, EIO);
  const dark = ALLEY_WINS.map((w, i) => (w[3] ? -1 : i)).filter((i) => i >= 0);
  const phones = (i: number) => { const k = dark.indexOf(i); return k < 0 ? 0 : clamp01((t - (th + k * 0.07)) / 0.05); };
  const d = 0.47 - 0.05 * (t2 / sec);
  return (
    <AbsoluteFill style={{ backgroundColor: CITY_PAL.dawn.sky[0] }}>
      <svg viewBox={`0 ${shift} ${FRAME.w} ${FRAME.h}`} style={{ position: 'absolute', inset: 0, width: FRAME.w, height: FRAME.h }}>
        <Alley t={t} lamp={ramp(t, tp, tp + 0.3)} lift={t - tr} phones={phones} skyDy={shift * 0.45} />
        <OldMan x={AV.x - 30 + 20 * Math.sin(t2 * 1.1)} y={gy(d)} h={1120 * d} ph={t2 * Math.PI * 1.6} rim="#ffcf9e" />
      </svg>
    </AbsoluteFill>
  );
};

/** foreground roof palettes */
const ROOF_DUSK: RoofPal = { deck: '#120e22', deckTop: '#1d1730', tank: '#0f0b1d', rim: '#ffc28a', rimO: 0.65 };
const ROOF_NIGHT: RoofPal = { deck: '#030409', deckTop: '#070910', tank: '#05060c', rim: '#8fa3d6', rimO: 0.55 };

/** shot 15 — dusk from a kampung rooftop behind laundry lines, the skyline seen mirrored (minaret on the right third). Very slow pull-back. */
export const S15: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.12 - 0.07 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ty: 40, ox: 540, oy: 1000 };
  const on = (w: Win) => (w.o < 0.16 + 0.08 * p ? 1 : 0);
  return (
    <CityScene cam={cam} m="dusk" on={on} t={t} pole={false} mirror red={0.6}>
      <Live k={0.5} cam={cam}><Flock t={t} x0={1150} y0={560} vx={-120} vy={-8} n={4} s={0.8} fill="#2a1d36" seed={5} /></Live>
      <Live k={1.3} cam={cam}>
        <RoofDeck x0={-300} x1={1600} y={1720} p={ROOF_DUSK} />
        <Laundry x0={170} x1={1150} y0={1150} y1={1290} base={1720} fill={ROOF_DUSK.tank} rim={ROOF_DUSK.rim} rimO={0.5} t={t} />
        <Tank x={40} y={1722} s={1.5} fill={ROOF_DUSK.tank} rim={ROOF_DUSK.rim} rimO={0.5} />
      </Live>
    </CityScene>
  );
};

/** shot 21 — the skyline darkening from dusk into night, windows coming on, distant birds; source label on "foretold". Slow pull-back. */
export const S21: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.12 - 0.12 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ty: 120, ox: 760, oy: 1000 };
  const night = 0.15 + 0.65 * ramp(p, 0, 1, (n) => n);
  const L = 0.15 + 0.5 * ramp(p, 0.05, 0.95, (n) => n);
  const on = (w: Win) => clamp01((L - w.o) / 0.02);
  const tf = wordAt(21, /^foretold/i, 0.07);
  const lab = ramp(t, tf, tf + 0.4);
  return (
    <CityScene cam={cam} m="dusk" night={night} on={on} t={t} lamp={ramp(p, 0.3, 0.7)} red={ramp(p, 0.1, 0.4)}>
      <Live k={0.5} cam={cam}><Flock t={t} x0={300} y0={760} vx={70} vy={-10} n={5} s={0.6} fill="#241a30" seed={9} /></Live>
      <div style={{ position: 'absolute', top: 226, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: lab }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 25, letterSpacing: '0.14em', whiteSpace: 'nowrap', color: GREEN, textShadow: '0 2px 10px rgba(6,4,12,0.6)' }}>
          SAHIH MUSLIM 8 · SAHIH AL-BUKHARI 59, 7121
        </div>
        <div style={{ width: 64, height: 2, marginTop: 14, background: GREEN, opacity: 0.55 }} />
      </div>
    </CityScene>
  );
};

/** shot 22 — night: a lone man (peci, sarong) on a kampung rooftop among water tanks looks up (on twos); tilt up from him to the single star, which brightens on "God". */
export const S22: React.FC = () => {
  const { p, t, t2, p2 } = useShot();
  const tilt = ramp(p, 0.28, 0.9, EIO);
  const cam: Cam = { zoom: 1.08 + 0.02 * p, dx: 0, dy: 1150 * tilt, ty: 0, ox: 540, oy: 960 };
  const tg = wordAt(22, /^God/i, 0.78);
  const g = ramp(t, tg - 0.05, tg + 0.5);
  const star = { x: 760, y: -77, k: 0.75, a: 0.35 + 0.45 * ramp(p, 0.15, 0.6) + 0.2 * g, s: 1 + 0.55 * g };
  const on = (w: Win) => (w.o < 0.7 ? 1 : 0);
  const up = 0.12 + 0.88 * ramp(p2, 0, 0.3);
  return (
    <CityScene cam={cam} m="night" on={on} t={t} lamp={0.3} red={1} star={star} pole={false}>
      <Live k={1.35} cam={cam}>
        <RoofDeck x0={-300} x1={1600} y={1530} p={ROOF_NIGHT} />
        <Tank x={150} y={1532} s={1.2} fill={ROOF_NIGHT.tank} rim={ROOF_NIGHT.rim} rimO={0.45} />
        <Tank x={1260} y={1532} s={1.7} fill={ROOF_NIGHT.tank} rim={ROOF_NIGHT.rim} rimO={0.45} />
        <rect x={1120} y={1080} width={5} height={452} fill={ROOF_NIGHT.tank} />
        {[0, 1, 2].map((i) => <rect key={i} x={1120 - 30 + i * 6} y={1090 + i * 16} width={60 - i * 12} height={4} fill={ROOF_NIGHT.tank} />)}
        <Tank x={900} y={1532} s={1.4} fill={ROOF_NIGHT.tank} rim={ROOF_NIGHT.rim} rimO={0.45} />
        <RoofMan x={690} y={1532} h={540} up={up} br={t2 * 2.4} fill="#04050a" shirt="#121827" sarong="#16121f" rim="#9fb3e6" rimO={0.75} hand={[825, 1362]} />
      </Live>
    </CityScene>
  );
};

/** shot 23 — night, slow drift: windows across the city switch off; in a near window a mother turns off the lamp beside her sleeping child on the LAST "one" (on twos). */
export const S23: React.FC = () => {
  const { p, t, sec, t2 } = useShot();
  const cam: Cam = { zoom: 1.42 + 0.04 * ramp(p, 0, 1, (n) => n), dx: -12 * p, dy: 0, ty: -260, ox: 760, oy: 1250 };
  const tl = wordAt(23, /^lights/i, 0.5);
  const tone = lastWordAt(23, /^one/i, 0.86);
  const off = 0.16 * ramp(t, 0.2, tl, (n) => n) + 0.72 * ramp(t, tl, sec - 0.3, (n) => n);
  const on = (w: Win) => (w.o < 0.78 ? clamp01((w.o2 - off) / 0.006) : 0);
  const reach = ramp(t2, tl, tone - 0.08) * (1 - 0.5 * ramp(t2, tone + 0.25, tone + 0.8));
  return (
    <CityScene cam={cam} m="night" on={on} t={t} lamp={0.6} arches={clamp01((0.55 - off) / 0.006)} red={1} pole={false}>
      <svg viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} style={{ position: 'absolute', inset: 0, width: FRAME.w, height: FRAME.h, transform: `translateX(${-6 * p}px)` }}>
        <WindowHouse reach={reach} lamp={t < tone ? 1 : 0} br={t2 * 2.2} wall="#04050a" rim="#4a5a84" />
      </svg>
    </CityScene>
  );
};
