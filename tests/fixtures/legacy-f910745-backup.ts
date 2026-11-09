import { importSave, migrate, type Save } from './legacy-f910745-save';
import { sanitizeSkills, type SkillsState } from '../../src/core/skills';

export function buildBackup(save: Save, skills: SkillsState): string {
  return JSON.stringify({ format: 'estrelas-do-abu-copia', version: 1, exportedAt: Date.now(), save: migrate(save), skills: sanitizeSkills(skills) });
}
export type BackupResult = { readonly ok: true; readonly save: Save; readonly skills: SkillsState } | { readonly ok: false; readonly error: string };
export function parseBackup(json: string): BackupResult {
  try {
    const value: unknown = JSON.parse(json);
    if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error();
    const v = value as Record<string, unknown>;
    if (!Object.hasOwn(v, 'format')) {
      const legacy = importSave(json);
      return legacy.ok ? { ...legacy, skills: {} } : legacy;
    }
    if (v.format !== 'estrelas-do-abu-copia' || v.version !== 1 || typeof v.exportedAt !== 'number' || !Number.isFinite(v.exportedAt) || v.exportedAt < 0 || typeof v.skills !== 'object' || v.skills === null || Array.isArray(v.skills)) throw new Error();
    const skills = sanitizeSkills(v.skills);
    // Reject data that sanitization would discard, rather than silently lose learning.
    const canonical = (x: unknown): string => JSON.stringify(x, (_key, item: unknown) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);
    if (canonical(skills) !== canonical(v.skills)) throw new Error();
    const saved = importSave(JSON.stringify(v.save));
    return saved.ok ? { ...saved, skills } : saved;
  } catch {
    return { ok: false, error: 'Gravação inválida ou versão não suportada.' };
  }
}
