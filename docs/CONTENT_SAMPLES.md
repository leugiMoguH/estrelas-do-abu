# Amostras do banco da demo

Gerado por tests/content/gamePack.test.ts. Textos originais; sem revisão docente.

Capacidade: enunciados distintos em 2000 seeds **por dificuldade**. A contagem mede combinações textuais, não conceitos novos.

| Template | D1 | D2 | D3 |
| --- | --- | --- | --- |
| frac-soma | 811 | 515 | 1718 |
| frac-parte | 701 | 1506 | 1506 |
| frac-decimal | 80 | 747 | 1762 |
| op-produto | 1808 | 1972 | 1972 |
| op-parenteses | 1714 | 1434 | 1971 |
| op-potencia | 516 | 1685 | 516 |
| prop-custo | 1891 | 1891 | 1891 |
| prop-receita | 1446 | 1958 | 1958 |
| prop-escala | 1746 | 1746 | 1746 |
| pt-classe-nome | 1971 | 1995 | 2000 |
| pt-classe-adjetivo | 1983 | 1995 | 2000 |
| pt-classe-adverbio | 1971 | 1995 | 2000 |
| pt-tempo | 2000 | 2000 | 2000 |
| pt-modo | 2000 | 2000 | 2000 |
| pt-completar | 2000 | 2000 | 2000 |
| pt-voz-passiva | 2000 | 2000 | 2000 |
| pt-voz-ativa | 2000 | 2000 | 2000 |
| pt-voz-agente | 2000 | 2000 | 2000 |

Templates com ≥150 em todos os níveis: 17/18.
Exceções abaixo de 150: frac-decimal D1 tem apenas 80 numeradores intencionais; não se acrescenta ruído para simular diversidade.

## Frações e decimais

### frac-soma — dificuldade 1

Qual é a soma de 5/13 e 1/13? Escolhe a fração que representa o resultado.

Resposta: "6/13"

Pistas: As frações já têm o mesmo denominador: mantém 13. → Soma os numeradores 5 e 1 e mantém o denominador 13. → Confirma que numerador e denominador não têm divisores comuns além de 1.

Explicação: Com denominador 13, os numeradores são 5, 1. A soma é 6/13, que corresponde a 6/13. Mantemos a unidade das parcelas e só depois simplificamos, se houver um divisor comum.

Erros típicos: 3/13: Somar denominadores muda a unidade. Usa frações equivalentes com o mesmo denominador. / 5/169: Multiplicaste as frações; aqui pede-se uma soma.

### frac-parte — dificuldade 2

Uma coleção tem 342 cromos. A Inês oferece 8/9 da coleção. Quantos cromos oferece?

Resposta: "304"

Pistas: O denominador indica em quantas partes iguais se divide o todo. → Divide 342 por 9 para encontrar uma parte. → Multiplica uma parte por 8.

Explicação: Uma parte vale 342 ÷ 9 = 38. Tomamos 8 partes: 38 × 8 = 304 cromos.

Erros típicos: 384.75: Confundiste o todo com a parte: identifica primeiro o valor de uma única parte.

### frac-decimal — dificuldade 3

Escreve 2395/1000 em representação decimal.

Resposta: ["2.395"]

Pistas: Uma fração representa uma divisão. → O denominador é 1000: desloca a vírgula 3 casa(s) para a esquerda.

Explicação: Dividir 2395 por 1000 dá 2,395. As casas depois da vírgula representam décimas, centésimas e milésimas.

Erros típicos: 2395000: Multiplicaste pelo denominador. A barra da fração significa divisão.


## Prioridades das operações

### op-produto — dificuldade 1

Calcula: 37 + 6 × 2.

Resposta: "49"

Pistas: Resolve primeiro os parênteses, se existirem. → Multiplicações e divisões vêm antes das adições e subtrações; com igual prioridade, segue da esquerda para a direita.

Explicação: O produto (e a divisão, se existir) vale 12. Só depois somamos 37: 49.

Erros típicos: 86: Respeita os grupos entre parênteses e a prioridade do produto antes da soma.

### op-parenteses — dificuldade 2

Resolve a expressão (280 - 144) ÷ 8.

Resposta: ["17"]

Pistas: Cada par de parênteses forma um grupo. → Calcula o valor de cada grupo antes da operação exterior.

Explicação: Substitui cada grupo pelo seu valor e só depois efetua a operação exterior. (280 - 144) ÷ 8 = 17. Os parênteses obrigam a efetuar primeiro a soma ou a diferença.

Erros típicos: 262: Ignoraste os parênteses: a operação dentro de cada grupo faz-se primeiro.

### op-potencia — dificuldade 3

Calcula (8 + 7)².

Resposta: "225"

Pistas: O expoente diz quantas vezes a base aparece como fator. → Resolve parênteses, depois potências, depois produtos e finalmente somas.

Explicação: A base é a soma inteira: 15. O quadrado é 15 × 15 = 225; não é a soma dos quadrados.

Erros típicos: 113: Um expoente não multiplica a base; numa soma ao quadrado, ele aplica-se ao grupo inteiro.


## Proporcionalidade direta

### prop-custo — dificuldade 1

15 cadernos iguais custam 225 euros. Sem descontos, quanto custam 4 cadernos?

Resposta: "60"

Pistas: O preço por caderno mantém-se constante. → Divide 225 por 15 e depois multiplica por 4.

Explicação: Cada caderno custa 225 ÷ 15 = 15 euros. Para 4 cadernos: 4 × 15 = 60 euros.

Erros típicos: 0,26666667: Inverteste a razão. O preço unitário é euros divididos pelo número de cadernos.

### prop-receita — dificuldade 2

Uma receita para 10 pessoas leva 800 gramas de arroz. Mantendo a porção por pessoa, quantos gramas são precisos para 19 pessoas?

Resposta: ["1520"]

Pistas: As duas quantidades variam na mesma proporção. → Descobre os gramas por pessoa: 800 ÷ 10. → Multiplica essa quantidade pelo novo número de pessoas.

Explicação: A porção é 80 gramas por pessoa. Assim, 19 × 80 = 1520 gramas. Somar a diferença de pessoas aos gramas mistura unidades diferentes.

Erros típicos: 809: Não somes pessoas a gramas. Mantém constante a quantidade por pessoa.

### prop-escala — dificuldade 3

Cada centímetro de um mapa representa 28000 centímetros reais. O percurso mede 16 centímetros no mapa. Qual é a distância real em quilómetros?

Resposta: "4.48"

Pistas: Multiplica a medida no mapa pela distância que cada centímetro representa. → Obténs 448000 centímetros reais. → Divide por 100000 para converter centímetros em quilómetros.

Explicação: 16 × 28000 = 448000 centímetros. Como 1 quilómetro vale 100 000 centímetros, dividimos por 100000. Resultado: 4,48 quilómetros.

Erros típicos: 0,00057143: A distância real é maior: multiplica pelo fator de escala, não dividas por ele.


## Classes de palavras

### pt-classe-nome — dificuldade 1

Na frase «A Helena pintou a muralha calmamente.», a que classe pertence a palavra «muralha»?

Resposta: "nome comum"

Pistas: Observa a função da palavra nesta frase. → Designa algo que pode ser identificado pelo artigo que o acompanha.

Explicação: muralha: nome comum. O nome comum designa um ser, objeto ou lugar, sem o individualizar por um nome próprio.

Erros típicos: verbo: O verbo exprime a ação e varia em tempo e pessoa; observa a função da palavra destacada. / adjetivo: O nome comum designa um ser, objeto ou lugar, sem o individualizar por um nome próprio.

### pt-classe-adjetivo — dificuldade 2

Na frase «A Mariana observou a ruína colorida cuidadosamente.», a que classe pertence a palavra «colorida»?

Resposta: "adjetivo"

Pistas: Observa a função da palavra nesta frase. → Caracteriza o que é designado pelo nome; verifica a concordância em género e número.

Explicação: colorida: adjetivo. O adjetivo atribui uma propriedade ao nome e concorda com ele em género e número.

Erros típicos: verbo: O verbo exprime a ação e varia em tempo e pessoa; observa a função da palavra destacada. / advérbio: Esta palavra caracteriza o nome e concorda com ele; não modifica a ação.

### pt-classe-adverbio — dificuldade 3

Na frase «A Diana avaliou a janela antiga silenciosamente ao lado do teatro.», a que classe pertence a palavra «silenciosamente»? Responde: nome comum, adjetivo ou advérbio.

Resposta: "advérbio"

Pistas: Observa a função da palavra nesta frase. → Indica como a ação é realizada e não varia quando o sujeito passa ao plural.

Explicação: silenciosamente: advérbio. Este advérbio modifica o verbo: indica o modo como a ação foi realizada e é invariável.

Erros típicos: verbo: O verbo exprime a ação e varia em tempo e pessoa; observa a função da palavra destacada. / adjetivo: Este advérbio modifica o verbo: indica o modo como a ação foi realizada e é invariável.


## Tempos e modos verbais

### pt-tempo — dificuldade 1

Na frase «A Helena pinta a muralha antiga perto do rio.», identifica o tempo e o modo da forma «pinta».

Resposta: "presente do indicativo"

Pistas: Identifica apenas a forma destacada, mesmo que haja outro verbo. → A forma apresenta a ação no momento atual ou como habitual no presente; o modo apresenta-a como um facto.

Explicação: «pinta» está no presente do indicativo. Compara: pinta (presente), pintou (passado concluído), pintava (passado em curso ou habitual), pintará (futuro). Todas estas formas pertencem ao indicativo.

Erros típicos: pretérito perfeito do indicativo: O perfeito exprime um acontecimento passado concluído. Confere a forma destacada, não apenas o contexto. / pretérito imperfeito do indicativo: O imperfeito apresenta o passado em curso ou habitual; distingue, por exemplo, observou de observava.

### pt-modo — dificuldade 2

Em «Espero que a Mariana observe a ruína colorida junto ao lago.», qual é o modo de «observe»?

Resposta: "conjuntivo"

Pistas: Observa se a frase afirma, exprime um desejo ou dá uma instrução. → A expressão Espero que introduz uma ação desejada, que não é afirmada como um facto.

Explicação: O modo é o conjuntivo: a oração introduzida por «Espero que» exprime uma ação desejada. A intenção e a construção da frase ajudam a interpretar a forma verbal.

Erros típicos: indicativo: Uma instrução direta ou uma ação desejada não é uma simples afirmação de um facto. Observa a construção da frase. / imperativo: O imperativo dirige uma instrução ou pedido ao interlocutor. Procura essa intenção no contexto.

### pt-completar — dificuldade 3

Completa no futuro do indicativo, usando o verbo avaliar: «A Diana e a Joana ___ as janelas antigas ao lado do teatro.»

Resposta: ["avaliarão"]

Pistas: Identifica o sujeito e verifica se é singular ou plural. → Usa o futuro do indicativo; o sujeito reúne duas pessoas, por isso a forma é plural.

Explicação: A forma correta é «avaliarão». O sujeito «A Diana e a Joana» corresponde a elas (terceira pessoa do plural). O tempo pedido é o futuro; o verbo tem de concordar com o sujeito.

Erros típicos: avaliar: O infinitivo nomeia o verbo, mas aqui é necessária uma forma pessoal que concorde com o sujeito. / avaliará: Verifica o número do sujeito e o tempo pedido antes de escolher a forma.


## Frase ativa e passiva

### pt-voz-passiva — dificuldade 1

Transforma para a passiva a frase «A Helena pinta a muralha antiga perto do rio.» Ordena os grupos sem mudar o tempo verbal.

Resposta: ["A muralha antiga","é pintada","pela Helena","perto do rio."]

Pistas: Identifica quem pratica a ação e o que recebe essa ação. → Na passiva, o complemento direto da ativa passa a sujeito; o verbo usa ser e um particípio que concorda com esse sujeito. → Compara: «A Helena pinta a muralha antiga perto do rio.» / «A muralha antiga é pintada pela Helena perto do rio.».

Explicação: Na ativa, A Helena é o sujeito e a muralha antiga é o complemento direto. Na passiva, a muralha antiga passa a sujeito; «é pintada» mantém o tempo e concorda com ele. «pela Helena» indica quem pratica a ação: é o complemento agente da passiva.

Erros típicos: a muralha antiga: Este grupo recebe a ação e é o sujeito da passiva. O agente é introduzido por por (pela/pelas). / é pintada: Este grupo é o verbo da passiva, não o agente.

### pt-voz-ativa — dificuldade 2

Transforma para a ativa a frase «A ruína colorida foi observada pela Mariana junto ao lago.» Ordena os grupos sem mudar o tempo verbal.

Resposta: ["A Mariana","observou","a ruína colorida","junto ao lago."]

Pistas: Identifica quem pratica a ação e o que recebe essa ação. → Na passiva, o complemento direto da ativa passa a sujeito; o verbo usa ser e um particípio que concorda com esse sujeito. → Compara: «A Mariana observou a ruína colorida junto ao lago.» / «A ruína colorida foi observada pela Mariana junto ao lago.».

Explicação: Na ativa, A Mariana é o sujeito e a ruína colorida é o complemento direto. Na passiva, a ruína colorida passa a sujeito; «foi observada» mantém o tempo e concorda com ele. «pela Mariana» indica quem pratica a ação: é o complemento agente da passiva.

Erros típicos: a ruína colorida: Este grupo recebe a ação e é o sujeito da passiva. O agente é introduzido por por (pela/pelas). / foi observada: Este grupo é o verbo da passiva, não o agente.

### pt-voz-agente — dificuldade 3

Na frase «As janelas antigas serão avaliadas pela Diana e pela Joana ao lado do teatro.», qual é o complemento agente da passiva?

Resposta: "pela Diana e pela Joana"

Pistas: Identifica quem pratica a ação e o que recebe essa ação. → Na passiva, o complemento direto da ativa passa a sujeito; o verbo usa ser e um particípio que concorda com esse sujeito. → Compara: «A Diana e a Joana avaliarão as janelas antigas ao lado do teatro.» / «As janelas antigas serão avaliadas pela Diana e pela Joana ao lado do teatro.».

Explicação: Na ativa, A Diana e a Joana é o sujeito e as janelas antigas é o complemento direto. Na passiva, as janelas antigas passa a sujeito; «serão avaliadas» mantém o tempo e concorda com ele. «pela Diana e pela Joana» indica quem pratica a ação: é o complemento agente da passiva.

Erros típicos: as janelas antigas: Este grupo recebe a ação e é o sujeito da passiva. O agente é introduzido por por (pela/pelas). / serão avaliadas: Este grupo é o verbo da passiva, não o agente.


Revisão docente recomendada: alinhamento fino com a planificação da turma, vocabulário gramatical, progressão de dificuldade e clareza das pistas.