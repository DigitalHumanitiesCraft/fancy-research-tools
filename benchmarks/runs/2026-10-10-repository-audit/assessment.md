# Repository audit, 2026-10-10

The operator requested a critical review of implementation quality, documented reasons and refactoring across Fancy Research Tools. The audit found preservation and reproducibility defects, corrected them and reconciled the maintained documentation. The resulting increment passed the engineering checks below. Research usefulness and version 0.2 completion remain open.

## Source and review scope

The final source identity is `../2026-10-10-repository-audit-source.json`: 163 source files on Node.js 22.14.0, Windows, including uncommitted work. The base commit alone does not identify this state. `baseline-source-manifest.json` identifies the retained pre-audit source. `change-inventory.json` records 34 modified files, three additions and no removals. No commit, push or deployment was performed.

Architecture, browser interaction and decision/documentation reviews ran in parallel with disjoint ownership. The architecture reviewer independently challenged the text binding, data gate, source-relative links and their integration. Agent review informs bounded engineering acceptance; it is not independent researcher evidence. The pre-change working files remain in the session's `work/repository-audit-baseline` directory.

## Findings, reasons and implementation

| Finding | Consequence and reason for change | Implemented boundary and evidence |
|---|---|---|
| An empty stored editor string was treated as a missing draft. | A present corrupt copy must remain protected until deliberate replacement is accepted. | `src/app/storage.ts` now distinguishes `null` from empty bytes. Storage tests cover empty and malformed copies, refusal and acceptance. |
| An external storage change did not mark previously saved investigation work as unsaved. | The visible local investigation no longer has a matching stored copy and can otherwise disappear on navigation. | `src/research/browser.ts` now guards unloading after replacement or clearing. Tests preserve external bytes and verify that unchanged v1/v2 drafts require no write or warning. A real two-tab production operation confirms the native warning, cancelled navigation and recovery export. |
| Native controls normalized accepted CR/LF text during restoration or an unrelated edit. | The export could silently lose line endings in a question, notes or collection metadata. | `src/ui/text-value.ts` retains each original string until that specific control receives input. Editor, workbench and concepts use it where needed; Atlas already retained its note strings. Five actual-download browser regressions cover unchanged and edited fields, query/filter actions, reload and export. |
| Normal tests did not regenerate every derived dataset output. | Coordinated drift in derived records and evidence could escape checks that compared those two products with each other. | `scripts/check-data.mjs` runs the unchanged importer in temporary copies, compares all three derived files byte for byte and invokes the independent raw-source oracle. Both CI workflows include the gate. All three deliberate output mismatches fail in disposable data copies. |
| Git line-ending conversion could change the importer or derived files. | The importer digest embedded in v2 investigations could change on a Windows checkout without an intentional derivation change. | Git attributes pin the importer to LF and preserve the checksum and evidence files as exact bytes. An isolated Git index and checkout with `core.autocrlf=true` retain all five checked protected files. No commit was needed. |
| Homepage application links were written for generated HTML instead of their Markdown source location. | They resolved on the site but not when reading the source; a naive correction could escape a deployed repository subpath. | The renderer now resolves local links from source to output location, as it already did for Markdown targets. Source links and both homepage body links below a site subpath are checked. The introductory homepage lead became direct navigation actions. |
| Current and historical states were mixed in maintained documents. | A baseline table requirement could be read as the current workbench contract, an already used trial as unused, and an earlier clean install as proof of a later code state. | Specification and testing now identify routes explicitly. The study protocol marks preparation B as used. Current evidence pointers, maintenance status and changelog match this increment; earlier results keep their historical source scope. |
| Review terminology could imply more than was recorded. | The editor's manually chosen `checked` value is not a technical or scholarly check; an unknown check time must not be invented. | Design and customization wording now follows the data contract. The public research guide points to the canonical project commitments and their reasons. |

The five project commitments remain traceable from `knowledge/project.md` to DEV-01 through DEV-05, public guidance and the study protocol. Assisted entry, existing-tool adaptation and maintainable handover are implemented as procedures and one bounded Met adaptation. Independent novice use, broader reuse, comparative method benefit and maintenance over time are not established by this audit.

No additional universal domain abstraction was justified. The new shared component addresses an observed native-control boundary; the collection and investigation schemas stay separate. The importer, registry, raw snapshot, derived records and existing exports retain their established content and identity. Broader extraction remains dependent on a contrasting domain case.

## Execution results

| Check | Result | Evidence |
|---|---|---|
| Production type/lint | Passed, 49 files | `production-check.log` |
| Production unit suite | Passed, 51 tests in six files | `production-unit.log` |
| Dataset regeneration and oracle | Passed, 60 records and 11 query expectations | `production-data.log` |
| Production build | Passed | `production-build.log` and `final-production-build.log` |
| Full production browser suite | Passed, 40 tests | `production-browser.log` and `production-browser/` |
| Fresh source installation | New `npm ci`, then code/data checks, 51 unit tests and build passed | `fresh-*.log`, `execution.json` |
| Final source alignment | All 163 files match the final source manifest; only documentation changed after the initial full run | `fresh-final-source.json` |
| Final documentation verification | Both builds passed; all three affected documentation browser tests passed | `final-*-build.log`, `final-documentation-browser.log` |
| Reproduced output | All 42 built files match byte for byte | `reproduced-build.json` |
| Deliberate data drift | Extra bytes in records, checksum and field evidence each rejected; 68 protected data/importer files unchanged against the pre-audit capture | `data-probes/data-result.json` and individual logs |
| Git checkout conversion | Importer, records, checksum, field evidence and representative raw record keep exact bytes with `core.autocrlf=true` | `checkout-result.json` |
| Historical version 2 | Previous actual download opens with original stored bytes and exports identical values | `production-operation.json`, `reopened-existing-v2.json` |
| Actual two-tab recovery | Beforeunload warning observed; cancelling keeps local text, external storage stays intact, local recovery export succeeds | `production-operation.json`, `conflict-local-export.json` |
| Served build identity | All 11 observed same-origin resources match the final built files | `production-operation.json` |
| Source navigation | 133 relative links checked across maintained Markdown; new assessment resolves after this run is promoted | `source-links.json` |
| Earlier evidence preservation | All 62 provenance-run and 20 session-closeout files listed in their retained manifests unchanged | `historical-evidence.json` |

The fresh directory was assembled only from Git-visible source files, without copying dependencies, generated output or historical run evidence. It is a reproduction in an isolated directory by the integrating agent, not an independent researcher/developer trial. The checkout conversion probe separately tests Git's byte-handling rules. CI workflow execution itself was not triggered; equivalent gates ran locally on Windows, and an actual Linux CI run remains a subsequent execution context.

The UI agent operated the normal export/reopen tutorial, rejected and cancelled imports, cancelled editor navigation, keyboard selection, route focus, source-dialog Escape/focus return, pointer text selection and 320px reflow. Their pre-fix downloads, post-fix operated observations and source identities are retained under `operated-ui/`. Initial scratch checks needed test-harness corrections for JSON fixture loading, an expected status message and a select locator. Those were corrected before the final production run. The final full suite had no failure. Desktop homepage and comparison screenshots were inspected by the integrating agent.

## Remaining acceptance

Native browser zoom, screen-reader tasks, representative researcher interpretation, independent novice use, a contrasting real-domain adaptation, a measured method comparison and maintenance over time remain unperformed. CSS text enlargement and automated accessibility checks do not replace those observations. Sequential storage-conflict protection is not atomic collaboration. Exact snapshot matching is not an archive migration service. The current increment is locally verified and unreleased.

The next bounded task remains an observed researcher episode: formulate a question, select and compare original catalogue evidence, inspect Source, record an interpretation and unresolved question, export and reopen. Preserve the participant's explanation, assistance, errors and source identity before changing the workflow again.
