import { defaultAvatar, type AvatarConfig } from '../art';
import { defaultSave, exportSave, importSave, type Save } from '../core/save';
import { buy, type ShopItem } from '../core/rewards';

export interface AppState {
  profile: {
    nickname?: string;
    grade: number;
    onboarded: boolean;
    avatar: AvatarConfig;
    equipped: Record<string, string | null>;
  };
  options: { music: boolean; sfx: boolean; volume: number; reduceMotion: boolean; textScale: number };
  lastTopicId: string | null;
  bestTestGrade: number;
  favorites: AvatarConfig[];
  save: Save;
  ui: { storageError?: boolean };
}

const initial = (): AppState => ({
  profile: { grade: 6, onboarded: false, avatar: defaultAvatar(), equipped: {} },
  options: { music: true, sfx: true, volume: 0.4, reduceMotion: false, textScale: 1 },
  lastTopicId: null,
  bestTestGrade: 0,
  favorites: [],
  save: defaultSave(),
  ui: {},
});

function load(): AppState {
  const state = initial();
  try {
    const raw: unknown = JSON.parse(localStorage.getItem('eda:app:v1') ?? 'null');
    if (raw && typeof raw === 'object') {
      const app = raw as Partial<AppState>;
      if (app.profile && typeof app.profile.onboarded === 'boolean' && app.profile.avatar) {
        state.profile.onboarded = app.profile.onboarded;
        if (typeof app.profile.nickname === 'string')
          state.profile.nickname = app.profile.nickname.slice(0, 24);
        for (const key of Object.keys(state.profile.avatar) as (keyof AvatarConfig)[]) {
          const value = app.profile.avatar[key];
          if (typeof value === 'string' && value.length <= 100)
            state.profile.avatar = { ...state.profile.avatar, [key]: value };
          else if (value === null && (key === 'accessory' || key === 'abuAccessory'))
            state.profile.avatar[key] = null;
        }
        state.profile.equipped = { ...state.profile.avatar };
      }
      if (app.options) {
        for (const key of ['music', 'sfx', 'reduceMotion'] as const)
          if (typeof app.options[key] === 'boolean') state.options[key] = app.options[key];
        if (Number.isFinite(app.options.volume))
          state.options.volume = Math.max(0, Math.min(1, app.options.volume));
        if ([1, 1.15, 1.3].includes(app.options.textScale)) state.options.textScale = app.options.textScale;
      }
      if (typeof app.lastTopicId === 'string') state.lastTopicId = app.lastTopicId;
      if (Number.isFinite(app.bestTestGrade))
        state.bestTestGrade = Math.max(0, Math.min(20, app.bestTestGrade as number));
      if (Array.isArray(app.favorites)) state.favorites = app.favorites.slice(0, 20);
    }
  } catch {
    state.ui.storageError = true;
  }
  try {
    const saved = localStorage.getItem('eda:save:v2');
    if (saved) {
      const result = importSave(saved);
      if (result.ok) state.save = result.save;
      else state.ui.storageError = true;
    }
  } catch {
    state.ui.storageError = true;
  }
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
  try {
    const { save, ui: _ui, ...app } = state;
    localStorage.setItem('eda:app:v1', JSON.stringify(app));
    localStorage.setItem('eda:save:v2', exportSave(save));
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
