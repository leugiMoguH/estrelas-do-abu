import { expect, test } from '@playwright/test';
import { CATALOG, defaultAvatar } from '../../src/art/catalog';
import { defaultSave } from '../../src/core/save';

test('D: equipamento antigo com chapéu e acessório carrega, explica encaixe e persiste sem perda', async ({page}) => {
 const avatar = {...defaultAvatar(),skin:'ebano',hairStyle:'hair-franja',top:'top-jaqueta',bottom:'bottom-calcoes',outer:'outer-gabardina',shoes:'shoes-chuva',hat:'hat-sol',accessory:'acc-bandolete'};
 const ownedItems = CATALOG.filter(i=>!i.free).map(i=>i.id);
 const save = {...defaultSave(),stars:137,ownedItems};
 const errors: string[] = [];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(({avatar,save})=>{
  if(!localStorage.getItem('eda:app:v1')) {
   localStorage.setItem('eda:app:v1',JSON.stringify({profile:{version:1,onboarded:true,avatar},favorites:[avatar]}));
   localStorage.setItem('eda:save:v2',JSON.stringify(save));
  }
 },{avatar,save});
 const open = async (): Promise<void> => {
  await page.getByRole('button',{name:/Continuar/}).first().click();
  await page.getByRole('button',{name:/^Loja$/}).first().click();
  await expect(page.locator('.extras-controls')).toContainText('O acessório de cabelo fica preso ao lado do chapéu.');
  await expect(page.locator('.extras-preview [data-item="acc-bandolete"]')).toHaveAttribute('data-placement','hat-side');
  await expect(page.locator('.extras-preview [data-item="hat-sol"]')).toBeVisible();
 };
 await page.goto('/?tema=d');await open();
 await page.getByRole('button',{name:'Personalizar',exact:true}).click();
 await page.getByRole('button',{name:'Guardar conjunto 2',exact:true}).click();
 const read = async () => page.evaluate(()=>({app:JSON.parse(localStorage.getItem('eda:app:v1')!),save:JSON.parse(localStorage.getItem('eda:save:v2')!)}));
 const stored = await read();
 expect(stored.app.profile.avatar).toEqual(avatar);
 expect(stored.save.ownedItems).toEqual(ownedItems);
 expect(stored.save.stars).toBe(137);
 await page.reload();await open();
 const reloaded = await read();
 expect(reloaded.app.profile.avatar).toEqual(avatar);
 expect(reloaded.save).toEqual(stored.save);
 expect(errors).toEqual([]);
});
