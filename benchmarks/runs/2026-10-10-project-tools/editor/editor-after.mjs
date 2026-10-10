import { chromium } from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/playwright/index.mjs';
import AxeBuilder from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/@axe-core/playwright/dist/index.mjs';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
const page = await context.newPage();
const out = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/portfolio-vetmed';
const observations = [];
await page.goto('http://127.0.0.1:4189/tool/');
for (const width of [1366, 320]) {
  await page.setViewportSize({ width, height: 768 });
  await page.screenshot({ path: `${out}/editor-after-${width}.png`, fullPage: true });
  observations.push({ width, state: 'reading', overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), axe: (await new AxeBuilder({page}).analyze()).violations });
}
await page.setViewportSize({ width: 1366, height: 768 });
await page.getByRole('button', { name: 'Edit record', exact: true }).click();
for (const width of [1366, 320]) {
  await page.setViewportSize({ width, height: 768 });
  await page.screenshot({ path: `${out}/editor-edit-${width}.png`, fullPage: true });
  observations.push({ width, state: 'editing', overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), axe: (await new AxeBuilder({page}).analyze()).violations });
}
await writeFile(`${out}/editor-after-observations.json`, JSON.stringify(observations, null, 2));
await browser.close();
console.log(JSON.stringify(observations.map(({width,state,overflow,axe})=>({width,state,overflow,violations:axe.length}))));
