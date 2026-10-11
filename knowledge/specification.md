---
title: Specification
project:
  name: Fancy Research Tools
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Specification
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/specification
status: draft
language: en
created: 2026-10-10
updated: 2026-10-11
---

# Specification

The [project scope](project.md#functional-scope) defines the reference tool, guided applications and technical examples. The requirements below specify observable behaviour for those routes. [Testing](testing.md) records execution evidence and pending acceptance.

## Project entry and navigation

- NAV-01: The start page provides an overview and links to Tools and Documentation. The project header presents Overview, Tools and Documentation with equal visual weight.
- NAV-02: The gallery puts Collection Explorer first and groups remaining entries by capture, analysis, correction and edition building. It identifies material, actual previews and whether the destination is an application or setup guide. The public bibliography is a reading interface; its correction entry opens the curation guide. Local workspaces provide All tools as a return path. External applications open through ordinary links with a visible host. Text remains selectable without triggering navigation. Templates receive setup links rather than a browser-tool launch claim.
- NAV-03: Documentation section navigation and page outlines remain visible at desktop and narrow widths. Additional disclosures require a specific optional-detail need under the [design contract](design.md#project-navigation).

## Prepared SZD workflow

| ID | Behaviour | Acceptance evidence |
|---|---|---|
| SZD-01 | Capture and edition guides use the same attributed, explicitly machine-produced source package. Downloads preserve the published file bytes. | Compare downloads with the package manifest and [source contract](data.md#szd-edition-example). |
| SZD-02 | The capture exercise can be imported, edited, exported and reopened in teiCrafter without unexplained source loss. | Operate the complete browser sequence and compare retained source, page references and declared changes. Schema validity alone does not satisfy this criterion. |
| SZD-03 | The edition exercise produces a reading frontend with the expected source text and facsimile references. | Build and inspect the complete frontend. Parser compatibility alone does not satisfy this criterion. The external-TEI adapter makes no correction-server round-trip claim. |
| SZD-04 | The Klawiter guide distinguishes public reading, local correction, patch export and downstream application. | Inspect the actual correction path and disclose the unresolved propagation boundary before claiming canonical correction of all outputs. |

## DH pilot contract

`/baseline/` retains the read-only Met catalogue for controlled comparisons. `/pilot/` uses the [investigation workbench contract](#investigation-workbench-contract). The baseline task and independent expected results are in `benchmarks/cases/met-instruments/`.

Search matches a normalized substring across title, object name, culture, descriptive date and medium. Exact classification and culture filters combine with a missing-field filter. Counts, group distributions and missingness use the current filtered population. Original labels and descriptive dates remain visible, with a distinct missing group and explicit empty results. Export preserves the applied filters, summaries, selected source records and snapshot provenance.

Title, date, culture and maker headers sort in both directions. Date order uses the source `beginYear`, which is an indexing bound under the [source semantics](data.md#sources). Missing values remain last in both directions and object ID resolves ties. Sorting preserves the result population, counts and selection.

Grouping and chart filtering apply current form values through the same query transition. Pending search inputs remain identifiable, while rendering and export consume applied state. A matching selection stays visible. A filter that excludes it selects a matching record or exposes an empty detail state. This differs from the editor's retained out-of-result selection under [recovery and replacement](#recovery-and-replacement).

All distribution categories remain reachable. The distribution and table share a population, and the chart's filtering purpose is visible. A single contextual result count, comparable rows and one directly visible detail pane support the baseline task. The header carries the tool title and export action. A native About dialog provides the source, declared sample selection, snapshot, limitations and guide. The footer carries About and distinguishes data and code licences. The dialog supports a close button, Escape and focus return.

## Requirements

### UI refinement acceptance

The [design contract](design.md) governs hierarchy, visual encodings and interaction across documentation, exploration and editing. The following outcomes are acceptance targets for the commissioned UI revision. Verification follows the [UI protocol](testing.md#ui-acceptance-protocol).

| ID | Observable outcome | Required evidence |
|---|---|---|
| UI-01 | Each route exposes its primary task before extended explanatory material. | Desktop and narrow-layout review plus an observed first action. |
| UI-02 | Icons support understandable labelled actions across routes. | Label, focus and keyboard inspection, with local asset verification. |
| UI-03 | Baseline distributions and metadata gaps expose exact values and their scope. | Chart values match the independent oracle, including filtered and empty results. |
| UI-04 | Chart interactions and filters share query semantics and reversible state. | Keyboard selection, reset, URL reload and back navigation retain the expected selected IDs. |
| UI-05 | Selected-object details expose source qualifiers directly, with important limitations and recovery messages visible. | Source comparison, selection interaction and existing editing/storage regression checks. |
| UI-06 | A researcher completes the task and correctly explains its result and limits. | Observed task completion and interpretation recorded separately from automated tests. |
| UI-07 | Pending inputs, applied filters, selected record and exported population remain distinguishable through mixed interactions. | Type a search, operate a chart, inspect and export results; cancel navigation with a dirty editor and check both draft and controls. |
| UI-08 | The desktop catalogue at `/baseline/` keeps controls, comparable result rows and selected-object evidence in one working viewport. Narrow layouts retain all content in a usable reading order. | Inspect 1440×900 and 1366×768 desktop states and 320 CSS-pixel reflow; operate every scroll region by keyboard and inspect long details. |
| UI-09 | The catalogue table at `/baseline/` supports understandable, deterministic sorting without changing the result population. | Operate all sortable headers in both directions, verify `aria-sort`, source-date order, missing values last, stable ties and preserved selection. |
| UI-10 | About exposes provenance and limitations without crowding the working header. Data and code licenses remain distinct in the footer. | Open and close the dialog by keyboard, verify focus return, sample details, snapshot, guide destination and separate CC0/MIT links. |

### Planned version 0.2 acceptance

These criteria govern the version 0.2 increment. [Testing](testing.md) identifies satisfied and pending criteria, while `knowledge/plan.md` maintains the remaining work. The development approach is defined by [Project](project.md#purpose).

| ID | Planned outcome | Required evidence |
|---|---|---|
| V02-01 | Start from a question, idea, material, method or existing workflow and develop an explicit research task. | A worked iteration records inputs, missing context, alternatives, a prototype observation and the resulting knowledge revision. |
| V02-02 | Acquire methodological knowledge appropriate to the task. | Source passages, reading limits, method prerequisites, alternatives and applicability are recorded separately from agent proposals and human decisions. |
| V02-03 | Use a browser interface and the simplest stack adequate to the requirements. | An architecture decision connects dependencies and any additional processing or services to concrete requirements. |
| V02-04 | Demonstrate one complete interdisciplinary case with real open data. | A reproducible source snapshot, rights record, explicit data semantics and a full exploration or analysis workflow with independently checked output. |
| V02-05 | Exercise a contrasting capture or annotation adaptation. | A bounded runnable workflow with real material records reused, modified and replaced parts and preserves its domain distinctions. |
| V02-06 | Preserve existing user work while separating responsibilities. | Regression checks cover import/export, unsaved forms, storage failures, stale copies and deliberate handling of v0.1 drafts and schema versions. |
| V02-07 | Make the approach reproducible by another developer or agent. | An independent attempt uses repository instructions without hidden conversation context, records interventions and reports unresolved limitations. |
| V02-08 | Present a reviewable local release candidate. | Production build, relevant unit and browser checks, manual interaction review and source/knowledge consistency are recorded. Human research acceptance is recorded separately and remains pending until actually provided. |

Acceptance must name the research activity, material structure, file format and collaboration context. The [project scope](project.md#functional-scope) bounds supported cases and linked applications.

### Functional requirements

FR-01 through FR-07 apply to the flat metadata editor at `/tool/`. FR-08 applies to publication of project guidance.

| ID | Behaviour | Acceptance evidence |
|---|---|---|
| FR-01 | Explore records through search, kind filtering and selection. | Browser test exercises combined controls and empty results. |
| FR-02 | Restore explorer state from the URL. | Reload and navigation preserve supported query state. |
| FR-03 | Edit title, record type, place, date, source, notes and review status in a working copy. | Browser test edits and exports a record. |
| FR-04 | Validate imported collections before replacing working data. | Invalid imports leave the existing collection intact. |
| FR-05 | Export a collection that can be reimported without field loss. | Round-trip test compares structured values. |
| FR-06 | Preserve the supplied baseline during local edits. | State test checks baseline immutability. |
| FR-07 | Recover supported drafts after reload and expose storage errors. | Reload and unavailable-storage scenarios. |
| FR-08 | Publish selected specifications with practical guides. | Build and link checks include the publication allowlist. |

### Non-functional requirements

| ID | Requirement | Assessment |
|---|---|---|
| NFR-01 | Provide labelled controls, visible focus and keyboard operation. | Automated checks plus manual keyboard review. |
| NFR-02 | Reflow on small screens without hiding essential actions. | Browser viewport review. |
| NFR-03 | Render imported values as text and validate external links. | Hostile-input tests and browser inspection. |
| NFR-04 | Build from the committed lockfile with locally bundled assets. | Clean install and production build. |
| NFR-05 | Keep process documents outside the public site build. | Inspect generated output. |

## Recovery and replacement

The editor preserves its supplied baseline and edits a separate working collection. Export downloads a new file containing the complete collection, including records outside the current filter. It writes neither to the original file nor to a remote repository. Keep an exported copy for recovery because browser storage can be unavailable or cleared.

An invalid import leaves current work intact. An edit exceeding the [collection limit](data.md#limits) remains in the form for correction. Filtering may retain a selected record outside the results and must explain that state. Cancelling dirty-form navigation restores applied search controls while preserving the unfinished form. Saving the form precedes export in the editing walkthrough.

All author-editable workflows preserve accepted text under [the exact-string rule](data.md#relationship-to-source-material). An unrelated edit, view transition or export must not normalize another field. Imports validate completely before replacement and protect edits made while a file is being read.

The editor, investigations and notebooks keep independent recovery state. Each reports unavailable storage and preserves a detected stale or corrupt copy before offering recovery. A protected corrupt editor copy requires explicit overwrite confirmation. Investigations and notebooks block further persistence after detected conflicts and keep export available. A missing storage key differs from a stored empty string. An unchanged restored investigation, including version 1, requires no write or unload warning. Sequential stale-copy detection provides no atomic collaboration guarantee.

Investigations preserve saved notes even with no selected records, while identifying that state as unfinished work. Annotation crash recovery covers saved notebook state only. Pending annotation forms remain in memory and require save or discard before import, export or source navigation, with a leaving warning for unsaved work. Route-specific requirements below define compatibility and source checks.

## Epics and user stories

### Explore a collection

As a researcher examining a collection, I want to narrow records and inspect their source so that I can decide which material merits closer reading.

This is an implementation assumption derived from the commissioned starter. Its usefulness requires observation with representative researchers. FR-01 and FR-02 implement the scenario through the explorer.

### Prepare a correction

As a researcher correcting descriptive metadata, I want a recoverable working copy and an explicit export so that I can submit my changes for review.

This is an implementation assumption. FR-03 through FR-07 implement the scenario. A browser workflow does not establish institutional review authority.

## Functional scope

### Open photograph reference

The independent `/photographs/` tool compares an openly licensed historical-photograph sample. Its research task is to retain a small selection, compare catalogue date/creator/technique descriptions, inspect the image and retrieve its source without losing context. Source selection and rights are governed by [Data](data.md), and the first-view contract by [Design](design.md#photograph-study).

| ID | Behaviour | Acceptance evidence |
|---|---|---|
| PHOTO-01 | Search and relevant filters coordinate collection and chronological views. View, query and retained selection are addressable. | Filtering, browser Back and reload reproduce independently expected record identities. An empty result preserves a recovery action. |
| PHOTO-02 | Every chronological entry shows the source date qualification and opens the photograph directly. | Approximate/range dates remain qualified, original text stays accessible and dense entries remain operable. Ordinal layout makes no proportional-duration claim. |
| PHOTO-03 | Image inspection preserves context and supports direct pan/zoom and keyboard operation. | Operate the locally bundled viewer, open a direct image fallback, return to the same query/selection and check narrow reflow. |
| PHOTO-04 | Up to four retained photographs can be compared and exported with their original source evidence. | Independent expectations agree with the actual downloaded IDs, source fields and snapshot identity. Clearing/removing selection changes no other tool's saved work. |
| PHOTO-05 | Source and derivation remain distinguishable, with original date/creator qualifications and image rights inspectable. | Check source cases against the frozen raw records. Culture or museum location is never rendered as a capture/depicted location. |

The photograph reference has separate data and route state. It introduces no annotation editor or persistence migration for existing investigations. A declared access route, accessible image fallback and retained original values remain available if enhanced image rendering fails.

### Existing collection workflows

The explorer operates on the supplied collection and exposes shareable navigation state. The editor manages a local working copy. Switching research domains requires changes to the [data contract](data.md), validation, controls and tests together.

## Adaptation scenarios for investigation

| Candidate scenario | Adaptation question | Evidence needed |
|---|---|---|
| Structured editing informed by TEI Crafter | Can an agent adapt the foundation to a project's text structure and editorial rules? | Source-preserving import/export, validation examples, editing and recovery tasks, expert assessment |
| Correspondence exploration informed by CorrespExplorer | Can an agent support people, places, dates and their uncertainty without flattening their meaning? | Documented source mappings, exploration tasks, missing-data cases and review of derived views |

These scenarios express intended investigations. The local editor implements a descriptive correspondence projection with original sender, recipient, date and place values. A general CMIF importer, correspondence-network exploration and TEI editing remain outside this starter. The gallery links existing applications for those broader tasks. Any adaptation must inspect its source tool and material, then compare what it reuses, changes and replaces before fixing shared interfaces.

## Decisions

### ADR-001 Bounded browser starter

The [project scope](project.md#functional-scope) limits the starter to inspectable static-browser adaptations. Actual cases must justify any additional shared interface or service.

### ADR-002 Explicit interchange

Portable export is the durable recovery path. The [recovery contract](#recovery-and-replacement) defines behaviour when local continuity fails, and [Data](data.md) defines supported formats and rollback.

### ADR-003 Canonical specifications

The documentation build publishes selected maintained contracts through the [explicit architecture allowlist](architecture.md#documentation-and-gallery). Each fact has one authored maintenance location.

### ADR-004 Reference cases and evidence

The [project data policy](project.md#data-basis) requires real open material for visible examples and permits synthetic boundary tests. Acceptance follows [UI-06](#ui-refinement-acceptance) and [DEV-04](#development-and-handover-acceptance), with source and production claims under [Data](data.md#provenance-of-individual-values).

## Provisional concept-study requirements

The three concept routes support the same research episode: find records using the pilot's metadata search fields, select two to four candidates, inspect original descriptions and uncertainty, remove/reselect candidates, write an observation and unresolved question, and download a research artefact. Source records and source provenance are preserved; researcher text is separately identified. Search must not erase the retained comparison selection. Empty selection cannot produce a misleading completed comparison. Each concept uses the investigation exchange and local recovery contract in [Data](data.md#investigation-exchange). Save success, failure and replacement are explicit. Export/reopen also preserves notes without selected records, which is unfinished work rather than a completed comparison. Each concept exposes a route back to the concept comparison. These requirements scope the study, not every future research tool.

## Investigation workbench contract

- IW-01: At `/pilot/`, inspect the real frozen catalogue through search, classification, pagination and title or catalogue-date ordering. Original attribution qualifiers remain visible.
- IW-02: Select up to four records, change search without losing that selection, compare original fields and record a research question, observation and unresolved question. Browser navigation remains usable.
- IW-03: Restore locally saved investigation state after reload. If storage fails or another tab changes or clears the draft, preserve the existing stored bytes, allow export of current work and warn before leaving with work that is no longer saved.
- IW-04: Export and reopen the canonical investigation, preserving selected source evidence, provenance and separately authored notes. Preserve accepted whitespace and line endings until the corresponding text field is edited. Reject unsupported or changed evidence before replacing work. Confirm valid replacement and abort a file read if intervening edits would be lost.
- IW-05: Keep readable content selectable, avoid introductory sublines, support keyboard focus and a readable narrow comparison region, and provide explicit source and rights context through About and record links.
- IW-06: Inspect comparison-value provenance through a labelled Source control and addressable reading view. Show original values, transformation, publisher, unknown original producer, source identity and technical-check scope. Keep source uncertainty visible in comparison and restore focus on return without changing work.
- IW-07: Create version 2 exports containing selected field evidence, accept exact version 1 files and drafts, and leave legacy source/stored bytes untouched on opening. Reject changed field evidence before replacing the current investigation. Preserve original exports as the rollback path.

The instrument study is a candidate research workflow. Human acceptance and interdisciplinary transfer remain separate from engineering checks. The baseline and concepts remain accessible for controlled comparisons, with task scope recorded before comparing results.

## Contrasting annotation contract

- AN-01: At `/annotations/`, read the full frozen text of archived NOAA/NHC Milton discussions 2 and 6, with original source link, issue time and printed forecaster attribution. Distinguish this historical material from current operational guidance.
- AN-02: Select an exact contiguous passage by pointer or keyboard, categorize it as observation, forecast or stated uncertainty, and save a separate interpretation. Preserve quoted text, source identity and exact offsets.
- AN-03: Record creator kind and name as self-declarations. A source-fit review requires a named reviewer, an explicit criterion and a supports/does-not-support/unclear result. Editing reviewed content clears its prior review; no actor type automatically establishes trust.
- AN-04: Edit and remove annotations, retain a research question, recover locally saved work, export a complete notebook and reopen it in a fresh context. Preserve accepted author text until its own field is edited, and protect unfinished forms during source navigation or file replacement.
- AN-05: Reject altered sources, mismatched quote anchors, duplicate annotation IDs, unknown fields, unsupported versions and oversized files before replacing work. Keep corrupt or externally changed browser copies intact and expose a recovery export plus unload warning.
- AN-06: Keep the Met investigation and collection editor schemas, source identities, drafts and routes unchanged. Document which responsibilities the annotation case reuses and which it replaces. Tests establish the bounded technical contrast; human interpretation remains for operator and domain review.
- AN-07: At `/letters/`, read the Benndorf letter with author, recipient, date, place, edition and rights context. Annotate exact passages as Person, Place, Research topic or Editorial question. Preserve the frozen raw transcription and explicitly identify the LF display transformation. Keep this case's notebook and storage separate from the existing NHC case, reject cross-case imports and preserve unchanged NHC exports byte for byte.

## Correspondence metadata contract

- CM-01: A fresh editor starts with the frozen CC0 Schönbach CMIF projection. An existing valid draft takes precedence. The original synthetic fixture remains supported input, and collection schema 1 and its storage key stay unchanged.
- CM-02: Show original correspondence values and edition identity beside the editable description. Source evidence requires both the known record identifier and exact source identity. Imported same-ID records with another source must not inherit a verification claim.
- CM-03: Preserve the full frozen XML separately from the descriptive JSON. Title construction and the assigned Letter type are explicit transformations. Date, place and source qualifiers retain their source values. The default manual review state is Draft.
- CM-04: Editing, cancelling, exporting and reopening preserve working fields under the existing bounds and recovery contract. The export is a flat descriptive collection and must not be presented as a lossless CMIF round trip.

## Development and handover acceptance

The [five development commitments](project.md#development-commitments) govern the whole project. A prepared guide or protocol is implementation of the procedure; empirical acceptance requires its actual use.

| ID | Development outcome | Required evidence |
|---|---|---|
| DEV-01 | A researcher can start with a question, material or existing workflow in ordinary language and inspect a working slice. | The start guide supplies a copyable prompt and example; a real novice session records prerequisites, assistance, task result and understanding before claiming independent use. |
| DEV-02 | An existing tool can be adapted without losing its material or work. | Reproduce the prior workflow, preserve a referenced baseline and original exports, classify retained/changed/replaced parts, and test old plus new interchange and recovery. |
| DEV-03 | Another responsible person can maintain or retire an adaptation from its handover. | Record ownership or explicit vacancies, environment, supported versions, upgrade and rollback procedure, preservation/export path and outstanding checks. Demonstrate recovery; do not infer a long-term service commitment. |
| DEV-04 | Reuse claims reflect independent use. | Observe people outside implementation on relevant tasks, record failures and help, and bound claims to the observed cases. Agent-only trials remain preparation. |
| DEV-05 | Development-method claims have a traceable basis separate from product usefulness. | Follow the published development study protocol with a declared comparator, task/material/tool identity, interventions, outcome checks and held-out case. Report unperformed comparisons explicitly. |

The [testing record](testing.md) identifies executed procedure trials. The project plan retains independent researcher sessions and comparative method work until evidence is recorded.
