import { describe, expect, it } from 'vitest';
import { demoPack, difficultyCriteria } from '../../content/demo';
import {
  correctAnswerOf,
  instantiate,
  materialize,
  matrix,
  validatePack,
  type ContentPack,
} from '../../src/core/content';
import { mulberry32 } from '../../src/core/generate';
import { grade } from '../../src/core/grading';
import { buildSession } from '../../src/core/session';
import { defaultSave, migrate, recordAttempt } from '../../src/core/save';
import { emptyMastery, updateMastery } from '../../src/core/mastery';
import type { Exercise } from '../../src/core/types';
const ref = (templateId = 'unitario', seed = 42, difficulty: 1 | 2 | 3 = 1) => ({
  packId: 'demo',
  packVersion: '1.0.0',
  templateId,
  seed,
  difficulty,
});
describe('conteúdo parametrizado', () => {
  it('verifica 200 seeds por template e dificuldade, incluindo solver independente', () => {
    expect(
      validatePack(
        demoPack,
        Array.from({ length: 200 }, (_, i) => i),
      ),
    ).toEqual([]);
  });
  it('regenera referências, distingue exemplos e mede os critérios de dificuldade', () => {
    for (const t of demoPack.templates.filter((t) => t.review === 'approved')) {
      const examples = [0, 1, 2].map((seed) => instantiate(demoPack, ref(t.id, seed)));
      expect(new Set(examples.map((e) => e.prompt)).size).toBe(3);
      for (const ex of examples) expect(instantiate(demoPack, ex.ref!)).toEqual(ex);
      const easy = instantiate(demoPack, ref(t.id, 42, 1)),
        hard = instantiate(demoPack, ref(t.id, 42, 3));
      expect(easy.prompt).not.toBe(hard.prompt);
      if (t.id === 'escala') {
        expect(easy.prompt).toContain('em centímetros');
        expect(hard.prompt).toContain('em quilómetros');
      } else if (t.id === 'precos') expect(hard.prompt).toContain('meio quilograma');
      else expect(hard.prompt).toContain('desconto');
      if (t.id === 'inverso' && hard.kind === 'cloze')
        expect(Number.isInteger(Number(hard.correctAnswers[0]![0]))).toBe(true);
      if (t.id !== 'escala')
        expect(
          Array.from({ length: 20 }, (_, seed) => instantiate(demoPack, ref(t.id, seed, 3)).prompt).some(
            (p) => /\d,\d/u.test(p),
          ),
        ).toBe(true);
      const criteria = difficultyCriteria[t.id as keyof typeof difficultyCriteria];
      expect(criteria[2].steps).toBeGreaterThan(criteria[0].steps);
      // Corromper a chave não altera o solver: este lê apenas o enunciado.
      const corrupted: Exercise =
        easy.kind === 'numeric'
          ? { ...easy, correctAnswer: -999 }
          : easy.kind === 'mcq'
            ? { ...easy, correctAnswer: 'errado' }
            : easy.kind === 'cloze'
              ? { ...easy, correctAnswers: [['errado']] }
              : easy;
      expect(t.solve!(corrupted)).toEqual(correctAnswerOf(easy));
      expect(grade(easy, t.solve!(easy))).toMatchObject({ correct: true });
    }
    expect(matrix(demoPack)[0]!.gaps).toEqual([]);
  });
  it('PRNG é estável e valida limites', () => {
    expect(Array.from({ length: 3 }, mulberry32(42))).toEqual(Array.from({ length: 3 }, mulberry32(42)));
    const rng = mulberry32(42);
    expect(rng()).toBe(0.6011037519201636);
    for (const seed of [-1, 1.5, 4294967296, NaN]) expect(() => mulberry32(seed)).toThrow();
    expect(() => instantiate(demoPack, { ...ref(), packVersion: 'futura' })).toThrow();
  });
  it('exclui o texto não revisto e aceita competência de outro ano sem alterar o núcleo', () => {
    const options = {
      competencyIds: demoPack.competencies.map((c) => c.id),
      rng: mulberry32(1),
      perTemplate: 3,
      difficultyFor: () => 1 as const,
    };
    const pool = [...materialize(demoPack, options), instantiate(demoPack, ref('pt-texto'))];
    const session = buildSession({
      pool,
      competencyIds: options.competencyIds,
      n: 100,
      mode: 'study',
      state: {},
      rng: mulberry32(2),
      now: 0,
      history: [],
    });
    expect(session.exercises.every((e) => e.competencyId !== 'pt6-leitura')).toBe(true);
    expect(instantiate(demoPack, ref('pt-texto')).stimulus).toContain('Leonor');
    const competency = {
      ...demoPack.competencies[0]!,
      id: 'cn8',
      subject: 'Ciências Naturais',
      grade: 8,
      prerequisites: [],
    };
    const pack: ContentPack = {
      ...demoPack,
      competencies: [...demoPack.competencies, competency],
      templates: [
        ...demoPack.templates,
        {
          id: 'cn8-contar',
          competencyId: 'cn8',
          conceptId: 'observacao',
          approachId: 'contagem',
          source: 'Original CC0',
          review: 'approved',
          difficulties: [1],
          generate(seed, difficulty) {
            return {
              id: `cn-${seed}`,
              competencyId: 'cn8',
              difficulty,
              prompt: `Uma amostra tem ${(seed % 10) + 1} células. Quantas células observas?`,
              hints: [],
              explanation: 'Conta as células indicadas.',
              commonErrors: [],
              kind: 'numeric',
              correctAnswer: (seed % 10) + 1,
            };
          },
          solve(ex) {
            return { kind: 'numeric', value: ex.prompt.match(/\d+/u)![0] };
          },
        },
      ],
    };
    expect(validatePack(pack)).toEqual([]);
    const added = materialize(pack, { ...options, competencyIds: ['cn8'] });
    expect(
      buildSession({
        pool: added,
        competencyIds: ['cn8'],
        n: 1,
        mode: 'study',
        state: {},
        rng: mulberry32(2),
        now: 0,
      }).exercises[0]?.competencyId,
    ).toBe('cn8');
  });
  it('validação deteta erros estruturais, opções duplicadas e solvers errados', () => {
    expect(
      validatePack({ ...demoPack, templates: [...demoPack.templates, demoPack.templates[0]!] }).length,
    ).toBeGreaterThan(0);
    expect(
      validatePack({
        ...demoPack,
        competencies: [{ ...demoPack.competencies[0]!, prerequisites: ['ausente'] }],
      }).length,
    ).toBeGreaterThan(0);
    const t = demoPack.templates[0]!;
    expect(
      validatePack({
        ...demoPack,
        templates: [
          {
            ...t,
            generate(seed, difficulty) {
              return {
                ...t.generate(seed, difficulty),
                kind: 'mcq',
                options: ['1', ' 1 '],
                correctAnswer: '1',
              };
            },
          },
        ],
      }).length,
    ).toBeGreaterThan(0);
    expect(
      validatePack({ ...demoPack, templates: [{ ...t, solve: () => ({ kind: 'numeric', value: '-999' }) }] })
        .length,
    ).toBeGreaterThan(0);
  });
});
describe('Save v2 e histórico', () => {
  it('migra v1 preservando campos e origem, sem inventar histórico; migração é repetível', () => {
    const { seen: _seen, mistakes: _mistakes, ...base } = defaultSave();
    const v1 = {
      ...base,
      version: 1,
      stars: 17,
      ownedItems: ['boina'],
      mastery: {
        c: updateMastery(emptyMastery(), { correct: true, partial: 1, feedback: 'Correto' }, 0, 123),
      },
      rewardLedger: { '2026-10-30': { c: 7 } },
    };
    const original = JSON.stringify(v1);
    const migrated = migrate(v1);
    expect(migrated).toEqual({ ...v1, version: 2, seen: [], mistakes: [] });
    expect(migrate(migrated)).toEqual(migrated);
    expect(JSON.stringify(v1)).toBe(original);
    expect(migrated.mastery).not.toBe(v1.mastery);
    expect(migrated.ownedItems).not.toBe(v1.ownedItems);
    expect(() => migrate({ ...v1, version: 3 })).toThrow();
    expect(() => migrate(null)).toThrow();
  });
  it('limita FIFO a 500 vistos e 100 erros, conserva instantâneo e resposta', () => {
    let save = defaultSave();
    for (let i = 0; i < 510; i++) {
      const ex = instantiate(demoPack, ref('unitario', i));
      save = recordAttempt(save, ex, { kind: 'numeric', value: '-1' }, false, i);
    }
    expect(save.seen).toHaveLength(500);
    expect(save.seen[0]!.ref.seed).toBe(10);
    expect(save.mistakes).toHaveLength(100);
    expect(save.mistakes[0]!.ref.seed).toBe(410);
    expect(migrate(save)).toEqual(save);
    const ex = instantiate(demoPack, save.mistakes[0]!.ref);
    expect(save.mistakes[0]!.snapshot).toEqual({ prompt: ex.prompt, explanation: ex.explanation });
    expect(() => migrate({ ...save, seen: [...save.seen, save.seen[0]] })).toThrow();
    for (const bad of [
      { ...save.seen[0], at: NaN },
      { ...save.seen[0], ref: { ...ref(), seed: -1 } },
      { ...save.seen[0], extra: 1 },
    ])
      expect(() => migrate({ ...save, seen: [bad] })).toThrow();
    expect(() =>
      migrate({ ...save, mistakes: [{ ...save.mistakes[0], answer: { kind: 'numeric', value: [] } }] }),
    ).toThrow();
  });
  it('penalizações são suaves e contam relaxamentos sem impedir revisão', () => {
    const ex = instantiate(demoPack, ref());
    const save = recordAttempt(defaultSave(), ex, { kind: 'numeric', value: '0' }, false, 0);
    const options = {
      pool: [ex],
      competencyIds: ['mat6-prop'],
      n: 1,
      mode: 'review' as const,
      state: {},
      rng: mulberry32(1),
      now: 86400000,
      history: save.seen,
    };
    const session = buildSession(options);
    expect(session.exercises).toHaveLength(1);
    expect(session.relaxed).toBe(1);
    expect(session.exhausted).toBe(false);
  });
});
