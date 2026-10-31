import type { Competency } from '../../src/core/types';
import type { SubjectId } from '../index';
import { hgpLessons } from '../historia';
import { mathLessons } from './matematica';
import { portugueseLessons } from './portugues';
export interface TutorExample { title: string; steps: string[]; result?: number; compute?: () => number }
export interface TutorLesson {
  id: string; curriculumRef: string; review: 'needs-human-review';
  explanation: string[]; examples: TutorExample[]; checklist: string[]; commonErrors: string[];
}
export interface TutorDef { id: string; name: string; ready: boolean; emoji: string; art?: 'mat' | 'por' | 'his'; lessons: TutorLesson[] }
const planned = (id: string): TutorDef => ({ id, name: 'Tutor em preparação', ready: false, emoji: '🌱', lessons: [] });
export const TUTORS: Record<SubjectId, TutorDef> = {
  matematica: { id: 'nuno', name: 'Professor Nuno', ready: true, emoji: '🧮', art: 'mat', lessons: mathLessons },
  portugues: { id: 'marta', name: 'Marta, a lontra', ready: true, emoji: '📚', art: 'por', lessons: portugueseLessons },
  ingles: planned('ingles'), historia: { id:'tome', name:'Tomé, a tartaruga', ready:true, emoji:'🐢', art:'his', lessons:hgpLessons }, ciencias: planned('ciencias'), evt: planned('evt'), musica: planned('musica'),
};
export function validateLessons(lessons: readonly TutorLesson[], competencies: readonly Competency[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const l of lessons) {
    const c = competencies.find(c => c.id === l.id);
    if (ids.has(l.id) || !c || c.curriculumRef !== l.curriculumRef || l.review !== 'needs-human-review') errors.push(l.id + ': metadados');
    ids.add(l.id);
    if (l.explanation.length < 3 || l.explanation.length > 5 || l.examples.length < 2 || l.checklist.length < 3 || l.checklist.length > 4 || !l.commonErrors.length) errors.push(l.id + ': estrutura');
    const texts = [...l.explanation, ...l.checklist, ...l.commonErrors, ...l.examples.flatMap(e => [e.title, ...e.steps])];
    if (texts.some(t => !t.trim()) || l.examples.some(e => e.steps.length < 2)) errors.push(l.id + ': texto');
    if (l.id.startsWith('mat-') && l.examples.some(e => !e.compute || !Number.isFinite(e.result) || e.compute() !== e.result)) errors.push(l.id + ': cálculo');
  }
  return errors;
}
