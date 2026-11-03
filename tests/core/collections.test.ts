import {describe,it,expect} from 'vitest';
import {awardCollection,COLLECTIONS,draw,localMonth,nextCollection,prizeTier,selectionKey,type CollectionAttempt} from '../../src/core/collections';
import {defaultSave,migrate,exportSave,importSave} from '../../src/core/save';
import {CATALOG} from '../../src/art/catalog';
const attempt=(credit=1, id='a'):CollectionAttempt=>({id,month:'2026-11',timezone:'Europe/Lisbon',selection:selectionKey('mat',['b','a','a']),mode:'test',completed:true,questions:Array.from({length:10},(_,i)=>({signature:`q${i}`,valid:true,credit}))});
describe('coleções mensais',()=>{
 it('seleção canónica ignora ordem e duplicados, mas distingue disciplina',()=>{
  expect(selectionKey('mat',['b','a','a'])).toBe(selectionKey('mat',['a','b']));
  expect(selectionKey('mat',['a'])).not.toBe(selectionKey('pt',['a']));
 });
 it('recibo inclui estrelas e rejeita campos novos corrompidos na importação',()=>{
  const result=awardCollection({...defaultSave(),stars:7},attempt(),()=>0,7);
  expect(result.receipt.stars).toBe(7);expect(result.save.stars).toBe(7);
  for(const change of [{receipts:[result.receipt,result.receipt]},{monthlyProgress:{x:2}},{equipment:{top:42}},{receipts:[{...result.receipt,stars:-1}]}])expect(importSave(JSON.stringify({...result.save,...change})).ok).toBe(false);
 });
 it.each([[79,0],[80,1],[89,1],[90,3],[99,3],[100,4],[99.999,3]])('créditos %s', (pct,tier)=>expect(prizeTier(pct/10,10)).toBe(tier));
 it('48 reservas distintas com metadados e arte existentes',()=>{const ids=Object.values(COLLECTIONS).flat();expect(new Set(ids).size).toBe(48);for(const group of Object.values(COLLECTIONS))expect(group).toHaveLength(16);for(const id of ids)expect(CATALOG.find(i=>i.id===id)).toMatchObject({origin:'coleção-mensal'});});
 it('sorteia uniformemente cada posição e cada par sem reposição',()=>{for(let i=0;i<4;i++)for(let j=0;j<3;j++){const rng=[(i+.1)/4,(j+.1)/3];const result=draw(['a','b','c','d'],2,()=>rng.shift()!);expect(result[0]).toBe(['a','b','c','d'][i]);expect(new Set(result).size).toBe(2);} const pairs=new Set<string>();for(let i=0;i<4;i++)for(let j=0;j<3;j++){const r=[(i+.1)/4,(j+.1)/3];pairs.add(draw(['a','b','c','d'],2,()=>r.shift()!).join());}expect(pairs.size).toBe(12);});
 it('entrega diferença 1+2+1, guarda antes de revelar e reabrir é idempotente',()=>{let save=defaultSave();for(const [i,credit,count] of [[1,.8,1],[2,.9,2],[3,1,1]]){const result=awardCollection(save,attempt(credit!,String(i)),()=>0);expect(result.receipt.items).toHaveLength(count!);save=migrate(JSON.parse(exportSave(result.save)));expect(awardCollection(save,attempt(credit!,String(i)),()=>{throw Error();}).save).toEqual(save);}expect(save.ownedItems).toHaveLength(4);expect(awardCollection(save,attempt(1,'again'),()=>0).receipt.items).toHaveLength(0);});
 it.each(['study','review'])('modo %s não elegível',mode=>expect(awardCollection(defaultSave(),{...attempt(),mode},()=>0).receipt.eligible).toBe(false));
 it('rejeita curtos, duplicados semânticos, inválidos e incompletos',()=>{const a=attempt();for(const change of [{questions:a.questions.slice(1)},{questions:a.questions.map(q=>({...q,signature:'igual'}))},{questions:a.questions.map(q=>({...q,valid:false}))},{completed:false}])expect(awardCollection(defaultSave(),{...a,...change},()=>0).receipt.items).toHaveLength(0);});
 it('completa apenas restantes, conserva equipamento e não repete',()=>{const ids=COLLECTIONS['2026-11']!;const save={...defaultSave(),ownedItems:ids.slice(0,15),equipment:{top:ids[0]!}};const result=awardCollection(save,attempt(),()=>0);expect(result.receipt.items).toEqual(ids.slice(15));expect(result.receipt.due).toBe(4);expect(result.save.equipment).toEqual(save.equipment);expect(awardCollection(result.save,{...attempt(1,'b'),selection:'outra'},()=>0).receipt.items).toEqual([]);});
 it('mês local, rotação e ausência de catálogo sem reciclagem',()=>{expect(localMonth(2026,10)).toBe('2026-11');expect(localMonth(2027,0)).toBe('2027-01');expect(nextCollection('2026-10')).toBe('2026-11');expect(nextCollection('2027-02')).toBeUndefined();let save=awardCollection(defaultSave(),attempt(),()=>0).save;save=awardCollection(save,{...attempt(1,'dez'),month:'2026-12'},()=>0).save;expect(save.ownedItems).toHaveLength(8);expect(awardCollection(save,{...attempt(1,'feb'),month:'2027-02'},()=>0).receipt.items).toHaveLength(0);});
 it.each([1,2])('migra v%s e exporta equipamento',version=>{const base={version,stars:7,ownedItems:['m-polo'],mastery:{},rewardLedger:{},...(version===2?{seen:[],mistakes:[]}:{} )};const save=migrate(base);expect(save).toMatchObject({version:3,stars:7,receipts:[],equipment:{}});const equipped={...save,equipment:{top:'m-polo'}};expect(importSave(exportSave(equipped))).toEqual({ok:true,save:equipped});});
});
