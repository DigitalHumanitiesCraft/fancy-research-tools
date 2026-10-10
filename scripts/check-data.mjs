import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFile, cp, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const temporaryRoot = resolve(tmpdir());
const staging = resolve(await mkdtemp(join(temporaryRoot, "frt-data-check-")));
try {
  await mkdir(join(staging, "scripts"));
  await mkdir(join(staging, "data"));
  await copyFile(
    join(root, "scripts/import-dh-data.mjs"),
    join(staging, "scripts/import-dh-data.mjs"),
  );
  await cp(join(root, "data/met-instruments"), join(staging, "data/met-instruments"), {
    recursive: true,
  });
  // The unchanged importer runs against copies. Its digest remains valid for v2 exports.
  execFileSync(process.execPath, [join(staging, "scripts/import-dh-data.mjs")], {
    cwd: staging,
    stdio: "pipe",
  });
  for (const name of ["records.json", "records.sha256", "field-evidence.json"]) {
    const [actual, generated] = await Promise.all([
      readFile(join(root, "data/met-instruments", name)),
      readFile(join(staging, "data/met-instruments", name)),
    ]);
    assert.ok(
      actual.equals(generated),
      `${name} differs from the frozen-source derivation. Inspect the mismatch before updating it.`,
    );
  }
  execFileSync(process.execPath, [join(root, "benchmarks/cases/met-instruments/oracle.mjs")], {
    cwd: root,
    stdio: "inherit",
  });
  console.log(
    "Frozen source checksums and all derived files verified without changing the dataset.",
  );
} finally {
  assert.equal(dirname(staging), temporaryRoot, "Refuse to clean outside the temporary root.");
  assert.ok(basename(staging).startsWith("frt-data-check-"), "Unexpected temporary directory.");
  await rm(staging, { recursive: true, force: true });
}
