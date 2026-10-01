# Project instructions for fancy (research) tools!

## Knowledge base

Read `knowledge/INDEX.md` first, then `knowledge/handoff.md`, then the document the task needs. Facts about tools and provider come only from `knowledge/data.md` and its sources. The look follows `knowledge/design.md`, requirements and decisions follow `knowledge/specification.md`, checks follow `knowledge/testing.md`.

## Working rules

- Edit content only in `index.html`. Run `node tools/build-variants.cjs` afterwards. Never edit `dhcraft/`, `edition/`, `labor/`, `raster/` or `varianten/` by hand.
- A new or changed tool entry carries problem, solution, state line and evidence link. Take the state from the tool's own knowledge base, record source and check date in `knowledge/data.md`, and verify every link answers HTTP 200.
- Never show third-party images under a non-commercial or unclear licence. Draw a schematic diagram instead.
- Never invent prices, promises, conditions or client names. Billing is stated as hourly or agreed fee and nothing more.
- Copy is German and follows the house writing rules, no dash or colon as connector, no trailing negation, no ornamental triad, no marketing adjectives.
- Write durable findings into the responsible knowledge document and add one journal entry per coherent transition.

## Design principles

`knowledge/design.md` is the source of values. From it follow these rules.

- No eyebrows, no decorative counters, no standing explanatory prose, in every variant, also where dhcraft.org uses kicker labels.
- No JavaScript, no runtime CDN, no analytics, no third-party request. Fonts and images are local.
- Colours as tokens in OKLCH, components consume `var()` only. A variant changes tokens and components in its theme stylesheet and leaves `style.css` to shared rules.
- Raise the version query of a stylesheet link whenever that stylesheet changes in a published state.

## Scope

The page offers and explains a service of Digital Humanities Craft OG. The tools run at their own addresses. Requests go by e-mail or telephone.

## Known limits

- Browser checks borrow an outside Playwright and axe-core installation.
- State lines are maintained by hand and drift when a tool changes.

## Tooling

### Commands

```
node tools/build-variants.cjs                      # regenerate all variants and the overview page
node --check tools/build-variants.cjs tools/shoot-variants.cjs
PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge node tools/shoot-variants.cjs
PLAYWRIGHT=/path/to/node_modules/playwright AXE=/path/to/axe-core/axe.min.js CHANNEL=msedge LINKS=1 node tools/check.cjs
```

Run `tools/check.cjs` before every push. It must end with `all checks passed`.

### Conventions

Commit messages in English, imperative mood. Stage specific paths. Pushing publishes the page through GitHub Pages and needs the operator's authorisation for the change at hand.
