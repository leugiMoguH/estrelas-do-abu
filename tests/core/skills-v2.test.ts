import { expect, it, vi } from 'vitest';
import { DAY, emptySkill, updateSkill, sanitizeSkills, type SkillsState } from '../../src/core/skills';
import { buildSession, seededRng } from '../../src/core/session';
import { defaultSave, exportSave, importSave, seenExercise, type Seen } from '../../src/core/save';
import { emptyMastery } from '../../src/core/mastery';
import type { Exercise } from '../../src/core/types';

const pool: Exercise[] = [1, 2, 3].flatMap(difficulty => Array.from({ length: 8 }, (_, i): Exercise => ({
  id: `q${difficulty}-${i}`, conceptId: `k${i}`, competencyId: 'tema', approachId: 'causa', skillId: 'tema:causa', difficulty: difficulty as 1 | 2 | 3,
  ref: { packId: 'p', packVersion: '1', templateId: `q${difficulty}-${i}`, seed: 1, difficulty: difficulty as 1 | 2 | 3 },
  prompt: `Questão ${difficulty} sobre ${i}?`, kind: 'numeric', correctAnswer: 1, hints: [], explanation: '', commonErrors: [], review: 'approved',
})));
it('sessões consecutivas persistem a evidência, sobem após quatro acertos e rodam perguntas', () => {
  let skills: SkillsState = {}, history: Seen[] = [];
  const used = new Set<string>();
  for (let k = 0; k < 3; k++) {
    const s = buildSession({ pool, mode: 'study', n: 2, competencyIds: ['tema'], skills, history, state: {}, rng: seededRng(k), now: k * 1000 });
    expect(s.exercises).toHaveLength(2);
    expect(s.exercises.every(e => e.difficulty === (k < 2 ? 1 : 2))).toBe(true);
    for (const e of s.exercises) {
      expect(used.has(e.id)).toBe(false); used.add(e.id);
      skills = { ...skills, [e.skillId!]: updateSkill(skills[e.skillId!] ?? emptySkill(), { correct: true, difficulty: e.difficulty, hints: 0, conceptId: e.conceptId, now: k * 1000 }) };
      history.push(seenExercise(e, k * 1000));
    }
    skills = sanitizeSkills(JSON.parse(JSON.stringify(skills)));
  }
  expect(skills['tema:causa']!.level).toBe(2);
  const saved = { ...defaultSave(), stars: 45, ownedItems: ['item'], mastery: { tema: emptyMastery() } };
  expect(importSave(exportSave(saved))).toEqual({ ok: true, save: saved });
  expect(JSON.parse(exportSave(saved))).not.toHaveProperty('skills');
});
it('uma competência nova não herda dificuldade de um tema forte; outra competência conserva o nível', () => {
  const state = { tema: { ...emptyMastery(), attempts: 10, streak: 8 } };
  const s = buildSession({ pool, mode: 'study', n: 2, competencyIds: ['tema'], skills: { outra: { ...emptySkill(), level: 3 } }, history: [], state, rng: seededRng(1), now: 0 });
  expect(s.exercises.every(e => e.difficulty === 1)).toBe(true);
});
it('o erro favorece uma alternativa do mesmo conceito e a revisão retoma a competência vencida', () => {
  const first = pool[0]!;
  const alternate = { ...first, id: 'alternative', prompt: 'Outra abordagem do mesmo conceito?' };
  const weak = updateSkill(emptySkill(), { correct: false, difficulty: 1, hints: 0, conceptId: first.conceptId, now: 1 });
  const s = buildSession({ pool: [first, alternate, pool[1]!], mode: 'review', n: 1, competencyIds: ['tema'], skills: { 'tema:causa': weak }, history: [seenExercise(first, 1)], state: {}, rng: seededRng(1), now: 2 * DAY });
  expect(s.exercises[0]!.id).toBe('alternative');
});
it('AppState guarda competências fora do Save e recarrega dados antigos sem perder estrelas', async () => {
  vi.resetModules();
  const data = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => data.set(k, v) });
  vi.stubGlobal('document', { body: { classList: { toggle: () => {} }, style: { setProperty: () => {} } } });
  try {
    const store = await import('../../src/app/store');
    const skills = { 'tema:causa': updateSkill(emptySkill(), { correct: true, difficulty: 1, hints: 0, now: 1 }) };
    store.update({ save: { ...defaultSave(), stars: 17 }, skills });
    expect(JSON.parse(data.get('eda:save:v2')!)).not.toHaveProperty('skills');
    vi.resetModules();
    const restored = await import('../../src/app/store');
    expect(restored.getState().skills).toEqual(skills);
    expect(restored.getState().save.stars).toBe(17);
    // A aplicação antiga ignora propriedades novas do envelope; Save mantém o formato v2.
    const app = JSON.parse(data.get('eda:app:v1')!); delete app.skills; data.set('eda:app:v1', JSON.stringify(app));
    vi.resetModules();
    const old = await import('../../src/app/store');
    expect(old.getState().skills).toEqual({}); expect(old.getState().save.stars).toBe(17);
    old.update({ save: defaultSave(), skills: {} });
    expect(old.getState().skills).toEqual({});
  } finally { vi.unstubAllGlobals(); vi.resetModules(); }
});
