/**
 * Banco de conhecimentos verificáveis (partilhado por todas as disciplinas) e fábrica de exercícios.
 * Disciplina → Ano → Competência → Capítulo → Subcapítulo → Conhecimento → Exercícios.
 * Os factos são fixos e verificados; a fábrica só combina conhecimentos já verificados (nunca inventa factos).
 */
export type Level = 1 | 2 | 3; // 1 inicial · 2 intermédio · 3 avançado
export const LEVEL_NAMES = { 1: 'inicial', 2: 'intermédio', 3: 'avançado' } as const;

export type Reasoning =
  | 'reconhecer' // identificar um facto entre opções
  | 'verificar' // avaliar se uma afirmação está certa e corrigi-la
  | 'recordar' // produzir a resposta sem opções
  | 'calcular' // combinar dois conhecimentos datados numa operação
  | 'ordenar' // sequência cronológica ou causal
  | 'relacionar' // causa, finalidade, consequência
  | 'comparar' // posicionar conhecimentos uns face aos outros
  | 'classificar' // pertença a uma categoria / exceção
  | 'inferir'; // aplicar conhecimentos a um caso novo

export type Verification = 'confirmado' | 'parcial' | 'discutido';

/** Uma unidade de conhecimento verificável, com a ligação exata à evidência (identificadores Fn da ficha factual). */
export interface Atom {
  readonly id: string;
  readonly fichas: readonly string[]; // evidência: Fn da ficha factual (docs/hgp/seculo-xviii-factos.md)
  readonly sub: string; // subcapítulo (sufixo do id da secção)
  readonly skill: string; // competência trabalhada
  readonly ask: string; // pergunta direta
  readonly answer: string;
  readonly statement: string; // frase completa com «___» no lugar da resposta
  readonly wrong: readonly string[]; // distratores falsos (revistos à mão); vazio em atomos de ano (gerados)
  readonly note?: string; // porquê (alimenta a explicação)
  readonly year?: number; // acontecimento com ano exato
  readonly event?: string; // nome curto do acontecimento («o terramoto de Lisboa»)
  readonly accept?: readonly string[]; // respostas equivalentes para texto livre
  readonly level?: Level; // dificuldade do reconhecimento (por omissão 1)
  readonly cloze?: boolean; // gera também exercício de resposta livre
  readonly hint?: string;
}

type Common = {
  readonly id: string;
  readonly knowledge: readonly string[]; // átomos testados
  readonly fichas: readonly string[];
  readonly sub: string;
  readonly skill: string;
  readonly level: Level;
  readonly reasoning: Reasoning;
  readonly template: string;
  readonly prompt: string;
  readonly hints: readonly string[];
  readonly explanation: string;
};
export type KbExercise = Common &
  (
    | { readonly kind: 'mcq'; readonly options: readonly string[]; readonly correct: string; readonly wrong: Readonly<Record<string, string>> }
    | { readonly kind: 'order'; readonly items: readonly string[]; readonly correct: readonly string[] }
    | { readonly kind: 'numeric'; readonly correct: number }
    | { readonly kind: 'cloze'; readonly correct: readonly (readonly string[])[] }
  );
