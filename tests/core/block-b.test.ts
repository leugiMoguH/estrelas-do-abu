import {describe,it,expect,vi,afterEach} from 'vitest';
import {FEATURE_CATALOG,CATALOG,defaultAvatar,normalizeAvatar,resolveAvatarCompatibility} from '../../src/art/catalog';
import {NEW_PIECES,MONTHLY_ROWS} from '../../src/art/d/pieces';
import {avatarD} from '../../src/art/d/compose';
import {abuD,abuPrize,POSE_IMAGE,ABU_ANCHORS} from '../../src/art/d/abu';
import {MANIFEST} from '../../src/art/d/manifest';
import {defaultSave,migrate} from '../../src/core/save';
afterEach(()=>vi.unstubAllGlobals());
describe('Bloco B',()=>{
 it('48 reservas mensais com desenhos distintos e sem preco; IDs unicos e metadados completos',()=>{
  expect(FEATURE_CATALOG).toHaveLength(26);expect(MONTHLY_ROWS).toHaveLength(48);expect(new Set(MONTHLY_ROWS.map(p=>p[3])).size).toBe(48);
  expect(new Set(CATALOG.map(p=>p.id)).size).toBe(CATALOG.length);
  for(const p of CATALOG){expect(p.name).not.toContain('?');expect(p.compatibility.anchor).toBeTruthy();expect(p.compatibility.occupies).toContain(p.slot);expect(MANIFEST[p.id]).toBeDefined();expect(p.price!==undefined).toBe(p.origin==='estrelas');}
  expect(NEW_PIECES.filter(p=>p.slot.startsWith('abu'))).toHaveLength(17);
 });
 it('conjuntos ocupam top+baixo sem apagar a escolha inferior ou propriedade',()=>{
  for(const top of ['m-vestido','m-macacao']) for(const bottom of CATALOG.filter(p=>p.slot==='bottom')) for(const outer of CATALOG.filter(p=>p.slot==='outer')) {
   const c={...defaultAvatar(),top,bottom:bottom.id,outer:outer.id};const fit=resolveAvatarCompatibility(c);expect(fit.avatar).toEqual(c);expect(fit.notices.join(' ')).toContain('ocupa');
   const svg=avatarD(c,{},f=>f);expect(svg).not.toContain('data-layer="bottom"');expect(svg).toContain('data-layer="top"');expect(normalizeAvatar(c,CATALOG.map(p=>p.id))).toEqual(c);
  }
 });
 it('pares de roupa Abu e triplos criticos em todas as poses conservam ancoras e IDs',()=>{
  const items=(slot:string)=>CATALOG.filter(p=>p.slot===slot);
  for(const pose of Object.keys(POSE_IMAGE) as (keyof typeof POSE_IMAGE)[]) {
   for(const neck of items('abuNeck')) for(const body of items('abuBody')) {
    const head=items('abuHead')[(neck.id.length+body.id.length)%items('abuHead').length]!;
    const c={...defaultAvatar(),abuNeck:neck.id,abuBody:body.id,abuHead:head.id};const svg=abuD(c,pose);
    for(const id of [neck.id,body.id,head.id])expect(svg).toContain(`data-item="${id}"`);
    expect(svg).not.toMatch(/NaN|undefined/);expect(Object.values(ABU_ANCHORS[pose]).flat().every(Number.isFinite)).toBe(true);
   }
  }
 });
 it('Save antigo e inventario mensal preservam estrelas, IDs e equipamento',()=>{
  const old={...defaultSave(),stars:137,ownedItems:['hair-rabo','m-vestido','b-abu-colete']};
  const saved=migrate(JSON.parse(JSON.stringify(old)));expect(saved.ownedItems).toEqual(old.ownedItems);expect(saved.stars).toBe(137);
  const c={...defaultAvatar(),top:'m-vestido',hairStyle:'hair-rabo',abuBody:'b-abu-colete'};expect(normalizeAvatar(c,saved.ownedItems)).toEqual(c);
  expect(normalizeAvatar(c,[]).top).toBe('top-azul');
 });
 it('apanhados recolhidos usam molde sem volume lateral, mantendo o ID',()=>{
  const c={...defaultAvatar(),hairStyle:'m-cabelo-duplo',hat:'m-boina'};
  expect(resolveAvatarCompatibility(c).avatar.hairStyle).toBe('m-cabelo-duplo');
  expect(avatarD(c,{},f=>f)).toContain('m-cabelo-duplo-hat.svg');
  expect(avatarD({...c,hat:null},{},f=>f)).not.toContain('m-cabelo-duplo-hat.svg');
 });
 it('premio conserva equipamento e respeita movimento reduzido',()=>{
  vi.stubGlobal('matchMedia',()=>({matches:true}));const c={...defaultAvatar(),abuBody:'m-abu-malha'};
  const el={matches:()=>true,classList:{contains:()=>false},getAttribute:()=>JSON.stringify(c),outerHTML:''};
  abuPrize(el as unknown as Element);expect(el.outerHTML).toContain('abu-still');expect(el.outerHTML).toContain('data-pose="happy"');expect(el.outerHTML).toContain('data-item="m-abu-malha"');
 });
});
