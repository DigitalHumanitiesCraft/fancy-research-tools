import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { derive } from "./import-photographs.mjs";

const root = fileURLToPath(new URL("../data/photographs/", import.meta.url));
const readJson = async (path) => JSON.parse(await readFile(`${root}/${path}`, "utf8"));
const serialized = await readFile(`${root}/collection.jsonld`, "utf8");
const collection = JSON.parse(serialized);
assert.equal(
  serialized,
  `${JSON.stringify(await derive(), null, 2)}\n`,
  "Projection must reproduce byte for byte",
);

const manifest = await readJson("manifest.json");
const raw = await readJson("raw/artworks.json");
const expectations = await readJson("semantic-cases.json");
assert.equal(collection.items.length, 40);
assert.equal(
  new Set(collection.items.map((item) => item.id)).size,
  40,
  "Unique catalogue identities",
);
assert.equal(collection.schemaVersion, 1);
assert.equal(collection["@type"], "Collection");
assert.equal(
  collection["@context"].fields["@type"],
  "@json",
  "Original values must remain JSON literals",
);
assert.deepEqual(
  collection["@context"].creators["@context"].id,
  { "@id": "frt:sourceCreator", "@type": "@id" },
  "Role and attribution qualifier belong to an attribution, not the identified creator globally",
);
assert.deepEqual(
  (await readdir(`${root}/images`)).sort(),
  manifest.selectedIds.map((id) => `${id}.jpg`).sort(),
  "Only selected images belong in this snapshot",
);

for (const item of collection.items) {
  const sourceId = Number(item.source.id.split("/").at(-1));
  const source = raw.data.find((record) => record.id === sourceId);
  assert.ok(source, `Source exists: ${sourceId}`);
  assert.equal(source.type, "Photograph");
  assert.equal(source.share_license_status, "CC0");
  assert.equal(item.title, source.title);
  assert.equal(item.accession, source.accession_number);
  assert.equal(item.sourceUrl, source.url);
  assert.equal(item.date.label, source.creation_date);
  assert.equal(item.date.indexStart, source.creation_date_earliest);
  assert.equal(item.date.indexEnd, source.creation_date_latest);
  assert.deepEqual(item.culture, source.culture);
  assert.equal(item.technique, source.technique || null);
  assert.equal(item.creators.length, source.creators.length);
  item.creators.forEach((creator, index) => {
    const original = source.creators[index];
    assert.equal(creator.name, original.description);
    assert.equal(creator.role, original.role);
    assert.equal(creator.qualifier, original.qualifier);
    assert.equal(creator.extent, original.extent);
  });
  assert.equal(item.image.sourceUrl, source.images.web.url);
  assert.equal(item.image.src, `data/photographs/images/${sourceId}.jpg`);
  const asset = manifest.images.find((image) => image.id === sourceId);
  assert.equal(item.image.width, asset.width);
  assert.equal(item.image.height, asset.height);
  assert.equal(asset.sourceWidth, Number(source.images.web.width));
  assert.equal(asset.sourceHeight, Number(source.images.web.height));
  assert.deepEqual(
    item.source.fields.image,
    source.images.web,
    "Source dimensions remain preserved even where the JPEG differs",
  );
  assert.equal(item.image.license, "CC0-1.0");
  assert.ok(!("coordinates" in item) && !("place" in item), "No inferred geography");
  assert.deepEqual(
    item.source.fields.creators,
    source.creators,
    "Full original creator evidence retained",
  );
}

for (const expected of expectations.records) {
  const item = collection.items.find((record) =>
    record.source.id.endsWith(`/${expected.sourceId}`),
  );
  assert.ok(item, `Semantic case present: ${expected.sourceId}`);
  assert.equal(item.title, expected.title);
  for (const [key, value] of Object.entries(expected.date)) assert.equal(item.date[key], value);
  assert.deepEqual(
    item.creators.map((creator) => creator.role),
    expected.roles,
  );
  if (expected.culture) assert.deepEqual(item.culture, expected.culture);
  if (expected.creatorQualifier)
    assert.ok(item.creators.some((creator) => creator.qualifier === expected.creatorQualifier));
}

console.log(
  "Photographs: frozen source and image hashes, deterministic projection and independent semantic cases passed.",
);
