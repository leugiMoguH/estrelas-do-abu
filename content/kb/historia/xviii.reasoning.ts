import type { ReasoningDefs } from '../reasoning';
import { XVIII_ATOMS } from './xviii.atoms';

const focus = (id: string, knowledge: string[], skill: string, explanation: string) => {
  const atoms = knowledge.map(k => { const a = XVIII_ATOMS.find(a => a.id === k); if (!a) throw new Error(k); return a; });
  return { id, knowledge, skill, sub: atoms[0]!.sub, fichas: [...new Set(atoms.flatMap(a => a.fichas))], explanation };
};
export const XVIII_REASONING: ReasoningDefs = {
  processes: [
    { ...focus('proc-minas', ['od-decada', 'ba-salvador'], 'causa', 'A descoberta do ouro aumentou a procura de pessoas escravizadas para as minas e fez crescer o porto de Salvador.'),
      direction: 'consequencia', situation: 'a descoberta de ouro em Minas Gerais', causes: [], effects: ['O aumento da procura de pessoas escravizadas e o crescimento do porto de Salvador'], others: ['A reforma dos estudos em Coimbra', 'A reconstrução da Baixa de Lisboa', 'O fim imediato da escravatura no Brasil'] },
    { ...focus('proc-revolta', ['od-quinto', 'od-fundicao', 'od-revolta'], 'causa', 'O descontentamento com o quinto e as Casas de Fundição levou à Revolta de Vila Rica.'),
      direction: 'causa', situation: 'a Revolta de Vila Rica', causes: ['O descontentamento com a cobrança do quinto e as Casas de Fundição'], effects: [], others: ['A extinção de toda a escravatura no Brasil', 'A criação de uma biblioteca em Coimbra', 'A reconstrução de Lisboa depois do terramoto'] },
    { ...focus('proc-baixa', ['pl-terramoto', 'pl-praca'], 'consequencia', 'A destruição do Paço da Ribeira no terramoto abriu caminho à construção da Praça do Comércio.'),
      direction: 'consequencia', situation: 'a destruição do Paço da Ribeira no terramoto de Lisboa', causes: [], effects: ['A construção da Praça do Comércio naquele espaço'], others: ['A descoberta de diamantes em Minas Gerais', 'A criação da Academia Real da História', 'O início do reinado de D. João V'] },
    { ...focus('proc-viradeira', ['pl-viradeira', 'pl-jose-sucessora'], 'causa', 'A morte de D. José I e a sucessão de D. Maria I levaram ao afastamento de Pombal.'),
      direction: 'causa', situation: 'o afastamento de Pombal do governo', causes: ['A morte de D. José I e a subida ao trono de D. Maria I'], effects: [], others: ['O início do reinado de D. João V', 'A descoberta do ouro de Minas Gerais', 'A promessa de construir o convento de Mafra'] },
  ],
  claims: [
    { ...focus('claim-trabalho', ['ba-trabalho', 'od-decada', 'ba-salvador'], 'fonte', 'O trabalho escravizado esteve ligado tanto aos engenhos como à exploração mineira.'),
      claim: 'O trabalho escravizado esteve ligado a diferentes atividades económicas no Brasil', evidence: 'Havia africanos escravizados nos engenhos e procura de escravizados para as minas', irrelevant: ['A Biblioteca Joanina fica em Coimbra', 'O rei recebeu o título de Fidelíssimo', 'A estátua de D. José I foi inaugurada em 1775'] },
    { ...focus('claim-desigualdade', ['so-povo', 'so-nobreza'], 'fonte', 'A sociedade de ordens distribuía desigualmente encargos e privilégios: o povo pagava impostos e a nobreza tinha acesso favorecido a altos cargos.'),
      claim: 'A sociedade de ordens distribuía desigualmente encargos e privilégios', evidence: 'O povo pagava impostos e a nobreza tinha acesso favorecido a altos cargos', irrelevant: ['O terramoto aconteceu em novembro', 'A Torre dos Clérigos fica no Porto', 'A água era transportada por um aqueduto'] },
    { ...focus('claim-limite', ['pl-alvara', 'pl-ventre', 'pl-ambito'], 'fonte', 'As leis de 1761 e 1773 aplicavam-se ao Reino; a escravatura continuou no Brasil e em África.'),
      claim: 'As leis pombalinas sobre a escravatura tinham limites territoriais', evidence: 'Aplicavam-se ao Reino e a escravatura continuou no Brasil e em África', irrelevant: ['Pombal nasceu em Lisboa', 'O rei D. João V morreu em 1750', 'O Porto tem uma torre barroca'] },
  ],
  docs: [
    { ...focus('doc-leis', ['pl-alvara', 'pl-ventre', 'pl-ambito'], 'fonte', 'O resumo permite concluir que as medidas alteravam a situação jurídica no Reino, mantendo a escravatura nas colónias.'),
      text: 'O alvará de 1761 proibiu trazer escravizados para o Reino. A lei de 1773 declarou livres os filhos de escravas nascidos no Reino depois da lei. No Brasil e em África a escravatura continuou.',
      conclusion: 'As medidas alteravam a situação jurídica no Reino, mantendo a escravatura nas colónias', wrong: ['A escravatura acabou simultaneamente em todo o império', 'A lei criou a escravatura no Reino', 'As medidas só alteravam a situação no Brasil'] },
    { ...focus('doc-irmandades', ['la-liberdade', 'la-palmares'], 'fonte', 'As irmandades e Palmares mostram formas diferentes de procurar a liberdade e resistir à escravatura.'),
      text: 'Algumas irmandades procuravam obter a liberdade dos seus membros escravizados. Em Palmares, pessoas fugidas da escravatura organizaram povoações de resistência.',
      conclusion: 'Existiam formas diferentes de procurar a liberdade e resistir à escravatura', wrong: ['Só o governo régio podia tomar iniciativas pela liberdade', 'Todas as irmandades eram povoações de fugitivos', 'Palmares era uma companhia comercial da Coroa'] },
    { ...focus('doc-arte', ['bp-talha', 'bp-azulejo', 'bp-estilo'], 'fonte', 'O resumo mostra a combinação de diferentes artes decorativas na produção barroca.'),
      text: 'A produção barroca do reinado de D. João V recebe genericamente o nome de barroco joanino. Nos interiores das igrejas destacavam-se a talha dourada e os azulejos azuis e brancos.',
      conclusion: 'A decoração dos interiores combinava diferentes artes', wrong: ['A decoração usava exclusivamente pintura sobre tela', 'O barroco joanino dispensava a decoração interior', 'A talha dourada era uma técnica de construção antissísmica'] },
  ],
  places: [
    { ...focus('place-coimbra', ['mj-biblioteca'], 'mapa', 'A Biblioteca Joanina situa-se em Coimbra, no distrito assinalado.'), highlight: 'coimbra', question: 'Que biblioteca histórica fica na cidade principal do distrito assinalado?', correct: 'Biblioteca Joanina', wrong: ['Biblioteca Nacional de Portugal', 'Biblioteca Pública de Évora', 'Biblioteca Municipal de Faro'] },
    { ...focus('place-porto', ['bp-nasoni'], 'mapa', 'A Igreja e a Torre dos Clérigos, de Nicolau Nasoni, ficam no Porto.'), highlight: 'porto', question: 'Que monumento barroco fica na cidade principal do distrito destacado?', correct: 'Igreja e Torre dos Clérigos', wrong: ['Palácio-Convento de Mafra', 'Biblioteca Joanina', 'Santuário do Bom Jesus do Monte'] },
    { ...focus('place-braga', ['bp-bomjesus'], 'mapa', 'O Santuário do Bom Jesus do Monte situa-se em Braga.'), highlight: 'braga', question: 'Qual é o santuário barroco da cidade principal do distrito destacado?', correct: 'Santuário do Bom Jesus do Monte', wrong: ['Mosteiro dos Jerónimos', 'Convento de Cristo', 'Palácio Nacional de Mafra'] },
    { ...focus('place-lisboa', ['pl-praca'], 'mapa', 'A Praça do Comércio situa-se em Lisboa.'), highlight: 'lisboa', question: 'Que praça da cidade principal do distrito assinalado surgiu no lugar do antigo Terreiro do Paço?', correct: 'Praça do Comércio', wrong: ['Praça da República de Braga', 'Praça da Liberdade do Porto', 'Largo da Portagem de Coimbra'] },
    { ...focus('place-faro', ['pl-vrsa'], 'mapa', 'Vila Real de Santo António situa-se no Algarve, no distrito de Faro.'), highlight: 'faro', question: 'Que povoação pombalina se situa no distrito destacado, junto ao Guadiana?', correct: 'Vila Real de Santo António', wrong: ['Vila Real', 'Vila Nova de Gaia', 'Vila Franca de Xira'] },
  ],
  timelines: [
    { ...focus('tempo-mafra', ['mj-mafra-promessa', 'mj-mafra-pedra', 'mj-mafra-sagrada'], 'cronologia', 'A promessa antecedeu a primeira pedra de Mafra e a sagração da basílica.'), theme: 'Mafra', steps: ['Promessa de construir um convento', 'Lançamento da primeira pedra', 'Sagração da basílica'] },
    { ...focus('tempo-ensino', ['pl-aulas', 'pl-colegio', 'pl-universidade'], 'cronologia', 'As Aulas Régias foram criadas em 1759; o Colégio dos Nobres abriu em 1766; os novos Estatutos de Coimbra são de 1772.'), theme: 'reformas do ensino', steps: ['Criação das Aulas Régias', 'Abertura do Colégio Real dos Nobres', 'Novos Estatutos da Universidade de Coimbra'] },
    { ...focus('tempo-leis', ['pl-alvara', 'pl-ventre', 'pl-viradeira'], 'cronologia', 'O alvará é de 1761, a lei do ventre livre é de 1773 e a Viradeira ocorreu em 1777.'), theme: 'governo pombalino', steps: ['Alvará que proibiu trazer escravizados para o Reino', 'Lei do ventre livre no Reino', 'Morte de D. José I e afastamento de Pombal'] },
    { ...focus('tempo-clerigos', ['bp-clerigos-inicio', 'bp-clerigos-torre', 'bp-porto-unesco'], 'cronologia', 'A igreja começou em 1732, a torre ficou concluída em 1763 e o Centro Histórico do Porto foi inscrito pela UNESCO em 1996.'), theme: 'Clérigos e património do Porto', steps: ['Início da construção da Igreja dos Clérigos', 'Conclusão da Torre dos Clérigos', 'Inscrição do Centro Histórico do Porto como Património Mundial'] },
  ],
};
