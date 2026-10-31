# Receita de camadas D (Fase 2)

Molde: `tests/shots/d-src/layers/body_base.png` (1024×1536, fundo verde #00FF00, rapariga careca sem rosto, camisola interior e calções cinzentos, frontal, braços ao longo do corpo).
Âncoras do molde: cabeça x389–626 y46–330 (centro x507); olhos y≈196; ombros x355–641 y375; pulsos x294–335 e x678–715 y795; cintura y≈700; anca/calções y700–810; joelhos y≈1050; pés y1370–1480.

Regras para cada camada (PNG 1024×1536, fundo e tudo o resto #00FF00 puro, sem contornos do corpo, sem sombras de chão, sem texto):
- Entrada: body_base.png como MOLDE GEOMÉTRICO EXATO (e a referência de estilo `girl_happy_green.png`). Edita, mantém pose, escala e posição do molde; a peça tem de assentar exatamente onde assentaria no molde (não mover, rodar, ampliar, reenquadrar).
- A peça é só ela: nada de pele, rosto, cabelo ou corpo (a menos que seja a peça pedida). Mãos, pescoço, pernas e pés ficam verdes quando não fazem parte da peça.
- Mesmo estilo pintado do molde (contorno escuro fino, sombreado suave). Peças opacas, sem transparências.
- Sem logótipos, marcas, personagens ou elementos de terceiros.
- Nome do ficheiro: `raw/<id>.png`; tentativas falhadas: `raw/<id>_try1.png`. Prompt usado em `raw/PROMPTS.md`. Máx. 2 tentativas por peça; não contornar recusas (regista e passa à seguinte).
- Auto-verificação: depois de gerar, abre o PNG e confirma que a peça está sobre o sítio certo do molde (compara com body_base); regista em `raw/STATUS.md` por peça: ok / fora de sítio (escala/offset aproximados) / falhou.
