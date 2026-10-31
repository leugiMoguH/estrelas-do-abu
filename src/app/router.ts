import { startAbuLife } from './abu-life';
import { starSvg } from '../art';
import { play } from './audio';
import { applyOptions, getState, subscribe } from './store';

export type Screen = () => void;
let current: Screen | undefined;
export function navigate(screen: Screen): void {
  current = screen;
  screen();
  window.scrollTo(0, 0);
  document.querySelector<HTMLElement>('main h1, main h2')?.focus();
}
export const refresh = (): void => {
  current?.();
};
export function escape(value: string): string {
  return value.replace(
    /[&<>"']/gu,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}
export function button(label: string, action: () => void, className = ''): HTMLButtonElement {
  const element = document.createElement('button');
  element.type = 'button';
  element.textContent = label;
  element.className = className;
  element.onclick = () => {
    play('tap');
    action();
  };
  return element;
}
export function frame(title: string, back?: () => void): HTMLElement {
  applyOptions();
  const app = document.getElementById('app')!;
  app.innerHTML = `<header><span class="brand">Estrelas do Abu</span><span class="balance" aria-label="${getState().save.stars} estrelas">${starSvg(24)} <b id="stars">${getState().save.stars}</b></span></header><main class="screen"><nav></nav><h1 tabindex="-1">${escape(title)}</h1></main>`;
  const main = app.querySelector('main')!;
  if (back) main.querySelector('nav')!.append(button('← Voltar', back, 'quiet'));
  if (getState().ui.storageError) {
    const warning = document.createElement('p');
    warning.className = 'notice';
    warning.textContent = 'O navegador não conseguiu guardar os dados. Podes continuar a jogar nesta visita.';
    main.append(warning);
  }
  startAbuLife(main, false);
  return main;
}
subscribe((state) => {
  const stars = document.getElementById('stars');
  if (stars) {
    stars.textContent = String(state.save.stars);
    stars.parentElement?.setAttribute('aria-label', `${state.save.stars} estrelas`);
  }
});
