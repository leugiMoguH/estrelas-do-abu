# F2b — Palavras-ferramenta

Demonstração isolada em `prototipos/f2b/`. Continua a implementação preservada em
`c2c8254`; não modifica a F2 nem a aplicação principal. Não foi publicada.

## Ação principal

Tocar numa palavra e depois num objeto iluminado altera imediatamente o mundo.
Na primeira situação, a palavra «abre» fica junto da caixa: basta um toque.
Não há execução em lote, seleção de sujeito, tempos verbais, terminologia
escolar, pontuação ou recompensas adicionais. Uma frase completa acompanha
visualmente a consequência e é anunciada numa região `role="status"`.

As ferramentas são botões nativos: Tab, Enter e Espaço funcionam, com foco
visível e preservado após a ação. A arte do Abu é importada de
`src/art/assets/d5/abu-sit.webp`.

## Situações e soluções verificadas

1. **A caixa.** Objetivo: «Leva a estrela até à constelação.» Tocar em «abre»
   levanta a tampa e lança a estrela. Não exige uma segunda instrução nem
   admite uma escolha errada inicial. Solução: uma ação física, um toque.
2. **Duas distâncias.** Dois barcos transportam estrelas; cada um tem uma saída
   e uma margem visíveis. «Sopra» mostra uma nuvem e dá um empurrão curto;
   «sopram» mostra duas nuvens e dá um empurrão longo. Solução: «sopram» →
   barco superior; «sopra» → barco inferior, por qualquer ordem. São duas
   ações físicas, quatro toques. Falhas plausíveis: o empurrão curto fica
   antes da saída distante; o longo ultrapassa a saída próxima e bate na
   margem. O barco recua após a animação de falha, permitindo experimentar.
3. **A bifurcação.** O ramo superior começa aberto e o inferior fechado.
   Abrir ou fechar uma comporta muda imediatamente a água, o traço da comporta
   e a indicação de corrente. Com ambos abertos, a corrente divide-se e não
   consegue levar nenhum barco; com ambos fechados, não há acesso.
   Solução mínima: «sopram» → barco superior; «fecha» → comporta superior;
   «abre» → comporta inferior; «sopra» → barco inferior. Quatro ações físicas,
   oito toques. Fechar o primeiro ramo antes de recuperar a estrela corta-lhe
   o acesso e obriga a reabri-lo. Também é possível começar pelo ramo inferior,
   mas exige mais mudanças de comportas. As falhas não destroem estrelas.

A busca em largura explora as ações até profundidade 7 e confirma mínimos de
**1, 2 e 4 ações físicas**. O estado de navegação não faz parte desta busca.

## Recuperação e pistas

«Anular» e «Recomeçar» estão sempre visíveis. Anular repõe todo o estado físico
anterior, incluindo frase, vento e comportas. Recomeçar também pode ser anulado.
A seleção de uma ferramenta é transitória: anular recua a última alteração do
mundo, não percorre seleções. A navegação para a situação seguinte começa um
novo histórico.

Só após três aplicações falhadas na mesma situação aparece «Destacar objetos».
O destaque é opcional e assinala todos os objetos interativos, sem escolher
uma palavra, um alvo ou uma sequência. Anular e recomeçar não apagam a contagem
de falhas observadas nessa situação.

## Métricas e armazenamento

Única chave: `eda-proto-f2b`, escrita com `try/catch`, sem rede. Guarda a versão
do formato e as métricas da sessão atual. Não retoma o jogo nem acumula sessões:
ao voltar a jogar, a primeira interação substitui o registo anterior. O painel
só aparece com `?registo`; não é necessário para jogar.

- `actions`: seleções de palavras, aplicações em alvos e recomeços. Navegação,
  pistas e anulações não entram neste contador.
- `undos`: anulações com um estado anterior disponível; não diminui ao recuar.
- `firstActions`: número de interações até à primeira alteração física.
- `firstMs`: tempo desde a entrada na situação até à aplicação dessa alteração.
- `reactionMs`: tempo do início do tratamento da aplicação até ao próximo
  `requestAnimationFrame`, já com a cena atualizada. É uma aproximação ao início
  visual, não uma medição de píxeis apresentados pelo monitor.

Cada situação começa com **uma linha de objetivo**; não há parágrafos de regras
antes de jogar. Depois de selecionar uma ferramenta aparece uma frase curta
para indicar os alvos iluminados. As frases de consequência são feedback.

Medições do percurso automatizado final nos três viewports: ver tabela abaixo.
Os tempos de entrada incluem espera por verificações e capturas do Playwright;
não representam tempos de compreensão de uma criança.

| Viewport | Ações até à 1.ª consequência (1/2/3) | Ações para resolver (1/2/3) | Tempo de entrada até à 1.ª consequência (ms, 1/2/3) | Reação inicial (ms, 1/2/3) |
|---|---|---|---|---|
| 390×844 | 1 / 2 / 2 | 1 / 4 / 8 | 612 / 766 / 402 | 13 / 14 / 13 |
| 820×1180 | 1 / 2 / 2 | 1 / 4 / 8 | 643 / 499 / 500 | 12 / 14 / 14 |
| 1280×800 | 1 / 2 / 2 | 1 / 4 / 8 | 839 / 509 / 498 | 21 / 8 / 7 |

Os três percursos mínimos medidos tiveram zero anulações. Depois das capturas
de sucesso, os testes anulam, recomeçam e resolvem novamente cada situação.

## Diferenças face à F2 e referências de género

A F2 preparava cartões e camadas antes de «Experimentar». Aqui a primeira
consequência custa um toque; as seguintes custam palavra → alvo, sem botão
de execução. A concordância singular/plural altera o número de nuvens e a
distância, em vez de funcionar como filtro de uma resposta gramatical.
As decisões progridem de descoberta para força e depois encaminhamento.

O desenho aproxima-se de puzzles de comportas e ferramentas sobre objetos.
A particularidade explorada é a palavra flexionada controlar o efeito físico,
com a frase como consequência. Isto é uma descrição do mecanismo implementado,
não uma alegação de originalidade ou superioridade perante jogos existentes.

## Validação e limites

Os testes verificam soluções, falhas de força e corrente, imutabilidade e
reposição exata do estado. Os e2e jogam as três situações nos três viewports,
usam `tap()` onde há toque e `click()` no desktop, verificam o armazenamento,
erros de consola, alvos mínimos de 44 px e geometria sem deslocação horizontal
ou vertical no jogo normal. Guardam seis capturas `fullPage` por viewport nos
outputs, esperando pelo fim das animações nas capturas de sucesso.

Validação local em 2026-11-09: `npm test` passou **1167 testes em 32 ficheiros**,
incluindo **9 testes F2b**; `npm run build` passou; o comando específico de
Playwright passou **6/6**, dois em cada viewport, em 43,4 s. Foram jogadas as
três situações em Chromium real por automação e regeneradas as capturas, incluindo duas imagens adicionais por viewport
com as duas nuvens. Inspeção visual das capturas dos estados alterados.
Não se correu a suíte e2e completa. O build mantém um aviso de tamanho de um
chunk da aplicação principal, fora deste âmbito.

A inspeção corrigiu o pivô da tampa e os alvos que ficavam para trás quando
os barcos chegavam às saídas. A corrente fechada deixa de ter ondulação;
um barco sem corrente não avança na animação de falha. O teste de reação espera
explicitamente pelo registo do frame para evitar ler uma métrica ainda ausente.

O painel de observação pode aumentar a altura da página com `?registo`;
cena, ferramentas e recuperação continuam antes dele. No telemóvel a cena
ocupa aproximadamente metade do ecrã; em ecrãs maiores os controlos ficam ao lado.
As animações duram 300–500 ms e são desligadas com `prefers-reduced-motion`.

Limitações: física discreta, não simulada; o sopro falhado regressa ao ponto
inicial; o ramo fechado é recuperável, pelo que é possível resolver por
experimentação; demonstração muito curta; não há validação de diversão,
compreensão intuitiva ou transferência de aprendizagem pela jogadora.
Não representa cobertura curricular ampla. Leitores de ecrã não foram
validados manualmente. **Revisão independente de PT-PT pendente.** O próximo
passo de maior valor é observar a jogadora sem explicar a interface.

## Correção dos dois defeitos visuais (2026-11-09)

Nas situações 2 e 3, as nuvens são agora formas SVG separadas:
«sopra» mostra uma, «sopram» mostra duas. A segunda entra durante
400 ms e ambas mostram traços de sopro animados durante 400 ms. Com
`prefers-reduced-motion`, aparecem diretamente no estado final.

Na situação 3, cada porta ocupa a entrada do próprio canal: fechada,
atravessa-o; aberta, fica levantada. O ramo aberto apresenta ondas em movimento
e setas; o fechado apresenta água lisa e parada. Foram removidos o ícone
«▥» e as etiquetas de corrente/fecho. Os botões transparentes de 44×56 px
ficam sobre as portas e iluminam-se ao escolher «abre» ou «fecha».
As animações da água também respeitam movimento reduzido.

Os testes unitários verificam o número de nuvens e sopros nas duas situações,
as portas e a ausência de corrente nos ramos fechados. Os e2e verificam esses
estados, a duração da entrada, movimento reduzido, dimensões e alinhamento
horizontal dos alvos. As capturas esperam pelas animações finitas;
a corrente contínua não bloqueia a captura. Sem alterações nas regras,
soluções ou armazenamento; mantém-se apenas `eda-proto-f2b`.
