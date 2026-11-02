import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const directory='test-results/block-b';await mkdir(directory,{recursive:true});
const browser=await chromium.launch();
try {
 for(const [width,height] of [[390,844],[820,1180],[1280,800]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('http://127.0.0.1:4174/tests/block-b-gallery.html');
  await page.waitForFunction(()=>document.documentElement.dataset.ready==='76');
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('image')].map(async el=>{const im=new Image();im.src=el.getAttribute('href');await im.decode();}));});
  assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:`${directory}/contact-${width}x${height}.png`,fullPage:true,animations:'disabled'});
  for(const section of await page.locator('section[data-sheet]').all()) await section.screenshot({path:`${directory}/sheet-${width}-${await section.getAttribute('data-sheet')}.png`,animations:'disabled'});
  // Check real opaque pixels across every ordinary top/bottom waistband, including SVG layers.
  if(width===1280) {
   const gaps=await page.evaluate(async()=>{
    const {CATALOG}=await import('/src/art/catalog.ts');const {MANIFEST,assetUrl}=await import('/src/art/d/manifest.ts');
    const images=new Map();for(const i of CATALOG.filter(i=>['top','bottom'].includes(i.slot))){const im=new Image();im.src=assetUrl(MANIFEST[i.id].file);await im.decode();images.set(i.id,im);}
    const under=new Image();under.src=assetUrl('d4/body_under.webp');await under.decode();
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1536;const ctx=canvas.getContext('2d'),gaps=[];
    for(const t of CATALOG.filter(i=>i.slot==='top'&&!i.compatibility.occupies.includes('bottom'))) for(const b of CATALOG.filter(i=>i.slot==='bottom')) {
     ctx.clearRect(0,0,1024,1536);
     if(t.id==='top-jaqueta'){ctx.save();ctx.beginPath();ctx.rect(0,350,1024,346);ctx.clip();ctx.drawImage(under,0,0,1024,1536);ctx.restore();}
     ctx.save();const m=/translate\(0 ([^)]+)\) scale\(1 ([^)]+)\)/.exec(MANIFEST[b.id].transform??'');if(m){ctx.translate(0,Number(m[1]));ctx.scale(1,Number(m[2]));}ctx.drawImage(images.get(b.id),0,0,1024,1536);ctx.restore();ctx.drawImage(images.get(t.id),0,0,1024,1536);
     const d=ctx.getImageData(445,680,130,30).data;for(let n=3;n<d.length;n+=4)if(d[n]<128){gaps.push(`${t.id}/${b.id}`);break;}
    }return gaps;
   });assert.deepEqual(gaps,[],'Cinturas reais de todos os pares, SVG e WebP');
  }
  await page.close();
 }
 console.log('76 casos x 3 viewports; imagens carregadas, cinturas raster, consola e overflow verdes.');
} finally {await browser.close();}
