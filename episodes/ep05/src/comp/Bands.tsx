import React from 'react';
import { AbsoluteFill } from 'remotion';
import { W, H } from '../art/world';
import { LIBRARY } from '../sets/library';
import { HILL } from '../sets/hill';
import { VILLAGE } from '../sets/village';
import { HARVEST } from '../sets/harvest';

/**
 * A static depth band: rendered ONCE to public/baked/<set>/<band>.png by scripts/bake.mjs,
 * with its blur applied to the merged band (never per element, never per frame).
 * w/h default to the world size; viewBox lets one piece of art be baked at a tighter crop
 * (e.g. telephoto or insert) at full resolution.
 */
export type BandSpec = { blur?: number; w?: number; h?: number; viewBox?: string; node: () => React.ReactNode };

export const BANDS: Record<string, BandSpec> = { ...LIBRARY, ...HILL, ...VILLAGE, ...HARVEST };
export type BandId = string;
export const bandCompId = (id: string) => `Band-${id.replace(/\//g, '-')}`;

export const BandComp: React.FC<{ band: BandId }> = ({ band }) => {
  const b = BANDS[band];
  const w = b.w ?? W, h = b.h ?? H;
  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <div style={{ width: w, height: h, filter: b.blur ? `blur(${b.blur}px)` : undefined }}>
        <svg width={w} height={h} viewBox={b.viewBox ?? `0 0 ${w} ${h}`}>{b.node()}</svg>
      </div>
    </AbsoluteFill>
  );
};
