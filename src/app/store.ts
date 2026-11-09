import { PROGRESS_KEY } from '../core/progress';
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
  lastExportAt: number | null;
  ui: { storageError?: boolean; recovered?: boolean };
}

/** Espaço de nomes do armazenamento: as pré-visualizações usam o seu para nunca tocar no progresso do jogo. */
const NS = (globalThis as { EDA_NS?: string }).EDA_NS ?? 'eda';
const APP_KEY = `${NS}:app:v1`;
const SAVE_KEY = `${NS}:save:v2`;
const BACKUP_KEY = `${NS}:save:backup`;

const initial = (): AppState => ({
  profile: { version: 3, grade: 6, onboarded: false, avatar: defaultAvatar(), equipped: {} },
  options: { music: true, sfx: true, volume: 0.4, reduceMotion: false, abuLife: true, textScale: 1 },
  lastTopicId: null,
  bestTestGrade: 0,
  favorites: [],
  save: defaultSave(),
  skills: {},
  lastExportAt: null,
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
      if (typeof app.lastExportAt === 'number' && Number.isFinite(app.lastExportAt) && app.lastExportAt >= 0 && app.lastExportAt <= 8_640_000_000_000_000) state.lastExportAt = app.lastExportAt;
    }
  } catch {
    state.ui.storageError = true;
  }
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const result = importSave(saved);
      if (result.ok) state.save = result.save;
      else {
        const backup = importSave(localStorage.getItem(BACKUP_KEY) ?? '');
        if (backup.ok) { state.save = backup.save; state.ui.recovered = true; }
        else state.ui.storageError = true;
      }
    }
  } catch {
    state.ui.storageError = true;
  }
  Object.assign(state.profile, migrateProfileV3(Object.keys(state.save.equipment).length ? state.save.equipment : state.profile.avatar, state.save.ownedItems));
  state.profile.equipped = { ...state.profile.avatar };
  state.favorites = state.favorites.map(value => normalizeAvatar(value, state.save.ownedItems));
  return state;
}

let state = load();
// Best effort: neither refusal nor browser support blocks startup.
try { void navigator.storage?.persist?.().catch(() => {}); } catch { /* unavailable */ }
function backupSave(save: Save): void {
  try { localStorage.setItem(BACKUP_KEY, exportSave(save)); } catch { /* quota must not block the main write */ }
}
const listeners = new Set<(state: AppState) => void>();
let pendingWrites=0;
let persistence: Promise<unknown>=Promise.resolve();
function refreshCanonical(): void {
 if(pendingWrites)return;
 try {
 const raw=localStorage.getItem(SAVE_KEY);if(!raw)return;
 const result=importSave(raw);if(!result.ok)return;
 state={...state,save:result.save,profile:{...state.profile,avatar:Object.keys(result.save.equipment).length?normalizeAvatar(result.save.equipment,result.save.ownedItems):state.profile.avatar}};
 } catch { state.ui.storageError=true; }
}
export const getState = (): AppState => {refreshCanonical();return state;};
export function applyOptions(): void {
  document.body.classList.toggle('reduce-motion', state.options.reduceMotion);
  document.body.classList.toggle('large-text', state.options.textScale > 1);
  document.body.style.setProperty('--text-scale', String(state.options.textScale));
}
/** All canonical writes share the completion lock, including ordinary answer saves.
 * The UI updates immediately; completion waits for its preceding writes. */
export function update(change: Partial<AppState> | ((state: AppState) => AppState), replaceSave=false): Promise<void> {
  refreshCanonical();
  const previous=state.save;
  state = typeof change === 'function' ? change(state) : { ...state, ...change };
  state.profile.version = 3;
  state.save = {...state.save, equipment:{...(state.save.equipment[PROGRESS_KEY] ? {[PROGRESS_KEY]:state.save.equipment[PROGRESS_KEY]} : {}),...state.profile.avatar}};
  const snapshot=state;
  const persist=():void=>{
    const raw=localStorage.getItem(SAVE_KEY);
    const parsed=raw ? importSave(raw) : undefined;
    if(parsed && !parsed.ok && !replaceSave && !state.ui.recovered) throw new Error('Gravação inválida');
    const latest=parsed?.ok ? parsed.save : previous;
    const proposed=snapshot.save;
    const added=proposed.ownedItems.filter(id=>!previous.ownedItems.includes(id));
    const duplicatePurchase=proposed.stars<previous.stars && added.length>0 && added.every(id=>latest.ownedItems.includes(id));
    const changedMastery=Object.fromEntries(Object.entries(proposed.mastery).filter(([id,m])=>JSON.stringify(m)!==JSON.stringify(previous.mastery[id])));
    const newSeen=proposed.seen.filter(row=>!previous.seen.some(old=>old.at===row.at && old.signature===row.signature));
    const newMistakes=proposed.mistakes.filter(row=>!previous.mistakes.some(old=>old.at===row.at && JSON.stringify(old.ref)===JSON.stringify(row.ref)));
    const save:Save=replaceSave ? proposed : {...latest,
      stars:Math.max(0,latest.stars+(duplicatePurchase?0:proposed.stars-previous.stars)),
      ownedItems:[...new Set([...latest.ownedItems,...added])],
      rewardLedger:Object.fromEntries([...new Set([...Object.keys(latest.rewardLedger),...Object.keys(proposed.rewardLedger)])].map(day=>[day,Object.fromEntries([...new Set([...Object.keys(latest.rewardLedger[day]??{}),...Object.keys(proposed.rewardLedger[day]??{})])].map(id=>[id,Math.max(latest.rewardLedger[day]?.[id]??0,proposed.rewardLedger[day]?.[id]??0)]))])),
      mastery:{...latest.mastery,...changedMastery},
      seen:[...latest.seen,...newSeen].slice(-500),mistakes:[...latest.mistakes,...newMistakes].slice(-100),
      equipment:JSON.stringify(proposed.equipment)!==JSON.stringify(previous.equipment)?proposed.equipment:latest.equipment,
    };
    const serialized = exportSave(save);
    backupSave(latest);
    localStorage.setItem(SAVE_KEY, serialized);
    const {save:_save,ui:_ui,...app}=snapshot;
    localStorage.setItem(APP_KEY,JSON.stringify(app));
    // A successful write heals the canonical save: stop showing the recovery notice and re-arm the corruption guard.
    state={...state,ui:{...state.ui,storageError:false,recovered:false}};
    if(pendingWrites===1) state={...state,save,profile:{...state.profile,avatar:normalizeAvatar(save.equipment,save.ownedItems)}};
  };
  pendingWrites++;
  const operation=navigator.locks ? navigator.locks.request(`${NS}:reward`,persist) : Promise.resolve().then(persist);
  const written=operation.catch(()=>{state={...state,ui:{...state.ui,storageError:true}};}).finally(()=>{pendingWrites--;});
  persistence=written;
  applyOptions();
  listeners.forEach(listener=>listener(state));
  return written;
}
export function subscribe(listener: (state: AppState) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function purchase(item: ShopItem): ReturnType<typeof buy> {
  const result = buy(getState().save, item);
  if (result.ok) update({ save: result.save });
  return result;
}

/** Serializes completion across tabs; refreshes the canonical Save inside the lock. */
export async function completeTransaction(change: (save: Save)=>Save): Promise<Save> {
 await persistence;
 if(!navigator.locks) throw new Error('Este navegador não permite guardar prémios entre separadores com segurança.');
 return navigator.locks.request(`${NS}:reward`,()=>{
  const raw=localStorage.getItem(SAVE_KEY);
  const parsed=raw ? importSave(raw) : undefined;
  if(parsed && !parsed.ok && !state.ui.recovered) throw new Error('Gravação inválida');
  const current=parsed?.ok ? parsed.save : state.save;
  const save=change(current);
  const equipment=Object.keys(current.equipment).length ? current.equipment : state.profile.avatar;
  const canonical={...save,equipment:{...equipment}};
  const serialized=exportSave(canonical);
  backupSave(current);
  localStorage.setItem(SAVE_KEY,serialized);
  state={...state,save:canonical,ui:{...state.ui,recovered:false},profile:{...state.profile,avatar:normalizeAvatar(equipment,canonical.ownedItems)}};
  listeners.forEach(listener=>listener(state));
  return canonical;
 });
}
