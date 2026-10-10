import letterData from "../../data/hsa-letter/sources.json";
import sourceData from "../../data/nhc-milton/sources.json";

export const categories = ["observation", "forecast", "uncertainty"] as const;
export const letterCategories = [
  "person",
  "place",
  "research-topic",
  "editorial-question",
] as const;
export const caseIds = ["nhc-milton-2024", "hsa-benndorf-1879"] as const;
export type CaseId = (typeof caseIds)[number];
export const creatorKinds = ["human", "llm", "agent", "unknown"] as const;
export const reviewResults = ["supports", "does-not-support", "unclear"] as const;
export const MAX_NOTEBOOK_BYTES = 1_000_000;
export const MAX_TEXT_LENGTH = 20_000;
export const MAX_ANNOTATIONS = 200;
export type Category = (typeof categories)[number] | (typeof letterCategories)[number];
export interface Source {
  id: string;
  title: string;
  issuedAt: string;
  forecaster?: string;
  author?: string;
  recipient?: string;
  place?: string;
  editor?: string;
  publisher?: string;
  rights?: string;
  derivation?: string;
  upstream?: string;
  url: string;
  text: string;
  rawSha256: string;
  textSha256: string;
}
export interface Actor {
  kind: (typeof creatorKinds)[number];
  name: string;
}
export interface Review {
  reviewer: Actor;
  criterion: string;
  result: (typeof reviewResults)[number];
}
export interface Annotation {
  id: string;
  sourceId: string;
  start: number;
  end: number;
  quote: string;
  category: Category;
  note: string;
  creator: Actor;
  review: Review | null;
}
export interface Notebook {
  schemaVersion: 1;
  caseId: CaseId;
  sources: Source[];
  researchQuestion: string;
  annotations: Annotation[];
}
export const sources: readonly Readonly<Source>[] = Object.freeze(
  sourceData.map((source) => Object.freeze({ ...source })),
);
export const letterSources: readonly Readonly<Source>[] = Object.freeze(
  letterData.map((source) => Object.freeze({ ...source })),
);
export const notebookCases: Record<
  CaseId,
  {
    sources: readonly Readonly<Source>[];
    categories: readonly Category[];
    storageSuffix: string;
    filename: string;
  }
> = {
  "nhc-milton-2024": {
    sources,
    categories,
    storageSuffix: "nhc-milton.v1",
    filename: "milton-annotation-notebook.json",
  },
  "hsa-benndorf-1879": {
    sources: letterSources,
    categories: letterCategories,
    storageSuffix: "hsa-benndorf-1879.v1",
    filename: "benndorf-letter-notebook.json",
  },
};

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected a notebook object.");
  return value as Record<string, unknown>;
}
function keys(value: Record<string, unknown>, expected: readonly string[]): void {
  const actual = Object.keys(value);
  if (actual.length !== expected.length || actual.some((key) => !expected.includes(key)))
    throw new Error("Unsupported or missing notebook fields.");
}
function text(value: unknown, label: string, required = false): asserts value is string {
  if (typeof value !== "string" || value.length > MAX_TEXT_LENGTH || (required && !value.trim()))
    throw new Error(`Invalid or oversized ${label}.`);
}
function member<T extends string>(
  value: unknown,
  options: readonly T[],
  label: string,
): asserts value is T {
  if (typeof value !== "string" || !options.includes(value as T))
    throw new Error(`Unsupported ${label}.`);
}
function actor(value: unknown, nameRequired = false): void {
  const candidate = object(value);
  keys(candidate, ["kind", "name"]);
  member(candidate.kind, creatorKinds, "actor kind");
  text(candidate.name, "actor name", nameRequired);
}
function review(value: unknown): void {
  if (value === null) return;
  const candidate = object(value);
  keys(candidate, ["reviewer", "criterion", "result"]);
  actor(candidate.reviewer, true);
  text(candidate.criterion, "review criterion", true);
  member(candidate.result, reviewResults, "review result");
}
function annotation(value: unknown, caseId: CaseId): Annotation {
  const candidate = object(value);
  keys(candidate, [
    "id",
    "sourceId",
    "start",
    "end",
    "quote",
    "category",
    "note",
    "creator",
    "review",
  ]);
  if (typeof candidate.id !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(candidate.id))
    throw new Error(
      "Annotation IDs require an initial letter or digit and up to 128 letters, digits, dots, underscores, colons or hyphens.",
    );
  const source = notebookCases[caseId].sources.find((item) => item.id === candidate.sourceId);
  if (!source) throw new Error("Unknown annotation source.");
  const { start, end } = candidate;
  if (
    typeof start !== "number" ||
    typeof end !== "number" ||
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    end <= start ||
    end > source.text.length
  )
    throw new Error("Quotation offsets must select a nonempty span inside the source text.");
  if (candidate.quote !== source.text.slice(start, end))
    throw new Error("Quotation does not match its exact source offsets.");
  member(candidate.category, notebookCases[caseId].categories, "annotation category");
  text(candidate.note, "annotation note");
  actor(candidate.creator);
  review(candidate.review);
  return structuredClone(candidate) as unknown as Annotation;
}
function validate(input: unknown, caseId: CaseId): Notebook {
  const value = object(input);
  keys(value, ["schemaVersion", "caseId", "sources", "researchQuestion", "annotations"]);
  if (value.schemaVersion !== 1 || value.caseId !== caseId)
    throw new Error(
      "Unsupported annotation notebook version or case. Open it in its original research case.",
    );
  const caseSources = notebookCases[caseId].sources;
  if (!Array.isArray(value.sources) || value.sources.length !== caseSources.length)
    throw new Error("The notebook must contain the complete frozen source snapshot.");
  value.sources.forEach((candidate: unknown, index: number) => {
    const source = object(candidate);
    const original = caseSources[index];
    const sourceKeys = Object.keys(original ?? {}) as (keyof Source)[];
    keys(source, sourceKeys);
    if (!original || sourceKeys.some((key) => source[key] !== original[key]))
      throw new Error("Unknown or changed source snapshot. Preserve the original source text.");
  });
  text(value.researchQuestion, "research question");
  if (!Array.isArray(value.annotations) || value.annotations.length > MAX_ANNOTATIONS)
    throw new Error(`A notebook supports up to ${MAX_ANNOTATIONS} annotations.`);
  const annotations = value.annotations.map((item: unknown) => annotation(item, caseId));
  if (new Set(annotations.map((item) => item.id)).size !== annotations.length)
    throw new Error("Annotation IDs must be unique.");
  const result: Notebook = {
    schemaVersion: 1,
    caseId,
    sources: caseSources.map((source) => ({ ...source })),
    researchQuestion: value.researchQuestion,
    annotations,
  };
  if (new TextEncoder().encode(JSON.stringify(result, null, 2)).byteLength > MAX_NOTEBOOK_BYTES)
    throw new Error("Annotation notebook exceeds 1 MB. Export smaller notes or fewer annotations.");
  return result;
}

export function createNotebook(
  input: { researchQuestion?: string; annotations?: Annotation[] } = {},
  caseId: CaseId = "nhc-milton-2024",
): Notebook {
  return validate(
    {
      schemaVersion: 1,
      caseId,
      sources: notebookCases[caseId].sources,
      researchQuestion: input.researchQuestion ?? "",
      annotations: input.annotations ?? [],
    },
    caseId,
  );
}
export function parseNotebook(input: string, caseId: CaseId = "nhc-milton-2024"): Notebook {
  if (typeof input !== "string" || new TextEncoder().encode(input).byteLength > MAX_NOTEBOOK_BYTES)
    throw new Error("Annotation notebook exceeds 1 MB or is not JSON text.");
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    throw new Error("Cannot read notebook JSON. Choose an exported annotation notebook.");
  }
  return validate(value, caseId);
}
export function serializeNotebook(value: Notebook): string {
  member(value.caseId, caseIds, "notebook case");
  return JSON.stringify(validate(value, value.caseId), null, 2);
}
export function reviseAnnotation(
  original: Annotation,
  changes: Partial<Omit<Annotation, "id" | "review">>,
  caseId: CaseId = "nhc-milton-2024",
): Annotation {
  const editable = ["sourceId", "start", "end", "quote", "category", "note", "creator"];
  if (Object.keys(changes).some((key) => !editable.includes(key)))
    throw new Error("A revision cannot replace annotation identity or record a review.");
  const candidate = annotation({ ...original, ...changes }, caseId);
  const unchanged =
    candidate.sourceId === original.sourceId &&
    candidate.start === original.start &&
    candidate.end === original.end &&
    candidate.quote === original.quote &&
    candidate.category === original.category &&
    candidate.note === original.note &&
    candidate.creator.kind === original.creator.kind &&
    candidate.creator.name === original.creator.name;
  if (!unchanged) candidate.review = null;
  return candidate;
}
