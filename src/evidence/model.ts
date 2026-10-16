import {
  type Actor,
  creatorKinds,
  type Review,
  reviewResults,
  type Source,
  sources,
} from "../annotation/model";

export const MAX_PACKET_BYTES = 1_000_000;
export const MAX_PACKET_TEXT = 20_000;
export const MAX_ANCHORS = 32;
export interface EvidenceAnchor {
  sourceId: string;
  start: number;
  end: number;
  quote: string;
}
export interface EvidencePacket {
  schemaVersion: 1;
  kind: "source-evidence-packet";
  sources: Source[];
  researchQuestion: string;
  claim: string;
  reasoning: string;
  creator: Actor;
  evidence: EvidenceAnchor[];
  review: Review | null;
}
export type PacketChanges = Partial<
  Pick<EvidencePacket, "researchQuestion" | "claim" | "reasoning" | "creator" | "evidence">
>;
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected a source-evidence packet object.");
  return value as Record<string, unknown>;
}
function keys(value: Record<string, unknown>, expected: string[]) {
  const actual = Object.keys(value);
  if (actual.length !== expected.length || actual.some((key) => !expected.includes(key)))
    throw new Error("Unsupported or missing evidence-packet fields.");
}
function text(value: unknown, label: string, required = false): asserts value is string {
  if (typeof value !== "string" || value.length > MAX_PACKET_TEXT || (required && !value.trim()))
    throw new Error(`Invalid or oversized ${label}.`);
}
function actor(value: unknown, required = false): Actor {
  const candidate = object(value);
  keys(candidate, ["kind", "name"]);
  if (!creatorKinds.includes(candidate.kind as Actor["kind"]))
    throw new Error("Unsupported declared actor kind.");
  text(candidate.name, "actor name", required);
  return candidate as unknown as Actor;
}
export function createAnchor(sourceId: string, start: number, end: number): EvidenceAnchor {
  const source = sources.find((item) => item.id === sourceId);
  if (
    !source ||
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    end <= start ||
    end > source.text.length
  )
    throw new Error("Select a nonempty passage inside a known source.");
  return { sourceId, start, end, quote: source.text.slice(start, end) };
}
function validate(input: unknown): EvidencePacket {
  const value = object(input);
  keys(value, [
    "schemaVersion",
    "kind",
    "sources",
    "researchQuestion",
    "claim",
    "reasoning",
    "creator",
    "evidence",
    "review",
  ]);
  if (value.schemaVersion !== 1 || value.kind !== "source-evidence-packet")
    throw new Error("Unsupported source-evidence packet version or format.");
  if (!Array.isArray(value.sources) || value.sources.length !== sources.length)
    throw new Error("The complete frozen source snapshot is required.");
  value.sources.forEach((entry: unknown, index: number) => {
    const candidate = object(entry);
    const original = sources[index];
    if (!original) throw new Error("Unknown source.");
    const originalKeys = Object.keys(original) as (keyof Source)[];
    keys(candidate, originalKeys);
    if (originalKeys.some((key) => candidate[key] !== original[key]))
      throw new Error("Unknown or changed source snapshot. Keep the original source unchanged.");
  });
  text(value.researchQuestion, "research question");
  text(value.claim, "claim");
  text(value.reasoning, "reasoning");
  actor(value.creator);
  if (!Array.isArray(value.evidence) || value.evidence.length > MAX_ANCHORS)
    throw new Error(`A packet supports up to ${MAX_ANCHORS} quotations.`);
  const identities = new Set<string>();
  for (const entry of value.evidence) {
    const candidate = object(entry);
    keys(candidate, ["sourceId", "start", "end", "quote"]);
    if (typeof candidate.sourceId !== "string") throw new Error("Unknown quotation source.");
    const anchor = createAnchor(
      candidate.sourceId,
      candidate.start as number,
      candidate.end as number,
    );
    if (candidate.quote !== anchor.quote)
      throw new Error("Quotation does not match its exact source offsets.");
    const identity = JSON.stringify([anchor.sourceId, anchor.start, anchor.end]);
    if (identities.has(identity)) throw new Error("The same quotation is already retained.");
    identities.add(identity);
  }
  if (value.review !== null) {
    const candidate = object(value.review);
    keys(candidate, ["reviewer", "criterion", "result"]);
    actor(candidate.reviewer, true);
    text(candidate.criterion, "review criterion", true);
    if (!reviewResults.includes(candidate.result as Review["result"]))
      throw new Error("Unsupported review result.");
    if (!value.claim.trim() || !value.reasoning.trim() || !value.evidence.length)
      throw new Error("Record a claim, reasoning and source quotation before reviewing.");
  }
  if (new TextEncoder().encode(JSON.stringify(value, null, 2)).byteLength > MAX_PACKET_BYTES)
    throw new Error("The source-evidence packet exceeds 1 MB.");
  return structuredClone(value) as unknown as EvidencePacket;
}
export function createPacket(): EvidencePacket {
  return validate({
    schemaVersion: 1,
    kind: "source-evidence-packet",
    sources: sources.map((source) => ({ ...source })),
    researchQuestion: "",
    claim: "",
    reasoning: "",
    creator: { kind: "unknown", name: "" },
    evidence: [],
    review: null,
  });
}
export function parsePacket(input: string): EvidencePacket {
  if (typeof input !== "string" || new TextEncoder().encode(input).byteLength > MAX_PACKET_BYTES)
    throw new Error("The source-evidence packet exceeds 1 MB or is not JSON text.");
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    throw new Error("Cannot read JSON. Choose an exported source-evidence packet.");
  }
  return validate(value);
}
export function serializePacket(value: EvidencePacket): string {
  return JSON.stringify(validate(value), null, 2);
}
export function revisePacket(original: EvidencePacket, changes: PacketChanges): EvidencePacket {
  const editable = ["researchQuestion", "claim", "reasoning", "creator", "evidence"];
  if (Object.keys(changes).some((key) => !editable.includes(key)))
    throw new Error("A revision cannot replace source identity or record a review.");
  const candidate = { ...original, ...changes };
  if (
    editable.some(
      (key) =>
        JSON.stringify(candidate[key as keyof EvidencePacket]) !==
        JSON.stringify(original[key as keyof EvidencePacket]),
    )
  )
    candidate.review = null;
  return validate(candidate);
}
export function recordReview(original: EvidencePacket, review: Review): EvidencePacket {
  return validate({ ...original, review });
}
