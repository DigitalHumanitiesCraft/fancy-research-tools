import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const {chromium}=await import('file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/@playwright/test/index.mjs');
const root='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/native-zoom-review-ready';
const base='http://127.0.0.1:4173';
const results={startedAt:new Date().toISOString(),method:'Native Chromium tab zoom via chrome.tabs.setZoom in automatic/per-tab mode. 1280x900 physical browser viewport, 640x450 CSS pixels at200%,320x225 at400%. Native captures use chrome.tabs.captureVisibleTab.',cases:[],resources:{}};
const context=await chromium.launchPersistentContext(root+'/routes-profile',{channel:'chromium',headless:true,viewport:{width:1280,height:900},args:[`--disable-extensions-except=${root}/extension`,`--load-extension=${root}/extension`]});
try{
results.browser=context.browser().version();
const sw=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
const zoom=async(page,factor)=>{const state=await sw.evaluate(async({url,factor})=>{const tab=(await chrome.tabs.query({})).find(t=>t.url===url);if(!tab)throw Error('No isolated target tab');await chrome.tabs.setZoomSettings(tab.id,{mode:'automatic',scope:'per-tab'});await chrome.tabs.setZoom(tab.id,factor);return{factor:await chrome.tabs.getZoom(tab.id),settings:await chrome.tabs.getZoomSettings(tab.id)};},{url:page.url(),factor});await page.waitForFunction(value=>Math.abs(devicePixelRatio-value)<1e-9,factor);assert.ok(Math.abs(state.factor-factor)<1e-9);return state;};
const metrics=async page=>page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,visualScale:visualViewport.scale,scrollWidth:document.documentElement.scrollWidth}));
const capture=async(page,name)=>{for(let attempt=0;attempt<3;attempt++){try{await sw.evaluate(async url=>{const tab=(await chrome.tabs.query({})).find(t=>t.url===url);await chrome.tabs.update(tab.id,{active:true});},page.url());await new Promise(resolve=>setTimeout(resolve,600));const data=await sw.evaluate(async url=>{const tab=(await chrome.tabs.query({})).find(t=>t.url===url);return chrome.tabs.captureVisibleTab(tab.windowId,{format:'png'});},page.url());await writeFile(root+'/'+name+'.png',Buffer.from(data.split(',')[1],'base64'));return name+'.png';}catch(error){if(attempt===2||!String(error).includes('image readback failed'))throw error;}}};
for(const factor of (process.env.FRT_ZOOM_FACTOR?[Number(process.env.FRT_ZOOM_FACTOR)]:[2,4]))for(const target of [{name:'overview',route:'/'},{name:'documentation',route:'/guides/getting-started.html'},{name:'gallery',route:'/tools/'}].filter(target=>!process.env.FRT_ZOOM_ROUTE||target.name===process.env.FRT_ZOOM_ROUTE)){
const page=await context.newPage();page.setDefaultTimeout(15000);const item={...target,factor};results.cases.push(item);const reads=[];
page.on('response',response=>{if(response.url().startsWith(base)&&response.status()===200)reads.push(response.body().then(data=>{results.resources[response.url()]={sha256:createHash('sha256').update(data).digest('hex'),bytes:data.length};}).catch(()=>{}));});
try{
await page.goto(base+target.route);item.zoom=await zoom(page,factor);item.metrics=await metrics(page);assert.equal(item.metrics.width,1280/factor);assert.equal(item.metrics.scrollWidth,item.metrics.width);item.start=await capture(page,target.name+'-'+factor+'-start');
if(target.name==='overview'){
const entry=page.getByRole('link',{name:'Open the tool gallery',exact:true});await entry.focus();await page.keyboard.press('Enter');await page.waitForURL(/\/tools\/$/);await zoom(page,factor);assert.equal(await page.getByRole('heading',{name:'Tools',exact:true,level:1}).count(),1);item.action='Keyboard opened gallery from overview';
}else if(target.name==='documentation'){
item.contentOrder=await page.evaluate(()=>{const main=document.querySelector('main');const navigation=document.querySelector('.docs-nav');return{mainTop:main.getBoundingClientRect().top,navigationTop:navigation.getBoundingClientRect().top};});assert.ok(item.contentOrder.mainTop<item.contentOrder.navigationTop);
const section=page.getByRole('link',{name:'Annotate an archived discussion',exact:true});await section.focus();await page.keyboard.press('Enter');assert.match(page.url(),/#annotate-an-archived-discussion$/);item.section=await capture(page,'documentation-'+factor+'-annotation-guide');
const link=page.getByRole('link',{name:'Forecast reading',exact:true});assert.equal(await link.isVisible(),true);item.action='Article precedes documentation navigation; keyboard section link reaches archived-discussion instructions';
}else{
item.tools=await page.locator('.open-tool').evaluateAll(nodes=>nodes.map(node=>({label:node.getAttribute('aria-label'),href:node.getAttribute('href')})));assert.equal(item.tools.length,7);
const paragraph=page.locator('.tool-card p').first();await paragraph.scrollIntoViewIfNeeded();const position=await paragraph.boundingBox();assert.ok(position);const lineHeight=await paragraph.evaluate(node=>parseFloat(getComputedStyle(node).lineHeight));await page.mouse.move(position.x+1,position.y+lineHeight/2);await page.mouse.down();await page.mouse.move(position.x+Math.min(120,position.width-4),position.y+lineHeight/2,{steps:12});await page.mouse.up();item.selectedDescription=await page.evaluate(()=>getSelection().toString());assert.ok(item.selectedDescription.trim().length>3);assert.equal(page.url(),base+'/tools/');item.selection=await capture(page,'gallery-'+factor+'-selected-description');
const open=page.getByRole('link',{name:'Open Forecast reading',exact:true});await open.focus();await page.keyboard.press('Enter');await page.waitForURL(/\/annotations\/$/);await zoom(page,factor);assert.equal(await page.getByRole('heading',{name:'Forecast reading',exact:true}).count(),1);item.action='Seven explicit tool links; pointer-selected card description without navigation; keyboard opened Forecast reading';
}
item.final=await metrics(page);assert.equal(item.final.width,1280/factor);assert.equal(item.final.scrollWidth,item.final.width);item.finalCapture=await capture(page,target.name+'-'+factor+'-final');item.status='passed';
}catch(error){item.status='failed';item.error=String(error);item.failureCapture=await capture(page,target.name+'-'+factor+'-failed');console.log(item.name,factor,item.error);}
await Promise.allSettled(reads);await page.close();await writeFile(root+'/routes-results.json',JSON.stringify(results,null,2)+'\n');
}
}finally{await context.close();results.finishedAt=new Date().toISOString();await writeFile(root+'/routes-results.json',JSON.stringify(results,null,2)+'\n');}
console.log(JSON.stringify(results.cases.map(({name,factor,status,error})=>({name,factor,status,error}))));
