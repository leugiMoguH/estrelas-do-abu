import type { ExerciseTemplate } from '../../src/core/content';
import { base, fmt, numbers, numericAnswer, random, template } from './shared';

// Cada nível altera os números ou o número de passos, não apenas a redação.
export const mathDifficultyCriteria = {
  'frac-soma': [
    'denominadores iguais e frações próprias',
    'denominadores diferentes e múltiplo comum pequeno',
    'problema contextual com três parcelas',
  ],
  'frac-parte': ['fração unitária', 'numerador não unitário', 'reconstituir o todo'],
  'frac-decimal': ['décimas', 'centésimas', 'milésimas'],
  'op-produto': ['uma multiplicação', 'multiplicação e divisão', 'parênteses e duas operações'],
  'op-parenteses': [
    'soma antes de multiplicar',
    'diferença antes de dividir',
    'dois grupos entre parênteses',
  ],
  'op-potencia': ['quadrado e soma', 'cubo e produto', 'quadrado de uma soma'],
  'prop-custo': ['preço unitário inteiro', 'preço em meios euros', 'preço em quartos de euro'],
  'prop-receita': ['dobrar ou triplicar', 'redução à unidade', 'quantidades em meios gramas'],
  'prop-escala': ['distância em centímetros', 'conversão em metros', 'conversão em quilómetros'],
} as const;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const fraction = (a: number, b: number) =>
  b / gcd(a, b) === 1 ? String(a / b) : `${a / gcd(a, b)}/${b / gcd(a, b)}`;
export const mathTemplates: ExerciseTemplate[] = [
  template(
    'frac-soma',
    'mat-racionais',
    'adicao-fracoes',
    (seed, d) => {
      const r = random(seed);
      const denominators = [2, 3, 4, 5, 6, 8, 10];
      const b = d === 1 ? r(3, 16) : denominators[r(0, 6)]!;
      const candidates = denominators.filter((n) => n !== b && (n * b) / gcd(n, b) <= 30);
      const e = d === 1 ? b : candidates[r(0, candidates.length - 1)]!;
      const a = r(1, b - 1),
        c = r(1, e - 1);
      const f = d === 3 ? denominators[r(0, 6)]! : 1;
      const h = d === 3 ? r(1, f - 1) : 0;
      const common = (b * e) / gcd(b, e);
      const denominator = (common * f) / gcd(common, f);
      const parts = [a * (denominator / b), c * (denominator / e), h * (denominator / f)];
      const numerator = parts.reduce((sum, n) => sum + n, 0);
      const answer = fraction(numerator, denominator);
      const wrong = fraction(a + c + h, b + e + (d === 3 ? f : 0));
      const product = fraction(a * c * (d === 3 ? h : 1), b * e * f);
      const request =
        numerator % denominator === 0
          ? 'Responde com um número inteiro.'
          : gcd(numerator, denominator) > 1
            ? 'Simplifica o resultado e escolhe a fração na forma irredutível.'
            : 'Escolhe a fração que representa o resultado.';
      return {
        ...base(
          'frac-soma',
          'mat-racionais',
          seed,
          d,
          (d === 3
            ? `Num passeio, a Inês percorreu ${a}/${b} km de manhã, ${c}/${e} km à tarde e ${h}/${f} km à noite. Quantos quilómetros percorreu ao todo? `
            : `Qual é a soma de ${a}/${b} e ${c}/${e}? `) + request,
          [
            d === 1
              ? `As frações já têm o mesmo denominador: mantém ${b}.`
              : `Escreve as parcelas com o denominador comum ${denominator}.`,
            `Soma os numeradores ${parts.slice(0, d === 3 ? 3 : 2).join(' e ')} e mantém o denominador ${denominator}.`,
            numerator % denominator === 0
              ? `Divide o numerador por ${denominator} para obter um inteiro.`
              : gcd(numerator, denominator) > 1
                ? `Divide numerador e denominador por ${gcd(numerator, denominator)}.`
                : 'Confirma que numerador e denominador não têm divisores comuns além de 1.',
          ],
          `Com denominador ${denominator}, os numeradores são ${parts.slice(0, d === 3 ? 3 : 2).join(', ')}. A soma é ${numerator}/${denominator}, que corresponde a ${answer}. Mantemos a unidade das parcelas e só depois simplificamos, se houver um divisor comum.`,
          [
            [wrong, 'Somar denominadores muda a unidade. Usa frações equivalentes com o mesmo denominador.'],
            [product, 'Multiplicaste as frações; aqui pede-se uma soma.'],
          ],
        ),
        kind: 'mcq',
        options: [...new Set([answer, wrong, product, fraction(numerator + 1, denominator)])],
        correctAnswer: answer,
      };
    },
    (ex) => {
      // Acumulação racional independente a partir das parcelas do enunciado.
      const terms = [...ex.prompt.matchAll(/(\d+)\/(\d+)/gu)];
      let n = 0,
        denominator = 1;
      for (const term of terms) {
        const a = Number(term[1]),
          b = Number(term[2]);
        n = n * b + a * denominator;
        denominator *= b;
        const divisor = gcd(n, denominator);
        n /= divisor;
        denominator /= divisor;
      }
      return { kind: 'mcq', value: fraction(n, denominator) };
    },
  ),
  template(
    'frac-parte',
    'mat-racionais',
    'fracao-quantidade',
    (seed, d) => {
      const r = random(seed),
        b = r(3, 15),
        a = d === 1 ? 1 : r(2, b - 1),
        unit = r(3, 60);
      const total = b * unit,
        part = a * unit;
      const inverse = d === 3;
      return {
        ...base(
          'frac-parte',
          'mat-racionais',
          seed,
          d,
          inverse
            ? `${a}/${b} de uma coleção correspondem a ${part} cromos. Quantos cromos tem a coleção completa?`
            : `Uma coleção tem ${total} cromos. A Inês oferece ${a}/${b} da coleção. Quantos cromos oferece?`,
          [
            'O denominador indica em quantas partes iguais se divide o todo.',
            inverse
              ? `Divide ${part} por ${a} para encontrar uma parte.`
              : `Divide ${total} por ${b} para encontrar uma parte.`,
            inverse ? `Multiplica uma parte por ${b}.` : `Multiplica uma parte por ${a}.`,
          ],
          inverse
            ? `Se ${a} partes valem ${part}, uma parte vale ${part} ÷ ${a} = ${unit}. O todo tem ${b} partes: ${unit} × ${b} = ${total} cromos.`
            : `Uma parte vale ${total} ÷ ${b} = ${unit}. Tomamos ${a} partes: ${unit} × ${a} = ${part} cromos.`,
          [
            [
              String(inverse ? (part / b) * a : (total / a) * b),
              'Confundiste o todo com a parte: identifica primeiro o valor de uma única parte.',
            ],
          ],
        ),
        kind: 'numeric',
        correctAnswer: inverse ? total : part,
      };
    },
    (ex) => {
      const [x = 0, y = 1, z = 1] = numbers(ex.prompt);
      return numericAnswer(ex, ex.difficulty === 3 ? (z / x) * y : (x / z) * y);
    },
  ),
  template(
    'frac-decimal',
    'mat-racionais',
    'representacao-decimal',
    (seed, d) => {
      const r = random(seed),
        denominator = 10 ** d,
        a = r(1, denominator * 8);
      return {
        ...base(
          'frac-decimal',
          'mat-racionais',
          seed,
          d,
          `Escreve ${a}/${denominator} em representação decimal.`,
          [
            'Uma fração representa uma divisão.',
            `O denominador é ${denominator}: desloca a vírgula ${d} casa(s) para a esquerda.`,
          ],
          `Dividir ${a} por ${denominator} dá ${fmt(a / denominator)}. As casas depois da vírgula representam décimas, centésimas e milésimas.`,
          [[fmt(a * denominator), 'Multiplicaste pelo denominador. A barra da fração significa divisão.']],
        ),
        kind: 'cloze',
        correctAnswers: [[String(a / denominator), fmt(a / denominator)]],
      };
    },
    (ex) => {
      const [a = 0, b = 1] = numbers(ex.prompt);
      return numericAnswer(ex, a / b);
    },
  ),
  template(
    'op-produto',
    'mat-prioridades',
    'hierarquia',
    (seed, d) => {
      const r = random(seed),
        a = r(2, 50),
        b = r(2, 15),
        c = r(2, 15),
        k = r(2, 9);
      const expression =
        d === 1
          ? `${a} + ${b} × ${c}`
          : d === 2
            ? `${a} + ${b} × ${c * k} ÷ ${k}`
            : `(${a} + ${b}) × ${c} - ${k}`;
      const answer = d < 3 ? a + b * c : (a + b) * c - k;
      const wrong = d < 3 ? (a + b) * c : a + b * c - k;
      return {
        ...base(
          'op-produto',
          'mat-prioridades',
          seed,
          d,
          `Calcula: ${expression}.`,
          [
            'Resolve primeiro os parênteses, se existirem.',
            'Multiplicações e divisões vêm antes das adições e subtrações; com igual prioridade, segue da esquerda para a direita.',
          ],
          d < 3
            ? `O produto (e a divisão, se existir) vale ${b * c}. Só depois somamos ${a}: ${answer}.`
            : `O parêntese vale ${a + b}. Depois: ${a + b} × ${c} = ${(a + b) * c}; subtraímos ${k} e obtemos ${answer}.`,
          [[String(wrong), 'Respeita os grupos entre parênteses e a prioridade do produto antes da soma.']],
        ),
        kind: 'numeric',
        correctAnswer: answer,
      };
    },
    (ex) => {
      const [a = 0, b = 0, c = 0, k = 1] = numbers(ex.prompt);
      return numericAnswer(
        ex,
        ex.difficulty === 1 ? a + b * c : ex.difficulty === 2 ? a + b * (c / k) : c * a + c * b - k,
      );
    },
  ),
  template(
    'op-parenteses',
    'mat-prioridades',
    'agrupamento',
    (seed, d) => {
      const r = random(seed),
        a = r(3, 30),
        rawB = r(2, 20),
        c = d === 2 ? [2, 4, 5, 8, 10][r(0, 4)]! : r(2, 12),
        e = r(2, 15),
        b = d === 2 ? rawB * c : rawB;
      const expression =
        d === 1
          ? `(${a} + ${b}) × ${c}`
          : d === 2
            ? `(${(a + rawB) * c} - ${b}) ÷ ${c}`
            : `(${a} + ${b}) × (${c} + ${e})`;
      const answer = d === 1 ? (a + b) * c : d === 2 ? ((a + rawB) * c - b) / c : (a + b) * (c + e);
      const wrong = d === 1 ? a + b * c : d === 2 ? (a + rawB) * c - b / c : a + b * c + e;
      return {
        ...base(
          'op-parenteses',
          'mat-prioridades',
          seed,
          d,
          `Resolve a expressão ${expression}.`,
          [
            'Cada par de parênteses forma um grupo.',
            'Calcula o valor de cada grupo antes da operação exterior.',
          ],
          `Substitui cada grupo pelo seu valor e só depois efetua a operação exterior. ${expression} = ${fmt(answer)}. Os parênteses obrigam a efetuar primeiro a soma ou a diferença.`,
          [[fmt(wrong), 'Ignoraste os parênteses: a operação dentro de cada grupo faz-se primeiro.']],
        ),
        kind: 'cloze',
        correctAnswers: [[String(Number(answer.toFixed(8))), fmt(answer)]],
      };
    },
    (ex) => {
      const [a = 0, b = 0, c = 1, e = 0] = numbers(ex.prompt);
      return numericAnswer(
        ex,
        ex.difficulty === 1
          ? c * a + c * b
          : ex.difficulty === 2
            ? a / c - b / c
            : a * c + a * e + b * c + b * e,
      );
    },
  ),
  template(
    'op-potencia',
    'mat-prioridades',
    'potencias',
    (seed, d) => {
      const r = random(seed),
        a = r(3, 20),
        b = r(2, 30),
        c = r(2, 12);
      const expression = d === 1 ? `${a}² + ${b}` : d === 2 ? `${a}³ + ${b} × ${c}` : `(${a} + ${b})²`;
      const answer = d === 1 ? a ** 2 + b : d === 2 ? a ** 3 + b * c : (a + b) ** 2;
      const wrong = d === 1 ? a * 2 + b : d === 2 ? a * 3 + b * c : a ** 2 + b ** 2;
      return {
        ...base(
          'op-potencia',
          'mat-prioridades',
          seed,
          d,
          `Calcula ${expression}.`,
          [
            'O expoente diz quantas vezes a base aparece como fator.',
            'Resolve parênteses, depois potências, depois produtos e finalmente somas.',
          ],
          d === 3
            ? `A base é a soma inteira: ${a + b}. O quadrado é ${a + b} × ${a + b} = ${answer}; não é a soma dos quadrados.`
            : `${a}${d === 1 ? '²' : '³'} significa ${Array(d === 1 ? 2 : 3)
                .fill(a)
                .join(' × ')}. Calcula essa potência e o produto, se existir, antes da soma: ${answer}.`,
          [
            [
              String(wrong),
              'Um expoente não multiplica a base; numa soma ao quadrado, ele aplica-se ao grupo inteiro.',
            ],
          ],
        ),
        kind: 'mcq',
        options: [
          ...new Set([String(wrong), String(answer), String(d === 3 ? (a + b) * 2 : (a + b) ** (d + 1))]),
        ],
        correctAnswer: String(answer),
      };
    },
    (ex) => {
      const [a = 0, b = 0, c = 0] = numbers(ex.prompt);
      const power = (n: number, count: number) =>
        Array.from({ length: count }, () => n).reduce((x, y) => x * y, 1);
      return {
        kind: 'mcq',
        value: String(
          ex.difficulty === 1 ? power(a, 2) + b : ex.difficulty === 2 ? power(a, 3) + b * c : power(a + b, 2),
        ),
      };
    },
  ),
  template(
    'prop-custo',
    'mat-proporcionalidade',
    'reducao-unidade',
    (seed, d) => {
      const r = random(seed),
        a = r(2, 20),
        unit = r(5, 35) / (d === 1 ? 1 : d === 2 ? 2 : 4),
        b = r(2, 30);
      return {
        ...base(
          'prop-custo',
          'mat-proporcionalidade',
          seed,
          d,
          `${a} cadernos iguais custam ${fmt(a * unit)} euros. Sem descontos, quanto custam ${b} cadernos?`,
          [
            'O preço por caderno mantém-se constante.',
            `Divide ${fmt(a * unit)} por ${a} e depois multiplica por ${b}.`,
          ],
          `Cada caderno custa ${fmt(a * unit)} ÷ ${a} = ${fmt(unit)} euros. Para ${b} cadernos: ${b} × ${fmt(unit)} = ${fmt(b * unit)} euros.`,
          [
            [
              fmt((a / (a * unit)) * b),
              'Inverteste a razão. O preço unitário é euros divididos pelo número de cadernos.',
            ],
          ],
        ),
        kind: 'numeric',
        correctAnswer: b * unit,
      };
    },
    (ex) => {
      const [a = 1, b = 0, c = 0] = numbers(ex.prompt);
      return numericAnswer(ex, (b * c) / a);
    },
  ),
  template(
    'prop-receita',
    'mat-proporcionalidade',
    'ampliacao-reducao',
    (seed, d) => {
      const r = random(seed),
        a = r(2, 18),
        unit = r(5, 90) / (d === 3 ? 2 : 1),
        candidate = d === 1 ? a * r(2, 3) : r(2, 30);
      const c = candidate === a ? candidate + 2 : candidate;
      return {
        ...base(
          'prop-receita',
          'mat-proporcionalidade',
          seed,
          d,
          `Uma receita para ${a} pessoas leva ${fmt(a * unit)} gramas de arroz. Mantendo a porção por pessoa, quantos gramas são precisos para ${c} pessoas?`,
          [
            'As duas quantidades variam na mesma proporção.',
            `Descobre os gramas por pessoa: ${fmt(a * unit)} ÷ ${a}.`,
            'Multiplica essa quantidade pelo novo número de pessoas.',
          ],
          `A porção é ${fmt(unit)} gramas por pessoa. Assim, ${c} × ${fmt(unit)} = ${fmt(c * unit)} gramas. Somar a diferença de pessoas aos gramas mistura unidades diferentes.`,
          [[fmt(a * unit + c - a), 'Não somes pessoas a gramas. Mantém constante a quantidade por pessoa.']],
        ),
        kind: 'cloze',
        correctAnswers: [[String(c * unit), fmt(c * unit)]],
      };
    },
    (ex) => {
      const [a = 1, b = 0, c = 0] = numbers(ex.prompt);
      return numericAnswer(ex, (c / a) * b);
    },
  ),
  template(
    'prop-escala',
    'mat-proporcionalidade',
    'escala-conversao',
    (seed, d) => {
      const r = random(seed),
        scale = r(2, 90) * 1000,
        cm = r(2, 75),
        divisor = d === 1 ? 1 : d === 2 ? 100 : 100000;
      const unit = d === 1 ? 'centímetros' : d === 2 ? 'metros' : 'quilómetros';
      return {
        ...base(
          'prop-escala',
          'mat-proporcionalidade',
          seed,
          d,
          `Cada centímetro de um mapa representa ${scale} centímetros reais. O percurso mede ${cm} centímetros no mapa. Qual é a distância real em ${unit}?`,
          [
            'Multiplica a medida no mapa pela distância que cada centímetro representa.',
            `Obténs ${scale * cm} centímetros reais.`,
            d === 1
              ? 'A unidade pedida já é o centímetro.'
              : `Divide por ${divisor} para converter centímetros em ${unit}.`,
          ],
          `${cm} × ${scale} = ${scale * cm} centímetros. ${d === 1 ? 'Não é necessária conversão.' : `Como 1 ${d === 2 ? 'metro vale 100' : 'quilómetro vale 100 000'} centímetros, dividimos por ${divisor}.`} Resultado: ${fmt((scale * cm) / divisor)} ${unit}.`,
          [
            [
              fmt(cm / scale),
              'A distância real é maior: multiplica pelo fator de escala, não dividas por ele.',
            ],
          ],
        ),
        kind: 'numeric',
        correctAnswer: (scale * cm) / divisor,
      };
    },
    (ex) => {
      const [a = 0, b = 0] = numbers(ex.prompt);
      return numericAnswer(ex, (a * b) / (ex.difficulty === 1 ? 1 : ex.difficulty === 2 ? 100 : 100000));
    },
  ),
];
