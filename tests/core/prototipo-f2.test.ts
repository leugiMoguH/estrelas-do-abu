import {describe,it,expect} from 'vitest';
import {challenges,simulate,newBoard,place,undo,type Choice,type Layer} from '../../src/prototipos/f2/rules';
function permutations<T>(items: T[]): T[][] {
  return items.length ? items.flatMap((item, index) =>
    permutations(items.filter((_, other) => other !== index)).map(rest => [item, ...rest])) : [[]];
}

function* combinations(level: number, card = 0, prefix: Choice[] = []): Generator<Choice[]> {
  const challenge = challenges[level]!;
  if (card === challenge.cards.length) { yield* permutations(prefix); return; }
  yield* combinations(level, card + 1, prefix);
  for (let subject = 0; subject < 2; subject++) {
    for (let form = 0; form < challenge.cards[card]!.forms.length; form++) {
      for (const layer of [0, 1, 2] as Layer[]) {
        yield* combinations(level, card + 1, [...prefix, {card, subject, form, layer}]);
      }
    }
  }
}

describe('Ecos das Estrelas — regras e busca exaustiva', () => {
  for (let level = 0; level < 3; level++) {
    it(`desafio ${level + 1}: subconjuntos, combinações, ordens e classificação`, () => {
      let solutions = 0, impossible = 0, noEffect = 0, checked = 0, misclassified = 0;
      for (const choices of combinations(level)) {
        checked++;
        const result = simulate(level, choices);
        if (result.success) solutions++;
        impossible += result.steps.filter(step => step.kind === 'impossible').length;
        noEffect += result.steps.filter(step => step.kind === 'no-effect').length;
        for (const choice of choices) {
          const form = challenges[level]!.cards[choice.card]!.forms[choice.form]!;
          const invalid = form.plural !== (choice.subject === 1) || form.time !== choice.layer;
          const actual = result.steps.find(step => step.card === choice.card)?.kind;
          if ((actual === 'impossible') !== invalid) misclassified++;
        }
      }
      expect(checked).toBe(level === 2 ? 2663353 : 36991);
      expect(misclassified).toBe(0);
      expect(solutions).toBeGreaterThan(0);
      expect(impossible).toBeGreaterThan(0);
      expect(noEffect).toBeGreaterThan(0);
      expect(simulate(level, challenges[level]!.solution).success).toBe(true);
      console.info(`F2 ${level + 1}: ${checked} sequências, ${solutions} soluções`);
    }, 60000);
  }
  it('esperar é válido mas dispensável nos três desafios; anular restaura cada colocação', () => {
    for (let level = 0; level < 3; level++) {
      const challenge = challenges[level]!;
      const wait: Choice = {card: challenge.cards.length - 1, subject: 0, form: 1, layer: 1};
      expect(simulate(level, [wait]).steps[0]?.kind).toBe('no-effect');
      expect(simulate(level, [wait]).success).toBe(false);
      expect(simulate(level, [...challenge.solution, wait]).success).toBe(true);
      let board = newBoard();
      for (const choice of challenge.solution) board = place(board, choice);
      for (const choice of challenge.solution) { void choice; board = undo(board); }
      expect(board).toEqual(newBoard());
    }
  });
  it('consequências válidas inesperadas em cada desafio', () => {
    const reversed = [...challenges[0]!.solution].map(c => ({...c, layer: 1 as Layer}));
    reversed[0]!.form = 1;
    expect(simulate(0, reversed.reverse()).steps[0]).toMatchObject({kind:'no-effect',world:{bumped:true}});
    expect(simulate(1,[{card:0,subject:0,form:0,layer:0}]).steps[0]).toMatchObject({kind:'effect',world:{bridge:1}});
    expect(simulate(2,[{card:2,subject:0,form:1,layer:1},...challenges[2]!.solution.slice(0,2)]).steps.some(s=>s.kind==='no-effect')).toBe(true);
  });
  it('eco mal concordado sobe só uma ponta; tempo suspenso não abre passagem', () => {
    expect(simulate(1,[{card:0,subject:1,form:0,layer:0}]).steps[0]).toMatchObject({kind:'impossible',world:{echo:true,bridge:1}});
    expect(simulate(2,[{card:0,subject:0,form:0,layer:2}]).steps[0]).toMatchObject({kind:'impossible',world:{echo:true,open:false}});
  });
  it('rejeita dados inválidos e duplicados; anular sem histórico é seguro', () => {
    expect(simulate(0,[{card:99,subject:0,form:0,layer:0}]).steps[0]?.kind).toBe('impossible');
    expect(simulate(0,[challenges[0]!.solution[0]!,challenges[0]!.solution[0]!]).success).toBe(false);
    expect(undo(newBoard())).toEqual(newBoard());
  });
});
