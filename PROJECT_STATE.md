Projeto: Estrelas do Abu
Plano: v1
Atualizado: 2026-11-01
Âmbito: 30a8cd81
Objetivo: Demo vertical jogável (Matemática + Português, 6.º ano) publicada e pronta para teste real com a criança
Próximo passo: concluir Git/publicação da Fábrica V2 quando houver ligação a github.com:443 e escrita em .git; manter backup e-prov6 e verificar URL público em três viewports. Ver docs/hgp/fabrica/validacao-v2.md.
Decisão necessária:

## Sucesso
- Demo jogável publicada, testada em 3 viewports, sem erros de consola, com revisão Codex registada; expansão parada à espera da criança

## E1 — Base
### T1.1 · peso 1 · Concluída · Contrato, repo e scaffold
- [x] Repo Git próprio e documentos de contrato/instruções criados | ev: git init + PRODUCT_CONTRACT.md
- [x] Vite+TS+Vitest+Playwright a correr com build verde | ev: npm run build; npm test (51); npx playwright test (9 em 3 viewports) — 2026-10-30

## E2 — Núcleo educativo
### T2.1 · peso 3 · Concluída · Motor de exercícios, correção, nota, adaptação e revisão espaçada
- [x] Tipos de exercício (escolha múltipla, numérico/escrito, ordenar/associar, completar) com correção testada | ev: npm test: 1044 passados (2026-11-01); tests/core; docs/hgp/fabrica/validacao-v2.md
- [x] Nota 0–20, repetição evitada, dificuldade por competência, revisão espaçada testados | ev: tests/core/skills-v2.test.ts; identity-v2.test.ts; e2e 48 passados/3 ignorados + V2 3 passados nos três viewports (2026-11-01)

### T2.2 · peso 3 · Por iniciar · Conteúdo 6.º ano Matemática e Português verificado
- [ ] Temas ligados às Aprendizagens Essenciais DGE, respostas verificadas | ev:

## E3 — Jogo e arte
### T3.1 · peso 3 · Por iniciar · Arte SVG: personagem modular, Abu animado, mapa, salas
- [ ] Estilo coerente, tons de pele diversos, Abu com animações | ev:

### T3.2 · peso 3 · Por iniciar · Fluxo completo: boas-vindas, perfil, mapa, salas, resultados, loja, opções
- [ ] Percurso de 14 passos do contrato executável sem becos | ev:

## E4 — Validação
### T4.1 · peso 2 · Concluída · Testes e revisão visual em 3 viewports
- [x] Build, unitários, e2e verdes; capturas inspecionadas; consola limpa | ev: docs/hgp/fabrica/validacao-v2.md: build/tsc; 1044 unitários; 48 e2e + 3 V2; 3 ignorados exigem modo hgp-e2e; capturas V2 inspecionadas e pageerror vazio

### T4.2 · peso 1 · Por iniciar · Revisão independente do Codex pós-demo
- [ ] Revisão feita ou registada como pendente com motivo | ev:

## E5 — Entrega
### T5.1 · peso 1 · Bloqueado · Publicação isolada e relatório final
- [ ] URL pública (com autorização) e relatório; expansão parada | ev:

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
