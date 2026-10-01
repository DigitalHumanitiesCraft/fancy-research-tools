# Design

## Purpose of the page

The page presents a professional service of Digital Humanities Craft OG. It offers custom tools that speed up a concrete workflow, with a research background as the distinguishing quality, for research and cultural heritage institutions as well as companies and public administration. It also offers the existing research tools for adaptation to a project. The name is "fancy (research) tools!", with "research" set back in parentheses because the offer reaches beyond research.

## Content and interaction hierarchy

1. User task: understand the offer, judge whether it fits, and request an initial consultation.
2. Primary objects: the offer, the quality claims, the adaptable research tools, the process, the fit criteria.
3. Visible for the first decision: name, one sentence on the offer, the consultation button, the before/after illustration and the provider.
4. Optional depth: what such a tool does, the quality claims, the tools with their honest state, client institutions, process, fit lists.
5. Addressable states: every section has a fragment identifier (`#anspruch`, `#werkzeuge`, `#vorgehen`, `#fuer-wen`, `#kontakt`).
6. Wide screens show the hero as text plus layered illustration and each tool as a two-column row with screenshot. Narrow screens stack everything, the header keeps only the consultation link.

## Content sources

- Provider data, imprint, client institutions, the GAMS cooperation and the target groups follow the published DHCraft website (`DigitalHumanitiesCraft/dhcraft-site`, `src/i18n/content.ts` and `src/pages/imprint.astro`), checked on 2026-10-01.
- The tools and their state come from each tool's knowledge base and the vault hubs under `Projects/Research Tools/`, checked on 2026-10-01. Those knowledge bases stay the source of truth, and the line marked "Stand" is updated by hand when a state changes.
- viewCrafter was ended on 2026-09-29 and is not shown.
- The coOCR/HTR link points to the demo root, not to individual samples.

## Identity

Colours and fonts follow the DHCraft website, ink navy on paper with the watercolour palette as accents, Sora for display and Instrument Sans for text, self-hosted under `assets/fonts/`. The watercolour DHCraft logo marks the provider in the hero and the footer. The wordmark carries an orange-to-pink exclamation mark.

## Rules carried from the house standard

- No eyebrows, no decorative counters, no standing explanatory prose.
- No runtime CDN, no analytics, no third-party requests. The page needs no JavaScript.
- Light and dark theme through `light-dark()`. The hero animation is skipped under reduced motion.
