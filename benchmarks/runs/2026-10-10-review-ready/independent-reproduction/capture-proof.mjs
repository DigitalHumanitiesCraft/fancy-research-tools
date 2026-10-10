import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
const base='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/combined-reproduction';
const revision=process.argv[2]??'candidate-2';
assert.ok(/^[a-z0-9-]+$/.test(revision));
const work=join(base,revision);
const checkout=join(work,'checkout');
const origin='C:/Users/chris/Documents/GitHub/fancy-research-tools';
const hash=(bytes)=>createHash('sha256').update(bytes).digest('hex');
const output=execFileSync(process.execPath,['benchmarks/capture-source.mjs','--output','isolated-candidate-source.json','--check'],{cwd:checkout,encoding:'utf8'});
await writeFile(join(work,'source-verification.log'),output);
const files=[];
async function collect(directory) {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const path=join(directory,entry.name);
    if(entry.isDirectory()) await collect(path);
    else if(entry.isFile()) {
      const bytes=await readFile(path);
      files.push({path:relative(join(checkout,'dist'),path).replaceAll('\\','/'),bytes:bytes.length,sha256:hash(bytes)});
    }
  }
}
await collect(join(checkout,'dist'));
files.sort((a,b)=>a.path.localeCompare(b.path));
await writeFile(join(work,'build-manifest.json'),JSON.stringify({capturedAt:new Date().toISOString(),files},null,2)+'\n');
const source=JSON.parse(await readFile(join(work,'source-manifest.json'),'utf8'));
const changed=[];
for(const file of source.files) {
  try {if(hash(await readFile(join(origin,file.path)))!==file.sha256) changed.push(file.path);}
  catch(error) {changed.push(`${file.path}: ${error.code}`);}
}
await writeFile(join(work,'root-comparison.json'),JSON.stringify({comparedAt:new Date().toISOString(),scope:'Files in the captured source manifest only. Root may contain later added files or documentation revisions.',changed},null,2)+'\n');
console.log(JSON.stringify({sourceVerified:source.files.length,buildFiles:files.length,rootFilesChanged:changed},null,2));
