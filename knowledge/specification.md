---
title: Specification
project:
  name: fancy (research) tools!
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
status: draft
language: en
created: 2026-10-01
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 5.5)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Specification
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/specification
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-specification
related: [project, data, design, testing]
---

What the page must do and which decisions hold. Requirements and stories change with the offer, the decisions change rarely and carry their reasons.

## Requirements

### Functional requirements

- FR-01: The first screen names the offer in one sentence and leads to the request. Acceptance: hero with title, lede, request button and provider line, visible without scrolling at 1440 by 900.
- FR-02: Every tool and method shows function, state line and evidence link. Acceptance: each entry carries a "Stand" line ending in "Belege" that resolves with HTTP 200.
- FR-03: A visitor can send a request in two ways. Acceptance: a conversation path with e-mail and telephone and a documents path with a prefilled e-mail, both in the section `#kontakt`.
- FR-04: Every section and every tool or method is addressable. Acceptance: each has a unique fragment identifier.
- FR-05: The billing modes are stated. Acceptance: the request section names hourly billing and an agreed fee.
- FR-06: Every variant carries the same content. Acceptance: running the build leaves no difference in the generated directories.
- FR-07: Every page leads to every variant. Acceptance: the footer lists all variants and the overview, the current variant marked with `aria-current`.
- FR-08: A shared link shows title, description and image. Acceptance: Open Graph metadata with a 1200 by 630 image per variant and a canonical link to the main variant.

### Non-functional requirements

- NFR-01: Accessibility at WCAG 2.2 level AA. Measure: axe reports no violation at 1440 and 320 pixels in every variant.
- NFR-02: Reflow without horizontal scrolling. Measure: no document overflow at 320 pixels and at 200 percent zoom.
- NFR-03: No third-party requests and no JavaScript. Measure: every URL in `src` and `href` of stylesheets, fonts and images is relative.
- NFR-04: Copy follows the house writing rules. Measure: no dash or colon as connector, no trailing negations, no ornamental triads.

## Epics and user stories

### Epic 1: Finding the right help

#### Judge the fit

*As the head of a small archive, who carries a recurring workflow in Word, I want to see whether my case fits, so that I write only when help is plausible.*

Validation: assumption (proxy: operator), effect to be observed, resolved by the first requests received.

Derivation:
- Requirements FR-01, FR-03
- Section "Für wen" in `index.html`

#### Check what is proven

*As a researcher evaluating a tool, I want the honest state and its source, so that I can tell a prototype from an established tool.*

Validation: assumption (proxy: operator).

Derivation:
- Requirement FR-02
- Terms [State line](INDEX.md#state-line), [Evidence link](INDEX.md#evidence-link)

### Epic 2: Maintaining the page

#### Change a tool entry once

*As the maintainer, I want to edit a tool in one place, so that all variants stay consistent.*

Validation: realised through the build script on 2026-10-01.

Derivation:
- Requirement FR-06
- [testing](testing.md)

## Scope of the page

The page runs from hero over abilities, tools, methods and frameworks, quality, who we are, process and fit to the request section and footer. Each tool row carries screenshot or schematic diagram, capability tags, problem, solution, state line and the actions adapt, open and code.

## Decisions

### ADR-001 Static page without JavaScript

Context. A service page needs fast loading, archivability and no consent banner.

Choice. Plain HTML and CSS served by GitHub Pages, no build step for the main variant, no script.

Reason. Every interaction the page needs, anchors, e-mail and telephone links, is native.

Effect. No third-party request and no cookie, so a privacy statement can stay short.

### ADR-002 One content source, variants as themes

Context. Several looks were wanted for comparison without forking the copy.

Choice. `index.html` holds the content. `tools/build-variants.cjs` writes each variant with one extra unlayered theme stylesheet.

Reason. Content edits happen once, and a variant differs only where its look differs.

Effect. Generated directories must never be edited by hand, see [testing](testing.md).

### ADR-003 Honest state lines with evidence

Context. All tools are prototypes or research previews, and the page advertises a paid service.

Choice. State lines repeat the tool's own maturity statement and link its knowledge base.

Reason. A verifiable modest claim is more credible to an academic audience than an unverifiable strong one.

Effect. State lines drift when a tool changes, so [data](data.md) records the check date per entry.

### ADR-004 Schematic diagrams for third-party images

Context. Some demos show museum images under their own licences.

Choice. A tool whose demo shows images under a non-commercial or unclear licence appears with a hand-drawn diagram instead of a screenshot. A demo whose images are all Public Domain or CC0 is shown as a screenshot.

Reason. The page is commercial, and an image licence must not decide the layout of a service page.

Effect. Objekt-Bestimmung carries a diagram. Kulturpool-Demo moved to a screenshot after its licence field was checked.

### ADR-005 Main variant indexed, other variants hidden from search

Choice. Every variant except the root carries `noindex`.

Reason. Identical content at several addresses would compete in search results.

### ADR-006 House rules over the dhcraft.org pattern

Context. dhcraft.org sets kicker labels above headings.

Choice. The DHCraft variant leaves them out.

Reason. The house rules ban eyebrows in every interface, and they rank above a visual model.

### ADR-007 Swipeable section row on phones

Context. The header had room only for the request link on narrow screens.

Choice. The section links become a horizontally swipeable row under the wordmark, request link first.

Reason. Every section stays reachable without a script-driven menu and without a second link list.

### ADR-008 Screenshots as evidence, generated images as identity

Context. Better images were wanted everywhere, including generated ones.

Choice. Tool rows show only real screenshots or schematic diagrams. Generated images appear only as a motif image of a variant, visibly labelled as generated, and never depict a tool, an interface, a person or text.

Reason. The page earns trust through evidence links. A generated image in the place of a screenshot would claim an interface that does not exist.
