import { readProgress, progressLabel } from '../core/progress';
import { getState } from './store';
import { HGP_CHAPTERS, hgpSectionInfo } from '../../content';
import type { Chapter as HgpChapter, Section as HgpSection, Availability } from '../../content/estrutura';
import { button } from './router';

export interface SubjectTreeState {
  chapters?: readonly HgpChapter[];
  info?: (id: string) => { active: number; lesson: boolean; functional: boolean; status?: Availability };
  chosen: Set<string>;
  open: Map<string, boolean>;
  focusId?: string;
  rerender: () => void;
}

export const isFunctional = (section: HgpSection): boolean => hgpSectionInfo(section.id).functional;

function sectionDetail(state: SubjectTreeState, section: HgpSection): string {
  const info = (state.info ?? hgpSectionInfo)(section.id);
  if (!info.functional)
    return 'Em preparação: ainda sem exercícios ou lição suficientes.';
  if ('status' in info && info.status === 'licao') return 'Lição disponível · Teste e Rever indisponíveis';
  const parts = state.info ? [`${info.active} ${info.active === 1 ? 'tipo' : 'tipos'} de exercício`] : [`${info.active} perguntas`, 'lição disponível'];
  if (section.provisional) parts.push('tema completo; subcapítulos do manual por confirmar');
  if (section.extra) parts.push('complemento das AE, fora do índice confirmado');
  return parts.join(' · ');
}

function renderSection(state: SubjectTreeState, section: HgpSection, grid: HTMLElement): void {
  const functional = (state.info ?? hgpSectionInfo)(section.id).functional;
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
  if (state.info) { text.style.minWidth = '0'; text.style.overflowWrap = 'anywhere'; }
  const title = document.createElement('strong');
  title.textContent = section.title;
  const detail = document.createElement('span');
  // Progresso só onde há exercícios; «Em preparação» não precisa de «Sem registo».
  detail.textContent = functional ? `${sectionDetail(state, section)} · ${progressLabel(readProgress(getState().save).sections[section.id])}` : sectionDetail(state, section);
  const official = document.createElement('small');
  official.textContent = `Oficial: ${section.official}`;
  text.append(title, detail, official);
  if (section.editorial) {
    const tag = document.createElement('small');
    tag.className = 'hgp-editorial';
    tag.textContent = state.info ? 'Subdivisão de trabalho baseada nas AE' : section.editorial === 'confirmado' ? 'Título do índice do manual' : 'Subdivisão de trabalho (a confirmar com o manual)';
    text.append(tag);
  }
  label.append(input, text);
  grid.append(label);
}

function renderChapter(state: SubjectTreeState, chapter: HgpChapter, parent: HTMLElement, isFirst: boolean): void {
  const functional = chapter.sections.filter(s => (state.info ?? hgpSectionInfo)(s.id).functional);
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
export function renderSubjectTree(main: HTMLElement, state: SubjectTreeState): void {
  const controls = document.createElement('div');
  const everything = (state.chapters ?? HGP_CHAPTERS).flatMap((c) => c.sections).filter(s => (state.info ?? hgpSectionInfo)(s.id).functional);
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
  (state.chapters ?? HGP_CHAPTERS).forEach((chapter, index) => renderChapter(state, chapter, main, index === 0));
}

export const renderHgpTree = renderSubjectTree;
export type HgpTreeState = SubjectTreeState;
