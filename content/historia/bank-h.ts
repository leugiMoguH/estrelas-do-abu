import evidence from '../kb/historia/xviii-evidencia.json';
import { XVIII_EXERCISES } from '../kb/historia/xviii';
import type { KbExercise } from '../kb/schema';
import type { HgpBank, HgpItem, HgpSkill, HgpSource } from './schema';

/**
 * Banco HGP — grupo H: «Portugal no século XVIII» gerado pela fábrica de exercícios (content/kb) a partir de
 * conhecimentos CONFIRMADOS da ficha factual. Determinístico: os factos são fixos, nada é inventado em jogo.
 */
type Ev = { status: string; text: string; sources: { title: string; url: string }[] };
const EV = evidence as Record<string, Ev>;
const kindOf = (url: string): HgpSource['kind'] => {
  const host = new URL(url).hostname;
  if (/wikipedia|infopedia|nationalgeographic|infoescola|mundoeducacao|brasilescola|britannica/.test(host)) return 'enciclopedia';
  if (/museu|arquivo|torre|patrimoniocultural|dgpc|bnportugal|coches/.test(host)) return 'museu-arquivo';
  if (/dge\.mec|unesco|\.gov\./.test(host)) return 'oficial';
  return 'academica';
};
const sourceId = (fact: string, k: number): string => `kb-xviii-${fact.toLowerCase()}-${k + 1}`;

/** Exercícios omitidos por repetirem perguntas já existentes nos bancos anteriores (ver docs/hgp/fabrica). */
const OMITIDOS: readonly string[] = [];

const used = [...new Set(XVIII_EXERCISES.flatMap((e) => e.fichas))].sort();
const sources: HgpSource[] = used.flatMap((f) =>
  (EV[f]?.sources ?? []).map((s, k) => ({ id: sourceId(f, k), title: s.title, url: s.url, accessed: '2026-10-31', kind: kindOf(s.url) })),
);

function toItem(e: KbExercise): HgpItem {
  const common = {
    id: `hgp-seculo-xviii-k-${e.id.replace(/\./g, '-')}`, topic: 'hgp-seculo-xviii' as const, sub: e.sub,
    skill: (e.template === 'verificar-frase' || e.template === 'frase-falsa' ? 'vf' : e.skill) as HgpSkill,
    difficulty: e.level, prompt: e.prompt, hints: e.hints, explanation: e.explanation,
    sources: e.fichas.flatMap((f) => (EV[f]?.sources ?? []).map((_, k) => sourceId(f, k))),
    kb: { knowledge: e.knowledge, reasoning: e.reasoning, template: e.template, fichas: e.fichas },
  };
  switch (e.kind) {
    case 'mcq': return { ...common, kind: 'mcq', options: e.options, correct: e.correct, wrong: e.wrong };
    case 'order': return { ...common, kind: 'order', items: e.items, correct: e.correct };
    case 'numeric': return { ...common, kind: 'numeric', correct: e.correct };
    case 'cloze': return { ...common, kind: 'cloze', correct: e.correct };
  }
}

export const bank: HgpBank = {
  sources,
  items: XVIII_EXERCISES.filter((e) => !OMITIDOS.includes(e.id)).map(toItem),
  lessons: [],
};
