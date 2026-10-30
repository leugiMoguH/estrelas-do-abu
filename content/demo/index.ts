import type { ContentPack, Difficulty, ExerciseTemplate } from '../../src/core/content';
import type { Answer, Exercise } from '../../src/core/types';
import { mulberry32 } from '../../src/core/generate';
export const difficultyCriteria = {
  unitario: [
    { steps: 1, numbers: 'inteiros' },
    { steps: 1, numbers: 'meios euros' },
    { steps: 3, numbers: 'quartos de euro e desconto percentual' },
  ],
  regra: [
    { steps: 2, numbers: 'inteiros' },
    { steps: 2, numbers: 'meios euros' },
    { steps: 4, numbers: 'quartos de euro e desconto percentual' },
  ],
  precos: [
    { steps: 3, numbers: 'inteiros' },
    { steps: 3, numbers: 'meios euros' },
    { steps: 4, numbers: 'quartos de euro; custo de meio quilograma' },
  ],
  escala: [
    { steps: 1, numbers: 'centímetros' },
    { steps: 2, numbers: 'conversão para metros' },
    { steps: 2, numbers: 'conversão para quilómetros, incluindo decimais' },
  ],
  inverso: [
    { steps: 1, numbers: 'inteiros' },
    { steps: 1, numbers: 'meios euros' },
    { steps: 3, numbers: 'quartos de euro; reverter desconto' },
  ],
} as const;
const numbers = (ex: Exercise) =>
  (ex.prompt.match(/\d+(?:[.,]\d+)?/gu) ?? []).map((n) => Number(n.replace(',', '.')));
const base = (id: string, seed: number, difficulty: Difficulty, prompt: string) => ({
  id: `${id}-${difficulty}-${seed}`,
  competencyId: 'mat6-prop',
  difficulty,
  prompt,
  hints: ['Identifica as grandezas e mantém a razão constante.'],
  explanation: 'Divide para obter a razão e multiplica para obter a quantidade pedida.',
  commonErrors: [],
});
const names = ['unitario', 'regra', 'precos', 'escala', 'inverso'] as const;
function solveFor(index: number, ex: Exercise): Answer {
  const [a = 0, b = 0, c = 0, d = 0] = numbers(ex);
  const discount = ex.difficulty === 3 && index !== 3 ? (100 - (index === 1 ? d : c)) / 100 : 1;
  const values = [
    (b / a) * discount,
    (b / a) * c * discount,
    Math.min(b / a, d / c) / (ex.difficulty === 3 ? 2 : 1),
    (a * b) / (ex.difficulty === 1 ? 1 : ex.difficulty === 2 ? 100 : 100000),
    b / a / discount,
  ];
  const value = String(Number(values[index]!.toFixed(8)));
  if (ex.kind === 'cloze') return { kind: 'cloze', value: [value] };
  return { kind: ex.kind as 'numeric' | 'mcq', value };
}
const templates: ExerciseTemplate[] = names.map((id, index) => ({
  id,
  competencyId: 'mat6-prop',
  conceptId: id,
  approachId: [
    'reduzir-unidade',
    'tabela-proporcional',
    'comparar-razoes',
    'converter-escala',
    'reconstruir-quantidade',
  ][index]!,
  difficulties: [1, 2, 3],
  review: 'approved',
  source: 'Original do projeto; CC0. Exemplo técnico, sem validação curricular humana.',
  generate(seed, difficulty) {
    const rng = mulberry32(seed);
    const a = 2 + Math.floor(rng() * 18);
    const q = 2 + Math.floor(rng() * 15);
    const unit = q / (difficulty === 1 ? 1 : difficulty === 2 ? 2 : 4);
    const b = a * unit;
    const c = 2 + Math.floor(rng() * 20);
    const discount = difficulty === 3 ? 25 : 0;
    const prompts = [
      `${a} cadernos custam ${b} euros. Quanto custa cada caderno${difficulty === 3 ? `, após um desconto de ${discount} por cento` : ''}?`,
      `${a} metros de tecido custam ${b} euros. Quanto custam ${c} metros${difficulty === 3 ? `, com desconto de ${discount} por cento` : ''}?`,
      `Na loja A, ${a} quilogramas custam ${b} euros; na loja B, ${c} quilogramas custam ${c * (unit + 1)} euros. Indica ${difficulty === 3 ? 'o menor custo de meio quilograma' : 'o menor preço por quilograma'}.`,
      `Num mapa, cada centímetro representa ${a * 1000} centímetros reais. Uma distância mede ${c} centímetros no mapa. Qual é a distância real em ${difficulty === 1 ? 'centímetros' : difficulty === 2 ? 'metros' : 'quilómetros'}?`,
      `Cada bilhete custa ${unit} euros. Pagaram-se ${b * (1 - discount / 100)} euros${difficulty === 3 ? ` após desconto de ${discount} por cento` : ''}. Quantos bilhetes foram comprados?`,
    ];
    let ex: Exercise = {
      ...base(id, seed, difficulty, prompts[index]!.replace(/(?<=\d)\.(?=\d)/gu, ',')),
      kind: 'numeric',
      correctAnswer: 0,
    };
    // A chave usa os parâmetros; o solver abaixo volta a ler o enunciado.
    const raw = [
      unit * (1 - discount / 100),
      unit * c * (1 - discount / 100),
      unit / (difficulty === 3 ? 2 : 1),
      (a * 1000 * c) / (difficulty === 1 ? 1 : difficulty === 2 ? 100 : 100000),
      a,
    ][index]!;
    const answer = Number(raw.toFixed(8));
    ex =
      index === 2
        ? {
            ...ex,
            kind: 'mcq',
            options: [String(answer), String(answer + 1), String(answer + 2)],
            correctAnswer: String(answer),
          }
        : index === 4
          ? { ...ex, kind: 'cloze', correctAnswers: [[String(answer)]] }
          : { ...ex, kind: 'numeric', correctAnswer: answer, tolerance: 1e-8 };
    return {
      ...ex,
      review: 'approved',
      explanation: `Resultado: ${answer}. Mantém a razão constante; aplica as conversões ou o desconto indicados.`,
      ref: { packId: 'demo', packVersion: '1.0.0', templateId: id, seed, difficulty },
      conceptId: id,
      approachId: [
        'reduzir-unidade',
        'tabela-proporcional',
        'comparar-razoes',
        'converter-escala',
        'reconstruir-quantidade',
      ][index]!,
    };
  },
  solve: (ex) => solveFor(index, ex),
}));
templates.push({
  id: 'pt-texto',
  competencyId: 'pt6-leitura',
  conceptId: 'informacao-explicita',
  approachId: 'localizar-texto',
  difficulties: [1],
  review: 'needs-human-review',
  source: 'Texto original do projeto; CC0.',
  generate(seed, difficulty) {
    return {
      ...base('pt-texto', seed, difficulty, 'Onde ficou a mochila?'),
      ref: { packId: 'demo', packVersion: '1.0.0', templateId: 'pt-texto', seed, difficulty },
      conceptId: 'informacao-explicita',
      approachId: 'localizar-texto',
      review: 'needs-human-review',
      competencyId: 'pt6-leitura',
      stimulus:
        'A Leonor entrou na biblioteca. Deixou a mochila junto à janela e abriu o livro sobre as marés.',
      kind: 'text',
      correctAnswers: ['junto à janela'],
    };
  },
  solve: (ex) => ({ kind: 'text', value: ex.stimulus?.match(/Deixou a mochila (.+?) e abriu/u)?.[1] ?? '' }),
});
export const demoPack: ContentPack = {
  id: 'demo',
  version: '1.0.0',
  curriculumVersion: 'DGE-AE-2018-demo',
  competencies: [
    {
      id: 'mat6-prop',
      subject: 'Matemática',
      grade: 6,
      domain: 'Álgebra',
      theme: 'Proporcionalidade direta',
      objective: 'Resolver problemas de proporcionalidade direta.',
      curriculumRef: 'AE Matemática 6.º: proporcionalidade direta',
      prerequisites: [],
    },
    {
      id: 'pt6-leitura',
      subject: 'Português',
      grade: 6,
      domain: 'Leitura',
      theme: 'Texto narrativo',
      objective: 'Localizar informação explícita.',
      curriculumRef: 'AE Português 6.º: leitura',
      prerequisites: [],
    },
  ],
  templates,
};
