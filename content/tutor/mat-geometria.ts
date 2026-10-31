import type { TutorLesson } from './index';

export const geometriaLessons: TutorLesson[] = [
  {
    id: 'mat-circulo', curriculumRef: 'DGE — Aprendizagens Essenciais, 6.º ano: Círculo', review: 'needs-human-review',
    explanation: ['O raio liga o centro a um ponto da circunferência. O diâmetro passa pelo centro e mede o dobro do raio: d = 2r.', 'O perímetro mede o contorno. Calcula-se por P = πd ou P = 2πr. Se conheces o perímetro, divide por π para encontrar o diâmetro.', 'A área mede a superfície interior do círculo: A = πr². Usa unidades quadradas, como cm², enquanto o perímetro usa cm.', 'Quando o problema dá π≈3,14, usa esse valor em todos os passos. Podes calcular em centésimas inteiras e converter só no fim; não arredondes a meio.'],
    examples: [
      { title: 'Mesa de raio 10 dm: área com π≈3,14', steps: ['O quadrado do raio é 10 × 10 = 100 dm².', 'Em centésimas: 314 × 100 = 31400; dividindo por 100, a área é 314 dm².'], result: 314, compute: () => 314 * 10 * 10 / 100 },
      { title: 'Pista de perímetro 314 m: diâmetro com π≈3,14', steps: ['P = πd, pelo que d = P ÷ π.', 'Multiplica dividendo e divisor por 100: 31400 ÷ 314 = 100 m.'], result: 100, compute: () => 31400 / 314 },
    ], checklist: ['Distingo raio e diâmetro.', 'Escolho perímetro ou área.', 'Uso o valor de π indicado.', 'Indico a unidade correta.'], commonErrors: ['Não uses o diâmetro como raio na fórmula da área.', 'O perímetro mede um contorno, não uma superfície.'],
  },
  {
    id: 'mat-angulos', curriculumRef: 'DGE — Aprendizagens Essenciais, 6.º ano: Ângulos e polígonos', review: 'needs-human-review',
    explanation: ['Dois ângulos complementares somam 90°. Dois ângulos suplementares somam 180°. Subtrai o ângulo conhecido ao total apropriado.', 'Os ângulos internos de um triângulo somam 180°. Um ângulo externo, formado pelo prolongamento de um lado, é suplementar do interno adjacente e igual à soma dos dois internos não adjacentes.', 'Um quadrilátero pode dividir-se em dois triângulos por uma diagonal interior. Por isso os seus ângulos internos somam 360°.', 'Num polígono convexo, todos os ângulos internos são inferiores a 180°; um polígono côncavo tem um ângulo interno superior a 180°. Um polígono regular tem todos os lados iguais e todos os ângulos iguais.'],
    examples: [
      { title: 'Complementar de 37°', steps: ['Os complementares somam 90°.', 'Subtrai: 90 − 37 = 53°.'], result: 53, compute: () => 90 - 37 },
      { title: 'Triângulo com dois ângulos de 48° e 62°', steps: ['Soma os conhecidos: 48 + 62 = 110°.', 'O terceiro mede 180 − 110 = 70°.'], result: 70, compute: () => 180 - 48 - 62 },
    ], checklist: ['Escolho entre 90°, 180° e 360°.', 'Identifico ângulos internos e externos.', 'Verifico lados e ângulos para decidir a regularidade.'], commonErrors: ['Não troques complementar com suplementar.', 'Lados iguais, por si só, não garantem um polígono regular.'],
  },
  {
    id: 'mat-volumes', curriculumRef: 'DGE — Aprendizagens Essenciais, 6.º ano: Volumes', review: 'needs-human-review',
    explanation: ['O volume mede o espaço ocupado. Numa caixa retangular, conta os cubos unitários por camada e multiplica pelo número de camadas: V = comprimento × largura × altura.', 'No cubo, todas as arestas são iguais, por isso V = aresta³. Para encontrar uma altura em falta, divide o volume pela área da base.', 'No cilindro, a base é circular: V = πr²h. Confirma se o enunciado dá raio ou diâmetro e usa a aproximação de π indicada.', 'Um decímetro cúbico corresponde a um litro. Uma caixa com medidas interiores em dm tem capacidade em litros numericamente igual ao volume em dm³; usa medidas interiores para a capacidade.'],
    examples: [
      { title: 'Caixa de 4 cm por 3 cm por 5 cm', steps: ['Cada camada contém 4 × 3 = 12 cubos de 1 cm³.', 'Cinco camadas contêm 12 × 5 = 60 cubos: volume 60 cm³.'], result: 60, compute: () => 4 * 3 * 5 },
      { title: 'Cilindro de raio 10 cm e altura 2 cm, com π≈3,14', steps: ['A base tem área 314 × 10 × 10 ÷ 100 = 314 cm².', 'Multiplica pela altura: 314 × 2 = 628 cm³.'], result: 628, compute: () => 314 * 10 * 10 * 2 / 100 },
    ], checklist: ['Uso as três dimensões na mesma unidade.', 'Calculo a área da base.', 'Multiplico pela altura.', 'Relaciono dm³ com litros.'], commonErrors: ['Somar arestas não calcula o volume.', 'No cilindro, divide o diâmetro por 2 antes de calcular a área da base.'],
  },
  {
    id: 'mat-rotacoes', curriculumRef: 'DGE — Aprendizagens Essenciais, 6.º ano: Rotações e simetrias', review: 'needs-human-review',
    explanation: ['Uma rotação precisa de centro, amplitude e sentido. O sentido positivo é contrário ao dos ponteiros do relógio. A distância ao centro mantém-se.', 'Uma volta completa mede 360°. Num polígono regular de n lados, a menor rotação positiva em torno do centro que o sobrepõe a si próprio mede 360° ÷ n. Numa rosácea de ordem n vale a mesma relação.', 'Um polígono regular de n lados tem n eixos de simetria de reflexão. A reflexão e a rotação são transformações diferentes: um eixo é uma reta e o centro de rotação é um ponto.', 'Rotações sucessivas com o mesmo centro e sentido somam-se. Retira voltas completas para obter uma amplitude entre 0° e 360°. Para um ponto marcado voltar à posição inicial, o total rodado deve ser um múltiplo de 360°.'],
    examples: [
      { title: 'Octógono regular de centro O, sentido positivo', steps: ['Há 8 posições equivalentes numa volta.', 'O menor ângulo positivo é 360 ÷ 8 = 45°.'], result: 45, compute: () => 360 / 8 },
      { title: 'Rotações de 250° e 170° em torno de O, ambas positivas', steps: ['Soma as amplitudes: 250 + 170 = 420°.', 'Retira uma volta: 420 − 360 = 60°.'], result: 60, compute: () => (250 + 170) % 360 },
    ], checklist: ['Indico centro e sentido.', 'Divido 360° pela ordem da simetria.', 'Distingo eixos de reflexão de rotações.', 'Retiro voltas completas numa composição.'], commonErrors: ['Não dividas 180° pelo número de lados para encontrar a rotação mínima.', 'Com o mesmo centro e sentido, soma as amplitudes.'],
  },
];
