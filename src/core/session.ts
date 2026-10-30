import type { Seen } from './save';
import type { Exercise } from './types';
import type { MasteryState } from './mastery';
import { dueCompetencies } from './review';
import { normalize } from './grading';
export function seededRng(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(1664525, value) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}
export interface SessionOptions {
  readonly mode: 'study' | 'test' | 'review';
  readonly pool: readonly Exercise[];
  readonly competencyIds: readonly string[];
  readonly n: number;
  readonly state: MasteryState;
  readonly rng: () => number;
  readonly now: number;
  readonly history?: readonly Seen[];
}
export function buildSession(options: SessionOptions) {
  const { mode, pool, state, rng, now } = options;
  const n = Number.isFinite(options.n) ? Math.max(0, Math.floor(options.n)) : 0;
  const ids =
    mode === 'review'
      ? dueCompetencies(state, now, options.competencyIds)
      : [...new Set(options.competencyIds)];
  let relaxed = 0;
  const selected: Exercise[] = [];
  const usedIds = new Set<string>();
  const signatures = new Set<string>();
  const signatureOf = new Map(pool.map((ex) => [ex, normalize(ex.prompt)]));
  const candidates = pool
    .filter((e) => e.review !== 'needs-human-review' && ids.includes(e.competencyId))
    .map((ex) => ({ ex, random: rng() }));
  while (selected.length < n) {
    const available = candidates.filter(
      ({ ex }) => !usedIds.has(ex.id) && !signatures.has(signatureOf.get(ex)!),
    );
    if (!available.length) break;
    const recent = [
      ...(options.history ?? []).slice(-20).map((h) => ({
        signature: h.signature,
        concept: h.conceptId,
        approach: h.approachId,
        format: h.format,
        competency: h.competencyId,
      })),
      ...selected.map((e) => ({
        signature: normalize(e.prompt),
        concept: e.conceptId,
        approach: e.approachId,
        format: e.kind,
        competency: e.competencyId,
      })),
    ];
    const recentSignatures = new Set(recent.slice(-20).map((h) => h.signature));
    const recentConcepts = recent.slice(-3);
    const penalty = (ex: Exercise) =>
      options.history === undefined
        ? 0
        : Number(recentSignatures.has(signatureOf.get(ex)!)) * 12 +
          recentConcepts.filter(
            (h) => h.competency === ex.competencyId && h.concept !== undefined && h.concept === ex.conceptId,
          ).length *
            4 +
          Number(ex.approachId !== undefined && recent.at(-1)?.approach === ex.approachId) * 3 +
          Number(recent.at(-1)?.format === ex.kind) * 3;
    const rank = (ex: Exercise): number => {
      const m = state[ex.competencyId];
      const target =
        !m || m.attempts < 3
          ? 1
          : m.recent.slice(-2).length === 2 && m.recent.slice(-2).every((v) => !v)
            ? 1
            : m.streak >= 3
              ? 3
              : 2;
      const count = selected.filter((e) => e.competencyId === ex.competencyId).length;
      return (
        penalty(ex) +
        Math.abs(ex.difficulty - target) * 10 +
        count * 4 +
        Number(selected.some((e) => e.kind === ex.kind)) * 2 +
        (mode === 'review' ? ids.indexOf(ex.competencyId) : 0)
      );
    };
    const ranked = available.map((candidate) => ({ ...candidate, rank: rank(candidate.ex) }));
    ranked.sort((a, b) => a.rank - b.rank || a.random - b.random);
    const ex = ranked[0]!.ex;
    if (penalty(ex) > 0) relaxed++;
    selected.push(mode === 'test' ? { ...ex, hints: [] } : ex);
    usedIds.add(ex.id);
    signatures.add(normalize(ex.prompt));
  }
  return {
    relaxed,
    exercises: selected as readonly Exercise[],
    exhausted: selected.length < n,
    hintsEnabled: mode !== 'test',
  };
}
