# Relatório — camadas D
Resultado: prova de alinhamento NÃO conseguida; seis peças geradas, com falhas de encaixe/isolamento.
8 chamadas image_gen: base 1, cabelo comprido 2, carrapitos 2, casaco 1, hoodie 1, acessórios 1; nenhuma recusa.
Motor integrado image_gen; ambas as referências originais em todas as chamadas; base acrescentada como molde nas peças.
A referência original tem mãos nos bolsos e pose inclinada; a base frontal altera necessariamente essa pose.
Imagens brutas preservadas; sem redimensionamento, translação, correção manual ou normalização do verde.
BBox = [x0,y0,x1,y1), píxeis com distância euclidiana RGB a #00FF00 >100.
Referência geométrica: girl_happy_green.png, 1024×1536; bbox [229, 29, 741, 1503].
reference.webp é cenário com cão e foi usada apenas para estilo; bbox global não mede a rapariga isolada.
Δ = bbox da camada menos bbox da referência, por coordenada; camadas parciais têm extensões diferentes por definição.
A bbox global não prova alinhamento anatómico nem permite inferir sozinha desvio percentual de pose.

| PNG | Dimensões | Verde puro | Bbox | Δ ref (px) |
|---|---|---:|---|---|
| body_base.png | 1024×1536 | 0.000% | [279, 45, 728, 1471] | [50, 16, -13, -32] |
| coat_open.png | 1024×1536 | 0.000% | [257, 315, 769, 1261] | [28, 286, 28, -242] |
| glasses_hat.png | 1024×1536 | 0.001% | [342, 24, 680, 377] | [113, -5, -61, -1126] |
| hair_buns.png | 1024×1536 | 0.000% | [272, 28, 766, 441] | [43, -1, 25, -1062] |
| hair_buns_attempt1.png | 1024×1536 | 0.001% | [242, 51, 769, 461] | [13, 22, 28, -1042] |
| hair_long.png | 1024×1536 | 0.001% | [279, 30, 728, 1471] | [50, 1, -13, -32] |
| hair_long_attempt1.png | 1024×1536 | 0.000% | [213, 20, 794, 700] | [-16, -9, 53, -803] |
| hoodie_shorts.png | 1024×1536 | 0.000% | [281, 327, 740, 802] | [52, 298, -1, -701] |

body_base: sucesso como novo molde frontal; falha de identidade geométrica literal com a referência inclinada. Mãos/pés visíveis.
hair_long: falha; tentativa 1 ondulada, larga e risca lateral; tentativa 2 melhora forma mas conserva roupa e contornos do corpo.
hair_buns: falha de encaixe; segunda tentativa ainda coloca franja/coques demasiado baixos e largos face à cabeça careca.
coat_open: isolamento conseguido; pregas e abertura presentes; encaixe de gola/punhos requer inspeção da composição.
hoodie_shorts: isolamento conseguido; bainha sobe relativamente à base e deixa parte da camisola/calções neutros exposta.
glasses_hat: falha de alinhamento; óculos aproximadamente y315 em vez de y205; gorro demasiado baixo e largo.
Sem cabelo cortado nos limites da tela; não se confundem as diferenças de penteado com deslocações anatómicas.
Composição: body_base + hair_long (tentativa 2) + coat_open, nessa ordem, sem ajustes; PNG RGBA 1024×1536.
Chroma: distância <=100 transparente, transição linear 100–160; descontaminação verde só na transição.
composite_review.png mostra o mesmo resultado sobre cinzento para inspeção de halos.
Validação npm test/build não executada: tarefa limita a pós-produção a Python local e escritas a layers/.
Limite do ambiente: image_gen guarda automaticamente cópias em .codex/generated_images fora de layers; cópias entregues em layers.
Próximo passo: corrigir isolamento e âncoras anatómicas num editor por camadas antes de validar a direção D.
