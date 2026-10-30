// @ts-expect-error Node built-in available in Vitest; no dependency on Node type declarations.
import { writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { demoPack, difficultyCriteria } from '../../content/demo';
import { correctAnswerOf, instantiate, materialize, matrix } from '../../src/core/content';
import { mulberry32 } from '../../src/core/generate';
import { grade, normalize } from '../../src/core/grading';
import { measure } from '../../src/core/metrics';
import { defaultSave, recordAttempt } from '../../src/core/save';
import { buildSession } from '../../src/core/session';
import { emptyMastery, updateMastery } from '../../src/core/mastery';
import { DAY } from '../../src/core/review';
import type { Answer, Exercise } from '../../src/core/types';

it('mede 240 sessões consecutivas antes/depois e gera o relatório', () => {
  const capacityRng = mulberry32(20261030),
    seedSet = new Set<number>();
  while (seedSet.size < 20000) seedSet.add(Math.floor(capacityRng() * 4294967296));
  const seeds = [...seedSet];
  expect(seeds).toHaveLength(20000);
  const capacity = demoPack.templates.flatMap((t) =>
    t.difficulties.map((difficulty) => {
      const prompts = new Set<string>(),
        pairs = new Set<string>();
      for (const seed of seeds) {
        const ex = instantiate(demoPack, {
          packId: demoPack.id,
          packVersion: demoPack.version,
          templateId: t.id,
          seed,
          difficulty,
        });
        const prompt = normalize(ex.prompt);
        prompts.add(prompt);
        pairs.add(JSON.stringify([prompt, correctAnswerOf(ex)]));
      }
      expect(prompts.size).toBeGreaterThan(0);
      expect(pairs.size).toBeGreaterThanOrEqual(prompts.size);
      return { template: t.id, review: t.review, difficulty, prompts: prompts.size, pairs: pairs.size };
    }),
  );
  const pool = ([1, 2, 3] as const).flatMap((difficulty) =>
    materialize(demoPack, {
      competencyIds: ['mat6-prop', 'pt6-leitura'],
      rng: mulberry32(456),
      perTemplate: 12,
      difficultyFor: () => difficulty,
    }),
  );
  const eligible = demoPack.templates
    .filter((t) => t.review === 'approved')
    .map((t) => `${t.competencyId}/${t.conceptId}`);
  const outcomes = mulberry32(789);
  const script = Array.from({ length: 240 }, (_, day) =>
    Array.from({ length: 8 }, () => outcomes() < 0.45 + (0.45 * (day % 60)) / 59),
  );
  const run = (withHistory: boolean, generated = false) => {
    const usedSeeds = new Set<number>();
    let save = defaultSave();
    let relaxed = 0,
      exhausted = 0,
      correct = 0;
    const sessions: Exercise[][] = [];
    for (let day = 0; day < 240; day++) {
      const now = (20000 + day) * DAY;
      const dayRng = mulberry32(day + 10000);
      const freshRng = () => {
        let seed: number;
        do {
          seed = Math.floor(dayRng() * 4294967296);
        } while (usedSeeds.has(seed));
        usedSeeds.add(seed);
        return seed / 4294967296;
      };
      const sessionPool = generated
        ? ([1, 2, 3] as const).flatMap((difficulty) =>
            materialize(demoPack, {
              competencyIds: ['mat6-prop', 'pt6-leitura'],
              rng: freshRng,
              perTemplate: 4,
              difficultyFor: () => difficulty,
            }),
          )
        : pool;
      const result = buildSession({
        mode: day % 3 === 0 ? 'review' : day % 3 === 1 ? 'study' : 'test',
        pool: sessionPool,
        competencyIds: ['mat6-prop', 'pt6-leitura'],
        n: 8,
        state: save.mastery,
        rng: mulberry32(day + 100),
        now,
        ...(withHistory ? { history: save.seen } : {}),
      });
      relaxed += result.relaxed;
      exhausted += Number(result.exhausted);
      sessions.push([...result.exercises]);
      result.exercises.forEach((ex, i) => {
        const success = script[day]![i]!;
        const answer: Answer = success
          ? correctAnswerOf(ex)
          : ex.kind === 'mcq'
            ? { kind: 'mcq', value: ex.options.find((o) => o !== ex.correctAnswer)! }
            : ex.kind === 'cloze'
              ? { kind: 'cloze', value: ex.correctAnswers.map(() => '-999') }
              : { kind: 'numeric', value: '-999' };
        const graded = grade(ex, answer);
        expect(graded.invalid).not.toBe(true);
        correct += Number(!graded.invalid && graded.correct);
        save = recordAttempt(save, ex, answer, success, now);
        save = {
          ...save,
          mastery: {
            ...save.mastery,
            [ex.competencyId]: updateMastery(
              save.mastery[ex.competencyId] ?? emptyMastery(),
              graded,
              success ? 0 : 1,
              now,
            ),
          },
        };
      });
    }
    return {
      ...measure(sessions, eligible, 8, 20),
      relaxed,
      exhausted,
      correct,
      finalAttempts: save.mastery['mat6-prop']!.attempts,
      seenSaved: save.seen.length,
      mistakesSaved: save.mistakes.length,
    };
  };
  const before = run(false),
    after = run(true),
    generated = run(true, true);
  expect(before.sessions).toBeGreaterThanOrEqual(200);
  expect(after.sessions).toBe(240);
  expect(after.exercises).toBe(1920);
  expect(after.conceptCoverage).toBe(1);
  expect(after.sufficientSessionRate).toBe(1);
  expect(after.correct).toBe(before.correct);
  expect(after.repeatedSignatureRate).toBeLessThan(before.repeatedSignatureRate);
  expect(generated.sessions).toBe(240);
  expect(generated.exercises).toBe(1920);
  expect(generated.sufficientSessionRate).toBe(1);
  expect(generated.conceptCoverage).toBe(1);
  expect(generated.correct).toBe(before.correct);
  const generatedImproves =
    generated.maxSignatureReuse < after.maxSignatureReuse &&
    generated.uniqueSignatureRatio > after.uniqueSignatureRatio &&
    generated.maxSignatureReuse < before.maxSignatureReuse &&
    generated.uniqueSignatureRatio > before.uniqueSignatureRatio;
  const rows = Object.keys(before)
    .map((key) => {
      const k = key as keyof typeof before;
      return `| ${key} | ${JSON.stringify(before[k])} | ${JSON.stringify(after[k])} | ${JSON.stringify(generated[k])} |`;
    })
    .join('\n');
  const examples = demoPack.templates
    .filter((t) => t.review === 'approved')
    .map((t) => {
      const items = [0, 1, 2].map((seed) => {
        const ex = instantiate(demoPack, {
          packId: demoPack.id,
          packVersion: demoPack.version,
          templateId: t.id,
          seed,
          difficulty: 1,
        });
        return `- Seed ${seed}: ${ex.prompt} Resposta: ${JSON.stringify(correctAnswerOf(ex).value)}.`;
      });
      return `### ${t.conceptId} / ${t.approachId}\n\n${items.join('\n')}`;
    })
    .join('\n\n');
  const difficulties = Object.entries(difficultyCriteria)
    .map(([id, levels]) => `| ${id} | ${levels.map((l) => `${l.steps} passos; ${l.numbers}`).join(' | ')} |`)
    .join('\n');
  const counts = matrix(demoPack)
    .map(
      (row) =>
        `- ${row.competencyId}: ${row.rows.length} célula(s) declarada(s); dificuldades sem conteúdo aprovado: ${row.gaps.join(', ') || 'nenhuma'}; ${row.missingCombinations.length} combinações conceito/abordagem/dificuldade/formato sem conteúdo aprovado.`,
    )
    .join('\n');
  const capacityRows = capacity
    .map((c) => `| ${c.template} | ${c.review} | ${c.difficulty} | ${c.prompts} | ${c.pairs} |`)
    .join('\n');
  const capacityRange = (key: 'prompts' | 'pairs') =>
    `${Math.min(...capacity.map((c) => c[key]))} a ${Math.max(...capacity.map((c) => c[key]))}`;
  const unique = new Set(pool.map((e) => normalize(e.prompt))).size;
  writeFileSync(
    'docs/CONTENT_SIM.md',
    `# Simulação de conteúdo (gerado)\n\nReproduzir: npm test -- tests/sim/content.sim.test.ts. Valores determinísticos, calculados pelo teste.\n\n## Método\n\n240 sessões consecutivas de 8 exercícios, um dia simulado por sessão (dias 20000 a 20239 desde a época Unix). Modos Rever/Estudar/Teste alternados. Banco fixo e idêntico: ${pool.length} exercícios (${unique} assinaturas únicas), 12 seeds por template/dificuldade; mulberry32(456). A seleção recebe mulberry32(dia+100). ANTES omite history, preservando a seleção anterior; DEPOIS passa os últimos 500 vistos. Estado de domínio atualizado em cada tentativa com o mesmo fluxo de acertos/erros e pistas nas três condições. GERADO materializa em cada sessão 4 seeds por template/dificuldade, nas três dificuldades; mulberry32(dia+10000), rejeitando seeds já usadas. Passa history a buildSession; materialize não aceita history. Mede diversidade selecionada com geração diária e histórico limitado, não a capacidade total. Aluno simulado com probabilidade de acerto entre 45% e 90%, ciclo de 60 dias, mulberry32(789). Respostas certas vêm da chave verificada; erros são respostas válidas incorretas. Não há alunos reais.\n\n## Capacidade amostrada\n\n20 000 seeds distintas por template×dificuldade, mulberry32(20261030), mesma amostra em cada célula. Contagem de normalize(prompt) e pares JSON de assinatura e correctAnswerOf (tipo e valor). O template não aprovado também é medido, mas não entra nas sessões. Valores observados na amostra, não capacidades totais ou estimativas teóricas.\n\n| Template | Revisão | Dificuldade | Enunciados distintos | Pares distintos |\n| --- | --- | ---: | ---: | ---: |\n${capacityRows}\n\nMenor e maior por célula: enunciados ${capacityRange('prompts')}; pares ${capacityRange('pairs')}. Capacidade de enunciados distintos != conceitos distintos.\n\n## Medições\n\n| Métrica | ANTES sem history | DEPOIS com history | GERADO com history |\n| --- | ---: | ---: | ---: |\n${rows}\n\nO banco fixo repete cada pergunta cerca de ${(before.exercises / before.uniqueSignatures).toFixed(2)} vezes em média em ANTES e ${(after.exercises / after.uniqueSignatures).toFixed(2)} em DEPOIS. A janela de 20 esconde esta reutilização global. GERADO melhora as duas métricas globais face aos dois bancos fixos: ${generatedImproves ? 'sim' : 'NÃO - melhoria esperada não observada'}.\n\nuniqueSignatureRatio: assinaturas distintas / exercícios vistos; maxSignatureReuse: maior contagem global de uma assinatura; signatureReuseDistribution: quantas assinaturas vistas 1x (once), 2x (twice), 3+x (threeOrMore).\n\nCobertura: fração dos conceitos aprovados observados. Sequência: maior série do mesmo conceito, incluindo fronteiras entre sessões. Repetição: fração de exercícios cuja assinatura normalizada apareceu nos 20 anteriores. Concentração: maior quota global de uma abordagem/formato. Suficiência: fração de sessões com os 8 exercícios pedidos. relaxed conta escolhas com pelo menos uma penalização ativa; não é uma falha nem bloqueia exercícios.\n\n## Matriz e suficiência\n\n${counts}\n\nBanco suficiente para estas sessões: ${after.sufficientSessionRate * 100}% completas. Isto não prova suficiência curricular nem ausência de repetição durante meses. Os formatos matemáticos são numeric, mcq e cloze; não há order, text ou match em Matemática. O texto de Português não aprovado fica fora do banco.\n\n## Exemplos distintos da mesma competência (Matemática, 6.º)\n\n${examples}\n\n## Dificuldade observável\n\nPassos contam operações aritméticas e comparação; conversão de unidades conta uma operação. O nível não exige sempre mais passos: pode mudar o tipo de números.\n\n| Conceito | D1 | D2 | D3 |\n| --- | --- | --- | --- |\n${difficulties}\n\n## Verificação e limites\n\nvalidatePack é testado com 200 seeds por template/dificuldade: 3000 instâncias matemáticas e 200 de Português, comparando solver independente e chave. Os solvers matemáticos extraem os números do enunciado; alterar a chave não altera o solver. Round-trip de referências, migração v1 preservada e repetida, rejeição de lixo/versões futuras e extensão a Ciências Naturais do 8.º ano são testados.\n\nO pacote demo prova o mecanismo; não representa cobertura das AE nem revisão pedagógica humana. Os cinco rótulos conceptuais representam subproblemas de proporcionalidade; o problema inverso trata relação direta com quantidade desconhecida, não proporcionalidade inversa. A comparação global de formatos reflete três templates numeric contra um mcq e um cloze. A matriz enumera células declaradas e lacunas nos cinco formatos suportados para cada família; uma lacuna não implica que todos os formatos sejam adequados a essa família, e o texto de Português aguarda revisão. O simulador compara bancos fixos com geração diária, com um só aluno simulado e uma única trajetória determinística de respostas; não demonstra causalidade na aprendizagem.\n`,
    'utf8',
  );
  // Se a melhoria desaparecer, o relatório acima conserva o resultado observado antes de o teste falhar.
  expect(generated.maxSignatureReuse).toBeLessThan(before.maxSignatureReuse);
  expect(generated.maxSignatureReuse).toBeLessThan(after.maxSignatureReuse);
  expect(generated.uniqueSignatureRatio).toBeGreaterThan(before.uniqueSignatureRatio);
  expect(generated.uniqueSignatureRatio).toBeGreaterThan(after.uniqueSignatureRatio);
}, 120000);
