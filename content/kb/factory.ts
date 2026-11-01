import { reasoningExercises, type ReasoningDefs } from './reasoning';
import { seededRng } from '../../src/core/session';
import type { Atom, KbExercise, Level, Reasoning } from './schema';

/** Definições multi-conhecimento (escritas à mão, com os átomos que usam). */
export interface Pair { readonly id: string; readonly a: string; readonly b: string; readonly sub: string; readonly skill?: string }
export interface Chain { readonly id: string; readonly sub: string; readonly skill: string; readonly atoms: readonly string[]; readonly fichas: readonly string[]; readonly steps: readonly string[]; readonly level: Level; readonly why: string; readonly theme: string }
export interface SetMember { readonly label: string; readonly why: string; readonly atoms?: readonly string[]; readonly fichas: readonly string[] }
export interface SetDef { readonly id: string; readonly sub: string; readonly skill: string; readonly stem: string; readonly members: readonly SetMember[]; readonly outsiders: readonly SetMember[]; readonly count: number; readonly summary: string; readonly level?: Level }
export interface Case {
  readonly id: string; readonly sub: string; readonly skill: string; readonly level: Level; readonly reasoning: Reasoning;
  readonly knowledge: readonly string[]; readonly fichas: readonly string[]; readonly prompt: string; readonly stimulus?: string;
  readonly correct: string | number; readonly wrong?: Readonly<Record<string, string>>; readonly explanation: string; readonly hints: readonly string[];
}
export interface Defs extends ReasoningDefs { readonly subTitle: Readonly<Record<string, string>>; readonly pairs: readonly Pair[]; readonly chains: readonly Chain[]; readonly sets: readonly SetDef[]; readonly cases: readonly Case[]; readonly orders: number; readonly compares: number; readonly falseOfFour: number }

export const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
const hash = (s: string): number => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const rngFor = (key: string) => seededRng(hash(key));
function shuffle<T>(xs: readonly T[], rng: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
  return a;
}
const fill = (statement: string, value: string): string => statement.replace('___', value);
const OFFSETS = [-30, -20, -12, -9, -7, -5, -3, -2, -1, 1, 2, 3, 4, 5, 7, 9, 12, 20, 30];

/** Distratores de ano: um próximo, um intermédio e um afastado (nunca o ano certo). */
function yearWrongs(year: number, rng: () => number): string[] {
  const pool = OFFSETS.map((o) => year + o).filter((y) => y > 1500 && y <= 2026);
  const near = shuffle(pool.filter((y) => Math.abs(y - year) <= 3), rng)[0];
  const mid = shuffle(pool.filter((y) => Math.abs(y - year) > 3 && Math.abs(y - year) <= 9), rng)[0];
  const far = shuffle(pool.filter((y) => Math.abs(y - year) > 9), rng)[0];
  return [near, mid, far].filter((y): y is number => y !== undefined).map(String);
}
const wrongsOf = (a: Atom, rng: () => number, n = 3): string[] =>
  a.year !== undefined && a.wrong.length === 0 ? yearWrongs(a.year, rng).slice(0, n) : shuffle(a.wrong, rng).slice(0, n);

const baseHints = (defs: Defs, a: Atom): string[] => [a.hint ?? `Tema: ${defs.subTitle[a.sub] ?? a.sub}.`, 'Elimina primeiro as opções que sabes que estão erradas.'];
const feedbackFor = (a: Atom, w: string): string => `«${w}» não responde corretamente. ${a.note ?? ''}`.trim();
const answerText = (a: Atom): string => a.answer;

function recognise(defs: Defs, a: Atom): KbExercise {
  const rng = rngFor(`rec-${a.id}`);
  const wrong = wrongsOf(a, rng);
  return {
    id: `${a.id}.mcq`, knowledge: [a.id], fichas: a.fichas, sub: a.sub, skill: a.skill, level: 1, reasoning: 'reconhecer', template: 'reconhecer-mcq',
    kind: 'mcq', prompt: a.ask, options: [cap(answerText(a)), ...wrong.map(cap)], correct: cap(answerText(a)),
    wrong: Object.fromEntries(wrong.map((w) => [cap(w), feedbackFor(a, w)])), hints: baseHints(defs, a),
    explanation: `${fill(a.statement, answerText(a))}${a.note ? ` ${a.note}` : ''}`,
  };
}

function verifica(defs: Defs, a: Atom): KbExercise {
  const rng = rngFor(`vf-${a.id}`);
  const wrong = wrongsOf(a, rng, 2);
  const isTrue = hash(`vf-${a.id}`) % 2 === 0;
  const shown = isTrue ? answerText(a) : wrong[0]!;
  const fix = (v: string): string => `A frase está errada: devia dizer «${v}»`;
  const options = isTrue ? ['A frase está certa', fix(wrong[0]!), fix(wrong[1] ?? wrong[0]!)] : [fix(answerText(a)), 'A frase está certa', fix(wrong[1] ?? answerText(a))];
  const uniq = [...new Set(options)];
  return {
    id: `${a.id}.vf`, knowledge: [a.id], fichas: a.fichas, sub: a.sub, skill: a.skill, level: 1, variant: true, reasoning: 'verificar', template: 'verificar-frase',
    kind: 'mcq', prompt: `Lê a frase e decide: «${fill(a.statement, shown)}»`, options: uniq, correct: uniq[0]!,
    wrong: Object.fromEntries(uniq.slice(1).map((o) => [o, isTrue ? 'A frase estava certa; confirma o facto na lição.' : `Confirma o facto: ${fill(a.statement, answerText(a))}`])),
    hints: [a.hint ?? `Tema: ${defs.subTitle[a.sub] ?? a.sub}.`, 'Compara o que a frase diz com o que aprendeste.'],
    explanation: `${fill(a.statement, answerText(a))}${a.note ? ` ${a.note}` : ''}`,
  };
}

function recorda(defs: Defs, a: Atom): KbExercise {
  const hints = [a.hint ?? `Tema: ${defs.subTitle[a.sub] ?? a.sub}.`, a.year !== undefined ? 'Escreve o ano com quatro algarismos.' : 'Responde com poucas palavras.'];
  const explanation = `${fill(a.statement, answerText(a))}${a.note ? ` ${a.note}` : ''}`;
  const common = { id: `${a.id}.free`, knowledge: [a.id], fichas: a.fichas, sub: a.sub, skill: a.skill, level: 1 as Level, variant: true, reasoning: 'recordar' as const, template: 'recordar-livre', hints, explanation };
  return a.year !== undefined
    ? { ...common, kind: 'numeric', prompt: `Escreve o ano: ${a.statement.replace('___', '…')}`, correct: a.year }
    : { ...common, kind: 'cloze', prompt: a.statement, correct: [[a.answer, ...(a.accept ?? [])]] };
}

function chainOrder(c: Chain): KbExercise {
  const rng = rngFor(`chain-${c.id}`);
  return {
    id: `${c.id}.chain`, knowledge: c.atoms, fichas: c.fichas, sub: c.sub, skill: c.skill, level: 2, reasoning: 'ordenar', template: 'ordenar-causas',
    kind: 'order', prompt: `Ordena esta cadeia de causas e consequências (${c.theme}), da causa para a consequência.`, items: shuffle(c.steps, rng), correct: c.steps,
    hints: ['Cada passo explica o seguinte.', 'Começa pelo que aconteceu primeiro e levou aos outros.'], explanation: c.why,
  };
}

function oddOneOut(s: SetDef): KbExercise[] {
  const out: KbExercise[] = [];
  const seen = new Set<string>();
  const total = Math.min(1, s.count, s.outsiders.length); // trocar opções não cria outra pergunta
  for (let i = 0; out.length < total && i < total * 30; i++) {
    const rng = rngFor(`${s.id}-${i}`);
    const members = shuffle(s.members, rng).slice(0, 3);
    const outsider = s.outsiders[out.length]!;
    const key = [...members.map((m) => m.label).sort(), outsider.label].join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    const all = [...members, outsider];
    const labels = shuffle(all.map((m) => m.label), rng);
    out.push({
      id: `${s.id}-${out.length}.odd`, knowledge: all.flatMap((m) => m.atoms ?? []), fichas: [...new Set(all.flatMap((m) => m.fichas))], sub: s.sub, skill: s.skill, level: 2, reasoning: 'classificar', template: 'excecao',
      kind: 'mcq', prompt: s.stem, options: labels, correct: outsider.label,
      wrong: Object.fromEntries(members.map((m) => [m.label, `Esta opção cumpre o critério. ${m.why}`])),
      hints: ['Procura a opção que não cumpre o critério.', 'Verifica as datas e quem fez cada coisa.'],
      explanation: `${outsider.label}: ${outsider.why} ${s.summary}`,
    });
  }
  return out;
}

function falseOfFour(defs: Defs, atoms: readonly Atom[], count: number): KbExercise[] {
  const usage = new Map(atoms.map((a) => [a.id, 0]));
  const seen = new Set<string>();
  const out: KbExercise[] = [];
  const bySub = new Map<string, Atom[]>();
  for (const a of atoms) bySub.set(a.sub, [...(bySub.get(a.sub) ?? []), a]);
  const subs = [...bySub.keys()].filter((k) => bySub.get(k)!.length >= 6);
  const total = Math.min(count, subs.length);
  for (let i = 0; out.length < total && i < total * 30; i++) {
    const rng = rngFor(`f4-${i}`);
    const sub = subs[i % subs.length]!;
    if (out.some(e => e.sub === sub)) continue;
    const pool = shuffle([...bySub.get(sub)!].sort((a, b) => usage.get(a.id)! - usage.get(b.id)!).slice(0, 8), rng);
    const four = pool.slice(0, 4);
    const key = four.map((a) => a.id).sort().join('+');
    if (seen.has(key)) continue;
    seen.add(key);
    four.forEach((a) => usage.set(a.id, usage.get(a.id)! + 1));
    const liar = four[0]!;
    const lie = wrongsOf(liar, rng, 1)[0]!;
    const texts = four.map((a, k) => (k === 0 ? fill(a.statement, lie) : fill(a.statement, answerText(a))));
    out.push({
      id: `f4-${i}.f4`, knowledge: four.map((a) => a.id), fichas: four.flatMap((a) => a.fichas), sub, skill: 'facto', level: 2, reasoning: 'verificar', template: 'frase-falsa',
      kind: 'mcq', prompt: `Qual destas frases sobre ${defs.subTitle[sub] ?? sub} é falsa?`, options: shuffle(texts, rng), correct: texts[0]!,
      wrong: Object.fromEntries(texts.slice(1).map((t) => [t, 'Esta frase é verdadeira.'])),
      hints: ['Três frases são verdadeiras e uma é falsa.', `Tema: ${defs.subTitle[sub] ?? sub}.`],
      explanation: `A falsa é «${texts[0]}». O correto: ${fill(liar.statement, answerText(liar))}`,
    });
  }
  return out;
}

function fromCase(c: Case): KbExercise {
  const common = { id: `${c.id}.case`, knowledge: c.knowledge, fichas: c.fichas, sub: c.sub, skill: c.skill, level: c.level, reasoning: c.reasoning, stimulus: c.stimulus, template: c.reasoning === 'classificar' ? 'caso-classificacao' : c.level === 2 ? 'caso-periodo' : 'caso-transferencia', hints: c.hints, explanation: c.explanation };
  const prompt = c.prompt;
  return typeof c.correct === 'number'
    ? { ...common, kind: 'numeric', prompt, correct: c.correct }
    : { ...common, kind: 'mcq', prompt, options: [c.correct, ...Object.keys(c.wrong ?? {})], correct: c.correct, wrong: c.wrong ?? {} };
}

/** Gera todos os exercícios (determinístico): o mesmo conjunto de átomos e definições dá sempre os mesmos exercícios. */
export function buildExercises(atoms: readonly Atom[], defs: Defs): KbExercise[] {
  return [
    ...atoms.flatMap((a) => [recognise(defs, a), verifica(defs, a), ...(a.year !== undefined || a.cloze ? [recorda(defs, a)] : [])]),
    ...defs.chains.map(chainOrder),
    ...defs.sets.flatMap(oddOneOut),
    ...falseOfFour(defs, atoms, defs.falseOfFour),
    ...defs.cases.map(fromCase),
    ...reasoningExercises(defs),
  ];
}
