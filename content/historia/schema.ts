/** Banco verificado de História e Geografia de Portugal (HGP). Sem geração livre: cada item é um facto/competência revisto. */
export type HgpTopicId =
  | 'hgp-seculo-xviii' | 'hgp-liberalismo' | 'hgp-xix-segunda-metade'
  | 'hgp-republica' | 'hgp-ditadura' | 'hgp-25-abril'
  | 'hgp-populacao' | 'hgp-lugares' | 'hgp-atividades' | 'hgp-lazer' | 'hgp-mundo';
export type HgpSkill =
  | 'facto' | 'causa' | 'consequencia' | 'cronologia' | 'comparacao'
  | 'fonte' | 'mapa' | 'vf' | 'personagem' | 'conceito' | 'opiniao';
export interface HgpSource { id: string; title: string; url: string; accessed: string; kind: 'oficial' | 'enciclopedia' | 'academica' | 'museu-arquivo' | 'estatistica' }
/** Figura gerada pelo código (não por IA): mapa de Portugal com distritos/ilhas destacados (ids em minúsculas sem acentos: braga, faro, acores, madeira...). */
export type HgpFigure = { type: 'pt-map'; highlight: readonly string[]; label?: string };
interface Common {
  id: string; topic: HgpTopicId; sub: string; skill: HgpSkill; difficulty: 1 | 2 | 3;
  prompt: string; stimulus?: string; figure?: HgpFigure;
  hints: readonly string[]; explanation: string; sources: readonly string[];
}
export type HgpItem = Common & (
  | { kind: 'mcq'; options: readonly string[]; correct: string; wrong: Readonly<Record<string, string>> }
  | { kind: 'order'; items: readonly string[]; correct: readonly string[] }
  | { kind: 'numeric'; correct: number; wrongHints?: Readonly<Record<string, string>> }
  | { kind: 'cloze'; correct: readonly (readonly string[])[] }
);
export interface HgpLesson {
  topic: HgpTopicId; explanation: readonly string[]; examples: readonly { title: string; steps: readonly string[] }[];
  checklist: readonly string[]; commonErrors: readonly string[]; sources: readonly string[];
}
export interface HgpBank { sources: readonly HgpSource[]; items: readonly HgpItem[]; lessons: readonly HgpLesson[] }
