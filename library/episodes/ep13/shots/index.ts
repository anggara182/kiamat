import React from 'react';
import { S01, S04, S07, S11, S12 } from './R';
import { S05, S06, S08, S09, S10 } from './T';
import { S02, S03, S13 } from './G';

/** shot id -> scene (owned by the coordinator). */
export const SCENES: Record<number, React.FC> = {
  1: S01, 2: S02, 3: S03, 4: S04, 5: S05, 6: S06, 7: S07, 8: S08, 9: S09, 10: S10, 11: S11, 12: S12, 13: S13,
};
