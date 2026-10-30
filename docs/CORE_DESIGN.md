# Desenho de conteúdo escalável (fechado 2026-10-30, após auditoria + crítica Codex)

## Princípios
- Diversidade = conceito × abordagem × dificuldade × formato (matriz por competência). Trocar números/nomes NÃO cria conceito novo.
- Verificação automática (`verification`) ≠ aprovação pedagógica (`review`). Só `approved` entra em sessões.
- Geração determinística: `generate(seed, difficulty)`; seed inteiro 0..2^32-1; PRNG fixo (mulberry32) em generate.ts; sem Date/Math.random.
- União de formatos fechada (sem registerKind). Acrescentar `match`/`stimulus` só quando o conteúdo precisar.

## Tipos (src/core/content.ts)
```ts
type ReviewStatus = 'needs-human-review' | 'approved';
type Difficulty = 1 | 2 | 3;
interface ExerciseRef { packId: string; packVersion: string; templateId: string; seed: number; difficulty: Difficulty }
interface ExerciseTemplate {
  id: string; competencyId: string; conceptId: string; approachId: string;
  difficulties: readonly Difficulty[]; review: ReviewStatus; source: string; // proveniência/licença
  generate(seed: number, difficulty: Difficulty): Exercise;      // devolve Exercise com ref, conceptId, approachId
  solve?(ex: Exercise): Answer;                                   // solver INDEPENDENTE (recalcula dos dados do enunciado, não usa a chave)
}
interface ContentPack { id: string; version: string; curriculumVersion: string; competencies: readonly Competency[]; templates: readonly ExerciseTemplate[] }
```
Exercise ganha campos opcionais: `ref`, `conceptId`, `approachId`, `stimulus` (texto-base).

## Funções
- `validatePack(pack)` -> erros[]: ids únicos, pré-requisitos existentes, templates ligados a competência, mcq sem opções duplicadas e com resposta nas opções, amostra de seeds×dificuldades: `grade(ex, correctAnswerOf(ex))` correto, e quando existe `solve`, `grade(ex, solve(ex))` correto E igual à chave.
- `instantiate(pack, ref)` regenera exercício (para erros/histórico); falha clara se pacote/versão ausente.
- `materialize(pack, {competencyIds, rng, perTemplate, difficultyFor})` -> Exercise[] (ignora `needs-human-review`).
- `matrix(pack)` -> tabela competência × conceito × abordagem × dificuldade × formato, com lacunas.
- Save v2: `seen: Seen[]` (máx. 500, FIFO) e `mistakes: Mistake[]` (máx. 100) com `ref`, resposta, instantâneo do enunciado (`snapshot: {prompt, explanation}`); `migrate` v1→v2 sem inventar histórico; rejeita versões futuras/lixo.
- Session: recebe `history: Seen[]`; penalizações suaves (nunca bloqueiam; contam `relaxed`): mesma assinatura recente, mesmo conceito nas últimas K, mesma abordagem consecutiva, mesmo formato consecutivo. Revisão espaçada de uma competência continua permitida.
- `metrics`: sobre várias sessões simuladas — cobertura de conceitos elegíveis, maior sequência do mesmo conceito, taxa de assinaturas repetidas por janela, concentração por abordagem/formato (máx. quota), suficiência do banco.
