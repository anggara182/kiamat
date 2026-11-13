import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Fr } from '../art/market_kit';
import { ShopBand } from '../art/market_shop';
import { FrontBand } from '../art/market_front';
import { StallBand, STALL_DAWN, STALL_DUSK } from '../art/market_stall';

/**
 * Set "market" (shots 1, 2, 3, 8, 23). Static bands baked ONCE to public/baked/market/<band>.png. Art in FRAME coords via translate(108 192).
 *  shop       = shop interior back room, neutral day light (1 = dawn mood live, 8 = day); front shelf, goods and people are live
 *  front      = the shop front at dawn with the door opening (rolling door + queue live)
 *  stall-dawn = breakfast stall front view at dawn (3)
 *  stall-dusk = the same stall at dusk (23), calm dark upper area for the quote
 */
export const MARKET: Record<string, BandSpec> = {
  'market/shop': { node: () => <Fr><ShopBand /></Fr> },
  'market/front': { node: () => <Fr><FrontBand /></Fr> },
  'market/stall-dawn': { node: () => <Fr><StallBand pal={STALL_DAWN} /></Fr> },
  'market/stall-dusk': { node: () => <Fr><StallBand pal={STALL_DUSK} /></Fr> },
};
