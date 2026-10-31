import { describe, it, expect, vi, afterEach } from 'vitest';
const assets = import.meta.glob('/src/art/assets/d4/*.webp', { eager: true, query: '?url', import: 'default' });
const realImages = import.meta.glob('/tests/shots/d-src/layers/key/*.png', { eager: true, query: '?url', import: 'default' });
import { CATALOG, defaultAvatar, normalizeAvatar } from '../../src/art/catalog';
import { MANIFEST, missingAssets } from '../../src/art/d/manifest';
import { ramp, sampleRamp } from '../../src/art/d/filters';
import { SKIN_TONES } from '../../src/art/palette';
import { avatarD } from '../../src/art/d/compose';
afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });
describe('Avatar D', () => {
 it('cobre o catálogo e lista assets ausentes (estrito opt-in)', () => {
  expect(CATALOG.every(i=>MANIFEST[i.id]?.slot===i.slot)).toBe(true);
  const missing = missingAssets(f=>!!assets[`/src/art/assets/${f}`]);
  console.info(`Cobertura D: ${missing.length} ficheiros em falta: ${missing.join(', ')}`);
  if ((globalThis as unknown as { process: { env: Record<string, string> } }).process.env.STRICT_ASSETS==='1') expect(missing).toEqual([]);
 });
 it('replica a rampa HLS de referência e mantém contraste nos oito tons', () => {
  expect(ramp('#ebb98f')[2]).toEqual([235/255,185/255,143/255]);
  for (const tone of SKIN_TONES) {
   const colors = ramp(tone.hex);
   const lum = (v: number[])=>v[0]!*.299+v[1]!*.587+v[2]!*.114;
   expect(lum(colors[2]!)-lum(colors[0]!)).toBeGreaterThan(.15);
   expect(sampleRamp(colors,.22)).toEqual(colors[1]);
   expect(sampleRamp(colors,.77)).toEqual(colors[2]);
   expect(colors.flat().every(c=>c>=0&&c<=1)).toBe(true);
  }
  expect(ramp('#ebb98f')[0]![0]).toBeCloseTo(.492028877,8);
 });
 it('normaliza ids desconhecidos, slots incorretos e itens não possuídos sem mutar', () => {
  const input = {...defaultAvatar(),skin:'???',top:'top-estrelas',hat:'top-azul',glasses:'acc-sol'};
  const before = {...input};
  expect(normalizeAvatar(input,[])).toMatchObject({skin:'bege',top:'top-azul',hat:null,glasses:null});
  expect(normalizeAvatar(input,['acc-sol']).glasses).toBe('acc-sol');
  expect(input).toEqual(before);
 });
 it('migra os acessórios antigos para os slots novos', () => {
  for (const id of ['acc-oculos','acc-sol','acc-gorro','acc-coroa','acc-auscultadores']) {
   const slot = CATALOG.find(i=>i.id===id)!.slot;
   expect(normalizeAvatar({accessory:id},[id])).toMatchObject({[slot]:id,accessory:null});
  }
 });
 it('carrega perfil v1 real e favoritos só depois das compras; guarda v2', async () => {
  const app = {profile:{version:1,onboarded:true,avatar:{skin:'oliva',hairStyle:'hair-rabo',accessory:'acc-sol'}},favorites:[{accessory:'acc-coroa',top:'inexistente'},{accessory:'acc-oculos'}]};
  const { defaultSave } = await import('../../src/core/save');
  const data = new Map([['eda:app:v1',JSON.stringify(app)],['eda:save:v2',JSON.stringify({...defaultSave(),ownedItems:['hair-rabo','acc-sol','acc-coroa']})]]);
  vi.stubGlobal('localStorage',{getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>data.set(k,v)});
  vi.stubGlobal('document',{body:{classList:{toggle:()=>{}},style:{setProperty:()=>{}}}});
  const {getState,update} = await import('../../src/app/store');
  expect(getState().profile).toMatchObject({version:3,avatar:{skin:'oliva',hairStyle:'hair-rabo',glasses:'acc-sol',accessory:null}});
  expect(getState().favorites[0]).toMatchObject({hat:'acc-coroa',top:'top-azul'});
  expect(getState().favorites[1]!.glasses).toBe(null);
  update({});
  expect(JSON.parse(data.get('eda:app:v1')!).profile.version).toBe(3);
 });
 it('omite imagens ausentes sem pedidos, usa Abu D e ids únicos', () => {
  const a = avatarD(defaultAvatar(),{withAbu:true},()=>undefined);
  expect(a).not.toContain('d4/');
  expect(a).toContain('abu-sit.webp');
  expect(a).not.toContain('abu-tail');
  const b = avatarD(defaultAvatar(),{},()=>undefined);
  expect(/id="([^"]+)-skin"/.exec(a)![1]).not.toBe(/id="([^"]+)-skin"/.exec(b)![1]);
 });
 it('compõe com imagens reais apenas na página de verificação, pela ordem contratada', () => {
  for (const name of ['body_base','hair_long','coat_open']) expect(realImages[`/tests/shots/d-src/layers/key/${name}.png`]).toBeTruthy();
  const resolve = (f:string)=>f.includes('body_skin')?'shots/d-src/layers/key/body_base.png':f.includes('hair-comprido')?'shots/d-src/layers/key/hair_long.png':f.includes('outer-gabardina')?'shots/d-src/layers/key/coat_open.png':undefined;
  const svg = avatarD({...defaultAvatar(),hairStyle:'hair-comprido',outer:'outer-gabardina',glasses:'acc-oculos'}, {}, resolve);
  const positions = ['body_base.png','coat_open.png','hair_long.png','data-layer="face"','data-item="acc-oculos"'].map(v=>svg.indexOf(v));
  expect(positions.every((v,i)=>v>=0 && (!i||v>positions[i-1]!))).toBe(true);
 });
});
