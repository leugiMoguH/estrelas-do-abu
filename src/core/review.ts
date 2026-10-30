import type { Mastery, MasteryState } from './mastery';
export const DAY = 86_400_000;
export const REVIEW_DAYS = [1, 3, 7, 14] as const;
export function isDue(mastery: Mastery, now: number): boolean {
  return mastery.attempts > 0 && now >= mastery.lastSeen + REVIEW_DAYS[mastery.reviewStep]! * DAY;
}
export function reviewLevel(mastery: Mastery, now: number): Mastery['level'] {
  return mastery.level === 'consolidated' && isDue(mastery, now) ? 'review' : mastery.level;
}
/** Sem vencidas, privilegia competências ainda não praticadas e depois as mais fracas. */
export function dueCompetencies(
  state: MasteryState,
  now: number,
  competencyIds: readonly string[] = Object.keys(state),
): string[] {
  const ids = [...new Set(competencyIds)];
  const due = ids
    .filter((id) => state[id] && isDue(state[id]!, now))
    .sort((a, b) => state[a]!.lastSeen - state[b]!.lastSeen);
  const strength = (id: string): number => {
    const m = state[id];
    return !m || !m.attempts ? -1 : m.recent.filter(Boolean).length / m.recent.length;
  };
  return due.length
    ? due
    : ids.sort((a, b) => strength(a) - strength(b) || (state[a]?.attempts ?? 0) - (state[b]?.attempts ?? 0));
}
