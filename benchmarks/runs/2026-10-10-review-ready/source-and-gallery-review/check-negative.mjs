import assert from 'node:assert/strict';
import { cpSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const scratch = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/contrast-research';
const outcomes = [];
for (const [name, path] of [
  ['derived', 'sources.json'],
  ['raw', 'raw/milton-discussion-002.html'],
  ['rights', 'raw/nws-disclaimer.html'],
]) {
  const target = join(scratch, `negative-${name}`);
  mkdirSync(join(target, 'scripts'), {recursive: true});
  cpSync(join(repository, 'data/nhc-milton'), join(target, 'data/nhc-milton'), {recursive: true});
  for (const script of ['check-annotation-data.mjs', 'import-annotation-data.mjs']) {
    copyFileSync(join(repository, 'scripts', script), join(target, 'scripts', script));
  }
  const sourceFile = join(target, 'data/nhc-milton', path);
  writeFileSync(sourceFile, readFileSync(sourceFile, 'utf8') + '\n');
  const result = spawnSync(process.execPath, [join(target, 'scripts/check-annotation-data.mjs')], {encoding: 'utf8'});
  assert.notEqual(result.status, 0, `${name} corruption must fail`);
  outcomes.push({case: name, exitCode: result.status, stderr: result.stderr, stdout: result.stdout});
}
writeFileSync(join(scratch, 'negative-check-results.json'), JSON.stringify(outcomes, null, 2) + '\n');
console.log(JSON.stringify(outcomes.map(({case: name, exitCode, stderr}) => ({case: name, exitCode, observedExpectedFailure: /Checksum mismatch|differ from/.test(stderr)})), null, 2));
