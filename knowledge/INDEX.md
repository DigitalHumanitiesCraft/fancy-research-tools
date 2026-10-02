---
title: Index
project:
  name: fancy (research) tools!
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
status: draft
language: en
version: 0.1
created: 2026-10-01
updated: 2026-10-02
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 5.5)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Index
  version: 0.4
  url: https://dhcraft.org/Promptotyping/promptotyping-document/index
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-index
related: [project, specification, data, design, testing, plan, handoff, journal]
---

This knowledge base serves anyone who changes the website "fancy (research) tools!", a service page of Digital Humanities Craft OG published on GitHub Pages. It covers purpose, requirements, the facts shown about each tool, the design, the checks and the working state. The schema version above is kept here once and inherited by every other document.

## Documents

| Path | Function | Routing question | Update |
|---|---|---|---|
| [project](project.md) | Charter | What is this page, for whom, from which provider? | when audience, offer or provider changes |
| [specification](specification.md) | Specification | What must the page do, and which decisions hold? | when a requirement or decision changes |
| [data](data.md) | Material | Which facts does the page state about tools and provider, and where do they come from? | whenever a tool's state, link or licence changes |
| [design](design.md) | Design | How does the page look? | when the look changes |
| [testing](testing.md) | Quality Assurance | Which checks guard a change, and how are they run? | when a check is added or changes |
| [plan](plan.md) | Planning | Which accepted work comes next, which decisions are open? | when work is accepted, done or decided |
| [handoff](handoff.md) | Handoff | Which received inputs await integration? | on receipt or processing of a point |
| [journal](journal.md) | Provenance | Which transitions were integrated, rejected or corrected? | after a coherent transition |

The action layer is `CLAUDE.md` in the repository root.

## Storage zones

- `knowledge/` holds these documents, including `handoff.md` as process inbox.
- `index.html` is the only content source of the page.
- `en/index.html` is its English counterpart, maintained by hand.
- `assets/` holds the stylesheet `style.css`, fonts and images.
- `tools/` holds the screenshot and check scripts.

## Reading paths

- Session start: INDEX, then [handoff](handoff.md), then [project](project.md), then the task document.
- Changing a tool entry: [data](data.md), then `index.html` and `en/index.html`, then the checks in [testing](testing.md).
- Changing the look: [design](design.md), then `assets/style.css`, then [testing](testing.md).

## Convention

This knowledge base follows the Promptotyping Documents convention, mirrored at https://dhcraft.org/Promptotyping/#konvention-v0.1.

## Terms

### State line

The line marked "Stand" at each tool or method. It states the maturity in the words of the tool's own knowledge base and links that base as evidence.

Used in [data](data.md), [specification](specification.md#requirements).

### Evidence link

The link "Belege" at the end of a state line, pointing to the knowledge base of the tool or method.

Used in [data](data.md).
