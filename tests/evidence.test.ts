import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import manifest from "../data/met-instruments/manifest.json";
import dataset from "../data/met-instruments/records.json";
import {
  getFieldEvidence,
  getRecordEvidence,
  type SourceField,
  selectedFieldEvidence,
} from "../src/research/evidence";

const hash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
describe("source field evidence", () => {
  it("binds every projected value to unchanged source bytes and named original fields", () => {
    for (const record of dataset.records) {
      const evidence = getRecordEvidence(record.id);
      const rawBytes = readFileSync(`data/met-instruments/${evidence.source.path}`);
      const raw = JSON.parse(rawBytes.toString()) as Record<string, string | number | null>;
      expect(hash(rawBytes)).toBe(evidence.source.sha256);
      expect(evidence.source).toEqual(
        manifest.files.find((file) => file.path === `raw/${record.id}.json`),
      );
      expect(Object.keys(evidence.fields).sort()).toEqual(Object.keys(record).sort());
      for (const field of Object.keys(record) as SourceField[]) {
        const item = getFieldEvidence(record.id, field);
        expect(item.value).toBe(record[field]);
        for (const sourceField of item.sourceFields)
          expect(item.originalValues[sourceField]).toEqual(raw[sourceField]);
      }
      expect(evidence.fields.artist.sourceFields).toEqual(["artistDisplayName"]);
      expect(evidence.fields.beginYear.sourceFields).toEqual(["objectBeginDate", "objectDate"]);
      expect(evidence.fields.endYear.sourceFields).toEqual(["objectEndDate", "objectDate"]);
      expect(evidence.fields.id.value).toBe(String(raw.objectID));
      expect(evidence.fields.beginYear.value).toBe(
        raw.objectDate === "" ? null : raw.objectBeginDate,
      );
      expect(evidence.fields.endYear.value).toBe(raw.objectDate === "" ? null : raw.objectEndDate);
    }
  });
  it("preserves empty raw values alongside null projections", () => {
    const record = dataset.records.find((record) => record.artistPrefix === null);
    if (!record) throw new Error("No missing-value fixture");
    const item = getFieldEvidence(record.id, "artistPrefix");
    expect(item.originalValues.artistPrefix).toBe("");
    expect(item.value).toBeNull();
    expect(item.transformation).toBe("empty-string-to-null");
  });
  it("identifies deterministic production and bounded checks without asserting source authorship", () => {
    const item = getFieldEvidence(dataset.records[0]?.id ?? "", "title");
    expect(item.originalProducer).toBe("unknown");
    expect(item.derivation.producer).toBe("scripts/import-dh-data.mjs");
    expect(item.derivation.sha256).toBe(hash(readFileSync(item.derivation.producer)));
    expect(item.checks).toEqual([
      "source-file-sha256",
      "object-id-match",
      "department-match",
      "field-projection-match",
    ]);
  });
  it("retains selected order and isolates caller mutations", () => {
    const ids = dataset.records
      .slice(0, 2)
      .map((record) => record.id)
      .reverse();
    const evidence = selectedFieldEvidence(ids);
    expect(evidence.records.map((record) => record.id)).toEqual(ids);
    evidence.checks.push("invented");
    const record = evidence.records[0];
    if (!record) throw new Error("Missing evidence fixture");
    record.fields.title.value = "Changed";
    expect(selectedFieldEvidence(ids).checks).not.toContain("invented");
    expect(getFieldEvidence(record.id, "title").value).not.toBe("Changed");
    expect(() => getRecordEvidence("unknown")).toThrow("Unknown source record");
  });
});
