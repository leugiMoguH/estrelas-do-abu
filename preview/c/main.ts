import '../../src/styles/fonts.css';
import './style.css';
import { sceneSvg } from '../../src/art/v3/caderno';

const group = (name: string, key: 'face' | 'outfit', options: [string, string][]): string =>
  `<div class="seg" role="group" aria-label="${name}"><span>${name}</span>${options
    .map(([id, label], i) => `<button type="button" data-${key}="${id}" aria-pressed="${i === 0}">${label}</button>`)
    .join('')}</div>`;

document.getElementById('app')!.innerHTML =
  `<main class="stage" data-face="happy" data-outfit="hoodie">` +
  `<header><b>Estrelas do Abu</b><span class="coins">★ 12</span></header>` +
  `<div class="scene">${sceneSvg()}</div>` +
  `<section class="panel">` +
  group('Expressão', 'face', [['happy', 'Contente'], ['wow', 'Surpresa']]) +
  group('Roupa', 'outfit', [['hoodie', 'Hoodie'], ['coat', 'Gabardina']]) +
  `<button class="cta" type="button">Ir para o campus →</button>` +
  `</section></main>`;

const stage = document.querySelector<HTMLElement>('.stage')!;
document.querySelectorAll<HTMLButtonElement>('.seg button').forEach((b) => {
  b.onclick = () => {
    const key = b.dataset.face ? 'face' : 'outfit';
    stage.dataset[key] = b.dataset[key]!;
    b.parentElement!.querySelectorAll('button').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    stage.classList.remove('pop');
    void stage.offsetWidth;
    stage.classList.add('pop');
  };
});
