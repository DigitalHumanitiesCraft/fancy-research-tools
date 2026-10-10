import "./styles.css";
import sample from "../../data/schoenbach/collection.json";
import { parseDataset, serializeDataset } from "../adapters/json";
import { type Dataset, filterRecords, type ResearchRecord, updateRecord } from "../domain/dataset";
import { type IconName, icon } from "../ui/icons";
import { bindTextValue } from "../ui/text-value";
import { showSource } from "./source";
import { createDraftStorage, MAX_BYTES, withinSizeLimit } from "./storage";

const element = <T extends HTMLElement>(id: string): T => {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Missing interface element: ${id}`);
  return found as T;
};
const status = element("status");
const error = element("error");
const storageError = element("storage-error");
const query = element<HTMLInputElement>("query");
const kind = element<HTMLSelectElement>("kind");
const list = element<HTMLUListElement>("records");
const content = element("record-content");
const heading = element("detail-heading");
let dataset: Dataset = parseDataset(JSON.stringify(sample));
let revision = 0;
let dirty = false;
let editing = false;
const drafts = createDraftStorage(location.pathname, () => localStorage);
let activeUrl = new URL(location.href);
let editError = false;

function message(target: HTMLElement, text: string): void {
  if (target === error) editError = false;
  target.textContent = text;
  target.hidden = !text;
}

function clearResolvedEditError(): void {
  if (editError) message(error, "");
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : "An unexpected error occurred.";
}

function persist(): void {
  const result = drafts.save({ revision, dataset }, () =>
    window.confirm(
      "The previous browser copy could not be restored. Overwrite that stored copy with the current collection? Choose Cancel to preserve it and export your current collection instead.",
    ),
  );
  message(storageError, result.error ?? "");
  if (!result.error)
    message(
      status,
      `Revision ${revision} saved in this browser. Export a file to keep a separate copy.`,
    );
}

function restore(): void {
  try {
    const restored = drafts.restore();
    if (!restored) return;
    dataset = restored.dataset;
    revision = restored.revision;
    message(status, `Restored browser copy, revision ${revision}.`);
  } catch (cause) {
    message(
      storageError,
      `Could not restore browser storage: ${describe(cause)} The Schönbach example collection is open; the stored copy has not been overwritten.`,
    );
  }
}

function allowDiscard(): boolean {
  return !dirty || window.confirm("Discard the unsaved changes to this record?");
}

function button(text: string, action: () => void, secondary = false): HTMLButtonElement {
  const node = document.createElement("button");
  node.type = "button";
  node.className = secondary ? "button button-secondary" : "button";
  node.textContent = text;
  const actionIcon: IconName | undefined =
    text === "Edit record" ? "edit" : text === "Cancel editing" ? "close" : undefined;
  if (actionIcon) node.prepend(icon(actionIcon));
  node.addEventListener("click", action);
  return node;
}

function field(label: string, value: string): void {
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.textContent = value;
  metadata.append(term, description);
}
const metadata = document.createElement("dl");

function showRecord(record: ResearchRecord | undefined): void {
  content.replaceChildren();
  const hasSource = showSource(element("source-evidence"), record);
  element("detail").classList.remove("is-editing");
  heading.textContent = record?.title ?? "Record details";
  if (!record) {
    const empty = document.createElement("p");
    empty.textContent = activeUrl.searchParams.has("id")
      ? "This record identifier is not present in the current collection. Select a record from the results."
      : "Select a record from the collection.";
    content.append(empty);
    return;
  }
  metadata.replaceChildren();
  field("Date", record.date ?? "Not recorded");
  field("Place", record.place ?? "Not recorded");
  field("Record type", record.kind);
  field("Working review", record.review === "checked" ? "Checked (manual assertion)" : "Draft");
  if (!hasSource) field("Working source note", record.source);
  field("Notes", record.notes || "No working notes");
  field("Identifier", record.id);
  content.append(
    metadata,
    button("Edit record", () => showEditor(record)),
  );
}

function showEditor(record: ResearchRecord): void {
  editing = true;
  dirty = false;
  content.replaceChildren();
  heading.textContent = "Edit record";
  element("detail").classList.add("is-editing");
  const form = document.createElement("form");
  form.className = "form-grid";
  const controls = new Map<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>();
  const textValues = new Map<string, ReturnType<typeof bindTextValue>>();
  for (const [name, label] of [
    ["title", "Title"],
    ["date", "Date"],
    ["place", "Place"],
    ["kind", "Record type"],
    ["review", "Working review"],
    ["source", "Working source note"],
    ["notes", "Notes"],
  ] as const) {
    const labelNode = document.createElement("label");
    labelNode.htmlFor = `edit-${name}`;
    labelNode.textContent = label;
    const input =
      name === "notes" || name === "source" || name === "title"
        ? document.createElement("textarea")
        : name === "review"
          ? document.createElement("select")
          : document.createElement("input");
    input.id = `edit-${name}`;
    input.name = name;
    if (input instanceof HTMLSelectElement) {
      for (const value of ["draft", "checked"]) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value === "checked" ? "Checked" : "Draft";
        input.append(option);
      }
    } else {
      input.required = ["title", "kind", "source"].includes(name);
    }
    if (input instanceof HTMLSelectElement) input.value = record[name] ?? "";
    else {
      const textValue = bindTextValue(input);
      textValue.restore(record[name] ?? "");
      textValues.set(name, textValue);
    }
    controls.set(name, input);
    const group = document.createElement("div");
    group.className = `field-${name}`;
    if (name === "title" || name === "source" || name === "notes")
      group.classList.add("full-width");
    if (input instanceof HTMLTextAreaElement) input.rows = name === "title" ? 2 : 3;
    group.append(labelNode, input);
    if (name === "review") {
      const hint = document.createElement("p");
      hint.id = "review-meaning";
      hint.className = "meta";
      hint.textContent = "Manual assertion; no reviewer or criterion recorded.";
      input.setAttribute("aria-describedby", hint.id);
      group.append(hint);
    }
    form.append(group);
  }
  const notice = document.createElement("p");
  notice.className = "status";
  notice.setAttribute("role", "status");
  form.addEventListener("input", () => {
    dirty = true;
    notice.textContent = "Unsaved record changes.";
  });
  const actions = document.createElement("div");
  actions.className = "toolbar";
  const save = document.createElement("button");
  save.type = "submit";
  save.className = "button";
  save.textContent = "Save record";
  save.prepend(icon("save"));
  actions.append(
    save,
    button(
      "Cancel editing",
      () => {
        if (!allowDiscard()) return;
        dirty = false;
        editing = false;
        clearResolvedEditError();
        render();
        heading.focus();
      },
      true,
    ),
  );
  form.append(notice, actions);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = (name: string): string =>
      textValues.get(name)?.read() ?? controls.get(name)?.value ?? "";
    try {
      const candidate = updateRecord(dataset, record.id, {
        title: value("title"),
        kind: value("kind"),
        place: value("place") || null,
        date: value("date") || null,
        source: value("source"),
        notes: value("notes"),
        review: value("review") === "checked" ? "checked" : "draft",
      });
      dataset = withinSizeLimit(candidate);
      revision += 1;
      dirty = false;
      editing = false;
      persist();
      message(error, "");
      render();
      heading.focus();
    } catch (cause) {
      message(error, `Record not saved: ${describe(cause)}`);
      editError = true;
    }
  });
  content.append(form);
  controls.get("title")?.focus();
}

function navigate(url: URL): void {
  if (!allowDiscard()) {
    query.value = activeUrl.searchParams.get("q") ?? "";
    kind.value = activeUrl.searchParams.get("kind") ?? "";
    return;
  }
  dirty = false;
  editing = false;
  clearResolvedEditError();
  history.pushState(null, "", url);
  activeUrl = url;
  render();
}

function render(): void {
  element("collection-title").textContent = dataset.title;
  const q = activeUrl.searchParams.get("q") ?? "";
  const selectedKind = activeUrl.searchParams.get("kind") ?? "";
  query.value = q;
  kind.replaceChildren(new Option("All types", ""));
  for (const name of [...new Set(dataset.records.map((record) => record.kind))].sort())
    kind.append(new Option(name, name));
  if (selectedKind && ![...kind.options].some((option) => option.value === selectedKind))
    kind.append(new Option(selectedKind, selectedKind));
  kind.value = selectedKind;
  const hideKind = kind.options.length <= 2 && !selectedKind;
  kind.hidden = hideKind;
  element("kind-label").hidden = hideKind;
  const records = filterRecords(dataset.records, q, selectedKind);
  element("clear-filters").hidden = !q && !selectedKind;
  message(
    element("export-scope"),
    q || selectedKind
      ? "Export includes the entire collection, including records outside these filters."
      : "",
  );
  element("results").textContent = q || selectedKind ? `${records.length} matching records` : "";
  list.replaceChildren();
  const selectedId = activeUrl.searchParams.get("id") ?? records[0]?.id;
  for (const record of records) {
    const item = document.createElement("li");
    const title = document.createElement("p");
    title.className = "record-title";
    title.textContent = record.title;
    const select = button(
      "Open",
      () => {
        const url = new URL(activeUrl);
        url.searchParams.set("id", record.id);
        navigate(url);
        if (!editing) heading.focus();
      },
      true,
    );
    select.setAttribute("aria-label", `Open record ${record.title}`);
    if (record.id === selectedId) {
      select.setAttribute("aria-current", "true");
      item.classList.add("selected-record");
    }
    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = [record.date ?? "Date not recorded", record.place]
      .filter(Boolean)
      .join(", ");
    item.append(title, meta, select);
    list.append(item);
  }
  if (!records.length) {
    const item = document.createElement("li");
    item.textContent = "No records match. Change the search or record type.";
    list.append(item);
  }
  const selected = dataset.records.find((record) => record.id === selectedId);
  message(
    element("selection-context"),
    selected && !records.some((record) => record.id === selectedId)
      ? "This selected record is outside the current results. Clear filters to show it in the list."
      : "",
  );
  showRecord(selected);
}

element("clear-filters").addEventListener("click", () => {
  const url = new URL(activeUrl);
  url.searchParams.delete("q");
  url.searchParams.delete("kind");
  navigate(url);
  if (!editing) query.focus();
});

element<HTMLFormElement>("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const url = new URL(activeUrl);
  for (const [key, value] of [
    ["q", query.value],
    ["kind", kind.value],
  ] as const) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  navigate(url);
});

element<HTMLInputElement>("import-file").addEventListener("change", async (event) => {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    if (file.size > MAX_BYTES) throw new Error("The file exceeds the 1 MiB limit.");
    const imported = withinSizeLimit(parseDataset(await file.text()));
    if (!allowDiscard()) return;
    if (
      !window.confirm(
        "Replace the current collection with this file? Export the current collection first if you need to keep it.",
      )
    )
      return;
    dataset = imported;
    revision += 1;
    dirty = false;
    editing = false;
    for (const key of ["id", "q", "kind"]) activeUrl.searchParams.delete(key);
    history.pushState(null, "", activeUrl);
    message(element("provenance"), `Imported from ${file.name}.`);
    persist();
    message(error, "");
    render();
  } catch (cause) {
    message(error, `Import rejected: ${describe(cause)} Your current collection is unchanged.`);
  } finally {
    input.value = "";
  }
});

element("export").addEventListener("click", () => {
  if (dirty) {
    message(error, "Save or cancel the record changes before exporting the collection.");
    editError = true;
    return;
  }
  try {
    const blob = new Blob([serializeDataset(dataset)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "research-collection.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    message(error, "");
    message(status, "Collection export prepared. Keep the downloaded file as your portable copy.");
  } catch (cause) {
    message(error, `Export failed: ${describe(cause)}`);
  }
});

window.addEventListener("popstate", () => {
  if (!allowDiscard()) {
    history.pushState(null, "", activeUrl);
    return;
  }
  activeUrl = new URL(location.href);
  dirty = false;
  editing = false;
  clearResolvedEditError();
  render();
});
window.addEventListener("beforeunload", (event) => {
  if (dirty || !storageError.hidden) event.preventDefault();
});
restore();
render();
element("export").prepend(icon("download"));
document.querySelector(".file-label")?.prepend(icon("upload"));
document.querySelector("#search-form button")?.prepend(icon("search"));
