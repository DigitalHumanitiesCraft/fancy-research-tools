import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const origin = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const base = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/combined-reproduction';
const revision = process.argv[2];
assert.ok(!revision || /^[a-z0-9-]+$/.test(revision));
const work = revision ? join(base,revision) : base;
await mkdir(work,{recursive:true});
const checkout = join(work, 'checkout');
const names = ['src','scripts','tests','docs','knowledge','data','fixtures','public','tool','pilot','baseline','annotations','tools','.github','.agents','concepts','benchmarks'];
const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const full = join(directory,entry.name);
    const name = relative(origin,full).replaceAll('\\','/');
    if (name.startsWith('benchmarks/runs/')) continue;
    if (entry.isDirectory()) await collect(full);
    else if (entry.isFile()) files.push(name);
  }
}
for (const name of names) await collect(join(origin,name));
for (const entry of await readdir(origin,{withFileTypes:true})) {
  if (entry.isFile() && (/\.(json|ts|md)$/.test(entry.name) || ['.gitignore','LICENSE'].includes(entry.name))) files.push(entry.name);
}
await mkdir(checkout);
const captured = [];
for (const name of files.sort()) {
  const bytes = await readFile(join(origin,name));
  const target = join(checkout,name);
  await mkdir(join(target,'..'),{recursive:true});
  await writeFile(target,bytes,{flag:'wx'});
  captured.push({path:name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await mkdir(join(checkout,'benchmarks/runs'),{recursive:true});
execFileSync(process.execPath,[join(checkout,'benchmarks/capture-source.mjs'),'--output','isolated-candidate-source.json'],{
  cwd:checkout,
  env:{...process.env,GIT_DIR:join(origin,'.git')},
  stdio:'inherit',
});
const manifest = JSON.parse(await readFile(join(checkout,'benchmarks/runs/isolated-candidate-source.json'),'utf8'));
assert.deepEqual(manifest.files,captured);
await writeFile(join(work,'source-manifest.json'),JSON.stringify({...manifest,purpose:'Independent engineering reproduction of an isolated working-tree copy. The runner inherited task context; this is not a blinded or human participant study.'},null,2)+'\n',{flag:'wx'});
const changedDuringCopy=[];
for (const file of captured) {
  if (createHash('sha256').update(await readFile(join(origin,file.path))).digest('hex')!==file.sha256) changedDuringCopy.push(file.path);
}
await writeFile(join(work,'copy-observation.json'),JSON.stringify({files:captured.length,changedDuringCopy},null,2)+'\n');
console.log(JSON.stringify({files:captured.length,changedDuringCopy},null,2));
