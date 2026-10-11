import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  creatorText,
  filterPhotographs,
  initialState,
  parseCollection,
  recordKey,
  selectionExport,
  stateHash,
} from "../src/photographs/model";

const raw = JSON.parse(
  readFileSync(new URL("../data/photographs/collection.jsonld", import.meta.url), "utf8"),
);
const collection = parseCollection(raw);

describe("photograph research state", () => {
  it("keeps qualified source dates and attribution while ordering a filtered collection", () => {
    const state = initialState("#q=Yosemite", collection.items);
    const records = filterPhotographs(collection.items, state);
    expect(records.map((r) => [r.title, r.date.label])).toEqual([
      ["Bridal Veil, Yosemite", "1865–66"],
      ["Yosemite Falls", "1868"],
    ]);
    const falls = records[1];
    if (!falls) throw new Error("Yosemite Falls is missing");
    expect(creatorText(falls)).toContain("attributed to Eadweard J. Muybridge");
    const circa = collection.items.find((r) => r.title === "Rue de la Ferronnerie");
    expect(circa?.date).toEqual({
      label: "c. 1865",
      start: 1865,
      end: 1865,
      kind: "approximate",
      indexStart: 1860,
      indexEnd: 1870,
    });
  });

  it("retains query and selection in addressable views without filtering away selected evidence", () => {
    const state = initialState(
      "#view=photograph&from=timeline&q=Yosemite&selected=1984.24,1992.12,1984.24,bad&record=1984.24",
      collection.items,
    );
    expect(initialState(stateHash(state), collection.items)).toEqual(state);
    expect(state.selected).toEqual(["1984.24", "1992.12"]);
    const exported = selectionExport(collection, state);
    expect(exported.selected.map((r) => r?.title)).toEqual([
      "Rue de la Ferronnerie",
      "Bridal Veil, Yosemite",
    ]);
    expect(exported.selected[0]?.source.fields.creation_date).toBe("c. 1865");
    expect(exported.selected[0]?.source.fields.creation_date_earliest).toBe(1860);
    expect(exported.derivation).toEqual(collection.derivation);
    expect(exported.context).toEqual(collection["@context"]);
  });

  it("keeps unparsed descriptions without silently turning them into publisher index points", () => {
    const records = filterPhotographs(
      collection.items,
      initialState("#view=timeline", collection.items),
    );
    expect(
      records
        .slice(-2)
        .map((r) => r.date.label)
        .sort(),
    ).toEqual(["1890s-1930s", "c. 1900s"]);
    const decade = collection.items.find((r) => r.title === "Karnak, Les Pylônes d'Horus");
    expect(decade?.date).toMatchObject({ label: "1860s", start: 1860, end: 1869, kind: "decade" });
    const state = initialState(
      `#q=Bechard&creator=${encodeURIComponent("Henri Béchard (French)")}`,
      collection.items,
    );
    expect(filterPhotographs(collection.items, state).map(recordKey)).toContain("2018.252");
  });

  it("rejects duplicate identities and unsafe image or source destinations as a whole", () => {
    const duplicate = structuredClone(raw);
    duplicate.items.push(duplicate.items[0]);
    expect(() => parseCollection(duplicate)).toThrow();
    for (const field of ["sourceUrl", "image"]) {
      const changed = structuredClone(raw);
      if (field === "sourceUrl") changed.items[0].sourceUrl = "javascript:alert(1)";
      else changed.items[0].image.src = "../../private.jpg";
      expect(() => parseCollection(changed)).toThrow();
    }
    expect(collection.items[0]?.source.fields).toEqual(raw.items[0].source.fields);
  });

  it("groups process spelling that differs only in letter case while retaining source values", () => {
    const state = initialState(
      "#process=Albumen+print+from+wet+collodion+negative",
      collection.items,
    );
    const records = filterPhotographs(collection.items, state);
    expect(new Set(records.map((r) => r.technique))).toEqual(
      new Set([
        "Albumen print from wet collodion negative",
        "albumen print from wet collodion negative",
      ]),
    );
  });
});
