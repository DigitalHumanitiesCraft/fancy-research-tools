import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { MAX_SELECTION_BYTES, openSelection } from "../src/photographs/exchange";
import { initialState, parseCollection, selectionExport } from "../src/photographs/model";

const collection = parseCollection(
  JSON.parse(readFileSync("data/photographs/collection.jsonld", "utf8")),
);
const state = initialState("#q=Yosemite&sort=title&selected=1974.47,1992.12", collection.items);
const packet = () => selectionExport(collection, state);

test("reopens existing selection bytes with ordered source evidence and exact query", () => {
  expect(openSelection(JSON.stringify(packet()), collection)).toMatchObject({
    view: "comparison",
    query: "Yosemite",
    sort: "title",
    selected: ["1974.47", "1992.12"],
  });
});

test("rejects changed source, derivation, unknown fields and duplicate selections", () => {
  const original = packet();
  for (const mutate of [
    (value: typeof original) => {
      if (value.selected[0]) value.selected[0].date.label = "1869";
    },
    (value: typeof original) => {
      value.derivation = {};
    },
    (value: typeof original) => {
      value.selected.push(value.selected[0]);
    },
    (value: typeof original) => {
      Object.assign(value.query, { silentNote: "discarded?" });
    },
    (value: typeof original) => {
      value.collection = "different";
    },
  ]) {
    const changed = structuredClone(original);
    mutate(changed);
    expect(() => openSelection(JSON.stringify(changed), collection)).toThrow();
  }
  expect(() => openSelection(" ".repeat(MAX_SELECTION_BYTES + 1), collection)).toThrow(/2 MB/);
  expect(openSelection(JSON.stringify(packet()), collection).selected).toEqual(state.selected);
});
