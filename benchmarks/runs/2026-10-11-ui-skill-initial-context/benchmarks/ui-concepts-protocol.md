# Research interface comparison, protocol 1

## Scope

Compare Atlas, Bench and Trail using the frozen Met sample and task in [the brief](ui-concepts-brief.md). These prototypes explore catalogue comparison. Findings do not establish a universal best research UI. Keep the original catalogue at `/baseline/` as a reference for lookup/filter tasks only: it cannot perform the new observation workflow, so a total-workflow timing comparison against it would be unfair.

## Common tasks and observable outcomes

1. Find catalogue records mentioning wood. Verify the search scope of each implementation and record the count; do not assume counts are comparable if searchable fields differ.
2. Select two to four candidates, inspect their original dates and attribution qualifiers, and compare material descriptions. Confirm selected records really belong to the intended set. Record whether qualifiers or missing fields were mistaken for facts.
3. Remove one candidate and add another without losing context. Make an empty search, then recover the previous investigation.
4. Write an observation and an unresolved question. Download the investigation and inspect its bytes: selected IDs, original source fields, source URLs, notes distinguished from source data, and dataset provenance. Missing or changed source evidence blocks acceptance.
5. Repeat selection and export with keyboard navigation, test a narrow layout, and record what happens on navigation/reload. Verify locally restored notes and reopen the downloaded investigation in an isolated context. Inspect rejected imports and failed-save feedback without altering a participant’s real draft.

## Dimensions and evidence

| Dimension | Record | Interpretation |
|---|---|---|
| Correctness | Source/export differences, state loss, false values | Critical defects block acceptance regardless of preference |
| Research fitness | Defensible observation, source traceability, recognised uncertainty | Requires relevant researcher assessment |
| Effectiveness | Unaided, assisted, unsuccessful, not attempted | Keep task outcomes separate |
| Efficiency | Observed detours, repeated navigation, help; elapsed time only if measured | Compare identical tasks and conditions, not agent speed |
| Perceived ease | Immediately after task: 1 very difficult to 7 very easy | A self-report item, not a composite usability score |
| Visual and experiential quality | Reading hierarchy, legibility, attention, fatigue, control and willingness to continue | Ask for examples and reasons; separate preference from task success |
| Accessibility | Keyboard/focus, contrast scans, 320px reflow, enlargement | Automated scans do not establish screen-reader acceptance |

The feedback form on /concepts/ records a bounded self-report and downloads JSON. It does not collect telemetry, send responses or infer task completion. Retain task exports with the assessment. No scores are prefilled and no automatic winner is calculated.

## Fair comparison

For an initial formative review, let each participant try all three variants and vary order across people (ABC, BCA, CAB; reverse orders when extending the study). Familiarity with the same records produces learning effects; report order and avoid interpreting raw timing as a causal treatment effect. Keep dataset, task wording, hardware, browser, viewport and assistance comparable. Capture actual build/source identity before the run. Record relevant research experience without collecting unnecessary personal data.

A first review with the operator identifies problems and preferences, not population-level superiority. Broader claims require representative participants and a study design appropriate to the intended inference. Report participant-level results and unresolved disagreement instead of collapsing everything into a weighted score.

## Agent and human roles

Design agents use research-ui-design to form separate hypotheses. An integrating evaluator uses research-ui-evaluate to operate the rendered results and inspect downloads. Builders' claims require confirmation. research-ui-improve directs bounded corrections with before/after evidence. Agents may find defects; they cannot provide human enjoyment ratings or researcher acceptance.

## Iteration record

For each finding record variant and source identity, task, starting state, actions, observation, consequence, evidence file, proposed cause and status. Status is observed, changed, rechecked or unresolved. Keep an original screenshot/export before changing a defect. Retest affected workflows; do not overwrite prior run evidence. Promote transferable patterns only with task/material prerequisites and counterexamples. Current agents also exercise the skills; structural validation alone does not validate their behaviour across projects.

## Sources

Usability as effectiveness, efficiency and satisfaction in a specified context: [NIST glossary, referencing ISO 9241-11:2018](https://csrc.nist.gov/glossary/term/usability). Perceived task ease on seven points: [MeasuringU, Evolution of the Single Ease Question](https://measuringu.com/evolution-of-seq/). The project's additional qualitative questions are not a validated instrument. No universal benchmark threshold is adopted.

## Research outcomes and recovery

Use the research-work synthesis in `docs/research.md` to distinguish a correct interaction from a useful retained outcome. For each run record whether the observation identifies supporting source records, preserves original qualifiers and distinguishes uncertainty from missing data. Measure task success, errors, recovery and assistance separately from subjective experience. Do not collapse them into an unsupported overall quality score.

Add an interruption task: record a note, change perspective, reload, and reopen the exported investigation. Record each supported and unsupported recovery boundary. Existing prototypes are not presumed to pass. Use equivalent task conditions for comparisons, vary order to limit learning effects and retain source identity and raw evidence in a new run directory. Human participants assess research relevance and experience; agent findings remain engineering observations.
