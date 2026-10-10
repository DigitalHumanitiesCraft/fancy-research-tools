import { chromium } from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/playwright/index.mjs';
import AxeBuilder from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/@axe-core/playwright/dist/index.mjs';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
const observations = [];
try {
  const context = await browser.newContext({viewport:{width:1440,height:900}});
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4187/tools/');
  for (const image of await page.locator('.tool-card img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((node) => node.decode());
  }
  await page.evaluate(() => window.scrollTo(0,0));
  assert.equal(await page.locator('.tool-card').count(), 7);
  assert.equal(await page.locator('.tool-card .open-tool').count(), 7);
  assert.equal(await page.locator('.tool-card > a img').count(), 0);
  const axe = await new AxeBuilder({page}).analyze();
  observations.push({name:'desktop axe', violations:axe.violations});
  assert.equal(axe.violations.length,0);
  await page.screenshot({path:new URL('gallery-desktop.png',import.meta.url).pathname.slice(1),fullPage:true});
  const para = page.locator('.tool-card > p').first();
  const box = await para.boundingBox();
  assert.ok(box);
  const url = page.url();
  await page.mouse.move(box.x+3,box.y+10);
  await page.mouse.down();
  await page.mouse.move(box.x+170,box.y+10,{steps:20});
  await page.mouse.up();
  const selection = await page.evaluate(() => window.getSelection()?.toString());
  assert.ok(selection?.length);
  assert.equal(page.url(),url);
  observations.push({name:'native pointer text selection',selection,navigationUnchanged:true});
  await page.getByRole('link',{name:'Open Instrument study',exact:true}).focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  const focus = await page.getByRole('link',{name:'Open Instrument study',exact:true}).evaluate((node) => ({width:getComputedStyle(node).outlineWidth,style:getComputedStyle(node).outlineStyle}));
  assert.notEqual(focus.style,'none');
  observations.push({name:'explicit link keyboard focus',...focus});
  for (const [name,width,height,textSize] of [['narrow',320,800,null],['double-text',1440,900,'200%']]) {
    await page.setViewportSize({width,height});
    await page.evaluate((value) => {document.documentElement.style.fontSize=value??'';window.scrollTo(0,0);},textSize);
    const layout = await page.evaluate(() => ({viewport:innerWidth,width:document.documentElement.scrollWidth,links:[...document.querySelectorAll('.open-tool')].map((node)=>({w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height}))}));
    assert.ok(layout.width<=layout.viewport);
    assert.ok(layout.links.every((link)=>link.h>=44));
    observations.push({name,...layout});
    await page.screenshot({path:new URL(`gallery-${name}.png`,import.meta.url).pathname.slice(1),fullPage:true});
  }
  await context.close();
} finally {await browser.close();}
await writeFile(new URL('gallery-check-results.json',import.meta.url),JSON.stringify(observations,null,2)+'\n');
console.log(JSON.stringify(observations,null,2));
