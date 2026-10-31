import { HGP_CHAPTERS, hgpSectionInfo } from '../../content';
import type { HgpChapter, HgpSection } from '../../content/historia/estrutura';
import { button } from './router';

export interface HgpTreeState {
  chosen: Set<string>;
  open: Map<string, boolean>;
  focusId?: string;
  rerender: () => void;
}

export const isFunctional = (section: HgpSection): boolean => hgpSectionInfo(section.id).functional;

function sectionDetail(section: HgpSection): string {
  const info = hgpSectionInfo(section.id);
  if (!info.functional)
    return 'Em preparação: ainda sem exercícios ou lição suficientes.';
  const parts = [`${info.active} perguntas`, 'lição disponível'];
  if (section.provisional) parts.push('tema completo; subcapítulos do manual por confirmar');
  if (section.extra) parts.push('complemento das AE, fora do índice confirmado');
  return parts.join(' · ');
}

function renderSection(state: HgpTreeState, section: HgpSection, grid: HTMLElement): void {
  const functional = isFunctional(section);
  const label = document.createElement('label');
  label.className = functional ? 'topic-card' : 'topic-card is-pending';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = state.chosen.has(section.id);
  input.disabled = !functional;
  input.dataset.focusId = `section-${section.id}`;
  input.onchange = () => {
    if (input.checked) state.chosen.add(section.id);
    else state.chosen.delete(section.id);
    state.rerender();
  };
  const text = document.createElement('span');
  const title = document.createElement('strong');
  title.textContent = section.title;
  const detail = document.createElement('span');
  detail.textContent = sectionDetail(section);
  const official = document.createElement('small');
  official.textContent = `Oficial: ${section.official}`;
  text.append(title, detail, official);
  label.append(input, text);
  grid.append(label);
}

function renderChapter(state: HgpTreeState, chapter: HgpChapter, parent: HTMLElement, isFirst: boolean): void {
  const functional = chapter.sections.filter(isFunctional);
  const selected = functional.filter((s) => state.chosen.has(s.id));
  const field = document.createElement('details');
  field.className = 'topic-group';
  const summary = document.createElement('summary');
  summary.dataset.focusId = `chapter-${chapter.id}`;
  summary.textContent = `${chapter.title}${chapter.pages ? ` (${chapter.pages})` : ''}: ${selected.length}/${functional.length} escolhidos`;
  field.open = state.open.get(chapter.id) ?? (selected.length > 0 || (isFirst && state.chosen.size === 0));
  if (chapter.sections.some((s) => state.focusId === `section-${s.id}`) || state.focusId === `all-${chapter.id}`) field.open = true;
  field.ontoggle = () => { if (field.isConnected) state.open.set(chapter.id, field.open); };
  field.append(summary);
  if (chapter.pending) {
    const note = document.createElement('p');
    note.className = 'hgp-pending';
    note.textContent = chapter.pending;
    field.append(note);
  }
  const all = document.createElement('label');
  all.className = 'hgp-all';
  const allInput = document.createElement('input');
  allInput.type = 'checkbox';
  allInput.checked = functional.length > 0 && selected.length === functional.length;
  allInput.indeterminate = selected.length > 0 && selected.length < functional.length;
  allInput.disabled = functional.length === 0;
  allInput.dataset.focusId = `all-${chapter.id}`;
  allInput.onchange = () => {
    for (const s of functional) {
      if (allInput.checked) state.chosen.add(s.id);
      else state.chosen.delete(s.id);
    }
    state.rerender();
  };
  const allText = document.createElement('span');
  allText.textContent = functional.length ? 'Selecionar todos os subcapítulos deste capítulo' : 'Sem subcapítulos disponíveis neste capítulo';
  all.append(allInput, allText);
  field.append(all);
  const grid = document.createElement('div');
  grid.className = 'topic-grid';
  for (const section of chapter.sections) renderSection(state, section, grid);
  field.append(grid);
  parent.append(field);
}

/** Capítulos (agrupadores) e subcapítulos selecionáveis do manual de HGP. */
export function renderHgpTree(main: HTMLElement, state: HgpTreeState): void {
  const controls = document.createElement('div');
  const everything = HGP_CHAPTERS.flatMap((c) => c.sections).filter(isFunctional);
  const mix = button('Mistura', () => { everything.forEach((s) => state.chosen.add(s.id)); state.rerender(); });
  mix.dataset.focusId = 'mix';
  const clear = button('Limpar', () => { state.chosen.clear(); state.rerender(); });
  clear.dataset.focusId = 'clear';
  controls.append(mix, clear);
  main.append(controls);
  const counter = document.createElement('p');
  counter.setAttribute('role', 'status');
  counter.textContent = `${state.chosen.size} subcapítulos escolhidos`;
  main.append(counter);
  HGP_CHAPTERS.forEach((chapter, index) => renderChapter(state, chapter, main, index === 0));
}
