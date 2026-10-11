import rawCollection from "../../data/photographs/collection.jsonld?raw";
import { icon } from "../ui/icons";
import {
  creatorText,
  filterPhotographs,
  initialState,
  type Photograph,
  type PhotoState,
  parseCollection,
  recordKey,
  selectionExport,
  stateHash,
} from "./model";
import "./style.css";

const images = import.meta.glob<string>("../../data/photographs/images/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});
const main = document.querySelector<HTMLElement>("main");
const nav = document.querySelector<HTMLElement>("#view-nav");
if (!main || !nav) throw new Error("The photograph workspace is unavailable.");
const content = main;
const navigation = nav;

document.querySelector<HTMLAnchorElement>(".skip-link")?.addEventListener("click", (event) => {
  event.preventDefault();
  content.focus();
  content.scrollIntoView();
});

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

try {
  const collection = parseCollection(JSON.parse(rawCollection));
  let state = initialState(location.hash, collection.items);
  let destroyViewer: (() => void) | undefined;
  let viewerGeneration = 0;
  let notice = "";
  const scrollPositions = new Map<string, number>();

  const imageUrl = (record: Photograph) => {
    const result = images[`../../${record.image.src}`];
    if (!result) throw new Error("A photograph image is missing from this build.");
    return result;
  };
  const photograph = (key: string) => collection.items.find((r) => recordKey(r) === key);
  const viewName = (view: PhotoState["view"]) =>
    ({
      collection: "Collection",
      timeline: "Timeline",
      photograph: "Photograph",
      comparison: "Comparison",
    })[view];

  const navigate = (next: PhotoState, replace = false, restore = false) => {
    scrollPositions.set(stateHash(state), window.scrollY);
    state = next;
    history[replace ? "replaceState" : "pushState"]({}, "", stateHash(state));
    render();
    if (restore) window.scrollTo(0, scrollPositions.get(stateHash(state)) ?? 0);
    else window.scrollTo(0, 0);
    if (!replace)
      content.querySelector<HTMLElement>("h1, .sr-only")?.focus({ preventScroll: true });
  };

  function link(text: string, next: PhotoState, className = "", restore = false) {
    const node = element("a", className, text);
    node.href = stateHash(next);
    node.dataset.photoView = next.view;
    node.dataset.photoOrigin = next.origin;
    node.dataset.photoRecord = next.record;
    node.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      navigate(
        { ...state, view: next.view, origin: next.origin, record: next.record },
        false,
        restore,
      );
    });
    return node;
  }

  function syncLocation() {
    history.replaceState({}, "", stateHash(state));
    for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[data-photo-view]")) {
      anchor.href = stateHash({
        ...state,
        view: anchor.dataset.photoView as PhotoState["view"],
        origin: anchor.dataset.photoOrigin as PhotoState["origin"],
        record: anchor.dataset.photoRecord ?? "",
      });
    }
  }

  function external(text: string, href: string) {
    const node = element("a", "", text);
    node.href = href;
    node.append(" ", icon("external"));
    node.rel = "noreferrer";
    return node;
  }

  function photoLink(record: Photograph, text: string, className = "") {
    return link(
      text,
      {
        ...state,
        view: "photograph",
        record: recordKey(record),
        origin: state.view === "photograph" ? state.origin : state.view,
      },
      className,
    );
  }

  function picture(record: Photograph, className = "", alt = "") {
    const img = element("img", className);
    img.src = imageUrl(record);
    img.alt = alt;
    img.width = record.image.width;
    img.height = record.image.height;
    img.loading = "lazy";
    return img;
  }

  function selectButton(record: Photograph, compact = false, surface = "content") {
    const key = recordKey(record);
    const selected = state.selected.includes(key);
    const button = element("button", "selection-toggle");
    button.type = "button";
    button.dataset.selection = key;
    button.dataset.selectionSurface = surface;
    button.setAttribute("aria-pressed", String(selected));
    const label = selected
      ? `Remove ${record.title} from comparison`
      : `Add ${record.title} to comparison`;
    button.setAttribute("aria-label", label);
    button.title = label;
    const selectionBox = element("span", "selection-box");
    selectionBox.setAttribute("aria-hidden", "true");
    if (selected) selectionBox.append(icon("check"));
    button.append(selectionBox);
    if (!compact) button.append(selected ? "Remove from comparison" : "Compare");
    button.addEventListener("click", () => {
      if (!selected && state.selected.length === 4) {
        notice = "Four photographs are selected. Remove one from the selection to add another.";
      } else {
        state.selected = selected
          ? state.selected.filter((id) => id !== key)
          : [...state.selected, key];
        notice = "";
        syncLocation();
      }
      const scroll = window.scrollY;
      const selector = `button[data-selection-surface="${surface}"]`;
      const previousIndex = [...content.querySelectorAll(selector)].indexOf(button);
      if (state.view === "photograph") {
        // Selection does not change the inspected evidence or its pan/zoom position.
        content.querySelector(".selection-tray")?.remove();
        const selectedTray = tray();
        if (selectedTray) content.prepend(selectedTray);
        const current = photograph(state.record);
        if (current) {
          content.querySelector(".detail-actions")?.replaceChildren(selectButton(current));
          content.querySelector(".detail-nav")?.replaceWith(detailNavigation(current));
        }
        content.querySelector(".notice")?.remove();
        if (notice) {
          const message = element("p", "notice", notice);
          message.setAttribute("role", "alert");
          content.prepend(message);
        }
      } else render();
      const remaining = [...content.querySelectorAll<HTMLButtonElement>(selector)];
      const target =
        remaining.find((node) => node.dataset.selection === key) ??
        remaining[Math.min(previousIndex, remaining.length - 1)] ??
        content.querySelector<HTMLElement>('input[type="search"], h1:not(.sr-only)') ??
        content;
      target.focus({ preventScroll: true });
      window.scrollTo(0, scroll);
    });
    return button;
  }

  function download() {
    const blob = new Blob([`${JSON.stringify(selectionExport(collection, state), null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = element("a");
    a.href = url;
    a.download = "photograph-selection.json";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportButton() {
    const button = element("button", "export");
    button.type = "button";
    button.append(icon("download"), " Export selection");
    button.addEventListener("click", download);
    return button;
  }

  function tray() {
    if (!state.selected.length) return;
    const region = element("div", "selection-tray");
    region.setAttribute("aria-label", "Selected photographs");
    region.append(
      link(`Compare ${state.selected.length}`, { ...state, view: "comparison", record: "" }),
    );
    const list = element("ul");
    list.setAttribute("role", "list");
    for (const key of state.selected) {
      const record = photograph(key);
      if (!record) continue;
      const li = element("li");
      const open = photoLink(record, "");
      open.setAttribute("aria-label", `Inspect ${record.title}`);
      open.append(picture(record));
      const remove = selectButton(record, true, "tray");
      remove.replaceChildren(icon("close"));
      li.append(open);
      // The displayed photograph has its own selection action beside its evidence.
      if (state.view !== "photograph" || state.record !== key) li.append(remove);
      list.append(li);
    }
    region.append(list, exportButton());
    content.append(region);
    return region;
  }

  function field(labelText: string, control: HTMLElement, className = "") {
    const label = element("label", `filter ${className}`);
    label.append(element("span", "", labelText), control);
    return label;
  }

  function filterSelect(
    label: string,
    values: string[],
    selected: string,
    update: (value: string) => void,
  ) {
    const select = element("select");
    const all = element("option", "", `All ${label.toLowerCase()}`);
    all.value = "";
    select.append(all);
    // Preserve an addressable filter even when this snapshot has no matching value.
    for (const value of [...new Set([...values, ...(selected ? [selected] : [])])].sort((a, b) =>
      a.localeCompare(b),
    )) {
      const option = element("option", "", value);
      option.value = value;
      select.append(option);
    }
    select.value = selected;
    select.addEventListener("change", () => update(select.value));
    return field(label, select);
  }

  function filters(results: HTMLElement) {
    const controls = element("div", "browse-filters");
    const search = element("input");
    search.type = "search";
    search.value = state.query;
    search.placeholder = "Title, creator, date or process";
    search.addEventListener("input", () => {
      state.query = search.value;
      syncLocation();
      renderResults(results);
    });
    controls.append(field("Search photographs", search, "search"));
    const apply = (key: "creator" | "technique", value: string) => {
      state[key] = value;
      syncLocation();
      renderResults(results);
    };
    controls.append(
      filterSelect(
        "Creators",
        collection.items.flatMap((r) => r.creators.map((c) => c.name)),
        state.creator,
        (value) => apply("creator", value),
      ),
    );
    const processes = new Map<string, string>();
    for (const record of collection.items) {
      if (record.technique && !processes.has(record.technique.toLocaleLowerCase("en"))) {
        processes.set(record.technique.toLocaleLowerCase("en"), record.technique);
      }
    }
    controls.append(
      filterSelect(
        "Processes",
        [...processes.values()],
        processes.get(state.technique.toLocaleLowerCase("en")) ?? state.technique,
        (value) => apply("technique", value),
      ),
    );
    if (state.view !== "timeline") {
      const sort = element("select");
      for (const [value, label] of [
        ["date", "Catalogue date"],
        ["title", "Title A–Z"],
      ]) {
        const option = element("option", "", label);
        option.value = value ?? "date";
        sort.append(option);
      }
      sort.value = state.sort;
      sort.addEventListener("change", () => {
        state.sort = sort.value === "title" ? "title" : "date";
        syncLocation();
        renderResults(results);
      });
      controls.append(field("Order by", sort));
    }
    return controls;
  }

  function card(record: Photograph, timeline = false) {
    const article = element("article", "photo-card");
    article.dataset.record = recordKey(record);
    const media = element("div", "photo-picture");
    const imageLink = photoLink(record, "");
    imageLink.setAttribute("aria-label", `Inspect ${record.title}`);
    imageLink.tabIndex = -1;
    imageLink.append(picture(record));
    media.append(imageLink, selectButton(record, true));
    const title = element(timeline ? "h3" : "h2");
    title.append(photoLink(record, record.title));
    article.append(media);
    if (!timeline)
      article.append(element("p", "photo-date", record.date.label || "Date not recorded"));
    article.append(
      title,
      element("p", "creator", creatorText(record)),
      element("p", "technique", record.technique ?? "Process not recorded"),
    );
    return article;
  }

  function resetFilters() {
    navigate({ ...state, query: "", creator: "", technique: "" }, true);
    content.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
  }

  function renderResults(target: HTMLElement) {
    target.replaceChildren();
    const records = filterPhotographs(collection.items, state);
    if (state.query || state.creator || state.technique) {
      const status = element("div", "view-heading");
      const summary = element(
        "p",
        "result-status",
        `${records.length} matching ${records.length === 1 ? "photograph" : "photographs"}`,
      );
      summary.setAttribute("role", "status");
      const clear = element("button", "", "Clear filters");
      clear.type = "button";
      clear.addEventListener("click", resetFilters);
      status.append(summary, clear);
      target.append(status);
    }
    if (!records.length) {
      const empty = element("div", "empty");
      empty.append(element("h2", "", "No photographs match these filters"));
      target.append(empty);
      return;
    }
    const list = element("ol", state.view === "timeline" ? "timeline" : "collection");
    list.setAttribute("role", "list");
    if (state.view === "timeline")
      list.setAttribute(
        "aria-label",
        "Photographs in chronological order; spacing does not represent elapsed time",
      );
    let currentGroup = "";
    for (const record of records) {
      if (state.view === "timeline") {
        const group =
          record.date.start === null
            ? "Other catalogue dates"
            : `${Math.floor(record.date.start / 10) * 10}s`;
        if (group !== currentGroup) {
          const section = element("li", "timeline-year");
          section.append(element("h2", "", group));
          list.append(section);
          currentGroup = group;
        }
        const row = element("li", "timeline-entry");
        row.append(element("p", "photo-date", record.date.label || "Date not recorded"));
        const mark = photoLink(
          record,
          "",
          `timeline-mark${record.date.kind === "exact-year" ? "" : " qualified"}`,
        );
        mark.setAttribute("aria-label", `Inspect ${record.title}, ${record.date.label}`);
        row.append(mark, card(record, true));
        list.append(row);
      } else {
        const li = element("li");
        li.append(card(record));
        list.append(li);
      }
    }
    target.append(list);
  }

  function browse() {
    const heading = element("h1", "sr-only", viewName(state.view));
    heading.tabIndex = -1;
    content.append(heading);
    const layout = element("div", "browse-layout");
    const results = element("section");
    results.setAttribute("aria-label", "Photographs");
    layout.append(filters(results), results);
    renderResults(results);
    content.append(layout);
  }

  function detailNavigation(record: Photograph | undefined) {
    const top = element("nav", "detail-nav");
    top.setAttribute("aria-label", "Photograph navigation");
    top.append(
      link(`← ${viewName(state.origin)}`, { ...state, view: state.origin, record: "" }, "", true),
    );
    if (!record) return top;
    const context =
      state.origin === "comparison"
        ? state.selected.map(photograph).filter((r): r is Photograph => !!r)
        : filterPhotographs(collection.items, { ...state, view: state.origin });
    const position = context.findIndex((r) => r.id === record.id);
    const neighbours = element("div", "neighbour");
    for (const [adjacent, direction] of [
      [context[position - 1], "Previous"],
      [position < 0 ? undefined : context[position + 1], "Next"],
    ] as const) {
      if (!adjacent) continue;
      const next = photoLink(adjacent, "");
      next.setAttribute(
        "aria-label",
        `${direction} in ${viewName(state.origin).toLowerCase()}: ${adjacent.title}, ${adjacent.date.label}`,
      );
      next.append(picture(adjacent), element("span", "", `${direction}: ${adjacent.title}`));
      neighbours.append(next);
    }
    top.append(neighbours);
    return top;
  }

  function detail() {
    const record = photograph(state.record);
    content.append(detailNavigation(record));
    if (!record) {
      content.append(element("h1", "", "Photograph not found"));
      return;
    }
    const layout = element("div", "detail-layout");
    const figure = element("figure");
    const metadata = element("section");
    const title = element("h1", "", record.title);
    title.tabIndex = -1;
    metadata.append(title);
    const fields = element("dl");
    const add = (name: string, value: string | HTMLElement) => {
      const dd = element("dd");
      dd.append(value);
      fields.append(element("dt", "", name), dd);
    };
    add("Catalogue date", record.date.label || "Not recorded");
    for (const creator of record.creators) {
      const role = creator.role
        ? creator.role[0]?.toUpperCase() + creator.role.slice(1)
        : "Creator";
      add(role, [creator.qualifier, creator.name, creator.extent].filter(Boolean).join(" "));
    }
    if (!record.creators.length) add("Creator", "Not recorded");
    add("Process", record.technique ?? "Not recorded");
    add("Catalogue culture", record.culture.join("; ") || "Not recorded");
    add("Accession", record.accession);
    add("Source", external("Cleveland Museum of Art", record.sourceUrl));
    const localImage = element("a", "", "Open image");
    localImage.href = imageUrl(record);
    add("Image", localImage);
    add(
      "Image rights",
      external(
        "CC0 public domain dedication",
        "https://creativecommons.org/publicdomain/zero/1.0/",
      ),
    );
    metadata.append(fields);
    const actions = element("div", "detail-actions");
    actions.append(selectButton(record));
    metadata.append(actions);
    layout.append(figure, metadata);
    content.append(layout);
    const fallback = element("div", "viewer");
    fallback.append(picture(record, "", record.title));
    figure.append(fallback);
    const generation = viewerGeneration;
    void import("./viewer")
      .then(({ mountViewer }) => {
        if (generation !== viewerGeneration || !figure.isConnected) return;
        figure.replaceChildren();
        destroyViewer = mountViewer(record, imageUrl(record), figure);
      })
      .catch(() => {
        // The ordinary local image remains readable if the enhancement cannot load.
      });
  }

  function comparison() {
    const heading = element("h1", "", "Comparison");
    heading.tabIndex = -1;
    const headingRow = element("div", "view-heading");
    headingRow.append(heading);
    if (state.selected.length) headingRow.append(exportButton());
    content.append(headingRow);
    const selected = state.selected.map(photograph).filter((r): r is Photograph => !!r);
    if (!selected.length) {
      const empty = element("div", "empty");
      empty.append(
        element(
          "p",
          "",
          "Select photographs from the collection to compare their catalogue descriptions.",
        ),
        link("Choose photographs", { ...state, view: "collection" }),
      );
      content.append(empty);
      return;
    }
    const scroll = element("div", "comparison-scroll");
    scroll.tabIndex = 0;
    scroll.setAttribute("role", "region");
    scroll.setAttribute("aria-label", "Selected photograph comparison");
    const table = element("table", "comparison");
    const thead = element("thead");
    const head = element("tr");
    head.append(element("th", "", "Photograph"));
    for (const record of selected) {
      const th = element("th");
      th.scope = "col";
      const open = photoLink(record, "");
      open.append(picture(record), record.title);
      const remove = selectButton(record, true);
      remove.replaceChildren(icon("close"));
      const item = element("div", "comparison-item");
      item.append(open, remove);
      th.append(item);
      head.append(th);
    }
    thead.append(head);
    const body = element("tbody");
    const rows: [string, (record: Photograph) => string | HTMLElement][] = [
      ["Catalogue date", (r) => r.date.label || "Not recorded"],
      [
        "Creators",
        (r) =>
          r.creators
            .map((c) => `${c.role}: ${[c.qualifier, c.name, c.extent].filter(Boolean).join(" ")}`)
            .join("; ") || "Not recorded",
      ],
      ["Process", (r) => r.technique ?? "Not recorded"],
      ["Catalogue culture", (r) => r.culture.join("; ") || "Not recorded"],
      ["Source", (r) => external(`Cleveland Museum of Art ${r.accession}`, r.sourceUrl)],
    ];
    for (const [name, value] of rows) {
      const row = element("tr");
      const headingCell = element("th", "", name);
      headingCell.scope = "row";
      row.append(headingCell);
      for (const record of selected) {
        const cell = element("td");
        cell.append(value(record));
        row.append(cell);
      }
      body.append(row);
    }
    table.append(thead, body);
    scroll.append(table);
    content.append(scroll);
  }

  function render() {
    viewerGeneration += 1;
    destroyViewer?.();
    destroyViewer = undefined;
    content.replaceChildren();
    navigation.replaceChildren();
    const identity = document.querySelector<HTMLAnchorElement>(".identity");
    if (identity)
      identity.replaceWith(
        link("Collection Explorer", { ...state, view: "collection", record: "" }, "identity"),
      );
    for (const view of ["collection", "timeline", "comparison"] as const) {
      const anchor = link(viewName(view), { ...state, view, record: "" });
      if (state.view === view || (state.view === "photograph" && state.origin === view))
        anchor.setAttribute("aria-current", "page");
      navigation.append(anchor);
    }
    document.title = `${state.view === "photograph" ? (photograph(state.record)?.title ?? "Photograph") : viewName(state.view)} — Collection Explorer`;
    if (notice) {
      const message = element("p", "notice", notice);
      message.setAttribute("role", "alert");
      content.append(message);
    }
    if (state.view !== "comparison") tray();
    if (state.view === "photograph") detail();
    else if (state.view === "comparison") comparison();
    else browse();
  }

  window.addEventListener("popstate", () => {
    state = initialState(location.hash, collection.items);
    notice = "";
    render();
    window.scrollTo(0, scrollPositions.get(stateHash(state)) ?? 0);
  });
  window.addEventListener("hashchange", () => {
    if (location.hash !== stateHash(state)) {
      state = initialState(location.hash, collection.items);
      render();
    }
  });
  render();
} catch (error) {
  const message = element(
    "p",
    "notice",
    error instanceof Error ? error.message : "The photograph study could not load.",
  );
  message.setAttribute("role", "alert");
  content.replaceChildren(element("h1", "", "Photographs unavailable"), message);
}
