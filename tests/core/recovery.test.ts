import { it, expect, vi, afterEach } from 'vitest';
import { defaultSave } from '../../src/core/save';
afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });
async function store(values: Record<string,string>) {
 vi.resetModules();
 vi.stubGlobal('localStorage', {getItem:(key:string)=>values[key]??null, setItem:(key:string,value:string)=>{values[key]=value;}});
 vi.stubGlobal('navigator', {});
 vi.stubGlobal('document', {body:{classList:{toggle:()=>{}},style:{setProperty:()=>{}}}});
 return import('../../src/app/store');
}
it('recovers the valid backup when canonical save is corrupt', async () => {
 const save={...defaultSave(),stars:42};
 const api=await store({'eda:save:v2':'{','eda:save:backup':JSON.stringify(save)});
 expect(api.getState().save).toEqual(save);
 expect(api.getState().ui).toEqual({recovered:true});
 await api.update({lastExportAt:123});
 expect(api.getState().ui.storageError).toBe(false);
 // The write healed the main save: notice cleared and the corruption guard is active again.
 expect(api.getState().ui.recovered).toBe(false);
});
it('keeps storageError when both copies are invalid', async () => {
 const api=await store({'eda:save:v2':'{','eda:save:backup':'{}'});
 expect(api.getState().save).toEqual(defaultSave());
 expect(api.getState().ui).toEqual({storageError:true});
});
it('backs up the previous save on import and completion', async () => {
 const values={'eda:save:v2':JSON.stringify({...defaultSave(),stars:42})};
 const api=await store(values);
 await api.update({save:{...defaultSave(),stars:9}},true);
 expect(JSON.parse((values as Record<string,string>)['eda:save:backup']!).stars).toBe(42);
});
it('backup quota failure does not prevent main writes', async () => {
 const api=await store({});
 const setItem=vi.spyOn(localStorage,'setItem').mockImplementation((key)=>{if(key.endsWith(':backup'))throw new Error('quota');});
 await api.update({save:{...defaultSave(),stars:9}});
 expect(setItem).toHaveBeenCalledWith('eda:save:v2',expect.any(String));
 expect(api.getState().ui.storageError).toBe(false);
});
it.each([-1, '123', Infinity])('rejects invalid export date %s',async(lastExportAt)=>{
 const api=await store({'eda:app:v1':JSON.stringify({lastExportAt})});
 expect(api.getState().lastExportAt).toBeNull();
});
it('does not draw unknown receipt items',async()=>{
 const api=await store({});
 api.getState().save={...defaultSave(),receipts:[{attempt:{id:'x',month:'2026-11'},items:['future'],eligible:true,due:1} as never]};
 vi.doMock('../../src/app/router',()=>({button:vi.fn(),escape:(s:string)=>s}));
 vi.doMock('../../src/app/extras/profile',()=>({equip:vi.fn()}));
 vi.stubGlobal('document',{createElement:()=>({className:'',innerHTML:'',setAttribute:()=>{},append:vi.fn()})});
 const {revealReceipt}=await import('../../src/app/collection-ui');
 const main={append:vi.fn(),matches:()=>false,querySelector:()=>null};
 expect(()=>revealReceipt(main as unknown as HTMLElement,'x')).not.toThrow();
 expect(main.append).toHaveBeenCalledOnce();
});
