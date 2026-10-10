import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const base='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/combined-reproduction';
const revision=process.argv[2]??'candidate-2';
if(!/^[a-z0-9-]+$/.test(revision)) throw new Error('Invalid revision directory');
const work=join(base,revision);
const origin='C:/Users/chris/Documents/GitHub/fancy-research-tools/dist';
const actual=[];
async function collect(directory) {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const path=join(directory,entry.name);
    if(entry.isDirectory()) await collect(path);
    else if(entry.isFile()) {
      const bytes=await readFile(path);
      actual.push({path:relative(origin,path).replaceAll('\\','/'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
    }
  }
}
await collect(origin);
actual.sort((a,b)=>a.path.localeCompare(b.path));
const expected=JSON.parse(await readFile(join(work,'build-manifest.json'),'utf8')).files;
const original=new Map(expected.map(file=>[file.path,file]));
const current=new Map(actual.map(file=>[file.path,file]));
const differences=[];
for(const name of new Set([...original.keys(),...current.keys()])) {
  if(original.get(name)?.sha256!==current.get(name)?.sha256) differences.push(name);
}
const comparison={comparedAt:new Date().toISOString(),rootBuildFiles:actual.length,isolatedBuildFiles:expected.length,identical:differences.length===0,differences};
await writeFile(join(work,'build-comparison.json'),JSON.stringify(comparison,null,2)+'\n');
console.log(JSON.stringify(comparison,null,2));
