import '../../src/styles/fonts.css';
import './style.css';
import girlHappy from '../../src/art/assets/d/girl_happy.webp';
import girlWow from '../../src/art/assets/d/girl_surprised.webp';
import girlCoat from '../../src/art/assets/d/girl_outfit2.webp';
import abuHappy from '../../src/art/assets/d/abu_happy.webp';
import abuCurious from '../../src/art/assets/d/abu_curious.webp';
import campus from '../../src/art/assets/d/campus.webp';

type Face = 'happy' | 'wow';
type Outfit = 'hoodie' | 'coat';
const state = { face: 'happy' as Face, outfit: 'hoodie' as Outfit };

// Só há uma expressão por roupa gerada: «Surpresa» com gabardina não existe (limitação do protótipo).
const girl = (): string => (state.outfit === 'coat' ? girlCoat : state.face === 'wow' ? girlWow : girlHappy);
const abu = (): string => (state.face === 'wow' ? abuCurious : abuHappy);
const bubble = (): string => (state.face === 'wow' ? 'Uau! Que fixe!' : 'Fica-te bem!');

const seg = (name: string, key: string, options: [string, string][]): string =>
  `<div class="seg" role="group" aria-label="${name}"><span>${name}</span>${options
    .map(([id, label]) => `<button type="button" data-${key}="${id}" aria-pressed="${state[key as 'face' | 'outfit'] === id}">${label}</button>`)
    .join('')}</div>`;

const app = document.getElementById('app')!;
app.innerHTML =
  `<main class="stage"><header><b>Estrelas do Abu</b><span class="coins">★ 12</span></header>` +
  `<div class="scene"><img class="bg" src="${campus}" alt="" /><div class="veil"></div>` +
  `<span class="floor"></span><span class="shadow g"></span><span class="shadow a"></span><img class="girl" alt="A tua personagem" /><img class="abu" alt="Abu, o pinscher" /><p class="bubble" role="status"></p></div>` +
  `<section class="panel">${seg('Expressão', 'face', [['happy', 'Contente'], ['wow', 'Surpresa']])}${seg('Roupa', 'outfit', [['hoodie', 'Hoodie'], ['coat', 'Gabardina']])}` +
  `<button class="cta" type="button">Ir para o campus →</button></section>` +
  `<h2>O campus</h2><div class="map"><img src="${campus}" alt="Mapa do campus" /><button class="tag" style="left:24%;top:68%">Português</button><button class="tag" style="left:80%;top:70%">Matemática</button></div></main>`;

const $ = <T extends HTMLElement>(s: string): T => app.querySelector<T>(s)!;
function paint(pop: boolean): void {
  $<HTMLImageElement>('.girl').src = girl();
  $<HTMLImageElement>('.abu').src = abu();
  $('.bubble').textContent = bubble();
  const g = $('.girl');
  if (pop) {
    g.classList.remove('pop');
    void g.offsetWidth;
    g.classList.add('pop');
  }
}
function syncFaceButtons(): void {
  // Só há uma expressão por roupa gerada: com gabardina fica só «Contente» (sem prometer o que a arte não mostra).
  if (state.outfit === 'coat') state.face = 'happy';
  app.querySelectorAll<HTMLButtonElement>('[data-face]').forEach((f) => {
    f.disabled = state.outfit === 'coat' && f.dataset.face === 'wow';
    f.setAttribute('aria-pressed', String(f.dataset.face === state.face));
  });
}
syncFaceButtons();
paint(false);
app.querySelectorAll<HTMLButtonElement>('.seg button').forEach((b) => {
  b.onclick = () => {
    if (b.dataset.face) state.face = b.dataset.face as Face;
    else state.outfit = b.dataset.outfit as Outfit;
    syncFaceButtons();
    b.parentElement!.querySelectorAll('button').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    paint(true);
  };
});
