const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/typescript');
const repo = 'C:/Users/chris/Documents/GitHub/fancy-research-tools';
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true} });
  const resolve = (id) => {
    let target = path.resolve(path.dirname(file), id);
    if (!path.extname(target)) target += '.ts';
    return load(target);
  };
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  cache.set(file, module.exports);
  return module.exports;
}
const { createNotebook, serializeNotebook, parseNotebook } = load(path.join(repo, 'src/annotation/model.ts'));
const { connectNotebook } = load(path.join(repo, 'src/annotation/browser.ts'));
class Element extends EventTarget {
  textContent = '';
  value = '';
  files = [];
  children = [];
  setAttribute() {}
  append(...nodes) { this.children.push(...nodes); }
  click() { downloads += 1; }
}
const key = 'frt.notebook./annotations/.nhc-milton.v1';
let downloads = 0;
function setup(stored = null, confirmed = true) {
  const data = new Map(stored === null ? [] : [[key, stored]]);
  let notebook = createNotebook();
  let pending = false;
  let restores = 0;
  let writes = 0;
  let confirms = 0;
  global.document = Object.assign(new EventTarget(), {createElement: () => new Element()});
  global.window = Object.assign(new EventTarget(), {confirm: () => { confirms += 1; return confirmed; }});
  global.location = {pathname: '/annotations/'};
  global.localStorage = {getItem: (name) => data.get(name) ?? null, setItem: (name, bytes) => {writes += 1; data.set(name, bytes); }};
  const mount = new Element();
  const controller = connectNotebook({mount, read: () => notebook, restore: (value) => {restores += 1; notebook = value;}, hasPending: () => pending});
  return {data, controller, input: mount.children[0].children[0], status: () => mount.children[1].textContent, current: () => notebook, counts: () => ({restores,writes,confirms}), pending: () => {pending = true;} };
}
const flush = () => new Promise((resolve) => setImmediate(resolve));
const original = serializeNotebook(createNotebook({researchQuestion:'Original\r\nquestion'})) + '\n';
const imported = JSON.stringify(createNotebook({researchQuestion:'Imported\r\nquestion'})) + '\n\n';
const outcomes = [];
(async () => {
  {
    const ui = setup(original);
    ui.input.files = [{size:100, text: async () => {throw new Error('Read refused');}}];
    ui.input.dispatchEvent(new Event('change'));
    await flush();
    assert.equal(ui.data.get(key), original);
    assert.equal(ui.current().researchQuestion, 'Original\r\nquestion');
    assert.match(ui.status(), /Read refused/);
    assert.deepEqual(ui.counts(), {restores:1, writes:0, confirms:0});
    outcomes.push({case:'failed asynchronous file read preserves valid draft', passed:true});
  }
  {
    const ui = setup(original);
    ui.input.files = [{size:imported.length, text: async () => imported}];
    ui.input.dispatchEvent(new Event('change'));
    await flush();
    assert.equal(ui.data.get(key), imported);
    assert.equal(ui.current().researchQuestion, 'Imported\r\nquestion');
    ui.controller.save();
    assert.equal(ui.data.get(key), imported);
    assert.deepEqual(ui.counts(), {restores:2, writes:1, confirms:1});
    outcomes.push({case:'confirmed import and no-op save retain original bytes', passed:true});
  }
  {
    const ui = setup(original, false);
    ui.input.files = [{size:imported.length, text: async () => imported}];
    ui.input.dispatchEvent(new Event('change'));
    await flush();
    assert.equal(ui.data.get(key), original);
    assert.equal(ui.current().researchQuestion, 'Original\r\nquestion');
    assert.deepEqual(ui.counts(), {restores:1, writes:0, confirms:1});
    outcomes.push({case:'canceled valid import leaves current notebook and bytes unchanged', passed:true});
  }
  {
    const ui = setup('broken JSON');
    ui.input.files = [{size:imported.length, text: async () => imported}];
    ui.input.dispatchEvent(new Event('change'));
    await flush();
    assert.equal(ui.data.get(key), 'broken JSON');
    assert.equal(ui.current().researchQuestion, 'Imported\r\nquestion');
    const event = new Event('beforeunload', {cancelable:true});
    window.dispatchEvent(event);
    assert.equal(event.defaultPrevented, true);
    ui.controller.export();
    assert.equal(downloads, 1);
    assert.match(ui.status(), /saving remains unavailable/);
    assert.deepEqual(ui.counts(), {restores:1, writes:0, confirms:1});
    outcomes.push({case:'import over corruption remains exportable and protects corrupt bytes', passed:true});
  }
  fs.writeFileSync(path.join(__dirname, 'recovery-probe-results.json'), JSON.stringify(outcomes, null, 2) + '\n');
  console.log(JSON.stringify(outcomes, null, 2));
})().catch((error) => {console.error(error); process.exitCode = 1;});
