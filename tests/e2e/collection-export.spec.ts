import {test,expect} from '@playwright/test';
import {defaultAvatar} from '../../src/art/catalog';
import {defaultSave} from '../../src/core/save';

test('C: exportar Save antigo inclui equipamento antes de qualquer alteração e importar repõe-no',async({page})=>{
 const {receipts:_receipts,monthlyProgress:_monthly,equipment:_equipment,...legacy}=defaultSave();
 const avatar={...defaultAvatar(),top:'m-vestido',abuBody:'m-abu-malha'};
 const save={...legacy,version:2,stars:17,ownedItems:['m-vestido','m-abu-malha']};
 await page.addInitScript(({avatar,save})=>{
  if(!localStorage.getItem('eda:app:v1')){
   localStorage.setItem('eda:app:v1',JSON.stringify({profile:{version:1,onboarded:true,avatar}}));
   localStorage.setItem('eda:save:v2',JSON.stringify(save));
  }
 },{avatar,save});
 await page.goto('/');await page.getByRole('button',{name:'Opções',exact:true}).click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('eda:save:v2')!).version)).toBe(2);
 const ready=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar progresso',exact:true}).click();
 const download=await ready;const stream=await download.createReadStream();let json='';
 for await(const chunk of stream!)json+=chunk.toString();
 const exported=JSON.parse(json);
 expect(exported).toMatchObject({version:3,stars:17,equipment:{top:'m-vestido',abuBody:'m-abu-malha'}});
 await page.evaluate(avatar=>localStorage.setItem('eda:app:v1',JSON.stringify({profile:{onboarded:true,avatar}})),defaultAvatar());
 await page.reload();await page.getByRole('button',{name:'Opções',exact:true}).click();
 await page.locator('input[type="file"]').setInputFiles((await download.path())!);
 await page.getByRole('dialog').getByRole('button',{name:'Confirmar',exact:true}).click();
 await expect(page.getByText('Progresso importado com sucesso.',{exact:true})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('eda:save:v2')!).equipment?.top)).toBe('m-vestido');
 await page.reload();
 const restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('eda:save:v2')!));
 expect(restored.equipment).toEqual(exported.equipment);expect(restored.stars).toBe(17);expect(restored.ownedItems).toEqual(save.ownedItems);
});
