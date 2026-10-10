import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const root = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const work = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work';
const evidence = join(work, 'repository-audit-evidence');
const sandbox = join(work, 'repository-audit-checkout');
await mkdir(sandbox);
const fixture = [
  'scripts/.gitattributes', 'scripts/import-dh-data.mjs',
  'data/met-instruments/.gitattributes', 'data/met-instruments/records.json',
  'data/met-instruments/records.sha256', 'data/met-instruments/field-evidence.json',
  'data/met-instruments/raw/500526.json',
];
for (const path of fixture) {
  await mkdir(dirname(join(sandbox, path)), { recursive: true });
  await copyFile(join(root, path), join(sandbox, path));
}
const git = (args) => execFileSync('git', args, { cwd: sandbox, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
git(['init', '--quiet']);
git(['config', 'core.autocrlf', 'true']);
git(['add', '--', ...fixture]);
// No commit: an isolated index is enough to exercise Git's checkout conversion.
git(['checkout-index', '--all', '--prefix=checkout/']);
const files = [];
for (const path of fixture.filter(path => !path.endsWith('.gitattributes'))) {
  const original = await readFile(join(root, path));
  const checkout = await readFile(join(sandbox, 'checkout', path));
  assert.ok(original.equals(checkout), path);
  files.push({ path, unchanged: true, sha256: createHash('sha256').update(checkout).digest('hex') });
}
await writeFile(join(evidence, 'checkout-result.json'), JSON.stringify({ coreAutocrlf: true, committed: false, files }, null, 2) + '\n');
console.log(`Exact bytes retained for ${files.length} protected files under Git checkout conversion.`);
