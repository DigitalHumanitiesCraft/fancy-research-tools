import { type Actor, type Review, sources } from "../annotation/model";
import { bindTextValue } from "../ui/text-value";
import {
  createAnchor,
  createPacket,
  type EvidencePacket,
  MAX_PACKET_BYTES,
  parsePacket,
  recordReview,
  revisePacket,
  serializePacket,
} from "./model";
import { connectSourceSelection } from "./source-selection";
import "./styles.css";

function element<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing evidence control: ${id}`);
  return node as T;
}
const question = bindTextValue(element<HTMLTextAreaElement>("research-question"));
const claim = bindTextValue(element<HTMLTextAreaElement>("claim"));
const reasoning = bindTextValue(element<HTMLTextAreaElement>("reasoning"));
const creatorName = bindTextValue(element<HTMLInputElement>("creator-name"));
const reviewerName = bindTextValue(element<HTMLInputElement>("reviewer-name"));
const criterion = bindTextValue(element<HTMLTextAreaElement>("criterion"));
const creatorKind = element<HTMLSelectElement>("creator-kind");
const reviewerKind = element<HTMLSelectElement>("reviewer-kind");
const result = element<HTMLSelectElement>("result");
const sourceSelect = element<HTMLSelectElement>("source");
const sourceText = element<HTMLTextAreaElement>("source-text");
const sourceSelection = connectSourceSelection(sourceText);
const openPacket = element<HTMLInputElement>("open-packet");
let packet = createPacket();
let lastRetained = serializePacket(packet);
let revision = 0;
let pendingRead = 0;
let reviewTouched = false;
let selected = sources[0];
if (!selected) throw new Error("No evidence sources available.");
const actorLabels: Record<Actor["kind"], string> = {
  unknown: "Unknown",
  human: "Human",
  llm: "LLM",
  agent: "AI agent",
};
const resultLabels: Record<Review["result"], string> = {
  supports: "Supports",
  "does-not-support": "Does not support",
  unclear: "Unclear",
};
function status(message: string, error = false) {
  const node = element("file-status");
  node.textContent = message;
  node.dataset.error = String(error);
}
function hasChanges() {
  return reviewTouched || serializePacket(packet) !== lastRetained;
}
function resetReviewForm() {
  reviewerKind.value = "unknown";
  reviewerName.restore("");
  criterion.restore("");
  result.value = "unclear";
  reviewTouched = false;
}
function renderReview(cleared = false) {
  const review = packet.review;
  element("review-status").textContent = review
    ? `${resultLabels[review.result]}. Reviewer (self-declared): ${actorLabels[review.reviewer.kind]}, ${review.reviewer.name}. Criterion: ${review.criterion}`
    : cleared
      ? "Content changed. The previous review and unfinished review inputs were cleared; reassess this version."
      : "No review recorded.";
  element("clear-review").hidden = review === null;
}
function revise(changes: Parameters<typeof revisePacket>[1]) {
  const reviewed = packet.review !== null || reviewTouched;
  packet = revisePacket(packet, changes);
  revision++;
  if (reviewed) resetReviewForm();
  renderReview(reviewed);
  status("Changes stay in this tab until exported.");
}
function renderSource() {
  if (!selected) return;
  sourceSelect.value = selected.id;
  sourceText.value = selected.text;
  sourceText.setSelectionRange(0, 0);
  sourceText.scrollTop = 0;
  element("issued").textContent = selected.issuedAt;
  element("forecaster").textContent = selected.forecaster ?? "Not recorded";
  element<HTMLAnchorElement>("source-link").href = selected.url;
  element("source-id").textContent = selected.id;
  element("raw-hash").textContent = selected.rawSha256;
  element("text-hash").textContent = selected.textSha256;
}
function showQuotation(index: number) {
  const anchor = packet.evidence[index];
  if (!anchor) return;
  const source = sources.find((item) => item.id === anchor.sourceId);
  if (!source) return;
  selected = source;
  renderSource();
  sourceText.focus();
  sourceText.setSelectionRange(anchor.start, anchor.end);
  sourceSelection.reveal(anchor.start, true);
  sourceText.scrollIntoView({ block: "nearest" });
  element("selection-status").textContent =
    `Retained quotation selected at offsets ${anchor.start}–${anchor.end}.`;
}
function renderEvidence() {
  const list = element<HTMLOListElement>("evidence");
  list.replaceChildren();
  element("empty-evidence").hidden = packet.evidence.length > 0;
  packet.evidence.forEach((anchor, index) => {
    const source = sources.find((item) => item.id === anchor.sourceId);
    if (!source) return;
    const item = document.createElement("li");
    const origin = document.createElement("p");
    origin.className = "quotation-origin";
    origin.textContent = `${source.title}, offsets ${anchor.start}–${anchor.end}`;
    const quote = document.createElement("blockquote");
    quote.textContent = anchor.quote;
    const actions = document.createElement("div");
    actions.className = "actions";
    const show = document.createElement("button");
    show.type = "button";
    show.textContent = "Return to quotation";
    show.addEventListener("click", () => showQuotation(index));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove quotation";
    remove.addEventListener("click", () => {
      revise({ evidence: packet.evidence.filter((_, position) => position !== index) });
      renderEvidence();
      element("evidence-heading").focus();
    });
    actions.append(show, remove);
    item.append(origin, quote, actions);
    list.append(item);
  });
}
function restore(value: EvidencePacket) {
  packet = value;
  question.restore(packet.researchQuestion);
  claim.restore(packet.claim);
  reasoning.restore(packet.reasoning);
  creatorName.restore(packet.creator.name);
  creatorKind.value = packet.creator.kind;
  resetReviewForm();
  renderEvidence();
  renderReview();
}
for (const source of sources) {
  const option = document.createElement("option");
  option.value = source.id;
  option.textContent = source.title;
  sourceSelect.append(option);
}
sourceSelect.addEventListener("change", () => {
  selected = sources.find((source) => source.id === sourceSelect.value) ?? sources[0];
  renderSource();
});
element("retain-quotation").addEventListener("click", () => {
  if (!selected) return;
  try {
    const anchor = createAnchor(selected.id, sourceText.selectionStart, sourceText.selectionEnd);
    revise({ evidence: [...packet.evidence, anchor] });
    renderEvidence();
    element("selection-status").textContent =
      "Exact quotation retained. Source text remains unchanged.";
  } catch (error) {
    element("selection-status").textContent =
      error instanceof Error ? error.message : "Cannot retain this quotation.";
    sourceText.focus();
  }
});
for (const id of ["research-question", "claim", "reasoning", "creator-name", "creator-kind"]) {
  element(id).addEventListener(id === "creator-kind" ? "change" : "input", () => {
    revise({
      researchQuestion: question.read(),
      claim: claim.read(),
      reasoning: reasoning.read(),
      creator: { kind: creatorKind.value as Actor["kind"], name: creatorName.read() },
    });
  });
}
for (const id of ["reviewer-kind", "reviewer-name", "criterion", "result"]) {
  element(id).addEventListener(
    id === "reviewer-kind" || id === "result" ? "change" : "input",
    () => {
      reviewTouched = true;
      revision++;
      status("Review inputs are unfinished. Choose Record review to retain them in the packet.");
    },
  );
}
element<HTMLFormElement>("review-form").addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    packet = recordReview(packet, {
      reviewer: { kind: reviewerKind.value as Actor["kind"], name: reviewerName.read() },
      criterion: criterion.read(),
      result: result.value as Review["result"],
    });
    revision++;
    resetReviewForm();
    renderReview();
    status(
      "Review recorded for the current claim and evidence. Export to retain it outside this tab.",
    );
  } catch (error) {
    status(error instanceof Error ? error.message : "Cannot record this review.", true);
  }
});
element("clear-review").addEventListener("click", () => {
  packet = { ...packet, review: null };
  revision++;
  resetReviewForm();
  renderReview();
  status("Recorded review removed. Changes stay in this tab until exported.");
  element<HTMLFormElement>("review-form").querySelector<HTMLButtonElement>("button")?.focus();
});
element("export-packet").addEventListener("click", () => {
  if (
    reviewTouched &&
    !window.confirm(
      "Review inputs have not been recorded. Export the packet without those unfinished inputs?",
    )
  )
    return;
  const content = serializePacket(packet);
  const url = URL.createObjectURL(new Blob([content], { type: "application/json;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "source-evidence-packet.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  lastRetained = content;
  status(
    "Evidence-packet download requested. Keep the file and reopen it to check your retained work.",
  );
});
openPacket.addEventListener("change", async () => {
  const token = ++pendingRead;
  const file = openPacket.files?.[0];
  openPacket.value = "";
  if (!file) return;
  const startRevision = revision;
  try {
    if (file.size > MAX_PACKET_BYTES) throw new Error("The source-evidence packet exceeds 1 MB.");
    const candidate = parsePacket(await file.text());
    if (token !== pendingRead) return;
    if (revision !== startRevision)
      throw new Error(
        "Work changed while the file was being read. Open it again to replace the current version deliberately.",
      );
    if (
      hasChanges() &&
      !window.confirm(
        "Replace the current claim, evidence and review inputs with this validated packet? Export first to keep them.",
      )
    ) {
      status("Opening cancelled. Current work is unchanged.");
      return;
    }
    restore(candidate);
    revision++;
    lastRetained = serializePacket(packet);
    if (packet.evidence.length) showQuotation(0);
    status(
      "Evidence packet opened. Exact frozen sources and quotations matched; interpretation remains your responsibility.",
    );
  } catch (error) {
    if (token !== pendingRead) return;
    status(error instanceof Error ? error.message : "Cannot open this evidence packet.", true);
  }
});
window.addEventListener("beforeunload", (event) => {
  if (hasChanges()) event.preventDefault();
});
renderSource();
restore(packet);
