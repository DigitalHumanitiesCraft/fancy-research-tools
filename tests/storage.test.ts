import { describe, expect, it } from "vitest";
import sample from "../fixtures/demo.json";
import { parseDataset } from "../src/adapters/json";
import { createDraftStorage } from "../src/app/storage";

const dataset = parseDataset(JSON.stringify(sample));
function memory(initial: string | null = null) {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => {
      value = next;
    },
  };
}

describe("editor draft protection", () => {
  it.each(["", "broken JSON"])(
    "does not overwrite an invalid stored copy %j when overwrite is declined",
    (stored) => {
      const storage = memory(stored);
      const draft = createDraftStorage("/tool/", () => storage);
      expect(() => draft.restore()).toThrow();
      expect(draft.save({ revision: 1, dataset }, () => false).error).toContain("preserved");
      expect(storage.getItem()).toBe(stored);
      expect(draft.save({ revision: 1, dataset }, () => true)).toEqual({});
      expect(draft.restore()).toEqual({ revision: 1, dataset });
    },
  );

  it("preserves a newer revision written by another tab", () => {
    const storage = memory();
    const first = createDraftStorage("/tool/", () => storage);
    const second = createDraftStorage("/tool/", () => storage);
    first.restore();
    second.restore();
    first.save({ revision: 1, dataset }, () => true);
    expect(second.save({ revision: 2, dataset }, () => true).error).toContain(
      "Another tab changed",
    );
    expect(first.restore()?.revision).toBe(1);
  });

  it("reports inaccessible storage without a success result", () => {
    const draft = createDraftStorage("/tool/", () => {
      throw new Error("blocked");
    });
    expect(() => draft.restore()).toThrow("blocked");
    expect(draft.save({ revision: 1, dataset }, () => true).error).toContain("unavailable or full");
  });
});
