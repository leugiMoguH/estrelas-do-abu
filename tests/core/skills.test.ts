import { describe, expect, it } from 'vitest';
import { emptySkill, sanitizeSkills, skillDue, skillStatus, updateSkill, DAY, type Skill } from '../../src/core/skills';
import { buildSession, seededRng } from '../../src/core/session';
import type { Exercise } from '../../src/core/types';

const T0 = 1_700_000_000_000;
const run = (s: Skill, results: readonly [boolean, number, number?][], concept = 'k1'): Skill =>
  results.reduce((acc, [correct, difficulty, hints], i) => updateSkill(acc, { correct, difficulty, hints: hints ?? 0, conceptId: concept, now: T0 + i * 1000 }), s);

describe('progressão por competência', () => {
  it('uma só resposta certa não prova domínio; só a evidência repetida ao nível atual promove', () => {
    expect(run(emptySkill(), [[true, 1]]).level).toBe(1);
    expect(run(emptySkill(), [[true, 1], [true, 1], [true, 1]]).level).toBe(1);
    const four = run(emptySkill(), [[true, 1], [true, 1], [true, 1], [true, 1]]);
    expect(four.level).toBe(2);
    expect(four.atLevel).toEqual([]);
  });

  it('acertos com muita ajuda ou abaixo do nível não contam como evidência', () => {
    const helped = run(emptySkill(), [[true, 1, 2], [true, 1, 3], [true, 1, 2], [true, 1, 2], [true, 1, 2]]);
    expect(helped.level).toBe(1);
    const easy = run({ ...emptySkill(), level: 2 }, [[true, 1], [true, 1], [true, 1], [true, 1]]);
    expect(easy.level).toBe(2);
  });

  it('tolera um erro ocasional (4 em 5) mas despromove após três erros seguidos ao nível', () => {
    const ok = run(emptySkill(), [[true, 1], [true, 1], [false, 1], [true, 1], [true, 1], [true, 1]]);
    expect(ok.level).toBe(2);
    const down = run({ ...emptySkill(), level: 2 }, [[false, 2], [false, 2], [false, 2]]);
    expect(down.level).toBe(1);
    expect(run({ ...emptySkill(), level: 1 }, [[false, 1], [false, 1], [false, 1]]).level).toBe(1);
  });

  it('distingue erro ocasional de dificuldade persistente', () => {
    expect(skillStatus(undefined)).toBe('novo');
    expect(skillStatus(run(emptySkill(), [[true, 1], [true, 1], [true, 1], [true, 1], [false, 1]]))).toBe('ocasional');
    expect(skillStatus(run(emptySkill(), [[false, 1], [true, 1], [false, 1], [false, 1], [true, 1], [false, 1]]))).toBe('persistente');
  });

  it('guarda conhecimentos falhados e esquece-os após dois acertos', () => {
    let s = run(emptySkill(), [[false, 1]], 'terramoto');
    expect(s.weak.map((w) => w.concept)).toEqual(['terramoto']);
    s = run(s, [[true, 1]], 'terramoto');
    expect(s.weak).toHaveLength(1);
    s = run(s, [[true, 1]], 'terramoto');
    expect(s.weak).toHaveLength(0);
  });

  it('revisão espaçada: intervalos crescem com os acertos e voltam atrás com o erro', () => {
    const s = run(emptySkill(), [[true, 1]]);
    expect(skillDue(s, T0 + 3600_000)).toBe(false);
    expect(skillDue(s, T0 + 2 * DAY)).toBe(true);
    const s2 = run(s, [[true, 1]]);
    expect(skillDue(s2, T0 + 2 * DAY)).toBe(false);
    expect(skillDue(s2, T0 + 4 * DAY)).toBe(true);
    expect(run(s2, [[false, 1]]).reviewStep).toBe(0);
  });

  it('lê estado guardado de forma defensiva (dados antigos, ausentes ou corrompidos)', () => {
    expect(sanitizeSkills(undefined)).toEqual({});
    expect(sanitizeSkills([1, 2])).toEqual({});
    const good = run(emptySkill(), [[true, 1], [false, 1]]);
    const out = sanitizeSkills({ 'a:b': good, '__proto__': good, bad: { attempts: -1 }, worse: 'x', 'c:d': { ...good, level: 9 } });
    expect(Object.keys(out)).toEqual(['a:b']);
    expect(out['a:b']).toEqual(good);
    expect(sanitizeSkills(JSON.parse(JSON.stringify({ x: good })))).toEqual({ x: good });
  });
});

const ex = (id: string, difficulty: 1 | 2 | 3, concept: string, skillId = 'tema:causa'): Exercise =>
  ({ id, competencyId: 'tema', difficulty, prompt: `pergunta ${id}`, hints: [], explanation: '', kind: 'numeric', correctAnswer: 1, tolerance: 0, units: [], conceptId: concept, approachId: 'causa', skillId, review: 'approved' }) as unknown as Exercise;

describe('seleção com competências', () => {
  const pool = [ex('a1', 1, 'c1'), ex('a2', 1, 'c2'), ex('b1', 2, 'c3'), ex('b2', 2, 'c4'), ex('c1', 3, 'c5'), ex('c2', 3, 'c6')];
  const pick = (skills: Record<string, Skill>, n = 2) =>
    buildSession({ mode: 'study', n, pool, competencyIds: ['tema'], state: {}, rng: seededRng(1), now: T0, history: [], skills }).exercises.map((e) => e.id);

  it('sem registo da competência mantém o comportamento por tema (nível 1)', () => {
    expect(pick({}).every((id) => id.startsWith('a'))).toBe(true);
  });
  it('a exigência segue o nível da competência', () => {
    expect(pick({ 'tema:causa': { ...emptySkill(), attempts: 6, correct: 5, level: 3 } }).every((id) => id.startsWith('c'))).toBe(true);
    expect(pick({ 'tema:causa': { ...emptySkill(), attempts: 6, correct: 5, level: 2 } }).every((id) => id.startsWith('b'))).toBe(true);
  });
  it('reforça o conhecimento falhado com um exercício diferente', () => {
    const weak: Skill = { ...emptySkill(), attempts: 3, correct: 2, level: 1, recent: [true, false, true], weak: [{ concept: 'c2', at: T0 - 10_000, ok: 0 }] };
    expect(pick({ 'tema:causa': weak }, 1)).toEqual(['a2']);
  });
});
