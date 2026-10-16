import { bindTextValue } from "../ui/text-value";
import { connectNotebook } from "./browser";
import {
  type Actor,
  type Annotation,
  type Category,
  createNotebook as createCaseNotebook,
  type Notebook,
  notebookCases,
  type Review,
  reviseAnnotation as reviseCaseAnnotation,
} from "./model";
import "./styles.css";

const caseId =
  document.body.dataset.case === "hsa-benndorf-1879" ? "hsa-benndorf-1879" : "nhc-milton-2024";
const definition = notebookCases[caseId];
const sources = definition.sources;
const createNotebook = (input: Parameters<typeof createCaseNotebook>[0] = {}) =>
  createCaseNotebook(input, caseId);
const reviseAnnotation = (
  original: Annotation,
  changes: Parameters<typeof reviseCaseAnnotation>[1],
) => reviseCaseAnnotation(original, changes, caseId);

function element<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing annotation control: ${id}`);
  return node as T;
}
const sourceSelect = element<HTMLSelectElement>("bulletin");
const sourceText = element<HTMLTextAreaElement>("bulletin-text");
const form = element<HTMLFormElement>("annotation-form");
const category = element<HTMLSelectElement>("category");
const creatorKind = element<HTMLSelectElement>("creator-kind");
const reviewerKind = element<HTMLSelectElement>("reviewer-kind");
const reviewResult = element<HTMLSelectElement>("review-result");
const recordReview = element<HTMLInputElement>("record-review");
const reviewFields = element<HTMLFieldSetElement>("review-fields");
const questionControl = element<HTMLTextAreaElement>("research-question");
const question = bindTextValue(questionControl);
const note = bindTextValue(element<HTMLTextAreaElement>("note"));
const creatorName = bindTextValue(element<HTMLInputElement>("creator-name"));
const reviewerName = bindTextValue(element<HTMLInputElement>("reviewer-name"));
const criterion = bindTextValue(element<HTMLTextAreaElement>("review-criterion"));
let notebook = createNotebook();
let active: Annotation | null = null;
let pendingAnchor: Pick<Annotation, "sourceId" | "start" | "end" | "quote"> | null = null;
let editing = false;
let reviewCleared = false;
let reviewTouched = false;
let reviewToRestore: Review | null = null;
let selected =
  sources.find((source) => source.id === new URL(location.href).searchParams.get("source")) ??
  sources[0];
if (!selected) throw new Error("No annotation sources available.");
let acceptedUrl = location.href;
const categoryLabels: Record<Category, string> = {
  observation: "Observation",
  forecast: "Forecast",
  uncertainty: "Stated uncertainty",
  person: "Person",
  place: "Place",
  "research-topic": "Research topic",
  "editorial-question": "Editorial question",
};
const actorLabels: Record<Actor["kind"], string> = {
  human: "Human",
  llm: "LLM",
  agent: "AI agent",
  unknown: "Unknown",
};
const resultLabels: Record<Review["result"], string> = {
  supports: "Supports",
  "does-not-support": "Does not support",
  unclear: "Unclear",
};
const status = (message: string) => {
  element("annotation-status").textContent = message;
};
for (const source of sources) {
  const option = document.createElement("option");
  option.value = source.id;
  option.textContent = source.title;
  sourceSelect.append(option);
}
for (const value of definition.categories) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = categoryLabels[value];
  category.append(option);
}
function renderSource() {
  if (!selected) return;
  sourceSelect.value = selected.id;
  sourceText.value = selected.text;
  sourceText.setSelectionRange(0, 0);
  sourceText.scrollTop = 0;
  element("issued").textContent = selected.issuedAt;
  element("forecaster").textContent = selected.forecaster ?? selected.author ?? "Not recorded";
  element<HTMLAnchorElement>("source-link").href = selected.url;
  element("raw-hash").textContent = selected.rawSha256;
  element("text-hash").textContent = selected.textSha256;
  element("selection-status").textContent = "";
}
function clearForm() {
  active = null;
  pendingAnchor = null;
  replaceQuotation.hidden = true;
  editing = false;
  reviewCleared = false;
  reviewTouched = false;
  reviewToRestore = null;
  form.hidden = true;
  element("review-change").textContent = "";
}
function mayDiscard() {
  return (
    !active || window.confirm("Discard the unfinished annotation? Saved annotations will remain.")
  );
}
function showReview() {
  reviewFields.hidden = !recordReview.checked;
  reviewFields.disabled = !recordReview.checked;
}
function readReview(): Review | null {
  return recordReview.checked
    ? {
        reviewer: { kind: reviewerKind.value as Actor["kind"], name: reviewerName.read() },
        criterion: criterion.read(),
        result: reviewResult.value as Review["result"],
      }
    : null;
}
function restoreReview(review: Review | null) {
  recordReview.checked = review !== null;
  reviewerKind.value = review?.reviewer.kind ?? "unknown";
  reviewerName.restore(review?.reviewer.name ?? "");
  criterion.restore(review?.criterion ?? "");
  reviewResult.value = review?.result ?? "unclear";
  showReview();
}
function startForm(annotation: Annotation, isEdit: boolean) {
  active = annotation;
  editing = isEdit;
  pendingAnchor = null;
  replaceQuotation.hidden = !isEdit;
  reviewCleared = false;
  reviewTouched = false;
  reviewToRestore = null;
  form.hidden = false;
  element("form-heading").textContent = isEdit ? "Edit annotation" : "New annotation";
  element("quotation").textContent = annotation.quote;
  category.value = annotation.category;
  note.restore(annotation.note);
  creatorKind.value = annotation.creator.kind;
  creatorName.restore(annotation.creator.name);
  restoreReview(annotation.review);
  element("review-change").textContent = "";
  showReview();
  status("");
  category.focus();
}
function navigateSource(id: string) {
  const next = sources.find((source) => source.id === id);
  if (!next) return;
  selected = next;
  const url = new URL(location.href);
  url.searchParams.set("source", id);
  if (url.href !== location.href) history.pushState({}, "", url);
  acceptedUrl = location.href;
  renderSource();
}
function returnToQuote(annotation: Annotation) {
  navigateSource(annotation.sourceId);
  sourceText.focus();
  sourceText.setSelectionRange(annotation.start, annotation.end);
  revealSourceOffset(annotation.start, true);
  sourceText.scrollIntoView({ block: "nearest" });
}
function revealSourceOffset(offset: number, align = false) {
  const style = getComputedStyle(sourceText);
  const measure = document.createElement("div");
  measure.className = "source-measure";
  measure.style.inlineSize = `${sourceText.clientWidth}px`;
  measure.style.font = style.font;
  measure.style.padding = style.padding;
  measure.textContent = sourceText.value.slice(0, offset);
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  measure.append(marker);
  document.body.append(measure);
  const top = marker.getBoundingClientRect().top - measure.getBoundingClientRect().top;
  const line = Number.parseFloat(style.lineHeight);
  if (
    align ||
    top < sourceText.scrollTop ||
    top + line > sourceText.scrollTop + sourceText.clientHeight
  ) {
    sourceText.scrollTop = Math.max(0, top - 2 * line);
  }
  measure.remove();
}
function actorText(actor: Actor) {
  return `${actorLabels[actor.kind]}${actor.name ? `, ${actor.name}` : ", name not recorded"}`;
}
function appendText(parent: HTMLElement, tag: "p" | "blockquote", text: string, className = "") {
  const node = document.createElement(tag);
  node.textContent = text;
  node.className = className;
  parent.append(node);
}
const replaceQuotation = document.createElement("button");
replaceQuotation.type = "button";
replaceQuotation.id = "replace-quotation";
replaceQuotation.textContent = "Use selection for this annotation";
replaceQuotation.hidden = true;
element("quotation").after(replaceQuotation);

const annotationFilters = document.createElement("div");
annotationFilters.className = "annotation-filters";
function annotationFilter(id: string, labelText: string, allText: string) {
  const group = document.createElement("div");
  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = labelText;
  const select = document.createElement("select");
  select.id = id;
  select.append(new Option(allText, ""));
  group.append(label, select);
  annotationFilters.append(group);
  select.addEventListener("change", renderAnnotations);
  return { select, group };
}
const annotationSource = annotationFilter("annotation-source", "Annotation source", "All sources");
for (const source of sources) annotationSource.select.append(new Option(source.title, source.id));
annotationSource.group.hidden = sources.length < 2;
const annotationCategory = annotationFilter(
  "annotation-category",
  "Annotation category",
  "All categories",
);
for (const value of definition.categories)
  annotationCategory.select.append(new Option(categoryLabels[value], value));
const clearAnnotationFilters = document.createElement("button");
clearAnnotationFilters.type = "button";
clearAnnotationFilters.textContent = "Clear annotation filters";
clearAnnotationFilters.addEventListener("click", () => {
  annotationSource.select.value = "";
  annotationCategory.select.value = "";
  renderAnnotations();
  annotationCategory.select.focus();
});
const filterStatus = document.createElement("p");
filterStatus.id = "annotation-filter-status";
filterStatus.setAttribute("role", "status");
annotationFilters.append(clearAnnotationFilters, filterStatus);
element("saved-heading").after(annotationFilters);

function renderAnnotations() {
  const list = element<HTMLOListElement>("annotations");
  list.replaceChildren();
  const filtered = notebook.annotations.filter(
    (annotation) =>
      (!annotationSource.select.value || annotation.sourceId === annotationSource.select.value) &&
      (!annotationCategory.select.value || annotation.category === annotationCategory.select.value),
  );
  const hasFilters = Boolean(annotationSource.select.value || annotationCategory.select.value);
  annotationFilters.hidden = notebook.annotations.length === 0;
  clearAnnotationFilters.hidden = !hasFilters;
  filterStatus.hidden = !hasFilters;
  filterStatus.textContent = hasFilters
    ? filtered.length +
      " matching annotations. Export includes all " +
      notebook.annotations.length +
      " saved annotations."
    : "";
  element("empty-notebook").hidden = filtered.length > 0;
  element("empty-notebook").textContent = notebook.annotations.length
    ? "No annotations match these filters."
    : "No annotations saved.";
  for (const annotation of filtered) {
    const item = document.createElement("li");
    item.dataset.annotationId = annotation.id;
    appendText(
      item,
      "p",
      sources.length === 1
        ? categoryLabels[annotation.category]
        : `${categoryLabels[annotation.category]}. ${sources.find((source) => source.id === annotation.sourceId)?.title ?? annotation.sourceId}`,
      "annotation-meta",
    );
    appendText(item, "blockquote", annotation.quote);
    appendText(item, "p", annotation.note, "annotation-note");
    appendText(
      item,
      "p",
      `Creator (self-declared): ${actorText(annotation.creator)}`,
      "annotation-meta",
    );
    appendText(
      item,
      "p",
      annotation.review
        ? `Source-fit review: ${resultLabels[annotation.review.result]}. Reviewer: ${actorText(annotation.review.reviewer)}. Criterion: ${annotation.review.criterion}`
        : "No source-fit review recorded.",
      "annotation-meta",
    );
    const actions = document.createElement("div");
    actions.className = "actions";
    for (const action of ["Return to quotation", "Edit", "Remove"] as const) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = action;
      button.addEventListener("click", () => {
        if (!mayDiscard()) return;
        if (
          action === "Remove" &&
          !window.confirm("Remove this annotation? Export a copy first if you want to keep it.")
        )
          return;
        clearForm();
        if (action === "Remove") {
          notebook = createNotebook({
            researchQuestion: question.read(),
            annotations: notebook.annotations.filter((entry) => entry.id !== annotation.id),
          });
          renderAnnotations();
          recovery.save();
          status("Annotation removed.");
          element("saved-heading").focus();
        } else {
          returnToQuote(annotation);
          if (action === "Edit") startForm(annotation, true);
        }
      });
      actions.append(button);
    }
    item.append(actions);
    list.append(item);
  }
}
function restore(next: Notebook) {
  notebook = next;
  question.restore(next.researchQuestion);
  clearForm();
  renderAnnotations();
  status("");
}
renderSource();
renderAnnotations();
const recovery = connectNotebook({
  caseId,
  mount: element("notebook-files"),
  read: () =>
    createNotebook({ researchQuestion: question.read(), annotations: notebook.annotations }),
  restore,
  hasPending: () => active !== null,
});
// Some browsers do not move a caret in readonly textareas. Keep their native
// selection and copying while providing a bounded keyboard range fallback.
sourceText.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || event.altKey) return;
  const {
    selectionStart: start,
    selectionEnd: end,
    selectionDirection: direction,
    value,
  } = sourceText;
  const anchor = direction === "backward" ? end : start;
  const cursor = direction === "backward" ? start : end;
  let next = cursor;
  if (event.key === "ArrowLeft")
    next = !event.shiftKey && start !== end ? start : Math.max(0, cursor - 1);
  if (event.key === "ArrowRight")
    next = !event.shiftKey && start !== end ? end : Math.min(value.length, cursor + 1);
  if (event.key === "Home")
    next =
      event.ctrlKey || event.metaKey || cursor === 0 ? 0 : value.lastIndexOf("\n", cursor - 1) + 1;
  if (event.key === "End") {
    const newline = value.indexOf("\n", cursor);
    next = event.ctrlKey || event.metaKey || newline < 0 ? value.length : newline;
  }
  event.preventDefault();
  if (event.shiftKey)
    sourceText.setSelectionRange(
      Math.min(anchor, next),
      Math.max(anchor, next),
      next < anchor ? "backward" : "forward",
    );
  else sourceText.setSelectionRange(next, next);
  revealSourceOffset(next);
});
questionControl.addEventListener("input", () => recovery.save());
element("export-notebook").addEventListener("click", () => recovery.export());
recordReview.addEventListener("change", () => {
  reviewTouched = true;
  showReview();
});
for (const id of ["reviewer-kind", "reviewer-name", "review-criterion", "review-result"]) {
  element(id).addEventListener("input", () => {
    reviewTouched = true;
  });
}
sourceSelect.addEventListener("change", () => {
  if (!mayDiscard()) {
    sourceSelect.value = selected?.id ?? "";
    return;
  }
  clearForm();
  navigateSource(sourceSelect.value);
});
window.addEventListener("popstate", () => {
  if (!mayDiscard()) {
    history.replaceState({}, "", acceptedUrl);
    return;
  }
  clearForm();
  selected =
    sources.find((source) => source.id === new URL(location.href).searchParams.get("source")) ??
    sources[0];
  acceptedUrl = location.href;
  renderSource();
  sourceText.focus();
});
element("annotate-selection").addEventListener("click", () => {
  const start = sourceText.selectionStart;
  const end = sourceText.selectionEnd;
  if (!selected || start === end) {
    element("selection-status").textContent =
      "Select a passage in the source first. Use the pointer or Shift with Left and Right.";
    sourceText.focus();
    return;
  }
  if (!mayDiscard()) return;
  startForm(
    {
      id: crypto.randomUUID(),
      sourceId: selected.id,
      start,
      end,
      quote: selected.text.slice(start, end),
      category: definition.categories[0] ?? "observation",
      note: "",
      creator: { kind: "unknown", name: "" },
      review: null,
    },
    false,
  );
  element("selection-status").textContent = "";
});
element("cancel-annotation").addEventListener("click", () => {
  clearForm();
  element("annotate-selection").focus();
});
function annotationChanges() {
  return {
    ...pendingAnchor,
    category: category.value as Category,
    note: note.read(),
    creator: { kind: creatorKind.value as Actor["kind"], name: creatorName.read() },
  };
}
function updateReview() {
  if (!active?.review) return;
  const revised = reviseAnnotation(active, annotationChanges());
  if (revised.review !== null) {
    if (reviewCleared && !reviewTouched) {
      restoreReview(reviewToRestore);
      reviewCleared = false;
      element("review-change").textContent =
        "The review choice is retained because the annotation matches its reviewed version.";
    }
    return;
  }
  if (reviewCleared) return;
  reviewToRestore = readReview();
  reviewTouched = false;
  reviewCleared = true;
  restoreReview(null);
  element("review-change").textContent =
    "The previous review is cleared because the annotation changed. Record a new review only after checking this version.";
}
for (const id of ["category", "note", "creator-kind", "creator-name"])
  element(id).addEventListener("input", updateReview);
replaceQuotation.addEventListener("click", () => {
  const start = sourceText.selectionStart;
  const end = sourceText.selectionEnd;
  if (!active || !editing || !selected) return;
  if (start === end) {
    status("Select a passage in the source before replacing this quotation.");
    sourceText.focus();
    return;
  }
  const previousAnchor = pendingAnchor ?? active;
  if (
    previousAnchor.sourceId === selected.id &&
    previousAnchor.start === start &&
    previousAnchor.end === end
  )
    return;
  pendingAnchor = { sourceId: selected.id, start, end, quote: selected.text.slice(start, end) };
  element("quotation").textContent = pendingAnchor.quote;
  if (recordReview.checked && (!active.review || reviewCleared)) {
    restoreReview(null);
    reviewTouched = true;
    element("review-change").textContent =
      "The previous review is cleared because the annotation changed. Record a new review only after checking this version.";
  } else updateReview();
  status("Quotation selected. Save the annotation to keep it.");
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!active) return;
  try {
    const changes = annotationChanges();
    const candidate = editing ? reviseAnnotation(active, changes) : { ...active, ...changes };
    candidate.review = readReview();
    const annotations = editing
      ? notebook.annotations.map((annotation) =>
          annotation.id === candidate.id ? candidate : annotation,
        )
      : [...notebook.annotations, candidate];
    notebook = createNotebook({ researchQuestion: question.read(), annotations });
    clearForm();
    renderAnnotations();
    recovery.save();
    status("Annotation saved.");
    element("saved-heading").focus();
  } catch (error) {
    status(`Annotation not saved: ${error instanceof Error ? error.message : "Check the fields."}`);
  }
});
