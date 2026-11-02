# V3 — Personagens, personalização, coleção mensal (spec para Codex)

Contexto: direção D aprovada; app em src/ (Vite+TS, DOM/SVG). Arte D: src/art/d/*, src/art/{avatar,clothes,hair,face,catalog}.ts; loja/inventário/save: src/app/store.ts, src/core/save.ts, src/core/rewards.ts; resultado: src/app/result.ts; quarto/loja: src/app/room.ts. Publicação só em preview/e/ (armazenamento eda-e). Não mexer em conteúdo educativo, demo raiz, previews A–D. Preservar Save existente (migração aditiva, sem perder estrelas/inventário/equipado). Sem deps pesadas, sem rede em runtime, PT-PT, sem dinheiro real. Corrigir causas estruturais, não só exemplos.

## Bloco A — qualidade da personagem
Defeitos: camisola não encaixa nas calças; olhos por cima do cabelo (franja deve ocluir); sobreposições, golas, mangas/mãos, acessórios desalinhados; proporções cabeça/pescoço/ombros/tronco/braços/pernas/calçado.
Entregar: ordem de camadas explícita (corpo, rosto, olhos, boca, cabelo traseiro, cabelo frontal/franja, top, baixo, calçado, acessórios traseiros/dianteiros), pontos de ancoragem (cintura, pescoço, pulsos, tornozelos, cabeça), máscaras/clipPath para oclusão; regras de compatibilidade (ex.: top+baixo cintura, casaco sobre top, chapéu vs. cabelo) com incompatibilidade resolvida ou restrição visível na UI. Nenhuma combinação defeituosa selecionável.
Aceitação: teste automático que percorre combinações (pele×cabelo×olhos×top×baixo×casaco×calçado×acessórios, amostra determinística + todos os pares) sem violar invariantes de ancoragem/ordem; folha de capturas (contact sheet) em 390×844, 820×1180, 1280×800 inspecionada.

## Bloco B — catálogo e Abu
Aumentar com qualidade (não por número): olhos (formas/cores), sobrancelhas, bocas/expressões, variações fisionomia; cabelos curtos/médios/compridos, franjas, apanhados, texturas, acessórios de cabelo; camisolas, camisas, casacos, gabardinas, hoodies, saias, calças, calções, vestidos/conjuntos, calçado; óculos, brincos, chapéus, mochilas, pulseiras, colares, laços. Estética juvenil contemporânea (influências coreana/japonesa/ocidental), sem marcas/personagens protegidos. Catálogo modular em dados (id único, nome PT-PT, categoria, origem: inicial|estrelas|teste|coleção-mensal, compatibilidade, camada/âncora), peças reutilizáveis e combináveis; sem imagem por combinação.
Abu (pinscher): coleiras, lenços, laços, casaquinhos, chapéus, óculos, temáticos; melhorar expressões/olhos/orelhas/patas/cauda/sombras/encaixe; preservar animações existentes; reação simples ao receber prémio (abanar cauda/saltar).
Loja/inventário únicos (sem segunda loja); sem compras duplicadas; distinguir inicial/estrelas/teste/coleção.

## Bloco C — coleção mensal 4×4
- Catálogo local versionado de coleções mensais (id `AAAA-MM`), 16 artigos distintos por mês (não repetir imagens com outros nomes); preparar pelo menos 3 meses (2026-11, 2026-12, 2027-01) com artigos realmente diferentes; mês sem coleção → fallback documentado sem repetir silenciosamente. Artigo: id único, nome, categoria, pré-visualização, compatibilidade (personagem/Abu), estado disponível|desbloqueado|possuído.
- Mês pelo relógio local (fuso do dispositivo), estável durante o mês, sem API, sem exigir abrir no dia 1; mudança de mês preserva inventário e equipado, não duplica.
- UI: grelha 4×4 (adapta a ecrã pequeno mantendo 16 posições); mostra possíveis prémios, ganhos, quantos faltam, quando chega a próxima coleção; consultável antes do teste; critério de elegibilidade explicado antes do teste. Sem pressão agressiva.
- Prémios por nota (adicionais às estrelas): 100% → 4; [90,100) → 3; [80,90) → 1; <80 → 0. Sorteio uniforme, sem reposição, entre disponíveis do mês; fonte de aleatoriedade injetável (testes determinísticos); menos disponíveis que o devido → só os restantes, com aviso; coleção completa → mensagem sem erro. Entrega imediata ao inventário, revelação com animação breve, equipar a partir do resultado.
- Elegibilidade: mínimo 10 questões válidas e distintas; exercícios livres e modo Estudar sem restrição. Anti-exploração transparente e não punitiva: registo por (mês, tentativa/teste id, seleção de matéria); reabrir/recarregar resultado não duplica (idempotente por id de tentativa); novos artigos para a mesma seleção de matéria no mês só na 1.ª elegível ou em melhoria de resultado (definir e explicar na UI); repetir testes continua permitido.
- Persistência (Save, migração aditiva): coleção mensal, artigos atribuídos, id do teste, resultado, recompensa, inventário, equipados.

## Testes obrigatórios
79/80/89/90/99/100%; sem reposição; uniformidade (RNG injetado); sem duplicados; inventário; reload sem duplicar; elegibilidade; Save antigo carrega; rotação mensal (incl. virar mês, fuso, mês sem coleção); coleção completa; offline após carga. Fluxo e2e: teste → nota → sorteio → guardar → equipar, em 3 viewports. tsc, build, unit, e2e, regressão verdes. Capturas reais inspecionadas.

## Fora de âmbito
Currículo, outras disciplinas, nova investigação de direção artística, push/publicação (feitos por Claude).

## Decisões fechadas (revisão Codex do plano, aceites por Claude)
- Ordem de camadas funcional (não a lista literal): acess. traseiros/cabelo traseiro → corpo → baixo/calçado → top → casaco → mãos → rosto/olhos → cabelo frontal/franja → acess. dianteiros. Compositor real: src/art/d/compose.ts + manifest.ts (cabelo hoje é imagem única; separar trás/frente). Um só resolvedor de compatibilidade para UI/equipar/aleatório/carregar; nunca apaga propriedade.
- Anti-exploração: orçamento por (seleção de matéria, mês) = maior escalão atingido (0/1/3/4); entrega só a diferença ainda não atribuída (80→90→100 = 1+2+1). Chave da seleção = disciplina + IDs semânticos ordenados/deduplicados. Idempotente por id de tentativa; recibo guardado antes da revelação.
- Percentagem sobre créditos originais (antes de arredondar nota); só 100% exato = 4. Só Teste concluído é elegível; sala deve oferecer ≥10 perguntas e avisar se o banco não permite.
- Save v3 aditivo (aceita v1/v2): tentativas, recibos, progresso mensal, equipamento canónico; recibo+inventário+estrelas+equipamento numa só escrita; mês local (nunca toISOString), mês/fuso fixados à conclusão. Loja real = src/app/extras/profile.ts.
- Mês sem catálogo: mostrar indisponível + próxima coleção conhecida, sem reciclar.
- Arte: 48 peças mensais distintas (reutilizáveis p/ bloco B), SVG próprio preferencial; image_gen só com seleção/ajuste/inspeção. Aprovar amostra difícil primeiro (cintura, franja, casaco, roupa Abu).
- Estados de coleção derivados do inventário (sem booleanos redundantes).
