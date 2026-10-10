const paths = {
  search: "M21 21l-5-5M19 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  filter: "M3 4h18l-7 8v7l-4 2v-9z",
  reset: "M3 10a9 9 0 1 1 2 8M3 4v6h6",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  upload: "M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5",
  edit: "m15 4 5 5M4 20l5-1L21 7l-5-5L4 14z",
  save: "M5 3h12l4 4v14H3V3zM7 3v6h9V3M7 21v-8h10v8",
  close: "m6 6 12 12M6 18 18 6",
  external: "M14 3h7v7m0-7L10 14M10 3H3v18h18v-7",
  chart: "M4 3v18h17M8 16V9m5 7V5m5 11v-4",
  book: "M12 5v16M12 5C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 1",
  check: "m4 12 5 5L20 6",
} as const;

export type IconName = keyof typeof paths;

/** Icons supplement visible text and carry no independent accessible name. */
export function icon(name: IconName): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.classList.add("icon");
  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute("d", paths[name]);
  svg.append(path);
  return svg;
}
