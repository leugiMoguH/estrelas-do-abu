import type { HgpBank, HgpItem, HgpSkill } from './schema';

/**
 * Banco HGP — grupo G: «Recuperar aprendizagens — 5.º ano» (séculos XV e XVI; União Ibérica e Restauração).
 * Subdivisões de trabalho fundamentadas nas Aprendizagens Essenciais do 5.º ano e em fontes históricas consultadas;
 * ainda sem correspondência editorial confirmada com o índice do manual (ver content/historia/estrutura.ts).
 * Factos conferidos pelo autor contra as fontes indicadas (excertos de pesquisa); sem revisão independente.
 */
const ACC = '2026-10-31';
const TOPIC = 'hgp-recuperacao-5' as const;
const items: HgpItem[] = [];
let n = 0;
const base = (sub: string, skill: HgpSkill, difficulty: 1 | 2 | 3, prompt: string, explanation: string, hints: readonly string[], sources: readonly string[]) => ({
  id: `hgp-recuperacao-5-${String(++n).padStart(2, '0')}`, topic: TOPIC, sub, skill, difficulty, prompt, explanation, hints, sources,
});
const q = (sub: string, skill: HgpSkill, difficulty: 1 | 2 | 3, prompt: string, correct: string, wrong: Readonly<Record<string, string>>, explanation: string, hints: readonly string[], sources: readonly string[], stimulus?: string): void => {
  items.push({ ...base(sub, skill, difficulty, prompt, explanation, hints, sources), kind: 'mcq', options: [correct, ...Object.keys(wrong)], correct, wrong, ...(stimulus ? { stimulus } : {}) });
};
const num = (sub: string, skill: HgpSkill, difficulty: 1 | 2 | 3, prompt: string, correct: number, explanation: string, hints: readonly string[], sources: readonly string[]): void => {
  items.push({ ...base(sub, skill, difficulty, prompt, explanation, hints, sources), kind: 'numeric', correct });
};
const cl = (sub: string, difficulty: 1 | 2 | 3, prompt: string, correct: readonly (readonly string[])[], explanation: string, hints: readonly string[], sources: readonly string[]): void => {
  items.push({ ...base(sub, 'conceito', difficulty, prompt, explanation, hints, sources), kind: 'cloze', correct });
};
const order = (sub: string, difficulty: 1 | 2 | 3, prompt: string, correct: readonly string[], explanation: string, hints: readonly string[], sources: readonly string[]): void => {
  items.push({ ...base(sub, 'cronologia', difficulty, prompt, explanation, hints, sources), kind: 'order', items: [...correct].reverse(), correct });
};

// ───────────── Portugal nos séculos XV e XVI ─────────────
num('xv-xvi', 'cronologia', 1, 'Em que ano os portugueses conquistaram Ceuta, no norte de África, num marco do início da expansão marítima?', 1415,
  'Em 1415, no reinado de D. João I, os portugueses conquistaram Ceuta. Esta conquista é um marco do início da expansão. Deu aos portugueses um ponto de apoio no norte de África.',
  ['É um ano do século XV.', 'Foi no reinado de D. João I, o primeiro rei da dinastia de Avis.'], ['r5-imp']);
q('xv-xvi', 'causa', 2, 'Qual destes motivos da expansão marítima é de natureza religiosa?',
  'Combater os muçulmanos e espalhar a religião cristã', {
    'Procurar ouro, especiarias e outros produtos valiosos': 'Esse é um motivo económico: o comércio e a riqueza.',
    'Aumentar o prestígio do rei e da nobreza': 'Esse é um motivo político: o poder e o prestígio.',
    'Conhecer melhor os mares, as terras e os povos': 'Esse é um motivo científico e de curiosidade.',
  }, 'A expansão teve vários motivos. Os religiosos ligavam-se à luta contra os muçulmanos e à difusão do cristianismo. Havia também motivos económicos, políticos e científicos, que se somavam.',
  ['Procura a palavra que se liga à fé.', 'Pensa em «cruzada» e em levar o cristianismo a outras terras.'], ['r5-b44', 'r5-plan']);
q('xv-xvi', 'causa', 2, 'Qual destes motivos da expansão marítima é de natureza económica?',
  'Obter ouro, especiarias e novos mercados para o comércio', {
    'Converter povos ao cristianismo': 'Esse é um motivo religioso.',
    'Afirmar o poder da monarquia portuguesa': 'Esse é um motivo político.',
    'Melhorar os instrumentos de navegação': 'Isso foi um meio e uma consequência técnica, não o motivo económico.',
  }, 'O motivo económico refere-se à riqueza: ouro, especiarias e novos mercados. Os produtos do Oriente eram muito valiosos na Europa. Procurar chegar a eles era um forte incentivo às viagens.',
  ['Pensa em dinheiro e comércio.', 'As especiarias valiam muito na Europa.'], ['r5-b42', 'r5-b44']);
q('xv-xvi', 'personagem', 1, 'Que infante português promoveu e financiou muitas viagens de exploração da costa africana?',
  'O infante D. Henrique', {
    'O rei D. Afonso Henriques': 'D. Afonso Henriques fundou Portugal no século XII, muito antes.',
    'O rei D. Dinis': 'D. Dinis reinou nos séculos XIII e XIV, antes da expansão marítima.',
    'O rei D. Sebastião': 'D. Sebastião reinou no século XVI e morreu em Alcácer Quibir, em 1578.',
  }, 'O infante D. Henrique, filho de D. João I, promoveu e financiou muitas explorações da costa africana. Foi uma figura importante do início da expansão. Os navegadores portugueses foram avançando para sul, ano após ano.',
  ['Era um infante, não um rei.', 'Era filho de D. João I e ficou ligado ao início das viagens.'], ['r5-imp', 'r5-plan']);
q('xv-xvi', 'conceito', 2, 'Porque foi a caravela importante nas viagens dos Descobrimentos?',
  'Era leve e manobrável e as suas velas ajudavam a navegar mesmo com ventos pouco favoráveis', {
    'Era movida por centenas de remadores e não precisava de vento': 'A caravela navegava à vela; não era uma galé de remos.',
    'Era um barco muito pesado, feito para combates em rios': 'A caravela era leve e própria para o mar alto e a costa.',
    'Era um barco só para transportar gado': 'A caravela servia sobretudo para explorar e navegar.',
  }, 'A caravela era um navio leve, rápido e fácil de manobrar. As suas velas triangulares ajudavam a navegar mesmo com ventos pouco favoráveis. Por isso foi muito usada nas viagens de exploração.',
  ['Pensa nas qualidades de um barco de exploração.', 'Leve e fácil de manobrar.'], ['r5-b44']);
cl('xv-xvi', 2, 'Para saber a sua posição no mar, os navegadores usavam a bússola e o ___.', [['astrolábio', 'astrolabio', 'quadrante']],
  'A bússola indicava a direção e o astrolábio ou o quadrante permitiam medir a altura dos astros. Assim os navegadores calculavam a latitude. Estes instrumentos tornaram as viagens mais seguras.',
  ['É um instrumento para medir a altura dos astros.', 'Começa por «astro».'], ['r5-b44']);
order('xv-xvi', 2, 'Ordena o início dos reinados destes reis da dinastia de Avis, do mais antigo para o mais recente.',
  ['D. João I (1385)', 'D. João II (1481)', 'D. Manuel I (1495)', 'D. João III (1521)'],
  'D. João I iniciou a dinastia de Avis em 1385. Seguiram-se D. João II, em 1481, D. Manuel I, em 1495, e D. João III, em 1521. A expansão marítima atravessou todos estes reinados.',
  ['Compara os anos entre parênteses.', 'D. Manuel I é o rei de Vasco da Gama e de Cabral.'], ['r5-plan', 'r5-imp']);
q('xv-xvi', 'vf', 3, '«A expansão marítima portuguesa começou no reinado de D. Manuel I.» Qual é a correção certa?',
  'Falsa: começou antes, no reinado de D. João I, com a conquista de Ceuta, em 1415', {
    'Verdadeira: D. Manuel I mandou conquistar Ceuta': 'Ceuta foi conquistada em 1415, no reinado de D. João I.',
    'Falsa: começou no reinado de D. Sebastião, em 1578': 'Em 1578 terminou o reinado de D. Sebastião, em Alcácer Quibir; a expansão já vinha de muito antes.',
  }, 'A expansão marítima começou no reinado de D. João I, com a conquista de Ceuta, em 1415. D. Manuel I reinou mais tarde, entre 1495 e 1521. No seu reinado chegaram à Índia e ao Brasil, mas as viagens já tinham começado há quase cem anos.',
  ['Pensa no marco de 1415.', 'Compara 1415 com o início do reinado de D. Manuel I.'], ['r5-imp', 'r5-plan']);
num('xv-xvi', 'cronologia', 2, 'Em que ano D. João I foi aclamado rei, iniciando a dinastia de Avis?', 1385,
  'D. João I foi aclamado rei em 1385, nas Cortes de Coimbra. Iniciou a dinastia de Avis, que governou durante a época da expansão. Ceuta seria conquistada trinta anos depois.',
  ['É um ano do século XIV.', 'Aconteceu depois da crise de 1383–1385.'], ['r5-plan']);

// ───────────── Expansão marítima portuguesa ─────────────
order('expansao', 2, 'Ordena estas viagens e chegadas, da mais antiga para a mais recente.',
  ['Gil Eanes dobra o Cabo Bojador (1434)', 'Bartolomeu Dias dobra o Cabo da Boa Esperança (1488)', 'Vasco da Gama chega à Índia (1498)', 'Pedro Álvares Cabral chega ao Brasil (1500)'],
  'Gil Eanes dobrou o Cabo Bojador em 1434. Bartolomeu Dias dobrou o Cabo da Boa Esperança em 1488 e Vasco da Gama chegou à Índia em 1498. Cabral chegou ao Brasil em 1500.',
  ['Compara os anos entre parênteses.', 'O percurso foi avançando para sul e depois para o Oriente.'], ['r5-imp']);
q('expansao', 'personagem', 1, 'Quem chegou à Índia por mar, em 1498?',
  'Vasco da Gama', {
    'Bartolomeu Dias': 'Bartolomeu Dias dobrou o Cabo da Boa Esperança em 1488, mas não chegou à Índia.',
    'Pedro Álvares Cabral': 'Pedro Álvares Cabral chegou ao Brasil, em 1500.',
    'Gil Eanes': 'Gil Eanes dobrou o Cabo Bojador, em 1434.',
  }, 'Vasco da Gama chegou à Índia por mar em 1498. Abriu a rota marítima entre Portugal e o Oriente, contornando África. Bartolomeu Dias tinha aberto caminho dez anos antes.',
  ['Chegou à cidade de Calecute.', 'Foi depois de Bartolomeu Dias.'], ['r5-imp']);
num('expansao', 'cronologia', 1, 'Em que ano Pedro Álvares Cabral chegou ao Brasil?', 1500,
  'Pedro Álvares Cabral chegou ao Brasil em 1500. Ia a caminho da Índia, com uma grande armada. O Brasil passou a fazer parte do império português.',
  ['É um ano redondo.', 'Foi dois anos depois de Vasco da Gama chegar à Índia.'], ['r5-imp']);
q('expansao', 'facto', 2, 'Qual foi a importância da viagem de Bartolomeu Dias, em 1488?',
  'Dobrou o Cabo da Boa Esperança, abrindo o caminho do Atlântico para o oceano Índico', {
    'Chegou à Índia pela primeira vez': 'A chegada à Índia foi de Vasco da Gama, em 1498.',
    'Descobriu o Brasil': 'O Brasil foi alcançado por Cabral, em 1500.',
    'Dobrou o Cabo Bojador': 'O Cabo Bojador foi dobrado por Gil Eanes, em 1434.',
  }, 'Bartolomeu Dias dobrou o Cabo da Boa Esperança, no extremo sul de África. Mostrou que era possível passar do Atlântico para o oceano Índico. Foi um passo decisivo para a viagem de Vasco da Gama.',
  ['Fica no extremo sul de África.', 'Foi dez anos antes de Vasco da Gama chegar à Índia.'], ['r5-imp']);
q('expansao', 'facto', 3, 'O que decidiu o Tratado de Tordesilhas, de 1494?',
  'Dividiu as terras a descobrir entre Portugal e Castela', {
    'Terminou a guerra entre Portugal e a Inglaterra': 'Tordesilhas foi assinado entre Portugal e Castela, não com a Inglaterra.',
    'Entregou Ceuta a Castela': 'Ceuta tinha sido conquistada por Portugal em 1415 e não foi o tema do tratado.',
    'Casou o rei de Portugal com a rainha de Castela': 'O tratado dividiu zonas de navegação e conquista; não foi um casamento.',
  }, 'O Tratado de Tordesilhas, de 1494, dividiu entre Portugal e Castela as terras que viessem a ser descobertas. Evitou conflitos entre os dois reinos. Mostra a importância que as descobertas tinham para as duas coroas.',
  ['Foi um acordo entre dois reinos ibéricos.', 'Falava de terras ainda por descobrir.'], ['r5-imp', 'r5-plan']);
cl('expansao', 2, 'Em 1434, Gil Eanes dobrou o cabo ___, que muitos consideravam o limite do mundo conhecido.', [['Bojador']],
  'Gil Eanes dobrou o Cabo Bojador em 1434. Até então, muitos navegadores tinham medo de ir mais longe. A viagem provou que se podia continuar para sul.',
  ['O nome começa por B.', 'Fica na costa de África, ao sul das Canárias.'], ['r5-imp']);
q('expansao', 'causa', 3, 'Porque era importante chegar à Índia por mar?',
  'Permitia comprar especiarias diretamente no Oriente, com menos intermediários', {
    'Porque na Índia havia ouro suficiente para pagar a defesa de Ceuta': 'O objetivo principal era o comércio de especiarias, não o pagamento da defesa de Ceuta.',
    'Porque a rota por terra tinha sido aberta pelos portugueses': 'A rota por terra era controlada por outros povos; os portugueses procuraram uma rota marítima.',
    'Porque o Papa tinha obrigado Portugal a ir à Índia': 'A viagem foi uma decisão da Coroa portuguesa, ligada ao comércio.',
  }, 'A rota marítima para a Índia permitia aos portugueses comprar especiarias diretamente no Oriente. Evitavam alguns intermediários, o que aumentava os lucros. Por isso a viagem de Vasco da Gama foi tão importante.',
  ['Pensa nos produtos valiosos do Oriente.', 'Menos intermediários significa maiores lucros.'], ['r5-b42', 'r5-b44']);
num('expansao', 'cronologia', 3, 'Quantos anos passaram entre a chegada de Bartolomeu Dias ao Cabo da Boa Esperança (1488) e a chegada de Vasco da Gama à Índia (1498)?', 10,
  'Subtrai-se 1488 a 1498, o que dá 10 anos. Foi o tempo que separou a abertura do caminho para o oceano Índico da chegada à Índia. Entre as duas viagens preparou-se a grande armada de Vasco da Gama.',
  ['Subtrai o ano mais antigo ao mais recente.', 'Os dois anos têm a mesma terminação, 8.'], ['r5-imp']);

// ───────────── Intercâmbio e choque de culturas ─────────────
q('intercambio', 'facto', 1, 'Que produtos valiosos vinham do Oriente para Portugal?',
  'Especiarias, como a pimenta e a canela', {
    'Trigo e centeio': 'Os cereais produziam-se na Europa; do Oriente vinham sobretudo as especiarias.',
    'Lã e linho': 'Esses tecidos produziam-se na Europa; do Oriente vinham especiarias e outros produtos de luxo.',
    'Batata e milho': 'A batata e o milho vieram da América, não do Oriente.',
  }, 'Do Oriente vinham especiarias como a pimenta e a canela, muito valiosas na Europa. Os portugueses compravam-nas e vendiam-nas em Lisboa e noutros mercados. Eram uma das principais riquezas do comércio ultramarino.',
  ['Servem para temperar os alimentos.', 'Eram muito caras na Europa.'], ['r5-b42']);
q('intercambio', 'conceito', 2, 'O que era uma feitoria?',
  'Um entreposto comercial fortificado, onde se guardavam e trocavam mercadorias', {
    'Uma fábrica de tecidos no interior de Portugal': 'As feitorias ficavam em costas distantes e serviam o comércio ultramarino.',
    'Um navio de guerra do rei': 'Uma feitoria era um local em terra, não um navio.',
    'Uma escola para marinheiros': 'Uma feitoria era um posto de comércio, não uma escola.',
  }, 'A feitoria era um entreposto comercial, muitas vezes fortificado, junto à costa. Nela guardavam-se e trocavam-se mercadorias com os povos locais. Foi uma forma de organizar o comércio sem conquistar grandes territórios.',
  ['A palavra liga-se a «fazer» negócio.', 'Ficava num local distante da Europa.'], ['r5-b44']);
cl('intercambio', 2, 'O milho, a batata e o tabaco chegaram à Europa vindos da ___.', [['América', 'America']],
  'O milho, a batata e o tabaco são plantas originárias da América. Chegaram à Europa depois das viagens de descoberta. Mudaram a alimentação e os hábitos de muitos povos.',
  ['É um continente a oeste da Europa.', 'Cabral chegou a uma terra desse continente em 1500.'], ['r5-plan']);
q('intercambio', 'conceito', 2, 'Qual destas situações é um exemplo de intercâmbio, isto é, de troca entre culturas?',
  'Plantas, produtos, ideias e palavras passaram de um povo para outro', {
    'Um povo destruiu as casas do outro e fugiu': 'Isso é um conflito, não uma troca entre culturas.',
    'Dois povos nunca chegaram a contactar': 'O intercâmbio exige contacto entre povos.',
    'Os portugueses ficaram sempre em Portugal': 'Sem viagens não havia contacto e troca entre culturas.',
  }, 'Intercâmbio é a troca entre culturas: produtos, plantas, ideias, técnicas e palavras passam de um povo para outro. As viagens portuguesas aumentaram essas trocas. Nem todas as relações foram pacíficas.',
  ['A palavra «troca» ajuda.', 'Procura a opção em que algo passa de um povo para outro.'], ['r5-plan', 'r5-b44']);
q('intercambio', 'conceito', 3, 'Qual destas situações mostra um choque de culturas?',
  'Povos africanos foram escravizados e povos de várias regiões foram pressionados a mudar de religião e de costumes', {
    'Um mercador trocou pimenta por tecidos de forma pacífica': 'Essa é uma troca comercial, um intercâmbio.',
    'Uma planta nova foi cultivada em Portugal': 'Isso é um exemplo de intercâmbio de produtos.',
    'Um navegador desenhou um mapa melhor': 'Isso é progresso do conhecimento, não um choque entre povos.',
  }, 'O choque de culturas acontece quando o contacto entre povos traz violência, imposição ou domínio. A escravização de africanos e as conversões forçadas são exemplos. É o lado negativo do contacto entre povos.',
  ['Procura violência ou imposição.', 'O oposto de uma troca pacífica.'], ['r5-b44', 'r5-plan']);
q('intercambio', 'vf', 3, '«O contacto entre portugueses e outros povos foi sempre pacífico e só trouxe vantagens.» Qual é a correção certa?',
  'Falsa: houve trocas vantajosas, mas também guerras, escravização e imposição de costumes', {
    'Verdadeira: nunca houve conflitos': 'Houve conflitos, escravização e imposição de costumes.',
    'Falsa: nunca houve qualquer troca de produtos': 'Houve muitas trocas de produtos, plantas e ideias.',
  }, 'O contacto entre povos trouxe trocas de produtos, plantas, ideias e técnicas. Trouxe também guerras, escravização e imposição de costumes. A história da expansão tem estes dois lados.',
  ['Pensa nos dois lados do contacto.', 'Procura a resposta equilibrada.'], ['r5-b44']);

// ───────────── Consequências da expansão portuguesa (subdivisão de trabalho) ─────────────
q('consequencias', 'facto', 1, 'Que cidade se tornou o grande porto do comércio das especiarias em Portugal?',
  'Lisboa', {
    'Évora': 'Évora fica no interior do Alentejo, longe do mar.',
    'Bragança': 'Bragança fica no interior, no Nordeste do país.',
    'Guimarães': 'Guimarães fica no interior do Minho.',
  }, 'Lisboa tornou-se o grande porto do comércio com o Oriente. Aí chegavam as especiarias e outros produtos. Foi uma das cidades mais ricas e movimentadas da Europa.',
  ['Fica na foz de um grande rio.', 'É a capital do reino.'], ['r5-b42', 'r5-b44']);
q('consequencias', 'conceito', 2, 'O que era a Casa da Índia, em Lisboa?',
  'Uma instituição do rei que organizava e controlava o comércio com o Oriente', {
    'Um mosteiro onde viviam os navegadores': 'A Casa da Índia era uma instituição de comércio, não um mosteiro.',
    'Uma fábrica de bússolas e astrolábios': 'A Casa da Índia organizava o comércio, não fabricava instrumentos.',
    'A residência dos reis da Índia': 'Era uma instituição portuguesa, em Lisboa.',
  }, 'A Casa da Índia era uma instituição régia, em Lisboa, que organizava o comércio com o Oriente. Aí se recebiam e vendiam as mercadorias. Permitia à Coroa controlar e lucrar com esse comércio.',
  ['Ficava em Lisboa.', 'Servia para organizar o comércio de especiarias.'], ['r5-b44']);
q('consequencias', 'consequencia', 2, 'Que estilo de arquitetura, com motivos ligados ao mar, se desenvolveu no reinado de D. Manuel I?',
  'O estilo manuelino', {
    'O estilo barroco': 'O barroco é posterior, do século XVIII, no tempo de D. João V.',
    'O estilo românico': 'O românico é muito anterior, da Idade Média.',
    'O estilo moderno': 'O estilo moderno é muito mais recente.',
  }, 'O estilo manuelino surgiu no reinado de D. Manuel I. Usa muitos motivos ligados ao mar e às descobertas, como cordas, conchas e esferas armilares. O Mosteiro dos Jerónimos e a Torre de Belém são exemplos.',
  ['O nome vem do rei D. Manuel I.', 'Os motivos lembram o mar e as viagens.'], ['r5-b44']);
q('consequencias', 'consequencia', 1, 'Que mudança trouxeram as viagens portuguesas ao conhecimento do mundo?',
  'Os europeus passaram a conhecer melhor rotas, continentes e povos', {
    'Deixou de ser possível navegar no oceano': 'As viagens mostraram que era possível navegar para longe.',
    'A Europa ficou a saber menos sobre os outros continentes': 'As descobertas aumentaram o conhecimento sobre outros continentes.',
    'Os mapas deixaram de ser usados': 'Os mapas e as cartas náuticas tornaram-se mais importantes.',
  }, 'As viagens portuguesas deram a conhecer rotas, costas, continentes e povos. Os mapas e as cartas náuticas melhoraram. A Europa passou a ter uma visão muito mais ampla do mundo.',
  ['As viagens serviram para explorar.', 'Procura o aumento de conhecimento.'], ['r5-b44']);
q('consequencias', 'personagem', 3, 'Que obra de Luís de Camões, publicada em 1572, canta as viagens e os feitos dos portugueses?',
  'Os Lusíadas', {
    'A Cantiga de Amigo': 'As cantigas de amigo são medievais e não são uma obra de Camões.',
    'O Memorial do Convento': 'O Memorial do Convento é um romance moderno, de José Saramago.',
    'A Peregrinação': 'A Peregrinação é de Fernão Mendes Pinto e conta as suas viagens.',
  }, 'Os Lusíadas, de Luís de Camões, foram publicados em 1572. Cantam as viagens portuguesas, em especial a de Vasco da Gama à Índia. É a grande epopeia da língua portuguesa.',
  ['Fala de Vasco da Gama.', 'O título refere o povo português: os «lusos».'], ['r5-b44']);
num('consequencias', 'cronologia', 2, 'Quantos anos passaram entre a chegada de Vasco da Gama à Índia (1498) e a conquista de Goa por Afonso de Albuquerque (1510)?', 12,
  'Subtrai-se 1498 a 1510, o que dá 12 anos. Goa, conquistada em 1510, tornou-se a capital do Estado da Índia. Mostra como Portugal passou do comércio à presença permanente no Oriente.',
  ['Subtrai o ano mais antigo ao mais recente.', '1510 menos 1498.'], ['r5-imp']);
q('consequencias', 'consequencia', 3, 'Qual destes grupos teve grandes lucros com o comércio ultramarino?',
  'A Coroa e os mercadores ligados ao comércio com o Oriente', {
    'Os camponeses sem terras do interior': 'Os lucros concentraram-se na Coroa e nos mercadores, não nos camponeses sem terras.',
    'Os mosteiros do Norte do país': 'Os mosteiros não eram o grupo principal do comércio ultramarino.',
    'Os piratas do mar Mediterrâneo': 'Os lucros do comércio ultramarino iam sobretudo para a Coroa e os mercadores.',
  }, 'O comércio ultramarino enriqueceu sobretudo a Coroa e os mercadores ligados ao comércio com o Oriente. O rei controlava o comércio através da Casa da Índia. Nem toda a população beneficiou da mesma forma.',
  ['O rei controlava o comércio.', 'Pensa em quem comprava e vendia as especiarias.'], ['r5-b44']);

// ───────────── Da União Ibérica à Restauração da Independência ─────────────
num('uniao-restauracao', 'cronologia', 2, 'Quantos anos durou a União Ibérica, de 1580 a 1640?', 60,
  'Subtrai-se 1580 a 1640, o que dá 60 anos. Durante esse período Portugal e Espanha tiveram o mesmo rei. A União Ibérica terminou com a Restauração da Independência.',
  ['Subtrai o ano mais antigo ao mais recente.', '1640 menos 1580.'], ['r5-crise', 'r5-rest']);
q('uniao-restauracao', 'facto', 1, 'O que aconteceu a Portugal entre 1580 e 1640?',
  'Portugal e Espanha tiveram o mesmo rei, na chamada União Ibérica', {
    'Portugal foi governado por reis ingleses': 'Os reis eram da casa real espanhola, não da Inglaterra.',
    'Portugal esteve sem rei durante sessenta anos': 'Houve rei: os reis de Espanha eram também reis de Portugal.',
    'Portugal conquistou Espanha e passou a governá-la': 'Foi o contrário: o rei de Espanha tornou-se rei de Portugal.',
  }, 'Entre 1580 e 1640, Portugal e Espanha tiveram o mesmo rei: foi a União Ibérica. Os reis de Espanha foram também reis de Portugal. Terminou com a Restauração da Independência, em 1640.',
  ['Pensa em dois países vizinhos e num só rei.', 'Foi um período de cerca de sessenta anos.'], ['r5-crise', 'r5-rest']);
q('uniao-restauracao', 'consequencia', 2, 'Que acontecimento pôs fim à União Ibérica?',
  'A Restauração da Independência, em 1 de dezembro de 1640', {
    'A Batalha de Aljubarrota, em 1385': 'Aljubarrota é muito anterior e ligada à crise de 1383–1385.',
    'A chegada de Vasco da Gama à Índia': 'Isso aconteceu em 1498, antes da União Ibérica.',
    'A morte do Cardeal D. Henrique': 'A morte do cardeal, em 1580, abriu a crise que levou à União Ibérica.',
  }, 'A União Ibérica terminou com a Restauração da Independência, em 1 de dezembro de 1640. Um grupo de nobres e letrados pôs fim ao governo dos Filipes. O duque de Bragança foi aclamado rei com o nome de D. João IV.',
  ['Aconteceu em 1640.', 'Foi no dia 1 de dezembro.'], ['r5-rest', 'r5-1dez']);
q('uniao-restauracao', 'comparacao', 3, 'Qual destas frases distingue corretamente 1580 de 1640?',
  'Em 1580 Portugal passou a ter o mesmo rei que Espanha; em 1640 voltou a ter rei próprio', {
    'Em 1580 Portugal teve rei próprio; em 1640 passou a ter o mesmo rei que Espanha': 'Está trocado: foi em 1580 que começou a União Ibérica.',
    'Em 1580 e em 1640 Portugal teve sempre o mesmo rei que Espanha': 'Em 1640 a independência foi restaurada, com um rei português.',
    'Em 1580 acabou a União Ibérica e em 1640 começou': 'A União Ibérica começou em 1580 e acabou em 1640.',
  }, 'Em 1580 começou a União Ibérica: o rei de Espanha tornou-se rei de Portugal. Em 1640 a independência foi restaurada e Portugal voltou a ter um rei próprio, da casa de Bragança. Os dois anos marcam o início e o fim deste período.',
  ['Um ano marca o início e o outro o fim.', '1640 é a Restauração.'], ['r5-crise', 'r5-rest']);
cl('uniao-restauracao', 1, 'A União Ibérica durou de ___ a ___.', [['1580'], ['1640']],
  'A União Ibérica começou em 1580 e terminou em 1640. Foram sessenta anos com o mesmo rei para Portugal e Espanha. Em 1640, a Restauração devolveu a Portugal um rei próprio.',
  ['Dois anos separados por sessenta.', 'O segundo é o ano da Restauração.'], ['r5-crise', 'r5-rest']);
order('uniao-restauracao', 3, 'Ordena estes acontecimentos, do mais antigo para o mais recente.',
  ['Morre D. Sebastião em Alcácer Quibir (1578)', 'Morre o Cardeal D. Henrique (1580)', 'Cortes de Tomar aclamam Filipe II (1581)', 'Alterações de Évora (1637)', 'Restauração da Independência (1640)'],
  'D. Sebastião morreu em 1578. O Cardeal D. Henrique morreu em 1580 e Filipe II foi aclamado em 1581. Em 1637 houve as Alterações de Évora e em 1640 deu-se a Restauração.',
  ['Compara os anos entre parênteses.', 'Primeiro a crise, depois a União Ibérica, por fim a Restauração.'], ['r5-crise', 'r5-tomar', 'r5-evora', 'r5-rest']);

// ───────────── Crise dinástica de 1580 e União Ibérica (subdivisão de trabalho) ─────────────
q('crise-1580', 'causa', 1, 'Porque entrou Portugal numa crise dinástica em 1580?',
  'O Cardeal D. Henrique morreu sem deixar herdeiro direto e vários pretendentes disputaram o trono', {
    'Porque o povo de Lisboa expulsou o rei': 'A crise nasceu da falta de herdeiro, não de uma expulsão do rei.',
    'Porque D. Manuel I dividiu o reino pelos filhos': 'D. Manuel I tinha morrido em 1521; a crise foi de 1578–1580.',
    'Porque a Inglaterra declarou guerra a Portugal': 'A crise foi dinástica: faltava um herdeiro claro ao trono.',
  }, 'D. Sebastião morreu em 1578, sem filhos. Reinou depois o Cardeal D. Henrique, já idoso, que morreu em 1580 sem herdeiro direto. Vários pretendentes disputaram o trono: foi a crise dinástica.',
  ['Dinástica refere-se à família real.', 'Faltava um herdeiro claro.'], ['r5-crise']);
q('crise-1580', 'personagem', 2, 'Quem foi aclamado rei de Portugal nas Cortes de Tomar, em 1581?',
  'Filipe II de Espanha, que foi Filipe I de Portugal', {
    'D. António, Prior do Crato': 'D. António foi um pretendente rival, mas não foi aclamado em Tomar.',
    'O Cardeal D. Henrique': 'O Cardeal D. Henrique tinha morrido em 1580.',
    'D. João, duque de Bragança': 'O duque de Bragança só foi aclamado rei em 1640, como D. João IV.',
  }, 'As Cortes de Tomar, em 1581, aclamaram Filipe II de Espanha como rei de Portugal, com o nome de Filipe I. Foi o início da União Ibérica. O rei jurou respeitar as leis e os costumes portugueses.',
  ['Era rei de Espanha.', 'Em Portugal ficou conhecido como Filipe I.'], ['r5-tomar', 'r5-filipe']);
q('crise-1580', 'facto', 2, 'Que prometeu Filipe II nas Cortes de Tomar?',
  'Respeitar as leis e os costumes de Portugal, mantendo o português como língua oficial', {
    'Acabar com as leis portuguesas e usar as leis de Castela': 'Prometeu respeitar as leis e os costumes portugueses.',
    'Mudar a língua oficial de Portugal para o castelhano': 'O português manteve-se como língua oficial.',
    'Entregar o império português à Inglaterra': 'Não houve nenhuma promessa desse tipo.',
  }, 'Nas Cortes de Tomar, Filipe II jurou respeitar as leis e os costumes de Portugal. O português manteve-se como língua oficial. Foi essa a base da chamada união dinástica.',
  ['Era uma promessa para tranquilizar os portugueses.', 'Fala de leis, costumes e língua.'], ['r5-tomar']);
q('crise-1580', 'conceito', 3, 'Porque se diz que a União Ibérica foi uma união dinástica?',
  'Porque os dois reinos passaram a ter o mesmo rei, mas mantiveram leis e administração próprias', {
    'Porque Portugal e Espanha se juntaram num só país, com as mesmas leis': 'Os reinos mantiveram leis e administração próprias, pelo menos no início.',
    'Porque o rei de Portugal passou a ser eleito pelo povo': 'O rei não era eleito pelo povo.',
    'Porque Portugal ficou sem rei e foi governado por uma república': 'Não houve república; houve um rei comum.',
  }, 'Numa união dinástica, os reinos partilham o mesmo rei, mas mantêm leis e administração próprias. Foi assim que a União Ibérica começou. Mais tarde, as relações tornaram-se mais tensas.',
  ['«Dinástica» liga-se à família do rei.', 'O que mudou foi o rei, não o país.'], ['r5-tomar']);
q('crise-1580', 'vf', 2, '«Em 1580, Portugal passou a ser uma província de Espanha, sem leis nem língua próprias.» Qual é a correção certa?',
  'Falsa: Portugal manteve leis, costumes e língua; o que mudou foi ter o mesmo rei que Espanha', {
    'Verdadeira: Portugal deixou de existir como reino': 'Portugal manteve-se como reino, com o mesmo rei de Espanha.',
    'Falsa: Portugal manteve o seu rei e Espanha deixou de ter rei': 'Foi o rei de Espanha que passou a ser rei de Portugal.',
  }, 'Em 1580 não foi extinto o reino de Portugal. Manteve leis, costumes e língua, mas passou a ter o mesmo rei que Espanha. Por isso se fala em união dinástica.',
  ['Pensa no que mudou: o rei ou o reino?', 'Releva a promessa de Tomar.'], ['r5-tomar', 'r5-crise']);
order('crise-1580', 2, 'Ordena esta cadeia de acontecimentos, da causa para a consequência.',
  ['D. Sebastião morre em Alcácer Quibir sem deixar filhos', 'O Cardeal D. Henrique, já idoso, torna-se rei', 'D. Henrique morre sem herdeiro e surgem vários pretendentes', 'Filipe II de Espanha é aclamado rei em Tomar'],
  'Tudo começou com a morte de D. Sebastião, sem filhos, em 1578. O Cardeal D. Henrique reinou pouco tempo e morreu em 1580 sem herdeiro direto. Filipe II de Espanha foi aclamado rei de Portugal em 1581.',
  ['Cada acontecimento é causa do seguinte.', 'Começa pela morte de D. Sebastião.'], ['r5-crise', 'r5-tomar']);

// ───────────── Portugal sob os Filipes (subdivisão de trabalho) ─────────────
q('filipes', 'facto', 1, 'Quantos reis Filipes governaram Portugal durante a União Ibérica?',
  'Três: Filipe I, Filipe II e Filipe III', {
    'Dois': 'Foram três os reis Filipes de Portugal.',
    'Cinco': 'Foram três os reis Filipes de Portugal.',
    'Nenhum, porque Portugal teve sempre reis portugueses': 'Os reis de Espanha foram também reis de Portugal entre 1580 e 1640.',
  }, 'Durante a União Ibérica governaram Portugal três reis chamados Filipe. Eram também reis de Espanha. Por isso este período é conhecido como o tempo dos Filipes.',
  ['O nome repete-se.', 'Menos de cinco.'], ['r5-filipe']);
cl('filipes', 2, 'Os três reis de Espanha que governaram Portugal entre 1580 e 1640 chamavam-se todos ___.', [['Filipe', 'Filipes']],
  'Os três reis chamavam-se Filipe. Em Portugal contam-se como Filipe I, Filipe II e Filipe III. Por isso se fala nos Filipes.',
  ['É o nome do rei aclamado em Tomar.', 'Começa por F.'], ['r5-filipe']);
q('filipes', 'causa', 2, 'Porque foi o império português atacado por holandeses e ingleses durante a União Ibérica?',
  'Porque esses povos estavam em guerra com Espanha e as terras portuguesas passaram a ser alvos', {
    'Porque Portugal declarou guerra à Holanda e à Inglaterra por vontade própria': 'Portugal estava ligado ao rei de Espanha, que era inimigo desses povos.',
    'Porque a Holanda e a Inglaterra queriam ajudar Portugal': 'Elas atacaram territórios portugueses, não os ajudaram.',
    'Porque o império português tinha ficado vazio': 'O império continuava a existir e a ser rico, por isso era um alvo.',
  }, 'A Holanda e a Inglaterra estavam em guerra com Espanha. Como o rei de Espanha era também rei de Portugal, o império português tornou-se alvo. Atacaram feitorias e territórios portugueses.',
  ['Pensa em quem estava em guerra com Espanha.', 'O mesmo rei ligava os dois impérios.'], ['r5-filipe', 'r5-rest']);
q('filipes', 'consequencia', 2, 'Que consequência teve a União Ibérica para o império português?',
  'Perderam-se territórios e rotas, atacados por inimigos de Espanha', {
    'O império cresceu sem enfrentar perigos': 'O império foi atacado e perdeu territórios.',
    'Portugal deixou de ter qualquer território fora da Europa': 'Portugal manteve muitos territórios, mas perdeu alguns.',
    'O império passou a pertencer à Inglaterra': 'Algumas terras foram perdidas, mas o império não passou para a Inglaterra.',
  }, 'Os inimigos de Espanha atacaram territórios e rotas do império português. Alguns foram perdidos. Foi uma das razões do descontentamento com a União Ibérica.',
  ['O império tornou-se alvo.', 'Procura o efeito negativo.'], ['r5-filipe', 'r5-rest']);
q('filipes', 'facto', 3, 'Quem governava Portugal em nome do rei, quando este estava em Madrid?',
  'Um vice-rei ou governadores', {
    'O Cardeal D. Henrique': 'O Cardeal D. Henrique tinha morrido em 1580.',
    'Uma assembleia de camponeses': 'O rei delegava o governo em vice-reis ou governadores.',
    'O duque de Bragança, como rei': 'O duque de Bragança só foi rei a partir de 1640.',
  }, 'O rei vivia sobretudo em Madrid. Portugal era governado em seu nome por vice-reis ou governadores. Isto aumentava o descontentamento de muitos portugueses.',
  ['O rei estava longe.', 'Alguém governava em nome dele.'], ['r5-filipe']);
num('filipes', 'cronologia', 3, 'Filipe III de Portugal começou a reinar em 1621 e a Restauração deu-se em 1640. Quantos anos reinou Filipe III de Portugal?', 19,
  'Subtrai-se 1621 a 1640, o que dá 19 anos. Foi o último rei Filipe de Portugal. O seu reinado terminou com a Restauração da Independência.',
  ['Subtrai o ano mais antigo ao mais recente.', '1640 menos 1621.'], ['r5-filipe', 'r5-rest']);

// ───────────── Descontentamento, resistência e Restauração de 1640 (subdivisão de trabalho) ─────────────
q('restauracao-1640', 'causa', 2, 'O que esteve na origem das Alterações de Évora, em 1637?',
  'A cobrança de novos impostos, num tempo de dificuldades', {
    'A conquista de Ceuta': 'Ceuta foi conquistada em 1415.',
    'A chegada de Vasco da Gama à Índia': 'Isso aconteceu em 1498.',
    'A morte de D. Sebastião': 'D. Sebastião morreu em 1578, muito antes.',
  }, 'As Alterações de Évora foram motins contra a cobrança de novos impostos, como o real de água e o encabeçamento do sal. Havia também dificuldades e fome. Mostram o descontentamento com o governo dos Filipes.',
  ['Procura uma causa ligada ao dinheiro.', 'Foi uma revolta contra o governo dos Filipes.'], ['r5-evora', 'r5-revolta1637']);
q('restauracao-1640', 'facto', 1, 'Em que data se comemora hoje a Restauração da Independência?',
  '1 de dezembro', {
    '25 de abril': 'O 25 de Abril lembra a revolução de 1974.',
    '5 de outubro': 'O 5 de Outubro lembra a implantação da República, em 1910.',
    '10 de junho': 'O 10 de Junho é o Dia de Portugal.',
  }, 'A Restauração da Independência comemora-se a 1 de dezembro, por causa do golpe de 1640. Nesse dia terminou o governo dos Filipes. O duque de Bragança foi depois aclamado rei.',
  ['Aconteceu no fim do ano.', 'É no último mês do calendário.'], ['r5-1dez', 'r5-rest']);
q('restauracao-1640', 'personagem', 2, 'Quem foi aclamado rei de Portugal em 1640?',
  'D. João, duque de Bragança, que reinou como D. João IV', {
    'D. António, Prior do Crato': 'D. António foi pretendente ao trono em 1580, não em 1640.',
    'D. Sebastião': 'D. Sebastião morreu em 1578.',
    'Filipe III': 'Filipe III era o rei de Espanha e de Portugal, afastado em 1640.',
  }, 'O duque de Bragança foi aclamado rei com o nome de D. João IV. Iniciou a dinastia de Bragança. A independência de Portugal ficou restaurada.',
  ['Era o duque de uma casa nobre portuguesa.', 'Iniciou a dinastia de Bragança.'], ['r5-rest']);
q('restauracao-1640', 'facto', 2, 'Quem organizou o golpe de 1 de dezembro de 1640?',
  'Um grupo de nobres e de letrados, que conspirou contra o governo dos Filipes', {
    'O povo de Lisboa, em grande revolta popular': 'O golpe foi preparado por um grupo de nobres e letrados; o povo não foi o seu autor.',
    'O exército espanhol': 'O exército espanhol defendia o rei de Espanha; os conjurados eram portugueses.',
    'O Papa': 'O golpe foi uma decisão de um grupo de portugueses.',
  }, 'O golpe de 1 de dezembro de 1640 foi preparado por um grupo de nobres e de letrados. Aclamaram o duque de Bragança. O povo não foi o autor do golpe.',
  ['Foi um golpe preparado em segredo.', 'Os conjurados eram portugueses nobres e letrados.'], ['r5-rest', 'r5-1dez']);
q('restauracao-1640', 'causa', 3, 'Que circunstância ajudou o sucesso da revolta de 1640?',
  'A Espanha estava envolvida noutras guerras e na revolta da Catalunha', {
    'Portugal tinha o maior exército da Europa': 'O que ajudou foi a Espanha estar ocupada noutros conflitos.',
    'A Espanha apoiou a revolta portuguesa': 'A Espanha era o inimigo da independência portuguesa.',
    'Os holandeses ocuparam Madrid': 'Os holandeses combatiam Espanha, mas não ocuparam Madrid.',
  }, 'A Espanha estava ocupada noutras guerras e numa revolta na Catalunha. Isso deu a Portugal uma oportunidade. Mesmo assim, a guerra durou quase trinta anos.',
  ['Pensa nos problemas da Espanha em 1640.', 'A Catalunha também se revoltou.'], ['r5-rest']);
q('restauracao-1640', 'conceito', 2, 'O que foi a Guerra da Restauração?',
  'A guerra entre Portugal e Espanha (1640–1668) para defender a independência portuguesa', {
    'A guerra entre Portugal e a Inglaterra pela posse de Ceuta': 'Foi uma guerra com Espanha, depois de 1640.',
    'A guerra civil entre D. Pedro e D. Miguel': 'Essa guerra civil é do século XIX.',
    'A guerra de conquista de Goa': 'Goa foi conquistada em 1510, muito antes.',
  }, 'A Guerra da Restauração foi a guerra entre Portugal e Espanha, entre 1640 e 1668. Portugal lutou para manter a independência recuperada. No fim, a independência foi reconhecida.',
  ['Começou em 1640.', 'Opôs Portugal à Espanha.'], ['r5-rest', 'r5-guerra']);
num('restauracao-1640', 'cronologia', 2, 'Quantos anos durou a Guerra da Restauração, de 1640 a 1668?', 28,
  'Subtrai-se 1640 a 1668, o que dá 28 anos. Foi uma guerra longa, com períodos de maior e menor intensidade. No fim, a independência de Portugal foi reconhecida.',
  ['Subtrai o ano mais antigo ao mais recente.', '1668 menos 1640.'], ['r5-guerra']);
order('restauracao-1640', 3, 'Ordena esta cadeia de causas e consequências, da causa para a consequência.',
  ['Aumento de impostos e descontentamento', 'Revoltas como as Alterações de Évora (1637)', 'Conspiração de nobres e letrados', 'Golpe de 1 de dezembro de 1640'],
  'O aumento de impostos causou descontentamento. Esse descontentamento levou a revoltas, como as Alterações de Évora, em 1637. Um grupo de nobres e letrados conspirou e fez o golpe de 1 de dezembro de 1640.',
  ['Cada acontecimento ajuda a explicar o seguinte.', 'O golpe é o resultado final.'], ['r5-evora', 'r5-rest']);

export const bank: HgpBank = {
  sources: [
    { id: 'r5-ae', title: 'DGE — Aprendizagens Essenciais de HGP, 5.º ano (documento oficial; só consultado por excerto de pesquisa)', url: 'https://www.dge.mec.pt/sites/default/files/5_hgp.pdf', accessed: ACC, kind: 'oficial' },
    { id: 'r5-plan', title: 'DGE — Planificação por blocos de HGP, 5.º e 6.º anos (Aprendizagens Essenciais), #EstudoEmCasa', url: 'https://estudoemcasaapoia.dge.mec.pt/sites/default/files/2022-01/planificacao_historia_e_geografia_de_portugal_5.o_e_6.o_anos_final.pdf', accessed: ACC, kind: 'oficial' },
    { id: 'r5-b42', title: 'DGE — #EstudoEmCasa, HGP 5.º e 6.º anos, Bloco 42 (Portugal nos séculos XV e XVI: conhecer as especiarias)', url: 'https://estudoautonomo.dge.mec.pt/sites/default/files/inline-files/42_HGP_5%C2%BA%20e%206%C2%BA%20anos_Portugal%20nos%20s%C3%A9culos%20XV%20e%20XVI%20conhecer%20as%20especiarias.pdf', accessed: ACC, kind: 'oficial' },
    { id: 'r5-b44', title: 'DGE — #EstudoEmCasa, HGP 5.º e 6.º anos, Bloco 44 (Portugal nos séculos XV e XVI: os efeitos da expansão marítima)', url: 'https://estudoautonomo.dge.mec.pt/sites/default/files/inline-files/44_HGP_5%C2%BA%20e%206%C2%BA%20anos_Portugal%20no%20s%C3%A9culos%20XV%20e%20XVI%20os%20efeitos%20da%20expans%C3%A3o%20mar%C3%ADtima.%20Sistematiza%C3%A7%C3%A3o%20de%20conte%C3%BAdos.pdf', accessed: ACC, kind: 'oficial' },
    { id: 'r5-imp', title: 'Infopédia — Império Colonial Português', url: 'https://www.infopedia.pt/artigos/$imperio-colonial-portugues', accessed: ACC, kind: 'enciclopedia' },
    { id: 'r5-crise', title: 'Infopédia — Crise de 1578-1580', url: 'https://www.infopedia.pt/artigos/$crise-de-1578-1580', accessed: ACC, kind: 'enciclopedia' },
    { id: 'r5-filipe', title: 'Infopédia — D. Filipe II (I de Portugal)', url: 'https://www.infopedia.pt/$d.-filipe-ii-(i-de-portugal)', accessed: ACC, kind: 'enciclopedia' },
    { id: 'r5-tomar', title: 'Universidade de Coimbra — O juramento de Tomar', url: 'https://dl.uc.pt/bitstream/10316.2/46220/1/o_juramento_de_tomar.pdf', accessed: ACC, kind: 'academica' },
    { id: 'r5-evora', title: 'Infopédia — Alterações de Évora', url: 'https://www.infopedia.pt/artigos/$alteracoes-de-evora', accessed: ACC, kind: 'enciclopedia' },
    { id: 'r5-revolta1637', title: 'Infopédia — Revolta de 1637', url: 'https://www.infopedia.pt/$revolta-de-1637', accessed: ACC, kind: 'enciclopedia' },
    { id: 'r5-rest', title: 'Infopédia — Restauração', url: 'https://www.infopedia.pt/artigos/$restauracao', accessed: ACC, kind: 'enciclopedia' },
    { id: 'r5-1dez', title: 'RFM — Sabes o que se celebra no dia 1 de dezembro?', url: 'https://rfm.pt/atualidade/3745/sabes-o-que-se-celebra-no-dia-1-de-dezembro-descobre-aqui', accessed: ACC, kind: 'enciclopedia' },
    { id: 'r5-guerra', title: 'Prepara Enem — Guerra da Restauração (1640–1668)', url: 'https://www.preparaenem.com/historia/guerra-restauracao.htm', accessed: ACC, kind: 'enciclopedia' },
  ],
  items,
  lessons: [
    {
      topic: TOPIC,
      explanation: [
        'Este capítulo recupera matéria do 5.º ano: Portugal nos séculos XV e XVI e o caminho da União Ibérica à Restauração da Independência. Segue as Aprendizagens Essenciais e fontes históricas consultadas; as subdivisões marcadas «de trabalho» ainda não têm correspondência confirmada com o índice do manual.',
        'A expansão marítima começou com a conquista de Ceuta, em 1415. Motivos religiosos, económicos, políticos e científicos juntaram-se. As viagens chegaram a Bojador (1434), ao Cabo da Boa Esperança (1488), à Índia (1498) e ao Brasil (1500).',
        'O contacto entre povos trouxe trocas de produtos, plantas e ideias, mas também guerras, escravização e imposição de costumes. Lisboa tornou-se um grande porto do comércio com o Oriente e a Coroa controlava esse comércio através da Casa da Índia.',
        'Em 1578 morreu D. Sebastião sem filhos e, em 1580, morreu o Cardeal D. Henrique sem herdeiro. Filipe II de Espanha foi aclamado rei em Tomar, em 1581: começou a União Ibérica, que durou até 1640.',
        'O descontentamento com impostos e com a perda de influência levou a revoltas, como as Alterações de Évora, em 1637. A 1 de dezembro de 1640 um grupo de nobres e letrados fez o golpe que restaurou a independência, e o duque de Bragança foi aclamado D. João IV. A Guerra da Restauração durou até 1668.',
      ],
      examples: [
        { title: 'Ordenar viagens dos Descobrimentos', steps: [
          'Escreve o ano de cada viagem: Bojador, 1434; Cabo da Boa Esperança, 1488; Índia, 1498; Brasil, 1500.',
          'Compara os anos e ordena do menor para o maior.',
          'Confere: cada viagem avançou mais longe do que a anterior.',
        ] },
        { title: 'Explicar a crise de 1580', steps: [
          'Começa pela causa: D. Sebastião morreu em 1578, sem filhos.',
          'Segue a cadeia: o Cardeal D. Henrique reinou pouco tempo e morreu em 1580 sem herdeiro.',
          'Conclui: Filipe II de Espanha foi aclamado rei de Portugal em Tomar, em 1581, e começou a União Ibérica.',
        ] },
      ],
      checklist: [
        'Ordeno as viagens dos Descobrimentos e digo quem foi cada navegador.',
        'Distingo motivos religiosos, económicos, políticos e científicos da expansão.',
        'Distingo intercâmbio de choque de culturas e dou exemplos.',
        'Explico a crise de 1580, a União Ibérica e a Restauração de 1640 com causas e consequências.',
      ],
      commonErrors: [
        'Bartolomeu Dias dobrou o Cabo da Boa Esperança (1488); a chegada à Índia foi de Vasco da Gama (1498).',
        'A União Ibérica foi uma união de reis: Portugal manteve leis, costumes e língua.',
        'A Restauração de 1640 foi preparada por nobres e letrados; o povo não foi o autor do golpe.',
        'Intercâmbio é troca entre culturas; o choque de culturas inclui violência, escravização e imposição.',
      ],
      sources: ['r5-plan', 'r5-imp', 'r5-rest'],
    },
  ],
};
