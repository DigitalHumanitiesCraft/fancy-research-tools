import { mkdir, readFile, writeFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile("data/tools/catalog.json", "utf8"));
const escapeHtml = (text) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const external = (href) => href.startsWith("https://");
const link = (href, label, className = "") =>
  `<a class="${className}" href="${escapeHtml(href)}">${escapeHtml(label)}${external(href) ? '<span aria-label="external website"> ↗</span>' : ""}</a>`;
const ids = new Set();
function toolEntry(tool) {
  if (ids.has(tool.id)) throw new Error(`Duplicate gallery tool: ${tool.id}`);
  ids.add(tool.id);
  if (!/^[a-z0-9-]+\.png$/.test(tool.preview)) throw new Error("Preview must be a local PNG.");
  if (!/^(https:\/\/|\.\.\/)/.test(tool.href)) throw new Error("Invalid tool destination.");
  return `<li><article class="tool-entry" aria-labelledby="${escapeHtml(tool.id)}">
    <a class="tool-preview" href="${escapeHtml(tool.href)}" tabindex="-1" aria-hidden="true"><img src="../previews/${tool.preview}" width="1440" height="960" loading="lazy" alt="${escapeHtml(tool.alt)}"></a>
    <div class="tool-info"><h3 id="${escapeHtml(tool.id)}">${escapeHtml(tool.name)}</h3>
    <ul class="tool-facts" role="list"><li>${escapeHtml(tool.material)}</li><li>${escapeHtml(tool.location)}</li></ul>
    <div class="tool-actions">${link(tool.href, tool.action, "open-tool")}${tool.related ? link(tool.related.href, tool.related.label) : ""}</div></div>
  </article></li>`;
}
const sections = catalog.groups
  .map(
    (group) =>
      `<section aria-labelledby="${group.id}"><h2 id="${group.id}">${escapeHtml(group.title)}</h2><ul class="tool-list" role="list">${group.tools.map(toolEntry).join("\n")}</ul></section>`,
  )
  .join("\n");
const edition = catalog.edition;
await mkdir("tools", { recursive: true });
await writeFile(
  "tools/index.html",
  `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Tools. Fancy Research Tools</title><script type="module" src="../src/gallery.ts"></script></head>
<body><a class="gallery-skip-link" href="#tools">Skip to tools</a>
<header class="site-header"><a class="brand" href="../">Fancy Research Tools</a><nav aria-label="Main navigation"><a href="../">Overview</a><a href="./" aria-current="page">Tools</a><a href="../guides/getting-started.html">Documentation</a></nav></header>
<main id="tools" class="tool-gallery" tabindex="-1"><h1>Tools</h1>
<nav class="task-navigation" aria-label="Research tasks">${catalog.groups.map((group) => link(`#${group.id}`, group.title)).join("")}${link("#build-an-edition", "Build an edition")}</nav>
${sections}
<section class="edition-template" aria-labelledby="build-an-edition"><h2 id="build-an-edition">Build an edition</h2><h3>${escapeHtml(edition.name)}</h3><ol class="edition-stages">${edition.stages.map((stage) => `<li>${escapeHtml(stage)}</li>`).join("")}</ol><div class="template-actions">${link(edition.href, "Open repository template")}${link(edition.knowledge, "Setup and project knowledge")}</div></section>
</main><footer><nav aria-label="Project resources"><a href="../reference/design.html#project-examples">Sources and integration</a><a href="../concepts/">Design studies</a><a href="https://dhcraft.org/fancy-research-tools/">DHCraft</a></nav></footer></body></html>\n`,
);
console.log(`Built gallery with ${ids.size} tools and one edition template.`);
