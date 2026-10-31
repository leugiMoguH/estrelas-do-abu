import { describe, expect, it } from 'vitest';
import { correctAnswerOf, validatePack } from '../../src/core/content';
import type { ContentPack, Difficulty } from '../../src/core/content';
import type { Exercise } from '../../src/core/types';
import { grade } from '../../src/core/grading';
import { numerosTemplates, numerosTopics } from '../../content/matematica/numeros';
import { algebraDadosTemplates, algebraDadosTopics } from '../../content/matematica/algebra-dados';
import { numerosLessons } from '../../content/tutor/mat-numeros';
const templates = [...numerosTemplates, ...algebraDadosTemplates];
const topics = [...numerosTopics, ...algebraDadosTopics];
const minimumDistinct: Record<string, number> = {};
const pack: ContentPack = { id: 'mat-numeros-isolado', version: '1', curriculumVersion: 'AE2021', templates,
  competencies: topics.map(t => ({ id: t.competencyIds[0]!, subject: t.subject, grade: 6, domain: t.group!, theme: t.title, objective: t.blurb, curriculumRef: t.curriculumRef!, prerequisites: [] })) };
function corrupt(ex: Exercise): Exercise {
  if (ex.kind === 'cloze') return { ...ex, correctAnswers: [['CHAVE CORROMPIDA']] };
  if (ex.kind === 'numeric') return { ...ex, correctAnswer: -999999999 };
  if (ex.kind === 'mcq') return { ...ex, correctAnswer: 'CHAVE CORROMPIDA' };
  throw new Error('Formato inesperado');
}
// Oráculo racional local; não importa as funções aritméticas da implementação.
function rational(s: string): string {
  const m = /^(-?\d+)(?:\/(\d+))?$/u.exec(s);
  if (!m) return s;
  let a = BigInt(m[1]!), b = BigInt(m[2] ?? '1'), x = a < 0n ? -a : a, y = b;
  while (y) [x, y] = [y, x % y];
  a /= x; b /= x;
  return `${a}/${b}`;
}
function mathematicalValue(s: string): string {
  if (s.includes(':')) {
    return s.split('; ').map(part => {
      const [label, expression] = part.split(': ');
      const value = expression!.split(' × ').reduce((product, factor) => {
        const [base, exponent = '1'] = factor.split('^');
        return product * BigInt(base!) ** BigInt(exponent);
      }, 1n);
      return `${label}: ${value}`;
    }).join('; ');
  }
  const law = /^u\(n\) = \((-?\d+) ([+−]) \((-?\d+)\) × (n|\(n − 1\))\)\/(\d+)$/u.exec(s);
  if (law) {
    const first = Number(law[1]), step = Number(law[3]) * (law[2] === '−' ? -1 : 1), denominator = law[5]!;
    return `linear:${rational(`${first - (law[4] === 'n' ? 0 : step)}/${denominator}`)}:${rational(`${step}/${denominator}`)}`;
  }
  return rational(s);
}
describe('pacote isolado de números, álgebra e dados', () => {
  it('valida metadados, formatos e solvers sem gamePack', () => { expect(validatePack(pack)).toEqual([]); });
  for (const t of templates) for (const d of [1, 2, 3] as Difficulty[]) {
    it(`${t.id}/D${d}: 100 seeds, solver independente e opções`, () => {
      for (let seed = 0; seed < 100; seed++) {
        const ex = t.generate(seed, d), key = correctAnswerOf(ex), answer = t.solve!(ex);
        expect(answer, `${t.id}/${d}/${seed}`).toEqual(key);
        expect(grade(ex, answer)).toMatchObject({ correct: true });
        expect(t.solve!(corrupt(ex))).toEqual(key);
        expect(ex.hints.length).toBeGreaterThanOrEqual(2);
        expect(ex.explanation.length).toBeGreaterThan(50);
        expect(ex.commonErrors.length).toBeGreaterThanOrEqual(1);
        for (const error of ex.commonErrors) {
          const value = typeof key.value === 'string' ? key.value : key.value[0]!;
          expect(error.match).not.toBe(value);
          if (ex.kind === 'numeric') expect(rational(error.match)).not.toBe(rational(value));
        }
        if (ex.kind === 'mcq') {
          expect(new Set(ex.options).size).toBe(ex.options.length);
          expect(ex.options.length).toBeGreaterThanOrEqual(2);
          // Exceção explicitamente solicitada: representações equivalentes são
          // distratores apenas quando se avalia a forma irredutível em si.
          if (t.id === 'frac-irredutivel') {
            expect(new Set(ex.options.map(rational)).size).toBe(1);
            expect(ex.options.filter(o => rational(o) === o)).toEqual([ex.correctAnswer]);
          } else expect(new Set(ex.options.map(mathematicalValue)).size, ex.prompt).toBe(ex.options.length);
        }
      }
    });
    it(`${t.id}/D${d}: pelo menos 150 enunciados em 2000 seeds`, () => {
      const prompts = new Set(Array.from({ length: 2000 }, (_, seed) => {
        const ex = t.generate(seed, d);
        expect(ex.commonErrors.length, `${t.id}/D${d}/seed${seed}`).toBeGreaterThan(0);
        if (ex.kind === 'mcq' && t.id !== 'frac-irredutivel') {
          expect(new Set(ex.options.map(mathematicalValue)).size, `${t.id}/D${d}/seed${seed}`).toBe(ex.options.length);
        }
        return ex.prompt;
      }));
      minimumDistinct[t.competencyId] = Math.min(minimumDistinct[t.competencyId] ?? Infinity, prompts.size);
      expect(prompts.size, `Diversidade insuficiente: ${t.id}/D${d}: ${prompts.size}`).toBeGreaterThanOrEqual(150);
    });
  }
  it('oráculos conhecidos e sinais, expoentes, limites e ordens naturais', () => {
    const solve = (id: string, prompt: string) => {
      const t = templates.find(t => t.id === id)!;
      return t.solve!({ ...t.generate(1, 1), prompt }).value;
    };
    expect(solve('num-mmc', 'Calcula o mmc de 12 e 18.')).toBe('36');
    expect(solve('num-mdc', 'Calcula o mdc de 84 e 126.')).toEqual(['42']);
    expect(solve('num-decomposicao', 'No clube de matemática, decompõe 360 e 84 em fatores primos.')).toBe('360: 2^3 × 3^2 × 5; 84: 2^2 × 3 × 7');
    expect(solve('frac-subtracao', 'Calcula 1/3 − 3/4. Escolhe a fração irredutível.')).toBe('-5/12');
    expect(solve('frac-divisao', 'Calcula 2/3 ÷ 4/5. Escolhe a fração irredutível.')).toBe('5/6');
    expect(solve('frac-expressao', 'Calcula (1/2 + 1/3) × 3/5. Escolhe a fração irredutível.')).toBe('1/2');
    expect(solve('pot-quociente-base', 'Escreve 3^12 ÷ 3^4 como uma potência de base 3. Qual é o expoente?')).toBe('8');
    expect(solve('seq-seguinte', 'Num jogo, a sequência começa por 5, 1, -3. A diferença entre termos é constante. Qual é o termo seguinte?')).toBe('-7');
    expect(solve('seq-pertence', 'Para n natural a partir de 1, u(n) = (4 + (3) × (n − 1))/2. O número 1/2 pertence à sequência?')).toBe('Não');
    expect(solve('dados-limites', 'Histograma: [10,20[: 3; [20,30[: 8. Em que classe se inclui a medição 20 minutos?')).toBe('[20,30[');
    expect(solve('prob-favoraveis', 'No saco do jogo há 6 bolas azuis, 8 vermelhas e 4 verdes. Qual é a probabilidade de sair azul?')).toBe('1/3');
  });
  it('seis lições com cálculos inteiros exatos e referências iguais às dos temas', () => {
    console.info('Mínimos de enunciados distintos por tema:', minimumDistinct);
    expect(numerosLessons).toHaveLength(6);
    for (const l of numerosLessons) {
      expect(l.curriculumRef).toBe(topics.find(t => t.competencyIds.includes(l.id))!.curriculumRef);
      expect(l.review).toBe('needs-human-review');
      expect(l.explanation.length).toBeGreaterThanOrEqual(3); expect(l.explanation.length).toBeLessThanOrEqual(5);
      expect(l.checklist.length).toBeGreaterThanOrEqual(3); expect(l.checklist.length).toBeLessThanOrEqual(4);
      expect(l.commonErrors.length).toBeGreaterThan(0); expect(l.examples.length).toBeGreaterThanOrEqual(2);
      for (const e of l.examples) { expect(e.steps.length).toBeGreaterThanOrEqual(2); expect(Number.isInteger(e.compute!())).toBe(true); expect(e.compute!()).toBe(e.result); }
    }
  });
});
