import type { Answer, Exercise, GradeResult } from './types';
export function normalize(value: string, ignoreAccents = false): string {
  const text = value.normalize('NFC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('pt-PT');
  return ignoreAccents ? text.normalize('NFD').replace(/\p{M}/gu, '') : text;
}
/** Identidade de um exercício para evitar repetições: enunciado + estímulo + opções/itens (sem ordem). Perguntas com o mesmo enunciado e opções diferentes são exercícios diferentes. */
export function exerciseSignature(ex: Pick<Exercise, 'prompt' | 'stimulus'> & { readonly options?: readonly string[]; readonly items?: readonly string[] }): string {
  const base = normalize(ex.prompt) + (ex.stimulus ? `|${normalize(ex.stimulus)}` : '');
  const choices = [...(ex.options ?? ex.items ?? [])].map((s) => normalize(s)).sort();
  return choices.length ? `${base}|${choices.join('|')}` : base;
}
function numeric(raw: string, units: readonly string[]): number | undefined {
  let text = raw.trim();
  const unit = [...units].sort((a, b) => b.length - a.length).find((u) => u.length > 0 && text.endsWith(u));
  if (unit) text = text.slice(0, -unit.length).trim();
  text = text.replace(/\s/gu, '');
  const number = '[+-]?(?:\\d+(?:[.,]\\d+)?|[.,]\\d+)';
  if (!new RegExp(`^${number}(?:/${number})?$`, 'u').test(text)) return undefined;
  const parts = text.replace(/,/gu, '.').split('/').map(Number);
  const result = parts.length === 2 ? parts[0]! / parts[1]! : parts[0]!;
  return Number.isFinite(result) ? result : undefined;
}
export function grade(ex: Exercise, answer: Answer): GradeResult {
  if (answer.kind !== ex.kind) return { invalid: true };
  let partial: number;
  if (ex.kind === 'order' || ex.kind === 'cloze') {
    if (
      !Array.isArray(answer.value) ||
      answer.value.length !== (ex.kind === 'order' ? ex.correctAnswer.length : ex.correctAnswers.length) ||
      answer.value.some((v) => typeof v !== 'string' || !v.trim())
    )
      return { invalid: true };
    const values = answer.value as readonly string[];
    if (
      ex.kind === 'order' &&
      (new Set(values).size !== values.length || values.some((v) => !ex.items.includes(v)))
    )
      return { invalid: true };
    partial =
      values.filter((v, i) =>
        ex.kind === 'order'
          ? v === ex.correctAnswer[i]
          : ex.correctAnswers[i]!.some(
              (a) => normalize(a, ex.ignoreAccents) === normalize(v, ex.ignoreAccents),
            ),
      ).length / values.length;
  } else {
    if (typeof answer.value !== 'string' || !answer.value.trim()) return { invalid: true };
    if (ex.kind === 'numeric') {
      const value = numeric(answer.value, ex.units ?? []);
      if (value === undefined) return { invalid: true };
      partial =
        Math.abs(value - ex.correctAnswer) <=
        (ex.tolerance ?? 0) + Number.EPSILON * Math.max(1, Math.abs(value), Math.abs(ex.correctAnswer)) * 4
          ? 1
          : 0;
    } else if (ex.kind === 'mcq') {
      if (!ex.options.includes(answer.value)) return { invalid: true };
      partial = Number(answer.value === ex.correctAnswer);
    } else
      partial = Number(
        ex.correctAnswers.some(
          (a) => normalize(a, ex.ignoreAccents) === normalize(answer.value as string, ex.ignoreAccents),
        ),
      );
  }
  if (!Number.isFinite(partial)) return { invalid: true };
  const error =
    typeof answer.value === 'string'
      ? ex.commonErrors.find((e) => normalize(e.match) === normalize(answer.value as string))
      : undefined;
  return {
    correct: partial === 1,
    partial,
    feedback: partial === 1 ? 'Correto!' : (error?.feedback ?? ex.explanation),
  };
}
