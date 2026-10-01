# Design

## Purpose of the page

The page presents a professional service of Digital Humanities Craft OG. It offers custom tools that speed up a concrete workflow for research and cultural heritage institutions as well as companies and public administration, adaptable existing tools, and the methods and frameworks behind them. The name is "fancy (research) tools!", with "research" set back in italics and parentheses because the offer reaches beyond research.

## Content and interaction hierarchy

1. User task: understand the offer, judge whether it fits, and send a request, either as a conversation or as documents from which a first prototype is built.
2. Primary objects: the tools, the methods and frameworks, the quality claims, the process, the fit criteria and the two request paths.
3. Visible for the first decision: name, one sentence on the offer, the request button, figure 1 with its caption and the provider.
4. Optional depth: the abilities strip, which links each ability to a tool that shows it, the tools and methods with honest state and evidence links, quality, who we are, client institutions, process, fit lists, billing.
5. Addressable states: every section and every tool or method has a fragment identifier.
6. Wide screens show the hero as text plus layered figure and each tool as a two-column row. Methods sit in three columns. Narrow screens stack everything, the header keeps only the request link.

## Content sources

- Provider data, imprint, client institutions, the GAMS cooperation, team facts and target groups follow the published DHCraft website (`DigitalHumanitiesCraft/dhcraft-site`, `src/i18n/content.ts` and `src/pages/imprint.astro`), checked on 2026-10-01.
- Each tool and method links its own knowledge base under "Belege". Those knowledge bases stay the source of truth, and the line marked "Stand" is updated by hand when a state changes.
- Tools whose screenshots would show third-party images under their own licences are drawn as schematic diagrams instead, because the page advertises a paid service.
- Billing follows the operator's statement of 2026-10-01, per hour or as an agreed fee depending on the commission.

## Identity

The page combines a classic and an instrumental register on a white ground. The signature image is a prism that splits a ray into the spectrum, used as favicon and header mark.

- Ink navy comes from the DHCraft website.
- The accents form a spectrum at matched OKLCH lightness, red, orange, yellow, green, cyan, blue and violet, so the rainbow reads as one calm system. A two-pixel spectrum line under the header and the exclamation mark carry it.
- EB Garamond sets headings and the wordmark, Instrument Sans the running text, JetBrains Mono every machine-like label (state, figure numbers, tags, pane labels). All fonts are self-hosted under `assets/fonts/` under the SIL Open Font License.
- A faint measuring grid sits behind the hero.
- The watercolour DHCraft logo marks the provider in the hero and the footer.

## Rules carried from the house standard

- No eyebrows, no decorative counters, no standing explanatory prose.
- No runtime CDN, no analytics, no third-party requests. The page needs no JavaScript.
- Light and dark theme through `light-dark()`. The hero animation is skipped under reduced motion.
- The stylesheet link carries a version query, raised on every published style change, so browsers fetch the new file.
