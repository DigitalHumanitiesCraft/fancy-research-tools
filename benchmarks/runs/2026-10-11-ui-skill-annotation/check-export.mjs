import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const input = JSON.parse(await readFile(new URL('task/input.json', import.meta.url)));
const first = await readFile(new URL('evidence/downloaded-notebook.json', import.meta.url));
const reopened = await readFile(new URL('evidence/reopened-notebook.json', import.meta.url));
assert.deepEqual(reopened, first);
const notebook = JSON.parse(first);
assert.equal(notebook.caseId, input.caseId);
assert.equal(notebook.annotations.length, 3);
assert.deepEqual(notebook.annotations.map((a) => [a.sourceId, a.start, a.end, a.category]), [
  ['demo-note-1', 0, 28, 'observation'], ['demo-note-1', 120, 148, 'question'], ['demo-note-2', 84, 162, 'speculation'],
]);
for (const a of notebook.annotations) {
  assert.equal(input.sources.find((s) => s.id === a.sourceId).text.slice(a.start, a.end), a.quote);
  assert.equal(a.review, null);
}
assert.equal(notebook.annotations[0].note, 'The first occurrence records the visible water condition; the later repetition may be copied.');
assert.equal(notebook.annotations[1].note, 'Does the repeated wording reflect a second observation or copying?');
assert.equal(notebook.annotations[2].note, 'The gate is proposed as a cause, but its movement was not observed.');
assert.equal(notebook.annotations[2].creator, 'Synthetic trial agent');
const result = 'PASS Actual browser download and reopened download are byte-identical. Three expected annotations retain exact source slices, categories, interpretations, creator and cleared reviews.\n';
console.log(result); await writeFile(new URL('evidence/export-check.txt', import.meta.url), result);
