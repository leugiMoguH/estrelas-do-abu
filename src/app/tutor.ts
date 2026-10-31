import tomePortrait from '../art/assets/d5/tutor-tome-neutral.png';
import { TUTORS, type SubjectId } from '../../content';
import { button } from './router';
import type { Mode } from './session';
import '../styles/tutor.css';
const assets = import.meta.glob('../art/assets/d5/tutor-*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
let active: HTMLDialogElement | undefined;
let currentMode: Mode = 'study';
export function setTutorMode(mode: Mode): void {
  currentMode = mode;
  active?.close();
  active?.remove();
  active = undefined;
}
export const tutorAllowed = (mode: Mode): boolean => mode !== 'test';
interface TutorOptions {
  subject: SubjectId; competencyId: string; mode: Mode; practice: () => void;
  hint?: () => string; compact?: boolean; scene?: boolean; onTutorOpen?: () => void;
}
export function tutorButton(options: TutorOptions): HTMLElement {
  const tutor = TUTORS[options.subject];
  if (!tutorAllowed(options.mode)) {
    const note = document.createElement('p');
    note.className = 'tutor-test-note';
    note.textContent = 'No teste não há ajuda; no fim vês a correção';
    return note;
  }
  const trigger = button('', () => {
    if (!tutorAllowed(currentMode) || !trigger.isConnected) return;
    const lesson = tutor.lessons.find(l => l.id === options.competencyId);
    if (!lesson || !tutor.ready) return;
    active?.close();
    const dialog = document.createElement('dialog');
    active = dialog;
    dialog.className = 'tutor-dialog';
    dialog.setAttribute('aria-labelledby', 'tutor-title');
    const close = button('Fechar', () => dialog.close(), 'tutor-close');
    const title = document.createElement('h2');
    title.id = 'tutor-title'; title.tabIndex = -1;
    const portrait = document.createElement('div');
    const body = document.createElement('div');
    dialog.append(close, portrait, title, body);
    const picture = (talk: boolean): void => {
      portrait.replaceChildren();
      const url = options.subject === 'historia' ? tomePortrait : assets[`../art/assets/d5/tutor-${tutor.art}-${talk ? 'talk' : 'neutral'}.webp`];
      if (url) { const img = document.createElement('img'); img.src = url; img.alt = ''; portrait.append(img); }
      else portrait.textContent = `${tutor.name[0]} ${tutor.emoji}`;
      portrait.className = 'tutor-portrait';
    };
    const page = (heading: string, lines: string[]): void => {
      title.textContent = heading; body.replaceChildren(); picture(true);
      for (const line of lines) { const p = document.createElement('p'); p.textContent = line; body.append(p); }
      body.append(button('Voltar ao menu', menu)); title.focus();
    };
    const menu = (): void => {
      title.textContent = tutor.name; body.replaceChildren(); picture(false);
      body.append(button('Explica-me esta matéria', () => page('Explica-me esta matéria', [...lesson.explanation, 'Erros comuns', ...lesson.commonErrors])));
      if (options.hint) body.append(button('Dá-me uma dica', () => page('Dá-me uma dica', [options.hint!()])));
      body.append(button('Mostra um exemplo', () => {
        title.textContent = 'Escolhe um exemplo'; body.replaceChildren(); picture(false);
        lesson.examples.forEach(e => body.append(button(e.title, () => page(e.title, e.steps))));
        body.append(button('Voltar ao menu', menu)); title.focus();
      }), button('O que preciso de saber?', () => page('O que preciso de saber?', lesson.checklist)),
      button('Quero praticar', () => { dialog.close(); options.practice(); }));
      title.focus();
    };
    dialog.addEventListener('close', () => { setTriggerPicture(false); dialog.remove(); if (active === dialog) active = undefined; if (trigger.isConnected) trigger.focus(); });
    document.body.append(dialog); dialog.showModal(); menu(); setTriggerPicture(true); options.onTutorOpen?.();
  }, options.compact ? 'tutor-button tutor-compact' : 'tutor-button');
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-label', options.scene ? `${tutor.name}: perguntar` : `Falar com ${tutor.name}`);
  if (options.scene) trigger.classList.add('room-tutor');
  const url = options.subject === 'historia' ? tomePortrait : assets[`../art/assets/d5/tutor-${tutor.art}-neutral.webp`];
  if (url) { const img = document.createElement('img'); img.src = url; img.alt = ''; trigger.append(img); }
  else { const circle = document.createElement('span'); circle.className = 'tutor-initial'; circle.textContent = `${tutor.name[0]} ${tutor.emoji}`; trigger.append(circle); }
  const label = document.createElement('span');
  label.textContent = tutor.ready ? `${tutor.name}${options.scene ? ': perguntar' : ''}` : 'O tutor chega com a disciplina';
  trigger.append(label);
  const setTriggerPicture = (talk: boolean): void => {
    const img = trigger.querySelector('img');
    const src = options.subject === 'historia' ? tomePortrait : assets[`../art/assets/d5/tutor-${tutor.art}-${talk ? 'talk' : 'neutral'}.webp`];
    if (img && src) img.src = src;
  };
  trigger.disabled = !tutor.ready;
  return trigger;
}
