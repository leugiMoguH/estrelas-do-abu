export type Layer = 0 | 1 | 2;
export interface Form {
  text: string;
  plural: boolean;
  time: Layer
}
export interface Card {
  id: string;
  subjects: [string, string];
  tail: string;
  forms: Form[]
}
export interface Choice {
  card: number;
  subject: number;
  form: number;
  layer: Layer
}
export interface World {
  open: boolean;
  bridge: number;
  stars: number;
  bumped: boolean;
  echo: boolean
}
export interface Step {
  world: World;
  kind: 'impossible' | 'effect' | 'no-effect';
  text: string;
  card: number;
  agreementError?: boolean;
}
export interface Challenge {
  title: string;
  goal: string;
  cards: Card[];
  solution: Choice[]
}
const form = (text: string, plural: boolean, time: Layer): Form => ({text, plural, time});
const abu: [string, string] = ['O Abu', 'O Abu e a estrela'];
const stars: [string, string] = ['A estrela', 'As estrelas'];
const open: Card = {
  id: 'open',
  subjects: abu,
  tail: 'a caixa',
  forms: [form('abriu', false, 0),
    form('abre', false, 1),
    form('abrem', true, 1)]
};
const distractor: Card = {
  id: 'wait',
  subjects: abu,
  tail: 'junto à passagem',
  forms: [form('esperou', false, 0),
    form('espera', false, 1),
    form('esperará', false, 2)]
};
const cross: Card = {
  id: 'cross',
  subjects: stars,
  tail: 'o canal',
  forms: [form('atravessa', false, 1),
    form('atravessam', true, 1),
    form('atravessarão', true, 2)]
};
export const challenges: Challenge[] = [
  {
    title: 'A caixa dos ecos',
    goal: 'Liberta a estrela da caixa para a constelação.',
    cards: [open,
      {
        id: 'release',
        subjects: stars,
        tail: 'da caixa',
        forms: [form('sai', false, 1),
          form('saem', true, 1),
          form('sairá', false, 2)]
      },
      distractor],
    solution: [{card: 0, subject: 0, form: 0, layer: 0},
      {card: 1, subject: 0, form: 0, layer: 1}]
  },
  {
    title: 'Duas pontas, uma ponte',
    goal: 'Ergue as duas pontas da ponte e faz passar as duas estrelas.',
    cards: [{
        id: 'lift',
        subjects: stars,
        tail: 'a ponte',
        forms: [form('levantou', false, 0),
          form('levantaram', true, 0),
          form('levantam', true, 1)]
      },
      {
        ...cross,
        tail: 'a ponte'
      },
      distractor],
    solution: [{card: 0, subject: 1, form: 1, layer: 0},
      {card: 1, subject: 1, form: 1, layer: 1}]
  },
  {
    title: 'O canal do tempo',
    goal: 'Faz passar as duas estrelas e deixa a comporta fechada.',
    cards: [{
        ...open,
        tail: 'a comporta'
      },
      cross,
      {
        id: 'close',
        subjects: abu,
        tail: 'a comporta',
        forms: [form('fechará', false, 2),
          form('fecha', false, 1),
          form('fecharão', true, 2)]
      },
      distractor],
    solution: [{card: 0, subject: 0, form: 0, layer: 0},
      {card: 1, subject: 1, form: 1, layer: 1},
      {card: 2, subject: 0, form: 0, layer: 2}]
  },
];
