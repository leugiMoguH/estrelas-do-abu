# Fábrica de conhecimento e exercícios — primeiro caso: HGP «Portugal no século XVIII»

Estado: 2026-10-31. Nada aqui é validação de especialista (ver «Revisão»).

## Arquitetura (implementada, `content/kb/`)
`Disciplina → Ano → Competência → Capítulo → Subcapítulo → Conhecimento → Exercícios`
- `schema.ts` — tipos partilhados por todas as disciplinas: `Atom` (conhecimento), `KbExercise`, 3 níveis (inicial/intermédio/avançado) e 9 tipos de raciocínio.
- `historia/xviii.atoms.ts` — 96 **conhecimentos** (id estável, pergunta, resposta, frase com lacuna, distratores falsos, competência, subcapítulo, **evidência** = ids `Fn` da ficha factual). Só factos *CONFIRMADO* (≥2 fontes).
- `historia/xviii-evidencia.json` — estado, texto e fontes de cada `Fn`, extraídos da ficha por `scripts/kb-evidencia.mjs` (o jogo não depende de PDF ou página externa).
- `factory.ts` — gera exercícios **diferentes**, não reformulações: reconhecer, verificar frase, recordar (livre), calcular intervalos, ordenar cronologias e cadeias causais, comparar, exceção/classificação, «qual é a falsa», casos de inferência. Determinístico (mesmo input → mesmos exercícios); nenhum facto é inventado em jogo.
- `qa.ts` — controlo de qualidade (testado em `tests/content/kb-xviii.test.ts`).
- `content/historia/bank-h.ts` — liga os exercícios ao jogo (mesmo formato dos bancos manuais; sem alterar a interface).
- Reutilizável: outra disciplina escreve os seus átomos + moldes (Matemática: regras e cálculo verificado por segunda via) e reutiliza schema, níveis e `qa.ts`.

## Controlos automáticos (todos a zero erros)
Átomo: ficha existe, está CONFIRMADA, ≥2 fontes, o ano/resposta consta do texto da ficha. Exercício: ids únicos; opções únicas e sem a resposta no enunciado; correta entre as opções; explicação contém a resposta; ≥2 pistas; ordem consistente; níveis coerentes (inicial = 1 conhecimento, avançado = ≥2 ou cálculo com datas completas); repetições (mesmo molde+conhecimento; enunciados com sobreposição ≥0,85, distinguindo «repetida» de «ambígua»); equivalência com perguntas manuais existentes; viés «a correta é a mais longa». Sessões: 8 sessões consecutivas sem repetir enunciados nem o mesmo conhecimento na sessão, com rotação.

## Resultados
- **96 conhecimentos → 330 exercícios** (61 iniciais, 233 intermédios, 36 avançados). 190 de foco distinto (96 de um facto + 93 multi-facto + 1 caso de um facto) e 140 variantes de formato (verificar frase 96, resposta livre 44) — as variantes **não** contam como exercícios distintos.
- Cobertura: `cobertura.json`. Todos os subcapítulos principais têm os 3 níveis; **legado africano só tem 4** (faltam factos CONFIRMADOS com 2 fontes) e «novas culturas» não foi tocado.
- Esforço: ≈ 3,5 exercícios por conhecimento; cada conhecimento novo custa 1 entrada de dados (~6 linhas) + verificação na ficha; os moldes multi-facto custam ~10 linhas cada.

## Licenças e fontes
- **#EstudoEmCasa@ (estudoemcasaapoia.dge.mec.pt): licença contraditória.** A página «Participar» declara CC BY-SA 4.0; o rodapé liga a **CC BY-NC 4.0** e a política do sítio proíbe uso comercial; há materiais de terceiros creditados (ex.: fichas 5 e 8). Conclusão prudente: tratar como **não comercial/indefinido** → **nenhum texto, imagem ou exercício copiado**; usado só como referência curricular e fonte de factos (factos não são protegidos). A premissa «CC BY-SA» não pôde ser confirmada. Esclarecer com a DGE antes de qualquer uso comercial.
- Aprendizagens Essenciais HGP 6.º (DGE): referência dos descritores.
- Fontes de factos na ficha (Wikipédia PT/EN CC BY-SA, Infopédia, UNESCO, PDFs académicos): apenas factos; explicações e enunciados são originais. Se algum texto for reproduzido no futuro, aplica-se a licença da fonte (BY-SA exige atribuição e partilha igual).
- Ferramentas avaliadas, **não instaladas** (não resolvem melhor do que 120 linhas de TypeScript neste volume): `pypdf` (BSD, extração de PDF); `sentence-transformers` + MiniLM multilingue (Apache-2.0, deteção semântica de duplicados — reavaliar acima de ~2000 exercícios); `RapidFuzz` (MIT, gralhas). Pesquisa por Codex, sem execução local.

## Revisão
- **Revisão independente parcial por Codex (leitura, 2026-10-31):** recalculou os 18 intervalos, as 2 idades e as 28 ordenações (sem erros aritméticos). Defeitos confirmados e **corrigidos**: (1) as Cortes voltaram a reunir-se em 24/1/1821, não em 1820 (erro também na ficha F44 — corrigida); (2) caso do aqueduto concluía «resistiu/pronto» sem base nas datas — reescrito para o que as datas permitem; (3) exceções de datas (Pombal, 1750) eram demasiado fáceis para o nível 3 — passaram a nível 2; (4) exceções repetiam o mesmo foco com outros distratores — cada exceção só aparece uma vez (338 → 330 exercícios).
- **Não verificado por Codex:** validação histórica externa integral dos 96 conhecimentos e dos distratores; aceitação de respostas livres na interface. Permanece **pendente** uma revisão humana/especialista.

## Limitações
- Os factos vêm da ficha (fontes lidas em parte por excertos): **conhecimento «confirmado» ≠ validado por especialista**.
- Distratores são revistos pelo autor; a máquina garante unicidade, não verdade.
- Duplicados semânticos: sobreposição de palavras + chave estrutural; sem modelo de embeddings.
- A adaptação do jogo continua por tema (competência = tema); cada exercício já regista competência, nível e raciocínio, mas a adaptação por competência exige alterar o motor (próximo bloco).
