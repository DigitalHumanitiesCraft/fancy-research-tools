import { describe, expect, it } from "vitest";
import demo from "../fixtures/demo.json";
import { parseDataset, serializeDataset } from "../src/adapters/json";
import { filterRecords, updateRecord } from "../src/domain/dataset";

const load = () => parseDataset(JSON.stringify(demo));

describe("dataset boundaries", () => {
  it("roundtrips every value including unknown dates and literal markup", () => {
    const dataset = updateRecord(load(), "demo-001", {
      notes: '<script>alert("literal text")</script>\nÄ & ß',
    });
    expect(parseDataset(serializeDataset(dataset))).toEqual(dataset);
    expect(dataset.records[0]?.date).toBeNull();
  });

  it("isolates a validated edit from the original and other records", () => {
    const original = load();
    const edited = updateRecord(original, "demo-001", {
      notes: "Reviewed note",
      review: "checked",
    });
    expect(edited.records[0]?.notes).toBe("Reviewed note");
    expect(original.records[0]?.review).toBe("draft");
    expect(edited.records.slice(1)).toEqual(original.records.slice(1));
    expect(Object.isFrozen(edited.records[0])).toBe(true);
  });

  it.each([
    null,
    { ...demo, schemaVersion: 2 },
    { ...demo, title: "" },
    { ...demo, extension: "must not disappear" },
    { ...demo, records: [demo.records[0], demo.records[0]] },
    { ...demo, records: [{ ...demo.records[0], title: " " }] },
    { ...demo, records: [{ ...demo.records[0], place: 42 }] },
    { ...demo, records: [{ ...demo.records[0], notes: null }] },
    { ...demo, records: [{ ...demo.records[0], review: "approved" }] },
    { ...demo, records: [{ ...demo.records[0], custom: "must not disappear" }] },
  ])("rejects unsupported or malformed data: %j", (value) => {
    expect(() => parseDataset(JSON.stringify(value))).toThrow();
  });

  it("rejects malformed JSON and invalid updates", () => {
    expect(() => parseDataset("{")).toThrow("Invalid JSON");
    expect(() => updateRecord(load(), "missing", { notes: "" })).toThrow("Unknown record");
    expect(() => updateRecord(load(), "demo-001", { title: "" })).toThrow();
    expect(() => updateRecord(load(), "demo-001", JSON.parse('{"id":"replacement"}'))).toThrow(
      "unsupported",
    );
  });
});

describe("research record discovery", () => {
  it.each(["München", "Munchen", "Muenchen", "Mu\u0308nchen"])(
    "finds umlaut spelling %s",
    (query) => {
      expect(filterRecords(load().records, query).map((record) => record.id)).toEqual(["demo-002"]);
    },
  );
  it("combines terms and kind without dropping records with unknown places", () => {
    expect(
      filterRecords(load().records, "etude zurich", "Bild").map((record) => record.id),
    ).toEqual(["demo-005"]);
    expect(filterRecords(load().records, "Verzeichnis", "Text")[0]?.place).toBeNull();
    expect(filterRecords(load().records, "", "Text")).toHaveLength(2);
    expect(filterRecords(load().records, "", "")).toHaveLength(6);
    expect(filterRecords(load().records, "etude", "Text")).toHaveLength(0);
  });
  it("reindexes edited values", () => {
    const original = load();
    filterRecords(original.records, "notizbuch");
    const edited = updateRecord(original, "demo-001", { title: "Neuer Titel" });
    expect(filterRecords(edited.records, "notizbuch")).toHaveLength(0);
    expect(filterRecords(edited.records, "neuer titel")).toHaveLength(1);
  });
});
