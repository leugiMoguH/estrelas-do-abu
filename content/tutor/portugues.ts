import type { TutorLesson } from './index';
export const portugueseLessons: TutorLesson[] = [
  {
    id: 'pt-classes', curriculumRef: 'DGE — Aprendizagens Essenciais, 6.º ano: Classes de palavras', review: 'needs-human-review',
    explanation: ['Lê a frase completa: a classe de uma palavra deve ser identificada em contexto.', 'O nome designa seres, objetos, lugares ou ideias. O adjetivo atribui uma propriedade ao nome.', 'O verbo pode exprimir uma ação ou um estado e varia em pessoa, número, tempo e modo.', 'Um advérbio pode modificar um verbo, um adjetivo ou outro advérbio. É invariável.'],
    examples: [
      { title: 'A gata curiosa dorme tranquilamente.', steps: ['«gata» é um nome comum: designa um animal.', '«curiosa» é um adjetivo: caracteriza a gata e concorda com o nome.', '«dorme» é um verbo; «tranquilamente» é um advérbio que indica como a gata dorme.'] },
      { title: 'Os alunos atentos leem bem.', steps: ['«alunos» é um nome comum no plural.', '«atentos» é um adjetivo no masculino plural, em concordância com «alunos».', '«leem» é uma forma do verbo ler; «bem» é um advérbio que modifica «leem».'] },
    ],
    checklist: ['Leio a palavra no seu contexto.', 'Distingo nome, adjetivo e verbo.', 'Reconheço o que o advérbio modifica.'],
    commonErrors: ['Uma palavra que caracteriza um nome é um adjetivo; não a confundas com um advérbio.', 'Não identifiques a classe apenas pela terminação da palavra.'],
  },
  {
    id: 'pt-verbos', curriculumRef: 'DGE — Aprendizagens Essenciais, 6.º ano: Tempos e modos verbais', review: 'needs-human-review',
    explanation: ['Localiza a forma verbal e encontra o infinitivo: por exemplo, «cantou» pertence a cantar.', 'Identifica o tempo. O presente situa a ação no presente ou exprime hábitos; o perfeito apresenta uma ação passada concluída.', 'O imperfeito apresenta uma ação passada habitual ou em curso. O futuro situa a ação depois do momento da fala.', 'Identifica o modo pelo contexto e pela forma: o indicativo apresenta factos; o conjuntivo pode exprimir um desejo; o imperativo dirige pedidos ou instruções.'],
    examples: [
      { title: 'Ontem, a Rita cantou.', steps: ['A forma verbal é «cantou», do verbo cantar.', 'Refere uma ação passada concluída: pretérito perfeito.', 'Está no indicativo e na terceira pessoa do singular.'] },
      { title: 'Espero que os alunos cantem.', steps: ['Observa «cantem», do verbo cantar.', '«Espero que» introduz uma ação desejada: presente do conjuntivo.', '«cantem» está na terceira pessoa do plural e concorda com «os alunos».'] },
    ],
    checklist: ['Encontro o infinitivo.', 'Distingo presente, perfeito, imperfeito e futuro do indicativo.', 'Distingo indicativo, conjuntivo e imperativo pelo contexto.', 'Faço concordar o verbo com o sujeito.'],
    commonErrors: ['Não confundas «cantou» (perfeito) com «cantava» (imperfeito).', 'Uma expressão de tempo não basta: observa também a forma verbal.'],
  },
  {
    id: 'pt-voz', curriculumRef: 'DGE — Aprendizagens Essenciais, 6.º ano: Frase ativa e passiva', review: 'needs-human-review',
    explanation: ['Na frase ativa, identifica o sujeito que pratica a ação e o complemento direto que a recebe.', 'Na transformação para a passiva, o complemento direto passa a sujeito.', 'Usa o auxiliar ser no mesmo tempo e um particípio que concorde com o novo sujeito em género e número.', 'O sujeito da ativa passa a complemento agente da passiva, introduzido por «por». Para voltar à ativa, faz o percurso inverso.'],
    examples: [
      { title: 'A Rita pintou a casa.', steps: ['«A Rita» é o sujeito; «a casa» é o complemento direto.', '«A casa» passa a sujeito feminino singular; «pintou» dá lugar a «foi pintada».', 'Passiva: «A casa foi pintada pela Rita.» Mantém-se o pretérito perfeito.'] },
      { title: 'As cartas serão escritas pelos alunos.', steps: ['«As cartas» é o sujeito da passiva; «pelos alunos» é o complemento agente da passiva.', 'Na ativa, «Os alunos» passa a sujeito e «as cartas» a complemento direto.', 'Ativa: «Os alunos escreverão as cartas.» Mantém-se o futuro do indicativo.'] },
    ],
    checklist: ['Identifico sujeito e complemento direto na ativa.', 'Mantenho o tempo verbal.', 'Faço concordar o particípio com o sujeito da passiva.', 'Reconheço o complemento agente da passiva.'],
    commonErrors: ['Com «as cartas», escreve «escritas», não «escrito».', 'Nem todas as frases podem ser transformadas assim: este processo exige um complemento direto na ativa.'],
  },
];
