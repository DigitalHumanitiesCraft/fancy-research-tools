# Fancy Research Tools

Fancy Research Tools is a documented and tested foundation for developing research software with Large Language Models (LLMs) and coding agents. Its core connects inspectable code, architecture knowledge, explicit adaptation points and quality checks. Humans and agents can use it to develop project-specific research workflows and interfaces.

The unreleased browser starter includes public guides, maintained specifications and runnable examples. Its tools compare museum catalogue records, edit real correspondence metadata and annotate a historical letter or archived forecast discussions. The gallery also connects existing research tools through their own public interfaces. The [current plan](knowledge/plan.md#resume-in-the-next-session) distinguishes implemented work, engineering evidence and remaining researcher acceptance.

## Start

The start page leads to the tool gallery and documentation. Gallery categories follow research activities. Each entry names its material and opens either a bundled workspace or an existing external tool.

Compare collection records at `pilot/` supports catalogue search, source comparison, notes and investigation export/reopen. Each comparison value links to an addressable source view with its original fields, mapping and technical checks. [Source provenance](data/met-instruments/README.md) defines their scope. New exports include field evidence in version 2; exact version 1 files remain readable.

Edit collection records at `tool/` starts with five [Schönbach correspondence descriptions](data/schoenbach/README.md) already used by CorrespExplorer. The original CMIF values remain visible beside working metadata. Existing schema version 1 drafts and imports keep their data and storage keys. The collection is a documented descriptive projection, and exports do not recreate the full TEI source.

Annotate a letter at `letters/` uses the [Benndorf letter transcription supplied with teiCrafter](data/hsa-letter/README.md). Researchers anchor quotations and record interpretations, creators and source-fit reviews separately from the historical author and modern editor. Annotate forecast discussions at `annotations/` retains the two frozen NOAA/NHC Milton discussions from October 2024 and their existing notebook format. These are archived research sources. Each annotation case keeps its own sources, categories and local draft.

```sh
npm ci
npm run dev
```

Open the development URL and choose Tools to inspect the gallery. Run `npm run build` to generate the complete static site. Follow [Getting started](docs/getting-started.md) to create a project or exercise the research workflows.

## Continue development

Read [the current plan](knowledge/plan.md#resume-in-the-next-session) for the next task and [Testing](knowledge/testing.md) for evidence and its source revision. Inspect Git status and preserve any local changes before resuming.

## Adapt

Read [project purpose](knowledge/project.md), [requirements](knowledge/specification.md) and the [customization guide](docs/customizing.md). Canonical knowledge lives in `knowledge/`. Public guides live in `docs/`, and selected knowledge files feed the documentation build.

The examples have separate data contracts and local drafts. Their explicit JSON exports provide portable copies. The [worked annotation adaptation](docs/customizing.md#contrasting-text-annotation) records shared and replaced responsibilities. Additional research settings require their own material rules and acceptance evidence.

The [five project commitments](knowledge/project.md#development-commitments) cover assisted development without programming experience, adaptation of existing tools, maintainable handover, independent researcher evidence and investigation of the development method. The guides provide a copyable start brief and maintenance record. The [development study protocol](benchmarks/development-study-protocol.md) distinguishes prepared procedures, agent-only trials and actual participant results. No independent novice-use or general-reuse claim follows from this implementation.

## Verify

```sh
npm run check
npm run check:data
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Actual evidence and remaining acceptance work belong in [Testing](knowledge/testing.md). The presence of these commands does not imply a published release or deployment.

## History and commercial offer

This repository previously held the standalone “fancy (research) tools!” offer page. On 2026-10-03 that page, its knowledge base, image prompts and scripts moved to [the DHCraft site repository](https://github.com/DigitalHumanitiesCraft/digitalhumanitiescraft.github.io), under `knowledge/fancy-research-tools/` and `scripts/fancy-research-tools/`. The offer remains at [dhcraft.org/fancy-research-tools](https://dhcraft.org/fancy-research-tools/) and its [English version](https://dhcraft.org/en/fancy-research-tools/).

The existing Git history preserves the earlier standalone page, its last published state at commit `8648a35` and the five design variants at commit `54a6fff`. The repository now develops a reusable foundation for research-tool development. DHCraft can use it in project work associated with that offer.

## License

Code is available under the [MIT License](LICENSE). Project-authored documentation and image prompts are available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Bundled research material retains the rights and source notices recorded in the [data contract](knowledge/data.md). Third-party fonts retain their supplied licenses. Customer data and branding require their own rights assessment.
