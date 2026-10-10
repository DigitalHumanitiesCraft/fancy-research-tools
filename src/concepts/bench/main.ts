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
const byId = new Map(dataset.records.map((record) => [record.id, record]));
const selected = new Set<string>();
const el = <T extends HTMLElement>(id: string) => {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing interface element ${id}`);
  return node as T;
};
const search = el<HTMLInputElement>("search");
const queryText = bindTextValue(search, (value) => value.trim());
const observationText = bindTextValue(el<HTMLTextAreaElement>("observation"));
const questionText = bindTextValue(el<HTMLTextAreaElement>("question"));
const status = el("status");
const normalise = normalizeSearch;
const indexed = dataset.records.map((record) => ({
  record,
  text: normalise(
    [record.title, record.objectName, record.medium, record.culture, record.objectDate]
      .filter(Boolean)
      .join(" "),
  ),
}));
let query = "";
let recovery: ReturnType<typeof connectInvestigation> | undefined;
let author = "user";
let researchQuestion = "How are materials and makers described in these instruments?";
const textNode = <K extends keyof HTMLElementTagNameMap>(tag: K, text: string) => {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
};
const sourceLink = (record: RecordItem) => {
  const link = textNode("a", `Met ${record.id} ↗`);
  link.href = safeSourceUrl(record.sourceUrl);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${record.title}, Met source ${record.id} (new tab)`);
  return link;
};
function updateSelection() {
  recovery?.save();
  el("selection-count").textContent = String(selected.size);
  for (const input of document.querySelectorAll<HTMLInputElement>("input[data-record]")) {
    input.checked = selected.has(input.dataset.record ?? "");
    input.closest("tr")?.classList.toggle("selected", input.checked);
  }
  renderMatrix();
}
function toggleSelection(id: string, input: HTMLInputElement) {
  if (selected.has(id)) selected.delete(id);
  else if (selected.size < 4) selected.add(id);
  else {
    input.checked = false;
    status.textContent = "Four records are already selected. Remove one before adding another.";
    return;
  }
  status.textContent = `${selected.size} selected for comparison. Selection is kept when you search again.`;
  updateSelection();
}
function renderResults() {
  const records = indexed
    .filter((item) => item.text.includes(normalise(query)))
    .map((item) => item.record);
  const body = el("results");
  body.replaceChildren();
  for (const record of records) {
    const row = document.createElement("tr");
    row.classList.toggle("selected", selected.has(record.id));
    const cell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.record = record.id;
    checkbox.checked = selected.has(record.id);
    checkbox.setAttribute("aria-label", `Compare ${record.title}, ${record.id}`);
    checkbox.addEventListener("change", () => toggleSelection(record.id, checkbox));
    cell.append(checkbox);
    const title = document.createElement("td");
    title.append(textNode("strong", record.title), sourceLink(record));
    row.append(
      cell,
      title,
      textNode("td", record.medium ?? "Not supplied"),
      textNode("td", record.objectDate ?? "Not supplied"),
      textNode("td", attribution(record)),
    );
    body.append(row);
  }
  el("empty").hidden = records.length > 0;
  el("results-status").textContent = query
    ? `${records.length} results for “${query}”`
    : "Musical instruments from the Met";
}
function renderMatrix() {
  const records = [...selected].flatMap((id) => {
    const record = byId.get(id);
    return record ? [record] : [];
  });
  const table = el<HTMLTableElement>("matrix");
  table.replaceChildren();
  el("compare-empty").hidden = records.length > 0;
  table.parentElement?.toggleAttribute("hidden", records.length === 0);
  if (!records.length) return;
  const head = table.createTHead().insertRow();
  const first = textNode("th", "Catalogue evidence");
  first.scope = "col";
  head.append(first);
  for (const record of records) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.append(textNode("h3", record.title), sourceLink(record));
    const remove = textNode("button", "Remove");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${record.title} from comparison`);
    remove.addEventListener("click", () => {
      selected.delete(record.id);
      updateSelection();
      el("add-more").focus();
      status.textContent = `${record.title} removed from comparison.`;
    });
    cell.append(remove);
    head.append(cell);
  }
  const body = table.createTBody();
  const fields: Array<[string, (record: RecordItem) => string]> = [
    ["Material", (r) => r.medium ?? "Not supplied"],
    ["Date as catalogued", (r) => r.objectDate ?? "Not supplied"],
    ["Attribution", attribution],
    ["Culture (source label)", (r) => r.culture ?? "Not supplied"],
    ["Classification", (r) => r.classification ?? "Not supplied"],
    ["Catalogue date bounds", (r) => `${r.beginYear} – ${r.endYear}`],
  ];
  for (const [label, getValue] of fields) {
    const row = body.insertRow();
    const heading = textNode("th", label);
    heading.scope = "row";
    row.append(heading);
    for (const record of records) row.append(textNode("td", getValue(record)));
  }
  const caption = document.createElement("caption");
  caption.textContent =
    "Original catalogue wording. “Not supplied” means a missing catalogue value. Date bounds are indexing values, not exact historical dates.";
  table.append(caption);
}
function setView(compare: boolean) {
  el("find-pane").hidden = compare;
  el("compare-pane").hidden = !compare;
  el("find-view").setAttribute("aria-current", compare ? "false" : "page");
  el("compare-view").setAttribute("aria-current", compare ? "page" : "false");
  if (compare) renderMatrix();
}
el("find-view").addEventListener("click", () => setView(false));
el("compare-view").addEventListener("click", () => setView(true));
el("add-more").addEventListener("click", () => {
  setView(false);
  search.focus();
});
el("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  query = queryText.read();
  renderResults();
  recovery?.save();
  status.textContent = el("results-status").textContent;
});
el("reset").addEventListener("click", () => {
  queryText.restore("");
  query = "";
  renderResults();
  recovery?.save();
  status.textContent = "Search cleared. Comparison selection retained.";
  search.focus();
});
el("download").addEventListener("click", () => {
  downloadInvestigation(readInvestigation(), "bench-investigation.json");
  status.textContent =
    "Evidence file prepared: selected source records, your notes and provenance.";
});
renderResults();
renderMatrix();

const readInvestigation = () =>
  createInvestigation({
    query,
    researchQuestion: researchQuestion,
    selectedIds: [...selected],
    observation: observationText.read(),
    unresolvedQuestion: questionText.read(),
    author,
  });
const draftMount = document.createElement("div");
draftMount.className = "draft-controls";
document.querySelector("footer")?.before(draftMount);
recovery = connectInvestigation({
  key: "bench",
  read: readInvestigation,
  mount: draftMount,
  restore(state) {
    query = state.query;
    author = state.interpretation.author;
    queryText.restore(query);
    selected.clear();
    for (const id of state.selectedIds) selected.add(id);
    observationText.restore(state.interpretation.observation);
    questionText.restore(state.interpretation.unresolvedQuestion);
    researchQuestion = state.researchQuestion;
    renderResults();
    updateSelection();
  },
});
for (const id of ["observation", "question"])
  el(id).addEventListener("input", () => recovery?.save());
