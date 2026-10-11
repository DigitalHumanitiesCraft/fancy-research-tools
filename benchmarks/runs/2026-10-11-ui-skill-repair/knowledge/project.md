---
title: Project
project:
  name: Fancy Research Tools
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Projekt-Wissensdokument
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/project
status: draft
language: en
created: 2026-10-10
updated: 2026-10-11
---

# Project

Fancy Research Tools is a documented and tested foundation for developing research software with Large Language Models (LLMs) and coding agents. A shared core combines inspectable code, architecture knowledge, explicit adaptation points and quality checks. Humans and agents use this foundation to develop project-specific data models, research workflows and interfaces.

## Data basis

The separate [Photograph study](../photographs/) demonstrates compact visual exploration, catalogue chronology, image inspection and comparison using forty independently sourced CC0 Cleveland Museum of Art photographs. Its data and implementation are separate from commissioned collection work. The [data contract](data.md#open-photograph-reference) records its bounded selection and provenance. A map is outside this slice because the source does not supply verified spatial roles and coordinates.

The editor starts with a frozen descriptive projection of real Schönbach correspondence metadata under CC0. Its original synthetic collection remains a regression fixture, and existing local drafts take precedence over the new default. Catalogue comparison uses real Met musical-instrument metadata. Selection, rights, transformations and interpretation are maintained in [data](data.md). Technical observations leave researcher acceptance explicit.

Source annotation supports Benndorf's 1879 letter to Schuchardt and archived NOAA/NHC discussions of Hurricane Milton from October 2024. Each case retains its own source roles, category vocabulary and notebook. The working hypothesis is close reading with anchored quotations and explicit interpretation. Source-fit reviews have declared actors and criteria. These cases do not establish disciplinary acceptance or general interdisciplinary reuse.

## Context

The repository supports understanding, building and checking research tools. Its documentation and specifications are prepared for GitHub Pages alongside runnable examples. DHCraft can also use this foundation in its project services, associated with the [existing offer](https://dhcraft.org/fancy-research-tools/). Commercial adoption does not determine the repository's requirements.

Research tools can also be pipelines, notebooks, desktop applications or server systems. Version 0.1 addresses a bounded browser workflow. teiCrafter and CorrespExplorer provide source material used by the current examples, and the gallery links their existing public applications. The [worked adaptations](../docs/customizing.md) record this material reuse. Adapting their complete editing and exploration workflows to a common core remains a candidate investigation.

## Purpose

Fancy Research Tools provides a directly adaptable starting application accompanied by worked examples and design explanations. Adopters can replace the material and develop a tool for their own research question. The operator confirmed this purpose on 2026-10-11. The public repository must contain enough guidance to support that work without access to a private Vault or the originating conversation. The [operator default profile](design.md#operator-default-profile) supplies adaptable presentation choices.

A human working with an agent can begin with a question, idea, material, method or existing workflow. Preparation, Exploration, Distillation and Implementation recur as prototype observations revise project knowledge. The development harness supplies the LLM and its tools, while runtime LLM features depend on the research task. Browser interfaces and the simplest adequate stack are the default. The core's extent will be established through contrasting adaptations.

The implemented cases examine source comparison, text annotation and metadata editing with separate schemas. Their [behavioural contracts](specification.md) define research actions and preservation requirements. The [testing record](testing.md) separates demonstrated software behaviour from research acceptance and broader reuse claims.

## Development commitments

On 2026-10-10 the operator delegated reasoned answers to five project questions and implementation of their consequences. The following qualified commitments are the resulting project decisions. They are requirements and research questions; they are not observed user outcomes.

| Question | Decision and reason | Concrete consequence |
|---|---|---|
| Should researchers without programming experience be able to develop tools with an agent? | Yes, through an assisted workflow. They can supply the research judgement while the agent makes implementation inspectable. Independent use must be demonstrated with actual participants. | A copyable start brief, a runnable small slice, plain explanations of decisions and escalation when source meaning or technical risk exceeds the available evidence. |
| Should existing tools be supported? | Yes. Research knowledge and working data already reside in tools whose contracts must survive adaptation. | Inspect and reproduce the existing workflow; preserve originals, drafts and formats; document reused, modified and replaced responsibilities. |
| Does the project include long-term maintenance? | Yes, as maintainable handover and an explicit maintenance agreement. A prototype's future cannot depend on unrecorded chat context. | Named or explicitly unassigned responsibilities, versioned data, recovery instructions, dependency baseline and evidence for later changes. No indefinite support or scheduled service is implied. |
| Are independent researchers needed before broad reuse claims? | Yes. Engineering tests and agent reviews cannot establish that other researchers understand or benefit from the tool. | Record real tasks, errors, help and interpretations with people outside implementation. The operator confirmed a formative session with an additional person and their own research question on 2026-10-11. Participant and timing remain unassigned. Limit every claim to the cases and participants actually observed. |
| Should the development method itself be investigated? | Yes. How the tool was developed and whether it serves research are different questions. | Preserve development episodes, interventions and failures; use a declared comparison and held-out task before attributing improvement to the method. |

The [start guide](../docs/getting-started.md), [adaptation and maintenance guide](../docs/customizing.md), and [development study protocol](../benchmarks/development-study-protocol.md) make these commitments actionable. The Met provenance extension is one existing-tool adaptation; the NOAA annotation case implements a bounded contrast in material and workflow. Neither establishes autonomous novice development or broad reuse across projects.

## Standards

JSON provides interchange. HTML supplies native controls and document structure. CSS supplies layout and visual tokens. TypeScript makes internal contracts explicit. These choices support inspection and adaptation, while research validity remains dependent on the project's data and methods.

## Technical implementation

The [architecture](architecture.md) uses Vite, TypeScript and browser APIs. Documentation and tools can be served as static assets. More complex deployments require an explicit architectural revision.

## Functional scope

The start page provides project orientation, the gallery presents runnable tools, and documentation supports development. Local tools keep their own research navigation and provide a return link to the gallery. Linked external applications retain their published navigation, with browser Back available after ordinary navigation. Local drafts and explicit exports preserve working state under the relevant [data contract](data.md).

Missing values remain explicit. A reviewer flag is a workflow value whose scholarly meaning must be established in each project.

## Terms

The Terms section of `knowledge/INDEX.md` in the repository defines core, reference tool, starter, collection and draft for the maintained knowledge base.

## License

Code retains the repository's [MIT license](../LICENSE). Documentation and image prompts retain [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Third-party assets retain their own notices. Adopters must establish rights for their own data and branding.
