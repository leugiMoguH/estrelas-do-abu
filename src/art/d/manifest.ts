import { CATALOG, type Slot } from '../catalog';
export interface Layer { slot: Slot | 'skin' | 'under'; file: string | null; z: number; covers?: string[]; hairFront?: string }
const order: Record<Slot, number> = { backpack: 0, shoes: 30, bottom: 40, top: 50, outer: 60, hairStyle: 70, glasses: 90, hat: 100, accessory: 110, abuAccessory: 120 };
const painted = ['glasses','hat','accessory','backpack','abuAccessory'];
export const MANIFEST: Record<string, Layer> = Object.fromEntries(CATALOG.map(i => [i.id, { slot: i.slot, file: painted.includes(i.slot) || i.id === 'hair-rapado' ? null : `d4/${i.id}.webp`, z: order[i.slot], ...(i.slot === 'bottom' ? { covers: ['under-bottom'] } : {}), ...(i.slot === 'hat' ? { covers: ['head-accessory'] } : {}), ...(i.id === 'hair-franja' ? { hairFront: 'd4/hair-franja.webp' } : {}) }]));
export const BODY: Layer[] = [{ slot: 'skin', file: 'd4/body_skin.webp', z: 10 }, { slot: 'under', file: 'd4/body_under.webp', z: 20 }];
// Vite só inclui ficheiros presentes; uma camada em falta não origina pedidos 404.
const assets = import.meta.glob<string>('../assets/d4/*.webp', { eager: true, query: '?url', import: 'default' });
export const assetUrl = (file: string): string | undefined => assets[`../assets/${file}`];
export function missingAssets(exists: (file: string) => boolean): string[] {
  return [...new Set([...BODY, ...Object.values(MANIFEST)].flatMap(i => [i.file, i.hairFront].filter((f): f is string => !!f)))].filter(f => !exists(f));
}
