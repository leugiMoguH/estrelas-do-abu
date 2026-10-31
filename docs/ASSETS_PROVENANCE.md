# Proveniência das imagens (Fase 2) — estado honesto

**Não é uma garantia jurídica.** As imagens raster foram geradas por IA (ferramenta de geração de imagem integrada no Codex, «image_gen») a partir de prompts próprios e de referências geradas no próprio projeto. Os termos oficiais da ferramenta **não foram lidos** (a página oficial devolveu HTTP 403); fontes secundárias dizem que o utilizador fica com os direitos sobre o resultado, sujeito às políticas. **Exclusividade não afirmada.** Não foram usados ficheiros, personagens ou estilos de estúdios/terceiros de forma deliberada; «sem imitar estúdios» não prova ausência de semelhanças.

| Grupo | Pasta (src/art/assets) | Origem | Registo dos prompts |
|---|---|---|---|
| Rapariga/Abu/campus D v1 | `d/` | image_gen a partir de referência conjunta gerada no projeto; recorte/redimensionamento local | `tests/shots/d-src/REPORT.md` |
| Praça, rapariga surpresa | `d2/` | image_gen + composição local | `tests/shots/d-src/REPORT.md` |
| Piloto modular (8) | `d3/` | composição local (Pillow) a partir de `d/` | `tests/shots/d-src/modular.py` |
| Camadas da personagem (corpo-molde, 7 cabelos, 7 tops, 5 baixos, 4 calçados, gabardina) | `d4/` | image_gen sobre molde gerado no projeto, chroma verde; extração, limpeza e recolor locais | `tests/shots/d-src/layers/PROMPTS.md`, `raw*/PROMPTS.md` (raw não versionado: grande) |
| Abu (8 poses) e tutores (2×2) | `d5/` | image_gen a partir de `d/abu_*` e de `girl_happy`; processamento local | `tests/shots/d-src/abu`, `tutors` (PROMPTS no raw, não versionado) |
| Salas (2) | `d6/` | image_gen (estilo da praça) | `tests/shots/d-src/rooms` |
| Direção B (histórico) | `b/` | image_gen (protótipo anterior, não usado no tema D) | — |

Acessórios do Abu e da personagem, rosto (olhos, boca, blush), estrela e interface: SVG/CSS próprios (código do projeto).
Limitações: modelo/versão exata do gerador não registada pela ferramenta; as cópias automáticas ficam no diretório gerido do Codex (fora do repositório). Antes de qualquer publicação pública definitiva: ler os termos oficiais, decidir se se mantém IA ou se se encomenda arte, e inventariar por ficheiro.


## HGP — 2026-10-31

Uma tentativa direta por asset com a ferramenta integrada `image_gen`, ambas com sucesso. Sem referências externas; não foi necessário SVG alternativo. Ficheiros copiados sem alteração do resultado PNG:

- `src/art/assets/d5/tutor-tome-neutral.png`: Tomé, tartaruga com carapaça e mochila de viajante, PNG com alpha. O mesmo retrato é usado em repouso e durante a fala (sem pose de fala separada). O resultado contém um halo de fundo semitransparente, apesar do pedido de transparência.
- `src/art/assets/d6/room-his.png`: sala com estantes, mapa-mundo decorativo e globo. O mapa é ilustração de ambiente, não material curricular/cartográfico.

Prompts exatos (modo integrado, sem CLI):

> Use case: illustration-story. Asset for a Portuguese educational game for an 11-year-old child. Tomé, a friendly travelling turtle tutor, full body with a patterned green shell and small traveller backpack, welcoming smile, three-quarter view, standing. Polished softly painted storybook illustration with warm light, rounded shapes, gentle dimensional shading, warm cream and sage palette, matching a cosy illustrated school game. Isolated on transparent background, no text, no watermark.

> Use case: illustration-story. Wide room illustration for a Portuguese educational history and geography game for an 11-year-old child. Cosy school library classroom, wooden bookshelves with colourful books, framed world map on the back wall, globe on a wooden desk, warm sunlight through a window, welcoming exploration atmosphere. Polished softly painted storybook game background, rounded shapes and gentle dimensional shading, cream, honey wood, sage and muted blue palette. Wide landscape composition, empty floor in the foreground for game characters. No people, no text, no watermark.

Limitações: versão exata do modelo não exposta; correspondência à direção D avaliada visualmente, sem garantia de identidade estilística. Mantêm-se as limitações gerais acima. PNG originais com cerca de 4,5 MB no total, sem otimização adicional.
