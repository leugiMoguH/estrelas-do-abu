# Validação local V2 — 2026-11-01

- Base: branch `redesign/art-v1`, checkpoint `c9ca1a8`, tag anterior `hgp-fabrica-v2-wip`.
- `node scripts/kb-integrar-verificacao.mjs`: 96 revisões integradas; cinco correções restritas identificadas como autoverificação.
- `node scripts/kb-evidencia.mjs`: 117 fichas F, 77 confirmadas; complemento X1–X6 preservado separadamente e documentado na ficha.
- `node scripts/kb-verificar-fontes.mjs`: 248 URLs, 248 erros de acesso. Não se confirmou nova leitura externa. Os atestados anteriores conservam o excerto e a ligação.
- `npm.cmd test`: **1044 testes passados, 19 ficheiros**. Depois da última alteração do QA: **10 testes específicos passados** (kb-xviii e qa-v2).
- `npx.cmd tsc --noEmit`: passou, incluindo a versão final dos testes e2e.
- `npm.cmd run build`: passou. Aviso existente de bundle superior a 500 kB; sem dependências novas.
- `npm.cmd run e2e`: **48 passados, 3 ignorados**, 6,1 min, viewports 390×844, 820×1180 e 1280×800. Os ignorados exigem o modo especial `hgp-e2e` (mcq/order/figura com ids forçados).
- `npm.cmd run e2e -- tests/e2e/fabrica-v2.spec.ts`: **3 passados**, 19,9 s. Exercício real de interpretação de resumo sobre irmandades/Palmares, resposta certa, referência no Save, competências persistidas e ausência de scroll lateral/erros de página.
- Capturas dos três viewports inspecionadas em `test-results/fabrica-v2-*/fabrica-v2-resumo.png`. Texto e opções legíveis; o telemóvel exige scroll vertical. A captura móvel apanhou a transição de entrada, sem perda de conteúdo.
- Falhas encontradas e resolvidas: asserções com contagens antigas; expectativa de primeira pergunta fixa apesar da rotação entre dois itens adequados; teste esperava «Correto» onde a interface apresenta «Muito bem». Não se alterou a UI para satisfazer os testes.
- `git diff --check`: sem erros de whitespace.

## Resultados e limites

96 conhecimentos atuais, 89 elegíveis, 7 em revisão documental. Seis átomos anteriores retirados e seis do legado africano acrescentados. Banco gerado: 330 → 279; elegíveis: 330 → 255 (221/23/11 por dificuldade). Incluindo 69 manuais ativos, 399 → 324. Detalhe e justificação em README/cobertura.json.

Autoverificação estratificada de 15 moldes; não é auditoria independente dos moldes nem revisão docente. Os 69 manuais conservam a validação anterior. Não houve teste com a criança. Capoeira/samba/Valongo não foram acrescentados à fábrica; continuam pendentes de leitura suficiente.

## Publicação

Bloqueada: `git ls-remote origin refs/heads/gh-pages` falhou com `Failed to connect to github.com port 443`. O checkpoint também foi bloqueado: `git add` falhou ao criar `.git/index.lock` com `Permission denied`. Não se tentou contornar nenhum bloqueio. Não há commit/tag novos. O worktree gh-pages e a demo pública não foram alterados. Não há hash novo de publicação nem confirmação pública da V2.

Artefacto local: `dist/assets/welcome-JF23XNf6.js`; SHA-256 `d2fb2ead0b1a4ce5c387a60eb3e69fcf68160c97be45316a6a8b9df89cae2bdf`. Isto identifica o build local, não uma publicação.

Alvo autorizado, ainda não confirmado com V2: https://leugimoguh.github.io/estrelas-do-abu/preview/e/

Próximo passo: com escrita autorizada em `.git` e rede, criar commit/tag, push da branch, backup `preview/e` → `e-prov6`, publicação isolada e verificação pública nos três viewports. A mensagem de commit preparada em `.claude/tmp/commit-v2.txt` contém os dois trailers exigidos. Checkpoint atual permanece `c9ca1a8`; a tag `hgp-fabrica-v2` não foi criada.
