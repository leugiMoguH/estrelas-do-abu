# Plano técnico — demo vertical

## Arquitetura
- Vite + TypeScript estrito, UI em DOM/CSS, router simples por ecrã (state machine), sem framework.
- Arte: SVG própria, paleta única, personagem modular por camadas (corpo/pele, cabelo, olhos, roupa, calçado, acessório), 8 tons de pele. Abu em SVG com animações CSS (piscar, cauda, sentar, celebrar, dormir). Mapa = SVG com 7 edifícios clicáveis. `prefers-reduced-motion` + opção.
- Áudio: efeitos sintetizados WebAudio (sem ficheiros) + música ambiente curta CC0 se houver; opção on/off/volume.
- Persistência: localStorage `save.v1` com migração, exportar/importar JSON.

## Núcleo educativo (`src/core`)
- `Exercise` = união discriminada: `mcq | numeric | text | order | match | cloze`. Cada um com `check(answer) -> {ok, partial?, feedback}`.
- Banco `content/<disciplina>/*.ts`: competências (ano, domínio, tema, descritor AE, pré-requisitos), exercícios autorais + geradores (seeded RNG) com variantes conceptuais; cada exercício tem pistas[], explicação, erros frequentes.
- Sessão: `buildSession(mode, tema, n, estado)` escolhe exercícios por competência, sem repetir enunciado/assinatura, mistura formatos.
- Modos: Estudar (pistas, retry), Teste (sem pistas, nota 0–20, relatório por competência), Rever (competências fracas/vencidas, intervalos 1/3/7/14 dias).
- Adaptação por competência: nível 0–4 (A descobrir→Bem consolidado/A rever) a partir de tentativas, pistas usadas, acertos recentes; regras explícitas; um erro não baixa tudo.
- Estrelas: base por conclusão + bónus melhoria/novas competências; limite diário por competência (anti-farm); loja só personalização.

## Ecrãs
Boas-vindas → onboarding (ano, personagem, Abu) → Centro (mapa) → Sala (config) → Sessão → Resultado → Loja/Perfil(Personalizar/Loja/Coleção) → Conquistas → Minijogo memória → Opções/Progresso.

## Conteúdo demo
Matemática 6.º ano e Português 6.º ano: ~6 temas cada, derivados das AE da DGE, ≥ 8–10 variantes por tema.

## Testes
Vitest para core (correção, nota, repetição, adaptação, loja, migração). Playwright 3 viewports + capturas + consola.

## Divisão
Claude: arquitetura, núcleo, integração, verificação. Codex: conteúdo pedagógico (geradores + banco), testes core, arte SVG complementar, revisão.
