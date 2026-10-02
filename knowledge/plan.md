---
title: Plan
project:
  name: fancy (research) tools!
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
status: active
language: en
created: 2026-10-01
updated: 2026-10-02
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

A service page that visitors find from dhcraft.org, that shares well, loads fast on a phone and holds its claims against the linked evidence.

## Next work

1. A legal review of the privacy statement.
2. A screen reader pass over the page, see [testing](testing.md#known-limits).
3. Mirroring every content change of `index.html` in `en/index.html`.

## Open decisions and dependencies

- A real case with before and after needs the consent of the project behind it.
- Generated motif images need a tool with image generation, see [specification](specification.md#adr-010-hand-drawn-motif-instead-of-generated-images).
