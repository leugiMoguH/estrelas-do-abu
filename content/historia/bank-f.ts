import type { HgpBank, HgpItem, HgpSkill } from './schema';

const items: HgpItem[] = [];
const common = (sub: string, skill: HgpSkill, prompt: string, explanation: string, hints: readonly string[], facts: readonly number[]) => ({
  id: `hgp-seculo-xviii-${15 + items.length}`, topic: 'hgp-seculo-xviii' as const, sub, skill,
  difficulty: ([1, 2, 2, 3, 1, 2, 3, 1, 2, 3] as const)[items.length % 10]!, prompt, explanation, hints,
  sources: facts.flatMap(f => f === 91 ? [`xviii-f91-1`, `xviii-f91-2`] : [`xviii-f${f}-1`]),
});
const q = (sub: string, skill: HgpSkill, prompt: string, correct: string, wrong: Readonly<Record<string, string>>, explanation: string, hints: readonly string[], facts: readonly number[], extra: Pick<HgpItem, 'stimulus' | 'figure'> = {}) => {
  items.push({ ...common(sub, skill, prompt, explanation, hints, facts), kind: 'mcq', options: [correct, ...Object.keys(wrong)], correct, wrong, ...extra });
};
const cl = (sub: string, prompt: string, correct: readonly (readonly string[])[], explanation: string, hints: readonly string[], facts: readonly number[]) => {
  items.push({ ...common(sub, 'conceito', prompt, explanation, hints, facts), kind: 'cloze', correct });
};
const order = (sub: string, prompt: string, correct: readonly string[], explanation: string, hints: readonly string[], facts: readonly number[]) => {
  items.push({ ...common(sub, 'cronologia', prompt, explanation, hints, facts), kind: 'order', items: [...correct].reverse(), correct });
};
const num = (sub: string, prompt: string, correct: number, explanation: string, hints: readonly string[], facts: readonly number[]) => {
  items.push({ ...common(sub, sub === 'cronologia' ? 'cronologia' : 'conceito', prompt, explanation, hints, facts), kind: 'numeric', correct });
};

q('brasil-acucar', 'comparacao', 'Um mapa económico distingue Pernambuco e Bahia de Minas Gerais. Que legenda está correta?',
  'Pernambuco e Bahia: açúcar; Minas Gerais: ouro e diamantes', {
    'Pernambuco e Bahia: diamantes; Minas Gerais: açúcar': 'Trocaste os centros: o açúcar destacava-se no Nordeste e a mineração em Minas Gerais.',
    'Todas estas regiões produziam apenas ouro': 'No Nordeste destacava-se o açúcar; a economia colonial tinha atividades diferentes.',
  }, 'Pernambuco e Bahia eram centros açucareiros do Nordeste. Minas Gerais destacou-se pelo ouro e pelos diamantes. Distinguir as regiões ajuda a compreender a diversidade dos recursos brasileiros.',
  ['Separa o Nordeste da região mineira.', 'Minas Gerais está ligada à extração de metais e pedras preciosas.'], [1, 11, 18]);
cl('brasil-acucar', 'Completa: o açúcar era produzido nos ___, onde passou a predominar o trabalho de africanos ___.', [['engenhos'], ['escravizados']],
  'Os engenhos eram locais de produção do açúcar. Neles passou a predominar o trabalho de africanos escravizados. Era trabalho imposto pela força, não uma escolha livre.',
  ['Liga o local de produção à condição dos trabalhadores.', 'O local chama-se engenho; os trabalhadores eram privados da liberdade.'], [1]);
q('brasil-acucar', 'causa', 'Porque se relaciona o tráfico de africanos com a economia açucareira brasileira?',
  'Os produtores recorriam ao trabalho forçado nos canaviais e engenhos', {
    'O açúcar era produzido apenas por colonos livres': 'Nos engenhos passou a predominar o trabalho de africanos escravizados.',
    'As viagens de africanos para os engenhos eram todas voluntárias': 'O tráfico impunha a deslocação e o trabalho; não era uma migração livre.',
  }, 'A produção de açúcar dependia do trabalho de pessoas escravizadas. O tráfico levava africanos à força para o Brasil. A procura de trabalhadores relacionava-se, assim, com deslocações forçadas.',
  ['Pensa na diferença entre escolha e imposição.', 'O tráfico retirava a liberdade às pessoas levadas para os engenhos.'], [1, 6]);
q('brasil-acucar', 'comparacao', 'Além de fornecer recursos naturais, que papel tinha o Brasil no comércio com Portugal e a Europa?',
  'Era também comprador de produtos manufaturados portugueses e europeus', {
    'Só vendia recursos e nunca recebia produtos': 'O Brasil recebia também manufaturas portuguesas e europeias.',
    'Fornecia apenas manufaturas às cidades portuguesas': 'Isso inverte o papel destacado nas AE: o Brasil recebia manufaturas.',
  }, 'O Brasil fornecia recursos como açúcar e ouro. Também recebia manufaturas portuguesas e europeias. Havia circulação de produtos nos dois sentidos.',
  ['Um mercado é um lugar onde se vendem produtos.', 'Além de fornecedor, o Brasil era recetáculo de manufaturas.'], [1, 22]);
q('brasil-acucar', 'conceito', 'Que percurso representa uma deslocação forçada associada ao açúcar?',
  'África → Brasil, com pessoas escravizadas destinadas aos engenhos', {
    'Portugal → Minas Gerais, com colonos que procuravam oportunidades': 'A procura de oportunidades distingue-se das deslocações impostas pelo tráfico.',
    'Europa → Brasil, com produtos manufaturados': 'Esse percurso refere mercadorias, não pessoas forçadas a trabalhar.',
  }, 'O tráfico transportava pessoas escravizadas de África para o Brasil. A viagem era imposta, tal como o trabalho nos engenhos. Não se deve confundir esta viagem forçada com a de colonos atraídos por oportunidades económicas.',
  ['Identifica pessoas e verifica se podiam escolher viajar.', 'Procura a ligação de África aos engenhos brasileiros.'], [1, 6, 11]);

q('ouro-diamantes', 'facto', 'Como se situa com segurança a descoberta das grandes jazidas de ouro de Minas Gerais?',
  'Nos finais do século XVII, na década de 1690', {
    'No século XVI, quando o açúcar já se destacava no Nordeste': 'Açúcar e ouro têm cronologias diferentes: as grandes jazidas de Minas são de finais do século XVII.',
    'No século XIX, depois do governo de Pombal': 'A descoberta antecedeu os reinados de D. João V e de D. José I.',
  }, 'As grandes jazidas de Minas Gerais foram descobertas na década de 1690. Isso corresponde aos finais do século XVII. Não se deve confundir esta fase com a expansão anterior do açúcar no Nordeste.',
  ['A descoberta antecede o reinado de D. João V.', 'A década começa por 169: pertence ao século XVII.'], [11, 1]);
q('ouro-diamantes', 'consequencia', 'A descoberta de ouro fez aumentar a exploração mineira. Que consequência humana está documentada?',
  'Aumentou a procura de africanos escravizados para trabalhar nas minas', {
    'O trabalho forçado terminou nas regiões mineiras': 'A descoberta aumentou a procura de escravizados, não a eliminou.',
    'As minas passaram a depender apenas de trabalhadores livres': 'A exploração mineira recorreu ao trabalho de africanos escravizados.',
  }, 'A exploração das novas jazidas precisava de trabalhadores. A procura de africanos escravizados aumentou com a descoberta do ouro. A riqueza mineira estava ligada à violência do tráfico e do trabalho forçado.',
  ['Relaciona a expansão das minas com a procura de trabalho.', 'A procura de pessoas escravizadas aumentou.'], [6, 11]);
num('ouro-diamantes', 'Num exemplo de cálculo, extraem-se 150 unidades de ouro. Se o quinto da Coroa corresponde a 20%, quantas unidades cabem à Coroa?', 150 / 5,
  'O quinto era a quinta parte do ouro extraído. Dividir 150 por 5 dá 30, o mesmo que calcular 20% de 150. Este valor é um exemplo de cálculo, não uma quantidade histórica de ouro.',
  ['Um quinto significa dividir por cinco.', 'Calcula 150 ÷ 5.'], [15]);
q('ouro-diamantes', 'facto', 'O que se pode afirmar sobre o Tejuco e os diamantes em 1729?',
  'A descoberta de diamantes no Tejuco foi comunicada oficialmente à Coroa', {
    'Todos os diamantes do Brasil foram descobertos nesse ano': 'A data refere a comunicação oficial, não a descoberta de todas as pedras.',
    'O Tejuco era o principal engenho de açúcar da Bahia': 'O Tejuco ficava na região mineira e está associado aos diamantes.',
  }, 'Em 1729, a descoberta de diamantes no Tejuco foi comunicada à Coroa. Esta é uma data de comunicação oficial. Não permite fixar a primeira descoberta efetiva nem atribuí-la com segurança a uma pessoa.',
  ['Distingue encontrar uma pedra de comunicar uma descoberta.', '1729 é o ano da comunicação oficial à Coroa.'], [18]);
q('ouro-diamantes', 'causa', 'Como se relacionam as minas brasileiras com as grandes construções de D. João V?',
  'Parte da riqueza do ouro ajudou a pagar obras como Mafra', {
    'Mafra foi paga apenas com diamantes encontrados em Portugal': 'Foi sobretudo o ouro do Brasil que ajudou a financiar as obras de D. João V.',
    'O ouro só começou a chegar depois da morte de D. João V': 'O ouro já financiava obras durante o seu reinado.',
  }, 'O ouro brasileiro trouxe receitas à Coroa portuguesa. Uma parte importante ajudou a pagar grandes obras de D. João V, sobretudo Mafra. A economia colonial contribuía, assim, para a exibição do poder régio.',
  ['Liga uma receita da Coroa a uma despesa monumental.', 'O ouro do Brasil ajudou a financiar Mafra.'], [22]);

q('legado-africano', 'facto', 'Que exemplo mostra a presença africana organizada na vida religiosa de Lisboa no século XVIII?',
  'As irmandades de negros, escravizados e libertos, como a do Rosário', {
    'Só existiam comunidades africanas no Brasil': 'Também existiam irmandades de negros em Lisboa.',
    'As pessoas de origem africana não participavam em associações religiosas': 'As confrarias são exemplos dessa participação organizada.',
  }, 'Em Lisboa existiam confrarias de negros, escravizados e libertos. A de Nossa Senhora do Rosário dos Homens Pretos funcionava ainda no século XVIII. Estas associações mostram participação na vida religiosa da cidade.',
  ['Procura uma associação religiosa.', 'Uma irmandade ou confraria reunia pessoas para práticas religiosas.'], [24]);
q('legado-africano', 'comparacao', 'Que síntese distingue vários campos do legado africano no Brasil?',
  'Inclui contributos na língua, música, religião e culinária', {
    'Limita-se à mineração e não tem expressão cultural': 'O legado africano aparece em vários domínios culturais, além do trabalho.',
    'Existe na culinária, mas não na língua nem na música': 'Há também influências na língua e na música.',
  }, 'O legado africano aparece em vários campos da cultura brasileira. Os contributos incluem a língua, a música, a religião e a culinária. Esta síntese não atribui uma origem exata a qualquer palavra ou prato sem confirmação própria.',
  ['Legado cultural abrange mais do que uma atividade económica.', 'Pensa em falar, tocar, celebrar e cozinhar.'], [28, 30, 31, 32]);
q('legado-africano', 'vf', '«Todos os africanos presentes em Lisboa eram escravizados.» Que avaliação tem justificação correta?',
  'Falsa: as confrarias incluíam escravizados e libertos', {
    'Verdadeira: participar numa confraria significava ser escravizado': 'As confrarias incluíam também libertos.',
    'Falsa: em Portugal europeu nunca houve escravatura': 'Havia escravizados e libertos; existiu escravatura no Reino.',
  }, 'As confrarias de Lisboa reuniam escravizados e libertos. A origem africana não significava que todos tivessem a mesma condição jurídica. Também seria errado negar a existência de escravatura no Portugal europeu.',
  ['Distingue origem de condição jurídica.', 'Liberto é alguém que deixou de ser escravizado.'], [24, 27]);
cl('legado-africano', 'Completa: as confrarias de negros documentam a presença africana em ___; influências na música e na culinária documentam também o legado no ___.', [['Lisboa'], ['Brasil']],
  'As confrarias são exemplos documentados em Lisboa. No Brasil, há contributos africanos na música e na culinária. O legado africano deve ser estudado nas duas sociedades, respeitando as diferenças entre os exemplos.',
  ['A primeira lacuna pede uma cidade portuguesa.', 'A cidade é Lisboa; o país americano é o Brasil.'], [24, 31, 32]);

q('sociedade-ordens', 'comparacao', 'Dois grupos possuíam privilégios, enquanto o povo sustentava o reino com trabalho e impostos. Que leitura está correta?',
  'Os direitos e deveres variavam conforme a ordem social', {
    'As três ordens tinham os mesmos direitos e deveres': 'Os privilégios do clero e da nobreza mostram que não havia essa igualdade.',
    'A sociedade dividia-se apenas entre pessoas com e sem dinheiro': 'As ordens eram clero, nobreza e povo; riqueza não é o nome de uma ordem.',
  }, 'A sociedade dividia-se em clero, nobreza e povo. Clero e nobreza tinham privilégios que o povo não tinha. Os direitos e deveres não eram iguais para todos os grupos.',
  ['Compara privilégios e impostos.', 'As ordens privilegiadas eram o clero e a nobreza.'], [34]);
cl('sociedade-ordens', 'Completa os nomes das três ordens: ___, nobreza e ___ (Terceiro Estado).', [['clero'], ['povo']],
  'As três ordens eram clero, nobreza e povo. Clero e nobreza eram privilegiados. Os escravizados não formavam uma quarta ordem neste esquema social.',
  ['A primeira ordem liga-se à Igreja.', 'Faltam clero e povo.'], [34, 27]);
q('sociedade-ordens', 'conceito', 'Qual destas classificações da sociedade de ordens NÃO é verdadeira?',
  'Os escravizados constituíam uma quarta ordem', {
    'O povo era também chamado Terceiro Estado': 'Esta frase é verdadeira: povo e Terceiro Estado designam a mesma ordem.',
    'O clero e a nobreza tinham privilégios': 'Esta frase é verdadeira e distingue estas ordens do povo.',
  }, 'O esquema da sociedade de ordens tinha três grupos. Eram o clero, a nobreza e o povo. A escravização era uma condição de privação de liberdade, não o nome de uma quarta ordem.',
  ['A pergunta pede o erro.', 'Conta as ordens: clero, nobreza e povo.'], [34, 27]);
q('sociedade-ordens', 'causa', 'Porque é que as exigências de «limpeza de sangue» criavam discriminação?',
  'O acesso a cargos e honras dependia também dos antepassados', {
    'Garantiam que todos tinham acesso igual aos cargos': 'A exigência de certos antepassados excluía pessoas e criava desigualdade.',
    'Avaliavam apenas os conhecimentos dos candidatos': 'A expressão referia a ascendência, não uma prova de conhecimentos.',
  }, 'Para muitos cargos e honras exigia-se a chamada limpeza de sangue. Isso excluía pessoas por causa de certos antepassados, incluindo judeus. A ascendência podia limitar oportunidades independentemente dos conhecimentos de uma pessoa.',
  ['Interpreta a expressão no contexto histórico, não como saúde.', 'A discriminação estava ligada aos antepassados.'], [39, 38]);

q('monarquia-absoluta', 'conceito', 'Qual é a caracterização mais rigorosa da monarquia absoluta de D. João V?',
  'O rei concentrava a autoridade suprema e governava sem convocar as Cortes', {
    'O rei tinha de ser autorizado por um parlamento eleito por todos': 'Esta descrição não corresponde ao absolutismo joanino.',
    'O rei extinguiu todas as instituições do reino': 'Concentrar autoridade não significa eliminar todos os órgãos de governo.',
  }, 'No absolutismo, o rei concentrava a autoridade suprema. D. João V não convocou as Cortes. Isso não significa que tivessem desaparecido todas as instituições e funções de governo.',
  ['Distingue concentração de poder de ausência de instituições.', 'As Cortes não foram convocadas durante este reinado.'], [44, 45, 42]);
q('monarquia-absoluta', 'vf', '«D. João V aboliu as Cortes.» Qual é a correção adequada?',
  'Falsa: não as convocou, mas isso não é o mesmo que as abolir', {
    'Verdadeira: nunca mais houve Cortes depois do seu reinado': 'As Cortes voltaram a reunir-se com o liberalismo.',
    'Falsa: convocou as Cortes em todos os anos do reinado': 'D. João V não convocou as Cortes no seu reinado.',
  }, 'As últimas Cortes anteriores ao liberalismo reuniram-se ainda com D. Pedro II. D. João V governou sem as convocar. Não convocar uma instituição não equivale a decretar a sua extinção.',
  ['Distingue não reunir de deixar de existir por lei.', 'D. João V não convocou as Cortes.'], [44, 45]);
q('monarquia-absoluta', 'consequencia', 'Que efeito político tinha governar sem consultar as Cortes?',
  'Reforçava a concentração das decisões na Coroa', {
    'Transferia a autoridade suprema para o povo': 'Não convocar as Cortes não entregava o poder ao povo.',
    'Transformava automaticamente o reino numa república': 'O reino continuava a ser uma monarquia com o rei como autoridade suprema.',
  }, 'D. João V governou sem consultar as Cortes. As decisões ficavam mais concentradas na Coroa. Esta prática manifesta a centralização do poder associada ao absolutismo.',
  ['Pergunta em quem ficava a decisão.', 'A autoridade concentrava-se no rei.'], [44, 45]);

q('d-joao-v', 'comparacao', 'Que associação distingue corretamente a Biblioteca Joanina do conjunto de Mafra?',
  'A Joanina fica na Universidade de Coimbra; Mafra tem outra biblioteca', {
    'A Biblioteca Joanina é a biblioteca do convento de Mafra': 'A Joanina situa-se em Coimbra, embora Mafra também tenha biblioteca.',
    'A Joanina foi construída em Lisboa para Pombal': 'Foi construída em Coimbra e está ligada a D. João V.',
  }, 'A Biblioteca Joanina fica na Universidade de Coimbra. Foi construída entre 1717 e 1728 e recebeu o nome de D. João V. Não se deve confundi-la com a biblioteca de Mafra.',
  ['O nome Joanina refere o rei, não a localização em Mafra.', 'A Joanina fica em Coimbra.'], [59]);
q('d-joao-v', 'causa', 'O Aqueduto das Águas Livres ajuda a corrigir que confusão sobre a autoria das grandes obras?',
  'Foi autorizado no reinado de D. João V, antes da reconstrução pombalina', {
    'Foi uma obra iniciada por Pombal depois do terramoto': 'Foi autorizado em 1731 e a água chegou em 1748, antes da catástrofe.',
    'Foi construído por D. José I para substituir a Joanina': 'O aqueduto está ligado a D. João V e tinha a função de conduzir água.',
  }, 'O aqueduto foi autorizado em 1731, no reinado de D. João V. A água chegou a Lisboa em 1748. Estas datas mostram que a obra antecedeu a reconstrução dirigida por Pombal.',
  ['Compara 1731 e 1748 com o reinado de D. João V.', 'A obra já levava água à cidade antes de 1750.'], [61, 42]);
q('d-joao-v', 'consequencia', 'Que mensagem transmitiam as construções monumentais e as cerimónias faustosas de D. João V?',
  'A riqueza e o poder da monarquia', {
    'A transferência do poder do rei para as Cortes': 'O fausto afirmava o poder régio, não essa transferência.',
    'O fim da autoridade real sobre as obras públicas': 'As obras monumentais manifestavam a autoridade e riqueza do rei.',
  }, 'As grandes construções e cerimónias exibiam os recursos da Coroa. A embaixada de 1716 a Roma é um exemplo de fausto. Estas manifestações ajudavam a afirmar o poder de um rei absoluto.',
  ['Pensa no que uma cerimónia grandiosa mostra aos observadores.', 'O rei tornava visíveis a riqueza e o poder da Coroa.'], [49, 22, 45]);
order('d-joao-v', 'Ordena os marcos de Mafra, distinguindo a condição da promessa, o início da obra e a sagração.',
  ['Nascimento de D. Maria Bárbara (1711)', 'Primeira pedra de Mafra (1717)', 'Sagração da basílica (1730)'],
  'O nascimento de D. Maria Bárbara, em 1711, cumpriu a condição da promessa do rei. A primeira pedra foi lançada em 1717. A basílica foi sagrada em 1730, mas as obras continuaram depois da cerimónia.',
  ['A sagração pressupõe uma fase de construção anterior.', 'Ordena os anos 1711, 1717 e 1730.'], [53, 54, 55]);

cl('barroco-patrimonio', 'Completa: a talha dourada é ___ esculpida e coberta de ___, muito usada em interiores de igrejas barrocas.', [['madeira'], ['ouro']],
  'A talha dourada parte de madeira esculpida. Essa madeira é coberta de ouro, produzindo uma decoração rica. É típica do barroco joanino, tal como o azulejo azul e branco.',
  ['Distingue o material esculpido do revestimento.', 'A base é madeira e a cobertura é ouro.'], [69]);
q('barroco-patrimonio', 'mapa', 'O mapa destaca o distrito do Porto. Que monumento deste distrito está ligado a Nicolau Nasoni?',
  'A Igreja e a Torre dos Clérigos', {
    'A Biblioteca Joanina': 'A Joanina fica em Coimbra, não no Porto.',
    'O Palácio-Convento de Mafra': 'Mafra situa-se no distrito de Lisboa, não no do Porto.',
  }, 'A Igreja e a Torre dos Clérigos ficam no Porto. São obras de Nicolau Nasoni. O mapa permite relacionar património e localização, sem confundir Porto, Coimbra e Mafra.',
  ['Observa o distrito destacado no Norte.', 'No Porto encontra-se a Torre dos Clérigos.'], [71, 59, 54], { figure: { type: 'pt-map', highlight: ['porto'], label: 'Distrito do Porto' } });
q('barroco-patrimonio', 'comparacao', 'Que ligação artística existiu entre Portugal e o Brasil no barroco joanino?',
  'O barroco joanino chegou também ao Brasil, incluindo a talha em Minas Gerais', {
    'O barroco joanino ficou limitado à cidade de Lisboa': 'O barroco joanino chegou também ao Brasil.',
    'A talha de Minas Gerais não tinha relação com o barroco': 'A talha em Minas Gerais é um exemplo da expansão deste estilo.',
  }, 'O barroco joanino inspirou-se no barroco romano. A sua influência chegou também ao Brasil. A talha em Minas Gerais e São Paulo mostra esta circulação de modelos artísticos.',
  ['A circulação entre os territórios incluía arte.', 'Há talha barroca em Minas Gerais e em São Paulo.'], [70]);
q('barroco-patrimonio', 'opiniao', 'Numa visita a monumentos, qual das frases apresenta um gosto pessoal?',
  'A talha dourada é a decoração mais bonita de todas', {
    'A Biblioteca Joanina situa-se na Universidade de Coimbra': 'A localização é um facto verificável, não um gosto pessoal.',
    'A talha dourada utiliza madeira esculpida coberta de ouro': 'Os materiais podem ser verificados; não exprimem uma preferência.',
  }, 'Dizer que uma decoração é a mais bonita exprime uma preferência. Outra pessoa pode preferir outro estilo. A localização de uma biblioteca e os materiais de uma obra podem ser confirmados por fontes.',
  ['Procura uma avaliação que varie de pessoa para pessoa.', 'A expressão «mais bonita» indica uma preferência.'], [69, 59]);

q('pombal', 'personagem', 'Que relação entre rei e ministro permite situar corretamente as reformas pombalinas?',
  'D. José I era o rei e Sebastião José de Carvalho e Melo era o ministro', {
    'Pombal era o rei e D. José I o seu ministro': 'Pombal foi ministro de D. José I, não rei.',
    'D. João V era o rei durante todas as reformas pombalinas': 'As reformas pombalinas associam-se ao reinado de D. José I.',
  }, 'Sebastião José de Carvalho e Melo ficou conhecido como Marquês de Pombal. Foi ministro de D. José I. Distinguir os cargos evita atribuir ao ministro a condição de rei.',
  ['Separa quem ocupava o trono de quem era ministro.', 'O rei era D. José I.'], [79, 80]);
q('pombal', 'consequencia', 'Que objetivo económico tinha a Companhia das Vinhas do Alto Douro, criada em 1756?',
  'Regular a produção e o comércio do vinho do Porto e demarcar a região', {
    'Explorar o ouro e os diamantes do Tejuco': 'A companhia estava ligada ao vinho do Douro, não à mineração brasileira.',
    'Organizar apenas a reconstrução da Baixa de Lisboa': 'A reconstrução urbana e a regulação do vinho eram intervenções diferentes.',
  }, 'A Companhia Geral da Agricultura das Vinhas do Alto Douro foi criada em 1756. Regulava a produção e o comércio do vinho do Porto. A demarcação da região fazia parte desta organização económica.',
  ['O nome da companhia identifica um produto agrícola.', 'Vinhas do Alto Douro remetem para o vinho do Porto.'], [95]);
q('pombal', 'fonte', 'Que informação se podia obter ao observar um marco pombalino no Douro?',
  'Que fazia parte da marcação no terreno da região demarcada', {
    'Que assinalava uma mina de ouro brasileira': 'Os marcos do Douro estavam ligados ao vinho, não às minas do Brasil.',
    'Que identificava um edifício reconstruído em Lisboa': 'Os marcos serviam para delimitar a região do Douro.',
  }, 'Os marcos pombalinos eram pedras usadas para marcar a demarcação do Douro. São fontes materiais da organização da região vinícola. Relacionam uma decisão administrativa com marcas concretas na paisagem.',
  ['Pensa na função de delimitar uma região.', 'Os marcos assinalavam os limites da demarcação do Douro.'], [96, 95],
  { stimulus: 'Descrição de fonte material: marcos de pedra da demarcação do Douro, associada à Companhia criada em 1756; sem transcrição de inscrições.' });
q('pombal', 'consequencia', 'Que mudança no ensino se relaciona com as reformas de 1759?',
  'Criaram-se Aulas Régias para substituir o ensino dos Jesuítas', {
    'Os Jesuítas passaram a controlar todo o ensino régio': 'Os Jesuítas foram expulsos em 1759; a reforma criou Aulas Régias.',
    'A Universidade de Coimbra foi criada pela primeira vez nesse ano': 'A Universidade de Coimbra é muito anterior a 1759; foi reformada em 1772, não criada.',
  }, 'Em 1759 foram criadas as Aulas Régias. Destinavam-se a substituir o ensino dos Jesuítas, expulsos nesse ano. A intervenção régia no ensino tornou-se mais direta.',
  ['Relaciona a saída dos Jesuítas com a reorganização do ensino.', 'A alternativa criada chamava-se Aulas Régias.'], [98, 103]);
q('pombal', 'vf', '«As leis de Pombal acabaram com a escravatura em todo o império.» Qual é a avaliação correta?',
  'Falsa: as leis de 1761 e 1773 aplicavam-se ao Reino e a escravatura continuou nas colónias', {
    'Verdadeira: desde 1761 não existiram mais escravizados no Brasil': 'A lei aplicava-se ao Reino; no Brasil a escravatura continuou.',
    'Falsa: Pombal não tomou nenhuma medida sobre escravizados': 'Tomou medidas em 1761 e 1773, mas com alcance territorial limitado.',
  }, 'As leis de 1761 e 1773 aplicavam-se ao Reino, isto é, a Portugal europeu. A escravatura continuou no Brasil e em África. É preciso distinguir medidas limitadas ao Reino de uma abolição em todos os territórios.',
  ['Verifica onde se aplicavam as leis.', 'Reino não significava todo o império colonial.'], [99, 100, 101]);
cl('pombal', 'Completa: a lei de 1773 acabou com a distinção legal entre cristãos-___ e cristãos-___.', [['novos'], ['velhos']],
  'A distinção entre cristãos-novos e cristãos-velhos dependia da ascendência. A lei de 1773 acabou com essa distinção legal. Trata-se de uma mudança na lei, que deve ser identificada com precisão.',
  ['A lei tratava de designações associadas à ascendência.', 'Faltam novos e velhos.'], [38, 102]);
q('pombal', 'comparacao', 'Que comparação entre D. João V e o governo pombalino é correta?',
  'Ambos reforçaram o poder régio, com manifestações e medidas diferentes', {
    'D. João V concentrou poder, mas Pombal transferiu-o todo para o povo': 'As reformas pombalinas também tinham uma ação centralizadora.',
    'Ambos governaram como reis de Portugal': 'D. João V foi rei; Pombal foi ministro de D. José I.',
  }, 'D. João V manifestou o poder régio através do fausto e da concentração de decisões. Pombal promoveu reformas com intervenção régia no ensino e na economia. As ações foram diferentes, mas mantiveram a autoridade suprema da monarquia.',
  ['Compara o sentido político, sem confundir os cargos.', 'Centralizar é concentrar autoridade na Coroa.'], [45, 49, 80, 95, 103]);
order('pombal', 'Ordena estas medidas sobre ensino e distinções legais no governo pombalino.',
  ['Aulas Régias (1759)', 'Novos Estatutos da Universidade de Coimbra (1772)', 'Fim da distinção legal entre cristãos-novos e cristãos-velhos (1773)'],
  'As Aulas Régias foram criadas em 1759. A reforma da Universidade de Coimbra ocorreu em 1772. O fim da distinção legal entre cristãos-novos e cristãos-velhos veio em 1773, numa área diferente das reformas.',
  ['Distingue reformas do ensino de uma mudança na lei sobre ascendência.', 'Compara os anos 1759, 1772 e 1773.'], [103, 105, 102]);

q('terramoto-lisboa', 'consequencia', 'Porque é incompleto dizer que Lisboa foi destruída apenas pelo tremor de terra de 1 de novembro de 1755?',
  'Porque ao sismo se seguiram um maremoto e incêndios', {
    'Porque o terramoto só aconteceu em 1775': 'A data correta é 1 de novembro de 1755; 1775 é o ano da estátua de D. José I.',
    'Porque a destruição foi causada apenas pelo maremoto': 'Houve uma combinação de sismo, maremoto e incêndios.',
  }, 'O sismo de 1 de novembro de 1755 foi seguido de um maremoto e incêndios. Estes fenómenos agravaram a destruição. Para explicar a catástrofe, é preciso considerar o conjunto e não apenas o tremor inicial.',
  ['Há três fenómenos a distinguir.', 'Depois do sismo vieram o maremoto e os incêndios.'], [82, 83, 91]);
q('terramoto-lisboa', 'comparacao', 'Que comparação descreve a mudança urbana entre a antiga Baixa e a reconstrução pombalina?',
  'A reconstrução adotou ruas mais regulares e um plano organizado', {
    'A reconstrução repetiu todas as ruas antigas sem alterações': 'Introduziu um plano novo, não uma cópia integral da malha antiga.',
    'A reconstrução limitou-se a substituir o nome da praça': 'A intervenção transformou o espaço urbano e os edifícios.',
  }, 'A reconstrução da Baixa seguiu um plano organizado. A regularidade das ruas fazia parte da nova organização. A gaiola de madeira procurava também aumentar a resistência dos edifícios aos sismos.',
  ['Compara o traçado das ruas e a forma de construir.', 'A nova Baixa passou a ter ruas regulares e planeadas.'], [88, 89, 93]);
q('terramoto-lisboa', 'mapa', 'O mapa destaca Faro, no Algarve. Que exemplo mostra que o urbanismo pombalino se estendeu para além de Lisboa?',
  'Vila Real de Santo António foi fundada no Algarve com um plano regular', {
    'A Biblioteca Joanina foi transferida para o Algarve': 'A Joanina fica na Universidade de Coimbra.',
    'A Torre dos Clérigos foi construída no distrito de Faro': 'A Torre dos Clérigos fica no Porto.',
  }, 'Vila Real de Santo António foi fundada em 1774, no Algarve. Teve ruas regulares e uma praça central, mostrando urbanismo pombalino fora de Lisboa. O destaque localiza o distrito, não a posição exata da vila.',
  ['O destaque corresponde ao distrito algarvio.', 'A vila planeada junto ao Guadiana é Vila Real de Santo António.'], [93, 94, 59, 71],
  { figure: { type: 'pt-map', highlight: ['faro'], label: 'Distrito de Faro, no Algarve' } });
q('terramoto-lisboa', 'vf', '«O sismo de 1 de novembro de 1755 atingiu apenas Lisboa.» Que resposta corrige a afirmação?',
  'Falsa: atingiu outras zonas, incluindo Setúbal e o Algarve', {
    'Verdadeira: o nome terramoto de Lisboa prova que só afetou a capital': 'O nome não define toda a área atingida.',
    'Falsa: Lisboa não sofreu estragos': 'Lisboa sofreu grande destruição, embora não fosse o único lugar atingido.',
  }, 'O terramoto ficou conhecido pelo nome de Lisboa. Contudo, atingiu outras zonas do reino, incluindo Setúbal e o Algarve. O nome de um acontecimento não deve ser confundido com o limite dos seus efeitos.',
  ['Distingue o nome da área atingida.', 'Setúbal e o Algarve também foram atingidos.'], [82, 84]);

q('novas-culturas', 'cronologia', 'Que frase situa corretamente a difusão do milho e da batata em Portugal?',
  'O milho já se difundira antes; a batata espalhou-se sobretudo a partir do século XVIII', {
    'Os dois só chegaram depois do terramoto de Lisboa': 'O milho já era importante em regiões portuguesas no início do século XVII.',
    'A batata era a única base da alimentação portuguesa no século XVI': 'A sua expansão ocorreu sobretudo a partir do século XVIII.',
  }, 'O milho americano chegou antes do século XVIII. No início do século XVII já era importante no Minho e na Beira Litoral. A batata espalhou-se sobretudo a partir do século XVIII, em contexto de crises e falta de cereais.',
  ['As duas culturas não têm a mesma cronologia.', 'O milho já tinha importância regional no século XVII.'], [111, 112]);
q('novas-culturas', 'causa', 'Que problema ajuda a explicar a expansão da batata em Portugal a partir do século XVIII?',
  'As crises alimentares e a falta de cereais', {
    'A descoberta de diamantes no Tejuco': 'A expansão da batata liga-se à alimentação e à falta de cereais.',
    'A necessidade de substituir o vinho do Porto nas exportações': 'A batata é tratada como recurso alimentar, não como substituto do vinho.',
  }, 'A falta de cereais e as crises favoreceram a expansão da batata. Esta cultura passou a ser uma alternativa alimentar. Isso não permite afirmar que todos os problemas desapareceram.',
  ['Procura uma necessidade ligada à dieta.', 'Quando faltavam cereais, a batata oferecia uma alternativa alimentar.'], [112]);
q('novas-culturas', 'consequencia', 'O milho e a batata mudaram a alimentação em Portugal. Que frase descreve corretamente a consequência?',
  'Milho e batata contribuíram para melhorar a dieta e favorecer o aumento populacional', {
    'O milho fez a população duplicar num ano': 'Foi uma mudança gradual, sem saltos de um ano para o outro.',
    'A batata eliminou imediatamente todas as crises alimentares': 'Melhorar a dieta não significa acabar com todas as crises.',
  }, 'O milho e a batata ampliaram os recursos alimentares, melhoraram a dieta e favoreceram o aumento da população. Foi uma mudança gradual, sem saltos de um ano para o outro. Por isso as frases com «duplicou num ano» ou «eliminou todas as crises» são exageros.',
  ['Usa a relação qualitativa indicada nas AE.', 'Mais recursos alimentares podem melhorar a dieta e favorecer o crescimento da população.'], [111, 112]);

order('cronologia', 'Ordena estes marcos de obras e abastecimento no reinado de D. João V.',
  ['Primeira pedra de Mafra (1717)', 'Autorização do Aqueduto das Águas Livres (1731)', 'Chegada da água a Lisboa pelo aqueduto (1748)'],
  'A primeira pedra de Mafra foi lançada em 1717. O aqueduto foi autorizado em 1731 e levou água a Lisboa em 1748. Autorização e funcionamento são momentos diferentes de uma obra.',
  ['Separa o início de uma obra do seu funcionamento.', 'Ordena 1717, 1731 e 1748.'], [54, 61]);
order('cronologia', 'Ordena os marcos do Douro, de Vila Real de Santo António e da mudança de reinado.',
  ['Criação da Companhia do Alto Douro (1756)', 'Fundação de Vila Real de Santo António (1774)', 'Morte de D. José I e sucessão de D. Maria I (1777)'],
  'A companhia do Douro foi criada em 1756. Vila Real de Santo António foi fundada em 1774. Em 1777 morreu D. José I e sucedeu-lhe D. Maria I, seguindo-se o afastamento de Pombal.',
  ['Identifica as datas das intervenções económicas e urbanas.', 'A sequência é 1756, 1774 e 1777.'], [95, 93, 109]);
num('cronologia', 'D. João V reinou de 1706 a 1750. Calculando a diferença entre os anos, quantos anos decorrem entre o início e o fim do reinado?', 1750 - 1706,
  'Subtrai-se o ano inicial ao ano final. O cálculo 1750 menos 1706 dá 44 anos. A pergunta usa anos, sem exigir a contagem de dias ou meses.',
  ['Subtrai o ano inicial ao ano final.', 'Calcula 1750 − 1706.'], [42]);
num('cronologia', 'A Biblioteca Joanina foi construída entre 1717 e 1728. Qual é a diferença, em anos, entre estas datas?', 1728 - 1717,
  'As datas indicadas são 1717 e 1728. A diferença obtém-se com 1728 menos 1717, que dá 11. Calcula-se um intervalo, sem contar ambos os extremos como anos completos adicionais.',
  ['É um intervalo, não uma soma das datas.', 'Calcula 1728 − 1717.'], [59]);

q('fontes', 'fonte', 'Na descrição do alvará de 1761, que informação se conclui sobre o território de aplicação?',
  'A medida impedia trazer escravizados das colónias para o Reino', {
    'A medida libertava imediatamente todos os escravizados do Brasil': 'A descrição refere a entrada no Reino, não uma abolição no Brasil.',
    'A medida proibia apenas a entrada de ouro em Lisboa': 'O diploma trata de pessoas escravizadas, não de ouro.',
  }, 'A descrição identifica a proibição de trazer escravizados para o Reino. Quem aí desembarcasse ficava livre. O alcance territorial é essencial: não equivale a acabar com a escravatura nas colónias.',
  ['Procura o destino abrangido pela proibição.', 'O destino é o Reino, ou Portugal europeu.'], [99, 101],
  { stimulus: 'Descrição de fonte: alvará régio de 19 de setembro de 1761, do reinado de D. José I. Resume a proibição de trazer escravizados das colónias para o Reino e a liberdade de quem aí desembarcasse. Sem transcrição literal.' });
q('fontes', 'fonte', 'Que conclusão permite a descrição da lei de 1773 sobre crianças nascidas no Reino?',
  'Os filhos de mulheres escravizadas nascidos depois da lei eram livres', {
    'Todas as pessoas escravizadas do Brasil ficaram livres nesse dia': 'A lei refere o Reino e não decretou essa liberdade geral no Brasil.',
    'Os filhos continuavam sempre escravizados, qualquer que fosse a data': 'A lei estabeleceu a liberdade dos nascidos depois da publicação no Reino.',
  }, 'A lei de 1773 estabeleceu o princípio do ventre livre no Reino. Os filhos de mulheres escravizadas nascidos depois dessa data seriam livres. A regra não pode ser alargada ao Brasil, onde a escravatura continuou.',
  ['Repara na condição relativa ao nascimento.', 'A descrição fala dos filhos nascidos no Reino depois da lei.'], [100, 101],
  { stimulus: 'Descrição de fonte: lei régia de 16 de janeiro de 1773, do reinado de D. José I; Resume a liberdade dos filhos de mulheres escravizadas nascidos no Reino depois dessa data. Não é uma citação literal.' });
q('fontes', 'fonte', 'O Coche dos Oceanos pode servir como fonte para estudar que aspeto do reinado de D. João V?',
  'O fausto das cerimónias e da representação diplomática', {
    'O sistema de gaiolas dos prédios pombalinos': 'Um coche da embaixada não é fonte direta sobre a estrutura dos prédios.',
    'As técnicas de extração de diamantes no Tejuco': 'O objeto liga-se à embaixada a Roma, não ao trabalho nas minas.',
  }, 'O Coche dos Oceanos está associado à embaixada de 1716 a Roma. Permite estudar o fausto da representação diplomática joanina. Uma fonte material pode informar sobre cerimónias e poder sem ser um texto escrito.',
  ['Relaciona o objeto com a ocasião em que foi usado.', 'A embaixada a Roma era uma manifestação pública da monarquia.'], [49],
  { stimulus: 'Descrição de fonte material: Coche dos Oceanos, associado à embaixada enviada por D. João V a Roma em 1716, chefiada pelo Marquês de Fontes. Conserva-se no Museu Nacional dos Coches.' });
q('fontes', 'fonte', 'Uma ode de 1775 à colocação da estátua de D. José I seria adequada para estudar sobretudo o quê?',
  'A celebração pública do rei na Praça do Comércio', {
    'A descoberta inicial de ouro nos finais do século XVII': 'A ode liga-se à estátua e à celebração do rei, não à descoberta das jazidas.',
    'A fundação da Biblioteca Joanina em Coimbra': 'O documento descrito trata da colocação da estátua, não da biblioteca.',
  }, 'Uma ode é um texto de celebração. O documento de 1775 está ligado à colocação da estátua equestre de D. José I. Ajuda a estudar a imagem do rei e uma cerimónia pública, não acontecimentos de temas que não descreve.',
  ['Liga a data à ocasião de produção do documento.', 'A ode celebra a colocação da estátua do rei.'], [91],
  { stimulus: 'Descrição de fonte escrita: ode impressa de 1775 à colocação da estátua equestre de D. José I, disponível em reprodução no Internet Archive. Sem excerto literal ou autoria atribuída.' });

q('conceitos', 'conceito', 'Qual é o significado histórico de «cristão-novo» neste capítulo?',
  'Descendente de judeus convertidos ao cristianismo', {
    'Qualquer pessoa que começou recentemente a ir à igreja': 'O termo histórico refere a ascendência ligada à conversão de judeus.',
    'Uma pessoa que pertencia obrigatoriamente ao clero': 'O conceito não designava uma ordem religiosa ou social.',
  }, 'Cristão-novo era uma designação ligada à descendência de judeus convertidos. Não significa apenas alguém que adotou uma prática religiosa há pouco tempo. A distinção legal face aos cristãos-velhos terminou em 1773.',
  ['Procura uma definição ligada à ascendência.', 'Pensa em descendentes de judeus convertidos ao cristianismo.'], [38, 102]);
cl('conceitos', 'Completa: numa monarquia ___, a autoridade suprema concentra-se no rei.', [['absoluta']],
  'O conceito de monarquia absoluta destaca a concentração da autoridade suprema no rei. D. João V é um exemplo estudado neste capítulo. Governar sem convocar as Cortes manifesta essa concentração.',
  ['O adjetivo refere a concentração da autoridade régia.', 'A expressão é monarquia absoluta.'], [44, 45]);
q('conceitos', 'comparacao', 'Qual dos exemplos distingue uma mudança de uma continuidade no século XVIII?',
  'Mudança: fim da distinção legal entre cristãos-novos e velhos; continuidade: escravatura nas colónias', {
    'Mudança: fim da escravatura no Brasil em 1761; continuidade: distinção legal depois de 1773': 'As duas partes invertem os factos: a escravatura colonial continuou e a distinção legal terminou.',
    'Mudança: Pombal tornou-se rei; continuidade: D. João V governou depois de 1777': 'Pombal foi ministro e D. João V morreu em 1750; as duas partes estão erradas.',
  }, 'Mudança significa uma alteração face à situação anterior. A lei de 1773 mudou a distinção legal entre cristãos-novos e cristãos-velhos. A escravatura continuou nas colónias, mostrando que nem tudo mudou da mesma forma.',
  ['Compara uma alteração legal com algo que permaneceu.', 'A distinção legal terminou, mas a escravatura colonial continuou.'], [102, 101, 42, 80]);
order('conceitos', 'Ordena o raciocínio de causa e consequência entre ouro brasileiro e exibição do poder de D. João V.',
  ['Exploração de ouro no Brasil', 'Receitas do ouro disponíveis para a Coroa', 'Financiamento de obras monumentais', 'Exibição da riqueza e do poder régio'],
  'A exploração do ouro gerava receitas para a Coroa. Parte dessa riqueza financiou obras como Mafra. As construções exibiam o poder régio; esta é uma sequência explicativa, não uma lista de datas.',
  ['Uma despesa exige recursos anteriores.', 'Exploração → receitas → obras → exibição do poder.'], [11, 15, 22, 49]);
order('terramoto-lisboa', 'Ordena a resposta construtiva à destruição da Baixa, do problema à solução técnica.',
  ['Destruição da Baixa pelo sismo, maremoto e incêndios de 1 de novembro de 1755', 'Preparação de planos para a reconstrução', 'Construção de edifícios com gaiola interior de madeira'],
  'A destruição tornou necessária a reconstrução da Baixa. Os planos organizaram a intervenção no espaço urbano. A gaiola de madeira foi uma solução para melhorar a resistência dos novos edifícios aos sismos.',
  ['A solução é posterior ao problema que procura resolver.', 'Primeiro a destruição, depois os planos e a construção.'], [82, 83, 88, 89, 92]);

/** Preparação temática baseada na ficha F1–F113; não reproduz o manual.
 * PARCIAL: apenas o essencial, sem pormenores incertos. Referências F nos ids das fontes.
 * AE l.104–106: mercado de manufaturas e relação qualitativa dieta/população.
 */
export const bank: HgpBank = {
  sources: [
  {
    "id": "xviii-f1-1",
    "title": "UFS, Hist. do Brasil Colónia, aula 4",
    "url": "https://cesad.ufs.br/ORBI/public/uploadCatalago/17292505102012Historia_do_Brasil_Colonia_Aula_4.pdf",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f6-1",
    "title": "Florentino, Ribeiro e Silva, Afro-Ásia (2004)",
    "url": "https://www.redalyc.org/pdf/770/77003103.pdf",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f11-1",
    "title": "Wikipédia EN, Brazilian gold rush",
    "url": "https://en.wikipedia.org/wiki/Brazilian_Gold_Rush",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f14-1",
    "title": "UFMG (PDF)",
    "url": "https://www3.ufmg.br/storage/e/8/f/d/e8fdbd5e4fd7576d66425cc0e4a5363e_16085963106786_861894680.pdf",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f15-1",
    "title": "Wikipédia PT, Ciclo do ouro",
    "url": "https://pt.wikipedia.org/wiki/Ciclo_do_ouro",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f18-1",
    "title": "IBGE, Diamantina (PDF)",
    "url": "https://biblioteca.ibge.gov.br/visualizacao/dtb/minasgerais/diamantina.pdf",
    "accessed": "2026-10-31",
    "kind": "oficial"
  },
  {
    "id": "xviii-f22-1",
    "title": "Wikipédia PT, Ciclo do ouro",
    "url": "https://pt.wikipedia.org/wiki/Ciclo_do_ouro",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f24-1",
    "title": "«Religião e Liberdade» (NOVA, RUN)",
    "url": "https://run.unl.pt/bitstream/10362/27092/1/Religiao_e_Liberdade_WEB_1_.pdf",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f27-1",
    "title": "Revista de História (USP)",
    "url": "https://periodicos.usp.br/revhistoria/article/download/18912/20975/22443",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f28-1",
    "title": "Correio Braziliense",
    "url": "https://blogs.correiobraziliense.com.br/coletivo-filhas-da-mae/2024/11/04/o-brasil-e-a-heranca-africana/",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f30-1",
    "title": "PROFALA/UFC",
    "url": "https://profala.ufc.br/wp-content/uploads/2018/04/trabalho4.pdf",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f31-1",
    "title": "PROFALA/UFC",
    "url": "https://profala.ufc.br/wp-content/uploads/2018/04/trabalho4.pdf",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f32-1",
    "title": "O Povo",
    "url": "https://mais.opovo.com.br/jornal/vidaearte/2020/11/20/as-herancas-da-cultura-africana-na-gastronomia-brasileira.html",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f34-1",
    "title": "DGE, Estudo Autónomo, GTA1 História A",
    "url": "https://estudoautonomo.dge.mec.pt/sites/default/files/2024-12/GTA1_Hist%C3%B3ria%20A.%C2%BA%20ano_Tema%201_%20Subtema%201_A%20Europa%20dos%20Estados%20absolutos%20e%20a%20Europa%20dos%20parlamentos.pdf",
    "accessed": "2026-10-31",
    "kind": "oficial"
  },
  {
    "id": "xviii-f38-1",
    "title": "Rev. IHGRGS, Carta de Lei de 1773",
    "url": "https://seer.ufrgs.br/index.php/revistaihgrgs/article/view/133689",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f39-1",
    "title": "Wikipédia PT, D. João V",
    "url": "https://pt.wikipedia.org/wiki/Jo%C3%A3o_V_de_Portugal",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f42-1",
    "title": "Wikipédia PT",
    "url": "https://pt.wikipedia.org/wiki/Jo%C3%A3o_V_de_Portugal",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f44-1",
    "title": "Wikipédia EN, Portuguese Cortes",
    "url": "https://en.wikipedia.org/wiki/Portuguese_Cortes",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f45-1",
    "title": "Infopédia, Absolutismo Joanino (excerto)",
    "url": "https://www.infopedia.pt/artigos/$absolutismo-joanino",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f49-1",
    "title": "DNS.pt, Galeria .pt",
    "url": "https://www.dns.pt/en/galeriapt/details.php?id=16",
    "accessed": "2026-10-31",
    "kind": "oficial"
  },
  {
    "id": "xviii-f53-1",
    "title": "Infopédia, Palácio-Convento de Mafra (excerto)",
    "url": "https://www.infopedia.pt/artigos/$palacio-convento-de-mafra",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f54-1",
    "title": "Estudo Geral UC",
    "url": "https://estudogeral.sib.uc.pt/bitstream/10316/85057/1/D4_AFPimentel_Monumentos%2035.pdf",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f55-1",
    "title": "Observador",
    "url": "https://observador.pt/especiais/a-boda-real-e-o-regresso-dos-braganca-a-mafra-o-palacio-onde-uma-princesa-foi-batizada-e-de-onde-partiu-o-ultimo-rei-portugues/",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f59-1",
    "title": "Universidade de Coimbra",
    "url": "https://www.uc.pt/en/tourism/unesco/joanina-library",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f61-1",
    "title": "Wikipédia PT",
    "url": "https://pt.wikipedia.org/wiki/Aqueduto_das_%C3%81guas_Livres",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f63-1",
    "title": "Wikipédia EN",
    "url": "https://en.wikipedia.org/wiki/%C3%81guas_Livres_Aqueduct",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f67-1",
    "title": "Parques de Sintra, história de Queluz",
    "url": "https://www.parquesdesintra.pt/en/parks-monuments/national-palace-and-gardens-of-queluz/history/",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f68-1",
    "title": "Infopédia, Barroco Joanino (excerto)",
    "url": "https://www.infopedia.pt/artigos/$barroco-joanino",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f69-1",
    "title": "Infopédia, Barroco Joanino (excerto)",
    "url": "https://www.infopedia.pt/artigos/$barroco-joanino",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f70-1",
    "title": "GE-IIC",
    "url": "https://ojs3.ge-iic.com/index.php/revista/article/download/21/pdf",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f71-1",
    "title": "Wikipédia PT",
    "url": "https://pt.wikipedia.org/wiki/Torre_dos_Cl%C3%A9rigos",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f73-1",
    "title": "Portugal Homes",
    "url": "https://portugalhomes.com/news/article/116/portugal-adds-three-new-sites-to-unesco-world-heritage-list",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f79-1",
    "title": "Wikipédia PT",
    "url": "https://pt.wikipedia.org/wiki/Sebasti%C3%A3o_Jos%C3%A9_de_Carvalho_e_Melo,_marqu%C3%AAs_de_Pombal",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f80-1",
    "title": "Wikipédia PT",
    "url": "https://pt.wikipedia.org/wiki/Sebasti%C3%A3o_Jos%C3%A9_de_Carvalho_e_Melo,_marqu%C3%AAs_de_Pombal",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f82-1",
    "title": "Wikipédia PT",
    "url": "https://pt.wikipedia.org/wiki/Sismo_de_Lisboa_de_1755",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f83-1",
    "title": "Wikipédia PT",
    "url": "https://pt.wikipedia.org/wiki/Sismo_de_Lisboa_de_1755",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f84-1",
    "title": "Wikipédia PT",
    "url": "https://pt.wikipedia.org/wiki/Sismo_de_Lisboa_de_1755",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f88-1",
    "title": "Infopédia, Eugénio dos Santos (excerto)",
    "url": "https://www.infopedia.pt/artigos/$eugenio-dos-santos",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f89-1",
    "title": "Infopédia (excerto)",
    "url": "https://www.infopedia.pt/artigos/$eugenio-dos-santos",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f90-1",
    "title": "Wikipédia EN, Praça do Comércio",
    "url": "https://en.wikipedia.org/wiki/Pra%C3%A7a_do_Com%C3%A9rcio",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f91-1",
    "title": "Wikipédia EN, Statue of José I",
    "url": "https://en.wikipedia.org/wiki/Statue_of_Jos%C3%A9_I_of_Portugal",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f91-2",
    "title": "Ode impressa de 1775 (Internet Archive)",
    "url": "https://archive.org/details/aoreyfidelissimo00mach",
    "accessed": "2026-10-31",
    "kind": "museu-arquivo"
  },
  {
    "id": "xviii-f92-1",
    "title": "Baixo Guadiana",
    "url": "https://baixoguadiana.com/en/territorio/patrimonio-edificado/nucleo-pombalino/",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f93-1",
    "title": "Baixo Guadiana",
    "url": "https://baixoguadiana.com/en/territorio/patrimonio-edificado/nucleo-pombalino/",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f94-1",
    "title": "Baixo Guadiana",
    "url": "https://baixoguadiana.com/en/territorio/patrimonio-edificado/nucleo-pombalino/",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f95-1",
    "title": "Infopédia, Vinho do Porto (excerto)",
    "url": "https://www.infopedia.pt/artigos/$vinho-do-porto",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f96-1",
    "title": "Taylor's",
    "url": "https://www.taylor.pt/en/what-is-port-wine/history-of-port/the-marquis-of-pombal",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f98-1",
    "title": "UFES",
    "url": "https://periodicos.ufes.br/ufesupem/article/view/11768/8464",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f99-1",
    "title": "Revista de História (USP)",
    "url": "https://periodicos.usp.br/revhistoria/article/download/18912/20975/22443",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f100-1",
    "title": "Afro-Ásia (Redalyc)",
    "url": "https://www.redalyc.org/journal/770/77066580002/77066580002.pdf",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f101-1",
    "title": "Revista de História (USP)",
    "url": "https://periodicos.usp.br/revhistoria/article/download/18912/20975/22443",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f102-1",
    "title": "Rev. IHGRGS",
    "url": "https://seer.ufrgs.br/index.php/revistaihgrgs/article/view/133689",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f103-1",
    "title": "Interacções (RCAAP)",
    "url": "https://revistas.rcaap.pt/interaccoes/article/view/3911",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f105-1",
    "title": "Interacções (RCAAP)",
    "url": "https://revistas.rcaap.pt/interaccoes/article/view/3911",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f109-1",
    "title": "Infopédia, Viradeira (excerto)",
    "url": "https://www.infopedia.pt/artigos/$viradeira",
    "accessed": "2026-10-31",
    "kind": "enciclopedia"
  },
  {
    "id": "xviii-f111-1",
    "title": "RCAAP (PDF)",
    "url": "https://comum.rcaap.pt/bitstreams/c54b8b25-09b4-4dc8-9923-c9f5380f5caa/download",
    "accessed": "2026-10-31",
    "kind": "academica"
  },
  {
    "id": "xviii-f112-1",
    "title": "Diaita (UC)",
    "url": "https://impactum-journals.uc.pt/diaita/article/download/14381/10141/67238",
    "accessed": "2026-10-31",
    "kind": "academica"
  }
],
  items,
  lessons: [],
};
