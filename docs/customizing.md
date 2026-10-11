# Customizing a research tool

Begin with a research question, an idea, source material, data, a method or an existing workflow. A human and a coding agent develop the task and the tool together through Promptotyping. The development harness provides the LLM and its tools. The resulting research application needs runtime LLM features only when its research task requires them.

## Define the task

Begin with the settled purpose in [Project](../knowledge/project.md#purpose) and the actual source sample. Record what the researcher needs to do, which evidence makes that possible and what a completed session should retain. An initial question can change when the material contradicts its assumptions. A data-only start can produce competing questions rather than a forced conclusion.

Separate research activity, material structure, file format and collaboration needs. A spreadsheet can contain measurements, catalogue records or coded observations. Its extension alone does not determine an appropriate analysis. Prefer a browser interface and the simplest stack that meets the actual requirements. Add processing or services when the task justifies them.

For methodological claims, inspect primary sources and record their prerequisites, reading limits and applicability to the material. Distinguish source findings, observations of the dataset, agent proposals and accountable human decisions. A method that cannot be justified from the available evidence remains a proposal. Stakeholder simulations help find assumptions and counterexamples but cannot supply missing collection history or researcher acceptance.

Update `knowledge/project.md` with the intended researchers, material, setting and accountable owner. Express observable behaviour in `knowledge/specification.md`. Describe how success will be assessed with representative tasks in `knowledge/testing.md`.

A search interface, an edition editor and a simulation have different data and runtime needs. Decide whether the browser starter fits before adding features. Server-side authentication, shared editing and protected services require a revised architecture.

## Adapt an existing tool

Open the existing project's repository and begin with its working application. Preserve its history, source data and saved research work. The useful contribution from Fancy Research Tools may be an adaptation procedure, a check or an individual component.

1. Inspect the project's instructions, implementation, dependencies, licences, data contracts and unfinished work. Identify which files are original sources, working copies or generated output.
2. Record an identifiable baseline, including uncommitted changes, and reproduce one existing research task. Save an actual export and a representative earlier-version file in a safe test copy.
3. Describe the requested change with a concrete source example. Name the behaviours and meanings that must survive, including identifiers, uncertainty, notes, provenance and recovery.
4. Make the smallest complete change in the existing structure. Add or clarify project knowledge where needed. A replacement architecture requires evidence that the current one cannot support the task.
5. Repeat the changed task and the preservation checks. Reopen old and new files, inspect actual output and record any deliberate migration. Keep a route back to the previous application and original saved work.

If the repository or a representative file is missing, establish what can be decided from the available description and request that material before promising compatibility. Existing format, licence and review authority remain project facts to inspect.

## Give an agent a bounded adaptation

Provide the available material and the research action you want to perform. The [starting request](getting-started.md#work-with-a-coding-agent) lets the agent help establish missing project knowledge and observable criteria. An existing brief can already supply the referenced data state, permitted changes and acceptance tasks. Ask the agent to identify assumptions and trace the change through the [architecture](../knowledge/architecture.md). Editing a particular TEI structure or exploring correspondence with uncertain dates gives the work a bounded purpose.

Review the data mapping and task before implementation. After the change, inspect the resulting behaviour and exports, run relevant checks and update the canonical contracts. Record unresolved scholarly questions for an accountable researcher. Simulation of a researcher can expose candidate questions but cannot provide that person's acceptance.

## Worked adaptation of catalogue comparison

The [catalogue comparison](../pilot/) compares selected Met records and retains a question and notes. Each comparison value links to an addressable source view so that a researcher can inspect its original fields, transformation and recorded checks. The original catalogue records and the researcher's notes keep their separate meanings.

| Part of the adaptation | Concrete treatment |
|---|---|
| Existing research work | Preserve selection, questions, notes, source wording and local recovery. Keep a saved version 1 investigation for compatibility checks. |
| Field origin | Connect each projected value to its original API fields, preserved source file and hash. Show the catalogue publisher separately from the original producer, who is unknown in this snapshot. |
| Visible detail | The source view exposes the displayed value, source mapping and technical checks. An attribution assembled from prefix, name and suffix retains all contributing fields and their qualifiers. Its URL retains the object and field being inspected. |
| Portable output | New investigations use schema version 2 with field evidence. Legacy version 1 investigations remain readable. Restoring or viewing them preserves the original stored content and file; exporting creates a new version 2 file without changing that stored content. An actual edit stores a version 2 investigation while preserving its source records and notes. Keep the original file. |
| Acceptance evidence | Inspect a qualified attribution, reopen old and new investigations, compare source records and notes, reject altered evidence and check keyboard entry, browser navigation and return to the comparison. |

The [data contract](../knowledge/data.md) defines the formats, and [testing](../knowledge/testing.md) records executed checks. This example explains the bounded adaptation and its required evidence. Its reuse in another research setting needs another inspected data contract and task.

## Replace a synthetic default with real metadata

The [collection editor](../tool/) now starts with Schönbach correspondence metadata already used by CorrespExplorer. Its existing collection schema, imports, exports and browser drafts remain unchanged. The new material is a bounded projection, documented under the [data contract](../knowledge/data.md).

| Responsibility | Treatment in the collection editor |
| --- | --- |
| Source acquisition | Preserve the exact local CMIF bytes, repository revision, source path, original URL, licence declaration and SHA-256. The acquisition record distinguishes a local copy from an upstream download. |
| Mapping | Derive stable record IDs from CMIF keys. Join sender and recipient for the working title, assign Letter as the record type, and preserve the sent date and place. Declare these transformations. |
| Source context | Show the frozen source values beside the working fields. Retain complete correspondence structures and authority references in the XML, including received places absent from the flat collection schema. |
| Existing research work | Restore a saved collection before selecting the new default. Preserve schema version 1, storage keys and synthetic test fixtures. Imported data retain their exact values until the particular field is edited. |
| Review and export | Label editable provenance Working source note and the manual state Working review. Checked records no reviewer or criterion. Preserve source identity in JSON exports and state that they do not recreate TEI. |
| Verification | Rederive the collection from the hash-bound XML, compare generated bytes, edit and reopen real records, preserve original fixture drafts, and reject source attribution based only on a familiar identifier. |

This adaptation changes the default material without claiming general CMIF editing. A project that must edit recipients, authority links or correspondence actions needs a model that represents those structures and a corresponding migration.

## Replace the data contract

### Contrasting text annotation

[Annotate forecast discussions](../annotations/) uses two archived NOAA/NHC discussions to examine observation, forecast and stated uncertainty in original passages. The [annotation data contract](../knowledge/data.md#annotation-notebook) records sources, rights and text derivation. [Annotate a letter](../letters/) extends the interaction to the real Benndorf transcription already supplied with teiCrafter. It has its own source contract, categories and browser draft. Both tasks and their categories require operator and domain assessment.

| Responsibility | Treatment in the annotation case |
|---|---|
| Development foundation | Retain the Vite build, documentation generation, local dependencies and technical acceptance procedure. |
| Accessible interaction | Reuse exact author-text binding and the focus, reading-order and keyboard requirements. Implement these in the tool's own stylesheet and layout. |
| Research material | Replace catalogue rows and comparison columns with a readable source and exact quotation ranges. Preserve the frozen bulletins. In the letter case, normalize line endings for selection offsets while retaining the raw bytes and declaring the earlier removal of footnote numerals. |
| Interpretation and review | Replace the investigation's shared note with individually anchored annotations. Record creator separately from reviewer, criterion and result. Content edits clear the associated review. |
| Portable output | Keep source identity, quotation offsets and annotations together under an explicit case ID and a separate storage key. Preserve existing NOAA/NHC notebook bytes and fields. Each route accepts its own case; collection and investigation formats remain unchanged. |
| Recovery | Apply the same preservation requirements in an annotation-specific controller, including pending-form guards, validation before replacement and storage-conflict detection. |

This contrast supports selective reuse of primitives and requirements. It does not yet justify a universal domain model or plugin interface. The [annotation contract](../knowledge/specification.md#contrasting-annotation-contract) defines observable behaviour, and [Testing](../knowledge/testing.md) holds execution evidence.

### Establish the new model

Use [data](../knowledge/data.md) as the starting point. Define field meaning, missing values, stable identifiers, source attribution and review authority. Change validation, fixtures, editing controls and round-trip tests together. Keep unknown-field rejection until a deliberate extension policy exists.

Keep original inputs separately. Document transformations and preserve enough provenance to inspect a result against its source. Descriptive dates do not automatically support chronological sorting or uncertainty calculations.

Map production and checking separately at each relevant value using the [provenance vocabulary](../knowledge/data.md#provenance-of-individual-values). Preserve the inspected version, actor, criterion and result when importing a recorded check. A successful check of structure cannot become a claim about a historical reading. Work through one changed-value example to establish which previous checks must be reconsidered.

The editor's flat collection is a descriptive contract, while the Met explorer preserves a separate catalogue model. A reference tool may need structured texts, relationships or other domain objects. Preserve their meaning through a suitable model and document any transformations. The [data contract](../knowledge/data.md) distinguishes the real source snapshots, synthetic test fixtures and requirements for further material.

## Adapt the interface

The [operator default profile](../knowledge/design.md#operator-default-profile) is the starting presentation choice. When your research task calls for different choices, revise the copied design contract and align the local agent instructions and checks with it. Preserve the separate accessibility, source, rights and working-state requirements. The repository's guides and contracts must support this adaptation without private Vault access or the original chat.

Use the [view hierarchy](../knowledge/design.md#task-hierarchy) to decide what remains immediately visible. Establish layout, typography, spacing and semantic colour for that tool in its design contract. Keep data and behaviour requirements in their existing owners and trace the changed view to its [acceptance scenario](../knowledge/specification.md). Shared accessible primitives can support this work without prescribing a universal shell or brand.

### Reusable interface patterns

Select a candidate from the [design decision table](../knowledge/design.md#reusable-review-decisions), including its counterexample. Copy a pattern only after checking that its required evidence and state exist in the new material.

For example, a people list can use aligned name, role and date fields when the task compares attributions. Two conflicting attributions must retain their separate qualifiers. A source action next to each attribution can expose its exact wording, while a researcher can already see the disagreement in the row. An authority link identifies its recorded entity without merging similarly named people. This applies the design contract to a concrete decision instead of reducing every record to a compact card.

1. Write one complete task using actual records and identify the next decision in each view.
2. Select a dense example, a relevant unknown or uncertain value and a recovery action. Keep deliberately synthetic boundary cases distinguishable from historical material.
3. Build and operate the small episode. Compare source wording, visible statement, selected identities and retained result.
4. Inspect the [operator profile](../knowledge/design.md#operator-default-profile) and [UI acceptance protocol](../knowledge/testing.md#ui-acceptance-protocol), then correct the shared cause before repeating the component across views.

The repository's `research-ui-design`, `research-ui-evaluate` and `research-ui-improve` skills support these separate activities. A new public example needs its own source snapshot, rights record and operated evidence. Transfer a lesson from commissioned work through fresh open material, keeping customer data and private project history out of public files.

## Maintain the knowledge base

Canonical contracts live in `knowledge/`. Public guides live in `docs/`. The documentation build selects public contracts through an allowlist. Review that list before adding customer-specific specifications. Files excluded from the site remain visible if committed to a public repository.

## Plan updates

Record the upstream starting commit and keep project-specific changes understandable. Compare upstream changes, migrate deliberately and rerun the project's tests. Copying a template does not subscribe a project to automatic improvements. Extract a shared package only after multiple projects demonstrate a stable contract.

Before a dependency change, reproduce the current setup from its lockfile, state the reason for the change and preserve a recoverable version. Change the dependency and lockfile together in an isolated increment, inspect affected behaviour and run the relevant checks. Record the new environment and any migration. A failed attempt returns to the preserved application and data state. Updates are deliberate project work.

## Hand over maintenance

Agree who accepts research results, who maintains the code, who operates any deployment and who preserves the data. One person may hold several roles. Record an assignee only when they have accepted the responsibility. Use `unassigned` where that agreement is missing, with the resulting limitation. A local working tool does not itself provide hosting or a continuing support service.

The [software management plan guidance](https://www.software.ac.uk/guide/writing-and-using-software-management-plan) connects a tailored plan with responsibilities, expected outputs, dependencies, version control and maintenance effort. Fancy Research Tools applies that guidance through a handover that another session can exercise.

| Handover item | What the next maintainer must be able to establish |
|---|---|
| Purpose and responsibility | Intended research use, accepted scope, research reviewer, technical maintainer, operator and data custodian, including unassigned roles |
| Reproducible environment | Source revision and local changes, runtime, lockfile, build/start commands and necessary external services |
| Data and formats | Source and schema versions, rights, transformation steps, supported old formats and a safe earlier-version fixture |
| Recovery | Where original sources and exported working copies are retained, how to restore them and what browser storage cannot preserve |
| Change procedure | Expected behaviour, relevant tests, migration of copies before originals, rollback to the prior application and unchanged original files |
| Known limits | Unperformed checks, open domain decisions, unsupported uses and external dependencies that may disappear |

Ask a fresh session to start the tool, reopen the retained older file and make one bounded change using the handover. Record every extra explanation or intervention. This checks the current handover. Evidence of maintenance over time comes from subsequent real changes and continued ownership.
