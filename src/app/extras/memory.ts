import { rewardSession } from '../../core/rewards';
import { navigate } from '../router';
import { getState, update } from '../store';
import { play } from '../audio';
import { action, screen, message } from './ui';

export function openMinigame(): void {
  const icons = ['🌻', '🐕', '🍓', '🌙', '🦋', '🍀'];
  let cards: string[] = [];
  let matched = new Set<number>();
  let first: number | undefined;
  let second: number | undefined;
  let moves = 0;
  let finished = false;
  let lastEarned = 0;
  const shuffle = (): void => {
    cards = [...icons, ...icons];
    for (let index = cards.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[other]] = [cards[other]!, cards[index]!];
    }
    matched = new Set();
    first = undefined;
    second = undefined;
    moves = 0;
    finished = false;
  };
  shuffle();
  const render = (): void => {
    const main = screen('Um momento de memória');
    main.insertAdjacentHTML(
      'beforeend',
      '<p>Encontra os pares ao teu ritmo. Sem relógio e sem penalizações. Até 2 estrelas por dia (UTC); podes jogar sempre.</p>',
    );
    const status = message(main, `Jogadas: ${moves}`);
    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    cards.forEach((icon, index) => {
      const visible = matched.has(index) || first === index || second === index;
      const card = action(
        visible ? icon : '?',
        () => {
          if (matched.has(index) || first === index || second !== undefined || finished) return;
          if (first === undefined) {
            first = index;
            render();
            return;
          }
          second = index;
          moves++;
          if (cards[first] === cards[second]) {
            matched.add(first);
            matched.add(second);
            first = undefined;
            second = undefined;
            play('correct');
          } else play('wrong');
          if (matched.size === cards.length && !finished) {
            finished = true;
            const now = Date.now();
            const day = new Date(now).toISOString().slice(0, 10);
            const save = getState().save;
            const used = save.rewardLedger[day]?.minijogo ?? 0;
            const reward = rewardSession(
              save,
              {
                completed: true,
                competencies: [{ competencyId: 'minijogo', improved: false, isNew: false }],
              },
              now,
            );
            const earned = Math.max(0, Math.min(2 - used, reward.earned));
            lastEarned = earned;
            // O core tem um teto genérico de 10; este jogo tem o teto específico de 2.
            update({
              save: {
                ...reward.save,
                stars: save.stars + earned,
                rewardLedger: {
                  ...reward.save.rewardLedger,
                  [day]: { ...save.rewardLedger[day], minijogo: used + earned },
                },
              },
            });
            if (earned) play('stars');
          }
          render();
        },
        'memory-card',
      );
      card.setAttribute('aria-label', visible ? `Carta ${index + 1}: ${icon}` : `Virar carta ${index + 1}`);
      card.disabled = matched.has(index) || first === index || second !== undefined || finished;
      grid.append(card);
    });
    main.append(grid);
    if (second !== undefined)
      main.append(
        action(
          'Continuar',
          () => {
            first = undefined;
            second = undefined;
            render();
          },
          'primary',
        ),
      );
    if (finished)
      status.textContent = `Encontraste todos os pares em ${moves} jogadas! ${
        lastEarned
          ? `Ganhaste ${lastEarned} estrela(s)!`
          : 'Hoje já ganhaste as 2 estrelas. Podes continuar a jogar!'
      }`;
    main.append(
      action('Novo jogo', () => {
        shuffle();
        render();
      }),
    );
  };
  navigate(render);
}
