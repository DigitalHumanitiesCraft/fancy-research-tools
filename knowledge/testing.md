---
title: Testing
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
  name: Vorlage Testing
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/testing
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-testing
related: [specification, data, design]
---

# Testing

The checks that guard a change of content, look or tooling. The repository installs no toolchain, so `tools/check.cjs` borrows an existing Playwright installation and an axe-core copy.

## Test strategy

Every change runs the syntax check and the build. A change of look or markup adds the browser checks in every variant. A change of a tool entry adds the link check of [data](data.md).

## What is guaranteed

| Proof | Claim |
|---|---|
| `node --check tools/*.cjs` | the scripts parse |
| build followed by `git status` | the generated variants match `index.html` |
| `tools/check.cjs`, axe with WCAG 2.2 AA and best-practice rules | no violation in every variant, the overview and the 404 page, at 1440 and 320 pixels, light and dark |
| `tools/check.cjs`, overflow probe | no horizontal document scroll at 320 pixels |
| `tools/check.cjs`, image probe | every image loads after scrolling through the page |
| `tools/check.cjs` with `LINKS=1` | every external link of `index.html` answers 200 |

## Acceptance

| Question | Method | Level | Evidence |
|---|---|---|---|
| Does the page read and look right? | review at desktop and phone width | operator | operator statement |
| Is the copy correct and sober? | reading against the house writing rules | operator | operator statement |
| Does the live page match the local one? | opening the published address | operator | operator statement |

## How to run

```
node --check tools/build-variants.cjs tools/shoot-variants.cjs
node tools/build-variants.cjs && git status --short     # generated files must stay unchanged after a content-neutral build
PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge node tools/shoot-variants.cjs   # overview previews and link previews
PLAYWRIGHT=/path/to/node_modules/playwright AXE=/path/to/axe-core/axe.min.js CHANNEL=msedge LINKS=1 node tools/check.cjs
```

The browser scripts expect the repository served locally, by default at http://127.0.0.1:4321. The 404 page uses absolute paths for GitHub Pages, so its stylesheet resolves only on the published site.

## Known limits

- axe covers part of the success criteria. Keyboard paths and screen readers need a manual pass, which has not run.
- The browser checks depend on an outside Playwright and axe-core installation.
- The live address is checked by the operator, see Acceptance.
