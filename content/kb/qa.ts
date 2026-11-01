import { normalize } from '../../src/core/grading';
import type { Atom, KbExercise } from './schema';
import { RUBRIC } from './reasoning';
import { verdictOf, type FetchMap } from './evidence';

export interface Evidence { readonly status: string; readonly text: string; readonly sources: readonly { title: string; url: string }[] }
export interface QaResult { readonly errors: string[]; readonly warnings: string[] }

const words = (s: string): string[] => normalize(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 || /^\d+$/.test(w));
const jaccard = (a: Set<string>, b: Set<string>): number => [...a].filter((x) => b.has(x)).length / (new Set([...a, ...b]).size || 1);
const textOf = (e: KbExercise): string => [e.prompt, ...(e.kind === 'mcq' ? e.options : e.kind === 'order' ? e.items : [])].join(' ');
/** A explicação contém a resposta (ou, em respostas longas, a maioria das suas palavras). */
function justifies(e: KbExercise): boolean {
  const ex = normalize(e.explanation + ' ' + e.prompt), c = correctText(e);
  if (ex.includes(normalize(c))) return true;
  const w = words(c);
  return w.length > 0 && w.filter((x) => ex.includes(x)).length / w.length >= 0.6;
}
const correctText = (e: KbExercise): string => (e.kind === 'mcq' ? e.correct : e.kind === 'numeric' ? String(e.correct) : e.kind === 'cloze' ? e.correct[0]![0]! : e.correct.join(' '));

/** Integridade dos átomos e elegibilidade contextual; pendentes são sinalizados e excluídos no adaptador. */
export function checkAtoms(atoms: readonly Atom[], evidence: Readonly<Record<string, Evidence>>, fetched: FetchMap = {}): QaResult {
  const errors: string[] = [], warnings: string[] = [];
  const ids = new Set<string>();
  for (const a of atoms) {
    if (ids.has(a.id)) errors.push(`${a.id}: átomo repetido`);
    ids.add(a.id);
    if (!a.statement.includes('___')) errors.push(`${a.id}: frase sem «___»`);
    if (a.year === undefined && a.wrong.length < 3) errors.push(`${a.id}: menos de 3 distratores`);
    if (a.year !== undefined && String(a.year) !== a.answer) errors.push(`${a.id}: ano ≠ resposta`);
    if (a.wrong.some((w) => normalize(w) === normalize(a.answer))) errors.push(`${a.id}: distrator igual à resposta`);
    let joined = '';
    const verdict = verdictOf(a, evidence, fetched);
    if (!verdict.eligible) warnings.push(`${a.id}: ${verdict.state}: ${verdict.why}`);
    for (const f of evidence[`A:${a.id}`] ? [`A:${a.id}`] : a.fichas) {
      const ev = evidence[f];
      if (!ev) { errors.push(`${a.id}: ficha ${f} inexistente`); continue; }
      if (ev.sources.length < 2) warnings.push(`${a.id}: ${f} com menos de 2 fontes`);
      joined += ` ${ev.text}`;
    }
    const target = words(a.answer);
    const hay = new Set(words(joined));
    const hit = target.filter((w) => hay.has(w)).length;
    // Cobertura lexical não demonstra apoio factual, nem o desmente.
    if (!evidence[`A:${a.id}`] && target.length && hit / target.length < 0.5) warnings.push(`${a.id}: resposta pouco coberta pelo texto da ficha (${hit}/${target.length})`);
  }
  return { errors, warnings };
}

/** Controlo de qualidade dos exercícios gerados. */
export function checkExercises(exs: readonly KbExercise[], atoms: readonly Atom[]): QaResult {
  const errors: string[] = [], warnings: string[] = [];
  const atomIds = new Set(atoms.map((a) => a.id));
  const ids = new Set<string>();
  const keys = new Map<string, string>();
  const tokens = exs.map((e) => new Set(words(e.kind === 'order' ? textOf(e) : e.prompt)));
  for (const [i, e] of exs.entries()) {
    if (!RUBRIC[e.template]?.includes(e.level)) errors.push(`${e.id}: molde/nível fora da rubrica`);
    const fields = [e.prompt, e.stimulus ?? '', e.explanation, ...(e.kind === 'mcq' ? e.options : [])];
    for (const text of fields) {
      if (/(?<![\p{L}])(a a|o o|os os|as as|de a|de o|por os|do o|da a|do no)(?![\p{L}])/iu.test(text)) errors.push(`${e.id}: artigos incompatíveis ou repetidos: ${text}`);
      if (/\b([\p{L}]{3,})\s+\1\b/iu.test(text)) warnings.push(`${e.id}: palavra repetida`);
    }
    if (ids.has(e.id)) errors.push(`${e.id}: id repetido`);
    ids.add(e.id);
    for (const k of e.knowledge) if (!atomIds.has(k)) errors.push(`${e.id}: conhecimento «${k}» inexistente`);
    if (!e.fichas.length) errors.push(`${e.id}: sem evidência`);
    const key = `${e.template}|${[...e.knowledge].sort().join('+')}|${typeof e.variant === 'string' ? e.variant : ''}`;
    if (e.template !== 'excecao' && !e.template.startsWith('caso-') && keys.has(key)) errors.push(`${e.id} ≈ ${keys.get(key)}: mesmo conhecimento e mesmo raciocínio`);
    keys.set(key, e.id);
    if (e.kind === 'mcq') {
      const opts = e.options.map((o) => normalize(o));
      if (new Set(opts).size !== opts.length) errors.push(`${e.id}: opções repetidas`);
      if (e.options.length < 3) errors.push(`${e.id}: menos de 3 opções`);
      if (!e.options.includes(e.correct)) errors.push(`${e.id}: correta fora das opções`);
      if (Object.keys(e.wrong).some((w) => w === e.correct || !e.options.includes(w))) errors.push(`${e.id}: feedback de distrator inconsistente`);
      const c = normalize(e.correct);
      for (const w of Object.keys(e.wrong)) if (atoms.some(a => !e.knowledge.includes(a.id) && normalize(a.answer) === normalize(w))) warnings.push(`${e.id}: distrator é resposta de outro átomo: ${w}`);
      if (e.template !== 'verificar-frase' && c.length >= 4 && normalize(e.prompt).includes(c)) warnings.push(`${e.id}: possível pista lexical no enunciado`);
      if (e.template === 'reconhecer-mcq' && c.length >= 4 && normalize(e.prompt).includes(c)) errors.push(`${e.id}: o enunciado contém a resposta`);
    }
    if (e.kind === 'order') {
      if (e.items.length < 3 || [...e.items].sort().join('|') !== [...e.correct].sort().join('|')) errors.push(`${e.id}: ordem inconsistente`);
      if (new Set(e.items).size !== e.items.length) errors.push(`${e.id}: itens repetidos`);
    }
    if (e.kind === 'numeric' && !Number.isFinite(e.correct)) errors.push(`${e.id}: resposta numérica inválida`);
    if (e.kind === 'cloze' && !e.correct.every((c) => c.length > 0)) errors.push(`${e.id}: cloze sem respostas`);
    if (e.kind !== 'order' && e.template !== 'verificar-frase' && !justifies(e)) errors.push(`${e.id}: a explicação não justifica a resposta`);
    if (e.hints.length < 2) errors.push(`${e.id}: menos de 2 pistas`);
    // A dificuldade foi verificada pela rubrica, sem contar palavras ou conhecimentos.
    for (let j = i + 1; j < exs.length; j++) {
      const o = exs[j]!;
      if (e.template === o.template && ['ordenar-cronologia', 'comparar-cronologia', 'frase-falsa', 'excecao'].includes(e.template)) {
        if (textOf(e) === textOf(o) && correctText(e) === correctText(o)) errors.push(`${e.id} = ${o.id}: exercício repetido`);
        continue;
      }
      if (e.kind === o.kind && e.variant === o.variant && e.stimulus === o.stimulus && JSON.stringify(e.figure) === JSON.stringify(o.figure) && jaccard(tokens[i]!, tokens[j]!) >= 0.85)
        errors.push(`${e.id} ~ ${o.id}: enunciados quase iguais${normalize(correctText(e)) === normalize(correctText(o)) ? ' e mesma resposta (repetida)' : ' com respostas diferentes (ambígua)'}`);
    }
  }
  // viés: a opção correta ser sempre a mais comprida denuncia a resposta
  const mcqs = exs.filter((e): e is Extract<KbExercise, { kind: 'mcq' }> => e.kind === 'mcq' && e.template !== 'verificar-frase');
  const longest = mcqs.filter((e) => e.options.every((o) => o === e.correct || o.length < e.correct.length)).length;
  if (mcqs.length && longest / mcqs.length > 0.5) warnings.push(`viés de comprimento: a correta é a mais longa em ${Math.round((100 * longest) / mcqs.length)}% das mcq`);
  for (const [skill, n] of Object.entries(coverage(exs).bySkill)) if (n / exs.length > 0.45) warnings.push(`${skill}: concentração superior a 45% (${n}/${exs.length})`);
  return { errors, warnings };
}

export interface Coverage {
  readonly total: number;
  readonly byLevel: Record<number, number>;
  readonly bySub: Record<string, Record<number, number>>;
  readonly byReasoning: Record<string, number>;
  readonly byTemplate: Record<string, number>;
  readonly bySkill: Record<string, number>;
  readonly knowledgeCovered: number;
  readonly distinctFocus: number;
}
export function coverage(exs: readonly KbExercise[]): Coverage {
  const inc = (m: Record<string, number>, k: string): void => { m[k] = (m[k] ?? 0) + 1; };
  const byLevel: Record<number, number> = {}, bySub: Record<string, Record<number, number>> = {}, byReasoning: Record<string, number> = {}, byTemplate: Record<string, number> = {}, bySkill: Record<string, number> = {};
  for (const e of exs) {
    byLevel[e.level] = (byLevel[e.level] ?? 0) + 1;
    (bySub[e.sub] ??= {})[e.level] = (bySub[e.sub]![e.level] ?? 0) + 1;
    inc(byReasoning, e.reasoning); inc(byTemplate, e.template); inc(bySkill, e.skill);
  }
  // «foco distinto» = conjunto de conhecimentos + raciocínio (formatos diferentes do mesmo foco contam uma vez)
  const focus = new Set(exs.filter(e => e.variant !== true).map((e) => `${e.reasoning}|${[...e.knowledge].sort().join('+')}|${typeof e.variant === 'string' ? e.variant : ''}`));
  return { total: exs.length, byLevel, bySub, byReasoning, byTemplate, bySkill, knowledgeCovered: new Set(exs.flatMap((e) => e.knowledge)).size, distinctFocus: focus.size };
}
