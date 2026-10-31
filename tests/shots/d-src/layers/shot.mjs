import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1240,height:960}});
await p.goto('file:///'+process.cwd().replace(/\/g,'/')+'/'+process.argv[2]); await p.waitForTimeout(500);
await p.screenshot({path:process.argv[3]}); await b.close();
