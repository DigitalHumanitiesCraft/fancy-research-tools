# Fancy Research Tools benchmark pilot

Protocol version 0.2 evaluates a bounded adaptation of the starter with real source material and adds an explicit UI evaluation protocol. The first [case](cases/met-instruments/task.md) concerns descriptive exploration of Metropolitan Museum of Art musical-instrument metadata. Results describe the recorded task, data snapshot and execution conditions. The first development run retains its original protocol version and evidence.

## Procedure

1. Record the source state, selection rule, rights and task before completing the interface. Generate expected results independently from the preserved raw source responses.
2. Implement the task using maintained repository knowledge. Record changes to the task and the reasons for them.
3. Compare actual downloaded outputs and interface results with the frozen expectations. Exercise recovery, navigation and accessibility separately.
4. Record failures, repairs and interventions. A fresh reproduction attempt uses the repository instructions and records any additional context it needs.
5. Ask an accountable researcher to assess the research task and interpretation. Record that acceptance separately from software checks.

Use `passed`, `failed` or `not run` for individual checks, with evidence paths and the observed result. A failed check remains part of the run history after repair. This pilot has no aggregate score or model ranking.

## Evidence requirements

| Criterion | Required observation |
|---|---|
| Source traceability | Input revision or checksum, selection rule, rights record and stable source references accompany the case. |
| Descriptive correctness | Exact selected IDs, group counts and missing-value counts match the independent expected results. Denominators are explicit. |
| Preservation | Raw input checksums remain unchanged. Export retains the case's supported source fields and separates derived observations from source assertions. |
| Task completion | A person can filter, inspect a source record, understand the resulting counts and download the result. |
| Recovery | Existing starter drafts remain accessible. Invalid inputs and storage failures do not silently destroy user work. |
| Accessibility | Keyboard task completion, labels, focus and narrow layouts are inspected. Automated accessibility findings are recorded separately. |
| Reproduction | A documented command reproduces expectations from the pinned source snapshot. Another agent or developer reports additional context and repairs needed. |
| Adaptation | The run identifies reused, modified and replaced responsibilities and a concrete boundary to reuse. |
| Research fitness | An accountable researcher assesses interpretation and usefulness, or this assessment remains pending. |

## UI evaluation extension

The [UI acceptance protocol](../knowledge/testing.md#ui-acceptance-protocol) defines route-specific tasks and observations. The canonical [design contract](../knowledge/design.md) connects visualisation choices to data semantics. A run reports calculation correctness, accessibility, task completion and interpretation separately. Correct output alone does not establish that a researcher can find or interpret it.

For a UI revision, retain the task and source snapshot where possible and record the new code identity in a new run record. Preserve the earlier run. Compare any measured time or actions only with equivalent tasks, material and assistance conditions. Record prior exposure and task order if the same person evaluates both versions. A single operator review is bounded feedback, and agent simulations remain agent reviews.

The initial operator response identified excessive text and insufficient visual exploration. That catalogue revision introduced a hypothesis that task hierarchy, labelled icons and linked visual summaries make the work easier. Observed researcher task completion and interpretation must test that hypothesis. Unperformed tasks stay marked `not run`, including screen-reader or full keyboard review when absent.

## Run conditions

Each run identifies the code state, including uncommitted files, lockfile, data hashes, operating system, runtime and browser. A base Git commit alone cannot identify a dirty working tree. Preserve a source snapshot or file-hash manifest for reproduction.

Record the task briefs, agent roles, shared context, lead-agent interventions, human steering, failed steps and repairs. Record time and resource use only when measured. Missing telemetry remains unavailable.

The [first run](runs/2026-10-10-met-instruments.md) is a development pilot. Its task, implementation and evaluation procedure are being developed in the same session. Agents share repository state and prior human steering. A later independent reproduction must have its own record. Neither agent agreement nor a passing calculation establishes scholarly validity, observed user needs or generality across disciplines.

## Files

Case briefs and expected results live under `cases/`. Observed execution records live under `runs/`. Source snapshots and their provenance remain under `data/`, which avoids duplicating the maintained input. The oracle reads raw responses directly and imports no application code.

## Preserve a run

Routine browser tests write screenshots and downloads into runner-owned `test-results/` paths. Preserve a completed run explicitly with `node benchmarks/record-run.mjs unique-run-name test-results`. Existing destinations are rejected. The result includes an evidence hash manifest. Add a dated assessment and a matching source capture using `benchmarks/capture-source.mjs`; these record different things. Historical files under `runs/concepts/` were overwritten by the old test runner before this fix and cannot be treated as immutable proof of their original run.

The original Met oracle tests the catalogue aggregation retained at `/baseline/`. Collection comparison at `/pilot/` has different outcomes and is assessed through `tests/e2e/workbench.spec.ts`, including original source fields, notes, reload and portable reopening. Performance comparisons must use equivalent tasks. Extra features do not establish a better result by themselves.

## Current evidence

The [testing record](../knowledge/testing.md) identifies the current verification and its source state. The [CI reflow correction](../knowledge/testing.md#ci-reflow-correction-2026-10-10) retains the earlier distinction between local and remote checks. The [documentation closeout](../knowledge/testing.md#documentation-audit-closeout-2026-10-10) and [project-tool revision](../knowledge/testing.md#project-tool-revision-2026-10-10) retain their preceding checks and pending human acceptance. Retained run records identify their source state and evidence limits. The [repository audit](runs/2026-10-10-repository-audit/assessment.md) covers the earlier preservation repairs, data gate and fresh-installation verification.

The [project decisions and provenance assessment](runs/2026-10-10-project-decisions/assessment.md) records the five commitments, field-level source inspection, investigation schema 2, version 1 preservation and agent-only guide trials. Its findings apply to its identified source state. The [earlier session closeout assessment](runs/2026-10-10-session-closeout/assessment.md) retains evidence for the workbench, shared recovery, export/reopening and clean-source reproduction before the provenance extension.

The [current plan](../knowledge/plan.md#resume-in-the-next-session) identifies remaining acceptance and next work. The concept protocol applies to the Met investigation task, and the original numeric oracle remains scoped to the catalogue baseline. Forecast and letter annotation use exact source text and quotation anchors under their [case contracts](../knowledge/specification.md#contrasting-annotation-contract). The editor preserves original Schönbach metadata beside working corrections. `npm run check:data` verifies the configured frozen materials, their source identities and their derivation without replacing retained material. The package scripts and data contract identify the current gate inventory.
