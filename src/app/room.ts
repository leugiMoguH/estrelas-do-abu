import { PT_CHAPTERS, PT_SECTIONS, ptSectionById, ptSectionInfo } from '../../content/portugues/estrutura';
import { pendingErrors, exerciseSection } from './section-selection';
import { sectionModeAllowed } from '../../content/estrutura';
import { MAT_CHAPTERS, MAT_SECTIONS, matSectionById, matSectionInfo } from '../../content/matematica/estrutura';
import {seededRng} from '../core/session';
import {materialize} from '../core/content';
import {exerciseSignature} from '../core/grading';
import {collectionPanel} from './collection-ui';
import { startAbuLife } from './abu-life';
import { abuSvg } from '../art';
import { tutorButton, setTutorMode } from './tutor';
import { roomSvg } from '../art';
import { TOPICS, SUBJECTS, gamePack, HGP_SECTIONS, hgpSectionById, hgpSectionInfo } from '../../content';
import { renderSubjectTree } from './subject-tree';
import { dueCompetencies } from '../core/review';
import { button, escape, frame, navigate } from './router';
import { getState } from './store';
import { openMap } from './map';
import { startSession, type Mode, type SessionContext } from './session';

/** Atalho do teste escolar: abre uma sessão só com o capítulo «Portugal no século XVIII» (20 perguntas; 3 na primeira aventura). */
export function startHgpChapter(): void {
  startSession('hgp-seculo-xviii', 'study', 20, undefined, {
    subject: 'historia',
    topicIds: ['hgp-seculo-xviii'],
    competencyIds: ['hgp-seculo-xviii'],
    title: 'Portugal no século XVIII',
    sectionIds: d1Sections(),
  });
}
/** Subcapítulos funcionais do D1 (sem o complemento das AE, que não consta do índice confirmado). */
function d1Sections(): string[] {
  return HGP_SECTIONS.filter((section) => section.topic === 'hgp-seculo-xviii' && !section.extra && hgpSectionInfo(section.id).functional).map((section) => section.id);
}
function initialHgpSections(context: SessionContext | undefined, topicId: string | undefined): string[] {
  const ok = (id: string): boolean => hgpSectionInfo(id).functional;
  if (context?.sectionIds?.length) return context.sectionIds.filter(ok);
  const topics = context?.topicIds ?? (topicId ? [topicId] : []);
  const mine = HGP_SECTIONS.filter((section) => section.topic && topics.includes(section.topic) && !section.extra && ok(section.id)).map((section) => section.id);
  return mine.length ? mine : d1Sections();
}

export function openRoom(subject: string, topicId?: string, context?: SessionContext): void {
  const topics = TOPICS.filter((topic) => topic.subject === subject);
  let selected = topics.find((topic) => topic.id === (topicId ?? getState().lastTopicId)) ?? topics[0];
  const multi = topics.length > 4 || subject === 'portugues';
  const chosen = new Set(context?.topicIds ?? (selected ? [selected.id] : []));
  const hgp = subject === 'historia';
  const mat = subject === 'matematica';
  const pt = subject === 'portugues';
  const tree = hgp || mat || pt;
  const sections = pt ? PT_SECTIONS : MAT_SECTIONS;
  const sectionInfo = pt ? ptSectionInfo : matSectionInfo;
  const sectionById = pt ? ptSectionById : mat ? matSectionById : hgpSectionById;
  const chosenSections = new Set<string>(hgp ? initialHgpSections(context, topicId ?? getState().lastTopicId ?? undefined) : (mat || pt) ? (context?.sectionIds ?? [sections.find(s => s.competencyIds?.some(id => selected?.competencyIds.includes(id)))?.id ?? sections[0]!.id]) : []);
  const chapterOpen = new Map<string, boolean>();
  let filter: 'all' | 'recuperacao5' | '6' = 'all';
  const groupOpen = new Map<string | undefined, boolean>();
  let mode: Mode = 'study';
  let count = getState().save.seen.length ? 5 : 3;
  const render = (): void => {
    const focusId = (document.activeElement as HTMLElement | null)?.dataset.focusId;
    setTutorMode(mode);
    const main = frame(SUBJECTS.find((s) => s.id === subject)?.building ?? 'A tua sala', openMap);
    if (subject === 'historia') {
      const note = document.createElement('p');
      note.className = 'edition-note';
      note.setAttribute('role', 'note');
      note.textContent = 'Versão provisória de estudo — revisão independente pendente. Não cobre todas as páginas do manual.';
      main.append(note);
    }
    main.insertAdjacentHTML(
      'beforeend',
      topics.length ? `<div class="room-art">${roomSvg(subject)}<div class="room-abu">${abuSvg('sit', getState().profile.avatar)}</div></div><h2>O que vamos descobrir?</h2>` : '<p>Esta disciplina está em preparação.</p>',
    );
    startAbuLife(main, false);
    const cards = document.createElement('div');
    cards.className = 'topic-grid';
    if (tree) {
      chosen.clear();
      for (const id of chosenSections) { const section = sectionById(id); for (const t of topics) if (section?.topic === t.id || section?.competencyIds?.some(c => t.competencyIds.includes(c))) chosen.add(t.id); }
      renderSubjectTree(main, { chosen: chosenSections, open: chapterOpen, focusId, rerender: render, ...(pt ? { chapters: PT_CHAPTERS, info: ptSectionInfo } : mat ? { chapters: MAT_CHAPTERS, info: matSectionInfo } : {}) });
      selected = topics.find((t) => t.id === [...chosen][0]) ?? topics[0];
    } else if (multi) {
      const filters = document.createElement('div');
      for (const [id,label] of [['all','Tudo'],['6','6.º ano']] as const) {
        const control = button(label,()=>{ filter=id; for (const t of topics) if (id !== 'all' && t.level !== id) chosen.delete(t.id); render(); });
        control.dataset.focusId=`filter-${id}`; control.setAttribute('aria-pressed',String(filter===id)); filters.append(control);
      }
      const visible = topics.filter(t=>filter==='all'||t.level===filter);
      const mix = button('Mistura',()=>{visible.forEach(t=>chosen.add(t.id));render();}); mix.dataset.focusId='mix';
      const clear = button('Limpar',()=>{chosen.clear();render();}); clear.dataset.focusId='clear';
      filters.append(mix,clear); main.append(filters);
      const counter=document.createElement('p');counter.setAttribute('role','status');counter.textContent=`${chosen.size} temas escolhidos`;main.append(counter);
      for (const group of new Set(visible.map(t=>t.group))) {
        const members = visible.filter(t=>t.group===group);
        const field=document.createElement('details');field.className='topic-group';
        const summary=document.createElement('summary');summary.dataset.focusId=`group-${group}`;
        const selectedCount=members.filter(t=>chosen.has(t.id)).length;
        summary.textContent=`${group ?? 'Temas'}: ${selectedCount}/${members.length} escolhidos`;
        field.open=groupOpen.get(group) ?? (selectedCount>0 || group===visible[0]?.group);
        if(members.some(t=>focusId===`topic-${t.id}`))field.open=true;
        field.ontoggle=()=>{if(field.isConnected)groupOpen.set(group,field.open);};
        field.append(summary);
        const grid=document.createElement('div');grid.className='topic-grid';
        for(const topic of members) {
          const label=document.createElement('label');label.className='topic-card';
          const input=document.createElement('input');input.type='checkbox';input.checked=chosen.has(topic.id);input.dataset.focusId=`topic-${topic.id}`;
          input.onchange=()=>{if(input.checked)chosen.add(topic.id);else chosen.delete(topic.id);render();};
          label.append(input);
          const text=document.createElement('span');
          const title=document.createElement('strong');title.textContent=`${topic.icon} ${topic.title}`;
          const blurb=document.createElement('span');blurb.textContent=topic.blurb;
          text.append(title,blurb);label.append(text);grid.append(label);
        }
        field.append(grid);main.append(field);
      }
      selected=topics.find(t=>t.id===[...chosen][0]) ?? topics[0];
    } else {
    topics.forEach((topic) => {
      const card = button(
        '',
        () => {
          selected = topic;
          render();
        },
        'topic-card',
      );
      card.dataset.focusId = `topic-${topic.id}`;
      card.innerHTML = `<span class="topic-icon">${escape(topic.icon)}</span><strong>${escape(topic.title)}</strong><span>${escape(topic.blurb)}</span>`;
      card.setAttribute('aria-pressed', String(selected?.id === topic.id));
      cards.append(card);
    });
    }
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
      choice.disabled = (mat || pt) && [...chosenSections].some(s => !sectionModeAllowed(sectionInfo(s).status, id));
      choice.dataset.focusId = `mode-${id}`;
      choice.innerHTML = `<strong>${label}</strong><span>${description}</span>`;
      choice.setAttribute('aria-pressed', String(mode === id));
      modes.append(choice);
    }
    main.append(modes);
    const counts = document.createElement('fieldset');
    counts.innerHTML = '<legend>Quantas perguntas?</legend>';
    (multi ? [3, 5, 8, 10, 12, 20] : [3, 5, 8, 10, 12]).forEach((n) => {
      const choice = button(String(n), () => {
        count = n;
        render();
      });
      choice.dataset.focusId = `count-${n}`;
      choice.disabled = mode !== 'test' && !getState().save.seen.length && n !== 3;
      choice.setAttribute('aria-pressed', String(count === n));
      counts.append(choice);
    });
    main.append(counts);
    main.append(collectionPanel());
    if (hgp && chosenSections.size > count) {
      const note = document.createElement('p');
      note.setAttribute('role', 'status');
      note.textContent = `Escolheste ${chosenSections.size} subcapítulos, mas só vais ter ${count} perguntas: nem todos vão ser perguntados.`;
      main.append(note);
    } else if (multi && !hgp && chosen.size > count) {
      const note = document.createElement('p');
      note.setAttribute('role', 'status');
      note.textContent = `Escolheste ${chosen.size} temas, mas só vais ter ${count} perguntas: nem todos os temas vão ser perguntados.`;
      main.append(note);
    }
    if (mode !== 'test' && !getState().save.seen.length)
      main.insertAdjacentHTML(
        'beforeend',
        '<p>Na tua primeira aventura são só 3 perguntas. Vamos com calma!</p>',
      );
    if (selected) {
      const topic = selected;
      const selectedTopics = multi ? [...chosen].flatMap(id=>topics.filter(t=>t.id===id)) : [topic];
      const ids=selectedTopics.flatMap(t=>t.competencyIds);
      const selection: SessionContext | undefined = multi ? {subject,topicIds:selectedTopics.map(t=>t.id),competencyIds:ids,title:selectedTopics.length===topics.length?'Mistura de temas':selectedTopics.length===1?topic.title:`${selectedTopics.length} temas`,...(tree?{sectionIds:[...chosenSections]}:{})} : undefined;
      if (selection && tree) selection.title = chosenSections.size === 1 ? (sectionById([...chosenSections][0]!)?.title ?? topic.title) : `${chosenSections.size} subcapítulos`;
      if(mode==='test') {
        const pool=materialize(gamePack,{competencyIds:ids,rng:seededRng(42),perTemplate:24,difficultyFor:t=>t.difficulties[0]!}).filter(e=>e.review!=='needs-human-review' && (!tree || chosenSections.has(exerciseSection(subject, e)??'')));
        const available=new Set(pool.map(exerciseSignature)).size;
        if(available<10) {const warning=document.createElement('p');warning.setAttribute('role','status');warning.textContent=`Este banco disponibiliza apenas ${available} perguntas distintas nesta amostra: pode não permitir os 10 itens necessários para prémios. Podes fazer o teste livremente.`;main.append(warning);}
      }
      const begin=(nextMode: Mode, subset?: readonly string[]):void=>{
        if ((mat || pt) && [...chosenSections].some(s => !sectionModeAllowed(sectionInfo(s).status, nextMode))) return;
        if ((mat || pt) && [...chosenSections].some(s => sectionInfo(s).status === 'licao')) { tutor.click(); return; }
        if(selectedTopics.length)startSession(topic.id,nextMode,count,subset,selection);
      };
      const tutor = tutorButton({ subject: topic.subject, competencyId: (mat ? matSectionById([...chosenSections][0] ?? '')?.lessonId : undefined) ?? topic.competencyIds[0]!, mode, scene: true, sectionIds: tree ? [...chosenSections] : undefined, practice: () => begin('study') });
      if (mode === 'test') main.append(tutor);
      else main.querySelector('.room-art')?.append(tutor);
      const due = dueCompetencies(getState().save.mastery, Date.now(), ids);
      main.append(
        button(
          mode === 'test' ? 'Começar o teste' : mode === 'review' ? 'Começar a rever' : 'Começar a estudar',
          () => begin(mode, mode === 'review' ? due : undefined),
          'primary sticky-cta',
        ),
      );
      const start = main.querySelector<HTMLButtonElement>('.sticky-cta');
      if(start)start.disabled=selectedTopics.length===0 || ((mat || pt) && [...chosenSections].some(s => !sectionModeAllowed(sectionInfo(s).status, mode)));
      const refs = pendingErrors(getState().save, subject, ids, tree ? [...chosenSections] : undefined);
      if (refs.length) main.append(button('Estudar os erros', () => startSession(topic.id, 'study', count, ids, {
        ...(selection ?? { subject, topicIds: [topic.id], competencyIds: ids, title: topic.title }), errorRefs: refs,
      })));

    }
    if (focusId) main.querySelector<HTMLElement>(`[data-focus-id="${CSS.escape(focusId)}"]`)?.focus();
  };
  navigate(render);
}
