import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

// Explicit promotion keeps routine test reruns separate from retained evidence.
const [runName, inputDirectory] = process.argv.slice(2);
assert(runName && /^[a-z0-9-]+$/.test(runName) && inputDirectory,
  "Usage: node benchmarks/record-run.mjs unique-run-name test-results-directory");
const source = resolve(inputDirectory);
const target = new URL(`runs/${runName}/`, import.meta.url);
const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile()) files.push(path);
  }
}
await collect(source);
assert(files.length, "No evidence files found; nothing recorded.");
// No recursive flag: an existing run must never be overwritten.
await mkdir(target);
const manifest = [];
for (const file of files.sort()) {
  const path = relative(source, file).replaceAll("\\", "/");
  const destination = new URL(path, target);
  await mkdir(new URL("./", destination), { recursive: true });
  const bytes = await readFile(file);
  await copyFile(file, destination);
  manifest.push({ path, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
}
await writeFile(new URL("evidence-manifest.json", target), `${JSON.stringify({
  recordedAt: new Date().toISOString(),
  evidence: "Copied test artifacts only. This manifest does not claim task success or researcher acceptance.",
  files: manifest,
}, null, 2)}\n`, { flag: "wx" });
console.log(`Retained ${manifest.length} evidence files in benchmarks/runs/${runName}/. Add a run assessment and a matching source capture separately.`);
