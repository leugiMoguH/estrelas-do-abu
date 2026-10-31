import { hgpTopics } from '../../content/historia/topics';
import type { HgpItem } from '../../content/historia/schema';
import { test, expect, type Page } from '@playwright/test';
async function enter(page: Page): Promise<void> {
 await page.goto('/');await page.getByRole('button',{name:/Jogar/}).first().click();
 await page.getByRole('button',{name:/Surpreende/}).click();await page.getByRole('button',{name:/Vamos ao centro/}).click();
 const target=page.locator('[data-target="historia"]');const box=await target.boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44);await target.click();
}
async function answer(page: Page, mode: string): Promise<string> {
 const order=page.locator('.order-options button:not([disabled])');const choices=page.locator('.answer-editor button');let kind='input';
 if(await order.count()){kind='order';while(await order.count())await order.first().click();}
 else if(await choices.count()){kind='mcq';await choices.first().click();}
 else for(const input of await page.locator('.answer-editor input').all())await input.fill('1900');
 await page.getByRole('button',{name:mode==='test'?/Guardar resposta/:/^Verificar$/}).click();
 if(mode!=='test') {await expect(page.locator('.feedback')).not.toBeEmpty();await page.getByRole('button',{name:/Próxima pergunta|Ver resultado/}).click();}
 return kind;
}
test('HGP: seleção acessível, filtros, tutor e ausência de scroll',async({page})=>{
 await enter(page);await expect(page.getByRole('button',{name:/Tomé/})).toBeVisible();
 await expect(page.getByRole('checkbox')).toHaveCount(11);await page.getByRole('button',{name:'Limpar',exact:true}).click();await expect(page.getByRole('button',{name:/Começar a estudar/})).toBeDisabled();
 await page.getByRole('button',{name:'Recuperação do 5.º ano',exact:true}).click();await expect(page.getByRole('checkbox')).toHaveCount(1);
 await page.getByRole('checkbox').check();await expect(page.getByText('1 temas escolhidos')).toBeVisible();
 await page.getByRole('button',{name:'Tudo',exact:true}).click();await page.getByRole('checkbox').nth(1).check();await expect(page.getByText('2 temas escolhidos')).toBeVisible();
 await page.getByRole('button',{name:'Mistura',exact:true}).click();await expect(page.getByText('11 temas escolhidos')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
test('HGP: Estudar, Teste, Rever, estrelas e persistência',async({page})=>{
 await enter(page);await page.getByRole('button',{name:'Mistura',exact:true}).click();await page.getByRole('button',{name:/Começar a estudar/}).click();
 test.skip(await page.getByText(/Ainda não há perguntas/).count()>0,'Bancos HGP ainda ausentes neste checkout');
 const kinds=[];for(let i=0;i<3;i++)kinds.push(await answer(page,'study'));
 await expect(page.locator('main h1')).toHaveText('Mistura de temas');await expect(page.getByText(/estrelas/).first()).toBeVisible();
 await page.getByRole('button',{name:'Continuar a estudar',exact:true}).click();await expect(page.getByText('11 temas escolhidos')).toBeVisible();
 await page.getByRole('button',{name:/^Teste/}).click();await page.getByRole('button',{name:'Começar o teste'}).click();
 await expect(page.getByRole('button',{name:/Tomé|Uma pista/})).toHaveCount(0);
 for(let i=0;i<5;i++) {if(await page.locator('.grade').count())break;await answer(page,'test');}
 await expect(page.locator('.grade')).toContainText('/ 20');const grade=Number((await page.locator('.grade').innerText()).split('/')[0]!.trim().replace(',','.'));expect(grade).toBeGreaterThanOrEqual(0);expect(grade).toBeLessThanOrEqual(20);
 await page.getByRole('button',{name:'Continuar a estudar',exact:true}).click();await page.getByRole('button',{name:/^Rever/}).click();await page.getByRole('button',{name:'Começar a rever'}).click();
 if(await page.locator('.question-progress').count()) {for(let i=0;i<5;i++){if(!await page.locator('.question-progress').count())break;await answer(page,'review');}}
 else await page.getByRole('button',{name:'Voltar à sala',exact:true}).click();
 if(await page.getByRole('button',{name:'Voltar ao centro',exact:true}).count())await page.getByRole('button',{name:'Voltar ao centro',exact:true}).click();
 const stars=await page.locator('#stars').innerText();const saved=await page.evaluate(()=>localStorage.getItem('eda:save:v2'));await page.reload();expect(await page.locator('#stars').innerText()).toBe(stars);expect(await page.evaluate(()=>localStorage.getItem('eda:save:v2'))).toBe(saved);
});

test('HGP: mcq, order, feedback específico e figura com seed fixo (build hgp-e2e)',async({page},info)=>{
 await enter(page);
 const items=await page.evaluate(()=> (window as Window & {hgpE2eItems?: HgpItem[]}).hgpE2eItems ?? []);
 test.skip(!items.length,'Requer bancos e build --mode hgp-e2e');
 const mcq=items.find(i=>i.kind==='mcq')!;const order=items.find(i=>i.kind==='order')!;const figure=items.find(i=>i.figure && i.id!==mcq.id && i.id!==order.id)!;
 expect(mcq).toBeTruthy();expect(order).toBeTruthy();expect(figure).toBeTruthy();
 await page.goto(`/?hgpSeed=42&hgpIds=${[mcq,order,figure].map(i=>i.id).join(',')}`);
 await page.getByRole('button',{name:/Continuar/}).first().click();await page.locator('[data-target="historia"]').click();
 await page.getByRole('button',{name:'Limpar',exact:true}).click();
 await page.getByRole('checkbox',{name:new RegExp(hgpTopics.find(t=>t.id===mcq.topic)!.title)}).check();
 await page.getByRole('button',{name:/Tomé/}).click();await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('dialog').getByRole('button',{name:'Mostra um exemplo'}).click();
 await page.getByRole('dialog').getByRole('button').nth(1).click();await expect(page.getByRole('dialog')).not.toBeEmpty();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Mistura',exact:true}).click();await page.getByRole('button',{name:/Começar a estudar/}).click();
 const kinds=new Set<string>();let sawFigure=false;
 for(let n=0;n<3;n++){
  const prompt=await page.locator('.question h2').innerText();const item=items.find(i=>i.prompt===prompt)!;kinds.add(item.kind);
  if(item.figure){await expect(page.getByRole('img',{name:'Mapa de Portugal com a região em causa destacada'})).toBeVisible();await page.screenshot({path:info.outputPath('hgp-figure.png'),fullPage:true,animations:'disabled'});sawFigure=true;}
  if(item.kind==='mcq'){
   const wrong=item.options.find(o=>o!==item.correct)!;await page.locator('.answer-editor').getByRole('button',{name:wrong,exact:true}).click();await page.getByRole('button',{name:'Verificar',exact:true}).click();await expect(page.locator('.feedback')).toContainText(item.wrong[wrong]!);
   await page.getByRole('button',{name:'Tentar de novo'}).click();await page.locator('.answer-editor').getByRole('button',{name:item.correct,exact:true}).click();
  }else if(item.kind==='order')for(const value of item.correct)await page.locator('.order-options').getByRole('button',{name:value,exact:true}).click();
  else if(item.kind==='numeric')await page.locator('.answer-editor input').fill(String(item.correct));
  else for(let i=0;i<item.correct.length;i++)await page.locator('.answer-editor input').nth(i).fill(item.correct[i]![0]!);
  await page.getByRole('button',{name:'Verificar',exact:true}).click();await page.getByRole('button',{name:/Próxima pergunta|Ver resultado/}).click();
 }
 expect(kinds.has('mcq')).toBe(true);expect(kinds.has('order')).toBe(true);expect(sawFigure).toBe(true);
 await page.locator('.correction details').filter({hasText:figure.prompt}).locator('summary').click();await expect(page.locator('.correction .pt-map')).toBeVisible();
});
