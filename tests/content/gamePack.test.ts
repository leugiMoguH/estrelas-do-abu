import { describe, expect, it } from 'vitest';
import { gamePack, SUBJECTS, TOPICS } from '../../content';
import { correctAnswerOf, validatePack } from '../../src/core/content';
import type { Exercise } from '../../src/core/types';
import { grade } from '../../src/core/grading';

const generators = gamePack.templates.filter(t=>t.instances === undefined);
const seeds = Array.from({ length: 100 }, (_, i) => i);
const keyless = (ex: Exercise): Exercise => {
  if (ex.kind === 'text') return { ...ex, correctAnswers: ['chave corrompida'] };
  if (ex.kind === 'cloze') return { ...ex, correctAnswers: [['chave corrompida']] };
  if (ex.kind === 'order') return { ...ex, correctAnswer: [] };
  if (ex.kind === 'mcq') return { ...ex, correctAnswer: 'chave corrompida' };
  return { ...ex, correctAnswer: -999999 };
};
describe('banco real da demo', () => {
  it('valida 100 seeds por template e dificuldade, incluindo os solvers', () => {
    expect(validatePack(gamePack, [...seeds, 0xffffffff])).toEqual([]);
    expect(SUBJECTS).toHaveLength(7);
    expect(SUBJECTS.filter((s) => s.active)).toHaveLength(3);
    expect(TOPICS).toHaveLength(17);
    for (const topic of TOPICS.filter(t=>t.subject!=='historia')) {
      const ts = gamePack.templates.filter((t) => topic.competencyIds.includes(t.competencyId));
      expect(new Set(ts.map((t) => t.conceptId)).size).toBeGreaterThanOrEqual(3);
      expect(new Set(ts.map((t) => t.generate(42, 1).kind)).size).toBeGreaterThanOrEqual(2);
    }
    for (const t of generators) {
      expect(t.review).toBe('approved');
      expect(t.source).toBe('revisão: Claude+Codex, sem revisão docente');
      expect(t.difficulties).toEqual([1, 2, 3]);
      for (const d of t.difficulties)
        for (const seed of seeds) {
          const ex = t.generate(seed, d);
          expect(ex.prompt.trim()).not.toBe('');
          expect(ex.hints.length).toBeGreaterThanOrEqual(2);
          expect(ex.hints.length).toBeLessThanOrEqual(3);
          expect(ex.explanation.length).toBeGreaterThan(50);
          expect(ex.commonErrors.length, `${t.id}/${d}/${seed}`).toBeGreaterThan(0);
          expect(t.solve!(keyless(ex))).toEqual(correctAnswerOf(ex));
          expect(grade(ex, t.solve!(ex))).toMatchObject({ correct: true });
        }
    }
  }, 15000);
  it('mede capacidade em 2000 seeds e gera três exemplos por tema', () => {
    const rows: string[] = [];
    let passing = 0;
    for (const t of generators) {
      const counts = t.difficulties.map(
        (d) => new Set(Array.from({ length: 2000 }, (_, seed) => t.generate(seed, d).prompt)).size,
      );
      rows.push(`| ${t.id} | ${counts.join(' | ')} |`);
      if (counts.every((count) => count >= 150)) passing++;
    }
    expect(passing).toBe(generators.length - 1);
    const samples = TOPICS.filter(t=>t.subject!=='historia').flatMap((topic) => {
      const ts = gamePack.templates.filter((t) => topic.competencyIds.includes(t.competencyId));
      return [
        `\n## ${topic.title}\n`,
        ...ts.slice(0, 3).flatMap((t, i) => {
          const d = ([1, 2, 3] as const)[i]!;
          const ex = t.generate(137 + i * 11, d);
          return [
            `### ${t.id} — dificuldade ${d}\n`,
            ex.prompt,
            `\nResposta: ${JSON.stringify(correctAnswerOf(ex).value)}\n`,
            `Pistas: ${ex.hints.join(' → ')}\n`,
            `Explicação: ${ex.explanation}\n`,
            `Erros típicos: ${ex.commonErrors.map((e) => `${e.match}: ${e.feedback}`).join(' / ')}\n`,
          ];
        }),
      ];
    });
    const report = [
      '# Amostras do banco da demo',
      '',
      'Gerado por tests/content/gamePack.test.ts. Textos originais; sem revisão docente.',
      '',
      'Capacidade: enunciados distintos em 2000 seeds **por dificuldade**. A contagem mede combinações textuais, não conceitos novos.',
      '',
      '| Template | D1 | D2 | D3 |',
      '| --- | --- | --- | --- |',
      ...rows,
      '',
      `Templates com ≥150 em todos os níveis: ${passing}/${generators.length}.`,
      'Exceções abaixo de 150: frac-decimal D1 tem apenas 80 numeradores intencionais; não se acrescenta ruído para simular diversidade.',
      ...samples,
      '',
      'Revisão docente recomendada: alinhamento fino com a planificação da turma, vocabulário gramatical, progressão de dificuldade e clareza das pistas.',
    ].join('\n');
    expect(report).toContain('Amostras');
    console.info(`Capacidade por template (D1/D2/D3):\n${rows.join('\n')}`);
  }, 15000);
});

it('torna os critérios de dificuldade observáveis nos itens', () => {
  const get = (id: string, d: 1 | 2 | 3) => gamePack.templates.find((t) => t.id === id)!.generate(42, d);
  const ns = (ex: Exercise) =>
    (ex.prompt.match(/\d+(?:[.,]\d+)?/gu) ?? []).map((s) => Number(s.replace(',', '.')));
  for (const d of [1, 2, 3] as const) {
    expect(ns(get('frac-decimal', d))[1]).toBe(10 ** d);
    const [a, b, c, e] = ns(get('frac-soma', d));
    expect(a).toBeGreaterThan(0);
    expect(c).toBeGreaterThan(0);
    if (d === 1) expect(b).toBe(e);
    else if (d === 2) expect(e).not.toBe(b);
    else expect(e).not.toBe(b);
    const voice = get('pt-voz-passiva', d);
    if (voice.kind !== 'order') throw new Error('Formato inesperado');
    expect(voice.correctAnswer[1]).toMatch(d === 1 ? /^é /u : d === 2 ? /^foi /u : /^serão .*das$/u);
    expect(get('prop-escala', d).prompt).toContain(
      d === 1 ? 'em centímetros' : d === 2 ? 'em metros' : 'em quilómetros',
    );
    expect(get('pt-completar', d).prompt).toContain(
      d === 1 ? 'no presente' : d === 2 ? 'no pretérito perfeito' : 'no futuro',
    );
  }
  expect(get('frac-parte', 1).prompt).toContain('1/');
  expect(get('frac-parte', 3).prompt).toContain('coleção completa');
  expect(get('op-produto', 2).prompt).toContain('÷');
  expect(get('op-produto', 3).prompt).toContain('(');
  expect(get('op-potencia', 2).prompt).toContain('³');
  expect(get('op-potencia', 3).prompt).toContain(')²');
});

it('mantém frações próprias, pistas calculadas e operações inteiras em 2000 seeds', () => {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  for (const d of [1, 2, 3] as const) {
    for (let seed = 0; seed < 2000; seed++) {
      const t = gamePack.templates.find((t) => t.id === 'frac-soma')!;
      const ex = t.generate(seed, d);
      const terms = [...ex.prompt.matchAll(/(\d+)\/(\d+)/gu)].map(
        (m) => [Number(m[1]), Number(m[2])] as const,
      );
      expect(terms).toHaveLength(d === 3 ? 3 : 2);
      for (const [n, denominator] of terms) {
        expect(n).toBeGreaterThan(0);
        expect(n).toBeLessThan(denominator);
      }
      const denominator = terms.reduce((lcm, [, b]) => (lcm * b) / gcd(lcm, b), 1);
      const numerator = terms.reduce((sum, [n, b]) => sum + (n * denominator) / b, 0);
      expect(ex.hints[0]).toContain(String(denominator));
      if (d === 2) expect(denominator).toBeLessThanOrEqual(30);
      if (d === 3) expect(ex.prompt).toContain('Num passeio');
      expect(String(correctAnswerOf(ex).value)).not.toMatch(/\/1$/u);
      expect(ex.prompt.includes('número inteiro')).toBe(numerator % denominator === 0);
      expect(ex.prompt.includes('Simplifica')).toBe(
        numerator % denominator !== 0 && gcd(numerator, denominator) > 1,
      );
      for (const id of ['op-parenteses', 'op-produto', 'op-potencia']) {
        const operation = gamePack.templates.find((t) => t.id === id)!.generate(seed, d);
        const result = correctAnswerOf(operation).value;
        expect(Number.isInteger(Number(Array.isArray(result) ? result[0] : result))).toBe(true);
      }
    }
  }
}, 15000);

it('usa pistas específicas e léxico com paradigmas explícitos', async () => {
  const { names, nouns, places, verbs } = await import('../../content/portugues/lexicon');
  for (const list of [names, nouns, places, verbs]) expect(list.length).toBeGreaterThanOrEqual(25);
  for (let seed = 0; seed < 100; seed++) {
    for (const d of [1, 2, 3] as const) {
      const tempo = gamePack.templates.find((t) => t.id === 'pt-tempo')!.generate(seed, d);
      const answer = String(correctAnswerOf(tempo).value);
      expect(tempo.hints[1]).toContain(
        answer.startsWith('presente')
          ? 'presente'
          : answer.startsWith('futuro')
            ? 'depois'
            : answer.includes('imperfeito')
              ? 'sem marcar o seu fim'
              : 'concluída',
      );
      for (const id of ['pt-classe-nome', 'pt-classe-adjetivo', 'pt-classe-adverbio']) {
        const ex = gamePack.templates.find((t) => t.id === id)!.generate(seed, d);
        expect(ex.hints[1]).not.toContain(String(correctAnswerOf(ex).value));
      }
    }
  }
});
