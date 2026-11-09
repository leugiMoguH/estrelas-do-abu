import { PT_TEMPLATE_SECTION } from '../../content/portugues/estrutura';
import { gamePack } from '../../content';
import { hgpItemSection } from '../../content';
import { MAT_TEMPLATE_SECTION } from '../../content/matematica/estrutura';
import type { ExerciseRef } from '../core/content';
import { readProgress } from '../core/progress';
import type { Save } from '../core/save';
import type { Exercise } from '../core/types';
import { selectionKey } from '../core/collections';
export const exerciseSection = (subject: string, e: Exercise | ExerciseRef | string): string | undefined => {
  const id = typeof e === 'string' ? e : 'templateId' in e ? e.templateId : e.ref?.templateId ?? e.id;
  return subject === 'portugues' ? PT_TEMPLATE_SECTION[id] : subject === 'matematica' ? MAT_TEMPLATE_SECTION[id] : hgpItemSection(id);
};
export const pendingErrors = (save: Save, subject: string, ids: readonly string[], sections?: readonly string[]): ExerciseRef[] => Object.values(readProgress(save).pending).map(p => p.ref).filter(ref => {
  const section = exerciseSection(subject, ref);
  return (!sections || (section !== undefined && sections.includes(section))) && gamePack.templates.some(t => t.id === ref.templateId && ids.includes(t.competencyId));
});
export const filterSections = (pool: Exercise[], subject: string, ids?: readonly string[]): Exercise[] => ids ? pool.filter(e => ids.includes(exerciseSection(subject, e) ?? '')) : pool;
export const collectionSelection = (subject: string, ids: readonly string[], context?: { sectionIds?: string[]; competencyIds: string[] }): string => selectionKey(subject, context?.sectionIds ?? context?.competencyIds ?? ids);
