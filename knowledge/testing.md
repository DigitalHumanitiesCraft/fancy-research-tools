---
title: Testing
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
  name: Vorlage Testing
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/testing
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-testing
related: [specification, data, design]
---

# Testing

The checks that guard a change of copy, look, images or tooling. The page is built in the site repository, so its build and type checks run there, and the browser checks of `tools/check.cjs` in this repository run against the site's preview build. This repository installs no toolchain, and its scripts borrow an existing Playwright installation and an axe-core copy.

## Test strategy

Every change of the page builds the site and type-checks it. A change of copy, look or markup adds the browser checks. A change of a tool or method entry adds the link check and a reading against the [content rules](specification.md#content-rules). A change of a script in `tools/` adds the syntax check.

## What is guaranteed

| Proof | Claim |
|---|---|
| `npm run build` in the site repository | the site with the page builds |
| `npx tsc --noEmit` in the site repository | `src/i18n/fancy.ts` and the components type-check |
| `node --check tools/*.cjs` | the scripts of this repository parse |
| `tools/check.cjs`, axe with WCAG 2.2 AA and best-practice rules | no violation on the page and the privacy statement in both languages, at 1440 and 320 pixels (NFR-01) |
| `tools/check.cjs`, overflow probe | no horizontal document scroll at 320 pixels (NFR-02) |
| `tools/check.cjs`, image probe | every image loads after scrolling through the page |
| `tools/check.cjs`, keyboard pass | every tab stop on both language versions of the page and on the German privacy statement shows a focus outline, stays on screen and is not hidden under the sticky site header |
| `tools/check.cjs` with `LINKS=1` | every external link of both language versions answers HTTP 200 (FR-02) |

## Acceptance

| Question | Method | Level | Evidence |
|---|---|---|---|
| Does the page read and look right? | review at desktop and phone width | operator | operator statement |
| Does the copy hold against the content rules? | reading both languages against CR-01 to CR-07 | operator | operator statement |
| Does the live page match the preview? | opening the published address, or `tools/check.cjs` with `BASE=https://dhcraft.org` | operator | operator statement or check output |

## How to run

In the site repository:

```
npm run build
npx tsc --noEmit
npx astro preview --port 4399
```

In this repository, with the preview running:

```
node --check tools/*.cjs
PLAYWRIGHT=/path/to/node_modules/playwright AXE=/path/to/axe-core/axe.min.js CHANNEL=msedge LINKS=1 node tools/check.cjs
```

The check ends with `all checks passed` or with the count of problems and exit code 1.

Environment variables of the scripts:

- `PLAYWRIGHT`: path to an installed Playwright package.
- `AXE`: path to `axe.min.js` of an installed axe-core.
- `CHANNEL`: browser channel for Playwright, for example `msedge`.
- `BASE`: address of the site, by default `http://127.0.0.1:4399`, set to `https://dhcraft.org` to check the live pages.
- `PAGES`: comma-separated routes to check instead of the four default routes.
- `LINKS`: any value adds the external link check.
- `SITE`: root of the site repository for the image scripts, by default the sibling clone `dhcraft-site`.
- `TEICRAFTER_SAMPLE`: the synthetic sample `docs/data/editor/zbz-hersch-synthetic.xml` of a teiCrafter clone, needed by the teiCrafter recipe of `tools/shoot-tools.cjs`.

The image scripts write into `public/fancy-research-tools/img/` of the site repository:

```
PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge TEICRAFTER_SAMPLE=/path/to/zbz-hersch-synthetic.xml node tools/shoot-tools.cjs [id ...]
PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge node tools/shoot-og.cjs
PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge node tools/encode-images.cjs assets/img/source/<file>.png <slug>
```

`tools/shoot-og.cjs` renders the share image from the running preview, `tools/shoot-tools.cjs` needs network access to the live demos.

## Known limits

- axe and the keyboard pass cover part of the success criteria. A screen reader pass has not run.
- NFR-03, no third-party request from the page content, is not checked automatically.
- The browser checks depend on an outside Playwright and axe-core installation.
- The home page of dhcraft.org is left out of the checks, because it belongs to the site and has findings of its own.
