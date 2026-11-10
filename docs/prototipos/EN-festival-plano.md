# Festival do Abu — demonstração de Inglês (plano, Claude, 2026-11-10)

Decisão do produtor (2026-11-10): «Turno no Festival» reformulado como **Festival do Abu**; só uma demonstração jogável de 60–90 s, isolada. Jogo completo NÃO aprovado. Oficina Impossível = alternativa futura. Caso do Abu não avança.

## 0. REVISÃO (2026-11-10, após contraditório do Codex) — substitui §1–§4 e §6
Codex (só leitura) rejeitou a v1 com fundamento, e Claude confirma: (a) a «escassez» tem armadilha irreversível — servir feliz o 1.º pode impedir a vitória, descoberto tarde; (b) depois de descoberta, «servir primeiro o exigente» resolve todas as rondas (decisão trivial); (c) o exemplo tem 2 soluções e só bloqueia em 1/3 das ordens (contrário ao que o §6 dizia); (d) os «sim» do §6 eram hipóteses. **v1 abandonada.**

**v2 — Montar o gelado pedido (criação editável).**
- Objetivo (uma frase): **faz o gelado que cada visitante pede em inglês.**
- Sabores renováveis (vanilla, chocolate, strawberry, mint), até 2 bolas empilhadas, cobertura (*sauce*) e granulado (*sprinkles*) que se põem/tiram. Cone sempre editável (tocar na bola de cima tira-a). Só toques; sem arrastar.
- Visitante 1 (simples, livre): *"Any flavour, please! One scoop."* — a criança escolhe à vontade (expressão).
- Visitante 2 (condição): ex. *"Two scoops, please. Chocolate on top, no sauce!"* — a bola de baixo e o granulado ficam livres (escolha dentro do pedido).
- Entregar (tocar no visitante): se cumprir, reação feliz + lanterna acende. Se falhar, **o visitante devolve e diz só a parte falhada** (*"No sauce, please!"*, *"Chocolate on top!"*, *"Two scoops!"*); o cone mantém-se para corrigir. Sem reinício, sem Abu triste (Abu inclina a cabeça, curioso).
- Anti-adivinha: ≥36 combinações possíveis; teste garante que uma combinação aleatória cumpre o pedido 2 em <25% dos casos e que cada pedido tem ≥2 soluções (liberdade).
- «Outra ronda»: novo par gerado de modelos (*one/two scoops*, *X on top / at the bottom*, *no X*, *with/no sauce*, *with/no sprinkles*, *I don't like X*, *any flavour*), com validação que devolve a 1.ª condição falhada em inglês.
- Métricas locais: tempo até à 1.ª entrega, devoluções por visitante, rondas jogadas.

Critérios do produtor = **hipóteses a validar a jogar**, não cumpridos: (1) objetivo numa frase; (2) ação imediata (tocar sabor → tocar visitante); (3) decisão: escolhas livres dentro do pedido; (4) inglês: cada palavra da condição muda o gelado aceite; (5) 2.ª partida: criar e ver reações; (6) evolução: novas condições (*with/without*, *for my sister*), mais visitantes.
Limite assumido: pode continuar a sentir-se «seguir instruções». A demo existe para o descobrir.

## 1. Conceito (v1, abandonada) (uma frase)
**Serve gelados aos dois visitantes da banca do Abu de modo que ambos fiquem felizes — mas só há poucos sabores, e o que cada um diz em inglês decide quem pode receber o quê.**

## 2. Porque há uma decisão (e não só «tocar no certo»)
- Stock escasso e visível: ex. 1 baunilha, 1 chocolate, 1 morango (cores reais dos gelados; **sem nomes nem ícones no balde**).
- Os dois visitantes estão na fila **desde o início**, cada um com o seu balão em inglês.
- Visitante 1 (simples, flexível): *"Ice cream, please! I love all flavours."*
- Visitante 2 (condição): *"I don't like chocolate. And no strawberry for me, please!"* → só a baunilha serve.
- Impulso natural: dar a baunilha ao 1.º → o 2.º fica sem opção. **Ler os dois pedidos antes de servir é a decisão.** O inglês (*all / don't like / no*) muda o resultado; os ícones e posições não.

## 3. 60–90 segundos (sequência proposta)
| Tempo | Ecrã / ação |
|---|---|
| 0–5 s | Noite de festival, lanternas em forma de estrela. Banca de gelados; Abu atrás do balcão (sentado, cauda a abanar). Dois visitantes na fila com balões. Três baldes de cor diferente. Frase única no topo: «Deixa os dois visitantes felizes.» |
| 5–20 s | Toca num balde → a bola salta para o cone (som curto). Arrasta/toca no cone → vai para o visitante escolhido. |
| 20–35 s | Visitante 1 recebe e reage (feliz, salta). |
| 35–60 s | Serve o visitante 2. Se o sabor viola o pedido: cara de desagrado, balão *"Oh no… I don't like chocolate!"*, Abu fica triste e tapa os olhos; o gelado volta ao balde (sem castigo). Se não sobrar sabor válido: *"Oh… no ice cream for me today."* e botão «Outra vez». |
| 60–90 s | Ambos felizes → lanternas acendem-se em constelação, Abu salta feliz, contador «Visitantes felizes». Botão «Outra ronda» traz **nova combinação** (outros sabores/condições). |

Ajudas sem quiz: botão de altifalante em cada balão (voz local `en`, opcional; texto sempre visível). Após 1 falha, Abu olha para o balão que importa (sem traduzir).

## 4. Variação (justifica a 2.ª partida e prova que evolui)
Rondas geradas de um conjunto pequeno de modelos, com a posição dos baldes baralhada:
- *I love all flavours / Any flavour is fine* (flexível)
- *I don't like X* · *No X, please* · *Only X, please!* · *X or Y, please* (escolha)
- Pares de stock (3 sabores, 1 de cada; mais tarde 4 sabores: vanilla, chocolate, strawberry, mint).
Solver nos testes: cada ronda tem **≥1 distribuição válida** e **a distribuição «ingénua» (dar ao 1.º o primeiro balde válido para ele) falha em pelo menos metade das rondas**, para que ler importe.
Evolução futura (não implementar): 3.º visitante, *two scoops*, coberturas *with/without*, *for my sister — the girl with glasses*.

## 5. Âmbito técnico (protótipo)
- Ficheiros permitidos: `prototipos/en/index.html`, `src/prototipos/en/**` (main.ts, rules.ts, scene.ts, style.css), `tests/core/prototipo-en.test.ts`, `tests/e2e/prototipo-en.spec.ts`, entrada `prototipoEn` em `vite.config.ts`.
- Regras puras em `rules.ts` (rondas, validação, solver); cena SVG própria; Abu = `src/art/assets/d5/abu-{sit,happy,sad,curious}.webp`.
- Chave `eda-proto-en` (só nº de rondas felizes e métricas mínimas: toques até 1.ª entrega, falhas por ronda). Sem rede, microfone, dependências novas; não tocar app principal, `eda`/`eda-e`, F2/F2b.
- Inglês revisto por humano antes da sessão com a criança. PT-PT só na frase do objetivo e botões.

## 6. Verificação dos 6 critérios do produtor (antes de implementar)
1. Objetivo numa frase: sim (§1).
2. Ação imediata: tocar balde → tocar visitante.
3. Decisão interessante: distribuir stock escasso lendo os dois pedidos.
4. Inglês influencia: condições negativas/flexíveis decidem a única distribuição válida.
5. 2.ª partida: falhar à 1.ª é provável e engraçado; nova ronda tem outra combinação.
6. Evolui sem repetir: modelos de condição + stock + visitantes (§4).
Risco honesto: pode parecer «truque» à 1.ª vez; puzzle de lógica pequeno pode cansar se só houver 2 visitantes. A demo serve para descobrir isto.

## 7. Critérios de aceitação
Técnicos (Claude verifica): unit (solver, rondas, condições), build, e2e em 390×844, 820×1180, 1280×800 (cabe sem scroll, ronda ganha, ronda falhada recuperável, 0 erros de consola, sem chamadas a microfone/rede, só a chave `eda-proto-en`), capturas inspecionadas.
Produtor a jogar: percebe o objetivo sem explicação; 1.ª entrega ≤20 s; o resultado muda conforme o que leu; a falha é clara e não frustrante; quer uma 2.ª ronda; aspeto ao nível da V3.
