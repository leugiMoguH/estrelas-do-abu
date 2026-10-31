import {
  avatarSvg,
  abuSvg,
  CATALOG,
  SKIN_TONES,
  HAIR_COLORS,
  EYE_STYLES,
  EYE_COLORS,
  defaultAvatar,
  randomAvatar,
  type AvatarConfig,
} from '../art';
import { button, escape, frame, navigate } from './router';
import { getState, update } from './store';
import { openWelcome } from './welcome';
import { openMap } from './map';

export function openOnboarding(): void {
  let avatar = { ...getState().profile.avatar };
  let nickname = getState().profile.nickname ?? '';
  let detailsOpen = true;
  let section = 'Aparência';
  const render = (): void => {
    const main = frame('Vamos conhecer-nos!', openWelcome);
    main.insertAdjacentHTML(
      'beforeend',
      `<div class="onboarding-grid"><section class="panel character-preview"><div class="avatar-preview">${avatarSvg(avatar, { size: 360 })}</div><p>Esta é a tua personagem. Podes mudá-la mais tarde.</p></section><section class="panel choices"><label>Como te chamas? (opcional)<input id="nickname" maxlength="24" autocomplete="off" value="${escape(nickname)}"></label><label>Ano<select aria-label="Ano escolar"><option selected>6.º ano</option></select></label></section></div>`,
    );
    main.querySelector('.avatar-preview > svg')?.setAttribute('viewBox', '100 -70 824 1606');
    main.querySelector<HTMLInputElement>('#nickname')!.oninput = (event) => {
      nickname = (event.target as HTMLInputElement).value;
    };
    const choices = main.querySelector('.choices')!;
    choices.append(
      button('✨ Surpreende-me', () => {
        avatar = randomAvatar(Math.random, getState().save.ownedItems);
        render();
      }),
    );
    const details = document.createElement('details');
    details.innerHTML = '<summary>Escolher os detalhes da personagem</summary>';
    details.open = detailsOpen;
    details.ontoggle = () => {
      detailsOpen = details.open;
    };
    choices.append(details);
    const tabs = document.createElement('div');
    tabs.className = 'tabs-row';
    tabs.setAttribute('aria-label', 'Personalizar personagem');
    for (const name of ['Aparência', 'Roupa', 'Acessórios']) {
      const tab = button(name, () => { section = name; detailsOpen = true; render(); });
      tab.setAttribute('aria-pressed', String(section === name));
      tabs.append(tab);
    }
    details.append(tabs);
    const addChoices = (
      title: string,
      slot: keyof AvatarConfig,
      items: readonly { id: string; name: string; hex?: string }[],
    ): void => {
      const category = ['skin','hairColor','eyeColor','eyes','hairStyle'].includes(slot) ? 'Aparência' : ['top','bottom','shoes','outer'].includes(slot) ? 'Roupa' : 'Acessórios';
      if (category !== section || !items.length) return;
      const group = document.createElement('fieldset');
      group.innerHTML = `<legend>${escape(title)}</legend>`;
      items.forEach((item) => {
        const choice = button(
          item.name,
          () => {
            avatar = { ...avatar, [slot]: item.id };
            detailsOpen = true;
            render();
          },
          'choice',
        );
        choice.setAttribute('aria-pressed', String(avatar[slot] === item.id));
        if (item.hex) choice.style.borderBottom = `8px solid ${item.hex}`;
        else
          choice.insertAdjacentHTML(
            'afterbegin',
            `<span class="mini-avatar">${avatarSvg({ ...avatar, [slot]: item.id }, { size: 70 })}</span>`,
          );
        group.append(choice);
      });
      details.append(group);
    };
    addChoices('Pele', 'skin', SKIN_TONES);
    addChoices('Cor do cabelo', 'hairColor', HAIR_COLORS);
    addChoices('Cor dos olhos', 'eyeColor', EYE_COLORS);
    addChoices('Olhos', 'eyes', EYE_STYLES);
    for (const slot of ['hairStyle', 'top', 'bottom', 'shoes', 'accessory', 'outer', 'glasses', 'hat', 'backpack'] as const) {
      const labels = {
        outer: 'Casaco', glasses: 'Óculos', hat: 'Chapéu', backpack: 'Mochila',
        hairStyle: 'Penteado',
        top: 'Roupa',
        bottom: 'Calças',
        shoes: 'Calçado',
        accessory: 'Acessório',
      };
      addChoices(
        labels[slot],
        slot,
        CATALOG.filter((item) => item.free && item.slot === slot),
      );
    }
    main.insertAdjacentHTML(
      'beforeend',
      `<aside class="abu-line">${abuSvg('wag', getState().profile.avatar)}<p>Olá! Sou o Abu. Vamos descobrir coisas novas juntos? No centro, escolhe Matemática ou Português.</p></aside>`,
    );
    main.append(
      button(
        'Vamos ao centro!',
        () => {
          update((state) => ({
            ...state,
            profile: {
              ...state.profile,
              nickname: nickname.trim(),
              avatar,
              equipped: { ...defaultAvatar(), ...avatar },
              onboarded: true,
            },
          }));
          openMap();
        },
        'primary',
      ),
    );
  };
  navigate(render);
}
