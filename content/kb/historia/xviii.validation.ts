import factual from './xviii-evidencia.json';
import extra from './xviii-evidencia-extra.json';
import contextual from './xviii-evidencia-atomos.json';
import fetched from './xviii-fontes-verificadas.json';
import { verdictOf, type EvidenceMap, type FetchMap } from '../evidence';
import { XVIII_ATOMS } from './xviii.atoms';
import type { KbExercise } from '../schema';

export const XVIII_EVIDENCE: EvidenceMap = { ...factual, ...extra, ...contextual };
export const XVIII_VERDICTS = Object.fromEntries(XVIII_ATOMS.map(a => [a.id, verdictOf(a, XVIII_EVIDENCE, fetched as FetchMap)]));
/** Uma composição só entra quando TODOS os conhecimentos têm apoio contextual suficiente. */
export const eligibleExercise = (e: KbExercise): boolean => e.knowledge.length > 0 && e.knowledge.every(k => XVIII_VERDICTS[k]?.eligible);
