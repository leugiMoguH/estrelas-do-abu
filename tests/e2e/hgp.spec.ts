import { hgpTopics } from '../../content/historia/topics';
import type { HgpItem } from '../../content/historia/schema';
import { test, expect, type Page } from '@playwright/test';
import snapshotJson from '../../docs/hgp/fabrica/itens.json' with { type: 'json' };
type Snap={id:string;prompt:string;validacao:string;secao:string;nivel:number;origem:string};
async function enter(page: Page): Promise<void> {
 await page.goto('/');await page.getByRole('button',{name:/Jogar/}).first().click();
 await page.getByRole('button',{name:/Surpreende/}).click();await page.getByRole('button',{name:/Vamos ao centro/}).click();
 const target=page.locator('[data-target="historia"]');const box=await target.boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44);await target.click();
}
async function expandTopics(page: Page): Promise<void> {
 const closed=page.locator('.topic-group:not([open]) > summary');
 while(await closed.count()) await closed.first().click();
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
test('HGP: capítulos e subcapítulos do manual, seleção acessível, tutor e ausência de scroll',async({page})=>{
 await enter(page);await expect(page.getByRole('button',{name:/Tomé/})).toBeVisible();
 await expect(page.locator('.topic-group').first().locator('summary')).toContainText('Recuperar aprendizagens — 5.º ano');
 await expect(page.locator('.topic-group[open]')).toHaveCount(1);
 await expect(page.locator('.topic-group[open] summary')).toContainText('D1 — Portugal no século XVIII (págs. 20–40): 8/9 escolhidos');
 await expandTopics(page);
 // 4 capítulos agrupadores + 27 subcapítulos (8 da recuperação do 5.º ano + 19)
 await expect(page.getByRole('checkbox', { includeHidden:true })).toHaveCount(31);
 await expect(page.locator('.topic-card.is-pending')).toHaveCount(0);
 // recuperação: 8 subcapítulos, 4 com título do índice e 4 como subdivisão de trabalho
 await expect(page.locator('.hgp-editorial', { hasText: 'Título do índice do manual' })).toHaveCount(4);
 await expect(page.locator('.hgp-editorial', { hasText: 'Subdivisão de trabalho (a confirmar com o manual)' })).toHaveCount(4);
 await page.getByRole('button',{name:'Limpar',exact:true}).click();await expandTopics(page);
 await expect(page.getByRole('button',{name:/Começar a estudar/})).toBeDisabled();
 await expect(page.getByText('0 subcapítulos escolhidos')).toBeVisible();
 // escolher um subcapítulo
 await page.getByRole('checkbox',{name:/Ouro, diamantes e escravização/}).check();
 await expect(page.getByText('1 subcapítulos escolhidos')).toBeVisible();await expect(page.getByRole('checkbox',{name:/Ouro, diamantes e escravização/})).toBeFocused();
 // capítulo agrupador: seleciona todos os subcapítulos do D1
 await page.getByRole('checkbox',{name:'Selecionar todos os subcapítulos deste capítulo'}).first().check();
 await expect(page.getByText('9 subcapítulos escolhidos')).toBeVisible();
 await page.getByRole('button',{name:'Mistura',exact:true}).click();await expect(page.getByText('27 subcapítulos escolhidos')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
test('HGP: Estudar, Teste, Rever, estrelas e persistência',async({page})=>{
 await enter(page);await page.getByRole('button',{name:'Mistura',exact:true}).click();await page.getByRole('button',{name:/Começar a estudar/}).click();
 test.skip(await page.getByText(/Ainda não há perguntas/).count()>0,'Bancos HGP ainda ausentes neste checkout');
 const kinds=[];for(let i=0;i<3;i++)kinds.push(await answer(page,'study'));
 await expect(page.locator('main h1')).toHaveText('27 subcapítulos');await expect(page.getByText(/estrelas/).first()).toBeVisible();
 await page.getByRole('button',{name:'Continuar a estudar',exact:true}).click();await expect(page.getByText('27 subcapítulos escolhidos')).toBeVisible();
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
 await expandTopics(page);
 await page.getByRole('checkbox',{name:new RegExp(hgpTopics.find(t=>t.id===mcq.topic)!.title)}).check();
 await page.getByRole('button',{name:/Tomé/}).click();await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('dialog').getByRole('button',{name:'Mostra um exemplo'}).click();
 await page.getByRole('dialog').getByRole('button').nth(1).click();await expect(page.getByRole('dialog')).not.toBeEmpty();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Mistura',exact:true}).click();await page.getByRole('button',{name:/Começar a estudar/}).click();
 const kinds=new Set<string>();let sawFigure=false;
 for(let n=0;n<3;n++){
  const prompt=await page.locator('.question h2').innerText();const item=items.find(i=>i.prompt===prompt)!;kinds.add(item.kind);
  if(item.figure){await expect(page.getByRole('img',{name:item.figure.label ?? 'Mapa de Portugal com a região em causa destacada',exact:true})).toBeVisible();await page.screenshot({path:info.outputPath('hgp-figure.png'),fullPage:true,animations:'disabled'});sawFigure=true;}
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
test('HGP: mapa limpo, sem atalhos de matérias; ligação ?capitulo= e seleção normal (20 perguntas)',async({page})=>{
 const snapshot=snapshotJson as Snap[];
 const active=snapshot.filter(i=>i.validacao!=='a-confirmar');
 expect(active.filter(i=>i.origem==='manual').length).toBe(69);
 const chapter=active.filter(i=>i.secao!=='d1-extra-novas-culturas');expect(chapter.length).toBeGreaterThanOrEqual(300);
 await page.goto('/');await page.getByRole('button',{name:/Jogar/}).first().click();
 await page.getByRole('button',{name:/Surpreende/}).click();await page.getByRole('button',{name:/Vamos ao centro/}).click();
 // mapa: nenhum botão amarelo de teste, nenhum atalho de matéria; sem tema anterior, sem «Continuar a estudar»
 await expect(page.getByRole('button',{name:/Preparar próximo teste/})).toHaveCount(0);
 await expect(page.locator('.chapter-cta, .subject-links')).toHaveCount(0);
 await expect(page.getByRole('button',{name:/Continuar a estudar/})).toHaveCount(0);
 await page.locator('[data-target="historia"]').click();
 await expect(page.getByRole('note')).toContainText('Versão provisória de estudo');
 await expect(page.getByRole('button',{name:/Preparar próximo teste/})).toHaveCount(0);
 await page.getByRole('button',{name:/Começar a estudar/}).click();
 for(let i=0;i<3;i++)await answer(page,'study');
 await page.getByRole('button',{name:'Voltar ao centro',exact:true}).click();
 // com progresso: «Continuar a estudar» genérico, e ainda sem atalhos específicos
 await page.reload();await page.getByRole('button',{name:'Continuar',exact:true}).click();
 await expect(page.getByRole('button',{name:'Continuar a estudar',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:/Preparar próximo teste/})).toHaveCount(0);
 await page.goto('/?capitulo=seculo-xviii');
 await expect(page.locator('.question-progress')).toContainText('Pergunta 1 de 20');
 const seen=new Set<string>();
 for(let i=0;i<20;i++){
  const text=await page.locator('form.question').innerText();
  const hit=chapter.find(item=>text.includes(item.prompt.slice(0,40)));
  expect(hit,`Pergunta ${i+1} fora do capítulo ou excluída: ${text.slice(0,60)}`).toBeTruthy();seen.add(text.split(String.fromCharCode(10))[0]!);
  await answer(page,'study');
 }
 expect(seen.size).toBe(20);
});
const REC5=['Portugal nos séculos XV e XVI','Expansão marítima portuguesa','Intercâmbio e choque de culturas','Consequências da expansão portuguesa','Da União Ibérica à Restauração da Independência','Crise dinástica de 1580 e União Ibérica','Portugal sob os Filipes','Descontentamento, resistência e Restauração de 1640'];
test('HGP: recuperação do 5.º ano — 8 subcapítulos com lição e sessão própria',async({page})=>{
 await enter(page);
 for(const title of REC5){
  await page.getByRole('button',{name:'Limpar',exact:true}).click();await expandTopics(page);
  await page.locator('label.topic-card',{has:page.locator('strong',{hasText:new RegExp('^'+title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$')})}).locator('input').check();
  await expect(page.getByText('1 subcapítulos escolhidos')).toBeVisible();
  await page.getByRole('button',{name:/Tomé/}).click();await page.getByRole('button',{name:'Explica-me esta matéria'}).click();
  await expect(dialogText(page)).toContainText(title.slice(0,12));await page.getByRole('button',{name:'Fechar'}).click();
  await page.getByRole('button',{name:/Começar a estudar/}).click();
  await expect(page.locator('.question-progress')).toContainText('Pergunta 1 de');
  await page.goto('/');await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.locator('[data-target="historia"]').click();
 }
});
test('HGP: recuperação — seleção múltipla, modos Estudar, Teste e Rever, sem scroll lateral',async({page})=>{
 await enter(page);await page.getByRole('button',{name:'Limpar',exact:true}).click();await expandTopics(page);
 for(const title of [REC5[1]!,REC5[6]!,REC5[7]!])
  await page.locator('label.topic-card',{has:page.locator('strong',{hasText:title})}).locator('input').check();
 await expect(page.getByText('3 subcapítulos escolhidos')).toBeVisible();
 await page.getByRole('button',{name:/Começar a estudar/}).click();
 for(let i=0;i<3;i++)await answer(page,'study');
 await expect(page.getByText(/estrelas/).first()).toBeVisible();
 await page.getByRole('button',{name:'Continuar a estudar',exact:true}).click();await expect(page.getByText('3 subcapítulos escolhidos')).toBeVisible();
 await page.getByRole('button',{name:/^Teste/}).click();await page.getByRole('button',{name:'Começar o teste'}).click();
 for(let i=0;i<5;i++){if(await page.locator('.grade').count())break;await answer(page,'test');}
 await expect(page.locator('.grade')).toContainText('/ 20');
 await page.getByRole('button',{name:'Continuar a estudar',exact:true}).click();await page.getByRole('button',{name:/^Rever/}).click();await page.getByRole('button',{name:'Começar a rever'}).click();
 if(await page.locator('.question-progress').count()) {for(let i=0;i<5;i++){if(!await page.locator('.question-progress').count())break;await answer(page,'review');}}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
test('HGP: sessões consecutivas da recuperação não repetem perguntas',async({page})=>{
 await enter(page);await page.getByRole('button',{name:'Limpar',exact:true}).click();await expandTopics(page);
 await page.getByRole('checkbox',{name:'Selecionar todos os subcapítulos deste capítulo'}).first().check();
 await expect(page.getByText('8 subcapítulos escolhidos')).toBeVisible();
 const all:string[]=[];
 for(let round=0;round<3;round++){
  await page.getByRole('button',{name:/Começar a estudar/}).click();
  const prompts:string[]=[];
  for(let i=0;i<(round?5:3);i++){prompts.push((await page.locator('form.question').innerText()).split('\n').slice(0,3).join('|'));await answer(page,'study');}
  expect(new Set(prompts).size).toBe(prompts.length);
  all.push(...prompts);
  await page.getByRole('button',{name:'Continuar a estudar',exact:true}).click();
 }
 expect(new Set(all).size).toBe(all.length);
});
test('HGP: um subcapítulo escolhido só traz perguntas e lição desse subcapítulo',async({page})=>{
 const snapshot=snapshotJson as Snap[];
 const ouro=snapshot.filter(i=>i.secao==='d1-ouro-diamantes'&&i.validacao!=='a-confirmar');expect(ouro.length).toBeGreaterThanOrEqual(20);
 await enter(page);await page.getByRole('button',{name:'Limpar',exact:true}).click();await expandTopics(page);
 await page.getByRole('checkbox',{name:/Ouro, diamantes e escravização/}).check();
 await page.getByRole('button',{name:/Tomé/}).click();await page.getByRole('button',{name:'Explica-me esta matéria'}).click();
 await expect(dialogText(page)).toContainText('O quinto era o imposto');await expect(dialogText(page)).not.toContainText('A sociedade dividia-se');
 await page.getByRole('button',{name:'Fechar'}).click();
 await page.getByRole('button',{name:/Começar a estudar/}).click();
 for(let i=0;i<3;i++){
  const text=await page.locator('form.question').innerText();
  expect(ouro.some(item=>text.includes(item.prompt.slice(0,40))),`Pergunta ${i+1} fora do subcapítulo: ${text.slice(0,60)}`).toBe(true);
  await answer(page,'study');
 }
});
const dialogText=(page: Page)=>page.locator('dialog.tutor-dialog');
