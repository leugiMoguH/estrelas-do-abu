import { describe, it, expect, vi, afterEach } from 'vitest';
const assets = import.meta.glob('/src/art/assets/d4/*.webp', { eager: true, query: '?url', import: 'default' });
import { CATALOG, defaultAvatar, normalizeAvatar } from '../../src/art/catalog';
import { MANIFEST, missingAssets, assetUrl } from '../../src/art/d/manifest';
import { ramp, sampleRamp } from '../../src/art/d/filters';
import { SKIN_TONES } from '../../src/art/palette';
import { contrastRatio, faceColors } from '../../src/art/d/face';
const fsModule = 'node:fs';
const { readFileSync } = await import(fsModule) as { readFileSync(path: string, encoding: string): string };
import { avatarD } from '../../src/art/d/compose';
afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });
describe('Avatar D', () => {
 it('avisa uma só vez por asset ausente em runtime', () => {
  const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
   expect(assetUrl('d4/absent-test.webp')).toBeUndefined();
   expect(assetUrl('d4/absent-test.webp')).toBeUndefined();
   expect(warning).toHaveBeenCalledExactlyOnceWith('Asset D ausente: d4/absent-test.webp');
  } finally { warning.mockRestore(); }
 });
 it('cobre o catálogo e lista assets ausentes', () => {
  expect(CATALOG.every(i=>MANIFEST[i.id]?.slot===i.slot)).toBe(true);
  const missing = missingAssets(f=>!!assets[`/src/art/assets/${f}`]);
  console.info(`Cobertura D: ${missing.length} ficheiros em falta: ${missing.join(', ')}`);
  expect(missing).toEqual([]);
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
 it('compõe com WebP de produção pela ordem contratada', () => {
  const resolve = (f: string)=>assets[`/src/art/assets/${f}`] as string | undefined;
  const svg = avatarD({...defaultAvatar(),hairStyle:'hair-comprido',outer:'outer-gabardina',glasses:'acc-oculos'}, {}, resolve);
  const positions = ['body_skin.webp','outer-gabardina.webp','hair-comprido.webp','data-layer="face"','data-item="acc-oculos"'].map(v=>svg.indexOf(v));
  expect(positions.every((v,i)=>v>=0 && (!i||v>positions[i-1]!))).toBe(true);
 });
});

describe('Contraste D calculado', () => {
 it('aviso de gravação tem contraste de texto >= 4.5:1', () => {
  const css = readFileSync('src/styles/app.css','utf8');
  const notice = /\.notice\s*\{([^}]+)\}/.exec(css)![1]!;
  const color = /(?:^|;)\s*color:\s*(#[0-9a-f]{6})/i.exec(notice)![1]!;
  const bg = /background:\s*(#[0-9a-f]{6})/i.exec(notice)![1]!;
  expect(contrastRatio(color,bg)).toBeGreaterThanOrEqual(4.5);
 });
 it('lábios >= 1.25:1 e contorno dos olhos >= 1.4:1 nos oito tons', () => {
  // Limiares artísticos de separação de traços; não são texto WCAG.
  // Medem o tom base da pele, sem pretender medir todos os píxeis da rampa.
  for (const tone of SKIN_TONES) {
   const colors=faceColors(tone.hex);
   expect(contrastRatio(colors.lip,tone.hex),tone.name).toBeGreaterThanOrEqual(1.25);
   expect(contrastRatio(colors.eye,tone.hex),tone.name).toBeGreaterThanOrEqual(1.4);
  }
 });
});
