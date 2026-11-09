# F2b — revisão pedagógica e de clareza (Claude, 2026-11-09)

Pedido do produtor: rever «sopra/sopram» (singular/plural não significam menos/mais força), frases e concordância das 3 situações, decisão na situação 2, comportas na situação 3, feedback e toque. Corrigir só problemas concretos; sem níveis novos nem reconstrução. Versão anterior preservada: tag `blocoC-f2b-prototipo-2026-11-09` (`cfc03ae`), gh-pages `18aeadc`.

## Defeitos confirmados (leitura de `src/prototipos/f2b/*`)

**P1 — a forma verbal funciona como botão de força (pedagógico, grave).**
- A cena mostra 1 nuvem em repouso; escolher «sopram» faz **aparecer** uma 2.ª nuvem (`joining`). É o verbo que convoca o agente, ao contrário da concordância (o sujeito determina a forma do verbo).
- O empurrão é 60 px vs 170 px, não aditivo (2 × 60 = 120), por isso lê-se como «mais forte», não como «duas nuvens a soprar».
- O próprio teste chama-se «força excessiva e insuficiente».

**P2 — com as duas comportas abertas, a cena contradiz a regra (clareza, situação 3).**
Com `a` e `b` abertas, os dois canais aparecem com a água a correr por completo, mas soprar falha com «A corrente não chega a este barco.» Esta mensagem também não distingue entre «a comporta deste canal está fechada» e «a água divide-se».

**P3 — o objetivo da situação 3 não refere as comportas.** «Guia a corrente para as duas saídas.» não diz o que é preciso fazer.

Frases revistas sem problema de concordância: «O Abu abre a caixa.», «O Abu abre/fecha a comporta de cima/de baixo.», «A nuvem sopra o barco.», «As nuvens sopram o barco.», mensagens de resultado.

## Correção (âmbito mínimo)
1. **Agentes sempre visíveis (S2 e S3):** as duas nuvens estão sempre na cena. Com «sopra», só uma nuvem sopra (com rajada) e a outra fica parada e visível; com «sopram», sopram as duas. Remover `joining`.
2. **Consequência física = número de nuvens que sopram:** cada nuvem empurra um passo igual (`STEP`). A saída próxima fica a 1 passo e a distante a 2 passos; as saídas mudam de posição se for preciso. As marcas de passo, discretas na água, permitem prever a distância antes de agir. O barco que falha anda exatamente 1 ou 2 passos e volta (como agora).
3. **Mostrar quem vai agir antes de agir:** ao selecionar a palavra, acendem-se as nuvens que vão soprar (uma ou as duas), e a linha de feedback mostra o início da frase, «A nuvem sopra…» ou «As nuvens sopram…», seguido de «Toca num barco.». A frase final destaca o par sujeito+verbo (`<strong>As nuvens sopram</strong> o barco.`). Sem termos gramaticais.
4. **S3, estados da água coerentes:** com as duas comportas abertas, a água nos dois canais aparece dividida (traço mais fino e lento) e a mensagem diz «A água divide-se pelos dois canais e não leva o barco.» Se a comporta do próprio canal estiver fechada: «A comporta deste canal está fechada: a água está parada.» A regra de jogo não muda (o barco só anda se o seu canal for o único aberto).
5. **Objetivo S3:** «Abre o caminho da água e leva cada estrela à sua saída.»

## Critérios de aceitação
- Testes unitários: as duas nuvens estão sempre presentes em S2/S3 (com ou sem ação). O número de nuvens a soprar é 1 com «sopra» e 2 com «sopram». O empurrão é proporcional às nuvens (`push = nuvens × STEP`). As saídas ficam a 1 e 2 passos. O solver mantém 1/2/4 ações. Os estados continuam imutáveis. As mensagens P2 distinguem os dois casos. O teste «força» passa a ter um nome sobre nuvens/passos.
- e2e (só `prototipo-f2b.spec.ts`, nos 3 viewports): mantém-se o que já valida (fluxo completo, isolamento `eda-proto-f2b`, sem consola/scroll horizontal) e passa a verificar 2 nuvens sempre visíveis, 1 ou 2 a soprar, e o realce das nuvens ao selecionar a palavra.
- Âmbito: só `src/prototipos/f2b/**`, `tests/core/prototipo-f2b.test.ts`, `tests/e2e/prototipo-f2b.spec.ts` e `docs/prototipos/F2b-desenho.md`. Sem novas situações, dependências ou chaves de armazenamento.

## Revisão do Codex (só leitura) — decisão de Claude
Aceite:
- **Geometria única:** hoje as saídas estão a 200/110 px e os empurrões são 170/60 px. Passos, saídas, animação e alvos de toque passam a partilhar as mesmas constantes. Testar também os movimentos bem-sucedidos.
- O realce das nuvens segue a **seleção atual** (não o último `wind`). Testar selecionar, anular e recomeçar.
- Objetivo S3: «Abre e fecha as comportas e leva cada estrela à sua saída.» («abre o caminho» omitia o fechar).
- Frases mais naturais e com a concordância repetida: «A nuvem sopra e empurra o barco.» / «As nuvens sopram e empurram o barco.»
- A corrente dividida apresenta-se como regra deste cenário (a mensagem fala destes canais, não de uma lei geral).

Rejeitado: pôr «uma nuvem / as duas nuvens» junto aos botões antes da escolha. A criança passaria a escolher pela etiqueta e deixaria de ler a forma verbal. O sujeito fica explícito logo **depois** de tocar na palavra: as nuvens que vão soprar acendem-se e aparece «A nuvem sopra…» ou «As nuvens sopram…». A ligação entre a forma e os agentes vê-se antes de agir, sem dar a resposta.

## Limites assumidos
- S2 continua curta (4 combinações). As marcas de passo transformam-na em previsão e não em adivinhação, mas a tentativa e erro continua possível: só a sessão observada mostra qual delas a criança usa.
- Com «sopra», qual das nuvens sopra fica fixo (a da esquerda); não tem importância para a regra.
