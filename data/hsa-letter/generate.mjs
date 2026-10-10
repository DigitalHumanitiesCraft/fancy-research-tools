import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const raw = await readFile(new URL("raw/brief-benndorf-1879.txt", import.meta.url));
const text = raw.toString("utf8").replace(/\r\n?/g, "\n");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const source = {
  id: "hsa-letter-7711",
  title: "Benndorf to Schuchardt, 14 February 1879",
  issuedAt: "1879-02-14",
  author: "Friedrich August Otto Benndorf",
  recipient: "Hugo Schuchardt",
  place: "Vienna",
  editor: "Hubert Szemethy (2022)",
  publisher: "Hugo Schuchardt Archiv, Bernhard Hurch (ed.)",
  rights: "Public-domain letter text; editorial apparatus and images excluded.",
  url: "https://gams.uni-graz.at/o:hsa.letter.7711",
  derivation: "teiCrafter transcription: footnote numerals removed; |2| page marker retained. Here, line endings normalized to LF only.",
  upstream: "https://github.com/DigitalHumanitiesCraft/teiCrafter/tree/5e76308/docs/data/editor/hsa-7711",
  text,
  rawSha256: hash(raw),
  textSha256: hash(text),
};
const bytes = `${JSON.stringify([source], null, 2)}\n`;
const destination = new URL("sources.json", import.meta.url);
if (process.argv.includes("--check")) {
  if ((await readFile(destination, "utf8")) !== bytes)
    throw new Error("HSA letter snapshot differs from its frozen source or derivation.");
  console.log("HSA letter source, derivation, attribution and hashes match.");
} else {
  await writeFile(destination, bytes);
}
