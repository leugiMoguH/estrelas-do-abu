import type { GradeResult } from './types';
export type Level = 'discovering' | 'practising' | 'progressing' | 'consolidated' | 'review';
export interface Mastery {
  readonly attempts: number;
  readonly correct: number;
  readonly hintsUsed: number;
  readonly lastSeen: number;
  readonly streak: number;
  readonly level: Level;
  readonly recent: readonly boolean[];
  readonly recentHints: readonly number[];
  readonly reviewStep: number;
}
export type MasteryState = Readonly<Record<string, Mastery>>;
export const emptyMastery = (): Mastery => ({
  attempts: 0,
  correct: 0,
  hintsUsed: 0,
  lastSeen: 0,
  streak: 0,
  level: 'discovering',
  recent: [],
  recentHints: [],
  reviewStep: 0,
});
/** Últimas 5 tentativas; consolidar exige 80% e no máximo uma pista por tentativa
 * em média. Pistas nunca retiram acertos, crédito ou níveis já alcançados. */
export function updateMastery(
  previous: Mastery,
  result: GradeResult,
  hintsUsed: number,
  now: number,
): Mastery {
  if (result.invalid) return previous;
  if (!Number.isFinite(now) || now < 0 || !Number.isInteger(hintsUsed) || hintsUsed < 0)
    throw new Error('Tentativa inválida');
  const recent = [...previous.recent, result.correct].slice(-5);
  const recentHints = [...previous.recentHints, hintsUsed].slice(-5);
  const attempts = previous.attempts + 1;
  const rate = recent.filter(Boolean).length / recent.length;
  const levels: Level[] = ['discovering', 'practising', 'progressing', 'consolidated'];
  let index = attempts < 3 ? 0 : rate >= 0.8 ? 2 : 1;
  if (attempts >= 5 && rate >= 0.8 && recentHints.reduce((a, b) => a + b, 0) <= recentHints.length) index = 3;
  const oldIndex = previous.level === 'review' ? 3 : levels.indexOf(previous.level);
  if (!result.correct) index = Math.max(index, oldIndex - 1);
  else index = Math.max(index, oldIndex);
  return {
    attempts,
    correct: previous.correct + Number(result.correct),
    hintsUsed: previous.hintsUsed + hintsUsed,
    lastSeen: now,
    streak: result.correct ? previous.streak + 1 : 0,
    level: levels[index]!,
    recent,
    recentHints,
    reviewStep: result.correct ? Math.min(3, previous.reviewStep + Number(previous.attempts > 0)) : 0,
  };
}
