import { chromium } from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/playwright/index.mjs';
import AxeBuilder from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/@axe-core/playwright/dist/index.mjs';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const results = [];
for (const route of ['annotations','letters']) {
  for (const width of [320,1280]) {
    const context = await browser.newContext({viewport:{width,height:800}});
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4189/${route}/`);
    await page.getByRole('button',{name:'Annotate selection',exact:true}).click();
    if (!await page.locator('#bulletin-text').evaluate(n=>n===document.activeElement)) throw Error('Missing source focus');
    await page.keyboard.press('Control+Home');
    await page.keyboard.press('Home');
    await page.keyboard.down('Shift');
    for (let i=0;i<50;i++) await page.keyboard.press('ArrowRight');
    await page.keyboard.up('Shift');
    const quote = await page.locator('#bulletin-text').evaluate(n=>n.value.slice(n.selectionStart,n.selectionEnd));
    await page.getByRole('button',{name:'Annotate selection',exact:true}).click();
    if (await page.locator('#quotation').textContent()!==quote) throw Error('Quotation changed');
    await page.getByLabel('Record a source-fit review',{exact:true}).check();
    for (const size of ['100%','200%']) {
      await page.evaluate(size=>document.documentElement.style.fontSize=size,size);
      for (const font of ['system-ui','Arial','Verdana','Georgia','monospace']) {
        await page.evaluate(font=>document.body.style.fontFamily=font,font);
        const dims = await page.evaluate(()=>({view:innerWidth,document:document.documentElement.scrollWidth,oversize:[...document.querySelectorAll('h1,h2,label,legend,button,p,pre')].filter(n=>n.getClientRects().length && n.scrollWidth>n.clientWidth+1).map(n=>({tag:n.tagName,id:n.id,scroll:n.scrollWidth,client:n.clientWidth}))}));
        if (dims.document>dims.view || dims.oversize.length) throw Error(JSON.stringify({route,width,size,font,dims}));
        results.push({route,width,size,font,...dims});
      }
    }
    await page.evaluate(()=>document.body.style.fontFamily='system-ui');
    const violations=(await new AxeBuilder({page}).analyze()).violations;
    if (violations.length) throw Error(JSON.stringify(violations));
    if (width===320 && route==='annotations') {
      await page.locator('#annotation-form').screenshot({path:new URL('form-320-200.png',import.meta.url).pathname.replace(/^\/(\w:)/,'$1')});
    }
    await page.getByRole('button',{name:'Cancel',exact:true}).click();
    if (!await page.getByRole('button',{name:'Annotate selection',exact:true}).evaluate(n=>n===document.activeElement)) throw Error('Cancel did not restore focus');
    await context.close();
  }
}
await browser.close();
await writeFile(new URL('verification.json',import.meta.url),JSON.stringify({results,checks:'Keyboard source selection retained exact quotation, review fields opened, no axe violations, Cancel restored focus in each of 4 route/viewport combinations.'},null,2));
console.log(`Passed ${results.length} route/viewport/font/size combinations; keyboard selection, review fields, axe and Cancel passed for both routes at both widths.`);
