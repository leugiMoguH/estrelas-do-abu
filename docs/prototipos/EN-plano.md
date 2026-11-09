# Inglês — vertical slice «O Caso do Abu» (plano, Claude, 2026-11-09)

Autorização do produtor (2026-11-09): **preparar** o slice (conceito, interação, medição, variedade, privacidade). **Não implementar** ainda nem acrescentar infraestrutura. Fonte: `docs/pesquisa/D-ingles.md` (§1 AE/QECR, §3 métodos, §4 medição, §5 áudio, §6 conceito). Exigência: tem de ser muito mais envolvente do que escolher respostas num diálogo, **não pode ser um chat disfarçado de quiz**.

## 1. Mudança face ao conceito da pesquisa
O §6 da pesquisa propunha um «mistério de chat». Mantém-se o mistério e a lacuna de informação, mas **o chat deixa de ser a interface**. A criança investiga um lugar, recolhe provas escritas, organiza-as num quadro e interroga suspeitos com perguntas que constrói. O inglês é a ferramenta da investigação, não a pergunta de um teste.

## 2. Objetivo curricular (um só tema)
- **Tema AE:** rotinas, com horas e lugares da vila. Isto cobre os temas «rotinas», «descrever atividades» e «meios de transporte/lugares».
- **Competências AE 6.º ano (A2):** compreensão escrita («identificar… a informação essencial em textos» curtos); interação escrita guiada (pedir e dar informação); compreensão oral **opcional**.
- **Estruturas-alvo (máx. 3):** presente simples na 3.ª pessoa (*she walks, he has*); perguntas *What time / Where + do/does*; horas (*at half past ten*). Advérbios de frequência (*always, never*) só aparecem como pistas para a contradição.

## 3. Ficção (curta)
Numa visita de estudo a uma vila inglesa, a luneta do Abu desaparece do clube de astronomia na quarta-feira à tarde. Há três suspeitos, cada um com a sua rotina (ex.: a bibliotecária, um aluno, o dono do café). Nomes e enredo finais ficam para a produção, com revisão humana do inglês.

## 4. Interação principal: 4 verbos, nenhum é «escolher a resposta certa»
1. **Explorar:** um mapa da vila com 4 lugares (escola, biblioteca, café, parque). Tocar num lugar mostra 1 ou 2 documentos curtos em inglês: horário, cartaz, bilhete, página de diário, mensagem de telemóvel.
2. **Recolher e arrumar provas (hipóteses livres):** tocar numa frase do documento («*Mr Hill opens the café at 7*») e colocá-la no **quadro do detetive**, uma grelha de *suspeito × hora* na quarta-feira. A colocação é livre e não é avaliada no momento: é uma hipótese. O botão «Confrontar» compara o quadro com as provas e assinala as casas incompatíveis, acendendo as palavras de tempo e de pessoa do texto. Isto evita o quiz de tentativa e erro casa a casa.
3. **Interrogar (construção guiada de perguntas):** as casas vazias do quadro são perguntas por fazer. A criança monta a pergunta com blocos (*What time / Where* · *do / does* · *you / she / he* · *have lunch / go home…*). **O suspeito responde exatamente à pergunta que foi montada:**
   - uma pergunta bem formada, mas diferente da necessária (*Where…?* quando faltava a hora), recebe uma resposta verdadeira que não preenche a casa;
   - uma pergunta mal formada recebe uma reformulação natural («*Sorry? Do you mean "What time does she…?"*»), sem marca de erro;
   - quanto mais casas se preenchem, mais o quadro revela as horas em falta.
4. **Acusar:** escolher o suspeito e ligar **duas provas**. Uma tem de mostrar que o álibi é factualmente impossível (ex.: ela diz «*I was at the park at 4 on Wednesday*» e o cartaz diz «*Park closed all day on Wednesdays*»). A outra tem de ligar a pessoa ao incidente (ex.: o registo do clube diz «*Key borrowed: 3.45 pm*», e outra prova mostra quem foi buscar a chave). Se a ligação estiver errada, o suspeito apresenta o álibi com uma prova e a criança volta a investigar. Não há vidas.

Perguntas válidas mas não essenciais recebem resposta verdadeira (ruído plausível, não castigo). A ordem de investigação é livre.

## 5. Compreensão oral opcional, sem áudio externo
Um «*voicemail*» de um suspeito usa `speechSynthesis` só com uma voz local (`lang` a começar por `en`, `localService === true`). Sem voz local, ou se ela preferir, há o botão «Ver texto», e o uso dele fica registado como ajuda. Todo o resto tem texto sempre visível. Nenhuma API de microfone (`getUserMedia`, `SpeechRecognition`) é chamada e nada sai do dispositivo.

## 6. Medir aprendizagem real (§4 da pesquisa)
- **Pré-teste (forma A, 5 itens, ~2–3 min) antes do caso, e pós-teste (forma B, equivalente) depois.** Cada forma tem:
  - 2 itens de compreensão de um texto de rotina **novo** (hora/lugar);
  - 2 itens de construção de pergunta com blocos num contexto **novo**;
  - 1 item de produção da 3.ª pessoa afirmativa com blocos (*She ___ to school at 8.* com *go/goes/going* entre os blocos).

  Os itens nunca aparecem no caso, e as formas emparelham alvo, dificuldade e formato.
- **Retenção e transferência:** forma C ≥ 7 dias depois, com 1 item de transferência (rotina de férias, mesma estrutura).
- **Resultados por alvo, não por total:** para cada alvo (compreensão, pergunta, 3.ª pessoa), registar A, B e C. Assinalar efeito de teto: quem já acerta tudo em A não serve como prova de ganho. Com 1–2 itens por alvo a medida é grosseira; a retenção ajuda, mas não prova causalidade.
- **Durante o jogo (indicador, não nota):** registar individualmente a 1.ª tentativa de cada uma das 4 perguntas essenciais, as casas incompatíveis no «Confrontar», e as pistas usadas.
- **Ajuda separada de autonomia:** o registo guarda todas as respostas, marcando as autónomas e as com ajuda; os estados usam só as autónomas. Usar o texto por falta de voz local **não** conta como ajuda.
- **Limite honesto:** com uma jogadora isto é monitorização pedagógica, não prova estatística. Não se dirá «aprendeu» sem a forma C.
- O registo é local e só se lê com `?registo`, tal como na F2b.

## 7. Variedade sem chat-quiz
- A variedade vem de 4 verbos diferentes (explorar, arrumar, perguntar, deduzir), com ordem livre. Não há quota imposta: primeiro observa-se se a investigação leva a ler e a perguntar com intenção.
- Cada documento tem um formato visual diferente (horário, cartaz, bilhete, mensagem).
- O mesmo alvo aparece em formas e contextos diferentes (*does she…* no quadro, *she has* num diário, *at half past* num horário), nunca como o item literal repetido.
- **Rejogar:** no slice há 1 caso fixo. Variantes do culpado e das horas ficam como possibilidade posterior, com custo de autoria por variante, e só se a avaliação o justificar.

## 8. Âmbito técnico do futuro protótipo (quando autorizado)
- Isolado como a F2b: `prototipos/en/index.html`, `src/prototipos/en/**`, chave única `eda-proto-en`, sem rede, sem dependências novas, sem tocar `eda`/`eda-e`, nem a app, nem outros protótipos.
- O conteúdo (textos ingleses, itens A/B/C) fica num ficheiro de dados do protótipo validado por teste de esquema. Passa para `content/` só se houver expansão. **Revisão humana do inglês e do PT-PT é obrigatória antes da sessão.**
- Dimensão: 3 suspeitos, **3 lugares**, **4–6 documentos** de 2–3 frases, 4 casas a interrogar, 1 contradição com ligação ao incidente, 15 itens de avaliação (A/B/C × 5). A voz fica limitada ao único *voicemail* (decisão do produtor: compreensão oral opcional). Sessão de 12–15 min.
- Testes: solver do caso (há caminho até à acusação; existe exatamente um suspeito com álibi impossível **e** ligação ao incidente, e nenhum outro cumpre as duas condições), os itens A/B/C não aparecem no caso, nenhuma chamada a APIs de microfone, e2e nos 3 viewports.

## 9. Critério de avaliação (protocolo B §5)
Joga sem ajuda do adulto. As perguntas melhoram ao longo do caso: as últimas saem bem formadas à 1.ª tentativa. Explica a acusação citando as provas. Quer outro caso sem incentivo. Nos resultados por alvo (A/B/C), há ganho onde não havia teto e esse ganho mantém-se em C. Se não cumprir: rever ou abandonar, não expandir.

## 11. Revisão do Codex (só leitura) — decisão de Claude
Aceite: hipóteses livres no quadro com «Confrontar»; dedução com impossibilidade factual e ligação ao incidente, verificada pelo solver; métrica das 4 perguntas individuais; avaliar a 3.ª pessoa afirmativa; resultados por alvo com teto; ajuda separada (texto por falta de voz não conta); 3 lugares e 4–6 documentos; sem quota de alternância nem resumo final.
Rejeitado: cortar a voz por completo. A compreensão oral opcional, sem áudio externo, foi pedida pelo produtor; fica reduzida a um único *voicemail* com texto sempre disponível.

## 10. Riscos
- **A autoria é o gargalo:** os textos A2 controlados precisam de revisão.
- Ela pode montar perguntas por eliminação de blocos. Mitigação: blocos distratores plausíveis (*do/does*, *What time/When/Where*) e indicador da 1.ª tentativa.
- O quadro pode parecer uma ficha se a ficção for fraca. Por isso o mapa e os documentos têm de ter identidade visual e a acusação tem de ter consequência.
- A eficácia é uma hipótese a testar, não uma premissa.
