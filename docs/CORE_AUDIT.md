# Auditoria ao núcleo (src/core) — 2026-10-30

Método: leitura dos 8 módulos. Os 37 testes não foram tomados como prova.

## Suporta hoje
| Requisito | Estado |
|---|---|
| Competência com ano/disciplina/domínio/tema | Campos existem (`Competency`); **sem registo, versão curricular nem validação de pré-requisitos** |
| Expansão 5.º–12.º | `grade:number` livre; nada o impede, nada o prepara (sem pacote de conteúdo versionado) |
| Banco extensível | **NÃO**: `pool: Exercise[]` estático, resposta fixa no exercício |
| Geração parametrizada | **NÃO existe** (sem gerador, sem seed por exercício, sem verificador independente) |
| Formatos | mcq/numeric/text/order/cloze. `grade` é uma cadeia if/else fechada: novo formato = editar o núcleo. Sem associar (`match`), sem texto-base (`stimulus`) para Português, sem imagem/mapa |
| Anti-repetição | Só **dentro da sessão** (id + enunciado). Sem memória entre sessões; sem noção de conceito/família; ids estáticos |
| Adaptação por competência | Sim, em `session.rank` (alvo 1/2/3 por competência) e `mastery`; simples mas explícita |
| Explicação/pistas/erros | Existem. `commonErrors` só casa texto exato normalizado (não casa `1/2` vs `0,5`). **Não há registo de erros** para «estudar os erros depois» |
| Importação externa | **NÃO**: sem esquema/validador de exercícios; `Save` válido só v1 |
| Diversidade por seleção | `rng` só desempata; com banco pequeno a mesma ordem repete-se |

## Lacunas estruturais a corrigir (só estas)
1. Pacote de conteúdo versionado (`ContentPack`) + `validatePack` (ids únicos, pré-requisitos existentes, mcq sem duplicados e com resposta, cada exercício resolve-se com a sua própria resposta).
2. Geradores: `ExerciseTemplate` com `generate(seed, level)` determinístico, `conceptId` (família conceptual), verificador independente opcional, estado de revisão (`auto-verified` | `needs-human-review`).
3. `ExerciseRef {templateId, seed}` para regenerar exercícios (erros e histórico sem guardar funções).
4. Registo de formatos (`registerKind`) em vez de if/else; adicionar `match` e `stimulus`.
5. Save v2: histórico `seen` por conceito/assinatura + `mistakes[]`; migração v1→v2.
6. Sessão: penalizar conceitos/assinaturas vistos recentemente entre sessões; diversidade de conceito e formato.
7. Simulação medida (muitas sessões), exemplos por competência, dificuldade, auto-verificação, e teste que acrescenta uma competência sem tocar no núcleo.

## Fora de âmbito agora
Conteúdo do 5.º–12.º, GIFT/Moodle XML (só se a pesquisa mostrar ganho), Português com textos licenciados em grande escala.
