import type { Difficulty, ExerciseTemplate } from '../../src/core/content';
import type { Answer, Exercise } from '../../src/core/types';
import type { Topic } from '../index';
import { base, numericAnswer, random, template } from './shared';

// Inteiros racionais: nenhuma operação de frações depende de arredondamentos.
export const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
export const fraction = (a: number, b: number): string => {
  const g = gcd(a, b), sign = b < 0 ? -1 : 1;
  return `${sign * a / g}/${sign * b / g}`;
};
export function capture(prompt: string, regex: RegExp): number[] {
  const m = regex.exec(prompt);
  if (!m) throw new Error(`Enunciado inesperado: ${prompt}`);
  return m.slice(1).map(Number);
}
export interface Task {
  prompt: string; answer: string | number; wrong: string | number;
  hints: [string, string]; explanation: string; feedback: string; options?: string[];
}
export function exerciseTemplate(id: string, topic: string, concept: string, kind: 'numeric' | 'mcq' | 'cloze',
  generate: (r: ReturnType<typeof random>, d: Difficulty) => Task,
  solve: (prompt: string) => string | number): ExerciseTemplate {
  return template(id, `mat-${topic}`, concept, (seed, d) => {
    const t = generate(random(seed), d);
    const common = base(id, `mat-${topic}`, seed, d, t.prompt, t.hints, t.explanation, [[String(t.wrong), t.feedback]]);
    if (kind === 'mcq') return { ...common, kind, options: t.options ?? [...new Set([String(t.answer), String(t.wrong), String(Number(t.answer) + 2)])], correctAnswer: String(t.answer) };
    if (kind === 'cloze') return { ...common, kind, correctAnswers: [[String(t.answer)]] };
    return { ...common, kind, correctAnswer: Number(t.answer) };
  }, (ex: Exercise): Answer => {
    const value = solve(ex.prompt);
    return kind === 'mcq' ? { kind, value: String(value) } : kind === 'cloze' ? { kind, value: [String(value)] } : numericAnswer(ex, Number(value));
  });
}
export function topic(id: string, title: string, group: string, blurb: string, icon: string): Topic {
  return { id, subject: 'matematica', group, level: '6', title, blurb, icon, competencyIds: [`mat-${id}`], curriculumRef: `DGE — Aprendizagens Essenciais, 6.º ano: ${title}` };
}
export const numerosTopics: Topic[] = [
  topic('primos', 'Primos, múltiplos e divisores', 'Números e operações', 'Decompor, organizar grupos e encontrar coincidências.', '🔢'),
  topic('potencias', 'Operações com potências', 'Números e operações', 'Relacionar bases, expoentes e produtos.', '⚡'),
  topic('fracoes-ops', 'Operações com frações', 'Números e operações', 'Simplificar e calcular com partes de um todo.', '🍰'),
];
const factorization = (n: number): string => {
  const factors: string[] = [];
  for (let p = 2; p <= n; p++) {
    let count = 0;
    while (n % p === 0) { n /= p; count++; }
    if (count) factors.push(count === 1 ? `${p}` : `${p}^${count}`);
  }
  return factors.join(' × ');
};
// Geração por procura de divisores; resolução por Euclides.
const generatedFactors = (n: number): string => {
  const primes = Array.from({ length: n - 1 }, (_, i) => i + 2).filter(p => {
    for (let k = 2; k * k <= p; k++) if (p % k === 0) return false;
    return n % p === 0;
  });
  return primes.map(p => {
    let exponent = 1;
    while (n % p ** (exponent + 1) === 0) exponent++;
    return exponent === 1 ? `${p}` : `${p}^${exponent}`;
  }).join(' × ');
};
const divisors = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter(k => n % k === 0);
const pair = (r: ReturnType<typeof random>, d: Difficulty) => [r(2, d === 1 ? 60 : d === 2 ? 100 : 240), r(2, d === 1 ? 60 : d === 2 ? 100 : 240)] as const;
const primeCount = (n: number) => divisors(n).filter(k => k > 1 && divisors(k).length === 2).length;
const pow = (a: number, n: number) => Array.from({ length: n }, () => a).reduce((v, x) => v * x, 1);
export const numerosTemplates: ExerciseTemplate[] = [];
for (const mode of ['mmc', 'mdc'] as const) numerosTemplates.push(exerciseTemplate(`num-${mode}`, 'primos', mode, mode === 'mmc' ? 'numeric' : 'cloze', (r, d) => {
  const [a, b] = pair(r, d);
  const common = divisors(a).filter(k => b % k === 0).at(-1)!;
  let multiple = a; while (multiple % b) multiple += a;
  const answer = mode === 'mmc' ? multiple : common;
  const wrong = common === multiple ? a + b : mode === 'mmc' ? common : multiple;
  const prompt = d === 1 ? `Calcula o ${mode} de ${a} e ${b}.` : mode === 'mmc'
    ? `Dois sinais na pista da escola repetem-se a cada ${a} e ${b} segundos. Começam juntos. Quantos segundos até à primeira coincidência após o início?`
    : `Há fitas de ${a} e ${b} centímetros para uma oficina. Cortam-se ambas em pedaços iguais, de comprimento inteiro, sem sobras. Qual é o maior tamanho possível de cada pedaço, em centímetros?`;
  return { prompt, answer, wrong, hints: ['Procura múltiplos comuns para coincidências e divisores comuns para cortes sem sobras.', 'Escolhe o menor múltiplo positivo ou o maior divisor, conforme a pergunta.'], explanation: `Os divisores comuns são ${divisors(common).join(', ')}. O maior é ${common}; o primeiro múltiplo comum positivo é ${multiple}. A resposta pedida é ${answer}.`, feedback: common === multiple ? 'Quando os dois números são iguais, o mmc e o mdc são o próprio número; não os somes.' : 'Trocaste múltiplos por divisores. Coincidências usam mmc; o maior corte sem sobras usa mdc.' };
}, p => {
  const [a = 1, b = 1] = capture(p, /(?:de |cada |fitas de )(\d+) e (\d+)/u);
  return mode === 'mmc' ? a / gcd(a, b) * b : gcd(a, b);
}));
numerosTemplates.push(exerciseTemplate('num-decomposicao', 'primos', 'decomposicao-prima', 'mcq', (r, d) => {
  const [a, b] = pair(r, d), answer = `${a}: ${generatedFactors(a)}; ${b}: ${generatedFactors(b)}`;
  const wrong = `${a}: ${generatedFactors(a * 2)}; ${b}: ${generatedFactors(b)}`;
  return { prompt: `No clube de matemática, decompõe ${a} e ${b} em fatores primos. Escolhe o par de decomposições.`, answer, wrong, options: [answer, wrong, `${a}: ${factorization(a + 1)}; ${b}: ${factorization(b + 1)}`], hints: ['Um número primo tem exatamente dois divisores positivos.', 'Divide sucessivamente por 2, 3, 5 e pelos primos seguintes até chegares a 1.'], explanation: `${a} = ${factorization(a)} e ${b} = ${factorization(b)}. Todos os fatores apresentados na decomposição correta são primos; o número 1 não é primo.`, feedback: 'Verifica o produto dos fatores: esta opção acrescenta um fator 2 ao primeiro número.' };
}, p => { const [a = 1, b = 1] = capture(p, /decompõe (\d+) e (\d+)/u); return `${a}: ${factorization(a)}; ${b}: ${factorization(b)}`; }));
numerosTemplates.push(exerciseTemplate('num-divisores-primos', 'primos', 'divisores-primos-distintos', 'numeric', (r, d) => {
  const [a, b] = pair(r, d), answer = primeCount(a) + primeCount(b);
  return { prompt: `Conta os divisores primos distintos de ${a} e, separadamente, de ${b}. Qual é a soma dessas duas contagens?`, answer, wrong: divisors(a).length + divisors(b).length, hints: ['Não contes 1 nem os divisores compostos.', 'Conta cada primo uma única vez em cada número; depois soma as duas contagens.'], explanation: `As decomposições são ${factorization(a)} e ${factorization(b)}. Cada base prima conta uma vez por número, mesmo que o expoente seja maior que 1. A soma das contagens é ${answer}.`, feedback: 'Contaste todos os divisores. Aqui só entram os divisores que são números primos.' };
}, p => { const [a = 1, b = 1] = capture(p, /distintos de (\d+) e, separadamente, de (\d+)/u); const count = (n: number) => factorization(n).split(' × ').length; return count(a) + count(b); }));
numerosTemplates.push(exerciseTemplate('num-produto-primos', 'primos', 'produto-fatores-primos', 'numeric', (r, d) => {
  const primes = [2, 3, 5, 7, 11, 13], a = primes[r(0, 5)]!, b = primes[r(0, 5)]!, n = r(1, d + 3), m = r(1, d + 3);
  return { prompt: `Uma coleção de cromos tem  ${a}^${n} × ${b}^${m} cromos. Quantos cromos tem?`, answer: a ** n * b ** m, wrong: a * n + b * m === a ** n * b ** m ? (a + b) ** (n + m) : a * n + b * m, hints: ['Cada expoente indica o número de fatores iguais.', 'Calcula as duas potências e multiplica os resultados.'], explanation: `A primeira potência vale ${a ** n} e a segunda vale ${b ** m}. Multiplicando, a coleção tem ${a ** n * b ** m} cromos; expoentes não são fatores pelos quais se multiplica a base.`, feedback: 'O expoente conta fatores repetidos; não se multiplica simplesmente a base pelo expoente.' };
}, p => { const [a = 1, n = 1, b = 1, m = 1] = capture(p, /tem  (\d+)\^(\d+) × (\d+)\^(\d+)/u); return pow(a, n) * pow(b, m); }));
for (const mode of ['produto-base', 'quociente-base', 'expoente-falta', 'mesmo-expoente', 'valor'] as const) numerosTemplates.push(exerciseTemplate(`pot-${mode}`, 'potencias', mode, mode === 'expoente-falta' ? 'cloze' : mode === 'mesmo-expoente' ? 'mcq' : 'numeric', (r, d) => {
  const a = r(2, 20 + 5 * d), b = r(2, 20), n = r(1, d + 4), m = r(1, d + 3);
  let prompt: string, answer: number, wrong: number;
  if (mode === 'produto-base') { prompt = `Escreve ${a}^${n} × ${a}^${m} como uma potência de base ${a}. Qual é o expoente?`; answer = n + m; wrong = n * m === answer ? n + m + 1 : n * m; }
  else if (mode === 'quociente-base') { prompt = `Escreve ${a}^${n + m} ÷ ${a}^${m} como uma potência de base ${a}. Qual é o expoente?`; answer = n; wrong = n + 2 * m; }
  else if (mode === 'expoente-falta') { prompt = `Completa com o expoente natural: ${a}^□ × ${a}^${m} = ${a}^${n + m}.`; answer = n; wrong = n + 2 * m; }
  else if (mode === 'mesmo-expoente') { prompt = `Escreve ${a}^${n} × ${b}^${n} como uma só potência com expoente ${n}. Qual é a base?`; answer = a * b; wrong = a + b === answer ? a + b + 1 : a + b; }
  else { prompt = `Calcula o valor numérico de ${a}^${n} + ${b}.`; answer = a ** n + b; wrong = a * n + b === answer ? a * (n + 1) + b : a * n + b; }
  return { prompt, answer, wrong, hints: ['Identifica o que é comum: a base ou o expoente.', 'Na mesma base, soma expoentes no produto e subtrai na divisão. Com o mesmo expoente, multiplica as bases.'], explanation: `A regra aplica-se apenas quando a base ou o expoente é comum. Mantém esse elemento, efetua a operação indicada sobre o outro e obtém ${answer} como resposta à pergunta.`, feedback: 'Confundiste a operação sobre as bases com a operação sobre os expoentes. Identifica primeiro o elemento comum.' };
}, p => {
  if (mode === 'expoente-falta') { const [, m = 0, , total = 0] = capture(p, /natural: (\d+)\^□ × \d+\^(\d+) = (\d+)\^(\d+)/u); return total - m; }
  if (mode === 'valor') { const [a = 1, n = 1, b = 0] = capture(p, /de (\d+)\^(\d+) \+ (\d+)/u); return pow(a, n) + b; }
  const [a = 1, n = 1, b = 1, m = 1] = capture(p, /Escreve (\d+)\^(\d+) [×÷] (\d+)\^(\d+)/u);
  return mode === 'mesmo-expoente' ? a * b : mode === 'produto-base' ? n + m : n - m;
}));
numerosTemplates.push(exerciseTemplate('pot-fracao', 'potencias', 'potencia-fracionaria', 'mcq', (r, d) => {
  const a = r(1, 18), b = r(a + 1, a + 20), n = r(d + 1, d + 3), answer = fraction(a ** n, b ** n), wrong = a ** n === a * n ? fraction(a ** n, b * n) : fraction(a * n, b ** n);
  return { prompt: `Calcula (${a}/${b})^${n}. Escolhe o valor em fração irredutível.`, answer, wrong, options: [...new Set([answer, wrong, fraction(a ** n + 1, b ** n)])], hints: ['O expoente aplica-se ao numerador e ao denominador.', 'Eleva ambos ao expoente e divide pelo máximo divisor comum.'], explanation: `O produto de ${n} fatores ${a}/${b} tem numerador ${a ** n} e denominador ${b ** n}. Simplificando ambos pelo mesmo divisor, obtemos ${answer}.`, feedback: 'É preciso elevar o numerador à potência, tal como o denominador.' };
}, p => { const [a = 1, b = 1, n = 1] = capture(p, /Calcula \((\d+)\/(\d+)\)\^(\d+)/u); return fraction(pow(a, n), pow(b, n)); }));
for (const mode of ['irredutivel', 'subtracao', 'multiplicacao', 'inverso', 'divisao', 'expressao'] as const) numerosTemplates.push(exerciseTemplate(`frac-${mode}`, 'fracoes-ops', mode, mode === 'inverso' ? 'cloze' : 'mcq', (r, d) => {
  const a = r(2, 15 + d * 8), b = r(a + 1, a + 20), c = r(1, 15 + d * 5), e = d === 1 ? b : r(c + 1, c + 20), k = r(2, 8 + d * 3);
  let prompt: string, answer: string, wrong: string;
  if (mode === 'irredutivel') { prompt = `Na receita do lanche, a porção é ${a * k}/${b * k}. Escolhe a fração irredutível equivalente.`; answer = fraction(a, b); wrong = `${a * k}/${b * k}`; }
  else if (mode === 'inverso') { prompt = `Completa com o inverso de ${a}/${b}, na forma irredutível (numerador/denominador).`; answer = fraction(b, a); wrong = fraction(a, b); }
  else { const op = mode === 'subtracao' ? '−' : mode === 'multiplicacao' ? '×' : '÷'; prompt = mode === 'expressao' ? `Calcula (${a}/${b} + ${c}/${e}) × ${k}/${b}. Escolhe a fração irredutível.` : `Calcula ${a}/${b} ${op} ${c}/${e}. Escolhe a fração irredutível.`;
    answer = mode === 'subtracao' ? fraction(a * e - c * b, b * e) : mode === 'multiplicacao' ? fraction(a * c, b * e) : mode === 'divisao' ? fraction(a * e, b * c) : fraction((a * e + c * b) * k, b * e * b);
    wrong = mode === 'subtracao' ? fraction(a - c, b + e) : mode === 'divisao' ? fraction(a * c, b * e) : fraction(a + c, b + e);
  }
  if (wrong === answer) wrong = fraction(Number(answer.split('/')[0]) + 1, Number(answer.split('/')[1]));
  const [an = 0, ad = 1] = answer.split('/').map(Number);
  const options = mode === 'irredutivel' ? [answer, wrong, `${a * k * 2}/${b * k * 2}`] : [...new Set([answer, wrong, fraction(an + 2 * ad, ad)])];
  return { prompt, answer, wrong, options, hints: ['Respeita os parênteses. Para somar ou subtrair, reduz ao mesmo denominador.', 'Para dividir, multiplica pelo inverso. No fim divide numerador e denominador pelo seu máximo divisor comum.'], explanation: `A resposta é ${answer}. Trabalha sempre com numeradores e denominadores inteiros: usa produtos cruzados na soma ou diferença, multiplica termo a termo no produto e inverte apenas o divisor na divisão.`, feedback: mode === 'irredutivel' ? 'A fração é equivalente, mas ainda tem um divisor comum maior que 1. Simplifica até obteres a forma irredutível.' : 'Revê a operação pedida: somar denominadores não preserva a unidade e dividir exige inverter o divisor.' };
}, p => {
  if (mode === 'irredutivel') { const [a = 1, b = 1] = capture(p, /porção é (\d+)\/(\d+)/u); return fraction(a, b); }
  if (mode === 'inverso') { const [a = 1, b = 1] = capture(p, /inverso de (\d+)\/(\d+)/u); return fraction(b, a); }
  const [a = 1, b = 1, c = 1, e = 1] = capture(p, /Calcula \(?(\d+)\/(\d+) [−×÷+] (\d+)\/(\d+)/u);
  // Produtos cruzados, conservando os inteiros até à redução final.
  if (mode === 'subtracao') return fraction(a * e - c * b, b * e);
  if (mode === 'multiplicacao') return fraction(a * c, b * e);
  if (mode === 'divisao') return fraction(a * e, b * c);
  const [k = 1, f = 1] = capture(p, /\) × (\d+)\/(\d+)/u);
  const common = b / gcd(b, e) * e;
  return fraction((a * (common / b) + c * (common / e)) * k, common * f);
}));

numerosTemplates.push(exerciseTemplate('pot-quociente-expoente', 'potencias', 'quociente-mesmo-expoente', 'numeric', (r, d) => {
  const b = r(2, 20 + d * 5), k = r(2, 25 + d * 5), n = r(2, d + 4), a = b * k;
  return { prompt: `Escreve ${a}^${n} ÷ ${b}^${n} como uma potência com expoente ${n}. Qual é a base?`, answer: k, wrong: a - b === k ? a * b : a - b, hints: ['O expoente é igual nas duas potências.', 'Divide as bases e conserva o expoente comum.'], explanation: `O quociente tem o mesmo expoente ${n}. Podemos agrupar as bases: (${a} ÷ ${b})^${n} = ${k}^${n}. A base pedida é ${k}, não o valor numérico da potência.`, feedback: 'Com o mesmo expoente, divide as bases; não subtraias nem multipliques as bases. Mantém o expoente.' };
}, p => { const [a = 1, , b = 1] = capture(p, /Escreve (\d+)\^(\d+) ÷ (\d+)\^\d+/u); return a / b; }));
