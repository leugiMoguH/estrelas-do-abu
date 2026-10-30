import '../../../src/styles/fonts.css';
import '../style.css';
import './style.css';
import plaza from '../../../src/art/assets/d2/plaza_bg.webp';
import abuHappy from '../../../src/art/assets/d/abu_happy.webp';
import abuCurious from '../../../src/art/assets/d/abu_curious.webp';

/** Piloto modular: 2 expressões × 2 roupas × 2 tons de pele = 8 combinações compostas offline (tests/shots/d-src/modular.py). */
const girls = import.meta.glob('../../../src/art/assets/d3/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const url = (id: string): string => girls[`../../../src/art/assets/d3/${id}.webp`]!;

const FACES = [['happy', 'Contente'], ['wow', 'Surpresa']] as const;
const OUTFITS = [['hoodie', 'Hoodie'], ['coat', 'Gabardina']] as const;
const SKINS = [['a', 'Pele clara'], ['b', 'Pele escura']] as const;
const state = { face: 'happy', outfit: 'hoodie', skin: 'a' };
const id = (o = state): string => `${o.outfit}-${o.face}-${o.skin}`;

const seg = (name: string, key: keyof typeof state, opts: readonly (readonly [string, string])[]): string =>
  `<div class="seg" role="group" aria-label="${name}"><span>${name}</span>${opts.map(([v, l]) => `<button type="button" data-key="${key}" data-v="${v}" aria-pressed="false">${l}</button>`).join('')}</div>`;

const app = document.getElementById('app')!;
const combos = OUTFITS.flatMap(([o]) => FACES.flatMap(([f]) => SKINS.map(([s]) => ({ outfit: o, face: f, skin: s }))));
app.innerHTML =
  `<main class="stage"><header><b>Piloto modular</b><span class="coins">8 combinações</span></header>` +
  `<div class="scene p"><img class="bg" src="${plaza}" alt="" /><span class="shadow g"></span><span class="shadow a"></span>` +
  `<img class="girl" alt="A tua personagem" /><img class="abu" alt="Abu, o pinscher" /><p class="bubble" role="status"></p></div>` +
  `<section class="panel">${seg('Expressão', 'face', FACES)}${seg('Roupa', 'outfit', OUTFITS)}${seg('Pele', 'skin', SKINS)}</section>` +
  `<h2>As 8 combinações</h2><div class="grid">${combos.map((c) => `<button class="cell" data-id="${id(c)}" aria-label="${id(c)}"><img src="${url(id(c))}" alt="" loading="lazy" /></button>`).join('')}</div>` +
  `<p class="note">Piloto: rostos e tons de pele compostos a partir de 4 imagens-base por máscara local (sem nova geração por combinação). Ilustrações geradas por IA; direitos e exclusividade por verificar.</p></main>`;

const $ = <T extends HTMLElement>(s: string): T => app.querySelector<T>(s)!;
function paint(): void {
  $<HTMLImageElement>('.girl').src = url(id());
  $<HTMLImageElement>('.abu').src = state.face === 'wow' ? abuCurious : abuHappy;
  $('.bubble').textContent = state.face === 'wow' ? 'Uau! Que fixe!' : 'Fica-te bem!';
  app.querySelectorAll<HTMLButtonElement>('[data-key]').forEach((b) => b.setAttribute('aria-pressed', String(state[b.dataset.key as keyof typeof state] === b.dataset.v)));
  app.querySelectorAll<HTMLButtonElement>('.cell').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.id === id())));
  const g = $('.girl');
  g.classList.remove('pop');
  void g.offsetWidth;
  g.classList.add('pop');
}
app.querySelectorAll<HTMLButtonElement>('[data-key]').forEach((b) => (b.onclick = () => { (state as Record<string, string>)[b.dataset.key!] = b.dataset.v!; paint(); }));
app.querySelectorAll<HTMLButtonElement>('.cell').forEach((c) => (c.onclick = () => { const [o, f, s] = c.dataset.id!.split('-'); Object.assign(state, { outfit: o, face: f, skin: s }); paint(); }));
paint();
