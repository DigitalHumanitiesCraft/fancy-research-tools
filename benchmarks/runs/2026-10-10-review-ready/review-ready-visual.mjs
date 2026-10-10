import { chromium } from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const out = new URL('./review-ready-visual/', import.meta.url);
await mkdir(out, {recursive:true});
const browser = await chromium.launch();
const results = [];
for (const [name, route] of [['overview','/'],['gallery','/tools/'],['documentation','/reference/testing.html'],['annotations','/annotations/']]) {
  const context = await browser.newContext({viewport:{width:1440,height:1000}});
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4173${route}`);
  await page.locator('main').waitFor();
  await page.screenshot({path:new URL(`${name}-desktop.png`,out).pathname.slice(1)});
  await page.setViewportSize({width:320,height:800});
  await page.screenshot({path:new URL(`${name}-narrow.png`,out).pathname.slice(1)});
  results.push({route,title:await page.title(),narrowOverflow:await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth)});
  await context.close();
}
await browser.close();
await writeFile(new URL('results.json',out),JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
