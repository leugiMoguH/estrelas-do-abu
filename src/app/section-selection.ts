import { hgpItemSection } from '../../content';
import { MAT_TEMPLATE_SECTION } from '../../content/matematica/estrutura';
import type { Exercise } from '../core/types';
import { selectionKey } from '../core/collections';
export const exerciseSection = (subject: string, e: Exercise): string | undefined => subject === 'matematica' ? MAT_TEMPLATE_SECTION[e.ref!.templateId] : hgpItemSection(e.id);
export const filterSections = (pool: Exercise[], subject: string, ids?: readonly string[]): Exercise[] => ids ? pool.filter(e => ids.includes(exerciseSection(subject, e) ?? '')) : pool;
export const collectionSelection = (subject: string, ids: readonly string[], context?: { sectionIds?: string[]; competencyIds: string[] }): string => selectionKey(subject, context?.sectionIds ?? context?.competencyIds ?? ids);
