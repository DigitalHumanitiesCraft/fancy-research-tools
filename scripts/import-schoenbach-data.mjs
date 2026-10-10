import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const folder = new URL("../data/schoenbach/", import.meta.url);
const raw = await readFile(new URL("cmif-schoenbach.xml", folder));
const manifest = JSON.parse(await readFile(new URL("manifest.json", folder), "utf8"));
const sha256 = createHash("sha256").update(raw).digest("hex");
if (sha256 !== manifest.sha256)
  throw new Error("Schönbach source hash differs from the frozen manifest.");
const xml = raw.toString("utf8");
// This extractor accepts only this hash-bound CMIF snapshot, not arbitrary XML imports.
const value = (source, pattern, context) => {
  const result = source.match(pattern)?.[1];
  if (!result) throw new Error(`Missing frozen source value: ${context}`);
  return result;
};
const sourceRecords = [...xml.matchAll(/<correspDesc\b([^>]+)>([\s\S]*?)<\/correspDesc>/gu)];
if (sourceRecords.length !== 5)
  throw new Error("Expected five source correspondence descriptions.");
const evidence = sourceRecords.map((match) => {
  const key = value(match[1], /\bkey="([^"]+)"/u, "key");
  const url = value(match[1], /\bref="([^"]+)"/u, "edition URL");
  const sent = value(
    match[2],
    /<correspAction type="sent">([\s\S]*?)<\/correspAction>/u,
    "sent action",
  );
  const received = value(
    match[2],
    /<correspAction type="received">([\s\S]*?)<\/correspAction>/u,
    "received action",
  );
  return {
    id: `schoenbach-${key.padStart(3, "0")}`,
    key,
    url,
    sender: value(sent, /<persName\b[^>]*>([^<]+)<\/persName>/u, "sender"),
    recipient: value(received, /<persName\b[^>]*>([^<]+)<\/persName>/u, "recipient"),
    date: value(sent, /<date when="([^"]+)"/u, "sent date"),
    sentPlace: value(sent, /<placeName\b[^>]*>([^<]+)<\/placeName>/u, "sent place"),
    receivedPlace: received.match(/<placeName\b[^>]*>([^<]+)<\/placeName>/u)?.[1] ?? null,
    xml: match[0],
  };
});
const records = evidence.map((record) => ({
  id: record.id,
  title: `${record.sender} → ${record.recipient}`,
  kind: "Letter",
  place: record.sentPlace,
  date: record.date,
  source: `${record.url}\nCMIF record ${record.key}: ${manifest.originalUrl}\nCC0. Frozen source SHA-256: ${sha256}\nTitle joins sender and recipient; type Letter is the projection label.`,
  notes: "",
  review: "draft",
}));
const files = new Map([
  [
    "collection.json",
    {
      schemaVersion: 1,
      title: "Fünf Briefe aus dem Nachlass von Anton Emanuel Schönbach",
      records,
    },
  ],
  ["evidence.json", evidence],
]);
for (const [name, data] of files) {
  const bytes = `${JSON.stringify(data, null, 2)}\n`;
  const target = new URL(name, folder);
  if (process.argv.includes("--check")) {
    if ((await readFile(target, "utf8")) !== bytes)
      throw new Error(`Source projection differs: ${name}`);
  } else await writeFile(target, bytes);
}
console.log(
  `Schönbach CMIF: hash and five record projections ${process.argv.includes("--check") ? "checked" : "written"} at ${fileURLToPath(folder)}.`,
);
