import React from 'react';
import { AbsoluteFill } from 'remotion';
import * as C from './C';
import * as H from './H';
import * as S from './S';
import * as T from './T';
import * as P from './P';

/** Placeholder for shots that are not drawn yet (keeps the build green while sets are drawn in parallel). */
const Todo: React.FC = () => React.createElement(AbsoluteFill, { style: { backgroundColor: '#1a1a1f' } });
const pick = (m: Record<string, unknown>, name: string) => ((m[name] as React.FC) ?? Todo);

/** shot id -> owner module (see episode.json "owner"). Components are named S01..S25. */
const OWNER: Record<number, Record<string, unknown>> = {
  1: H, 2: H, 3: C, 4: H, 5: H, 6: C, 7: S, 8: T, 9: S, 10: S, 11: P, 12: P, 13: P, 14: S, 15: C, 16: S, 17: P, 18: H, 19: S, 20: S, 21: C, 22: C, 23: C, 24: P, 25: P,
};

/** shot id -> scene (owned by the coordinator). */
export const SCENES: Record<number, React.FC> = Object.fromEntries(
  Object.entries(OWNER).map(([id, m]) => [Number(id), pick(m, `S${String(id).padStart(2, '0')}`)]),
);
