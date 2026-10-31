# Interface D — verificação visual

Fluxo reproduzível: `node tests/shots/f1.mjs`, com `npm run preview -- --port 4173` em execução após o build.

42 capturas do percurso em 390×844, 820×1180 e 1280×800, abertas e inspecionadas: boas-vindas, três separadores do onboarding, mapa, sala de Matemática, tutor, exercício Estudar, resultado, loja, personagem, conquistas, progresso e opções.

Resultados automáticos em `report.json`: zero erros de consola, zero scroll horizontal, menor dimensão dos hotspots ativos 46,09 px; seis pares principais da paleta com contraste mínimo 9,53:1. Este cálculo verifica a paleta, não constitui uma auditoria integral de acessibilidade. As 12 comparações `?tema=atual|a|b|d` preservaram o conteúdo de `eda:save:v2`.

Corrigido durante a inspeção: CTA sticky sobrepunha cartões na sala; legendas de fieldsets perdiam contraste no limite entre papel e fundo escuro; atalhos da praça eram retângulos sem identificação; painel de pré-visualização do onboarding esticava até à altura de todos os controlos; separadores novos tinham acentos incorretos; grupo de óculos vazio no onboarding. A área de toque do minijogo foi ampliada para respeitar 44 px no telemóvel.

Biblioteca e Laboratório dos Números coincidem com os edifícios grandes inferiores; cinco etiquetas «Em breve» coincidem com os edifícios superiores. A imagem da praça não contém lojas desenhadas: os três atalhos têm ícones SVG sobre os pontos indicados. A personagem e o Abu assentam no pavimento das boas-vindas com sombra de contacto.

Limitação visual restante: a loja com todos os artigos exige bastante scroll vertical; o filtro existente permite reduzi-lo. Sem cortes ou sobreposições bloqueantes observados. Validação pela criança ainda não realizada.

Não foram alteradas as chaves de armazenamento nem acrescentadas dependências. As alterações pré-existentes do Abu foram preservadas.

Verificações finais: `npx tsc --noEmit` sem erros; `npm test` 67/67 em 7 ficheiros; `npm run build` aprovado (155 módulos); `npx playwright test` 24/24 em 3,0 minutos. Uma execução anterior teve 23/24, com timeout no arranque do percurso desktop enquanto se reconstruía o build; duas execuções posteriores completas passaram 24/24. Foram usados os executáveis `.cmd` de npm/npx, pois o PowerShell bloqueia os wrappers `.ps1`.
