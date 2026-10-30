import { correctAnswerOf } from '../../src/core/content';
import { normalize } from '../../src/core/grading';
import type { Difficulty, ExerciseTemplate } from '../../src/core/content';
import type { Answer, Exercise } from '../../src/core/types';
import { mulberry32 } from '../../src/core/generate';

export const source = 'revisão: Claude+Codex, sem revisão docente';
export const fmt = (n: number) => String(Number(n.toFixed(8))).replace('.', ',');
export const numbers = (s: string) =>
  (s.match(/\d+(?:[.,]\d+)?/gu) ?? []).map((n) => Number(n.replace(',', '.')));
export function random(seed: number) {
  const rng = mulberry32(seed);
  return (min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
}
export function base(
  id: string,
  competencyId: string,
  seed: number,
  difficulty: Difficulty,
  prompt: string,
  hints: string[],
  explanation: string,
  errors: [string, string][],
) {
  return {
    id: `${id}-${difficulty}-${seed}`,
    competencyId,
    difficulty,
    prompt,
    hints,
    explanation,
    review: 'approved' as const,
    commonErrors: errors.map(([match, feedback]) => ({ match, feedback })),
  };
}
export function numericAnswer(ex: Exercise, n: number): Answer {
  const value = String(Number(n.toFixed(8)));
  return ex.kind === 'cloze' ? { kind: 'cloze', value: [value] } : { kind: 'numeric', value };
}
export function template(
  id: string,
  competencyId: string,
  conceptId: string,
  generate: ExerciseTemplate['generate'],
  solve: ExerciseTemplate['solve'],
): ExerciseTemplate {
  return {
    id,
    competencyId,
    conceptId,
    approachId: id,
    difficulties: [1, 2, 3],
    review: 'approved',
    source,
    generate(seed, difficulty) {
      const ex = generate(seed, difficulty);
      if (ex.kind === 'order') return ex;
      const answer = correctAnswerOf(ex).value;
      // Não apresentar uma resposta correta como erro típico quando os parâmetros coincidem.
      const accepted = typeof answer === 'string' ? [answer] : answer;
      return {
        ...ex,
        commonErrors: ex.commonErrors.filter(
          (error) => !accepted.some((value) => normalize(value) === normalize(error.match)),
        ),
      };
    },
    solve,
  };
}
