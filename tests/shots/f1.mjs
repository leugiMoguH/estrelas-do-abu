import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const baseURL = process.env.F1_URL || 'http://localhost:4173/';
const out = new URL('./f1/', import.meta.url);
await mkdir(out, { recursive:true });
const browser = await chromium.launch();
const report = [];
try {
 for (const [width,height] of [[390,844],[820,1180],[1280,800]]) {
  const page = await browser.newPage({viewport:{width,height}, reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror', e=>errors.push(String(e)));
  page.on('console', m=>{if(m.type()==='error')errors.push(m.text());});
  const click = async pattern => page.getByRole('button',{name:pattern}).first().click();
  const shot = async name => {
   await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   await page.waitForTimeout(150);
   const overflow = await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   if(overflow>1) throw new Error(`${width} ${name}: overflow ${overflow}`);
   if(name === 'mapa') {
    const targets = await page.locator('.map-hit[aria-disabled="false"] > rect:first-child').evaluateAll(nodes => nodes.map(node => {
     const {width,height}=node.getBoundingClientRect(); return {width,height};
    }));
    if(targets.some(t=>t.width<44 || t.height<44))throw new Error('Map target below 44px');
    report.push({width,height,mapTargets:targets});
   }
   await page.screenshot({path:fileURLToPath(new URL(`${width}x${height}-${name}.png`,out)),fullPage:true,animations:'disabled'});
   report.push({width,height,screen:name,overflow});
  };
  await page.goto(baseURL);
  if(await page.locator('body').getAttribute('data-theme')!=='d')throw new Error('D is not default');
  const contrast = await page.evaluate(()=>{
   const style=getComputedStyle(document.body), value=key=>style.getPropertyValue(key).trim();
   const luminance=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
   return [[value('--ink'),value('--paper')],[value('--primary-ink'),value('--primary-bg')],[value('--ink'),value('--selected-bg')],[value('--title'),'#363259'],['#fff4df','#363259'],['#fff4df','#292143']].map(([fg,bg])=>({fg,bg,ratio:(Math.max(luminance(fg),luminance(bg))+.05)/(Math.min(luminance(fg),luminance(bg))+.05)}));
  });
  if(contrast.some(c=>c.ratio<4.5))throw new Error('Palette contrast below AA');
  report.push({width,height,paletteContrast:contrast});
  await shot('boas-vindas');
  await click(/^Jogar$/); await shot('onboarding');
  await click(/^Roupa$/); await shot('onboarding-roupa');
  await click(/^Acessórios$/); await shot('onboarding-acessorios');
  await click(/Surpreende/);
  await click(/Vamos ao centro/); await shot('mapa');
  await page.locator('[data-target="matematica"]').click(); await shot('sala');
  await click(/perguntar$/); await shot('tutor'); await click(/^Fechar$/);
  await click(/Começar a estudar/); await shot('exercicio');
  for(let i=0;i<3;i++) {
   const order=page.locator('.order-options button');
   const choices=page.locator('.answer-editor button');
   if(await order.count()) { for(let j=await order.count();j>0;j--)await page.locator('.order-options button:not([disabled])').first().click(); }
   else if(await choices.count())await choices.first().click();
   else for(const input of await page.locator('.answer-editor input').all())await input.fill('12');
   await click(/Verificar/); await click(/Próxima pergunta|Ver resultado/);
  }
  await shot('resultado'); await click(/Voltar ao centro/);
  await click(/^Loja$/); await shot('loja');
  await click(/Voltar/); await click(/^Personagem$/); await shot('personagem');
  await click(/Voltar/); await click(/^Conquistas$/); await shot('conquistas');
  await click(/Voltar/); await click(/^Progresso$/); await shot('progresso');
  await click(/Voltar/); await click(/^Opções$/); await shot('opcoes');
  const saved = await page.evaluate(()=>localStorage.getItem('eda:save:v2'));
  for(const theme of ['atual','a','b','d']) {
   await page.goto(new URL(`?tema=${theme}`,baseURL).href);
   await page.getByRole('button',{name:'Continuar',exact:true}).waitFor();
   const actual = await page.locator('body').getAttribute('data-theme');
   if(actual !== (theme==='atual'?null:theme))throw new Error(`Theme ${theme}: ${actual}`);
   if(await page.evaluate(()=>localStorage.getItem('eda:save:v2')) !== saved)throw new Error('Progress changed on theme switch');
  }
  report.push({width,height,themeComparisons:4,progressPreserved:true});
  if(errors.length)throw new Error(errors.join('\n'));
  report.push({width,height,consoleErrors:errors.length});
  await page.close();
 }
 await writeFile(new URL('report.json',out),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
} finally {await browser.close();}
