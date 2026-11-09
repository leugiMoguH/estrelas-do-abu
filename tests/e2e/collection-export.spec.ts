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
 expect(exported).toMatchObject({format:'estrelas-do-abu-copia',version:1,save:{version:3,stars:17,equipment:{top:'m-vestido',abuBody:'m-abu-malha'}}});
 await page.evaluate(avatar=>localStorage.setItem('eda:app:v1',JSON.stringify({profile:{onboarded:true,avatar}})),defaultAvatar());
 await page.reload();await page.getByRole('button',{name:'Opções',exact:true}).click();
 await page.locator('input[type="file"]').setInputFiles((await download.path())!);
 await page.getByRole('dialog').getByRole('button',{name:'Confirmar',exact:true}).click();
 await expect(page.getByText('Progresso importado com sucesso.',{exact:true})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('eda:save:v2')!).equipment?.top)).toBe('m-vestido');
 await page.reload();
 const restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('eda:save:v2')!));
 expect(restored.equipment).toEqual(exported.save.equipment);expect(restored.stars).toBe(17);expect(restored.ownedItems).toEqual(save.ownedItems);
});

test('F1: progresso jogado e skills sobrevivem a exportar, limpar e importar; ficheiro inválido não altera dados',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:/Jogar/}).first().click();
 await page.getByRole('button',{name:/Surpreende/}).click();await page.getByRole('button',{name:/Vamos ao centro/}).click();
 await page.locator('[data-target="historia"]').click();await page.getByRole('button',{name:/Começar a estudar/}).click();
 for(let i=0;i<3;i++){
  const order=page.locator('.order-options button:not([disabled])');
  if(await order.count())while(await order.count())await order.first().click();
  else if(await page.locator('.answer-editor button').count())await page.locator('.answer-editor button').first().click();
  else for(const input of await page.locator('.answer-editor input').all())await input.fill('1900');
  await page.getByRole('button',{name:'Verificar',exact:true}).click();
  await page.getByRole('button',{name:/Próxima pergunta|Ver resultado/}).click();
 }
 await page.getByRole('button',{name:'Voltar ao centro',exact:true}).click();
 await page.getByRole('button',{name:'Loja',exact:true}).first().click();
 await page.getByRole('button',{name:'Loja',exact:true}).click();
 await page.getByRole('button',{name:/Comprar e equipar/}).first().click();
 await expect(page.getByText(/comprado e equipado/)).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Opções',exact:true}).click();
 await expect(page.getByText('Última cópia: nunca',{exact:true})).toBeVisible();
 const before=await page.evaluate(()=>({save:JSON.parse(localStorage.getItem('eda:save:v2')!),skills:JSON.parse(localStorage.getItem('eda:app:v1')!).skills}));
 expect(Object.keys(before.skills).length).toBeGreaterThan(0);expect(before.save.ownedItems.length).toBeGreaterThan(0);
 const ready=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar progresso',exact:true}).click();const download=await ready;
 await expect(page.getByText(/Última cópia: \d{2}\/\d{2}\/\d{4}/)).toBeVisible();
 await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.getByRole('button',{name:'Opções',exact:true}).click();
 await page.locator('input[type="file"]').setInputFiles((await download.path())!);
 await page.getByRole('dialog').getByRole('button',{name:'Confirmar',exact:true}).click();
 await expect(page.getByText('Progresso importado com sucesso.',{exact:true})).toBeVisible();
 const read=()=>page.evaluate(()=>({save:JSON.parse(localStorage.getItem('eda:save:v2')??'null'),skills:JSON.parse(localStorage.getItem('eda:app:v1')??'null')?.skills}));// null-safe: o poll repete até a gravação assíncrona terminar
 await expect.poll(read).toEqual(before);
 await page.reload();await page.getByRole('button',{name:'Opções',exact:true}).click();
 await page.locator('input[type="file"]').setInputFiles('tests/fixtures/invalid-backup.json');
 await expect(page.getByText('Ficheiro inválido ou versão não suportada. O teu progresso foi mantido.',{exact:true})).toBeVisible();
 expect(await read()).toEqual(before);
});
