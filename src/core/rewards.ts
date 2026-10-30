import type { Save } from './save';
export const DAILY_COMPETENCY_CAP = 10;
export interface RewardCompetency {
  readonly competencyId: string;
  readonly improved: boolean;
  readonly isNew: boolean;
}
/** Dia UTC. Conclusão: 2 estrelas por competência; melhoria: +2; nova: +3.
 * Só sessões concluídas recebem estrelas. O limite nunca impede a prática. */
export function rewardSession(
  save: Save,
  session: { readonly completed: boolean; readonly competencies: readonly RewardCompetency[] },
  now: number,
): { save: Save; earned: number } {
  if (!Number.isFinite(now) || now < 0) throw new Error('Relógio inválido');
  if (!session.completed) return { save, earned: 0 };
  const day = new Date(now).toISOString().slice(0, 10);
  const ledger: Record<string, number> = { ...save.rewardLedger[day] };
  let earned = 0;
  for (const id of new Set(session.competencies.map((c) => c.competencyId))) {
    if (!id || ['__proto__', 'constructor', 'prototype'].includes(id))
      throw new Error('Competência inválida');
    const rows = session.competencies.filter((c) => c.competencyId === id);
    const requested = 2 + Number(rows.some((c) => c.improved)) * 2 + Number(rows.some((c) => c.isNew)) * 3;
    const amount = Math.max(0, Math.min(requested, DAILY_COMPETENCY_CAP - (ledger[id] ?? 0)));
    ledger[id] = (ledger[id] ?? 0) + amount;
    earned += amount;
  }
  return {
    earned,
    save: { ...save, stars: save.stars + earned, rewardLedger: { ...save.rewardLedger, [day]: ledger } },
  };
}
export interface ShopItem {
  readonly id: string;
  readonly price: number;
}
export function buy(
  save: Save,
  item: ShopItem,
):
  | { readonly ok: true; readonly save: Save }
  | {
      readonly ok: false;
      readonly reason: 'invalid-item' | 'owned' | 'insufficient-funds';
      readonly save: Save;
    } {
  if (
    !item.id ||
    ['__proto__', 'constructor', 'prototype'].includes(item.id) ||
    !Number.isSafeInteger(item.price) ||
    item.price < 0
  )
    return { ok: false, reason: 'invalid-item', save };
  if (save.ownedItems.includes(item.id)) return { ok: false, reason: 'owned', save };
  if (save.stars < item.price) return { ok: false, reason: 'insufficient-funds', save };
  return {
    ok: true,
    save: { ...save, stars: save.stars - item.price, ownedItems: [...save.ownedItems, item.id] },
  };
}
