import { describe, expect, it } from 'vitest';
import ficha from '../../docs/hgp/seculo-xviii-factos.md?raw';
import evidence from '../../content/kb/historia/xviii-evidencia.json';
import { XVIII_ATOMS } from '../../content/kb/historia/xviii.atoms';
import { XVIII_EXERCISES } from '../../content/kb/historia/xviii';
import { checkAtoms, checkExercises, coverage, type Evidence } from '../../content/kb/qa';
import { gamePack, hgpItemSection } from '../../content';
import { hgpItems } from '../../content/historia';
import { materialize } from '../../src/core/content';
import { buildSession, seededRng } from '../../src/core/session';
import { exerciseSignature, normalize } from '../../src/core/grading';
import type { Seen } from '../../src/core/save';
import type { Exercise } from '../../src/core/types';

const EV = evidence as unknown as Record<string, Evidence>;
const words = (s: string) => new Set(normalize(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 4));
const jaccard = (a: Set<string>, b: Set<string>) => [...a].filter((x) => b.has(x)).length / (new Set([...a, ...b]).size || 1);

describe('fábrica de conhecimento — Portugal no século XVIII', () => {
  it('cada átomo liga-se a factos CONFIRMADOS da ficha (≥2 fontes) que contêm a resposta', () => {
    const r = checkAtoms(XVIII_ATOMS, EV);
    expect(r.errors).toEqual([]);
    expect(r.warnings).toEqual([]);
  });

  it('a evidência extraída corresponde ao texto da ficha factual', () => {
    for (const f of new Set(XVIII_ATOMS.flatMap((a) => a.fichas))) {
      const line = ficha.split('\n').find((l) => l.startsWith(`- **${f}.**`));
      expect(line, f).toBeTruthy();
      expect(line, f).toContain('CONFIRMADO');
      for (const s of EV[f]!.sources) expect(line!.includes(s.url) || ficha.includes(s.url), `${f}: ${s.url}`).toBe(true);
    }
  });

  it('controlo de qualidade: sem erros (estrutura, respostas, ambiguidade, repetições, explicações, dificuldade)', () => {
    const r = checkExercises(XVIII_EXERCISES, XVIII_ATOMS);
    expect(r.errors).toEqual([]);
    expect(r.warnings).toEqual([]);
  });

  it('produz ≥100 exercícios de foco distinto, nos três níveis e em todos os subcapítulos principais', () => {
    const c = coverage(XVIII_EXERCISES);
    expect(c.distinctFocus).toBeGreaterThanOrEqual(100);
    expect(c.knowledgeCovered).toBe(XVIII_ATOMS.length);
    for (const level of [1, 2, 3]) expect(c.byLevel[level], `nível ${level}`).toBeGreaterThanOrEqual(level === 3 ? 30 : 40);
    for (const sub of ['ouro-diamantes', 'sociedade-ordens', 'monarquia-joao-v', 'barroco-patrimonio', 'pombal-lisboa', 'brasil-acucar'])
      for (const level of [1, 2, 3]) expect(c.bySub[sub]?.[level] ?? 0, `${sub} nível ${level}`).toBeGreaterThanOrEqual(1);
    for (const sub of Object.keys(c.bySub)) expect(Object.values(c.bySub[sub]!).reduce((a, b) => a + b, 0) / c.total, sub).toBeLessThanOrEqual(0.4);
    for (const r of ['reconhecer', 'verificar', 'recordar', 'calcular', 'ordenar', 'comparar', 'classificar', 'inferir'])
      expect(c.byReasoning[r] ?? 0, r).toBeGreaterThan(0);
  });

  it('os exercícios gerados não repetem nem equivalem a perguntas escritas à mão', () => {
    const old = hgpItems.filter((i) => i.topic === 'hgp-seculo-xviii' && !i.kb);
    const generated = hgpItems.filter((i) => i.kb && i.kb.template === 'reconhecer-mcq');
    const clashes: string[] = [];
    for (const g of generated)
      for (const o of old) {
        const same = o.kind === 'mcq' && g.kind === 'mcq' && normalize(o.correct) === normalize(g.correct);
        if (same && jaccard(words(g.prompt), words(o.prompt)) >= 0.6) clashes.push(`${g.id} ~ ${o.id}`);
      }
    expect(clashes, 'perguntas geradas equivalentes às existentes').toEqual([]);
  });

  it('os exercícios entram nos subcapítulos do manual e usam fontes existentes', () => {
    const sources = new Set(hgpItems.filter((i) => i.kb).flatMap((i) => i.sources));
    expect(sources.size).toBeGreaterThan(40);
    for (const i of hgpItems.filter((x) => x.kb)) {
      expect(hgpItemSection(i.id), i.id).toMatch(/^d1-/);
      expect(i.sources.length, i.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('sessões consecutivas dos subcapítulos escolhidos: sem repetir o mesmo conhecimento na sessão e com rotação', () => {
    const chosen = ['d1-ouro-diamantes', 'd1-sociedade-ordens', 'd1-monarquia-joao-v', 'd1-pombal-lisboa'];
    const pool = (seed: number) =>
      materialize(gamePack, { competencyIds: ['hgp-seculo-xviii'], rng: seededRng(seed), perTemplate: 4, difficultyFor: (t) => t.difficulties[0]! }).filter((e) => chosen.includes(hgpItemSection(e.id) ?? ''));
    const seenOf = (e: Exercise, at: number): Seen => ({ ref: {} as Seen['ref'], signature: exerciseSignature(e), competencyId: e.competencyId, conceptId: e.conceptId ?? '', approachId: e.approachId ?? '', format: e.kind, at });
    let history: Seen[] = [];
    const sessions: string[][] = [];
    const sectionShare: Record<string, number> = {};
    for (let k = 0; k < 8; k++) {
      const s = buildSession({ mode: 'study', n: 10, history, competencyIds: ['hgp-seculo-xviii'], state: {}, rng: seededRng(500 + k), now: 0, pool: pool(500 + k),
        groupOf: (e) => hgpItemSection(e.id) ?? e.competencyId, recentWindow: 60, repeatPenalty: 40 });
      const ex = s.exercises;
      expect(new Set(ex.map((e) => normalize(e.prompt))).size).toBe(ex.length);
      const focus = ex.map((e) => e.conceptId);
      expect(new Set(focus).size, `sessão ${k}: mesmo conhecimento repetido`).toBeGreaterThanOrEqual(ex.length - 1);
      for (const e of ex) sectionShare[hgpItemSection(e.id)!] = (sectionShare[hgpItemSection(e.id)!] ?? 0) + 1;
      sessions.push(ex.map((e) => e.id));
      history = [...history, ...ex.map((e, i) => seenOf(e, k * 20 + i))];
    }
    expect(new Set(sessions.flat()).size, JSON.stringify(sessions.map((s) => s.map((i) => i.replace('hgp-seculo-xviii-k-', ''))))).toBeGreaterThanOrEqual(70);
    for (const id of chosen) expect(sectionShare[id] ?? 0, id).toBeGreaterThanOrEqual(8);
  });
});
