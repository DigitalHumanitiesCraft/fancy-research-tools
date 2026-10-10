import { describe, expect, it } from "vitest";
import expected from "../benchmarks/cases/met-instruments/expected.json";
import provenance from "../data/met-instruments/manifest.json";
import snapshot from "../data/met-instruments/records.json";
import {
  defaults,
  distribution,
  exportSelection,
  missingness,
  readFilters,
  safeSource,
  selectRecords,
  writeFilters,
} from "../src/pilot/domain";

describe("bounded source exploration", () => {
  it("agrees with independently computed raw-source expectations across fixed queries", () => {
    for (const scenario of expected.queries) {
      const filters = readFilters(new URLSearchParams(Object.entries(scenario.filters)));
      const records = selectRecords(snapshot.records, filters);
      expect(
        records.map((record) => record.id),
        scenario.id,
      ).toEqual(scenario.ids);
      expect(missingness(records), scenario.id).toEqual(scenario.missing);
      for (const field of ["classification", "culture", "objectName"] as const) {
        expect(
          new Map(distribution(records, field).map((group) => [group.value, group.count])),
          scenario.id,
        ).toEqual(new Map(scenario.groups[field].map((group) => [group.value, group.count])));
      }
    }
  });
  it("keeps missing metadata distinct and preserves original rows during export", () => {
    const before = JSON.stringify(snapshot);
    const filters = { ...defaults, missing: "culture" as const };
    const records = selectRecords(snapshot.records, filters);
    expect(records.length).toBeGreaterThan(0);
    expect(records.every((record) => record.culture === null)).toBe(true);
    const result = exportSelection(records, filters, provenance, "2026-10-10T00:00:00Z");
    expect(JSON.parse(JSON.stringify(result)).records).toEqual(records);
    expect(result.provenance).toEqual(provenance);
    expect(result.analysis.denominator).toBe(records.length);
    expect(result.analysis.missing.culture).toBe(records.length);
    expect(JSON.stringify(snapshot)).toBe(before);
  });
  it("folds diacritics without rewriting the source text", () => {
    const result = selectRecords(snapshot.records, { ...defaults, q: "ud" });
    expect(result.some((record) => record.title === "Ūd")).toBe(true);
  });
  it("preserves exact filters and handles empty results without invented categories", () => {
    const filters = {
      ...defaults,
      q: "no-object-has-this-unique-phrase",
      culture: "unknown",
      missing: "medium" as const,
      group: "culture" as const,
    };
    expect(readFilters(writeFilters(filters))).toEqual(filters);
    expect(selectRecords(snapshot.records, filters)).toEqual([]);
    expect(distribution([], "culture")).toEqual([]);
    expect(missingness([])).toEqual({ culture: 0, medium: 0, objectDate: 0 });
  });
  it("rejects executable and misleading source URLs", () => {
    expect(safeSource("javascript:alert(1)")).toBeNull();
    expect(safeSource("https://www.metmuseum.org.attacker.invalid/")).toBeNull();
    expect(safeSource("https://www.metmuseum.org/art/collection/search/500526")).toBe(
      "https://www.metmuseum.org/art/collection/search/500526",
    );
  });
});
