import {chromium} from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/playwright/index.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const repo='C:/Users/chris/Documents/GitHub/fancy-research-tools';
const root='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/portfolio-edition-ocr';
const json=async path=>JSON.parse(await readFile(`${repo}/${path}`,'utf8'));
const letters=await json('data/hsa-letter/sources.json');
const forecasts=await json('data/nhc-milton/sources.json');
const sample=await json('data/schoenbach/collection.json');
const result=[];
const browser=await chromium.launch({headless:true});
try {
 const context=await browser.newContext();const page=await context.newPage();
 await page.goto('http://127.0.0.1:4173/letters/');
 await page.getByLabel('Research question',{exact:true}).fill('Preserve this question');
 const key='frt.notebook./letters/.hsa-benndorf-1879.v1';
 const before=await page.evaluate(key=>localStorage.getItem(key),key);
 const base={schemaVersion:1,caseId:'hsa-benndorf-1879',researchQuestion:'Replace question',annotations:[],sources:letters};
 for(const [name,data] of [['other-case',{...base,caseId:'nhc-milton-2024',sources:forecasts}],['forged-editor',{...base,sources:[{...letters[0],editor:'A fabricated source editor'}]}],['other-source-under-valid-case',{...base,sources:forecasts.slice(0,1)}]]) {
  await page.getByLabel('Open notebook').setInputFiles({name:`${name}.json`,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  const message=await page.locator('#notebook-status').innerText();
  assert.match(message,/Notebook not opened/);
  assert.equal(await page.getByLabel('Research question',{exact:true}).inputValue(),'Preserve this question');
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),before);
  result.push({name,message,unchanged:true});
 }
 await page.goto('http://127.0.0.1:4173/tool/');
 assert.equal(await page.locator('#source-evidence').isVisible(),true);
 const imported={...sample,records:[{...sample.records[0],title:'An unrelated imported record',source:'Custom independent source'}]};
 page.once('dialog',dialog=>dialog.accept());
 await page.getByLabel('Import collection (JSON, up to 1 MiB)').setInputFiles({name:'unrelated.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(imported))});
 assert.equal(await page.locator('#source-evidence').isVisible(),false);
 assert.match(await page.locator('#record-content').innerText(),/Custom independent source/);
 result.push({name:'imported-same-id-different-source',hiddenOriginalEvidence:true});
 await writeFile(`${root}/independent-review.json`,JSON.stringify(result,null,2));
} finally {await browser.close();}
