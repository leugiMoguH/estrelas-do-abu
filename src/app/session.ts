import { abuReact } from '../art/d/abu';
import { tutorButton, setTutorMode } from './tutor';
import { abuSvg } from '../art';
import { gamePack, TOPICS } from '../../content';
import { materialize } from '../core/content';
import { grade } from '../core/grading';
import { emptyMastery, updateMastery } from '../core/mastery';
import { rewardSession } from '../core/rewards';
import { recordAttempt } from '../core/save';
import { score } from '../core/score';
import { buildSession, seededRng } from '../core/session';
import type { Answer, Exercise, GradeResult } from '../core/types';
import { answerEditor } from './answers';
import { play } from './audio';
import { button, escape, frame, navigate } from './router';
import { getState, update } from './store';
import { openRoom } from './room';
import { openResult } from './result';

import { ptMapSvg } from './figure';
export interface SessionContext { subject: string; topicIds: string[]; competencyIds: string[]; title: string }
export type Mode = 'study' | 'test' | 'review';
export interface Attempt {
  exercise: Exercise;
  answer: Answer;
  result: GradeResult;
  hints: number;
}

export function startSession(
  topicId: string,
  mode: Mode,
  count: number,
  competencyIds?: readonly string[],
  context?: SessionContext,
): void {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) return;
  setTutorMode(mode);
  const before = getState().save;
  const testParams = import.meta.env.MODE === 'hgp-e2e' ? new URLSearchParams(location.search) : undefined;
  const rng = seededRng(testParams?.has('hgpSeed') ? Number(testParams.get('hgpSeed')) : Date.now());
  const ids = competencyIds?.length ? competencyIds : context?.competencyIds ?? topic.competencyIds;
  const pool = materialize(gamePack, {
    competencyIds: ids,
    rng,
    perTemplate: 4,
    difficultyFor: (template) => {
      const mastery = before.mastery[template.competencyId];
      const target = !mastery || mastery.attempts < 3 ? 1 : mastery.streak >= 3 ? 3 : 2;
      return [...template.difficulties].sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0]!;
    },
  });
  const session = buildSession({
    mode,
    pool: testParams?.has('hgpIds') && topic.subject === 'historia' ? pool.filter(e=>testParams.get('hgpIds')!.split(',').includes(e.id)) : pool,
    competencyIds: ids,
    n: before.seen.length ? count : 3,
    state: before.mastery,
    rng,
    now: Date.now(),
    history: before.seen,
  });
  update({ lastTopicId: topicId });
  let index = 0;
  let hintCount = 0;
  const attempts: Attempt[] = [];
  let firstAttempt: Attempt | undefined;
  let completed = false;
  const finish = (): void => {
    if (completed) return;
    completed = true;
    const summary = score(attempts.map((a) => ({ competencyId: a.exercise.competencyId, result: a.result })));
    const current = getState().save;
    const levels = ['discovering', 'practising', 'progressing', 'consolidated', 'review'];
    const reward = rewardSession(
      current,
      {
        completed: true,
        competencies: [...new Set(attempts.map((a) => a.exercise.competencyId))].map((id) => ({
          competencyId: id,
          isNew: !before.mastery[id]?.attempts,
          improved:
            levels.indexOf(current.mastery[id]?.level ?? 'discovering') >
            levels.indexOf(before.mastery[id]?.level ?? 'discovering'),
        })),
      },
      Date.now(),
    );
    update((state) => ({
      ...state,
      save: reward.save,
      bestTestGrade: mode === 'test' ? Math.max(state.bestTestGrade, summary.grade) : state.bestTestGrade,
    }));
    play('stars');
    openResult({ topicId, mode, attempts, summary, earned: reward.earned, context });
  };
  const next = (): void => {
    index++;
    hintCount = 0;
    firstAttempt = undefined;
    if (index >= session.exercises.length) finish();
    else navigate(render);
  };
  const render = (): void => {
    const main = frame(context?.title ?? topic.title, () => {
      const dialog = document.createElement('dialog');
      dialog.setAttribute('aria-labelledby', 'exit-session-title');
      dialog.innerHTML =
        '<h2 id="exit-session-title">Voltar à sala?</h2><p>As respostas dadas ficam guardadas. Só ganhas estrelas quando terminas a sessão.</p>';
      dialog.append(
        button('Continuar a jogar', () => dialog.close(), 'primary'),
        button('Voltar à sala', () => {
          dialog.close();
          openRoom(topic.subject, topicId, context);
        }),
      );
      main.append(dialog);
      dialog.showModal();
      dialog.addEventListener('close', () => dialog.remove());
    });
    const exercise = session.exercises[index];
    if (!exercise) {
      main.insertAdjacentHTML(
        'beforeend',
        '<p>Ainda não há perguntas disponíveis para esta escolha. Experimenta outro tema.</p>',
      );
      main.append(button('Voltar à sala', () => openRoom(topic.subject, topicId, context), 'primary'));
      return;
    }
    main.insertAdjacentHTML(
      'beforeend',
      `<div class="question-progress"><span>${mode === 'test' ? 'Teste' : mode === 'review' ? 'Rever' : 'Estudar'} · Pergunta ${index + 1} de ${session.exercises.length}</span><progress value="${index + 1}" max="${session.exercises.length}" aria-label="Progresso da sessão"></progress></div>`,
    );
    const form = document.createElement('form');
    form.className = 'panel question';
    if (exercise.stimulus)
      form.innerHTML = `<blockquote class="stimulus">${escape(exercise.stimulus)}</blockquote>`;
    form.insertAdjacentHTML('beforeend', `<h2>${escape(exercise.prompt)}</h2>`);
    if (exercise.figure) form.insertAdjacentHTML('beforeend', ptMapSvg(exercise.figure.highlight));
    const editor = answerEditor(exercise);
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.setAttribute('role', 'status');
    const hintBox = document.createElement('div');
    hintBox.setAttribute('aria-live', 'polite');
    const actions = document.createElement('div');
    actions.className = 'actions';
    const submit = button(
      mode === 'test' ? 'Guardar resposta e continuar' : 'Verificar',
      () => {},
      'primary',
    );
    submit.type = 'submit';
    actions.append(submit);
    let hint: HTMLButtonElement | undefined;
    const requestHint = (): string => {
      if (hintCount >= exercise.hints.length) return 'Já vimos todas as pistas. Vai com calma e relê os passos!';
      const text = exercise.hints[hintCount++]!;
      const p = document.createElement('p');
      p.textContent = `💡 ${text}`;
      hintBox.append(p);
      if (hint) {
        hint.disabled = hintCount >= exercise.hints.length;
        hint.textContent = hint.disabled ? 'Já tens todas as pistas' : 'Mais uma pista';
      }
      return text;
    };
    if (mode !== 'test' && exercise.hints.length) {
      hint = button('Uma pista', requestHint);
      actions.append(hint);
    }
    main.append(tutorButton({ subject: topic.subject, competencyId: exercise.competencyId, mode,
      compact: true, onTutorOpen: () => abuReact(main,'tutor'), practice: () => startSession(topic.id, 'study', count, undefined, context),
      hint: mode === 'test' ? undefined : requestHint }));
    const abu = document.createElement('aside');
    abu.className = 'abu-line';
    abu.innerHTML = `${abuSvg('think', getState().profile.avatar)}<p>${mode === 'test' ? 'Vai ao teu ritmo. Vemos as respostas no fim.' : 'Pensa com calma. Estou aqui para ajudar!'}</p>`;
    form.append(editor.element, hintBox, feedback, actions);
    main.append(form, abu);
    form.onsubmit = (event) => {
      event.preventDefault();
      const answer = editor.read();
      const result = grade(exercise, answer);
      if (result.invalid) {
        feedback.textContent =
          exercise.kind === 'order'
            ? 'Escolhe todos os elementos pela ordem que te parece certa.'
            : 'Preenche a resposta para continuar.';
        return;
      }
      if (!firstAttempt) {
        firstAttempt = { exercise, answer, result, hints: hintCount };
        attempts.push(firstAttempt);
        update((state) => {
          const save = recordAttempt(state.save, exercise, answer, result.correct, Date.now());
          return {
            ...state,
            save: {
              ...save,
              mastery: {
                ...save.mastery,
                [exercise.competencyId]: updateMastery(
                  save.mastery[exercise.competencyId] ?? emptyMastery(),
                  result,
                  hintCount,
                  Date.now(),
                ),
              },
            },
          };
        });
      }
      if (mode === 'test') {
        next();
        return;
      }
      feedback.replaceChildren();
      feedback.className = `feedback ${result.correct ? 'is-right' : 'is-wrong'}`;
      play(result.correct ? 'correct' : 'wrong');
      const lead = document.createElement('strong');
      lead.textContent = result.correct ? '✓ Muito bem! ' : 'Vamos ver juntos: ';
      const message = document.createElement('p');
      message.append(lead, result.correct ? exercise.explanation : result.feedback);
      feedback.append(message);
      abu.innerHTML = `${abuSvg(result.correct ? 'happy' : 'sit', getState().profile.avatar)}<p>${result.correct ? 'Boa descoberta!' : 'Os erros também ajudam a aprender.'}</p>`;
      abuReact(abu,result.correct?'correct':'wrong');
      actions.replaceChildren();
      if (!result.correct)
        actions.append(
          button('Tentar de novo', () => {
            feedback.textContent = 'Experimenta outra vez. A tua primeira resposta já ficou guardada.';
            actions.replaceChildren(submit);
            if (hint) actions.append(hint);
            editor.element.querySelector<HTMLInputElement>('input')?.focus();
          }),
        );
      actions.append(
        button(
          index + 1 === session.exercises.length ? 'Ver resultado' : 'Próxima pergunta',
          next,
          'primary',
        ),
      );
    };
  };
  navigate(render);
}
