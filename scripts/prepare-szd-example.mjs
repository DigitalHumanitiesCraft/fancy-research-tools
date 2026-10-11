import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../data/szd-example/", import.meta.url));
export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

export async function derive() {
  const manifest = JSON.parse(await readFile(`${root}/manifest.json`, "utf8"));
  for (const file of manifest.files) {
    const bytes = await readFile(`${root}/${file.path}`);
    assert.equal(sha256(bytes), file.sha256, `Frozen source changed: ${file.path}`);
    assert.equal(bytes.length, file.bytes);
  }
  const original = await readFile(`${root}/raw/pipeline.tei.xml`, "utf8");
  // This is a bounded adapter for the hashed source, not a general XML importer.
  let adapted = original.replace(
    /<pb n="([1-5])" facs="#surf_\1"\/>/g,
    (_, page) => `<pb n="${page}" facs="https://gams.uni-graz.at/o:szd.1079/IMG.${page}"/>`,
  );
  assert.equal((adapted.match(/<pb n="[1-5]" facs="https:/g) ?? []).length, 5);
  const attribution =
    "      <p>Example adaptation by Fancy Research Tools, 11 October 2026. Source attribution: Literaturarchiv Salzburg, Paris Lodron University of Salzburg, Stefan Zweig Digital, SZ-LAS/B3.1. The GAMS source states CC-BY without a version. No human transcription review is established.</p>\n";
  adapted = adapted.replace("    </publicationStmt>", `${attribution}    </publicationStmt>`);
  const revision =
    '    <revisionDesc status="machine_unreviewed">\n      <change when="2026-10-11" status="machine_unreviewed">Prepared by a coding agent for import testing. Page-break image pointers resolve directly to the original GAMS URLs. Source text, source facsimile zones and upstream review wording are retained. The upstream agent_verified label is not human verification.</change>\n    </revisionDesc>\n';
  adapted = adapted.replace("  </teiHeader>", `${revision}  </teiHeader>`);
  assert.notEqual(adapted, original);
  return adapted;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const adapted = await derive();
  if (process.argv.includes("--check")) {
    assert.equal(await readFile(`${root}/letter.tei.xml`, "utf8"), adapted);
    console.log("SZD TEI adaptation reproduces exactly.");
  } else {
    await writeFile(`${root}/letter.tei.xml`, adapted);
    console.log("Prepared data/szd-example/letter.tei.xml from frozen public sources.");
  }
}
