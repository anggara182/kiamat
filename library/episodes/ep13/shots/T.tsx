import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { CT } from '../sets/cottage';
import { Comb, Grandpa, Fire, Rain, Hand } from '../art/cottage_figs';

const BG = '#0d0e11';
const GP = { x: 760, y: CT.floor + 20 };
/** camera that puts world point (X,Y) at frame (sx,sy) with zoom z */
const focus = (X: number, Y: number, z: number, sx = 540, sy = 820): Cam => ({ zoom: z, ox: X - 108, oy: Y - 192, dx: sx - (X - 108), dy: sy - (Y - 192) });

const Room: React.FC<{ cam: Cam; t: number; children?: React.ReactNode; table?: boolean; gp?: boolean; nod?: number; face?: 'left' | 'right'; smile?: number }> = ({ cam, t, children, table = true, gp = true, nod = 0, face = 'left', smile = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <BandImg id="cottage/room" cam={cam} />
    <Live cam={cam}><Rain t={t} /><Fire t={t} />{gp && <Grandpa x={GP.x} y={GP.y} nod={nod} face={face} smile={smile} breath={Math.sin(t * 1.4)} />}</Live>
    {table && <BandImg id="cottage/table" cam={cam} />}
    {children}
  </AbsoluteFill>
);

/** shot 5 — close on the comb on the kitchen table, slow push-in. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const cam = focus(560, CT.table, 2.0 + 0.3 * ramp(p, 0, 1, EIO), 470, 1000);
  return <Room cam={cam} t={t} gp={false}><Live cam={cam}><Comb x={560} y={CT.table + 14} s={1.4} /></Live></Room>;
};

/** shot 6 — medium, grandfather by the window, locked. Comb visible on the table. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const cam = focus(560, 1383, 1.3, 540, 820);
  return <Room cam={cam} t={t} nod={ramp(p, 0.6, 0.8)}><Live cam={cam}><Comb x={420} y={CT.table + 14} s={0.8} /></Live></Room>;
};

/** shot 8 — the window, rain on the glass; a long pale hand rises outside toward the comb on the sill. */
export const S08: React.FC = () => {
  const { p, t, sec } = useShot();
  const h0 = Math.min(0.8, wordAt(8, /hand/i, 0.45) / sec);
  const cam = focus(CT.win.x + CT.win.w / 2, 900, 1.85 + 0.12 * p, 540, 820);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="cottage/room" cam={cam} />
      <Live cam={cam}><Hand rise={ramp(p, Math.max(0, h0 - 0.1), Math.min(1, h0 + 0.3), EIO)} press={ramp(p, Math.min(0.95, h0 + 0.3), Math.min(1, h0 + 0.45))} /><Rain t={t} /></Live>
      <Live cam={cam}>
        <rect x={CT.win.x + CT.win.w / 2 - 9} y={CT.win.y} width={18} height={CT.win.h} fill="#15100c" />
        <rect x={CT.win.x} y={CT.win.y + CT.win.h / 2 - 9} width={CT.win.w} height={18} fill="#15100c" />
        <Comb x={CT.win.x + CT.win.w / 2} y={CT.sill + 8} s={0.7} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — the empty windowsill in grey morning light; latch still closed. Locked. */
export const S09: React.FC = () => {
  const { t, p, sec } = useShot();
  const lk = ramp(p, Math.min(0.9, wordAt(9, /locked/i, 0.8) / sec), Math.min(1, wordAt(9, /locked/i, 0.8) / sec + 0.08));
  const cam = focus(CT.win.x + CT.win.w / 2, CT.sill - 120, 2.0, 540, 760);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="cottage/room" cam={cam} />
      <Live cam={cam}>
        <rect x={CT.win.x} y={CT.win.y} width={CT.win.w} height={CT.win.h} fill="#8d99a6" opacity={0.22} />
        <Rain t={t * 0.3} />
        <rect x={CT.win.x + CT.win.w / 2 - 22} y={CT.win.y + CT.win.h / 2 + 14} width={44} height={16} rx={4} fill="#c6ccd3" opacity={0.25 + 0.45 * lk} />
        <path d={`M ${CT.win.x + CT.win.w / 2 + 40} ${CT.sill + 4} C ${CT.win.x + CT.win.w / 2 + 120} ${CT.sill - 2} ${CT.win.x + CT.win.w / 2 + 160} ${CT.sill + 10} ${CT.win.x + CT.win.w / 2 + 230} ${CT.sill + 4}`} stroke="#b8bec6" strokeWidth={1.6} fill="none" opacity={0.8} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — grandfather by the fire, slow pull-back; the fire flares warm. */
export const S10: React.FC = () => {
  const { p, t, sec } = useShot();
  const cam = focus(900, 1200, 1.75 - 0.4 * ramp(p, 0, 1, EIO), 560, 820);
  const sm = ramp(p, Math.min(0.9, wordAt(10, /smiled/i, 0.2) / sec), Math.min(1, wordAt(10, /smiled/i, 0.2) / sec + 0.12));
  return <Room cam={cam} t={t} table={false} nod={0.25 * sm} face="right" smile={sm} />;
};
