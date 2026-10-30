import type { GradeResult } from './types';
export interface ScoredAnswer {
  readonly competencyId: string;
  readonly result: GradeResult;
}
/** n é o número de perguntas do teste, incluindo perguntas sem resposta válida.
 * Arredondamento à décima: Math.round(200 * soma dos créditos / n) / 10.
 * Uma resposta inválida vale zero na nota, mas não atualiza tentativas de domínio. */
export function score(answers: readonly ScoredAnswer[]) {
  const credits = (rows: readonly ScoredAnswer[]) =>
    rows.reduce((sum, a) => sum + (a.result.invalid ? 0 : a.result.partial), 0);
  const competencies = [...new Set(answers.map((a) => a.competencyId))].map((id) => {
    const rows = answers.filter((a) => a.competencyId === id);
    return {
      competencyId: id,
      credit: credits(rows) / rows.length,
      status: credits(rows) / rows.length >= 0.8 ? ('dominated' as const) : ('review' as const),
    };
  });
  return {
    grade: answers.length ? Math.round((200 * credits(answers)) / answers.length) / 10 : 0,
    competencies,
    mastered: competencies.filter((c) => c.status === 'dominated').map((c) => c.competencyId),
    toReview: competencies.filter((c) => c.status === 'review').map((c) => c.competencyId),
  };
}
