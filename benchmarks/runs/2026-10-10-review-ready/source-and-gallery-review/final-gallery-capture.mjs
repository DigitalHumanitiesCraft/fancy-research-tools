import { chromium } from 'file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const destination = 'C:/Users/chris/Documents/GitHub/fancy-research-tools/public/previews';
await mkdir(destination, { recursive: true });
const browser = await chromium.launch();
const entries = [
  ['/pilot/', 'instrument-study'],
  ['/tool/', 'record-desk'],
  ['/concepts/atlas/', 'collection-atlas'],
  ['/concepts/bench/', 'instrument-comparison-desk'],
  ['/concepts/trail/', 'instrument-inquiry'],
  ['/baseline/', 'catalogue-baseline'],
];
const observations = [];
try {
  for (const [route, name] of entries) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4173${route}`);
    await page.locator('main').waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (route === '/tool/') {
      await page.getByRole('button', { name: /Notizbuch mit Randbemerkungen/ }).click();
      await page.getByRole('button', { name: 'Edit record' }).click();
    }
    if (route === '/concepts/bench/') {
      await page.getByRole('checkbox', { name: 'Compare Ūd, 500526', exact: true }).check();
      await page.getByRole('checkbox', { name: 'Compare Pipe Organ, 500527', exact: true }).check();
      await page.getByRole('button', { name: /Compare selection/ }).click();
    }
    if (route === '/concepts/atlas/') {
      await page.getByRole('button', { name: 'Select Ūd', exact: true }).click();
      await page.getByRole('button', { name: 'Select Pipe Organ', exact: true }).click();
    }
    observations.push({ route, title: await page.title(), headings: await page.locator('h1').allTextContents(), buttons: await page.getByRole('button').allTextContents() });
    await page.screenshot({ path: `${destination}/${name}.png` });
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/annotations/');
  await page.locator('#bulletin-text').waitFor();
  await page.locator('#bulletin-text').evaluate((node) => { node.focus(); node.setSelectionRange(672, 781); });
  await page.getByRole('button', {name: 'Annotate selection', exact: true}).click();
  await page.getByLabel('Category', {exact: true}).selectOption('uncertainty');
  await page.getByLabel('Interpretation', {exact: true}).fill('Preview example: the forecaster explicitly qualifies the motion estimate.');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#bulletin-text').evaluate((node) => { node.scrollTop = 0; });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({path: `${destination}/forecast-reading.png`});
  observations.push({route: '/annotations/', origin: 'http://127.0.0.1:4173', title: await page.title(), state: 'Unsaved illustrative annotation; creator unknown; no review; exact source span672:781; category uncertainty'});
  await context.close();
} finally {
  await browser.close();
}
await writeFile(new URL('final-gallery-captures.json', import.meta.url), JSON.stringify(observations, null, 2) + '\n');
console.log(JSON.stringify(observations, null, 2));

