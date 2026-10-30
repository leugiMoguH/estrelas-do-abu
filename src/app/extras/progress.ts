import { TOPICS, SUBJECTS } from '../../../content';
import { emptyMastery, type Level } from '../../core/mastery';
import { isDue, reviewLevel } from '../../core/review';
import { navigate, escape } from '../router';
import { getState } from '../store';
import { startSession } from '../session';
import { action, screen, message } from './ui';

const names: Record<Level, string> = {
  discovering: 'A descobrir',
  practising: 'A praticar',
  progressing: 'A progredir',
  consolidated: 'Bem consolidado',
  review: 'A rever',
};
const strength: Record<Level, number> = {
  discovering: 0,
  practising: 1,
  progressing: 2,
  consolidated: 3,
  review: 3,
};
export function openProgress(): void {
  navigate(() => {
    const main = screen('O meu progresso');
    message(main, 'Cada tema cresce com a prática. As estrelas são uma recompensa à parte.');
    const now = Date.now();
    for (const topic of TOPICS) {
      const rows = topic.competencyIds.map((id) => getState().save.mastery[id] ?? emptyMastery());
      const levels = rows.map((row) => reviewLevel(row, now));
      const level = levels.includes('review')
        ? 'review'
        : levels.reduce(
            (weakest, next) => (strength[next] < strength[weakest] ? next : weakest),
            'consolidated' as Level,
          );
      const value = rows.reduce((sum, row) => sum + strength[row.level], 0) / rows.length;
      const panel = document.createElement('section');
      panel.className = 'panel';
      panel.innerHTML = `<p>${escape(SUBJECTS.find((s) => s.id === topic.subject)!.name)}</p><h2>${escape(topic.icon)} ${escape(topic.title)}</h2><p>${names[level]}</p><progress max="3" value="${value}" aria-label="${escape(topic.title)}: ${names[level]}"></progress>`;
      const due = topic.competencyIds.filter((id) => {
        const row = getState().save.mastery[id];
        return row && isDue(row, now);
      });
      if (due.length)
        panel.append(action('Rever agora', () => startSession(topic.id, 'review', 5, due), 'primary'));
      main.append(panel);
    }
  });
}
export function openAchievements(): void {
  navigate(() => {
    const main = screen('As tuas conquistas');
    const state = getState();
    const practiced = TOPICS.filter((topic) =>
      topic.competencyIds.some((id) => (state.save.mastery[id]?.attempts ?? 0) > 0),
    ).length;
    const session = Object.values(state.save.rewardLedger).some((day) =>
      Object.entries(day).some(([id, amount]) => id !== 'minijogo' && amount > 0),
    );
    const rows: [string, boolean, string][] = [
      ['Primeira sessão', session, 'Termina uma sessão de aprendizagem e ganha estrelas.'],
      [
        'Primeira nota de 14 ou mais',
        state.bestTestGrade >= 14,
        'Faz um teste e chega aos 14 valores ou mais.',
      ],
      ['Primeira compra', state.save.ownedItems.length > 0, 'Compra um item na loja com estrelas.'],
      [
        'Três temas descobertos',
        practiced >= 3,
        `Pratica mais ${Math.max(0, 3 - practiced)} tema(s) diferente(s).`,
      ],
      [
        'Abu com estilo',
        Boolean(state.profile.avatar.abuAccessory) && state.profile.avatar.abuAccessory !== 'abu-coleira',
        'Compra e equipa um acessório novo no Abu.',
      ],
      ['Um conjunto favorito', state.favorites.length > 0, 'Guarda um conjunto no perfil.'],
      [
        'Boa memória',
        Object.values(state.save.rewardLedger).some((day) => (day.minijogo ?? 0) > 0),
        'Encontra todos os pares no minijogo.',
      ],
    ];
    for (const [title, unlocked, missing] of rows) {
      const panel = document.createElement('section');
      panel.className = 'panel achievement';
      panel.innerHTML = `<h2>${unlocked ? '✓' : '○'} ${escape(title)}</h2><p>${unlocked ? 'Conquistada!' : escape(missing)}</p>`;
      main.append(panel);
    }
  });
}
