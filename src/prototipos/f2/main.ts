import './style.css';
import { challenges, simulate, initialWorld, newBoard, place, undo, type Layer } from './rules';
import { view, type ViewState } from './view';

const root = document.querySelector<HTMLElement>('#app')!;
const storageKey = 'eda-proto-f2';
let token = 0;
const state: ViewState = {
  level: 0, board: newBoard(), selected: -1, subjects: [], forms: [],
  attempts: 0, recovered: 0, busy: false, solved: false, finished: false,
  best: readBest(), world: initialWorld(), feedback: '', highlight: -1,
};

function readBest(): number | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    return typeof value === 'number' && Number.isInteger(value) && value >= 3 ? value : null;
  } catch { return null; }
}

function clearPlayback(): void {
  token++;
  state.busy = false;
  state.solved = false;
  state.world = initialWorld();
  state.highlight = -1;
  state.feedback = 'O Abu espera pelos teus ecos.';
}

function reset(): void {
  state.board = newBoard();
  state.subjects = challenges[state.level]!.cards.map(() => -1);
  state.forms = challenges[state.level]!.cards.map(() => -1);
  state.selected = -1;
  clearPlayback();
}

function focusKey(element: Element | null): string | null {
  if (element?.tagName === 'SUMMARY') return 'summary';
  if (!(element instanceof HTMLButtonElement)) return null;
  if (element.id) return `#${element.id}`;
  return ['subject', 'form', 'card', 'layer', 'remove'].map(kind => {
    const value = element.getAttribute(`data-${kind}`);
    const piece = element.getAttribute('data-value');
    return value === null ? '' : `[data-${kind}="${value}"]${piece === null ? '' : `[data-value="${piece}"]`}`;
  }).find(Boolean) ?? null;
}

function render(focus = focusKey(document.activeElement)): void {
  const helpOpen = root.querySelector('details')?.open ?? false;
  root.innerHTML = view(state);
  const help = root.querySelector('details');
  if (help) help.open = helpOpen;
  if (focus) root.querySelector<HTMLElement>(focus)?.focus({preventScroll: true});
}

function choosePiece(button: HTMLButtonElement, kind: 'subject' | 'form'): void {
  clearPlayback();
  const card = Number(button.dataset[kind]);
  const values = kind === 'subject' ? state.subjects : state.forms;
  values[card] = Number(button.dataset.value);
  state.selected = card;
}

function putCard(layer: Layer): void {
  const card = state.selected;
  if (card < 0 || state.subjects[card]! < 0 || state.forms[card]! < 0) {
    state.feedback = 'Toca nas duas peças de uma frase antes de a colocares no céu.';
    return;
  }
  clearPlayback();
  state.board = place(state.board, {
    card, subject: state.subjects[card]!, form: state.forms[card]!, layer,
  });
}

function next(): void {
  state.recovered += state.level === 0 ? 1 : 2;
  if (state.level < 2) {
    state.level++;
    reset();
    return;
  }
  state.finished = true;
  state.best = Math.min(state.best ?? state.attempts, state.attempts);
  try { localStorage.setItem(storageKey, JSON.stringify(state.best)); } catch { /* Opcional. */ }
}

function edit(button: HTMLButtonElement): void {
  if (button.dataset.subject !== undefined) choosePiece(button, 'subject');
  if (button.dataset.form !== undefined) choosePiece(button, 'form');
  if (button.dataset.card !== undefined) state.selected = Number(button.dataset.card);
  if (button.dataset.layer !== undefined) putCard(Number(button.dataset.layer) as Layer);
  if (button.dataset.remove !== undefined) {
    clearPlayback();
    const choices = state.board.choices.filter(choice => choice.card !== Number(button.dataset.remove));
    state.board = {choices, history: [...state.board.history, state.board.choices]};
  }
  if (button.id === 'undo') { state.board = undo(state.board); clearPlayback(); }
  if (button.id === 'reset') reset();
  if (button.id === 'next' && state.solved) next();
}

root.addEventListener('click', event => {
  const button = (event.target as Element).closest('button');
  if (!button) return;
  const focus = focusKey(button);
  if (button.id === 'again') { location.reload(); return; }
  if (button.id === 'run') { if (!state.busy) void run(); return; }
  edit(button);
  render(focus);
  if (button.id === 'next') root.querySelector<HTMLElement>('h1')?.setAttribute('tabindex', '-1');
  if (button.id === 'next') root.querySelector<HTMLElement>('h1')?.focus();
  if (button.dataset.remove !== undefined) root.querySelector<HTMLElement>(`[data-card="${button.dataset.remove}"]`)?.focus();
});

async function run(): Promise<void> {
  const current = ++token;
  state.attempts++;
  state.busy = true;
  state.solved = false;
  state.world = initialWorld();
  state.highlight = -1;
  const result = simulate(state.level, state.board.choices);
  if (!result.steps.length) state.feedback = 'O céu está à espera: coloca um cartão num tempo.';
  render('#run');
  for (const step of result.steps) {
    await new Promise(resolve => setTimeout(resolve,
      matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 650));
    if (token !== current) return;
    state.world = step.world;
    state.feedback = step.text;
    state.highlight = step.agreementError ? step.card : -1;
    render();
  }
  state.busy = false;
  state.solved = result.success;
  if (state.solved) state.feedback = 'A constelação acendeu-se com os teus ecos!';
  render();
}

reset();
render();
