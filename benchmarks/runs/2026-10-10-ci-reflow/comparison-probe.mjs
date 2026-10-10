import { chromium } from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://127.0.0.1:4186/pilot/');
await page.locator('[data-select="500526"]').click();
await page.locator('[data-select="500527"]').click();
await page.locator('#comparison-link').click();
await page.getByLabel('Observation', {exact:true}).fill('Keep this observation');
await page.getByLabel('Open investigation').setInputFiles({ name:'invalid.json', mimeType:'application/json', buffer:Buffer.from('{"schemaVersion":999}') });
await page.setViewportSize({width:320,height:800});
await page.evaluate(() => document.documentElement.style.fontSize='200%');
const results=[];
for (const font of ['system-ui', 'Arial', 'Verdana', 'Georgia', 'monospace']) {
  await page.evaluate(font => document.body.style.fontFamily=font, font);
  results.push(await page.evaluate(font => {
    const out=[];
    for(const el of document.querySelectorAll('body *')) {
      if(!el.checkVisibility() || el.closest('.comparison-region')) continue;
      const rect=el.getBoundingClientRect();
      if(rect.right>innerWidth+.1) out.push({tag:el.tagName,id:el.id,class:el.className,text:el.textContent.trim().slice(0,100),width:rect.width,right:rect.right,font:getComputedStyle(el).font,overflowWrap:getComputedStyle(el).overflowWrap});
    }
    return {font,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:out};
  }, font));
}
await fs.writeFile(new URL(`./workbench-reflow-${process.argv[2] || 'before'}.json`,import.meta.url),JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
if(process.argv[2]==='after') {
  assert(results.every(row=>row.scrollWidth===320));
  await page.evaluate(()=>document.body.style.fontFamily='Verdana');
  const region=page.getByRole('region',{name:'Source evidence comparison'});
  await region.focus();
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>document.querySelector('#comparison-region').scrollLeft>0);
  const scrollLeft=await region.evaluate(el=>el.scrollLeft);
  await page.locator('#export').focus();
  const downloadPending=page.waitForEvent('download');
  await page.keyboard.press('Enter');
  const download=await downloadPending;
  const payload=JSON.parse(await fs.readFile(await download.path(),'utf8'));
  assert.equal(payload.interpretation.observation,'Keep this observation');
  assert.deepEqual(payload.selectedIds,['500526','500527']);
  await page.screenshot({path:new URL('./workbench-reflow-verdana.png',import.meta.url).pathname.slice(1),fullPage:true});
  await fs.writeFile(new URL('./workbench-reflow-interaction.json',import.meta.url),JSON.stringify({font:'Verdana',viewportWidth:320,fontScale:'200%',keyboardScrollLeft:scrollLeft,keyboardDownload:download.suggestedFilename(),selectedIds:payload.selectedIds,observation:payload.interpretation.observation},null,2));
  console.log('Keyboard scrolling and export preserve both records and the authored observation.');
}
await browser.close();
