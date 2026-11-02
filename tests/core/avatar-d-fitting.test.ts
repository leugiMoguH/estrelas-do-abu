import { describe, expect, it } from 'vitest';
import { CATALOG, defaultAvatar, normalizeAvatar, randomAvatar, resolveAvatarCompatibility } from '../../src/art/catalog';
import { EYE_COLORS, EYE_STYLES, EXPRESSIONS, HAIR_COLORS, SKIN_TONES, type AvatarConfig } from '../../src/art/palette';
import { ANCHORS, MANIFEST } from '../../src/art/d/manifest';
import { avatarD } from '../../src/art/d/compose';

const owned = CATALOG.map(i => i.id);
const axes: [keyof AvatarConfig, (string | null)[]][] = [
 ['skin', SKIN_TONES.map(i=>i.id)], ['eyes', EYE_STYLES.map(i=>i.id)],
 ['hairColor', HAIR_COLORS.map(i=>i.id)], ['eyeColor', EYE_COLORS.map(i=>i.id)],
 ['expression', EXPRESSIONS.map(i=>i.id)],
 ...(['hairStyle','top','bottom','outer','shoes','hat','accessory','glasses','backpack'] as const).map(slot =>
  [slot, [...(['outer','hat','accessory','glasses','backpack'].includes(slot) ? [null] : []), ...CATALOG.filter(i=>i.slot===slot).map(i=>i.id)]] as [keyof AvatarConfig, (string | null)[]]),
];

function check(c: AvatarConfig): void {
 const before = structuredClone(c);
 const fit = resolveAvatarCompatibility(c);
 expect(fit.avatar).toEqual(c);
 expect(normalizeAvatar(c, owned)).toEqual(c);
 expect(c).toEqual(before);
 const top = MANIFEST[c.top]!, bottom = MANIFEST[c.bottom]!;
 expect(bottom.coverage?.waist).toBe(ANCHORS.waist[1]);
 expect(top.coverage!.hem! - bottom.coverage!.waist!).toBeGreaterThanOrEqual(19);
 expect(top.coverage!.hem! - bottom.coverage!.waist!).toBeLessThanOrEqual(47);
 expect(bottom.coverage!.hem!).toBeGreaterThan(top.coverage!.hem!);
 const svg = avatarD(c, {}, f=>f);
 const ordered = ['skin','under','bottom','shoes','top', ...(c.outer ? ['outer'] : []), 'hands','face', ...(c.hairStyle !== 'hair-rapado' ? ['hairFront'] : [])];
 const positions = ordered.map(l=>svg.indexOf(`data-layer="${l}"`));
 expect(positions.every((p,i)=>p>=0 && (!i || p>positions[i-1]!))).toBe(true);
 if (c.hairStyle !== 'hair-rapado') {
  expect(svg.indexOf('data-layer="hairBack"')).toBeLessThan(positions[0]!);
  expect(svg).toMatch(/data-layer="hairFront"[^>]+clip-path="url\(#[^)]+-hair-front\)"/);
 }
 for (const id of [c.hat,c.accessory,c.glasses,c.backpack].filter(Boolean)) expect(svg).toContain(`data-item="${id}"`);
 expect(svg).not.toContain('height="700"');
 if (fit.headAccessoryPlacement === 'hat-side') {
  expect(svg).toContain('data-placement="hat-side"');
  expect(fit.notices.length).toBeGreaterThan(0);
 }
}

describe('Contrato de encaixe D', () => {
 it('todos os pares de valores, incluindo vazio, cores, expressões e oito peles', () => {
  let count = 0;
  for (let a=0;a<axes.length;a++) for (let b=a+1;b<axes.length;b++) {
   const [ka, va] = axes[a]!, [kb, vb] = axes[b]!;
   for (const x of va) for (const y of vb) { check({...defaultAvatar(), [ka]:x, [kb]:y}); count++; }
  }
  expect(count).toBeGreaterThan(2000);
 });
 it('amostra determinística de todos os eixos e aleatório passa pelo mesmo resolvedor', () => {
  let seed = 421;
  const rng = (): number => ((seed = (Math.imul(seed,1664525)+1013904223) >>> 0) / 2**32);
  for (let n=0;n<128;n++) {
   const c = defaultAvatar();
   for (const [key, values] of axes) Object.assign(c, {[key]: values[Math.floor(rng()*values.length)]});
   check(c);
   check(randomAvatar(rng, owned));
  }
 });
 it('triplos críticos: top/baixo/casaco e cabelo/chapéu/acessório', () => {
  for (const top of CATALOG.filter(i=>i.slot==='top')) for (const bottom of CATALOG.filter(i=>i.slot==='bottom'))
   check({...defaultAvatar(),top:top.id,bottom:bottom.id,outer:'outer-gabardina'});
  for (const hair of CATALOG.filter(i=>i.slot==='hairStyle')) for (const hat of CATALOG.filter(i=>i.slot==='hat'))
   for (const accessory of ['acc-fita','acc-bandolete']) check({...defaultAvatar(),hairStyle:hair.id,hat:hat.id,accessory});
 });
 it('encaixa cinturas medidas sem deslocar tornozelos das calças; bainhas seguem cada peça', () => {
  const source: Record<string, number> = {'bottom-calcas':600,'bottom-verdes':619,'bottom-calcoes':708,'bottom-saia':684,'bottom-xadrez':664};
  for (const [id, waist] of Object.entries(source)) {
   const layer = MANIFEST[id]!;
   const match = /translate\(0 ([^)]+)\) scale\(1 ([^)]+)\)/.exec(layer.transform!)!;
   const offset = Number(match[1]), scale = Number(match[2]);
   expect(waist*scale+offset).toBeCloseTo(ANCHORS.waist[1]);
   if (layer.coverage?.ankle) expect(1375*scale+offset).toBeCloseTo(1375);
  }
  const jacket = avatarD({...defaultAvatar(),top:'top-jaqueta',bottom:'bottom-calcoes'}, {}, f=>f);
  expect(jacket).toMatch(/-under"><rect y="350" width="1024" height="346"/);
 });
});
