import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../data/nhc-milton/", import.meta.url)));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const manifest = JSON.parse(await readFile(resolve(root, "manifest.json"), "utf8"));
async function verifiedFile(path, expectedHash) {
  const target = resolve(root, path);
  assert.ok(target.startsWith(`${root}${sep}`), "Source path must stay inside the dataset.");
  const bytes = await readFile(target);
  assert.equal(sha256(bytes), expectedHash, `Checksum mismatch: ${path}`);
  return bytes.toString("utf8");
}

await verifiedFile(manifest.rights.rawPath, manifest.rights.sha256);
const sources = [];
for (const entry of manifest.sources) {
  const raw = await verifiedFile(entry.rawPath, entry.rawSha256);
  const products = [...raw.matchAll(/<pre>([\s\S]*?)<\/pre>/g)];
  assert.equal(products.length, 1, `Expected one bulletin: ${entry.id}`);
  const text = products[0][1];
  assert.ok(
    !/[<>&]/.test(text) && [...text].every((character) => character.charCodeAt(0) <= 127),
    "Unexpected markup, entity or non-ASCII text.",
  );
  assert.equal(sha256(text), entry.textSha256, `Extracted text differs: ${entry.id}`);
  const lines = text.split("\n");
  const title = lines
    .find((line) => line.includes("Discussion Number"))
    ?.trim()
    .replace(/\s+/g, " ");
  const forecaster = lines
    .find((line) => line.startsWith("Forecaster "))
    ?.slice(11)
    .trim();
  assert.equal(title, entry.title, `Title differs: ${entry.id}`);
  assert.ok(lines.includes(entry.issuedAt), `Issue time differs: ${entry.id}`);
  assert.equal(forecaster, entry.forecaster, `Published byline differs: ${entry.id}`);
  sources.push({
    id: entry.id,
    title,
    issuedAt: entry.issuedAt,
    forecaster,
    url: entry.url,
    text,
    rawSha256: entry.rawSha256,
    textSha256: entry.textSha256,
  });
}
await writeFile(resolve(root, "sources.json"), `${JSON.stringify(sources, null, 2)}\n`);
console.log("Extracted the frozen NHC bulletins and verified their source claims.");
