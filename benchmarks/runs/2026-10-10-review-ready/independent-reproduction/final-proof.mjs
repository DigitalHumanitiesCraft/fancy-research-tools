import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
const base = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/combined-reproduction';
const checkout = join(base, 'candidate-2/checkout');
const final = join(base, 'candidate-2/final-refresh');
const origin = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function collect(root) {
  const files = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile()) {
        const bytes = await readFile(path);
        files.push({path: relative(root, path).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes)});
      }
    }
  }
  await visit(root);
  return files.sort((a, b) => a.path.localeCompare(b.path));
}
const isolated = await collect(join(checkout, 'dist'));
const root = await collect(join(origin, 'dist'));
const files = new Map(isolated.map(file => [file.path, file]));
const original = new Map(root.map(file => [file.path, file]));
const differences = [...new Set([...files.keys(), ...original.keys()])].filter(path => files.get(path)?.sha256 !== original.get(path)?.sha256);
const now = new Date().toISOString();
await writeFile(join(final, 'build-manifest.json'), JSON.stringify({capturedAt: now, files: isolated}, null, 2) + '\n');
const comparison = {comparedAt: now, rootBuildFiles: root.length, isolatedBuildFiles: isolated.length, identical: differences.length === 0, differences};
await writeFile(join(final, 'build-comparison.json'), JSON.stringify(comparison, null, 2) + '\n');
assert.deepEqual(differences, []);
const expected = JSON.parse(await readFile(join(final, 'source-manifest.json'), 'utf8'));
for (const file of expected.files) assert.equal(hash(await readFile(join(origin, file.path))), file.sha256, `Root drift: ${file.path}`);
const verification = execFileSync(process.execPath, ['benchmarks/capture-source.mjs', '--output', 'isolated-final-source.json', '--check'], {cwd: checkout, encoding: 'utf8'});
await writeFile(join(final, 'post-check-source-verification.log'), verification);
await writeFile(join(final, 'root-comparison.json'), JSON.stringify({comparedAt: now, sourceFiles: expected.files.length, allCapturedFilesIdentical: true}, null, 2) + '\n');
const assessmentPath = join(base, 'reproduction-assessment.json');
const assessment = JSON.parse(await readFile(assessmentPath, 'utf8'));
assessment.finalRefresh = {
  synchronizedChanges: ['knowledge/plan.md', 'knowledge/testing.md', 'src/gallery.css'],
  sourceManifest: 'candidate-2/final-refresh/source-manifest.json',
  delta: 'candidate-2/final-refresh/delta.json',
  build: 'Passed',
  documentationAndGalleryBrowserCases: 'All 4 cases passed against isolated preview port 4191',
  buildComparison: 'All 54 files have exactly the same bytes as the final root build',
  applicationAndTestSourceChanged: false,
  operationalCorrection: 'Initial browser command kept literal quote characters around a config path. Direct Node arguments worked; the failed invocation log is retained.',
};
assessment.limits = assessment.limits.filter(line => !line.startsWith('Root may subsequently'));
await writeFile(assessmentPath, JSON.stringify(assessment, null, 2) + '\n');
console.log(JSON.stringify({...comparison, sourceFilesVerified: expected.files.length}, null, 2));
