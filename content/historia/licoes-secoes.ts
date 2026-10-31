/**
 * Lição por subcapítulo de «Portugal no século XVIII». Texto reaproveitado só de afirmações já conferidas
 * (docs/hgp/seculo-xviii-factos.md). Não reproduz o manual, de que só se conhece o índice.
 */
export interface HgpSectionLesson { id: string; title: string; explanation: readonly string[] }

export const D1_SECTION_LESSONS: readonly HgpSectionLesson[] = [
  { id: 'd1-brasil-acucar', title: 'Importância do Brasil para a economia portuguesa: açúcar e escravização', explanation: [
    'O Brasil fornecia açúcar, sobretudo do Nordeste (Pernambuco e Bahia), e recebia manufaturas portuguesas e europeias. O açúcar era produzido nos engenhos.',
    'Nos engenhos passou a predominar o trabalho de africanos escravizados, levados à força de África para o Brasil pelas rotas do tráfico. Era trabalho imposto, não uma escolha livre; devem distinguir-se estas viagens forçadas das dos colonos que procuravam oportunidades.',
  ] },
  { id: 'd1-ouro-diamantes', title: 'Ouro, diamantes e escravização', explanation: [
    'No fim do século XVII (década de 1690) descobriram-se grandes jazidas de ouro em Minas Gerais. A procura de africanos escravizados para as minas aumentou, e havia também colonos atraídos pelo ouro.',
    'O quinto era o imposto de 20% do ouro, que pertencia à Coroa. Em 1729 comunicou-se oficialmente à Coroa a descoberta de diamantes no Tejuco; não é uma data segura da primeira pedra encontrada. Parte da riqueza do ouro ajudou a pagar obras de D. João V, como Mafra.',
  ] },
  { id: 'd1-legado-africano', title: 'Legado africano nas sociedades portuguesa e brasileira', explanation: [
    'Em Lisboa havia presença africana organizada: confrarias, como a do Rosário, reuniam escravizados e libertos. Nem todos os africanos de Lisboa eram escravizados.',
    'No Brasil, o legado africano vê-se na língua (palavras do quimbundo e do iorubá, como quitanda e dendê), na música (lundu e samba), na religião (muitas práticas foram perseguidas e sobreviveram em segredo ou misturadas com o catolicismo) e na culinária. Reconhecer esse legado não exige atribuir sem prova uma origem exata a cada palavra ou prato.',
  ] },
  { id: 'd1-sociedade-ordens', title: 'Sociedade de ordens do século XVIII', explanation: [
    'A sociedade dividia-se em clero, nobreza e povo (Terceiro Estado). Clero e nobreza eram ordens privilegiadas; o povo sustentava o reino com trabalho e impostos. Os escravizados não formavam uma quarta ordem.',
    'O clero tinha tribunais próprios, recebia o dízimo e possuía grandes propriedades; a nobreza ocupava os altos cargos da administração e do exército. Cristão-novo designava descendentes de judeus convertidos ao cristianismo, sujeitos a discriminação por ascendência («limpeza de sangue»); a Inquisição continuava ativa, como mostra o caso de António José da Silva, em 1739.',
  ] },
  { id: 'd1-monarquia-joao-v', title: 'Monarquia absoluta e reinado de D. João V', explanation: [
    'D. João V reinou de 1706 a 1750 e foi um rei absoluto: concentrava a autoridade suprema e não convocou as Cortes, sem que isso signifique que as aboliu. As últimas Cortes antes do liberalismo reuniram-se em 1697–98.',
    'Em 1736 criaram-se três Secretarias de Estado para ajudar o rei a governar. O fausto da Corte e as cerimónias exibiam o poder régio: a embaixada de 1716 a Roma e o título de Rei Fidelíssimo, concedido pelo Papa em 1748, são exemplos.',
  ] },
  { id: 'd1-barroco-patrimonio', title: 'Construções barrocas e património de D. João V', explanation: [
    'O Palácio-Convento de Mafra cumpriu uma promessa do rei: a primeira pedra foi lançada em 1717 e a basílica foi sagrada em 1730, continuando depois as obras. A Biblioteca Joanina, em Coimbra, foi construída entre 1717 e 1728.',
    'O Aqueduto das Águas Livres foi autorizado em 1731 e levou água a Lisboa em 1748. No barroco joanino destacam-se a talha dourada (madeira esculpida coberta de ouro) e os azulejos azuis e brancos; a Igreja e a Torre dos Clérigos, no Porto, são obras de Nicolau Nasoni. A influência barroca chegou também ao Brasil.',
  ] },
  { id: 'd1-pombal-lisboa', title: 'O Marquês de Pombal e as transformações de Lisboa e Portugal', explanation: [
    'No reinado de D. José I, o sismo de 1 de novembro de 1755 foi seguido de maremoto e incêndios; também atingiu zonas como Setúbal e o Algarve. Pombal, ministro (não rei), dirigiu politicamente a reconstrução, com técnicos como Manuel da Maia, Eugénio dos Santos e Carlos Mardel.',
    'A Baixa ganhou ruas largas e regulares e a gaiola interior de madeira procurava melhorar a resistência aos sismos. O urbanismo pombalino chegou a outras regiões: Vila Real de Santo António foi fundada em 1774.',
    'Pombal reforçou a intervenção da Coroa: Companhia das Vinhas do Alto Douro (1756), expulsão dos Jesuítas e Aulas Régias (1759), novos Estatutos da Universidade (1772) e fim da distinção legal entre cristãos-novos e cristãos-velhos (1773). As leis de 1761 e 1773 sobre escravizados valiam para o Reino; a escravatura continuou no Brasil e em África. Em 1777, D. Maria I sucedeu a D. José I e Pombal foi afastado.',
  ] },
  { id: 'd1-sintese', title: 'Síntese e avaliação dos conhecimentos', explanation: [
    'Para rever o capítulo, ordena os acontecimentos pelos reinados: D. João V (1706–1750), com Mafra, a Joanina e o Aqueduto; D. José I (1750–1777), com o terramoto de 1755 e as reformas pombalinas.',
    'Liga causas e consequências (ouro → receitas → obras que exibem o poder), compara D. João V e o governo pombalino (ambos reforçaram o poder régio, de formas diferentes) e distingue mudança de continuidade: acabou a distinção legal entre cristãos-novos e velhos, mas a escravatura continuou nas colónias.',
  ] },
  { id: 'd1-extra-novas-culturas', title: 'Complemento das AE: novas culturas (milho e batata)', explanation: [
    'O milho chegou a Portugal a partir de meados do século XVI e, no início do século XVII, já era a base da alimentação no Minho e na Beira Litoral. A batata foi aceite devagar e espalhou-se sobretudo a partir de meados do século XVIII, em tempos de crises e falta de cereais.',
    'As Aprendizagens Essenciais ligam estas culturas à melhoria da dieta e ao aumento da população. Este complemento não consta como subcapítulo confirmado do índice do manual.',
  ] },
];
