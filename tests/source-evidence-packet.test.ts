import { describe, expect, it } from "vitest";
import sourceData from "../data/nhc-milton/sources.json";
import {
  createAnchor,
  createPacket,
  MAX_PACKET_BYTES,
  parsePacket,
  recordReview,
  revisePacket,
  serializePacket,
} from "../src/evidence/model";

const quotation =
  "Scatterometer data around midday confirmed that the circulation of\n" +
  "the depression was well-defined, and it also revealed peak winds of\n35 kt.";
function example() {
  return revisePacket(createPacket(), {
    researchQuestion: "How is an intensity estimate attributed?",
    claim: "The discussion attributes reported peak winds to scatterometer data.",
    reasoning: "The quotation explicitly associates the measurement with that instrument.",
    creator: { kind: "agent", name: "Software test fixture" },
    evidence: [createAnchor("nhc-al142024-discussion-002", 168, 309)],
  });
}
function reviewed() {
  return recordReview(example(), {
    reviewer: { kind: "agent", name: "Test reviewer" },
    criterion: "The retained quotation explicitly names the observation instrument and winds.",
    result: "supports",
  });
}
describe("source-evidence packets", () => {
  it("retains the exact original sources and independently specified quotation", () => {
    const packet = example();
    expect(packet.sources).toEqual(sourceData);
    expect(packet.evidence).toEqual([
      {
        sourceId: "nhc-al142024-discussion-002",
        start: 168,
        end: 309,
        quote: quotation,
      },
    ]);
    expect(parsePacket(serializePacket(packet))).toEqual(packet);
    expect(packet.review).toBeNull();
  });
  it("preserves author strings including whitespace and CRLF until their own field changes", () => {
    const packet = revisePacket(example(), {
      researchQuestion: " First\r\nsecond ",
      claim: " Claim\r\nline ",
      reasoning: " Reason\r\nline ",
      creator: { kind: "unknown", name: " Name\r\nline " },
    });
    const reopened = parsePacket(serializePacket(packet));
    expect(reopened).toEqual(packet);
    expect(revisePacket(reopened, { claim: "Changed claim" })).toEqual({
      ...packet,
      claim: "Changed claim",
    });
  });
  it("requires deliberate declared review and invalidates it for every changed content boundary", () => {
    const original = reviewed();
    expect(original.review?.reviewer.kind).toBe("agent");
    expect(revisePacket(original, { claim: original.claim }).review).toEqual(original.review);
    for (const changes of [
      { researchQuestion: "Changed question" },
      { claim: "Changed claim" },
      { reasoning: "Changed reasoning" },
      { creator: { kind: "human" as const, name: "Declared" } },
      { evidence: [createAnchor("nhc-al142024-discussion-002", 672, 781)] },
    ])
      expect(revisePacket(original, changes).review).toBeNull();
    expect(original.review).not.toBeNull();
    const review = original.review;
    if (!review) throw new Error("Missing expected review.");
    expect(() => recordReview(createPacket(), review)).toThrow(/claim, reasoning/);
    expect(() =>
      recordReview(example(), {
        ...review,
        reviewer: { kind: "human", name: " " },
      }),
    ).toThrow(/actor name/);
  });
  it("rejects changed sources, false anchors, duplicates, unknown fields and foreign formats", () => {
    const original = example();
    const changedSource = structuredClone(original);
    changedSource.sources = changedSource.sources.map((source, index) =>
      index === 0 ? { ...source, text: `${source.text}changed` } : source,
    );
    const changedQuote = structuredClone(original);
    changedQuote.evidence = changedQuote.evidence.map((anchor) => ({
      ...anchor,
      quote: "Invented wording",
    }));
    const changedOffset = structuredClone(original);
    changedOffset.evidence = changedOffset.evidence.map((anchor) => ({ ...anchor, end: 310 }));
    const duplicate = structuredClone(original);
    duplicate.evidence.push(...original.evidence);
    for (const invalid of [
      changedSource,
      changedQuote,
      changedOffset,
      duplicate,
      { ...original, unknown: true },
      { ...original, schemaVersion: 2 },
      { ...original, kind: "annotation-notebook" },
      { ...original, evidence: [{ ...original.evidence[0], unknown: true }] },
    ])
      expect(() => parsePacket(JSON.stringify(invalid))).toThrow();
    expect(original.sources).toEqual(sourceData);
  });
  it("bounds input and anchors without silently truncating", () => {
    expect(() => parsePacket(" ".repeat(MAX_PACKET_BYTES + 1))).toThrow(/1 MB/);
    expect(() => createAnchor("nhc-al142024-discussion-002", 168, 168)).toThrow(/nonempty/);
    expect(() => createAnchor("nhc-al142024-discussion-002", -1, 12)).toThrow(/nonempty/);
    expect(() => createAnchor("unknown", 0, 1)).toThrow(/known source/);
    expect(() => parsePacket("{bad json}")).toThrow(/Cannot read JSON/);
  });
});
