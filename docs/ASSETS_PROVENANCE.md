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
