import { describe, it, expect } from 'vitest';
import matrizRaw from '../../docs/audit/matriz-curricular.json?raw';
import { hgpItems, HGP_SOURCES } from '../../content/historia';
import { hgpTopics } from '../../content/historia/topics';
import { HGP_A_CONFIRMAR } from '../../content/historia/validacao';
import { gamePack } from '../../content';
import { materialize } from '../../src/core/content';
import { buildSession, seededRng } from '../../src/core/session';
import type { Mastery, MasteryState } from '../../src/core/mastery';

const SHORT: Record<string, string> = {
  xviii: 'hgp-seculo-xviii', liberalismo: 'hgp-liberalismo', 'xix-segunda-metade': 'hgp-xix-segunda-metade', republica: 'hgp-republica',
  ditadura: 'hgp-ditadura', '25-abril': 'hgp-25-abril', populacao: 'hgp-populacao', lugares: 'hgp-lugares', atividades: 'hgp-atividades',
  lazer: 'hgp-lazer', mundo: 'hgp-mundo',
};
const topicIds = hgpTopics.map((t) => t.id);
const DAY = 86_400_000;
const NOW = Date.UTC(2026, 9, 31);

const mastery = (over: Partial<Mastery>): Mastery => ({
  attempts: 5, correct: 3, hintsUsed: 0, lastSeen: NOW - 30 * DAY, streak: 0, level: 'practising', recent: [true, false], recentHints: [0, 0], reviewStep: 0, ...over,
});
const stateFor = (m: Mastery): MasteryState => Object.fromEntries(topicIds.map((id) => [id, m]));

const poolFor = (state: MasteryState, ids: readonly string[] = topicIds, seed = 7) => {
  const rng = seededRng(seed);
  return materialize(gamePack, {
    competencyIds: ids, rng, perTemplate: 4,
    difficultyFor: (template) => {
      const m = state[template.competencyId];
      const target = !m || m.attempts < 3 ? 1 : m.streak >= 3 ? 3 : 2;
      return [...template.difficulties].sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0]!;
    },
  });
};
const session = (mode: 'study' | 'test' | 'review', state: MasteryState, ids: readonly string[], n: number, seed: number) =>
  buildSession({ mode, pool: poolFor(state, ids, seed), competencyIds: ids, n, state, rng: seededRng(seed), now: NOW, history: [] });
const mean = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

describe('auditoria pedagógica HGP', () => {
  it('a matriz curricular só refere itens que existem e todos os itens têm fonte registada', () => {
    const matriz = JSON.parse(matrizRaw) as { descritores: { id: string; t: string; e: string; i: string[] }[] };
    const ids = new Set(hgpItems.map((i) => i.id));
    for (const d of matriz.descritores)
      for (const ref of d.i) {
        const [t, n] = ref.split(':');
        expect(ids.has(`${SHORT[t!]}-${String(n).padStart(2, '0')}`), `${d.id} → ${ref}`).toBe(true);
      }
    for (const d of matriz.descritores.filter((x) => x.e === 'C')) expect(d.i.length, `${d.id} «Coberto» exige ≥2 itens`).toBeGreaterThanOrEqual(2);
    for (const d of matriz.descritores.filter((x) => x.e === 'N')) expect(d.i, `${d.id} «Não coberto» não pode ter itens`).toEqual([]);
    const registered = new Set(HGP_SOURCES.map((s) => s.id));
    expect(HGP_SOURCES.every((s) => s.url.startsWith('https://')), 'fontes com https').toBe(true);
    for (const i of hgpItems) for (const s of i.sources) expect(registered.has(s), `${i.id}: ${s}`).toBe(true);
  });

  it('Estudar adapta a dificuldade ao perfil: fraco < intermédio < forte', () => {
    const ids = topicIds;
    const weak = mastery({ recent: [false, false], streak: 0 });
    const mid = mastery({ recent: [true, false], streak: 1 });
    const strong = mastery({ recent: [true, true, true], streak: 4, correct: 5 });
    const diff = (m: Mastery) => mean([1, 2, 3, 4, 5].flatMap((seed) => session('study', stateFor(m), ids, 8, seed).exercises.map((e) => e.difficulty)));
    const [w, m, s] = [diff(weak), diff(mid), diff(strong)];
    expect(w).toBeLessThan(m);
    expect(m).toBeLessThan(s);
  });

  it('Teste não dá pistas e Rever só escolhe temas com revisão pendente', () => {
    const test = session('test', stateFor(mastery({})), topicIds, 8, 3);
    expect(test.hintsEnabled).toBe(false);
    expect(test.exercises.every((e) => e.hints.length === 0)).toBe(true);
    const due = ['hgp-republica', 'hgp-lugares', 'hgp-mundo'];
    const state: MasteryState = Object.fromEntries(topicIds.map((id) => [id, due.includes(id) ? mastery({ lastSeen: NOW - 40 * DAY }) : mastery({ lastSeen: NOW })]));
    const review = session('review', state, topicIds, 6, 4);
    expect(review.exercises.length).toBe(6);
    expect(review.exercises.every((e) => due.includes(e.competencyId))).toBe(true);
  });

  it('o teste distribui as perguntas pelos temas escolhidos, sem favorecer um tema', () => {
    const state = stateFor(mastery({}));
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const four = topicIds.slice(0, 4);
      const per4 = session('test', state, four, 8, seed).exercises.map((e) => e.competencyId);
      expect(new Set(per4).size, 'cobre os 4 temas').toBe(4);
      for (const t of four) expect(per4.filter((x) => x === t).length).toBeLessThanOrEqual(3);
      const all = session('test', state, topicIds, 12, seed).exercises.map((e) => e.competencyId);
      for (const t of topicIds) expect(all.filter((x) => x === t).length).toBeLessThanOrEqual(2);
      expect(new Set(all.map((x) => x)).size, 'sem repetir tema antes de cobrir os outros').toBeGreaterThanOrEqual(8);
    }
  });

  it('itens a confirmar nunca entram nas sessões', () => {
    for (const mode of ['study', 'test'] as const)
      for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
        const ids = session(mode, stateFor(mastery({})), topicIds, 12, seed).exercises.map((e) => e.id);
        for (const id of HGP_A_CONFIRMAR) expect(ids).not.toContain(id);
      }
    expect(HGP_A_CONFIRMAR.length).toBeGreaterThan(0);
  });

  it('um teste não repete a mesma pergunta nem o mesmo enunciado', () => {
    const ex = session('test', stateFor(mastery({})), topicIds, 12, 9).exercises;
    expect(new Set(ex.map((e) => e.id)).size).toBe(ex.length);
    expect(new Set(ex.map((e) => e.prompt)).size).toBe(ex.length);
  });
});
