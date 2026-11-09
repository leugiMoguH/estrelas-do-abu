# Roteiro até à V1.0 — Estrelas do Abu · v2

Estado: **adotado pelo produtor (2026-11-09) como guia de produção** (plano v2 no `PROJECT_STATE.md`). As funcionalidades não ficam aprovadas em bloco: cada fase tem critérios próprios e as decisões de motivação esperam pelo feedback da criança.
Versão anterior (v1, 2026-11-09): commit `9c48c53` (`git show 9c48c53:docs/ROADMAP.md`).
Revisão de 2026-11-09:
- **Claude:** inspeção de código, build e medição de arranque.
- **Codex:** revisão crítica só de leitura (secção 12). Os pontos factuais foram reconfirmados pelo Claude no código.

Legenda:
- **[V]** verificado no código, no build ou por medição nesta revisão.
- **[R]** retirado de registos anteriores, não repetido agora.
- **[H]** hipótese a testar.
- **[C]** depende da criança.

---

## 1. Visão e pilares

**Visão.** Um jogo de estudo do 6.º ano em que explorar, personalizar, interagir e aprender são a mesma experiência. Não é um questionário com arte bonita. A criança volta por iniciativa própria, e o que estuda está certo.

| Pilar | Exige | Prova |
|---|---|---|
| A. Diversão | Curiosidade, descoberta, escolha, expressão. Aprender também é jogar. | Comportamento observado [C]: escolhe sozinha, continua sem pressão, pede mais, regressa sem lembrete. |
| B. Rigor | Fontes verificáveis, competências AE, respostas certas, explicações úteis, progressão fundamentada. | Testes de conteúdo, validação de fontes, revisão humana (perguntas **e** lições dos tutores). |
| C. Identidade | Direção D, personagem modular, Abu expressivo, tutores, cenários e áudio coerentes. | Revisão visual em 3 viewports; sem regressão para SVG rudimentar. |
| D. Confiança | Telemóvel, tablet e PC; progresso protegido; acessível; privado; sem pressão nem manipulação. | Testes de dados e recuperação, medição, auditoria de acessibilidade. |

**Lição do BRUMA aplicada.** Nenhum sistema grande avança antes de uma experiência pequena e completa mostrar interesse real da criança. Preferir efeitos visuais não é o mesmo que diversão duradoura. Testes verdes e pareceres de agentes não substituem a observação.

---

## 2. Situação real da V3

### Verificado
| Área | Facto |
|---|---|
| Publicação | [V] `gh-pages` 48adabd. A raiz é a demo v0.1 (`index-DwJLXUVP.js`). A V3 está em `preview/e/`, com backups `e-prov1`–`e-prov7`. |
| Git | [V] `redesign/art-v1` está à frente da `main`, sem divergência (a `main` não tem commits que faltem à branch). |
| Arranque | [V] Build atual, Fast 3G, 390×844, sem perfil: 36 pedidos, **583 KB transferidos**, LCP 2,9 s, load 4,3 s, 0 erros. Maior recurso: JS `welcome`, com 188 KB comprimido (677 KB em bruto). |
| PNG pesados | [V] `room-his.png` (2,3 MB) e `tutor-tome-neutral.png` (2,2 MB) **não carregam no arranque**. Carregam na sala de HGP (`src/art/d/scenes.ts`) e no tutor Tomé (`src/app/tutor.ts`). |
| Escrita de HTML | [V] 53 escritas: 33 `innerHTML` + 20 `insertAdjacentHTML`. A alcunha é escapada (`onboarding.ts:29`). O equipamento é normalizado pelo catálogo (`catalog.ts:130`). Não há conteúdo externo. **Não foi encontrada injeção alcançável.** Mas o esquema do Save aceita texto arbitrário (`save.ts:131`), e `art/d/abu.ts:48` interpola JSON num atributo sem escape, o que só é seguro enquanto os valores forem controlados. Conclusão: risco baixo, não nulo. |
| Artigos desconhecidos | [V] `ownedItems`, `equipment` e `receipts.items` aceitam ids desconhecidos (`save.ts:80,159,206`). `collection-ui.ts:27` falha com um id desconhecido. Só é alcançável num caminho específico: o resultado mostra apenas o recibo da tentativa atual (`result.ts:50`). É uma fragilidade confirmada; a reprodução integrada está por fazer. |
| Exportação | [V] **`skills` (níveis por competência) fica fora do Save exportado e é apagado ao importar** (`store.ts:21`, `extras/options.ts:68,102`). A exportação atual **não** protege toda a aprendizagem. |
| Histórico | [V] `seen[]` guarda referência, competência e data, mas **não** guarda acerto nem sessão, e fica limitado a 500 entradas (`save.ts:5–13,180`). Dá os dias com respostas registadas. Não dá taxa de acerto histórica, sessões nem prova de iniciativa própria. |
| Chaves de armazenamento | [V] O namespace é fixado no arranque (`store.ts:26–28`, `EDA_NS`, por omissão `eda`). A V3 publicada usa `eda-e` [R]. Não há SW, manifest nem `storage.persist()`. |
| Modos | [V] **Estudar, Teste e Rever.** Não existe um modo «Exercícios» separado. |
| Interação | [V] Formatos `mcq`, `numeric`, `text`, `order` e `cloze`. Mapa só como figura estática. Já existem barra de progresso da sessão (`session.ts:145`), som de acerto de 2 notas (`audio.ts:39`) e reação do Abu. A mudança de ecrã não tem transição. |
| Recompensas | [V] Os artigos mensais exigem Teste com ≥10 perguntas distintas e ≥80% (`collection-ui.ts:7`). Estudar e Rever não os atribuem. [H] Pode favorecer repetir testes fáceis e evitar dificuldades. |
| Conteúdo | [V] Matemática: 13 temas com geradores. Português: 3 temas, só gramática. HGP: capítulos, subcapítulos e fábrica V2; há sequências cronológicas e anos verificáveis (`kb/historia/xviii.reasoning.ts:45–49`, `xviii.atoms.ts:15`). [R] 7 conhecimentos HGP pendentes. Lições dos tutores marcadas `needs-human-review` (`content/tutor/portugues.ts:4`). |
| Testes | [R] 1073 unitários, 69 e2e; 2 testes instáveis. |

**Validado pela criança [R]:** a direção D e o interesse pela personalização. **A V3 ainda não foi testada.** Não há dados de retenção.

**Contrato:** o `PRODUCT_CONTRACT.md` define a demo (Matemática + Português) e manda parar depois de publicar. A V3 já inclui HGP, e este roteiro leva à V1.0 com 3 disciplinas. O âmbito pós-demo tem de ficar registado e o contrato atualizado quando for aprovado (decisão 1).

### Correções ao v1
1. Os PNG pesados não pesam no arranque, só na sala de HGP.
2. Cópias de segurança no mesmo `localStorage` **não** protegem contra o apagamento do Safari (limite de 7 dias do WebKit para sites não instalados), porque esse apagamento leva a origem inteira. Só protegem contra corrupção.
3. 53 escritas de HTML não são 53 vulnerabilidades.
4. A exportação não inclui `skills`, por isso relatório e constelação não podem assentar só nela.
5. O roteiro v1 tinha a numeração de fases a saltar e o polimento antes da validação da mecânica.
6. Missões e quarto decorável chocam com o pilar D ou têm custo desproporcionado. A sequência de dias fica para decisão em F3.

---

## 3. Avaliação das propostas do v1

Decisões: **MANTER** · **MELHORAR** · **ADIAR** (fora da V1.0) · **DESCARTAR** · **ACRESCENTAR**.

### 3.1 As 10 melhorias
| # | Proposta v1 | Decisão | Fundamento e nova forma |
|---|---|---|---|
| 1 | PNG → WebP/AVIF | MANTER (F4) | Custo baixo. Medir a abertura da sala de HGP antes e depois e comparar visualmente. Não bloqueia nada. |
| 2 | Dividir bancos com `import()` | MELHORAR (F4) | O arranque já é aceitável. Fazer só se a medição num tablet real mostrar atraso percetível. |
| 3 | `srcset` e pré-carregamento | MELHORAR (F4) | Junta-se à 2 numa tarefa guiada por medição. |
| 4 | PWA | ADIAR para decisão em F4 | **Opcional na V1.0.** Um SW mal feito prende a criança a versões antigas, e um SW na raiz controlaria `/preview/*`. Só entra se passar 4 testes (1.ª instalação, sem rede, atualização, cache parcial). |
| 5 | CSP em `<meta>` | MANTER (F4) | Defesa em profundidade. O GitHub Pages não permite cabeçalhos. Os `style=` inline obrigam a `style-src 'unsafe-inline'`; `frame-ancestors` não funciona em meta. |
| 6 | Escape obrigatório | MELHORAR (F1, parcial) | Classificar as 53 escritas por origem dos dados; corrigir as que recebem dados guardados (incluindo `abu.ts:48`); testes dos percursos reais (alcunha, importação). Não reescrever tudo. |
| 7 | 3 cópias rotativas | MELHORAR (F1) | Exportação completa (Save + perfil + `skills`), uma cópia contra corrupção, `storage.persist()` e lembrete de exportação. Recuperação testada. |
| 8 | Tokens CSS e temas legados | MELHORAR (F3) | Confirmar usos antes de apagar (`theme.ts`, `theme-a/b/d.css`, `preview.ts`). Os previews publicados são builds separados. |
| 9 | Transições e estados de botão | MANTER (F2/F3) | Entra na demonstração A/B de F2 e só é generalizado em F3 se resultar. |
| 10 | Feedback imediato | MANTER (F2/F3) | Igual à 9. Vibração só em Android. |

### 3.2 As 10 recomendações
| # | Proposta v1 | Decisão | Fundamento |
|---|---|---|---|
| 1 | Sensação de jogo em tudo | MELHORAR | Demonstração A/B em F2, com a ordem das versões alternada. Generalizar em F3 só o que a criança preferir. Preferência por efeitos ≠ diversão duradoura. |
| 2 | Áudio profissional | MELHORAR | Primeiro 6–8 efeitos para as ações-chave (F2/F3). Música por zona fica para depois. Proveniência obrigatória. |
| 3 | Constelação | MELHORAR · ADIAR decisão | Ligada ao domínio de competências, não à moeda. Depende de `skills` ser exportável (F1). Só depois de validado o ciclo principal. |
| 4 | Campus vivo | ADIAR | Decorativo. |
| 5 | Primeiro minuto | MELHORAR | Só se F0 mostrar hesitação inicial. |
| 6 | Sessões com arco | MELHORAR | A barra de progresso já existe [V]. Falta só a pergunta final destacada e um fecho em alta; entra na demonstração. |
| 7 | Vozes gravadas | ADIAR | Custo de produção. A leitura `speechSynthesis` pt-PT varia por dispositivo [H]. |
| 8 | UI ao nível de consola | MELHORAR | Integrada nos tokens e estados (F3). |
| 9 | Dados de playtest locais | MELHORAR | `seen[]` só dá dias com respostas. Para mais, guardar no Save um registo mínimo de sessões (início, fim, modo, acertos), local e exportável, sem envio. O lembrete externo (se houve) é anotado pelo adulto. |
| 10 | Pipeline de qualidade | MELHORAR | Orçamento de bundle e capturas de base só para 5 ecrãs-chave, com tolerância. |

### 3.3 As 15 funcionalidades
| # | Proposta v1 | Decisão | Fundamento |
|---|---|---|---|
| 1 | Objetivo diário e sequência | ADIAR decisão (F3) | **Não existe sequência de dias no código** [V]. O `mastery.streak` conta acertos seguidos e só ajusta a dificuldade (`core/mastery.ts:52`, `session.ts:55`); é positivo e mantém-se. A proposta de sequência de dias será decidida em F3 com o feedback da criança, distinguindo recompensa positiva de penalização por ausência. A alternativa preferida é o «objetivo desta sessão». |
| 2 | Preparar teste com data | MANTER (F4) | Ligação à escola. O atalho já existe [V]; falta a data e o plano. |
| 3 | Área do encarregado | ADIAR até haver uma decisão concreta que ajude | Quando vier, é um relatório só de leitura: estudado vs. dominado, dificuldades persistentes, matérias por trabalhar. Exige o registo de sessões e `skills` exportável. Sem diagnósticos. |
| 4 | Missões semanais | MELHORAR → «sugestão do Abu» | Opcional, sem prazo, baseada nas competências fracas. |
| 5 | Caderno de erros guiado | MANTER (F3) | `mistakes[]` existe [V]; liga-se ao Rever. |
| 6 | «Explica de outra forma» | ADIAR | Exige uma 2.ª explicação validada por conceito. |
| 7 | Constelação | ADIAR decisão | Ver recomendação 3. |
| 8 | Leitura em voz alta | ADIAR | Testar vozes pt-PT nos dispositivos reais primeiro. |
| 9 | Cromos HGP | ADIAR | Arte nova; avaliar depois do piloto. |
| 10 | Desafio relâmpago | ADIAR | Risco de ansiedade. |
| 11 | Quarto do Abu | DESCARTAR (V1.0) | Novo pipeline de arte e mais economia sem valor educativo. |
| 12 | Postal PNG | ADIAR | Bom candidato depois da V1.0. |
| 13 | Retomar sessão | MANTER · antecipar se F0 mostrar interrupções | Problema real em tablets. |
| 14 | Tema escuro / modo leitura | DESCARTAR o escuro · MANTER o modo leitura (F3) | As cenas raster foram feitas para fundo claro. |
| 15 | Conquistas de aprendizagem | ADIAR decisão | Junta-se à constelação. |

### 3.4 Acrescentado
| Item | Porquê |
|---|---|
| **Piloto «aprender jogando»** (F2) | Tudo hoje é formato de questionário [V]. É a pergunta mais importante do projeto. |
| **Exportação completa** (F1) | `skills` perde-se na exportação e na importação [V]. É a base da proteção do progresso. |
| **Política para artigos desconhecidos** (F1) | Aceites pelo esquema e com falha na renderização [V]. Renderização tolerante que preserva os artigos (compatível com versões futuras). |
| **Revisão da economia de recompensas** (F0/F3) | Os artigos mensais só vêm de testes com ≥80% [V]. Observar se isso leva a evitar dificuldades; experimentar reconhecer a prática e a revisão. |
| **Revisão pedagógica dos tutores** (F2/F4) | Lições `needs-human-review` [V]. |
| **Acessibilidade antes do piloto** (F2) | Não fica concentrada no lançamento. |
| **Migração da raiz** (F4) | Namespace fixado no arranque [V]. |
| **Origem partilhada** (risco) | Todos os projetos GitHub Pages da conta partilham origem, quota e apagamento. Subdomínio próprio = custo e decisão futura. |

---

## 4. Fases por dependências

```
F0 Observar V3 ─► F1 Proteger o progresso (mínimo) ─► F2 Piloto + demo A/B ─► DECISÃO avançar/ajustar/abandonar
                                                                                   │
              ┌────────────────────────────────────────────────────────────────────┘
              ▼
F3 Generalizar o que provou ─► F4 Conteúdo prioritário + técnica de lançamento ─► F5 V1.0
```
Regras:
- Uma fase grande de cada vez.
- F1 pode correr antes ou em paralelo com F0: é pequena e protege a jogadora.
- CSP, imagens e PWA não bloqueiam a observação e passam para F4.

### F0 — Observar a V3
- **Resultado:** 1 sessão observada (20–25 min) registada em `docs/playtest/` (protocolo na secção 6).
- **Aceitação:**
  - registo com 4 colunas separadas;
  - 3 problemas e 3 momentos positivos;
  - nota sobre recompensas (escolhe Teste para ganhar artigos? reação ao erro?) e sobre interrupções;
  - escolha da hipótese de piloto (museu/linha do tempo vs. mapa).
- **Arrumação:** corrigir T3.1 e T3.2 no estado; tirar `bash.exe.stackdump` do Git.

### F1 — Proteger o progresso (mínimo)
1. Exportação e importação completas: Save + perfil + `skills`, com precedência explícita e compatibilidade com ficheiros antigos.
2. Política para artigos desconhecidos: preservados no Save e renderização tolerante (`collection-ui.ts:27` e equivalentes).
3. Classificar as 53 escritas de HTML; escapar as que recebem dados guardados (incluindo `abu.ts:48`); testes e2e nos percursos reais.
4. Uma cópia de recuperação contra corrupção, `storage.persist()` e lembrete discreto de exportação (é a única mudança visível).
5. Estabilizar os 2 testes instáveis se interferirem com a verificação.

**Aceitação:** testes novos falham sem a correção; ida e volta exportar → apagar → importar mantém Save, perfil e `skills`; Save corrompido → recuperado; importação inválida → nada se perde; `tsc`, unitários e e2e verdes; consola limpa nos 3 viewports.

### F2 — Piloto «aprender jogando» e demonstração A/B
**Piloto (hipótese a escolher em F0):**
- **A — «Exposição do museu» (recomendada):** a criança escolhe uma pista, coloca um acontecimento no sítio certo da exposição e vê a cena mudar (descoberta).
  - Comparar com ordenar simples. Base: as sequências curtas da fábrica, começando pelas reformas do ensino (`xviii.reasoning.ts`), filtradas pela elegibilidade (`xviii.validation.ts:12`).
  - **Separar cronologia de causalidade** e rever as relações à mão.
  - Excluir sequências com datas fora do século (ex.: Clérigos, 1996).
- **B — Percurso de descoberta no mapa:** 3 locais (`pt-map.ts` e as tarefas de localização existentes). Exige alvos táteis e navegação acessível.

**Ficha obrigatória:** objetivo educativo · ação · feedback · sucesso · falha · revisão (entra em Rever) · testes · evidência de interesse.

**Demonstração A/B de sensação de jogo (mesma sessão com a criança, ordem alternada):** numa sessão de Estudar, comparar a versão atual com uma versão que tem transição de ecrã, feedback animado e sonoro desenhado, pergunta final destacada e resultado com contagem animada. Ativa com `?feel=2`. Respeita movimento reduzido, volume e silêncio.

**Antes do teste com a criança:**
- revisão humana do conteúdo do piloto;
- teclado, contraste e movimento reduzido verificados no piloto;
- 3 viewports e testes automáticos verdes.

**Aceitação:**
- piloto jogável de ponta a ponta;
- sessão observada [C] com tarefas definidas (duração, ajuda necessária, se escolhe continuar);
- **decisão registada:** avançar / ajustar / abandonar.

### F3 — Generalizar o que provou
- Aplicar a sensação de jogo escolhida; tokens CSS; remover o código de temas sem uso; estados de componente; modo leitura; retomar sessão; caderno de erros ligado ao Rever.
- Replicar a mecânica aprovada no máximo uma vez por disciplina, com ficha.
- Economia: ajustar se F0/F2 mostrarem que leva a evitar dificuldades (ex.: reconhecer prática e revisão sem exigir nota alta, mantendo o anti-repetição).
- Coleções de 2027-02 a 2027-06 **só se houver interesse observado** [C].
- **Aceitação:** sem regressões (e2e e capturas dos 5 ecrãs-chave), revisão visual nos 3 viewports, 2.ª sessão observada [C].

### F4 — Conteúdo prioritário e técnica de lançamento
1. **Conteúdo por competências prioritárias e lacunas, não por número de temas.** Matriz AE do ano por disciplina, com cada competência marcada coberta / parcial / ausente. Português primeiro (leitura e compreensão, ortografia). Revisão humana de amostras e das lições dos tutores. HGP: os 7 pendentes e a hierarquia (precisa das fotografias do índice) [R].
2. «Preparar teste» com data.
3. Registo mínimo de sessões no Save (base para um relatório futuro).
4. Técnica: PNG → WebP/AVIF; CSP; divisão do bundle se a medição justificar; PWA opcional ensaiada num preview.
5. Migração da raiz ensaiada num preview: ler as chaves `eda-e` (perfil, Save, `skills`), com precedência explícita, cópia antes de substituir e reversão documentada.

**Aceitação:** matriz AE publicada no repositório; testes de conteúdo verdes; ensaios de migração (e de PWA, se incluída) com sucesso num preview; medições antes/depois registadas.

### F5 — Lançamento V1.0
Revisão independente (por quem não implementou a parte revista), acessibilidade, sessão final com a criança, publicação na raiz **com autorização**, v0.1 arquivada, tag `v1.0`, confirmação no URL público.

**Fora da V1.0:** Ciências, Inglês, campus vivo, vozes, cromos, desafio relâmpago, postal, quarto do Abu, tema escuro, área do encarregado completa, subdomínio próprio.

---

## 5. Aceitação e publicação (todos os blocos)
1. Testes pertinentes verdes; os novos falham sem a correção.
2. Navegador em 390×844, 820×1180 e 1280×800; consola limpa.
3. Save, perfil e `skills` preservados (teste de migração quando o formato muda).
4. Revisão proporcional ao risco; commit e tag.

Pré-visualização: build verde, novo `preview/e-*` (ou `preview/e` **com backup**), autorização, confirmação no URL público e registo no estado.

---

## 6. Testes com a criança
**Protocolo (20–25 min, no máximo 1 sessão por bloco):**
1. «Este é o jogo. Faz o que te apetecer.» Não dar mais instruções.
2. 10 min de observação em silêncio:
   - o que escolhe primeiro;
   - hesitações de mais de 5 s;
   - o que procura;
   - se lê o feedback;
   - expressões.
3. 2 tarefas naturais: «Estuda um bocadinho de uma matéria que tenhas teste» e «Mostra-me o que ganhaste».
4. 3 perguntas no fim: «O que foi mais giro?», «O que foi chato ou confuso?», «Voltavas amanhã?».
5. Nos dias seguintes, o adulto anota se ela voltou e se houve lembrete. O Save só mostra os dias com respostas.

**Registo:** observado · dito pela criança · interpretação do adulto · hipóteses dos agentes.

**A/B:** alternar a ordem das versões; registar escolha, tempo e se pede para repetir.

**Regras:**
- Um problema na experiência principal é corrigido antes de qualquer funcionalidade periférica.
- Uma sessão positiva não prova retenção.
- 3 dias de uso por quinzena é um limiar experimental, não uma prova.

Modelo adaptado do `playtest-report` do Claude-Code-Game-Studios (lido, não instalado).

---

## 7. Produção Claude/Codex e skills
| Papel | Quem |
|---|---|
| Planear, definir critérios, verificar de forma independente (diff, testes, navegador), medir, publicar com autorização | Claude |
| Implementar blocos com âmbito fechado e testes; rever planos de forma construtiva | Codex (`codex:codex-rescue`) |
| Auditoria independente | Codex só em partes que não implementou, ou um revisor local (`typescript-reviewer`, `security-reviewer`) |

**Skills:**
- **Claude-Code-Game-Studios** (MIT; 49 agentes, 72 skills): **não instalar.** Depende de hooks próprios (`yaml-helper.sh`), da estrutura `design/gdd/` e de «director gates», tudo desproporcionado. Usado como referência:
  - `playtest-report` (secção 6);
  - veredicto do `vertical-slice` (avançar / pivotar / abandonar, em F2);
  - divisão do `team-polish` (performance, arte técnica, som, QA) como lista de verificação em F3.
- **Instaladas e úteis:** `ui-ux-pro-max` (F3), `security-review` (F1), `e2e-testing`, `verification-before-completion`.

**Limites:** 1 bloco de cada vez; 2 chamadas Codex por bloco, mais 1 só com defeito confirmado; Git e publicação pelo Claude quando o sandbox do Codex não o permitir.

---

## 8. Critérios de lançamento da V1.0
1. **Diversão observada:** pelo menos 2 sessões observadas em que a criança escolhe continuar sem pedido do adulto. Uso por iniciativa própria em pelo menos 3 dias de uma quinzena, anotado pelo adulto e confirmado no Save [C].
2. **Piloto:** decisão «avançar» registada e mecânica replicada onde aprovada.
3. **Conteúdo:** matriz AE com estado por competência nas 3 disciplinas; 0 ambiguidades conhecidas; amostras e lições dos tutores revistas por um adulto.
4. **Técnico:** testes verdes; LCP ≤ 2,5 s em Fast 3G (medido); peso das imagens justificado por medição no dispositivo; consola limpa; CSP ativa.
5. **Dados:** exportação completa testada; recuperação de corrupção testada; migração da raiz ensaiada; PWA só se passar os 4 testes.
6. **Acessibilidade:** teclado, contraste AA, movimento reduzido, tamanho de texto, sem informação só por cor.
7. **Revisão independente** registada e defeitos críticos corrigidos.
8. **Reversão:** v0.1 e V3 recuperáveis (tags e backups).

Ter todos os itens marcados **não** chega para declarar a V1.0.

---

## 9. Riscos e recuperação
| Risco | Mitigação |
|---|---|
| A V3 ou o piloto não interessam | F0 e F2 decidem antes de construir; abandonar é um resultado válido. |
| Perda de progresso | Exportação completa, lembrete, cópia contra corrupção, `persist()`, migração ensaiada. |
| Recompensas levam a evitar dificuldades | Observação em F0/F2; ajuste em F3. |
| PWA presa a versões antigas | Opcional, num preview, âmbito restrito ao caminho e aviso de atualização. |
| Origem partilhada | Aceite na V1.0. |
| Conteúdo errado apresentado como certo | Só `content/` validado; «a confirmar» fora das sessões; revisão humana; cronologia ≠ causalidade. |
| Excesso de estímulos | Efeitos só com função; movimento reduzido; observação. |
| Regressões | e2e, capturas de 5 ecrãs, tags por bloco, backups `preview/e-prov*`. |
| Âmbito a crescer | Lista «fora da V1.0»; mudar âmbito só com `seal --motivo`. |

---

## 10. Primeiro bloco recomendado: **F1 — Proteger o progresso**
**Porquê:** é pequeno, independente da criança e corrige uma falha confirmada: a exportação perde `skills` e a importação apaga-os. Protege a jogadora antes de novos testes. Estimativa: 1 bloco Codex + verificação; a dimensão real será confirmada na revisão do plano do bloco.
**Âmbito:** `src/core/save.ts`, `src/app/store.ts`, `src/app/extras/options.ts`, `src/app/collection-ui.ts`, `src/art/d/abu.ts`, as escritas de HTML classificadas como risco, testes em `tests/`.
**Fora do âmbito:** UI nova (exceto o lembrete), conteúdo, CSP, imagens, PWA, publicação.
**Em paralelo (produtor):** marcar a sessão F0 com a V3.

---

## 11. Decisões
**Tomadas (2026-11-09):** o roteiro v2 orienta a produção; F1 está autorizada; a publicação em `preview/e/` está autorizada se os critérios forem cumpridos.

**Pendentes (produtor):**
1. Âmbito pós-demo no `PRODUCT_CONTRACT.md` (V1.0 com Matemática, Português e HGP).
2. Sequência de dias, missões e coleções futuras: decididas em F3, com o feedback da criança.

---

## 12. Revisão crítica do Codex (2026-11-09, só leitura)
Pontos aceites e integrados, todos reconfirmados no código pelo Claude:
- contagem 33 + 20;
- `skills` fora da exportação;
- limites de `seen[]`;
- falha condicional com ids desconhecidos;
- namespace fixado no arranque;
- barra de progresso e som de 2 notas já existentes;
- suporte a sequências na fábrica (excluir Clérigos 1996; cronologia ≠ causalidade);
- recompensas só por testes com ≥80%;
- divergência com o contrato;
- piloto antes do polimento;
- critérios por competências, não por número de temas;
- PWA opcional;
- acessibilidade e revisão do conteúdo antes do piloto.

Ajustado: a demonstração A/B de sensação de jogo mantém-se, porque o produtor a pediu explicitamente, mas passa a correr na mesma sessão do piloto e não o bloqueia.
Rejeitado: nada de substancial.
Não verificado: o namespace `eda-e` publicado não foi relido no `gh-pages` nesta revisão.

---

## 13. Atualização 2026-11-09 (2) — requisitos do produtor após uso real

Origem: observação do produtor no uso real (mapa, disciplinas, minijogo, Inglês). Ainda não substitui a sessão F0 com a criança.

### Nova ordem (substitui a sequência F2→F3 para os próximos blocos)
| Bloco | Âmbito | Relação com o v2 | Estado |
|---|---|---|---|
| **A** | Remover as molduras amarelas do mapa, mantendo o foco por teclado | Correção pontual (pilar C) | **Feito e publicado** (`e24b8cc`, `preview/e`) |
| **B** | Português e Matemática com a estrutura da HGP: disciplina → capítulos → subcapítulos → Estudar/Teste/Rever, num único motor | Antecipa a parte estrutural de F4; conteúdo novo continua em F4 | Próximo |
| **C** | Investigação de até 50 jogos → shortlist de 10 → 3 finalistas → **1 piloto** isolado | Substitui e alarga o piloto F2 (a «exposição do museu» passa a ser candidata em C) | Por iniciar |
| **D** | Inglês: investigação comparativa + currículo + **1 vertical slice** | Nova disciplina (decisão de contrato abaixo) | Por iniciar |

As investigações de C e D podem correr em paralelo. As implementações são uma de cada vez. Nada de biblioteca de jogos nem de curso de Inglês antes de validar os pilotos com a criança.

### Critérios de aceitação
**B — Coerência curricular**
1. Uma estrutura comum (generalizar `content/historia/estrutura.ts`), não três motores.
2. Matemática e Português com capítulos e subcapítulos derivados das AE oficiais (`docs/curriculo/src/6_matematica.txt`, `6_portugues.txt`). Cada subcapítulo marcado com o seu estado: com exercícios / só lição / em preparação.
3. A seleção por subcapítulo não mistura matérias não selecionadas (teste automático).
4. O conteúdo e os geradores atuais são reaproveitados e mapeados. Nada é apagado.
5. Português com os 5 domínios (Leitura, Educação literária, Gramática, Escrita, Oralidade) visíveis. Escrita e Oralidade aparecem como «em preparação» ou com tarefas honestas, nunca como «avaliadas» por escolha múltipla.
6. Progresso, `skills` e Save preservados (teste de migração).
7. e2e nos 3 viewports e capturas inspecionadas.

**C — Jogos auxiliares**
1. Tabela de investigação com fonte verificável por jogo, distinguindo «experimentado» de «visto em documentação ou vídeo», e licença quando houver intenção de reutilizar.
2. Shortlist de 10, com os critérios do produtor pontuados.
3. 3 finalistas de géneros diferentes.
4. 1 piloto com objetivo claro, controlo tátil, curva de dificuldade, vitória ou derrota, áudio opcional, movimento reduzido e um recorde pessoal.
5. Piloto publicado isolado (ex.: `preview/jogos-1/`, armazenamento próprio). Fica numa secção «Jogos» fora do mapa escolar.
6. Sessão com a criança antes de um 2.º jogo.

**D — Inglês**
1. Comparação documentada (Duolingo e mais 3 plataformas), com estudos independentes citados e os limites identificados. Sem afirmar superioridade.
2. Matriz AE do 6.º ano de Inglês ↔ QECR (só onde se justifica), com 4 estados por competência.
3. Relatório de capacidades de áudio: TTS, reconhecimento de fala (Chrome, Safari, Android), offline e privacidade. **Microfone opcional; nenhum áudio da criança enviado para fora** sem decisão do produtor.
4. Vertical slice: 1 objetivo curricular, 1 mecânica (ex.: mistério com pistas ou conversa com consequências), compreensão e uso ativo do inglês, feedback pedagógico, dificuldade progressiva, medida antes/depois em tarefas **equivalentes, não repetidas**.
5. Publicado isolado e testado com a criança antes de expandir.

### Divisão Claude / Codex
| Trabalho | Quem | Nota |
|---|---|---|
| B: inventário do conteúdo + plano de estrutura | Codex (só leitura) → Claude decide | |
| B: implementação e testes | Codex | Claude verifica: diff, testes, capturas, Save |
| C e D: investigação web | Codex **se o sandbox tiver rede**; senão, agente de investigação do Claude | Já houve bloqueio de rede no Codex [R] |
| C e D: síntese, shortlist, escolha de finalistas | Codex propõe, Claude avalia criticamente | O produtor aprova os finalistas |
| C e D: pilotos | Codex implementa; Claude verifica e publica | Phaser só como chunk isolado do piloto, se justificar; nunca migrar a app |
| Auditoria independente | Revisor que não implementou | |

### Riscos novos
- **Fala:** o reconhecimento de fala do Chrome usa, por omissão, um serviço remoto [H, a confirmar em D]. Pode implicar envio de áudio de uma menor.
- **Âmbito:** 4 disciplinas ativas mais uma secção de jogos aumentam muito a manutenção. Os pilotos servem para cortar cedo o que não interessa.
- **Índices dos manuais:** não existem no repositório para Matemática e Português. Sem eles, a estrutura segue as AE e não a ordem do manual da escola.

### Decisões do produtor (novas)
1. **Inglês como disciplina ativa** → atualizar o `PRODUCT_CONTRACT.md` (passa a haver 4 disciplinas e uma secção de jogos).
2. **Índices dos manuais de Matemática e Português** (fotografias) para alinhar os capítulos com a escola. Sem eles, seguem-se as AE.
3. **Finalistas de C:** aprovação dos 3 antes do piloto.
