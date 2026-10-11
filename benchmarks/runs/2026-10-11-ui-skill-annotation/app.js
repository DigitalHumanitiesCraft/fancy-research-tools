import { MAX_BYTES, parseNotebook, validateNotebook, serializeNotebook, reviseAnnotation } from './model.mjs';
const $ = (id) => document.getElementById(id);
const KEY = 'synthetic-field-notes-probe-v1';
let input, notebook, sourceId, draft = null, storedBytes = null, storageBlocked = false, revision = 0;
let sourceFingerprint;
const copy = (value) => structuredClone(value);
function el(tag, text, className) { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; }
function announce(text, error = false) { $('message').textContent = text; $('message').hidden = false; $('message').className = error ? 'error' : ''; }
function currentSource() { return input.sources.find((s) => s.id === sourceId); }
function download(text, name) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json;charset=utf-8' }));
  const a = el('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
function failStorage(message) { storageBlocked = true; $('storage').textContent = message; $('recover').hidden = storedBytes === null; }
function persist() {
  revision++;
  if (storageBlocked) return;
  try {
    if (localStorage.getItem(KEY) !== storedBytes) { failStorage('Another tab changed browser recovery. Download this notebook before reloading.'); return; }
    const next = JSON.stringify({ version: 1, sourceFingerprint, notebook, sourceId, draft });
    localStorage.setItem(KEY, next); storedBytes = next;
    $('storage').textContent = draft ? 'Unfinished annotation saved in browser recovery · not in notebook download' : 'Notebook saved in browser recovery · download for a portable copy';
  } catch { failStorage('Browser recovery unavailable. Save the annotation, then download the notebook.'); }
}
function renderSource() {
  const s = currentSource(); $('source-choice').value = s.id; $('source-text').value = s.text; $('source-author').textContent = s.author; $('source-date').textContent = s.date;
  $('source-details').replaceChildren();
  for (const [name, value] of [['Source ID', s.id], ['Version', s.technicalProvenance.sourceVersion], ['Derivation', s.technicalProvenance.derivation], ['Source path', s.technicalProvenance.sourcePath]]) {
    const row = el('div'); row.append(el('dt', name), el('dd', value)); $('source-details').append(row);
  }
  selectionStatus();
}
function selectionStatus() {
  const { selectionStart: start, selectionEnd: end } = $('source-text');
  $('selection-range').textContent = end > start ? `Selected range ${start}–${end} (end exclusive)` : 'No passage selected';
}
function renderedReview(a) {
  if (!a.review) return 'No review recorded';
  return `Recorded reviewer: ${a.review.reviewer || '(not provided)'}\nCriterion: ${a.review.criterion || '(not provided)'}\nResult: ${a.review.result || '(not provided)'}`;
}
function effectiveDraft() {
  const original = notebook.annotations.find((a) => a.id === draft.value.id);
  return original ? reviseAnnotation(original, draft.value) : { ...copy(draft.value), review: null };
}
function renderDraftReview() {
  const value = effectiveDraft(); const original = notebook.annotations.find((a) => a.id === value.id);
  $('draft-review').textContent = original?.review && !value.review ? 'The saved review will be removed when these changes are saved.' : renderedReview(value);
}
function renderEditor() {
  $('editor').hidden = !draft; $('empty-editor').hidden = Boolean(draft); $('edit-state').textContent = draft ? 'Unfinished annotation' : 'No draft';
  if (!draft) return;
  const a = draft.value;
  $('quote').textContent = a.quote; $('quote-source').textContent = input.sources.find((s) => s.id === a.sourceId).title; $('quote-range').textContent = `Range ${a.start}–${a.end}`;
  $('category').value = a.category; $('note').value = a.note; $('creator').value = a.creator; renderDraftReview();
}
async function confirmAction(title, text, action) {
  $('confirm-heading').textContent = title; $('confirm-text').textContent = text; $('confirm-yes').textContent = action;
  const dialog = $('confirm-dialog'); dialog.showModal(); $('confirm-no').focus();
  return new Promise((resolve) => {
    let result = false;
    $('confirm-yes').onclick = () => { result = true; dialog.close(); };
    $('confirm-no').onclick = () => dialog.close();
    dialog.addEventListener('close', () => resolve(result), { once: true });
  });
}
async function leaveDraft() {
  if (!draft) return true;
  if (!await confirmAction('Discard unfinished annotation?', 'Your saved annotations will remain. The unfinished annotation will be removed from browser recovery.', 'Discard draft')) return false;
  draft = null; renderEditor(); persist(); return true;
}
async function showPassage(a, edit = false) {
  if (!await leaveDraft()) return;
  sourceId = a.sourceId; renderSource();
  if (edit) { draft = { value: copy(a) }; renderEditor(); }
  persist(); $('source-text').focus(); $('source-text').setSelectionRange(a.start, a.end); selectionStatus();
  if (edit) $('note').focus();
}
function renderAnnotations() {
  $('saved-count').textContent = `${notebook.annotations.length} saved`;
  $('annotations').replaceChildren();
  if (!notebook.annotations.length) { $('annotations').append(el('p', 'No saved annotations. Select a passage above to begin.', 'notebook-empty')); return; }
  notebook.annotations.forEach((a, index) => {
    const row = el('article', undefined, 'annotation-row'); row.setAttribute('aria-label', `Annotation ${index + 1}`);
    const evidence = el('div'); const s = input.sources.find((s) => s.id === a.sourceId);
    evidence.append(el('h3', s.title), el('blockquote', a.quote), el('div', `Range ${a.start}–${a.end} · ${a.sourceId}`, 'meta'));
    const interpretation = el('div'); interpretation.append(el('span', a.category, 'category'), el('p', a.note || '(No interpretation entered)'), el('p', `Annotation creator: ${a.creator || '(not provided)'} · self-declared`, 'meta'), el('div', renderedReview(a), 'review'));
    const actions = el('div', undefined, 'actions');
    for (const [label, handler] of [['Show passage', () => showPassage(a)], ['Edit', () => showPassage(a, true)], ['Delete', async () => {
      if (draft) { announce('Save or discard the unfinished annotation before deleting saved work.', true); return; }
      if (!await confirmAction('Delete annotation?', `Delete the annotation at range ${a.start}–${a.end} in ${s.title}? Your source and original file remain unchanged.`, 'Delete annotation')) return;
      notebook.annotations = notebook.annotations.filter((item) => item.id !== a.id); persist(); renderAnnotations(); announce('Annotation deleted from this notebook.'); $('notebook-heading').tabIndex = -1; $('notebook-heading').focus();
    }]]) {
      const button = el('button', label); button.setAttribute('aria-label', `${label} annotation ${index + 1}`); button.onclick = handler; actions.append(button);
    }
    row.append(evidence, interpretation, actions); $('annotations').append(row);
  });
}
async function importText(text, readRevision) {
  try {
    const parsed = parseNotebook(text, input);
    $('import-error').hidden = true;
    if (revision !== readRevision) throw new Error('Work changed while the file was being read. Open it again after saving or discarding the current draft.');
    if (draft) throw new Error('Save or discard the unfinished annotation before opening another notebook.');
    if (!await confirmAction('Replace current notebook?', `The opened notebook contains ${parsed.annotations.length} saved annotations. Download your current notebook first if you need both copies.`, 'Replace notebook')) return;
    if (revision !== readRevision) throw new Error('Work changed during opening. Current work was kept. Try opening again.');
    notebook = parsed; sourceId = parsed.annotations[0]?.sourceId || input.sources[0].id; draft = null;
    persist(); renderSource(); renderEditor(); renderAnnotations(); $('import-dialog').close(); announce('Notebook opened. Original file unchanged.'); $('source-choice').focus();
  } catch (error) { $('import-error').textContent = `Not opened: ${error.message} Current work was kept.`; $('import-error').hidden = false; }
}
function bind() {
  $('source-choice').onchange = async () => { const next = $('source-choice').value; $('source-choice').value = sourceId; if (!await leaveDraft()) return; sourceId = next; renderSource(); persist(); $('source-text').focus(); };
  for (const event of ['select', 'keyup', 'mouseup']) $('source-text').addEventListener(event, selectionStatus);
  $('annotate').onclick = () => {
    const start = $('source-text').selectionStart, end = $('source-text').selectionEnd;
    if (end <= start) { announce('Select a nonempty passage in the source text first.', true); $('source-text').focus(); return; }
    const anchor = { sourceId, start, end, quote: currentSource().text.slice(start, end) };
    if (draft) Object.assign(draft.value, anchor);
    else draft = { value: { id: crypto.randomUUID(), ...anchor, category: 'observation', note: '', creator: '', review: null } };
    renderEditor(); persist(); announce('Passage anchored. Add your interpretation and creator name, then save.'); $('category').focus();
  };
  for (const field of ['category', 'note', 'creator']) $(field).addEventListener('input', () => { if (!draft) return; draft.value[field] = $(field).value; renderDraftReview(); persist(); });
  $('editor').onsubmit = (event) => {
    event.preventDefault(); if (!draft) return;
    try {
      const next = effectiveDraft(); const annotations = notebook.annotations.filter((a) => a.id !== next.id);
      const index = notebook.annotations.findIndex((a) => a.id === next.id); annotations.splice(index < 0 ? annotations.length : index, 0, next);
      notebook = validateNotebook({ ...notebook, annotations }, input); draft = null; persist(); renderEditor(); renderAnnotations(); announce('Annotation saved to this notebook. Download to retain a portable copy.'); $('annotate').focus();
    } catch (error) { announce(error.message, true); }
  };
  $('discard').onclick = async () => { if (await leaveDraft()) { announce('Unfinished annotation discarded. Saved annotations are unchanged.'); $('annotate').focus(); } };
  $('open').onclick = () => { if (draft) { announce('Save or discard the unfinished annotation before opening a notebook.', true); return; } $('import-error').hidden = true; $('file').value = ''; $('import-dialog').showModal(); };
  $('close-import').onclick = () => $('import-dialog').close();
  $('file').onchange = async () => { const file = $('file').files[0]; if (!file) return; const startRevision = revision; if (file.size > MAX_BYTES) { $('import-error').textContent = 'Not opened: file exceeds 1,000,000 bytes. Current work was kept.'; $('import-error').hidden = false; return; } try { await importText(await file.text(), startRevision); } catch { $('import-error').textContent = 'Could not read this file. Current work was kept.'; $('import-error').hidden = false; } };
  $('paste').onclick = () => importText($('json').value, revision);
  $('example').onclick = async () => { const startRevision = revision; try { await importText(await (await fetch('task/existing-notebook.json')).text(), startRevision); } catch { $('import-error').textContent = 'Could not read the supplied notebook. Current work was kept.'; $('import-error').hidden = false; } };
  $('export').onclick = () => {
    if (draft) { announce('Save or discard the unfinished annotation before downloading. It is not yet part of the notebook.', true); return; }
    try { download(serializeNotebook(notebook, input), 'field-note-notebook.json'); announce('Notebook download requested. Check your browser’s downloads for field-note-notebook.json.'); } catch (error) { announce(error.message, true); }
  };
  $('recover').onclick = () => { try { const bytes = localStorage.getItem(KEY); if (bytes !== null) download(bytes, 'field-note-browser-recovery.json'); } catch { announce('Browser recovery cannot be read. Download the current notebook instead.', true); } };
  addEventListener('storage', (event) => { if (event.key === KEY || event.key === null) failStorage('Another tab changed browser recovery. This tab is kept in memory; download before reloading.'); });
  addEventListener('beforeunload', (event) => { if (draft || storageBlocked) { event.preventDefault(); event.returnValue = ''; } });
}
async function boot() {
  input = await (await fetch('task/input.json')).json(); sourceFingerprint = JSON.stringify(input.sources);
  notebook = parseNotebook(await (await fetch('task/existing-notebook.json')).text(), input); sourceId = input.sources[0].id;
  for (const s of input.sources) { const option = el('option', s.title); option.value = s.id; $('source-choice').append(option); }
  $('rights').textContent = input.rights; $('storage').textContent = 'Supplied notebook opened · original file unchanged';
  try {
    storedBytes = localStorage.getItem(KEY);
    if (storedBytes !== null) {
      const saved = JSON.parse(storedBytes);
      if (!saved || saved.version !== 1 || saved.sourceFingerprint !== sourceFingerprint || Object.keys(saved).sort().join() !== ['version', 'sourceFingerprint', 'notebook', 'sourceId', 'draft'].sort().join()) throw new Error('Unsupported recovery format');
      const recovered = validateNotebook(saved.notebook, input);
      if (!input.sources.some((s) => s.id === saved.sourceId)) throw new Error('Unknown recovery source');
      if (saved.draft !== null) {
        if (!saved.draft || Object.keys(saved.draft).join() !== 'value') throw new Error('Unknown draft fields');
        validateNotebook({ ...recovered, annotations: [saved.draft.value] }, input);
        if (saved.draft.value.sourceId !== saved.sourceId) throw new Error('Draft source mismatch');
      }
      notebook = recovered; sourceId = saved.sourceId; draft = saved.draft;
      $('storage').textContent = draft ? 'Recovered unfinished annotation and notebook from this browser' : 'Notebook recovered from this browser · download for a portable copy';
    }
  } catch { failStorage('Browser recovery could not be opened and remains untouched. The supplied notebook is displayed.'); }
  renderSource(); renderEditor(); renderAnnotations(); bind();
}
boot().catch((error) => { $('storage').textContent = 'Could not load local source files. Start this tool with node serve.mjs.'; announce(error.message, true); });
