export const STEP = 100;
export const BOAT_START = 105;
export const exitSteps = (target: 'a' | 'b'): number => target === 'a' ? 2 : 1;
export const exitX = (target: 'a' | 'b'): number => BOAT_START + exitSteps(target) * STEP;
export type Word = 'abre' | 'fecha' | 'sopra' | 'sopram';
export type Target = 'caixa' | 'a' | 'b' | 'comporta-a' | 'comporta-b';
export interface Action {
  word: Word;
  target: Target;
}
export interface World {
  level: number;
  a: boolean;
  b: boolean;
  stars: number;
  failed: boolean;
  message: string;
  wind: number;
  target: Target | '';
}
export const initial = (level: number): World => ({
  level, a: true, b: false, stars: 0, failed: false, message: '', wind: 0, target: '',
});
export const won = (s: World): boolean => s.stars === (s.level === 0 ? 1 : 3);
export function rewind(world: World, history: readonly World[]): { world: World; history: World[] } {
  return {
    world: history.at(-1) ?? world,
    history: history.slice(0, -1),
  };
}
export function actions(s: World): Action[] {
  if (s.level === 0) return [{ word: 'abre', target: 'caixa' }];
  const list: Action[] = [];
  for (const word of ['sopra', 'sopram'] as const) {
    for (const target of ['a', 'b'] as const) list.push({ word, target });
  }
  if (s.level === 2) for (const word of ['abre', 'fecha'] as const) {
    for (const target of ['comporta-a', 'comporta-b'] as const) list.push({ word, target });
  }
  return list;
}
export function apply(s: World, action: Action): World {
  if (!actions(s).some(a => a.word === action.word && a.target === action.target)) return s;
  const n = { ...s, failed: false, wind: 0, target: action.target };
  if (action.target === 'caixa') {
    return { ...n, stars: 1, message: 'O Abu abre a caixa.' };
  }
  if (action.target.startsWith('comporta')) {
    const key = action.target === 'comporta-a' ? 'a' : 'b';
    n[key] = action.word === 'abre';
    n.message = `O Abu ${action.word} a comporta ${key === 'a' ? 'de cima' : 'de baixo'}.`;
    return n;
  }
  const bit = action.target === 'a' ? 1 : 2;
  n.wind = action.word === 'sopra' ? 1 : 2;
  const phrase = n.wind === 1 ? '<strong>A nuvem sopra e empurra</strong> o barco.' : '<strong>As nuvens sopram e empurram</strong> o barco.';
  const connected = s.level !== 2 || (action.target === 'a' ? s.a && !s.b : s.b && !s.a);
  const correct = n.wind * STEP === exitSteps(action.target as 'a' | 'b') * STEP;
  n.failed = !connected || !correct || Boolean(s.stars & bit);
  if (!n.failed) n.stars |= bit;
  n.message = phrase + (n.failed
    ? !connected ? (s.a && s.b ? ' A água divide-se pelos dois canais e não leva o barco.' : ' A comporta deste canal está fechada: a água está parada.')
      : correct ? ' Este barco já chegou.' : n.wind === 2
        ? ' Passou a saída e bateu na margem!' : ' Ficou antes da saída!'
    : ' A estrela chegou à sua saída!');
  return n;
}
