import { chromium } from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/playwright/index.mjs';
import { writeFile, mkdir } from 'node:fs/promises';

const out = new URL('./', import.meta.url);
await mkdir(out, {recursive:true});
const browser = await chromium.launch();
const results = [];
for (const font of ['system-ui','Arial','Verdana','Georgia','monospace']) {
  const page = await browser.newPage({viewport:{width:320,height:800}});
  await page.goto('http://127.0.0.1:4189/annotations/');
  const source = page.locator('#bulletin-text');
  await source.focus();
  await source.evaluate(node => {
    const quote = 'Scatterometer data around midday confirmed';
    const start = node.value.indexOf(quote);
    node.setSelectionRange(start,start+quote.length);
    node.dispatchEvent(new Event('select'));
  });
  await page.getByRole('button',{name:'Annotate selection',exact:true}).click();
  await page.getByLabel('Record a source-fit review',{exact:true}).check();
  await page.evaluate(font => {
    document.body.style.fontFamily = font;
    document.documentElement.style.fontSize = '200%';
  },font);
  const result = await page.evaluate(() => {
    const overflowing = [...document.querySelectorAll('body *')].filter(n=>n instanceof HTMLElement && n.getClientRects().length).map(n=>{
      const box = n.getBoundingClientRect();
      return {tag:n.tagName,id:n.id,class:n.className,text:n.textContent?.trim().slice(0,85),left:box.left,right:box.right,width:box.width,scroll:n.scrollWidth,client:n.clientWidth,font:getComputedStyle(n).font};
    }).filter(n=>n.right>innerWidth+0.5 || n.left<0 || (n.scroll>n.client+1 && n.tag!=='TEXTAREA' && n.tag!=='SELECT'));
    return {viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,overflowing};
  });
  results.push({font,...result});
  await page.screenshot({path:new URL(`font-${font}.png`,out).pathname.replace(/^\/(\w:)/,'$1'),fullPage:true});
  await page.close();
}
await browser.close();
await writeFile(new URL(process.argv[2] || 'results.json',out),JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
