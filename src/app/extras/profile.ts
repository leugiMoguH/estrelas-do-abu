import {
  avatarSvg,
  abuSvg,
  CATALOG,
  SKIN_TONES,
  HAIR_COLORS,
  EYE_STYLES,
  EXPRESSIONS,
  randomAvatar,
  defaultAvatar,
  starSvg,
  type AvatarConfig,
  type Slot,
} from '../../art';
import { buy } from '../../core/rewards';
import { navigate, escape } from '../router';
import { getState, update } from '../store';
import { play } from '../audio';
import { action, screen, message } from './ui';

const slots: Record<Slot, string> = {
  hairStyle: 'Penteado',
  top: 'Parte de cima',
  bottom: 'Parte de baixo',
  shoes: 'Calçado',
  accessory: 'Acessório',
  abuAccessory: 'Acessório do Abu',
};
const allowed = (id: string): boolean =>
  CATALOG.some((item) => item.id === id && (item.free || getState().save.ownedItems.includes(id)));

// Favoritos também são dados locais: validar antes de os aplicar.
export function safeAvatar(value: unknown): AvatarConfig {
  const avatar = defaultAvatar();
  if (!value || typeof value !== 'object') return avatar;
  const source = value as Record<string, unknown>;
  for (const [slot, options] of [
    ['skin', SKIN_TONES],
    ['hairColor', HAIR_COLORS],
    ['eyes', EYE_STYLES],
    ['expression', EXPRESSIONS],
  ] as const) {
    if (options.some((item) => item.id === source[slot])) avatar[slot] = source[slot] as string;
  }
  for (const slot of Object.keys(slots) as Slot[]) {
    const id = source[slot];
    if (typeof id === 'string' && CATALOG.some((i) => i.id === id && i.slot === slot) && allowed(id))
      avatar[slot] = id;
    else if (id === null && (slot === 'accessory' || slot === 'abuAccessory')) avatar[slot] = null;
  }
  return avatar;
}
export function equip(avatar: AvatarConfig): void {
  update((state) => ({
    ...state,
    profile: { ...state.profile, avatar, equipped: { ...avatar } },
  }));
}

export function profile(initial: 'Personalizar' | 'Loja' | 'Coleção' = 'Personalizar'): void {
  let tab = initial;
  let filter = '';
  let section = 'Pele';
  let refocus = '';
  let feedback = '';
  let celebration = false;
  const render = (): void => {
    const state = getState();
    const avatar = state.profile.avatar;
    const main = screen('A minha personagem');
    const tabs = document.createElement('div');
    tabs.className = 'toolbar tabs-top';
    tabs.setAttribute('aria-label', 'Secções da personagem');
    for (const name of ['Personalizar', 'Loja', 'Coleção'] as const) {
      const choice = action(name, () => {
        tab = name;
        feedback = '';
        celebration = false;
        render();
      });
      choice.setAttribute('aria-pressed', String(tab === name));
      tabs.append(choice);
    }
    main.append(tabs);
    const layout = document.createElement('div');
    layout.className = 'extras-profile';
    const preview = document.createElement('section');
    preview.className = `panel extras-preview${celebration ? ' purchase-pop' : ''}`;
    preview.setAttribute('aria-label', 'A tua personagem e o Abu');
    preview.innerHTML = avatarSvg(avatar, { size: 360, withAbu: true });
    message(preview, feedback || 'As tuas escolhas ficam guardadas automaticamente.');
    const controls = document.createElement('section');
    controls.className = 'extras-controls';
    layout.append(preview, controls);
    main.append(layout);
    const apply = (slot: keyof AvatarConfig, id: string | null): void => {
      equip({ ...getState().profile.avatar, [slot]: id });
      celebration = false;
      render();
    };
    if (tab === 'Personalizar') {
      controls.append(
        action('✨ Surpreende-me', () => {
          equip(randomAvatar(Math.random, getState().save.ownedItems));
          render();
        }),
      );
      const apply1 = (slot: keyof AvatarConfig, id: string | null): void => apply(slot, id);
      type Row = { id: string | null; name: string; hex?: string };
      const SECTIONS: { name: string; groups: { title: string; slot: keyof AvatarConfig; items: Row[]; crop?: string }[] }[] = [
        { name: 'Pele', groups: [{ title: 'Tom de pele', slot: 'skin', items: [...SKIN_TONES] }] },
        {
          name: 'Cabelo',
          groups: [
            { title: 'Penteado', slot: 'hairStyle', items: CATALOG.filter((i) => i.slot === 'hairStyle' && allowed(i.id)), crop: '--z:1.8;--y:26px' },
            { title: 'Cor do cabelo', slot: 'hairColor', items: [...HAIR_COLORS] },
          ],
        },
        {
          name: 'Olhos',
          groups: [
            { title: 'Olhos', slot: 'eyes', items: [...EYE_STYLES] },
            { title: 'Expressão', slot: 'expression', items: [...EXPRESSIONS] },
          ],
        },
        {
          name: 'Roupa',
          groups: [
            { title: 'Parte de cima', slot: 'top', items: CATALOG.filter((i) => i.slot === 'top' && allowed(i.id)), crop: '--z:1.7;--y:52px' },
            { title: 'Parte de baixo', slot: 'bottom', items: CATALOG.filter((i) => i.slot === 'bottom' && allowed(i.id)), crop: '--z:1.7;--y:72px' },
          ],
        },
        { name: 'Calçado', groups: [{ title: 'Calçado', slot: 'shoes', items: CATALOG.filter((i) => i.slot === 'shoes' && allowed(i.id)), crop: '--z:2;--y:86px' }] },
        {
          name: 'Acessórios',
          groups: [{ title: 'Acessório', slot: 'accessory', items: [{ id: null, name: 'Nenhum' }, ...CATALOG.filter((i) => i.slot === 'accessory' && allowed(i.id))], crop: '--z:1.8;--y:26px' }],
        },
        {
          name: 'Abu',
          groups: [{ title: 'Acessório do Abu', slot: 'abuAccessory', items: [{ id: null, name: 'Nenhum' }, ...CATALOG.filter((i) => i.slot === 'abuAccessory' && allowed(i.id))], crop: 'abu' }],
        },
      ];
      const current = SECTIONS.find((x) => x.name === section) ?? SECTIONS[0]!;
      const row = document.createElement('div');
      row.className = 'tabs-row';
      row.setAttribute('aria-label', 'Partes da personagem');
      for (const x of SECTIONS) {
        const t = action(x.name, () => {
          section = x.name;
          refocus = '.tabs-row';
          render();
        });
        t.setAttribute('aria-pressed', String(x === current));
        row.append(t);
      }
      controls.append(row);
      if (refocus) {
        const where = refocus;
        refocus = '';
        queueMicrotask(() => main.querySelector<HTMLElement>(`${where} [aria-pressed="true"]`)?.focus());
      }
      for (const g of current.groups) {
        const box = document.createElement('section');
        box.setAttribute('aria-label', g.title);
        box.innerHTML = `<h2 class="group-title">${escape(g.title)}</h2>`;
        const grid = document.createElement('div');
        grid.className = 'chip-grid';
        for (const item of g.items) {
          const choice = action('', () => {
            refocus = '.chip-grid';
            apply1(g.slot, item.id);
          });
          choice.setAttribute('aria-pressed', String(avatar[g.slot] === item.id));
          const art = document.createElement('span');
          art.setAttribute('aria-hidden', 'true');
          if (item.hex) {
            art.className = 'chip-dot';
            art.style.backgroundColor = item.hex;
          } else if (item.id === null) {
            art.className = 'chip-art';
            art.textContent = '∅';
          } else {
            art.className = 'chip-art';
            if (g.crop === 'abu') art.innerHTML = abuSvg('sit', item.id);
            else if (g.crop) {
              art.setAttribute('style', g.crop);
              art.classList.add('is-crop');
              art.innerHTML = avatarSvg({ ...avatar, [g.slot]: item.id }, { size: 100 });
            }
          }
          choice.append(art, document.createTextNode(item.name));
          grid.append(choice);
        }
        box.append(grid);
        controls.append(box);
      }
      const favorites = document.createElement('section');
      favorites.className = 'panel';
      favorites.innerHTML = '<h2>Os teus conjuntos favoritos</h2><p>Podes guardar até 3 conjuntos.</p>';
      for (let index = 0; index < Math.min(3, state.favorites.length + 1); index++) {
        const favorite = state.favorites[index];
        const row = document.createElement('div');
        row.className = 'actions';
        if (favorite)
          row.append(
            action(`Aplicar conjunto ${index + 1}`, () => {
              equip(safeAvatar(favorite));
              render();
            }),
          );
        row.append(
          action(`${favorite ? 'Substituir' : 'Guardar'} conjunto ${index + 1}`, () => {
            const next = getState().favorites.slice(0, 3);
            // Guardar nos lugares livres por ordem, sem criar buracos no JSON.
            next[Math.min(index, next.length)] = { ...getState().profile.avatar };
            update({ favorites: next });
            render();
          }),
        );
        favorites.append(row);
      }
      controls.append(favorites);
      return;
    }
    const label = document.createElement('label');
    label.textContent = 'Filtrar por tipo';
    const select = document.createElement('select');
    select.innerHTML =
      '<option value="">Todos os itens</option>' +
      Object.entries(slots)
        .map(([id, title]) => `<option value="${id}">${title}</option>`)
        .join('');
    select.value = filter;
    select.onchange = () => {
      play('tap');
      filter = select.value;
      render();
    };
    label.append(select);
    controls.append(label);
    const grid = document.createElement('div');
    grid.className = 'extras-catalog';
    const items = CATALOG.filter(
      (item) => (!filter || item.slot === filter) && (tab === 'Loja' ? !item.free : allowed(item.id)),
    );
    for (const item of items) {
      const owned = allowed(item.id);
      const card = document.createElement('article');
      card.className = 'panel extras-item';
      card.innerHTML = `<div class="item-art">${
        item.slot === 'abuAccessory'
          ? abuSvg('happy', item.id)
          : avatarSvg({ ...avatar, [item.slot]: item.id }, { size: 120 })
      }</div><h2>${escape(item.name)}</h2>`;
      if (!item.free)
        card.insertAdjacentHTML('beforeend', `<p class="item-price">${starSvg(22)} ${item.price}</p>`);
      const missing = Math.max(0, item.price - state.save.stars);
      const selected = avatar[item.slot] === item.id;
      const purchase = action(
        owned
          ? selected
            ? 'Equipado'
            : 'Equipar · possuído'
          : missing
            ? `Faltam ${missing} estrelas`
            : 'Comprar e equipar',
        () => {
          if (owned) return apply(item.slot, item.id);
          const result = buy(getState().save, item);
          if (!result.ok) {
            feedback = 'Não foi possível comprar este item.';
            render();
            return;
          }
          update({ save: result.save });
          equip({ ...getState().profile.avatar, [item.slot]: item.id });
          play('purchase');
          feedback = `${item.name}: comprado e equipado!`;
          celebration = true;
          render();
        },
      );
      purchase.disabled = (selected && owned) || (!owned && missing > 0);
      card.append(purchase);
      grid.append(card);
    }
    controls.append(grid);
  };
  navigate(render);
}
