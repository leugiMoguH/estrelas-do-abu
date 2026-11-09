import { scene } from '../../src/prototipos/f2b/scene';
import { describe, expect, it } from 'vitest';
import { actions, apply, initial, rewind, won, type World } from '../../src/prototipos/f2b/rules';
function solve(level: number): number | undefined {
  let queue: World[] = [initial(level)];
  const seen = new Set<string>();
  for (let depth = 0; depth <= 7; depth++) {
    const next: World[] = [];
    for (const s of queue) {
      if (won(s)) return depth;
      const key = JSON.stringify([s.a, s.b, s.stars]);
      if (seen.has(key)) continue;
      seen.add(key);
      for (const action of actions(s)) next.push(apply(s, action));
    }
    queue = next;
  }
  return undefined;
}
describe('Palavras-ferramenta', () => {
  it.each([0, 1, 2])('situação %i tem solução limitada e estados imutáveis', level => {
    expect(solve(level)).toBe([1, 2, 4][level]);
    const original = initial(level);
    const snapshot = structuredClone(original);
    for (const action of actions(original)) {
      const changed = apply(original, action);
      expect(changed).not.toBe(original);
      expect(rewind(changed, [original])).toEqual({ world: snapshot, history: [] });
    }
    expect(original).toEqual(snapshot);
  });
  it('anular repõe mensagens, vento e comportas, incluindo após recomeçar', () => {
    const start = initial(2);
    const failed = apply(start, {word: 'sopra', target: 'a'});
    const closed = apply(failed, {word: 'fecha', target: 'comporta-a'});
    const reset = initial(2);
    const first = rewind(reset, [start, failed, closed]);
    expect(first.world).toEqual(closed);
    const second = rewind(first.world, first.history);
    expect(second.world).toEqual(failed);
    expect(rewind(second.world, second.history)).toEqual({world: start, history: []});
    expect(rewind(start, [])).toEqual({world: start, history: []});
  });
  it('força excessiva e insuficiente falham com consequência observável', () => {
    for (const [word, target] of [['sopra', 'a'], ['sopram', 'b']] as const) {
      const result = apply(initial(1), {word, target});
      expect(result.failed).toBe(true);
      expect(result.stars).toBe(0);
      expect(result.wind).toBeGreaterThan(0);
      expect(result.message).toMatch(/margem|antes/);
    }
  });
  it('fechar o ramo superior corta acesso; dois ramos abertos dispersam a corrente', () => {
    const closed = apply(initial(2), {word: 'fecha', target: 'comporta-a'});
    expect(apply(closed, {word: 'sopram', target: 'a'}).failed).toBe(true);
    const both = apply(initial(2), {word: 'abre', target: 'comporta-b'});
    expect(apply(both, {word: 'sopram', target: 'a'}).failed).toBe(true);
    expect(apply(both, {word: 'sopra', target: 'b'}).failed).toBe(true);
  });
});

it.each([1, 2])('cena %i representa uma ou duas nuvens e o sopro de cada uma', level => {
  for (const [word, count] of [['sopra', 1], ['sopram', 2]] as const) {
    const html = scene(apply(initial(level), {word, target: 'a'}), true);
    expect(html.match(/class="cloud /g)).toHaveLength(count);
    expect(html.match(/class="gust"/g)).toHaveLength(count);
    expect(html.includes('joining')).toBe(count === 2);
  }
});
it('cena desenha portas e corrente apenas nos ramos abertos', () => {
  const html = scene(initial(2));
  expect(html.match(/gate-open/g)).toHaveLength(1);
  expect(html.match(/gate-closed/g)).toHaveLength(1);
  expect(html.match(/class="current"/g)).toHaveLength(1);
  expect(html).not.toContain('? fechado');
  const closed = scene(apply(initial(2), {word: 'fecha', target: 'comporta-a'}));
  expect(closed.match(/gate-closed/g)).toHaveLength(2);
  expect(closed).not.toContain('class="current"');
});
