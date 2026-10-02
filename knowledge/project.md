---
title: Project
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
  name: Vorlage Projekt-Wissensdokument
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/project
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-project
knowledge-sources:
  institutions:
    Digital Humanities Craft OG: https://dhcraft.org/
    GAMS, University of Graz: https://gams.uni-graz.at/
  standards:
    WCAG 2.2: https://www.w3.org/TR/WCAG22/
    Open Graph protocol: https://ogp.me/
---

"fancy (research) tools!" is a German-language service page of Digital Humanities Craft OG. It offers custom tools that speed up a concrete workflow, adaptable existing tools and the methods behind them, for research and cultural heritage institutions as well as companies and public administration. It is published at https://dhcraft.org/fancy-research-tools/, in English at https://dhcraft.org/fancy-research-tools/en/, and linked from the research software card of dhcraft.org.

## Material basis

The page builds on facts that already exist elsewhere and are cited, never invented. Provider data, client institutions and team facts come from the published DHCraft website. Tool and method facts come from each tool's repository and knowledge base. [data](data.md) lists every source.

## Context

The name comes from a remark in a chat about a colleague's prompted markup editor for an edition project. That editor showed the pattern the page sells, a tool shaped around the person doing most of the work, with corpus-wide search, consistency checks, issues at the document and a preview of the target platform. The positioning moved in one day from a showcase over a volunteer collective to a professional, research-grounded service, see [journal](journal.md).

## Purpose

Visitors are archives, museums, libraries, universities, research projects, companies and administrations with a recurring workflow and no in-house development. They should understand the offer, judge whether it fits and send a request, either as a conversation or as documents from which a first prototype is built. Billing follows the commission, per hour or as an agreed fee.

## Standards

- Markup: semantic HTML with landmarks and fragment identifiers.
- Styling: CSS with cascade layers, custom properties, OKLCH colours and `light-dark()`, inside the Baseline widely available corridor.
- Accessibility: WCAG 2.2 level AA, checked with axe.
- Licences: MIT for code, CC BY 4.0 for texts, SIL Open Font License for fonts.

The page needs no JavaScript and makes no request to third parties.

## Technical realisation

A static site served by GitHub Pages from the repository root. `index.html` is the single content source. `en/index.html` is its English counterpart. There is no build step. Details in [specification](specification.md#decisions) and [testing](testing.md).

## Scope

The page offers and explains. It does not host the tools, which run at their own addresses, and it holds no form, account or payment flow. Requests go by e-mail or telephone.

## License

Code under MIT, texts under CC BY 4.0. The DHCraft logos are all rights reserved by Digital Humanities Craft OG. Screenshots show the respective tools under their own licences.
