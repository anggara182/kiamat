import React from 'react';
import { AbsoluteFill } from 'remotion';
import * as C from './C';
import * as H from './H';
import * as S from './S';
import * as P from './P';

/** Placeholder for shots that are not drawn yet (keeps the build green while sets are drawn in parallel). */
const Todo: React.FC = () => React.createElement(AbsoluteFill, { style: { backgroundColor: '#1a1a1f' } });
const pick = (m: Record<string, unknown>, name: string) => ((m[name] as React.FC) ?? Todo);

/** shot id -> owner module (episode.json "owner"). Components are named S01..S25. */
const OWNER: Record<number, Record<string, unknown>> = {
  1: C, 2: C, 3: P, 4: P, 5: P, 6: S, 7: S, 8: H, 9: H, 10: C, 11: P, 12: P, 13: S, 14: H, 15: S, 16: S, 17: S, 18: S, 19: C, 20: C, 21: C, 22: C, 23: H, 24: P,
};

/** shot id -> scene (owned by the coordinator). */
export const SCENES: Record<number, React.FC> = Object.fromEntries(
  Object.entries(OWNER).map(([id, mod]) => [Number(id), pick(mod, `S${String(id).padStart(2, '0')}`)]),
);
