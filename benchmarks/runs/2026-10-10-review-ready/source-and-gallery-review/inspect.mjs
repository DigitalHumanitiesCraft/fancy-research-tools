import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const digest = (value) => createHash('sha256').update(value).digest('hex');
const documents = [2, 6].map((number) => {
  const name = `milton-discussion-${String(number).padStart(3, '0')}`;
  const raw = readFileSync(new URL(`${name}.html`, import.meta.url));
  const html = raw.toString('utf8');
  const matches = [...html.matchAll(/<pre>([\s\S]*?)<\/pre>/g)];
  if (matches.length !== 1) throw new Error('Expected exactly one product pre element');
  const text = matches[0][1];
  if (/[<>&]/.test(text)) throw new Error('This extraction expects no markup or entities in pre');
  writeFileSync(new URL(`${name}.txt`, import.meta.url), text);
  return {
    id: `nhc-al142024-discussion-${String(number).padStart(3, '0')}`,
    number,
    url: `https://www.nhc.noaa.gov/archive/2024/al14/al142024.discus.${String(number).padStart(3, '0')}.shtml`,
    rawFile: `${name}.html`,
    rawSha256: digest(raw),
    textFile: `${name}.txt`,
    textSha256: digest(text),
    textLength: text.length,
    characterEncoding: 'UTF-8',
    newlineCounts: { cr: [...text.matchAll(/\r/g)].length, lf: [...text.matchAll(/\n/g)].length },
    extraction: 'Literal text inside the single pre element, with its initial and final newline retained. No whitespace normalization or entity decoding needed for these source products.',
    text,
  };
});
const candidates = [
  [2, 'observation', 'Scatterometer data around midday confirmed', '35 kt.'],
  [2, 'uncertainty', 'Given that the system is still', '020/3 kt.'],
  [6, 'forecast', 'The frontal feature is forecast to weaken', 'on Milton.'],
  [6, 'uncertainty', 'The NHC forecast is \nraised', 'too low.'],
];
const passages = candidates.map(([number, proposedCategory, beginning, ending]) => {
  const doc = documents.find((candidate) => candidate.number === number);
  const start = doc.text.indexOf(beginning);
  const end = doc.text.indexOf(ending, start) + ending.length;
  if (start < 0 || end < start) throw new Error(`Anchor not found: ${beginning}`);
  return { documentId: doc.id, start, end, exact: doc.text.slice(start, end), proposedCategory, interpretationStatus: 'agent-proposed demonstration, not a human-validated annotation' };
});
const result = { documents, passages, rights: { url: 'https://www.weather.gov/disclaimer', rawFile: 'nws-disclaimer.html', rawSha256: digest(readFileSync(new URL('nws-disclaimer.html', import.meta.url))) } };
writeFileSync(new URL('source-analysis.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({documents: documents.map(({text, ...rest}) => rest), passages, rights: result.rights}, null, 2));
