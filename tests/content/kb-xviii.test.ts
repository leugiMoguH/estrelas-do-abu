const fsModule = 'node:fs';
const { writeFileSync } = await import(fsModule) as { writeFileSync(path: string, data: string): void };
import { RUBRIC } from '../../content/kb/reasoning';
import { XVIII_EVIDENCE, XVIII_VERDICTS, eligibleExercise } from '../../content/kb/historia/xviii.validation';
import { validationOf } from '../../content/historia/validacao';
import { describe, expect, it } from 'vitest';
import ficha from '../../docs/hgp/seculo-xviii-factos.md?raw';
import evidence from '../../content/kb/historia/xviii-evidencia.json';
import { XVIII_ATOMS } from '../../content/kb/historia/xviii.atoms';
import { XVIII_EXERCISES } from '../../content/kb/historia/xviii';
import { checkAtoms, checkExercises, coverage } from '../../content/kb/qa';
import { gamePack, hgpItemSection } from '../../content';
import { hgpItems } from '../../content/historia';
import { materialize } from '../../src/core/content';
import { buildSession, seededRng } from '../../src/core/session';
import { exerciseSignature, normalize } from '../../src/core/grading';
import type { Seen } from '../../src/core/save';
import type { Exercise } from '../../src/core/types';

const EV = XVIII_EVIDENCE;
const words = (s: string) => new Set(normalize(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 4));
const jaccard = (a: Set<string>, b: Set<string>) => [...a].filter((x) => b.has(x)).length / (new Set([...a, ...b]).size || 1);

describe('fábrica de conhecimento — Portugal no século XVIII', () => {
  it('cada átomo liga-se a factos CONFIRMADOS da ficha (≥2 fontes) que contêm a resposta', () => {
    const r = checkAtoms(XVIII_ATOMS, EV);
    expect(r.errors).toEqual([]);
    expect(r.warnings.every(w => w.includes('revisto') || w.includes('pendente'))).toBe(true);
  });

  it('preserva a ficha parcial e usa revisões contextualizadas por átomo', () => {
    for (const f of ['F59', 'F61', 'F63', 'F94']) expect(evidence[f as keyof typeof evidence].status).toBe('parcial');
    expect(ficha).toContain('1821');
    for (const a of XVIII_ATOMS) {
      expect(EV[`A:${a.id}`] ?? EV[a.fichas[0]!], a.id).toBeTruthy();
      expect(XVIII_VERDICTS[a.id]).toBeTruthy();
    }
  });

  it('controlo de qualidade: sem erros (estrutura, respostas, ambiguidade, repetições, explicações, dificuldade)', () => {
    const r = checkExercises(XVIII_EXERCISES, XVIII_ATOMS);
    expect(r.errors).toEqual([]);
    // Alertas lexicais são pistas para leitura, não condenações factuais automáticas.
    writeFileSync('docs/hgp/fabrica/qa.json', JSON.stringify(r, null, 2) + '\n');
  });

  it('cobre os conhecimentos sem fabricar níveis avançados e exclui pendentes das sessões', () => {
    const c = coverage(XVIII_EXERCISES);
    expect(c.knowledgeCovered).toBe(XVIII_ATOMS.length);
    for (const e of XVIII_EXERCISES) expect(RUBRIC[e.template], e.id).toContain(e.level);
    for (const t of ['processo-causa', 'processo-consequencia', 'afirmacao-evidencia', 'documento-resumo', 'mapa', 'ordenar-tematico']) expect(c.byTemplate[t]).toBeGreaterThan(0);
    expect(c.byReasoning.calcular).toBeUndefined();
    for (const t of gamePack.templates.filter(t => t.id.startsWith('hgp-seculo-xviii-k-'))) {
      const e = XVIII_EXERCISES.find(e => `hgp-seculo-xviii-k-${e.id.replace(/\./g, '-')}` === t.id)!;
      expect(t.review === 'approved', t.id).toBe(eligibleExercise(e));
    }
    const active = XVIII_EXERCISES.filter(eligibleExercise);
    expect(active.length).toBeGreaterThan(200);
    expect(checkExercises(active, XVIII_ATOMS).errors).toEqual([]);
    for (const [skill, n] of Object.entries(coverage(active).bySkill)) expect(n / active.length, skill).toBeLessThanOrEqual(0.45);
    writeFileSync('docs/hgp/fabrica/cobertura.json', JSON.stringify({ all: c, eligible: coverage(active), verdicts: XVIII_VERDICTS }, null, 2) + '\n');
    writeFileSync('docs/hgp/fabrica/itens.json', JSON.stringify(hgpItems.filter(i => i.topic === 'hgp-seculo-xviii').map(i => ({ ...i, secao: hgpItemSection(i.id), validacao: validationOf(i.id), nivel: i.difficulty, origem: i.kb ? 'fabrica-v2' : 'manual' })), null, 2) + '\n');
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
