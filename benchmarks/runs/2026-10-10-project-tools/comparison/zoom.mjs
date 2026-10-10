import {chromium} from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/playwright/index.mjs';
import {writeFile} from 'node:fs/promises';
const root='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/portfolio-edition-ocr';
const extension='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/native-zoom/extension';
const results=[];
for (const factor of [2,4]) {
  const context=await chromium.launchPersistentContext(`${root}/zoom-${factor}-profile`,{channel:'chromium',headless:true,viewport:{width:1280,height:900},args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
  try {
    const sw=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
    const page=await context.newPage();
    await page.goto('http://127.0.0.1:4188/pilot/');
    const applied=await sw.evaluate(async factor=>{
      const tab=(await chrome.tabs.query({})).find(tab=>tab.url.startsWith('http://127.0.0.1:4188/'));
      await chrome.tabs.setZoomSettings(tab.id,{mode:'automatic',scope:'per-tab'});
      await chrome.tabs.setZoom(tab.id,factor);
      return {factor:await chrome.tabs.getZoom(tab.id),url:tab.url};
    },factor);
    console.log(JSON.stringify({requested:factor,applied,before:await page.evaluate(()=>({dpr:devicePixelRatio,width:innerWidth}))}));
    await page.waitForFunction(factor=>Math.abs(devicePixelRatio-factor)<0.001,factor);
    await page.locator('[data-select="500526"]').focus();
    await page.keyboard.press('Space');
    await page.locator('[data-select="500531"]').focus();
    await page.keyboard.press('Space');
    const check=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,dpr:devicePixelRatio}));
    if(check.width<check.scrollWidth) throw Error('Collection document overflow');
    await page.screenshot({path:`${root}/collection-native-${factor}00.png`,fullPage:true});
    const region=page.getByRole('region',{name:'Catalogue records'});
    await region.focus(); await page.keyboard.press('End');
    await page.locator('#comparison-link').click();
    await page.getByRole('link',{name:'Source for Attribution, Book Harmonium, Met 500531'}).click();
    const sourceCheck=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,dpr:devicePixelRatio}));
    if(sourceCheck.width<sourceCheck.scrollWidth) throw Error('Source document overflow');
    await page.screenshot({path:`${root}/source-native-${factor}00.png`,fullPage:true});
    await page.getByRole('link',{name:'Return to comparison'}).click();
    const active=await page.evaluate(()=>document.activeElement?.getAttribute('aria-label'));
    if(active!=='Source for Attribution, Book Harmonium, Met 500531') throw Error(`Focus not restored: ${active}`);
    results.push({factor,collection:check,source:sourceCheck,selection:await page.locator('#selection-count').textContent(),focusRestored:true});
  } finally { await context.close(); }
}
await writeFile(`${root}/native-zoom.json`,JSON.stringify(results,null,2));
