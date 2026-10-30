# PRODUCT_CONTRACT — Estrelas do Abu (nome de trabalho)

Jogo educativo 2D no browser (Android, iPad, Windows) para uma criança de 11–12 anos, 6.º ano, Portugal. Projeto novo, independente de BRUMA e de outros projetos.

## Decisões fixas
- Centro escolar ilustrado: cada edifício = uma disciplina. Clique/toque abre a disciplina (sem movimento manual).
- Percurso: Boas-vindas → Perfil → Centro → Disciplina → Matéria → Estudar/Teste/Rever → Resultado → Recompensas → Personalização.
- Três modos (Estudar, Teste, Rever) sobre UM núcleo educativo.
- Abu: cão pinscher, companheiro permanente, não é item de loja, sem mecânicas de manutenção.
- Moeda virtual (estrelas) só ganha-se a jogar; loja só personalização; sem pagamentos, anúncios, contas, rankings públicos.
- Progresso de aprendizagem (níveis por competência) ≠ recompensas (estrelas). Níveis não se compram.
- Conteúdo: banco local revisto + geradores parametrizados. Sem IA em tempo real, sem APIs pagas, sem servidor.
- Dados só em localStorage versionado, com exportar/importar. Sem recolha externa.
- Currículo: Aprendizagens Essenciais DGE, 6.º ano. Demo: Matemática + Português. Restantes edifícios «Em preparação».
- Texto em PT-PT. Nota de teste 0–20.

## Demo (5–10 min) — critérios de aceitação
1. Boas-vindas → criar personagem (pele diversa, cabelo, olhos, roupa, calçado, acessório, «Surpreende-me») → conhecer Abu → mapa.
2. Mapa com 7 edifícios; 2 ativos, 5 «Em preparação». Praça: Loja, Conquistas, Minijogo.
3. Sala: escolher tema, modo, nº de exercícios. ≥3 tipos de interação reais (escolha múltipla, resposta numérica/escrita, ordenar/associar/completar).
4. Estudar com pistas graduais e explicação de erros; Teste com nota 0–20 e correção; Rever com repetição espaçada por competência.
5. Estrelas (com limite anti-repetição), loja, compra visível na personagem, persistência após recarregar.
6. Opções: música, efeitos, volume, reduzir animações, tamanho de texto — todas funcionais.
7. Testes: build, unitários, Playwright (390×844, 820×1180, 1280×800), sem erros de consola, sem scroll horizontal, capturas inspecionadas.
8. Publicação isolada (GitHub Pages) só com autorização; depois PARAR e aguardar avaliação da criança.

## Exclusões (1.ª fase)
Mundo aberto, narrativa extensa, multiplayer, contas, pagamentos, publicidade, dezenas de minijogos, IA online, servidor, conteúdo 5.º–12.º completo, sincronização entre dispositivos.

## Honestidade
Distinguir sempre implementado / verificado / planeado. Nunca declarar revisão independente do Codex que não aconteceu. Nunca declarar validação pela criança antes do teste real.
