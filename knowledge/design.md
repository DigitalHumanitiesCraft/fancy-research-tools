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
related: [specification, project]
---

How the page looks and behaves. The page has one design, the look of dhcraft.org.

## Design stance

The page speaks to academic readers and to clients outside academia. It argues with verifiable statements, maturity labels with evidence links and named institutions, and keeps marketing gestures to the name and its exclamation mark.

## Design system

The values follow `src/styles/global.css` and the Nav, Hero, Services and Contact components of the repository DigitalHumanitiesCraft/dhcraft-site.

- Ground and colour: paper `#fdfcf8`, ink navy `#1e2749`, purple `#8a4fa3` as the one accent for links, focus, hover, state labels and step numbers. The watercolour palette of the logo (`#c06bb0`, `#e39a3b`, `#f2b95c`, `#5c9e4a`, `#a9c53d`, `#85aede`) colours entities, diagrams, quality cards and the motif. All values are OKLCH tokens in `assets/style.css` with the hex value as comment.
- Type: Sora 700 and 800 for headings and wordmark, Instrument Sans for running text and labels. All fonts are self-hosted under `assets/fonts/`.
- Shapes: pill buttons and labels, cards with a thin border on paper, the hexagon of the logo as the icon shape of tool abilities and quality claims.
- Hero: a purple radial wash, an extra-bold title with a purple second line "Werkzeuge für alle, die mit Wissen arbeiten."
- Brand: the DHCraft line logo with "fancy (research) tools!", the last word in purple. The logo appears once on the page, in the header. The watercolour DHCraft logo serves as favicon.
- Theme: light only, because dhcraft.org has no dark theme.

## Interaction patterns

1. User task: understand the offer, judge the fit, send a request by conversation or by documents for a first prototype.
2. First decision: name, the line "Agentic Engineering für alle, die mit Wissen arbeiten", request button. The right half of the hero stays empty.
3. Depth: the offer with three ways of working as cards with a hexagon icon each, then models and data and costs as two plain cards, then tools and methods with maturity and evidence, quality, who we are, client institutions, process, fit lists and the request.
4. Tool and method rows have four levels: title, one sentence, a meta row with maturity chip and ability icons, and a link row with one button and plain links (Code, Belege, Anpassen anfragen). The ability icons carry their name as hidden text for screen readers and as `title` for mouse users. A one-line legend under the tools title names every icon, so touch users can read them without hover. Abilities used: LLM-gestützt (with the model choice noted where the tool lets the user pick providers down to a local model), fachliche Prüfung, Überblick über den ganzen Bestand, lesbarer Text statt Tags, läuft im Browser, Belege bis zur Quelle. A claim that data stay in-house is not used, because the LLM-supported tools send data to the chosen model.
5. Maturity chips: Im Einsatz (green), Release Candidate (blue), Forschungsvorschau, Laufende Demo and Bestand gesichert (orange), Experiment (pink). The word carries the meaning, the colour repeats it.
6. Addresses: every section and every tool or method carries a fragment identifier.
7. Layout: on wide screens the hero keeps its text in the left half, tool rows run in two alternating columns and methods in two. On narrow screens everything stacks, the motif is left out and the section links become a swipeable row with the request link first.
8. Motion: buttons lift slightly on hover and stay still under reduced motion.
9. Language: the footer links the German and the English page.

## Earlier design variants

Until 2026-10-02 the page existed in five looks generated from one content source, Prisma as main variant and DHCraft, Edition, Labor and Raster as themes. The operator chose DHCraft as the only design, see [specification](specification.md#adr-011-one-design-after-dhcraftorg). The last state with all variants and their theme stylesheets is commit [54a6fff](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/54a6fff). The other four looks are kept as design documents in the operator's Obsidian vault.

## Motif

Until 2026-10-02 a hand-drawn SVG in the hero showed a ray split by a prism into the watercolour palette. The operator removed it, the hero now carries text and the soft wash only. The SVG remains in the page history of this repository and of the site repository.

## Quality claims

Each quality claim is either backed by all tools shown or phrased as the working method for client projects, which the provider can keep. A read-only check of the five tool repositories on 2026-10-02 found the earlier wording too strong in three places, approval before adoption of model output, a browser test of every tool and archiving in GAMS on request. The current wording states that model output, agent checks and expert confirmation stay distinguishable and only expert confirmation counts as established, names the open formats the tools actually read and write, and offers GAMS through the framework agreement. The review ability icon reads "Fachliche Prüfung im Werkzeug" instead of a check of every change.

## Generated images

The method cards get generated illustrations, see [method images](method-images.md) for the brief and [specification](specification.md#adr-012-generated-illustrations-for-the-method-cards) for the decision. Every generated image follows these rules.

- It shows a motif or the idea of a method. No tool, no interface, no person, no logo, no legible text.
- It imitates no living artist and no identifiable existing artwork.
- It is labelled on the page, in the figure caption, as generated with the model named.
- Its prompt, model and date are recorded in [data](data.md#images).

Delivery. One PNG, 2400 by 1200 pixels, saved as `assets/img/source/motif.png`, with the prompt and the model used noted beside it in `assets/img/source/motif.txt`.

## Binding to the action layer

`CLAUDE.md` applies this document through these rules.

- No eyebrows, no decorative counters, no standing explanatory prose, also where a model such as dhcraft.org uses them.
- No runtime CDN, no analytics, no third-party request, no JavaScript.
- Every published style change raises the version query of the stylesheet link, so browsers fetch the new file.
