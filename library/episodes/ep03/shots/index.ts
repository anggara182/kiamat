import React from 'react';
import { S01, S06, S07, S09 } from './V';
import { S03, S08, S12 } from './B';
import { S04, S10, S11 } from './H';
import { S02, S05, S13 } from './G';

/** shot id -> scene (do not edit; owned by the coordinator). */
export const SCENES: Record<number, React.FC> = {
  1: S01, 2: S02, 3: S03, 4: S04, 5: S05, 6: S06, 7: S07, 8: S08, 9: S09, 10: S10, 11: S11, 12: S12, 13: S13,
};
