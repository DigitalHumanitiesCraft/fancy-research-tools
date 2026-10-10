/** The example profile's contract; other research tools can replace this model. */
export type ResearchRecord = Readonly<{
  id: string;
  title: string;
  kind: string;
  place: string | null;
  date: string | null;
  source: string;
  notes: string;
  review: "draft" | "checked";
}>;

export type Dataset = Readonly<{
  schemaVersion: 1;
  title: string;
  records: readonly ResearchRecord[];
}>;

export type RecordPatch = Partial<Omit<ResearchRecord, "id">>;

const recordKeys = ["id", "title", "kind", "place", "date", "source", "notes", "review"];

function object(value: unknown, context: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${context}: expected an object.`);
  }
  return value as Record<string, unknown>;
}

function keys(value: Record<string, unknown>, allowed: readonly string[], context: string): void {
  const unexpected = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unexpected.length)
    throw new Error(`${context}: unsupported fields: ${unexpected.join(", ")}.`);
}

function text(value: unknown, context: string, allowEmpty = false): string {
  if (typeof value !== "string" || (!allowEmpty && !value.trim())) {
    throw new Error(`${context}: expected ${allowEmpty ? "a string" : "non-empty text"}.`);
  }
  return value;
}

function optionalText(value: unknown, context: string): string | null {
  return value === null ? null : text(value, context);
}

function validateRecord(value: unknown, index: number): ResearchRecord {
  const context = `Record ${index + 1}`;
  const record = object(value, context);
  keys(record, recordKeys, context);
  if (record.review !== "draft" && record.review !== "checked") {
    throw new Error(`${context}.review: expected draft or checked.`);
  }
  return Object.freeze({
    id: text(record.id, `${context}.id`),
    title: text(record.title, `${context}.title`),
    kind: text(record.kind, `${context}.kind`),
    place: optionalText(record.place, `${context}.place`),
    // Dates are scholarly descriptions, not coerced into JavaScript timestamps.
    date: optionalText(record.date, `${context}.date`),
    source: text(record.source, `${context}.source`),
    notes: text(record.notes, `${context}.notes`, true),
    review: record.review,
  });
}

export function validateDataset(value: unknown): Dataset {
  const dataset = object(value, "Dataset");
  keys(dataset, ["schemaVersion", "title", "records"], "Dataset");
  if (dataset.schemaVersion !== 1) throw new Error("Unsupported schemaVersion; expected 1.");
  if (!Array.isArray(dataset.records)) throw new Error("Dataset.records: expected an array.");
  const ids = new Set<string>();
  const records = dataset.records.map((value: unknown, index: number) => {
    const record = validateRecord(value, index);
    if (ids.has(record.id)) throw new Error(`Duplicate record id: ${record.id}.`);
    ids.add(record.id);
    return record;
  });
  return Object.freeze({
    schemaVersion: 1,
    title: text(dataset.title, "Dataset.title"),
    records: Object.freeze(records),
  });
}

function fold(value: string, german: boolean): string {
  const lower = value.toLocaleLowerCase("de").replaceAll("ß", "ss");
  const expanded = german
    ? lower.replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue")
    : lower;
  return expanded.normalize("NFD").replace(/\p{M}/gu, "");
}

const searchIndex = new WeakMap<ResearchRecord, readonly string[]>();

function searchable(record: ResearchRecord): readonly string[] {
  const cached = searchIndex.get(record);
  if (cached) return cached;
  const content = [
    record.id,
    record.title,
    record.kind,
    record.place ?? "",
    record.date ?? "",
    record.source,
    record.notes,
  ]
    .join("\n")
    .normalize("NFC");
  const index = [fold(content, false), fold(content, true)];
  // Only immutable objects can safely retain an index across calls.
  if (Object.isFrozen(record)) searchIndex.set(record, index);
  return index;
}

/** Empty kind selects all kinds. Unknown place/date are represented by null. */
export function filterRecords(
  records: readonly ResearchRecord[],
  query: string,
  kind = "",
): ResearchRecord[] {
  const tokens = query.trim().normalize("NFC").split(/\s+/u).filter(Boolean);
  return records.filter(
    (record) =>
      (!kind || record.kind === kind) &&
      tokens.every((token) => {
        const variants = [fold(token, false), fold(token, true)];
        return searchable(record).some((field) =>
          variants.some((variant) => field.includes(variant)),
        );
      }),
  );
}

export function updateRecord(dataset: Dataset, id: string, patch: RecordPatch): Dataset {
  keys(
    object(patch, "Patch"),
    recordKeys.filter((key) => key !== "id"),
    "Patch",
  );
  if (!dataset.records.some((record) => record.id === id))
    throw new Error(`Unknown record id: ${id}.`);
  return validateDataset({
    ...dataset,
    records: dataset.records.map((record) => (record.id === id ? { ...record, ...patch } : record)),
  });
}
