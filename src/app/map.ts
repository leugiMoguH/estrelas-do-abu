import { startAbuLife } from './abu-life';
import { mapSvg, avatarSvg, abuSvg } from '../art';
import { SUBJECTS, TOPICS } from '../../content';
import { button, frame, navigate } from './router';
import { getState } from './store';
import { openRoom } from './room';
import { openProfile, openShop, openAchievements, openMinigame, openOptions, openProgress } from './extras';

export function openMap(): void {
  navigate(() => {
    const state = getState();
    const main = frame('O teu centro de descobertas');
    startAbuLife(main, true);
    const links = document.createElement('div');
    links.className = 'toolbar';
    for (const [label, action] of [
      ['Personagem', openProfile],
      ['Loja', openShop],
      ['Conquistas', openAchievements],
      ['Minijogo', openMinigame],
      ['Progresso', openProgress],
      ['Opções', openOptions],
    ] as const)
      links.append(button(label, action, 'quiet'));
    main.append(links);
    main.insertAdjacentHTML(
      'beforeend',
      `<div class="map-art">${mapSvg({ activeSubjects: SUBJECTS.filter((s) => s.active).map((s) => s.id) })}</div>`,
    );
    const hint = document.createElement('p');
    hint.className = 'map-tip';
    hint.textContent = '☝ Começa aqui: toca no Laboratório dos Números ou na Biblioteca!';
    main.append(hint);
    const actions: Record<string, () => void> = {
      loja: openShop,
      conquistas: openAchievements,
      minijogo: openMinigame,
    };
    const activate = (target: string): void => {
      if (actions[target]) return actions[target]();
      const subject = SUBJECTS.find((s) => s.id === target);
      if (subject?.active) openRoom(subject.id);
      else {
        hint.textContent = `${subject?.name ?? 'Este espaço'}: em preparação. Experimenta Matemática ou Português!`;
        hint.setAttribute('role', 'status');
      }
    };
    main.querySelectorAll<SVGElement>('[data-target]').forEach((element) => {
      if (!state.save.seen.length && ['matematica', 'portugues'].includes(element.dataset.target!))
        element.classList.add('suggested-building');
      element.onclick = () => activate(element.dataset.target!);
      element.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate(element.dataset.target!);
        }
      };
    });
    const subjects = document.createElement('div');
    subjects.className = 'subject-links';
    SUBJECTS.filter((subject) => subject.active).forEach((subject) =>
      subjects.append(button(`→ ${subject.name}`, () => activate(subject.id), 'primary')),
    );
    main.append(subjects);
    const last = TOPICS.find((topic) => topic.id === state.lastTopicId);
    if (last)
      main.append(
        button(`Continuar a estudar · ${last.title}`, () => openRoom(last.subject, last.id), 'primary'),
      );
    main.insertAdjacentHTML(
      'beforeend',
      `<aside class="abu-line">${abuSvg('stand', state.profile.avatar)}<p>Uma pergunta de cada vez. Eu vou contigo!</p><span class="map-avatar">${avatarSvg(state.profile.avatar, { size: 100 })}</span></aside>`,
    );
  });
}
