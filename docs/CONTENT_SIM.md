# Simulação de conteúdo (gerado)

Reproduzir: npm test -- tests/sim/content.sim.test.ts. Valores determinísticos, calculados pelo teste.

## Método

240 sessões consecutivas de 8 exercícios, um dia simulado por sessão (dias 20000 a 20239 desde a época Unix). Modos Rever/Estudar/Teste alternados. Banco fixo e idêntico: 180 exercícios (179 assinaturas únicas), 12 seeds por template/dificuldade; mulberry32(456). A seleção recebe mulberry32(dia+100). ANTES omite history, preservando a seleção anterior; DEPOIS passa os últimos 500 vistos. Estado de domínio atualizado em cada tentativa com o mesmo fluxo de acertos/erros e pistas nas três condições. GERADO materializa em cada sessão 4 seeds por template/dificuldade, nas três dificuldades; mulberry32(dia+10000), rejeitando seeds já usadas. Passa history a buildSession; materialize não aceita history. Mede diversidade selecionada com geração diária e histórico limitado, não a capacidade total. Aluno simulado com probabilidade de acerto entre 45% e 90%, ciclo de 60 dias, mulberry32(789). Respostas certas vêm da chave verificada; erros são respostas válidas incorretas. Não há alunos reais.

## Capacidade amostrada

20 000 seeds distintas por template×dificuldade, mulberry32(20261030), mesma amostra em cada célula. Contagem de normalize(prompt) e pares JSON de assinatura e correctAnswerOf (tipo e valor). O template não aprovado também é medido, mas não entra nas sessões. Valores observados na amostra, não capacidades totais ou estimativas teóricas.

| Template | Revisão | Dificuldade | Enunciados distintos | Pares distintos |
| --- | --- | ---: | ---: | ---: |
| unitario | approved | 1 | 270 | 270 |
| unitario | approved | 2 | 270 | 270 |
| unitario | approved | 3 | 270 | 270 |
| regra | approved | 1 | 5270 | 5270 |
| regra | approved | 2 | 5270 | 5270 |
| regra | approved | 3 | 5270 | 5270 |
| precos | approved | 1 | 5270 | 5270 |
| precos | approved | 2 | 5270 | 5270 |
| precos | approved | 3 | 5270 | 5270 |
| escala | approved | 1 | 360 | 360 |
| escala | approved | 2 | 360 | 360 |
| escala | approved | 3 | 360 | 360 |
| inverso | approved | 1 | 270 | 270 |
| inverso | approved | 2 | 270 | 270 |
| inverso | approved | 3 | 270 | 270 |
| pt-texto | needs-human-review | 1 | 1 | 1 |

Menor e maior por célula: enunciados 1 a 5270; pares 1 a 5270. Capacidade de enunciados distintos != conceitos distintos.

## Medições

| Métrica | ANTES sem history | DEPOIS com history | GERADO com history |
| --- | ---: | ---: | ---: |
| sessions | 240 | 240 | 240 |
| exercises | 1920 | 1920 | 1920 |
| conceptCoverage | 1 | 1 | 1 |
| longestConceptRun | 4 | 1 | 1 |
| signatureWindow | 20 | 20 | 20 |
| repeatedSignatureRate | 0.1015625 | 0 | 0 |
| maxApproachShare | 0.21666666666666667 | 0.25 | 0.25 |
| maxFormatShare | 0.5703125 | 0.5 | 0.5 |
| sufficientSessionRate | 1 | 1 | 1 |
| uniqueSignatures | 178 | 177 | 1668 |
| uniqueSignatureRatio | 0.09270833333333334 | 0.0921875 | 0.86875 |
| maxSignatureReuse | 28 | 25 | 5 |
| signatureReuseDistribution | {"once":2,"twice":5,"threeOrMore":171} | {"once":1,"twice":4,"threeOrMore":172} | {"once":1462,"twice":164,"threeOrMore":42} |
| relaxed | 0 | 3 | 11 |
| exhausted | 0 | 0 | 0 |
| correct | 1278 | 1278 | 1278 |
| finalAttempts | 1920 | 1920 | 1920 |
| seenSaved | 500 | 500 | 500 |
| mistakesSaved | 100 | 100 | 100 |

O banco fixo repete cada pergunta cerca de 10.79 vezes em média em ANTES e 10.85 em DEPOIS. A janela de 20 esconde esta reutilização global. GERADO melhora as duas métricas globais face aos dois bancos fixos: sim.

uniqueSignatureRatio: assinaturas distintas / exercícios vistos; maxSignatureReuse: maior contagem global de uma assinatura; signatureReuseDistribution: quantas assinaturas vistas 1x (once), 2x (twice), 3+x (threeOrMore).

Cobertura: fração dos conceitos aprovados observados. Sequência: maior série do mesmo conceito, incluindo fronteiras entre sessões. Repetição: fração de exercícios cuja assinatura normalizada apareceu nos 20 anteriores. Concentração: maior quota global de uma abordagem/formato. Suficiência: fração de sessões com os 8 exercícios pedidos. relaxed conta escolhas com pelo menos uma penalização ativa; não é uma falha nem bloqueia exercícios.

## Matriz e suficiência

- mat6-prop: 15 célula(s) declarada(s); dificuldades sem conteúdo aprovado: nenhuma; 60 combinações conceito/abordagem/dificuldade/formato sem conteúdo aprovado.
- pt6-leitura: 1 célula(s) declarada(s); dificuldades sem conteúdo aprovado: 1, 2, 3; 15 combinações conceito/abordagem/dificuldade/formato sem conteúdo aprovado.

Banco suficiente para estas sessões: 100% completas. Isto não prova suficiência curricular nem ausência de repetição durante meses. Os formatos matemáticos são numeric, mcq e cloze; não há order, text ou match em Matemática. O texto de Português não aprovado fica fora do banco.

## Exemplos distintos da mesma competência (Matemática, 6.º)

### unitario / reduzir-unidade

- Seed 0: 6 cadernos custam 12 euros. Quanto custa cada caderno? Resposta: "2".
- Seed 1: 13 cadernos custam 26 euros. Quanto custa cada caderno? Resposta: "2".
- Seed 2: 15 cadernos custam 90 euros. Quanto custa cada caderno? Resposta: "6".

### regra / tabela-proporcional

- Seed 0: 6 metros de tecido custam 12 euros. Quanto custam 6 metros? Resposta: "12".
- Seed 1: 13 metros de tecido custam 26 euros. Quanto custam 12 metros? Resposta: "24".
- Seed 2: 15 metros de tecido custam 90 euros. Quanto custam 7 metros? Resposta: "42".

### precos / comparar-razoes

- Seed 0: Na loja A, 6 quilogramas custam 12 euros; na loja B, 6 quilogramas custam 18 euros. Indica o menor preço por quilograma. Resposta: "2".
- Seed 1: Na loja A, 13 quilogramas custam 26 euros; na loja B, 12 quilogramas custam 36 euros. Indica o menor preço por quilograma. Resposta: "2".
- Seed 2: Na loja A, 15 quilogramas custam 90 euros; na loja B, 7 quilogramas custam 49 euros. Indica o menor preço por quilograma. Resposta: "6".

### escala / converter-escala

- Seed 0: Num mapa, cada centímetro representa 6000 centímetros reais. Uma distância mede 6 centímetros no mapa. Qual é a distância real em centímetros? Resposta: "36000".
- Seed 1: Num mapa, cada centímetro representa 13000 centímetros reais. Uma distância mede 12 centímetros no mapa. Qual é a distância real em centímetros? Resposta: "156000".
- Seed 2: Num mapa, cada centímetro representa 15000 centímetros reais. Uma distância mede 7 centímetros no mapa. Qual é a distância real em centímetros? Resposta: "105000".

### inverso / reconstruir-quantidade

- Seed 0: Cada bilhete custa 2 euros. Pagaram-se 12 euros. Quantos bilhetes foram comprados? Resposta: ["6"].
- Seed 1: Cada bilhete custa 2 euros. Pagaram-se 26 euros. Quantos bilhetes foram comprados? Resposta: ["13"].
- Seed 2: Cada bilhete custa 6 euros. Pagaram-se 90 euros. Quantos bilhetes foram comprados? Resposta: ["15"].

## Dificuldade observável

Passos contam operações aritméticas e comparação; conversão de unidades conta uma operação. O nível não exige sempre mais passos: pode mudar o tipo de números.

| Conceito | D1 | D2 | D3 |
| --- | --- | --- | --- |
| unitario | 1 passos; inteiros | 1 passos; meios euros | 3 passos; quartos de euro e desconto percentual |
| regra | 2 passos; inteiros | 2 passos; meios euros | 4 passos; quartos de euro e desconto percentual |
| precos | 3 passos; inteiros | 3 passos; meios euros | 4 passos; quartos de euro; custo de meio quilograma |
| escala | 1 passos; centímetros | 2 passos; conversão para metros | 2 passos; conversão para quilómetros, incluindo decimais |
| inverso | 1 passos; inteiros | 1 passos; meios euros | 3 passos; quartos de euro; reverter desconto |

## Verificação e limites

validatePack é testado com 200 seeds por template/dificuldade: 3000 instâncias matemáticas e 200 de Português, comparando solver independente e chave. Os solvers matemáticos extraem os números do enunciado; alterar a chave não altera o solver. Round-trip de referências, migração v1 preservada e repetida, rejeição de lixo/versões futuras e extensão a Ciências Naturais do 8.º ano são testados.

O pacote demo prova o mecanismo; não representa cobertura das AE nem revisão pedagógica humana. Os cinco rótulos conceptuais representam subproblemas de proporcionalidade; o problema inverso trata relação direta com quantidade desconhecida, não proporcionalidade inversa. A comparação global de formatos reflete três templates numeric contra um mcq e um cloze. A matriz enumera células declaradas e lacunas nos cinco formatos suportados para cada família; uma lacuna não implica que todos os formatos sejam adequados a essa família, e o texto de Português aguarda revisão. O simulador compara bancos fixos com geração diária, com um só aluno simulado e uma única trajetória determinística de respostas; não demonstra causalidade na aprendizagem.
