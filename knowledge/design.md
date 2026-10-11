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

## Reference hierarchy

The [project scope](project.md) establishes Collection Explorer as the first reference and distinguishes gallery tasks from technical examples. The gallery's current destinations and previews are maintained in `data/tools/catalog.json`. [Project navigation](#project-navigation) defines how that hierarchy appears.

### Reusable review decisions

Each rule below carries a task condition. A presentation preference is distinct from a source-integrity requirement and from observed usability.

| Decision | Useful application | Boundary or counterexample |
|---|---|---|
| Title or name first | Browsing and comparing records; supporting kind, signature and rights remain compact beneath it. | A citation or identifier audit may require the identifier as its primary column. |
| One owner for a filter or count | Linked views share query state and a single result summary. Check the rendered dense state and its component callers for duplication. | Selection, coverage and chart populations can differ; keep those distinctions and exact contributors accessible. |
| Direct useful rows | Show comparison attributes and qualifications before opening details. A routine source action should reach its passage directly. | Long technical traces may remain optional. Disclosing a whole record is justified when its preview already supports the next decision. |
| Proportionate spacing | Align comparable fields, compact related controls and leave space between task groups. Give image and map inspection the main working area. | Uniform maximum density makes long source passages harder to read. |
| Explicit data semantics | Format dates without inventing precision; distinguish named places from supported coordinates. | An ordinal chronology must not imply elapsed-time distance. No map is supplied by the current photograph data. |
| Defined inclusion policy | Decide which source and derived assertions may contribute before rendering them. If permitted, mark LLM-produced values consistently at the affected field. | Excluded assertions must also be absent from search, counts, diagrams and exports. A source-only tool needs no LLM badge. |
| Useful missingness | Comparable cells may be blank when the column establishes meaning. Missing categories remain available in filters, coverage and source inspection. | An unresolved attribution, access restriction or failed load needs an explicit state. |
| Stable filter context | Common filters occupy a stable location; view-specific controls expose their scope, active constraints and reversal. Searchable choices combine lookup and selection where that helps. | Hidden filters must not silently affect another view. A small fixed vocabulary can work better as visible choices. |
| Source evidence in context | A source action beside the affected value opens original wording, mapping and recorded checks, then returns to the same working context. | Uncertainty affecting interpretation stays visible before opening detail. Optional hashes and processing traces may be disclosed. |
| Meaningful identity links | Authority links name their destination and expose the full identifier and copying when useful. | A shared name or authority link must not silently merge distinct people or assertions. Citation identifiers remain recoverable in export. |
| Source-linked writing | The exact quotation, interpretation and saved or unsaved state remain adjacent during annotation. | Prose can require more space than a catalogue row. Source navigation and export must preserve the anchor. |

The source-only Collection Explorer applies these decisions through the [photograph study](#photograph-study). Lanes, maps and a larger shared framework require their own source data and measured need.

## Operator default profile

The operator confirmed an adaptable default profile on 2026-10-11. It favours compact task-specific views, aligned comparable fields, restrained labels and directly visible evidence needed for the next decision. Optional details deepen inspection while preserving context. The [interface copy constraint](#interface-copy-constraint) governs introductory sublines in this repository. These presentation choices express the operator's preferences and remain distinct from empirical usability findings.

Adopters may revise this profile in their own design contract and bring their local agent instructions and acceptance checks into agreement. Within Fancy Research Tools, the current profile continues to apply. Accessibility, source fidelity, uncertainty, rights and recoverable working state remain independent requirements when presentation changes. Each tool still derives its layout and density from its research task.

The profile also carries the operator's repeated interface decisions. Use aligned fields and ordinary spacing instead of middle-dot separators. Show counts when they explain a changed result or selection, without adding a permanent count heading to an already labelled view. Keep shelfmarks visible where they distinguish cited material; integrate authority identifiers as meaningful links with accessible explanation and copying when needed. A short identifier does not need its own disclosure. For LLM-produced values permitted by the project inclusion policy, use the same named status icon with an explanation on focus and tap. Its presence and accessible name communicate production without hover; a separate recorded review never replaces that production status. Record-wide badges must not imply that unrelated fields share it. Routine evidence access should not require nested accordions. Optional technical traces may remain collapsed.

Format structured calendar dates for human reading in the interface language. Keep precision, approximate wording and open or interval bounds intact. Preserve the exact source representation in source inspection and export; do not expose an ISO storage value as the ordinary date label or invent missing components.

## Task hierarchy

Entry makes the activity, material and useful result understandable. Workspaces expose the evidence needed for the next decision. Prototype history belongs in development context. Current operator acceptance is recorded in [Testing](testing.md), separately from engineering checks.

| Surface | Primary content | Supporting content |
|---|---|---|
| Project overview and gallery | Research-task entry points with actual material and an honest application or setup destination | Development guides and project context |
| Documentation | The requested guide or maintained contract | Section navigation, page outline and evidence references |
| Collection comparison | Comparable source fields, retained selection and authored observations | Field provenance, recovery and export |
| Collection editor | Selected source record beside editable fields | Validation and import/export |
| Source annotation | Original text beside quotation and interpretation | Source identity, declared creator and recorded review |

At `/pilot/`, separate Collection and Comparison views connect a semantic record table to an aligned comparison matrix. The header carries identity, these views and export. About and data/code licence links live in the footer. Source wording remains beside the writing area, and field evidence has an addressable reading view. Bounded horizontal regions preserve readable comparison columns on narrow screens. The older `/baseline/` tests filtering and aggregation, a different task whose outcomes are not interchangeable with a retained investigation.

## Photograph study

The `/photographs/` reference supports comparing catalogue descriptions of historical photographs and examining their images and sources. It uses a separate openly licensed sample. Collection, Timeline and a selected-image route preserve the same query and selection. The operated review is recorded in [Testing](testing.md#open-photographs-and-ui-skills-2026-10-11); human assessment remains pending.

| View | First decision and visible evidence | Action and optional depth | Wide and narrow layout |
|---|---|---|---|
| Collection | Choose photographs to inspect or compare using thumbnail, title, original date wording, creator and technique. | Open the photograph directly or retain it in a small comparison selection. Search and relevant creator/process filters remain visible. | Compact aligned entries on wide screens, readable stacked entries on narrow screens. Content receives the larger share of the viewport. |
| Timeline | Inspect chronological order while seeing each photograph and its qualified catalogue date. | Select a directly operable mark or its attached preview. Original qualifiers stay visible. | Vertically scrollable, ordinal chronology with explicit decade grouping and no proportional time ruler. Mark spacing accommodates evidence and does not claim elapsed duration. |
| Photograph | Examine the image and the catalogue wording together. | Direct image pan/zoom through locally bundled OpenSeadragon with keyboard controls and a usable image fallback. Source values and a named museum link are directly available. | Image dominates the wide view beside compact structured fields. Narrow layout places image then fields in ordinary reading order. |
| Comparison | Compare retained photographs by the same date, creator and technique fields. | Inspect each source or export the selected evidence. Removing an item preserves the remaining selection. | Aligned fields with a bounded horizontal comparison region where necessary; no document-level horizontal overflow. |

The visual direction uses a neutral light surface, dark ink and one restrained blue action colour, system typography and compact spacing. It inherits accessible primitives without importing the other tools' layouts. Source qualifiers and actionable failures retain readable contrast. No introductory subline, permanent unfiltered collection counter or repeated metadata caption is added. Identifiers become useful source links or accessible optional details, and no LLM provenance icon appears for catalogue-only data. A map requires separately sourced, typed geographic relations. Culture and museum location do not establish a photograph's depicted or capture location.

## Project navigation

Overview, Tools and Documentation are equal header links. Gallery entries name their action, material and actual destination, distinguish external hosts, and use screenshots of observed working states. A preview does not promise that an external application opens in that state. Explicit action links leave surrounding text selectable. Local workspaces provide All tools; external applications retain their own navigation and ordinary browser Back.

The gallery follows the [reference hierarchy](#reference-hierarchy). Prepared workflow entries open guides, with source repositories as setup resources. Source-package preparation does not establish a complete integration or the operational readiness of another application. Older routes remain in [Technical examples](../docs/getting-started.md#technical-examples).

Documentation places section navigation and the page outline beside wide articles. Narrow layouts show article, outline and navigation in that order, with a content skip link. This reading layout does not impose the same shell on research workspaces.

## Annotation workspace

Annotation places original text beside an exact quotation and its interpretation. The wide layout gives the source the larger share of the workspace, followed by compact creator and optional review controls. Narrow layouts use source, form and saved annotations in reading order. Saved annotations offer return, edit and remove actions.

The [letter task](../docs/getting-started.md#annotate-a-historical-letter) displays its historical author and modern edition attribution separately from the annotation creator. The [archived-discussion task](../docs/getting-started.md#annotate-an-archived-discussion) keeps issue time, forecaster, archived status and source link visible. Its monospace text preserves meaningful bulletin lines. These different source roles remain legible before optional technical details.

The [annotation contract](specification.md#contrasting-annotation-contract) owns selection, unfinished-form guards and review invalidation. Source rights, case-specific categories, quotation offsets and preservation rules belong to the [notebook data contract](data.md#annotation-notebook).

## Design system

Each tool owns its typography, spacing, density and semantic colours. Collection comparison uses green/ink tokens and compact source columns. The annotation tool prioritizes readable source text, with monospace reserved for the bulletin's meaningful line structure. The editor retains amber accents and places the record list beside the selected source and correction form. Icons use accessible names and visible focus. Familiar compact actions may use an icon with an explanation available on focus and tap. Meaning needed for the next decision remains perceivable without hover or colour alone. The gallery uses the project's system type and blue links with ordinary document flow, without enclosing every entry in a padded card.

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

Search, selection, navigation and saved work have different lifetimes. The interface exposes those differences and offers a clear recovery action when local saving fails. Browser navigation restores the addressable view. A route change focuses its heading, selection controls retain focus through state changes, and removing an item moves focus to an existing destination. Source links use checked URLs and announce external navigation.

Format-specific behaviour belongs to the [workbench](specification.md#investigation-workbench-contract), [photograph](specification.md#open-photograph-reference), [annotation](specification.md#contrasting-annotation-contract) and [metadata-editor](specification.md#correspondence-metadata-contract) requirements. The [data contract](data.md) owns import compatibility, preservation and review semantics. Those distinct formats must not be flattened into one generic interaction or save model.

## Accessibility basis

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) supplies criteria for keyboard access, visible focus, contrast, reflow, labels and status messages. They guide implementation and review. The [W3C guidance on complex images](https://www.w3.org/WAI/tutorials/images/complex/) supports descriptions and access to represented data. Automated checks provide partial evidence. A conformance claim requires assessment of the complete applicable requirements and workflows.

## Action-layer connection

[AGENTS.md](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/codex/version-0.1/AGENTS.md) routes implementation into this design contract. The three local UI skills apply it through concept work, operated evaluation and bounded improvement. The [UI acceptance protocol](testing.md#ui-acceptance-protocol) owns execution and evidence recording. This document owns design decisions and their task conditions.

## Interaction concept study

Atlas tests object-led discovery and a collection tray. Bench tests comparison-first work. Trail tests a question-led sequence with revisitable state. They are alternative hypotheses on the same frozen Met metadata, without fabricated images. They do not form a combined product design. Their [shared brief](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/codex/version-0.1/benchmarks/ui-concepts-brief.md) and [comparison protocol](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/codex/version-0.1/benchmarks/ui-concepts-protocol.md) define the material, retained outcome and evaluation conditions.

## Task-based interface review

Every component supports a research action, interpretation or recovery need. Required evidence stays near the decision it qualifies. Colour and prominence cannot imply unsupported certainty. A repeated count is justified only by a different population or decision, not by separate components requesting the same summary.

The [reusable decisions](#reusable-review-decisions) supply conditions and counterexamples. The [testing protocol](testing.md#ui-acceptance-protocol) supplies the rendered and code-level review, including dense states and shared callers. Appearance, interaction correctness, source fidelity and human research acceptance remain separate evidence.

## Project examples

The [DHCraft portfolio](https://dhcraft.org/fancy-research-tools/) supplied the initial inventory inspected on 2026-10-10. `data/tools/catalog.json` owns current gallery metadata. The [task walkthroughs](../docs/getting-started.md) own instructions, prerequisites and external-tool limitations. Source packages and the [data contract](data.md) own rights and transformations. [Research basis](../docs/research.md) explains what can be inferred from these comparisons.

Observed examples include excess introduction, empty panels and development controls as well as useful mechanisms. Their inclusion does not endorse all their design choices. Only public material enters the examples; internal workflow lessons transfer through separately sourced material. A polished screenshot alone does not establish improvement.

## Interface copy constraint

Introductory subtitles, taglines, straplines and explanatory leads beneath page or section headings are prohibited in tool, concept, comparison and documentation interfaces. The operator's presentation preference applies even to concise informative sublines and designs generated with external skills. A nearby banner or renamed helper text does not change an introductory subline's function.

Headings lead into substantive content or working controls. Necessary field guidance, actionable state and errors, source qualifications and substantive documentation remain with the specific control, evidence or topic they explain. They are not prohibited by this constraint. [UI acceptance](testing.md#ui-acceptance-protocol) checks the rendered headings against this distinction.

## Selectable content

Reading and copying text must remain native browser interactions. Cards containing readable content use ordinary semantic containers with explicit action links. Do not wrap the entire card in a link or place an invisible clickable overlay over its text. Do not disable text selection or intercept copy events on research content. Verify pointer selection without triggering navigation and keyboard activation of the explicit link.
