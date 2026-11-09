import { expect, it } from 'vitest';
import { portugueseTemplates } from '../../content/portugues';
import { verbs, nouns, adjectives } from '../../content/portugues/lexicon';
import { correctAnswerOf } from '../../src/core/content';
import { grade } from '../../src/core/grading';
import type { Answer, Exercise } from '../../src/core/types';

// Oráculo separado de scene/solve: regras morfológicas e exceções explícitas.
function forms(inf: string) {
  const root = inf.slice(0, -2);
  const ar = inf.endsWith('ar');
  const third = inf === 'reproduzir' ? 'reproduz' : root + (ar ? 'a' : 'e');
  const subjRoot = ar ? root.replace(/c$/, 'qu').replace(/g$/, 'gu').replace(/ç$/, 'c') : root;
  return {
    present: third, past: root + (ar ? 'ou' : inf.endsWith('er') ? 'eu' : 'iu'),
    imperfect: root + (ar ? 'ava' : 'ia'), future: inf + 'á', pluralFuture: inf + 'ão',
    subjunctive: subjRoot + (ar ? 'e' : 'a'), imperative: third,
    participle: inf === 'descrever' ? ['descrita', 'descritas'] : [root + (ar ? 'ada' : 'ida'), root + (ar ? 'adas' : 'idas')],
  };
}
it('confere todos os paradigmas e a concordância nominal por regras independentes', () => {
  for (const v of verbs) expect(v, v.infinitive).toMatchObject(forms(v.infinitive));
  for (const [singular, plural] of [...nouns, ...adjectives]) expect(plural).toBe(singular.endsWith('ão') ? singular.slice(0, -2) + 'ões' : singular + 's');
});

function oracle(ex: Exercise): Answer {
  const sentence = ex.prompt.match(/«([^»]+)»/u)![1]!;
  if (ex.id.startsWith('pt-classe-')) {
    const word = ex.prompt.match(/palavra «([^»]+)»/u)![1]!;
    // A construção gerada é sujeito + verbo + artigo + nome + adjetivo/advérbio.
    const tokens = sentence.replace(/[.]$/, '').split(' ');
    const value = word.endsWith('mente') ? 'advérbio' : word === tokens[4] ? 'nome comum' : 'adjetivo';
    return { kind: ex.kind as 'text' | 'mcq', value };
  }
  if (ex.id.startsWith('pt-completar')) {
    const inf = ex.prompt.match(/verbo (\p{L}+):/u)![1]!;
    const f = forms(inf);
    return { kind: 'cloze', value: [ex.prompt.includes('no presente') ? f.present : ex.prompt.includes('no pretérito') ? f.past : f.pluralFuture] };
  }
  if (ex.id.startsWith('pt-tempo')) {
    const form = ex.prompt.match(/forma «([^»]+)»/u)![1]!;
    const paradigms = verbs.map(v => forms(v.infinitive));
    const tense = paradigms.some(f => f.present === form) ? 'presente' : paradigms.some(f => f.past === form) ? 'pretérito perfeito' : paradigms.some(f => f.imperfect === form) ? 'pretérito imperfeito' : 'futuro';
    return { kind: 'mcq', value: `${tense} do indicativo` };
  }
  if (ex.id.startsWith('pt-modo')) return { kind: 'mcq', value: sentence.startsWith('Espero que') ? 'conjuntivo' : sentence.includes(',') && sentence.endsWith('!') ? 'imperativo' : 'indicativo' };
  const plural = sentence.startsWith('As ') || /^A \p{L}+ e a /u.test(sentence);
  const active = /^A (\p{L}+(?: e a \p{L}+)?) (\p{L}+) (a[s]? .+?) ((?:junto|perto|ao lado) .+[.])$/u.exec(sentence);
  const passive = /^(A[s]? .+?) (é|foi|serão) (\p{L}+) (pela \p{L}+(?: e pela \p{L}+)?) ((?:junto|perto|ao lado) .+[.])$/u.exec(sentence);
  if (active) {
    const [, names, verb, object, place] = active;
    const inf = verbs.map(v => v.infinitive).find(inf => Object.values(forms(inf)).some(f => f === verb))!;
    const f = forms(inf);
    return { kind: 'order', value: [object![0]!.toUpperCase() + object!.slice(1), `${verb === f.present ? 'é' : verb === f.past ? 'foi' : 'serão'} ${f.participle[plural ? 1 : 0]}`, `pela ${names!.replace(' e a ', ' e pela ')}`, place!] };
  }
  expect(passive, sentence).not.toBeNull();
  const [, object, aux, participle, agent, place] = passive!;
  if (ex.kind === 'mcq') return { kind: 'mcq', value: agent! };
  const inf = verbs.map(v => v.infinitive).find(inf => forms(inf).participle.includes(participle!))!;
  const f = forms(inf);
  return { kind: 'order', value: [`A ${agent!.replace(/^pela /, '').replace(' e pela ', ' e a ')}`, aux === 'é' ? f.present : aux === 'foi' ? f.past : f.pluralFuture, object![0]!.toLowerCase() + object!.slice(1), place!] };
}

// 40 seeds dispersas pelo intervalo uint32 × 3 níveis × 9 templates = 1080 casos.
for (const t of portugueseTemplates) it(`${t.id}: 40 seeds × níveis; resposta, distratores, pistas e explicação`, () => {
  for (let i = 0; i < 40; i++) for (const d of t.difficulties) {
    const seed = Math.imul(i, 2654435761) >>> 0;
    const ex = t.generate(seed, d);
    const expected = oracle(ex);
    expect(correctAnswerOf(ex), `${t.id}/${seed}/${d}`).toEqual(expected);
    expect(grade(ex, expected)).toMatchObject({ correct: true });
    expect(ex.hints.length).toBeGreaterThanOrEqual(2);
    expect(ex.hints.every(h => h.trim().length > 10)).toBe(true);
    if (ex.kind === 'mcq') {
      expect(new Set(ex.options).size).toBe(ex.options.length);
      expect(ex.options.filter(option => option === expected.value)).toHaveLength(1);
      for (const option of ex.options) expect(grade(ex, { kind: 'mcq', value: option })).toMatchObject({ correct: option === expected.value });
    }
    if (ex.kind === 'order') {
      expect([...ex.items].sort()).toEqual([...ex.correctAnswer].sort());
      expect(ex.explanation.toLowerCase()).toContain(ex.correctAnswer[0]!.toLowerCase());
    } else expect(ex.explanation).toContain(Array.isArray(expected.value) ? expected.value[0] : expected.value);
  }
});

it('regressão: explicações de voz no plural identificam grupos sem erros de concordância', () => {
  for (const id of ['pt-voz-ativa', 'pt-voz-passiva', 'pt-voz-agente']) {
    const ex = portugueseTemplates.find(t => t.id === id)!.generate(0, 3);
    expect(ex.explanation).toMatch(/o grupo «A \p{L}+ e a \p{L}+» é o sujeito/u);
    expect(ex.explanation).toMatch(/o grupo «as [^»]+» é o complemento direto/u);
    expect(ex.explanation).toMatch(/o grupo «as [^»]+» passa a sujeito/u);
  }
});
