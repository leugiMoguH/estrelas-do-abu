import { describe, expect, it } from 'vitest';
import { allCones, check, firstRound, generate, reply } from '../../src/prototipos/en/rules';
describe('Festival do Abu — gelado editável', () => {
  it('ronda inicial exata e primeira condição falhada', () => {
    const [free, order] = firstRound();
    expect(free.text).toBe('One scoop, please. Any flavour!');
    expect(free.conditions).toEqual([{ kind: 'scoops', count: 1 }]);
    expect(order.text).toBe('Two scoops, please. Chocolate on top, no sauce!');
    expect(order.conditions).toEqual([{ kind: 'scoops', count: 2 }, { kind: 'top', flavour: 'chocolate' }, { kind: 'sauce', value: false }]);
    expect(check(order, { scoops: [], sauce: true, sprinkles: false })?.phrase).toBe('Two scoops, please!');
    expect(check(order, { scoops: ['chocolate', 'mint'], sauce: true, sprinkles: false })?.phrase).toBe('Chocolate on top, please!');
    expect(check(order, { scoops: ['mint', 'chocolate'], sauce: true, sprinkles: false })?.phrase).toBe('No sauce, please!');
    expect(check(order, { scoops: ['mint', 'chocolate'], sauce: false, sprinkles: true })).toBeNull();
    expect(reply({ kind: 'exclude', flavour: 'mint', dislike: true })).toBe("I don't like mint!");
  });
  it('enumera os 84 cones; cada pedido tem liberdade e o exigente aceita menos de 25%', () => {
    const cones = allCones();
    expect(cones).toHaveLength(84);
    const seen = new Set<string>();
    for (let seed = 0; seed < 2000; seed++) {
      const pair = seed === 0 ? firstRound() : generate(seed * 7919);
      expect(generate(seed)).toEqual(generate(seed));
      pair.forEach((order, i) => {
        expect((order.text.match(/please/gi) ?? []).length).toBeLessThanOrEqual(1);
        const solutions = cones.filter(c => !check(order, c));
        expect(solutions.length).toBeGreaterThanOrEqual(2);
        if (i === 1) {
          expect(solutions.length / cones.length).toBeLessThan(.25);
          expect(order.conditions.length).toBeGreaterThanOrEqual(2);
          expect(order.conditions.length).toBeLessThanOrEqual(3);
        }
        expect(new Set(order.conditions.map(c => c.kind)).size).toBe(order.conditions.length);
        order.conditions.forEach(c => seen.add(c.kind + ('dislike' in c ? String(c.dislike) : '')));
        // Every individual failure must name the first unsatisfied condition.
        cones.forEach(cone => {
          const failed = order.conditions.find(c => check({ conditions: [c], text: '' }, cone));
          expect(check(order, cone)?.phrase ?? null).toBe(failed ? reply(failed) : null);
        });
      });
    }
    for (const kind of ['top', 'bottom', 'excludetrue', 'excludefalse', 'sauce', 'sprinkles']) expect(seen.has(kind)).toBe(true);
  });
});
