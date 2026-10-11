# Research-tool development study, protocol 1

The study examines how researchers and coding agents develop, adapt and maintain research tools from maintained project knowledge. Its unit of observation is a bounded development episode with an identifiable input, working context and resulting artefact. Product acceptance assesses whether a particular tool supports its intended research task. Method evaluation examines the development process and the conditions under which its results transfer.

## Questions and evidence

| Question | Observe | Evidence needed for a claim |
|---|---|---|
| Can a researcher without programming experience develop a useful tool with a coding agent? | Task formulation, consequential decisions, requested help, unrecognised errors and ability to explain the result | An observed researcher-led episode with the assistance record and inspected output. Agent-only preparation cannot establish researcher autonomy. |
| Can an existing tool be adapted while preserving its research meaning and prior work? | Inventory, retained and replaced responsibilities, source changes, old-file handling and affected workflows | Identifiable before/after states, actual data round trips, observed use and domain review of the changed behaviour |
| Can another session or maintainer continue the work? | Setup, information retrieval, undocumented dependencies, a small change, migration and recovery | A separate attempt using the supplied handover, with every additional explanation recorded |
| Which parts are reusable across research settings? | Shared responsibilities, necessary changes, failed transfers and counterexamples | Contrasting material and tasks, operated adaptations and assessment by independent researchers in the relevant settings |
| What does maintained knowledge contribute to development? | Decisions recovered from documents, missing context, revisions after prototype observations, rework and defects | Comparable episodes with explicit conditions. A causal advantage requires a design that addresses experience, task difficulty and assistance. |

## Stages

1. Prepare with agent-only trials. Check whether the entry instructions, fixtures, recording procedure and technical checks can be followed. Preserve questions, failures and interventions. These trials establish preparation evidence for the procedure.
2. Conduct a formative human pilot with a relevant researcher and real material. Obtain agreement on the task, recording and permitted reuse of the evidence before observing the episode. Record prior research, programming and agent experience without collecting unnecessary personal information. Explain that stopping or declining recording is possible.
3. Examine contrasting cases with independent researchers. Include a new-tool episode and an existing-tool adaptation that changes the research activity or data contract. Recruitment, participant availability and the suitability of each case remain to be established.
4. Run a subsequent maintenance or resumption task from the retained handover. A new agent or maintainer receives the documented context rather than the original conversation. Record any information supplied after the start.
5. Compare only the claims the design supports. Product acceptance and the development-study assessment remain separately recorded.

No participant recruitment, consent, human result or scientific acceptance is recorded by creating this protocol. No contact or data collection is initiated by the repository.

## Episode record

Freeze the task wording and criteria before the measured episode. Preserve later task changes as changes, with their reason and effect on comparison. Use a new run directory and retain earlier failed attempts.

| Record | Required content |
|---|---|
| Research setting | Research task, material, required result, accountable domain reviewer, limits of the material |
| Starting state | Repository revision and uncommitted-source manifest, data version and rights, existing tool and representative saved work |
| Execution context | Actual model identifier where available, harness, tools, environment, instruction and skill versions, supplied documents and prior conversation |
| Participant context | Role and relevant experience, agreed recording/reuse scope, identifier appropriate to the study |
| Actions and assistance | Observable action, question or failure, who intervened, information supplied and whether the task resumed |
| Outputs | Source changes, retained or transformed data, actual exports, local application, documentation and executed check results |
| Judgements | Criterion, inspected version, assessor, supporting material, outcome and unresolved disagreement |
| Follow-up | Required correction, next check, maintenance owner and remaining dependency |

For agent-only trials, record `no human participant` instead of a simulated participant profile. A developer performing a scripted workflow is reported with that role. A researcher who needs technical intervention is reported as assisted for that part of the task.

Record time or cost only when actually measured with a stated method. Distinguish active work, waiting and assistance when the research question needs that distinction. Token counts or tool calls alone do not measure human effort or scientific value.

## Tasks and criteria

### Develop a tool

Use the starting request in the [getting-started guide](../docs/getting-started.md#work-with-a-coding-agent) with a real research question or material sample. The researcher explains the intended use and assesses a small working result. The agent records unresolved assumptions, manages the technical environment and implements the bounded workflow.

Observe whether the researcher can identify what the tool operates on, explain one result against its source, recognise an important limitation, recover interrupted work and reopen an actual export. Record technical help separately from research clarification. A runnable interface alone does not establish that these tasks succeeded.

### Adapt an existing tool

Supply an existing application, its current task and representative saved work. Require an inventory and a reproduced baseline before modification. Name the desired change and the research properties that must survive. Retain a previous-version file and compare its meaning after the change.

The provenance views in [Compare collection records](../pilot/) preserve source records, qualifiers, selections, notes and legacy investigation input. [Annotate forecast discussions](../annotations/) supplies a contrasting case with archived NOAA/NHC text, exact quotation anchors and individually reviewed annotations. The [worked adaptation](../docs/customizing.md#contrasting-text-annotation) records their shared and replaced responsibilities. These implemented cases support engineering preparation. Independent domain review, researcher episodes and a case held out from instruction revision remain necessary for the broader study.

### Continue and maintain

Give a new session the repository and handover, then request one bounded change. It must locate the supported environment, data and schema versions, current checks, owner or unassigned role, and the recovery path. Observe whether an old saved file remains usable and whether a failed migration or change can be abandoned without losing the original.

An agent can execute this preparation task now. Long-term maintenance claims require evidence from actual subsequent changes and responsible ownership over time.

### Interpret provenance

Ask a researcher to trace one displayed value to its source and distinguish its production from its checks. Include an unknown producer or an unreviewed value. Ask what a recorded deterministic check establishes and whether a later modification changes the applicability of that evidence.

Use the project's vocabulary consistently. AI-generated, deterministic check, AI-reviewed and human-verified describe different executed activities. Outcome and inspected version are separate. Human-verified applies only where a responsible person confirmed the stated property. A schema pass does not establish historical accuracy, and catalogue publication does not identify an otherwise unknown original producer.

## Comparisons

Start with within-case explanation of decisions, assistance and outcomes. For a later comparison, choose an actual alternative workflow that can perform the same research task. Preserve its normal capabilities. A catalogue that cannot retain notes is suitable for a lookup comparison only.

When comparing instruction or knowledge arrangements, keep the task, data, permitted tools, model and success criteria comparable where possible. Record unavoidable changes and prior exposure. For human comparisons, describe relevant experience and vary task or condition order when repeated work would create learning effects. Differences between cases may reveal conditions and counterexamples without establishing a causal treatment effect.

Reserve at least one additional case that was not used to revise the instructions. Keep its first outcome even if the result motivates another improvement. A repair is followed by a new run, with the first result preserved. There is no weighted overall quality score or automatically selected winner.

## Agent-only preparation cases

These inputs examine whether the published instructions support appropriate next actions. Run each in a fresh context and record which guides and files were supplied. They are preparation trials of the instructions, with the stated permissions, and provide no human-use evidence.

### Preparation A, question-first entry

Use this request with the current repository and its frozen Met material.

```text
I do not program. I want to compare how instrument catalogue entries
describe materials and uncertain maker attributions, and return later
to my notes. Please use the project guides and the available material
to identify the smallest useful workflow. For this preparation run,
inspect the repository and report your proposed task, the source limits,
what can be demonstrated already and any question that needs my judgement.
Do not change files or contact anyone.
```

Check whether the response locates the existing workflow, distinguishes current implementation from an untested claim, bounds the Met sample, uses real source examples and avoids asking the researcher to choose technical modules. Record unnecessary questions and unsupported claims as findings.

### Preparation B, resumption with incomplete material

Preparation B was used on 2026-10-10 after the then-current entry guides were finished. The [recorded preparation evidence](../knowledge/testing.md#project-decisions-and-provenance-2026-10-10) identifies the supplied guide versions and the agent-only result. No guide revision followed that trial within its run. The case is now part of the observed preparation history and is no longer reserved for a future independent check.

The trial supplied the following request and the published guides to a fresh agent. The named project files were deliberately unavailable.

```text
I have inherited a browser tool used by a small research team. We have
saved files from last year, but the former maintainer has left. We need
one extra annotation field and want to continue using our saved work.
I do not write code. I have not supplied the repository or a saved file
yet. Please tell me the smallest material you need, what you can decide
already and how you would make this change reviewable and reversible.
Do not create a replacement application or contact the former maintainer.
```

Check whether the response requests the existing repository and a safe representative old file, treats the application's schema, ownership and technical condition as unknown, preserves its workflow, and proposes baseline reproduction followed by a bounded change and old-file check. It should explain the research decisions that remain with the team. It must not invent a migration, compatibility result or maintenance commitment.

This input tests resumption under missing prerequisites. It cannot demonstrate successful migration or maintenance. Later guide revisions require a further unused case before claiming an independent preparation check of those revisions. Preserve the first result and its supplied guide versions when a new trial prompts another correction.

## Acceptance and reporting

Record task outcomes as completed without intervention, completed with assistance, unsuccessful or not attempted, with the concrete result and evidence. Record defects, interpretation errors and differences in intended use separately from preferences. Critical source changes or lost work block acceptance of the affected workflow.

An accountable researcher decides acceptance for the stated research purpose and version. Broader usability or reusability claims require independent human researchers and evidence covering the claimed settings. An internal prototype may remain available as a candidate while that work is pending.

Report the observed conditions, results, failed attempts, assistance and limits. Preserve disagreements and counterexamples. Technical checks, product acceptance and conclusions about the development method each name their own evidence.
