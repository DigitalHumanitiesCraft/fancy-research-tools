import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const output = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/repository-audit-checks';
const fixture = join(output, 'corrupted-fixture');
await mkdir(output, { recursive: true });
await mkdir(join(fixture, 'scripts'), { recursive: true });
await cp(join(root, 'data'), join(fixture, 'data'), { recursive: true });
await cp(join(root, 'benchmarks/cases'), join(fixture, 'benchmarks/cases'), { recursive: true });
for (const script of ['check-data.mjs', 'import-dh-data.mjs']) {
  await cp(join(root, 'scripts', script), join(fixture, 'scripts', script));
}
const oldManifest = JSON.parse(await readFile(join(root, 'benchmarks/runs/2026-10-10-project-decisions-source.json'), 'utf8'));
const protectedFiles = oldManifest.files.filter(({ path }) => (path.startsWith('data/') && !path.endsWith('/.gitattributes')) || path === 'scripts/import-dh-data.mjs');
async function unchanged() {
  for (const { path, sha256 } of protectedFiles) {
    assert.equal(createHash('sha256').update(await readFile(join(root, path))).digest('hex'), sha256, path);
  }
}
await unchanged();
const positive = execFileSync(process.execPath, [join(root, 'scripts/check-data.mjs')], { cwd: root, encoding: 'utf8' });
await writeFile(join(output, 'data-positive.log'), positive);
const cases = [];
for (const name of ['records.json', 'records.sha256', 'field-evidence.json']) {
  const path = join(fixture, 'data/met-instruments', name);
  const original = await readFile(path);
  // Even semantically equivalent JSON with changed bytes must be identified.
  await writeFile(path, Buffer.concat([original, Buffer.from('\n')]));
  const result = spawnSync(process.execPath, [join(fixture, 'scripts/check-data.mjs')], { cwd: fixture, encoding: 'utf8' });
  assert.equal(result.status, 1, `${name} corruption must fail`);
  assert.ok(result.stderr.includes(`${name} differs from the frozen-source derivation`));
  await writeFile(join(output, `data-negative-${name}.log`), result.stdout + result.stderr);
  cases.push({ file: name, intentionalMismatch: 'one extra newline', exitCode: result.status, expectedFailure: true });
  await writeFile(path, original);
}
await unchanged();
await writeFile(join(output, 'data-result.json'), JSON.stringify({ protectedFilesUnchanged: protectedFiles.length, positiveGatePassed: true, cases }, null, 2) + '\n');
console.log(JSON.stringify({ protectedFilesUnchanged: protectedFiles.length, positiveGatePassed: true, deliberateMismatchesRejected: cases.length }));
