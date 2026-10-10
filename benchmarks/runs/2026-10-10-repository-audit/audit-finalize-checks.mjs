import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const root = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const work = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work';
const evidence = join(work, 'repository-audit-evidence');
const fresh = join(work, 'repository-audit-fresh');
const npm = join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
const source = JSON.parse(await readFile(join(root, 'benchmarks/runs/2026-10-10-repository-audit-source.json'), 'utf8'));
const initial = JSON.parse(await readFile(join(evidence, 'fresh-source-before-final-docs.json'), 'utf8'));
const changes = [];
for (const entry of source.files) {
  const previous = initial.files.find(file => file.path === entry.path);
  assert.ok(previous, `Unexpected new runtime source ${entry.path}`);
  if (previous.sha256 !== entry.sha256) {
    assert.ok(entry.path.endsWith('.md'), `Runtime changed after production checks: ${entry.path}`);
    await copyFile(join(root, entry.path), join(fresh, entry.path));
    changes.push(entry.path);
  }
  assert.equal(createHash('sha256').update(await readFile(join(fresh, entry.path))).digest('hex'), entry.sha256, entry.path);
}
await writeFile(join(evidence, 'fresh-final-source.json'), JSON.stringify({ matches: '2026-10-10-repository-audit-source.json', matchedFiles: source.files.length, documentationSynchronizedAfterInitialBuild: changes }, null, 2) + '\n');
await cp(join(root, 'test-results'), join(evidence, 'production-browser'), { recursive: true });
const checks = [];
for (const [label, cwd, args] of [
  ['final-production-build', root, [npm, 'run', 'build']],
  ['final-fresh-build', fresh, [npm, 'run', 'build']],
  ['final-documentation-browser', root, [join(root, 'node_modules/@playwright/test/cli.js'), 'test', 'tests/e2e/docs.spec.ts', '--output', join(evidence, 'final-documentation-browser')]],
]) {
  const result = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  checks.push({ label, cwd, exitCode: result.status });
  await writeFile(join(evidence, `${label}.log`), result.stdout + result.stderr);
  assert.equal(result.status, 0, label);
  console.log(`${label}: passed`);
}
const built = [];
async function compare(path = '') {
  for (const entry of await readdir(join(root, 'dist', path), { withFileTypes: true })) {
    const relative = path ? `${path}/${entry.name}` : entry.name;
    if (entry.isDirectory()) await compare(relative);
    else {
      const [original, reproduced] = await Promise.all([readFile(join(root, 'dist', relative)), readFile(join(fresh, 'dist', relative))]);
      assert.ok(original.equals(reproduced), `Fresh output mismatch: ${relative}`);
      built.push({ path: relative, bytes: original.length, sha256: createHash('sha256').update(original).digest('hex') });
    }
  }
}
await compare();
await writeFile(join(evidence, 'reproduced-build.json'), JSON.stringify({ sourceFiles: source.files.length, finalChecks: checks, identicalFiles: built }, null, 2) + '\n');
for (const name of ['documentation-desktop.png', 'documentation-mobile.png']) {
  await copyFile(join(root, 'test-results', name), join(evidence, `final-${name}`));
}
console.log(`Final source matches ${source.files.length} files; all ${built.length} built outputs match byte for byte.`);
