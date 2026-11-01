/**
 * Progressão por competência (reutilizável por todas as disciplinas): cada exercício pode declarar um `skillId`
 * (ex.: «historia:causa»). O estado guarda o nível de exigência atual (1–3), distingue erros ocasionais de
 * dificuldades persistentes, lembra os conhecimentos falhados (para reforço com exercícios diferentes) e agenda revisões.
 * Uma resposta certa nunca prova domínio: só conta como evidência com pouca ajuda e ao nível exigido ou acima.
 */
export type SkillLevel = 1 | 2 | 3;
export interface WeakConcept { readonly concept: string; readonly at: number; readonly ok: number }
export interface Skill {
  readonly attempts: number;
  readonly correct: number;
  readonly level: SkillLevel;
  readonly atLevel: readonly boolean[]; // últimas ≤5 evidências ao nível atual
  readonly recent: readonly boolean[]; // últimas ≤8 respostas (qualquer nível)
  readonly lastSeen: number;
  readonly reviewStep: number; // 0–3
  readonly weak: readonly WeakConcept[]; // ≤6
}
export type SkillsState = Readonly<Record<string, Skill>>;
export type SkillStatus = 'novo' | 'a-crescer' | 'dominio' | 'ocasional' | 'persistente';

export const DAY = 86_400_000;
export const REVIEW_DAYS = [1, 3, 7, 14] as const;
export const MAX_RECENT = 8;
export const MAX_AT_LEVEL = 5;
export const MAX_WEAK = 6;

export const emptySkill = (): Skill => ({ attempts: 0, correct: 0, level: 1, atLevel: [], recent: [], lastSeen: 0, reviewStep: 0, weak: [] });

export interface SkillAttempt { readonly correct: boolean; readonly difficulty: number; readonly hints: number; readonly conceptId?: string; readonly now: number }

const count = (xs: readonly boolean[]): number => xs.filter(Boolean).length;

export function updateSkill(prev: Skill, a: SkillAttempt): Skill {
  if (!Number.isFinite(a.now) || a.now < 0 || !Number.isInteger(a.hints) || a.hints < 0) throw new Error('Tentativa inválida');
  const recent = [...prev.recent, a.correct].slice(-MAX_RECENT);
  // evidência ao nível: erro conta sempre; acerto só com ≤1 pista e dificuldade ≥ nível atual
  const evidence = a.correct ? (a.difficulty >= prev.level && a.hints <= 1 ? [true] : []) : [false];
  let atLevel = [...prev.atLevel, ...evidence].slice(-MAX_AT_LEVEL);
  let level = prev.level;
  const last5 = atLevel.slice(-MAX_AT_LEVEL);
  const promote = last5.length >= 4 && (count(last5) === last5.length || count(last5) >= 4);
  const demote = atLevel.length >= 3 && atLevel.slice(-3).every((x) => !x);
  if (promote && level < 3) { level = (level + 1) as SkillLevel; atLevel = []; }
  else if (demote && level > 1) { level = (level - 1) as SkillLevel; atLevel = []; }
  const concept = a.conceptId;
  let weak = [...prev.weak];
  if (concept) {
    if (!a.correct) weak = [...weak.filter((w) => w.concept !== concept), { concept, at: a.now, ok: 0 }].slice(-MAX_WEAK);
    else weak = weak.flatMap((w) => (w.concept !== concept ? [w] : w.ok + 1 >= 2 ? [] : [{ ...w, ok: w.ok + 1 }]));
  }
  return {
    attempts: prev.attempts + 1,
    correct: prev.correct + Number(a.correct),
    level, atLevel, recent, lastSeen: a.now, weak,
    reviewStep: a.correct && evidence.length ? Math.min(3, prev.reviewStep + 1) : a.correct ? prev.reviewStep : 0,
  };
}

/** Erro ocasional = um deslize entre acertos; dificuldade persistente = menos de metade de acertos nas últimas ≥5 respostas. */
export function skillStatus(s: Skill | undefined): SkillStatus {
  if (!s || s.attempts === 0) return 'novo';
  const r = s.recent;
  if (r.length >= 5 && count(r) / r.length < 0.5) return 'persistente';
  if (r.slice(-5).filter((x) => !x).length === 1 && r.at(-1) === false) return 'ocasional';
  return s.level === 3 && s.atLevel.length >= 4 && count(s.atLevel) >= 4 ? 'dominio' : 'a-crescer';
}

export const skillDue = (s: Skill | undefined, now: number): boolean =>
  !!s && s.attempts > 0 && now - s.lastSeen >= REVIEW_DAYS[Math.max(0, Math.min(s.reviewStep - 1, REVIEW_DAYS.length - 1))]! * DAY;

/** Nível de exigência pedido pela competência; sem registo → `fallback` (comportamento anterior por tema). */
export const skillTarget = (state: SkillsState | undefined, id: string | undefined, fallback: number): number =>
  (id && state?.[id]?.level) || fallback;

const isBools = (v: unknown, max: number): v is boolean[] => Array.isArray(v) && v.length <= max && v.every((x) => typeof x === 'boolean');
const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0;
/** Lê o estado guardado: ignora entradas inválidas (nunca rebenta; no pior caso a competência recomeça). */
export function sanitizeSkills(raw: unknown): SkillsState {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  const out: Record<string, Skill> = {};
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!id || ['__proto__', 'constructor', 'prototype'].includes(id) || typeof v !== 'object' || v === null) continue;
    const s = v as Record<string, unknown>;
    const weak = Array.isArray(s.weak) ? s.weak.filter((w): w is WeakConcept => typeof w === 'object' && w !== null && typeof (w as WeakConcept).concept === 'string' && isInt((w as WeakConcept).at) && isInt((w as WeakConcept).ok)).slice(-MAX_WEAK) : [];
    if (!isInt(s.attempts) || !isInt(s.correct) || s.correct > s.attempts || ![1, 2, 3].includes(s.level as number) || !isBools(s.atLevel, MAX_AT_LEVEL) || !isBools(s.recent, MAX_RECENT) || typeof s.lastSeen !== 'number' || !Number.isFinite(s.lastSeen) || s.lastSeen < 0 || !isInt(s.reviewStep) || s.reviewStep > 3) continue;
    out[id] = { attempts: s.attempts, correct: s.correct, level: s.level as SkillLevel, atLevel: s.atLevel, recent: s.recent, lastSeen: s.lastSeen, reviewStep: s.reviewStep, weak };
  }
  return out;
}
