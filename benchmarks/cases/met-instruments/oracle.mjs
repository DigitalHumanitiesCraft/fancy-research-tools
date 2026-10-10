import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// This oracle deliberately depends only on preserved source responses and Node.
const root = new URL("../../../", import.meta.url);
const raw = new URL("data/met-instruments/raw/", root);
const expectedPath = new URL("expected.json", import.meta.url);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const listingBytes = await readFile(new URL("listing.json", raw));
const listing = JSON.parse(listingBytes.toString("utf8"));
const ids = [...new Set(listing.objectIDs)].sort((a, b) => a - b).slice(0, 60);
assert.equal(ids.length, 60);
assert.ok(ids.every(Number.isSafeInteger));
const inputs = [{ path: "data/met-instruments/raw/listing.json", sha256: hash(listingBytes) }];
const records = [];
for (const id of ids) {
  const bytes = await readFile(new URL(`${id}.json`, raw));
  const record = JSON.parse(bytes.toString("utf8"));
  assert.equal(record.objectID, id);
  assert.equal(record.department, "Musical Instruments");
  inputs.push({ path: `data/met-instruments/raw/${id}.json`, sha256: hash(bytes) });
  records.push(record);
}

const value = (record, key) =>
  typeof record[key] === "string" && record[key].trim() ? record[key] : null;
const fold = (text) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replaceAll("ß", "ss");
const searchFields = ["title", "objectName", "culture", "objectDate", "medium"];
const cases = [
  { id: "all", filters: {} },
  { id: "flute", filters: { q: "flute" } },
  { id: "lutes", filters: { classification: "Chordophone-Lute-plucked-unfretted" } },
  { id: "american", filters: { culture: "American" } },
  { id: "missing-culture", filters: { missing: "culture" } },
  { id: "missing-date", filters: { missing: "objectDate" } },
  { id: "missing-medium", filters: { missing: "medium" } },
  { id: "combined", filters: { q: "wood", culture: "American" } },
  { id: "diacritic", filters: { q: "ud" } },
  { id: "cross-field-phrase", filters: { q: "organ pipe organ" } },
  { id: "empty", filters: { q: "zzzz-no-match" } },
];
function group(selected, field) {
  const counts = new Map();
  for (const record of selected) {
    const label = value(record, field);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts].map(([label, count]) => ({ value: label, count })).sort((a, b) => {
    if (a.value === b.value) return 0;
    if (a.value === null) return 1;
    if (b.value === null) return -1;
    return a.value < b.value ? -1 : 1;
  });
}
const output = {
  caseId: "met-instruments",
  caseVersion: "0.2",
  inputHashes: inputs,
  sourceSelection: "60 lowest unique numeric objectIDs from the preserved department 18 listing",
  sourceListingTotal: listing.total,
  queries: cases.map(({ id, filters }) => {
    const selected = records.filter((record) => {
      if (filters.classification && value(record, "classification") !== filters.classification) return false;
      if (filters.culture && value(record, "culture") !== filters.culture) return false;
      if (filters.missing && value(record, filters.missing) !== null) return false;
      const searchable = searchFields.map((field) => value(record, field) ?? "").join(" ");
      return !filters.q || fold(searchable).includes(fold(filters.q.trim()));
    });
    return {
      id,
      filters,
      ids: selected.map((record) => String(record.objectID)),
      denominator: selected.length,
      groups: Object.fromEntries(["classification", "culture", "objectName"].map((field) => [field, group(selected, field)])),
      missing: Object.fromEntries(["culture", "objectDate", "medium"].map((field) => [field, selected.filter((record) => value(record, field) === null).length])),
    };
  }),
};

if (process.argv.includes("--write")) {
  await writeFile(expectedPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote frozen expectations to ${fileURLToPath(expectedPath)}.`);
} else {
  const expected = JSON.parse(await readFile(expectedPath, "utf8"));
  assert.deepEqual(output, expected, "Source hashes or expected results changed. Investigate before revising the case.");
  console.log(`Verified ${records.length} source records and ${cases.length} expected queries.`);
}
