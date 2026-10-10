import "../ui/styles.css";
import "./styles.css";
import provenance from "../../data/met-instruments/manifest.json";
import snapshot from "../../data/met-instruments/records.json";
import { type IconName, icon } from "../ui/icons";
import {
  defaults,
  distribution,
  exportSelection,
  type Filters,
  type Instrument,
  makeIndex,
  missingness,
  readFilters,
  safeSource,
  selectRecords,
  writeFilters,
} from "./domain";

const element = <T extends HTMLElement>(id: string): T => {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element: ${id}`);
  return node as T;
};
const query = element<HTMLInputElement>("query");
const classification = element<HTMLSelectElement>("classification");
const culture = element<HTMLSelectElement>("culture");
const missing = element<HTMLSelectElement>("missing");
const group = element<HTMLSelectElement>("group");
const index = makeIndex(snapshot.records);
let filters = readFilters(new URLSearchParams(location.search));
let selectedId = "";
type SortKey = "title" | "date" | "culture" | "maker";
let sortKey: SortKey | "" = "";
let descending = false;
function readSort() {
  const params = new URLSearchParams(location.search);
  const key = params.get("sort");
  sortKey = key === "title" || key === "date" || key === "culture" || key === "maker" ? key : "";
  descending = params.get("order") === "desc";
}
readSort();
function ordered(records: Instrument[]) {
  if (!sortKey) return records;
  const key = sortKey;
  const value = (r: Instrument): string | number | null =>
    key === "date" ? r.beginYear : key === "maker" ? maker(r) || null : r[key];
  return [...records].sort((a, b) => {
    const av = value(a),
      bv = value(b);
    if (av === null || bv === null)
      return av === bv ? a.id.localeCompare(b.id, "en", { numeric: true }) : av === null ? 1 : -1;
    const comparison =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv), "en", { numeric: true });
    return (
      (descending ? -comparison : comparison) || a.id.localeCompare(b.id, "en", { numeric: true })
    );
  });
}
function updateUrl() {
  const params = writeFilters(filters);
  if (sortKey) {
    params.set("sort", sortKey);
    if (descending) params.set("order", "desc");
  }
  history.pushState(null, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
}
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-sort]")) {
  button.addEventListener("click", () => {
    const key = button.dataset.sort as SortKey;
    descending = sortKey === key ? !descending : false;
    sortKey = key;
    updateUrl();
    render();
    showPending();
  });
}
const about = element<HTMLDialogElement>("about");
element("about-open").addEventListener("click", () => about.showModal());
about.addEventListener("close", () => element("about-open").focus());
const node = <K extends keyof HTMLElementTagNameMap>(tag: K, text: string) => {
  const item = document.createElement(tag);
  item.textContent = text;
  return item;
};
for (const [field, select] of [
  ["classification", classification],
  ["culture", culture],
] as const) {
  const values = [
    ...new Set(
      snapshot.records
        .map((record) => record[field])
        .filter((value): value is string => value !== null),
    ),
  ].sort((a, b) => a.localeCompare(b, "en"));
  for (const value of values) select.add(new Option(value, value));
}
element("snapshot").textContent = `Snapshot ${provenance.retrievedAt.slice(0, 10)}`;
for (const button of document.querySelectorAll<HTMLElement>("[data-icon]")) {
  button.prepend(icon(button.dataset.icon as IconName));
}
function bar(
  label: string,
  count: number,
  denominator: number,
  action?: () => void,
  pressed = false,
) {
  const row = action ? document.createElement("button") : document.createElement("div");
  row.className = "bar-row";
  const caption = node("span", "");
  caption.className = "bar-label";
  const total = node("span", String(count));
  total.className = "bar-count";
  caption.append(node("span", label), total);
  const track = node("span", "");
  track.className = "bar-track";
  track.setAttribute("aria-hidden", "true");
  const fill = node("span", "");
  fill.className = "bar-fill";
  fill.style.setProperty("--share", `${denominator ? (count / denominator) * 100 : 0}%`);
  track.append(fill);
  row.append(caption, track);
  if (action) {
    row.setAttribute("type", "button");
    row.setAttribute("aria-pressed", String(pressed));
    row.setAttribute(
      "aria-label",
      `${label}: ${count} of ${denominator} objects. ${pressed ? "Remove filter" : "Filter results"}`,
    );
    row.addEventListener("click", action);
  }
  return row;
}
function restoreControls() {
  query.value = filters.q;
  for (const [select, value] of [
    [classification, filters.classification],
    [culture, filters.culture],
  ] as const) {
    // Unknown URL values stay explicit and produce no matches rather than broadening the query.
    if (value && ![...select.options].some((option) => option.value === value))
      select.add(new Option(value, value));
    select.value = value;
  }
  missing.value = filters.missing;
  group.value = filters.group;
}
function readControls(): Filters {
  return readFilters(
    new URLSearchParams({
      q: query.value,
      classification: classification.value,
      culture: culture.value,
      missing: missing.value,
      group: group.value,
    }),
  );
}
function showPending() {
  element("pending-status").textContent =
    writeFilters(readControls()).toString() === writeFilters(filters).toString()
      ? ""
      : "Unapplied changes — Apply to update results and export.";
}
function render() {
  const records = ordered(selectRecords(snapshot.records, filters, index));
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-sort]")) {
    const selected = button.dataset.sort === sortKey;
    button.parentElement?.setAttribute(
      "aria-sort",
      selected ? (descending ? "descending" : "ascending") : "none",
    );
    const mark = button.querySelector("span");
    if (mark) mark.textContent = selected ? (descending ? "↓" : "↑") : "↕";
  }
  const scope = [
    filters.q && `Search: “${filters.q}”`,
    filters.classification && `Classification: ${filters.classification}`,
    filters.culture && `Culture: ${filters.culture}`,
    filters.missing &&
      `Missing: ${{ culture: "Culture", medium: "Medium", objectDate: "Date" }[filters.missing]} not supplied`,
  ].filter(Boolean);
  const active = scope.length > 0;
  element("active-scope").textContent = active ? scope.join("; ") : "";
  element("pending-status").textContent = "";
  element("result-status").textContent = `${records.length} results`;
  element("distribution-caption").textContent = `Distribution of these ${records.length} results`;
  const body = element("distribution");
  body.replaceChildren();
  const groups = distribution(records, filters.group);
  for (const { value, count } of groups) {
    const field = filters.group;
    const canFilter = field !== "objectName" && value !== null;
    const pressed = canFilter && filters[field] === value;
    const row = bar(
      value ?? "Not supplied",
      count,
      records.length,
      canFilter
        ? () =>
            navigate(
              { ...readControls(), [field]: readControls()[field] === value ? "" : value },
              `group:${value}`,
            )
        : undefined,
      pressed,
    );
    row.dataset.focusKey = `group:${value}`;
    body.append(row);
  }
  if (!records.length) {
    body.append(node("p", "No matching objects. Change or clear filters."));
  }
  const gaps = missingness(records);
  const missingSummary = element("missing-summary");
  missingSummary.replaceChildren();
  for (const [field, label] of [
    ["culture", "Culture not supplied"],
    ["objectDate", "Date not supplied"],
    ["medium", "Medium not supplied"],
  ] as const) {
    const row = bar(
      label,
      gaps[field] ?? 0,
      records.length,
      () =>
        navigate(
          { ...readControls(), missing: readControls().missing === field ? "" : field },
          `missing:${field}`,
        ),
      filters.missing === field,
    );
    row.dataset.focusKey = `missing:${field}`;
    missingSummary.append(row);
  }
  const list = element("objects");
  list.replaceChildren();
  element("objects-empty").hidden = records.length > 0;
  if (!records.some((record) => record.id === selectedId)) selectedId = records[0]?.id ?? "";
  for (const record of records) {
    const item = document.createElement("tr");
    item.dataset.id = record.id;
    const title = document.createElement("td");
    const select = node("button", record.title);
    select.type = "button";
    select.className = "select-object";
    select.setAttribute("aria-pressed", String(record.id === selectedId));
    select.setAttribute("aria-controls", "object-detail");
    select.addEventListener("click", () => {
      selectedId = record.id;
      for (const button of list.querySelectorAll("button"))
        button.setAttribute("aria-pressed", String(button === select));
      renderDetail(record);
    });
    title.append(select);
    item.append(title);
    for (const value of [record.objectDate, record.culture, maker(record)])
      item.append(node("td", value || "Not supplied"));
    list.append(item);
  }
  renderDetail(records.find((record) => record.id === selectedId));
  element("export-status").textContent = "";
}
type SourceRecord = Instrument;
function maker(record: SourceRecord) {
  return [record.artistPrefix, record.artist, record.artistSuffix].filter(Boolean).join(" ");
}
function renderDetail(record?: SourceRecord) {
  const detail = element("object-detail");
  detail.replaceChildren();
  element("detail-title").textContent = record?.title ?? "Object details";
  if (!record) {
    detail.append(node("p", "No object selected."));
    return;
  }
  const source = safeSource(record.sourceUrl);
  if (source) {
    const link = node("a", `Met object ${record.id}`);
    link.href = source;
    link.append(" ", icon("external"));
    detail.append(link);
  }
  const attributes = document.createElement("dl");
  for (const [label, value] of [
    ["Date", record.objectDate],
    ["Culture (source label)", record.culture],
    ["Artist / maker", maker(record)],
    ["Medium", record.medium],
    ["Classification", record.classification],
    ["Object name", record.objectName],
    [
      "Catalogue date bounds",
      `${record.beginYear ?? "Not supplied"} – ${record.endYear ?? "Not supplied"}`,
    ],
  ]) {
    const pair = document.createElement("div");
    pair.append(node("dt", label ?? ""), node("dd", value || "Not supplied"));
    attributes.append(pair);
  }
  detail.append(
    attributes,
    node("p", "Date bounds are catalogue values, not exact creation dates."),
  );
}
function navigate(next: Filters, focusKey?: string) {
  filters = next;
  updateUrl();
  restoreControls();
  render();
  if (focusKey) {
    const target = [...document.querySelectorAll<HTMLElement>("[data-focus-key]")].find(
      (candidate) => candidate.dataset.focusKey === focusKey,
    );
    (target ?? element("reset")).focus({ preventScroll: true });
  }
}
element("filters").addEventListener("submit", (event) => {
  event.preventDefault();
  navigate(readControls());
});
element("filters").addEventListener("input", showPending);
element("filters").addEventListener("change", showPending);
group.addEventListener("change", () => navigate(readControls()));
element("reset").addEventListener("click", () => navigate({ ...defaults }));
window.addEventListener("popstate", () => {
  filters = readFilters(new URLSearchParams(location.search));
  readSort();
  restoreControls();
  render();
});
element("export").addEventListener("click", () => {
  const selection = exportSelection(
    ordered(selectRecords(snapshot.records, filters, index)),
    filters,
    provenance,
    new Date().toISOString(),
  );
  const url = URL.createObjectURL(
    new Blob([`${JSON.stringify(selection, null, 2)}\n`], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "met-instruments-selection.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  element("export-status").textContent =
    "Download requested: selected source records, filters, counts and provenance.";
});
restoreControls();
render();
