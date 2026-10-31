import { it, expect, vi, afterEach } from 'vitest';
import { CATALOG, defaultAvatar, normalizeAvatar } from '../../src/art/catalog';
import { ABU_ANCHORS, POSE_IMAGE, REACTION_POSE, abuD, abuReact } from '../../src/art/d/abu';
import { lifeAllowed, startAbuLife } from '../../src/app/abu-life';
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();vi.restoreAllMocks();});
it('migrates all legacy Abu ids and rejects unknown, wrong-slot and unowned items',()=>{
 for(const id of ['abu-coleira','abu-laco','abu-lenco','abu-oculos','abu-chapeu']) {
  const slot=CATALOG.find(i=>i.id===id)!.slot;
  expect(normalizeAvatar({abuAccessory:id},[id])).toMatchObject({[slot]:id,abuAccessory:null});
 }
 expect(normalizeAvatar({abuNeck:'abu-capa',abuHead:'unknown',abuBody:'abu-capa'},[])).toMatchObject({abuNeck:'abu-coleira',abuHead:null,abuBody:null});
 expect(normalizeAvatar({abuBody:'abu-capa'},['abu-capa']).abuBody).toBe('abu-capa');
});
it('loads v2 profile and favorites as v3 after inventory, defaults life on',async()=>{
 const {defaultSave}=await import('../../src/core/save');
 vi.stubGlobal('localStorage',{getItem:(key:string)=>key.includes('app')?JSON.stringify({profile:{version:2,onboarded:true,avatar:{abuAccessory:'abu-chapeu'}},favorites:[{abuAccessory:'abu-lenco'}]}):JSON.stringify({...defaultSave(),ownedItems:['abu-chapeu']})});
 vi.resetModules();const {getState}=await import('../../src/app/store');
 expect(getState().profile).toMatchObject({version:3,avatar:{abuHead:'abu-chapeu',abuAccessory:null}});
 expect(getState().favorites[0]!.abuNeck).toBe('abu-coleira');expect(getState().options.abuLife).toBe(true);
});
it('defines every anchor and draws every accessory for every pose',()=>{
 for(const pose of Object.keys(POSE_IMAGE) as (keyof typeof POSE_IMAGE)[]) {
  expect(Object.values(ABU_ANCHORS[pose]).flat().every(Number.isFinite)).toBe(true);
  for(const item of CATALOG.filter(i=>i.slot.startsWith('abu'))) expect(abuD({...defaultAvatar(),[item.slot]:item.id},pose)).toContain(`data-item="${item.id}"`);
 }
});
it('maps reactions with no punitive pose and replaces only the dog',()=>{
 expect(REACTION_POSE).toEqual({correct:'happy',wrong:'think',curious:'think',hello:'stand',tutor:'think'});
 for(const reaction of Object.keys(REACTION_POSE) as (keyof typeof REACTION_POSE)[]) {
  const el={matches:()=>true,getAttribute:()=>JSON.stringify(defaultAvatar()),outerHTML:''};
  abuReact(el as unknown as Element,reaction);expect(el.outerHTML).toContain(`data-pose="${REACTION_POSE[reaction]}"`);
 }
});
it('life refuses active sessions, tests, disabled option and either reduced motion setting',()=>{
 const opts={abuLife:true,reduceMotion:false};expect(lifeAllowed(opts,false,false)).toBe(true);
 expect(lifeAllowed(opts,true,false)).toBe(false);expect(lifeAllowed(opts,false,true)).toBe(false);
 expect(lifeAllowed({...opts,abuLife:false},false,false)).toBe(false);
 expect(lifeAllowed({...opts,reduceMotion:true},false,false)).toBe(false);expect(lifeAllowed(opts,false,false,true)).toBe(false);
});

it('scheduler cancels when navigating and never animates an active exercise',()=>{
 vi.useFakeTimers();vi.stubGlobal('matchMedia',()=>({matches:false}));
 const host={innerHTML:'',setAttribute:()=>{},replaceChildren:()=>{host.innerHTML='';}};
 const main={isConnected:true,append:vi.fn(),querySelector:()=>host,querySelectorAll:()=>[]};
 vi.stubGlobal('document',{createElement:()=>host});
 startAbuLife(main as unknown as HTMLElement,false);
 vi.advanceTimersByTime(120001);expect(host.innerHTML).toBe('');expect(main.append).not.toHaveBeenCalled();
 startAbuLife(main as unknown as HTMLElement,true);
 expect(main.append).toHaveBeenCalledOnce();
 startAbuLife(main as unknown as HTMLElement,false);
 vi.advanceTimersByTime(120001);expect(host.innerHTML).toBe('');
});
