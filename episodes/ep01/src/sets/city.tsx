import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { CityBand } from '../art/city_skyline';

/**
 * Set "city": one skyline (far towers + crane, mosque minaret and dome, mid-rise blocks) baked once per mood.
 * Sky, near kampung rooftops, utility pole and all lights are live layers (src/art/city_skyline.tsx).
 * Static bands baked ONCE to public/baked/city/<band>.png. Ids "city/<band>".
 */
export const CITY: Record<string, BandSpec> = {
  'city/dawn': { node: () => <CityBand m="dawn" /> },
  'city/dusk': { node: () => <CityBand m="dusk" /> },
  'city/night': { node: () => <CityBand m="night" /> },
};
