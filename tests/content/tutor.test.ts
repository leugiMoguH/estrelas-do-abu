import { hgpBanks } from '../../content/historia';
import { expect, it } from 'vitest';
import { gamePack, TUTORS, validateLessons, SUBJECTS } from '../../content';
it('valida as seis lições e a cobertura das competências existentes', () => {
  const lessons = Object.values(TUTORS).flatMap(t => t.lessons);
  expect(lessons.map(l => l.id).sort()).toEqual(gamePack.competencies.filter(c=>!c.id.startsWith('hgp-') || Object.values(hgpBanks).some(m=>m.bank.items.some(i=>i.topic===c.id))).map(c => c.id).sort());
  expect(validateLessons(lessons, gamePack.competencies)).toEqual([]);
  expect(SUBJECTS.filter(s => !s.active).every(s => s.tutor?.ready === false)).toBe(true);
});
it('confere seis resultados de Matemática com oráculos independentes', () => {
  const expected = [7 / 8, 12, 50, 7, 10, 450];
  const examples = TUTORS.matematica.lessons.flatMap(l => l.examples);
  expect(examples).toHaveLength(6);
  examples.forEach((e, i) => {
    expect(e.compute!()).toBe(expected[i]);
    expect(e.result).toBe(expected[i]);
  });
});
it('deteta conteúdo incompleto, referências erradas e cálculos incorretos', () => {
  const lesson = TUTORS.matematica.lessons[0]!;
  expect(validateLessons([{ ...lesson, id: 'ausente' }], gamePack.competencies).length).toBeGreaterThan(0);
  expect(validateLessons([{ ...lesson, explanation: [''], examples: [] }], gamePack.competencies).length).toBeGreaterThan(0);
  expect(validateLessons([{ ...lesson, examples: lesson.examples.map(e => ({ ...e, compute: () => -1 })) }], gamePack.competencies).length).toBeGreaterThan(0);
});
