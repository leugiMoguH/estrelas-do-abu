# Bloco B — verificação

Catalogo: 103 artigos (52 novos), mais 26 modulos faciais iniciais.
Novos: cabelo 5, top 9 (inclui vestido e macacao), baixo 6, casaco 5,
calcado 4, acessorio 3, oculos 1, chapeu 1, mochila 1,
Abu pescoco 6, corpo 7, cabeca 4.
48 reservas mensais (32 personagem + 16 Abu); distribuicao editorial 3 x 16
em docs/ASSETS_PROVENANCE.md. Nenhuma reserva tem preco ou aparece na loja normal.
As quatro restantes: uma inicial, duas estrelas e uma teste.

Amostra dificil inspecionada antes da expansao: test-results/block-b/sample.png.
Capturas finais: test-results/block-b/contact-390x844.png,
contact-820x1180.png, contact-1280x800.png, e sheet-{largura}-{0..4}.png.
Folhas abertas e inspecionadas nas tres larguras: pecas novas, nove poses Abu,
triplos com conjuntos/casacos/franjas/chapeus e sete variantes de rosto.
Corrigidos: residuos de roupa interior/canelas, corte do vestido sob casaco,
volumes dos apanhados sob boina, iris dos olhos alongados e acentos.
No perfil móvel, a regra que retira a posição fixa ganhou especificidade sobre
o tema D; a pré-visualização deixa de subir sobre os controlos ao percorrer itens.
O teste de geometria aguarda também o fim da animação breve de compra.
A roupa do Abu comprime nas poses deitado/a dormir sem tapar as patas.
A anatomia raster original foi preservada; sombras e cauda receberam camadas SVG.

Comandos:
- npx.cmd tsc --noEmit: passou.
- npm.cmd test: 1054 testes, 21 ficheiros, passaram.
- npm.cmd run build: passou; aviso preexistente de bundle >500 kB.
- npx.cmd playwright test tests/e2e/avatar-d.spec.ts tests/e2e/avatar-d-fitting.spec.ts
  tests/e2e/abu-d.spec.ts tests/e2e/focus-d.spec.ts tests/e2e/block-b.spec.ts
  --output=test-results/block-b-e2e-final: 15 testes passaram nos três viewports.
- Para as capturas: npm.cmd run dev -- --host 127.0.0.1 --port 4174.
- node tests/block-b-captures.mjs: 76 casos x 3 viewports; imagens reais carregadas,
  sem erros de consola/pagina ou overflow; cobertura raster em todos os pares
  de cinturas normais (exclui conjuntos que escondem o baixo).
- Testes de combinacoes: todos os pares dos eixos personagem (inclui rosto novo),
  128 amostras e sorteios deterministas, triplos criticos, pares de roupa Abu
  com cabeca variada em todas as poses. Testado Save antigo e propriedade mensal.

API: abuPrize(container, reduceMotion?) em src/art/index.ts e src/app/abu-life.ts.
Conserva equipamento, usa salto feliz breve e respeita preferencia do SO/app.
O resolvedor devolve hiddenSlots para conjuntos, conservando IDs e propriedade.
As miniaturas de partes de baixo mostram a própria peça, mesmo quando o vestido
está equipado; a escolha inferior fica identificada como «Guardado sob conjunto».

Limites: a inspeção visual cobre amostras, não o produto cartesiano inteiro.
Não há atribuição de peças teste/mensais neste bloco; o Bloco C recebe os IDs e a API.
Sem dependências novas, rede em runtime, alterações a Save/recompensas, commits ou publicação.
