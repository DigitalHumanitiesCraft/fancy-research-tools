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

## Generated images

One motif runs through every variant, light that splits and becomes visible, as an image for tools that make knowledge visible. Each variant renders it in its own register. The images are produced by a Codex session with image generation and integrated afterwards as a labelled figure that the build swaps per variant.

Rules for every generated image.

- It shows the motif only. No tool, no interface, no person, no logo, no legible text.
- It imitates no living artist and no identifiable existing artwork.
- It is labelled on the page, in the figure caption, as generated with the model named.
- Its prompt, model and date are recorded in [data](data.md#images).

Delivery. One PNG per variant, 2400 by 1200 pixels, saved as `assets/img/source/motif-<slug>.png`, with the prompt and the model used noted beside it in `assets/img/source/motif-<slug>.txt`.

| Slug | Variant | Prompt |
|---|---|---|
| prisma | Prisma | Studio photograph of a clear triangular glass prism on a seamless white surface. A thin beam of white light enters from the left and leaves the prism as a crisp, evenly spaced spectrum of red, orange, yellow, green, cyan, blue and violet that fans out to the right across the white surface. Soft shadow, high-key light, precise and calm scientific mood, generous empty white space in the left third. No text, no logos, no people. Wide format 2:1. |
| edition | Edition | Copperplate engraving in the manner of a seventeenth-century scientific book illustration, showing the classic prism experiment, a darkened room, a small round hole in a window shutter, a beam of light passing through a triangular glass prism and spreading into a band on the opposite wall. Fine black hatching on white paper, the refracted band and a few single reference letters in rubric red, nothing else coloured. Generous margins, no modern objects, no words. Wide format 2:1. |
| labor | Labor | Night photograph of an optical laboratory bench, a precision glass prism on a black breadboard, a laser-thin white beam splitting into a luminous spectrum, faint measuring grid lines projected onto a dark navy surface, cyan and violet glow, shallow depth of field, clean and quiet, no people, no text. Wide format 2:1. |
| raster | Raster | Poster in the Swiss International Typographic Style, flat geometric composition on white, one black equilateral triangle, one thin black line entering it from the left, seven flat parallel colour bands in red, orange, yellow, green, cyan, blue and violet leaving it to the right at a strict angle, strong underlying grid, large white space, no gradients, no shadows, no text. Wide format 2:1. |

The DHCraft variant uses the existing watercolour hexagon of the DHCraft logo and needs no generated image.

## Binding to the action layer

`CLAUDE.md` applies this document through these rules.

- No eyebrows, no decorative counters, no standing explanatory prose, also where a model such as dhcraft.org uses them.
- No runtime CDN, no analytics, no third-party request, no JavaScript.
- Every published style change raises the version query of the stylesheet link, so browsers fetch the new file.
