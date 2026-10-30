/** Tema artístico ativo. 'atual' é a demo v0.1; 'a' e 'b' são as propostas de redesign. */
export type ArtTheme = 'atual' | 'a' | 'b';

let active: ArtTheme = 'atual';
export const getArtTheme = (): ArtTheme => active;
export function setArtTheme(theme: ArtTheme): void {
  active = theme;
}
