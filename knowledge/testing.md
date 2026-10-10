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
updated: 2026-10-10
---

# Testing

## CI reflow correction, 2026-10-10

The first branch push at `37038f0` passed installation, code/data checks, unit tests and build on GitHub's Linux runner. Its [browser run](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/actions/runs/38079504011) passed 53 cases and failed two existing 200% text-size reflow checks, in annotation and collection comparison. The preceding Windows run passed all 55; that result did not establish Linux reflow.

Isolated font probes reproduced the problem with wider font metrics: annotation labels exceeded their narrow column, while the comparison heading and export button retained excessive intrinsic widths. The correction permits text wrapping without clipping content or weakening the existing browser assertions. CI now retains failed browser artifacts for seven days to make future failures inspectable. Source identity is `benchmarks/runs/2026-10-10-ci-reflow-source.json`; the matching run directory records the completed local checks and probes. The GitHub check attached to each subsequent commit reports its remote result.

## Commit preparation, 2026-10-10

The operator authorised commit and push after the controlled closeout. Source identity for the prepared commit is `benchmarks/runs/2026-10-10-commit-preparation-source.json`; the matching run directory records the checks actually completed. Root Git attributes preserve source and evidence bytes across checkouts, while the importer's existing explicit LF rule remains in force. Source capture now includes this root policy. Earlier immutable captures and run records remain unchanged.

Publishing the development branch does not constitute a release, Pages deployment or human UI acceptance. The documentation closeout below describes the state before this commit preparation.

## Documentation audit closeout, 2026-10-10

This increment reconciles maintained documentation with the implemented project-tool revision. It corrects the scope of the HSA metadata check, correspondence functionality, local and external navigation, current material and evidence references, license wording and public links. The maintained acceptance matrix now includes letter annotation, original versus working metadata and the addressable source view. Historical run reports retain their original wording and limitations.

The closing source identity is `benchmarks/runs/2026-10-10-documentation-audit-closeout-source.json`. The matching run directory records the source comparison, code/data checks, production build, focused documentation/gallery browser checks and local Markdown-link audit. The source comparison establishes the exact changed Markdown files and verifies that application code, fixtures and frozen data bytes still match the preceding project-tools capture. The prior full software suite remains the [project-tool revision](#project-tool-revision-2026-10-10), with its own source identity and 91 unit and 55 browser results. Those tests were not relabelled as a new full run.

At this documentation closeout, before preparation for branch publication, the working tree was a local, unpublished development candidate. Operator UI assessment, representative research use, screen-reader operation and comparative evaluation of the development method remain open. Technical documentation reconciliation does not establish those outcomes.

## Project tool revision, 2026-10-10

The revised candidate groups existing public applications by research activity and adds real Schönbach correspondence metadata and a Benndorf letter to the local workspaces. Catalogue comparison now uses a semantic selection table and addressable source evidence. Source identity and the retained evidence are recorded in `benchmarks/runs/2026-10-10-project-tools-source.json` and `benchmarks/runs/2026-10-10-project-tools/`.

| Scope | Observed evidence | Limit |
|---|---|---|
| Integrated software | TypeScript and Biome, four frozen-source derivation gates, 91 unit tests, production build and 55 browser cases passed. | These checks establish bounded software behaviour. |
| Existing work | Existing Met version 1 and 2 investigations, original collection fixtures, notebook recovery, invalid imports and cancelled replacements passed. An actual pre-change NHC export reopened and re-exported byte-identically. | Browser storage is a convenience, not an archival or collaborative service. |
| New material | Letter quotation anchors and case vocabulary, cross-case rejection, source-role tampering rejection, Schönbach source identity and original-versus-working values were exercised. | Source matching does not verify the edition's historical accuracy. |
| Working layouts | Desktop and 320px layouts, selectable text, keyboard actions, axe and actual downloads were checked. Catalogue, editor and both annotation cases were operated at native 200% and 400% Chromium zoom. Gallery navigation and text selection passed at both factors. | Screen-reader operation and broader browser coverage remain unobserved. |
| Existing applications | Public destinations were checked by HTTP and selected actual working states were opened. coOCR's Wecker example, CorrespExplorer's HSA data, teiCrafter's SZD XML and the bibliography catalogue were inspected. | No provider-backed LLM run, full external regression suite or external interface rewrite is claimed. |
| Independent review | A separate agent checked annotation case validation and editor source matching, then exercised hostile case/source changes against the production build. | Agent review is not blinded researcher observation or human design acceptance. |

The operator's rejection of the preceding design remains below. This revision awaits a new UI review. Local data, source roles and declared interpretation/review are separated, and the gallery's existing-tool links do not imply that those external designs satisfy every local design rule. Private ACTIVE-WORK and institutional datasets were not incorporated.

Checks establish bounded evidence about software behaviour. Research usefulness and domain correctness require assessment with the intended material and accountable researchers.

## Operator design review, 2026-10-10

The operator inspected the preceding gallery screenshots and rejected the gallery and presented interfaces. The feedback identifies unclear names, development-oriented categories such as alternative interfaces, eyebrows and subtitles, excessive text and insufficiently task-specific design. It is a negative design assessment of that state, distinct from a recorded end-to-end researcher workflow and from the preservation tests below.

A subsequent static review of the retained previews identified repeated per-row field labels in the catalogue, large cards containing few metadata values, and annotation/administrative controls competing with source reading. These are supporting design observations and revision hypotheses. Reassess the gallery's organization and actual working layouts with the operator. The historical passing checks below remain scoped to their captured source and behaviour.

## Review-ready candidate, 2026-10-10

This preceding candidate added Forecast reading, a gallery and project overview with visible documentation navigation. Type/lint checks, both data gates, 87 unit tests, the production build and 50 browser cases passed for that captured state. Documentation and gallery cases passed again after its stylesheet correction. A separate agent reproduced installation, checks, build and export/reopening workflows in an isolated copy. Each evidence record identifies its tested state; these results do not cover the subsequent portfolio revision.

| Area | Current evidence | Remaining acceptance |
|---|---|---|
| Met workbench, concepts, catalogue and editor | Production regression passed. All 68 Met data files and the importer match the prior audit. Actual version 1 and 2 exports reopened with original source/author fields and stored bytes preserved. | Operator and representative researcher assessment. |
| Forecast reading | Source extraction, exact anchors, declared actors, review invalidation, raw author-text preservation, recovery, rejected/cancelled imports and actual download/reopening passed. Restoring an annotation's final content also retains its review choice, including deliberate removal or replacement. | Domain assessment of categories, interpretation and review criteria. |
| Overview and tool gallery | Published routes, local fragments, repository-subpath delivery, all seven tool/return links, previews, keyboard interaction, text selection and narrow reflow passed. Maintained Markdown links and headings were checked separately. | Operator feedback on entry, naming and grouping. |
| Native browser zoom | Existing workflows passed at 200% and 400%. The revised overview, documentation, gallery and new annotation task were then operated at both factors, including actual notebook downloads and source-return checks. | Broader browser and assistive-technology observations. |
| Pilot navigation correction | Comparison, Source dialog and export passed at 200% and 400% after correcting word wrapping. The 1280px browser window supplied 320 CSS pixels at 400%. The final production suite includes this stylesheet. | User assessment of working density. |
| Separate repository reproduction | A contributing agent used the repository instructions in an isolated source copy for fresh installation, code/data/unit/build checks, annotation export/reopen and Met legacy-file preservation. It received prior conversation context, so this was not a blinded trial. | Independent researcher and subsequent maintainer episodes. |
| Human and assistive-technology use | No representative researcher session or real screen-reader task has been recorded. | Observe task interpretation, screen-reader operation and human acceptance. |

The zoom check used an isolated Chromium profile with `chrome.tabs.setZoom` in automatic, per-tab mode. It recorded the returned zoom factor, effective CSS viewport, downloaded JSON and native viewport captures. CSS text enlargement and CDP page-scale emulation were not used for that check. Native browser zoom evidence remains bounded to the recorded browser and tasks. Narrator is installed on the test host, but this agent environment cannot operate and observe its speech workflow, so screen-reader acceptance remains unperformed.

Execution logs and browser evidence belong to `benchmarks/runs/2026-10-10-review-ready/`, with final source identity in `benchmarks/runs/2026-10-10-review-ready-source.json`. Preliminary formatting, documentation-link and browser-harness failures remain in the evidence alongside their corrections. The preservation probe verifies the listed historical evidence files; the older closeout assessment itself was absent from its original hash manifest. Researcher acceptance, autonomous novice use, comparative benefit of the development method and maintenance over time require their own evidence under the [development study protocol](../benchmarks/development-study-protocol.md).

## Test strategy

Domain tests cover validation, transformations and round trips. Browser tests cover interactions that unit tests cannot observe. Build checks exercise dependency installation and static output. Manual review covers keyboard use, responsive layout and the clarity of recovery messages.

## Claims and evidence

The [documentation closeout](#documentation-audit-closeout-2026-10-10) records the latest documentation checks. The [project-tool revision](#project-tool-revision-2026-10-10) retains the preceding full software checks. The table below summarises the [earlier repository audit](#repository-audit-2026-10-10). Its passing results apply to that source state. Dated sections retain their original scope.

| Claim | Required evidence | Recorded result |
|---|---|---|
| Import rejects invalid data without replacing state | Unit and browser tests | Passed locally, including an unsaved form |
| Export preserves supported values | Round-trip test | Actual downloaded JSON reimported; untouched records compared |
| Explorer restores URL state | Browser test | Search, type, selection, reload and back/forward passed |
| Local edits preserve baseline | State test | Immutable updates and untouched records passed |
| Storage failure is visible and recoverable through export | Browser test | Blocked storage and corrupt stored copy passed |
| Static site builds with approved public documents | Build and output inspection | Public routes and links passed; only allowlisted documentation emitted |
| Changed browser copies are detected before persistence | Two-tab browser test | Sequential stale-copy scenario passed; concurrent atomic writes are outside the guarantee |
| Export remains within the import limit | Oversized-edit browser test | Oversized edit rejected, previous collection remains exportable |

## Acceptance

| Question | Method | Authority |
|---|---|---|
| Can someone adapt the starter from its instructions? | Fresh setup and example replacement | Developer review |
| Can a researcher complete exploration and correction tasks? | Observe representative tasks with real material | Researcher and product owner |
| Are field meanings and review decisions appropriate? | Compare exports with domain rules | Accountable domain expert |
| Can keyboard and assistive technology users complete tasks? | Manual interaction review with relevant technology | Accessibility review |

## UI acceptance protocol

The [design contract](design.md) and [UI requirements](specification.md#ui-refinement-acceptance) are assessed for each affected route. Historical benchmark records retain their original results and source identity.

| Task | Route | Observable success | Evidence to record |
|---|---|---|---|
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

Engineering review checks exact chart counts, zero and empty states, matching query/export scope, keyboard operation and visible focus. Inspect desktop and narrow layouts, native zoom, and an assistive-technology task. Record each check separately, including unperformed checks. Automated accessibility scans and screenshots supplement these observations. A screenshot establishes appearance at its captured state, without establishing task completion.

Agent walkthroughs operate the rendered controls before reading the implementation for causes. Cover all published routes, mixed control sequences, rejected and cancelled actions, zero results, actual downloaded files and the documented tutorial. Use isolated browser contexts so test edits do not touch user drafts. Each finding records its starting state, actions, observed outcome and consequence. Code inspection can explain a finding but does not replace the interaction evidence. Browser agents use separate evidence paths, and one integrating runner owns the shared production build and final test output. Preserve accepted evidence outside runner-owned temporary output before the suite cleans that directory.

Researcher task success, interpretation and assistive-technology acceptance remain unverified until observed with the relevant users and technology. Agent walkthroughs establish only the operated sequences and can detect defects or generate hypotheses.

## Coverage limits

Synthetic fixtures cannot establish scholarly correctness or usability in a real project. Automated accessibility checks cover detectable violations and require complementary manual review. Local storage has browser-dependent quotas and persistence. Large collections, multi-user edits and server workflows need separate assessment.

Agent-based stakeholder simulations yield hypotheses and possible counterexamples. Their agreement does not establish observed needs or acceptance. Evaluating customization requires a referenced task and data state, an inspectable adaptation, recorded checks and review of the resulting workflow. Forecast and letter annotation provide concrete contrasts with catalogue comparison. Disciplinary fitness and broader reuse still require assessment. teiCrafter and CorrespExplorer are integrated through links to their existing applications; their runtime code is outside this repository's checks.

Annotation recovery persists the research question and saved annotations. An unfinished annotation form stays in memory, blocks import/export until saved or discarded, and requests confirmation before leaving. It is not restored after a browser crash. Sequential storage checks protect detected stale copies without providing atomic collaboration or authenticated identity.

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

## Earlier catalogue verification evidence

The following dated records describe earlier source states. Statements about work remaining apply at the time of each record. The [documentation closeout](#documentation-audit-closeout-2026-10-10) and [project-tool revision](#project-tool-revision-2026-10-10) identify the subsequent checks and their limits.

The header/footer, About and sorting revision passed TypeScript/Biome and production build. After correcting a footer-height overflow, all seven pilot browser tests passed. New checks cover alphabetical title ordering, descending URL restoration, missing culture values last in both directions, About content, Escape and focus return, and axe in the dialog. Existing pilot checks cover filtered exports, linked groups and desktop/narrow layout. A 1440×900 screenshot was visually inspected. The preceding full run passed the other 13 tests; only the affected pilot suite was repeated after the footer fix. Date-bound ordering and stable ID tie-breaking were inspected in code; dedicated behavioural cases remain open.

The 2026-10-10 agent walkthrough operated all public documentation routes, the Met explorer and the collection editor. The integrated revision passed type/lint checks, unit tests, production build and the browser suite. Historical counts, failed attempts and source identities remain in the individual run records below.

| Criterion | Evidence and scope |
|---|---|
| Working navigation and tutorial | Agents operated all documentation routes and section links, then edited and downloaded a collection. The corrected guide includes Save record before export. |
| Coherent state | Browser regressions exercise mixed pilot controls, cancelled editor navigation, selected records outside results and resolved error messages. |
| Source and export correctness | The independent raw-data oracle covers the fixed sample. Actual downloads are compared with displayed selection or full collection, according to the tool's export contract. |
| Keyboard and focus | Operated searches, editing, chart toggles, selected-object details, section navigation and table scrolling. These bounded sequences do not establish complete assistive-technology usability. |
| Readable responsive layout | Reference tables retain readable widths within local scroll regions. The pilot passes desktop viewport-fit at 1440×900 and 1366×768; the editor keeps the list and Save action visible at 1366×768. Narrow layouts pass overflow checks at 320px. Visual review additionally caught and corrected CSS layer precedence and overlapping distribution labels. |
| Contrast and semantics | Existing tokens and native controls inspected in code. Automated axe scans passed in tested states; a full conformance audit remains open. |
| Text enlargement | Browser tests exercise 200% text size. Native browser zoom remains untested. |
| Research acceptance | Representative researcher task completion, interpretation and screen-reader review remain unperformed. |

Run records live under `benchmarks/runs/`: `2026-10-10-met-instruments.md` records the initial data pilot, `2026-10-10-ui-refinement.md` the first visual revision, and `2026-10-10-ui-walkthrough.md` the operated review and corrections. `2026-10-10-workspace-redesign.md` records the independent tool identities and continuous workspace. Each record identifies its own source state. Agent findings are engineering evidence and design hypotheses.

## Earlier three-concept study evidence

The concept comparison uses the common task and protocol in `benchmarks/ui-concepts-brief.md` and `benchmarks/ui-concepts-protocol.md`. All three variants were operated in isolated browser contexts, with actual JSON downloads compared against the original selected source records. The integrated suite passed 25 browser tests and 24 unit tests. Independent cross-reviews exercised keyboard selection, empty-search recovery, selection retention, note retention and exports. Trail lost keyboard focus on stage navigation; a bounded correction focuses the destination heading. All five concept tests passed after that change, including its new regression. Type/lint and production build passed. Screenshots and raw exports are under `benchmarks/runs/concepts/`.

The provisional design/evaluate/improve skills were used in this round and passed structural validation. This is one real use case, not a cross-project skill benchmark. Independent reviewers are agents, not human participants; one reviewer read part of Trail's code before operation, so that review was not blind. Mobile comparison panning, Atlas's spatial cost, and separation of Trail evidence from notes remain design tradeoffs for human review. A suspected Atlas skip-link overlay in a full-page capture was not reproduced in live viewport geometry (unfocused bounds -160 to -104px); it is not recorded as a confirmed product defect. Native zoom and screen-reader acceptance remain untested. No human ratings, timing results or winning concept are claimed.

## Introductory subline acceptance check

Inspect every page and section heading on changed rendered routes against the [interface copy constraint](design.md#interface-copy-constraint). An introductory subline fails design acceptance, including informative subtitles and introductions moved into nearby banners. Necessary contextual field guidance and source qualifications remain with the controls or evidence they explain. Record the route and heading for each violation.

## Session closeout verification, 2026-10-10

The integrated workbench revision passes TypeScript/Biome (45 files), 38 unit tests across five files, production build and all 33 Playwright tests. The independent source oracle verifies 60 records and 11 expected queries; the importer verifies 62 stored source files. A separate temporary checkout assembled only from Git-visible tracked and untracked files passes fresh installation, code checks, all 38 unit tests and build without copying dependencies or generated output.

Browser cases cover comparison, preserved source values, reload, actual download and reopening in a fresh browser context, empty selections with notes, selection limits, corrupt import preservation, corrupt local draft preservation, restored queries across hash navigation, narrow layouts, bounded keyboard sequences and 200% text size. All three alternatives exercise the common recovery and interchange contract. The earlier catalogue tests now target `/baseline/`. Automated accessibility checks pass in the tested states. The final comparison screenshot was inspected; the page uses document scrolling and a locally scrollable comparison on narrow screens.

Evidence is retained in `benchmarks/runs/2026-10-10-session-closeout/`, with the matching source capture beside it. Earlier counts above describe earlier runs. The historical `runs/concepts` directory was overwritten by the previous test setup and cannot establish immutable evidence for its original run. Routine tests now write temporary output; explicit promotion refuses to overwrite an existing retained run.

This is engineering verification. Representative researcher sessions, native browser zoom, screen-reader acceptance and contrasting-domain adaptation remain open. The bounded increment does not establish a winning interface, a validated usability benchmark or completion of version 0.2.

## Documentation reconciliation, 2026-10-10

The later documentation pass corrects completed milestone states, distinguishes `/pilot/` from `/baseline/`, and updates recovery descriptions and session entry instructions. It changes no application code or source records. The earlier source capture continues to identify its historical working tree. The subsequent capture is `benchmarks/runs/2026-10-10-documentation-reconciliation-source.json`. The matching documentation run records build and link verification separately from the earlier full engineering suite.

## Project decisions and provenance, 2026-10-10

That increment implemented the five development commitments through the public guides, canonical contracts and development study protocol. Instrument study added field-level source inspection and investigation schema 2; version 1 files and drafts remain supported. Its acceptance checks require original raw values and qualifiers, separately bounded technical checks, selectable text, keyboard dismissal/focus return, narrow dialog reflow, exact v1 preservation on opening and view-only navigation, and v2 export/reopening. Changed evidence and JSON number overflow must be rejected before replacing work.

An independent read-only agent review checked all 840 projected values, original values and the generator hash against the frozen snapshot, and confirmed unchanged raw sources, records and manifest. It detected a non-finite-number comparison defect and unnecessary v1 storage migration. Their repairs are covered by focused regressions and the integrated suite. Final execution results and source identity are recorded in `benchmarks/runs/2026-10-10-project-decisions/` and its matching source manifest.

TypeScript/Biome pass for 47 files, all 46 unit tests in six files pass, and the production build succeeds. The integrated browser run passed 34 of 35 cases; a duplicate accessible table-region label on the specification page failed. A more specific table label corrected it. All nine affected documentation and workbench cases then passed, including the final persistent Close control, plain-language mapping rules and v1 byte-preservation checks. The other 26 cases were unchanged after their passing run. The raw-source oracle still verifies 60 records and 11 queries. A separate production-browser operation uses the previously downloaded version 1 file, retains its stored bytes, exports version 2 and reopens the actual download with identical source detail. Desktop and narrow screenshots were inspected; 200% CSS text size is distinct from native browser zoom.

Two fresh-context read-only agents exercised the entry instructions. The question-first case located a source-grounded two-record comparison and identified an interim legacy-export wording conflict, which was corrected. That trial overlapped final guide editing and is not a frozen comparative run. The reserved resumption case then used the final guide hashes; it requested the missing target repository, old file and annotation example, retained unknown ownership/compatibility, and proposed reversible adaptation without inventing execution. It caused no further guide changes. Full trial scope and source-reading limits are retained with the run.

The development-study preparation trials are agent-only instruction checks. They cannot establish autonomous novice use, human research acceptance, transfer across disciplines or benefit of the method. Independent researcher sessions, native browser zoom, screen-reader assessment, a contrasting adaptation, a measured method comparison and maintenance over time remain unperformed.

## Repository audit, 2026-10-10

The repository audit checks agreement between decisions, implementation, published guides and execution evidence. New regressions cover empty-but-present editor drafts, unload protection after external investigation changes, exact accepted author text through form restoration and unrelated edits, and application links from documentation below a site subpath. `npm run check:data` independently regenerates all derived dataset files in temporary storage and compares them byte for byte before running the raw-source oracle. An intentionally corrupted disposable copy must fail this gate.

The integrated production run passed TypeScript/Biome for 49 files, all 51 unit tests in six files, the data gate, production build and all 40 browser tests. A new directory assembled from 163 Git-visible source files, excluding historical run evidence, generated output and dependencies, passed `npm ci`, code/data checks, the same 51 unit tests and build. No installed dependencies were copied. Three deliberate derived-file byte mismatches were rejected in a disposable copy. The frozen dataset content, provenance registry and importer remained unchanged against the preceding source capture. Git checkout with `core.autocrlf=true` preserved the importer's digest and protected dataset files after adding explicit attributes.

Operated agent review covered the tutorial's real download and reopening, rejected and cancelled replacement, retained editor inputs after cancelled navigation, keyboard selection and source-dialog focus return, pointer selection of an uncertain attribution, and 320px reflow. Native zoom, screen-reader operation and researcher task interpretation remain unperformed. The run retains the earlier failing downloads separately from passing regression exports; normal control display normalization is distinct from changing the underlying author text.

The integrating runner retains execution logs, source identity, downloads and screenshots in `benchmarks/runs/2026-10-10-repository-audit/`, with `2026-10-10-repository-audit-source.json` beside it. Final documentation changes were rebuilt in both directories and their output compared. Historical runs remain unchanged. The audit does not substitute for the unperformed human, accessibility and contrasting-domain work listed above.
