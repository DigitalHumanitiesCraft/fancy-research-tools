import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/combined-reproduction';
const work = join(base, 'candidate-2');
const final = join(work, 'final-refresh');
const checkout = join(work, 'checkout');
const origin = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
await mkdir(final);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const old = JSON.parse(await readFile(join(work, 'source-manifest.json'), 'utf8'));
const expectedBytes = await readFile(join(origin, 'benchmarks/runs/2026-10-10-review-ready-source.json'));
const expected = JSON.parse(expectedBytes);
assert.deepEqual(expected.files.map(file => file.path), old.files.map(file => file.path));
const previous = new Map(old.files.map(file => [file.path, file]));
const delta = expected.files.filter(file => previous.get(file.path).sha256 !== file.sha256);
assert.deepEqual(delta.map(file => file.path), ['knowledge/plan.md', 'knowledge/testing.md', 'src/gallery.css']);
for (const file of old.files) {
  assert.equal(hash(await readFile(join(checkout, file.path))), file.sha256, `Original isolated source changed: ${file.path}`);
}
for (const file of delta) {
  const bytes = await readFile(join(origin, file.path));
  assert.equal(hash(bytes), file.sha256, `Root drift: ${file.path}`);
  await writeFile(join(checkout, file.path), bytes);
}
await writeFile(join(final, 'root-source-manifest.json'), expectedBytes, {flag: 'wx'});
await writeFile(join(final, 'delta.json'), JSON.stringify({
  synchronizedAt: new Date().toISOString(),
  originalManifest: '../source-manifest.json',
  finalRootManifest: 'root-source-manifest.json',
  changes: delta.map(file => ({path: file.path, previousSha256: previous.get(file.path).sha256, finalSha256: file.sha256})),
  verificationScope: 'Build and all documentation/gallery browser cases repeated. Unit/data tests and the actual export workflows remain attached to candidate 2 because their code and inputs are identical.',
}, null, 2) + '\n', {flag: 'wx'});
execFileSync(process.execPath, ['benchmarks/capture-source.mjs', '--output', 'isolated-final-source.json'], {
  cwd: checkout, env: {...process.env, GIT_DIR: join(origin, '.git')}, stdio: 'inherit',
});
const isolatedManifest = JSON.parse(await readFile(join(checkout, 'benchmarks/runs/isolated-final-source.json'), 'utf8'));
assert.deepEqual(isolatedManifest.files, expected.files);
await copyFile(join(checkout, 'benchmarks/runs/isolated-final-source.json'), join(final, 'source-manifest.json'));
const verification = execFileSync(process.execPath, ['benchmarks/capture-source.mjs', '--output', 'isolated-final-source.json', '--check'], {cwd: checkout, encoding: 'utf8'});
await writeFile(join(final, 'source-verification.log'), verification);
const config = {testDir: join(checkout, 'tests/e2e'), use: {baseURL: 'http://127.0.0.1:4191', trace: 'retain-on-failure'}, outputDir: join(final, 'test-results')};
await writeFile(join(final, 'playwright.config.mjs'), `export default ${JSON.stringify(config, null, 2)};\n`, {flag: 'wx'});
const commands = [
  ['npm', 'npm run build'],
  ['docs', `node node_modules/@playwright/test/cli.js test tests/e2e/docs.spec.ts --config "${join(final, 'playwright.config.mjs')}" --workers 1`],
];
const outcomes = [];
for (const [name, command] of commands) {
  const startedAt = new Date().toISOString();
  const log = join(final, `${name}.log`);
  const output = createWriteStream(log, {flags: 'wx'});
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.env.ComSpec, ['/d', '/s', '/c', command], {cwd: checkout, env: process.env, windowsHide: true});
    child.stdout.pipe(output, {end: false});
    child.stderr.pipe(output, {end: false});
    child.once('error', reject);
    child.once('close', code => {output.end(); resolve(code);});
  });
  outcomes.push({command, startedAt, endedAt: new Date().toISOString(), exitCode, log});
  await writeFile(join(final, 'command-results.json'), JSON.stringify(outcomes, null, 2) + '\n');
  console.log(`${name}: exit ${exitCode}`);
  if (exitCode !== 0) {process.exitCode = 1; break;}
}
