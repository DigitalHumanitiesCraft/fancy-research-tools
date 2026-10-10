import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/native-zoom-review-ready';
const repo='C:/Users/chris/Documents/GitHub/fancy-research-tools';
const routeRun=JSON.parse(await readFile(root+'/routes-results.json','utf8'));
const annotationRun=JSON.parse(await readFile(root+'/annotation-results.json','utf8'));
const sources={
 '/':['index.html','docs/index.md','scripts/build-docs.mjs','scripts/docs-pages.json','src/docs.ts','src/ui/styles.css','src/ui/tokens.css'],
 '/guides/getting-started.html':['guides/getting-started.html','docs/getting-started.md','scripts/build-docs.mjs','scripts/docs-pages.json','src/docs.ts','src/ui/styles.css','src/ui/tokens.css'],
 '/tools/':['tools/index.html','src/gallery.ts','src/gallery.css','src/ui/styles.css','src/ui/tokens.css'],
 '/annotations/':['annotations/index.html','src/annotation/main.ts','src/annotation/model.ts','src/annotation/browser.ts','src/annotation/styles.css','src/ui/text-value.ts','src/ui/tokens.css','data/nhc-milton/sources.json'],
};
const sourceFiles={};
for(const paths of Object.values(sources))for(const path of paths){if(sourceFiles[path])continue;try{const bytes=await readFile(repo+'/'+path);sourceFiles[path]={sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};}catch(error){if(error.code!=='ENOENT')throw error;sourceFiles[path]={error:'Path not present; see corrected route source mapping if supplied'};}}
const resources={...routeRun.resources,...annotationRun.resources};
const resourceMatches=[];
for(const [url,observed] of Object.entries(resources)){
 let path=new URL(url).pathname;if(path.endsWith('/'))path+='index.html';
 const bytes=await readFile(repo+'/dist'+path);const hash=createHash('sha256').update(bytes).digest('hex');
 assert.equal(hash,observed.sha256,'Current dist differs from captured response '+url);
 resourceMatches.push({url,distPath:'dist'+path,...observed,matchedCurrentDist:true});
}
const summary={capturedAt:new Date().toISOString(),repository:repo,scope:'Four changed/new routes at native 200% and 400% browser zoom in Chromium 156.0.8078.4. These eight tasks are additional to earlier existing-route evidence, not a screen-reader acceptance test.',method:annotationRun.method,result:'8/8 passed',routeRun:{file:'routes-results.json',startedAt:routeRun.startedAt,finishedAt:routeRun.finishedAt},annotationRun:{file:'annotation-results.json',startedAt:annotationRun.startedAt,finishedAt:annotationRun.finishedAt},cases:[...routeRun.cases,...annotationRun.cases].map(({name,route,factor,status})=>({name,route,factor,status})),sources,sourceFiles,resourceMatches,visualInspection:['annotation-4-source-selection.png','annotation-4-saved-review.png','annotation-4-review-form.png','annotation-4-notebook-controls.png','annotation-4-source-end.png','gallery-4-selected-description.png','gallery-4-start.png','documentation-4-annotation-guide.png'],limits:['Headless browser-managed page zoom is exercised through the Chromium extension API; browser toolbar/menu interaction and OS magnification are not tested.','Actual saved notebook download and data checks are included at each zoom; the labelled review is performed by an AI agent as an engineering check and is not human research validation.','Real screen-reader speech/workflow acceptance remains pending.','Older intermediate route results preserve a missing navigation-wait harness error and a transient native capture error; final routes-results.json is a fresh complete successful run after the gallery layer-order correction.','Temporary profiles are scratch data and must not be copied into retained repository evidence.']};
assert.equal(summary.cases.length,8);assert.ok(summary.cases.every(row=>row.status==='passed'));await writeFile(root+'/summary.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({result:summary.result,resourcesMatched:resourceMatches.length,missingSourceMappings:Object.entries(sourceFiles).filter(([,value])=>value.error).map(([path])=>path)}));
