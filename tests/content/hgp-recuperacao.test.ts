import { describe, expect, it } from 'vitest';
import { gamePack, hgpSectionInfo, hgpItemSection, HGP_CHAPTERS } from '../../content';
import { hgpBanks, hgpItems, hgpLessons } from '../../content/historia';
import { validationOf } from '../../content/historia/validacao';
import { materialize } from '../../src/core/content';
import { buildSession, seededRng } from '../../src/core/session';
import { normalize } from '../../src/core/grading';
import type { Seen } from '../../src/core/save';
import type { Exercise } from '../../src/core/types';

const TOPIC = 'hgp-recuperacao-5';
const items = hgpItems.filter((i) => i.topic === TOPIC);
const ativos = items.filter((i) => validationOf(i.id) !== 'a-confirmar');
const sections = HGP_CHAPTERS.find((c) => c.id === 'rec5')!.sections;
const bank = hgpBanks['./bank-g.ts']!.bank;

const pool = (seed: number) =>
  materialize(gamePack, { competencyIds: [TOPIC], rng: seededRng(seed), perTemplate: 4, difficultyFor: (t) => t.difficulties[0]! });
const seenOf = (e: Exercise, at: number): Seen =>
  ({ ref: {} as Seen['ref'], signature: normalize(e.prompt), competencyId: e.competencyId, conceptId: e.conceptId ?? '', approachId: e.approachId ?? '', format: e.kind, at });
const run = (chosen: readonly string[], history: readonly Seen[], seed: number, n = 8, mode: 'study' | 'test' | 'review' = 'study') =>
  buildSession({
    mode, n, history, competencyIds: [TOPIC], state: {}, rng: seededRng(seed), now: 0,
    pool: pool(seed).filter((e) => chosen.includes(hgpItemSection(e.id) ?? '')),
    groupOf: (e) => hgpItemSection(e.id) ?? e.competencyId,
    recentWindow: 60,
    repeatPenalty: 40,
  });
const tokens = (s: string) => new Set(normalize(s).split(/\s+/).filter((w) => w.length > 3));
const jaccard = (a: Set<string>, b: Set<string>) => [...a].filter((x) => b.has(x)).length / new Set([...a, ...b]).size;

describe('Recuperar aprendizagens — 5.º ano', () => {
  it('tem 8 subcapítulos, cada um com lição e ≥3 perguntas ativas; 56 itens, 1 excluído', () => {
    expect(sections).toHaveLength(8);
    expect(items).toHaveLength(56);
    expect(ativos).toHaveLength(55);
    for (const s of sections) {
      const info = hgpSectionInfo(s.id);
      expect(info.lesson, s.id).toBe(true);
      expect(info.functional, s.id).toBe(true);
      expect(info.active, s.id).toBeGreaterThanOrEqual(3);
    }
    const lesson = hgpLessons.find((l) => l.id === TOPIC)!;
    expect(lesson.sections?.map((s) => s.id).sort()).toEqual(sections.map((s) => s.id).sort());
  });

  it('todos os itens têm fonte registada, dificuldades e tipos variados', () => {
    const ids = new Set(bank.sources.map((s) => s.id));
    for (const i of items) {
      expect(i.sources.length, i.id).toBeGreaterThan(0);
      for (const s of i.sources) expect(ids.has(s), `${i.id}:${s}`).toBe(true);
    }
    expect(new Set(items.map((i) => i.difficulty))).toEqual(new Set([1, 2, 3]));
    for (const k of ['mcq', 'numeric', 'cloze', 'order']) expect(items.some((i) => i.kind === k), k).toBe(true);
  });

  it('não há perguntas repetidas nem semanticamente equivalentes (prompt com sobreposição ≥ 0,8)', () => {
    const t = ativos.map((i) => ({ id: i.id, t: tokens(i.prompt) }));
    for (let a = 0; a < t.length; a++)
      for (let b = a + 1; b < t.length; b++)
        expect(jaccard(t[a]!.t, t[b]!.t), `${t[a]!.id} ~ ${t[b]!.id}`).toBeLessThan(0.8);
  });

  it('exclui das sessões os itens a confirmar', () => {
    for (let seed = 1; seed <= 5; seed++)
      expect(run(sections.map((s) => s.id), [], seed, 20).exercises.some((e) => e.id === 'hgp-recuperacao-5-47')).toBe(false);
  });

  it('distribui as perguntas pelos subcapítulos escolhidos', () => {
    const chosen = ['rec5-expansao', 'rec5-filipes', 'rec5-restauracao-1640'];
    for (let seed = 1; seed <= 6; seed++) {
      const got = run(chosen, [], seed, 6).exercises.map((e) => hgpItemSection(e.id));
      expect(new Set(got), `seed ${seed}`).toEqual(new Set(chosen));
      for (const c of chosen) expect(got.filter((g) => g === c).length, c).toBe(2);
    }
  });

  it('um subcapítulo só traz as suas perguntas', () => {
    const got = run(['rec5-crise-1580'], [], 3, 5).exercises;
    expect(got.length).toBeGreaterThanOrEqual(3);
    for (const e of got) expect(hgpItemSection(e.id)).toBe('rec5-crise-1580');
  });

  it('sessões consecutivas: sem prompts repetidos na sessão e com rotação entre sessões', () => {
    const all = sections.map((s) => s.id);
    let history: Seen[] = [];
    const sessions: string[][] = [];
    for (let k = 0; k < 6; k++) {
      const ex = run(all, history, 100 + k, 8).exercises;
      const prompts = ex.map((e) => normalize(e.prompt));
      expect(new Set(prompts).size, `sessão ${k}`).toBe(prompts.length);
      sessions.push(ex.map((e) => e.id));
      history = [...history, ...ex.map((e, i) => seenOf(e, k * 10 + i))];
    }
    // 6 sessões × 8 perguntas = 48 ≤ 55 ativas: cobertura ampla, repetições mínimas
    const distinct = new Set(sessions.flat());
    expect(distinct.size, JSON.stringify(sessions)).toBeGreaterThanOrEqual(40);
    expect(new Set(sessions[0]).size).toBe(8);
    const overlap = sessions[1]!.filter((id) => sessions[0]!.includes(id)).length;
    expect(overlap).toBeLessThanOrEqual(1);
  });

  it('modo Rever e Teste devolvem perguntas do subcapítulo escolhido', () => {
    for (const mode of ['review', 'test'] as const) {
      const r = buildSession({
        mode, n: 4, history: [], competencyIds: [TOPIC], now: Date.now(), rng: seededRng(9),
        state: { [TOPIC]: { attempts: 5, correct: 2, hintsUsed: 0, lastSeen: 0, streak: 0, level: 'review', recent: [false, false], recentHints: [0, 0], reviewStep: 0 } },
        pool: pool(9).filter((e) => hgpItemSection(e.id) === 'rec5-xv-xvi'),
        groupOf: (e) => hgpItemSection(e.id) ?? e.competencyId,
      });
      expect(r.exercises.length, mode).toBeGreaterThan(0);
      for (const e of r.exercises) expect(hgpItemSection(e.id)).toBe('rec5-xv-xvi');
    }
  });
});
