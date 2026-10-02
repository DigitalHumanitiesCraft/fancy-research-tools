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
related: [project, specification, data, design, method-images, testing, plan, handoff, journal]
---

This knowledge base serves anyone who changes "fancy (research) tools!", the agentic engineering offer of Digital Humanities Craft OG, published as a subpage of dhcraft.org. The page is built and deployed by the dhcraft.org site repository. This repository holds the knowledge about the page, the prompt logs of its generated images and the scripts that retake its images and check it. The schema version above is kept here once and inherited by every other document.

## Documents

| Path | Function | Routing question | Update |
|---|---|---|---|
| [project](project.md) | Charter | What is this page, for whom, from which provider, and where does it live? | when audience, offer, provider or location changes |
| [specification](specification.md) | Specification | What must the page do, which rules hold for its copy, and which decisions stand? | when a requirement or decision changes |
| [data](data.md) | Material | Which facts does the page state about provider, tools, methods and images, and where do they come from? | whenever a tool's state, link, licence or image changes |
| [design](design.md) | Design | How does the page look and behave, and what does the principles section say? | when the look or the principles change |
| [method images](method-images.md) | Brief | Which images does an image-generating agent produce for the method cards, in which style, and where does it save them? | when a method, the image style or an image task changes |
| [testing](testing.md) | Quality Assurance | Which checks guard a change, and how are they run against the site? | when a check is added or changes |
| [plan](plan.md) | Planning | Which accepted work comes next, which points are open? | when work is accepted, done or decided |
| [handoff](handoff.md) | Handoff | Which received inputs await integration? | on receipt or processing of a point |
| [journal](journal.md) | Provenance | Which transitions were integrated, rejected or corrected? | after a coherent transition |

The action layer is `CLAUDE.md` in the repository root. `AGENTS.md` points Codex to it and to the method image brief.

## Storage zones

This repository, DigitalHumanitiesCraft/fancy-research-tools:

- `knowledge/` holds these documents, including `handoff.md` as process inbox.
- `assets/img/source/` holds the prompt logs (`*.txt`) of the generated method images. The source PNGs beside them stay local and are kept out of Git by `.gitignore`.
- `tools/` holds the scripts that take the tool screenshots, encode chosen images, render the share image and run the browser checks. They write into the site repository and check its preview build, see [testing](testing.md).

The site repository, DigitalHumanitiesCraft/digitalhumanitiescraft.github.io, cloned locally as `dhcraft-site`:

- `src/i18n/fancy.ts` holds all copy in German and English, the structured data of tools and methods, the privacy statements and the routes.
- `src/components/fancy/FancyPage.astro` renders the page with its scoped styles, `src/components/fancy/FancyPrivacy.astro` the privacy statement.
- `src/pages/fancy-research-tools/` and `src/pages/en/fancy-research-tools/` hold the route files.
- `public/fancy-research-tools/img/` holds the published screenshots, method images and share image.
- `astro.config.mjs` holds the redirects from the former English addresses, `src/components/Nav.astro` the navigation item "Agentic Engineering".

Git history of this repository keeps the earlier standalone page. Commit [8648a35](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/8648a35) is its last published state, commit [54a6fff](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/54a6fff) holds the five design variants.

## Reading paths

- Session start: INDEX, then [handoff](handoff.md), then [project](project.md), then the task document.
- Changing copy or a tool or method entry: [data](data.md) and the copy rules in [specification](specification.md#content-rules), then `src/i18n/fancy.ts` in the site repository, then the checks in [testing](testing.md).
- Changing the look: [design](design.md), then `src/components/fancy/FancyPage.astro` in the site repository, then [testing](testing.md).
- Retaking screenshots or the share image: [testing](testing.md#how-to-run) and the scripts in `tools/`, then the image rows in [data](data.md#images).
- Generating or replacing a method image: [method images](method-images.md), then [data](data.md#images).
- Understanding why a rule exists: the decisions in [specification](specification.md#decisions), then [journal](journal.md).

## Convention

This knowledge base follows the Promptotyping Documents convention, kept in the operator's vault and mirrored at https://dhcraft.org/Promptotyping/#konvention-v0.1.

## Terms

### Ability icon

A small purple hexagon icon at a tool that names one ability, such as LLM-gestützt or Fachliche Prüfung im Werkzeug. Its name is hidden text for screen readers and a `title` for mouse users, and a legend under the tools title names every icon. An ability is shown only where the tool has it.

Used in [design](design.md#interaction-patterns), [data](data.md#tools).

### Evidence link

The link "Belege" at a tool or method, pointing to the knowledge base or status document of that tool or method. Where a method page or article is itself the evidence, the method links it instead.

Used in [data](data.md), [specification](specification.md#requirements).

### Maturity chip

The one-word label at each tool and method, such as Forschungsvorschau or Im Einsatz, that states its maturity in the terms of its own knowledge base. The word carries the meaning, the colour repeats it. It replaced the earlier state line on 2026-10-02.

Used in [data](data.md), [design](design.md#interaction-patterns), [specification](specification.md#requirements).
