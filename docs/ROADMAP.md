# Roteiro global — Estrelas do Abu (2026-11-09)

Proposta para levar o jogo da V3 (publicada em `preview/e/`) até à **versão 1.0**: o jogo que a criança usa durante o resto do 6.º ano. Não é um redesenho. A direção artística D e as personagens ficam como estão.
Respeita `PRODUCT_CONTRACT.md`: sem contas, sem pagamentos, sem IA em tempo real, sem servidor, dados só no dispositivo, PT-PT.
Estado oficial: `PROJECT_STATE.md`. Este roteiro só passa a ser o plano oficial depois de aprovado (ver «Decisão» no fim).

---

## 1. Ponto de situação (verificado no código a 2026-11-09)

### O que já existe e funciona
| Área | Estado |
|---|---|
| Núcleo educativo | 4 formatos de exercício, nota 0–20, dificuldade por competência, revisão espaçada, caderno de erros. 1073 testes unitários e 69 e2e (V3). |
| Matemática | 13 temas com geradores (racionais, prioridades, proporcionalidade, potências, primos, ângulos, círculo, volumes, rotações, sequências, dados, probabilidades, frações). |
| Português | 3 temas, **só gramática** (classes de palavras, tempos/modos, voz ativa/passiva). Falta leitura, compreensão, educação literária e escrita. |
| HGP | A disciplina mais completa: capítulos/subcapítulos, séc. XVIII, recuperação do 5.º ano, fábrica V2 (96 conhecimentos, 255 exercícios elegíveis). 7 conhecimentos ainda pendentes. |
| Personagem e Abu | 103 artigos, camadas com oclusão, Abu com 9 poses e roupa. Aprovado pela criança (direção D). |
| Recompensas | Estrelas, loja, coleção mensal 4×4 (só até 2027-01), Save v3 com exportar/importar validado. |
| Opções | Música, efeitos, volume, reduzir animações, tamanho de texto. |
| Publicação | V3 em `preview/e/`. **A raiz do site ainda mostra a demo v0.1 antiga.** |

### O que falta ou está fraco
1. **Feedback real da criança sobre a V3**: ainda não foi recolhido. É o bloqueio declarado do projeto.
2. **Conteúdo**: Português está muito curto. 4 edifícios estão «Em preparação» (Inglês, Ciências, EV/ET, Música). Nenhum conteúdo teve revisão docente (T2.2 está «Por iniciar»).
3. **Performance**: há 2 PNG de 2,2–2,3 MB no build (`d6/room-his.png`, `d5/tutor-tome-neutral.png`). O chunk inicial `welcome-*.js` tem 677 KB porque leva os bancos de conteúdo todos. A imagem do campus tem 457 KB.
4. **Offline e persistência**: não há manifest nem service worker. No iPad, o Safari pode **apagar o `localStorage` ao fim de 7 dias sem visitas** (regra ITP do WebKit). Isso pode fazer a criança perder o progresso. Instalar a app no ecrã inicial evita esse apagamento.
5. **Segurança**: não há Content-Security-Policy. Há 53 usos de `innerHTML`; existe uma função `escape()`, mas ninguém confirmou que todos os usos passam por ela.
6. **Sensação de jogo**: o som é feito de tons sinusoidais sintetizados, a mudança de ecrã é seca e o resultado do teste tem pouca cerimónia. É aqui que o jogo parece «amador».
7. **Dívida técnica**: há temas de arte antigos ainda no código (`src/art/v2`, `v3`, `assets/b`, `d`–`d6`, `art-preview.html`). A branch `redesign/art-v1` está 40 commits à frente da `main`. Há 2 testes instáveis (`gamePack`, «limita FIFO»). O ficheiro `bash.exe.stackdump` está no Git. No `PROJECT_STATE.md`, T3.1 e T3.2 aparecem como «Por iniciar», mas já estão feitas.

---

## 2. Plano até ao fim do projeto

**Fim do projeto = v1.0.** Critérios:
- Publicada na raiz do site e instalável (PWA) no iPad, no Android e no Windows.
- 3 disciplinas completas para o ano letivo: Matemática, Português e HGP.
- Sensação de jogo cuidada, com áudio próprio.
- Área do encarregado de educação.
- Validada pela criança em pelo menos 2 sessões observadas.

**Data-alvo:** fim de fevereiro de 2027. Fica tempo útil até ao fim do ano letivo (junho de 2027).

Cada fase só fecha com os seus critérios verificados. As estimativas são de trabalho efetivo (Claude planeia e verifica, Codex implementa).

### F0 — Ouvir a criança e arrumar a casa · 1 semana · BLOQUEIA F3–F5
| # | Tarefa | Critério de fecho |
|---|---|---|
| 0.1 | Sessão observada com a V3 (20 min, sem ajuda), com o guião: o que escolhe primeiro, onde para, o que diz, o que pede. | Notas guardadas em `docs/playtest/2026-11-xx.md`, com as 5 coisas de que mais gostou e as 5 que mais a irritaram. |
| 0.2 | Ordenar este roteiro com base no feedback (cortar o que ela não valoriza). | Roteiro revisto; `PROJECT_STATE.md` fechado com `seal --motivo` → plano v2. |
| 0.3 | Corrigir o estado: T3.1 e T3.2 passam a concluídas e as tarefas antigas caducadas são arquivadas. | `state.py check` limpo. |
| 0.4 | Juntar `redesign/art-v1` à `main` (merge, com autorização). | `main` = código publicado; tags intactas. |
| 0.5 | Limpeza: tirar `bash.exe.stackdump` do Git e pôr no `.gitignore`. | `git ls-files` limpo. |

### F1 — Base técnica: performance, segurança, offline · 1,5–2 semanas · pode começar já
Não acrescenta conteúdo, por isso não colide com a regra «não expandir antes do feedback».
| # | Tarefa | Critério de fecho |
|---|---|---|
| 1.1 | Converter os PNG pesados para WebP/AVIF e otimizar o campus (2 tamanhos). | Nenhuma imagem acima de 300 KB no `dist`; diferença visual impercetível nas capturas. |
| 1.2 | Dividir o código: cada banco de conteúdo carrega com `import()` só quando se abre a sala. | Chunk inicial < 200 KB (gzip < 70 KB); e2e verdes. |
| 1.3 | PWA: `manifest.webmanifest`, ícones, service worker com pré-cache do build, aviso «Nova versão disponível». | Instala no Android e no iPad; joga em modo avião; Lighthouse PWA a passar. |
| 1.4 | Persistência protegida: `navigator.storage.persist()`, 3 cópias rotativas do Save e lembrete semanal para exportar. | Teste: apagar a chave principal recupera a última cópia. |
| 1.5 | Segurança: CSP em `<meta>`, auditoria dos 53 `innerHTML` (ou helper com escape obrigatório) e testes com alcunha e importação maliciosas. | Teste e2e com `<img onerror>` na alcunha e num Save importado: nada executa. |
| 1.6 | Orçamento de performance e regressão visual no conjunto de testes (capturas de base em 3 viewports). | O teste falha se o bundle ou as capturas mudarem sem intenção. |
| 1.7 | Estabilizar os 2 testes instáveis (causa real, não só subir o tempo limite). | 10 execuções seguidas verdes. |

### F2 — Polimento e sensação de jogo · 2–3 semanas · depois de F1
| # | Tarefa | Critério de fecho |
|---|---|---|
| 2.1 | Design system consolidado: tokens únicos (cor, raio, sombra, tipografia, espaçamento) e remoção dos temas legados. | CSS só com tokens; `src/art/v2`, `v3` e os assets mortos apagados; build menor. |
| 2.2 | Transições entre ecrãs (View Transitions API, nativa) e estados de botão completos (pressionado, desativado, a carregar). | Todas as mudanças de ecrã animadas; desligadas com «reduzir animações». |
| 2.3 | Feedback de resposta: animação de acerto/erro, contagem de estrelas animada, partículas e vibração em Android. | Resposta em menos de 100 ms em todos os formatos. |
| 2.4 | Ecrã de resultado com cerimónia: nota a subir, Abu a reagir conforme a nota, sorteio da coleção com revelação. | Revisto em 3 viewports; respeita movimento reduzido. |
| 2.5 | Áudio v2: música própria por zona (CC0 verificada ou composta), efeitos sonoros em camadas e mistura (música baixa quando o tutor fala). | Proveniência em `ASSETS_PROVENANCE.md`; volume consistente. |
| 2.6 | Primeiros 60 segundos: onboarding com uma cena curta do Abu e a primeira vitória garantida. | Uma criança nova chega ao 1.º acerto em menos de 90 s (sessão observada). |

### F3 — Ciclo de motivação · 2 semanas · depois do feedback de F0
| # | Tarefa | Critério de fecho |
|---|---|---|
| 3.1 | Objetivo diário e sequência de dias, sem castigo (1 «dia de folga» por semana). | Testes unitários de datas (meia-noite, fuso, relógio a recuar). |
| 3.2 | Missões semanais ligadas às competências fracas. | As missões vêm do histórico, não são aleatórias. |
| 3.3 | Modo «Preparar teste» com data: o encarregado introduz a data e o jogo planeia a revisão até lá. | Contagem decrescente e sessões sugeridas por dia. |
| 3.4 | Coleções mensais de 2027-02 a 2027-06 (com artigos aprovados pela criança). | Sem «indisponível» até ao fim do ano letivo. |

### F4 — Conteúdo do ano letivo · contínuo, de dezembro a fevereiro · depois de F0
Regra: conteúdo só em `content/`, validado, com oráculo independente e revisão humana em PT-PT.
| # | Tarefa | Critério de fecho |
|---|---|---|
| 4.1 | Português: leitura e compreensão (textos curtos próprios), educação literária, ortografia/acentuação e mais gramática (funções sintáticas, coordenação/subordinação). | Pelo menos 8 temas, todos ligados às AE; amostra revista por um adulto. |
| 4.2 | Matemática: revisão docente dos 13 temas e afinação da dificuldade com base nos dados da criança. | Registo da revisão; correções aplicadas. |
| 4.3 | HGP: fechar os 7 conhecimentos pendentes, capoeira/samba/Valongo e completar a hierarquia (precisa de novas fotografias do índice do manual). | 0 conhecimentos pendentes; capítulos alinhados com o manual. |
| 4.4 | Alinhar com o calendário escolar: temas da semana escolhidos pelo encarregado. | O mapa destaca o tema da semana. |

### F5 — Expansão opcional · 2 semanas por disciplina · só com decisão
Ciências Naturais e depois Inglês (os edifícios já existem). Fica fora da v1.0 se o tempo apertar.

### F6 — Área do encarregado de educação · 1 semana · em paralelo com F4
Entrada protegida (soma simples ou gesto, sem conta), relatório por competência, tempo de estudo, erros frequentes, imprimir ou guardar em PDF e definir o tema da semana e a data do teste.

### F7 — Lançamento da v1.0 · 1 semana
1. Revisão independente do Codex (código e conteúdo).
2. Auditoria de acessibilidade (teclado, contraste, leitor de ecrã) em 3 viewports.
3. 2.ª sessão observada com a criança; bugs críticos corrigidos.
4. Publicar na raiz (com autorização), com a v0.1 arquivada em `/arquivo/`; tag `v1.0`.
5. A seguir, modo de manutenção: uma coleção mensal e conteúdo conforme os testes da escola.

### Calendário resumido
| Semana | Fases |
|---|---|
| 9–15 nov | F0 + início de F1 |
| 16 nov–6 dez | F1 → F2 |
| 7 dez–3 jan | F2 (fim) + F3 + início de F4 |
| jan 2027 | F4 + F6 |
| fev 2027 | F4 (fim) + F7 → **v1.0** |

---

## 3. Dez melhorias (design, UX/UI, segurança, performance)
| # | Área | Melhoria | Porquê | Fase |
|---|---|---|---|---|
| 1 | Performance | Converter `room-his.png` (2,3 MB) e `tutor-tome-neutral.png` (2,2 MB) para WebP/AVIF | Cerca de 4,5 MB a menos na sala de HGP, o que pesa em 4G e em iPads antigos | F1 |
| 2 | Performance | Carregar os bancos de conteúdo por disciplina com `import()` | Arranque com menos de um terço do JS atual (677 KB) | F1 |
| 3 | Performance | `srcset` e `decoding="async"` nas cenas; pré-carregar só o ecrã seguinte | O campus (457 KB) deixa de travar o 1.º ecrã no telemóvel | F1 |
| 4 | Robustez | PWA com service worker e instalação | Offline a sério e proteção contra o apagamento de 7 dias do Safari | F1 |
| 5 | Segurança | CSP em `<meta>` (`default-src 'self'`) | Bloqueia scripts injetados, mesmo que escape algum `innerHTML` | F1 |
| 6 | Segurança | Helper de template com escape obrigatório em vez de `innerHTML` solto, mais testes de injeção | Alcunha e Save importado são as entradas não confiáveis do jogo | F1 |
| 7 | Dados | 3 cópias rotativas do Save, `storage.persist()` e lembrete de exportação | Perder o progresso é o pior bug possível para uma criança | F1 |
| 8 | Design | Tokens CSS únicos e remoção dos temas legados | Consistência visual e manutenção mais barata | F2 |
| 9 | UX | Transições de ecrã nativas e estados de botão completos | O jogo deixa de «saltar» entre páginas | F2 |
| 10 | UX/UI | Feedback imediato em cada resposta (animação, som, vibração) | Recompensa sentida, não só lida | F2 |

## 4. Dez recomendações para nível de estúdio
1. **Sensação de jogo em tudo.** Cada toque tem resposta visual, sonora e tátil em menos de 100 ms. Os jogos de estúdio distinguem-se mais pela resposta ao toque do que pela arte.
2. **Áudio profissional.** Hoje são tons sinusoidais. Música por zona, efeitos em camadas e mistura cuidada são, por si só, o maior salto de qualidade percebida.
3. **Meta-objetivo visível.** As estrelas ganhas acendem uma constelação no céu do campus (o «Estrelas do Abu» do nome) e cada mês completa uma constelação. É narrativa leve, dentro do contrato.
4. **Campus vivo.** Dia/noite segundo a hora real, estações do ano, tutores à janela dos edifícios, Abu a reagir ao progresso e à hora (dorme à noite).
5. **Primeiro minuto impecável.** Cena de abertura curta, a criança dá nome ao seu canto e tem uma vitória garantida. A primeira impressão define a retenção.
6. **Sessões com arco.** Aquecimento, desafio e «pergunta final» com tensão, depois a recompensa. Sessões de 5 a 8 minutos que acabam em alta, não a meio.
7. **Vozes.** Os tutores e o Abu com falas gravadas (curtas, reutilizáveis). Se forem gravadas pela família, ficam únicas e ajudam também na acessibilidade.
8. **UI ao nível de consola.** Tipografia de título própria, ícones de um só conjunto, ecrãs vazios ilustrados, zero texto técnico e todos os estados de cada componente desenhados.
9. **Decidir com dados de playtest.** Métricas só no dispositivo (tempo até ao 1.º acerto, onde abandona, temas evitados), exportáveis pelo encarregado. Nada sai do aparelho.
10. **Pipeline de qualidade de estúdio.** Regressão visual automática, orçamento de performance, checklist de lançamento e sessões de playtest marcadas antes de cada versão.

## 5. Quinze funcionalidades
Ordem = valor provável para a criança e para a aprendizagem.
| # | Funcionalidade | Valor | Fase |
|---|---|---|---|
| 1 | Objetivo diário e sequência de dias sem castigo | Hábito de estudo | F3 |
| 2 | «Preparar teste» com data real e plano até ao dia | Ligação direta à escola | F3 |
| 3 | Área do encarregado de educação (relatório, tema da semana, data do teste) | O adulto orienta sem estar ao lado | F6 |
| 4 | Missões semanais geradas pelas competências fracas | Treina o que mais precisa | F3 |
| 5 | Caderno de erros com revisão guiada («tenta outra vez daqui a 2 dias») | Usa o histórico que já existe | F3 |
| 6 | «Explica de outra forma»: 2.ª explicação (exemplo ou desenho) depois de um erro | Desbloqueia sem frustração | F4 |
| 7 | Constelação do campus (meta-objetivo das estrelas) | Progresso visível a longo prazo | F2 |
| 8 | Leitura em voz alta das perguntas (opção) | Acessibilidade e cansaço de leitura | F2 |
| 9 | Caderneta de cromos: figuras e lugares da HGP desbloqueados pelos 96 conhecimentos | Colecionar reforça a memória | F4 |
| 10 | Desafio relâmpago de 60 s (revisão cronometrada e opcional) | Variedade e emoção | F3 |
| 11 | Quarto do Abu decorável (só personalização, comprado com estrelas) | Novo destino para as estrelas | F3 |
| 12 | Postal: foto da personagem com o Abu, guardada em PNG | Orgulho e partilha em família | F2 |
| 13 | Retomar uma sessão interrompida | Tablets fecham-se a meio | F1 |
| 14 | Tema escuro e modo de leitura confortável (fonte e espaçamento) | Conforto e acessibilidade | F2 |
| 15 | Conquistas de aprendizagem (domínio de competência), com ecrã de troféus | Celebra o saber, não só as estrelas | F3 |

---

## Decisão
1. Aprovar este roteiro como plano v2 (feito com `seal --motivo` no `PROJECT_STATE.md`).
2. Autorizar o início de F1 antes do feedback da criança. F1 não acrescenta conteúdo, por isso não viola a regra «não expandir antes da avaliação».
