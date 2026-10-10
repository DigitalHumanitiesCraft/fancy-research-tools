import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = 'C:/Users/chris/Documents/Codex/2026-10-10/ana/work/combined-reproduction';
const revision = process.argv.slice(2).find((argument)=>argument!=='--remaining');
if(revision && !/^[a-z0-9-]+$/.test(revision)) throw new Error('Invalid revision directory');
const work = revision ? join(base,revision) : base;
const checkout = join(work,'checkout');
const logs = join(work,'logs');
await mkdir(logs,{recursive:true});
for (const name of ['AGENTS.md','docs/getting-started.md','knowledge/INDEX.md','knowledge/handoff.md','knowledge/data.md','knowledge/specification.md']) {
  if (!(await readFile(join(checkout,name),'utf8')).length) throw new Error(`Empty instructions: ${name}`);
}
const commands = ['npm ci','npm run check','npm run check:data','npm test','npm run build'];
const outcomes = [];
const startIndex = process.argv.includes('--remaining') ? 2 : 0;
for (const [index,command] of commands.slice(startIndex).entries()) {
  const startedAt = new Date().toISOString();
  const file = join(logs,`${index+startIndex+1}-${command.replaceAll(' ','-').replaceAll(':','-')}.log`);
  console.log(`Running ${command}`);
  const output = createWriteStream(file,{flags:'wx'});
  const exitCode = await new Promise((resolve,reject)=>{
    const child = spawn(process.env.ComSpec ?? 'C:/Windows/System32/cmd.exe',['/d','/s','/c',command],{cwd:checkout,env:process.env,windowsHide:true});
    child.stdout.pipe(output,{end:false});
    child.stderr.pipe(output,{end:false});
    child.once('error',reject);
    child.once('close',(code)=>{output.end();resolve(code);});
  });
  outcomes.push({command,startedAt,endedAt:new Date().toISOString(),exitCode,log:file});
  await writeFile(join(work,startIndex ? 'remaining-command-results.json' : 'command-results.json'),JSON.stringify(outcomes,null,2)+'\n');
  console.log(`${command}: exit ${exitCode}`);
  if (exitCode!==0) {process.exitCode=1;break;}
}
