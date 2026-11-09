import {numerosTemplates} from '../../content/matematica/numeros';
import {test,expect} from '@playwright/test';
import {defaultSave} from '../../src/core/save';
import {defaultAvatar,CATALOG} from '../../src/art/catalog';
import {mathTemplates} from '../../content/matematica';
import type {ContentPack} from '../../src/core/content';
import {materialize,correctAnswerOf} from '../../src/core/content';
import {seededRng} from '../../src/core/session';
const instant=new Date('2026-11-15T12:00:00Z');
test('C: teste, nota, prémios, guardar, equipar, reload e offline',async({page,context},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.clock.install();await page.clock.setFixedTime(instant);
 await page.addInitScript(({avatar,save})=>{if(!localStorage.getItem('eda:app:v1')){localStorage.setItem('eda:app:v1',JSON.stringify({profile:{onboarded:true,avatar}}));localStorage.setItem('eda:save:v2',JSON.stringify(save));}}, {avatar:defaultAvatar(),save:defaultSave()});
 await page.goto('/?tema=d');await page.getByRole('button',{name:/Continuar/}).first().click();await page.locator('[data-target="matematica"]').click();
 await expect(page.locator('.monthly-grid .monthly-item')).toHaveCount(16);
 await page.locator('.monthly-collection').screenshot({path:info.outputPath('collection-grid.png')});
 await page.getByRole('button',{name:/^Teste/}).click();await page.getByRole('button',{name:'10',exact:true}).click();await page.getByRole('button',{name:'Começar o teste',exact:true}).click();
 // Bloco B: o subcapítulo «Frações equivalentes, adição e subtração» junta mat-racionais e mat-fracoes-ops (organização das AE).
 const topic={competencyIds:['mat-racionais','mat-fracoes-ops']};
 const gamePack={id:'eda-demo',version:'1.0.0',templates:[...mathTemplates,...numerosTemplates],competencies:[]} as unknown as ContentPack;
 const pool=materialize(gamePack,{competencyIds:topic.competencyIds,rng:seededRng(instant.getTime()),perTemplate:24,difficultyFor:t=>t.difficulties[0]!});
 const second=await context.newPage();await second.clock.install();await second.clock.setFixedTime(instant);
 await second.goto('/?tema=d');await second.getByRole('button',{name:/Continuar/}).first().click();await second.locator('[data-target="matematica"]').click();await second.getByRole('button',{name:/^Teste/}).click();await second.getByRole('button',{name:'10',exact:true}).click();await second.getByRole('button',{name:'Começar o teste',exact:true}).click();
 const solve=async(target:typeof page)=>{ const page=target;
 for(let i=0;i<10;i++){
  const prompt=await page.locator('.question h2').innerText();const exercise=pool.find(e=>e.prompt===prompt);expect(exercise, prompt).toBeDefined();const answer=correctAnswerOf(exercise!).value;
  if(exercise!.kind==='mcq')await page.locator('.answer-editor').getByRole('button',{name:String(answer),exact:true}).click();
  else if(exercise!.kind==='order'){for(const part of answer as readonly string[])await page.locator('.order-options').getByRole('button',{name:part,exact:true}).click();}
  else {const inputs=page.locator('.answer-editor input');const values=typeof answer==='string'?[answer]:answer;for(let j=0;j<await inputs.count();j++)await inputs.nth(j).fill(String(values[j]));}
  if(i===9)await page.clock.setFixedTime(new Date('2026-12-01T12:00:00Z'));
  await page.getByRole('button',{name:/Guardar resposta/}).click();
 }
 };
 await solve(page);await expect(page.locator('.prize-reveal article')).toHaveCount(4);
 await solve(second);await expect(second.locator('.prize-reveal article')).toHaveCount(0);await second.close();
 await expect(page.locator('.grade')).toContainText('20');await expect(page.locator('.prize-reveal article')).toHaveCount(4);
 await page.locator('.prize-reveal').screenshot({path:info.outputPath('reveal.png'),animations:'disabled'});
 await page.locator('.prize-reveal').getByRole('button',{name:'Equipar',exact:true}).first().click();
 await expect(page.locator('.prize-reveal').getByRole('button',{name:'Equipado',exact:true})).toBeDisabled();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('eda:save:v2')!));expect(saved.receipts).toHaveLength(2);expect(saved.receipts.map((r:{attempt:{month:string}})=>r.attempt.month)).toEqual(['2026-12','2026-12']);expect(saved.ownedItems).toHaveLength(4);expect(saved.equipment[CATALOG.find(i=>i.id===saved.receipts[0].items[0])!.slot]).toBe(saved.receipts[0].items[0]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.reload();await page.getByRole('button',{name:/Continuar/}).first().click();await page.getByRole('button',{name:'Loja',exact:true}).first().click();await page.getByRole('button',{name:'Coleção',exact:true}).click();
 await page.getByText(/Prémios guardados ·/).first().click();await expect(page.locator('details .prize-reveal article')).toHaveCount(4);
 await expect(page.locator('.extras-catalog .extras-item')).not.toHaveCount(0);
 await page.locator('.extras-catalog').screenshot({path:info.outputPath('inventory.png'),animations:'disabled'});
 await page.locator('.extras-preview').screenshot({path:info.outputPath('equipped.png'),animations:'disabled'});
 await context.setOffline(true);await page.getByRole('button',{name:'Personalizar',exact:true}).click();await expect(page.locator('.extras-preview')).toBeVisible();await context.setOffline(false);
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('eda:save:v2')!));expect(after.receipts).toEqual(saved.receipts);expect(after.ownedItems).toEqual(saved.ownedItems);expect(after.equipment).toEqual(saved.equipment);expect(errors).toEqual([]);
});

for(const [timezone,expected] of [['Pacific/Kiritimati','2027-02'],['Pacific/Honolulu','2027-01']] as const) {
 test(`C: mês local em ${timezone}`,async({browser})=>{
  const context=await browser.newContext({timezoneId:timezone});const page=await context.newPage();
  await page.clock.install();await page.clock.setFixedTime(new Date('2027-01-31T23:30:00Z'));
  await page.addInitScript(({avatar,save})=>{localStorage.setItem('eda:app:v1',JSON.stringify({profile:{onboarded:true,avatar}}));localStorage.setItem('eda:save:v2',JSON.stringify(save));},{avatar:defaultAvatar(),save:defaultSave()});
  await page.goto('/');await page.getByRole('button',{name:/Continuar/}).first().click();await page.locator('[data-target="matematica"]').click();
  await expect(page.locator('.monthly-collection h2')).toContainText(expected);
  await expect(page.locator('.monthly-grid .monthly-item')).toHaveCount(expected==='2027-01'?16:0);
  if(expected==='2027-02')await expect(page.locator('.monthly-collection')).toContainText('indisponível');
  await page.clock.setFixedTime(new Date('2026-10-31T00:00:00Z'));
  await page.getByRole('button',{name:/^Teste/}).click();
  await expect(page.locator('.monthly-collection')).toContainText('2026-11');
  await context.close();
 });
}
