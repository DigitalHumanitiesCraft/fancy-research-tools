import dataset from "../../data/met-instruments/records.json";
import { connectInvestigation, downloadInvestigation } from "../research/browser";
import { getFieldEvidence, type SourceField } from "../research/evidence";
import {
  attribution,
  createInvestigation,
  type Investigation,
  normalizeSearch,
  safeSourceUrl,
} from "../research/investigation";
import { icon } from "../ui/icons";
import { bindTextValue } from "../ui/text-value";
import "./styles.css";

type RecordItem = (typeof dataset.records)[number];
const get = <T extends HTMLElement>(id: string): T => {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing workbench element: ${id}`);
  return node as T;
};
const make = <K extends keyof HTMLElementTagNameMap>(tag: K, text = "") => {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
};
const byId = new Map(dataset.records.map((record) => [record.id, record]));
const indexed = dataset.records.map((record) => ({
  record,
  text: normalizeSearch(
    [record.title, record.objectName, record.medium, record.culture, record.objectDate]
      .filter(Boolean)
      .join(" "),
  ),
}));
const selected = new Set<string>();
const query = get<HTMLInputElement>("query");
const queryText = bindTextValue(query, (value) => value.trim());
const questionText = bindTextValue(get<HTMLInputElement>("research-question"));
const observationText = bindTextValue(get<HTMLTextAreaElement>("observation"));
const unresolvedText = bindTextValue(get<HTMLTextAreaElement>("unresolved"));
const classification = get<HTMLSelectElement>("classification");
const sort = get<HTMLSelectElement>("sort");
let appliedQuery = "";
let pageNumber = 0;
const pageSize = 12;
let ready = false;
let author = "user";
let session: ReturnType<typeof connectInvestigation> | undefined;
const announce = (message: string) => {
  get("status").textContent = message;
};
const value = (text: string | null) => text ?? "Not supplied";
const read = () =>
  createInvestigation({
    query: appliedQuery,
    author,
    researchQuestion: questionText.read(),
    selectedIds: [...selected],
    observation: observationText.read(),
    unresolvedQuestion: unresolvedText.read(),
  });
const save = () => session?.save();
const sourceLink = (record: RecordItem) => {
  const link = make("a", `Met ${record.id}`);
  const url = safeSourceUrl(record.sourceUrl);
  if (url) link.href = url;
  link.append(icon("external"));
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${record.title}, Met source ${record.id} (new tab)`);
  return link;
};
const sourceTitle = get("source-heading");
const sourceDetails = get("source-details");
const comparisonFields: [string, string, (r: RecordItem) => string, SourceField[]][] = [
  ["material", "Material", (r) => value(r.medium), ["medium"]],
  ["date", "Date", (r) => value(r.objectDate), ["objectDate"]],
  ["attribution", "Attribution", attribution, ["artistPrefix", "artist", "artistSuffix"]],
  ["culture", "Culture", (r) => value(r.culture), ["culture"]],
  ["classification", "Classification", (r) => value(r.classification), ["classification"]],
  [
    "date-bounds",
    "Catalogue date bounds",
    (r) =>
      r.beginYear === null || r.endYear === null ? "Not supplied" : `${r.beginYear}–${r.endYear}`,
    ["beginYear", "endYear"],
  ],
];
let sourceReturnFocus: string | undefined;
get("source-return").addEventListener("click", () => {
  sourceReturnFocus = location.hash;
});
function inspectSource(
  record: RecordItem,
  label: string,
  displayedValue: string,
  fields: SourceField[],
) {
  const evidence = fields.map((field) => getFieldEvidence(record.id, field));
  const first = evidence[0];
  if (!first) return;
  sourceTitle.textContent = `Source: ${label}`;
  sourceDetails.replaceChildren();
  const context = make("dl");
  const entry = (list: HTMLDListElement, name: string, text: string) => {
    const item = make("div");
    item.append(make("dt", name), make("dd", text));
    list.append(item);
  };
  const recordItem = make("div");
  const recordValue = make("dd", `${record.title} · `);
  recordValue.append(sourceLink(record));
  recordItem.append(make("dt", "Record"), recordValue);
  context.append(recordItem);
  entry(context, "Displayed value", displayedValue);
  sourceDetails.append(context);
  for (const item of evidence) {
    const group = make("section");
    group.append(make("h2", `Projection field: ${item.field}`));
    const mapping = make("dl");
    for (const field of item.sourceFields) {
      entry(mapping, `Original API field: ${field}`, JSON.stringify(item.originalValues[field]));
    }
    entry(mapping, "Projected value", JSON.stringify(item.value));
    const transformationLabels: Record<string, string> = {
      unchanged: "Copied without changing the source value.",
      "number-to-string": "The numeric identifier is stored as text.",
      "empty-string-to-null": "Empty source strings become null; other values stay unchanged.",
      "null-if-object-date-empty":
        "The bound is null when the source date description is empty; otherwise it is copied.",
    };
    entry(
      mapping,
      "Mapping rule",
      transformationLabels[item.transformation] ?? item.transformation,
    );
    group.append(mapping);
    sourceDetails.append(group);
  }
  const provenance = make("section");
  provenance.append(make("h2", "Snapshot and review"));
  const sourceContext = make("dl");
  entry(sourceContext, "Catalogue publisher", first.publisher);
  entry(
    sourceContext,
    "Original author and creation process",
    "Unknown; not recorded in this snapshot.",
  );
  entry(sourceContext, "Human or AI review", "No human or AI review is recorded for this value.");
  entry(sourceContext, "Research validation", "No research validation is recorded for this value.");
  entry(sourceContext, "Original API URL", first.source.url);
  entry(sourceContext, "Snapshot file", first.source.path);
  entry(sourceContext, "Snapshot SHA-256", first.source.sha256);
  entry(sourceContext, "Projection producer", first.derivation.producer);
  entry(sourceContext, "Projection producer SHA-256", first.derivation.sha256);
  provenance.append(sourceContext);
  sourceDetails.append(provenance);
  const checkSection = make("section");
  checkSection.append(make("h2", "Technical checks"));
  const checks = make("ul");
  const checkLabels: Record<string, string> = {
    "source-file-sha256": "Frozen source file matches its recorded SHA-256.",
    "object-id-match": "Source object ID matches the projected record.",
    "department-match": "Source department matches the Musical Instruments sample.",
    "field-projection-match": "Projected field matches the deterministic source mapping.",
  };
  for (const check of new Set(evidence.flatMap((item) => item.checks))) {
    checks.append(make("li", checkLabels[check] ?? check));
  }
  checkSection.append(checks);
  sourceDetails.append(checkSection);
}
function updateUrl(replace = false) {
  const params = new URLSearchParams();
  if (appliedQuery) params.set("q", appliedQuery);
  if (classification.value) params.set("classification", classification.value);
  if (sort.value !== "source") params.set("sort", sort.value);
  const next = `${location.pathname}${params.size ? `?${params}` : ""}${location.hash}`;
  if (next !== `${location.pathname}${location.search}${location.hash}`) {
    if (replace) history.replaceState(null, "", next);
    else history.pushState(null, "", next);
  }
}
function readUrl() {
  const params = new URLSearchParams(location.search);
  appliedQuery = params.get("q") ?? "";
  queryText.restore(appliedQuery);
  classification.value = params.get("classification") ?? "";
  sort.value = ["title", "date"].includes(params.get("sort") ?? "")
    ? (params.get("sort") ?? "source")
    : "source";
  pageNumber = 0;
}
for (const name of [
  ...new Set(dataset.records.map((r) => r.classification).filter((v): v is string => Boolean(v))),
].sort()) {
  const option = make("option", name);
  option.value = name;
  classification.append(option);
}
function changeSelection(id: string) {
  if (selected.has(id)) selected.delete(id);
  else if (selected.size < 4) selected.add(id);
  else {
    announce("Four instruments selected. Remove one to add another.");
    renderSelection();
    return;
  }
  renderSelection();
  renderComparison();
  save();
  announce(`${selected.size} instruments selected.`);
}
function renderSelection() {
  get("selection-count").textContent = selected.size ? String(selected.size) : "";
  get("compare-action").textContent = selected.size
    ? `Compare selection (${selected.size})`
    : "Compare selection";
  const tray = get("selection-tray");
  tray.replaceChildren();
  tray.hidden = selected.size === 0;
  for (const id of selected) {
    const record = byId.get(id);
    if (!record) continue;
    const button = make("button", record.title);
    button.type = "button";
    button.append(icon("close"));
    button.setAttribute("aria-label", `Remove ${record.title} from selection`);
    button.addEventListener("click", () => {
      changeSelection(id);
      get("compare-action").focus();
    });
    tray.append(button);
  }
  for (const control of document.querySelectorAll<HTMLInputElement>("[data-select]")) {
    const active = selected.has(control.dataset.select ?? "");
    control.checked = active;
    control.closest("tr")?.classList.toggle("selected", active);
  }
}
function renderCollection() {
  const matches = indexed
    .filter(
      (item) =>
        item.text.includes(normalizeSearch(appliedQuery)) &&
        (!classification.value || item.record.classification === classification.value),
    )
    .map((item) => item.record);
  if (sort.value === "title")
    matches.sort((a, b) => a.title.localeCompare(b.title, "en") || a.id.localeCompare(b.id));
  if (sort.value === "date")
    matches.sort(
      (a, b) => (a.beginYear ?? Infinity) - (b.beginYear ?? Infinity) || a.id.localeCompare(b.id),
    );
  const pages = Math.max(1, Math.ceil(matches.length / pageSize));
  pageNumber = Math.min(pageNumber, pages - 1);
  get("result-status").textContent =
    appliedQuery || classification.value ? `${matches.length} matching instruments` : "";
  const list = get("records");
  list.replaceChildren();
  const table = make("table");
  table.className = "catalogue-table";
  const caption = make(
    "caption",
    "Musical instruments · The Metropolitan Museum of Art · Snapshot 10 October 2026",
  );
  caption.className = "visually-hidden";
  table.append(caption);
  const headings = table.createTHead().insertRow();
  for (const name of ["Select", "Object", "Catalogue date", "Material", "Maker / attribution"]) {
    const heading = make("th", name);
    heading.scope = "col";
    headings.append(heading);
  }
  const body = table.createTBody();
  for (const record of matches.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)) {
    const row = body.insertRow();
    row.dataset.id = record.id;
    const control = make("input");
    control.type = "checkbox";
    control.className = "selection-input";
    control.dataset.select = record.id;
    control.setAttribute("aria-label", `Compare ${record.title}, ${record.id}`);
    control.addEventListener("change", () => changeSelection(record.id));
    const action = make("td");
    action.append(control);
    row.append(action);
    const identity = make("th");
    identity.scope = "row";
    identity.className = "record-identity";
    identity.append(make("span", record.title), sourceLink(record));
    row.append(identity);
    for (const text of [value(record.objectDate), value(record.medium), attribution(record)]) {
      row.append(make("td", text));
    }
  }
  if (matches.length) list.append(table);
  if (!matches.length)
    list.append(
      make("p", "No matches. Change the search or reset the filters; your selection is retained."),
    );
  get<HTMLButtonElement>("previous").disabled = pageNumber === 0;
  get<HTMLButtonElement>("next").disabled = pageNumber + 1 >= pages;
  get("page-status").textContent = `Page ${pageNumber + 1} of ${pages}`;
  renderSelection();
}
function renderComparison() {
  const records = [...selected].flatMap((id) => {
    const record = byId.get(id);
    return record ? [record] : [];
  });
  const table = get<HTMLTableElement>("matrix");
  table.replaceChildren();
  get("comparison-empty").hidden = records.length >= 2;
  get("comparison-region").hidden = records.length === 0;
  if (!records.length) return;
  const caption = make(
    "caption",
    "Original catalogue evidence. Missing values mean not supplied. Date bounds are catalogue indexing ranges.",
  );
  table.append(caption);
  const header = table.createTHead().insertRow();
  const corner = make("th", "Evidence");
  corner.scope = "col";
  header.append(corner);
  for (const record of records) {
    const cell = make("th");
    cell.scope = "col";
    const remove = make("button", "Remove");
    remove.type = "button";
    remove.className = "quiet-button";
    remove.setAttribute("aria-label", `Remove ${record.title} from comparison`);
    remove.addEventListener("click", () => {
      changeSelection(record.id);
      get("comparison-heading").focus();
    });
    cell.append(make("h2", record.title), sourceLink(record), remove);
    header.append(cell);
  }
  const body = table.createTBody();
  for (const [key, label, readValue] of comparisonFields) {
    const row = body.insertRow();
    const heading = make("th", label);
    heading.scope = "row";
    row.append(heading);
    for (const record of records) {
      const cell = make("td");
      const displayedValue = readValue(record);
      const original = make("span", displayedValue);
      original.className = "source-value";
      const inspect = make("a", "Source");
      inspect.href = `#source/${record.id}/${key}`;
      inspect.className = "source-action";
      inspect.setAttribute("aria-label", `Source for ${label}, ${record.title}, Met ${record.id}`);
      cell.append(original, inspect);
      row.append(cell);
    }
  }
}
function navigate(focus = true) {
  if (focus) announce("");
  const route = location.hash.slice(1).split("/");
  const view = ["collection", "comparison", "about", "source"].includes(route[0] ?? "")
    ? route[0]
    : "collection";
  for (const id of ["collection", "comparison", "about", "source"]) get(id).hidden = id !== view;
  if (view === "source") {
    const record = byId.get(route[1] ?? "");
    const field = comparisonFields.find(([key]) => key === route[2]);
    if (record && field) inspectSource(record, field[1], field[2](record), field[3]);
    else {
      sourceTitle.textContent = "Source not found";
      sourceDetails.replaceChildren(
        make("p", "This address does not identify a catalogue field in the frozen sample."),
      );
    }
  }
  for (const id of ["collection", "comparison"]) {
    const link = get(`${id}-link`);
    if (id === view) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  if (focus) {
    const heading = get(`${view}-heading`);
    heading.tabIndex = -1;
    heading.focus();
  }
  if (focus && view === "comparison" && sourceReturnFocus) {
    [...document.querySelectorAll<HTMLAnchorElement>(".source-action")]
      .find((link) => link.getAttribute("href") === sourceReturnFocus)
      ?.focus();
    sourceReturnFocus = undefined;
  }
}
function restore(state: Investigation) {
  author = state.interpretation.author;
  appliedQuery = state.query;
  queryText.restore(appliedQuery);
  selected.clear();
  for (const id of state.selectedIds) selected.add(id);
  questionText.restore(state.researchQuestion);
  observationText.restore(state.interpretation.observation);
  unresolvedText.restore(state.interpretation.unresolvedQuestion);
  classification.value = "";
  sort.value = "source";
  pageNumber = 0;
  renderCollection();
  renderComparison();
  if (ready) updateUrl(true);
}
get("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  appliedQuery = queryText.read();
  pageNumber = 0;
  updateUrl();
  renderCollection();
  save();
});
classification.addEventListener("change", () => {
  appliedQuery = queryText.read();
  pageNumber = 0;
  updateUrl();
  renderCollection();
  save();
});
sort.addEventListener("change", () => {
  pageNumber = 0;
  updateUrl();
  renderCollection();
});
get("reset").addEventListener("click", () => {
  appliedQuery = "";
  queryText.restore("");
  classification.value = "";
  pageNumber = 0;
  updateUrl();
  renderCollection();
  save();
  query.focus();
});
for (const [id, offset] of [
  ["previous", -1],
  ["next", 1],
] as const)
  get(id).addEventListener("click", () => {
    pageNumber += offset;
    renderCollection();
    get("collection-heading").tabIndex = -1;
    get("collection-heading").focus();
    window.scrollTo(0, 0);
  });
for (const id of ["research-question", "observation", "unresolved"])
  get(id).addEventListener("input", save);
get("export").prepend(icon("download"));
get("search-submit").prepend(icon("search"));
get("export").addEventListener("click", () => {
  try {
    downloadInvestigation(read(), "instrument-investigation.json");
    announce("Investigation download requested.");
  } catch (error) {
    announce(error instanceof Error ? error.message : "Investigation could not be exported.");
  }
});
session = connectInvestigation({
  key: "frt-instrument-study-v1",
  read,
  restore,
  mount: get("recovery"),
});
ready = true;
if (location.search) readUrl();
else updateUrl(true);
renderCollection();
renderComparison();
navigate(false);
window.addEventListener("hashchange", () => navigate());
window.addEventListener("popstate", () => {
  readUrl();
  renderCollection();
  navigate(false);
  save();
});
