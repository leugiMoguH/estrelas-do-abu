# Ecos das Estrelas — desenho do protótipo F2

Protótipo isolado, com três desafios progressivos, em `/prototipos/f2/`.

## Peças e acontecimentos

Não há seletores nem frases ou camadas previamente escolhidas. Cada cartão-acontecimento tem um banco de duas peças de participantes e três peças de ação. Os botões têm altura mínima de 48 px. Tocar numa peça seleciona-a e seleciona o respetivo cartão; depois de montar a frase, tocar em Antes, Agora ou Depois coloca uma fotografia dessa frase no céu. O botão da frase permite voltar a selecionar um cartão já montado. Não há arrastamento obrigatório.

Há três cartões nos dois primeiros desafios e quatro no terceiro: pelo menos um pode ficar no banco. «Esperar junto à passagem» é um distrator plausível em todos: uma espera bem formada é válida, mas não liberta estrelas nem altera o mecanismo. Pode ser omitida ou incluída numa solução. Não se exige usar todos os cartões. Os outros acontecimentos também podem ser inúteis ou prejudiciais dependendo dos participantes, do momento e da ordem.

As camadas mostram apenas «◀ Antes», «● Agora» e «▶ Depois». Os nomes gramaticais ficam na ajuda opcional «?». O destaque da combinação de palavras só aparece depois de uma falha de concordância; uma falha temporal recebe a explicação do eco suspenso, sem esse destaque.

Dentro da mesma camada vale a ordem de colocação; recolocar leva o cartão para o fim. Alterar peças no banco não altera frases já colocadas. «Retirar do céu» devolve um acontecimento ao banco. Anular restaura a última colocação ou remoção; reiniciar limpa o desafio. Estas ações interrompem a reprodução. Experimentar repete a cena desde o estado inicial; conta uma tentativa mesmo com o céu vazio. A viagem recupera cinco estrelas (1 + 2 + 2).

## Soluções e alternativas verificadas por código

Estas são soluções testemunha, não soluções únicas. O solver usa os dados de `challenges.ts` e confirma cada testemunha com `simulate`.

| Desafio | Antes | Agora | Depois | Distrator dispensável |
|---|---|---|---|---|
| A caixa dos ecos | O Abu abriu a caixa | A estrela sai da caixa | — | O Abu espera junto à passagem |
| Duas pontas, uma ponte | As estrelas levantaram a ponte | As estrelas atravessam a ponte | — | O Abu espera junto à passagem |
| O canal do tempo | O Abu abriu a comporta | As estrelas atravessam o canal | O Abu fechará a comporta | O Abu espera junto à passagem |

1. **Ordem e causa:** sair com a tampa fechada é válido sem efeito útil. Sair antes de abrir, ambos em Agora com formas do presente, deixa a estrela na caixa; abrir depois não repete a saída.
2. **Participantes e concordância:** «A estrela levantou a ponte» ergue apenas uma ponta e impede a travessia. «As estrelas levantou a ponte» produz um eco incompleto e sobe apenas uma ponta.
3. **Combinação:** fechar em Agora antes da travessia bloqueia as estrelas, embora ambas as frases possam estar bem formadas. É preciso recuperar duas estrelas e terminar com a comporta fechada.

Cada desafio classifica os acontecimentos como efeito, válido sem efeito ou impossível. Forma e participantes incompatíveis, ou forma fora da camada temporal, são impossíveis. A espera não resolve nenhum desafio sozinha; acrescentá-la às três soluções testemunha mantém o sucesso, como verificam os testes.

## Arte e diferenças face a Baba Is You

O Abu é a imagem de produção `src/art/assets/d5/abu-sit.webp`, a mesma pose base usada por `src/art/d/abu.ts`, importada diretamente e apenas para leitura. Evita carregar o catálogo de acessórios ou dependências da aplicação. Não foi redesenhado. O mecanismo continua a ser SVG local. A constelação é uma rede de quatro estrelas ligadas, inicialmente apagadas, que ganha luz dourada quando o desafio termina com sucesso.

Não há grelha, empurrões nem regras SUJEITO–É–PROPRIEDADE. As palavras montam acontecimentos locais numa sequência temporal; não redefinem propriedades globais do mundo. Escolher acontecimentos e omitir o distrator acrescenta decisão, mas o espaço de jogo permanece pequeno e fechado. Não se pretende reproduzir o motor de Baba Is You.

## Organização, teclado e isolamento

- `challenges.ts`: dados, formas e soluções testemunha.
- `rules.ts`: simulação pura, classificação, colocações e histórico.
- `scene.ts`: composição visual e importação da imagem do Abu.
- `view.ts`: HTML dos bancos, linha temporal e ajuda.
- `main.ts`: eventos, reprodução, foco e persistência.
- `style.css`: composição responsiva e movimento reduzido.

Os ficheiros têm menos de 400 linhas e as funções menos de 50. Os eventos são tratados no elemento raiz. A reconstrução do HTML restaura o foco por identidade do botão, sem deslocar a página. Durante a reprodução, preserva o controlo que a pessoa tiver focado entretanto. A ajuda mantém o seu estado aberto. Quando um controlo desaparece, retirar transfere o foco para a frase do cartão e avançar transfere-o para o título do novo desafio.

Só o melhor total de tentativas de uma viagem completa é guardado em `eda-proto-f2`, com leitura/escrita protegidas por try/catch. Não há importações de `src/app` ou `src/core`, integração com recompensas, dependências novas ou publicação.

## Verificação e limitações

A busca exaustiva enumera todos os subconjuntos de cartões, todas as combinações participantes × forma × camada e todas as ordens de colocação: **36 991**, **36 991** e **2 663 353** sequências, respetivamente (**2 737 335** no total). Inclui o céu vazio. Compara a classificação impossível com a concordância e a camada em cada escolha; exige soluções e acontecimentos sem efeito. Testa também dados inválidos, duplicados, consequências alternativas, distratores e reversibilidade do histórico.

O solver prova as regras implementadas, não certifica a língua nem a diversão. As formas verbais são dados explícitos: o código verifica número e tempo declarados, sem inferir a gramática a partir do texto. Algumas combinações são deliberadamente fantasiosas. A naturalidade PT-PT e a compreensão por uma criança continuam a precisar de revisão humana.

O Playwright exercita 390×844 e 820×1180 com `tap()` e `hasTouch`, e 1280×800 com clique. Verifica foco por Enter/Espaço, reconstruções e reprodução, remoção, ajuda opcional, botões de pelo menos 44 px, ausência de scroll horizontal e erros de consola, e acessos a localStorage exclusivamente pela chave do protótipo (incluindo vigilância de `key` e `clear`). Completa também a viagem com armazenamento indisponível e movimento reduzido.

As capturas `desafio-1.png` a `desafio-3.png`, equivalentes `-sucesso.png` e `ecos-final.png` são fullPage e ficam na pasta de saída de cada teste em `test-results/`, para os três viewports. O telemóvel exige deslocação vertical para percorrer o banco e o céu. Não há áudio, controlo de velocidade, geração de níveis ou teste com a criança.

Validação final (2026-11-09): `npm test` — **31 ficheiros, 1 158 testes aprovados (7 F2)**; `npm run build` — aprovado, **244 módulos**; `npx playwright test tests/e2e/prototipo-f2.spec.ts` — **9 testes aprovados nos três viewports**. Foram geradas 39 capturas fullPage (duas viagens × três viewports × seis estados dos desafios, mais três finais), incluindo os três desafios antes/depois do sucesso e o final. Inspecionados visualmente os três desafios no telemóvel e desktop, e o terceiro no tablet. A compilação mantém o aviso de tamanho do chunk principal, fora do âmbito F2. Sem commit, push, publicação ou alterações fora do âmbito autorizado nesta correção.
