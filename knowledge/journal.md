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
