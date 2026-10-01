---
title: Plan
project:
  name: fancy (research) tools!
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
status: active
language: en
created: 2026-10-01
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 5.5)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Plan
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/plan
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-plan
related: [specification, testing, journal]
---

The accepted next work and the decisions it waits on. Decisions taken move into [specification](specification.md#decisions), finished work into [journal](journal.md).

## Target

A service page that visitors find from dhcraft.org, that shares well, loads fast on a phone and holds its claims against the linked evidence, in the variant the operator chooses.

## Optimisation round across all variants

Accepted by the operator on 2026-10-01. Changes in `index.html` and `assets/style.css` reach every variant, theme changes one.

1. Shared content: e-mail address as copyable text beside the mail links, a one-sentence caption for figure 1, state lines that lead with what works.
2. Sharing: Open Graph and description metadata with a preview image per variant, a canonical link to the main variant.
3. Speed: screenshots as WebP in several widths with `srcset`, the DHCraft logo at display size.
4. Navigation on phones: a section menu that works without JavaScript.
5. Hygiene: a 404 page, print rules that match the current markup, removal of leftover rules.
6. Variant polish: per-theme review of contrast, spacing and the header mark.
7. Checks: the browser checks of [testing](testing.md) as a script in `tools/`.

## Open decisions and dependencies

- Which variant becomes the main page, and whether the others stay public.
- A privacy statement, which dhcraft.org also lacks.
- An English version.
- A real case with before and after, which needs the consent of the project behind it.
- Names and photos of the team and a list of publications and talks.
- A licence and a neutral title for the date-extraction timeline, and a Pages site for `vetmed-berichtswesen`, before either can appear.
- A link to the page from dhcraft.org, a change in the repository of the DHCraft website.
- Own domain or the address under dhcraft.org.
