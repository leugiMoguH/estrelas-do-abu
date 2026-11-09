import { afterEach, expect, it, vi } from 'vitest';
import { gamePack } from '../../content';
import { instantiate } from '../../src/core/content';
import { defaultSave, exportSave, importSave, recordAttempt, seenExercise } from '../../src/core/save';
import { PROGRESS_KEY, readProgress, recordProgress, templateKey } from '../../src/core/progress';
import { pendingErrors, exerciseSection } from '../../src/app/section-selection';
import { buildSession, seededRng, reconstructErrors } from '../../src/core/session';
import { emptySkill, updateSkill, type Skill } from '../../src/core/skills';
import { buildBackup, parseBackup } from '../../src/core/backup';
import { migrate as oldMigrate, importSave as oldImport } from '../fixtures/legacy-f910745-save';
import { parseBackup as oldBackup, buildBackup as oldBuild } from '../fixtures/legacy-f910745-backup';

const ex = (templateId = 'num-mmc', difficulty: 1 | 2 | 3 = 1, seed = 42) => instantiate(gamePack, { packId: gamePack.id, packVersion: gamePack.version, templateId, difficulty, seed });
const wrong = (save = defaultSave(), e = ex(), at = 100) => recordProgress(recordAttempt(save, e, { kind: 'numeric', value: '-1' }, false, at), e, false, 0, at, exerciseSection('matematica', e));
afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

it('A: pending refs intersect multiple selected sections, independently of shared competence', () => {
  const save = wrong(wrong(), ex('num-mdc'), 101);
  const ids = [ex().competencyId];
  expect(pendingErrors(save, 'matematica', ids, ['mat-sec-primos'])).toEqual([]);
  expect(pendingErrors(save, 'matematica', ids, ['mat-sec-primos', 'mat-sec-mmc-mdc'])).toEqual([ex().ref, ex('num-mdc').ref]);
  expect(exerciseSection('matematica', ex().ref!)).toBe('mat-sec-mmc-mdc');
  expect(exerciseSection('historia', 'absent')).toBeUndefined();
});
it('A: incompatible refs are unavailable without blocking compatible refs or bypassing approval', () => {
  const ref = ex().ref!;
  const reconstructed = reconstructErrors(gamePack, [{ ...ref, packVersion: 'missing' }, ref]);
  expect(reconstructed.exercises.map(e => e.ref)).toEqual([ref]);
  expect(reconstructed.unavailable).toBe(1);
  expect(reconstructErrors({ ...gamePack, templates: gamePack.templates.map(t => ({ ...t, review: 'needs-human-review' })) }, [ref])).toEqual({ exercises: [], unavailable: 1 });
});
it('B: target level filters before repetition and uses the nearest available level', () => {
  const target = ex('num-mmc', 2);
  const easy = ex();
  const options = { mode: 'study' as const, competencyIds: [target.competencyId], n: 1, state: {}, skills: { [target.competencyId]: { ...emptySkill(), level: 2 as const } }, now: 200, history: [seenExercise(target, 100)], repeatPenalty: 9999 };
  expect(buildSession({ ...options, pool: [easy, target], rng: seededRng(1) }).exercises[0]).toEqual(target);
  expect(buildSession({ ...options, pool: [easy], rng: seededRng(1) }).exercises[0]).toEqual(easy);
});
it('A: a later first correct answer needs no hints and at least the failed difficulty; mistakes remain history', () => {
  const save = wrong(defaultSave(), ex('num-mmc', 2));
  expect(Object.keys(readProgress(recordProgress(save, ex(), true, 0, 101)).pending)).toHaveLength(1);
  expect(Object.keys(readProgress(recordProgress(save, ex('num-mmc', 2), true, 1, 101)).pending)).toHaveLength(1);
  const resolved = recordProgress(save, ex('num-mmc', 2), true, 0, 101);
  expect(readProgress(resolved).pending).toEqual({});
  expect(resolved.mistakes).toEqual(save.mistakes);
  expect(readProgress(wrong(resolved, ex(), 102)).pending[templateKey(ex().ref!)]).toBeDefined();
});
it('B: incremental selection uses new evidence, ignoring ancient mastery and repeat penalties', () => {
  const pool = ([1, 2, 3] as const).flatMap(d => Array.from({ length: 8 }, (_, i) => ex('num-mmc', d, i + d * 100)));
  let skill = { ...emptySkill(), level: 2 as const };
  const selected: typeof pool = [];
  const pick = () => buildSession({ mode: 'study', pool, competencyIds: [ex().competencyId], n: 1, state: {}, skills: { [ex().competencyId]: skill }, rng: seededRng(2), now: 0, selected, history: [], repeatPenalty: 999 }).exercises[0]!;
  for (let i = 0; i < 3; i++) {
    const e = pick(); expect(e.difficulty).toBe(2); selected.push(e);
    skill = updateSkill(skill, { correct: false, difficulty: e.difficulty, hints: 0, now: i }) as typeof skill;
    if (i === 0) expect(skill.level).toBe(2);
  }
  expect(pick().difficulty).toBe(1);
  expect(new Set(selected.map(e => e.id)).size).toBe(3);
  const frozen = buildSession({ mode: 'test', pool, competencyIds: [ex().competencyId], n: 5, state: {}, skills: {}, rng: seededRng(2), now: 0 }).exercises;
  const difficulties = frozen.map(e => e.difficulty);
  for (let i = 0; i < 4; i++) skill = updateSkill(skill, { correct: true, difficulty: 1, hints: 1, now: i }) as typeof skill;
  expect(skill.level).toBe(2);
  expect(skill.atLevel).toEqual([]);
  expect(frozen.map(e => e.difficulty)).toEqual(difficulties);
});
it('C and rollback: simple/full exports load through the actual f910745 validators, in both directions', () => {
  const save = { ...wrong(), stars: 42 };
  const simple = exportSave(save);
  expect(oldMigrate(JSON.parse(simple))).toEqual(save);
  expect(oldImport(simple)).toEqual({ ok: true, save });
  expect(oldBackup(buildBackup(save, {}))).toEqual({ ok: true, save, skills: {} });
  expect(parseBackup(oldBuild(save, {}))).toEqual({ ok: true, save, skills: {} });
  const imported = importSave(simple);
  expect(imported.ok && readProgress(imported.save).sections['mat-sec-mmc-mdc']).toMatchObject({ attempts: 1, correct: 0, recent: [{ correct: false, hints: 0 }], lastAt: 100 });
  expect(readProgress(defaultSave())).toEqual({ sections: {}, pending: {} });
  expect(readProgress(save).sections['mat-sec-primos']).toBeUndefined();
});
it('C: rejects invalid counters, windows, timestamps and unsafe keys, preserves unknown section ids', () => {
  const section = { attempts: 1, correct: 1, recent: [{ correct: true, hints: 0 }], lastAt: 100 };
  const sections = JSON.parse(JSON.stringify({ future: section, negative: { ...section, attempts: -1 }, excessive: { ...section, correct: 2 }, window: { ...section, recent: Array(6).fill({ correct: true, hints: 0 }) }, date: { ...section, lastAt: -1 }, hints: { ...section, recent: [{ correct: true, hints: -1 }] } }));
  Object.defineProperty(sections, '__proto__', { enumerable: true, value: section });
  const save = { ...defaultSave(), equipment: { [PROGRESS_KEY]: JSON.stringify({ sections, pending: {} }) } };
  expect(Object.keys(readProgress(save).sections)).toEqual(['future']);
});
it('C: persists, reloads, recovers and preserves the extension when store rebuilds equipment', async () => {
  const values: Record<string, string> = { 'eda:save:v2': exportSave(wrong()) };
  vi.stubGlobal('localStorage', { getItem: (k: string) => values[k] ?? null, setItem: (k: string, v: string) => { values[k] = v; } });
  vi.stubGlobal('navigator', {});
  vi.stubGlobal('document', { body: { classList: { toggle: () => {} }, style: { setProperty: () => {} } } });
  let api = await import('../../src/app/store');
  await api.update({ lastTopicId: 'mat-primos' });
  expect(readProgress(api.getState().save).sections['mat-sec-mmc-mdc']?.attempts).toBe(1);
  expect(oldImport(values['eda:save:v2']!).ok).toBe(true);
  values['eda:save:v2'] = '{';
  vi.resetModules(); api = await import('../../src/app/store');
  expect(api.getState().ui.recovered).toBe(true);
  expect(readProgress(api.getState().save).sections['mat-sec-mmc-mdc']?.attempts).toBe(1);
  await api.update({ lastTopicId: 'mat-primos' });
  expect(oldImport(values['eda:save:v2']!).ok).toBe(true);
});
it('B: 3 erros seguidos descem 1 nível sem cascata; 1 erro isolado mantém; 4 em 5 sobe', () => {
  const at = (s: Skill, correct: boolean, difficulty = s.level) => updateSkill(s, { correct, difficulty, hints: 0, now: 1 });
  let s: Skill = { ...emptySkill(), level: 3 };
  s = at(s, false); expect(s.level).toBe(3); // erro isolado
  s = at(s, false); s = at(s, false); expect(s.level).toBe(2); // 3 seguidos
  s = at(s, false); expect(s.level).toBe(2); // 4.º erro: sem cascata (janela reiniciada)
  s = at(s, false); s = at(s, false); expect(s.level).toBe(1);
  let u = emptySkill();
  for (const c of [true, false, true, true, true]) u = at(u, c);
  expect(u.level).toBe(2);
  let v: Skill = { ...emptySkill(), level: 2 }; // erro, acerto, erro, erro: não são 3 seguidos
  for (const c of [false, true, false, false]) v = at(v, c);
  expect(v.level).toBe(2);
});
