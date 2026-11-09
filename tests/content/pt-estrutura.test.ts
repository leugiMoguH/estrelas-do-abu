import { expect, it } from 'vitest';
import treeSource from '../../src/app/subject-tree.ts?raw';
import { gamePack } from '../../content';
import { PT_CHAPTERS, PT_SECTIONS, PT_TEMPLATE_SECTION, ptSectionInfo } from '../../content/portugues/estrutura';
import { sectionModeAllowed } from '../../content/estrutura';
import { instantiate, materialize, correctAnswerOf } from '../../src/core/content';
import { seededRng, buildSession, reconstructErrors } from '../../src/core/session';
import { filterSections, exerciseSection, pendingErrors } from '../../src/app/section-selection';
import { defaultSave, importSave, recordAttempt } from '../../src/core/save';
import { emptyMastery } from '../../src/core/mastery';
import { readProgress, recordProgress } from '../../src/core/progress';

it('mapeia os nove templates exatamente uma vez para subcapítulos conhecidos', () => {
  const templates = gamePack.templates.filter(t => t.competencyId.startsWith('pt-'));
  expect(templates).toHaveLength(9);
  expect(Object.keys(PT_TEMPLATE_SECTION).sort()).toEqual(templates.map(t => t.id).sort());
  expect(new Set(PT_SECTIONS.map(s => s.id)).size).toBe(PT_SECTIONS.length);
  expect(PT_CHAPTERS.map(c => c.title)).toEqual(['Oralidade', 'Leitura', 'Educação literária', 'Escrita', 'Gramática']);
  for (const t of templates) expect(PT_SECTIONS.find(s => s.id === PT_TEMPLATE_SECTION[t.id])?.competencyIds).toContain(t.competencyId);
  for (const c of PT_CHAPTERS) {
    expect(c.editorial).toBe('trabalho');
    for (const s of c.sections) {
      expect(s.editorial).toBe('trabalho');
      expect(s.official).toMatch(/^AE Português 6.º, «.+»: l\.\d/);
      expect(s.official).not.toContain('/');
    }
  }
});
for (const mode of ['study', 'test', 'review'] as const) it(`isola subcapítulos e impede preparação em ${mode}`, () => {
  const ids = ['pt-classes', 'pt-verbos', 'pt-voz'];
  const pool = materialize(gamePack, { competencyIds: ids, rng: seededRng(42), perTemplate: 24, difficultyFor: () => 1 });
  for (const section of PT_SECTIONS) {
    const session = buildSession({ mode, pool: filterSections(pool, 'portugues', [section.id]), competencyIds: ids, n: 3, state: {}, rng: seededRng(9), now: 0 });
    const active = ptSectionInfo(section.id).functional;
    expect(sectionModeAllowed(ptSectionInfo(section.id).status, mode)).toBe(active);
    expect(session.exercises.length > 0).toBe(active);
    expect(session.exercises.every(e => exerciseSection('portugues', e) === section.id)).toBe(true);
  }
  expect(PT_CHAPTERS.slice(0, 4).flatMap(c => c.sections).every(s => ptSectionInfo(s.id).status === 'preparacao')).toBe(true);
});
it.each([2, 3])('carrega save antigo v%i pt-* sem mudar competências, referências ou histórico; liga erros e progresso à secção', version => {
  let before = defaultSave();
  for (const templateId of ['pt-classe-nome', 'pt-completar', 'pt-voz-passiva']) {
    const ex = instantiate(gamePack, { packId: gamePack.id, packVersion: gamePack.version, templateId, seed: 42, difficulty: 1 });
    before = recordAttempt(before, ex, correctAnswerOf(ex), false, 100);
    before = { ...before, mastery: { ...before.mastery, [ex.competencyId]: { ...emptyMastery(), attempts: 7, correct: 5, hintsUsed: 1, lastSeen: 90, recent: [true, false, true, true, true], recentHints: [0, 1, 0, 0, 0] } } };
  }
  const { receipts: _receipts, monthlyProgress: _monthlyProgress, equipment: _equipment, ...v2 } = before;
  const loaded = importSave(JSON.stringify(version === 2 ? { ...v2, version: 2 } : before));
  expect(loaded.ok).toBe(true);
  if (!loaded.ok) return;
  expect(loaded.save.mastery).toEqual(before.mastery);
  expect(loaded.save.seen).toEqual(before.seen);
  expect(loaded.save.mistakes).toEqual(before.mistakes);
  for (const section of PT_SECTIONS.filter(s => ptSectionInfo(s.id).functional)) {
    const refs = pendingErrors(loaded.save, 'portugues', ['pt-classes', 'pt-verbos', 'pt-voz'], [section.id]);
    expect(refs).toHaveLength(1);
    const { exercises, unavailable } = reconstructErrors(gamePack, refs);
    expect(unavailable).toBe(0);
    const ex = exercises[0]!;
    expect(exerciseSection('portugues', ex)).toBe(section.id);
    expect(exerciseSection('portugues', refs[0]!)).toBe(section.id);
    const saved = recordProgress(loaded.save, ex, true, 0, 101, exerciseSection('portugues', ex));
    expect(readProgress(saved).sections[section.id]).toMatchObject({ attempts: 1, correct: 1 });
    expect(pendingErrors(saved, 'portugues', ['pt-classes', 'pt-verbos', 'pt-voz'], [section.id])).toEqual([]);
    expect(pendingErrors(saved, 'portugues', ['pt-classes', 'pt-verbos', 'pt-voz'])).toHaveLength(2);
  }
});
// Regressão (2026-11-09): o separador do detalhe na árvore ficou gravado como «?» (codificação).
it('árvore comum usa «·» como separador e não «?»', () => {
  const src = treeSource;
  expect(src).not.toMatch(/\} \? \$\{progressLabel/);
  expect(src).toContain('· ${progressLabel');
});
