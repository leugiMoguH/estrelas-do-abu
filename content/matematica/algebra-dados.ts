import type { ExerciseTemplate } from '../../src/core/content';
import type { Topic } from '../index';
import { capture, exerciseTemplate, fraction, topic } from './numeros';
export const algebraDadosTopics: Topic[] = [
  topic('sequencias', 'Regularidades e sequências', 'Álgebra', 'Descobrir regras, continuar padrões e testar termos.', '🔁'),
  topic('dados', 'Classes e histogramas', 'Dados e probabilidades', 'Organizar medições e interpretar frequências.', '📊'),
  topic('probabilidades', 'Probabilidades', 'Dados e probabilidades', 'Comparar possibilidades e reconhecer resultados equiprováveis.', '🎲'),
];
export const algebraDadosTemplates: ExerciseTemplate[] = [];
for (const mode of ['seguinte', 'ordem', 'pertence', 'lei'] as const) algebraDadosTemplates.push(exerciseTemplate(`seq-${mode}`, 'sequencias', mode, mode === 'pertence' || mode === 'lei' ? 'mcq' : mode === 'ordem' ? 'cloze' : 'numeric', (r, d) => {
  const a = r(2, 35 + d * 10), step = r(2, 25 + d * 5) * (r(0, 1) ? 1 : -1), n = r(3, 25 + d * 10), denominator = d === 3 ? r(2, 9) : 1;
  const start = step < 0 ? a + Math.abs(step) * (n + 3) : a;
  const value = start + step * (n - 1), candidate = value + r(0, 1), rule = `u(n) = (${start} + (${step}) × (n − 1))/${denominator}`;
  let prompt: string, answer: string | number, wrong: string | number, options: string[] | undefined;
  if (mode === 'seguinte') { prompt = `Num jogo, a sequência começa por ${start}, ${start + step}, ${start + 2 * step}. A diferença entre termos é constante. Qual é o termo seguinte?`; answer = start + 3 * step; wrong = start + 2 * step; }
  else if (mode === 'ordem') { prompt = `Para n natural a partir de 1, ${rule}. Escreve o termo de ordem ${n} como fração irredutível (numerador/denominador).`; answer = fraction(value, denominator); wrong = fraction(start + step * n, denominator); }
  else if (mode === 'pertence') { prompt = `Para n natural a partir de 1, ${rule}. O número ${candidate}/${denominator} pertence à sequência?`; answer = (candidate - start) % step === 0 && (candidate - start) / step >= 0 ? 'Sim' : 'Não'; wrong = answer === 'Sim' ? 'Não' : 'Sim'; options = ['Sim', 'Não']; }
  else { prompt = `Uma sequência começa por ${start}/${denominator}, ${start + step}/${denominator}, ${start + 2 * step}/${denominator} e tem diferença constante. Qual é uma lei de formação, para n natural a partir de 1?`; answer = rule; wrong = `u(n) = (${start} + (${step}) × n)/${denominator}`; options = [answer, wrong, `u(n) = (${start} − (${step}) × (n − 1))/${denominator}`]; }
  return { prompt, answer, wrong, options, hints: ['Com diferença constante, subtrai um termo ao seguinte para descobrir o passo.', 'A ordem começa em 1: o termo de ordem n usa n − 1 passos. Para pertencer, a ordem tem de ser um natural.'], explanation: `O primeiro numerador é ${start}, o passo é ${step} e o denominador é ${denominator}. Na ordem n avançamos n − 1 passos. Uma diferença negativa produz uma sequência decrescente; só aceitamos ordens naturais a partir de 1.`, feedback: 'Verifica se contaste um passo a mais e se a ordem encontrada é um número natural a partir de 1.' };
}, p => {
  if (mode === 'seguinte') { const [, b = 0, c = 0] = capture(p, /por (-?\d+), (-?\d+), (-?\d+)\./u); return c + (c - b); }
  if (mode === 'lei') { const [a = 0, den = 1, b = 0] = capture(p, /por (-?\d+)\/(\d+), (-?\d+)\/\d+, -?\d+\/\d+/u); return `u(n) = (${a} + (${b - a}) × (n − 1))/${den}`; }
  const [a = 0, step = 1, den = 1] = capture(p, /u\(n\) = \((-?\d+) \+ \((-?\d+)\) × \(n − 1\)\)\/(\d+)/u);
  if (mode === 'ordem') { const [n = 1] = capture(p, /ordem (\d+)/u); let numerator = a; for (let i = 1; i < n; i++) numerator += step; return fraction(numerator, den); }
  const [candidate = 0] = capture(p, /número (-?\d+)\/\d+/u); const order = 1 + (candidate - a) / step; return Number.isInteger(order) && order >= 1 ? 'Sim' : 'Não';
}));
// Classes sempre fechadas à esquerda, abertas à direita; o máximo é único.
for (const mode of ['amplitude', 'limites', 'modal', 'frequencia', 'relativa', 'fracao', 'classes'] as const) algebraDadosTemplates.push(exerciseTemplate(`dados-${mode}`, 'dados', mode === 'modal' ? 'classe-modal' : mode === 'limites' ? 'intervalos' : mode === 'frequencia' ? 'leitura-histograma' : mode, mode === 'modal' || mode === 'limites' || mode === 'fracao' ? 'mcq' : mode === 'classes' ? 'cloze' : 'numeric', (r, d) => {
  const start = r(0, 60 + 20 * d), width = r(2, 20 + d * 5), counts = Array.from({ length: d + 2 }, () => r(1, 15)), modal = r(0, d + 1);
  counts[modal] = 20 + r(1, 15); const total = counts.reduce((a, b) => a + b, 0), index = r(0, d + 1), boundary = start + width * (index + 1);
  const intervals = counts.map((_, i) => `[${start + i * width},${start + (i + 1) * width}[`);
  const table = intervals.map((s, i) => `${s}: ${counts[i]}`).join('; ');
  let question: string, answer: string | number, wrong: string | number, options: string[] | undefined;
  if (mode === 'amplitude') { question = 'Qual é a amplitude de cada classe?'; answer = width; wrong = start + width; if (wrong === answer) wrong = width * 2; }
  else if (mode === 'classes') { question = 'Quantas classes tem o histograma?'; answer = counts.length; wrong = counts.length + 1; }
  else if (mode === 'modal') { question = 'Qual é a classe modal?'; answer = intervals[modal]!; wrong = intervals[(modal + 1) % counts.length]!; options = intervals; }
  else if (mode === 'limites') { const value = index === counts.length - 1 ? start + index * width : boundary; const target = index === counts.length - 1 ? index : index + 1; question = `Em que classe se inclui a medição ${value} minutos?`; answer = intervals[target]!; wrong = intervals[target === 0 ? 1 : target - 1]!; options = intervals; }
  else if (mode === 'frequencia') { question = `Qual é a frequência absoluta da classe ${intervals[index]}?`; answer = counts[index]!; wrong = total; }
  else if (mode === 'relativa') { question = `Qual é a frequência relativa da classe ${intervals[index]}, em percentagem? Arredonda às unidades.`; answer = Math.round(counts[index]! * 100 / total); wrong = counts[index]!; if (wrong === answer) wrong = total; }
  else { question = `Qual é a frequência relativa da classe ${intervals[index]}, como fração irredutível?`; answer = fraction(counts[index]!, total); wrong = fraction(total, counts[index]!); options = [answer, wrong, fraction(counts[index]! + 1, total)]; }
  return { prompt: `Histograma do tempo de leitura diário (minutos), descrito pela tabela «classe: frequência absoluta»: ${table}. ${question}`, answer, wrong, options, hints: ['Em [a,b[, o limite a está incluído e o limite b está excluído.', 'A amplitude é b − a; a frequência relativa é a frequência absoluta dividida pelo total. A classe modal tem a maior frequência.'], explanation: `As classes têm amplitude ${width} minutos e o total é ${total} observações. As alturas das barras são frequências absolutas; a classe ${intervals[modal]} tem a maior frequência, ${counts[modal]}, sem empate. Os limites direitos passam para a classe seguinte.`, feedback: 'Distingue limites de classe, número de observações e percentagem. Os limites direitos não pertencem à classe.' };
}, p => {
  const rows = [...p.matchAll(/\[(\d+),(\d+)\[: (\d+)/gu)].map(m => ({ a: Number(m[1]), b: Number(m[2]), f: Number(m[3]) }));
  if (!rows.length) throw new Error('Tabela ausente');
  if (mode === 'amplitude') return rows[0]!.b - rows[0]!.a;
  if (mode === 'classes') return rows.length;
  if (mode === 'modal') { const row = rows.reduce((a, b) => a.f > b.f ? a : b); return `[${row.a},${row.b}[`; }
  if (mode === 'limites') { const [x = 0] = capture(p, /medição (\d+) minutos/u); const row = rows.find(v => v.a <= x && x < v.b)!; return `[${row.a},${row.b}[`; }
  const [a = 0, b = 1] = capture(p, /da classe \[(\d+),(\d+)\[/u), row = rows.find(v => v.a === a && v.b === b)!;
  const total = rows.reduce((s, v) => s + v.f, 0);
  return mode === 'frequencia' ? row.f : mode === 'fracao' ? fraction(row.f, total) : Math.floor((200 * row.f + total) / (2 * total));
}));
for (const mode of ['equiprovavel', 'favoraveis', 'complementar', 'comparar'] as const) algebraDadosTemplates.push(exerciseTemplate(`prob-${mode}`, 'probabilidades', mode, mode === 'complementar' ? 'cloze' : 'mcq', (r, d) => {
  const a = r(1, 20 + d * 10), b = r(1, 20 + d * 10), c = d === 1 ? 0 : r(1, 20), total = a + b + c;
  let prompt: string, answer: string | number, wrong: string | number, options: string[] | undefined;
  if (mode === 'equiprovavel') {
    const variant = r(0, 2), equal = r(0, 1) === 1, second = equal ? a : a + b;
    prompt = variant === 0 ? `Um saco contém ${a} bolas azuis e ${second} vermelhas, indistinguíveis ao tato. Retira-se uma ao acaso, misturando bem. As duas cores são equiprováveis?` : variant === 1 ? `Uma roleta justa tem ${a + second} setores iguais: ${a} azuis e ${second} vermelhos. As duas cores são equiprováveis?` : `Um dado justo tem ${a + second} faces de igual possibilidade: ${a} azuis e ${second} vermelhas. As duas cores são equiprováveis?`;
    answer = equal ? 'Sim' : 'Não'; wrong = equal ? 'Não' : 'Sim'; options = ['Sim', 'Não'];
  } else if (mode === 'comparar') { const x = r(1, total - 1), y = r(1, total - 1); prompt = `No jogo da turma, a probabilidade de ganhar em A é ${a}/${total} e em B é ${x}/${x + y}. Qual é maior?`; const diff = a * (x + y) - x * total; answer = diff === 0 ? 'São iguais' : diff > 0 ? 'A' : 'B'; wrong = answer === 'A' ? 'B' : 'A'; options = ['A', 'B', 'São iguais']; }
  else { prompt = `No saco do jogo há ${a} bolas azuis, ${b} vermelhas e ${c} verdes, indistinguíveis ao tato. Retira-se uma ao acaso, misturando bem. ` + (mode === 'complementar' ? 'Quantos resultados individuais favoráveis há ao acontecimento «não sair azul»?' : 'Qual é a probabilidade de sair azul, como fração irredutível?'); answer = mode === 'complementar' ? b + c : fraction(a, total); wrong = mode === 'complementar' ? a : fraction(a, b + c); if (wrong === answer) wrong = total; if (mode === 'favoraveis') options = [String(answer), String(wrong), fraction(a + total, total)]; }
  if (wrong === answer) wrong = Number(answer) + 1;
  return { prompt, answer, wrong, options, hints: ['Cada bola ou setor individual tem a mesma possibilidade, mas as cores podem ter contagens diferentes.', 'Conta os casos favoráveis e todos os casos possíveis. Para comparar frações, usa produtos cruzados.'], explanation: `Resultados individuais igualmente possíveis permitem contar casos favoráveis e dividir pelo total. Cores com contagens diferentes não são equiprováveis. O complementar reúne todos os resultados que ficam fora do acontecimento inicial.`, feedback: 'Conta todos os resultados individuais possíveis, incluindo as outras cores; cores diferentes não têm necessariamente a mesma probabilidade.' };
}, p => {
  if (mode === 'equiprovavel') { const [a = 0, b = 0] = capture(p, /(\d+) (?:bolas )?azuis e (\d+) vermelh[ao]s/u); return a === b ? 'Sim' : 'Não'; }
  if (mode === 'comparar') { const [a = 1, b = 1, c = 1, e = 1] = capture(p, /A é (\d+)\/(\d+) e em B é (\d+)\/(\d+)/u); const diff = a * e - c * b; return diff === 0 ? 'São iguais' : diff > 0 ? 'A' : 'B'; }
  const [a = 0, b = 0, c = 0] = capture(p, /há (\d+) bolas azuis, (\d+) vermelhas e (\d+) verdes/u);
  return mode === 'complementar' ? a + b + c - a : fraction(a, a + b + c);
}));

algebraDadosTemplates.push(exerciseTemplate('prob-fracao-complementar', 'probabilidades', 'probabilidade-complementar', 'mcq', (r, d) => {
  const a = r(1, 25 + d * 10), b = r(1, 25 + d * 10), c = d === 1 ? 0 : r(1, 20), total = a + b + c;
  const answer = fraction(b + c, total), wrong = fraction(a, total);
  const distractor = wrong === answer ? fraction(b + c, total + a) : wrong;
  return { prompt: `Na quermesse, um saco tem ${a} fichas azuis, ${b} vermelhas e ${c} verdes, indistinguíveis ao tato e bem misturadas. Retira-se uma ao acaso. Qual é a probabilidade de não sair azul, como fração irredutível?`, answer, wrong: distractor, options: [answer, distractor, fraction(total + b + c, total)], hints: ['O acontecimento complementar de sair azul é não sair azul.', 'Conta as fichas vermelhas e verdes e divide pelo número total de fichas.'], explanation: `Há ${total} resultados individuais equiprováveis. Os ${b + c} resultados não azuis são favoráveis ao complementar. A probabilidade é ${b + c}/${total}, ou ${answer} na forma irredutível.`, feedback: 'O complementar reúne os resultados que não são azuis. Inclui vermelhas e verdes no numerador e todas as fichas no denominador.' };
}, p => { const [a = 0, b = 0, c = 0] = capture(p, /tem (\d+) fichas azuis, (\d+) vermelhas e (\d+) verdes/u); const total = a + b + c; return fraction(total - a, total); }));

algebraDadosTemplates.push(exerciseTemplate('seq-potencias', 'sequencias', 'sequencia-potencias', 'numeric', (r, d) => {
  const a = r(2, 9), b = r(1, 45), n = r(d + 1, d + 2);
  return { prompt: `Para n natural a partir de 1, a sequência do desafio segue a regra u(n) = ${a}^n + ${b}. Qual é o termo de ordem ${n}?`, answer: a ** n + b, wrong: a ** n === a * n ? a ** n : a * n + b, hints: ['Substitui n pela ordem pedida.', 'Calcula a potência antes de adicionar a parcela constante.'], explanation: `Na ordem ${n}, a potência tem ${n} fatores iguais a ${a}. O seu valor é ${a ** n}; adicionando ${b}, o termo pedido é ${a ** n + b}. Os termos crescem porque a base é maior que 1.`, feedback: a ** n === a * n ? 'Calculaste a potência, mas falta adicionar a parcela constante.' : 'Multiplicaste a base pelo expoente. O expoente indica quantos fatores iguais à base entram no produto.' };
}, p => {
  const [a = 1, b = 0] = capture(p, /u\(n\) = (\d+)\^n \+ (\d+)/u), [n = 1] = capture(p, /ordem (\d+)/u);
  let value = 1; for (let k = 0; k < n; k++) value *= a;
  return value + b;
}));
