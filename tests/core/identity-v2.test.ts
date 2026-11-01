import { expect, it } from 'vitest';
import { exerciseSignature } from '../../src/core/grading';
import { measure } from '../../src/core/metrics';
import { buildSession, seededRng } from '../../src/core/session';
import { defaultSave, recordAttempt, exportSave, importSave } from '../../src/core/save';
import type { Exercise } from '../../src/core/types';

const question: Exercise = { id: 'q', competencyId: 'hgp', conceptId: 'k', approachId: 'fonte', skillId: 'hgp:fonte', difficulty: 1,
  ref: { packId: 'p', packVersion: '1', templateId: 'q', seed: 1, difficulty: 1 },
  prompt: 'Que facto sustenta a afirmação?', stimulus: 'Um resumo.', kind: 'mcq', options: ['A', 'B', 'C'], correctAnswer: 'A', hints: [], explanation: 'A.', commonErrors: [], review: 'approved' };
const shuffled: Exercise = { ...question, id: 'shuffled', options: ['C', 'A', 'B'] };

it('baralhar ou substituir distratores não muda a identidade; estímulo e variante genuína mudam', () => {
  expect(exerciseSignature(question)).toBe(exerciseSignature(shuffled));
  expect(exerciseSignature(question)).toBe(exerciseSignature({ ...question, options: ['D', 'A', 'E'] }));
  expect(exerciseSignature(question)).not.toBe(exerciseSignature({ ...question, stimulus: 'Outro documento.' }));
  expect(exerciseSignature(question)).not.toBe(exerciseSignature({ ...question, variant: 'comparar-processos' }));
});
it('sessão, Save e métricas usam a mesma identidade estável', () => {
  const one = buildSession({ mode: 'study', n: 2, pool: [question, shuffled], competencyIds: ['hgp'], state: {}, rng: seededRng(4), now: 0 });
  expect(one.exercises).toHaveLength(1);
  const saved = recordAttempt(defaultSave(), question, { kind: 'mcq', value: 'A' }, true, 1);
  const restored = importSave(exportSave(saved));
  expect(restored.ok).toBe(true);
  if (!restored.ok) throw new Error('Save inválido');
  expect(restored.save.seen[0]!.signature).toBe(exerciseSignature(shuffled));
  const fresh = { ...question, id: 'fresh', prompt: 'Outra pergunta?' };
  const next = buildSession({ mode: 'study', n: 1, pool: [shuffled, fresh], competencyIds: ['hgp'], state: {}, history: restored.save.seen, rng: seededRng(4), now: 2 });
  expect(next.exercises[0]!.id).toBe('fresh');
  const legacy = buildSession({ mode: 'study', n: 1, pool: [shuffled, fresh], competencyIds: ['hgp'], state: {}, history: [{ ...restored.save.seen[0]!, signature: `${exerciseSignature(question)}|a|b|c` }], rng: seededRng(4), now: 2 });
  expect(legacy.exercises[0]!.id).toBe('fresh');
  const metrics = measure([[question], [shuffled]], ['hgp/k'], 1);
  expect(metrics.uniqueSignatures).toBe(1);
  expect(metrics.repeatedSignatureRate).toBe(0.5);
});
