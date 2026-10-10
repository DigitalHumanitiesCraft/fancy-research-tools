import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const cwd='C:/Users/chris/Documents/GitHub/fancy-research-tools';
const out='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/review-ready-checks-final';
mkdirSync(out,{recursive:true});
const commands=[['check',['run','check']],['data',['run','check:data']],['unit',['test']],['build',['run','build']],['browser',['run','test:e2e','--','--output',`${out}/browser`]]];
const results=[];
for(const [name,args] of commands){
 const startedAt=new Date().toISOString();
 const run=spawnSync('npm.cmd',args,{cwd,shell:true,encoding:'utf8',maxBuffer:20e6});
 writeFileSync(`${out}/${name}.log`,(run.stdout||'')+(run.stderr||''));
 const result={name,command:`npm ${args.join(' ')}`,startedAt,finishedAt:new Date().toISOString(),exitCode:run.status};
 results.push(result);writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(result));
 if(run.status!==0){process.exitCode=1;break;}
}
