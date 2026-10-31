import type { ExerciseRef, ReviewStatus } from './content';
export type Kind = 'mcq' | 'numeric' | 'text' | 'order' | 'cloze';
export interface Competency {
  readonly id: string;
  readonly subject: string;
  readonly grade: number;
  readonly domain: string;
  readonly theme: string;
  readonly objective: string;
  readonly curriculumRef: string;
  readonly prerequisites: readonly string[];
}
interface Base {
  readonly review?: ReviewStatus;
  readonly ref?: ExerciseRef;
  readonly conceptId?: string;
  readonly approachId?: string;
  readonly stimulus?: string;
  readonly figure?: { type: "pt-map"; highlight: readonly string[]; label?: string };
  readonly id: string;
  readonly competencyId: string;
  readonly difficulty: 1 | 2 | 3;
  readonly prompt: string;
  readonly hints: readonly string[];
  readonly explanation: string;
  readonly commonErrors: readonly { readonly match: string; readonly feedback: string }[];
}
export type Exercise = Base &
  (
    | { readonly kind: 'mcq'; readonly options: readonly string[]; readonly correctAnswer: string }
    | {
        readonly kind: 'numeric';
        readonly correctAnswer: number;
        readonly tolerance?: number;
        readonly units?: readonly string[];
      }
    | { readonly kind: 'text'; readonly correctAnswers: readonly string[]; readonly ignoreAccents?: boolean }
    | { readonly kind: 'order'; readonly items: readonly string[]; readonly correctAnswer: readonly string[] }
    | {
        readonly kind: 'cloze';
        readonly correctAnswers: readonly (readonly string[])[];
        readonly ignoreAccents?: boolean;
      }
  );
export type Answer =
  | { readonly kind: 'mcq' | 'numeric' | 'text'; readonly value: string }
  | { readonly kind: 'order' | 'cloze'; readonly value: readonly string[] };
export type GradeResult =
  | { readonly invalid: true }
  | {
      readonly correct: boolean;
      readonly partial: number;
      readonly feedback: string;
      readonly invalid?: false;
    };
