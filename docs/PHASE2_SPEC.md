# Fase 2 — especificação técnica (direção D aprovada)

Decisão (revisão Codex 2026-10-31, aceite): compositor **SVG com `<image>`** (strings em `innerHTML`, como o resto da arte) sobre um **corpo-molde** único; camadas WebP transparentes alinhadas ao molde; rosto, acessórios e cor por SVG. Sem canvas. Sem novas dependências.

## Molde e coordenadas
viewBox `0 0 1024 1536` (molde). Cabeça x389–626 y46–330 (centro x507); olhos y≈196 (x448/568); boca (508,272); nariz y≈253; ombros y375; cintura y700; pés y1370–1480. Assets em `src/art/assets/d4/*.webp` (768×1152, alpha), gerados por `tests/shots/d-src/layers/build_layers.py` (fora do âmbito do código TS).

## Ordem das camadas (de trás para a frente)
`backpack-back` < `skin` (corpo, mapa de gradiente por tom) < `under` (camisola/calções interiores) < `shoes` < `bottom` < `top` < `outer` < `hair` (trás+frente, mapa de gradiente por cor) < `face` (blush, olhos, sobrancelhas, boca — SVG) < `glasses` < `hat` < `accessory`. Rosto por cima do cabelo só nas zonas de rosto; franja (hair-franja) fica por cima do rosto (`hairFront` opcional no manifesto).
Manifesto `src/art/d/manifest.ts`: por id de item → `{ slot, file, z, covers?: Slot[] }` (ex.: `bottom-calcas` cobre `under` inferior; `hat` esconde `accessory` de cabeça). Teste: todo o id de `CATALOG` tem entrada no manifesto e ficheiro existente; ids em falta falham o teste.

## Cor por mapa de gradiente (runtime, filtro SVG)
`feColorMatrix` (luminância) + `feComponentTransfer type="table"` por canal. Pele: 4 paragens `[linha, sombra, base, brilho]` por tom, luminância de entrada `[0, .22, .77, 1]` (já validado em `tests/shots/d-src/layers/skin_map.py`: replicar essa função `ramp()` em TS, 8 tons de `SKIN_TONES`). Cabelo: mesmo método com 4 paragens por cor de `HAIR_COLORS`; calibrar com o cabelo castanho de origem. Um `<filter>` por (tipo,id) com id único por desenho (`uid`).

## Rosto SVG (`src/art/d/face.ts`)
Parametrizado por `eyes` (5 ids atuais), nova `eyeColor`, `expression` (5 ids atuais), tom de pele (lábios e blush derivados do tom, com contraste equivalente em todos). Pintado: iris com gradiente + brilho, pestanas, contorno escuro fino, sobrancelhas. Pontos de referência acima. Referência de aspeto: `tests/shots/d-src/layers/test.html`. Piscar: grupo `.eye` com classe de animação (CSS), desligado com `reduceMotion`.

## Dados (AvatarConfig v2, migração explícita)
`AvatarConfig` ganha: `outer: string|null`, `glasses: string|null`, `hat: string|null`, `backpack: string|null`, `eyeColor: string`; `accessory` passa a ser só decorativo (pescoço/cabelo). Ids existentes de `CATALOG` **preservados**; `acc-oculos`/`acc-sol` → slot `glasses`; `acc-gorro`/`acc-coroa`/`acc-auscultadores` → `hat`; `acc-bandolete`/`acc-fita`/`acc-colar` → `accessory`. `store.load`: `profile.version` 1→2 migra o avatar antigo (mapa de ids→slots), valida cada id contra `CATALOG` e propriedade (`free` ou em `save.ownedItems`), aplicando uma função pura `normalizeAvatar(avatar, ownedIds)` partilhada com `safeAvatar` e favoritos. `Save` (core/save.ts) NÃO muda (progresso e compras intactos). Testes de migração: perfil v1 real → v2, id desconhecido, item não possuído, favoritos.
Catálogo novo (preços em estrelas, itens existentes mantêm preço): penteados 8 (hair-rapado = sem camada), tops 7, bottoms 5, shoes 4, outer 1 (`outer-gabardina`), glasses 3, hat 4, accessory 4, backpack 2. Todos os `*-abu`: ver spec de Abu.

## Integração
Registar tema `'d'` em `ArtTheme`/`themes.ts` com `avatarSvg(config, {pose,size,withAbu})`; `withAbu` usa o Abu D (não `abuInner`). Poses `cheer`/`think`: fallback explícito = pose idle com animação CSS (salto/inclinação), sem reposicionar braços. Tornar `'d'` o tema por omissão **só quando** os critérios abaixo passarem; até lá selecionável por `?tema=d`. Manter `atual`, `a`, `b`.

## Critérios de aceitação
`npx tsc --noEmit`, `npm test`, `npx playwright test` verdes; testes novos: manifesto, `ramp()` (contraste mínimo entre linha e base por tom), `normalizeAvatar`, migração; e2e: personalizar, comprar, equipar, recarregar mantém a aparência; capturas 390×844, 820×1180, 1280×800 inspecionadas; sem scroll horizontal; consola limpa.
