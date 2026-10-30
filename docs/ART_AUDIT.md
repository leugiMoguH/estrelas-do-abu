# Auditoria visual da demo v0.1 (30/10/2026)

Método: demo real no browser, capturas de 9 ecrãs em 390×844 e 1280×800 (`tests/shots/before/`, geradas por `tests/shots/screens.mjs`; não versionadas). Julgamento de qualidade visual, não de correção técnica. A demo funciona; a apresentação é que fica abaixo do objetivo.

## Problemas por impacto

1. **Avatar = clip-art geométrico.** Corpo feito de elipses e traços tubulares; pose rígida em T/A; sem pescoço, ombros nem cintura; mãos são círculos; cabeça pequena em relação ao tronco, o que dá ar de boneco de formulário e não de personagem com personalidade. Penteados são «manchas» (os cachos são círculos empilhados). Sem luz, sombra nem volume. Maior problema, porque é o que a criança mais vê e personaliza.
2. **Abu reconhecível mas anónimo.** Silhueta de pinscher correta, mas plano e pouco expressivo; rosto apertado, orelhas triângulos duros, sem carisma. A mesma pose serve para tudo.
3. **Mapa sem mundo.** Edifícios são alçados frontais da mesma escala, sem perspetiva nem sobreposição, sombras iguais, relvado vazio; a praça é uma elipse bege; 7 «pílulas» brancas de rótulo competem entre si. Parece diagrama, não pequeno mundo escolar.
4. **UI genérica de aplicação escolar.** Fundo bege, cartões brancos com sombra bege, botão roxo escuro: nenhuma personalidade nem relação com a arte. Botões «de formulário», sem volume nem resposta tátil.
5. **Ecrã de personalização é um formulário.** 11 grupos de «pílulas» em fieldsets numa lista longa; a pré-visualização ocupa um terço do espaço e não fica sempre visível. Não sabe a jogo.
6. **Tipografia padrão do sistema** (Trebuchet no Windows, outra noutros): sem identidade, varia por dispositivo.
7. **Cor desligada.** Arte saturada e quente sobre UI bege apagada; falta uma paleta única que unifique ilustração e interface.
8. **Uso do espaço.** No desktop o mapa é uma coluna estreita e há grandes vazios; nos exercícios o cartão flutua num fundo liso.
9. **Sem alegria de feedback.** Acertar/ganhar estrelas é uma caixa de texto; sem partículas, sem Abu a reagir de forma visível, sem transições entre ecrãs.

## O que funciona (manter)
Percurso claro; hierarquia de leitura nos exercícios; botões grandes; mapa com realce dos edifícios ativos; ecrã inicial com personagem+Abu já melhor do que o resto; tons de pele diversos.
