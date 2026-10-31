/** Paleta e tipos partilhados da arte. Tudo o que é desenhado usa estes tons para o conjunto parecer um só jogo. */
export const INK = '#4a2f27';
export const SOFT = {
  cream: '#fff6e8',
  sky: '#bfe4f7',
  skyTop: '#8fd0f0',
  grass: '#9fd68a',
  grassDark: '#7cc070',
  sun: '#ffd666',
  coral: '#ff8f7a',
  pink: '#ffb8c6',
  teal: '#4fc1b5',
  blue: '#6aa8ff',
  purple: '#a58bf0',
  orange: '#ffaa5c',
  brown: '#b9825a',
  stone: '#e8dccb',
} as const;

export interface Option {
  readonly id: string;
  readonly name: string;
  readonly hex?: string;
}

export const SKIN_TONES: readonly (Option & { readonly hex: string })[] = [
  { id: 'porcelana', name: 'Porcelana', hex: '#fbe0cf' },
  { id: 'clara', name: 'Clara', hex: '#f6cdb0' },
  { id: 'bege', name: 'Bege', hex: '#ebb98f' },
  { id: 'oliva', name: 'Oliva', hex: '#d9a074' },
  { id: 'dourada', name: 'Dourada', hex: '#c58a5c' },
  { id: 'caramelo', name: 'Caramelo', hex: '#a86d44' },
  { id: 'castanha', name: 'Castanha', hex: '#86542f' },
  { id: 'ebano', name: 'Ébano', hex: '#5e3a24' },
];

export const HAIR_COLORS: readonly (Option & { readonly hex: string })[] = [
  { id: 'preto', name: 'Preto', hex: '#2b1d1a' },
  { id: 'castanho-escuro', name: 'Castanho escuro', hex: '#4a2c20' },
  { id: 'castanho', name: 'Castanho', hex: '#7a4a2b' },
  { id: 'ruivo', name: 'Ruivo', hex: '#b5532a' },
  { id: 'loiro-escuro', name: 'Loiro escuro', hex: '#b88b4a' },
  { id: 'loiro', name: 'Loiro', hex: '#e3c170' },
  { id: 'cinza', name: 'Cinza', hex: '#9aa0a6' },
  { id: 'azul', name: 'Azul', hex: '#4c7bd9' },
  { id: 'rosa', name: 'Rosa', hex: '#e27aa8' },
  { id: 'roxo', name: 'Roxo', hex: '#8456c7' },
];

export const EYE_STYLES: readonly Option[] = [
  { id: 'redondos', name: 'Redondos' },
  { id: 'brilhantes', name: 'Brilhantes' },
  { id: 'amendoa', name: 'Amêndoa' },
  { id: 'sorridentes', name: 'Sorridentes' },
  { id: 'estrela', name: 'Estrela' },
];

export const EXPRESSIONS: readonly Option[] = [
  { id: 'feliz', name: 'Feliz' },
  { id: 'sorriso-grande', name: 'Sorriso grande' },
  { id: 'curiosa', name: 'Curiosa' },
  { id: 'calma', name: 'Calma' },
  { id: 'divertida', name: 'Divertida' },
];

export interface AvatarConfig {
  outer: string | null;
  glasses: string | null;
  hat: string | null;
  backpack: string | null;
  eyeColor: string;
  skin: string;
  hairStyle: string;
  hairColor: string;
  eyes: string;
  expression: string;
  top: string;
  bottom: string;
  shoes: string;
  accessory: string | null;
  abuAccessory: string | null;
}

export type AbuPose = 'idle' | 'sit' | 'happy' | 'sleep' | 'think' | 'wag';

/** Escurece (amount < 0) ou clareia (amount > 0) uma cor #rrggbb. */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift: number): number => {
    const value = (n >> shift) & 255;
    const target = amount < 0 ? 0 : 255;
    return Math.round(value + (target - value) * Math.abs(amount));
  };
  return `#${[16, 8, 0].map((s) => channel(s).toString(16).padStart(2, '0')).join('')}`;
}

let counter = 0;
/** Identificador único por desenho, para clipPaths não colidirem em páginas com vários SVG. */
export const uid = (prefix: string): string => `${prefix}${(counter += 1)}`;

export const EYE_COLORS = [{ id: 'castanho', name: 'Castanho', hex: '#7a4020' }, { id: 'azul', name: 'Azul', hex: '#3977b4' }, { id: 'verde', name: 'Verde', hex: '#51754a' }, { id: 'mel', name: 'Mel', hex: '#b27e31' }] as const;
