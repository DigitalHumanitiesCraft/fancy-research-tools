import { INITIAL_QUERY, SOURCE_HASH, MAX_SELECTION, fields, labels, filterRecords, makeInvestigation, readInvestigation, describe } from './model.mjs';

const main = document.querySelector('main');
const message = document.querySelector('#message');
const storageStatus = document.querySelector('#storage-status');
document.querySelector('.skip').addEventListener('click', event => { event.preventDefault(); main.focus(); });
const key = 'synthetic-collection-procedure-trial-v1:investigation:1';
let catalogue;
let state = { query: {...INITIAL_QUERY}, selectedIds: [], question: '', observation: '' };
let expectedStorage = null;
let storageBlocked = false;
let revision = 0;
let pendingFocus = null;
let currentView = 'collection';
let lastExport = '';

function node(tag, text, attrs = {}) {
  const element = document.createElement(tag);
  if (text !== null && text !== undefined) element.textContent = text;
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
  return element;
}
function append(parent, ...children) { parent.append(...children); return parent; }
function button(label, fn, className = '') {
  const element = node('button', label, { type: 'button', class: className });
  element.addEventListener('click', fn);
  return element;
}
function announce(text) { message.textContent = text; }
function url(view, extra = {}) {
  const params = new URLSearchParams({text: state.query.text, attribution: state.query.attribution, role: state.query.role, ...extra});
  return `#${view}?${params}`;
}
function persist() {
  revision += 1;
  announce('');
  document.querySelector('#export-status').textContent = lastExport ? 'Changed since last download request' : 'No download requested';
  if (storageBlocked) return;
  try {
    if (localStorage.getItem(key) !== expectedStorage) throw new Error('Another tab changed the saved draft.');
    expectedStorage = JSON.stringify(makeInvestigation(catalogue, state));
    localStorage.setItem(key, expectedStorage);
    storageStatus.textContent = 'Draft saved in this browser. Export for a portable copy.';
  } catch (error) {
    storageBlocked = true;
    storageStatus.textContent = 'Draft is only in this tab. Download before leaving.';
    announce(`${error.message} Download your question and selected records to retain this copy.`);
  }
}
function syncNav() {
  const collectionLink = document.querySelector('#collection-link');
  const comparisonLink = document.querySelector('#comparison-link');
  collectionLink.href = url('collection');
  comparisonLink.href = url('comparison');
  comparisonLink.textContent = `Comparison (${state.selectedIds.length})`;
  document.querySelector('#about-link').href = url('about');
  [collectionLink, comparisonLink].forEach(a => a.removeAttribute('aria-current'));
  if (currentView === 'collection') collectionLink.setAttribute('aria-current', 'page');
  if (currentView === 'comparison') comparisonLink.setAttribute('aria-current', 'page');
}
function sourceLink(record, field, origin) {
  const link = node('a', 'Source', { href: url('source', {id: record.id, field, from: origin}), class: 'source', id: `${origin}-${record.id}-${field}`, 'aria-label': `${labels[field]} source for ${record.shelfmark}` });
  return link;
}
let productionSequence = 0;
function productionMark(production) {
  if (production.kind !== 'llm-extracted') return node('span', production.kind, {class:'uncertain'});
  const wrapper = node('span', null, {class:'production'});
  const explanation = node('span', null, {class:'production-detail', id:`production-${++productionSequence}`, hidden:''});
  append(explanation, node('strong', 'LLM-extracted'), node('span', production.review === null ? 'No review recorded.' : 'A separate review is recorded in the source.'), node('span', `Source text: ${production.sourceText}`));
  const icon = button('', () => show(true), 'production-icon');
  icon.setAttribute('aria-label', 'LLM-produced value');
  icon.setAttribute('aria-describedby', explanation.id);
  icon.setAttribute('aria-expanded', 'false');
  icon.setAttribute('aria-controls', explanation.id);
  icon.append(node('span', '✦', {'aria-hidden':'true'}));
  function show(open) { explanation.hidden = !open; icon.setAttribute('aria-expanded', String(open)); }
  icon.addEventListener('focus', () => show(true));
  icon.addEventListener('blur', () => show(false));
  icon.addEventListener('keydown', event => { if (event.key === 'Escape') { show(false); event.stopPropagation(); } });
  return append(wrapper, icon, explanation);
}
function fieldCell(record, field, origin) {
  const box = node('div');
  if (field === 'title') append(box, node('div', record.title, {class:'title'}), node('div', record.shelfmark, {class:'shelf'}));
  else if (field === 'attributions') {
    if (!record.attributions.length) box.append(node('span', 'Not recorded', {class:'missing'}));
    record.attributions.forEach((a, index) => {
      const item = node('div', null, {class:'field-item'});
      const identity = node('span');
      if (a.qualifier) identity.append(node('span', `${a.qualifier} `));
      identity.append(a.authority && origin !== 'source' ? node('a', a.label, {
        href:url('source', {id:record.id, field, from:origin, authority:String(index)}),
        id:`${origin}-${record.id}-authority-${index}`,
        'aria-label':`${a.label}: inspect authority identifier ${a.authority} for ${record.shelfmark}`
      }) : node('span', a.label));
      append(item, identity, node('span', a.role, {class:'role'}));
      if (!a.authority) item.append(node('span', 'Authority not recorded', {class:'role'}));
      box.append(item);
    });
  } else if (field === 'places') {
    if (!record.places.length) box.append(node('span', 'Not recorded', {class:'missing'}));
    record.places.forEach((place, index) => {
      const item = node('div', null, {class:'field-item'});
      const value = node('div', null, {class:'value-line'});
      value.append(node('span', place.label));
      const production = record.production[`places[${index}]`];
      if (production) value.append(productionMark(production));
      append(item, value, node('span', place.role, {class:'role'}));
      box.append(item);
    });
  } else box.append(node('span', describe(record, field), {class: (field === 'catalogueDate' ? record.catalogueDate.text : record[field]) === null ? 'missing' : ''}));
  box.append(sourceLink(record, field, origin));
  return box;
}
function heading(text) { const h = node('h2', text, {tabindex:'-1', id:'view-heading'}); main.append(h); return h; }
function choose(id, selected) {
  if (selected && state.selectedIds.length >= MAX_SELECTION) { announce(`Compare up to ${MAX_SELECTION} records. Remove one before adding another.`); return false; }
  state.selectedIds = selected ? [...state.selectedIds, id] : state.selectedIds.filter(value => value !== id);
  persist(); syncNav(); return true;
}
function scrollTable(table, name) {
  return append(node('div', null, {class:'scroll', tabindex:'0', role:'region', 'aria-label':name}), table);
}
function selectionTray() {
  const tray = node('div', null, {class:'selection', 'aria-label':'Retained selection', id:'selection-tray'});
  tray.append(node('strong', `${state.selectedIds.length} selected`));
  for (const id of state.selectedIds) {
    const record = catalogue.records.find(r => r.id === id);
    const remove = button(`Remove ${record.shelfmark}`, () => {
      choose(id, false); render(false); document.querySelector('#view-heading').focus();
    });
    tray.append(remove);
  }
  tray.append(node('a', 'Compare selected records', {href:url('comparison'), class:'button primary'}));
  return tray;
}
function catalogueRows() {
  document.querySelector('#results')?.remove();
  const region = node('div', null, {id:'results'});
  const records = filterRecords(catalogue.records, state.query);
  region.append(append(node('p', null, {class:'count metadata', role:'status'}), node('span', `${records.length} matching ${records.length === 1 ? 'record' : 'records'}`), node('span', `${state.selectedIds.length} selected across the catalogue`)));
  if (!records.length) {
    const empty = node('div', null, {class:'empty'});
    append(empty, node('p', 'No catalogue records match these filters.'), button('Reset filters', resetFilters));
    region.append(empty);
  } else {
    const table = node('table', null, {class:'catalogue'});
    const thead = node('thead'); const row = node('tr');
    ['Select','Object','Catalogue date','Attribution','Place','Material'].forEach(label => row.append(node('th', label, {scope:'col'})));
    thead.append(row); table.append(thead);
    const body = node('tbody');
    records.forEach(record => {
      const row = node('tr', null, {class: state.selectedIds.includes(record.id) ? 'selected' : ''});
      const checkbox = node('input', null, {type:'checkbox', id:`select-${record.id}`, 'aria-label':`Select ${record.shelfmark}: ${record.title}`});
      checkbox.checked = state.selectedIds.includes(record.id);
      checkbox.addEventListener('change', () => {
        if (!choose(record.id, checkbox.checked)) { checkbox.checked = false; return; }
        catalogueRows(); document.querySelector('#selection-tray').replaceWith(selectionTray()); document.getElementById(checkbox.id)?.focus();
      });
      row.append(append(node('td'), checkbox));
      ['title','catalogueDate','attributions','places','material'].forEach(field => row.append(append(node('td'), fieldCell(record, field, 'collection'))));
      body.append(row);
    });
    table.append(body); region.append(scrollTable(table, 'Matching catalogue records; scroll horizontally for all fields'));
  }
  document.querySelector('#collection-results').append(region);
}
function filterChanged() {
  state.query = {text:document.querySelector('#search').value, attribution:document.querySelector('#attribution').value, role:document.querySelector('#role').value};
  persist(); history.replaceState(null, '', url('collection')); catalogueRows(); syncNav();
  document.querySelector('#selection-tray').replaceWith(selectionTray());
}
function resetFilters() {
  state.query = {text:'', attribution:'', role:''};
  persist(); history.replaceState(null,'',url('collection')); render(false); document.querySelector('#search').focus();
}
function collectionView() {
  heading('Collection');
  const filters = node('div', null, {class:'filters'});
  const search = node('input', null, {type:'search', id:'search', placeholder:'Title, shelfmark, date, person, place or note', maxlength:'20000', 'aria-describedby':'search-scope'}); search.value = state.query.text; search.addEventListener('input', filterChanged);
  filters.append(append(node('label','Search catalogue text'),search));
  for (const [field,title,choices] of [['attribution','Attribution label',[['','All labels'],['Northfield workshop','Northfield workshop'],['A. Vale','A. Vale'],['R. Brook','R. Brook']]],['role','Attribution role',[['','All roles'],['photographer','Photographer'],['publisher','Publisher']]]]) {
    const select = node('select', null, {id:field}); choices.forEach(([value,label]) => select.append(node('option',label,{value}))); select.value = state.query[field]; select.addEventListener('change',filterChanged); filters.append(append(node('label',title),select));
  }
  filters.append(button('Reset filters',resetFilters)); main.append(filters);
  main.append(node('p','Search matches all typed words in descriptive fields. Attribution label and role must occur in the same entry; a label does not establish shared identity.',{class:'scope',id:'search-scope'}));
  main.append(node('div',null,{id:'collection-results'})); catalogueRows(); main.append(selectionTray());
}
function comparisonView() {
  heading('Comparison');
  if (!state.selectedIds.length) {
    main.append(append(node('div',null,{class:'empty'}),node('p','No records selected.'),node('a','Choose records from the collection',{href:url('collection')})));
  } else {
    const records = state.selectedIds.map(id => catalogue.records.find(record => record.id === id));
    const table = node('table',null,{class:'comparison'}); table.style.minWidth = `${150 + 260 * records.length}px`;
    const head = node('tr'); head.append(node('th','Catalogue field',{scope:'col'}));
    records.forEach(record => {
      const cell = node('th',null,{scope:'col'});
      append(cell,node('div',record.title,{class:'title'}),node('div',record.shelfmark,{class:'shelf'}),button('Remove from comparison', () => { choose(record.id,false); render(false); document.querySelector('#view-heading').focus(); })); head.append(cell);
    });
    table.append(append(node('thead'),head)); const body = node('tbody');
    fields.filter(field => field !== 'title').forEach(field => {
      const row = node('tr'); row.append(node('th',labels[field],{scope:'row'}));
      records.forEach(record => row.append(append(node('td'),fieldCell(record,field,'comparison')))); body.append(row);
    });
    table.append(body); main.append(scrollTable(table,'Selected source records; scroll horizontally to compare all columns'));
  }
  main.append(append(node('div',null,{class:'actions'}),node('a','Revise selection',{href:url('collection')})));
  const writing = node('section',null,{class:'write-area','aria-labelledby':'writing-heading'});
  writing.append(node('h2','Research notes',{id:'writing-heading'}));
  for (const [field,label,help] of [['question','Unresolved question','Required for download. Your question stays separate from catalogue statements.'],['observation','Observation (optional)','Your interpretation; no author identity or review is inferred.']]) {
    const labelNode = node('label',label,{for:field}); const area = node('textarea',null,{id:field,maxlength:'20000','aria-describedby':`${field}-help`}); area.value = state[field]; area.addEventListener('input', () => { state[field] = area.value; persist(); updateDownload(); });
    append(labelNode,area,node('p',help,{class:'help',id:`${field}-help`})); writing.append(labelNode);
  }
  const actions = node('div',null,{class:'actions'}); const downloadButton = button('Download question + selected records',download,'primary'); downloadButton.id = 'download'; actions.append(downloadButton);
  const fileInput = node('input',null,{type:'file',accept:'.json,application/json',id:'reopen',hidden:''}); fileInput.addEventListener('change',importInvestigation);
  const reopenButton = button('Reopen investigation JSON', () => fileInput.click()); reopenButton.id = 'reopen-trigger';
  append(actions,reopenButton,fileInput); writing.append(actions); main.append(writing); updateDownload();
}
function updateDownload() { const b = document.querySelector('#download'); if (b) b.disabled = !state.selectedIds.length || !state.question.trim(); }
function download() {
  const value = makeInvestigation(catalogue,state);
  const text = JSON.stringify(value,null,2);
  const blob = new Blob([text],{type:'application/json'});
  const address = URL.createObjectURL(blob); const a = node('a',null,{href:address,download:'synthetic-catalogue-investigation.json'}); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(address),10000);
  lastExport = text; document.querySelector('#export-status').textContent = 'Download requested. Check your downloads.'; announce(`Download requested: ${state.selectedIds.length} unchanged source records with your question and observation.`);
}
async function importInvestigation(event) {
  const file = event.target.files[0]; event.target.value = ''; if (!file) return;
  const startRevision = revision;
  try {
    if (file.size > 1000000) throw new Error('The file is larger than 1,000,000 bytes.');
    const candidate = readInvestigation(JSON.parse(await file.text()),catalogue);
    if (startRevision !== revision) throw new Error('The current work changed during file reading. Reopen the file again.');
    document.querySelector('#restore-preview')?.remove(); const preview = node('div',null,{id:'restore-preview'});
    append(preview,node('p',`Replace the current investigation with ${candidate.selectedIds.length} records from ${file.name}?`),node('p',candidate.question),button('Replace current investigation', () => {
      if (revision !== startRevision) { announce('Current work changed after preview. Reopen the file again.'); preview.remove(); return; }
      state = candidate; persist(); location.hash = url('comparison'); render(false); announce('Investigation reopened. Source records and authored text retained.'); document.querySelector('#view-heading').focus();
    }),button('Cancel', () => { preview.remove(); announce('Reopening cancelled. Current work retained.'); document.querySelector('#reopen-trigger').focus(); })); main.append(preview); preview.querySelector('button').focus();
  } catch (error) { announce(`Could not reopen: ${error.message} Current work retained.`); }
}
const mapping = {
  title:'The title and shelfmark are displayed verbatim.',
  catalogueDate:'Only catalogueDate.text is displayed. A null value is labelled “Not recorded”. Index bounds are retained for retrieval; no event date or duration is inferred.',
  attributions:'Each qualifier, label and role is displayed together. Null qualifier adds no wording. A linked name opens its recorded authority identifier here. A null authority is labelled “Authority not recorded”; matching labels are not merged into an entity.',
  places:'Each place label is displayed with its role. Production status is attached only to the affected place. Coordinates are preserved but not plotted or treated as depicted locations.',
  material:'The supplied material is displayed verbatim. Null is labelled “Not recorded”.',
  catalogueNote:'The supplied note is displayed as literal text. Null is labelled “Not recorded”.'
};
function sourceView(params) {
  const record = catalogue.records.find(r => r.id === params.get('id')); const field = params.get('field');
  if (!record || !fields.includes(field)) { heading('Source not found'); main.append(node('a','Return to collection',{href:url('collection')})); return; }
  const origin = params.get('from') === 'comparison' ? 'comparison' : 'collection';
  const panel = node('section',null,{class:'source-view'}); const back = node('a',`Back to ${origin}`,{href:url(origin),class:'back'}); back.addEventListener('click',() => { pendingFocus = params.has('authority') ? `${origin}-${record.id}-authority-${params.get('authority')}` : `${origin}-${record.id}-${field}`; }); panel.append(back); main.append(panel);
  panel.append(append(node('h2',null,{id:'view-heading',tabindex:'-1',class:'metadata'}), node('span',`${labels[field]} source`), node('span',record.shelfmark,{class:'shelf'})));
  const list = node('dl');
  function entry(label, content) { append(list,node('dt',label),append(node('dd'),typeof content === 'string' ? node('div',content) : content)); }
  entry('Displayed value',fieldCell(record,field,'source'));
  list.querySelector('.source')?.remove();
  if (field === 'attributions') {
    const authorities = node('div');
    record.attributions.forEach(a => {
      if (!a.authority) return;
      const copy = button(`Copy identifier for ${a.label}`, async () => {
        try { await navigator.clipboard.writeText(a.authority); announce(`Copied authority identifier for ${a.label}.`); }
        catch { announce('Copy is unavailable. Select and copy the displayed identifier.'); }
      });
      append(authorities, node('code',a.authority,{class:'authority-id'}), copy);
    });
    if (authorities.childElementCount) {
      entry('Authority identifier',authorities);
      entry('Identifier meaning','The identifier belongs to this recorded attribution. These synthetic URNs have no supplied external authority page. Shared labels alone do not establish identity.');
    }
  }
  entry('Original field',`records[${catalogue.records.indexOf(record)}].${field}`);
  entry('Source value',node('pre',JSON.stringify(record[field],null,2)));
  entry('Display mapping',mapping[field]);
  const semanticKey = {catalogueDate:'catalogueDate',attributions:'attribution',places:'place'}[field];
  if (semanticKey) entry('Catalogue semantics',catalogue.source.semantics[semanticKey]);
  if (field === 'places') {
    const productions = Object.entries(record.production).filter(([key]) => key.startsWith('places['));
    if (productions.length) {
      entry('Field production',node('pre',JSON.stringify(Object.fromEntries(productions),null,2)));
      entry('Review meaning',catalogue.source.semantics.production);
    } else entry('Field production','No production or review information recorded for this field.');
  } else entry('Field production','No production or review information recorded for this field.');
  entry('Source',catalogue.source.title); entry('Original producer','Not recorded');
  panel.append(list);
  const details = node('details'); append(details,node('summary','Complete source record and snapshot'),node('pre',JSON.stringify(record,null,2)),node('p','Source bytes: task/input.json'),node('p',`SHA-256 ${SOURCE_HASH}`),node('p','The bundled copy matched this hash at load. This checks byte agreement only; no catalogue interpretation, authorship or historical assertion was verified.')); panel.append(details);
}
function aboutView() {
  heading('Source & limits'); const box = node('section',null,{class:'about'}); const list = node('dl');
  for (const [label,text] of [['Material',catalogue.source.title],['Synthetic', 'Every record, name and coordinate is fictional test material. No images were supplied; this tool compares catalogue descriptions.'],['Rights',catalogue.source.rights],['Identity',catalogue.caseId],['Retention','Drafts are saved in this browser when storage is available. Download retains selected records and your notes in a portable JSON file. Original catalogue files are never overwritten.'],['Semantics','Date bounds are retrieval indices. Place roles distinguish depiction from holding institution. Shared attribution labels do not prove entity identity.'],['Format','This prototype uses synthetic-catalogue-investigation version 1. It is separate from the production application’s investigation formats.']]) append(list,node('dt',label),node('dd',text));
  box.append(list); main.append(box);
}
function render(focus = true) {
  const [route,search = ''] = location.hash.slice(1).split('?'); const params = new URLSearchParams(search); currentView = ['collection','comparison','source','about'].includes(route) ? route : 'collection';
  if (params.has('text')) {
    const candidate = {text:params.get('text') || '',attribution:params.get('attribution') || '',role:params.get('role') || ''};
    if (['','Northfield workshop','A. Vale','R. Brook'].includes(candidate.attribution) && ['','photographer','publisher'].includes(candidate.role)) state.query = candidate;
  }
  main.replaceChildren(); syncNav();
  if (currentView === 'collection') collectionView();
  if (currentView === 'comparison') comparisonView();
  if (currentView === 'source') sourceView(params);
  if (currentView === 'about') aboutView();
  if (pendingFocus) { (document.getElementById(pendingFocus) || document.querySelector('#view-heading')).focus(); pendingFocus = null; }
  else if (focus) document.querySelector('#view-heading')?.focus();
}
async function start() {
  try {
    const response = await fetch('./catalogue.json'); if (!response.ok) throw new Error(`Catalogue request failed (${response.status}).`);
    const bytes = await response.arrayBuffer();
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(value => value.toString(16).padStart(2,'0')).join('');
    if (hash !== SOURCE_HASH) throw new Error('The catalogue differs from the supplied snapshot. Restore catalogue.json from task/input.json.');
    catalogue = JSON.parse(new TextDecoder().decode(bytes));
    try {
      expectedStorage = localStorage.getItem(key);
      if (expectedStorage) { state = readInvestigation(JSON.parse(expectedStorage),catalogue); storageStatus.textContent = 'Draft restored from this browser. Export for a portable copy.'; }
    } catch (error) { storageBlocked = true; storageStatus.textContent = 'Browser draft unavailable. Use download.'; announce(`${error.message} Existing stored bytes have not been replaced.`); }
    render(false); window.addEventListener('hashchange',() => render());
    window.addEventListener('storage', event => { if (event.key === key || event.key === null) { storageBlocked = true; storageStatus.textContent = 'Another tab changed the draft. Download this copy.'; announce('Another tab changed or cleared browser storage. This tab will not overwrite it. Download to retain this copy.'); } });
    window.addEventListener('beforeunload',event => { if (storageBlocked && (state.selectedIds.length || state.question || state.observation)) { event.preventDefault(); event.returnValue = ''; } });
  } catch (error) { main.replaceChildren(node('h2','Catalogue unavailable'),node('p',error.message),node('p','Serve output with the documented local HTTP command, then reload.')); }
}
start();
