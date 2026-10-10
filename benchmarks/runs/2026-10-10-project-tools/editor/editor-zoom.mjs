import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chromium } from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/playwright/index.mjs';
const root = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/portfolio-vetmed';
const extension = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/native-zoom/extension';
const base = 'http://127.0.0.1:4189';
const results = { method: 'Native Chromium zoom through chrome.tabs.setZoom, automatic/per-tab. Physical viewport 1280x900; 640 CSS px at200%, 320 CSS px at400%. Isolated local profile; source server is Vite dev4189.', startedAt: new Date().toISOString(), cases: [], resources: {} };
const context = await chromium.launchPersistentContext(root + '/editor-zoom-profile', {
  channel: 'chromium', headless: true, viewport: { width: 1280, height: 900 }, acceptDownloads: true,
  args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
});
const sw = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
const metrics = page => page.evaluate(() => ({ width: innerWidth, height: innerHeight, dpr: devicePixelRatio, scrollWidth: document.documentElement.scrollWidth }));
const capture = async (page, name) => {
  for (let attempt=0; attempt<3; attempt++) {
    try {
      await sw.evaluate(async url => { const tab = (await chrome.tabs.query({})).find(tab => tab.url === url); await chrome.tabs.update(tab.id, {active:true}); }, page.url());
      await new Promise(resolve => setTimeout(resolve, 650));
      const data = await sw.evaluate(async url => { const tab = (await chrome.tabs.query({})).find(tab => tab.url === url); return chrome.tabs.captureVisibleTab(tab.windowId, {format:'png'}); }, page.url());
      await writeFile(`${root}/${name}.png`, Buffer.from(data.split(',')[1], 'base64'));
      return;
    } catch(error) { if(attempt===2 || !String(error).includes('image readback failed')) throw error; }
  }
};
try {
  for (const factor of [2, 4]) {
    const page = await context.newPage();
    const reads = [];
    page.on('response', response => { if(response.url().startsWith(base) && response.status() === 200) reads.push(response.body().then(data => {results.resources[response.url()] = {sha256:createHash('sha256').update(data).digest('hex'),bytes:data.length};}).catch(()=>{})); });
    const item = { factor };
    results.cases.push(item);
    try {
      await page.goto(base + '/tool/');
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      item.zoom = await sw.evaluate(async ({url,factor}) => {
        const tab = (await chrome.tabs.query({})).find(tab => tab.url === url);
        await chrome.tabs.setZoomSettings(tab.id,{mode:'automatic',scope:'per-tab'});
        await chrome.tabs.setZoom(tab.id,factor);
        return { factor: await chrome.tabs.getZoom(tab.id), settings: await chrome.tabs.getZoomSettings(tab.id) };
      }, {url:page.url(),factor});
      await page.waitForFunction(factor => devicePixelRatio === factor, factor);
      item.initial = await metrics(page);
      assert.equal(item.initial.width, 1280/factor);
      assert.equal(item.initial.scrollWidth,item.initial.width);
      await capture(page,`editor-zoom-${factor}-start`);
      await page.getByRole('button',{name:'Edit record',exact:true}).focus();
      await page.keyboard.press('Enter');
      await page.getByLabel('Notes',{exact:true}).fill(`Native zoom ${factor} retained note.`);
      await page.getByRole('button',{name:'Save record',exact:true}).focus();
      await capture(page,`editor-zoom-${factor}-editing`);
      await page.keyboard.press('Enter');
      assert.match(await page.locator('#record-content').innerText(),/retained note/);
      assert.match(await page.locator('#source-evidence').innerText(),/Habrovany/);
      item.final = await metrics(page);
      assert.equal(item.final.scrollWidth,item.final.width);
      await page.getByRole('button',{name:'Export collection',exact:true}).focus();
      const wait = page.waitForEvent('download');
      await page.keyboard.press('Enter');
      const download = await wait;
      const path = `${root}/editor-zoom-${factor}-export.json`;
      await download.saveAs(path);
      const payload = JSON.parse(await readFile(path,'utf8'));
      assert.equal(payload.records[0].id,'schoenbach-001');
      assert.equal(payload.records[0].notes,`Native zoom ${factor} retained note.`);
      assert.equal(payload.records[0].place,'Habrovany');
      assert.equal(payload.records.length,5);
      await capture(page,`editor-zoom-${factor}-exported`);
      item.task = 'Keyboard entered editor, saved note, original source values remained, actual JSON export preserved five records and exact note.';
      item.status = 'passed';
    } catch (error) { item.status = 'failed'; item.error = String(error); }
    await Promise.allSettled(reads);
    await page.close();
  }
} finally { await context.close(); results.finishedAt = new Date().toISOString(); await writeFile(root+'/editor-zoom-results.json',JSON.stringify(results,null,2)); }
console.log(JSON.stringify(results.cases,null,2));
