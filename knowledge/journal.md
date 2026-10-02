---
title: Journal
project:
  name: fancy (research) tools!
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: active
language: en
created: 2026-10-01
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 5.5)
template:
  name: Vorlage Journal
  version: 0.4
  url: https://dhcraft.org/Promptotyping/promptotyping-document/journal
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-journal
related: [project, specification, handoff]
---

# Journal

The curated backward-looking provenance index of the project. Current facts and rules stand in the responsible documents, future work in [plan](plan.md), open inputs in [handoff](handoff.md).

## Entries

### 2026-10-01 integrated Positioning as a DHCraft service

- Source: operator instructions in the founding session, starting from a chat remark about a colleague's prompted markup editor
- Target: [project](project.md), [specification](specification.md)
- Result: a professional, research-grounded service of Digital Humanities Craft OG for research, cultural heritage, companies and administration, named "fancy (research) tools!", with two request paths and billing per hour or agreed fee.

### 2026-10-01 rejected Showcase and volunteer collective

- Source: first two drafts of the same session, commits squashed before publication
- Target: [project](project.md)
- Reason: the operator chose a professional service. The showcase lacked an offer, the collective conflicted with paid DHCraft work.

### 2026-10-01 integrated Tools from a repository sweep

- Source: sweep of the public repositories of DigitalHumanitiesCraft and chpollin with live checks and screenshots
- Target: [data](data.md), `index.html`
- Result: three tools added, candidates without licence, without Pages site, with open rights questions or ended are listed in data.md with reasons.

### 2026-10-01 integrated Prism identity and design variants

- Source: operator requests for a white, academic look with spectrum accents, then for a dhcraft.org variant and further variants
- Target: [design](design.md), [specification](specification.md#adr-002-one-content-source-variants-as-themes)
- Result: main variant Prisma plus DHCraft, Edition, Labor and Raster, generated from one content source, with an overview page.

### 2026-10-01 integrated Knowledge base after the Promptotyping convention

- Source: Konvention Promptotyping Documents and its templates in the vault
- Target: all documents in `knowledge/`, `CLAUDE.md`
- Result: index, project, specification, data, design, testing, plan, handoff and journal with the required frontmatter. The plan omits the status tracker of its template, because the global instructions ban status markers in notes.

### 2026-10-01 integrated Optimisation round across all variants

- Source: operator request to improve every variant and to reach every design from the start page
- Target: `index.html`, `assets/style.css`, `tools/`, [specification](specification.md), [design](design.md), [testing](testing.md)
- Result: variant switch in every footer, copyable e-mail address, shorter figure caption, state lines leading with what works, Open Graph metadata and link previews per variant, WebP screenshots with `srcset`, a smaller provider logo, a swipeable section row on phones, a 404 page, updated print rules and `tools/check.cjs` as a repeatable check run.

### 2026-10-01 integrated Sharper screenshots and the image rule

- Source: operator request for good screenshots everywhere and for style-fitting generated images, to be produced by Codex
- Target: `tools/shoot-tools.cjs`, [data](data.md#images), [specification](specification.md#adr-008-screenshots-as-evidence-generated-images-as-identity), [design](design.md#generated-images), `AGENTS.md`
- Result: tool screenshots retaken at double pixel density by a repeatable script, Kulturpool-Demo shown as a real screenshot after its licence field was checked, generated images limited to a labelled motif per variant with prompts ready for Codex.

### 2026-10-01 integrated Decisions taken on the operator's behalf

- Source: operator instruction to take every open decision and carry it out
- Target: [specification](specification.md#adr-009-decisions-taken-on-the-operators-behalf), [plan](plan.md), `en/`, `datenschutz/`, the DHCraft website repository
- Result: Prisma remains the main variant, a privacy statement and an English version are published, dhcraft.org links the page, the L.I.S.A. article is linked as evidence, the keyboard pass joined `tools/check.cjs`.

### 2026-10-01 rejected Generated motif images through Codex

- Source: operator request to generate images with Codex
- Target: [design](design.md#motif)
- Reason: the installed Codex CLI offers no image generation, and a paid image API needs consent. A hand-drawn SVG motif styled per theme took its place, see [specification](specification.md#adr-010-hand-drawn-motif-instead-of-generated-images).

### 2026-10-02 integrated One design after dhcraft.org

- Source: operator decision to keep the dhcraft.org look and to keep the other designs as vault knowledge
- Target: `assets/style.css`, all pages, `tools/`, [design](design.md), [specification](specification.md#adr-011-one-design-after-dhcraftorg)
- Result: the DHCraft theme is merged into the only stylesheet, variants, overview, switch, build script and unused fonts are removed, the watercolour logo became the favicon. Prisma, Edition, Labor and Raster are documented as design documents in the vault, their code stays in commit 54a6fff.

### 2026-10-02 integrated Tool selection narrowed, Research Mission Control added

- Source: operator decision to drop three tools and to add Research Mission Control to the methods
- Target: `index.html`, `en/index.html`, `assets/style.css`, `tools/shoot-tools.cjs`, [data](data.md)
- Result: Wissensbilanz-Dashboard, Kulturpool-Demo and Objekt-Bestimmung left the page with their images and diagram styles. Research Mission Control joined as fourth method with a diagram and the state of its own README, and the methods grid runs in two columns.

### 2026-10-02 integrated Brief for generated method images

- Source: operator request for images on the four method cards that fit the design, generated by Codex
- Target: [method images](method-images.md), [specification](specification.md#adr-012-generated-illustrations-for-the-method-cards), [design](design.md#generated-images), `AGENTS.md`, `.gitignore`
- Result: a brief with style, palette, one prompt per method, file names under `assets/img/source/` and acceptance criteria. Generated illustrations on the method cards are allowed by ADR-012.

### 2026-10-02 integrated SZD-HTR and the Stefan Zweig Bibliography

- Source: operator decision to add both tools, reversing their earlier exclusion
- Target: `index.html`, `en/index.html`, `tools/shoot-tools.cjs`, [data](data.md)
- Result: SZD-HTR is shown as the tool for transcribing a whole collection with checking tiers, distinct from the interactive coOCR/HTR, with a screenshot of its statistics view that shows no facsimile. The rescued bibliography is shown as a data rescue with source-bound statements. State lines follow each repository's own status.

### 2026-10-02 integrated Condensed German page with method illustrations

- Source: operator request for less text, symbols instead of prose and images that fit the design
- Target: `index.html`, `assets/style.css`, `tools/encode-images.cjs`, [design](design.md#interaction-patterns), [data](data.md#images)
- Result: visible text roughly halved by one-sentence solutions, ability icons, maturity chips and `<details>` for state and evidence. The method cards show the generated infographic-v3 series. The English page follows after the operator has reviewed the German draft.

### 2026-10-02 integrated Slimmer rows and the prism in the hero

- Source: operator review of the live page, asking for fewer levels per tool, one logo, no abilities section and correct ability claims
- Target: `index.html`, `assets/style.css`, [design](design.md#interaction-patterns), [specification](specification.md)
- Result: the schematic letter figure and the provider line left the hero, the prism motif moved there. The abilities strip became a one-line icon legend. Tool and method rows have four levels with icon-only abilities and plain links. "Daten bleiben im Haus" was replaced by "LLM-gestützt" and "Läuft im Browser", because coOCR/HTR, teiCrafter, SZD-HTR and the bibliography pipeline send data to a model, coOCR/HTR and teiCrafter with a selectable provider including a local one.

