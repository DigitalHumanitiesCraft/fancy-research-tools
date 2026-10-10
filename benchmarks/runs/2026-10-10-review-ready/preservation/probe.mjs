import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const output = dirname(fileURLToPath(import.meta.url));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const sourcePath = 'benchmarks/runs/2026-10-10-repository-audit-source.json';
const sourceBytes = await readFile(join(root, sourcePath));
const source = JSON.parse(sourceBytes);
const isProtected = path => path.startsWith('data/met-instruments/') || path === 'scripts/import-dh-data.mjs';
async function enumerate(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${prefix}${entry.name}`;
    if (entry.isDirectory()) files.push(...await enumerate(join(directory, entry.name), `${path}/`));
    else files.push(path);
  }
  return files.sort();
}
async function compare(base, records) {
  const checked = [];
  for (const record of records) {
    const absolute = resolve(base, record.path);
    if (!absolute.startsWith(`${resolve(base)}\\`) && !absolute.startsWith(`${resolve(base)}/`)) throw new Error(`Manifest path escapes root: ${record.path}`);
    try {
      const bytes = await readFile(absolute);
      const actual = { bytes: bytes.length, sha256: digest(bytes) };
      checked.push({ path: record.path, expectedBytes: record.bytes, expectedSha256: record.sha256, ...actual, unchanged: actual.bytes === record.bytes && actual.sha256 === record.sha256 });
    } catch (error) {
      checked.push({ path: record.path, unchanged: false, error: error.message });
    }
  }
  return checked;
}
const protectedRecords = source.files.filter(record => isProtected(record.path));
const protectedChecks = await compare(root, protectedRecords);
const currentData = (await enumerate(join(root, 'data/met-instruments'))).map(path => `data/met-instruments/${path}`);
const originalNames = new Set(protectedRecords.map(file => file.path));
const addedDataFiles = currentData.filter(path => !originalNames.has(path));
const runs = [];
for (const name of ['2026-10-10-repository-audit', '2026-10-10-project-decisions', '2026-10-10-session-closeout']) {
  const directory = join(root, 'benchmarks/runs', name);
  const manifestBytes = await readFile(join(directory, 'evidence-manifest.json'));
  const manifest = JSON.parse(manifestBytes);
  const checked = await compare(directory, manifest.files);
  const recordedNames = new Set(manifest.files.map(file => file.path));
  const unlistedFiles = (await enumerate(directory)).filter(path => path !== 'evidence-manifest.json' && !recordedNames.has(path));
  runs.push({ run: name, manifestSha256: digest(manifestBytes), manifestRecordedAt: manifest.recordedAt, checkedFiles: checked.length, unchangedFiles: checked.filter(file => file.unchanged).length, unlistedFiles, mismatches: checked.filter(file => !file.unchanged), files: checked });
}
const result = {
  checkedAt: new Date().toISOString(),
  comparison: { sourceManifest: sourcePath, sourceManifestSha256: digest(sourceBytes), capturedAt: source.capturedAt },
  met: { checkedFiles: protectedChecks.length, dataFiles: protectedRecords.filter(file => file.path.startsWith('data/')).length, importerFiles: protectedRecords.filter(file => file.path.startsWith('scripts/')).length, unchangedFiles: protectedChecks.filter(file => file.unchanged).length, addedDataFiles, mismatches: protectedChecks.filter(file => !file.unchanged), files: protectedChecks },
  historicalRuns: runs,
  scope: 'Byte lengths and SHA-256 compared to the retained manifests; no repository writes. Manifest digests recorded for this check. This is a preservation check, not independent authentication of the historic manifests themselves.',
};
result.passed = result.met.mismatches.length === 0 && addedDataFiles.length === 0 && runs.every(run => run.mismatches.length === 0);
result.historicalManifestCoverageComplete = runs.every(run => run.unlistedFiles.length === 0);
result.coverageQualification = 'Unlisted historical files are reported separately. Their current presence is not evidence of a new mutation and their old bytes cannot be established from these manifests.';
await writeFile(join(output, 'results.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ passed: result.passed, met: { checked: result.met.checkedFiles, unchanged: result.met.unchangedFiles, data: result.met.dataFiles, importer: result.met.importerFiles, mismatches: result.met.mismatches, added: result.met.addedDataFiles }, historicalRuns: runs.map(({run,checkedFiles,unchangedFiles,mismatches,unlistedFiles}) => ({run,checkedFiles,unchangedFiles,mismatches,unlistedFiles})) }, null, 2));
if (!result.passed) process.exitCode = 1;
