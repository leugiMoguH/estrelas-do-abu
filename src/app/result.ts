import { ptMapSvg } from './figure';
import type { SessionContext } from './session';
import { startAbuLife } from './abu-life';
import { getState } from './store';
import { abuSvg, starSvg } from '../art';
import { gamePack, TOPICS } from '../../content';
import { correctAnswerOf } from '../core/content';
import type { score } from '../core/score';
import { button, escape, frame, navigate } from './router';
import { openMap } from './map';
import { openRoom } from './room';
import { startSession, type Attempt, type Mode } from './session';

export interface SessionResult {
  topicId: string;
  context?: SessionContext;
  mode: Mode;
  attempts: Attempt[];
  summary: ReturnType<typeof score>;
  earned: number;
}
export function openResult(result: SessionResult): void {
  navigate(() => {
    const topic = TOPICS.find((t) => t.id === result.topicId)!;
    const main = frame(result.context?.title ?? 'Mais um passo na tua aventura!', openMap);
    startAbuLife(main, true);
    main.insertAdjacentHTML(
      'beforeend',
      `<section class="panel result-hero">${abuSvg('happy', getState().profile.avatar)}<div>${result.mode === 'test' ? `<p class="grade">${result.summary.grade.toLocaleString('pt-PT')} <small>/ 20</small></p>` : '<h2>Boa prática!</h2>'}<p class="earned">${starSvg(40)} +${result.earned} estrelas</p><p>${result.earned ? 'Ganhos guardados. Continua a descobrir!' : 'Hoje já ganhaste as estrelas desta prática. Podes continuar a aprender!'}</p></div></section>`,
    );
    const name = (id: string): string =>
      gamePack.competencies.find((c) => c.id === id)?.objective ?? topic.title;
    const summary = document.createElement('section');
    summary.className = 'panel';
    summary.innerHTML = '<h2>Nesta sessão</h2><p>O resumo conta a primeira resposta a cada pergunta.</p>';
    for (const [label, ids] of [
      ['Dominadas', result.summary.mastered],
      ['A rever', result.summary.toReview],
    ] as const) {
      summary.insertAdjacentHTML(
        'beforeend',
        `<h3>${label}</h3><p>${ids.length ? ids.map((id) => escape(name(id))).join(' · ') : '—'}</p>`,
      );
    }
    main.append(summary);
    const errors = result.attempts.filter((a) => a.result.invalid || !a.result.correct);
    if (errors.length)
      main.append(
        button(
          'Estudar os erros',
          () =>
            startSession(result.topicId, 'study', Math.max(3, errors.length), [
              ...new Set(errors.map((a) => a.exercise.competencyId)),
            ], result.context),
          'primary',
        ),
      );
    main.append(
      button('Continuar a estudar', () => openRoom(topic.subject, topic.id, result.context)),
      button('Voltar ao centro', openMap, 'primary'),
    );
    const correction = document.createElement('section');
    correction.className = 'correction';
    correction.innerHTML = '<h2>Vamos rever as respostas</h2>';
    result.attempts.forEach((attempt, index) => {
      const correct = correctAnswerOf(attempt.exercise).value;
      const value = (answer: string | readonly string[]): string =>
        typeof answer === 'string' ? answer : answer.join(' → ');
      const item = document.createElement('details');
      item.innerHTML = `<summary>${index + 1}. ${escape(attempt.exercise.prompt)} · ${!attempt.result.invalid && attempt.result.correct ? '✓' : 'A rever'}</summary><p>A tua resposta: ${escape(value(attempt.answer.value))}</p><p>Resposta: ${escape(value(correct))}</p><p>${escape(attempt.exercise.explanation)}</p>`;
      if (attempt.exercise.figure) item.insertAdjacentHTML('beforeend', ptMapSvg(attempt.exercise.figure.highlight, attempt.exercise.figure.label));
      correction.append(item);
    });
    main.append(correction);
  });
}
