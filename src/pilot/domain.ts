export interface Instrument {
  readonly id: string;
  readonly title: string;
  readonly objectName: string | null;
  readonly culture: string | null;
  readonly objectDate: string | null;
  readonly beginYear: number | null;
  readonly endYear: number | null;
  readonly medium: string | null;
  readonly artist: string | null;
  readonly artistPrefix: string | null;
  readonly artistSuffix: string | null;
  readonly classification: string | null;
  readonly sourceUrl: string;
}

export type GroupField = "classification" | "culture" | "objectName";
export type MissingField = "culture" | "medium" | "objectDate";
export interface Filters {
  q: string;
  classification: string;
  culture: string;
  missing: "" | MissingField;
  group: GroupField;
}
export const defaults: Filters = {
  q: "",
  classification: "",
  culture: "",
  missing: "",
  group: "classification",
};
const normalize = (value: string) =>
  value.toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/\p{M}/gu, "");
export const makeIndex = (records: readonly Instrument[]) =>
  new Map(
    records.map((record) => [
      record.id,
      normalize(
        [record.title, record.objectName, record.culture, record.objectDate, record.medium].join(
          " ",
        ),
      ),
    ]),
  );
export function selectRecords(
  records: readonly Instrument[],
  filters: Filters,
  index = makeIndex(records),
) {
  const q = normalize(filters.q.trim());
  return records.filter(
    (record) =>
      (!q || index.get(record.id)?.includes(q)) &&
      (!filters.classification || record.classification === filters.classification) &&
      (!filters.culture || record.culture === filters.culture) &&
      (!filters.missing || record[filters.missing] === null),
  );
}
export function distribution(records: readonly Instrument[], field: GroupField) {
  const counts = new Map<string | null, number>();
  for (const record of records) counts.set(record[field], (counts.get(record[field]) || 0) + 1);
  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || (a.value ?? "").localeCompare(b.value ?? "", "en"));
}
export const missingness = (records: readonly Instrument[]) =>
  Object.fromEntries(
    (["culture", "medium", "objectDate"] as const).map((field) => [
      field,
      records.filter((record) => record[field] === null).length,
    ]),
  );
export function readFilters(params: URLSearchParams): Filters {
  const group = params.get("group");
  const missing = params.get("missing");
  return {
    q: params.get("q") || "",
    classification: params.get("classification") || "",
    culture: params.get("culture") || "",
    group: group === "culture" || group === "objectName" ? group : "classification",
    missing:
      missing === "culture" || missing === "medium" || missing === "objectDate" ? missing : "",
  };
}
export function writeFilters(filters: Filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters))
    if (value && value !== defaults[key as keyof Filters]) params.set(key, value);
  return params;
}
export function safeSource(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "www.metmuseum.org" ? url.href : null;
  } catch {
    return null;
  }
}
export function exportSelection(
  records: readonly Instrument[],
  filters: Filters,
  provenance: unknown,
  exportedAt: string,
) {
  return {
    exportSchemaVersion: 1,
    datasetId: "met-instruments",
    exportedAt,
    filters,
    semantics:
      "Counts describe only the selected snapshot records. Null means no supplied value, not historical absence. Source labels are not harmonized. Date bounds are not exact creation dates.",
    provenance,
    analysis: {
      denominator: records.length,
      distribution: distribution(records, filters.group),
      missing: missingness(records),
    },
    records,
  };
}
