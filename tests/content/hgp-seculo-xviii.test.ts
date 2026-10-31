import { describe, expect, it } from 'vitest';
import factSheet from '../../docs/hgp/seculo-xviii-factos.md?raw';
import { hgpBanks, hgpItems, hgpTemplate } from '../../content/historia';
import { validationOf } from '../../content/historia/validacao';
import { normalize, grade } from '../../src/core/grading';
import { correctAnswerOf } from '../../src/core/content';
import type { HgpSkill } from '../../content/historia/schema';

const items = hgpItems.filter(i => i.topic === 'hgp-seculo-xviii');
const fresh = hgpBanks['./bank-f.ts']!.bank;
const minima: Record<string, number> = {
  'brasil-acucar': 3, 'ouro-diamantes': 3, 'legado-africano': 3,
  'sociedade-ordens': 3, 'monarquia-absoluta': 3, 'd-joao-v': 3,
  'barroco-patrimonio': 3, pombal: 3, 'terramoto-lisboa': 3,
  'novas-culturas': 3, cronologia: 4, fontes: 4, conceitos: 4,
};
const EXCLUIDOS = ['hgp-seculo-xviii-55', 'hgp-seculo-xviii-57', 'hgp-seculo-xviii-66', 'hgp-seculo-xviii-67'];
const skills: readonly HgpSkill[] = [
  'facto', 'causa', 'consequencia', 'cronologia', 'comparacao', 'fonte',
  'mapa', 'vf', 'personagem', 'conceito', 'opiniao',
];
const textOf = (i: typeof items[number]) => [
  i.prompt, i.stimulus ?? '', ...i.hints, i.explanation,
  ...(i.kind === 'mcq' ? [...i.options, ...Object.values(i.wrong)] :
    i.kind === 'order' ? [...i.items] : i.kind === 'cloze' ? i.correct.flat() : Object.values(i.wrongHints ?? {})),
].join(' ');

describe('Portugal no século XVIII — preparação temática, sem reprodução do manual', () => {
  it('tem 70 itens, 56 novos e cobertura de todos os subtemas', () => {
    expect(items.length).toBeGreaterThanOrEqual(70);
    expect(fresh.items.length).toBeGreaterThanOrEqual(56);
    expect(fresh.lessons).toHaveLength(0);
    const lessons = Object.values(hgpBanks).flatMap(b => b.bank.lessons).filter(l => l.topic === 'hgp-seculo-xviii');
    expect(lessons).toHaveLength(1);
    for (const [sub, min] of Object.entries(minima))
      expect(items.filter(i => i.sub === sub).length, sub).toBeGreaterThanOrEqual(min);
    for (const skill of skills) expect(items.some(i => i.skill === skill), skill).toBe(true);
    for (const difficulty of [1, 2, 3]) {
      const proportion = items.filter(i => i.difficulty === difficulty).length / items.length;
      expect(proportion).toBeGreaterThanOrEqual(difficulty === 2 ? 0.3 : 0.2);
      expect(proportion).toBeLessThanOrEqual(difficulty === 2 ? 0.5 : 0.4);
    }
    expect(fresh.items.filter(i => i.kind === 'mcq').length).toBeGreaterThan(fresh.items.length / 2);
    for (const [kind, min] of [['order', 6], ['cloze', 6], ['numeric', 3]] as const)
      expect(fresh.items.filter(i => i.kind === kind).length, kind).toBeGreaterThanOrEqual(min);
  });

  it('mantém ≥60 itens ativos nas sessões e exclui só os de apoio parcial', () => {
    const ativos = items.filter(i => validationOf(i.id) !== 'a-confirmar');
    expect(ativos.length).toBeGreaterThanOrEqual(60);
    expect(items.length - ativos.length).toBe(EXCLUIDOS.length);
    for (const id of EXCLUIDOS) expect(ativos.some(i => i.id === id)).toBe(false);
  });

  it('usa URLs literais da ficha, ids novos e fontes locais em todos os itens novos', () => {
    const ids = new Set(fresh.sources.map(s => s.id));
    expect(ids.size).toBe(fresh.sources.length);
    const others = Object.entries(hgpBanks).filter(([name]) => name !== './bank-f.ts').flatMap(([, b]) => b.bank.sources);
    for (const source of fresh.sources) {
      expect(factSheet).toContain(`](${source.url})`);
      expect(source.accessed).toBe('2026-10-31');
      expect(others.some(s => s.id === source.id)).toBe(false);
    }
    fresh.items.forEach((item, index) => {
      expect(item.id).toBe(`hgp-seculo-xviii-${index + 15}`);
      expect(item.sources.length).toBeGreaterThan(0);
      item.sources.forEach(id => expect(ids.has(id), `${item.id}: ${id}`).toBe(true));
      // Versão provisória: só estes itens ficam fora das sessões (apoio factual parcial); nenhum outro pode estar «a-confirmar».
      expect(validationOf(item.id) === 'a-confirmar', item.id).toBe(EXCLUIDOS.includes(item.id));
      expect(item.hints.length).toBeGreaterThanOrEqual(2);
      // Não conta pontos de abreviaturas como D. ou F.; as frases terminam aqui em ponto.
      const sentences = item.explanation.replace(/D\./g, 'D').split(/\.\s+|\.$/).filter(Boolean);
      expect(sentences.length, item.id).toBeGreaterThanOrEqual(3);
      expect(sentences.length, item.id).toBeLessThanOrEqual(5);
      if (item.sub === 'fontes') expect(item.stimulus?.trim().length).toBeGreaterThan(20);
    });
    expect(new Set(items.map(i => normalize(i.prompt))).size).toBe(items.length);
  });

  it('exclui matéria discutida e pormenores sem confirmação', () => {
    const forbidden = /feijoada|\bsinos\b|enterrar os mortos|\b(?:10[ .]?000|60[ .]?000)\s+(?:mortos|vítimas)|(?:mortos|vítimas)\s*:\s*\d|(?:inventor|inventou)\s+(?:d[ao]\s+)?gaiola|(?:mais antiga|primeira do mundo).*região demarcada|região demarcada.*mais antiga|(?:Borba Gato)|\b(?:12|13) de janeiro de 1759|\b(?:22 de outubro|7 de novembro) de 1716/i;
    for (const item of items) {
      const text = textOf(item);
      expect(text, item.id).not.toMatch(forbidden);
      // Não há itens sobre Methuen: evita transformar a interpretação contestada em resposta.
      expect(text, item.id).not.toMatch(/Methuen|ouro.{0,60}(?:foi|pagou).{0,30}Inglaterra/i);
      expect(text, item.id).not.toMatch(/(?:motivo|motivação).{0,60}(?:humanitári|económic)/i);
    }
  });

  it('mantém datas-chave e cálculos coerentes com a ficha', () => {
    const allText = items.map(textOf).join(' ');
    expect(allText).toContain('1 de novembro de 1755');
    const year = items.find(i => i.id === 'hgp-seculo-xviii-10')!;
    expect(year.kind === 'numeric' && year.correct).toBe(1755);
    const jesuits = items.find(i => i.id === 'hgp-seculo-xviii-11')!;
    expect(jesuits.kind === 'numeric' && jesuits.correct).toBe(1759);
    for (const item of items) {
      const text = textOf(item);
      if (/1755/.test(text)) expect(text, item.id).toContain('1 de novembro de 1755');
      expect(text, item.id).not.toMatch(/(?:2|31) de novembro de 1755/);
    }
    const calculations = fresh.items.filter(i => i.kind === 'numeric');
    expect(calculations.map(i => i.correct)).toEqual([150 * 20 / 100, 1750 - 1706, 1728 - 1717]);
  });

  it('a seed baralha opções e mantém a resposta e o feedback corretos', () => {
    for (const item of items) {
      const template = hgpTemplate(item);
      const positions = new Set<number>();
      for (const seed of [1, 42, 103, 12345, 98765, 123456789, 987654321, 2147483647]) {
        const ex = template.generate(seed, item.difficulty);
        expect(ex).toEqual(template.generate(seed, item.difficulty));
        expect(grade(ex, correctAnswerOf(ex))).toMatchObject({ correct: true });
        if (ex.kind === 'mcq' && item.kind === 'mcq') positions.add(ex.options.indexOf(item.correct));
      }
      if (item.kind === 'mcq') {
        expect([...positions].some(p => p > 0), item.id).toBe(true);
        expect(positions.size, item.id).toBeGreaterThan(1);
        expect(Object.keys(item.wrong).sort()).toEqual(item.options.filter(o => o !== item.correct).sort());
        for (const feedback of Object.values(item.wrong)) expect(feedback.length).toBeGreaterThan(25);
      }
    }
  });
});
