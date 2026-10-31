import type { ExerciseTemplate } from '../../src/core/content';
import { base, random, template } from './shared';

export const propExtraTemplates: ExerciseTemplate[] = (['constante', 'expressao', 'tabela'] as const).map(mode => template(
  `prop-${mode}`, 'mat-proporcionalidade', `proporcionalidade-${mode}`,
  (seed, d) => {
    const r = random(seed), k = r(2 + d, 20 * d), x = r(2, 40 * d), step = r(1, 12 * d);
    const xs = [x, x + step, x + 2 * step];
    const offset = mode === 'tabela' && r(0, 1) ? r(1, 10 * d) : 0;
    const ys = xs.map(a => a * k + offset);
    const table = `No clube da escola, x é o número de saquetas e y é o número total de sementes. Tabela (x; y): (${xs[0]}; ${ys[0]}), (${xs[1]}; ${ys[1]}), (${xs[2]}; ${ys[2]}). `;
    const answer = mode === 'constante' ? String(k) : mode === 'expressao' ? `y = ${k}x` : offset ? 'Não' : 'Sim';
    const wrong = mode === 'constante' ? String(ys[0]! - x) : mode === 'expressao' ? `y = x + ${k}` : offset ? 'Sim' : 'Não';
    const common = base(`prop-${mode}`, 'mat-proporcionalidade', seed, d, table + (mode === 'constante' ? 'As grandezas são diretamente proporcionais. Qual é a constante y/x, em sementes por saqueta?' : mode === 'expressao' ? 'As grandezas são diretamente proporcionais. Qual expressão relaciona y com x?' : 'Estes três pares traduzem proporcionalidade direta entre x e y?'),
      ['Divide y por x em cada coluna da tabela.', 'Na proporcionalidade direta, todos os quocientes y/x são iguais e y = kx.'],
      `Compara os quocientes entre sementes e saquetas em todas as colunas. Uma diferença constante não basta: é necessário que y/x seja constante. A resposta é ${answer}.`, [[wrong, 'Compara razões y/x, em vez de diferenças entre as grandezas.']]);
    return mode === 'constante' ? { ...common, kind: 'numeric', correctAnswer: k } : { ...common, kind: 'mcq', options: mode === 'expressao' ? [`y = ${k}x`, `y = x + ${k}`, `y = x/${k}`, `y = ${k + 1}x`] : ['Sim', 'Não'], correctAnswer: answer };
  }, ex => {
    const pairs = [...ex.prompt.matchAll(/\((\d+); (\d+)\)/gu)].map(m => [Number(m[1]), Number(m[2])] as const);
    if (pairs.length !== 3) throw new Error('Tabela incompatível');
    const [x, y] = pairs[0]!;
    if (mode === 'constante') return { kind: 'numeric', value: String(y / x) };
    if (mode === 'expressao') { const [x2, y2] = pairs[1]!; return { kind: 'mcq', value: `y = ${(y2 - y) / (x2 - x)}x` }; }
    return { kind: 'mcq', value: pairs.every(([a, b]) => b * x === y * a) ? 'Sim' : 'Não' };
  },
));
