import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const outputIndex = process.argv.indexOf("--output");
const outputName = outputIndex === -1 ? "2026-10-10-met-instruments-source.json" : process.argv[outputIndex + 1];
assert(outputName && /^[a-z0-9-]+\.json$/.test(outputName), "Use a plain JSON filename for --output.");
const output = new URL(`runs/${outputName}`, import.meta.url);
const directories = ["src", "scripts", "tests", "docs", "knowledge", "data", "fixtures", "public", "tool", "pilot", "baseline", "annotations", "letters", "tools", ".github", ".agents", "concepts", "benchmarks"];
const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    const name = relative(root, path).replaceAll("\\", "/");
    if (name.startsWith("benchmarks/runs/") || name === "tools/index.html") continue;
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile()) files.push(name);
  }
}
for (const directory of directories) await collect(join(root, directory));
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.isFile() && (/\.(json|ts|md)$/.test(entry.name) || [".gitattributes", ".gitignore", "LICENSE"].includes(entry.name))) files.push(entry.name);
}
files.sort();
const entries = [];
for (const path of files) {
  const bytes = await readFile(join(root, path));
  entries.push({ path, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
}
if (process.argv.includes("--check")) {
  const recorded = JSON.parse(await readFile(output, "utf8"));
  assert.deepEqual(entries, recorded.files, "Source files changed after the recorded capture.");
  console.log(`Verified ${entries.length} recorded source files.`);
} else {
  await stat(new URL("cases/met-instruments/expected.json", import.meta.url));
  await writeFile(output, `${JSON.stringify({
    capturedAt: new Date().toISOString(),
    purpose: "Final development-pilot source identity; this is not a captured pre-change baseline.",
    baseCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
    sourceState: "Working tree, including uncommitted files. Hashes identify content independently of the base commit.",
    exclusions: ["benchmarks/runs/ execution records and this manifest", "generated HTML and dist", "node_modules", "test-results", "Git internals"],
    runtime: process.version,
    platform: process.platform,
    files: entries,
  }, null, 2)}\n`, { flag: "wx" });
  console.log(`Captured ${entries.length} source files. Verify with node benchmarks/capture-source.mjs --output ${outputName} --check.`);
}
