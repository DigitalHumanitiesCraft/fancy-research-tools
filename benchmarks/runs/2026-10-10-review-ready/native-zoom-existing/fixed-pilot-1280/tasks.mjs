import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const {chromium}=await import('file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/@playwright/test/index.mjs');
const root='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/native-zoom/fixed-pilot-1280';
const base='http://127.0.0.1:4176';
const result={startedAt:new Date().toISOString(),method:'Headless Chromium native page zoom via chrome.tabs.setZoom, automatic mode, per-tab scope. No CSS zoom, font-size override, CDP page scale, or OS setting used.',references:['https://developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoom','https://playwright.dev/docs/chrome-extensions'],screenReader:{status:'not run',installed:'Windows Narrator',reason:'Native desktop operation/audio observation unavailable. No speech or real screen-reader task is claimed.'},cases:[],resources:{}};
const context=await chromium.launchPersistentContext(root+'/task-profile',{channel:'chromium',headless:true,viewport:{width:1280,height:900},acceptDownloads:true,args:[`--disable-extensions-except=${root}/extension`,`--load-extension=${root}/extension`]});
try {
result.browser=context.browser().version();
const sw=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
const metrics=async page=>page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,visualScale:visualViewport.scale,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.getBoundingClientRect().width}));
const screenshot=async(page,name)=>{await new Promise(resolve=>setTimeout(resolve,550));const data=await sw.evaluate(async url=>{const tabs=await chrome.tabs.query({});const tab=tabs.find(t=>t.url===url);await chrome.tabs.update(tab.id,{active:true});return chrome.tabs.captureVisibleTab(tab.windowId,{format:'png'});},page.url());await writeFile(root+'/'+name+'.png',Buffer.from(data.split(',')[1],'base64'));return name+'.png';};
const download=async(page,button,name)=>{const [file]=await Promise.all([page.waitForEvent('download'),button.click()]);await file.saveAs(root+'/'+name+'.json');return JSON.parse(await readFile(root+'/'+name+'.json','utf8'));};
const cases=[{name:'home',route:'/'},{name:'pilot',route:'/pilot/'},{name:'baseline',route:'/baseline/'},{name:'editor',route:'/tool/?id=demo-001'},{name:'atlas',route:'/concepts/atlas/'},{name:'bench',route:'/concepts/bench/'},{name:'trail',route:'/concepts/trail/'}];
for(const zoom of [2,4]) for(const target of cases.filter(t=>t.name==='pilot')){
const page=await context.newPage();page.setDefaultTimeout(10000);const item={name:target.name,route:target.route,requestedZoom:zoom};result.cases.push(item);
page.on('response',async response=>{if(response.url().startsWith(base)&&response.status()===200){try{const data=await response.body();result.resources[response.url()]={sha256:createHash('sha256').update(data).digest('hex'),bytes:data.length};}catch{}}});
try {
await page.goto(base+target.route);await page.evaluate(()=>localStorage.clear());await page.reload();
item.before=await metrics(page);
item.zoom=await sw.evaluate(async({url,zoom})=>{const tabs=await chrome.tabs.query({});const tab=tabs.find(t=>t.url===url);if(!tab)throw Error('No matching isolated tab');await chrome.tabs.setZoomSettings(tab.id,{mode:'automatic',scope:'per-tab'});await chrome.tabs.setZoom(tab.id,zoom);return {factor:await chrome.tabs.getZoom(tab.id),settings:await chrome.tabs.getZoomSettings(tab.id)};},{url:page.url(),zoom});
await page.waitForFunction(z=>devicePixelRatio===z,zoom);item.after=await metrics(page);assert.ok(Math.abs(item.zoom.factor-zoom)<1e-12);assert.equal(item.after.width,1280/zoom);assert.equal(item.after.scrollWidth,item.after.width);
item.startImage=await screenshot(page,target.name+'-'+zoom+'-start');
if(target.name==='home'){
await page.getByRole('link',{name:'Start a project',exact:true}).click();assert.match(page.url(),/getting-started/);await sw.evaluate(async({url,zoom})=>{const tabs=await chrome.tabs.query({});const tab=tabs.find(t=>t.url===url);await chrome.tabs.setZoomSettings(tab.id,{mode:'automatic',scope:'per-tab'});await chrome.tabs.setZoom(tab.id,zoom);},{url:page.url(),zoom});await page.waitForFunction(z=>devicePixelRatio===z,zoom);item.task='Opened Start a project, reapplied per-tab zoom after navigation, and inspected tutorial';
} else if(target.name==='pilot'){
await page.getByLabel('Search catalogue',{exact:true}).fill('wood');await page.getByRole('button',{name:'Search',exact:true}).click();assert.equal(await page.locator('#result-status').innerText(),'41 matching instruments');
for(const id of ['500526','500527'])await page.locator(`[data-select="${id}"]`).click();
await page.locator('#comparison-link').click();
const source=page.getByRole('button',{name:'Source for Attribution, Pipe Organ, Met 500527',exact:true});await source.focus();await page.keyboard.press('Enter');
assert.equal(await page.getByRole('dialog').isVisible(),true);item.dialogImage=await screenshot(page,'pilot-'+zoom+'-source');await page.keyboard.press('Escape');assert.equal(await source.evaluate(n=>document.activeElement===n),true);
await page.getByLabel('Observation',{exact:true}).fill('Zoom '+zoom+' comparison retained.');const payload=await download(page,page.getByRole('button',{name:'Export investigation',exact:true}),'pilot-'+zoom+'-export');assert.deepEqual(payload.selectedIds,['500526','500527']);assert.equal(payload.interpretation.observation,'Zoom '+zoom+' comparison retained.');item.task='Searched wood, selected two records, inspected Source by keyboard, closed with Escape/focus return, wrote observation and downloaded matching investigation';
} else if(target.name==='baseline'){
await page.getByRole('combobox',{name:/^Missing metadata/}).selectOption('culture');await page.getByRole('button',{name:'Apply filters',exact:true}).click();assert.equal(await page.locator('#objects > tr').count(),5);const payload=await download(page,page.getByRole('button',{name:'Export results and provenance',exact:true}),'baseline-'+zoom+'-export');assert.equal(payload.records.length,5);item.task='Filtered missing culture and downloaded five matching records';
} else if(target.name==='editor'){
await page.getByRole('button',{name:'Edit record',exact:true}).click();await page.getByLabel('Notes',{exact:true}).fill('Zoom '+zoom+' edited note.');await page.getByRole('button',{name:'Save record',exact:true}).click();const payload=await download(page,page.getByRole('button',{name:'Export collection',exact:true}),'editor-'+zoom+'-export');assert.equal(payload.records.find(r=>r.id==='demo-001').notes,'Zoom '+zoom+' edited note.');item.task='Edited and saved note, then downloaded collection with exact new note';
} else {
const variant=target.name;await page.locator('input[type="search"]').fill('wood');await page.locator('input[type="search"]').press('Enter');
if(variant==='atlas'){for(const id of ['500526','500527'])await page.locator(`[data-select="${id}"]`).click();await page.getByRole('link',{name:/Compare selection/}).click();}
else if(variant==='bench'){await page.getByRole('checkbox',{name:'Compare Ūd, 500526',exact:true}).check();await page.getByRole('checkbox',{name:'Compare Pipe Organ, 500527',exact:true}).check();await page.getByRole('button',{name:/Compare selection/}).click();}
else {await page.getByRole('button',{name:'Add Ūd',exact:true}).click();await page.getByRole('button',{name:'Add Pipe Organ',exact:true}).click();await page.getByRole('link',{name:'Compare evidence',exact:true}).click();await page.getByRole('navigation',{name:'Investigation'}).getByRole('link',{name:'Record observation',exact:true}).click();}
await page.getByLabel(variant==='trail'?'Your observation':'Observation',{exact:true}).fill('Zoom '+zoom+' comparison retained.');const payload=await download(page,page.getByRole('button',{name:/Download/}),variant+'-'+zoom+'-export');assert.deepEqual(payload.selectedIds,['500526','500527']);assert.equal(payload.interpretation.observation,'Zoom '+zoom+' comparison retained.');item.task='Searched wood, selected two records, compared, wrote observation and downloaded matching investigation';
}
item.final=await metrics(page);assert.equal(item.final.scrollWidth,item.final.width);item.finalImage=await screenshot(page,target.name+'-'+zoom+'-final');item.status='passed';
}catch(error){item.status='failed';item.error=String(error);item.failureImage=await screenshot(page,target.name+'-'+zoom+'-failed');console.log(target.name,zoom,item.error);}
await page.close();await writeFile(root+'/results.json',JSON.stringify(result,null,2)+'\n');
}
} finally {await context.close();result.finishedAt=new Date().toISOString();await writeFile(root+'/results.json',JSON.stringify(result,null,2)+'\n');}
console.log(JSON.stringify(result.cases.map(({name,requestedZoom,status,error})=>({name,requestedZoom,status,error}))));



