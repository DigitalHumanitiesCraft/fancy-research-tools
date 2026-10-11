import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parseNotebook, validateNotebook, reviseAnnotation, serializeNotebook } from './model.mjs';
const inputBytes = await readFile(new URL('task/input.json', import.meta.url));
const notebookBytes = await readFile(new URL('task/existing-notebook.json', import.meta.url));
const input = JSON.parse(inputBytes); const original = parseNotebook(notebookBytes.toString(), input);
const checks = [];
function check(name, fn) { fn(); checks.push({ name, status: 'passed' }); console.log(`PASS ${name}`); }
function rejected(change) { const value = structuredClone(original); change(value); assert.throws(() => validateNotebook(value, input)); }
check('Preserved input bytes SHA-256', () => {
  assert.equal(createHash('sha256').update(inputBytes).digest('hex'), 'd48ef37e9dd08cd17d12e7ee12dadc31ded23ecabdcff76b156af1beb973fb24');
  assert.equal(createHash('sha256').update(notebookBytes).digest('hex'), '8fc463fdd39d5f680944ca6a39406fc18baddde9c98dcdccc8f84be3c3e1a147');
});
check('Existing notebook and review survive serialize/reopen', () => assert.deepEqual(parseNotebook(serializeNotebook(original, input), input), original));
check('Both identical passage occurrences retain distinct offsets', () => {
  const a = original.annotations[0], start = input.sources[0].text.indexOf(a.quote, a.end);
  const second = { ...a, id: 'second', start, end: start + a.quote.length, review: null };
  const notebook = validateNotebook({ ...original, annotations: [a, second] }, input);
  assert.equal(notebook.annotations[1].start, 120); assert.equal(notebook.annotations[1].end, 148);
});
check('No-op revision retains review; each substantive field clears it', () => {
  const a = original.annotations[0]; assert.deepEqual(reviseAnnotation(a, { note: a.note }).review, a.review);
  for (const field of ['sourceId','start','end','quote','category','note','creator']) assert.equal(reviseAnnotation(a, { [field]: field === 'start' || field === 'end' ? 99 : 'changed' }).review, null);
});
check('Editing category preserves untouched CRLF and surrounding whitespace', () => {
  const notebook = structuredClone(original); notebook.annotations[0].note = '  First\r\nsecond  '; notebook.annotations[0].creator = '  Agent\r\nName  ';
  notebook.annotations[0] = reviseAnnotation(notebook.annotations[0], { category: 'question' });
  const result = parseNotebook(serializeNotebook(notebook, input), input);
  assert.equal(result.annotations[0].note, '  First\r\nsecond  '); assert.equal(result.annotations[0].creator, '  Agent\r\nName  ');
});
check('Unicode café source anchors survive interchange', () => {
  const text = input.sources[1].text, start = text.indexOf('café');
  const a = { ...original.annotations[0], sourceId: input.sources[1].id, start, end: start + 4, quote: 'café', review: null };
  assert.equal(parseNotebook(serializeNotebook({ ...original, annotations: [a] }, input), input).annotations[0].quote, 'café');
});
check('Unknown fields at notebook, annotation and review levels rejected', () => {
  rejected((n) => { n.extra = 1; }); rejected((n) => { n.annotations[0].extra = 1; }); rejected((n) => { n.annotations[0].review.extra = 1; });
});
check('Changed quote, invalid offset, unknown source and category rejected', () => {
  rejected((n) => { n.annotations[0].quote = 'altered'; }); rejected((n) => { n.annotations[0].start = -1; }); rejected((n) => { n.annotations[0].end = 2.5; }); rejected((n) => { n.annotations[0].sourceId = 'other'; }); rejected((n) => { n.annotations[0].category = 'unsupported'; });
});
check('Duplicate IDs, wrong case/version, missing fields, null and wrong types rejected', () => {
  rejected((n) => n.annotations.push(n.annotations[0])); rejected((n) => { n.caseId = 'other'; }); rejected((n) => { n.schemaVersion = 2; }); rejected((n) => { delete n.annotations[0].creator; }); rejected((n) => { n.annotations[0].review = []; }); assert.throws(() => validateNotebook(null, input)); rejected((n) => { n.annotations[0].note = 4; });
});
check('Empty notebook accepted and malformed/oversized JSON rejected', () => {
  assert.equal(validateNotebook({ ...original, annotations: [] }, input).annotations.length, 0);
  assert.throws(() => parseNotebook('{', input)); assert.throws(() => parseNotebook(' '.repeat(1_000_001), input));
});
check('Imported markup retained as literal annotation text', () => {
  const notebook = structuredClone(original); notebook.annotations[0].note = '<img src=x onerror=alert(1)> & "quoted"';
  assert.equal(parseNotebook(serializeNotebook(notebook, input), input).annotations[0].note, notebook.annotations[0].note);
});
await mkdir(new URL('evidence/', import.meta.url), { recursive: true });
await writeFile(new URL('evidence/model-checks.json', import.meta.url), JSON.stringify({ runtime: process.version, checks }, null, 2) + '\n');
console.log(`${checks.length} checks passed`);
