# Relatório de qualidade pedagógica — HGP 6.º ano

Gerado por docs/audit/build-audit.cjs a partir dos dados reais. Data: 2026-10-31. Revisão independente do Codex: NÃO ocorreu (as chamadas ao Codex foram bloqueadas pelo classificador de permissões); a auditoria foi feita só por Claude. Conteúdo não certificado por professor nem por organismo oficial.

## Contagens
- Itens: 151 (132 originais + 19 novos). Lições: 11. Fontes registadas: 132.
- Itens lidos integralmente (enunciado, opção correta, todas as opções erradas, pistas, explicação, figura, fonte): 151 de 151. Lições lidas: 11 de 11.
- Estado: ok 112, corrigido 12, a-confirmar 8, novo 19.
- Itens com problema comprovado e corrigido: 13 dos 132 originais (9,8%). Itens retirados: 0. Itens a confirmar mantidos: 8.
- Verificação: conhecimento-do-revisor+coerencia-interna (fonte do banco não reaberta): 125; fonte-consultada-nesta-auditoria: 18; por-confirmar: 8.
- Fontes por pesquisa nesta auditoria: INE (comércio externo 2024, Censos 2021), Governo/AMT (portos 2024), INE/ANA (aeroportos 2024), Turismo de Portugal (ET27), Museu do Aljube, U.Porto, UNESCO, Marinha, Min. Educação (liceus). Muitas foram lidas só nos resumos devolvidos pela pesquisa, sem abrir o documento primário.

## Cobertura curricular
Ver matriz-curricular.md. Descritores transcritos: 65. Coberto 28 (43,1% de 65; 45,9% de 61 sem TIC/TIG; 49,1% de 57 sem TIC/TIG nem «A confirmar»). Parcialmente coberto 23, Não coberto 10 (6 sem TIC/TIG), A confirmar 4.
Principais lacunas (Não coberto): XVIII-4 (Evidenciar a importância da introdução da batata e do milho …); XIX-1 (Identificar medidas de modernização da agricultura e os seus…); XIX-3 (Exemplificar aspetos da modernização dos meios de comunicaçã…); LUG-6 (Identificar ações para solucionar ou mitigar problemas socia…); LUG-8 (Reconhecer características ambientais, sociais, culturais e …); ATV-2 (Utilizar representações cartográficas na análise da distribu…).

## Variedade dos exercícios
- Formatos: {"mcq":101,"order":16,"numeric":24,"cloze":10}. Competências: {"personagem":9,"facto":28,"conceito":23,"causa":13,"vf":11,"fonte":11,"opiniao":11,"cronologia":20,"comparacao":12,"consequencia":8,"mapa":5}. Dificuldade 1/2/3: {"1":45,"2":83,"3":23}.
- Escolha múltipla com 3 opções (33% de acerto ao acaso): 8 de 101.
- Escolha múltipla em que a opção correta é a mais longa: 55 de 101 (54,5%): enviesamento ligeiro.
- Tarefa «facto vs opinião»: 11 itens (7,3%), um modelo igual em cada tema; a resposta identifica-se pelo adjetivo (melhor, bonito…), sem exigir conhecimento do tema.
- Datas e cronologia: 20 itens de cronologia; várias datas repetem-se em escolha múltipla, ordenação e numérico (ex.: 1856, 1910, 1961, 1986).
- Parque Nacional da Peneda-Gerês aparece em 4 itens (lazer-03, -05, -10, -11).

## Lições vs itens (proxy automático)
Proxy: fração de itens cuja resposta correta tem ≥50% das palavras-chave presentes no texto da lição do tema. É ruidoso (não reconhece itens de cálculo nem de raciocínio) e não prova que a lição ensine.
- hgp-seculo-xviii: 11/14 (78,6%); sem resposta na lição: hgp-seculo-xviii-04, hgp-seculo-xviii-05, hgp-seculo-xviii-06
- hgp-liberalismo: 11/14 (78,6%); sem resposta na lição: hgp-liberalismo-01, hgp-liberalismo-04, hgp-liberalismo-13
- hgp-xix-segunda-metade: 11/14 (78,6%); sem resposta na lição: hgp-xix-segunda-metade-04, hgp-xix-segunda-metade-07, hgp-xix-segunda-metade-09
- hgp-republica: 13/14 (92,9%); sem resposta na lição: hgp-republica-07
- hgp-ditadura: 11/13 (84,6%); sem resposta na lição: hgp-ditadura-03, hgp-ditadura-07
- hgp-25-abril: 13/14 (92,9%); sem resposta na lição: hgp-25-abril-06
- hgp-populacao: 10/15 (66,7%); sem resposta na lição: hgp-populacao-06, hgp-populacao-08, hgp-populacao-09, hgp-populacao-10, hgp-populacao-11
- hgp-lugares: 8/13 (61,5%); sem resposta na lição: hgp-lugares-02, hgp-lugares-04, hgp-lugares-08, hgp-lugares-09, hgp-lugares-10
- hgp-atividades: 8/12 (66,7%); sem resposta na lição: hgp-atividades-05, hgp-atividades-08, hgp-atividades-09, hgp-atividades-11
- hgp-lazer: 12/14 (85,7%); sem resposta na lição: hgp-lazer-08, hgp-lazer-12
- hgp-mundo: 12/14 (85,7%); sem resposta na lição: hgp-mundo-10, hgp-mundo-14

## Testes e modos
- Seleção de itens: classificação por dificuldade-alvo, penalização de repetição e de competência já escolhida (distribui pelos temas); não estratifica por competência (descritor), por isso um teste de 3–8 perguntas não avalia todos os temas escolhidos.
- Nota: média dos créditos × 20; com 3 ou 5 perguntas cada resposta vale 6,7 ou 4 pontos. «Dominada» resulta de ≥80% numa competência, mesmo com 1 pergunta.
- Teste sem pistas confirmado no código; explicação só no fim.
- Todos os itens têm review='approved' no motor (condição para serem servidos); isto não significa revisão por docente.

## Itens corrigidos / a confirmar
- hgp-liberalismo-03 [corrigido]: Opção «apoiantes do rei D. Pedro» imprecisa (D. Pedro não era rei de Portugal em 1832): reescrita.
- hgp-liberalismo-06 [corrigido]: Excerto atribuído ao «Manifesto aos Portugueses» não foi confirmado em nenhuma fonte: substituído pelo art. 26.º da Constituição de 1822 (texto confirmado).
- hgp-xix-segunda-metade-06 [a-confirmar]: Citação atribuída a Ana Silvia Volpi Scott (2002): confirmar na fonte (REBEP).
- hgp-xix-segunda-metade-12 [corrigido]: «Pioneiro» afirmado sem fonte primária: passou a «um dos primeiros países da Europa».
- hgp-populacao-01 [corrigido]: Gralha na pista («IMigrante»).
- hgp-populacao-10 [corrigido]: Afirmação «todos os concelhos de Bragança perderam população» sem fonte: reduzida ao que está apoiado (o distrito perdeu população).
- hgp-lugares-01 [corrigido]: Explicação confundia êxodo rural com emigração: corrigida (e na lição).
- hgp-lugares-04 [a-confirmar]: Variação +1,7% da AML (Censos 2021) por confirmar em tabela do INE.
- hgp-lugares-06 [corrigido]: Marcadores ordinais («Primeiro», «Por fim»…) revelavam a ordem: removidos.
- hgp-lugares-08 [a-confirmar]: Resposta lida diretamente no enunciado: passou a exigir um cálculo (diferença de percentagens). Usa os +1,7% da AML, por confirmar em tabela do INE.
- hgp-atividades-05 [a-confirmar]: Comparação com 1960 sem fonte consultada nesta auditoria.
- hgp-atividades-06 [corrigido]: Afirmação «desde 1991 o terciário tem mais de metade» sem fonte: retirada.
- hgp-atividades-07 [a-confirmar]: Setor com mais trabalhadores em 1960 (primário): confirmar em série do INE/PORDATA.
- hgp-atividades-09 [corrigido]: Percentagens atribuídas aos Censos 2021 não confirmadas: substituídas por dados confirmados (INE/GPP, 4.º trimestre de 2025: 2%, 24%, 74%).
- hgp-lazer-06 [a-confirmar]: Cortes de água para o golfe em 2023: fonte jornalística; confirmar em documento oficial.
- hgp-lazer-07 [a-confirmar]: Idem (cadeia causal baseada nos cortes de 2023).
- hgp-lazer-08 [corrigido]: Estratégia Turismo 2027 apresentada como atual: acrescentada a nota da Estratégia Turismo 2035.
- hgp-lazer-12 [a-confirmar]: Idem (afirmação sobre os cortes de 2023).
- hgp-mundo-07 [corrigido]: Segundo espaço do cloze ambíguo e artificial: reformulado com um só espaço.
- hgp-mundo-10 [corrigido]: Quota de Sines (56%) incoerente com o total (47 de 88 milhões de t, ≈53%) e restantes quotas por confirmar: substituída por cálculo com valores confirmados.

## Riscos por resolver
- Descritores transcritos de planificação escolar (PDF oficial da DGE inacessível); 3 descritores por confirmar.
- Itens e lições nunca revistos por docente; dados estatísticos dependem de fontes por reabrir.
- Sem revisão independente por Codex.
- Conteúdo adicional do manual (se o manual tiver temas além das AE) não foi comparado com o manual.
