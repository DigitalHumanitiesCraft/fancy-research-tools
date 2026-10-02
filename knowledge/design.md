---
title: Design
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
  name: Vorlage Design
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/design
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-design
related: [specification, project, method-images]
---

How the page looks and behaves as built in the dhcraft.org site, where `src/components/fancy/FancyPage.astro` renders it with scoped styles inside the site's layout, navigation and footer.

## Design stance

The page speaks to academic readers and to clients outside academia. It argues with verifiable statements, and maturity chips with evidence links, and keeps marketing gestures to the name and its exclamation mark.

## Design system

The page uses the tokens of the site and adds local ones only where the site has none.

- Site tokens from `src/styles/global.css`: paper `--paper` `#fdfcf8`, ink navy `--ink` `#1e2749`, purple `--purple` `#8a4fa3` as the one accent for links, focus, buttons, ability icons and step numbers, and the watercolour palette of the logo, `--pink`, `--green`, `--lime`, `--orange`, `--gold` and `--blue` with their deep variants. Fonts are `--font-display` (Sora) for headings and `--font-body` (Instrument Sans) for running text, bundled by the site.
- Local tokens on `main.fancy`: rule and muted text colours, a white raised surface, the purple hero wash, radii, a reading measure, a shadow, a fluid type scale from `--step--1` to `--step-3` and a fluid spacing scale from `--space-xs` to `--space-section`.
- Shapes: pill buttons and chips, cards with a thin border on paper or white, and the hexagon of the logo as the icon shape, purple for ability icons and navy for the offer and principle icons.
- Hero: a purple radial wash and an extra-bold title "fancy (research) tools!" with a purple exclamation mark and the purple line "Agentic Engineering für alle, die mit Wissen arbeiten." The right half stays empty.
- Theme: light only, because dhcraft.org has no dark theme.
- Brand: the logo, wordmark and favicon of the site. The page carries no logo of its own.

## Interaction patterns

1. User task: understand the offer, judge the fit, send a request by conversation or by documents for a first prototype.
2. First decision: title, line, lede and the buttons "Projekt anfragen" and "Unser Angebot".
3. Depth: the offer cards Lernen, Gemeinsam entwickeln and Im Auftrag entwickeln with a hexagon icon each, then the plain blocks Modelle und Daten and Kosten, then tools and methods with maturity and evidence, the principles, who we are, process, fit lists and the request. The section order is listed in [specification](specification.md#scope-of-the-page).
4. Tool rows have four levels, the title, one sentence, a meta row with [maturity chip](INDEX.md#maturity-chip) and [ability icons](INDEX.md#ability-icon), and a link row with the button Werkzeug öffnen and the plain links Code, Belege and Anpassen anfragen. Method cards have the same levels below their image, with their links, the first as a button.
5. Ability icons carry their name as hidden text for screen readers and as `title` for mouse users. A one-line legend under the tools title names every icon, so touch users can read them without hover.
6. Maturity chips: Im Einsatz green, Release Candidate blue, Forschungsvorschau, Laufende Demo and Bestand gesichert orange, Experiment pink. The word carries the meaning, the colour repeats it.
7. Principles are disclosure elements. The title with its icon stays visible, the text opens on demand and prints open.
8. Layout: each tool row places screenshot and text side by side once the row is wider than 52rem, alternating sides, and stacks them below. Offers, methods and principles run in grids that fill as many columns as fit. The site navigation folds into a menu button below 1120 pixels.
9. Method images link to their large version, so small screens can open the infographic at full size.
10. Motion: buttons lift slightly on hover only when the user allows motion.
11. Language: the site navigation switches between the German and the English page.

## Principles

The section `#qualitaet` is titled "Grundsätze" and holds the items Projektwissen und Methode, Rahmen für Coding-Agenten, Ausgewiesener Reifegrad, Offene Formate, Fachliche Kontrolle and Übergabe. They follow the [content rules](specification.md#content-rules) and say the following.

- The provider first understands the project, its question, data and workflows, records this in a project knowledge base versioned with the code, and chooses the context engineering method from it, Promptotyping being one of several.
- The provider designs the frame in which coding agents work, knowledge base, precise requirements, sample data from the client's holdings and automated tests that the agents run themselves. The page names no code review by the provider, because the provider does not review client code.
- Results are prototypes and research tools with declared maturity. Productive use, for example with sensitive data or many users, needs a professional revision and an independent review of the code.
- Results lie in open, documented formats, TEI, PAGE XML, METS/MODS, JSON-LD or CSV by material, with IIIF for images.
- For content produced with Large Language Models it stays visible whether it was machine-generated, checked by an agent or confirmed by the client's experts, and only expert-confirmed content counts as established.
- The client receives the full source code and the knowledge base. Long-term archiving of research data is offered in the certified repository GAMS.

### History of the quality claims

Until 2026-10-02 the section was titled Qualität and made quality claims. A read-only check of the five tool repositories on that day found three claims too strong, approval before adoption of model output, a browser test of every tool and archiving in GAMS on request. The wording was narrowed to what all tools back or to the working method for client projects. The operator then corrected two further points, the provider does not review code and Promptotyping is one method among several, and asked for a formal register. The section became Grundsätze. The [journal](journal.md) records both steps.

## Generated images

Generated images appear only on the method cards, under [ADR-012](specification.md#adr-012-generated-illustrations-for-the-method-cards). Tool rows show real screenshots, or a schematic diagram where a demo's image licence forbids a screenshot ([ADR-004](specification.md#adr-004-schematic-diagrams-for-third-party-images)). Every generated image is labelled in its caption as generated with the model named, its prompt log is committed under `assets/img/source/`, and its row in [data](data.md#images) names model and date. Style, prompts and delivery follow [method images](method-images.md).

## Design history

- Until 2026-10-02 the standalone page existed in five looks, Prisma as main variant and DHCraft, Edition, Labor and Raster as themes. The operator chose the DHCraft look ([ADR-011](specification.md#adr-011-one-design-after-dhcraftorg)). Commit [54a6fff](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/54a6fff) keeps all variants, and the other four looks are kept as design documents in the operator's vault.
- A hand-drawn SVG prism splitting a ray into the watercolour palette sat in the hero until the operator removed it on 2026-10-02 ([ADR-010](specification.md#adr-010-hand-drawn-motif-instead-of-generated-images)).
- The standalone stylesheet with cascade layers and OKLCH tokens was ported into the scoped styles of the site component on the move into the site ([ADR-014](specification.md#adr-014-the-page-moves-into-the-dhcraftorg-site)). Its last published state is commit [8648a35](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/8648a35).

## Binding to the action layer

`CLAUDE.md` applies this document through these rules.

- No eyebrows, no decorative counters, no standing explanatory prose, also where a model such as dhcraft.org uses them ([ADR-006](specification.md#adr-006-house-rules-over-the-dhcraftorg-pattern)).
- Colours come from site tokens or the local tokens on `main.fancy`. A new token goes to the page root unless the site needs it too.
- No runtime CDN, no analytics and no third-party request in the page content.
