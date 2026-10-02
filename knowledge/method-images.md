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

The brief for an image-generating agent that produces the illustrations of the method cards in the section "Methoden und Frameworks". Generated images are allowed there by [ADR-012](specification.md#adr-012-generated-illustrations-for-the-method-cards), and [design](design.md#generated-images) states where they may appear and how they are labelled.

## Current task

Revise the Research Mission Control infographic into a version 4 without the "Lane" boxes. Start from `assets/img/source/method-research-mission-control-infographic-v3.png` and its prompt log. Remove the thin group frames around agent and result and the label "Lane". Keep all other labels, the layout, the role exchange and delegation arrows, the direct connection from the Independent Verification Agent to the User, the undirected access lines from the Repository and the white ground. Save the result as `method-research-mission-control-infographic-v4.png` with its prompt log after [Delivery](#delivery). Change no other file and do not commit or push.

## Series in use

The page shows the series infographic-v3, chosen by the operator on 2026-10-02. Each image was produced as an edit of its version 2, and its prompt log `assets/img/source/method-<slug>-infographic-v3.txt` holds date, tool, model, reference image and the exact prompts. The earlier rounds remain as committed prompt logs, the watercolour variants `-a` and `-b` without any text and the infographic versions 1 and 2.

| Slug | Method | Colour | Only legible labels |
|---|---|---|---|
| promptotyping | Promptotyping | violet `#8a4fa3` | Preparation, Exploration, Distillation, Implementation, Project Knowledge, Review, Promptotype, Data, Artifact |
| grounded-vault | Grounded Vault | green `#5c9e4a` | Sources, Markdown representation, Distillates, Assertions, Output |
| agentic-edition-pipeline | Agentic Edition Pipeline | orange `#e39a3b` | AI Agent, Project Knowledge, Digitized Source, Transcription, Review and Correction, TEI, Reading and Review, Editorial Team |
| research-mission-control | Research Mission Control | blue `#85aede` | User, Research Orchestrator, Operational Orchestrator, Independent Verification Agent, Lane, Specialist Agents, Repository in version 3, without Lane in version 4 |

## Style

The images belong to the look of https://dhcraft.org and its watercolour hexagon logo. Every image of the series follows these rules, taken from the prompts of version 3.

- An academic watercolour infographic for a website, landscape 16:10, requested at 1600 by 1000 pixels.
- Pure white opaque ground `#ffffff`, deep navy ink lines `#1e2749`, generous empty margins, watercolour only on the motifs.
- The method colour from the table leads.
- Only the labels listed for the method are legible, all in English. No captions, legends, arrow labels, step numbers or further words.
- Methodological relations and arrow directions are correct for the method. Few document stacks, no large success ticks.
- No logos, watermarks, people, robots, screen frames, the style of a named or living artist, or an identifiable existing artwork or manuscript.

## Where the images appear

Each image sits at the top of a method card, above the method's name, maturity chip and links. The cards stand two side by side on wide screens and stack on a phone, where an image is shown at about 360 pixels wide and links to its large version. The alt text in `src/i18n/fancy.ts` of the site repository describes the labels and the flow in words, and the caption reads "Generiert mit gpt-image".

## Delivery

- Format: PNG in sRGB with an opaque white ground, the size the generator delivers without resizing or conversion.
- File: `assets/img/source/method-<slug>-infographic-v<n>.png`.
- Provenance: beside each image a text file with the same name and the extension `.txt`, holding date, tool, model and version as reported, the reference image, every exact prompt in order and the actual pixel size.
- The PNG files stay local and are kept out of Git by `.gitignore`. The text files are committed with the integration.

## Acceptance and integration

The operator accepts an image when it shows only its listed labels, no person and no logo, when its method colour leads, when its flow is correct and recognisable at 360 pixels wide, and when it fits the series. The integration then encodes the image with `tools/encode-images.cjs <png> method-<slug>` into WebP at 1440 and 720 pixels in `public/fancy-research-tools/img/` of the site repository, adjusts the alt text in `src/i18n/fancy.ts` where the labels changed and updates the image row in [data](data.md#images).
