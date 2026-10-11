# Research UI procedure trials

These independent agent tasks exercise the repository's research interface procedures on explicitly synthetic material. The fixtures were authored for software evaluation and describe no real collection, person or historical event. They contain no commissioned project material. Their reuse follows the repository licence.

## Run a task

Create a fresh isolated copy outside the working tree. Provide its agent with the repository's local instructions and contracts, the selected skill and only one task-facing directory, `collection/` or `annotation/`. Keep `evaluator/` and earlier agent conclusions outside that copy. Supply an absolute output directory. The task-facing prompts define a small runnable artifact and a decision record without prescribing a layout or suspected defect.

Use the same runtime, time allowance, task and source files when comparing procedure versions. Record the exact instructions, skill revision or bytes, source identity, agent environment, interventions and artifact paths. An agent with prior knowledge of the expectations cannot supply an independent forward trial. Isolation of instructions and filesystem inputs must be recorded separately from browser-state isolation.

An independent reviewer then receives the artifact and `evaluator/expectations.md`. Operate it under the existing [UI evaluation protocol](../../ui-concepts-protocol.md), inspect source and exported bytes, and preserve actual observations with [record-run](../../README.md#preserve-a-run). For a subsequent improvement trial, pass only the observed findings and retained baseline to a fresh agent using `research-ui-improve`. Repeat the affected tasks after the correction.

## Interpret evidence

Record each criterion as passed, failed or not run with its supporting artifact. A design decision or source inspection cannot stand in for an operated browser task. Unavailable keyboard, touch, screen-reader and human research observations remain unexecuted. No regex matcher, automatic style score or aggregate winner evaluates these scenarios.

The fixtures test transfer between collection comparison and source annotation, including a legitimate use of optional disclosure. They are bounded engineering exercises. Actual research usefulness, human acceptance and causal improvement from a skill revision require their own observations and comparable study conditions. Source and run capture should reuse the existing benchmark infrastructure.
