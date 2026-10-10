import { chromium } from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/@playwright/test/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const root='C:/Users/chris/Documents/GitHub/fancy-research-tools';
const out='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/portfolio-final-visual';
await mkdir(out,{recursive:true});
const browser=await chromium.launch();const evidence=[];
for (const [route,name] of [['letters/','letter-annotation'],['tool/','collection-metadata'],['pilot/','collection-comparison']]) {
 const context=await browser.newContext({viewport:{width:1440,height:960}}); const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:4173/${route}`,{waitUntil:'networkidle'});
 if(route==='tool/') await page.getByRole('button',{name:'Edit record',exact:true}).click();
 if(route==='letters/') {
  const source=page.locator('#bulletin-text');
  await source.evaluate(e=>{e.focus();const start=e.value.indexOf('Ich kenne E. Hübner');e.setSelectionRange(start,e.value.indexOf('Aber ich sollte',start));});
  await page.getByRole('button',{name:'Annotate selection',exact:true}).click();
 }
 await page.screenshot({path:`${root}/public/previews/${name}.png`});
 await page.screenshot({path:`${out}/${name}-desktop.png`,fullPage:true});
 await writeFile(`${out}/${name}.txt`,await page.locator('body').innerText());
 await page.setViewportSize({width:320,height:800});
 await page.screenshot({path:`${out}/${name}-narrow.png`,fullPage:true});
 evidence.push({route,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
 await context.close();
}
await browser.close();await writeFile(`${out}/capture.json`,JSON.stringify(evidence,null,2));console.log(evidence);
