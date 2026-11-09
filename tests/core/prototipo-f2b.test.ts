import { describe, expect, it } from 'vitest';
import { actions, apply, initial, won, type World } from '../../src/prototipos/f2b/rules';
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
    const history = [original];
    const changed = apply(original, actions(original)[0]!);
    expect(changed).not.toBe(original);
    expect(history.pop()).toEqual(snapshot);
    expect(original).toEqual(snapshot);
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
