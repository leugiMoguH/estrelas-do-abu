// npm.cmd run dev -- --host 127.0.0.1 --port 4174
// node tests/block-a-captures.mjs [baseURL]
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
const directory = 'test-results/block-a';
await mkdir(directory,{recursive:true});
try {
 for (const [width,height] of [[390,844],[820,1180],[1280,800]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors = [];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  await page.goto(`${process.argv[2] ?? 'http://127.0.0.1:4174'}/tests/block-a-gallery.html`);
  await page.waitForFunction(()=>document.querySelectorAll('figure').length===16);
  await page.evaluate(async()=>{
   await document.fonts.ready;
   await Promise.all([...document.querySelectorAll('image')].map(el=>new Promise((resolve,reject)=>{
    const image=new Image(); image.onload=resolve;image.onerror=reject;image.src=el.getAttribute('href');
   })));
  });
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);
  if (width === 1280) {
   const gaps = await page.evaluate(async()=>{
    const {MANIFEST,assetUrl}=await import('/src/art/d/manifest.ts');
    const {CATALOG}=await import('/src/art/catalog.ts');
    const images=new Map();
    for(const item of CATALOG.filter(i=>['top','bottom'].includes(i.slot))) {
     const im=new Image();im.src=assetUrl(MANIFEST[item.id].file);await im.decode();images.set(item.id,im);
    }
    const under=new Image();under.src=assetUrl('d4/body_under.webp');await under.decode();
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1536;
    const ctx=canvas.getContext('2d');const gaps=[];
    for(const top of CATALOG.filter(i=>i.slot==='top'&&!i.compatibility.occupies.includes('bottom'))) for(const bottom of CATALOG.filter(i=>i.slot==='bottom')) {
     ctx.clearRect(0,0,1024,1536);
     if(top.id==='top-jaqueta') {
      ctx.save();ctx.beginPath();ctx.rect(0,350,1024,Math.min(MANIFEST[top.id].coverage.hem,MANIFEST[bottom.id].coverage.waist+16)-350);ctx.clip();ctx.drawImage(under,0,0,1024,1536);ctx.restore();
     }
     const [,offset,scale]=/translate\(0 ([^)]+)\) scale\(1 ([^)]+)\)/.exec(MANIFEST[bottom.id].transform??'')??['','0','1'];
     ctx.save();ctx.translate(0,Number(offset));ctx.scale(1,Number(scale));ctx.drawImage(images.get(bottom.id),0,0,1024,1536);ctx.restore();
     ctx.drawImage(images.get(top.id),0,0,1024,1536);
     const data=ctx.getImageData(445,675,130,40).data;
     for(let i=3;i<data.length;i+=4) if(data[i]<128) {gaps.push(`${top.id}/${bottom.id}:pixel ${Math.floor(i/4)%130+445},${Math.floor(i/4/130)+675}`);break;}
    }
    return gaps;
   });
   assert.deepEqual(gaps,[], 'Cintura: cobertura raster real nos 35 pares top/baixo');
   const occlusion = await page.evaluate(async()=>{
    const svg=document.querySelector('figure[data-case="0"] svg').cloneNode(true);
    for(const el of svg.querySelectorAll('image')) {
     const blob=await (await fetch(el.getAttribute('href'))).blob();
     const data=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(blob);});
     el.setAttribute('href',data);
    }
    // Render at asset coordinates; compare the actual composition with face removed.
    svg.setAttribute('viewBox','0 0 1024 1536');svg.setAttribute('width','1024');svg.setAttribute('height','1536');
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1536;
    const ctx=canvas.getContext('2d');
    const render=async()=>{
     const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
     const im=new Image();im.src=url;await im.decode();ctx.clearRect(0,0,1024,1536);ctx.drawImage(im,0,0);URL.revokeObjectURL(url);
     return ctx.getImageData(420,170,180,50).data;
    };
    const before=await render();svg.querySelector('[data-layer="face"]').remove();const after=await render();
    const hair=new Image();hair.src=svg.querySelector('[data-layer="hairFront"]').getAttribute('href');await hair.decode();
    ctx.clearRect(0,0,1024,1536);ctx.drawImage(hair,0,0,1024,1536);const mask=ctx.getImageData(420,170,180,50).data;
    let checked=0,different=0;
    for(let i=0;i<mask.length;i+=4) if(mask[i+3]===255) {checked++;if(before.slice(i,i+4).some((v,n)=>v!==after[i+n]))different++;}
    return {checked,different};
   });
   assert.ok(occlusion.checked>50, 'A franja cobre píxeis na região dos olhos');
   assert.equal(occlusion.different,0, 'O rosto/olhos não alteram píxeis cobertos pela franja opaca');
  }
  await page.screenshot({path:`${directory}/contact-${width}x${height}.png`,fullPage:true,animations:'disabled'});
  for (const n of [0,3,4,8,13]) await page.locator(`figure[data-case="${n}"]`).screenshot({path:`${directory}/detail-${width}-${n+1}.png`,animations:'disabled'});
  await page.close();
 }
 console.log('16 combinações × 3 viewports; sem overflow/erros. Capturas em '+directory);
} finally { await browser.close(); }
