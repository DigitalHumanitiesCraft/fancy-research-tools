# Research basis

Fancy Research Tools investigates how a documented foundation supports human and agent development of research tools. The first reference is Collection Explorer with open Cleveland Museum of Art photographs. Earlier Met comparison, Schönbach metadata and source annotation remain technical examples. The main gallery organizes additional entry points by capture, analysis, correction and edition building. Their [engineering evidence](../knowledge/testing.md) remains separate from researcher acceptance and claims about the development method.

## Development commitments

The [project commitments](../knowledge/project.md#development-commitments) establish the intended development approach. The [development-study protocol](../benchmarks/development-study-protocol.md) turns them into questions about assistance, preservation during adaptation, maintainability and transfer to other research settings. It separates agent-only preparation, formative human work, contrasting adaptations and later maintenance. A working product and an effective development method require different evidence.

The public [agent starting request](getting-started.md#work-with-a-coding-agent), [adaptation procedure](customizing.md#adapt-an-existing-tool) and [maintenance handover](customizing.md#hand-over-maintenance) make those commitments exercisable. Product acceptance remains a decision about the identified tool, data state and research purpose.

## Research tools

Research software may support collection, preparation, annotation, exploration, analysis, interpretation, review or publication. These activities overlap. This working classification helps select cases and does not claim a universal scientific taxonomy.

The browser examples support catalogue comparison, source-anchored annotation and local metadata editing. Other tasks may require notebooks, pipelines, servers or desktop applications.

## Compare existing tools

Choose examples with different data models and research tasks. For each, record the task, user roles, material, supported actions, architecture, provenance, evaluation evidence and maintenance conditions. Distinguish what source code demonstrates from what documentation claims and what a user study observes.

Compare a reading workflow with a writing workflow before proposing a common module. Preserve counterexamples. A shared interface is justified when it keeps the relevant domain distinctions and can be maintained across those cases.

teiCrafter and CorrespExplorer supplied inspected material and workflow references for the current revision. The [letter case](customizing.md#contrasting-text-annotation) uses the Benndorf transcription bundled with teiCrafter, and the [metadata editor](customizing.md#replace-a-synthetic-default-with-real-metadata) projects Schönbach CMIF already used by CorrespExplorer. Their public applications remain separate tools linked from the gallery. This bounded reuse does not establish a shared domain model, full-format interchange or usability across these projects.

## Open-data candidates

The first reference tool uses open Cleveland Museum of Art photographs. The earlier frozen Met musical-instrument sample remains an implemented technical case. GerDraCor and correspSearch remain candidates for later case inspection.

| Candidate source | Possible task | Questions for inspection |
|---|---|---|
| [GerDraCor](https://github.com/dracor-org/gerdracor) | Read or edit structured dramatic texts | Which structures and identifiers must survive editing and export? |
| [correspSearch](https://correspsearch.net/en/api.html) | Explore correspondence | How are people, places, dates, uncertainty and edition provenance represented? |
| [The Metropolitan Museum of Art collection data](https://github.com/metmuseum/openaccess) | Explore or review collection metadata | Which missing values and source references matter, and which media require separate rights checks? |

For each selected sample, record its source, retrieval date or version, license, selection criteria and reproducible transformations. Check rights for metadata and media separately. Keep the source state available for comparison with derived records. The [data contract](../knowledge/data.md) specifies the current implementation and the requirements for integrating real examples.

## Simulate stakeholder perspectives

Use bounded agent simulations to uncover assumptions and conflicting needs. Give each perspective the same task and referenced material, then ask for the required outcome, likely failure, missing evidence and a discriminating question. Useful starting perspectives are a researcher, research software engineer, coding agent, project maintainer and data steward. These roles are hypotheses about relevant stakeholders.

One scenario can examine a structured-text editor adapted to an edition's rules. Another can examine correspondence exploration with missing or uncertain metadata. An independent review should challenge unsupported assumptions and identify disagreements rather than count agreement between agents. Each finding should state its scenario, the assumption it depends on, the consequence for an adaptation and how it could be checked.

Simulated findings can guide interviews, source inspection and prototype tasks. They are not observed user needs, empirical validation or acceptance by a researcher.

## Research work and design requirements

Source and workflow inspection supplies the design inputs below. The [design contract](../knowledge/design.md) owns the resulting presentation decisions. Personal preference and observed successful use remain separate evidence.

### Where work becomes difficult

Editorial work connects source text, facsimile, annotation, registers and validation. Changing representation or documents must preserve unfinished work and source references. The current [teiCrafter documentation](https://github.com/DigitalHumanitiesCraft/teiCrafter) describes source-preserving edits, recovery copies and separate schema and human review states. These are relevant capabilities, not evidence that this operator enjoys every interaction.

Correspondence exploration connects people, places and uncertain dates. [CorrespExplorer](https://github.com/DigitalHumanitiesCraft/CorrespExplorer) documents multidimensional filtering, several views, URL state and exports. This suggests a transferable requirement: switching perspective should retain the same investigation context. Its documentation alone does not establish usability or data correctness.

For provenance research, a mapped location needs an explicit role and evidence. An acquisition location cannot automatically establish where a photograph was taken or where its collector travelled. Our design must preserve those distinctions before choosing a map, timeline or network. This is a domain requirement derived from project material, not a claim that a particular display has passed evaluation.

The repository's recovery review reproduced note loss after reload in Bench and Trail. Its correction and regressions are recorded in [Testing](../knowledge/testing.md). This local finding motivates interruption and recovery tasks, without measuring their usability for independent researchers.

### Which existing mechanisms deserve testing

Candidate mechanisms include coordinated source and working views for editing, a retained filter context across alternative views for exploration, stable source references beside interpretations, and recoverable unfinished work. Simultaneous panes are justified when evidence must be compared together. Alternative perspectives may use separate views with shared state. Neither a fixed panel count nor the number of available visualisations measures usefulness.

### What a useful session produces

| Activity | Retained outcome | Acceptance task |
|---|---|---|
| Explore and compare | Selected source records, selection criteria, observation and unresolved question | Reopen the investigation and recover the same records and notes |
| Annotate or edit | Source-linked changes, qualifiers, revision history and an explicit review state | Correct one passage, undo it, export and reopen without unrelated data changes |
| Examine relationships | A referenced subset and a claim whose entities, relations and uncertainty are inspectable | Trace a displayed relation back to its supporting records |
| Curate data | Corrected values with original values and transformation provenance | Explain and reverse a correction without losing the original evidence |

These are proposed acceptance outcomes. They are not already implemented across the starter.

### What automation may decide

Deterministic operations can retrieve, filter, count, validate structure, preserve identifiers and export a documented selection. Suggested entity matches, inferred relationships or LLM annotations retain their producer and evidence and remain proposals until accepted. Researchers decide interpretive relevance, ambiguous identity, editorial reading and the scope of a defensible claim. Passing a schema check does not answer those questions. Runtime LLM assistance is optional; the coding harness used to develop a tool is a separate concern.

The [W3C PROV Primer](https://www.w3.org/TR/prov-primer/) distinguishes entities, activities and agents, including roles and revisions. It informs the project's [provenance vocabulary](../knowledge/data.md#provenance-of-individual-values). The current investigation JSON remains a project-specific format without a PROV-O conformance claim.

### Who can evaluate the work

Relevant participant profiles are an editor working with source text and images, a historian exploring correspondence, and a collections or provenance researcher investigating contextual relationships. Include experienced and less experienced users when learnability is a study question. These are recruitment profiles. No person's availability, consent or participation has been established. Agent walkthroughs can identify defects and challenge assumptions, but cannot supply human satisfaction or research acceptance.

## Recent empirical and system evidence

[Evaluating usability in digital humanities features for archival retrieval systems (2026)](https://doi.org/10.1007/s10502-026-09536-x) studies two archival systems with sixteen historians. Its task observations report overlooked filters, ambiguous authority-link icons and lost search state during navigation. For FRT this supports tests of discoverability, correct destinations and state recovery. The result does not prescribe a universal layout. We inspected the methods and results sections of the publisher's HTML on 2026-10-10. The paper's universal-looking participant-count heuristic is not adopted.

[A study of search result aggregation approaches for the digital humanities (2025)](https://doi.org/10.1002/asi.70006) compares four interfaces with thirty-two history-course students, counterbalancing tasks and interface order. It examines effectiveness, perceived value and diversity of saved sources. Its results support evaluating retained research material alongside interaction effort. Transfer to professional editorial work requires further evidence. We inspected the study design, participant and discussion sections on 2026-10-10.

[HERITRACE (2025)](https://arxiv.org/abs/2501.16197v2) describes domain-expert data editing with provenance and change tracking. Only the abstract and version metadata were inspected here. It supplies a candidate mechanism, not evidence of comparative usability.

A [guided workshop study with engineering students](https://arxiv.org/abs/2512.05666v1) reports self-reported completion of survey applications by 24 of 33 respondents. Many participants had introductory programming experience, and differences between cohorts and grading conditions limit interpretation. This is bounded feasibility evidence for that workshop. FRT's intended use by researchers without programming knowledge, the scientific validity of their tools and independent development remain separate empirical questions.

## Evaluate an adaptation

The historical catalogue baseline asks how catalogue classifications and missing descriptive values vary within an explicitly selected snapshot. [Compare collection records](../pilot/) uses that same material to compare original descriptions and retain a research question, observations and unresolved questions with the selected evidence. Exact source labels are counted without harmonization. The question is deliberately descriptive, because a sample selected by object ID cannot support claims about historical prevalence. Date labels remain descriptive rather than being reduced to invented precise dates.

The repository's `benchmarks/` directory holds the pilot task, a calculation from raw source responses independent of application helpers, and observed run evidence. Fixed query outputs and actual downloaded exports can be compared with expected results. This is an assisted development pilot in which requirements and evaluation are refined together. It is not a blinded model comparison or a validated general benchmark. Later comparisons need frozen task versions, equivalent inputs and tool access, repeated runs and separate development and evaluation cases.

Use representative material and ask researchers to complete explicit tasks. Observe errors, recovery, interpretation and task outcomes. Compare the exported result with the project's domain rules. Choose participants and methods for the question being investigated rather than assuming a universal sample size.

Separate software correctness, usability, accessibility and scholarly usefulness. The [testing protocol](../knowledge/testing.md) assigns evidence and responsible reviewers. Broader usability and reusability claims require independent human researchers using relevant material, with assistance and interpretation recorded. The current engineering examples await that assessment.

## Method

[Promptotyping](https://dhcraft.org/Promptotyping/) informs the maintained relationship between knowledge documents and implementation. Project-specific scientific claims require primary sources, documented reading coverage and explicit limits before they become part of a research-tool specification.
