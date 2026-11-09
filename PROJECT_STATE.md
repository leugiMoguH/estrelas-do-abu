Projeto: Estrelas do Abu
Plano: v2
Atualizado: 2026-11-09
Âmbito: 391dd209
Objetivo: V1.0 jogável e fiável para o ano letivo (Matemática, Português, HGP, Inglês + secção Jogos), com diversão observada na criança antes de expandir — orientado por docs/ROADMAP.md (v2)
Próximo passo: B-Português — 5 domínios AE como capítulos no motor/árvore comum, Gramática com os 9 tipos existentes mapeados, restantes domínios «em preparação»; auditoria dos 9 tipos de exercício de Português.
Decisão necessária: escolher 1 de 3 finalistas de jogos (C) e aprovar o conceito do vertical slice de Inglês (D), quando a investigação terminar.

## Sucesso
- Critérios de lançamento da secção 8 de docs/ROADMAP.md cumpridos com evidência (diversão observada, conteúdo com matriz AE, dados protegidos, testes, acessibilidade, revisão independente); marcar itens não basta

## E0 — F0 · Observar a V3
### T0.1 · peso 2 · Por iniciar · Sessão observada com a criança
- [ ] Registo em docs/playtest/ com 4 colunas (observado/dito/interpretação/hipóteses) e escolha da hipótese de piloto | ev:

## E1 — F1 · Proteger o progresso
### T1.1 · peso 2 · Concluída · Exportação/importação completas e recuperação
- [x] Exportar→apagar→importar preserva Save, perfil e skills; ficheiros antigos aceites; inválidos sem perda; ids desconhecidos tolerados; testes falham sem a correção | ev: 6c84e87; tsc ok; 1089 unit; e2e 71 ok/3 ignorados + F1 18/18 (repeat 3×, 3 viewports); recovery.test falha sem a correção do aviso
- [x] Publicado em preview/e com backup, verificado no URL público em 3 viewports | ev: gh-pages af4ee13; backup preview/e-prov8 (V3); URL público: bundle main-CnallZf_, recuperação OK 3 viewports, 0 erros; raiz v0.1 intacta

## E2 — F2 · Piloto «aprender jogando» + demo A/B
### T2.1 · peso 3 · Por iniciar · Piloto e decisão avançar/ajustar/abandonar
- [ ] Piloto jogável, conteúdo revisto, sessão observada e decisão registada | ev:

## E3 — F3 · Generalizar o que provou
### T3.1 · peso 3 · Por iniciar · Sensação de jogo, tokens, motivação saudável
- [ ] Sem regressões; 2.ª sessão observada | ev:

## E4 — F4 · Conteúdo prioritário e técnica de lançamento
### T4.1 · peso 3 · Por iniciar · Matriz AE, conteúdo, migração da raiz ensaiada
- [ ] Matriz AE publicada; migração (e PWA, se incluída) ensaiadas em preview | ev:

## E5 — F5 · Lançamento V1.0
### T5.1 · peso 1 · Bloqueado · Publicação na raiz (com autorização)
- [ ] Critérios da secção 8 do roteiro cumpridos | ev:

## Decisões
- Arte própria em SVG em vez de pacotes de terceiros (coerência, tons de pele, sem licenças) — a confirmar após pesquisa de ativos.
- Sem Phaser na demo: mapa SVG interativo + DOM chegam.
- Nome de trabalho: Estrelas do Abu.
- Revisão Codex do plano (2026-10-30) aceite: sessão inicial de 3 perguntas, Surpreende-me, 1.ª sessão paga um acessório, exercícios serializáveis (dados + validadores puros), nível 'A descobrir' até haver evidência, banco esgotado nunca bloqueia, ordenar por toque. Âmbito: 3 temas/disciplina, 4 formatos (mcq, numérico/texto, ordenar, completar). Codex implementa por módulos; Claude coordena e verifica.

- Arte 100% SVG própria (pesquisa 2026-10-30: sem cidade/salas CC0 coerentes; nemo e Kenney UI não descarregados, não usados). Áudio: WebAudio sintetizado; música CC0 só se verificada.
- Temas demo — Matemática: racionais (frações/decimais), prioridades das operações, proporcionalidade direta. Português: classes de palavras, tempos/modos verbais, frase ativa/passiva. Ref. AE provisória (planificações com base nas AE 2018); PDFs DGE 03/2026 (6_matematica.pdf, 6_portugues.pdf) por confirmar quando dge.mec.pt voltar (estava 503).
- Nome 'Estrelas do Abu': sem conflito evidente na web; INPI/EUIPO por verificar antes de publicar.
- Produção de exercícios (pesquisa 2026-10-30): geradores TS próprios ao estilo Numbas (variáveis, restrições, seed) + banco JSON revisto com licença própria; ideias do Numbas, não o motor. Moodle XML só como exportador futuro (YAGNI). IA só em produção, com oráculo independente (gerador/CAS) e revisão humana PT-PT; nunca em runtime. Terceiros só CC0/CC BY ou autorização (Khan/OpenStax são NC-SA: evitar no núcleo). Itens IAVE/DGE: sem banco oficial reutilizável confirmado; só como modelo de estilo. Por verificar: termos de reutilização IAVE/DGE (sites inacessíveis).
- Núcleo v2 (geradores, histórico, simulação) implementado e verificado 2026-10-30; limites em docs/AUDIT_SUMMARY.md. Repo público só-código autorizado para auditoria; app NÃO publicada.
- Demo jogável implementada 2026-10-30: arte SVG própria (Claude), conteúdo/fluxo/extras (Codex), verificada em 390×844, 820×1180, 1280×800. Sem revisão docente do conteúdo; sem validação pela criança. Teste unitário 'limita FIFO' falhou 1 vez, sem reprodução (timeout subido para 30 s).
- Demo publicada 2026-10-30: https://leugimoguh.github.io/estrelas-do-abu/ (branch gh-pages; código na main). Expansão de conteúdo/funcionalidades suspensa até avaliação da criança.
- Redesign (2026-10-30): produtor considera a arte da v0.1 abaixo do objetivo; pedidas 2 direções (A vetorial «Doce Gomoso», B ilustrada «Mundo Ilustrado» com imagens geradas pelo Codex image_gen) em /preview/; demo pública não muda. Expansão de conteúdo continua suspensa.

- Fase 2 (2026-10-31): direção D aprovada pela criança. Personalização por camadas (corpo-molde + camadas raster geradas no lugar + rosto/acessórios SVG, cor por mapa de gradiente): 8 tons de pele, 8 penteados, 7 tops, 5 baixos, 4 calçados, casaco, 3 óculos, 4 chapéus, 4 acessórios, 2 mochilas; Abu com 8 poses, acessórios (pescoço/corpo/cabeça), piscar, saltos, travessuras opcionais; tutores Matemática (Professor Nuno) e Português (Marta, a lontra) com lições pré-escritas (needs-human-review), bloqueados no Teste; salas e mapa D. Revisão independente do Codex feita e defeitos confirmados corrigidos. Verificado: tsc, 70 unit, 27 e2e (3 viewports), build. Publicado só em preview/e/ (armazenamento eda-e). Demo raiz e previews A–D intactas; tag v0.1-demo-publicada e phase2-checkpoint-pre para recuperar. Ver docs/PHASE2_SPEC.md e docs/ASSETS_PROVENANCE.md.

## Pendências visuais registadas (NÃO corrigir antes da avaliação da criança; 2026-10-31)
- Algumas camisolas não encaixam corretamente nas calças.
- Os olhos aparecem por cima do cabelo em situações em que deviam ficar parcialmente ocultos.

- HGP (2026-10-31, em curso): 3.ª disciplina (edifício Museu das Descobertas): 132 itens verificados (4 formatos + mapas), 11 lições Tomé, revisões Codex aplicadas; falta layout sala, publicação e relatório. Arte HGP bloqueada pelo classificador (decisão do utilizador).

- 2026-10-31: HGP séc. XVIII com 73 itens, lição, factos verificados (ficha em docs/hgp). Commits aceeda4/a06efae + tag hgp-xviii-checkpoint-1. PUBLICADA (2026-10-31, autorização expressa do produtor) como versão provisória de estudo — revisão independente pendente: preview/e, 69 perguntas ativas do tema (4 excluídas: 55, 57, 66, 67). Anterior recuperável em preview/e-hgp3 (mesmo armazenamento eda-e).

- 2026-10-31: acesso ao capítulo corrigido: botão «Preparar próximo teste — Portugal no século XVIII» no topo do mapa e da sala HGP e ligação ?capitulo=seculo-xviii (perfil já criado). Causa: atalhos de disciplina escondidos no telemóvel e botão «Continuar» a abrir o último tema; a raiz do site (demo) não tem HGP. Backups: preview/e-prov1, e-prov2.

- 2026-10-31: HGP por capítulos/subcapítulos (content/historia/estrutura.ts): Recuperar aprendizagens (4 subcapítulos confirmados, sem exercícios), D1 (8 subcapítulos do índice + complemento AE), D2 e restantes só como tema completo (provisório). Seleção por subcapítulo, lição por subcapítulo, perguntas ligadas a 1 subcapítulo. BLOQUEIO: fotografias do índice do manual não existem em nenhuma sessão guardada — pedir de novo para completar a hierarquia. Publicado em preview/e (anterior: e-prov3).

- 2026-11-01: Fábrica V2 local concluída: 96 conhecimentos (89 elegíveis/7 pendentes), 279 exercícios gerados/255 elegíveis (221/23/11), 69 manuais mantidos. Identidade sem opções, rubrica, fontes contextuais e competências fora do Save. Autoverificação de 15 moldes; revisão docente/independente dos novos moldes pendente. Ver docs/hgp/fabrica/README.md e validacao-v2.md.


- 2026-11-01: Fábrica V2 PUBLICADA. Commit 1c76e32 (tag hgp-fabrica-v2, push feito); gh-pages 6ef3219: preview/e = V2 (bundle welcome-JF23XNf6.js), backup preview/e-prov6 (mesmo armazenamento eda-e). Verificado no URL público (3 viewports): https://leugimoguh.github.io/estrelas-do-abu/preview/e/. Demo raiz e outros protótipos intactos. Limitações: 7 conhecimentos pendentes (24 exercícios fora das sessões), capoeira/samba/Valongo por acrescentar, 248 URLs sem leitura automática (evidência = atestados/revisões contextuais do Codex), autoverificação de 15 moldes sem auditoria independente nem teste com a criança. Nova prioridade: infraestrutura transversal de fontes fiáveis (6.º ano, todas as disciplinas); ver .claude/tmp/handoff.md.

## Estacionadas
## Bloqueios
- (resolvido 2026-11-01) bloqueio de Git/rede do sandbox do Codex; publicação concluída pelo Claude com autorização expressa.

## Histórico do plano
- v1 (2026-10-30): plano inicial

- 2026-11-03: V3 PUBLICADA (autorização expressa do produtor). Blocos A (4a14578, v3-bloco-a), B (4863189, v3-bloco-b), C (cfc9d14, v3-bloco-c, v3-visual-recompensas); push feito. gh-pages 48adabd: preview/e = V3, backup preview/e-prov7 (V2), armazenamento eda-e. Verificado no URL público (3 viewports): carrega sem erros e fluxo teste→nota→sorteio→guardar→equipar passa 9/9. Checkpoint pré-V3: v3-checkpoint-pre-2026-11-02. Limitações: capturas visuais por amostra (não todo o produto cartesiano); sem teste com a criança; 3 coleções preparadas (2026-11, 2026-12, 2027-01), depois «indisponível»; anti-exploração não protege contra alterar relógio/storage; gamePack.test.ts instável (timeout subido 15→60 s).

- 2026-11-03 (fecho V3): confirmado no código: A) cabelo traseiro/frontal separados, olhos antes da franja, cintura/mangas/calçado com ancoragem, resolvedor de compatibilidade sem apagar artigos; B) 103 artigos (52 novos), 7 variantes de rosto, roupa de Abu em 9 poses, abuPrize com movimento reduzido; C) coleções 2026-11/2026-12/2027-01, grelha 4x4, escalões 4/3/1/0, mínimo 10 perguntas distintas, idempotência por tentativa, Save v3 compatível com v1/v2. Validações já executadas na sessão V3 (não repetidas no fecho): tsc, 1073 unit, build, e2e 69 ok/3 ignorados (exigem build hgp-e2e), URL público 3 viewports e fluxo completo 9/9. Tag checkpoint-v3-fechada-2026-11-03 (código publicado cfc9d14). Pendências: feedback da criança; combinações visuais por testar; miniaturas Abu; coleções futuras só com decisão; relógio/storage manipuláveis (aceite).

- 2026-11-09 (análise, só documental): roteiro v1 (commit 9c48c53) revisto criticamente com contraditório do Codex → docs/ROADMAP.md v2, adotado pelo produtor como guia de produção (cada fase com critérios próprios; funcionalidades não aprovadas em bloco). Factos verificados: raiz gh-pages = demo v0.1, V3 em preview/e; branch redesign/art-v1 à frente da main; arranque medido (Fast 3G, 390×844, sem perfil) 583 KB transferidos, LCP 2,9 s, 0 erros; PNG de 2,2–2,3 MB só carregam na sala HGP/tutor Tomé; alcunha escapada e Save importado validado (sem caminho de injeção encontrado nos innerHTML); sem SW/manifest/storage.persist; modos no código = Estudar/Teste/Rever. Plano v1 (demo): E1–E4 entregues e publicadas (V3 em preview/e); T2.2 (revisão docente) e T4.2 transitam para F4/F5. Nenhum código funcional nem versão pública alterados.
- v2 (2026-11-09): roteiro v2 (docs/ROADMAP.md) adotado como guia até à V1.0; demo v1 entregue
- 2026-11-09: F1 PUBLICADO (autorização expressa). Código 6c84e87 (tags f1-checkpoint-pre-2026-11-09 → 9efb963, f1-progresso-2026-11-09), push feito; gh-pages af4ee13 (preview/e = F1, backup preview/e-prov8). Codex implementou; Claude verificou, corrigiu aviso de recuperação persistente (trivial) e corrida no teste e2e. Limitações: sem teste em dispositivos físicos; apagamento do Safari não é coberto pela cópia interna (só pelo ficheiro exportado).
- 2026-11-09: Bloco A PUBLICADO — molduras amarelas permanentes do mapa D removidas (eram decoração map-ring #ffcf65, não foco); hover só com rato; foco por teclado tracejado branco sem outline duplicado. Código e24b8cc (tags blocoA-checkpoint-pre-2026-11-09, blocoA-mapa-2026-11-09); gh-pages fc7d5b2 (backup preview/e-prov9). Verificado: 1090 unit; e2e foco/demo/hgp/abu 36 ok/3 ignorados; URL público 3 viewports, teclado Enter abre sala, 0 erros; raiz intacta. Roteiro §13: novos blocos B (coerência curricular), C (jogos), D (Inglês). Implementado pelo Claude (correção trivial de 3 linhas; sem Codex).

- 2026-11-09 (blocos B–D autorizados): produtor aprovou Inglês como 4.ª disciplina e a secção «Jogos» na V1.0; PRODUCT_CONTRACT.md com 4 estados (planeada / em desenvolvimento / funcional / conteúdo validado). Índices dos manuais de Mat/Port procurados no projeto, versões anteriores e backups: não existem → estrutura segue as AE. B: inventário do Codex em curso; C/D: investigação web por agente do Claude (Codex sem rede garantida), resultados em docs/pesquisa/.
- 2026-11-09 (Bloco B-Matemática): inventário do Codex revelou 10 temas/61 geradores/10 lições de Matemática desligados. Codex implementou árvore comum (content/estrutura.ts, src/app/subject-tree.ts; HGP sem mudança) e Matemática com 4 capítulos/27 subcapítulos pela ordem das AE (19 com exercícios, 8 em preparação), mapa templateId→subcapítulo. Claude: textos visíveis (caminho de ficheiro, «geradores»), ordem dos temas (sala abre em Frações), 2 e2e adaptados. Testes: tsc OK; 1097 unitários; e2e de todas as suítes verdes (3 HGP ignorados no build normal, aprovados no build hgp-e2e pelo Codex); capturas 3 viewports sem erros. Código 83003f0 (tags blocoB-checkpoint-pre-2026-11-09 → 706decc, blocoB-matematica-2026-11-09); gh-pages 8e01262 (backup e-prov10 = bloco A). Deploy do Pages expirou do lado do GitHub; reativado (ed4fd6b) e CONFIRMADO no URL público: bundle main-BxTHMpjo, 3 viewports sem erros, 4 capítulos/27 subcapítulos, recuperação do progresso OK, raiz v0.1 intacta, backup e-prov10 acessível. Conteúdo validado por solvers automáticos, não por professor.
- 2026-11-09 (Bloco B2 — Matemática fechada): defeitos A (estudar erros por subcapítulo, refs pendentes), B (regra HGP de dificuldade única, seleção incremental, Teste congelado), C (progresso por subcapítulo em src/core/progress.ts, compatível com a versão anterior — provado com validadores de f910745) — commit b5dfb99; Claude corrigiu descida em cascata e preferência de nível no ranking. Auditoria dos 70 exercícios (8400 instâncias, oráculos independentes; docs/audit/matematica-exercicios.md): sem respostas erradas; corrigidos equivalência decimal em cloze, 2 explicações, frações negativas, concordância — commit 210bf37 (tags blocoB2-checkpoint-pre-2026-11-09, blocoB2-matematica-validada-2026-11-09). Testes: 1133 unitários, e2e 78 + 3 ignorados (build hgp-e2e). gh-pages 5ef0a3c (backup e-prov11), confirmado no URL público (3 viewports, recuperação OK, raiz intacta). Por rever por humano: âmbito AE de probabilidades/sequências, diversidade e dificuldade real dos níveis.
