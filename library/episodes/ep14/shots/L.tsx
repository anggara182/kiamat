import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { LiftDefs, LitBtn, Readout, Hand, Woman, NarratorFull, btn } from '../art/lift_figs';

const BG: React.CSSProperties = { backgroundColor: '#0a0c10' };

/** Floor display above the doors (car band). */
const DoorDisplay: React.FC<{ text: string; up?: number }> = ({ text, up = 0 }) => (
  <g>
    <rect x="548" y="318" width="200" height="100" rx="8" fill="#120a02" />
    <Readout x={668} y={400} text={text} up={up} size={84} />
  </g>
);

/** shot 1 — alone in the lit car, from behind, slow push-in. */
export const S01: React.FC = () => {
  const { p } = useShot();
  const cam: Cam = { zoom: 1 + 0.12 * EIO(p), dx: 0, dy: 0, oy: 1300 };
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="lift/car" cam={cam} />
      <Live cam={cam}><LiftDefs /><DoorDisplay text="1" /></Live>
      <Live cam={cam}><NarratorFull x={648} y={1540} s={0.95} /></Live>
    </AbsoluteFill>
  );
};

/** Finger presses a sequence of floors synced to the words. */
const Presses: React.FC<{ id: number; seq: { n: number; re: RegExp; f: number }[]; t: number; shake?: number }> = ({ id, seq, t }) => {
  const times = seq.map((s) => wordAt(id, s.re, s.f));
  let cur = 0;
  times.forEach((tt, i) => { if (t >= tt - 0.25) cur = i; });
  const prev = cur > 0 ? btn(seq[cur - 1].n) : { x: 1100, y: 1900 };
  const tgt = btn(seq[cur].n);
  const k = ramp(t, times[cur] - 0.32, times[cur] - 0.05);
  const x = prev.x + (tgt.x - prev.x) * k, y = prev.y + (tgt.y - prev.y) * k;
  const press = clamp01(1 - Math.abs(t - times[cur]) / 0.15);
  const lit = new Set(seq.filter((_, i) => t >= times[i]).map((s) => s.n));
  return (
    <g>
      {[...lit].map((n) => <LitBtn key={n} n={n} a={1} />)}
      <Hand x={x + 12} y={y + 84 + press * 6} press={press} />
    </g>
  );
};

/** shot 5 — finger presses 4, 2, 6, 2, 10. */
export const S05: React.FC = () => {
  const { t, p } = useShot();
  const cam: Cam = { zoom: 1.08, dx: -40, dy: -60 };
  const seq = [
    { n: 4, re: /^Four/i, f: 0.07 }, { n: 2, re: /^Two/i, f: 0.17 }, { n: 6, re: /^Six/i, f: 0.26 },
    { n: 2, re: /^Two/i, f: 0.36 }, { n: 10, re: /^Ten/i, f: 0.45 },
  ];
  // second "Two": find the later one
  const t2 = wordAt(5, /^Ten/i, 0.45) - 0.42;
  seq[3] = { ...seq[3], re: /^$/, f: 0 };
  const seqT = seq.map((s, i) => (i === 3 ? { ...s, re: /^\u0000$/, f: t2 / (useShot().sec) } : s));
  const floor = Math.max(1, Math.min(10, Math.round(1 + 9 * ramp(p, 0.55, 0.95))));
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="lift/panel" cam={cam} />
      <Live cam={cam}><LiftDefs /><Readout x={650} y={490} text={String(floor)} up={p > 0.55 ? 1 : 0} /><Presses id={5} seq={seqT} t={t} /></Live>
    </AbsoluteFill>
  );
};

/** shot 7 — the woman steps in and stands in the corner, facing the wall. */
export const S07: React.FC = () => {
  const { t, p } = useShot();
  const cam: Cam = { zoom: 1.04 + 0.08 * EIO(p), dx: 0, dy: 0, oy: 1300 };
  const tGot = wordAt(7, /^got/i, 0.2), tStood = wordAt(7, /^stood/i, 0.45);
  const walk = ramp(t, tGot - 0.6, tStood, EIO);
  const wx = 1250 - (1250 - 420) * walk;
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="lift/car" cam={cam} />
      <Live cam={cam}><LiftDefs /><DoorDisplay text="5" /><Woman x={wx} y={1530} s={0.95} /></Live>
    </AbsoluteFill>
  );
};

/** shot 8 — presses 1; the display climbs instead. */
export const S08: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1.0, dx: 0, dy: -150 };
  const tOne = wordAt(8, /^one/i, 0.25), tUp = wordAt(8, /^up/i, 0.85), tWent = wordAt(8, /^went/i, 0.7);
  const climb = ramp(t, tWent, tUp + 0.6);
  const floor = 5 + Math.floor(climb * 3.99);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="lift/panel" cam={cam} />
      <Live cam={cam}><LiftDefs />
        <Readout x={650} y={490} text={String(floor)} up={t >= tWent ? 1 : 0} />
        <Presses id={8} seq={[{ n: 1, re: /^one/i, f: 0.25 }]} t={t} />
        {t < tOne - 0.4 && null}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — her reflection in the steel doors, head slowly turning. */
export const S09: React.FC = () => {
  const { t, p } = useShot();
  const cam: Cam = { zoom: 1.55 + 0.1 * EIO(p), dx: 0, dy: 0, ox: 540, oy: 700 };
  const turn = ramp(t, wordAt(9, /^slowly/i, 0.6), wordAt(9, /^head/i, 0.9, 'end') + 0.3);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="lift/car" cam={cam} />
      <Live cam={cam}><LiftDefs />
        <defs>
          <linearGradient id="lrfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5d6773" stopOpacity="0" /><stop offset="1" stopColor="#5d6773" stopOpacity="0.95" /></linearGradient>
        </defs>
        <clipPath id="lrclip"><rect x="300" y="300" width="696" height="1150" /></clipPath>
        <g clipPath="url(#lrclip)"><g opacity={0.62}><Woman x={560} y={1700} s={1.0} turn={turn} /></g></g>
        {Array.from({ length: 40 }, (_, i) => <rect key={i} x={300 + i * 17.4} y="300" width="2" height="1150" fill="#e9f3ff" opacity={0.05 + (i % 3) * 0.03} />)}
        <rect x="300" y="1080" width="696" height="370" fill="url(#lrfade)" />
        <line x1="648" y1="300" x2="648" y2="1450" stroke="#2b3139" strokeWidth="5" opacity="0.7" />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — hand slams 10, handheld; the doors slide open, light spills in. */
export const S10: React.FC = () => {
  const { t } = useShot();
  const h = handheld(t * 1.6, 2.2);
  const cam: Cam = { zoom: 1.0, dx: -170, dy: -40, tx: h.hx, ty: h.hy, rot: h.hr };
  const tOpen = wordAt(10, /^opened/i, 0.55);
  const open = ramp(t, tOpen - 0.1, tOpen + 0.7);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="lift/panel" cam={cam} />
      <Live cam={cam}><LiftDefs />
        <defs>
          <linearGradient id="lspill" x1="1" x2="0"><stop offset="0" stopColor="#e9f3ff" stopOpacity="0.55" /><stop offset="1" stopColor="#e9f3ff" stopOpacity="0" /></linearGradient>
          <linearGradient id="ldoor" x1="0" x2="1"><stop offset="0" stopColor="#5a636e" /><stop offset="0.5" stopColor="#8e9aa6" /><stop offset="1" stopColor="#5a636e" /></linearGradient>
        </defs>
        <rect x="1060" y="-200" width="700" height="2600" fill="#c9c0b0" />
        <rect x="1060" y="-200" width="700" height="2600" fill="#e9f3ff" opacity="0.6" />
        <rect x={1060 + 640 * open} y="-200" width="700" height="2600" fill="url(#ldoor)" />
        <rect x={1060 + 640 * open} y="-200" width="10" height="2600" fill="#2b3139" />
        <rect x="1036" y="-200" width="24" height="2600" fill="#2b3139" />
        <rect x={1060 - 700 * open} y="-200" width={700 * open} height="2600" fill="url(#lspill)" />
        <Readout x={650} y={490} text="10" />
        <Presses id={10} seq={[{ n: 10, re: /^ten/i, f: 0.25 }]} t={t} />
      </Live>
    </AbsoluteFill>
  );
};
