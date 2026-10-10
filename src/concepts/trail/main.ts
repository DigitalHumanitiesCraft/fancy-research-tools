import dataset from "../../../data/met-instruments/records.json";
import { connectInvestigation, downloadInvestigation } from "../../research/browser";
import {
  attribution,
  createInvestigation,
  normalizeSearch,
  safeSourceUrl,
} from "../../research/investigation";
import { bindTextValue } from "../../ui/text-value";
import "./styles.css";

type RecordItem = (typeof dataset.records)[number];
const get = <T extends HTMLElement>(id: string) => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element ${id}`);
  return element as T;
};
const make = <K extends keyof HTMLElementTagNameMap>(tag: K, text = "") => {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
};
const normalize = normalizeSearch;
const indexed = dataset.records.map((record) => ({
  record,
  text: normalize(
    [record.title, record.objectName, record.medium, record.culture, record.objectDate]
      .filter(Boolean)
      .join(" "),
  ),
}));
const selected = new Set<string>();
const queryText = bindTextValue(get<HTMLInputElement>("search"), (value) => value.trim());
const questionText = bindTextValue(get<HTMLInputElement>("research-question"));
const observationText = bindTextValue(get<HTMLTextAreaElement>("observation"));
const unresolvedText = bindTextValue(get<HTMLTextAreaElement>("unresolved"));
let query = "";
let recovery: ReturnType<typeof connectInvestigation> | undefined;
let author = "user";
const value = (text: string | number | null) =>
  text === null || text === "" ? "Not supplied" : String(text);
const maker = attribution;
const records = () => dataset.records.filter((record) => selected.has(record.id));
function sourceLink(record: RecordItem) {
  const link = make("a", record.title);
  link.href = safeSourceUrl(record.sourceUrl);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${record.title}, Met source record (opens new tab)`);
  return link;
}
function select(record: RecordItem, button: HTMLButtonElement) {
  if (selected.has(record.id)) selected.delete(record.id);
  else if (selected.size >= 4) {
    get("selection-status").textContent =
      "Four records selected. Remove one before adding another.";
    return;
  } else selected.add(record.id);
  button.setAttribute("aria-pressed", String(selected.has(record.id)));
  button.textContent = selected.has(record.id) ? "Remove" : "Add";
  updateSelection();
}
function updateSelection() {
  recovery?.save();
  get("selection-status").textContent = selected.size
    ? `${selected.size} selected for comparison. Selection is retained when you search again.`
    : "Choose two to four records for comparison.";
  get("compare-link").textContent = selected.size
    ? `Compare selection (${selected.size}) →`
    : "Compare selection →";
  renderComparison();
  renderEvidence();
  get("export-status").textContent = "";
}
function renderResults() {
  const matches = indexed.filter((item) => item.text.includes(normalize(query)));
  get("result-status").textContent = query ? `${matches.length} results for “${query}”` : "";
  const container = get("results");
  container.replaceChildren();
  if (!matches.length) {
    container.append(
      make(
        "p",
        "No matching descriptions. Try a broader term or clear the search; your selection is retained.",
      ),
    );
    return;
  }
  for (const { record } of matches) {
    const article = make("article");
    article.className = "record";
    const heading = make("h2");
    heading.append(sourceLink(record));
    const button = make("button", selected.has(record.id) ? "Remove" : "Add");
    button.type = "button";
    button.setAttribute(
      "aria-label",
      `${selected.has(record.id) ? "Remove" : "Add"} ${record.title}`,
    );
    button.setAttribute("aria-pressed", String(selected.has(record.id)));
    button.addEventListener("click", () => {
      select(record, button);
      button.setAttribute(
        "aria-label",
        `${selected.has(record.id) ? "Remove" : "Add"} ${record.title}`,
      );
    });
    const meta = make("p", `${value(record.objectDate)}; ${maker(record)}`);
    meta.className = "record-meta";
    article.append(heading, button, make("p", value(record.medium)), meta);
    container.append(article);
  }
}
function renderComparison() {
  const container = get("comparison");
  container.replaceChildren();
  const items = records();
  if (!items.length) {
    container.append(
      make("p", "Your evidence set is empty. Find material and add two to four records."),
    );
    return;
  }
  if (items.length === 1)
    container.append(make("p", "One record selected. Add another to compare descriptions."));
  const region = make("div");
  region.className = "comparison-scroll";
  region.tabIndex = 0;
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", "Selected source comparison");
  const table = make("table");
  const thead = make("thead");
  const header = make("tr");
  const corner = make("th", "Source wording");
  corner.scope = "col";
  header.append(corner);
  for (const record of items) {
    const th = make("th");
    th.scope = "col";
    th.append(sourceLink(record));
    const remove = make("button", "Remove");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${record.title} from comparison`);
    remove.addEventListener("click", () => {
      selected.delete(record.id);
      updateSelection();
      renderResults();
      recovery?.save();
      get("comparison").querySelector<HTMLElement>("button")?.focus();
    });
    th.append(remove);
    header.append(th);
  }
  thead.append(header);
  table.append(thead);
  const tbody = make("tbody");
  const fields: [string, (record: RecordItem) => string][] = [
    ["Material", (record) => value(record.medium)],
    ["Date", (record) => value(record.objectDate)],
    ["Attribution", maker],
    ["Culture", (record) => value(record.culture)],
    ["Classification", (record) => value(record.classification)],
    ["Source ID", (record) => record.id],
  ];
  for (const [label, read] of fields) {
    const row = make("tr");
    const th = make("th", label);
    th.scope = "row";
    row.append(th);
    for (const record of items) row.append(make("td", read(record)));
    tbody.append(row);
  }
  table.append(tbody);
  region.append(table);
  container.append(region);
}
function renderEvidence() {
  const container = get("evidence");
  container.replaceChildren();
  if (!selected.size) {
    container.append(make("p", "No source records selected."));
    return;
  }
  for (const record of records()) {
    const item = make("div");
    item.className = "source-entry";
    item.append(sourceLink(record), make("p", value(record.medium)));
    container.append(item);
  }
}
function navigate(event?: Event) {
  const current = ["find", "compare", "reflect", "about"].includes(location.hash.slice(1))
    ? location.hash.slice(1)
    : "find";
  for (const id of ["find", "compare", "reflect", "about"]) get(id).hidden = id !== current;
  get("workspace").hidden = current === "about";
  document.querySelectorAll<HTMLAnchorElement>("[data-view]").forEach((link) => {
    if (link.dataset.view === current) link.setAttribute("aria-current", "step");
    else link.removeAttribute("aria-current");
  });
  if (event) {
    const heading = get(current).querySelector<HTMLElement>("h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  }
}
get("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  query = queryText.read();
  renderResults();
  recovery?.save();
});
get("clear-search").addEventListener("click", () => {
  queryText.restore("");
  query = "";
  renderResults();
  recovery?.save();
  get("search").focus();
});
get("export").addEventListener("click", () => {
  downloadInvestigation(readInvestigation(), "trail-investigation.json");
  get("export-status").textContent =
    `Downloaded investigation with ${selected.size} source records, your notes and snapshot provenance.`;
});
window.addEventListener("hashchange", navigate);
updateSelection();
renderResults();
navigate();

const readInvestigation = () =>
  createInvestigation({
    query,
    researchQuestion: questionText.read(),
    selectedIds: [...selected],
    observation: observationText.read(),
    unresolvedQuestion: unresolvedText.read(),
    author,
  });
const draftMount = document.createElement("div");
draftMount.className = "draft-controls";
document.querySelector("footer")?.before(draftMount);
recovery = connectInvestigation({
  key: "trail",
  read: readInvestigation,
  mount: draftMount,
  restore(state) {
    query = state.query;
    author = state.interpretation.author;
    queryText.restore(query);
    selected.clear();
    for (const id of state.selectedIds) selected.add(id);
    observationText.restore(state.interpretation.observation);
    unresolvedText.restore(state.interpretation.unresolvedQuestion);
    questionText.restore(state.researchQuestion);
    renderResults();
    updateSelection();
  },
});
for (const id of ["observation", "unresolved", "research-question"])
  get(id).addEventListener("input", () => recovery?.save());
