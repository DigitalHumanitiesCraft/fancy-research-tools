import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const root = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const evidence = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/repository-audit-evidence';
const require = createRequire(join(root, 'package.json'));
const { chromium, expect } = require('@playwright/test');
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const resources = new Set();
page.on('response', response => {
  if (response.url().startsWith('http://127.0.0.1:4173/')) resources.add(response.url());
});
try {
  await page.goto('http://127.0.0.1:4173/');
  await page.screenshot({ path: join(evidence, 'final-home-desktop.png'), fullPage: true });
  await page.getByRole('main').getByRole('link', { name: 'Open Instrument study', exact: true }).click();
  const originalPath = join(root, 'benchmarks/runs/2026-10-10-project-decisions/export-v2.json');
  const originalBytes = await readFile(originalPath, 'utf8');
  const original = JSON.parse(originalBytes);
  page.once('dialog', dialog => dialog.accept());
  await page.getByLabel('Open investigation').setInputFiles(originalPath);
  await expect(page.locator('#draft-status')).toHaveText('Saved locally');
  await page.locator('#comparison-link').click();
  await expect(page.getByRole('heading', { name: 'Comparison', exact: true })).toBeFocused();
  const key = 'frt.investigation.frt-instrument-study-v1.v1';
  assert.equal(await page.evaluate(key => localStorage.getItem(key), key), originalBytes);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export investigation' }).click();
  const downloaded = await download;
  const exportedPath = join(evidence, 'reopened-existing-v2.json');
  await downloaded.saveAs(exportedPath);
  assert.deepEqual(JSON.parse(await readFile(exportedPath, 'utf8')), original);
  await page.screenshot({ path: join(evidence, 'final-comparison-desktop.png'), fullPage: true });
  await page.getByLabel('Observation', { exact: true }).fill('Local text retained after an external change');
  await expect(page.locator('#draft-status')).toHaveText('Saved locally');
  const second = await context.newPage();
  await second.goto('http://127.0.0.1:4173/');
  const external = JSON.stringify({ ...original, researchQuestion: 'Another tab owns this stored copy' });
  await second.evaluate(({ key, external }) => localStorage.setItem(key, external), { key, external });
  await expect(page.locator('#draft-status')).toContainText('Another tab changed');
  let unloadType;
  page.once('dialog', async dialog => { unloadType = dialog.type(); await dialog.dismiss(); });
  await page.goto('http://127.0.0.1:4173/').catch(error => {
    assert.match(error.message, /ERR_ABORTED/);
  });
  assert.equal(unloadType, 'beforeunload');
  await expect(page.getByLabel('Observation', { exact: true })).toHaveValue('Local text retained after an external change');
  assert.equal(await page.evaluate(key => localStorage.getItem(key), key), external);
  const recoveryDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export investigation' }).click();
  await (await recoveryDownload).saveAs(join(evidence, 'conflict-local-export.json'));
  const recovery = JSON.parse(await readFile(join(evidence, 'conflict-local-export.json'), 'utf8'));
  assert.equal(recovery.interpretation.observation, 'Local text retained after an external change');
  const served = [];
  for (const url of resources) {
    const path = new URL(url).pathname;
    const relative = path.endsWith('/') ? `${path.slice(1)}index.html` : path.slice(1);
    const response = await context.request.get(url);
    const body = await response.body();
    assert.ok(body.equals(await readFile(join(root, 'dist', relative))), relative);
    served.push({ path: relative, sha256: createHash('sha256').update(body).digest('hex') });
  }
  await writeFile(join(evidence, 'production-operation.json'), JSON.stringify({
    originalV2: 'benchmarks/runs/2026-10-10-project-decisions/export-v2.json',
    originalV2Hash: createHash('sha256').update(originalBytes).digest('hex'),
    originalBytesRetainedOnOpen: true, exportedValuesUnchanged: true,
    conflictNavigationDialog: unloadType, cancelledNavigationRetainsLocalText: true,
    externalStorageBytesPreserved: true, recoveryExportVerified: true,
    servedFilesMatchFinalBuild: served,
  }, null, 2) + '\n');
  console.log(`Historical v2, real two-tab unload/recovery and ${served.length} served build resources verified.`);
} finally {
  await context.close();
  await browser.close();
}
