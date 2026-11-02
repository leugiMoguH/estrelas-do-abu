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

---

# Proveniência dos assets do Bloco B

Arte própria SVG, criada para este projeto. Sem marcas, personagens de terceiros,
fontes externas, imagens de rede ou image_gen. Sem dependências novas.
Os contornos e detalhes são originais; cores partilhadas não contam como artigos distintos.
Assets modulares: `src/art/assets/block-b/*.svg`; roupa do Abu: formas SVG em
`src/art/d/pieces.ts`, aplicadas por `ABU_ANCHORS` (640×640).
O corpo, poses e animações raster D existentes mantêm a sua proveniência anterior.
A sombra SVG e o recorte disjunto da cauda reutilizam essa mesma pintura.

Amostra difícil: `test-results/block-b/sample.png`, aberta antes de escalar:
camisa/cintura, franja arredondada, casaco aberto, colete Abu sentado/deitado/a dormir.
Inspeção final: folhas e detalhes em `test-results/block-b/`.
Correções: resíduos da roupa interior/canelas fora das novas silhuetas,
vestido cortado pela abertura do casaco, acentos PT-PT e compressão da roupa do Abu nas poses baixas.

## Reserva para o Bloco C

48 IDs mensais, 32 personagem + 16 Abu; todos com origem `coleção-mensal`,
sem preço e ausentes da loja normal. Esta distribuição é uma reserva editorial;
não implementa calendário, atribuição, recompensas nem persistência mensal.
Os estados de propriedade continuam derivados do inventário existente.

### 2026-11

| ID | Nome | Slot |
|---|---|---|
| `m-polo` | Polo de râguebi | top |
| `m-tunika` | Túnica com bolsos | top |
| `m-hoodie` | Hoodie com bolso canguru | top |
| `m-blusa` | Blusa de mangas em balão | top |
| `m-colete` | Colete de losangos | top |
| `m-camisa-laco` | Camisa com laço na gola | top |
| `m-vestido` | Vestido de pregas com gola | top |
| `m-macacao` | Macacão de alças largas | top |
| `m-cargo` | Calças cargo | bottom |
| `m-saia-pregas` | Saia de pregas largas | bottom |
| `m-abu-coleira-folha` | Coleira de folha do Abu | abuNeck |
| `m-abu-lenco-pontas` | Lenço de duas pontas do Abu | abuNeck |
| `m-abu-laco-plissado` | Laço plissado do Abu | abuNeck |
| `m-abu-gola` | Gola de pétalas do Abu | abuNeck |
| `m-abu-gravata-fina` | Gravata de ponta curta do Abu | abuNeck |
| `m-abu-medalhao` | Coleira com medalhão do Abu | abuNeck |

### 2026-12

| ID | Nome | Slot |
|---|---|---|
| `m-calcoes-dobras` | Calções com dobras | bottom |
| `m-culottes` | Calças culotte | bottom |
| `m-saia-envelope` | Saia de trespasse | bottom |
| `m-joggers` | Calças de punho | bottom |
| `m-gabardina` | Gabardina de lapelas | outer |
| `m-bomber` | Blusão de punhos | outer |
| `m-casaco-capuz` | Casaco com capuz | outer |
| `m-sobretudo` | Sobretudo de gola alta | outer |
| `m-cabelo-ondulado` | Médio ondulado | hairStyle |
| `m-cabelo-pixie` | Curto com madeixa lateral | hairStyle |
| `m-cabelo-duplo` | Dois apanhados com tranças | hairStyle |
| `m-abu-impermeavel` | Impermeável com bolso do Abu | abuBody |
| `m-abu-capa-folha` | Capa recortada do Abu | abuBody |
| `m-abu-malha` | Camisola de malha do Abu | abuBody |
| `m-abu-colete-botoes` | Colete com botões do Abu | abuBody |
| `m-abu-marinheiro` | Camisola de gola marinheira do Abu | abuBody |

### 2027-01

| ID | Nome | Slot |
|---|---|---|
| `m-cabelo-longo-franja` | Comprido com franja cortina | hairStyle |
| `m-mary-jane` | Sapatos de tira | shoes |
| `m-tenis-cano` | Sapatilhas de cano alto | shoes |
| `m-botins-fivela` | Botins com fivela | shoes |
| `m-sandalias` | Sandálias de tiras | shoes |
| `m-brincos` | Brincos de lua | accessory |
| `m-pulseiras` | Pulseiras entrelaçadas | accessory |
| `m-colar` | Colar com medalhão oval | accessory |
| `m-oculos` | Óculos hexagonais | glasses |
| `m-boina` | Boina com botão | hat |
| `m-mochila` | Mochila de bolso redondo | backpack |
| `m-abu-poncho` | Poncho de franjas do Abu | abuBody |
| `m-abu-viseira` | Viseira do Abu | abuHead |
| `m-abu-boina` | Boina inclinada do Abu | abuHead |
| `m-abu-oculos-quadrados` | Óculos quadrados do Abu | abuHead |
| `m-abu-coroa-folhas` | Coroa de folhas do Abu | abuHead |

## Outras peças novas

- `b-camisa`: inicial, sem preço.
- `b-franja` e `b-casaco`: estrelas (14 cada).
- `b-abu-colete`: teste, sem preço; preparado para futura atribuição, sem criar uma recompensa neste bloco.
- Rosto: sete formas de olhos, seis cores, sete expressões, três sobrancelhas e três variações de traços; opções iniciais.

Variante de encaixe `m-cabelo-duplo-hat.svg`: o mesmo penteado com os apanhados
recolhidos, sem contar como artigo adicional. Corrige volumes cortados pela aba.
