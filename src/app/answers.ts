import type { Answer, Exercise } from '../core/types';
import { button, escape } from './router';

export interface AnswerEditor {
  element: HTMLElement;
  read: () => Answer;
}
export function answerEditor(exercise: Exercise): AnswerEditor {
  const element = document.createElement('div');
  element.className = 'answer-editor';
  if (exercise.kind === 'mcq') {
    let value = '';
    element.setAttribute('role', 'group');
    element.setAttribute('aria-label', 'Escolhe uma resposta');
    exercise.options.forEach((option) => {
      const choice = button(
        option,
        () => {
          value = option;
          element
            .querySelectorAll('button')
            .forEach((b) => b.setAttribute('aria-pressed', String(b === choice)));
        },
        'answer-choice',
      );
      choice.setAttribute('aria-pressed', 'false');
      element.append(choice);
    });
    return { element, read: () => ({ kind: 'mcq', value }) };
  }
  if (exercise.kind === 'order') {
    const values: string[] = [];
    const chosen = document.createElement('ol');
    chosen.setAttribute('aria-live', 'polite');
    const available = document.createElement('div');
    available.className = 'order-options';
    const render = (): void => {
      chosen.innerHTML = values.map((value) => `<li>${escape(value)}</li>`).join('');
      available.replaceChildren();
      exercise.items.forEach((item) => {
        const choice = button(item, () => {
          values.push(item);
          render();
        });
        choice.disabled = values.includes(item);
        available.append(choice);
      });
    };
    element.innerHTML = '<p>Toca nos elementos pela ordem certa. Podes desfazer.</p>';
    element.append(
      chosen,
      available,
      button('Desfazer último', () => {
        values.pop();
        render();
      }),
    );
    render();
    return { element, read: () => ({ kind: 'order', value: [...values] }) };
  }
  const count = exercise.kind === 'cloze' ? exercise.correctAnswers.length : 1;
  const inputs = Array.from({ length: count }, (_, index) => {
    const label = document.createElement('label');
    label.textContent = count > 1 ? `Espaço ${index + 1}` : 'A tua resposta';
    const input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.maxLength = 500;
    if (exercise.kind === 'numeric') input.inputMode = 'decimal';
    label.append(input);
    element.append(label);
    return input;
  });
  return {
    element,
    read: () =>
      exercise.kind === 'cloze'
        ? { kind: 'cloze', value: inputs.map((input) => input.value) }
        : { kind: exercise.kind, value: inputs[0]!.value },
  };
}
