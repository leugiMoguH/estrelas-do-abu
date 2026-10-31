import type { TutorLesson } from './index';
export const mathLessons: TutorLesson[] = [
  {
    id: 'mat-racionais', curriculumRef: 'DGE — Aprendizagens Essenciais, 6.º ano: Frações e decimais', review: 'needs-human-review',
    explanation: ['Uma fração representa partes iguais de um todo. O denominador conta as partes em que o todo foi dividido.', 'O numerador conta as partes que escolhemos. Para somar, precisamos de partes do mesmo tamanho.', 'Escreve frações equivalentes com um denominador comum. Soma os numeradores e mantém esse denominador.', 'Simplifica dividindo numerador e denominador pelo mesmo divisor. Para obter um decimal, divide o numerador pelo denominador.'],
    examples: [
      { title: '3/4 + 1/8', steps: ['O denominador comum é 8.', '3/4 = 6/8.', '6/8 + 1/8 = 7/8.'], result: 0.875, compute: () => 3 / 4 + 1 / 8 },
      { title: '2/3 de 18 cromos', steps: ['Divide o todo em 3 partes: 18 ÷ 3 = 6.', 'Escolhe 2 partes: 6 × 2 = 12.', 'São 12 cromos.'], result: 12, compute: () => 18 / 3 * 2 },
    ],
    checklist: ['Identifico o todo e as partes iguais.', 'Encontro frações equivalentes.', 'Somo com um denominador comum.', 'Simplifico e converto frações em decimais.'],
    commonErrors: ['Não somes os denominadores: isso mudaria o tamanho das partes.', 'Para calcular uma fração de uma quantidade, divide primeiro pelo denominador.'],
  },
  {
    id: 'mat-prioridades', curriculumRef: 'DGE — Aprendizagens Essenciais, 6.º ano: Prioridades das operações', review: 'needs-human-review',
    explanation: ['Começa pelas operações dentro de parênteses.', 'Calcula depois as potências: o expoente indica quantas vezes o fator se repete.', 'Faz multiplicações e divisões pela ordem em que aparecem, da esquerda para a direita.', 'Termina com adições e subtrações, também da esquerda para a direita. Escreve uma linha por passo.'],
    examples: [
      { title: '2 + 3 × 4²', steps: ['Potência: 4² = 4 × 4 = 16.', 'Multiplicação: 3 × 16 = 48.', 'Adição: 2 + 48 = 50.'], result: 50, compute: () => 2 + 3 * 4 ** 2 },
      { title: '(12 − 4) ÷ 2 + 3', steps: ['Parênteses: 12 − 4 = 8.', 'Divisão: 8 ÷ 2 = 4.', 'Adição: 4 + 3 = 7.'], result: 7, compute: () => (12 - 4) / 2 + 3 },
    ],
    checklist: ['Resolvo os parênteses primeiro.', 'Distingo uma potência de uma multiplicação.', 'Respeito as prioridades e a ordem da esquerda para a direita.'],
    commonErrors: ['4² é 4 × 4, não 4 × 2.', 'A multiplicação tem prioridade sobre a adição, mesmo quando a adição aparece primeiro.'],
  },
  {
    id: 'mat-proporcionalidade', curriculumRef: 'DGE — Aprendizagens Essenciais, 6.º ano: Proporcionalidade direta', review: 'needs-human-review',
    explanation: ['Duas grandezas são diretamente proporcionais quando o quociente entre valores correspondentes é constante.', 'Divide o valor da segunda grandeza pelo da primeira para encontrar a constante.', 'Multiplica um novo valor da primeira grandeza por essa constante.', 'Confirma as unidades. Se uma quantidade duplica, a outra também duplica.'],
    examples: [
      { title: '3 cadernos custam 6 €. Quanto custam 5?', steps: ['Preço por caderno: 6 ÷ 3 = 2 €.', 'A constante é 2 euros por caderno.', '5 × 2 = 10 €.'], result: 10, compute: () => 6 / 3 * 5 },
      { title: 'Uma receita para 4 pessoas leva 300 g de arroz. E para 6?', steps: ['Por pessoa: 300 ÷ 4 = 75 g.', 'A constante é 75 gramas por pessoa.', '6 × 75 = 450 g.'], result: 450, compute: () => 300 / 4 * 6 },
    ],
    checklist: ['Verifico se o quociente é constante.', 'Calculo o valor por unidade.', 'Uso a constante e indico a unidade.'],
    commonErrors: ['Somar a mesma quantidade às duas grandezas não garante proporcionalidade.', 'Mantém a mesma ordem no quociente ao comparar pares de valores.'],
  },
];
