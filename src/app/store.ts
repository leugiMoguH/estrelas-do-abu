import { defaultAvatar, normalizeAvatar, type AvatarConfig } from '../art';
import { defaultSave, exportSave, importSave, type Save } from '../core/save';
import { buy, type ShopItem } from '../core/rewards';
import { sanitizeSkills, type SkillsState } from '../core/skills';

export interface AppState {
  profile: {
    version?: 2 | 3;
    nickname?: string;
    grade: number;
    onboarded: boolean;
    avatar: AvatarConfig;
    equipped: Record<string, string | null>;
  };
  options: { music: boolean; sfx: boolean; volume: number; reduceMotion: boolean; abuLife: boolean; textScale: number };
  lastTopicId: string | null;
  bestTestGrade: number;
  favorites: AvatarConfig[];
  save: Save;
  /** Progressão por competência; vive fora do Save (compatível com versões anteriores, que a ignoram). */
  skills: SkillsState;
  ui: { storageError?: boolean };
}

/** Espaço de nomes do armazenamento: as pré-visualizações usam o seu para nunca tocar no progresso do jogo. */
const NS = (globalThis as { EDA_NS?: string }).EDA_NS ?? 'eda';
const APP_KEY = `${NS}:app:v1`;
const SAVE_KEY = `${NS}:save:v2`;

const initial = (): AppState => ({
  profile: { version: 3, grade: 6, onboarded: false, avatar: defaultAvatar(), equipped: {} },
  options: { music: true, sfx: true, volume: 0.4, reduceMotion: false, abuLife: true, textScale: 1 },
  lastTopicId: null,
  bestTestGrade: 0,
  favorites: [],
  save: defaultSave(),
  skills: {},
  ui: {},
});

export function migrateProfileV3(avatar: unknown, ownedIds: readonly string[]): {version:3;avatar:AvatarConfig} {
 return {version:3,avatar:normalizeAvatar(avatar,ownedIds)};
}
function load(): AppState {
  const state = initial();
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(APP_KEY) ?? 'null');
    if (raw && typeof raw === 'object') {
      const app = raw as Partial<AppState>;
      if (app.profile && typeof app.profile.onboarded === 'boolean' && app.profile.avatar) {
        state.profile.onboarded = app.profile.onboarded;
        if (typeof app.profile.nickname === 'string')
          state.profile.nickname = app.profile.nickname.slice(0, 24);
        state.profile.avatar = app.profile.avatar;
        state.profile.equipped = { ...state.profile.avatar };
      }
      if (app.options) {
        for (const key of ['music', 'sfx', 'reduceMotion', 'abuLife'] as const)
          if (typeof app.options[key] === 'boolean') state.options[key] = app.options[key];
        if (Number.isFinite(app.options.volume))
          state.options.volume = Math.max(0, Math.min(1, app.options.volume));
        if ([1, 1.15, 1.3].includes(app.options.textScale)) state.options.textScale = app.options.textScale;
      }
      if (typeof app.lastTopicId === 'string') state.lastTopicId = app.lastTopicId;
      if (Number.isFinite(app.bestTestGrade))
        state.bestTestGrade = Math.max(0, Math.min(20, app.bestTestGrade as number));
      if (Array.isArray(app.favorites)) state.favorites = app.favorites.slice(0, 20);
      state.skills = sanitizeSkills(app.skills);
    }
  } catch {
    state.ui.storageError = true;
  }
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const result = importSave(saved);
      if (result.ok) state.save = result.save;
      else state.ui.storageError = true;
    }
  } catch {
    state.ui.storageError = true;
  }
  Object.assign(state.profile, migrateProfileV3(state.profile.avatar, state.save.ownedItems));
  state.profile.equipped = { ...state.profile.avatar };
  state.favorites = state.favorites.map(value => normalizeAvatar(value, state.save.ownedItems));
  return state;
}

let state = load();
const listeners = new Set<(state: AppState) => void>();
export const getState = (): AppState => state;
export function applyOptions(): void {
  document.body.classList.toggle('reduce-motion', state.options.reduceMotion);
  document.body.classList.toggle('large-text', state.options.textScale > 1);
  document.body.style.setProperty('--text-scale', String(state.options.textScale));
}
export function update(change: Partial<AppState> | ((state: AppState) => AppState)): void {
  state = typeof change === 'function' ? change(state) : { ...state, ...change };
  state.profile.version = 3;
  try {
    const { save, ui: _ui, ...app } = state;
    localStorage.setItem(APP_KEY, JSON.stringify(app));
    localStorage.setItem(SAVE_KEY, exportSave(save));
  } catch {
    state = { ...state, ui: { ...state.ui, storageError: true } };
  }
  applyOptions();
  listeners.forEach((listener) => listener(state));
}
export function subscribe(listener: (state: AppState) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function purchase(item: ShopItem): ReturnType<typeof buy> {
  const result = buy(state.save, item);
  if (result.ok) update({ save: result.save });
  return result;
}
