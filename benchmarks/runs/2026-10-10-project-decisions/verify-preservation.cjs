const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const base = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/fancy-implementation-baseline';
const output = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/project-decisions';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const before = JSON.parse(fs.readFileSync(path.join(base, 'source-manifest.json'), 'utf8'));
const changed = [], unchanged = [];
for (const entry of before) {
  const filename = entry.path.replaceAll('\\', '/');
  const actual = hash(fs.readFileSync(path.join(root, filename)));
  (actual === entry.sha256.toLowerCase() ? unchanged : changed).push(filename);
}
const sourcePaths = before.map(item => item.path.replaceAll('\\', '/')).filter(name => name.startsWith('data/met-instruments/'));
for (const name of sourcePaths) assert(unchanged.includes(name), `Original source changed: ${name}`);
const registry = JSON.parse(fs.readFileSync(path.join(root, 'data/met-instruments/field-evidence.json')));
assert.equal(registry.derivation.sha256, hash(fs.readFileSync(path.join(root, registry.derivation.producer))));
let fields = 0;
for (const record of registry.records) {
  const raw = JSON.parse(fs.readFileSync(path.join(root, 'data/met-instruments', record.source.path)));
  assert.equal(hash(fs.readFileSync(path.join(root, 'data/met-instruments', record.source.path))), record.source.sha256);
  for (const item of Object.values(record.fields)) {
    for (const field of item.sourceFields) assert.deepEqual(raw[field], item.originalValues[field]);
    fields++;
  }
}
fs.writeFileSync(path.join(output, 'preservation.json'), JSON.stringify({ checkedAt: new Date().toISOString(), unchangedOriginalDatasetFiles: sourcePaths.length, originalFieldsMatched: fields, changedExistingFiles: changed, unchangedExistingFileCount: unchanged.length, baseline: 'fancy-implementation-baseline/source-manifest.json', generatorHashMatched: true }, null, 2));
console.log(JSON.stringify({unchangedOriginalDatasetFiles:sourcePaths.length, originalFieldsMatched:fields, changedExistingFiles:changed}));
