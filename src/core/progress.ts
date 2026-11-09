import type { ExerciseRef } from './content';
import type { Save } from './save';
import type { Exercise } from './types';

/** Extension in an existing string-valued map: Save v3 remains readable on rollback. */
export const PROGRESS_KEY = 'b2-progress-v1';
export interface SectionProgress { attempts: number; correct: number; recent: { correct: boolean; hints: number }[]; lastAt: number }
export interface PendingError { ref: ExerciseRef; at: number }
export interface Progress { sections: Record<string, SectionProgress>; pending: Record<string, PendingError> }
const safe = (s: string): boolean => !!s && !['__proto__', 'constructor', 'prototype'].includes(s);
const int = (n: unknown): n is number => typeof n === 'number' && Number.isSafeInteger(n) && n >= 0;
const time = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 8_640_000_000_000_000;
export const templateKey = (r: ExerciseRef): string => JSON.stringify([r.packId, r.packVersion, r.templateId]);
export function readProgress(save: Save): Progress {
  const out: Progress = { sections: {}, pending: {} };
  if (!Object.hasOwn(save.equipment, PROGRESS_KEY)) {
    // Old history cannot prove resolution. Carry its latest errors forward once;
    // section statistics still start empty, without inferring successes.
    for (const mistake of save.mistakes) out.pending[templateKey(mistake.ref)] = { ref: mistake.ref, at: mistake.at };
    return out;
  }
  try {
    const raw = JSON.parse(save.equipment[PROGRESS_KEY] ?? '{}') as Progress;
    for (const [id, s] of Object.entries(raw.sections ?? {})) {
      if (safe(id) && s && int(s.attempts) && int(s.correct) && s.correct <= s.attempts && time(s.lastAt) && Array.isArray(s.recent) && s.recent.length === Math.min(5, s.attempts) && s.recent.every(r => r && typeof r.correct === 'boolean' && int(r.hints)) && s.recent.filter(r => r.correct).length <= s.correct && s.recent.filter(r => !r.correct).length <= s.attempts - s.correct) out.sections[id] = s;
    }
    for (const [id, p] of Object.entries(raw.pending ?? {})) {
      const r = p?.ref;
      if (safe(id) && r && [r.packId, r.packVersion, r.templateId].every(v => typeof v === 'string' && safe(v)) && int(r.seed) && r.seed <= 0xffffffff && [1, 2, 3].includes(r.difficulty) && time(p.at) && id === templateKey(r)) out.pending[id] = p;
    }
  } catch { /* Invalid extension never discards the compatible base save. */ }
  return out;
}
/** Called only for the first valid answer to a presentation, never for retries. */
export function recordProgress(save: Save, ex: Exercise, correct: boolean, hints: number, at: number, sectionId?: string): Save {
  const p = readProgress(save);
  if (sectionId && safe(sectionId)) {
    const prev = p.sections[sectionId] ?? { attempts: 0, correct: 0, recent: [], lastAt: 0 };
    p.sections[sectionId] = { attempts: prev.attempts + 1, correct: prev.correct + Number(correct), recent: [...prev.recent, { correct, hints }].slice(-5), lastAt: at };
  }
  if (ex.ref) {
    const key = templateKey(ex.ref);
    const prev = p.pending[key];
    if (!correct) p.pending[key] = { ref: ex.ref, at };
    else if (prev && at >= prev.at && hints === 0 && ex.difficulty >= prev.ref.difficulty) delete p.pending[key];
  }
  return { ...save, equipment: { ...save.equipment, [PROGRESS_KEY]: JSON.stringify(p) } };
}
export const progressLabel = (s?: SectionProgress): string => s ? `${s.recent.filter(r => r.correct).length}/${s.recent.length} certas nas últimas respostas · ${s.correct}/${s.attempts} no total` : 'Sem registo por subcapítulo';
