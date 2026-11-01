import type { KbExercise, Level } from './schema';

interface Focus {
  readonly id: string; readonly sub: string; readonly skill: string;
  readonly knowledge: readonly string[]; readonly fichas: readonly string[];
  readonly explanation: string;
}
export interface Process extends Focus {
  readonly situation: string; readonly causes: readonly string[]; readonly effects: readonly string[]; readonly others: readonly string[];
  readonly direction: 'causa' | 'consequencia';
}
export interface Claim extends Focus { readonly claim: string; readonly evidence: string; readonly irrelevant: readonly string[] }
export interface Doc extends Focus { readonly text: string; readonly conclusion: string; readonly wrong: readonly string[] }
export interface Place extends Focus { readonly highlight: string; readonly question: string; readonly correct: string; readonly wrong: readonly string[] }
export interface Timeline extends Focus { readonly theme: string; readonly steps: readonly string[] }
export interface ReasoningDefs {
  readonly processes: readonly Process[]; readonly claims: readonly Claim[]; readonly docs: readonly Doc[];
  readonly places: readonly Place[]; readonly timelines: readonly Timeline[];
}
const mcq = (f: Focus, template: string, level: Level, reasoning: KbExercise['reasoning'], prompt: string, correct: string, wrong: readonly string[], stimulus?: string): KbExercise => ({
  ...f, explanation: `${correct}. ${f.explanation}`, id: `${f.id}.${template}`, template, level, reasoning, prompt, stimulus, kind: 'mcq', correct,
  options: [correct, ...wrong], wrong: Object.fromEntries(wrong.map(w => [w, f.explanation])),
  hints: ['Identifica o que a pergunta pede.', 'Distingue a informação relevante das outras opções.'],
});
export function reasoningExercises(d: ReasoningDefs): KbExercise[] {
  return [
    ...d.processes.map(p => p.direction === 'causa'
      ? mcq(p, 'processo-causa', 3, 'relacionar', `Que causa ajuda a explicar ${p.situation}?`, p.causes[0]!, [...p.effects, ...p.others].slice(0, 3))
      : mcq(p, 'processo-consequencia', 2, 'relacionar', `Identifica uma consequência neste processo: ${p.situation}.`, p.effects[0]!, [...p.causes, ...p.others].slice(0, 3))),
    ...d.claims.map(c => mcq(c, 'afirmacao-evidencia', 3, 'avaliar', `Que facto sustenta esta afirmação: «${c.claim}»?`, c.evidence, c.irrelevant)),
    ...d.docs.map(d => mcq(d, 'documento-resumo', 3, 'interpretar', 'Que conclusão é sustentada por este resumo?', d.conclusion, d.wrong, `Resumo escrito para o jogo (não é uma transcrição histórica): ${d.text}`)),
    ...d.places.map(p => ({ ...mcq(p, 'mapa', 1, 'reconhecer', p.question, p.correct, p.wrong), figure: { type: 'pt-map' as const, highlight: [p.highlight] } })),
    ...d.timelines.map(t => ({ ...t, id: `${t.id}.timeline`, template: 'ordenar-tematico', level: 2 as const, reasoning: 'ordenar' as const, kind: 'order' as const,
      prompt: `Ordena os acontecimentos de ${t.theme}, do mais antigo para o mais recente.`, items: [...t.steps].reverse(), correct: t.steps,
      hints: ['Procura o início do processo.', 'Relaciona cada acontecimento com o seguinte.'] })),
  ];
}
/** A exigência vem da tarefa cognitiva, nunca do comprimento ou de uma conta com anos. */
export const RUBRIC: Readonly<Record<string, readonly Level[]>> = {
  'reconhecer-mcq': [1], 'verificar-frase': [1], 'recordar-livre': [1], mapa: [1],
  'ordenar-causas': [2], 'ordenar-tematico': [2], 'processo-consequencia': [2], excecao: [2], 'frase-falsa': [2],
  'caso-classificacao': [2], 'caso-periodo': [2], 'caso-transferencia': [3], 'processo-causa': [3], 'afirmacao-evidencia': [3], 'documento-resumo': [3],
};
