import type { Difficulty, ExerciseTemplate } from '../../src/core/content';
import type { Exercise } from '../../src/core/types';
import type { Topic } from '../index';
import { base, fmt, numericAnswer, random, template } from './shared';

type Case = { prompt: string; value: number; wrong: number; rule: string };
const read = (ex: Exercise, pattern: RegExp): number[] => {
  const m = ex.prompt.match(pattern);
  if (!m) throw new Error(`Enunciado incompatível: ${ex.prompt}`);
  return m.slice(1).map(s => Number(s.replace(',', '.')));
};
// Todos os cálculos com π são feitos em centésimas inteiras.
const cents = (s: string) => { const [a = '0', b = ''] = s.split(','); return Number(a) * 100 + Number(b.padEnd(2, '0')); };
function exercise(id: string, topic: string, concept: string, kind: 'numeric' | 'cloze', make: (seed: number, d: Difficulty) => Case, solve: (ex: Exercise) => number): ExerciseTemplate {
  return template(id, `mat-${topic}`, concept, (seed, d) => {
    const c = make(seed, d);
    const common = base(id, `mat-${topic}`, seed, d, c.prompt,
      [c.rule, 'Identifica os dados e a unidade pedida; calcula por etapas e confirma o resultado.'],
      `${c.rule} Aplicando esta relação aos dados do enunciado, obtemos ${fmt(c.value)}. Confirma a unidade antes de responder.`,
      [[fmt(c.wrong), 'Confundiste as grandezas ou a operação. ' + c.rule]]);
    return kind === 'numeric' ? { ...common, kind, correctAnswer: c.value } : { ...common, kind, correctAnswers: [[String(c.value), fmt(c.value)]] };
  }, ex => numericAnswer(ex, solve(ex)));
}
const dimensions = (seed: number, d: Difficulty) => { const r = random(seed); return [r(2 + d, 25 * d), r(3, 30 * d), r(2, 20 * d)] as const; };
const circle = (id: string, mode: 'perimetro' | 'area' | 'raio' | 'diametro') => exercise(`circ-${id}`, 'circulo', id, mode === 'raio' ? 'cloze' : 'numeric', (seed, d) => {
  const r = random(seed), radius = r(2, 30 * d), count = r(1, 12 * d);
  const diameter = radius * 2, perimeter100 = 628 * radius;
  const prompt = mode === 'perimetro' ? `Uma roda tem diâmetro ${diameter} cm. Rola sem deslizar durante ${count} voltas completas. Que distância percorre, em cm?`
    : mode === 'area' ? `Cada mesa redonda tem diâmetro ${diameter} dm. Há ${count} mesas iguais na cantina. Qual é a área total dos tampos, em dm²?`
    : mode === 'raio' ? `Uma pista circular tem diâmetro ${diameter} m. Qual é o raio, em m?`
    : `Uma pista circular tem perímetro ${fmt(perimeter100 / 100)} m. Qual é o diâmetro, em m?`;
  const value = mode === 'perimetro' ? perimeter100 * count / 100 : mode === 'area' ? 314 * radius * radius * count / 100 : mode === 'raio' ? radius : diameter;
  // Nas conversões simples, décimas aumentam os casos naturais sem contexto artificial.
  if (mode === 'raio') {
    const diam10 = r(20 * d, 1000 * d);
    return { prompt: `Uma pista circular tem diâmetro ${fmt(diam10 / 10)} m. Qual é o raio, em m? Responde exatamente, sem arredondar.`, value: diam10 / 20, wrong: diam10 / 5, rule: 'O diâmetro é o dobro do raio: divide o diâmetro por 2.' };
  }
  if (mode === 'diametro') {
    const diam = r(20 * d, 1000 * d);
    return { prompt: `Uma pista circular tem perímetro ${fmt(314 * diam / 100)} m. Usa π≈3,14. Qual é o diâmetro, em m? Responde exatamente, sem arredondar.`, value: diam, wrong: diam / 2, rule: 'O perímetro é π vezes o diâmetro; divide o perímetro por 3,14.' };
  }
  return { prompt: prompt + ' Usa π≈3,14. Responde exatamente, sem arredondar.', value, wrong: mode === 'area' ? value * 4 : value * 2, rule: mode === 'area' ? 'A área de cada círculo é π × raio × raio; soma as áreas dos tampos.' : 'Em cada volta percorre π × diâmetro; multiplica pelo número de voltas.' };
}, ex => {
  if (mode === 'raio') { const [diam = 0] = read(ex, /diâmetro ([\d,]+) m/u); return diam / 2; }
  if (mode === 'diametro') { const m = ex.prompt.match(/perímetro ([\d,]+) m/u)!; return cents(m[1]!) / 314; }
  const [diam = 0, count = 0] = read(ex, mode === 'area' ? /diâmetro (\d+) dm\. Há (\d+) mesas/u : /diâmetro (\d+) cm\..*durante (\d+) voltas/u);
  return mode === 'area' ? 314 * (diam / 2) ** 2 * count / 100 : 314 * diam * count / 100;
});
const anglePair = (supplement: boolean) => exercise(supplement ? 'ang-suplementar' : 'ang-complementar', 'angulos', supplement ? 'suplementares' : 'complementares', 'cloze', (seed, d) => {
  const total = supplement ? 180 : 90, a10 = random(seed)(10 * d, total * 10 - 10);
  return { prompt: `Na aula de desenho, um ângulo mede ${fmt(a10 / 10)}°. Quanto mede o seu ${supplement ? 'suplementar' : 'complementar'}, em graus? Responde exatamente, sem arredondar.`, value: (total * 10 - a10) / 10, wrong: ((supplement ? 90 : 180) * 10 - a10) / 10, rule: `As amplitudes de ângulos ${supplement ? 'suplementares' : 'complementares'} somam ${total}°.` };
}, ex => { const [a = 0] = read(ex, /mede ([\d,]+)°/u); return ((supplement ? 180 : 90) * 10 - Math.round(a * 10)) / 10; });
const triangle = (external: boolean) => exercise(external ? 'ang-externo' : 'ang-triangulo', 'angulos', external ? 'externo-triangulo' : 'soma-triangulo', 'numeric', (seed, d) => {
  const r = random(seed), a = r(10, 40 + d * 10), b = r(10, 70);
  return { prompt: `Um triângulo de um azulejo tem ângulos internos A=${a}° e B=${b}°. ${external ? 'Prolonga-se o lado AC para além de C. Quanto mede o ângulo externo adjacente ao ângulo interno C' : 'Quanto mede o ângulo interno C'}, em graus?`, value: external ? a + b : 180 - a - b, wrong: external ? a : 360 - a - b, rule: external ? 'O ângulo externo é a soma dos dois ângulos internos não adjacentes.' : 'Os três ângulos internos de um triângulo somam 180°.' };
}, ex => { const [a = 0, b = 0] = read(ex, /A=(\d+)° e B=(\d+)°/u); return external ? a + b : 180 - (a + b); });
const quadrilateral = exercise('ang-quadrilatero', 'angulos', 'soma-quadrilatero', 'numeric', (seed, d) => {
  const r = random(seed), a = r(50, 70 + 10 * d), b = r(60, 100), c = r(71, 100);
  return { prompt: `Um quadrilátero convexo desenhado no caderno tem três ângulos internos de ${a}°, ${b}° e ${c}°. Quanto mede o quarto ângulo interno, em graus?`, value: 360 - a - b - c, wrong: 180 - a - b - c, rule: 'Um quadrilátero divide-se em dois triângulos; os ângulos internos somam 360°.' };
}, ex => { const [a = 0, b = 0, c = 0] = read(ex, /de (\d+)°, (\d+)° e (\d+)°/u); return 180 - a + 180 - b - c; });
const classification = template('ang-poligono', 'mat-angulos', 'classificar-poligonos', (seed, d) => {
  const r = random(seed), side = r(2, 100 * d), n = r(4, 12 + d), regular = r(0, 1) === 1, concave = !regular && r(0, 1) === 1;
  const desc = regular ? 'todos os lados e todos os ângulos internos são iguais' : concave ? 'há um ângulo interno superior a 180°' : 'todos os ângulos internos são inferiores a 180° e há lados de comprimentos diferentes';
  const answer = regular ? 'Convexo e regular' : concave ? 'Côncavo e irregular' : 'Convexo e irregular';
  return { ...base('ang-poligono', 'mat-angulos', seed, d, `Para decorar a escola, recorta-se um polígono simples de ${n} lados. Um lado mede ${side} cm; ${desc}. Como se classifica?`, ['Num polígono convexo, nenhum ângulo interno ultrapassa 180°.', 'Um polígono regular tem todos os lados iguais e todos os ângulos iguais.'], 'A convexidade depende dos ângulos internos. A regularidade exige simultaneamente igualdade dos lados e dos ângulos; verifica ambas as condições da descrição.', [[regular ? 'Convexo e irregular' : 'Convexo e regular', 'Verifica tanto a igualdade dos lados como a dos ângulos.']]), kind: 'mcq', options: ['Convexo e regular', 'Convexo e irregular', 'Côncavo e irregular'], correctAnswer: answer };
}, ex => ({ kind: 'mcq', value: /todos os lados e todos os ângulos/u.test(ex.prompt) ? 'Convexo e regular' : /superior a 180/u.test(ex.prompt) ? 'Côncavo e irregular' : 'Convexo e irregular' }));
const box = (mode: 'cubo' | 'caixa' | 'cubinhos' | 'altura' | 'litros') => exercise(`vol-${mode}`, 'volumes', mode, mode === 'altura' || mode === 'litros' ? 'cloze' : 'numeric', (seed, d) => {
  const [a, b, h] = dimensions(seed, d), edge = random(seed)(2, 200 * d);
  const prompt = mode === 'cubo' ? `Um cubo de madeira tem aresta ${edge} cm. Qual é o volume, em cm³?`
    : mode === 'altura' ? `Uma caixa retangular tem volume ${a * b * h} cm³, comprimento ${a} cm e largura ${b} cm. Qual é a altura, em cm?`
    : mode === 'litros' ? `Um aquário retangular tem medidas interiores ${a} dm de comprimento, ${b} dm de largura e ${h} dm de altura. Cheio até ao bordo, quantos litros contém? Usa 1 dm³ = 1 litro.`
    : `Uma caixa retangular tem medidas interiores ${a} cm de comprimento, ${b} cm de largura e ${h} cm de altura. ${mode === 'cubinhos' ? 'Quantos cubos de aresta 1 cm cabem, alinhados com as faces e sem espaços?' : 'Qual é o volume, em cm³?'}`;
  return { prompt, value: mode === 'cubo' ? edge ** 3 : mode === 'altura' ? h : a * b * h, wrong: mode === 'cubo' ? edge ** 2 : mode === 'altura' ? h * b : a + b + h, rule: 'O volume é área da base × altura. Cada dm³ corresponde a um litro; num cubo as três dimensões são iguais.' };
}, ex => {
  if (mode === 'cubo') { const [a = 0] = read(ex, /aresta (\d+) cm/u); return Array.from({ length: a }, () => a * a).reduce((x, y) => x + y, 0); }
  if (mode === 'altura') { const [v = 0, a = 1, b = 1] = read(ex, /volume (\d+) cm³, comprimento (\d+) cm e largura (\d+) cm/u); return v / a / b; }
  const [a = 0, b = 0, h = 0] = read(ex, /interiores (\d+) (?:cm|dm) de comprimento, (\d+) (?:cm|dm) de largura e (\d+) (?:cm|dm) de altura/u);
  return Array.from({ length: h }, () => a * b).reduce((x, y) => x + y, 0);
});
const cylinder = exercise('vol-cilindro', 'volumes', 'cilindro', 'numeric', (seed, d) => {
  const [r, h] = dimensions(seed, d);
  return { prompt: `Uma lata cilíndrica tem diâmetro interior ${2 * r} cm e altura interior ${h} cm. Usa π≈3,14. Qual é o volume interior, em cm³? Responde exatamente, sem arredondar.`, value: 314 * r * r * h / 100, wrong: 314 * 4 * r * r * h / 100, rule: 'Divide o diâmetro por 2. Multiplica a área circular da base pela altura.' };
}, ex => { const [diam = 0, h = 0] = read(ex, /diâmetro interior (\d+) cm e altura interior (\d+) cm/u); const layer100 = 314 * (diam / 2) ** 2; return Array.from({ length: h }, () => layer100).reduce((a, b) => a + b, 0) / 100; });
const orders = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72];
const rotation = (mode: 'minimo' | 'eixos' | 'volta') => exercise(`rot-${mode}`, 'rotacoes', mode, mode === 'eixos' ? 'cloze' : 'numeric', (seed, d) => {
  const r = random(seed), n = orders[r(d - 1, 7 + d * 3)]!, radius = r(2, 100 * d), angle = 360 / n;
  const intro = `No clube de artes, desenha-se um polígono regular de ${n} lados inscrito numa circunferência de raio ${radius} cm, com centro O. `;
  return { prompt: intro + (mode === 'minimo' ? 'Qual é o menor ângulo positivo de rotação em torno de O que o faz coincidir consigo próprio, em graus?' : mode === 'eixos' ? 'Quantos eixos de simetria de reflexão tem?' : `Um vértice marcado roda ${angle}° de cada vez em torno de O. Quantas destas rotações são necessárias para esse vértice voltar pela primeira vez à posição inicial?`) + ' O sentido positivo é contrário ao dos ponteiros do relógio.', value: mode === 'minimo' ? angle : n, wrong: mode === 'minimo' ? 180 / n : mode === 'eixos' ? n * 2 : angle === n ? n * 2 : angle, rule: 'Uma volta completa mede 360°. Um polígono regular de n lados tem n eixos e repete-se a cada 360° ÷ n.' };
}, ex => { const [n = 1] = read(ex, /regular de (\d+) lados/u); if (mode === 'eixos') return n; if (mode === 'volta') { const [a = 1] = read(ex, /roda ([\d,]+)°/u); return 360 / a; } let a = 1; while (a * n < 360) a++; return a; });
const composition = exercise('rot-composicao', 'rotacoes', 'composicao', 'numeric', (seed, d) => {
  const r = random(seed), a = r(1, 120 * d), b = r(1, 120 * d), c = d === 3 ? r(1, 359) : 0;
  return { prompt: `Uma seta roda em torno do centro O, primeiro ${a}° e depois ${b}°${d === 3 ? ` e finalmente ${c}°` : ''}. Todas as rotações têm sentido positivo (contrário ao dos ponteiros do relógio). Qual é o ângulo da rotação equivalente entre 0° inclusive e 360° exclusive, em graus?`, value: (a + b + c) % 360, wrong: Math.abs(a - b - c) === (a + b + c) % 360 ? a + b + c + 360 : Math.abs(a - b - c), rule: 'Com o mesmo centro e sentido, soma as amplitudes e retira voltas completas de 360°.' };
}, ex => { const [a = 0, b = 0] = read(ex, /primeiro (\d+)° e depois (\d+)°/u); const c = Number(ex.prompt.match(/finalmente (\d+)°/u)?.[1] ?? 0); let total = a + b + c; while (total >= 360) total -= 360; return total; });
export const geometriaTemplates: ExerciseTemplate[] = [circle('perimetro', 'perimetro'), circle('area', 'area'), circle('raio', 'raio'), circle('diametro-inverso', 'diametro'), anglePair(false), anglePair(true), triangle(false), triangle(true), quadrilateral, classification, box('cubo'), box('caixa'), box('cubinhos'), box('altura'), box('litros'), cylinder, rotation('minimo'), rotation('eixos'), rotation('volta'), composition];
export const geometriaTopics: Topic[] = [
  ['circulo', 'Círculo', 'Perímetros, áreas e medidas de círculos.', '⭕'],
  ['angulos', 'Ângulos e polígonos', 'Relacionar ângulos e classificar polígonos.', '📐'],
  ['volumes', 'Volumes', 'Medir o espaço ocupado por sólidos e relacionar volume e capacidade.', '📦'],
  ['rotacoes', 'Rotações e simetrias', 'Rodar figuras e reconhecer simetrias.', '🔄'],
].map(([id = '', title = '', blurb = '', icon = '']) => ({ id, subject: 'matematica', group: 'Geometria e medida', level: '6', title, blurb, icon, competencyIds: [`mat-${id}`], curriculumRef: `DGE — Aprendizagens Essenciais, 6.º ano: ${title}` }));



// Conversões nos dois sentidos e rosáceas completam as representações do tema.
geometriaTemplates.push(
  exercise('circ-diametro', 'circulo', 'raio-diametro', 'cloze', (seed, d) => {
    const radius10 = random(seed)(10 * d, 1500 * d);
    return { prompt: `Uma mesa redonda tem raio ${fmt(radius10 / 10)} cm. Qual é o diâmetro, em cm? Responde exatamente, sem arredondar.`, value: radius10 / 5, wrong: radius10 / 20, rule: 'O diâmetro contém dois raios; multiplica o raio por 2.' };
  }, ex => { const [radius = 0] = read(ex, /raio ([\d,]+) cm/u); return (Math.round(radius * 10) + Math.round(radius * 10)) / 10; }),
  exercise('vol-litros-dm3', 'volumes', 'capacidade-volume', 'cloze', (seed, d) => {
    const r = random(seed), bottles = r(2, 80 * d), capacity = r(1, 10 * d);
    return { prompt: `No clube de ciências, enchem-se ${bottles} garrafas com ${capacity} litros de água em cada uma. Qual é o volume total de água, em dm³? Usa 1 litro = 1 dm³.`, value: bottles * capacity, wrong: bottles * capacity * 1000, rule: 'Cada litro corresponde a um dm³. Multiplica o número de garrafas pela capacidade de cada uma.' };
  }, ex => { const [n = 0, l = 0] = read(ex, /enchem-se (\d+) garrafas com (\d+) litros/u); return Array.from({ length: n }, () => l).reduce((a, b) => a + b, 0); }),
  exercise('rot-rosacea', 'rotacoes', 'rosacea', 'numeric', (seed, d) => {
    const r = random(seed), n = orders[r(d - 1, 7 + d * 3)]!, radius = r(3, 100 * d);
    return { prompt: `Para decorar o caderno, constrói-se uma rosácea de ordem ${n}, com centro O e raio exterior ${radius} cm. Qual é o menor ângulo positivo de rotação em torno de O que a faz coincidir consigo própria, em graus? O sentido positivo é contrário ao dos ponteiros do relógio.`, value: 360 / n, wrong: 180 / n, rule: 'A ordem da rosácea conta as repetições numa volta: divide 360° pela ordem.' };
  }, ex => { const [n = 1] = read(ex, /rosácea de ordem (\d+)/u); let angle = 1; while (n * angle < 360) angle++; return angle; }),
);
