import { parseDataset, serializeDataset } from "../adapters/json";
import type { Dataset } from "../domain/dataset";

export const MAX_BYTES = 1024 * 1024;
export interface Draft {
  revision: number;
  dataset: Dataset;
}

export function withinSizeLimit(candidate: Dataset): Dataset {
  if (new Blob([serializeDataset(candidate)]).size > MAX_BYTES) {
    throw new Error(
      "The exported collection would exceed the 1 MiB limit. Reduce the content before saving.",
    );
  }
  return candidate;
}

/** Keeps persistence protection independent of rendering and form state. */
export function createDraftStorage(
  pathname: string,
  storage: () => Pick<Storage, "getItem" | "setItem">,
) {
  // GitHub Pages projects share an origin; scope drafts to this application path.
  const key = `fancy-research-tools:${pathname.replace(/index\.html$/, "")}:collection:v1`;
  let snapshot: string | null = null;
  let protectStoredCopy = false;
  return {
    restore(): Draft | null {
      const stored = storage().getItem(key);
      snapshot = stored;
      if (stored === null) return null;
      protectStoredCopy = true;
      if (new Blob([stored]).size > MAX_BYTES * 2)
        throw new Error("Stored collection is too large.");
      const value: unknown = JSON.parse(stored);
      if (
        !value ||
        typeof value !== "object" ||
        !("revision" in value) ||
        !("dataset" in value) ||
        typeof value.revision !== "number" ||
        !Number.isSafeInteger(value.revision) ||
        value.revision < 0
      )
        throw new Error("Invalid stored revision.");
      const dataset = withinSizeLimit(parseDataset(JSON.stringify(value.dataset)));
      protectStoredCopy = false;
      return { dataset, revision: value.revision };
    },
    save(draft: Draft, confirmOverwrite: () => boolean): { error?: string } {
      if (protectStoredCopy) {
        if (!confirmOverwrite())
          return {
            error:
              "The previous browser copy is preserved. Current changes are only in this tab; export the collection before closing it.",
          };
        protectStoredCopy = false;
      }
      try {
        if (storage().getItem(key) !== snapshot)
          return {
            error:
              "Another tab changed the browser copy. Your changes remain in this tab and have not overwritten it. Export this collection before reloading to compare the versions.",
          };
        const nextSnapshot = JSON.stringify(draft);
        storage().setItem(key, nextSnapshot);
        snapshot = nextSnapshot;
        return {};
      } catch {
        return {
          error:
            "Browser storage is unavailable or full. Your changes remain in this tab. Export the collection before closing it.",
        };
      }
    },
  };
}
