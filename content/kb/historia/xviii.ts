import { buildExercises, type Case, type Chain, type Defs, type Pair, type SetDef } from '../factory';
import type { KbExercise } from '../schema';
import { XVIII_ATOMS } from './xviii.atoms';

const pair = (a: string, b: string, sub: string): Pair => ({ id: `par-${a}-${b}`, a, b, sub });
const pairs: Pair[] = [
  pair('mj-mafra-pedra', 'mj-mafra-sagrada', 'monarquia-joao-v'),
  pair('mj-aq-autorizado', 'mj-aq-agua', 'monarquia-joao-v'),
  pair('mj-patriarcado', 'mj-academia', 'monarquia-joao-v'),
  pair('mj-secretarias', 'mj-fidelissimo', 'monarquia-joao-v'),
  pair('mj-morte', 'pl-terramoto', 'sintese'),
  pair('mj-auto', 'pl-terramoto', 'sintese'),
  pair('bp-clerigos-inicio', 'bp-clerigos-torre', 'barroco-patrimonio'),
  pair('bp-porto-unesco', 'bp-mafra-unesco', 'barroco-patrimonio'),
  pair('bp-ouropreto-unesco', 'bp-coimbra-unesco', 'barroco-patrimonio'),
  pair('od-revolta-ano', 'od-diamantes', 'ouro-diamantes'),
  pair('pl-nasc', 'pl-terramoto', 'pombal-lisboa'),
  pair('pl-terramoto', 'pl-vrsa', 'pombal-lisboa'),
  pair('pl-terramoto', 'pl-estatua-ano', 'pombal-lisboa'),
  pair('pl-jesuitas', 'pl-universidade', 'pombal-lisboa'),
  pair('pl-alvara', 'pl-ventre', 'pombal-lisboa'),
  pair('pl-aulas', 'pl-colegio', 'pombal-lisboa'),
  pair('pl-douro', 'pl-atentado', 'pombal-lisboa'),
  pair('mj-inicio', 'mj-morte', 'monarquia-joao-v'),
];

const chain = (id: string, theme: string, sub: string, skill: string, atoms: string[], fichas: string[], steps: string[], why: string, level: 2 | 3 = 2): Chain => ({ id, theme, sub, skill, atoms, fichas, steps, why, level });
const chains: Chain[] = [
  chain('cadeia-ouro', 'o ouro de Minas Gerais', 'ouro-diamantes', 'causa', ['od-decada', 'ba-salvador'], ['F11', 'F6'],
    ['Descobrem-se grandes jazidas de ouro em Minas Gerais', 'Aumenta a procura de africanos escravizados para as minas', 'O porto de Salvador cresce muito'],
    'O ouro de Minas Gerais fez disparar a procura de escravizados, e Salvador, na Bahia, cresceu como porto fornecedor das minas.'),
  chain('cadeia-quinto', 'o quinto e a Revolta de Vila Rica', 'ouro-diamantes', 'causa', ['od-quinto', 'od-fundicao', 'od-revolta'], ['F15', 'F16', 'F17'],
    ['A Coroa cobra o quinto sobre o ouro extraído', 'Criam-se Casas de Fundição para quintar o ouro', 'Estala a Revolta de Vila Rica contra o quinto e as Casas de Fundição'],
    'A Coroa queria o quinto do ouro; para o cobrar usou as Casas de Fundição; o descontentamento levou à revolta de 1720.'),
  chain('cadeia-mafra', 'a promessa de Mafra', 'monarquia-joao-v', 'causa', ['mj-mafra-promessa', 'mj-mafra-pedra', 'mj-mafra-sagrada'], ['F53', 'F54', 'F55'],
    ['D. João V promete um convento se a rainha lhe der descendência', 'Nasce a princesa D. Maria Bárbara (1711)', 'Lança-se a primeira pedra de Mafra (1717)', 'A basílica de Mafra é sagrada (1730)'],
    'A promessa antecedeu o nascimento da princesa (1711); só depois se lançou a primeira pedra (1717) e se sagrou a basílica (1730).', 3),
  chain('cadeia-terramoto', 'o terramoto de 1755', 'pombal-lisboa', 'consequencia', ['pl-terramoto', 'pl-seguiu', 'pl-maia', 'pl-praca'], ['F82', 'F83', 'F88', 'F90'],
    ['Um terramoto atinge Lisboa, a 1 de novembro de 1755', 'Seguem-se um maremoto e incêndios', 'Manuel da Maia coordena a reconstrução da Baixa', 'Constrói-se a Praça do Comércio onde ficava o Paço da Ribeira'],
    'O terramoto e o que se lhe seguiu destruíram a cidade baixa e o Paço da Ribeira; a reconstrução da Baixa deu origem à Praça do Comércio.', 3),
  chain('cadeia-viradeira', 'a morte de D. José I', 'pombal-lisboa', 'consequencia', ['pl-viradeira', 'pl-jose-sucessora'], ['F109'],
    ['Morre D. José I (1777)', 'Sucede-lhe a filha, D. Maria I', 'Pombal é afastado do governo (a «Viradeira»)'],
    'Com a morte de D. José I subiu ao trono D. Maria I e Pombal foi afastado do governo.'),
];

const member = (label: string, why: string, fichas: string[], atoms: string[] = []) => ({ label, why, fichas, atoms });
const sets: SetDef[] = [
  {
    id: 'excecao-joao-v', sub: 'monarquia-joao-v', skill: 'comparacao', count: 6, stem: 'Qual destas obras NÃO foi feita por vontade de D. João V (1706–1750)?',
    summary: 'D. João V morreu em 1750.',
    members: [
      member('O Palácio-Convento de Mafra', 'Nasceu de uma promessa do rei.', ['F53'], ['mj-mafra-promessa']),
      member('A Biblioteca Joanina, em Coimbra', 'Foi paga pelo rei e tem o seu nome.', ['F59'], ['mj-biblioteca']),
      member('A Capela de São João Batista, na Igreja de São Roque', 'Foi encomendada pelo rei em 1742.', ['F60'], ['mj-capela']),
      member('O Aqueduto das Águas Livres', 'Foi autorizado em 1731, no seu reinado.', ['F61'], ['mj-aq-autorizado']),
    ],
    outsiders: [
      member('O alargamento do paço de Queluz', 'Foi obra do infante D. Pedro, em 1747, e não do rei.', ['F67'], ['mj-queluz']),
      member('A Praça do Comércio', 'Foi construída depois do terramoto de 1755, quando o rei já tinha morrido.', ['F90', 'F82', 'F41'], ['pl-praca', 'pl-terramoto', 'mj-morte']),
      member('Vila Real de Santo António', 'Foi fundada por Pombal em 1774, muito depois da morte do rei.', ['F93', 'F41'], ['pl-vrsa', 'mj-morte']),
      member('O Colégio Real dos Nobres', 'Os seus estatutos são de 1761, depois da morte do rei.', ['F104', 'F41'], ['pl-colegio', 'mj-morte']),
    ],
  },
  {
    id: 'excecao-privilegios', sub: 'sociedade-ordens', skill: 'conceito', count: 4, stem: 'Qual destas NÃO era um privilégio das ordens privilegiadas?',
    summary: 'Pagar impostos e sustentar o reino com o trabalho era o encargo do povo.',
    members: [
      member('Receber o dízimo (clero)', 'Era um privilégio do clero.', ['F36'], ['so-clero']),
      member('Ter direito de asilo nas igrejas (clero)', 'Era um privilégio do clero.', ['F36'], ['so-clero']),
      member('Ocupar os altos cargos da administração e do exército (nobreza)', 'Era um privilégio da nobreza.', ['F37'], ['so-nobreza']),
      member('Não pagar impostos (clero e nobreza)', 'Clero e nobreza não pagavam impostos.', ['F36', 'F37'], ['so-privilegiadas']),
    ],
    outsiders: [
      member('Pagar impostos ao rei', 'Era o encargo do povo.', ['F35'], ['so-povo']),
      member('Sustentar o reino com o seu trabalho', 'Era a função do povo.', ['F35'], ['so-povo']),
    ],
  },
  {
    id: 'excecao-pombal', sub: 'pombal-lisboa', skill: 'cronologia', count: 4, level: 2, stem: 'Qual destas decisões NÃO foi tomada depois do terramoto de 1755?',
    summary: 'O terramoto foi em 1755.',
    members: [
      member('A criação da Companhia Geral da Agricultura das Vinhas do Alto Douro (1756)', 'Foi em 1756.', ['F95'], ['pl-douro']),
      member('A expulsão dos Jesuítas (1759)', 'Foi em 1759.', ['F98'], ['pl-jesuitas']),
      member('A criação da Intendência Geral da Polícia (1760)', 'Foi em 1760.', ['F106'], ['pl-policia']),
      member('Os novos Estatutos da Universidade de Coimbra (1772)', 'Foi em 1772.', ['F105'], ['pl-universidade']),
      member('A criação das Aulas Régias (1759)', 'Foi em 1759.', ['F103'], ['pl-aulas']),
    ],
    outsiders: [
      member('A criação das três Secretarias de Estado (1736)', 'Foi em 1736.', ['F46'], ['mj-secretarias']),
      member('A fundação da Academia Real da História Portuguesa (1720)', 'Foi em 1720.', ['F51'], ['mj-academia']),
      member('A elevação da Capela Real a Igreja Patriarcal (1716)', 'Foi em 1716.', ['F47'], ['mj-patriarcado']),
      member('A atribuição do título de Rei Fidelíssimo (1748)', 'Foi em 1748.', ['F52'], ['mj-fidelissimo']),
    ],
  },
  {
    id: 'excecao-1750', sub: 'sintese', skill: 'cronologia', count: 4, level: 2, stem: 'Qual destes acontecimentos foi DEPOIS da morte de D. João V, em 1750?',
    summary: 'D. João V morreu em 1750.',
    members: [
      member('A criação das três Secretarias de Estado (1736)', 'Foi em 1736, antes de 1750.', ['F46'], ['mj-secretarias']),
      member('A fundação da Academia Real da História Portuguesa (1720)', 'Foi em 1720, antes de 1750.', ['F51'], ['mj-academia']),
      member('A elevação da Capela Real a Igreja Patriarcal (1716)', 'Foi em 1716, antes de 1750.', ['F47'], ['mj-patriarcado']),
      member('A atribuição do título de Rei Fidelíssimo (1748)', 'Foi em 1748, antes de 1750.', ['F52'], ['mj-fidelissimo']),
      member('A sagração da basílica de Mafra (1730)', 'Foi em 1730, antes de 1750.', ['F55'], ['mj-mafra-sagrada']),
    ],
    outsiders: [
      member('A criação da Intendência Geral da Polícia (1760)', 'Foi em 1760, depois de 1750.', ['F106'], ['pl-policia']),
      member('A abertura do Colégio Real dos Nobres (1766)', 'Foi em 1766, depois de 1750.', ['F104'], ['pl-colegio']),
      member('A inauguração da estátua equestre de D. José I (1775)', 'Foi em 1775, depois de 1750.', ['F91'], ['pl-estatua-ano']),
      member('A fundação de Vila Real de Santo António (1774)', 'Foi em 1774, depois de 1750.', ['F93'], ['pl-vrsa']),
    ],
  },
];

const mc = (c: Omit<Case, 'correct' | 'wrong'> & { right: string; wrong: string[] }): Case => ({
  ...c, correct: c.right, wrong: Object.fromEntries(c.wrong.map((w) => [w, 'Esta opção não está de acordo com os factos.'])),
});
const cases: Case[] = [
  { id: 'caso-idade-joao-v', sub: 'monarquia-joao-v', skill: 'cronologia', level: 3, reasoning: 'calcular', knowledge: ['mj-nasc', 'mj-morte'], fichas: ['F41'],
    stimulus: 'D. João V nasceu a 22 de outubro de 1689 e morreu a 31 de julho de 1750.', prompt: 'Que idade tinha quando morreu?', correct: 60,
    hints: ['Subtrai os anos, mas vê se já tinha feito anos em 1750.', 'Fazia anos em outubro; morreu em julho.'],
    explanation: 'De 1689 a 1750 são 61 anos, mas em julho de 1750 ainda não tinha feito anos (fazia-os a 22 de outubro). Tinha 60 anos.' },
  { id: 'caso-idade-pombal', sub: 'pombal-lisboa', skill: 'cronologia', level: 3, reasoning: 'calcular', knowledge: ['pl-nasc', 'pl-terramoto'], fichas: ['F79', 'F82'],
    stimulus: 'O Marquês de Pombal nasceu a 13 de maio de 1699. O terramoto foi a 1 de novembro de 1755.', prompt: 'Que idade tinha Pombal quando houve o terramoto?', correct: 56,
    hints: ['Subtrai os anos.', 'Em novembro já tinha feito anos em maio.'],
    explanation: 'De 1699 a 1755 são 56 anos e em novembro já tinha passado o aniversário de maio. Tinha 56 anos.' },
  mc({ id: 'caso-praca-joao-v', sub: 'pombal-lisboa', skill: 'causa', level: 3, reasoning: 'inferir', knowledge: ['mj-morte', 'pl-terramoto', 'pl-praca'], fichas: ['F41', 'F82', 'F90'],
    stimulus: 'D. João V morreu em 1750. A Praça do Comércio foi construída no lugar do Paço da Ribeira, destruído em 1755.', prompt: 'Foi D. João V que mandou construir a Praça do Comércio?',
    right: 'Não: foi construída depois do terramoto de 1755, quando o rei já tinha morrido',
    wrong: ['Sim: foi uma das grandes obras do seu reinado', 'Sim: o rei mandou construí-la antes do terramoto', 'Não se pode saber com estes dados'],
    hints: ['Compara as duas datas.', 'Uma obra feita depois de 1755 pode ser de quem já morreu em 1750?'], explanation: 'O Paço da Ribeira só foi destruído em 1755 e a Praça foi feita depois; D. João V tinha morrido em 1750.' }),
  mc({ id: 'caso-aqueduto-antes', sub: 'monarquia-joao-v', skill: 'cronologia', level: 2, reasoning: 'inferir', knowledge: ['mj-aq-agua', 'pl-terramoto'], fichas: ['F61', 'F82'],
    stimulus: 'A água do Aqueduto das Águas Livres chegou a Lisboa em 1748. O terramoto foi em 1755.', prompt: 'O que se pode concluir com segurança?',
    right: 'A água já chegava a Lisboa sete anos antes do terramoto',
    wrong: ['O aqueduto só começou a funcionar depois do terramoto', 'A água só chegou a Lisboa para a reconstrução da Baixa', 'O aqueduto foi mandado fazer por Pombal'],
    hints: ['Compara 1748 com 1755.', 'Quantos anos separam as duas datas?'], explanation: 'A água chegou a Lisboa em 1748, sete anos antes do terramoto de 1755 (1755 − 1748 = 7); a autorização do aqueduto já era de 1731, no reinado de D. João V.' }),
  mc({ id: 'caso-escravizado-1762', sub: 'pombal-lisboa', skill: 'consequencia', level: 3, reasoning: 'inferir', knowledge: ['pl-alvara', 'pl-ambito'], fichas: ['F99', 'F101'],
    stimulus: 'Em 1762, um homem escravizado desembarca em Lisboa, trazido do Brasil.', prompt: 'Segundo o alvará de 1761, o que lhe acontecia?',
    right: 'Ficava livre, por ter desembarcado no Reino', wrong: ['Era devolvido ao Brasil', 'Continuava escravizado, mas com direitos', 'Era entregue à Inquisição'],
    hints: ['O alvará proibiu trazer escravizados para o Reino.', 'Pensa no que acontecia a quem desembarcasse em Portugal.'], explanation: 'O alvará de 19 de setembro de 1761 proibiu trazer escravizados das colónias para o Reino: quem desembarcasse em Portugal ficava livre.' }),
  mc({ id: 'caso-ventre-livre', sub: 'pombal-lisboa', skill: 'consequencia', level: 3, reasoning: 'inferir', knowledge: ['pl-ventre', 'pl-ambito'], fichas: ['F100', 'F101'],
    stimulus: 'Em 1780, nasce em Lisboa o filho de uma mulher escravizada.', prompt: 'Segundo a lei de 1773, esse menino era…',
    right: 'livre, por ter nascido no Reino depois da lei', wrong: ['escravizado, como a mãe', 'livre apenas se o dono quisesse', 'escravizado até aos 21 anos'],
    hints: ['Qual era o princípio do «ventre livre»?', 'A lei é de 1773 e ele nasceu em 1780.'], explanation: 'A lei de 16 de janeiro de 1773 declarou livres os filhos de escravas nascidos no Reino depois dessa data.' }),
  mc({ id: 'caso-ventre-brasil', sub: 'pombal-lisboa', skill: 'comparacao', level: 3, reasoning: 'inferir', knowledge: ['pl-ventre', 'pl-ambito'], fichas: ['F100', 'F101'],
    stimulus: 'Em 1780, nasce no Brasil o filho de uma mulher escravizada.', prompt: 'A lei de 1773 tornava esse menino livre?',
    right: 'Não: as leis só se aplicavam ao Reino e a escravatura continuou no Brasil', wrong: ['Sim: a lei valia em todo o império', 'Sim, mas só na Bahia', 'Sim, mas só nas zonas das minas'],
    hints: ['Onde se aplicavam as leis de 1761 e 1773?', 'Compara com o menino nascido em Lisboa.'], explanation: 'As leis de 1761 e 1773 aplicavam-se apenas ao Reino (Portugal europeu); no Brasil e em África a escravatura continuou.' }),
  mc({ id: 'caso-cristao-novo-1780', sub: 'sociedade-ordens', skill: 'consequencia', level: 3, reasoning: 'inferir', knowledge: ['so-lei-1773', 'so-cristao-novo'], fichas: ['F102', 'F38'],
    stimulus: 'Em 1780, um cristão-novo e um cristão-velho comparecem perante a lei.', prompt: 'A lei tratava-os de forma diferente?',
    right: 'Não: a distinção legal tinha acabado em 1773', wrong: ['Sim: a distinção legal só acabou em 1820', 'Sim: a limpeza de sangue continuou a ser exigida por lei até 1800'],
    hints: ['Recorda a lei de 1773.', 'Compara 1780 com 1773.'], explanation: 'A Carta de Lei de 25 de maio de 1773 acabou com a distinção legal entre cristãos-novos e cristãos-velhos.' }),
  mc({ id: 'caso-sem-cortes', sub: 'monarquia-joao-v', skill: 'consequencia', level: 3, reasoning: 'inferir', knowledge: ['so-cortes', 'mj-inicio', 'mj-morte'], fichas: ['F44', 'F42', 'F41'],
    stimulus: 'As últimas Cortes antes do liberalismo reuniram-se em 1697–1698 e só voltaram a reunir-se com a revolução liberal, já no século XIX.', prompt: 'O que se conclui sobre o reinado de D. João V (1706–1750)?',
    right: 'Não se reuniram Cortes durante o seu reinado', wrong: ['As Cortes reuniram-se todos os anos', 'As Cortes reuniram-se depois do terramoto de 1755', 'As Cortes reuniram-se em 1730 para sagrar a basílica de Mafra'],
    hints: ['Compara os anos do reinado com o intervalo sem Cortes.', '1706–1750 está dentro do intervalo sem Cortes (a partir de 1698)?'], explanation: 'Entre 1698 e a revolução liberal não houve Cortes; o reinado de D. João V (1706–1750) cabe nesse intervalo.' }),
  mc({ id: 'caso-bispo', sub: 'sociedade-ordens', skill: 'conceito', level: 2, reasoning: 'classificar', knowledge: ['so-clero', 'so-privilegiadas'], fichas: ['F34', 'F36'],
    prompt: 'Um bispo do século XVIII pertencia a que ordem e que privilégio tinha?',
    right: 'Ao clero: recebia o dízimo e não pagava impostos', wrong: ['À nobreza: ocupava os altos cargos do exército', 'Ao povo: pagava impostos ao rei', 'À nobreza: recebia o dízimo'],
    hints: ['Um bispo pertence à Igreja.', 'Que privilégios tinha o clero?'], explanation: 'O bispo pertencia ao clero, que recebia o dízimo e não pagava impostos.' }),
  mc({ id: 'caso-duque', sub: 'sociedade-ordens', skill: 'conceito', level: 2, reasoning: 'classificar', knowledge: ['so-nobreza', 'so-privilegiadas'], fichas: ['F34', 'F37'],
    prompt: 'Um duque comandava um regimento do exército. A que ordem pertencia e o que mostra isso?',
    right: 'À nobreza: ocupar os altos cargos do exército era um privilégio seu', wrong: ['Ao povo: só o povo servia no exército', 'Ao clero: o clero comandava os regimentos', 'A nenhuma ordem: era um oficial do rei'],
    hints: ['Os duques eram nobres.', 'Que cargos eram privilégio da nobreza?'], explanation: 'A nobreza ocupava os altos cargos da administração e do exército.' }),
  mc({ id: 'caso-lavrador', sub: 'sociedade-ordens', skill: 'conceito', level: 2, reasoning: 'classificar', knowledge: ['so-povo'], fichas: ['F35'],
    prompt: 'Um lavrador trabalhava a terra e pagava impostos ao rei, sem privilégios. A que ordem pertencia?',
    right: 'Ao povo (Terceiro Estado)', wrong: ['À nobreza', 'Ao clero', 'A nenhuma ordem'],
    hints: ['Quem não tinha privilégios?', 'Quem sustentava o reino com trabalho e impostos?'], explanation: 'O povo (Terceiro Estado) não tinha privilégios e sustentava o reino com o seu trabalho e os seus impostos.' }),
  mc({ id: 'caso-intervalo-obras', sub: 'barroco-patrimonio', skill: 'comparacao', level: 3, reasoning: 'comparar', knowledge: ['mj-mafra-pedra', 'mj-mafra-sagrada', 'bp-clerigos-inicio', 'bp-clerigos-torre'], fichas: ['F54', 'F55', 'F72'],
    prompt: 'Qual dos dois intervalos foi mais longo: da primeira pedra de Mafra (1717) à sagração da basílica (1730), ou do início da Igreja dos Clérigos (1732) à conclusão da sua torre (1763)?',
    right: 'O dos Clérigos: 31 anos, contra 13 anos em Mafra', wrong: ['O de Mafra: 13 anos, contra 31 anos nos Clérigos', 'Foram iguais', 'O de Mafra, porque era um palácio maior'],
    hints: ['Calcula cada intervalo.', 'Compara os dois resultados.'], explanation: '1763 − 1732 = 31 anos; 1730 − 1717 = 13 anos.' }),
  mc({ id: 'caso-intervalo-aq', sub: 'monarquia-joao-v', skill: 'comparacao', level: 3, reasoning: 'comparar', knowledge: ['mj-biblioteca-fim', 'mj-aq-autorizado', 'mj-aq-agua'], fichas: ['F59', 'F61'],
    prompt: 'Qual levou mais anos: construir a Biblioteca Joanina (1717–1728) ou levar a água a Lisboa pelo aqueduto (da autorização, em 1731, à chegada da água, em 1748)?',
    right: 'O aqueduto: 17 anos, contra 11 anos da biblioteca', wrong: ['A biblioteca: 17 anos, contra 11 do aqueduto', 'Foram iguais', 'A biblioteca, porque ficava em Coimbra'],
    hints: ['Calcula cada intervalo.', 'Compara os dois resultados.'], explanation: '1748 − 1731 = 17 anos; 1728 − 1717 = 11 anos.' }),
  mc({ id: 'caso-unesco-primeiro', sub: 'barroco-patrimonio', skill: 'comparacao', level: 2, reasoning: 'comparar', knowledge: ['bp-ouropreto-unesco', 'bp-porto-unesco', 'bp-coimbra-unesco', 'bp-mafra-unesco'], fichas: ['F77', 'F76', 'F75', 'F73'],
    prompt: 'Qual destes lugares foi inscrito primeiro como Património Mundial da UNESCO?',
    right: 'A cidade histórica de Ouro Preto (1980)', wrong: ['O Centro Histórico do Porto (1996)', 'A Universidade de Coimbra (2013)', 'O Real Edifício de Mafra (2019)'],
    hints: ['Compara os anos de inscrição.', 'O mais antigo é o de ano mais pequeno.'], explanation: 'A cidade histórica de Ouro Preto foi inscrita em 1980, o Porto em 1996, Coimbra em 2013 e Mafra em 2019.' }),
];

const defs: Defs = {
  subTitle: {
    'brasil-acucar': 'Brasil: açúcar e comércio', 'ouro-diamantes': 'Ouro, diamantes e escravização', 'legado-africano': 'Legado africano',
    'sociedade-ordens': 'Sociedade de ordens', 'monarquia-joao-v': 'Monarquia absoluta e D. João V', 'barroco-patrimonio': 'Barroco e património',
    'pombal-lisboa': 'Marquês de Pombal e Lisboa', sintese: 'Síntese do século XVIII',
  },
  pairs, chains, sets, cases, orders: 16, compares: 12, falseOfFour: 14,
};

export const XVIII_DEFS = defs;
export const XVIII_EXERCISES: readonly KbExercise[] = buildExercises(XVIII_ATOMS, defs);
