# Resumo para auditoria externa do núcleo educativo

Estado: instantâneo da branch `audit/core-1` (30/10/2026). A aplicação/jogo NÃO está implementada nem publicada; isto é só o núcleo educativo, contrato e simulação. Tudo o que está marcado «medido» vem de `docs/CONTENT_SIM.md` (reproduzir com `npm test`). Nada aqui foi validado por professores nem pela criança.

## Perguntas da auditoria

**1. Os seis temas são só demonstração ou há limitação estrutural?**
Hoje existe **um** pacote de exemplo (`content/demo/index.ts`): 1 competência de Matemática (proporcionalidade direta, 5 templates) e 1 template de Português (excluído das sessões). Os seis temas planeados ainda NÃO estão implementados. Não encontrei limitação estrutural nos tipos, mas há limites abaixo (ponto 8).

**2. Quantas variantes corretas gera cada competência?** (medido, 20 000 seeds por célula, valores observados na amostra, não teóricos)
Enunciados distintos por template e dificuldade: unitário 270, regra 5270, preços 5270, escala 360, inverso 270 (iguais nas 3 dificuldades). `mat6-prop` ≈ 11 440 enunciados distintos por dificuldade. São variantes de **superfície dentro de 5 subproblemas**; não são 11 440 conceitos. Português: 1 variante (não aprovada).

**3. Como se evitam repetições entre sessões?**
`Save.seen` (FIFO, 500) e penalizações suaves em `session.ts` (assinatura nas últimas 20, conceito, abordagem, formato). Nunca bloqueiam: contam `relaxed`. Medido em 240 sessões × 8: banco fixo de 180 perguntas repete cada pergunta ~11× (9,3 % de assinaturas distintas); com **geração por sessão** 86,9 % distintas e máxima reutilização 5×. A repetição só desce de verdade com geração; o histórico sozinho não resolve um banco pequeno.

**4. Como funciona a adaptação por competência?**
`mastery.ts`: por competência, tentativas, acertos recentes (5), pistas, série; níveis discovering→practising→progressing→consolidated→review; um erro nunca desce mais de um nível. `session.ts` escolhe a dificuldade-alvo por competência (1 após 2 erros seguidos ou <3 tentativas; 3 com série ≥3; senão 2). Regras explícitas e simples; não validadas com alunos reais.

**5. Como são verificadas as soluções?**
`validatePack`: instancia seeds×dificuldades, confirma que a chave é aceite pelo corretor, que as opções de escolha múltipla não duplicam e que o `solve` independente (recalcula a partir dos números do enunciado) coincide com a chave. Testado com 200 seeds por template/dificuldade (3 000 instâncias de Matemática). **Limite:** os solvers extraem números do texto do próprio enunciado; verificam coerência do gerador, não a adequação pedagógica. Não há revisão humana feita.

**6. Como se corrigem respostas abertas de Português?**
**Não se corrigem.** Só há correspondência fechada (`text`/`cloze` com lista de respostas aceites; acentos opcionais por exercício). Não existe correção de resposta livre, rubrica nem análise linguística. Português precisa de textos-base originais/licenciados, critérios por item e revisão humana; hoje há 1 item de exemplo marcado `needs-human-review` que nunca entra em sessões.

**7. Como se acrescenta uma nova disciplina ou ano?**
Definir um `ContentPack` (competências com ano/disciplina/domínio + templates) sem tocar em `src/core`. Há um teste que acrescenta Ciências Naturais 8.º ano e a usa numa sessão (`tests/core/content.test.ts`). **Ainda não existe** carregador de vários pacotes nem UI; `materialize` trabalha por pacote.

**8. O núcleo pode crescer sem grandes alterações?**
Parcialmente confirmado. Pontos fortes: dados serializáveis, `ExerciseRef` regenerável, estado por competência, gravação v2 com migração. Limites conhecidos: união de formatos fechada (novo formato = alterar `types.ts`/`grading.ts`); só dificuldades 1–3; sem associar (`match`), imagem/mapa nem áudio; opções erradas de escolha múltipla fracas (resposta+1/+2) e `commonErrors` vazios nos templates demo; conceitos só variantes de uma família de problemas; sem pacote de vários anos reais nem mapeamento validado às Aprendizagens Essenciais (DGE inacessível durante a pesquisa); verificação de acessibilidade/UX ainda inexistente.

## Método da simulação
`tests/sim/content.sim.test.ts` → `docs/CONTENT_SIM.md`: 240 sessões, 1 dia simulado por sessão, aluno simulado (acerto 45–90 %), comparando banco fixo sem histórico, banco fixo com histórico e geração por sessão. Um só aluno e uma só trajetória; não prova eficácia de aprendizagem.

## Divisão de trabalho (para transparência)
Claude: plano, contrato, auditoria, verificação independente. Codex: revisão do plano, implementação do núcleo, geradores demo, simulação e uma ronda de correção. Código reformatado com Prettier só para legibilidade.
