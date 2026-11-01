import { expect, it } from 'vitest';
import { verdictOf } from '../../content/kb/evidence';
import { checkExercises } from '../../content/kb/qa';
import { XVIII_ATOMS } from '../../content/kb/historia/xviii.atoms';
import { XVIII_EXERCISES } from '../../content/kb/historia/xviii';
import { XVIII_EVIDENCE, eligibleExercise } from '../../content/kb/historia/xviii.validation';

it('duas páginas com nomes/datas não provam apoio; um excerto de pesquisa não é leitura integral', () => {
  const a = XVIII_ATOMS[0]!;
  const sources = [{ title: 'DGE', url: 'https://dge.mec.pt/a' }, { title: 'UC', url: 'https://uc.pt/b' }];
  const evidence = Object.fromEntries(a.fichas.map(f => [f, { status: 'confirmado', text: a.answer, sources }]));
  const fetched = Object.fromEntries(sources.map(s => [s.url, { estado: 'lida', em: Object.fromEntries(a.fichas.map(f => [f, { ok: true }])) }]));
  expect(verdictOf(a, evidence, fetched).eligible).toBe(false);
});
it('fonte inacessível hoje não invalida leitura contextual anterior; correção guarda o veredicto original', () => {
  expect(eligibleExercise(XVIII_EXERCISES.find(e => e.id === 'bp-estilo.mcq')!)).toBe(true);
  expect(XVIII_EVIDENCE['A:bp-estilo']!.sources.every(s => !!s.atestado)).toBe(true);
});
it('rubrica e gramática são obrigatórias, não heurísticas de comprimento', () => {
  const base = XVIII_EXERCISES[0]!;
  expect(checkExercises([{ ...base, level: 3 }], XVIII_ATOMS).errors.some(e => e.includes('rubrica'))).toBe(true);
  expect(checkExercises([{ ...base, prompt: 'Foi feito por os trabalhadores.' }], XVIII_ATOMS).errors.some(e => e.includes('artigos'))).toBe(true);
  expect(checkExercises([{ ...base, template: 'sem-rubrica' }], XVIII_ATOMS).errors.some(e => e.includes('rubrica'))).toBe(true);
});
