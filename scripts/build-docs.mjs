import { mkdir, readFile, writeFile } from "node:fs/promises";
import { posix } from "node:path";
import { marked } from "marked";

// Publication is opt-in. Vite consumes this same source-to-route allowlist.
const pages = JSON.parse(await readFile(new URL("./docs-pages.json", import.meta.url), "utf8"));
const { version } = JSON.parse(await readFile("package.json", "utf8"));
const published = new Map(pages.map(([source, destination]) => [source, destination]));
const rendered = new Map();
const outputs = new Map();
let currentSource;
let currentDestination;
let headingIds;
const internalLinks = [];
const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const renderer = new marked.Renderer();
const renderTable = renderer.table.bind(renderer);
renderer.table = (token) => {
  const label = token.header.map((cell) => cell.text).join(", ");
  return `<div class="table-scroll" role="region" aria-label="Table: ${escapeHtml(label)}" tabindex="0">${renderTable(token)}</div>`;
};
renderer.html = ({ text }) => escapeHtml(text);
renderer.link = function ({ href, tokens }) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^https?:\/\//i.test(href)) {
    throw new Error(`Unsupported documentation link protocol: ${href}`);
  }
  if ([...href].some((character) => character.charCodeAt(0) <= 32) || href.startsWith("//")) {
    throw new Error(`Ambiguous documentation link: ${href}`);
  }
  if (!/^https?:\/\//i.test(href)) {
    const [pathAndQuery, fragment] = href.split("#");
    const [path, query] = pathAndQuery.split("?");
    if (path) {
      const canonical = posix.normalize(
        posix.join(posix.dirname(currentSource), decodeURIComponent(path)),
      );
      const destination = path.endsWith(".md") ? published.get(canonical) : canonical;
      if (!destination) throw new Error(`Unpublished Markdown link in ${currentSource}: ${href}`);
      href = posix.relative(posix.dirname(currentDestination), destination) || ".";
      if (path.endsWith("/") && !href.endsWith("/")) href += "/";
      if (query !== undefined) href += `?${query}`;
      if (fragment !== undefined) href += `#${fragment}`;
    }
    if (fragment) {
      const targetPath = href.split("#")[0].split("?")[0];
      const target = targetPath
        ? posix.normalize(posix.join(posix.dirname(currentDestination), targetPath))
        : currentDestination;
      internalLinks.push({ source: currentSource, target, fragment: decodeURIComponent(fragment) });
    }
  }
  return `<a href="${escapeHtml(href)}">${this.parser.parseInline(tokens)}</a>`;
};
renderer.image = ({ href, text }) => {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href))
    throw new Error("Documentation images must be local assets.");
  return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}">`;
};
renderer.heading = function ({ tokens, depth }) {
  const content = this.parser.parseInline(tokens);
  const slug = content
    .replace(/<[^>]*>/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const base = slug || "section";
  let id = base;
  let suffix = 1;
  while (headingIds.has(id)) id = `${base}-${suffix++}`;
  headingIds.add(id);
  return `<h${depth} id="${id}">${content}</h${depth}>`;
};
for (const [source, destination, label] of pages) {
  const root = destination.includes("/") ? "../" : "./";
  currentSource = source;
  currentDestination = destination;
  headingIds = new Set(["main"]);
  const markdown = (await readFile(source, "utf8")).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const html = await marked(markdown, { renderer });
  rendered.set(destination, { html, ids: headingIds });
  const navItems = pages.map(
    ([, href, title]) =>
      `<a ${href === destination ? 'aria-current="page"' : ""} href="${root}${href}">${escapeHtml(title)}</a>`,
  );
  const guideItems = navItems.filter((_, index) => pages[index][1].startsWith("guides/"));
  const referenceItems = navItems.filter((_, index) => pages[index][1].startsWith("reference/"));
  const nav = `<div class="docs-nav-links"><div class="docs-nav-group"><h3>Build a tool</h3>${guideItems.join("")}</div><div class="docs-nav-group"><h3>Reference</h3>${referenceItems.join("")}</div></div>`;
  const sections = [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)];
  const outline =
    sections.length > 2 && destination !== "index.html"
      ? `<nav class="page-outline" aria-labelledby="outline-heading"><h2 id="outline-heading">On this page</h2><ul>${sections.map(([, id, title]) => `<li><a href="#${id}">${title}</a></li>`).join("")}</ul></nav>`
      : "";
  const content =
    destination === "index.html"
      ? `<main id="main" class="overview prose" tabindex="-1">${html}</main>`
      : `<div class="docs-frame"><div class="docs-layout"><main id="main" class="prose" tabindex="-1">${html}</main>${outline}<nav class="docs-nav" aria-labelledby="documentation-heading"><h2 id="documentation-heading">Documentation</h2>${nav}<a href="https://github.com/DigitalHumanitiesCraft/fancy-research-tools">Source repository</a></nav></div></div>`;
  outputs.set(
    destination,
    `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Fancy Research Tools: a documented, adaptable browser starter."><title>${escapeHtml(label)} · Fancy Research Tools</title><script type="module" src="${root}src/docs.ts"></script></head>
<body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="${root}index.html">Fancy Research Tools</a><nav aria-label="Project"><a ${destination === "index.html" ? 'aria-current="page"' : ""} href="${root}index.html">Overview</a><a href="${root}tools/">Tools</a><a ${destination !== "index.html" ? 'aria-current="true"' : ""} href="${root}guides/getting-started.html">Documentation</a></nav></header>${content}<footer>Digital Humanities Craft. Development version ${escapeHtml(version)}. <a href="https://dhcraft.org/fancy-research-tools/">Development and support</a></footer></body></html>`,
  );
}

// Validate fragment targets after every document has been rendered. Handwritten
// application pages are checked by browser tests, not interpreted as Markdown.
for (const { source, target, fragment } of internalLinks) {
  if (rendered.has(target) && !rendered.get(target).ids.has(fragment)) {
    throw new Error(`Missing documentation anchor in ${source}: ${target}#${fragment}`);
  }
}

for (const [destination, html] of outputs) {
  await mkdir(posix.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}
