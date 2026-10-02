# Project instructions for fancy (research) tools!

## Knowledge base

Read `knowledge/INDEX.md` first, then `knowledge/handoff.md`, then the document the task needs. Facts about tools and provider come only from `knowledge/data.md` and its sources. The look follows `knowledge/design.md`, requirements and decisions follow `knowledge/specification.md`, checks follow `knowledge/testing.md`.

## Working rules

- `index.html` holds the German content. `en/index.html` is the English page and is maintained by hand. Mirror every content change of `index.html` there in the same commit. `datenschutz/` and `en/privacy/` change together.
- A new or changed tool entry carries problem, solution, state line and evidence link. Take the state from the tool's own knowledge base, record source and check date in `knowledge/data.md`, and verify every link answers HTTP 200.
- Tool rows show real screenshots from `tools/shoot-tools.cjs` or schematic diagrams. Never show third-party images under a non-commercial or unclear licence, and never put a generated image where a screenshot belongs. Generated images follow `knowledge/design.md#generated-images`.
- Never invent prices, promises, conditions or client names. Billing is stated as hourly or agreed fee and nothing more.
- Copy is German and follows the house writing rules, no dash or colon as connector, no trailing negation, no ornamental triad, no marketing adjectives.
- Write durable findings into the responsible knowledge document and add one journal entry per coherent transition.

## Design principles

`knowledge/design.md` is the source of values. From it follow these rules.

- No eyebrows, no decorative counters, no standing explanatory prose, also where dhcraft.org uses kicker labels.
- No JavaScript, no runtime CDN, no analytics, no third-party request. Fonts and images are local.
- One design, the look of dhcraft.org, in `assets/style.css`. Colours as tokens in OKLCH, components consume `var()` only.
- Raise the version query of a stylesheet link whenever that stylesheet changes in a published state.

## Scope

The page offers and explains a service of Digital Humanities Craft OG. The tools run at their own addresses. Requests go by e-mail or telephone.

## Known limits

- Browser checks borrow an outside Playwright and axe-core installation.
- State lines are maintained by hand and drift when a tool changes.

## Tooling

### Commands

```
node --check tools/*.cjs
PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge node tools/encode-images.cjs assets/img/source/<file>.png <slug>   # WebP 1440 and 720
PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge node tools/shoot-og.cjs
PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge TEICRAFTER_SAMPLE=/path/to/teiCrafter/docs/data/editor/zbz-hersch-synthetic.xml node tools/shoot-tools.cjs
PLAYWRIGHT=/path/to/node_modules/playwright AXE=/path/to/axe-core/axe.min.js CHANNEL=msedge LINKS=1 node tools/check.cjs
```

Run `tools/check.cjs` before every push. It must end with `all checks passed`.

### Conventions

Commit messages in English, imperative mood. Stage specific paths. Pushing publishes the page through GitHub Pages and needs the operator's authorisation for the change at hand.
