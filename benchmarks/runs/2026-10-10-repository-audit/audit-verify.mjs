import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const root = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const work = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work';
const evidence = join(work, 'repository-audit-evidence');
const fresh = join(work, 'repository-audit-fresh');
const npm = join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
await mkdir(evidence, { recursive: true });
const results = [];
function run(label, args, cwd = root, executable = process.execPath) {
  const started = new Date().toISOString();
  const result = spawnSync(executable, args, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const entry = { label, cwd, command: [executable, ...args], started, ended: new Date().toISOString(), exitCode: result.status };
  results.push(entry);
  return writeFile(join(evidence, `${label}.log`), JSON.stringify(entry) + '\n' + result.stdout + result.stderr).then(async () => {
    await writeFile(join(evidence, 'execution.json'), JSON.stringify(results, null, 2) + '\n');
    console.log(`${label}: ${result.status}`);
    assert.equal(result.status, 0, `${label} failed; inspect retained log`);
  });
}
for (const [label, args] of [
  ['production-check', [npm, 'run', 'check']],
  ['production-data', [npm, 'run', 'check:data']],
  ['production-unit', [npm, 'test']],
  ['production-build', [npm, 'run', 'build']],
  ['production-browser', [npm, 'run', 'test:e2e']],
]) await run(label, args);

await mkdir(fresh);
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' })
  .split('\0').filter(path => path && !path.startsWith('benchmarks/runs/')).sort();
const manifest = [];
for (const path of files) {
  const bytes = await readFile(join(root, path));
  await mkdir(dirname(join(fresh, path)), { recursive: true });
  await copyFile(join(root, path), join(fresh, path));
  manifest.push({ path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
await writeFile(join(evidence, 'fresh-source-before-final-docs.json'), JSON.stringify({ files: manifest, excludes: ['benchmarks/runs historical evidence', 'Git internals', 'ignored/generated files', 'installed dependencies'] }, null, 2) + '\n');
for (const [label, args] of [
  ['fresh-install', [npm, 'ci']],
  ['fresh-check', [npm, 'run', 'check']],
  ['fresh-data', [npm, 'run', 'check:data']],
  ['fresh-unit', [npm, 'test']],
  ['fresh-build', [npm, 'run', 'build']],
]) await run(label, args, fresh);
console.log(`Verified root production and fresh installation from ${files.length} source files.`);
