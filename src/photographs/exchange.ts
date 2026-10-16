import {
  initialState,
  type PhotographCollection,
  type PhotoState,
  recordKey,
  selectionExport,
} from "./model";

export const MAX_SELECTION_BYTES = 2_000_000;

function equal(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (Array.isArray(left) || Array.isArray(right))
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((v, i) => equal(v, right[i]))
    );
  if (typeof left !== "object" || left === null || typeof right !== "object" || right === null)
    return false;
  const a = left as Record<string, unknown>;
  const b = right as Record<string, unknown>;
  return (
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every((key) => Object.hasOwn(b, key) && equal(a[key], b[key]))
  );
}

/** Reopening verifies the complete packet against this frozen collection, including source fields. */
export function openSelection(text: string, collection: PhotographCollection): PhotoState {
  if (new TextEncoder().encode(text).length > MAX_SELECTION_BYTES)
    throw new Error("The selection file exceeds 2 MB.");
  const packet = JSON.parse(text);
  if (
    !packet ||
    typeof packet !== "object" ||
    Array.isArray(packet) ||
    !packet.query ||
    typeof packet.query !== "object" ||
    !Array.isArray(packet.selected) ||
    packet.selected.length > 4
  )
    throw new Error("This is not a supported photograph selection.");
  const query = packet.query;
  if (
    ![query.text, query.creator, query.technique].every((value) => typeof value === "string") ||
    !["date", "title"].includes(query.sort)
  )
    throw new Error("The selection has unsupported search settings.");
  const selected = packet.selected.map((record: unknown) => {
    if (!record || typeof record !== "object" || !("id" in record))
      throw new Error("The selection contains an invalid photograph.");
    const original = collection.items.find((item) => item.id === record.id);
    if (!original || !equal(record, original))
      throw new Error("A selected photograph differs from this frozen source snapshot.");
    return recordKey(original);
  });
  if (new Set(selected).size !== selected.length)
    throw new Error("The selection contains duplicate photographs.");
  const state = {
    ...initialState("", collection.items),
    view: "comparison" as const,
    query: query.text,
    creator: query.creator,
    technique: query.technique,
    sort: query.sort,
    selected,
  };
  if (!equal(packet, selectionExport(collection, state)))
    throw new Error("The selection format or source derivation differs from this collection.");
  return state;
}
