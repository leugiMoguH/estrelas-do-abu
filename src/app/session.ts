import { recordProgress, readProgress, templateKey } from '../core/progress';
import type { ExerciseRef } from '../core/content';
import { exerciseSection, filterSections, collectionSelection } from './section-selection';
import {awardCollection, localMonth} from '../core/collections';
import {exerciseSignature} from '../core/grading';
import {completeTransaction} from './store';
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
import { buildSession, seededRng, reconstructErrors } from '../core/session';
import { emptySkill, updateSkill, skillStatus, skillDue } from '../core/skills';
import { dueCompetencies } from '../core/review';
import type { Answer, Exercise, GradeResult } from '../core/types';
import { answerEditor } from './answers';
import { play } from './audio';
import { button, escape, frame, navigate } from './router';
import { getState, update } from './store';
import { openRoom } from './room';
import { openResult } from './result';

import { ptMapSvg } from './figure';
/** sectionIds: subcapítulos escolhidos (HGP); só entram perguntas desses subcapítulos. */
export interface SessionContext { subject: string; topicIds: string[]; competencyIds: string[]; title: string; sectionIds?: string[]; errorRefs?: ExerciseRef[] }
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
  const beforeState = getState();
  const before = beforeState.save;
  const testParams = import.meta.env.MODE === 'hgp-e2e' ? new URLSearchParams(location.search) : undefined;
  const rng = seededRng(testParams?.has('hgpSeed') ? Number(testParams.get('hgpSeed')) : Date.now());
  const ids = competencyIds?.length ? competencyIds : context?.competencyIds ?? topic.competencyIds;
  const selectedPack = { ...gamePack, templates: gamePack.templates.filter(t => ids.includes(t.competencyId)
    && (!context?.sectionIds || context.sectionIds.includes(exerciseSection(topic.subject, t.id) ?? ''))
    && (!context?.errorRefs || context.errorRefs.some(r => r.templateId === t.id && r.packId === gamePack.id && r.packVersion === gamePack.version))) };
  const pool = ([1, 2, 3] as const).flatMap(difficulty => materialize({ ...selectedPack, templates: selectedPack.templates.filter(t => t.difficulties.includes(difficulty)) }, {
    competencyIds: ids, rng, perTemplate: mode === 'test' ? 24 : 4, difficultyFor: () => difficulty,
  }));
  const filteredPool = filterSections(testParams?.has('hgpIds') && topic.subject === 'historia' ? pool.filter(e => testParams.get('hgpIds')!.split(',').includes(e.id)) : pool, topic.subject, context?.sectionIds);
  const limit = mode === 'test' || before.seen.length ? count : 3;
  const { exercises: exact, unavailable } = reconstructErrors(selectedPack, context?.errorRefs ?? []);
  const errorTemplates = new Set(exact.map(e => e.ref!.templateId));
  const sessionPool = context?.errorRefs ? filteredPool.filter(e => errorTemplates.has(e.ref!.templateId)) : filteredPool;
  const chosen: Exercise[] = [];
  const reviewIds = [...new Set([...dueCompetencies(before.mastery, Date.now(), ids), ...ids.filter(id => sessionPool.some(e => e.competencyId === id && skillDue(beforeState.skills[e.skillId ?? e.competencyId], Date.now())))])];
  const choose = (n: number): readonly Exercise[] => {
    const current = getState();
    const pending = readProgress(current.save).pending;
    return buildSession({
    mode, pool: context?.errorRefs ? sessionPool.filter(e => !!pending[templateKey(e.ref!)]) : sessionPool,
    competencyIds: ids, n, state: current.save.mastery, rng, now: Date.now(), history: current.save.seen,
    skills: current.skills, selected: chosen, reviewIds,
    recentWindow: topic.subject === 'historia' && context?.sectionIds ? 60 : undefined,
    repeatPenalty: topic.subject === 'historia' && context?.sectionIds ? 40 : undefined,
    groupOf: context?.sectionIds ? e => exerciseSection(topic.subject, e) ?? e.competencyId : undefined,
    }).exercises;
  };
  if (context?.errorRefs) chosen.push(...exact.slice(0, limit));
  else chosen.push(...choose(mode === 'test' ? limit : 1));
  const session = { exercises: chosen };
  update({ lastTopicId: topicId });
  let index = 0;
  let hintCount = 0;
  const attempts: Attempt[] = [];
  let firstAttempt: Attempt | undefined;
  const attemptId=crypto.randomUUID();
  let completed = false;
  let completionStamp: Date | undefined;
  let completionTimezone: string | undefined;
  const finish = async (): Promise<void> => {
    if (completed) return;
    completed = true;
    const summary = score(attempts.map((a) => ({ competencyId: a.exercise.competencyId, result: a.result })));
    const current = getState().save;
    const levels = ['discovering', 'practising', 'progressing', 'consolidated', 'review'];
    let earned=0;
    const completedAt=completionStamp??=new Date();
    const timezone=completionTimezone??=Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
    await completeTransaction(latest=>{
      const existing=latest.receipts.find(r=>r.attempt.id===attemptId);
      if(existing){earned=existing.stars;return latest;}
      const reward=rewardSession(latest,{completed:true,competencies:[...new Set(attempts.map(a=>a.exercise.competencyId))].map(id=>({competencyId:id,isNew:!before.mastery[id]?.attempts,improved:levels.indexOf(current.mastery[id]?.level??'discovering')>levels.indexOf(before.mastery[id]?.level??'discovering')}))},completedAt.getTime());
      earned=reward.earned;
      return awardCollection(reward.save,{id:attemptId,month:localMonth(completedAt.getFullYear(),completedAt.getMonth()),timezone,selection:collectionSelection(topic.subject,ids,context),mode,completed:true,questions:attempts.map(a=>({signature:exerciseSignature(a.exercise),valid:!a.result.invalid && a.exercise.review!=='needs-human-review',credit:a.result.invalid?0:a.result.partial}))},Math.random,reward.earned).save;
    });
    } catch {
      completed=false;
      const note=document.createElement('p');note.setAttribute('role','alert');note.textContent='Não foi possível guardar o resultado. Mantém esta página aberta e tenta novamente.';
      document.querySelector('main')?.append(note,button('Tentar guardar novamente',()=>{void finish();}));return;
    }
    update(state=>({...state,bestTestGrade:mode==='test'?Math.max(state.bestTestGrade,summary.grade):state.bestTestGrade}));
    play('stars');
    openResult({ topicId, mode, attempts, summary, earned, context, attemptId });
  };
  const next = (): void => {
    index++;
    hintCount = 0;
    firstAttempt = undefined;
    if (mode !== 'test' && chosen.length < limit && index >= chosen.length) chosen.push(...choose(1));
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
    if(mode==='test' && session.exercises.length<10){const warning=document.createElement('p');warning.setAttribute('role','status');warning.textContent='Este teste tem menos de 10 perguntas distintas e não permite ganhar artigos mensais. Podes continuar a aprender livremente.';main.append(warning);}
    if (unavailable) main.insertAdjacentHTML('beforeend', `<p>${unavailable} erro(s) indisponível(is): pacote, versão ou aprovação incompatível.</p>`);
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
      `<div class="question-progress"><span>${mode === 'test' ? 'Teste' : mode === 'review' ? 'Rever' : 'Estudar'} · Pergunta ${index + 1} de ${mode === 'test' ? session.exercises.length : limit}</span><progress value="${index + 1}" max="${mode === 'test' ? session.exercises.length : limit}" aria-label="Progresso da sessão"></progress></div>`,
    );
    const form = document.createElement('form');
    form.className = 'panel question';
    if (exercise.stimulus)
      form.innerHTML = `<blockquote class="stimulus">${escape(exercise.stimulus)}</blockquote>`;
    form.insertAdjacentHTML('beforeend', `<h2>${escape(exercise.prompt)}</h2>`);
    if (exercise.figure) form.insertAdjacentHTML('beforeend', ptMapSvg(exercise.figure.highlight, exercise.figure.label));
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
    main.append(tutorButton({ subject: topic.subject, competencyId: exercise.competencyId, mode, sectionIds: context?.sectionIds,
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
          const at = Date.now();
          const save = recordProgress(recordAttempt(state.save, exercise, answer, result.correct, at), exercise, result.correct, hintCount, at, exerciseSection(topic.subject, exercise));
          const sid = exercise.skillId ?? exercise.competencyId;
          return {
            ...state,
            skills: sid
              ? { ...state.skills, [sid]: updateSkill(state.skills[sid] ?? emptySkill(), { correct: result.correct, difficulty: exercise.difficulty, hints: hintCount, conceptId: exercise.conceptId, now: Date.now() }) }
              : state.skills,
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
        submit.disabled=true;
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
      const skill = getState().skills[exercise.skillId ?? exercise.competencyId];
      if (skillStatus(skill) === 'persistente') feedback.append(' Podes abrir o tutor para vermos esta matéria juntos.');
      else if (skill?.recent.slice(-3).length === 3 && skill.recent.slice(-3).every(v => !v)) feedback.append(' Experimenta uma pista ou a lição no tutor.');
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
          index + 1 >= limit ? 'Ver resultado' : 'Próxima pergunta',
          next,
          'primary',
        ),
      );
    };
  };
  navigate(render);
}
