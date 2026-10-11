export interface Photograph {
  id: string;
  title: string;
  date: {
    label: string;
    start: number | null;
    end: number | null;
    kind: string;
    indexStart: number | null;
    indexEnd: number | null;
  };
  creators: {
    name: string;
    id?: string | null;
    role: string;
    qualifier: string | null;
    extent: string | null;
  }[];
  technique: string | null;
  culture: string[];
  accession: string;
  sourceUrl: string;
  image: { src: string; width: number; height: number; sourceUrl: string; license: string };
  source: { id: string; fields: Record<string, unknown> };
}

export interface PhotographCollection {
  schemaVersion: 1;
  id: string;
  title: string;
  license: string;
  items: Photograph[];
  [key: string]: unknown;
}

export interface PhotoState {
  view: "collection" | "timeline" | "photograph" | "comparison";
  origin: "collection" | "timeline" | "comparison";
  query: string;
  creator: string;
  technique: string;
  sort: "date" | "title";
  selected: string[];
  record: string;
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function safeSource(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function year(value: unknown) {
  return value === null || (typeof value === "number" && Number.isInteger(value));
}

/** The frozen collection is read as a whole; original source fields remain in exports. */
export function parseCollection(value: unknown): PhotographCollection {
  if (
    !object(value) ||
    value.schemaVersion !== 1 ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.license !== "string" ||
    !Array.isArray(value.items) ||
    value.items.length === 0
  )
    throw new Error("The photograph collection is unavailable or has an unsupported format.");
  const ids = new Set<string>();
  for (const item of value.items) {
    if (
      !object(item) ||
      !safeSource(item.id) ||
      ids.has(item.id) ||
      typeof item.title !== "string" ||
      !item.title ||
      !safeSource(item.sourceUrl) ||
      typeof item.accession !== "string" ||
      !(item.technique === null || typeof item.technique === "string") ||
      !Array.isArray(item.culture) ||
      !item.culture.every((v) => typeof v === "string") ||
      !object(item.date) ||
      typeof item.date.label !== "string" ||
      typeof item.date.kind !== "string" ||
      !year(item.date.start) ||
      !year(item.date.end) ||
      !year(item.date.indexStart) ||
      !year(item.date.indexEnd) ||
      !Array.isArray(item.creators) ||
      !item.creators.every(
        (c) =>
          object(c) &&
          typeof c.name === "string" &&
          typeof c.role === "string" &&
          (c.id === undefined || c.id === null || safeSource(c.id)) &&
          (c.qualifier === null || typeof c.qualifier === "string") &&
          (c.extent === null || typeof c.extent === "string"),
      ) ||
      !object(item.image) ||
      typeof item.image.src !== "string" ||
      !/^data\/photographs\/images\/\d+\.jpg$/.test(item.image.src) ||
      !safeSource(item.image.sourceUrl) ||
      item.image.license !== "CC0-1.0" ||
      typeof item.image.width !== "number" ||
      item.image.width <= 0 ||
      typeof item.image.height !== "number" ||
      item.image.height <= 0 ||
      !object(item.source) ||
      !safeSource(item.source.id) ||
      !object(item.source.fields)
    )
      throw new Error("A photograph has missing or unsafe source information.");
    ids.add(item.id);
  }
  return value as unknown as PhotographCollection;
}

export function recordKey(record: Photograph): string {
  return record.id.slice(record.id.lastIndexOf("/") + 1);
}

export function normalize(value: string): string {
  return value
    .toLocaleLowerCase("en")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replaceAll("ß", "ss");
}

export function creatorText(record: Photograph): string {
  return (
    record.creators
      .map(
        (c) =>
          `${c.role && c.role !== "artist" ? `${c.role}: ` : ""}${[c.qualifier, c.name, c.extent].filter(Boolean).join(" ")}`,
      )
      .join("; ") || "Creator not recorded"
  );
}

export function initialState(hash: string, records: Photograph[]): PhotoState {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const keys = new Set(records.map(recordKey));
  const view = params.get("view");
  const origin = params.get("from");
  return {
    view:
      view === "timeline" || view === "photograph" || view === "comparison" ? view : "collection",
    origin: origin === "timeline" || origin === "comparison" ? origin : "collection",
    query: params.get("q") ?? "",
    creator: params.get("creator") ?? "",
    technique: params.get("process") ?? "",
    sort: params.get("sort") === "title" ? "title" : "date",
    selected: [...new Set((params.get("selected") ?? "").split(","))]
      .filter((key) => keys.has(key))
      .slice(0, 4),
    record: params.get("record") ?? "",
  };
}

export function stateHash(state: PhotoState): string {
  const params = new URLSearchParams({ view: state.view });
  if (state.view === "photograph") params.set("from", state.origin);
  if (state.query) params.set("q", state.query);
  if (state.creator) params.set("creator", state.creator);
  if (state.technique) params.set("process", state.technique);
  if (state.sort !== "date") params.set("sort", state.sort);
  if (state.selected.length) params.set("selected", state.selected.join(","));
  if (state.view === "photograph" && state.record) params.set("record", state.record);
  return `#${params}`;
}

const searchFields = new WeakMap<Photograph, string>();

function searchable(record: Photograph): string {
  let value = searchFields.get(record);
  if (value === undefined) {
    value = normalize(
      [
        record.title,
        creatorText(record),
        record.date.label,
        record.technique,
        record.accession,
        ...record.culture,
      ].join(" "),
    );
    searchFields.set(record, value);
  }
  return value;
}

export function filterPhotographs(records: Photograph[], state: PhotoState): Photograph[] {
  const query = normalize(state.query);
  return records
    .filter(
      (r) =>
        (!state.creator || r.creators.some((c) => c.name === state.creator)) &&
        (!state.technique ||
          r.technique?.toLocaleLowerCase("en") === state.technique.toLocaleLowerCase("en")) &&
        (!query || searchable(r).includes(query)),
    )
    .sort((a, b) => {
      if (state.sort === "date" || state.view === "timeline") {
        if (a.date.start === null && b.date.start !== null) return 1;
        if (a.date.start !== null && b.date.start === null) return -1;
        const difference = (a.date.start ?? 0) - (b.date.start ?? 0);
        if (difference) return difference;
      }
      return a.title.localeCompare(b.title, "en") || a.id.localeCompare(b.id);
    });
}

export function selectionExport(collection: PhotographCollection, state: PhotoState) {
  return {
    schemaVersion: 1,
    kind: "photograph-selection",
    collection: collection.id,
    context: collection["@context"],
    derivation: collection.derivation,
    query: {
      text: state.query,
      creator: state.creator,
      technique: state.technique,
      sort: state.sort,
    },
    selected: state.selected
      .map((key) => collection.items.find((r) => recordKey(r) === key))
      .filter(Boolean),
    license: collection.license,
  };
}
