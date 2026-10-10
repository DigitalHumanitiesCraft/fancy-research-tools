import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
const root='C:/Users/chris/Documents/GitHub/fancy-research-tools';
const files=execFileSync('rg',['--files','--hidden','-g','*.md','-g','!benchmarks/runs/**','-g','!node_modules/**','-g','!.git/**'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/);
const issues=[];
let checked=0;
const slug=s=>s.replace(/<[^>]*>/g,'').toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').trim().replace(/\s+/g,'-');
for(const file of files){
 const text=readFileSync(resolve(root,file),'utf8').replace(/```[\s\S]*?```/g,'');
 for(const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)){
  const href=match[1]; if(/^[a-z][a-z\d+.-]*:|^\/\//i.test(href))continue;
  const [path,fragment]=href.split('#'); const target=path?resolve(dirname(resolve(root,file)),decodeURIComponent(path)):resolve(root,file);
  checked++;
  if(!existsSync(target)){issues.push({file,href,reason:'missing target'});continue;}
  if(fragment&&target.endsWith('.md')&&statSync(target).isFile()){
   const body=readFileSync(target,'utf8');const counts=new Map();const ids=new Set();
   for(const heading of body.matchAll(/^#{1,6}\s+(.+)$/gm)){const base=slug(heading[1]);const count=counts.get(base)||0;counts.set(base,count+1);ids.add(count?`${base}-${count}`:base);}
   if(!ids.has(decodeURIComponent(fragment)))issues.push({file,href,reason:'missing heading anchor'});
  }
 }
}
const result={files:files.length,checkedLocalLinks:checked,issues};
writeFileSync(new URL('./review-ready-markdown-check.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
process.exitCode=issues.length?1:0;
