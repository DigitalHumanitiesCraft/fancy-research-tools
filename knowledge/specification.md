---
title: Specification
project:
  name: fancy (research) tools!
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
status: draft
language: en
created: 2026-10-01
updated: 2026-10-02
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

- FR-01: The first screen names the offer, agentic engineering, in one sentence and leads to the request. Acceptance: hero with title, lede and request button, visible without scrolling at 1440 by 900.
- FR-02: Every tool and method shows function, maturity and an evidence link. Acceptance: each entry carries a maturity chip and a visible link to its evidence, the method page where that is the evidence, and every link resolves with HTTP 200.
- FR-03: A visitor can send a request in two ways. Acceptance: a conversation path with e-mail and telephone and a documents path with a prefilled e-mail, both in the section `#kontakt`.
- FR-04: Every section and every tool or method is addressable. Acceptance: each has a unique fragment identifier.
- FR-05: Ways of working, model use and billing are stated. Acceptance: the section `#angebot` names learning, building together and building for the client, says where frontier language models are used and that model and access are chosen per project, and names billing per hour, per working day or as a flat fee with the client's budget as starting point.
- FR-09: The page exists in German and English. Acceptance: `en/` carries the page in English, both link each other through `hreflang` and the footer.
- FR-10: A privacy statement is reachable from every page. Acceptance: footer link to `datenschutz/`, English courtesy translation at `en/privacy/`.
- FR-08: A shared link shows title, description and image. Acceptance: Open Graph metadata with a 1200 by 630 image and a canonical link.

### Non-functional requirements

- NFR-01: Accessibility at WCAG 2.2 level AA. Measure: axe reports no violation at 1440 and 320 pixels on every page.
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

*As the maintainer, I want to edit a tool in one place, so that the German and English pages stay consistent.*

Validation: realised through the build script on 2026-10-01.

Derivation:
- Requirement FR-06
- [testing](testing.md)

## Scope of the page

The page runs from hero over the offer with its three ways of working, models and costs, then tools, methods and frameworks, quality, who we are, process and fit to the request section and footer. Each tool row carries a screenshot, title, one sentence, maturity and ability icons, and the links open, code, evidence and request.

## Decisions

### ADR-001 Static page without JavaScript

Context. A service page needs fast loading, archivability and no consent banner.

Choice. Plain HTML and CSS served by GitHub Pages, no build step, no script.

Reason. Every interaction the page needs, anchors, e-mail and telephone links, is native.

Effect. No third-party request and no cookie, so a privacy statement can stay short.

### ADR-002 One content source, variants as themes

Superseded by [ADR-011](#adr-011-one-design-after-dhcraftorg).

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

Effect. Objekt-Bestimmung carried a diagram and Kulturpool-Demo a screenshot after its licence field was checked, until both left the page on 2026-10-02. No tool on the page currently needs a diagram.

### ADR-005 Main variant indexed, other variants hidden from search

Superseded by [ADR-011](#adr-011-one-design-after-dhcraftorg).

Choice. Every variant except the root carries `noindex`.

Reason. Identical content at several addresses would compete in search results.

### ADR-006 House rules over the dhcraft.org pattern

Context. dhcraft.org sets kicker labels above headings.

Choice. The page leaves them out.

Reason. The house rules ban eyebrows in every interface, and they rank above a visual model.

### ADR-007 Swipeable section row on phones

Context. The header had room only for the request link on narrow screens.

Choice. The section links become a horizontally swipeable row under the wordmark, request link first.

Reason. Every section stays reachable without a script-driven menu and without a second link list.

### ADR-008 Screenshots as evidence, generated images as identity

Context. Better images were wanted everywhere, including generated ones.

Choice. Tool rows show only real screenshots or schematic diagrams. Generated images appear only as a motif image, visibly labelled as generated, and never depict a tool, an interface, a person or text.

Reason. The page earns trust through evidence links. A generated image in the place of a screenshot would claim an interface that does not exist.

Amended by [ADR-012](#adr-012-generated-illustrations-for-the-method-cards), which also allows generated illustrations on the method cards.

### ADR-009 Decisions taken on the operator's behalf

Context. The operator asked on 2026-10-01 for every open decision to be taken and carried out.

Choice.
- Prisma stays the main variant. The others stay public with `noindex` and the variant switch. Superseded by [ADR-011](#adr-011-one-design-after-dhcraftorg).
- A privacy statement is published, based only on verified facts of the page.
- An English version is published under `en/`.
- The page stays at dhcraft.org, and dhcraft.org links it from its research software card.
- The date-extraction timeline and `vetmed-berichtswesen` stay off the page, because one shows internal training material and the other client reporting.
- Team and publications stay on dhcraft.org. The published L.I.S.A. article on Promptotyping is linked as evidence.
- A real case with before and after waits for the consent of the project behind it.

Reason. Each choice keeps facts verifiable and avoids publishing third-party or client material without consent.

### ADR-010 Hand-drawn motif instead of generated images

Context. Generated motif images were planned through Codex. The installed Codex CLI offers no image generation, and a paid image API needs the operator's consent.

Choice. One hand-drawn SVG motif, a ray split by a prism into the spectrum, sits in the hero.

Reason. The motif needs no labelling as generated, stays sharp at any size and weighs a few kilobytes. The prompts in [design](design.md#generated-images) remain an option for later.


### ADR-011 One design after dhcraft.org

Context. Five looks had been built for comparison. On 2026-10-02 the operator chose the look of dhcraft.org.

Choice. The DHCraft theme is merged into `assets/style.css` and is the only design. Variant directories, the overview page, the variant switch, the other theme stylesheets, their fonts and images, and `tools/build-variants.cjs` are removed. The footer keeps a language link. The other four looks are documented as design documents in the operator's vault, and commit [54a6fff](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/54a6fff) keeps their code.

Reason. The page reads as part of the provider's site, and one stylesheet without a build step is simpler to maintain.

Effect. Old variant addresses lead to the 404 page. The page is light only.

### ADR-012 Generated illustrations for the method cards

Context. The method cards carried SVG diagrams in four different visual grammars. On 2026-10-02 the operator asked for images that fit the design, produced by Codex, which can generate images.

Choice. Each method card gets one generated watercolour illustration after the brief in [method images](method-images.md). The images show the idea of a method and never a tool, an interface, a person or writing. They are labelled as generated with the model named.

Reason. Methods have no interface to photograph, so a screenshot cannot serve as evidence there, and the evidence stays in the state line and its link. An illustration in the watercolour language of the DHCraft logo ties the cards to the design.

Effect. Source PNGs stay local and out of Git, their prompts are committed. The operator chose the series infographic-v3, which carries a few English key terms, so the alt text describes each flow in words and the image links to its large version for small screens.

### ADR-013 Positioning as an agentic engineering offer

Context. The page offered custom tools and adaptable research tools. On 2026-10-02 the operator decided to present it as the offer for agentic engineering, building on an older internal concept "Prompt Engineering as a Service" and on research into terms and comparable offers. dhcraft.org already lists training and consulting on its excellence page and links this page only from its research software card.

Choice. The page is the offer for agentic engineering, and the research tools are the evidence of what it produces. A section `#angebot` after the hero names three ways of working, learning, building together and building for the client, and two blocks, models and data, and costs. Frontier language models are named as such and never by provider, open models from any origin included. They are used in two places, by coding agents that build the tool and inside the finished tool for single work steps, and model and access are chosen with the client by the kind of data. Billing is per hour, per working day or as a flat fee, starting from the client's budget, with a stop after every step. No price appears on the page. The name stays, its "(research)" already marks research as optional.

Reason. "Prompt engineering" is perceived as dated, and dhcraft.org had already replaced it with context engineering. "Agentic engineering" names the practice, the hero line sets it beside the plain audience. The concept's argument of providing paid model subscriptions no longer holds, because consumer plans of at least one provider train on chats unless the user opts out, so client data belongs to API, regional or local access. Speed claims of the concept ("days instead of weeks") are not used, after ADR-003 and because the Promptotyping method claims no general advantage in speed or cost. Reviewed code is the claim the page can back, because agent-built software has documented security and maintenance risks and the tools here carry public code, knowledge bases and a review.

Effect. Training formats stay on dhcraft.org/excellence and are linked, not repeated. Facts for billing and model use come from operator statements recorded in [data](data.md#provider). Real cases with their effort, the strongest argument that a small budget suffices, wait for the consent of the projects behind them. A workshop count is not shown, because the sources disagree and none has a list behind it.
