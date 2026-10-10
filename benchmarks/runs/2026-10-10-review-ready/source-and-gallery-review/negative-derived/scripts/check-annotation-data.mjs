import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFile, cp, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const temporaryRoot = resolve(tmpdir());
const staging = resolve(await mkdtemp(join(temporaryRoot, "frt-annotation-check-")));
try {
  await mkdir(join(staging, "scripts"));
  await mkdir(join(staging, "data"));
  await copyFile(
    join(root, "scripts/import-annotation-data.mjs"),
    join(staging, "scripts/import-annotation-data.mjs"),
  );
  await cp(join(root, "data/nhc-milton"), join(staging, "data/nhc-milton"), { recursive: true });
  execFileSync(process.execPath, [join(staging, "scripts/import-annotation-data.mjs")], {
    cwd: staging,
    stdio: "pipe",
  });
  const [actual, generated] = await Promise.all([
    readFile(join(root, "data/nhc-milton/sources.json")),
    readFile(join(staging, "data/nhc-milton/sources.json")),
  ]);
  assert.ok(actual.equals(generated), "NHC sources differ from the frozen bulletin extraction.");
  console.log("Frozen NHC source, rights and text derivation verified without dataset changes.");
} finally {
  assert.equal(dirname(staging), temporaryRoot, "Refuse to clean outside the temporary root.");
  assert.ok(basename(staging).startsWith("frt-annotation-check-"), "Unexpected temporary path.");
  await rm(staging, { recursive: true, force: true });
}
