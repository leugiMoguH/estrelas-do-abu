import { shade } from '../palette';

/** Estilo de desenho: o mesmo esqueleto (proporções, peças) é pintado de formas diferentes nas duas direções. */
export interface ArtStyle {
  id: 'a' | 'b';
  ink: string;
  line: number;
  /** B: o contorno é a própria cor, escurecida; A: contorno único castanho-vinho. */
  coloredOutline: boolean;
  gloss: boolean;
  /** Intensidade da sombra recortada (0–1) e o seu matiz frio. */
  shade: number;
  shadeTint: string;
  blush: number;
  eyeScale: number;
}

export const STYLE_A: ArtStyle = {
  id: 'a',
  ink: '#5b3a3a',
  line: 3.2,
  coloredOutline: false,
  gloss: true,
  shade: 0.28,
  shadeTint: '#8a6ab5',
  blush: 0.5,
  eyeScale: 1.1,
};

export const STYLE_B: ArtStyle = {
  id: 'b',
  ink: '#3d2f35',
  line: 2.2,
  coloredOutline: true,
  gloss: false,
  shade: 0.32,
  shadeTint: '#6d6a9c',
  blush: 0.28,
  eyeScale: 0.95,
};

/** Mistura duas cores #rrggbb (t = peso de `b`). */
export function mix(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number): string =>
    Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t)
      .toString(16)
      .padStart(2, '0');
  return `#${ch(16)}${ch(8)}${ch(0)}`;
}

export const shadowOf = (s: ArtStyle, fill: string): string => mix(fill, s.shadeTint, s.shade);
export const lightOf = (fill: string): string => shade(fill, 0.28);
export const outlineOf = (s: ArtStyle, fill: string): string => (s.coloredOutline ? mix(fill, s.ink, 0.62) : s.ink);

/** Forma preenchida com contorno do estilo. */
export function shape(s: ArtStyle, d: string, fill: string, extra = ''): string {
  return `<path d="${d}" fill="${fill}" stroke="${outlineOf(s, fill)}" stroke-width="${s.line}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
}

/** Sombra interior (sem contorno), a recortar com clip-path ou a desenhar já dentro da forma. */
export function tone(d: string, color: string, opacity = 1): string {
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
}

/** Brilho especular curto (só no estilo com gloss). */
export function gloss(s: ArtStyle, d: string, opacity = 0.75): string {
  return s.gloss ? `<path d="${d}" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity="${opacity}"/>` : '';
}

export function line(s: ArtStyle, d: string, color: string, width = 1.6, opacity = 0.8): string {
  void s;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
}
