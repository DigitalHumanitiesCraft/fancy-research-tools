# Fancy Research Tools

Fancy Research Tools is a documented and tested foundation for developing research software with Large Language Models (LLMs) and coding agents. Its core connects inspectable code, architecture knowledge, explicit adaptation points and quality checks. Humans and agents can use it to develop project-specific research workflows and interfaces.

The unreleased browser starter includes public guides, maintained specifications and runnable examples. Its first reference tool is Collection Explorer, using forty openly licensed Cleveland Museum of Art photographs. The gallery organizes further work by capture, analysis, correction and edition building. Existing tools retain their own interfaces and setup requirements. Earlier comparison, metadata and annotation implementations remain available as technical examples in the development guide. The [current plan](knowledge/plan.md#resume-in-the-next-session) distinguishes implemented work, engineering evidence and remaining researcher acceptance.

## Start

Start with Collection Explorer at `photographs/`: search historical photographs, follow their qualified catalogue chronology, inspect images and retain up to four records for comparison and evidence export. Its [source and rights record](data/photographs/README.md) documents the independent open sample. It has no map because the source does not establish suitable geographic relations.

The gallery leads with the runnable Collection Explorer. Its other task entries distinguish existing applications from guided local setup. [Getting started](docs/getting-started.md) covers teiCrafter, correspondence analysis, bibliographic correction and the SZD edition example. The [technical examples](docs/getting-started.md#technical-examples) retain the earlier catalogue, metadata and annotation routes, draft formats and reproducible test cases.

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
