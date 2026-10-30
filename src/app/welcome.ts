import { avatarSvg, welcomeSvg } from '../art';
import { openMap } from './map';
import { openOnboarding } from './onboarding';
import { button, frame, navigate } from './router';
import { getState } from './store';
import { openOptions, openProfile, openProgress } from './extras';

export function openWelcome(): void {
  navigate(() => {
    const { profile } = getState();
    const main = frame('Aprende, brinca e ganha estrelas');
    main.classList.add('welcome');
    main.insertAdjacentHTML(
      'beforeend',
      `<div class="welcome-art">${welcomeSvg()}<div class="welcome-hero">${avatarSvg(profile.avatar, { withAbu: true, size: 300 })}</div></div>` +
        '<p>Descobre, experimenta e aprende com o Abu. Cada passo conta!</p>',
    );
    main.append(
      button(
        profile.onboarded ? 'Continuar' : 'Jogar',
        () => (profile.onboarded ? openMap() : openOnboarding()),
        'primary',
      ),
    );
    if (profile.onboarded) {
      const row = document.createElement('div');
      row.className = 'welcome-links';
      row.append(
        button('A minha personagem', openProfile, 'quiet'),
        button('O meu progresso', openProgress, 'quiet'),
        button('Opções', openOptions, 'quiet'),
      );
      main.append(row);
    } else {
      main.append(button('Opções', openOptions, 'quiet'));
    }
  });
}
