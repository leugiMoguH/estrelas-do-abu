Projeto: Estrelas do Abu
Plano: v1
Atualizado: 2026-10-30
Âmbito: 30a8cd81
Objetivo: Demo vertical jogável (Matemática + Português, 6.º ano) publicada e pronta para teste real com a criança
Próximo passo: Redesign artístico (branch redesign/art-v1): terminar propostas A/B em /preview/ e apresentar; ver .claude/tmp/handoff.md
Decisão necessária:

## Sucesso
- Demo jogável publicada, testada em 3 viewports, sem erros de consola, com revisão Codex registada; expansão parada à espera da criança

## E1 — Base
### T1.1 · peso 1 · Concluída · Contrato, repo e scaffold
- [x] Repo Git próprio e documentos de contrato/instruções criados | ev: git init + PRODUCT_CONTRACT.md
- [x] Vite+TS+Vitest+Playwright a correr com build verde | ev: npm run build; npm test (51); npx playwright test (9 em 3 viewports) — 2026-10-30

## E2 — Núcleo educativo
### T2.1 · peso 3 · Por iniciar · Motor de exercícios, correção, nota, adaptação e revisão espaçada
- [ ] Tipos de exercício (escolha múltipla, numérico/escrito, ordenar/associar, completar) com correção testada | ev:
- [ ] Nota 0–20, repetição evitada, dificuldade por competência, revisão espaçada testados | ev:

### T2.2 · peso 3 · Por iniciar · Conteúdo 6.º ano Matemática e Português verificado
- [ ] Temas ligados às Aprendizagens Essenciais DGE, respostas verificadas | ev:

## E3 — Jogo e arte
### T3.1 · peso 3 · Por iniciar · Arte SVG: personagem modular, Abu animado, mapa, salas
- [ ] Estilo coerente, tons de pele diversos, Abu com animações | ev:

### T3.2 · peso 3 · Por iniciar · Fluxo completo: boas-vindas, perfil, mapa, salas, resultados, loja, opções
- [ ] Percurso de 14 passos do contrato executável sem becos | ev:

## E4 — Validação
### T4.1 · peso 2 · Por iniciar · Testes e revisão visual em 3 viewports
- [ ] Build, unitários, e2e verdes; capturas inspecionadas; consola limpa | ev:

### T4.2 · peso 1 · Por iniciar · Revisão independente do Codex pós-demo
- [ ] Revisão feita ou registada como pendente com motivo | ev:

## E5 — Entrega
### T5.1 · peso 1 · Por iniciar · Publicação isolada e relatório final
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

## Estacionadas
## Bloqueios
## Histórico do plano
- v1 (2026-10-30): plano inicial
