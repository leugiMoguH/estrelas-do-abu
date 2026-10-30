import { setArtTheme, type ArtTheme } from '../art';
import { refresh } from './router';

/** Aplica um tema visual: arte (SVG/imagens) e variáveis/estilos de interface por `body[data-theme]`. */
export function applyTheme(theme: ArtTheme): void {
  setArtTheme(theme);
  if (theme === 'atual') delete document.body.dataset.theme;
  else document.body.dataset.theme = theme;
  refresh();
}
