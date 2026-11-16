import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Goldfield, NightBand, BokehBand } from '../art/goldfield_art';

/** Set "goldfield": the raw gold mountain in the dry riverbed at night (with the sea of lamps), by day, at dawn, and a bokeh backdrop for the face. */
export const GOLDFIELD: Record<string, BandSpec> = {
  'goldfield/night': { node: () => <NightBand /> },
  'goldfield/day': { node: () => <Goldfield m="day" /> },
  'goldfield/dawn': { node: () => <Goldfield m="dawn" /> },
  'goldfield/bokeh': { blur: 12, node: () => <BokehBand /> },
};
