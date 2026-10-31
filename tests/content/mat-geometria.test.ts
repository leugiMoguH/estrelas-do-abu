import { describe, expect, it } from 'vitest';
import { correctAnswerOf, instantiate, validatePack } from '../../src/core/content';
import type { ContentPack, Difficulty } from '../../src/core/content';
import type { Exercise } from '../../src/core/types';
import { grade } from '../../src/core/grading';
import { geometriaTemplates, geometriaTopics } from '../../content/matematica/geometria';
import { propExtraTemplates } from '../../content/matematica/prop-extra';
import { geometriaLessons } from '../../content/tutor/mat-geometria';

const templates = [...geometriaTemplates, ...propExtraTemplates];
const pack: ContentPack = {
  id: 'mat-geometria-test', version: '1', curriculumVersion: 'AE2021', templates,
  competencies: [...geometriaTopics.map(t => ({ id: t.competencyIds[0]!, subject: t.subject, grade: 6, domain: t.group!, theme: t.title, objective: t.blurb, curriculumRef: t.curriculumRef!, prerequisites: [] })), { id: 'mat-proporcionalidade', subject: 'matematica', grade: 6, domain: 'Álgebra', theme: 'Proporcionalidade direta', objective: 'Reconhecer razões constantes.', curriculumRef: 'AE2021', prerequisites: [] }],
};
const corrupt = (ex: Exercise): Exercise => ex.kind === 'cloze' ? { ...ex, correctAnswers: [['-999999']] } : ex.kind === 'numeric' ? { ...ex, correctAnswer: -999999 } : ex.kind === 'mcq' ? { ...ex, correctAnswer: 'chave corrompida' } : ex;
const canonical = (s: string) => {
  const text = s.trim().toLocaleLowerCase('pt-PT').replace(/\s+/gu, ' ');
  if (/^-?\d+(?:[.,]\d+)?(?:\/\d+)?$/u.test(text)) {
    const [a = 0, b = 1] = text.replace(',', '.').split('/').map(Number);
    return String(a / b);
  }
  return text;
};
const minima: Record<string, number> = {};
describe('Geometria e proporcionalidade suplementar', () => {
  it('valida o pacote mínimo e a cobertura por tema', () => {
    expect(validatePack(pack)).toEqual([]);
    for (const topic of geometriaTopics) {
      const ts = geometriaTemplates.filter(t => t.competencyId === `mat-${topic.id}`);
      expect(ts.length).toBeGreaterThanOrEqual(3);
      expect(new Set(ts.map(t => t.conceptId)).size).toBeGreaterThanOrEqual(3);
      expect(new Set(ts.map(t => t.generate(0, 1).kind)).size).toBeGreaterThanOrEqual(2);
    }
  });
  for (const t of templates) for (const difficulty of [1, 2, 3] as const) {
    it(`${t.id}/${difficulty}: chave, solver independente e integridade (100 seeds)`, () => {
      for (let seed = 0; seed < 100; seed++) {
        const ex = instantiate(pack, { packId: pack.id, packVersion: pack.version, templateId: t.id, seed, difficulty });
        const key = correctAnswerOf(ex), answer = t.solve!(ex);
        expect(grade(ex, answer)).toMatchObject({ correct: true });
        expect(answer).toEqual(key);
        expect(t.solve!(corrupt(ex))).toEqual(key);
        expect(ex.hints.length).toBeGreaterThanOrEqual(2);
        expect(ex.explanation.length).toBeGreaterThan(50);
        expect(ex.commonErrors.length).toBeGreaterThanOrEqual(1);
        const values = typeof key.value === 'string' ? [key.value] : key.value;
        for (const error of ex.commonErrors) expect(values.map(canonical)).not.toContain(canonical(error.match));
        if (ex.kind === 'mcq') expect(new Set(ex.options.map(canonical)).size).toBe(ex.options.length);
      }
    });
    it(`${t.id}/${difficulty}: pelo menos 150 enunciados naturais distintos em 2000 seeds`, () => {
      const count = new Set(Array.from({ length: 2000 }, (_, seed) => t.generate(seed, difficulty).prompt)).size;
      minima[`${t.id}/${difficulty}`] = count;
      expect(count, `${t.id}/${difficulty}: ${count} distintos`).toBeGreaterThanOrEqual(150);
    });
  }
  it('oráculos conhecidos independentes dos geradores', () => {
    const solve = (id: string, prompt: string, value: string, difficulty: Difficulty = 1) => {
      const t = templates.find(t => t.id === id)!;
      expect(t.solve!({ ...t.generate(0, difficulty), prompt })).toEqual({ kind: 'numeric', value });
    };
    solve('circ-perimetro', 'Uma roda tem diâmetro 10 cm. Rola sem deslizar durante 1 voltas completas. Que distância percorre, em cm? Usa π≈3,14.', '31.4');
    solve('vol-cilindro', 'Uma lata cilíndrica tem diâmetro interior 6 cm e altura interior 10 cm. Usa π≈3,14. Qual é o volume interior, em cm³?', '282.6');
    solve('rot-minimo', 'Um polígono regular de 8 lados roda em torno de O no sentido positivo.', '45');
    solve('ang-triangulo', 'Um triângulo tem ângulos internos A=48° e B=62°. Quanto mede C?', '70');
    solve('ang-externo', 'Um triângulo tem ângulos internos A=48° e B=62°. Quanto mede o externo em C?', '110');
    solve('rot-composicao', 'Uma seta roda primeiro 250° e depois 170° em torno de O.', '60');
    const tab = templates.find(t => t.id === 'prop-tabela')!;
    for (const [prompt, value] of [['(2; 6), (3; 9), (4; 12)', 'Sim'], ['(2; 7), (3; 10), (4; 13)', 'Não']]) {
      expect(tab.solve!({ ...tab.generate(0, 1), prompt: prompt! })).toEqual({ kind: 'mcq', value });
    }
  });
  it('lições: referências, estrutura e exemplos inteiros exatos', () => {
    expect(geometriaLessons).toHaveLength(4);
    for (const lesson of geometriaLessons) {
      expect(lesson.curriculumRef).toBe(geometriaTopics.find(t => t.competencyIds.includes(lesson.id))!.curriculumRef);
      expect(lesson.review).toBe('needs-human-review');
      expect(lesson.explanation.length).toBeGreaterThanOrEqual(3);
      expect(lesson.explanation.length).toBeLessThanOrEqual(5);
      expect(lesson.checklist.length).toBeGreaterThanOrEqual(3);
      expect(lesson.checklist.length).toBeLessThanOrEqual(4);
      expect(lesson.commonErrors.length).toBeGreaterThan(0);
      expect(lesson.examples.length).toBeGreaterThanOrEqual(2);
      for (const example of lesson.examples) {
        expect(example.steps.length).toBeGreaterThanOrEqual(2);
        expect(Number.isInteger(example.compute!())).toBe(true);
        expect(example.compute!()).toBe(example.result);
      }
    }
  });
  it('regista o mínimo de diversidade medido', () => {
    console.info('Mínimo de enunciados distintos:', Math.min(...Object.values(minima)));
  });
});
