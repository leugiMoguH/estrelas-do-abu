import { challenges, type Card, type Choice, type Step, type World } from './challenges';
export { challenges } from './challenges';
export type { Layer, Form, Card, Choice, World, Step, Challenge } from './challenges';

export const initialWorld = (): World => ({
  open: false, bridge: 0, stars: 0, bumped: false, echo: false,
});

function invalidReason(card: Card | undefined, choice: Choice, duplicate: boolean): string {
  const form = card?.forms[choice.form];
  if (!card || !form || ![0, 1].includes(choice.subject) ||
      ![0, 1, 2].includes(choice.layer) || duplicate) {
    return 'Este eco não consegue formar um acontecimento.';
  }
  if (form.plural !== (choice.subject === 1)) {
    return 'O eco ficou incompleto: estas palavras não combinam entre si.';
  }
  return form.time !== choice.layer
    ? 'O acontecimento não encaixa neste tempo; o eco ficou suspenso.' : '';
}

export function simulate(level: number, choices: readonly Choice[]): {steps: Step[]; success: boolean} {
  const challenge = challenges[level];
  if (!challenge) return {steps: [], success: false};
  let world = initialWorld();
  const steps: Step[] = [];
  const seen = new Set<number>();
  for (const choice of [...choices].sort((a, b) => a.layer - b.layer)) {
    const card = challenge.cards[choice.card];
    const reason = invalidReason(card, choice, seen.has(choice.card));
    world = {...world, bumped: false, echo: false};
    if (reason) {
      world.echo = true;
      const form = card?.forms[choice.form];
      if (card?.id === 'lift' && form && form.plural !== (choice.subject === 1)) {
        world.bridge = Math.max(1, world.bridge);
      }
      steps.push({
        world: {...world}, kind: 'impossible', text: reason, card: choice.card,
        agreementError: !!form && form.plural !== (choice.subject === 1),
      });
    } else {
      const step = applyEffect(level, card!, choice, world);
      world = step.world;
      steps.push({...step, world: {...world}});
    }
    seen.add(choice.card);
  }
  const success = steps.length > 0 && steps.every(step => step.kind !== 'impossible') &&
    world.stars === (level === 0 ? 1 : 2) && (level !== 2 || !world.open);
  return {steps, success};
}

function crossing(level: number, world: World, count: number): {kind: Step['kind']; text: string} {
  const pass = level === 1 ? world.bridge === 2 : world.open;
  if (pass) {
    world.stars = count;
    return {kind: 'effect', text: count === 2
      ? 'As duas estrelas chegaram à constelação.' : 'Uma estrela chegou à constelação.'};
  }
  world.bumped = true;
  return {kind: 'no-effect', text: level === 0
    ? 'A estrela bateu na tampa fechada e ficou à espera.'
    : 'A passagem travou as estrelas; ficaram na margem.'};
}

function applyEffect(level: number, card: Card, choice: Choice, previous: World): Step {
  const world = {...previous};
  const count = choice.subject === 1 ? 2 : 1;
  let kind: Step['kind'] = 'effect';
  let text = '';
  switch (card.id) {
    case 'wait':
      kind = 'no-effect';
      text = 'O Abu ficou à espera junto à passagem; as estrelas não se moveram.';
      break;
    case 'open':
      kind = world.open ? 'no-effect' : 'effect';
      world.open = true;
      text = 'A passagem abriu-se; as estrelas ainda esperam pelo seu eco.';
      break;
    case 'close':
      kind = world.open ? 'effect' : 'no-effect';
      world.open = false;
      text = 'A comporta fechou-se; quem ficou na margem terá de esperar.';
      break;
    case 'lift':
      kind = world.bridge === count ? 'no-effect' : 'effect';
      world.bridge = count;
      text = count === 1 ? 'Só uma ponta subiu; a ponte ficou inclinada.'
        : 'As duas estrelas ergueram as duas pontas da ponte.';
      break;
    case 'release':
    case 'cross':
      ({kind, text} = crossing(level, world, count));
  }
  return {world, kind, text, card: choice.card};
}

export interface Board { choices: Choice[]; history: Choice[][] }
export const newBoard = (): Board => ({choices: [], history: []});

export function place(board: Board, choice: Choice): Board {
  return {
    history: [...board.history, board.choices.map(item => ({...item}))],
    choices: [...board.choices.filter(item => item.card !== choice.card), {...choice}],
  };
}

export function undo(board: Board): Board {
  return board.history.length
    ? {choices: board.history.at(-1)!, history: board.history.slice(0, -1)} : newBoard();
}

export function sentence(card: Card, choice: Choice): string {
  return `${card.subjects[choice.subject]} ${card.forms[choice.form]?.text} ${card.tail}`;
}
