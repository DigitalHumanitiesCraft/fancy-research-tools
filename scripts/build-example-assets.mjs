import { copyFile, mkdir } from "node:fs/promises";

// Only this reviewed source package is copied; other research data stay private
// unless their own publication contract explicitly includes them.
const files = [
  "letter.tei.xml",
  "manifest.json",
  "verification.json",
  "README.md",
  "raw/gams-mets.xml",
  "raw/pipeline.tei.xml",
  "raw/pipeline-page.json",
];
const source = new URL("../data/szd-example/", import.meta.url);
const destination = new URL("../public/examples/szd/", import.meta.url);
await mkdir(new URL("raw/", destination), { recursive: true });
for (const file of files) await copyFile(new URL(file, source), new URL(file, destination));
console.log("Published the approved SZD example files without changing source bytes.");
