/// <reference types="vite/client" />
import type { ArtTheme } from '../src/art';

type Direction = 'a' | 'b';

const SEEDS: Record<Direction, { avatar: Record<string, string | null>; owned: string[] }> = {
  a: {
    avatar: {
      skin: 'dourada', hairStyle: 'hair-trancas', hairColor: 'castanho-escuro', eyes: 'brilhantes', expression: 'sorriso-grande',
      top: 'top-estrelas', bottom: 'bottom-calcas', shoes: 'shoes-vermelhas', accessory: 'acc-oculos', abuAccessory: 'abu-laco',
    },
    owned: ['hair-trancas', 'top-estrelas', 'shoes-vermelhas', 'acc-oculos', 'abu-laco'],
  },
  b: {
    avatar: {
      skin: 'bege', hairStyle: 'hair-cachos', hairColor: 'ruivo', eyes: 'amendoa', expression: 'feliz',
      top: 'top-hoodie', bottom: 'bottom-calcas', shoes: 'shoes-brancas', accessory: null, abuAccessory: 'abu-lenco',
    },
    owned: ['top-hoodie', 'abu-lenco'],
  },
};

/** Estado de exemplo gravado só no espaço de nomes da pré-visualização (nunca nas chaves do jogo). */
function seed(direction: Direction, ns: string): void {
  try {
    if (localStorage.getItem(`${ns}:app:v1`)) return;
    const s = SEEDS[direction];
    const app = {
      profile: { grade: 6, onboarded: true, nickname: '', avatar: s.avatar, equipped: s.avatar },
      options: { music: false, sfx: true, volume: 0.4, reduceMotion: false, textScale: 1 },
      lastTopicId: null,
      bestTestGrade: 0,
      favorites: [],
    };
    const save = { version: 2, stars: 12, ownedItems: s.owned, mastery: {}, rewardLedger: {}, seen: [], mistakes: [] };
    localStorage.setItem(`${ns}:app:v1`, JSON.stringify(app));
    localStorage.setItem(`${ns}:save:v2`, JSON.stringify(save));
  } catch {
    /* sem armazenamento: a pré-visualização funciona na mesma, sem memória */
  }
}

export async function boot(direction: Direction): Promise<void> {
  const ns = `eda-preview-${direction}`;
  (globalThis as { EDA_NS?: string }).EDA_NS = ns;
  seed(direction, ns);
  await import('../src/styles/fonts.css');
  await import('../src/styles/art.css');
  await import('../src/styles/app.css');
  await import('../src/styles/extras.css');
  await import('../src/styles/theme-a.css');
  await import('../src/styles/theme-b.css');
  const { applyTheme } = await import('../src/app/theme');
  const { openWelcome } = await import('../src/app/welcome');
  const { openMap } = await import('../src/app/map');
  const { openProfile } = await import('../src/app/extras');
  const theme: ArtTheme = direction;
  const screens: Record<string, () => void> = { boasvindas: openWelcome, personalizar: openProfile, mapa: openMap };
  const wanted = new URLSearchParams(location.search).get('ecra') ?? 'boasvindas';
  document.body.dataset.theme = theme;
  applyTheme(theme);
  (screens[wanted] ?? openWelcome)();
  mountBar(direction, screens);
}

function mountBar(direction: Direction, screens: Record<string, () => void>): void {
  const bar = document.createElement('nav');
  bar.className = 'preview-bar';
  bar.setAttribute('aria-label', 'Pré-visualização');
  const other = direction === 'a' ? 'b' : 'a';
  const names: [string, string][] = [['boasvindas', 'Boas-vindas'], ['personalizar', 'Personalizar'], ['mapa', 'Mapa']];
  const buttons = names.map(([id, label]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.onclick = () => {
      history.replaceState(null, '', `?ecra=${id}`);
      screens[id]!();
    };
    return b;
  });
  const tag = document.createElement('span');
  tag.className = 'preview-tag';
  tag.textContent = direction === 'a' ? 'Direção A · Doce Gomoso' : 'Direção B · Mundo Ilustrado';
  const link = document.createElement('a');
  link.href = `../${other}/`;
  link.textContent = `Ver ${other.toUpperCase()}`;
  bar.append(tag, ...buttons, link);
  document.body.append(bar);
}
