import type { Answer, Competency, Exercise, Kind } from './types';
import { grade, normalize } from './grading';
export type ReviewStatus = 'needs-human-review' | 'approved';
export type Difficulty = 1 | 2 | 3;
export interface ExerciseRef {
  packId: string;
  packVersion: string;
  templateId: string;
  seed: number;
  difficulty: Difficulty;
}
export interface ExerciseTemplate {
  id: string;
  competencyId: string;
  conceptId: string;
  approachId: string;
  difficulties: readonly Difficulty[];
  review: ReviewStatus;
  source: string;
  instances?: number;
  generate(seed: number, difficulty: Difficulty): Exercise;
  solve?(ex: Exercise): Answer;
}
export interface ContentPack {
  id: string;
  version: string;
  curriculumVersion: string;
  competencies: readonly Competency[];
  templates: readonly ExerciseTemplate[];
}
export function correctAnswerOf(ex: Exercise): Answer {
  if (ex.kind === 'cloze') return { kind: ex.kind, value: ex.correctAnswers.map((a) => a[0]!) };
  if (ex.kind === 'text') return { kind: ex.kind, value: ex.correctAnswers[0]! };
  if (ex.kind === 'order') return { kind: ex.kind, value: ex.correctAnswer };
  return { kind: ex.kind, value: String(ex.correctAnswer) };
}
export function instantiate(pack: ContentPack, ref: ExerciseRef): Exercise {
  if (ref.packId !== pack.id || ref.packVersion !== pack.version) throw new Error('Pacote ou versão ausente');
  const t = pack.templates.find((t) => t.id === ref.templateId);
  if (
    !t ||
    !t.difficulties.includes(ref.difficulty) ||
    !Number.isInteger(ref.seed) ||
    ref.seed < 0 ||
    ref.seed > 0xffffffff
  )
    throw new Error('Referência inválida');
  const ex = t.generate(ref.seed, ref.difficulty);
  if (ex.competencyId !== t.competencyId || ex.difficulty !== ref.difficulty)
    throw new Error('Metadados incompatíveis');
  return { ...ex, review: t.review, ref: { ...ref }, conceptId: t.conceptId, approachId: t.approachId };
}
export function materialize(
  pack: ContentPack,
  options: {
    competencyIds: readonly string[];
    rng: () => number;
    perTemplate: number;
    difficultyFor: (t: ExerciseTemplate) => Difficulty;
  },
): Exercise[] {
  if (!Number.isSafeInteger(options.perTemplate) || options.perTemplate < 0)
    throw new Error('Quantidade inválida');
  return pack.templates
    .filter((t) => t.review === 'approved' && options.competencyIds.includes(t.competencyId))
    .flatMap((t) =>
      Array.from({ length: t.instances ?? options.perTemplate }, () =>
        instantiate(pack, {
          packId: pack.id,
          packVersion: pack.version,
          templateId: t.id,
          seed: Math.floor(options.rng() * 4294967296),
          difficulty: options.difficultyFor(t),
        }),
      ),
    );
}
export function validatePack(pack: ContentPack, seeds: readonly number[] = [0, 1, 42, 0xffffffff]): string[] {
  const errors: string[] = [];
  const unique = (ids: readonly string[], label: string) => {
    if (ids.some((id) => !id.trim()) || new Set(ids).size !== ids.length) errors.push(label);
  };
  unique(
    pack.competencies.map((c) => c.id),
    'Competências duplicadas/vazias',
  );
  unique(
    pack.templates.map((t) => t.id),
    'Templates duplicados/vazios',
  );
  if (!pack.id.trim() || !pack.version.trim() || !pack.curriculumVersion.trim())
    errors.push('Versão/pacote vazio');
  for (const c of pack.competencies)
    if (c.prerequisites.some((p) => !pack.competencies.some((c) => c.id === p)))
      errors.push(`Pré-requisito: ${c.id}`);
  for (const t of pack.templates) {
    if (
      !pack.competencies.some((c) => c.id === t.competencyId) ||
      !t.conceptId ||
      !t.approachId ||
      !t.source ||
      !['approved', 'needs-human-review'].includes(t.review) ||
      !t.difficulties.length ||
      new Set(t.difficulties).size !== t.difficulties.length ||
      t.difficulties.some((d) => ![1, 2, 3].includes(d))
    )
      errors.push(`Template: ${t.id}`);
    for (const difficulty of t.difficulties)
      for (const seed of seeds)
        try {
          const ex = instantiate(pack, {
            packId: pack.id,
            packVersion: pack.version,
            templateId: t.id,
            seed,
            difficulty,
          });
          const key = correctAnswerOf(ex);
          const result = grade(ex, key);
          if (result.invalid || !result.correct) throw new Error('Chave inválida');
          if (
            ex.kind === 'mcq' &&
            (new Set(ex.options.map((o) => normalize(o))).size !== ex.options.length ||
              !ex.options.includes(ex.correctAnswer))
          )
            throw new Error('Opções inválidas');
          if (t.solve) {
            const answer = t.solve(ex);
            const solved = grade(ex, answer);
            if (solved.invalid || !solved.correct || JSON.stringify(answer) !== JSON.stringify(key))
              throw new Error('Solver diverge da chave');
          }
        } catch (e) {
          errors.push(`${t.id}/${difficulty}/${seed}: ${String(e)}`);
        }
  }
  return errors;
}
export function matrix(pack: ContentPack) {
  return pack.competencies.map((c) => {
    const rows = pack.templates
      .filter((t) => t.competencyId === c.id)
      .flatMap((t) =>
        t.difficulties.map((d) => ({
          conceptId: t.conceptId,
          approachId: t.approachId,
          difficulty: d,
          format: instantiate(pack, {
            packId: pack.id,
            packVersion: pack.version,
            templateId: t.id,
            seed: 0,
            difficulty: d,
          }).kind,
          review: t.review,
        })),
      );
    const formats: readonly Kind[] = ['mcq', 'numeric', 'text', 'order', 'cloze'];
    const families = [
      ...new Map(
        rows.map((r) => [
          JSON.stringify([r.conceptId, r.approachId]),
          { conceptId: r.conceptId, approachId: r.approachId },
        ]),
      ).values(),
    ];
    const missingCombinations = families.flatMap((f) =>
      ([1, 2, 3] as const).flatMap((difficulty) =>
        formats
          .filter(
            (format) =>
              !rows.some(
                (r) =>
                  r.conceptId === f.conceptId &&
                  r.approachId === f.approachId &&
                  r.difficulty === difficulty &&
                  r.format === format &&
                  r.review === 'approved',
              ),
          )
          .map((format) => ({ ...f, difficulty, format })),
      ),
    );
    return {
      competencyId: c.id,
      rows,
      gaps: ([1, 2, 3] as const).filter(
        (d) => !rows.some((r) => r.difficulty === d && r.review === 'approved'),
      ),
      missingCombinations,
    };
  });
}
