export const flavours = ['vanilla', 'chocolate', 'strawberry', 'mint'] as const;
export type Flavour = typeof flavours[number];
export interface Cone { scoops: Flavour[]; sauce: boolean; sprinkles: boolean }
export type Condition = { kind: 'scoops'; count: 1 | 2 } | { kind: 'top' | 'bottom' | 'exclude'; flavour: Flavour; dislike?: boolean } | {
  kind: 'sauce' | 'sprinkles'; value: boolean };
export interface Order { conditions: Condition[]; text: string }
export type Round = [Order, Order];
const cap = (s: string): string => s[0]!.toUpperCase() + s.slice(1);
export function reply(c: Condition): string {
  switch (c.kind) {
    case 'scoops': return c.count === 1 ? 'One scoop, please!' : 'Two scoops, please!';
    case 'top': return `${cap(c.flavour)} on top, please!`;
    case 'bottom': return `${cap(c.flavour)} at the bottom, please!`;
    case 'exclude': return c.dislike ? `I don't like ${c.flavour}!` : `No ${c.flavour}, please!`;
    default: return c.value ? `With ${c.kind}, please!` : `No ${c.kind}, please!`;
  }
}
export function check(order: Order, cone: Cone): (Condition & { phrase: string }) | null {
  for (const c of order.conditions) {
    const ok = c.kind === 'scoops' ? cone.scoops.length === c.count : c.kind === 'top' ? cone.scoops.at(-1) === c.flavour : c.kind ===
  'bottom' ? cone.scoops[0] === c.flavour : c.kind === 'exclude' ? !cone.scoops.includes(c.flavour) : ('value' in c && cone[c.kind as
  'sauce' | 'sprinkles'] === c.value);
    if (!ok) return { ...c, phrase: reply(c) };
  }
  return null;
}
export const firstRound = (): Round => [
  { text: 'One scoop, please. Any flavour!', conditions: [{ kind: 'scoops', count: 1 }] },
  { text: 'Two scoops, please. Chocolate on top, no sauce!', conditions: [{ kind: 'scoops', count: 2 }, { kind: 'top', flavour:
  'chocolate' }, { kind: 'sauce', value: false }] },
];
function request(conditions: Condition[]): string {
  const [count, ...details] = conditions;
  const clauses = details.map(c => reply(c).replace(', please!', '').replace('!', ''));
  if (details[0]?.kind === 'exclude' && details[0].dislike) {
    return `${reply(count!).replace('!', '.')} ${clauses[0]}! ${clauses[1]}.`;
  }
  const detail = clauses.map((clause, i) => i === 0 ? clause : clause[0]!.toLowerCase() + clause.slice(1)).join(', ');
  return `${reply(count!).replace('!', '.')} ${detail}!`;
}
export function generate(seed: number): Round {
  let state = seed >>> 0;
  const pick = (n: number): number => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return Math.floor(state / 4294967296 * n);
  };
  const simple: Order = { conditions: [{ kind: 'scoops', count: pick(2) === 0 ? 1 : 2 }], text: '' };
  simple.text = `${reply(simple.conditions[0]!).replace('!', '.')} Any flavour!`;
  const flavour = flavours[pick(4)]!;
  const mode = pick(3);
  const conditions: Condition[] = [{ kind: 'scoops', count: mode === 2 ? 1 : 2 }];
  if (mode < 2) conditions.push({ kind: mode === 0 ? 'top' : 'bottom', flavour });
  else conditions.push({ kind: 'exclude', flavour, dislike: pick(2) === 1 });
  conditions.push({ kind: pick(2) === 0 ? 'sauce' : 'sprinkles', value: pick(2) === 1 });
  return [simple, { conditions, text: request(conditions) }];
}
export function allCones(): Cone[] {
  const stacks: Flavour[][] = [[], ...flavours.map(f => [f]), ...flavours.flatMap(a => flavours.map(b => [a, b]))];
  return stacks.flatMap(scoops => [false, true].flatMap(sauce => [false, true].map(sprinkles => ({ scoops: [...scoops], sauce, sprinkles
  }))));
}

