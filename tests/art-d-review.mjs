// Run against Vite dev: node tests/art-d-review.mjs [baseURL]
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1500,height:960},deviceScaleFactor:1});
 const base=process.argv[2]??'http://127.0.0.1:4174';
 await page.goto(`${base}/tests/avatar-d-gallery.html`);
 await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 await page.waitForTimeout(800);
 await page.locator('#feet-grid').screenshot({path:'tests/shots/feet-after.png'});
 await page.locator('#face-grid').screenshot({path:'tests/shots/faces-eight-tones.png'});
 await page.evaluate(()=>document.querySelectorAll('[data-layer="skin"]').forEach(e=>e.removeAttribute('clip-path')));
 await page.locator('#feet-grid').screenshot({path:'tests/shots/feet-before.png'});
 await page.evaluate(async()=>{
  const {avatarD}=await import('/src/art/d/compose.ts');
  const {defaultAvatar}=await import('/src/art/catalog.ts');
  const {SKIN_TONES}=await import('/src/art/palette.ts');
  document.body.innerHTML='';
  for(const tone of SKIN_TONES) {
   for(const shared of [false,true]) {
    const f=document.createElement('div'); f.id=`compare-${tone.id}-${shared}`;
    f.style.cssText='width:100px;height:157px;background:#d6dfed;position:absolute;left:0;top:0;visibility:hidden';
    f.innerHTML=avatarD({...defaultAvatar(),skin:tone.id},{size:shared?100:101,reduceMotion:true});
    f.querySelector('svg').style.cssText='width:100px;height:157px';document.body.append(f);
   }
  }
 });
 await page.waitForTimeout(800);
 for(const tone of ['porcelana','clara','bege','oliva','dourada','caramelo','castanha','ebano']) {
  await page.locator(`#compare-${tone}-false`).evaluate(e=>e.style.visibility='visible');
  const before=await page.locator(`#compare-${tone}-false`).screenshot({path:`tests/shots/filter-${tone}-before.png`});
  await page.locator(`#compare-${tone}-false`).evaluate(e=>e.style.visibility='hidden');
  await page.locator(`#compare-${tone}-true`).evaluate(e=>e.style.visibility='visible');
  const after=await page.locator(`#compare-${tone}-true`).screenshot({path:`tests/shots/filter-${tone}-after.png`});
  await page.locator(`#compare-${tone}-true`).evaluate(e=>e.style.visibility='hidden');
  assert.ok(before.equals(after),`pixels differ: ${tone}`);
 }
 const sizes=await page.evaluate(()=>[...document.querySelectorAll('[id^="compare-"]')].slice(0,2).map(e=>e.innerHTML.length));
 console.log('8 miniaturas: capturas idênticas; caracteres SVG completo/partilhado:',sizes);
 await page.goto(`${base}/tests/abu-d-gallery.html`);
 await page.locator('figure').evaluateAll(fs=>fs.forEach(f=>{if(!/abu-gravata|abu-coleira|abu-laco|abu-lenco|abu-camisola|abu-capa/.test(f.textContent))f.remove();}));
 await page.evaluate(()=>{document.body.style.gridTemplateColumns='repeat(6,320px)';document.querySelectorAll('figure svg').forEach(e=>{e.style.width='310px';e.style.height='310px';});});
 await page.waitForTimeout(800);
 await page.screenshot({path:'tests/shots/abu-after.png',fullPage:true});
 console.log('Capturas: pés 4×3, rostos 8 tons, Abu 6 poses × acessórios afetados.');
} finally {await browser.close();}
