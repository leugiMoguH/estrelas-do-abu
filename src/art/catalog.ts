import type { AvatarConfig } from './palette';
import { EXPRESSIONS, EYE_STYLES, HAIR_COLORS, SKIN_TONES } from './palette';

export type Slot = 'hairStyle' | 'top' | 'bottom' | 'shoes' | 'accessory' | 'abuAccessory';
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
  paid('acc-oculos', 'accessory', 'Óculos redondos', 5),
  paid('acc-colar', 'accessory', 'Colar de estrela', 8),
  paid('acc-sol', 'accessory', 'Óculos de sol', 10),
  paid('acc-gorro', 'accessory', 'Gorro', 15),
  paid('acc-auscultadores', 'accessory', 'Auscultadores', 20),
  paid('acc-coroa', 'accessory', 'Coroa', 40),
  free('abu-coleira', 'abuAccessory', 'Coleira do Abu'),
  paid('abu-laco', 'abuAccessory', 'Laço do Abu', 5),
  paid('abu-lenco', 'abuAccessory', 'Lenço do Abu', 8),
  paid('abu-oculos', 'abuAccessory', 'Óculos do Abu', 10),
  paid('abu-chapeu', 'abuAccessory', 'Chapéu do Abu', 15),
];

export const defaultAvatar = (): AvatarConfig => ({
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
