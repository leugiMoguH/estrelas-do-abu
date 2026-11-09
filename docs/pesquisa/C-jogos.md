# Pesquisa C — Jogos e mecânicas para a secção «Jogos»

Data da pesquisa: 2026-11-09. Método: WebSearch/WebFetch. Fontes principais: artigos da Wikipédia (EN), páginas de loja, LICENSE em GitHub. Nenhum jogo foi «experimentado»: a evidência de jogabilidade é sempre documentação/review. Pontuações e «adequação» são juízo meu (suposição), marcado como tal.

Nota: foram verificados 30 jogos, não 50. Preferi não encher a lista com títulos que não consegui confirmar.

## 1. Jogos verificados

Legenda: Evid. = tipo de evidência (Doc = documentação/artigo; Rev = reviews citadas; Loja = página de loja; Pap = estudo). Prof. = profundidade. 12–14 = adequação (S/N/?, suposição). Touch = adequado a toque (suposição a partir do design, salvo indicação de plataforma móvel). Licença só onde verifiquei o ficheiro.

### 1.1 Fusão / deslize / palavras (casual)

| # | Nome | Fonte | Mecânica central | Evid. | Prof. | 12–14 | Touch | Licença | Potencial educativo |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Threes | https://en.wikipedia.org/wiki/Threes | Deslizar números numa grelha 4×4; fundir 1+2 e múltiplos de 3; acaba sem jogadas | Doc+Rev (Metacritic 92, Apple melhor iPhone 2014) | Alta | S | Sim (swipe, iOS/Android) | Proprietário | Médio-alto: aritmética de fusão (frações, múltiplos) |
| 2 | 2048 | https://github.com/gabrielecirulli/2048 | Variante de Threes: fundir potências de 2 | Doc (Wikipédia Threes) | Média-alta | S | Sim | **MIT** (LICENSE.txt verificado, © 2014 Gabriele Cirulli). Reutilizável o código, mas queremos mecânica, não clone | Médio: trocar números por frações/equivalências |
| 3 | Wordle | https://en.wikipedia.org/wiki/Wordle | 6 tentativas para palavra de 5 letras; verde/amarelo/cinzento; 1 puzzle/dia | Doc+Rev (Guardian 5/5; PC Gamer 80) | Média | S | Sim | Proprietário (NYT) | Alto em Português/Inglês (ortografia). Evidência de eficácia: ver §5 |
| 4 | Worldle | idem (secção variantes) | Identificar país pela silhueta com pistas de direção/distância | Doc (citado na Wikipédia) | Média | S | Sim | Proprietário | Alto HGP: Portugal/regiões/países |
| 5 | Quordle | idem | 4 Wordles em simultâneo | Doc | Média-alta | S | Sim | Proprietário | Médio |
| 6 | Absurdle | idem | Adversário: a palavra-alvo muda a cada palpite | Doc | Alta | S | Sim | Proprietário | Médio: raciocínio por eliminação |
| 7 | Semantle | idem | Adivinhar palavra por proximidade semântica | Doc | Alta | S (difícil) | Sim | Proprietário | Médio: vocabulário (precisa de modelo semântico; não offline trivial) |
| 8 | Triple Town | https://en.wikipedia.org/wiki/Triple_Town | Grelha 6×6; 3 iguais fundem em tipo superior; guardar 1 peça; urso = obstáculo | Doc | Média-alta | S | Sim (iOS/Android) | Proprietário | Médio; modelo freemium criticado (não aplicável) |
| 9 | Tetris | https://en.wikipedia.org/wiki/Tetris | Peças a cair; linhas completas desaparecem; velocidade sobe | Doc | Alta | S | Sim (adaptável) | Proprietário | Baixo direto; estudos de transferência espacial têm resultados contraditórios (Wikipédia) |

### 1.2 Lógica / puzzle de regras

| # | Nome | Fonte | Mecânica central | Evid. | Prof. | 12–14 | Touch | Licença | Potencial |
|---|---|---|---|---|---|---|---|---|---|
| 10 | Baba Is You | https://en.wikipedia.org/wiki/Baba_Is_You | Empurrar blocos de palavras («X É Y») para reescrever as regras do nível | Doc+Rev (IGF 2018, GDC Best Design; Metacritic 84–87; críticas: níveis finais obscuros) | Muito alta | S (níveis curtos) | Sim (Android/iOS 2021) | Proprietário | Alto Português/Inglês: sintaxe como mecânica |
| 11 | Monument Valley | https://en.wikipedia.org/wiki/Monument_Valley_(video_game) | Manipular ilusões óticas/geometria impossível para guiar a personagem | Doc+Rev (Apple Design Award, 2 BAFTA; 1,5–3 h, pouco difícil) | Baixa-média | S | Sim (nasceu em iOS) | Proprietário | Baixo; referência de estética, difícil em SVG |
| 12 | Hexcells | https://en.wikipedia.org/wiki/Hexcells | Minesweeper com pistas de contagem; sem adivinhação | Doc+Rev (Rock Paper Shotgun) | Média-alta | S | Sim (iOS) | Proprietário | Médio: dedução numérica |
| 13 | Nonogramas (Picross) | https://en.wikipedia.org/wiki/Nonogram | Pistas de comprimentos por linha/coluna revelam imagem | Doc (NP-completo; popularizado pela Nintendo em 1995) | Média-alta | S | Sim | Domínio de ideia (formato público) | Médio: números, leitura de pistas; imagem = tema HGP |
| 14 | Lights Out | https://en.wikipedia.org/wiki/Lights_Out_(game) | Premir alterna a luz e vizinhas; apagar todas | Doc (álgebra sobre Z₂; nem toda a configuração é resolúvel) | Média | S | Sim | Ideia pública | Médio: paridade, padrões; gerar só configurações resolúveis |
| 15 | Sokoban | https://en.wikipedia.org/wiki/Sokoban | Empurrar caixas (nunca puxar); deadlocks | Doc (1981; >4,1 M vendidas) | Alta | S | Sim | Ideia pública | Baixo-médio; bom base para níveis curtos |
| 16 | Rush Hour | https://en.wikipedia.org/wiki/Rush_Hour_(puzzle) | Deslizar veículos 6×6 para libertar o carro vermelho | Doc (40 cartas, 4 níveis; pior caso 51 movimentos) | Média-alta | S | Sim | Ideia pública (marca ThinkFun) | Baixo; excelente curva de dificuldade mensurável |
| 17 | Flow Free | https://en.wikipedia.org/wiki/Flow_Free | Ligar pares de cores sem cruzar, preenchendo a grelha | Doc (>100 M de downloads, 2022) | Média | S | Sim (mobile) | Proprietário | Baixo direto |
| 18 | Poly Bridge | https://en.wikipedia.org/wiki/Poly_Bridge | Construir pontes com materiais e física | Doc (Metacritic 73; >6 M vendas) | Alta | S | Mobile (2.º jogo) | Proprietário | Médio Ciências; física em DOM sem motor é custosa |
| 19 | Simon Tatham's Puzzles | https://github.com/ghewgill/puzzles (espelho; site oficial não consultado) | Coleção de ~40 puzzles lógicos portáteis | Doc (ficheiro) | Variável | S | Sim (existe port Android: não verifiquei) | **MIT** (LICENCE do espelho verificado, © 2004–2014 Simon Tatham) | Referência de geradores de puzzle resolúveis; código C, não direto em TS |

### 1.3 Estratégia / tempo real

| # | Nome | Fonte | Mecânica central | Evid. | Prof. | 12–14 | Touch | Licença | Potencial |
|---|---|---|---|---|---|---|---|---|---|
| 20 | Mini Metro | https://en.wikipedia.org/wiki/Mini_Metro_(video_game) | Desenhar linhas de metro; estações sobrelotadas = derrota; modo infinito | Doc+Rev (IGF 2016 Excellence in Audio; Metacritic iOS 89) | Alta | S | Sim (Android/iOS 2016) | Proprietário | Alto: rede/otimização; HGP se mapa for Portugal |
| 21 | Mini Motorways | https://en.wikipedia.org/wiki/Mini_Motorways | Ligar casas a destinos da mesma cor; escolher melhoria semanal; derrota por pinos excedidos | Doc+Rev (Metacritic 80–87) | Alta | S | iOS (Apple Arcade) e PC | Proprietário | Médio |
| 22 | Cut the Rope | https://en.wikipedia.org/wiki/Cut_the_Rope | Cortar cordas para o doce chegar à criatura, apanhando estrelas | Doc (Metacritic 93; >1000 M de downloads em 2018; página com aviso de fontes fracas) | Média | S (jovem) | Sim | Proprietário | Médio: física, 3 estrelas = objetivos opcionais |
| 23 | Lemmings | https://en.wikipedia.org/wiki/Lemmings_(video_game) | Atribuir habilidades limitadas para salvar uma percentagem | Doc (NP-difícil/PSPACE-completo) | Alta | S | Adaptável | Proprietário | Médio; ritmo lento criticado |
| 24 | Pingus | https://en.wikipedia.org/wiki/Pingus | Clone de Lemmings com pinguins, 77 níveis | Doc | Alta | S | Desktop | **GPL-3.0-ou-posterior** (Wikipédia; ficheiro não verificado). Copyleft: incompatível com reutilização sem rever | Só referência de design |
| 25 | Hextris | https://github.com/hextris/hextris | (mecânica não verificada nesta pesquisa) | só LICENSE | ? | ? | ? | **GPL-3.0** (LICENSE.md verificado) | Copyleft: não reutilizar código |

### 1.4 Programação / otimização / educativos

| # | Nome | Fonte | Mecânica central | Evid. | Prof. | 12–14 | Touch | Licença | Potencial |
|---|---|---|---|---|---|---|---|---|---|
| 26 | DragonBox Algebra | https://en.wikipedia.org/wiki/DragonBox | Equações como puzzle de cartas em duas bandejas; regras algébricas escondidas por ícones; estrelas por poucos movimentos | Doc+Pap (ver §5); Games for Change 2016 Best Learning Game | Média-alta | S (12+ há versão própria) | Sim | Proprietário | Muito alto: aprendizagem **é** a mecânica |
| 27 | Slice Fractions | https://apps.apple.com/ca/app/slice-fractions/id794730213 | Cortar o ecrã em partes (2, 3…) para libertar o caminho; frações sem texto | Loja+Rev (Engadget)+Pap conferência | Média (alvo 8–9 anos) | Pode ser infantil (suposição) | Sim | Proprietário | Muito alto em frações |
| 28 | Euclidea | https://apps.apple.com/ca/app/euclidea/id927914361 | Construir figuras só com régua e compasso; pontuação por nº de passos (L) e construções elementares (E) | Loja (nº de níveis inconsistente: 120/127/156) | Alta | S | Sim (iOS) | Proprietário | Muito alto Geometria; dificuldade elevada, tem dicas |
| 29 | Human Resource Machine | https://en.wikipedia.org/wiki/Human_Resource_Machine | Programar um funcionário com instruções tipo assembly; pontua instruções e velocidade | Doc+Rev (PC Gamer, Boing Boing) | Média-alta | S | Sim (iOS/Android 2016) | Proprietário | Alto Pensamento computacional; Matemática (padrões) |
| 30 | Opus Magnum | https://en.wikipedia.org/wiki/Opus_Magnum_(video_game) | Máquinas alquímicas em grelha hex; ranking por ciclos, custo, área | Doc+Rev (IGF Excellence in Design; Metacritic 90) | Muito alta | Só os mais velhos | PC/Switch | Proprietário | Médio; **o painel de 3 métricas** é boa ideia de rejogabilidade |

## 2. Critérios (0–3, juízo do autor)

D = diversão/rejogabilidade; P = profundidade com regras simples; S = sessões 2–5 min; T = toque; V = viabilidade em DOM/SVG/Canvas sem motor; C = potencial curricular; O = originalidade possível (não clone). Máx. 21. São estimativas qualitativas fundadas na documentação, não medições.

## 3. Shortlist de 10

| Pos. | Mecânica (jogo-fonte) | D | P | S | T | V | C | O | Total |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Fusão por deslize com números (Threes/2048) | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 19 |
| 2 | Regras por blocos de palavras (Baba Is You) | 3 | 3 | 2 | 3 | 2 | 3 | 3 | 19 |
| 3 | Rede sob pressão (Mini Metro/Motorways) | 3 | 3 | 3 | 3 | 2 | 2 | 3 | 19 |
| 4 | Adivinha por feedback (Wordle e variantes) | 3 | 2 | 3 | 3 | 3 | 3 | 1 | 18 |
| 5 | Álgebra/frações como mecânica (DragonBox, Slice Fractions) | 2 | 2 | 2 | 3 | 3 | 3 | 3 | 18 |
| 6 | Medir e cortar (Slice Fractions) | 2 | 2 | 2 | 3 | 2 | 3 | 3 | 17 |
| 7 | Programar e otimizar (Human Resource Machine/Opus Magnum) | 2 | 3 | 2 | 2 | 2 | 3 | 3 | 17 |
| 8 | Luzes/paridade e deslizar (Lights Out, Rush Hour) | 2 | 2 | 3 | 3 | 3 | 1 | 3 | 17 |
| 9 | Construções geométricas (Euclidea) | 2 | 3 | 2 | 3 | 2 | 3 | 2 | 17 |
| 10 | Nonogramas com imagem temática | 2 | 2 | 2 | 3 | 3 | 2 | 2 | 16 |

## 4. Três finalistas (géneros diferentes)

Escolha: 1.º puzzle de fusão (arcade/swipe), 2.º puzzle lógico de regras, 3.º estratégia em tempo real. Cobrem Matemática, Português/Inglês e HGP. Tudo o que segue é **proposta de design (suposição)** salvo onde indicado «documentado».

### F1. «Estrelas inteiras» (fusão por deslize, Matemática: frações)

- **Inspiração documentada**: swipe-merge de Threes/2048 (https://en.wikipedia.org/wiki/Threes). **Original**: peças são fatias de estrela (1/2, 1/3, 1/4, 1/6, 1/8, 1/12); duas fatias na mesma célula **fundem-se se a soma for ≤ 1**; ao chegar a exatamente 1 formam uma estrela inteira que desaparece e pontua. Não há potências de 2.
- **Ligação curricular**: soma de frações com denominadores diferentes, equivalência, ordenação, comparação com a unidade. (Validar contra `content/` e programa do 6.º ano.)
- **Loop de 30 s**: cada deslize move tudo; entra 1 fatia nova; ~8–12 deslizes: o jogador junta 1/2+1/3+1/6 numa estrela.
- **Dificuldade**: começa com denominadores {2,4}; depois {2,3,6}; depois {4,8,12,6}; nível alto: números mistos e fatias «pesadas». Nova fatia escolhida pelo gerador com viés para completar combinações possíveis (justiça) e crescente em mistura.
- **Vitória/derrota**: infinito; derrota com grelha cheia e sem fusões possíveis. Modo «Missão»: completar N estrelas em M deslizes.
- **Recorde**: pontos por estrela, bónus por combos com denominadores diferentes; melhor pontuação local + melhor combo.
- **Riscos**: sorteio injusto/frustrante; a aprendizagem pode ficar implícita (jogar bem por tentativa-erro sem entender); precisa de «dica visual» opcional (barra com a soma em fração). Evitar parecer clone de 2048.
- **Esforço estimado (suposição)**: baixo-médio (lógica de grelha pequena, SVG simples; ~3–5 dias de trabalho + testes de gerador).
- **Evidência**: **documentado**: Slice Fractions (fração como parte-todo e como número) tem estudo UQAM (ver §5), mas é outro jogo; **nenhuma evidência** encontrada para fusão de frações. Engadget (review) observou crianças que focavam só o puzzle e ignoravam a parte de aprendizagem: risco real para este desenho.

### F2. «Frases que mudam o mapa» (lógica de regras, Português e Inglês)

- **Inspiração documentada**: Baba Is You (empurrar blocos de palavras reescreve regras; IGF/GDC premiado) (https://en.wikipedia.org/wiki/Baba_Is_You). **Original**: o mapa tem objetos e blocos de palavras em PT-PT; só uma **frase gramaticalmente válida** (concordância sujeito-verbo/nome-adjetivo, ordem) ativa regras: «O ABU TEM CHAVE» abre porta; «OS GATOS» com «É» incorreto não ativa nada. Variante Inglês: «THE CAT EATS FISH» (3.ª pessoa).
- **Ligação curricular**: classes de palavras, concordância, tempos verbais, ordem da frase; Inglês: present simple. Conteúdo em `content/` validado.
- **Loop de 30 s**: entrar no nível (1 ecrã), empurrar 2–3 blocos, ouvir/ver a regra acender, chegar ao objetivo.
- **Dificuldade**: níveis de 1 regra → 2 regras → regras que conflituam («PORTA É ABERTA» vs «PORTA É FECHADA») → blocos-armadilha de concordância. Baba Is You foi criticado por níveis tardios obscuros (documentado): limitar a profundidade e dar botão «anular» infinito.
- **Vitória/derrota**: sem derrota dura; reiniciar/anular; estrelas por movimentos mínimos (modelo DragonBox: estrelas por poucos movimentos, documentado).
- **Recorde**: movimentos mínimos por nível (histórico local).
- **Riscos**: criação de níveis é o gargalo (cada nível exige validação de solvabilidade e de conteúdo linguístico); verificar que a mecânica de «empurrar» funciona com toque (D-pad virtual ou arrastar por células); gramática PT-PT precisa de revisão humana.
- **Esforço (suposição)**: médio-alto (motor de regras + 20–30 níveis + ferramenta de verificação por solver).
- **Evidência**: **sem estudo** de eficácia encontrado para Baba Is You ou derivados; apenas Doc/Rev de design. Wordle: ver §5 (também sem estudo controlado).

### F3. «Rotas de Portugal» (rede sob pressão, HGP)

- **Inspiração documentada**: Mini Metro (linhas entre estações, derrota por sobrelotação, modo infinito) e Mini Motorways (escolha de melhoria semanal; pinos acumulados) (https://en.wikipedia.org/wiki/Mini_Metro_(video_game), https://en.wikipedia.org/wiki/Mini_Motorways). **Original**: o mapa é um Portugal estilizado; cidades surgem com **produtos regionais** (ex.: cortiça, vinho, peixe) e o jogador traça rotas (rios/estradas/ferrovia) para levar cada produto à região/porto certo; certas rotas só existem se o relevo/rio o permitir (HGP).
- **Ligação curricular**: localização de distritos/regiões, rios, relevo, atividades económicas. Validar nomes/factos em `content/`.
- **Loop de 30 s**: surgem 3–4 cidades, ligar 2 rotas, ver a carga fluir; novo pedido aparece.
- **Dificuldade**: mais cidades e mais produtos; limite de linhas/pontes (recurso escasso); eventos (seca, cheia). Dificuldade ajustada pelo ritmo de aparecimento.
- **Vitória/derrota**: derrota se uma cidade ficar sobrecarregada durante X s (como no Mini Metro); modo infinito sem derrota (documentado no original) para praticar.
- **Recorde**: dias/semanas sobrevividas e mercadorias entregues.
- **Riscos**: o mais difícil de concretizar bem (feel do desenho de linhas em toque; balanceamento); mapa de Portugal exige arte SVG própria; desempenho em telemóvel Android baixo; a aprendizagem de HGP pode ser superficial (decorar posição das cidades) se o jogo não obrigar a pensar em relevo/rios.
- **Esforço (suposição)**: alto (simulação, UI de rotas, balanceamento, arte, conteúdo).
- **Evidência**: **sem estudo** encontrado sobre Mini Metro como instrumento educativo; apenas Doc/Rev. A ligação à aprendizagem de geografia é hipótese nossa.

## 5. Evidência sobre eficácia e retenção (o que realmente encontrei)

- **Meta-análise** (Clark, Tanner-Smith & Killingsworth, 2016, Review of Educational Research 86(1), DOI 10.3102/0034654315582065, https://docs.opendeved.net/lib/YHX5ZVR8): jogos digitais vs. condições sem jogo, g ≈ 0,33 (IC 95% 0,19–0,48; k=57); desenhos «aumentados» ≈ 0,34. Resumos secundários indicam que várias sessões superam uma sessão e que visuais mais simples têm eficácia igual ou superior. Dados do resumo; não li o artigo completo.
- **DragonBox 12+** (ensaio aleatorizado, AERA Open 2023; 1850 alunos após atrito, 7.º ano): melhor resultado no pós-teste do que o grupo de controlo ativo. Uma análise de custo-eficácia da mesma amostra refere efeito 0,269 (https://doaj.org/article/28d05a10d8ea487f80d0c3b6811e3e9d). Estudo anterior (8.º ano, 8 h/4 semanas): mais envolvimento mas menores ganhos do que prática de tipo manual; fonte secundária, não verificada. Wikipédia não cita estudos formais.
- **Slice Fractions**: estudo de Cyr et al. (2015) com alunos do 3.º ano, relatado em EDULEARN16 (https://library.iated.org/view/CYR2016GAM): efeito e transferência para elementos abstratos. «+10,5% no TIMSS após 3 h» é afirmação da loja, **não verificada** com o artigo; n e desenho desconhecidos.
- **Wordle**: nenhuma evidência controlada sobre vocabulário/ortografia (TES; ASCD é opinião; INTED2023 é questionário de satisfação). O criador diz que o puzzle diário limita o jogo a ~3 min (Wikipédia) — design, não retenção medida.
- **Tetris**: transferência para rotação mental com resultados conflituosos (Wikipédia).
- **Retenção/rejogabilidade de jogos educativos aos 12–14 anos**: **não encontrei dados**. O que sustenta o desenho é: loops curtos, partilha/recorde, dificuldade adaptativa e objetivos opcionais (estrelas), que são práticas observadas em jogos populares (documentado), não provadas como retentoras neste público.

## 6. Padrões de mecânica reutilizáveis (hipótese a validar)

- Fusão com soma exata (Matemática: frações, múltiplos).
- Blocos de palavras que formam regras (Português/Inglês: concordância/ordem).
- Rede/rotas com recursos limitados (HGP; Ciências: ciclo da água; História: rotas comerciais).
- Feedback por cor tipo Wordle em palpites (ortografia, datas, países).
- Pontuação multimétrica tipo Opus Magnum (movimentos, tempo, erros), que dá motivo para repetir níveis resolvidos.
- Estrelas por poucos movimentos (DragonBox, documentado).

## 7. Limitações da pesquisa

- Verificados 30 jogos (meta era 50). Menos de metade com estudo real: só DragonBox e Slice Fractions têm ligação a estudos; resto são reviews/documentação.
- Nada foi experimentado: «adequação 12–14», «toque», dificuldade e pontuações são juízo meu a partir de descrições.
- Página Wikipédia de Euclidea, Refraction, Kami, Spelling Bee e Connections do NYT devolveu 404; Semantle/Quordle/Worldle/Absurdle só pela página do Wordle; Hextris sem mecânica verificada.
- Licenças verificadas por ficheiro: 2048 (MIT), Simon Tatham (MIT, no espelho ghewgill; não confirmei o repositório oficial), Hextris (GPL-3.0). Pingus: GPL-3.0+ pela Wikipédia, ficheiro não verificado. react-wordle: LICENSE 404, não verificado. As licenças de código não afetam a nossa abordagem (extrair mecânicas), mas devem ser reconfirmadas antes de qualquer reutilização.
- Os números de níveis de Euclidea divergem entre fontes (120/127/156); Cut the Rope: página Wikipédia marcada como fontes fracas.
- Estudos: artigos completos (Cyr 2015/2016, AERA Open 2023, Clark 2016) não lidos integralmente; só resumos de pesquisa/abstracts. Efeito de +10,5% é publicidade.
- Sem dados sobre retenção de longo prazo, nem sobre meninas de 12–14 anos em particular.
- Esforço e dificuldade das propostas F1–F3 são estimativas, sem protótipo.
- Pesquisa limitada ao que o WebSearch (US) devolveu; fontes de Portugal (DGE, Aprender+, jogos em PT-PT) não exploradas.
