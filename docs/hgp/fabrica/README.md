# Fábrica Pedagógica V2 — Portugal no século XVIII

Estado local: 2026-11-01. Publicação bloqueada por falta de ligação a github.com:443 e checkpoint bloqueado por escrita negada em `.git/index.lock`. Não há nova validação docente nem auditoria independente dos moldes.

## Evidência

`kb-integrar-verificacao.mjs` integra as 96 revisões anteriores de `verif/resposta-{1,2,3}.json`, conservando veredicto original, URL, tipo, estado de leitura, excerto e caminho do relatório. Cinco redações corrigidas ficam identificadas como aplicação da proposta anterior por autoverificação. Não representam nova revisão independente.

`evidence.ts` conta apenas leituras contextualizadas atestadas em fontes qualificadas. Coincidência de nomes/datas não prova a afirmação. SciELO aloja obras de revistas diferentes, que não são uma única autoria. `verdictOf` prefere `A:<átomo>` à ficha composta: uma ficha PARCIAL não invalida automaticamente uma afirmação mais restrita devidamente sustentada. As fontes de referência foram admitidas como apoio enciclopédico/lexicográfico explícito na revisão anterior; não substituem a leitura contextual. As fontes institucionais e académicas predominam.

O verificador lê evidência factual, por átomo e X1–X6. O relatório `verificacao-fontes.json` distingue erro factual confirmado, evidência insuficiente, fonte inacessível e fonte válida não reconhecida lexicalmente, além do caso sem falha lexical. Mantém o erro original separado da correção. A consulta atual falhou nas 248 URLs: nenhum novo acesso foi confirmado. Leituras anteriores não são apagadas nem convertidas em erros factuais por essa falha.

Conhecimentos: 96 anteriores − 6 retirados + 6 X1–X6 = 96 atuais. São elegíveis 89. Ficam em revisão 7: od-quem, od-diamantes, so-cristao-novo, bp-bomjesus, pl-douro, pl-jesuitas e pl-policia (uma leitura integral qualificada; a outra é excerto). Não foram declarados falsos.

Retirados: ba-methuen-panos, od-tejuco, mj-aq-agua, mj-aq-sismo, bp-brasil e pl-vrsa-func. Corrigidos em âmbito: od-mafra, so-limpeza, mj-biblioteca-fim, bp-estilo e pl-vrsa; corrigidos ainda financiamento na nota mj-biblioteca, datas/escultor/sucessão/distratores e artigos. F44 conserva 1821; F59/F61/F63/F94 estão PARCIAL. Capoeira, samba e Valongo continuam pendentes.

## Exercícios e rubrica

Antes: 330 gerados/ativos (61 iniciais, 233 intermédios, 36 avançados). Agora: 279 gerados (240/27/12), dos quais **255 disponíveis nas sessões normais (221/23/11)**; 24 aguardam evidência de todos os conhecimentos envolvidos. Com os 69 manuais ativos do tema, são 399 → 324 disponíveis. A validação anterior destes 69 manuais não foi refeita.

A redução é deliberada e localizada: removidos intervalos/idades/casos aritméticos, cronologias e comparações aleatórias; exceções e frase-falsa deixam de multiplicar a mesma pergunta pela troca de opções. Entraram seis conhecimentos do legado africano e moldes de processo, afirmação–evidência, documento-resumo, mapa e cronologia temática. A contagem de focos exclui formatos alternativos: 133 gerados, 121 elegíveis. Ver distribuição exata por subcapítulo, competência e molde em `cobertura.json`; inventário completo, incluindo manuais e pendentes, em `itens.json`.

A suspensão afeta sobretudo cronologia, identificação de personagens e localização: diamantes, bandeirantes, cristãos-novos, Bom Jesus e três reformas pombalinas. Permanecem conteúdos seguros de todos os sete subcapítulos temáticos principais; a síntese gerada está suspensa por composição com um conhecimento pendente. A competência mais frequente nas sessões normais é cronologia, 114/255 = 44,7%, abaixo do limite de 45%.

`reasoning.ts` contém a rubrica obrigatória. Recordar, reconhecer, verificar e mapa são nível 1; classificação, períodos e sequências temáticas/causais são nível 2; transferência, causa, avaliação de evidência e interpretação são nível 3. A extensão de um enunciado ou uma conta com datas não promove o nível. Não se impõem três níveis a todos os conhecimentos. Os resumos estão identificados como texto escrito para o jogo e só permitem conclusões positivas.

## Identidade, sessões e persistência

Identidade = enunciado + estímulo normalizados; opções e ordem visual não contam. `variant: string` distingue uma variante pedagógica explícita; `variant: true` assinala apenas formato alternativo, excluído da contagem de focos. `skillId` identifica a competência, separadamente. Históricos WIP com opções no sufixo continuam reconhecidos sem alterar o formato Save.

A progressão por competência fica no envelope AppState, fora do Save v2. Uma competência nova começa no nível 1 mesmo que o tema seja forte. São necessários quatro acertos válidos (ou quatro em cinco), com pouca ajuda e no nível exigido, para subir; uma resposta isolada não prova domínio. Três erros seguidos podem baixar o nível. Conhecimentos falhados favorecem alternativas; revisão espaçada e rotação usam o histórico. Importar/reiniciar limpa competências; o Save anterior, estrelas e compras conservam o formato.

## QA e autoverificação

`qa.ts`: rubrica, artigos incompatíveis, palavras repetidas, distrator que é resposta de outro átomo, pistas lexicais, concentração e elegibilidade. O linter não decide a verdade histórica. Há 47 alertas no inventário completo (`qa.json`): 46 coincidências de respostas em distratores e concentração global de cronologia; no conjunto elegível não há concentração superior a 45%. As coincidências foram lidas como alternativas falsas à pergunta concreta (datas e nomes de outros factos), não como prova de ambiguidade.

Amostra estratificada por molde em `amostra-autoverificacao.json` (15 moldes, três níveis). Autoverificação: conferidos enunciado, opções, explicação, exigência e conhecimento. Defeitos confirmados corrigidos: consequências tautológicas, variantes artificiais de opções, perguntas longas sem raciocínio extra e classificação avançada de simples períodos. Não é validação semântica exaustiva dos distratores nem nova consulta das fontes; não há revisão docente ou teste com a criança.

Ver resultados finais de execução em `validacao-v2.md`. Sem dependências novas e sem alterações na interface da criança. Para reproduzir: `node scripts/kb-integrar-verificacao.mjs`, `node scripts/kb-evidencia.mjs`, `node scripts/kb-verificar-fontes.mjs`, `npm test`, `npx tsc --noEmit`, `npm run build`, `npm run e2e`. Em PowerShell com execução de .ps1 desativada, os lançadores normais são `npm.cmd`/`npx.cmd`.
