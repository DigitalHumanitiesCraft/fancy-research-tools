export const MAX_BYTES = 1_000_000;
const object = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
function fields(value, expected, where) {
  if (!object(value)) throw new Error(`${where} must be an object.`);
  const keys = Object.keys(value);
  if (keys.length !== expected.length || keys.some((k) => !expected.includes(k))) {
    throw new Error(`${where} has missing or unsupported fields. Expected: ${expected.join(', ')}.`);
  }
}
export function validateNotebook(value, input) {
  fields(value, input.notebookContract.fields, 'Notebook');
  if (value.schemaVersion !== 1) throw new Error('Only notebook schema version 1 is supported.');
  if (value.caseId !== input.caseId) throw new Error('This notebook belongs to a different source case.');
  if (!Array.isArray(value.annotations) || value.annotations.length > 200) throw new Error('Annotations must be a list of at most 200 entries.');
  const ids = new Set();
  for (const a of value.annotations) {
    fields(a, input.notebookContract.annotationFields, 'Annotation');
    for (const name of ['id', 'sourceId', 'quote', 'category', 'note', 'creator']) {
      if (typeof a[name] !== 'string' || a[name].length > 20_000) throw new Error(`Annotation ${name} must be a string of at most 20,000 characters.`);
    }
    if (!a.id || ids.has(a.id)) throw new Error('Annotation IDs must be nonempty and unique.');
    ids.add(a.id);
    const source = input.sources.find((s) => s.id === a.sourceId);
    if (!source) throw new Error(`Unknown source: ${a.sourceId}`);
    if (!Number.isInteger(a.start) || !Number.isInteger(a.end) || a.start < 0 || a.end <= a.start || a.end > source.text.length || source.text.slice(a.start, a.end) !== a.quote) throw new Error(`The quotation or range for ${a.id} does not match its source. Start is inclusive; end is exclusive.`);
    if (!input.notebookContract.categories.includes(a.category)) throw new Error(`Unsupported category: ${a.category}`);
    if (a.review !== null) {
      fields(a.review, ['reviewer', 'criterion', 'result'], 'Review');
      for (const field of ['reviewer', 'criterion', 'result']) if (typeof a.review[field] !== 'string' || a.review[field].length > 20_000) throw new Error(`Review ${field} must be a string of at most 20,000 characters.`);
    }
  }
  if (new TextEncoder().encode(JSON.stringify(value, null, 2) + '\n').length > MAX_BYTES) throw new Error('Formatted notebook exceeds the 1,000,000-byte limit.');
  return structuredClone(value);
}
export function parseNotebook(text, input) {
  if (new TextEncoder().encode(text).length > MAX_BYTES) throw new Error('Notebook exceeds the 1,000,000-byte limit.');
  let value;
  try { value = JSON.parse(text); } catch { throw new Error('This is not valid JSON. Choose a notebook JSON file.'); }
  return validateNotebook(value, input);
}
export function reviseAnnotation(original, changes) {
  const next = { ...structuredClone(original), ...changes };
  if (['sourceId', 'start', 'end', 'quote', 'category', 'note', 'creator'].some((field) => next[field] !== original[field])) next.review = null;
  return next;
}
export function serializeNotebook(value, input) {
  validateNotebook(value, input);
  return JSON.stringify(value, null, 2) + '\n';
}
