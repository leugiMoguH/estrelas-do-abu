import { button, frame } from '../router';
import { openMap } from '../map';
import { play } from '../audio';

export const action = (label: string, run: () => void, className = ''): HTMLButtonElement =>
  button(
    label,
    () => {
      play('tap');
      run();
    },
    className,
  );
export function screen(title: string): HTMLElement {
  const main = frame(title, () => {
    play('tap');
    openMap();
  });
  main.classList.add('extras');
  return main;
}
export function message(parent: HTMLElement, text: string): HTMLElement {
  const p = document.createElement('p');
  p.setAttribute('role', 'status');
  p.textContent = text;
  parent.append(p);
  return p;
}
