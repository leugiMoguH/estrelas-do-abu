# Bloco A — verificação

Compositor D: máscaras disjuntas separam cabelo traseiro/frontal sem duplicar
os assets. O rosto precede sempre a franja. O manifesto documenta âncoras,
coberturas e ajustes das cinturas; nas calças, o ajuste preserva os tornozelos.
Botas sobrepõem as calças; casaco limita as mangas do top à sua abertura;
mãos regressam à frente da roupa. A camisola interior da jaqueta aberta
termina na cintura com margem de sobreposição, limitada pela bainha do top.

O resolvedor comum preserva os IDs selecionados. Sob chapéus fechados, recolhe
o volume superior do cabelo; com chapéu, prende bandolete/laço ao lado.
A UI e a descrição SVG explicam ambos os ajustes. Inventário não é alterado.

## Inspeção realizada

Capturas finais: `test-results/block-a/contact-390x844.png`,
`contact-820x1180.png`, `contact-1280x800.png`, mais detalhes ampliados.
As três folhas foram abertas e inspecionadas: 16 conjuntos, oito peles,
todos os tops/baixos/calçados, cabelos longos/franja, gabardina e acessórios.

Defeitos encontrados e corrigidos durante a inspeção:

- Olhos sobre a franja: cabelo frontal passa depois do rosto.
- Corte horizontal nos cabelos junto aos ombros: fronteira curva acompanha
  pescoço/ombros e conserva as madeixas laterais.
- Bandolete transformada em traço saliente: encaixe lateral redesenhado
  junto à aba do chapéu; laço também aproximado da aba.
- Pequena abertura com jaqueta/cós, confirmada por píxeis: margem de 16 unidades
  na máscara interior. Os 35 pares top/baixo cobrem a região central da cintura.
- Acentos dos avisos corrompidos na primeira execução: texto PT-PT corrigido.

Nas folhas finais não se observam camisolas/calças desencaixadas nem olhos
sobre a franja. A validação visual é uma amostra, não todo o produto cartesiano.

## Reprodução e resultados

- `npx.cmd tsc --noEmit`: sem erros.
- `npm.cmd test`: 1048 testes, 20 ficheiros, verdes.
- `npm.cmd run build`: passou; mantém aviso de bundle >500 kB.
- `npx.cmd playwright test tests/e2e/avatar-d.spec.ts tests/e2e/avatar-d-fitting.spec.ts tests/e2e/abu-d.spec.ts tests/e2e/focus-d.spec.ts --output=test-results/e2e-final`:
  12 testes verdes nos três viewports; perfil v1, favoritos, compras, inventário,
  estrelas e equipamento preservados após guardar/recarregar.
- `npm.cmd run dev -- --host 127.0.0.1 --port 4174`, depois
  `node tests/block-a-captures.mjs`: capturas e verificações raster verdes;
  sem overflow horizontal nem erros de página/consola na galeria.

Testes de encaixe percorrem todos os pares dos 14 eixos, 128 conjuntos
determinísticos, 128 sorteios e triplos top/baixo/casaco e cabelo/chapéu/acessório.
O script também compara a composição com/sem rosto nos píxeis opacos da franja
na região dos olhos: o rosto não altera esses píxeis.

Sem novas dependências, alterações ao Save, commits ou publicação.
