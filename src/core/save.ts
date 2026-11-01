import type { Answer, Exercise } from './types';
import type { ExerciseRef } from './content';
import { exerciseSignature } from './grading';
export interface Seen {
  readonly ref: ExerciseRef;
  readonly signature: string;
  readonly competencyId: string;
  readonly conceptId: string;
  readonly approachId: string;
  readonly format: Exercise['kind'];
  readonly at: number;
}
export interface Mistake {
  readonly ref: ExerciseRef;
  readonly answer: Answer;
  readonly snapshot: { readonly prompt: string; readonly explanation: string };
  readonly at: number;
}
import { emptyMastery, type Mastery, type MasteryState } from './mastery';
export interface Save {
  readonly version: 2;
  readonly seen: readonly Seen[];
  readonly mistakes: readonly Mistake[];
  readonly stars: number;
  readonly ownedItems: readonly string[];
  readonly mastery: MasteryState;
  readonly rewardLedger: Readonly<Record<string, Readonly<Record<string, number>>>>;
}
export const defaultSave = (): Save => ({
  version: 2,
  seen: [],
  mistakes: [],
  stars: 0,
  ownedItems: [],
  mastery: {},
  rewardLedger: {},
});
const record = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
const integer = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0;
const keys = (v: Record<string, unknown>, expected: readonly string[]) =>
  Object.keys(v).length === expected.length && expected.every((k) => Object.hasOwn(v, k));
const safeKey = (v: string) => v.length > 0 && !['__proto__', 'constructor', 'prototype'].includes(v);
function validMastery(v: unknown): v is Mastery {
  if (!record(v) || !keys(v, Object.keys(emptyMastery()))) return false;
  if (
    ![v.attempts, v.correct, v.hintsUsed, v.streak, v.reviewStep].every(integer) ||
    typeof v.lastSeen !== 'number' ||
    !Number.isFinite(v.lastSeen) ||
    v.lastSeen < 0
  )
    return false;
  const m = v as unknown as Mastery;
  return (
    m.correct <= m.attempts &&
    m.streak <= m.correct &&
    m.reviewStep <= 3 &&
    ['discovering', 'practising', 'progressing', 'consolidated', 'review'].includes(m.level) &&
    Array.isArray(m.recent) &&
    m.recent.length === Math.min(5, m.attempts) &&
    m.recent.every((x) => typeof x === 'boolean') &&
    Array.isArray(m.recentHints) &&
    m.recentHints.length === m.recent.length &&
    m.recentHints.every(integer) &&
    m.recentHints.reduce((a, b) => a + b, 0) <= m.hintsUsed &&
    m.recent.filter(Boolean).length <= m.correct &&
    m.recent.filter((x) => !x).length <= m.attempts - m.correct
  );
}
function validBase(v: unknown): boolean {
  return (
    record(v) &&
    (v.version === 1 || v.version === 2) &&
    integer(v.stars) &&
    Array.isArray(v.ownedItems) &&
    v.ownedItems.every((x) => typeof x === 'string' && safeKey(x)) &&
    new Set(v.ownedItems).size === v.ownedItems.length &&
    record(v.mastery) &&
    Object.entries(v.mastery).every(([k, m]) => safeKey(k) && validMastery(m)) &&
    record(v.rewardLedger) &&
    Object.entries(v.rewardLedger).every(
      ([day, entries]) =>
        /^\d{4}-\d{2}-\d{2}$/u.test(day) &&
        Number.isFinite(Date.parse(day)) &&
        new Date(day).toISOString().slice(0, 10) === day &&
        record(entries) &&
        Object.entries(entries).every(([id, n]) => safeKey(id) && integer(n) && n <= 10),
    )
  );
}
function validRef(v: unknown): boolean {
  return (
    record(v) &&
    keys(v, ['packId', 'packVersion', 'templateId', 'seed', 'difficulty']) &&
    [v.packId, v.packVersion, v.templateId].every((x) => typeof x === 'string' && safeKey(x)) &&
    integer(v.seed) &&
    v.seed <= 0xffffffff &&
    [1, 2, 3].includes(v.difficulty as number)
  );
}
function validSeen(v: unknown): boolean {
  return (
    record(v) &&
    keys(v, ['ref', 'signature', 'competencyId', 'conceptId', 'approachId', 'format', 'at']) &&
    validRef(v.ref) &&
    [v.signature, v.competencyId, v.conceptId, v.approachId].every(
      (x) => typeof x === 'string' && x.length > 0,
    ) &&
    ['mcq', 'numeric', 'text', 'order', 'cloze'].includes(v.format as string) &&
    typeof v.at === 'number' &&
    Number.isFinite(v.at) &&
    v.at >= 0
  );
}
function validMistake(v: unknown): boolean {
  if (
    !record(v) ||
    !keys(v, ['ref', 'answer', 'snapshot', 'at']) ||
    !validRef(v.ref) ||
    typeof v.at !== 'number' ||
    !Number.isFinite(v.at) ||
    v.at < 0 ||
    !record(v.snapshot) ||
    !keys(v.snapshot, ['prompt', 'explanation']) ||
    ![v.snapshot.prompt, v.snapshot.explanation].every((x) => typeof x === 'string') ||
    !record(v.answer) ||
    !keys(v.answer, ['kind', 'value'])
  )
    return false;
  return ['mcq', 'numeric', 'text'].includes(v.answer.kind as string)
    ? typeof v.answer.value === 'string'
    : ['order', 'cloze'].includes(v.answer.kind as string) &&
        Array.isArray(v.answer.value) &&
        v.answer.value.every((x) => typeof x === 'string');
}
export function migrate(value: unknown): Save {
  const base = ['version', 'stars', 'ownedItems', 'mastery', 'rewardLedger'];
  if (
    !record(value) ||
    !validBase(value) ||
    !keys(value, value.version === 1 ? base : [...base, 'seen', 'mistakes']) ||
    (value.version === 2 &&
      (!Array.isArray(value.seen) ||
        value.seen.length > 500 ||
        !value.seen.every(validSeen) ||
        !Array.isArray(value.mistakes) ||
        value.mistakes.length > 100 ||
        !value.mistakes.every(validMistake)))
  )
    throw new Error('Gravação inválida ou versão não suportada');
  return JSON.parse(
    JSON.stringify(value.version === 1 ? { ...value, version: 2, seen: [], mistakes: [] } : value),
  ) as Save;
}
export function seenExercise(ex: Exercise, at: number): Seen {
  if (!ex.ref || !ex.conceptId || !ex.approachId) throw new Error('Exercício sem referência');
  const seen: Seen = {
    ref: ex.ref,
    signature: exerciseSignature(ex),
    competencyId: ex.competencyId,
    conceptId: ex.conceptId,
    approachId: ex.approachId,
    format: ex.kind,
    at,
  };
  if (!validSeen(seen)) throw new Error('Histórico inválido');
  return seen;
}
export function recordAttempt(save: Save, ex: Exercise, answer: Answer, correct: boolean, at: number): Save {
  const seen = seenExercise(ex, at);
  return migrate({
    ...save,
    seen: [...save.seen, seen].slice(-500),
    mistakes: correct
      ? save.mistakes
      : [
          ...save.mistakes,
          { ref: seen.ref, answer, snapshot: { prompt: ex.prompt, explanation: ex.explanation }, at },
        ].slice(-100),
  });
}
export function exportSave(save: Save): string {
  return JSON.stringify(migrate(save));
}
export type ImportResult =
  | { readonly ok: true; readonly save: Save }
  | { readonly ok: false; readonly error: string };
export function importSave(json: string): ImportResult {
  try {
    return { ok: true, save: migrate(JSON.parse(json) as unknown) };
  } catch {
    return { ok: false, error: 'Gravação inválida ou versão não suportada.' };
  }
}
