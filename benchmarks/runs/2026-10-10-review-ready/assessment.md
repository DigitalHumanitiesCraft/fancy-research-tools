# Review-ready candidate, 2026-10-10

The candidate adds source-anchored annotation of two archived National Hurricane Center discussions, a project overview and a gallery of runnable tools. It keeps documentation navigation visible and replaces unequal example links in the project header with Overview, Tools and Documentation. The operator requested the implementation, supplied navigation feedback and subsequently requested Markdown refactoring.

## Identified state

`../2026-10-10-review-ready-source.json` identifies the working source, including uncommitted files. The application remains an unreleased development version. No commit, push, deployment or external contact is part of this run. `baseline-source-manifest.json` identifies the preceding repository audit state, and `change-inventory.json` records the source delta. Generated output has a separate build manifest in the reproduction evidence.

The final documentation records current acceptance in Testing and next work in Plan. Data owns schema, source and review semantics. Specification owns observable requirements, Design owns interaction decisions, and public guides give concrete tasks. Historical run records retain their dated scope. The annotation material README now links its canonical notebook contract instead of maintaining another schema description.

## Implementation and findings

The Met snapshot and importer remain unchanged. The separate NOAA/NHC pipeline preserves full bulletin text, issue strings, printed attribution, original URLs and rights evidence. Notebook validation binds annotations to exact quotation offsets and distinguishes declared creators from separately recorded source-fit reviews. The source and categories are a bounded research-task proposal, with meteorological and scholarly fitness awaiting human assessment.

Independent operation exposed Chromium's lack of native Shift+Arrow selection in the readonly textarea. A bounded keyboard fallback implements documented selection and source scrolling while preserving the immutable source and native copy interaction. A further operated review found that temporary edits removed a review even after the original content was restored. The correction follows final committed content while respecting deliberately removed or replaced review assertions. Downloaded-output regression cases cover these outcomes.

The annotation tool reuses exact author-text binding and preservation requirements. Its domain model, source extraction, recovery controller and interface remain separate from Met investigations. The adaptation supports selective reuse; it does not establish a universal plugin interface.

## Executed checks

| Check | Result and retained evidence |
|---|---|
| TypeScript and Biome | Passed. `integrated-checks/check.log` records the integrated gate. |
| Frozen data | Both data gates passed. NOAA source, rights and derived-file tamper probes remain under `source-and-gallery-review/`. |
| Unit tests | 87 passed in `integrated-checks/unit.log`. |
| Production build | Passed in `integrated-checks/build.log`. Final documentation and gallery CSS were rebuilt for the source capture. |
| Browser regression | 50 passed in `integrated-checks/browser.log`, including actual exports, reopening, invalid/cancelled input, storage protection and the annotation review regression. |
| Documentation and gallery follow-up | Four cases passed again after the gallery CSS layer order was fixed. They cover generated routes/anchors, subpath delivery, preview loading, tool return links, narrow reflow and keyboard table scrolling. |
| Markdown references | `review-ready-markdown-check.json` records 27 maintained Markdown files and 153 local links/heading references without a missing target. |
| Native browser zoom | `native-zoom-current/summary.json` records eight passed tasks on overview, documentation, gallery and annotation at 200% and 400%. Real notebook downloads and source-return checks are retained. Earlier route tasks and the pilot navigation repair remain in `native-zoom-existing/`. |
| Source and evidence preservation | `preservation/results.json` verifies 68 Met files and its importer, plus 97 prior audit, 62 project-decision and 20 closeout evidence files. The older closeout assessment was absent from its original manifest and is outside that historical hash claim. |
| Separate reproduction | `independent-reproduction/` retains fresh installation, code/data/unit/build results and actual annotation plus Met v1/v2 export/reopening. The final refresh identifies only later documentation/CSS changes and compares generated output with the final root build. |

Browser checks used isolated contexts. Native zoom used headless Chromium's actual `chrome.tabs.setZoom`, with reported zoom factor, CSS viewport and native viewport captures. It was not CSS scaling or CDP page-scale emulation. The observed 1280×900 browser viewport produced 320×225 CSS pixels at 400%.

The reproduction agent had contributed to source/model implementation and inherited conversation context. It followed repository instructions in an isolated copy, with no additional application instructions, but the episode is not blinded or independent researcher evidence. Its preview command needed explicit invocation of the repository's Vite command because the PowerShell npm invocation dropped supplied port flags. Original inputs and the initially unsuccessful integration snapshot remain available.

## Retained failures and limits

The first independent snapshot caught formatting and a link to Markdown outside the publication allowlist while integration was still underway. Root corrected formatting and used an explicit repository reference for the unpublished material record. A later root formatting gate caught a newly added test before the complete successful suite. Initial browser-harness navigation/capture failures remain distinguishable from application findings. Evidence directories retain failed attempts and their corrections.

Source text, interpretation and review assertions remain separate. Matching hashes or quotation offsets establish agreement with the frozen material. Declared identity and a source-fit review do not authenticate a person or validate a weather outcome. Unsaved annotation forms receive navigation protection but have no browser-crash recovery. Sequential storage-conflict detection does not provide atomic collaborative editing.

Actual screen-reader operation and speech output were not observed. Operator UI feedback, representative researcher assessment, independent novice development, comparative method benefit and maintenance over time remain open. The next task is to inspect the overview and gallery, operate both workflows and report concrete friction.
