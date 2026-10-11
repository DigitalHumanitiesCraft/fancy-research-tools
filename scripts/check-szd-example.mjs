import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { derive, root } from "./prepare-szd-example.mjs";

const read = (path) => readFile(`${root}/${path}`, "utf8");
const manifest = JSON.parse(await read("manifest.json"));
const original = await read("raw/pipeline.tei.xml");
const adapted = await read("letter.tei.xml");
const pageJson = JSON.parse(await read("raw/pipeline-page.json"));
const mets = await read("raw/gams-mets.xml");
assert.equal(adapted, await derive(), "Derived bytes reproduce from hashed sources");
assert.equal(manifest.objectId, "o:szd.1079");
assert.equal(manifest.rights.licenseVersion, null, "Do not invent a licence version");
assert.equal(manifest.rights.imagesBundled, false);
assert.ok(mets.includes(`<dv:owner>${manifest.rights.statement}</dv:owner>`));
assert.ok(mets.includes("<mods:dateIssued>22.5.1901</mods:dateIssued>"));
assert.equal(pageJson.review.status, "agent_verified");
assert.equal(pageJson.provenance.model, "gemini-3.1-flash-lite-preview");
assert.equal(pageJson.quality.needs_review, true);
assert.equal(pageJson.pages.length, 5);
assert.equal(pageJson.pages[4].type, "color_chart");
assert.equal(pageJson.pages[4].text, pageJson.pages[3].text);
assert.ok(adapted.includes('<revisionDesc status="machine_unreviewed">'));
assert.ok(!adapted.includes('status="accepted"'));

const body = (text) => text.match(/<body>[\s\S]*<\/body>/)?.[0];
assert.ok(body(original));
assert.equal(
  body(adapted).replace(
    /facs="https:\/\/gams.uni-graz.at\/o:szd.1079\/IMG.([1-5])"/g,
    'facs="#surf_$1"',
  ),
  body(original),
  "All body bytes are retained apart from the declared image pointer adaptation",
);
assert.equal(
  adapted.match(/<facsimile>[\s\S]*<\/facsimile>/)?.[0],
  original.match(/<facsimile>[\s\S]*<\/facsimile>/)?.[0],
  "Source surface and zone coordinates remain intact",
);
for (let page = 1; page <= 5; page++) {
  assert.ok(
    adapted.includes(`<pb n="${page}" facs="https://gams.uni-graz.at/o:szd.1079/IMG.${page}"/>`),
  );
}
console.log(
  "SZD example: frozen hashes, reproducible TEI, source text, page order, rights and unreviewed status checked.",
);
