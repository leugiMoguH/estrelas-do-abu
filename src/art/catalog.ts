import type { AvatarConfig } from './palette';
import { EYE_COLORS, EXPRESSIONS, EYE_STYLES, HAIR_COLORS, SKIN_TONES } from './palette';

export type Slot = 'hairStyle' | 'top' | 'bottom' | 'shoes' | 'accessory' | 'abuAccessory' | 'outer' | 'glasses' | 'hat' | 'backpack';
export interface CatalogItem {
  id: string;
  slot: Slot;
  name: string;
  price: number;
  free: boolean;
}

const free = (id: string, slot: Slot, name: string): CatalogItem => ({
  id,
  slot,
  name,
  price: 0,
  free: true,
});
const paid = (id: string, slot: Slot, name: string, price: number): CatalogItem => ({
  id,
  slot,
  name,
  price,
  free: false,
});

export const CATALOG: readonly CatalogItem[] = [
  free('hair-curto', 'hairStyle', 'Curto'),
  free('hair-comprido', 'hairStyle', 'Comprido'),
  free('hair-cachos', 'hairStyle', 'Cachos'),
  free('hair-rapado', 'hairStyle', 'Rapado'),
  paid('hair-rabo', 'hairStyle', 'Rabo-de-cavalo', 6),
  paid('hair-trancas', 'hairStyle', 'Tranças', 10),
  paid('hair-coque', 'hairStyle', 'Coque', 8),
  paid('hair-franja', 'hairStyle', 'Franja', 12),
  free('top-azul', 'top', 'Camisola azul'),
  free('top-coral', 'top', 'Camisola coral'),
  paid('top-verde', 'top', 'Camisola verde', 6),
  paid('top-listras', 'top', 'Às riscas', 12),
  paid('top-estrelas', 'top', 'Com estrelas', 15),
  paid('top-hoodie', 'top', 'Hoodie roxo', 20),
  paid('top-jaqueta', 'top', 'Jaqueta de ganga', 25),
  free('bottom-calcas', 'bottom', 'Calças azuis'),
  free('bottom-saia', 'bottom', 'Saia rosa'),
  paid('bottom-calcoes', 'bottom', 'Calções', 8),
  paid('bottom-xadrez', 'bottom', 'Saia xadrez', 12),
  paid('bottom-verdes', 'bottom', 'Calças verdes', 10),
  free('shoes-brancas', 'shoes', 'Sapatilhas brancas'),
  paid('shoes-vermelhas', 'shoes', 'Sapatilhas vermelhas', 8),
  paid('shoes-botas', 'shoes', 'Botas castanhas', 14),
  paid('shoes-chuva', 'shoes', 'Galochas amarelas', 18),
  free('acc-bandolete', 'accessory', 'Bandolete'),
  paid('acc-fita', 'accessory', 'Laço no cabelo', 5),
  paid('acc-oculos', 'glasses', 'Óculos redondos', 5),
  paid('acc-colar', 'accessory', 'Colar de estrela', 8),
  paid('acc-sol', 'glasses', 'Óculos de sol', 10),
  paid('acc-gorro', 'hat', 'Gorro', 15),
  paid('acc-auscultadores', 'hat', 'Auscultadores', 20),
  paid('acc-coroa', 'hat', 'Coroa', 40),
  free('outer-gabardina', 'outer', 'Gabardina'),
  paid('acc-oculos-estrela', 'glasses', 'Óculos de estrela', 12),
  free('hat-sol', 'hat', 'Chapéu de sol'),
  paid('hat-pompom', 'hat', 'Gorro com pompom', 16),
  free('acc-laco', 'accessory', 'Laço'),
  free('backpack-rosa', 'backpack', 'Mochila rosa'),
  paid('backpack-azul', 'backpack', 'Mochila azul', 12),
  free('abu-coleira', 'abuAccessory', 'Coleira do Abu'),
  paid('abu-laco', 'abuAccessory', 'Laço do Abu', 5),
  paid('abu-lenco', 'abuAccessory', 'Lenço do Abu', 8),
  paid('abu-oculos', 'abuAccessory', 'Óculos do Abu', 10),
  paid('abu-chapeu', 'abuAccessory', 'Chapéu do Abu', 15),
];

export const defaultAvatar = (): AvatarConfig => ({
  outer: null, glasses: null, hat: null, backpack: null, eyeColor: 'castanho',
  skin: 'bege',
  hairStyle: 'hair-curto',
  hairColor: 'castanho',
  eyes: 'brilhantes',
  expression: 'feliz',
  top: 'top-azul',
  bottom: 'bottom-calcas',
  shoes: 'shoes-brancas',
  accessory: null,
  abuAccessory: 'abu-coleira',
});

const pick = <T>(rng: () => number, list: readonly T[]): T => list[Math.floor(rng() * list.length)]!;

/** Avatar aleatório; só usa itens gratuitos ou já possuídos. */
export function randomAvatar(rng: () => number, ownedIds: readonly string[]): AvatarConfig {
  const allowed = (slot: Slot): string[] =>
    CATALOG.filter((i) => i.slot === slot && (i.free || ownedIds.includes(i.id))).map((i) => i.id);
  const accessories = allowed('accessory');
  return {
    outer: null, glasses: null, hat: null, backpack: null, eyeColor: pick(rng, EYE_COLORS).id,
    skin: pick(rng, SKIN_TONES).id,
    hairStyle: pick(rng, allowed('hairStyle')),
    hairColor: pick(rng, HAIR_COLORS).id,
    eyes: pick(rng, EYE_STYLES).id,
    expression: pick(rng, EXPRESSIONS).id,
    top: pick(rng, allowed('top')),
    bottom: pick(rng, allowed('bottom')),
    shoes: pick(rng, allowed('shoes')),
    accessory: rng() < 0.4 ? pick(rng, accessories) : null,
    abuAccessory: pick(rng, allowed('abuAccessory')),
  };
}

/** Validação e migração v1→v2, sem alterar o objeto de origem. */
export function normalizeAvatar(value: unknown, ownedIds: readonly string[]): AvatarConfig {
  const result = defaultAvatar();
  if (!value || typeof value !== 'object') return result;
  const source = { ...value } as Record<string, unknown>;
  const legacy = CATALOG.find(i => i.id === source.accessory);
  if (legacy && (legacy.slot === 'hat' || legacy.slot === 'glasses')) {
    if (source[legacy.slot] == null) source[legacy.slot] = legacy.id;
    source.accessory = null;
  }
  for (const [slot, options] of [['skin', SKIN_TONES], ['hairColor', HAIR_COLORS], ['eyes', EYE_STYLES], ['expression', EXPRESSIONS], ['eyeColor', EYE_COLORS]] as const) {
    if (options.some(i => i.id === source[slot])) result[slot] = source[slot] as string;
  }
  for (const slot of ['hairStyle', 'top', 'bottom', 'shoes', 'outer', 'glasses', 'hat', 'backpack', 'accessory', 'abuAccessory'] as const) {
    const item = CATALOG.find(i => i.id === source[slot] && i.slot === slot);
    if (item && (item.free || ownedIds.includes(item.id))) result[slot] = item.id;
    else if (source[slot] === null && ['outer','glasses','hat','backpack','accessory','abuAccessory'].includes(slot)) (result as unknown as Record<string, unknown>)[slot] = null;
  }
  return result;
}
