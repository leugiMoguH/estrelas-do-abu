import type { ContentPack } from '../src/core/content';
import { mathTemplates } from './matematica';
import { portugueseTemplates } from './portugues';

export interface Topic {
  id: string;
  subject: 'matematica' | 'portugues';
  title: string;
  blurb: string;
  icon: string;
  competencyIds: string[];
}
export const TOPICS: Topic[] = [
  {
    id: 'racionais',
    subject: 'matematica',
    title: 'Frações e decimais',
    blurb: 'Representar, somar e usar partes de um todo.',
    icon: '🍰',
    competencyIds: ['mat-racionais'],
  },
  {
    id: 'prioridades',
    subject: 'matematica',
    title: 'Prioridades das operações',
    blurb: 'Parênteses, potências e operações pela ordem certa.',
    icon: '🧮',
    competencyIds: ['mat-prioridades'],
  },
  {
    id: 'proporcionalidade',
    subject: 'matematica',
    title: 'Proporcionalidade direta',
    blurb: 'Preços, receitas e escalas com uma razão constante.',
    icon: '⚖️',
    competencyIds: ['mat-proporcionalidade'],
  },
  {
    id: 'classes',
    subject: 'portugues',
    title: 'Classes de palavras',
    blurb: 'Reconhecer nomes, adjetivos e advérbios em contexto.',
    icon: '📚',
    competencyIds: ['pt-classes'],
  },
  {
    id: 'verbos',
    subject: 'portugues',
    title: 'Tempos e modos verbais',
    blurb: 'Ligar as formas verbais ao tempo, à intenção e ao sujeito.',
    icon: '⏳',
    competencyIds: ['pt-verbos'],
  },
  {
    id: 'voz',
    subject: 'portugues',
    title: 'Frase ativa e passiva',
    blurb: 'Transformar frases e descobrir quem pratica a ação.',
    icon: '🔄',
    competencyIds: ['pt-voz'],
  },
];
export type SubjectId = 'matematica' | 'portugues' | 'ingles' | 'historia' | 'ciencias' | 'evt' | 'musica';
export const SUBJECTS: { id: SubjectId; name: string; building: string; active: boolean; tutor?: { id: string; name: string; ready: false } }[] = [
  { id: 'matematica', name: 'Matemática', building: 'Laboratório dos Números', active: true },
  { id: 'portugues', name: 'Português', building: 'Biblioteca', active: true },
  { id: 'ingles', tutor: { id: 'ingles', name: 'Tutor em preparação', ready: false }, name: 'Inglês', building: 'Casa das Línguas', active: false },
  { id: 'historia', tutor: { id: 'historia', name: 'Tutor em preparação', ready: false }, name: 'História', building: 'Museu das Descobertas', active: false },
  { id: 'ciencias', tutor: { id: 'ciencias', name: 'Tutor em preparação', ready: false }, name: 'Ciências', building: 'Jardim das Ciências', active: false },
  { id: 'evt', tutor: { id: 'evt', name: 'Tutor em preparação', ready: false }, name: 'EVT', building: 'Atelier Criativo', active: false },
  { id: 'musica', tutor: { id: 'musica', name: 'Tutor em preparação', ready: false }, name: 'Música', building: 'Estúdio Musical', active: false },
];
export const gamePack: ContentPack & { readonly review: 'approved' } = {
  review: 'approved',
  id: 'estrelas',
  version: '1.0.0',
  curriculumVersion: 'DGE-AE-6-demo-2026',
  competencies: TOPICS.map((topic) => ({
    id: topic.competencyIds[0]!,
    subject: topic.subject === 'matematica' ? 'Matemática' : 'Português',
    grade: 6,
    domain: topic.subject === 'matematica' ? 'Números e Álgebra' : 'Gramática',
    theme: topic.title,
    objective: topic.blurb,
    curriculumRef: `DGE — Aprendizagens Essenciais, 6.º ano: ${topic.title}`,
    prerequisites: [],
  })),
  templates: [...mathTemplates, ...portugueseTemplates],
};

export { TUTORS, validateLessons } from './tutor';
