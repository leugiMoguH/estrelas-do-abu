import { startAbuLife } from './abu-life';
import { abuSvg } from '../art';
import { abuReact } from '../art/d/abu';
import { tutorButton, setTutorMode } from './tutor';
import { roomSvg } from '../art';
import { TOPICS, SUBJECTS, gamePack } from '../../content';
import { dueCompetencies } from '../core/review';
import { button, escape, frame, navigate } from './router';
import { getState } from './store';
import { openMap } from './map';
import { startSession, type Mode } from './session';

export function openRoom(subject: string, topicId?: string): void {
  const topics = TOPICS.filter((topic) => topic.subject === subject);
  let selected = topics.find((topic) => topic.id === (topicId ?? getState().lastTopicId)) ?? topics[0];
  let mode: Mode = 'study';
  let count = getState().save.seen.length ? 5 : 3;
  const render = (): void => {
    setTutorMode(mode);
    const main = frame(SUBJECTS.find((s) => s.id === subject)?.building ?? 'A tua sala', openMap);
    main.insertAdjacentHTML(
      'beforeend',
      `<div class="room-art" aria-hidden="true">${roomSvg(subject)}</div><h2>O que vamos descobrir?</h2>`,
    );
    startAbuLife(main, mode !== 'test');
    main.insertAdjacentHTML('beforeend', `<aside class="abu-line">${abuSvg('sit',getState().profile.avatar)}</aside>`);
    const cards = document.createElement('div');
    cards.className = 'topic-grid';
    topics.forEach((topic) => {
      const card = button(
        '',
        () => {
          selected = topic;
          render();
        },
        'topic-card',
      );
      card.innerHTML = `<span class="topic-icon">${escape(topic.icon)}</span><strong>${escape(topic.title)}</strong><span>${escape(topic.blurb)}</span>`;
      card.setAttribute('aria-pressed', String(selected?.id === topic.id));
      cards.append(card);
    });
    main.append(cards);
    const modes = document.createElement('fieldset');
    modes.innerHTML = '<legend>Como queres aprender?</legend>';
    for (const [id, label, description] of [
      ['study', 'Estudar', 'Com pistas e ajuda logo a seguir.'],
      ['test', 'Teste', 'Sem pistas. Vês a correção no fim.'],
      ['review', 'Rever', 'Volta ao que precisa de prática.'],
    ] as const) {
      const choice = button(
        '',
        () => {
          mode = id;
          render();
        },
        'mode-card',
      );
      choice.innerHTML = `<strong>${label}</strong><span>${description}</span>`;
      choice.setAttribute('aria-pressed', String(mode === id));
      modes.append(choice);
    }
    main.append(modes);
    const counts = document.createElement('fieldset');
    counts.innerHTML = '<legend>Quantas perguntas?</legend>';
    [3, 5, 8].forEach((n) => {
      const choice = button(String(n), () => {
        count = n;
        render();
      });
      choice.disabled = !getState().save.seen.length && n !== 3;
      choice.setAttribute('aria-pressed', String(count === n));
      counts.append(choice);
    });
    main.append(counts);
    if (!getState().save.seen.length)
      main.insertAdjacentHTML(
        'beforeend',
        '<p>Na tua primeira aventura são só 3 perguntas. Vamos com calma!</p>',
      );
    if (selected) {
      const topic = selected;
      main.append(tutorButton({ subject: topic.subject, competencyId: topic.competencyIds[0]!, mode, onTutorOpen:()=>abuReact(main,'tutor'), practice: () => startSession(topic.id, 'study', count) }));
      const due = dueCompetencies(getState().save.mastery, Date.now(), topic.competencyIds);
      main.append(
        button(
          mode === 'test' ? 'Começar o teste' : mode === 'review' ? 'Começar a rever' : 'Começar a estudar',
          () => startSession(topic.id, mode, count, mode === 'review' ? due : undefined),
          'primary sticky-cta',
        ),
      );
      const mistakes = getState().save.mistakes;
      const errorIds = topic.competencyIds.filter((id) =>
        mistakes.some((mistake) =>
          gamePack.templates.some(
            (template) => template.id === mistake.ref.templateId && template.competencyId === id,
          ),
        ),
      );
      if (errorIds.length)
        main.append(button('Estudar os erros', () => startSession(topic.id, 'study', count, errorIds)));
    }
  };
  navigate(render);
}
