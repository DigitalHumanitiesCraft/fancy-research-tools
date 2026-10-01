---
title: Design
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
  name: Vorlage Design
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/design
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-design
related: [specification, project]
---

How the page looks and behaves in each variant. The content is the same everywhere, the variants differ only in theme.

## Design stance

The page speaks to academic readers and to clients outside academia. It argues with verifiable statements, a numbered figure, state lines with evidence and named institutions, and keeps marketing gestures to the name and its exclamation mark. Abilities link to the tool that shows them, so the abstract claim and the concrete instance stay next to each other.

## Design system

The main variant Prisma combines a classic and an instrumental register on a white ground.

- Signature image: a prism splitting a ray into the spectrum, used as favicon and header mark.
- Colour: ink navy from the DHCraft website, accents as a spectrum at matched OKLCH lightness (red, orange, yellow, green, cyan, blue, violet), carried by a two-pixel line under the header and the exclamation mark.
- Type: EB Garamond for headings and wordmark, Instrument Sans for running text, JetBrains Mono for machine-like labels such as state, figure number, tags and pane labels. All fonts are self-hosted under `assets/fonts/`.
- Texture: a faint measuring grid behind the hero.
- Provider mark: the watercolour DHCraft logo in hero and footer.
- Themes: light and dark through `light-dark()`.

## Interaction patterns

1. User task: understand the offer, judge the fit, send a request by conversation or by documents for a first prototype.
2. First decision: name, one-sentence offer, request button, figure 1 with caption, provider line.
3. Depth: abilities strip, tools and methods with state and evidence, quality, who we are, client institutions, process, fit lists, billing.
4. Addresses: every section and every tool or method carries a fragment identifier.
5. Layout: on wide screens the hero sets text beside the layered figure, tool rows run in two alternating columns and methods in three. On narrow screens everything stacks and the section links become a swipeable row with the request link first.
6. Motion: the two warning messages of figure 1 fade in once and stay still under reduced motion.
7. Variant switch: the footer of every page lists all variants and the overview and marks the current one.

## Design variants

All variants are generated from `index.html` by `tools/build-variants.cjs`. Each adds one unlayered theme stylesheet under `assets/` and carries `noindex`. The overview page `varianten/` shows a preview of each.

| Variant | Theme | Character |
|---|---|---|
| Prisma | none, root page | as described above |
| DHCraft | `theme-dhcraft.css` | the look of dhcraft.org after its `global.css` and its Nav, Hero, Services and Contact components, paper ground, watercolour palette, Sora 700 and 800, pill buttons, bordered cards, hexagon icons, line logo, purple second hero line, light only |
| Edition | `theme-edition.css` | classic book typography, EB Garamond throughout, black on white with rubric red as the only accent, small capitals for labels, square shapes |
| Labor | `theme-labor.css` | dark ground, monospace headings, luminous spectrum, stronger grid, glowing card edges |
| Raster | `theme-raster.css` | Swiss typography, one sans serif in large tight cuts, black on white, spectrum as a flat block under section titles, no rounded corners |

## Binding to the action layer

`CLAUDE.md` applies this document through these rules.

- No eyebrows, no decorative counters, no standing explanatory prose, also where a model such as dhcraft.org uses them.
- No runtime CDN, no analytics, no third-party request, no JavaScript.
- Every published style change raises the version query of the stylesheet link, so browsers fetch the new file.
