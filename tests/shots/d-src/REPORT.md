# Noite das Estrelas — entrega artística

Ferramenta: image_gen incorporada; sete chamadas, pela ordem pedida. Sem API alternativa, dependências novas, commit ou push.

## Ficheiros e validação

Todos os sete WebP têm 1024 × 1536, qualidade 88. Tamanhos em KiB (1024 bytes):

| Ficheiro | KiB |
|---|---:|
| reference.webp | 231,8 |
| girl_happy.webp | 95,8 |
| girl_surprised.webp | 93,7 |
| girl_outfit2.webp | 107,6 |
| abu_happy.webp | 98,8 |
| abu_curious.webp | 99,5 |
| campus.webp | 328,5 |

PNG de personagens recortados com Python/Pillow e NumPy locais. Originais de fundo verde preservados como *_green.png. Script reproduzível: process_assets.py. Métricas: validation.json. Montagem de revisão dos WebP reais sobre creme e índigo: cutout_review.png.

Zero píxeis visíveis com verde dominante nos cinco WebP (G > R+25 e G > B+25, alfa > 0). Inspeção visual da montagem sem halos verdes visíveis. Esta métrica não garante ausência de todos os artefactos: persistem pequenas irregularidades de antialiasing à ampliação junto de alguns contornos.

## Prompts usados — especificação e cadeia de referências

Base: STYLE LOCK do utilizador, normalizado como stylized-concept / identity-preserve: webtoon cozy original, cel shading de dois tons, contornos locais escuros, luz superior esquerda, sombras violeta recortadas, paleta hexadecimal fornecida, sem texto, sem imitação de personagens ou estúdios existentes.

1. reference: composição vertical, rapariga e Abu de corpo inteiro, campus ao entardecer, céu índigo estrelado e candeeiros dourados. Descrição completa de pele, cabelo com madeixa coral, hoodie lilás com estrela, jeans, sapatilhas, pinscher chocolate/ferrugem e lenço azul.
2. girl_happy: reference como referência de identidade; isolar apenas a rapariga, mesma pose 3/4 com mãos nos bolsos e expressão contente; substituir cenário por verde #00FF00, retirar Abu e sombras de chão.
3. girl_surprised: girl_happy como alvo; alterar apenas expressão para olhos arregalados, sobrancelhas levantadas e boca em O; preservar tudo o resto.
4. girl_outfit2: girl_happy como alvo; alterar apenas vestuário para gabardina e galochas amarelas, mantendo jeans, rosto contente e pose/mãos nos bolsos.
5. abu_happy: reference como referência de identidade; isolar apenas Abu inteiro na mesma pose, marcas e lenço; fundo #00FF00, sem chão nem sombras de chão.
6. abu_curious: abu_happy como alvo; inclinar apenas cabeça cerca de 15 graus; preservar corpo, patas, cauda, marcas e expressão contente.
7. campus: reference como referência de linguagem visual e paleta; composição elevada 3/4 sem personagens, exatamente sete edifícios, dois grandes e iluminados em primeiro plano (livro na biblioteca e formas geométricas no laboratório), cinco secundários, praça com fonte, percursos e espaço para etiquetas; pedir simplificação e ausência de texto.

## Desvios e limites observados

- Identidade da rapariga mantém-se reconhecível entre variantes: mesmo cabelo, madeixa coral, rosto e pose. Surpresa e roupa também introduziram pequenas diferenças de cor/sombra; não são alterações exclusivamente pixel a pixel.
- Rapariga mais alongada do que as 4,5 cabeças pedidas, já na referência. Sapatilhas com reflexos lilases, em vez de branco neutro. Sombras/brilhos excedem por vezes a regra estrita de dois tons.
- Abu mantém marcas, lenço, cauda e construção geral, mas na extração as orelhas ficaram maiores em relação à cabeça. O curioso também muda ligeiramente o desenho dos olhos/focinho e sombreamento, além da inclinação pedida.
- Campus: sete edifícios principais distinguíveis (três atrás, dois intermédios e dois à frente), fonte e percursos confirmados visualmente. Os dois dianteiros são maiores e mais luminosos. Ainda há detalhe/textura excessivos, iluminação forte nos edifícios secundários e pouco espaço livre em alguns pontos para etiquetas. Edifícios dianteiros parcialmente cortados nas margens laterais.
- Referência e campus têm textura de vegetação/céu e transições mais pintadas do que o STYLE LOCK pretendia; o acabamento não cumpre integralmente a restrição de ausência de textura/gradientes.
- A ferramenta incorporada ignorou o destino solicitado e guardou automaticamente cópias em C:/Users/hugom/.codex/generated_images/01a18d48-e8e5-7f70-ae2d-45084be2b38b/. Essas cópias automáticas não foram alteradas nem apagadas. Toda a escrita via shell/script ficou nesta pasta d.
- npm test e npm run build não executados: tarefa exclusivamente artística com escrita expressamente restrita à pasta d; o build escreveria fora do âmbito. Não houve alterações de código da aplicação nem teste de integração no jogo.

Próximo passo de maior valor: avaliar esta direção artística e as proporções com a utilizadora antes de integrar; corrigir proporções e simplificação do campus se esta direção for aprovada.
