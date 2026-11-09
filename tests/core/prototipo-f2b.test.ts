import { scene } from '../../src/prototipos/f2b/scene';
import { describe, expect, it } from 'vitest';
import { STEP, BOAT_START, exitX, actions, apply, initial, rewind, won, type World } from '../../src/prototipos/f2b/rules';
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
  it('um ou dois passos falham quando não correspondem à saída', () => {
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

it.each([1, 2])('cena %i mantém duas nuvens e representa um ou dois sopros', level => {
  for (const [word, count] of [['sopra', 1], ['sopram', 2]] as const) {
    const html = scene(apply(initial(level), {word, target: 'a'}), true);
    expect(html.match(/class="cloud /g)).toHaveLength(2);
    expect(html.match(/blowing/g)).toHaveLength(count);
    expect(html).toContain(`--push:${count * STEP}px`);
    expect(html.match(/class="gust"/g)).toHaveLength(count);
    expect(html).not.toContain('joining');
    expect(scene(initial(level)).match(/class="cloud /g)).toHaveLength(2);
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

it('saídas, movimentos de sucesso e seleção partilham a geometria', () => {
  expect(exitX('a') - BOAT_START).toBe(2 * STEP);
  expect(exitX('b') - BOAT_START).toBe(STEP);
  for (const [word, target, count] of [['sopram', 'a', 2], ['sopra', 'b', 1]] as const) {
    const world = apply(initial(1), {word, target});
    const html = scene(world, true);
    expect(world.failed).toBe(false);
    expect(html).toContain(`--distance:${-count * STEP}px;--push:${count * STEP}px`);
    expect(html).toContain(`translate(${exitX(target)} ${target === 'a' ? 135 : 245})`);
    expect(html).toContain(`<text x="${exitX(target)}"`);
    expect(scene(world, false, word).match(/selected-cloud/g)).toHaveLength(count);
    expect(scene(world)).not.toContain('selected-cloud');
    expect(scene(world, false, 'abre')).not.toContain('selected-cloud');
    expect(world.message).toContain(count === 1 ? '<strong>A nuvem sopra e empurra</strong>' : '<strong>As nuvens sopram e empurram</strong>');
  }
});
it('mensagens e água distinguem canal fechado de corrente dividida', () => {
  const closed = apply(initial(2), {word: 'sopra', target: 'b'});
  expect(closed.message).toContain('A comporta deste canal está fechada: a água está parada.');
  const both = apply(initial(2), {word: 'abre', target: 'comporta-b'});
  for (const target of ['a', 'b'] as const) {
    expect(apply(both, {word: 'sopram', target}).message).toContain('A água divide-se pelos dois canais e não leva o barco.');
  }
  const html = scene(both);
  expect(html.match(/flowing divided/g)).toHaveLength(2);
  expect(html.match(/stroke-width="24"/g)).toHaveLength(2);
});
