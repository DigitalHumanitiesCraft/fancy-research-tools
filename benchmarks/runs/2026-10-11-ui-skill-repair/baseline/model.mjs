export const FORMAT = 'synthetic-catalogue-investigation';
export const SOURCE_HASH = '9897cffd1990dac5b5476a0ed6aa7630eed0802a6fbc4196c9fdf4d285fc382c';
export const MAX_SELECTION = 4;
export const INITIAL_QUERY = { text: '', attribution: 'Northfield workshop', role: 'photographer' };
export const fields = ['title', 'catalogueDate', 'attributions', 'places', 'material', 'catalogueNote'];
export const labels = { title: 'Object', catalogueDate: 'Catalogue date', attributions: 'Attribution', places: 'Place', material: 'Material', catalogueNote: 'Catalogue note' };
export function filterRecords(records, query) {
  const words = query.text.trim().toLocaleLowerCase('en').split(/\s+/).filter(Boolean);
  return records.filter(record => {
    const haystack = [record.id, record.shelfmark, record.title, record.catalogueDate.text, record.material, record.catalogueNote, ...record.attributions.map(a => `${a.label} ${a.role} ${a.qualifier ?? ''}`), ...record.places.map(p => `${p.label} ${p.role}`)].filter(Boolean).join(' ').toLocaleLowerCase('en');
    return words.every(word => haystack.includes(word)) && ((!query.attribution && !query.role) || record.attributions.some(a => (!query.attribution || a.label === query.attribution) && (!query.role || a.role === query.role)));
  });
}
export function makeInvestigation(catalogue, state) {
  return {
    format: FORMAT, schemaVersion: 1, caseId: catalogue.caseId, synthetic: catalogue.synthetic,
    source: structuredClone(catalogue.source),
    provenance: { input: 'task/input.json', sha256: SOURCE_HASH, transformations: 'Selected records are copied without field changes; display formatting is not written into source records.' },
    query: structuredClone(state.query), selectedIds: [...state.selectedIds],
    records: state.selectedIds.map(id => structuredClone(catalogue.records.find(record => record.id === id))),
    interpretation: { unresolvedQuestion: state.question, observation: state.observation, author: null, review: null }
  };
}
function equal(a, b) {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(key => Object.hasOwn(b, key) && equal(a[key], b[key]));
}
export function readInvestigation(value, catalogue) {
  if (!value || value.format !== FORMAT || value.schemaVersion !== 1 || value.caseId !== catalogue.caseId || value.synthetic !== true) throw new Error('This is not a version 1 investigation for this synthetic catalogue.');
  if (!Array.isArray(value.selectedIds) || value.selectedIds.length > MAX_SELECTION || new Set(value.selectedIds).size !== value.selectedIds.length || value.selectedIds.some(id => !catalogue.records.some(record => record.id === id))) throw new Error('The selected record identities are invalid.');
  if (!value.query || typeof value.query.text !== 'string' || !['', 'Northfield workshop', 'A. Vale', 'R. Brook'].includes(value.query.attribution) || !['', 'photographer', 'publisher'].includes(value.query.role)) throw new Error('The saved filter is unsupported.');
  if (!value.interpretation || typeof value.interpretation.unresolvedQuestion !== 'string' || typeof value.interpretation.observation !== 'string') throw new Error('The question or observation is missing.');
  if (value.interpretation.unresolvedQuestion.length > 20000 || value.interpretation.observation.length > 20000 || value.query.text.length > 20000) throw new Error('A text field exceeds 20,000 characters.');
  const state = {query: value.query, selectedIds: value.selectedIds, question: value.interpretation.unresolvedQuestion, observation: value.interpretation.observation};
  if (!equal(value, makeInvestigation(catalogue, state))) throw new Error('The source evidence, metadata or format has changed. Existing work was kept.');
  return structuredClone(state);
}
export function describe(record, field) {
  if (field === 'catalogueDate') return record.catalogueDate.text ?? 'Not recorded';
  if (field === 'attributions') return record.attributions.length ? record.attributions.map(a => `${a.qualifier ? a.qualifier + ' ' : ''}${a.label} · ${a.role}`).join('\n') : 'Not recorded';
  if (field === 'places') return record.places.length ? record.places.map(p => `${p.label} · ${p.role}`).join('\n') : 'Not recorded';
  return record[field] ?? 'Not recorded';
}
