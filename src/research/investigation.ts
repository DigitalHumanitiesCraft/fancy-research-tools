import manifest from "../../data/met-instruments/manifest.json";
import dataset from "../../data/met-instruments/records.json";
import { type SelectedFieldEvidence, selectedFieldEvidence } from "./evidence";

export type SourceRecord = (typeof dataset.records)[number];
export const MAX_INVESTIGATION_BYTES = 2_000_000;
export const MAX_INVESTIGATION_TEXT = 50_000;
interface InvestigationState {
  query: string;
  researchQuestion: string;
  selectedIds: string[];
  records: SourceRecord[];
  interpretation: { observation: string; unresolvedQuestion: string; author: string };
  provenance: typeof manifest;
}
export interface LegacyInvestigation extends InvestigationState {
  schemaVersion: 1;
}
export interface CurrentInvestigation extends InvestigationState {
  schemaVersion: 2;
  fieldEvidence: SelectedFieldEvidence;
}
export type Investigation = LegacyInvestigation | CurrentInvestigation;
export interface InvestigationInput {
  query: string;
  researchQuestion: string;
  selectedIds: string[];
  observation: string;
  unresolvedQuestion: string;
  author?: string;
}
const byId = new Map(dataset.records.map((record) => [record.id, record]));
const canonical = (value: unknown): string => {
  if (typeof value === "number" && !Number.isFinite(value))
    throw new Error("Non-finite numbers are not valid source evidence.");
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`)
      .join(",")}}`;
  return JSON.stringify(value);
};
const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected an investigation object.");
  return value as Record<string, unknown>;
};
function keys(value: Record<string, unknown>, expected: string[]) {
  if (Object.keys(value).sort().join() !== expected.sort().join())
    throw new Error("Unsupported or missing investigation fields.");
}
function text(value: unknown): asserts value is string {
  if (typeof value !== "string" || value.length > MAX_INVESTIGATION_TEXT)
    throw new Error("Invalid or oversized investigation text.");
}
export function parseInvestigation(input: unknown): Investigation {
  const value = object(input);
  if (value.schemaVersion !== 1 && value.schemaVersion !== 2)
    throw new Error("Unsupported investigation version.");
  keys(value, [
    "schemaVersion",
    "query",
    "researchQuestion",
    "selectedIds",
    "records",
    "interpretation",
    "provenance",
    ...(value.schemaVersion === 2 ? ["fieldEvidence"] : []),
  ]);
  text(value.query);
  text(value.researchQuestion);
  const notes = object(value.interpretation);
  keys(notes, ["observation", "unresolvedQuestion", "author"]);
  text(notes.observation);
  text(notes.unresolvedQuestion);
  text(notes.author);
  if (
    !Array.isArray(value.selectedIds) ||
    value.selectedIds.length > 4 ||
    new Set(value.selectedIds).size !== value.selectedIds.length
  )
    throw new Error("Select up to four distinct source records.");
  if (!Array.isArray(value.records) || value.records.length !== value.selectedIds.length)
    throw new Error("Source records do not match the selection.");
  const records = value.records;
  value.selectedIds.forEach((id, index) => {
    if (
      typeof id !== "string" ||
      !byId.has(id) ||
      canonical(records[index]) !== canonical(byId.get(id))
    )
      throw new Error("Unknown or changed source record. Original catalogue evidence is required.");
  });
  if (canonical(value.provenance) !== canonical(manifest))
    throw new Error("This investigation belongs to another source snapshot.");
  if (
    value.schemaVersion === 2 &&
    canonical(value.fieldEvidence) !==
      canonical(selectedFieldEvidence(value.selectedIds as string[]))
  )
    throw new Error("Unknown or changed field evidence. Canonical source derivation is required.");
  if (new TextEncoder().encode(JSON.stringify(value, null, 2)).byteLength > MAX_INVESTIGATION_BYTES)
    throw new Error("Investigation file exceeds 2 MB.");
  return structuredClone(value) as unknown as Investigation;
}
export function serializeInvestigation(state: Investigation): string {
  return JSON.stringify(parseInvestigation(state), null, 2);
}
export function createInvestigation(input: InvestigationInput): CurrentInvestigation {
  return parseInvestigation({
    schemaVersion: 2,
    query: input.query,
    researchQuestion: input.researchQuestion,
    selectedIds: input.selectedIds,
    records: input.selectedIds.map((id) => byId.get(id)),
    interpretation: {
      observation: input.observation,
      unresolvedQuestion: input.unresolvedQuestion,
      author: input.author ?? "user",
    },
    provenance: manifest,
    fieldEvidence: selectedFieldEvidence(input.selectedIds),
  }) as CurrentInvestigation;
}
export const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .replaceAll("ß", "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
export const attribution = (record: SourceRecord) =>
  [record.artistPrefix, record.artist, record.artistSuffix].filter(Boolean).join(" ") ||
  "Not supplied";
export function safeSourceUrl(value: string): string {
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      url.hostname === "www.metmuseum.org" &&
      !url.username &&
      !url.password &&
      !url.port
    )
      return url.href;
  } catch {
    /* Invalid sources have no navigation target. */
  }
  return "";
}
