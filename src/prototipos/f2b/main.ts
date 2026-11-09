import './style.css';
import { actions, apply, initial, won, type World, type Word, type Target } from './rules';
import { scene } from './scene';
interface Metric { actions: number; undos: number; firstActions?: number; firstMs?: number; reactionMs?: number }
const key = 'eda-proto-f2b';
const metrics: Metric[] = [0, 1, 2].map(() => ({ actions: 0, undos: 0 }));
const starts = [performance.now(), 0, 0];
let world = initial(0);
let history: World[] = [];
let selected: Word | undefined;
let failures = 0;
let hint = false;
const app = document.querySelector<HTMLDivElement>('#app')!;
try { localStorage.getItem(key); } catch { /* O jogo funciona sem armazenamento. */ }
function save(): void {
  try { localStorage.setItem(key, JSON.stringify({ version: 1, metrics })); } catch { /* Opcional. */ }
}
function record(consequence: boolean): void {
  const m = metrics[world.level]!;
  m.actions++;
  if (consequence && m.firstActions === undefined) {
    m.firstActions = m.actions;
    m.firstMs = Math.round(performance.now() - starts[world.level]!);
  }
  save();
}
function act(word: Word, target: Target): void {
  const began = performance.now();
  history.push(world);
  world = apply(world, { word, target });
  record(true);
  if (world.failed) failures++;
  selected = undefined;
  render(true);
  const m = metrics[world.level]!;
  if (m.reactionMs === undefined) requestAnimationFrame(() => {
    m.reactionMs = Math.round(performance.now() - began);
    save();
    const panel = app.querySelector('#metrics');
    if (panel) panel.textContent = JSON.stringify(metrics, null, 2);
  });
}
function tools(): string {
  if (world.level === 0) return '';
  const words = world.level === 1 ? ['sopra', 'sopram'] : ['abre', 'fecha', 'sopra', 'sopram'];
  return words.map(w => `<button data-word="${w}" aria-pressed="${selected === w}">${w}</button>`).join('');
}
function targets(): string {
  if (world.level === 0) return '<button class="box-target" data-target="caixa">abre</button>';
  const valid = actions(world).filter(a => a.word === selected).map(a => a.target);
  return ['comporta-a', 'comporta-b', 'a', 'b'].filter(t => world.level === 2 || !t.startsWith('comporta'))
    .map(t => `<button class="target ${t} ${valid.includes(t as Target) ? 'valid' : ''} ${hint ? 'hint' : ''}"
      data-target="${t}" aria-label="${t.startsWith('comporta') ? t.replace('-', ' ') : `barco ${t}`}">
      ${t.startsWith('comporta') ? '▥' : '★'}</button>`).join('');
}
function render(animate = false): void {
  const focus = (document.activeElement as HTMLElement | null)?.dataset;
  app.innerHTML = `<main><header><span>PROTÓTIPO · PALAVRAS-FERRAMENTA · ${world.level + 1}/3</span>
    <h1>${['Leva a estrela até à constelação.', 'Leva cada estrela à sua saída.', 'Guia a corrente para as duas saídas.'][world.level]}</h1></header>
    <div class="layout"><section class="scene" aria-label="Cena">${scene(world, animate)}${targets()}
      <p class="echo" role="status">${world.message}</p></section>
    <section class="controls" aria-label="Ferramentas"><div class="tools">${tools()}</div>
      <p class="feedback">${won(world) ? 'A constelação acendeu-se!' : world.failed ? 'Experimenta outro caminho. Podes anular.' : selected ? 'Toca num alvo iluminado.' : ''}</p>
      <div class="recovery"><button id="undo">Anular</button><button id="reset">Recomeçar</button></div>
      ${failures >= 3 ? '<button id="hint">Destacar objetos</button>' : ''}
      ${won(world) && world.level < 2 ? '<button id="next">Seguinte →</button>' : ''}
      ${won(world) && world.level === 2 ? '<p>As duas estrelas encontraram o seu lugar.</p>' : ''}
    </section></div>${new URLSearchParams(location.search).has('registo') ? `<pre id="metrics">${JSON.stringify(metrics, null, 2)}</pre>` : ''}</main>`;
  bind();
  if (focus?.word) app.querySelector<HTMLElement>(`[data-word="${focus.word}"]`)?.focus();
}
function bind(): void {
  app.querySelectorAll<HTMLButtonElement>('[data-word]').forEach(b => {
    b.onclick = () => { selected = b.dataset.word as Word; record(false); render(); };
  });
  app.querySelectorAll<HTMLButtonElement>('[data-target]').forEach(b => {
    b.onclick = () => {
      const target = b.dataset.target as Target;
      const word = world.level === 0 ? 'abre' : selected;
      if (word && actions(world).some(a => a.word === word && a.target === target)) act(word, target);
    };
  });
  app.querySelector<HTMLButtonElement>('#undo')!.onclick = () => {
    const previous = history.pop();
    if (previous) { world = previous; metrics[world.level]!.undos++; save(); }
    selected = undefined; render(); app.querySelector<HTMLElement>('#undo')!.focus();
  };
  app.querySelector<HTMLButtonElement>('#reset')!.onclick = () => {
    history.push(world); world = initial(world.level); selected = undefined; render();
    app.querySelector<HTMLElement>('#reset')!.focus();
  };
  const next = app.querySelector<HTMLButtonElement>('#next');
  if (next) next.onclick = () => {
    world = initial(world.level + 1); history = []; failures = 0; hint = false;
    starts[world.level] = performance.now(); render();
  };
  const help = app.querySelector<HTMLButtonElement>('#hint');
  if (help) help.onclick = () => { hint = !hint; render(); };
}
render();
