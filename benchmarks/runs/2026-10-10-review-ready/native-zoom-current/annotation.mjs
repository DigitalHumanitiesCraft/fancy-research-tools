import {writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const {chromium}=await import('file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/@playwright/test/index.mjs');
const root='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/native-zoom-review-ready';
const base='http://127.0.0.1:4173';
const results={startedAt:new Date().toISOString(),method:'Native Chromium tab zoom via chrome.tabs.setZoom in automatic/per-tab mode. 1280x900 physical browser viewport, 640x450 CSS pixels at 200%, 320x225 at 400%. Captures use chrome.tabs.captureVisibleTab. Fresh isolated profile per zoom factor; no user profile accessed.',cases:[],resources:{}};
for(const factor of [2,4]){
 const context=await chromium.launchPersistentContext(root+'/annotation-profile-'+factor,{channel:'chromium',headless:true,viewport:{width:1280,height:900},acceptDownloads:true,args:[`--disable-extensions-except=${root}/extension`,`--load-extension=${root}/extension`]});
 const item={name:'annotation',route:'/annotations/',factor};results.cases.push(item);const reads=[];
 try{
 results.browser=context.browser().version();
 const sw=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 const page=await context.newPage();page.setDefaultTimeout(15000);
 page.on('response',response=>{if(response.url().startsWith(base)&&response.status()===200)reads.push(response.body().then(data=>{results.resources[response.url()]={sha256:createHash('sha256').update(data).digest('hex'),bytes:data.length};}).catch(()=>{}));});
 const zoom=async()=>{const state=await sw.evaluate(async({url,factor})=>{const tab=(await chrome.tabs.query({})).find(t=>t.url===url);if(!tab)throw Error('No isolated target tab');await chrome.tabs.setZoomSettings(tab.id,{mode:'automatic',scope:'per-tab'});await chrome.tabs.setZoom(tab.id,factor);return{factor:await chrome.tabs.getZoom(tab.id),settings:await chrome.tabs.getZoomSettings(tab.id)};},{url:page.url(),factor});await page.waitForFunction(value=>Math.abs(devicePixelRatio-value)<1e-9,factor);assert.ok(Math.abs(state.factor-factor)<1e-9);return state;};
 const metrics=async()=>page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,visualScale:visualViewport.scale,scrollWidth:document.documentElement.scrollWidth}));
 const capture=async(name)=>{for(let attempt=0;attempt<3;attempt++){try{await sw.evaluate(async url=>{const tab=(await chrome.tabs.query({})).find(t=>t.url===url);await chrome.tabs.update(tab.id,{active:true});},page.url());await new Promise(resolve=>setTimeout(resolve,600));const data=await sw.evaluate(async url=>{const tab=(await chrome.tabs.query({})).find(t=>t.url===url);return chrome.tabs.captureVisibleTab(tab.windowId,{format:'png'});},page.url());await writeFile(root+'/'+name+'.png',Buffer.from(data.split(',')[1],'base64'));return name+'.png';}catch(error){if(attempt===2||!String(error).includes('image readback failed'))throw error;}}};
 item.captures=[];
 try{
 await page.goto(base+'/annotations/');
 item.initialLocalKeys=await page.evaluate(()=>Object.keys(localStorage));
 assert.equal(item.initialLocalKeys.length,0,'Use a fresh isolated test profile');
 item.zoom=await zoom();item.metrics=await metrics();assert.equal(item.metrics.width,1280/factor);assert.equal(item.metrics.scrollWidth,item.metrics.width);assert.equal(item.metrics.visualScale,1);
 item.captures.push(await capture('annotation-'+factor+'-start'));
 const source=page.getByLabel('Original bulletin text',{exact:true});
 const sourceText=await source.inputValue();item.sourceTitle=await page.locator('#bulletin option:checked').textContent();item.sourceAttribution={issued:await page.locator('#issued').textContent(),forecaster:await page.locator('#forecaster').textContent(),url:await page.locator('#source-link').getAttribute('href')};
 await source.focus();await page.keyboard.press('Control+End');
 item.endReading=await source.evaluate(node=>({caret:node.selectionEnd,length:node.value.length,scrollTop:node.scrollTop,scrollHeight:node.scrollHeight,clientHeight:node.clientHeight}));assert.equal(item.endReading.caret,item.endReading.length);assert.ok(item.endReading.scrollTop>0);
 item.captures.push(await capture('annotation-'+factor+'-source-end'));
 await page.keyboard.press('Control+Home');
 for(let i=0;i<168;i++)await page.keyboard.press('ArrowRight');
 for(let i=0;i<141;i++)await page.keyboard.press('Shift+ArrowRight');
 item.selection=await source.evaluate(node=>({start:node.selectionStart,end:node.selectionEnd,text:node.value.slice(node.selectionStart,node.selectionEnd),scrollTop:node.scrollTop}));assert.equal(item.selection.start,168);assert.equal(item.selection.end,309);assert.equal(item.selection.text,sourceText.slice(168,309));
 item.captures.push(await capture('annotation-'+factor+'-source-selection'));
 await page.getByRole('button',{name:'Annotate selection',exact:true}).click();
 assert.equal(await page.locator('#quotation').textContent(),item.selection.text);
 await page.getByLabel('Research question',{exact:true}).fill('Can the selected historical source span be preserved exactly?');
 await page.getByLabel('Category',{exact:true}).selectOption('observation');
 const note='Engineering check: this source span remains exact.';
 await page.getByLabel('Interpretation',{exact:true}).fill(note);
 await page.getByLabel('Creator kind',{exact:true}).selectOption('agent');await page.getByLabel('Creator name',{exact:true}).fill('Engineering review agent');
 await page.getByLabel('Record a source-fit review',{exact:true}).check();
 await page.getByLabel('Reviewer kind',{exact:true}).selectOption('agent');await page.getByLabel('Reviewer name',{exact:true}).fill('Engineering reviewer');
 await page.getByLabel('Review criterion',{exact:true}).fill('Exported quotation equals the selected source span.');
 await page.getByLabel('Does the quotation support this interpretation?',{exact:true}).selectOption('supports');
 await page.getByRole('button',{name:'Save annotation',exact:true}).focus();item.captures.push(await capture('annotation-'+factor+'-review-form'));await page.keyboard.press('Enter');
 assert.equal(await page.locator('#annotations > li').count(),1);assert.equal(await page.locator('#annotation-form').isVisible(),false);
 await page.getByRole('button',{name:'Return to quotation',exact:true}).focus();item.captures.push(await capture('annotation-'+factor+'-saved-review'));await page.keyboard.press('Enter');
 item.returnedSelection=await source.evaluate(node=>({focused:document.activeElement===node,start:node.selectionStart,end:node.selectionEnd,text:node.value.slice(node.selectionStart,node.selectionEnd),scrollTop:node.scrollTop}));assert.equal(item.returnedSelection.focused,true);assert.equal(item.returnedSelection.start,168);assert.equal(item.returnedSelection.end,309);assert.equal(item.returnedSelection.text,item.selection.text);item.captures.push(await capture('annotation-'+factor+'-returned-quotation'));
 await page.getByRole('button',{name:'Export notebook',exact:true}).focus();
 const downloadPromise=page.waitForEvent('download');await page.keyboard.press('Enter');const download=await downloadPromise;const path=root+'/annotation-'+factor+'-notebook.json';await download.saveAs(path);item.download=path.split('/').at(-1);item.downloadName=download.suggestedFilename();
 const bytes=await readFile(path);item.exportHash=createHash('sha256').update(bytes).digest('hex');const notebook=JSON.parse(bytes.toString('utf8'));assert.equal(notebook.annotations.length,1);const annotation=notebook.annotations[0];assert.equal(annotation.start,168);assert.equal(annotation.end,309);assert.equal(annotation.quote,item.selection.text);assert.equal(annotation.note,note);assert.deepEqual(annotation.creator,{kind:'agent',name:'Engineering review agent'});assert.deepEqual(annotation.review,{reviewer:{kind:'agent',name:'Engineering reviewer'},criterion:'Exported quotation equals the selected source span.',result:'supports'});const savedSource=notebook.sources.find(s=>s.id===annotation.sourceId);assert.equal(savedSource.text,sourceText);assert.equal(savedSource.text.slice(annotation.start,annotation.end),annotation.quote);item.exportSummary={annotations:notebook.annotations.length,sourceId:annotation.sourceId,sourceTextSha256:savedSource.textSha256,review:annotation.review,creator:annotation.creator};
 await page.reload();await zoom();assert.equal(await page.locator('#annotations > li').count(),1);assert.equal(await page.locator('#annotations blockquote').textContent(),item.selection.text);item.restoredAfterReload=true;
 await page.getByRole('button',{name:'Edit',exact:true}).click();await page.getByLabel('Interpretation',{exact:true}).fill(note+' Changed.');assert.equal(await page.getByLabel('Record a source-fit review',{exact:true}).isChecked(),false);await page.getByLabel('Interpretation',{exact:true}).fill(note);assert.equal(await page.getByLabel('Record a source-fit review',{exact:true}).isChecked(),true);await page.getByRole('button',{name:'Save annotation',exact:true}).click();assert.match(await page.locator('#annotations').textContent(),/Source-fit review: Supports/);item.finalNoopEditPreservesReview=true;
 await page.locator('#notebook-files').scrollIntoViewIfNeeded();item.captures.push(await capture('annotation-'+factor+'-notebook-controls'));item.final=await metrics();assert.equal(item.final.scrollWidth,item.final.width);item.status='passed';
 }catch(error){item.status='failed';item.error=String(error);try{item.failureCapture=await capture('annotation-'+factor+'-failed');}catch(captureError){item.captureError=String(captureError);}console.log(factor,item.error);}
 await Promise.allSettled(reads);await page.close();
 }finally{await context.close();await writeFile(root+'/annotation-results.json',JSON.stringify(results,null,2)+'\n');}
}
results.finishedAt=new Date().toISOString();await writeFile(root+'/annotation-results.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results.cases.map(({name,factor,status,error})=>({name,factor,status,error}))));
