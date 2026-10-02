---
title: Method images
project:
  name: fancy (research) tools!
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
status: draft
language: en
created: 2026-10-02
updated: 2026-10-02
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 5.5)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [design, specification, data]
---

# Method images

The brief for an image-generating agent. It produces one illustration for each of the four method cards in the section "Methoden und Frameworks". The operator decided on 2026-10-02 that these cards get generated images, see [specification](specification.md#adr-012-generated-illustrations-for-the-method-cards). Integrating the images into the page is a separate step and not part of this brief.

## Task

Generate two variants of each of the four images below, so that the operator can choose. Save every file in `assets/img/source/` under the names given in [Delivery](#delivery). Change no other file, do not convert or resize the images, and do not commit or push.

## Where the images appear

Each image sits at the top of a method card, in the place of the current SVG diagram, above the method's name and a short description. The cards stand two by two on a paper ground. On a phone they stack, and an image is shown at about 360 pixels wide, so the motif must stay readable small.

## Style

The images belong to the look of https://dhcraft.org and its watercolour hexagon logo. Every image follows these rules.

- Technique: loose watercolour washes with soft, bleeding edges on fine paper, combined with thin, precise ink lines for structure, like a scholar's annotated sketch coloured in watercolour.
- Ground: warm off-white paper `#fdfcf8`, filling the whole image, no transparency, no vignette, no frame.
- Ink: lines and outlines in deep navy `#1e2749`, never pure black.
- Shape: the regular hexagon of the logo is the recurring element. Stations, steps and nodes are hexagons.
- Colour: each image is led by its method colour from the list below. The other palette colours may appear in small touches. Palette `#8a4fa3` violet, `#5c9e4a` green, `#e39a3b` orange, `#85aede` blue, `#f2b95c` yellow, `#c06bb0` pink, `#a9c53d` lime.
- Composition: one clear idea, centred, with generous empty paper around it, at least a tenth of the width on every side. Calm and academic, no drama, no glow, no gradient sky, no 3D rendering, no photorealism.

Each image leaves out these elements.

- Text, letters, numbers or anything that reads as writing. Lines of a page are drawn as plain strokes.
- Logos, brand marks, interface screenshots, screens or devices.
- People, faces, hands or silhouettes.
- The style of a named or living artist, and any identifiable existing artwork or manuscript.

## Images

| Slug | Method | Method colour | What the method does |
|---|---|---|---|
| promptotyping | Promptotyping | violet `#8a4fa3` | develops research artefacts with AI agents in repeated rounds of preparation, exploration, distillation and implementation, all drawing on and writing back to one curated knowledge base |
| grounded-vault | Grounded Vault | green `#5c9e4a` | traces every claim of a finished text through distilled notes and full text back to the exact passage in its source, checked by validation, machine and human |
| agentic-edition-pipeline | Agentic Edition Pipeline | orange `#e39a3b` | leads a digitised manuscript through transcription and checks by the editorial team to TEI and a static reading view |
| research-mission-control | Research Mission Control | blue `#85aede` | lets three AI agents work on one shared project repository, one clarifies goals with the human, one implements, one verifies independently and reports back to the human, who directs and accepts |

### Prompt promptotyping

Watercolour illustration on warm off-white paper (#fdfcf8). In the centre a small stack of loose index cards, drawn with thin deep navy ink lines (#1e2749), the lines on the cards are plain strokes without writing. Around it four hexagons in loose violet watercolour (#8a4fa3) sit on a circular path, connected by one continuous looping brushstroke that runs clockwise from hexagon to hexagon and back to the cards, suggesting repeated rounds that return to the same knowledge base. Small touches of orange (#e39a3b) and blue (#85aede). Soft bleeding edges, fine paper grain, generous empty paper around the motif, calm and scholarly. No text, no letters, no numbers, no people, no logos, no screens. Aspect ratio 16:10.

### Prompt grounded-vault

Watercolour illustration on warm off-white paper (#fdfcf8). Five overlapping sheets of paper stacked in depth, from an old source document with a small marked passage at the back to a clean finished page at the front, outlined in thin deep navy ink lines (#1e2749), the lines on the sheets are plain strokes without writing. A single fine green thread (#5c9e4a) with small round anchor knots runs straight through all sheets and ends at the marked passage on the source. Beside the stack three small hexagons in green watercolour, the last one filled most strongly, as checks. Soft bleeding edges, fine paper grain, generous empty paper, calm and scholarly. No text, no letters, no numbers, no people, no logos, no screens. Aspect ratio 16:10.

### Prompt agentic-edition-pipeline

Watercolour illustration on warm off-white paper (#fdfcf8). A horizontal sequence from left to right, linked by a thin dashed deep navy ink line (#1e2749). On the left a weathered manuscript leaf in soft sepia and orange washes (#e39a3b) with illegible, abstract script strokes. In the middle three hexagons in orange watercolour as stations of transcription, review and encoding, the review hexagon marked by a small green tick (#5c9e4a). On the right a clean open reading page with neat plain strokes for lines. Soft bleeding edges, fine paper grain, generous empty paper, calm and scholarly. No legible text, no letters, no numbers, no people, no logos, no screens. Aspect ratio 16:10.

### Prompt research-mission-control

Watercolour illustration on warm off-white paper (#fdfcf8). Three hexagons in blue watercolour (#85aede) form a triangle around a small closed archive box drawn in thin deep navy ink lines (#1e2749), standing for one shared repository. Above the triangle, slightly apart, a fourth hexagon in violet (#8a4fa3) stands for the directing human. Fine ink arrows run from the violet hexagon to the first blue one, around the triangle from blue to blue, and from the last blue hexagon straight back up to the violet one. Soft bleeding edges, fine paper grain, generous empty paper, calm and scholarly. No text, no letters, no numbers, no people, no figures, no logos, no screens. Aspect ratio 16:10.

## Delivery

- Format: PNG in sRGB, 1600 by 1000 pixels, paper ground without transparency.
- Files: `assets/img/source/method-<slug>-a.png` and `assets/img/source/method-<slug>-b.png` for the two variants of each slug.
- Provenance: beside each image a text file with the same name and the extension `.txt`, for example `assets/img/source/method-promptotyping-a.txt`. It holds the exact prompt used, the model name and version, and the date.
- The PNG files stay local and are kept out of Git by `.gitignore`. The text files are committed later with the integration.

## Acceptance

The operator chooses one variant per method. An image is usable when it shows no writing, no person and no logo, when its method colour leads, when its idea is recognisable at 360 pixels wide, and when the four chosen images look like one series. The integration then converts the chosen images to WebP at 720 and 1440 pixels, places them in the cards, labels them in the caption as generated with the model named and records them in [data](data.md#images).
