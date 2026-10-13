---
title: Plan
project:
  name: Fancy Research Tools
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Plan
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/plan
status: active
language: en
created: 2026-10-10
updated: 2026-10-13
---

# Plan

The task gallery and Collection Explorer are implemented. The remaining work concerns observed research use, the prepared external-tool workflows and release acceptance under [V02-01–08](specification.md#planned-version-02-acceptance). Technical execution evidence is maintained in [Testing](testing.md#current-evidence).

## Resume in the next session

Read the action layer, [Index](INDEX.md), [handoff](handoff.md) and this queue. Inspect the actual branch and working tree before editing. Recover confirmed purpose and audience from [Project](project.md#purpose). The local entry is `/tools/`; setup and complete example tasks are in [Getting started](../docs/getting-started.md).

| Priority | Next action | Completion evidence | Dependency |
|---|---|---|---|
| 1 | Complete the Collection Explorer task review through search, qualified source inspection, image comparison and export after the [positive initial view assessment](testing.md#initial-operator-feedback-on-photographs-2026-10-13) | Actual output, interpretation and observed friction under the [UI protocol](testing.md#ui-acceptance-protocol) | Operator availability; test whether ordinal date spacing is understood |
| 2 | Complete the prepared SZD task in teiCrafter and a separate edition copy | Import, source-supported edit, downloaded/reopened XML, local edition build and comparison with the retained source | A usable native file picker or supported import path; preparation and parser checks already exist |
| 3 | Exercise local bibliographic correction and establish its propagation boundary | Original value, correction, exported patch and affected canonical outputs | Upstream Klawiter propagation gap must close before a general curation claim |
| 4 | Complete manual accessibility observations for the current reference | Keyboard and native-zoom tasks on the current state, plus real screen-reader operation | Appropriate browser and assistive technology; earlier checks retain their source limits |
| 5 | Observe an additional researcher with their own question and assess adaptation | Recorded assistance, task interpretation, output and recovery under the [development study](../benchmarks/development-study-protocol.md) | Participant, timing and continuing responsibilities remain unassigned |

New implementation follows a concrete defect or research need found in these tasks. Additional data acquisition and a shared framework require a demonstrated contribution beyond the current cases. Comparative skill effectiveness and longitudinal maintenance remain research questions.

## Status tracker

| Milestone | Implemented or observed | Remaining acceptance |
|---|---|---|
| M0 Reproducible baseline | Frozen material, lockfile, deterministic data gates, source captures and CI | Repeat affected gates when their inputs change |
| M1 Development workflow | Documented question-, material- and existing-tool entry, with bounded agent trials | Independent novice development and benefit of the method |
| M2 Material and cases | Open photograph reference, retained technical examples and prepared SZD package under [Data](data.md) | Task-specific scholarly interpretation |
| M3 Responsibility boundaries | Separate domain formats and state, selectively shared primitives under [Architecture](architecture.md#core-and-adaptation-boundaries) | Broader reuse only after observed adaptations |
| M4 Reference workflow | Collection Explorer search, chronology, image inspection, comparison and evidence export; positive initial operator assessment of the photograph view | Complete operator task assessment and representative researcher assessment |
| M5 Contrasting adaptations | Annotation and metadata correction implemented; existing external tools linked through concrete tasks | External SZD and curation paths in the queue above |
| M6 Reproduction and review | Local and Linux checks, agent reproduction and operated reviews recorded in Testing | Human design acceptance and release decision |

## Current maintenance handover

Research acceptance authority, continuing technical maintainer, deployment operator and long-term data custodian remain unassigned for this development increment. Repository ownership does not assign them. No continuing service, monitoring job or recruitment has been initiated. Record actual handover using [Customizing](../docs/customizing.md).

Use the [Data compatibility contract](data.md#investigation-exchange) before changing schemas or recovery; it owns retained legacy files and rollback limits.

## Release decision

The package remains an unreleased development version. Version 0.2 requires the applicable [acceptance criteria](specification.md#planned-version-02-acceptance), recorded technical results and an explicit decision about pending research acceptance. The package, data schemas and knowledge-document schema have independent versions. Commit and push were authorised for this implementation and knowledge refactoring. Deployment and a claim of human acceptance remain separate decisions.

## Provenance

Verdichtet on 11 October 2026 from the clean baseline [a217446](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/a217446f720282c347864dc710c8502db8d6ecbe/knowledge/plan.md). Completed implementation instructions are represented by the milestone table and their canonical contracts. Earlier review narratives and outgoing follow-ups remain traceable in that revision and the [Journal](journal.md). The queue above supersedes their historical next actions.
