import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const origin = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const work = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/combined-reproduction';
const sources = [
  ['legacy-v1.json','benchmarks/runs/2026-10-10-clear-scope-review/ui/instrument-investigation.json'],
  ['previous-v2.json','benchmarks/runs/2026-10-10-project-decisions/export-v2.json'],
];
await mkdir(join(work,'inputs'),{recursive:true});
const files=[];
for(const [name,source] of sources) {
  const bytes = await readFile(join(origin,source));
  await writeFile(join(work,'inputs',name),bytes,{flag:'wx'});
  files.push({file:`inputs/${name}`,source,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),schemaVersion:JSON.parse(bytes).schemaVersion});
}
await writeFile(join(work,'input-manifest.json'),JSON.stringify({copiedAt:new Date().toISOString(),files},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(files,null,2));
