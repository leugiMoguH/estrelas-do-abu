import type { Seen } from './save';
import type { Exercise } from './types';
import type { MasteryState } from './mastery';
import { dueCompetencies } from './review';
import { exerciseSignature } from './grading';
import { skillDue, skillStatus, type SkillsState } from './skills';
import { instantiate, type ContentPack, type ExerciseRef } from './content';

/** Exact error refs precede variants regardless of repetition penalties. */
export function reconstructErrors(pack: ContentPack, refs: readonly ExerciseRef[]): { exercises: Exercise[]; unavailable: number } {
  const exercises: Exercise[] = [];
  let unavailable = 0;
  for (const ref of refs) {
    try {
      if (!pack.templates.some(t => t.id === ref.templateId && t.review === 'approved')) throw new Error();
      exercises.push(instantiate(pack, ref));
    } catch { unavailable++; }
  }
  return { exercises, unavailable };
}
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
  /** Agrupa exercícios (ex.: subcapítulo) para os distribuir; por omissão, por competência. */
  /** Progressão por competência (opcional): define a exigência alvo e reforça competências/conhecimentos fracos. */
  readonly skills?: SkillsState;
  /** Quantas perguntas recentes penalizar como repetição (por omissão, 20). */
  readonly recentWindow?: number;
  /** Custo de repetir uma pergunta recente (por omissão, 12). */
  readonly repeatPenalty?: number;
  readonly selected?: readonly Exercise[];
  /** Review eligibility is fixed at session start; difficulty evidence stays live. */
  readonly reviewIds?: readonly string[];
  readonly groupOf?: (ex: Exercise) => string;
}
export function buildSession(options: SessionOptions) {
  const { mode, pool, state, rng, now } = options;
  const recentWindow = options.recentWindow ?? 20;
  const repeatPenalty = options.repeatPenalty ?? 12;
  const groupOf = options.groupOf ?? ((e: Exercise) => e.competencyId);
  const n = Number.isFinite(options.n) ? Math.max(0, Math.floor(options.n)) : 0;
  const topicDue = dueCompetencies(state, now, options.competencyIds);
  const ids =
    mode === 'review'
      ? [...(options.reviewIds ?? new Set([...topicDue, ...options.competencyIds.filter(id => pool.some(e => e.competencyId === id && skillDue(options.skills?.[e.skillId ?? e.competencyId], now)))]))]
      : [...new Set(options.competencyIds)];
  let relaxed = 0;
  const selected: Exercise[] = [...(options.selected ?? [])];
  const initialCount = selected.length;
  const usedIds = new Set<string>(selected.map(e => e.id));
  const signatures = new Set<string>(selected.map(exerciseSignature));
  const signatureOf = new Map(pool.map((ex) => [ex, exerciseSignature(ex)]));
  const candidates = pool
    .filter((e) => e.review !== 'needs-human-review' && ids.includes(e.competencyId))
    .map((ex) => ({ ex, random: rng() }));
  while (selected.length < n + initialCount) {
    const available = candidates.filter(
      ({ ex }) => !usedIds.has(ex.id) && !signatures.has(signatureOf.get(ex)!),
    );
    if (!available.length) break;
    const recent = [
      ...(options.history ?? []).slice(-recentWindow).map((h) => ({
        signature: h.signature,
        concept: h.conceptId,
        approach: h.approachId,
        format: h.format,
        competency: h.competencyId,
      })),
      ...selected.map((e) => ({
        signature: exerciseSignature(e),
        concept: e.conceptId,
        approach: e.approachId,
        format: e.kind,
        competency: e.competencyId,
      })),
    ];
    const recentSignatures = new Set(recent.map((h) => h.signature));
    // Históricos WIP tinham um sufixo de opções; conservam-se legíveis sem reescrever o Save.
    const seenSignature = (signature: string): boolean => recentSignatures.has(signature) ||
      (!signature.includes('|variant:') && [...recentSignatures].some(old => !old.includes('|variant:') && old.startsWith(`${signature}|`)));
    const recentConcepts = recent.slice(-3);
    const penalty = (ex: Exercise) =>
      options.history === undefined
        ? 0
        : Number(seenSignature(signatureOf.get(ex)!)) * repeatPenalty +
          recentConcepts.filter(
            (h) => h.competency === ex.competencyId && h.concept !== undefined && h.concept === ex.conceptId,
          ).length *
            4 +
          Number(ex.approachId !== undefined && recent.at(-1)?.approach === ex.approachId) * 3 +
          Number(recent.at(-1)?.format === ex.kind) * 3;
    const rank = (ex: Exercise): number => {
      const sk = options.skills?.[ex.skillId ?? ex.competencyId];
      const support =
        (sk?.weak.some((w) => w.concept === ex.conceptId) ? -8 : 0) +
        (skillStatus(sk) === 'persistente' ? -4 : 0) +
        (skillDue(sk, now) ? (mode === 'review' ? -6 : -2) : 0);
      const count = selected.filter((e) => groupOf(e) === groupOf(ex)).length;
      return (
        penalty(ex) +
        // Entre competências, preferir exercícios mais próximos do nível de cada uma (como antes do B2).
        (options.skills === undefined ? Math.abs(ex.difficulty - 1) * 10 : distance(ex) * 10) +
        count * 4 +
        Number(selected.some((e) => e.kind === ex.kind)) * 2 +
        support +
        (mode === 'review' ? ids.indexOf(ex.competencyId) : 0)
      );
    };
    const distance = (ex: Exercise): number => Math.abs(ex.difficulty - (options.skills?.[ex.skillId ?? ex.competencyId]?.level ?? 1));
    const groupCount = (ex: Exercise): number => selected.filter(e => groupOf(e) === groupOf(ex)).length;
    const minimum = Math.min(...available.map(({ex}) => groupCount(ex)));
    const balanced = options.groupOf && options.skills !== undefined ? available.filter(({ex}) => groupCount(ex) === minimum) : available;
    const targetKey = (ex: Exercise): string => JSON.stringify([groupOf(ex), ex.skillId ?? ex.competencyId]);
    const nearest = new Map<string, number>();
    for (const {ex} of balanced) {
      const key = targetKey(ex);
      nearest.set(key, Math.min(nearest.get(key) ?? Infinity, distance(ex)));
    }
    // Legacy callers without Skills keep their bank rotation; the app always supplies Skills.
    const eligible = options.skills === undefined ? available : balanced.filter(({ex}) => distance(ex) === nearest.get(targetKey(ex)));
    const ranked = eligible.map((candidate) => ({ ...candidate, rank: rank(candidate.ex) }));
    ranked.sort((a, b) => a.rank - b.rank || a.random - b.random);
    const ex = ranked[0]!.ex;
    if (penalty(ex) > 0) relaxed++;
    selected.push(mode === 'test' ? { ...ex, hints: [] } : ex);
    usedIds.add(ex.id);
    signatures.add(exerciseSignature(ex));
  }
  return {
    relaxed,
    exercises: selected.slice(initialCount) as readonly Exercise[],
    exhausted: selected.length < n + initialCount,
    hintsEnabled: mode !== 'test',
  };
}
