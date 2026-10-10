import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  type Annotation,
  createNotebook,
  letterSources,
  parseNotebook,
  reviseAnnotation,
  serializeNotebook,
} from "../src/annotation/model";

const caseId = "hsa-benndorf-1879";
const letter = letterSources[0];
if (!letter) throw new Error("Missing HSA source.");
const mention = (): Annotation => {
  const quote = "Ich kenne E. Hübner fast gar nicht";
  const start = letter.text.indexOf(quote);
  return {
    id: "huebner-mention",
    sourceId: letter.id,
    start,
    end: start + quote.length,
    quote,
    category: "person",
    note: "Benndorf qualifies his personal knowledge of Hübner.",
    creator: { kind: "unknown", name: "" },
    review: null,
  };
};

describe("HSA letter annotation case", () => {
  it("preserves the upstream raw copy and changes only browser line endings", () => {
    const raw = readFileSync(
      new URL("../data/hsa-letter/raw/brief-benndorf-1879.txt", import.meta.url),
    );
    expect(letter.text).toBe(raw.toString("utf8").replace(/\r\n?/g, "\n"));
    expect(createHash("sha256").update(raw).digest("hex")).toBe(letter.rawSha256);
    expect(createHash("sha256").update(letter.text).digest("hex")).toBe(letter.textSha256);
    expect(letter.text).toContain("Ein Missbehagen wie Sie es schildern |2|");
    expect(letter.author).toBe("Friedrich August Otto Benndorf");
    expect(letter.editor).toBe("Hubert Szemethy (2022)");
    expect(letter.forecaster).toBeUndefined();
  });
  it("round trips real quotation offsets and full distinct source attribution", () => {
    const notebook = createNotebook({ annotations: [mention()] }, caseId);
    expect(parseNotebook(serializeNotebook(notebook), caseId)).toEqual(notebook);
    expect(notebook.annotations[0]?.quote).toBe("Ich kenne E. Hübner fast gar nicht");
    expect(notebook.sources[0]?.rights).toContain("Public-domain letter text");
    expect(notebook.annotations[0]?.creator).toEqual({ kind: "unknown", name: "" });
  });
  it("rejects cross-case notebooks and forecast categories without changing source contracts", () => {
    const letters = createNotebook({ annotations: [mention()] }, caseId);
    const forecasts = createNotebook();
    expect(() => parseNotebook(serializeNotebook(letters))).toThrow("original research case");
    expect(() => parseNotebook(serializeNotebook(forecasts), caseId)).toThrow(
      "original research case",
    );
    expect(() =>
      createNotebook({ annotations: [{ ...mention(), category: "forecast" }] }, caseId),
    ).toThrow("category");
    expect(() => createNotebook({ annotations: [mention()] })).toThrow("source");
    expect(() =>
      parseNotebook(
        JSON.stringify({ ...letters, sources: [{ ...letter, editor: "Invented editor" }] }),
        caseId,
      ),
    ).toThrow("changed source");
  });
  it("clears a review on letter revisions and retains it for unchanged content", () => {
    const annotation = mention();
    annotation.review = {
      reviewer: { kind: "human", name: "Test reviewer" },
      criterion: "The quotation names Hübner.",
      result: "supports",
    };
    expect(reviseAnnotation(annotation, { note: annotation.note }, caseId).review).toEqual(
      annotation.review,
    );
    expect(
      reviseAnnotation(annotation, { note: "Changed interpretation" }, caseId).review,
    ).toBeNull();
  });
});
