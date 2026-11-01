import type { ExerciseTemplate } from '../../src/core/content';
import type { Exercise } from '../../src/core/types';
import { seededRng } from '../../src/core/session';
import type { TutorLesson } from '../tutor';
import type { HgpBank, HgpItem } from './schema';
import { hgpTopics } from './topics';
import { validationOf } from './validacao';
import { D1_SECTION_LESSONS, RECUP_SECTION_LESSONS } from './licoes-secoes';
import { hgpSectionOfItem, hgpSectionById } from './estrutura';

export const hgpBanks = import.meta.glob('./bank-*.ts', { eager: true }) as Record<string, { bank: HgpBank }>;
const banks = Object.values(hgpBanks).map(module => module.bank);
export const hgpItems = banks.flatMap(bank => [...bank.items]);
export const HGP_SOURCES = banks.flatMap(bank => [...bank.sources]);

/** Os factos são fixos; a seed muda apenas a ordem visual das opções. */
export function hgpTemplate(item: HgpItem): ExerciseTemplate {
  return {
    id: item.id,
    competencyId: item.topic,
    conceptId: item.kb?.knowledge[0] ?? item.sub,
    approachId: item.skill,
    skillId: `${item.topic}:${item.skill}`,
    difficulties: [item.difficulty],
    instances: 1,
    review: validationOf(item.id) === 'a-confirmar' ? 'needs-human-review' : 'approved',
    source: item.sources.join(', '),
    generate(seed): Exercise {
      const rng = seededRng(seed);
      const shuffle = (values: readonly string[]): string[] => {
        const copy = [...values];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [copy[i], copy[j]] = [copy[j]!, copy[i]!];
        }
        return copy;
      };
      const errors = item.kind === 'mcq' ? item.wrong : item.kind === 'numeric' ? item.wrongHints ?? {} : {};
      const base = {
        id: item.id,
        competencyId: item.topic,
        difficulty: item.difficulty,
        prompt: item.prompt,
        hints: [...item.hints],
        explanation: item.explanation,
        stimulus: item.stimulus,
        figure: item.figure ? { type: 'pt-map' as const, highlight: [...item.figure.highlight], label: item.figure.label } : undefined,
        commonErrors: Object.entries(errors).map(([match, feedback]) => ({ match, feedback })),
      };
      switch (item.kind) {
        case 'mcq':
          return { ...base, kind: 'mcq', options: shuffle(item.options), correctAnswer: item.correct };
        case 'order':
          return { ...base, kind: 'order', items: shuffle(item.items), correctAnswer: [...item.correct] };
        case 'numeric':
          return { ...base, kind: 'numeric', correctAnswer: item.correct, tolerance: 0, units: item.prompt.includes('%') ? ['%'] : [] };
        case 'cloze':
          return { ...base, kind: 'cloze', correctAnswers: item.correct.map(answers => [...answers]) };
      }
    },
  };
}
export const hgpTemplates = hgpItems.map(hgpTemplate);
export const hgpLessons: TutorLesson[] = banks.flatMap(bank => bank.lessons.map(lesson => ({
  id: lesson.topic,
  curriculumRef: hgpTopics.find(topic => topic.id === lesson.topic)!.curriculumRef!,
  review: 'needs-human-review' as const,
  explanation: [...lesson.explanation],
  examples: lesson.examples.map(example => ({ title: example.title, steps: [...example.steps] })),
  checklist: [...lesson.checklist],
  commonErrors: [...lesson.commonErrors],
  ...(lesson.topic === 'hgp-seculo-xviii' || lesson.topic === 'hgp-recuperacao-5' ? { sections: (lesson.topic === 'hgp-seculo-xviii' ? D1_SECTION_LESSONS : RECUP_SECTION_LESSONS).map(s => ({ id: s.id, title: s.title, explanation: [...s.explanation] })) } : {}),
})));

// Disponível apenas em builds de teste; eliminado do bundle de produção.
if (import.meta.env.MODE === 'hgp-e2e') Object.assign(window, { hgpE2eItems: hgpItems });

export { HGP_CHAPTERS, HGP_SECTIONS, hgpSectionById, hgpChapterOfSection } from './estrutura';
export const HGP_MIN_FUNCTIONAL = 3;
const sectionByItem = new Map(hgpItems.map(item => [item.id, hgpSectionOfItem(item.id, item.topic, item.sub)]));
/** Subcapítulo de uma pergunta (exercício) de HGP. */
export const hgpItemSection = (itemId: string): string | undefined => sectionByItem.get(itemId);
/** Perguntas ativas (fora das «a confirmar»), se há lição e se o subcapítulo é funcional (≥ HGP_MIN_FUNCTIONAL perguntas ativas). */
export function hgpSectionInfo(sectionId: string): { active: number; total: number; lesson: boolean; functional: boolean } {
  const mine = hgpItems.filter(item => sectionByItem.get(item.id) === sectionId);
  const active = mine.filter(item => validationOf(item.id) !== 'a-confirmar').length;
  const topic = HGP_SECTIONS_TOPIC(sectionId);
  const lesson = !!topic && hgpLessons.some(l => l.id === topic && (!l.sections || sectionId.startsWith('prov-') || l.sections.some(s => s.id === sectionId)));
  return { active, total: mine.length, lesson, functional: active >= HGP_MIN_FUNCTIONAL && lesson };
}
function HGP_SECTIONS_TOPIC(sectionId: string): string | undefined {
  return hgpSectionById(sectionId)?.topic;
}
