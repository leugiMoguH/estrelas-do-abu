# Protótipo F2 — plano (Claude, 2026-11-09)

Decisão do produtor (2026-11-09): F2 escolhida com **reformulação criativa obrigatória**; só protótipo isolado com **3 desafios progressivos**; sem motor extenso nem dezenas de níveis. F1 = candidato a minijogo de Matemática; F3 em reserva. Inglês («O Caso do Abu») só depois da avaliação da F2.

## Objetivo
Provar que uma mecânica de «descobrir regras com linguagem» é divertida, tátil e com identidade de Estrelas do Abu, **sem** reproduzir o sistema de Baba Is You (blocos SUJEITO-É-PROPRIEDADE empurrados num mapa que reescrevem as regras do nível).

## Etapa 1 — Variantes (Codex, só leitura)
≥ 2 variantes concretas, cada uma com: fantasia/tema, verbo principal do jogador (toque), como se descobrem regras, onde entra a língua (PT-PT; Inglês como extensão futura), progressão dos 3 desafios, como a dificuldade cresce sem centenas de níveis manuais (geração/combinação/verificação automática), diferenças explícitas face a Baba Is You, riscos, esforço. Comparação por jogabilidade, originalidade, profundidade e viabilidade; recomendação.

Restrições: 12–14 anos; não parecer exercício escolar; feedback por consequência no mundo, não «certo/errado»; usar identidade existente (Abu, estrelas, paleta/arte SVG de `src/art`) quando barato.

## Etapa 2 — Implementação (Codex, escrita) da variante escolhida
**Âmbito (ficheiros permitidos):**
- novo `prototipos/f2/index.html` (+ entrada em `vite.config.ts` → `rollupOptions.input`);
- novo `src/prototipos/f2/**` (lógica pura separada da UI DOM/SVG);
- novos testes `tests/core/prototipo-f2*.test.ts` (ou `tests/prototipos/` + include em vitest) e `tests/e2e/prototipo-f2.spec.ts`;
- `docs/prototipos/F2-*.md`.
Proibido alterar a app principal (`src/app`, `src/core`, `content/`, `index.html`, saves). Reutilizar arte só por importação de leitura.

**Isolamento:** sem ler/escrever chaves `eda*`; armazenamento próprio `eda-proto-f2` (só melhor resultado/progresso dos 3 desafios), tolerante a falhas de storage. Sem rede. Sem dependências novas.

**Critérios de aceitação:**
1. 3 desafios jogáveis do início ao fim, dificuldade crescente; cada um introduz/combina uma ideia nova (sem repetir a mesma ação trivial).
2. Regras descobríveis por experimentação; tutorial mínimo sem paredes de texto; botão anular e reiniciar.
3. Controlo por toque e rato (alvos ≥ 44 px; sem gestos obrigatórios difíceis); teclado opcional.
4. Feedback claro e imediato (visual + texto curto), inclusive para tentativas inválidas.
5. Lógica pura testada: cada desafio tem solução verificada por solver/busca em teste; estados inválidos rejeitados; nenhum nível sem saída sem forma de anular.
6. e2e nos 3 viewports do `playwright.config.ts`: carrega sem erros de consola, completa os 3 desafios por toque/clique, não toca em chaves `eda`/`eda-e`.
7. `npm run build`, `npm test` e e2e pertinentes verdes; suites existentes inalteradas.
8. `docs/prototipos/F2-desenho.md`: variante, regras, 3 desafios, diferenças face a Baba Is You, limitações.

## Etapa 3 — Claude
Verificação independente (diff no âmbito, testes, jogar nos 3 viewports, capturas), checkpoint (tag), publicação em URL isolado `…/prototipos/f2/` no gh-pages (raiz e `preview/e` intactos), protocolos de observação (V3 e protótipos). Não expandir.

## Decisão após etapa 1 (Claude, 2026-11-09)
Codex propôs 3 variantes: **Ecos das Estrelas** (montar acontecimentos numa linha temporal e simular), Oficina das Constelações (circuito de módulos; risco de a língua ser legenda), Teatro das Órbitas (papéis; risco de «ordenar frases»). **Escolhida: Ecos das Estrelas** — mais original e com descoberta causal real (experimentar → ver consequência), a língua decide agentes, ordem e momento.

Ajustes de Claude à variante:
- Linha temporal com **3 camadas fixas**: «Antes» (passado), «Agora» (presente), «Depois» (futuro). O tempo verbal do cartão tem de corresponder à camada onde é posto; isto dá sentido ao tempo verbal (é *quando* acontece), em vez de efeitos arbitrários.
- Cartões compostos por toque: escolher sujeito (singular/plural) e forma verbal entre 2–3 opções; frase mal concordada **executa-se de forma incompleta** no mundo (ex.: só uma estrela atua; eco «falha» com a ligação destacada) e o texto diz o que aconteceu — nunca «errado».
- «Experimentar» corre a simulação animada passo a passo; anular/reiniciar sempre disponíveis.
- 3 desafios: (1) ordem/causa; (2) concordância e agentes; (3) tempos verbais nas 3 camadas. Desafio 3 combina 1 e 2.

Ajustes aceites da revisão do Codex: exceção explícita — a única chave permitida é `eda-proto-f2` (nenhuma outra `eda*`, leitura incluída; testes instrumentam `localStorage`); testes em `tests/core/prototipo-f2*.test.ts` (sem mexer no include); critérios extra: tentativa válida com consequência inesperada, distinção entre frase impossível e ação sem efeito, sem scroll horizontal, e2e com `tap()` (toque) nos viewports com `hasTouch`. Solver só valida solvabilidade, não correção linguística nem diversão (revisão humana PT-PT pendente).
