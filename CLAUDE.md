# Project instructions for fancy (research) tools!

The page is a subpage of dhcraft.org, built and deployed by the site repository DigitalHumanitiesCraft/digitalhumanitiescraft.github.io (local clone `dhcraft-site`). This repository is its knowledge and asset workshop, holding the knowledge base, the prompt logs of the generated method images and the scripts for images and checks. See ADR-014 in `knowledge/specification.md`.

## Knowledge base

Read `knowledge/INDEX.md` first, then `knowledge/handoff.md`, then the document the task needs. INDEX lists the storage zones of both repositories and the reading path per task.

## Where to edit what

- Copy, links, maturity and ability icons of tools and methods: `src/i18n/fancy.ts` in the site repository, after the facts in `knowledge/data.md`. German and English stand in the same file and change together.
- Look and markup: `src/components/fancy/FancyPage.astro` in the site repository, after `knowledge/design.md`.
- Privacy statement: `privacy` in `src/i18n/fancy.ts`, rendered by `src/components/fancy/FancyPrivacy.astro`.
- Screenshots, share image and encoded method images: the scripts in `tools/`, which write into `public/fancy-research-tools/img/` of the site repository.
- Method image prompts: `assets/img/source/`, after `knowledge/method-images.md`. Commit the `.txt` prompt logs, never the PNG files.
- Decisions, facts and findings: the responsible document in `knowledge/`, and one journal entry per coherent transition.

## Copy rules

The content rules CR-01 to CR-07 in `knowledge/specification.md` bind every text on the page. In short:

- Never claim that the provider reviews client code. The provider designs the context in which coding agents work, and productive use needs a professional revision and an independent review of the code.
- Present Promptotyping as one context engineering method among several, chosen per project.
- Back every claim by all tools shown, or phrase it as the working method for client projects.
- Call language models frontier language models and never name them by provider.
- State billing per hour, per working day or as a flat fee, starting from the client's budget, and show no price.
- Never invent prices, promises, conditions or client names.
- Write in a formal scholarly register, with traceability, provenance and reuse as terms, no dash or colon as connector, no trailing negation, no ornamental triad, no marketing adjectives.
- Take maturity from the tool's own knowledge base, record source and check date in `knowledge/data.md`, and verify every link answers HTTP 200.
- Tool rows show real screenshots from `tools/shoot-tools.cjs`. Generated images appear only on the method cards and follow `knowledge/design.md#generated-images`.
- Knowledge documents name third parties by role and institution, never by personal name.

## Design rules

`knowledge/design.md` is the source of values.

- No eyebrows, no decorative counters, no standing explanatory prose, also where dhcraft.org uses kicker labels.
- Colours come from site tokens or the local tokens on `main.fancy`, components consume `var()` only.
- No runtime CDN, no analytics, no third-party request in the page content.

## Checks before a push

Run in the site repository `npm run build` and `npx tsc --noEmit`, start `npx astro preview --port 4399`, then run `tools/check.cjs` from this repository with `LINKS=1`. It must end with `all checks passed`. After a change of a script in `tools/`, run `for f in tools/*.cjs; do node --check "$f" || exit 1; done`, because `node --check` reads only its first file. Commands and environment variables are in `knowledge/testing.md`.

## Git and publication

- Commit messages in English, imperative mood. Stage specific paths.
- A push to main of the site repository deploys dhcraft.org through GitHub Actions. Pushes in either repository need the operator's authorisation for the change at hand.
- GitHub Pages of this repository stays switched off.
- The earlier standalone page remains in Git history, the last published state at commit 8648a35, the design variants at commit 54a6fff. Do not restore it.
