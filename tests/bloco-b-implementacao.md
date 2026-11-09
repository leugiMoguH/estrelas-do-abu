Bloco B, incrementos 1+2 — implementação em 2026-11-09

Branch: redesign/art-v1. Sem commit, push ou publicação.

Decisões implementadas:
- Tipos editoriais partilhados em content/estrutura.ts; árvore parametrizada em src/app/subject-tree.ts, com compatibilidade dos exports HGP em hgp-tree.ts. IDs e dados HGP conservados; expectativas dos testes HGP não alteradas.
- Matemática: 4 capítulos, 27 subcapítulos, todos editorial trabalho e com referências às linhas das AE. 19 subcapítulos com exercícios; 8 em preparação.
- Integração dos 10 temas, 61 geradores e 10 lições existentes: catálogo total de 28 temas (18 anteriores + 10), Matemática com 13 temas, 70 geradores e 13 lições. Sem conteúdo novo.
- Mapa explícito templateId → sectionId; a referência persistida do exercício determina a filtragem nos três modos. Sem alteração de IDs, versão do pack, chaves Save ou cálculo de mastery por competência.
- As lições amplas continuam acessíveis no tutor, mas não atribuem disponibilidade de lição a todos os subcapítulos. Nenhum subcapítulo real ficou só com lição; a regra desse estado está implementada e testada: Estudar abre tutor, Teste/Rever indisponíveis.
- Temas de Matemática com level 6; filtro genérico remove escolhas ocultadas. Matemática usa a árvore e não depende desse filtro.
- Chaves das coleções mantêm a normalização existente e distinguem subcapítulos da mesma competência.
- Referências AE longas quebram dentro da árvore de Matemática; corrigido overflow de 5 px encontrado no tablet.

Verificações finais:
- npx.cmd tsc --noEmit: sem diagnósticos, exit 0.
- npm.cmd test (vitest run): 26 ficheiros aprovados, 1097/1097 testes, duração 92.49 s. Baseline: 1090; 7 testes unitários novos.
- npm.cmd run build: exit 0; aviso Vite sobre chunks acima de 500 kB. Build normal reposto depois do build especial.
- npx.cmd playwright test 'tests/e2e/hgp*.spec.ts' 'tests/e2e/demo*.spec.ts' tests/e2e/matematica.spec.ts: 32 aprovados, 1 falha, 3 ignorados, 8.4 min. A falha foi no percurso demo do telemóvel após recarregar (botão Continuar não apareceu), durante reconstruções concorrentes dos assets. Atribuição à concorrência é uma inferência; não um defeito de produto reproduzido.
- Repetição isolada: npx.cmd playwright test tests/e2e/demo.spec.ts --project=telemovel-390x844 --grep 'percurso completo': 1 aprovado, 8.1 s.
- Após npx.cmd vite build --mode hgp-e2e e preview local, npx.cmd playwright test tests/e2e/hgp.spec.ts --grep 'mcq, order': 3 aprovados, 34.8 s. São os três casos ignorados no build normal.
- Resultado agregado: cada um dos 36 casos e2e teve execução aprovada; NÃO houve uma única execução do conjunto principal inteiramente verde. Nenhum teste HGP teve expectativas alteradas. Matemática passou nos três viewports, incluindo ausência de scroll lateral, preparação desativada e retorno à seleção.
- git diff --check: limpo.

Ficheiros de implementação/teste alterados ou criados:
content/estrutura.ts
content/historia/estrutura.ts
content/matematica/estrutura.ts
content/index.ts
content/tutor/index.ts
src/app/subject-tree.ts
src/app/hgp-tree.ts
src/app/section-selection.ts
src/app/room.ts
src/app/session.ts
tests/content/gamePack.test.ts
tests/content/tutor.test.ts
tests/content/mat-estrutura.test.ts
tests/e2e/matematica.spec.ts
tests/bloco-b-implementacao.md (este relatório)

Pendências: revisão de Claude; se for exigida uma única execução E2E integral sem falhas/ignorações, repetir o conjunto num ambiente sem reconstruções concorrentes e executar os casos especiais no respetivo build. Não se declara validação pedagógica humana dos conteúdos.
