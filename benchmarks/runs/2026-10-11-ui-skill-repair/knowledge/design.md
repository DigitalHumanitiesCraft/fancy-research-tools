---
title: Design
project:
  name: Fancy Research Tools
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Design
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/design
status: draft
language: en
created: 2026-10-10
updated: 2026-10-11
---

# Design

Each research tool has an interface and visual identity derived from its research task. Fancy Research Tools shares engineering quality and accessible primitives. It does not prescribe DHCraft branding or a universal application shell. The operator replaced the initial DHCraft reuse decision with task-specific design on 2026-10-10.

## Operator default profile

The operator confirmed an adaptable default profile on 2026-10-11. It favours compact task-specific views, aligned comparable fields, restrained labels and directly visible evidence needed for the next decision. Optional details deepen inspection while preserving context. The [interface copy constraint](#interface-copy-constraint) governs introductory sublines in this repository. These presentation choices express the operator's preferences and remain distinct from empirical usability findings.

Adopters may revise this profile in their own design contract and bring their local agent instructions and acceptance checks into agreement. Within Fancy Research Tools, the current profile continues to apply. Accessibility, source fidelity, uncertainty, rights and recoverable working state remain independent requirements when presentation changes. Each tool still derives its layout and density from its research task.

The profile also carries the operator's repeated interface decisions. Use aligned fields and ordinary spacing instead of middle-dot separators. Show counts when they explain a changed result or selection, without adding a permanent count heading to an already labelled view. Keep shelfmarks visible where they distinguish cited material; integrate authority identifiers as meaningful links with accessible explanation and copying when needed. A short identifier does not need its own disclosure. At an LLM-produced value, use the same named status icon with an explanation on focus and tap. Its presence and accessible name communicate production without hover; a separate recorded review never replaces that production status. Record-wide badges must not imply that unrelated fields share it. Routine evidence access should not require nested accordions. Optional technical traces may remain collapsed.

## Task hierarchy

The operator rejected the preceding gallery and its interfaces on 2026-10-10. The critique concerned opaque tool names, development-history categories, eyebrows and introductory copy, excessive text and generic layouts. The revised candidate below uses real project examples and task-based entry points. Operator assessment of this revision remains open. Successful engineering checks do not establish design acceptance.

The revision must make the activity, material and useful result understandable at entry, then organize each workspace around the actual research action. Gallery grouping should follow meaningful user-facing capabilities. Prototype variants and historical status belong in development context. The exact new grouping and layouts remain design proposals until reviewed. Reducing copy must preserve source wording, uncertainty, field meaning and actionable state feedback.

| Surface | Primary content | Supporting content |
|---|---|---|
| Project overview | Entry to the tool gallery and development guides | Project scope and research basis |
| Tool gallery | Transcribe and annotate, edit texts and metadata, explore and compare | Hosting destination, real material and a separate edition template |
| Documentation | Adaptation guide and maintained contracts | Visible section navigation, page outline and evidence references |
| Collection comparison | Comparable catalogue columns, retained selection and authored observations | Addressable field provenance, recovery and explicit export |
| Collection editor | Selected source record and editable fields | Validation, draft recovery and import/export |
| Concept study | Alternative research interactions on the same material | Comparable evaluation and explicit human feedback |
| Source annotation | Original letter or forecast beside an exact quotation and interpretation | Source authorship, date, declared annotation creator and recorded review |

The current `/pilot/` is Compare collection records. Collection and Comparison are separate addressable views. A semantic table places object, catalogue date, material and attribution in shared columns, with selection beside each record. A retained selection connects the table to the comparison matrix. Research question and notes belong to that investigation. The comparison keeps original wording alongside the writing area. Field evidence has its own addressable source view. Horizontal scroll regions preserve readable columns on narrow screens, with ordinary document flow outside them.

The previous three-pane catalogue is preserved at `/baseline/` for the earlier filter/aggregation task and regression checks. It is not the current design recommendation. Its outcomes are not interchangeable with the new investigation workflow.

At `/pilot/`, the header carries identity, Collection/Comparison navigation and export. About and separate data/code license links live in the footer. Source selection, sample limitations and snapshot context live in About. Source links and uncertainty remain with the evidence. No blanket hiding of information required for interpretation follows from reducing introductory copy.

## Photograph study

The new `/photographs/` reference supports comparing catalogue descriptions of historical photographs and examining their images and sources. It uses a separate openly licensed sample. Collection, Timeline and a selected-image route preserve the same query and selection. The operated review is recorded in [Testing](testing.md#open-photographs-and-ui-skills-2026-10-11); human assessment remains pending.

| View | First decision and visible evidence | Action and optional depth | Wide and narrow layout |
|---|---|---|---|
| Collection | Choose photographs to inspect or compare using thumbnail, title, original date wording, creator and technique. | Open the photograph directly or retain it in a small comparison selection. Search and relevant creator/process filters remain visible. | Compact aligned entries on wide screens, readable stacked entries on narrow screens. Content receives the larger share of the viewport. |
| Timeline | Inspect chronological order while seeing each photograph and its qualified catalogue date. | Select a directly operable mark or its attached preview. Original qualifiers stay visible. | Vertically scrollable, ordinal chronology with explicit year grouping and no proportional time ruler. Mark spacing accommodates evidence and does not claim elapsed duration. |
| Photograph | Examine the image and the catalogue wording together. | Direct image pan/zoom through locally bundled OpenSeadragon with keyboard controls and a usable image fallback. Source values and a named museum link are directly available. | Image dominates the wide view beside compact structured fields. Narrow layout places image then fields in ordinary reading order. |
| Comparison | Compare retained photographs by the same date, creator and technique fields. | Inspect each source or export the selected evidence. Removing an item preserves the remaining selection. | Aligned fields with a bounded horizontal comparison region where necessary; no document-level horizontal overflow. |

The visual direction uses a neutral light surface, dark ink and one restrained blue action colour, system typography and compact spacing. It inherits accessible primitives without importing the other tools' layouts. Source qualifiers and actionable failures retain readable contrast. No introductory subline, permanent unfiltered collection counter or repeated metadata caption is added. Identifiers become useful source links or accessible optional details, and no LLM provenance icon appears for catalogue-only data. A map requires separately sourced, typed geographic relations. Culture and museum location do not establish a photograph's depicted or capture location.

## Project navigation

Overview, Tools and Documentation are equal navigation links in the project header. Overview gives direct access to research activities and development guides. The gallery identifies each tool's action, material and destination. Local workspaces provide All tools as a return link. External applications retain their published navigation and open through ordinary links, so browser Back remains available.

The gallery uses compact entries with actual working-state screenshots and explicit action links. Text stays selectable. Categories describe activities, and published applications retain their established names. Hosting domains distinguish external applications from local workspaces. The Agentic Edition Pipeline has repository and setup links under Build an edition because it requires project configuration. Interface variants are reachable through [Design studies](../concepts/). The [historical catalogue](../baseline/) remains available as a development baseline outside the gallery's tool categories. Integration does not assert design acceptance or operational readiness of an external application.

Documentation navigation and the page outline remain visible. Wide layouts place them beside the article. Narrow layouts show the article first, followed by the outline and section navigation, with a skip link to the content. Disclosure is appropriate for additional detail requested during a task, such as field hashes and derivation records. Keep information needed to choose an action or interpret evidence visible, including source identity, uncertainty, errors and unsaved work. Compactness alone does not justify a disclosure control.

## Annotation workspace

The primary gallery example opens `/letters/` with Benndorf's letter to Schuchardt of 14 February 1879. It uses the public-domain plaintext supplied with teiCrafter, excluding the edition's apparatus and images. Person, Place, Research topic and Editorial question are proposed annotation categories. Author, recipient, edition editor and publisher describe the source, independently of the annotation creator and reviewer. The letter and frozen source identifiers remain selectable. The source panel occupies the larger share of a wide workspace; annotation controls start with the quotation and interpretation, followed by compact creator and optional review fields.

The contrasting annotation tool at `/annotations/` supports reading archived NOAA/NHC Hurricane Milton discussions 2 and 6 from October 2024, selecting an exact passage and recording how that passage functions as observation, forecast or stated uncertainty. This is a research task hypothesis for operator review. It does not supply current weather guidance. The full frozen bulletin, issue time, forecaster and original source link remain visible beside the annotation controls. Attribution printed in the source is distinguishable from a self-declared annotation creator and a separate recorded reviewer.

The initial view starts with the bulletin selector and source text. A read-only text control supports pointer and keyboard range selection, followed by Annotate selection. The quotation stays visible while the researcher chooses its category and writes a note. Saved annotations form a compact list with actions to return to their source, edit or remove them. The selected bulletin is addressable in the URL. Changing source while an annotation form is unfinished requires deliberate discard; saved work and other annotations remain intact.

On wide screens the source and annotation form remain adjacent because editing depends on the wording being visible. Narrow layouts use source, form and saved annotations in reading order. The tool uses its own restrained blue/ink tokens, ordinary system typography and monospace bulletin text to preserve the source's line structure. There are no introductory sublines, generic dashboard metrics or decorative cards. Technical hashes belong in source details; dates and the archived character of the material remain visible where they affect interpretation.

A review records whether the quotation supports the annotation under an explicit criterion. Creator kind and name are self-declarations. Reviewed annotations display the named reviewer, criterion and result. Changing the anchor, category, note or creator clears that review, because it describes the earlier annotation. No default identity, automatic confidence score or successful scientific-validation claim is inferred.

## Design system

Each tool owns its typography, spacing, density and semantic colours. Collection comparison uses green/ink tokens and compact source columns. The annotation tool prioritizes readable source text, with monospace reserved for the bulletin's meaningful line structure. The editor retains amber accents and places the record list beside the selected source and correction form. Icons accompany action labels. The gallery uses the project's system type and blue links with ordinary document flow, without enclosing every entry in a padded card.

`src/ui/foundation.css` supplies the shared reset and hidden-state rule used by the concepts. `src/research/recovery.css` styles their recovery controls. Documentation and the historical catalogue share `src/ui/styles.css`; the editor and current workbench own separate stylesheets. Shared code establishes accessible behaviour without requiring one appearance.

Design review includes text selection, visible focus, keyboard activation, meaningful reading order, supported empty/error states, narrow reflow and text enlargement. A screenshot is evidence of appearance only. Source fidelity, recovery and research usefulness need their own checks in [testing](testing.md).

## Information visualisation

Choose a visual encoding from the research task and available data. The following are project design decisions to evaluate with researchers.

| Task and material | Suitable starting view | Required qualification |
|---|---|---|
| Compare categorical counts | Labelled horizontal bars with exact counts | Zero baseline, explicit denominator and stable ordering |
| Find missing metadata | Per-field present/missing counts or bars | Label absence as absence in this snapshot; each field has its own denominator |
| Inspect individual evidence | Comparable rows with directly visible selected-object details | Preserve original wording, attribution qualifiers and source links |
| Compare dated observations | Timeline only after the date semantics are established | Represent ranges and uncertainty without inventing precise dates |
| Examine geographic relationships | Map when coordinates and their meaning support the task | Preserve uncertain locations and disclose excluded or unlocated material |
| Examine relationships | Network when explicit entities and relations support a question | Explain edge meaning and avoid reading layout proximity as source evidence |

The historical catalogue baseline uses categorical distributions and metadata gaps as an overview of the same filtered sample shown in the table. The group area names its filtering purpose and its caption explains that selecting a group narrows the table. It is a coordinated view of the same records. Every quantitative view states its population and keeps exact values available as text. Bars start at zero. If lengths use the largest displayed count as their maximum, label that scale explicitly. A percentage names its denominator. Zero-result views preserve the active query and provide a reset action. An empty denominator produces an explicit empty state, without an invented percentage.

Keep missing categories visible. Any top-N truncation states the omitted count and provides access to the remaining values. Filtered diagrams, record counts and exports derive from the same query state. Interactive chart marks use keyboard-operable controls with visible selected state. Provide an equivalent labelled list or table and a concise description of the view's purpose. Tooltips may supplement information that is already available through focus or ordinary content.

Source categories retain their original labels. Derived grouping and selection are distinguishable from source assertions. A small selected sample supports statements about that sample. Representative or causal interpretation requires additional methodological evidence under the [data contract](data.md).

## Interaction patterns

Search and classification change the visible collection while retaining the comparison selection. Pagination keeps the list bounded. Title sorting is alphabetical; chronological sorting uses catalogue indexing starts with missing values last. This ordering does not infer precise creation dates. Collection filters are represented in the URL. Browser navigation restores that view state.

The investigation contains up to four original source records, the question and separately authored notes. Local recovery and portable export/reopen share a validated contract. Invalid imports preserve the existing work, and replacement requires confirmation. Blocked storage or a changed copy in another tab produces actionable feedback without overwriting that copy. These protections are not atomic collaboration.

A route change focuses the destination heading. Selection buttons retain focus when their state changes. Removing a comparison record moves focus to an existing destination. All readable text remains selectable. Source links use a checked URL and announce external navigation.

The collection editor keeps its own schema and persistence key. Its selected identity can remain outside the current filtered list. Cancelling a dirty-form navigation preserves inputs. Its `draft` or `checked` state is a manual user assertion under the [data contract](data.md#limits); it does not record an automated check or establish scholarly correctness.

## Accessibility basis

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) supplies criteria for keyboard access, visible focus, contrast, reflow, labels and status messages. They guide implementation and review. The [W3C guidance on complex images](https://www.w3.org/WAI/tutorials/images/complex/) supports descriptions and access to represented data. Automated checks provide partial evidence. A conformance claim requires assessment of the complete applicable requirements and workflows.

## Action-layer connection

The Design principles section of the repository's `AGENTS.md` translates this design into implementation rules. Adaptation establishes a tool-specific design from the research workflow and preserves the shared accessibility and state-integrity contracts. Existing institutional branding is a separate project choice.

## Interaction concept study

Three alternative research workflows are implemented under `concepts/`, with a shared task and real frozen Met records. Atlas tests object-led discovery and a collection tray. Bench tests comparison-first work. Trail tests a question-led sequence with revisitable state. Their visual identities and interaction models are hypotheses under comparison, not a combined product specification. The shared benchmark task, source-data constraints and evaluation protocol live in `benchmarks/ui-concepts-brief.md` and `benchmarks/ui-concepts-protocol.md`.

The common outcome is a selected set of source records plus a separately identified observation and unresolved question, downloadable with provenance. This tests a transition from lookup to a retained research artefact. It does not establish scientific usefulness before researcher review. No fabricated images are used; the source projection contains textual catalogue metadata.

## Task-based interface review

The subline rule below is one concrete design constraint within a broader review. Every component, label, number and disclosure must support a named research action, interpretation or recovery need. Remove duplicated orientation, decorative metrics and status badges without defined semantics. Choose table, list, comparison or visualisation from the material and task rather than imposing a recurring card-and-dashboard layout. Required evidence must remain near the decision it qualifies. Colour and visual prominence must not imply a degree of certainty that the data cannot support.

Source, interpretation and uncertainty remain distinguishable in ordinary reading. Original qualifiers stay in the comparison cell. The workbench's Source control opens an addressable reading view with raw values, mapping and limited technical checks. Missing authorship and absent recorded reviews are explicit. Implementation identifiers and checksums belong in that requested view. Return to comparison restores focus without changing the question, selection, notes or saved state.

## Project examples

The [DHCraft portfolio](https://dhcraft.org/fancy-research-tools/) supplied the starting inventory. The linked applications and selected working states were inspected on 2026-10-10. The gallery is generated from `data/tools/catalog.json`, which records destinations, material, access limits and source repositories. Its screenshots show observed application states, including local files loaded into existing tools. A preview is not a claim that an external application starts with that exact state.

| Project | Useful task and integration | Boundary |
|---|---|---|
| [coOCR/HTR](https://dhcraft.org/co-ocr-htr/) | Inspect a page image beside its transcription; launch the existing application. | LLM actions require provider configuration. No scan collection is republished here. |
| [teiCrafter](https://dhcraft.org/teiCrafter/editor.html) | Edit TEI while retaining source text and structural checks; launch the existing editor. | The published editor and current local development differ. The preview uses its real SZD sample. |
| [CorrespExplorer](https://dhcraft.org/CorrespExplorer/) | Explore correspondence through explicit people, dates and places; launch the existing application. | The preview uses the real HSA dataset, distinct from its synthetic feature demonstration. |
| [SZD-HTR](https://chpollin.github.io/szd-htr-ocr-pipeline/) | Inspect transcription and recorded review states in their source collection. | The hosted viewer does not provide the local project's full editorial service. |
| [Stefan Zweig Bibliography](https://chpollin.github.io/klawiter-rescue/) | Search bibliographic records while distinguishing extraction, enrichment and curation. | A recorded production method does not establish expert verification. |
| [Agentic Edition Pipeline](https://github.com/DigitalHumanitiesCraft/agentic-edition-pipeline) | Start a project pipeline from images through transcription, review and TEI to a reading edition. | Repository template with a synthetic quickstart, requiring setup and project-specific data. |

The local letter annotation and metadata editor reuse published project material under the [data contract](data.md). The selective internal workflow review also informed source inspection and the separation of original values from corrections. No internal project records, institutional datasets or credentials were copied into the gallery. The observed existing interfaces also contain excess introduction, empty panels and development controls; their inclusion is not an endorsement of those patterns.

Assess these rules through a complete task with actual output. A more polished screenshot or fewer words alone does not establish an improvement.

## Interface copy constraint

Introductory sublines are prohibited across this project: tool interfaces, concept and comparison pages, and documentation interfaces. Do not place an introductory subtitle, tagline, strapline or explanatory lead beneath a page or section heading. This applies even when the text is informative, concise or intended to explain the workflow. It is an explicit operator design constraint, not a claim about universal usability.

A heading leads directly into the relevant content or working controls. Do not evade this rule by renaming the subline as helper text or moving it into a nearby banner. Necessary field guidance, state and error messages, source qualifications and substantive documentation belong with the specific control, evidence or topic they explain. They must not become a standing introduction beneath the heading.

During design review, inspect every page and section heading in the rendered interface. An introductory subline is a failed design acceptance check and must be removed before acceptance. The rule applies to new designs and subsequent iterations, including designs generated with external skills.

## Selectable content

Reading and copying text must remain native browser interactions. Cards containing readable content use ordinary semantic containers with explicit action links. Do not wrap the entire card in a link or place an invisible clickable overlay over its text. Do not disable text selection or intercept copy events on research content. Verify pointer selection without triggering navigation and keyboard activation of the explicit link.
