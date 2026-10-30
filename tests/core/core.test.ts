import { describe, expect, it } from 'vitest';
import { grade } from '../../src/core/grading';
import { score } from '../../src/core/score';
import { emptyMastery, updateMastery, type Mastery } from '../../src/core/mastery';
import { DAY, dueCompetencies, reviewLevel } from '../../src/core/review';
import { buildSession, seededRng } from '../../src/core/session';
import { buy, rewardSession } from '../../src/core/rewards';
import { defaultSave, exportSave, importSave, migrate } from '../../src/core/save';
import type { Exercise } from '../../src/core/types';
const base = {
  id: 'a',
  competencyId: 'c',
  difficulty: 1 as const,
  prompt: 'Calcula.',
  hints: ['Ajuda'],
  explanation: 'Consulta a resolução.',
  commonErrors: [{ match: '2', feedback: 'Revê o cálculo.' }],
};
const numeric: Exercise = { ...base, kind: 'numeric', correctAnswer: 3 / 4, units: ['m'] };
const ok = { correct: true, partial: 1, feedback: 'Correto!' };
const wrong = { correct: false, partial: 0, feedback: 'Revê.' };
function trained(n: number, hints = 0): Mastery {
  let m = emptyMastery();
  for (let i = 0; i < n; i++) m = updateMastery(m, ok, hints, 0);
  return m;
}
const pool: Exercise[] = [1, 2, 3].flatMap((difficulty) =>
  (['numeric', 'text', 'mcq'] as const).map((kind, i): Exercise => {
    const b = {
      ...base,
      id: `${difficulty}-${i}`,
      prompt: `Pergunta ${difficulty}-${i}`,
      difficulty: difficulty as 1 | 2 | 3,
    };
    return kind === 'numeric'
      ? { ...b, kind, correctAnswer: 1 }
      : kind === 'text'
        ? { ...b, kind, correctAnswers: ['um'] }
        : { ...b, kind, options: ['um', 'dois'], correctAnswer: 'um' };
  }),
);
describe('correção', () => {
  it.each(['0,75', '0.75', ' 3 / 4 ', '0,75 m', ' 0 , 7 5m '])('aceita equivalência %s', (value) =>
    expect(grade(numeric, { kind: 'numeric', value })).toMatchObject({ correct: true, partial: 1 }),
  );
  it.each(['', ' ', 'abc', '3/0', '1/2/3', '0.75 kg', '1e2', 'Infinity', '0,7.5'])('rejeita %s', (value) =>
    expect(grade(numeric, { kind: 'numeric', value })).toEqual({ invalid: true }),
  );
  it('aplica tolerância e erro frequente', () => {
    expect(grade({ ...numeric, tolerance: 0.01 }, { kind: 'numeric', value: '.759' })).toMatchObject({
      correct: true,
    });
    expect(grade(numeric, { kind: 'numeric', value: '2' })).toMatchObject({
      correct: false,
      feedback: 'Revê o cálculo.',
    });
    expect(grade(numeric, { kind: 'text', value: '0,75' })).toEqual({ invalid: true });
  });
  it('preserva acentos por omissão e normaliza Unicode, espaços e maiúsculas', () => {
    const ex: Exercise = { ...base, kind: 'text', correctAnswers: ['É água'] };
    expect(grade(ex, { kind: 'text', value: ' E\u0301   ÁGUA ' })).toMatchObject({ correct: true });
    expect(grade(ex, { kind: 'text', value: 'e agua' })).toMatchObject({ correct: false });
    expect(grade({ ...ex, ignoreAccents: true }, { kind: 'text', value: 'e agua' })).toMatchObject({
      correct: true,
    });
  });
  it('valida escolhas e atribui crédito parcial a ordenar e completar', () => {
    const mcq: Exercise = { ...base, kind: 'mcq', options: ['a', 'b'], correctAnswer: 'a' };
    expect(grade(mcq, { kind: 'mcq', value: 'x' })).toEqual({ invalid: true });
    expect(grade(mcq, { kind: 'mcq', value: 'b' })).toMatchObject({ correct: false });
    const order: Exercise = {
      ...base,
      kind: 'order',
      items: ['a', 'b', 'c'],
      correctAnswer: ['a', 'b', 'c'],
    };
    expect(grade(order, { kind: 'order', value: ['a', 'c', 'b'] })).toMatchObject({ partial: 1 / 3 });
    expect(grade(order, { kind: 'order', value: ['a', 'a', 'b'] })).toEqual({ invalid: true });
    expect(grade(order, { kind: 'order', value: [] })).toEqual({ invalid: true });
    const cloze: Exercise = { ...base, kind: 'cloze', correctAnswers: [['é'], ['azul', 'anil']] };
    expect(grade(cloze, { kind: 'cloze', value: ['é', 'anil'] })).toMatchObject({ partial: 1 });
    expect(grade(cloze, { kind: 'cloze', value: ['e', 'azul'] })).toMatchObject({ partial: 0.5 });
    expect(grade(cloze, { kind: 'cloze', value: ['', 'azul'] })).toEqual({ invalid: true });
  });
});
describe('nota e domínio', () => {
  it('arredonda à décima e mantém perguntas sem resposta no denominador', () => {
    const report = score([
      { competencyId: 'a', result: ok },
      { competencyId: 'a', result: wrong },
      { competencyId: 'b', result: { ...wrong, partial: 0.5 } },
      { competencyId: 'x', result: { invalid: true } },
    ]);
    expect(report.grade).toBe(7.5);
    expect(report.toReview).toEqual(['a', 'b', 'x']);
    expect(
      score([
        { competencyId: 'a', result: ok },
        { competencyId: 'b', result: wrong },
        { competencyId: 'b', result: wrong },
      ]).grade,
    ).toBe(6.7);
    expect(score([{ competencyId: 'a', result: ok }]).mastered).toEqual(['a']);
    expect(score([]).grade).toBe(0);
    expect(
      score([
        { competencyId: 'a', result: ok },
        { competencyId: 'a', result: { invalid: true } },
      ]).grade,
    ).toBe(10);
  });
  it('exige tentativas, precisão recente e pouca ajuda para consolidar', () => {
    expect(trained(2).level).toBe('discovering');
    expect(trained(4).level).toBe('progressing');
    expect(trained(5).level).toBe('consolidated');
    expect(trained(5, 2).level).toBe('progressing');
    expect(updateMastery(trained(5), ok, 10, 1).level).toBe('consolidated');
    let m = trained(5);
    m = updateMastery(m, wrong, 0, 1);
    m = updateMastery(m, wrong, 0, 2);
    expect(m.level).toBe('progressing');
    expect(updateMastery(m, wrong, 0, 3).level).toBe('practising');
    expect(updateMastery(m, { invalid: true }, 0, 4)).toBe(m);
  });
});
describe('sessões', () => {
  const session = (state = {}, n = 9, mode: 'study' | 'test' | 'review' = 'study', exercises = pool) =>
    buildSession({ mode, pool: exercises, competencyIds: ['c'], n, state, rng: seededRng(42), now: 0 });
  it('não repete identificadores nem assinaturas e reduz banco esgotado', () => {
    const duplicate: Exercise = { ...pool[0]!, id: 'outro', prompt: '  PERGUNTA   1-0  ' };
    const result = session({}, 20, 'study', [...pool, duplicate, { ...pool[0]!, prompt: 'Outra' }]);
    expect(result.exhausted).toBe(true);
    expect(result.exercises).toHaveLength(9);
    expect(new Set(result.exercises.map((e) => e.id)).size).toBe(9);
    expect(session().exercises).toEqual(session().exercises);
    expect(new Set(session({}, 3).exercises.map((e) => e.kind)).size).toBe(3);
  });
  it('adapta por competência e remove pistas em teste sem mutação', () => {
    expect(session({}, 1).exercises[0]!.difficulty).toBe(1);
    expect(session({ c: trained(5) }, 1).exercises[0]!.difficulty).toBe(3);
    const struggling = { ...trained(5), streak: 0, recent: [false, false] };
    expect(session({ c: struggling }, 1).exercises[0]!.difficulty).toBe(1);
    expect(session({}, 3, 'test').exercises.every((e) => e.hints.length === 0)).toBe(true);
    expect(pool[0]!.hints).toHaveLength(1);
    expect(session({}, 0).exhausted).toBe(false);
  });
});
describe('revisão', () => {
  it('usa os quatro intervalos e o instante exato de vencimento', () => {
    for (const [step, days] of [1, 3, 7, 14].entries()) {
      const m = { ...trained(5), reviewStep: step };
      expect(reviewLevel(m, days * DAY - 1)).toBe('consolidated');
      expect(reviewLevel(m, days * DAY)).toBe('review');
      expect(dueCompetencies({ c: m }, days * DAY)).toEqual(['c']);
    }
  });
  it('seleciona vencidas; sem vencidas começa pelas não praticadas', () => {
    expect(dueCompetencies({ c: trained(5) }, 0, ['c', 'nova'])).toEqual(['nova', 'c']);
    expect(
      dueCompetencies(
        { c: trained(3), d: { ...trained(5), recent: [false, false, false, false, false] } },
        0,
      ),
    ).toEqual(['d', 'c']);
    expect(
      dueCompetencies({ c: { ...trained(5), reviewStep: 0 }, d: { ...trained(5), lastSeen: DAY } }, DAY),
    ).toEqual(['c']);
  });
});
describe('recompensas, loja e gravações', () => {
  const session = { completed: true, competencies: [{ competencyId: 'c', improved: true, isNew: true }] };
  it('limita por competência e dia, sem alterar entrada', () => {
    const initial = defaultSave();
    const a = rewardSession(initial, session, 0);
    expect(a.earned).toBe(7);
    expect(initial.stars).toBe(0);
    const b = rewardSession(a.save, session, 0);
    expect(b.earned).toBe(3);
    expect(rewardSession(b.save, session, 0).earned).toBe(0);
    expect(rewardSession(b.save, session, DAY).earned).toBe(7);
    expect(rewardSession(b.save, { ...session, completed: false }, DAY).earned).toBe(0);
    expect(
      rewardSession(
        initial,
        { ...session, competencies: [...session.competencies, ...session.competencies] },
        0,
      ).earned,
    ).toBe(7);
  });
  it('valida preço, saldo e propriedade', () => {
    const save = { ...defaultSave(), stars: 10 };
    expect(buy(save, { id: 'chapéu', price: 11 })).toMatchObject({ ok: false, reason: 'insufficient-funds' });
    expect(buy(save, { id: 'chapéu', price: -1 })).toMatchObject({ ok: false, reason: 'invalid-item' });
    const result = buy(save, { id: 'chapéu', price: 3 });
    expect(result.ok).toBe(true);
    expect(result.save.stars).toBe(7);
    expect(save.stars).toBe(10);
    expect(buy(result.save, { id: 'chapéu', price: 3 })).toMatchObject({ ok: false, reason: 'owned' });
  });
  it('exporta e importa todo o estado e copia referências', () => {
    const save = { ...rewardSession(defaultSave(), session, 0).save, mastery: { c: trained(5) } };
    expect(importSave(exportSave(save))).toEqual({ ok: true, save });
    expect(migrate(save)).not.toBe(save);
    expect(migrate(save).mastery).not.toBe(save.mastery);
  });
  it.each([
    'null',
    '{}',
    '[]',
    'lixo',
    '{"version":2}',
    JSON.stringify({ ...defaultSave(), stars: -1 }),
    JSON.stringify({ ...defaultSave(), extra: 1 }),
    JSON.stringify({ ...defaultSave(), ownedItems: ['a', 'a'] }),
    JSON.stringify({ ...defaultSave(), mastery: { c: { ...trained(5), correct: 99 } } }),
    JSON.stringify({ ...defaultSave(), rewardLedger: { '2026-02-31': { c: 2 } } }),
    '{"version":1,"stars":0,"ownedItems":[],"mastery":{"__proto__":{}},"rewardLedger":{}}',
  ])('rejeita importação inválida sem substituir: %s', (raw) => {
    const current = defaultSave();
    expect(importSave(raw).ok).toBe(false);
    expect(current).toEqual(defaultSave());
  });
});
