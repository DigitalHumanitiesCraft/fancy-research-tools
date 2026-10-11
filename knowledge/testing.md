---
title: Testing
project:
  name: Fancy Research Tools
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Testing
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/testing
status: draft
language: en
created: 2026-10-10
updated: 2026-10-11
---

# Testing

Quality checks establish bounded software behaviour, source preservation and observable interaction. Research fitness and human acceptance require the relevant person's task observation. [Specification](specification.md) owns the acceptance targets; the procedures below identify how to examine them.

## Current evidence

The implementation baseline is [a217446](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/commit/a217446f720282c347864dc710c8502db8d6ecbe). Its local sequence passed 96 unit tests, a full 60-case browser run, all six source gates, type/lint checks and the production build. After two gallery corrections, the five affected documentation/browser cases were repeated. The separate [Linux CI run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/actions/runs/38162240871) passed for the committed state. The [task-gallery record](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-11-task-gallery) preserves that sequence.

The subsequent [knowledge-refactor run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/codex/version-0.1/benchmarks/runs/2026-10-11-knowledge-refactor) passed type/lint, the documentation/production build and five affected browser cases. It corrected unpublished Markdown links detected by the build. Application, source data, dependency and test files remain unchanged. All existing requirement identifiers survived the independent loss review. The three local skills passed structural validation. A fresh agent applied the evaluation skill to a real photograph comparison and actual export; source values and selected identities agreed. The requested narrow viewport measured 487 CSS pixels, so that trial cannot claim 390-pixel coverage. Human interpretation, screen-reader operation and comparative skill effectiveness remain untested. The run manifest identifies the exact changed knowledge and procedure state.

| Claim | Evidence available | Boundary |
|---|---|---|
| Source semantics and preservation | Frozen-source regeneration, independent expected cases, actual downloads compared with their source and author values | Correct bytes do not establish correct historical interpretation |
| Interaction and recovery | Browser cases for filtered selection, source addresses, retained image state, rejected/cancelled inputs, legacy drafts and export/reopen where supported | Each application's declared state and format under [Data](data.md) remain distinct |
| Accessible operation | Automated axe checks, tested keyboard/focus sequences, 320px reflow and earlier source-bound native-zoom observations | No general conformance or real screen-reader acceptance |
| UI design | Operated agent reviews and bounded screenshot review, including negative findings and repairs | Operator and representative researcher acceptance remain pending |
| SZD interoperability | Pinned schema/parser checks in `data/szd-example/verification.json`; source-preserving package download | Native file picker blocked complete editor import/edit/reopen; full edition build remains unperformed |
| Reusable procedures | Recorded agent-only collection/annotation trials and separately guided repair | No causal old/new comparison, novice-use finding or general skill-effectiveness claim |

## Test strategy

| Risk | Appropriate check |
|---|---|
| Invalid data, semantic transformation or format compatibility | Domain tests and independent raw-source expectations |
| Data mutation during interaction or recovery | Browser sequence with actual exported bytes and preserved starting state |
| Source or derivative drift | `check:data` regeneration/hash checks against frozen inputs |
| Broken published routes, fragments or relative assets | Documentation build and browser navigation below root and repository subpath |
| Visual hierarchy, redundant controls or misleading encoding | Operated task, screenshot inspection and component/caller review against [Design](design.md) |
| Maintained knowledge drift | Trace each changed claim to its owner, inspect inbound restatements, verify links and compare removed substance against Git |
| Private material entering a public repository | Inspect new files, generated output and retained browser artifacts before publication |

Run checks appropriate to the changed boundary. Repeat affected checks after a correction; report a partial repeat separately from a full run. Do not replace invariant or recovery tests with tests that merely mirror implementation wording. For documentation-only changes, verify references, rendered output and unaffected source bytes. Keep research data and historical evidence immutable unless an explicit correction has a recorded derivation or redaction.

## Acceptance

| Question | Method | Authority |
|---|---|---|
| Can someone adapt the starter from its instructions? | Fresh setup and a bounded adaptation with assistance recorded | Developer review |
| Can a researcher complete and interpret the task? | Observe representative use with real material | Researcher and product owner |
| Are meanings and review decisions appropriate? | Compare evidence and exports with domain rules | Accountable domain expert |
| Can keyboard and assistive-technology users complete the task? | Actual operation with relevant technology | Accessibility review |

## UI acceptance protocol


The [design contract](design.md) and [UI requirements](specification.md#ui-refinement-acceptance) are assessed for each affected route. Historical benchmark records retain their original results and source identity.

| Task | Route | Observable success | Evidence to record |
|---|---|---|---|
| Explore the photograph reference | `/photographs/` | Search, inspect a qualified source date/creator, retain photographs and export the intended evidence | Source values, selected IDs, actual export, image fallback and retained navigation context |
| Prepare the SZD editing and edition task | Guides and external tools | Obtain the real TEI, understand its machine-production state and follow the supported external-TEI path | Source hashes, rights, schema/parser results and separately observed edit/save/reopen or build |
| Find an entry point from the overview | `/`, `/tools/` and guides | Open the relevant tool or adaptation guidance without coaching | First action, detours and any facilitator intervention |
| Compare instrument categories | `/baseline/` | Identify a category and correctly explain its count and filtered denominator | Answer compared with the independent oracle, plus any misinterpretation |
| Inspect missing culture values | `/baseline/` | Activate the missing-field view and inspect a corresponding source record | Selected IDs, route to the source and participant explanation of missingness |
| Refine and recover a selection | `/pilot/` and concepts | Change a search, retain comparison records and restore the investigation | Query, records, notes and keyboard/navigation observations |
| Inspect attribution and its derivation | `/pilot/` | Recognise an original attribution qualifier, open its addressable Source view, reload that address and return to the comparison with focus restored | Source address, raw values, transformation, limits of checks, unchanged work and return focus |
| Order the results | `/baseline/` | Sort each supported field in both directions without changing the filtered population or selection | Ordered IDs, `aria-sort`, numeric source-date bounds, missing values last and deterministic ties |
| Establish tool and data context | `/pilot/` and `/baseline/` | Open About, identify sample limitations and distinguish data from code rights | Sample selection, snapshot and links, plus keyboard close and focus return |
| Retain a sourced observation | `/pilot/` and concepts | Export and reopen selected evidence with question, observation and unresolved question | Actual file, exact source values and author text, manifest and field evidence |
| Export catalogue results | `/baseline/` | Download the intended filtered result and identify its provenance | Actual file, selected IDs, summary and manifest comparison |
| Correct correspondence metadata | `/tool/` | Compare original Schönbach values with a working correction, save, export and reopen it while understanding the descriptive JSON projection | Original values, changed and unchanged working fields, source identity, save/export interpretation and recovery behaviour |
| Inspect an imported record's source identity | `/tool/` | Reopen a known record and an unrelated same-ID record with another source, recognising that only the matching source receives original-value evidence | Imported IDs and source strings, visible or absent source evidence, unchanged working values and absence of an inferred verification claim |
| Anchor a source interpretation | `/annotations/` | Select an exact bulletin passage with pointer or keyboard, save an annotation and return to the same text | Source ID, offsets, exact quote, category, note and declared creator |
| Annotate a published letter transcription | `/letters/` | Select an exact passage with pointer or keyboard, apply the letter vocabulary, save an interpretation and return to the quotation while distinguishing letter authorship from edition and transcription roles | Source ID, exact quotation and offsets, category, note, published source roles and declared annotation creator |
| Record and revise a source-fit review | `/annotations/` and `/letters/` | Distinguish recorded source roles, declared annotation creator and reviewer, then observe review removal after a substantive annotation edit | Named reviewer, criterion, result, changed annotation and exported review state |
| Recover an annotation notebook | `/annotations/` and `/letters/` | Export and reopen saved annotations, retain exact author text, reject changed sources and notebooks from the other case, and preserve conflicting drafts | Actual JSON before and after reopening, source roles, failed cross-case imports, cancellation and storage outcomes |

Run the relevant tasks with representative researchers on real material. Record participant role, task wording, dataset and code identity, device, browser and assistance. Record completion as unaided, assisted, unsuccessful or not run. Preserve wrong turns, interpretation errors and the participant's own explanation. Time or action counts are useful only when actually measured under comparable conditions. No universal speed threshold or aggregate usability score is set by this protocol.

Engineering review checks exact chart counts, zero and empty states, matching query/export scope, keyboard operation and visible focus. Inspect desktop and narrow layouts, native zoom, and an assistive-technology task. Record each check separately, including unperformed checks. Record the requested viewport and the measured CSS viewport separately. Distinguish keyboard activation after programmatic focus from a complete task in natural Tab order. Automated accessibility scans and screenshots supplement these observations. A screenshot establishes appearance at its captured state, without establishing task completion.

Agent walkthroughs operate the rendered controls before reading the implementation for causes. Cover all published routes, mixed control sequences, rejected and cancelled actions, zero results, actual downloaded files and the documented tutorial. Use isolated browser contexts so test edits do not touch user drafts. Each finding records its starting state, actions, observed outcome and consequence. Code inspection can explain a finding but does not replace the interaction evidence. Browser agents use separate evidence paths, and one integrating runner owns the shared production build and final test output. Preserve accepted evidence outside runner-owned temporary output before the suite cleans that directory.

Researcher task success, interpretation and assistive-technology acceptance remain unverified until observed with the relevant users and technology. Agent walkthroughs establish only the operated sequences and can detect defects or generate hypotheses.


## Introductory subline acceptance check

Inspect page and section headings on changed rendered routes against the [interface copy constraint](design.md#interface-copy-constraint). Record the route and heading for a violation, including an introduction moved into an adjacent banner. Keep necessary guidance attached to the control or evidence it explains.

## Knowledge and skill acceptance

For a knowledge refactor, compare the before and after holdings. Record which unique claim remains, moves to a canonical owner, is corrected with evidence, or survives only as historical provenance in Git. Follow affected links and restatements. A smaller document is useful only if its reader can still make the required decision and retrieve its evidence.

Validate a changed skill's structure and then exercise its consequential procedure on a bounded task when the change warrants it. Supply an independent agent with the skill, task and raw inputs without the intended answer or suspected defect. Keep generated artifacts isolated. Review the actual output, assistance and unexecuted steps. Agent trials establish procedural observations; representative human use and comparative effectiveness need separate evidence under the [development study protocol](../benchmarks/development-study-protocol.md).

## How to run

```sh
npm ci
npm run check
npm run check:data
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Use the lockfile runtime requirements and current package scripts. [Benchmark preservation](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/codex/version-0.1/benchmarks/README.md#preserve-a-run) records the task, data identity, working-tree hashes, failures and output. A dirty tree cannot be identified by its base commit alone. Publishable evidence must be checked for private context and local account paths.

## Evidence index

Earlier checks apply to their recorded code, data, browser and task. Full narratives remain in the [pre-refactor Testing revision](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/a217446f720282c347864dc710c8502db8d6ecbe/knowledge/testing.md). Source manifests and execution artifacts remain in `benchmarks/runs/`. The index preserves useful incoming anchors.

### Task gallery and documentation audit, 2026-10-11

Full local suite and Linux CI for a217446. SZD download bytes checked; editor round trip and human acceptance remain open. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-11-task-gallery).

### Collection Explorer hierarchy, 2026-10-11

Former gallery hierarchy and operated photograph task. Its grouping was superseded by the task gallery. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-11-collection-explorer-hierarchy).

### Open photographs and UI skills, 2026-10-11

First full run passed 58 of 59 browser cases. Duplicate table-region names were corrected in a focused repeat. Separate skill trials retain profile-transfer failures, guided repairs and unperformed keyboard/touch observations. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-11-open-photographs).

### CI reflow correction, 2026-10-10

Linux exposed two reflow failures after Windows success. Font probes and corrections preserve the original assertions. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-10-ci-reflow).

### Commit preparation, 2026-10-10

Introduced explicit Git byte preservation for source identities and evidence. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-10-commit-preparation).

### Documentation audit closeout, 2026-10-10

Reconciled source roles, rights, routes and canonical contract claims without claiming a new full software run. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-10-documentation-audit-closeout).

### Project tool revision, 2026-10-10

Added real letter/metadata examples, native zoom and source-role preservation. Source-bound software checks passed; human assessment remained open. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-10-project-tools).

### Review-ready candidate, 2026-10-10

Fresh reproduction received prior conversation context. Native zoom used chrome.tabs.setZoom at 200% and 400%; that observation differs from CSS text enlargement. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-10-review-ready).

### Session closeout verification, 2026-10-10

Introduced shared investigation recovery, retained exports and clean-source reproduction. Earlier runs/concepts artifacts were overwritten by an old runner and cannot establish immutable original evidence. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-10-session-closeout).

### Documentation reconciliation, 2026-10-10

Corrected completed milestones, baseline routing and recovery descriptions after the workbench increment. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-10-documentation-reconciliation).

### Project decisions and provenance, 2026-10-10

Field-level source inspection and v2 investigation compatibility. Fixed non-finite equality and premature v1 migration. Question-first trial overlapped guide editing; later resumption trial used frozen guide hashes. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-10-project-decisions).

### Repository audit, 2026-10-10

Source regeneration, actual export/reopen, fresh installation, line-ending preservation and rejected corrupted derivatives. [Retained run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/a217446f720282c347864dc710c8502db8d6ecbe/benchmarks/runs/2026-10-10-repository-audit).

### Operator design review, 2026-10-10

The operator rejected excessive text, generic layouts and unclear grouping despite passing software checks. This decision grounds the task hierarchy and profile in [Design](design.md). Subsequent implementation has separate engineering evidence and still requires human acceptance.

### Earlier catalogue verification evidence

The initial pilot, UI refinement and walkthrough records remain under `benchmarks/runs/`. They cover sorting, missingness, mixed controls, actual exports and narrow tables at their original states. Dedicated date-bound ordering and deterministic-tie behavioural cases were still open in that review; historical prose must not be read as current coverage.

### Earlier three-concept study evidence

Atlas, Bench and Trail share the [concept protocol](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/codex/version-0.1/benchmarks/ui-concepts-protocol.md). Recorded agent operation included original data/export comparison and a Trail focus repair. One reviewer read code first, and no human ratings or winning concept were established. The subsequent session closeout records the overwritten early evidence limitation.

## Provenance

Verdichtet on 11 October 2026 from clean baseline a217446. Durable procedures remain above, future actions are in [Plan](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/codex/version-0.1/knowledge/plan.md), decision transitions are in [Journal](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/codex/version-0.1/knowledge/journal.md), and the linked Git revision retains every earlier test narrative. No previous result is reclassified as a new run.
