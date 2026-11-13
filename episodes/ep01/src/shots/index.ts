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

/** shot id -> owner module (see episode.json "owner"). Components are named S01..S21. */
const OWNER: Record<number, Record<string, unknown>> = {
  1: C, 2: H, 3: H, 4: H, 5: S, 6: T, 7: S, 8: S, 9: P, 10: P, 11: S,
  12: C, 13: S, 14: P, 15: H, 16: S, 17: S, 18: C, 19: C, 20: C, 21: P,
};

/** shot id -> scene (owned by the coordinator). */
export const SCENES: Record<number, React.FC> = Object.fromEntries(
  Object.entries(OWNER).map(([id, m]) => [Number(id), pick(m, `S${String(id).padStart(2, '0')}`)]),
);
