import { describe, expect, it } from 'vitest';
import { mathTemplates } from '../../content/matematica';
import { numerosTemplates } from '../../content/matematica/numeros';
import { algebraDadosTemplates } from '../../content/matematica/algebra-dados';
import { geometriaTemplates } from '../../content/matematica/geometria';
import { propExtraTemplates } from '../../content/matematica/prop-extra';
import { portugueseTemplates } from '../../content/portugues';
import { correctAnswerOf } from '../../src/core/content';
import type { Difficulty } from '../../src/core/content';
import type { Exercise } from '../../src/core/types';
import { grade } from '../../src/core/grading';

const templates = [...mathTemplates, ...numerosTemplates, ...algebraDadosTemplates, ...geometriaTemplates, ...propExtraTemplates];
const generate = (id: string, seed = 0, difficulty: Difficulty = 1) => templates.find(t => t.id === id)!.generate(seed, difficulty);
const texts = (ex: Exercise) => [ex.prompt, ex.stimulus ?? '', ...ex.hints, ex.explanation, ...ex.commonErrors.map(e => e.feedback)].join('\n');
const badPlural = /(?<![\d.,/^])1 (?:partes|vermelhas|vermelhos|verdes|azuis|bolas|fichas|voltas|mesas|litros|resultados|cromos|euros|gramas|minutos|observações|fatores|casas|cadernos|pessoas|lados|eixos|setores|faces)\b/u;
const equivalences = [
  ['frac-decimal', '2,20'], ['op-parenteses', '48,0'], ['prop-receita', '60,0'],
  ['num-mdc', '1,0'], ['pot-expoente-falta', '2,0'], ['dados-classes', '3,0'],
  ['prob-complementar', '1,0'], ['circ-raio', '11,950'], ['ang-complementar', '65,60'],
  ['ang-suplementar', '131,60'], ['vol-altura', '6,0'], ['vol-litros', '162,0'],
  ['rot-eixos', '5,0'], ['circ-diametro', '81,40'], ['vol-litros-dm3', '23,0'],
];

describe('regressões dos defeitos confirmados na auditoria', () => {
  it.each(equivalences)('D-E: %s seed=0 difficulty=1 aceita %s', (id, value) => {
    expect(grade(generate(id!), { kind: 'cloze', value: [value!] })).toMatchObject({ correct: true });
  });
  it('D-P: seq-seguinte seed=0 difficulty=3 explica os inteiros apresentados', () => {
    const ex = generate('seq-seguinte', 0, 3);
    expect(correctAnswerOf(ex).value).toBe('39');
    expect(ex.explanation).toContain('45');
    expect(ex.explanation).toContain('39');
    expect(texts(ex)).not.toMatch(/numerador|denominador/u);
  });
  it('D-P: pot-valor seed=0 difficulty=1 explica potência seguida de adição e o erro 18', () => {
    const ex = generate('pot-valor');
    expect(correctAnswerOf(ex).value).toBe('66');
    expect(ex.explanation).toContain('8 × 8 = 64');
    expect(ex.explanation).toContain('64 + 2 = 66');
    expect(ex.hints.join(' ')).toContain('adiciona');
    expect(grade(ex, { kind: 'numeric', value: '18' })).toMatchObject({ feedback: expect.stringContaining('Multiplicaste a base pelo expoente') });
    expect(texts(ex)).not.toMatch(/elemento comum|base ou o expoente é comum|soma expoentes/u);
  });
  it('D-AE: frac-subtracao seed=3668339987 difficulty=1 conserva racionais não negativos', () => {
    const ex = generate('frac-subtracao', 3668339987);
    expect(ex.prompt).toContain('10/16 − 7/16');
    expect(correctAnswerOf(ex).value).toBe('3/16');
  });
  it.each([
    ['frac-parte', '1 parte'], ['prob-favoraveis', '1 vermelha'],
    ['prob-complementar', '1 vermelha'], ['prob-fracao-complementar', 'O 1 resultado não azul é favorável'],
    ['circ-perimetro', '1 volta completa'], ['circ-area', '1 mesa igual'], ['vol-litros-dm3', '1 litro'],
  ])('D-PT: %s seed=0 difficulty=1 usa %s', (id, expected) => {
    const text = texts(generate(id!));
    expect(text).toContain(expected);
    expect(text).not.toMatch(badPlural);
  });
  it('mantém comparação textual e forma irredutível; rejeita agrupamentos e sintaxe não decimal', () => {
    const ex = generate('num-mdc');
    for (const value of ['1 000', '1.000,0', '1,000.0', '1e0', '1/1', '1,0,0', 'Infinity', '1 litro']) {
      expect(grade(ex, { kind: 'cloze', value: [value] }), value).toMatchObject({ correct: false });
    }
    const inverse = generate('frac-inverso');
    if (inverse.kind !== 'cloze') throw new Error('Formato inesperado');
    const [a, b] = inverse.correctAnswers[0]![0]!.split('/').map(Number);
    expect(grade(inverse, { kind: 'cloze', value: [`${a! * 2}/${b! * 2}`] })).toMatchObject({ correct: false });
    const text = { ...ex, kind: 'cloze' as const, correctAnswers: [['Século I'], ['1/2']] };
    expect(grade(text, { kind: 'cloze', value: ['  SÉCULO   I ', '1/2'] })).toMatchObject({ correct: true });
    expect(grade(text, { kind: 'cloze', value: ['Seculo I', '2/4'] })).toMatchObject({ correct: false });
  });

  it('varre as 8400 instâncias da amostra: domínio, concordância e equivalência decimal', () => {
    expect(templates).toHaveLength(70);
    const seeds = [0, 0xffffffff, ...Array.from({ length: 38 }, (_, i) => Math.imul(i + 1, 2654435761) >>> 0)];
    for (const t of templates) for (const d of [1, 2, 3] as const) for (const seed of seeds) {
      const ex = t.generate(seed, d), label = `${t.id}/${seed}/${d}`;
      expect(texts(ex), label).not.toMatch(badPlural);
      if (t.id.startsWith('frac-')) {
        const answer = correctAnswerOf(ex).value;
        for (const value of typeof answer === 'string' ? [answer] : answer) {
          expect(Number(value.split('/')[0]!.replace(',', '.')), label).toBeGreaterThanOrEqual(0);
        }
        expect(texts(ex), label).not.toMatch(/[-−]\d+(?:\/\d+)?/u);
        if (ex.kind === 'mcq') expect(ex.options.join(' '), label).not.toMatch(/-\d/u);
      }
      if (ex.kind === 'cloze') {
        for (const separator of [',', '.']) {
          const value = ex.correctAnswers.map(field => {
            const key = field[0]!;
            if (!/^[+-]?\d+(?:[.,]\d+)?$/u.test(key)) return key;
            return (/[.,]/u.test(key) ? key.replace(/[.,]/u, separator) : key + separator) + '0';
          });
          expect(grade(ex, { kind: 'cloze', value }), label).toMatchObject({ correct: true });
        }
      }
    }
    for (const t of portugueseTemplates) for (const d of [1, 2, 3] as const) for (const seed of seeds) {
      expect(texts(t.generate(seed, d)), `${t.id}/${seed}/${d}`).not.toMatch(badPlural);
    }
  });
});
