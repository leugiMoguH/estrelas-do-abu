import { it, expect } from 'vitest';
import { buildBackup, parseBackup } from '../../src/core/backup';
import { defaultSave } from '../../src/core/save';
import { emptySkill } from '../../src/core/skills';
it('round trips save and skills, preserving future items', () => {
 const save = {...defaultSave(), stars: 17, ownedItems: ['future'], equipment: {futureSlot:'future'}};
 const skills = {test: emptySkill()};
 expect(parseBackup(buildBackup(save, skills))).toEqual({ok:true, save, skills});
});
it('accepts legacy v1/v2/v3 without skills', () => {
 const save = defaultSave();
 const {receipts, monthlyProgress, equipment, ...v2} = save;
 const {seen, mistakes, ...v1} = v2;
 for (const legacy of [save, {...v2, version:2}, {...v1, version:1}]) expect(parseBackup(JSON.stringify(legacy))).toEqual({ok:true,save,skills:{}});
});
for (const [name, value] of Object.entries({json:'{', format:JSON.stringify({...JSON.parse(buildBackup(defaultSave(),{})),format:'wrong'}), skills:JSON.stringify({...JSON.parse(buildBackup(defaultSave(),{})),skills:{bad:{}}}), weak:JSON.stringify({...JSON.parse(buildBackup(defaultSave(),{})),skills:{bad:{...emptySkill(),weak:[{}]}}}), save:JSON.stringify({...JSON.parse(buildBackup(defaultSave(),{})),save:{}})})) {
 it(`rejects ${name} without throwing`, () => expect(parseBackup(value).ok).toBe(false));
}
