import { describe, expect, it } from "vitest";
import dataset from "../data/met-instruments/records.json";
import {
  createInvestigation,
  MAX_INVESTIGATION_BYTES,
  parseInvestigation,
  safeSourceUrl,
  serializeInvestigation,
} from "../src/research/investigation";

const make = () =>
  createInvestigation({
    query: "wood",
    researchQuestion: "Who made these?",
    selectedIds: dataset.records.slice(0, 2).map((r) => r.id),
    observation: "Attribution is incomplete.",
    unresolvedQuestion: "Which sources could identify the makers?",
  });
describe("investigation interchange", () => {
  it("preserves exact legacy v1 shape through reopening and serialization", () => {
    const { fieldEvidence: _evidence, ...common } = make();
    const legacy = { ...common, schemaVersion: 1 as const };
    const restored = parseInvestigation(legacy);
    expect(restored).toEqual(legacy);
    expect(restored).not.toHaveProperty("fieldEvidence");
    expect(JSON.parse(serializeInvestigation(restored))).toEqual(legacy);
    expect(() => parseInvestigation({ ...legacy, fieldEvidence: make().fieldEvidence })).toThrow(
      "Unsupported or missing",
    );
  });
  it("requires canonical field evidence in version 2 and rejects forged review claims", () => {
    const current = make();
    expect(current.schemaVersion).toBe(2);
    expect(parseInvestigation(JSON.parse(serializeInvestigation(current)))).toEqual(current);
    const { fieldEvidence: _evidence, ...missing } = current;
    expect(() => parseInvestigation(missing)).toThrow("Unsupported or missing");
    const changed = structuredClone(current);
    changed.fieldEvidence.checks.push("human-verified");
    expect(() => parseInvestigation(changed)).toThrow("changed field evidence");
    const altered = structuredClone(current);
    const record = altered.fieldEvidence.records[0];
    if (!record) throw new Error("Missing evidence fixture");
    record.fields.title.originalValues.title = "Invented source title";
    expect(() => parseInvestigation(altered)).toThrow("changed field evidence");
  });
  it("keeps unfinished notes portable without selected source evidence", () => {
    const current = createInvestigation({
      query: "",
      researchQuestion: "Question before selection",
      selectedIds: [],
      observation: "Unfinished observation",
      unresolvedQuestion: "What next?",
    });
    expect(current.fieldEvidence.records).toEqual([]);
    expect(parseInvestigation(JSON.parse(serializeInvestigation(current)))).toEqual(current);
  });
  it("rejects JSON number overflow instead of equating it with missing source values", () => {
    const original = make();
    const recordOverflow = JSON.parse(
      JSON.stringify(original).replace('"culture":null', '"culture":1e999'),
    );
    expect(recordOverflow.records[0].culture).toBe(Infinity);
    expect(() => parseInvestigation(recordOverflow)).toThrow("Non-finite");
    const evidenceOverflow = JSON.parse(
      JSON.stringify(original).replace('"value":null', '"value":-1e999'),
    );
    expect(() => parseInvestigation(evidenceOverflow)).toThrow("Non-finite");
  });
  it("keeps maximum escaped text exports within the import byte limit", () => {
    const state = createInvestigation({
      query: "\u0000".repeat(50_000),
      researchQuestion: "\u0000".repeat(50_000),
      selectedIds: dataset.records.slice(0, 4).map((r) => r.id),
      observation: "\u0000".repeat(50_000),
      unresolvedQuestion: "\u0000".repeat(50_000),
      author: "\u0000".repeat(50_000),
    });
    const output = serializeInvestigation(state);
    expect(new TextEncoder().encode(output).byteLength).toBeLessThanOrEqual(
      MAX_INVESTIGATION_BYTES,
    );
    expect(parseInvestigation(JSON.parse(output))).toEqual(state);
  });
  it("preserves a named interpretation author on interchange", () => {
    const state = make();
    state.interpretation.author = "Researcher A";
    expect(
      parseInvestigation(JSON.parse(serializeInvestigation(state))).interpretation.author,
    ).toBe("Researcher A");
  });
  it("round trips original evidence and interpretation independently", () => {
    const state = make();
    expect(parseInvestigation(JSON.parse(JSON.stringify(state)))).toEqual(state);
    const record = state.records[0];
    if (!record) throw new Error("Missing fixture");
    record.title = "Changed";
    expect(dataset.records[0]?.title).not.toBe("Changed");
  });
  it("rejects changed source wording even with a genuine source ID", () => {
    const state = make();
    const record = state.records[0];
    if (!record) throw new Error("Missing fixture");
    record.artistPrefix = "invented";
    expect(() => parseInvestigation(state)).toThrow("changed source");
  });
  it("rejects another snapshot and unknown schema fields instead of dropping them", () => {
    const state = make();
    state.provenance.retrievedAt = "2020-01-01";
    expect(() => parseInvestigation(state)).toThrow("another source snapshot");
    expect(() => parseInvestigation({ ...make(), annotations: [] })).toThrow(
      "Unsupported or missing",
    );
  });
  it("rejects duplicate, unknown, oversized and mismatched selections", () => {
    const state = make();
    expect(() =>
      parseInvestigation({ ...state, selectedIds: [state.selectedIds[0], state.selectedIds[0]] }),
    ).toThrow("distinct");
    expect(() =>
      parseInvestigation({ ...state, selectedIds: ["unknown", state.selectedIds[1]] }),
    ).toThrow("Unknown");
    expect(() => parseInvestigation({ ...state, records: [] })).toThrow("match");
    expect(() =>
      createInvestigation({
        query: "",
        researchQuestion: "",
        selectedIds: dataset.records.slice(0, 5).map((r) => r.id),
        observation: "",
        unresolvedQuestion: "",
      }),
    ).toThrow("four");
  });
  it("accepts reordered JSON keys but rejects unknown interpretation fields", () => {
    const state = make();
    state.records = state.records.map(
      (record) => Object.fromEntries(Object.entries(record).reverse()) as typeof record,
    );
    expect(parseInvestigation(state).selectedIds).toEqual(state.selectedIds);
    expect(() =>
      parseInvestigation({ ...state, interpretation: { ...state.interpretation, certainty: 1 } }),
    ).toThrow("Unsupported or missing");
  });
  it("allows only credential-free Met HTTPS source URLs", () => {
    expect(safeSourceUrl("https://www.metmuseum.org/art/collection/search/500526")).toContain(
      "500526",
    );
    for (const url of [
      "javascript:alert(1)",
      "https://www.metmuseum.org.evil.example/",
      "https://user@www.metmuseum.org/",
      "invalid",
    ])
      expect(safeSourceUrl(url)).toBe("");
  });
});
