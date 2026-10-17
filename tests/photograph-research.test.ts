import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { initialState, parseCollection, selectionExport } from "../src/photographs/model";
import { emptyResearch, openPhotographFile, researchPacket } from "../src/photographs/research";

const collection = parseCollection(
  JSON.parse(readFileSync("data/photographs/collection.jsonld", "utf8")),
);
const state = initialState("#q=Yosemite&selected=1992.12,1974.47", collection.items);

test("research reopening retains exact authored strings and frozen source without changing legacy exports", () => {
  const legacy = JSON.stringify(selectionExport(collection, state));
  const research = {
    ...emptyResearch(),
    question: "A\r\nB",
    statement: "<script>untrusted</script>",
    author: { kind: "agent" as const, name: "Agent walkthrough" },
  };
  const packet = researchPacket(collection, state, research);
  const opened = openPhotographFile(JSON.stringify(packet), collection);
  expect(opened.research).toEqual(research);
  expect(opened.state.selected).toEqual(state.selected);
  expect(openPhotographFile(legacy, collection)).toMatchObject({
    legacy: true,
    research: emptyResearch(),
  });
  expect(JSON.stringify(selectionExport(collection, state))).toBe(legacy);
});

test("rejects source substitution, hidden fields, unsupported versions and invalid notes", () => {
  const packet = researchPacket(collection, state, emptyResearch());
  const mutations = [
    { ...packet, research: { ...packet.research, author: { kind: ["agent"], name: "" } } },
    { ...packet, schemaVersion: 2 },
    { ...packet, hidden: "keep?" },
    { ...packet, research: { ...packet.research, hidden: "keep?" } },
    { ...packet, research: { ...packet.research, statement: 12 } },
    { ...packet, research: { ...packet.research, question: "x".repeat(20_001) } },
    { ...packet, research: { ...packet.research, author: { kind: "verified", name: "" } } },
    { ...packet, selection: { ...packet.selection, collection: "another source" } },
  ];
  for (const changed of mutations)
    expect(() => openPhotographFile(JSON.stringify(changed), collection)).toThrow();
  expect(() => openPhotographFile(" ".repeat(2_000_001), collection)).toThrow(/2 MB/);
});
