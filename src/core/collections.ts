import type { Save } from './save';
export const COLLECTION_VERSION = 1;
export const COLLECTIONS: Readonly<Record<string, readonly string[]>> = {"2026-11": ["m-polo", "m-tunika", "m-hoodie", "m-blusa", "m-colete", "m-camisa-laco", "m-vestido", "m-macacao", "m-cargo", "m-saia-pregas", "m-abu-coleira-folha", "m-abu-lenco-pontas", "m-abu-laco-plissado", "m-abu-gola", "m-abu-gravata-fina", "m-abu-medalhao"], "2026-12": ["m-calcoes-dobras", "m-culottes", "m-saia-envelope", "m-joggers", "m-gabardina", "m-bomber", "m-casaco-capuz", "m-sobretudo", "m-cabelo-ondulado", "m-cabelo-pixie", "m-cabelo-duplo", "m-abu-impermeavel", "m-abu-capa-folha", "m-abu-malha", "m-abu-colete-botoes", "m-abu-marinheiro"], "2027-01": ["m-cabelo-longo-franja", "m-mary-jane", "m-tenis-cano", "m-botins-fivela", "m-sandalias", "m-brincos", "m-pulseiras", "m-colar", "m-oculos", "m-boina", "m-mochila", "m-abu-poncho", "m-abu-viseira", "m-abu-boina", "m-abu-oculos-quadrados", "m-abu-coroa-folhas"]};
export interface CollectionAttempt {
 readonly id: string; readonly month: string; readonly timezone: string;
 readonly selection: string; readonly mode: string; readonly completed: boolean;
 readonly questions: readonly { signature: string; valid: boolean; credit: number }[];
}
export interface Receipt { readonly attempt: CollectionAttempt; readonly stars: number; readonly items: readonly string[]; readonly tier: number; readonly due: number; readonly eligible: boolean }
export function selectionKey(subject: string, ids: readonly string[]): string { return JSON.stringify([subject, [...new Set(ids)].sort()]); }
export function localMonth(year: number, monthIndex: number): string { return `${year}-${String(monthIndex+1).padStart(2,'0')}`; }
export function nextCollection(month: string): string | undefined { return Object.keys(COLLECTIONS).sort().find(m=>m>month); }
export function prizeTier(credits: number, count: number): number {
 if (!count || !Number.isFinite(credits) || credits<0 || credits>count) return 0;
 return credits===count ? 4 : credits>=count*.9 ? 3 : credits>=count*.8 ? 1 : 0;
}
/** Partial Fisher-Yates: every remaining position has the same chance. */
export function draw(items: readonly string[], count: number, rng: ()=>number): string[] {
 const pool=[...new Set(items)]; const n=Math.min(pool.length,count);
 for(let i=0;i<n;i++){ const r=rng(); if(!(r>=0 && r<1)) throw new Error('RNG inválido'); const j=i+Math.floor(r*(pool.length-i)); [pool[i],pool[j]]=[pool[j]!,pool[i]!]; }
 return pool.slice(0,n);
}
export function awardCollection(save: Save, attempt: CollectionAttempt, rng: ()=>number, stars=0): {save: Save; receipt: Receipt} {
 const previous=save.receipts.find(r=>r.attempt.id===attempt.id);
 if(previous) return {save,receipt:previous};
 const q=attempt.questions;
 const eligible=attempt.completed && attempt.mode==='test' && q.length>=10 && q.every(x=>x.valid && Number.isFinite(x.credit) && x.credit>=0 && x.credit<=1) && new Set(q.map(x=>x.signature)).size===q.length;
 // Compensated sum avoids losing a threshold to repeated fractional credits.
 let credits=0, correction=0;
 for(const question of q){const term=question.credit-correction;const total=credits+term;correction=(total-credits)-term;credits=total;}
 const rawTier=eligible ? prizeTier(credits,q.length) : 0;
 const tier=rawTier===4 && !q.every(x=>x.credit===1) ? 3 : rawTier;
 const key=JSON.stringify([attempt.month,attempt.selection]);
 const old=save.monthlyProgress[key]??0;
 const due=COLLECTIONS[attempt.month] ? Math.max(0,tier-old) : 0;
 const items=draw((COLLECTIONS[attempt.month]??[]).filter(id=>!save.ownedItems.includes(id)),due,rng);
 const receipt: Receipt={attempt,stars,items,tier,due,eligible};
 return {receipt,save:{...save,ownedItems:[...save.ownedItems,...items],receipts:[...save.receipts,receipt],monthlyProgress:{...save.monthlyProgress,[key]:COLLECTIONS[attempt.month]?Math.max(old,tier):old}}};
}
