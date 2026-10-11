# Customizing a research tool

Begin with a research question, an idea, source material, data, a method or an existing workflow. A human and a coding agent develop the task and the tool together through Promptotyping. The development harness provides the LLM and its tools. The resulting research application needs runtime LLM features only when its research task requires them.

## Define the task

Read existing decisions before asking new questions. This repository supports both immediate research use and development with coding agents; that audience decision is settled. Preparation establishes what is available and what is unknown. Exploration examines real material and possible methods. Distillation records justified findings in project knowledge. Implementation produces a small inspectable workflow. Return to earlier activities when a prototype exposes unsuitable assumptions. An initial question can change, and a data-only start can lead to competing questions rather than a forced conclusion.

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

Record production and checking separately at the relevant data point. The shared vocabulary describes executed activities.

| Term | Recorded meaning |
|---|---|
| AI-generated | An AI system proposed or produced the content. |
| Deterministic check | A defined procedure checked a named property. Record the outcome separately. |
| AI-reviewed | An AI system examined existing content against stated criteria or sources, with its findings and run traceable. |
| Human-verified | A responsible person checked and confirmed the named property of the identified material and version. |

These terms form no quality ladder. Preserve the subject and version, actor or procedure, criterion or reference, and result of a check. Record a time only when actually known. Unknown production stays unknown. Negative and unresolved human findings remain recorded as findings. A changed value requires reassessing which earlier checks still apply. Each project defines the scientific meaning and authority of its review decisions.

The editor's flat collection is a descriptive contract, while the Met explorer preserves a separate catalogue model. A reference tool may need structured texts, relationships or other domain objects. Preserve their meaning through a suitable model and document any transformations. The [data contract](../knowledge/data.md) distinguishes the real source snapshots, synthetic test fixtures and requirements for further material.

## Adapt the interface

The [operator default profile](../knowledge/design.md#operator-default-profile) is the starting presentation choice. When your research task calls for different choices, revise the copied design contract and align the local agent instructions and checks with it. Preserve the separate accessibility, source, rights and working-state requirements. The repository's guides and contracts must support this adaptation without private Vault access or the original chat.

Begin with the view hierarchy in the [design contract](../knowledge/design.md). Identify the researcher's next decision, the material needed for it and the action that follows. Choose a visualisation only when the data supports that comparison. Implement through task-specific visual tokens and shared accessible primitives with labelled icons, then verify the relevant [acceptance scenarios](../knowledge/specification.md) and record evidence in [testing](../knowledge/testing.md). Include long titles, missing values, filter reversal and import errors in the review.

Give each tool its own interaction layout, information density, typography and colour semantics based on the actual research work. The starter's examples demonstrate different tasks and do not prescribe a universal shell or DHCraft branding. Reuse accessible primitives, state handling and checks where appropriate. Record the tool's design decisions and rights explicitly.

### Reusable interface patterns

Choose a pattern for a named research action and inspect its prerequisites in the actual material. The current operator profile favours compact views, while each task determines what must remain visible. The following patterns are starting hypotheses to evaluate in an adaptation.

| Research action | Useful arrangement | Boundary and verification |
|---|---|---|
| Compare people or collection records | Align comparable fields in compact rows. Keep the name, role, relevant date or place, and the action needed next visible. Let selection operate beside the row. | A prose source needs a reading surface. Several attributions need their own qualifiers and cannot be collapsed into one authoritative name. Inspect a dense state with long labels. |
| Inspect a statement's evidence | Place a source action beside the affected value. Open the original wording and derivation in context, with a reliable return to the selected record. | Source identity and an uncertainty that changes interpretation remain visible before opening detail. Technical hashes and processing traces may use optional disclosure. |
| Narrow a research set | Keep common filters in a stable location and add controls that serve the current view. Show active constraints and provide an explicit reversal. A searchable choice can combine lookup and selection. | Hidden filters must not silently alter another view. Confirm the same selected identities, counts and export population through navigation. A small fixed vocabulary may work better as ordinary visible choices. |
| Read dates and places | Preserve the source expression and its role. Display readable dates, intervals and open bounds. Distinguish the place depicted, place of production and current holding location. | Indexing bounds may serve sorting without being event dates. An unknown location remains unknown. Inspect examples where a precise-looking mark would overstate the source. |
| Follow a stable identifier | Use a meaningful authority link near the entity. Expose the full identifier through an accessible explanation and a copy action when needed. Keep a shelfmark or other identifier visible when researchers use it to distinguish records. | An authority reference applies to its recorded entity or assertion. It must not merge similarly named people by implication. Identifiers used in citations remain recoverable and exports retain them. |
| Recognise a permitted LLM-produced value | Establish the project inclusion policy first. For permitted values, attach one consistent status icon to the affected value, with an accessible name and an explanation available on focus and tap. Keep the source and recorded review reachable from that value. | Excluded values must not contribute to search, counts, diagrams or exports. Production and verification describe different activities. A badge on an entire record can wrongly qualify unrelated fields. Essential status cannot depend on hover or colour alone. |
| Annotate a source | Keep the exact quotation beside the interpretation and its saved or unsaved state. Source navigation, editing and export preserve the annotation's anchor. | An annotation can need more reading space than a collection row. Optional technical provenance may be collapsed while the quotation and unfinished work remain visible. |

The [review decision table](../knowledge/design.md#reusable-review-decisions) defines task conditions and exceptions, including identifiers, missingness and cross-component redundancy.

For each proposed reuse, build a complete small research episode before spreading its components to other views. Use a dense case, a relevant unknown value and a recovery action. Compare the original source, visible statement, selected record identities and retained result. Keep any deliberately synthetic boundary inputs separate from historical evidence.

The repository procedures `research-ui-design`, `research-ui-evaluate` and `research-ui-improve` under `.agents/skills/` apply these decisions. Their evidence follows the [UI acceptance protocol](../knowledge/testing.md#ui-acceptance-protocol). A new public example requires its own source snapshot, rights record and screenshots. Transfer general patterns from commissioned work through a fresh example without copying customer material or private project history.

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
