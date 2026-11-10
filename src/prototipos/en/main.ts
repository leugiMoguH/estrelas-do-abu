import './style.css';
import sit from '../../art/assets/d5/abu-sit.webp';
import happy from '../../art/assets/d5/abu-happy.webp';
import curious from '../../art/assets/d5/abu-curious.webp';
import { check, firstRound, generate, flavours, type Cone, type Flavour } from './rules';
import { colours, ice, sky, visitor } from './scene';
interface Metric { firstMs?: number; returns: [number, number] }
interface RecordData { version: 1; roundsPlayed: number; metrics: Metric[] }
const key = 'eda-proto-en';
let record: RecordData = { version: 1, roundsPlayed: 0, metrics: [] };
try {
  const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
  if (parsed && typeof parsed === 'object' && 'version' in parsed && parsed.version === 1 && 'roundsPlayed' in parsed &&
  Number.isSafeInteger(parsed.roundsPlayed) && Number(parsed.roundsPlayed) >= 0 && 'metrics' in parsed && Array.isArray(parsed.metrics)) {
    const data = parsed as RecordData;
    if (data.metrics.every(m => m && Array.isArray(m.returns) && m.returns.length === 2 && m.returns.every(n => Number.isSafeInteger(n) &&
  n >= 0) && (m.firstMs === undefined || Number.isFinite(m.firstMs) && m.firstMs >= 0))) record = data;
  }
} catch { /* Optional local observation. */ }
const empty = (): Cone => ({ scoops: [], sauce: false, sprinkles: false });
let cone = empty();
let orders = firstRound();
let served: [Cone | null, Cone | null] = [null, null];
let messages = ['', ''];
let pose = sit;
let started = performance.now();
let metric: Metric;
let round = 1;
let localVoice: SpeechSynthesisVoice | undefined;
const app = document.querySelector<HTMLDivElement>('#app')!;
const save = (): void => { try { localStorage.setItem(key, JSON.stringify(record)); } catch { /* Play without storage. */ } };
function start(): void {
  metric = { returns: [0, 0] };
  record.metrics.push(metric);
  record.roundsPlayed++;
  save();
}
function speak(index: number): void {
  if (!localVoice) return;
  try {
    const speech = new SpeechSynthesisUtterance(messages[index] || orders[index]!.text);
    speech.voice = localVoice; speech.lang = localVoice.lang; speech.rate = .88;
    speechSynthesis.cancel(); speechSynthesis.speak(speech);
  } catch { /* Optional audio stays silent on failure. */ }
}
function deliver(index: 0 | 1): void {
  if (served[index]) return;
  metric.firstMs ??= Math.round(performance.now() - started);
  const failed = check(orders[index], cone);
  if (failed) { messages[index] = failed.phrase; metric.returns[index]++; pose = curious; }
  else { served[index] = structuredClone(cone); cone = empty(); messages[index] = 'Thank you!'; pose = happy; }
  save(); render();
}
function render(): void {
  const focus = (document.activeElement as HTMLElement | null)?.dataset.action;
  const won = served.every(Boolean);
  app.innerHTML = `<main>
<header>
<p>PROTÓTIPO · INGLÊS <span>Festival do Abu</span>
</p>
<h1>Faz o gelado que cada visitante pede.</h1>
</header>
<section class="festival ${won ? 'complete' : ''}" aria-label="Festival do Abu">${sky(served.map(Boolean))}<div
  class="visitors">${orders.map((order, i) => `<article class="visitor ${served[i] ? 'served' : ''}">
<div class="bubble">
<p lang="en" ${messages[i] ? 'role="status"' : ''}>${messages[i] || order.text}</p>${localVoice ? `<button class="speaker"
  data-action="speak-${i}" aria-label="Ouvir pedido ${i+1}">♪</button>` : ''}</div>
<button class="person" data-action="give-${i}" aria-label="Dar ao visitante ${i+1}" ${served[i] ? 'disabled' : ''}>${visitor(i,
  served[i]!)}<span>${served[i] ? '✓' : 'Dar'}</span>
</button>
</article>`).join('')}</div>
<section class="stall" aria-label="Banca de gelados">
<div class="awning">
<span>Festival do Abu</span>
</div>
<div class="worktop">
<img class="abu" src="${pose}" alt="Abu ${pose === curious ? 'curioso' : pose === happy ? 'feliz' : 'sentado'}">
<div class="cone-area">
<button class="cone" data-action="remove" aria-label="Tirar a bola de cima" ${!cone.scoops.length ? 'disabled' : ''}>${ice(cone)}</button>
</div>
<div class="toppings">
<button data-action="sauce" aria-pressed="${cone.sauce}" lang="en">
<span class="sauce-icon">〰</span>Sauce</button>
<button data-action="sprinkles" aria-pressed="${cone.sprinkles}" lang="en">
<span class="sprinkles-icon">▰ ▰ ▰</span>Sprinkles</button>
</div>
</div>
<div class="display">${flavours.map(f => `<button class="tub" data-action="${f}" aria-label="${f}" ${cone.scoops.length === 2 || won ?
  'disabled' : ''}>
<span style="--ice:${colours[f]}" class="ice-tub">
</span>
<span lang="en">${f}</span>
</button>`).join('')}</div>
<div class="wood">
<span>✦</span>
<span>ABU</span>
<span>✦</span>
</div>
</section>
<div class="finish" ${won ? '' : 'hidden'}>
<p role="status">Constelação acesa!</p>
<button data-action="next">Outra ronda</button>
</div>
</section>${new URLSearchParams(location.search).has('registo') ? `<output id="metrics">${JSON.stringify(record)}</output>` : ''}</main>`;
  if (focus) app.querySelector<HTMLButtonElement>(`[data-action="${focus}"]`)?.focus({ preventScroll: true });
}
app.addEventListener('click', e => {
  const button = (e.target as Element).closest<HTMLButtonElement>('button[data-action]');
  if (!button || button.disabled) return;
  const action = button.dataset.action!;
  if (action.startsWith('give-')) { deliver(Number(action.at(-1)) as 0 | 1); return; }
  if (action.startsWith('speak-')) { speak(Number(action.at(-1))); return; }
  if (action === 'next') {
    round++;
    const previous = JSON.stringify(orders);
    let seed = (Date.now() + round) >>> 0;
    do { orders = generate(seed++); } while (JSON.stringify(orders) === previous);
    cone = empty(); served = [null, null]; messages = ['', '']; pose = sit; started = performance.now(); start();
  } else if (action === 'remove') cone.scoops.pop();
  else if (action === 'sauce' || action === 'sprinkles') cone[action] = !cone[action];
  else if (flavours.includes(action as Flavour) && cone.scoops.length < 2) cone.scoops.push(action as Flavour);
  render();
});
function voices(): void {
  try { localVoice = speechSynthesis.getVoices().find(v => v.localService === true && v.lang.toLowerCase().startsWith('en')); } catch {
  localVoice = undefined; }
  render();
}
start(); render();
if ('speechSynthesis' in window) { voices(); speechSynthesis.addEventListener('voiceschanged', voices); }
