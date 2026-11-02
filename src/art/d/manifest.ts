import { CATALOG, type Slot } from '../catalog';
/** Coordinates in the compositor's 1024 × 1536 space (exports are 768 × 1152).
 * Waistbands are fitted to waist; trouser ankles stay fixed when fitting. */
export const ANCHORS = {
 head: [508, 110], neck: [508, 350], shoulders: [[350, 390], [666, 390]],
 waist: [508, 680], wrists: [[305, 835], [704, 835]], ankles: [[400, 1360], [624, 1360]],
} as const;
export interface Coverage {
 anchor: keyof typeof ANCHORS;
 waist?: number;
 hem?: number;
 neckline?: number;
 cuffs?: number;
 ankle?: number;
 underlay?: boolean;
}
export interface Layer { slot: Slot | 'skin' | 'under'; file: string | null; z: number; covers?: string[]; hairFront?: string; coverage?: Coverage; transform?: string }
const order: Record<Slot, number> = { backpack: 0, hairStyle: 5, bottom: 30, shoes: 40, top: 50, outer: 60, glasses: 90, hat: 100, accessory: 110, abuAccessory: 120, abuNeck: 120, abuBody: 120, abuHead: 120 };
const painted = ['glasses','hat','accessory','backpack','abuAccessory','abuNeck','abuBody','abuHead'];
// Measured central waistband / torso hem, rather than the bounding box of sleeves.
const waistSource: Record<string, number> = { 'bottom-calcas': 600, 'bottom-verdes': 619, 'bottom-saia': 684, 'bottom-xadrez': 664, 'bottom-calcoes': 708 };
const hems: Record<string, number> = { 'top-azul': 699, 'top-coral': 711, 'top-estrelas': 704, 'top-hoodie': 719, 'top-jaqueta': 703, 'top-listras': 727, 'top-verde': 707 };
export const MANIFEST: Record<string, Layer> = Object.fromEntries(CATALOG.map(i => {
 const file = painted.includes(i.slot) || i.id === 'hair-rapado' ? null : `d4/${i.id}.webp`;
 const source = waistSource[i.id];
 const trousers = i.id === 'bottom-calcas' || i.id === 'bottom-verdes';
 const scale = source && trousers ? (1375 - ANCHORS.waist[1]) / (1375 - source) : 1;
 const offset = source ? ANCHORS.waist[1] - source * scale : 0;
 const coverage: Coverage = i.slot === 'bottom' ? { anchor: 'waist', waist: ANCHORS.waist[1], hem: i.id === 'bottom-calcoes' ? 871 + offset : i.id === 'bottom-saia' ? 993 + offset : i.id === 'bottom-xadrez' ? 955 + offset : 1375, ...(trousers ? { ankle: 1375 } : {}) }
  : i.slot === 'top' ? { anchor: 'neck', neckline: 360, hem: hems[i.id], cuffs: ['top-hoodie','top-jaqueta','top-verde'].includes(i.id) ? 810 : 540, underlay: i.id === 'top-jaqueta' }
  : i.slot === 'outer' ? { anchor: 'shoulders', neckline: 350, hem: 1264, cuffs: 850 }
  : i.slot === 'shoes' ? { anchor: 'ankles', ankle: 1375 }
  : { anchor: i.slot === 'backpack' ? 'shoulders' : ['acc-colar','acc-laco'].includes(i.id) ? 'neck' : 'head' };
 return [i.id, { slot: i.slot, file, z: order[i.slot], coverage,
  ...(source ? { covers: ['under-bottom'], transform: `translate(0 ${offset}) scale(1 ${scale})` } : {}),
  ...(i.slot === 'hairStyle' && file ? { hairFront: file } : {}) }];
}));
export const BODY: Layer[] = [{ slot: 'skin', file: 'd4/body_skin.webp', z: 10 }, { slot: 'under', file: 'd4/body_under.webp', z: 20 }];
// Vite só inclui ficheiros presentes; uma camada em falta não origina pedidos 404.
const assets = import.meta.glob<string>('../assets/d4/*.webp', { eager: true, query: '?url', import: 'default' });
const warned = new Set<string>();
export const assetUrl = (file: string): string | undefined => {
 const url = assets[`../assets/${file}`];
 if (!url && !warned.has(file)) { warned.add(file); console.warn(`Asset D ausente: ${file}`); }
 return url;
};
export function missingAssets(exists: (file: string) => boolean): string[] {
  return [...new Set([...BODY, ...Object.values(MANIFEST)].flatMap(i => [i.file, i.hairFront].filter((f): f is string => !!f)))].filter(f => !exists(f));
}
