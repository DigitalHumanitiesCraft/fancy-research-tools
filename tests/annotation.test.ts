import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  type Annotation,
  createNotebook,
  creatorKinds,
  MAX_ANNOTATIONS,
  MAX_NOTEBOOK_BYTES,
  MAX_TEXT_LENGTH,
  parseNotebook,
  reviseAnnotation,
  serializeNotebook,
  sources,
} from "../src/annotation/model";

const observation = (): Annotation => {
  const source = sources[0];
  if (!source) throw new Error("Missing bulletin fixture.");
  return {
    id: "annotation-1",
    sourceId: source.id,
    start: 168,
    end: 309,
    quote: source.text.slice(168, 309),
    category: "observation",
    note: "The discussion attributes the wind estimate to scatterometer data.",
    creator: { kind: "unknown", name: "" },
    review: null,
  };
};
const make = () =>
  createNotebook({ researchQuestion: "How is uncertainty stated?", annotations: [observation()] });
const parse = (value: unknown) => parseNotebook(JSON.stringify(value));

describe("frozen forecast-discussion annotation", () => {
  it("retains real bulletin text, published bylines and independently fixed quotation anchors", () => {
    expect(sources.map((source) => source.forecaster)).toEqual(["Brown", "Blake"]);
    expect(sources[0]?.text.slice(672, 781)).toBe(
      "Given that the system is still in its development stage, the initial\nmotion is a somewhat uncertain 020/3 kt.",
    );
    expect(sources[1]?.text.slice(786, 902)).toBe(
      "The frontal feature is forecast to weaken while it moves \nacross Florida and gradually lose its influence on Milton.",
    );
    for (const [index, number] of ["002", "006"].entries()) {
      const source = sources[index];
      if (!source) throw new Error("Missing source.");
      const raw = readFileSync(
        new URL(`../data/nhc-milton/raw/milton-discussion-${number}.html`, import.meta.url),
      );
      expect(createHash("sha256").update(raw).digest("hex")).toBe(source.rawSha256);
      expect(createHash("sha256").update(source.text).digest("hex")).toBe(source.textSha256);
      expect(raw.toString("utf8")).toContain(`<pre>${source.text}</pre>`);
    }
  });
  it("round trips unfinished work and separately declared annotation provenance", () => {
    expect(parseNotebook(serializeNotebook(createNotebook()))).toEqual(createNotebook());
    for (const kind of creatorKinds) {
      const entry = { ...observation(), creator: { kind, name: "Self-declared producer" } };
      const notebook = createNotebook({ annotations: [entry] });
      expect(parseNotebook(serializeNotebook(notebook))).toEqual(notebook);
      expect(notebook.annotations[0]?.review).toBeNull();
    }
  });
  it("keeps canonical source data independent of exported or restored working copies", () => {
    const notebook = make();
    const restored = parseNotebook(serializeNotebook(notebook));
    const source = restored.sources[0];
    if (!source) throw new Error("Missing source.");
    source.text = "Changed locally";
    expect(notebook.sources[0]?.text).toBe(sources[0]?.text);
    expect(() => serializeNotebook(restored)).toThrow("changed source");
  });
  it("preserves exact author text and treats HTML-like strings as plain data", () => {
    const entry = observation();
    entry.note = '  <img src=x onerror="alert(1)">\r\nSecond line\rThird\n  ';
    entry.creator.name = "  A\r\nB  ";
    const notebook = createNotebook({ researchQuestion: "Q\r\nQ  ", annotations: [entry] });
    expect(parseNotebook(serializeNotebook(notebook))).toEqual(notebook);
  });
  it.each([
    (value: ReturnType<typeof make>) => ({ ...value, extra: true }),
    (value: ReturnType<typeof make>) => ({ ...value, schemaVersion: 2 }),
    (value: ReturnType<typeof make>) => ({ ...value, caseId: "met-instruments" }),
    (value: ReturnType<typeof make>) => ({ ...value, sources: value.sources.slice(1) }),
    (value: ReturnType<typeof make>) => ({ ...value, sources: [...value.sources].reverse() }),
    (value: ReturnType<typeof make>) => ({
      ...value,
      sources: [{ ...value.sources[0], text: "Changed" }, value.sources[1]],
    }),
    (value: ReturnType<typeof make>) => ({
      ...value,
      sources: [{ ...value.sources[0], url: "javascript:alert(1)" }, value.sources[1]],
    }),
    (value: ReturnType<typeof make>) => ({
      ...value,
      sources: [{ ...value.sources[0], validated: true }, value.sources[1]],
    }),
  ])("rejects incompatible or changed notebook evidence %#", (change) => {
    expect(() => parse(change(make()))).toThrow();
  });
  it.each([
    { start: -1 },
    { start: 168.5 },
    { end: 100_000 },
    { end: 168 },
    { quote: "Invented evidence" },
    { sourceId: "other-bulletin" },
    { category: "verified" },
    { id: "" },
    { creator: { kind: "automatically-verified", name: "A" } },
    { creator: { kind: "human", name: "A", authenticated: true } },
    {
      review: {
        reviewer: { kind: "human", name: "" },
        criterion: "Source fit",
        result: "supports",
      },
    },
    { review: { reviewer: { kind: "human", name: "A" }, criterion: "  ", result: "supports" } },
    {
      review: {
        reviewer: { kind: "human", name: "A" },
        criterion: "Source fit",
        result: "validated",
      },
    },
    { extra: "Preserve me" },
  ])("rejects invalid anchors and unsupported assertions %#", (change) => {
    const notebook = make();
    expect(() => parse({ ...notebook, annotations: [{ ...observation(), ...change }] })).toThrow();
  });
  it("rejects number overflow, duplicate IDs and excessive annotations", () => {
    expect(() =>
      parseNotebook(JSON.stringify(make()).replace('"start":168', '"start":1e999')),
    ).toThrow("offsets");
    expect(() => createNotebook({ annotations: [observation(), observation()] })).toThrow("unique");
    expect(() =>
      createNotebook({
        annotations: Array.from({ length: MAX_ANNOTATIONS + 1 }, (_, index) => ({
          ...observation(),
          id: `a-${index}`,
        })),
      }),
    ).toThrow("up to");
  });
  it("records a named source-fit reviewer and criterion without asserting authentication", () => {
    const entry = observation();
    entry.review = {
      reviewer: { kind: "human", name: "Researcher A" },
      criterion: "The selected quote states the measurement used by the forecaster.",
      result: "supports",
    };
    const notebook = createNotebook({ annotations: [entry] });
    expect(parseNotebook(serializeNotebook(notebook))).toEqual(notebook);
    expect(() =>
      parse({
        ...notebook,
        annotations: [{ ...entry, review: { ...entry.review, verifiedAt: "2026-10-10" } }],
      }),
    ).toThrow("Unsupported");
  });
  it("clears a review when its annotation changes and retains it on a no-op", () => {
    const entry = observation();
    entry.review = {
      reviewer: { kind: "human", name: "A" },
      criterion: "Quotation agreement",
      result: "supports",
    };
    expect(reviseAnnotation(entry, { note: entry.note }).review).toEqual(entry.review);
    expect(reviseAnnotation(entry, { creator: { ...entry.creator } }).review).toEqual(entry.review);
    expect(reviseAnnotation(entry, { note: "Revised interpretation" }).review).toBeNull();
    expect(reviseAnnotation(entry, { category: "uncertainty" }).review).toBeNull();
    expect(
      reviseAnnotation(entry, { creator: { kind: "agent", name: "Reviser" } }).review,
    ).toBeNull();
    expect(
      reviseAnnotation(entry, { start: 672, end: 781, quote: sources[0]?.text.slice(672, 781) })
        .review,
    ).toBeNull();
    expect(entry.review).not.toBeNull();
    expect(() => reviseAnnotation(entry, JSON.parse('{"id":"replaced"}'))).toThrow("identity");
    expect(() => reviseAnnotation(entry, JSON.parse('{"review":null}'))).toThrow("review");
  });
  it("enforces both raw import and formatted export byte limits", () => {
    expect(() => parseNotebook(" ".repeat(MAX_NOTEBOOK_BYTES + 1))).toThrow("1 MB");
    expect(() => parseNotebook("{invalid json}")).toThrow("Cannot read");
    expect(() => createNotebook({ researchQuestion: "a".repeat(MAX_TEXT_LENGTH + 1) })).toThrow(
      "research question",
    );
    const annotations = Array.from({ length: 9 }, (_, index) => ({
      ...observation(),
      id: `a-${index}`,
      note: "\u0000".repeat(MAX_TEXT_LENGTH),
    }));
    expect(() => createNotebook({ annotations })).toThrow("1 MB");
    const retained = createNotebook({ annotations: annotations.slice(0, 7) });
    expect(parseNotebook(serializeNotebook(retained))).toEqual(retained);
  });
});
