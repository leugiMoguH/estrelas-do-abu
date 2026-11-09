# Auditoria dos 70 tipos de exercício de Matemática (2026-11-09)

Executada pelo Codex, só leitura, com oráculos independentes (não usa o `solve` dos templates). **Não é validação docente.** Defeitos D-E, D-P, D-AE e D-PT corrigidos a seguir (testes em tests/content/mat-audit-regression.test.ts). Os pontos «H-AE» e a diversidade/dificuldade continuam a precisar de revisão humana.

**Verificadas automaticamente 8 400 instâncias: 120 por template, nos 70 templates registados. Não encontrei respostas numericamente erradas nem opções involuntariamente corretas na amostra.** Confirmei, porém, rejeição de respostas equivalentes, incoerências pedagógicas, resultados fora do domínio curricular indicado e erros de concordância.

Não alterei ficheiros, não fiz commit/push e não corri a suíte completa, build ou Playwright. Executei os oráculos em memória com Node.

Amostra: níveis 1–3 × seeds `{0, 0xffffffff, (k × 2654435761) mod 2³², k=1…38}`. Não invoquei os `solve` dos templates. Usei frações exatas com `BigInt`, interpretação própria das expressões e verificações específicas por família. Li pistas, explicações e feedback de **cinco instâncias por template**, com textos repetidos agrupados e parâmetros apresentados separadamente: **350 instâncias por amostragem textual**.

Legenda da tabela:

- **OK**: sem defeito identificado nestas verificações; não significa aprovação pedagógica.
- **D-E / D-P / D-AE / D-PT**: defeito de equivalência, explicação/pistas, âmbito curricular ou português.
- **H-AE**: correspondência curricular a rever por humano.
- Oráculos: **R** aritmética racional/expressões; **I** inteiros, divisibilidade e primos; **S** sequências; **T** tabelas e intervalos; **P** contagem/probabilidades; **G** geometria; **L** relações algébricas.
- Níveis: **N** mesma tarefa, sobretudo números maiores/mais casas; **C** muda conceito ou operação; **P** acrescenta passos; combinações descrevem transições sucessivas.
- **Sg**: assinaturas do enunciado após substituir números e uniformizar unidades de comprimento. Mede variação textual estrutural, não diversidade didática.

| Template | Resultado | N.º/oráculo | Níveis | Sg |
|---|---|---:|---|---:|
| frac-soma | OK | 120/R | C | 6 |
| frac-parte | D-PT | 120/R | C | 2 |
| frac-decimal | D-E | 120/R | N | 1 |
| op-produto | OK | 120/R | P/C | 3 |
| op-parenteses | D-E | 120/R | C/P | 3 |
| op-potencia | OK | 120/R | P/C | 3 |
| prop-custo | OK | 120/R | N | 1 |
| prop-receita | D-E | 120/R | C/N | 1 |
| prop-escala | OK | 120/R | C/N | 1 |
| num-mmc | OK | 120/I | contexto/N | 2 |
| num-mdc | D-E | 120/I | contexto/N | 2 |
| num-decomposicao | OK | 120/I | N | 1 |
| num-divisores-primos | OK | 120/I | N | 1 |
| num-produto-primos | OK | 120/I | N | 1 |
| pot-produto-base | OK | 120/I | N | 1 |
| pot-quociente-base | OK | 120/I | N | 1 |
| pot-expoente-falta | D-E | 120/I | N | 1 |
| pot-mesmo-expoente | OK | 120/I | N | 1 |
| pot-valor | D-P | 120/I | N | 1 |
| pot-fracao | OK | 120/R | N | 1 |
| frac-irredutivel | OK¹ | 120/R | N | 1 |
| frac-subtracao | D-AE | 120/R | C/N | 1 |
| frac-multiplicacao | OK | 120/R | N | 1 |
| frac-inverso | OK | 120/R | N | 1 |
| frac-divisao | OK | 120/R | N | 1 |
| frac-expressao | OK | 120/R | C/N | 1 |
| pot-quociente-expoente | OK | 120/I | N | 1 |
| seq-seguinte | D-P; H-AE | 120/S | N | 1 |
| seq-ordem | H-AE | 120/S | N/C | 1 |
| seq-pertence | H-AE | 120/S | N/C | 1 |
| seq-lei | H-AE | 120/S | N/C | 1 |
| dados-amplitude | OK | 120/T | N | 3 |
| dados-limites | OK | 120/T | N | 3 |
| dados-modal | OK | 120/T | N | 3 |
| dados-frequencia | OK | 120/T | N | 3 |
| dados-relativa | OK | 120/T | P | 3 |
| dados-fracao | OK | 120/T | P | 3 |
| dados-classes | D-E | 120/T | N | 3 |
| prob-equiprovavel | OK | 120/P | N | 3 |
| prob-favoraveis | D-PT; H-AE | 120/P | P/N | 1 |
| prob-complementar | D-E, D-PT; H-AE | 120/P | P/N | 1 |
| prob-comparar | H-AE | 120/P | N | 1 |
| prob-fracao-complementar | D-PT; H-AE | 120/P | P/N | 1 |
| seq-potencias | H-AE | 120/S | N | 1 |
| circ-perimetro | D-PT | 120/G | N | 1 |
| circ-area | D-PT | 120/G | N | 1 |
| circ-raio | D-E | 120/G | N | 1 |
| circ-diametro-inverso | OK | 120/G | N | 1 |
| ang-complementar | D-E | 120/G | N | 1 |
| ang-suplementar | D-E | 120/G | N | 1 |
| ang-triangulo | OK | 120/G | N | 1 |
| ang-externo | OK | 120/G | N | 1 |
| ang-quadrilatero | OK | 120/G | N | 1 |
| ang-poligono | OK | 120/G | N | 3 |
| vol-cubo | OK | 120/G | N | 1 |
| vol-caixa | OK | 120/G | N | 1 |
| vol-cubinhos | OK | 120/G | N | 1 |
| vol-altura | D-E | 120/G | N | 1 |
| vol-litros | D-E | 120/G | N | 1 |
| vol-cilindro | OK | 120/G | N | 1 |
| rot-minimo | OK | 120/G | N | 1 |
| rot-eixos | D-E | 120/G | N | 1 |
| rot-volta | OK | 120/G | N | 1 |
| rot-composicao | OK | 120/G | C/P | 2 |
| circ-diametro | D-E | 120/G | N | 1 |
| vol-litros-dm3 | D-E, D-PT | 120/G | N | 1 |
| rot-rosacea | OK | 120/G | N | 1 |
| prop-constante | OK | 120/L | N | 1 |
| prop-expressao | OK | 120/L | N | 1 |
| prop-tabela | OK | 120/L | N | 1 |

¹ Em `frac-irredutivel`, os distratores são numericamente equivalentes à resposta, mas o pedido explícito de **forma irredutível** torna a escolha única. Não classifiquei isso como defeito.

**Defeitos confirmados — reproduções**

**D-E — comparação textual rejeita valores equivalentes.** Cada um dos 15 templates abaixo rejeitou uma representação equivalente nas suas 120 instâncias. Nas reproduções seguintes, todas com `seed=0, difficulty=1`, `grade` devolve `correct:false`. Os enunciados estão transcritos; a coluna final mostra resposta esperada/rejeitada versus chave aceite.

| templateId | Enunciado | Esperado, mas rejeitado → chave aceite |
|---|---|---|
| frac-decimal | Escreve 22/10 em representação decimal. | `2,20` → `2.2` ou `2,2` |
| op-parenteses | Resolve a expressão (10 + 2) × 4. | `48,0` → `48` |
| prop-receita | Uma receita para 6 pessoas leva 30 gramas de arroz. Mantendo a porção por pessoa, quantos gramas são precisos para 12 pessoas? | `60,0` → `60` |
| num-mdc | Calcula o mdc de 17 e 2. | `1,0` → `1` |
| pot-expoente-falta | Completa com o expoente natural: 8^□ × 8^1 = 8^3. | `2,0` → `2` |
| dados-classes | Histograma do tempo de leitura diário (minutos), descrito pela tabela «classe: frequência absoluta»: [21,23[: 4; [23,25[: 30; [25,27[: 8. Quantas classes tem o histograma? | `3,0` → `3` |
| prob-complementar | No saco do jogo há 8 bolas azuis, 1 vermelhas e 0 verdes, indistinguíveis ao tato. Retira-se uma ao acaso, misturando bem. Quantos resultados individuais favoráveis há ao acontecimento «não sair azul»? | `1,0` → `1` |
| circ-raio | Uma pista circular tem diâmetro 23,9 m. Qual é o raio, em m? Responde exatamente, sem arredondar. | `11,950` → `11.95` ou `11,95` |
| ang-complementar | Na aula de desenho, um ângulo mede 24,4°. Quanto mede o seu complementar, em graus? Responde exatamente, sem arredondar. | `65,60` → `65.6` ou `65,6` |
| ang-suplementar | Na aula de desenho, um ângulo mede 48,4°. Quanto mede o seu suplementar, em graus? Responde exatamente, sem arredondar. | `131,60` → `131.6` ou `131,6` |
| vol-altura | Uma caixa retangular tem volume 162 cm³, comprimento 9 cm e largura 3 cm. Qual é a altura, em cm? | `6,0` → `6` |
| vol-litros | Um aquário retangular tem medidas interiores 9 dm de comprimento, 3 dm de largura e 6 dm de altura. Cheio até ao bordo, quantos litros contém? Usa 1 dm³ = 1 litro. | `162,0` → `162` |
| rot-eixos | No clube de artes, desenha-se um polígono regular de 5 lados inscrito numa circunferência de raio 2 cm, com centro O. Quantos eixos de simetria de reflexão tem? O sentido positivo é contrário ao dos ponteiros do relógio. | `5,0` → `5` |
| circ-diametro | Uma mesa redonda tem raio 40,7 cm. Qual é o diâmetro, em cm? Responde exatamente, sem arredondar. | `81,40` → `81.4` ou `81,4` |
| vol-litros-dm3 | No clube de ciências, enchem-se 23 garrafas com 1 litros de água em cada uma. Qual é o volume total de água, em dm³? Usa 1 litro = 1 dm³. | `23,0` → `23` |

A causa observada é o ramo `cloze` de `src/core/grading.ts`: compara texto normalizado, sem equivalência numérica. Nos exercícios `numeric`, vírgula/ponto e frações equivalentes são interpretados numericamente.

**D-P — explicações e pistas incoerentes:**

- `seq-seguinte`, `seed=0`, `difficulty=3`: «Num jogo, a sequência começa por 45, 43, 41. A diferença entre termos é constante. Qual é o termo seguinte?» Esperado e dado: **39**. A explicação afirma «o primeiro numerador é 45 […] e o denominador é 5». Esses dados descreveriam `45/5, 43/5, 41/5`, cujo próximo termo seria **39/5**, não a sequência apresentada.
- `pot-valor`, `seed=0`, `difficulty=1`: «Calcula o valor numérico de 8^2 + 2.» Esperado e dado: **66**. As pistas mandam identificar base/expoente comum e aplicar regras de produto/quociente de potências; a explicação manda manter o elemento comum. Aqui há uma potência e uma adição. O feedback para `18` atribui uma confusão entre bases e expoentes que não corresponde à operação apresentada.

**D-AE — resultado fora do domínio curricular explicitado:**

- `frac-subtracao`, `seed=3668339987`, `difficulty=1`: «Calcula 7/16 − 10/16. Escolhe a fração irredutível.» Esperado aritmeticamente e dado: **−3/16**. O defeito é curricular: o documento AE local, linha 121, enquadra estas operações nos **racionais não negativos**. Obtive resultados negativos em **45/120** instâncias.

**D-PT — concordância singular/plural.** Reproduções com `seed=0, difficulty=1`; os valores matemáticos estão certos:

- `frac-parte`: «Uma coleção tem 18 cromos. A Inês oferece 1/6 da coleção. Quantos cromos oferece?» Esperado/dado: **3**; explicação: «Tomamos **1 partes**», esperado «1 parte».
- `prob-favoraveis`: «No saco do jogo há 8 bolas azuis, **1 vermelhas** e 0 verdes, indistinguíveis ao tato. Retira-se uma ao acaso, misturando bem. Qual é a probabilidade de sair azul, como fração irredutível?» Esperado/dado: **8/9**; esperado «1 vermelha».
- `prob-complementar`: enunciado reproduzido na tabela D-E; esperado/dado: **1**; apresenta igualmente «1 vermelhas».
- `prob-fracao-complementar`: «Na quermesse, um saco tem 10 fichas azuis, **1 vermelhas** e 0 verdes, indistinguíveis ao tato e bem misturadas. Retira-se uma ao acaso. Qual é a probabilidade de não sair azul, como fração irredutível?» Esperado/dado: **1/11**; esperado «1 vermelha». A explicação também diz «Os 1 resultados».
- `circ-perimetro`: «Uma roda tem diâmetro 18 cm. Rola sem deslizar durante **1 voltas completas**. Que distância percorre, em cm? Usa π≈3,14. Responde exatamente, sem arredondar.» Esperado/dado: **56,52**; esperado «1 volta completa».
- `circ-area`: «Cada mesa redonda tem diâmetro 18 dm. Há **1 mesas iguais** na cantina. Qual é a área total dos tampos, em dm²? Usa π≈3,14. Responde exatamente, sem arredondar.» Esperado/dado: **254,34**; esperado «1 mesa».
- `vol-litros-dm3`: enunciado reproduzido na tabela D-E; esperado/dado: **23**; «1 litros» deveria ser «1 litro».

**Diversidade, dificuldade e correspondência AE**

**53/70 templates têm uma única assinatura textual normalizada.** As restantes assinaturas também sobrestimam diversidade: em `frac-soma`, seis assinaturas incluem variações do pedido de simplificação; nos sete `dados-*`, três assinaturas refletem sobretudo tabelas com três, quatro ou cinco classes. `prob-equiprovavel` oferece três contextos reais — saco, roleta e dado — mas mantém a comparação de duas contagens.

A classificação dos níveis resulta da leitura do código e das tarefas, **não de medição com alunos**. Em grande parte dos templates, nível 3 não introduz novo raciocínio. Exemplos particularmente claros: classificação de polígonos, raio/diâmetro, eixos de simetria e regras de potências. Aumentar expoentes pode aumentar muito o cálculo sem aumentar a exigência conceptual.

O mapa contém correspondência para os 70 templates. Isso não demonstra cobertura integral dos descritores:

- `seq-seguinte/ordem/pertence/lei`: **42/120** instâncias decrescentes por template. As AE, linhas 556–561, salientam sequências decrescentes e exemplos com potências/frações; estas famílias concentram-se em progressões aritméticas.
- `seq-potencias`: **120/120 crescentes**. O documento também admite atividades com sequências crescentes, pelo que não classifico o crescimento como erro; falta apreciar se este template cumpre o objetivo do subcapítulo.
- `prob-favoraveis`, `prob-comparar`, `prob-fracao-complementar` e a terminologia de `prob-complementar` ultrapassam o descritor explícito de reconhecer equiprobabilidade nas linhas 783–786. Precisam de decisão curricular humana.
- `dados-*` verifica leitura de tabelas que descrevem histogramas; não verifica construção nem interpretação visual de histogramas.
- `num-produto-primos` calcula produtos de potências de bases primas; por si só, não demonstra competência de decomposição em fatores primos.

**Limites e próximo passo**

Automaticamente, confirmei também ausência de chaves numéricas não finitas, ângulos impossíveis nos triângulos/quadriláteros amostrados e probabilidades corretas fora de `[0,1]`. Não encontrei feedback de erro correspondente ao valor correto, ressalvando os pedidos explícitos de forma irredutível. Os cálculos com π coincidem com a convenção indicada de usar **3,14**.

Por leitura amostrada, predominam PT-PT, vírgula decimal e `×`; usa-se frequentemente `÷`, cuja uniformização para `:` merece decisão editorial. Muitas explicações e mensagens de erro são genéricas e pouco específicas da operação ou da resposta escolhida.

Ficam por validar a compreensão aos 11–12 anos, utilidade das pistas, plausibilidade dos contextos e grandezas, dificuldade efetiva, apresentação no navegador e cobertura pedagógica das AE. **Esta auditoria não constitui validação docente.** O próximo passo de maior valor é rever a aceitação de respostas equivalentes e as duas incoerências explicativas, seguido de apreciação docente do domínio numérico e do âmbito de probabilidades/sequências.

