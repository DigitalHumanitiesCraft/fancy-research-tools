import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../data/photographs/", import.meta.url));
const api = "https://openaccess-api.clevelandart.org/api/artworks/";
const query = `${api}?type=Photograph&cc0=1&has_image=1&created_before=1900&limit=1000`;
const licenseUrl = "https://creativecommons.org/publicdomain/zero/1.0/";
const anchors = [151356, 151948, 156283];
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const read = (path) => readFile(`${root}/${path}`);

export function jpegDimensions(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error("Expected JPEG start marker");
  let offset = 2;
  while (offset + 3 < bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error("Invalid JPEG marker");
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) continue;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length)
      throw new Error("Invalid JPEG segment length");
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      if (length < 8) throw new Error("Truncated JPEG frame");
      const height = bytes.readUInt16BE(offset + 3);
      const width = bytes.readUInt16BE(offset + 5);
      if (!width || !height) throw new Error("Invalid JPEG dimensions");
      return { width, height };
    }
    offset += length;
  }
  throw new Error("JPEG frame dimensions not found");
}

async function fetchBytes(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

function eligible(record) {
  return (
    record.type === "Photograph" &&
    record.share_license_status === "CC0" &&
    /^https:\/\/openaccess-cdn\.clevelandart\.org\//.test(record.images?.web?.url ?? "")
  );
}

function selection(records) {
  const candidates = records.filter(eligible).sort((a, b) => a.id - b.id);
  for (const id of anchors) {
    if (!candidates.some((record) => record.id === id)) throw new Error(`Missing anchor ${id}`);
  }
  return [
    ...anchors,
    ...candidates
      .filter((record) => !anchors.includes(record.id))
      .slice(0, 37)
      .map((record) => record.id),
  ].sort((a, b) => a - b);
}

export function describeDate(record) {
  const label = record.creation_date ?? "";
  let start = null;
  let end = null;
  let kind = "unknown";
  const exact = /^(\d{4})$/.exec(label);
  const range = /^(\d{4})[–-](\d{2}|\d{4})$/.exec(label);
  const approximate = /^(?:c\.|ca\.)\s*(\d{4})$/.exec(label);
  const decade = /^(\d{3}0)s$/.exec(label);
  if (exact) {
    start = end = Number(exact[1]);
    kind = "exact-year";
  } else if (range) {
    start = Number(range[1]);
    end = Number(range[2].length === 2 ? `${range[1].slice(0, 2)}${range[2]}` : range[2]);
    if (end < start) throw new Error(`Ambiguous cross-century range: ${label}`);
    kind = "range";
  } else if (approximate) {
    start = end = Number(approximate[1]);
    kind = "approximate";
  } else if (decade) {
    start = Number(decade[1]);
    end = start + 9;
    kind = "decade";
  }
  return {
    label,
    start,
    end,
    kind,
    indexStart: Number.isInteger(record.creation_date_earliest)
      ? record.creation_date_earliest
      : null,
    indexEnd: Number.isInteger(record.creation_date_latest) ? record.creation_date_latest : null,
  };
}

async function acquire() {
  try {
    await read("manifest.json");
    throw new Error("Snapshot exists. Preserve it and acquire a separately named revision.");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await mkdir(`${root}/raw`, { recursive: true });
  await mkdir(`${root}/images`, { recursive: true });
  const startedAt = new Date().toISOString();
  const source = await fetchBytes(query);
  const listing = JSON.parse(source);
  if (listing.info.total !== listing.data.length) {
    throw new Error(
      "Query exceeds its single-page acquisition bound. Preserve a complete new snapshot explicitly.",
    );
  }
  await writeFile(`${root}/raw/artworks.json`, source);
  const selectedIds = selection(listing.data);
  const files = [
    { path: "raw/artworks.json", url: query, sha256: sha256(source), bytes: source.length },
  ];
  const images = [];
  for (const id of selectedIds) {
    const record = listing.data.find((item) => item.id === id);
    const descriptor = record.images.web;
    const bytes = await fetchBytes(descriptor.url);
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error(`Expected JPEG: ${id}`);
    const path = `images/${id}.jpg`;
    await writeFile(`${root}/${path}`, bytes);
    const file = { path, url: descriptor.url, sha256: sha256(bytes), bytes: bytes.length };
    files.push(file);
    images.push({
      id,
      ...file,
      ...jpegDimensions(bytes),
      sourceWidth: Number(descriptor.width),
      sourceHeight: Number(descriptor.height),
      dimensionsOrigin: "JPEG frame header",
      license: "CC0-1.0",
      licenseUrl,
      sourceLicenseField: record.share_license_status,
    });
  }
  const rights = [];
  for (const url of [
    "https://openaccess-api.clevelandart.org/",
    "https://www.clevelandart.org/open-access",
  ]) {
    const bytes = await fetchBytes(url);
    rights.push({ url, checkedAt: new Date().toISOString(), responseSha256: sha256(bytes) });
  }
  await writeFile(
    `${root}/manifest.json`,
    json({
      datasetId: "cma-photographs-2026-10-11",
      title: "Historical photographs from the Cleveland Museum of Art",
      publisher: "The Cleveland Museum of Art",
      sourceUrl: query,
      license: "CC0-1.0",
      licenseUrl,
      startedAt,
      retrievedAt: new Date().toISOString(),
      sourceListingTotal: listing.info.total,
      selectedIds,
      selection:
        "Three explicitly chosen date examples (151356, 151948, 156283), plus the 37 smallest other numeric artwork IDs in the complete frozen query response, restricted to Photograph, CC0 and a web image on the CMA image host. Final order is ascending numeric ID.",
      selectionPurpose:
        "A bounded engineering sample with exact-year, approximate and range date labels. It does not represent the museum collection or photographic history.",
      rights,
      rightsFinding:
        "The API documentation designates collection metadata CC0. Only records whose share_license_status is CC0 supply CC0 image assets. Each selected record was checked against that field. Source-page response hashes identify the checked responses; webpage HTML is not redistributed.",
      imagePolicy:
        "Unmodified web JPEGs supplied by the museum, copied locally. No runtime third-party image request. Display dimensions come from the JPEG frame header; publisher-provided dimensions remain separately recorded.",
      limitations: [
        "Source assertions retain the museum's wording and are not independently historically verified.",
        "The pre-1900 source query excludes some records with unknown or later catalogue dates.",
        "Parsed date bounds are a rendering aid. A range does not establish an event duration; an approximate year has no inferred uncertainty window.",
        "Museum date index bounds remain separate and do not establish historical certainty.",
        "Culture, current museum location and find spot are not treated as an image's depicted place or capture location.",
        "No LLM extraction, identity reconciliation, geographic enrichment or customer material is included.",
        "Open reuse rights do not establish community endorsement or cultural appropriateness for every reuse.",
      ],
      images,
      files,
    }),
  );
}

export async function derive() {
  const manifest = JSON.parse(await read("manifest.json"));
  for (const file of manifest.files) {
    const bytes = await read(file.path);
    if (sha256(bytes) !== file.sha256) throw new Error(`Checksum mismatch: ${file.path}`);
  }
  for (const image of manifest.images) {
    const actual = jpegDimensions(await read(image.path));
    if (actual.width !== image.width || actual.height !== image.height) {
      throw new Error(`JPEG dimensions mismatch: ${image.path}`);
    }
  }
  const listing = JSON.parse(await read("raw/artworks.json"));
  if (JSON.stringify(selection(listing.data)) !== JSON.stringify(manifest.selectedIds)) {
    throw new Error("Selected IDs do not match the documented deterministic selection");
  }
  const items = manifest.selectedIds.map((id) => {
    const record = listing.data.find((item) => item.id === id);
    const image = manifest.images.find((item) => item.id === id);
    return {
      id: record.url,
      "@type": "Photograph",
      title: record.title,
      date: describeDate(record),
      creators: record.creators.map((creator) => ({
        name: creator.description,
        ...(Number.isInteger(creator.id)
          ? { id: `https://openaccess-api.clevelandart.org/api/creators/${creator.id}` }
          : {}),
        role: creator.role,
        qualifier: creator.qualifier,
        extent: creator.extent,
      })),
      technique: record.technique || null,
      culture: record.culture,
      accession: record.accession_number,
      sourceUrl: record.url,
      image: {
        src: `data/photographs/${image.path}`,
        width: image.width,
        height: image.height,
        sourceUrl: image.url,
        license: image.license,
      },
      source: {
        id: `${api}${id}`,
        rawPath: "data/photographs/raw/artworks.json",
        sha256: manifest.files[0].sha256,
        fields: {
          title: record.title,
          accession_number: record.accession_number,
          creation_date: record.creation_date,
          creation_date_earliest: record.creation_date_earliest,
          creation_date_latest: record.creation_date_latest,
          creators: record.creators,
          culture: record.culture,
          technique: record.technique,
          share_license_status: record.share_license_status,
          url: record.url,
          image: record.images.web,
        },
      },
    };
  });
  return {
    "@context": {
      "@version": 1.1,
      "@vocab": "https://schema.org/",
      frt: "https://github.com/DigitalHumanitiesCraft/fancy-research-tools#",
      id: "@id",
      title: "name",
      schemaVersion: "frt:schemaVersion",
      items: { "@id": "hasPart", "@container": "@set" },
      date: "frt:catalogueDate",
      label: "name",
      start: "frt:nominalStartYear",
      end: "frt:nominalEndYear",
      kind: "frt:dateKind",
      indexStart: "frt:publisherIndexStartYear",
      indexEnd: "frt:publisherIndexEndYear",
      creators: {
        "@id": "frt:creatorAttribution",
        "@container": "@set",
        "@context": { id: { "@id": "frt:sourceCreator", "@type": "@id" } },
      },
      role: "roleName",
      qualifier: "frt:sourceQualifier",
      extent: "frt:sourceExtent",
      technique: "artMedium",
      culture: { "@id": "frt:catalogueCulture", "@container": "@set" },
      accession: "identifier",
      sourceUrl: { "@id": "url", "@type": "@id" },
      src: "frt:localImagePath",
      source: "frt:sourceEvidence",
      rawPath: "frt:rawSnapshotPath",
      sha256: "frt:sha256",
      fields: { "@id": "frt:originalFields", "@type": "@json" },
      derivation: { "@id": "frt:derivation", "@type": "@json" },
    },
    id: "urn:frt:cma-photographs:2026-10-11",
    "@type": "Collection",
    schemaVersion: 1,
    title: manifest.title,
    license: manifest.license,
    derivation: {
      script: "scripts/import-photographs.mjs",
      sha256: sha256(await readFile(fileURLToPath(import.meta.url))),
      method:
        "Deterministic projection from the frozen CMA response. Literal year, year range, circa-year and decade date labels receive nominal plotting years. Source numeric index bounds remain separate. No historic truth or human review is asserted.",
    },
    items,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--fetch")) await acquire();
  await writeFile(`${root}/collection.jsonld`, json(await derive()));
  console.log("Photograph projection generated from the verified frozen snapshot.");
}
