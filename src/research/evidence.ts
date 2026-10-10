import registry from "../../data/met-instruments/field-evidence.json";
import type { SourceRecord } from "./investigation";

export type SourceField = keyof SourceRecord;
type SourceValue = string | number | boolean | null;
interface FieldProjection {
  field: SourceField;
  sourceFields: string[];
  originalValues: Record<string, SourceValue>;
  value: string | number | null;
  transformation: string;
}
export interface RecordEvidence {
  id: string;
  source: { path: string; url: string; sha256: string };
  fields: Record<SourceField, FieldProjection>;
}
export interface SelectedFieldEvidence {
  schemaVersion: 1;
  datasetId: string;
  publisher: string;
  originalProducer: "unknown";
  derivation: { producer: string; sha256: string };
  checks: string[];
  records: RecordEvidence[];
}
export interface FieldEvidence extends FieldProjection {
  source: RecordEvidence["source"];
  publisher: string;
  originalProducer: "unknown";
  derivation: SelectedFieldEvidence["derivation"];
  checks: string[];
}
const evidence = registry as SelectedFieldEvidence;
const byId = new Map(evidence.records.map((record) => [record.id, record]));

export function getRecordEvidence(recordId: string): RecordEvidence {
  const record = byId.get(recordId);
  if (!record) throw new Error("Unknown source record for field evidence.");
  return structuredClone(record);
}

export function getFieldEvidence(recordId: string, field: SourceField): FieldEvidence {
  const record = getRecordEvidence(recordId);
  const projection = record.fields[field];
  if (!projection) throw new Error("Unknown source field for field evidence.");
  return structuredClone({
    ...projection,
    source: record.source,
    publisher: evidence.publisher,
    originalProducer: evidence.originalProducer,
    derivation: evidence.derivation,
    checks: evidence.checks,
  });
}

export function selectedFieldEvidence(recordIds: readonly string[]): SelectedFieldEvidence {
  return structuredClone({ ...evidence, records: recordIds.map(getRecordEvidence) });
}
