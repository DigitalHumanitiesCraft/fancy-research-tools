import data from "../../../data/met-instruments/records.json";
import { connectInvestigation, downloadInvestigation } from "../../research/browser";
import {
  attribution,
  createInvestigation,
  normalizeSearch,
  safeSourceUrl,
} from "../../research/investigation";
import { bindTextValue } from "../../ui/text-value";
import "./styles.css";

type RecordItem = (typeof data.records)[number];
function required<T extends Element = HTMLElement>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error(`Missing interface element: ${selector}`);
  return node;
}
function recordById(id: string): RecordItem {
  const record = data.records.find((item) => item.id === id);
  if (!record) throw new Error(`Unknown source record: ${id}`);
  return record;
}
const main = required("#main");
const selected = new Set<string>();
let query = "";
let page = 0;
let observation = "";
let question = "";
let researchQuestion = "How are materials and makers described in these instruments?";
let author = "user";
const normalize = normalizeSearch;
const indexed = data.records.map((record) => ({
  record,
  search: normalize(
    [record.title, record.objectName, record.culture, record.objectDate, record.medium]
      .filter(Boolean)
      .join(" "),
  ),
}));
const esc = (value: unknown) =>
  String(value ?? "Not supplied").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char,
  );
const maker = attribution;
const source = (record: RecordItem) =>
  `<a class="source" href="${esc(safeSourceUrl(record.sourceUrl))}" target="_blank" rel="noopener">Met ${esc(record.id)} <span aria-hidden="true">↗</span></a>`;
const selectButton = (record: RecordItem) =>
  `<button class="select" type="button" data-select="${record.id}" aria-pressed="${selected.has(record.id)}" aria-label="${selected.has(record.id) ? "Remove" : "Select"} ${esc(record.title)}">${selected.has(record.id) ? "✓ Selected" : "+ Compare"}</button>`;
function announce(message: string) {
  required("#announcement").textContent = message;
}
function selectionState() {
  recovery?.save();
  required("#selection-count").textContent = String(selected.size);
}
function field(label: string, value: unknown) {
  return `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`;
}
function card(record: RecordItem) {
  return `<article class="specimen${selected.has(record.id) ? " is-selected" : ""}"><div class="card-top">${source(record)}${selectButton(record)}</div><h2><a href="#object-${record.id}">${esc(record.title)}</a></h2><p class="date">${esc(record.objectDate)}</p><dl>${field("Material", record.medium)}${field("Attribution", maker(record))}${field("Culture", record.culture)}</dl></article>`;
}
function catalogue() {
  const matches = indexed
    .filter((item) => item.search.includes(normalize(query)))
    .map((item) => item.record);
  const pages = Math.max(1, Math.ceil(matches.length / 12));
  page = Math.min(page, pages - 1);
  main.innerHTML = `<section class="catalogue"><div class="intro"><h1>Musical instruments</h1><form id="search-form" role="search"><label for="search">Search the catalogue</label><div class="search-box"><input type="search" id="search" value="${esc(query)}" placeholder="Wood, title, date, culture…" /><button type="submit" aria-label="Search catalogue">Search <span aria-hidden="true">→</span></button></div></form></div><div class="results-meta"><p>${query ? `${matches.length} results for “${esc(query)}”` : "Musical instruments / The Metropolitan Museum of Art"}</p>${query ? '<button type="button" id="clear-search" class="text-button">Clear search</button>' : ""}</div><div class="catalogue-grid">${matches
    .slice(page * 12, page * 12 + 12)
    .map(card)
    .join(
      "",
    )}</div>${matches.length === 0 ? '<div class="empty"><h2>No matching records</h2><p>Try a material such as wood, or clear the search.</p></div>' : `<nav class="pagination" aria-label="Result pages"><button id="previous" ${page === 0 ? "disabled" : ""}>Previous</button><span>Page ${page + 1} of ${pages}</span><button id="next" ${page + 1 >= pages ? "disabled" : ""}>Next</button></nav>`}</section><aside class="tray" aria-label="Comparison selection"><div><strong id="tray-label">${selected.size ? `${selected.size} selected` : "Build a comparison"}</strong><span>${selected.size ? [...selected].map((id) => esc(recordById(id).title)).join(" / ") : "Choose two to four records"}</span></div><a class="primary" href="#compare">Compare selection <span aria-hidden="true">→</span></a></aside>`;
  const queryText = bindTextValue(required<HTMLInputElement>("#search"), (value) => value.trim());
  queryText.restore(query);
  required("#search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    query = queryText.read();
    page = 0;
    recovery?.save();
    catalogue();
    announce(`${matchesForQuery()} matching records`);
    required<HTMLInputElement>("#search").focus();
  });
  document.querySelector("#clear-search")?.addEventListener("click", () => {
    query = "";
    page = 0;
    recovery?.save();
    catalogue();
    required<HTMLInputElement>("#search").focus();
  });
  for (const [id, shift] of [
    ["previous", -1],
    ["next", 1],
  ] as const)
    document.querySelector(`#${id}`)?.addEventListener("click", () => {
      page += shift;
      catalogue();
      main.focus();
      window.scrollTo(0, 0);
    });
  bindSelection();
}
function matchesForQuery() {
  return indexed.filter((item) => item.search.includes(normalize(query))).length;
}
function bindSelection() {
  for (const button of main.querySelectorAll<HTMLButtonElement>("[data-select]"))
    button.addEventListener("click", () => {
      const id = button.dataset.select;
      if (!id) return;
      if (selected.has(id)) selected.delete(id);
      else if (selected.size < 4) selected.add(id);
      else {
        announce("Four records selected. Remove one before adding another.");
        const old = document.querySelector(".selection-limit");
        if (!old)
          button.insertAdjacentHTML(
            "afterend",
            '<p class="selection-limit" role="alert">Four selected. Remove one to add another.</p>',
          );
        return;
      }
      selectionState();
      const wasSelected = selected.has(id);
      announce(
        `${wasSelected ? "Added to" : "Removed from"} comparison. ${selected.size} selected.`,
      );
      if (location.hash === "#compare") {
        comparison();
        document.querySelector<HTMLAnchorElement>(".back")?.focus();
      } else {
        const record = recordById(id);
        button.setAttribute("aria-pressed", String(wasSelected));
        button.setAttribute("aria-label", `${wasSelected ? "Remove" : "Select"} ${record.title}`);
        button.textContent = wasSelected ? "✓ Selected" : "+ Compare";
        button.closest("article")?.classList.toggle("is-selected", wasSelected);
        document.querySelectorAll(".selection-limit").forEach((node) => {
          node.remove();
        });
        const tray = document.querySelector(".tray > div");
        if (tray)
          tray.innerHTML = `<strong>${selected.size ? `${selected.size} selected` : "Build a comparison"}</strong><span>${selected.size ? [...selected].map((selectedId) => esc(recordById(selectedId).title)).join(" / ") : "Choose two to four records"}</span>`;
      }
    });
}
function comparison() {
  const records = [...selected].map((id) => recordById(id));
  const rows: [string, (record: RecordItem) => unknown][] = [
    ["Material", (r) => r.medium],
    ["Date", (r) => r.objectDate],
    ["Attribution", maker],
    ["Attribution prefix", (r) => r.artistPrefix],
    ["Attribution suffix", (r) => r.artistSuffix],
    ["Culture", (r) => r.culture],
    ["Classification", (r) => r.classification],
    ["Catalogue date bounds", (r) => `${r.beginYear}–${r.endYear}`],
  ];
  main.innerHTML = `<section class="comparison"><div class="view-title"><h1>Your comparison</h1><a class="back" href="#catalogue">← Keep exploring</a></div>${records.length ? `<div class="comparison-scroll" role="region" aria-label="Selected record comparison" tabindex="0"><table><thead><tr><th scope="col">Catalogue evidence</th>${records.map((record) => `<th scope="col"><h2><a href="#object-${record.id}">${esc(record.title)}</a></h2>${source(record)}${selectButton(record)}</th>`).join("")}</tr></thead><tbody>${rows.map(([label, get]) => `<tr><th scope="row">${label}</th>${records.map((record) => `<td>${esc(get(record))}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="qualification">Date bounds are catalogue indexing ranges. “Not supplied” means missing catalogue information.</p>` : '<div class="empty"><h2>Choose your evidence</h2><p>Select two to four catalogue records to compare their descriptions.</p><a class="primary" href="#catalogue">Browse the catalogue →</a></div>'}<section class="notebook" aria-labelledby="notebook-title"><div><h2 id="notebook-title">What do you notice?</h2></div><div class="note-fields"><label for="observation">Observation</label><textarea id="observation" rows="4" placeholder="Describe a contrast, similarity or uncertainty…">${esc(observation)}</textarea><label for="question">Unresolved question</label><textarea id="question" rows="3" placeholder="What would you need to investigate next?">${esc(question)}</textarea><button type="button" id="download" class="primary">Download evidence & notes <span aria-hidden="true">↓</span></button><p id="download-status" role="status"></p></div></section></section>`;
  required<HTMLTextAreaElement>("#observation").addEventListener("input", (event) => {
    observation = (event.target as HTMLTextAreaElement).value;
    recovery?.save();
  });
  required<HTMLTextAreaElement>("#question").addEventListener("input", (event) => {
    question = (event.target as HTMLTextAreaElement).value;
    recovery?.save();
  });
  required("#download").addEventListener("click", () => {
    const status = required("#download-status");
    downloadInvestigation(readInvestigation(), "atlas-investigation.json");
    status.textContent = `Download prepared with ${records.length} source records and your notes.`;
  });
  bindSelection();
}
function objectView(id: string) {
  const record = data.records.find((item) => item.id === id);
  if (!record) {
    location.hash = "catalogue";
    return;
  }
  main.innerHTML = `<section class="object-view"><div class="view-title"><h1>${esc(record.title)}</h1><a class="back" href="#catalogue">← Catalogue</a></div><div class="object-heading">${source(record)}${selectButton(record)}<a href="#compare">Open comparison →</a></div><dl class="object-fields">${field("Date", record.objectDate)}${field("Material", record.medium)}${field("Attribution", maker(record))}${field("Attribution prefix", record.artistPrefix)}${field("Attribution suffix", record.artistSuffix)}${field("Culture", record.culture)}${field("Classification", record.classification)}${field("Catalogue date bounds", `${record.beginYear}–${record.endYear}`)}</dl><p class="qualification">Date bounds are catalogue indexing ranges, not precise event dates. Missing information describes this catalogue record.</p></section>`;
  bindSelection();
}
function render() {
  const route = location.hash;
  required("#catalogue-link").setAttribute(
    "aria-current",
    route !== "#compare" && route !== "#about" ? "page" : "false",
  );
  required("#compare-link").setAttribute("aria-current", route === "#compare" ? "page" : "false");
  if (route === "#compare") comparison();
  else if (route.startsWith("#object-")) objectView(route.slice(8));
  else if (route === "#about")
    main.innerHTML =
      '<section class="about"><h1>About this collection</h1><p>Instrument Atlas supports close reading and comparison of musical-instrument catalogue descriptions from The Metropolitan Museum of Art.</p><p>This frozen snapshot contains the 60 lowest object IDs in department 18, retrieved on 10 October 2026. It is a convenience sample, not representative of the museum or musical history.</p><p>Original descriptions and attribution qualifiers are preserved. The interface shows metadata, not photographs. Interpretive notes are written by you and exported separately from source records.</p><p><a href="https://github.com/metmuseum/openaccess">Met Open Access</a> supplies the data under <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>. Source URLs, selection details and file hashes accompany each evidence download.</p><a href="#catalogue">Return to the catalogue →</a></section>';
  else catalogue();
}
window.addEventListener("hashchange", () => {
  render();
  main.focus();
  window.scrollTo(0, 0);
});

const readInvestigation = () =>
  createInvestigation({
    query,
    researchQuestion,
    selectedIds: [...selected],
    observation,
    unresolvedQuestion: question,
    author,
  });
const draftMount = document.createElement("div");
draftMount.className = "draft-controls";
required("footer").before(draftMount);
let recovery: ReturnType<typeof connectInvestigation> | undefined;
recovery = connectInvestigation({
  key: "atlas",
  read: readInvestigation,
  mount: draftMount,
  restore(state) {
    query = state.query;
    researchQuestion = state.researchQuestion;
    author = state.interpretation.author;
    selected.clear();
    for (const id of state.selectedIds) selected.add(id);
    observation = state.interpretation.observation;
    question = state.interpretation.unresolvedQuestion;
    page = 0;
    render();
    selectionState();
  },
});
render();
