import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../data/met-instruments/", import.meta.url));
const api = "https://collectionapi.metmuseum.org/public/collection/v1";
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const read = (path) => readFile(`${root}/${path}`);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const blankToNull = (value) => (value === "" ? null : value);

async function retrieve(url, path) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(`${root}/${path}`, bytes);
  return { path, url, sha256: sha256(bytes) };
}

await mkdir(`${root}/raw`, { recursive: true });
if (process.argv.includes("--fetch")) {
  try {
    await read("manifest.json");
    throw new Error("Snapshot already exists. Preserve it and create a separately named revision.");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const startedAt = new Date().toISOString();
  const files = [await retrieve(`${api}/objects?departmentIds=18`, "raw/listing.json")];
  const listing = JSON.parse(await read("raw/listing.json"));
  const ids = [...new Set(listing.objectIDs)].sort((a, b) => a - b).slice(0, 60);
  for (const id of ids) files.push(await retrieve(`${api}/objects/${id}`, `raw/${id}.json`));
  files.push(
    await retrieve(
      "https://raw.githubusercontent.com/metmuseum/openaccess/master/LICENSE",
      "raw/LICENSE",
    ),
  );
  await writeFile(
    `${root}/manifest.json`,
    json({
      datasetId: "met-instruments",
      title: "Musical instruments in The Metropolitan Museum of Art",
      source: "https://github.com/metmuseum/openaccess",
      documentation: "https://metmuseum.github.io/",
      license: "CC0-1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      startedAt,
      retrievedAt: new Date().toISOString(),
      selection: "First 60 unique numeric object IDs in ascending order from department 18 listing",
      sourceListingTotal: listing.total,
      selectedIds: ids,
      limitations: [
        "Convenience sample ordered by identifier, not random or representative of the collection.",
        "Catalogue assertions and classifications retain the museum's wording.",
        "Missing source values do not establish absence of the historical property.",
        "Date bounds are museum indexing ranges, not precise event dates or confidence intervals.",
        "Metadata only. Image URLs in raw API responses are retained as source bytes but no images are downloaded or displayed.",
      ],
      files,
    }),
  );
}

const manifest = JSON.parse(await read("manifest.json"));
for (const file of manifest.files) {
  if (sha256(await read(file.path)) !== file.sha256)
    throw new Error(`Checksum mismatch: ${file.path}`);
}
const records = [];
const evidenceRecords = [];
const fieldMapping = {
  id: ["objectID", "number-to-string"],
  title: ["title", "unchanged"],
  department: ["department", "unchanged"],
  objectName: ["objectName", "empty-string-to-null"],
  culture: ["culture", "empty-string-to-null"],
  objectDate: ["objectDate", "empty-string-to-null"],
  beginYear: ["objectBeginDate", "null-if-object-date-empty"],
  endYear: ["objectEndDate", "null-if-object-date-empty"],
  medium: ["medium", "empty-string-to-null"],
  artist: ["artistDisplayName", "empty-string-to-null"],
  artistPrefix: ["artistPrefix", "empty-string-to-null"],
  artistSuffix: ["artistSuffix", "empty-string-to-null"],
  classification: ["classification", "empty-string-to-null"],
  sourceUrl: ["objectURL", "unchanged"],
};
for (const id of manifest.selectedIds) {
  const object = JSON.parse(await read(`raw/${id}.json`));
  if (object.objectID !== id || object.department !== "Musical Instruments") {
    throw new Error(`Unexpected object or department: ${id}`);
  }
  records.push({
    id: String(id),
    title: object.title,
    department: object.department,
    objectName: blankToNull(object.objectName),
    culture: blankToNull(object.culture),
    objectDate: blankToNull(object.objectDate),
    beginYear: object.objectDate === "" ? null : object.objectBeginDate,
    endYear: object.objectDate === "" ? null : object.objectEndDate,
    medium: blankToNull(object.medium),
    artist: blankToNull(object.artistDisplayName),
    artistPrefix: blankToNull(object.artistPrefix),
    artistSuffix: blankToNull(object.artistSuffix),
    classification: blankToNull(object.classification),
    sourceUrl: object.objectURL,
  });
  const record = records.at(-1);
  evidenceRecords.push({
    id: record.id,
    source: manifest.files.find((file) => file.path === `raw/${id}.json`),
    fields: Object.fromEntries(
      Object.entries(fieldMapping).map(([field, [sourceField, transformation]]) => {
        const sourceFields =
          transformation === "null-if-object-date-empty"
            ? [sourceField, "objectDate"]
            : [sourceField];
        const expected =
          transformation === "number-to-string"
            ? String(object[sourceField])
            : transformation === "empty-string-to-null"
              ? blankToNull(object[sourceField])
              : transformation === "null-if-object-date-empty" && object.objectDate === ""
                ? null
                : object[sourceField];
        if (expected !== record[field])
          throw new Error(`Field projection mismatch: ${id}.${field}`);
        return [
          field,
          {
            field,
            sourceFields,
            originalValues: Object.fromEntries(sourceFields.map((name) => [name, object[name]])),
            value: record[field],
            transformation,
          },
        ];
      }),
    ),
  });
}
const output = json({
  schemaVersion: 1,
  datasetId: manifest.datasetId,
  title: manifest.title,
  records,
});
await writeFile(`${root}/records.json`, output);
await writeFile(`${root}/records.sha256`, `${sha256(output)}  records.json\n`);
await writeFile(
  `${root}/field-evidence.json`,
  json({
    schemaVersion: 1,
    datasetId: manifest.datasetId,
    publisher: "The Metropolitan Museum of Art",
    originalProducer: "unknown",
    derivation: {
      producer: "scripts/import-dh-data.mjs",
      sha256: sha256(await readFile(fileURLToPath(import.meta.url))),
    },
    checks: ["source-file-sha256", "object-id-match", "department-match", "field-projection-match"],
    records: evidenceRecords,
  }),
);
console.log(
  `Verified ${manifest.files.length} source files and generated ${records.length} records.`,
);
