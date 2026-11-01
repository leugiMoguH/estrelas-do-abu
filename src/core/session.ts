import type { Seen } from './save';
import type { Exercise } from './types';
import type { MasteryState } from './mastery';
import { dueCompetencies } from './review';
import { exerciseSignature } from './grading';
import { skillDue, skillStatus, skillTarget, type SkillsState } from './skills';
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
  readonly groupOf?: (ex: Exercise) => string;
}
export function buildSession(options: SessionOptions) {
  const { mode, pool, state, rng, now } = options;
  const recentWindow = options.recentWindow ?? 20;
  const repeatPenalty = options.repeatPenalty ?? 12;
  const groupOf = options.groupOf ?? ((e: Exercise) => e.competencyId);
  const n = Number.isFinite(options.n) ? Math.max(0, Math.floor(options.n)) : 0;
  const ids =
    mode === 'review'
      ? dueCompetencies(state, now, options.competencyIds)
      : [...new Set(options.competencyIds)];
  let relaxed = 0;
  const selected: Exercise[] = [];
  const usedIds = new Set<string>();
  const signatures = new Set<string>();
  const signatureOf = new Map(pool.map((ex) => [ex, exerciseSignature(ex)]));
  const candidates = pool
    .filter((e) => e.review !== 'needs-human-review' && ids.includes(e.competencyId))
    .map((ex) => ({ ex, random: rng() }));
  while (selected.length < n) {
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
    const recentConcepts = recent.slice(-3);
    const penalty = (ex: Exercise) =>
      options.history === undefined
        ? 0
        : Number(recentSignatures.has(signatureOf.get(ex)!)) * repeatPenalty +
          recentConcepts.filter(
            (h) => h.competency === ex.competencyId && h.concept !== undefined && h.concept === ex.conceptId,
          ).length *
            4 +
          Number(ex.approachId !== undefined && recent.at(-1)?.approach === ex.approachId) * 3 +
          Number(recent.at(-1)?.format === ex.kind) * 3;
    const rank = (ex: Exercise): number => {
      const m = state[ex.competencyId];
      const topicTarget =
        !m || m.attempts < 3
          ? 1
          : m.recent.slice(-2).length === 2 && m.recent.slice(-2).every((v) => !v)
            ? 1
            : m.streak >= 3
              ? 3
              : 2;
      const sk = ex.skillId ? options.skills?.[ex.skillId] : undefined;
      const target = sk ? skillTarget(options.skills, ex.skillId, topicTarget) : topicTarget;
      // reforço: conhecimento falhado (exercício diferente), dificuldade persistente e revisão espaçada da competência
      const support =
        (sk?.weak.some((w) => w.concept === ex.conceptId) ? -8 : 0) +
        (skillStatus(sk) === 'persistente' ? -4 : 0) +
        (skillDue(sk, now) ? (mode === 'review' ? -6 : -2) : 0);
      const count = selected.filter((e) => groupOf(e) === groupOf(ex)).length;
      return (
        penalty(ex) +
        Math.abs(ex.difficulty - target) * 10 +
        count * 4 +
        Number(selected.some((e) => e.kind === ex.kind)) * 2 +
        support +
        (mode === 'review' ? ids.indexOf(ex.competencyId) : 0)
      );
    };
    const ranked = available.map((candidate) => ({ ...candidate, rank: rank(candidate.ex) }));
    ranked.sort((a, b) => a.rank - b.rank || a.random - b.random);
    const ex = ranked[0]!.ex;
    if (penalty(ex) > 0) relaxed++;
    selected.push(mode === 'test' ? { ...ex, hints: [] } : ex);
    usedIds.add(ex.id);
    signatures.add(exerciseSignature(ex));
  }
  return {
    relaxed,
    exercises: selected as readonly Exercise[],
    exhausted: selected.length < n,
    hintsEnabled: mode !== 'test',
  };
}
