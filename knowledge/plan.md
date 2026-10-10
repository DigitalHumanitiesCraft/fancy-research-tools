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
updated: 2026-10-10
---

# Plan

The current candidate revises the rejected gallery and local workspaces using the operator's existing projects. The gallery groups activities and links existing public tools; the local editor starts with Schönbach correspondence, annotation includes a Benndorf letter, and catalogue comparison uses a compact table with addressable source evidence. The preceding negative design assessment remains recorded. The next step is the operator's review of this concrete revision. Research acceptance, screen-reader operation and comparative evaluation of the development method remain separate work.

## Resume in the next session

Read `AGENTS.md`, [Index](INDEX.md), [handoff](handoff.md), this plan and the [CI reflow correction](testing.md#ci-reflow-correction-2026-10-10). The [project-tool revision](testing.md#project-tool-revision-2026-10-10) retains the preceding full software checks. Inspect Git status before editing and preserve any local changes. A commit, push or deployment requires explicit authorisation. Check that `http://127.0.0.1:4173/` serves the current build, then start with `/tools/`. Follow the [local run instructions](../docs/getting-started.md#run-locally) if the server is unavailable.

Begin at `/tools/`, then operate the letter annotation, correspondence editor and catalogue comparison. Review the actual source, one substantive action and exported result for each task. Existing external applications open at their own hosts; their inclusion does not claim that their interfaces were rebuilt. Prototype variants remain in Design studies. Preserve sources, saved work and recovery contracts when incorporating feedback. The [design contract](design.md#task-hierarchy) records the revision rationale; representative observation follows the [development study protocol](../benchmarks/development-study-protocol.md).

| Priority | Work remaining | Dependency and completion evidence |
|---|---|---|
| 1 | Obtain operator feedback on the revised working surfaces | Inspect task categories, real source examples and complete local workflows. The current revision is a candidate, with acceptance pending. |
| 2 | Correct evidenced friction | State the consequence and change hypothesis, implement a bounded correction, repeat affected tasks and retain before/after evidence. |
| 3 | Complete accessibility observations | Native zoom now has bounded evidence for the new and changed routes. Arrange a real screen-reader task. |
| 4 | Observe representative research use | Assess source interpretation, annotation categories and review meaning with accountable researchers, recording assistance and errors. |
| 5 | Assess version 0.2 readiness | Assess the implemented workflows on all four bounded materials against the acceptance contract and record technical readiness separately from human research acceptance. |

Source acquisition and implementation of the contrasting annotation case are completed work. Avoid commissioning another dataset merely to fill that milestone. Broader skill evaluations, full-text appraisal of abstract-only research sources and representative participant work remain open. Maintain the source-access limits recorded in the research guide and the historical sections below.

## Status tracker

| Milestone | Current state |
|---|---|
| M0 Baseline | The Met snapshot and importer and the listed historical evidence remain unchanged within the preservation probe's scope. The combined candidate has its own source manifest and run. |
| M1 Workflow | Documented and exercised in the Met case and agent-only preparation trials A/B. Human novice entry and method benefit remain unverified. |
| M2 Material and cases | Met metadata, Milton discussions, a Benndorf letter and Schönbach CMIF metadata have frozen sources and separate task/data contracts. |
| M3 Responsibilities | Small UI primitives and build rules are reused. Annotation validation, source extraction, recovery and interface remain independent from Met investigations. |
| M4 Reference case | The Met investigation workflow is implemented and has earlier engineering evidence. Researcher assessment remains open. |
| M5 Contrasting case | Forecast and letter annotation and the real-metadata projection are implemented. Domain assessment remains open. |
| M6 Reproduction and feedback | A separate agent reproduced the earlier combined candidate. The operator then rejected its design. The task-based revision is ready for a new review after its checks; it has no human design acceptance yet. |

## Bounded review, 2026-10-10

This dated record predates field-source inspection, the contrasting annotation and the gallery. Its findings and outgoing Vault follow-up describe that reviewed state.

The [review record](../benchmarks/runs/2026-10-10-clear-scope-review/assessment.md) retains the source manifest, operated browser evidence and actual investigation download. The UI review and focused recovery/import examination confirmed no application defect within their scope. The lead runner repeated code checks and unit tests, then rebuilt the application. All seven observed pilot resources matched the fresh build byte for byte. The application code and established workflow remain unchanged.

The practical skill focus was `research-ui-evaluate` for the operated workbench and `vault-orient` for the repository/Vault cross-check. These are bounded applications of the procedures. The additional held-out case and comparative skill evaluation remain open. No skill improvement is claimed from this review.

### Outgoing Vault follow-up

The Vault was read-only during the bounded review. The table preserves its outgoing findings. The operator explicitly authorised the later Vault corrections, which resolved the material and entry-point statements on 2026-10-10. The [documentation closeout](testing.md#documentation-audit-closeout-2026-10-10) records the subsequent reconciliation. These points no longer require a new handoff.

| Target passage | Checked source and evidence | Intended correction |
|---|---|---|
| `Offene Punkte`, the choice between an idea with sample data and a complete briefing, line 143 in the reviewed file | [Project purpose](project.md#purpose) and V02-01 in [Specification](specification.md#planned-version-02-acceptance) already allow question, idea, material, method and existing-workflow entry. The operator's current brief confirms that decision. | Remove the obsolete either/or decision. Retain practical evaluation of different starting situations as open work. |
| `Beispieldaten und Anpassungsszenarien`, lines 117–119 in the reviewed file | [Project data basis](project.md#data-basis) and [Specification](specification.md) now establish the Met pilot and NOAA/NHC annotation case alongside the synthetic editor. | Describe both implemented cases and their separate contracts. Preserve source limitations and open researcher acceptance. Check the Vault's current wording before applying this outgoing correction. |

## Current maintenance handover

This is a locally prepared development increment, with no continuing service agreement. The research acceptance authority, continuing technical maintainer, deployment operator and long-term data custodian are all `unassigned` for this increment. No assignment is inferred from repository ownership or the operator's implementation request. No background update or monitoring job has been created.

Use the retained lockfile and the public start/verification commands. Node.js 22.14.0 was used for the recorded local checks. The source captures for those checks included uncommitted files, so their base Git commit alone is insufficient to identify the tested state. The [CI reflow correction](testing.md#ci-reflow-correction-2026-10-10) identifies the latest source capture. The [commit preparation](testing.md#commit-preparation-2026-10-10) records the byte-preservation policy, and the [documentation closeout](testing.md#documentation-audit-closeout-2026-10-10) identifies the preceding documentation revision and its verification. The earlier full software checks belong to `benchmarks/runs/2026-10-10-project-tools-source.json` and its matching run directory. The older repository audit and review-ready captures retain their historical scope. Preserve original exports and the local recovery copies when preparing a later change.

The retained real old-format export is `benchmarks/runs/2026-10-10-clear-scope-review/ui/instrument-investigation.json`. The provenance run retains `benchmarks/runs/2026-10-10-project-decisions/export-v2.json`; the audit also exercises actual downloaded version 2 files. Reopen test copies in a fresh browser context; preserve originals. A previous version 1-only application cannot read new version 2 files. Restore the matching old application with original version 1 exports when rolling back; do not overwrite new exports or silently downconvert their evidence. The editor remains on its separate collection schema version 1.

The annotation cases use notebook schema 1 with separate case identities and storage keys. Preserve their original source snapshots and exported notebooks when changing a data contract. The [project-tool checks](testing.md#project-tool-revision-2026-10-10) cover case isolation and saved annotation recovery. Unfinished forms receive navigation protection but have no browser-crash restoration. A later maintainer should reproduce the identified state, perform one bounded change and record additional help needed under the [development study protocol](../benchmarks/development-study-protocol.md). New snapshots, derivation changes, protected services and shared editing require renewed compatibility decisions.

## Target outcome

The acceptance contract is [planned version 0.2 acceptance](specification.md#planned-version-02-acceptance). A complete reference case connects the research question, material, method, implementation and verification. A bounded second case tests adaptation. The browser remains the default interface, with technical complexity justified by the task. A technically ready release candidate and human research acceptance are reported separately.

## Design exploration and remaining evaluation

The operator rejected the catalogue browser as an adequate research-tool reference on 2026-10-10. Cosmetic iterations and passing software checks have not established research usefulness. The earlier catalogue now lives at `/baseline/`. Three alternative interfaces and the current investigation workbench have been implemented. The following procedure governs further evaluation and adaptation. Completed implementation steps are identified in the status tracker and must not be commissioned again.

1. Document a research episode: initial question or curiosity, source material, investigation unit, required context, consequential decision and reusable outcome. Inspect real records and current practice. A question can evolve during exploration. Agent-generated roles and tasks remain hypotheses until reviewed by relevant researchers.
2. Assess whether the material supports that episode. The 60 lowest-ID Met records are a reproducible engineering fixture, not a justified corpus for historical prevalence claims. The current projection lacks images and object relationships. Inspect actual source availability and rights before proposing a visual object study; change the case or sample if it cannot support a worthwhile task.
3. Observe reference workflows with comparable material. Candidates include teiCrafter for evidence-linked editing, CorrespExplorer for relational exploration and a collection explorer for discovery. Record actions, outcomes, friction, prerequisites and limitations, not just screenshots or popularity. No transfer claim follows from a candidate's existence.
4. Produce three genuinely different interaction sketches for the same episode and data: object-led browsing, a comparison workspace, and a question-led analytical path. Show the initial view, one consequential action, the resulting evidence and recovery. Use real examples. The three concepts are alternatives for examination, not three mandatory application modes.
5. Compare the concepts through the same complete task. Record whether the researcher can find a starting point, recognise source versus interpretation, compare evidence without losing context, recover a prior selection and retain a usable outcome. Ask about effort, confidence and desire to continue; do not infer enjoyment from a screenshot or a low click count. Choose or combine concepts with explicit reasons.
6. Define visual direction for the selected concept: research material, hierarchy, typography, spacing, control states, meaningful colour, icon semantics and responsive behaviour. Build one working vertical slice and observe it with a relevant researcher. Preserve the question, selections and evidence only where the task calls for it. Runtime LLM assistance is optional and separate from the agent harness used to design the tool.
7. Promote only supported findings into reusable patterns. Each pattern records the task, suitable material, mechanism, tradeoffs, counterexample and evaluation status. Keep the pilot's current structure distinguishable from accepted cross-project guidance.

A provisional Met episode to test is: compare selected instruments' catalogue descriptions of material and construction, preserve original attribution/date qualifiers, and retain a sourced comparison with a short observation and unresolved question. The current metadata can support catalogue comparison; claims about sound, construction visible in images or historical diffusion require additional evidence. A comparison workspace is implemented at `/pilot/` as a candidate for operator review. Its usefulness has not yet been accepted.

The design package is complete when the episode, material assessment, reference observations, three interaction alternatives, a reasoned comparison and vertical-slice acceptance tasks are inspectable. The agent harness assembles this package from project knowledge, data and explicit unknowns. It must not force researchers through a fixed typology chooser or introduce a chat interface without a task-based reason.

### Source basis and limits

The local vault documents *Scholar-Centered Design*, *Frontend-Werkzeuge für die Forschung umsetzen*, *Visual Analytics und Human-AI-Interaction* and *Fancy Research Tools Template-Konzept* already ground this workflow in research practice, contextual decisions and task-specific tools. This plan is a project synthesis, not an empirically validated universal procedure.

The abstract of [Ye et al. (2025), The Design Space of Recent AI-assisted Research Tools for Ideation, Sensemaking, and Scientific Creativity](https://arxiv.org/abs/2502.16291) reports an analysis of thirteen tools and recommendations about agency, divergent/convergent thinking, adaptability and transparency. The abstract of [Elmqvist and Klokmose (2025), Automating the Path](https://arxiv.org/abs/2504.07529) distinguishes viewing, exploring, schematising and reporting. These are bounded conceptual inputs; neither establishes the effectiveness of our proposed UI. Older foundational literature remains relevant and is not presented as a 2026 finding. Newly located 2026 programme entries were inaccessible on direct retrieval and are not used as verified design evidence. Full-text appraisal and operated reference-tool comparisons remain work in this design exploration.

## Research synthesis and implementation status

The [research-work synthesis](../docs/research.md#research-work-and-design-requirements) answers the recurring discovery questions with documented reference mechanisms and explicit evidence limits. The product purpose and independent tool identities are settled. Do not ask the operator to choose technical modules or reopen those decisions. A personal preference or participant commitment must not be invented from literature.

The Met workbench retains source comparison and separately authored interpretation. Annotation of Milton discussions and the Benndorf letter contrasts that workflow with exact quotation anchors and explicit review assertions. The metadata editor keeps original Schönbach correspondence values beside working corrections. The [architecture](architecture.md) records shared and domain-specific responsibilities. Selectable text, no introductory sublines and task-specific visual design remain binding. The historical [session closeout](../benchmarks/runs/2026-10-10-session-closeout/assessment.md) and later audit retain evidence for the repaired preservation defects. The revised candidate must preserve those behaviours before research assessment.

Internal evidence consulted on 2026-10-10 includes the vault's teiCrafter hub, CorrespExplorer overview, Wenzelsbibel overview, Luschan Forschungsreisen Visualisierung, Fancy Research Tools Template-Konzept, Scholar-Centered Design, Design Patterns für DH-Forschungsinterfaces and Fehlerklassen agentisch erzeugter Forschungswerkzeuge. The teiCrafter and CorrespExplorer public repository descriptions were cross-checked. The Luschan repository and current partner commitments were unavailable for verification, so its vault material informs domain constraints only. No new live usability evaluation of these external tools was performed.

## Phases and milestones

| Milestone | Work | Dependencies | Acceptance |
|---|---|---|---|
| M0 | Establish the reproducible baseline | Implementation commissioned | V02-06 |
| M1 | Define the iterative development workflow | M0 | V02-01, V02-02, V02-03 |
| M2 | Inspect material and select contrasting cases | M1 | V02-02, input evidence for V02-04 and V02-05 |
| M3 | Separate application responsibilities | M0 and the case contracts from M2 | V02-06 |
| M4 | Build the complete reference workflow | M2, M3 | V02-04 |
| M5 | Implement the contrasting adaptation | M4 | V02-05 |
| M6 | Independently reproduce and review | M4, M5 | V02-07, V02-08 |

### M0 Establish the baseline

Entry requires an implementation commission and inspection of the existing working tree. Preserve the current uncommitted work and identify source state and dependency lockfile before changing runtime behaviour. Run the existing quality gates and distinguish inherited failures from regressions. Record the current dataset schema and persisted-draft representation.

Exit requires a reproducible baseline against which V02-06 can be assessed. Commit or publication is a separate authorised action.

### M1 Define the iterative workflow

Entry requires M0. Revise project purpose, adaptation guidance and architecture around Preparation, Exploration, Distillation and Implementation. Allow a question, idea, dataset, source collection, method or problematic workflow as entry. Keep unknowns explicit and make revisiting the question part of the procedure.

Define the minimal project knowledge needed to connect question, material, method, task and assessment. Use existing canonical documents where their function fits. Add `research-methodology.md` only for methodological content requiring its own maintained home. Explain how an agent locates primary sources, checks assumptions and applicability, distinguishes source findings from proposals and writes back durable conclusions. Exercise the instructions with question-only, data-only and existing-workflow inputs without inventing missing facts. An interdisciplinary methods encyclopaedia is beyond this increment.

Update README and public guides with the harness/tool distinction and the browser-first decision. Derive concise project instructions from the maintained contracts after those contracts are settled. Keep role simulations bounded to candidate requirements and counterexamples. A separate reviewer challenges their assumptions. Actual user observations and responsible acceptance remain distinct evidence.

Exit requires the workflow and its evidence expectations to support V02-01 through V02-03. Execution evidence for the workflow is completed in M4 and M6.

### M2 Inspect material and select cases

The implemented workflows use four bounded materials under the [data contract](data.md). Met metadata supports catalogue comparison. National Hurricane Center Milton discussions 2 and 6 support annotation of forecast wording and stated uncertainty, without establishing later weather conditions or forecast skill. The Benndorf letter supports annotation of a published transcription with its edition and transcription roles preserved. The Schönbach CMIF projection supports descriptive metadata correction while keeping original values visible. Its flat collection export does not constitute a lossless XML round trip. Source samples, rights, selection and extraction remain specific to each material.

Further source acquisition requires an observed research need. Inspect samples and source documentation before choosing another question, comparing field meaning, missing values, units, rights, size and reproducibility. File format alone does not determine the method or interface. Inferential or causal claims require separately justified methods and suitable evidence.

Document selected source/version, attribution, permitted redistribution, selection rule, raw/derived distinction, transformation command and checksums where useful. Keep real demo material separate from synthetic failure fixtures. Prefer a reproducible bounded snapshot and local assets. Select CSV, XLSX, XML or another adapter only when the chosen material requires it. Preserve information outside a supported mapping or reject it explicitly.

Exit requires inspected inputs and explicit task/data contracts sufficient to implement V02-04 and V02-05. Operator input is needed for unresolved scientific intent or rights decisions that source inspection cannot settle. No dataset is accepted merely because it is publicly downloadable.

### M3 Separate responsibilities

Editor persistence lives in `src/app/storage.ts`. The workbench and concepts share the Met investigation contract under `src/research/`. The forecast and letter cases share annotation validation and recovery under `src/annotation/`, with distinct case vocabulary, source snapshots and storage. They reuse the text-preservation primitive and build rules. Preserve these domain boundaries and the observed behaviours before considering further extraction.

Separate deterministic test fixtures from the visible datasets. Browser tests import controlled synthetic fixtures explicitly for failure tests and test real material separately. Define handling of existing v0.1 local drafts before changing storage keys, schema or default material. Unsupported drafts must remain recoverable, with no silent reset or overwrite. Keep each workflow's working state separate, including the two annotation cases. Preserve import/export size symmetry and the documented limits of stale-copy detection. Reassess the existing size limit only against measured needs and regression tests.

Exit requires V02-06 regression evidence. A module or package is shared only where the adaptations demonstrate a common contract. A broad framework rewrite is outside this step.

### M4 Build the complete reference workflow

Entry requires M2 and M3. Implement source loading, exploration or descriptive analysis, relevant views and reproducible export. Show provenance, missingness and applicable units. Define expected outputs using an independently inspectable calculation or reference result. Document how filtering affects denominators, comparisons or aggregates when relevant.

Run the process from the initial material/question through a small prototype. Record what the prototype changed in the question, method or implementation. Carry justified revisions into canonical documents. Measure responsiveness on the selected reference material before increasing complexity.

Exit requires V02-04 and the executed V02-01 workflow. Technical checks and domain assessment are recorded separately.

### M5 Test a contrasting adaptation

Forecast and letter annotation implement exact quotation anchors, create/edit/remove, separate creator and review assertions, saved notebook recovery and export/reopen. Their vocabularies, source roles and notebook case identities remain distinct. Pending forms receive navigation protection and must be saved or discarded before interchange. They have no browser-crash restoration. The Schönbach editor adaptation adds a real metadata projection and original-value comparison while preserving collection schema 1 and prior drafts. Human assessment of these workflows remains open.

The [architecture comparison](architecture.md#core-and-adaptation-boundaries) records retained primitives and separate domain responsibilities. Treat a quoted span with an annotation review as a counterexample to a universal catalogue-field model. Use final regression evidence and domain review to assess the implemented boundary before extracting more shared code.

Exit requires V02-05 and regression evidence for the affected V02-06 behaviours. The bounded case need not become a second fully featured application.

### M6 Reproduce, review and prepare feedback

Entry requires M4 and M5. Assign a fresh agent or developer a repository-only reproduction task with the documented source material. Record any missing context, questions, failed steps and manual interventions. Repair documentation or implementation at its canonical location and repeat only affected checks.

Run clean installation, type/lint checks, relevant unit tests, production build and browser tests. Cover actual downloaded exports, failure recovery, old drafts, narrow layouts, keyboard use, applicable accessibility checks and repository-subpath delivery. Inspect the visible documentation and tools. Verify the publication allowlist and the correspondence between requirements, sources and recorded results.

Update the application version and changelog to 0.2 only when the release candidate meets its technical criteria. The public documentation footer already derives its version from the package manifest. Preserve that behaviour. The knowledge-document schema version changes only if its own contract changes. Start the local server and present documentation and the implemented workflows on all four materials for operator feedback. Record human acceptance or remaining issues explicitly. External deployment requires its own authorisation.

Exit requires V02-07 and V02-08. If domain review is unavailable, report technical readiness and pending research acceptance without marking scholarly validation complete.

## Open decisions and dependencies

The four bounded materials and their workflows and JSON contracts are implemented. Open scientific questions concern their usefulness, interpretation of source assertions and annotation categories, the adequacy of the metadata projection, and the authority of recorded reviews. Browser-first is confirmed. An added backend, collaboration service or runtime LLM needs a concrete requirement and documented scope decision.

The operator delegated reasoned answers to the five overall-project questions and their implementation. The [qualified commitments](project.md#development-commitments) now cover assisted novice entry, existing-tool adaptation, maintainable handover, independent researcher evidence and study of the method. Guides and a concrete study protocol implement those commitments. Participant availability, actual independent use, named maintenance responsibility and longitudinal results remain unknown. The protocol does not initiate recruitment or recurring work.

Field-level provenance separates source, production and checking under the [data contract](data.md#provenance-of-individual-values). The Met adaptation exposes original values, transformations and technical checks while preserving unknown original authorship. Both annotation cases add self-declared creators and optional named source-fit reviews with explicit criteria. Editing the underlying annotation clears its prior review. The metadata editor binds original-value evidence to the record identifier and source identity. Authentication, review history and broader validation workflows remain outside these bounded contracts.

Agent work uses disjoint ownership. A methods/data agent owns source inspection and case evidence, an engineering agent owns state and persistence refactoring, and a UI agent owns views after shared contracts are settled. The main agent integrates canonical requirements and documentation. An independent reviewer reads the result without editing the same files. Data and interface implementation wait for their shared contract. Agent agreement is not a substitute for researcher acceptance.

## Deviations

The operator selected DH material for the first experiment, so implementation began with catalogue comparison. The next commissioned contrast used meteorological source prose and exact quotation annotation. After rejecting the gallery and working layouts, the operator requested examples from existing projects. That revision added the Benndorf letter and Schönbach correspondence metadata, with existing tools linked through an activity-based gallery. Material inspection, workflow clarification and implementation overlapped while earlier sources and exchange contracts remained supported. This is an assisted development run. The implementations do not establish interdisciplinary generality or a blinded comparison of development methods.

Each prototype may send work back to material inspection or methodology. Record the reason in the responsible contract and one coherent journal entry. Update this plan when the dependency changes. V02-06 preservation and the distinction between technical and human acceptance remain applicable throughout. Dataset replacement must trigger renewed provenance and expected-result checks.

## Three-concept implementation study

The operator commissioned three runnable alternatives and use of subagents and skills. Project-local design, evaluation and improvement procedures live under `.agents/skills/`. Their initial application is the shared catalogue-comparison task in `benchmarks/ui-concepts-brief.md`. The `/concepts/` entry links the alternatives and a downloadable feedback form. The gallery footer links to this entry as Design studies. Evaluation follows `benchmarks/ui-concepts-protocol.md`. No winning concept or researcher acceptance is inferred from implementation. Broader skill forward-tests remain open.

## Session closeout, 2026-10-10

This earlier closeout predates the repository audit, native-zoom checks, bulletin annotation and gallery. Its next action and remaining work describe that historical state. Use the current priorities at the top when resuming.

The bounded refactoring increment replaces the default pilot with an investigation workbench, preserves the original catalogue at `/baseline/`, implements shared validated exchange and recovery across concepts, isolates editor persistence, and repairs source/build and benchmark evidence boundaries. The research synthesis is implemented as a complete candidate workflow from source selection through observation to reopenable output.

The next operator action is to use `/pilot/` for the comparison task and assess its practical usefulness. Further development should follow observed friction. Broader material acquisition, contrasting disciplinary adaptation, external participant recruitment, native browser zoom and screen-reader assessment remain outside completed engineering acceptance. Version 0.2 is not declared complete merely because this increment builds. No further background work or automation is scheduled for this session.
