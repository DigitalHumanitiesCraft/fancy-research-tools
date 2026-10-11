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

Fancy Research Tools provides runnable examples and maintained contracts for developing research software with Large Language Models (LLMs) and coding agents. The foundation combines inspectable code, explicit adaptation points and quality checks. Each adaptation develops its own research task, data model and interface.

## Purpose

Researchers use the project both to carry out a concrete task and to develop or adapt a tool with a coding agent. The operator confirmed these complementary entry paths on 2026-10-11. The public repository must support both without access to a private Vault or the originating conversation. Reusable presentation choices are maintained in the [operator default profile](design.md#operator-default-profile).

Work may begin with a question, idea, material, method or existing workflow. Preparation, Exploration, Distillation and Implementation recur as observations revise project knowledge. The development harness supplies the LLM and its tools. Runtime LLM features require a separate justification in the research task. Browser interfaces and the simplest adequate stack are the default.

Research fitness and acceptance belong to the responsible human. Engineering checks, agent reviews and prepared guides provide evidence for that decision. Simulated stakeholder perspectives can propose requirements or counterexamples, which remain hypotheses until source checks or actual stakeholder assessment. Claims about independent use, broad reuse or development-method effectiveness require the [declared research observations](../benchmarks/development-study-protocol.md).

## Functional scope

Collection Explorer is the first reference tool. It supports photograph selection, chronological inspection, image viewing and comparison. The gallery organizes further entries by research task.

| Research task | Entry | Scope of the example |
|---|---|---|
| Explore collections | Collection Explorer | Runnable local tool using independently sourced open photographs |
| Capture and encode | teiCrafter | Existing application with a prepared real SZD letter exercise |
| Analyse correspondence | CorrespExplorer | Existing application with a real correspondence case |
| Review and correct | Bibliographic curation | Local Klawiter correction setup, distinguished from its public reading interface |
| Build an edition | Agentic Edition Pipeline | Repository setup using the same SZD letter package |

Catalogue comparison, source annotation and flat metadata editing remain technical examples for studying adaptation and preserving earlier work. They provide contrasting domain contracts, rather than five additional primary products. Route behaviour and compatibility requirements are maintained in [Specification](specification.md), with demonstrated and pending acceptance in [Testing](testing.md).

Version 0.1 is a static browser starter with local working state and explicit exports. Shared editing, authenticated identity, protected services and a universal plugin API require additional scope and architecture decisions. Actual adaptations determine which responsibilities belong in the shared core.

## Data basis

The reference material is public and independently sourced. The [data contract](data.md) identifies source selection, rights, transformations, uncertainty and supported formats for each case. Customer data and private project context do not belong in public examples, fixtures, documentation or commit history. Synthetic inputs remain useful for deterministic failure and boundary cases.

Collection Explorer uses Cleveland Museum of Art photographs. The SZD example connects capture and edition preparation through one letter. Technical examples use Met catalogue records, Schönbach correspondence metadata, the Benndorf letter and archived NOAA/NHC discussions. Their distinct models preserve the relevant source roles and research meanings.

## Development commitments

The operator delegated the following decisions on 2026-10-10. The commitments define how adaptations are developed and assessed. Their observable criteria are [DEV-01 through DEV-05](specification.md#development-and-handover-acceptance).

| Commitment | Reason and consequence |
|---|---|
| Assisted development is open to researchers without programming experience. | Researchers supply the task and research judgement. An agent makes implementation decisions inspectable through a runnable small slice and plain explanations. Independent use must be demonstrated with actual participants. |
| Existing tools and working material are supported. | Reproduce the original workflow, preserve its drafts and formats, and distinguish retained, modified and replaced responsibilities before adapting it. |
| Maintenance is part of handover. | Record owners or explicit vacancies, supported versions, dependencies, recovery and retirement paths. A support agreement must be explicit. No indefinite service is implied. |
| Broad reuse claims require independent researchers. | Observe relevant tasks, errors, assistance and interpretation with people outside implementation. The operator confirmed a formative session with an additional person and their own research question on 2026-10-11. Recruitment and scheduling remain in the project plan. |
| The development method is investigated separately from product usefulness. | Preserve development episodes, interventions and failures. Declare a comparator and held-out task before attributing improvement to the method. |

The [start guide](../docs/getting-started.md), [adaptation and maintenance guide](../docs/customizing.md) and [development study protocol](../benchmarks/development-study-protocol.md) provide the working procedures.

## Context

The documentation and runnable examples can be served as a static website. DHCraft can use the foundation in project services associated with the [existing offer](https://dhcraft.org/fancy-research-tools/). Commercial adoption does not determine research requirements or imply ongoing maintenance responsibility.

Research tools may also be pipelines, notebooks, desktop applications or server systems. The current browser scope supplies a bounded starting point. Integrating the full runtimes of linked applications requires an explicit adaptation, with preserved source contracts and evidence of the resulting workflow.

## Standards

JSON supplies interchange, HTML native controls and document structure, CSS layout and visual tokens, and TypeScript internal contracts. The [technical implementation](architecture.md#stack) and [data models](data.md) define how these standards apply to each case. Research validity depends on the material and method used.

## Technical implementation

The [architecture](architecture.md) separates workflow domains, recovery and rendering in a Vite/TypeScript static build. The core and its adaptation boundaries are established through implemented cases.

## Terms

The Terms section of `knowledge/INDEX.md` defines core, reference tool, starter, collection and draft.

## License

Code retains the repository's [MIT license](../LICENSE). Documentation and image prompts retain [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Third-party assets retain their source-specific notices under [Data](data.md). Adopters must establish rights for their own material and branding.
