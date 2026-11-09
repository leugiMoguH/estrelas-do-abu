export interface Section<T extends string = string> {
  id: string;
  title: string;
  official: string;
  topic?: T;
  competencyIds?: readonly string[];
  editorial?: 'confirmado' | 'trabalho';
  provisional?: boolean;
  extra?: boolean;
  lessonId?: string;
}
export interface Chapter<S extends Section = Section> {
  id: string;
  title: string;
  editorial?: 'confirmado' | 'trabalho';
  pages?: string;
  pending?: string;
  sections: readonly S[];
}
export type Availability = 'exercicios' | 'licao' | 'preparacao';
export const availability = (exercises: number, lesson: boolean): Availability => exercises > 0 ? 'exercicios' : lesson ? 'licao' : 'preparacao';

export const sectionModeAllowed = (status: Availability, mode: 'study' | 'test' | 'review'): boolean => status === 'exercicios' || (status === 'licao' && mode === 'study');
